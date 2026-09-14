import type { RecipeSourceDraft } from './source-recipe.types.ts';

export const bananaBreadRecipe = {
  id: 'banana-bread', publicationStatus: 'draft',
  source: { file: 'docs/reference/recipe-inventory.xlsx', locator: 'Recipe Archive · Банановий хліб' },
  completeness: 'incompleteSource',
  ingredientSections: [{ id: 'loaf', title: 'Banana bread', ingredients: [
    { id: 'bananas', name: 'Very ripe bananas', quantity: { base: { kind: 'exact', value: 3, unit: 'piece' }, shopping: { mode: 'base', increment: 1, rounding: 'up' } } }, { id: 'butter', name: 'Butter, room temperature', quantity: { base: { kind: 'exact', value: 0.5, unit: 'cup' }, shopping: { mode: 'base' } } },
    { id: 'sugar', name: 'Sugar', quantity: { base: { kind: 'exact', value: 0.75, unit: 'cup' }, shopping: { mode: 'base' } } }, { id: 'eggs', name: 'Large eggs', quantity: { base: { kind: 'exact', value: 2, unit: 'piece' }, shopping: { mode: 'base', increment: 1, rounding: 'up' } } },
    { id: 'flour', name: 'Schär Mix B Bread flour', quantity: { base: { kind: 'exact', value: 1.5, unit: 'cup' }, shopping: { mode: 'base' } } }, { id: 'baking-powder', name: 'Baking powder', quantity: { base: { kind: 'exact', value: 1, unit: 'tsp' }, shopping: { mode: 'base' } } },
    { id: 'salt', name: 'Salt', quantity: { base: { kind: 'exact', value: 0.5, unit: 'tsp' }, shopping: { mode: 'base' } } }, { id: 'vanilla', name: 'Vanilla', quantity: { base: { kind: 'exact', value: 0.5, unit: 'tsp' }, shopping: { mode: 'base' } } },
    { id: 'walnuts', name: 'Walnuts', quantity: { base: { kind: 'exact', value: 1, unit: 'cup' }, shopping: { mode: 'base' } } }, { id: 'raisins', name: 'Raisins', quantity: { base: { kind: 'exact', value: 1, unit: 'cup' }, shopping: { mode: 'base' } } },
  ] }],
  steps: [
    { id: 'proposed-prepare', title: 'Draft: prepare the loaf tin', body: 'Grease or line a loaf tin and preheat the oven. This setup is an editorial placeholder, not preserved in the author source.' },
    { id: 'proposed-mix', title: 'Draft: mix the batter', body: 'Mash the bananas, then mix in butter, sugar, eggs and vanilla. Fold in the dry ingredients, walnuts and raisins just until combined.' },
    { id: 'proposed-bake', title: 'Draft: bake and check', body: 'Bake until a skewer from the centre comes out without wet batter. Confirm the temperature, timing and tin size in the next author bake.' },
  ],
  gapNote: 'Ingredients are transcribed from the author notebook. The method, tin and timing are untested editorial placeholders and require author review.',
} satisfies RecipeSourceDraft;
