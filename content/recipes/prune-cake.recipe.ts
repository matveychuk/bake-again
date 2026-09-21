import type {
  RecipeSourceDraft,
  RecipeSourceDraftContent,
  StructuredIngredientSection,
  StructuredRecipeStep,
} from './source-recipe.types.ts';
import { quantityFromGrams, quantityFromSpoons } from './spoon-weights.ts';

type Locale = 'en' | 'uk';

const text = (locale: Locale, en: string, uk: string) =>
  locale === 'uk' ? uk : en;

const exact = (value: number, unit: 'g' | 'piece' | 'tbsp') => ({
  base: { kind: 'exact' as const, value, unit },
  shopping: { mode: 'base' as const },
});

const range = (min: number, max: number, unit: 'tbsp') => ({
  base: { kind: 'range' as const, min, max, unit },
  shopping: { mode: 'base' as const },
});

function ingredientSections(locale: Locale): StructuredIngredientSection[] {
  return [
    {
      id: 'cake',
      title: text(locale, 'Cake', 'Корж'),
      ingredients: [
        {
          id: 'eggs',
          name: text(locale, 'Eggs', 'Яйця'),
          quantity: {
            ...exact(4, 'piece'),
            shopping: { mode: 'base', increment: 1, rounding: 'up' },
          },
        },
        {
          id: 'greek-yogurt',
          name: text(locale, 'Greek yogurt', 'Грецький йогурт'),
          quantity: exact(250, 'g'),
        },
        {
          id: 'sugar',
          name: text(locale, 'Sugar', 'Цукор'),
          quantity: quantityFromGrams('granulated-sugar', 200),
        },
        {
          id: 'sunflower-oil',
          name: text(locale, 'Sunflower oil', 'Соняшникова олія'),
          quantity: exact(2, 'tbsp'),
        },
        {
          id: 'sweetened-condensed-milk',
          name: text(locale, 'Sweetened condensed milk', 'Згущене молоко'),
          quantity: range(5, 6, 'tbsp'),
        },
        {
          id: 'leavener',
          name: text(locale, 'Baking powder', 'Розпушувач'),
          quantity: quantityFromSpoons('baking-powder', 2, 'tsp'),
        },
        {
          id: 'cocoa',
          name: text(locale, 'Cocoa', 'Какао'),
          quantity: quantityFromSpoons('cocoa-powder', 5, 'tbsp'),
        },
        {
          id: 'flour',
          name: text(
            locale,
            'Schär Mix B Bread flour',
            'Борошно Schär Mix B Bread',
          ),
          quantity: quantityFromSpoons('schar-mix-b', 5, 'tbsp'),
        },
      ],
    },
    {
      id: 'cream',
      title: text(locale, 'Cream and decoration', 'Крем і декор'),
      ingredients: [
        {
          id: 'cream-base',
          name: text(
            locale,
            'Sour cream or Greek yogurt',
            'Сметана або грецький йогурт',
          ),
          quantity: exact(400, 'g'),
        },
        {
          id: 'cream-sugar',
          name: text(locale, 'Sugar', 'Цукор'),
          quantity: { base: null, shopping: { mode: 'nameOnly' } },
          note: text(locale, 'To taste', 'До смаку'),
        },
        {
          id: 'prunes',
          name: text(locale, 'Prunes', 'Чорнослив'),
          quantity: exact(150, 'g'),
        },
        {
          id: 'nuts',
          name: text(locale, 'Walnuts or pecans', 'Волоські горіхи або пекан'),
          quantity: { base: null, shopping: { mode: 'nameOnly' } },
        },
      ],
    },
    {
      id: 'glaze',
      title: text(locale, 'Chocolate glaze', 'Шоколадна поливка'),
      ingredients: [
        {
          id: 'glaze-sour-cream',
          name: text(locale, 'Sour cream or cream', 'Сметана або вершки'),
          quantity: exact(2, 'tbsp'),
        },
        {
          id: 'glaze-sugar',
          name: text(locale, 'Sugar', 'Цукор'),
          quantity: quantityFromSpoons('granulated-sugar', 2, 'tbsp'),
        },
        {
          id: 'glaze-cocoa',
          name: text(locale, 'Cocoa', 'Какао'),
          quantity: quantityFromSpoons('cocoa-powder', 2, 'tbsp'),
        },
        {
          id: 'butter',
          name: text(locale, 'Butter', 'Вершкове масло'),
          quantity: exact(50, 'g'),
        },
      ],
    },
  ];
}

function steps(locale: Locale): StructuredRecipeStep[] {
  if (locale === 'uk') {
    return [
      {
        id: 'whip-eggs',
        title: 'Збийте яйця з цукром',
        body: 'Працюйте міксером до світлої піни.',
        cookIngredients: [{ ingredientId: 'eggs' }, { ingredientId: 'sugar' }],
      },
      {
        id: 'add-wet',
        title: 'Додайте рідкі інгредієнти',
        body: 'Йогурт, олію та згущене молоко перемішайте з яєчною сумішшю.',
        cookIngredients: [
          { ingredientId: 'greek-yogurt' },
          { ingredientId: 'sunflower-oil' },
          { ingredientId: 'sweetened-condensed-milk' },
        ],
      },
      {
        id: 'finish-batter',
        title: 'Замісіть тісто',
        body: 'Окремо змішайте борошно, какао й розпушувач. Частинами введіть у рідку суміш, обережно перемішуючи міксером.',
        cookIngredients: [
          { ingredientId: 'leavener' },
          { ingredientId: 'cocoa' },
          { ingredientId: 'flour' },
        ],
      },
      {
        id: 'bake-covered',
        meta: '200°C · 30 хв',
        title: 'Випікайте під фольгою',
        body: 'Застеліть круглу форму діаметром 26 см фольгою, вилийте тісто й накрийте зверху фольгою. Поставте в розігріту духовку.',
      },
      {
        id: 'bake-uncovered',
        meta: '200°C · 30 хв',
        title: 'Допечіть без фольги',
        body: 'Зніміть верхню фольгу й поверніть форму в духовку.',
      },
      {
        id: 'cool-and-slice',
        title: 'Остудіть і розріжте',
        body: 'Повністю охолоджений корж розріжте горизонтально на три частини.',
        media: [
          {
            id: 'prune-cake-three-layers-v2',
            src: '/media/recipes/prune-cake/selected/three-layers-v2.png',
            alt: 'Три рівні круглі шоколадні коржі після розрізання',
          },
        ],
      },
      {
        id: 'make-cream',
        title: 'Приготуйте крем',
        body: 'Сметану або йогурт змішайте із цукром до смаку. Трохи дрібно нарізаного чорносливу відкладіть для декору, решту подрібніть і вмішайте в крем.',
        cookIngredients: [
          { ingredientId: 'cream-base' },
          { ingredientId: 'cream-sugar' },
          { ingredientId: 'prunes' },
        ],
        media: [
          {
            id: 'prune-cake-prune-cream-v2',
            src: '/media/recipes/prune-cake/selected/prune-cream-v2.png',
            alt: 'Густий світлий крем із дрібними шматочками чорносливу',
          },
        ],
      },
      {
        id: 'stack-layers',
        title: 'З’єднайте два коржі',
        body: 'Перший корж змастіть кремом, накрийте другим і також змастіть.',
      },
      {
        id: 'assemble-mound',
        title: 'Викладіть гірку',
        body: 'Третій корж наріжте квадратними шматочками, перемішайте із залишком крему й викладіть зверху.',
        media: [
          {
            id: 'prune-cake-cubes-in-cream-v2',
            src: '/media/recipes/prune-cake/selected/cake-cubes-in-cream-v2.png',
            alt: 'Шматочки шоколадного коржа, перемішані з кремом і чорносливом',
          },
          {
            id: 'prune-cake-mound-assembly-v2',
            src: '/media/recipes/prune-cake/selected/mound-assembly-v2.png',
            alt: 'Гірка шматочків коржа в кремі на двох промащених коржах',
          },
        ],
      },
      {
        id: 'glaze-and-decorate',
        title: 'Полийте й прикрасьте',
        body: 'У каструльці прогрійте сметану або вершки, цукор, какао й масло до однорідності, не доводячи до кипіння. Гарячою поливкою полийте торт. Додайте відкладений чорнослив і підсушені дрібно порізані горіхи.',
        cookIngredients: [
          { ingredientId: 'glaze-sour-cream' },
          { ingredientId: 'glaze-sugar' },
          { ingredientId: 'glaze-cocoa' },
          { ingredientId: 'butter' },
          { ingredientId: 'nuts' },
        ],
        media: [
          {
            id: 'prune-cake-finished-v2',
            src: '/images/recipes/prune-cake-card-v2.png',
            alt: 'Готовий шоколадний торт із гіркою шматочків у кремі, поливкою, чорносливом і горіхами',
          },
        ],
      },
    ];
  }

  return [
    {
      id: 'whip-eggs',
      title: 'Whip the eggs and sugar',
      body: 'Use a mixer until the mixture is pale and foamy.',
      cookIngredients: [{ ingredientId: 'eggs' }, { ingredientId: 'sugar' }],
    },
    {
      id: 'add-wet',
      title: 'Add the wet ingredients',
      body: 'Mix the yogurt, oil and condensed milk into the egg mixture.',
      cookIngredients: [
        { ingredientId: 'greek-yogurt' },
        { ingredientId: 'sunflower-oil' },
        { ingredientId: 'sweetened-condensed-milk' },
      ],
    },
    {
      id: 'finish-batter',
      title: 'Finish the batter',
      body: 'Mix the flour, cocoa and baking powder separately. Add them to the wet mixture in batches, mixing gently with the mixer.',
      cookIngredients: [
        { ingredientId: 'leavener' },
        { ingredientId: 'cocoa' },
        { ingredientId: 'flour' },
      ],
    },
    {
      id: 'bake-covered',
      meta: '200°C · 30 min',
      title: 'Bake under foil',
      body: 'Line a 26 cm round tin with foil, add the batter and cover the top with foil. Place it in the preheated oven.',
    },
    {
      id: 'bake-uncovered',
      meta: '200°C · 30 min',
      title: 'Finish baking uncovered',
      body: 'Remove the top foil and return the tin to the oven.',
    },
    {
      id: 'cool-and-slice',
      title: 'Cool and slice',
      body: 'Slice the completely cooled cake horizontally into three layers.',
      media: [
        {
          id: 'prune-cake-three-layers-v2',
          src: '/media/recipes/prune-cake/selected/three-layers-v2.png',
          alt: 'Three even round chocolate cake layers after slicing',
        },
      ],
    },
    {
      id: 'make-cream',
      title: 'Make the cream',
      body: 'Mix the sour cream or yogurt with sugar to taste. Reserve a little finely chopped prune for decoration; chop or blend the rest and fold it into the cream.',
      cookIngredients: [
        { ingredientId: 'cream-base' },
        { ingredientId: 'cream-sugar' },
        { ingredientId: 'prunes' },
      ],
      media: [
        {
          id: 'prune-cake-prune-cream-v2',
          src: '/media/recipes/prune-cake/selected/prune-cream-v2.png',
          alt: 'Thick pale cream with small pieces of prune',
        },
      ],
    },
    {
      id: 'stack-layers',
      title: 'Stack two layers',
      body: 'Spread cream over the first layer, add the second and spread it with cream too.',
    },
    {
      id: 'assemble-mound',
      title: 'Build the mound',
      body: 'Cut the third layer into squares, mix them with the remaining cream and mound them on top.',
      media: [
        {
          id: 'prune-cake-cubes-in-cream-v2',
          src: '/media/recipes/prune-cake/selected/cake-cubes-in-cream-v2.png',
          alt: 'Chocolate cake cubes mixed with prune cream',
        },
        {
          id: 'prune-cake-mound-assembly-v2',
          src: '/media/recipes/prune-cake/selected/mound-assembly-v2.png',
          alt: 'A mound of cream-coated cake cubes on two filled cake layers',
        },
      ],
    },
    {
      id: 'glaze-and-decorate',
      title: 'Glaze and decorate',
      body: 'Warm the sour cream or cream, sugar, cocoa and butter together in a small saucepan until smooth, without letting the mixture boil. Pour the glaze over the cake while hot. Finish with the reserved prune pieces and toasted, finely chopped nuts.',
      cookIngredients: [
        { ingredientId: 'glaze-sour-cream' },
        { ingredientId: 'glaze-sugar' },
        { ingredientId: 'glaze-cocoa' },
        { ingredientId: 'butter' },
        { ingredientId: 'nuts' },
      ],
      media: [
        {
          id: 'prune-cake-finished-v2',
          src: '/images/recipes/prune-cake-card-v2.png',
          alt: 'Finished chocolate cake with a mound of cream-coated cubes, glaze, prunes and nuts',
        },
      ],
    },
  ];
}

function recipeContent(locale: Locale): RecipeSourceDraftContent {
  return {
    presentation: 'concise',
    completeness: 'readyToReview',
    yield: {
      id: 'one-cake',
      label: text(locale, '1 cake', '1 торт'),
      count: { kind: 'exact', value: 1 },
      unit: 'cake',
    },
    geometry: {
      id: 'round-26cm',
      label: text(locale, '26 cm round tin', 'Кругла форма 26 см'),
      kind: 'bakingPan',
      application: 'bake-in',
      shape: 'round',
      diameterCm: 26,
    },
    timing: {
      activeMinutes: 60,
      totalElapsedMinutes: null,
      planningNote: {
        text: text(
          locale,
          'Let the cake cool completely before slicing it into layers.',
          'Перед розрізанням повністю остудіть корж.',
        ),
      },
      phases: [
        {
          id: 'bake-covered',
          label: text(locale, 'Bake covered', 'Випікання під фольгою'),
          duration: { kind: 'exact', value: 30, unit: 'minute' },
          relatedStepId: 'bake-covered',
        },
        {
          id: 'bake-uncovered',
          label: text(locale, 'Bake uncovered', 'Випікання без фольги'),
          duration: { kind: 'exact', value: 30, unit: 'minute' },
          relatedStepId: 'bake-uncovered',
        },
      ],
    },
    ingredientSections: ingredientSections(locale),
    steps: steps(locale),
  };
}

export const pruneCakeRecipe = {
  id: 'prune-cake',
  publicationStatus: 'published',
  source: {
    file: 'docs/reference/recipe-inventory.xlsx',
    locator:
      'Recipe Archive · Торт з чорносливом; author clarification on 2026-09-20',
  },
  ...recipeContent('en'),
  translations: { uk: recipeContent('uk') },
} satisfies RecipeSourceDraft;
