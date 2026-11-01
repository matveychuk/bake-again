import type { Recipe } from './recipe.types.ts';

export const pruneCakeRecipe = {
  schemaVersion: 3,
  id: 'prune-cake',
  versionId: 'prune-cake-24cm-v2',
  publicationStatus: 'published',
  translationState: {
    uk: 'reviewed',
    en: 'reviewed',
    es: 'reviewed',
  },
  slug: {
    en: 'prune-cake',
    es: 'prune-cake',
    uk: 'prune-cake',
  },
  title: {
    en: 'Gluten-free chocolate prune cake',
    es: 'Tarta de chocolate y ciruelas pasas sin gluten',
    uk: 'Безглютеновий торт із чорносливом',
  },
  summary: {
    en: 'Chocolate layers with prune cream, a mound of tender cake pieces and chocolate glaze.',
    es: 'Capas de chocolate con crema de ciruelas pasas, trozos tiernos de bizcocho y cobertura de chocolate.',
    uk: 'Шоколадні коржі з чорносливовим кремом, гіркою ніжних шматочків і шоколадною поливкою.',
  },
  categoryIds: [],
  situationIds: [],
  difficulty: 'medium',
  baseProvenance: {
    state: 'tested',
    sourceIds: ['prune-cake-recorded-source'],
  },
  timing: {
    activeMinutes: 60,
    totalElapsedMinutes: null,
    planningNote: {
      text: {
        en: 'Baking: 50 minutes. Allow extra time for cooling and chilling.',
        es: 'Horneado: 50 minutos. Añade tiempo para enfriar y refrigerar.',
        uk: 'Випікання — 50 хвилин. Додатково потрібен час на охолодження й просочення.',
      },
    },
    phases: [
      {
        id: 'bake-covered',
        label: {
          en: 'Bake covered',
          es: 'Horneado con aluminio',
          uk: 'Випікання під фольгою',
        },
        duration: {
          kind: 'exact',
          value: 30,
          unit: 'minute',
        },
        relatedStepId: 'bake-covered',
      },
      {
        id: 'bake-uncovered',
        label: {
          en: 'Bake uncovered',
          es: 'Horneado sin aluminio',
          uk: 'Випікання без фольги',
        },
        duration: {
          kind: 'exact',
          value: 20,
          unit: 'minute',
        },
        relatedStepId: 'bake-uncovered',
      },
    ],
  },
  yield: {
    default: {
      id: 'one-cake',
      label: {
        en: '1 cake',
        es: '1 tarta',
        uk: '1 торт',
      },
      count: {
        kind: 'exact',
        value: 1,
      },
      unit: 'cake',
      provenance: {
        state: 'tested',
        sourceIds: ['prune-cake-recorded-source'],
      },
      availability: 'default',
    },
    alternatives: [],
  },
  geometry: {
    state: 'known',
    default: {
      id: 'round-24cm',
      label: {
        en: '24 cm round tin',
        es: 'Molde redondo de 24 cm',
        uk: 'Кругла форма 24 см',
      },
      kind: 'bakingPan',
      application: 'bake-in',
      shape: 'round',
      diameterCm: 24,
      layerCount: null,
      material: null,
      provenance: {
        state: 'tested',
        sourceIds: ['prune-cake-recorded-source'],
      },
      availability: 'default',
    },
    alternatives: [],
  },
  configuration: {
    base: {
      geometryId: 'round-24cm',
      yieldId: 'one-cake',
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
      id: 'spatula',
      name: {
        en: 'spatula',
        es: 'espátula',
        uk: 'лопатка',
      },
    },
    {
      id: 'saucepan',
      name: {
        en: 'saucepan',
        es: 'cazo',
        uk: 'каструля',
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
    {
      id: 'foil',
      name: {
        en: 'foil',
        es: 'papel de aluminio',
        uk: 'фольга',
      },
    },
    {
      id: 'rack',
      name: {
        en: 'cooling rack',
        es: 'rejilla',
        uk: 'решітка для охолодження',
      },
    },
  ],
  flourConfiguration: {
    commercialMixLineId: 'flour',
    additionalStarchLineIds: [],
    provenance: {
      state: 'tested',
      sourceIds: ['prune-cake-recorded-source'],
    },
    testedAlternativeMixes: [],
    knownUnsupportedMixes: [],
    basis: 'commercialMix',
  },
  beforeStart: [
    {
      id: 'before-0',
      text: {
        en: 'Use thick yoghurt and sour cream without separated whey.',
        es: 'Usa yogur y nata agria espesos, sin suero separado.',
        uk: 'Йогурт і сметану беріть густі, без відділеної сироватки.',
      },
    },
    {
      id: 'before-1',
      text: {
        en: 'Use the listed cream-base weight for sour cream and Greek yoghurt combined, not that weight of each.',
        es: 'El peso indicado para la base de crema es el de la nata agria y el yogur juntos, no el de cada uno.',
        uk: 'Зазначена маса основи крему — це сметана та йогурт разом, а не така маса кожного продукту.',
      },
    },
  ],
  ingredientSections: [
    {
      id: 'cake',
      title: {
        en: 'Cake',
        es: 'Bizcocho',
        uk: 'Корж',
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
              value: 4,
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
          id: 'greek-yogurt',
          options: [
            {
              ingredientId: 'greek-yogurt',
              name: {
                en: 'Thick Greek yoghurt',
                es: 'Yogur griego espeso',
                uk: 'Густий грецький йогурт',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 200,
              unit: 'g',
            },
            shopping: {
              mode: 'base',
            },
            equivalent: {
              kind: 'exact',
              value: 5,
              unit: 'tbsp',
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
              value: 150,
              unit: 'g',
            },
            equivalent: {
              kind: 'exact',
              value: 7.5,
              unit: 'tbsp',
            },
            shopping: {
              mode: 'base',
            },
          },
        },
        {
          id: 'sunflower-oil',
          options: [
            {
              ingredientId: 'sunflower-oil',
              name: {
                en: 'Sunflower oil',
                es: 'Aceite de girasol',
                uk: 'Соняшникова олія',
              },
            },
          ],
          quantity: {
            base: {
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
          id: 'sweetened-condensed-milk',
          options: [
            {
              ingredientId: 'sweetened-condensed-milk',
              name: {
                en: 'Sweetened condensed milk',
                es: 'Leche condensada azucarada',
                uk: 'Згущене молоко з цукром',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 70,
              unit: 'g',
            },
            shopping: {
              mode: 'base',
            },
            equivalent: {
              kind: 'exact',
              value: 5,
              unit: 'tbsp',
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
              value: 160,
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
          id: 'cocoa',
          options: [
            {
              ingredientId: 'cocoa',
              name: {
                en: 'Unsweetened cocoa powder',
                es: 'Cacao puro sin azúcar',
                uk: 'Какао без цукру',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 65,
              unit: 'g',
            },
            shopping: {
              mode: 'base',
            },
            equivalent: {
              kind: 'exact',
              value: 5,
              unit: 'tbsp',
            },
          },
        },
        {
          id: 'leavener',
          options: [
            {
              ingredientId: 'leavener',
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
              value: 8,
              unit: 'g',
            },
            equivalent: {
              kind: 'exact',
              value: 1.6,
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
      id: 'cream',
      title: {
        en: 'Cream and decoration',
        es: 'Crema y decoración',
        uk: 'Крем і декор',
      },
      lines: [
        {
          id: 'cream-base',
          options: [
            {
              ingredientId: 'cream-base',
              name: {
                en: 'Sour cream and Greek yoghurt',
                es: 'Nata agria y yogur griego',
                uk: 'Сметана та грецький йогурт',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 700,
              unit: 'g',
            },
            shopping: {
              mode: 'base',
            },
          },
          qualifier: {
            en: 'Combined weight of both ingredients.',
            es: 'Peso total de los dos ingredientes.',
            uk: 'Загальна маса обох інгредієнтів.',
          },
        },
        {
          id: 'cream-sugar',
          options: [
            {
              ingredientId: 'cream-sugar',
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
              value: 70,
              unit: 'g',
            },
            equivalent: {
              kind: 'exact',
              value: 3.5,
              unit: 'tbsp',
            },
            shopping: {
              mode: 'base',
            },
          },
        },
        {
          id: 'cream-lemon-juice',
          options: [
            {
              ingredientId: 'cream-lemon-juice',
              name: {
                en: 'Lemon juice',
                es: 'Zumo de limón',
                uk: 'Лимонний сік',
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
          id: 'prunes',
          options: [
            {
              ingredientId: 'prunes',
              name: {
                en: 'Pitted prunes',
                es: 'Ciruelas pasas sin hueso',
                uk: 'Чорнослив без кісточок',
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
        },
        {
          id: 'nuts',
          options: [
            {
              ingredientId: 'nuts',
              name: {
                en: 'Walnuts or pecans',
                es: 'Nueces o pacanas',
                uk: 'Волоські горіхи або пекан',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 30,
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
      id: 'glaze',
      title: {
        en: 'Chocolate glaze',
        es: 'Glaseado de chocolate',
        uk: 'Шоколадна глазур',
      },
      lines: [
        {
          id: 'glaze-sour-cream',
          options: [
            {
              ingredientId: 'glaze-sour-cream',
              name: {
                en: 'Sour cream or cream',
                es: 'Nata agria o nata',
                uk: 'Сметана або вершки',
              },
            },
          ],
          quantity: {
            base: {
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
          id: 'glaze-sugar',
          options: [
            {
              ingredientId: 'glaze-sugar',
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
          id: 'glaze-cocoa',
          options: [
            {
              ingredientId: 'glaze-cocoa',
              name: {
                en: 'Cocoa',
                es: 'Cacao',
                uk: 'Какао',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 10,
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
              value: 50,
              unit: 'g',
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
      id: 'prepare-pan',
      title: {
        en: 'Prepare the oven and tin',
        es: 'Prepara el horno y el molde',
        uk: 'Підготуйте духовку й форму',
      },
      instruction: {
        en: 'Preheat the oven to 200°C. Line the base of the 24 cm round tin with parchment. Have a sheet of foil ready to cover the tin loosely.',
        es: 'Precalienta el horno a 200°C. Forra la base del molde redondo de 24 cm con papel de horno. Prepara una hoja de aluminio para cubrir el molde sin ajustarla.',
        uk: 'Розігрійте духовку до 200°C. Дно круглої форми 24 см застеліть пергаментом. Підготуйте лист фольги, щоб вільно накрити форму зверху.',
      },
      ingredientLineIds: [],
      guidance: [],
      equipmentIds: ['parchment', 'foil'],
      temperature: {
        value: 200,
        unit: 'C',
        ovenMode: null,
      },
    },
    {
      id: 'whip-eggs',
      title: {
        en: 'Whip the eggs and sugar',
        es: 'Bate los huevos con el azúcar',
        uk: 'Збийте яйця з цукром',
      },
      instruction: {
        en: 'Beat the whole eggs with the sugar until pale, thick and increased in volume.',
        es: 'Bate los huevos enteros con el azúcar hasta obtener una mezcla clara, espesa y con más volumen.',
        uk: 'Збийте цілі яйця з цукром до світлої густої маси, що помітно збільшилася в об’ємі.',
      },
      ingredientLineIds: ['eggs', 'sugar'],
      guidance: [
        {
          id: 'whip-eggs-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The mixture falls from the whisk in a ribbon that remains on the surface for a few seconds.',
            es: 'La mezcla cae de las varillas formando una cinta que queda visible unos segundos.',
            uk: 'Маса стікає з вінчика стрічкою, слід від якої видно на поверхні кілька секунд.',
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
      mediaIds: ['prune-cake-whipped-eggs-author-v1'],
    },
    {
      id: 'add-wet',
      title: {
        en: 'Fold in the wet ingredients',
        es: 'Incorpora los ingredientes húmedos',
        uk: 'Додайте йогурт, олію та згущене молоко',
      },
      instruction: {
        en: 'Mix the yoghurt, oil and condensed milk separately. Stir a little egg mixture into them, then gently fold this back into the remaining eggs with a spatula.',
        es: 'Mezcla aparte el yogur, el aceite y la leche condensada. Añade un poco de huevo batido y después incorpora todo al resto del huevo con una espátula y movimientos envolventes.',
        uk: 'Окремо змішайте йогурт, олію та згущене молоко. Вмішайте трохи яєчної маси, потім обережно з’єднайте з рештою збитих яєць лопаткою.',
      },
      ingredientLineIds: [
        'greek-yogurt',
        'sunflower-oil',
        'sweetened-condensed-milk',
      ],
      guidance: [],
      cook: {
        ingredients: [
          {
            ingredientId: 'greek-yogurt',
          },
          {
            ingredientId: 'sunflower-oil',
          },
          {
            ingredientId: 'sweetened-condensed-milk',
          },
        ],
      },
      equipmentIds: ['spatula'],
    },
    {
      id: 'finish-batter',
      title: {
        en: 'Fold in the dry ingredients',
        es: 'Incorpora los ingredientes secos',
        uk: 'Вмішайте сухі інгредієнти',
      },
      instruction: {
        en: 'Mix the flour, cocoa and baking powder. Sift into the wet mixture in several additions and fold with a spatula, lifting from the bottom, just until evenly combined.',
        es: 'Mezcla la harina, el cacao y la levadura química. Tamiza sobre la mezcla húmeda en varias tandas e incorpora con una espátula desde el fondo hasta que quede uniforme.',
        uk: 'Змішайте борошно, какао й розпушувач. Просійте в рідку суміш у кілька прийомів і вмішайте лопаткою знизу вгору до однорідності.',
      },
      ingredientLineIds: ['flour', 'cocoa', 'leavener'],
      guidance: [
        {
          id: 'finish-batter-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'No dry flour or cocoa pockets remain, including at the bottom of the bowl.',
            es: 'No quedan bolsas de harina ni cacao seco, tampoco en el fondo del bol.',
            uk: 'У тісті немає сухих грудочок борошна чи какао, зокрема на дні миски.',
          },
        },
      ],
      cook: {
        ingredients: [
          {
            ingredientId: 'flour',
          },
          {
            ingredientId: 'cocoa',
          },
          {
            ingredientId: 'leavener',
          },
        ],
      },
      mediaIds: ['prune-cake-chocolate-batter-author-v1'],
      equipmentIds: ['spatula'],
    },
    {
      id: 'bake-covered',
      title: {
        en: 'Bake loosely covered with foil',
        es: 'Hornea con aluminio por encima',
        uk: 'Випікайте під фольгою',
      },
      instruction: {
        en: 'Transfer the batter to the prepared tin and level it. Lay the foil loosely over the top without sealing the edges or pressing it onto the batter. Put the tin straight into the preheated oven and bake for 30 minutes.',
        es: 'Pasa la masa al molde y alisa la superficie. Coloca el aluminio por encima sin sellar los bordes ni apoyarlo sobre la masa. Introduce enseguida en el horno caliente y hornea 30 minutos.',
        uk: 'Перекладіть тісто у форму й розрівняйте. Легенько накрийте фольгою, не притискаючи її до тіста й не загортаючи краї щільно. Одразу поставте в розігріту духовку та випікайте 30 хвилин.',
      },
      ingredientLineIds: [],
      guidance: [],
      displayMeta: {
        en: '200°C · 30 min',
        es: '200°C · 30 min',
        uk: '200°C · 30 хв',
      },
      temperature: {
        value: 200,
        unit: 'C',
        ovenMode: null,
      },
      equipmentIds: ['foil'],
      durationPhaseId: 'bake-covered',
    },
    {
      id: 'bake-uncovered',
      title: {
        en: 'Remove the foil and finish baking',
        es: 'Retira el aluminio y termina de hornear',
        uk: 'Зніміть фольгу й допечіть',
      },
      instruction: {
        en: 'Carefully remove the foil and bake for another 20 minutes at the same temperature. Check the centre; if the skewer has wet batter on it, bake a little longer and check again.',
        es: 'Retira el aluminio con cuidado y hornea otros 20 minutos a la misma temperatura. Comprueba el centro; si el palillo sale con masa cruda, hornea un poco más y vuelve a comprobar.',
        uk: 'Обережно зніміть фольгу й випікайте ще 20 хвилин за тієї самої температури. Перевірте середину: якщо на шпажці є сире тісто, допечіть і перевірте ще раз.',
      },
      ingredientLineIds: [],
      guidance: [
        {
          id: 'bake-uncovered-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The centre springs back gently and a skewer comes out without wet batter.',
            es: 'El centro recupera la forma al tocarlo suavemente y el palillo sale sin masa cruda.',
            uk: 'Середина злегка пружинить, шпажка виходить без сирого тіста.',
          },
        },
      ],
      displayMeta: {
        en: '200°C · 20 min',
        es: '200°C · 20 min',
        uk: '200°C · 20 хв',
      },
      temperature: {
        value: 200,
        unit: 'C',
        ovenMode: null,
      },
      equipmentIds: ['foil'],
      durationPhaseId: 'bake-uncovered',
    },
    {
      id: 'cool-and-slice',
      title: {
        en: 'Cool completely and slice',
        es: 'Deja enfriar y corta las capas',
        uk: 'Остудіть і розріжте корж',
      },
      instruction: {
        en: 'Let the cake cool until it can be removed from the tin, then finish cooling on a rack. Once completely cold, slice horizontally into two layers. Trim a strip about 1 cm wide from the edge all the way around both layers. Cut the trimmings into small pieces and set aside in a bowl for the topping.',
        es: 'Deja que el bizcocho se temple antes de desmoldarlo y termina de enfriarlo sobre una rejilla. Cuando esté completamente frío, córtalo en dos capas horizontales. Recorta una tira de aproximadamente 1 cm de ancho alrededor de ambas capas. Corta los recortes en trozos pequeños y resérvalos en un bol para la cobertura.',
        uk: 'Дайте коржу трохи охолонути у формі, потім вийміть і повністю остудіть на решітці. Розріжте горизонтально на два коржі. Обріжте приблизно по 1 см від краю кожного коржа по всьому колу. Обрізки наріжте невеликими шматочками та відкладіть у миску для верхньої гірки.',
      },
      ingredientLineIds: [],
      guidance: [
        {
          id: 'cool-and-slice-tip',
          kind: 'practicalTip',
          text: {
            en: 'Only spread cream on completely cold cake.',
            es: 'Añade la crema solo cuando el bizcocho esté completamente frío.',
            uk: 'Наносьте крем лише на повністю холодні коржі.',
          },
        },
      ],
      mediaIds: [
        'prune-cake-sliced-crumb-author-v1',
        'prune-cake-trimmed-edge-author-v1',
        'prune-cake-cake-trimmings-author-v1',
      ],
      equipmentIds: ['bowl', 'rack'],
    },
    {
      id: 'make-cream',
      title: {
        en: 'Make the cream and chop the prunes',
        es: 'Prepara la crema y las ciruelas pasas',
        uk: 'Приготуйте крем і чорнослив',
      },
      instruction: {
        en: 'Mix the sour cream and Greek yoghurt with the sugar and lemon juice until smooth and the sugar has dissolved. Chop the prunes, reserve a little for decoration and fold the rest into the cream. Keep chilled until assembly.',
        es: 'Mezcla la nata agria y el yogur griego con el azúcar y el zumo de limón hasta que quede homogéneo y se disuelva el azúcar. Pica las ciruelas pasas, reserva unas pocas para decorar e incorpora el resto a la crema. Guarda en la nevera hasta montar.',
        uk: 'Змішайте сметану та грецький йогурт із цукром і лимонним соком до однорідності й розчинення цукру. Наріжте чорнослив, трохи відкладіть для декору, решту вмішайте в крем. До складання тримайте в холодильнику.',
      },
      ingredientLineIds: [
        'cream-base',
        'cream-sugar',
        'cream-lemon-juice',
        'prunes',
        'nuts',
      ],
      guidance: [
        {
          id: 'make-cream-tip',
          kind: 'practicalTip',
          text: {
            en: 'Make the cream while the cake cools. Chop the nuts for the topping too.',
            es: 'Prepara la crema mientras se enfría el bizcocho. Pica también los frutos secos para decorar.',
            uk: 'Крем можна приготувати, поки корж остигає. Тоді ж подрібніть горіхи для декору.',
          },
        },
      ],
      cook: {
        ingredients: [
          {
            ingredientId: 'cream-base',
          },
          {
            ingredientId: 'cream-sugar',
          },
          {
            ingredientId: 'cream-lemon-juice',
          },
          {
            ingredientId: 'prunes',
          },
          {
            ingredientId: 'nuts',
          },
        ],
      },
      mediaIds: ['prune-cake-chopped-prunes-author-v1'],
    },
    {
      id: 'stack-layers',
      title: {
        en: 'Layer the cake with prune cream',
        es: 'Monta las capas con crema de ciruelas pasas',
        uk: 'Перемастіть коржі кремом із чорносливом',
      },
      instruction: {
        en: 'Place one cake layer on a serving plate and spread with sour cream and prune filling. Place the second layer on top and cover it with filling too. Reserve the remaining cream to mix with the cake trimmings.',
        es: 'Coloca una capa en un plato y úntala con crema de nata agria y ciruelas pasas. Pon la segunda encima y cúbrela también con crema. Reserva la crema restante para mezclarla con los recortes.',
        uk: 'Покладіть один корж на тарілку й змастіть сметанним кремом із чорносливом. Покладіть зверху другий корж і теж змастіть кремом із чорносливом. Решту крему залиште для обрізків.',
      },
      ingredientLineIds: [],
      guidance: [],
    },
    {
      id: 'assemble-mound',
      title: {
        en: 'Add the cream-coated cake pieces',
        es: 'Añade los trozos de bizcocho con crema',
        uk: 'Викладіть шматочки коржа з кремом',
      },
      instruction: {
        en: 'Gently mix the reserved cake trimmings with the remaining cream. Pile them onto the top cake layer without pressing down.',
        es: 'Mezcla con cuidado los recortes reservados con la crema restante. Colócalos formando un montículo sobre la capa superior, sin aplastarlos.',
        uk: 'Обережно перемішайте відкладені шматочки бокових обрізків із рештою крему. Викладіть гіркою на верхній корж, не утрамбовуючи.',
      },
      ingredientLineIds: [],
      guidance: [
        {
          id: 'assemble-mound-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'Each piece is coated in cream and the mound holds together.',
            es: 'Cada trozo queda cubierto de crema y el conjunto mantiene la forma.',
            uk: 'Кожен шматочок укритий кремом, верхівка тримається разом.',
          },
        },
      ],
      mediaIds: [
        'prune-cake-cream-coated-pieces-author-v1',
        'prune-cake-assembled-cake-author-v1',
      ],
    },
    {
      id: 'glaze-and-decorate',
      title: {
        en: 'Glaze, decorate and chill',
        es: 'Glasea, decora y enfría',
        uk: 'Полийте глазур’ю та прикрасьте',
      },
      instruction: {
        en: 'Combine the sour cream or cream, sugar, cocoa and butter in a small saucepan. Warm over low heat, stirring constantly, until completely smooth. Do not let it boil or allow the butter to separate. Let the glaze cool until warm but still pourable, then pour over the cake. Scatter over the reserved prunes and chopped nuts. Refrigerate the cake to let the layers absorb the cream and the glaze set; keep chilled until serving.',
        es: 'Pon la nata agria o nata, el azúcar, el cacao y la mantequilla en un cazo pequeño. Calienta a fuego bajo, removiendo constantemente, hasta que quede completamente homogéneo. No dejes que hierva ni que la mantequilla se separe. Deja que el glaseado se temple sin perder fluidez y viértelo sobre la tarta. Añade las ciruelas reservadas y los frutos secos picados. Guarda la tarta en la nevera para que las capas absorban la crema y el glaseado se asiente; mantenla refrigerada hasta servir.',
        uk: 'У невеликій каструльці з’єднайте сметану або вершки, цукор, какао й масло. Прогрівайте на маленькому вогні, постійно помішуючи, до повної однорідності. Не доводьте до кипіння й не допускайте, щоб масло розшарувалося. Дайте глазурі охолонути до теплої, поки вона ще ллється, і полийте торт. Прикрасьте відкладеним чорносливом та подрібненими горіхами. Поставте в холодильник, щоб коржі просочилися, а глазур схопилася. До подачі зберігайте охолодженим.',
      },
      ingredientLineIds: [
        'glaze-sour-cream',
        'glaze-sugar',
        'glaze-cocoa',
        'butter',
      ],
      guidance: [],
      cook: {
        ingredients: [
          {
            ingredientId: 'glaze-sour-cream',
          },
          {
            ingredientId: 'glaze-sugar',
          },
          {
            ingredientId: 'glaze-cocoa',
          },
          {
            ingredientId: 'butter',
          },
        ],
      },
      mediaIds: ['prune-cake-finished-author-v2'],
      equipmentIds: ['saucepan'],
    },
  ],
  storage: null,
  makeAhead: null,
  variations: [],
  heroMediaId: 'prune-cake-finished-author-v2',
  media: [
    {
      id: 'prune-cake-whipped-eggs-author-v1',
      type: 'image',
      path: '/media/recipes/prune-cake/selected/whipped-eggs-author-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Pale whipped eggs falling from the whisk in a ribbon',
        es: 'Huevos batidos claros que caen de las varillas formando una cinta',
        uk: 'Світла збита яєчна маса стікає з вінчика стрічкою',
      },
    },
    {
      id: 'prune-cake-chocolate-batter-author-v1',
      type: 'image',
      path: '/media/recipes/prune-cake/selected/chocolate-batter-author-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Chocolate batter on a spatula in a metal bowl',
        es: 'Masa de chocolate sobre una espátula en un bol metálico',
        uk: 'Шоколадне тісто на лопатці в металевій мисці',
      },
    },
    {
      id: 'prune-cake-sliced-crumb-author-v1',
      type: 'image',
      path: '/media/recipes/prune-cake/selected/sliced-crumb-author-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Cut chocolate cake layer',
        es: 'Capa de bizcocho de chocolate cortada',
        uk: 'Шоколадний корж у розрізі',
      },
    },
    {
      id: 'prune-cake-trimmed-edge-author-v1',
      type: 'image',
      path: '/media/recipes/prune-cake/selected/trimmed-edge-author-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Knife cutting a narrow strip around the cake edge',
        es: 'Cuchillo recortando una tira del borde del bizcocho',
        uk: 'Ніж обрізає вузьку смужку по краю коржа',
      },
    },
    {
      id: 'prune-cake-cake-trimmings-author-v1',
      type: 'image',
      path: '/media/recipes/prune-cake/selected/cake-trimmings-author-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Cake edge trimmings in a white bowl',
        es: 'Recortes de bizcocho en un bol blanco',
        uk: 'Бокові обрізки коржа в білій мисці',
      },
    },
    {
      id: 'prune-cake-chopped-prunes-author-v1',
      type: 'image',
      path: '/media/recipes/prune-cake/selected/chopped-prunes-author-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Chopped prunes in a glass bowl',
        es: 'Ciruelas pasas picadas en un bol de cristal',
        uk: 'Нарізаний чорнослив у скляній мисці',
      },
    },
    {
      id: 'prune-cake-cream-coated-pieces-author-v1',
      type: 'image',
      path: '/media/recipes/prune-cake/selected/cream-coated-pieces-author-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Chocolate cake pieces coated in cream in a white bowl',
        es: 'Trozos de bizcocho de chocolate recubiertos de crema en un bol blanco',
        uk: 'Шматочки шоколадного коржа в кремі у білій мисці',
      },
    },
    {
      id: 'prune-cake-assembled-cake-author-v1',
      type: 'image',
      path: '/media/recipes/prune-cake/selected/assembled-cake-author-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Assembled cake with cream-coated pieces before glazing',
        es: 'Tarta montada con trozos de bizcocho y crema antes del glaseado',
        uk: 'Зібраний торт зі шматочками коржа в кремі перед глазуруванням',
      },
    },
    {
      id: 'prune-cake-finished-author-v2',
      type: 'image',
      path: '/images/recipes/prune-cake-tea-editorial-v3.webp',
      usage: ['step', 'hero'],
      alt: {
        en: 'Chocolate prune cake with cream, chocolate glaze and chopped nuts',
        es: 'Tarta de chocolate y ciruelas pasas con crema, glaseado y frutos secos picados',
        uk: 'Торт із чорносливом, кремом, шоколадною глазур’ю та подрібненими горіхами',
      },
      heroAlt: {
        en: 'Chocolate prune cake with a mound of cream-coated cake pieces, glaze and nuts',
        es: 'Tarta de chocolate y ciruelas pasas con trozos de bizcocho en crema, cobertura y frutos secos',
        uk: 'Шоколадний торт із гіркою шматочків у кремі, поливкою, чорносливом і горіхами',
      },
    },
  ],
  relatedRecipeIds: ['chocolate-glaze'],
  sources: [
    {
      id: 'prune-cake-recorded-source',
      file: 'docs/content-model/prune-cake-author-notes.md',
      locator:
        'Author bake, weighed spoon equivalents, original photographs and oven clarification · 2026-09-26',
    },
  ],
  contentGaps: [],
  presentation: 'concise',
  evidenceExplanation: {
    en: 'Schär Mix B · 24 cm tin.',
    es: 'Schär Mix B · molde de 24 cm.',
    uk: 'Schär Mix B · форма 24 см.',
  },
  searchMetadata: {
    datePublished: null,
    dateModified: '2026-10-05',
    cookTimeMinutes: 50,
    recipeCuisine: {
      uk: 'Українська кухня',
      en: 'Ukrainian',
      es: 'Ucraniana',
    },
    keywords: {
      uk: ['Безглютеновий торт із чорносливом'],
      en: ['Gluten-free chocolate prune cake'],
      es: ['Tarta de chocolate y ciruelas pasas sin gluten'],
    },
  },
  discovery: {
    cardTitle: {
      en: 'Chocolate prune cake',
      es: 'Tarta de chocolate y ciruelas pasas',
      uk: 'Торт із чорносливом',
    },
    category: {
      en: 'Cakes',
      es: 'Tartas',
      uk: 'Торти',
    },
    flourSummary: {
      en: 'Schär Mix B Bread',
      es: 'Schär Mix B Bread',
      uk: 'Schär Mix B Bread',
    },
    collectionIds: ['celebration'],
    catalogue: true,
    imageKind: 'edited-author-photo',
    sourceTitle: 'Торт з чорносливом',
    launchPriority: 'Medium',
    heroCandidate: 'No',
    source: 'Author bake and original photographs · 2026-09-26',
    archiveSections: [
      {
        title: 'Ingredients · author clarification',
        content:
          '4 яйця\nГрецький йогурт — 250 г (2 баночки по 125 г)\nЦукор — 1 склянка, приблизно 200 г\nСоняшникова олія — 2 ст. л.\nЗгущене молоко — 5–6 ст. л.\nРозпушувач — 2 ч. л.\nКакао — 5 ст. л., 25 г\nБорошно Schär Mix B Bread — 5 ст. л., 100 г',
      },
      {
        title: 'Method · author clarification',
        content:
          'Збити яйця з цукром; додати грецький йогурт, олію і згущене молоко. Додати змішані розпушувач, какао й борошно. Випікати у формі 26 см за 200°C: 30 хв під фольгою і 30 хв без неї. Остудити й розрізати на три коржі.\n\nКрем: 400 г сметани або грецького йогурту, цукор до смаку та більша частина зі 150 г чорносливу. Третій корж порізати квадратами, змішати з рештою крему й викласти зверху. Для поливки прогріти сметану або вершки, цукор, какао й масло разом у каструльці, не доводячи до кипіння. Гарячою полити торт, прикрасити рештою чорносливу та підсушеними волоськими горіхами або пеканом.',
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
      title: 'Безглютеновий торт із чорносливом',
      description:
        'Безглютеновий шоколадний торт із чорносливовим кремом і глазур’ю. Покрокове приготування коржів, начинки та складання торта.',
    },
    en: {
      title: 'Gluten-free chocolate prune cake',
      description:
        'Gluten-free chocolate cake with prune cream and chocolate glaze. Follow the steps for baking the layers, making the filling and assembling the cake.',
    },
    es: {
      title: 'Tarta de chocolate y ciruelas pasas sin gluten',
      description:
        'Tarta de chocolate sin gluten con crema de ciruelas pasas y glaseado. Bizcocho, relleno y montaje explicados paso a paso.',
    },
  },
  routeSlug: 'prune-cake',
} satisfies Recipe;
