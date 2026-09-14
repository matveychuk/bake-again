import type { RecipeSourceDraft } from './source-recipe.types.ts';

export const appleBananaFrittersRecipe = {
  id: 'apple-banana-fritters', publicationStatus: 'draft',
  source: { file: 'Author inventory', locator: 'Яблучно-бананові оладки · recipe text not captured' },
  completeness: 'incompleteSource',
  ingredientSections: [{ id: 'draft-batter', title: 'Draft batter', ingredients: [
    { id: 'apple', name: 'Apple', quantity: { base: null, shopping: { mode: 'nameOnly' } } }, { id: 'banana', name: 'Ripe banana', quantity: { base: null, shopping: { mode: 'nameOnly' } } },
    { id: 'eggs', name: 'Eggs', quantity: { base: null, shopping: { mode: 'nameOnly' } } }, { id: 'flour', name: 'Schär Mix B Bread flour', quantity: { base: null, shopping: { mode: 'nameOnly' } } },
    { id: 'sugar', name: 'Sugar', quantity: { base: null, shopping: { mode: 'nameOnly' } } }, { id: 'oil', name: 'Oil for frying', quantity: { base: null, shopping: { mode: 'nameOnly' } } },
  ] }],
  steps: [{ id: 'draft-method', title: 'Await the author method', body: 'Confirm the fruit ratio, batter consistency, pan heat and turning cue before cooking.' }],
  gapNote: 'The author confirms this recipe is made many times, but no ingredients or method were captured. This placeholder must not be treated as tested.',
} satisfies RecipeSourceDraft;
