import type { RecipeSourceDraft } from './source-recipe.types.ts';

export const cinnamonRollsRecipe = {
  id: 'cinnamon-rolls', publicationStatus: 'draft',
  source: { file: 'https://marikebol.com/2021/09/08/glutenvrije-cinnamon-rolls/', locator: 'External Schär Mix B reference · author recipe text not yet captured' },
  completeness: 'incompleteSource',
  ingredientSections: [{ id: 'draft-dough', title: 'Draft dough', ingredients: [
    { id: 'flour', name: 'Schär Mix B Bread flour', amount: '500 g' }, { id: 'yeast', name: 'Dry yeast', amount: '9 g' },
    { id: 'milk', name: 'Milk', amount: '400 ml', note: 'Lukewarm.' }, { id: 'sugar', name: 'Sugar', amount: '70 g' },
    { id: 'butter', name: 'Butter', amount: '35 g', note: 'Melted.' }, { id: 'salt', name: 'Salt', amount: 'A pinch' },
  ] }, { id: 'draft-filling', title: 'Draft filling', ingredients: [
    { id: 'butter', name: 'Butter', amount: 'To confirm' }, { id: 'cinnamon', name: 'Ground cinnamon', amount: 'To confirm' }, { id: 'sugar', name: 'Sugar', amount: 'To confirm' },
  ] }],
  steps: [
    { id: 'draft-mix', title: 'Draft: mix and proof the dough', body: 'Mix the dough, then allow it to rise. Confirm the author’s liquid ratio and proofing cue before baking.' },
    { id: 'draft-fill', title: 'Draft: roll and fill', body: 'Roll the dough, spread with the cinnamon filling and cut into rolls. The author’s shaping method is still missing.' },
    { id: 'draft-bake', title: 'Draft: proof and bake', body: 'Proof shaped rolls, then bake until set and browned. Temperature and timing require author testing.' },
  ],
  gapNote: 'The author confirms a repeatedly made recipe, but no original text has been captured. Quantities above are an external Schär Mix B reference only; they are not the author’s tested recipe.',
} satisfies RecipeSourceDraft;
