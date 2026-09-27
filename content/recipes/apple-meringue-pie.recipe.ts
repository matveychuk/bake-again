import { localizeRecipeContent } from "./localize-content.ts";
import { apple_meringue_pieEs } from "./translations/apple-meringue-pie.es.ts";
import type { RecipeSourceDraft } from './source-recipe.types.ts';
import { quantityFromGrams } from './spoon-weights.ts';

const appleMeringuePieRecipeBase = {
  id: 'apple-meringue-pie',
  publicationStatus: 'unpublished',
  translationState: { uk: 'reviewed', en: 'reviewed', es: 'reviewed' },
  source: {
    file: 'https://foodgfm.com/%d0%b1%d0%b5%d0%b7%d0%b3%d0%bb%d1%8e%d1%82%d0%b5%d0%bd%d0%be%d0%b2%d0%b8%d0%b9-%d1%8f%d0%b1%d0%bb%d1%83%d1%87%d0%bd%d0%b8%d0%b9-%d0%bf%d0%b8%d1%80%d1%96%d0%b3/',
    locator:
      'Безглютеновий яблучний пиріг: простий рецепт осінньої випічки · Food GFM · 10.09.2025',
  },
  completeness: 'incompleteSource',
  evidence: {
    status: 'suggested',
    explanation:
      'This is a structured draft from the linked source and has not been bake-tested by Bake Again.',
  },
  timing: {
    activeMinutes: null,
    totalElapsedMinutes: null,
    planningNote: {
      text: 'Plan for {duration} of chilling before assembly.',
      phaseId: 'chill',
    },
    phases: [
      {
        id: 'chill',
        label: 'Chill the dough',
        duration: { kind: 'range', min: 1, max: 2, unit: 'hour' },
        relatedStepId: 'chill-dough',
      },
      {
        id: 'bake',
        label: 'Bake',
        duration: { kind: 'exact', value: 40, unit: 'minute' },
        relatedStepId: 'bake',
      },
    ],
  },
  beforeStart: [
    'Keep the butter cold; the source says this helps the pastry stay crumbly.',
    'The source does not give the apple amount, baking-powder amount, pan size or sugar amount for the meringue. Record them during the first bake.',
  ],
  ingredientSections: [
    {
      id: 'pastry',
      title: 'Pastry',
      ingredients: [
        {
          id: 'egg',
          name: 'Egg',
          quantity: {
            base: { kind: 'exact', value: 1, unit: 'piece' },
            shopping: { mode: 'base', increment: 1, rounding: 'up' },
          },
          note: 'Separate it: use the yolk in the pastry and reserve the white for the topping.',
        },
        {
          id: 'cold-water',
          name: 'Cold water',
          quantity: {
            base: { kind: 'exact', value: 30, unit: 'ml' },
            shopping: { mode: 'base', defaultSelected: false },
          },
        },
        {
          id: 'sugar',
          name: 'Sugar',
          quantity: quantityFromGrams('granulated-sugar', 60),
        },
        {
          id: 'butter',
          name: 'Cold butter',
          quantity: {
            base: { kind: 'exact', value: 60, unit: 'g' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'gluten-free-mix',
          name: 'GFM Universal gluten-free baking mix',
          quantity: {
            base: { kind: 'exact', value: 170, unit: 'g' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'baking-powder',
          name: 'Baking powder',
          quantity: {
            base: null,
            shopping: { mode: 'nameOnly' },
          },
          note: 'Amount not stated in the source.',
        },
      ],
    },
    {
      id: 'filling-and-topping',
      title: 'Apple filling and meringue topping',
      ingredients: [
        {
          id: 'apples',
          name: 'Apples',
          quantity: {
            base: null,
            shopping: { mode: 'nameOnly' },
          },
          note: 'Peel and grate. Amount and variety are not stated in the source.',
        },
      ],
    },
  ],
  steps: [
    {
      id: 'rub-base',
      title: 'Rub the butter, yolk and sugar together',
      body: 'Separate the egg and reserve the white. Rub the cold butter with the yolk and 60 g sugar.',
      checkpoint:
        'The butter is evenly dispersed and there are no large hard pieces left.',
      tip: 'Work briefly so the butter stays cold.',
      cookIngredients: [
        { ingredientId: 'egg' },
        { ingredientId: 'butter' },
        { ingredientId: 'sugar' },
      ],
    },
    {
      id: 'mix-dough',
      title: 'Mix the dough',
      body: 'Add the cold water, baking powder and gluten-free mix. Bring everything together into a soft dough.',
      checkpoint: 'The dough is soft and no longer sticks to your hands.',
      tip: 'Stop mixing as soon as the dough holds together; do not add extra mix unless the first bake shows it is necessary.',
      cookIngredients: [
        { ingredientId: 'cold-water' },
        { ingredientId: 'baking-powder' },
        { ingredientId: 'gluten-free-mix' },
      ],
    },
    {
      id: 'chill-dough',
      title: 'Chill the dough',
      body: 'Refrigerate the dough for 1–2 hours.',
      meta: '1–2 h · refrigerator',
      checkpoint: 'The dough feels cold and firm enough to press into the pan.',
    },
    {
      id: 'prepare-apples',
      title: 'Prepare the apples',
      body: 'Peel and grate the apples while the dough chills.',
      checkpoint: 'The apples are evenly grated with no peel remaining.',
      tip: 'The source suggests adding a pinch of cinnamon for a warmer apple flavour.',
      cookIngredients: [{ ingredientId: 'apples' }],
    },
    {
      id: 'line-pan',
      title: 'Line the pan with dough',
      body: 'Press the chilled dough across the bottom and up the sides of the pan.',
      checkpoint: 'The base has an even thickness, with no visible gaps.',
      tip: 'Record the pan shape and dimensions during the first bake.',
    },
    {
      id: 'assemble',
      title: 'Add the apples and meringue',
      body: 'Spread the grated apples over the pastry. Whip the reserved egg white to a soft meringue and spread it over the apples.',
      checkpoint:
        'The apple layer is even and the whipped white holds soft peaks before it is spread.',
      tip: 'The source does not state how much sugar, if any, goes into the meringue; record the exact amount used.',
      cookIngredients: [
        { ingredientId: 'apples', quantity: 'omit' },
        {
          ingredientId: 'egg',
          quantity: 'omit',
          note: 'Use the reserved white.',
        },
      ],
    },
    {
      id: 'bake',
      title: 'Bake the pie',
      body: 'Bake at 180°C for 40 minutes.',
      meta: '180°C · 40 min',
      checkpoint:
        'At the first bake, record the colour of the pastry edge, the set of the apple layer and how quickly the meringue browns.',
      tip: 'Treat 40 minutes as the source timing until the exact pan and oven behaviour have been tested.',
    },
  ],
  gapNote:
    'Before publication, bake-test the exact recipe and record the apple quantity and variety, baking-powder amount, pan dimensions, meringue sugar amount, oven mode, active time and finished yield.',
  translations: {
    uk: {
      completeness: 'incompleteSource',
      evidence: {
        status: 'suggested',
        explanation:
          'Це структурована чернетка за вказаним джерелом; Bake Again ще не випікав цю точну версію.',
      },
      timing: {
        activeMinutes: null,
        totalElapsedMinutes: null,
        planningNote: {
          text: 'Закладіть {duration} на охолодження тіста перед складанням.',
          phaseId: 'chill',
        },
        phases: [
          {
            id: 'chill',
            label: 'Охолодження тіста',
            duration: { kind: 'range', min: 1, max: 2, unit: 'hour' },
            relatedStepId: 'chill-dough',
          },
          {
            id: 'bake',
            label: 'Випікання',
            duration: { kind: 'exact', value: 40, unit: 'minute' },
            relatedStepId: 'bake',
          },
        ],
      },
      beforeStart: [
        'Тримайте масло холодним: за порадою джерела це допомагає отримати розсипчасте тісто.',
        'У джерелі немає кількості яблук і розпушувача, розміру форми та кількості цукру для меренги. Запишіть їх під час першої випічки.',
      ],
      ingredientSections: [
        {
          id: 'pastry',
          title: 'Тісто',
          ingredients: [
            {
              id: 'egg',
              name: 'Яйце',
              quantity: {
                base: { kind: 'exact', value: 1, unit: 'piece' },
                shopping: { mode: 'base', increment: 1, rounding: 'up' },
              },
              note: 'Відокремте: жовток використайте в тісті, білок залиште для верхнього шару.',
            },
            {
              id: 'cold-water',
              name: 'Холодна вода',
              quantity: {
                base: { kind: 'exact', value: 30, unit: 'ml' },
                shopping: { mode: 'base', defaultSelected: false },
              },
            },
            {
              id: 'sugar',
              name: 'Цукор',
              quantity: {
                base: { kind: 'exact', value: 60, unit: 'g' },
                shopping: { mode: 'base' },
              },
            },
            {
              id: 'butter',
              name: 'Холодне вершкове масло',
              quantity: {
                base: { kind: 'exact', value: 60, unit: 'g' },
                shopping: { mode: 'base' },
              },
            },
            {
              id: 'gluten-free-mix',
              name: 'Безглютенова суміш GFM «Універсальна»',
              quantity: {
                base: { kind: 'exact', value: 170, unit: 'g' },
                shopping: { mode: 'base' },
              },
            },
            {
              id: 'baking-powder',
              name: 'Розпушувач',
              quantity: {
                base: null,
                shopping: { mode: 'nameOnly' },
              },
              note: 'Кількість у джерелі не вказана.',
            },
          ],
        },
        {
          id: 'filling-and-topping',
          title: 'Яблучна начинка та меренга',
          ingredients: [
            {
              id: 'apples',
              name: 'Яблука',
              quantity: {
                base: null,
                shopping: { mode: 'nameOnly' },
              },
              note: 'Очистьте й натріть. Кількість і сорт у джерелі не вказані.',
            },
          ],
        },
      ],
      steps: [
        {
          id: 'rub-base',
          title: 'Розітріть масло, жовток і цукор',
          body: 'Відокремте білок від жовтка й залиште білок. Розітріть холодне масло з жовтком і 60 г цукру.',
          checkpoint:
            'Масло рівномірно розподілене, великих твердих шматочків не залишилося.',
          tip: 'Працюйте швидко, щоб масло залишалося холодним.',
          cookIngredients: [
            { ingredientId: 'egg' },
            { ingredientId: 'butter' },
            { ingredientId: 'sugar' },
          ],
        },
        {
          id: 'mix-dough',
          title: 'Замісіть тісто',
          body: 'Додайте холодну воду, розпушувач і безглютенову суміш. Зберіть усе в м’яке тісто.',
          checkpoint: 'Тісто м’яке й більше не липне до рук.',
          tip: 'Зупиніться, щойно тісто збереться докупи; не додавайте суміш навмання, доки перша випічка не покаже, що це потрібно.',
          cookIngredients: [
            { ingredientId: 'cold-water' },
            { ingredientId: 'baking-powder' },
            { ingredientId: 'gluten-free-mix' },
          ],
        },
        {
          id: 'chill-dough',
          title: 'Охолодіть тісто',
          body: 'Поставте тісто в холодильник на 1–2 години.',
          meta: '1–2 год · холодильник',
          checkpoint: 'Тісто холодне й достатньо пружне, щоб розподілити його у формі.',
        },
        {
          id: 'prepare-apples',
          title: 'Підготуйте яблука',
          body: 'Поки тісто охолоджується, очистьте та натріть яблука.',
          checkpoint: 'Яблука натерті рівномірно, шкірки не залишилося.',
          tip: 'Джерело радить додати до яблук дрібку кориці для теплого аромату.',
          cookIngredients: [{ ingredientId: 'apples' }],
        },
        {
          id: 'line-pan',
          title: 'Вистеліть форму тістом',
          body: 'Розподіліть охолоджене тісто по дну та бортиках форми.',
          checkpoint: 'Основа має рівномірну товщину й не має видимих прогалин.',
          tip: 'Під час першої випічки запишіть форму та її розміри.',
        },
        {
          id: 'assemble',
          title: 'Додайте яблука та меренгу',
          body: 'Рівномірно викладіть натерті яблука на тісто. Збийте відкладений білок у ніжну меренгу й розподіліть її поверх яблук.',
          checkpoint:
            'Шар яблук рівний, а збитий білок тримає м’які піки перед викладанням.',
          tip: 'Джерело не уточнює, скільки цукру додають у меренгу і чи додають його взагалі; запишіть точну кількість.',
          cookIngredients: [
            { ingredientId: 'apples', quantity: 'omit' },
            {
              ingredientId: 'egg',
              quantity: 'omit',
              note: 'Використайте відкладений білок.',
            },
          ],
        },
        {
          id: 'bake',
          title: 'Спечіть пиріг',
          body: 'Випікайте 40 хвилин за 180°C.',
          meta: '180°C · 40 хв',
          checkpoint:
            'Під час першої випічки запишіть колір краю тіста, стан яблучного шару та швидкість підрум’янення меренги.',
          tip: 'Сприймайте 40 хвилин як час із джерела, доки не перевірите точну форму й поведінку своєї духовки.',
        },
      ],
      gapNote:
        'Перед публікацією випробуйте точну версію та запишіть кількість і сорт яблук, кількість розпушувача, розміри форми, кількість цукру для меренги, режим духовки, активний час і готовий вихід.',
    },
  },
} satisfies RecipeSourceDraft;

export const appleMeringuePieRecipe = {
  ...appleMeringuePieRecipeBase,
  translations: {
    ...appleMeringuePieRecipeBase.translations,
    es: localizeRecipeContent(appleMeringuePieRecipeBase.translations.uk, apple_meringue_pieEs),
  },
} satisfies RecipeSourceDraft;
