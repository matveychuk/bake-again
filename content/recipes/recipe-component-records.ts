import type { AppLocale } from '../../lib/i18n/config.ts';
import { recipes, getRecipe } from './registry.ts';
import { recipeInventoryView } from './inventory.ts';
import {
  reusableCreamRecipeIds,
  getCreamOptionCopy,
} from './cream-option-copy.ts';
export const reusableComponentRecipeIds = [
  ...reusableCreamRecipeIds,
  'chocolate-glaze',
] as const;
export function isReusableComponentRecipeId(id: string) {
  return reusableComponentRecipeIds.some((candidate) => candidate === id);
}
export function getComponentCopy(id: string, locale: AppLocale) {
  const recipe = getRecipe(id);
  return recipe
    ? {
        title: recipe.discovery.cardTitle[locale],
        description: recipe.summary[locale],
      }
    : getCreamOptionCopy(id, locale);
}
export function getComponentPageRecipe(slug: string) {
  const recipe = recipes.find(
    (recipe) =>
      isReusableComponentRecipeId(recipe.id) && recipe.slug.en === slug,
  );
  return recipe ? recipeInventoryView(recipe) : null;
}
