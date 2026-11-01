import { getRecipe } from './registry.ts';
import type { AppLocale } from '../../lib/i18n/config.ts';
export type CreamOptionCopy = { title: string; description: string };
export const reusableCreamRecipeIds = [
  'mascarpone-whipped-cream',
  'vanilla-egg-custard',
  'eggless-vanilla-custard',
  'vanilla-buttercream',
  'sour-cream',
  'lemon-cream-cheese',
] as const;

export function isReusableCreamRecipeId(
  recipeId: string,
): recipeId is (typeof reusableCreamRecipeIds)[number] {
  return reusableCreamRecipeIds.some((candidate) => candidate === recipeId);
}

export function getCreamOptionCopy(
  recipeId: string,
  locale: AppLocale,
): CreamOptionCopy {
  const recipe = getRecipe(recipeId);
  return (
    recipe?.creamOption?.[locale] ?? {
      title: recipe?.discovery.cardTitle[locale] ?? recipeId,
      description: recipe?.summary[locale] ?? '',
    }
  );
}
