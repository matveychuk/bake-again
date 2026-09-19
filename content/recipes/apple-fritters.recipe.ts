import type { RecipeSourceDraft } from './source-recipe.types.ts';

export const appleFrittersRecipe = {
  id: 'apple-fritters',
  publicationStatus: 'draft',
  source: {
    file: 'https://trueua.info/news/smachno-ta-korysno-retsept-yabluchnykh-oladkiv-bez-tsukru',
    locator:
      'Яблучні оладки · exact ingredient list and method supplied by the author, adapted with Schär Mix B Bread',
  },
  completeness: 'readyToReview',
  evidence: {
    status: 'tested',
    explanation:
      'The author supplied this exact apple-fritter version and uses Schär Mix B Bread.',
  },
  beforeStart: [
    'Use a medium grater so the apple softens as the small fritters cook.',
    'Keep the pan at medium heat and have a lid ready.',
  ],
  ingredientSections: [
    {
      id: 'batter',
      title: 'Apple fritter batter',
      ingredients: [
        {
          id: 'apples',
          name: 'Apples',
          quantity: {
            base: { kind: 'exact', value: 2, unit: 'piece' },
            shopping: { mode: 'base', increment: 1, rounding: 'up' },
          },
          note: 'Peel and grate on a medium grater.',
        },
        {
          id: 'egg',
          name: 'Egg',
          quantity: {
            base: { kind: 'exact', value: 1, unit: 'piece' },
            shopping: { mode: 'base', increment: 1, rounding: 'up' },
          },
        },
        {
          id: 'kefir-or-yogurt',
          name: 'Kefir or natural yogurt',
          quantity: {
            base: { kind: 'exact', value: 160, unit: 'g' },
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
        {
          id: 'sweetener',
          name: 'Sugar or honey',
          quantity: {
            base: { kind: 'exact', value: 1, unit: 'tbsp' },
            shopping: { mode: 'base' },
          },
          optional: true,
          note: 'Adjust to taste.',
        },
        {
          id: 'baking-soda',
          name: 'Baking soda',
          quantity: {
            base: { kind: 'exact', value: 0.5, unit: 'tsp' },
            shopping: { mode: 'base' },
          },
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
      body: 'Wash and peel the apples, then grate them on a medium grater.',
      checkpoint:
        'The apple is in short, fine shreds with no large pieces that could keep the centre from cooking evenly.',
      cookIngredients: [{ ingredientId: 'apples' }],
    },
    {
      id: 'mix-wet',
      title: 'Whisk the wet base',
      body: 'In a separate bowl, whisk the egg with the kefir or yogurt and the sugar or honey.',
      tip: 'Whisk the egg and kefir first, then add the sweetener so it disperses evenly.',
      cookIngredients: [
        { ingredientId: 'egg' },
        { ingredientId: 'kefir-or-yogurt' },
        { ingredientId: 'sweetener' },
      ],
    },
    {
      id: 'add-apples',
      title: 'Add the grated apples',
      body: 'Fold the grated apples into the wet mixture until evenly distributed.',
      cookIngredients: [{ ingredientId: 'apples', quantity: 'omit' }],
    },
    {
      id: 'finish-batter',
      title: 'Finish the batter',
      body: 'Add the Schär Mix B Bread flour and baking soda. Whisk thoroughly until the batter is uniform and as thick as sour cream.',
      checkpoint:
        'The batter is thick enough to hold a small mound on the spoon, then falls slowly rather than running.',
      tip: 'Stop mixing as soon as no dry flour remains and the apples are evenly suspended.',
      cookIngredients: [
        { ingredientId: 'flour' },
        { ingredientId: 'baking-soda' },
      ],
    },
    {
      id: 'heat-pan',
      title: 'Heat the pan',
      body: 'Heat a small amount of oil in a frying pan over medium heat.',
      tip: 'Keep the oil layer thin; add a little more between batches only when the pan looks dry.',
      cookIngredients: [{ ingredientId: 'oil' }],
    },
    {
      id: 'portion',
      title: 'Portion small fritters',
      body: 'Spoon the batter into the pan, shaping small fritters.',
      tip: 'Keep the fritters small and similar in size so their centres cook in the same time.',
    },
    {
      id: 'fry',
      title: 'Fry under a lid and turn',
      body: 'Cover and fry for 2–3 minutes per side, turning once, until both sides are golden.',
      meta: '2–3 min per side · medium heat · covered',
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
    },
  ],
  gapNote:
    'Before publication, record the yield, total cooking time and approximate amount of oil used for frying.',
  translations: {
    uk: {
      completeness: 'readyToReview',
      evidence: {
        status: 'tested',
        explanation:
          'Авторка надала саме цю версію яблучних оладок і готує її з борошном Schär Mix B Bread.',
      },
      beforeStart: [
        'Натирайте яблука на середній тертці, щоб вони встигли стати м’якими, поки невеликі оладки смажаться.',
        'Тримайте пательню на середньому вогні та підготуйте кришку.',
      ],
      ingredientSections: [
        {
          id: 'batter',
          title: 'Тісто для яблучних оладок',
          ingredients: [
            {
              id: 'apples',
              name: 'Яблука',
              quantity: {
                base: { kind: 'exact', value: 2, unit: 'piece' },
                shopping: { mode: 'base', increment: 1, rounding: 'up' },
              },
              note: 'Очистьте та натріть на середній тертці.',
            },
            {
              id: 'egg',
              name: 'Яйце',
              quantity: {
                base: { kind: 'exact', value: 1, unit: 'piece' },
                shopping: { mode: 'base', increment: 1, rounding: 'up' },
              },
            },
            {
              id: 'kefir-or-yogurt',
              name: 'Кефір або натуральний йогурт',
              quantity: {
                base: { kind: 'exact', value: 160, unit: 'g' },
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
            {
              id: 'sweetener',
              name: 'Цукор або мед',
              quantity: {
                base: { kind: 'exact', value: 1, unit: 'tbsp' },
                shopping: { mode: 'base' },
              },
              optional: true,
              note: 'Додайте за смаком.',
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
          body: 'Помийте й очистьте яблука, потім натріть їх на середній тертці.',
          checkpoint:
            'Яблука натерті короткою дрібною стружкою, без великих шматків, які могли б завадити середині рівномірно просмажитися.',
          cookIngredients: [{ ingredientId: 'apples' }],
        },
        {
          id: 'mix-wet',
          title: 'Змішайте рідку основу',
          body: 'В окремій мисці збийте вінчиком яйце з кефіром або йогуртом і цукром чи медом.',
          tip: 'Спочатку змішайте яйце з кефіром, а тоді додайте підсолоджувач — так він розподілиться рівномірніше.',
          cookIngredients: [
            { ingredientId: 'egg' },
            { ingredientId: 'kefir-or-yogurt' },
            { ingredientId: 'sweetener' },
          ],
        },
        {
          id: 'add-apples',
          title: 'Додайте натерті яблука',
          body: 'Вмішайте натерті яблука в рідку суміш, щоб вони розподілилися рівномірно.',
          cookIngredients: [{ ingredientId: 'apples', quantity: 'omit' }],
        },
        {
          id: 'finish-batter',
          title: 'Замішайте тісто',
          body: 'Додайте борошно Schär Mix B Bread і соду. Ретельно перемішайте вінчиком до однорідної консистенції густої сметани.',
          checkpoint:
            'Тісто тримається на ложці невеликою гіркою, а потім повільно сповзає, а не стікає.',
          tip: 'Припиніть перемішувати, щойно сухого борошна не залишилося, а яблука розподілилися рівномірно.',
          cookIngredients: [
            { ingredientId: 'flour' },
            { ingredientId: 'baking-soda' },
          ],
        },
        {
          id: 'heat-pan',
          title: 'Розігрійте пательню',
          body: 'Розігрійте на середньому вогні пательню з невеликою кількістю олії.',
          tip: 'Олія має лише тонко вкривати дно; додавайте ще трохи між партіями, лише коли пательня стає сухою.',
          cookIngredients: [{ ingredientId: 'oil' }],
        },
        {
          id: 'portion',
          title: 'Сформуйте невеликі оладки',
          body: 'Викладайте тісто ложкою на пательню, формуючи невеликі оладки.',
          tip: 'Робіть оладки невеликими й однакового розміру, щоб серединки просмажилися одночасно.',
        },
        {
          id: 'fry',
          title: 'Смажте під кришкою та переверніть',
          body: 'Накрийте кришкою й смажте по 2–3 хвилини з кожного боку, перевернувши один раз, до золотистої скоринки.',
          meta: 'По 2–3 хв з кожного боку · середній вогонь · під кришкою',
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
        },
      ],
      gapNote:
        'Перед публікацією запишіть вихід, загальний час приготування та приблизну кількість олії для смаження.',
    },
  },
} satisfies RecipeSourceDraft;
