import type { Recipe } from './recipe.types.ts';

export const fruitSpongeRollRecipe = {
  schemaVersion: 3,
  id: 'fruit-sponge-roll',
  versionId: 'fruit-sponge-roll-source-v1',
  publicationStatus: 'published',
  translationState: {
    uk: 'reviewed',
    en: 'reviewed',
    es: 'reviewed',
  },
  slug: {
    en: 'fruit-sponge-roll',
    es: 'fruit-sponge-roll',
    uk: 'fruit-sponge-roll',
  },
  title: {
    en: 'Gluten-free fruit sponge roll',
    es: 'Brazo de gitano de frutas sin gluten',
    uk: 'Безглютеновий бісквітний рулет із фруктами',
  },
  summary: {
    en: 'A tender sponge with berry jam and cream, finished with cream and optional fresh fruit.',
    es: 'Bizcocho tierno con mermelada de frutos rojos y crema, cubierto de crema y fruta fresca al gusto.',
    uk: 'Ніжний бісквіт із ягідним варенням і кремом; зверху — крем і фрукти за бажанням.',
  },
  categoryIds: [],
  situationIds: [],
  difficulty: 'easy',
  baseProvenance: {
    state: 'tested',
    sourceIds: ['fruit-sponge-roll-recorded-source'],
  },
  timing: {
    activeMinutes: 30,
    totalElapsedMinutes: null,
    planningNote: {
      phaseId: 'baking',
      text: {
        en: 'Plus {duration} baking and complete cooling before filling.',
        es: 'Además: {duration} de horno y enfriado completo antes de rellenar.',
        uk: 'Додатково: {duration} випікання й повне охолодження перед начиненням.',
      },
    },
    phases: [
      {
        id: 'whipping',
        label: {
          en: 'Whipping',
          es: 'Batido',
          uk: 'Збивання',
        },
        duration: {
          kind: 'exact',
          value: 10,
          unit: 'minute',
        },
        relatedStepId: 'whip-eggs',
      },
      {
        id: 'baking',
        label: {
          en: 'Baking',
          es: 'Horneado',
          uk: 'Випікання',
        },
        duration: {
          kind: 'range',
          min: 15,
          max: 20,
          unit: 'minute',
        },
        relatedStepId: 'bake-roll',
      },
      {
        id: 'chill-filled-roll',
        relatedStepId: 'fill',
        duration: {
          kind: 'exact',
          value: 2,
          unit: 'hour',
        },
        label: {
          en: 'Chill before serving',
          es: 'Enfriar antes de servir',
          uk: 'Охолодження перед подачею',
        },
      },
    ],
  },
  yield: {
    default: {
      id: 'one-roll',
      label: {
        en: '1 roll',
        es: '1 brazo de gitano',
        uk: '1 рулет',
      },
      count: {
        kind: 'exact',
        value: 1,
      },
      unit: 'batch',
      provenance: {
        state: 'tested',
        sourceIds: ['fruit-sponge-roll-recorded-source'],
      },
      availability: 'default',
    },
    alternatives: [],
  },
  geometry: {
    state: 'known',
    default: {
      id: 'fruit-sponge-roll-base',
      label: {
        en: 'Rimmed baking tray',
        es: 'Bandeja de horno con borde',
        uk: 'Деко з бортиками',
      },
      shape: 'rectangular',
      kind: 'tray',
      application: 'portion-on',
      diameterCm: null,
      layerCount: null,
      material: null,
      availability: 'default',
      provenance: {
        state: 'tested',
        sourceIds: ['fruit-sponge-roll-recorded-source'],
      },
    },
    alternatives: [],
  },
  configuration: {
    base: {
      geometryId: 'fruit-sponge-roll-base',
      yieldId: 'one-roll',
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
            ingredientLineId: 'flour',
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
      id: 'parchment',
      name: {
        en: 'baking parchment',
        es: 'papel de horno',
        uk: 'пергамент',
      },
    },
  ],
  flourConfiguration: {
    commercialMixLineId: 'flour',
    additionalStarchLineIds: [],
    provenance: {
      state: 'tested',
      sourceIds: ['fruit-sponge-roll-recorded-source'],
    },
    testedAlternativeMixes: [],
    knownUnsupportedMixes: [],
    basis: 'commercialMix',
  },
  beforeStart: [
    {
      id: 'before-0',
      text: {
        en: 'Cool the sponge rolled with its parchment. Fill only when completely cold.',
        es: 'Deja enfriar el bizcocho enrollado con su papel. Rellénalo solo cuando esté completamente frío.',
        uk: 'Охолоджуйте бісквіт згорнутим разом із пергаментом. Начиняйте лише повністю холодним.',
      },
    },
    {
      id: 'before-1',
      text: {
        en: 'Choose thick blueberry or raspberry jam and a cream. As soon as the cream is whipped, reserve a few spoonfuls for the top.',
        es: 'Elige mermelada espesa de arándano o frambuesa y una crema. En cuanto esté batida, reserva unas cucharadas para decorar.',
        uk: 'Оберіть густе чорничне або малинове варення й крем. Одразу після збивання відкладіть кілька ложок крему для оздоблення.',
      },
    },
  ],
  ingredientSections: [
    {
      id: 'sponge',
      title: {
        en: 'Sponge',
        es: 'Bizcocho',
        uk: 'Бісквіт',
      },
      lines: [
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
              value: 5,
              unit: 'piece',
            },
            shopping: {
              mode: 'base',
              increment: 1,
              rounding: 'up',
            },
          },
        },
        {
          id: 'sugar-sponge',
          options: [
            {
              ingredientId: 'sugar-sponge',
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
          id: 'oil',
          options: [
            {
              ingredientId: 'oil',
              name: {
                en: 'Neutral oil',
                es: 'Aceite neutro',
                uk: 'Нейтральна олія',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 35,
              unit: 'ml',
            },
            shopping: {
              mode: 'base',
            },
          },
        },
        {
          id: 'water',
          options: [
            {
              ingredientId: 'water',
              name: {
                en: 'Water',
                es: 'Agua',
                uk: 'Вода',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 35,
              unit: 'ml',
            },
            shopping: {
              mode: 'base',
              defaultSelected: false,
            },
          },
        },
        {
          id: 'flour',
          options: [
            {
              ingredientId: 'flour',
              name: {
                en: 'Schär Mix B Bread flour',
                es: 'Harina Schär Mix B Bread',
                uk: 'Борошно Schär Mix B Bread',
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
      ],
    },
    {
      id: 'filling',
      title: {
        en: 'Filling and decoration',
        es: 'Relleno y decoración',
        uk: 'Начинка й оздоблення',
      },
      lines: [
        {
          id: 'jam',
          options: [
            {
              ingredientId: 'jam',
              name: {
                en: 'Thick berry jam',
                es: 'Mermelada espesa de frutos rojos',
                uk: 'Густе ягідне варення',
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
            en: 'Blueberry or raspberry jam works well.',
            es: 'Queda bien con mermelada de arándanos o frambuesa.',
            uk: 'Добре підходить чорничне або малинове.',
          },
        },
        {
          id: 'fresh-fruit',
          options: [
            {
              ingredientId: 'fresh-fruit',
              name: {
                en: 'Fresh fruit or berries',
                es: 'Fruta fresca o frutos rojos',
                uk: 'Свіжі фрукти або ягоди',
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
          qualifier: {
            en: 'For the filling and decoration; wash and dry thoroughly.',
            es: 'Para el relleno y la decoración; lavar y secar bien.',
            uk: 'Для начинки й оздоблення; добре вимити та обсушити.',
          },
        },
        {
          id: 'nuts',
          options: [
            {
              ingredientId: 'nuts',
              name: {
                en: 'Chopped nuts',
                es: 'Frutos secos picados',
                uk: 'Подрібнені горіхи',
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
          qualifier: {
            en: 'For the top, instead of or together with fresh fruit.',
            es: 'Para la parte superior, en lugar de la fruta fresca o junto con ella.',
            uk: 'Для верху — замість свіжих фруктів або разом із ними.',
          },
        },
      ],
    },
  ],
  steps: [
    {
      id: 'whip-eggs',
      title: {
        en: 'Whip to ribbon stage',
        es: 'Bate hasta el punto de cinta',
        uk: 'Збийте до стрічки',
      },
      instruction: {
        en: 'Whip the eggs with the sugar and salt for about 10 minutes.',
        es: 'Bate los huevos con el azúcar y la sal durante unos 10 minutos.',
        uk: 'Збивайте яйця з цукром і сіллю приблизно 10 хвилин.',
      },
      ingredientLineIds: ['eggs', 'sugar-sponge', 'salt'],
      guidance: [
        {
          id: 'whip-eggs-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The mixture is pale and thick, and falls from the whisk in a broad ribbon that remains visible briefly.',
            es: 'La mezcla está pálida y espesa y cae de las varillas en una cinta ancha que permanece visible unos instantes.',
            uk: 'Маса світла й густа, а слід від вінчика спадає широкою стрічкою та кілька секунд тримається на поверхні.',
          },
        },
      ],
      displayMeta: {
        en: 'About 10 min',
        es: 'Unos 10 min',
        uk: 'Приблизно 10 хв',
      },
      cook: {
        ingredients: [
          {
            ingredientId: 'eggs',
          },
          {
            ingredientId: 'sugar-sponge',
          },
          {
            ingredientId: 'salt',
          },
        ],
      },
      mediaIds: ['fruit-roll-egg-foam-v1'],
      durationPhaseId: 'whipping',
    },
    {
      id: 'fold-batter',
      title: {
        en: 'Fold the batter',
        es: 'Integra la masa',
        uk: 'Змішайте тісто',
      },
      instruction: {
        en: 'Fold in the oil, then the water. Add the flour gradually and fold gently just until no dry pockets remain.',
        es: 'Incorpora con movimientos envolventes el aceite y después el agua. Añade la harina poco a poco y mezcla con suavidad solo hasta que no queden zonas secas.',
        uk: 'Обережно вмішайте олію, потім воду. Поступово додайте борошно й складайте лопаткою лише доки не зникнуть сухі ділянки.',
      },
      ingredientLineIds: ['oil', 'water', 'flour'],
      guidance: [],
      cook: {
        ingredients: [
          {
            ingredientId: 'oil',
          },
          {
            ingredientId: 'water',
          },
          {
            ingredientId: 'flour',
          },
        ],
      },
    },
    {
      id: 'bake-roll',
      title: {
        en: 'Bake the sponge',
        es: 'Hornea el bizcocho',
        uk: 'Спечіть бісквіт',
      },
      instruction: {
        en: 'Preheat the oven to 180–200°C. Line a rimmed baking tray with parchment and spread the batter into a thin, even rectangle. Bake for 15–20 minutes.',
        es: 'Precalienta el horno a 180–200°C. Forra una bandeja con borde con papel de horno y extiende la masa en un rectángulo fino y uniforme. Hornea durante 15–20 minutos.',
        uk: 'Розігрійте духовку до 180–200°C. Застеліть пергаментом деко з бортиками й розподіліть тісто тонким рівним прямокутником. Випікайте 15–20 хвилин.',
      },
      ingredientLineIds: [],
      guidance: [
        {
          id: 'bake-roll-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The sponge is lightly golden, springs back when touched and remains flexible enough to roll.',
            es: 'El bizcocho está ligeramente dorado, recupera la forma al tocarlo y sigue flexible para enrollarlo.',
            uk: 'Бісквіт злегка золотистий, пружинить після дотику й залишається достатньо гнучким для згортання.',
          },
        },
      ],
      displayMeta: {
        en: '180–200°C · 15–20 min',
        es: '180–200°C · 15–20 min',
        uk: '180–200°C · 15–20 хв',
      },
      mediaIds: ['fruit-roll-batter-tray-v1'],
      equipmentIds: ['parchment'],
      durationPhaseId: 'baking',
      temperature: {
        range: {
          min: 180,
          max: 200,
        },
        unit: 'C',
        ovenMode: null,
      },
    },
    {
      id: 'roll-and-cool',
      title: {
        en: 'Roll with the parchment',
        es: 'Enrolla con el papel',
        uk: 'Згорніть разом із пергаментом',
      },
      instruction: {
        en: 'While still warm, loosely roll the sponge together with the parchment it was baked on. Do not peel the paper away: it stays between the turns. Leave the sponge rolled until completely cool.',
        es: 'Con el bizcocho aún caliente, enróllalo sin apretar junto con el papel en el que se ha horneado. No retires el papel: debe quedar entre las vueltas. Déjalo enrollado hasta que se enfríe por completo.',
        uk: 'Ще теплий бісквіт нещільно згорніть разом із пергаментом, на якому він випікався. Не відділяйте папір: він має залишитися між витками. Залиште рулет згорнутим до повного охолодження.',
      },
      ingredientLineIds: [],
      guidance: [],
      mediaIds: ['fruit-roll-warm-roll-v3'],
      equipmentIds: ['parchment'],
    },
    {
      id: 'spread-jam',
      title: {
        en: 'Unroll and spread the jam',
        es: 'Abre y unta la mermelada',
        uk: 'Розгорніть і намастіть варенням',
      },
      instruction: {
        en: 'Set aside a few spoonfuls of the freshly whipped cream for the top. Gently unroll the completely cooled sponge. Then carefully peel the parchment away from the sponge, leaving the sponge resting on the same paper. Spread a thin layer of thick berry jam.',
        es: 'Reserva unas cucharadas de la crema recién batida para decorar. Desenrolla con cuidado el bizcocho completamente frío. Después desprende suavemente el papel del bizcocho y deja el bizcocho apoyado sobre ese mismo papel. Unta una capa fina de mermelada espesa.',
        uk: 'Відкладіть кілька ложок щойно збитого крему для оздоблення. Обережно розгорніть повністю охолоджений бісквіт. Потім обережно відділіть від нього пергамент і залиште бісквіт лежати на тому ж папері. Намастіть тонким шаром густого ягідного варення.',
      },
      ingredientLineIds: ['jam'],
      guidance: [
        {
          id: 'spread-jam-tip',
          kind: 'practicalTip',
          text: {
            en: 'Do not press the sponge flat: let the edge keep its inward curve to avoid cracking.',
            es: 'No fuerces el bizcocho para dejarlo plano: conserva la curva del extremo hacia dentro para evitar que se agriete.',
            uk: 'Не намагайтеся розпрямити бісквіт повністю: збережіть природний загин краю всередину, щоб він не тріснув.',
          },
        },
      ],
      cook: {
        requiresCream: true,
        ingredients: [
          {
            ingredientId: 'jam',
          },
        ],
      },
      mediaIds: ['fruit-roll-blueberry-jam-v4'],
      equipmentIds: ['parchment'],
    },
    {
      id: 'spread-cream',
      title: {
        en: 'Spread the cream',
        es: 'Extiende la crema',
        uk: 'Нанесіть крем',
      },
      instruction: {
        en: 'Gently spread the remaining cream over the jam. Leave about 2 cm without cream along the edge that will close the roll. Add fresh fruit or berries if you like.',
        es: 'Extiende con suavidad el resto de la crema sobre la mermelada. Deja unos 2 cm sin crema en el borde que cerrará el rollo. Si quieres, añade fruta fresca o frutos rojos.',
        uk: 'Обережно розподіліть решту крему поверх варення. Уздовж краю, який закриватиме рулет, залиште приблизно 2 см без крему. За бажанням додайте свіжі фрукти чи ягоди.',
      },
      ingredientLineIds: ['fresh-fruit'],
      guidance: [
        {
          id: 'spread-cream-tip',
          kind: 'practicalTip',
          text: {
            en: 'The clear border gives the cream room to spread as you roll, so it does not squeeze out at the seam.',
            es: 'El borde libre deja espacio para que la crema se desplace al enrollar sin salir por la unión.',
            uk: 'Вільний край залишає місце для крему, щоб він не витискався через шов під час згортання.',
          },
        },
      ],
      cook: {
        requiresCream: true,
        ingredients: [
          {
            ingredientId: 'fresh-fruit',
          },
        ],
      },
      mediaIds: ['fruit-roll-cream-over-jam-v4'],
    },
    {
      id: 'fill',
      title: {
        en: 'Reroll and decorate',
        es: 'Enrolla y decora',
        uk: 'Згорніть і оздобте',
      },
      instruction: {
        en: 'On the same parchment, reroll from the curled edge. Keep the paper underneath the roll and place the roll seam-side down. Spread the reserved cream over the top and decorate with fruit, berries or chopped nuts if you like.',
        es: 'Sobre el mismo papel, vuelve a enrollar desde el extremo curvado. El papel queda debajo del rollo; coloca la unión hacia abajo. Unta por encima la crema reservada y decora con fruta, frutos rojos o frutos secos picados si quieres.',
        uk: 'На тому ж пергаменті згорніть рулет від загнутого краю. Папір залиште під рулетом, а рулет покладіть швом донизу. Намастіть зверху відкладеним кремом і за бажанням прикрасьте фруктами, ягодами чи подрібненими горіхами.',
      },
      ingredientLineIds: ['fresh-fruit', 'nuts'],
      guidance: [
        {
          id: 'fill-tip',
          kind: 'practicalTip',
          text: {
            en: 'Before serving, refrigerate the roll for about 2 hours so the cream and filling can set.',
            es: 'Antes de servir, deja el rollo unas 2 horas en la nevera para que la crema y el relleno se asienten.',
            uk: 'Перед подачею дайте рулету постояти в холодильнику приблизно 2 години, щоб крем і начинка стабілізувалися.',
          },
        },
      ],
      cook: {
        requiresCream: true,
        ingredients: [
          {
            ingredientId: 'fresh-fruit',
          },
          {
            ingredientId: 'nuts',
          },
        ],
      },
      mediaIds: ['fruit-roll-decorate-v1'],
      equipmentIds: ['parchment'],
    },
  ],
  storage: null,
  makeAhead: null,
  creamOptions: {
    recipeIds: ['mascarpone-whipped-cream', 'vanilla-buttercream'],
    recommendedRecipeId: 'mascarpone-whipped-cream',
  },
  variations: [],
  heroMediaId: 'fruit-sponge-roll-hero',
  media: [
    {
      id: 'fruit-sponge-roll-hero',
      type: 'image',
      path: '/images/recipes/fruit-sponge-roll-card-v3.webp',
      usage: ['hero'],
      alt: {
        en: 'Homemade fruit sponge roll with berry jam, mascarpone cream spread on top and fresh berries',
        es: 'Brazo de gitano casero con mermelada, crema de mascarpone extendida por encima y frutos rojos frescos',
        uk: 'Домашній бісквітний рулет із ягідним варенням, кремом із маскарпоне зверху та свіжими ягодами',
      },
    },
    {
      id: 'fruit-roll-egg-foam-v1',
      type: 'image',
      path: '/media/recipes/fruit-sponge-roll/selected/whipped-egg-foam-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Thick pale egg foam falling from a whisk in a broad ribbon',
        es: 'Espuma de huevo pálida y espesa cayendo de las varillas en una cinta ancha',
        uk: 'Густа світла яєчна піна спадає з вінчика широкою стрічкою',
      },
    },
    {
      id: 'fruit-roll-batter-tray-v1',
      type: 'image',
      path: '/media/recipes/fruit-sponge-roll/selected/batter-on-tray-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Airy sponge batter spread in a thin, even rectangle on parchment',
        es: 'Masa aireada extendida en un rectángulo fino y uniforme sobre papel de horno',
        uk: 'Повітряне бісквітне тісто розподілене тонким рівним прямокутником на пергаменті',
      },
    },
    {
      id: 'fruit-roll-warm-roll-v3',
      type: 'image',
      path: '/media/recipes/fruit-sponge-roll/selected/warm-sponge-roll-v3.webp',
      usage: ['step'],
      alt: {
        en: 'Warm sponge rolled together with its baking parchment, with paper visible between the turns',
        es: 'Bizcocho caliente enrollado junto con su papel de horno, visible entre las vueltas',
        uk: 'Теплий бісквіт згортають разом із пергаментом; папір видно між витками',
      },
    },
    {
      id: 'fruit-roll-blueberry-jam-v4',
      type: 'image',
      path: '/media/recipes/fruit-sponge-roll/selected/blueberry-jam-v4.webp',
      usage: ['step'],
      alt: {
        en: 'Blueberry jam with small berry pieces spread on the sponge while one edge curves smoothly upward and inward over the jam',
        es: 'Mermelada de arándanos con trocitos de fruta sobre el bizcocho, con un extremo que se curva suavemente hacia arriba y hacia dentro sobre la mermelada',
        uk: 'Чорничне варення зі шматочками ягід на бісквіті, край якого плавно заокруглюється вгору й усередину над начинкою',
      },
    },
    {
      id: 'fruit-roll-cream-over-jam-v4',
      type: 'image',
      path: '/media/recipes/fruit-sponge-roll/selected/cream-over-jam-v4.webp',
      usage: ['step'],
      alt: {
        en: 'Whipped cream with mascarpone spread over blueberry jam, leaving a 2 cm border without cream at the closing edge',
        es: 'Nata montada con mascarpone sobre mermelada de arándanos, dejando 2 cm sin crema en el borde de cierre',
        uk: 'Крем із вершків і маскарпоне поверх чорничного варення; край для закривання рулету на 2 см залишений без крему',
      },
    },
    {
      id: 'fruit-roll-decorate-v1',
      type: 'image',
      path: '/media/recipes/fruit-sponge-roll/selected/decorate-roll-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Reserved cream being spread on top of the finished roll, with a few berries added for decoration',
        es: 'Crema reservada extendiéndose sobre el rollo terminado, con algunos frutos rojos de decoración',
        uk: 'Відкладений крем наносять зверху на згорнутий рулет; частину вже прикрашено ягодами',
      },
    },
  ],
  relatedRecipeIds: [],
  sources: [
    {
      id: 'fruit-sponge-roll-recorded-source',
      file: 'docs/reference/recipe-inventory.xlsx',
      locator: 'Recipe Archive · Бісквітний рулет з фруктами',
    },
  ],
  contentGaps: [],
  presentation: 'concise',
  evidenceExplanation: {
    en: 'This sponge-roll base was baked successfully.',
    es: 'Esta base de brazo de gitano se horneó con éxito.',
    uk: 'Цю основу бісквітного рулету успішно випікали.',
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
      uk: ['Безглютеновий бісквітний рулет із фруктами'],
      en: ['Gluten-free fruit sponge roll'],
      es: ['Brazo de gitano de frutas sin gluten'],
    },
  },
  discovery: {
    cardTitle: {
      en: 'Fruit roll',
      es: 'Rollo de frutas',
      uk: 'Рулет із фруктами',
    },
    category: {
      en: 'Rolled sponge / dessert',
      es: 'Bizcocho enrollado / postre',
      uk: 'Бісквітний рулет / десерт',
    },
    flourSummary: {
      en: 'Schär Mix B Bread',
      es: 'Schär Mix B Bread',
      uk: 'Schär Mix B Bread',
    },
    collectionIds: ['celebration'],
    catalogue: true,
    imageKind: 'generated-preview',
    sourceTitle: 'Бісквітний рулет з фруктами',
    launchPriority: 'Medium–High',
    heroCandidate: 'Yes',
    source:
      'Full recipe and author-supplied example photo archived in the workbook',
    archiveSections: [
      {
        title: 'Ingredients · original notes',
        content:
          'Бісквіт:\n5 яєць\n100 г цукру\nТрохи солі\n35 мл олії\n35 мл води\n120 г борошна\n\nКрем:\n250 мл вершків\n80 г цукру\n250 г маскарпоне\n\nНачинка і декор:\nЧорничне варення\nПолуниця\nМ’ята\nМигдальні горішки',
      },
      {
        title: 'Method · original notes',
        content:
          'Яйця, цукор і сіль збити до густої світлої піни — приблизно 10 хв. Додати олію, воду і поступово борошно, обережно перемішуючи.\n\nВилити на пергамент. Випікати 15–20 хв при 180–200°C. Згорнути й охолодити. Намастити чорничним варенням і кремом. Для крему збити вершки з цукром, додати маскарпоне. Прикрасити полуницею, м’ятою та мигдалем.',
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
  seo: {
    uk: {
      title: 'Безглютеновий бісквітний рулет із фруктами',
      description:
        'Безглютеновий бісквітний рулет із ягідним варенням і кремом. Як спекти бісквіт, додати начинку та згорнути рулет; фрукти — за бажанням.',
    },
    en: {
      title: 'Gluten-free fruit sponge roll',
      description:
        'Gluten-free sponge roll with berry jam and cream. Bake, fill and roll the sponge step by step, then finish with optional fresh fruit.',
    },
    es: {
      title: 'Brazo de gitano de frutas sin gluten',
      description:
        'Brazo de gitano sin gluten con mermelada de frutos rojos y crema. Cómo hornear, rellenar y enrollar el bizcocho, con fruta fresca al gusto.',
    },
  },
  routeSlug: 'fruit-sponge-roll',
} satisfies Recipe;
