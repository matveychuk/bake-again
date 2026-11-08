import type {
  StructuredIngredient,
  StructuredIngredientSection,
} from '@/content/recipes/localized-recipe.types';
import { formatQuantity } from '@/lib/i18n/format';
import type { AppLocale } from '@/lib/i18n/config';
import { cn } from '@/lib/utils';
import { RecipeIngredientList } from './recipe-ingredient-list';
import styles from './recipe-ingredient-checklist.module.css';

export function RecipeIngredientChecklist({
  sections,
  className,
  locale = 'en',
  hideSingleSectionTitle = false,
  amountFor = (ingredient) => {
    const quantity =
      ingredient.quantity.base ?? ingredient.quantity.equivalent ?? null;
    return {
      primary:
        quantity || !ingredient.note
          ? formatQuantity(locale, quantity)
          : undefined,
      secondary:
        ingredient.quantity.equivalent && ingredient.quantity.base
          ? formatQuantity(locale, ingredient.quantity.equivalent)
          : undefined,
    };
  },
}: {
  sections: StructuredIngredientSection[];
  className?: string;
  locale?: AppLocale;
  hideSingleSectionTitle?: boolean;
  amountFor?: (ingredient: StructuredIngredient) => {
    primary?: string;
    secondary?: string;
  };
}) {
  return (
    <div className={cn(styles.ingredientSections, className)}>
      {sections.map((section) => (
        <section className={styles.ingredientSection} key={section.id}>
          {(!hideSingleSectionTitle || sections.length > 1) && (
            <h3>{section.title}</h3>
          )}
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
