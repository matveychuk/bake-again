import type {
  StructuredRecipeContent,
  StructuredRecipeStep,
} from './source-recipe.types.ts';

export function resolveSelectedCreamRecipeId(
  content: Pick<StructuredRecipeContent, 'creamOptions'> | null | undefined,
  requestedRecipeId: string | null | undefined,
): string | null {
  if (!requestedRecipeId || !content?.creamOptions) return null;
  return content.creamOptions.recipeIds.includes(requestedRecipeId)
    ? requestedRecipeId
    : null;
}

function namespacedId(creamRecipeId: string, id: string) {
  return `cream-${creamRecipeId}-${id}`;
}

const needsCream = (step: StructuredRecipeStep) =>
  step.requiresCream === true || step.id === 'fill';

/**
 * Adds one explicitly selected reusable cream before the host's assembly steps.
 * Without a selection, preserve the complete host method for reading, without
 * adding a cream's ingredients or preparation on the reader's behalf.
 */
export function composeRecipeWithCream(
  host: StructuredRecipeContent,
  cream: StructuredRecipeContent | null,
  creamRecipeId: string | null,
): StructuredRecipeContent {
  if (!host.creamOptions) return host;

  if (!cream || !creamRecipeId) {
    return host;
  }
  const hostStepsWithoutFill = host.steps.filter((step) => !needsCream(step));

  const creamSections = cream.ingredientSections.map((section) => ({
    ...section,
    id: namespacedId(creamRecipeId, section.id),
    ingredients: section.ingredients.map((ingredient) => ({
      ...ingredient,
      id: namespacedId(creamRecipeId, ingredient.id),
    })),
  }));
  const creamSteps = cream.steps.map((step) => ({
    ...step,
    id: namespacedId(creamRecipeId, step.id),
    cookIngredients: step.cookIngredients?.map((ingredient) => ({
      ...ingredient,
      ingredientId: namespacedId(creamRecipeId, ingredient.ingredientId),
    })),
  }));
  const assemblySteps = host.steps.filter(needsCream);

  return {
    ...host,
    ingredientSections: [...host.ingredientSections, ...creamSections],
    steps: [...hostStepsWithoutFill, ...creamSteps, ...assemblySteps],
  };
}
