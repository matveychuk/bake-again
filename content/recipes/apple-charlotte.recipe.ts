import type {
  RecipeSourceDraft,
  RecipeSourceDraftContent,
  StructuredIngredientSection,
  StructuredRecipeStep,
} from './source-recipe.types.ts';
import { quantityFromGrams, quantityFromSpoons } from './spoon-weights.ts';

type Locale = 'en' | 'es' | 'uk';

const text = (locale: Locale, en: string, es: string, uk: string) =>
  locale === 'uk' ? uk : locale === 'es' ? es : en;

const quantities = {
  apples: {
    base: { kind: 'exact' as const, value: 3, unit: 'piece' as const },
    shopping: { mode: 'base' as const, increment: 1, rounding: 'up' as const },
  },
  eggs: {
    base: { kind: 'exact' as const, value: 5, unit: 'piece' as const },
    shopping: { mode: 'base' as const, increment: 1, rounding: 'up' as const },
  },
  sugar: quantityFromGrams('granulated-sugar', 100),
  butter: {
    base: { kind: 'exact' as const, value: 50, unit: 'g' as const },
    shopping: { mode: 'base' as const },
  },
  flour: quantityFromGrams('schar-mix-b', 120),
  tapioca: quantityFromGrams('tapioca-starch', 15),
  xanthan: quantityFromSpoons('xanthan-gum', 0.5, 'tsp'),
  pinch: {
    base: null,
    equivalent: { kind: 'exact' as const, value: 1, unit: 'pinch' as const },
    shopping: { mode: 'nameOnly' as const },
  },
  nameOnly: { base: null, shopping: { mode: 'nameOnly' as const } },
};

function ingredientSections(locale: Locale): StructuredIngredientSection[] {
  return [
    {
      id: 'cake',
      title: text(
        locale,
        'Apple charlotte',
        'Carlota de manzana',
        'Яблучна шарлотка',
      ),
      ingredients: [
        {
          id: 'apples',
          name: text(locale, 'Firm apples', 'Manzanas firmes', 'Щільні яблука'),
          quantity: quantities.apples,
          note: text(
            locale,
            'Cut into 1–1.5 cm pieces and pat dry.',
            'Córtalas en trozos de 1–1,5 cm y sécalas.',
            'Наріжте шматочками 1–1,5 см і промокніть.',
          ),
        },
        {
          id: 'eggs',
          name: text(locale, 'Small eggs', 'Huevos pequeños', 'Невеликі яйця'),
          quantity: quantities.eggs,
        },
        {
          id: 'sugar',
          name: text(locale, 'Sugar', 'Azúcar', 'Цукор'),
          quantity: quantities.sugar,
        },
        {
          id: 'butter',
          name: text(
            locale,
            'Unsalted butter',
            'Mantequilla sin sal',
            'Вершкове масло',
          ),
          quantity: quantities.butter,
        },
        {
          id: 'flour',
          name: text(
            locale,
            'Schär Mix B Bread flour',
            'Harina Schär Mix B Bread',
            'Борошно Schär Mix B Bread',
          ),
          quantity: quantities.flour,
          note: text(
            locale,
            'Reserve 10 g for coating the apples.',
            'Reserva 10 g para cubrir las manzanas.',
            'Відкладіть 10 г для яблук.',
          ),
        },
        {
          id: 'tapioca',
          name: text(
            locale,
            'Tapioca starch',
            'Almidón de tapioca',
            'Тапіоковий крохмаль',
          ),
          quantity: quantities.tapioca,
        },
        {
          id: 'xanthan',
          name: text(
            locale,
            'Xanthan gum',
            'Goma xantana',
            'Ксантанова камедь',
          ),
          quantity: quantities.xanthan,
        },
        {
          id: 'salt',
          name: text(locale, 'Salt', 'Sal', 'Сіль'),
          quantity: quantities.pinch,
          scaling: 'fixed',
        },
        {
          id: 'vanilla',
          name: text(locale, 'Vanillin', 'Vainillina', 'Ванілін'),
          quantity: quantities.nameOnly,
        },
        {
          id: 'cinnamon',
          name: text(locale, 'Cinnamon', 'Canela', 'Кориця'),
          quantity: quantities.nameOnly,
        },
      ],
    },
  ];
}

function steps(locale: Locale): StructuredRecipeStep[] {
  return [
    {
      id: 'prepare-apples',
      title: text(
        locale,
        'Prepare the butter and apples',
        'Prepara la mantequilla y las manzanas',
        'Підготуйте масло та яблука',
      ),
      body: text(
        locale,
        'Melt the butter and let it cool until barely warm. Cut the apples into 1–1.5 cm pieces, pat them dry and toss with the reserved 10 g of flour.',
        'Derrite la mantequilla y déjala enfriar hasta que esté apenas tibia. Corta las manzanas en trozos de 1–1,5 cm, sécalas y mézclalas con los 10 g de harina reservados.',
        'Розтопіть масло й остудіть до ледь теплого стану. Наріжте яблука шматочками 1–1,5 см, промокніть і перемішайте з відкладеними 10 г борошна.',
      ),
      cookIngredients: [
        { ingredientId: 'butter' },
        { ingredientId: 'apples' },
        { ingredientId: 'flour' },
      ],
    },
    {
      id: 'whip-eggs',
      title: text(
        locale,
        'Whip to ribbon stage',
        'Bate hasta el punto de cinta',
        'Збийте до стрічки',
      ),
      body: text(
        locale,
        'Whip the eggs with the sugar until pale, thick and voluminous.',
        'Bate los huevos con el azúcar hasta obtener una mezcla clara, espesa y voluminosa.',
        'Збийте яйця з цукром до світлої, густої та пишної маси.',
      ),
      checkpoint: text(
        locale,
        'The mixture falls from the whisk in a broad ribbon that remains visible for a few seconds.',
        'La mezcla cae de las varillas en una cinta ancha que permanece visible unos segundos.',
        'Маса спадає з вінчика широкою стрічкою, яка кілька секунд тримається на поверхні.',
      ),
      cookIngredients: [{ ingredientId: 'eggs' }, { ingredientId: 'sugar' }],
      media: [
        {
          id: 'apple-charlotte-egg-foam-v1',
          src: '/media/recipes/apple-charlotte/selected/whipped-egg-foam-v1.png',
          alt: text(
            locale,
            'Pale egg foam falling from a whisk in a broad ribbon',
            'Espuma clara de huevo que cae de las varillas en una cinta ancha',
            'Світла яєчна піна спадає з вінчика широкою стрічкою',
          ),
        },
      ],
    },
    {
      id: 'fold-batter',
      title: text(
        locale,
        'Finish the batter',
        'Termina la masa',
        'Завершіть тісто',
      ),
      body: text(
        locale,
        'Mix the remaining flour, tapioca starch, xanthan gum, salt, vanillin and cinnamon. Fold into the egg foam. Stir a spoonful of batter into the cooled butter, fold it back into the bowl, then gently fold in the apples.',
        'Mezcla la harina restante, el almidón de tapioca, la goma xantana, la sal, la vainillina y la canela. Incorpora esta mezcla a la espuma de huevo. Mezcla una cucharada de masa con la mantequilla fría, devuélvela al bol e incorpora con cuidado las manzanas.',
        'Змішайте решту борошна, тапіоковий крохмаль, ксантанову камедь, сіль, ванілін і корицю та обережно вмішайте в яєчну піну. З’єднайте ложку тіста з охолодженим маслом, поверніть суміш у миску, а потім делікатно вмішайте яблука.',
      ),
      checkpoint: text(
        locale,
        'The batter remains airy, and the apple pieces are suspended throughout rather than collecting at the bottom.',
        'La masa sigue aireada y los trozos de manzana quedan repartidos, sin acumularse en el fondo.',
        'Тісто залишається повітряним, а шматочки яблук розподілені в ньому, а не збираються на дні.',
      ),
      cookIngredients: [
        { ingredientId: 'flour', quantity: 'omit' },
        { ingredientId: 'tapioca' },
        { ingredientId: 'xanthan' },
        { ingredientId: 'salt' },
        { ingredientId: 'vanilla' },
        { ingredientId: 'cinnamon' },
        { ingredientId: 'butter', quantity: 'omit' },
        { ingredientId: 'apples', quantity: 'omit' },
      ],
      media: [
        {
          id: 'folded-apple-batter-v1',
          src: '/media/recipes/apple-charlotte/selected/folded-apple-batter-v1.png',
          alt: text(
            locale,
            'Thick airy batter with small apple pieces distributed throughout',
            'Masa espesa y aireada con pequeños trozos de manzana repartidos',
            'Густе повітряне тісто з рівномірно розподіленими шматочками яблук',
          ),
        },
      ],
    },
    {
      id: 'bake',
      title: text(
        locale,
        'Bake until golden',
        'Hornea hasta dorar',
        'Випікайте до золотистого кольору',
      ),
      body: text(
        locale,
        'Preheat the oven to 180°C. Spread the batter in a parchment-lined medium baking pan and bake.',
        'Precalienta el horno a 180°C. Extiende la masa en un molde mediano forrado con papel de horno y hornea.',
        'Розігрійте духовку до 180°C. Розподіліть тісто у середній формі, застеленій пергаментом, і випікайте.',
      ),
      meta: text(
        locale,
        '180°C · 25–30 min',
        '180°C · 25–30 min',
        '180°C · 25–30 хв',
      ),
      checkpoint: text(
        locale,
        'The top is golden, the centre springs back lightly, and a skewer has no wet batter.',
        'La superficie está dorada, el centro recupera la forma al tocarlo y la brocheta no sale con masa cruda.',
        'Верх золотистий, центр пружно відновлюється після легкого натискання, а на шпажці немає сирого тіста.',
      ),
    },
  ];
}

function contentForLocale(locale: Locale): RecipeSourceDraftContent {
  return {
    completeness: 'readyToReview',
    presentation: 'concise',
    difficulty: 'easy',
    evidence: {
      status: 'tested',
      explanation: text(
        locale,
        'This exact butter-enriched apple charlotte has been baked successfully.',
        'Esta versión exacta de la carlota de manzana con mantequilla se ha horneado con éxito.',
        'Саме цю версію яблучної шарлотки з маслом успішно випікали.',
      ),
    },
    yield: {
      id: 'one-charlotte',
      label: text(locale, '1 charlotte', '1 carlota', '1 шарлотка'),
      count: { kind: 'exact', value: 1 },
      unit: 'cake',
    },
    timing: {
      activeMinutes: 20,
      totalElapsedMinutes: 50,
      phases: [
        {
          id: 'baking',
          label: text(locale, 'Baking', 'Horneado', 'Випікання'),
          duration: { kind: 'range', min: 25, max: 30, unit: 'minute' },
          relatedStepId: 'bake',
        },
      ],
    },
    beforeStart: [
      text(
        locale,
        'For a full-size oven tray, use a double batch.',
        'Para una bandeja de horno completa, prepara una cantidad doble.',
        'Для повного дека духовки готуйте подвійну порцію.',
      ),
    ],
    ingredientSections: ingredientSections(locale),
    steps: steps(locale),
  };
}

export const appleCharlotteRecipe = {
  id: 'apple-charlotte',
  publicationStatus: 'published',
  source: {
    file: 'docs/reference/recipe-inventory.xlsx',
    locator:
      'Recipe Archive · Яблучна шарлотка; author-confirmed butter version and half batch, 2026-09-21',
  },
  ...contentForLocale('en'),
  translations: { uk: contentForLocale('uk'), es: contentForLocale('es') },
} satisfies RecipeSourceDraft;
