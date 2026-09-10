import type { RecipeSourceDraft } from './source-recipe.types.ts';

export const bananaFrittersRecipe = {
  id: 'banana-fritters', publicationStatus: 'draft',
  source: { file: 'Author inventory', locator: 'Бананові оладки · recipe text not captured' },
  completeness: 'incompleteSource',
  ingredientSections: [{ id: 'draft-batter', title: 'Draft batter', ingredients: [
    { id: 'banana', name: 'Ripe banana', amount: 'To confirm' }, { id: 'eggs', name: 'Eggs', amount: 'To confirm' },
    { id: 'flour', name: 'Schär Mix B Bread flour', amount: 'To confirm' }, { id: 'sugar', name: 'Sugar', amount: 'To confirm' },
    { id: 'leavener', name: 'Leavener', amount: 'To confirm' }, { id: 'oil', name: 'Oil for frying', amount: 'As needed' },
  ] }],
  steps: [{ id: 'draft-method', title: 'Await the author method', body: 'Confirm the banana texture, batter consistency, pan heat and turning cue before cooking.' }],
  gapNote: 'The author confirms this recipe is made many times, but no ingredients or method were captured. This placeholder must not be treated as tested.',
} satisfies RecipeSourceDraft;
