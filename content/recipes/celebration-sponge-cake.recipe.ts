import type { Recipe } from './recipe.types.ts';

export const celebrationSpongeCakeRecipe = {
  schemaVersion: 3,
  id: 'celebration-sponge-cake',
  versionId: 'celebration-sponge-cake-source-v1',
  publicationStatus: 'published',
  translationState: {
    uk: 'reviewed',
    en: 'reviewed',
    es: 'reviewed',
  },
  slug: {
    en: 'celebration-sponge-cake',
    es: 'celebration-sponge-cake',
    uk: 'celebration-sponge-cake',
  },
  title: {
    en: 'Gluten-free celebration cake',
    es: 'Tarta de celebración sin gluten',
    uk: 'Безглютеновий святковий торт',
  },
  summary: {
    en: 'Tall, tender and made for a celebration, with generous sour cream filling, chocolate drips and fresh fruit.',
    es: 'Alta, tierna y festiva, con abundante crema de nata agria, chorritos de chocolate y fruta fresca.',
    uk: 'Високий, ніжний і по-домашньому святковий — зі щедрим сметанним кремом, шоколадними потьоками та свіжими фруктами.',
  },
  categoryIds: [],
  situationIds: [],
  difficulty: 'medium',
  baseProvenance: {
    state: 'tested',
    sourceIds: ['celebration-sponge-cake-recorded-source'],
  },
  timing: {
    activeMinutes: 90,
    totalElapsedMinutes: null,
    planningNote: {
      text: {
        en: 'Let the sponge cool completely before assembling the cake.',
        es: 'Deja enfriar por completo el bizcocho antes de montar la tarta.',
        uk: 'Перед збиранням дайте бісквіту повністю охолонути.',
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
          min: 60,
          max: 70,
          unit: 'minute',
        },
        relatedStepId: 'sponge-bake',
      },
      {
        id: 'foil-reminder',
        label: {
          en: 'Cover the top with foil',
          es: 'Cubrir con aluminio',
          uk: 'Накрити верх фольгою',
        },
        duration: {
          kind: 'exact',
          value: 30,
          unit: 'minute',
        },
        relatedStepId: 'sponge-bake',
      },
      {
        id: 'oven-cooling',
        label: {
          en: 'Cooling in the switched-off oven',
          es: 'Enfriado en el horno apagado',
          uk: 'Охолодження у вимкненій духовці',
        },
        duration: {
          kind: 'range',
          min: 10,
          max: 15,
          unit: 'minute',
        },
        relatedStepId: 'sponge-cool-and-slice',
      },
    ],
  },
  yield: {
    default: {
      id: 'one-tall-cake',
      label: {
        en: '1 tall cake · 24 cm',
        es: '1 tarta alta · 24 cm',
        uk: '1 високий торт · 24 см',
      },
      count: {
        kind: 'exact',
        value: 1,
      },
      unit: 'cake',
      provenance: {
        state: 'tested',
        sourceIds: ['celebration-sponge-cake-recorded-source'],
      },
      availability: 'default',
    },
    alternatives: [],
  },
  geometry: {
    state: 'known',
    default: {
      id: 'round-24',
      label: {
        en: '24 cm',
        es: '24 cm',
        uk: '24 см',
      },
      kind: 'bakingPan',
      application: 'bake-in',
      shape: 'round',
      diameterCm: 24,
      layerCount: null,
      material: null,
      provenance: {
        state: 'tested',
        sourceIds: ['celebration-sponge-cake-recorded-source'],
      },
      availability: 'default',
    },
    alternatives: [],
  },
  configuration: {
    base: {
      geometryId: 'round-24',
      yieldId: 'one-tall-cake',
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
            ingredientLineId: 'sponge-eggs',
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
      id: 'saucepan',
      name: {
        en: 'saucepan',
        es: 'cazo',
        uk: 'каструля',
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
      id: 'piping-bag',
      name: {
        en: 'piping bag',
        es: 'manga pastelera',
        uk: 'кондитерський мішок',
      },
    },
  ],
  flourConfiguration: {
    commercialMixLineId: 'sponge-flour',
    additionalStarchLineIds: ['sponge-corn-starch', 'sponge-tapioca'],
    provenance: {
      state: 'tested',
      sourceIds: ['celebration-sponge-cake-recorded-source'],
    },
    testedAlternativeMixes: [],
    knownUnsupportedMixes: [],
    basis: 'commercialMix',
  },
  beforeStart: [],
  ingredientSections: [
    {
      id: 'sponge-sponge',
      title: {
        en: 'Sponge cake',
        es: 'Bizcocho',
        uk: 'Бісквіт',
      },
      lines: [
        {
          id: 'sponge-eggs',
          options: [
            {
              ingredientId: 'sponge-eggs',
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
              value: 8,
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
          id: 'sponge-sugar-whites',
          options: [
            {
              ingredientId: 'sponge-sugar-whites',
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
          id: 'sponge-sugar-yolks',
          options: [
            {
              ingredientId: 'sponge-sugar-yolks',
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
              value: 60,
              unit: 'g',
            },
            equivalent: {
              kind: 'exact',
              value: 3,
              unit: 'tbsp',
            },
            shopping: {
              mode: 'base',
            },
          },
        },
        {
          id: 'sponge-corn-starch',
          options: [
            {
              ingredientId: 'sponge-corn-starch',
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
              value: 21,
              unit: 'g',
            },
            equivalent: {
              kind: 'exact',
              value: 3,
              unit: 'tbsp',
            },
            shopping: {
              mode: 'base',
            },
          },
        },
        {
          id: 'sponge-tapioca',
          options: [
            {
              ingredientId: 'sponge-tapioca',
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
          id: 'sponge-flour',
          options: [
            {
              ingredientId: 'sponge-flour',
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
              value: 240,
              unit: 'g',
            },
            equivalent: {
              kind: 'exact',
              value: 12,
              unit: 'tbsp',
            },
            shopping: {
              mode: 'base',
            },
          },
        },
        {
          id: 'sponge-salt',
          options: [
            {
              ingredientId: 'sponge-salt',
              name: {
                en: 'Salt',
                es: 'Sal',
                uk: 'Сіль',
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
            en: 'To taste.',
            es: 'Al gusto.',
            uk: 'Додайте до смаку.',
          },
        },
        {
          id: 'sponge-vanilla',
          options: [
            {
              ingredientId: 'sponge-vanilla',
              name: {
                en: 'Vanilla',
                es: 'Vainilla',
                uk: 'Ваніль',
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
            en: 'To taste.',
            es: 'Al gusto.',
            uk: 'Додайте до смаку.',
          },
        },
      ],
    },
    {
      id: 'filling-sour-cream',
      title: {
        en: 'Sour cream filling',
        es: 'Crema de nata agria',
        uk: 'Сметанний крем',
      },
      lines: [
        {
          id: 'filling-sour-cream',
          options: [
            {
              ingredientId: 'filling-sour-cream',
              name: {
                en: 'Sour cream',
                es: 'Nata agria',
                uk: 'Сметана',
              },
            },
          ],
          quantity: {
            base: {
              kind: 'exact',
              value: 500,
              unit: 'g',
            },
            shopping: {
              mode: 'base',
            },
          },
        },
        {
          id: 'filling-sugar',
          options: [
            {
              ingredientId: 'filling-sugar',
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
              value: 60,
              unit: 'g',
            },
            equivalent: {
              kind: 'exact',
              value: 3,
              unit: 'tbsp',
            },
            shopping: {
              mode: 'base',
            },
          },
        },
        {
          id: 'filling-lemon-juice',
          options: [
            {
              ingredientId: 'filling-lemon-juice',
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
          optional: true,
          qualifier: {
            en: 'Optional, for a citrus aroma and extra tang.',
            es: 'Opcional, para dar aroma y un toque ácido.',
            uk: 'За бажанням, для аромату й легкої кислинки.',
          },
        },
      ],
    },
    {
      id: 'buttercream-buttercream',
      title: {
        en: 'Buttercream',
        es: 'Crema de mantequilla',
        uk: 'Масляний крем',
      },
      lines: [
        {
          id: 'buttercream-butter',
          options: [
            {
              ingredientId: 'buttercream-butter',
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
              value: 200,
              unit: 'g',
            },
            shopping: {
              mode: 'base',
            },
          },
          qualifier: {
            en: 'Soft, at room temperature.',
            es: 'Blanda, a temperatura ambiente.',
            uk: 'М’яке, кімнатної температури.',
          },
        },
        {
          id: 'buttercream-powdered-sugar',
          options: [
            {
              ingredientId: 'buttercream-powdered-sugar',
              name: {
                en: 'Icing sugar',
                es: 'Azúcar glas',
                uk: 'Цукрова пудра',
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
              value: 14.1593,
              unit: 'tbsp',
            },
            shopping: {
              mode: 'base',
            },
          },
        },
        {
          id: 'buttercream-cream-cheese',
          options: [
            {
              ingredientId: 'buttercream-cream-cheese',
              name: {
                en: 'Cream cheese',
                es: 'Queso crema',
                uk: 'Вершковий сир',
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
          optional: true,
          qualifier: {
            en: 'Optional, for a lighter consistency.',
            es: 'Opcional, para una consistencia más ligera.',
            uk: 'За бажанням, для легшої консистенції.',
          },
        },
        {
          id: 'buttercream-lemon-juice',
          options: [
            {
              ingredientId: 'buttercream-lemon-juice',
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
              value: 2,
              unit: 'tbsp',
            },
            shopping: {
              mode: 'base',
            },
          },
        },
        {
          id: 'buttercream-food-colouring',
          options: [
            {
              ingredientId: 'buttercream-food-colouring',
              name: {
                en: 'Food colouring',
                es: 'Colorante alimentario',
                uk: 'Харчовий барвник',
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
            en: 'Optional, just 1 drop.',
            es: 'Opcional, solo 1 gota.',
            uk: 'За бажанням, буквально 1 крапля.',
          },
        },
      ],
    },
    {
      id: 'glaze-glaze',
      title: {
        en: 'Chocolate glaze',
        es: 'Glaseado de chocolate',
        uk: 'Шоколадна глазур',
      },
      lines: [
        {
          id: 'glaze-glaze-sour-cream',
          options: [
            {
              ingredientId: 'glaze-glaze-sour-cream',
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
          id: 'glaze-glaze-sugar',
          options: [
            {
              ingredientId: 'glaze-glaze-sugar',
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
          id: 'glaze-glaze-cocoa',
          options: [
            {
              ingredientId: 'glaze-glaze-cocoa',
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
          id: 'glaze-butter',
          options: [
            {
              ingredientId: 'glaze-butter',
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
    {
      id: 'decoration',
      title: {
        en: 'Decoration',
        es: 'Decoración',
        uk: 'Оздоблення',
      },
      lines: [
        {
          id: 'soak',
          options: [
            {
              ingredientId: 'soak',
              name: {
                en: 'Apple juice or sweet tea',
                es: 'Zumo de manzana o té dulce',
                uk: 'Яблучний сік або солодкий чай',
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
            en: 'Recommended for soaking the layers, especially around the edges.',
            es: 'Recomendado para humedecer las capas, sobre todo en los bordes.',
            uk: 'Рекомендовано для просочення коржів, особливо по краях.',
          },
        },
        {
          id: 'fruit',
          options: [
            {
              ingredientId: 'fruit',
              name: {
                en: 'Fruit or berries',
                es: 'Fruta o frutos rojos',
                uk: 'Фрукти або ягоди',
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
            en: 'For the top and, optionally, both filling layers.',
            es: 'Para la superficie y, si quieres, ambas capas de relleno.',
            uk: 'Для верху та, за бажанням, обох прошарків.',
          },
        },
      ],
    },
  ],
  steps: [
    {
      id: 'sponge-whip-whites',
      title: {
        en: 'Whip the whites',
        es: 'Monta las claras',
        uk: 'Збийте білки',
      },
      instruction: {
        en: 'Separate the eggs. In a clean, dry bowl, whip the whites to a thick white foam using a stand mixer with a whisk attachment, a hand mixer or a balloon whisk. Keep whisking as you add the sugar for the whites in 3–4 batches.',
        es: 'Separa las claras de las yemas. En un bol limpio y seco, monta las claras hasta obtener una espuma blanca y espesa con un robot de cocina con varillas, una batidora de varillas o unas varillas manuales. Añade el azúcar para las claras en 3–4 tandas sin dejar de batir.',
        uk: 'Відокремте білки від жовтків. У чистій сухій мисці збийте білки до густої білої піни — у комбайні з насадкою-вінчиком, міксером або ручним вінчиком. Продовжуючи збивати, за 3–4 рази додайте цукор для білків.',
      },
      ingredientLineIds: ['sponge-eggs', 'sponge-sugar-whites'],
      guidance: [
        {
          id: 'sponge-whip-whites-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The foam is thick and glossy, holds its shape and stays on the lifted whisk.',
            es: 'La espuma está espesa y brillante, mantiene su forma y no gotea al levantar las varillas.',
            uk: 'Піна густа й блискуча, тримає форму та не стікає з піднятого вінчика.',
          },
        },
      ],
      displayMeta: {
        en: 'Sponge',
        es: 'Bizcocho',
        uk: 'Бісквіт',
      },
      cook: {
        ingredients: [
          {
            ingredientId: 'sponge-eggs',
          },
          {
            ingredientId: 'sponge-sugar-whites',
          },
        ],
      },
      mediaIds: ['sponge-whipped-whites-v1'],
      equipmentIds: ['bowl', 'mixer', 'whisk'],
    },
    {
      id: 'sponge-whip-yolks',
      title: {
        en: 'Whip the yolks',
        es: 'Bate las yemas',
        uk: 'Збийте жовтки',
      },
      instruction: {
        en: 'In a separate bowl, beat the yolks with the sugar for the yolks until pale and thick. The mixture should fall from the whisk in a broad ribbon. Add vanilla to the yolks and salt to the dry mixture.',
        es: 'En otro bol, bate las yemas con el azúcar para las yemas hasta obtener una mezcla clara y espesa. Debe caer de las varillas formando una cinta ancha. Añade vainilla a las yemas y sal a la mezcla seca.',
        uk: 'В окремій мисці збийте жовтки з цукром для жовтків до світлої густої маси. Вона має стікати з вінчика широкою стрічкою. Додайте ваніль до жовтків, а сіль — до сухої суміші.',
      },
      ingredientLineIds: ['sponge-sugar-yolks', 'sponge-vanilla'],
      guidance: [],
      displayMeta: {
        en: 'Sponge',
        es: 'Bizcocho',
        uk: 'Бісквіт',
      },
      cook: {
        ingredients: [
          {
            ingredientId: 'sponge-sugar-yolks',
          },
          {
            ingredientId: 'sponge-vanilla',
          },
        ],
      },
      mediaIds: ['sponge-whipped-yolks-v1'],
      equipmentIds: ['bowl', 'whisk'],
    },
    {
      id: 'sponge-fold-dry',
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
      ingredientLineIds: [
        'sponge-corn-starch',
        'sponge-tapioca',
        'sponge-flour',
        'sponge-salt',
      ],
      guidance: [
        {
          id: 'sponge-fold-dry-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The batter is still airy, with no dry lumps or streaks of flour.',
            es: 'La masa sigue aireada, sin grumos secos ni restos de harina.',
            uk: 'Тісто залишається повітряним, без сухих грудочок і смуг борошна.',
          },
        },
      ],
      displayMeta: {
        en: 'Sponge',
        es: 'Bizcocho',
        uk: 'Бісквіт',
      },
      cook: {
        ingredients: [
          {
            ingredientId: 'sponge-corn-starch',
          },
          {
            ingredientId: 'sponge-tapioca',
          },
          {
            ingredientId: 'sponge-flour',
          },
          {
            ingredientId: 'sponge-salt',
          },
        ],
      },
      mediaIds: ['sponge-fold-yolks-v1', 'sponge-fold-dry-v1'],
      equipmentIds: ['bowl', 'spatula'],
    },
    {
      id: 'sponge-bake',
      title: {
        en: 'Bake the sponge',
        es: 'Hornea el bizcocho',
        uk: 'Спечіть бісквіт',
      },
      instruction: {
        en: 'Line the base and sides of a 24 cm round tin with two crossed sheets of foil. Add and level the batter. Bake at 200°C for 60–70 minutes in total. After 30 minutes, loosely lay a piece of foil over the top so it does not overbrown while the middle finishes baking. Check the centre with a toothpick towards the end.',
        es: 'Forra el fondo y los lados de un molde redondo de 24 cm con dos hojas de aluminio cruzadas. Vierte y nivela la masa. Hornea a 200°C durante 60–70 minutos en total. Tras 30 minutos, coloca una hoja de aluminio suelta encima para que no se dore demasiado mientras se cuece el centro. Al final, comprueba el centro con un palillo.',
        uk: 'Вистеліть дно й бортики круглої форми діаметром 24 см двома листами фольги навхрест. Перекладіть тісто та розрівняйте. Випікайте при 200°C загалом 60–70 хвилин. Через 30 хвилин вільно покладіть зверху шматок фольги, щоб верх не пересмажився, поки середина допікається. Наприкінці перевірте середину зубочисткою.',
      },
      ingredientLineIds: [],
      guidance: [
        {
          id: 'sponge-bake-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'A toothpick inserted into the centre comes out dry, with no raw batter. If batter clings to it, keep baking and check again.',
            es: 'El palillo sale seco del centro, sin restos de masa cruda. Si tiene masa adherida, sigue horneando y vuelve a comprobar.',
            uk: 'Зубочистка із середини бісквіта виходить сухою, без слідів сирого тіста. Якщо на ній є тісто, продовжте випікання й перевірте ще раз.',
          },
        },
      ],
      displayMeta: {
        en: '60–70 min · 200°C',
        es: '60–70 min · 200°C',
        uk: '60–70 хв · 200°C',
      },
      mediaIds: ['sponge-batter-round-foil-v2'],
      temperature: {
        value: 200,
        unit: 'C',
        ovenMode: null,
      },
      equipmentIds: ['foil'],
    },
    {
      id: 'sponge-cool-and-slice',
      title: {
        en: 'Cool and slice into layers',
        es: 'Deja enfriar y corta en capas',
        uk: 'Охолодіть і розріжте на коржі',
      },
      instruction: {
        en: 'Once a toothpick from the centre comes out dry, turn off the oven, leave the door slightly open and keep the sponge inside for 10–15 minutes. Remove and cool completely. Remove the tin and foil, then slice horizontally into three layers.',
        es: 'Cuando el palillo del centro salga seco, apaga el horno, entreabre la puerta y deja el bizcocho dentro 10–15 minutos. Sácalo y deja enfriar por completo. Retira el molde y el aluminio y corta horizontalmente en tres capas.',
        uk: 'Коли зубочистка із середини виходить сухою, вимкніть духовку, трохи прочиніть дверцята й залиште бісквіт на 10–15 хвилин. Дістаньте й повністю охолодіть. Зніміть форму та фольгу, а тоді розріжте горизонтально на три коржі.',
      },
      ingredientLineIds: [],
      guidance: [],
      displayMeta: {
        en: 'Sponge',
        es: 'Bizcocho',
        uk: 'Бісквіт',
      },
      equipmentIds: ['foil'],
      durationPhaseId: 'oven-cooling',
    },
    {
      id: 'filling-mix',
      title: {
        en: 'Make the sour cream filling',
        es: 'Prepara la crema de nata agria',
        uk: 'Приготуйте сметанний крем',
      },
      instruction: {
        en: 'Stir the sour cream and sugar with a spoon until smooth. For a lighter filling, beat with a hand mixer or a stand mixer fitted with a whisk. Add the optional lemon juice for a gentle citrus aroma and a little extra tang.',
        es: 'Mezcla la nata agria con el azúcar con una cuchara hasta que quede homogénea. Para una crema más aireada, bate con una batidora de varillas o un robot con varillas. Si quieres, añade el zumo de limón para darle aroma y un toque más ácido.',
        uk: 'Перемішайте сметану з цукром ложкою до однорідності. Якщо хочете більш повітряний крем, збийте його міксером або в комбайні з насадкою-вінчиком. За бажанням додайте лимонний сік: він дасть легкий аромат і підкреслить кислинку.',
      },
      ingredientLineIds: [
        'filling-sour-cream',
        'filling-sugar',
        'filling-lemon-juice',
      ],
      guidance: [
        {
          id: 'filling-mix-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The filling is smooth, without noticeable grains of sugar.',
            es: 'La crema está homogénea, sin granos de azúcar perceptibles.',
            uk: 'Крем однорідний, без відчутних крупинок цукру.',
          },
        },
      ],
      displayMeta: {
        en: 'Creams',
        es: 'Cremas',
        uk: 'Креми',
      },
      cook: {
        ingredients: [
          {
            ingredientId: 'filling-sour-cream',
          },
          {
            ingredientId: 'filling-sugar',
          },
          {
            ingredientId: 'filling-lemon-juice',
          },
        ],
      },
      equipmentIds: ['mixer', 'whisk'],
    },
    {
      id: 'buttercream-beat-buttercream',
      title: {
        en: 'Make the buttercream for the sides and, optionally, flowers on top',
        es: 'Prepara la crema de mantequilla para los laterales y, si quieres, las flores',
        uk: 'Приготуйте масляний крем для боків торта та, за бажанням, квіточок зверху',
      },
      instruction: {
        en: 'Beat the soft butter until pale and fluffy. Add the icing sugar in batches, then gradually beat in the lemon juice. Optionally add cream cheese for a lighter consistency and 1 drop of food colouring.',
        es: 'Bate la mantequilla blanda hasta que esté clara y esponjosa. Añade el azúcar glas por tandas y después incorpora poco a poco el zumo de limón. Si quieres, añade queso crema para una consistencia más ligera y 1 gota de colorante alimentario.',
        uk: 'Збийте м’яке масло до світлої пишної маси. Частинами додайте цукрову пудру, потім поступово вмішайте лимонний сік. За бажанням додайте вершковий сир для легшої консистенції та 1 краплю харчового барвника.',
      },
      ingredientLineIds: [
        'buttercream-butter',
        'buttercream-powdered-sugar',
        'buttercream-cream-cheese',
        'buttercream-lemon-juice',
        'buttercream-food-colouring',
      ],
      technique: {
        id: 'soften-butter',
        condition: 'room-temperature-butter',
      },
      guidance: [
        {
          id: 'buttercream-beat-buttercream-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The buttercream is smooth, fluffy and holds a piped ridge.',
            es: 'La crema está lisa y esponjosa y conserva el relieve de la boquilla.',
            uk: 'Крем гладкий, пишний і тримає рельєф від насадки.',
          },
        },
      ],
      displayMeta: {
        en: 'Creams',
        es: 'Cremas',
        uk: 'Креми',
      },
      cook: {
        ingredients: [
          {
            ingredientId: 'buttercream-butter',
          },
          {
            ingredientId: 'buttercream-powdered-sugar',
          },
          {
            ingredientId: 'buttercream-cream-cheese',
          },
          {
            ingredientId: 'buttercream-lemon-juice',
          },
          {
            ingredientId: 'buttercream-food-colouring',
          },
        ],
      },
    },
    {
      id: 'fill',
      title: {
        en: 'Soak and fill the three sponge layers',
        es: 'Humedece y rellena las tres capas',
        uk: 'Просочіть і перемастіть три коржі',
      },
      instruction: {
        en: 'If needed, lightly soak the sponge layers with apple juice or sweet tea, especially around the edges, so the tall cake is not dry. Place the bottom layer on a plate and generously spread over half the sour cream filling. Add the middle layer and the remaining filling, then the top layer. Use plenty of sour cream filling. Optionally add washed, well-dried fruit or berries, cut into small pieces, to each filling layer.',
        es: 'Si hace falta, humedece ligeramente las capas con zumo de manzana o té dulce, sobre todo en los bordes, para que la tarta alta no quede seca. Pon la capa inferior en un plato y extiende generosamente la mitad de la crema de nata agria. Añade la segunda capa, el resto de la crema y la tercera capa. Debe haber abundante crema. Si quieres, añade a cada relleno fruta lavada, bien seca y cortada en trocitos.',
        uk: 'За потреби злегка просочіть коржі яблучним соком або солодким чаєм, особливо по краях, щоб високий торт не був сухим. Покладіть нижній корж на тарілку й щедро розподіліть на ньому половину сметанного крему. Накрийте другим коржем, додайте решту крему й покладіть третій. Сметанного крему має бути багато. За бажанням додайте в кожен прошарок помиті, добре обсушені та нарізані невеликими шматочками фрукти чи ягоди.',
      },
      ingredientLineIds: ['soak', 'fruit'],
      guidance: [
        {
          id: 'fill-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The layers sit level, the edges are moistened and the filling is generous in both gaps.',
            es: 'Las capas están niveladas, los bordes húmedos y los dos rellenos son abundantes.',
            uk: 'Коржі лежать рівно, краї просочені, а крем щедро розподілений між двома прошарками.',
          },
        },
      ],
      displayMeta: {
        en: 'Assembly and decoration',
        es: 'Montaje y decoración',
        uk: 'Збирання й оздоблення',
      },
      cook: {
        ingredients: [
          {
            ingredientId: 'soak',
          },
          {
            ingredientId: 'fruit',
          },
        ],
      },
      mediaIds: ['three-layer-example'],
    },
    {
      id: 'coat',
      title: {
        en: 'Coat the sides',
        es: 'Cubre los lados con crema',
        uk: 'Покрийте боки кремом',
      },
      instruction: {
        en: 'Optionally reserve some buttercream in a piping bag for flowers. Use the rest to coat the sides thinly. Refrigerate until the coating is firmer before glazing.',
        es: 'Si quieres, reserva crema de mantequilla en una manga para las flores. Usa el resto para cubrir los lados con una capa fina. Refrigera hasta que la cobertura esté más firme antes de glasear.',
        uk: 'За бажанням відкладіть частину масляного крему в кондитерський мішок для квіточок. Рештою тонко покрийте боки торта. Поставте торт у холодильник, щоб покриття стало стійкішим перед глазуруванням.',
      },
      ingredientLineIds: [],
      guidance: [],
      displayMeta: {
        en: 'Assembly and decoration',
        es: 'Montaje y decoración',
        uk: 'Збирання й оздоблення',
      },
      equipmentIds: ['piping-bag'],
    },
    {
      id: 'glaze-combine-ingredients',
      title: {
        en: 'Combine the ingredients in a saucepan',
        es: 'Pon los ingredientes en un cazo',
        uk: 'З’єднайте інгредієнти в каструльці',
      },
      instruction: {
        en: 'Combine the sour cream or cream, sugar, cocoa and butter in a small saucepan.',
        es: 'Pon la nata agria o nata, el azúcar, el cacao y la mantequilla en un cazo pequeño.',
        uk: 'У невеликій каструльці з’єднайте сметану або вершки, цукор, какао й масло.',
      },
      ingredientLineIds: [
        'glaze-glaze-sour-cream',
        'glaze-glaze-sugar',
        'glaze-glaze-cocoa',
        'glaze-butter',
      ],
      guidance: [],
      displayMeta: {
        en: 'Assembly and decoration',
        es: 'Montaje y decoración',
        uk: 'Збирання й оздоблення',
      },
      cook: {
        ingredients: [
          {
            ingredientId: 'glaze-glaze-sour-cream',
          },
          {
            ingredientId: 'glaze-glaze-sugar',
          },
          {
            ingredientId: 'glaze-glaze-cocoa',
          },
          {
            ingredientId: 'glaze-butter',
          },
        ],
      },
      mediaIds: ['chocolate-glaze-ingredients-v1'],
      equipmentIds: ['saucepan'],
    },
    {
      id: 'glaze-warm-until-smooth',
      title: {
        en: 'Warm the glaze',
        es: 'Calienta el glaseado',
        uk: 'Прогрійте глазур',
      },
      instruction: {
        en: 'Warm over low heat, stirring constantly, until completely smooth. Do not let it boil or allow the butter to separate.',
        es: 'Calienta a fuego bajo, removiendo constantemente, hasta que quede completamente homogéneo. No dejes que hierva ni que la mantequilla se separe.',
        uk: 'Прогрівайте на маленькому вогні, постійно помішуючи, до повної однорідності. Не доводьте до кипіння й не допускайте, щоб масло розшарувалося.',
      },
      ingredientLineIds: [],
      guidance: [
        {
          id: 'glaze-warm-until-smooth-checkpoint',
          kind: 'checkpoint',
          text: {
            en: 'The glaze is smooth, without cocoa lumps or unmelted butter.',
            es: 'El glaseado está liso, sin grumos de cacao ni mantequilla sin fundir.',
            uk: 'Глазур гладка, без грудочок какао й нерозтопленого масла.',
          },
        },
      ],
      displayMeta: {
        en: 'Assembly and decoration',
        es: 'Montaje y decoración',
        uk: 'Збирання й оздоблення',
      },
      mediaIds: ['chocolate-glaze-warm-until-smooth-v1'],
    },
    {
      id: 'glaze',
      title: {
        en: 'Glaze the cake',
        es: 'Añade el glaseado',
        uk: 'Полийте торт глазур’ю',
      },
      instruction: {
        en: 'Let the glaze cool until barely warm: it should still flow without melting the cream. Try one drip on the chilled side first. Pour over the top and gently guide it towards the edges to create drips.',
        es: 'Deja enfriar el glaseado hasta que esté apenas templado: debe fluir sin derretir la crema. Prueba primero una gota en el lateral frío. Viértelo sobre la superficie y guíalo hacia los bordes para que caigan algunos chorritos.',
        uk: 'Дайте глазурі охолонути до ледь теплої: вона має ще текти, але не розтоплювати крем. Спершу зробіть пробний потік на охолодженому боці, потім полийте верх і обережно підведіть глазур до країв, щоб утворилися потьоки.',
      },
      ingredientLineIds: [],
      guidance: [],
      displayMeta: {
        en: 'Assembly and decoration',
        es: 'Montaje y decoración',
        uk: 'Збирання й оздоблення',
      },
    },
    {
      id: 'decorate',
      title: {
        en: 'Decorate with fruit and flowers',
        es: 'Decora con fruta y flores',
        uk: 'Прикрасьте фруктами й квіточками',
      },
      instruction: {
        en: 'Once the glaze is no longer warm, optionally pipe buttercream flowers and arrange well-dried fruit or berries on top. Refrigerate the finished cake until serving.',
        es: 'Cuando el glaseado ya no esté templado, forma flores de crema de mantequilla si quieres y coloca fruta bien seca encima. Guarda la tarta en la nevera hasta servir.',
        uk: 'Коли глазур уже не тепла, за бажанням відсадіть квіточки з масляного крему й викладіть зверху добре обсушені фрукти або ягоди. Тримайте готовий торт у холодильнику до подачі.',
      },
      ingredientLineIds: [],
      guidance: [],
      displayMeta: {
        en: 'Assembly and decoration',
        es: 'Montaje y decoración',
        uk: 'Збирання й оздоблення',
      },
      mediaIds: ['author-overhead'],
    },
  ],
  storage: null,
  makeAhead: null,
  variations: [],
  heroMediaId: 'celebration-sponge-cake-hero',
  media: [
    {
      id: 'celebration-sponge-cake-hero',
      type: 'image',
      path: '/media/recipes/celebration-sponge-cake/selected/author-cake-tea-editorial-v2.webp',
      usage: ['hero'],
      alt: {
        en: 'Tall homemade fruit cake with chocolate glaze and cream flowers',
        es: 'Tarta alta con fruta, glaseado de chocolate y flores de crema',
        uk: 'Високий торт із фруктами, шоколадною глазур’ю та кремовими квіточками',
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
    {
      id: 'three-layer-example',
      type: 'image',
      path: '/media/recipes/celebration-sponge-cake/selected/three-layer-cutaway-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Illustrative cut cake with three sponge layers, two sour cream fillings and chocolate glaze',
        es: 'Ejemplo de corte con tres capas de bizcocho, dos rellenos de nata agria y glaseado de chocolate',
        uk: 'Приклад розрізу: три бісквітні коржі, два сметанні прошарки й шоколадна глазур',
      },
    },
    {
      id: 'chocolate-glaze-ingredients-v1',
      type: 'image',
      path: '/media/recipes/chocolate-glaze/selected/step-01-ingredients-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Sour cream, sugar, cocoa and pieces of butter in a small saucepan',
        es: 'Nata agria, azúcar, cacao y trozos de mantequilla en un cazo pequeño',
        uk: 'Сметана, цукор, какао й шматочки масла в невеликій каструльці',
      },
    },
    {
      id: 'chocolate-glaze-warm-until-smooth-v1',
      type: 'image',
      path: '/media/recipes/chocolate-glaze/selected/step-02-warm-until-smooth-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Smooth chocolate glaze being stirred in a saucepan over low heat',
        es: 'Glaseado de chocolate liso removido en un cazo a fuego bajo',
        uk: 'Гладку шоколадну глазур помішують у каструльці на маленькому вогні',
      },
    },
    {
      id: 'author-overhead',
      type: 'image',
      path: '/media/recipes/celebration-sponge-cake/selected/author-cake-overhead-v1.webp',
      usage: ['step'],
      alt: {
        en: 'Cake with chocolate glaze, strawberries, blueberries, grapes and piped flowers',
        es: 'Tarta con chocolate, fresas, arándanos, uvas y flores de crema',
        uk: 'Торт із шоколадною глазур’ю, полуницею, лохиною, виноградом і кремовими квіточками',
      },
    },
  ],
  relatedRecipeIds: ['sponge-cake', 'sour-cream', 'chocolate-glaze'],
  sources: [
    {
      id: 'celebration-sponge-cake-recorded-source',
      file: 'docs/content-model/celebration-cake-author-notes.md',
      locator:
        'Author-confirmed eight-egg formula, 24 cm pan, 200°C for 60–70 min, foil after 30 min, 500 g sour cream for two fillings and revised buttercream',
    },
  ],
  contentGaps: [],
  presentation: 'concise',
  evidenceExplanation: {
    en: 'This version has been baked successfully in a 24 cm tin.',
    es: 'Esta versión se ha horneado con éxito en un molde de 24 cm.',
    uk: 'Цю версію успішно випікали у формі 24 см.',
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
      uk: ['Безглютеновий святковий торт'],
      en: ['Gluten-free celebration cake'],
      es: ['Tarta de celebración sin gluten'],
    },
  },
  discovery: {
    cardTitle: {
      en: 'Celebration cake',
      es: 'Tarta de celebración',
      uk: 'Святковий торт',
    },
    category: {
      en: 'Layer cake',
      es: 'Tarta de capas',
      uk: 'Торт',
    },
    flourSummary: {
      en: 'Schär Mix B Bread + tapioca and corn starch',
      es: 'Schär Mix B Bread + almidones de tapioca y maíz',
      uk: 'Schär Mix B Bread + тапіоковий і кукурудзяний крохмалі',
    },
    collectionIds: ['celebration'],
    catalogue: true,
    imageKind: 'edited-author-photo',
    sourceTitle: 'Святковий торт',
    launchPriority: 'High',
    heroCandidate: 'Yes',
    source: 'Author-confirmed cake · 2026-09-25',
    archiveSections: [],
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
      title: 'Безглютеновий святковий торт',
      description:
        'Безглютеновий святковий торт зі сметанним кремом, шоколадною глазур’ю та фруктами. Покрокове приготування бісквіта й складання торта.',
    },
    en: {
      title: 'Gluten-free celebration cake',
      description:
        'A gluten-free celebration cake with sour cream filling, chocolate glaze and fruit. Follow the steps for the sponge, filling and assembly.',
    },
    es: {
      title: 'Tarta de celebración sin gluten',
      description:
        'Tarta de celebración sin gluten con crema de nata agria, glaseado de chocolate y fruta. Preparación del bizcocho y montaje paso a paso.',
    },
  },
  routeSlug: 'celebration-sponge-cake',
} satisfies Recipe;
