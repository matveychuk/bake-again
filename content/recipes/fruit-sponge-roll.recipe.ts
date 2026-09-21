import type {
  RecipeSourceDraft,
  RecipeSourceDraftContent,
  StructuredIngredientSection,
  StructuredRecipeStep,
} from './source-recipe.types.ts';
import { quantityFromGrams } from './spoon-weights.ts';

type Locale = 'en' | 'es' | 'uk';

const text = (locale: Locale, en: string, es: string, uk: string) =>
  locale === 'uk' ? uk : locale === 'es' ? es : en;

const quantity = {
  eggs: {
    base: { kind: 'exact' as const, value: 5, unit: 'piece' as const },
    shopping: {
      mode: 'base' as const,
      increment: 1,
      rounding: 'up' as const,
    },
  },
  sugar: quantityFromGrams('granulated-sugar', 100),
  salt: {
    base: null,
    equivalent: { kind: 'exact' as const, value: 1, unit: 'pinch' as const },
    shopping: { mode: 'nameOnly' as const },
  },
  oil: {
    base: { kind: 'exact' as const, value: 35, unit: 'ml' as const },
    shopping: { mode: 'base' as const },
  },
  water: {
    base: { kind: 'exact' as const, value: 35, unit: 'ml' as const },
    shopping: { mode: 'base' as const, defaultSelected: false },
  },
  flour: quantityFromGrams('schar-mix-b', 120),
  nameOnly: { base: null, shopping: { mode: 'nameOnly' as const } },
};

function ingredientSections(locale: Locale): StructuredIngredientSection[] {
  return [
    {
      id: 'sponge',
      title: text(locale, 'Sponge', 'Bizcocho', 'Бісквіт'),
      ingredients: [
        {
          id: 'eggs',
          name: text(locale, 'Eggs', 'Huevos', 'Яйця'),
          quantity: quantity.eggs,
        },
        {
          id: 'sugar-sponge',
          name: text(locale, 'Sugar', 'Azúcar', 'Цукор'),
          quantity: quantity.sugar,
        },
        {
          id: 'salt',
          name: text(locale, 'Salt', 'Sal', 'Сіль'),
          quantity: quantity.salt,
          scaling: 'fixed',
        },
        {
          id: 'oil',
          name: text(locale, 'Neutral oil', 'Aceite neutro', 'Нейтральна олія'),
          quantity: quantity.oil,
        },
        {
          id: 'water',
          name: text(locale, 'Water', 'Agua', 'Вода'),
          quantity: quantity.water,
        },
        {
          id: 'flour',
          name: text(
            locale,
            'Schär Mix B Bread flour',
            'Harina Schär Mix B Bread',
            'Борошно Schär Mix B Bread',
          ),
          quantity: quantity.flour,
        },
      ],
    },
    {
      id: 'filling',
      title: text(
        locale,
        'Filling and decoration',
        'Relleno y decoración',
        'Начинка й оздоблення',
      ),
      ingredients: [
        {
          id: 'jam',
          name: text(
            locale,
            'Thick berry jam',
            'Mermelada espesa de frutos rojos',
            'Густе ягідне варення',
          ),
          quantity: quantity.nameOnly,
          note: text(
            locale,
            'Blueberry or raspberry are the author’s favourites.',
            'Los sabores favoritos de la autora son arándano o frambuesa.',
            'Фаворити авторки — чорничне або малинове.',
          ),
        },
        {
          id: 'fresh-fruit',
          name: text(
            locale,
            'Fresh fruit or berries',
            'Fruta fresca o frutos rojos',
            'Свіжі фрукти або ягоди',
          ),
          quantity: quantity.nameOnly,
          note: text(
            locale,
            'For the filling and decoration; wash and dry thoroughly.',
            'Para el relleno y la decoración; lavar y secar bien.',
            'Для начинки й оздоблення; добре вимити та обсушити.',
          ),
          optional: true,
        },
        {
          id: 'nuts',
          name: text(
            locale,
            'Chopped nuts',
            'Frutos secos picados',
            'Подрібнені горіхи',
          ),
          quantity: quantity.nameOnly,
          note: text(
            locale,
            'For the top, instead of or together with fresh fruit.',
            'Para la parte superior, en lugar de la fruta fresca o junto con ella.',
            'Для верху — замість свіжих фруктів або разом із ними.',
          ),
          optional: true,
        },
      ],
    },
  ];
}

function steps(locale: Locale): StructuredRecipeStep[] {
  return [
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
        'Whip the eggs with the sugar and salt for about 10 minutes.',
        'Bate los huevos con el azúcar y la sal durante unos 10 minutos.',
        'Збивайте яйця з цукром і сіллю приблизно 10 хвилин.',
      ),
      meta: text(locale, 'About 10 min', 'Unos 10 min', 'Приблизно 10 хв'),
      checkpoint: text(
        locale,
        'The mixture is pale and thick, and falls from the whisk in a broad ribbon that remains visible briefly.',
        'La mezcla está pálida y espesa y cae de las varillas en una cinta ancha que permanece visible unos instantes.',
        'Маса світла й густа, а слід від вінчика спадає широкою стрічкою та кілька секунд тримається на поверхні.',
      ),
      cookIngredients: [
        { ingredientId: 'eggs' },
        { ingredientId: 'sugar-sponge' },
        { ingredientId: 'salt' },
      ],
      media: [
        {
          id: 'fruit-roll-egg-foam-v1',
          src: '/media/recipes/fruit-sponge-roll/selected/whipped-egg-foam-v1.png',
          alt: text(
            locale,
            'Thick pale egg foam falling from a whisk in a broad ribbon',
            'Espuma de huevo pálida y espesa cayendo de las varillas en una cinta ancha',
            'Густа світла яєчна піна спадає з вінчика широкою стрічкою',
          ),
        },
      ],
    },
    {
      id: 'fold-batter',
      title: text(
        locale,
        'Fold the batter',
        'Integra la masa',
        'Змішайте тісто',
      ),
      body: text(
        locale,
        'Fold in the oil, then the water. Add the flour gradually and fold gently just until no dry pockets remain.',
        'Incorpora con movimientos envolventes el aceite y después el agua. Añade la harina poco a poco y mezcla con suavidad solo hasta que no queden zonas secas.',
        'Обережно вмішайте олію, потім воду. Поступово додайте борошно й складайте лопаткою лише доки не зникнуть сухі ділянки.',
      ),
      cookIngredients: [
        { ingredientId: 'oil' },
        { ingredientId: 'water' },
        { ingredientId: 'flour' },
      ],
    },
    {
      id: 'bake-roll',
      title: text(
        locale,
        'Bake and shape while warm',
        'Hornea y da forma en caliente',
        'Спечіть і сформуйте теплим',
      ),
      body: text(
        locale,
        'Heat the oven within the recorded 180–200°C range. Line a rimmed baking tray with parchment and spread the batter into a thin, even rectangle. Bake for 15–20 minutes. While the sponge is still warm, use the parchment to roll it loosely without filling; leave it rolled until completely cool.',
        'Calienta el horno dentro del intervalo anotado de 180–200°C. Forra una bandeja con borde con papel de horno y extiende la masa en un rectángulo fino y uniforme. Hornea durante 15–20 minutos. Con el bizcocho aún caliente, enróllalo sin relleno y con ayuda del papel; déjalo enrollado hasta que se enfríe por completo.',
        'Розігрійте духовку в межах записаного діапазону 180–200°C. Застеліть пергаментом деко з бортиками й розподіліть тісто тонким рівним прямокутником. Випікайте 15–20 хвилин. Ще теплий бісквіт нещільно згорніть без начинки, допомагаючи собі пергаментом, і залиште так до повного охолодження.',
      ),
      meta: text(
        locale,
        '180–200°C · 15–20 min',
        '180–200°C · 15–20 min',
        '180–200°C · 15–20 хв',
      ),
      checkpoint: text(
        locale,
        'The sponge is lightly golden, springs back when touched and remains flexible enough to roll.',
        'El bizcocho está ligeramente dorado, recupera la forma al tocarlo y sigue flexible para enrollarlo.',
        'Бісквіт злегка золотистий, пружинить після дотику й залишається достатньо гнучким для згортання.',
      ),
      media: [
        {
          id: 'fruit-roll-batter-tray-v1',
          src: '/media/recipes/fruit-sponge-roll/selected/batter-on-tray-v1.png',
          alt: text(
            locale,
            'Airy sponge batter spread in a thin, even rectangle on parchment',
            'Masa aireada extendida en un rectángulo fino y uniforme sobre papel de horno',
            'Повітряне бісквітне тісто розподілене тонким рівним прямокутником на пергаменті',
          ),
        },
        {
          id: 'fruit-roll-warm-roll-v1',
          src: '/media/recipes/fruit-sponge-roll/selected/warm-sponge-roll-v1.png',
          alt: text(
            locale,
            'Warm golden sponge sheet being loosely rolled with its parchment',
            'Plancha de bizcocho dorada y caliente enrollándose suavemente con el papel',
            'Теплий золотистий бісквіт нещільно згортають за допомогою пергаменту',
          ),
        },
      ],
    },
    {
      id: 'fill',
      title: text(
        locale,
        'Fill, reroll and decorate',
        'Rellena, enrolla y decora',
        'Начиніть, згорніть і оздобте',
      ),
      body: text(
        locale,
        'Gently unroll the cooled sponge and reserve about one quarter of the selected cream for the top. Spread a thin, even layer of thick jam over the sponge, then the remaining cream, leaving about 2 cm bare along the far edge. Add optional fresh fruit or berries. Reroll and place seam-side down. Spread the reserved cream over the top, then finish with fresh fruit, berries or chopped nuts.',
        'Desenrolla con cuidado el bizcocho frío y reserva aproximadamente una cuarta parte de la crema elegida para la parte superior. Extiende una capa fina y uniforme de mermelada espesa y después el resto de la crema, dejando unos 2 cm libres en el borde opuesto. Añade fruta fresca o frutos rojos si quieres. Vuelve a enrollar y coloca la unión hacia abajo. Extiende encima la crema reservada y termina con fruta fresca, frutos rojos o frutos secos picados.',
        'Обережно розгорніть охолоджений бісквіт і відкладіть приблизно чверть вибраного крему для верху. Нанесіть тонкий рівний шар густого варення, потім решту крему, залишаючи приблизно 2 см вільними вздовж дальнього краю. За бажанням розкладіть свіжі фрукти чи ягоди. Знову згорніть рулет і покладіть швом донизу. Намастіть зверху відкладеним кремом та оздобте свіжими фруктами, ягодами або подрібненими горіхами.',
      ),
      cookIngredients: [
        { ingredientId: 'jam' },
        { ingredientId: 'fresh-fruit' },
        { ingredientId: 'nuts' },
      ],
    },
  ];
}

function content(locale: Locale): RecipeSourceDraftContent {
  return {
    presentation: 'concise',
    completeness: 'readyToReview',
    difficulty: 'easy',
    evidence: {
      status: 'tested',
      explanation: text(
        locale,
        'This sponge-roll base was baked successfully.',
        'Esta base de brazo de gitano se horneó con éxito.',
        'Цю основу бісквітного рулету успішно випікали.',
      ),
    },
    creamOptions: {
      recipeIds: ['mascarpone-whipped-cream', 'vanilla-buttercream'],
      recommendedRecipeId: 'mascarpone-whipped-cream',
    },
    yield: {
      id: 'one-roll',
      label: text(locale, '1 roll', '1 brazo de gitano', '1 рулет'),
      count: { kind: 'exact', value: 1 },
      unit: 'batch',
    },
    timing: {
      activeMinutes: 30,
      totalElapsedMinutes: null,
      phases: [
        {
          id: 'whipping',
          label: text(locale, 'Whipping', 'Batido', 'Збивання'),
          duration: { kind: 'exact', value: 10, unit: 'minute' },
          relatedStepId: 'whip-eggs',
        },
        {
          id: 'baking',
          label: text(locale, 'Baking', 'Horneado', 'Випікання'),
          duration: { kind: 'range', min: 15, max: 20, unit: 'minute' },
          relatedStepId: 'bake-roll',
        },
      ],
    },
    beforeStart: [
      text(
        locale,
        'Allow time for the rolled sponge to cool completely before filling; the total time depends on room temperature. Choose a thick blueberry or raspberry jam and one of the two cream options.',
        'Reserva tiempo para que el bizcocho enrollado se enfríe por completo antes de rellenarlo; el tiempo total depende de la temperatura ambiente. Elige una mermelada espesa de arándano o frambuesa y una de las dos cremas.',
        'Закладіть час, щоб згорнутий бісквіт повністю охолов перед начиненням: загальний час залежить від температури в кімнаті. Оберіть густе чорничне або малинове варення й один із двох кремів.',
      ),
    ],
    ingredientSections: ingredientSections(locale),
    steps: steps(locale),
  };
}

export const fruitSpongeRollRecipe = {
  id: 'fruit-sponge-roll',
  publicationStatus: 'published',
  source: {
    file: 'docs/reference/recipe-inventory.xlsx',
    locator: 'Recipe Archive · Бісквітний рулет з фруктами',
  },
  ...content('en'),
  translations: {
    es: content('es'),
    uk: content('uk'),
  },
} satisfies RecipeSourceDraft;
