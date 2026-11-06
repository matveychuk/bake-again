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
  locale: import("../../lib/i18n/config.ts").AppLocale = "uk",
): ShoppingRecipe {
  const result: ShoppingRecipe = {
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
          shopping: {...ingredient.quantity.shopping, ...(ingredient.optional ? {defaultSelected: false} : {})},
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
  const optionalIds = new Set(recipe.ingredientSections.flatMap(section => section.ingredients.filter(i => i.optional).map(i => i.id)));
  const optional = result.ingredientSections.flatMap(section => section.lines.filter(line => optionalIds.has(line.id)));
  if (optional.length) {
    result.ingredientSections = result.ingredientSections.map(section => ({...section,lines:section.lines.filter(line => !optionalIds.has(line.id))})).filter(section => section.lines.length);
    result.ingredientSections.push({id:'optional',title:{uk:'За бажанням',en:'Optional',es:'Opcional'}[locale],lines:optional});
  }
  return result;
}
