'use client';

import { Check, ShoppingBag } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { BakeCheckbox } from '@/components/ui/bake-checkbox';
import type { RecipeDraft } from '@/content/recipes/recipe.types';
import type { StructuredIngredientSection } from '@/content/recipes/source-recipe.types';
import type { AppLocale } from '@/lib/i18n/config';
import { getUiMessages } from '@/lib/i18n/messages';
import { formatQuantity } from '@/lib/i18n/format';
import { localeShoppingListPath } from '@/lib/i18n/routes';
import {
  addShoppingIngredients,
  readShopping,
  subscribeToShopping,
  type ShoppingV1,
} from '@/lib/persistence/shopping';
import { useRecipeConfiguration } from '@/app/recipes/napoleon-cake/recipe-configuration';
import styles from './add-recipe-ingredients-control.module.css';

export type SourceShoppingRecipe = {
  id: string;
  versionId: string;
  title: string;
  ingredientSections: StructuredIngredientSection[];
};

type ShoppingLine = {
  id: string;
  options: Array<{ ingredientId: string; name: string }>;
  quantity: { base: import('@/content/recipes/recipe.types').Quantity | null; shopping: { mode: 'base' | 'nameOnly'; increment?: number; rounding?: 'up' } };
  choose?: 1;
  qualifier?: string;
};
type ShoppingRecipe = { id: string; versionId: string; title: string; ingredientSections: Array<{ id: string; title: string; lines: ShoppingLine[] }> };

function normalizeRecipe(recipe: RecipeDraft | SourceShoppingRecipe, locale: AppLocale): ShoppingRecipe {
  if ('schemaVersion' in recipe) return {
    id: recipe.id, versionId: recipe.versionId, title: recipe.title[locale],
    ingredientSections: recipe.ingredientSections.map((section) => ({
      id: section.id,
      title: section.title[locale],
      lines: section.lines.map((line) => ({
        id: line.id,
        options: line.options.map((option) => ({ ingredientId: option.ingredientId, name: option.name[locale] })),
        quantity: line.quantity,
        choose: line.choose,
        qualifier: line.qualifier?.[locale],
      })),
    })),
  };
  return { id: recipe.id, versionId: recipe.versionId, title: recipe.title, ingredientSections: recipe.ingredientSections.map((section) => ({ id: section.id, title: section.title, lines: section.ingredients.map((ingredient) => ({ id: ingredient.id, options: [{ ingredientId: ingredient.id, name: ingredient.name }], quantity: ingredient.quantity })) })) };
}

function recipeLineIdsInShoppingList(
  state: ShoppingV1,
  recipe: ShoppingRecipe,
): Set<string> {
  const recipeLineIds = new Set(
    recipe.ingredientSections.flatMap((section) =>
      section.lines.map((line) => line.id),
    ),
  );
  return new Set(
    state.items.flatMap((item) =>
      item.sources
        .filter(
          (source) =>
            source.recipeId === recipe.id &&
            source.recipeVersionId === recipe.versionId &&
            recipeLineIds.has(source.ingredientLineId),
        )
        .map((source) => source.ingredientLineId),
    ),
  );
}

export function AddRecipeIngredientsControl({
  recipe,
  locale,
  className,
  disabled = false,
}: {
  recipe: RecipeDraft | SourceShoppingRecipe;
  locale: AppLocale;
  className?: string;
  disabled?: boolean;
}) {
  const messages = getUiMessages(locale).personal;
  const shoppingRecipe = useMemo(() => normalizeRecipe(recipe, locale), [recipe, locale]);
  const lines = useMemo(
    () =>
      shoppingRecipe.ingredientSections.flatMap((section) =>
        section.lines.map((line) => ({ line, sectionId: section.id })),
      ),
    [shoppingRecipe],
  );
  const [choices, setChoices] = useState<Record<string, string>>({});
  const [selectedLineIds, setSelectedLineIds] = useState<Set<string>>(
    () => new Set(lines.map(({ line }) => line.id)),
  );
  const [shoppingLineIds, setShoppingLineIds] = useState<Set<string>>(
    new Set(),
  );
  const [open, setOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);

  useEffect(() => {
    const update = () =>
      setShoppingLineIds(recipeLineIdsInShoppingList(readShopping(), shoppingRecipe));
    update();
    return subscribeToShopping(update);
  }, [shoppingRecipe]);

  const selectedCount = selectedLineIds.size;
  const missingCount = lines.length - shoppingLineIds.size;
  const needsChoice = lines.some(
    ({ line }) =>
      selectedLineIds.has(line.id) && line.choose === 1 && !choices[line.id],
  );
  const complete = selectedCount > 0 && !needsChoice;

  function setDialogOpen(nextOpen: boolean) {
    if (nextOpen) {
      const currentShoppingLineIds = recipeLineIdsInShoppingList(
        readShopping(),
        shoppingRecipe,
      );
      setShoppingLineIds(currentShoppingLineIds);
      setSelectedLineIds(
        new Set(
          lines
            .filter(({ line }) => !currentShoppingLineIds.has(line.id))
            .map(({ line }) => line.id),
        ),
      );
      setAdded(false);
      setSaveFailed(false);
    }
    setOpen(nextOpen);
  }

  function toggleLine(id: string, checked: boolean) {
    setSelectedLineIds((current) => {
      const next = new Set(current);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
    setSaveFailed(false);
  }

  function addIngredients() {
    if (!complete) return;

    const inputs = lines
      .filter(
        ({ line }) =>
          selectedLineIds.has(line.id) && !shoppingLineIds.has(line.id),
      )
      .map(({ line, sectionId }) => {
        const selectedIngredientId =
          line.choose === 1 ? choices[line.id] : line.options[0].ingredientId;
        return {
          ingredientId: selectedIngredientId,
          quantity: line.quantity.base,
          shopping: line.quantity.shopping,
          source: {
            recipeId: shoppingRecipe.id,
            recipeVersionId: shoppingRecipe.versionId,
            ingredientLineId: line.id,
            sectionId,
            selectedIngredientId,
          },
        };
      });

    addShoppingIngredients(inputs);
    const savedLineIds = recipeLineIdsInShoppingList(readShopping(), shoppingRecipe);
    const saved = inputs.every((input) =>
      savedLineIds.has(input.source.ingredientLineId),
    );
    setShoppingLineIds(savedLineIds);

    if (!saved) {
      setSaveFailed(true);
      return;
    }

    setAdded(true);
    setOpen(false);
  }

  const trigger = (
    <DialogTrigger
      aria-description={disabled ? messages.testedBaseOnly : undefined}
      className={`${styles.trigger} ${className ?? ''}`}
      disabled={disabled}
      title={disabled ? messages.testedBaseOnly : undefined}
    >
      <ShoppingBag aria-hidden="true" size={17} />
      {messages.addIngredients}
    </DialogTrigger>
  );

  return (
    <div className={styles.control}>
      <div className={styles.actions}>
        {shoppingLineIds.size > 0 && !disabled ? (
          <a className={styles.inList} href={localeShoppingListPath(locale)}>
            <Check aria-hidden="true" size={17} />
            {messages.inShoppingList(shoppingLineIds.size)}
          </a>
        ) : null}
        <Dialog open={open} onOpenChange={setDialogOpen}>
          {missingCount > 0 || disabled ? trigger : null}
          <DialogContent className={styles.dialog}>
            <DialogHeader>
              <DialogTitle>{messages.reviewIngredients}</DialogTitle>
              <DialogDescription>
                {shoppingRecipe.title}. {messages.reviewIngredientsDescription}
              </DialogDescription>
            </DialogHeader>

            <div className={styles.selectionSummary} aria-live="polite">
              {messages.selectedIngredients(selectedCount)}
            </div>

            {shoppingRecipe.ingredientSections.map((section) => (
              <section className={styles.section} key={section.id}>
                <h3>{section.title}</h3>
                {section.lines.map((line) => {
                  const inList = shoppingLineIds.has(line.id);
                  const selected = selectedLineIds.has(line.id);
                  const ingredientName = line.options
                    .map((option) => option.name)
                    .join(' / ');
                  const checkboxId = `shopping-${shoppingRecipe.id}-${line.id}`;

                  return (
                    <div
                      className={styles.line}
                      data-in-list={inList || undefined}
                      key={line.id}
                    >
                      <BakeCheckbox
                        aria-label={
                          inList
                            ? `${ingredientName}. ${messages.alreadyInShoppingList}`
                            : messages.selectIngredient(ingredientName)
                        }
                        checked={inList || selected}
                        disabled={inList}
                        id={checkboxId}
                        onCheckedChange={(value) =>
                          toggleLine(line.id, value === true)
                        }
                      />
                      <label className={styles.lineCopy} htmlFor={checkboxId}>
                        <strong>
                          {line.choose === 1
                            ? messages.chooseOne
                            : ingredientName}
                        </strong>
                        {line.qualifier ? (
                          <small>{line.qualifier}</small>
                        ) : null}
                        {inList ? (
                          <small>{messages.alreadyInShoppingList}</small>
                        ) : null}
                      </label>
                      <span className={styles.amount}>
                        {formatQuantity(locale, line.quantity.base)}
                      </span>
                      {line.choose === 1 && selected && !inList ? (
                        <div
                          className={styles.options}
                          role="radiogroup"
                          aria-label={`${messages.chooseOne}: ${ingredientName}`}
                        >
                          {line.options.map((option) => (
                            <label
                              className={styles.option}
                              key={option.ingredientId}
                            >
                              <input
                                checked={
                                  choices[line.id] === option.ingredientId
                                }
                                name={`${shoppingRecipe.id}-${line.id}`}
                                onChange={() =>
                                  setChoices((current) => ({
                                    ...current,
                                    [line.id]: option.ingredientId,
                                  }))
                                }
                                type="radio"
                                value={option.ingredientId}
                              />
                              {option.name}
                            </label>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </section>
            ))}

            {!complete ? (
              <output className={styles.required}>
                {selectedCount === 0
                  ? messages.selectAtLeastOne
                  : messages.chooseOptionBeforeAdding}
              </output>
            ) : null}
            {saveFailed ? (
              <p className={styles.error} role="alert">
                {messages.shoppingSaveFailed}
              </p>
            ) : null}
            <div className={styles.footer}>
              <span>{messages.selectedIngredients(selectedCount)}</span>
              <button
                className={styles.submit}
                disabled={!complete}
                onClick={addIngredients}
                type="button"
              >
                {messages.addSelected(selectedCount)}
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {added ? (
        <p aria-live="polite" className={styles.confirmation}>
          {messages.addedToList}{' '}
          <a href={localeShoppingListPath(locale)}>
            {messages.openShoppingList}
          </a>
        </p>
      ) : null}
    </div>
  );
}

/** Keeps the configuration-context hook inside a client component. */
export function NapoleonIngredientsControl({
  recipe,
  locale,
  className,
}: {
  recipe: RecipeDraft;
  locale: AppLocale;
  className?: string;
}) {
  const { isExactBase } = useRecipeConfiguration();
  return (
    <AddRecipeIngredientsControl
      className={className}
      disabled={!isExactBase}
      locale={locale}
      recipe={recipe}
    />
  );
}
