import { recipes } from './registry.ts';
import type { RecipeSearchMetadata } from './recipe.types.ts';
/** Derived index, not a second editable source of recipe dates or cooking times. */
export const recipeSearchMetadata: Record<string, RecipeSearchMetadata> =
  Object.fromEntries(
    recipes.flatMap((recipe) =>
      recipe.searchMetadata ? [[recipe.id, recipe.searchMetadata]] : [],
    ),
  );
/** Pending undated edits must not inherit a previous revision's modification date. */
export function recipeLastModified(recipe: {
  versionId?: string;
  searchMetadata?: RecipeSearchMetadata;
}): string | null {
  const facts = recipe.searchMetadata;
  if (
    facts?.dateModifiedVersionId &&
    facts.dateModifiedVersionId !== recipe.versionId
  )
    return null;
  return facts?.dateModified ?? null;
}
