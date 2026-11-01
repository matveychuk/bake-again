import type { Recipe } from './recipe.types.ts';

export const easterBreadRecipe = {
  schemaVersion: 3,
  id: 'easter-bread',
  versionId: 'easter-bread-source-v1',
  publicationStatus: 'unpublished',
  translationState: {
    uk: 'reviewed',
    en: 'reviewed',
    es: 'reviewed',
  },
  slug: {
    en: 'easter-bread',
    es: 'easter-bread',
    uk: 'easter-bread',
  },
  title: {
    en: 'Gluten-free Ukrainian Easter bread',
    es: 'Pan ucraniano de Pascua sin gluten',
    uk: 'Безглютенова паска',
  },
  summary: {
    en: 'Soft Easter bread with raisins and candied fruit.',
    es: 'Pan de Pascua tierno con pasas y fruta confitada.',
    uk: 'М’яка паска з родзинками й цукатами.',
  },
  categoryIds: [],
  situationIds: [],
  difficulty: 'medium',
  baseProvenance: {
    state: 'tested',
    sourceIds: ['easter-bread-recorded-source'],
  },
  timing: {
    activeMinutes: 30,
    totalElapsedMinutes: 290,
    planningNote: {
      text: {
        en: 'Allow about 4 h 50 min, including 1½–2 h cooling before slicing. Proofing and baking times vary.',
        es: 'Calcula unas 4 h 50 min, incluidas 1½–2 h de enfriado antes de cortar. Los tiempos de levado y horneado pueden variar.',
        uk: 'Закладіть близько 4 год 50 хв, зокрема 1½–2 год на охолодження перед нарізанням. Час вистоювання й випікання може змінюватися.',
      },
    },
    phases: [
      {
        id: 'soak-fruit',
        label: {
          en: 'Soak fruit',
          es: 'Remojo de la fruta',
          uk: 'Замочування добавок',
        },
        duration: {
          kind: 'range',
          min: 5,
          max: 10,
          unit: 'minute',
        },
        relatedStepId: 'prepare-fruit',
      },
      {
        id: 'activate-yeast',
        label: {
          en: 'Activate yeast',
          es: 'Activación de la levadura',
          uk: 'Активація дріжджів',
        },
        duration: {
          kind: 'range',
          min: 10,
          max: 15,
          unit: 'minute',
        },
        relatedStepId: 'activate-yeast',
      },
      {
        id: 'mix-dough',
        label: {
          en: 'Mix dough',
          es: 'Amasado',
          uk: 'Заміс',
        },
        duration: {
          kind: 'exact',
          value: 5,
          unit: 'minute',
        },
        relatedStepId: 'mix-dough',
      },
      {
        id: 'hydrate-binders',
        label: {
          en: 'Hydrate binders',
          es: 'Reposo de la masa',
          uk: 'Відпочинок тіста',
        },
        duration: {
          kind: 'exact',
          value: 5,
          unit: 'minute',
        },
        relatedStepId: 'adjust-consistency',
      },
      {
        id: 'proof',
        label: {
          en: 'Proof',
          es: 'Levado',
          uk: 'Вистоювання',
        },
        duration: {
          kind: 'range',
          min: 45,
          max: 75,
          unit: 'minute',
        },
        relatedStepId: 'proof',
      },
      {
        id: 'bake',
        label: {
          en: 'Bake',
          es: 'Horneado',
          uk: 'Випікання',
        },
        duration: {
          kind: 'range',
          min: 35,
          max: 45,
          unit: 'minute',
        },
        relatedStepId: 'bake',
      },
      {
        id: 'stabilise',
        label: {
          en: 'Stabilise before slicing',
          es: 'Enfriado antes de cortar',
          uk: 'Стабілізація до розрізання',
        },
        duration: {
          kind: 'range',
          min: 90,
          max: 120,
          unit: 'minute',
        },
        relatedStepId: 'cool',
      },
    ],
  },
  yield: {
    default: {
      id: 'paska-batch',
      label: {
        en: '3 medium paskas',
        es: '3 paskas medianas',
        uk: '3 середні паски',
      },
      count: {
        kind: 'exact',
        value: 3,
      },
      unit: 'cake',
      provenance: {
        state: 'tested',
        sourceIds: ['easter-bread-recorded-source'],
      },
      availability: 'default',
    },
    alternatives: [],
  },
  geometry: {
    state: 'known',
    default: {
      id: 'paper-paska-moulds',
      label: {
        en: '3 medium paska moulds',
        es: '3 moldes medianos para paska',
        uk: '3 середні форми для паски',
      },
      kind: 'mould',
      application: 'bake-in',
      shape: 'round',
      diameterCm: null,
      layerCount: null,
      material: null,
      provenance: {
        state: 'tested',
        sourceIds: ['easter-bread-recorded-source'],
      },
      availability: 'default',
    },
    alternatives: [],
  },
  configuration: {
    base: {
      geometryId: 'paper-paska-moulds',
      yieldId: 'paska-batch',
      batchScale: 1,
    },
    geometryAdjustment: null,
    quantityAdjustment: {
      batchScale: {
        allowed: [0.5, 1, 1.5, 2],
      },
      useWhatIHave: {
        scalingAnchors: [
          {
            ingredientLineId: 'schar-mix-b',
            allowedUnit: 'g',
          },
        ],
      },
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
    {
      id: 'foil',
      name: {
        en: 'foil',
        es: 'papel de aluminio',
        uk: 'фольга',
      },
    },
  ],
  flourConfiguration: {
    commercialMixLineId: 'schar-mix-b',
    additionalStarchLineIds: ['tapioca-starch'],
    xanthanLineId: 'xanthan',
    provenance: {
      state: 'tested',
      sourceIds: ['easter-bread-recorded-source'],
    },
    testedAlternativeMixes: [],
    knownUnsupportedMixes: [],
    basis: 'commercialMix',
  },
  beforeStart: [],
  ingredientSections: [
    {
      id: 'dry',
      title: {
        en: 'Dry ingredients',
        es: 'Ingredientes secos',
        uk: 'Сухі інгредієнти',
      },
      lines: [
        {
          id: 'schar-mix-b',
          options: [
            {
              ingredientId: 'schar-mix-b',
              name: {
                en: 'Schär Bread Mix',
                es: 'Schär Bread Mix',
                uk: 'Schär Bread Mix',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 450,
              unit: 'g',
            },
            equivalent: {
              kind: 'exact',
              value: 22.5,
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
              value: 50,
              unit: 'g',
            },
            equivalent: {
              kind: 'exact',
              value: 3.3333,
              unit: 'tbsp',
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
                en: 'Sugar',
                es: 'Azúcar',
                uk: 'Цукор',
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
              value: 5,
              unit: 'tbsp',
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
              value: 3,
              unit: 'g',
            },
            equivalent: {
              kind: 'exact',
              value: 0.5,
              unit: 'tsp',
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
          id: 'psyllium',
          options: [
            {
              ingredientId: 'psyllium',
              name: {
                en: 'Psyllium powder',
                es: 'Psyllium en polvo',
                uk: 'Псиліум-порошок',
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
          qualifier: {
            en: 'Level spoonful',
            es: 'Cucharada rasa',
            uk: 'Без гірки',
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
                uk: 'Ксантан',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 3,
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
          qualifier: {
            en: 'Level spoonful',
            es: 'Cucharada rasa',
            uk: 'Без гірки',
          },
        },
      ],
    },
    {
      id: 'liquid',
      title: {
        en: 'Liquid ingredients',
        es: 'Ingredientes líquidos',
        uk: 'Рідкі інгредієнти',
      },
      lines: [
        {
          id: 'milk',
          options: [
            {
              ingredientId: 'milk',
              name: {
                en: 'Milk',
                es: 'Leche',
                uk: 'Молоко',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'range',
              min: 330,
              max: 360,
              unit: 'ml',
            },
            shopping: {
              mode: 'base',
            },
          },
          qualifier: {
            en: 'Start with 330 ml; keep 20–30 ml warm for adjustment',
            es: 'Empieza con 330 ml y reserva 20–30 ml templados para ajustar la masa',
            uk: 'Почати з 330 мл; 20–30 мл залишити теплими для коригування',
          },
        },
        {
          id: 'fresh-yeast',
          options: [
            {
              ingredientId: 'fresh-yeast',
              name: {
                en: 'Fresh yeast',
                es: 'Levadura fresca',
                uk: 'Свіжі дріжджі',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'range',
              min: 24,
              max: 25,
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
                en: 'Eggs',
                es: 'Huevos',
                uk: 'Яйця',
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
          id: 'yolks',
          options: [
            {
              ingredientId: 'yolks',
              name: {
                en: 'Egg yolks',
                es: 'Yemas',
                uk: 'Жовтки',
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
          id: 'neutral-oil',
          options: [
            {
              ingredientId: 'neutral-oil',
              name: {
                en: 'Neutral-flavoured oil',
                es: 'Aceite de sabor neutro',
                uk: 'Олія без запаху',
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
              value: 40,
              unit: 'g',
            },
            shopping: {
              mode: 'base',
            },
          },
          qualifier: {
            en: 'Melted and slightly cooled',
            es: 'Derretida y ligeramente enfriada',
            uk: 'Розтопити й трохи охолодити',
          },
        },
        {
          id: 'vanilla',
          options: [
            {
              ingredientId: 'vanilla',
              name: {
                en: 'Vanilla extract',
                es: 'Extracto de vainilla',
                uk: 'Ванільний екстракт',
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
          id: 'cognac',
          options: [
            {
              ingredientId: 'cognac',
              name: {
                en: 'Cognac',
                es: 'Coñac',
                uk: 'Коньяк',
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
      ],
    },
    {
      id: 'additions',
      title: {
        en: 'Additions',
        es: 'Fruta',
        uk: 'Добавки',
      },
      lines: [
        {
          id: 'raisins',
          options: [
            {
              ingredientId: 'raisins',
              name: {
                en: 'Raisins',
                es: 'Pasas',
                uk: 'Родзинки',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'range',
              min: 220,
              max: 250,
              unit: 'g',
            },
            shopping: {
              mode: 'base',
            },
          },
        },
        {
          id: 'candied-fruit',
          options: [
            {
              ingredientId: 'candied-fruit',
              name: {
                en: 'Candied fruit',
                es: 'Fruta confitada',
                uk: 'Цукати',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'range',
              min: 60,
              max: 80,
              unit: 'g',
            },
            shopping: {
              mode: 'base',
            },
          },
          qualifier: {
            en: 'Finely chopped',
            es: 'Picada fina',
            uk: 'Дрібно нарізати',
          },
        },
      ],
    },
    {
      id: 'topping',
      title: {
        en: 'For the top',
        es: 'Para pincelar',
        uk: 'Для верху',
      },
      lines: [
        {
          id: 'topping-yolk',
          options: [
            {
              ingredientId: 'topping-yolk',
              name: {
                en: 'Egg yolk',
                es: 'Yema',
                uk: 'Жовток',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 1,
              unit: 'piece',
            },
            shopping: {
              mode: 'base',
            },
          },
        },
        {
          id: 'topping-milk',
          options: [
            {
              ingredientId: 'topping-milk',
              name: {
                en: 'Milk',
                es: 'Leche',
                uk: 'Молоко',
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
      ],
    },
  ],
  steps: [
    {
      id: 'prepare-fruit',
      title: {
        en: 'Prepare the fruit',
        es: 'Prepara las pasas y la fruta confitada',
        uk: 'Підготуйте родзинки й цукати',
      },
      instruction: {
        en: 'Soak the raisins in hot water for 5–10 minutes, drain and dry thoroughly. Finely chop the candied fruit; briefly soak and dry it too if needed.',
        es: 'Cubre las pasas con agua caliente durante 5–10 minutos. Escurre y seca bien. Pica la fruta confitada; si está seca, remójala brevemente y sécala también.',
        uk: 'Залийте родзинки гарячою водою на 5–10 хвилин, злийте воду й ретельно обсушіть. Цукати дрібно наріжте; якщо вони сухі, також ненадовго замочіть і обсушіть.',
      },
      ingredientLineIds: [],
      guidance: [],
      durationPhaseId: 'soak-fruit',
    },
    {
      id: 'activate-yeast',
      title: {
        en: 'Activate the yeast',
        es: 'Activa la levadura',
        uk: 'Активуйте дріжджі',
      },
      instruction: {
        en: 'Mix 100 ml of warm, not hot, milk with the yeast and a teaspoon of the measured sugar. Leave for 10–15 minutes while preparing the dough mixtures.',
        es: 'Mezcla 100 ml de leche templada, no caliente, con la levadura y una cucharadita del azúcar de la receta. Deja reposar 10–15 minutos mientras preparas los demás ingredientes.',
        uk: 'Змішайте 100 мл теплого, не гарячого молока з дріжджами й чайною ложкою цукру із загальної кількості. Залиште на 10–15 хвилин. Тим часом підготуйте суміші для тіста.',
      },
      ingredientLineIds: [],
      guidance: [
        {
          id: 'activate-yeast-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'Look for a foam cap. If none appears after another 5 minutes, replace the yeast.',
            es: 'Debe formarse espuma. Si tras 5 minutos más sigue sin aparecer, cambia la levadura.',
            uk: 'Має з’явитися пінка. Якщо її немає ще через 5 хвилин, замініть дріжджі.',
          },
        },
      ],
      mediaIds: ['active-yeast'],
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
        en: 'Combine all dry ingredients and the remaining sugar in the mixer bowl. Separately combine the rest of the initial 330 ml milk, room-temperature eggs, yolks, oil, melted and cooled butter, vanilla, cognac and activated yeast. Pour into the dry mixture. Mix with a dough hook for 1 minute on low, scrape down the bowl, then mix for 4 minutes on low or medium-low.',
        es: 'Mezcla los ingredientes secos y el azúcar restante en el bol del robot. Aparte, une el resto de los 330 ml iniciales de leche, los huevos a temperatura ambiente, las yemas, el aceite, la mantequilla derretida y templada, la vainilla, el coñac y la mezcla de levadura. Vierte sobre los ingredientes secos. Amasa con el gancho 1 minuto a velocidad baja, recoge la masa de las paredes y continúa 4 minutos a velocidad baja o media-baja.',
        uk: 'У чаші змішайте всі сухі інгредієнти та решту цукру. Окремо з’єднайте решту початкових 330 мл молока, яйця кімнатної температури, жовтки, олію, розтоплене й охолоджене масло, ваніль, коньяк і активовані дріжджі. Влийте до сухої суміші. Місіть гачком 1 хвилину на низькій швидкості, зніміть залишки зі стінок і місіть ще 4 хвилини на низькій або середньо-низькій.',
      },
      ingredientLineIds: [],
      guidance: [],
      mediaIds: ['soft-dough'],
      equipmentIds: ['bowl', 'mixer'],
      durationPhaseId: 'mix-dough',
    },
    {
      id: 'adjust-consistency',
      title: {
        en: 'Check the consistency',
        es: 'Comprueba la consistencia',
        uk: 'Перевірте густоту',
      },
      instruction: {
        en: 'Rest the dough for 5 minutes. If dense, gradually mix in the reserved warm milk, checking the consistency after each addition.',
        es: 'Deja reposar la masa 5 minutos. Si está densa, añade poco a poco la leche templada reservada y comprueba la consistencia cada vez.',
        uk: 'Залиште тісто на 5 хвилин. Якщо воно щільне, поступово вмішуйте залишене тепле молоко, перевіряючи густоту після кожного додавання.',
      },
      ingredientLineIds: [],
      guidance: [
        {
          id: 'adjust-consistency-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The dough is sticky and falls in a broad, heavy ribbon. A groove closes slowly; it will not form a smooth ball.',
            es: 'La masa es pegajosa y cae de la espátula formando una cinta ancha y pesada. Un surco se cierra lentamente; no debe formar una bola lisa.',
            uk: 'Тісто липке й спадає з лопатки широкою важкою стрічкою. Борозна повільно закривається; гладкої кульки не буде.',
          },
        },
      ],
      mediaIds: ['ribbon-consistency'],
      durationPhaseId: 'hydrate-binders',
    },
    {
      id: 'add-fruit',
      title: {
        en: 'Fold in the fruit',
        es: 'Incorpora la fruta',
        uk: 'Вмішайте добавки',
      },
      instruction: {
        en: 'Fold in the dried raisins and candied fruit with a spatula, or mix for 20–30 seconds on the lowest speed.',
        es: 'Añade las pasas secas y la fruta confitada. Incorpora con una espátula o mezcla 20–30 segundos a la velocidad más baja.',
        uk: 'Додайте обсушені родзинки й цукати. Вмішуйте лопаткою або 20–30 секунд на найнижчій швидкості.',
      },
      ingredientLineIds: [],
      guidance: [],
      mediaIds: ['fruit-folded'],
      equipmentIds: ['spatula'],
    },
    {
      id: 'fill-moulds',
      title: {
        en: 'Fill the moulds',
        es: 'Llena los moldes',
        uk: 'Наповніть форми',
      },
      instruction: {
        en: 'Divide the dough between three medium moulds, filling each one-third to 40% full. Level with a wet spatula and tuck exposed raisins under the dough to prevent burning.',
        es: 'Reparte la masa entre tres moldes medianos, llenándolos entre un tercio y el 40 % de su altura. Alisa con una espátula mojada y hunde las pasas que sobresalgan para que no se quemen.',
        uk: 'Розділіть тісто між трьома середніми формами, заповнюючи їх на третину — до 40% висоти. Розрівняйте мокрою лопаткою, а родзинки на поверхні сховайте під тісто, щоб не підгоріли.',
      },
      ingredientLineIds: [],
      guidance: [],
      equipmentIds: ['spatula'],
    },
    {
      id: 'proof',
      title: {
        en: 'Let the dough rise',
        es: 'Deja que la masa suba',
        uk: 'Дайте тісту піднятися',
      },
      instruction: {
        en: 'Leave the moulds for 45–75 minutes in a switched-off oven at 26–29°C. A cup of hot water alongside can provide humidity.',
        es: 'Deja los moldes durante 45–75 minutos en el horno apagado, ligeramente templado, a 26–29°C. Puedes poner al lado una taza de agua caliente para aportar humedad.',
        uk: 'Залиште форми на 45–75 хвилин у ледь теплій вимкненій духовці за 26–29°C. Для вологості можна поставити поруч чашку гарячої води.',
      },
      ingredientLineIds: [],
      guidance: [
        {
          id: 'proof-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The dough should look airy and rise close to the rim. Do not overproof: it may collapse.',
            es: 'La masa debe quedar esponjosa y acercarse al borde del molde. No prolongues demasiado el levado: podría hundirse.',
            uk: 'Тісто має стати пухким і наблизитися до верху форми. Не перетримуйте: надмірно вистояне тісто може осісти.',
          },
        },
      ],
      mediaIds: ['proofed-paskas'],
      durationPhaseId: 'proof',
      temperature: {
        range: {
          min: 26,
          max: 29,
        },
        unit: 'C',
        ovenMode: null,
      },
    },
    {
      id: 'bake',
      title: {
        en: 'Bake the paskas',
        es: 'Hornea las paskas',
        uk: 'Випечіть паски',
      },
      instruction: {
        en: 'Move the moulds to a warm, draught-free spot and heat the oven to 175°C. Mix the topping yolk and milk, then brush gently without pressing. Bake for approximately 35–45 minutes. Keep the oven closed for the first 25 minutes; after that, loosely cover with foil if the tops are already golden.',
        es: 'Lleva los moldes a un lugar templado y sin corrientes mientras precalientas el horno a 175°C. Mezcla la yema y la leche para pincelar y aplícalas suavemente, sin presionar. Hornea unos 35–45 minutos. No abras el horno durante los primeros 25 minutos; después, si la superficie ya está dorada, cúbrela con aluminio sin apretar.',
        uk: 'Переставте форми в тепле місце без протягу й розігрійте духовку до 175°C. Змішайте жовток і молоко для верху, легко змастіть паски, не натискаючи пензликом. Випікайте приблизно 35–45 хвилин. Перші 25 хвилин духовку не відкривайте; потім, якщо верх уже золотистий, нещільно накрийте фольгою.',
      },
      ingredientLineIds: [],
      guidance: [
        {
          id: 'bake-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'A skewer should show no raw dough and the centre should not wobble. If using a thermometer, aim for 94–96°C in the centre. Timing depends on mould size.',
            es: 'La brocheta sale sin masa cruda y el centro no tiembla. Si usas un termómetro, debe marcar 94–96°C en el centro. El tiempo depende del tamaño del molde.',
            uk: 'Шпажка виходить без сирого тіста, центр не тремтить. За наявності термометра — 94–96°C у центрі. Час залежить від розміру форми.',
          },
        },
      ],
      mediaIds: ['baked-paskas'],
      equipmentIds: ['foil'],
      temperature: {
        value: 175,
        unit: 'C',
        ovenMode: null,
      },
      durationPhaseId: 'bake',
    },
    {
      id: 'cool',
      title: {
        en: 'Cool before slicing',
        es: 'Deja enfriar antes de cortar',
        uk: 'Остудіть перед нарізанням',
      },
      instruction: {
        en: 'Leave in the switched-off oven with the door ajar for 10–15 minutes. Remove, keep in the moulds for another 10–15 minutes, then let cool completely. Allow 1½–2 hours in total after baking before slicing: warm crumb compresses easily.',
        es: 'Deja las paskas 10–15 minutos en el horno apagado con la puerta entreabierta. Sácalas, espera otros 10–15 minutos antes de desmoldar y deja enfriar por completo. Espera en total 1½–2 horas desde que termina el horneado antes de cortar: la miga caliente se aplasta fácilmente.',
        uk: 'Залиште паски у вимкненій духовці з прочиненими дверцятами на 10–15 хвилин. Дістаньте, потримайте у формах ще 10–15 хвилин і дайте повністю охолонути. Загалом до нарізання зачекайте 1½–2 години після випікання: теплий м’якуш легко зминається.',
      },
      ingredientLineIds: [],
      guidance: [],
      mediaIds: ['cooled-crumb'],
      durationPhaseId: 'stabilise',
    },
  ],
  storage: null,
  makeAhead: null,
  variations: [],
  heroMediaId: 'easter-bread-hero',
  media: [
    {
      id: 'easter-bread-hero',
      type: 'image',
      path: '/images/recipes/easter-bread-card-v1.webp',
      usage: ['hero'],
      alt: {
        en: 'Tall gluten-free Ukrainian Easter bread with glaze and raisins',
        es: 'Pan ucraniano de Pascua sin gluten con glaseado y pasas',
        uk: 'Висока безглютенова паска з глазур’ю та родзинками',
      },
    },
    {
      id: 'active-yeast',
      type: 'image',
      path: '/media/recipes/easter-bread/selected/step-02-active-yeast-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Fresh yeast activated in warm milk with a creamy cap of small bubbles',
        es: 'Levadura fresca activada en leche templada, con una capa cremosa de pequeñas burbujas',
        uk: 'Свіжі дріжджі, активовані в теплому молоці, з кремовим шаром дрібних бульбашок',
      },
    },
    {
      id: 'soft-dough',
      type: 'image',
      path: '/media/recipes/easter-bread/selected/step-05-soft-dough-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Very soft sticky pale-golden paska dough lifted from a mixing bowl with a silicone spatula',
        es: 'Masa de paska muy blanda y pegajosa, de color dorado claro, levantada con una espátula sobre el bol',
        uk: 'Дуже м’яке липке світло-золотисте тісто для паски, підняте силіконовою лопаткою над чашею',
      },
    },
    {
      id: 'ribbon-consistency',
      type: 'image',
      path: '/media/recipes/easter-bread/selected/step-06-ribbon-consistency-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Hydrated paska dough falling from a spatula in a broad heavy ribbon above the bowl',
        es: 'Masa de paska reposada que cae de una espátula en una cinta ancha y pesada',
        uk: 'Тісто для паски після відпочинку спадає з лопатки широкою важкою стрічкою над чашею',
      },
    },
    {
      id: 'fruit-folded',
      type: 'image',
      path: '/media/recipes/easter-bread/selected/step-07-fruit-folded-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Soft paska dough with raisins and small amber candied-fruit pieces evenly folded through it',
        es: 'Masa blanda de paska con pasas y pequeños trozos de fruta confitada bien repartidos',
        uk: 'М’яке тісто для паски з рівномірно вмішаними родзинками й невеликими бурштиновими шматочками цукатів',
      },
    },
    {
      id: 'proofed-paskas',
      type: 'image',
      path: '/media/recipes/easter-bread/selected/step-09-proofed-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Two small paper paska moulds with pale airy dough risen close to their rims',
        es: 'Dos moldes pequeños de papel para paska con masa esponjosa que ha subido casi hasta el borde',
        uk: 'Дві невеликі паперові форми для паски зі світлим пухким тістом, що піднялося майже до країв',
      },
    },
    {
      id: 'baked-paskas',
      type: 'image',
      path: '/media/recipes/easter-bread/selected/step-11-baked-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Two small baked paskas with evenly golden domed tops in paper moulds and a clean wooden skewer beside them',
        es: 'Dos paskas pequeñas con la superficie dorada en moldes de papel y una brocheta limpia al lado',
        uk: 'Дві невеликі спечені паски з рівномірно золотистими верхівками в паперових формах і чистою дерев’яною шпажкою поруч',
      },
    },
    {
      id: 'cooled-crumb',
      type: 'image',
      path: '/media/recipes/easter-bread/selected/step-12-cooled-crumb-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Fully cooled paska with one slice showing a soft airy crumb, raisins and restrained candied fruit',
        es: 'Paska fría con una rebanada que muestra la miga esponjosa, pasas y fruta confitada',
        uk: 'Повністю остигла паска зі скибкою, на якій видно м’який пухкий м’якуш, родзинки й трохи цукатів',
      },
    },
  ],
  relatedRecipeIds: [],
  sources: [
    {
      id: 'easter-bread-recorded-source',
      file: 'Author-provided recipe text',
      locator: 'Паска 2.0 — авторська перевірена версія',
    },
  ],
  contentGaps: [],
  presentation: 'concise',
  evidenceExplanation: {
    en: 'This exact version was baked successfully.',
    es: 'Esta versión se ha horneado con éxito.',
    uk: 'Цю версію успішно випікали.',
  },
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
      uk: ['Безглютенова паска'],
      en: ['Gluten-free Ukrainian Easter bread'],
      es: ['Pan ucraniano de Pascua sin gluten'],
    },
  },
  discovery: {
    cardTitle: {
      en: 'Ukrainian Easter bread',
      es: 'Pan ucraniano de Pascua',
      uk: 'Паска',
    },
    category: {
      en: 'Seasonal baking',
      es: 'Repostería de temporada',
      uk: 'Сезонна випічка',
    },
    flourSummary: {
      en: 'Schär Bread Mix + tapioca starch',
      es: 'Schär Bread Mix + almidón de tapioca',
      uk: 'Schär Bread Mix + тапіоковий крохмаль',
    },
    collectionIds: ['celebration'],
    catalogue: true,
    imageKind: 'generated-preview',
    sourceTitle: 'Безглютенова паска',
    launchPriority: 'High · seasonal',
    heroCandidate: 'No',
    source: 'Author-provided Paska 2.0 recipe and method',
    archiveSections: [
      {
        title: 'Recipe version',
        content:
          'Паска 2.0 — м’якша, вологіша, ближча до panettone. На 2 невеликі паски або 1 середню.',
      },
    ],
    needsBeforePublishing: '',
  },
  translationReview: {
    date: '2026-11-01',
    reviewer: 'implementation',
    scope:
      'ID-aligned transfer and semantic comparison of existing UK/EN/ES recipe text; not separate author approval',
  },
  routeSlug: 'easter-bread',
} satisfies Recipe;
