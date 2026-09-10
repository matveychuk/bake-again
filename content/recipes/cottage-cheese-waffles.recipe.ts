import type { RecipeSourceDraft } from './source-recipe.types.ts';

export const cottageCheeseWafflesRecipe = {
  id: 'cottage-cheese-waffles',
  source: { file: 'docs/reference/recipe-inventory.xlsx', locator: 'Recipe Archive · Творожні вафлі' },
  completeness: 'readyToReview',
  beforeStart: ['Preheat the waffle maker thoroughly before the batter is ready.'],
  ingredientSections: [{
    id: 'waffles', title: 'Waffles', ingredients: [
      { id: 'cottage-cheese', name: 'Cottage cheese', amount: '500 g' },
      { id: 'eggs', name: 'Eggs', amount: '4' },
      { id: 'yogurt', name: 'Natural yogurt', amount: '200 ml' },
      { id: 'oil', name: 'Sunflower oil', amount: '60–80 ml' },
      { id: 'flour', name: 'Schär Mix B Bread flour', amount: '250 g' },
      { id: 'corn-starch', name: 'Corn starch', amount: '1 tbsp' },
      { id: 'baking-powder', name: 'Baking powder', amount: '2 tsp' },
      { id: 'sugar', name: 'Sugar', amount: '1 tbsp' },
      { id: 'salt', name: 'Salt', amount: 'A pinch' },
      { id: 'vanilla', name: 'Vanilla', amount: 'To taste' },
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
