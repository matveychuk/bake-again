import type { Recipe } from './recipe.types.ts';

export const glutenFreeNapoleonRecipe = {
  schemaVersion: 3,
  id: 'gluten-free-napoleon',
  versionId: 'gluten-free-napoleon-v6',
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
    en: 'Gluten-Free Napoleon Cake',
    es: 'Tarta Napoleón sin gluten',
    uk: 'Безглютеновий Наполеон',
  },
  summary: {
    uk: 'Два торти по 8 тонких коржів діаметром 24 см із заварним кремом; горіхи — за бажанням.',
    en: 'Two cakes with eight thin 24 cm layers each and custard; nuts are optional.',
    es: 'Dos tartas de ocho láminas finas de 24 cm con crema pastelera; las nueces son opcionales.',
  },
  categoryIds: ['celebration', 'layer-cake'],
  situationIds: ['celebration'],
  difficulty: 'medium',
  baseProvenance: {
    state: 'tested',
    sourceIds: [
      'author-bake-2026-10-26',
      'author-custard-2026-10-04',
      'author-update-2026-10-28',
      'author-lesson-shoot-2026-11-02',
    ],
    note: "Author tested the unleavened dough in half and one-third batches on 2026-10-25/26, then supplied the final full-batch method and yield on 2026-10-28. Custard evidence is unchanged; scaled adaptations do not inherit this status. v6 aligned with the author's video lesson (full batch, 2026-11-02/03).",
  },
  timing: {
    activeMinutes: 60,
    totalElapsedMinutes: null,
    planningNote: {
      text: {
        uk: 'Можна різати через годину; найкраще — після 4–5 годин у холодильнику або ночі.',
        en: 'You can slice it after an hour; it is best after 4–5 hours in the fridge or overnight.',
        es: 'Puedes cortarla al cabo de una hora; queda mejor tras 4–5 horas en la nevera o una noche.',
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
          min: 30,
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
          min: 7,
          max: 8,
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
        relatedStepId: 'rest-assembled-cake',
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
          min: 4,
          max: 12,
          unit: 'hour',
        },
        relatedStepId: 'refrigerate-cake',
      },
    ],
    provenance: {
      state: 'tested',
      sourceIds: ['author-lesson-shoot-2026-11-02'],
    },
  },
  yield: {
    default: {
      id: 'two-eight-layer-cakes',
      label: {
        uk: '2 торти',
        en: '2 cakes',
        es: '2 tartas',
      },
      unit: 'cake',
      details: {
        uk: 'Усього 16 коржів; кожен торт має 8 коржів діаметром 24 см',
        en: '16 layers in total; each cake has eight 24 cm layers',
        es: '16 láminas en total; cada tarta lleva ocho láminas de 24 cm',
      },
      provenance: {
        state: 'tested',
        sourceIds: [
          'author-update-2026-10-28',
          'author-lesson-shoot-2026-11-02',
        ],
      },
      availability: 'default',
      count: {
        kind: 'exact',
        value: 2,
      },
    },
    alternatives: [],
  },
  geometry: {
    default: {
      id: 'round-24cm-8-layers-each',
      label: {
        uk: 'Для кожного торта 8 круглих коржів діаметром 24 см',
        en: 'Eight 24 cm round layers for each cake',
        es: 'Ocho láminas redondas de 24 cm para cada tarta',
      },
      kind: 'roundTemplate',
      application: 'roll-and-trim',
      shape: 'round',
      diameterCm: 24,
      layerCount: 8,
      material: null,
      provenance: {
        state: 'tested',
        sourceIds: [
          'author-update-2026-10-28',
          'author-lesson-shoot-2026-11-02',
        ],
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
    state: 'known',
  },
  configuration: {
    base: {
      geometryId: 'round-24cm-8-layers-each',
      yieldId: 'two-eight-layer-cakes',
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
    basis: 'commercialMix',
  },
  beforeStart: [
    {
      id: 'plan-parchment',
      relatedStepId: 'roll-layer',
      text: {
        uk: 'Підготуй пергамент для всіх коржів, тарілку або кришку діаметром 24 см і два деки. Перед випіканням розігрій духовку до 200 °C.',
        en: 'Prepare baking parchment for all the layers, a 24 cm plate or lid and two baking trays. Preheat the oven to 200 °C before baking.',
        es: 'Prepara papel de horno para todas las láminas, un plato o una tapa de 24 cm y dos bandejas. Precalienta el horno a 200 °C antes de hornear.',
      },
    },
    {
      id: 'plan-chilling-and-maturation',
      relatedStepId: 'refrigerate-cake',
      text: {
        uk: 'Тісто охолоджується від 30 хвилин до 24 годин, тож його можна зробити звечора. Зібраний торт можна різати через годину, але найкраще він тримає форму після 4–5 годин у холодильнику або ночі.',
        en: 'The dough chills for 30 minutes to 24 hours, so you can make it the evening before. You can slice the assembled cake after an hour, but it holds its shape best after 4–5 hours in the fridge or overnight.',
        es: 'La masa reposa en frío de 30 minutos a 24 horas, así que puedes prepararla la víspera. La tarta montada se puede cortar al cabo de una hora, pero mantiene mejor la forma tras 4–5 horas en la nevera o una noche.',
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
        sourceIds: [
          'author-bake-2026-10-26',
          'author-update-2026-10-28',
          'author-lesson-shoot-2026-11-02',
        ],
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
          quantity: {
            base: {
              kind: 'exact',
              value: 500,
              unit: 'g',
            },
            equivalent: {
              kind: 'exact',
              value: 25,
              unit: 'tbsp',
            },
            shopping: {
              mode: 'base',
            },
          },
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
                uk: 'сметана або йогурт',
                en: 'sour cream or yogurt',
                es: 'crema agria o yogur',
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
        sourceIds: [
          'author-custard-2026-10-04',
          'author-lesson-shoot-2026-11-02',
        ],
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
          quantity: {
            base: {
              kind: 'exact',
              value: 400,
              unit: 'g',
            },
            equivalent: {
              kind: 'exact',
              value: 20,
              unit: 'tbsp',
            },
            shopping: {
              mode: 'base',
            },
          },
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
          quantity: {
            base: {
              kind: 'exact',
              value: 40,
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
          optional: true,
          qualifier: {
            uk: 'за бажанням',
            en: 'optional',
            es: 'opcional',
          },
        },
        {
          id: 'vanilla-sugar-custard',
          noteQuantityMentions: [
            {
              text: {
                uk: '2',
                en: '2',
                es: '2',
              },
              quantity: {
                kind: 'exact',
                value: 2,
                unit: 'packet',
              },
              numberOnly: true,
            },
          ],
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
          qualifier: {
            uk: '2 пакетики',
            en: '2 sachets',
            es: '2 sobres',
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
          qualifier: {
            uk: 'або що є вдома',
            en: 'or whatever you have',
            es: 'o los que tengas',
          },
          options: [
            {
              ingredientId: 'walnut',
              name: {
                uk: 'волоські горіхи й пекан',
                en: 'walnuts and pecans',
                es: 'nueces y pacanas',
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
            uk: 'підсмажені й подрібнені',
            en: 'toasted and chopped',
            es: 'tostados y picados',
          },
        },
      ],
      provenance: {
        state: 'tested',
        sourceIds: ['author-lesson-shoot-2026-11-02'],
      },
    },
  ],
  steps: [
    {
      id: 'mix-wet-dough',
      title: {
        uk: 'Сметанна основа',
        en: 'Sour cream mixture',
        es: 'Mezcla de crema agria',
      },
      instruction: {
        uk: 'Збий міксером яйця зі сметаною або йогуртом до однорідності, приблизно хвилину.',
        en: 'Beat the eggs with the sour cream or yogurt until smooth, about a minute.',
        es: 'Bate los huevos con la crema agria o el yogur hasta que quede homogéneo, más o menos un minuto.',
      },
      ingredientLineIds: ['cultured-dairy-dough', 'eggs-dough'],
      mediaIds: ['napoleon-author-wet-v1'],
    },
    {
      id: 'cut-in-butter',
      title: {
        uk: 'Масляна крихта',
        en: 'Butter and flour crumb',
        es: 'Migas de mantequilla y harina',
      },
      instruction: {
        uk: 'У чашу комбайна виклади шарами: борошно — холодне масло кубиками — борошно (усього 500 г борошна й 250 г масла). Подрібни короткими імпульсами.',
        en: 'Layer flour, cold cubed butter and flour again in the food processor bowl (500 g flour and 250 g butter in total). Pulse briefly.',
        es: 'En el vaso del robot, pon por capas harina, mantequilla fría en dados y otra vez harina (500 g de harina y 250 g de mantequilla en total). Tritura con pulsaciones cortas.',
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
        {
          id: 'freeze-butter',
          kind: 'practicalTip',
          text: {
            uk: "Якщо масло м'якне, постав його на 15–30 хвилин у морозилку.",
            en: 'If the butter is soft, put it in the freezer for 15–30 minutes.',
            es: 'Si la mantequilla está blanda, métela 15–30 minutos en el congelador.',
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
        uk: 'Додай сметанну основу й дрібку солі до масляної крихти й коротко перемішай гаком. Лопаткою збери борошно з країв чаші й увімкни міксер ще раз — щоб тісто зібралося в кульку.',
        en: 'Add the sour cream mixture and a pinch of salt to the butter crumb and mix briefly with the dough hook. Scrape the flour from the sides of the bowl with a spatula and mix once more until the dough comes together in a ball.',
        es: 'Añade la mezcla de crema agria y una pizca de sal a las migas de mantequilla y mezcla brevemente con el gancho. Con una espátula, recoge la harina de las paredes del bol y vuelve a mezclar hasta que la masa forme una bola.',
      },
      ingredientLineIds: ['salt-dough'],
      equipmentIds: ['food-processor'],
      mediaIds: ['napoleon-author-combine-v1', 'napoleon-author-dough-v1'],
      guidance: [
        {
          id: 'stop-mixing',
          kind: 'checkpoint',
          text: {
            uk: 'Щойно тісто зібралося в кульку, зупинись — не вимішуй довше.',
            en: "As soon as the dough forms a ball, stop; don't knead it any longer.",
            es: 'En cuanto la masa forme una bola, para; no la amases más.',
          },
        },
      ],
      lessonLink: {
        lessonId: 'napoleon-video',
        lessonStepId: 's03-short-mix',
      },
      lessonLinkText: {
        uk: 'Яким має бути тісто — у відеоуроці, крок 3',
        en: 'See how the dough should look — video lesson, step 3',
        es: 'Cómo debe quedar la masa: videoclase, paso 3',
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
        uk: 'Не вимішуючи, сформуй з тіста однорідну кульку. Розкачай її в ковбаску, розріж навпіл і кожну половину поділи на 8 частин — усього 16. Зрізи вмочуй у борошно, щоб не липли. Накрий і постав у холодильник на 30 хвилин; можна залишити до 24 годин — результат той самий.',
        en: "Without kneading, shape the dough into a smooth ball. Roll it into a log, cut it in half and divide each half into 8 pieces — 16 in total. Dip the cut sides in flour so they don't stick. Cover and refrigerate for 30 minutes; you can leave it for up to 24 hours with the same result.",
        es: 'Sin amasar, forma una bola homogénea con la masa. Haz un cilindro, córtalo por la mitad y divide cada mitad en 8 porciones: 16 en total. Pasa los cortes por harina para que no se peguen. Tapa y refrigera 30 minutos; puedes dejarla hasta 24 horas con el mismo resultado.',
      },
      quantityMentions: [
        {
          text: {
            uk: '16',
            en: '16',
            es: '16',
          },
          quantity: {
            kind: 'exact',
            value: 16,
            unit: 'piece',
          },
          numberOnly: true,
        },
        {
          text: {
            uk: '8',
            en: '8',
            es: '8',
          },
          quantity: {
            kind: 'exact',
            value: 8,
            unit: 'piece',
          },
          numberOnly: true,
        },
      ],
      ingredientLineIds: [],
      mediaIds: ['napoleon-author-portions-16-bg-v1'],
      guidance: [],
      displayMeta: {
        uk: '30 хв – 24 год',
        en: '30 min–24 hours',
        es: '30 min–24 h',
      },
      durationPhaseId: 'chill-dough',
    },
    {
      id: 'roll-layer',
      title: {
        uk: 'Два складання і розкачування',
        en: 'Two folds and rolling out',
        es: 'Dos pliegues y estirado',
      },
      instruction: {
        uk: 'На пергаменті трохи розкачай одну частину й склади краї до середини конвертиком. Ще раз розкачай і склади так само, потім тонко розкачай у всі боки, підсипаючи трохи борошна.',
        en: 'On baking parchment, roll out one piece a little and fold the edges into the middle like an envelope. Roll and fold once more, then roll it out thinly in all directions, dusting with a little flour.',
        es: 'Sobre papel de horno, estira un poco una porción y dobla los bordes hacia el centro como un sobre. Estira y dobla otra vez, y luego estírala fina en todas direcciones, espolvoreando un poco de harina.',
      },
      ingredientLineIds: ['flour-dusting'],
      equipmentIds: ['parchment'],
      mediaIds: [
        'napoleon-author-rolled-square-v1',
        'napoleon-author-folded-square-v1',
      ],
      guidance: [
        {
          id: 'temper-firm-dough',
          kind: 'practicalTip',
          text: {
            uk: 'Якщо після тривалого охолодження тісто дуже тверде, почекай 10–15 хвилин перед розкачуванням. Металеву качалку достатньо припорошити борошном. Для дерев’яної накрий тісто другим листом пергаменту й розкачуй через нього, щоб не прилипало.',
            en: 'If the dough is very firm after a longer chill, wait 10–15 minutes before rolling it out. Lightly flour a metal rolling pin. With a wooden one, cover the dough with a second sheet of parchment and roll through it to prevent sticking.',
            es: 'Si la masa está muy dura tras un reposo largo, espera 10–15 minutos antes de estirarla. Si el rodillo es metálico, basta con enharinarlo ligeramente. Si es de madera, cubre la masa con otra hoja de papel de horno y estira por encima para que no se pegue.',
          },
        },
      ],
      lessonLink: {
        lessonId: 'napoleon-video',
        lessonStepId: 's05-rolling',
      },
      lessonLinkText: {
        uk: 'Як складати конвертом і розкачувати — у відеоуроці, крок 5',
        en: 'How to fold and roll — video lesson, step 5',
        es: 'Cómo doblar y estirar: videoclase, paso 5',
      },
    },
    {
      id: 'trim-layer',
      title: {
        uk: 'Форма коржа',
        en: 'Cut to size',
        es: 'Recorta el disco',
      },
      instruction: {
        uk: 'Приклади тарілку або кришку діаметром 24 см і виріж коло ножем. Обрізки не прибирай — їх печемо разом із коржем, вони підуть на крихту. Наколи його виделкою.',
        en: 'Place a 24 cm plate or lid on the dough and cut around it with a knife. Leave the trimmings: they bake with the layer and become the crumb. Prick it with a fork.',
        es: 'Coloca un plato o una tapa de 24 cm y corta alrededor con un cuchillo. Deja los recortes: se hornean con la lámina y servirán para la miga. Pínchala con un tenedor.',
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
        uk: 'Перенеси корж разом із пергаментом на деко й випікай з обрізками при 200 °C 7–8 хвилин, до золотистого кольору. Корж здувається бульбашками — так і має бути. Щоб було швидше, печи два коржі одночасно: готовий верхній вийми, нижній переставляй наверх, а вниз став наступний.',
        en: "Slide the layer on its parchment onto a baking tray and bake it with the trimmings at 200 °C for 7–8 minutes, until golden. It puffs up in bubbles — that's how it should be. To save time, bake two at once: take out the finished top one, move the bottom one up and put the next one below.",
        es: 'Pasa la lámina con su papel a una bandeja y hornéala con los recortes a 200 °C durante 7–8 minutos, hasta que esté dorada. Se infla con burbujas, es lo normal. Para ir más rápido, hornea dos a la vez: saca la de arriba cuando esté lista, sube la de abajo y pon la siguiente debajo.',
      },
      ingredientLineIds: [],
      temperature: {
        value: 200,
        unit: 'C',
        ovenMode: 'conventional',
      },
      equipmentIds: ['parchment'],
      mediaIds: [
        'napoleon-lesson-two-trays-v1',
        'napoleon-author-baked-img2504-bg-v1',
      ],
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
      displayMeta: {
        uk: '7–8 хв · 200 °C',
        en: '7–8 min · 200 °C',
        es: '7–8 min · 200 °C',
      },
      durationPhaseId: 'bake-one-layer',
      lessonLink: {
        lessonId: 'napoleon-video',
        lessonStepId: 's07-baking',
      },
      lessonLinkText: {
        uk: 'Як корж здувається й коли його виймати — у відеоуроці, крок 7',
        en: 'How the layer puffs and when to take it out — video lesson, step 7',
        es: 'Cómo se infla la lámina y cuándo sacarla: videoclase, paso 7',
      },
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
        uk: 'У великій мисці збий вінчиком 6 яєць із цукром, борошном, крохмалем і 2 пакетиками ванільного цукру до однорідності.',
        en: 'In a large bowl, whisk the 6 eggs with the sugar, flour, starch and 2 sachets of vanilla sugar until smooth.',
        es: 'En un bol grande, bate con varillas los 6 huevos con el azúcar, la harina, el almidón y 2 sobres de azúcar avainillado hasta que quede homogéneo.',
      },
      quantityMentions: [
        {
          text: {
            uk: '6 яєць',
            en: '6 eggs',
            es: '6 huevos',
          },
          quantity: {
            kind: 'exact',
            value: 6,
            unit: 'piece',
          },
        },
        {
          text: {
            uk: '2',
            en: '2',
            es: '2',
          },
          quantity: {
            kind: 'exact',
            value: 2,
            unit: 'piece',
          },
          numberOnly: true,
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
      lessonLink: {
        lessonId: 'napoleon-video',
        lessonStepId: 's09-custard',
      },
      lessonLinkText: {
        uk: 'Як густішає крем — у відеоуроці, крок 9',
        en: 'How the custard thickens — video lesson, step 9',
        es: 'Cómo espesa la crema: videoclase, paso 9',
      },
    },
    {
      id: 'finish-custard',
      title: {
        uk: 'Масло — за бажанням',
        en: 'Butter (optional)',
        es: 'Mantequilla (opcional)',
      },
      instruction: {
        uk: 'За бажанням додай масло в гарячий крем і перемішуй, доки воно розтане. Без масла крем теж виходить — легший.',
        en: "If you like, add the butter to the hot custard and stir until it melts. The custard works without it too — it's just lighter.",
        es: 'Si quieres, añade la mantequilla a la crema caliente y remueve hasta que se derrita. Sin mantequilla también sale bien, solo que más ligera.',
      },
      ingredientLineIds: ['butter-custard'],
      equipmentIds: ['whisk'],
    },
    {
      id: 'prepare-nuts',
      title: {
        uk: 'Горіхи й крихта',
        en: 'Nuts and crumb',
        es: 'Nueces y migas',
      },
      instruction: {
        uk: 'Покриши руками спечені обрізки — це крихта для верху. Горіхи (волоські, пекан або які є) підсмаж на сухій сковороді, помішуючи, приблизно 4 хвилини, остуди й подрібни — не в пил.',
        en: 'Crumble the baked trimmings by hand — this is the crumb for the top. Toast the nuts (walnuts, pecans or whatever you have) in a dry pan for about 4 minutes, stirring, then cool and chop them — not to a powder.',
        es: 'Desmenuza a mano los recortes horneados: será la miga de arriba. Tuesta los frutos secos (nueces, pacanas o los que tengas) en una sartén sin aceite unos 4 minutos, removiendo; deja enfriar y pícalos, sin hacerlos polvo.',
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
        uk: 'На кожен торт — 8 коржів. Клади корж, покривай кремом на око, щоб закрити всю поверхню, посип горішками — і так до останнього коржа. Верх і боки обмаж кремом, посип верх горішками, а потім обсип торт крихтою зверху й з боків, притискаючи долонею.',
        en: 'Use 8 layers for each cake. Lay a layer, cover it with enough custard to coat the whole surface, sprinkle with nuts — and repeat up to the last layer. Spread custard over the top and sides, sprinkle the top with nuts, then coat the cake with crumb on top and around the sides, pressing it on with your palm.',
        es: 'Usa 8 láminas por tarta. Pon una lámina, cúbrela con crema a ojo hasta tapar toda la superficie, espolvorea nueces y repite hasta la última. Cubre con crema la parte de arriba y los lados, espolvorea nueces por encima y luego cubre la tarta con migas por arriba y por los lados, presionando con la palma.',
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
            uk: 'З цієї порції виходять два торти по вісім коржів: один можна зробити лише з кремом, другий — із горіхами.',
            en: 'This batch makes two cakes of eight layers: one can be custard only, the other with nuts.',
            es: 'Con esta cantidad salen dos tartas de ocho láminas: una puede ser solo con crema y la otra con nueces.',
          },
        },
      ],
      lessonLink: {
        lessonId: 'napoleon-video',
        lessonStepId: 's11-layering',
      },
      lessonLinkText: {
        uk: 'Скільки крему на корж і як обсипати торт — у відеоуроці, кроки 11–12',
        en: 'How much custard per layer and how to coat the cake — video lesson, steps 11–12',
        es: 'Cuánta crema por lámina y cómo cubrir la tarta: videoclase, pasos 11–12',
      },
    },
    {
      id: 'rest-assembled-cake',
      title: {
        uk: 'Коротка витримка',
        en: 'A short rest',
        es: 'Reposo breve',
      },
      instruction: {
        uk: 'Через годину при кімнатній температурі торт уже можна різати — він дуже ніжний.',
        en: 'After an hour at room temperature the cake can already be sliced — it is very tender.',
        es: 'Tras una hora a temperatura ambiente ya se puede cortar; está muy tierna.',
      },
      ingredientLineIds: [],
      mediaIds: ['napoleon-author-hero-v1'],
      displayMeta: {
        en: '1 hour',
        es: '1 h',
        uk: '1 год',
      },
      durationPhaseId: 'room-temperature-rest',
    },
    {
      id: 'refrigerate-cake',
      title: {
        uk: 'Холодильник: 4–5 годин або ніч',
        en: 'Fridge: 4–5 hours or overnight',
        es: 'Nevera: 4–5 horas o una noche',
      },
      instruction: {
        uk: 'Після 4–5 годин у холодильнику або ночі крем схопиться, торт стане щільнішим, і шматки триматимуть форму.',
        en: 'After 4–5 hours in the fridge or overnight the custard sets, the cake firms up and the slices hold their shape.',
        es: 'Después de 4–5 horas en la nevera o una noche, la crema cuaja, la tarta queda más firme y los trozos mantienen la forma.',
      },
      ingredientLineIds: [],
      displayMeta: {
        uk: '4–5 год або ніч',
        en: '4–5 h or overnight',
        es: '4–5 h o toda la noche',
      },
      durationPhaseId: 'refrigerated-maturation',
    },
  ],
  storage: null,
  makeAhead: {
    uk: 'Тісто охолоджується від 30 хвилин до 24 годин, тож його можна зробити звечора. Зібраний торт можна різати через годину, але найкраще він тримає форму після 4–5 годин у холодильнику або ночі.',
    en: 'The dough chills for 30 minutes to 24 hours, so you can make it the evening before. You can slice the assembled cake after an hour, but it holds its shape best after 4–5 hours in the fridge or overnight.',
    es: 'La masa reposa en frío de 30 minutos a 24 horas, así que puedes prepararla la víspera. La tarta montada se puede cortar al cabo de una hora, pero mantiene mejor la forma tras 4–5 horas en la nevera o una noche.',
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
      id: 'napoleon-author-portions-16-bg-v1',
      type: 'image',
      path: '/media/recipes/gluten-free-napoleon/author-2026-11-02/dough-16-portions-bg-v1.webp',
      usage: ['step'],
      fit: 'cover',
      alt: {
        uk: 'Шістнадцять частин тіста на пергаменті',
        en: 'Sixteen portions of dough on baking parchment',
        es: 'Dieciséis porciones de masa sobre papel de horno',
      },
    },
    {
      id: 'napoleon-author-baked-img2504-bg-v1',
      type: 'image',
      path: '/media/recipes/gluten-free-napoleon/author-2026-11-02/baked-layer-img2504-bg-v1.webp',
      usage: ['step'],
      fit: 'cover',
      alt: {
        uk: 'Спечений корж Наполеона з бульбашками на бежевій тарілці',
        en: 'A baked Napoleon pastry layer with blisters on a beige plate',
        es: 'Una lámina de Napoleón horneada con burbujas en un plato beige',
      },
    },
    {
      id: 'napoleon-lesson-two-trays-v1',
      type: 'image',
      path: '/media/recipes/gluten-free-napoleon/author-2026-11-02/two-trays-v1.webp',
      usage: ['step'],
      alt: {
        uk: 'Два деки з коржами в духовці одночасно',
        en: 'Two trays of layers baking in the oven at once',
        es: 'Dos bandejas con láminas horneándose a la vez',
      },
      fit: 'contain',
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
        uk: 'Частини тіста з припорошеними борошном зрізами',
        en: 'Dough portions with flour-dusted cut sides',
        es: 'Porciones de masa con los cortes enharinados',
      },
      caption: {
        uk: 'Частини тіста з припорошеними борошном зрізами',
        en: 'Dough portions with flour-dusted cut sides',
        es: 'Porciones de masa con los cortes enharinados',
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
      heroAlt: {
        en: 'Cut Napoleon cake on a plate in front of red flowers',
        es: 'Tarta Napoleón cortada en un plato ante flores rojas',
        uk: 'Розрізаний Наполеон на тарілці на тлі бордових квітів',
      },
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
    {
      id: 'gluten-free-napoleon-card',
      type: 'image',
      path: '/media/recipes/gluten-free-napoleon/card-img-2341-linen-v5.webp',
      usage: ['card'],
      alt: {
        uk: 'Цілий Наполеон із золотистою крихтою на тарілці та світлій серветці',
        en: 'Whole Napoleon cake with golden crumbs on a plate and light napkin',
        es: 'Tarta Napoleón entera con migas doradas sobre un plato y una servilleta clara',
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
      locator:
        'Final author dough formula, 14 portions, 15–30 minutes to 24 hours chilling, and 200°C fan bake for 5–7 minutes.',
    },
    {
      id: 'author-custard-2026-10-04',
      file: 'Current Codex conversation, 2026-10-04',
      locator:
        'Author photographs IMG_1735–IMG_1758 and recorded custard/assembly method; explicit ingredient clarification: 6 eggs, 400 g sugar, 16 g vanilla sugar, 40 g Schär Mix B (2 tbsp), 30 g corn or tapioca starch (2 tbsp), 2 l milk.',
      note: 'Butter retained at 100 g from prior recipe. Photo originals and MOV retained in original/2026-10-04-custard; selected photo edits and prompts in working/2026-10-04-custard. Hero and process media are edited author photos: backgrounds, plate colour, framing and light balance adjusted with built-in image_gen; food preserved.',
    },
    {
      id: 'author-lesson-shoot-2026-11-02',
      file: 'docs/claude/codex-napoleon-recipe-v6-spec.md',
      locator: 'Author video lesson, 2026-11-02/03',
      note: 'Author filmed the full video lesson 2026-11-02/03 with a full batch: 16 layers (two cakes × 8), dough on sour cream or yogurt, all flour in the butter crumb, salt added at the short mix, two short mixes with scraping the bowl between them, 30 min chilling, 200 °C for 7–8 min without fan, two trays baked at once and swapped, trimmings baked for crumb, custard with 2 sachets of vanilla sugar in the egg mixture and optional butter, walnuts and pecans toasted in a dry pan. Cake can be cut after 1 h; after 4–5 h or overnight in the fridge the cream sets and slices hold their shape.',
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
      text: {
        en: 'Bake-test the 28 cm adaptation of the current 24 cm dough before enabling Cook Mode.',
        uk: 'Випробувати адаптацію поточного тіста з 24 см на 28 см перед увімкненням покрокового режиму.',
        es: 'Probar la adaptación de la masa actual de 24 cm a 28 cm antes de activar el modo de cocina.',
      },
    },
    {
      id: 'review-translations',
      area: 'translation',
      field: 'translationState.en/es',
      question: 'Human-review the EN and ES recipe wording and SEO slugs.',
      publicationBlocking: false,
      sourceIds: ['archive-recipe'],
      text: {
        en: 'Human-review the EN and ES recipe wording and SEO slugs.',
        uk: 'Провести авторську перевірку англійського й іспанського текстів рецепта та SEO-адрес.',
        es: 'Revisar con la autora el texto inglés y español de la receta y las direcciones SEO.',
      },
    },
    {
      id: 'record-storage',
      area: 'storage',
      field: 'storage',
      question:
        'Record storage instructions beyond the 12–24 hour maturation period.',
      publicationBlocking: false,
      sourceIds: ['archive-recipe'],
      text: {
        en: 'Record storage instructions beyond the 12–24 hour maturation period.',
        uk: 'Записати умови зберігання після 12–24 годин просочування.',
        es: 'Registrar las instrucciones de conservación después de las 12–24 horas de reposo.',
      },
    },
  ],
  searchMetadata: {
    datePublished: null,
    dateModified: '2026-10-05',
    cookTimeMinutes: null,
    recipeCuisine: {
      uk: 'Українська кухня',
      en: 'Ukrainian',
      es: 'Ucraniana',
    },
    keywords: {
      uk: [
        'наполеон без глютену',
        'безглютеновий торт наполеон',
        'Schär Mix B',
        'торт без глютену',
      ],
      en: [
        'gluten-free Napoleon cake',
        'Schär Mix B',
        'gluten-free layer cake',
      ],
      es: ['tarta Napoleón sin gluten', 'Schär Mix B', 'tarta sin gluten'],
    },
  },
  evidenceExplanation: {
    en: 'This exact version was baked successfully.',
    es: 'Esta versión exacta se ha horneado correctamente.',
    uk: 'Цю версію успішно приготували.',
  },
  discovery: {
    cardTitle: {
      en: 'Napoleon Cake',
      es: 'Tarta Napoleón',
      uk: 'Наполеон',
    },
    category: {
      en: 'Celebration cake',
      es: 'Tarta de celebración',
      uk: 'Святковий торт',
    },
    flourSummary: {
      en: 'Schär Mix B',
      es: 'Schär Mix B',
      uk: 'Schär Mix B',
    },
    collectionIds: ['celebration'],
    catalogue: true,
    imageKind: 'edited-author-photo',
    cardImagePosition: 'left-quarter',
    sourceTitle: 'Безглютеновий Наполеон',
    launchPriority: 'High',
    heroCandidate: 'Yes',
    source:
      'Detailed recipe card transferred from a separate ChatGPT conversation',
    archiveSections: [],
    needsBeforePublishing: '',
    shortTitle: {
      uk: 'Безглютеновий Наполеон',
      en: 'Gluten-Free Napoleon Cake',
      es: 'Tarta Napoleón sin gluten',
    },
  },
  cardMediaId: 'gluten-free-napoleon-card',
  translationReview: {
    date: '2026-11-04',
    reviewer: 'implementation',
    scope:
      'v6 author lesson specification, aligned UK/EN/ES recipe copy; not separate author approval',
  },
  seo: {
    uk: {
      title: 'Безглютеновий Наполеон',
      description:
        'Два торти по 8 тонких коржів діаметром 24 см із заварним кремом; горіхи — за бажанням.',
    },
    en: {
      title: 'Gluten-Free Napoleon Cake',
      description:
        'Two cakes with eight thin 24 cm layers each and custard; nuts are optional.',
    },
    es: {
      title: 'Tarta Napoleón sin gluten',
      description:
        'Dos tartas de ocho láminas finas de 24 cm con crema pastelera; las nueces son opcionales.',
    },
  },
  routeSlug: 'napoleon-cake',
} satisfies Recipe;
