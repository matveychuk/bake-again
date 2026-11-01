import type { Recipe } from './recipe.types.ts';

export const appleMeringuePieRecipe = {
  schemaVersion: 3,
  id: 'apple-meringue-pie',
  versionId: 'apple-meringue-pie-source-v1',
  publicationStatus: 'unpublished',
  translationState: {
    uk: 'reviewed',
    en: 'reviewed',
    es: 'reviewed',
  },
  slug: {
    en: 'apple-meringue-pie',
    es: 'apple-meringue-pie',
    uk: 'apple-meringue-pie',
  },
  title: {
    en: 'Gluten-free apple meringue pie',
    es: 'Tarta de manzana y merengue sin gluten',
    uk: 'Безглютеновий яблучний пиріг із меренгою',
  },
  summary: {
    en: 'A chilled gluten-free pastry base topped with grated apples and soft meringue.',
    es: 'Una base de masa sin gluten refrigerada con manzana rallada y merengue suave.',
    uk: 'Охолоджена безглютенова основа з тертими яблуками та ніжною меренгою.',
  },
  categoryIds: [],
  situationIds: [],
  difficulty: null,
  baseProvenance: {
    state: 'suggested',
    sourceIds: ['apple-meringue-pie-recorded-source'],
  },
  timing: {
    activeMinutes: null,
    totalElapsedMinutes: null,
    planningNote: {
      text: {
        en: 'Plan for {duration} of chilling before assembly.',
        es: 'Reserva {duration} para enfriar la masa antes de montar la tarta.',
        uk: 'Закладіть {duration} на охолодження тіста перед складанням.',
      },
      phaseId: 'chill',
    },
    phases: [
      {
        id: 'chill',
        label: {
          en: 'Chill the dough',
          es: 'Enfriado de la masa',
          uk: 'Охолодження тіста',
        },
        duration: {
          kind: 'range',
          min: 1,
          max: 2,
          unit: 'hour',
        },
        relatedStepId: 'chill-dough',
      },
      {
        id: 'bake',
        label: {
          en: 'Bake',
          es: 'Horneado',
          uk: 'Випікання',
        },
        duration: {
          kind: 'exact',
          value: 40,
          unit: 'minute',
        },
        relatedStepId: 'bake',
      },
    ],
  },
  yield: {
    default: {
      id: 'apple-meringue-pie-yield',
      label: {
        en: '',
        es: '',
        uk: '',
      },
      count: {
        kind: 'unknown',
      },
      unit: null,
      provenance: {
        state: 'missing',
        sourceIds: ['apple-meringue-pie-recorded-source'],
      },
      availability: 'default',
    },
    alternatives: [],
  },
  geometry: {
    state: 'unknown',
    default: null,
    alternatives: [],
  },
  configuration: {
    base: {
      geometryId: 'apple-meringue-pie-base',
      yieldId: 'apple-meringue-pie-yield',
      batchScale: 1,
    },
    geometryAdjustment: null,
    quantityAdjustment: {
      batchScale: {
        allowed: [0.5, 1, 1.5, 2],
      },
      useWhatIHave: null,
    },
    ingredientScaling: {
      default: {
        kind: 'linear',
      },
    },
  },
  equipment: [],
  flourConfiguration: {
    commercialMixLineId: 'gluten-free-mix',
    additionalStarchLineIds: [],
    provenance: {
      state: 'suggested',
      sourceIds: ['apple-meringue-pie-recorded-source'],
    },
    testedAlternativeMixes: [],
    knownUnsupportedMixes: [],
    basis: 'commercialMix',
  },
  beforeStart: [
    {
      id: 'before-0',
      text: {
        en: 'Keep the butter cold; the source says this helps the pastry stay crumbly.',
        es: 'Mantén la mantequilla fría: según la receta de origen, ayuda a conseguir una masa quebradiza.',
        uk: 'Тримайте масло холодним: за порадою джерела це допомагає отримати розсипчасте тісто.',
      },
    },
    {
      id: 'before-1',
      text: {
        en: 'The source does not give the apple amount, baking-powder amount, pan size or sugar amount for the meringue. Record them during the first bake.',
        es: 'La fuente no indica la cantidad de manzana, levadura química o azúcar para el merengue, ni el tamaño del molde. Anótalos en la primera prueba.',
        uk: 'У джерелі немає кількості яблук і розпушувача, розміру форми та кількості цукру для меренги. Запишіть їх під час першої випічки.',
      },
    },
  ],
  ingredientSections: [
    {
      id: 'pastry',
      title: {
        en: 'Pastry',
        es: 'Masa',
        uk: 'Тісто',
      },
      lines: [
        {
          id: 'egg',
          options: [
            {
              ingredientId: 'egg',
              name: {
                en: 'Egg',
                es: 'Huevo',
                uk: 'Яйце',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 1,
              unit: 'piece',
            },
            shopping: {
              mode: 'base',
              increment: 1,
              rounding: 'up',
            },
          },
          qualifier: {
            en: 'Separate it: use the yolk in the pastry and reserve the white for the topping.',
            es: 'Separa la yema para la masa y reserva la clara para la cobertura.',
            uk: 'Відокремте: жовток використайте в тісті, білок залиште для верхнього шару.',
          },
        },
        {
          id: 'cold-water',
          options: [
            {
              ingredientId: 'cold-water',
              name: {
                en: 'Cold water',
                es: 'Agua fría',
                uk: 'Холодна вода',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 30,
              unit: 'ml',
            },
            shopping: {
              mode: 'base',
              defaultSelected: false,
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
          id: 'butter',
          options: [
            {
              ingredientId: 'butter',
              name: {
                en: 'Cold butter',
                es: 'Mantequilla fría',
                uk: 'Холодне вершкове масло',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 60,
              unit: 'g',
            },
            shopping: {
              mode: 'base',
            },
          },
        },
        {
          id: 'gluten-free-mix',
          options: [
            {
              ingredientId: 'gluten-free-mix',
              name: {
                en: 'GFM Universal gluten-free baking mix',
                es: 'Mezcla sin gluten GFM «Universal»',
                uk: 'Безглютенова суміш GFM «Універсальна»',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 170,
              unit: 'g',
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
            base: null,
            shopping: {
              mode: 'nameOnly',
            },
          },
          qualifier: {
            en: 'Amount not stated in the source.',
            es: 'La fuente no indica la cantidad.',
            uk: 'Кількість у джерелі не вказана.',
          },
        },
      ],
    },
    {
      id: 'filling-and-topping',
      title: {
        en: 'Apple filling and meringue topping',
        es: 'Relleno de manzana y merengue',
        uk: 'Яблучна начинка та меренга',
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
            base: null,
            shopping: {
              mode: 'nameOnly',
            },
          },
          qualifier: {
            en: 'Peel and grate. Amount and variety are not stated in the source.',
            es: 'Pela y ralla. La fuente no indica la cantidad ni la variedad.',
            uk: 'Очистьте й натріть. Кількість і сорт у джерелі не вказані.',
          },
        },
      ],
    },
  ],
  steps: [
    {
      id: 'rub-base',
      title: {
        en: 'Rub the butter, yolk and sugar together',
        es: 'Mezcla la mantequilla, la yema y el azúcar',
        uk: 'Розітріть масло, жовток і цукор',
      },
      instruction: {
        en: 'Separate the egg and reserve the white. Rub the cold butter with the yolk and 60 g sugar.',
        es: 'Separa el huevo y reserva la clara. Mezcla la mantequilla fría con la yema y 60 g de azúcar.',
        uk: 'Відокремте білок від жовтка й залиште білок. Розітріть холодне масло з жовтком і 60 г цукру.',
      },
      ingredientLineIds: ['egg', 'butter', 'sugar'],
      guidance: [
        {
          id: 'rub-base-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The butter is evenly dispersed and there are no large hard pieces left.',
            es: 'La mantequilla queda bien repartida, sin trozos grandes y duros.',
            uk: 'Масло рівномірно розподілене, великих твердих шматочків не залишилося.',
          },
        },
        {
          id: 'rub-base-tip',
          kind: 'practicalTip',
          text: {
            en: 'Work briefly so the butter stays cold.',
            es: 'Trabaja con rapidez para mantener la mantequilla fría.',
            uk: 'Працюйте швидко, щоб масло залишалося холодним.',
          },
        },
      ],
      cook: {
        ingredients: [
          {
            ingredientId: 'egg',
          },
          {
            ingredientId: 'butter',
          },
          {
            ingredientId: 'sugar',
          },
        ],
      },
    },
    {
      id: 'mix-dough',
      title: {
        en: 'Mix the dough',
        es: 'Prepara la masa',
        uk: 'Замісіть тісто',
      },
      instruction: {
        en: 'Add the cold water, baking powder and gluten-free mix. Bring everything together into a soft dough.',
        es: 'Añade el agua fría, la levadura química y la mezcla sin gluten. Une los ingredientes hasta formar una masa blanda.',
        uk: 'Додайте холодну воду, розпушувач і безглютенову суміш. Зберіть усе в м’яке тісто.',
      },
      ingredientLineIds: ['cold-water', 'baking-powder', 'gluten-free-mix'],
      guidance: [
        {
          id: 'mix-dough-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The dough is soft and no longer sticks to your hands.',
            es: 'La masa queda blanda y deja de pegarse a las manos.',
            uk: 'Тісто м’яке й більше не липне до рук.',
          },
        },
        {
          id: 'mix-dough-tip',
          kind: 'practicalTip',
          text: {
            en: 'Stop mixing as soon as the dough holds together; do not add extra mix unless the first bake shows it is necessary.',
            es: 'Deja de mezclar en cuanto la masa se una. No añadas más harina sin comprobar antes en una prueba de horneado si hace falta.',
            uk: 'Зупиніться, щойно тісто збереться докупи; не додавайте суміш навмання, доки перша випічка не покаже, що це потрібно.',
          },
        },
      ],
      cook: {
        ingredients: [
          {
            ingredientId: 'cold-water',
          },
          {
            ingredientId: 'baking-powder',
          },
          {
            ingredientId: 'gluten-free-mix',
          },
        ],
      },
    },
    {
      id: 'chill-dough',
      title: {
        en: 'Chill the dough',
        es: 'Enfría la masa',
        uk: 'Охолодіть тісто',
      },
      instruction: {
        en: 'Refrigerate the dough for 1–2 hours.',
        es: 'Deja la masa en la nevera durante 1–2 horas.',
        uk: 'Поставте тісто в холодильник на 1–2 години.',
      },
      ingredientLineIds: [],
      guidance: [
        {
          id: 'chill-dough-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The dough feels cold and firm enough to press into the pan.',
            es: 'La masa está fría y tiene suficiente firmeza para repartirla en el molde.',
            uk: 'Тісто холодне й достатньо пружне, щоб розподілити його у формі.',
          },
        },
      ],
      displayMeta: {
        en: '1–2 h · refrigerator',
        es: '1–2 h · nevera',
        uk: '1–2 год · холодильник',
      },
      durationPhaseId: 'chill',
    },
    {
      id: 'prepare-apples',
      title: {
        en: 'Prepare the apples',
        es: 'Prepara las manzanas',
        uk: 'Підготуйте яблука',
      },
      instruction: {
        en: 'Peel and grate the apples while the dough chills.',
        es: 'Mientras se enfría la masa, pela y ralla las manzanas.',
        uk: 'Поки тісто охолоджується, очистьте та натріть яблука.',
      },
      ingredientLineIds: ['apples'],
      guidance: [
        {
          id: 'prepare-apples-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The apples are evenly grated with no peel remaining.',
            es: 'La manzana está rallada de manera uniforme y no quedan restos de piel.',
            uk: 'Яблука натерті рівномірно, шкірки не залишилося.',
          },
        },
        {
          id: 'prepare-apples-tip',
          kind: 'practicalTip',
          text: {
            en: 'The source suggests adding a pinch of cinnamon for a warmer apple flavour.',
            es: 'La receta de origen sugiere añadir una pizca de canela a la manzana.',
            uk: 'Джерело радить додати до яблук дрібку кориці для теплого аромату.',
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
    },
    {
      id: 'line-pan',
      title: {
        en: 'Line the pan with dough',
        es: 'Forra el molde con la masa',
        uk: 'Вистеліть форму тістом',
      },
      instruction: {
        en: 'Press the chilled dough across the bottom and up the sides of the pan.',
        es: 'Reparte la masa fría por la base y las paredes del molde.',
        uk: 'Розподіліть охолоджене тісто по дну та бортиках форми.',
      },
      ingredientLineIds: [],
      guidance: [
        {
          id: 'line-pan-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The base has an even thickness, with no visible gaps.',
            es: 'La base tiene un grosor uniforme y no quedan huecos.',
            uk: 'Основа має рівномірну товщину й не має видимих прогалин.',
          },
        },
        {
          id: 'line-pan-tip',
          kind: 'practicalTip',
          text: {
            en: 'Record the pan shape and dimensions during the first bake.',
            es: 'Anota el tipo y las medidas del molde en la primera prueba.',
            uk: 'Під час першої випічки запишіть форму та її розміри.',
          },
        },
      ],
    },
    {
      id: 'assemble',
      title: {
        en: 'Add the apples and meringue',
        es: 'Añade la manzana y el merengue',
        uk: 'Додайте яблука та меренгу',
      },
      instruction: {
        en: 'Spread the grated apples over the pastry. Whip the reserved egg white to a soft meringue and spread it over the apples.',
        es: 'Reparte la manzana rallada sobre la masa. Monta la clara reservada hasta obtener un merengue suave y extiéndelo sobre la manzana.',
        uk: 'Рівномірно викладіть натерті яблука на тісто. Збийте відкладений білок у ніжну меренгу й розподіліть її поверх яблук.',
      },
      ingredientLineIds: ['apples', 'egg'],
      guidance: [
        {
          id: 'assemble-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The apple layer is even and the whipped white holds soft peaks before it is spread.',
            es: 'La capa de manzana es uniforme y la clara forma picos suaves antes de extenderla.',
            uk: 'Шар яблук рівний, а збитий білок тримає м’які піки перед викладанням.',
          },
        },
        {
          id: 'assemble-tip',
          kind: 'practicalTip',
          text: {
            en: 'The source does not state how much sugar, if any, goes into the meringue; record the exact amount used.',
            es: 'La fuente no aclara si se añade azúcar al merengue ni en qué cantidad. Anota la cantidad utilizada.',
            uk: 'Джерело не уточнює, скільки цукру додають у меренгу і чи додають його взагалі; запишіть точну кількість.',
          },
        },
      ],
      cook: {
        ingredients: [
          {
            ingredientId: 'apples',
            quantity: 'omit',
          },
          {
            ingredientId: 'egg',
            quantity: 'omit',
            note: {
              en: 'Use the reserved white.',
              es: 'Usa la clara reservada.',
              uk: 'Використайте відкладений білок.',
            },
          },
        ],
      },
    },
    {
      id: 'bake',
      title: {
        en: 'Bake the pie',
        es: 'Hornea la tarta',
        uk: 'Спечіть пиріг',
      },
      instruction: {
        en: 'Bake at 180°C for 40 minutes.',
        es: 'Hornea a 180°C durante 40 minutos.',
        uk: 'Випікайте 40 хвилин за 180°C.',
      },
      ingredientLineIds: [],
      guidance: [
        {
          id: 'bake-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'At the first bake, record the colour of the pastry edge, the set of the apple layer and how quickly the meringue browns.',
            es: 'En la primera prueba, anota el color del borde de la masa, cómo queda la manzana y la rapidez con la que se dora el merengue.',
            uk: 'Під час першої випічки запишіть колір краю тіста, стан яблучного шару та швидкість підрум’янення меренги.',
          },
        },
        {
          id: 'bake-tip',
          kind: 'practicalTip',
          text: {
            en: 'Treat 40 minutes as the source timing until the exact pan and oven behaviour have been tested.',
            es: 'Los 40 minutos son el tiempo indicado en la fuente; habrá que comprobarlo con el molde y el horno utilizados.',
            uk: 'Сприймайте 40 хвилин як час із джерела, доки не перевірите точну форму й поведінку своєї духовки.',
          },
        },
      ],
      displayMeta: {
        en: '180°C · 40 min',
        es: '180°C · 40 min',
        uk: '180°C · 40 хв',
      },
      temperature: {
        value: 180,
        unit: 'C',
        ovenMode: null,
      },
      durationPhaseId: 'bake',
    },
  ],
  storage: null,
  makeAhead: null,
  variations: [],
  heroMediaId: 'apple-meringue-pie-hero',
  media: [
    {
      id: 'apple-meringue-pie-hero',
      type: 'image',
      path: '/images/recipes/apple-meringue-pie-card-v1.webp',
      usage: ['hero'],
      alt: {
        en: 'A gluten-free apple pie with a short pastry base and toasted meringue topping',
        es: 'Una tarta de manzana sin gluten con base de masa corta y merengue tostado',
        uk: 'Безглютеновий яблучний пиріг із пісочною основою та підрум’яненою меренгою',
      },
    },
  ],
  relatedRecipeIds: [],
  sources: [
    {
      id: 'apple-meringue-pie-recorded-source',
      file: 'https://foodgfm.com/%d0%b1%d0%b5%d0%b7%d0%b3%d0%bb%d1%8e%d1%82%d0%b5%d0%bd%d0%be%d0%b2%d0%b8%d0%b9-%d1%8f%d0%b1%d0%bb%d1%83%d1%87%d0%bd%d0%b8%d0%b9-%d0%bf%d0%b8%d1%80%d1%96%d0%b3/',
      locator:
        'Безглютеновий яблучний пиріг: простий рецепт осінньої випічки · Food GFM · 10.09.2025',
    },
  ],
  contentGaps: [
    {
      id: 'apple-meringue-pie-source-gap',
      area: 'method',
      field: 'steps',
      question:
        'Before publication, bake-test the exact recipe and record the apple quantity and variety, baking-powder amount, pan dimensions, meringue sugar amount, oven mode, active time and finished yield.',
      text: {
        en: 'Before publication, bake-test the exact recipe and record the apple quantity and variety, baking-powder amount, pan dimensions, meringue sugar amount, oven mode, active time and finished yield.',
        es: 'Antes de publicar, prueba esta versión y registra la cantidad y variedad de manzana, la cantidad de levadura química y azúcar para el merengue, las medidas del molde, el modo del horno, el tiempo activo y el rendimiento.',
        uk: 'Перед публікацією випробуйте точну версію та запишіть кількість і сорт яблук, кількість розпушувача, розміри форми, кількість цукру для меренги, режим духовки, активний час і готовий вихід.',
      },
      publicationBlocking: true,
      sourceIds: ['apple-meringue-pie-recorded-source'],
      readerVisible: true,
    },
    {
      id: 'apple-meringue-pie-yield-gap',
      area: 'yield',
      field: 'yield.default',
      question: 'Yield is not recorded.',
      text: {
        en: 'Yield is not recorded.',
        es: 'El rendimiento no está registrado.',
        uk: 'Вихід не записано.',
      },
      publicationBlocking: false,
      sourceIds: ['apple-meringue-pie-recorded-source'],
    },
    {
      id: 'apple-meringue-pie-geometry-gap',
      area: 'form',
      field: 'geometry.default',
      question: 'Geometry is not recorded.',
      text: {
        en: 'Geometry is not recorded.',
        es: 'El molde no está registrado.',
        uk: 'Форму не записано.',
      },
      publicationBlocking: false,
      sourceIds: ['apple-meringue-pie-recorded-source'],
    },
  ],
  evidenceExplanation: {
    en: 'This is a structured draft from the linked source and has not been bake-tested by Bake Again.',
    es: 'Borrador basado en la fuente indicada. Esta versión aún no se ha probado en Bake Again.',
    uk: 'Це структурована чернетка за вказаним джерелом; Bake Again ще не випікав цю точну версію.',
  },
  searchMetadata: {
    datePublished: null,
    dateModified: '2026-09-27',
    cookTimeMinutes: 40,
    recipeCuisine: {
      uk: null,
      en: null,
      es: null,
    },
    keywords: {
      uk: ['Безглютеновий яблучний пиріг із меренгою'],
      en: ['Gluten-free apple meringue pie'],
      es: ['Tarta de manzana y merengue sin gluten'],
    },
  },
  discovery: {
    cardTitle: {
      en: 'Apple meringue pie',
      es: 'Tarta de manzana y merengue',
      uk: 'Яблучний пиріг із меренгою',
    },
    category: {
      en: 'Apple pie / dessert',
      es: 'Tarta de manzana / postre',
      uk: 'Яблучний пиріг / десерт',
    },
    flourSummary: {
      en: 'GFM Universal gluten-free baking mix',
      es: 'Mezcla universal sin gluten GFM',
      uk: 'Безглютенова суміш GFM «Універсальна»',
    },
    collectionIds: ['everyday'],
    catalogue: true,
    imageKind: 'generated-preview',
    publicationNote: {
      en: 'Bake-test the exact recipe and record the missing apple, baking-powder, pan and meringue details.',
      es: 'Prueba la receta exacta y registra los datos que faltan sobre manzana, impulsor, molde y merengue.',
      uk: 'Випробуйте точну версію та запишіть відсутні дані про яблука, розпушувач, форму й меренгу.',
    },
    sourceTitle: 'Безглютеновий яблучний пиріг',
    launchPriority: 'Medium',
    heroCandidate: 'No',
    source:
      'Food GFM web recipe, “Безглютеновий яблучний пиріг: простий рецепт осінньої випічки”, 10.09.2025',
    archiveSections: [
      {
        title: 'Ingredients · source transcription',
        content:
          'Для тіста: 1 яйце (жовток — у тісто, білок — для меренги); 30 мл холодної води; 60 г цукру; 60 г масла; 170 г безглютенової суміші «Універсальна»; розпушувач.\n\nНачинка: яблука, очищені та натерті; білок, збитий у ніжну меренгу.',
      },
      {
        title: 'Method · source transcription',
        content:
          '1. Масло розтерти з жовтком і цукром.\n2. Додати воду, розпушувач і борошняну суміш.\n3. Замісити м’яке тісто, щоб не липло до рук.\n4. Поставити у холодильник на 1–2 години.\n5. Форму застелити тістом, викласти яблука, зверху прикрасити меренгою.\n6. Випікати 40 хв при 180°C.',
      },
    ],
    needsBeforePublishing:
      'Bake-test the exact recipe; record the apple quantity and variety, baking-powder amount, pan dimensions, meringue sugar amount, oven mode, active time and finished yield; replace or approve the generated preview.',
  },
  translationReview: {
    date: '2026-11-01',
    reviewer: 'implementation',
    scope:
      'ID-aligned transfer and semantic comparison of existing UK/EN/ES recipe text; not separate author approval',
  },
  routeSlug: 'apple-meringue-pie',
} satisfies Recipe;
