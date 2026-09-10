import type { RecipeSourceDraft } from './source-recipe.types.ts';

export const carrotCakeRecipe = {
  id: 'carrot-cake',
  source: { file: 'docs/reference/recipe-inventory.xlsx', locator: 'Recipe Archive · Морквяний кекс' },
  completeness: 'readyToReview',
  beforeStart: ['This handwritten batch is noted as enough for three cakes.', 'Preheat the oven to 200°C.'],
  ingredientSections: [{
    id: 'cake', title: 'Carrot cake', ingredients: [
      { id: 'carrots', name: 'Carrots', amount: '500–600 g' }, { id: 'oil', name: 'Oil', amount: '300 ml' },
      { id: 'eggs', name: 'Eggs', amount: '8' }, { id: 'sugar', name: 'Sugar', amount: '300 g' },
      { id: 'flour', name: 'Schär Mix B Bread flour', amount: '500 g' }, { id: 'baking-powder', name: 'Baking powder', amount: '16 g' },
      { id: 'salt', name: 'Salt', amount: '4 g' }, { id: 'walnuts', name: 'Walnuts', amount: '300 g' },
      { id: 'raisins', name: 'Raisins', amount: '250 g', note: 'Soak before using.' },
    ],
  }],
  steps: [
    { id: 'blend-carrots', title: 'Blend the carrots', body: 'Grate the carrots, then blend them with oil until smooth.' },
    { id: 'whip-eggs', title: 'Whip the eggs and sugar', body: 'Beat until thick and foamy.' },
    { id: 'mix-dry', title: 'Mix the dry ingredients', body: 'Combine the flour, baking powder and salt, then mix into the wet ingredients.' },
    { id: 'fold-add-ins', title: 'Fold in raisins and walnuts', body: 'Soak the raisins first. Fold both add-ins into the finished batter.' },
    { id: 'bake', title: 'Bake', body: 'Butter the forms, divide in the batter and bake until set.', meta: '200°C · 35–40 min' },
  ],
} satisfies RecipeSourceDraft;
