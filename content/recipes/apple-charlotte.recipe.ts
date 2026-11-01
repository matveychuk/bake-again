import type { Recipe } from './recipe.types.ts';

export const appleCharlotteRecipe = {
  schemaVersion: 3,
  id: 'apple-charlotte',
  versionId: 'apple-charlotte-source-v1',
  publicationStatus: 'unpublished',
  translationState: {
    uk: 'reviewed',
    en: 'reviewed',
    es: 'reviewed',
  },
  slug: {
    en: 'apple-charlotte',
    es: 'apple-charlotte',
    uk: 'apple-charlotte',
  },
  title: {
    en: 'Gluten-free apple charlotte',
    es: 'Carlota de manzana sin gluten',
    uk: 'Безглютенова яблучна шарлотка',
  },
  summary: {
    en: 'A tender butter sponge with juicy pieces distributed through the crumb.',
    es: 'Un bizcocho tierno con mantequilla y trozos jugosos repartidos por la miga.',
    uk: 'Ніжний масляний бісквіт із соковитими шматочками, розподіленими в м’якуші.',
  },
  categoryIds: [],
  situationIds: [],
  difficulty: 'easy',
  baseProvenance: {
    state: 'tested',
    sourceIds: ['apple-charlotte-recorded-source'],
  },
  timing: {
    activeMinutes: 20,
    totalElapsedMinutes: 50,
    planningNote: null,
    phases: [
      {
        id: 'baking',
        label: {
          en: 'Baking',
          es: 'Horneado',
          uk: 'Випікання',
        },
        duration: {
          kind: 'range',
          min: 25,
          max: 30,
          unit: 'minute',
        },
        relatedStepId: 'bake',
      },
    ],
  },
  yield: {
    default: {
      id: 'one-charlotte',
      label: {
        en: '1 charlotte',
        es: '1 carlota',
        uk: '1 шарлотка',
      },
      count: {
        kind: 'exact',
        value: 1,
      },
      unit: 'cake',
      provenance: {
        state: 'tested',
        sourceIds: ['apple-charlotte-recorded-source'],
      },
      availability: 'default',
    },
    alternatives: [],
  },
  geometry: {
    state: 'known',
    default: {
      id: 'apple-charlotte-base',
      label: {
        en: 'Medium baking pan',
        es: 'Molde mediano',
        uk: 'Середня форма',
      },
      shape: 'other',
      kind: 'bakingPan',
      application: 'bake-in',
      diameterCm: null,
      layerCount: null,
      material: null,
      availability: 'default',
      provenance: {
        state: 'tested',
        sourceIds: ['apple-charlotte-recorded-source'],
      },
    },
    alternatives: [],
  },
  configuration: {
    base: {
      geometryId: 'apple-charlotte-base',
      yieldId: 'one-charlotte',
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
      id: 'bowl',
      name: {
        en: 'bowl',
        es: 'bol',
        uk: 'миска',
      },
    },
    {
      id: 'parchment',
      name: {
        en: 'baking parchment',
        es: 'papel de horno',
        uk: 'пергамент',
      },
    },
  ],
  flourConfiguration: {
    commercialMixLineId: 'flour',
    additionalStarchLineIds: ['tapioca'],
    xanthanLineId: 'xanthan',
    provenance: {
      state: 'tested',
      sourceIds: ['apple-charlotte-recorded-source'],
    },
    testedAlternativeMixes: [],
    knownUnsupportedMixes: [],
    basis: 'commercialMix',
  },
  beforeStart: [
    {
      id: 'before-0',
      text: {
        en: 'For a full-size oven tray, use a double batch.',
        es: 'Para una bandeja de horno completa, prepara una cantidad doble.',
        uk: 'Для повного дека духовки готуйте подвійну порцію.',
      },
    },
  ],
  ingredientSections: [
    {
      id: 'cake',
      title: {
        en: 'Apple charlotte',
        es: 'Carlota de manzana',
        uk: 'Яблучна шарлотка',
      },
      lines: [
        {
          id: 'apples',
          options: [
            {
              ingredientId: 'apples',
              name: {
                en: 'Firm apples',
                es: 'Manzanas firmes',
                uk: 'Щільні яблука',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 3,
              unit: 'piece',
            },
            shopping: {
              mode: 'base',
              increment: 1,
              rounding: 'up',
            },
          },
          qualifier: {
            en: 'Cut into 1–1.5 cm pieces and pat dry.',
            es: 'Córtalas en trozos de 1–1,5 cm y sécalas.',
            uk: 'Наріжте шматочками 1–1,5 см і промокніть.',
          },
        },
        {
          id: 'eggs',
          options: [
            {
              ingredientId: 'eggs',
              name: {
                en: 'Small eggs',
                es: 'Huevos pequeños',
                uk: 'Невеликі яйця',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 5,
              unit: 'piece',
            },
            shopping: {
              mode: 'base',
              increment: 1,
              rounding: 'up',
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
              value: 100,
              unit: 'g',
            },
            equivalent: {
              kind: 'exact',
              value: 5,
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
                en: 'Unsalted butter',
                es: 'Mantequilla sin sal',
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
              value: 120,
              unit: 'g',
            },
            equivalent: {
              kind: 'exact',
              value: 6,
              unit: 'tbsp',
            },
            shopping: {
              mode: 'base',
            },
          },
          qualifier: {
            en: 'Reserve 10 g for coating the apples.',
            es: 'Reserva 10 g para cubrir las manzanas.',
            uk: 'Відкладіть 10 г для яблук.',
          },
        },
        {
          id: 'tapioca',
          options: [
            {
              ingredientId: 'tapioca',
              name: {
                en: 'Tapioca starch',
                es: 'Almidón de tapioca',
                uk: 'Тапіоковий крохмаль',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 15,
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
          id: 'xanthan',
          options: [
            {
              ingredientId: 'xanthan',
              name: {
                en: 'Xanthan gum',
                es: 'Goma xantana',
                uk: 'Ксантанова камедь',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 1.5,
              unit: 'g',
            },
            equivalent: {
              kind: 'exact',
              value: 0.5,
              unit: 'tsp',
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
          id: 'vanilla',
          options: [
            {
              ingredientId: 'vanilla',
              name: {
                en: 'Vanillin',
                es: 'Vainillina',
                uk: 'Ванілін',
              },
            },
          ],
          quantity: {
            base: null,
            shopping: {
              mode: 'nameOnly',
            },
          },
        },
        {
          id: 'cinnamon',
          options: [
            {
              ingredientId: 'cinnamon',
              name: {
                en: 'Cinnamon',
                es: 'Canela',
                uk: 'Кориця',
              },
            },
          ],
          quantity: {
            base: null,
            shopping: {
              mode: 'nameOnly',
            },
          },
        },
      ],
    },
  ],
  steps: [
    {
      id: 'prepare-apples',
      title: {
        en: 'Prepare the butter and apples',
        es: 'Prepara la mantequilla y las manzanas',
        uk: 'Підготуйте масло та яблука',
      },
      instruction: {
        en: 'Melt the butter and let it cool until barely warm. Cut the apples into 1–1.5 cm pieces, pat them dry and toss with the reserved 10 g of flour.',
        es: 'Derrite la mantequilla y déjala enfriar hasta que esté apenas tibia. Corta las manzanas en trozos de 1–1,5 cm, sécalas y mézclalas con los 10 g de harina reservados.',
        uk: 'Розтопіть масло й остудіть до ледь теплого стану. Наріжте яблука шматочками 1–1,5 см, промокніть і перемішайте з відкладеними 10 г борошна.',
      },
      ingredientLineIds: ['butter', 'apples', 'flour'],
      guidance: [],
      cook: {
        ingredients: [
          {
            ingredientId: 'butter',
          },
          {
            ingredientId: 'apples',
          },
          {
            ingredientId: 'flour',
          },
        ],
      },
    },
    {
      id: 'whip-eggs',
      title: {
        en: 'Whip to ribbon stage',
        es: 'Bate hasta el punto de cinta',
        uk: 'Збийте до стрічки',
      },
      instruction: {
        en: 'Whip the eggs with the sugar until pale, thick and voluminous.',
        es: 'Bate los huevos con el azúcar hasta obtener una mezcla clara, espesa y voluminosa.',
        uk: 'Збийте яйця з цукром до світлої, густої та пишної маси.',
      },
      ingredientLineIds: ['eggs', 'sugar'],
      guidance: [
        {
          id: 'whip-eggs-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The mixture falls from the whisk in a broad ribbon that remains visible for a few seconds.',
            es: 'La mezcla cae de las varillas en una cinta ancha que permanece visible unos segundos.',
            uk: 'Маса спадає з вінчика широкою стрічкою, яка кілька секунд тримається на поверхні.',
          },
        },
      ],
      cook: {
        ingredients: [
          {
            ingredientId: 'eggs',
          },
          {
            ingredientId: 'sugar',
          },
        ],
      },
      mediaIds: ['apple-charlotte-egg-foam-v1'],
    },
    {
      id: 'fold-batter',
      title: {
        en: 'Finish the batter',
        es: 'Termina la masa',
        uk: 'Завершіть тісто',
      },
      instruction: {
        en: 'Mix the remaining flour, tapioca starch, xanthan gum, salt, vanillin and cinnamon. Fold into the egg foam. Stir a spoonful of batter into the cooled butter, fold it back into the bowl, then gently fold in the apples.',
        es: 'Mezcla la harina restante, el almidón de tapioca, la goma xantana, la sal, la vainillina y la canela. Incorpora esta mezcla a la espuma de huevo. Mezcla una cucharada de masa con la mantequilla fría, devuélvela al bol e incorpora con cuidado las manzanas.',
        uk: 'Змішайте решту борошна, тапіоковий крохмаль, ксантанову камедь, сіль, ванілін і корицю та обережно вмішайте в яєчну піну. З’єднайте ложку тіста з охолодженим маслом, поверніть суміш у миску, а потім делікатно вмішайте яблука.',
      },
      ingredientLineIds: [
        'flour',
        'tapioca',
        'xanthan',
        'salt',
        'vanilla',
        'cinnamon',
        'butter',
        'apples',
      ],
      guidance: [
        {
          id: 'fold-batter-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The batter remains airy, and the apple pieces are suspended throughout rather than collecting at the bottom.',
            es: 'La masa sigue aireada y los trozos de manzana quedan repartidos, sin acumularse en el fondo.',
            uk: 'Тісто залишається повітряним, а шматочки яблук розподілені в ньому, а не збираються на дні.',
          },
        },
      ],
      cook: {
        ingredients: [
          {
            ingredientId: 'flour',
            quantity: 'omit',
          },
          {
            ingredientId: 'tapioca',
          },
          {
            ingredientId: 'xanthan',
          },
          {
            ingredientId: 'salt',
          },
          {
            ingredientId: 'vanilla',
          },
          {
            ingredientId: 'cinnamon',
          },
          {
            ingredientId: 'butter',
            quantity: 'omit',
          },
          {
            ingredientId: 'apples',
            quantity: 'omit',
          },
        ],
      },
      mediaIds: ['folded-apple-batter-v1'],
      equipmentIds: ['bowl'],
    },
    {
      id: 'bake',
      title: {
        en: 'Bake until golden',
        es: 'Hornea hasta dorar',
        uk: 'Випікайте до золотистого кольору',
      },
      instruction: {
        en: 'Preheat the oven to 180°C. Spread the batter in a parchment-lined medium baking pan and bake.',
        es: 'Precalienta el horno a 180°C. Extiende la masa en un molde mediano forrado con papel de horno y hornea.',
        uk: 'Розігрійте духовку до 180°C. Розподіліть тісто у середній формі, застеленій пергаментом, і випікайте.',
      },
      ingredientLineIds: [],
      guidance: [
        {
          id: 'bake-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The top is golden, the centre springs back lightly, and a skewer has no wet batter.',
            es: 'La superficie está dorada, el centro recupera la forma al tocarlo y la brocheta no sale con masa cruda.',
            uk: 'Верх золотистий, центр пружно відновлюється після легкого натискання, а на шпажці немає сирого тіста.',
          },
        },
      ],
      displayMeta: {
        en: '180°C · 25–30 min',
        es: '180°C · 25–30 min',
        uk: '180°C · 25–30 хв',
      },
      temperature: {
        value: 180,
        unit: 'C',
        ovenMode: null,
      },
      equipmentIds: ['parchment'],
      durationPhaseId: 'baking',
    },
  ],
  storage: null,
  makeAhead: null,
  variations: [],
  heroMediaId: 'apple-charlotte-hero',
  media: [
    {
      id: 'apple-charlotte-hero',
      type: 'image',
      path: '/images/recipes/apple-charlotte-card-v2.webp',
      usage: ['hero'],
      alt: {
        en: 'Gluten-free apple charlotte with a cut square showing apple pieces throughout the crumb',
        es: 'Carlota de manzana sin gluten con un cuadrado cortado que muestra trozos repartidos por la miga',
        uk: 'Безглютенова яблучна шарлотка з відрізаним шматком, у м’якуші якого видно яблука',
      },
    },
    {
      id: 'apple-charlotte-egg-foam-v1',
      type: 'image',
      path: '/media/recipes/apple-charlotte/selected/whipped-egg-foam-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Pale egg foam falling from a whisk in a broad ribbon',
        es: 'Espuma clara de huevo que cae de las varillas en una cinta ancha',
        uk: 'Світла яєчна піна спадає з вінчика широкою стрічкою',
      },
    },
    {
      id: 'folded-apple-batter-v1',
      type: 'image',
      path: '/media/recipes/apple-charlotte/selected/folded-apple-batter-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Thick airy batter with small apple pieces distributed throughout',
        es: 'Masa espesa y aireada con pequeños trozos de manzana repartidos',
        uk: 'Густе повітряне тісто з рівномірно розподіленими шматочками яблук',
      },
    },
  ],
  relatedRecipeIds: [],
  sources: [
    {
      id: 'apple-charlotte-recorded-source',
      file: 'docs/reference/recipe-inventory.xlsx',
      locator:
        'Recipe Archive · Яблучна шарлотка; author-confirmed butter version and half batch, 2026-09-21',
    },
  ],
  contentGaps: [],
  presentation: 'concise',
  evidenceExplanation: {
    en: 'This exact butter-enriched apple charlotte has been baked successfully.',
    es: 'Esta versión exacta de la carlota de manzana con mantequilla se ha horneado con éxito.',
    uk: 'Саме цю версію яблучної шарлотки з маслом успішно випікали.',
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
      uk: ['Безглютенова яблучна шарлотка'],
      en: ['Gluten-free apple charlotte'],
      es: ['Carlota de manzana sin gluten'],
    },
  },
  discovery: {
    cardTitle: {
      en: 'Apple charlotte',
      es: 'Carlota de manzana',
      uk: 'Яблучна шарлотка',
    },
    category: {
      en: 'Everyday cake',
      es: 'Bizcocho cotidiano',
      uk: 'Пиріг на щодень',
    },
    flourSummary: {
      en: 'Schär Mix B Bread + tapioca starch',
      es: 'Schär Mix B Bread + almidón de tapioca',
      uk: 'Schär Mix B Bread + тапіоковий крохмаль',
    },
    collectionIds: ['everyday'],
    catalogue: true,
    imageKind: 'generated-preview',
    sourceTitle: 'Яблучна шарлотка',
    launchPriority: 'High',
    heroCandidate: 'Possible',
    source:
      'Handwritten notebook page, IMG_1278.jpeg, with author-confirmed butter version and half batch recorded 2026-09-21',
    archiveSections: [
      {
        title: 'Ingredients · reviewed half batch',
        content:
          '3 яблука\n5 невеликих яєць\n100 г цукру\n50 г вершкового масла\n120 г безглютенового борошна\n15 г тапіокового крохмалю\n1/2 ч. л. ксантанової камеді\nДрібка солі\nВанілін\nКориця',
      },
      {
        title: 'Method · reviewed version',
        content:
          'Яблука нарізати шматочками, обсушити й злегка вкрити частиною борошна. Яйця з цукром збити до стрічки, обережно вмішати сухі інгредієнти, охолоджене розтоплене масло та яблука. Випікати при 180°C протягом 25–30 хв. Для повного дека взяти подвійну порцію.',
      },
    ],
    needsBeforePublishing: '',
  },
  translationReview: {
    date: '2026-11-01',
    reviewer: 'implementation',
    scope:
      'ID-aligned transfer and semantic comparison of existing UK/EN/ES recipe text; not separate author approval',
  },
  routeSlug: 'apple-charlotte',
} satisfies Recipe;
