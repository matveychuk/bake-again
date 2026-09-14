import type { RecipeSourceDraft } from './source-recipe.types.ts';

export const lazyDumplingsRecipe = {
  id: 'lazy-dumplings', publicationStatus: 'draft',
  source: { file: 'docs/reference/recipe-inventory.xlsx', locator: 'Recipe Archive · Ліниві вареники' },
  completeness: 'incompleteSource', beforeStart: ['Let the mixed dough rest for 15–30 minutes.'],
  ingredientSections: [{ id: 'dumplings', title: 'Dumplings', ingredients: [
    { id: 'cottage-cheese', name: 'Cottage cheese', quantity: { base: { kind: 'exact', value: 2, unit: 'packet' }, shopping: { mode: 'base' } } }, { id: 'eggs', name: 'Eggs', quantity: { base: { kind: 'exact', value: 2, unit: 'piece' }, shopping: { mode: 'base', increment: 1, rounding: 'up' } } },
    { id: 'sugar', name: 'Sugar', quantity: { base: { kind: 'exact', value: 3, unit: 'tbsp' }, shopping: { mode: 'base' } } }, { id: 'flour', name: 'Schär Mix B Bread flour', quantity: { base: { kind: 'exact', value: 90, unit: 'g' }, shopping: { mode: 'base' } } },
    { id: 'starch', name: 'Tapioca or corn starch', quantity: { base: { kind: 'exact', value: 7, unit: 'g' }, shopping: { mode: 'base' } }, note: 'Choose one.' },
  ] }],
  steps: [
    { id: 'mix-wet', title: 'Mix cottage cheese, eggs and sugar', body: 'Combine until the mixture is even.' },
    { id: 'add-dry', title: 'Add flour and starch', body: 'Mix the flour and chosen starch first, then work them into the cottage-cheese mixture.' },
    { id: 'rest', title: 'Rest the dough', body: 'Leave the dough to stand for 15–30 minutes.', meta: '15–30 min' },
    { id: 'proposed-cook', title: 'Draft: shape and cook', body: 'Shape and simmer the dumplings only after confirming the author’s method, size and cooking cue. This step must not be treated as tested.' },
  ],
  gapNote: 'The source does not preserve shaping or cooking instructions. The final step is a review prompt, not an instruction to use.',
} satisfies RecipeSourceDraft;
