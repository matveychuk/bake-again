import type { RecipeSourceDraft } from './source-recipe.types.ts';

export const appleCharlotteRecipe = {
  id: 'apple-charlotte',
  source: { file: 'docs/reference/recipe-inventory.xlsx', locator: 'Recipe Archive · Яблучна шарлотка' },
  completeness: 'readyToReview',
  beforeStart: ['This source quantity is for one full large baking tray.', 'Put the tray into a preheated oven.'],
  ingredientSections: [{
    id: 'cake', title: 'Apple charlotte', ingredients: [
      { id: 'apples', name: 'Apples', quantity: { base: null, shopping: { mode: 'nameOnly' } } },
      { id: 'eggs', name: 'Small eggs', quantity: { base: { kind: 'exact', value: 10, unit: 'piece' }, shopping: { mode: 'base', increment: 1, rounding: 'up' } } },
      { id: 'sugar', name: 'Sugar', quantity: { base: { kind: 'exact', value: 200, unit: 'g' }, shopping: { mode: 'base' } } },
      { id: 'flour', name: 'Schär Mix B Bread flour', quantity: { base: { kind: 'exact', value: 240, unit: 'g' }, shopping: { mode: 'base' } } },
      { id: 'tapioca', name: 'Tapioca starch', quantity: { base: { kind: 'exact', value: 30, unit: 'g' }, shopping: { mode: 'base' } } },
      { id: 'xanthan', name: 'Xanthan gum', quantity: { base: { kind: 'exact', value: 1, unit: 'tsp' }, shopping: { mode: 'base' } } },
      { id: 'salt', name: 'Salt', quantity: { base: null, equivalent: { kind: 'exact', value: 1, unit: 'pinch' }, shopping: { mode: 'nameOnly' } } },
      { id: 'vanilla', name: 'Vanillin', quantity: { base: null, shopping: { mode: 'nameOnly' } } },
      { id: 'cinnamon', name: 'Cinnamon', quantity: { base: null, shopping: { mode: 'nameOnly' } } },
    ],
  }],
  steps: [
    { id: 'prepare-apples', title: 'Prepare the apples', body: 'Finely chop the apples in a food processor. Line a baking tray with parchment and spread the apples over it.' },
    { id: 'whip-eggs', title: 'Whip the eggs and sugar', body: 'Beat the eggs and sugar until very light and voluminous.' },
    { id: 'mix-dry', title: 'Mix the dry ingredients', body: 'Combine the flour, tapioca starch, xanthan gum, salt, vanilla and cinnamon.' },
    { id: 'fold-batter', title: 'Finish the batter', body: 'Slowly add the dry mixture to the whipped eggs, then pour the batter over the apples.' },
    { id: 'bake', title: 'Bake', body: 'Bake in a hot oven until set and golden.', meta: '25–30 min', checkpoint: 'The source does not record the oven temperature; confirm it during the next bake.' },
  ],
  translations: {
    uk: {
      completeness: 'readyToReview',
      beforeStart: ['Ця кількість розрахована на одне велике деко.', 'Ставте деко в розігріту духовку.'],
      ingredientSections: [{ id: 'cake', title: 'Яблучна шарлотка', ingredients: [
        { id: 'apples', name: 'Яблука', quantity: { base: null, shopping: { mode: 'nameOnly' } } }, { id: 'eggs', name: 'Невеликі яйця', quantity: { base: { kind: 'exact', value: 10, unit: 'piece' }, shopping: { mode: 'base', increment: 1, rounding: 'up' } } }, { id: 'sugar', name: 'Цукор', quantity: { base: null, shopping: { mode: 'nameOnly' } } }, { id: 'flour', name: 'Борошно Schär Mix B Bread', quantity: { base: null, shopping: { mode: 'nameOnly' } } }, { id: 'tapioca', name: 'Тапіоковий крохмаль', quantity: { base: null, shopping: { mode: 'nameOnly' } } }, { id: 'xanthan', name: 'Ксантанова камедь', quantity: { base: null, shopping: { mode: 'nameOnly' } } }, { id: 'salt', name: 'Сіль', quantity: { base: null, equivalent: { kind: 'exact', value: 1, unit: 'pinch' }, shopping: { mode: 'nameOnly' } } }, { id: 'vanilla', name: 'Ванілін', quantity: { base: null, shopping: { mode: 'nameOnly' } } }, { id: 'cinnamon', name: 'Кориця', quantity: { base: null, shopping: { mode: 'nameOnly' } } },
      ] }],
      steps: [
        { id: 'prepare-apples', title: 'Підготуйте яблука', body: 'Дрібно наріжте яблука в комбайні. Застеліть деко пергаментом і розподіліть яблука.' }, { id: 'whip-eggs', title: 'Збийте яйця з цукром', body: 'Збийте до дуже світлої, пишної маси.' }, { id: 'mix-dry', title: 'Змішайте сухі інгредієнти', body: 'З’єднайте борошно, тапіоковий крохмаль, ксантанову камедь, сіль, ванілін і корицю.' }, { id: 'fold-batter', title: 'Завершіть тісто', body: 'Повільно додайте суху суміш до збитих яєць, потім вилийте тісто на яблука.' }, { id: 'bake', title: 'Випікайте', body: 'Випікайте в гарячій духовці до готовності й золотистого кольору.', meta: '25–30 хв', checkpoint: 'Джерело не містить температури духовки; уточніть її під час наступнього випікання.' },
      ],
    },
    es: {
      completeness: 'readyToReview',
      beforeStart: ['Esta cantidad corresponde a una bandeja grande completa.', 'Introduce la bandeja en el horno precalentado.'],
      ingredientSections: [{ id: 'cake', title: 'Carlota de manzana', ingredients: [
        { id: 'apples', name: 'Manzanas', quantity: { base: null, shopping: { mode: 'nameOnly' } } }, { id: 'eggs', name: 'Huevos pequeños', quantity: { base: { kind: 'exact', value: 10, unit: 'piece' }, shopping: { mode: 'base', increment: 1, rounding: 'up' } } }, { id: 'sugar', name: 'Azúcar', quantity: { base: { kind: 'exact', value: 200, unit: 'g' }, shopping: { mode: 'base' } } }, { id: 'flour', name: 'Harina Schär Mix B Bread', quantity: { base: { kind: 'exact', value: 240, unit: 'g' }, shopping: { mode: 'base' } } }, { id: 'tapioca', name: 'Almidón de tapioca', quantity: { base: { kind: 'exact', value: 30, unit: 'g' }, shopping: { mode: 'base' } } }, { id: 'xanthan', name: 'Goma xantana', quantity: { base: null, shopping: { mode: 'nameOnly' } } }, { id: 'salt', name: 'Sal', quantity: { base: null, equivalent: { kind: 'exact', value: 1, unit: 'pinch' }, shopping: { mode: 'nameOnly' } } }, { id: 'vanilla', name: 'Vainillina', quantity: { base: null, shopping: { mode: 'nameOnly' } } }, { id: 'cinnamon', name: 'Canela', quantity: { base: null, shopping: { mode: 'nameOnly' } } },
      ] }],
      steps: [
        { id: 'prepare-apples', title: 'Prepara las manzanas', body: 'Pica finamente las manzanas en un robot de cocina. Forra una bandeja con papel y reparte las manzanas.' }, { id: 'whip-eggs', title: 'Bate los huevos y el azúcar', body: 'Bate hasta obtener una mezcla muy clara y voluminosa.' }, { id: 'mix-dry', title: 'Mezcla los ingredientes secos', body: 'Combina la harina, el almidón de tapioca, la goma xantana, la sal, la vainillina y la canela.' }, { id: 'fold-batter', title: 'Termina la masa', body: 'Añade lentamente la mezcla seca a los huevos batidos y vierte la masa sobre las manzanas.' }, { id: 'bake', title: 'Hornea', body: 'Hornea en un horno caliente hasta que esté cuajada y dorada.', meta: '25–30 min', checkpoint: 'La fuente no indica la temperatura del horno; confírmala en el próximo horneado.' },
      ],
    },
  },
} satisfies RecipeSourceDraft;
