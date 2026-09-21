import type {
  RecipeSourceDraft,
  StructuredRecipeStep,
} from './source-recipe.types.ts';
import type { RecipeLocale } from './recipe.types.ts';
import { quantityFromGrams, quantityFromSpoons } from './spoon-weights.ts';

const translatedQuantity = {
  base: null,
  shopping: { mode: 'nameOnly' as const },
};

const stepCopy = {
  en: {
    titles: [
      'Blend the base',
      'Add the remaining wet ingredients',
      'Make the batter',
      'Rest the batter',
      'Bake the waffles',
    ],
    instructions: [
      'Blend the cottage cheese, eggs and yogurt until smooth, with no noticeable lumps.',
      'Mix in the neutral oil or softened butter, sugar, salt and vanilla.',
      'In a separate bowl, mix the flour, corn starch and baking powder. Add to the base and stir until no dry flour remains.',
      'Leave to rest for 7–10 minutes.',
      'Heat the waffle maker well. Bake each waffle for 5–7 minutes until golden.',
    ],
    alts: {
      ingredients:
        'Cottage cheese, eggs and natural yogurt together in a white bowl before blending',
      blended:
        'Smooth cottage-cheese, egg and yogurt base with an immersion blender in the bowl',
      flour: 'Gluten-free flour added to the wet waffle base before mixing',
      batter: 'Thick, smooth waffle batter lifted on a spoon above the bowl',
      filling:
        'Berry-speckled waffle batter being spooned into a heated waffle maker',
      baked: 'Two golden berry cottage-cheese waffles in an open waffle maker',
      served:
        'Golden berry cottage-cheese waffles stacked on a pale green plate',
    },
  },
  uk: {
    titles: [
      'Збийте основу',
      'Додайте решту вологих інгредієнтів',
      'Приготуйте тісто',
      'Дайте тісту відпочити',
      'Спечіть вафлі',
    ],
    instructions: [
      'Збийте блендером творог, яйця та йогурт до гладкої маси без помітних грудочок.',
      'Вмішайте олію без запаху або м’яке вершкове масло, цукор, сіль і ваніль.',
      'В окремій мисці змішайте борошно, крохмаль і розпушувач. Додайте до основи й перемішайте, щоб не залишилося сухого борошна.',
      'Залиште на 7–10 хвилин.',
      'Добре розігрійте вафельницю. Випікайте кожну вафлю 5–7 хвилин до золотистого кольору.',
    ],
    alts: {
      ingredients:
        'Творог, яйця та натуральний йогурт у білій мисці перед збиванням',
      blended:
        'Гладка основа з творогу, яєць і йогурту із занурювальним блендером у мисці',
      flour:
        'Безглютенове борошно, додане до вологої основи для вафель перед перемішуванням',
      batter: 'Густе гладке тісто для вафель на ложці над мискою',
      filling:
        'Тісто для вафель з ягодами викладають ложкою в розігріту вафельницю',
      baked: 'Дві золотисті творожні вафлі з ягодами у відкритій вафельниці',
      served: 'Золотисті творожні вафлі з ягодами на світло-зеленій тарілці',
    },
  },
  es: {
    titles: [
      'Tritura la base',
      'Añade los demás ingredientes húmedos',
      'Prepara la masa',
      'Deja reposar la masa',
      'Hornea los gofres',
    ],
    instructions: [
      'Tritura el requesón, los huevos y el yogur hasta obtener una mezcla lisa, sin grumos perceptibles.',
      'Incorpora el aceite neutro o la mantequilla blanda, el azúcar, la sal y la vainilla.',
      'En otro bol, mezcla la harina, el almidón de maíz y la levadura química. Incorpóralos a la base y remueve hasta que no quede harina seca.',
      'Deja reposar durante 7–10 minutos.',
      'Calienta bien la gofrera. Hornea cada gofre durante 5–7 minutos, hasta que esté dorado.',
    ],
    alts: {
      ingredients:
        'Requesón, huevos y yogur natural juntos en un bol blanco antes de triturarlos',
      blended:
        'Base lisa de requesón, huevos y yogur con una batidora de mano dentro del bol',
      flour:
        'Harina sin gluten añadida a la base húmeda de los gofres antes de mezclar',
      batter:
        'Masa espesa y lisa para gofres levantada con una cuchara sobre el bol',
      filling:
        'Masa para gofres con frutos rojos colocada con una cuchara en la gofrera caliente',
      baked:
        'Dos gofres dorados de requesón con frutos rojos en una gofrera abierta',
      served:
        'Gofres dorados de requesón con frutos rojos en un plato verde claro',
    },
  },
} as const;

function stepsForLocale(locale: RecipeLocale): StructuredRecipeStep[] {
  const copy = stepCopy[locale];
  const media = (id: string, file: string, alt: string) => ({
    id,
    src: `/media/recipes/cottage-cheese-waffles/selected/${file}`,
    alt,
  });
  return [
    {
      id: 'blend-base',
      title: copy.titles[0],
      body: copy.instructions[0],
      cookIngredients: [
        { ingredientId: 'cottage-cheese' },
        { ingredientId: 'eggs' },
        { ingredientId: 'yogurt' },
      ],
      media: [
        media(
          'ingredients-before-blending',
          'step-01-ingredients-before-blending-author-v1.jpeg',
          copy.alts.ingredients,
        ),
        media(
          'blended-base',
          'step-01-blended-base-author-v1.jpeg',
          copy.alts.blended,
        ),
      ],
    },
    {
      id: 'add-wet',
      title: copy.titles[1],
      body: copy.instructions[1],
      cookIngredients: [
        { ingredientId: 'oil' },
        { ingredientId: 'sugar' },
        { ingredientId: 'salt' },
        { ingredientId: 'vanilla' },
      ],
    },
    {
      id: 'mix-dry',
      title: copy.titles[2],
      body: copy.instructions[2],
      cookIngredients: [
        { ingredientId: 'flour' },
        { ingredientId: 'corn-starch' },
        { ingredientId: 'baking-powder' },
      ],
      media: [
        media(
          'add-dry-ingredients',
          'step-03-add-dry-author-v1.jpeg',
          copy.alts.flour,
        ),
        media(
          'mixed-batter',
          'step-03-mixed-batter-author-v1.jpeg',
          copy.alts.batter,
        ),
      ],
    },
    { id: 'rest', title: copy.titles[3], body: copy.instructions[3] },
    {
      id: 'bake',
      title: copy.titles[4],
      body: copy.instructions[4],
      media: [
        media(
          'fill-waffle-maker',
          'step-05-fill-waffle-maker-author-v1.jpeg',
          copy.alts.filling,
        ),
        media(
          'baked-waffles',
          'step-05-baked-waffles-author-v1.jpeg',
          copy.alts.baked,
        ),
        {
          id: 'served-waffles',
          src: '/images/recipes/cottage-cheese-waffles-author-v1.jpeg',
          alt: copy.alts.served,
        },
      ],
    },
  ];
}

export const cottageCheeseWafflesRecipe = {
  publicationStatus: 'published',
  id: 'cottage-cheese-waffles',
  source: {
    file: 'docs/reference/recipe-inventory.xlsx',
    locator: 'Recipe Archive · Творожні вафлі',
  },
  completeness: 'readyToReview',
  presentation: 'concise',
  evidence: {
    status: 'tested',
    explanation:
      'The author confirms this exact recipe has been baked successfully.',
  },
  yield: {
    id: 'eight-waffles',
    label: '8 waffles',
    count: { kind: 'exact', value: 8 },
    unit: 'serving',
  },
  timing: {
    activeMinutes: 30,
    totalElapsedMinutes: 40,
    phases: [
      {
        id: 'batter-rest',
        label: 'Batter rest',
        duration: { kind: 'range', min: 7, max: 10, unit: 'minute' },
        relatedStepId: 'rest',
      },
      {
        id: 'waffle-baking',
        label: 'Bake each waffle',
        duration: { kind: 'range', min: 5, max: 7, unit: 'minute' },
        relatedStepId: 'bake',
      },
    ],
  },
  ingredientSections: [
    {
      id: 'waffles',
      title: 'Waffles',
      ingredients: [
        {
          id: 'cottage-cheese',
          name: 'Cottage cheese',
          quantity: {
            base: { kind: 'exact', value: 200, unit: 'g' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'eggs',
          name: 'Eggs',
          quantity: {
            base: { kind: 'exact', value: 2, unit: 'piece' },
            shopping: { mode: 'base', increment: 1, rounding: 'up' },
          },
        },
        {
          id: 'yogurt',
          name: 'Natural yogurt',
          quantity: {
            base: { kind: 'exact', value: 100, unit: 'ml' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'oil',
          name: 'Neutral oil or softened butter',
          quantity: {
            base: { kind: 'exact', value: 40, unit: 'g' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'flour',
          name: 'Schär Mix B Bread flour',
          quantity: quantityFromGrams('schar-mix-b', 120),
        },
        {
          id: 'corn-starch',
          name: 'Corn starch',
          quantity: quantityFromSpoons('corn-starch', 1, 'tbsp'),
        },
        {
          id: 'baking-powder',
          name: 'Baking powder',
          quantity: quantityFromSpoons('baking-powder', 1, 'tsp'),
        },
        {
          id: 'sugar',
          name: 'Sugar',
          quantity: quantityFromGrams('granulated-sugar', 20),
        },
        {
          id: 'salt',
          name: 'Salt',
          scaling: 'fixed',
          quantity: {
            base: null,
            equivalent: { kind: 'exact', value: 1, unit: 'pinch' },
            shopping: { mode: 'nameOnly' },
          },
        },
        {
          id: 'vanilla',
          name: 'Vanilla',
          quantity: { base: null, shopping: { mode: 'nameOnly' } },
        },
      ],
    },
  ],
  steps: stepsForLocale('en'),
  translations: {
    uk: {
      completeness: 'readyToReview',
      presentation: 'concise',
      evidence: {
        status: 'tested',
        explanation: 'Авторка підтверджує: цю версію успішно випікали.',
      },
      yield: {
        id: 'eight-waffles',
        label: '8 вафель',
        count: { kind: 'exact', value: 8 },
        unit: 'serving',
      },
      timing: {
        activeMinutes: 30,
        totalElapsedMinutes: 40,
        phases: [
          {
            id: 'batter-rest',
            label: 'Відпочинок тіста',
            duration: { kind: 'range', min: 7, max: 10, unit: 'minute' },
          },
          {
            id: 'waffle-baking',
            label: 'Випікання однієї вафлі',
            duration: { kind: 'range', min: 5, max: 7, unit: 'minute' },
          },
        ],
      },
      ingredientSections: [
        {
          id: 'waffles',
          title: 'Вафлі',
          ingredients: [
            {
              id: 'cottage-cheese',
              name: 'Творог',
              quantity: translatedQuantity,
            },
            { id: 'eggs', name: 'Яйця', quantity: translatedQuantity },
            {
              id: 'yogurt',
              name: 'Натуральний йогурт',
              quantity: translatedQuantity,
            },
            {
              id: 'oil',
              name: 'Олія без запаху або м’яке вершкове масло',
              quantity: translatedQuantity,
            },
            {
              id: 'flour',
              name: 'Борошняна суміш Schär Mix B Bread',
              quantity: translatedQuantity,
            },
            {
              id: 'corn-starch',
              name: 'Кукурудзяний крохмаль',
              quantity: translatedQuantity,
            },
            {
              id: 'baking-powder',
              name: 'Розпушувач',
              quantity: translatedQuantity,
            },
            { id: 'sugar', name: 'Цукор', quantity: translatedQuantity },
            { id: 'salt', name: 'Сіль', quantity: translatedQuantity },
            { id: 'vanilla', name: 'Ваніль', quantity: translatedQuantity },
          ],
        },
      ],
      steps: stepsForLocale('uk'),
    },
    es: {
      completeness: 'readyToReview',
      presentation: 'concise',
      evidence: {
        status: 'tested',
        explanation:
          'La autora confirma que esta versión se ha horneado con éxito.',
      },
      yield: {
        id: 'eight-waffles',
        label: '8 gofres',
        count: { kind: 'exact', value: 8 },
        unit: 'serving',
      },
      timing: {
        activeMinutes: 30,
        totalElapsedMinutes: 40,
        phases: [
          {
            id: 'batter-rest',
            label: 'Reposo de la masa',
            duration: { kind: 'range', min: 7, max: 10, unit: 'minute' },
          },
          {
            id: 'waffle-baking',
            label: 'Hornear cada gofre',
            duration: { kind: 'range', min: 5, max: 7, unit: 'minute' },
          },
        ],
      },
      ingredientSections: [
        {
          id: 'waffles',
          title: 'Gofres',
          ingredients: [
            {
              id: 'cottage-cheese',
              name: 'Requesón',
              quantity: translatedQuantity,
            },
            { id: 'eggs', name: 'Huevos', quantity: translatedQuantity },
            {
              id: 'yogurt',
              name: 'Yogur natural',
              quantity: translatedQuantity,
            },
            {
              id: 'oil',
              name: 'Aceite neutro o mantequilla blanda',
              quantity: translatedQuantity,
            },
            {
              id: 'flour',
              name: 'Mezcla de harina Schär Mix B Bread',
              quantity: translatedQuantity,
            },
            {
              id: 'corn-starch',
              name: 'Almidón de maíz',
              quantity: translatedQuantity,
            },
            {
              id: 'baking-powder',
              name: 'Levadura química',
              quantity: translatedQuantity,
            },
            { id: 'sugar', name: 'Azúcar', quantity: translatedQuantity },
            {
              id: 'salt',
              name: 'Sal',
              quantity: translatedQuantity,
            },
            { id: 'vanilla', name: 'Vainilla', quantity: translatedQuantity },
          ],
        },
      ],
      steps: stepsForLocale('es'),
    },
  },
} satisfies RecipeSourceDraft;
