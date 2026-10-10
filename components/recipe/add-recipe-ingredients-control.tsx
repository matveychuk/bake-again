'use client';
import { requestPersonalAction } from '@/lib/personal/action-gate';

import { Button } from '@/components/ui/button';

import { trackEvent } from '@/lib/analytics/umami';
import { Check, ShoppingBag, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from '@/components/ui/drawer';
import { BakeCheckbox } from '@/components/ui/bake-checkbox';
import type { RecipeDraft } from '@/content/recipes/recipe.types';
import type { StructuredIngredientSection } from '@/content/recipes/source-recipe.types';
import type { AppLocale } from '@/lib/i18n/config';
import { getUiMessages } from '@/lib/i18n/messages';
import { formatQuantity } from '@/lib/i18n/format';
import { scaleStructuredQuantity } from '@/content/recipes/inventory-calculation';
import { localeShoppingListPath } from '@/lib/i18n/routes';
import {
  addShoppingIngredients,
  persistShopping,
  readShopping,
  subscribeToShopping,
  type ShoppingV1,
} from '@/lib/persistence/shopping';
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
  quantity: {
    base: import('@/content/recipes/recipe.types').Quantity | null;
    shopping: {
      mode: 'base' | 'nameOnly';
      increment?: number;
      rounding?: 'up';
      defaultSelected?: boolean;
    };
  };
  choose?: 1;
  notes: string[];
};
type ShoppingRecipe = {
  id: string;
  versionId: string;
  title: string;
  configurationKey: string;
  ingredientSections: Array<{
    id: string;
    title: string;
    lines: ShoppingLine[];
  }>;
};

function normalizeRecipe(
  recipe: RecipeDraft | SourceShoppingRecipe,
  locale: AppLocale,
  scaleFactor: number,
  configurationKey: string,
): ShoppingRecipe {
  if ('schemaVersion' in recipe)
    return {
      id: recipe.id,
      versionId: recipe.versionId,
      title: recipe.title[locale],
      configurationKey,
      ingredientSections: recipe.ingredientSections.map((section) => ({
        id: section.id,
        title: section.title[locale],
        lines: section.lines.map((line) => ({
          id: line.id,
          options: line.options.map((option) => ({
            ingredientId: option.ingredientId,
            name: option.name[locale],
          })),
          quantity: {
            ...line.quantity,
            base: scaleStructuredQuantity(
              line.quantity.base,
              line.scaling?.kind === 'fixed' ? 1 : scaleFactor,
            ),
            equivalent: scaleStructuredQuantity(
              line.quantity.equivalent ?? null,
              line.scaling?.kind === 'fixed' ? 1 : scaleFactor,
            ),
          },
          choose: line.choose,
          notes: [line.condition?.[locale], line.qualifier?.[locale]].filter(
            (note): note is string => Boolean(note),
          ),
        })),
      })),
    };
  return {
    id: recipe.id,
    versionId: recipe.versionId,
    title: recipe.title,
    configurationKey,
    ingredientSections: recipe.ingredientSections.map((section) => ({
      id: section.id,
      title: section.title,
      lines: section.ingredients.map((ingredient) => ({
        id: ingredient.id,
        options: [{ ingredientId: ingredient.id, name: ingredient.name }],
        quantity: {
          ...ingredient.quantity,
          base: scaleStructuredQuantity(
            ingredient.quantity.base,
            ingredient.scaling === 'fixed' ? 1 : scaleFactor,
          ),
          equivalent: scaleStructuredQuantity(
            ingredient.quantity.equivalent ?? null,
            ingredient.scaling === 'fixed' ? 1 : scaleFactor,
          ),
        },
        notes: [ingredient.note].filter((note): note is string =>
          Boolean(note),
        ),
      })),
    })),
  };
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
            (source.configurationKey ?? 'base') === recipe.configurationKey &&
            recipeLineIds.has(source.ingredientLineId),
        )
        .map((source) => source.ingredientLineId),
    ),
  );
}

function sourceExists(
  state: ShoppingV1,
  source: {
    recipeId: string;
    recipeVersionId: string;
    ingredientLineId: string;
    configurationKey?: string;
    batchId?: string;
  },
) {
  return state.items.some((item) =>
    item.sources.some(
      (candidate) =>
        candidate.recipeId === source.recipeId &&
        candidate.recipeVersionId === source.recipeVersionId &&
        candidate.ingredientLineId === source.ingredientLineId &&
        (candidate.configurationKey ?? 'base') ===
          (source.configurationKey ?? 'base') &&
        candidate.batchId === source.batchId,
    ),
  );
}

export function AddRecipeIngredientsControl({
  recipe,
  locale,
  className,
  context,
  disabled = false,
  disabledReason,
  scaleFactor = 1,
  configurationKey = 'base',
}: {
  recipe: RecipeDraft | SourceShoppingRecipe;
  locale: AppLocale;
  className?: string;
  context?: string;
  disabled?: boolean;
  disabledReason?: string;
  scaleFactor?: number;
  configurationKey?: string;
}) {
  const messages = getUiMessages(locale).personal;
  const shoppingRecipe = useMemo(
    () => normalizeRecipe(recipe, locale, scaleFactor, configurationKey),
    [configurationKey, locale, recipe, scaleFactor],
  );
  const lines = useMemo(
    () =>
      shoppingRecipe.ingredientSections.flatMap((section) =>
        section.lines.map((line) => ({ line, sectionId: section.id })),
      ),
    [shoppingRecipe],
  );
  const defaultLineIds = useMemo(
    () =>
      new Set(
        lines
          .filter(
            ({ line }) => line.quantity.shopping.defaultSelected !== false,
          )
          .map(({ line }) => line.id),
      ),
    [lines],
  );
  const [choices, setChoices] = useState<Record<string, string>>({});
  const [selectedLineIds, setSelectedLineIds] =
    useState<Set<string>>(defaultLineIds);
  const [shoppingLineIds, setShoppingLineIds] = useState<Set<string>>(
    new Set(),
  );
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'remaining' | 'anotherBatch'>('remaining');
  const [draftMode, setDraftMode] = useState<
    'remaining' | 'anotherBatch' | null
  >(null);
  const [confirmation, setConfirmation] = useState<{
    count: number;
    before: ShoppingV1;
  } | null>(null);
  const [saveFailed, setSaveFailed] = useState(false);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const update = () =>
      setShoppingLineIds(
        recipeLineIdsInShoppingList(readShopping(), shoppingRecipe),
      );
    update();
    return subscribeToShopping(update);
  }, [shoppingRecipe]);

  const missingCount = lines.length - shoppingLineIds.size;
  const selectedCount = selectedLineIds.size;
  const needsChoice = lines.some(
    ({ line }) =>
      selectedLineIds.has(line.id) && line.choose === 1 && !choices[line.id],
  );
  const complete = selectedCount > 0 && !needsChoice;

  function restoreTriggerFocus() {
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  }

  function setDrawerOpen(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) restoreTriggerFocus();
  }

  function openDrawer(
    nextMode: 'remaining' | 'anotherBatch',
    trigger: HTMLButtonElement,
  ) {
    triggerRef.current = trigger;
    if (draftMode !== nextMode) {
      const eligible =
        nextMode === 'anotherBatch'
          ? defaultLineIds
          : new Set(
              [...defaultLineIds].filter((id) => !shoppingLineIds.has(id)),
            );
      setSelectedLineIds(eligible);
      setChoices({});
      setDraftMode(nextMode);
    }
    setMode(nextMode);
    setSaveFailed(false);
    setOpen(true);
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

  function selectEveryEligibleLine() {
    setSelectedLineIds(
      new Set(
        lines
          .filter(
            ({ line }) =>
              mode === 'anotherBatch' || !shoppingLineIds.has(line.id),
          )
          .map(({ line }) => line.id),
      ),
    );
  }

  function addIngredients() {
    if (!complete) return;
    const before = readShopping();
    const batchId =
      mode === 'anotherBatch' ? `batch-${Date.now().toString(36)}` : undefined;
    const inputs = lines
      .filter(
        ({ line }) =>
          selectedLineIds.has(line.id) &&
          (mode === 'anotherBatch' || !shoppingLineIds.has(line.id)),
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
            configurationKey:
              shoppingRecipe.configurationKey === 'base'
                ? undefined
                : shoppingRecipe.configurationKey,
            batchId,
          },
        };
      });
    addShoppingIngredients(inputs);
    const after = readShopping();
    const savedLineIds = recipeLineIdsInShoppingList(after, shoppingRecipe);
    const saved = inputs.every((input) => sourceExists(after, input.source));
    setShoppingLineIds(savedLineIds);
    if (!saved) {
      setSaveFailed(true);
      return;
    }
    if (inputs.length > 0)
      trackEvent('shopping_add', {
        recipe_id: shoppingRecipe.id,
        locale,
        count: inputs.length,
      });
    setConfirmation({ count: inputs.length, before });
    setDraftMode(null);
    setOpen(false);
    restoreTriggerFocus();
  }

  function undoAdd() {
    if (!confirmation) return;
    persistShopping(confirmation.before);
    setConfirmation(null);
  }

  return (
    <div className={styles.control}>
      <div className={styles.actions}>
        {shoppingLineIds.size > 0 && !disabled ? (
          <Button
            variant="outline"
            className={styles.inList}
            href={localeShoppingListPath(locale)}
          >
            <Check aria-hidden="true" size={17} />
            {messages.inShoppingList(shoppingLineIds.size)}
          </Button>
        ) : null}
        {!disabled ? (
          <Button
            className={`${styles.trigger} ${className ?? ''}`}
            onClick={(event) =>
              openDrawer(
                missingCount > 0 ? 'remaining' : 'anotherBatch',
                event.currentTarget,
              )
            }
            type="button"
          >
            <ShoppingBag aria-hidden="true" size={17} />
            {missingCount > 0
              ? messages.addIngredients
              : messages.addAnotherBatch}
          </Button>
        ) : (
          <Button
            className={`${styles.trigger} ${className ?? ''}`}
            disabled
            title={disabledReason ?? messages.testedBaseOnly}
            type="button"
          >
            <ShoppingBag aria-hidden="true" size={17} />
            {messages.addIngredients}
          </Button>
        )}
      </div>

      <Drawer open={open} onOpenChange={setDrawerOpen} swipeDirection="right">
        <DrawerContent className={styles.drawer} initialFocus={closeRef}>
          <header className={styles.header}>
            <div className={styles.heading}>
              <DrawerTitle className={styles.title}>
                {messages.reviewIngredients}
              </DrawerTitle>
              <p className={styles.context}>
                {context ?? `${shoppingRecipe.title} · 1×`}
              </p>
              <DrawerDescription className={styles.description}>
                {messages.reviewIngredientsDescription}
              </DrawerDescription>
            </div>
            <DrawerClose
              ref={closeRef}
              className={styles.close}
              aria-label={messages.close}
            >
              <X aria-hidden="true" size={20} />
            </DrawerClose>
          </header>
          <div className={styles.toolbar}>
            <button onClick={selectEveryEligibleLine} type="button">
              {messages.selectAll}
            </button>
            <button onClick={() => setSelectedLineIds(new Set())} type="button">
              {messages.clearSelection}
            </button>
          </div>
          <div className={styles.body}>
            {shoppingRecipe.ingredientSections.map((section) => (
              <section className={styles.section} key={section.id}>
                <h3>{section.title}</h3>
                {section.lines.map((line) => {
                  const inList =
                    mode === 'remaining' && shoppingLineIds.has(line.id);
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
                        {line.notes.map((note) => (
                          <small key={note}>{note}</small>
                        ))}
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
          </div>
          <footer className={styles.footer}>
            <Button
              className={styles.submit}
              disabled={!complete}
              onClick={() => requestPersonalAction(locale, addIngredients)}
              type="button"
            >
              {messages.addSelected(selectedCount)}
            </Button>
          </footer>
        </DrawerContent>
      </Drawer>

      {confirmation ? (
        <div aria-live="polite" className={styles.confirmation}>
          <span>{messages.addedCount(confirmation.count)}</span>
          <a href={localeShoppingListPath(locale)}>
            {messages.openShoppingList}
          </a>
          <button onClick={undoAdd} type="button">
            {messages.undo}
          </button>
        </div>
      ) : null}
    </div>
  );
}
