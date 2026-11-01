import type { Recipe } from './recipe.types.ts';

export const sourCreamRecipe = {
  schemaVersion: 3,
  id: 'sour-cream',
  versionId: 'sour-cream-source-v1',
  publicationStatus: 'published',
  translationState: {
    uk: 'reviewed',
    en: 'reviewed',
    es: 'reviewed',
  },
  slug: {
    en: 'sour-cream',
    es: 'sour-cream',
    uk: 'sour-cream',
  },
  title: {
    en: 'Sour cream filling',
    es: 'Crema de nata agria',
    uk: 'Сметанний крем',
  },
  summary: {
    en: 'A simple filling for two layers in a 24 cm cake.',
    es: 'Una crema sencilla para dos capas de relleno en una tarta de 24 cm.',
    uk: 'Простий крем для двох прошарків торта діаметром 24 см.',
  },
  categoryIds: [],
  situationIds: [],
  difficulty: 'easy',
  baseProvenance: {
    state: 'tested',
    sourceIds: ['sour-cream-recorded-source'],
  },
  timing: {
    activeMinutes: null,
    totalElapsedMinutes: null,
    planningNote: null,
    phases: [],
  },
  yield: {
    default: {
      id: 'two-filling-layers',
      label: {
        en: '1 batch of filling',
        es: '1 tanda de crema',
        uk: '1 порція крему',
      },
      count: {
        kind: 'exact',
        value: 1,
      },
      unit: 'batch',
      provenance: {
        state: 'tested',
        sourceIds: ['sour-cream-recorded-source'],
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
      geometryId: 'sour-cream-base',
      yieldId: 'two-filling-layers',
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
            ingredientLineId: 'sour-cream',
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
      id: 'whisk',
      name: {
        en: 'whisk',
        es: 'varillas',
        uk: 'вінчик',
      },
    },
  ],
  flourConfiguration: null,
  beforeStart: [],
  ingredientSections: [
    {
      id: 'sour-cream',
      title: {
        en: 'Sour cream filling',
        es: 'Crema de nata agria',
        uk: 'Сметанний крем',
      },
      lines: [
        {
          id: 'sour-cream',
          options: [
            {
              ingredientId: 'sour-cream',
              name: {
                en: 'Sour cream',
                es: 'Nata agria',
                uk: 'Сметана',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 500,
              unit: 'g',
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
              value: 60,
              unit: 'g',
            },
            equivalent: {
              kind: 'exact',
              value: 3,
              unit: 'tbsp',
            },
            shopping: {
              mode: 'base',
            },
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
              value: 1,
              unit: 'tbsp',
            },
            shopping: {
              mode: 'base',
            },
          },
          optional: true,
          qualifier: {
            en: 'Optional, for a citrus aroma and extra tang.',
            es: 'Opcional, para dar aroma y un toque ácido.',
            uk: 'За бажанням, для аромату й легкої кислинки.',
          },
        },
      ],
    },
  ],
  steps: [
    {
      id: 'mix',
      title: {
        en: 'Make the sour cream filling',
        es: 'Prepara la crema de nata agria',
        uk: 'Приготуйте сметанний крем',
      },
      instruction: {
        en: 'Stir the sour cream and sugar with a spoon until smooth. For a lighter filling, beat with a hand mixer or a stand mixer fitted with a whisk. Add the optional lemon juice for a gentle citrus aroma and a little extra tang.',
        es: 'Mezcla la nata agria con el azúcar con una cuchara hasta que quede homogénea. Para una crema más aireada, bate con una batidora de varillas o un robot con varillas. Si quieres, añade el zumo de limón para darle aroma y un toque más ácido.',
        uk: 'Перемішайте сметану з цукром ложкою до однорідності. Якщо хочете більш повітряний крем, збийте його міксером або в комбайні з насадкою-вінчиком. За бажанням додайте лимонний сік: він дасть легкий аромат і підкреслить кислинку.',
      },
      ingredientLineIds: ['sour-cream', 'sugar', 'lemon-juice'],
      guidance: [
        {
          id: 'mix-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The filling is smooth, without noticeable grains of sugar.',
            es: 'La crema está homogénea, sin granos de azúcar perceptibles.',
            uk: 'Крем однорідний, без відчутних крупинок цукру.',
          },
        },
      ],
      cook: {
        ingredients: [
          {
            ingredientId: 'sour-cream',
          },
          {
            ingredientId: 'sugar',
          },
          {
            ingredientId: 'lemon-juice',
          },
        ],
      },
      equipmentIds: ['mixer', 'whisk'],
    },
  ],
  storage: null,
  makeAhead: null,
  variations: [],
  heroMediaId: 'sour-cream-hero',
  media: [
    {
      id: 'sour-cream-hero',
      type: 'image',
      path: '/media/recipes/recipe-components/sour-cream-v1.webp',
      usage: ['hero'],
      alt: {
        en: 'Sour cream filling',
        es: 'Crema de nata agria',
        uk: 'Сметанний крем',
      },
    },
  ],
  relatedRecipeIds: [],
  sources: [
    {
      id: 'sour-cream-recorded-source',
      file: 'docs/content-model/celebration-cake-author-notes.md',
      locator:
        'Author instructions, 2026-09-25: 500 g sour cream, 3 tbsp sugar, optional spoon of lemon juice',
    },
  ],
  contentGaps: [],
  presentation: 'concise',
  evidenceExplanation: {
    en: 'This filling has been used for two layers in a 24 cm cake.',
    es: 'Esta crema se ha preparado para dos capas de relleno en una tarta de 24 cm.',
    uk: 'Цей крем готували для двох прошарків торта діаметром 24 см.',
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
      uk: ['Сметанний крем'],
      en: ['Sour cream filling'],
      es: ['Crema de nata agria'],
    },
  },
  discovery: {
    cardTitle: {
      en: 'Sour cream filling',
      es: 'Crema de nata agria',
      uk: 'Сметанний крем',
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
    sourceTitle: 'Сметанний крем',
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
      title: 'Сметанний крем',
      description:
        'Сметанний крем для двох прошарків торта діаметром 24 см. Інгредієнти, пропорції та кроки приготування домашньої начинки.',
    },
    en: {
      title: 'Sour cream filling',
      description:
        'Sour cream filling for two layers in a 24 cm cake, with ingredient quantities and step-by-step instructions.',
    },
    es: {
      title: 'Crema de nata agria',
      description:
        'Crema de nata agria para dos capas de relleno en una tarta de 24 cm. Ingredientes, cantidades y preparación paso a paso.',
    },
  },
  creamOption: {
    en: {
      title: 'Sour cream filling',
      description: 'A simple filling for two layers in a 24 cm cake.',
    },
    es: {
      title: 'Crema de nata agria',
      description:
        'Una crema sencilla para dos capas de relleno en una tarta de 24 cm.',
    },
    uk: {
      title: 'Сметанний крем',
      description: 'Простий крем для двох прошарків торта діаметром 24 см.',
    },
  },
  routeSlug: 'sour-cream',
} satisfies Recipe;
