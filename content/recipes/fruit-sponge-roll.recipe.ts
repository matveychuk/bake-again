import type { RecipeSourceDraft } from './source-recipe.types.ts';

export const fruitSpongeRollRecipe = {
  id: 'fruit-sponge-roll',
  source: { file: 'docs/reference/recipe-inventory.xlsx', locator: 'Recipe Archive · Бісквітний рулет з фруктами' },
  completeness: 'readyToReview',
  beforeStart: ['Line a baking tray with parchment.', 'Roll the sponge while warm, then cool before filling.'],
  ingredientSections: [
    { id: 'sponge', title: 'Sponge', ingredients: [
      { id: 'eggs', name: 'Eggs', quantity: { base: { kind: 'exact', value: 5, unit: 'piece' }, shopping: { mode: 'base', increment: 1, rounding: 'up' } } }, { id: 'sugar', name: 'Sugar', quantity: { base: { kind: 'exact', value: 100, unit: 'g' }, shopping: { mode: 'base' } } },
      { id: 'salt', name: 'Salt', quantity: { base: null, equivalent: { kind: 'exact', value: 1, unit: 'pinch' }, shopping: { mode: 'nameOnly' } } }, { id: 'oil', name: 'Oil', quantity: { base: { kind: 'exact', value: 35, unit: 'ml' }, shopping: { mode: 'base' } } },
      { id: 'water', name: 'Water', quantity: { base: { kind: 'exact', value: 35, unit: 'ml' }, shopping: { mode: 'base', defaultSelected: false } } }, { id: 'flour', name: 'Schär Mix B Bread flour', quantity: { base: { kind: 'exact', value: 120, unit: 'g' }, shopping: { mode: 'base' } } },
    ] },
    { id: 'cream', title: 'Cream', ingredients: [
      { id: 'cream', name: 'Whipping cream', quantity: { base: { kind: 'exact', value: 250, unit: 'ml' }, shopping: { mode: 'base' } } }, { id: 'sugar', name: 'Sugar', quantity: { base: { kind: 'exact', value: 80, unit: 'g' }, shopping: { mode: 'base' } } },
      { id: 'mascarpone', name: 'Mascarpone', quantity: { base: { kind: 'exact', value: 250, unit: 'g' }, shopping: { mode: 'base' } } },
    ] },
    { id: 'filling', title: 'Filling and decoration', ingredients: [
      { id: 'jam', name: 'Blueberry jam', quantity: { base: null, shopping: { mode: 'nameOnly' } } }, { id: 'strawberries', name: 'Strawberries', quantity: { base: null, shopping: { mode: 'nameOnly' } } },
      { id: 'mint', name: 'Mint', quantity: { base: null, shopping: { mode: 'nameOnly' } }, optional: true }, { id: 'almonds', name: 'Almonds', quantity: { base: null, shopping: { mode: 'nameOnly' } }, optional: true },
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
