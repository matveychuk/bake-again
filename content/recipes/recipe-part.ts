import type { RecipeSourceDraftContent } from './source-recipe.types.ts';

/** Reuse ingredients, steps and timers without inheriting a component's evidence. */
export function recipePart(
  content: RecipeSourceDraftContent,
  instanceId: string,
) {
  const id = (value: string) => `${instanceId}-${value}`;
  return {
    ingredientSections: content.ingredientSections.map((section) => ({
      ...section,
      id: id(section.id),
      ingredients: section.ingredients.map((ingredient) => ({
        ...ingredient,
        id: id(ingredient.id),
      })),
    })),
    steps: content.steps.map((step) => ({
      ...step,
      id: id(step.id),
      cookGroup: step.cookGroup ? id(step.cookGroup) : undefined,
      cookIngredients: step.cookIngredients?.map((ingredient) => ({
        ...ingredient,
        ingredientId: id(ingredient.ingredientId),
      })),
    })),
    phases: (content.timing?.phases ?? []).map((phase) => ({
      ...phase,
      id: id(phase.id),
      relatedStepId: phase.relatedStepId ? id(phase.relatedStepId) : undefined,
    })),
  };
}
