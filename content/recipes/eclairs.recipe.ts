import type { Recipe } from './recipe.types.ts';

export const eclairsRecipe = {
  schemaVersion: 3,
  id: 'eclairs',
  versionId: 'eclairs-source-v1',
  publicationStatus: 'published',
  translationState: {
    uk: 'reviewed',
    en: 'reviewed',
    es: 'reviewed',
  },
  slug: {
    en: 'eclairs',
    es: 'eclairs',
    uk: 'eclairs',
  },
  title: {
    en: 'Gluten-free profiteroles',
    es: 'Profiteroles sin gluten',
    uk: 'Безглютенові профітролі',
  },
  summary: {
    en: 'Crisp, hollow choux pastries with a soft cream filling.',
    es: 'Bocaditos de pasta choux huecos y crujientes con un relleno cremoso.',
    uk: 'Порожнисті заварні тістечка з тонкою золотистою оболонкою й ніжною начинкою.',
  },
  categoryIds: [],
  situationIds: [],
  difficulty: 'medium',
  baseProvenance: {
    state: 'tested',
    sourceIds: ['eclairs-recorded-source'],
  },
  timing: {
    activeMinutes: 15,
    totalElapsedMinutes: null,
    planningNote: null,
    phases: [
      {
        id: 'hot-bake',
        label: {
          en: 'Initial bake at 200°C',
          es: 'Horneado inicial a 200°C',
          uk: 'Початкове випікання за 200°C',
        },
        duration: {
          kind: 'exact',
          value: 10,
          unit: 'minute',
        },
        relatedStepId: 'bake',
      },
      {
        id: 'lower-bake',
        label: {
          en: 'Bake at 180°C',
          es: 'Horneado a 180°C',
          uk: 'Випікання за 180°C',
        },
        duration: {
          kind: 'exact',
          value: 15,
          unit: 'minute',
        },
        relatedStepId: 'bake',
      },
    ],
  },
  yield: {
    default: {
      id: 'twenty-profiteroles',
      label: {
        en: 'About 20 profiteroles',
        es: 'Unos 20 profiteroles',
        uk: 'Близько 20 профітролів',
      },
      count: {
        kind: 'exact',
        value: 20,
      },
      unit: 'batch',
      provenance: {
        state: 'tested',
        sourceIds: ['eclairs-recorded-source'],
      },
      availability: 'default',
    },
    alternatives: [],
  },
  geometry: {
    state: 'known',
    default: {
      id: 'walnut-size-profiteroles',
      label: {
        en: 'Walnut-size profiteroles',
        es: 'Profiteroles del tamaño de una nuez',
        uk: 'Профітролі розміром із волоський горіх',
      },
      kind: 'tray',
      application: 'portion-on',
      shape: 'other',
      diameterCm: null,
      layerCount: null,
      material: null,
      provenance: {
        state: 'tested',
        sourceIds: ['eclairs-recorded-source'],
      },
      availability: 'default',
    },
    alternatives: [],
  },
  configuration: {
    base: {
      geometryId: 'walnut-size-profiteroles',
      yieldId: 'twenty-profiteroles',
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
      id: 'bowl',
      name: {
        en: 'bowl',
        es: 'bol',
        uk: 'миска',
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
    {
      id: 'saucepan',
      name: {
        en: 'saucepan',
        es: 'cazo',
        uk: 'каструля',
      },
    },
    {
      id: 'piping-bag',
      name: {
        en: 'piping bag',
        es: 'manga pastelera',
        uk: 'кондитерський мішок',
      },
    },
  ],
  flourConfiguration: {
    commercialMixLineId: 'flour',
    additionalStarchLineIds: [],
    provenance: {
      state: 'tested',
      sourceIds: ['eclairs-recorded-source'],
    },
    testedAlternativeMixes: [],
    knownUnsupportedMixes: [],
    basis: 'commercialMix',
  },
  beforeStart: [
    {
      id: 'before-0',
      text: {
        en: 'Prepare the selected cream in advance and chill it completely. Fill only completely cooled shells.',
        es: 'Prepara con antelación la crema elegida y enfríala por completo. Rellena solo las piezas completamente frías.',
        uk: 'Заздалегідь приготуйте вибраний крем і повністю охолодіть його. Наповнюйте лише повністю охололі оболонки.',
      },
    },
  ],
  ingredientSections: [
    {
      id: 'choux',
      title: {
        en: 'Choux pastry',
        es: 'Masa choux',
        uk: 'Заварне тісто',
      },
      lines: [
        {
          id: 'flour',
          options: [
            {
              ingredientId: 'flour',
              name: {
                en: 'Schär Mix B Bread flour mix',
                es: 'Mezcla de harina Schär Mix B Bread',
                uk: 'Борошняна суміш Schär Mix B Bread',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 110,
              unit: 'g',
            },
            equivalent: {
              kind: 'exact',
              value: 5.5,
              unit: 'tbsp',
            },
            shopping: {
              mode: 'base',
            },
          },
          qualifier: {
            en: 'The exact flour mix used in the successful bake.',
            es: 'Es la mezcla exacta utilizada en el horneado exitoso.',
            uk: 'Саме цю суміш використано в успішній випічці.',
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
              value: 2.3542,
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
          id: 'water',
          options: [
            {
              ingredientId: 'water',
              name: {
                en: 'Water',
                es: 'Agua',
                uk: 'Вода',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 130,
              unit: 'ml',
            },
            shopping: {
              mode: 'base',
              defaultSelected: false,
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
              value: 70,
              unit: 'g',
            },
            shopping: {
              mode: 'base',
            },
          },
          qualifier: {
            en: 'Chilled and cut into cubes.',
            es: 'Fría y cortada en dados.',
            uk: 'Охолоджене й нарізане кубиками.',
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
                uk: 'Маленькі яйця',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 4,
              unit: 'piece',
            },
            shopping: {
              mode: 'base',
              increment: 1,
              rounding: 'up',
            },
          },
          qualifier: {
            en: 'Lightly beaten. The tested version uses 4 small eggs.',
            es: 'Ligeramente batidos. En la versión probada se usaron 4 huevos pequeños.',
            uk: 'Злегка збийте. У перевіреній версії використано 4 маленькі яйця.',
          },
        },
      ],
    },
  ],
  steps: [
    {
      id: 'mix-dry',
      title: {
        en: 'Sift the dry ingredients',
        es: 'Tamiza los ingredientes secos',
        uk: 'Просійте сухі інгредієнти',
      },
      instruction: {
        en: 'Sift the Schär Mix B Bread flour, icing sugar and salt together into a small bowl.',
        es: 'Tamiza en un bol pequeño la mezcla Schär Mix B Bread, el azúcar glas y la sal.',
        uk: 'Просійте в невелику миску борошняну суміш Schär Mix B Bread, цукрову пудру й сіль.',
      },
      ingredientLineIds: ['flour', 'powdered-sugar', 'salt'],
      guidance: [],
      cook: {
        ingredients: [
          {
            ingredientId: 'flour',
          },
          {
            ingredientId: 'powdered-sugar',
          },
          {
            ingredientId: 'salt',
          },
        ],
      },
      equipmentIds: ['bowl'],
    },
    {
      id: 'heat-liquid',
      title: {
        en: 'Melt the butter in the water',
        es: 'Derrite la mantequilla en el agua',
        uk: 'Розтопіть масло у воді',
      },
      instruction: {
        en: 'Put the water and butter in a small saucepan. Heat gently until the butter has melted, then bring the mixture to a boil.',
        es: 'Pon el agua y la mantequilla en un cazo pequeño. Calienta suavemente hasta que la mantequilla se derrita y después lleva la mezcla a ebullición.',
        uk: 'Покладіть воду й масло в невелику каструлю. Нагрівайте на слабкому вогні, доки масло не розтане, а потім доведіть суміш до кипіння.',
      },
      ingredientLineIds: ['water', 'butter'],
      guidance: [
        {
          id: 'heat-liquid-tip',
          kind: 'practicalTip',
          text: {
            en: 'Use gentle heat at first so the butter melts before too much water evaporates.',
            es: 'Empieza con fuego suave para que la mantequilla se derrita antes de que se evapore demasiada agua.',
            uk: 'Спочатку нагрівайте повільно, щоб масло встигло розтанути до помітного випаровування води.',
          },
        },
      ],
      cook: {
        ingredients: [
          {
            ingredientId: 'water',
          },
          {
            ingredientId: 'butter',
          },
        ],
      },
      equipmentIds: ['saucepan'],
    },
    {
      id: 'cook-panade',
      title: {
        en: 'Cook the choux base',
        es: 'Cuece la base de la masa',
        uk: 'Заваріть основу',
      },
      instruction: {
        en: 'Add all the dry mixture at once and remove the saucepan from the heat. Beat firmly with a spatula until the dough comes together and pulls away from the sides of the pan. Stir over low heat briefly, then set aside for a few minutes, beating out some of the hot steam.',
        es: 'Añade de golpe toda la mezcla seca y retira el cazo del fuego. Bate con firmeza con una espátula hasta que la masa se una y se separe de las paredes. Remueve brevemente a fuego bajo y deja reposar unos minutos mientras eliminas parte del vapor caliente.',
        uk: 'Одразу всипте всю суху суміш і зніміть каструлю з вогню. Енергійно вимішуйте лопаткою, доки тісто не збереться докупи й не відійде від стінок. Ненадовго поверніть на слабкий вогонь, а потім відставте на кілька хвилин, продовжуючи перемішувати й випускаючи гарячу пару.',
      },
      ingredientLineIds: [],
      guidance: [
        {
          id: 'cook-panade-tip',
          kind: 'practicalTip',
          text: {
            en: 'Let the base cool slightly before adding egg so the egg does not set on contact.',
            es: 'Deja que la base se enfríe un poco antes de añadir los huevos para que no se cuajen al contacto.',
            uk: 'Перед додаванням яєць дайте основі трохи охолонути, щоб яйця не згорнулися.',
          },
        },
      ],
      mediaIds: ['eclairs-cooked-panade-v1'],
      equipmentIds: ['spatula', 'saucepan'],
    },
    {
      id: 'add-eggs',
      title: {
        en: 'Beat in the eggs gradually',
        es: 'Incorpora los huevos poco a poco',
        uk: 'Поступово введіть яйця',
      },
      instruction: {
        en: 'Add the lightly beaten eggs a little at a time, mixing thoroughly after every addition, until the dough is soft, smooth and glossy.',
        es: 'Añade los huevos ligeramente batidos en pequeñas porciones y mezcla bien después de cada una hasta obtener una masa blanda, lisa y brillante.',
        uk: 'Додавайте злегка збиті яйця невеликими порціями, щоразу ретельно вимішуючи, доки тісто не стане м’яким, гладким і блискучим.',
      },
      ingredientLineIds: ['eggs'],
      guidance: [
        {
          id: 'add-eggs-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The dough is glossy, holds its shape and falls slowly from the spatula in a heavy ribbon.',
            es: 'La masa está brillante, conserva la forma y cae lentamente de la espátula formando una cinta pesada.',
            uk: 'Тісто блискуче, тримає форму й повільно спадає з лопатки важкою стрічкою.',
          },
        },
        {
          id: 'add-eggs-tip',
          kind: 'practicalTip',
          text: {
            en: 'Four small eggs were ideal in the tested bake. Hold back the last addition until you have checked the texture.',
            es: 'Cuatro huevos pequeños fueron ideales en la prueba. Reserva la última porción hasta comprobar la textura.',
            uk: 'У перевіреній випічці ідеально підійшли 4 маленькі яйця. Перед останньою порцією обов’язково перевірте консистенцію.',
          },
        },
      ],
      cook: {
        ingredients: [
          {
            ingredientId: 'eggs',
          },
        ],
      },
      mediaIds: ['eclairs-heavy-ribbon-v2'],
    },
    {
      id: 'pipe',
      title: {
        en: 'Pipe the shells',
        es: 'Forma las piezas',
        uk: 'Відсадіть заготовки',
      },
      instruction: {
        en: 'Transfer the dough to a piping bag fitted with an approximately 1.5 cm nozzle. Pipe walnut-size rounds onto the lined tray, leaving room between them.',
        es: 'Pasa la masa a una manga con boquilla de unos 1,5 cm. Forma montones del tamaño de una nuez sobre la bandeja, dejando espacio entre ellos.',
        uk: 'Перекладіть тісто в кондитерський мішок із насадкою приблизно 1,5 см. Відсадіть на деко кульки розміром із волоський горіх, залишаючи між ними місце.',
      },
      ingredientLineIds: [],
      guidance: [
        {
          id: 'pipe-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The piped dough keeps its shape and does not spread into flat puddles.',
            es: 'Las piezas mantienen la forma y no se extienden en discos planos.',
            uk: 'Заготовки тримають форму й не розпливаються пласкими калюжами.',
          },
        },
      ],
      mediaIds: ['eclairs-piped-profiteroles-v2'],
      equipmentIds: ['piping-bag'],
    },
    {
      id: 'bake',
      title: {
        en: 'Bake until risen and golden',
        es: 'Hornea hasta que estén dorados',
        uk: 'Випечіть до золотистого кольору',
      },
      instruction: {
        en: 'Without opening the oven between stages, bake until the shells have risen and turned golden.',
        es: 'Sin abrir el horno entre las dos etapas, hornea hasta que las piezas hayan subido y estén doradas.',
        uk: 'Не відкривайте духовку між етапами й випікайте, доки оболонки добре не піднімуться та не стануть золотистими.',
      },
      ingredientLineIds: [],
      guidance: [
        {
          id: 'bake-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The shells are well risen, golden and firm rather than pale or soft.',
            es: 'Las piezas están bien hinchadas, doradas y firmes, no pálidas ni blandas.',
            uk: 'Оболонки добре піднялися, стали золотистими й міцними, а не блідими чи м’якими.',
          },
        },
      ],
      displayMeta: {
        en: '200°C · 10 min, then 180°C · 15 min',
        es: '200°C · 10 min; después 180°C · 15 min',
        uk: '200°C · 10 хв, потім 180°C · 15 хв',
      },
      temperatureStages: [
        {
          phaseId: 'hot-bake',
          temperature: {
            value: 200,
            unit: 'C',
            ovenMode: null,
          },
        },
        {
          phaseId: 'lower-bake',
          temperature: {
            value: 180,
            unit: 'C',
            ovenMode: null,
          },
        },
      ],
    },
    {
      id: 'dry-shells',
      title: {
        en: 'Vent and dry the shells',
        es: 'Deja salir el vapor y seca',
        uk: 'Випустіть пару й досушіть',
      },
      instruction: {
        en: 'Remove the tray and make a small hole in the base of each shell. Return them to the oven for a few minutes so the inside can dry, then cool completely.',
        es: 'Saca la bandeja y haz un pequeño agujero en la base de cada pieza. Devuélvelas al horno unos minutos para secar el interior y deja que se enfríen por completo.',
        uk: 'Вийміть деко й зробіть невеликий отвір у дні кожної оболонки. Поверніть їх у духовку ще на кілька хвилин, щоб середина підсохла, а потім повністю остудіть.',
      },
      ingredientLineIds: [],
      guidance: [
        {
          id: 'dry-shells-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The cooled shells feel light, dry and hollow and do not collapse.',
            es: 'Las piezas frías se sienten ligeras, secas y huecas y no se hunden.',
            uk: 'Охололі оболонки легкі, сухі й порожнисті та не осідають.',
          },
        },
      ],
      mediaIds: ['eclairs-dry-hollow-shells-v2'],
    },
    {
      id: 'fill',
      title: {
        en: 'Fill the cooled shells',
        es: 'Rellena las piezas frías',
        uk: 'Наповніть охололі оболонки',
      },
      instruction: {
        en: 'Transfer the prepared cream to a piping bag and fill the completely cooled shells through the holes in their bases.',
        es: 'Pasa la crema preparada a una manga y rellena las piezas completamente frías por los agujeros de la base.',
        uk: 'Перекладіть приготований крем у кондитерський мішок і наповніть повністю охололі оболонки через отвори внизу.',
      },
      ingredientLineIds: [],
      guidance: [],
      equipmentIds: ['piping-bag'],
    },
  ],
  storage: null,
  makeAhead: {
    en: 'Prepare the selected cream in advance and chill it completely. Fill only completely cooled shells.',
    es: 'Prepara con antelación la crema elegida y enfríala por completo. Rellena solo las piezas completamente frías.',
    uk: 'Заздалегідь приготуйте вибраний крем і повністю охолодіть його. Наповнюйте лише повністю охололі оболонки.',
  },
  creamOptions: {
    recipeIds: [
      'mascarpone-whipped-cream',
      'vanilla-egg-custard',
      'eggless-vanilla-custard',
      'vanilla-buttercream',
    ],
    recommendedRecipeId: 'vanilla-egg-custard',
  },
  variations: [],
  heroMediaId: 'eclairs-hero',
  media: [
    {
      id: 'eclairs-hero',
      type: 'image',
      path: '/images/recipes/profiteroles-card-v2.webp',
      usage: ['hero'],
      alt: {
        en: 'Golden gluten-free profiteroles with one cut open to show vanilla cream',
        es: 'Profiteroles sin gluten dorados con uno abierto para mostrar la crema de vainilla',
        uk: 'Золотисті безглютенові профітролі, один розрізаний і показує ванільний крем',
      },
    },
    {
      id: 'eclairs-cooked-panade-v1',
      type: 'image',
      path: '/media/recipes/eclairs/selected/step-03-cooked-panade-v1.webp',
      usage: ['step'],
      alt: {
        en: 'A smooth pale choux paste gathered into one mass in a stainless-steel saucepan',
        es: 'Masa choux clara y lisa reunida en una sola pieza dentro de un cazo de acero inoxidable',
        uk: 'Гладке світле заварне тісто, зібране в одну масу в сталевій каструлі',
      },
    },
    {
      id: 'eclairs-heavy-ribbon-v2',
      type: 'image',
      path: '/media/recipes/eclairs/selected/step-04-heavy-ribbon-v2.webp',
      usage: ['step'],
      alt: {
        en: 'Glossy choux dough falling slowly from a spatula in a thick ribbon above a bowl',
        es: 'Masa choux brillante que cae lentamente de una espátula formando una cinta gruesa sobre un bol',
        uk: 'Блискуче заварне тісто повільно спадає з лопатки густою стрічкою над мискою',
      },
    },
    {
      id: 'eclairs-piped-profiteroles-v2',
      type: 'image',
      path: '/media/recipes/eclairs/selected/step-05-piped-profiteroles-v2.webp',
      usage: ['step'],
      alt: {
        en: 'Even walnut-size rounds of uncooked choux dough spaced apart on a parchment-lined tray',
        es: 'Porciones iguales de masa choux cruda del tamaño de una nuez separadas sobre una bandeja con papel de horno',
        uk: 'Однакові сирі кульки заварного тіста розміром із волоський горіх на застеленому пергаментом деку',
      },
    },
    {
      id: 'eclairs-dry-hollow-shells-v2',
      type: 'image',
      path: '/media/recipes/eclairs/selected/step-07-dry-hollow-shells-v2.webp',
      usage: ['step'],
      alt: {
        en: 'Golden profiterole shells on a rack with one split open to show a dry hollow centre',
        es: 'Profiteroles dorados sobre una rejilla con uno abierto para mostrar el interior seco y hueco',
        uk: 'Золотисті оболонки профітролів на решітці, одна розкрита й показує суху порожнисту середину',
      },
    },
  ],
  relatedRecipeIds: [],
  sources: [
    {
      id: 'eclairs-recorded-source',
      file: 'User-provided recipe screenshot, 2026-09-19',
      locator:
        'Gluten-free profiteroles · recipe text with author note above it',
    },
  ],
  contentGaps: [],
  presentation: 'concise',
  evidenceExplanation: {
    en: 'This exact choux made with Schär Mix B Bread and 4 small eggs baked successfully and yielded about 20 profiteroles.',
    es: 'Esta masa choux con Schär Mix B Bread y 4 huevos pequeños se horneó con éxito y rindió unos 20 profiteroles.',
    uk: 'Саме це заварне тісто на Schär Mix B Bread із 4 маленькими яйцями успішно випікалося й дало близько 20 профітролів.',
  },
  searchMetadata: {
    datePublished: null,
    dateModified: '2026-10-04',
    cookTimeMinutes: 25,
    recipeCuisine: {
      uk: null,
      en: null,
      es: null,
    },
    keywords: {
      uk: ['Безглютенові профітролі'],
      en: ['Gluten-free profiteroles'],
      es: ['Profiteroles sin gluten'],
    },
  },
  discovery: {
    cardTitle: {
      en: 'Profiteroles',
      es: 'Profiteroles',
      uk: 'Профітролі',
    },
    category: {
      en: 'Choux pastry / dessert',
      es: 'Pasta choux / postre',
      uk: 'Заварне тісто / десерт',
    },
    flourSummary: {
      en: 'Schär Mix B Bread',
      es: 'Schär Mix B Bread',
      uk: 'Schär Mix B Bread',
    },
    collectionIds: ['celebration'],
    catalogue: true,
    imageKind: 'generated-preview',
    sourceTitle: 'Профітролі',
    launchPriority: 'To confirm',
    heroCandidate: 'Possible',
    source: 'Recipe screenshot and author bake note, added 2026-09-19',
    archiveSections: [
      {
        title: 'Author note · tested bake',
        content:
          'Ми поклали 4 маленьких яйця і було ідеально, десь 20 профітролей.',
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
      title: 'Безглютенові профітролі',
      description:
        'Безглютенові профітролі із заварного тіста з кремовою начинкою. Підготовка тіста, випікання порожнистих тістечок і наповнення кремом.',
    },
    en: {
      title: 'Gluten-free profiteroles',
      description:
        'Gluten-free profiteroles with a cream filling. Follow the steps for making choux pastry, baking hollow shells and filling them.',
    },
    es: {
      title: 'Profiteroles sin gluten',
      description:
        'Profiteroles sin gluten con relleno cremoso. Cómo preparar la pasta choux, hornear los bocaditos huecos y rellenarlos paso a paso.',
    },
  },
  routeSlug: 'eclairs',
} satisfies Recipe;
