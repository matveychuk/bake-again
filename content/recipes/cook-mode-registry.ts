import { createCookSteps, TOTAL_RECIPE_STEPS } from '@/app/recipes/napoleon-cake/cook/cook-mode.data';
import { calculateNapoleonConfiguration, napoleonBaseSelection, parseNapoleonConfiguration } from './napoleon-configuration';
import type { CookModeDefinition } from '@/components/cook-mode/cook-mode.types';
import { glutenFreeNapoleonRecipe } from './gluten-free-napoleon.recipe';
import { recipeInventory } from './inventory';
import { getRecipeContent } from './registry';

const napoleonCookMode: CookModeDefinition = {
  recipeTitle: 'Napoleon cake',
  detailHref: '/recipes/napoleon-cake',
  totalSteps: TOTAL_RECIPE_STEPS,
  assistant: {
    recipeId: glutenFreeNapoleonRecipe.id,
    recipeVersionId: glutenFreeNapoleonRecipe.versionId,
  },
  getState: (locationSearch) => {
    const requested = parseNapoleonConfiguration(new URLSearchParams(locationSearch));
    const requestedResult = calculateNapoleonConfiguration(requested);
    const selection = requestedResult.cookMode.eligible ? requested : napoleonBaseSelection;
    const configuration = calculateNapoleonConfiguration(selection);
    const isAdjusted = selection.geometryId !== napoleonBaseSelection.geometryId
      || selection.quantityAdjustment.mode !== 'batchScale'
      || selection.quantityAdjustment.factor !== 1;
    return {
      isAdjusted,
      steps: createCookSteps(configuration),
      assistantConfiguration: isAdjusted
        ? {
            kind: 'adjusted',
            geometryId: selection.geometryId,
            quantityAdjustment: selection.quantityAdjustment,
          }
        : { kind: 'base' },
    };
  },
};

function createInventoryCookMode(recipe: (typeof recipeInventory)[number]): CookModeDefinition {
  const structured = getRecipeContent(recipe.id);
  const unavailableReason = structured?.steps.length === 0
    ? structured.gapNote ?? 'The source preserves ingredients but not the preparation method.'
    : !structured
      ? 'The source currently preserves only the recipe name. Add the original ingredients and method before cooking.'
      : undefined;

  return {
    recipeTitle: recipe.title,
    detailHref: `/recipes/${recipe.slug}`,
    totalSteps: structured?.steps.length ?? 0,
    getState: () => ({
      isAdjusted: false,
      unavailableReason,
      steps: (structured?.steps ?? []).map((step, index) => ({
        stepIds: [step.id],
        number: String(index + 1).padStart(2, '0'),
        meta: step.meta ?? `Step ${index + 1}`,
        title: step.title,
        body: step.body,
        ingredients: [],
        checkpoint: step.checkpoint,
        tip: step.tip,
      })),
    }),
  };
}

const cookModesBySlug: Record<string, CookModeDefinition> = Object.fromEntries(
  recipeInventory.map((recipe) => [recipe.slug, createInventoryCookMode(recipe)]),
);

cookModesBySlug['napoleon-cake'] = napoleonCookMode;

export function getCookModeDefinition(slug: string) {
  return cookModesBySlug[slug];
}
