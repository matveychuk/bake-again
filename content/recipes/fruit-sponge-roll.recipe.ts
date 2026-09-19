import type { RecipeSourceDraft } from './source-recipe.types.ts';

export const fruitSpongeRollRecipe = {
  id: 'fruit-sponge-roll',
  source: {
    file: 'docs/reference/recipe-inventory.xlsx',
    locator: 'Recipe Archive · Бісквітний рулет з фруктами',
  },
  completeness: 'readyToReview',
  evidence: {
    status: 'tested',
    explanation: 'This base version was baked successfully.',
  },
  beforeStart: [
    'Line a baking tray with parchment.',
    'Roll the sponge while warm, then cool before filling.',
  ],
  ingredientSections: [
    {
      id: 'sponge',
      title: 'Sponge',
      ingredients: [
        {
          id: 'eggs',
          name: 'Eggs',
          quantity: {
            base: { kind: 'exact', value: 5, unit: 'piece' },
            shopping: { mode: 'base', increment: 1, rounding: 'up' },
          },
        },
        {
          id: 'sugar-sponge',
          name: 'Sugar',
          quantity: {
            base: { kind: 'exact', value: 100, unit: 'g' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'salt',
          name: 'Salt',
          quantity: {
            base: null,
            equivalent: { kind: 'exact', value: 1, unit: 'pinch' },
            shopping: { mode: 'nameOnly' },
          },
        },
        {
          id: 'oil',
          name: 'Oil',
          quantity: {
            base: { kind: 'exact', value: 35, unit: 'ml' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'water',
          name: 'Water',
          quantity: {
            base: { kind: 'exact', value: 35, unit: 'ml' },
            shopping: { mode: 'base', defaultSelected: false },
          },
        },
        {
          id: 'flour',
          name: 'Schär Mix B Bread flour',
          quantity: {
            base: { kind: 'exact', value: 120, unit: 'g' },
            shopping: { mode: 'base' },
          },
        },
      ],
    },
    {
      id: 'cream',
      title: 'Cream',
      ingredients: [
        {
          id: 'whipping-cream',
          name: 'Whipping cream',
          quantity: {
            base: { kind: 'exact', value: 250, unit: 'ml' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'sugar-cream',
          name: 'Sugar',
          quantity: {
            base: { kind: 'exact', value: 80, unit: 'g' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'mascarpone',
          name: 'Mascarpone',
          quantity: {
            base: { kind: 'exact', value: 250, unit: 'g' },
            shopping: { mode: 'base' },
          },
        },
      ],
    },
    {
      id: 'filling',
      title: 'Filling and decoration',
      ingredients: [
        {
          id: 'jam',
          name: 'Blueberry jam',
          quantity: { base: null, shopping: { mode: 'nameOnly' } },
        },
        {
          id: 'strawberries',
          name: 'Strawberries',
          quantity: { base: null, shopping: { mode: 'nameOnly' } },
        },
        {
          id: 'mint',
          name: 'Mint',
          quantity: { base: null, shopping: { mode: 'nameOnly' } },
          optional: true,
        },
        {
          id: 'almonds',
          name: 'Almonds',
          quantity: { base: null, shopping: { mode: 'nameOnly' } },
          optional: true,
        },
      ],
    },
  ],
  steps: [
    {
      id: 'whip-eggs',
      title: 'Whip eggs, sugar and salt',
      body: 'Whip the eggs, sponge sugar and salt for about 10 minutes.',
      meta: 'About 10 min',
      checkpoint: 'The mixture fills the bowl with thick, pale foam.',
      cookIngredients: [
        { ingredientId: 'eggs' },
        { ingredientId: 'sugar-sponge' },
        { ingredientId: 'salt' },
      ],
      media: [
        {
          id: 'fruit-roll-egg-foam-v1',
          src: '/media/recipes/fruit-sponge-roll/selected/whipped-egg-foam-v1.png',
          alt: 'Thick pale egg foam falling from a whisk into a mixing bowl',
          title: 'Check the whipped eggs',
          caption: 'The foam should be thick, pale and hold a broad ribbon.',
        },
      ],
    },
    {
      id: 'fold-liquids',
      title: 'Fold in oil and water',
      body: 'Add the oil and fold gently with a spoon. Add the water and fold again.',
      tip: 'Work gently with a spoon when adding both liquids.',
      cookIngredients: [{ ingredientId: 'oil' }, { ingredientId: 'water' }],
    },
    {
      id: 'fold-flour',
      title: 'Fold in flour',
      body: 'Gradually add the flour and fold carefully.',
      tip: 'Add the flour gradually and keep the mixing gentle.',
      cookIngredients: [{ ingredientId: 'flour' }],
    },
    {
      id: 'bake-roll',
      title: 'Bake and roll',
      body: 'Spread the batter on the parchment-lined tray. Bake for 15–20 minutes at 180–200°C, then roll the sponge and leave it to cool.',
      meta: '180–200°C · 15–20 min',
      tip: 'Roll the sponge after baking, then let it cool before adding the filling.',
      media: [
        {
          id: 'fruit-roll-batter-tray-v1',
          src: '/media/recipes/fruit-sponge-roll/selected/batter-on-tray-v1.png',
          alt: 'Thin layer of pale sponge batter spread on parchment in a baking tray',
          title: 'Spread the batter evenly',
          caption: 'Smooth the airy batter into a thin, even rectangle.',
        },
        {
          id: 'fruit-roll-warm-roll-v1',
          src: '/media/recipes/fruit-sponge-roll/selected/warm-sponge-roll-v1.png',
          alt: 'Warm golden sponge sheet being rolled with its parchment',
          title: 'Roll while warm',
          caption:
            'Use the parchment to guide the unfilled sponge into a loose roll.',
        },
      ],
    },
    {
      id: 'make-cream',
      title: 'Make the mascarpone cream',
      body: 'Whip the cream with the cream sugar, then add the mascarpone.',
      cookIngredients: [
        { ingredientId: 'whipping-cream' },
        { ingredientId: 'sugar-cream' },
        { ingredientId: 'mascarpone' },
      ],
      media: [
        {
          id: 'fruit-roll-mascarpone-cream-v1',
          src: '/media/recipes/fruit-sponge-roll/selected/mascarpone-cream-v1.png',
          alt: 'Smooth mascarpone cream holding a soft firm peak on a spatula',
          title: 'Check the cream',
          caption:
            'The finished cream should be smooth, spreadable and hold its shape.',
        },
      ],
    },
    {
      id: 'fill',
      title: 'Fill and decorate',
      body: 'Spread blueberry jam over the cooled sponge, then add the cream. Decorate with strawberries, mint and almonds.',
      cookIngredients: [
        { ingredientId: 'jam' },
        { ingredientId: 'strawberries' },
        { ingredientId: 'mint' },
        { ingredientId: 'almonds' },
      ],
    },
  ],
  gapNote:
    'Confirm the exact oven temperature within the recorded 180–200°C range, the rolling method, fruit quantities and total elapsed time.',
  translations: {
    uk: {
      completeness: 'readyToReview',
      evidence: {
        status: 'tested',
        explanation: 'Цю базову версію успішно випікали.',
      },
      beforeStart: [
        'Застеліть деко пергаментом.',
        'Згорніть бісквіт теплим, а перед додаванням начинки дайте йому охолонути.',
      ],
      ingredientSections: [
        {
          id: 'sponge',
          title: 'Бісквіт',
          ingredients: [
            {
              id: 'eggs',
              name: 'Яйця',
              quantity: {
                base: { kind: 'exact', value: 5, unit: 'piece' },
                shopping: { mode: 'base', increment: 1, rounding: 'up' },
              },
            },
            {
              id: 'sugar-sponge',
              name: 'Цукор',
              quantity: {
                base: { kind: 'exact', value: 100, unit: 'g' },
                shopping: { mode: 'base' },
              },
            },
            {
              id: 'salt',
              name: 'Сіль',
              quantity: {
                base: null,
                equivalent: { kind: 'exact', value: 1, unit: 'pinch' },
                shopping: { mode: 'nameOnly' },
              },
              note: 'Трохи, за записом авторки.',
            },
            {
              id: 'oil',
              name: 'Олія',
              quantity: {
                base: { kind: 'exact', value: 35, unit: 'ml' },
                shopping: { mode: 'base' },
              },
            },
            {
              id: 'water',
              name: 'Вода',
              quantity: {
                base: { kind: 'exact', value: 35, unit: 'ml' },
                shopping: { mode: 'base', defaultSelected: false },
              },
            },
            {
              id: 'flour',
              name: 'Борошно Schär Mix B Bread',
              quantity: {
                base: { kind: 'exact', value: 120, unit: 'g' },
                shopping: { mode: 'base' },
              },
            },
          ],
        },
        {
          id: 'cream',
          title: 'Крем',
          ingredients: [
            {
              id: 'whipping-cream',
              name: 'Вершки для збивання',
              quantity: {
                base: { kind: 'exact', value: 250, unit: 'ml' },
                shopping: { mode: 'base' },
              },
            },
            {
              id: 'sugar-cream',
              name: 'Цукор',
              quantity: {
                base: { kind: 'exact', value: 80, unit: 'g' },
                shopping: { mode: 'base' },
              },
            },
            {
              id: 'mascarpone',
              name: 'Маскарпоне',
              quantity: {
                base: { kind: 'exact', value: 250, unit: 'g' },
                shopping: { mode: 'base' },
              },
            },
          ],
        },
        {
          id: 'filling',
          title: 'Начинка й оздоблення',
          ingredients: [
            {
              id: 'jam',
              name: 'Чорничне варення',
              quantity: { base: null, shopping: { mode: 'nameOnly' } },
            },
            {
              id: 'strawberries',
              name: 'Полуниця',
              quantity: { base: null, shopping: { mode: 'nameOnly' } },
            },
            {
              id: 'mint',
              name: 'М’ята',
              quantity: { base: null, shopping: { mode: 'nameOnly' } },
              optional: true,
            },
            {
              id: 'almonds',
              name: 'Мигдальні горішки',
              quantity: { base: null, shopping: { mode: 'nameOnly' } },
              optional: true,
            },
          ],
        },
      ],
      steps: [
        {
          id: 'whip-eggs',
          title: 'Збийте яйця, цукор і сіль',
          body: 'Збивайте яйця, 100 г цукру й сіль приблизно 10 хвилин.',
          meta: 'Приблизно 10 хв',
          checkpoint: 'Маса заповнила миску густою світлою піною.',
          cookIngredients: [
            { ingredientId: 'eggs' },
            { ingredientId: 'sugar-sponge' },
            { ingredientId: 'salt' },
          ],
          media: [
            {
              id: 'fruit-roll-egg-foam-v1',
              src: '/media/recipes/fruit-sponge-roll/selected/whipped-egg-foam-v1.png',
              alt: 'Густа світла яєчна піна стікає з вінчика в миску',
              title: 'Перевірте збиті яйця',
              caption:
                'Піна має бути густою, світлою та спадати широкою стрічкою.',
            },
          ],
        },
        {
          id: 'fold-liquids',
          title: 'Вмішайте олію та воду',
          body: 'Додайте 35 мл олії й обережно перемішайте ложкою. Додайте 35 мл води та знову перемішайте.',
          tip: 'Обидві рідини вмішуйте ложкою обережно.',
          cookIngredients: [{ ingredientId: 'oil' }, { ingredientId: 'water' }],
        },
        {
          id: 'fold-flour',
          title: 'Вмішайте борошно',
          body: 'Поступово додайте 120 г борошна й обережно перемішуйте.',
          tip: 'Додавайте борошно поступово й не перемішуйте різко.',
          cookIngredients: [{ ingredientId: 'flour' }],
        },
        {
          id: 'bake-roll',
          title: 'Спечіть і згорніть бісквіт',
          body: 'Вилийте тісто на застелене пергаментом деко. Випікайте 15–20 хвилин при 180–200°C, потім згорніть бісквіт і залиште охолонути.',
          meta: '180–200°C · 15–20 хв',
          tip: 'Згорніть бісквіт після випікання, а перед додаванням начинки дайте йому охолонути.',
          media: [
            {
              id: 'fruit-roll-batter-tray-v1',
              src: '/media/recipes/fruit-sponge-roll/selected/batter-on-tray-v1.png',
              alt: 'Тонкий шар світлого бісквітного тіста на пергаменті в деку',
              title: 'Рівномірно розподіліть тісто',
              caption:
                'Розрівняйте повітряне тісто тонким рівним прямокутником.',
            },
            {
              id: 'fruit-roll-warm-roll-v1',
              src: '/media/recipes/fruit-sponge-roll/selected/warm-sponge-roll-v1.png',
              alt: 'Теплий золотистий бісквіт згортають разом із пергаментом',
              title: 'Згорніть теплим',
              caption:
                'За допомогою пергаменту нещільно згорніть бісквіт без начинки.',
            },
          ],
        },
        {
          id: 'make-cream',
          title: 'Приготуйте крем із маскарпоне',
          body: 'Збийте 250 мл вершків із 80 г цукру, потім додайте 250 г маскарпоне.',
          cookIngredients: [
            { ingredientId: 'whipping-cream' },
            { ingredientId: 'sugar-cream' },
            { ingredientId: 'mascarpone' },
          ],
          media: [
            {
              id: 'fruit-roll-mascarpone-cream-v1',
              src: '/media/recipes/fruit-sponge-roll/selected/mascarpone-cream-v1.png',
              alt: 'Гладкий крем із маскарпоне тримає м’який стійкий вигин на лопатці',
              title: 'Перевірте крем',
              caption:
                'Готовий крем має бути гладким, придатним для намазування й тримати форму.',
            },
          ],
        },
        {
          id: 'fill',
          title: 'Начиніть і прикрасьте рулет',
          body: 'Намастіть охолоджений бісквіт чорничним варенням, зверху викладіть крем. Прикрасьте полуницею, м’ятою та мигдальними горішками.',
          cookIngredients: [
            { ingredientId: 'jam' },
            { ingredientId: 'strawberries' },
            { ingredientId: 'mint' },
            { ingredientId: 'almonds' },
          ],
        },
      ],
      gapNote:
        'Потрібно уточнити точну температуру в межах записаних 180–200°C, спосіб згортання, кількість фруктів і загальний час.',
    },
  },
} satisfies RecipeSourceDraft;
