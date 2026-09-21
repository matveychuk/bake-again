import type { RecipeSourceDraft } from './source-recipe.types.ts';
import { quantityFromGrams, quantityFromSpoons } from './spoon-weights.ts';

const quantity = {
  flour: quantityFromGrams('schar-mix-b', 110),
  powderedSugar: quantityFromSpoons('powdered-sugar', 1, 'tsp'),
  salt: {
    base: null,
    equivalent: { kind: 'exact', value: 1, unit: 'pinch' },
    shopping: { mode: 'nameOnly' },
  },
  water: {
    base: { kind: 'exact', value: 130, unit: 'ml' },
    shopping: { mode: 'base', defaultSelected: false },
  },
  butter: {
    base: { kind: 'exact', value: 70, unit: 'g' },
    shopping: { mode: 'base' },
  },
  eggs: {
    base: { kind: 'exact', value: 4, unit: 'piece' },
    shopping: { mode: 'base', increment: 1, rounding: 'up' },
  },
} as const;

export const eclairsRecipe = {
  id: 'eclairs',
  publicationStatus: 'published',
  presentation: 'concise',
  source: {
    file: 'User-provided recipe screenshot, 2026-09-19',
    locator: 'Gluten-free profiteroles · recipe text with author note above it',
  },
  completeness: 'readyToReview',
  evidence: {
    status: 'tested',
    explanation:
      'This exact choux made with Schär Mix B Bread and 4 small eggs baked successfully and yielded about 20 profiteroles.',
  },
  creamOptions: {
    recipeIds: [
      'mascarpone-whipped-cream',
      'vanilla-egg-custard',
      'eggless-vanilla-custard',
      'vanilla-buttercream',
    ],
    recommendedRecipeId: 'vanilla-egg-custard',
  },
  yield: {
    id: 'twenty-profiteroles',
    label: 'About 20 walnut-size profiteroles',
    count: { kind: 'exact', value: 20 },
    unit: 'batch',
  },
  geometry: {
    id: 'walnut-size-profiteroles',
    label: 'Walnut-size profiteroles',
    kind: 'tray',
    application: 'portion-on',
    shape: 'other',
    diameterCm: null,
  },
  timing: {
    activeMinutes: 15,
    totalElapsedMinutes: null,
    phases: [
      {
        id: 'hot-bake',
        label: 'Initial bake at 200°C',
        duration: { kind: 'exact', value: 10, unit: 'minute' },
        relatedStepId: 'bake',
      },
      {
        id: 'lower-bake',
        label: 'Bake at 180°C',
        duration: { kind: 'exact', value: 15, unit: 'minute' },
        relatedStepId: 'bake',
      },
    ],
  },
  beforeStart: [
    'Prepare the selected cream in advance and chill it completely. Fill only completely cooled shells.',
  ],
  ingredientSections: [
    {
      id: 'choux',
      title: 'Choux pastry',
      ingredients: [
        {
          id: 'flour',
          name: 'Schär Mix B Bread flour mix',
          quantity: quantity.flour,
          note: 'The exact flour mix used in the successful bake.',
        },
        {
          id: 'powdered-sugar',
          name: 'Powdered sugar',
          quantity: quantity.powderedSugar,
        },
        { id: 'salt', name: 'Salt', quantity: quantity.salt },
        { id: 'water', name: 'Water', quantity: quantity.water },
        {
          id: 'butter',
          name: 'Unsalted butter',
          quantity: quantity.butter,
          note: 'Chilled and cut into cubes in the source recipe.',
        },
        {
          id: 'eggs',
          name: 'Small eggs',
          quantity: quantity.eggs,
          note: 'Lightly beaten; the author used 4 small eggs.',
        },
      ],
    },
  ],
  steps: [
    {
      id: 'mix-dry',
      title: 'Sift the dry ingredients',
      body: 'Sift the Schär Mix B Bread flour, powdered sugar and salt together into a small bowl.',
      cookIngredients: [
        { ingredientId: 'flour' },
        { ingredientId: 'powdered-sugar' },
        { ingredientId: 'salt' },
      ],
    },
    {
      id: 'heat-liquid',
      title: 'Melt the butter in the water',
      body: 'Put the water and butter in a small saucepan. Heat gently until the butter has melted, then bring the mixture to a boil.',
      tip: 'Use gentle heat at first so the butter melts before too much water evaporates.',
      cookIngredients: [{ ingredientId: 'water' }, { ingredientId: 'butter' }],
    },
    {
      id: 'cook-panade',
      title: 'Cook the choux base',
      body: 'Add all the dry mixture at once and remove the saucepan from the heat. Beat firmly with a spatula until the dough comes together and pulls away from the sides of the pan. Stir over low heat briefly, then set aside for a few minutes, beating out some of the hot steam.',
      tip: 'Let the base cool slightly before adding egg so the egg does not set on contact.',
      media: [
        {
          id: 'eclairs-cooked-panade-v1',
          src: '/media/recipes/eclairs/selected/step-03-cooked-panade-v1.png',
          alt: 'A smooth pale choux paste gathered into one mass in a stainless-steel saucepan',
        },
      ],
    },
    {
      id: 'add-eggs',
      title: 'Beat in the eggs gradually',
      body: 'Add the lightly beaten eggs a little at a time, mixing thoroughly after every addition, until the dough is soft, smooth and glossy.',
      tip: 'Four small eggs were ideal in the tested bake. Hold back the last addition until you have checked the texture.',
      checkpoint:
        'The dough is glossy, holds its shape and falls slowly from the spatula in a heavy ribbon.',
      cookIngredients: [{ ingredientId: 'eggs' }],
      media: [
        {
          id: 'eclairs-heavy-ribbon-v2',
          src: '/media/recipes/eclairs/selected/step-04-heavy-ribbon-v2.png',
          alt: 'Glossy choux dough falling slowly from a spatula in a thick ribbon above a bowl',
        },
      ],
    },
    {
      id: 'pipe',
      title: 'Pipe the shells',
      body: 'Transfer the dough to a piping bag fitted with an approximately 1.5 cm nozzle. Pipe walnut-size rounds onto the lined tray, leaving room between them.',
      checkpoint:
        'The piped dough keeps its shape and does not spread into flat puddles.',
      media: [
        {
          id: 'eclairs-piped-profiteroles-v2',
          src: '/media/recipes/eclairs/selected/step-05-piped-profiteroles-v2.png',
          alt: 'Even walnut-size rounds of uncooked choux dough spaced apart on a parchment-lined tray',
        },
      ],
    },
    {
      id: 'bake',
      title: 'Bake until risen and golden',
      body: 'Without opening the oven between stages, bake until the shells have risen and turned golden.',
      meta: '200°C · 10 min, then 180°C · 15 min',
      checkpoint:
        'The shells are well risen, golden and firm rather than pale or soft.',
    },
    {
      id: 'dry-shells',
      title: 'Vent and dry the shells',
      body: 'Remove the tray and make a small hole in the base of each shell. Return them to the oven for a few minutes so the inside can dry, then cool completely.',
      checkpoint:
        'The cooled shells feel light, dry and hollow and do not collapse.',
      media: [
        {
          id: 'eclairs-dry-hollow-shells-v2',
          src: '/media/recipes/eclairs/selected/step-07-dry-hollow-shells-v2.png',
          alt: 'Golden profiterole shells on a rack with one split open to show a dry hollow centre',
        },
      ],
    },
    {
      id: 'fill',
      title: 'Fill the cooled shells',
      body: 'Transfer the prepared cream to a piping bag and fill the completely cooled shells through the holes in their bases.',
    },
  ],
  translations: {
    uk: {
      presentation: 'concise',
      completeness: 'readyToReview',
      evidence: {
        status: 'tested',
        explanation:
          'Саме це заварне тісто на Schär Mix B Bread із 4 маленькими яйцями успішно випікалося й дало близько 20 профітролів.',
      },
      yield: {
        id: 'twenty-profiteroles',
        label: 'Близько 20 профітролів розміром із волоський горіх',
        count: { kind: 'exact', value: 20 },
        unit: 'batch',
      },
      geometry: {
        id: 'walnut-size-profiteroles',
        label: 'Профітролі розміром із волоський горіх',
        kind: 'tray',
        application: 'portion-on',
        shape: 'other',
        diameterCm: null,
      },
      timing: {
        activeMinutes: 15,
        totalElapsedMinutes: null,
        phases: [
          {
            id: 'hot-bake',
            label: 'Початкове випікання за 200°C',
            duration: { kind: 'exact', value: 10, unit: 'minute' },
            relatedStepId: 'bake',
          },
          {
            id: 'lower-bake',
            label: 'Випікання за 180°C',
            duration: { kind: 'exact', value: 15, unit: 'minute' },
            relatedStepId: 'bake',
          },
        ],
      },
      beforeStart: [
        'Заздалегідь приготуйте вибраний крем і повністю охолодіть його. Наповнюйте лише повністю охололі оболонки.',
      ],
      ingredientSections: [
        {
          id: 'choux',
          title: 'Заварне тісто',
          ingredients: [
            {
              id: 'flour',
              name: 'Борошняна суміш Schär Mix B Bread',
              quantity: quantity.flour,
              note: 'Саме цю суміш використано в успішній випічці.',
            },
            {
              id: 'powdered-sugar',
              name: 'Цукрова пудра',
              quantity: quantity.powderedSugar,
            },
            { id: 'salt', name: 'Сіль', quantity: quantity.salt },
            { id: 'water', name: 'Вода', quantity: quantity.water },
            {
              id: 'butter',
              name: 'Несолоне вершкове масло',
              quantity: quantity.butter,
              note: 'У джерелі — охолоджене й нарізане кубиками.',
            },
            {
              id: 'eggs',
              name: 'Маленькі яйця',
              quantity: quantity.eggs,
              note: 'Злегка збити; авторка використала 4 маленькі яйця.',
            },
          ],
        },
      ],
      steps: [
        {
          id: 'mix-dry',
          title: 'Просійте сухі інгредієнти',
          body: 'Просійте в невелику миску борошняну суміш Schär Mix B Bread, цукрову пудру й сіль.',
          cookIngredients: [
            { ingredientId: 'flour' },
            { ingredientId: 'powdered-sugar' },
            { ingredientId: 'salt' },
          ],
        },
        {
          id: 'heat-liquid',
          title: 'Розтопіть масло у воді',
          body: 'Покладіть воду й масло в невелику каструлю. Нагрівайте на слабкому вогні, доки масло не розтане, а потім доведіть суміш до кипіння.',
          tip: 'Спочатку нагрівайте повільно, щоб масло встигло розтанути до помітного випаровування води.',
          cookIngredients: [
            { ingredientId: 'water' },
            { ingredientId: 'butter' },
          ],
        },
        {
          id: 'cook-panade',
          title: 'Заваріть основу',
          body: 'Одразу всипте всю суху суміш і зніміть каструлю з вогню. Енергійно вимішуйте лопаткою, доки тісто не збереться докупи й не відійде від стінок. Ненадовго поверніть на слабкий вогонь, а потім відставте на кілька хвилин, продовжуючи перемішувати й випускаючи гарячу пару.',
          tip: 'Перед додаванням яєць дайте основі трохи охолонути, щоб яйця не згорнулися.',
          media: [
            {
              id: 'eclairs-cooked-panade-v1',
              src: '/media/recipes/eclairs/selected/step-03-cooked-panade-v1.png',
              alt: 'Гладке світле заварне тісто, зібране в одну масу в сталевій каструлі',
            },
          ],
        },
        {
          id: 'add-eggs',
          title: 'Поступово введіть яйця',
          body: 'Додавайте злегка збиті яйця невеликими порціями, щоразу ретельно вимішуючи, доки тісто не стане м’яким, гладким і блискучим.',
          tip: 'У перевіреній випічці ідеально підійшли 4 маленькі яйця. Перед останньою порцією обов’язково перевірте консистенцію.',
          checkpoint:
            'Тісто блискуче, тримає форму й повільно спадає з лопатки важкою стрічкою.',
          cookIngredients: [{ ingredientId: 'eggs' }],
          media: [
            {
              id: 'eclairs-heavy-ribbon-v2',
              src: '/media/recipes/eclairs/selected/step-04-heavy-ribbon-v2.png',
              alt: 'Блискуче заварне тісто повільно спадає з лопатки густою стрічкою над мискою',
            },
          ],
        },
        {
          id: 'pipe',
          title: 'Відсадіть заготовки',
          body: 'Перекладіть тісто в кондитерський мішок із насадкою приблизно 1,5 см. Відсадіть на деко кульки розміром із волоський горіх, залишаючи між ними місце.',
          checkpoint:
            'Заготовки тримають форму й не розпливаються пласкими калюжами.',
          media: [
            {
              id: 'eclairs-piped-profiteroles-v2',
              src: '/media/recipes/eclairs/selected/step-05-piped-profiteroles-v2.png',
              alt: 'Однакові сирі кульки заварного тіста розміром із волоський горіх на застеленому пергаментом деку',
            },
          ],
        },
        {
          id: 'bake',
          title: 'Випечіть до золотистого кольору',
          body: 'Не відкривайте духовку між етапами й випікайте, доки оболонки добре не піднімуться та не стануть золотистими.',
          meta: '200°C · 10 хв, потім 180°C · 15 хв',
          checkpoint:
            'Оболонки добре піднялися, стали золотистими й міцними, а не блідими чи м’якими.',
        },
        {
          id: 'dry-shells',
          title: 'Випустіть пару й досушіть',
          body: 'Вийміть деко й зробіть невеликий отвір у дні кожної оболонки. Поверніть їх у духовку ще на кілька хвилин, щоб середина підсохла, а потім повністю остудіть.',
          checkpoint:
            'Охололі оболонки легкі, сухі й порожнисті та не осідають.',
          media: [
            {
              id: 'eclairs-dry-hollow-shells-v2',
              src: '/media/recipes/eclairs/selected/step-07-dry-hollow-shells-v2.png',
              alt: 'Золотисті оболонки профітролів на решітці, одна розкрита й показує суху порожнисту середину',
            },
          ],
        },
        {
          id: 'fill',
          title: 'Наповніть охололі оболонки',
          body: 'Перекладіть приготований крем у кондитерський мішок і наповніть повністю охололі оболонки через отвори внизу.',
        },
      ],
    },
    es: {
      presentation: 'concise',
      completeness: 'readyToReview',
      evidence: {
        status: 'tested',
        explanation:
          'Esta masa choux con Schär Mix B Bread y 4 huevos pequeños se horneó con éxito y rindió unos 20 profiteroles.',
      },
      yield: {
        id: 'twenty-profiteroles',
        label: 'Unos 20 profiteroles del tamaño de una nuez',
        count: { kind: 'exact', value: 20 },
        unit: 'batch',
      },
      geometry: {
        id: 'walnut-size-profiteroles',
        label: 'Profiteroles del tamaño de una nuez',
        kind: 'tray',
        application: 'portion-on',
        shape: 'other',
        diameterCm: null,
      },
      timing: {
        activeMinutes: 15,
        totalElapsedMinutes: null,
        phases: [
          {
            id: 'hot-bake',
            label: 'Horneado inicial a 200°C',
            duration: { kind: 'exact', value: 10, unit: 'minute' },
            relatedStepId: 'bake',
          },
          {
            id: 'lower-bake',
            label: 'Horneado a 180°C',
            duration: { kind: 'exact', value: 15, unit: 'minute' },
            relatedStepId: 'bake',
          },
        ],
      },
      beforeStart: [
        'Prepara con antelación la crema elegida y enfríala por completo. Rellena solo las piezas completamente frías.',
      ],
      ingredientSections: [
        {
          id: 'choux',
          title: 'Masa choux',
          ingredients: [
            {
              id: 'flour',
              name: 'Mezcla de harina Schär Mix B Bread',
              quantity: quantity.flour,
              note: 'Es la mezcla exacta utilizada en el horneado exitoso.',
            },
            {
              id: 'powdered-sugar',
              name: 'Azúcar glas',
              quantity: quantity.powderedSugar,
            },
            { id: 'salt', name: 'Sal', quantity: quantity.salt },
            { id: 'water', name: 'Agua', quantity: quantity.water },
            {
              id: 'butter',
              name: 'Mantequilla sin sal',
              quantity: quantity.butter,
              note: 'Fría y cortada en dados en la receta original.',
            },
            {
              id: 'eggs',
              name: 'Huevos pequeños',
              quantity: quantity.eggs,
              note: 'Ligeramente batidos; la autora utilizó 4 huevos pequeños.',
            },
          ],
        },
      ],
      steps: [
        {
          id: 'mix-dry',
          title: 'Tamiza los ingredientes secos',
          body: 'Tamiza en un bol pequeño la mezcla Schär Mix B Bread, el azúcar glas y la sal.',
          cookIngredients: [
            { ingredientId: 'flour' },
            { ingredientId: 'powdered-sugar' },
            { ingredientId: 'salt' },
          ],
        },
        {
          id: 'heat-liquid',
          title: 'Derrite la mantequilla en el agua',
          body: 'Pon el agua y la mantequilla en un cazo pequeño. Calienta suavemente hasta que la mantequilla se derrita y después lleva la mezcla a ebullición.',
          tip: 'Empieza con fuego suave para que la mantequilla se derrita antes de que se evapore demasiada agua.',
          cookIngredients: [
            { ingredientId: 'water' },
            { ingredientId: 'butter' },
          ],
        },
        {
          id: 'cook-panade',
          title: 'Cuece la base de la masa',
          body: 'Añade de golpe toda la mezcla seca y retira el cazo del fuego. Bate con firmeza con una espátula hasta que la masa se una y se separe de las paredes. Remueve brevemente a fuego bajo y deja reposar unos minutos mientras eliminas parte del vapor caliente.',
          tip: 'Deja que la base se enfríe un poco antes de añadir los huevos para que no se cuajen al contacto.',
          media: [
            {
              id: 'eclairs-cooked-panade-v1',
              src: '/media/recipes/eclairs/selected/step-03-cooked-panade-v1.png',
              alt: 'Masa choux clara y lisa reunida en una sola pieza dentro de un cazo de acero inoxidable',
            },
          ],
        },
        {
          id: 'add-eggs',
          title: 'Incorpora los huevos poco a poco',
          body: 'Añade los huevos ligeramente batidos en pequeñas porciones y mezcla bien después de cada una hasta obtener una masa blanda, lisa y brillante.',
          tip: 'Cuatro huevos pequeños fueron ideales en la prueba. Reserva la última porción hasta comprobar la textura.',
          checkpoint:
            'La masa está brillante, conserva la forma y cae lentamente de la espátula formando una cinta pesada.',
          cookIngredients: [{ ingredientId: 'eggs' }],
          media: [
            {
              id: 'eclairs-heavy-ribbon-v2',
              src: '/media/recipes/eclairs/selected/step-04-heavy-ribbon-v2.png',
              alt: 'Masa choux brillante que cae lentamente de una espátula formando una cinta gruesa sobre un bol',
            },
          ],
        },
        {
          id: 'pipe',
          title: 'Forma las piezas',
          body: 'Pasa la masa a una manga con boquilla de unos 1,5 cm. Forma montones del tamaño de una nuez sobre la bandeja, dejando espacio entre ellos.',
          checkpoint:
            'Las piezas mantienen la forma y no se extienden en discos planos.',
          media: [
            {
              id: 'eclairs-piped-profiteroles-v2',
              src: '/media/recipes/eclairs/selected/step-05-piped-profiteroles-v2.png',
              alt: 'Porciones iguales de masa choux cruda del tamaño de una nuez separadas sobre una bandeja con papel de horno',
            },
          ],
        },
        {
          id: 'bake',
          title: 'Hornea hasta que estén dorados',
          body: 'Sin abrir el horno entre las dos etapas, hornea hasta que las piezas hayan subido y estén doradas.',
          meta: '200°C · 10 min; después 180°C · 15 min',
          checkpoint:
            'Las piezas están bien hinchadas, doradas y firmes, no pálidas ni blandas.',
        },
        {
          id: 'dry-shells',
          title: 'Deja salir el vapor y seca',
          body: 'Saca la bandeja y haz un pequeño agujero en la base de cada pieza. Devuélvelas al horno unos minutos para secar el interior y deja que se enfríen por completo.',
          checkpoint:
            'Las piezas frías se sienten ligeras, secas y huecas y no se hunden.',
          media: [
            {
              id: 'eclairs-dry-hollow-shells-v2',
              src: '/media/recipes/eclairs/selected/step-07-dry-hollow-shells-v2.png',
              alt: 'Profiteroles dorados sobre una rejilla con uno abierto para mostrar el interior seco y hueco',
            },
          ],
        },
        {
          id: 'fill',
          title: 'Rellena las piezas frías',
          body: 'Pasa la crema preparada a una manga y rellena las piezas completamente frías por los agujeros de la base.',
        },
      ],
    },
  },
} satisfies RecipeSourceDraft;
