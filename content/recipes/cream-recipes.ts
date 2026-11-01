import type { Recipe } from './recipe.types.ts';

export const mascarponeWhippedCreamRecipe = {
  schemaVersion: 3,
  id: 'mascarpone-whipped-cream',
  versionId: 'mascarpone-whipped-cream-source-v1',
  publicationStatus: 'published',
  translationState: {
    uk: 'reviewed',
    en: 'reviewed',
    es: 'reviewed',
  },
  slug: {
    en: 'mascarpone-whipped-cream',
    es: 'mascarpone-whipped-cream',
    uk: 'mascarpone-whipped-cream',
  },
  title: {
    en: 'Whipped cream with mascarpone',
    es: 'Crema de nata y mascarpone',
    uk: 'Крем із вершків та маскарпоне',
  },
  summary: {
    en: 'A light, quick cream that spreads easily and holds its shape.',
    es: 'Una crema ligera y rápida que se extiende bien y mantiene la forma.',
    uk: 'Легкий швидкий крем, який легко намазується й добре тримає форму.',
  },
  categoryIds: [],
  situationIds: [],
  difficulty: 'easy',
  baseProvenance: {
    state: 'tested',
    sourceIds: ['mascarpone-whipped-cream-recorded-source'],
  },
  timing: {
    activeMinutes: 10,
    totalElapsedMinutes: 10,
    planningNote: null,
    phases: [],
  },
  yield: {
    default: {
      id: 'about-580-g-cream',
      label: {
        en: 'About 580 g cream',
        es: 'Unos 580 g de crema',
        uk: 'Близько 580 г крему',
      },
      count: {
        kind: 'exact',
        value: 580,
      },
      unit: 'g',
      provenance: {
        state: 'tested',
        sourceIds: ['mascarpone-whipped-cream-recorded-source'],
      },
      availability: 'default',
      approximate: true,
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
      geometryId: 'mascarpone-whipped-cream-base',
      yieldId: 'about-580-g-cream',
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
            ingredientLineId: 'whipping-cream',
            allowedUnit: 'ml',
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
  beforeStart: [],
  ingredientSections: [
    {
      id: 'cream',
      title: {
        en: 'Cream',
        es: 'Crema',
        uk: 'Крем',
      },
      lines: [
        {
          id: 'whipping-cream',
          options: [
            {
              ingredientId: 'whipping-cream',
              name: {
                en: 'Whipping cream',
                es: 'Nata para montar',
                uk: 'Вершки для збивання',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 250,
              unit: 'ml',
            },
            shopping: {
              mode: 'base',
            },
          },
          qualifier: {
            en: 'Keep refrigerated until whipping.',
            es: 'Mantenla refrigerada hasta el momento de batir.',
            uk: 'Тримайте в холодильнику до збивання.',
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
              value: 80,
              unit: 'g',
            },
            equivalent: {
              kind: 'exact',
              value: 4,
              unit: 'tbsp',
            },
            shopping: {
              mode: 'base',
            },
          },
        },
        {
          id: 'mascarpone',
          options: [
            {
              ingredientId: 'mascarpone',
              name: {
                en: 'Mascarpone',
                es: 'Mascarpone',
                uk: 'Маскарпоне',
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
          qualifier: {
            en: 'Keep refrigerated until needed.',
            es: 'Mantenlo refrigerado hasta que lo necesites.',
            uk: 'Тримайте в холодильнику до використання.',
          },
        },
      ],
    },
  ],
  steps: [
    {
      id: 'whip-cream',
      title: {
        en: 'Whip the cream with the sugar',
        es: 'Monta la nata con el azúcar',
        uk: 'Збийте вершки з цукром',
      },
      instruction: {
        en: 'Whip the cold cream with the sugar until it thickens and holds soft peaks.',
        es: 'Bate la nata fría con el azúcar hasta que espese y forme picos suaves.',
        uk: 'Збивайте холодні вершки з цукром, доки вони не загуснуть і не утворять м’які піки.',
      },
      ingredientLineIds: ['whipping-cream', 'sugar'],
      guidance: [
        {
          id: 'whip-cream-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The whisk leaves clear tracks and the peak bends gently without collapsing.',
            es: 'Las varillas dejan marcas claras y el pico se inclina suavemente sin deshacerse.',
            uk: 'Вінчики залишають чіткі сліди, а пік м’яко згинається, але не опадає.',
          },
        },
      ],
      cook: {
        ingredients: [
          {
            ingredientId: 'whipping-cream',
          },
          {
            ingredientId: 'sugar',
          },
        ],
      },
    },
    {
      id: 'add-mascarpone',
      title: {
        en: 'Add the mascarpone',
        es: 'Añade el mascarpone',
        uk: 'Додайте маскарпоне',
      },
      instruction: {
        en: 'Add the cold mascarpone and whip briefly, just until the cream is smooth and holds its shape.',
        es: 'Añade el mascarpone frío y bate brevemente, solo hasta obtener una crema lisa que mantenga la forma.',
        uk: 'Додайте холодний маскарпоне й коротко збийте лише до гладкого крему, який тримає форму.',
      },
      ingredientLineIds: ['mascarpone'],
      guidance: [
        {
          id: 'add-mascarpone-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The cream is smooth, spreadable and holds a firm soft peak on the whisk or spatula.',
            es: 'La crema está lisa, se puede extender y mantiene un pico suave y firme en las varillas o la espátula.',
            uk: 'Крем гладкий, легко намазується й тримає м’який стійкий пік на вінчику або лопатці.',
          },
        },
        {
          id: 'add-mascarpone-tip',
          kind: 'practicalTip',
          text: {
            en: 'Stop mixing as soon as the cream is stable; prolonged whipping can make it grainy.',
            es: 'Deja de batir en cuanto esté estable; batir durante demasiado tiempo puede volverla granulosa.',
            uk: 'Зупиніть збивання, щойно крем стане стійким: від надмірного збивання він може стати зернистим.',
          },
        },
      ],
      cook: {
        ingredients: [
          {
            ingredientId: 'mascarpone',
          },
        ],
      },
      mediaIds: ['mascarpone-cream-final-v1'],
    },
  ],
  storage: null,
  makeAhead: null,
  variations: [],
  heroMediaId: 'mascarpone-whipped-cream-hero',
  media: [
    {
      id: 'mascarpone-whipped-cream-hero',
      type: 'image',
      path: '/images/recipes/mascarpone-whipped-cream-card-v1.webp',
      usage: ['hero'],
      alt: {
        en: 'Smooth whipped mascarpone cream holding firm soft peaks in a ceramic bowl',
        es: 'Crema de mascarpone montada con picos suaves y firmes en un bol de cerámica',
        uk: 'Гладкий збитий крем із маскарпоне тримає м’які стійкі піки в керамічній мисці',
      },
    },
    {
      id: 'mascarpone-cream-final-v1',
      type: 'image',
      path: '/media/recipes/fruit-sponge-roll/selected/mascarpone-cream-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Whipped mascarpone cream holding a smooth stable peak on a spatula',
        es: 'Crema de mascarpone montada que mantiene un pico liso y estable en una espátula',
        uk: 'Збитий крем із маскарпоне тримає гладкий стійкий пік на лопатці',
      },
    },
  ],
  relatedRecipeIds: [],
  sources: [
    {
      id: 'mascarpone-whipped-cream-recorded-source',
      file: 'docs/reference/recipe-inventory.xlsx',
      locator: 'Recipe Archive · Бісквітний рулет з фруктами · крем',
    },
  ],
  contentGaps: [],
  presentation: 'concise',
  evidenceExplanation: {
    en: 'This exact cream has been prepared successfully.',
    es: 'Esta versión exacta de la crema se ha preparado con éxito.',
    uk: 'Цей точний варіант крему успішно готували.',
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
      uk: ['Крем із вершків та маскарпоне'],
      en: ['Whipped cream with mascarpone'],
      es: ['Crema de nata y mascarpone'],
    },
  },
  discovery: {
    cardTitle: {
      en: 'Whipped cream with mascarpone',
      es: 'Crema de nata y mascarpone',
      uk: 'Крем із вершків та маскарпоне',
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
    sourceTitle: 'Крем із вершків та маскарпоне',
    launchPriority: 'Linked recipe',
    heroCandidate: 'Yes',
    source: 'Recipe Archive · Бісквітний рулет з фруктами · крем',
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
      title: 'Крем із вершків та маскарпоне',
      description:
        'Крем зі збитих вершків і маскарпоне для начинки та оздоблення. Пропорції й покрокове приготування легкого крему, який тримає форму.',
    },
    en: {
      title: 'Whipped cream with mascarpone',
      description:
        'Whipped cream with mascarpone for filling and decorating cakes. Ingredient quantities and steps for a light cream that holds its shape.',
    },
    es: {
      title: 'Crema de nata y mascarpone',
      description:
        'Crema de nata montada y mascarpone para rellenar y decorar. Cantidades y pasos para obtener una crema ligera que mantiene la forma.',
    },
  },
  creamOption: {
    en: {
      title: 'Whipped cream with mascarpone',
      description:
        'A light, quick cream for filling pastries or layering sponge cakes that holds its shape well.',
    },
    es: {
      title: 'Nata montada con mascarpone',
      description:
        'Una crema ligera y rápida para rellenar pasteles o montar bizcochos que mantiene bien la forma.',
    },
    uk: {
      title: 'Збиті вершки з маскарпоне',
      description:
        'Легкий швидкий крем для наповнення тістечок і прошарування бісквітів, який добре тримає форму.',
    },
  },
  routeSlug: 'mascarpone-whipped-cream',
} satisfies Recipe;

export const vanillaEggCustardRecipe = {
  schemaVersion: 3,
  id: 'vanilla-egg-custard',
  versionId: 'vanilla-egg-custard-source-v1',
  publicationStatus: 'published',
  translationState: {
    uk: 'reviewed',
    en: 'reviewed',
    es: 'reviewed',
  },
  slug: {
    en: 'vanilla-egg-custard',
    es: 'vanilla-egg-custard',
    uk: 'vanilla-egg-custard',
  },
  title: {
    en: 'Vanilla custard with eggs',
    es: 'Crema pastelera de vainilla con huevo',
    uk: 'Ванільний заварний крем з яйцями',
  },
  summary: {
    en: 'A smooth classic custard that cools into a stable pastry filling.',
    es: 'Una crema pastelera clásica y lisa que al enfriarse queda estable para rellenar.',
    uk: 'Гладкий класичний заварний крем, який після охолодження стає стійкою начинкою.',
  },
  categoryIds: [],
  situationIds: [],
  difficulty: 'medium',
  baseProvenance: {
    state: 'tested',
    sourceIds: ['vanilla-egg-custard-recorded-source'],
  },
  timing: {
    activeMinutes: 25,
    totalElapsedMinutes: 150,
    planningNote: null,
    phases: [
      {
        id: 'chill-custard',
        label: {
          en: 'Chill completely',
          es: 'Enfriar por completo',
          uk: 'Повне охолодження',
        },
        duration: {
          kind: 'exact',
          value: 2,
          unit: 'hour',
        },
        relatedStepId: 'finish-and-chill',
      },
      {
        id: 'cook-after-bubbling',
        relatedStepId: 'cook-custard',
        duration: {
          kind: 'exact',
          value: 1,
          unit: 'minute',
        },
        label: {
          en: 'Cook after bubbling',
          es: 'Cocer después de burbujear',
          uk: 'Варіння після появи бульбашок',
        },
      },
    ],
  },
  yield: {
    default: {
      id: 'about-900-g-custard',
      label: {
        en: 'About 900 g cream',
        es: 'Unos 900 g de crema',
        uk: 'Близько 900 г крему',
      },
      count: {
        kind: 'exact',
        value: 900,
      },
      unit: 'g',
      provenance: {
        state: 'tested',
        sourceIds: ['vanilla-egg-custard-recorded-source'],
      },
      availability: 'default',
      approximate: true,
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
      geometryId: 'vanilla-egg-custard-base',
      yieldId: 'about-900-g-custard',
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
            ingredientLineId: 'milk',
            allowedUnit: 'ml',
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
      id: 'saucepan',
      name: {
        en: 'saucepan',
        es: 'cazo',
        uk: 'каструля',
      },
    },
  ],
  flourConfiguration: null,
  beforeStart: [
    {
      id: 'before-0',
      text: {
        en: 'Allow about 2 hours for the finished custard to chill completely before filling pastries.',
        es: 'Reserva unas 2 horas para enfriar por completo la crema antes de rellenar los pasteles.',
        uk: 'Закладіть близько 2 годин, щоб готовий крем повністю охолов перед наповненням тістечок.',
      },
    },
  ],
  ingredientSections: [
    {
      id: 'custard',
      title: {
        en: 'Vanilla custard',
        es: 'Crema pastelera de vainilla',
        uk: 'Ванільний заварний крем',
      },
      lines: [
        {
          id: 'milk',
          options: [
            {
              ingredientId: 'milk',
              name: {
                en: 'Whole milk',
                es: 'Leche entera',
                uk: 'Незбиране молоко',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 570,
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
              value: 130,
              unit: 'g',
            },
            equivalent: {
              kind: 'exact',
              value: 6.5,
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
              value: 28,
              unit: 'g',
            },
            equivalent: {
              kind: 'exact',
              value: 4,
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
        },
        {
          id: 'egg-yolks',
          options: [
            {
              ingredientId: 'egg-yolks',
              name: {
                en: 'Egg yolks',
                es: 'Yemas de huevo',
                uk: 'Яєчні жовтки',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 6,
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
            base: null,
            equivalent: {
              kind: 'exact',
              value: 2,
              unit: 'tsp',
            },
            shopping: {
              mode: 'nameOnly',
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
                uk: 'Несолоне вершкове масло',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 110,
              unit: 'g',
            },
            shopping: {
              mode: 'base',
            },
          },
          qualifier: {
            en: 'Cold, cut into small cubes.',
            es: 'Fría y cortada en cubos pequeños.',
            uk: 'Холодне, нарізане невеликими кубиками.',
          },
        },
      ],
    },
  ],
  steps: [
    {
      id: 'heat-milk',
      title: {
        en: 'Heat the milk',
        es: 'Calienta la leche',
        uk: 'Нагрійте молоко',
      },
      instruction: {
        en: 'Heat the milk over medium heat until small bubbles appear around the edge. Do not let it boil vigorously.',
        es: 'Calienta la leche a fuego medio hasta que aparezcan pequeñas burbujas en el borde. No dejes que hierva con fuerza.',
        uk: 'Нагрівайте молоко на середньому вогні, доки по краю не з’являться дрібні бульбашки. Не давайте йому бурхливо кипіти.',
      },
      ingredientLineIds: ['milk'],
      guidance: [
        {
          id: 'heat-milk-tip',
          kind: 'practicalTip',
          text: {
            en: 'Gentle heat reduces evaporation and prevents scorching.',
            es: 'El fuego suave reduce la evaporación y evita que la leche se queme.',
            uk: 'Помірне нагрівання зменшує випаровування й не дає молоку пригоріти.',
          },
        },
      ],
      cook: {
        ingredients: [
          {
            ingredientId: 'milk',
          },
        ],
      },
    },
    {
      id: 'mix-yolks',
      title: {
        en: 'Mix the yolk base',
        es: 'Prepara la base de yemas',
        uk: 'Змішайте жовткову основу',
      },
      instruction: {
        en: 'Whisk the sugar, corn starch and salt together. Add the egg yolks and whisk until the mixture is smooth and paler.',
        es: 'Mezcla el azúcar, el almidón y la sal. Añade las yemas y bate hasta obtener una mezcla lisa y más pálida.',
        uk: 'Перемішайте цукор, кукурудзяний крохмаль і сіль. Додайте жовтки та збийте до гладкої світлішої маси.',
      },
      ingredientLineIds: ['sugar', 'corn-starch', 'salt', 'egg-yolks'],
      guidance: [],
      cook: {
        ingredients: [
          {
            ingredientId: 'sugar',
          },
          {
            ingredientId: 'corn-starch',
          },
          {
            ingredientId: 'salt',
          },
          {
            ingredientId: 'egg-yolks',
          },
        ],
      },
      equipmentIds: ['whisk'],
    },
    {
      id: 'temper-yolks',
      title: {
        en: 'Temper the yolks',
        es: 'Templa las yemas',
        uk: 'Темперуйте жовтки',
      },
      instruction: {
        en: 'Whisking constantly, gradually pour about half of the hot milk into the yolk mixture. Return everything to the saucepan.',
        es: 'Sin dejar de batir, vierte poco a poco aproximadamente la mitad de la leche caliente sobre las yemas. Devuelve todo al cazo.',
        uk: 'Постійно збиваючи, поступово влийте до жовткової маси приблизно половину гарячого молока. Поверніть усе в сотейник.',
      },
      ingredientLineIds: [],
      guidance: [
        {
          id: 'temper-yolks-tip',
          kind: 'practicalTip',
          text: {
            en: 'Pour the milk slowly and keep the whisk moving so the yolks warm without scrambling.',
            es: 'Vierte la leche lentamente y mantén las varillas en movimiento para que las yemas no se cuajen.',
            uk: 'Вливайте молоко повільно й безперервно працюйте вінчиком, щоб жовтки не згорнулися.',
          },
        },
      ],
      equipmentIds: ['saucepan'],
    },
    {
      id: 'cook-custard',
      title: {
        en: 'Cook until thick',
        es: 'Cuece hasta que espese',
        uk: 'Заваріть до загустіння',
      },
      instruction: {
        en: 'Cook over medium heat, whisking constantly. When bubbles begin to break across the centre, continue cooking for 1 minute.',
        es: 'Cuece a fuego medio, batiendo constantemente. Cuando las burbujas aparezcan también en el centro, continúa 1 minuto más.',
        uk: 'Варіть на середньому вогні, постійно збиваючи. Коли бульбашки почнуть виходити й у центрі, готуйте ще 1 хвилину.',
      },
      ingredientLineIds: [],
      guidance: [
        {
          id: 'cook-custard-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The custard is glossy and thick, and broad bubbles break through the centre.',
            es: 'La crema está brillante y espesa, y salen burbujas grandes por el centro.',
            uk: 'Крем блискучий і густий, а широкі бульбашки виходять у центрі.',
          },
        },
        {
          id: 'cook-custard-tip',
          kind: 'practicalTip',
          text: {
            en: 'Whisk into the corners of the saucepan, where the custard thickens first.',
            es: 'Pasa las varillas por las esquinas del cazo, donde la crema espesa primero.',
            uk: 'Проводьте вінчиком по кутах сотейника — там крем густішає найшвидше.',
          },
        },
      ],
    },
    {
      id: 'finish-and-chill',
      title: {
        en: 'Finish and chill the custard',
        es: 'Termina y enfría la crema',
        uk: 'Завершіть і охолодіть крем',
      },
      instruction: {
        en: 'Remove from the heat and strain. Stir in the vanilla, then add the cold butter a few pieces at a time. Cover the surface directly and chill completely.',
        es: 'Retira del fuego y cuela. Incorpora la vainilla y después la mantequilla fría, poco a poco. Cubre la superficie directamente y deja enfriar por completo.',
        uk: 'Зніміть із вогню та процідіть. Вмішайте ваніль, а потім порціями холодне масло. Накрийте поверхню в контакт і повністю охолодіть.',
      },
      ingredientLineIds: ['vanilla', 'butter'],
      guidance: [
        {
          id: 'finish-and-chill-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The custard is smooth and glossy with no lumps; after chilling it holds its shape on a spoon.',
            es: 'La crema está lisa y brillante, sin grumos; una vez fría mantiene la forma en una cuchara.',
            uk: 'Крем гладкий і блискучий, без грудочок; після охолодження тримає форму на ложці.',
          },
        },
      ],
      cook: {
        ingredients: [
          {
            ingredientId: 'vanilla',
          },
          {
            ingredientId: 'butter',
          },
        ],
      },
      mediaIds: ['vanilla-egg-custard-final-v1'],
      durationPhaseId: 'chill-custard',
    },
  ],
  storage: null,
  makeAhead: null,
  variations: [],
  heroMediaId: 'vanilla-egg-custard-hero',
  media: [
    {
      id: 'vanilla-egg-custard-hero',
      type: 'image',
      path: '/images/recipes/vanilla-egg-custard-card-v1.webp',
      usage: ['hero'],
      alt: {
        en: 'Thick glossy vanilla egg custard falling from a spoon into a ceramic bowl',
        es: 'Crema pastelera de vainilla espesa y brillante cayendo de una cuchara a un bol de cerámica',
        uk: 'Густий блискучий ванільний крем з яйцями спадає з ложки в керамічну миску',
      },
    },
    {
      id: 'vanilla-egg-custard-final-v1',
      type: 'image',
      path: '/media/recipes/vanilla-egg-custard/selected/final-custard-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Smooth glossy vanilla custard holding its shape on a spoon',
        es: 'Crema pastelera de vainilla lisa y brillante que mantiene la forma en una cuchara',
        uk: 'Гладкий блискучий ванільний крем тримає форму на ложці',
      },
    },
  ],
  relatedRecipeIds: [],
  sources: [
    {
      id: 'vanilla-egg-custard-recorded-source',
      file: 'User-confirmed cream set, 2026-09-20',
      locator: 'Vanilla custard with egg yolks',
    },
  ],
  contentGaps: [],
  presentation: 'concise',
  evidenceExplanation: {
    en: 'This exact cream has been prepared successfully.',
    es: 'Esta versión exacta de la crema se ha preparado con éxito.',
    uk: 'Цей точний варіант крему успішно готували.',
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
      uk: ['Ванільний заварний крем з яйцями'],
      en: ['Vanilla custard with eggs'],
      es: ['Crema pastelera de vainilla con huevo'],
    },
  },
  discovery: {
    cardTitle: {
      en: 'Vanilla custard with eggs',
      es: 'Crema pastelera de vainilla con huevo',
      uk: 'Ванільний заварний крем з яйцями',
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
    sourceTitle: 'Ванільний заварний крем з яйцями',
    launchPriority: 'Linked recipe',
    heroCandidate: 'Yes',
    source: 'User-provided reference · pastry cream with eggs',
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
      title: 'Ванільний заварний крем з яйцями',
      description:
        'Ванільний заварний крем з яйцями для начинки тортів і тістечок. Інгредієнти, приготування та охолодження гладкого крему.',
    },
    en: {
      title: 'Vanilla custard with eggs',
      description:
        'Vanilla custard with eggs for filling cakes and pastries. Ingredient quantities and instructions for cooking and cooling a smooth custard.',
    },
    es: {
      title: 'Crema pastelera de vainilla con huevo',
      description:
        'Crema pastelera de vainilla con huevo para rellenar tartas y pasteles. Ingredientes, cocción y enfriado explicados paso a paso.',
    },
  },
  creamOption: {
    en: {
      title: 'Vanilla custard with eggs',
      description:
        'A smooth classic cream for filling pastries and layering desserts.',
    },
    es: {
      title: 'Crema pastelera de vainilla con huevo',
      description:
        'Una crema clásica y lisa para rellenar pasteles y montar postres.',
    },
    uk: {
      title: 'Ванільний заварний крем з яйцями',
      description:
        'Гладкий класичний крем для наповнення тістечок і прошарування десертів.',
    },
  },
  routeSlug: 'vanilla-egg-custard',
} satisfies Recipe;

export const egglessVanillaCustardRecipe = {
  schemaVersion: 3,
  id: 'eggless-vanilla-custard',
  versionId: 'eggless-vanilla-custard-source-v1',
  publicationStatus: 'published',
  translationState: {
    uk: 'reviewed',
    en: 'reviewed',
    es: 'reviewed',
  },
  slug: {
    en: 'eggless-vanilla-custard',
    es: 'eggless-vanilla-custard',
    uk: 'eggless-vanilla-custard',
  },
  title: {
    en: 'Eggless vanilla custard',
    es: 'Crema de vainilla sin huevo',
    uk: 'Ванільний заварний крем без яєць',
  },
  summary: {
    en: 'A large-batch homemade custard that thickens further as it cools.',
    es: 'Una crema casera abundante que se espesa aún más al enfriarse.',
    uk: 'Домашній крем великого виходу, який додатково густішає під час охолодження.',
  },
  categoryIds: [],
  situationIds: [],
  difficulty: 'medium',
  baseProvenance: {
    state: 'tested',
    sourceIds: ['eggless-vanilla-custard-recorded-source'],
  },
  timing: {
    activeMinutes: 25,
    totalElapsedMinutes: 150,
    planningNote: null,
    phases: [
      {
        id: 'cool-eggless-custard',
        label: {
          en: 'Cool completely',
          es: 'Enfriar por completo',
          uk: 'Повне охолодження',
        },
        duration: {
          kind: 'exact',
          value: 2,
          unit: 'hour',
        },
        relatedStepId: 'cool',
      },
    ],
  },
  yield: {
    default: {
      id: 'about-1-8-kg-custard',
      label: {
        en: 'About 1.8 kg cream',
        es: 'Unos 1,8 kg de crema',
        uk: 'Близько 1,8 кг крему',
      },
      count: {
        kind: 'exact',
        value: 1.8,
      },
      unit: 'kg',
      provenance: {
        state: 'tested',
        sourceIds: ['eggless-vanilla-custard-recorded-source'],
      },
      availability: 'default',
      approximate: true,
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
      geometryId: 'eggless-vanilla-custard-base',
      yieldId: 'about-1-8-kg-custard',
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
            ingredientLineId: 'milk',
            allowedUnit: 'ml',
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
      sourceIds: ['eggless-vanilla-custard-recorded-source'],
    },
    testedAlternativeMixes: [],
    knownUnsupportedMixes: [],
    basis: 'commercialMix',
  },
  beforeStart: [
    {
      id: 'before-0',
      text: {
        en: 'Allow about 2 hours for this large batch to cool completely before filling pastries.',
        es: 'Reserva unas 2 horas para que esta tanda grande se enfríe por completo antes de rellenar los pasteles.',
        uk: 'Закладіть близько 2 годин, щоб така велика порція повністю охолола перед наповненням тістечок.',
      },
    },
  ],
  ingredientSections: [
    {
      id: 'custard',
      title: {
        en: 'Eggless vanilla custard',
        es: 'Crema de vainilla sin huevo',
        uk: 'Ванільний заварний крем без яєць',
      },
      lines: [
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
              value: 1500,
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
          id: 'flour',
          options: [
            {
              ingredientId: 'flour',
              name: {
                en: 'Schär Mix B Bread flour blend',
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
              value: 200,
              unit: 'g',
            },
            shopping: {
              mode: 'base',
            },
          },
          qualifier: {
            en: 'Softened so it can be worked with a fork or spoon.',
            es: 'Ablandada para poder trabajarla con un tenedor o una cuchara.',
            uk: 'М’яке, щоб його можна було розім’яти виделкою або ложкою.',
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
          optional: true,
          qualifier: {
            en: 'Add to taste.',
            es: 'Añade al gusto.',
            uk: 'Додайте до смаку.',
          },
        },
      ],
    },
  ],
  steps: [
    {
      id: 'make-paste',
      title: {
        en: 'Make the butter and flour paste',
        es: 'Prepara la pasta de mantequilla y harina',
        uk: 'Зробіть пасту з масла та борошна',
      },
      instruction: {
        en: 'Mix the sugar and flour. Add the softened butter and work everything together with a fork or spoon to make an even paste.',
        es: 'Mezcla el azúcar y la harina. Añade la mantequilla blanda y trabaja todo con un tenedor o una cuchara hasta obtener una pasta uniforme.',
        uk: 'Змішайте цукор із борошном. Додайте м’яке масло й розімніть усе виделкою або ложкою до однорідної пасти.',
      },
      ingredientLineIds: ['sugar', 'flour', 'butter'],
      technique: {
        id: 'soften-butter',
      },
      guidance: [
        {
          id: 'make-paste-tip',
          kind: 'practicalTip',
          text: {
            en: 'The butter should be soft but not melted so the flour can be worked into it evenly.',
            es: 'La mantequilla debe estar blanda pero no derretida para que la harina se incorpore de manera uniforme.',
            uk: 'Масло має бути м’яким, але не розтопленим, щоб борошно рівномірно з ним змішалося.',
          },
        },
      ],
      cook: {
        ingredients: [
          {
            ingredientId: 'sugar',
          },
          {
            ingredientId: 'flour',
          },
          {
            ingredientId: 'butter',
          },
        ],
      },
      equipmentIds: ['fork'],
    },
    {
      id: 'add-first-milk',
      title: {
        en: 'Add half of the milk',
        es: 'Añade la mitad de la leche',
        uk: 'Додайте половину молока',
      },
      instruction: {
        en: 'Gradually stir in about half of the milk. Warm slowly over low heat, stirring continuously until the mixture becomes smooth.',
        es: 'Incorpora poco a poco aproximadamente la mitad de la leche. Calienta lentamente a fuego bajo, removiendo sin parar hasta que la mezcla quede lisa.',
        uk: 'Поступово вмішайте приблизно половину молока. Повільно нагрівайте на слабкому вогні, безперервно помішуючи, доки суміш не стане гладкою.',
      },
      ingredientLineIds: ['milk'],
      guidance: [],
      cook: {
        ingredients: [
          {
            ingredientId: 'milk',
          },
        ],
      },
    },
    {
      id: 'finish-cooking',
      title: {
        en: 'Add the remaining milk and cook',
        es: 'Añade el resto de la leche y cuece',
        uk: 'Додайте решту молока й заваріть',
      },
      instruction: {
        en: 'Pour in the remaining milk and add vanilla to taste. Continue heating and stirring until the first bubbles appear, then remove from the heat.',
        es: 'Vierte el resto de la leche y añade vainilla al gusto. Continúa calentando y removiendo hasta que aparezcan las primeras burbujas; retira del fuego.',
        uk: 'Влийте решту молока й додайте ваніль до смаку. Продовжуйте нагрівати й помішувати до появи перших бульбашок, тоді зніміть із вогню.',
      },
      ingredientLineIds: ['vanilla'],
      guidance: [
        {
          id: 'finish-cooking-tip',
          kind: 'practicalTip',
          text: {
            en: 'Stir across the bottom and into the corners so the flour does not settle or scorch.',
            es: 'Remueve bien el fondo y las esquinas para que la harina no se deposite ni se queme.',
            uk: 'Проводьте ложкою або вінчиком по дну та кутах, щоб борошно не осідало й не пригорало.',
          },
        },
      ],
      cook: {
        ingredients: [
          {
            ingredientId: 'vanilla',
          },
        ],
      },
    },
    {
      id: 'cool',
      title: {
        en: 'Cover and cool',
        es: 'Cubre y enfría',
        uk: 'Накрийте й охолодіть',
      },
      instruction: {
        en: 'Transfer the cream to a clean container, cover the surface directly and let it cool before filling the pastry.',
        es: 'Pasa la crema a un recipiente limpio, cubre la superficie directamente y deja enfriar antes de rellenar la masa.',
        uk: 'Перекладіть крем у чисту посудину, накрийте поверхню в контакт і дайте охолонути перед наповненням випічки.',
      },
      ingredientLineIds: [],
      guidance: [
        {
          id: 'cool-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The cooled cream is even and spoonable, without a dry skin on top.',
            es: 'La crema fría es uniforme y se puede servir con cuchara, sin una película seca en la superficie.',
            uk: 'Охолоджений крем однорідний, набирається ложкою й не має сухої плівки зверху.',
          },
        },
      ],
      mediaIds: ['eggless-vanilla-custard-final-v1'],
      durationPhaseId: 'cool-eggless-custard',
    },
  ],
  storage: null,
  makeAhead: null,
  variations: [],
  heroMediaId: 'eggless-vanilla-custard-hero',
  media: [
    {
      id: 'eggless-vanilla-custard-hero',
      type: 'image',
      path: '/images/recipes/eggless-vanilla-custard-card-v1.webp',
      usage: ['hero'],
      alt: {
        en: 'Thick pale eggless vanilla custard with a clear spatula channel in a ceramic bowl',
        es: 'Crema de vainilla sin huevo espesa y pálida con un surco de espátula en un bol de cerámica',
        uk: 'Густий світлий ванільний крем без яєць із чітким слідом від лопатки в керамічній мисці',
      },
    },
    {
      id: 'eggless-vanilla-custard-final-v1',
      type: 'image',
      path: '/media/recipes/eggless-vanilla-custard/selected/final-custard-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Thick eggless vanilla custard with a spatula channel that closes slowly',
        es: 'Crema de vainilla sin huevo espesa con un surco de espátula que se cierra lentamente',
        uk: 'Густий ванільний крем без яєць зі слідом від лопатки, що повільно сходиться',
      },
    },
  ],
  relatedRecipeIds: [],
  sources: [
    {
      id: 'eggless-vanilla-custard-recorded-source',
      file: 'User-provided recipe, 2026-09-20',
      locator:
        '1.5 l milk · 6 tbsp sugar · 6 tbsp Schär Mix B Bread · 200 g butter; flour confirmed by the user on 2026-09-27, 120 g from the shared spoon calculator',
    },
  ],
  contentGaps: [],
  presentation: 'concise',
  evidenceExplanation: {
    en: 'This exact cream has been prepared successfully.',
    es: 'Esta versión exacta de la crema se ha preparado con éxito.',
    uk: 'Цей точний варіант крему успішно готували.',
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
      uk: ['Ванільний заварний крем без яєць'],
      en: ['Eggless vanilla custard'],
      es: ['Crema de vainilla sin huevo'],
    },
  },
  discovery: {
    cardTitle: {
      en: 'Eggless vanilla custard',
      es: 'Crema de vainilla sin huevo',
      uk: 'Ванільний заварний крем без яєць',
    },
    category: {
      en: 'Cream',
      es: 'Crema',
      uk: 'Крем',
    },
    flourSummary: {
      en: 'Schär Mix B Bread',
      es: 'Schär Mix B Bread',
      uk: 'Schär Mix B Bread',
    },
    collectionIds: [],
    catalogue: false,
    imageKind: 'generated-preview',
    sourceTitle: 'Ванільний заварний крем без яєць',
    launchPriority: 'Linked recipe',
    heroCandidate: 'Yes',
    source: 'User-provided reference · eggless pastry cream',
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
      title: 'Ванільний заварний крем без яєць',
      description:
        'Ванільний заварний крем без яєць у великій порції. Пропорції, приготування та охолодження крему, який додатково густішає.',
    },
    en: {
      title: 'Eggless vanilla custard',
      description:
        'A large batch of eggless vanilla custard that thickens further as it cools. Ingredient quantities and step-by-step cooking instructions.',
    },
    es: {
      title: 'Crema de vainilla sin huevo',
      description:
        'Crema de vainilla sin huevo en una tanda abundante. Cantidades, cocción y enfriado de una crema que espesa al reposar.',
    },
  },
  creamOption: {
    en: {
      title: 'Eggless vanilla custard',
      description:
        'A soft homemade cream for filling a large batch of pastries; it thickens as it cools.',
    },
    es: {
      title: 'Crema de vainilla sin huevo',
      description:
        'Una crema casera suave para rellenar una tanda grande de pasteles; espesa al enfriarse.',
    },
    uk: {
      title: 'Ванільний заварний крем без яєць',
      description:
        'М’який домашній крем для великої партії тістечок; під час охолодження він стає густішим.',
    },
  },
  routeSlug: 'eggless-vanilla-custard',
} satisfies Recipe;

export const vanillaButtercreamRecipe = {
  schemaVersion: 3,
  id: 'vanilla-buttercream',
  versionId: 'vanilla-buttercream-source-v1',
  publicationStatus: 'published',
  translationState: {
    uk: 'reviewed',
    en: 'reviewed',
    es: 'reviewed',
  },
  slug: {
    en: 'vanilla-buttercream',
    es: 'vanilla-buttercream',
    uk: 'vanilla-buttercream',
  },
  title: {
    en: 'Vanilla buttercream',
    es: 'Crema de mantequilla de vainilla',
    uk: 'Ванільний масляний крем',
  },
  summary: {
    en: 'A rich stable cream for filling and decorating cakes and pastries.',
    es: 'Una crema rica y estable para rellenar y decorar tartas y pasteles.',
    uk: 'Насичений стійкий крем для начинки й оздоблення тортів та тістечок.',
  },
  categoryIds: [],
  situationIds: [],
  difficulty: 'medium',
  baseProvenance: {
    state: 'tested',
    sourceIds: ['vanilla-buttercream-recorded-source'],
  },
  timing: {
    activeMinutes: 25,
    totalElapsedMinutes: 75,
    planningNote: null,
    phases: [
      {
        id: 'cool-buttercream-base',
        label: {
          en: 'Cool the cooked base',
          es: 'Enfriar la base cocida',
          uk: 'Охолодження завареної основи',
        },
        duration: {
          kind: 'exact',
          value: 45,
          unit: 'minute',
        },
        relatedStepId: 'cool-base',
      },
    ],
  },
  yield: {
    default: {
      id: 'about-450-g-buttercream',
      label: {
        en: 'About 450 g cream',
        es: 'Unos 450 g de crema',
        uk: 'Близько 450 г крему',
      },
      count: {
        kind: 'exact',
        value: 450,
      },
      unit: 'g',
      provenance: {
        state: 'tested',
        sourceIds: ['vanilla-buttercream-recorded-source'],
      },
      availability: 'default',
      approximate: true,
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
      geometryId: 'vanilla-buttercream-base',
      yieldId: 'about-450-g-buttercream',
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
      id: 'bowl',
      name: {
        en: 'bowl',
        es: 'bol',
        uk: 'миска',
      },
    },
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
  beforeStart: [
    {
      id: 'before-0',
      text: {
        en: 'Let the butter soften while the cooked base cools; combine them only when they are at a similar room temperature.',
        es: 'Deja que la mantequilla se ablande mientras se enfría la base; mézclalas solo cuando estén a una temperatura ambiente parecida.',
        uk: 'Розм’якшуйте масло, поки охолоджується заварена основа; поєднуйте їх лише за приблизно однакової кімнатної температури.',
      },
    },
  ],
  ingredientSections: [
    {
      id: 'buttercream',
      title: {
        en: 'Buttercream',
        es: 'Crema de mantequilla',
        uk: 'Масляний крем',
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
            en: '82% fat or higher; softened but not melted.',
            es: 'Con un 82 % de grasa o más; blanda pero no derretida.',
            uk: 'Жирністю від 82%; м’яке, але не розтоплене.',
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
              value: 70,
              unit: 'g',
            },
            equivalent: {
              kind: 'exact',
              value: 3.5,
              unit: 'tbsp',
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
          id: 'vanilla-sugar',
          options: [
            {
              ingredientId: 'vanilla-sugar',
              name: {
                en: 'Vanilla sugar',
                es: 'Azúcar vainillado',
                uk: 'Ванільний цукор',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 10,
              unit: 'g',
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
              value: 100,
              unit: 'ml',
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
      id: 'cook-base',
      title: {
        en: 'Cook the egg and milk base',
        es: 'Cuece la base de huevo y leche',
        uk: 'Заваріть яєчно-молочну основу',
      },
      instruction: {
        en: 'Whisk the milk, eggs, sugar and vanilla sugar in a saucepan. Heat while whisking constantly. Once it begins to bubble, reduce the heat and cook until thickened.',
        es: 'Bate en un cazo la leche, los huevos, el azúcar y el azúcar vainillado. Calienta sin dejar de batir. Cuando empiece a burbujear, baja el fuego y cuece hasta que espese.',
        uk: 'Змішайте в сотейнику молоко, яйця, звичайний і ванільний цукор. Нагрівайте, постійно працюючи вінчиком. Коли маса почне булькати, зменште вогонь і варіть до загустіння.',
      },
      ingredientLineIds: ['milk', 'eggs', 'sugar', 'vanilla-sugar'],
      guidance: [
        {
          id: 'cook-base-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The base is smooth and thick enough to leave a brief trail behind the whisk.',
            es: 'La base está lisa y lo bastante espesa para dejar brevemente la marca de las varillas.',
            uk: 'Основа гладка й достатньо густа, щоб слід від вінчика ненадовго залишався видимим.',
          },
        },
        {
          id: 'cook-base-tip',
          kind: 'practicalTip',
          text: {
            en: 'Keep the whisk moving over the bottom and into the corners so the eggs do not set in pieces.',
            es: 'Mueve las varillas por el fondo y las esquinas para que el huevo no se cuaje en trozos.',
            uk: 'Проводьте вінчиком по дну та кутах, щоб яйця не схопилися окремими шматочками.',
          },
        },
      ],
      cook: {
        ingredients: [
          {
            ingredientId: 'milk',
          },
          {
            ingredientId: 'eggs',
          },
          {
            ingredientId: 'sugar',
          },
          {
            ingredientId: 'vanilla-sugar',
          },
        ],
      },
      equipmentIds: ['whisk', 'saucepan'],
    },
    {
      id: 'cool-base',
      title: {
        en: 'Cool the base',
        es: 'Enfría la base',
        uk: 'Охолодіть основу',
      },
      instruction: {
        en: 'Transfer the cooked base to a clean bowl, cover the surface directly and cool it completely to room temperature.',
        es: 'Pasa la base cocida a un bol limpio, cubre la superficie directamente y deja que se enfríe por completo hasta la temperatura ambiente.',
        uk: 'Перекладіть заварену основу в чисту миску, накрийте поверхню в контакт і повністю охолодіть до кімнатної температури.',
      },
      ingredientLineIds: [],
      guidance: [
        {
          id: 'cool-base-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The base is thick and no warmer than the softened butter.',
            es: 'La base está espesa y no está más caliente que la mantequilla blanda.',
            uk: 'Основа густа й не тепліша за розм’якшене масло.',
          },
        },
      ],
      equipmentIds: ['bowl'],
      durationPhaseId: 'cool-buttercream-base',
    },
    {
      id: 'whip-butter',
      title: {
        en: 'Whip the butter',
        es: 'Bate la mantequilla',
        uk: 'Збийте масло',
      },
      instruction: {
        en: 'Whip the softened butter until it becomes pale, smooth and noticeably more aerated.',
        es: 'Bate la mantequilla blanda hasta que esté más pálida, lisa y claramente aireada.',
        uk: 'Збивайте м’яке масло, доки воно не посвітлішає, не стане гладким і помітно пишнішим.',
      },
      ingredientLineIds: ['butter'],
      technique: {
        id: 'soften-butter',
      },
      guidance: [
        {
          id: 'whip-butter-tip',
          kind: 'practicalTip',
          text: {
            en: 'Scrape down the bowl once or twice so all the butter aerates evenly.',
            es: 'Raspa el bol una o dos veces para que toda la mantequilla se airee por igual.',
            uk: 'Один-два рази зберіть масло зі стінок миски, щоб воно збивалося рівномірно.',
          },
        },
      ],
      cook: {
        ingredients: [
          {
            ingredientId: 'butter',
          },
        ],
      },
    },
    {
      id: 'combine',
      title: {
        en: 'Add the cooked base gradually',
        es: 'Añade gradualmente la base cocida',
        uk: 'Поступово додайте заварену основу',
      },
      instruction: {
        en: 'With the mixer running, add the cooled base to the butter one spoonful at a time. Continue whipping until the cream is thick, smooth and glossy.',
        es: 'Con la batidora en marcha, añade la base fría a la mantequilla una cucharada cada vez. Sigue batiendo hasta que la crema esté espesa, lisa y brillante.',
        uk: 'Не припиняючи збивати, додавайте охолоджену основу до масла по одній ложці. Збивайте, доки крем не стане густим, гладким і блискучим.',
      },
      ingredientLineIds: [],
      guidance: [
        {
          id: 'combine-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The cream is uniform and glossy and holds a clear ridge from the whisk.',
            es: 'La crema está uniforme y brillante y conserva un surco claro de las varillas.',
            uk: 'Крем однорідний і блискучий та тримає чіткий слід від вінчика.',
          },
        },
      ],
      mediaIds: ['vanilla-buttercream-final-v1'],
      equipmentIds: ['mixer'],
    },
  ],
  storage: null,
  makeAhead: null,
  variations: [],
  heroMediaId: 'vanilla-buttercream-hero',
  media: [
    {
      id: 'vanilla-buttercream-hero',
      type: 'image',
      path: '/images/recipes/vanilla-buttercream-card-v1.webp',
      usage: ['hero'],
      alt: {
        en: 'Stable pale vanilla buttercream holding a firm spatula swoop in a ceramic bowl',
        es: 'Crema de mantequilla de vainilla pálida y estable con un pico firme de espátula en un bol de cerámica',
        uk: 'Стійкий світлий ванільний масляний крем тримає виразний пік від лопатки в керамічній мисці',
      },
    },
    {
      id: 'vanilla-buttercream-final-v1',
      type: 'image',
      path: '/media/recipes/vanilla-buttercream/selected/final-buttercream-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Pale vanilla buttercream holding a firm smooth peak on raised beaters',
        es: 'Crema de mantequilla de vainilla pálida que mantiene un pico firme y liso en las varillas',
        uk: 'Світлий ванільний масляний крем тримає гладкий стійкий пік на вінчиках',
      },
    },
  ],
  relatedRecipeIds: [],
  sources: [
    {
      id: 'vanilla-buttercream-recorded-source',
      file: 'User-confirmed cream set, 2026-09-20',
      locator: 'Vanilla buttercream based on the Charlotte method',
    },
  ],
  contentGaps: [],
  presentation: 'concise',
  evidenceExplanation: {
    en: 'This exact cream has been prepared successfully.',
    es: 'Esta versión exacta de la crema se ha preparado con éxito.',
    uk: 'Цей точний варіант крему успішно готували.',
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
      uk: ['Ванільний масляний крем'],
      en: ['Vanilla buttercream'],
      es: ['Crema de mantequilla de vainilla'],
    },
  },
  discovery: {
    cardTitle: {
      en: 'Vanilla buttercream',
      es: 'Crema de mantequilla de vainilla',
      uk: 'Ванільний масляний крем',
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
    sourceTitle: 'Ванільний масляний крем',
    launchPriority: 'Linked recipe',
    heroCandidate: 'Yes',
    source: 'User-provided reference · cooked-base buttercream',
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
      title: 'Ванільний масляний крем',
      description:
        'Ванільний масляний крем для начинки й оздоблення тортів та тістечок. Пропорції та кроки приготування стійкого крему.',
    },
    en: {
      title: 'Vanilla buttercream',
      description:
        'Vanilla buttercream for filling and decorating cakes and pastries. Ingredient quantities and step-by-step instructions for a stable cream.',
    },
    es: {
      title: 'Crema de mantequilla de vainilla',
      description:
        'Crema de mantequilla de vainilla para rellenar y decorar tartas y pasteles. Cantidades y preparación paso a paso de una crema estable.',
    },
  },
  creamOption: {
    en: {
      title: 'Vanilla buttercream',
      description:
        'A rich, stable cream for filling and decorating cakes and pastries.',
    },
    es: {
      title: 'Crema de mantequilla y vainilla',
      description:
        'Una crema rica y estable para rellenar y decorar tartas y pasteles.',
    },
    uk: {
      title: 'Ванільний масляний крем',
      description:
        'Насичений стійкий крем для наповнення й оздоблення тортів та тістечок.',
    },
  },
  routeSlug: 'vanilla-buttercream',
} satisfies Recipe;

export const reusableCreamRecipes = [
  mascarponeWhippedCreamRecipe,
  vanillaEggCustardRecipe,
  egglessVanillaCustardRecipe,
  vanillaButtercreamRecipe,
];
