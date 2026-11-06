import { recipes } from './registry.ts';
import type { LocalizedText } from './recipe.types.ts';
export type CatalogLocaleCopy = {
  title: LocalizedText;
  category: LocalizedText;
  summary: LocalizedText;
  alt: LocalizedText;
  publicationNote?: LocalizedText;
};
/** Derived editorial roles from the same canonical recipe. */
export const recipeDetailTitles: Record<string, LocalizedText> =
  Object.fromEntries(recipes.map((recipe) => [recipe.id, recipe.title]));
export type RecipeDetailTitleParts = {
  glutenFreeLabel: string;
  recipeName: string;
};

/**
 * Keeps the stored title natural in each language while giving recipe pages a shared
 * two-line editorial treatment: the gluten-free message first, then the dish name.
 */
export function getRecipeDetailTitleParts(
  title: string,
  locale: keyof LocalizedText,
): RecipeDetailTitleParts {
  if (locale === 'es') {
    const suffix = ' sin gluten';
    const recipeName = title.toLocaleLowerCase('es').endsWith(suffix)
      ? title.slice(0, -suffix.length)
      : title;

    return { glutenFreeLabel: 'Sin gluten', recipeName };
  }

  const firstSpace = title.indexOf(' ');
  if (firstSpace === -1) {
    return {
      glutenFreeLabel: locale === 'uk' ? 'Безглютеновий' : 'Gluten-free',
      recipeName: title,
    };
  }

  return {
    glutenFreeLabel: title.slice(0, firstSpace),
    recipeName: title.slice(firstSpace + 1),
  };
}

export const catalogLocaleCopy: Record<string, CatalogLocaleCopy> =
  Object.fromEntries(
    recipes.map((recipe) => [
      recipe.id,
      {
        title: recipe.discovery.cardTitle,
        category: recipe.discovery.category,
        summary: recipe.summary,
        alt:
          recipe.media.find((item) => item.id === recipe.heroMediaId)
            ?.heroAlt ??
          recipe.media.find((item) => item.id === recipe.heroMediaId)?.alt ??
          recipe.summary,
        publicationNote: recipe.discovery.publicationNote,
      },
    ]),
  );
