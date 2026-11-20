import type { Recipe } from './recipe.types.ts';

export const lazyDumplingsRecipe = {
  schemaVersion: 3,
  id: 'lazy-dumplings',
  versionId: 'lazy-dumplings-pdf-v5',
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
    uk: 'Безглютенові ліниві вареники з сиром',
    en: 'Gluten-free cottage cheese dumplings',
    es: 'Ñoquis dulces de queso fresco sin gluten',
  },
  summary: {
    uk: 'У цих лінивих варениках кисломолочний сир замішують просто в тісто. Подавай їх теплими з вершковим маслом. Частину можна заморозити сирими.',
    en: 'These soft, slightly sweet dumplings are called lazy varenyky. The cottage cheese goes straight into the dough. Serve them warm with butter or freeze a batch before boiling.',
    es: 'Estos váreniki perezosos se hacen con tvorog, un queso fresco seco y granuloso que se mezcla directamente con la masa. Sírvelos con mantequilla o congélalos en crudo.',
  },
  categoryIds: [],
  situationIds: [],
  difficulty: 'medium',
  baseProvenance: {
    state: 'tested',
    sourceIds: ['dumplings-approved-pdf-v5'],
  },
  timing: {
    activeMinutes: 45,
    totalElapsedMinutes: 60,
    planningNote: {
      text: {
        en: 'Includes {duration} for the dough to rest.',
        es: 'Incluye {duration} de reposo de la masa.',
        uk: 'З них {duration} — на відпочинок тіста.',
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
        relatedStepId: 'rest-and-roll',
      },
    ],
  },
  yield: {
    default: {
      id: 'base-dumplings',
      label: {
        uk: '≈75 вареників',
        en: '≈75 dumplings',
        es: '≈75 ñoquis',
      },
      count: {
        kind: 'exact',
        value: 75,
      },
      unit: 'dumpling',
      provenance: {
        state: 'tested',
        sourceIds: ['dumplings-approved-pdf-v5'],
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
      geometryId: 'lazy-dumplings-base',
      yieldId: 'base-dumplings',
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
          qualifier: {
            en: 'Look for dry curd cottage cheese, also sold as farmer’s cheese or tvorog. Choose firm, crumbly curds with very little whey.',
            es: 'Busca «tvorog» o «requesón tipo tvorog» en tiendas de Europa del Este. Si ves «queso cottage» o «queso fresco granulado», fíjate en la textura: esta receta lleva un queso seco, con gránulos y muy poco suero.',
            uk: 'Обирай сир із виразними крупинками й мінімумом сироватки.',
          },
          options: [
            {
              ingredientId: 'cottage-cheese',
              name: {
                uk: 'Сухий зернистий кисломолочний сир',
                en: 'Dry curd cottage cheese',
                es: 'Queso fresco de textura granulosa (tvorog)',
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
          id: 'dusting-flour',
          options: [
            {
              ingredientId: 'dusting-flour',
              name: {
                uk: 'Борошно для формування',
                en: 'Flour for shaping',
                es: 'Harina para formar los váreniki',
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
            uk: 'Трохи',
            en: 'A little',
            es: 'Un poco',
          },
        },
        {
          id: 'butter',
          options: [
            {
              ingredientId: 'butter',
              name: {
                uk: 'Вершкове масло для подачі',
                en: 'Butter to serve',
                es: 'Mantequilla para servir',
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
            uk: 'За смаком',
            en: 'To taste',
            es: 'Al gusto',
          },
        },
      ],
    },
  ],
  steps: [
    {
      id: 'mix-dough',
      title: {
        uk: 'Заміси тісто',
        en: 'Mix the dough',
        es: 'Mezcla la masa',
      },
      instruction: {
        uk: 'Виклади сир у миску, додай яйця, борошно, тапіоку й цукор. Перемішай міксером із насадкою-тістомісом або добре розмішай виделкою.',
        en: 'Put the cheese in a bowl and add the eggs, flour mix, tapioca starch and sugar. Mix with a dough hook or stir thoroughly with a fork.',
        es: 'Pon el queso en un bol y añade los huevos, la mezcla de harina, el almidón de tapioca y el azúcar. Mezcla con el gancho de amasar o remueve bien con un tenedor.',
      },
      ingredientLineIds: [
        'cottage-cheese',
        'eggs',
        'flour',
        'tapioca',
        'sugar',
      ],
      mediaIds: ['mix'],
      guidance: [
        {
          id: 'mix-dough-practicalTip',
          kind: 'practicalTip',
          text: {
            uk: 'Рецепт розрахований на сухий зернистий сир. Якщо сир вологий, додай трохи більше борошна.',
            en: 'Use dry, grainy curd cheese. If your cheese is moist, add a little more flour mix.',
            es: 'Usa un queso seco y granuloso. Si está húmedo, añade un poco más de la mezcla de harina.',
          },
        },
        {
          id: 'mix-dough-checkpoint',
          kind: 'checkpoint',
          text: {
            uk: 'М’яка липка маса з видимими крупинками сиру.',
            en: 'The dough is soft and sticky, with visible curds.',
            es: 'La masa queda blanda y pegajosa, con granos de queso visibles.',
          },
        },
      ],
      cook: {
        ingredients: [
          {
            ingredientId: 'cottage-cheese',
          },
          {
            ingredientId: 'eggs',
          },
          {
            ingredientId: 'flour',
          },
          {
            ingredientId: 'tapioca',
          },
          {
            ingredientId: 'sugar',
          },
        ],
      },
    },
    {
      id: 'rest-and-roll',
      title: {
        uk: 'Дай відпочити й розкачай',
        en: 'Rest and roll',
        es: 'Deja reposar y forma un rollo',
      },
      instruction: {
        uk: 'Накрий миску й залиш тісто на 15–20 хв. Потім ложкою виклади порцію на присипану борошном поверхню, присип зверху й легкими рухами долонь розкачай джгутик, не вимішуючи.',
        en: 'Cover the bowl and rest the dough for 15–20 minutes. Spoon a portion onto a floured surface. Dust the top and roll gently under your palms to form a rope, without kneading.',
        es: 'Tapa el bol y deja reposar la masa 15–20 minutos. Pon una porción con una cuchara sobre la superficie enharinada. Espolvorea un poco de harina por encima y forma un cordón con las palmas, sin amasar.',
      },
      ingredientLineIds: ['dusting-flour'],
      mediaIds: ['roll'],
      durationPhaseId: 'dough-rest',
      cook: {
        ingredients: [
          {
            ingredientId: 'dusting-flour',
          },
        ],
      },
    },
    {
      id: 'shape-dumplings',
      title: {
        uk: 'Наріж і сформуй кульки',
        en: 'Cut and shape the dumplings',
        es: 'Corta y forma bolitas',
      },
      instruction: {
        uk: 'Наріж джгутик на шматочки однакового розміру. Обваляй зрізи в борошні й легко скатай кульки. Розклади їх з невеликими проміжками.',
        en: 'Cut the rope into even pieces. Dip the cut sides in flour and gently roll each piece into a ball. Leave a little space between them.',
        es: 'Corta el cordón en trozos iguales. Pasa las caras cortadas por harina y forma bolitas con suavidad. Deja un poco de espacio entre ellas.',
      },
      ingredientLineIds: ['dusting-flour'],
      mediaIds: ['shape'],
      guidance: [
        {
          id: 'shape-dumplings-checkpoint',
          kind: 'checkpoint',
          text: {
            uk: 'Кульки тримають форму й не злипаються між собою.',
            en: 'The balls hold their shape and stay separate.',
            es: 'Las bolitas mantienen la forma y no se pegan entre sí.',
          },
        },
      ],
      cook: {
        ingredients: [
          {
            ingredientId: 'dusting-flour',
          },
        ],
      },
    },
    {
      id: 'cook-dumplings',
      title: {
        uk: 'Звари до спливання',
        en: 'Boil until they float',
        es: 'Cuece hasta que floten',
      },
      instruction: {
        uk: 'Обережно опусти вареники в окріп і відділи від дна легким рухом ложки. Вари, доки спливуть, і дістань шумівкою.',
        en: 'Lower the dumplings into boiling water. Gently loosen them from the bottom with a spoon. Cook until they float, then lift them out with a slotted spoon.',
        es: 'Echa los váreniki con cuidado en agua hirviendo. Despégalos del fondo suavemente con una cuchara. Cuando suban a la superficie, sácalos con una espumadera.',
      },
      ingredientLineIds: [],
      mediaIds: ['boil'],
      guidance: [
        {
          id: 'cook-dumplings-checkpoint',
          kind: 'checkpoint',
          text: {
            uk: 'Вареники спливли та зберігають форму.',
            en: 'The dumplings float and hold their shape.',
            es: 'Los váreniki flotan y conservan la forma.',
          },
        },
      ],
    },
    {
      id: 'serve',
      title: {
        uk: 'Подай з маслом',
        en: 'Serve with butter',
        es: 'Sirve con mantequilla',
      },
      instruction: {
        uk: 'Дай воді стекти й переклади вареники на тарілку з невеликою кількістю вершкового масла.',
        en: 'Let the water drain off and transfer the dumplings to a plate with a little butter.',
        es: 'Deja que escurran y pásalos a un plato con un poco de mantequilla.',
      },
      ingredientLineIds: ['butter'],
      mediaIds: ['serve'],
      cook: {
        ingredients: [
          {
            ingredientId: 'butter',
          },
        ],
      },
    },
    {
      id: 'freeze-raw',
      title: {
        uk: 'Заготуй про запас',
        en: 'Freeze a batch for later',
        es: 'Congela una tanda',
      },
      instruction: {
        uk: 'Розклади сирі вареники на таці окремо один від одного й постав у морозилку. Коли замерзнуть, переклади в zip-пакет.',
        en: 'Space the uncooked dumplings apart on a tray and freeze. Once frozen, transfer them to a resealable freezer bag.',
        es: 'Coloca los váreniki crudos en una bandeja, separados entre sí, y congélalos. Cuando estén congelados, pásalos a una bolsa de congelación con cierre.',
      },
      ingredientLineIds: [],
      mediaIds: ['freeze'],
    },
    {
      id: 'cook-frozen',
      title: {
        uk: 'З морозилки — в окріп',
        en: 'Cook straight from frozen',
        es: 'Del congelador a la olla',
      },
      instruction: {
        uk: 'Опусти потрібну порцію в киплячу воду без розморожування. Обережно перемішай, вари до спливання й дістань шумівкою.',
        en: 'Drop as many frozen dumplings as you need straight into boiling water. Stir gently, cook until they float and lift out with a slotted spoon.',
        es: 'Echa la ración que necesites en agua hirviendo, sin descongelar. Remueve con suavidad y, cuando floten, sácalos con una espumadera.',
      },
      ingredientLineIds: ['butter'],
      mediaIds: ['from-frozen'],
      cook: {
        ingredients: [
          {
            ingredientId: 'butter',
          },
        ],
      },
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
      path: '/images/recipes/lazy-dumplings-white-balance-v2.webp',
      usage: ['hero', 'card'],
      alt: {
        uk: 'Ліниві вареники в мисці, позаду сметана та ягідне варення',
        en: 'Cottage cheese dumplings in a bowl with sour cream and berry jam behind it',
        es: 'Ñoquis de queso en un cuenco, con crema agria y mermelada de frutos rojos al fondo',
      },
    },
    {
      id: 'mix',
      type: 'image',
      usage: ['step'],
      path: '/images/recipes/lazy-dumplings/pdf-v5/mix.webp',
      alt: {
        uk: 'Сирна маса з помітними крупинками в чаші міксера',
        en: 'Dough with visible curds in the mixer bowl',
        es: 'Masa con granos de queso en el bol de la amasadora',
      },
    },
    {
      id: 'roll',
      type: 'image',
      usage: ['step'],
      path: '/images/recipes/lazy-dumplings/pdf-v5/roll.webp',
      alt: {
        uk: 'Джгутик тіста на присипаному борошном килимку',
        en: 'A rope of dough on a floured mat',
        es: 'Un cordón de masa sobre un tapete enharinado',
      },
    },
    {
      id: 'shape',
      type: 'image',
      usage: ['step'],
      path: '/images/recipes/lazy-dumplings/pdf-v5/shape.webp',
      alt: {
        uk: 'Нарізані шматочки тіста й руки на борошняному килимку',
        en: 'Hands shaping pieces of dough on a floured mat',
        es: 'Manos formando bolitas sobre el tapete enharinado',
      },
    },
    {
      id: 'boil',
      type: 'image',
      usage: ['step'],
      path: '/images/recipes/lazy-dumplings/pdf-v5/boil.webp',
      alt: {
        uk: 'Вареники спливають у каструлі',
        en: 'Dumplings floating in the pot',
        es: 'Váreniki flotando en la olla',
      },
    },
    {
      id: 'serve',
      type: 'image',
      usage: ['step'],
      path: '/images/recipes/lazy-dumplings/pdf-v5/serve.webp',
      alt: {
        uk: 'Готові вареники на тарілці',
        en: 'Cooked cheese dumplings on a plate',
        es: 'Váreniki cocidos en un plato',
      },
    },
    {
      id: 'freeze',
      type: 'image',
      usage: ['step'],
      path: '/images/recipes/lazy-dumplings/pdf-v5/freeze.webp',
      alt: {
        uk: 'Сирі вареники розкладено окремо на тацях',
        en: 'Uncooked dumplings spaced apart on trays',
        es: 'Váreniki crudos separados en bandejas',
      },
    },
    {
      id: 'from-frozen',
      type: 'image',
      usage: ['step'],
      path: '/images/recipes/lazy-dumplings/pdf-v5/from-frozen.webp',
      alt: {
        uk: 'Вареники на шумівці над каструлею',
        en: 'Dumplings lifted from the pot with a slotted spoon',
        es: 'Váreniki en una espumadera sobre la olla',
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
    {
      id: 'dumplings-approved-pdf-v5',
      file: 'media/recipes/lazy-dumplings/working/pdf-v5/README.uk.md',
      locator:
        'Approved Ukrainian PDF v5, pp. 1–9: dry grainy curd, about 75 dumplings / 3 servings, seven steps including freezing.',
    },
  ],
  contentGaps: [],
  presentation: 'concise',
  searchMetadata: {
    datePublished: null,
    dateModified: '2026-11-20',
    dateModifiedVersionId: 'lazy-dumplings-pdf-v5',
    cookTimeMinutes: null,
    recipeCuisine: {
      uk: 'Українська кухня',
      en: 'Ukrainian',
      es: 'Ucraniana',
    },
    keywords: {
      uk: [
        'ліниві вареники з сиром',
        'вареники без глютену',
        'вареники з кисломолочного сиру',
      ],
      en: [
        'lazy varenyky',
        'cheese dumplings',
        'dry curd cottage cheese dumplings',
        'gluten-free dumplings',
        'dry-curd cottage cheese',
      ],
      es: [
        'váreniki perezosos',
        'ñoquis de queso sin gluten',
        'ñoquis de queso fresco',
        'tvorog',
      ],
    },
  },
  discovery: {
    cardTitle: {
      en: 'Cottage cheese dumplings',
      es: 'Ñoquis dulces de queso fresco',
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
    imageKind: 'edited-author-photo',
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
    needsBeforePublishing: '',
  },
  cardMediaId: 'lazy-dumplings-hero',
  translationReview: {
    date: '2026-11-19',
    reviewer: 'implementation',
    scope:
      'Aligned all seven steps, ingredient measures and yield with the Ukrainian PDF v5.',
  },
  seo: {
    uk: {
      title: 'Ліниві вареники з сиром без глютену',
      description:
        'Покроковий рецепт лінивих вареників з кисломолочного сиру без глютену. Як замісити тісто, зварити вареники до спливання й заморозити про запас.',
    },
    en: {
      title: 'Gluten-free cottage cheese dumplings',
      description:
        'Make gluten-free cottage cheese dumplings with firm, dry curds. Follow the step-by-step photos for lazy varenyky in one hour, with tips for freezing.',
    },
    es: {
      title: 'Ñoquis dulces de queso fresco sin gluten',
      description:
        'Prepara ñoquis dulces de queso fresco sin gluten en una hora. Sigue las fotos para hacer la masa con tvorog, dar forma a los váreniki y congelarlos en crudo.',
    },
  },
  routeSlug: 'lazy-dumplings',
} satisfies Recipe;
