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
        'Bake the sponge',
        'Hornea el bizcocho',
        'Спечіть бісквіт',
      ),
      body: text(
        locale,
        'Heat the oven within the recorded 180–200°C range. Line a rimmed baking tray with parchment and spread the batter into a thin, even rectangle. Bake for 15–20 minutes.',
        'Calienta el horno dentro del intervalo anotado de 180–200°C. Forra una bandeja con borde con papel de horno y extiende la masa en un rectángulo fino y uniforme. Hornea durante 15–20 minutos.',
        'Розігрійте духовку в межах записаного діапазону 180–200°C. Застеліть пергаментом деко з бортиками й розподіліть тісто тонким рівним прямокутником. Випікайте 15–20 хвилин.',
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
      ],
    },
    {
      id: 'roll-and-cool',
      title: text(
        locale,
        'Roll with the parchment',
        'Enrolla con el papel',
        'Згорніть разом із пергаментом',
      ),
      body: text(
        locale,
        'While still warm, loosely roll the sponge together with the parchment it was baked on. Do not peel the paper away: it stays between the turns. Leave the sponge rolled until completely cool.',
        'Con el bizcocho aún caliente, enróllalo sin apretar junto con el papel en el que se ha horneado. No retires el papel: debe quedar entre las vueltas. Déjalo enrollado hasta que se enfríe por completo.',
        'Ще теплий бісквіт нещільно згорніть разом із пергаментом, на якому він випікався. Не відділяйте папір: він має залишитися між витками. Залиште рулет згорнутим до повного охолодження.',
      ),
      media: [
        {
          id: 'fruit-roll-warm-roll-v3',
          src: '/media/recipes/fruit-sponge-roll/selected/warm-sponge-roll-v3.png',
          alt: text(
            locale,
            'Warm sponge rolled together with its baking parchment, with paper visible between the turns',
            'Bizcocho caliente enrollado junto con su papel de horno, visible entre las vueltas',
            'Теплий бісквіт згортають разом із пергаментом; папір видно між витками',
          ),
        },
      ],
    },
    {
      id: 'spread-jam',
      requiresCream: true,
      title: text(
        locale,
        'Unroll and spread the jam',
        'Abre y unta la mermelada',
        'Розгорніть і намастіть варенням',
      ),
      body: text(
        locale,
        'Set aside a few spoonfuls of the freshly whipped cream for the top. Gently unroll the completely cooled sponge. Then carefully peel the parchment away from the sponge, leaving the sponge resting on the same paper. Spread a thin layer of thick berry jam.',
        'Reserva unas cucharadas de la crema recién batida para decorar. Desenrolla con cuidado el bizcocho completamente frío. Después desprende suavemente el papel del bizcocho y deja el bizcocho apoyado sobre ese mismo papel. Unta una capa fina de mermelada espesa.',
        'Відкладіть кілька ложок щойно збитого крему для оздоблення. Обережно розгорніть повністю охолоджений бісквіт. Потім обережно відділіть від нього пергамент і залиште бісквіт лежати на тому ж папері. Намастіть тонким шаром густого ягідного варення.',
      ),
      tip: text(
        locale,
        'Do not press the sponge flat: let the edge keep its inward curve to avoid cracking.',
        'No fuerces el bizcocho para dejarlo plano: conserva la curva del extremo hacia dentro para evitar que se agriete.',
        'Не намагайтеся розпрямити бісквіт повністю: збережіть природний загин краю всередину, щоб він не тріснув.',
      ),
      cookIngredients: [{ ingredientId: 'jam' }],
      media: [
        {
          id: 'fruit-roll-blueberry-jam-v4',
          src: '/media/recipes/fruit-sponge-roll/selected/blueberry-jam-v4.png',
          alt: text(
            locale,
            'Blueberry jam with small berry pieces spread on the sponge while one edge curves smoothly upward and inward over the jam',
            'Mermelada de arándanos con trocitos de fruta sobre el bizcocho, con un extremo que se curva suavemente hacia arriba y hacia dentro sobre la mermelada',
            'Чорничне варення зі шматочками ягід на бісквіті, край якого плавно заокруглюється вгору й усередину над начинкою',
          ),
        },
      ],
    },
    {
      id: 'spread-cream',
      requiresCream: true,
      title: text(
        locale,
        'Spread the cream',
        'Extiende la crema',
        'Нанесіть крем',
      ),
      body: text(
        locale,
        'Gently spread the remaining cream over the jam. Leave about 2 cm without cream along the edge that will close the roll. Add fresh fruit or berries if you like.',
        'Extiende con suavidad el resto de la crema sobre la mermelada. Deja unos 2 cm sin crema en el borde que cerrará el rollo. Si quieres, añade fruta fresca o frutos rojos.',
        'Обережно розподіліть решту крему поверх варення. Уздовж краю, який закриватиме рулет, залиште приблизно 2 см без крему. За бажанням додайте свіжі фрукти чи ягоди.',
      ),
      tip: text(
        locale,
        'The clear border gives the cream room to spread as you roll, so it does not squeeze out at the seam.',
        'El borde libre deja espacio para que la crema se desplace al enrollar sin salir por la unión.',
        'Вільний край залишає місце для крему, щоб він не витискався через шов під час згортання.',
      ),
      cookIngredients: [{ ingredientId: 'fresh-fruit' }],
      media: [
        {
          id: 'fruit-roll-cream-over-jam-v4',
          src: '/media/recipes/fruit-sponge-roll/selected/cream-over-jam-v4.png',
          alt: text(
            locale,
            'Whipped cream with mascarpone spread over blueberry jam, leaving a 2 cm border without cream at the closing edge',
            'Nata montada con mascarpone sobre mermelada de arándanos, dejando 2 cm sin crema en el borde de cierre',
            'Крем із вершків і маскарпоне поверх чорничного варення; край для закривання рулету на 2 см залишений без крему',
          ),
        },
      ],
    },
    {
      id: 'fill',
      requiresCream: true,
      title: text(
        locale,
        'Reroll and decorate',
        'Enrolla y decora',
        'Згорніть і оздобте',
      ),
      body: text(
        locale,
        'On the same parchment, reroll from the curled edge. Keep the paper underneath the roll and place the roll seam-side down. Spread the reserved cream over the top and decorate with fruit, berries or chopped nuts if you like.',
        'Sobre el mismo papel, vuelve a enrollar desde el extremo curvado. El papel queda debajo del rollo; coloca la unión hacia abajo. Unta por encima la crema reservada y decora con fruta, frutos rojos o frutos secos picados si quieres.',
        'На тому ж пергаменті згорніть рулет від загнутого краю. Папір залиште під рулетом, а рулет покладіть швом донизу. Намастіть зверху відкладеним кремом і за бажанням прикрасьте фруктами, ягодами чи подрібненими горіхами.',
      ),
      cookIngredients: [
        { ingredientId: 'fresh-fruit' },
        { ingredientId: 'nuts' },
      ],
      tip: text(
        locale,
        'Before serving, refrigerate the roll for about 2 hours so the cream and filling can set.',
        'Antes de servir, deja el rollo unas 2 horas en la nevera para que la crema y el relleno se asienten.',
        'Перед подачею дайте рулету постояти в холодильнику приблизно 2 години, щоб крем і начинка стабілізувалися.',
      ),
      media: [
        {
          id: 'fruit-roll-decorate-v1',
          src: '/media/recipes/fruit-sponge-roll/selected/decorate-roll-v1.png',
          alt: text(
            locale,
            'Reserved cream being spread on top of the finished roll, with a few berries added for decoration',
            'Crema reservada extendiéndose sobre el rollo terminado, con algunos frutos rojos de decoración',
            'Відкладений крем наносять зверху на згорнутий рулет; частину вже прикрашено ягодами',
          ),
        },
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
      planningNote: {
        phaseId: 'baking',
        text: text(
          locale,
          'Plus {duration} baking and complete cooling before filling.',
          'Además: {duration} de horno y enfriado completo antes de rellenar.',
          'Додатково: {duration} випікання й повне охолодження перед начиненням.',
        ),
      },
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
        'Cool the sponge rolled with its parchment. Fill only when completely cold.',
        'Deja enfriar el bizcocho enrollado con su papel. Rellénalo solo cuando esté completamente frío.',
        'Охолоджуйте бісквіт згорнутим разом із пергаментом. Начиняйте лише повністю холодним.',
      ),
      text(
        locale,
        'Choose thick blueberry or raspberry jam and a cream. As soon as the cream is whipped, reserve a few spoonfuls for the top.',
        'Elige mermelada espesa de arándano o frambuesa y una crema. En cuanto esté batida, reserva unas cucharadas para decorar.',
        'Оберіть густе чорничне або малинове варення й крем. Одразу після збивання відкладіть кілька ложок крему для оздоблення.',
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
