import type { RecipeSourceDraft } from './source-recipe.types.ts';

export const fruitSpongeRollRecipe = {
  id: 'fruit-sponge-roll',
  source: { file: 'docs/reference/recipe-inventory.xlsx', locator: 'Recipe Archive · Бісквітний рулет з фруктами' },
  completeness: 'readyToReview',
  beforeStart: ['Line a baking tray with parchment.', 'Roll the sponge while warm, then cool before filling.'],
  ingredientSections: [
    { id: 'sponge', title: 'Sponge', ingredients: [
      { id: 'eggs', name: 'Eggs', amount: '5' }, { id: 'sugar', name: 'Sugar', amount: '100 g' },
      { id: 'salt', name: 'Salt', amount: 'A little' }, { id: 'oil', name: 'Oil', amount: '35 ml' },
      { id: 'water', name: 'Water', amount: '35 ml' }, { id: 'flour', name: 'Schär Mix B Bread flour', amount: '120 g' },
    ] },
    { id: 'cream', title: 'Cream', ingredients: [
      { id: 'cream', name: 'Whipping cream', amount: '250 ml' }, { id: 'sugar', name: 'Sugar', amount: '80 g' },
      { id: 'mascarpone', name: 'Mascarpone', amount: '250 g' },
    ] },
    { id: 'filling', title: 'Filling and decoration', ingredients: [
      { id: 'jam', name: 'Blueberry jam', amount: 'To spread' }, { id: 'strawberries', name: 'Strawberries', amount: 'To decorate' },
      { id: 'mint', name: 'Mint', amount: 'To decorate', optional: true }, { id: 'almonds', name: 'Almonds', amount: 'To decorate', optional: true },
    ] },
  ],
  steps: [
    { id: 'whip-eggs', title: 'Whip eggs, sugar and salt', body: 'Whip to a full bowl of thick, pale foam.', meta: 'About 10 min' },
    { id: 'fold-liquids', title: 'Fold in oil and water', body: 'Gently fold in the oil, then the water.' },
    { id: 'fold-flour', title: 'Fold in flour', body: 'Gradually add the flour and fold carefully.' },
    { id: 'bake-roll', title: 'Bake and roll', body: 'Spread on parchment-lined tray, bake, then roll and cool.', meta: '180–200°C · 15–20 min', checkpoint: 'Confirm the exact oven temperature and rolling method on the next bake.' },
    { id: 'make-cream', title: 'Make the mascarpone cream', body: 'Whip cream with sugar, then fold in mascarpone.' },
    { id: 'fill', title: 'Fill and decorate', body: 'Spread blueberry jam, add the cream, then finish with strawberries, mint and almonds.' },
  ],
} satisfies RecipeSourceDraft;
