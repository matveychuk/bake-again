import {
  getRecipeDocument,
  type RecipeDocument,
} from '../../../content/recipes/registry.ts';
import { composeRecipe } from '../../../content/recipes/compose-recipe.ts';

/** Resolve the canonical version and an explicit, supported cream selection. */
export function getAssistantRecipeDocument(
  recipeId: string,
  requestedVersion?: string,
): RecipeDocument | null {
  const document = getRecipeDocument(recipeId);
  if (!document) return null;
  const host = document.recipe;
  const creamId = host.creamOptions?.recipeIds.find(
    (id) => requestedVersion === `${host.versionId}-cream-${id}`,
  );
  if (!creamId) return document;
  const cream = getRecipeDocument(creamId)?.recipe;
  return cream?.publicationStatus === 'published'
    ? { recipe: composeRecipe(host, cream) }
    : null;
}
