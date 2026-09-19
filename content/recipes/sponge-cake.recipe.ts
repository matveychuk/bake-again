import type { RecipeSourceDraft } from './source-recipe.types.ts';

export const spongeCakeRecipe = {
  id: 'sponge-cake',
  source: {
    file: 'docs/reference/recipe-inventory.xlsx',
    locator: 'Recipe Archive · Бісквіт',
  },
  completeness: 'readyToReview',
  evidence: {
    status: 'tested',
    explanation: 'This base version was baked successfully.',
  },
  beforeStart: [
    'Preheat the oven to 200°C.',
    'Prepare the form by greasing only its bottom.',
  ],
  ingredientSections: [
    {
      id: 'sponge',
      title: 'Sponge',
      ingredients: [
        {
          id: 'eggs',
          name: 'Large eggs',
          quantity: {
            base: { kind: 'exact', value: 5, unit: 'piece' },
            equivalent: { kind: 'exact', value: 6, unit: 'piece' },
            shopping: { mode: 'base', increment: 1, rounding: 'up' },
          },
          note: 'Use 5 large eggs or 6 small eggs.',
        },
        {
          id: 'sugar-whites',
          name: 'Sugar for the whites',
          quantity: {
            base: { kind: 'exact', value: 120, unit: 'g' },
            shopping: { mode: 'base' },
          },
          note: 'Recorded as an incomplete glass, marked 120 g in the source.',
        },
        {
          id: 'sugar-yolks',
          name: 'Sugar for the yolks',
          quantity: {
            base: { kind: 'exact', value: 2, unit: 'tbsp' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'corn-starch',
          name: 'Corn starch',
          quantity: {
            base: { kind: 'exact', value: 15, unit: 'g' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'tapioca',
          name: 'Tapioca starch',
          quantity: {
            base: { kind: 'exact', value: 70, unit: 'g' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'flour',
          name: 'Schär Mix B Bread flour',
          quantity: {
            base: { kind: 'exact', value: 140, unit: 'g' },
            shopping: { mode: 'base' },
          },
        },
      ],
    },
  ],
  steps: [
    {
      id: 'separate',
      title: 'Preheat the oven and separate the eggs',
      body: 'Preheat the oven to 200°C. Separate the whites and yolks into different bowls.',
      meta: '200°C',
      cookIngredients: [{ ingredientId: 'eggs' }],
    },
    {
      id: 'whip-whites',
      title: 'Whip the whites and add sugar',
      body: 'Whip the whites on their own first. Add 120 g sugar gradually in 3–4 additions and continue whipping.',
      tip: 'Wait for a thick white foam before beginning to add the sugar.',
      checkpoint:
        'Before the sugar goes in, the whites form a thick white foam.',
      cookIngredients: [{ ingredientId: 'sugar-whites' }],
      media: [
        {
          id: 'sponge-whipped-whites-v1',
          src: '/media/recipes/sponge-cake/selected/whipped-whites-v1.png',
          alt: 'Thick white egg foam holding its shape on a lifted whisk',
          title: 'Check the whipped whites',
          caption:
            'Whip the whites alone until they form a thick white foam, then begin adding sugar.',
        },
      ],
    },
    {
      id: 'whip-yolks',
      title: 'Whip the yolks with sugar',
      body: 'Whip the yolks with 2 tablespoons sugar until the mixture becomes pale and thick.',
      checkpoint: 'The yolk mixture is visibly paler and thicker.',
      cookIngredients: [{ ingredientId: 'sugar-yolks' }],
      media: [
        {
          id: 'sponge-whipped-yolks-v1',
          src: '/media/recipes/sponge-cake/selected/whipped-yolks-v1.png',
          alt: 'Pale thick yolk mixture falling from a whisk in a broad ribbon',
          title: 'Check the yolks',
          caption:
            'The yolks should be pale, thick and leave a ribbon on the surface.',
        },
      ],
    },
    {
      id: 'fold-yolks',
      title: 'Fold the yolks into the whites',
      body: 'Use a spoon to fold the yolk mixture gently into the whipped whites.',
      tip: 'Fold gently with a spoon so the egg foam keeps its volume.',
      media: [
        {
          id: 'sponge-fold-yolks-v1',
          src: '/media/recipes/sponge-cake/selected/fold-yolks-v1.png',
          alt: 'Pale yolk mixture being gently folded through whipped egg whites',
          title: 'Fold without deflating',
          caption:
            'Use slow folds and keep the airy white and yellow ribbons visible while combining.',
        },
      ],
    },
    {
      id: 'fold-dry',
      title: 'Fold in the dry ingredients',
      body: 'Add the corn starch, tapioca starch and flour in 2–3 additions, folding gently after each one.',
      tip: 'Divide the dry ingredients into 2–3 additions rather than adding everything at once.',
      cookIngredients: [
        { ingredientId: 'corn-starch' },
        { ingredientId: 'tapioca' },
        { ingredientId: 'flour' },
      ],
      media: [
        {
          id: 'sponge-fold-dry-v1',
          src: '/media/recipes/sponge-cake/selected/fold-dry-v1.png',
          alt: 'Dry ingredients being sifted over airy sponge batter before folding',
          title: 'Add the dry mix in portions',
          caption:
            'Add one of the 2–3 portions, then fold gently before adding the next.',
        },
      ],
    },
    {
      id: 'bake',
      title: 'Transfer and bake the sponge',
      body: 'Grease only the bottom of the form, transfer the batter and bake at 200°C for approximately 40–50 minutes.',
      meta: '200°C · 40–50 min',
      tip: 'Grease only the bottom of the form, as recorded in the source.',
      media: [
        {
          id: 'sponge-batter-form-v1',
          src: '/media/recipes/sponge-cake/selected/batter-in-long-form-v1.png',
          alt: 'Airy sponge batter being poured into a long metal baking form',
          title: 'Transfer to the long form',
          caption:
            'Pour the finished airy batter into the form prepared on the bottom only.',
        },
      ],
    },
  ],
  gapNote:
    'Confirm the dimensions of the recorded long form, an observable doneness cue, active time and total elapsed time.',
  translations: {
    uk: {
      completeness: 'readyToReview',
      evidence: {
        status: 'tested',
        explanation: 'Цю базову версію успішно випікали.',
      },
      beforeStart: [
        'Розігрійте духовку до 200°C.',
        'Підготуйте форму: змастіть лише дно.',
      ],
      ingredientSections: [
        {
          id: 'sponge',
          title: 'Бісквіт',
          ingredients: [
            {
              id: 'eggs',
              name: 'Великі яйця',
              quantity: {
                base: { kind: 'exact', value: 5, unit: 'piece' },
                equivalent: { kind: 'exact', value: 6, unit: 'piece' },
                shopping: { mode: 'base', increment: 1, rounding: 'up' },
              },
              note: 'Візьміть 5 великих або 6 маленьких яєць.',
            },
            {
              id: 'sugar-whites',
              name: 'Цукор для білків',
              quantity: {
                base: { kind: 'exact', value: 120, unit: 'g' },
                shopping: { mode: 'base' },
              },
              note: 'У джерелі записано неповну склянку з позначкою 120 г.',
            },
            {
              id: 'sugar-yolks',
              name: 'Цукор для жовтків',
              quantity: {
                base: { kind: 'exact', value: 2, unit: 'tbsp' },
                shopping: { mode: 'base' },
              },
            },
            {
              id: 'corn-starch',
              name: 'Кукурудзяний крохмаль',
              quantity: {
                base: { kind: 'exact', value: 15, unit: 'g' },
                shopping: { mode: 'base' },
              },
            },
            {
              id: 'tapioca',
              name: 'Тапіоковий крохмаль',
              quantity: {
                base: { kind: 'exact', value: 70, unit: 'g' },
                shopping: { mode: 'base' },
              },
            },
            {
              id: 'flour',
              name: 'Борошно Schär Mix B Bread',
              quantity: {
                base: { kind: 'exact', value: 140, unit: 'g' },
                shopping: { mode: 'base' },
              },
            },
          ],
        },
      ],
      steps: [
        {
          id: 'separate',
          title: 'Розігрійте духовку та розділіть яйця',
          body: 'Розігрійте духовку до 200°C. Розділіть білки та жовтки у різні миски.',
          meta: '200°C',
          cookIngredients: [{ ingredientId: 'eggs' }],
        },
        {
          id: 'whip-whites',
          title: 'Збийте білки й додайте цукор',
          body: 'Спочатку збийте самі білки. Поступово, за 3–4 рази, додайте 120 г цукру й продовжуйте збивати.',
          tip: 'Починайте додавати цукор лише після появи густої білої піни.',
          checkpoint: 'Перед додаванням цукру білки утворили густу білу піну.',
          cookIngredients: [{ ingredientId: 'sugar-whites' }],
          media: [
            {
              id: 'sponge-whipped-whites-v1',
              src: '/media/recipes/sponge-cake/selected/whipped-whites-v1.png',
              alt: 'Густа біла яєчна піна тримає форму на піднятому вінчику',
              title: 'Перевірте збиті білки',
              caption:
                'Збийте самі білки до густої білої піни, а тоді починайте додавати цукор.',
            },
          ],
        },
        {
          id: 'whip-yolks',
          title: 'Збийте жовтки з цукром',
          body: 'Збийте жовтки з 2 столовими ложками цукру, доки маса не посвітлішає й не загусне.',
          checkpoint: 'Жовткова маса помітно посвітлішала й загусла.',
          cookIngredients: [{ ingredientId: 'sugar-yolks' }],
          media: [
            {
              id: 'sponge-whipped-yolks-v1',
              src: '/media/recipes/sponge-cake/selected/whipped-yolks-v1.png',
              alt: 'Світла густа жовткова маса стікає з вінчика широкою стрічкою',
              title: 'Перевірте жовтки',
              caption:
                'Жовткова маса має посвітлішати, загуснути й залишати стрічку на поверхні.',
            },
          ],
        },
        {
          id: 'fold-yolks',
          title: 'Вмішайте жовтки в білки',
          body: 'Обережно вмішайте жовткову масу у збиті білки ложкою.',
          tip: 'Працюйте ложкою обережно, щоб яєчна піна не втратила об’єм.',
          media: [
            {
              id: 'sponge-fold-yolks-v1',
              src: '/media/recipes/sponge-cake/selected/fold-yolks-v1.png',
              alt: 'Світлу жовткову масу обережно вмішують у збиті білки',
              title: 'Вмішуйте, не осаджуючи піну',
              caption:
                'Робіть повільні рухи й під час змішування зберігайте повітряні білі та жовті шари.',
            },
          ],
        },
        {
          id: 'fold-dry',
          title: 'Вмішайте сухі інгредієнти',
          body: 'За 2–3 рази додайте кукурудзяний і тапіоковий крохмалі та борошно, щоразу обережно перемішуючи.',
          tip: 'Не додавайте всі сухі інгредієнти одразу: розділіть їх на 2–3 порції.',
          cookIngredients: [
            { ingredientId: 'corn-starch' },
            { ingredientId: 'tapioca' },
            { ingredientId: 'flour' },
          ],
          media: [
            {
              id: 'sponge-fold-dry-v1',
              src: '/media/recipes/sponge-cake/selected/fold-dry-v1.png',
              alt: 'Сухі інгредієнти просіюють на повітряне бісквітне тісто перед вмішуванням',
              title: 'Додавайте суху суміш порціями',
              caption:
                'Додайте одну з 2–3 порцій і обережно вмішайте її перед наступною.',
            },
          ],
        },
        {
          id: 'bake',
          title: 'Перекладіть у форму та спечіть',
          body: 'Змастіть лише дно форми, перекладіть тісто й випікайте приблизно 40–50 хвилин при 200°C.',
          meta: '200°C · 40–50 хв',
          tip: 'За записом у джерелі потрібно змастити лише дно форми.',
          media: [
            {
              id: 'sponge-batter-form-v1',
              src: '/media/recipes/sponge-cake/selected/batter-in-long-form-v1.png',
              alt: 'Повітряне бісквітне тісто переливають у довгу металеву форму',
              title: 'Перекладіть у довгу форму',
              caption:
                'Перелийте готове повітряне тісто у форму, підготовлену лише на дні.',
            },
          ],
        },
      ],
      gapNote:
        'Потрібно уточнити розміри записаної довгої форми, ознаку готовності, активний і загальний час.',
    },
  },
} satisfies RecipeSourceDraft;
