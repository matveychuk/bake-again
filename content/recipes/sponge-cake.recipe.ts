import type { RecipeSourceDraft } from './source-recipe.types.ts';

export const spongeCakeRecipe = {
  id: 'sponge-cake',
  source: { file: 'docs/reference/recipe-inventory.xlsx', locator: 'Recipe Archive · Бісквіт' },
  completeness: 'readyToReview',
  beforeStart: ['Preheat the oven. Grease only the bottom of the form.'],
  ingredientSections: [{
    id: 'sponge', title: 'Sponge', ingredients: [
      { id: 'eggs', name: 'Large eggs', amount: '5', note: 'Or 6 small eggs.' },
      { id: 'sugar', name: 'Sugar', amount: '120 g + 2 tbsp', note: 'The 2 tbsp are for the yolks.' },
      { id: 'corn-starch', name: 'Corn starch', amount: '15 g' },
      { id: 'tapioca', name: 'Tapioca starch', amount: '70 g' },
      { id: 'flour', name: 'Schär Mix B Bread flour', amount: '140 g' },
    ],
  }],
  steps: [
    { id: 'separate', title: 'Separate the eggs', body: 'Put whites and yolks into separate bowls.' },
    { id: 'whip-whites', title: 'Whip the whites', body: 'Beat the whites to a thick white foam. Add the main sugar gradually in 3–4 additions.' },
    { id: 'whip-yolks', title: 'Whip the yolks', body: 'Beat the yolks with 2 tbsp sugar until pale and thick.' },
    { id: 'fold-yolks', title: 'Fold yolks into whites', body: 'Gently fold the yolks into the whites with a spoon.' },
    { id: 'fold-dry', title: 'Fold in the dry ingredients', body: 'Add the flour and starches in 2–3 additions, folding gently.' },
    { id: 'bake', title: 'Bake', body: 'Transfer to the form and bake until set.', meta: '200°C · 40–50 min' },
  ],
} satisfies RecipeSourceDraft;
