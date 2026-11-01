import type { Recipe } from './recipe.types.ts';

export const cottageCheeseWafflesRecipe = {
  schemaVersion: 3,
  id: 'cottage-cheese-waffles',
  versionId: 'cottage-cheese-waffles-source-v1',
  publicationStatus: 'published',
  translationState: {
    uk: 'reviewed',
    en: 'reviewed',
    es: 'reviewed',
  },
  slug: {
    en: 'cottage-cheese-waffles',
    es: 'cottage-cheese-waffles',
    uk: 'cottage-cheese-waffles',
  },
  title: {
    en: 'Gluten-free curd cheese waffles',
    es: 'Gofres de tvorog sin gluten',
    uk: 'Безглютенові сирні вафлі',
  },
  summary: {
    en: 'Tender waffles with natural yoghurt.',
    es: 'Gofres tiernos con yogur natural.',
    uk: 'Ніжні вафлі з натуральним йогуртом.',
  },
  categoryIds: [],
  situationIds: [],
  difficulty: 'easy',
  baseProvenance: {
    state: 'tested',
    sourceIds: ['cottage-cheese-waffles-recorded-source'],
  },
  timing: {
    activeMinutes: 30,
    totalElapsedMinutes: 40,
    planningNote: null,
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
          min: 7,
          max: 10,
          unit: 'minute',
        },
        relatedStepId: 'rest',
      },
      {
        id: 'waffle-baking',
        label: {
          en: 'Bake each waffle',
          es: 'Hornear cada gofre',
          uk: 'Випікання однієї вафлі',
        },
        duration: {
          kind: 'range',
          min: 5,
          max: 7,
          unit: 'minute',
        },
        relatedStepId: 'bake',
      },
    ],
  },
  yield: {
    default: {
      id: 'eight-waffles',
      label: {
        en: '8 waffles',
        es: '8 gofres',
        uk: '8 вафель',
      },
      count: {
        kind: 'exact',
        value: 8,
      },
      unit: 'serving',
      provenance: {
        state: 'tested',
        sourceIds: ['cottage-cheese-waffles-recorded-source'],
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
      geometryId: 'cottage-cheese-waffles-base',
      yieldId: 'eight-waffles',
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
            ingredientLineId: 'cottage-cheese',
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
      id: 'bowl',
      name: {
        en: 'bowl',
        es: 'bol',
        uk: 'миска',
      },
    },
    {
      id: 'waffle-maker',
      name: {
        en: 'waffle maker',
        es: 'gofrera',
        uk: 'вафельниця',
      },
    },
  ],
  flourConfiguration: {
    commercialMixLineId: 'flour',
    additionalStarchLineIds: ['corn-starch'],
    provenance: {
      state: 'tested',
      sourceIds: ['cottage-cheese-waffles-recorded-source'],
    },
    testedAlternativeMixes: [],
    knownUnsupportedMixes: [],
    basis: 'commercialMix',
  },
  beforeStart: [],
  ingredientSections: [
    {
      id: 'waffles',
      title: {
        en: 'Waffles',
        es: 'Gofres',
        uk: 'Вафлі',
      },
      lines: [
        {
          id: 'cottage-cheese',
          options: [
            {
              ingredientId: 'cottage-cheese',
              name: {
                en: 'Tvorog (curd cheese)',
                es: 'Tvorog (queso fresco de leche fermentada)',
                uk: 'Кисломолочний сир',
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
          id: 'yogurt',
          options: [
            {
              ingredientId: 'yogurt',
              name: {
                en: 'Natural yoghurt',
                es: 'Yogur natural',
                uk: 'Натуральний йогурт',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 100,
              unit: 'ml',
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
                en: 'Neutral oil or melted butter',
                es: 'Aceite neutro o mantequilla derretida',
                uk: 'Олія без запаху або розтоплене вершкове масло',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 40,
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
                es: 'Mezcla de harina Schär Mix B Bread',
                uk: 'Борошняна суміш Schär Mix B Bread',
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
        },
        {
          id: 'corn-starch',
          options: [
            {
              ingredientId: 'corn-starch',
              name: {
                en: 'Corn starch',
                es: 'Almidón de maíz',
                uk: 'Кукурудзяний крохмаль',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 7,
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
          id: 'baking-powder',
          options: [
            {
              ingredientId: 'baking-powder',
              name: {
                en: 'Baking powder',
                es: 'Levadura química',
                uk: 'Розпушувач',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 5,
              unit: 'g',
            },
            equivalent: {
              kind: 'exact',
              value: 1,
              unit: 'tsp',
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
          id: 'vanilla',
          options: [
            {
              ingredientId: 'vanilla',
              name: {
                en: 'Vanilla',
                es: 'Vainilla',
                uk: 'Ваніль',
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
      id: 'blend-base',
      title: {
        en: 'Blend the base',
        es: 'Tritura la base',
        uk: 'Збийте основу',
      },
      instruction: {
        en: 'Blend the tvorog, eggs and yoghurt until smooth, with no noticeable lumps.',
        es: 'Tritura el tvorog, los huevos y el yogur hasta obtener una mezcla lisa, sin grumos perceptibles.',
        uk: 'Збийте блендером кисломолочний сир, яйця та йогурт до гладкої маси без помітних грудочок.',
      },
      ingredientLineIds: ['cottage-cheese', 'eggs', 'yogurt'],
      guidance: [],
      cook: {
        ingredients: [
          {
            ingredientId: 'cottage-cheese',
          },
          {
            ingredientId: 'eggs',
          },
          {
            ingredientId: 'yogurt',
          },
        ],
      },
      mediaIds: ['ingredients-before-blending', 'blended-base'],
    },
    {
      id: 'add-wet',
      title: {
        en: 'Add the remaining wet ingredients',
        es: 'Añade los demás ingredientes húmedos',
        uk: 'Додайте решту вологих інгредієнтів',
      },
      instruction: {
        en: 'Mix in the neutral oil or melted butter, sugar, salt and vanilla.',
        es: 'Incorpora el aceite neutro o la mantequilla derretida, el azúcar, la sal y la vainilla.',
        uk: 'Вмішайте олію без запаху або розтоплене вершкове масло, цукор, сіль і ваніль.',
      },
      ingredientLineIds: ['oil', 'sugar', 'salt', 'vanilla'],
      guidance: [],
      cook: {
        ingredients: [
          {
            ingredientId: 'oil',
          },
          {
            ingredientId: 'sugar',
          },
          {
            ingredientId: 'salt',
          },
          {
            ingredientId: 'vanilla',
          },
        ],
      },
    },
    {
      id: 'mix-dry',
      title: {
        en: 'Make the batter',
        es: 'Prepara la masa',
        uk: 'Приготуйте тісто',
      },
      instruction: {
        en: 'In a separate bowl, mix the flour, corn starch and baking powder. Add to the base and stir until no dry flour remains.',
        es: 'En otro bol, mezcla la harina, el almidón de maíz y la levadura química. Incorpóralos a la base y remueve hasta que no quede harina seca.',
        uk: 'В окремій мисці змішайте борошно, крохмаль і розпушувач. Додайте до основи й перемішайте, щоб не залишилося сухого борошна.',
      },
      ingredientLineIds: ['flour', 'corn-starch', 'baking-powder'],
      guidance: [
        {
          id: 'mix-dry-tip',
          kind: 'practicalTip',
          text: {
            en: 'Suggested, not bake-tested: if you like, fold in a few small pieces of cherries or other chopped fruit. Keep the amount modest so the batter does not become too wet.',
            es: 'Cambio sugerido, aún sin probar: si quieres, añade unos pocos trocitos de cerezas u otra fruta picada. Usa poca cantidad para no aportar demasiada humedad a la masa.',
            uk: 'Запропонована, ще не перевірена зміна: за бажанням додайте трохи вишень або дрібно нарізаних інших фруктів. Не кладіть багато, щоб тісто не стало надто вологим.',
          },
        },
      ],
      cook: {
        ingredients: [
          {
            ingredientId: 'flour',
          },
          {
            ingredientId: 'corn-starch',
          },
          {
            ingredientId: 'baking-powder',
          },
        ],
      },
      mediaIds: ['add-dry-ingredients', 'mixed-batter'],
      equipmentIds: ['bowl'],
    },
    {
      id: 'rest',
      title: {
        en: 'Rest the batter',
        es: 'Deja reposar la masa',
        uk: 'Дайте тісту відпочити',
      },
      instruction: {
        en: 'Leave to rest for 7–10 minutes.',
        es: 'Deja reposar durante 7–10 minutos.',
        uk: 'Залиште на 7–10 хвилин.',
      },
      ingredientLineIds: [],
      guidance: [],
      durationPhaseId: 'batter-rest',
    },
    {
      id: 'bake',
      title: {
        en: 'Bake the waffles',
        es: 'Hornea los gofres',
        uk: 'Спечіть вафлі',
      },
      instruction: {
        en: 'Heat the waffle maker well. Bake each waffle for 5–7 minutes until golden.',
        es: 'Calienta bien la gofrera. Hornea cada gofre durante 5–7 minutos, hasta que esté dorado.',
        uk: 'Добре розігрійте вафельницю. Випікайте кожну вафлю 5–7 хвилин до золотистого кольору.',
      },
      ingredientLineIds: [],
      guidance: [],
      mediaIds: ['fill-waffle-maker', 'baked-waffles', 'served-waffles'],
      equipmentIds: ['waffle-maker'],
      durationPhaseId: 'waffle-baking',
    },
  ],
  storage: null,
  makeAhead: null,
  variations: [],
  heroMediaId: 'served-waffles',
  media: [
    {
      id: 'ingredients-before-blending',
      type: 'image',
      path: '/media/recipes/cottage-cheese-waffles/selected/step-01-ingredients-before-blending-kitchen-v2.webp',
      usage: ['step'],
      alt: {
        en: 'Tvorog curd cheese, eggs and natural yoghurt together in a white bowl before blending',
        es: 'Tvorog, huevos y yogur natural juntos en un bol blanco antes de triturarlos',
        uk: 'Кисломолочний сир, яйця та натуральний йогурт у білій мисці перед збиванням',
      },
    },
    {
      id: 'blended-base',
      type: 'image',
      path: '/media/recipes/cottage-cheese-waffles/selected/step-01-blended-base-kitchen-v2.webp',
      usage: ['step'],
      alt: {
        en: 'Smooth cottage-cheese, egg and yoghurt base with an immersion blender in the bowl',
        es: 'Base lisa de tvorog, huevos y yogur con una batidora de mano dentro del bol',
        uk: 'Гладка основа з кисломолочного сиру, яєць і йогурту із занурювальним блендером у мисці',
      },
    },
    {
      id: 'add-dry-ingredients',
      type: 'image',
      path: '/media/recipes/cottage-cheese-waffles/selected/step-03-add-dry-kitchen-v2.webp',
      usage: ['step'],
      alt: {
        en: 'Gluten-free flour added to the wet waffle base before mixing',
        es: 'Harina sin gluten añadida a la base húmeda de los gofres antes de mezclar',
        uk: 'Безглютенове борошно, додане до вологої основи для вафель перед перемішуванням',
      },
    },
    {
      id: 'mixed-batter',
      type: 'image',
      path: '/media/recipes/cottage-cheese-waffles/selected/step-03-mixed-batter-kitchen-v2.webp',
      usage: ['step'],
      alt: {
        en: 'Thick, smooth waffle batter lifted on a spoon above the bowl',
        es: 'Masa espesa y lisa para gofres levantada con una cuchara sobre el bol',
        uk: 'Густе гладке тісто для вафель на ложці над мискою',
      },
    },
    {
      id: 'fill-waffle-maker',
      type: 'image',
      path: '/media/recipes/cottage-cheese-waffles/selected/step-05-fill-waffle-maker-kitchen-v2.webp',
      usage: ['step'],
      alt: {
        en: 'Berry-speckled waffle batter being spooned into a heated waffle maker',
        es: 'Masa para gofres con frutos rojos colocada con una cuchara en la gofrera caliente',
        uk: 'Тісто для вафель з ягодами викладають ложкою в розігріту вафельницю',
      },
    },
    {
      id: 'baked-waffles',
      type: 'image',
      path: '/media/recipes/cottage-cheese-waffles/selected/step-05-baked-waffles-kitchen-v2.webp',
      usage: ['step'],
      alt: {
        en: 'Two golden berry cottage-cheese waffles in an open waffle maker',
        es: 'Dos gofres dorados de tvorog con frutos rojos en una gofrera abierta',
        uk: 'Дві золотисті сирні вафлі з ягодами у відкритій вафельниці',
      },
    },
    {
      id: 'served-waffles',
      type: 'image',
      path: '/images/recipes/cottage-cheese-waffles-linen-ivory-plate-v3.webp',
      usage: ['step', 'hero'],
      alt: {
        en: 'Golden berry cottage-cheese waffles on an ivory ceramic plate',
        es: 'Gofres dorados de tvorog con frutos rojos en un plato de cerámica marfil',
        uk: 'Золотисті сирні вафлі з ягодами на світлій керамічній тарілці',
      },
      heroAlt: {
        en: 'Golden gluten-free curd cheese waffles with berries on an ivory ceramic plate',
        es: 'Gofres dorados sin gluten de tvorog con frutos rojos en un plato de cerámica marfil',
        uk: 'Золотисті безглютенові сирні вафлі з ягодами на світлій керамічній тарілці',
      },
    },
  ],
  relatedRecipeIds: [],
  sources: [
    {
      id: 'cottage-cheese-waffles-recorded-source',
      file: 'docs/reference/recipe-inventory.xlsx',
      locator: 'Recipe Archive · Сирні вафлі',
    },
  ],
  contentGaps: [],
  presentation: 'concise',
  evidenceExplanation: {
    en: 'This exact recipe has been baked successfully.',
    es: 'Esta versión se ha horneado con éxito.',
    uk: 'Цю версію успішно випікали.',
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
      uk: ['Безглютенові сирні вафлі'],
      en: ['Gluten-free curd cheese waffles'],
      es: ['Gofres de tvorog sin gluten'],
    },
  },
  discovery: {
    cardTitle: {
      en: 'Curd cheese waffles',
      es: 'Gofres de tvorog',
      uk: 'Сирні вафлі',
    },
    category: {
      en: 'Breakfast / snack',
      es: 'Desayuno / tentempié',
      uk: 'Сніданок / перекус',
    },
    flourSummary: {
      en: 'Schär Mix B Bread + corn starch',
      es: 'Schär Mix B Bread + almidón de maíz',
      uk: 'Schär Mix B Bread + кукурудзяний крохмаль',
    },
    collectionIds: [
      'breakfast',
      'everyday',
      'cottage-cheese',
      'batter-on-hand',
    ],
    catalogue: true,
    imageKind: 'edited-author-photo',
    sourceTitle: 'Творожні вафлі',
    launchPriority: 'Medium',
    heroCandidate: 'No',
    source: 'Handwritten notebook page, IMG_1276.jpeg',
    archiveSections: [
      {
        title: 'Ingredients · original notes',
        content:
          'Творог — 500 г (2 пачки)\nЯйця — 4 шт.\nНатуральний йогурт — 200 мл (2 пачки)\nОлія соняшникова — 60–80 мл\nБорошно — 250 г\nКукурудзяний крохмаль — 1 ст. л.\nРозпушувач — 2 ч. л.\nЦукор — 1 ст. л.\nДрібка солі\nВаніль',
      },
      {
        title: 'Method · original notes',
        content:
          '1. Творог проблендерити з яйцями і йогуртом до однорідної маси.\n2. Додати олію, цукор, сіль і ваніль.\n3. Окремо змішати борошно, крохмаль і розпушувач.\n4. Всипати до вологої маси і замішати.\n5. Залишити тісто на 7–10 хв.\n6. Добре розігріти вафельницю. Випікати по 5–7 хв.',
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
  seo: {
    uk: {
      title: 'Безглютенові сирні вафлі',
      description:
        'Безглютенові сирні вафлі з кисломолочним сиром і натуральним йогуртом. Склад, пропорції та покрокове приготування у вафельниці.',
    },
    en: {
      title: 'Gluten-free curd cheese waffles',
      description:
        'Gluten-free curd cheese waffles made with tvorog and natural yoghurt. Ingredient quantities and step-by-step instructions for the waffle maker.',
    },
    es: {
      title: 'Gofres de tvorog sin gluten',
      description:
        'Gofres sin gluten con tvorog, un queso fresco de leche fermentada, y yogur natural. Ingredientes y preparación en gofrera paso a paso.',
    },
  },
  routeSlug: 'cottage-cheese-waffles',
} satisfies Recipe;
