import type { RecipeDraft } from './recipe.types.ts';
import { quantityFromGrams, quantityFromSpoons } from './spoon-weights.ts';

export const glutenFreeNapoleonRecipe = {
  schemaVersion: 2,
  id: 'gluten-free-napoleon',
  versionId: 'gluten-free-napoleon-v3',
  publicationStatus: 'published',
  translationState: {
    uk: 'reviewed',
    en: 'reviewed',
    es: 'reviewed',
  },
  slug: {
    uk: 'bezghliutenovyi-napoleon',
    en: 'gluten-free-napoleon-cake',
    es: 'tarta-napoleon-sin-gluten',
  },
  title: {
    uk: 'Безглютеновий Наполеон',
    en: 'Gluten-Free Napoleon Cake',
    es: 'Tarta Napoleón sin gluten',
  },
  summary: {
    uk: 'Торти по 6 тонких коржів діаметром 24 см із теплим заварним кремом і горіхами.',
    en: 'Cakes with six thin 24 cm layers each, warm custard and nuts.',
    es: 'Tartas con seis capas finas de 24 cm cada una, crema pastelera templada y frutos secos.',
  },
  categoryIds: ['celebration', 'layer-cake'],
  situationIds: ['celebration'],
  difficulty: 'advanced',
  baseProvenance: {
    state: 'tested',
    sourceIds: ['author-bake-2026-10-04'],
    note: 'Author baked and photographed this sour-cream dough version, then approved the method with 250 g butter, a 24 cm template and a 200°C oven. The repeated-bake history of v2 is not evidence for v3.',
  },
  timing: {
    activeMinutes: 60,
    totalElapsedMinutes: null,
    planningNote: {
      text: {
        uk: 'Найкраще подавати наступного дня.',
        en: 'Best served the next day.',
        es: 'Mejor servir al día siguiente.',
      },
    },
    phases: [
      {
        id: 'activate-leavener',
        label: {
          uk: 'Відпочинок сметанної суміші',
          en: 'Sour cream mixture rest',
          es: 'Reposo de la mezcla de crema agria',
        },
        duration: {
          kind: 'range',
          min: 2,
          max: 3,
          unit: 'minute',
        },
        relatedStepId: 'mix-wet-dough',
      },
      {
        id: 'chill-dough',
        label: {
          uk: 'Охолодження тіста',
          en: 'Dough chilling',
          es: 'Refrigeración de la masa',
        },
        duration: {
          kind: 'range',
          min: 1,
          max: 2,
          unit: 'hour',
        },
        relatedStepId: 'divide-and-chill',
      },
      {
        id: 'bake-one-layer',
        label: {
          uk: 'Випікання одного коржа',
          en: 'Baking one layer',
          es: 'Horneado de una capa',
        },
        duration: {
          kind: 'range',
          min: 7,
          max: 10,
          unit: 'minute',
        },
        relatedStepId: 'bake-layer',
      },
      {
        id: 'toast-walnuts',
        label: {
          uk: 'Підсушування волоських горіхів',
          en: 'Toasting walnuts',
          es: 'Tostado de las nueces',
        },
        duration: {
          kind: 'range',
          min: 8,
          max: 10,
          unit: 'minute',
        },
      },
      {
        id: 'toast-almonds',
        label: {
          uk: 'Підсушування мигдальних пластівців',
          en: 'Toasting flaked almonds',
          es: 'Tostado de las almendras laminadas',
        },
        duration: {
          kind: 'range',
          min: 4,
          max: 5,
          unit: 'minute',
        },
      },
      {
        id: 'room-temperature-rest',
        label: {
          uk: 'Витримка після складання',
          en: 'Rest after assembly',
          es: 'Reposo después del montaje',
        },
        duration: {
          kind: 'exact',
          value: 1,
          unit: 'hour',
        },
      },
      {
        id: 'refrigerated-maturation',
        label: {
          uk: 'Дозрівання в холодильнику',
          en: 'Refrigerated maturation',
          es: 'Reposo en la nevera',
        },
        duration: {
          kind: 'range',
          min: 12,
          max: 24,
          unit: 'hour',
        },
      },
    ],
  },
  yield: {
    default: {
      id: 'two-six-layer-cakes',
      label: {
        uk: '2 торти',
        en: '2 cakes',
        es: '2 tartas',
      },
      amount: 2,
      unit: 'cake',
      details: {
        uk: 'Усього 12 коржів; кожен торт має 6 коржів діаметром 24 см',
        en: '12 layers in total; each cake has six 24 cm layers',
        es: '12 capas en total; cada tarta tiene seis capas de 24 cm',
      },
      provenance: {
        state: 'tested',
        sourceIds: ['author-bake-2026-10-04'],
      },
      availability: 'default',
    },
    alternatives: [],
  },
  geometry: {
    default: {
      id: 'round-24cm-6-layers-each',
      label: {
        uk: 'Для кожного торта 6 круглих коржів діаметром 24 см',
        en: 'Six 24 cm round layers for each cake',
        es: 'Seis capas redondas de 24 cm para cada tarta',
      },
      kind: 'roundTemplate',
      application: 'roll-and-trim',
      shape: 'round',
      diameterCm: 24,
      layerCount: 6,
      material: null,
      provenance: {
        state: 'tested',
        sourceIds: ['author-bake-2026-10-04'],
      },
      availability: 'default',
    },
    alternatives: [
      {
        id: 'round-28cm-preview',
        label: {
          uk: 'Круглий шаблон 28 см — розрахунковий варіант',
          en: '28 cm round template — calculated variation',
          es: 'Formato redondo de 28 cm — variante calculada',
        },
        kind: 'roundTemplate',
        application: 'roll-and-trim',
        shape: 'round',
        diameterCm: 28,
        layerCount: null,
        material: null,
        provenance: {
          state: 'calculated',
          sourceIds: ['author-bake-2026-10-04'],
          note: 'Area-based adaptation of the 24 cm October 2026 base. This exact dough at 28 cm has not been bake-tested.',
        },
        availability: 'previewOnly',
        blockingGapIds: ['validate-28cm-form'],
      },
    ],
  },
  configuration: {
    base: {
      status: 'Tested',
      geometryId: 'round-24cm-6-layers-each',
      yieldId: 'two-six-layer-cakes',
      batchScale: 1,
    },
    geometryAdjustment: {
      optionIds: ['round-28cm-preview'],
      quantityBasis: 'area',
      timingPolicy: 'unverifiedWhenChanged',
    },
    quantityAdjustment: {
      batchScale: {
        allowed: [0.5, 1, 1.5, 2],
      },
      useWhatIHave: {
        scalingAnchors: [
          {
            ingredientLineId: 'schar-mix-b',
            allowedUnit: 'g',
            minimum: 100,
          },
        ],
      },
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
      id: 'food-processor',
      name: {
        uk: 'кухонний комбайн',
        en: 'food processor',
        es: 'robot de cocina',
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
      id: 'fork',
      name: {
        uk: 'виделка',
        en: 'fork',
        es: 'tenedor',
      },
    },
    {
      id: 'large-saucepan',
      name: {
        uk: 'велика каструля',
        en: 'large saucepan',
        es: 'cacerola grande',
      },
    },
    {
      id: 'whisk',
      name: {
        uk: 'вінчик',
        en: 'whisk',
        es: 'varillas',
      },
    },
    {
      id: '24cm-template',
      name: {
        uk: 'круглий шаблон 24 см',
        en: '24 cm round template',
        es: 'plantilla redonda de 24 cm',
      },
    },
  ],
  flourConfiguration: {
    commercialMixLineId: 'schar-mix-b',
    additionalStarchLineIds: [],
    provenance: {
      state: 'tested',
      sourceIds: ['author-bake-2026-10-04'],
      note: 'Existing Schär Mix B identity retained for the author-approved replacement method; no separate dough starches in this version.',
    },
    testedAlternativeMixes: [],
    knownUnsupportedMixes: [],
  },
  beforeStart: [
    {
      id: 'plan-parchment',
      relatedStepId: 'roll-layer',
      text: {
        uk: 'Підготуйте пергамент для всіх коржів і тарілку або кришку діаметром 24 см. Перед випіканням розігрійте духовку до 200°C.',
        en: 'Prepare baking parchment for all the layers and a 24 cm plate or lid. Preheat the oven to 200°C before baking.',
        es: 'Prepara papel de horno para todas las capas y un plato o una tapa de 24 cm. Precalienta el horno a 200°C antes de hornear.',
      },
    },
    {
      id: 'plan-chilling-and-maturation',
      relatedStepId: 'refrigerate-cake',
      text: {
        uk: 'Плануйте приготування за день: тісто охолоджується 1–2 години, а зібраний торт відпочиває 1 годину при кімнатній температурі та 12–24 години в холодильнику.',
        en: 'Plan a day ahead: chill the dough for 1–2 hours, then let the assembled cake rest for 1 hour at room temperature and 12–24 hours in the refrigerator.',
        es: 'Planifica con un día de antelación: la masa necesita 1–2 horas en la nevera y la tarta montada reposa 1 hora a temperatura ambiente y 12–24 horas en la nevera.',
      },
    },
  ],
  ingredientSections: [
    {
      id: 'layers',
      title: {
        uk: 'Коржі',
        en: 'Layers',
        es: 'Capas',
      },
      provenance: {
        state: 'tested',
        sourceIds: ['author-bake-2026-10-04'],
      },
      lines: [
        {
          id: 'schar-mix-b',
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
          quantity: quantityFromGrams('schar-mix-b', 500),
        },
        {
          id: 'butter-dough',
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
              value: 250,
              unit: 'g',
            },
            shopping: {
              mode: 'base',
            },
          },
          preparation: {
            uk: 'холодне',
            en: 'cold',
            es: 'fría',
          },
        },
        {
          id: 'cultured-dairy-dough',
          options: [
            {
              ingredientId: 'sour-cream',
              name: {
                uk: 'сметана',
                en: 'sour cream',
                es: 'crema agria',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 250,
              unit: 'g',
            },
            shopping: {
              mode: 'base',
            },
          },
        },
        {
          id: 'eggs-dough',
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
              value: 3,
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
          id: 'salt-dough',
          options: [
            {
              ingredientId: 'salt',
              name: {
                uk: 'сіль',
                en: 'salt',
                es: 'sal',
              },
            },
          ],
          quantity: {
            base: null,
            equivalent: {
              kind: 'exact',
              value: 1,
              unit: 'pinch',
            },
            shopping: {
              mode: 'nameOnly',
            },
          },
          scaling: {
            kind: 'fixed',
          },
        },
        {
          id: 'baking-soda',
          options: [
            {
              ingredientId: 'baking-soda',
              name: {
                uk: 'харчова сода',
                en: 'baking soda',
                es: 'bicarbonato sódico',
              },
            },
          ],
          quantity: quantityFromSpoons('baking-soda', 1, 'tsp'),
        },
        {
          id: 'citric-acid',
          options: [
            {
              ingredientId: 'citric-acid',
              name: {
                uk: 'лимонна кислота',
                en: 'citric acid',
                es: 'ácido cítrico',
              },
            },
          ],
          quantity: {
            base: {
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
          id: 'flour-leavener',
          options: [
            {
              ingredientId: 'schar-mix-b-bread',
              name: {
                uk: 'борошно для розпушувальної суміші',
                en: 'flour for the leavening mixture',
                es: 'harina para la mezcla de bicarbonato y ácido cítrico',
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
          provenance: {
            state: 'tested',
            sourceIds: ['author-bake-2026-10-04'],
            note: 'Author-specified teaspoons; no teaspoon-to-gram conversion is established for this flour mix.',
          },
        },
        {
          id: 'flour-dusting',
          options: [
            {
              ingredientId: 'schar-mix-b-bread',
              name: {
                uk: 'борошно для підпилу',
                en: 'flour for dusting',
                es: 'harina para espolvorear',
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
            uk: 'за потреби',
            en: 'as needed',
            es: 'según sea necesario',
          },
          scaling: {
            kind: 'fixed',
          },
        },
      ],
    },
    {
      id: 'custard',
      title: {
        uk: 'Заварний крем',
        en: 'Custard',
        es: 'Crema pastelera',
      },
      provenance: {
        state: 'repeatedlyVerified',
        sourceIds: ['archive-recipe', 'inventory-row', 'author-update'],
        note: 'The current custard formula was confirmed by the author for the repeatedly baked base recipe.',
      },
      lines: [
        {
          id: 'milk-custard',
          options: [
            {
              ingredientId: 'milk',
              name: { uk: 'молоко', en: 'milk', es: 'leche' },
            },
          ],
          quantity: {
            base: { kind: 'exact', value: 2500, unit: 'ml' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'eggs-custard',
          options: [
            {
              ingredientId: 'whole-egg',
              name: { uk: 'яйця', en: 'eggs', es: 'huevos' },
            },
          ],
          quantity: {
            base: { kind: 'exact', value: 4, unit: 'piece' },
            shopping: { mode: 'base' },
          },
          scaling: { kind: 'discrete', increment: 1, rounding: 'manual' },
        },
        {
          id: 'sugar-custard',
          options: [
            {
              ingredientId: 'granulated-sugar',
              name: { uk: 'цукор', en: 'sugar', es: 'azúcar' },
            },
          ],
          quantity: quantityFromGrams('granulated-sugar', 400),
        },
        {
          id: 'corn-starch-custard',
          options: [
            {
              ingredientId: 'corn-starch',
              name: {
                uk: 'кукурудзяний крохмаль',
                en: 'corn starch',
                es: 'almidón de maíz',
              },
            },
          ],
          quantity: quantityFromGrams('corn-starch', 170),
        },
        {
          id: 'tapioca-custard',
          options: [
            {
              ingredientId: 'tapioca-starch',
              name: {
                uk: 'тапіоковий крохмаль',
                en: 'tapioca starch',
                es: 'almidón de tapioca',
              },
            },
          ],
          quantity: quantityFromGrams('tapioca-starch', 20),
        },
        {
          id: 'butter-custard',
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
            base: { kind: 'exact', value: 100, unit: 'g' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'vanilla-sugar-custard',
          options: [
            {
              ingredientId: 'vanilla-sugar',
              name: {
                uk: 'ванільний цукор',
                en: 'vanilla sugar',
                es: 'azúcar vainillado',
              },
            },
          ],
          quantity: {
            base: { kind: 'exact', value: 24, unit: 'g' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'salt-custard',
          options: [
            {
              ingredientId: 'salt',
              name: { uk: 'сіль', en: 'salt', es: 'sal' },
            },
          ],
          quantity: {
            base: null,
            equivalent: { kind: 'exact', value: 1, unit: 'pinch' },
            shopping: { mode: 'nameOnly' },
          },
          scaling: { kind: 'fixed' },
        },
      ],
    },
    {
      id: 'assembly',
      title: {
        uk: 'Горіхи та оздоблення',
        en: 'Nuts and finish',
        es: 'Frutos secos y acabado',
      },
      lines: [
        {
          id: 'walnuts',
          options: [
            {
              ingredientId: 'walnut',
              name: {
                uk: 'волоські горіхи',
                en: 'walnuts',
                es: 'nueces',
              },
            },
          ],
          quantity: {
            base: { kind: 'exact', value: 150, unit: 'g' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'flaked-almonds',
          options: [
            {
              ingredientId: 'flaked-almond',
              name: {
                uk: 'мигдальні пластівці',
                en: 'flaked almonds',
                es: 'almendras laminadas',
              },
            },
          ],
          quantity: {
            base: { kind: 'exact', value: 50, unit: 'g' },
            shopping: { mode: 'base' },
          },
        },
      ],
    },
  ],
  steps: [
    {
      id: 'cut-in-butter',
      title: {
        uk: 'Масляна крихта',
        en: 'Butter and flour crumb',
        es: 'Migas de mantequilla y harina',
      },
      instruction: {
        uk: 'Наріжте 250 г холодного масла кубиками й додайте до 250 г борошна в чаші комбайна. Подрібніть короткими імпульсами.',
        en: 'Cut 250 g cold butter into cubes and add it to 250 g flour in a food processor. Pulse briefly.',
        es: 'Corta 250 g de mantequilla fría en dados y ponla con 250 g de harina en el robot de cocina. Tritura con pulsaciones cortas.',
      },
      quantityMentions: [
        {
          text: {
            uk: '250 г',
            en: '250 g',
            es: '250 g',
          },
          quantity: {
            kind: 'exact',
            value: 250,
            unit: 'g',
          },
        },
      ],
      ingredientLineIds: ['butter-dough', 'schar-mix-b'],
      equipmentIds: ['food-processor'],
      mediaIds: ['napoleon-author-crumb-v1'],
      guidance: [
        {
          id: 'crumb-texture',
          kind: 'checkpoint',
          text: {
            uk: 'Має вийти розсипчаста крихта з дрібними шматочками масла.',
            en: 'The mixture should be crumbly, with small pieces of butter still visible.',
            es: 'Debe quedar una mezcla desmenuzada, con pequeños trozos de mantequilla visibles.',
          },
        },
      ],
      ingredientFractions: {
        'schar-mix-b': 0.5,
      },
    },
    {
      id: 'mix-wet-dough',
      title: {
        uk: 'Сметанна основа',
        en: 'Sour cream mixture',
        es: 'Mezcla de crema agria',
      },
      instruction: {
        uk: 'В іншій мисці змішайте сметану, яйця й дрібку солі. Окремо перемішайте соду, лимонну кислоту та 2 ч. л. борошна, додайте до сметанної суміші й залиште на 2–3 хвилини.',
        en: 'In a separate bowl, mix the sour cream, eggs and a pinch of salt. Combine the baking soda, citric acid and 2 tsp flour, stir into the sour cream mixture and leave for 2–3 minutes.',
        es: 'En otro bol, mezcla la crema agria, los huevos y una pizca de sal. Mezcla aparte el bicarbonato, el ácido cítrico y 2 cucharaditas de harina, incorpóralos al bol y deja reposar 2–3 minutos.',
      },
      quantityMentions: [
        {
          text: {
            uk: '2 ч. л.',
            en: '2 tsp',
            es: '2 cucharaditas',
          },
          quantity: {
            kind: 'exact',
            value: 2,
            unit: 'tsp',
          },
        },
      ],
      ingredientLineIds: [
        'cultured-dairy-dough',
        'eggs-dough',
        'salt-dough',
        'baking-soda',
        'citric-acid',
        'flour-leavener',
      ],
      duration: {
        kind: 'range',
        min: 2,
        max: 3,
        unit: 'minute',
      },
      mediaIds: ['napoleon-author-wet-v1'],
      guidance: [
        {
          id: 'bubbly-mixture',
          kind: 'checkpoint',
          text: {
            uk: 'На поверхні з’являються бульбашки, а суміш трохи піднімається — час додавати борошно.',
            en: 'Bubbles appear on the surface and the mixture rises slightly: it is ready for the flour.',
            es: 'Cuando aparezcan burbujas y la mezcla suba un poco, ya puedes añadir la harina.',
          },
        },
      ],
    },
    {
      id: 'combine-dough',
      title: {
        uk: 'Короткий заміс',
        en: 'A brief mix',
        es: 'Amasado breve',
      },
      instruction: {
        uk: 'Додайте до сметанної основи 250 г борошна й перемішайте. Потім додайте масляну крихту з першого кроку та з’єднайте в тісто. У комбайні це займає приблизно пару хвилин.',
        en: 'Stir 250 g flour into the sour cream mixture, then add the butter and flour crumb from the first step. Mix just until the dough comes together; a couple of minutes in a mixer.',
        es: 'Añade 250 g de harina a la mezcla de crema agria y remueve. Incorpora las migas de mantequilla del primer paso y mezcla solo hasta unir la masa; en una amasadora bastan unos dos minutos.',
      },
      quantityMentions: [
        {
          text: {
            uk: '250 г',
            en: '250 g',
            es: '250 g',
          },
          quantity: {
            kind: 'exact',
            value: 250,
            unit: 'g',
          },
        },
      ],
      ingredientLineIds: ['schar-mix-b'],
      equipmentIds: ['food-processor'],
      mediaIds: ['napoleon-author-combine-v1', 'napoleon-author-dough-v1'],
      guidance: [
        {
          id: 'stop-mixing',
          kind: 'checkpoint',
          text: {
            uk: 'Щойно тісто зібралося в єдину масу, зупиніться.',
            en: 'Stop as soon as the dough holds together.',
            es: 'Para en cuanto la masa quede unida.',
          },
        },
      ],
      ingredientFractions: {
        'schar-mix-b': 0.5,
      },
    },
    {
      id: 'divide-and-chill',
      title: {
        uk: 'Поділ і охолодження',
        en: 'Portion and chill',
        es: 'Porciones y reposo',
      },
      instruction: {
        uk: 'Зберіть тісто в кулю, сформуйте кілька ковбасок і наріжте на 12 частин. Умочіть зрізи в борошно, накрийте й поставте в холодильник на 1–2 години.',
        en: 'Gather the dough into a ball, shape it into a few logs and cut into 12 portions. Dip the cut sides in flour, cover and refrigerate for 1–2 hours.',
        es: 'Forma una bola con la masa, divídela en varios cilindros y córtalos en 12 porciones. Pasa las caras cortadas por harina, tapa y guarda en la nevera durante 1–2 horas.',
      },
      quantityMentions: [
        {
          text: {
            uk: '12',
            en: '12',
            es: '12',
          },
          quantity: {
            kind: 'exact',
            value: 12,
            unit: 'piece',
          },
          numberOnly: true,
        },
      ],
      ingredientLineIds: ['flour-dusting'],
      duration: {
        kind: 'range',
        min: 1,
        max: 2,
        unit: 'hour',
      },
      mediaIds: ['napoleon-author-portions-v1'],
      guidance: [
        {
          id: 'temper-firm-dough',
          kind: 'practicalTip',
          text: {
            uk: 'Якщо після тривалого охолодження тісто дуже тверде, дайте йому 5–10 хвилин при кімнатній температурі.',
            en: 'If the dough is very firm after a longer chill, let it soften at room temperature for 5–10 minutes.',
            es: 'Si la masa está muy dura tras un reposo más largo, déjala 5–10 minutos a temperatura ambiente.',
          },
        },
      ],
    },
    {
      id: 'roll-layer',
      title: {
        uk: 'Два складання',
        en: 'Two folds',
        es: 'Dos pliegues',
      },
      instruction: {
        uk: 'На пергаменті трохи розкачайте одну порцію й складіть краї до середини, щоб вийшов квадрат. Ще раз розкачайте та складіть так само. Потім розкачайте тонко до потрібної форми.',
        en: 'On baking parchment, roll one portion out a little, then fold the edges in to make a square. Roll and fold once more, then roll out thinly to the shape you need.',
        es: 'Sobre papel de horno, estira un poco una porción y dobla los bordes hacia dentro para formar un cuadrado. Vuelve a estirar y a plegar de la misma manera. Después, estira una lámina fina con la forma deseada.',
      },
      ingredientLineIds: ['flour-dusting'],
      equipmentIds: ['parchment'],
      mediaIds: [
        'napoleon-author-rolled-square-v1',
        'napoleon-author-folded-square-v1',
      ],
      guidance: [
        {
          id: 'rolling-pin-parchment',
          kind: 'practicalTip',
          text: {
            uk: 'Металеву качалку достатньо припорошити борошном. Для дерев’яної накрийте тісто другим листом пергаменту й розкачуйте через нього, щоб не прилипало.',
            en: 'Lightly flour a metal rolling pin. With a wooden one, cover the dough with a second sheet of parchment and roll through it to prevent sticking.',
            es: 'Si el rodillo es metálico, basta con enharinarlo ligeramente. Si es de madera, cubre la masa con otra hoja de papel de horno y estira por encima para que no se pegue.',
          },
        },
      ],
    },
    {
      id: 'trim-layer',
      title: {
        uk: 'Форма коржа',
        en: 'Cut to size',
        es: 'Recorta el disco',
      },
      instruction: {
        uk: 'Зніміть верхній пергамент, якщо використовували, і наколіть тісто виделкою. Прикладіть тарілку або кришку діаметром 24 см та обріжте по контуру. Залиште обрізки поруч на тому самому пергаменті — після випікання вони підуть на крихту.',
        en: 'Remove the top sheet of parchment, if used, and prick the dough with a fork. Use a 24 cm plate or lid as a guide and cut around it. Leave the trimmings beside the round on the same parchment: once baked, they will make the crumb topping.',
        es: 'Retira el papel de arriba, si lo has usado, y pincha la masa con un tenedor. Coloca un plato o una tapa de 24 cm encima y recorta el contorno. Deja los recortes al lado, sobre el mismo papel: una vez horneados, servirán para cubrir la tarta con migas.',
      },
      ingredientLineIds: [],
      equipmentIds: ['parchment', 'fork', '24cm-template'],
      mediaIds: ['napoleon-author-trimmed-v1'],
    },
    {
      id: 'bake-layer',
      title: {
        uk: 'До золотистого кольору',
        en: 'Bake until golden',
        es: 'Hasta que se dore',
      },
      instruction: {
        uk: 'Перенесіть корж із пергаментом на деко й випікайте разом з обрізками при 200°C приблизно 7–10 хвилин. Готовий корж обережно зсуньте з пергаменту на тарілку.',
        en: 'Transfer the pastry on its parchment to a baking tray and bake with the trimmings at 200°C for about 7–10 minutes. Gently slide the baked layer off the parchment onto a plate.',
        es: 'Pasa la masa con su papel a una bandeja y hornea con los recortes a 200°C durante unos 7–10 minutos. Desliza con cuidado el disco horneado del papel a un plato.',
      },
      ingredientLineIds: [],
      duration: {
        kind: 'range',
        min: 7,
        max: 10,
        unit: 'minute',
      },
      temperature: {
        value: 200,
        unit: 'C',
        ovenMode: 'conventional',
      },
      equipmentIds: ['parchment'],
      mediaIds: ['napoleon-author-baked-v1'],
      guidance: [
        {
          id: 'golden-layer',
          kind: 'checkpoint',
          text: {
            uk: 'Орієнтуйтеся на золотистий колір, а не лише на час.',
            en: 'Use the golden colour as your guide, as well as the baking time.',
            es: 'Guíate por el color dorado, además del tiempo de horneado.',
          },
        },
        {
          id: 'slide-fragile-layer',
          kind: 'practicalTip',
          text: {
            uk: 'Не піднімайте корж руками: він крихкий і може зламатися.',
            en: 'Avoid lifting the layer with your hands: it is fragile and can break.',
            es: 'Evita levantar el disco con las manos: es frágil y puede romperse.',
          },
        },
      ],
    },
    {
      id: 'heat-milk',
      quantityMentions: [
        {
          text: {
            uk: '600–650 мл',
            en: '600–650 ml',
            es: '600–650 ml',
          },
          quantity: {
            kind: 'range',
            min: 600,
            max: 650,
            unit: 'ml',
          },
        },
      ],
      title: {
        uk: 'Нагрійте молоко',
        en: 'Heat the milk',
        es: 'Calienta la leche',
      },
      instruction: {
        uk: 'Відлийте 600–650 мл холодного молока. Решту молока нагрійте майже до кипіння.',
        en: 'Set aside 600–650 ml of cold milk. Heat the remaining milk until almost boiling.',
        es: 'Reserva 600–650 ml de leche fría. Calienta el resto de la leche hasta casi hervir.',
      },
      ingredientLineIds: ['milk-custard'],
      equipmentIds: ['large-saucepan'],
    },
    {
      id: 'mix-custard-base',
      quantityMentions: [
        {
          text: {
            uk: '4 шт.',
            en: '4 pcs',
            es: '4 uds.',
          },
          quantity: {
            kind: 'exact',
            value: 4,
            unit: 'piece',
          },
        },
      ],
      title: {
        uk: 'Змішайте основу крему',
        en: 'Mix the custard base',
        es: 'Prepara la base de la crema',
      },
      instruction: {
        uk: 'У великій мисці змішайте цукор, обидва крохмалі, ванільний цукор і сіль. Додайте відлите холодне молоко й розмішайте до гладкості, потім додайте яйця для крему — 4 шт.',
        en: 'In a large bowl, combine the sugar, both starches, vanilla sugar and salt. Add the reserved cold milk and stir until smooth, then add the custard eggs — 4 pcs.',
        es: 'En un bol grande, mezcla el azúcar, los dos almidones, el azúcar vainillado y la sal. Añade la leche fría reservada y remueve hasta que quede liso; incorpora después los huevos para la crema: 4 uds.',
      },
      ingredientLineIds: [
        'sugar-custard',
        'corn-starch-custard',
        'tapioca-custard',
        'vanilla-sugar-custard',
        'salt-custard',
        'milk-custard',
        'eggs-custard',
      ],
      equipmentIds: ['whisk'],
    },
    {
      id: 'temper-custard',
      title: {
        uk: 'Темперуйте яєчну суміш',
        en: 'Temper the egg mixture',
        es: 'Templa la mezcla de huevo',
      },
      instruction: {
        uk: 'Влийте 2–3 ополоники гарячого молока в яєчно-крохмальну суміш, перемішайте й поверніть все в каструлю.',
        en: 'Whisk 2–3 ladlefuls of hot milk into the egg and starch mixture, then return everything to the saucepan.',
        es: 'Incorpora 2–3 cucharones de leche caliente a la mezcla de huevos y almidón, remueve y devuelve todo a la cacerola.',
      },
      ingredientLineIds: ['milk-custard'],
      equipmentIds: ['large-saucepan', 'whisk'],
    },
    {
      id: 'cook-custard',
      title: {
        uk: 'Зваріть крем',
        en: 'Cook the custard',
        es: 'Cuece la crema',
      },
      instruction: {
        uk: 'Варіть на середньому вогні, постійно працюючи вінчиком. Після перших бульбашок варіть ще 30–60 секунд.',
        en: 'Cook over medium heat, whisking constantly. After the first bubbles appear, cook for another 30–60 seconds.',
        es: 'Cocina a fuego medio, batiendo constantemente. Cuando aparezcan las primeras burbujas, cocina 30–60 segundos más.',
      },
      ingredientLineIds: [],
      duration: {
        kind: 'range',
        min: 30,
        max: 60,
        unit: 'second',
      },
      equipmentIds: ['large-saucepan', 'whisk'],
      guidance: [
        {
          id: 'first-bubbles',
          kind: 'checkpoint',
          text: {
            uk: 'Відраховуйте фінальні 30–60 секунд після появи перших бульбашок.',
            en: 'Start the final 30–60 seconds when the first bubbles appear.',
            es: 'Empieza a contar los últimos 30–60 segundos cuando aparezcan las primeras burbujas.',
          },
        },
      ],
    },
    {
      id: 'finish-custard',
      title: {
        uk: 'Додайте масло',
        en: 'Add the butter',
        es: 'Añade la mantequilla',
      },
      instruction: {
        uk: 'Зніміть крем з вогню, додайте масло й розмішайте до однорідності.',
        en: 'Remove the custard from the heat, add the butter and stir until smooth.',
        es: 'Retira la crema del fuego, añade la mantequilla y remueve hasta que quede homogénea.',
      },
      ingredientLineIds: ['butter-custard'],
      equipmentIds: ['whisk'],
      mediaIds: ['napoleon-finished-custard-v3'],
    },
    {
      id: 'toast-walnuts',
      title: {
        uk: 'Підсушіть волоські горіхи',
        en: 'Toast the walnuts',
        es: 'Tuesta las nueces',
      },
      instruction: {
        uk: 'Підсушіть волоські горіхи при 160°C 8–10 хвилин.',
        en: 'Toast the walnuts at 160°C for 8–10 minutes.',
        es: 'Tuesta las nueces a 160°C durante 8–10 minutos.',
      },
      ingredientLineIds: ['walnuts'],
      duration: {
        kind: 'range',
        min: 8,
        max: 10,
        unit: 'minute',
      },
      temperature: {
        value: 160,
        unit: 'C',
        ovenMode: 'conventional',
      },
    },
    {
      id: 'toast-almonds',
      title: {
        uk: 'Підсушіть мигдальні пластівці',
        en: 'Toast the almonds',
        es: 'Tuesta las almendras',
      },
      instruction: {
        uk: 'Підсушіть мигдальні пластівці при 160°C 4–5 хвилин.',
        en: 'Toast the flaked almonds at 160°C for 4–5 minutes.',
        es: 'Tuesta las almendras laminadas a 160°C durante 4–5 minutos.',
      },
      ingredientLineIds: ['flaked-almonds'],
      duration: {
        kind: 'range',
        min: 4,
        max: 5,
        unit: 'minute',
      },
      temperature: {
        value: 160,
        unit: 'C',
        ovenMode: 'conventional',
      },
    },
    {
      id: 'assemble-cake',
      title: {
        uk: 'Складіть торти',
        en: 'Assemble the cakes',
        es: 'Monta las tartas',
      },
      instruction: {
        uk: 'На кожен торт використайте 6 коржів. Використовуйте крем теплим. Нанесіть крем на кожен корж, додаючи волоські горіхи через один шар. Зверху посипте крихтою від коржів і мигдальними пластівцями.',
        en: 'Use six layers for each cake. Use the custard while warm. Spread it on every layer, adding walnuts to every other layer. Finish with layer crumbs and flaked almonds.',
        es: 'Usa seis capas para cada tarta. Usa la crema templada. Extiéndela sobre cada capa y añade nueces en capas alternas. Termina con migas de los recortes y almendras laminadas.',
      },
      ingredientLineIds: ['walnuts', 'flaked-almonds'],
      mediaIds: ['napoleon-round-six-layer-assembly-v3'],
    },
    {
      id: 'rest-assembled-cake',
      title: {
        uk: 'Залиште при кімнатній температурі',
        en: 'Rest at room temperature',
        es: 'Deja reposar a temperatura ambiente',
      },
      instruction: {
        uk: 'Після складання залиште торт приблизно на 1 годину при кімнатній температурі.',
        en: 'After assembly, leave the cake at room temperature for about 1 hour.',
        es: 'Después del montaje, deja la tarta aproximadamente 1 hora a temperatura ambiente.',
      },
      ingredientLineIds: [],
      duration: {
        kind: 'exact',
        value: 1,
        unit: 'hour',
      },
    },
    {
      id: 'refrigerate-cake',
      title: {
        uk: 'Охолодіть до наступного дня',
        en: 'Chill overnight',
        es: 'Refrigera hasta el día siguiente',
      },
      instruction: {
        uk: 'Поставте торт у холодильник на 12–24 години. Найкращий смак — наступного дня.',
        en: 'Refrigerate the cake for 12–24 hours. It tastes best the next day.',
        es: 'Refrigera la tarta durante 12–24 horas. Está mejor al día siguiente.',
      },
      ingredientLineIds: [],
      duration: {
        kind: 'range',
        min: 12,
        max: 24,
        unit: 'hour',
      },
    },
  ],
  storage: null,
  makeAhead: {
    uk: 'Тісто можна охолоджуйте на ніч. Після складання торт дозріває в холодильнику 12–24 години; найкращий смак — наступного дня.',
    en: 'The dough may be chilled overnight. After assembly, refrigerate the cake for 12–24 hours; it tastes best the next day.',
    es: 'La masa puede refrigerarse toda la noche. Después del montaje, deja la tarta 12–24 horas en la nevera; está mejor al día siguiente.',
  },
  variations: [
    {
      id: 'less-rich-base',
      dimension: 'fat',
      label: {
        uk: 'Менш жирна базова версія',
        en: 'Less-rich base version',
        es: 'Versión base menos grasa',
      },
      description: {
        uk: 'Поточна базова версія використовує 120 г вершкового масла та 50 г олії.',
        en: 'The current base uses 120 g butter and 50 g oil.',
        es: 'La versión base actual usa 120 g de mantequilla y 50 g de aceite.',
      },
      provenance: {
        state: 'repeatedlyVerified',
        sourceIds: ['inventory-row', 'archive-status-note'],
      },
      availability: 'default',
    },
    {
      id: 'more-custard',
      dimension: 'method',
      label: {
        uk: '2,8–3 л молока для соковитішого торта',
        en: '2.8–3 l milk for a moister cake',
        es: '2,8–3 l de leche para una tarta más jugosa',
      },
      description: {
        uk: 'Історична нотатка пропонує перевірити більший обсяг крему; пропорції інших інгредієнтів не вказані.',
        en: 'A historical note proposes testing more custard; adjusted quantities for the other ingredients are not recorded.',
        es: 'Una nota histórica propone probar más crema; no se registran las cantidades ajustadas de los demás ingredientes.',
      },
      provenance: {
        state: 'suggested',
        sourceIds: ['archive-refinement-note'],
      },
      availability: 'hiddenUntilConfirmed',
      blockingGapIds: ['confirm-cream-volume'],
    },
    {
      id: 'citrus-zest',
      dimension: 'flavour',
      label: {
        uk: 'Цитрусова цедра',
        en: 'Citrus zest',
        es: 'Ralladura de cítricos',
      },
      description: {
        uk: 'Історична нотатка пропонує спробувати лимонну цедру; кількість і спосіб додавання не вказані.',
        en: 'A historical note suggests trying lemon zest; no amount or method is recorded.',
        es: 'Una nota histórica sugiere probar ralladura de limón; no se indican cantidad ni método.',
      },
      provenance: {
        state: 'suggested',
        sourceIds: ['archive-refinement-note'],
      },
      availability: 'hiddenUntilConfirmed',
    },
    {
      id: 'vanilla-seeds',
      dimension: 'flavour',
      label: {
        uk: 'Насіння ванілі',
        en: 'Vanilla seeds',
        es: 'Semillas de vainilla',
      },
      description: {
        uk: 'Історична нотатка пропонує спробувати насіння ванілі; кількість не вказана.',
        en: 'A historical note suggests trying vanilla seeds; no amount is recorded.',
        es: 'Una nota histórica sugiere probar semillas de vainilla; no se indica la cantidad.',
      },
      provenance: {
        state: 'suggested',
        sourceIds: ['archive-refinement-note'],
      },
      availability: 'hiddenUntilConfirmed',
    },
    {
      id: 'thinner-layers-1-2mm',
      dimension: 'method',
      label: {
        uk: 'Коржі товщиною приблизно 1,2 мм',
        en: 'Layers about 1.2 mm thick',
        es: 'Capas de unos 1,2 mm de grosor',
      },
      description: {
        uk: 'Історична нотатка пропонує перевірити тонше розкачування замість базових приблизно 1,5 мм.',
        en: 'A historical note proposes testing thinner rolling instead of the base thickness of about 1.5 mm.',
        es: 'Una nota histórica propone probar un estirado más fino en lugar del grosor base de unos 1,5 mm.',
      },
      provenance: {
        state: 'suggested',
        sourceIds: ['archive-refinement-note'],
      },
      availability: 'hiddenUntilConfirmed',
    },
  ],
  heroMediaId: 'napoleon-generated-card-v3',
  media: [
    {
      id: 'napoleon-generated-card-v3',
      type: 'image',
      path: '/images/recipes/gluten-free-napoleon-card-v3.webp',
      usage: ['hero', 'gallery'],
      alt: {
        uk: 'Безглютеновий торт Наполеон із шістьма тонкими коржами, заварним кремом і горіхами',
        en: 'Gluten-free Napoleon cake with six thin layers, custard and nuts',
        es: 'Tarta Napoleón sin gluten con seis capas finas, crema pastelera y frutos secos',
      },
    },
    {
      id: 'napoleon-author-crumb-v1',
      type: 'image',
      path: '/media/recipes/gluten-free-napoleon/author-2026-10-04/butter-flour-crumb-author-landscape-v1.webp',
      usage: ['step'],
      alt: {
        uk: 'Дрібна масляно-борошняна крихта на ложці в чаші комбайна',
        en: 'Fine butter and flour crumbs on a spoon in the food processor',
        es: 'Migas finas de mantequilla y harina en una cuchara dentro del robot de cocina',
      },
      fit: 'cover',
    },
    {
      id: 'napoleon-author-wet-v1',
      type: 'image',
      path: '/media/recipes/gluten-free-napoleon/author-2026-10-04/wet-mixture-author-landscape-v1.webp',
      usage: ['step'],
      alt: {
        uk: 'Бульбашки на поверхні сметанно-яєчної суміші',
        en: 'Bubbles on the surface of the sour cream and egg mixture',
        es: 'Burbujas en la superficie de la mezcla de crema agria y huevos',
      },
      fit: 'cover',
    },
    {
      id: 'napoleon-author-combine-v1',
      type: 'image',
      path: '/media/recipes/gluten-free-napoleon/author-2026-10-04/combine-dough-author-landscape-v1.webp',
      usage: ['step'],
      alt: {
        uk: 'Масляна крихта додана до густої основи тіста в чаші',
        en: 'Butter and flour crumbs added to the wet dough in the mixer bowl',
        es: 'Migas de mantequilla y harina añadidas a la masa húmeda en el bol',
      },
      fit: 'cover',
    },
    {
      id: 'napoleon-author-portions-v1',
      type: 'image',
      path: '/media/recipes/gluten-free-napoleon/author-2026-10-04/dough-portions-author-landscape-v1.webp',
      usage: ['step'],
      alt: {
        uk: 'Дванадцять порцій тіста з припорошеними борошном зрізами',
        en: 'Twelve dough portions with flour-dusted cut sides',
        es: 'Doce porciones de masa con las caras cortadas enharinadas',
      },
      fit: 'cover',
    },
    {
      id: 'napoleon-author-dough-v1',
      type: 'image',
      path: '/media/recipes/gluten-free-napoleon/author-2026-10-04/dough-ball-author-v1.webp',
      usage: ['step'],
      alt: {
        uk: 'Замішане тісто зібране в одну кулю',
        en: 'The mixed dough gathered into one ball',
        es: 'La masa ya mezclada, recogida en una bola',
      },
      fit: 'cover',
    },
    {
      id: 'napoleon-author-rolled-square-v1',
      type: 'image',
      path: '/media/recipes/gluten-free-napoleon/author-2026-10-04/rolled-square-author-landscape-v1.webp',
      usage: ['step'],
      alt: {
        uk: 'Порція тіста розкачана в квадрат на пергаменті',
        en: 'A portion of dough rolled into a square on parchment',
        es: 'Una porción de masa estirada en forma de cuadrado sobre papel de horno',
      },
      fit: 'cover',
    },
    {
      id: 'napoleon-author-folded-square-v1',
      type: 'image',
      path: '/media/recipes/gluten-free-napoleon/author-2026-10-04/folded-square-author-landscape-v1.webp',
      usage: ['step'],
      alt: {
        uk: 'Тісто складене в квадрат перед наступним розкачуванням',
        en: 'Dough folded into a square before rolling again',
        es: 'Masa plegada en forma de cuadrado antes de volver a estirarla',
      },
      fit: 'cover',
    },
    {
      id: 'napoleon-author-trimmed-v1',
      type: 'image',
      path: '/media/recipes/gluten-free-napoleon/author-2026-10-04/trimmed-layer-author-landscape-v1.webp',
      usage: ['step'],
      alt: {
        uk: 'Круглий сирий корж з обрізками на пергаменті в деку',
        en: 'A round unbaked layer with trimmings on a parchment-lined tray',
        es: 'Un disco de masa cruda con sus recortes sobre papel de horno en una bandeja',
      },
      fit: 'cover',
    },
    {
      id: 'napoleon-author-baked-v1',
      type: 'image',
      path: '/media/recipes/gluten-free-napoleon/author-2026-10-04/baked-layers-author-landscape-v1.webp',
      usage: ['step'],
      alt: {
        uk: 'Стос золотистих коржів Наполеона, поруч спечені обрізки',
        en: 'A stack of golden Napoleon layers with baked trimmings alongside',
        es: 'Una pila de discos dorados de Napoleón con los recortes horneados al lado',
      },
      fit: 'cover',
    },
    {
      id: 'napoleon-finished-custard-v3',
      type: 'image',
      path: '/media/recipes/gluten-free-napoleon/selected/finished-custard-v3.webp',
      usage: ['step'],
      alt: {
        uk: 'Густий гладкий ванільний заварний крем після додавання масла',
        en: 'Thick smooth vanilla custard after the butter has been added',
        es: 'Crema pastelera de vainilla espesa y lisa después de añadir la mantequilla',
      },
    },
    {
      id: 'napoleon-round-six-layer-assembly-v3',
      type: 'image',
      path: '/media/recipes/gluten-free-napoleon/selected/round-six-layer-assembly-v3.webp',
      usage: ['step'],
      alt: {
        uk: 'Теплий крем розподіляють по круглому коржу під час складання шестишарового Наполеона',
        en: 'Warm custard being spread over a round layer while assembling a six-layer Napoleon cake',
        es: 'Crema templada extendida sobre una capa redonda durante el montaje de una tarta Napoleón de seis capas',
      },
    },
  ],
  relatedRecipeIds: [],
  sources: [
    {
      id: 'inventory-row',
      file: 'docs/reference/recipe-inventory.xlsx',
      locator: 'Recipe Inventory!A12:R12',
    },
    {
      id: 'archive-recipe',
      file: 'docs/reference/recipe-inventory.xlsx',
      locator: 'Recipe Archive!A74:B82',
    },
    {
      id: 'archive-refinement-note',
      file: 'docs/reference/recipe-inventory.xlsx',
      locator: 'Recipe Archive!A83:B83',
    },
    {
      id: 'archive-status-note',
      file: 'docs/reference/recipe-inventory.xlsx',
      locator: 'Recipe Archive!A84:B84',
    },
    {
      id: 'author-update',
      file: 'Current ChatGPT conversation',
      locator: 'Author confirmations through 2026-09-20',
    },
    {
      id: 'ux-form-example',
      file: 'docs/reference/UX-IA-Specification-v1.md',
      locator: 'Napoleon form example',
    },
    {
      id: 'author-bake-2026-10-04',
      file: 'Current Codex conversation, 2026-10-04',
      locator:
        'Author process photographs IMG_1715–IMG_1733 and approved seven-step method; subsequent confirmation of 250 g butter, 24 cm and 200°C.',
      note: 'Source originals and image edit prompts are retained under media/recipes/gluten-free-napoleon/original/2026-10-04 and working/2026-10-04. Process photos have background/plate edits; hero and custard/assembly illustrations retain their existing origin.',
    },
  ],
  contentGaps: [
    {
      id: 'validate-28cm-form',
      area: 'form',
      field: 'geometry.alternatives.round-28cm-preview',
      question:
        'Bake-test the 28 cm adaptation of the current 24 cm dough before enabling Cook Mode.',
      publicationBlocking: false,
      sourceIds: ['author-bake-2026-10-04'],
    },
    {
      id: 'review-translations',
      area: 'translation',
      field: 'translationState.en/es',
      question: 'Human-review the EN and ES recipe wording and SEO slugs.',
      publicationBlocking: false,
      sourceIds: ['archive-recipe'],
    },
    {
      id: 'record-storage',
      area: 'storage',
      field: 'storage',
      question:
        'Record storage instructions beyond the 12–24 hour maturation period.',
      publicationBlocking: false,
      sourceIds: ['archive-recipe'],
    },
  ],
} satisfies RecipeDraft;
