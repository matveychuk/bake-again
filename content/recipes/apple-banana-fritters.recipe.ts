import type { Recipe } from './recipe.types.ts';

export const appleBananaFrittersRecipe = {
  schemaVersion: 3,
  id: 'apple-banana-fritters',
  versionId: 'apple-banana-fritters-source-v1',
  publicationStatus: 'unpublished',
  translationState: {
    uk: 'reviewed',
    en: 'reviewed',
    es: 'reviewed',
  },
  slug: {
    en: 'apple-banana-fritters',
    es: 'apple-banana-fritters',
    uk: 'apple-banana-fritters',
  },
  title: {
    en: 'Gluten-free apple-banana fritters',
    es: 'Tortitas de manzana y plátano sin gluten',
    uk: 'Безглютенові яблучно-бананові оладки',
  },
  summary: {
    en: 'A suggested apple-fritter adaptation sweetened with ripe banana.',
    es: 'Una adaptación sugerida de las tortitas de manzana, endulzada con plátano maduro.',
    uk: 'Запропонована версія яблучних оладок, підсолоджена стиглим бананом.',
  },
  categoryIds: [],
  situationIds: [],
  difficulty: null,
  baseProvenance: {
    state: 'suggested',
    sourceIds: ['apple-banana-fritters-recorded-source'],
  },
  timing: {
    activeMinutes: null,
    totalElapsedMinutes: null,
    planningNote: null,
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
      id: 'apple-banana-fritters-yield',
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
        sourceIds: ['apple-banana-fritters-recorded-source'],
      },
      availability: 'default',
    },
    alternatives: [],
  },
  geometry: {
    state: 'known',
    default: {
      id: 'apple-banana-fritters-base',
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
        state: 'suggested',
        sourceIds: ['apple-banana-fritters-recorded-source'],
      },
    },
    alternatives: [],
  },
  configuration: {
    base: {
      geometryId: 'apple-banana-fritters-base',
      yieldId: 'apple-banana-fritters-yield',
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
      id: 'whisk',
      name: {
        en: 'whisk',
        es: 'varillas',
        uk: 'вінчик',
      },
    },
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
      state: 'suggested',
      sourceIds: ['apple-banana-fritters-recorded-source'],
    },
    testedAlternativeMixes: [],
    knownUnsupportedMixes: [],
    basis: 'commercialMix',
  },
  beforeStart: [
    {
      id: 'before-0',
      text: {
        en: 'Use a very ripe, soft banana so it mashes smoothly and sweetens the batter.',
        es: 'Usa un plátano muy maduro y blando: se machaca fácilmente y endulza la masa.',
        uk: 'Візьміть дуже стиглий м’який банан: він легко розімнеться й підсолодить тісто.',
      },
    },
    {
      id: 'before-1',
      text: {
        en: 'The banana adds moisture: use the batter cue rather than assuming the base recipe will behave identically.',
        es: 'El plátano aporta humedad. Guíate por la consistencia de la masa: puede comportarse de forma distinta a la receta base.',
        uk: 'Банан додає вологи, тому орієнтуйтеся на консистенцію тіста, а не очікуйте, що воно поводитиметься точно як базовий рецепт.',
      },
    },
    {
      id: 'before-2',
      text: {
        en: 'Keep the pan at medium heat and have a lid ready.',
        es: 'Cocina a fuego medio y ten preparada una tapa.',
        uk: 'Тримайте пательню на середньому вогні та підготуйте кришку.',
      },
    },
  ],
  ingredientSections: [
    {
      id: 'batter',
      title: {
        en: 'Apple-banana fritter batter',
        es: 'Masa de las tortitas de manzana y plátano',
        uk: 'Тісто для яблучно-бананових оладок',
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
              value: 2,
              unit: 'piece',
            },
            shopping: {
              mode: 'base',
              increment: 1,
              rounding: 'up',
            },
          },
          qualifier: {
            en: 'Peel and grate on a medium grater.',
            es: 'Pela y ralla por el lado mediano del rallador.',
            uk: 'Очистьте та натріть на середній тертці.',
          },
        },
        {
          id: 'banana',
          options: [
            {
              ingredientId: 'banana',
              name: {
                en: 'Small very ripe banana',
                es: 'Plátano pequeño muy maduro',
                uk: 'Невеликий дуже стиглий банан',
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
            en: 'Mash until mostly smooth.',
            es: 'Machaca hasta obtener un puré casi liso.',
            uk: 'Розімніть майже до однорідності.',
          },
        },
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
              value: 160,
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
              value: 140,
              unit: 'g',
            },
            equivalent: {
              kind: 'exact',
              value: 7,
              unit: 'tbsp',
            },
            shopping: {
              mode: 'base',
            },
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
      id: 'prepare-fruit',
      title: {
        en: 'Prepare the apples and banana',
        es: 'Prepara la manzana y el plátano',
        uk: 'Підготуйте яблука й банан',
      },
      instruction: {
        en: 'Wash and peel the apples, then grate them on a medium grater. In a separate bowl, mash the banana until mostly smooth.',
        es: 'Lava y pela las manzanas y rállalas por el lado mediano del rallador. En otro bol, machaca el plátano hasta obtener un puré casi liso.',
        uk: 'Помийте й очистьте яблука, потім натріть їх на середній тертці. В окремій мисці розімніть банан майже до однорідності.',
      },
      ingredientLineIds: ['apples', 'banana'],
      guidance: [
        {
          id: 'prepare-fruit-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The apples are in short, fine shreds and the banana is a thick mash with no firm pieces.',
            es: 'La manzana queda en hebras cortas y finas y el plátano forma un puré espeso, sin trozos duros.',
            uk: 'Яблука натерті короткою дрібною стружкою, а банан перетворився на густе пюре без твердих шматків.',
          },
        },
        {
          id: 'prepare-fruit-tip',
          kind: 'practicalTip',
          text: {
            en: 'Mash the banana just before mixing so it stays pale and disperses easily.',
            es: 'Machaca el plátano justo antes de mezclar para que no se oscurezca y se reparta fácilmente por la masa.',
            uk: 'Розімніть банан безпосередньо перед замішуванням, щоб він не встиг потемніти й легко розподілився в тісті.',
          },
        },
      ],
      cook: {
        ingredients: [
          {
            ingredientId: 'apples',
          },
          {
            ingredientId: 'banana',
          },
        ],
      },
      equipmentIds: ['bowl', 'grater'],
    },
    {
      id: 'mix-wet',
      title: {
        en: 'Whisk the wet base',
        es: 'Mezcla los ingredientes líquidos',
        uk: 'Змішайте рідку основу',
      },
      instruction: {
        en: 'In a separate bowl, whisk the egg with the kefir or yoghurt. Whisk in the mashed banana until evenly combined.',
        es: 'Bate el huevo con el kéfir o yogur en otro bol. Añade el plátano machacado y mezcla hasta integrar.',
        uk: 'В окремій мисці збийте вінчиком яйце з кефіром або йогуртом. Додайте розім’ятий банан і перемішайте до рівномірного поєднання.',
      },
      ingredientLineIds: ['egg', 'kefir-or-yogurt', 'banana'],
      guidance: [
        {
          id: 'mix-wet-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The wet mixture is creamy and evenly flecked with banana, without large lumps.',
            es: 'La mezcla queda cremosa, con el plátano bien repartido y sin grumos grandes.',
            uk: 'Рідка суміш кремова, із рівномірними вкрапленнями банана й без великих грудочок.',
          },
        },
      ],
      cook: {
        ingredients: [
          {
            ingredientId: 'egg',
          },
          {
            ingredientId: 'kefir-or-yogurt',
          },
          {
            ingredientId: 'banana',
            quantity: 'omit',
          },
        ],
      },
      equipmentIds: ['bowl', 'whisk'],
    },
    {
      id: 'add-apples',
      title: {
        en: 'Add the grated apples',
        es: 'Añade la manzana rallada',
        uk: 'Додайте натерті яблука',
      },
      instruction: {
        en: 'Fold the grated apples into the wet mixture until evenly distributed.',
        es: 'Incorpora la manzana rallada a la mezcla líquida y repártela bien.',
        uk: 'Вмішайте натерті яблука в рідку суміш, щоб вони розподілилися рівномірно.',
      },
      ingredientLineIds: ['apples'],
      guidance: [],
      cook: {
        ingredients: [
          {
            ingredientId: 'apples',
            quantity: 'omit',
          },
        ],
      },
    },
    {
      id: 'finish-batter',
      title: {
        en: 'Finish the batter',
        es: 'Mezcla la masa',
        uk: 'Замішайте тісто',
      },
      instruction: {
        en: 'Add the Schär Mix B Bread flour and bicarbonate of soda. Whisk thoroughly until the batter is uniform and as thick as sour cream.',
        es: 'Añade la harina Schär Mix B Bread y el bicarbonato. Mezcla bien con unas varillas hasta obtener una masa lisa, con la consistencia de una nata agria espesa.',
        uk: 'Додайте борошно Schär Mix B Bread і соду. Ретельно перемішайте вінчиком до однорідної консистенції густої сметани.',
      },
      ingredientLineIds: ['flour', 'baking-soda'],
      guidance: [
        {
          id: 'finish-batter-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The batter holds a small mound on the spoon, then falls slowly rather than running.',
            es: 'La masa forma un pequeño montículo en la cuchara y se desliza lentamente, sin gotear.',
            uk: 'Тісто тримається на ложці невеликою гіркою, а потім повільно сповзає, а не стікає.',
          },
        },
        {
          id: 'finish-batter-tip',
          kind: 'practicalTip',
          text: {
            en: 'Because banana moisture varies, do not add extra liquid if the batter is already looser than this cue; record the result for the bake test.',
            es: 'La humedad del plátano puede variar. Si la masa ya está más líquida de lo indicado, no añadas más líquido y anota el resultado de la prueba.',
            uk: 'Вологість банана може відрізнятися. Якщо тісто вже рідше за цей орієнтир, не додавайте більше рідини й запишіть результат для тестування.',
          },
        },
      ],
      cook: {
        ingredients: [
          {
            ingredientId: 'flour',
          },
          {
            ingredientId: 'baking-soda',
          },
        ],
      },
      equipmentIds: ['whisk'],
    },
    {
      id: 'heat-pan',
      title: {
        en: 'Heat the pan',
        es: 'Calienta la sartén',
        uk: 'Розігрійте пательню',
      },
      instruction: {
        en: 'Heat a small amount of oil in a frying pan over medium heat.',
        es: 'Calienta una sartén a fuego medio con un poco de aceite.',
        uk: 'Розігрійте на середньому вогні пательню з невеликою кількістю олії.',
      },
      ingredientLineIds: ['oil'],
      guidance: [
        {
          id: 'heat-pan-tip',
          kind: 'practicalTip',
          text: {
            en: 'Keep the oil layer thin; add a little more between batches only when the pan looks dry.',
            es: 'El aceite debe cubrir el fondo con una capa fina. Añade un poco entre tandas solo cuando la sartén se quede seca.',
            uk: 'Олія має лише тонко вкривати дно; додавайте ще трохи між партіями, лише коли пательня стає сухою.',
          },
        },
      ],
      cook: {
        ingredients: [
          {
            ingredientId: 'oil',
          },
        ],
      },
      equipmentIds: ['frying-pan'],
    },
    {
      id: 'portion',
      title: {
        en: 'Portion small fritters',
        es: 'Forma tortitas pequeñas',
        uk: 'Сформуйте невеликі оладки',
      },
      instruction: {
        en: 'Spoon the batter into the pan, shaping small fritters.',
        es: 'Reparte la masa con una cuchara en la sartén, formando tortitas pequeñas.',
        uk: 'Викладайте тісто ложкою на пательню, формуючи невеликі оладки.',
      },
      ingredientLineIds: [],
      guidance: [
        {
          id: 'portion-tip',
          kind: 'practicalTip',
          text: {
            en: 'Keep the fritters small and similar in size so the fruit-rich centres cook through evenly.',
            es: 'Hazlas pequeñas y de tamaño parecido para que el centro con fruta se cocine de manera uniforme.',
            uk: 'Робіть оладки невеликими й однакового розміру, щоб фруктова серединка рівномірно просмажилася.',
          },
        },
      ],
    },
    {
      id: 'fry',
      title: {
        en: 'Fry under a lid and turn',
        es: 'Cocina tapadas y da la vuelta',
        uk: 'Смажте під кришкою та переверніть',
      },
      instruction: {
        en: 'Cover and fry for 2–3 minutes per side, turning once, until both sides are golden.',
        es: 'Tapa y cocina 2–3 minutos por cada lado, dándoles la vuelta una vez, hasta que estén doradas.',
        uk: 'Накрийте кришкою й смажте по 2–3 хвилини з кожного боку, перевернувши один раз, до золотистої скоринки.',
      },
      ingredientLineIds: ['oil'],
      guidance: [
        {
          id: 'fry-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'Turn when the underside is golden and the top has begun to set around the edges; after the second side cooks, the centre should no longer look wet.',
            es: 'Dales la vuelta cuando la base esté dorada y los bordes empiecen a cuajar. Al terminar el segundo lado, el centro no debe quedar crudo.',
            uk: 'Перевертайте, коли низ уже золотистий, а поверхня почала схоплюватися по краях; після другого боку серединка не має виглядати вологою.',
          },
        },
        {
          id: 'fry-tip',
          kind: 'practicalTip',
          text: {
            en: 'Banana browns readily, so lower the heat if the crust darkens before the top begins to set.',
            es: 'El plátano se dora rápido. Baja el fuego si el exterior se oscurece antes de que la superficie empiece a cuajar.',
            uk: 'Банан швидко підрум’янюється, тому зменште вогонь, якщо скоринка темнішає раніше, ніж поверхня починає схоплюватися.',
          },
        },
      ],
      displayMeta: {
        en: '2–3 min per side · medium heat · covered',
        es: '2–3 min por lado · fuego medio · con tapa',
        uk: 'По 2–3 хв з кожного боку · середній вогонь · під кришкою',
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
    },
  ],
  storage: null,
  makeAhead: null,
  variations: [],
  heroMediaId: 'apple-banana-fritters-hero',
  media: [
    {
      id: 'apple-banana-fritters-hero',
      type: 'image',
      path: '/images/recipes/apple-banana-fritters-card-v1.webp',
      usage: ['hero'],
      alt: {
        en: 'Gluten-free apple and banana fritters',
        es: 'Tortitas sin gluten de manzana y plátano',
        uk: 'Безглютенові оладки з яблуком і бананом',
      },
    },
  ],
  relatedRecipeIds: [],
  sources: [
    {
      id: 'apple-banana-fritters-recorded-source',
      file: 'content/recipes/apple-fritters.recipe.ts',
      locator:
        'Suggested adaptation of the tested apple-fritter base: replace the sugar or honey with one ripe banana',
    },
  ],
  contentGaps: [
    {
      id: 'apple-banana-fritters-source-gap',
      area: 'method',
      field: 'steps',
      question:
        'Bake-test the banana substitution before publication. Record whether 160 g kefir or yoghurt still gives the right batter consistency, then record the yield, total cooking time and approximate amount of frying oil.',
      text: {
        en: 'Bake-test the banana substitution before publication. Record whether 160 g kefir or yoghurt still gives the right batter consistency, then record the yield, total cooking time and approximate amount of frying oil.',
        es: 'Antes de publicar, prueba en la sartén la sustitución del azúcar por plátano. Comprueba si los 160 g de kéfir o yogur dan la consistencia adecuada y anota el rendimiento, el tiempo total y la cantidad aproximada de aceite.',
        uk: 'Перед публікацією перевірте заміну цукру бананом на пательні. Запишіть, чи дають 160 г кефіру або йогурту правильну густоту тіста, а також вихід, загальний час приготування та приблизну кількість олії.',
      },
      publicationBlocking: false,
      sourceIds: ['apple-banana-fritters-recorded-source'],
      readerVisible: true,
    },
    {
      id: 'apple-banana-fritters-yield-gap',
      area: 'yield',
      field: 'yield.default',
      question: 'Yield is not recorded.',
      text: {
        en: 'Yield is not recorded.',
        es: 'El rendimiento no está registrado.',
        uk: 'Вихід не записано.',
      },
      publicationBlocking: false,
      sourceIds: ['apple-banana-fritters-recorded-source'],
    },
  ],
  evidenceExplanation: {
    en: 'This version replaces the sugar or honey in the tested apple-fritter base with one ripe banana. The exact adaptation has not yet been pan-tested.',
    es: 'En esta adaptación, el azúcar o la miel de la receta base probada se sustituye por un plátano maduro. Esta versión aún no se ha probado en la sartén.',
    uk: 'У цій адаптації цукор або мед із перевіреної бази замінено одним стиглим бананом. Саме цю версію ще не перевіряли на пательні.',
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
      uk: ['Безглютенові яблучно-бананові оладки'],
      en: ['Gluten-free apple-banana fritters'],
      es: ['Tortitas de manzana y plátano sin gluten'],
    },
  },
  discovery: {
    cardTitle: {
      en: 'Apple-banana fritters',
      es: 'Tortitas de manzana y plátano',
      uk: 'Яблучно-бананові оладки',
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
    publicationNote: {
      en: 'Bake-test the banana substitution and confirm the kefir or yoghurt amount before publication.',
      es: 'Antes de publicar, prueba la sustitución por plátano y confirma la cantidad de kéfir o yogur.',
      uk: 'Перед публікацією перевірте заміну цукру бананом і уточніть кількість кефіру або йогурту.',
    },
    sourceTitle: 'Яблучно-бананові оладки',
    launchPriority: 'Medium',
    heroCandidate: 'No',
    source: 'Adapted from the author-supplied apple-fritter recipe',
    archiveSections: [
      {
        title: 'Adaptation note',
        content:
          'Замінити 1 ст. л. цукру або меду одним невеликим дуже стиглим бананом. Решту інгредієнтів і базовий спосіб приготування залишити без змін.',
      },
    ],
    needsBeforePublishing:
      'Bake-test the banana substitution; confirm whether 160 g kefir or yogurt still gives the right consistency; record yield, total time and frying-oil quantity; approve or replace the generated photo.',
  },
  translationReview: {
    date: '2026-11-01',
    reviewer: 'implementation',
    scope:
      'ID-aligned transfer and semantic comparison of existing UK/EN/ES recipe text; not separate author approval',
  },
  routeSlug: 'apple-banana-fritters',
} satisfies Recipe;
