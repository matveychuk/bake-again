import type { Recipe } from './recipe.types.ts';

export const carrotCakeRecipe = {
  schemaVersion: 3,
  id: 'carrot-cake',
  versionId: 'carrot-cake-source-v1',
  publicationStatus: 'published',
  translationState: {
    uk: 'reviewed',
    en: 'reviewed',
    es: 'reviewed',
  },
  slug: {
    en: 'carrot-cake',
    es: 'carrot-cake',
    uk: 'carrot-cake',
  },
  title: {
    en: 'Gluten-free carrot cake',
    es: 'Bizcocho de zanahoria sin gluten',
    uk: 'Безглютеновий морквяний кекс',
  },
  summary: {
    en: 'A tender carrot cake with raisins and nuts.',
    es: 'Un bizcocho tierno de zanahoria con pasas y frutos secos.',
    uk: 'Ніжний кекс із морквою, родзинками й горіхами.',
  },
  categoryIds: [],
  situationIds: [],
  difficulty: 'medium',
  baseProvenance: {
    state: 'tested',
    sourceIds: ['carrot-cake-recorded-source'],
  },
  timing: {
    activeMinutes: 30,
    totalElapsedMinutes: null,
    planningNote: {
      text: {
        en: 'Preheat the oven to 200°C with top and bottom heat before starting.',
        es: 'Antes de empezar, precalienta el horno a 200°C con calor arriba y abajo.',
        uk: 'Перед початком розігрійте духовку до 200°C у режимі верхнього й нижнього нагріву.',
      },
    },
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
          min: 35,
          max: 40,
          unit: 'minute',
        },
        relatedStepId: 'bake',
      },
      {
        id: 'soak-raisins',
        relatedStepId: 'prepare-add-ins',
        duration: {
          kind: 'exact',
          value: 5,
          unit: 'minute',
        },
        label: {
          en: 'Soak the raisins',
          es: 'Remojar las pasas',
          uk: 'Замочування родзинок',
        },
      },
    ],
  },
  yield: {
    default: {
      id: 'one-cake',
      label: {
        en: '1 cake',
        es: '1 bizcocho',
        uk: '1 кекс',
      },
      count: {
        kind: 'exact',
        value: 1,
      },
      unit: 'cake',
      provenance: {
        state: 'tested',
        sourceIds: ['carrot-cake-recorded-source'],
      },
      availability: 'default',
    },
    alternatives: [],
  },
  geometry: {
    state: 'known',
    default: {
      id: 'carrot-cake-base',
      label: {
        en: 'Tall tin',
        es: 'Molde alto',
        uk: 'Висока форма',
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
        sourceIds: ['carrot-cake-recorded-source'],
      },
    },
    alternatives: [],
  },
  configuration: {
    base: {
      geometryId: 'carrot-cake-base',
      yieldId: 'one-cake',
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
            ingredientLineId: 'carrots',
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
      id: 'spatula',
      name: {
        en: 'spatula',
        es: 'espátula',
        uk: 'лопатка',
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
    additionalStarchLineIds: [],
    provenance: {
      state: 'tested',
      sourceIds: ['carrot-cake-recorded-source'],
    },
    testedAlternativeMixes: [],
    knownUnsupportedMixes: [],
    basis: 'commercialMix',
  },
  beforeStart: [],
  ingredientSections: [
    {
      id: 'cake',
      title: {
        en: 'Carrot cake',
        es: 'Bizcocho de zanahoria',
        uk: 'Морквяний кекс',
      },
      lines: [
        {
          id: 'carrots',
          options: [
            {
              ingredientId: 'carrots',
              name: {
                en: 'Carrots',
                es: 'Zanahorias',
                uk: 'Морква',
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
          id: 'oil',
          options: [
            {
              ingredientId: 'oil',
              name: {
                en: 'Neutral oil',
                es: 'Aceite neutro',
                uk: 'Олія без запаху',
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
              value: 3,
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
              value: 170,
              unit: 'g',
            },
            equivalent: {
              kind: 'exact',
              value: 8.5,
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
          id: 'nuts',
          options: [
            {
              ingredientId: 'nuts',
              name: {
                en: 'Walnuts or pecans',
                es: 'Nueces o pacanas',
                uk: 'Волоські горіхи або пекан',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 100,
              unit: 'g',
            },
            shopping: {
              mode: 'base',
            },
          },
        },
        {
          id: 'raisins',
          options: [
            {
              ingredientId: 'raisins',
              name: {
                en: 'Raisins',
                es: 'Pasas',
                uk: 'Родзинки',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 80,
              unit: 'g',
            },
            shopping: {
              mode: 'base',
            },
          },
        },
        {
          id: 'pan-butter',
          options: [
            {
              ingredientId: 'pan-butter',
              name: {
                en: 'Butter for the pan',
                es: 'Mantequilla para el molde',
                uk: 'Вершкове масло для форми',
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
          id: 'pan-cinnamon',
          options: [
            {
              ingredientId: 'pan-cinnamon',
              name: {
                en: 'Cinnamon for the pan',
                es: 'Canela para el molde',
                uk: 'Кориця для форми',
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
      id: 'prepare-add-ins',
      title: {
        en: 'Prepare the raisins and nuts',
        es: 'Prepara las pasas y las nueces',
        uk: 'Підготуйте родзинки й горіхи',
      },
      instruction: {
        en: 'Cover the raisins with water and soak for 5 minutes. Meanwhile, chop the nuts into small pieces and move on to the carrots.',
        es: 'Cubre las pasas con agua y déjalas 5 minutos. Mientras tanto, pica las nueces en trozos pequeños y pasa a preparar la zanahoria.',
        uk: 'Залийте родзинки водою й залиште на 5 хвилин. Тим часом наріжте горіхи невеликими шматочками й переходьте до моркви.',
      },
      ingredientLineIds: ['raisins', 'nuts'],
      guidance: [
        {
          id: 'prepare-add-ins-tip',
          kind: 'practicalTip',
          text: {
            en: 'Preheat the oven to 200°C with top and bottom heat so it is ready for baking.',
            es: 'Precalienta el horno a 200°C con calor arriba y abajo para que esté listo a tiempo.',
            uk: 'Увімкніть духовку на 200°C, верхній і нижній нагрів, щоб вона встигла розігрітися.',
          },
        },
      ],
      cook: {
        ingredients: [
          {
            ingredientId: 'raisins',
          },
          {
            ingredientId: 'nuts',
          },
        ],
      },
    },
    {
      id: 'blend-carrots',
      title: {
        en: 'Blend the carrots with oil',
        es: 'Tritura las zanahorias con aceite',
        uk: 'Подрібніть моркву з олією',
      },
      instruction: {
        en: 'Grate the carrots, add the oil and blend together.',
        es: 'Ralla las zanahorias, añade el aceite y tritura todo junto.',
        uk: 'Натріть моркву, додайте олію й подрібніть усе блендером.',
      },
      ingredientLineIds: ['carrots', 'oil'],
      guidance: [
        {
          id: 'blend-carrots-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The mixture is smooth, with no visible carrot strands.',
            es: 'La mezcla queda lisa y homogénea, sin hebras visibles de zanahoria.',
            uk: 'Маса гладка й однорідна, без помітних волокон моркви.',
          },
        },
      ],
      cook: {
        ingredients: [
          {
            ingredientId: 'carrots',
          },
          {
            ingredientId: 'oil',
          },
        ],
      },
      mediaIds: ['carrot-oil-smooth'],
    },
    {
      id: 'whip-eggs',
      title: {
        en: 'Whip the eggs and sugar',
        es: 'Bate los huevos con el azúcar',
        uk: 'Збийте яйця з цукром',
      },
      instruction: {
        en: 'Beat the eggs and sugar with a mixer.',
        es: 'Bate los huevos con el azúcar con una batidora de varillas.',
        uk: 'З’єднайте яйця з цукром і збийте міксером.',
      },
      ingredientLineIds: ['eggs', 'sugar'],
      guidance: [
        {
          id: 'whip-eggs-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The mixture is pale and fluffy, three to four times its original volume. It falls from the whisk in a thick ribbon.',
            es: 'La mezcla queda clara y esponjosa, con un volumen tres o cuatro veces mayor. Cae de las varillas formando una cinta espesa.',
            uk: 'Маса світла й пишна, збільшилася в об’ємі у три-чотири рази. З вінчика стікає густою стрічкою.',
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
      mediaIds: ['eggs-sugar-foam'],
      equipmentIds: ['mixer'],
    },
    {
      id: 'mix-batter',
      title: {
        en: 'Mix the batter',
        es: 'Mezcla la masa',
        uk: 'Замісіть тісто',
      },
      instruction: {
        en: 'Mix the flour, baking powder and salt into the carrot mixture. Stir in one third of the egg foam. Fold in the rest in two additions with a spatula, stopping as soon as no pale streaks remain.',
        es: 'Mezcla la harina, la levadura química y la sal con la zanahoria. Incorpora un tercio de la espuma de huevo. Añade el resto en dos tandas con una espátula y movimientos envolventes, solo hasta que desaparezcan las vetas claras.',
        uk: 'Додайте до морквяної маси борошно, розпушувач і сіль. Перемішайте. Вмішайте третину збитих яєць, потім додайте решту у два прийоми. Перемішуйте лопаткою знизу догори, доки не зникнуть світлі смуги.',
      },
      ingredientLineIds: ['flour', 'baking-powder', 'salt'],
      guidance: [
        {
          id: 'mix-batter-tip',
          kind: 'practicalTip',
          text: {
            en: 'To keep the batter airy, fold only until evenly combined.',
            es: 'Para conservar el aire de la masa, mezcla solo hasta que quede uniforme.',
            uk: 'Щоб зберегти пишність тіста, не перемішуйте його довше, ніж потрібно для однорідності.',
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
        ],
      },
      equipmentIds: ['spatula'],
    },
    {
      id: 'fold-add-ins',
      title: {
        en: 'Fold in the raisins and nuts',
        es: 'Incorpora las pasas y las nueces',
        uk: 'Додайте родзинки й горіхи',
      },
      instruction: {
        en: 'Drain the raisins without drying them. Add the raisins and nuts to the batter and fold gently with a spatula until evenly distributed.',
        es: 'Escurre las pasas sin secarlas. Añádelas a la masa junto con las nueces y reparte con una espátula y movimientos suaves.',
        uk: 'Злийте воду з родзинок, але не обсушуйте їх. Додайте родзинки й горіхи до тіста. Обережно перемішайте лопаткою, щоб рівномірно розподілити їх.',
      },
      ingredientLineIds: ['raisins', 'nuts'],
      guidance: [
        {
          id: 'fold-add-ins-tip',
          kind: 'practicalTip',
          text: {
            en: 'The batter can be refrigerated for up to three days.',
            es: 'Puedes guardar la masa en el frigorífico hasta tres días.',
            uk: 'Якщо готуєте заздалегідь, тісто можна зберігати в холодильнику до трьох днів.',
          },
        },
      ],
      cook: {
        ingredients: [
          {
            ingredientId: 'raisins',
          },
          {
            ingredientId: 'nuts',
          },
        ],
      },
      mediaIds: ['batter-add-ins'],
      equipmentIds: ['spatula'],
    },
    {
      id: 'bake',
      title: {
        en: 'Bake the cake',
        es: 'Hornea el bizcocho',
        uk: 'Спечіть кекс',
      },
      instruction: {
        en: 'Line the base of a tall tin with baking parchment. Butter the sides and dust with cinnamon. Add the batter. Bake in the preheated oven at 200°C with top and bottom heat for 35–40 minutes.',
        es: 'Forra la base de un molde alto con papel de horno. Unta los lados con mantequilla y espolvorea con canela. Vierte la masa. Hornea a 200°C con calor arriba y abajo durante 35–40 minutos.',
        uk: 'Дно високої форми застеліть пергаментом, боки змастіть маслом і присипте корицею. Викладіть тісто у форму. Поставте в розігріту до 200°C духовку, верхній і нижній нагрів. Випікайте 35–40 хвилин.',
      },
      ingredientLineIds: ['pan-butter', 'pan-cinnamon'],
      guidance: [
        {
          id: 'bake-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'Insert a toothpick into the centre: if it comes out completely dry, the cake is ready. Remove from the oven and take it out of the tin.',
            es: 'Introduce un palillo en el centro: si sale completamente seco, el bizcocho está listo. Sácalo del horno y desmóldalo.',
            uk: 'Встроміть зубочистку в центр кексу: якщо вона виходить повністю сухою, кекс готовий. Дістаньте його з духовки й вийміть із форми.',
          },
        },
      ],
      cook: {
        ingredients: [
          {
            ingredientId: 'pan-butter',
          },
          {
            ingredientId: 'pan-cinnamon',
          },
        ],
      },
      mediaIds: ['batter-in-pan', 'dry-toothpick'],
      equipmentIds: ['parchment'],
      temperature: {
        value: 200,
        unit: 'C',
        ovenMode: 'conventional',
      },
      durationPhaseId: 'baking',
    },
  ],
  storage: null,
  makeAhead: {
    en: 'The batter can be refrigerated for up to three days.',
    es: 'Puedes guardar la masa en el frigorífico hasta tres días.',
    uk: 'Якщо готуєте заздалегідь, тісто можна зберігати в холодильнику до трьох днів.',
  },
  variations: [],
  heroMediaId: 'carrot-cake-hero',
  media: [
    {
      id: 'carrot-cake-hero',
      type: 'image',
      path: '/images/recipes/carrot-cake-card-v1.webp',
      usage: ['hero'],
      alt: {
        en: 'Gluten-free carrot loaf cake with walnuts and raisins',
        es: 'Bizcocho sin gluten de zanahoria con nueces y pasas',
        uk: 'Безглютеновий морквяний кекс із горіхами та родзинками',
      },
    },
    {
      id: 'carrot-oil-smooth',
      type: 'image',
      path: '/media/recipes/carrot-cake/selected/step-03-carrot-oil-smooth-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Smooth orange carrot and oil puree beside an immersion blender',
        es: 'Puré liso de zanahoria y aceite junto a una batidora de mano',
        uk: 'Гладка помаранчева маса з моркви й олії біля занурювального блендера',
      },
    },
    {
      id: 'eggs-sugar-foam',
      type: 'image',
      path: '/media/recipes/carrot-cake/selected/step-04-eggs-sugar-foam-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Thick pale egg and sugar foam falling in a ribbon from a whisk',
        es: 'Espuma espesa y clara de huevo y azúcar cayendo en forma de cinta de unas varillas',
        uk: 'Густа світла піна з яєць і цукру стікає стрічкою з вінчика',
      },
    },
    {
      id: 'batter-add-ins',
      type: 'image',
      path: '/media/recipes/carrot-cake/selected/step-06-batter-add-ins-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Carrot batter with raisins and chopped nuts',
        es: 'Masa de zanahoria con pasas y nueces picadas',
        uk: 'Морквяне тісто з родзинками й подрібненими горіхами',
      },
    },
    {
      id: 'batter-in-pan',
      type: 'image',
      path: '/media/recipes/carrot-cake/selected/step-07-batter-in-pan-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Raw carrot batter in a tall loaf pan',
        es: 'Masa cruda de zanahoria en un molde alto',
        uk: 'Сире морквяне тісто у високій формі для кексу',
      },
      title: {
        en: 'Before baking',
        es: 'Antes de hornear',
        uk: 'Перед випіканням',
      },
    },
    {
      id: 'dry-toothpick',
      type: 'image',
      path: '/media/recipes/carrot-cake/selected/step-07-dry-toothpick-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Baked carrot cake and a dry toothpick lifted from the centre',
        es: 'Bizcocho de zanahoria horneado y un palillo seco retirado del centro',
        uk: 'Спечений морквяний кекс і суха зубочистка, вийнята з центру',
      },
      title: {
        en: 'Baked cake',
        es: 'Bizcocho horneado',
        uk: 'Готовий кекс',
      },
    },
  ],
  relatedRecipeIds: [],
  sources: [
    {
      id: 'carrot-cake-recorded-source',
      file: 'docs/reference/recipe-inventory.xlsx',
      locator:
        'Recipe Archive · Морквяний кекс; author-reviewed one-cake quantities and method',
    },
  ],
  contentGaps: [],
  presentation: 'concise',
  evidenceExplanation: {
    en: 'This exact version has been baked successfully.',
    es: 'Esta versión se ha horneado con éxito.',
    uk: 'Цю версію успішно випікали.',
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
      uk: ['Безглютеновий морквяний кекс'],
      en: ['Gluten-free carrot cake'],
      es: ['Bizcocho de zanahoria sin gluten'],
    },
  },
  discovery: {
    cardTitle: {
      en: 'Carrot cake',
      es: 'Bizcocho de zanahoria',
      uk: 'Морквяний кекс',
    },
    category: {
      en: 'Cake',
      es: 'Bizcocho',
      uk: 'Кекс',
    },
    flourSummary: {
      en: 'Schär Mix B Bread',
      es: 'Schär Mix B Bread',
      uk: 'Schär Mix B Bread',
    },
    collectionIds: ['everyday', 'batter-on-hand'],
    catalogue: true,
    imageKind: 'generated-preview',
    sourceTitle: 'Морквяний кекс',
    launchPriority: 'Medium',
    heroCandidate: 'No',
    source:
      'Handwritten notebook page, IMG_1273.jpeg, with author-confirmed one-cake quantities and method',
    archiveSections: [
      {
        title: 'Ingredients · original notes',
        content:
          'Морква — 500–600 г\nОлія — 300 мл\nЯйця — 8 шт.\nЦукор — 300 г\nБорошно — 500 г\nРозпушувач — 16 г\nСіль — 4 г\nГрецькі горіхи — 300 г (2 пачки)\nРодзинки — 250 г (1 пачка)',
      },
      {
        title: 'Method · original notes',
        content:
          '1. Натерти моркву і збити її блендером з олією.\n2. Яйця з цукром збити до густої піни.\n3. Змішати борошно, розпушувач і сіль; додати до рідких інгредієнтів.\n4. Додати замочені родзинки та горіхи.\n5. Змастити форму маслом і вилити тісто. Запис: «Тут на 3 кекси».\n6. Випікати при 200°C 35–40 хв.',
      },
    ],
    needsBeforePublishing:
      'Confirm the exact pan dimensions and total timing; approve or replace the generated photo.',
  },
  translationReview: {
    date: '2026-11-01',
    reviewer: 'implementation',
    scope:
      'ID-aligned transfer and semantic comparison of existing UK/EN/ES recipe text; not separate author approval',
  },
  seo: {
    uk: {
      title: 'Безглютеновий морквяний кекс',
      description:
        'Безглютеновий морквяний кекс із родзинками та горіхами. Підготовка добавок, замішування тіста й випікання з покроковими поясненнями.',
    },
    en: {
      title: 'Gluten-free carrot cake',
      description:
        'Gluten-free carrot cake with raisins and nuts. Follow the steps for preparing the fruit and nuts, mixing the batter and baking.',
    },
    es: {
      title: 'Bizcocho de zanahoria sin gluten',
      description:
        'Bizcocho de zanahoria sin gluten con pasas y frutos secos. Preparación de los ingredientes, mezcla de la masa y horneado paso a paso.',
    },
  },
  routeSlug: 'carrot-cake',
} satisfies Recipe;
