import type { Recipe } from './recipe.types.ts';

export const spongeCakeRecipe = {
  schemaVersion: 3,
  id: 'sponge-cake',
  versionId: 'sponge-cake-source-v1',
  publicationStatus: 'published',
  translationState: {
    uk: 'reviewed',
    en: 'reviewed',
    es: 'reviewed',
  },
  slug: {
    en: 'sponge-cake',
    es: 'sponge-cake',
    uk: 'sponge-cake',
  },
  title: {
    en: 'Gluten-free sponge cake for layer cakes',
    es: 'Bizcocho sin gluten para tartas',
    uk: 'Безглютеновий бісквіт для торта',
  },
  summary: {
    en: 'An airy gluten-free sponge with Schär Mix B Bread, ready to slice into two or three layers for a homemade cake.',
    es: 'Un bizcocho esponjoso sin gluten con Schär Mix B Bread, para cortar en dos o tres capas y preparar una tarta casera.',
    uk: 'Повітряний безглютеновий бісквіт на Schär Mix B Bread — основа для домашнього торта на два або три коржі.',
  },
  categoryIds: [],
  situationIds: [],
  difficulty: 'easy',
  baseProvenance: {
    state: 'tested',
    sourceIds: ['sponge-cake-recorded-source'],
  },
  timing: {
    activeMinutes: 15,
    totalElapsedMinutes: null,
    planningNote: {
      text: {
        en: 'After baking for 40–50 min, leave the sponge in the switched-off oven for 10–15 min. Allow extra time for it to cool completely before slicing.',
        es: 'Después de 40–50 min de horneado, deja el bizcocho 10–15 min en el horno apagado. Reserva tiempo adicional para que se enfríe por completo antes de cortarlo.',
        uk: 'Після 40–50 хв випікання залиште бісквіт на 10–15 хв у вимкненій духовці. Перед розрізанням дайте йому повністю охолонути — закладіть на це додатковий час.',
      },
    },
    phases: [
      {
        id: 'baking',
        label: {
          en: 'Baking',
          es: 'Horneado',
          uk: 'Випікання',
        },
        duration: {
          kind: 'range',
          min: 40,
          max: 50,
          unit: 'minute',
        },
        relatedStepId: 'bake',
      },
      {
        id: 'oven-cooling',
        label: {
          en: 'Gradual cooling in the oven',
          es: 'Enfriado gradual en el horno',
          uk: 'Поступове охолодження в духовці',
        },
        duration: {
          kind: 'range',
          min: 10,
          max: 15,
          unit: 'minute',
        },
        relatedStepId: 'cool-and-slice',
      },
    ],
  },
  yield: {
    default: {
      id: 'one-sponge',
      label: {
        en: '1 sponge cake',
        es: '1 bizcocho',
        uk: '1 бісквіт',
      },
      count: {
        kind: 'exact',
        value: 1,
      },
      unit: 'cake',
      provenance: {
        state: 'tested',
        sourceIds: ['sponge-cake-recorded-source'],
      },
      availability: 'default',
    },
    alternatives: [],
  },
  geometry: {
    state: 'known',
    default: {
      id: 'sponge-cake-base',
      label: {
        en: 'Round cake tin',
        es: 'Molde redondo',
        uk: 'Кругла форма',
      },
      shape: 'round',
      kind: 'bakingPan',
      application: 'bake-in',
      diameterCm: null,
      layerCount: null,
      material: null,
      availability: 'default',
      provenance: {
        state: 'tested',
        sourceIds: ['sponge-cake-recorded-source'],
      },
    },
    alternatives: [],
  },
  configuration: {
    base: {
      geometryId: 'sponge-cake-base',
      yieldId: 'one-sponge',
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
      id: 'whisk',
      name: {
        en: 'whisk',
        es: 'varillas',
        uk: 'вінчик',
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
    commercialMixLineId: 'flour',
    additionalStarchLineIds: ['corn-starch', 'tapioca'],
    provenance: {
      state: 'tested',
      sourceIds: ['sponge-cake-recorded-source'],
    },
    testedAlternativeMixes: [],
    knownUnsupportedMixes: [],
    basis: 'commercialMix',
  },
  beforeStart: [],
  ingredientSections: [
    {
      id: 'sponge',
      title: {
        en: 'Sponge cake',
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
                en: 'Large eggs',
                es: 'Huevos grandes',
                uk: 'Великі яйця',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 5,
              unit: 'piece',
            },
            equivalent: {
              kind: 'exact',
              value: 6,
              unit: 'piece',
            },
            shopping: {
              mode: 'base',
              increment: 1,
              rounding: 'up',
            },
          },
          qualifier: {
            en: 'The equivalent quantity is for small eggs.',
            es: 'La cantidad equivalente corresponde a huevos pequeños.',
            uk: 'Еквівалент указано для маленьких яєць.',
          },
        },
        {
          id: 'sugar-whites',
          options: [
            {
              ingredientId: 'sugar-whites',
              name: {
                en: 'Sugar for the whites',
                es: 'Azúcar para las claras',
                uk: 'Цукор для білків',
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
        {
          id: 'sugar-yolks',
          options: [
            {
              ingredientId: 'sugar-yolks',
              name: {
                en: 'Sugar for the yolks',
                es: 'Azúcar para las yemas',
                uk: 'Цукор для жовтків',
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
              value: 15,
              unit: 'g',
            },
            equivalent: {
              kind: 'exact',
              value: 2.1429,
              unit: 'tbsp',
            },
            shopping: {
              mode: 'base',
            },
          },
        },
        {
          id: 'tapioca',
          options: [
            {
              ingredientId: 'tapioca',
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
              value: 70,
              unit: 'g',
            },
            equivalent: {
              kind: 'exact',
              value: 4.6667,
              unit: 'tbsp',
            },
            shopping: {
              mode: 'base',
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
      ],
    },
  ],
  steps: [
    {
      id: 'whip-whites',
      title: {
        en: 'Whip the whites',
        es: 'Monta las claras',
        uk: 'Збийте білки',
      },
      instruction: {
        en: 'Preheat the oven to 200°C. Separate the eggs. In a clean, dry bowl, whip the whites to a thick white foam using a stand mixer with a whisk attachment, a hand mixer or a balloon whisk. Keep whisking as you add the sugar for the whites in 3–4 batches.',
        es: 'Precalienta el horno a 200°C. Separa las claras de las yemas. En un bol limpio y seco, monta las claras hasta obtener una espuma blanca y espesa con un robot de cocina con varillas, una batidora de varillas o unas varillas manuales. Añade el azúcar para las claras en 3–4 tandas sin dejar de batir.',
        uk: 'Увімкніть духовку на 200°C. Відокремте білки від жовтків. У чистій сухій мисці збийте білки до густої білої піни — у комбайні з насадкою-вінчиком, міксером або ручним вінчиком. Продовжуючи збивати, за 3–4 рази додайте цукор для білків.',
      },
      ingredientLineIds: ['eggs', 'sugar-whites'],
      guidance: [
        {
          id: 'whip-whites-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The foam is thick and glossy, holds its shape and stays on the lifted whisk.',
            es: 'La espuma está espesa y brillante, mantiene su forma y no gotea al levantar las varillas.',
            uk: 'Піна густа й блискуча, тримає форму та не стікає з піднятого вінчика.',
          },
        },
      ],
      cook: {
        ingredients: [
          {
            ingredientId: 'eggs',
          },
          {
            ingredientId: 'sugar-whites',
          },
        ],
      },
      mediaIds: ['sponge-whipped-whites-v1'],
      equipmentIds: ['bowl', 'mixer', 'whisk'],
      temperature: {
        value: 200,
        unit: 'C',
        ovenMode: null,
      },
    },
    {
      id: 'whip-yolks',
      title: {
        en: 'Whip the yolks',
        es: 'Bate las yemas',
        uk: 'Збийте жовтки',
      },
      instruction: {
        en: 'In a separate bowl, beat the yolks with the sugar for the yolks until pale and thick. The mixture should fall from the whisk in a broad ribbon.',
        es: 'En otro bol, bate las yemas con el azúcar para las yemas hasta obtener una mezcla clara y espesa. Debe caer de las varillas formando una cinta ancha.',
        uk: 'В окремій мисці збийте жовтки з цукром для жовтків до світлої густої маси. Вона має стікати з вінчика широкою стрічкою.',
      },
      ingredientLineIds: ['sugar-yolks'],
      guidance: [],
      cook: {
        ingredients: [
          {
            ingredientId: 'sugar-yolks',
          },
        ],
      },
      mediaIds: ['sponge-whipped-yolks-v1'],
      equipmentIds: ['bowl', 'whisk'],
    },
    {
      id: 'fold-dry',
      title: {
        en: 'Combine the batter',
        es: 'Prepara la masa',
        uk: 'Приготуйте тісто',
      },
      instruction: {
        en: 'Gently fold the yolks into the whipped whites with a spoon or spatula, lifting the mixture from the bottom. Mix the flour and both starches in a separate bowl. Add the dry mixture to the batter in 2–3 batches, either sifting it over the bowl or sprinkling it in a little at a time. Fold gently after each addition, just until no dry flour remains.',
        es: 'Incorpora las yemas a las claras con una cuchara o espátula, con movimientos envolventes de abajo hacia arriba. Mezcla aparte la harina y los dos almidones. Añade esta mezcla a la masa en 2–3 tandas: puedes tamizarla sobre el bol o añadirla poco a poco sin tamizar. Mezcla con suavidad después de cada tanda, solo hasta que no quede harina seca.',
        uk: 'Ложкою або лопаткою обережно вмішайте жовтки у збиті білки рухами знизу вгору. Окремо змішайте борошно й обидва крохмалі. Додайте суху суміш у тісто за 2–3 рази: можна просіювати її над мискою або просто підсипати невеликими порціями. Щоразу обережно перемішуйте, лише доки зникне сухе борошно.',
      },
      ingredientLineIds: ['corn-starch', 'tapioca', 'flour'],
      guidance: [
        {
          id: 'fold-dry-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The batter is still airy, with no dry lumps or streaks of flour.',
            es: 'La masa sigue aireada, sin grumos secos ni restos de harina.',
            uk: 'Тісто залишається повітряним, без сухих грудочок і смуг борошна.',
          },
        },
      ],
      cook: {
        ingredients: [
          {
            ingredientId: 'corn-starch',
          },
          {
            ingredientId: 'tapioca',
          },
          {
            ingredientId: 'flour',
          },
        ],
      },
      mediaIds: ['sponge-fold-yolks-v1', 'sponge-fold-dry-v1'],
      equipmentIds: ['bowl', 'spatula'],
    },
    {
      id: 'bake',
      title: {
        en: 'Bake the sponge',
        es: 'Hornea el bizcocho',
        uk: 'Спечіть бісквіт',
      },
      instruction: {
        en: 'Line the base and sides of a round cake tin with two sheets of aluminium foil laid across each other at right angles, pressing them against the tin. Spoon in the batter, gently level the top and bake at 200°C for about 40–50 minutes. Towards the end, check the centre with a toothpick.',
        es: 'Forra el fondo y las paredes de un molde redondo para tartas con dos hojas de papel de aluminio colocadas en cruz, ajustándolas al molde. Vierte la masa, alisa suavemente la superficie y hornea a 200°C durante unos 40–50 minutos. Al final, comprueba el centro con un palillo.',
        uk: 'Вистеліть дно й бортики круглої форми для торта двома листами фольги, поклавши їх навхрест і притиснувши до форми. Перекладіть тісто, злегка розрівняйте верх і випікайте при 200°C приблизно 40–50 хвилин. Наприкінці перевірте середину бісквіта зубочисткою.',
      },
      ingredientLineIds: [],
      guidance: [
        {
          id: 'bake-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'A toothpick inserted into the centre comes out dry, with no raw batter. If batter clings to it, keep baking and check again.',
            es: 'El palillo sale seco del centro, sin restos de masa cruda. Si tiene masa adherida, sigue horneando y vuelve a comprobar.',
            uk: 'Зубочистка із середини бісквіта виходить сухою, без слідів сирого тіста. Якщо на ній є тісто, продовжте випікання й перевірте ще раз.',
          },
        },
      ],
      mediaIds: ['sponge-batter-round-foil-v2'],
      equipmentIds: ['foil'],
      temperature: {
        value: 200,
        unit: 'C',
        ovenMode: null,
      },
      durationPhaseId: 'baking',
    },
    {
      id: 'cool-and-slice',
      title: {
        en: 'Cool and slice into layers',
        es: 'Deja enfriar y corta en capas',
        uk: 'Охолодіть і розріжте на коржі',
      },
      instruction: {
        en: 'Once the toothpick comes out dry, switch off the oven, leave the door slightly ajar and let the sponge sit inside for 10–15 minutes. Cooling gradually helps reduce the risk of sinking. Take it out of the oven and let it cool completely. Remove the tin and foil, then slice the sponge horizontally into two or three layers.',
        es: 'Cuando el palillo salga seco, apaga el horno, entreabre la puerta y deja el bizcocho dentro durante 10–15 minutos. Así se enfriará poco a poco y será menos probable que se hunda. Sácalo del horno y deja que se enfríe por completo. Retira el molde y el aluminio y corta el bizcocho horizontalmente en dos o tres capas.',
        uk: 'Коли зубочистка виходить сухою, вимкніть духовку, трохи прочиніть дверцята й залиште бісквіт усередині на 10–15 хвилин. Так він охолоне поступово — це допоможе зменшити ризик осідання. Потім дістаньте його з духовки й дайте повністю охолонути. Зніміть форму та фольгу й розріжте бісквіт горизонтально на два або три коржі.',
      },
      ingredientLineIds: [],
      guidance: [
        {
          id: 'cool-and-slice-tip',
          kind: 'practicalTip',
          text: {
            en: 'For a simple homemade cake, spread sour cream mixed with sugar between the layers and pour chocolate glaze over the top. Prepare the cream and glaze separately.',
            es: 'Para una tarta casera sencilla, rellena las capas con nata agria mezclada con azúcar y cubre con un glaseado de chocolate. Prepara la crema y el glaseado aparte.',
            uk: 'Для простого домашнього торта перемастіть коржі сметаною з цукром і полийте зверху шоколадною глазур’ю. Крем і глазур приготуйте окремо.',
          },
        },
      ],
      equipmentIds: ['foil'],
      durationPhaseId: 'oven-cooling',
    },
  ],
  storage: null,
  makeAhead: null,
  variations: [],
  heroMediaId: 'sponge-cake-hero',
  media: [
    {
      id: 'sponge-cake-hero',
      type: 'image',
      path: '/images/recipes/sponge-cake-card-v1.webp',
      usage: ['hero'],
      alt: {
        en: 'Tall plain gluten-free sponge cake with one wedge cut',
        es: 'Bizcocho sin gluten alto y sencillo con una porción cortada',
        uk: 'Високий простий безглютеновий бісквіт із відрізаним шматком',
      },
    },
    {
      id: 'sponge-whipped-whites-v1',
      type: 'image',
      path: '/media/recipes/sponge-cake/selected/whipped-whites-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Thick white egg foam on a lifted whisk',
        es: 'Espuma blanca y espesa de claras sobre unas varillas levantadas',
        uk: 'Густа біла яєчна піна на піднятому вінчику',
      },
    },
    {
      id: 'sponge-whipped-yolks-v1',
      type: 'image',
      path: '/media/recipes/sponge-cake/selected/whipped-yolks-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Pale thick yolk mixture falling from a whisk in a ribbon',
        es: 'Mezcla clara y espesa de yemas cayendo en forma de cinta',
        uk: 'Світла густа жовткова маса стікає з вінчика стрічкою',
      },
    },
    {
      id: 'sponge-fold-yolks-v1',
      type: 'image',
      path: '/media/recipes/sponge-cake/selected/fold-yolks-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Yolk mixture being gently folded into whipped whites',
        es: 'Yemas incorporándose suavemente a las claras montadas',
        uk: 'Жовткову масу обережно вмішують у збиті білки',
      },
    },
    {
      id: 'sponge-fold-dry-v1',
      type: 'image',
      path: '/media/recipes/sponge-cake/selected/fold-dry-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Dry ingredients being added to airy sponge batter',
        es: 'Ingredientes secos añadiéndose a una masa aireada',
        uk: 'Сухі інгредієнти додають до повітряного бісквітного тіста',
      },
    },
    {
      id: 'sponge-batter-round-foil-v2',
      type: 'image',
      path: '/media/recipes/sponge-cake/selected/batter-in-round-foil-v2.webp',
      usage: ['step'],
      alt: {
        en: 'Sponge batter being poured into a round tin lined with two crossed sheets of aluminium foil',
        es: 'Masa de bizcocho vertiéndose en un molde redondo forrado con dos hojas de aluminio en cruz',
        uk: 'Бісквітне тісто переливають у круглу форму, вистелену двома листами фольги навхрест',
      },
    },
  ],
  relatedRecipeIds: [],
  sources: [
    {
      id: 'sponge-cake-recorded-source',
      file: 'docs/reference/recipe-inventory.xlsx',
      locator:
        'Recipe Archive · Бісквіт; author-reviewed timing and yield; author clarification 2026-09-24: round tin lined with crossed foil sheets, gradual oven cooling and layer-cake serving',
    },
  ],
  contentGaps: [],
  presentation: 'concise',
  evidenceExplanation: {
    en: 'This version has been baked successfully.',
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
      uk: ['Безглютеновий бісквіт для торта'],
      en: ['Gluten-free sponge cake for layer cakes'],
      es: ['Bizcocho sin gluten para tartas'],
    },
  },
  discovery: {
    cardTitle: {
      en: 'Sponge cake',
      es: 'Bizcocho',
      uk: 'Бісквіт',
    },
    category: {
      en: 'Cake base',
      es: 'Base de bizcocho',
      uk: 'Основа для торта',
    },
    flourSummary: {
      en: 'Schär Mix B Bread + tapioca and corn starch',
      es: 'Schär Mix B Bread + almidones de tapioca y maíz',
      uk: 'Schär Mix B Bread + тапіоковий і кукурудзяний крохмалі',
    },
    collectionIds: ['celebration'],
    catalogue: true,
    imageKind: 'generated-preview',
    sourceTitle: 'Бісквіт',
    launchPriority: 'Medium',
    heroCandidate: 'No',
    source: 'Handwritten notebook page with corrections, IMG_1274.jpeg',
    archiveSections: [
      {
        title: 'Ingredients · original notes',
        content:
          '5 великих або 6 маленьких яєць\nЦукор — неповна склянка (позначка 120 г) + 2 ст. л. для жовтків\nКукурудзяний крохмаль — 15 г\nТапіока — 70 г\nБорошно — 140 г',
      },
      {
        title: 'Method · original notes',
        content:
          '1. Увімкнути духовку. Яйця розділити.\n2. Білки збити до густої білої піни, за 3–4 рази додати цукор.\n3. Жовтки з 2 ст. л. цукру збити до посвітління.\n4. Обережно вмішати жовтки в білки.\n5. За 2–3 рази вмішати сухі інгредієнти.\n6. Змастити тільки дно форми. Випікати приблизно 40–50 хв при 200°C.',
      },
    ],
    needsBeforePublishing:
      'Record the long form dimensions, doneness cue and full timing; approve or replace the generated photo.',
  },
  translationReview: {
    date: '2026-11-01',
    reviewer: 'implementation',
    scope:
      'ID-aligned transfer and semantic comparison of existing UK/EN/ES recipe text; not separate author approval',
  },
  seo: {
    uk: {
      title: 'Безглютеновий бісквіт для торта',
      description:
        'Безглютеновий бісквіт на Schär Mix B Bread для торта на два або три коржі. Покроковий рецепт повітряної основи для крему й начинки.',
    },
    en: {
      title: 'Gluten-free sponge cake for layer cakes',
      description:
        'Gluten-free sponge cake made with Schär Mix B Bread, ready to cut into two or three layers. A step-by-step recipe for a light cake base.',
    },
    es: {
      title: 'Bizcocho sin gluten para tartas',
      description:
        'Bizcocho sin gluten con Schär Mix B Bread para cortar en dos o tres capas. Receta paso a paso de una base esponjosa para tartas.',
    },
  },
  routeSlug: 'sponge-cake',
} satisfies Recipe;
