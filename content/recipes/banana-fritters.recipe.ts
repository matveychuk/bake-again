import type { RecipeSourceDraft } from './source-recipe.types.ts';
import { quantityFromSpoons } from './spoon-weights.ts';

export const bananaFrittersRecipe = {
  publicationStatus: 'unpublished',
  id: 'banana-fritters',
  source: {
    file: 'https://natashaskitchen.com/banana-pancakes/',
    locator: 'Banana Pancakes · author adaptation with Schär Mix B Bread',
  },
  completeness: 'readyToReview',
  evidence: {
    status: 'tested',
    explanation: 'The author uses this recipe with Schär Mix B Bread.',
  },
  yield: {
    id: 'twelve-pancakes',
    label: '12 pancakes',
    count: { kind: 'exact', value: 12 },
    unit: 'serving',
  },
  timing: {
    activeMinutes: 30,
    totalElapsedMinutes: 30,
    phases: [
      {
        id: 'prep',
        label: 'Preparation',
        duration: { kind: 'exact', value: 18, unit: 'minute' },
      },
      {
        id: 'cook',
        label: 'Cooking',
        duration: { kind: 'exact', value: 12, unit: 'minute' },
      },
    ],
  },
  beforeStart: [
    'Use very ripe bananas for sweetness and a soft mash.',
    'Melt the butter and preheat a cast-iron or nonstick skillet to medium heat.',
  ],
  ingredientSections: [
    {
      id: 'batter',
      title: 'Banana pancake batter',
      ingredients: [
        {
          id: 'buttermilk',
          name: 'Buttermilk or kefir',
          quantity: {
            base: { kind: 'exact', value: 1.25, unit: 'cup' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'flour',
          name: 'Schär Mix B Bread flour',
          quantity: {
            base: null,
            equivalent: { kind: 'exact', value: 1.5, unit: 'cup' },
            shopping: { mode: 'nameOnly' },
          },
          note: 'Author adaptation in place of the original all-purpose flour. The source cup measure remains secondary until its gram weight is confirmed.',
        },
        {
          id: 'sugar',
          name: 'Sugar',
          quantity: quantityFromSpoons('granulated-sugar', 1, 'tbsp'),
          optional: true,
        },
        {
          id: 'baking-soda',
          name: 'Baking soda',
          quantity: quantityFromSpoons('baking-soda', 1, 'tsp'),
        },
        {
          id: 'salt',
          name: 'Salt',
          quantity: quantityFromSpoons('fine-salt', 0.25, 'tsp'),
        },
        {
          id: 'butter',
          name: 'Unsalted butter, melted',
          quantity: {
            base: { kind: 'exact', value: 3, unit: 'tbsp' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'eggs',
          name: 'Large eggs',
          quantity: {
            base: { kind: 'exact', value: 2, unit: 'piece' },
            shopping: { mode: 'base', increment: 1, rounding: 'up' },
          },
        },
        {
          id: 'vanilla',
          name: 'Vanilla extract',
          quantity: {
            base: { kind: 'exact', value: 1, unit: 'tsp' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'bananas',
          name: 'Medium ripe bananas',
          quantity: {
            base: { kind: 'exact', value: 2, unit: 'piece' },
            equivalent: { kind: 'exact', value: 1, unit: 'cup' },
            shopping: { mode: 'base', increment: 1, rounding: 'up' },
          },
          note: 'About 1 cup after mashing.',
        },
        {
          id: 'oil',
          name: 'Olive oil for the pan',
          quantity: {
            base: { kind: 'exact', value: 2, unit: 'tbsp' },
            shopping: { mode: 'base' },
          },
        },
      ],
    },
  ],
  steps: [
    {
      id: 'mix-dry',
      title: 'Mix the dry ingredients',
      body: 'Whisk the Schär Mix B Bread flour, sugar, baking soda and salt in a large bowl. Make a well in the centre.',
      cookIngredients: [
        { ingredientId: 'flour' },
        { ingredientId: 'sugar' },
        { ingredientId: 'baking-soda' },
        { ingredientId: 'salt' },
      ],
      media: [
        {
          id: 'banana-pancakes-dry-mix-v1',
          src: '/media/recipes/banana-fritters/selected/dry-mix-well-v1.png',
          alt: 'Gluten-free dry ingredients whisked together with a well in the centre',
          title: 'Make a well in the dry mix',
          caption:
            'Whisk the dry ingredients evenly, then open a well for the wet mixture.',
        },
      ],
    },
    {
      id: 'mash-bananas',
      title: 'Mash the bananas',
      body: 'Mash the bananas with a fork, leaving a chunky applesauce-like texture.',
      checkpoint:
        'The bananas are soft and mashed but still have small pieces.',
      cookIngredients: [{ ingredientId: 'bananas' }],
      media: [
        {
          id: 'banana-pancakes-mashed-bananas-v1',
          src: '/media/recipes/banana-fritters/selected/mashed-bananas-v1.png',
          alt: 'Very ripe bananas mashed with a fork while small soft pieces remain',
          title: 'Keep a little texture',
          caption: 'Stop mashing when the bananas resemble chunky applesauce.',
        },
      ],
    },
    {
      id: 'mix-wet',
      title: 'Mix the wet ingredients',
      body: 'In a second bowl, whisk the buttermilk or kefir, eggs, vanilla, mashed bananas and melted butter.',
      cookIngredients: [
        { ingredientId: 'buttermilk' },
        { ingredientId: 'eggs' },
        { ingredientId: 'vanilla' },
        { ingredientId: 'bananas', quantity: 'omit' },
        { ingredientId: 'butter' },
      ],
      media: [
        {
          id: 'banana-pancakes-wet-mixture-v1',
          src: '/media/recipes/banana-fritters/selected/wet-mixture-v1.png',
          alt: 'Pale golden banana and buttermilk mixture with small banana flecks',
          title: 'Whisk the wet mixture',
          caption:
            'Combine the wet ingredients until fluid and even, with small banana flecks still visible.',
        },
      ],
    },
    {
      id: 'mix-batter',
      title: 'Combine the batter briefly',
      body: 'Pour the wet mixture into the dry ingredients and whisk only until combined.',
      tip: 'Do not overmix; small lumps should remain.',
      checkpoint:
        'The batter is thick and lumpy rather than completely smooth.',
      media: [
        {
          id: 'banana-pancakes-lumpy-batter-v1',
          src: '/media/recipes/banana-fritters/selected/lumpy-batter-v1.png',
          alt: 'Thick banana pancake batter falling from a spatula with small lumps visible',
          title: 'Stop while the batter is lumpy',
          caption:
            'The finished batter should be thick and scoopable, with small lumps remaining.',
        },
      ],
    },
    {
      id: 'portion',
      title: 'Preheat the pan and portion',
      body: 'Heat a cast-iron or nonstick skillet over medium heat, about 175°C. Grease it with 1 tablespoon oil and scoop 1/4 cup batter per pancake, leaving at least 2.5 cm between them.',
      meta: 'Medium heat · about 175°C',
      tip: 'Use the same 1/4-cup measure for evenly sized pancakes.',
      cookIngredients: [{ ingredientId: 'oil' }],
    },
    {
      id: 'cook',
      title: 'Cook and flip the pancakes',
      body: 'Cook for about 2 minutes. Flip when the edges look matte and large surface bubbles begin to pop, then cook the second side for about 2 minutes. Add the remaining oil as needed.',
      meta: 'About 2 min per side',
      tip: 'Lower the heat if the pancakes brown before the bubbles begin to pop.',
      checkpoint:
        'The edges are matte and large bubbles on top are beginning to pop.',
      cookIngredients: [
        {
          ingredientId: 'oil',
          quantity: 'omit',
          note: 'Use the remaining oil as needed.',
        },
      ],
      media: [
        {
          id: 'banana-pancakes-flip-cue-v1',
          src: '/media/recipes/banana-fritters/selected/flip-cue-v1.png',
          alt: 'Round banana pancakes cooking with matte edges and large open surface bubbles',
          title: 'Wait for the flip cue',
          caption:
            'Flip when the edges look matte and the large bubbles on top begin to pop.',
        },
      ],
    },
  ],
  gapNote:
    'Record the gram weight used for Schär Mix B Bread and whether this adaptation needs any liquid adjustment before publication.',
  translations: {
    uk: {
      completeness: 'readyToReview',
      evidence: {
        status: 'tested',
        explanation: 'Авторка готує цей рецепт із борошном Schär Mix B Bread.',
      },
      yield: {
        id: 'twelve-pancakes',
        label: '12 панкейків',
        count: { kind: 'exact', value: 12 },
        unit: 'serving',
      },
      timing: {
        activeMinutes: 30,
        totalElapsedMinutes: 30,
        phases: [
          {
            id: 'prep',
            label: 'Підготовка',
            duration: { kind: 'exact', value: 18, unit: 'minute' },
          },
          {
            id: 'cook',
            label: 'Смаження',
            duration: { kind: 'exact', value: 12, unit: 'minute' },
          },
        ],
      },
      beforeStart: [
        'Візьміть дуже стиглі банани: вони солодші й легко розминаються.',
        'Розтопіть вершкове масло та розігрійте чавунну або антипригарну пательню на середньому вогні.',
      ],
      ingredientSections: [
        {
          id: 'batter',
          title: 'Тісто для бананових панкейків',
          ingredients: [
            {
              id: 'buttermilk',
              name: 'Маслянка або кефір',
              quantity: {
                base: { kind: 'exact', value: 1.25, unit: 'cup' },
                shopping: { mode: 'base' },
              },
            },
            {
              id: 'flour',
              name: 'Борошно Schär Mix B Bread',
              quantity: {
                base: { kind: 'exact', value: 1.5, unit: 'cup' },
                shopping: { mode: 'base' },
              },
              note: 'Адаптація авторки замість пшеничного борошна в оригіналі.',
            },
            {
              id: 'sugar',
              name: 'Цукор',
              quantity: {
                base: { kind: 'exact', value: 1, unit: 'tbsp' },
                shopping: { mode: 'base' },
              },
              optional: true,
            },
            {
              id: 'baking-soda',
              name: 'Харчова сода',
              quantity: {
                base: { kind: 'exact', value: 1, unit: 'tsp' },
                shopping: { mode: 'base' },
              },
            },
            {
              id: 'salt',
              name: 'Сіль',
              quantity: {
                base: { kind: 'exact', value: 0.25, unit: 'tsp' },
                shopping: { mode: 'base' },
              },
            },
            {
              id: 'butter',
              name: 'Вершкове масло, розтоплене',
              quantity: {
                base: { kind: 'exact', value: 3, unit: 'tbsp' },
                shopping: { mode: 'base' },
              },
            },
            {
              id: 'eggs',
              name: 'Великі яйця',
              quantity: {
                base: { kind: 'exact', value: 2, unit: 'piece' },
                shopping: { mode: 'base', increment: 1, rounding: 'up' },
              },
            },
            {
              id: 'vanilla',
              name: 'Ванільний екстракт',
              quantity: {
                base: { kind: 'exact', value: 1, unit: 'tsp' },
                shopping: { mode: 'base' },
              },
            },
            {
              id: 'bananas',
              name: 'Середні стиглі банани',
              quantity: {
                base: { kind: 'exact', value: 2, unit: 'piece' },
                equivalent: { kind: 'exact', value: 1, unit: 'cup' },
                shopping: { mode: 'base', increment: 1, rounding: 'up' },
              },
              note: 'Приблизно 1 склянка після розминання.',
            },
            {
              id: 'oil',
              name: 'Оливкова олія для пательні',
              quantity: {
                base: { kind: 'exact', value: 2, unit: 'tbsp' },
                shopping: { mode: 'base' },
              },
            },
          ],
        },
      ],
      steps: [
        {
          id: 'mix-dry',
          title: 'Змішайте сухі інгредієнти',
          body: 'Вінчиком змішайте у великій мисці борошно Schär Mix B Bread, цукор, соду й сіль. Зробіть у центрі заглиблення.',
          cookIngredients: [
            { ingredientId: 'flour' },
            { ingredientId: 'sugar' },
            { ingredientId: 'baking-soda' },
            { ingredientId: 'salt' },
          ],
          media: [
            {
              id: 'banana-pancakes-dry-mix-v1',
              src: '/media/recipes/banana-fritters/selected/dry-mix-well-v1.png',
              alt: 'Змішані сухі безглютенові інгредієнти із заглибленням у центрі',
              title: 'Зробіть заглиблення в сухій суміші',
              caption:
                'Рівномірно змішайте сухі інгредієнти, а потім зробіть заглиблення для рідкої суміші.',
            },
          ],
        },
        {
          id: 'mash-bananas',
          title: 'Розімніть банани',
          body: 'Розімніть банани виделкою до неоднорідної консистенції яблучного пюре.',
          checkpoint:
            'Банани м’які й розім’яті, але в масі залишаються невеликі шматочки.',
          cookIngredients: [{ ingredientId: 'bananas' }],
          media: [
            {
              id: 'banana-pancakes-mashed-bananas-v1',
              src: '/media/recipes/banana-fritters/selected/mashed-bananas-v1.png',
              alt: 'Дуже стиглі банани, розім’яті виделкою з невеликими м’якими шматочками',
              title: 'Залиште трохи текстури',
              caption:
                'Припиніть розминати, коли банани нагадують неоднорідне яблучне пюре.',
            },
          ],
        },
        {
          id: 'mix-wet',
          title: 'Змішайте рідкі інгредієнти',
          body: 'В іншій мисці змішайте вінчиком маслянку або кефір, яйця, ваніль, розім’яті банани та розтоплене масло.',
          cookIngredients: [
            { ingredientId: 'buttermilk' },
            { ingredientId: 'eggs' },
            { ingredientId: 'vanilla' },
            { ingredientId: 'bananas', quantity: 'omit' },
            { ingredientId: 'butter' },
          ],
          media: [
            {
              id: 'banana-pancakes-wet-mixture-v1',
              src: '/media/recipes/banana-fritters/selected/wet-mixture-v1.png',
              alt: 'Світло-золотиста бананова суміш із маслянкою та дрібними часточками банана',
              title: 'Змішайте рідку основу',
              caption:
                'Змішайте до однорідної рідкої основи, у якій ще видно дрібні часточки банана.',
            },
          ],
        },
        {
          id: 'mix-batter',
          title: 'Коротко замішайте тісто',
          body: 'Вилийте рідку суміш до сухих інгредієнтів і перемішайте вінчиком лише до об’єднання.',
          tip: 'Не вимішуйте довго: у тісті мають залишитися невеликі грудочки.',
          checkpoint: 'Тісто густе й неоднорідне, а не цілком гладке.',
          media: [
            {
              id: 'banana-pancakes-lumpy-batter-v1',
              src: '/media/recipes/banana-fritters/selected/lumpy-batter-v1.png',
              alt: 'Густе тісто для бананових панкейків із невеликими грудочками на лопатці',
              title: 'Зупиніться, поки тісто ще неоднорідне',
              caption:
                'Готове тісто густе, легко набирається міркою й має невеликі грудочки.',
            },
          ],
        },
        {
          id: 'portion',
          title: 'Розігрійте пательню й викладіть тісто',
          body: 'Розігрійте чавунну або антипригарну пательню на середньому вогні, приблизно до 175°C. Змастіть 1 столовою ложкою олії та викладайте по 1/4 склянки тіста, залишаючи між панкейками щонайменше 2,5 см.',
          meta: 'Середній вогонь · приблизно 175°C',
          tip: 'Відмірюйте однакові порції по 1/4 склянки, щоб панкейки були одного розміру.',
          cookIngredients: [{ ingredientId: 'oil' }],
        },
        {
          id: 'cook',
          title: 'Підсмажте й переверніть панкейки',
          body: 'Смажте приблизно 2 хвилини. Переверніть, коли краї стануть матовими, а великі бульбашки на поверхні почнуть лопатися, і готуйте другий бік ще приблизно 2 хвилини. За потреби додавайте решту олії.',
          meta: 'Приблизно по 2 хв з кожного боку',
          tip: 'Зменште вогонь, якщо панкейки підрум’янюються раніше, ніж починають лопатися бульбашки.',
          checkpoint:
            'Краї стали матовими, а великі бульбашки на поверхні починають лопатися.',
          cookIngredients: [
            {
              ingredientId: 'oil',
              quantity: 'omit',
              note: 'Додавайте решту олії за потреби.',
            },
          ],
          media: [
            {
              id: 'banana-pancakes-flip-cue-v1',
              src: '/media/recipes/banana-fritters/selected/flip-cue-v1.png',
              alt: 'Круглі бананові панкейки з матовими краями та великими відкритими бульбашками',
              title: 'Дочекайтеся моменту для перевертання',
              caption:
                'Перевертайте, коли краї стали матовими, а великі бульбашки зверху почали лопатися.',
            },
          ],
        },
      ],
      gapNote:
        'Перед публікацією запишіть вагу порції Schär Mix B Bread у грамах і уточніть, чи потребує ця адаптація коригування кількості рідини.',
    },
  },
} satisfies RecipeSourceDraft;
