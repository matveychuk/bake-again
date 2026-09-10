'use client';

import { useState } from 'react';
import { BakeCheckbox } from '@/components/ui/bake-checkbox';
import type { StructuredIngredient, StructuredIngredientSection } from '@/content/recipes/source-recipe.types';
import styles from './inventory-recipe-detail.module.css';

export function RecipeIngredientChecklist({
  sections,
  amountFor = (ingredient) => ingredient.amount,
}: {
  sections: StructuredIngredientSection[];
  amountFor?: (ingredient: StructuredIngredient) => string;
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
              return (
                <li className={checked ? styles.ingredientChecked : undefined} key={ingredient.id}>
                  <BakeCheckbox
                    aria-label={`Mark ${ingredient.name} as prepared`}
                    checked={checked}
                    onCheckedChange={(value) => toggle(ingredient.id, value === true)}
                  />
                  <div>
                    <span>{ingredient.name}{ingredient.optional ? ' · optional' : ''}</span>
                    {ingredient.note && <small>{ingredient.note}</small>}
                  </div>
                  <strong>{amountFor(ingredient)}</strong>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
