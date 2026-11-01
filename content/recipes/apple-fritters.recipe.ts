import type { Recipe } from './recipe.types.ts';

export const appleFrittersRecipe = {
  schemaVersion: 3,
  id: 'apple-fritters',
  versionId: 'apple-fritters-source-v1',
  publicationStatus: 'published',
  translationState: {
    uk: 'reviewed',
    en: 'reviewed',
    es: 'reviewed',
  },
  slug: {
    en: 'apple-fritters',
    es: 'apple-fritters',
    uk: 'apple-fritters',
  },
  title: {
    en: 'Gluten-free apple fritters',
    es: 'Tortitas de manzana sin gluten',
    uk: 'Безглютенові яблучні оладки',
  },
  summary: {
    en: 'Tender gluten-free apple fritters with Schär Mix B Bread.',
    es: 'Tortitas tiernas de manzana sin gluten con Schär Mix B Bread.',
    uk: 'Ніжні безглютенові яблучні оладки з борошном Schär Mix B Bread.',
  },
  categoryIds: [],
  situationIds: [],
  difficulty: 'easy',
  baseProvenance: {
    state: 'tested',
    sourceIds: ['apple-fritters-recorded-source'],
  },
  timing: {
    activeMinutes: 30,
    totalElapsedMinutes: null,
    planningNote: {
      text: {
        en: 'A handy rule of thumb: one large apple per person.',
        es: 'Como orientación, calcula una manzana grande por persona.',
        uk: 'Зручний розрахунок: одне велике яблуко на людину.',
      },
    },
    phases: [
      {
        id: 'fry-one-side',
        relatedStepId: 'fry',
        duration: {
          kind: 'range',
          min: 2,
          max: 3,
          unit: 'minute',
        },
        label: {
          en: 'Fry one side',
          es: 'Freír un lado',
          uk: 'Смаження одного боку',
        },
      },
    ],
  },
  yield: {
    default: {
      id: 'twenty-fritters',
      label: {
        en: '20 fritters',
        es: '20 tortitas',
        uk: '20 оладок',
      },
      count: {
        kind: 'exact',
        value: 20,
      },
      unit: 'serving',
      provenance: {
        state: 'tested',
        sourceIds: ['apple-fritters-recorded-source'],
      },
      availability: 'default',
    },
    alternatives: [],
  },
  geometry: {
    state: 'known',
    default: {
      id: 'apple-fritters-base',
      label: {
        en: 'Frying pan',
        es: 'Sartén',
        uk: 'Сковорода',
      },
      shape: 'round',
      kind: 'other',
      application: 'other',
      diameterCm: null,
      layerCount: null,
      material: null,
      availability: 'default',
      provenance: {
        state: 'tested',
        sourceIds: ['apple-fritters-recorded-source'],
      },
    },
    alternatives: [],
  },
  configuration: {
    base: {
      geometryId: 'apple-fritters-base',
      yieldId: 'twenty-fritters',
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
            ingredientLineId: 'flour',
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
      id: 'grater',
      name: {
        en: 'grater',
        es: 'rallador',
        uk: 'тертка',
      },
    },
    {
      id: 'frying-pan',
      name: {
        en: 'frying pan',
        es: 'sartén',
        uk: 'сковорода',
      },
    },
  ],
  flourConfiguration: {
    commercialMixLineId: 'flour',
    additionalStarchLineIds: [],
    provenance: {
      state: 'tested',
      sourceIds: ['apple-fritters-recorded-source'],
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
        en: 'Apple fritter batter',
        es: 'Masa de las tortitas de manzana',
        uk: 'Тісто для яблучних оладок',
      },
      lines: [
        {
          id: 'apples',
          options: [
            {
              ingredientId: 'apples',
              name: {
                en: 'Apples',
                es: 'Manzanas',
                uk: 'Яблука',
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
            en: 'Peel and grate coarsely.',
            es: 'Pela y ralla por el lado grueso del rallador.',
            uk: 'Очистьте та натріть на великій тертці.',
          },
        },
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
              value: 2,
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
          id: 'kefir-or-yogurt',
          options: [
            {
              ingredientId: 'kefir-or-yogurt',
              name: {
                en: 'Kefir or natural yoghurt',
                es: 'Kéfir o yogur natural',
                uk: 'Кефір або натуральний йогурт',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 150,
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
          id: 'sweetener',
          options: [
            {
              ingredientId: 'sweetener',
              name: {
                en: 'Sugar or a ripe soft banana',
                es: 'Azúcar o un plátano maduro y blando',
                uk: 'Цукор або стиглий м’який банан',
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
          qualifier: {
            en: 'Use the sugar amount shown. To replace it, mash one ripe soft banana per tablespoon of sugar.',
            es: 'Usa la cantidad de azúcar indicada. Para sustituirla, machaca un plátano maduro y blando por cada cucharada de azúcar.',
            uk: 'Візьміть зазначену кількість цукру. Для заміни розімніть один стиглий м’який банан на кожну столову ложку цукру.',
          },
        },
        {
          id: 'baking-soda',
          options: [
            {
              ingredientId: 'baking-soda',
              name: {
                en: 'Bicarbonate of soda',
                es: 'Bicarbonato sódico',
                uk: 'Харчова сода',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 3,
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
          id: 'oil',
          options: [
            {
              ingredientId: 'oil',
              name: {
                en: 'Oil for frying',
                es: 'Aceite para freír',
                uk: 'Олія для смаження',
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
        en: 'Prepare the apples',
        es: 'Prepara las manzanas',
        uk: 'Підготуйте яблука',
      },
      instruction: {
        en: 'Wash and peel the apples, then grate them on the coarse side of a grater. Do not grate them finely, or they will release too much juice.',
        es: 'Lava y pela las manzanas y rállalas por el lado grueso del rallador. No las ralles finas: soltarían demasiado zumo.',
        uk: 'Помийте й очистьте яблука, потім натріть їх на великій тертці. Не натирайте дрібно, інакше яблука пустять забагато соку.',
      },
      ingredientLineIds: ['apples'],
      guidance: [
        {
          id: 'prepare-apples-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The apples are in distinct coarse shreds rather than a fine, wet pulp.',
            es: 'La manzana queda en hebras gruesas y sueltas, sin convertirse en una pulpa húmeda.',
            uk: 'Яблука натерті виразною великою стружкою, а не перетворені на дрібну вологу масу.',
          },
        },
      ],
      cook: {
        ingredients: [
          {
            ingredientId: 'apples',
          },
        ],
      },
      mediaIds: ['apple-fritters-coarse-grated-apples-v1'],
      equipmentIds: ['grater'],
    },
    {
      id: 'mix-batter',
      title: {
        en: 'Mix the batter',
        es: 'Mezcla la masa',
        uk: 'Замішайте тісто',
      },
      instruction: {
        en: 'Crack the eggs directly into the grated apples. Add the kefir or yoghurt and the sugar, or the mashed banana instead of sugar, then mix. Add the Schär Mix B Bread flour and bicarbonate of soda and stir until combined.',
        es: 'Casca los huevos directamente sobre la manzana rallada. Añade el kéfir o yogur y el azúcar, o el plátano machacado si lo usas en su lugar. Mezcla. Incorpora la harina Schär Mix B Bread y el bicarbonato y remueve hasta integrar.',
        uk: 'Прямо в натерті яблука вбийте яйця. Додайте кефір або йогурт і цукор чи розім’ятий банан замість цукру, перемішайте. Потім додайте борошно Schär Mix B Bread і соду та перемішайте до поєднання.',
      },
      ingredientLineIds: [
        'eggs',
        'kefir-or-yogurt',
        'sweetener',
        'flour',
        'baking-soda',
      ],
      guidance: [],
      cook: {
        ingredients: [
          {
            ingredientId: 'eggs',
          },
          {
            ingredientId: 'kefir-or-yogurt',
          },
          {
            ingredientId: 'sweetener',
          },
          {
            ingredientId: 'flour',
          },
          {
            ingredientId: 'baking-soda',
          },
        ],
      },
      mediaIds: ['apple-fritters-mix-batter-v1'],
    },
    {
      id: 'fry',
      title: {
        en: 'Fry the fritters',
        es: 'Cocina las tortitas',
        uk: 'Посмажте оладки',
      },
      instruction: {
        en: 'Heat a little oil in a frying pan. Spoon 1 tablespoon of batter per fritter into the hot pan and fry over medium heat for 2–3 minutes per side, so the apples have time to cook through.',
        es: 'Calienta una sartén con un poco de aceite. Añade 1 cucharada de masa por tortita y cocina a fuego medio durante 2–3 minutos por cada lado, para que la manzana se haga por dentro.',
        uk: 'Розігрійте пательню з невеликою кількістю олії. Викладайте на гарячу пательню по 1 столовій ложці тіста на оладок і смажте на середньому вогні по 2–3 хвилини з кожного боку, щоб яблука встигли пропектися.',
      },
      ingredientLineIds: ['oil'],
      guidance: [
        {
          id: 'fry-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'Turn when the underside is golden and the top has begun to set around the edges; the centre should no longer look wet after the second side cooks.',
            es: 'Dales la vuelta cuando la base esté dorada y los bordes empiecen a cuajar. Al terminar el segundo lado, el centro no debe quedar crudo.',
            uk: 'Перевертайте, коли низ уже золотистий, а поверхня почала схоплюватися по краях; після другого боку серединка не має виглядати вологою.',
          },
        },
        {
          id: 'fry-tip',
          kind: 'practicalTip',
          text: {
            en: 'Lower the heat if the outside browns before the top begins to set.',
            es: 'Baja el fuego si se doran antes de que la superficie empiece a cuajar.',
            uk: 'Зменште вогонь, якщо скоринка темнішає раніше, ніж поверхня починає схоплюватися.',
          },
        },
      ],
      displayMeta: {
        en: '2–3 min per side · medium heat',
        es: '2–3 min por lado · fuego medio',
        uk: 'По 2–3 хв з кожного боку · середній вогонь',
      },
      cook: {
        ingredients: [
          {
            ingredientId: 'oil',
            quantity: 'omit',
            note: {
              en: 'Add a little more between batches if needed.',
              es: 'Añade un poco más de aceite entre tandas si hace falta.',
              uk: 'За потреби додайте ще трохи олії між партіями.',
            },
          },
        ],
      },
      mediaIds: ['apple-fritters-fry-fritters-v1'],
      equipmentIds: ['frying-pan'],
    },
  ],
  storage: null,
  makeAhead: null,
  variations: [],
  heroMediaId: 'apple-fritters-hero',
  media: [
    {
      id: 'apple-fritters-hero',
      type: 'image',
      path: '/images/recipes/apple-fritters-card-v1.webp',
      usage: ['hero'],
      alt: {
        en: 'Gluten-free apple fritters',
        es: 'Tortitas de manzana sin gluten',
        uk: 'Безглютенові яблучні оладки',
      },
    },
    {
      id: 'apple-fritters-coarse-grated-apples-v1',
      type: 'image',
      path: '/media/recipes/apple-fritters/selected/step-01-coarse-grated-apples-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Peeled apples grated into coarse shreds in a ceramic bowl',
        es: 'Manzanas peladas ralladas en hebras gruesas sobre un bol de cerámica',
        uk: 'Очищені яблука натирають великою стружкою в керамічну миску',
      },
    },
    {
      id: 'apple-fritters-mix-batter-v1',
      type: 'image',
      path: '/media/recipes/apple-fritters/selected/step-02-mix-batter-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Thick apple-fritter batter with coarse apple shreds mixed in a ceramic bowl',
        es: 'Masa espesa de tortitas con manzana rallada en un bol de cerámica',
        uk: 'Густе тісто для оладок із великою яблучною стружкою перемішують у керамічній мисці',
      },
    },
    {
      id: 'apple-fritters-fry-fritters-v1',
      type: 'image',
      path: '/media/recipes/apple-fritters/selected/step-03-fry-fritters-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Small apple fritters frying in a lightly oiled uncovered pan',
        es: 'Tortitas pequeñas de manzana en una sartén destapada con una capa fina de aceite',
        uk: 'Невеликі яблучні оладки смажаться на відкритій пательні з тонким шаром олії',
      },
    },
  ],
  relatedRecipeIds: [],
  sources: [
    {
      id: 'apple-fritters-recorded-source',
      file: 'https://trueua.info/news/smachno-ta-korysno-retsept-yabluchnykh-oladkiv-bez-tsukru',
      locator:
        'Яблучні оладки · exact ingredient list and method supplied by the author, adapted with Schär Mix B Bread',
    },
  ],
  contentGaps: [],
  presentation: 'concise',
  evidenceExplanation: {
    en: 'This exact version was cooked successfully.',
    es: 'Esta versión se ha preparado con éxito.',
    uk: 'Цю версію успішно приготовано.',
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
      uk: ['Безглютенові яблучні оладки'],
      en: ['Gluten-free apple fritters'],
      es: ['Tortitas de manzana sin gluten'],
    },
  },
  discovery: {
    cardTitle: {
      en: 'Apple fritters',
      es: 'Tortitas de manzana',
      uk: 'Яблучні оладки',
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
    imageKind: 'generated-preview',
    sourceTitle: 'Яблучні оладки',
    launchPriority: 'Medium',
    heroCandidate: 'No',
    source:
      'Full recipe supplied by the author with a reference to trueua.info',
    archiveSections: [
      {
        title: 'Ingredients · original notes',
        content:
          'Яблука — 2 шт.\nЯйце — 1 шт.\nКефір або натуральний йогурт — 160 г\nБезглютенове борошно Schär Mix B Bread — 140 г\nЦукор або мед — 1 ст. л. (за смаком)\nСода — 0,5 ч. л.\nОлія — для смаження',
      },
      {
        title: 'Method · original notes',
        content:
          'Помити й очистити яблука, натерти на середній тертці. Збити яйце з йогуртом та цукром чи медом. Додати яблука. Всипати борошно та соду й перемішати до консистенції густої сметани. Розігріти пательню з невеликою кількістю олії на середньому вогні. Викладати невеликі оладки ложкою. Смажити під кришкою по 2–3 хвилини з кожного боку до золотистої скоринки.',
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
  showImageNote: false,
  seo: {
    uk: {
      title: 'Безглютенові яблучні оладки',
      description:
        'Безглютенові яблучні оладки на Schär Mix B Bread. Склад, пропорції, приготування тіста та смаження ніжних оладок на пательні.',
    },
    en: {
      title: 'Gluten-free apple fritters',
      description:
        'Gluten-free apple fritters made with Schär Mix B Bread. Ingredient quantities and step-by-step instructions for mixing and pan-frying.',
    },
    es: {
      title: 'Tortitas de manzana sin gluten',
      description:
        'Tortitas de manzana sin gluten con Schär Mix B Bread. Ingredientes, cantidades y preparación de la masa y cocción en sartén.',
    },
  },
  routeSlug: 'apple-fritters',
} satisfies Recipe;
