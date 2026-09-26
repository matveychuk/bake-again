import type { RecipeSourceDraft } from './source-recipe.types.ts';
import { quantityFromGrams, quantityFromSpoons } from './spoon-weights.ts';

export const appleFrittersRecipe = {
  id: 'apple-fritters',
  publicationStatus: 'published',
  presentation: 'concise',
  showImageNote: false,
  source: {
    file: 'https://trueua.info/news/smachno-ta-korysno-retsept-yabluchnykh-oladkiv-bez-tsukru',
    locator:
      'Яблучні оладки · exact ingredient list and method supplied by the author, adapted with Schär Mix B Bread',
  },
  completeness: 'readyToReview',
  evidence: {
    status: 'tested',
    explanation: 'This exact version was cooked successfully.',
  },
  difficulty: 'easy',
  yield: {
    id: 'twenty-fritters',
    label: '20 fritters',
    count: { kind: 'exact', value: 20 },
    unit: 'serving',
  },
  timing: {
    activeMinutes: 30,
    totalElapsedMinutes: null,
    planningNote: {
      text: 'A handy rule of thumb: one large apple per person.',
    },
    phases: [],
  },
  ingredientSections: [
    {
      id: 'batter',
      title: 'Apple fritter batter',
      ingredients: [
        {
          id: 'apples',
          name: 'Apples',
          quantity: {
            base: { kind: 'exact', value: 3, unit: 'piece' },
            shopping: { mode: 'base', increment: 1, rounding: 'up' },
          },
          note: 'Peel and grate coarsely.',
        },
        {
          id: 'eggs',
          name: 'Eggs',
          quantity: {
            base: { kind: 'exact', value: 2, unit: 'piece' },
            shopping: { mode: 'base', increment: 1, rounding: 'up' },
          },
        },
        {
          id: 'kefir-or-yogurt',
          name: 'Kefir or natural yogurt',
          quantity: {
            base: { kind: 'exact', value: 150, unit: 'g' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'flour',
          name: 'Schär Mix B Bread flour',
          quantity: quantityFromGrams('schar-mix-b', 100),
        },
        {
          id: 'sweetener',
          name: 'Sugar or a ripe soft banana',
          quantity: {
            base: null,
            equivalent: { kind: 'exact', value: 1, unit: 'tbsp' },
            shopping: { mode: 'nameOnly' },
          },
          note: 'Use 1 tbsp sugar, or mash 1 ripe soft banana and add it instead of the sugar.',
        },
        {
          id: 'baking-soda',
          name: 'Baking soda',
          quantity: quantityFromSpoons('baking-soda', 0.5, 'tsp'),
        },
        {
          id: 'oil',
          name: 'Oil for frying',
          quantity: {
            base: null,
            shopping: { mode: 'nameOnly' },
          },
        },
      ],
    },
  ],
  steps: [
    {
      id: 'prepare-apples',
      title: 'Prepare the apples',
      body: 'Wash and peel the apples, then grate them on the coarse side of a grater. Do not grate them finely, or they will release too much juice.',
      checkpoint:
        'The apples are in distinct coarse shreds rather than a fine, wet pulp.',
      cookIngredients: [{ ingredientId: 'apples' }],
      media: [
        {
          id: 'apple-fritters-coarse-grated-apples-v1',
          src: '/media/recipes/apple-fritters/selected/step-01-coarse-grated-apples-v1.webp',
          alt: 'Peeled apples grated into coarse shreds in a ceramic bowl',
        },
      ],
    },
    {
      id: 'mix-batter',
      title: 'Mix the batter',
      body: 'Crack the eggs directly into the grated apples. Add the kefir or yogurt and the sugar, or the mashed banana instead of sugar, then mix. Add the Schär Mix B Bread flour and baking soda and stir until combined.',
      cookIngredients: [
        { ingredientId: 'eggs' },
        { ingredientId: 'kefir-or-yogurt' },
        { ingredientId: 'sweetener' },
        { ingredientId: 'flour' },
        { ingredientId: 'baking-soda' },
      ],
      media: [
        {
          id: 'apple-fritters-mix-batter-v1',
          src: '/media/recipes/apple-fritters/selected/step-02-mix-batter-v1.webp',
          alt: 'Thick apple-fritter batter with coarse apple shreds mixed in a ceramic bowl',
        },
      ],
    },
    {
      id: 'fry',
      title: 'Fry the fritters',
      body: 'Heat a little oil in a frying pan. Spoon 1 tablespoon of batter per fritter into the hot pan and fry over medium heat for 2–3 minutes per side, so the apples have time to cook through.',
      meta: '2–3 min per side · medium heat',
      checkpoint:
        'Turn when the underside is golden and the top has begun to set around the edges; the centre should no longer look wet after the second side cooks.',
      tip: 'Lower the heat if the outside browns before the top begins to set.',
      cookIngredients: [
        {
          ingredientId: 'oil',
          quantity: 'omit',
          note: 'Add a little more between batches if needed.',
        },
      ],
      media: [
        {
          id: 'apple-fritters-fry-fritters-v1',
          src: '/media/recipes/apple-fritters/selected/step-03-fry-fritters-v1.webp',
          alt: 'Small apple fritters frying in a lightly oiled uncovered pan',
        },
      ],
    },
  ],
  translations: {
    uk: {
      presentation: 'concise',
      showImageNote: false,
      completeness: 'readyToReview',
      evidence: {
        status: 'tested',
        explanation: 'Цю версію успішно приготовано.',
      },
      difficulty: 'easy',
      yield: {
        id: 'twenty-fritters',
        label: '20 оладок',
        count: { kind: 'exact', value: 20 },
        unit: 'serving',
      },
      timing: {
        activeMinutes: 30,
        totalElapsedMinutes: null,
        planningNote: {
          text: 'Зручний розрахунок: одне велике яблуко на людину.',
        },
        phases: [],
      },
      ingredientSections: [
        {
          id: 'batter',
          title: 'Тісто для яблучних оладок',
          ingredients: [
            {
              id: 'apples',
              name: 'Яблука',
              quantity: {
                base: { kind: 'exact', value: 3, unit: 'piece' },
                shopping: { mode: 'base', increment: 1, rounding: 'up' },
              },
              note: 'Очистьте та натріть на великій тертці.',
            },
            {
              id: 'eggs',
              name: 'Яйця',
              quantity: {
                base: { kind: 'exact', value: 2, unit: 'piece' },
                shopping: { mode: 'base', increment: 1, rounding: 'up' },
              },
            },
            {
              id: 'kefir-or-yogurt',
              name: 'Кефір або натуральний йогурт',
              quantity: {
                base: { kind: 'exact', value: 150, unit: 'g' },
                shopping: { mode: 'base' },
              },
            },
            {
              id: 'flour',
              name: 'Борошно Schär Mix B Bread',
              quantity: {
                base: { kind: 'exact', value: 100, unit: 'g' },
                equivalent: { kind: 'exact', value: 5, unit: 'tbsp' },
                shopping: { mode: 'base' },
              },
            },
            {
              id: 'sweetener',
              name: 'Цукор або стиглий м’який банан',
              quantity: {
                base: null,
                equivalent: { kind: 'exact', value: 1, unit: 'tbsp' },
                shopping: { mode: 'nameOnly' },
              },
              note: 'Візьміть 1 ст. л. цукру або розімніть 1 стиглий м’який банан і додайте замість цукру.',
            },
            {
              id: 'baking-soda',
              name: 'Харчова сода',
              quantity: {
                base: { kind: 'exact', value: 0.5, unit: 'tsp' },
                shopping: { mode: 'base' },
              },
            },
            {
              id: 'oil',
              name: 'Олія для смаження',
              quantity: {
                base: null,
                shopping: { mode: 'nameOnly' },
              },
            },
          ],
        },
      ],
      steps: [
        {
          id: 'prepare-apples',
          title: 'Підготуйте яблука',
          body: 'Помийте й очистьте яблука, потім натріть їх на великій тертці. Не натирайте дрібно, інакше яблука пустять забагато соку.',
          checkpoint:
            'Яблука натерті виразною великою стружкою, а не перетворені на дрібну вологу масу.',
          cookIngredients: [{ ingredientId: 'apples' }],
          media: [
            {
              id: 'apple-fritters-coarse-grated-apples-v1',
              src: '/media/recipes/apple-fritters/selected/step-01-coarse-grated-apples-v1.webp',
              alt: 'Очищені яблука натирають великою стружкою в керамічну миску',
            },
          ],
        },
        {
          id: 'mix-batter',
          title: 'Замішайте тісто',
          body: 'Прямо в натерті яблука вбийте яйця. Додайте кефір або йогурт і цукор чи розім’ятий банан замість цукру, перемішайте. Потім додайте борошно Schär Mix B Bread і соду та перемішайте до поєднання.',
          cookIngredients: [
            { ingredientId: 'eggs' },
            { ingredientId: 'kefir-or-yogurt' },
            { ingredientId: 'sweetener' },
            { ingredientId: 'flour' },
            { ingredientId: 'baking-soda' },
          ],
          media: [
            {
              id: 'apple-fritters-mix-batter-v1',
              src: '/media/recipes/apple-fritters/selected/step-02-mix-batter-v1.webp',
              alt: 'Густе тісто для оладок із великою яблучною стружкою перемішують у керамічній мисці',
            },
          ],
        },
        {
          id: 'fry',
          title: 'Посмажте оладки',
          body: 'Розігрійте пательню з невеликою кількістю олії. Викладайте на гарячу пательню по 1 столовій ложці тіста на оладок і смажте на середньому вогні по 2–3 хвилини з кожного боку, щоб яблука встигли пропектися.',
          meta: 'По 2–3 хв з кожного боку · середній вогонь',
          checkpoint:
            'Перевертайте, коли низ уже золотистий, а поверхня почала схоплюватися по краях; після другого боку серединка не має виглядати вологою.',
          tip: 'Зменште вогонь, якщо скоринка темнішає раніше, ніж поверхня починає схоплюватися.',
          cookIngredients: [
            {
              ingredientId: 'oil',
              quantity: 'omit',
              note: 'За потреби додайте ще трохи олії між партіями.',
            },
          ],
          media: [
            {
              id: 'apple-fritters-fry-fritters-v1',
              src: '/media/recipes/apple-fritters/selected/step-03-fry-fritters-v1.webp',
              alt: 'Невеликі яблучні оладки смажаться на відкритій пательні з тонким шаром олії',
            },
          ],
        },
      ],
    },
  },
} satisfies RecipeSourceDraft;
