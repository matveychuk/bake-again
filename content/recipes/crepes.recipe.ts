import type { Recipe } from './recipe.types.ts';

export const crepesRecipe = {
  schemaVersion: 3,
  id: 'crepes',
  versionId: 'crepes-source-v1',
  publicationStatus: 'published',
  translationState: {
    uk: 'reviewed',
    en: 'reviewed',
    es: 'reviewed',
  },
  slug: {
    en: 'crepes',
    es: 'crepes',
    uk: 'crepes',
  },
  title: {
    en: 'Gluten-free crepes',
    es: 'Crepes sin gluten',
    uk: 'Безглютенові млинці',
  },
  summary: {
    en: 'Thin crepes made with milk.',
    es: 'Crepes finos con leche.',
    uk: 'Тонкі млинці на молоці.',
  },
  categoryIds: [],
  situationIds: [],
  difficulty: 'medium',
  baseProvenance: {
    state: 'tested',
    sourceIds: ['crepes-recorded-source'],
  },
  timing: {
    activeMinutes: 40,
    totalElapsedMinutes: 60,
    planningNote: {
      text: {
        en: 'Includes {duration} of batter rest.',
        es: 'Incluye {duration} de reposo de la masa.',
        uk: 'Включає {duration} відпочинку тіста.',
      },
      phaseId: 'batter-rest',
    },
    phases: [
      {
        id: 'batter-rest',
        label: {
          en: 'Batter rest',
          es: 'Reposo de la masa',
          uk: 'Відпочинок тіста',
        },
        duration: {
          kind: 'range',
          min: 15,
          max: 20,
          unit: 'minute',
        },
        relatedStepId: 'add-milk',
      },
    ],
  },
  yield: {
    default: {
      id: 'ten-crepes',
      label: {
        en: '10 crepes',
        es: '10 crepes',
        uk: '10 млинців',
      },
      count: {
        kind: 'exact',
        value: 10,
      },
      unit: 'crepe',
      provenance: {
        state: 'tested',
        sourceIds: ['crepes-recorded-source'],
      },
      availability: 'default',
    },
    alternatives: [],
  },
  geometry: {
    state: 'known',
    default: {
      id: 'round-pan-28-cm',
      label: {
        en: '28 cm round pan',
        es: 'Sartén redonda de 28 cm',
        uk: 'Кругла пательня, 28 см',
      },
      kind: 'other',
      application: 'other',
      shape: 'round',
      diameterCm: 28,
      layerCount: null,
      material: null,
      provenance: {
        state: 'tested',
        sourceIds: ['crepes-recorded-source'],
      },
      availability: 'default',
    },
    alternatives: [],
  },
  configuration: {
    base: {
      geometryId: 'round-pan-28-cm',
      yieldId: 'ten-crepes',
      batchScale: 1,
    },
    geometryAdjustment: null,
    quantityAdjustment: {
      batchScale: {
        allowed: [0.5, 1, 1.5, 2],
      },
      useWhatIHave: {
        scalingAnchors: [
          {
            ingredientLineId: 'eggs',
            allowedUnit: 'piece',
          },
        ],
      },
    },
    ingredientScaling: {
      default: {
        kind: 'linear',
      },
    },
  },
  equipment: [
    {
      id: 'mixer',
      name: {
        en: 'mixer',
        es: 'batidora',
        uk: 'міксер',
      },
    },
    {
      id: 'spatula',
      name: {
        en: 'spatula',
        es: 'espátula',
        uk: 'лопатка',
      },
    },
  ],
  flourConfiguration: {
    commercialMixLineId: 'flour',
    additionalStarchLineIds: [],
    provenance: {
      state: 'tested',
      sourceIds: ['crepes-recorded-source'],
    },
    testedAlternativeMixes: [],
    knownUnsupportedMixes: [],
    basis: 'commercialMix',
  },
  beforeStart: [],
  ingredientSections: [
    {
      id: 'batter',
      title: {
        en: 'Crepe batter',
        es: 'Masa para crepes',
        uk: 'Тісто для млинців',
      },
      lines: [
        {
          id: 'eggs',
          options: [
            {
              ingredientId: 'eggs',
              name: {
                en: 'Eggs',
                es: 'Huevos',
                uk: 'Яйця',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 5,
              unit: 'piece',
            },
            equivalent: {
              kind: 'exact',
              value: 280,
              unit: 'g',
            },
            shopping: {
              mode: 'base',
              increment: 1,
              rounding: 'up',
            },
          },
        },
        {
          id: 'flour',
          options: [
            {
              ingredientId: 'flour',
              name: {
                en: 'Schär Mix B Bread flour',
                es: 'Harina Schär Mix B Bread',
                uk: 'Борошно Schär Mix B Bread',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 140,
              unit: 'g',
            },
            equivalent: {
              kind: 'exact',
              value: 7,
              unit: 'tbsp',
            },
            shopping: {
              mode: 'base',
            },
          },
        },
        {
          id: 'milk',
          options: [
            {
              ingredientId: 'milk',
              name: {
                en: 'Milk',
                es: 'Leche',
                uk: 'Молоко',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 500,
              unit: 'ml',
            },
            shopping: {
              mode: 'base',
            },
          },
        },
        {
          id: 'sugar',
          options: [
            {
              ingredientId: 'sugar',
              name: {
                en: 'Sugar',
                es: 'Azúcar',
                uk: 'Цукор',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 20,
              unit: 'g',
            },
            equivalent: {
              kind: 'exact',
              value: 1,
              unit: 'tbsp',
            },
            shopping: {
              mode: 'base',
            },
          },
        },
        {
          id: 'salt',
          options: [
            {
              ingredientId: 'salt',
              name: {
                en: 'Salt',
                es: 'Sal',
                uk: 'Сіль',
              },
            },
          ],
          quantity: {
            base: null,
            equivalent: {
              kind: 'exact',
              value: 1,
              unit: 'pinch',
            },
            shopping: {
              mode: 'nameOnly',
            },
          },
          scaling: {
            kind: 'fixed',
          },
        },
        {
          id: 'water',
          options: [
            {
              ingredientId: 'water',
              name: {
                en: 'Hot water',
                es: 'Agua caliente',
                uk: 'Гаряча вода',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 50,
              unit: 'ml',
            },
            shopping: {
              mode: 'base',
              defaultSelected: false,
            },
          },
        },
        {
          id: 'oil',
          options: [
            {
              ingredientId: 'oil',
              name: {
                en: 'Neutral oil',
                es: 'Aceite de sabor neutro',
                uk: 'Олія без запаху',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 25,
              unit: 'g',
            },
            shopping: {
              mode: 'base',
            },
          },
        },
        {
          id: 'pan-oil',
          options: [
            {
              ingredientId: 'pan-oil',
              name: {
                en: 'Oil for the pan',
                es: 'Aceite para la sartén',
                uk: 'Олія для пательні',
              },
            },
          ],
          quantity: {
            base: null,
            shopping: {
              mode: 'nameOnly',
            },
          },
          qualifier: {
            en: 'For greasing.',
            es: 'Para engrasar.',
            uk: 'Для змащування.',
          },
        },
      ],
    },
  ],
  steps: [
    {
      id: 'start-batter',
      title: {
        en: 'Blend a thick base',
        es: 'Bate una base espesa',
        uk: 'Збийте густу основу',
      },
      instruction: {
        en: 'Combine the eggs, flour, sugar and salt. Pour in a little milk — just enough for the blender or mixer to work. Blend to a smooth, thick base with no lumps.',
        es: 'Mezcla los huevos, la harina, el azúcar y la sal. Añade un poco de leche, solo la necesaria para que funcione la batidora. Bate hasta obtener una base espesa, lisa y sin grumos.',
        uk: 'З’єднайте яйця, борошно, цукор і сіль. Влийте трохи молока — лише стільки, щоб блендер або міксер міг працювати. Збийте до гладкої густої маси без грудочок.',
      },
      ingredientLineIds: ['eggs', 'flour', 'sugar', 'salt', 'milk'],
      guidance: [
        {
          id: 'start-batter-tip',
          kind: 'practicalTip',
          text: {
            en: 'Lumps break up more easily in a thick base.',
            es: 'Los grumos se deshacen más fácilmente en una base espesa.',
            uk: 'У густій основі легше розбити грудочки.',
          },
        },
      ],
      cook: {
        ingredients: [
          {
            ingredientId: 'eggs',
          },
          {
            ingredientId: 'flour',
          },
          {
            ingredientId: 'sugar',
          },
          {
            ingredientId: 'salt',
          },
          {
            ingredientId: 'milk',
            quantity: 'omit',
            note: {
              en: 'A little milk for the thick base.',
              es: 'Un poco de leche para la base espesa.',
              uk: 'Трохи молока для густої основи.',
            },
          },
        ],
      },
      mediaIds: ['batter-smooth-base'],
      equipmentIds: ['mixer'],
    },
    {
      id: 'add-milk',
      title: {
        en: 'Add the milk and rest',
        es: 'Añade la leche y deja reposar',
        uk: 'Додайте молоко й залиште тісто',
      },
      instruction: {
        en: 'Gradually mix in the remaining milk. Leave to rest for 15–20 minutes.',
        es: 'Incorpora poco a poco el resto de la leche. Deja reposar durante 15–20 minutos.',
        uk: 'Поступово вмішайте решту молока. Залиште на 15–20 хвилин.',
      },
      ingredientLineIds: ['milk'],
      guidance: [],
      cook: {
        ingredients: [
          {
            ingredientId: 'milk',
            quantity: 'omit',
            note: {
              en: 'Remaining milk.',
              es: 'El resto de la leche.',
              uk: 'Решта молока.',
            },
          },
        ],
      },
      durationPhaseId: 'batter-rest',
    },
    {
      id: 'finish-batter',
      title: {
        en: 'Add the water and oil',
        es: 'Añade el agua y el aceite',
        uk: 'Додайте воду й олію',
      },
      instruction: {
        en: 'Mix in the hot water, then the oil. The batter should spread easily across the pan.',
        es: 'Incorpora el agua caliente y después el aceite. La masa debe extenderse fácilmente por la sartén.',
        uk: 'Вмішайте гарячу воду, потім олію. Тісто має легко розтікатися по пательні.',
      },
      ingredientLineIds: ['water', 'oil'],
      guidance: [],
      cook: {
        ingredients: [
          {
            ingredientId: 'water',
          },
          {
            ingredientId: 'oil',
          },
        ],
      },
    },
    {
      id: 'cook',
      title: {
        en: 'Cook the crepes',
        es: 'Cocina los crepes',
        uk: 'Посмажте млинці',
      },
      instruction: {
        en: 'Before the first crepe, coat the pan with a thin layer of oil. Pour in the batter and tilt the pan to spread it. When the surface is matte with small holes and the edges release easily, loosen them with a spatula, flip the crepe and finish cooking the other side.',
        es: 'Antes del primer crepe, unta la sartén con una capa fina de aceite. Vierte la masa e inclina la sartén para extenderla. Cuando la superficie esté mate, con pequeños agujeros, y los bordes se despeguen fácilmente, levántalos con una espátula, dale la vuelta al crepe y termina de cocinar el otro lado.',
        uk: 'Перед першим млинцем змастіть пательню тонким шаром олії. Налийте тісто й розподіліть його, нахиляючи пательню. Коли поверхня стане матовою з дрібними отворами, а краї легко відділятимуться, піддіть їх лопаткою, переверніть млинець і досмажте інший бік.',
      },
      ingredientLineIds: ['pan-oil'],
      guidance: [],
      cook: {
        ingredients: [
          {
            ingredientId: 'pan-oil',
          },
        ],
      },
      mediaIds: [
        'crepe-batter-setting',
        'crepe-edge-lift',
        'crepe-golden-side',
      ],
      equipmentIds: ['spatula'],
    },
  ],
  storage: null,
  makeAhead: null,
  variations: [],
  heroMediaId: 'crepes-hero',
  media: [
    {
      id: 'crepes-hero',
      type: 'image',
      path: '/images/recipes/crepes-stack-2026-10-20-v1.webp',
      usage: ['hero'],
      alt: {
        en: 'A tall stack of golden gluten-free crepes on a plate',
        es: 'Una pila alta de crepes dorados sin gluten en un plato',
        uk: 'Велика стопка золотавих безглютенових млинців на тарілці',
      },
    },
    {
      id: 'batter-smooth-base',
      type: 'image',
      path: '/media/recipes/crepes/selected/step-01-batter-smooth-base-c2-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Smooth thick crepe base coating a metal spoon',
        es: 'Base espesa y lisa para crepes sobre una cuchara de metal',
        uk: 'Гладка густа основа для млинців на металевій ложці',
      },
    },
    {
      id: 'crepe-batter-setting',
      type: 'image',
      path: '/media/recipes/crepes/selected/step-05-crepe-batter-setting-s2b-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Crepe setting in a pan with small holes appearing on the surface',
        es: 'Crepe cuajándose en una sartén con pequeños agujeros en la superficie',
        uk: 'Млинець на пательні: поверхня схоплюється й з’являються дрібні отвори',
      },
      title: {
        en: 'Before flipping',
        es: 'Antes de darle la vuelta',
        uk: 'Перед перевертанням',
      },
    },
    {
      id: 'crepe-edge-lift',
      type: 'image',
      path: '/media/recipes/crepes/selected/step-05-crepe-edge-lift-s2b-v1.webp',
      usage: ['step'],
      alt: {
        en: 'A spatula lifting the edge of a crepe in a pan',
        es: 'Una espátula levantando el borde de un crepe en una sartén',
        uk: 'Лопатка піддіває край млинця на пательні',
      },
      title: {
        en: 'Releasing the edge',
        es: 'Despegar el borde',
        uk: 'Відділення краю',
      },
    },
    {
      id: 'crepe-golden-side',
      type: 'image',
      path: '/media/recipes/crepes/selected/step-05-crepe-golden-side-s2b-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Golden cooked side of a flipped crepe in a pan',
        es: 'Lado dorado de un crepe volteado en una sartén',
        uk: 'Золотиста сторона перевернутого млинця на пательні',
      },
      title: {
        en: 'After flipping',
        es: 'Después de darle la vuelta',
        uk: 'Після перевертання',
      },
    },
    {
      id: 'crepes-card',
      type: 'image',
      path: '/images/recipes/crepes-stack-lace-linen-v1.webp',
      usage: ['card'],
      alt: {
        uk: 'Стопка золотавих млинців на тарілці та лляній серветці з мереживом',
        en: 'Stack of golden crepes on a plate and lace-edged linen napkin',
        es: 'Pila de crepes doradas en un plato sobre una servilleta de lino con encaje',
      },
    },
  ],
  relatedRecipeIds: [],
  sources: [
    {
      id: 'crepes-recorded-source',
      file: 'docs/reference/recipe-inventory.xlsx',
      locator: 'Recipe Archive · Млинці',
    },
  ],
  contentGaps: [],
  presentation: 'concise',
  evidenceExplanation: {
    en: 'This exact version has been cooked successfully.',
    es: 'Esta versión se ha preparado con éxito.',
    uk: 'Цю версію успішно готували.',
  },
  searchMetadata: {
    datePublished: null,
    dateModified: '2026-09-27',
    cookTimeMinutes: null,
    recipeCuisine: {
      uk: 'Українська кухня',
      en: 'Ukrainian',
      es: 'Ucraniana',
    },
    keywords: {
      uk: ['Безглютенові млинці'],
      en: ['Gluten-free crepes'],
      es: ['Crepes sin gluten'],
    },
  },
  discovery: {
    cardTitle: {
      en: 'Thin breakfast crepes',
      es: 'Crepes finos para el desayuno',
      uk: 'Млинці',
    },
    category: {
      en: 'Breakfast',
      es: 'Desayuno',
      uk: 'Сніданок',
    },
    flourSummary: {
      en: 'Schär Mix B Bread',
      es: 'Schär Mix B Bread',
      uk: 'Schär Mix B Bread',
    },
    collectionIds: ['breakfast', 'everyday'],
    catalogue: true,
    imageKind: 'author-photo',
    sourceTitle: 'Млинці',
    launchPriority: 'High',
    heroCandidate: 'Yes',
    source: 'Handwritten notebook page, IMG_1275.jpeg',
    archiveSections: [
      {
        title: 'Ingredients · original notes',
        content:
          '5 яєць\n5 ст. л. борошна\n0,5 л молока\n1 ст. л. цукру\nДрібка солі\n5 ст. л. олії\n0,5 склянки води, краще гарячої',
      },
      {
        title: 'Method · original notes',
        content:
          '1. Змішати яйця, борошно, цукор, сіль і трохи молока без грудочок.\n2. Поступово додати молоко.\n3. Додати 0,5 склянки води, краще гарячої, та олію.\n4. Дати постояти 15–30 хв. За потреби додавати молоко або воду до рідкої консистенції.',
      },
    ],
    needsBeforePublishing:
      'Review the generated step photos and approve or replace the preview photo.',
  },
  cardMediaId: 'crepes-card',
  translationReview: {
    date: '2026-11-01',
    reviewer: 'implementation',
    scope:
      'ID-aligned transfer and semantic comparison of existing UK/EN/ES recipe text; not separate author approval',
  },
  seo: {
    uk: {
      title: 'Безглютенові млинці',
      description:
        'Тонкі безглютенові млинці на молоці. Пропорції інгредієнтів, приготування тіста та випікання на пательні крок за кроком.',
    },
    en: {
      title: 'Gluten-free crepes',
      description:
        'Thin gluten-free crepes made with milk. Ingredient quantities and step-by-step instructions for mixing the batter and cooking in a frying pan.',
    },
    es: {
      title: 'Crepes sin gluten',
      description:
        'Crepes finos sin gluten con leche. Cantidades de los ingredientes y preparación de la masa y cocción en sartén paso a paso.',
    },
  },
  routeSlug: 'crepes',
} satisfies Recipe;
