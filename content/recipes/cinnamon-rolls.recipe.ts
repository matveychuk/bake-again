import type { RecipeSourceDraft } from './source-recipe.types.ts';

export const cinnamonRollsRecipe = {
  id: 'cinnamon-rolls', publicationStatus: 'draft',
  source: { file: 'https://marikebol.com/2021/09/08/glutenvrije-cinnamon-rolls/', locator: 'External Schär Mix B reference · author recipe text not yet captured' },
  completeness: 'incompleteSource',
  ingredientSections: [{ id: 'draft-dough', title: 'Draft dough', ingredients: [
    { id: 'flour', name: 'Schär Mix B Bread flour', quantity: { base: { kind: 'exact', value: 500, unit: 'g' }, shopping: { mode: 'base' } } }, { id: 'yeast', name: 'Dry yeast', quantity: { base: { kind: 'exact', value: 9, unit: 'g' }, shopping: { mode: 'base' } } },
    { id: 'milk', name: 'Milk', quantity: { base: { kind: 'exact', value: 400, unit: 'ml' }, shopping: { mode: 'base' } }, note: 'Lukewarm.' }, { id: 'sugar', name: 'Sugar', quantity: { base: { kind: 'exact', value: 70, unit: 'g' }, shopping: { mode: 'base' } } },
    { id: 'butter', name: 'Butter', quantity: { base: { kind: 'exact', value: 35, unit: 'g' }, shopping: { mode: 'base' } }, note: 'Melted.' }, { id: 'salt', name: 'Salt', quantity: { base: null, equivalent: { kind: 'exact', value: 1, unit: 'pinch' }, shopping: { mode: 'nameOnly' } } },
  ] }, { id: 'draft-filling', title: 'Draft filling', ingredients: [
    { id: 'butter', name: 'Butter', quantity: { base: null, shopping: { mode: 'nameOnly' } } }, { id: 'cinnamon', name: 'Ground cinnamon', quantity: { base: null, shopping: { mode: 'nameOnly' } } }, { id: 'sugar', name: 'Sugar', quantity: { base: null, shopping: { mode: 'nameOnly' } } },
  ] }],
  steps: [
    { id: 'draft-mix', title: 'Draft: mix and proof the dough', body: 'Mix the dough, then allow it to rise. Confirm the author’s liquid ratio and proofing cue before baking.' },
    { id: 'draft-fill', title: 'Draft: roll and fill', body: 'Roll the dough, spread with the cinnamon filling and cut into rolls. The author’s shaping method is still missing.' },
    { id: 'draft-bake', title: 'Draft: proof and bake', body: 'Proof shaped rolls, then bake until set and browned. Temperature and timing require author testing.' },
  ],
  gapNote: 'The author confirms a repeatedly made recipe, but no original text has been captured. Quantities above are an external Schär Mix B reference only; they are not the author’s tested recipe.',
} satisfies RecipeSourceDraft;
