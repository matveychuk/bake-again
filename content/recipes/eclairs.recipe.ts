import type { RecipeSourceDraft } from './source-recipe.types.ts';

export const eclairsRecipe = {
  id: 'eclairs', publicationStatus: 'draft',
  source: { file: 'https://www.youtube.com/watch?v=IumsZSrJZeQ', locator: 'External Schär Mix B reference · author recipe text not yet captured' },
  completeness: 'incompleteSource',
  ingredientSections: [{ id: 'draft-choux', title: 'Draft choux pastry', ingredients: [
    { id: 'flour', name: 'Schär Mix B Bread flour', quantity: { base: { kind: 'exact', value: 190, unit: 'g' }, shopping: { mode: 'base' } } }, { id: 'milk', name: 'Milk', quantity: { base: { kind: 'exact', value: 100, unit: 'ml' }, shopping: { mode: 'base' } } },
    { id: 'water', name: 'Water', quantity: { base: { kind: 'exact', value: 100, unit: 'ml' }, shopping: { mode: 'base', defaultSelected: false } } }, { id: 'butter', name: 'Butter', quantity: { base: { kind: 'exact', value: 100, unit: 'g' }, shopping: { mode: 'base' } } },
    { id: 'eggs', name: 'Eggs', quantity: { base: { kind: 'exact', value: 4, unit: 'piece' }, shopping: { mode: 'base', increment: 1, rounding: 'up' } } }, { id: 'sugar', name: 'Sugar', quantity: { base: { kind: 'exact', value: 20, unit: 'g' }, shopping: { mode: 'base' } } }, { id: 'salt', name: 'Salt', quantity: { base: null, equivalent: { kind: 'exact', value: 1, unit: 'pinch' }, shopping: { mode: 'nameOnly' } } },
  ] }],
  steps: [
    { id: 'draft-choux', title: 'Draft: cook the choux base', body: 'Heat the liquid and butter, work in the flour, then dry the paste before adding eggs gradually. Confirm texture and oven method against the author’s recipe.' },
    { id: 'draft-pipe', title: 'Draft: pipe and bake', body: 'Pipe oblong shells and bake until dry and hollow. Temperature, timing and whether to vent the oven remain for review.' },
    { id: 'draft-fill', title: 'Draft: cool and fill', body: 'Cool completely before filling. The author’s cream and glaze are not yet available.' },
  ],
  gapNote: 'This is an external Schär Mix B choux reference, included only to begin review. It is not the author’s tested éclair recipe.',
} satisfies RecipeSourceDraft;
