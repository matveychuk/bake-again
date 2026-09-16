import type { RecipeSourceDraft } from './source-recipe.types.ts';

const translatedQuantity = {
  base: null,
  shopping: { mode: 'nameOnly' as const },
};

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
    },
    {
      id: 'prepare-pan',
      title: 'Prepare the pan',
      body: 'For a tall pan, place a piece of parchment on the bottom. Butter the side walls and dust them with cinnamon.',
      tip: 'The cinnamon adds aroma and makes the crust crisper.',
    },
    {
      id: 'blend-carrots',
      title: 'Blend the carrots with oil',
      body: 'Grate the carrots by hand or in a food processor, then blend them separately with the neutral oil until smooth.',
    },
    {
      id: 'whip-eggs',
      title: 'Whip the eggs and sugar',
      body: 'Beat the eggs and sugar in a mixer or food processor until the mixture is thick, pale and three to four times its original volume.',
      checkpoint:
        'The egg mixture should be pale, thick and three to four times its starting volume.',
    },
    {
      id: 'mix-batter',
      title: 'Mix the batter',
      body: 'Combine the carrot-and-oil mixture with the whipped eggs. Mix the flour, baking powder and salt separately, then add them to the wet ingredients and mix until even.',
    },
    {
      id: 'fold-add-ins',
      title: 'Add the raisins and nuts',
      body: 'Add the drained raisins and chopped nuts to the finished batter and mix until evenly distributed.',
      tip: 'Store the batter in the refrigerator and use it within three days.',
    },
    {
      id: 'bake',
      title: 'Bake the cake',
      body: 'Transfer the batter to the prepared pan. Bake at 200°C with conventional top-and-bottom heat for 35–40 minutes. Pierce the center with a toothpick; it should come out completely dry.',
      meta: '200°C · 35–40 min · top and bottom heat',
      checkpoint: 'The toothpick should come out completely dry.',
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
        },
        {
          id: 'prepare-pan',
          title: 'Підготуйте форму',
          body: 'Якщо форма висока, покладіть на дно шматок пергаменту. Бічні стінки змастіть вершковим маслом і присипте корицею.',
          tip: 'Кориця додає скоринці аромату та хрусткості.',
        },
        {
          id: 'blend-carrots',
          title: 'Перебийте моркву з олією',
          body: 'Натріть моркву вручну або в комбайні, а потім окремо перебийте її блендером з нейтральною олією до однорідності.',
        },
        {
          id: 'whip-eggs',
          title: 'Збийте яйця з цукром',
          body: 'Збийте яйця з цукром міксером або в комбайні до густої світлої піни. Маса має збільшитися в об’ємі у три-чотири рази.',
          checkpoint:
            'Яєчна маса має бути світлою, густою та у три-чотири рази більшою за початковий об’єм.',
        },
        {
          id: 'mix-batter',
          title: 'Змішайте тісто',
          body: 'З’єднайте морквяно-олійну масу зі збитими яйцями. Окремо змішайте борошно, розпушувач і сіль, додайте до рідких інгредієнтів та перемішайте до однорідності.',
        },
        {
          id: 'fold-add-ins',
          title: 'Додайте родзинки та горіхи',
          body: 'Додайте до готового тіста родзинки без зайвої води та подрібнені горіхи. Перемішайте до рівномірного розподілення.',
          tip: 'Зберігайте тісто в холодильнику та використайте протягом трьох днів.',
        },
        {
          id: 'bake',
          title: 'Спечіть кекс',
          body: 'Викладіть тісто в підготовлену форму. Випікайте при 200°C у режимі верхнього й нижнього нагріву протягом 35–40 хвилин. Проколіть кекс по центру зубочисткою — вона має вийти повністю сухою.',
          meta: '200°C · 35–40 хв · верхній і нижній нагрів',
          checkpoint: 'Зубочистка має вийти повністю сухою.',
        },
      ],
    },
  },
} satisfies RecipeSourceDraft;
