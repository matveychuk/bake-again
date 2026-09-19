import type { StructuredIngredient, StructuredIngredientSection } from '@/content/recipes/source-recipe.types';
import { formatQuantity } from '@/lib/i18n/format';
import type { AppLocale } from '@/lib/i18n/config';
import { RecipeIngredientList } from './recipe-ingredient-list';
import styles from './recipe-ingredient-checklist.module.css';

export function RecipeIngredientChecklist({
  sections,
  locale = 'en',
  amountFor = (ingredient) => ({
    primary: formatQuantity(locale, ingredient.quantity.base ?? ingredient.quantity.equivalent ?? null),
    secondary: ingredient.quantity.equivalent && ingredient.quantity.base
      ? formatQuantity(locale, ingredient.quantity.equivalent)
      : undefined,
  }),
}: {
  sections: StructuredIngredientSection[];
  locale?: AppLocale;
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
          <RecipeIngredientList
            locale={locale}
            items={section.ingredients.map((ingredient) => ({
              id: ingredient.id,
              name: ingredient.name,
              note: ingredient.note,
              optional: ingredient.optional,
              ...amountFor(ingredient),
            }))}
          />
        </section>
      ))}
    </div>
  );
}
