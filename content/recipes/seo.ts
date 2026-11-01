import { recipes } from './registry.ts';
import type { Recipe } from './recipe.types.ts';
export type RecipeSeoCopy = NonNullable<Recipe['seo']>;
export const recipeSeo: Record<string, RecipeSeoCopy> = Object.fromEntries(
  recipes.flatMap((recipe) => (recipe.seo ? [[recipe.id, recipe.seo]] : [])),
);
