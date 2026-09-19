import type { RecipeSourceDraft } from './source-recipe.types.ts';

const translatedQuantity = {
  base: null,
  shopping: { mode: 'nameOnly' as const },
};

const carrotCakeStepMedia = {
  'prepare-add-ins': {
    id: 'soaked-raisins-chopped-walnuts',
    src: '/media/recipes/carrot-cake/selected/step-01-soaked-raisins-chopped-walnuts-v1.png',
  },
  'prepare-pan': {
    id: 'prepared-pan',
    src: '/media/recipes/carrot-cake/selected/step-02-prepared-pan-v1.png',
  },
  'grated-carrots': {
    id: 'grated-carrots',
    src: '/media/recipes/carrot-cake/selected/step-03-grated-carrots-v1.png',
  },
  'carrots-oil-blender': {
    id: 'carrots-oil-blender',
    src: '/media/recipes/carrot-cake/selected/step-03-carrots-oil-blender-v1.png',
  },
  'carrot-oil-smooth': {
    id: 'carrot-oil-smooth',
    src: '/media/recipes/carrot-cake/selected/step-03-carrot-oil-smooth-v1.png',
  },
  'eggs-sugar-foam': {
    id: 'eggs-sugar-foam',
    src: '/media/recipes/carrot-cake/selected/step-04-eggs-sugar-foam-v1.png',
  },
  'batter-add-ins': {
    id: 'batter-add-ins',
    src: '/media/recipes/carrot-cake/selected/step-06-batter-add-ins-v1.png',
  },
  'batter-in-pan': {
    id: 'batter-in-pan',
    src: '/media/recipes/carrot-cake/selected/step-07-batter-in-pan-v1.png',
  },
  'dry-toothpick': {
    id: 'dry-toothpick',
    src: '/media/recipes/carrot-cake/selected/step-07-dry-toothpick-v1.png',
  },
} as const;

function stepMedia(
  id: keyof typeof carrotCakeStepMedia,
  alt: string,
  title: string,
  caption: string,
) {
  return [{ ...carrotCakeStepMedia[id], alt, title, caption }];
}

export const carrotCakeRecipe = {
  id: 'carrot-cake',
  publicationStatus: 'draft',
  source: {
    file: 'docs/reference/recipe-inventory.xlsx',
    locator:
      'Recipe Archive · Морквяний кекс; author-confirmed one-cake quantities and working method',
  },
  completeness: 'readyToReview',
  beforeStart: [
    'Soak the raisins before starting.',
    'Preheat the oven to 200°C with conventional top-and-bottom heat.',
  ],
  timing: {
    activeMinutes: null,
    totalElapsedMinutes: null,
    phases: [
      {
        id: 'baking',
        label: 'Baking',
        duration: { kind: 'range', min: 35, max: 40, unit: 'minute' },
        relatedStepId: 'bake',
      },
    ],
  },
  ingredientSections: [
    {
      id: 'cake',
      title: 'Carrot cake',
      ingredients: [
        {
          id: 'carrots',
          name: 'Carrots',
          quantity: {
            base: { kind: 'exact', value: 200, unit: 'g' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'oil',
          name: 'Sunflower or other neutral oil',
          quantity: {
            base: { kind: 'exact', value: 100, unit: 'ml' },
            shopping: { mode: 'base' },
          },
          note: 'Use an oil without a noticeable aroma.',
        },
        {
          id: 'eggs',
          name: 'Eggs',
          quantity: {
            base: { kind: 'exact', value: 3, unit: 'piece' },
            shopping: { mode: 'base', increment: 1, rounding: 'up' },
          },
        },
        {
          id: 'sugar',
          name: 'Sugar',
          quantity: {
            base: { kind: 'exact', value: 100, unit: 'g' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'flour',
          name: 'Schär Mix B Bread flour',
          quantity: {
            base: { kind: 'exact', value: 170, unit: 'g' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'baking-powder',
          name: 'Baking powder',
          quantity: {
            base: { kind: 'exact', value: 5, unit: 'g' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'salt',
          name: 'Salt',
          quantity: {
            base: { kind: 'exact', value: 1.5, unit: 'g' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'nuts',
          name: 'Walnuts or pecans',
          quantity: {
            base: { kind: 'exact', value: 100, unit: 'g' },
            shopping: { mode: 'base' },
          },
          note: 'Both variations are used by the author.',
        },
        {
          id: 'raisins',
          name: 'Raisins',
          quantity: {
            base: { kind: 'exact', value: 80, unit: 'g' },
            shopping: { mode: 'base' },
          },
          note: 'Soak, then drain without drying.',
        },
        {
          id: 'pan-butter',
          name: 'Butter for the pan',
          quantity: { base: null, shopping: { mode: 'nameOnly' } },
        },
        {
          id: 'pan-cinnamon',
          name: 'Cinnamon for the pan',
          quantity: { base: null, shopping: { mode: 'nameOnly' } },
        },
      ],
    },
  ],
  steps: [
    {
      id: 'prepare-add-ins',
      title: 'Prepare the raisins and nuts',
      body: 'Drain the soaked raisins without drying them. Pulse the nuts in a blender, leaving pieces large enough to be noticeable in the cake.',
      checkpoint:
        'The nuts should remain in visible pieces, not turn into flour.',
      media: stepMedia(
        'prepare-add-ins',
        'Drained soaked raisins beside finely chopped walnut pieces in small bowls',
        'Prepare the add-ins',
        'Keep the raisins moist and chop the walnuts into small pieces.',
      ),
    },
    {
      id: 'blend-carrots',
      title: 'Blend the carrots with oil',
      body: 'Grate the carrots by hand or in a food processor, then blend them separately with the neutral oil until smooth.',
      media: [
        {
          ...carrotCakeStepMedia['grated-carrots'],
          alt: 'Finely grated carrots in a ceramic bowl',
          title: 'Grate the carrots',
          caption: 'Start with finely grated carrot.',
        },
        {
          ...carrotCakeStepMedia['carrots-oil-blender'],
          alt: 'Grated carrots and neutral oil with an immersion blender in a ceramic bowl',
          title: 'Add the oil',
          caption: 'Blend the carrot and oil together in a separate bowl.',
        },
        {
          ...carrotCakeStepMedia['carrot-oil-smooth'],
          alt: 'Smooth orange carrot and oil puree with an immersion blender',
          title: 'Blend until smooth',
          caption: 'The mixture should be fully smooth, without visible carrot strands.',
        },
      ],
    },
    {
      id: 'whip-eggs',
      title: 'Whip the eggs and sugar',
      body: 'Beat the eggs and sugar in a mixer or food processor until the mixture is thick, pale and three to four times its original volume.',
      checkpoint:
        'The egg mixture should be pale, thick and three to four times its starting volume.',
      media: stepMedia(
        'eggs-sugar-foam',
        'Pale thick egg and sugar foam forming a ribbon from a whisk',
        'Whip to a thick foam',
        'The foam should hold a ribbon and have three to four times its starting volume.',
      ),
    },
    {
      id: 'mix-batter',
      title: 'Suggested: mix the batter gently',
      body: 'Mix the flour, baking powder and salt into the carrot-and-oil mixture until even. Stir in about one third of the whipped egg foam to lighten the base, then fold in the remaining foam in two additions with a spatula, stopping as soon as no pale streaks remain.',
      tip: 'Suggested method: this order is intended to protect the egg foam, but it has not been bake-tested as this exact version.',
    },
    {
      id: 'fold-add-ins',
      title: 'Add the raisins and nuts',
      body: 'Add the drained raisins and chopped nuts to the finished batter and mix until evenly distributed.',
      tip: 'Store the batter in the refrigerator and use it within three days.',
      media: stepMedia(
        'batter-add-ins',
        'Smooth carrot cake batter with small soaked raisins and finely chopped walnuts',
        'Fold in the add-ins',
        'Distribute the small raisins and chopped walnuts evenly through the smooth batter.',
      ),
    },
    {
      id: 'prepare-pan',
      title: 'Prepare the pan',
      body: 'For a tall pan, place a piece of parchment on the bottom. Butter the side walls and dust them with cinnamon.',
      tip: 'The cinnamon adds aroma and makes the crust crisper.',
      media: stepMedia(
        'prepare-pan',
        'Tall loaf pan with parchment on the bottom and cinnamon-dusted buttered sides',
        'Prepare the pan',
        'Line only the bottom, then butter and dust the sides with cinnamon.',
      ),
    },
    {
      id: 'bake',
      title: 'Bake the cake',
      body: 'Transfer the batter to the prepared pan. Bake at 200°C with conventional top-and-bottom heat for 35–40 minutes. Pierce the center with a toothpick; it should come out completely dry.',
      meta: '200°C · 35–40 min · top and bottom heat',
      checkpoint: 'The toothpick should come out completely dry.',
      media: [
        {
          ...carrotCakeStepMedia['batter-in-pan'],
          alt: 'Smooth raw carrot cake batter with small raisins and chopped walnuts in a tall loaf pan',
          title: 'Fill the pan',
          caption: 'Level the batter in the prepared pan before baking.',
        },
        {
          ...carrotCakeStepMedia['dry-toothpick'],
          alt: 'Baked carrot cake in a loaf pan with a clean toothpick lifted from the centre',
          title: 'Check the centre',
          caption: 'The toothpick should come out completely dry.',
        },
      ],
    },
  ],
  translations: {
    uk: {
      completeness: 'readyToReview',
      beforeStart: [
        'Заздалегідь замочіть родзинки.',
        'Розігрійте духовку до 200°C у режимі верхнього й нижнього нагріву.',
      ],
      timing: {
        activeMinutes: null,
        totalElapsedMinutes: null,
        phases: [
          {
            id: 'baking',
            label: 'Випікання',
            duration: { kind: 'range', min: 35, max: 40, unit: 'minute' },
            relatedStepId: 'bake',
          },
        ],
      },
      ingredientSections: [
        {
          id: 'cake',
          title: 'Морквяний кекс',
          ingredients: [
            {
              id: 'carrots',
              name: 'Морква',
              quantity: translatedQuantity,
            },
            {
              id: 'oil',
              name: 'Соняшникова або інша нейтральна олія',
              quantity: translatedQuantity,
              note: 'Використовуйте олію без виразного запаху.',
            },
            {
              id: 'eggs',
              name: 'Яйця',
              quantity: translatedQuantity,
            },
            {
              id: 'sugar',
              name: 'Цукор',
              quantity: translatedQuantity,
            },
            {
              id: 'flour',
              name: 'Борошно Schär Mix B Bread',
              quantity: translatedQuantity,
            },
            {
              id: 'baking-powder',
              name: 'Розпушувач',
              quantity: translatedQuantity,
            },
            {
              id: 'salt',
              name: 'Сіль',
              quantity: translatedQuantity,
            },
            {
              id: 'nuts',
              name: 'Волоські горіхи або пекан',
              quantity: translatedQuantity,
              note: 'Авторка використовує обидва варіанти.',
            },
            {
              id: 'raisins',
              name: 'Родзинки',
              quantity: translatedQuantity,
              note: 'Замочіть, потім злийте воду, не просушуючи.',
            },
            {
              id: 'pan-butter',
              name: 'Вершкове масло для форми',
              quantity: translatedQuantity,
            },
            {
              id: 'pan-cinnamon',
              name: 'Кориця для форми',
              quantity: translatedQuantity,
            },
          ],
        },
      ],
      steps: [
        {
          id: 'prepare-add-ins',
          title: 'Підготуйте родзинки та горіхи',
          body: 'Злийте воду із замочених родзинок, але не просушуйте їх. Подрібніть горіхи в блендері так, щоб залишилися шматочки, які відчуватимуться в кексі.',
          checkpoint:
            'Горіхи мають залишитися помітними шматочками, а не перетворитися на борошно.',
          media: stepMedia(
            'prepare-add-ins',
            'Злиті замочені родзинки поруч із дрібно подрібненими волоськими горіхами в маленьких мисках',
            'Підготуйте добавки',
            'Залиште родзинки вологими, а горіхи подрібніть невеликими шматочками.',
          ),
        },
        {
          id: 'blend-carrots',
          title: 'Перебийте моркву з олією',
          body: 'Натріть моркву вручну або в комбайні, а потім окремо перебийте її блендером з нейтральною олією до однорідності.',
          media: [
            {
              ...carrotCakeStepMedia['grated-carrots'],
              alt: 'Дрібно натерта морква в керамічній мисці',
              title: 'Натріть моркву',
              caption: 'Почніть із дрібно натертої моркви.',
            },
            {
              ...carrotCakeStepMedia['carrots-oil-blender'],
              alt: 'Натерта морква й нейтральна олія із занурювальним блендером у керамічній мисці',
              title: 'Додайте олію',
              caption: 'Окремо перебийте моркву з олією.',
            },
            {
              ...carrotCakeStepMedia['carrot-oil-smooth'],
              alt: 'Гладка помаранчева морквяно-олійна маса із занурювальним блендером',
              title: 'Перебийте до однорідності',
              caption: 'Маса має бути повністю гладкою, без помітних смужок моркви.',
            },
          ],
        },
        {
          id: 'whip-eggs',
          title: 'Збийте яйця з цукром',
          body: 'Збийте яйця з цукром міксером або в комбайні до густої світлої піни. Маса має збільшитися в об’ємі у три-чотири рази.',
          checkpoint:
            'Яєчна маса має бути світлою, густою та у три-чотири рази більшою за початковий об’єм.',
          media: stepMedia(
            'eggs-sugar-foam',
            'Світла густа піна з яєць і цукру, що стікає стрічкою з вінчика',
            'Збийте до густої піни',
            'Піна має тримати стрічку та збільшитися в об’ємі у три-чотири рази.',
          ),
        },
        {
          id: 'mix-batter',
          title: 'Пропозиція: делікатно змішайте тісто',
          body: 'Змішайте борошно, розпушувач і сіль із морквяно-олійною масою до однорідності. Додайте приблизно третину збитої яєчної піни й перемішайте, щоб зробити основу легшою. Решту піни введіть лопаткою у два прийоми рухами знизу догори та зупиніться, щойно зникнуть світлі смуги.',
          tip: 'Пропозиція: ця послідовність допомагає зберегти яєчну піну, але не була перевірена випіканням саме в такому вигляді.',
        },
        {
          id: 'fold-add-ins',
          title: 'Додайте родзинки та горіхи',
          body: 'Додайте до готового тіста родзинки без зайвої води та подрібнені горіхи. Перемішайте до рівномірного розподілення.',
          tip: 'Зберігайте тісто в холодильнику та використайте протягом трьох днів.',
          media: stepMedia(
            'batter-add-ins',
            'Однорідне тісто для морквяного кексу з невеликими замоченими родзинками й дрібно подрібненими волоськими горіхами',
            'Вмішайте добавки',
            'Рівномірно розподіліть невеликі родзинки й подрібнені горіхи в однорідному тісті.',
          ),
        },
        {
          id: 'prepare-pan',
          title: 'Підготуйте форму',
          body: 'Якщо форма висока, покладіть на дно шматок пергаменту. Бічні стінки змастіть вершковим маслом і присипте корицею.',
          tip: 'Кориця додає скоринці аромату та хрусткості.',
          media: stepMedia(
            'prepare-pan',
            'Висока форма для кексу з пергаментом на дні та змащеними й припорошеними корицею боками',
            'Підготуйте форму',
            'Застеліть лише дно, а боки змастіть маслом і присипте корицею.',
          ),
        },
        {
          id: 'bake',
          title: 'Спечіть кекс',
          body: 'Викладіть тісто в підготовлену форму. Випікайте при 200°C у режимі верхнього й нижнього нагріву протягом 35–40 хвилин. Проколіть кекс по центру зубочисткою — вона має вийти повністю сухою.',
          meta: '200°C · 35–40 хв · верхній і нижній нагрів',
          checkpoint: 'Зубочистка має вийти повністю сухою.',
          media: [
            {
              ...carrotCakeStepMedia['batter-in-pan'],
              alt: 'Однорідне сире тісто для морквяного кексу з невеликими родзинками й подрібненими горіхами у високій формі',
              title: 'Викладіть тісто у форму',
              caption: 'Розрівняйте тісто у підготовленій формі перед випіканням.',
            },
            {
              ...carrotCakeStepMedia['dry-toothpick'],
              alt: 'Спечений морквяний кекс у формі та чиста зубочистка, вийнята з центру',
              title: 'Перевірте центр',
              caption: 'Зубочистка має вийти повністю сухою.',
            },
          ],
        },
      ],
    },
    es: {
      completeness: 'readyToReview',
      beforeStart: [
        'Remoja las pasas con antelación.',
        'Precalienta el horno a 200 °C con calor arriba y abajo.',
      ],
      timing: {
        activeMinutes: null,
        totalElapsedMinutes: null,
        phases: [
          {
            id: 'baking',
            label: 'Horneado',
            duration: { kind: 'range', min: 35, max: 40, unit: 'minute' },
            relatedStepId: 'bake',
          },
        ],
      },
      ingredientSections: [
        {
          id: 'cake',
          title: 'Bizcocho de zanahoria',
          ingredients: [
            { id: 'carrots', name: 'Zanahorias', quantity: translatedQuantity },
            {
              id: 'oil',
              name: 'Aceite de girasol u otro aceite neutro',
              quantity: translatedQuantity,
              note: 'Usa un aceite sin aroma perceptible.',
            },
            { id: 'eggs', name: 'Huevos', quantity: translatedQuantity },
            { id: 'sugar', name: 'Azúcar', quantity: translatedQuantity },
            {
              id: 'flour',
              name: 'Harina Schär Mix B Bread',
              quantity: translatedQuantity,
            },
            {
              id: 'baking-powder',
              name: 'Levadura química',
              quantity: translatedQuantity,
            },
            { id: 'salt', name: 'Sal', quantity: translatedQuantity },
            {
              id: 'nuts',
              name: 'Nueces o pacanas',
              quantity: translatedQuantity,
              note: 'La autora utiliza las dos variantes.',
            },
            {
              id: 'raisins',
              name: 'Pasas',
              quantity: translatedQuantity,
              note: 'Remójalas y escúrrelas sin secarlas.',
            },
            {
              id: 'pan-butter',
              name: 'Mantequilla para el molde',
              quantity: translatedQuantity,
            },
            {
              id: 'pan-cinnamon',
              name: 'Canela para el molde',
              quantity: translatedQuantity,
            },
          ],
        },
      ],
      steps: [
        {
          id: 'prepare-add-ins',
          title: 'Prepara las pasas y las nueces',
          body: 'Escurre las pasas remojadas sin secarlas. Tritura las nueces en una batidora, dejando trozos que se noten en el bizcocho.',
          checkpoint:
            'Las nueces deben quedar en trozos visibles, no convertirse en harina.',
          media: stepMedia(
            'prepare-add-ins',
            'Pasas remojadas escurridas junto a nueces finamente picadas en cuencos pequeños',
            'Prepara los añadidos',
            'Mantén las pasas húmedas y pica las nueces en trozos pequeños.',
          ),
        },
        {
          id: 'blend-carrots',
          title: 'Tritura las zanahorias con aceite',
          body: 'Ralla las zanahorias a mano o con un robot de cocina; después tritúralas aparte con el aceite neutro hasta obtener una mezcla homogénea.',
          media: [
            {
              ...carrotCakeStepMedia['grated-carrots'],
              alt: 'Zanahoria finamente rallada en un cuenco de cerámica',
              title: 'Ralla las zanahorias',
              caption: 'Empieza con zanahoria finamente rallada.',
            },
            {
              ...carrotCakeStepMedia['carrots-oil-blender'],
              alt: 'Zanahoria rallada y aceite neutro con una batidora de mano en un cuenco de cerámica',
              title: 'Añade el aceite',
              caption: 'Tritura aparte la zanahoria con el aceite.',
            },
            {
              ...carrotCakeStepMedia['carrot-oil-smooth'],
              alt: 'Mezcla lisa de zanahoria y aceite de color naranja con una batidora de mano',
              title: 'Tritura hasta que quede lisa',
              caption: 'La mezcla debe quedar completamente lisa, sin hebras visibles de zanahoria.',
            },
          ],
        },
        {
          id: 'whip-eggs',
          title: 'Bate los huevos con el azúcar',
          body: 'Bate los huevos y el azúcar con una batidora o robot de cocina hasta obtener una espuma espesa y clara. La mezcla debe aumentar de volumen entre tres y cuatro veces.',
          checkpoint:
            'La mezcla de huevo debe ser clara, espesa y tener entre tres y cuatro veces su volumen inicial.',
          media: stepMedia(
            'eggs-sugar-foam',
            'Espuma clara y espesa de huevo y azúcar que cae en forma de cinta de unas varillas',
            'Bate hasta obtener una espuma espesa',
            'La espuma debe dejar una cinta y aumentar entre tres y cuatro veces su volumen.',
          ),
        },
        {
          id: 'mix-batter',
          title: 'Sugerencia: mezcla la masa con suavidad',
          body: 'Mezcla la harina, la levadura química y la sal con la mezcla de zanahoria y aceite hasta integrar. Incorpora aproximadamente un tercio de la espuma de huevo batido para aligerar la base; después incorpora el resto en dos tandas con una espátula y movimientos envolventes, deteniéndote en cuanto no queden vetas claras.',
          tip: 'Sugerencia: este orden busca proteger la espuma de huevo, pero no se ha probado al horno como esta versión exacta.',
        },
        {
          id: 'fold-add-ins',
          title: 'Añade las pasas y las nueces',
          body: 'Añade a la masa terminada las pasas escurridas y las nueces picadas. Mezcla hasta que queden repartidas de forma uniforme.',
          tip: 'Guarda la masa en el frigorífico y úsala en un plazo de tres días.',
          media: stepMedia(
            'batter-add-ins',
            'Masa lisa de bizcocho de zanahoria con pasas remojadas pequeñas y nueces finamente picadas',
            'Incorpora los añadidos',
            'Reparte las pasas pequeñas y las nueces picadas de forma uniforme por la masa lisa.',
          ),
        },
        {
          id: 'prepare-pan',
          title: 'Prepara el molde',
          body: 'Para un molde alto, coloca un trozo de papel de horno en el fondo. Unta las paredes con mantequilla y espolvoréalas con canela.',
          tip: 'La canela aporta aroma y hace la corteza más crujiente.',
          media: stepMedia(
            'prepare-pan',
            'Molde alto para bizcocho con papel de horno en el fondo y paredes untadas con mantequilla y espolvoreadas con canela',
            'Prepara el molde',
            'Forra solo el fondo y unta y espolvorea los lados con canela.',
          ),
        },
        {
          id: 'bake',
          title: 'Hornea el bizcocho',
          body: 'Pasa la masa al molde preparado. Hornea a 200 °C con calor arriba y abajo durante 35–40 minutos. Pincha el centro con un palillo; debe salir completamente seco.',
          meta: '200 °C · 35–40 min · calor arriba y abajo',
          checkpoint: 'El palillo debe salir completamente seco.',
          media: [
            {
              ...carrotCakeStepMedia['batter-in-pan'],
              alt: 'Masa lisa cruda de bizcocho de zanahoria con pasas pequeñas y nueces picadas en un molde alto',
              title: 'Pasa la masa al molde',
              caption: 'Alisa la masa en el molde preparado antes de hornear.',
            },
            {
              ...carrotCakeStepMedia['dry-toothpick'],
              alt: 'Bizcocho de zanahoria horneado en un molde y un palillo limpio retirado del centro',
              title: 'Comprueba el centro',
              caption: 'El palillo debe salir completamente seco.',
            },
          ],
        },
      ],
    },
  },
} satisfies RecipeSourceDraft;
