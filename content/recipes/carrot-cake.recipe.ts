import type { RecipeSourceDraft } from './source-recipe.types.ts';

export const carrotCakeRecipe = {
  id: 'carrot-cake',
  source: { file: 'docs/reference/recipe-inventory.xlsx', locator: 'Recipe Archive · Морквяний кекс' },
  completeness: 'readyToReview',
  beforeStart: ['This handwritten batch is noted as enough for three cakes.', 'Preheat the oven to 200°C.'],
  ingredientSections: [{
    id: 'cake', title: 'Carrot cake', ingredients: [
      { id: 'carrots', name: 'Carrots', quantity: { base: { kind: 'range', min: 500, max: 600, unit: 'g' }, shopping: { mode: 'base' } } }, { id: 'oil', name: 'Oil', quantity: { base: { kind: 'exact', value: 300, unit: 'ml' }, shopping: { mode: 'base' } } },
      { id: 'eggs', name: 'Eggs', quantity: { base: { kind: 'exact', value: 8, unit: 'piece' }, shopping: { mode: 'base', increment: 1, rounding: 'up' } } }, { id: 'sugar', name: 'Sugar', quantity: { base: { kind: 'exact', value: 300, unit: 'g' }, shopping: { mode: 'base' } } },
      { id: 'flour', name: 'Schär Mix B Bread flour', quantity: { base: { kind: 'exact', value: 500, unit: 'g' }, shopping: { mode: 'base' } } }, { id: 'baking-powder', name: 'Baking powder', quantity: { base: { kind: 'exact', value: 16, unit: 'g' }, shopping: { mode: 'base' } } },
      { id: 'salt', name: 'Salt', quantity: { base: { kind: 'exact', value: 4, unit: 'g' }, shopping: { mode: 'base' } } }, { id: 'walnuts', name: 'Walnuts', quantity: { base: { kind: 'exact', value: 300, unit: 'g' }, shopping: { mode: 'base' } } },
      { id: 'raisins', name: 'Raisins', quantity: { base: { kind: 'exact', value: 250, unit: 'g' }, shopping: { mode: 'base' } }, note: 'Soak before using.' },
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
