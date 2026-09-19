import type { RecipeSourceDraft } from './source-recipe.types.ts';

export const appleBananaFrittersRecipe = {
  id: 'apple-banana-fritters',
  publicationStatus: 'draft',
  source: {
    file: 'content/recipes/apple-fritters.recipe.ts',
    locator:
      'Suggested adaptation of the tested apple-fritter base: replace the sugar or honey with one ripe banana',
  },
  completeness: 'readyToReview',
  evidence: {
    status: 'suggested',
    explanation:
      'This version replaces the sugar or honey in the tested apple-fritter base with one ripe banana. The exact adaptation has not yet been pan-tested.',
  },
  beforeStart: [
    'Use a very ripe, soft banana so it mashes smoothly and sweetens the batter.',
    'The banana adds moisture: use the batter cue rather than assuming the base recipe will behave identically.',
    'Keep the pan at medium heat and have a lid ready.',
  ],
  ingredientSections: [
    {
      id: 'batter',
      title: 'Apple-banana fritter batter',
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
          id: 'banana',
          name: 'Small very ripe banana',
          quantity: {
            base: { kind: 'exact', value: 1, unit: 'piece' },
            shopping: { mode: 'base', increment: 1, rounding: 'up' },
          },
          note: 'Mash until mostly smooth.',
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
      id: 'prepare-fruit',
      title: 'Prepare the apples and banana',
      body: 'Wash and peel the apples, then grate them on a medium grater. In a separate bowl, mash the banana until mostly smooth.',
      checkpoint:
        'The apples are in short, fine shreds and the banana is a thick mash with no firm pieces.',
      tip: 'Mash the banana just before mixing so it stays pale and disperses easily.',
      cookIngredients: [{ ingredientId: 'apples' }, { ingredientId: 'banana' }],
    },
    {
      id: 'mix-wet',
      title: 'Whisk the wet base',
      body: 'In a separate bowl, whisk the egg with the kefir or yogurt. Whisk in the mashed banana until evenly combined.',
      checkpoint:
        'The wet mixture is creamy and evenly flecked with banana, without large lumps.',
      cookIngredients: [
        { ingredientId: 'egg' },
        { ingredientId: 'kefir-or-yogurt' },
        { ingredientId: 'banana', quantity: 'omit' },
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
        'The batter holds a small mound on the spoon, then falls slowly rather than running.',
      tip: 'Because banana moisture varies, do not add extra liquid if the batter is already looser than this cue; record the result for the bake test.',
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
      tip: 'Keep the fritters small and similar in size so the fruit-rich centres cook through evenly.',
    },
    {
      id: 'fry',
      title: 'Fry under a lid and turn',
      body: 'Cover and fry for 2–3 minutes per side, turning once, until both sides are golden.',
      meta: '2–3 min per side · medium heat · covered',
      checkpoint:
        'Turn when the underside is golden and the top has begun to set around the edges; after the second side cooks, the centre should no longer look wet.',
      tip: 'Banana browns readily, so lower the heat if the crust darkens before the top begins to set.',
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
    'Bake-test the banana substitution before publication. Record whether 160 g kefir or yogurt still gives the right batter consistency, then record the yield, total cooking time and approximate amount of frying oil.',
  translations: {
    uk: {
      completeness: 'readyToReview',
      evidence: {
        status: 'suggested',
        explanation:
          'У цій адаптації цукор або мед із перевіреної бази замінено одним стиглим бананом. Саме цю версію ще не перевіряли на пательні.',
      },
      beforeStart: [
        'Візьміть дуже стиглий м’який банан: він легко розімнеться й підсолодить тісто.',
        'Банан додає вологи, тому орієнтуйтеся на консистенцію тіста, а не очікуйте, що воно поводитиметься точно як базовий рецепт.',
        'Тримайте пательню на середньому вогні та підготуйте кришку.',
      ],
      ingredientSections: [
        {
          id: 'batter',
          title: 'Тісто для яблучно-бананових оладок',
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
              id: 'banana',
              name: 'Невеликий дуже стиглий банан',
              quantity: {
                base: { kind: 'exact', value: 1, unit: 'piece' },
                shopping: { mode: 'base', increment: 1, rounding: 'up' },
              },
              note: 'Розімніть майже до однорідності.',
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
          id: 'prepare-fruit',
          title: 'Підготуйте яблука й банан',
          body: 'Помийте й очистьте яблука, потім натріть їх на середній тертці. В окремій мисці розімніть банан майже до однорідності.',
          checkpoint:
            'Яблука натерті короткою дрібною стружкою, а банан перетворився на густе пюре без твердих шматків.',
          tip: 'Розімніть банан безпосередньо перед замішуванням, щоб він не встиг потемніти й легко розподілився в тісті.',
          cookIngredients: [
            { ingredientId: 'apples' },
            { ingredientId: 'banana' },
          ],
        },
        {
          id: 'mix-wet',
          title: 'Змішайте рідку основу',
          body: 'В окремій мисці збийте вінчиком яйце з кефіром або йогуртом. Додайте розім’ятий банан і перемішайте до рівномірного поєднання.',
          checkpoint:
            'Рідка суміш кремова, із рівномірними вкрапленнями банана й без великих грудочок.',
          cookIngredients: [
            { ingredientId: 'egg' },
            { ingredientId: 'kefir-or-yogurt' },
            { ingredientId: 'banana', quantity: 'omit' },
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
          tip: 'Вологість банана може відрізнятися. Якщо тісто вже рідше за цей орієнтир, не додавайте більше рідини й запишіть результат для тестування.',
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
          tip: 'Робіть оладки невеликими й однакового розміру, щоб фруктова серединка рівномірно просмажилася.',
        },
        {
          id: 'fry',
          title: 'Смажте під кришкою та переверніть',
          body: 'Накрийте кришкою й смажте по 2–3 хвилини з кожного боку, перевернувши один раз, до золотистої скоринки.',
          meta: 'По 2–3 хв з кожного боку · середній вогонь · під кришкою',
          checkpoint:
            'Перевертайте, коли низ уже золотистий, а поверхня почала схоплюватися по краях; після другого боку серединка не має виглядати вологою.',
          tip: 'Банан швидко підрум’янюється, тому зменште вогонь, якщо скоринка темнішає раніше, ніж поверхня починає схоплюватися.',
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
        'Перед публікацією перевірте заміну цукру бананом на пательні. Запишіть, чи дають 160 г кефіру або йогурту правильну густоту тіста, а також вихід, загальний час приготування та приблизну кількість олії.',
    },
  },
} satisfies RecipeSourceDraft;
