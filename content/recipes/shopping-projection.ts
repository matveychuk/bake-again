import type { StructuredIngredientSection } from './localized-recipe.types.ts';
import { calculateProjectedIngredient } from './projected-quantity.ts';
export type ShoppingRecipeProjection = {
  id: string;
  versionId: string;
  title: string;
  ingredientSections: StructuredIngredientSection[];
};

export type ShoppingLine = {
  id: string;
  options: Array<{ ingredientId: string; name: string }>;
  quantity: {
    base: import('./recipe.types.ts').Quantity | null;
    shopping: {
      mode: 'base' | 'nameOnly';
      increment?: number;
      rounding?: 'up';
      defaultSelected?: boolean;
    };
  };
  choose?: 1;
  notes: string[];
};
export type ShoppingRecipe = {
  id: string;
  versionId: string;
  title: string;
  configurationKey: string;
  ingredientSections: Array<{
    id: string;
    title: string;
    lines: ShoppingLine[];
  }>;
};

export function buildShoppingRecipe(
  recipe: ShoppingRecipeProjection,
  scaleFactor: number,
  configurationKey: string,
): ShoppingRecipe {
  return {
    id: recipe.id,
    versionId: recipe.versionId,
    title: recipe.title,
    configurationKey,
    ingredientSections: recipe.ingredientSections.map((section) => ({
      id: section.id,
      title: section.title,
      lines: section.ingredients.map((ingredient) => ({
        id: ingredient.id,
        options: ingredient.options ?? [
          { ingredientId: ingredient.id, name: ingredient.name },
        ],
        choose: ingredient.choose,
        quantity: {
          ...ingredient.quantity,
          base: calculateProjectedIngredient(ingredient, scaleFactor).base,
          equivalent: calculateProjectedIngredient(ingredient, scaleFactor)
            .equivalent,
        },
        notes: [ingredient.note].filter((note): note is string =>
          Boolean(note),
        ),
      })),
    })),
  };
}
