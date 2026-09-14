import type { RecipeSourceDraft } from './source-recipe.types.ts';

export const pruneCakeRecipe = {
  id: 'prune-cake', publicationStatus: 'draft',
  source: { file: 'docs/reference/recipe-inventory.xlsx', locator: 'Recipe Archive · Торт з чорносливом' },
  completeness: 'incompleteSource',
  ingredientSections: [{ id: 'cake', title: 'Cake · partial transcription', ingredients: [
    { id: 'eggs', name: 'Eggs', quantity: { base: { kind: 'exact', value: 4, unit: 'piece' }, shopping: { mode: 'base', increment: 1, rounding: 'up' } } }, { id: 'unknown-jars', name: 'Unclear ingredient', quantity: { base: null, shopping: { mode: 'nameOnly' } }, note: 'Unreadable in the source.' },
    { id: 'sugar', name: 'Sugar', quantity: { base: null, shopping: { mode: 'nameOnly' } } }, { id: 'unknown-spoons-one', name: 'Unclear ingredient', quantity: { base: { kind: 'exact', value: 2, unit: 'tbsp' }, shopping: { mode: 'base' } }, note: 'Unreadable in the source.' },
    { id: 'unknown-spoons-two', name: 'Unclear ingredient', quantity: { base: { kind: 'range', min: 5, max: 6, unit: 'tbsp' }, shopping: { mode: 'base' } }, note: 'Unreadable in the source.' },
    { id: 'leavener', name: 'Baking powder or lemon-quenched baking soda', quantity: { base: { kind: 'exact', value: 2, unit: 'tsp' }, shopping: { mode: 'base' } } }, { id: 'cocoa', name: 'Cocoa', quantity: { base: { kind: 'exact', value: 5, unit: 'tbsp' }, shopping: { mode: 'base' } } },
    { id: 'flour', name: 'Schär Mix B Bread flour', quantity: { base: { kind: 'exact', value: 5, unit: 'tbsp' }, shopping: { mode: 'base' } } },
  ] }],
  steps: [
    { id: 'cream', title: 'Make the cream', body: 'Mix sour cream or cream with powdered sugar to taste.' },
    { id: 'glaze', title: 'Make the chocolate glaze', body: 'The source lists sour cream, butter and an unreadable quantity; confirm the full formula before baking.' },
  ],
  gapNote: 'Several ingredients and the cake method are unreadable. Do not bake from this draft until the handwritten source is confirmed.',
} satisfies RecipeSourceDraft;
