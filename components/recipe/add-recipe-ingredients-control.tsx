'use client';

import { ShoppingBag } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { RecipeDraft } from '@/content/recipes/recipe.types';
import type { AppLocale } from '@/lib/i18n/config';
import { getUiMessages } from '@/lib/i18n/messages';
import { formatQuantity } from '@/lib/i18n/format';
import { localeShoppingListPath } from '@/lib/i18n/routes';
import { addShoppingIngredients } from '@/lib/persistence/shopping';
import { useRecipeConfiguration } from '@/app/recipes/napoleon-cake/recipe-configuration';
import styles from './add-recipe-ingredients-control.module.css';

export function AddRecipeIngredientsControl({ recipe, locale, className, disabled = false, triggerLabel }: { recipe: RecipeDraft; locale: AppLocale; className?: string; disabled?: boolean; triggerLabel?: string }) {
  const messages = getUiMessages(locale).personal;
  const choiceLines = useMemo(() => recipe.ingredientSections.flatMap((section) => section.lines.filter((line) => line.choose === 1).map((line) => line.id)), [recipe]);
  const [choices, setChoices] = useState<Record<string, string>>({});
  const [open, setOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const complete = choiceLines.every((id) => choices[id]);

  function addIngredients() {
    if (!complete) return;
    const inputs = recipe.ingredientSections.flatMap((section) => section.lines.map((line) => {
      const selectedIngredientId = line.choose === 1 ? choices[line.id] : line.options[0].ingredientId;
      return {
        ingredientId: selectedIngredientId,
        quantity: line.amount,
        source: { recipeId: recipe.id, recipeVersionId: recipe.versionId, ingredientLineId: line.id, sectionId: section.id, selectedIngredientId },
      };
    }));
    addShoppingIngredients(inputs);
    setAdded(true);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger aria-description={disabled ? messages.testedBaseOnly : undefined} className={`${styles.trigger} ${className ?? ''}`} disabled={disabled} title={disabled ? messages.testedBaseOnly : undefined}>
        <ShoppingBag aria-hidden="true" size={17} /> {triggerLabel ?? messages.addIngredients}
      </DialogTrigger>
      {added && <p aria-live="polite" className={styles.confirmation}>{messages.addedToList} <a href={localeShoppingListPath(locale)}>{messages.openShoppingList}</a></p>}
      <DialogContent className={styles.dialog}>
        <DialogHeader><DialogTitle>{messages.reviewIngredients}</DialogTitle><DialogDescription>{recipe.title[locale]}. {choiceLines.length > 0 ? messages.chooseOptionBeforeAdding : ''}</DialogDescription></DialogHeader>
        {recipe.ingredientSections.map((section) => <section className={styles.section} key={section.id}>
          <h3>{section.title[locale]}</h3>
          {section.lines.map((line) => <div className={styles.line} key={line.id}>
            <strong>{line.choose === 1 ? messages.chooseOne : line.options[0].name[locale]}</strong>
            <small>{formatQuantity(locale, line.amount)}{line.qualifier ? ` · ${line.qualifier[locale]}` : ''}</small>
            {line.choose === 1 && <div className={styles.options} role="radiogroup" aria-label={`${messages.chooseOne}: ${line.options.map((option) => option.name[locale]).join(', ')}`}>
              {line.options.map((option) => <label className={styles.option} key={option.ingredientId}>
                <input checked={choices[line.id] === option.ingredientId} name={`${recipe.id}-${line.id}`} onChange={() => setChoices((current) => ({ ...current, [line.id]: option.ingredientId }))} type="radio" value={option.ingredientId} />
                {option.name[locale]}
              </label>)}
            </div>}
          </div>)}
        </section>)}
        {!complete && <output className={styles.required}>{messages.chooseOptionBeforeAdding}</output>}
        <div className={styles.footer}><button className={styles.submit} disabled={!complete} onClick={addIngredients} type="button">{messages.addToList}</button></div>
      </DialogContent>
    </Dialog>
  );
}

/** Keeps the configuration-context hook inside a client component. */
export function NapoleonIngredientsControl({ recipe, locale, className, triggerLabel }: { recipe: RecipeDraft; locale: AppLocale; className?: string; triggerLabel?: string }) {
  const { isExactBase } = useRecipeConfiguration();
  return <AddRecipeIngredientsControl className={className} disabled={!isExactBase} locale={locale} recipe={recipe} triggerLabel={triggerLabel} />;
}
