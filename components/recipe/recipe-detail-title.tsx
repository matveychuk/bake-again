import type { LocalizedText } from '@/content/recipes/recipe.types';
import { getRecipeDetailTitleParts } from '@/content/recipes/catalog-locales';
import styles from './recipe-detail-title.module.css';

export function RecipeDetailTitle({
  className,
  locale,
  title,
}: {
  className?: string;
  locale: keyof LocalizedText;
  title: string;
}) {
  const { glutenFreeLabel, recipeName } = getRecipeDetailTitleParts(title, locale);

  return (
    <h1 aria-label={title} className={`${styles.title} ${className ?? ''}`}>
      <span aria-hidden="true">{glutenFreeLabel}</span>{' '}
      <em aria-hidden="true">{recipeName}</em>
    </h1>
  );
}
