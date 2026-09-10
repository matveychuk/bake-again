import type { RecipeSourceDraft } from './source-recipe.types.ts';

export const bananaBreadRecipe = {
  id: 'banana-bread', publicationStatus: 'draft',
  source: { file: 'docs/reference/recipe-inventory.xlsx', locator: 'Recipe Archive · Банановий хліб' },
  completeness: 'incompleteSource',
  ingredientSections: [{ id: 'loaf', title: 'Banana bread', ingredients: [
    { id: 'bananas', name: 'Very ripe bananas', amount: '3' }, { id: 'butter', name: 'Butter, room temperature', amount: '½ cup' },
    { id: 'sugar', name: 'Sugar', amount: '¾ cup' }, { id: 'eggs', name: 'Large eggs', amount: '2' },
    { id: 'flour', name: 'Schär Mix B Bread flour', amount: '1½ cups' }, { id: 'baking-powder', name: 'Baking powder', amount: '1 tsp' },
    { id: 'salt', name: 'Salt', amount: '½ tsp' }, { id: 'vanilla', name: 'Vanilla', amount: '½ tsp' },
    { id: 'walnuts', name: 'Walnuts', amount: '1 cup' }, { id: 'raisins', name: 'Raisins', amount: '1 cup' },
  ] }],
  steps: [
    { id: 'proposed-prepare', title: 'Draft: prepare the loaf tin', body: 'Grease or line a loaf tin and preheat the oven. This setup is an editorial placeholder, not preserved in the author source.' },
    { id: 'proposed-mix', title: 'Draft: mix the batter', body: 'Mash the bananas, then mix in butter, sugar, eggs and vanilla. Fold in the dry ingredients, walnuts and raisins just until combined.' },
    { id: 'proposed-bake', title: 'Draft: bake and check', body: 'Bake until a skewer from the centre comes out without wet batter. Confirm the temperature, timing and tin size in the next author bake.' },
  ],
  gapNote: 'Ingredients are transcribed from the author notebook. The method, tin and timing are untested editorial placeholders and require author review.',
} satisfies RecipeSourceDraft;
