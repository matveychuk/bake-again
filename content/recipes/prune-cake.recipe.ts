import type { RecipeSourceDraft } from './source-recipe.types.ts';

export const pruneCakeRecipe = {
  id: 'prune-cake', publicationStatus: 'draft',
  source: { file: 'docs/reference/recipe-inventory.xlsx', locator: 'Recipe Archive · Торт з чорносливом' },
  completeness: 'incompleteSource',
  ingredientSections: [{ id: 'cake', title: 'Cake · partial transcription', ingredients: [
    { id: 'eggs', name: 'Eggs', amount: '4' }, { id: 'unknown-jars', name: 'Unclear ingredient', amount: '2 jars', note: 'Unreadable in the source.' },
    { id: 'sugar', name: 'Sugar', amount: '1 scant cup' }, { id: 'unknown-spoons-one', name: 'Unclear ingredient', amount: '2 tbsp', note: 'Unreadable in the source.' },
    { id: 'unknown-spoons-two', name: 'Unclear ingredient', amount: '5–6 tbsp', note: 'Unreadable in the source.' },
    { id: 'leavener', name: 'Baking powder or lemon-quenched baking soda', amount: '2 tsp' }, { id: 'cocoa', name: 'Cocoa', amount: '5 tbsp' },
    { id: 'flour', name: 'Schär Mix B Bread flour', amount: '5 tbsp' },
  ] }],
  steps: [
    { id: 'cream', title: 'Make the cream', body: 'Mix sour cream or cream with powdered sugar to taste.' },
    { id: 'glaze', title: 'Make the chocolate glaze', body: 'The source lists sour cream, butter and an unreadable quantity; confirm the full formula before baking.' },
  ],
  gapNote: 'Several ingredients and the cake method are unreadable. Do not bake from this draft until the handwritten source is confirmed.',
} satisfies RecipeSourceDraft;
