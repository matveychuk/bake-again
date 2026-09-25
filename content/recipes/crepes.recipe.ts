import type {
  RecipeSourceDraft,
  StructuredRecipeStep,
} from './source-recipe.types.ts';
import type { RecipeLocale } from './recipe.types.ts';
import { quantityFromGrams } from './spoon-weights.ts';

const stepCopy = {
  uk: {
    titles: [
      'Збийте густу основу',
      'Додайте молоко й залиште тісто',
      'Додайте воду й олію',
      'Посмажте млинці',
    ],
    instructions: [
      'З’єднайте яйця, борошно, цукор і сіль. Влийте трохи молока — лише стільки, щоб блендер або міксер міг працювати. Збийте до гладкої густої маси без грудочок.',
      'Поступово вмішайте решту молока. Залиште на 15–20 хвилин.',
      'Вмішайте гарячу воду, потім олію. Тісто має легко розтікатися по пательні.',
      'Перед першим млинцем змастіть пательню тонким шаром олії. Налийте тісто й розподіліть його, нахиляючи пательню. Коли поверхня стане матовою з дрібними отворами, а краї легко відділятимуться, піддіть їх лопаткою, переверніть млинець і досмажте інший бік.',
    ],
    tip: 'У густій основі легше розбити грудочки.',
    milkStart: 'Трохи молока для густої основи.',
    milkRest: 'Решта молока.',
    mediaTitles: [
      'Перед перевертанням',
      'Відділення краю',
      'Після перевертання',
    ],
    alts: [
      'Гладка густа основа для млинців на металевій ложці',
      'Млинець на пательні: поверхня схоплюється й з’являються дрібні отвори',
      'Лопатка піддіває край млинця на пательні',
      'Золотиста сторона перевернутого млинця на пательні',
    ],
  },
  en: {
    titles: [
      'Blend a thick base',
      'Add the milk and rest',
      'Add the water and oil',
      'Cook the crepes',
    ],
    instructions: [
      'Combine the eggs, flour, sugar and salt. Pour in a little milk — just enough for the blender or mixer to work. Blend to a smooth, thick base with no lumps.',
      'Gradually mix in the remaining milk. Leave to rest for 15–20 minutes.',
      'Mix in the hot water, then the oil. The batter should spread easily across the pan.',
      'Before the first crepe, coat the pan with a thin layer of oil. Pour in the batter and tilt the pan to spread it. When the surface is matte with small holes and the edges release easily, loosen them with a spatula, flip the crepe and finish cooking the other side.',
    ],
    tip: 'Lumps break up more easily in a thick base.',
    milkStart: 'A little milk for the thick base.',
    milkRest: 'Remaining milk.',
    mediaTitles: ['Before flipping', 'Releasing the edge', 'After flipping'],
    alts: [
      'Smooth thick crepe base coating a metal spoon',
      'Crepe setting in a pan with small holes appearing on the surface',
      'A spatula lifting the edge of a crepe in a pan',
      'Golden cooked side of a flipped crepe in a pan',
    ],
  },
  es: {
    titles: [
      'Bate una base espesa',
      'Añade la leche y deja reposar',
      'Añade el agua y el aceite',
      'Cocina los crepes',
    ],
    instructions: [
      'Mezcla los huevos, la harina, el azúcar y la sal. Añade un poco de leche, solo la necesaria para que funcione la batidora. Bate hasta obtener una base espesa, lisa y sin grumos.',
      'Incorpora poco a poco el resto de la leche. Deja reposar durante 15–20 minutos.',
      'Incorpora el agua caliente y después el aceite. La masa debe extenderse fácilmente por la sartén.',
      'Antes del primer crepe, unta la sartén con una capa fina de aceite. Vierte la masa e inclina la sartén para extenderla. Cuando la superficie esté mate, con pequeños agujeros, y los bordes se despeguen fácilmente, levántalos con una espátula, dale la vuelta al crepe y termina de cocinar el otro lado.',
    ],
    tip: 'Los grumos se deshacen más fácilmente en una base espesa.',
    milkStart: 'Un poco de leche para la base espesa.',
    milkRest: 'El resto de la leche.',
    mediaTitles: [
      'Antes de darle la vuelta',
      'Despegar el borde',
      'Después de darle la vuelta',
    ],
    alts: [
      'Base espesa y lisa para crepes sobre una cuchara de metal',
      'Crepe cuajándose en una sartén con pequeños agujeros en la superficie',
      'Una espátula levantando el borde de un crepe en una sartén',
      'Lado dorado de un crepe volteado en una sartén',
    ],
  },
} as const;

function stepsForLocale(locale: RecipeLocale): StructuredRecipeStep[] {
  const copy = stepCopy[locale];
  const media = (id: string, file: string, alt: string, title?: string) => ({
    id,
    src: `/media/recipes/crepes/selected/${file}`,
    alt,
    ...(title ? { title } : {}),
  });
  return [
    {
      id: 'start-batter',
      title: copy.titles[0],
      body: copy.instructions[0],
      tip: copy.tip,
      cookIngredients: [
        { ingredientId: 'eggs' },
        { ingredientId: 'flour' },
        { ingredientId: 'sugar' },
        { ingredientId: 'salt' },
        { ingredientId: 'milk', quantity: 'omit', note: copy.milkStart },
      ],
      media: [
        media(
          'batter-smooth-base',
          'step-01-batter-smooth-base-c2-v1.webp',
          copy.alts[0],
        ),
      ],
    },
    {
      id: 'add-milk',
      title: copy.titles[1],
      body: copy.instructions[1],
      cookIngredients: [
        { ingredientId: 'milk', quantity: 'omit', note: copy.milkRest },
      ],
    },
    {
      id: 'finish-batter',
      title: copy.titles[2],
      body: copy.instructions[2],
      cookIngredients: [{ ingredientId: 'water' }, { ingredientId: 'oil' }],
    },
    {
      id: 'cook',
      title: copy.titles[3],
      body: copy.instructions[3],
      cookIngredients: [{ ingredientId: 'pan-oil' }],
      media: [
        media(
          'crepe-batter-setting',
          'step-05-crepe-batter-setting-s2b-v1.webp',
          copy.alts[1],
          copy.mediaTitles[0],
        ),
        media(
          'crepe-edge-lift',
          'step-05-crepe-edge-lift-s2b-v1.webp',
          copy.alts[2],
          copy.mediaTitles[1],
        ),
        media(
          'crepe-golden-side',
          'step-05-crepe-golden-side-s2b-v1.webp',
          copy.alts[3],
          copy.mediaTitles[2],
        ),
      ],
    },
  ];
}

export const crepesRecipe = {
  publicationStatus: 'published',
  id: 'crepes',
  source: {
    file: 'docs/reference/recipe-inventory.xlsx',
    locator: 'Recipe Archive · Млинці',
  },
  completeness: 'readyToReview',
  presentation: 'concise',
  evidence: {
    status: 'tested',
    explanation: 'This exact version has been cooked successfully.',
  },
  yield: {
    id: 'ten-crepes',
    label: '10 crepes',
    count: { kind: 'exact', value: 10 },
    unit: 'crepe',
  },
  geometry: {
    id: 'round-pan-28-cm',
    label: '28 cm round pan',
    kind: 'other',
    application: 'other',
    shape: 'round',
    diameterCm: 28,
  },
  timing: {
    activeMinutes: 40,
    totalElapsedMinutes: 60,
    planningNote: {
      text: 'Includes {duration} of batter rest.',
      phaseId: 'batter-rest',
    },
    phases: [
      {
        id: 'batter-rest',
        label: 'Batter rest',
        duration: { kind: 'range', min: 15, max: 20, unit: 'minute' },
        relatedStepId: 'add-milk',
      },
    ],
  },

  ingredientSections: [
    {
      id: 'batter',
      title: 'Crepe batter',
      ingredients: [
        {
          id: 'eggs',
          name: 'Eggs',
          quantity: {
            base: { kind: 'exact', value: 5, unit: 'piece' },
            equivalent: { kind: 'exact', value: 280, unit: 'g' },
            shopping: { mode: 'base', increment: 1, rounding: 'up' },
          },
        },
        {
          id: 'flour',
          name: 'Schär Mix B Bread flour',
          quantity: quantityFromGrams('schar-mix-b', 140),
        },
        {
          id: 'milk',
          name: 'Milk',
          quantity: {
            base: { kind: 'exact', value: 500, unit: 'ml' },
            shopping: { mode: 'base' },
          },
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
          id: 'water',
          name: 'Hot water',
          quantity: {
            base: { kind: 'exact', value: 50, unit: 'ml' },
            shopping: { mode: 'base', defaultSelected: false },
          },
        },
        {
          id: 'oil',
          name: 'Neutral oil',
          quantity: {
            base: { kind: 'exact', value: 25, unit: 'g' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'pan-oil',
          name: 'Oil for the pan',
          quantity: { base: null, shopping: { mode: 'nameOnly' } },
          note: 'For greasing.',
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
        explanation: 'Цю версію успішно готували.',
      },
      yield: {
        id: 'ten-crepes',
        label: '10 млинців',
        count: { kind: 'exact', value: 10 },
        unit: 'crepe',
      },
      geometry: {
        id: 'round-pan-28-cm',
        label: 'Кругла пательня, 28 см',
        kind: 'other',
        application: 'other',
        shape: 'round',
        diameterCm: 28,
      },
      timing: {
        activeMinutes: 40,
        totalElapsedMinutes: 60,
        planningNote: {
          text: 'Включає {duration} відпочинку тіста.',
          phaseId: 'batter-rest',
        },
        phases: [
          {
            id: 'batter-rest',
            label: 'Відпочинок тіста',
            duration: { kind: 'range', min: 15, max: 20, unit: 'minute' },
            relatedStepId: 'add-milk',
          },
        ],
      },

      ingredientSections: [
        {
          id: 'batter',
          title: 'Тісто для млинців',
          ingredients: [
            {
              id: 'eggs',
              name: 'Яйця',
              quantity: {
                base: { kind: 'exact', value: 5, unit: 'piece' },
                equivalent: null,
                shopping: { mode: 'base', increment: 1, rounding: 'up' },
              },
            },
            {
              id: 'flour',
              name: 'Борошно Schär Mix B Bread',
              quantity: {
                base: null,
                equivalent: null,
                shopping: { mode: 'nameOnly' },
              },
            },
            {
              id: 'milk',
              name: 'Молоко',
              quantity: { base: null, shopping: { mode: 'nameOnly' } },
            },
            {
              id: 'sugar',
              name: 'Цукор',
              quantity: {
                base: null,
                equivalent: null,
                shopping: { mode: 'nameOnly' },
              },
            },
            {
              id: 'salt',
              name: 'Сіль',
              quantity: {
                base: null,
                equivalent: { kind: 'exact', value: 1, unit: 'pinch' },
                shopping: { mode: 'nameOnly' },
              },
            },
            {
              id: 'water',
              name: 'Гаряча вода',
              quantity: { base: null, shopping: { mode: 'nameOnly' } },
            },
            {
              id: 'oil',
              name: 'Олія без запаху',
              quantity: {
                base: null,
                equivalent: null,
                shopping: { mode: 'nameOnly' },
              },
            },
            {
              id: 'pan-oil',
              name: 'Олія для пательні',
              quantity: { base: null, shopping: { mode: 'nameOnly' } },
              note: 'Для змащування.',
            },
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
        explanation: 'Esta versión se ha preparado con éxito.',
      },
      yield: {
        id: 'ten-crepes',
        label: '10 crepes',
        count: { kind: 'exact', value: 10 },
        unit: 'crepe',
      },
      geometry: {
        id: 'round-pan-28-cm',
        label: 'Sartén redonda de 28 cm',
        kind: 'other',
        application: 'other',
        shape: 'round',
        diameterCm: 28,
      },
      timing: {
        activeMinutes: 40,
        totalElapsedMinutes: 60,
        planningNote: {
          text: 'Incluye {duration} de reposo de la masa.',
          phaseId: 'batter-rest',
        },
        phases: [
          {
            id: 'batter-rest',
            label: 'Reposo de la masa',
            duration: { kind: 'range', min: 15, max: 20, unit: 'minute' },
            relatedStepId: 'add-milk',
          },
        ],
      },
      ingredientSections: [
        {
          id: 'batter',
          title: 'Masa para crepes',
          ingredients: [
            {
              id: 'eggs',
              name: 'Huevos',
              quantity: {
                base: { kind: 'exact', value: 5, unit: 'piece' },
                equivalent: { kind: 'exact', value: 280, unit: 'g' },
                shopping: { mode: 'base', increment: 1, rounding: 'up' },
              },
            },
            {
              id: 'flour',
              name: 'Harina Schär Mix B Bread',
              quantity: {
                base: null,
                equivalent: { kind: 'exact', value: 140, unit: 'g' },
                shopping: { mode: 'nameOnly' },
              },
            },
            {
              id: 'milk',
              name: 'Leche',
              quantity: {
                base: { kind: 'exact', value: 500, unit: 'ml' },
                shopping: { mode: 'base' },
              },
            },
            {
              id: 'sugar',
              name: 'Azúcar',
              quantity: {
                base: null,
                equivalent: { kind: 'exact', value: 20, unit: 'g' },
                shopping: { mode: 'nameOnly' },
              },
            },
            {
              id: 'salt',
              name: 'Sal',
              quantity: {
                base: null,
                equivalent: { kind: 'exact', value: 1, unit: 'pinch' },
                shopping: { mode: 'nameOnly' },
              },
            },
            {
              id: 'water',
              name: 'Agua caliente',
              quantity: {
                base: { kind: 'exact', value: 50, unit: 'ml' },
                shopping: { mode: 'base' },
              },
            },
            {
              id: 'oil',
              name: 'Aceite de sabor neutro',
              quantity: {
                base: null,
                equivalent: { kind: 'exact', value: 25, unit: 'g' },
                shopping: { mode: 'nameOnly' },
              },
            },
            {
              id: 'pan-oil',
              name: 'Aceite para la sartén',
              quantity: { base: null, shopping: { mode: 'nameOnly' } },
              note: 'Para engrasar.',
            },
          ],
        },
      ],
      steps: stepsForLocale('es'),
    },
  },
} satisfies RecipeSourceDraft;
