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
}: {
  sections: StructuredIngredientSection[];
  amountFor?: (ingredient: StructuredIngredient) => {
    primary: string;
    secondary?: string;
  };
}) {
  return (
    <div className={styles.ingredientSections}>
      {sections.map((section) => (
        <section className={styles.ingredientSection} key={section.id}>
          <h3>{section.title}</h3>
          <ul className={styles.ingredients}>
            {section.ingredients.map((ingredient) => {
              const amounts = amountFor(ingredient);
              return (
                <li key={ingredient.id}>
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
