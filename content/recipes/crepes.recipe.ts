import type { RecipeSourceDraft } from './source-recipe.types.ts';

export const crepesRecipe = {
  id: 'crepes',
  source: { file: 'docs/reference/recipe-inventory.xlsx', locator: 'Recipe Archive · Млинці' },
  completeness: 'readyToReview',
  beforeStart: ['Rest the batter for 15–30 minutes before cooking.'],
  ingredientSections: [{
    id: 'batter', title: 'Crepe batter', ingredients: [
      { id: 'eggs', name: 'Eggs', amount: '5' }, { id: 'flour', name: 'Schär Mix B Bread flour', amount: '5 tbsp' },
      { id: 'milk', name: 'Milk', amount: '500 ml' }, { id: 'sugar', name: 'Sugar', amount: '1 tbsp' },
      { id: 'salt', name: 'Salt', amount: 'A pinch' }, { id: 'oil', name: 'Oil', amount: '5 tbsp' },
      { id: 'water', name: 'Water', amount: '½ cup', note: 'Preferably hot.' },
    ],
  }],
  steps: [
    { id: 'start-batter', title: 'Start the batter', body: 'Whisk or blend eggs, flour, sugar, salt and a little milk until smooth and lump-free.' },
    { id: 'add-milk', title: 'Add the milk', body: 'Gradually add the remaining milk while mixing.' },
    { id: 'finish-batter', title: 'Finish the batter', body: 'Stir in the hot water and oil.' },
    { id: 'rest', title: 'Rest and adjust', body: 'Let the batter stand. Add extra milk or water if needed for a pourable consistency.', meta: '15–30 min', tip: 'The source deliberately leaves final consistency adjustable.' },
  ],
} satisfies RecipeSourceDraft;
