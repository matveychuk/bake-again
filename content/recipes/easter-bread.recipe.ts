import type { RecipeSourceDraft } from './source-recipe.types.ts';

export const easterBreadRecipe = {
  id: 'easter-bread', publicationStatus: 'draft',
  source: { file: 'Author inventory', locator: 'Безглютенова паска · recipe text not captured' },
  completeness: 'incompleteSource',
  ingredientSections: [{ id: 'draft-paska', title: 'Draft to be supplied', ingredients: [
    { id: 'flour', name: 'Schär Mix B Bread flour', quantity: { base: null, shopping: { mode: 'nameOnly' } } }, { id: 'yeast', name: 'Yeast', quantity: { base: null, shopping: { mode: 'nameOnly' } } },
    { id: 'eggs', name: 'Eggs', quantity: { base: null, shopping: { mode: 'nameOnly' } } }, { id: 'milk', name: 'Milk or dairy alternative', quantity: { base: null, shopping: { mode: 'nameOnly' } } },
    { id: 'sugar', name: 'Sugar', quantity: { base: null, shopping: { mode: 'nameOnly' } } }, { id: 'butter', name: 'Butter or oil', quantity: { base: null, shopping: { mode: 'nameOnly' } } },
  ] }],
  steps: [
    { id: 'draft-method', title: 'Await the author method', body: 'Add the author’s mixing, proofing, baking and glazing sequence here. No usable external method is included, so this record cannot enter Cook Mode.' },
  ],
  gapNote: 'Only the recipe name and flour family are currently recorded. This is a structured placeholder, not a bakeable recipe.',
} satisfies RecipeSourceDraft;
