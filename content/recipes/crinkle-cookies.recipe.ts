import type { RecipeDraft } from './recipe.types.ts';

export const crinkleCookiesRecipe = {
  schemaVersion: 2,
  id: 'crinkle-cookies',
  versionId: 'crinkle-cookies-v1-draft',
  publicationStatus: 'draft',
  translationState: {
    uk: 'sourceDraft',
    en: 'draftTranslation',
    es: 'draftTranslation',
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
    uk: 'Какао-печиво з апельсиновою цедрою, яке піднімається й тріскається під час випікання.',
    en: 'Cocoa cookies with orange zest that rise and crack as they bake.',
    es: 'Galletas de cacao con ralladura de naranja que suben y se craquelan al hornearse.',
  },
  categoryIds: ['cookies', 'sweet-baking'],
  situationIds: ['everyday', 'batter-on-hand'],
  difficulty: 'easy',
  baseProvenance: {
    state: 'repeatedlyVerified',
    sourceIds: ['inventory-row', 'archive-recipe', 'author-update'],
    note: 'The author confirms the base recipe has been made many times with repeatable results.',
  },
  timing: {
    activeMinutes: 40,
    totalElapsedMinutes: null,
    planningNote: {
      phaseId: 'chill',
      text: {
        uk: 'Перед випіканням охолоджуйте тісто {duration}.',
        en: 'Chill the dough for {duration} before baking.',
        es: 'Refrigera la masa durante {duration} antes de hornear.',
      },
    },
    phases: [
      {
        id: 'chill',
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
  beforeStart: [
    {
      id: 'plan-chill',
      relatedStepId: 'chill-dough',
      text: {
        uk: 'Тісто потрібно охолоджувати 3–4 години; його можна залишити в холодильнику до 24 годин.',
        en: 'Chill the dough for 3–4 hours; it may remain refrigerated for up to 24 hours.',
        es: 'Refrigera la masa durante 3–4 horas; puede permanecer en la nevera hasta 24 horas.',
      },
    },
    {
      id: 'prepare-fast-shaping',
      relatedStepId: 'shape-and-coat',
      text: {
        uk: 'Підготуйте деко, пергамент і миску зі 100 г цукрової пудри до того, як дістанете тісто з холодильника: холодне тісто дуже липке й швидко м’якшає в руках.',
        en: 'Prepare the baking sheet, parchment and a bowl with 100 g powdered sugar before taking the dough from the refrigerator: the cold dough is very sticky and softens quickly in your hands.',
        es: 'Prepara la bandeja, el papel de horno y un bol con 100 g de azúcar glas antes de sacar la masa de la nevera: la masa fría es muy pegajosa y se ablanda rápidamente en las manos.',
      },
    },
  ],
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
          quantity: {
            base: { kind: 'exact', value: 200, unit: 'g' },
            shopping: { mode: 'base' },
          },
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
          quantity: {
            base: { kind: 'exact', value: 120, unit: 'g' },
            shopping: { mode: 'base' },
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
            base: { kind: 'exact', value: 1, unit: 'tsp' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'orange-zest',
          options: [
            {
              ingredientId: 'orange',
              name: { uk: 'апельсин', en: 'orange', es: 'naranja' },
            },
          ],
          quantity: {
            base: { kind: 'exact', value: 1, unit: 'piece' },
            shopping: { mode: 'base' },
          },
          scaling: { kind: 'discrete', increment: 1, rounding: 'manual' },
          preparation: {
            uk: 'використати цедру',
            en: 'zest only',
            es: 'usar solo la ralladura',
          },
        },
        {
          id: 'powdered-sugar',
          options: [
            {
              ingredientId: 'powdered-sugar',
              name: {
                uk: 'цукрова пудра',
                en: 'powdered sugar',
                es: 'azúcar glas',
              },
            },
          ],
          quantity: {
            base: { kind: 'exact', value: 100, unit: 'g' },
            shopping: { mode: 'base' },
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
      title: {
        uk: 'Збийте яйця, цукор і масло',
        en: 'Beat the eggs, sugar and butter',
        es: 'Bate los huevos, el azúcar y la mantequilla',
      },
      instruction: {
        uk: 'З’єднайте 2 яйця, 200 г цукру й 60 г м’якого вершкового масла. Збивайте міксером, доки маса не посвітлішає і не стане однорідною.',
        en: 'Combine 2 eggs, 200 g sugar and 60 g softened butter. Beat with an electric mixer until the mixture is pale and even.',
        es: 'Mezcla 2 huevos, 200 g de azúcar y 60 g de mantequilla blanda. Bate con batidora eléctrica hasta que la mezcla esté clara y uniforme.',
      },
      ingredientLineIds: ['eggs', 'sugar', 'butter'],
      equipmentIds: ['electric-mixer'],
      guidance: [
        {
          id: 'pale-even-base',
          kind: 'checkpoint',
          text: {
            uk: 'Маса світла й однорідна, без окремих шматочків масла.',
            en: 'The mixture is pale and even, with no separate pieces of butter.',
            es: 'La mezcla está clara y uniforme, sin trozos separados de mantequilla.',
          },
        },
      ],
      mediaIds: ['crinkle-pale-wet-base-v1'],
    },
    {
      id: 'mix-dry',
      title: {
        uk: 'Змішайте сухі інгредієнти',
        en: 'Mix the dry ingredients',
        es: 'Mezcla los ingredientes secos',
      },
      instruction: {
        uk: 'В окремій мисці змішайте 60 г какао, 120 г борошняної суміші Schär Mix B Bread і 1 ч. л. розпушувача.',
        en: 'In a separate bowl, mix 60 g cocoa powder, 120 g Schär Mix B Bread flour mix and 1 tsp baking powder.',
        es: 'En otro bol, mezcla 60 g de cacao en polvo, 120 g de mezcla de harina Schär Mix B Bread y 1 cucharadita de levadura química.',
      },
      ingredientLineIds: ['cocoa', 'flour', 'baking-powder'],
      guidance: [
        {
          id: 'even-dry-mixture',
          kind: 'checkpoint',
          text: {
            uk: 'Суміш має рівномірний шоколадний колір, без світлих ділянок борошна чи розпушувача.',
            en: 'The mixture is an even chocolate colour, with no pale patches of flour or baking powder.',
            es: 'La mezcla tiene un color chocolate uniforme, sin zonas claras de harina ni levadura química.',
          },
        },
      ],
    },
    {
      id: 'combine-dough',
      title: {
        uk: 'Замісіть шоколадне тісто',
        en: 'Mix the chocolate dough',
        es: 'Mezcla la masa de chocolate',
      },
      instruction: {
        uk: 'Додайте суху суміш до збитих яєць, цукру й масла. Збивайте до повного поєднання. Наприкінці додайте цедру 1 апельсина й коротко перемішайте ще раз.',
        en: 'Add the dry mixture to the beaten eggs, sugar and butter. Beat until fully combined. Add the zest of 1 orange at the end and mix briefly once more.',
        es: 'Añade la mezcla seca a los huevos, el azúcar y la mantequilla batidos. Bate hasta integrar por completo. Al final, añade la ralladura de 1 naranja y mezcla brevemente una vez más.',
      },
      ingredientLineIds: ['cocoa', 'flour', 'baking-powder', 'orange-zest'],
      equipmentIds: ['electric-mixer'],
      guidance: [
        {
          id: 'sticky-even-dough',
          kind: 'checkpoint',
          text: {
            uk: 'Тісто рівномірно шоколадне й дуже липке, без сухих ділянок; цедра розподілена по всій масі.',
            en: 'The dough is evenly chocolate-coloured and very sticky, with no dry patches and the zest distributed throughout.',
            es: 'La masa tiene un color chocolate uniforme y está muy pegajosa, sin zonas secas y con la ralladura bien repartida.',
          },
        },
      ],
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
        uk: 'Накрийте тісто й поставте в холодильник на 3–4 години. За потреби його можна залишити там до 24 годин. Після охолодження тісто все одно буде дуже липким і швидко м’якшатиме від тепла рук — це нормально.',
        en: 'Cover the dough and refrigerate it for 3–4 hours. If needed, it may remain refrigerated for up to 24 hours. The chilled dough will still be very sticky and will soften quickly from the warmth of your hands; this is normal.',
        es: 'Cubre la masa y refrigérala durante 3–4 horas. Si hace falta, puede permanecer en la nevera hasta 24 horas. Incluso fría seguirá muy pegajosa y se ablandará rápidamente con el calor de las manos; es normal.',
      },
      ingredientLineIds: [],
      duration: { kind: 'range', min: 3, max: 4, unit: 'hour' },
      guidance: [
        {
          id: 'cold-scoopable-dough',
          kind: 'checkpoint',
          text: {
            uk: 'Тісто холодне й достатньо щільне, щоб його можна було набирати ложкою та швидко формувати.',
            en: 'The dough is cold and firm enough to scoop with a spoon and shape quickly.',
            es: 'La masa está fría y suficientemente firme para tomarla con una cuchara y darle forma rápidamente.',
          },
        },
      ],
      mediaIds: ['crinkle-chilled-dough-scoop-v1'],
    },
    {
      id: 'preheat-oven',
      title: {
        uk: 'Підготуйте духовку й деко',
        en: 'Prepare the oven and baking sheet',
        es: 'Prepara el horno y la bandeja',
      },
      instruction: {
        uk: 'Розігрійте духовку до 180°C у режимі верх-низ. Застеліть деко пергаментом і насипте 100 г цукрової пудри в окрему миску.',
        en: 'Preheat the oven to 180°C conventional heat. Line a baking sheet with parchment and place 100 g powdered sugar in a separate bowl.',
        es: 'Precalienta el horno a 180°C con calor arriba y abajo. Forra una bandeja con papel de horno y pon 100 g de azúcar glas en otro bol.',
      },
      ingredientLineIds: ['powdered-sugar'],
      temperature: { value: 180, unit: 'C', ovenMode: 'conventional' },
      equipmentIds: ['baking-sheet', 'parchment'],
      guidance: [
        {
          id: 'prepare-before-shaping',
          kind: 'practicalTip',
          text: {
            uk: 'Підготуйте все до того, як дістанете тісто з холодильника. Так воно менше нагріється під час формування.',
            en: 'Prepare everything before taking the dough from the refrigerator so it warms as little as possible while shaping.',
            es: 'Prepara todo antes de sacar la masa de la nevera para que se caliente lo menos posible al darle forma.',
          },
        },
      ],
    },
    {
      id: 'shape-and-coat',
      title: {
        uk: 'Швидко сформуйте печиво',
        en: 'Shape the cookies quickly',
        es: 'Forma las galletas rápidamente',
      },
      instruction: {
        uk: 'Набирайте холодне тісто ложкою. Максимально швидко скачайте кожну порцію в кульку розміром із волоський горіх. Не катайте довго: від тепла рук масло почне танути, а тісто стане ще липкішим. Одразу ретельно обкачайте кульку в цукровій пудрі й викладіть на деко. Залишайте між заготовками велику відстань.',
        en: 'Scoop the cold dough with a spoon. As quickly as possible, roll each portion into a walnut-sized ball. Do not roll it for long: the warmth of your hands will melt the butter and make the dough even stickier. Immediately coat the ball thoroughly in powdered sugar and place it on the baking sheet, leaving plenty of space between portions.',
        es: 'Toma la masa fría con una cuchara. Forma cada porción en una bola del tamaño de una nuez lo más rápido posible. No la hagas rodar mucho tiempo: el calor de las manos derretirá la mantequilla y volverá la masa aún más pegajosa. Rebózala enseguida por completo en azúcar glas y colócala en la bandeja, dejando bastante espacio entre las porciones.',
      },
      ingredientLineIds: ['powdered-sugar'],
      equipmentIds: ['baking-sheet', 'parchment'],
      guidance: [
        {
          id: 'quick-cool-hands',
          kind: 'practicalTip',
          text: {
            uk: 'Торкання руками має бути мінімальним: округліть порцію й одразу переносьте її в пудру.',
            en: 'Keep hand contact to a minimum: round the portion and move it straight into the powdered sugar.',
            es: 'Mantén al mínimo el contacto con las manos: redondea la porción y pásala directamente al azúcar glas.',
          },
        },
        {
          id: 'fully-coated-ball',
          kind: 'checkpoint',
          text: {
            uk: 'Кулька зберігає округлу форму й повністю вкрита щільним білим шаром пудри.',
            en: 'The ball keeps its rounded shape and is completely covered with a dense white layer of powdered sugar.',
            es: 'La bola mantiene la forma redonda y está completamente cubierta por una capa blanca y densa de azúcar glas.',
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
        uk: 'Випікайте до вологих тріщинок',
        en: 'Bake until the cracks still look moist',
        es: 'Hornea hasta que las grietas aún se vean húmedas',
      },
      instruction: {
        uk: 'Випікайте печиво за 180°C протягом 8–10 хвилин. Не чекайте, доки тріщинки стануть сухими: печиво продовжить стабілізуватися під час охолодження.',
        en: 'Bake the cookies at 180°C for 8–10 minutes. Do not wait for the cracks to look dry; the cookies will continue to set as they cool.',
        es: 'Hornea las galletas a 180°C durante 8–10 minutos. No esperes a que las grietas se vean secas; las galletas seguirán asentándose mientras se enfrían.',
      },
      ingredientLineIds: [],
      duration: { kind: 'range', min: 8, max: 10, unit: 'minute' },
      temperature: { value: 180, unit: 'C', ovenMode: 'conventional' },
      equipmentIds: ['baking-sheet'],
      guidance: [
        {
          id: 'moist-cracks',
          kind: 'checkpoint',
          text: {
            uk: 'Печиво має піднятися й потріскатися, а тріщинки повинні здаватися вологими.',
            en: 'The cookies should rise and crack, and the cracks should still look moist.',
            es: 'Las galletas deben subir y craquelarse; las grietas aún deben parecer húmedas.',
          },
        },
      ],
      mediaIds: ['crinkle-moist-cracks-v1'],
    },
    {
      id: 'cool-cookies',
      title: {
        uk: 'Повністю остудіть',
        en: 'Cool completely',
        es: 'Deja enfriar por completo',
      },
      instruction: {
        uk: 'Повністю остудіть печиво. Його можна одразу перекласти з дека або залишити остигати на ньому — на результат це не впливає.',
        en: 'Cool the cookies completely. You may transfer them from the baking sheet immediately or leave them to cool on it; either method works.',
        es: 'Deja enfriar las galletas por completo. Puedes pasarlas de inmediato de la bandeja o dejarlas enfriar sobre ella; ambos métodos funcionan.',
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
            en: 'While shaping, insert a walnut or pecan into each dough ball, then coat it in powdered sugar.',
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
      path: '/images/recipes/chocolate-crinkle-cookies-card-v1.png',
      usage: ['hero', 'gallery'],
      alt: {
        uk: 'Шоколадне печиво тріщинки в цукровій пудрі на керамічній тарілці',
        en: 'Chocolate crinkle cookies dusted with powdered sugar on a ceramic plate',
        es: 'Galletas craqueladas de chocolate con azúcar glas sobre un plato de cerámica',
      },
    },
    {
      id: 'crinkle-pale-wet-base-v1',
      type: 'image',
      path: '/media/recipes/crinkle-cookies/selected/step-01-pale-wet-base-v1.png',
      usage: ['step'],
      alt: {
        uk: 'Світла однорідна суміш яєць, цукру й м’якого масла стікає з вінчиків у керамічну миску',
        en: 'Pale even mixture of eggs, sugar and softened butter falling from mixer beaters into a ceramic bowl',
        es: 'Mezcla clara y uniforme de huevos, azúcar y mantequilla blanda cayendo de las varillas a un bol de cerámica',
      },
      caption: {
        uk: 'Збивайте, доки маса не стане світлою й однорідною.',
        en: 'Beat until the mixture is pale and even.',
        es: 'Bate hasta que la mezcla esté clara y uniforme.',
      },
    },
    {
      id: 'crinkle-finished-sticky-dough-v1',
      type: 'image',
      path: '/media/recipes/crinkle-cookies/selected/step-03-finished-sticky-dough-v1.png',
      usage: ['step'],
      alt: {
        uk: 'Дуже липке шоколадне тісто з апельсиновою цедрою тягнеться за лопаткою над керамічною мискою',
        en: 'Very sticky chocolate dough with orange zest stretching from a spatula above a ceramic bowl',
        es: 'Masa de chocolate muy pegajosa con ralladura de naranja estirándose desde una espátula sobre un bol de cerámica',
      },
      caption: {
        uk: 'Готове тісто рівномірно шоколадне й дуже липке.',
        en: 'The finished dough is evenly chocolate-coloured and very sticky.',
        es: 'La masa terminada tiene un color chocolate uniforme y está muy pegajosa.',
      },
    },
    {
      id: 'crinkle-chilled-dough-scoop-v1',
      type: 'image',
      path: '/media/recipes/crinkle-cookies/selected/step-04-chilled-dough-scoop-v1.png',
      usage: ['step'],
      alt: {
        uk: 'Ложка набирає порцію холодного липкого шоколадного тіста з керамічної миски',
        en: 'A spoon scoops a portion of cold sticky chocolate dough from a ceramic bowl',
        es: 'Una cuchara toma una porción de masa de chocolate fría y pegajosa de un bol de cerámica',
      },
      caption: {
        uk: 'Навіть після охолодження набирайте липке тісто ложкою.',
        en: 'Even after chilling, scoop the sticky dough with a spoon.',
        es: 'Incluso después de enfriarla, toma la masa pegajosa con una cuchara.',
      },
    },
    {
      id: 'crinkle-fast-shape-coat-v1',
      type: 'image',
      path: '/media/recipes/crinkle-cookies/selected/step-06-fast-shape-coat-v1.png',
      usage: ['step'],
      alt: {
        uk: 'Руки швидко округлюють шоколадне тісто над мискою з цукровою пудрою; поруч лежить обкачана кулька',
        en: 'Hands quickly round chocolate dough over a bowl of powdered sugar beside a fully coated ball',
        es: 'Unas manos redondean rápidamente masa de chocolate sobre un bol con azúcar glas junto a una bola ya rebozada',
      },
      caption: {
        uk: 'Швидко округліть порцію й одразу обкачайте її в пудрі.',
        en: 'Round the portion quickly and coat it in powdered sugar straight away.',
        es: 'Redondea rápidamente la porción y rebózala enseguida en azúcar glas.',
      },
    },
    {
      id: 'crinkle-tray-spacing-options-v1',
      type: 'image',
      path: '/media/recipes/crinkle-cookies/selected/step-06-tray-spacing-options-v1.png',
      usage: ['step'],
      alt: {
        uk: 'Обкачані в цукровій пудрі кульки тіста далеко одна від одної на деку; частина з волоським горіхом або пеканом',
        en: 'Powdered-sugar-coated dough balls spaced far apart on a baking sheet, some topped with walnut or pecan',
        es: 'Bolas de masa cubiertas de azúcar glas bien separadas en una bandeja, algunas con nuez o nuez pecana',
      },
      caption: {
        uk: 'Залишайте велику відстань; печиво можна пекти з горіхом або без нього.',
        en: 'Leave plenty of space; bake the cookies with or without a nut.',
        es: 'Deja bastante espacio; las galletas pueden hornearse con o sin fruto seco.',
      },
    },
    {
      id: 'crinkle-moist-cracks-v1',
      type: 'image',
      path: '/media/recipes/crinkle-cookies/selected/step-07-moist-cracks-v1.png',
      usage: ['step'],
      alt: {
        uk: 'Щойно спечене шоколадне печиво з виразними тріщинами, всередині яких тісто ще виглядає вологим',
        en: 'Freshly baked chocolate crinkle cookies with pronounced cracks whose exposed dough still looks moist',
        es: 'Galletas de chocolate recién horneadas con grietas marcadas cuya masa expuesta aún se ve húmeda',
      },
      caption: {
        uk: 'Виймайте печиво, коли тріщинки ще виглядають вологими.',
        en: 'Remove the cookies while the cracks still look moist.',
        es: 'Saca las galletas cuando las grietas aún se vean húmedas.',
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
      locator: 'Author confirmations on 2026-09-07 and 2026-09-17',
    },
    {
      id: 'archive-note',
      file: 'docs/reference/recipe-inventory.xlsx',
      locator: 'Recipe Archive!A95:B95',
    },
  ],
  contentGaps: [
    {
      id: 'reconcile-total-time',
      area: 'timing',
      field: 'timing.totalElapsedMinutes',
      question:
        'The author reported 40 minutes active and 3.5 hours total, while the recorded minimum phases are 3 hours chilling plus 8 minutes baking. Confirm whether 3.5 hours is an approximate display value and whether cooling is included.',
      publicationBlocking: true,
      sourceIds: ['archive-recipe', 'author-update'],
    },
    {
      id: 'add-hero-image',
      area: 'image',
      field: 'media.crinkle-generated-card-v1',
      question:
        'Approve or replace the generated preview image before final publication.',
      publicationBlocking: true,
      sourceIds: ['inventory-row'],
    },
    {
      id: 'review-translations',
      area: 'translation',
      field: 'translationState.en/es',
      question: 'Human-review the EN and ES recipe wording and SEO slugs.',
      publicationBlocking: true,
      sourceIds: ['archive-recipe'],
    },
    {
      id: 'record-storage-duration',
      area: 'storage',
      field: 'storage',
      question:
        'If known, record how long the cookies remain suitable in an airtight container.',
      publicationBlocking: false,
      sourceIds: ['archive-recipe'],
    },
  ],
} satisfies RecipeDraft;
