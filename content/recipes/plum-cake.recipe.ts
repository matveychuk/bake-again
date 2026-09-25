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
  plums: {
    base: { kind: 'exact' as const, value: 400, unit: 'g' as const },
    shopping: { mode: 'base' as const },
  },
  eggs: {
    base: { kind: 'exact' as const, value: 5, unit: 'piece' as const },
    shopping: { mode: 'base' as const, increment: 1, rounding: 'up' as const },
  },
  sugar: quantityFromGrams('granulated-sugar', 100),
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
        'Plum upside-down cake',
        'Bizcocho invertido de ciruelas',
        'Перевернутий сливовий пиріг',
      ),
      ingredients: [
        {
          id: 'plums',
          name: text(
            locale,
            'Ripe but firm plums',
            'Ciruelas maduras pero firmes',
            'Стиглі, але щільні сливи',
          ),
          quantity: quantities.plums,
          note: text(
            locale,
            'Halve, stone and pat the cut surfaces dry.',
            'Pártelas por la mitad, quita los huesos y seca las superficies cortadas.',
            'Розріжте навпіл, вийміть кісточки та промокніть зрізи.',
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
          id: 'flour',
          name: text(
            locale,
            'Schär Mix B Bread flour',
            'Harina Schär Mix B Bread',
            'Борошно Schär Mix B Bread',
          ),
          quantity: quantities.flour,
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
      ],
    },
  ];
}

function steps(locale: Locale): StructuredRecipeStep[] {
  return [
    {
      id: 'prepare-plums',
      title: text(
        locale,
        'Arrange the plums',
        'Coloca las ciruelas',
        'Викладіть сливи',
      ),
      body: text(
        locale,
        'Line a medium baking pan with parchment. Halve and stone the plums, pat the cut surfaces dry and arrange them closely in one layer, cut side down.',
        'Forra un molde mediano con papel de horno. Parte las ciruelas por la mitad, quita los huesos, seca los cortes y colócalas juntas en una sola capa, con el corte hacia abajo.',
        'Застеліть середню форму пергаментом. Розріжте сливи навпіл, вийміть кісточки, промокніть зрізи й щільно викладіть одним шаром зрізом донизу.',
      ),
      checkpoint: text(
        locale,
        'The bottom is covered in one close layer without stacked fruit.',
        'El fondo está cubierto por una sola capa compacta, sin fruta apilada.',
        'Дно вкрите одним щільним шаром, сливи не лежать одна на одній.',
      ),
      cookIngredients: [{ ingredientId: 'plums' }],
      media: [
        {
          id: 'plums-cut-side-down-v1',
          src: '/media/recipes/plum-cake/selected/plums-cut-side-down-v1.webp',
          alt: text(
            locale,
            'Plum halves arranged cut side down in one layer in a parchment-lined pan',
            'Mitades de ciruela colocadas con el corte hacia abajo en una sola capa en un molde forrado',
            'Половинки слив викладені зрізом донизу одним шаром у формі з пергаментом',
          ),
        },
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
          id: 'plum-cake-egg-foam-v1',
          src: '/media/recipes/plum-cake/selected/whipped-egg-foam-v1.webp',
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
      id: 'finish-batter',
      title: text(
        locale,
        'Finish the batter',
        'Termina la masa',
        'Завершіть тісто',
      ),
      body: text(
        locale,
        'Mix the flour, tapioca starch, xanthan gum, salt and vanillin, then fold into the egg foam. Pour the batter over the plums in several places and gently spread it without moving the fruit.',
        'Mezcla la harina, el almidón de tapioca, la goma xantana, la sal y la vainillina e incorpora con cuidado a la espuma de huevo. Vierte la masa sobre las ciruelas en varios puntos y extiéndela suavemente sin mover la fruta.',
        'Змішайте борошно, тапіоковий крохмаль, ксантанову камедь, сіль і ванілін та обережно вмішайте в яєчну піну. Вилийте тісто на сливи в кількох місцях і делікатно розрівняйте, не зсуваючи фруктів.',
      ),
      cookIngredients: [
        { ingredientId: 'flour' },
        { ingredientId: 'tapioca' },
        { ingredientId: 'xanthan' },
        { ingredientId: 'salt' },
        { ingredientId: 'vanilla' },
      ],
    },
    {
      id: 'bake-and-invert',
      title: text(
        locale,
        'Bake and invert',
        'Hornea y dale la vuelta',
        'Спечіть і переверніть',
      ),
      body: text(
        locale,
        'Preheat the oven to 180°C and bake the cake. As soon as it comes out, loosen the edges. Wearing oven mitts, place a flat serving board or platter over the pan and invert both together in one confident movement. Lift off the pan and carefully peel away the parchment.',
        'Precalienta el horno a 180°C y hornea el bizcocho. En cuanto lo saques, despega los bordes. Con manoplas, coloca una tabla o fuente plana sobre el molde y gira ambos juntos con un movimiento decidido. Retira el molde y despega con cuidado el papel.',
        'Розігрійте духовку до 180°C і випікайте пиріг. Щойно дістанете його, відділіть краї. У рукавицях накрийте форму пласкою дошкою або таріллю й одним упевненим рухом переверніть їх разом. Зніміть форму та обережно відокремте пергамент.',
      ),
      meta: text(
        locale,
        '180°C · 25–30 min',
        '180°C · 25–30 min',
        '180°C · 25–30 хв',
      ),
      checkpoint: text(
        locale,
        'Before inverting, the sponge is golden, the centre springs back lightly, and a skewer has no wet batter.',
        'Antes de darle la vuelta, el bizcocho está dorado, el centro recupera la forma al tocarlo y la brocheta no sale con masa cruda.',
        'Перед перевертанням бісквіт золотистий, центр пружно відновлюється після легкого натискання, а на шпажці немає сирого тіста.',
      ),
    },
  ];
}

function contentForLocale(locale: Locale): RecipeSourceDraftContent {
  return {
    completeness: 'readyToReview',
    presentation: 'concise',
    difficulty: 'medium',
    evidence: {
      status: 'tested',
      explanation: text(
        locale,
        'This exact upside-down plum version has been baked successfully.',
        'Esta versión exacta del bizcocho invertido de ciruelas se ha horneado con éxito.',
        'Саме цю версію перевернутого сливового пирога успішно випікали.',
      ),
    },
    yield: {
      id: 'one-plum-cake',
      label: text(locale, '1 cake', '1 bizcocho', '1 пиріг'),
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
          relatedStepId: 'bake-and-invert',
        },
      ],
    },
    beforeStart: [
      text(
        locale,
        'Have a flat board or platter slightly larger than the pan ready for inverting. For a full-size oven tray, use a double batch.',
        'Prepara una tabla o fuente plana algo mayor que el molde para darle la vuelta. Para una bandeja de horno completa, prepara una cantidad doble.',
        'Підготуйте пласку дошку або таріль трохи більшу за форму для перевертання. Для повного дека духовки готуйте подвійну порцію.',
      ),
    ],
    ingredientSections: ingredientSections(locale),
    steps: steps(locale),
  };
}

export const plumCakeRecipe = {
  id: 'plum-cake',
  publicationStatus: 'published',
  source: {
    file: 'docs/reference/recipe-inventory.xlsx',
    locator:
      'Plum adaptation of Recipe Archive · Яблучна шарлотка; author-confirmed upside-down half batch, 2026-09-21',
  },
  ...contentForLocale('en'),
  translations: { uk: contentForLocale('uk'), es: contentForLocale('es') },
} satisfies RecipeSourceDraft;
