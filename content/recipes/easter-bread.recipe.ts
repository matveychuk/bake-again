import type { RecipeSourceDraft } from './source-recipe.types.ts';

export const easterBreadRecipe = {
  id: 'easter-bread', publicationStatus: 'draft',
  source: { file: 'Author inventory', locator: 'Безглютенова паска · recipe text not captured' },
  completeness: 'incompleteSource',
  ingredientSections: [{ id: 'draft-paska', title: 'Draft to be supplied', ingredients: [
    { id: 'flour', name: 'Schär Mix B Bread flour', amount: 'To confirm' }, { id: 'yeast', name: 'Yeast', amount: 'To confirm' },
    { id: 'eggs', name: 'Eggs', amount: 'To confirm' }, { id: 'milk', name: 'Milk or dairy alternative', amount: 'To confirm' },
    { id: 'sugar', name: 'Sugar', amount: 'To confirm' }, { id: 'butter', name: 'Butter or oil', amount: 'To confirm' },
  ] }],
  steps: [
    { id: 'draft-method', title: 'Await the author method', body: 'Add the author’s mixing, proofing, baking and glazing sequence here. No usable external method is included, so this record cannot enter Cook Mode.' },
  ],
  gapNote: 'Only the recipe name and flour family are currently recorded. This is a structured placeholder, not a bakeable recipe.',
} satisfies RecipeSourceDraft;
