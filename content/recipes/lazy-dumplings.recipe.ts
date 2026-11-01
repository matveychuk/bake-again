import type { Recipe } from './recipe.types.ts';

export const lazyDumplingsRecipe = {
  schemaVersion: 3,
  id: 'lazy-dumplings',
  versionId: 'lazy-dumplings-source-v3',
  publicationStatus: 'published',
  translationState: {
    uk: 'reviewed',
    en: 'reviewed',
    es: 'reviewed',
  },
  slug: {
    en: 'lazy-dumplings',
    es: 'lazy-dumplings',
    uk: 'lazy-dumplings',
  },
  title: {
    en: 'Gluten-free lazy curd cheese dumplings',
    es: 'Váreniki de tvorog sin gluten',
    uk: 'Безглютенові ліниві вареники',
  },
  summary: {
    en: 'Tender curd cheese dumplings.',
    es: 'Tiernos váreniki sin relleno, hechos con tvorog.',
    uk: 'Ніжні вареники з кисломолочного сиру.',
  },
  categoryIds: [],
  situationIds: [],
  difficulty: 'medium',
  baseProvenance: {
    state: 'tested',
    sourceIds: ['lazy-dumplings-recorded-source'],
  },
  timing: {
    activeMinutes: 45,
    totalElapsedMinutes: null,
    planningNote: {
      text: {
        en: 'Allow an additional {duration} for the dough to rest.',
        es: 'Añade {duration} de reposo de la masa.',
        uk: 'Додатково {duration} на відпочинок тіста.',
      },
      phaseId: 'dough-rest',
    },
    phases: [
      {
        id: 'dough-rest',
        label: {
          en: 'Dough rest',
          es: 'Reposo de la masa',
          uk: 'Відпочинок тіста',
        },
        duration: {
          kind: 'range',
          min: 15,
          max: 20,
          unit: 'minute',
        },
        relatedStepId: 'rest',
      },
    ],
  },
  yield: {
    default: {
      id: 'hundred-dumplings',
      label: {
        en: '100 lazy dumplings',
        es: '100 váreniki de tvorog',
        uk: '100 лінивих вареників',
      },
      count: {
        kind: 'exact',
        value: 100,
      },
      unit: 'dumpling',
      provenance: {
        state: 'tested',
        sourceIds: ['lazy-dumplings-recorded-source'],
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
      geometryId: 'lazy-dumplings-base',
      yieldId: 'hundred-dumplings',
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
      id: 'fork',
      name: {
        en: 'fork',
        es: 'tenedor',
        uk: 'виделка',
      },
    },
    {
      id: 'skimmer',
      name: {
        en: 'skimmer',
        es: 'espumadera',
        uk: 'шумівка',
      },
    },
  ],
  flourConfiguration: {
    commercialMixLineId: 'flour',
    additionalStarchLineIds: ['tapioca'],
    provenance: {
      state: 'tested',
      sourceIds: ['lazy-dumplings-recorded-source'],
    },
    testedAlternativeMixes: [],
    knownUnsupportedMixes: [],
    basis: 'commercialMix',
  },
  beforeStart: [],
  ingredientSections: [
    {
      id: 'dumplings',
      title: {
        en: 'Dumplings',
        es: 'Váreniki de tvorog',
        uk: 'Ліниві вареники',
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
              value: 500,
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
          qualifier: {
            en: 'Plus a little for shaping.',
            es: 'Y un poco más para dar forma.',
            uk: 'Плюс трохи для формування.',
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
              value: 10,
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
      ],
    },
  ],
  steps: [
    {
      id: 'mix-wet',
      title: {
        en: 'Mix the base',
        es: 'Mezcla la base',
        uk: 'Змішайте основу',
      },
      instruction: {
        en: 'Mix the tvorog, eggs and sugar with a fork or in a food processor fitted with a dough attachment.',
        es: 'Mezcla el tvorog, los huevos y el azúcar con un tenedor o en un robot de cocina con accesorio para amasar.',
        uk: 'Перемішайте кисломолочний сир, яйця й цукор виделкою або в комбайні насадкою-тістомісом.',
      },
      ingredientLineIds: ['cottage-cheese', 'eggs', 'sugar'],
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
            ingredientId: 'sugar',
          },
        ],
      },
      mediaIds: ['mix-cottage-cheese'],
      equipmentIds: ['fork'],
    },
    {
      id: 'add-dry',
      title: {
        en: 'Add the flour and starch',
        es: 'Añade la harina y el almidón',
        uk: 'Додайте борошно й крохмаль',
      },
      instruction: {
        en: 'Combine the flour and tapioca starch and mix into the base. The dough should stay sticky — do not add extra flour to firm it up.',
        es: 'Combina la harina con el almidón de tapioca e incorpóralos a la base. La masa debe quedar pegajosa; no añadas más harina para endurecerla.',
        uk: 'З’єднайте борошно з тапіоковим крохмалем і вмішайте в основу. Тісто має залишитися липким — не ущільнюйте його додатковим борошном.',
      },
      ingredientLineIds: ['flour', 'tapioca'],
      guidance: [],
      cook: {
        ingredients: [
          {
            ingredientId: 'flour',
          },
          {
            ingredientId: 'tapioca',
          },
        ],
      },
      mediaIds: ['add-flour-tapioca'],
    },
    {
      id: 'rest',
      title: {
        en: 'Rest the dough',
        es: 'Deja reposar la masa',
        uk: 'Дайте тісту відпочити',
      },
      instruction: {
        en: 'Cover the bowl loosely and leave for 15–20 minutes.',
        es: 'Cubre el bol sin apretar y deja reposar durante 15–20 minutos.',
        uk: 'Нещільно накрийте миску й залиште на 15–20 хвилин.',
      },
      ingredientLineIds: [],
      guidance: [],
      equipmentIds: ['bowl'],
      durationPhaseId: 'dough-rest',
    },
    {
      id: 'shape-log',
      title: {
        en: 'Shape a log',
        es: 'Forma un cilindro',
        uk: 'Сформуйте ковбаску',
      },
      instruction: {
        en: 'Dust the surface and dough with flour. Gently roll into a log without kneading the dusting flour into the dough.',
        es: 'Enharina la superficie y la masa. Forma un cilindro con cuidado, sin amasar la harina de espolvorear dentro de la masa.',
        uk: 'Присипте поверхню й тісто борошном. Обережно розкачайте в ковбаску, не вмішуючи борошно всередину.',
      },
      ingredientLineIds: ['flour'],
      guidance: [],
      cook: {
        ingredients: [
          {
            ingredientId: 'flour',
            quantity: 'omit',
            note: {
              en: 'For dusting.',
              es: 'Para espolvorear.',
              uk: 'Для присипання.',
            },
          },
        ],
      },
      mediaIds: ['shape-dough-log'],
    },
    {
      id: 'shape-dumplings',
      title: {
        en: 'Roll the dumplings',
        es: 'Forma las bolitas',
        uk: 'Скачайте вареники',
      },
      instruction: {
        en: 'Cut into small pieces. Coat the cut sides in flour and gently roll each piece between your palms into a ball.',
        es: 'Corta en trozos pequeños. Cubre los cortes con harina y haz rodar suavemente cada trozo entre las palmas para formar una bolita.',
        uk: 'Наріжте тісто на невеликі шматочки. Обваляйте зрізи в борошні й легко скачайте кожен шматочок між долонями в кульку.',
      },
      ingredientLineIds: ['flour'],
      guidance: [
        {
          id: 'shape-dumplings-tip',
          kind: 'practicalTip',
          text: {
            en: 'To freeze, arrange uncooked dumplings separately on a tray. Once frozen, transfer to a zip bag and return to the freezer.',
            es: 'Para congelarlos, coloca los váreniki crudos separados en una bandeja. Una vez congelados, pásalos a una bolsa con cierre y devuélvelos al congelador.',
            uk: 'Для заморожування розкладіть сирі вареники окремо один від одного на таці. Коли замерзнуть, перекладіть у zip-пакет і поверніть до морозилки.',
          },
        },
      ],
      cook: {
        ingredients: [
          {
            ingredientId: 'flour',
            quantity: 'omit',
            note: {
              en: 'For dusting.',
              es: 'Para espolvorear.',
              uk: 'Для присипання.',
            },
          },
        ],
      },
      mediaIds: ['shape-round-dumplings'],
    },
    {
      id: 'cook-dumplings',
      title: {
        en: 'Boil the dumplings',
        es: 'Cuece los váreniki',
        uk: 'Зваріть вареники',
      },
      instruction: {
        en: 'Add the dumplings to boiling water in small batches. Gently run a skimmer over the bottom so they do not stick. Cook until the dumplings float to the surface, then lift out with a skimmer. Cook frozen dumplings the same way: add directly to boiling water without thawing.',
        es: 'Añade los váreniki al agua hirviendo en tandas pequeñas. Pasa suavemente una espumadera por el fondo para que no se peguen. Cuece hasta que los váreniki suban a la superficie y retíralos con una espumadera. Cocina los congelados del mismo modo: directamente en agua hirviendo, sin descongelar.',
        uk: 'Опускайте вареники в киплячу воду невеликими порціями. Обережно проведіть шумівкою по дну, щоб вони не прилипли. Варіть до спливання на поверхню, потім дістаньте шумівкою. Так само готуйте заморожені вареники: опускайте в окріп без розморожування.',
      },
      ingredientLineIds: [],
      guidance: [],
      cook: {
        instructions: [
          {
            id: 'cook-dumplings-cook-1',
            text: {
              en: 'Add the dumplings to boiling water in small batches. Gently run a skimmer over the bottom so they do not stick.',
              es: 'Añade los váreniki al agua hirviendo en tandas pequeñas. Pasa suavemente una espumadera por el fondo para que no se peguen.',
              uk: 'Опускайте вареники в киплячу воду невеликими порціями. Обережно проведіть шумівкою по дну, щоб вони не прилипли.',
            },
          },
          {
            id: 'cook-dumplings-cook-2',
            text: {
              en: 'Cook until the dumplings float to the surface, then lift out with a skimmer. Cook frozen dumplings the same way: add directly to boiling water without thawing.',
              es: 'Cuece hasta que los váreniki suban a la superficie y retíralos con una espumadera. Cocina los congelados del mismo modo: directamente en agua hirviendo, sin descongelar.',
              uk: 'Варіть до спливання на поверхню, потім дістаньте шумівкою. Так само готуйте заморожені вареники: опускайте в окріп без розморожування.',
            },
          },
        ],
      },
      mediaIds: ['boil-round-dumplings'],
      equipmentIds: ['skimmer'],
    },
  ],
  storage: {
    en: 'To freeze, arrange uncooked dumplings separately on a tray. Once frozen, transfer to a zip bag and return to the freezer.',
    es: 'Para congelarlos, coloca los váreniki crudos separados en una bandeja. Una vez congelados, pásalos a una bolsa con cierre y devuélvelos al congelador.',
    uk: 'Для заморожування розкладіть сирі вареники окремо один від одного на таці. Коли замерзнуть, перекладіть у zip-пакет і поверніть до морозилки.',
  },
  makeAhead: {
    en: 'To freeze, arrange uncooked dumplings separately on a tray. Once frozen, transfer to a zip bag and return to the freezer.',
    es: 'Para congelarlos, coloca los váreniki crudos separados en una bandeja. Una vez congelados, pásalos a una bolsa con cierre y devuélvelos al congelador.',
    uk: 'Для заморожування розкладіть сирі вареники окремо один від одного на таці. Коли замерзнуть, перекладіть у zip-пакет і поверніть до морозилки.',
  },
  variations: [],
  heroMediaId: 'lazy-dumplings-hero',
  media: [
    {
      id: 'lazy-dumplings-hero',
      type: 'image',
      path: '/images/recipes/lazy-dumplings-card-v1.webp',
      usage: ['hero'],
      alt: {
        en: 'Ukrainian lazy curd cheese dumplings with sour cream and butter',
        es: 'Váreniki ucranianos de tvorog con nata agria y mantequilla',
        uk: 'Ліниві вареники з кисломолочного сиру зі сметаною та маслом',
      },
    },
    {
      id: 'mix-cottage-cheese',
      type: 'image',
      path: '/media/recipes/lazy-dumplings/selected/step-01-mix-cottage-cheese-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Tvorog curd cheese, eggs and sugar in a food processor bowl',
        es: 'Tvorog, huevos y azúcar en el bol de un robot de cocina',
        uk: 'Кисломолочний сир, яйця й цукор у мисці комбайна',
      },
    },
    {
      id: 'add-flour-tapioca',
      type: 'image',
      path: '/media/recipes/lazy-dumplings/selected/step-02-add-flour-tapioca-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Flour and tapioca starch in sticky cottage-cheese dough',
        es: 'Harina y almidón de tapioca en una masa pegajosa de tvorog',
        uk: 'Борошно й тапіоковий крохмаль у липкому тісті',
      },
    },
    {
      id: 'shape-dough-log',
      type: 'image',
      path: '/media/recipes/lazy-dumplings/selected/step-04-shape-log-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Hands shaping a dough log on a floured surface',
        es: 'Manos formando un cilindro de masa sobre una superficie enharinada',
        uk: 'Руки формують ковбаску з тіста на присипаній борошном поверхні',
      },
    },
    {
      id: 'shape-round-dumplings',
      type: 'image',
      path: '/media/recipes/lazy-dumplings/selected/step-05-shape-dumplings-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Round dumplings and cut dough on a floured surface',
        es: 'Bolitas y masa cortada sobre una superficie enharinada',
        uk: 'Кульки вареників і нарізане тісто на присипаній борошном поверхні',
      },
    },
    {
      id: 'boil-round-dumplings',
      type: 'image',
      path: '/media/recipes/lazy-dumplings/selected/step-06-boil-dumplings-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Dumplings floating in water with one on a skimmer',
        es: 'Ñoquis flotando en agua, con uno sobre una espumadera',
        uk: 'Вареники сплили у воді, один вареник на шумівці',
      },
    },
    {
      id: 'lazy-dumplings-card',
      type: 'image',
      path: '/images/recipes/lazy-dumplings-real-plate-linen-v1.webp',
      usage: ['card'],
      alt: {
        uk: 'Справжні ліниві вареники на бежевій тарілці та лляній серветці',
        en: 'Real lazy cottage-cheese dumplings on a beige plate and linen napkin',
        es: 'Ñoquis de queso reales en un plato beige sobre una servilleta de lino',
      },
    },
  ],
  relatedRecipeIds: [],
  sources: [
    {
      id: 'lazy-dumplings-recorded-source',
      file: 'docs/reference/lazy-dumplings-author-correction-2026-10-12.uk.md',
      locator:
        'Author correction 2026-10-12 · 500 g curd, 2 eggs, 100 g flour, 10 g tapioca (1 tbsp), 60 g sugar; method confirmed 2026-10-14: Schär Mix B Bread, rest 15–20 minutes, cook fresh/frozen until floating, freeze raw on trays then bag',
    },
  ],
  contentGaps: [],
  presentation: 'concise',
  evidenceExplanation: {
    en: 'Author-corrected quantities for the successfully cooked batch filmed on 11 October 2026.',
    es: 'Cantidades corregidas por la autora para la tanda preparada con éxito y grabada el 11 de octubre de 2026.',
    uk: 'Авторські пропорції уточнено за успішно приготовленою партією зі зйомки 11.10.2026.',
  },
  searchMetadata: {
    datePublished: null,
    dateModified: '2026-10-18',
    dateModifiedVersionId: 'lazy-dumplings-source-v3',
    cookTimeMinutes: null,
    recipeCuisine: {
      uk: 'Українська кухня',
      en: 'Ukrainian',
      es: 'Ucraniana',
    },
    keywords: {
      uk: ['Безглютенові ліниві вареники'],
      en: ['Gluten-free lazy curd cheese dumplings'],
      es: ['Váreniki de tvorog sin gluten'],
    },
  },
  discovery: {
    cardTitle: {
      en: 'Lazy curd cheese dumplings',
      es: 'Váreniki de tvorog sin relleno',
      uk: 'Ліниві вареники',
    },
    category: {
      en: 'Breakfast / everyday',
      es: 'Desayuno / diario',
      uk: 'Сніданок / на щодень',
    },
    flourSummary: {
      en: 'Schär Mix B Bread + tapioca starch',
      es: 'Schär Mix B Bread + almidón de tapioca',
      uk: 'Schär Mix B Bread + тапіоковий крохмаль',
    },
    collectionIds: ['breakfast', 'everyday', 'cottage-cheese'],
    catalogue: true,
    imageKind: 'generated-preview',
    sourceTitle: 'Ліниві вареники',
    launchPriority: 'Medium',
    heroCandidate: 'No',
    source:
      'Handwritten notebook page, IMG_1277.jpeg; author-corrected quantities on 2026-10-12 for the batch filmed on 2026-10-11; prior author-reviewed method',
    archiveSections: [
      {
        title: 'Ingredients · original notes',
        content:
          '2 пачки творогу\n2 яйця\n3 ст. л. цукру\n90 г борошна\n7 г тапіоки або кукурудзяного крохмалю',
      },
      {
        title: 'Method · original notes',
        content:
          'Творог, яйця й цукор перемішати. Борошно і крохмаль перемішати та додати в творог. Вимішати й дати постояти 15–30 хв.\n\nВаріант на 7 пачок: 7 яєць, 10 ст. л. цукру, 300 г борошна, 25 г тапіоки.',
      },
      {
        title: 'Ingredients · author correction · 2026-10-12',
        content:
          '500 г кисломолочного сиру\n2 яйця\n100 г Schär Mix B Bread (≈ 5 ст. л. за таблицею; назву суміші для знятої партії ще уточнюємо)\n10 г тапіоки (1 ст. л. — авторська мірка тільки цього рецепта)\n60 г цукру (≈ 3 ст. л. за таблицею)\n\nПопередні нотатки збережені як архів, не як актуальна рецептура.',
      },
    ],
    needsBeforePublishing:
      'Record yield, difficulty and total timing; approve or replace the generated photo.',
  },
  cardMediaId: 'lazy-dumplings-card',
  translationReview: {
    date: '2026-11-01',
    reviewer: 'implementation',
    scope:
      'ID-aligned transfer and semantic comparison of existing UK/EN/ES recipe text; not separate author approval',
  },
  seo: {
    uk: {
      title: 'Безглютенові ліниві вареники',
      description:
        'Безглютенові ліниві вареники з кисломолочного сиру. Пропорції інгредієнтів, формування та варіння крок за кроком.',
    },
    en: {
      title: 'Gluten-free lazy curd cheese dumplings',
      description:
        'Gluten-free lazy dumplings made with tvorog curd cheese. Ingredient quantities and step-by-step instructions for shaping and boiling.',
    },
    es: {
      title: 'Váreniki de tvorog sin gluten',
      description:
        'Váreniki sin relleno y sin gluten, hechos con tvorog, un queso fresco de leche fermentada. Cantidades, formado y cocción paso a paso.',
    },
  },
  routeSlug: 'lazy-dumplings',
} satisfies Recipe;
