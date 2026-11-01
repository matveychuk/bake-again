import type { Recipe } from './recipe.types.ts';

export const cinnamonRollsRecipe = {
  schemaVersion: 3,
  id: 'cinnamon-rolls',
  versionId: 'cinnamon-rolls-source-v1',
  publicationStatus: 'unpublished',
  translationState: {
    uk: 'reviewed',
    en: 'reviewed',
    es: 'reviewed',
  },
  slug: {
    en: 'cinnamon-rolls',
    es: 'cinnamon-rolls',
    uk: 'cinnamon-rolls',
  },
  title: {
    en: 'Gluten-free cinnamon rolls',
    es: 'Rollos de canela sin gluten',
    uk: 'Безглютенові булочки з корицею',
  },
  summary: {
    en: 'Cinnamon rolls recorded in the working inventory.',
    es: 'Rollos de canela registrados en el inventario de trabajo.',
    uk: 'Булочки з корицею, записані в робочому каталозі.',
  },
  categoryIds: [],
  situationIds: [],
  difficulty: null,
  baseProvenance: {
    state: 'tested',
    sourceIds: ['cinnamon-rolls-recorded-source'],
  },
  timing: {
    activeMinutes: null,
    totalElapsedMinutes: null,
    planningNote: null,
    phases: [
      {
        id: 'activate-yeast',
        label: {
          en: 'Activate yeast',
          es: 'Activar la levadura',
          uk: 'Активація дріжджів',
        },
        duration: {
          kind: 'exact',
          value: 10,
          unit: 'minute',
        },
        relatedStepId: 'activate-yeast',
      },
      {
        id: 'mix-dough',
        label: {
          en: 'Mix dough',
          es: 'Amasar la masa',
          uk: 'Замішування тіста',
        },
        duration: {
          kind: 'exact',
          value: 5,
          unit: 'minute',
        },
        relatedStepId: 'mix-dough',
      },
      {
        id: 'first-proof',
        label: {
          en: 'First proof',
          es: 'Primer levado',
          uk: 'Перший підйом',
        },
        duration: {
          kind: 'exact',
          value: 1,
          unit: 'hour',
        },
        relatedStepId: 'first-proof',
      },
      {
        id: 'second-proof',
        label: {
          en: 'Second proof',
          es: 'Segundo levado',
          uk: 'Другий підйом',
        },
        duration: {
          kind: 'range',
          min: 40,
          max: 60,
          unit: 'minute',
        },
        relatedStepId: 'second-proof',
      },
      {
        id: 'bake',
        label: {
          en: 'Bake',
          es: 'Hornear',
          uk: 'Випікання',
        },
        duration: {
          kind: 'exact',
          value: 20,
          unit: 'minute',
        },
        relatedStepId: 'bake',
      },
    ],
  },
  yield: {
    default: {
      id: 'cinnamon-rolls-yield',
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
        sourceIds: ['cinnamon-rolls-recorded-source'],
      },
      availability: 'default',
    },
    alternatives: [],
  },
  geometry: {
    state: 'known',
    default: {
      id: 'round-baking-dish',
      label: {
        en: 'Round baking dish · size to confirm',
        es: 'Fuente redonda · tamaño por confirmar',
        uk: 'Кругла форма · розмір потрібно уточнити',
      },
      kind: 'bakingPan',
      application: 'bake-in',
      shape: 'round',
      diameterCm: null,
      layerCount: null,
      material: null,
      provenance: {
        state: 'tested',
        sourceIds: ['cinnamon-rolls-recorded-source'],
      },
      availability: 'default',
    },
    alternatives: [],
  },
  configuration: {
    base: {
      geometryId: 'round-baking-dish',
      yieldId: 'cinnamon-rolls-yield',
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
  ],
  flourConfiguration: {
    commercialMixLineId: null,
    additionalStarchLineIds: ['corn-starch', 'tapioca-starch'],
    xanthanLineId: 'xanthan',
    provenance: {
      state: 'tested',
      sourceIds: ['cinnamon-rolls-recorded-source'],
    },
    testedAlternativeMixes: [],
    knownUnsupportedMixes: [],
    basis: 'customBlend',
    flourLineIds: ['rice-flour'],
  },
  beforeStart: [
    {
      id: 'before-0',
      text: {
        en: 'Soften the butter until spreadable. Use the source ratio of 120 g water, milk or lukewarm almond milk.',
        es: 'Ablanda la mantequilla hasta que se pueda untar. Usa los 120 g de agua, leche o leche de almendra templada indicados por la fuente.',
        uk: 'Розм’якшіть масло до консистенції, зручної для намазування. Візьміть 120 г води, молока або теплого мигдального молока, як у джерелі.',
      },
    },
    {
      id: 'before-1',
      text: {
        en: 'Choose one filling before starting. The source does not give quantities for the cocoa-peanut option.',
        es: 'Elige un relleno antes de empezar. La fuente no indica cantidades para la opción de cacao y cacahuete.',
        uk: 'До початку оберіть одну начинку. У джерелі не вказані кількості для какао-арахісового варіанта.',
      },
    },
  ],
  ingredientSections: [
    {
      id: 'dough',
      title: {
        en: 'Dough',
        es: 'Masa',
        uk: 'Тісто',
      },
      lines: [
        {
          id: 'eggs',
          options: [
            {
              ingredientId: 'eggs',
              name: {
                en: 'Large eggs',
                es: 'Huevos L',
                uk: 'Великі яйця',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 4,
              unit: 'piece',
            },
            shopping: {
              mode: 'base',
            },
          },
        },
        {
          id: 'dry-yeast',
          options: [
            {
              ingredientId: 'dry-yeast',
              name: {
                en: "Dry baker's yeast",
                es: 'Levadura seca de panadería',
                uk: 'Сухі хлібопекарські дріжджі',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 15,
              unit: 'g',
            },
            shopping: {
              mode: 'base',
            },
          },
        },
        {
          id: 'honey-or-agave',
          options: [
            {
              ingredientId: 'honey-or-agave',
              name: {
                en: 'Honey or agave syrup',
                es: 'Miel o sirope de agave',
                uk: 'Мед або сироп агави',
              },
            },
          ],
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
          qualifier: {
            en: 'Reserve 1 tbsp to activate the yeast',
            es: 'Reserva 1 cucharada para activar la levadura',
            uk: '1 ст. л. залишити для активації дріжджів',
          },
        },
        {
          id: 'vanilla',
          options: [
            {
              ingredientId: 'vanilla',
              name: {
                en: 'Vanilla paste or extract',
                es: 'Pasta o extracto de vainilla',
                uk: 'Ванільна паста або екстракт',
              },
            },
          ],
          quantity: {
            base: {
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
          id: 'butter',
          options: [
            {
              ingredientId: 'butter',
              name: {
                en: 'Butter',
                es: 'Mantequilla',
                uk: 'Вершкове масло',
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
          qualifier: {
            en: 'Softened',
            es: 'En pomada',
            uk: 'М’яке',
          },
        },
        {
          id: 'water-or-milk',
          options: [
            {
              ingredientId: 'water-or-milk',
              name: {
                en: 'Water or milk',
                es: 'Agua o leche',
                uk: 'Вода або молоко',
              },
            },
          ],
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
          qualifier: {
            en: 'The source uses lukewarm almond milk',
            es: 'La fuente usa leche de almendra templada',
            uk: 'У джерелі використане тепле мигдальне молоко',
          },
        },
        {
          id: 'corn-starch',
          options: [
            {
              ingredientId: 'corn-starch',
              name: {
                en: 'Corn starch',
                es: 'Almidón de maíz',
                uk: 'Кукурудзяний крохмаль',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 240,
              unit: 'g',
            },
            equivalent: {
              kind: 'exact',
              value: 34.2857,
              unit: 'tbsp',
            },
            shopping: {
              mode: 'base',
            },
          },
        },
        {
          id: 'tapioca-starch',
          options: [
            {
              ingredientId: 'tapioca-starch',
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
              value: 120,
              unit: 'g',
            },
            equivalent: {
              kind: 'exact',
              value: 8,
              unit: 'tbsp',
            },
            shopping: {
              mode: 'base',
            },
          },
        },
        {
          id: 'rice-flour',
          options: [
            {
              ingredientId: 'rice-flour',
              name: {
                en: 'Rice flour',
                es: 'Harina de arroz',
                uk: 'Рисове борошно',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 140,
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
                en: 'Baking powder',
                es: 'Levadura química',
                uk: 'Розпушувач',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 15,
              unit: 'g',
            },
            equivalent: {
              kind: 'exact',
              value: 3,
              unit: 'tsp',
            },
            shopping: {
              mode: 'base',
            },
          },
        },
        {
          id: 'xanthan',
          options: [
            {
              ingredientId: 'xanthan',
              name: {
                en: 'Xanthan gum',
                es: 'Goma xantana',
                uk: 'Ксантанова камедь',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 12,
              unit: 'g',
            },
            equivalent: {
              kind: 'exact',
              value: 4,
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
              value: 6,
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
      ],
    },
    {
      id: 'cinnamon-filling',
      title: {
        en: 'Filling option 1 · cinnamon',
        es: 'Relleno opción 1 · canela',
        uk: 'Начинка 1 · кориця',
      },
      lines: [
        {
          id: 'filling-sugar',
          options: [
            {
              ingredientId: 'filling-sugar',
              name: {
                en: 'Coconut, panela or brown sugar',
                es: 'Azúcar de coco, panela o azúcar moreno',
                uk: 'Кокосовий, тростинний або коричневий цукор',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 4,
              unit: 'tbsp',
            },
            shopping: {
              mode: 'base',
            },
          },
          optional: true,
        },
        {
          id: 'cinnamon',
          options: [
            {
              ingredientId: 'cinnamon',
              name: {
                en: 'Ground cinnamon',
                es: 'Canela molida',
                uk: 'Мелена кориця',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 2,
              unit: 'tsp',
            },
            shopping: {
              mode: 'base',
            },
          },
          optional: true,
        },
        {
          id: 'filling-butter',
          options: [
            {
              ingredientId: 'filling-butter',
              name: {
                en: 'Butter',
                es: 'Mantequilla',
                uk: 'Вершкове масло',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 50,
              unit: 'g',
            },
            shopping: {
              mode: 'base',
            },
          },
          optional: true,
          qualifier: {
            en: 'Softened; enough for a generous coating',
            es: 'En pomada; suficiente para una capa generosa',
            uk: 'М’яке; достатньо для щедрого шару',
          },
        },
      ],
    },
    {
      id: 'cocoa-filling',
      title: {
        en: 'Filling option 2 · cocoa and peanut',
        es: 'Relleno opción 2 · cacao y cacahuete',
        uk: 'Начинка 2 · какао й арахіс',
      },
      lines: [
        {
          id: 'cocoa-peanut-spread',
          options: [
            {
              ingredientId: 'cocoa-peanut-spread',
              name: {
                en: 'Cocoa-peanut spread',
                es: 'Crema de cacao y cacahuete',
                uk: 'Какао-арахісова паста',
              },
            },
          ],
          quantity: {
            base: null,
            shopping: {
              mode: 'nameOnly',
            },
          },
          optional: true,
        },
        {
          id: 'dark-chocolate-chips',
          options: [
            {
              ingredientId: 'dark-chocolate-chips',
              name: {
                en: '80% dark chocolate chips',
                es: 'Pepitas de chocolate negro al 80%',
                uk: 'Краплі з чорного шоколаду 80%',
              },
            },
          ],
          quantity: {
            base: null,
            shopping: {
              mode: 'nameOnly',
            },
          },
          optional: true,
        },
      ],
    },
    {
      id: 'cream-cheese-glaze',
      title: {
        en: 'Optional cream-cheese glaze',
        es: 'Glaseado opcional de queso crema',
        uk: 'Необов’язкова глазур із крем-сиру',
      },
      lines: [
        {
          id: 'cream-cheese',
          options: [
            {
              ingredientId: 'cream-cheese',
              name: {
                en: 'Cream cheese',
                es: 'Queso crema',
                uk: 'Крем-сир',
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
          optional: true,
        },
        {
          id: 'icing-sugar',
          options: [
            {
              ingredientId: 'icing-sugar',
              name: {
                en: 'Icing sugar',
                es: 'Azúcar glas',
                uk: 'Цукрова пудра',
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
          optional: true,
        },
        {
          id: 'glaze-water',
          options: [
            {
              ingredientId: 'glaze-water',
              name: {
                en: 'Hot water',
                es: 'Agua caliente',
                uk: 'Гаряча вода',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 30,
              unit: 'ml',
            },
            shopping: {
              mode: 'base',
            },
          },
          optional: true,
        },
      ],
    },
  ],
  steps: [
    {
      id: 'activate-yeast',
      title: {
        en: 'Activate the yeast',
        es: 'Activa la levadura',
        uk: 'Активуйте дріжджі',
      },
      instruction: {
        en: 'Stir the dry yeast and 1 tablespoon of the honey or agave into the lukewarm liquid. Leave for about 10 minutes.',
        es: 'Mezcla la levadura seca y 1 cucharada de miel o agave con el líquido templado. Deja reposar unos 10 minutos.',
        uk: 'Розмішайте сухі дріжджі та 1 столову ложку меду або агави в теплій рідині. Залиште приблизно на 10 хвилин.',
      },
      ingredientLineIds: ['dry-yeast', 'honey-or-agave', 'water-or-milk'],
      guidance: [
        {
          id: 'activate-yeast-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The surface has started to bubble or foam.',
            es: 'La superficie ha empezado a formar burbujas o espuma.',
            uk: 'На поверхні з’явилися бульбашки або піна.',
          },
        },
        {
          id: 'activate-yeast-tip',
          kind: 'practicalTip',
          text: {
            en: 'The liquid should feel warm, not hot; excessive heat can damage the yeast.',
            es: 'El líquido debe estar templado, no caliente; demasiado calor puede dañar la levadura.',
            uk: 'Рідина має бути теплою, не гарячою: надмірне тепло може пошкодити дріжджі.',
          },
        },
      ],
      displayMeta: {
        en: '10 min',
        es: '10 min',
        uk: '10 хв',
      },
      cook: {
        ingredients: [
          {
            ingredientId: 'dry-yeast',
          },
          {
            ingredientId: 'honey-or-agave',
            note: {
              en: 'Use 1 tbsp now; add the rest with the dough',
              es: 'Usa ahora 1 cucharada; añade el resto a la masa',
              uk: 'Зараз використайте 1 ст. л.; решту додайте в тісто',
            },
          },
          {
            ingredientId: 'water-or-milk',
          },
        ],
      },
      mediaIds: ['cinnamon-rolls-activated-yeast-v1'],
      durationPhaseId: 'activate-yeast',
    },
    {
      id: 'mix-dough',
      title: {
        en: 'Mix the dough',
        es: 'Mezcla la masa',
        uk: 'Замісіть тісто',
      },
      instruction: {
        en: 'Put the remaining dough ingredients in a mixer bowl, add the activated yeast mixture and mix with the dough hook for about 5 minutes. You can also work by hand or with a sturdy silicone spatula.',
        es: 'Pon el resto de los ingredientes de la masa en el bol, añade la levadura activada y amasa con el gancho unos 5 minutos. También puedes hacerlo a mano o con una espátula firme.',
        uk: 'Покладіть решту інгредієнтів для тіста в чашу, додайте активовані дріжджі й замішуйте гаком приблизно 5 хвилин. Також можна вимішати руками або міцною лопаткою.',
      },
      ingredientLineIds: [
        'eggs',
        'vanilla',
        'butter',
        'corn-starch',
        'tapioca-starch',
        'rice-flour',
        'baking-powder',
        'xanthan',
        'salt',
      ],
      guidance: [
        {
          id: 'mix-dough-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The starches have absorbed the liquid and the xanthan has brought the dough into one cohesive mass.',
            es: 'Los almidones han absorbido el líquido y la goma xantana ha unido la masa.',
            uk: 'Крохмалі увібрали рідину, а ксантан зібрав тісто в однорідну масу.',
          },
        },
        {
          id: 'mix-dough-tip',
          kind: 'practicalTip',
          text: {
            en: 'Stop when evenly combined; this gluten-free dough does not need long gluten development.',
            es: 'Para cuando la masa esté homogénea; esta masa sin gluten no necesita un amasado largo.',
            uk: 'Зупиніться, коли тісто стане однорідним: воно не потребує тривалого розвитку клейковини.',
          },
        },
      ],
      displayMeta: {
        en: '5 min',
        es: '5 min',
        uk: '5 хв',
      },
      cook: {
        ingredients: [
          {
            ingredientId: 'eggs',
          },
          {
            ingredientId: 'vanilla',
          },
          {
            ingredientId: 'butter',
          },
          {
            ingredientId: 'corn-starch',
          },
          {
            ingredientId: 'tapioca-starch',
          },
          {
            ingredientId: 'rice-flour',
          },
          {
            ingredientId: 'baking-powder',
          },
          {
            ingredientId: 'xanthan',
          },
          {
            ingredientId: 'salt',
          },
        ],
      },
      mediaIds: ['cinnamon-rolls-mixed-dough-v1'],
      equipmentIds: ['bowl', 'mixer', 'spatula'],
      durationPhaseId: 'mix-dough',
    },
    {
      id: 'first-proof',
      title: {
        en: 'Let the dough rise',
        es: 'Deja levar la masa',
        uk: 'Дайте тісту піднятися',
      },
      instruction: {
        en: 'Shape the dough into a ball, place it in a bowl, cover and leave for the first proof for about 1 hour.',
        es: 'Forma una bola, ponla en un bol, cubre y deja hacer el primer levado durante aproximadamente 1 hora.',
        uk: 'Сформуйте з тіста кулю, покладіть у миску, накрийте й залиште для першого підйому приблизно на 1 годину.',
      },
      ingredientLineIds: [],
      guidance: [
        {
          id: 'first-proof-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The dough looks visibly fuller and aerated.',
            es: 'La masa se ve claramente más voluminosa y aireada.',
            uk: 'Тісто помітно збільшилося й стало повітрянішим.',
          },
        },
        {
          id: 'first-proof-tip',
          kind: 'practicalTip',
          text: {
            en: 'Use the change in volume as the main cue; room temperature can make the proof faster or slower.',
            es: 'Guíate por el volumen; la temperatura ambiente puede acelerar o retrasar el levado.',
            uk: 'Орієнтуйтеся на збільшення об’єму: температура в кімнаті може змінити тривалість підйому.',
          },
        },
      ],
      displayMeta: {
        en: 'About 1 hr',
        es: 'Aprox. 1 h',
        uk: 'Приблизно 1 год',
      },
      mediaIds: ['cinnamon-rolls-first-proof-v1'],
      equipmentIds: ['bowl'],
      durationPhaseId: 'first-proof',
    },
    {
      id: 'roll-dough',
      title: {
        en: 'Roll into a rectangle',
        es: 'Estira un rectángulo',
        uk: 'Розкачайте прямокутник',
      },
      instruction: {
        en: 'Dust the work surface lightly with extra corn starch. Work the risen dough briefly, then roll it into an even rectangle.',
        es: 'Espolvorea la mesa con un poco de almidón de maíz. Trabaja brevemente la masa levada y estírala en un rectángulo uniforme.',
        uk: 'Злегка припиліть поверхню кукурудзяним крохмалем. Коротко обімніть тісто й розкачайте його в рівний прямокутник.',
      },
      ingredientLineIds: [],
      guidance: [
        {
          id: 'roll-dough-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The sheet is even, without thick ridges or very thin patches.',
            es: 'La lámina queda uniforme, sin bordes gruesos ni zonas demasiado finas.',
            uk: 'Пласт рівний, без товстих валиків і надто тонких ділянок.',
          },
        },
        {
          id: 'roll-dough-tip',
          kind: 'practicalTip',
          text: {
            en: 'Use only enough corn starch to prevent sticking; too much can dry the surface.',
            es: 'Usa solo el almidón necesario; demasiado puede secar la superficie.',
            uk: 'Додавайте лише стільки крохмалю, щоб тісто не липло: надлишок підсушує поверхню.',
          },
        },
      ],
      mediaIds: ['cinnamon-rolls-rolled-rectangle-v1'],
    },
    {
      id: 'add-filling',
      title: {
        en: 'Add one filling',
        es: 'Añade un relleno',
        uk: 'Додайте одну начинку',
      },
      instruction: {
        en: 'For the cinnamon version, brush generously with softened butter and cover with the mixed sugar and cinnamon. Alternatively, spread with cocoa-peanut cream and scatter over dark chocolate chips.',
        es: 'Para la versión de canela, pincela con mantequilla y reparte el azúcar con canela. Como alternativa, unta crema de cacao y cacahuete y añade chocolate negro.',
        uk: 'Для варіанта з корицею щедро змастіть тісто м’яким маслом і розподіліть цукор із корицею. Або намастіть какао-арахісовою пастою та посипте чорним шоколадом.',
      },
      ingredientLineIds: [
        'filling-sugar',
        'cinnamon',
        'filling-butter',
        'cocoa-peanut-spread',
        'dark-chocolate-chips',
      ],
      technique: {
        id: 'soften-butter',
        condition: 'cinnamon-filling',
      },
      guidance: [
        {
          id: 'add-filling-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The filling forms an even layer across the dough.',
            es: 'El relleno forma una capa uniforme sobre la masa.',
            uk: 'Начинка лежить рівним шаром по всій поверхні тіста.',
          },
        },
        {
          id: 'add-filling-tip',
          kind: 'practicalTip',
          text: {
            en: 'Leave a narrow bare edge at the final seam so the roll closes cleanly.',
            es: 'Deja un borde estrecho sin relleno para cerrar bien el rollo.',
            uk: 'Залиште вузьку смугу без начинки вздовж фінального краю, щоб рулет добре закрився.',
          },
        },
      ],
      cook: {
        ingredients: [
          {
            ingredientId: 'filling-sugar',
          },
          {
            ingredientId: 'cinnamon',
          },
          {
            ingredientId: 'filling-butter',
          },
          {
            ingredientId: 'cocoa-peanut-spread',
          },
          {
            ingredientId: 'dark-chocolate-chips',
          },
        ],
      },
      mediaIds: ['cinnamon-rolls-cinnamon-filling-v1'],
    },
    {
      id: 'shape-rolls',
      title: {
        en: 'Roll and cut',
        es: 'Enrolla y corta',
        uk: 'Згорніть і наріжте',
      },
      instruction: {
        en: 'Roll into a log and cut pieces about 2 cm thick. Set them cut-side up in the baking dish.',
        es: 'Enrolla formando un cilindro y corta porciones de unos 2 cm. Colócalas con el corte hacia arriba en la fuente.',
        uk: 'Згорніть тісто в рулет і наріжте шматочками завтовшки близько 2 см. Викладіть зрізом догори у форму.',
      },
      ingredientLineIds: [],
      guidance: [
        {
          id: 'shape-rolls-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The spirals hold their shape and have a little room to expand.',
            es: 'Las espirales mantienen la forma y tienen espacio para crecer.',
            uk: 'Спіралі тримають форму, а між ними є трохи місця для підйому.',
          },
        },
        {
          id: 'shape-rolls-tip',
          kind: 'practicalTip',
          text: {
            en: 'Use a gentle sawing motion so you do not flatten the roll.',
            es: 'Corta con un movimiento suave de sierra para no aplastar el rollo.',
            uk: 'Ріжте легкими рухами ножа вперед-назад, щоб не сплющити рулет.',
          },
        },
      ],
      displayMeta: {
        en: '2 cm pieces',
        es: 'Porciones de 2 cm',
        uk: 'Шматочки по 2 см',
      },
      mediaIds: ['cinnamon-rolls-cut-rolls-v1'],
    },
    {
      id: 'second-proof',
      title: {
        en: 'Proof the shaped rolls',
        es: 'Deja levar los rollos',
        uk: 'Дайте сформованим булочкам піднятися',
      },
      instruction: {
        en: 'Cover with film and leave for 40–60 minutes. Near the end, preheat the oven to 180°C.',
        es: 'Cubre con film y deja reposar entre 40 y 60 minutos. Hacia el final, precalienta el horno a 180°C.',
        uk: 'Накрийте плівкою й залиште на 40–60 хвилин. Ближче до завершення розігрійте духовку до 180°C.',
      },
      ingredientLineIds: [],
      guidance: [
        {
          id: 'second-proof-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The rolls look slightly puffed and the gaps between them have narrowed.',
            es: 'Los rollos se ven algo hinchados y los espacios se han reducido.',
            uk: 'Булочки трохи надулися, а проміжки між ними зменшилися.',
          },
        },
        {
          id: 'second-proof-tip',
          kind: 'practicalTip',
          text: {
            en: 'Do not wait for a dramatic doubling; the source describes only a modest rise.',
            es: 'No esperes que dupliquen claramente; la fuente describe un levado moderado.',
            uk: 'Не чекайте виразного подвоєння: у джерелі описаний помірний підйом.',
          },
        },
      ],
      displayMeta: {
        en: '40–60 min · 180°C',
        es: '40–60 min · 180°C',
        uk: '40–60 хв · 180°C',
      },
      mediaIds: ['cinnamon-rolls-second-proof-v1'],
      temperature: {
        value: 180,
        unit: 'C',
        ovenMode: null,
      },
      durationPhaseId: 'second-proof',
    },
    {
      id: 'bake',
      title: {
        en: 'Bake until lightly golden',
        es: 'Hornea hasta que estén ligeramente dorados',
        uk: 'Випікайте до легкого золотистого кольору',
      },
      instruction: {
        en: 'Bake at 180°C for about 20 minutes. Cool slightly before adding your chosen finish.',
        es: 'Hornea a 180°C durante unos 20 minutos. Deja templar antes de añadir el acabado elegido.',
        uk: 'Випікайте при 180°C приблизно 20 хвилин. Трохи остудіть перед нанесенням обраного покриття.',
      },
      ingredientLineIds: [],
      guidance: [
        {
          id: 'bake-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The tops are only lightly golden and the centre rolls look set rather than wet.',
            es: 'La superficie está ligeramente dorada y los rollos centrales se ven cocidos, no húmedos.',
            uk: 'Верх лише злегка золотистий, а центральні булочки вже схопилися й не виглядають сирими.',
          },
        },
        {
          id: 'bake-tip',
          kind: 'practicalTip',
          text: {
            en: 'Do not bake to a deep brown: overbaking makes gluten-free rolls dry.',
            es: 'No los hornees hasta un dorado oscuro: el exceso de horno reseca los rollos sin gluten.',
            uk: 'Не запікайте до темної скоринки: перепечені безглютенові булочки стають сухими.',
          },
        },
      ],
      displayMeta: {
        en: '180°C · about 20 min',
        es: '180°C · unos 20 min',
        uk: '180°C · приблизно 20 хв',
      },
      mediaIds: ['cinnamon-rolls-lightly-golden-v1'],
      temperature: {
        value: 180,
        unit: 'C',
        ovenMode: null,
      },
      durationPhaseId: 'bake',
    },
    {
      id: 'finish',
      title: {
        en: 'Add the chosen finish',
        es: 'Añade el acabado elegido',
        uk: 'Додайте обране покриття',
      },
      instruction: {
        en: 'For the classic glaze, mix the cream cheese, icing sugar and hot water until smooth and spoon over the warm rolls. Alternatively, finish with a little cocoa-peanut spread.',
        es: 'Para el glaseado clásico, mezcla el queso crema, el azúcar glas y el agua caliente hasta obtener una crema lisa y repártela sobre los rollos templados. Como alternativa, termina con crema de cacao y cacahuete.',
        uk: 'Для класичної глазурі змішайте крем-сир, цукрову пудру й гарячу воду до гладкості та полийте теплі булочки. Або додайте зверху трохи какао-арахісової пасти.',
      },
      ingredientLineIds: ['cream-cheese', 'icing-sugar', 'glaze-water'],
      guidance: [
        {
          id: 'finish-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The rolls are warm rather than piping hot, so the finish stays on top.',
            es: 'Los rollos están templados, no muy calientes, para que el acabado se quede encima.',
            uk: 'Булочки теплі, а не гарячі, тому покриття тримається зверху.',
          },
        },
        {
          id: 'finish-tip',
          kind: 'practicalTip',
          text: {
            en: 'Add the hot water gradually if you prefer a thicker glaze.',
            es: 'Añade el agua caliente poco a poco si prefieres un glaseado más espeso.',
            uk: 'Якщо хочете густішу глазур, додавайте гарячу воду поступово.',
          },
        },
      ],
      cook: {
        ingredients: [
          {
            ingredientId: 'cream-cheese',
          },
          {
            ingredientId: 'icing-sugar',
          },
          {
            ingredientId: 'glaze-water',
          },
        ],
      },
      mediaIds: ['cinnamon-rolls-cream-cheese-glaze-v1'],
    },
  ],
  storage: null,
  makeAhead: null,
  variations: [],
  heroMediaId: 'cinnamon-rolls-hero',
  media: [
    {
      id: 'cinnamon-rolls-hero',
      type: 'image',
      path: '/images/recipes/cinnamon-rolls-card-v1.webp',
      usage: ['hero'],
      alt: {
        en: 'Gluten-free cinnamon rolls',
        es: 'Rollos de canela sin gluten',
        uk: 'Безглютенові булочки з корицею',
      },
    },
    {
      id: 'cinnamon-rolls-activated-yeast-v1',
      type: 'image',
      path: '/media/recipes/cinnamon-rolls/selected/step-01-activated-yeast-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Foamy activated yeast in lukewarm almond milk in a cream bowl',
        es: 'Levadura activada y espumosa en leche de almendra templada dentro de un bol crema',
        uk: 'Спінені активовані дріжджі в теплому мигдальному молоці у кремовій мисці',
      },
      caption: {
        en: 'After about 10 minutes, the surface should be foamy and visibly active.',
        es: 'Después de unos 10 minutos, la superficie debe estar espumosa y activa.',
        uk: 'Приблизно через 10 хвилин поверхня має спінитися й помітно пузиритися.',
      },
      title: {
        en: 'Look for active bubbles',
        es: 'Busca burbujas activas',
        uk: 'Перевірте активні бульбашки',
      },
    },
    {
      id: 'cinnamon-rolls-mixed-dough-v1',
      type: 'image',
      path: '/media/recipes/cinnamon-rolls/selected/step-02-mixed-dough-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Soft cohesive gluten-free cinnamon-roll dough in a cream mixing bowl',
        es: 'Masa blanda y cohesionada de rollos de canela sin gluten en un bol crema',
        uk: 'М’яке однорідне тісто для безглютенових булочок у кремовій мисці',
      },
      caption: {
        en: 'The dough is soft and tacky, but the starches and xanthan hold it together.',
        es: 'La masa está blanda y pegajosa, pero los almidones y la xantana la mantienen unida.',
        uk: 'Тісто м’яке й липкувате, але крохмалі та ксантан уже тримають його разом.',
      },
      title: {
        en: 'Check the mixed dough',
        es: 'Comprueba la masa mezclada',
        uk: 'Перевірте замішане тісто',
      },
    },
    {
      id: 'cinnamon-rolls-first-proof-v1',
      type: 'image',
      path: '/media/recipes/cinnamon-rolls/selected/step-03-first-proof-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Risen gluten-free dough with a softly domed aerated surface',
        es: 'Masa sin gluten levada con una superficie aireada y suavemente abombada',
        uk: 'Підняте безглютенове тісто з м’яко округленою повітряною поверхнею',
      },
      caption: {
        en: 'The dough should look fuller and aerated after the first proof.',
        es: 'La masa debe verse más voluminosa y aireada después del primer levado.',
        uk: 'Після першого підйому тісто має стати об’ємнішим і повітрянішим.',
      },
      title: {
        en: 'Check the first proof',
        es: 'Comprueba el primer levado',
        uk: 'Перевірте перший підйом',
      },
    },
    {
      id: 'cinnamon-rolls-rolled-rectangle-v1',
      type: 'image',
      path: '/media/recipes/cinnamon-rolls/selected/step-04-rolled-rectangle-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Even rectangle of pale gluten-free dough beside a wooden rolling pin',
        es: 'Rectángulo uniforme de masa sin gluten clara junto a un rodillo de madera',
        uk: 'Рівний прямокутник світлого безглютенового тіста поруч із дерев’яною качалкою',
      },
      caption: {
        en: 'Keep the rectangle even, without thick ridges or very thin patches.',
        es: 'Mantén el rectángulo uniforme, sin bordes gruesos ni zonas demasiado finas.',
        uk: 'Прямокутник має бути рівним, без товстих валиків і надто тонких ділянок.',
      },
      title: {
        en: 'Roll to an even thickness',
        es: 'Estira con un grosor uniforme',
        uk: 'Розкачайте до рівної товщини',
      },
    },
    {
      id: 'cinnamon-rolls-cinnamon-filling-v1',
      type: 'image',
      path: '/media/recipes/cinnamon-rolls/selected/step-05-cinnamon-filling-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Rolled dough rectangle evenly covered with brown sugar and cinnamon filling',
        es: 'Rectángulo de masa cubierto uniformemente con azúcar moreno y canela',
        uk: 'Прямокутник тіста, рівномірно вкритий начинкою з коричневого цукру й кориці',
      },
      caption: {
        en: 'Cover the dough evenly and leave a narrow clean edge for sealing.',
        es: 'Cubre la masa de forma uniforme y deja un borde limpio para cerrar.',
        uk: 'Покрийте тісто рівним шаром і залиште вузький чистий край для закривання.',
      },
      title: {
        en: 'Spread the filling evenly',
        es: 'Reparte el relleno uniformemente',
        uk: 'Рівномірно розподіліть начинку',
      },
    },
    {
      id: 'cinnamon-rolls-cut-rolls-v1',
      type: 'image',
      path: '/media/recipes/cinnamon-rolls/selected/step-06-cut-rolls-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Cinnamon-filled dough log with evenly cut spiral portions beside a serrated knife',
        es: 'Cilindro de masa con canela y porciones en espiral cortadas junto a un cuchillo de sierra',
        uk: 'Рулет із коричною начинкою та рівно нарізані спіралі поруч із зубчастим ножем',
      },
      caption: {
        en: 'The 2 cm portions should hold a clear spiral without being flattened.',
        es: 'Las porciones de 2 cm deben conservar una espiral clara sin aplastarse.',
        uk: 'Шматочки завтовшки 2 см мають зберігати чітку спіраль і не сплющуватися.',
      },
      title: {
        en: 'Cut even spirals',
        es: 'Corta espirales uniformes',
        uk: 'Наріжте рівні спіралі',
      },
    },
    {
      id: 'cinnamon-rolls-second-proof-v1',
      type: 'image',
      path: '/media/recipes/cinnamon-rolls/selected/step-07-second-proof-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Pale unbaked cinnamon rolls modestly puffed in a cream ceramic baking dish',
        es: 'Rollos de canela pálidos y sin hornear, ligeramente levados en una fuente de cerámica crema',
        uk: 'Світлі невипечені булочки з корицею, що трохи піднялися у кремовій керамічній формі',
      },
      caption: {
        en: 'The rolls are slightly puffed and the gaps between them have narrowed.',
        es: 'Los rollos están algo hinchados y los espacios entre ellos se han reducido.',
        uk: 'Булочки трохи надулися, а проміжки між ними зменшилися.',
      },
      title: {
        en: 'Check the second proof',
        es: 'Comprueba el segundo levado',
        uk: 'Перевірте другий підйом',
      },
    },
    {
      id: 'cinnamon-rolls-lightly-golden-v1',
      type: 'image',
      path: '/media/recipes/cinnamon-rolls/selected/step-08-lightly-golden-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Lightly golden baked cinnamon rolls without glaze in a cream ceramic dish',
        es: 'Rollos de canela horneados y ligeramente dorados, sin glaseado, en una fuente crema',
        uk: 'Злегка золотисті випечені булочки без глазурі у кремовій керамічній формі',
      },
      caption: {
        en: 'The tops are lightly golden and the centre rolls are set, not wet.',
        es: 'La superficie está ligeramente dorada y los rollos centrales están cocidos, no húmedos.',
        uk: 'Верх злегка золотистий, а центральні булочки вже схопилися й не виглядають сирими.',
      },
      title: {
        en: 'Stop at light gold',
        es: 'Detente con un dorado ligero',
        uk: 'Зупиніться на легкому золотистому кольорі',
      },
    },
    {
      id: 'cinnamon-rolls-cream-cheese-glaze-v1',
      type: 'image',
      path: '/media/recipes/cinnamon-rolls/selected/step-09-cream-cheese-glaze-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Warm cinnamon rolls with restrained cream-cheese glaze in a cream ceramic dish',
        es: 'Rollos de canela templados con un glaseado moderado de queso crema en una fuente crema',
        uk: 'Теплі булочки з помірним шаром глазурі з крем-сиру у кремовій керамічній формі',
      },
      caption: {
        en: 'The glaze should stay on top with a few natural drips rather than flooding the dish.',
        es: 'El glaseado debe quedarse encima con algunas gotas naturales, sin inundar la fuente.',
        uk: 'Глазур має триматися зверху й лише трохи стікати, а не заливати всю форму.',
      },
      title: {
        en: 'Finish while warm',
        es: 'Termina mientras estén templados',
        uk: 'Завершіть, поки булочки теплі',
      },
    },
  ],
  relatedRecipeIds: [],
  sources: [
    {
      id: 'cinnamon-rolls-recorded-source',
      file: 'https://www.megasilvita.com/blog/cinnamon-rolls-sin-gluten-la-receta-perfecta/',
      locator:
        'Ingredients, filling options and preparation under “Cinnamon Rolls Sin Gluten” · author confirmed using this recipe',
    },
  ],
  contentGaps: [
    {
      id: 'cinnamon-rolls-source-gap',
      area: 'method',
      field: 'steps',
      question:
        'Before publication, record the filling and finish used, the yield, baking-dish dimensions, difficulty and full active and elapsed time.',
      text: {
        en: 'Before publication, record the filling and finish used, the yield, baking-dish dimensions, difficulty and full active and elapsed time.',
        es: 'Antes de publicar, registra el relleno y acabado usados, el rendimiento, las medidas de la fuente, la dificultad y los tiempos completos.',
        uk: 'Перед публікацією запишіть використані начинку й покриття, кількість булочок, розмір форми, складність, активний і загальний час.',
      },
      publicationBlocking: false,
      sourceIds: ['cinnamon-rolls-recorded-source'],
      readerVisible: true,
    },
    {
      id: 'cinnamon-rolls-yield-gap',
      area: 'yield',
      field: 'yield.default',
      question: 'Yield is not recorded.',
      text: {
        en: 'Yield is not recorded.',
        es: 'El rendimiento no está registrado.',
        uk: 'Вихід не записано.',
      },
      publicationBlocking: false,
      sourceIds: ['cinnamon-rolls-recorded-source'],
    },
  ],
  evidenceExplanation: {
    en: 'This source recipe has been baked successfully. The exact filling and finish used still need to be recorded.',
    es: 'Esta receta se ha horneado con éxito. Aún falta registrar el relleno y el acabado utilizados.',
    uk: 'За цим рецептом успішно випікали. Точну начинку й оздоблення ще потрібно уточнити.',
  },
  searchMetadata: {
    datePublished: null,
    dateModified: '2026-09-27',
    cookTimeMinutes: 20,
    recipeCuisine: {
      uk: null,
      en: null,
      es: null,
    },
    keywords: {
      uk: ['Безглютенові булочки з корицею'],
      en: ['Gluten-free cinnamon rolls'],
      es: ['Rollos de canela sin gluten'],
    },
  },
  discovery: {
    cardTitle: {
      en: 'Cinnamon rolls',
      es: 'Rollos de canela',
      uk: 'Булочки з корицею',
    },
    category: {
      en: 'Sweet baking',
      es: 'Dulces al horno',
      uk: 'Солодка випічка',
    },
    flourSummary: {
      en: 'Rice flour + corn and tapioca starch',
      es: 'Harina de arroz + almidones de maíz y tapioca',
      uk: 'Рисове борошно + кукурудзяний і тапіоковий крохмалі',
    },
    collectionIds: ['everyday'],
    catalogue: true,
    imageKind: 'generated-preview',
    sourceTitle: 'Cinnabons / cinnamon rolls',
    launchPriority: 'High',
    heroCandidate: 'Yes',
    source:
      'Megasilvita, “Cinnamon Rolls Sin Gluten la receta perfecta”, confirmed by the author as the recipe used',
    archiveSections: [
      {
        title: 'Source recipe',
        content:
          'https://www.megasilvita.com/blog/cinnamon-rolls-sin-gluten-la-receta-perfecta/',
      },
    ],
    needsBeforePublishing:
      'Confirm the filling and finish used, yield, baking-dish dimensions, difficulty and full timing; approve or replace the generated photo.',
  },
  translationReview: {
    date: '2026-11-01',
    reviewer: 'implementation',
    scope:
      'ID-aligned transfer and semantic comparison of existing UK/EN/ES recipe text; not separate author approval',
  },
  routeSlug: 'cinnamon-rolls',
} satisfies Recipe;
