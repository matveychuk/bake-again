import type {
  LocalizedText,
  Recipe,
  RecipeMedia,
  RecipeStep,
} from './recipe.types.ts';

export const crinkleCookiesRecipe = {
  schemaVersion: 3,
  id: 'crinkle-cookies',
  versionId: 'crinkle-cookies-v2',
  presentation: 'concise',
  publicationStatus: 'published',
  translationState: {
    uk: 'reviewed',
    en: 'reviewed',
    es: 'reviewed',
  },
  slug: {
    uk: 'marmurove-pechyvo-trishchynky',
    en: 'marbled-crinkle-cookies',
    es: 'galletas-marmoladas-craqueladas',
  },
  title: {
    en: 'Gluten-free marbled crinkle cookies',
    es: 'Galletas marmoladas craqueladas sin gluten',
    uk: 'Безглютенове шоколадне печиво «Тріщинки»',
  },
  summary: {
    uk: 'Мармурове печиво з какао, м’якою серединкою та тріщинками на цукровій скоринці. Тісто на суміші Schär Mix B Bread.',
    en: 'Chocolate cookies with a tender centre and a cracked sugar coating.',
    es: 'Galletas de chocolate con un centro tierno y una cobertura de azúcar craquelada.',
  },
  categoryIds: ['cookies', 'sweet-baking'],
  situationIds: ['everyday', 'batter-on-hand'],
  difficulty: 'easy',
  baseProvenance: {
    state: 'tested',
    sourceIds: ['inventory-row', 'archive-recipe', 'author-update'],
    note: 'The author confirmed successful baking of this exact edited version on 2026-09-20.',
  },
  timing: {
    activeMinutes: 30,
    totalElapsedMinutes: null,
    planningNote: {
      phaseId: 'chill',
      text: {
        uk: 'Додатково: {duration} у холодильнику, 8–10 хв на кожне деко та охолодження печива.',
        en: 'Allow an additional {duration} in the refrigerator, 8–10 min per tray and time for the cookies to cool.',
        es: 'Añade {duration} de refrigeración, 8–10 min por bandeja y el enfriado de las galletas.',
      },
    },
    phases: [
      {
        id: 'chill',
        relatedStepId: 'chill-dough',
        label: {
          uk: 'Охолодження',
          en: 'Chilling',
          es: 'Refrigeración',
        },
        duration: {
          kind: 'range',
          min: 3,
          max: 4,
          unit: 'hour',
        },
      },
      {
        id: 'maximum-hold',
        label: {
          uk: 'Максимальний час у холодильнику',
          en: 'Maximum refrigerated hold',
          es: 'Tiempo máximo en refrigeración',
        },
        duration: {
          kind: 'exact',
          value: 24,
          unit: 'hour',
        },
        relatedStepId: 'chill-dough',
      },
      {
        id: 'bake',
        relatedStepId: 'bake-cookies',
        label: {
          uk: 'Випікання',
          en: 'Baking',
          es: 'Horneado',
        },
        duration: {
          kind: 'range',
          min: 8,
          max: 10,
          unit: 'minute',
        },
      },
    ],
  },
  yield: {
    default: {
      id: 'default-batch',
      label: {
        uk: '20 печив',
        en: '20 cookies',
        es: '20 galletas',
      },
      unit: 'cookie',
      provenance: {
        state: 'repeatedlyVerified',
        sourceIds: ['author-update'],
      },
      availability: 'default',
      count: {
        kind: 'exact',
        value: 20,
      },
    },
    alternatives: [],
  },
  geometry: {
    default: {
      id: 'parchment-lined-baking-sheet',
      label: {
        uk: 'Деко, застелене пергаментом',
        en: 'Parchment-lined baking sheet',
        es: 'Bandeja de horno forrada con papel',
      },
      kind: 'tray',
      application: 'portion-on',
      shape: 'rectangular',
      diameterCm: null,
      layerCount: null,
      material: null,
      provenance: {
        state: 'repeatedlyVerified',
        sourceIds: ['archive-recipe'],
      },
      availability: 'default',
    },
    alternatives: [],
    state: 'known',
  },
  configuration: {
    base: {
      geometryId: 'parchment-lined-baking-sheet',
      yieldId: 'default-batch',
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
        precision: 0.1,
        rounding: 'nearest',
      },
    },
  },
  equipment: [
    {
      id: 'baking-sheet',
      name: {
        uk: 'деко',
        en: 'baking sheet',
        es: 'bandeja de horno',
      },
    },
    {
      id: 'parchment',
      name: {
        uk: 'пергамент',
        en: 'baking parchment',
        es: 'papel de horno',
      },
    },
    {
      id: 'electric-mixer',
      name: {
        uk: 'міксер',
        en: 'electric mixer',
        es: 'batidora eléctrica',
      },
    },
  ],
  flourConfiguration: {
    commercialMixLineId: 'flour',
    additionalStarchLineIds: [],
    provenance: {
      state: 'repeatedlyVerified',
      sourceIds: ['inventory-row', 'archive-note'],
      note: 'The inventory specifies Schär Mix B Bread as the flour used by the author.',
    },
    testedAlternativeMixes: [],
    knownUnsupportedMixes: [],
    basis: 'commercialMix',
  },
  beforeStart: [],
  ingredientSections: [
    {
      id: 'cookies',
      title: {
        uk: 'Печиво',
        en: 'Cookies',
        es: 'Galletas',
      },
      lines: [
        {
          id: 'butter',
          options: [
            {
              ingredientId: 'butter',
              name: {
                uk: 'вершкове масло',
                en: 'butter',
                es: 'mantequilla',
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
          preparation: {
            uk: 'м’яке',
            en: 'softened',
            es: 'blanda',
          },
        },
        {
          id: 'eggs',
          options: [
            {
              ingredientId: 'whole-egg',
              name: {
                uk: 'яйця',
                en: 'eggs',
                es: 'huevos',
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
          scaling: {
            kind: 'discrete',
            increment: 1,
            rounding: 'manual',
          },
        },
        {
          id: 'sugar',
          options: [
            {
              ingredientId: 'granulated-sugar',
              name: {
                uk: 'цукор',
                en: 'sugar',
                es: 'azúcar',
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
          id: 'cocoa',
          options: [
            {
              ingredientId: 'cocoa-powder',
              name: {
                uk: 'какао',
                en: 'cocoa powder',
                es: 'cacao en polvo',
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
          id: 'flour',
          options: [
            {
              ingredientId: 'schar-mix-b-bread',
              name: {
                uk: 'борошняна суміш Schär Mix B Bread',
                en: 'Schär Mix B Bread flour mix',
                es: 'mezcla de harina Schär Mix B Bread',
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
          id: 'baking-powder',
          options: [
            {
              ingredientId: 'baking-powder',
              name: {
                uk: 'розпушувач',
                en: 'baking powder',
                es: 'levadura química',
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
          id: 'powdered-sugar',
          options: [
            {
              ingredientId: 'powdered-sugar',
              name: {
                uk: 'цукрова пудра',
                en: 'icing sugar',
                es: 'azúcar glas',
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
              value: 14.1593,
              unit: 'tbsp',
            },
            shopping: {
              mode: 'base',
            },
          },
          qualifier: {
            uk: 'для обкачування',
            en: 'for coating',
            es: 'para rebozar',
          },
        },
      ],
    },
  ],
  steps: [
    {
      id: 'beat-wet',
      technique: {
        id: 'soften-butter',
      },
      title: {
        uk: 'Збийте основу',
        en: 'Beat the base',
        es: 'Bate la base',
      },
      instruction: {
        uk: 'Збийте яйця, цукор і м’яке масло міксером до світлої маси без шматочків масла.',
        en: 'Beat the eggs, sugar and softened butter with a mixer until pale, with no pieces of butter remaining.',
        es: 'Bate los huevos, el azúcar y la mantequilla blanda hasta obtener una mezcla clara, sin trozos de mantequilla.',
      },
      ingredientLineIds: ['eggs', 'sugar', 'butter'],
      equipmentIds: ['electric-mixer'],
      mediaIds: ['crinkle-pale-wet-base-v1'],
    },
    {
      id: 'combine-dough',
      title: {
        uk: 'Замісіть тісто',
        en: 'Mix the dough',
        es: 'Mezcla la masa',
      },
      instruction: {
        uk: 'Окремо змішайте какао, борошно й розпушувач. Додайте до збитої основи й перемішайте, доки не залишиться сухих ділянок. Тісто буде дуже липким.',
        en: 'Mix the cocoa, flour and baking powder separately. Add to the beaten base and mix until no dry patches remain. The dough will be very sticky.',
        es: 'Mezcla aparte el cacao, la harina y la levadura química. Añádelos a la base batida y mezcla hasta que no queden zonas secas. La masa estará muy pegajosa.',
      },
      ingredientLineIds: ['cocoa', 'flour', 'baking-powder'],
      equipmentIds: ['electric-mixer'],
      mediaIds: ['crinkle-finished-sticky-dough-v1'],
    },
    {
      id: 'chill-dough',
      title: {
        uk: 'Охолодіть тісто',
        en: 'Chill the dough',
        es: 'Refrigera la masa',
      },
      instruction: {
        uk: 'Накрийте й поставте в холодильник на 3–4 години. Можна залишити до 24 годин.',
        en: 'Cover and refrigerate for 3–4 hours. You can leave it refrigerated for up to 24 hours.',
        es: 'Cubre y refrigera durante 3–4 horas. Puedes dejarla en la nevera hasta 24 horas.',
      },
      ingredientLineIds: [],
      durationPhaseId: 'chill',
    },
    {
      id: 'preheat-oven',
      title: {
        uk: 'Підготуйте духовку й деко',
        en: 'Prepare the oven and tray',
        es: 'Prepara el horno y la bandeja',
      },
      instruction: {
        uk: 'Не дістаючи тісто з холодильника, розігрійте духовку до 180°C, верхній і нижній нагрів. Застеліть деко пергаментом і насипте цукрову пудру в миску.',
        en: 'Leave the dough in the refrigerator while you preheat the oven to 180°C with top-and-bottom heat. Line a tray with parchment and put the icing sugar in a bowl.',
        es: 'Deja la masa en la nevera mientras precalientas el horno a 180°C con calor arriba y abajo. Forra una bandeja con papel y pon el azúcar glas en un bol.',
      },
      ingredientLineIds: ['powdered-sugar'],
      temperature: {
        value: 180,
        unit: 'C',
        ovenMode: 'conventional',
      },
      equipmentIds: ['baking-sheet', 'parchment'],
    },
    {
      id: 'shape-and-coat',
      title: {
        uk: 'Сформуйте й обкачайте кульки',
        en: 'Shape and coat the balls',
        es: 'Forma y reboza las bolas',
      },
      instruction: {
        uk: 'Набирайте холодне тісто ложкою й швидко скачуйте кульки розміром із волоський горіх. Одразу обкачуйте в щільному шарі пудри й викладайте на деко на великій відстані одна від одної.',
        en: 'Scoop the cold dough with a spoon and quickly roll walnut-sized balls. Immediately coat them in a thick layer of icing sugar and place them well apart on the tray.',
        es: 'Toma la masa fría con una cuchara y forma rápidamente bolas del tamaño de una nuez. Rebózalas enseguida en una capa gruesa de azúcar glas y colócalas bien separadas en la bandeja.',
      },
      ingredientLineIds: ['powdered-sugar'],
      equipmentIds: ['baking-sheet', 'parchment'],
      guidance: [
        {
          id: 'quick-cool-hands',
          kind: 'practicalTip',
          text: {
            uk: 'Від тепла рук тісто швидко м’якшає — не катайте його довго.',
            en: 'The dough softens quickly from the warmth of your hands — keep rolling brief.',
            es: 'La masa se ablanda rápidamente con el calor de las manos; no la manipules mucho tiempo.',
          },
        },
      ],
      mediaIds: [
        'crinkle-fast-shape-coat-v1',
        'crinkle-tray-spacing-options-v1',
      ],
    },
    {
      id: 'bake-cookies',
      title: {
        uk: 'Спечіть печиво',
        en: 'Bake the cookies',
        es: 'Hornea las galletas',
      },
      instruction: {
        uk: 'Випікайте при 180°C 8–10 хвилин. Печиво має піднятися й потріскатися, а тріщинки — залишатися на вигляд вологими. Не чекайте, доки вони висохнуть: печиво ущільниться під час охолодження.',
        en: 'Bake at 180°C for 8–10 minutes. The cookies should rise and crack, with the cracks still looking moist. Do not wait for them to dry: the cookies will firm up as they cool.',
        es: 'Hornea a 180°C durante 8–10 minutos. Las galletas deben subir y agrietarse, con las grietas aún húmedas a la vista. No esperes a que se sequen: se afirmarán al enfriarse.',
      },
      ingredientLineIds: [],
      temperature: {
        value: 180,
        unit: 'C',
        ovenMode: 'conventional',
      },
      equipmentIds: ['baking-sheet'],
      mediaIds: ['crinkle-moist-cracks-v1'],
      durationPhaseId: 'bake',
    },
    {
      id: 'cool-cookies',
      title: {
        uk: 'Остудіть печиво',
        en: 'Cool the cookies',
        es: 'Deja enfriar las galletas',
      },
      instruction: {
        uk: 'Дайте повністю охолонути на деку або перекладіть з нього. Зберігайте в герметичній ємності.',
        en: 'Let the cookies cool completely on the tray or transfer them off it. Store in an airtight container.',
        es: 'Deja que se enfríen por completo en la bandeja o pásalas a otra superficie. Guarda en un recipiente hermético.',
      },
      ingredientLineIds: [],
    },
  ],
  storage: {
    uk: 'Зберігати в герметичній ємності.',
    en: 'Store in an airtight container.',
    es: 'Guardar en un recipiente hermético.',
  },
  makeAhead: {
    uk: 'Тісто можна тримати в холодильнику до 24 годин перед випіканням.',
    en: 'The dough may be refrigerated for up to 24 hours before baking.',
    es: 'La masa puede conservarse en la nevera hasta 24 horas antes de hornear.',
  },
  variations: [
    {
      id: 'walnut-centre',
      dimension: 'filling',
      label: {
        uk: 'Волоський горіх або пекан всередині',
        en: 'Walnut or pecan centre',
        es: 'Centro de nuez o nuez pecana',
      },
      description: {
        uk: 'У сформовану кульку тіста вставити волоський горіх або горіх пекан.',
        en: 'Insert a walnut or pecan into the shaped dough ball.',
        es: 'Introduce una nuez o una nuez pecana en la bola de masa formada.',
      },
      provenance: {
        state: 'tested',
        sourceIds: ['archive-recipe', 'inventory-row', 'author-update'],
        note: 'The author confirmed that the walnut-or-pecan centre has been baked successfully.',
      },
      availability: 'selectable',
      ingredientChanges: [
        {
          action: 'add',
          lineId: 'nut-centre',
          line: {
            id: 'nut-centre',
            options: [
              {
                ingredientId: 'walnut',
                name: {
                  uk: 'волоський горіх',
                  en: 'walnut',
                  es: 'nuez',
                },
              },
              {
                ingredientId: 'pecan',
                name: {
                  uk: 'горіх пекан',
                  en: 'pecan',
                  es: 'nuez pecana',
                },
              },
            ],
            choose: 1,
            quantity: {
              base: {
                kind: 'exact',
                value: 20,
                unit: 'piece',
              },
              shopping: {
                mode: 'base',
              },
            },
            qualifier: {
              uk: 'по одному шматочку в кожну з 20 кульок',
              en: 'one piece in each of the 20 dough balls',
              es: 'una pieza en cada una de las 20 bolas de masa',
            },
            provenance: {
              state: 'calculated',
              sourceIds: ['author-update'],
              note: 'Calculated as one nut piece for each of the confirmed 20 cookies.',
            },
          },
        },
      ],
      stepChanges: [
        {
          stepId: 'shape-and-coat',
          instruction: {
            uk: 'Під час формування вставити в кожну кульку волоський горіх або горіх пекан, потім обкачати в цукровій пудрі.',
            en: 'While shaping, insert a walnut or pecan into each dough ball, then coat it in icing sugar.',
            es: 'Al formar las bolas, introduce una nuez o una nuez pecana en cada una y rebózala después en azúcar glas.',
          },
        },
      ],
    },
  ],
  heroMediaId: 'crinkle-generated-card-v1',
  media: [
    {
      id: 'crinkle-generated-card-v1',
      type: 'image',
      path: '/images/recipes/chocolate-crinkle-cookies-card-v1.webp',
      usage: ['hero', 'gallery'],
      alt: {
        uk: 'Шоколадне печиво тріщинки в цукровій пудрі на керамічній тарілці',
        en: 'Chocolate crinkle cookies dusted with icing sugar on a ceramic plate',
        es: 'Galletas craqueladas de chocolate con azúcar glas sobre un plato de cerámica',
      },
      heroAlt: {
        en: 'Chocolate crinkle cookies with a cracked surface',
        es: 'Galletas de chocolate craqueladas',
        uk: 'Шоколадне печиво з тріщинками',
      },
    },
    {
      id: 'crinkle-pale-wet-base-v1',
      type: 'image',
      path: '/media/recipes/crinkle-cookies/selected/step-01-pale-wet-base-v1.webp',
      usage: ['step'],
      alt: {
        uk: 'Світла однорідна суміш яєць, цукру й м’якого масла стікає з вінчиків у керамічну миску',
        en: 'Pale even mixture of eggs, sugar and softened butter falling from mixer beaters into a ceramic bowl',
        es: 'Mezcla clara y uniforme de huevos, azúcar y mantequilla blanda cayendo de las varillas a un bol de cerámica',
      },
    },
    {
      id: 'crinkle-finished-sticky-dough-v1',
      type: 'image',
      path: '/media/recipes/crinkle-cookies/selected/step-03-finished-sticky-dough-v1.webp',
      usage: ['step'],
      alt: {
        uk: 'Дуже липке шоколадне тісто тягнеться за лопаткою над керамічною мискою',
        en: 'Very sticky chocolate dough stretching from a spatula above a ceramic bowl',
        es: 'Masa de chocolate muy pegajosa estirándose desde una espátula sobre un bol de cerámica',
      },
    },
    {
      id: 'crinkle-chilled-dough-scoop-v1',
      type: 'image',
      path: '/media/recipes/crinkle-cookies/selected/step-04-chilled-dough-scoop-v1.webp',
      usage: ['step'],
      alt: {
        uk: 'Ложка набирає порцію холодного липкого шоколадного тіста з керамічної миски',
        en: 'A spoon scoops a portion of cold sticky chocolate dough from a ceramic bowl',
        es: 'Una cuchara toma una porción de masa de chocolate fría y pegajosa de un bol de cerámica',
      },
    },
    {
      id: 'crinkle-fast-shape-coat-v1',
      type: 'image',
      path: '/media/recipes/crinkle-cookies/selected/step-06-fast-shape-coat-v1.webp',
      usage: ['step'],
      alt: {
        uk: 'Руки швидко округлюють шоколадне тісто над мискою з цукровою пудрою; поруч лежить обкачана кулька',
        en: 'Hands quickly round chocolate dough over a bowl of icing sugar beside a fully coated ball',
        es: 'Unas manos redondean rápidamente masa de chocolate sobre un bol con azúcar glas junto a una bola ya rebozada',
      },
    },
    {
      id: 'crinkle-tray-spacing-options-v1',
      type: 'image',
      path: '/media/recipes/crinkle-cookies/selected/step-06-tray-spacing-options-v1.webp',
      usage: ['step'],
      alt: {
        uk: 'Обкачані в цукровій пудрі кульки тіста далеко одна від одної на деку; частина з волоським горіхом або пеканом',
        en: 'Powdered-sugar-coated dough balls spaced far apart on a baking sheet, some topped with walnut or pecan',
        es: 'Bolas de masa cubiertas de azúcar glas bien separadas en una bandeja, algunas con nuez o nuez pecana',
      },
    },
    {
      id: 'crinkle-moist-cracks-v1',
      type: 'image',
      path: '/media/recipes/crinkle-cookies/selected/step-07-moist-cracks-v1.webp',
      usage: ['step'],
      alt: {
        uk: 'Щойно спечене шоколадне печиво з виразними тріщинами, всередині яких тісто ще виглядає вологим',
        en: 'Freshly baked chocolate crinkle cookies with pronounced cracks whose exposed dough still looks moist',
        es: 'Galletas de chocolate recién horneadas con grietas marcadas cuya masa expuesta aún se ve húmeda',
      },
    },
  ],
  relatedRecipeIds: [],
  sources: [
    {
      id: 'inventory-row',
      file: 'docs/reference/recipe-inventory.xlsx',
      locator: 'Recipe Inventory!A14:R14',
    },
    {
      id: 'archive-recipe',
      file: 'docs/reference/recipe-inventory.xlsx',
      locator: 'Recipe Archive!A91:B94',
    },
    {
      id: 'author-update',
      file: 'Current ChatGPT conversation',
      locator:
        'Author confirmations on 2026-09-07, 2026-09-17 and content review on 2026-09-20',
    },
    {
      id: 'archive-note',
      file: 'docs/reference/recipe-inventory.xlsx',
      locator: 'Recipe Archive!A95:B95',
    },
  ],
  contentGaps: [],
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
      uk: [
        'шоколадне печиво без глютену',
        'мармурове печиво',
        'печиво з тріщинками',
      ],
      en: ['Gluten-free marbled crinkle cookies'],
      es: ['Galletas marmoladas craqueladas sin gluten'],
    },
  },
  evidenceExplanation: {
    en: 'This exact version was baked successfully.',
    es: 'Esta versión exacta se ha horneado correctamente.',
    uk: 'Цю версію успішно приготували.',
  },
  discovery: {
    cardTitle: {
      en: 'Marbled Cookies',
      es: 'Galletas marmoladas',
      uk: 'Шоколадне печиво «Тріщинки»',
    },
    category: {
      en: 'Cookies',
      es: 'Galletas',
      uk: 'Печиво',
    },
    flourSummary: {
      en: 'Schär Mix B Bread',
      es: 'Schär Mix B Bread',
      uk: 'Schär Mix B Bread',
    },
    collectionIds: ['everyday', 'batter-on-hand'],
    catalogue: true,
    imageKind: 'generated-preview',
    sourceTitle: 'Мармурове печиво «Тріщинки»',
    launchPriority: 'High',
    heroCandidate: 'Yes',
    source: 'Full recipe pasted in the inventory conversation',
    archiveSections: [
      {
        title: 'Ingredients · original notes',
        content:
          'Вершкове масло — 60 г\nЯйця — 2 шт.\nЦукор — 200 г\nКакао — 60 г\nБорошно — 120 г\nРозпушувач — 1 ч. л.\nЦедра 1 апельсина\nЦукрова пудра для обкачування',
      },
      {
        title: 'Method · original notes',
        content:
          'Збити яйця з цукром та вершковим маслом до побіління. Окремо змішати какао, борошно та розпушувач. Додати сухі інгредієнти до вологих і збити до повного поєднання. Накрити тісто й поставити в холодильник на 3–4 години; можна залишити до 24 годин.\n\nРозігріти духовку до 180°C. Скатати кульки розміром з волоський горіх, ретельно обкачати в цукровій пудрі й викласти далеко одна від одної. Пекти 8–10 хв. Тріщинки повинні здаватися вологими. Повністю остудити.',
      },
    ],
    needsBeforePublishing:
      'Record active time; confirm the walnut variation; approve or replace the generated photo.',
    shortTitle: {
      uk: 'Мармурове печиво «Тріщинки»',
      en: 'Marbled Crinkle Cookies',
      es: 'Galletas marmoladas craqueladas',
    },
  },
  translationReview: {
    date: '2026-11-01',
    reviewer: 'implementation',
    scope:
      'ID-aligned transfer and semantic comparison of existing UK/EN/ES recipe text; not separate author approval',
  },
  seo: {
    uk: {
      title: 'Шоколадне печиво «Тріщинки» без глютену',
      description:
        'Покроковий рецепт з фото на 20 мармурових печив із какао та Schär Mix B Bread. Як охолодити тісто, обкачати кульки в пудрі й спекти до появи тріщинок.',
    },
    en: {
      title: 'Gluten-free marbled crinkle cookies',
      description:
        'Gluten-free chocolate crinkle cookies with tender centres and a cracked sugar coating. Ingredient quantities and step-by-step baking instructions.',
    },
    es: {
      title: 'Galletas marmoladas craqueladas sin gluten',
      description:
        'Galletas de chocolate craqueladas sin gluten, tiernas por dentro y cubiertas de azúcar. Ingredientes y elaboración paso a paso.',
    },
  },
  routeSlug: 'crinkle-cookies',
} satisfies Recipe;

// The November revision is available only in Ukrainian while translation awaits review.
function ukrainianSource(uk: string): LocalizedText {
  return { uk, en: uk, es: uk };
}

function stepPhoto(filename: `${string}.webp`, alt: string): RecipeMedia {
  return {
    id: filename.slice(0, -5),
    type: 'image',
    path: `/media/recipes/crinkle-cookies/selected/${filename}`,
    usage: ['step'],
    fit: 'cover',
    alt: ukrainianSource(alt),
  };
}

const authorHero: RecipeMedia = {
  id: 'crinkle-author-hero-v1',
  type: 'image',
  path: '/images/recipes/chocolate-crinkle-cookies-author-v1.webp',
  usage: ['hero', 'card'],
  alt: ukrainianSource(
    'Шоколадні тріщинки в цукровій пудрі на тарілці, одне печиво розламане',
  ),
};

const ukrainianStepPhotos = [
  stepPhoto(
    'ingredients-v2.webp',
    'Вершкове масло, розпушувач, какао, цукор, борошняна суміш і два яйця в окремому посуді',
  ),
  stepPhoto(
    'wet-ingredients-v2.webp',
    'Яйця, цукор і м’яке вершкове масло в мисці перед збиванням',
  ),
  stepPhoto(
    'beat-wet-v2.webp',
    'Міксер збиває яйця, цукор і вершкове масло у світлу масу',
  ),
  stepPhoto(
    'mix-dry-v2.webp',
    'Какао, борошняну суміш і розпушувач перемішують ложкою в білій мисці',
  ),
  stepPhoto(
    'add-dry-v2.webp',
    'Суха суміш із какао поверх збитої масляної основи',
  ),
  stepPhoto(
    'mix-dough-v2.webp',
    'Міксер поступово поєднує суху суміш зі збитою основою',
  ),
  stepPhoto(
    'dough-before-chill-v2.webp',
    'Готове липке шоколадне тісто в мисці',
  ),
  stepPhoto(
    'cover-dough-v2.webp',
    'Миска з шоколадним тістом, накрита харчовою плівкою',
  ),
  stepPhoto(
    'cold-dough-pecans-v2.webp',
    'Холодне шоколадне тісто з ложкою, пекан і цукрова пудра поруч із деком',
  ),
  stepPhoto(
    'coat-in-sugar-v2.webp',
    'Рука обкачує шоколадну кульку в цукровій пудрі',
  ),
  stepPhoto(
    'tray-spacing-v2.webp',
    'Обкачані в пудрі кульки тіста викладені з проміжками на деку з пергаментом',
  ),
  stepPhoto(
    'cookies-in-oven-v2.webp',
    'Кульки шоколадного тіста в цукровій пудрі на деку в духовці',
  ),
  stepPhoto(
    'cracks-in-oven-v2.webp',
    'Під час випікання на поверхні шоколадного печива з’являються тріщинки',
  ),
];

const prepareIngredients: RecipeStep = {
  id: 'prepare-ingredients',
  title: ukrainianSource('Підготуйте інгредієнти'),
  instruction: ukrainianSource(
    'Заздалегідь дістаньте вершкове масло, щоб воно розм’якло. Відміряйте інгредієнти для тіста й окремо підготуйте цукрову пудру для обкачування.',
  ),
  ingredientLineIds: [
    'butter',
    'eggs',
    'sugar',
    'cocoa',
    'flour',
    'baking-powder',
    'powdered-sugar',
  ],
  mediaIds: ['ingredients-v2'],
};

const mixDry: RecipeStep = {
  id: 'mix-dry',
  title: ukrainianSource('Змішайте сухі інгредієнти'),
  instruction: ukrainianSource(
    'В окремій мисці перемішайте какао, борошняну суміш Schär Mix B Bread і розпушувач.',
  ),
  ingredientLineIds: ['cocoa', 'flour', 'baking-powder'],
  mediaIds: ['mix-dry-v2'],
};

const ukrainianStepUpdates: Record<
  string,
  { instruction?: string; mediaIds?: string[] }
> = {
  'beat-wet': { mediaIds: ['wet-ingredients-v2', 'beat-wet-v2'] },
  'combine-dough': {
    instruction:
      'Всипте суху суміш до збитої основи. Вимішуйте міксером або тістомісом із гаком на низькій швидкості, доки не залишиться сухих ділянок. Готове шоколадне тісто буде липким.',
    mediaIds: ['add-dry-v2', 'mix-dough-v2'],
  },
  'chill-dough': {
    instruction:
      'Накрийте миску з тістом харчовою плівкою й поставте в холодильник щонайменше на 2 години. Можна залишити тісто в холодильнику до 24 годин.',
    mediaIds: ['dough-before-chill-v2', 'cover-dough-v2'],
  },
  'preheat-oven': {
    instruction:
      'Поки тісто в холодильнику, розігрійте духовку до 180 °C у режимі верхнього й нижнього нагріву. Застеліть деко пергаментом і насипте цукрову пудру в миску.',
  },
  'shape-and-coat': {
    instruction:
      'Набирайте холодне тісто ложкою й швидко скочуйте між долонями кульки розміром із волоський горіх. За бажанням покладіть усередину шматочок волоського горіха або пекана. Одразу щедро обкачайте кульки в цукровій пудрі й викладіть на деко, залишаючи між ними багато місця.',
    mediaIds: ['cold-dough-pecans-v2', 'coat-in-sugar-v2', 'tray-spacing-v2'],
  },
  'bake-cookies': {
    instruction:
      'Випікайте за 180 °C 8–10 хвилин, до появи тріщинок. Коли печиво підніметься, а тісто в тріщинках ще виглядатиме вологим, вийміть деко. Печиво ущільниться під час охолодження.',
    mediaIds: ['cookies-in-oven-v2', 'cracks-in-oven-v2'],
  },
  'cool-cookies': {
    instruction:
      'Дайте печиву повністю охолонути. Зберігайте в герметичній ємності.',
  },
};

const novemberSource = {
  id: 'author-update-2026-11-23',
  file: 'Current Codex conversation and photographs from 2026-11-22',
  locator:
    'Author’s Ukrainian method, timing and photo selections on 2026-11-23',
};

export const crinkleCookiesUkrainianRecipe: Recipe = {
  ...crinkleCookiesRecipe,
  versionId: 'crinkle-cookies-v3',
  translationState: { uk: 'reviewed', en: 'sourceDraft', es: 'sourceDraft' },
  baseProvenance: {
    ...crinkleCookiesRecipe.baseProvenance,
    sourceIds: [
      ...crinkleCookiesRecipe.baseProvenance.sourceIds,
      novemberSource.id,
    ],
    note: 'The author’s photos document the baked recipe. The two-hour minimum is the author’s updated timing guidance.',
  },
  sources: [...crinkleCookiesRecipe.sources, novemberSource],
  searchMetadata: {
    ...crinkleCookiesRecipe.searchMetadata,
    dateModified: null,
  },
  timing: {
    ...crinkleCookiesRecipe.timing,
    totalElapsedMinutes: 150,
    provenance: { state: 'authorGuidance', sourceIds: [novemberSource.id] },
    planningNote: {
      phaseId: 'chill',
      text: ukrainianSource('{duration} на охолодження тіста.'),
    },
    phases: crinkleCookiesRecipe.timing.phases.map((phase) =>
      phase.id === 'chill'
        ? { ...phase, duration: { kind: 'minimum', min: 2, unit: 'hour' } }
        : phase,
    ),
  },
  heroMediaId: authorHero.id,
  discovery: { ...crinkleCookiesRecipe.discovery, imageKind: 'author-photo' },
  media: [authorHero, ...ukrainianStepPhotos],
  steps: [
    prepareIngredients,
    ...crinkleCookiesRecipe.steps.flatMap((step) => {
      const { instruction, mediaIds } = ukrainianStepUpdates[step.id] ?? {};
      const updatedStep: RecipeStep = {
        ...step,
        instruction: instruction
          ? { ...step.instruction, uk: instruction }
          : step.instruction,
        mediaIds,
      };
      return step.id === 'beat-wet' ? [updatedStep, mixDry] : [updatedStep];
    }),
  ],
};
