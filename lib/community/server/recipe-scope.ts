import type { RecipeReviewScope } from '../contracts.ts';
import { getRecipe } from '@/content/recipes/registry';
import { getRecipePublicationStatus } from '@/content/recipes/publication';

/** Reviews belong to the published recipe, not to a scaled or substituted variant. */
export function resolveRecipeReviewScope(
  recipeId: string,
): RecipeReviewScope | null {
  const recipe = getRecipe(recipeId);
  if (!recipe || getRecipePublicationStatus(recipeId) !== 'published')
    return null;
  return { recipeId, version: recipe.versionId, configuration: 'base' };
}
