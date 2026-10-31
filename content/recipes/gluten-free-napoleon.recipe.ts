import type { RecipeDraft } from './recipe.types.ts';
import { quantityFromGrams } from './spoon-weights.ts';

export const glutenFreeNapoleonRecipe = {
  schemaVersion: 2,
  id: 'gluten-free-napoleon',
  versionId: 'gluten-free-napoleon-v5',
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
    uk: 'Два торти по 7 тонких коржів діаметром 24 см із заварним кремом; горіхи — за бажанням.',
    en: 'Two cakes with seven thin 24 cm layers each and custard; nuts are optional.',
    es: 'Dos tartas de siete capas finas de 24 cm con crema pastelera; los frutos secos son opcionales.',
  },
  categoryIds: ['celebration', 'layer-cake'],
  situationIds: ['celebration'],
  difficulty: 'medium',
  baseProvenance: {
    state: 'tested',
    sourceIds: ['author-bake-2026-10-26', 'author-custard-2026-10-04', 'author-update-2026-10-28'],
    note: 'Author tested the unleavened dough in half and one-third batches on 2026-10-25/26, then supplied the final full-batch method and yield on 2026-10-28. Custard evidence is unchanged; scaled adaptations do not inherit this status.',
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
        id: 'chill-dough',
        label: {
          uk: 'Охолодження тіста',
          en: 'Dough chilling',
          es: 'Refrigeración de la masa',
        },
        duration: {
          kind: 'range',
          min: 15,
          max: 1440,
          unit: 'minute',
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
          min: 5,
          max: 7,
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
      id: 'two-seven-layer-cakes',
      label: {
        uk: '2 торти',
        en: '2 cakes',
        es: '2 tartas',
      },
      amount: 2,
      unit: 'cake',
      details: {
        uk: 'Усього 14 коржів; кожен торт має 7 коржів діаметром 24 см',
        en: '14 layers in total; each cake has seven 24 cm layers',
        es: '14 capas en total; cada tarta tiene siete capas de 24 cm',
      },
      provenance: {
        state: 'tested',
        sourceIds: ['author-update-2026-10-28'],
      },
      availability: 'default',
    },
    alternatives: [],
  },
  geometry: {
    default: {
      id: 'round-24cm-7-layers-each',
      label: {
        uk: 'Для кожного торта 7 круглих коржів діаметром 24 см',
        en: 'Seven 24 cm round layers for each cake',
        es: 'Siete capas redondas de 24 cm para cada tarta',
      },
      kind: 'roundTemplate',
      application: 'roll-and-trim',
      shape: 'round',
      diameterCm: 24,
      layerCount: 7,
      material: null,
      provenance: {
        state: 'tested',
        sourceIds: ['author-update-2026-10-28'],
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
          sourceIds: ['author-bake-2026-10-26', 'author-update-2026-10-28'],
          note: 'Area-based adaptation of the current 24 cm unleavened base. This exact dough at 28 cm has not been bake-tested.',
        },
        availability: 'previewOnly',
        blockingGapIds: ['validate-28cm-form'],
      },
    ],
  },
  configuration: {
    base: {
      status: 'Tested',
      geometryId: 'round-24cm-7-layers-each',
      yieldId: 'two-seven-layer-cakes',
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
      sourceIds: ['author-bake-2026-10-26', 'author-update-2026-10-28'],
      note: 'Schär Mix B Bread is the author-tested flour mix for the unleavened dough; all 500 g goes into the butter crumb.',
    },
    testedAlternativeMixes: [],
    knownUnsupportedMixes: [],
  },
  beforeStart: [
    {
      id: 'plan-parchment',
      relatedStepId: 'roll-layer',
      text: {
        uk: 'Підготуй пергамент для всіх коржів і тарілку або кришку діаметром 24 см. Перед випіканням розігрій духовку до 200°C з конвекцією.',
        en: 'Prepare baking parchment for all the layers and a 24 cm plate or lid. Preheat the oven to 200°C with the fan on before baking.',
        es: 'Prepara papel de horno para todas las capas y un plato o una tapa de 24 cm. Precalienta el horno a 200°C con ventilador antes de hornear.',
      },
    },
    {
      id: 'plan-chilling-and-maturation',
      relatedStepId: 'refrigerate-cake',
      text: {
        uk: 'Плануй приготування за день: тісто охолоджується 15–30 хвилин або до 24 годин, а зібраний торт відпочиває 1 годину при кімнатній температурі та 12–24 години в холодильнику.',
        en: 'Plan a day ahead: chill the dough for 15–30 minutes or up to 24 hours, then let the assembled cake rest for 1 hour at room temperature and 12–24 hours in the refrigerator.',
        es: 'Planifica con un día de antelación: enfría la masa 15–30 minutos o hasta 24 horas; la tarta montada reposa 1 hora a temperatura ambiente y 12–24 horas en la nevera.',
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
        sourceIds: ['author-bake-2026-10-26', 'author-update-2026-10-28'],
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
        uk: 'Наріж 250 г холодного масла кубиками й додай до всього борошна (500 г) у чаші комбайна. Подрібни короткими імпульсами.',
        en: 'Cut 250 g cold butter into cubes and add it to all 500 g of flour in a food processor. Pulse briefly.',
        es: 'Corta 250 g de mantequilla fría en dados y ponla con toda la harina (500 g) en el robot de cocina. Tritura con pulsaciones cortas.',
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
        {
          text: {
            uk: '500 г',
            en: '500 g',
            es: '500 g',
          },
          quantity: {
            kind: 'exact',
            value: 500,
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
    },
    {
      id: 'mix-wet-dough',
      title: {
        uk: 'Сметанна основа',
        en: 'Sour cream mixture',
        es: 'Mezcla de crema agria',
      },
      instruction: {
        uk: 'В іншій мисці змішай сметану, яйця й дрібку солі до однорідності.',
        en: 'In a separate bowl, mix the sour cream, eggs and a pinch of salt until smooth.',
        es: 'En otro bol, mezcla la crema agria, los huevos y una pizca de sal hasta que quede homogéneo.',
      },
      ingredientLineIds: ['cultured-dairy-dough', 'eggs-dough', 'salt-dough'],
    },
    {
      id: 'combine-dough',
      title: {
        uk: 'Короткий заміс',
        en: 'A brief mix',
        es: 'Amasado breve',
      },
      instruction: {
        uk: 'Влий сметанну основу до масляної крихти й коротко з’єднай у тісто.',
        en: 'Pour the sour cream mixture into the butter crumb and mix briefly until the dough comes together.',
        es: 'Vierte la mezcla de crema agria sobre las migas de mantequilla y mezcla brevemente hasta unir la masa.',
      },
      ingredientLineIds: [],
      equipmentIds: ['food-processor'],
      mediaIds: ['napoleon-author-dough-v1'],
      guidance: [
        {
          id: 'stop-mixing',
          kind: 'checkpoint',
          text: {
            uk: 'Щойно тісто зібралося в єдину масу, зупинись.',
            en: 'Stop as soon as the dough holds together.',
            es: 'Para en cuanto la masa quede unida.',
          },
        },
      ],
    },
    {
      id: 'divide-and-chill',
      title: {
        uk: 'Поділ і охолодження',
        en: 'Portion and chill',
        es: 'Porciones y reposo',
      },
      instruction: {
        uk: 'Поділи тісто на 14 частин, накрий плівкою й постав у холодильник на 15–30 хвилин. Можна залишити до 24 годин — результат однаковий, тож тісто зручно замісити звечора.',
        en: 'Divide the dough into 14 portions, cover with film and refrigerate for 15–30 minutes. You can leave it for up to 24 hours with the same result, so making it the evening before works well.',
        es: 'Divide la masa en 14 porciones, cúbrela con film y refrigera durante 15–30 minutos. Puedes dejarla hasta 24 horas con el mismo resultado, así que es práctico prepararla la noche anterior.',
      },
      quantityMentions: [
        {
          text: {
            uk: '14',
            en: '14',
            es: '14',
          },
          quantity: {
            kind: 'exact',
            value: 14,
            unit: 'piece',
          },
          numberOnly: true,
        },
      ],
      ingredientLineIds: [],
      duration: {
        kind: 'range',
        min: 15,
        max: 1440,
        unit: 'minute',
      },
      guidance: [
        {
          id: 'temper-firm-dough',
          kind: 'practicalTip',
          text: {
            uk: 'Якщо після тривалого охолодження тісто дуже тверде, почекай 10–15 хвилин перед розкачуванням.',
            en: 'If the dough is very firm after a longer chill, wait 10–15 minutes before rolling it out.',
            es: 'Si la masa está muy dura tras un reposo largo, espera 10–15 minutos antes de estirarla.',
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
        uk: 'На пергаменті трохи розкачай одну порцію й склади краї до середини конвертиком. Ще раз розкачай і склади так само. Потім розкачай тонко.',
        en: 'On baking parchment, roll one portion out a little and fold the edges in like an envelope. Roll and fold once more, then roll it out thinly.',
        es: 'Sobre papel de horno, estira un poco una porción y dobla los bordes hacia dentro como un sobre. Vuelve a estirar y plegar; después, estírala fina.',
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
            uk: 'Металеву качалку достатньо припорошити борошном. Для дерев’яної накрий тісто другим листом пергаменту й розкачуй через нього, щоб не прилипало.',
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
        uk: 'Зніми верхній пергамент, якщо використовувався. Приклади тарілку або кришку діаметром 24 см, виріж коло й наколи його виделкою. Залиш обрізки поруч на тому самому пергаменті — після випікання вони підуть на крихту.',
        en: 'Remove the top sheet of parchment, if used. Use a 24 cm plate or lid as a guide, cut out the round and prick it with a fork. Leave the trimmings beside it on the same parchment for the crumb topping.',
        es: 'Retira el papel de arriba, si lo has usado. Recorta un círculo con un plato o una tapa de 24 cm y pínchalo con un tenedor. Deja los recortes al lado sobre el mismo papel para cubrir la tarta con migas.',
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
        uk: 'Перенеси корж із пергаментом на деко й випікай разом з обрізками при 200°C з конвекцією 5–7 хвилин, до золотистого кольору. Бульбашки на коржі — це нормально. Без конвекції теж працює, але може знадобитися трохи більше часу. Готовий корж обережно зсунь із пергаменту на тарілку.',
        en: 'Transfer the pastry on its parchment to a baking tray and bake with the trimmings at 200°C with the fan on for 5–7 minutes, until golden. Blisters on the layer are normal. A conventional oven also works but may take a little longer. Gently slide the baked layer off the parchment onto a plate.',
        es: 'Pasa la masa con su papel a una bandeja y hornéala con los recortes a 200°C con ventilador durante 5–7 minutos, hasta que esté dorada. Es normal que aparezcan burbujas en el disco. Sin ventilador también funciona, pero puede tardar un poco más. Desliza con cuidado el disco horneado del papel a un plato.',
      },
      ingredientLineIds: [],
      duration: {
        kind: 'range',
        min: 5,
        max: 7,
        unit: 'minute',
      },
      temperature: {
        value: 200,
        unit: 'C',
        ovenMode: 'fan',
      },
      equipmentIds: ['parchment'],
      mediaIds: ['napoleon-author-baked-v1'],
      guidance: [
        {
          id: 'golden-layer',
          kind: 'checkpoint',
          text: {
            uk: 'Орієнтуйся на золотистий колір, а не лише на час.',
            en: 'Use the golden colour as your guide, as well as the baking time.',
            es: 'Guíate por el color dorado, además del tiempo de horneado.',
          },
        },
        {
          id: 'slide-fragile-layer',
          kind: 'practicalTip',
          text: {
            uk: 'Не піднімай гарячий корж руками: він може зламатися.',
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
        uk: 'Налий усе молоко (2000 мл) у велику каструлю й доведи до кипіння.',
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
        uk: 'У великій мисці з’єднай цукор, борошно, крохмаль, ванільний цукор і яйця для крему — 6 шт. Збий вінчиком до однорідності.',
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
        uk: 'Відбери з каструлі гаряче молоко для темперування — приблизно 2 склянки. Вливай його в яєчну суміш тонкою цівкою, постійно перемішуючи вінчиком, до однорідності.',
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
        uk: 'Влий яєчну суміш у гаряче молоко, постійно помішуючи. Прогрівай, проводячи вінчиком або лопаткою по всьому дну й піднімаючи густішу масу, щоб вона не прилипала й не підгоряла.',
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
            uk: 'Щойно крем загусне й з’являться перші бульбашки, вимкни вогонь.',
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
        uk: 'Додай масло й перемішуй, доки воно повністю розтане та з’єднається з кремом.',
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
        uk: 'Поки готується крем, подрібни сирі або підсушені волоські горіхи чи пекан до невеликих шматочків.',
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
        uk: 'На кожен торт використай 7 коржів, перемазуючи кожен теплим кремом. За бажанням додай горіхи в кожен прошарок або через один. Зверху посип крихтою зі спечених обрізків.',
        en: 'Use seven pastry layers for each cake, spreading warm custard over each one. If using nuts, add them to every layer or alternate layers. Top with crumbs from the baked trimmings.',
        es: 'Usa siete discos por tarta y reparte crema templada sobre cada uno. Si usas frutos secos, añádelos en cada capa o en capas alternas. Cubre con migas de los recortes horneados.',
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
            uk: 'З цієї порції можна скласти два торти по сім коржів: один лише з кремом, другий — із горіхами.',
            en: 'This batch makes two seven-layer cakes: one with custard only and one with nuts.',
            es: 'Con esta cantidad puedes montar dos tartas de siete capas: una solo con crema y otra con nueces.',
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
        uk: 'Залиш торти приблизно на 1 годину при кімнатній температурі, щоб вони трохи стабілізувалися.',
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
        uk: 'Охолоджуй 12–24 години: за цей час коржі просочаться кремом. Найкраще подавати наступного дня.',
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
    uk: 'Тісто можна замісити звечора: після 15–30 хвилин і до 24 годин у холодильнику результат однаковий. Після складання торт дозріває в холодильнику 12–24 години; найкращий смак — наступного дня.',
    en: 'You can make the dough the evening before: chilling for 15–30 minutes or up to 24 hours gives the same result. After assembly, refrigerate the cake for 12–24 hours; it tastes best the next day.',
    es: 'Puedes preparar la masa la noche anterior: entre 15–30 minutos y hasta 24 horas en la nevera, el resultado es el mismo. Después del montaje, deja la tarta 12–24 horas en la nevera; está mejor al día siguiente.',
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
  heroMediaId: 'napoleon-author-hero-preview-2359-v1',
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
      usage: ['gallery', 'step'],
      alt: {
        uk: 'Наполеон із заварним кремом, вкритий золотистою крихтою',
        en: 'Napoleon cake with custard and a golden crumb coating',
        es: 'Tarta Napoleón con crema pastelera y cobertura de migas doradas',
      },
      fit: 'cover',
    },
    {
      id: 'napoleon-author-hero-preview-2359-v1',
      type: 'image',
      path: '/media/recipes/gluten-free-napoleon/hero-img-2359-crop-v1.webp',
      usage: ['hero'],
      alt: {
        uk: 'Розрізаний Наполеон на тарілці на тлі бордових квітів',
        en: 'Cut Napoleon cake on a plate in front of red flowers',
        es: 'Tarta Napoleón cortada en un plato ante flores rojas',
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
      id: 'author-bake-2026-10-26',
      file: 'docs/codex/codex-napoleon-recipe-v5.uk.md',
      locator: 'Author side-by-side dough test, 2026-10-25/26',
      note: 'Unleavened dough tested in half and one-third batches. All flour was cut into the butter crumb; layers were flaky and strong.',
    },
    {
      id: 'author-update-2026-10-28',
      file: 'Current Codex conversation, 2026-10-28',
      locator: 'Final author dough formula, 14 portions, 15–30 minutes to 24 hours chilling, and 200°C fan bake for 5–7 minutes.',
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
      sourceIds: ['author-bake-2026-10-26', 'author-update-2026-10-28'],
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
