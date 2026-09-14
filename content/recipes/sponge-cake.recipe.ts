import type { RecipeSourceDraft } from './source-recipe.types.ts';

export const spongeCakeRecipe = {
  id: 'sponge-cake',
  source: { file: 'docs/reference/recipe-inventory.xlsx', locator: 'Recipe Archive · Бісквіт' },
  completeness: 'readyToReview',
  beforeStart: ['Preheat the oven. Grease only the bottom of the form.'],
  ingredientSections: [{
    id: 'sponge', title: 'Sponge', ingredients: [
      { id: 'eggs', name: 'Large eggs', quantity: { base: { kind: 'exact', value: 5, unit: 'piece' }, shopping: { mode: 'base', increment: 1, rounding: 'up' } }, note: 'Or 6 small eggs.' },
      { id: 'sugar', name: 'Sugar', quantity: { base: null, shopping: { mode: 'nameOnly' } }, note: 'The 2 tbsp are for the yolks.' },
      { id: 'corn-starch', name: 'Corn starch', quantity: { base: { kind: 'exact', value: 15, unit: 'g' }, shopping: { mode: 'base' } } },
      { id: 'tapioca', name: 'Tapioca starch', quantity: { base: { kind: 'exact', value: 70, unit: 'g' }, shopping: { mode: 'base' } } },
      { id: 'flour', name: 'Schär Mix B Bread flour', quantity: { base: { kind: 'exact', value: 140, unit: 'g' }, shopping: { mode: 'base' } } },
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
