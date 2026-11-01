import type { Recipe } from './recipe.types.ts';

export const bananaFrittersRecipe = {
  schemaVersion: 3,
  id: 'banana-fritters',
  versionId: 'banana-fritters-source-v1',
  publicationStatus: 'published',
  translationState: {
    uk: 'reviewed',
    en: 'reviewed',
    es: 'reviewed',
  },
  slug: {
    en: 'banana-fritters',
    es: 'banana-fritters',
    uk: 'banana-fritters',
  },
  title: {
    en: 'Gluten-free banana pancakes',
    es: 'Tortitas de plátano sin gluten',
    uk: 'Безглютенові бананові панкейки',
  },
  summary: {
    en: 'Tender and fluffy, with Greek yoghurt and Schär Mix B Bread.',
    es: 'Tiernas y esponjosas, con yogur griego y Schär Mix B Bread.',
    uk: 'Ніжні й пухкі, з грецьким йогуртом та Schär Mix B Bread.',
  },
  categoryIds: [],
  situationIds: [],
  difficulty: 'easy',
  baseProvenance: {
    state: 'tested',
    sourceIds: ['banana-fritters-recorded-source'],
  },
  timing: {
    activeMinutes: 30,
    totalElapsedMinutes: 30,
    planningNote: null,
    phases: [
      {
        id: 'prep',
        label: {
          en: 'Preparation',
          es: 'Preparación',
          uk: 'Підготовка',
        },
        duration: {
          kind: 'exact',
          value: 18,
          unit: 'minute',
        },
      },
      {
        id: 'cook',
        label: {
          en: 'Cooking',
          es: 'Cocción en sartén',
          uk: 'Смаження',
        },
        duration: {
          kind: 'exact',
          value: 12,
          unit: 'minute',
        },
      },
    ],
  },
  yield: {
    default: {
      id: 'twenty-eight-pancakes',
      label: {
        en: '28 pancakes',
        es: '28 tortitas',
        uk: '28 панкейків',
      },
      count: {
        kind: 'exact',
        value: 28,
      },
      unit: 'serving',
      provenance: {
        state: 'tested',
        sourceIds: ['banana-fritters-recorded-source'],
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
      geometryId: 'banana-fritters-base',
      yieldId: 'twenty-eight-pancakes',
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
            ingredientLineId: 'bananas',
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
      id: 'whisk',
      name: {
        en: 'whisk',
        es: 'varillas',
        uk: 'вінчик',
      },
    },
    {
      id: 'fork',
      name: {
        en: 'fork',
        es: 'tenedor',
        uk: 'виделка',
      },
    },
  ],
  flourConfiguration: {
    commercialMixLineId: 'flour',
    additionalStarchLineIds: [],
    provenance: {
      state: 'tested',
      sourceIds: ['banana-fritters-recorded-source'],
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
        en: 'Banana pancake batter',
        es: 'Masa de las tortitas de plátano',
        uk: 'Тісто для бананових панкейків',
      },
      lines: [
        {
          id: 'bananas',
          options: [
            {
              ingredientId: 'bananas',
              name: {
                en: 'Very ripe bananas, peeled',
                es: 'Plátanos muy maduros, pelados',
                uk: 'Дуже стиглі банани, очищені',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 500,
              unit: 'g',
            },
            equivalent: {
              kind: 'range',
              min: 4,
              max: 5,
              unit: 'piece',
            },
            shopping: {
              mode: 'base',
            },
          },
          qualifier: {
            en: 'Weigh after peeling.',
            es: 'Pesa los plátanos sin piel.',
            uk: 'Зважуйте без шкірки.',
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
              value: 200,
              unit: 'g',
            },
            equivalent: {
              kind: 'exact',
              value: 10,
              unit: 'tbsp',
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
          optional: true,
          qualifier: {
            en: 'Omit if the bananas are very ripe and sweet.',
            es: 'Omítelo si los plátanos están muy maduros y dulces.',
            uk: 'Не додавайте, якщо банани дуже стиглі й солодкі.',
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
            base: {
              kind: 'exact',
              value: 1.5,
              unit: 'g',
            },
            equivalent: {
              kind: 'exact',
              value: 0.25,
              unit: 'tsp',
            },
            shopping: {
              mode: 'base',
            },
          },
        },
        {
          id: 'greek-yogurt',
          options: [
            {
              ingredientId: 'greek-yogurt',
              name: {
                en: 'Greek yoghurt',
                es: 'Yogur griego',
                uk: 'Грецький йогурт',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 250,
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
                en: 'Large eggs',
                es: 'Huevos grandes',
                uk: 'Великі яйця',
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
          id: 'butter',
          options: [
            {
              ingredientId: 'butter',
              name: {
                en: 'Unsalted butter, melted',
                es: 'Mantequilla derretida',
                uk: 'Вершкове масло, розтоплене',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 30,
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
          optional: true,
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
              value: 1,
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
                en: 'Olive oil for the pan',
                es: 'Aceite de oliva para la sartén',
                uk: 'Оливкова олія для пательні',
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
      ],
    },
  ],
  steps: [
    {
      id: 'mix-wet',
      title: {
        en: 'Mash and mix',
        es: 'Machaca y mezcla',
        uk: 'Розімніть і змішайте',
      },
      instruction: {
        en: 'Mash the bananas with a fork, leaving small soft pieces. Add the eggs, Greek yoghurt and vanilla. Add the melted butter, if using, and whisk until combined.',
        es: 'Machaca los plátanos con un tenedor, dejando algunos trocitos blandos. Añade los huevos, el yogur griego y la vainilla. Si usas mantequilla derretida, incorpórala y mezcla.',
        uk: 'Розімніть банани виделкою, залишаючи невеликі м’які шматочки. Додайте яйця, грецький йогурт і ваніль. За бажанням додайте розтоплене вершкове масло та перемішайте до об’єднання.',
      },
      ingredientLineIds: [
        'bananas',
        'eggs',
        'greek-yogurt',
        'butter',
        'vanilla',
      ],
      guidance: [],
      cook: {
        ingredients: [
          {
            ingredientId: 'bananas',
          },
          {
            ingredientId: 'eggs',
          },
          {
            ingredientId: 'greek-yogurt',
          },
          {
            ingredientId: 'butter',
          },
          {
            ingredientId: 'vanilla',
          },
        ],
      },
      mediaIds: [
        'banana-pancakes-mashed-bananas-v1',
        'banana-pancakes-wet-mixture-v1',
      ],
      equipmentIds: ['whisk', 'fork'],
    },
    {
      id: 'mix-batter',
      title: {
        en: 'Add the dry ingredients',
        es: 'Añade los ingredientes secos',
        uk: 'Додайте сухі інгредієнти',
      },
      instruction: {
        en: 'Add the Schär Mix B Bread flour, baking powder, salt and sugar, if using. Mix with a spoon or whisk only until combined.',
        es: 'Añade la harina Schär Mix B Bread, la levadura química, la sal y el azúcar, si lo usas. Mezcla con una cuchara o unas varillas solo hasta integrar.',
        uk: 'Додайте борошно Schär Mix B Bread, розпушувач, сіль і цукор, якщо використовуєте. Перемішайте ложкою або вінчиком лише до об’єднання.',
      },
      ingredientLineIds: ['flour', 'baking-powder', 'salt', 'sugar'],
      guidance: [
        {
          id: 'mix-batter-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The batter is thick and spoonable, with small lumps remaining.',
            es: 'La masa queda espesa y se recoge fácilmente con una cuchara; pueden quedar pequeños grumos.',
            uk: 'Тісто густе, легко набирається ложкою; невеликі грудочки залишаються.',
          },
        },
      ],
      cook: {
        ingredients: [
          {
            ingredientId: 'flour',
          },
          {
            ingredientId: 'baking-powder',
          },
          {
            ingredientId: 'salt',
          },
          {
            ingredientId: 'sugar',
          },
        ],
      },
      mediaIds: ['banana-pancakes-lumpy-batter-v1'],
      equipmentIds: ['whisk'],
    },
    {
      id: 'portion',
      title: {
        en: 'Preheat the pan and portion',
        es: 'Calienta la sartén y reparte la masa',
        uk: 'Розігрійте пательню й викладіть тісто',
      },
      instruction: {
        en: 'Heat a pan over medium heat and lightly grease it with oil. Spoon 1 tablespoon of batter per pancake, leaving a little space between them.',
        es: 'Calienta la sartén a fuego medio y engrásala ligeramente. Añade 1 cucharada de masa por tortita, dejando algo de espacio entre ellas.',
        uk: 'Розігрійте пательню на середньому вогні та злегка змастіть олією. Викладайте по 1 столовій ложці тіста на кожен панкейк, залишаючи між ними трохи місця.',
      },
      ingredientLineIds: ['oil'],
      guidance: [],
      cook: {
        ingredients: [
          {
            ingredientId: 'oil',
          },
        ],
      },
    },
    {
      id: 'cook',
      title: {
        en: 'Cook, flip and serve',
        es: 'Cocina, da la vuelta y sirve',
        uk: 'Підсмажте, переверніть і подавайте',
      },
      instruction: {
        en: 'Cook until the edges look matte and the bubbles on top begin to pop. Flip and cook until the second side is golden. Add a little more oil as needed. Serve warm; these pancakes pair especially well with honey.',
        es: 'Cocina hasta que los bordes estén mates y las burbujas de la superficie empiecen a romperse. Da la vuelta y dora el otro lado. Añade un poco de aceite si hace falta. Sirve calientes; quedan muy bien con miel.',
        uk: 'Смажте, доки краї стануть матовими, а бульбашки на поверхні почнуть лопатися. Переверніть і готуйте до золотистої скоринки з другого боку. За потреби додавайте трохи олії. Подавайте теплими — вони особливо добре смакують із медом.',
      },
      ingredientLineIds: ['oil'],
      guidance: [
        {
          id: 'cook-tip',
          kind: 'practicalTip',
          text: {
            en: 'Lower the heat if the pancakes brown before the bubbles begin to pop.',
            es: 'Baja el fuego si las tortitas se doran antes de que las burbujas empiecen a romperse.',
            uk: 'Зменште вогонь, якщо панкейки підрум’янюються раніше, ніж починають лопатися бульбашки.',
          },
        },
      ],
      cook: {
        ingredients: [
          {
            ingredientId: 'oil',
            quantity: 'omit',
            note: {
              en: 'Use the remaining oil as needed.',
              es: 'Añade el aceite restante según haga falta.',
              uk: 'Додавайте решту олії за потреби.',
            },
          },
        ],
      },
      mediaIds: [
        'banana-pancakes-flip-cue-author-v1',
        'banana-pancakes-finished-pan-author-v1',
      ],
    },
  ],
  storage: null,
  makeAhead: null,
  variations: [],
  heroMediaId: 'banana-fritters-hero',
  media: [
    {
      id: 'banana-fritters-hero',
      type: 'image',
      path: '/images/recipes/banana-pancakes-card-v3.webp',
      usage: ['hero'],
      alt: {
        en: 'Thick irregular gluten-free banana pancakes with golden-brown tops and a tender crumb',
        es: 'Tortitas de plátano sin gluten, gruesas e irregulares, doradas y con una miga tierna',
        uk: 'Товсті нерівні безглютенові бананові панкейки із золотистою скоринкою та ніжною серединкою',
      },
    },
    {
      id: 'banana-pancakes-mashed-bananas-v1',
      type: 'image',
      path: '/media/recipes/banana-fritters/selected/mashed-bananas-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Very ripe bananas mashed with a fork while small soft pieces remain',
        es: 'Plátanos muy maduros machacados con un tenedor, con algunos trocitos blandos',
        uk: 'Дуже стиглі банани, розім’яті виделкою з невеликими м’якими шматочками',
      },
    },
    {
      id: 'banana-pancakes-wet-mixture-v1',
      type: 'image',
      path: '/media/recipes/banana-fritters/selected/wet-mixture-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Pale golden banana and Greek yoghurt mixture with small banana flecks',
        es: 'Mezcla de plátano y yogur griego de color dorado claro, con pequeños trozos de fruta',
        uk: 'Світло-золотиста бананова суміш із грецьким йогуртом і дрібними часточками банана',
      },
    },
    {
      id: 'banana-pancakes-lumpy-batter-v1',
      type: 'image',
      path: '/media/recipes/banana-fritters/selected/lumpy-batter-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Thick banana pancake batter falling from a spatula with small lumps visible',
        es: 'Masa espesa de tortitas de plátano con pequeños grumos sobre una espátula',
        uk: 'Густе тісто для бананових панкейків із невеликими грудочками на лопатці',
      },
    },
    {
      id: 'banana-pancakes-flip-cue-author-v1',
      type: 'image',
      path: '/media/recipes/banana-fritters/selected/flip-cue-author-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Homemade banana pancakes cooking on a pan as bubbles open on the surface',
        es: 'Tortitas caseras de plátano con burbujas abiertas en la superficie, en una sartén',
        uk: 'Домашні бананові панкейки на пательні, на поверхні яких відкриваються бульбашки',
      },
    },
    {
      id: 'banana-pancakes-finished-pan-author-v1',
      type: 'image',
      path: '/media/recipes/banana-fritters/selected/finished-pan-author-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Thick irregular banana pancakes cooked until golden brown on a pan',
        es: 'Tortitas gruesas de plátano, de forma irregular y doradas en la sartén',
        uk: 'Товсті нерівні бананові панкейки, підсмажені на пательні до золотистої скоринки',
      },
    },
  ],
  relatedRecipeIds: [],
  sources: [
    {
      id: 'banana-fritters-recorded-source',
      file: 'https://natashaskitchen.com/banana-pancakes/',
      locator:
        'Banana Pancakes · author-tested 500 g banana and Greek-yogurt adaptation with Schär Mix B Bread',
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
    cookTimeMinutes: 12,
    recipeCuisine: {
      uk: null,
      en: null,
      es: null,
    },
    keywords: {
      uk: ['Безглютенові бананові панкейки'],
      en: ['Gluten-free banana pancakes'],
      es: ['Tortitas de plátano sin gluten'],
    },
  },
  discovery: {
    cardTitle: {
      en: 'Banana pancakes',
      es: 'Tortitas de plátano',
      uk: 'Бананові панкейки',
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
    sourceTitle: 'Бананові панкейки',
    launchPriority: 'Medium',
    heroCandidate: 'No',
    source:
      'Natasha’s Kitchen Banana Pancakes, adapted and tested by the author with Schär Mix B Bread',
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
      title: 'Безглютенові бананові панкейки',
      description:
        'Безглютенові бананові панкейки з грецьким йогуртом і Schär Mix B Bread. Пропорції, тісто та приготування на пательні крок за кроком.',
    },
    en: {
      title: 'Gluten-free banana pancakes',
      description:
        'Gluten-free banana pancakes with Greek yoghurt and Schär Mix B Bread. Ingredient quantities, batter preparation and step-by-step cooking instructions.',
    },
    es: {
      title: 'Tortitas de plátano sin gluten',
      description:
        'Tortitas de plátano sin gluten con yogur griego y Schär Mix B Bread. Cantidades, preparación de la masa y cocción en sartén paso a paso.',
    },
  },
  routeSlug: 'banana-fritters',
} satisfies Recipe;
