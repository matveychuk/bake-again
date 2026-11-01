import { recipes } from './registry.ts';
import { recipeInventoryView } from './inventory.ts';
export const creamPageRecipes = recipes
  .filter(
    (recipe) =>
      !recipe.discovery.catalogue && recipe.discovery.category.en === 'Cream',
  )
  .map(recipeInventoryView);
export function getCreamPageRecipe(slug: string) {
  return creamPageRecipes.find((recipe) => recipe.slug === slug) ?? null;
}
