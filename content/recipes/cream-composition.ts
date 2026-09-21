import type { StructuredRecipeContent } from './source-recipe.types.ts';

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

/**
 * Adds one explicitly selected reusable cream to a host recipe. Without a
 * selection, the host's final filling step stays hidden so the recipe never
 * implies that a cream was chosen on the reader's behalf.
 */
export function composeRecipeWithCream(
  host: StructuredRecipeContent,
  cream: StructuredRecipeContent | null,
  creamRecipeId: string | null,
): StructuredRecipeContent {
  if (!host.creamOptions) return host;

  const hostStepsWithoutFill = host.steps.filter((step) => step.id !== 'fill');
  if (!cream || !creamRecipeId) {
    return { ...host, steps: hostStepsWithoutFill };
  }

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
  const fillStep = host.steps.find((step) => step.id === 'fill');

  return {
    ...host,
    ingredientSections: [...host.ingredientSections, ...creamSections],
    steps: [
      ...hostStepsWithoutFill,
      ...creamSteps,
      ...(fillStep ? [fillStep] : []),
    ],
  };
}
