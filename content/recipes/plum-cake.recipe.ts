import type { Recipe } from './recipe.types.ts';

export const plumCakeRecipe = {
  schemaVersion: 3,
  id: 'plum-cake',
  versionId: 'plum-cake-source-v1',
  publicationStatus: 'published',
  translationState: {
    uk: 'reviewed',
    en: 'reviewed',
    es: 'reviewed',
  },
  slug: {
    en: 'plum-cake',
    es: 'plum-cake',
    uk: 'plum-cake',
  },
  title: {
    en: 'Gluten-free plum sponge cake',
    es: 'Bizcocho de ciruelas sin gluten',
    uk: 'Безглютеновий сливовий пиріг',
  },
  summary: {
    en: 'A tender butter sponge topped with juicy plum wedges and a gentle tartness.',
    es: 'Un bizcocho tierno de mantequilla con gajos de ciruela jugosos y un toque ácido.',
    uk: 'Ніжний бісквіт із вершковим маслом, соковитими скибочками слив і легкою кислинкою.',
  },
  categoryIds: [],
  situationIds: [],
  difficulty: 'medium',
  baseProvenance: {
    state: 'tested',
    sourceIds: ['plum-cake-recorded-source'],
  },
  timing: {
    activeMinutes: 30,
    totalElapsedMinutes: 60,
    planningNote: null,
    phases: [
      {
        id: 'baking',
        label: {
          en: 'Baking',
          es: 'Horneado',
          uk: 'Випікання',
        },
        duration: {
          kind: 'exact',
          value: 30,
          unit: 'minute',
        },
        relatedStepId: 'bake',
      },
    ],
  },
  yield: {
    default: {
      id: 'one-plum-cake',
      label: {
        en: '1 cake',
        es: '1 bizcocho',
        uk: '1 пиріг',
      },
      count: {
        kind: 'exact',
        value: 1,
      },
      unit: 'cake',
      provenance: {
        state: 'tested',
        sourceIds: ['plum-cake-recorded-source'],
      },
      availability: 'default',
    },
    alternatives: [],
  },
  geometry: {
    state: 'unknown',
    default: null,
    alternatives: [],
  },
  configuration: {
    base: {
      geometryId: 'plum-cake-base',
      yieldId: 'one-plum-cake',
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
      id: 'bowl',
      name: {
        en: 'bowl',
        es: 'bol',
        uk: 'миска',
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
    additionalStarchLineIds: ['tapioca'],
    xanthanLineId: 'xanthan',
    provenance: {
      state: 'tested',
      sourceIds: ['plum-cake-recorded-source'],
    },
    testedAlternativeMixes: [],
    knownUnsupportedMixes: [],
    basis: 'commercialMix',
  },
  beforeStart: [],
  ingredientSections: [
    {
      id: 'cake',
      title: {
        en: 'Plum upside-down cake',
        es: 'Bizcocho invertido de ciruelas',
        uk: 'Перевернутий сливовий пиріг',
      },
      lines: [
        {
          id: 'plums',
          options: [
            {
              ingredientId: 'plums',
              name: {
                en: 'Ripe but firm plums',
                es: 'Ciruelas maduras pero firmes',
                uk: 'Стиглі, але щільні сливи',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 400,
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
                en: 'Small eggs',
                es: 'Huevos pequeños',
                uk: 'Невеликі яйця',
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
              value: 15,
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
          optional: true,
        },
        {
          id: 'butter',
          options: [
            {
              ingredientId: 'butter',
              name: {
                en: 'Unsalted butter',
                es: 'Mantequilla sin sal',
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
        },
        {
          id: 'butter-for-pan',
          options: [
            {
              ingredientId: 'butter-for-pan',
              name: {
                en: 'Butter for greasing the parchment',
                es: 'Mantequilla para engrasar el papel',
                uk: 'Масло для змащування пергаменту',
              },
            },
          ],
          quantity: {
            base: null,
            shopping: {
              mode: 'nameOnly',
            },
          },
          scaling: {
            kind: 'fixed',
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
          id: 'vanilla',
          options: [
            {
              ingredientId: 'vanilla',
              name: {
                en: 'Vanillin',
                es: 'Vainillina',
                uk: 'Ванілін',
              },
            },
          ],
          quantity: {
            base: null,
            shopping: {
              mode: 'nameOnly',
            },
          },
        },
      ],
    },
  ],
  steps: [
    {
      id: 'prepare-plums',
      title: {
        en: 'Prepare the pan and plums',
        es: 'Prepara el molde y las ciruelas',
        uk: 'Підготуйте форму та сливи',
      },
      instruction: {
        en: 'Preheat the oven to 200°C. Line the pan with parchment and lightly butter the paper. Stone the plums, cut into wedges and pat away excess juice. Arrange in one layer with a cut surface against the paper.',
        es: 'Precalienta el horno a 200°C. Forra el molde con papel de horno y engrásalo ligeramente con mantequilla. Deshuesa las ciruelas, córtalas en gajos y seca el exceso de jugo. Colócalas en una sola capa, con una cara cortada sobre el papel.',
        uk: 'Розігрійте духовку до 200°C. Застеліть форму пергаментом і злегка змастіть папір маслом. Вийміть зі слив кісточки, наріжте м’якоть скибочками та промокніть зайвий сік. Викладіть одним шаром, однією зі зрізаних сторін до пергаменту.',
      },
      ingredientLineIds: ['plums', 'butter-for-pan'],
      guidance: [],
      cook: {
        ingredients: [
          {
            ingredientId: 'plums',
          },
          {
            ingredientId: 'butter-for-pan',
          },
        ],
      },
      mediaIds: ['plum-wedges-author-v1'],
      equipmentIds: ['parchment'],
      temperature: {
        value: 200,
        unit: 'C',
        ovenMode: null,
      },
    },
    {
      id: 'whip-eggs',
      title: {
        en: 'Whip the whites and yolks separately',
        es: 'Bate las claras y las yemas por separado',
        uk: 'Окремо збийте білки та жовтки',
      },
      instruction: {
        en: 'Separate the eggs. Beat the yolks with 2 tablespoons of the sugar until pale. In a clean, dry bowl, whip the whites, gradually adding the remaining sugar. Gently fold the yolks into the whites.',
        es: 'Separa los huevos. Bate las yemas con 2 cucharadas del azúcar hasta que aclaren. En un bol limpio y seco, monta las claras añadiendo poco a poco el azúcar restante. Incorpora las yemas a las claras con movimientos envolventes.',
        uk: 'Відокремте білки від жовтків. Жовтки збийте з 2 столовими ложками цукру до посвітління. У чистій сухій мисці збийте білки, поступово додаючи решту цукру. Обережно вмішайте жовтки у збиті білки.',
      },
      ingredientLineIds: ['eggs', 'sugar'],
      quantityMentions: [
        {
          text: {
            en: '2 tablespoons',
            es: '2 cucharadas',
            uk: '2 столовими ложками',
          },
          quantity: {
            kind: 'exact',
            value: 2,
            unit: 'tbsp',
          },
        },
      ],
      guidance: [
        {
          id: 'whip-eggs-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The whites hold their shape; the combined mixture remains airy.',
            es: 'Las claras mantienen la forma y la mezcla conserva el aire al unirla.',
            uk: 'Білки тримають форму, після з’єднання маса залишається повітряною.',
          },
        },
      ],
      cook: {
        ingredients: [
          {
            ingredientId: 'eggs',
          },
          {
            ingredientId: 'sugar',
          },
        ],
      },
      mediaIds: ['whipped-whites-author-v1'],
      equipmentIds: ['bowl'],
    },
    {
      id: 'fold-flour',
      title: {
        en: 'Fold in the dry ingredients',
        es: 'Incorpora los ingredientes secos',
        uk: 'Вмішайте сухі інгредієнти',
      },
      instruction: {
        en: 'Fold the dry mixture into the egg mixture in several additions, lifting the batter from the bottom with a spatula.',
        es: 'Incorpora la mezcla seca a la de huevo en varias tandas con una espátula y movimientos envolventes.',
        uk: 'У кілька прийомів додайте суху суміш до яєчної маси, обережно перемішуючи лопаткою знизу вгору.',
      },
      ingredientLineIds: ['flour', 'tapioca', 'xanthan', 'salt', 'vanilla'],
      guidance: [
        {
          id: 'fold-flour-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'No dry pockets remain; the batter is still airy.',
            es: 'No quedan bolsas de harina y la masa conserva el aire.',
            uk: 'Сухого борошна не видно, тісто залишається повітряним.',
          },
        },
        {
          id: 'fold-flour-tip',
          kind: 'practicalTip',
          text: {
            en: 'First, thoroughly mix the flour, tapioca starch, salt and vanillin, adding xanthan gum if using.',
            es: 'Primero mezcla bien la harina, el almidón de tapioca, la sal y la vainillina; añade la goma xantana si la usas.',
            uk: 'Спочатку ретельно змішайте борошно, тапіоковий крохмаль, сіль і ванілін; за бажанням додайте ксантанову камедь.',
          },
        },
      ],
      cook: {
        ingredients: [
          {
            ingredientId: 'flour',
          },
          {
            ingredientId: 'tapioca',
          },
          {
            ingredientId: 'xanthan',
          },
          {
            ingredientId: 'salt',
          },
          {
            ingredientId: 'vanilla',
          },
        ],
      },
      mediaIds: ['fold-flour-author-v1'],
      equipmentIds: ['spatula'],
    },
    {
      id: 'fold-butter',
      title: {
        en: 'Fold in the butter',
        es: 'Incorpora la mantequilla',
        uk: 'Додайте масло',
      },
      instruction: {
        en: 'Melt 50 g butter and let it cool until just warm. Mix 3–4 spoonfuls of batter into the butter until smooth. Return this mixture to the main bowl and gently fold together.',
        es: 'Derrite 50 g de mantequilla y deja templar. Mézclala con 3–4 cucharadas de masa hasta que quede homogénea. Devuelve la mezcla al bol principal e incorpora con movimientos envolventes.',
        uk: 'Розтопіть 50 г масла й дайте охолонути до ледь теплого. Додайте до масла 3–4 ложки тіста та перемішайте до однорідності. Поверніть суміш у миску з рештою тіста й обережно вмішайте лопаткою.',
      },
      ingredientLineIds: ['butter'],
      quantityMentions: [
        {
          text: {
            en: '50 g',
            es: '50 g',
            uk: '50 г',
          },
          quantity: {
            kind: 'exact',
            value: 50,
            unit: 'g',
          },
        },
      ],
      guidance: [
        {
          id: 'fold-butter-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The butter is fully incorporated, with no oily streaks.',
            es: 'La mantequilla está integrada, sin vetas de grasa.',
            uk: 'Масло повністю з’єдналося з тістом, жирних смуг немає.',
          },
        },
        {
          id: 'fold-butter-tip',
          kind: 'practicalTip',
          text: {
            en: 'Melt the butter before whipping the eggs so it has time to cool.',
            es: 'Derrite la mantequilla antes de batir los huevos para que tenga tiempo de templarse.',
            uk: 'Розтопіть масло ще до збивання яєць — воно встигне охолонути.',
          },
        },
      ],
      cook: {
        ingredients: [
          {
            ingredientId: 'butter',
          },
        ],
      },
      mediaIds: ['butter-batter-author-v1'],
      equipmentIds: ['bowl'],
    },
    {
      id: 'fill-pan',
      title: {
        en: 'Cover the plums with batter',
        es: 'Cubre las ciruelas con la masa',
        uk: 'Викладіть тісто на сливи',
      },
      instruction: {
        en: 'Spoon the batter over the plums in several places, then gently level it without moving the fruit. Put the pan straight into the preheated oven.',
        es: 'Reparte la masa sobre las ciruelas en varios puntos y alisa con cuidado sin desplazar la fruta. Introduce el molde enseguida en el horno precalentado.',
        uk: 'Викладіть тісто на сливи в кількох місцях і делікатно розрівняйте, не зсуваючи скибочок. Одразу поставте форму в розігріту духовку.',
      },
      ingredientLineIds: [],
      guidance: [],
      mediaIds: ['filled-pan-author-v1'],
    },
    {
      id: 'bake',
      title: {
        en: 'Bake the cake',
        es: 'Hornea el bizcocho',
        uk: 'Спечіть пиріг',
      },
      instruction: {
        en: 'Bake at 200°C for about 30 minutes. To check, insert a skewer into the sponge, avoiding the fruit.',
        es: 'Hornea a 200°C durante unos 30 minutos. Para comprobarlo, introduce una brocheta en el bizcocho, evitando la fruta.',
        uk: 'Випікайте при 200°C приблизно 30 хвилин. Для перевірки готовності вставте шпажку в бісквіт, не потрапляючи у сливи.',
      },
      ingredientLineIds: [],
      guidance: [
        {
          id: 'bake-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The top is golden, the centre springs back gently and the skewer has no raw batter.',
            es: 'La superficie está dorada, el centro recupera la forma al tocarlo y la brocheta sale sin masa cruda.',
            uk: 'Поверхня золотиста, середина пружинить після легкого натискання, на шпажці немає сирого тіста.',
          },
        },
        {
          id: 'bake-tip',
          kind: 'practicalTip',
          text: {
            en: 'If the top browns before the centre is baked, cover loosely with foil and continue until done.',
            es: 'Si la superficie se dora antes de que el centro esté hecho, cubre sin apretar con aluminio y sigue horneando.',
            uk: 'Якщо верх уже підрум’янився, а середина ще сира, нещільно накрийте фольгою та допечіть.',
          },
        },
      ],
      displayMeta: {
        en: '200°C · 30 min',
        es: '200°C · 30 min',
        uk: '200°C · 30 хв',
      },
      mediaIds: ['baked-sponge-author-v1'],
      temperature: {
        value: 200,
        unit: 'C',
        ovenMode: null,
      },
      durationPhaseId: 'baking',
    },
    {
      id: 'invert',
      title: {
        en: 'Invert and cool',
        es: 'Dale la vuelta y deja enfriar',
        uk: 'Переверніть і дайте охолонути',
      },
      instruction: {
        en: 'Remove the cake from the oven and loosen the edges. Wearing oven mitts, cover the pan with a larger flat platter and turn both over together. Lift off the pan and carefully peel away the parchment. Let the cake cool before slicing.',
        es: 'Saca el bizcocho del horno y despega los bordes. Con manoplas, cubre el molde con una fuente plana más grande y gira ambos juntos. Retira el molde y despega el papel con cuidado. Deja enfriar antes de cortar.',
        uk: 'Дістаньте пиріг із духовки та відділіть краї від форми. Надягніть рукавиці, накрийте форму більшою пласкою таріллю й переверніть їх разом. Зніміть форму та обережно відокремте пергамент. Перед нарізанням дайте пирогу охолонути.',
      },
      ingredientLineIds: [],
      guidance: [],
      mediaIds: ['inverted-cake-author-v1'],
      equipmentIds: ['parchment'],
    },
  ],
  storage: null,
  makeAhead: null,
  variations: [],
  heroMediaId: 'plum-cake-hero',
  media: [
    {
      id: 'plum-cake-hero',
      type: 'image',
      path: '/images/recipes/plum-cake-author-hero-v1.webp',
      usage: ['hero'],
      alt: {
        en: 'Round upside-down plum cake with one slice showing the pale crumb',
        es: 'Bizcocho redondo invertido de ciruelas con una porción que muestra la miga clara',
        uk: 'Круглий перевернутий сливовий пиріг і шматочок зі світлим м’якушем',
      },
    },
    {
      id: 'plum-wedges-author-v1',
      type: 'image',
      path: '/media/recipes/plum-cake/selected/plum-wedges-author-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Plum wedges on buttered parchment',
        es: 'Gajos de ciruela sobre papel engrasado',
        uk: 'Скибочки слив на змащеному пергаменті',
      },
    },
    {
      id: 'whipped-whites-author-v1',
      type: 'image',
      path: '/media/recipes/plum-cake/selected/whipped-whites-author-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Whipped egg whites',
        es: 'Claras montadas',
        uk: 'Збиті білки',
      },
    },
    {
      id: 'fold-flour-author-v1',
      type: 'image',
      path: '/media/recipes/plum-cake/selected/fold-flour-author-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Dry ingredients being added to the egg mixture',
        es: 'Ingredientes secos incorporándose a la mezcla de huevo',
        uk: 'Додавання сухих інгредієнтів до яєчної маси',
      },
    },
    {
      id: 'butter-batter-author-v1',
      type: 'image',
      path: '/media/recipes/plum-cake/selected/butter-batter-author-v1.webp',
      usage: ['step'],
      alt: {
        en: 'A small portion of batter mixed with melted butter',
        es: 'Una porción de masa con mantequilla derretida',
        uk: 'Невелика порція тіста з розтопленим маслом',
      },
    },
    {
      id: 'filled-pan-author-v1',
      type: 'image',
      path: '/media/recipes/plum-cake/selected/filled-pan-author-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Batter spread over the plums in the lined pan',
        es: 'Masa extendida sobre las ciruelas en el molde forrado',
        uk: 'Тісто рівномірно вкриває сливи у формі',
      },
    },
    {
      id: 'baked-sponge-author-v1',
      type: 'image',
      path: '/media/recipes/plum-cake/selected/baked-sponge-author-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Golden cake in its pan before inverting',
        es: 'Bizcocho dorado en el molde antes de darle la vuelta',
        uk: 'Золотистий пиріг у формі перед перевертанням',
      },
    },
    {
      id: 'inverted-cake-author-v1',
      type: 'image',
      path: '/media/recipes/plum-cake/selected/inverted-cake-author-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Finished upside-down plum cake',
        es: 'Bizcocho invertido de ciruelas',
        uk: 'Готовий перевернутий сливовий пиріг',
      },
    },
  ],
  relatedRecipeIds: [],
  sources: [
    {
      id: 'plum-cake-recorded-source',
      file: 'media/recipes/plum-cake/REVISION-2026-09-25.md',
      locator:
        'Author butter-cake revision 2026-09-25; final sugar allocation and editorial revision confirmed 2026-09-26',
    },
  ],
  contentGaps: [
    {
      id: 'plum-cake-geometry-gap',
      area: 'form',
      field: 'geometry.default',
      question: 'Geometry is not recorded.',
      text: {
        en: 'Geometry is not recorded.',
        es: 'El molde no está registrado.',
        uk: 'Форму не записано.',
      },
      publicationBlocking: false,
      sourceIds: ['plum-cake-recorded-source'],
    },
  ],
  presentation: 'concise',
  evidenceExplanation: {
    en: 'This exact version was baked successfully.',
    es: 'Esta versión exacta se ha horneado correctamente.',
    uk: 'Цю версію успішно приготували.',
  },
  searchMetadata: {
    datePublished: null,
    dateModified: '2026-09-27',
    cookTimeMinutes: 30,
    recipeCuisine: {
      uk: null,
      en: null,
      es: null,
    },
    keywords: {
      uk: ['Безглютеновий сливовий пиріг'],
      en: ['Gluten-free plum sponge cake'],
      es: ['Bizcocho de ciruelas sin gluten'],
    },
  },
  discovery: {
    cardTitle: {
      en: 'Plum sponge cake',
      es: 'Bizcocho de ciruelas',
      uk: 'Сливовий пиріг',
    },
    category: {
      en: 'Everyday cake',
      es: 'Bizcocho cotidiano',
      uk: 'Пиріг на щодень',
    },
    flourSummary: {
      en: 'Schär Mix B Bread + tapioca starch',
      es: 'Schär Mix B Bread + almidón de tapioca',
      uk: 'Schär Mix B Bread + тапіоковий крохмаль',
    },
    collectionIds: ['everyday'],
    catalogue: true,
    imageKind: 'edited-author-photo',
    sourceTitle: 'Сливовий пиріг',
    launchPriority: 'Medium',
    heroCandidate: 'Possible',
    source:
      'Author recipe revision and 13 original process/result photographs, 2026-09-25',
    archiveSections: [
      {
        title: 'Ingredients · author revision 2026-09-25',
        content:
          '400 г слив, 5 невеликих яєць, 100 г цукру, 120 г Schär Mix B Bread, 15 г тапіокового крохмалю, 5 г ксантанової камеді (1 ч. л., опціонально), 50 г вершкового масла та трохи для пергаменту, дрібка солі, ванілін.',
      },
      {
        title: 'Method · reviewed version',
        content:
          'Сливи нарізати скибочками та викласти на змащений пергамент. Жовтки збити з 2 ст. л. цукру, білки — з рештою; обережно з’єднати. Після борошна змішати 3–4 ложки тіста з 50 г розтопленого ледь теплого масла, повернути в основне тісто та обережно вмішати. Викласти на сливи. Підготовка 30 хв; випікання 30 хв при 200°C. Перевернути готовий пиріг.',
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
  showImageNote: false,
  seo: {
    uk: {
      title: 'Безглютеновий сливовий пиріг',
      description:
        'Безглютеновий сливовий пиріг із вершковим маслом і соковитими скибочками слив. Пропорції, підготовка тіста та випікання крок за кроком.',
    },
    en: {
      title: 'Gluten-free plum sponge cake',
      description:
        'Gluten-free plum cake with a tender butter sponge and juicy plum wedges. Ingredient quantities, batter preparation and baking instructions.',
    },
    es: {
      title: 'Bizcocho de ciruelas sin gluten',
      description:
        'Bizcocho de ciruelas sin gluten con mantequilla y gajos de fruta jugosos. Cantidades, preparación de la masa y horneado paso a paso.',
    },
  },
  routeSlug: 'plum-cake',
} satisfies Recipe;
