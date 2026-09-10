import type { RecipeSourceDraft } from './source-recipe.types.ts';

export const eclairsRecipe = {
  id: 'eclairs', publicationStatus: 'draft',
  source: { file: 'https://www.youtube.com/watch?v=IumsZSrJZeQ', locator: 'External Schär Mix B reference · author recipe text not yet captured' },
  completeness: 'incompleteSource',
  ingredientSections: [{ id: 'draft-choux', title: 'Draft choux pastry', ingredients: [
    { id: 'flour', name: 'Schär Mix B Bread flour', amount: '190 g' }, { id: 'milk', name: 'Milk', amount: '100 ml' },
    { id: 'water', name: 'Water', amount: '100 ml' }, { id: 'butter', name: 'Butter', amount: '100 g' },
    { id: 'eggs', name: 'Eggs', amount: '4' }, { id: 'sugar', name: 'Sugar', amount: '20 g' }, { id: 'salt', name: 'Salt', amount: 'A pinch' },
  ] }],
  steps: [
    { id: 'draft-choux', title: 'Draft: cook the choux base', body: 'Heat the liquid and butter, work in the flour, then dry the paste before adding eggs gradually. Confirm texture and oven method against the author’s recipe.' },
    { id: 'draft-pipe', title: 'Draft: pipe and bake', body: 'Pipe oblong shells and bake until dry and hollow. Temperature, timing and whether to vent the oven remain for review.' },
    { id: 'draft-fill', title: 'Draft: cool and fill', body: 'Cool completely before filling. The author’s cream and glaze are not yet available.' },
  ],
  gapNote: 'This is an external Schär Mix B choux reference, included only to begin review. It is not the author’s tested éclair recipe.',
} satisfies RecipeSourceDraft;
