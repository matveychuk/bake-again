import type { Recipe } from './recipe.types.ts';

export const lemonCreamCheeseRecipe = {
  schemaVersion: 3,
  id: 'lemon-cream-cheese',
  versionId: 'lemon-cream-cheese-source-v1',
  publicationStatus: 'published',
  translationState: {
    uk: 'reviewed',
    en: 'reviewed',
    es: 'reviewed',
  },
  slug: {
    en: 'lemon-cream-cheese',
    es: 'lemon-cream-cheese',
    uk: 'lemon-cream-cheese',
  },
  title: {
    en: 'Lemon butter and cream cheese frosting',
    es: 'Crema de mantequilla y queso al limón',
    uk: 'Лимонний крем із маслом і вершковим сиром',
  },
  summary: {
    en: 'A calculated batch for coating and piping, with 200 g butter.',
    es: 'Una tanda calculada para cubrir y decorar, con 200 g de mantequilla.',
    uk: 'Перерахована порція на 200 г масла для покриття й оздоблення.',
  },
  categoryIds: [],
  situationIds: [],
  difficulty: 'easy',
  baseProvenance: {
    state: 'calculated',
    sourceIds: ['lemon-cream-cheese-recorded-source'],
  },
  timing: {
    activeMinutes: null,
    totalElapsedMinutes: null,
    planningNote: null,
    phases: [
      {
        id: 'beat-zest',
        relatedStepId: 'beat-frosting',
        duration: {
          kind: 'exact',
          value: 3,
          unit: 'minute',
        },
        label: {
          en: 'Beat in the zest',
          es: 'Batir con la ralladura',
          uk: 'Збивання з цедрою',
        },
      },
    ],
  },
  yield: {
    default: {
      id: 'one-frosting-batch',
      label: {
        en: '1 batch of frosting',
        es: '1 tanda de crema',
        uk: '1 порція крему',
      },
      count: {
        kind: 'exact',
        value: 1,
      },
      unit: 'batch',
      provenance: {
        state: 'calculated',
        sourceIds: ['lemon-cream-cheese-recorded-source'],
      },
      availability: 'default',
    },
    alternatives: [],
  },
  geometry: {
    state: 'notApplicable',
    default: null,
    alternatives: [],
  },
  configuration: {
    base: {
      geometryId: 'lemon-cream-cheese-base',
      yieldId: 'one-frosting-batch',
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
            ingredientLineId: 'butter',
            allowedUnit: 'g',
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
  equipment: [],
  flourConfiguration: null,
  beforeStart: [
    {
      id: 'before-0',
      text: {
        en: 'This makes over 1 kg of frosting. It is a proportional calculation; a thin coating and a few piped flowers may use only part of it.',
        es: 'Sale más de 1 kg de crema. Es un cálculo proporcional; para una capa fina y unas flores puede bastar una parte.',
        uk: 'Виходить понад 1 кг крему. Це повний пропорційний перерахунок; для тонкого покриття й кількох квіточок може знадобитися лише частина.',
      },
    },
  ],
  ingredientSections: [
    {
      id: 'lemon-frosting',
      title: {
        en: 'Lemon butter and cream cheese frosting',
        es: 'Crema de mantequilla y queso al limón',
        uk: 'Лимонний крем із маслом і вершковим сиром',
      },
      lines: [
        {
          id: 'butter',
          options: [
            {
              ingredientId: 'butter',
              name: {
                en: 'Butter',
                es: 'Mantequilla',
                uk: 'Вершкове масло',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 200,
              unit: 'g',
            },
            shopping: {
              mode: 'base',
            },
          },
          qualifier: {
            en: 'Soft, at room temperature.',
            es: 'Blanda, a temperatura ambiente.',
            uk: 'М’яке, кімнатної температури.',
          },
        },
        {
          id: 'cream-cheese',
          options: [
            {
              ingredientId: 'cream-cheese',
              name: {
                en: 'Cream cheese',
                es: 'Queso crema',
                uk: 'Вершковий сир',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 199,
              unit: 'g',
            },
            shopping: {
              mode: 'base',
            },
          },
          qualifier: {
            en: 'Firm cream cheese, not a runny spread.',
            es: 'Queso crema firme, no una crema líquida para untar.',
            uk: 'Щільний вершковий сир, не рідка намазка.',
          },
        },
        {
          id: 'powdered-sugar',
          options: [
            {
              ingredientId: 'powdered-sugar',
              name: {
                en: 'Icing sugar',
                es: 'Azúcar glas',
                uk: 'Цукрова пудра',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 740,
              unit: 'g',
            },
            equivalent: {
              kind: 'exact',
              value: 104.7788,
              unit: 'tbsp',
            },
            shopping: {
              mode: 'base',
            },
          },
        },
        {
          id: 'lemon-zest',
          options: [
            {
              ingredientId: 'lemon-zest',
              name: {
                en: 'Lemon zest',
                es: 'Ralladura de limón',
                uk: 'Лимонна цедра',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 2.5,
              unit: 'tsp',
            },
            shopping: {
              mode: 'base',
            },
          },
          qualifier: {
            en: 'Yellow peel only.',
            es: 'Solo la parte amarilla de la piel.',
            uk: 'Лише жовта частина шкірки.',
          },
        },
        {
          id: 'lemon-juice',
          options: [
            {
              ingredientId: 'lemon-juice',
              name: {
                en: 'Lemon juice',
                es: 'Zumo de limón',
                uk: 'Лимонний сік',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 26,
              unit: 'ml',
            },
            shopping: {
              mode: 'base',
            },
          },
        },
        {
          id: 'vanilla',
          options: [
            {
              ingredientId: 'vanilla',
              name: {
                en: 'Vanilla extract',
                es: 'Extracto de vainilla',
                uk: 'Ванільний екстракт',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 0.5,
              unit: 'tsp',
            },
            shopping: {
              mode: 'base',
            },
          },
        },
      ],
    },
  ],
  steps: [
    {
      id: 'beat-frosting',
      title: {
        en: 'Beat the lemon frosting',
        es: 'Bate la crema de limón',
        uk: 'Збийте лимонний крем',
      },
      instruction: {
        en: 'Beat soft butter with cream cheese until smooth. Add finely grated lemon zest and beat for about 3 minutes. Mix in icing sugar in portions, alternating with lemon juice. Add vanilla and beat briefly until fluffy.',
        es: 'Bate la mantequilla blanda con el queso crema hasta alisar. Añade la ralladura fina y bate unos 3 minutos. Incorpora el azúcar glas por tandas, alternando con el zumo. Añade la vainilla y bate brevemente hasta que quede esponjosa.',
        uk: 'Збийте м’яке масло з вершковим сиром до однорідності. Додайте дрібну лимонну цедру й збивайте приблизно 3 хвилини. Частинами вмішайте пудру, чергуючи її з лимонним соком. Додайте ваніль і коротко збийте до пишності.',
      },
      ingredientLineIds: [
        'butter',
        'cream-cheese',
        'powdered-sugar',
        'lemon-zest',
        'lemon-juice',
        'vanilla',
      ],
      technique: {
        id: 'soften-butter',
      },
      guidance: [
        {
          id: 'beat-frosting-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The frosting is smooth and holds a piped ridge.',
            es: 'La crema está lisa y conserva el relieve de la boquilla.',
            uk: 'Крем однорідний і тримає рельєф від насадки.',
          },
        },
      ],
      cook: {
        ingredients: [
          {
            ingredientId: 'butter',
          },
          {
            ingredientId: 'cream-cheese',
          },
          {
            ingredientId: 'powdered-sugar',
          },
          {
            ingredientId: 'lemon-zest',
          },
          {
            ingredientId: 'lemon-juice',
          },
          {
            ingredientId: 'vanilla',
          },
        ],
      },
    },
  ],
  storage: null,
  makeAhead: null,
  variations: [],
  heroMediaId: 'lemon-cream-cheese-hero',
  media: [
    {
      id: 'lemon-cream-cheese-hero',
      type: 'image',
      path: '/media/recipes/recipe-components/lemon-cream-cheese-v1.webp',
      usage: ['hero'],
      alt: {
        en: 'Lemon butter and cream cheese frosting',
        es: 'Crema de mantequilla y queso al limón',
        uk: 'Лимонний крем із маслом і вершковим сиром',
      },
    },
  ],
  relatedRecipeIds: [],
  sources: [
    {
      id: 'lemon-cream-cheese-recorded-source',
      file: 'https://preppykitchen.com/lemon-cake/',
      locator:
        'Lemon cream cheese frosting; factor 200/227, author screenshot matched to method image 5',
    },
  ],
  contentGaps: [],
  presentation: 'concise',
  evidenceExplanation: {
    en: 'Preppy Kitchen proportions calculated for 200 g butter. This calculated batch has not been tested.',
    es: 'Proporciones de Preppy Kitchen calculadas para 200 g de mantequilla. Esta cantidad recalculada aún no se ha probado.',
    uk: 'Пропорції Preppy Kitchen перераховано на 200 г масла. Цю перераховану порцію ще не перевіряли на практиці.',
  },
  searchMetadata: {
    datePublished: null,
    dateModified: '2026-09-27',
    cookTimeMinutes: null,
    recipeCuisine: {
      uk: null,
      en: null,
      es: null,
    },
    keywords: {
      uk: ['Лимонний крем із маслом і вершковим сиром'],
      en: ['Lemon butter and cream cheese frosting'],
      es: ['Crema de mantequilla y queso al limón'],
    },
  },
  discovery: {
    cardTitle: {
      en: 'Lemon butter and cream cheese frosting',
      es: 'Crema de mantequilla y queso al limón',
      uk: 'Лимонний крем із маслом і вершковим сиром',
    },
    category: {
      en: 'Cream',
      es: 'Crema',
      uk: 'Крем',
    },
    flourSummary: null,
    collectionIds: [],
    catalogue: false,
    imageKind: 'generated-preview',
    sourceTitle: 'Лимонний крем із маслом і вершковим сиром',
    launchPriority: 'Linked recipe',
    heroCandidate: 'Yes',
    source: 'Author recipe notes · 2026-09-25',
    archiveSections: [],
    needsBeforePublishing: '',
  },
  translationReview: {
    date: '2026-11-01',
    reviewer: 'implementation',
    scope:
      'ID-aligned transfer and semantic comparison of existing UK/EN/ES recipe text; not separate author approval',
  },
  seo: {
    uk: {
      title: 'Лимонний крем із маслом і вершковим сиром',
      description:
        'Лимонний крем із вершковим сиром для покриття й оздоблення. Порцію перераховано на 200 г масла; цю кількість не перевірено на практиці.',
    },
    en: {
      title: 'Lemon butter and cream cheese frosting',
      description:
        'Lemon cream cheese frosting for coating and piping, calculated for 200 g butter. This adjusted batch has not been tested.',
    },
    es: {
      title: 'Crema de mantequilla y queso al limón',
      description:
        'Crema de queso y mantequilla al limón para cubrir y decorar. Cantidades calculadas para 200 g de mantequilla; esta tanda no se ha probado.',
    },
  },
  creamOption: {
    en: {
      title: 'Lemon butter and cream cheese frosting',
      description:
        'A calculated batch for coating and piping, with 200 g butter.',
    },
    es: {
      title: 'Crema de mantequilla y queso al limón',
      description:
        'Una tanda calculada para cubrir y decorar, con 200 g de mantequilla.',
    },
    uk: {
      title: 'Лимонний крем із маслом і вершковим сиром',
      description:
        'Перерахована порція на 200 г масла для покриття й оздоблення.',
    },
  },
  routeSlug: 'lemon-cream-cheese',
} satisfies Recipe;
