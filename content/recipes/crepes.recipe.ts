import type { Recipe } from './recipe.types.ts';

export const crepesRecipe = {
  schemaVersion: 3,
  id: 'crepes',
  versionId: 'crepes-pdf-v6',
  publicationStatus: 'published',
  translationState: {
    uk: 'reviewed',
    en: 'reviewed',
    es: 'reviewed',
  },
  slug: {
    en: 'crepes',
    es: 'crepes',
    uk: 'crepes',
  },
  title: {
    en: 'Gluten-free crepes',
    es: 'Crepes finos sin gluten',
    uk: 'Безглютенові млинці',
  },
  summary: {
    en: 'Thin crepes made with milk.',
    es: 'Estos crepes de leche quedan finos y flexibles, tanto para rellenarlos de jamón y queso como para servirlos con mermelada. Dales la vuelta cuando la superficie pierda el brillo y los bordes se despeguen.',
    uk: 'Тонкі млинці на молоці. Перевертай млинець, коли поверхня стане матовою, а краї легко відходитимуть від пательні.',
  },
  categoryIds: [],
  situationIds: [],
  difficulty: 'medium',
  baseProvenance: {
    state: 'tested',
    sourceIds: ['crepes-recorded-source'],
  },
  timing: {
    activeMinutes: 40,
    totalElapsedMinutes: 60,
    planningNote: {
      text: {
        en: 'Includes {duration} of batter rest.',
        es: 'Incluye {duration} de reposo de la masa.',
        uk: 'Включає {duration} відпочинку тіста.',
      },
      phaseId: 'batter-rest',
    },
    phases: [
      {
        id: 'batter-rest',
        label: {
          en: 'Batter rest',
          es: 'Reposo de la masa',
          uk: 'Відпочинок тіста',
        },
        duration: {
          kind: 'range',
          min: 15,
          max: 20,
          unit: 'minute',
        },
        relatedStepId: 'add-milk',
      },
    ],
  },
  yield: {
    default: {
      id: 'fifteen-crepes',
      label: {
        uk: 'Близько 15 млинців',
        en: 'About 15 crepes',
        es: 'Unos 15 crepes',
      },
      count: {
        kind: 'exact',
        value: 15,
      },
      unit: 'crepe',
      provenance: {
        state: 'tested',
        sourceIds: ['crepes-recorded-source'],
      },
      availability: 'default',
      approximate: true,
    },
    alternatives: [],
  },
  geometry: {
    state: 'known',
    default: {
      id: 'round-pan-24-cm',
      label: {
        uk: 'Кругла пательня, 24 см',
        en: '24 cm round pan',
        es: 'Sartén redonda de 24 cm',
      },
      kind: 'other',
      application: 'other',
      shape: 'round',
      diameterCm: 24,
      layerCount: null,
      material: null,
      provenance: {
        state: 'tested',
        sourceIds: ['crepes-recorded-source'],
      },
      availability: 'default',
    },
    alternatives: [],
  },
  configuration: {
    base: {
      geometryId: 'round-pan-24-cm',
      yieldId: 'fifteen-crepes',
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
            ingredientLineId: 'eggs',
            allowedUnit: 'piece',
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
    commercialMixLineId: 'flour',
    additionalStarchLineIds: [],
    provenance: {
      state: 'tested',
      sourceIds: ['crepes-recorded-source'],
    },
    testedAlternativeMixes: [],
    knownUnsupportedMixes: [],
    basis: 'commercialMix',
  },
  beforeStart: [],
  ingredientSections: [
    {
      id: 'batter',
      title: {
        en: 'Crepe batter',
        es: 'Masa para crepes',
        uk: 'Тісто для млинців',
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
          qualifier: {
            uk: 'Середнього розміру.',
            en: 'Medium-sized.',
            es: 'Medianos.',
          },
        },
        {
          id: 'flour',
          options: [
            {
              ingredientId: 'flour',
              name: {
                en: 'Schär Mix B Bread flour',
                es: 'Mezcla de harina Schär Mix B Bread',
                uk: 'Борошно Schär Mix B Bread',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 140,
              unit: 'g',
            },
            equivalent: {
              kind: 'exact',
              value: 7,
              unit: 'tbsp',
            },
            shopping: {
              mode: 'base',
            },
          },
        },
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
              kind: 'exact',
              value: 500,
              unit: 'ml',
            },
            shopping: {
              mode: 'base',
            },
          },
          qualifier: {
            uk: 'У нас — безлактозне.',
            en: 'We use lactose-free milk.',
            es: 'En casa usamos leche sin lactosa.',
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
              value: 20,
              unit: 'g',
            },
            equivalent: {
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
          id: 'water',
          options: [
            {
              ingredientId: 'water',
              name: {
                uk: 'Вода',
                en: 'Water',
                es: 'Agua',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'range',
              min: 0,
              max: 50,
              unit: 'ml',
            },
            shopping: {
              mode: 'base',
              defaultSelected: false,
            },
          },
          qualifier: {
            uk: 'За потреби — регулює густоту.',
            en: 'As needed to adjust the consistency.',
            es: 'Solo si la masa queda espesa después del reposo.',
          },
        },
        {
          id: 'oil',
          options: [
            {
              ingredientId: 'oil',
              name: {
                en: 'Neutral oil',
                es: 'Aceite suave',
                uk: 'Олія без запаху',
              },
            },
          ],
          quantity: {
            base: {
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
          id: 'pan-oil',
          options: [
            {
              ingredientId: 'pan-oil',
              name: {
                en: 'Oil for the pan',
                es: 'Aceite para la sartén',
                uk: 'Олія для пательні',
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
            en: 'For greasing.',
            es: 'Basta con un poco para el primer crepe.',
            uk: 'Для змащування.',
          },
        },
      ],
    },
  ],
  steps: [
    {
      id: 'start-batter',
      title: {
        en: 'Blend a thick base',
        es: 'Bate la masa sin grumos',
        uk: 'Збийте густу основу',
      },
      instruction: {
        en: 'Combine the eggs, flour, sugar and salt. Pour in a little milk — just enough for the blender or mixer to work. Blend to a smooth, thick base with no lumps.',
        es: 'Pon los huevos, la harina, el azúcar y la sal en un bol. Echa un chorrito de leche, lo justo para poder batir. Tritura con la batidora hasta que la masa esté espesa y sin grumos.',
        uk: 'З’єднайте яйця, борошно, цукор і сіль. Влийте трохи молока — лише стільки, щоб блендер або міксер міг працювати. Збийте до гладкої густої маси без грудочок.',
      },
      ingredientLineIds: ['eggs', 'flour', 'sugar', 'salt', 'milk'],
      guidance: [
        {
          id: 'start-batter-tip',
          kind: 'practicalTip',
          text: {
            en: 'Lumps break up more easily in a thick base.',
            es: 'Es más fácil deshacer los grumos mientras la masa está espesa.',
            uk: 'У густій основі легше розбити грудочки.',
          },
        },
      ],
      cook: {
        ingredients: [
          {
            ingredientId: 'eggs',
          },
          {
            ingredientId: 'flour',
          },
          {
            ingredientId: 'sugar',
          },
          {
            ingredientId: 'salt',
          },
          {
            ingredientId: 'milk',
            quantity: 'omit',
            note: {
              en: 'A little milk for the thick base.',
              es: 'Solo un chorrito para empezar.',
              uk: 'Трохи молока для густої основи.',
            },
          },
        ],
      },
      mediaIds: ['pdf-v6-base'],
      equipmentIds: ['mixer'],
    },
    {
      id: 'add-milk',
      title: {
        en: 'Add the milk and rest',
        es: 'Incorpora el resto de la leche',
        uk: 'Додайте молоко й залиште тісто',
      },
      instruction: {
        en: 'Gradually mix in the remaining milk. Leave to rest for 15–20 minutes.',
        es: 'Añade poco a poco el resto de la leche mientras remueves. Cuando la masa esté líquida y homogénea, déjala reposar entre 15 y 20 minutos.',
        uk: 'Поступово вмішайте решту молока. Залиште на 15–20 хвилин.',
      },
      ingredientLineIds: ['milk'],
      guidance: [],
      cook: {
        ingredients: [
          {
            ingredientId: 'milk',
            quantity: 'omit',
            note: {
              en: 'Remaining milk.',
              es: 'El resto de la leche.',
              uk: 'Решта молока.',
            },
          },
        ],
      },
      durationPhaseId: 'batter-rest',
      mediaIds: ['pdf-v6-milk'],
    },
    {
      id: 'check-consistency',
      title: {
        uk: 'Перевірте густоту',
        en: 'Check the consistency',
        es: 'Ajusta la consistencia',
      },
      instruction: {
        uk: 'Перемішайте тісто після відпочинку. Воно має стікати з ложки рівною цівкою, як рідкі вершки. Загусло — додавайте воду по одній столовій ложці й перемішуйте.',
        en: 'Stir the batter after resting. It should flow off a spoon in a steady stream, like single cream. If it has thickened, add water one tablespoon at a time and stir.',
        es: 'Remueve la masa y levanta la cuchara. Debe caer en un hilo continuo, como la nata líquida. Si está demasiado espesa, añade agua de cucharada en cucharada y mezcla cada vez.',
      },
      ingredientLineIds: ['water'],
      cook: {
        ingredients: [
          {
            ingredientId: 'water',
          },
        ],
      },
      mediaIds: ['pdf-v6-consistency'],
      guidance: [
        {
          id: 'consistency-choice',
          kind: 'practicalTip',
          text: {
            uk: 'Густіше тісто без води дає трохи товщі й міцніші млинці — їх легше перевертати. З усією водою млинці тонші й ніжніші: не поспішайте перевертати.',
            en: 'Thicker batter without water makes slightly thicker, sturdier crepes that are easier to flip. With all the water, crepes are thinner and more delicate: take your time before flipping.',
            es: 'Si es la primera vez que los haces, deja la masa un poco más espesa. Te resultará más fácil darles la vuelta. Cuanta más agua añadas, más finos y delicados quedarán.',
          },
        },
      ],
    },
    {
      id: 'add-oil',
      title: {
        uk: 'Додайте олію',
        en: 'Add the oil',
        es: 'Añade el aceite',
      },
      instruction: {
        uk: 'Додайте олію й ретельно перемішайте, щоб на поверхні не лишилося жирного шару.',
        en: 'Add the oil and mix thoroughly so no oily layer remains on the surface.',
        es: 'Incorpora el aceite a la masa y remueve hasta que desaparezca la película de aceite de la superficie.',
      },
      ingredientLineIds: ['oil'],
      cook: {
        ingredients: [
          {
            ingredientId: 'oil',
          },
        ],
      },
      mediaIds: ['pdf-v6-oil'],
      guidance: [],
    },
    {
      id: 'pour-batter',
      title: {
        uk: 'Розподіліть тісто',
        en: 'Spread the batter',
        es: 'Extiende la masa en la sartén',
      },
      instruction: {
        uk: 'Перед першим млинцем змастіть розігріту пательню олією. Налийте тісто й розподіліть тонким шаром, нахиляючи пательню.',
        en: 'Grease the hot pan before the first crepe. Pour in the batter and tilt the pan to spread it in a thin layer.',
        es: 'Calienta bien la sartén y engrásala ligeramente antes de hacer el primer crepe. Vierte un poco de masa con un cucharón e inclina enseguida la sartén para cubrir el fondo con una capa fina.',
      },
      ingredientLineIds: ['pan-oil'],
      cook: {
        ingredients: [
          {
            ingredientId: 'pan-oil',
          },
        ],
      },
      mediaIds: ['pdf-v6-pour'],
      guidance: [
        {
          id: 'first-crepe',
          kind: 'practicalTip',
          text: {
            uk: 'Перший млинець може вийти негарним, бо на пательні ще забагато олії. Це нормально: далі підуть рівні.',
            en: 'The first crepe may look uneven because there is still too much oil in the pan. That is normal: the next ones will be more even.',
            es: 'Si sobra aceite en la sartén, el primer crepe puede salir irregular. Los siguientes suelen quedar más uniformes.',
          },
        },
      ],
    },
    {
      id: 'check-edge',
      title: {
        uk: 'Перевірте край',
        en: 'Check the edge',
        es: 'Espera a que se despeguen los bordes',
      },
      instruction: {
        uk: 'Поверхня стала матовою з дрібними отворами, краї злегка підсмажилися й легко відділяються — час перевертати.',
        en: 'When the surface is matte with small holes and the lightly browned edges lift easily, it is time to flip.',
        es: 'Fíjate en la superficie del crepe. Cuando pierda el brillo, aparezcan agujeritos y los bordes estén dorados y se despeguen con facilidad, ya puedes darle la vuelta.',
      },
      ingredientLineIds: [],
      cook: {
        ingredients: [],
      },
      mediaIds: ['pdf-v6-edge'],
      guidance: [],
    },
    {
      id: 'flip-crepe',
      title: {
        uk: 'Переверніть',
        en: 'Flip the crepe',
        es: 'Dale la vuelta',
      },
      instruction: {
        uk: 'Підсуньте лопатку під край і переверніть. Смажте другий бік приблизно 10 секунд, до легкої золотистості. Так само приготуйте решту тіста.',
        en: 'Slide a spatula under the edge and flip. Cook the second side for about 10 seconds, until lightly golden. Repeat with the remaining batter.',
        es: 'Desliza la espátula por debajo del borde y dale la vuelta al crepe. Deja que se dore ligeramente por la otra cara, unos 10 segundos. Repite con el resto de la masa.',
      },
      ingredientLineIds: [],
      cook: {
        ingredients: [],
      },
      mediaIds: ['pdf-v6-flip'],
      guidance: [],
      displayMeta: {
        uk: '≈ 10 с',
        en: '≈ 10 sec',
        es: '≈ 10 s',
      },
      equipmentIds: ['spatula'],
    },
  ],
  storage: null,
  makeAhead: null,
  variations: [],
  heroMediaId: 'crepes-hero',
  media: [
    {
      id: 'crepes-hero',
      type: 'image',
      path: '/images/recipes/crepes-stack-lace-linen-v1.webp',
      fit: 'contain',
      usage: ['hero', 'card'],
      alt: {
        uk: 'Стопка золотавих млинців на тарілці та світлій лляній серветці',
        en: 'Stack of golden crepes on a plate and a light linen napkin',
        es: 'Crepes finos y dorados apilados en un plato sobre una servilleta de lino',
      },
    },
    {
      id: 'pdf-v6-base',
      type: 'image',
      path: '/images/recipes/crepes/pdf-v6/base.webp',
      fit: 'contain',
      usage: ['step'],
      alt: {
        uk: 'Блендер збиває густу основу для млинців',
        en: 'Blending the thick crepe batter base',
        es: 'Batidora de mano en un bol con la masa espesa de los crepes',
      },
    },
    {
      id: 'pdf-v6-consistency',
      type: 'image',
      path: '/images/recipes/crepes/pdf-v6/consistency.webp',
      fit: 'contain',
      usage: ['step'],
      alt: {
        uk: 'Додавання води ложкою для регулювання густоти тіста',
        en: 'Adding water by the spoonful to adjust batter consistency',
        es: 'Un vaso de agua y una cuchara sopera sobre el bol de masa',
      },
    },
    {
      id: 'pdf-v6-milk',
      type: 'image',
      path: '/images/recipes/crepes/pdf-v6/milk.webp',
      fit: 'contain',
      usage: ['step'],
      alt: {
        uk: 'Молоко поступово вливають у густу основу',
        en: 'Milk poured gradually into the thick batter base',
        es: 'Una mano vierte leche de una jarra mientras la otra remueve la masa',
      },
    },
    {
      id: 'pdf-v6-pour',
      type: 'image',
      path: '/images/recipes/crepes/pdf-v6/pour.webp',
      fit: 'contain',
      usage: ['step'],
      alt: {
        uk: 'Тісто розподіляють тонким шаром на пательні',
        en: 'Spreading a thin layer of batter in the pan',
        es: 'Un cucharón vierte masa en el centro de la sartén',
      },
    },
    {
      id: 'pdf-v6-oil',
      type: 'image',
      path: '/images/recipes/crepes/pdf-v6/oil.webp',
      fit: 'contain',
      usage: ['step'],
      alt: {
        uk: 'Олію додають до тіста для млинців',
        en: 'Adding oil to the crepe batter',
        es: 'Una cuchara con aceite sobre el bol de masa',
      },
    },
    {
      id: 'pdf-v6-flip',
      type: 'image',
      path: '/images/recipes/crepes/pdf-v6/flip.webp',
      fit: 'contain',
      usage: ['step'],
      alt: {
        uk: 'Золотиста сторона перевернутого млинця',
        en: 'Golden side of the flipped crepe',
        es: 'Crepe con la cara dorada hacia arriba en la sartén',
      },
      caption: {
        uk: 'Так виглядає перший бік. Другий має лише злегка підрум’янитися.',
        en: 'This is the first side. The other side only needs to turn lightly golden.',
        es: 'Así queda la primera cara. La segunda solo tiene que dorarse un poco.',
      },
    },
    {
      id: 'pdf-v6-edge',
      type: 'image',
      path: '/images/recipes/crepes/pdf-v6/edge.webp',
      fit: 'contain',
      usage: ['step'],
      alt: {
        uk: 'Матовий верх млинця й край, що відділяється від пательні',
        en: 'Matte crepe surface and an edge lifting from the pan',
        es: 'Crepe con agujeritos en la superficie y una espátula junto al borde',
      },
      caption: {
        uk: 'Якщо край ще прилипає, коли піднімаєте його лопаткою, зачекайте ще трохи.',
        en: 'If the edge sticks when you lift it with the spatula, give it a little longer.',
        es: 'Si el borde aún se pega al levantarlo con la espátula, espera un poco más.',
      },
    },
  ],
  relatedRecipeIds: [],
  sources: [
    {
      id: 'crepes-recorded-source',
      file: 'Bake-Again-Bezghliutenovi-mlyntsi-v6.pdf',
      locator:
        'Final PDF, pages 1–5; author confirmed final quantities and steps on 2026-11-18',
      note: 'Master: /Users/sasha/Bake Again Media/pdf/Bake-Again-Bezghliutenovi-mlyntsi-v6.pdf. Supersedes archived notebook quantities. Step images extracted unchanged from this PDF; camera originals are not available here.',
    },
  ],
  contentGaps: [],
  presentation: 'concise',
  evidenceExplanation: {
    en: 'This exact version has been cooked successfully.',
    es: 'Esta versión se ha preparado con éxito.',
    uk: 'Цю версію успішно готували.',
  },
  searchMetadata: {
    datePublished: null,
    dateModified: '2026-11-18',
    cookTimeMinutes: null,
    recipeCuisine: {
      uk: 'Українська кухня',
      en: 'Ukrainian',
      es: 'Ucraniana',
    },
    keywords: {
      uk: ['Безглютенові млинці'],
      en: ['Gluten-free crepes'],
      es: ['Crepes sin gluten'],
    },
    dateModifiedVersionId: 'crepes-pdf-v6',
  },
  discovery: {
    cardTitle: {
      en: 'Thin breakfast crepes',
      es: 'Crepes finos sin gluten',
      uk: 'Млинці',
    },
    category: {
      en: 'Breakfast',
      es: 'Desayuno',
      uk: 'Сніданок',
    },
    flourSummary: {
      en: 'Schär Mix B Bread',
      es: 'Schär Mix B Bread',
      uk: 'Schär Mix B Bread',
    },
    collectionIds: ['breakfast', 'everyday'],
    catalogue: true,
    imageKind: 'author-photo',
    sourceTitle: 'Млинці',
    launchPriority: 'High',
    heroCandidate: 'Yes',
    source: 'Handwritten notebook page, IMG_1275.jpeg',
    archiveSections: [
      {
        title: 'Ingredients · original notes',
        content:
          '5 яєць\n5 ст. л. борошна\n0,5 л молока\n1 ст. л. цукру\nДрібка солі\n5 ст. л. олії\n0,5 склянки води, краще гарячої',
      },
      {
        title: 'Method · original notes',
        content:
          '1. Змішати яйця, борошно, цукор, сіль і трохи молока без грудочок.\n2. Поступово додати молоко.\n3. Додати 0,5 склянки води, краще гарячої, та олію.\n4. Дати постояти 15–30 хв. За потреби додавати молоко або воду до рідкої консистенції.',
      },
    ],
    needsBeforePublishing: '',
  },
  cardMediaId: 'crepes-hero',
  translationReview: {
    date: '2026-11-18',
    reviewer: 'implementation',
    scope:
      'UK final PDF v6 confirmed by Sasha; EN/ES implementation translations of the same quantities and seven steps, not separate author language approval',
  },
  seo: {
    uk: {
      title: 'Тонкі млинці без глютену на молоці — покроковий рецепт',
      description:
        'Пропорції приблизно на 15 млинців із суміші Schär Mix B Bread, пательня 24 см. Сім фотокроків: густота тіста, смаження й момент перевертання.',
    },
    en: {
      title: 'Gluten-free crepes',
      description:
        'Thin gluten-free crepes made with milk. Ingredient quantities and step-by-step instructions for mixing the batter and cooking in a frying pan.',
    },
    es: {
      title: 'Crepes sin gluten con Schär Mix B paso a paso',
      description:
        'Prepara unos 15 crepes sin gluten en una sartén de 24 cm. Las fotos te enseñan cómo dejar la masa sin grumos y cuándo darles la vuelta sin que se rompan.',
    },
  },
  routeSlug: 'crepes',
} satisfies Recipe;
