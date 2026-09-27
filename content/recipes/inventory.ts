import type { LocalizedText } from './recipe.types.ts';
import type { RecipeCollectionId } from './collections.ts';

export type InventoryArchiveSection = {
  title: string;
  content: string;
};

export type InventoryRecipe = {
  id: string;
  slug: string;
  title: string;
  sourceTitle: string;
  category: string;
  /** Reader-facing collections; category is search metadata, not a visible card eyebrow. */
  collectionIds: RecipeCollectionId[];
  testingStatus: 'Core verified' | 'Suggested adaptation';
  flour: string;
  difficulty: string | null;
  activeTime: string | null;
  totalTime: string | null;
  localizedFacts?: {
    difficulty: LocalizedText;
    activeTime: LocalizedText;
    totalTime: LocalizedText;
    flour?: LocalizedText;
  };
  scalingAnchorIngredientId?: string;
  launchPriority: string;
  heroCandidate: 'Yes' | 'Possible' | 'No';
  image: string;
  imageKind: 'generated-preview' | 'author-photo' | 'edited-author-photo';
  imageAlt: string;
  summary: string;
  source: string;
  archiveSections: InventoryArchiveSection[];
  needsBeforePublishing: string;
};

const schar = 'Schär Mix B Bread';

export const recipeInventory: InventoryRecipe[] = [
  {
    id: 'celebration-sponge-cake',
    slug: 'celebration-sponge-cake',
    title: 'Celebration cake',
    sourceTitle: 'Святковий торт',
    category: 'Layer cake',
    collectionIds: ['celebration'],
    testingStatus: 'Core verified',
    flour: 'Schär Mix B Bread + tapioca and corn starch',
    difficulty: 'Medium',
    activeTime: '1 h 30 min',
    totalTime: null,
    scalingAnchorIngredientId: 'sponge-eggs',
    launchPriority: 'High',
    heroCandidate: 'Yes',
    image:
      '/media/recipes/celebration-sponge-cake/selected/author-cake-warm-precision-v1.webp',
    imageKind: 'edited-author-photo',
    imageAlt: 'Tall homemade fruit cake with chocolate glaze and cream flowers',
    summary:
      'A tall, tender celebration cake with generous sour cream filling, chocolate drips and fresh fruit.',
    source: 'Author-confirmed cake · 2026-09-25',
    archiveSections: [],
    needsBeforePublishing: '',
  },
  {
    id: 'banana-bread',
    slug: 'banana-bread',
    title: 'Banana bread',
    sourceTitle: 'Банановий хліб',
    category: 'Everyday cake',
    collectionIds: ['everyday'],
    testingStatus: 'Core verified',
    flour: schar,
    difficulty: 'Easy',
    activeTime: '30 min',
    totalTime: '1 h 30 min',
    localizedFacts: {
      difficulty: {
        en: 'Easy',
        es: 'Fácil',
        uk: 'Легка',
      },
      activeTime: {
        en: '30 min',
        es: '30 min',
        uk: '30 хв',
      },
      totalTime: {
        en: '1 h 30 min',
        es: '1 h 30 min',
        uk: '1 год 30 хв',
      },
      flour: {
        en: 'Schär Mix B Bread',
        es: 'Schär Mix B Bread',
        uk: 'Schär Mix B Bread',
      },
    },
    launchPriority: 'Medium',
    heroCandidate: 'Possible',
    image: '/images/recipes/banana-bread-card-v1.webp',
    imageKind: 'generated-preview',
    imageAlt:
      'Gluten-free banana bread with walnuts and raisins, sliced on a warm neutral surface',
    summary: 'Banana bread with walnuts and raisins.',
    source: 'Handwritten notebook page, IMG_1272.jpeg',
    archiveSections: [
      {
        title: 'Ingredients · original notes',
        content:
          '3 дуже спілих банана\n1/2 чашки масла кімнатної температури\n3/4 чашки цукру\n2 великих яйця\n1,5 чашки борошна\n1 ч. л. розпушувача\n1/2 ч. л. солі\n1/2 ч. л. ванілі\n1 чашка горіхів\n1 чашка ізюму',
      },
    ],
    needsBeforePublishing:
      'Record difficulty and timing; add the preparation method; approve or replace the generated photo.',
  },
  {
    id: 'lazy-dumplings',
    slug: 'lazy-dumplings',
    title: 'Lazy cottage-cheese dumplings',
    sourceTitle: 'Ліниві вареники',
    category: 'Breakfast / everyday',
    collectionIds: ['breakfast', 'everyday', 'cottage-cheese'],
    testingStatus: 'Core verified',
    flour: `${schar} + tapioca starch`,
    difficulty: 'Medium',
    activeTime: '45 min',
    totalTime: null,
    scalingAnchorIngredientId: 'cottage-cheese',
    launchPriority: 'Medium',
    heroCandidate: 'No',
    image: '/images/recipes/lazy-dumplings-card-v1.webp',
    imageKind: 'generated-preview',
    imageAlt:
      'Ukrainian lazy cottage-cheese dumplings with sour cream and butter',
    summary: 'Tender cottage-cheese dumplings.',
    source:
      'Handwritten notebook page, IMG_1277.jpeg, with author-confirmed working quantities and method',
    archiveSections: [
      {
        title: 'Ingredients · original notes',
        content:
          '2 пачки творогу\n2 яйця\n3 ст. л. цукру\n90 г борошна\n7 г тапіоки або кукурудзяного крохмалю',
      },
      {
        title: 'Method · original notes',
        content:
          'Творог, яйця й цукор перемішати. Борошно і крохмаль перемішати та додати в творог. Вимішати й дати постояти 15–30 хв.\n\nВаріант на 7 пачок: 7 яєць, 10 ст. л. цукру, 300 г борошна, 25 г тапіоки.',
      },
    ],
    needsBeforePublishing:
      'Record yield, difficulty and total timing; approve or replace the generated photo.',
  },
  {
    id: 'apple-charlotte',
    slug: 'apple-charlotte',
    title: 'Apple charlotte',
    sourceTitle: 'Яблучна шарлотка',
    category: 'Everyday cake',
    collectionIds: ['everyday'],
    testingStatus: 'Core verified',
    flour: `${schar} + tapioca starch`,
    difficulty: 'Easy',
    activeTime: '20 min',
    totalTime: '50 min',
    localizedFacts: {
      difficulty: { en: 'Easy', es: 'Fácil', uk: 'Легка' },
      activeTime: { en: '20 min', es: '20 min', uk: '20 хв' },
      totalTime: { en: '50 min', es: '50 min', uk: '50 хв' },
    },
    scalingAnchorIngredientId: 'eggs',
    launchPriority: 'High',
    heroCandidate: 'Possible',
    image: '/images/recipes/apple-charlotte-card-v2.webp',
    imageKind: 'generated-preview',
    imageAlt:
      'Gluten-free apple charlotte with a cut square showing apple pieces throughout the crumb',
    summary:
      'A tender butter sponge with juicy pieces distributed through the crumb.',
    source:
      'Handwritten notebook page, IMG_1278.jpeg, with author-confirmed butter version and half batch recorded 2026-09-21',
    archiveSections: [
      {
        title: 'Ingredients · reviewed half batch',
        content:
          '3 яблука\n5 невеликих яєць\n100 г цукру\n50 г вершкового масла\n120 г безглютенового борошна\n15 г тапіокового крохмалю\n1/2 ч. л. ксантанової камеді\nДрібка солі\nВанілін\nКориця',
      },
      {
        title: 'Method · reviewed version',
        content:
          'Яблука нарізати шматочками, обсушити й злегка вкрити частиною борошна. Яйця з цукром збити до стрічки, обережно вмішати сухі інгредієнти, охолоджене розтоплене масло та яблука. Випікати при 180°C протягом 25–30 хв. Для повного дека взяти подвійну порцію.',
      },
    ],
    needsBeforePublishing: '',
  },
  {
    id: 'apple-meringue-pie',
    slug: 'apple-meringue-pie',
    title: 'Apple meringue pie',
    sourceTitle: 'Безглютеновий яблучний пиріг',
    category: 'Apple pie / dessert',
    collectionIds: ['everyday'],
    testingStatus: 'Suggested adaptation',
    flour: 'GFM Universal gluten-free baking mix',
    difficulty: null,
    activeTime: null,
    totalTime: '40 min baking + 1–2 h chilling',
    localizedFacts: {
      difficulty: { en: '', es: '', uk: '' },
      activeTime: { en: '', es: '', uk: '' },
      totalTime: {
        en: '40 min baking + 1–2 h chilling',
        es: '40 min de horneado + 1–2 h de frío',
        uk: '40 хв випікання + 1–2 год охолодження',
      },
      flour: {
        en: 'GFM Universal gluten-free baking mix',
        es: 'Mezcla universal sin gluten GFM',
        uk: 'Безглютенова суміш GFM «Універсальна»',
      },
    },
    launchPriority: 'Medium',
    heroCandidate: 'No',
    image: '/images/recipes/apple-meringue-pie-card-v1.webp',
    imageKind: 'generated-preview',
    imageAlt:
      'Generated preview of a gluten-free apple pie with a short pastry base and toasted meringue topping',
    summary:
      'A chilled gluten-free pastry base topped with grated apples and soft meringue.',
    source:
      'Food GFM web recipe, “Безглютеновий яблучний пиріг: простий рецепт осінньої випічки”, 10.09.2025',
    archiveSections: [
      {
        title: 'Ingredients · source transcription',
        content:
          'Для тіста: 1 яйце (жовток — у тісто, білок — для меренги); 30 мл холодної води; 60 г цукру; 60 г масла; 170 г безглютенової суміші «Універсальна»; розпушувач.\n\nНачинка: яблука, очищені та натерті; білок, збитий у ніжну меренгу.',
      },
      {
        title: 'Method · source transcription',
        content:
          '1. Масло розтерти з жовтком і цукром.\n2. Додати воду, розпушувач і борошняну суміш.\n3. Замісити м’яке тісто, щоб не липло до рук.\n4. Поставити у холодильник на 1–2 години.\n5. Форму застелити тістом, викласти яблука, зверху прикрасити меренгою.\n6. Випікати 40 хв при 180°C.',
      },
    ],
    needsBeforePublishing:
      'Bake-test the exact recipe; record the apple quantity and variety, baking-powder amount, pan dimensions, meringue sugar amount, oven mode, active time and finished yield; replace or approve the generated preview.',
  },
  {
    id: 'plum-cake',
    slug: 'plum-cake',
    title: 'Plum sponge cake',
    sourceTitle: 'Сливовий пиріг',
    category: 'Everyday cake',
    collectionIds: ['everyday'],
    testingStatus: 'Core verified',
    flour: `${schar} + tapioca starch`,
    difficulty: 'Medium',
    activeTime: '30 min',
    totalTime: '1 hr',
    localizedFacts: {
      difficulty: { en: 'Medium', es: 'Media', uk: 'Середня' },
      activeTime: { en: '30 min', es: '30 min', uk: '30 хв' },
      totalTime: { en: '1 hr', es: '1 h', uk: '1 год' },
    },
    scalingAnchorIngredientId: 'eggs',
    launchPriority: 'Medium',
    heroCandidate: 'Possible',
    image: '/images/recipes/plum-cake-author-hero-v1.webp',
    imageKind: 'edited-author-photo',
    imageAlt:
      'Round upside-down plum cake with a cut slice showing the pale crumb',
    summary:
      'A tender butter sponge with juicy plum wedges and a gentle tartness.',
    source:
      'Author recipe revision and 13 original process/result photographs, 2026-09-25',
    archiveSections: [
      {
        title: 'Ingredients · author revision 2026-09-25',
        content:
          '400 г слив, 5 невеликих яєць, 100 г цукру, 120 г Schär Mix B Bread, 15 г тапіокового крохмалю, 5 г ксантанової камеді (1 ч. л., опціонально), 50 г вершкового масла та трохи для пергаменту, дрібка солі, ванілін.',
      },
      {
        title: 'Method · reviewed version',
        content:
          'Сливи нарізати скибочками та викласти на змащений пергамент. Жовтки збити з 2 ст. л. цукру, білки — з рештою; обережно з’єднати. Після борошна змішати 3–4 ложки тіста з 50 г розтопленого ледь теплого масла, повернути в основне тісто та обережно вмішати. Викласти на сливи. Підготовка 30 хв; випікання 30 хв при 200°C. Перевернути готовий пиріг.',
      },
    ],
    needsBeforePublishing: '',
  },
  {
    id: 'cottage-cheese-waffles',
    slug: 'cottage-cheese-waffles',
    title: 'Cottage-cheese waffles',
    sourceTitle: 'Творожні вафлі',
    category: 'Breakfast / snack',
    collectionIds: [
      'breakfast',
      'everyday',
      'cottage-cheese',
      'batter-on-hand',
    ],
    testingStatus: 'Core verified',
    flour: `${schar} + corn starch`,
    difficulty: 'Easy',
    activeTime: '30 min',
    totalTime: '40 min',
    scalingAnchorIngredientId: 'cottage-cheese',
    localizedFacts: {
      difficulty: { en: 'Easy', es: 'Fácil', uk: 'Легка' },
      activeTime: { en: '30 min', es: '30 min', uk: '30 хв' },
      totalTime: { en: '40 min', es: '40 min', uk: '40 хв' },
      flour: {
        en: 'Schär Mix B Bread + corn starch',
        es: 'Schär Mix B Bread + almidón de maíz',
        uk: 'Schär Mix B Bread + кукурудзяний крохмаль',
      },
    },
    launchPriority: 'Medium',
    heroCandidate: 'No',
    image: '/images/recipes/cottage-cheese-waffles-linen-ivory-plate-v3.webp',
    imageKind: 'edited-author-photo',
    imageAlt:
      'Golden gluten-free cottage-cheese waffles with berries on an ivory ceramic plate',
    summary:
      'Tender breakfast waffles made with cottage cheese and natural yogurt.',
    source: 'Handwritten notebook page, IMG_1276.jpeg',
    archiveSections: [
      {
        title: 'Ingredients · original notes',
        content:
          'Творог — 500 г (2 пачки)\nЯйця — 4 шт.\nНатуральний йогурт — 200 мл (2 пачки)\nОлія соняшникова — 60–80 мл\nБорошно — 250 г\nКукурудзяний крохмаль — 1 ст. л.\nРозпушувач — 2 ч. л.\nЦукор — 1 ст. л.\nДрібка солі\nВаніль',
      },
      {
        title: 'Method · original notes',
        content:
          '1. Творог проблендерити з яйцями і йогуртом до однорідної маси.\n2. Додати олію, цукор, сіль і ваніль.\n3. Окремо змішати борошно, крохмаль і розпушувач.\n4. Всипати до вологої маси і замішати.\n5. Залишити тісто на 7–10 хв.\n6. Добре розігріти вафельницю. Випікати по 5–7 хв.',
      },
    ],
    needsBeforePublishing: '',
  },
  {
    id: 'carrot-cake',
    slug: 'carrot-cake',
    title: 'Carrot cake',
    sourceTitle: 'Морквяний кекс',
    category: 'Cake',
    collectionIds: ['everyday', 'batter-on-hand'],
    testingStatus: 'Core verified',
    flour: schar,
    difficulty: 'Medium',
    activeTime: '30 min',
    scalingAnchorIngredientId: 'carrots',
    totalTime: '35–40 min baking + preparation',
    launchPriority: 'Medium',
    heroCandidate: 'No',
    image: '/images/recipes/carrot-cake-card-v1.webp',
    imageKind: 'generated-preview',
    imageAlt: 'Gluten-free carrot loaf cake with walnuts and raisins',
    summary:
      'A carrot cake with raisins and a choice of walnuts or pecans, scaled to one cake.',
    source:
      'Handwritten notebook page, IMG_1273.jpeg, with author-confirmed one-cake quantities and method',
    archiveSections: [
      {
        title: 'Ingredients · original notes',
        content:
          'Морква — 500–600 г\nОлія — 300 мл\nЯйця — 8 шт.\nЦукор — 300 г\nБорошно — 500 г\nРозпушувач — 16 г\nСіль — 4 г\nГрецькі горіхи — 300 г (2 пачки)\nРодзинки — 250 г (1 пачка)',
      },
      {
        title: 'Method · original notes',
        content:
          '1. Натерти моркву і збити її блендером з олією.\n2. Яйця з цукром збити до густої піни.\n3. Змішати борошно, розпушувач і сіль; додати до рідких інгредієнтів.\n4. Додати замочені родзинки та горіхи.\n5. Змастити форму маслом і вилити тісто. Запис: «Тут на 3 кекси».\n6. Випікати при 200°C 35–40 хв.',
      },
    ],
    needsBeforePublishing:
      'Confirm the exact pan dimensions and total timing; approve or replace the generated photo.',
  },
  {
    id: 'sponge-cake',
    slug: 'sponge-cake',
    title: 'Sponge cake',
    sourceTitle: 'Бісквіт',
    category: 'Cake base',
    collectionIds: ['celebration'],
    testingStatus: 'Core verified',
    flour: `${schar} + tapioca and corn starch`,
    difficulty: 'Easy',
    activeTime: '15 min',
    totalTime: null,
    localizedFacts: {
      difficulty: {
        en: 'Easy',
        es: 'Fácil',
        uk: 'Легка',
      },
      activeTime: {
        en: '15 min',
        es: '15 min',
        uk: '15 хв',
      },
      totalTime: {
        en: '40–50 min baking + gradual cooling',
        es: '40–50 min de horneado + enfriado gradual',
        uk: '40–50 хв випікання + поступове охолодження',
      },
      flour: {
        en: 'Schär Mix B Bread + tapioca and corn starch',
        es: 'Schär Mix B Bread + almidones de tapioca y maíz',
        uk: 'Schär Mix B Bread + тапіоковий і кукурудзяний крохмалі',
      },
    },
    launchPriority: 'Medium',
    heroCandidate: 'No',
    image: '/images/recipes/sponge-cake-card-v1.webp',
    imageKind: 'generated-preview',
    imageAlt: 'Tall plain gluten-free sponge cake with one wedge cut',
    summary:
      'A tall, airy gluten-free sponge base made with separated eggs and a starch blend.',
    source: 'Handwritten notebook page with corrections, IMG_1274.jpeg',
    archiveSections: [
      {
        title: 'Ingredients · original notes',
        content:
          '5 великих або 6 маленьких яєць\nЦукор — неповна склянка (позначка 120 г) + 2 ст. л. для жовтків\nКукурудзяний крохмаль — 15 г\nТапіока — 70 г\nБорошно — 140 г',
      },
      {
        title: 'Method · original notes',
        content:
          '1. Увімкнути духовку. Яйця розділити.\n2. Білки збити до густої білої піни, за 3–4 рази додати цукор.\n3. Жовтки з 2 ст. л. цукру збити до посвітління.\n4. Обережно вмішати жовтки в білки.\n5. За 2–3 рази вмішати сухі інгредієнти.\n6. Змастити тільки дно форми. Випікати приблизно 40–50 хв при 200°C.',
      },
    ],
    needsBeforePublishing:
      'Record the long form dimensions, doneness cue and full timing; approve or replace the generated photo.',
  },
  {
    id: 'crepes',
    slug: 'crepes',
    title: 'Thin breakfast crepes',
    sourceTitle: 'Млинці',
    category: 'Breakfast / everyday',
    collectionIds: ['breakfast', 'everyday'],
    testingStatus: 'Core verified',
    flour: schar,
    difficulty: 'Medium',
    activeTime: '40 min',
    totalTime: '1 hr',
    localizedFacts: {
      difficulty: { en: 'Medium', es: 'Media', uk: 'Середня' },
      activeTime: { en: '40 min', es: '40 min', uk: '40 хв' },
      totalTime: { en: '1 hr', es: '1 h', uk: '1 год' },
    },
    scalingAnchorIngredientId: 'eggs',
    launchPriority: 'High',
    heroCandidate: 'Yes',
    image: '/images/crepes.webp',
    imageKind: 'generated-preview',
    imageAlt: 'A stack of thin golden gluten-free breakfast crepes',
    summary:
      'Thin everyday crepes for three, finished with hot water after resting.',
    source: 'Handwritten notebook page, IMG_1275.jpeg',
    archiveSections: [
      {
        title: 'Ingredients · original notes',
        content:
          '5 яєць\n5 ст. л. борошна\n0,5 л молока\n1 ст. л. цукру\nДрібка солі\n5 ст. л. олії\n0,5 склянки води, краще гарячої',
      },
      {
        title: 'Method · original notes',
        content:
          '1. Змішати яйця, борошно, цукор, сіль і трохи молока без грудочок.\n2. Поступово додати молоко.\n3. Додати 0,5 склянки води, краще гарячої, та олію.\n4. Дати постояти 15–30 хв. За потреби додавати молоко або воду до рідкої консистенції.',
      },
    ],
    needsBeforePublishing:
      'Review the generated step photos and approve or replace the preview photo.',
  },
  {
    id: 'gluten-free-napoleon',
    slug: 'napoleon-cake',
    title: 'Napoleon cake',
    sourceTitle: 'Безглютеновий Наполеон',
    category: 'Celebration / layer cake',
    collectionIds: ['celebration'],
    testingStatus: 'Core verified',
    flour: `${schar} + tapioca and corn starch`,
    difficulty: 'Advanced',
    activeTime: '1 h',
    totalTime: null,
    localizedFacts: {
      difficulty: { en: 'Advanced', es: 'Avanzada', uk: 'Складна' },
      activeTime: { en: '1 hr', es: '1 h', uk: '1 год' },
      totalTime: {
        en: 'Best the next day',
        es: 'Mejor al día siguiente',
        uk: 'Найкраще наступного дня',
      },
      flour: {
        en: 'Schär Mix B + tapioca and corn starch',
        es: 'Schär Mix B + almidones de tapioca y maíz',
        uk: 'Schär Mix B + тапіоковий і кукурудзяний крохмалі',
      },
    },
    scalingAnchorIngredientId: 'schar-mix-b',
    launchPriority: 'High',
    heroCandidate: 'Yes',
    image: '/images/recipes/gluten-free-napoleon-card-v3.webp',
    imageKind: 'generated-preview',
    imageAlt:
      'Gluten-free Napoleon cake with six thin layers, custard and nuts',
    summary:
      'A many-layered gluten-free celebration cake with warm custard and a long overnight rest.',
    source:
      'Detailed recipe card transferred from a separate ChatGPT conversation',
    archiveSections: [],
    needsBeforePublishing: '',
  },
  {
    id: 'cinnamon-rolls',
    slug: 'cinnamon-rolls',
    title: 'Cinnamon rolls',
    sourceTitle: 'Cinnabons / cinnamon rolls',
    category: 'Sweet yeast baking',
    collectionIds: ['everyday'],
    testingStatus: 'Core verified',
    flour: 'Rice flour + corn and tapioca starch',
    difficulty: null,
    activeTime: null,
    totalTime: null,
    localizedFacts: {
      difficulty: {
        en: 'Medium',
        es: 'Media',
        uk: 'Середня',
      },
      activeTime: {
        en: '60 min',
        es: '60 min',
        uk: '1 год',
      },
      totalTime: {
        en: 'To confirm',
        es: 'Por confirmar',
        uk: 'Потребує уточнення',
      },
      flour: {
        en: 'Rice flour + corn and tapioca starch',
        es: 'Harina de arroz + almidones de maíz y tapioca',
        uk: 'Рисове борошно + кукурудзяний і тапіоковий крохмалі',
      },
    },
    launchPriority: 'High',
    heroCandidate: 'Yes',
    image: '/images/recipes/cinnamon-rolls-card-v1.webp',
    imageKind: 'generated-preview',
    imageAlt: 'Gluten-free cinnamon rolls with a light cream glaze',
    summary:
      'Soft gluten-free cinnamon rolls made with rice flour, corn and tapioca starch, with a choice of cinnamon or cocoa-peanut filling.',
    source:
      'Megasilvita, “Cinnamon Rolls Sin Gluten la receta perfecta”, confirmed by the author as the recipe used',
    archiveSections: [
      {
        title: 'Source recipe',
        content:
          'https://www.megasilvita.com/blog/cinnamon-rolls-sin-gluten-la-receta-perfecta/',
      },
    ],
    needsBeforePublishing:
      'Confirm the filling and finish used, yield, baking-dish dimensions, difficulty and full timing; approve or replace the generated photo.',
  },
  {
    id: 'crinkle-cookies',
    slug: 'crinkle-cookies',
    title: 'Chocolate crinkle cookies',
    sourceTitle: 'Мармурове печиво «Тріщинки»',
    category: 'Cookies / sweet baking',
    collectionIds: ['everyday', 'batter-on-hand'],
    testingStatus: 'Core verified',
    flour: schar,
    difficulty: 'Easy',
    activeTime: '30 min',
    totalTime: null,
    launchPriority: 'High',
    heroCandidate: 'Yes',
    image: '/images/recipes/chocolate-crinkle-cookies-card-v1.webp',
    imageKind: 'generated-preview',
    imageAlt: 'Chocolate crinkle cookies dusted with powdered sugar',
    summary:
      'Chocolate cookies with a tender centre and a cracked sugar coating.',
    source: 'Full recipe pasted in the inventory conversation',
    archiveSections: [
      {
        title: 'Ingredients · original notes',
        content:
          'Вершкове масло — 60 г\nЯйця — 2 шт.\nЦукор — 200 г\nКакао — 60 г\nБорошно — 120 г\nРозпушувач — 1 ч. л.\nЦедра 1 апельсина\nЦукрова пудра для обкачування',
      },
      {
        title: 'Method · original notes',
        content:
          'Збити яйця з цукром та вершковим маслом до побіління. Окремо змішати какао, борошно та розпушувач. Додати сухі інгредієнти до вологих і збити до повного поєднання. Накрити тісто й поставити в холодильник на 3–4 години; можна залишити до 24 годин.\n\nРозігріти духовку до 180°C. Скатати кульки розміром з волоський горіх, ретельно обкачати в цукровій пудрі й викласти далеко одна від одної. Пекти 8–10 хв. Тріщинки повинні здаватися вологими. Повністю остудити.',
      },
    ],
    needsBeforePublishing:
      'Record active time; confirm the walnut variation; approve or replace the generated photo.',
  },
  {
    id: 'apple-fritters',
    slug: 'apple-fritters',
    title: 'Apple fritters',
    sourceTitle: 'Яблучні оладки',
    category: 'Breakfast / everyday',
    collectionIds: ['breakfast', 'everyday'],
    testingStatus: 'Core verified',
    flour: schar,
    difficulty: 'Easy',
    activeTime: '30 min',
    totalTime: null,
    localizedFacts: {
      difficulty: { en: 'Easy', es: 'Fácil', uk: 'Легка' },
      activeTime: { en: '30 min', es: '30 min', uk: '30 хв' },
      totalTime: { en: '', es: '', uk: '' },
      flour: {
        en: 'Schär Mix B Bread',
        es: 'Schär Mix B Bread',
        uk: 'Schär Mix B Bread',
      },
    },
    launchPriority: 'Medium',
    heroCandidate: 'No',
    image: '/images/recipes/apple-fritters-card-v1.webp',
    imageKind: 'generated-preview',
    imageAlt:
      'Golden gluten-free apple fritter pancakes with visible apple pieces',
    summary:
      'A verified apple-fritter recipe with grated apple and Schär Mix B Bread.',
    source:
      'Full recipe supplied by the author with a reference to trueua.info',
    archiveSections: [
      {
        title: 'Ingredients · original notes',
        content:
          'Яблука — 2 шт.\nЯйце — 1 шт.\nКефір або натуральний йогурт — 160 г\nБезглютенове борошно Schär Mix B Bread — 140 г\nЦукор або мед — 1 ст. л. (за смаком)\nСода — 0,5 ч. л.\nОлія — для смаження',
      },
      {
        title: 'Method · original notes',
        content:
          'Помити й очистити яблука, натерти на середній тертці. Збити яйце з йогуртом та цукром чи медом. Додати яблука. Всипати борошно та соду й перемішати до консистенції густої сметани. Розігріти пательню з невеликою кількістю олії на середньому вогні. Викладати невеликі оладки ложкою. Смажити під кришкою по 2–3 хвилини з кожного боку до золотистої скоринки.',
      },
    ],
    needsBeforePublishing: '',
  },
  {
    id: 'banana-fritters',
    slug: 'banana-fritters',
    title: 'Banana pancakes',
    sourceTitle: 'Бананові панкейки',
    category: 'Breakfast / everyday',
    collectionIds: ['breakfast', 'everyday'],
    testingStatus: 'Core verified',
    flour: schar,
    difficulty: 'Easy',
    activeTime: '30 min',
    totalTime: '30 min',
    localizedFacts: {
      difficulty: { en: 'Easy', es: 'Fácil', uk: 'Легко' },
      activeTime: { en: '30 min', es: '30 min', uk: '30 хв' },
      totalTime: { en: '30 min', es: '30 min', uk: '30 хв' },
      flour: {
        en: 'Schär Mix B Bread',
        es: 'Schär Mix B Bread',
        uk: 'Schär Mix B Bread',
      },
    },
    scalingAnchorIngredientId: 'bananas',
    launchPriority: 'Medium',
    heroCandidate: 'No',
    image: '/images/recipes/banana-pancakes-card-v3.webp',
    imageKind: 'generated-preview',
    imageAlt:
      'Thick irregular gluten-free banana pancakes with golden-brown tops and a tender crumb',
    summary: 'Tender and fluffy, with Greek yogurt and Schär Mix B Bread.',
    source:
      'Natasha’s Kitchen Banana Pancakes, adapted and tested by the author with Schär Mix B Bread',
    archiveSections: [],
    needsBeforePublishing: '',
  },
  {
    id: 'apple-banana-fritters',
    slug: 'apple-banana-fritters',
    title: 'Apple-banana fritters',
    sourceTitle: 'Яблучно-бананові оладки',
    category: 'Breakfast / everyday',
    collectionIds: ['breakfast', 'everyday'],
    testingStatus: 'Suggested adaptation',
    flour: schar,
    difficulty: null,
    activeTime: null,
    totalTime: null,
    launchPriority: 'Medium',
    heroCandidate: 'No',
    image: '/images/recipes/apple-banana-fritters-card-v1.webp',
    imageKind: 'generated-preview',
    imageAlt: 'Golden gluten-free apple and banana fritter pancakes',
    summary:
      'A suggested adaptation of the tested apple fritters, replacing sugar or honey with one ripe banana.',
    source: 'Adapted from the author-supplied apple-fritter recipe',
    archiveSections: [
      {
        title: 'Adaptation note',
        content:
          'Замінити 1 ст. л. цукру або меду одним невеликим дуже стиглим бананом. Решту інгредієнтів і базовий спосіб приготування залишити без змін.',
      },
    ],
    needsBeforePublishing:
      'Bake-test the banana substitution; confirm whether 160 g kefir or yogurt still gives the right consistency; record yield, total time and frying-oil quantity; approve or replace the generated photo.',
  },
  {
    id: 'easter-bread',
    slug: 'easter-bread',
    title: 'Ukrainian Easter bread',
    scalingAnchorIngredientId: 'schar-mix-b',
    sourceTitle: 'Безглютенова паска',
    category: 'Celebration / Easter baking',
    collectionIds: ['celebration'],
    testingStatus: 'Core verified',
    flour: schar,
    difficulty: 'Medium',
    activeTime: '30 min',
    totalTime: 'About 4 h 50 min',
    localizedFacts: {
      difficulty: { en: 'Medium', es: 'Media', uk: 'Середня' },
      activeTime: {
        en: '30 min',
        es: '30 min',
        uk: '30 хв',
      },
      totalTime: {
        en: 'About 4 h 50 min',
        es: 'Unas 4 h 50 min',
        uk: 'Близько 4 год 50 хв',
      },
      flour: {
        en: 'Schär Bread Mix + tapioca starch',
        es: 'Schär Bread Mix + almidón de tapioca',
        uk: 'Schär Bread Mix + тапіоковий крохмаль',
      },
    },
    launchPriority: 'High · seasonal',
    heroCandidate: 'No',
    image: '/images/recipes/easter-bread-card-v1.webp',
    imageKind: 'generated-preview',
    imageAlt: 'Tall gluten-free Ukrainian Easter bread with glaze and raisins',
    summary: 'Soft Easter bread with raisins and candied fruit.',
    source: 'Author-provided Paska 2.0 recipe and method',
    archiveSections: [
      {
        title: 'Recipe version',
        content:
          'Паска 2.0 — м’якша, вологіша, ближча до panettone. На 2 невеликі паски або 1 середню.',
      },
    ],
    needsBeforePublishing: '',
  },
  {
    id: 'prune-cake',
    slug: 'prune-cake',
    title: 'Chocolate prune cake',
    sourceTitle: 'Торт з чорносливом',
    category: 'Cake / celebration',
    collectionIds: ['celebration'],
    testingStatus: 'Core verified',
    flour: schar,
    difficulty: 'Medium',
    activeTime: '60 min',
    totalTime: null,
    localizedFacts: {
      difficulty: {
        en: 'Medium',
        es: 'Media',
        uk: 'Середня',
      },
      activeTime: {
        en: '60 min',
        es: '60 min',
        uk: '1 год',
      },
      totalTime: {
        en: 'To confirm',
        es: 'Por confirmar',
        uk: 'Потребує уточнення',
      },
      flour: {
        en: 'Schär Mix B Bread',
        es: 'Schär Mix B Bread',
        uk: 'Schär Mix B Bread',
      },
    },
    launchPriority: 'Medium',
    heroCandidate: 'No',
    image: '/images/recipes/prune-cake-author-hero-v2.webp',
    imageKind: 'edited-author-photo',
    imageAlt:
      'Chocolate prune cake with a mound of cream-coated cake pieces, glaze and nuts',
    summary:
      'Chocolate layers with prune cream, a mound of tender cake pieces and chocolate glaze.',
    source: 'Author bake and original photographs · 2026-09-26',
    archiveSections: [
      {
        title: 'Ingredients · author clarification',
        content:
          '4 яйця\nГрецький йогурт — 250 г (2 баночки по 125 г)\nЦукор — 1 склянка, приблизно 200 г\nСоняшникова олія — 2 ст. л.\nЗгущене молоко — 5–6 ст. л.\nРозпушувач — 2 ч. л.\nКакао — 5 ст. л., 25 г\nБорошно Schär Mix B Bread — 5 ст. л., 100 г',
      },
      {
        title: 'Method · author clarification',
        content:
          'Збити яйця з цукром; додати грецький йогурт, олію і згущене молоко. Додати змішані розпушувач, какао й борошно. Випікати у формі 26 см за 200°C: 30 хв під фольгою і 30 хв без неї. Остудити й розрізати на три коржі.\n\nКрем: 400 г сметани або грецького йогурту, цукор до смаку та більша частина зі 150 г чорносливу. Третій корж порізати квадратами, змішати з рештою крему й викласти зверху. Для поливки прогріти сметану або вершки, цукор, какао й масло разом у каструльці, не доводячи до кипіння. Гарячою полити торт, прикрасити рештою чорносливу та підсушеними волоськими горіхами або пеканом.',
      },
    ],
    needsBeforePublishing: '',
  },
  {
    id: 'fruit-sponge-roll',
    slug: 'fruit-sponge-roll',
    title: 'Fruit sponge roll',
    sourceTitle: 'Бісквітний рулет з фруктами',
    category: 'Rolled sponge / dessert',
    collectionIds: ['celebration'],
    testingStatus: 'Core verified',
    flour: schar,
    difficulty: 'Easy',
    activeTime: '30 min',
    totalTime: null,
    localizedFacts: {
      difficulty: { en: 'Easy', es: 'Fácil', uk: 'Легка' },
      activeTime: {
        en: '30 min',
        es: '30 min',
        uk: '30 хв',
      },
      totalTime: {
        en: 'Depends on cooling',
        es: 'Depende del enfriado',
        uk: 'Залежить від охолодження',
      },
      flour: {
        en: 'Schär Mix B Bread',
        es: 'Schär Mix B Bread',
        uk: 'Schär Mix B Bread',
      },
    },
    launchPriority: 'Medium–High',
    heroCandidate: 'Yes',
    image: '/images/recipes/fruit-sponge-roll-card-v3.webp',
    imageKind: 'generated-preview',
    imageAlt:
      'Homemade fruit sponge roll with berry jam, mascarpone cream spread on top and fresh berries',
    summary:
      'A tender sponge with berry jam and cream, finished with cream and optional fresh fruit.',
    source:
      'Full recipe and author-supplied example photo archived in the workbook',
    archiveSections: [
      {
        title: 'Ingredients · original notes',
        content:
          'Бісквіт:\n5 яєць\n100 г цукру\nТрохи солі\n35 мл олії\n35 мл води\n120 г борошна\n\nКрем:\n250 мл вершків\n80 г цукру\n250 г маскарпоне\n\nНачинка і декор:\nЧорничне варення\nПолуниця\nМ’ята\nМигдальні горішки',
      },
      {
        title: 'Method · original notes',
        content:
          'Яйця, цукор і сіль збити до густої світлої піни — приблизно 10 хв. Додати олію, воду і поступово борошно, обережно перемішуючи.\n\nВилити на пергамент. Випікати 15–20 хв при 180–200°C. Згорнути й охолодити. Намастити чорничним варенням і кремом. Для крему збити вершки з цукром, додати маскарпоне. Прикрасити полуницею, м’ятою та мигдалем.',
      },
    ],
    needsBeforePublishing: '',
  },
  {
    id: 'eclairs',
    slug: 'eclairs',
    title: 'Profiteroles',
    sourceTitle: 'Профітролі',
    category: 'Choux pastry / dessert',
    collectionIds: ['celebration'],
    testingStatus: 'Core verified',
    flour: schar,
    difficulty: 'Intermediate',
    activeTime: '15 min',
    totalTime: null,
    scalingAnchorIngredientId: 'flour',
    localizedFacts: {
      difficulty: { en: 'Intermediate', es: 'Intermedio', uk: 'Середня' },
      activeTime: { en: '15 min', es: '15 min', uk: '15 хв' },
      totalTime: { en: '', es: '', uk: '' },
      flour: {
        en: 'Schär Mix B Bread',
        es: 'Schär Mix B Bread',
        uk: 'Schär Mix B Bread',
      },
    },
    launchPriority: 'To confirm',
    heroCandidate: 'Possible',
    image: '/images/recipes/profiteroles-card-v2.webp',
    imageKind: 'generated-preview',
    imageAlt:
      'Golden gluten-free profiteroles with one cut open to show vanilla cream',
    summary: 'Crisp, hollow choux pastries with a soft cream filling.',
    source: 'Recipe screenshot and author bake note, added 2026-09-19',
    archiveSections: [
      {
        title: 'Author note · tested bake',
        content:
          'Ми поклали 4 маленьких яйця і було ідеально, десь 20 профітролей.',
      },
    ],
    needsBeforePublishing: '',
  },
];

export function getInventoryRecipe(slug: string) {
  return recipeInventory.find((recipe) => recipe.slug === slug);
}
