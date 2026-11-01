import type { Recipe } from './recipe.types.ts';

export const bananaBreadRecipe = {
  schemaVersion: 3,
  id: 'banana-bread',
  versionId: 'banana-bread-source-v1',
  publicationStatus: 'published',
  translationState: {
    uk: 'reviewed',
    en: 'reviewed',
    es: 'reviewed',
  },
  slug: {
    en: 'banana-bread',
    es: 'banana-bread',
    uk: 'banana-bread',
  },
  title: {
    en: 'Gluten-free banana bread',
    es: 'Pan de plátano sin gluten',
    uk: 'Безглютеновий банановий хліб',
  },
  summary: {
    en: 'Banana bread with walnuts and raisins.',
    es: 'Pan de plátano con nueces y pasas.',
    uk: 'Банановий хліб із горіхами й родзинками.',
  },
  categoryIds: [],
  situationIds: [],
  difficulty: 'easy',
  baseProvenance: {
    state: 'tested',
    sourceIds: ['banana-bread-recorded-source'],
  },
  timing: {
    activeMinutes: 30,
    totalElapsedMinutes: 90,
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
          kind: 'exact',
          value: 40,
          unit: 'minute',
        },
        relatedStepId: 'bake-loaf',
      },
      {
        id: 'cool-in-tin',
        label: {
          en: 'Cooling in the tin',
          es: 'Enfriado en el molde',
          uk: 'Охолодження у формі',
        },
        duration: {
          kind: 'exact',
          value: 10,
          unit: 'minute',
        },
        relatedStepId: 'cool-loaf',
      },
    ],
  },
  yield: {
    default: {
      id: 'one-loaf',
      label: {
        en: '1 loaf',
        es: '1 pan',
        uk: '1 хлібина',
      },
      count: {
        kind: 'exact',
        value: 1,
      },
      unit: 'cake',
      provenance: {
        state: 'tested',
        sourceIds: ['banana-bread-recorded-source'],
      },
      availability: 'default',
    },
    alternatives: [],
  },
  geometry: {
    state: 'known',
    default: {
      id: 'rectangular-loaf-tin',
      label: {
        en: 'Rectangular loaf tin',
        es: 'Molde rectangular alargado',
        uk: 'Прямокутна форма для кексу',
      },
      kind: 'bakingPan',
      application: 'bake-in',
      shape: 'rectangular',
      diameterCm: null,
      widthCm: null,
      lengthCm: null,
      layerCount: null,
      material: null,
      provenance: {
        state: 'tested',
        sourceIds: ['banana-bread-recorded-source'],
      },
      availability: 'default',
    },
    alternatives: [],
  },
  configuration: {
    base: {
      geometryId: 'rectangular-loaf-tin',
      yieldId: 'one-loaf',
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
      id: 'fork',
      name: {
        en: 'fork',
        es: 'tenedor',
        uk: 'виделка',
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
    {
      id: 'rack',
      name: {
        en: 'cooling rack',
        es: 'rejilla',
        uk: 'решітка для охолодження',
      },
    },
  ],
  flourConfiguration: {
    commercialMixLineId: 'flour',
    additionalStarchLineIds: [],
    provenance: {
      state: 'tested',
      sourceIds: ['banana-bread-recorded-source'],
    },
    testedAlternativeMixes: [],
    knownUnsupportedMixes: [],
    basis: 'commercialMix',
  },
  beforeStart: [],
  ingredientSections: [
    {
      id: 'loaf',
      title: {
        en: 'Banana bread',
        es: 'Pan de plátano',
        uk: 'Банановий хліб',
      },
      lines: [
        {
          id: 'bananas',
          options: [
            {
              ingredientId: 'bananas',
              name: {
                en: 'Very ripe bananas',
                es: 'Plátanos muy maduros',
                uk: 'Дуже стиглі банани',
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
          id: 'butter',
          options: [
            {
              ingredientId: 'butter',
              name: {
                en: 'Softened butter',
                es: 'Mantequilla blanda',
                uk: 'М’яке вершкове масло',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 113,
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
              value: 150,
              unit: 'g',
            },
            equivalent: {
              kind: 'exact',
              value: 7.5,
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
              value: 180,
              unit: 'g',
            },
            equivalent: {
              kind: 'exact',
              value: 9,
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
            base: {
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
          id: 'walnuts',
          options: [
            {
              ingredientId: 'walnuts',
              name: {
                en: 'Walnuts',
                es: 'Nueces',
                uk: 'Волоські горіхи',
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
              value: 150,
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
      id: 'cream-butter-and-sugar',
      title: {
        en: 'Cream the butter and sugar',
        es: 'Bate la mantequilla con el azúcar',
        uk: 'Збийте масло з цукром',
      },
      instruction: {
        en: 'Preheat the oven to 200°C. Grease a loaf tin or line it with parchment. Beat the softened butter and sugar until pale and fluffy.',
        es: 'Precalienta el horno a 200°C. Engrasa un molde alargado o fórralo con papel de horno. Bate la mantequilla blanda con el azúcar hasta obtener una mezcla clara y esponjosa.',
        uk: 'Увімкніть духовку на 200°C. Форму для кексу змастіть маслом або застеліть пергаментом. Збийте м’яке масло з цукром до світлої пишної маси.',
      },
      ingredientLineIds: ['butter', 'sugar'],
      technique: {
        id: 'soften-butter',
      },
      guidance: [],
      cook: {
        ingredients: [
          {
            ingredientId: 'butter',
          },
          {
            ingredientId: 'sugar',
          },
        ],
      },
      mediaIds: ['butter-and-sugar'],
      equipmentIds: ['parchment'],
      temperature: {
        value: 200,
        unit: 'C',
        ovenMode: null,
      },
    },
    {
      id: 'add-bananas-and-eggs',
      title: {
        en: 'Add the bananas and eggs',
        es: 'Añade los plátanos y los huevos',
        uk: 'Додайте банани й яйця',
      },
      instruction: {
        en: 'Mash the bananas with a fork, leaving small pieces. Add to the butter mixture with the eggs and vanilla and mix.',
        es: 'Machaca los plátanos con un tenedor, dejando trozos pequeños. Añádelos a la mezcla de mantequilla con los huevos y la vainilla y mezcla.',
        uk: 'Розімніть банани виделкою, залишаючи невеликі шматочки. Додайте до масляної основи разом із яйцями та ваніллю й перемішайте.',
      },
      ingredientLineIds: ['bananas', 'eggs', 'vanilla'],
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
            ingredientId: 'vanilla',
          },
        ],
      },
      mediaIds: ['mashed-bananas'],
      equipmentIds: ['fork'],
    },
    {
      id: 'combine-dry-ingredients',
      title: {
        en: 'Mix the batter',
        es: 'Mezcla la masa',
        uk: 'Замісіть тісто',
      },
      instruction: {
        en: 'Mix the flour, baking powder and salt separately. Fold into the banana mixture just until no dry patches remain. Add the walnuts and raisins. Transfer to the tin, filling it no more than three quarters full, and level the top.',
        es: 'Mezcla aparte la harina, la levadura química y la sal. Incorpóralas con una espátula a la mezcla de plátano solo hasta que no queden zonas secas. Añade las nueces y las pasas. Llena el molde como máximo hasta tres cuartos de su capacidad y alisa la superficie.',
        uk: 'Окремо змішайте борошно, розпушувач і сіль. Вмішайте лопаткою в бананову масу лише до зникнення сухих ділянок. Додайте горіхи й родзинки. Перекладіть у форму, заповнивши її не більш ніж на три чверті, та розрівняйте.',
      },
      ingredientLineIds: [
        'flour',
        'baking-powder',
        'salt',
        'walnuts',
        'raisins',
      ],
      guidance: [
        {
          id: 'combine-dry-ingredients-tip',
          kind: 'practicalTip',
          text: {
            en: 'For more flavour, toast the walnuts in a dry pan and let them cool before adding.',
            es: 'Para dar más aroma, tuesta las nueces en una sartén seca y deja que se enfríen antes de añadirlas.',
            uk: 'Для виразнішого аромату горіхи можна підсушити на сухій пательні й остудити перед додаванням.',
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
            ingredientId: 'walnuts',
          },
          {
            ingredientId: 'raisins',
          },
        ],
      },
      mediaIds: ['batter-in-tin'],
    },
    {
      id: 'bake-loaf',
      title: {
        en: 'Bake the loaf',
        es: 'Hornea el pan',
        uk: 'Спечіть хліб',
      },
      instruction: {
        en: 'Bake at 200°C for 40 minutes. Test the centre with a skewer: moist crumbs are fine, but there should be no wet batter.',
        es: 'Hornea a 200°C durante 40 minutos. Comprueba el centro con una brocheta: puede salir con migas húmedas, pero no con masa cruda.',
        uk: 'Випікайте при 200°C протягом 40 хвилин. Перевірте центр шпажкою: вологі крихти допустимі, сирого тіста бути не повинно.',
      },
      ingredientLineIds: [],
      guidance: [],
      cook: {
        ingredients: [],
      },
      mediaIds: ['doneness-skewer'],
      temperature: {
        value: 200,
        unit: 'C',
        ovenMode: null,
      },
      durationPhaseId: 'baking',
    },
    {
      id: 'cool-loaf',
      title: {
        en: 'Cool before slicing',
        es: 'Deja enfriar antes de cortar',
        uk: 'Остудіть перед нарізанням',
      },
      instruction: {
        en: 'Leave in the tin for 10 minutes, then remove and cool completely on a rack so the crumb does not compress when sliced.',
        es: 'Deja reposar en el molde durante 10 minutos, desmolda y enfría por completo sobre una rejilla para que la miga no se aplaste al cortar.',
        uk: 'Залиште у формі на 10 хвилин, потім вийміть і повністю остудіть на решітці. Так хліб не зминатиметься під час нарізання.',
      },
      ingredientLineIds: [],
      guidance: [],
      cook: {
        ingredients: [],
      },
      mediaIds: ['cooled-sliced-loaf'],
      equipmentIds: ['rack'],
      durationPhaseId: 'cool-in-tin',
    },
  ],
  storage: null,
  makeAhead: null,
  variations: [],
  heroMediaId: 'banana-bread-hero',
  media: [
    {
      id: 'banana-bread-hero',
      type: 'image',
      path: '/images/recipes/banana-bread-card-v1.webp',
      usage: ['hero'],
      alt: {
        en: 'Gluten-free banana bread with walnuts and raisins, sliced on a warm neutral surface',
        es: 'Pan de plátano sin gluten con nueces y pasas, cortado sobre una superficie neutra cálida',
        uk: 'Безглютеновий банановий хліб із горіхами та родзинками, нарізаний на теплому нейтральному тлі',
      },
    },
    {
      id: 'butter-and-sugar',
      type: 'image',
      path: '/media/recipes/banana-bread/selected/step-02-butter-sugar-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Pale fluffy butter and sugar mixture in a bowl',
        es: 'Mezcla clara y esponjosa de mantequilla y azúcar en un bol',
        uk: 'Світла пишна маса з масла й цукру в мисці',
      },
    },
    {
      id: 'mashed-bananas',
      type: 'image',
      path: '/media/recipes/banana-bread/selected/step-03-mashed-bananas-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Mashed bananas with small soft pieces',
        es: 'Plátanos machacados con pequeños trozos blandos',
        uk: 'Розім’яті банани з невеликими м’якими шматочками',
      },
    },
    {
      id: 'batter-in-tin',
      type: 'image',
      path: '/media/recipes/banana-bread/selected/step-05-batter-in-tin-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Banana batter with walnuts and raisins in a parchment-lined tin',
        es: 'Masa de plátano con nueces y pasas en un molde forrado con papel',
        uk: 'Бананове тісто з горіхами й родзинками у формі, вистеленій пергаментом',
      },
    },
    {
      id: 'doneness-skewer',
      type: 'image',
      path: '/media/recipes/banana-bread/selected/step-06-doneness-skewer-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Golden banana loaf with a skewer in the centre',
        es: 'Pan de plátano dorado con una brocheta en el centro',
        uk: 'Рум’яний банановий хліб зі шпажкою в центрі',
      },
    },
    {
      id: 'cooled-sliced-loaf',
      type: 'image',
      path: '/media/recipes/banana-bread/selected/step-07-cooled-sliced-loaf-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Cooled banana bread with a cut slice showing walnuts and raisins',
        es: 'Pan de plátano frío con una rebanada que muestra nueces y pasas',
        uk: 'Остиглий банановий хліб із відрізаною скибкою, горіхами й родзинками у м’якуші',
      },
    },
  ],
  relatedRecipeIds: [],
  sources: [
    {
      id: 'banana-bread-recorded-source',
      file: 'docs/reference/recipe-inventory.xlsx',
      locator:
        'Recipe Archive · Банановий хліб; author-reviewed timing and method',
    },
  ],
  contentGaps: [],
  presentation: 'concise',
  evidenceExplanation: {
    en: 'This version has been baked successfully.',
    es: 'Esta versión se ha horneado con éxito.',
    uk: 'Цю версію успішно випікали.',
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
      uk: ['Безглютеновий банановий хліб'],
      en: ['Gluten-free banana bread'],
      es: ['Pan de plátano sin gluten'],
    },
  },
  discovery: {
    cardTitle: {
      en: 'Banana bread',
      es: 'Pan de plátano',
      uk: 'Банановий хліб',
    },
    category: {
      en: 'Everyday cake',
      es: 'Bizcocho cotidiano',
      uk: 'Кекс на щодень',
    },
    flourSummary: {
      en: 'Schär Mix B Bread',
      es: 'Schär Mix B Bread',
      uk: 'Schär Mix B Bread',
    },
    collectionIds: ['everyday'],
    catalogue: true,
    imageKind: 'generated-preview',
    sourceTitle: 'Банановий хліб',
    launchPriority: 'Medium',
    heroCandidate: 'Possible',
    source: 'Handwritten notebook page, IMG_1272.jpeg',
    archiveSections: [
      {
        title: 'Ingredients · original notes',
        content:
          '3 дуже спілих банана\n1/2 чашки масла кімнатної температури\n3/4 чашки цукру\n2 великих яйця\n1,5 чашки борошна\n1 ч. л. розпушувача\n1/2 ч. л. солі\n1/2 ч. л. ванілі\n1 чашка горіхів\n1 чашка ізюму',
      },
    ],
    needsBeforePublishing:
      'Record difficulty and timing; add the preparation method; approve or replace the generated photo.',
  },
  translationReview: {
    date: '2026-11-01',
    reviewer: 'implementation',
    scope:
      'ID-aligned transfer and semantic comparison of existing UK/EN/ES recipe text; not separate author approval',
  },
  seo: {
    uk: {
      title: 'Безглютеновий банановий хліб',
      description:
        'Безглютеновий банановий хліб із волоськими горіхами й родзинками. Інгредієнти, пропорції та покрокове приготування домашньої випічки.',
    },
    en: {
      title: 'Gluten-free banana bread',
      description:
        'Gluten-free banana bread with walnuts and raisins. Ingredient quantities and step-by-step instructions for a homemade banana loaf.',
    },
    es: {
      title: 'Pan de plátano sin gluten',
      description:
        'Pan de plátano sin gluten con nueces y pasas. Ingredientes, cantidades y preparación paso a paso de este bizcocho casero.',
    },
  },
  routeSlug: 'banana-bread',
} satisfies Recipe;
