import type { RecipeDraft } from './recipe.types.ts';
import { quantityFromGrams, quantityFromSpoons } from './spoon-weights.ts';

export const glutenFreeNapoleonRecipe = {
  schemaVersion: 2,
  id: 'gluten-free-napoleon',
  versionId: 'gluten-free-napoleon-v4',
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
    uk: 'Торти по 6 тонких коржів діаметром 24 см із заварним кремом; горіхи — за бажанням.',
    en: 'Cakes with six thin 24 cm layers each and custard; nuts are optional.',
    es: 'Tartas de seis capas finas de 24 cm con crema pastelera; los frutos secos son opcionales.',
  },
  categoryIds: ['celebration', 'layer-cake'],
  situationIds: ['celebration'],
  difficulty: 'medium',
  baseProvenance: {
    state: 'tested',
    sourceIds: ['author-bake-2026-10-04', 'author-custard-2026-10-04'],
    note: 'Author baked and photographed the 24 cm sour-cream dough at 200°C and confirmed the new 2 l milk, 6 egg custard and two six-layer cakes, one plain and one with nuts. Earlier versions’ repeated-bake history does not apply to this version.',
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
        state: 'tested',
        sourceIds: ['author-custard-2026-10-04'],
        note: 'Author-confirmed 2026-10-04 custard formula. Butter remains the existing 100 g; starch alternatives follow author guidance, not a separate bake-test of each option.',
      },
      lines: [
        {
          id: 'milk-custard',
          options: [
            {
              ingredientId: 'milk',
              name: {
                uk: 'молоко',
                en: 'milk',
                es: 'leche',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 2000,
              unit: 'ml',
            },
            shopping: {
              mode: 'base',
            },
          },
        },
        {
          id: 'eggs-custard',
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
              value: 6,
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
          id: 'sugar-custard',
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
          quantity: quantityFromGrams('granulated-sugar', 400),
        },
        {
          id: 'flour-custard',
          options: [
            {
              ingredientId: 'schar-mix-b',
              name: {
                uk: 'борошно Schär Mix B',
                en: 'Schär Mix B flour',
                es: 'harina Schär Mix B',
              },
            },
          ],
          quantity: quantityFromGrams('schar-mix-b', 40),
        },
        {
          id: 'starch-custard',
          qualifier: {
            uk: 'або тапіоковий крохмаль',
            en: 'or tapioca starch',
            es: 'o almidón de tapioca',
          },
          options: [
            {
              ingredientId: 'corn-starch',
              name: {
                uk: 'кукурудзяний крохмаль',
                en: 'corn starch',
                es: 'almidón de maíz',
              },
            },
            {
              ingredientId: 'tapioca-starch',
              name: {
                uk: 'тапіоковий крохмаль',
                en: 'tapioca starch',
                es: 'almidón de tapioca',
              },
            },
          ],
          choose: 1,
          quantity: {
            base: {
              kind: 'exact',
              value: 30,
              unit: 'g',
            },
            equivalent: {
              kind: 'exact',
              value: 2,
              unit: 'tbsp',
            },
            shopping: {
              mode: 'base',
            },
          },
          provenance: {
            state: 'authorGuidance',
            sourceIds: ['author-custard-2026-10-04'],
            note: 'Author specifies 30 g (2 tbsp using her measure), choosing corn or tapioca starch. This recipe-specific spoon measure does not change the general conversion table.',
          },
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
            base: {
              kind: 'exact',
              value: 16,
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
      id: 'assembly',
      title: {
        uk: 'Горіхи та оздоблення',
        en: 'Nuts and finish',
        es: 'Frutos secos y acabado',
      },
      lines: [
        {
          id: 'walnuts',
          qualifier: { uk: 'або пекан', en: 'or pecans', es: 'o pecanas' },
          options: [
            {
              ingredientId: 'walnut',
              name: {
                uk: 'волоські горіхи',
                en: 'walnuts',
                es: 'nueces',
              },
            },
            {
              ingredientId: 'pecan',
              name: {
                uk: 'пекан',
                en: 'pecans',
                es: 'nueces pecanas',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 150,
              unit: 'g',
            },
            shopping: {
              mode: 'base',
            },
          },
          optional: true,
          choose: 1,
          preparation: {
            uk: 'сирі або підсушені, подрібнені',
            en: 'raw or toasted, chopped',
            es: 'crudas o tostadas, picadas',
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
      title: {
        uk: 'Молоко для крему',
        en: 'Milk for the custard',
        es: 'Leche para la crema',
      },
      instruction: {
        uk: 'Налийте все молоко (2000 мл) у велику каструлю й доведіть до кипіння.',
        en: 'Pour all the milk (2000 ml) into a large saucepan and bring to a boil.',
        es: 'Vierte toda la leche (2000 ml) en una cacerola grande y llévala a ebullición.',
      },
      quantityMentions: [
        {
          text: {
            uk: '2000 мл',
            en: '2000 ml',
            es: '2000 ml',
          },
          quantity: {
            kind: 'exact',
            value: 2000,
            unit: 'ml',
          },
        },
      ],
      ingredientLineIds: ['milk-custard'],
      equipmentIds: ['large-saucepan'],
      mediaIds: ['napoleon-author-milk-v1'],
    },
    {
      id: 'mix-custard-base',
      title: {
        uk: 'Яєчна основа',
        en: 'Egg mixture',
        es: 'Mezcla de huevo',
      },
      instruction: {
        uk: 'У великій мисці з’єднайте цукор, борошно, крохмаль, ванільний цукор і яйця для крему — 6 шт. Збийте вінчиком до однорідності.',
        en: 'In a large bowl, combine the sugar, flour, starch, vanilla sugar and custard eggs — 6 pcs. Whisk until smooth.',
        es: 'En un bol grande, mezcla el azúcar, la harina, el almidón, el azúcar vainillado y los huevos para la crema: 6 uds. Bate con varillas hasta obtener una mezcla homogénea.',
      },
      quantityMentions: [
        {
          text: {
            uk: '6 шт.',
            en: '6 pcs',
            es: '6 uds.',
          },
          quantity: {
            kind: 'exact',
            value: 6,
            unit: 'piece',
          },
        },
      ],
      ingredientLineIds: [
        'sugar-custard',
        'flour-custard',
        'starch-custard',
        'vanilla-sugar-custard',
        'eggs-custard',
      ],
      equipmentIds: ['whisk'],
      mediaIds: ['napoleon-author-custard-base-v1'],
    },
    {
      id: 'temper-custard',
      title: {
        uk: 'Поступове нагрівання яєць',
        en: 'Warming the egg mixture',
        es: 'Templado de los huevos',
      },
      instruction: {
        uk: 'Відберіть із каструлі гаряче молоко для темперування — приблизно 2 склянки. Вливайте його в яєчну суміш тонкою цівкою, постійно перемішуючи вінчиком, до однорідності.',
        en: 'Take about 2 cups of hot milk from the saucepan. Pour it into the egg mixture in a thin stream, whisking continuously until smooth.',
        es: 'Retira unas 2 tazas de leche caliente de la cacerola. Viértela en un hilo fino sobre la mezcla de huevo, batiendo continuamente hasta integrar.',
      },
      quantityMentions: [
        {
          text: {
            uk: '2 склянки',
            en: '2 cups',
            es: '2 tazas',
          },
          quantity: {
            kind: 'exact',
            value: 2,
            unit: 'cup',
          },
        },
      ],
      ingredientLineIds: [],
      equipmentIds: ['whisk'],
      mediaIds: ['napoleon-author-tempering-v1'],
    },
    {
      id: 'cook-custard',
      title: {
        uk: 'Загущення крему',
        en: 'Thickening the custard',
        es: 'Espesado de la crema',
      },
      instruction: {
        uk: 'Влийте яєчну суміш у гаряче молоко, постійно помішуючи. Прогрівайте, проводячи вінчиком або лопаткою по всьому дну й піднімаючи густішу масу, щоб вона не прилипала й не підгоряла.',
        en: 'Pour the egg mixture into the hot milk, stirring continuously. Heat while sweeping the whisk or spatula across the entire bottom and lifting the thickening mixture to prevent sticking or scorching.',
        es: 'Vierte la mezcla de huevo en la leche caliente sin dejar de remover. Calienta pasando las varillas o una espátula por todo el fondo y levantando la mezcla que espesa para que no se pegue ni se queme.',
      },
      ingredientLineIds: [],
      equipmentIds: ['large-saucepan', 'whisk'],
      mediaIds: ['napoleon-author-custard-texture-v1'],
      guidance: [
        {
          id: 'first-bubbles',
          kind: 'checkpoint',
          text: {
            uk: 'Щойно крем загусне й з’являться перші бульбашки, вимкніть вогонь.',
            en: 'Turn off the heat as soon as the custard thickens and the first bubbles appear.',
            es: 'Apaga el fuego en cuanto la crema espese y aparezcan las primeras burbujas.',
          },
        },
      ],
    },
    {
      id: 'finish-custard',
      title: {
        uk: 'Масло в гарячий крем',
        en: 'Butter to finish',
        es: 'Acabado con mantequilla',
      },
      instruction: {
        uk: 'Додайте масло й перемішуйте, доки воно повністю розтане та з’єднається з кремом.',
        en: 'Add the butter and stir until it has completely melted into the custard.',
        es: 'Añade la mantequilla y remueve hasta que se funda por completo y se integre en la crema.',
      },
      ingredientLineIds: ['butter-custard'],
      equipmentIds: ['whisk'],
    },
    {
      id: 'prepare-nuts',
      title: {
        uk: 'Горіхи за бажанням',
        en: 'Optional nuts',
        es: 'Frutos secos opcionales',
      },
      instruction: {
        uk: 'Поки готується крем, подрібніть сирі або підсушені волоські горіхи чи пекан до невеликих шматочків.',
        en: 'While the custard is cooking, chop raw or toasted walnuts or pecans into small pieces.',
        es: 'Mientras se prepara la crema, pica nueces o pecanas, crudas o tostadas, en trozos pequeños.',
      },
      ingredientLineIds: ['walnuts'],
    },
    {
      id: 'assemble-cake',
      title: {
        uk: 'Шари й оздоблення',
        en: 'Layers and finish',
        es: 'Capas y acabado',
      },
      instruction: {
        uk: 'На кожен торт використайте 6 коржів, перемазуючи кожен теплим кремом. За бажанням додавайте горіхи в кожен прошарок або через один. Зверху посипте крихтою зі спечених обрізків.',
        en: 'Use six pastry layers for each cake, spreading warm custard over each one. If using nuts, add them to every layer or alternate layers. Top with crumbs from the baked trimmings.',
        es: 'Usa seis discos por tarta y reparte crema templada sobre cada uno. Si usas frutos secos, añádelos en cada capa o en capas alternas. Cubre con migas de los recortes horneados.',
      },
      ingredientLineIds: ['walnuts'],
      mediaIds: [
        'napoleon-author-plain-layer-v1',
        'napoleon-author-nut-layer-v1',
      ],
      guidance: [
        {
          id: 'family-cakes',
          kind: 'practicalTip',
          text: {
            uk: 'Мій син не дуже любить горіхи, тому з цієї порції я роблю два торти по шість коржів: один лише з кремом, другий — із горішками. Так смакує всім.',
            en: 'My son is not keen on nuts, so I make two six-layer cakes from this batch: one with custard only and one with nuts. That way, everyone enjoys it.',
            es: 'A mi hijo no le gustan mucho los frutos secos, así que con esta cantidad preparo dos tartas de seis capas: una solo con crema y otra con nueces. Así hay para todos los gustos.',
          },
        },
      ],
    },
    {
      id: 'rest-assembled-cake',
      title: {
        uk: 'Коротка витримка',
        en: 'A short rest',
        es: 'Reposo breve',
      },
      instruction: {
        uk: 'Залиште торти приблизно на 1 годину при кімнатній температурі, щоб вони трохи стабілізувалися.',
        en: 'Leave the cakes at room temperature for about 1 hour to let them settle a little.',
        es: 'Deja las tartas a temperatura ambiente aproximadamente 1 hora para que se asienten un poco.',
      },
      ingredientLineIds: [],
      duration: {
        kind: 'exact',
        value: 1,
        unit: 'hour',
      },
      mediaIds: ['napoleon-author-hero-v1'],
    },
    {
      id: 'refrigerate-cake',
      title: {
        uk: 'Ніч у холодильнику',
        en: 'Overnight in the fridge',
        es: 'Una noche en la nevera',
      },
      instruction: {
        uk: 'Охолоджуйте 12–24 години: за цей час коржі просочаться кремом. Найкраще подавати наступного дня.',
        en: 'Chill for 12–24 hours so the pastry layers absorb the custard. Serve the next day for the best flavour.',
        es: 'Refrigera durante 12–24 horas para que las capas absorban la crema. Sírvela al día siguiente para disfrutarla en su mejor momento.',
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
    uk: 'Тісто можна охолоджувати всю ніч. Після складання торт дозріває в холодильнику 12–24 години; найкращий смак — наступного дня.',
    en: 'The dough may be chilled overnight. After assembly, refrigerate the cake for 12–24 hours; it tastes best the next day.',
    es: 'La masa puede refrigerarse toda la noche. Después del montaje, deja la tarta 12–24 horas en la nevera; está mejor al día siguiente.',
  },
  variations: [
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
  heroMediaId: 'napoleon-author-hero-v1',
  media: [
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
      id: 'napoleon-author-hero-v1',
      type: 'image',
      path: '/media/recipes/gluten-free-napoleon/author-custard-2026-10-04/hero-tea-editorial-v2.webp',
      usage: ['hero', 'gallery', 'step'],
      alt: {
        uk: 'Наполеон із заварним кремом, вкритий золотистою крихтою',
        en: 'Napoleon cake with custard and a golden crumb coating',
        es: 'Tarta Napoleón con crema pastelera y cobertura de migas doradas',
      },
      fit: 'cover',
    },
    {
      id: 'napoleon-author-milk-v1',
      type: 'image',
      path: '/media/recipes/gluten-free-napoleon/author-custard-2026-10-04/milk-author-v1.webp',
      usage: ['step'],
      alt: {
        uk: 'Молоко в каструлі перед приготуванням крему',
        en: 'Milk in the saucepan for the custard',
        es: 'Leche en la cacerola para preparar la crema',
      },
      fit: 'cover',
    },
    {
      id: 'napoleon-author-custard-base-v1',
      type: 'image',
      path: '/media/recipes/gluten-free-napoleon/author-custard-2026-10-04/custard-base-author-v1.webp',
      usage: ['step'],
      alt: {
        uk: 'Однорідна яєчна основа крему з вінчиком у мисці',
        en: 'Smooth egg mixture with a whisk in the bowl',
        es: 'Mezcla de huevo homogénea con varillas en el bol',
      },
      fit: 'cover',
    },
    {
      id: 'napoleon-author-tempering-v1',
      type: 'image',
      path: '/media/recipes/gluten-free-napoleon/author-custard-2026-10-04/tempering-author-v1.webp',
      usage: ['step'],
      alt: {
        uk: 'Яєчна суміш після додавання гарячого молока, поруч каструля',
        en: 'Egg mixture after adding hot milk, beside the saucepan',
        es: 'Mezcla de huevo tras añadir leche caliente, junto a la cacerola',
      },
      fit: 'cover',
    },
    {
      id: 'napoleon-author-custard-texture-v1',
      type: 'image',
      path: '/media/recipes/gluten-free-napoleon/author-custard-2026-10-04/custard-texture-author-v1.webp',
      usage: ['step'],
      alt: {
        uk: 'Густий заварний крем стікає з ложки в каструлю',
        en: 'Thick custard flowing from a spoon into the saucepan',
        es: 'Crema pastelera espesa cayendo de la cuchara a la cacerola',
      },
      fit: 'cover',
    },
    {
      id: 'napoleon-author-plain-layer-v1',
      type: 'image',
      path: '/media/recipes/gluten-free-napoleon/author-custard-2026-10-04/plain-layer-author-v1.webp',
      usage: ['step'],
      alt: {
        uk: 'Корж Наполеона з рівним шаром заварного крему',
        en: 'Napoleon pastry layer covered with custard',
        es: 'Disco de Napoleón cubierto de crema pastelera',
      },
      fit: 'cover',
    },
    {
      id: 'napoleon-author-nut-layer-v1',
      type: 'image',
      path: '/media/recipes/gluten-free-napoleon/author-custard-2026-10-04/nut-layer-author-v1.webp',
      usage: ['step'],
      alt: {
        uk: 'Корж із заварним кремом і подрібненими горіхами',
        en: 'Pastry layer with custard and chopped nuts',
        es: 'Disco con crema pastelera y frutos secos picados',
      },
      fit: 'cover',
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
      note: 'Dough originals and background-edit prompts are retained under media/recipes/gluten-free-napoleon/original/2026-10-04 and working/2026-10-04.',
    },
    {
      id: 'author-custard-2026-10-04',
      file: 'Current Codex conversation, 2026-10-04',
      locator:
        'Author photographs IMG_1735–IMG_1758 and recorded custard/assembly method; explicit ingredient clarification: 6 eggs, 400 g sugar, 16 g vanilla sugar, 40 g Schär Mix B (2 tbsp), 30 g corn or tapioca starch (2 tbsp), 2 l milk.',
      note: 'Butter retained at 100 g from prior recipe. Photo originals and MOV retained in original/2026-10-04-custard; selected photo edits and prompts in working/2026-10-04-custard. Hero and process media are edited author photos: backgrounds, plate colour, framing and light balance adjusted with built-in image_gen; food preserved.',
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
