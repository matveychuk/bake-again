import type { Recipe } from './recipe.types.ts';

// Untranslated locales retain the Ukrainian source until translation is requested.
export const appleCottageCheeseCookiesRecipe = {
  schemaVersion: 3,
  id: 'apple-cottage-cheese-cookies',
  versionId: 'apple-cottage-cheese-cookies-source-v1',
  routeSlug: 'apple-cottage-cheese-cookies',
  publicationStatus: 'unpublished',
  translationState: {
    uk: 'sourceDraft',
    en: 'sourceDraft',
    es: 'sourceDraft',
  },
  slug: {
    uk: 'apple-cottage-cheese-cookies',
    en: 'apple-cottage-cheese-cookies',
    es: 'apple-cottage-cheese-cookies',
  },
  title: {
    uk: 'Яблучно-творожне печиво',
    en: 'Яблучно-творожне печиво',
    es: 'Яблучно-творожне печиво',
  },
  summary: {
    uk: 'Печиво з кисломолочним сиром, шматочками яблук і цукрово-коричною обсипкою. Чернетка для першого випікання.',
    en: 'Печиво з кисломолочним сиром, шматочками яблук і цукрово-коричною обсипкою. Чернетка для першого випікання.',
    es: 'Печиво з кисломолочним сиром, шматочками яблук і цукрово-коричною обсипкою. Чернетка для першого випікання.',
  },
  categoryIds: [],
  situationIds: [],
  difficulty: null,
  baseProvenance: {
    state: 'suggested',
    sourceIds: ['apple-cottage-cheese-cookies-source'],
  },
  evidenceExplanation: {
    uk: 'Структурована чернетка за рецептом Olga Riabenko. Цю версію Bake Again ще не випікав; тип борошна не підтверджено.',
    en: 'Структурована чернетка за рецептом Olga Riabenko. Цю версію Bake Again ще не випікав; тип борошна не підтверджено.',
    es: 'Структурована чернетка за рецептом Olga Riabenko. Цю версію Bake Again ще не випікав; тип борошна не підтверджено.',
  },
  translationReview: {
    date: '2026-11-03',
    reviewer: 'implementation',
    scope:
      'Українська чернетка за скриншотом і повним текстом Саші. EN/ES містять український оригінал як fallback; переклади не створено.',
  },
  discovery: {
    cardTitle: {
      uk: 'Яблучно-творожне печиво',
      en: 'Яблучно-творожне печиво',
      es: 'Яблучно-творожне печиво',
    },
    category: {
      uk: 'Печиво',
      en: 'Печиво',
      es: 'Печиво',
    },
    flourSummary: {
      uk: 'Тип борошна ще не уточнено',
      en: 'Тип борошна ще не уточнено',
      es: 'Тип борошна ще не уточнено',
    },
    collectionIds: ['everyday', 'cottage-cheese'],
    catalogue: true,
    imageKind: 'author-photo',
    publicationNote: {
      uk: 'Чернетка без фото. Перше випікання заплановано на 04.11.2026 зі слів Саші.',
      en: 'Чернетка без фото. Перше випікання заплановано на 04.11.2026 зі слів Саші.',
      es: 'Чернетка без фото. Перше випікання заплановано на 04.11.2026 зі слів Саші.',
    },
    sourceTitle: 'Яблучне печиво — Olga Riabenko',
    launchPriority: 'Чернетка для першого випікання',
    heroCandidate: 'No',
    source:
      'Скриншот, наданий Сашею, і повний текст рецепта в чаті 03.11.2026. Посилання на оригінал не надано.',
    archiveSections: [],
    needsBeforePublishing:
      'Випекти точну версію; записати тип борошна, вихід, обвалювання, режим духовки й фактичний час; додати власні фото.',
  },
  timing: {
    activeMinutes: null,
    totalElapsedMinutes: null,
    phases: [
      {
        id: 'baking',
        label: {
          uk: 'Випікання за джерелом',
          en: 'Випікання за джерелом',
          es: 'Випікання за джерелом',
        },
        duration: {
          kind: 'range',
          min: 45,
          max: 50,
          unit: 'minute',
        },
        relatedStepId: 'bake',
      },
    ],
  },
  yield: {
    default: {
      id: 'cookies-yield',
      label: {
        uk: 'Вихід ще не виміряно',
        en: 'Вихід ще не виміряно',
        es: 'Вихід ще не виміряно',
      },
      count: {
        kind: 'unknown',
      },
      unit: null,
      provenance: {
        state: 'missing',
        sourceIds: ['apple-cottage-cheese-cookies-source'],
      },
      availability: 'default',
    },
    alternatives: [],
  },
  geometry: {
    state: 'known',
    default: {
      id: 'tray',
      label: {
        uk: 'Деко; розмір ще не уточнено',
        en: 'Деко; розмір ще не уточнено',
        es: 'Деко; розмір ще не уточнено',
      },
      kind: 'tray',
      application: 'portion-on',
      shape: 'rectangular',
      diameterCm: null,
      layerCount: null,
      material: null,
      provenance: {
        state: 'suggested',
        sourceIds: ['apple-cottage-cheese-cookies-source'],
      },
      availability: 'default',
    },
    alternatives: [],
  },
  configuration: {
    base: {
      geometryId: 'tray',
      yieldId: 'cookies-yield',
      batchScale: 1,
    },
    geometryAdjustment: null,
    quantityAdjustment: {
      batchScale: null,
      useWhatIHave: null,
    },
    ingredientScaling: {
      default: {
        kind: 'fixed',
      },
    },
  },
  equipment: [
    {
      id: 'oven',
      name: {
        uk: 'Духовка',
        en: 'Духовка',
        es: 'Духовка',
      },
    },
    {
      id: 'tray',
      name: {
        uk: 'Деко',
        en: 'Деко',
        es: 'Деко',
      },
    },
    {
      id: 'parchment',
      name: {
        uk: 'Пергамент',
        en: 'Пергамент',
        es: 'Пергамент',
      },
    },
    {
      id: 'bowl',
      name: {
        uk: 'Миска',
        en: 'Миска',
        es: 'Миска',
      },
    },
    {
      id: 'knife',
      name: {
        uk: 'Ніж',
        en: 'Ніж',
        es: 'Ніж',
      },
    },
    {
      id: 'board',
      name: {
        uk: 'Дошка',
        en: 'Дошка',
        es: 'Дошка',
      },
    },
  ],
  flourConfiguration: null,
  beforeStart: [
    {
      id: 'draft',
      text: {
        uk: 'Перед першим випіканням уточніть тип борошна. Безглютеновість цієї версії ще не підтверджено.',
        en: 'Перед першим випіканням уточніть тип борошна. Безглютеновість цієї версії ще не підтверджено.',
        es: 'Перед першим випіканням уточніть тип борошна. Безглютеновість цієї версії ще не підтверджено.',
      },
    },
    {
      id: 'record-bake',
      text: {
        uk: 'Під час випікання запишіть вихід, масу заготовок, кількості обсипки, режим духовки й фактичний час. Фото додамо після випікання.',
        en: 'Під час випікання запишіть вихід, масу заготовок, кількості обсипки, режим духовки й фактичний час. Фото додамо після випікання.',
        es: 'Під час випікання запишіть вихід, масу заготовок, кількості обсипки, режим духовки й фактичний час. Фото додамо після випікання.',
      },
    },
  ],
  ingredientSections: [
    {
      id: 'dough',
      title: {
        uk: 'Тісто',
        en: 'Тісто',
        es: 'Тісто',
      },
      lines: [
        {
          id: 'apples',
          options: [
            {
              ingredientId: 'apples',
              name: {
                uk: 'Яблука',
                en: 'Яблука',
                es: 'Яблука',
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
            },
          },
        },
        {
          id: 'cottage-cheese',
          options: [
            {
              ingredientId: 'cottage-cheese',
              name: {
                uk: 'Кисломолочний сир',
                en: 'Кисломолочний сир',
                es: 'Кисломолочний сир',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 400,
              unit: 'g',
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
                uk: 'Вершкове масло',
                en: 'Вершкове масло',
                es: 'Вершкове масло',
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
          id: 'eggs',
          options: [
            {
              ingredientId: 'eggs',
              name: {
                uk: 'Яйця',
                en: 'Яйця',
                es: 'Яйця',
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
            },
          },
        },
        {
          id: 'sugar',
          options: [
            {
              ingredientId: 'sugar',
              name: {
                uk: 'Цукор',
                en: 'Цукор',
                es: 'Цукор',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 130,
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
                uk: 'Борошно',
                en: 'Борошно',
                es: 'Борошно',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 350,
              unit: 'g',
            },
            shopping: {
              mode: 'base',
            },
          },
          qualifier: {
            uk: 'Тип борошна у джерелі не вказаний; безглютенову суміш ще не обрано й не перевірено.',
            en: 'Тип борошна у джерелі не вказаний; безглютенову суміш ще не обрано й не перевірено.',
            es: 'Тип борошна у джерелі не вказаний; безглютенову суміш ще не обрано й не перевірено.',
          },
        },
        {
          id: 'baking-powder',
          options: [
            {
              ingredientId: 'baking-powder',
              name: {
                uk: 'Розпушувач',
                en: 'Розпушувач',
                es: 'Розпушувач',
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
      ],
    },
    {
      id: 'coating',
      title: {
        uk: 'Для обвалювання',
        en: 'Для обвалювання',
        es: 'Для обвалювання',
      },
      lines: [
        {
          id: 'brown-sugar',
          options: [
            {
              ingredientId: 'brown-sugar',
              name: {
                uk: 'Коричневий цукор',
                en: 'Коричневий цукор',
                es: 'Коричневий цукор',
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
            uk: 'Кількість у джерелі не вказана.',
            en: 'Кількість у джерелі не вказана.',
            es: 'Кількість у джерелі не вказана.',
          },
        },
        {
          id: 'cinnamon',
          options: [
            {
              ingredientId: 'cinnamon',
              name: {
                uk: 'Кориця',
                en: 'Кориця',
                es: 'Кориця',
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
            uk: 'Кількість у джерелі не вказана.',
            en: 'Кількість у джерелі не вказана.',
            es: 'Кількість у джерелі не вказана.',
          },
        },
      ],
    },
  ],
  steps: [
    {
      id: 'prepare',
      title: {
        uk: 'Підготуйте духовку й деко',
        en: 'Підготуйте духовку й деко',
        es: 'Підготуйте духовку й деко',
      },
      instruction: {
        uk: 'Розігрійте духовку до 180 °C. Застеліть деко пергаментом.',
        en: 'Розігрійте духовку до 180 °C. Застеліть деко пергаментом.',
        es: 'Розігрійте духовку до 180 °C. Застеліть деко пергаментом.',
      },
      ingredientLineIds: [],
      equipmentIds: ['oven', 'tray', 'parchment'],
      temperature: {
        value: 180,
        unit: 'C',
        ovenMode: null,
      },
    },
    {
      id: 'melt-butter',
      title: {
        uk: 'Розтопіть масло',
        en: 'Розтопіть масло',
        es: 'Розтопіть масло',
      },
      instruction: {
        uk: 'Розтопіть вершкове масло.',
        en: 'Розтопіть вершкове масло.',
        es: 'Розтопіть вершкове масло.',
      },
      ingredientLineIds: ['butter'],
      equipmentIds: [],
    },
    {
      id: 'mix-dough',
      title: {
        uk: 'Змішайте тісто',
        en: 'Змішайте тісто',
        es: 'Змішайте тісто',
      },
      instruction: {
        uk: 'До кисломолочного сиру додайте яйця, цукор, розтоплене масло, борошно та розпушувач. Добре перемішайте.',
        en: 'До кисломолочного сиру додайте яйця, цукор, розтоплене масло, борошно та розпушувач. Добре перемішайте.',
        es: 'До кисломолочного сиру додайте яйця, цукор, розтоплене масло, борошно та розпушувач. Добре перемішайте.',
      },
      ingredientLineIds: [
        'cottage-cheese',
        'eggs',
        'sugar',
        'butter',
        'flour',
        'baking-powder',
      ],
      equipmentIds: ['bowl'],
    },
    {
      id: 'add-apples',
      title: {
        uk: 'Додайте яблука',
        en: 'Додайте яблука',
        es: 'Додайте яблука',
      },
      instruction: {
        uk: 'Очистьте яблука й наріжте дрібними кубиками. Додайте до сирної маси та перемішайте.',
        en: 'Очистьте яблука й наріжте дрібними кубиками. Додайте до сирної маси та перемішайте.',
        es: 'Очистьте яблука й наріжте дрібними кубиками. Додайте до сирної маси та перемішайте.',
      },
      ingredientLineIds: ['apples'],
      equipmentIds: ['knife', 'board', 'bowl'],
    },
    {
      id: 'coat',
      title: {
        uk: 'Сформуйте й обваляйте печиво',
        en: 'Сформуйте й обваляйте печиво',
        es: 'Сформуйте й обваляйте печиво',
      },
      instruction: {
        uk: 'Змішайте коричневий цукор із корицею. Сформуйте з тіста кульки й обваляйте в цій суміші.',
        en: 'Змішайте коричневий цукор із корицею. Сформуйте з тіста кульки й обваляйте в цій суміші.',
        es: 'Змішайте коричневий цукор із корицею. Сформуйте з тіста кульки й обваляйте в цій суміші.',
      },
      ingredientLineIds: ['brown-sugar', 'cinnamon'],
      equipmentIds: ['bowl'],
    },
    {
      id: 'arrange',
      title: {
        uk: 'Викладіть на деко',
        en: 'Викладіть на деко',
        es: 'Викладіть на деко',
      },
      instruction: {
        uk: 'Викладіть кульки на застелене пергаментом деко й трохи приплюсніть.',
        en: 'Викладіть кульки на застелене пергаментом деко й трохи приплюсніть.',
        es: 'Викладіть кульки на застелене пергаментом деко й трохи приплюсніть.',
      },
      ingredientLineIds: [],
      equipmentIds: ['tray', 'parchment'],
    },
    {
      id: 'bake',
      title: {
        uk: 'Випікайте',
        en: 'Випікайте',
        es: 'Випікайте',
      },
      instruction: {
        uk: 'Випікайте за 180 °C протягом 45–50 хвилин, до рум’яної скоринки. Це час із джерела; власний результат ще не перевірено.',
        en: 'Випікайте за 180 °C протягом 45–50 хвилин, до рум’яної скоринки. Це час із джерела; власний результат ще не перевірено.',
        es: 'Випікайте за 180 °C протягом 45–50 хвилин, до рум’яної скоринки. Це час із джерела; власний результат ще не перевірено.',
      },
      ingredientLineIds: [],
      equipmentIds: ['oven', 'tray'],
      temperature: {
        value: 180,
        unit: 'C',
        ovenMode: null,
      },
      durationPhaseId: 'baking',
      guidance: [
        {
          id: 'golden-crust',
          kind: 'checkpoint',
          text: {
            uk: 'Рум’яна скоринка — орієнтир із джерела.',
            en: 'Рум’яна скоринка — орієнтир із джерела.',
            es: 'Рум’яна скоринка — орієнтир із джерела.',
          },
          provenance: {
            state: 'suggested',
            sourceIds: ['apple-cottage-cheese-cookies-source'],
          },
        },
      ],
    },
  ],
  storage: null,
  makeAhead: null,
  variations: [],
  heroMediaId: null,
  media: [],
  relatedRecipeIds: [],
  sources: [
    {
      id: 'apple-cottage-cheese-cookies-source',
      file: 'media/recipes/apple-cottage-cheese-cookies/original/source-2026-11-03.md',
      locator:
        'Скриншот Olga Riabenko та повний текст, наданий Сашею 03.11.2026.',
    },
  ],
  contentGaps: [
    {
      id: 'flour-type',
      area: 'ingredient',
      field: 'flourConfiguration',
      question:
        'Яке борошно або безглютенову суміш використаємо для цієї версії?',
      text: {
        uk: 'Яке борошно або безглютенову суміш використаємо для цієї версії?',
        en: 'Яке борошно або безглютенову суміш використаємо для цієї версії?',
        es: 'Яке борошно або безглютенову суміш використаємо для цієї версії?',
      },
      publicationBlocking: true,
      readerVisible: true,
      sourceIds: ['apple-cottage-cheese-cookies-source'],
    },
    {
      id: 'coating-amounts',
      area: 'ingredient',
      field: 'ingredientSections.coating',
      question:
        'Скільки коричневого цукру й кориці фактично пішло на обвалювання?',
      text: {
        uk: 'Скільки коричневого цукру й кориці фактично пішло на обвалювання?',
        en: 'Скільки коричневого цукру й кориці фактично пішло на обвалювання?',
        es: 'Скільки коричневого цукру й кориці фактично пішло на обвалювання?',
      },
      publicationBlocking: true,
      readerVisible: true,
      sourceIds: ['apple-cottage-cheese-cookies-source'],
    },
    {
      id: 'yield',
      area: 'yield',
      field: 'yield.default',
      question: 'Скільки печива вийшло і яка маса однієї заготовки?',
      text: {
        uk: 'Скільки печива вийшло і яка маса однієї заготовки?',
        en: 'Скільки печива вийшло і яка маса однієї заготовки?',
        es: 'Скільки печива вийшло і яка маса однієї заготовки?',
      },
      publicationBlocking: true,
      readerVisible: true,
      sourceIds: ['apple-cottage-cheese-cookies-source'],
    },
    {
      id: 'oven-mode',
      area: 'method',
      field: 'steps.bake.temperature.ovenMode',
      question:
        'Який режим духовки й фактичний час випікання дали вдалий результат?',
      text: {
        uk: 'Який режим духовки й фактичний час випікання дали вдалий результат?',
        en: 'Який режим духовки й фактичний час випікання дали вдалий результат?',
        es: 'Який режим духовки й фактичний час випікання дали вдалий результат?',
      },
      publicationBlocking: true,
      readerVisible: true,
      sourceIds: ['apple-cottage-cheese-cookies-source'],
    },
    {
      id: 'photo',
      area: 'image',
      field: 'heroMediaId',
      question: 'Додати власне фото після випікання.',
      text: {
        uk: 'Додати власне фото після випікання.',
        en: 'Додати власне фото після випікання.',
        es: 'Додати власне фото після випікання.',
      },
      publicationBlocking: true,
      readerVisible: true,
      sourceIds: ['apple-cottage-cheese-cookies-source'],
    },
    {
      id: 'tray-size',
      area: 'form',
      field: 'geometry.default',
      question: 'Записати розмір дека й кількість партій.',
      text: {
        uk: 'Записати розмір дека й кількість партій.',
        en: 'Записати розмір дека й кількість партій.',
        es: 'Записати розмір дека й кількість партій.',
      },
      publicationBlocking: true,
      readerVisible: true,
      sourceIds: ['apple-cottage-cheese-cookies-source'],
    },
    {
      id: 'timing',
      area: 'timing',
      field: 'timing',
      question: 'Записати активний і загальний час.',
      text: {
        uk: 'Записати активний і загальний час.',
        en: 'Записати активний і загальний час.',
        es: 'Записати активний і загальний час.',
      },
      publicationBlocking: true,
      readerVisible: true,
      sourceIds: ['apple-cottage-cheese-cookies-source'],
    },
    {
      id: 'storage',
      area: 'storage',
      field: 'storage',
      question: 'Уточнити зберігання після перевірки.',
      text: {
        uk: 'Уточнити зберігання після перевірки.',
        en: 'Уточнити зберігання після перевірки.',
        es: 'Уточнити зберігання після перевірки.',
      },
      publicationBlocking: true,
      readerVisible: true,
      sourceIds: ['apple-cottage-cheese-cookies-source'],
    },
  ],
} satisfies Recipe;
