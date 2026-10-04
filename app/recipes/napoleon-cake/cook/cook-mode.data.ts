import { glutenFreeNapoleonRecipe } from '@/content/recipes/gluten-free-napoleon.recipe';
import { getRecipeContent } from '@/content/recipes/registry';
import { applySourceRecipeConfiguration } from '@/content/recipes/source-recipe-configuration';
import { createSourceCookSteps } from '@/content/recipes/cook-mode-adapter';
import type { CalculatedRecipeConfiguration } from '@/content/recipes/recipe.types';
import type { CookStep } from '@/components/cook-mode/cook-mode.types';

export type {
  CookMediaItem,
  CookStep,
} from '@/components/cook-mode/cook-mode.types';

/** Only the two existing finishing groups combine canonical steps. */
export function napoleonCookGroup(stepId: string) {
  if (['toast-walnuts', 'toast-almonds'].includes(stepId)) return 'toast-nuts';
  if (['rest-assembled-cake', 'refrigerate-cake'].includes(stepId))
    return 'rest-cake';
  return stepId;
}

export const TOTAL_RECIPE_STEPS = new Set(
  glutenFreeNapoleonRecipe.steps.map((step) => napoleonCookGroup(step.id)),
).size;

/** Compatibility entry point; copy and images always come from the current source. */
export function createCookSteps(
  configuration: CalculatedRecipeConfiguration,
): CookStep[] {
  const source = getRecipeContent(glutenFreeNapoleonRecipe.id, 'en')!;
  const configured = applySourceRecipeConfiguration(
    source,
    Math.abs(configuration.totalScaleFactor - 1) > 0.000001
      ? { kind: 'adjusted', scaleFactor: configuration.totalScaleFactor }
      : { kind: 'base', mode: 'scale', scaleFactor: 1 },
    'en',
  );
  return createSourceCookSteps(
    {
      ...configured,
      steps: configured.steps.map((step) => ({
        ...step,
        cookGroup: napoleonCookGroup(step.id),
      })),
    },
    'en',
  );
}
