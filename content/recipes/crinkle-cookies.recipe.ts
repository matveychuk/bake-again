import type { RecipeDraft } from './recipe.types.ts';
import { quantityFromGrams, quantityFromSpoons } from './spoon-weights.ts';

export const crinkleCookiesRecipe = {
  schemaVersion: 2,
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
    uk: 'Мармурове печиво «Тріщинки»',
    en: 'Marbled Crinkle Cookies',
    es: 'Galletas marmoladas craqueladas',
  },
  summary: {
    uk: 'Шоколадне печиво з ніжною серединою й цукровими тріщинками.',
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
    // Full elapsed time also includes cooling and depends on the number of trays.
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
        label: { uk: 'Охолодження', en: 'Chilling', es: 'Refrigeración' },
        duration: { kind: 'range', min: 3, max: 4, unit: 'hour' },
      },
      {
        id: 'maximum-hold',
        label: {
          uk: 'Максимальний час у холодильнику',
          en: 'Maximum refrigerated hold',
          es: 'Tiempo máximo en refrigeración',
        },
        duration: { kind: 'exact', value: 24, unit: 'hour' },
      },
      {
        id: 'bake',
        relatedStepId: 'bake-cookies',
        label: { uk: 'Випікання', en: 'Baking', es: 'Horneado' },
        duration: { kind: 'range', min: 8, max: 10, unit: 'minute' },
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
      amount: 20,
      unit: 'cookie',
      provenance: {
        state: 'repeatedlyVerified',
        sourceIds: ['author-update'],
      },
      availability: 'default',
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
  },
  configuration: {
    base: {
      status: 'Tested',
      geometryId: 'parchment-lined-baking-sheet',
      yieldId: 'default-batch',
      batchScale: 1,
    },
    geometryAdjustment: null,
    quantityAdjustment: {
      batchScale: { allowed: [0.5, 1, 1.5, 2] },
      useWhatIHave: null,
    },
    ingredientScaling: {
      default: { kind: 'linear', precision: 0.1, rounding: 'nearest' },
    },
  },
  equipment: [
    {
      id: 'baking-sheet',
      name: { uk: 'деко', en: 'baking sheet', es: 'bandeja de horno' },
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
      name: { uk: 'міксер', en: 'electric mixer', es: 'batidora eléctrica' },
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
  },
  beforeStart: [],
  ingredientSections: [
    {
      id: 'cookies',
      title: { uk: 'Печиво', en: 'Cookies', es: 'Galletas' },
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
            base: { kind: 'exact', value: 60, unit: 'g' },
            shopping: { mode: 'base' },
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
              name: { uk: 'яйця', en: 'eggs', es: 'huevos' },
            },
          ],
          quantity: {
            base: { kind: 'exact', value: 2, unit: 'piece' },
            shopping: { mode: 'base' },
          },
          scaling: { kind: 'discrete', increment: 1, rounding: 'manual' },
        },
        {
          id: 'sugar',
          options: [
            {
              ingredientId: 'granulated-sugar',
              name: { uk: 'цукор', en: 'sugar', es: 'azúcar' },
            },
          ],
          quantity: quantityFromGrams('granulated-sugar', 200),
        },
        {
          id: 'cocoa',
          options: [
            {
              ingredientId: 'cocoa-powder',
              name: { uk: 'какао', en: 'cocoa powder', es: 'cacao en polvo' },
            },
          ],
          quantity: {
            base: { kind: 'exact', value: 60, unit: 'g' },
            shopping: { mode: 'base' },
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
          quantity: quantityFromGrams('schar-mix-b', 120),
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
          quantity: quantityFromSpoons('baking-powder', 1, 'tsp'),
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
          quantity: quantityFromGrams('powdered-sugar', 100),
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
      technique: { id: 'soften-butter' },
      title: { uk: 'Збийте основу', en: 'Beat the base', es: 'Bate la base' },
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
      duration: { kind: 'range', min: 3, max: 4, unit: 'hour' },
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
      temperature: { value: 180, unit: 'C', ovenMode: 'conventional' },
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
      duration: { kind: 'range', min: 8, max: 10, unit: 'minute' },
      temperature: { value: 180, unit: 'C', ovenMode: 'conventional' },
      equipmentIds: ['baking-sheet'],
      mediaIds: ['crinkle-moist-cracks-v1'],
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
                name: { uk: 'волоський горіх', en: 'walnut', es: 'nuez' },
              },
              {
                ingredientId: 'pecan',
                name: { uk: 'горіх пекан', en: 'pecan', es: 'nuez pecana' },
              },
            ],
            choose: 1,
            quantity: {
              base: { kind: 'exact', value: 20, unit: 'piece' },
              shopping: { mode: 'base' },
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
} satisfies RecipeDraft;
