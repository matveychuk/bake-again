import { getRecipeDocument } from './registry.ts';
import type { PublicationStatus } from './recipe.types.ts';

export function getRecipePublicationStatus(recipeId: string): PublicationStatus | null {
  return getRecipeDocument(recipeId)?.recipe.publicationStatus ?? null;
}

export function canReadRecipe(recipeId: string, localDevelopment: boolean): boolean {
  const status = getRecipePublicationStatus(recipeId);
  return status === 'published' || (localDevelopment && status === 'unpublished');
}
