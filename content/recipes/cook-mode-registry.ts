import { createCookSteps, TOTAL_RECIPE_STEPS } from '@/app/recipes/napoleon-cake/cook/cook-mode.data';
import { calculateNapoleonConfiguration, napoleonBaseSelection, parseNapoleonConfiguration } from './napoleon-configuration';
import type { CookModeDefinition } from '@/components/cook-mode/cook-mode.types';

const napoleonCookMode: CookModeDefinition = {
  recipeTitle: 'Napoleon cake',
  detailHref: '/recipes/napoleon-cake',
  totalSteps: TOTAL_RECIPE_STEPS,
  getState: (locationSearch) => {
    const requested = parseNapoleonConfiguration(new URLSearchParams(locationSearch));
    const requestedResult = calculateNapoleonConfiguration(requested);
    const selection = requestedResult.cookMode.eligible ? requested : napoleonBaseSelection;
    const configuration = calculateNapoleonConfiguration(selection);
    const isAdjusted = selection.geometryId !== napoleonBaseSelection.geometryId
      || selection.quantityAdjustment.mode !== 'batchScale'
      || selection.quantityAdjustment.factor !== 1;
    return { isAdjusted, steps: createCookSteps(configuration) };
  },
};

const cookModesBySlug: Record<string, CookModeDefinition> = {
  'napoleon-cake': napoleonCookMode,
};

export function getCookModeDefinition(slug: string) {
  return cookModesBySlug[slug];
}
