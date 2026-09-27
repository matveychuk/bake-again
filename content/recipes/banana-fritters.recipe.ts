import { localizeRecipeContent } from "./localize-content.ts";
import { banana_frittersEs } from "./translations/banana-fritters.es.ts";
import type { RecipeSourceDraft } from './source-recipe.types.ts';
import { quantityFromGrams, quantityFromSpoons } from './spoon-weights.ts';

const bananaFrittersRecipeBase = {
  publicationStatus: 'published',
  translationState: { uk: 'reviewed', en: 'reviewed', es: 'reviewed' },
  presentation: 'concise',
  id: 'banana-fritters',
  source: {
    file: 'https://natashaskitchen.com/banana-pancakes/',
    locator:
      'Banana Pancakes · author-tested 500 g banana and Greek-yogurt adaptation with Schär Mix B Bread',
  },
  completeness: 'readyToReview',
  evidence: {
    status: 'tested',
    explanation: 'This exact version was cooked successfully.',
  },
  yield: {
    id: 'twenty-eight-pancakes',
    label: '28 pancakes',
    count: { kind: 'exact', value: 28 },
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
  ingredientSections: [
    {
      id: 'batter',
      title: 'Banana pancake batter',
      ingredients: [
        {
          id: 'bananas',
          name: 'Very ripe bananas, peeled',
          quantity: {
            base: { kind: 'exact', value: 500, unit: 'g' },
            equivalent: { kind: 'range', min: 4, max: 5, unit: 'piece' },
            shopping: { mode: 'base' },
          },
          note: 'Weigh after peeling.',
        },
        {
          id: 'flour',
          name: 'Schär Mix B Bread flour',
          quantity: quantityFromGrams('schar-mix-b', 200),
        },
        {
          id: 'sugar',
          name: 'Sugar',
          quantity: quantityFromSpoons('granulated-sugar', 1, 'tbsp'),
          note: 'Omit if the bananas are very ripe and sweet.',
          optional: true,
        },
        {
          id: 'baking-powder',
          name: 'Baking powder',
          quantity: quantityFromSpoons('baking-powder', 1, 'tsp'),
        },
        {
          id: 'salt',
          name: 'Salt',
          quantity: quantityFromSpoons('fine-salt', 0.25, 'tsp'),
        },
        {
          id: 'greek-yogurt',
          name: 'Greek yoghurt',
          quantity: {
            base: { kind: 'exact', value: 250, unit: 'g' },
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
          id: 'butter',
          name: 'Unsalted butter, melted',
          quantity: {
            base: { kind: 'exact', value: 30, unit: 'g' },
            equivalent: { kind: 'exact', value: 2, unit: 'tbsp' },
            shopping: { mode: 'base' },
          },
          optional: true,
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
      id: 'mix-wet',
      title: 'Mash and mix',
      body: 'Mash the bananas with a fork, leaving small soft pieces. Add the eggs, Greek yoghurt and vanilla. Add the melted butter, if using, and whisk until combined.',
      cookIngredients: [
        { ingredientId: 'bananas' },
        { ingredientId: 'eggs' },
        { ingredientId: 'greek-yogurt' },
        { ingredientId: 'butter' },
        { ingredientId: 'vanilla' },
      ],
      media: [
        {
          id: 'banana-pancakes-mashed-bananas-v1',
          src: '/media/recipes/banana-fritters/selected/mashed-bananas-v1.webp',
          alt: 'Very ripe bananas mashed with a fork while small soft pieces remain',
        },
        {
          id: 'banana-pancakes-wet-mixture-v1',
          src: '/media/recipes/banana-fritters/selected/wet-mixture-v1.webp',
          alt: 'Pale golden banana and Greek yoghurt mixture with small banana flecks',
        },
      ],
    },
    {
      id: 'mix-batter',
      title: 'Add the dry ingredients',
      body: 'Add the Schär Mix B Bread flour, baking powder, salt and sugar, if using. Mix with a spoon or whisk only until combined.',
      cookIngredients: [
        { ingredientId: 'flour' },
        { ingredientId: 'baking-powder' },
        { ingredientId: 'salt' },
        { ingredientId: 'sugar' },
      ],
      checkpoint:
        'The batter is thick and spoonable, with small lumps remaining.',
      media: [
        {
          id: 'banana-pancakes-lumpy-batter-v1',
          src: '/media/recipes/banana-fritters/selected/lumpy-batter-v1.webp',
          alt: 'Thick banana pancake batter falling from a spatula with small lumps visible',
        },
      ],
    },
    {
      id: 'portion',
      title: 'Preheat the pan and portion',
      body: 'Heat a pan over medium heat and lightly grease it with oil. Spoon 1 tablespoon of batter per pancake, leaving a little space between them.',
      cookIngredients: [{ ingredientId: 'oil' }],
    },
    {
      id: 'cook',
      title: 'Cook, flip and serve',
      body: 'Cook until the edges look matte and the bubbles on top begin to pop. Flip and cook until the second side is golden. Add a little more oil as needed. Serve warm; these pancakes pair especially well with honey.',
      tip: 'Lower the heat if the pancakes brown before the bubbles begin to pop.',
      cookIngredients: [
        {
          ingredientId: 'oil',
          quantity: 'omit',
          note: 'Use the remaining oil as needed.',
        },
      ],
      media: [
        {
          id: 'banana-pancakes-flip-cue-author-v1',
          src: '/media/recipes/banana-fritters/selected/flip-cue-author-v1.webp',
          alt: 'Homemade banana pancakes cooking on a pan as bubbles open on the surface',
        },
        {
          id: 'banana-pancakes-finished-pan-author-v1',
          src: '/media/recipes/banana-fritters/selected/finished-pan-author-v1.webp',
          alt: 'Thick irregular banana pancakes cooked until golden brown on a pan',
        },
      ],
    },
  ],
  translations: {
    uk: {
      presentation: 'concise',
      completeness: 'readyToReview',
      evidence: {
        status: 'tested',
        explanation: 'Цю версію успішно приготовано.',
      },
      yield: {
        id: 'twenty-eight-pancakes',
        label: '28 панкейків',
        count: { kind: 'exact', value: 28 },
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
      ingredientSections: [
        {
          id: 'batter',
          title: 'Тісто для бананових панкейків',
          ingredients: [
            {
              id: 'bananas',
              name: 'Дуже стиглі банани, очищені',
              quantity: {
                base: { kind: 'exact', value: 500, unit: 'g' },
                equivalent: {
                  kind: 'range',
                  min: 4,
                  max: 5,
                  unit: 'piece',
                },
                shopping: { mode: 'base' },
              },
              note: 'Зважуйте без шкірки.',
            },
            {
              id: 'flour',
              name: 'Борошно Schär Mix B Bread',
              quantity: quantityFromGrams('schar-mix-b', 200),
            },
            {
              id: 'sugar',
              name: 'Цукор',
              quantity: quantityFromSpoons('granulated-sugar', 1, 'tbsp'),
              note: 'Не додавайте, якщо банани дуже стиглі й солодкі.',
              optional: true,
            },
            {
              id: 'baking-powder',
              name: 'Розпушувач',
              quantity: quantityFromSpoons('baking-powder', 1, 'tsp'),
            },
            {
              id: 'salt',
              name: 'Сіль',
              quantity: quantityFromSpoons('fine-salt', 0.25, 'tsp'),
            },
            {
              id: 'greek-yogurt',
              name: 'Грецький йогурт',
              quantity: {
                base: { kind: 'exact', value: 250, unit: 'g' },
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
              id: 'butter',
              name: 'Вершкове масло, розтоплене',
              quantity: {
                base: { kind: 'exact', value: 30, unit: 'g' },
                equivalent: { kind: 'exact', value: 2, unit: 'tbsp' },
                shopping: { mode: 'base' },
              },
              optional: true,
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
          id: 'mix-wet',
          title: 'Розімніть і змішайте',
          body: 'Розімніть банани виделкою, залишаючи невеликі м’які шматочки. Додайте яйця, грецький йогурт і ваніль. За бажанням додайте розтоплене вершкове масло та перемішайте до об’єднання.',
          cookIngredients: [
            { ingredientId: 'bananas' },
            { ingredientId: 'eggs' },
            { ingredientId: 'greek-yogurt' },
            { ingredientId: 'butter' },
            { ingredientId: 'vanilla' },
          ],
          media: [
            {
              id: 'banana-pancakes-mashed-bananas-v1',
              src: '/media/recipes/banana-fritters/selected/mashed-bananas-v1.webp',
              alt: 'Дуже стиглі банани, розім’яті виделкою з невеликими м’якими шматочками',
            },
            {
              id: 'banana-pancakes-wet-mixture-v1',
              src: '/media/recipes/banana-fritters/selected/wet-mixture-v1.webp',
              alt: 'Світло-золотиста бананова суміш із грецьким йогуртом і дрібними часточками банана',
            },
          ],
        },
        {
          id: 'mix-batter',
          title: 'Додайте сухі інгредієнти',
          body: 'Додайте борошно Schär Mix B Bread, розпушувач, сіль і цукор, якщо використовуєте. Перемішайте ложкою або вінчиком лише до об’єднання.',
          cookIngredients: [
            { ingredientId: 'flour' },
            { ingredientId: 'baking-powder' },
            { ingredientId: 'salt' },
            { ingredientId: 'sugar' },
          ],
          checkpoint:
            'Тісто густе, легко набирається ложкою; невеликі грудочки залишаються.',
          media: [
            {
              id: 'banana-pancakes-lumpy-batter-v1',
              src: '/media/recipes/banana-fritters/selected/lumpy-batter-v1.webp',
              alt: 'Густе тісто для бананових панкейків із невеликими грудочками на лопатці',
            },
          ],
        },
        {
          id: 'portion',
          title: 'Розігрійте пательню й викладіть тісто',
          body: 'Розігрійте пательню на середньому вогні та злегка змастіть олією. Викладайте по 1 столовій ложці тіста на кожен панкейк, залишаючи між ними трохи місця.',
          cookIngredients: [{ ingredientId: 'oil' }],
        },
        {
          id: 'cook',
          title: 'Підсмажте, переверніть і подавайте',
          body: 'Смажте, доки краї стануть матовими, а бульбашки на поверхні почнуть лопатися. Переверніть і готуйте до золотистої скоринки з другого боку. За потреби додавайте трохи олії. Подавайте теплими — вони особливо добре смакують із медом.',
          tip: 'Зменште вогонь, якщо панкейки підрум’янюються раніше, ніж починають лопатися бульбашки.',
          cookIngredients: [
            {
              ingredientId: 'oil',
              quantity: 'omit',
              note: 'Додавайте решту олії за потреби.',
            },
          ],
          media: [
            {
              id: 'banana-pancakes-flip-cue-author-v1',
              src: '/media/recipes/banana-fritters/selected/flip-cue-author-v1.webp',
              alt: 'Домашні бананові панкейки на пательні, на поверхні яких відкриваються бульбашки',
            },
            {
              id: 'banana-pancakes-finished-pan-author-v1',
              src: '/media/recipes/banana-fritters/selected/finished-pan-author-v1.webp',
              alt: 'Товсті нерівні бананові панкейки, підсмажені на пательні до золотистої скоринки',
            },
          ],
        },
      ],
    },
  },
} satisfies RecipeSourceDraft;

export const bananaFrittersRecipe = {
  ...bananaFrittersRecipeBase,
  translations: {
    ...bananaFrittersRecipeBase.translations,
    es: localizeRecipeContent(bananaFrittersRecipeBase.translations.uk, banana_frittersEs),
  },
} satisfies RecipeSourceDraft;
