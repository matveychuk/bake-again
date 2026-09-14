import type { RecipeSourceDraft } from './source-recipe.types.ts';

export const cottageCheeseWafflesRecipe = {
  id: 'cottage-cheese-waffles',
  source: { file: 'docs/reference/recipe-inventory.xlsx', locator: 'Recipe Archive · Творожні вафлі' },
  completeness: 'readyToReview',
  beforeStart: ['Preheat the waffle maker thoroughly before the batter is ready.'],
  ingredientSections: [{
    id: 'waffles', title: 'Waffles', ingredients: [
      { id: 'cottage-cheese', name: 'Cottage cheese', quantity: { base: { kind: 'exact', value: 500, unit: 'g' }, shopping: { mode: 'base' } } },
      { id: 'eggs', name: 'Eggs', quantity: { base: { kind: 'exact', value: 4, unit: 'piece' }, shopping: { mode: 'base', increment: 1, rounding: 'up' } } },
      { id: 'yogurt', name: 'Natural yogurt', quantity: { base: { kind: 'exact', value: 200, unit: 'ml' }, shopping: { mode: 'base' } } },
      { id: 'oil', name: 'Sunflower oil', quantity: { base: { kind: 'range', min: 60, max: 80, unit: 'ml' }, shopping: { mode: 'base' } } },
      { id: 'flour', name: 'Schär Mix B Bread flour', quantity: { base: { kind: 'exact', value: 250, unit: 'g' }, shopping: { mode: 'base' } } },
      { id: 'corn-starch', name: 'Corn starch', quantity: { base: { kind: 'exact', value: 1, unit: 'tbsp' }, shopping: { mode: 'base' } } },
      { id: 'baking-powder', name: 'Baking powder', quantity: { base: { kind: 'exact', value: 2, unit: 'tsp' }, shopping: { mode: 'base' } } },
      { id: 'sugar', name: 'Sugar', quantity: { base: { kind: 'exact', value: 1, unit: 'tbsp' }, shopping: { mode: 'base' } } },
      { id: 'salt', name: 'Salt', quantity: { base: null, equivalent: { kind: 'exact', value: 1, unit: 'pinch' }, shopping: { mode: 'nameOnly' } } },
      { id: 'vanilla', name: 'Vanilla', quantity: { base: null, shopping: { mode: 'nameOnly' } } },
    ],
  }],
  steps: [
    { id: 'blend-base', title: 'Blend the cottage-cheese base', body: 'Blend the cottage cheese, eggs and yogurt until smooth.' },
    { id: 'season', title: 'Add the wet ingredients', body: 'Stir in the oil, sugar, salt and vanilla.' },
    { id: 'mix-dry', title: 'Mix the dry ingredients', body: 'Combine the flour, corn starch and baking powder.' },
    { id: 'make-batter', title: 'Make the batter', body: 'Add the dry mixture to the wet base and mix into a dough. Rest it briefly.', meta: '7–10 min' },
    { id: 'cook', title: 'Cook the waffles', body: 'Bake in a well-heated waffle maker until golden.', meta: '5–7 min per waffle' },
  ],
} satisfies RecipeSourceDraft;
