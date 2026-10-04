import { calculateRecipeConfiguration } from './calculate-configuration.ts';
import { glutenFreeNapoleonRecipe } from './gluten-free-napoleon.recipe.ts';

export const napoleon28cmHalfBatch = calculateRecipeConfiguration(
  glutenFreeNapoleonRecipe,
  'round-28cm-preview',
  { mode: 'batchScale', factor: 0.5 },
);

export const napoleon24cmFrom200gFlour = calculateRecipeConfiguration(
  glutenFreeNapoleonRecipe,
  'round-24cm-6-layers-each',
  {
    mode: 'useWhatIHave',
    anchorIngredientLineId: 'schar-mix-b',
    availableAmount: { value: 200, unit: 'g' },
  },
);
