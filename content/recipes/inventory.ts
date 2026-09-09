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
  testingStatus: 'Core verified';
  flour: string;
  difficulty: string | null;
  activeTime: string | null;
  totalTime: string | null;
  launchPriority: string;
  heroCandidate: 'Yes' | 'Possible' | 'No';
  image: string;
  imageKind: 'generated-preview' | 'author-photo';
  imageAlt: string;
  summary: string;
  source: string;
  archiveSections: InventoryArchiveSection[];
  needsBeforePublishing: string;
};

const schar = 'Schär Mix B Bread';

export const recipeInventory: InventoryRecipe[] = [
  {
    id: 'banana-bread', slug: 'banana-bread', title: 'Banana bread', sourceTitle: 'Банановий хліб',
    category: 'Everyday cake', testingStatus: 'Core verified', flour: schar, difficulty: null,
    activeTime: null, totalTime: null, launchPriority: 'Medium', heroCandidate: 'Possible',
    image: '/images/recipes/banana-bread-card-v1.png', imageKind: 'generated-preview',
    imageAlt: 'Gluten-free banana bread with walnuts and raisins, sliced on a warm neutral surface',
    summary: 'A familiar banana loaf with walnuts and raisins, preserved from the handwritten working recipe.',
    source: 'Handwritten notebook page, IMG_1272.jpeg',
    archiveSections: [{ title: 'Ingredients · original notes', content: '3 дуже спілих банана\n1/2 чашки масла кімнатної температури\n3/4 чашки цукру\n2 великих яйця\n1,5 чашки борошна\n1 ч. л. розпушувача\n1/2 ч. л. солі\n1/2 ч. л. ванілі\n1 чашка горіхів\n1 чашка ізюму' }],
    needsBeforePublishing: 'Record difficulty and timing; add the preparation method; approve or replace the generated photo.',
  },
  {
    id: 'lazy-dumplings', slug: 'lazy-dumplings', title: 'Lazy cottage-cheese dumplings', sourceTitle: 'Ліниві вареники',
    category: 'Breakfast / everyday', testingStatus: 'Core verified', flour: `${schar} + tapioca or corn starch`, difficulty: null,
    activeTime: null, totalTime: null, launchPriority: 'Medium', heroCandidate: 'No',
    image: '/images/recipes/lazy-dumplings-card-v1.png', imageKind: 'generated-preview',
    imageAlt: 'Ukrainian lazy cottage-cheese dumplings with sour cream and butter',
    summary: 'Soft cottage-cheese dumplings with several tested proportions recorded in the notebook.',
    source: 'Handwritten notebook page, IMG_1277.jpeg',
    archiveSections: [
      { title: 'Ingredients · original notes', content: '2 пачки творогу\n2 яйця\n3 ст. л. цукру\n90 г борошна\n7 г тапіоки або кукурудзяного крохмалю' },
      { title: 'Method · original notes', content: 'Творог, яйця й цукор перемішати. Борошно і крохмаль перемішати та додати в творог. Вимішати й дати постояти 15–30 хв.\n\nВаріант на 7 пачок: 7 яєць, 10 ст. л. цукру, 300 г борошна, 25 г тапіоки.' },
    ],
    needsBeforePublishing: 'Choose the default proportion and starch version; record timing; approve or replace the generated photo.',
  },
  {
    id: 'apple-charlotte', slug: 'apple-charlotte', title: 'Apple charlotte', sourceTitle: 'Яблучна шарлотка',
    category: 'Cake / everyday', testingStatus: 'Core verified', flour: `${schar} + tapioca starch`, difficulty: null,
    activeTime: null, totalTime: '25–30 min baking + preparation', launchPriority: 'High', heroCandidate: 'Possible',
    image: '/images/recipes/apple-charlotte-card-v1.png', imageKind: 'generated-preview',
    imageAlt: 'Gluten-free apple charlotte sheet cake with a cut square',
    summary: 'A large-tray apple sponge with a light crumb and cinnamon.',
    source: 'Handwritten notebook page, IMG_1278.jpeg',
    archiveSections: [
      { title: 'Ingredients · original notes', content: 'На повне велике деко:\n5–6 яблук\n10 невеликих яєць\n200 г цукру\n240 г безглютенового борошна\n30 г тапіокового крохмалю\n1 ч. л. ксантанової камеді\nДрібка солі\nВанілін\nКориця' },
      { title: 'Method · original notes', content: '1. 5–6 яблук порізати мілко на комбайні. Застелити пергаментом деко і висипати яблука.\n2. 10 невеликих яєць і 200 г цукру збити добре до пишної світлої маси.\n3. Окремо змішати сухі інгредієнти.\n4. Повільно додати суху суміш до збитих яєць і вилити на яблука.\n5. Випікати 25–30 хв; ставити в гарячу духовку.' },
    ],
    needsBeforePublishing: 'Record difficulty, tray dimensions and exact timing; approve or replace the generated photo.',
  },
  {
    id: 'cottage-cheese-waffles', slug: 'cottage-cheese-waffles', title: 'Cottage-cheese waffles', sourceTitle: 'Творожні вафлі',
    category: 'Breakfast / snack', testingStatus: 'Core verified', flour: `${schar} + corn starch`, difficulty: null,
    activeTime: null, totalTime: '5–7 min per batch + preparation', launchPriority: 'Medium', heroCandidate: 'No',
    image: '/images/recipes/cottage-cheese-waffles-card-v1.png', imageKind: 'generated-preview',
    imageAlt: 'Golden gluten-free cottage-cheese waffles with natural yogurt',
    summary: 'Tender breakfast waffles made with cottage cheese and natural yogurt.',
    source: 'Handwritten notebook page, IMG_1276.jpeg',
    archiveSections: [
      { title: 'Ingredients · original notes', content: 'Творог — 500 г (2 пачки)\nЯйця — 4 шт.\nНатуральний йогурт — 200 мл (2 пачки)\nОлія соняшникова — 60–80 мл\nБорошно — 250 г\nКукурудзяний крохмаль — 1 ст. л.\nРозпушувач — 2 ч. л.\nЦукор — 1 ст. л.\nДрібка солі\nВаніль' },
      { title: 'Method · original notes', content: '1. Творог проблендерити з яйцями і йогуртом до однорідної маси.\n2. Додати олію, цукор, сіль і ваніль.\n3. Окремо змішати борошно, крохмаль і розпушувач.\n4. Всипати до вологої маси і замішати.\n5. Залишити тісто на 7–10 хв.\n6. Добре розігріти вафельницю. Випікати по 5–7 хв.' },
    ],
    needsBeforePublishing: 'Confirm the starch quantity; record difficulty and total timing; approve or replace the generated photo.',
  },
  {
    id: 'carrot-cake', slug: 'carrot-cake', title: 'Carrot cake', sourceTitle: 'Морквяний кекс',
    category: 'Cake', testingStatus: 'Core verified', flour: schar, difficulty: null,
    activeTime: null, totalTime: '35–40 min baking + preparation', launchPriority: 'Medium', heroCandidate: 'No',
    image: '/images/recipes/carrot-cake-card-v1.png', imageKind: 'generated-preview',
    imageAlt: 'Gluten-free carrot loaf cake with walnuts and raisins',
    summary: 'A generous carrot cake with walnuts and raisins; the notebook batch makes three loaves.',
    source: 'Handwritten notebook page, IMG_1273.jpeg',
    archiveSections: [
      { title: 'Ingredients · original notes', content: 'Морква — 500–600 г\nОлія — 300 мл\nЯйця — 8 шт.\nЦукор — 300 г\nБорошно — 500 г\nРозпушувач — 16 г\nСіль — 4 г\nГрецькі горіхи — 300 г (2 пачки)\nРодзинки — 250 г (1 пачка)' },
      { title: 'Method · original notes', content: '1. Натерти моркву і збити її блендером з олією.\n2. Яйця з цукром збити до густої піни.\n3. Змішати борошно, розпушувач і сіль; додати до рідких інгредієнтів.\n4. Додати замочені родзинки та горіхи.\n5. Змастити форму маслом і вилити тісто. Запис: «Тут на 3 кекси».\n6. Випікати при 200°C 35–40 хв.' },
    ],
    needsBeforePublishing: 'Record difficulty, exact form sizes and timing; approve or replace the generated photo.',
  },
  {
    id: 'sponge-cake', slug: 'sponge-cake', title: 'Sponge cake', sourceTitle: 'Бісквіт',
    category: 'Cake base', testingStatus: 'Core verified', flour: `${schar} + tapioca and corn starch`, difficulty: null,
    activeTime: null, totalTime: '40–50 min baking + preparation', launchPriority: 'Medium', heroCandidate: 'No',
    image: '/images/recipes/sponge-cake-card-v1.png', imageKind: 'generated-preview',
    imageAlt: 'Tall plain gluten-free sponge cake with one wedge cut',
    summary: 'A tall, airy gluten-free sponge base made with separated eggs and a starch blend.',
    source: 'Handwritten notebook page with corrections, IMG_1274.jpeg',
    archiveSections: [
      { title: 'Ingredients · original notes', content: '5 великих або 6 маленьких яєць\nЦукор — неповна склянка (позначка 120 г) + 2 ст. л. для жовтків\nКукурудзяний крохмаль — 15 г\nТапіока — 70 г\nБорошно — 140 г' },
      { title: 'Method · original notes', content: '1. Увімкнути духовку. Яйця розділити.\n2. Білки збити до густої білої піни, за 3–4 рази додати цукор.\n3. Жовтки з 2 ст. л. цукру збити до посвітління.\n4. Обережно вмішати жовтки в білки.\n5. За 2–3 рази вмішати сухі інгредієнти.\n6. Змастити тільки дно форми. Випікати приблизно 40–50 хв при 200°C.' },
    ],
    needsBeforePublishing: 'Confirm corrected quantities against the notebook image; record form size and timing; approve or replace the generated photo.',
  },
  {
    id: 'crepes', slug: 'crepes', title: 'Thin breakfast crepes', sourceTitle: 'Млинці',
    category: 'Breakfast / everyday', testingStatus: 'Core verified', flour: schar, difficulty: null,
    activeTime: null, totalTime: null, launchPriority: 'High', heroCandidate: 'Yes',
    image: '/images/crepes.png', imageKind: 'generated-preview',
    imageAlt: 'A stack of thin golden gluten-free breakfast crepes',
    summary: 'Thin everyday crepes with a flexible batter adjusted with hot water.',
    source: 'Handwritten notebook page, IMG_1275.jpeg',
    archiveSections: [
      { title: 'Ingredients · original notes', content: '5 яєць\n5 ст. л. борошна\n0,5 л молока\n1 ст. л. цукру\nДрібка солі\n5 ст. л. олії\n0,5 склянки води, краще гарячої' },
      { title: 'Method · original notes', content: '1. Змішати яйця, борошно, цукор, сіль і трохи молока без грудочок.\n2. Поступово додати молоко.\n3. Додати 0,5 склянки води, краще гарячої, та олію.\n4. Дати постояти 15–30 хв. За потреби додавати молоко або воду до рідкої консистенції.' },
    ],
    needsBeforePublishing: 'Record difficulty and timing; approve or replace the preview photo.',
  },
  {
    id: 'gluten-free-napoleon', slug: 'napoleon-cake', title: 'Napoleon cake', sourceTitle: 'Безглютеновий Наполеон',
    category: 'Celebration / layer cake', testingStatus: 'Core verified', flour: `${schar} + tapioca and corn starch`, difficulty: 'Advanced',
    activeTime: null, totalTime: '14–26 h including chilling and maturation', launchPriority: 'High', heroCandidate: 'Yes',
    image: '/images/recipes/gluten-free-napoleon-card-v1.png', imageKind: 'generated-preview',
    imageAlt: 'Gluten-free Napoleon cake with many thin layers and a cut slice',
    summary: 'A many-layered gluten-free celebration cake with warm custard and a long overnight rest.',
    source: 'Detailed recipe card transferred from a separate ChatGPT conversation', archiveSections: [],
    needsBeforePublishing: 'Confirm cream volume and exact active time; approve or replace the generated photo.',
  },
  {
    id: 'cinnamon-rolls', slug: 'cinnamon-rolls', title: 'Cinnamon rolls', sourceTitle: 'Cinnabons / cinnamon rolls',
    category: 'Sweet yeast baking', testingStatus: 'Core verified', flour: schar, difficulty: null,
    activeTime: null, totalTime: null, launchPriority: 'High', heroCandidate: 'Yes',
    image: '/images/recipes/cinnamon-rolls-card-v1.png', imageKind: 'generated-preview',
    imageAlt: 'Gluten-free cinnamon rolls with a light cream glaze',
    summary: 'The working cinnamon-roll recipe is confirmed, but its proportions and method still need to be transferred.',
    source: 'Named by the author in the inventory conversation', archiveSections: [],
    needsBeforePublishing: 'Add the full recipe text; record proofing, timing and difficulty; approve or replace the generated photo.',
  },
  {
    id: 'crinkle-cookies', slug: 'crinkle-cookies', title: 'Chocolate crinkle cookies', sourceTitle: 'Мармурове печиво «Тріщинки»',
    category: 'Cookies / sweet baking', testingStatus: 'Core verified', flour: schar, difficulty: 'Easy',
    activeTime: null, totalTime: '3 h 10 min–24 h + cooling', launchPriority: 'High', heroCandidate: 'Yes',
    image: '/images/recipes/chocolate-crinkle-cookies-card-v1.png', imageKind: 'generated-preview',
    imageAlt: 'Chocolate crinkle cookies dusted with powdered sugar',
    summary: 'Cocoa cookies with orange zest that rise and crack as they bake.',
    source: 'Full recipe pasted in the inventory conversation',
    archiveSections: [
      { title: 'Ingredients · original notes', content: 'Вершкове масло — 60 г\nЯйця — 2 шт.\nЦукор — 200 г\nКакао — 60 г\nБорошно — 120 г\nРозпушувач — 1 ч. л.\nЦедра 1 апельсина\nЦукрова пудра для обкачування' },
      { title: 'Method · original notes', content: 'Збити яйця з цукром та вершковим маслом до побіління. Окремо змішати какао, борошно та розпушувач. Додати сухі інгредієнти до вологих і збити до повного поєднання. Накрити тісто й поставити в холодильник на 3–4 години; можна залишити до 24 годин.\n\nРозігріти духовку до 180°C. Скатати кульки розміром з волоський горіх, ретельно обкачати в цукровій пудрі й викласти далеко одна від одної. Пекти 8–10 хв. Тріщинки повинні здаватися вологими. Повністю остудити.' },
    ],
    needsBeforePublishing: 'Record active time; confirm the walnut variation; approve or replace the generated photo.',
  },
  {
    id: 'apple-fritters', slug: 'apple-fritters', title: 'Apple fritters', sourceTitle: 'Яблучні оладки',
    category: 'Breakfast / everyday', testingStatus: 'Core verified', flour: schar, difficulty: null,
    activeTime: null, totalTime: null, launchPriority: 'Medium', heroCandidate: 'No',
    image: '/images/recipes/apple-fritters-card-v1.png', imageKind: 'generated-preview',
    imageAlt: 'Golden gluten-free apple fritter pancakes with visible apple pieces',
    summary: 'A verified fruit-fritter recipe whose exact base still needs to be transferred.',
    source: 'Named by the author in the inventory conversation', archiveSections: [],
    needsBeforePublishing: 'Add the full recipe text and timing; decide whether to publish separately or as a fruit-fritter variation.',
  },
  {
    id: 'banana-fritters', slug: 'banana-fritters', title: 'Banana fritters', sourceTitle: 'Бананові оладки',
    category: 'Breakfast / everyday', testingStatus: 'Core verified', flour: schar, difficulty: null,
    activeTime: null, totalTime: null, launchPriority: 'Medium', heroCandidate: 'No',
    image: '/images/recipes/banana-fritters-card-v1.png', imageKind: 'generated-preview',
    imageAlt: 'Golden gluten-free banana fritter pancakes',
    summary: 'A verified banana-fritter recipe whose exact base still needs to be transferred.',
    source: 'Named by the author in the inventory conversation', archiveSections: [],
    needsBeforePublishing: 'Add the full recipe text and timing; decide whether to publish separately or as a fruit-fritter variation.',
  },
  {
    id: 'apple-banana-fritters', slug: 'apple-banana-fritters', title: 'Apple-banana fritters', sourceTitle: 'Яблучно-бананові оладки',
    category: 'Breakfast / everyday', testingStatus: 'Core verified', flour: schar, difficulty: null,
    activeTime: null, totalTime: null, launchPriority: 'Medium', heroCandidate: 'No',
    image: '/images/recipes/apple-banana-fritters-card-v1.png', imageKind: 'generated-preview',
    imageAlt: 'Golden gluten-free apple and banana fritter pancakes',
    summary: 'A verified apple-and-banana fritter recipe whose exact base still needs to be transferred.',
    source: 'Named by the author in the inventory conversation', archiveSections: [],
    needsBeforePublishing: 'Add the full recipe text and timing; decide whether to publish separately or as a fruit-fritter variation.',
  },
  {
    id: 'easter-bread', slug: 'easter-bread', title: 'Ukrainian Easter bread', sourceTitle: 'Безглютенова паска',
    category: 'Celebration / Easter baking', testingStatus: 'Core verified', flour: schar, difficulty: null,
    activeTime: null, totalTime: null, launchPriority: 'High · seasonal', heroCandidate: 'No',
    image: '/images/recipes/easter-bread-card-v1.png', imageKind: 'generated-preview',
    imageAlt: 'Tall gluten-free Ukrainian Easter bread with glaze and raisins',
    summary: 'A repeatedly baked seasonal recipe awaiting transfer of its exact proportions and method.',
    source: 'Named by the author in the inventory conversation', archiveSections: [],
    needsBeforePublishing: 'Add the full recipe text, timings and difficulty; approve or replace the generated photo.',
  },
  {
    id: 'prune-cake', slug: 'prune-cake', title: 'Chocolate prune cake', sourceTitle: 'Торт з чорносливом',
    category: 'Cake / celebration', testingStatus: 'Core verified', flour: schar, difficulty: null,
    activeTime: null, totalTime: null, launchPriority: 'Medium', heroCandidate: 'No',
    image: '/images/recipes/prune-cake-card-v1.png', imageKind: 'generated-preview',
    imageAlt: 'Chocolate layer cake with cream and prune pieces',
    summary: 'A chocolate celebration cake with a sour-cream-style filling and prunes; parts of the old note remain unreadable.',
    source: 'Older handwritten photo, image.png',
    archiveSections: [
      { title: 'Ingredients · partial transcription', content: '4 яйця\n2 баночки [нерозбірливо]\n1 неповна склянка цукру\n2 ст. л. [нерозбірливо]\n5–6 ст. л. [нерозбірливо]\nРозпушувач — 2 ч. л. або 2 ч. л. соди, погашеної лимонним соком\n5 ст. л. какао\n5 ст. л. борошна' },
      { title: 'Method · partial transcription', content: 'Крем: сметана або вершки; змішати з цукровою пудрою до смаку.\n\nПолити шоколадом: 2 ст. л. сметани, [частина запису нерозбірлива], вершкове масло; перемішати.' },
    ],
    needsBeforePublishing: 'Confirm unreadable words against the source image; record timing and difficulty; approve or replace the generated photo.',
  },
  {
    id: 'fruit-sponge-roll', slug: 'fruit-sponge-roll', title: 'Fruit sponge roll', sourceTitle: 'Бісквітний рулет з фруктами',
    category: 'Rolled sponge / dessert', testingStatus: 'Core verified', flour: schar, difficulty: 'Medium',
    activeTime: null, totalTime: '15–20 min baking + cooling and assembly', launchPriority: 'Medium–High', heroCandidate: 'No',
    image: '/images/recipes/fruit-sponge-roll-author-v1.png', imageKind: 'author-photo',
    imageAlt: 'Author photo of a fruit sponge roll with cream, berries, mint and almonds',
    summary: 'A filled sponge roll with blueberry jam, mascarpone cream, strawberries, mint and almonds.',
    source: 'Full recipe and author-supplied example photo archived in the workbook',
    archiveSections: [
      { title: 'Ingredients · original notes', content: 'Бісквіт:\n5 яєць\n100 г цукру\nТрохи солі\n35 мл олії\n35 мл води\n120 г борошна\n\nКрем:\n250 мл вершків\n80 г цукру\n250 г маскарпоне\n\nНачинка і декор:\nЧорничне варення\nПолуниця\nМ’ята\nМигдальні горішки' },
      { title: 'Method · original notes', content: 'Яйця, цукор і сіль збити до густої світлої піни — приблизно 10 хв. Додати олію, воду і поступово борошно, обережно перемішуючи.\n\nВилити на пергамент. Випікати 15–20 хв при 180–200°C. Згорнути й охолодити. Намастити чорничним варенням і кремом. Для крему збити вершки з цукром, додати маскарпоне. Прикрасити полуницею, м’ятою та мигдалем.' },
    ],
    needsBeforePublishing: 'Record exact oven temperature, rolling method, fruit quantities and total time; review the author photo for publication.',
  },
  {
    id: 'eclairs', slug: 'eclairs', title: 'Eclairs', sourceTitle: 'Еклери',
    category: 'Choux pastry / dessert', testingStatus: 'Core verified', flour: schar, difficulty: null,
    activeTime: null, totalTime: null, launchPriority: 'To confirm', heroCandidate: 'Possible',
    image: '/images/recipes/eclairs-card-v1.png', imageKind: 'generated-preview',
    imageAlt: 'Golden gluten-free eclairs with vanilla cream and chocolate glaze',
    summary: 'The working éclair recipe is confirmed, but its complete recipe card still needs to be transferred.',
    source: 'Added by the author on 2026-09-06', archiveSections: [],
    needsBeforePublishing: 'Add the full recipe text, yield, timing and difficulty; approve or replace the generated photo.',
  },
];

export function getInventoryRecipe(slug: string) {
  return recipeInventory.find((recipe) => recipe.slug === slug);
}
