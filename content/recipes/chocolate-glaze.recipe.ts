import type { Recipe } from './recipe.types.ts';

export const chocolateGlazeRecipe = {
  schemaVersion: 3,
  id: 'chocolate-glaze',
  versionId: 'chocolate-glaze-source-v1',
  publicationStatus: 'published',
  translationState: {
    uk: 'reviewed',
    en: 'reviewed',
    es: 'reviewed',
  },
  slug: {
    en: 'chocolate-glaze',
    es: 'chocolate-glaze',
    uk: 'chocolate-glaze',
  },
  title: {
    en: 'Chocolate glaze',
    es: 'Glaseado de chocolate',
    uk: 'Шоколадна глазур',
  },
  summary: {
    en: 'A versatile cocoa glaze for homemade cakes.',
    es: 'Un glaseado de cacao versátil para tartas caseras.',
    uk: 'Універсальна глазур із какао для домашніх тортів.',
  },
  categoryIds: [],
  situationIds: [],
  difficulty: 'easy',
  baseProvenance: {
    state: 'tested',
    sourceIds: ['chocolate-glaze-recorded-source'],
  },
  timing: {
    activeMinutes: 10,
    totalElapsedMinutes: null,
    planningNote: null,
    phases: [],
  },
  yield: {
    default: {
      id: '120g-glaze',
      label: {
        en: '120 g glaze',
        es: '120 g de glaseado',
        uk: '120 г глазурі',
      },
      count: {
        kind: 'exact',
        value: 120,
      },
      unit: 'g',
      provenance: {
        state: 'tested',
        sourceIds: ['chocolate-glaze-recorded-source'],
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
      geometryId: 'chocolate-glaze-base',
      yieldId: '120g-glaze',
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
  equipment: [
    {
      id: 'saucepan',
      name: {
        en: 'saucepan',
        es: 'cazo',
        uk: 'каструля',
      },
    },
  ],
  flourConfiguration: null,
  beforeStart: [],
  ingredientSections: [
    {
      id: 'glaze',
      title: {
        en: 'Chocolate glaze',
        es: 'Glaseado de chocolate',
        uk: 'Шоколадна глазур',
      },
      lines: [
        {
          id: 'glaze-sour-cream',
          options: [
            {
              ingredientId: 'glaze-sour-cream',
              name: {
                en: 'Sour cream or cream',
                es: 'Nata agria o nata',
                uk: 'Сметана або вершки',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 2,
              unit: 'tbsp',
            },
            shopping: {
              mode: 'base',
            },
          },
        },
        {
          id: 'glaze-sugar',
          options: [
            {
              ingredientId: 'glaze-sugar',
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
              value: 40,
              unit: 'g',
            },
            equivalent: {
              kind: 'exact',
              value: 2,
              unit: 'tbsp',
            },
            shopping: {
              mode: 'base',
            },
          },
        },
        {
          id: 'glaze-cocoa',
          options: [
            {
              ingredientId: 'glaze-cocoa',
              name: {
                en: 'Cocoa',
                es: 'Cacao',
                uk: 'Какао',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 10,
              unit: 'g',
            },
            equivalent: {
              kind: 'exact',
              value: 2,
              unit: 'tbsp',
            },
            shopping: {
              mode: 'base',
            },
          },
        },
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
              value: 50,
              unit: 'g',
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
      id: 'combine-ingredients',
      title: {
        en: 'Combine the ingredients in a saucepan',
        es: 'Pon los ingredientes en un cazo',
        uk: 'З’єднайте інгредієнти в каструльці',
      },
      instruction: {
        en: 'Combine the sour cream or cream, sugar, cocoa and butter in a small saucepan.',
        es: 'Pon la nata agria o nata, el azúcar, el cacao y la mantequilla en un cazo pequeño.',
        uk: 'У невеликій каструльці з’єднайте сметану або вершки, цукор, какао й масло.',
      },
      ingredientLineIds: [
        'glaze-sour-cream',
        'glaze-sugar',
        'glaze-cocoa',
        'butter',
      ],
      guidance: [],
      cook: {
        ingredients: [
          {
            ingredientId: 'glaze-sour-cream',
          },
          {
            ingredientId: 'glaze-sugar',
          },
          {
            ingredientId: 'glaze-cocoa',
          },
          {
            ingredientId: 'butter',
          },
        ],
      },
      mediaIds: ['chocolate-glaze-ingredients-v1'],
      equipmentIds: ['saucepan'],
    },
    {
      id: 'warm-until-smooth',
      title: {
        en: 'Warm the glaze',
        es: 'Calienta el glaseado',
        uk: 'Прогрійте глазур',
      },
      instruction: {
        en: 'Warm over low heat, stirring constantly, until completely smooth. Do not let it boil or allow the butter to separate.',
        es: 'Calienta a fuego bajo, removiendo constantemente, hasta que quede completamente homogéneo. No dejes que hierva ni que la mantequilla se separe.',
        uk: 'Прогрівайте на маленькому вогні, постійно помішуючи, до повної однорідності. Не доводьте до кипіння й не допускайте, щоб масло розшарувалося.',
      },
      ingredientLineIds: [],
      guidance: [
        {
          id: 'warm-until-smooth-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The glaze is smooth, without cocoa lumps or unmelted butter.',
            es: 'El glaseado está liso, sin grumos de cacao ni mantequilla sin fundir.',
            uk: 'Глазур гладка, без грудочок какао й нерозтопленого масла.',
          },
        },
      ],
      mediaIds: ['chocolate-glaze-warm-until-smooth-v1'],
    },
  ],
  storage: null,
  makeAhead: null,
  variations: [],
  heroMediaId: 'chocolate-glaze-hero',
  media: [
    {
      id: 'chocolate-glaze-hero',
      type: 'image',
      path: '/media/recipes/recipe-components/chocolate-glaze-v1.webp',
      usage: ['hero'],
      alt: {
        en: 'Chocolate glaze',
        es: 'Glaseado de chocolate',
        uk: 'Шоколадна глазур',
      },
    },
    {
      id: 'chocolate-glaze-ingredients-v1',
      type: 'image',
      path: '/media/recipes/chocolate-glaze/selected/step-01-ingredients-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Sour cream, sugar, cocoa and pieces of butter in a small saucepan',
        es: 'Nata agria, azúcar, cacao y trozos de mantequilla en un cazo pequeño',
        uk: 'Сметана, цукор, какао й шматочки масла в невеликій каструльці',
      },
    },
    {
      id: 'chocolate-glaze-warm-until-smooth-v1',
      type: 'image',
      path: '/media/recipes/chocolate-glaze/selected/step-02-warm-until-smooth-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Smooth chocolate glaze being stirred in a saucepan over low heat',
        es: 'Glaseado de chocolate liso removido en un cazo a fuego bajo',
        uk: 'Гладку шоколадну глазур помішують у каструльці на маленькому вогні',
      },
    },
  ],
  relatedRecipeIds: [],
  sources: [
    {
      id: 'chocolate-glaze-recorded-source',
      file: 'content/recipes/prune-cake.recipe.ts',
      locator:
        'Author-confirmed chocolate glaze, extracted without changing quantities',
    },
  ],
  contentGaps: [],
  presentation: 'concise',
  evidenceExplanation: {
    en: 'This versatile glaze recipe has been tested successfully.',
    es: 'Esta receta versátil de glaseado se ha probado con éxito.',
    uk: 'Цей універсальний рецепт глазурі успішно перевірено.',
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
      uk: ['Шоколадна глазур'],
      en: ['Chocolate glaze'],
      es: ['Glaseado de chocolate'],
    },
  },
  discovery: {
    cardTitle: {
      en: 'Chocolate glaze',
      es: 'Glaseado de chocolate',
      uk: 'Шоколадна глазур',
    },
    category: {
      en: 'Glaze',
      es: 'Glaseado',
      uk: 'Глазур',
    },
    flourSummary: null,
    collectionIds: [],
    catalogue: false,
    imageKind: 'generated-preview',
    sourceTitle: 'Шоколадна глазур',
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
      title: 'Шоколадна глазур',
      description:
        'Шоколадна глазур із какао для домашніх тортів. Точні пропорції та покрокове приготування для завершального покриття.',
    },
    en: {
      title: 'Chocolate glaze',
      description:
        'Cocoa chocolate glaze for homemade cakes, with ingredient quantities and step-by-step instructions for the finishing layer.',
    },
    es: {
      title: 'Glaseado de chocolate',
      description:
        'Glaseado de chocolate con cacao para tartas caseras. Cantidades y preparación paso a paso para dar el toque final.',
    },
  },
  routeSlug: 'chocolate-glaze',
} satisfies Recipe;
