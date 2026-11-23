import type { LocalizedText, Recipe, RecipeMedia } from './recipe.types.ts';

function stepPhoto(
  filename: `${string}.webp`,
  alt: LocalizedText,
): RecipeMedia {
  return {
    id: filename.slice(0, -5),
    type: 'image',
    path: `/media/recipes/crinkle-cookies/selected/${filename}`,
    usage: ['step'],
    fit: 'cover',
    alt,
  };
}

const scharMix = 'Schär Mix B Bread';
const kingArthurMix = 'King Arthur Gluten-Free Measure for Measure Flour';
const kingArthurOption = {
  ingredientId: 'king-arthur-gluten-free-measure-for-measure',
  name: { uk: kingArthurMix, en: kingArthurMix, es: kingArthurMix },
};

export const crinkleCookiesRecipe = {
  schemaVersion: 3,
  id: 'crinkle-cookies',
  versionId: 'crinkle-cookies-v3',
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
    uk: 'Безглютенове шоколадне печиво «Тріщинки»',
    en: 'Gluten-free chocolate crinkle cookies',
    es: 'Galletas craqueladas de chocolate sin gluten',
  },
  summary: {
    uk: 'Мармурове печиво з какао й м’якою серединкою. У духовці кульки тіста піднімаються, і крізь білий шар цукрової пудри проступають шоколадні тріщинки.',
    en: 'These cocoa cookies have soft centres and a snowy coating of icing sugar that cracks as they bake.',
    es: 'Estas galletas de cacao quedan tiernas por dentro. Al hornearlas, la capa blanca de azúcar glas se abre y deja ver la masa de chocolate.',
  },
  categoryIds: ['cookies', 'sweet-baking'],
  situationIds: ['everyday', 'batter-on-hand'],
  difficulty: 'easy',
  baseProvenance: {
    state: 'tested',
    sourceIds: [
      'inventory-row',
      'archive-recipe',
      'author-update',
      'author-update-2026-11-23',
      'author-flour-2026-11-24',
    ],
    note: 'The author’s photos document the baked recipe. The two-hour minimum is the author’s updated timing guidance.',
  },
  timing: {
    activeMinutes: 30,
    totalElapsedMinutes: 150,
    provenance: {
      state: 'authorGuidance',
      sourceIds: ['author-update-2026-11-23'],
    },
    planningNote: {
      phaseId: 'chill',
      text: {
        uk: '{duration} на охолодження тіста.',
        en: '{duration} to chill the dough.',
        es: '{duration} de reposo en la nevera.',
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
          kind: 'minimum',
          min: 2,
          unit: 'hour',
        },
      },
      {
        id: 'maximum-hold',
        label: {
          uk: 'Максимальний час у холодильнику',
          en: 'Maximum chilling time',
          es: 'Tiempo máximo en la nevera',
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
        es: 'Bandeja forrada con papel de horno',
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
        es: 'batidora de varillas',
      },
    },
  ],
  flourConfiguration: {
    commercialMixLineId: 'flour',
    additionalStarchLineIds: [],
    provenance: {
      state: 'repeatedlyVerified',
      sourceIds: ['inventory-row', 'archive-note', 'author-flour-2026-11-24'],
      note: 'Schär Mix B Bread is the original flour. The author also baked a separate batch with the same weight of King Arthur Gluten-Free Measure for Measure Flour.',
    },
    testedAlternativeMixes: [
      {
        commercialMixId: kingArthurOption.ingredientId,
        name: kingArthurOption.name,
        provenance: { state: 'tested', sourceIds: ['author-flour-2026-11-24'] },
        availability: 'selectable',
      },
    ],
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
            es: 'ablandada',
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
                en: 'granulated sugar',
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
                uk: 'какао-порошок',
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
          choose: 1,
          options: [
            {
              ingredientId: 'schar-mix-b-bread',
              name: { uk: scharMix, en: scharMix, es: scharMix },
            },
            kingArthurOption,
          ],
          qualifier: {
            uk: 'Візьміть одну з двох перевірених сумішей.',
            en: 'Use one of the two tested flour blends.',
            es: 'Elige una de las dos mezclas probadas.',
          },
          quantity: {
            base: {
              kind: 'exact',
              value: 120,
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
                en: 'icing sugar (powdered sugar)',
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
      id: 'prepare-ingredients',
      title: {
        uk: 'Підготуйте інгредієнти',
        en: 'Get the ingredients ready',
        es: 'Prepara los ingredientes',
      },
      instruction: {
        uk: 'Заздалегідь дістаньте масло з холодильника, щоб воно розм’якло. Відміряйте інгредієнти для тіста. Цукрову пудру відкладіть для обкачування.',
        en: 'Take the butter out of the fridge ahead of time so it can soften. Measure out the dough ingredients and set the icing sugar aside for coating.',
        es: 'Saca la mantequilla de la nevera con antelación para que se ablande. Mide los ingredientes de la masa y reserva el azúcar glas para rebozar las galletas.',
      },
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
    },
    {
      id: 'beat-wet',
      technique: {
        id: 'soften-butter',
      },
      title: {
        uk: 'Збийте яйця з цукром і маслом',
        en: 'Beat the eggs, sugar and butter',
        es: 'Bate los huevos con el azúcar y la mantequilla',
      },
      instruction: {
        uk: 'Збийте яйця, цукор і м’яке вершкове масло міксером до світлої однорідної маси без шматочків масла.',
        en: 'Beat the eggs, sugar and softened butter with an electric mixer until the mixture is pale and no lumps of butter remain.',
        es: 'Bate los huevos, el azúcar y la mantequilla ablandada con las varillas eléctricas hasta que la mezcla esté más clara y no queden grumos de mantequilla.',
      },
      ingredientLineIds: ['eggs', 'sugar', 'butter'],
      equipmentIds: ['electric-mixer'],
      mediaIds: ['wet-ingredients-v2', 'beat-wet-v2'],
    },
    {
      id: 'mix-dry',
      title: {
        uk: 'Змішайте сухі інгредієнти',
        en: 'Combine the dry ingredients',
        es: 'Mezcla los ingredientes secos',
      },
      instruction: {
        uk: 'В окремій мисці змішайте какао-порошок, обрану борошняну суміш і розпушувач.',
        en: 'In a separate bowl, stir together your chosen flour blend, the cocoa powder and the baking powder.',
        es: 'En otro bol, mezcla el cacao en polvo, la mezcla de harinas que hayas elegido y la levadura química.',
      },
      ingredientLineIds: ['cocoa', 'flour', 'baking-powder'],
      mediaIds: ['mix-dry-v2'],
    },
    {
      id: 'combine-dough',
      title: {
        uk: 'Замісіть тісто',
        en: 'Mix the dough',
        es: 'Incorpora los ingredientes secos',
      },
      instruction: {
        uk: 'Всипте суху суміш у миску зі збитими яйцями, цукром і маслом. Перемішуйте на низькій швидкості міксером або тістомісом із гаком, доки не зникнуть сухі ділянки. Тісто буде липким.',
        en: 'Add the dry ingredients to the egg and butter mixture. Mix on low speed with an electric mixer or a stand mixer fitted with a dough hook until no dry patches remain. The dough will be sticky.',
        es: 'Añade los ingredientes secos a la mezcla de huevos y mantequilla. Mezcla a velocidad baja con la batidora de varillas o con el gancho de la amasadora hasta que no se vean restos de harina ni de cacao. La masa quedará pegajosa.',
      },
      ingredientLineIds: ['cocoa', 'flour', 'baking-powder'],
      equipmentIds: ['electric-mixer'],
      mediaIds: ['add-dry-v2', 'mix-dough-v2'],
    },
    {
      id: 'chill-dough',
      title: {
        uk: 'Охолодіть тісто',
        en: 'Chill the dough',
        es: 'Refrigera la masa',
      },
      instruction: {
        uk: 'Накрийте миску харчовою плівкою й поставте в холодильник щонайменше на 2 години. Тісто можна залишити в холодильнику до 24 годин.',
        en: 'Cover the bowl with cling film and chill the dough for at least 2 hours. It can stay in the fridge for up to 24 hours.',
        es: 'Tapa el bol con film y deja la masa en la nevera al menos 2 horas. Puedes dejarla allí hasta 24 horas.',
      },
      ingredientLineIds: [],
      durationPhaseId: 'chill',
      mediaIds: ['dough-before-chill-v2', 'cover-dough-v2'],
    },
    {
      id: 'preheat-oven',
      title: {
        uk: 'Підготуйте духовку й деко',
        en: 'Preheat the oven and line the baking sheet',
        es: 'Prepara el horno y la bandeja',
      },
      instruction: {
        uk: 'Поки тісто охолоджується, розігрійте духовку до 180 °C у режимі верхнього й нижнього нагріву. Застеліть деко пергаментом і насипте цукрову пудру в миску.',
        en: 'Leave the dough in the fridge while you preheat the oven to 180°C (conventional, no fan). Line a baking sheet with baking parchment and put the icing sugar in a bowl.',
        es: 'Deja la masa en la nevera mientras precalientas el horno a 180 °C con calor arriba y abajo, sin ventilador. Forra la bandeja con papel de horno y pon el azúcar glas en un bol.',
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
        en: 'Roll the dough balls in icing sugar',
        es: 'Forma las bolitas y rebózalas en azúcar glas',
      },
      instruction: {
        uk: 'Набирайте холодне тісто ложкою й швидко скочуйте між долонями кульки завбільшки з волоський горіх. За бажанням сховайте в кожну кульку шматочок волоського горіха або пекана. Одразу щедро обкачайте кульки в цукровій пудрі й викладіть на деко з великими проміжками.',
        en: 'Scoop up spoonfuls of chilled dough and quickly roll them between your palms into walnut-sized balls. For a nut centre, tuck a piece of walnut or pecan inside each one. Straight away, roll each ball in icing sugar until thickly coated. Space them well apart on the baking sheet to allow room to spread.',
        es: 'Toma porciones de masa fría con una cuchara y forma rápidamente bolitas del tamaño de una nuez. Si quieres, pon un trocito de nuez o de pacana en el centro de cada una. Rebózalas enseguida en abundante azúcar glas y colócalas bien separadas en la bandeja, porque se ensanchan al hornearse.',
      },
      ingredientLineIds: ['powdered-sugar'],
      equipmentIds: ['baking-sheet', 'parchment'],
      guidance: [
        {
          id: 'quick-cool-hands',
          kind: 'practicalTip',
          text: {
            uk: 'Від тепла рук тісто швидко м’якшає — не катайте його довго.',
            en: 'The warmth of your hands softens the dough, so roll each ball quickly.',
            es: 'La masa se ablanda con el calor de las manos. Manipúlala lo justo para darle forma.',
          },
        },
      ],
      mediaIds: ['cold-dough-pecans-v2', 'coat-in-sugar-v2', 'tray-spacing-v2'],
    },
    {
      id: 'bake-cookies',
      title: {
        uk: 'Спечіть печиво',
        en: 'Bake the cookies',
        es: 'Hornea las galletas',
      },
      instruction: {
        uk: 'Випікайте за 180 °C 8–10 хвилин. Виймайте деко, коли печиво підніметься, цукрова скоринка потріскається, а шоколадне тісто в тріщинках ще виглядатиме вологим. Печиво стане щільнішим, коли охолоне.',
        en: 'Bake at 180°C for 8–10 minutes. Take the cookies out when they have puffed up and the sugar coating has cracked, while the chocolate dough showing through the cracks still looks moist. The cookies will firm up as they cool.',
        es: 'Hornea a 180 °C durante 8–10 minutos. Saca la bandeja cuando las galletas se hayan hinchado y la capa de azúcar se haya agrietado. La masa de chocolate que asoma por las grietas aún debe verse húmeda. Las galletas ganarán firmeza al enfriarse.',
      },
      ingredientLineIds: [],
      temperature: {
        value: 180,
        unit: 'C',
        ovenMode: 'conventional',
      },
      equipmentIds: ['baking-sheet'],
      mediaIds: ['cookies-in-oven-v2', 'cracks-in-oven-v2'],
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
        uk: 'Дайте печиву повністю охолонути, а тоді перекладіть його в герметичний контейнер.',
        en: 'Let the cookies cool completely before storing them in an airtight container.',
        es: 'Deja que las galletas se enfríen por completo antes de guardarlas en un recipiente hermético.',
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
        uk: 'З волоським горіхом або пеканом',
        en: 'Walnut or pecan centre',
        es: 'Con nuez o pacana en el centro',
      },
      description: {
        uk: 'Під час формування покладіть усередину кожної кульки шматочок волоського горіха або пекана.',
        en: 'Tuck a piece of walnut or pecan inside each dough ball as you shape it.',
        es: 'Al formar las bolitas, pon un trocito de nuez o de pacana en el centro de cada una.',
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
                  es: 'pacana',
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
              uk: 'по шматочку в кожну кульку',
              en: 'one piece per dough ball',
              es: 'un trocito por bolita',
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
            uk: 'Набирайте холодне тісто ложкою й швидко формуйте кульки завбільшки з волоський горіх, ховаючи в кожну шматочок волоського горіха або пекана. Щедро обкачайте кульки в пудрі й викладіть на деко на відстані одна від одної.',
            en: 'Scoop up spoonfuls of chilled dough. Quickly roll each into a walnut-sized ball around a piece of walnut or pecan. Coat generously in icing sugar and space well apart on the baking sheet.',
            es: 'Toma porciones de masa fría con una cuchara. Forma rápidamente bolitas del tamaño de una nuez con un trocito de nuez o de pacana dentro. Rebózalas en abundante azúcar glas y colócalas bien separadas en la bandeja.',
          },
        },
      ],
    },
  ],
  heroMediaId: 'crinkle-author-hero-v1',
  media: [
    {
      id: 'crinkle-author-hero-v1',
      type: 'image',
      path: '/images/recipes/chocolate-crinkle-cookies-author-v1.webp',
      usage: ['hero', 'card'],
      alt: {
        uk: 'Шоколадні тріщинки в цукровій пудрі на тарілці, одне печиво розламане навпіл',
        en: 'Chocolate crinkle cookies on a plate, one broken open to show the dark centre beneath the icing sugar',
        es: 'Galletas craqueladas en un plato, una partida por la mitad para mostrar el interior de chocolate bajo el azúcar glas',
      },
    },
    stepPhoto('ingredients-v2.webp', {
      uk: 'Інгредієнти для тіста в окремому посуді, поруч два яйця',
      en: 'Butter, baking powder, cocoa, sugar and flour mix in separate dishes beside two eggs',
      es: 'Mantequilla, levadura química, cacao, azúcar y mezcla de harinas en recipientes separados junto a dos huevos',
    }),
    stepPhoto('wet-ingredients-v2.webp', {
      uk: 'Яйця, цукор і м’яке вершкове масло в мисці перед збиванням',
      en: 'Eggs, sugar and softened butter in a bowl before beating',
      es: 'Huevos, azúcar y mantequilla ablandada en un bol antes de batir',
    }),
    stepPhoto('beat-wet-v2.webp', {
      uk: 'Міксер збиває яйця, цукор і масло у світлу масу',
      en: 'Mixer beaters in the pale egg, sugar and butter mixture',
      es: 'Varillas batiendo la mezcla de huevos, azúcar y mantequilla hasta que aclare',
    }),
    stepPhoto('mix-dry-v2.webp', {
      uk: 'Какао, борошняну суміш і розпушувач перемішують ложкою в білій мисці',
      en: 'A spoon mixing cocoa, flour mix and baking powder in a white bowl',
      es: 'Una cuchara mezcla el cacao, la harina y la levadura química en un bol blanco',
    }),
    stepPhoto('add-dry-v2.webp', {
      uk: 'Суха суміш із какао поверх збитих яєць із цукром і маслом',
      en: 'Dry cocoa mixture on top of the beaten eggs, sugar and butter',
      es: 'Mezcla seca de cacao sobre los huevos batidos con azúcar y mantequilla',
    }),
    stepPhoto('mix-dough-v2.webp', {
      uk: 'Міксер вмішує сухі інгредієнти в шоколадне тісто',
      en: 'Mixer beaters working the dry ingredients into the chocolate dough',
      es: 'Varillas incorporando los ingredientes secos a la masa de chocolate',
    }),
    stepPhoto('dough-before-chill-v2.webp', {
      uk: 'Миска з липким шоколадним тістом перед охолодженням',
      en: 'Sticky chocolate cookie dough in a bowl before chilling',
      es: 'Masa de chocolate pegajosa en el bol antes de enfriarla',
    }),
    stepPhoto('cover-dough-v2.webp', {
      uk: 'Миска з шоколадним тістом, накрита харчовою плівкою',
      en: 'Bowl of chocolate dough covered with cling film',
      es: 'Bol de masa de chocolate tapado con film',
    }),
    stepPhoto('cold-dough-pecans-v2.webp', {
      uk: 'Холодне шоколадне тісто з ложкою, пекани й цукрова пудра біля дека',
      en: 'Chilled chocolate dough with a spoon, pecans and icing sugar beside the baking sheet',
      es: 'Masa fría con una cuchara, pacanas y azúcar glas junto a la bandeja de horno',
    }),
    stepPhoto('coat-in-sugar-v2.webp', {
      uk: 'Рука обкачує кульку шоколадного тіста в цукровій пудрі',
      en: 'A hand rolling a ball of chocolate dough in icing sugar',
      es: 'Una mano reboza una bolita de masa de chocolate en azúcar glas',
    }),
    stepPhoto('tray-spacing-v2.webp', {
      uk: 'Кульки тіста в пудрі викладені з проміжками на деку з пергаментом',
      en: 'Sugar-coated dough balls spaced apart on a lined baking sheet',
      es: 'Bolitas cubiertas de azúcar glas y separadas entre sí en la bandeja forrada con papel',
    }),
    stepPhoto('cookies-in-oven-v2.webp', {
      uk: 'Кульки шоколадного тіста в цукровій пудрі на деку в духовці',
      en: 'Chocolate dough balls coated in icing sugar on a tray in the oven',
      es: 'Bolitas de masa de chocolate cubiertas de azúcar glas en el horno',
    }),
    stepPhoto('cracks-in-oven-v2.webp', {
      uk: 'На цукровій скоринці печива в духовці з’являються тріщинки',
      en: 'Cracks forming in the sugar coating as the chocolate cookies bake',
      es: 'Grietas en la capa de azúcar de las galletas durante el horneado',
    }),
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
      id: 'author-flour-2026-11-24',
      file: 'Current Codex conversation',
      locator:
        'Sasha confirmed 120 g King Arthur Gluten-Free Measure for Measure Flour for 20 crinkle cookies, used in place of Schär Mix B Bread.',
    },
    {
      id: 'author-update-2026-11-23',
      file: 'Current Codex conversation and photographs from 2026-11-22',
      locator:
        'Author’s Ukrainian method, timing and photo selections on 2026-11-23',
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
    dateModified: '2026-11-24',
    dateModifiedVersionId: 'crinkle-cookies-v3',
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
      en: [
        'gluten-free chocolate crinkle cookies',
        'chocolate cookies with cocoa powder',
      ],
      es: [
        'galletas craqueladas de chocolate sin gluten',
        'galletas de cacao sin gluten',
      ],
    },
  },
  evidenceExplanation: {
    en: 'Each flour blend listed below was tested in a separate batch.',
    es: 'La receta se ha probado con cada mezcla de harinas por separado.',
    uk: 'Печиво випробувано з кожною з указаних сумішей окремо.',
  },
  discovery: {
    cardTitle: {
      uk: 'Шоколадне печиво «Тріщинки»',
      en: 'Chocolate crinkle cookies',
      es: 'Galletas craqueladas de chocolate',
    },
    category: {
      en: 'Cookies',
      es: 'Galletas',
      uk: 'Печиво',
    },
    flourSummary: {
      uk: `${scharMix} або ${kingArthurMix}`,
      en: `${scharMix} or ${kingArthurMix}`,
      es: `${scharMix} o ${kingArthurMix}`,
    },
    collectionIds: ['everyday', 'batter-on-hand'],
    catalogue: true,
    imageKind: 'author-photo',
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
      uk: 'Шоколадне печиво «Тріщинки»',
      en: 'Chocolate crinkle cookies',
      es: 'Galletas craqueladas de chocolate',
    },
  },
  translationReview: {
    date: '2026-11-24',
    reviewer: 'implementation',
    scope:
      'Editorial review of Ukrainian copy and English and Spanish localization of the November method, photo descriptions, nut variation and search copy.',
  },
  seo: {
    uk: {
      title: 'Шоколадне печиво «Тріщинки» без глютену',
      description:
        'Шоколадне печиво «Тріщинки» без глютену з какао й цукровою пудрою. Рецепт із фото на 20 штук. Як сформувати кульки й спекти печиво з м’якою серединкою.',
    },
    en: {
      title: 'Gluten-free chocolate crinkle cookies',
      description:
        'Bake 20 gluten-free chocolate crinkle cookies with cocoa powder and icing sugar. Step-by-step photos show how to shape the sticky dough and when to take the cookies out.',
    },
    es: {
      title: 'Galletas craqueladas de chocolate sin gluten',
      description:
        'Prepara 20 galletas craqueladas de chocolate sin gluten con cacao y azúcar glas. Las fotos paso a paso te muestran cómo darles forma y cuándo sacarlas del horno.',
    },
  },
  routeSlug: 'crinkle-cookies',
} satisfies Recipe;
