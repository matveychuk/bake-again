'use client';

import { useState } from 'react';
import { BakeCheckbox } from '@/components/ui/bake-checkbox';
import type { StructuredIngredient, StructuredIngredientSection } from '@/content/recipes/source-recipe.types';
import { formatQuantity } from '@/lib/i18n/format';
import styles from './inventory-recipe-detail.module.css';

export function RecipeIngredientChecklist({
  sections,
  amountFor = (ingredient) => ({
    primary: formatQuantity('en', ingredient.quantity.base ?? ingredient.quantity.equivalent ?? null),
    secondary: ingredient.quantity.equivalent && ingredient.quantity.base
      ? formatQuantity('en', ingredient.quantity.equivalent)
      : undefined,
  }),
  labelFor = (ingredient) => `Mark ${ingredient.name} as prepared`,
}: {
  sections: StructuredIngredientSection[];
  amountFor?: (ingredient: StructuredIngredient) => {
    primary: string;
    secondary?: string;
  };
  labelFor?: (ingredient: StructuredIngredient) => string;
}) {
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

  const toggle = (id: string, checked: boolean) => {
    setCheckedIds((current) => {
      const next = new Set(current);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  return (
    <div className={styles.ingredientSections}>
      {sections.map((section) => (
        <section className={styles.ingredientSection} key={section.id}>
          <h3>{section.title}</h3>
          <ul className={styles.ingredients}>
            {section.ingredients.map((ingredient) => {
              const checked = checkedIds.has(ingredient.id);
              const amounts = amountFor(ingredient);
              return (
                <li className={checked ? styles.ingredientChecked : undefined} key={ingredient.id}>
                  <BakeCheckbox
                    aria-label={labelFor(ingredient)}
                    checked={checked}
                    onCheckedChange={(value) => toggle(ingredient.id, value === true)}
                  />
                  <div className={styles.ingredientCopy}>
                    <span>{ingredient.name}{ingredient.optional ? ' · optional' : ''}</span>
                    {ingredient.note && <small>{ingredient.note}</small>}
                  </div>
                  <div className={styles.ingredientAmounts}>
                    <strong>{amounts.primary}</strong>
                    {amounts.secondary && <span>{amounts.secondary}</span>}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
