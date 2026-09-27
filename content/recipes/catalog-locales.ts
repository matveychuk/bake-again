import type { LocalizedText } from './recipe.types.ts';

/**
 * Locale-specific catalogue copy for source-backed drafts.
 * Recipe facts remain in their own files; these summaries deliberately do not
 * fill source gaps or make a draft appear publishable.
 */
export type CatalogLocaleCopy = {
  title: LocalizedText;
  category: LocalizedText;
  summary: LocalizedText;
  alt: LocalizedText;
  publicationNote?: LocalizedText;
};

const previewAlt = (en: string, es: string, uk: string): LocalizedText => ({
  en,
  es,
  uk,
});

/**
 * Recipe-page titles state the gluten-free adaptation explicitly. Catalogue cards keep
 * their shorter discovery titles so the grid remains easy to scan.
 */
export const recipeDetailTitles: Record<string, LocalizedText> = {
  'sour-cream': {
    en: 'Sour cream filling',
    es: 'Crema de nata agria',
    uk: 'Сметанний крем',
  },
  'lemon-cream-cheese': {
    en: 'Lemon butter and cream cheese frosting',
    es: 'Crema de mantequilla y queso al limón',
    uk: 'Лимонний крем із маслом і вершковим сиром',
  },
  'chocolate-glaze': {
    en: 'Chocolate glaze',
    es: 'Glaseado de chocolate',
    uk: 'Шоколадна глазур',
  },
  'celebration-sponge-cake': {
    en: 'Gluten-free celebration cake',
    es: 'Tarta de celebración sin gluten',
    uk: 'Безглютеновий святковий торт',
  },
  'banana-bread': {
    en: 'Gluten-free banana bread',
    es: 'Pan de plátano sin gluten',
    uk: 'Безглютеновий банановий хліб',
  },
  'lazy-dumplings': {
    en: 'Gluten-free lazy curd cheese dumplings',
    es: 'Váreniki de tvorog sin gluten',
    uk: 'Безглютенові ліниві вареники',
  },
  'apple-charlotte': {
    en: 'Gluten-free apple charlotte',
    es: 'Carlota de manzana sin gluten',
    uk: 'Безглютенова яблучна шарлотка',
  },
  'apple-meringue-pie': {
    en: 'Gluten-free apple meringue pie',
    es: 'Tarta de manzana y merengue sin gluten',
    uk: 'Безглютеновий яблучний пиріг із меренгою',
  },
  'plum-cake': {
    en: 'Gluten-free plum sponge cake',
    es: 'Bizcocho de ciruelas sin gluten',
    uk: 'Безглютеновий сливовий пиріг',
  },
  'cottage-cheese-waffles': {
    en: 'Gluten-free curd cheese waffles',
    es: 'Gofres de tvorog sin gluten',
    uk: 'Безглютенові сирні вафлі',
  },
  'carrot-cake': {
    en: 'Gluten-free carrot cake',
    es: 'Bizcocho de zanahoria sin gluten',
    uk: 'Безглютеновий морквяний кекс',
  },
  'sponge-cake': {
    en: 'Gluten-free sponge cake for layer cakes',
    es: 'Bizcocho sin gluten para tartas',
    uk: 'Безглютеновий бісквіт для торта',
  },
  crepes: {
    en: 'Gluten-free crepes',
    es: 'Crepes sin gluten',
    uk: 'Безглютенові млинці',
  },
  'gluten-free-napoleon': {
    en: 'Gluten-Free Napoleon Cake',
    es: 'Tarta Napoleón sin gluten',
    uk: 'Безглютеновий Наполеон',
  },
  'cinnamon-rolls': {
    en: 'Gluten-free cinnamon rolls',
    es: 'Rollos de canela sin gluten',
    uk: 'Безглютенові булочки з корицею',
  },
  'crinkle-cookies': {
    en: 'Gluten-free marbled crinkle cookies',
    es: 'Galletas marmoladas craqueladas sin gluten',
    uk: 'Безглютенове мармурове печиво «Тріщинки»',
  },
  'apple-fritters': {
    en: 'Gluten-free apple fritters',
    es: 'Tortitas de manzana sin gluten',
    uk: 'Безглютенові яблучні оладки',
  },
  'banana-fritters': {
    en: 'Gluten-free banana pancakes',
    es: 'Tortitas de plátano sin gluten',
    uk: 'Безглютенові бананові панкейки',
  },
  'apple-banana-fritters': {
    en: 'Gluten-free apple-banana fritters',
    es: 'Tortitas de manzana y plátano sin gluten',
    uk: 'Безглютенові яблучно-бананові оладки',
  },
  'easter-bread': {
    en: 'Gluten-free Ukrainian Easter bread',
    es: 'Pan ucraniano de Pascua sin gluten',
    uk: 'Безглютенова паска',
  },
  'prune-cake': {
    en: 'Gluten-free chocolate prune cake',
    es: 'Tarta de chocolate y ciruelas pasas sin gluten',
    uk: 'Безглютеновий торт із чорносливом',
  },
  'fruit-sponge-roll': {
    en: 'Gluten-free fruit sponge roll',
    es: 'Brazo de gitano de frutas sin gluten',
    uk: 'Безглютеновий бісквітний рулет із фруктами',
  },
  'mascarpone-whipped-cream': {
    en: 'Whipped cream with mascarpone',
    es: 'Crema de nata y mascarpone',
    uk: 'Крем із вершків та маскарпоне',
  },
  'vanilla-egg-custard': {
    en: 'Vanilla custard with eggs',
    es: 'Crema pastelera de vainilla con huevo',
    uk: 'Ванільний заварний крем з яйцями',
  },
  'eggless-vanilla-custard': {
    en: 'Eggless vanilla custard',
    es: 'Crema de vainilla sin huevo',
    uk: 'Ванільний заварний крем без яєць',
  },
  'vanilla-buttercream': {
    en: 'Vanilla buttercream',
    es: 'Crema de mantequilla de vainilla',
    uk: 'Ванільний масляний крем',
  },
  eclairs: {
    en: 'Gluten-free profiteroles',
    es: 'Profiteroles sin gluten',
    uk: 'Безглютенові профітролі',
  },
};

export type RecipeDetailTitleParts = {
  glutenFreeLabel: string;
  recipeName: string;
};

/**
 * Keeps the stored title natural in each language while giving recipe pages a shared
 * two-line editorial treatment: the gluten-free message first, then the dish name.
 */
export function getRecipeDetailTitleParts(
  title: string,
  locale: keyof LocalizedText,
): RecipeDetailTitleParts {
  if (locale === 'es') {
    const suffix = ' sin gluten';
    const recipeName = title.toLocaleLowerCase('es').endsWith(suffix)
      ? title.slice(0, -suffix.length)
      : title;

    return { glutenFreeLabel: 'Sin gluten', recipeName };
  }

  const firstSpace = title.indexOf(' ');
  if (firstSpace === -1) {
    return {
      glutenFreeLabel: locale === 'uk' ? 'Безглютеновий' : 'Gluten-free',
      recipeName: title,
    };
  }

  return {
    glutenFreeLabel: title.slice(0, firstSpace),
    recipeName: title.slice(firstSpace + 1),
  };
}

export const catalogLocaleCopy: Record<string, CatalogLocaleCopy> = {
  'sour-cream': {
    title: {
      en: 'Sour cream filling',
      es: 'Crema de nata agria',
      uk: 'Сметанний крем',
    },
    category: {
      en: 'Cream',
      es: 'Crema',
      uk: 'Крем',
    },
    summary: {
      en: 'A simple filling for two layers in a 24 cm cake.',
      es: 'Una crema sencilla para dos capas de relleno en una tarta de 24 cm.',
      uk: 'Простий крем для двох прошарків торта діаметром 24 см.',
    },
    alt: {
      en: 'Sour cream filling',
      es: 'Crema de nata agria',
      uk: 'Сметанний крем',
    },
  },
  'lemon-cream-cheese': {
    title: {
      en: 'Lemon butter and cream cheese frosting',
      es: 'Crema de mantequilla y queso al limón',
      uk: 'Лимонний крем із маслом і вершковим сиром',
    },
    category: {
      en: 'Cream',
      es: 'Crema',
      uk: 'Крем',
    },
    summary: {
      en: 'A calculated batch for coating and piping, with 200 g butter.',
      es: 'Una tanda calculada para cubrir y decorar, con 200 g de mantequilla.',
      uk: 'Перерахована порція на 200 г масла для покриття й оздоблення.',
    },
    alt: {
      en: 'Lemon butter and cream cheese frosting',
      es: 'Crema de mantequilla y queso al limón',
      uk: 'Лимонний крем із маслом і вершковим сиром',
    },
  },
  'chocolate-glaze': {
    title: {
      en: 'Chocolate glaze',
      es: 'Glaseado de chocolate',
      uk: 'Шоколадна глазур',
    },
    category: {
      en: 'Glaze',
      es: 'Glaseado',
      uk: 'Глазур',
    },
    summary: {
      en: 'A versatile cocoa glaze for homemade cakes.',
      es: 'Un glaseado de cacao versátil para tartas caseras.',
      uk: 'Універсальна глазур із какао для домашніх тортів.',
    },
    alt: {
      en: 'Chocolate glaze',
      es: 'Glaseado de chocolate',
      uk: 'Шоколадна глазур',
    },
  },
  'celebration-sponge-cake': {
    title: {
      en: 'Celebration cake',
      es: 'Tarta de celebración',
      uk: 'Святковий торт',
    },
    category: {
      en: 'Layer cake',
      es: 'Tarta de capas',
      uk: 'Торт',
    },
    summary: {
      en: 'Tall, tender and made for a celebration, with generous sour cream filling, chocolate drips and fresh fruit.',
      es: 'Alta, tierna y festiva, con abundante crema de nata agria, chorritos de chocolate y fruta fresca.',
      uk: 'Високий, ніжний і по-домашньому святковий — зі щедрим сметанним кремом, шоколадними потьоками та свіжими фруктами.',
    },
    alt: {
      en: 'Tall homemade fruit cake with chocolate glaze and cream flowers',
      es: 'Tarta alta con fruta, glaseado de chocolate y flores de crema',
      uk: 'Високий торт із фруктами, шоколадною глазур’ю та кремовими квіточками',
    },
  },
  'banana-bread': {
    title: { en: 'Banana bread', es: 'Pan de plátano', uk: 'Банановий хліб' },
    category: {
      en: 'Everyday cake',
      es: 'Bizcocho cotidiano',
      uk: 'Кекс на щодень',
    },
    summary: {
      en: 'Banana bread with walnuts and raisins.',
      es: 'Pan de plátano con nueces y pasas.',
      uk: 'Банановий хліб із горіхами й родзинками.',
    },
    alt: previewAlt(
      'Gluten-free banana bread with walnuts and raisins, sliced on a warm neutral surface',
      'Pan de plátano sin gluten con nueces y pasas, cortado sobre una superficie neutra cálida',
      'Безглютеновий банановий хліб із горіхами та родзинками, нарізаний на теплому нейтральному тлі',
    ),
  },
  'lazy-dumplings': {
    title: {
      en: 'Lazy curd cheese dumplings',
      es: 'Váreniki de tvorog sin relleno',
      uk: 'Ліниві вареники',
    },
    category: {
      en: 'Breakfast / everyday',
      es: 'Desayuno / diario',
      uk: 'Сніданок / на щодень',
    },
    summary: {
      en: 'Tender curd cheese dumplings.',
      es: 'Tiernos váreniki sin relleno, hechos con tvorog.',
      uk: 'Ніжні вареники з кисломолочного сиру.',
    },
    alt: previewAlt(
      'Ukrainian lazy curd cheese dumplings with sour cream and butter',
      'Váreniki ucranianos de tvorog con nata agria y mantequilla',
      'Ліниві вареники з кисломолочного сиру зі сметаною та маслом',
    ),
  },
  'apple-charlotte': {
    title: {
      en: 'Apple charlotte',
      es: 'Carlota de manzana',
      uk: 'Яблучна шарлотка',
    },
    category: {
      en: 'Everyday cake',
      es: 'Bizcocho cotidiano',
      uk: 'Пиріг на щодень',
    },
    summary: {
      en: 'A tender butter sponge with juicy pieces distributed through the crumb.',
      es: 'Un bizcocho tierno con mantequilla y trozos jugosos repartidos por la miga.',
      uk: 'Ніжний масляний бісквіт із соковитими шматочками, розподіленими в м’якуші.',
    },
    alt: previewAlt(
      'Gluten-free apple charlotte with a cut square showing apple pieces throughout the crumb',
      'Carlota de manzana sin gluten con un cuadrado cortado que muestra trozos repartidos por la miga',
      'Безглютенова яблучна шарлотка з відрізаним шматком, у м’якуші якого видно яблука',
    ),
  },
  'apple-meringue-pie': {
    title: {
      en: 'Apple meringue pie',
      es: 'Tarta de manzana y merengue',
      uk: 'Яблучний пиріг із меренгою',
    },
    category: {
      en: 'Apple pie / dessert',
      es: 'Tarta de manzana / postre',
      uk: 'Яблучний пиріг / десерт',
    },
    summary: {
      en: 'A chilled gluten-free pastry base topped with grated apples and soft meringue.',
      es: 'Una base de masa sin gluten refrigerada con manzana rallada y merengue suave.',
      uk: 'Охолоджена безглютенова основа з тертими яблуками та ніжною меренгою.',
    },
    alt: previewAlt(
      'A gluten-free apple pie with a short pastry base and toasted meringue topping',
      'Una tarta de manzana sin gluten con base de masa corta y merengue tostado',
      'Безглютеновий яблучний пиріг із пісочною основою та підрум’яненою меренгою',
    ),
    publicationNote: {
      en: 'Bake-test the exact recipe and record the missing apple, baking-powder, pan and meringue details.',
      es: 'Prueba la receta exacta y registra los datos que faltan sobre manzana, impulsor, molde y merengue.',
      uk: 'Випробуйте точну версію та запишіть відсутні дані про яблука, розпушувач, форму й меренгу.',
    },
  },
  'plum-cake': {
    title: {
      en: 'Plum sponge cake',
      es: 'Bizcocho de ciruelas',
      uk: 'Сливовий пиріг',
    },
    category: {
      en: 'Everyday cake',
      es: 'Bizcocho cotidiano',
      uk: 'Пиріг на щодень',
    },
    summary: {
      en: 'A tender butter sponge topped with juicy plum wedges and a gentle tartness.',
      es: 'Un bizcocho tierno de mantequilla con gajos de ciruela jugosos y un toque ácido.',
      uk: 'Ніжний бісквіт із вершковим маслом, соковитими скибочками слив і легкою кислинкою.',
    },
    alt: previewAlt(
      'Round upside-down plum cake with one slice showing the pale crumb',
      'Bizcocho redondo invertido de ciruelas con una porción que muestra la miga clara',
      'Круглий перевернутий сливовий пиріг і шматочок зі світлим м’якушем',
    ),
  },
  'cottage-cheese-waffles': {
    title: {
      en: 'Curd cheese waffles',
      es: 'Gofres de tvorog',
      uk: 'Сирні вафлі',
    },
    category: {
      en: 'Breakfast / snack',
      es: 'Desayuno / tentempié',
      uk: 'Сніданок / перекус',
    },
    summary: {
      en: 'Tender waffles with natural yoghurt.',
      es: 'Gofres tiernos con yogur natural.',
      uk: 'Ніжні вафлі з натуральним йогуртом.',
    },
    alt: previewAlt(
      'Golden gluten-free curd cheese waffles with berries on a pale green plate',
      'Gofres dorados sin gluten de tvorog con frutos rojos en un plato verde claro',
      'Золотисті безглютенові сирні вафлі з ягодами на світло-зеленій тарілці',
    ),
  },
  'carrot-cake': {
    title: {
      en: 'Carrot cake',
      es: 'Bizcocho de zanahoria',
      uk: 'Морквяний кекс',
    },
    category: { en: 'Cake', es: 'Bizcocho', uk: 'Кекс' },
    summary: {
      en: 'A tender carrot cake with raisins and nuts.',
      es: 'Un bizcocho tierno de zanahoria con pasas y frutos secos.',
      uk: 'Ніжний кекс із морквою, родзинками й горіхами.',
    },
    alt: previewAlt(
      'Gluten-free carrot loaf cake with walnuts and raisins',
      'Bizcocho sin gluten de zanahoria con nueces y pasas',
      'Безглютеновий морквяний кекс із горіхами та родзинками',
    ),
  },
  'sponge-cake': {
    title: { en: 'Sponge cake', es: 'Bizcocho', uk: 'Бісквіт' },
    category: {
      en: 'Cake base',
      es: 'Base de bizcocho',
      uk: 'Основа для торта',
    },
    summary: {
      en: 'An airy gluten-free sponge with Schär Mix B Bread, ready to slice into two or three layers for a homemade cake.',
      es: 'Un bizcocho esponjoso sin gluten con Schär Mix B Bread, para cortar en dos o tres capas y preparar una tarta casera.',
      uk: 'Повітряний безглютеновий бісквіт на Schär Mix B Bread — основа для домашнього торта на два або три коржі.',
    },
    alt: previewAlt(
      'Tall plain gluten-free sponge cake with one wedge cut',
      'Bizcocho sin gluten alto y sencillo con una porción cortada',
      'Високий простий безглютеновий бісквіт із відрізаним шматком',
    ),
  },
  crepes: {
    title: {
      en: 'Thin breakfast crepes',
      es: 'Crepes finos para el desayuno',
      uk: 'Млинці',
    },
    category: { en: 'Breakfast', es: 'Desayuno', uk: 'Сніданок' },
    summary: {
      en: 'Thin crepes made with milk.',
      es: 'Crepes finos con leche.',
      uk: 'Тонкі млинці на молоці.',
    },
    alt: previewAlt(
      'Thin gluten-free crepes folded on a plate',
      'Crepes finos sin gluten doblados en un plato',
      'Тонкі безглютенові млинці, складені на тарілці',
    ),
  },
  'gluten-free-napoleon': {
    title: {
      en: 'Napoleon Cake',
      es: 'Tarta Napoleón',
      uk: 'Наполеон',
    },
    category: {
      en: 'Celebration cake',
      es: 'Tarta de celebración',
      uk: 'Святковий торт',
    },
    summary: {
      en: 'Cakes with six thin 28 cm layers each, warm custard and nuts.',
      es: 'Tartas con seis capas finas de 28 cm, crema pastelera templada y frutos secos.',
      uk: 'Торти по шість тонких коржів 28 см із теплим заварним кремом і горіхами.',
    },
    alt: previewAlt(
      'Gluten-free Napoleon cake with six thin layers, custard and nuts',
      'Tarta Napoleón sin gluten con seis capas finas, crema pastelera y frutos secos',
      'Безглютеновий Наполеон із шістьма тонкими коржами, заварним кремом і горіхами',
    ),
  },
  'cinnamon-rolls': {
    title: {
      en: 'Cinnamon rolls',
      es: 'Rollos de canela',
      uk: 'Булочки з корицею',
    },
    category: {
      en: 'Sweet baking',
      es: 'Dulces al horno',
      uk: 'Солодка випічка',
    },
    summary: {
      en: 'Cinnamon rolls recorded in the working inventory.',
      es: 'Rollos de canela registrados en el inventario de trabajo.',
      uk: 'Булочки з корицею, записані в робочому каталозі.',
    },
    alt: previewAlt(
      'Gluten-free cinnamon rolls',
      'Rollos de canela sin gluten',
      'Безглютенові булочки з корицею',
    ),
  },
  'crinkle-cookies': {
    title: {
      en: 'Marbled Cookies',
      es: 'Galletas marmoladas',
      uk: 'Мармурове печиво',
    },
    category: { en: 'Cookies', es: 'Galletas', uk: 'Печиво' },
    summary: {
      en: 'Chocolate cookies with a tender centre and a cracked sugar coating.',
      es: 'Galletas de chocolate con un centro tierno y una cobertura de azúcar craquelada.',
      uk: 'Шоколадне печиво з ніжною серединою й цукровими тріщинками.',
    },
    alt: previewAlt(
      'Chocolate crinkle cookies with a cracked surface',
      'Galletas de chocolate craqueladas',
      'Шоколадне печиво з тріщинками',
    ),
  },
  'apple-fritters': {
    title: {
      en: 'Apple fritters',
      es: 'Tortitas de manzana',
      uk: 'Яблучні оладки',
    },
    category: { en: 'Breakfast', es: 'Desayuno', uk: 'Сніданок' },
    summary: {
      en: 'Tender gluten-free apple fritters with Schär Mix B Bread.',
      es: 'Tortitas tiernas de manzana sin gluten con Schär Mix B Bread.',
      uk: 'Ніжні безглютенові яблучні оладки з борошном Schär Mix B Bread.',
    },
    alt: previewAlt(
      'Gluten-free apple fritters',
      'Tortitas de manzana sin gluten',
      'Безглютенові яблучні оладки',
    ),
  },
  'banana-fritters': {
    title: {
      en: 'Banana pancakes',
      es: 'Tortitas de plátano',
      uk: 'Бананові панкейки',
    },
    category: { en: 'Breakfast', es: 'Desayuno', uk: 'Сніданок' },
    summary: {
      en: 'Tender and fluffy, with Greek yoghurt and Schär Mix B Bread.',
      es: 'Tiernas y esponjosas, con yogur griego y Schär Mix B Bread.',
      uk: 'Ніжні й пухкі, з грецьким йогуртом та Schär Mix B Bread.',
    },
    alt: previewAlt(
      'Thick irregular gluten-free banana pancakes with golden-brown tops and a tender crumb',
      'Tortitas de plátano sin gluten, gruesas e irregulares, doradas y con una miga tierna',
      'Товсті нерівні безглютенові бананові панкейки із золотистою скоринкою та ніжною серединкою',
    ),
  },
  'apple-banana-fritters': {
    title: {
      en: 'Apple-banana fritters',
      es: 'Tortitas de manzana y plátano',
      uk: 'Яблучно-бананові оладки',
    },
    category: { en: 'Breakfast', es: 'Desayuno', uk: 'Сніданок' },
    summary: {
      en: 'A suggested apple-fritter adaptation sweetened with ripe banana.',
      es: 'Una adaptación sugerida de las tortitas de manzana, endulzada con plátano maduro.',
      uk: 'Запропонована версія яблучних оладок, підсолоджена стиглим бананом.',
    },
    alt: previewAlt(
      'Gluten-free apple and banana fritters',
      'Tortitas sin gluten de manzana y plátano',
      'Безглютенові оладки з яблуком і бананом',
    ),
    publicationNote: {
      en: 'Bake-test the banana substitution and confirm the kefir or yoghurt amount before publication.',
      es: 'Antes de publicar, prueba la sustitución por plátano y confirma la cantidad de kéfir o yogur.',
      uk: 'Перед публікацією перевірте заміну цукру бананом і уточніть кількість кефіру або йогурту.',
    },
  },
  'easter-bread': {
    title: {
      en: 'Ukrainian Easter bread',
      es: 'Pan ucraniano de Pascua',
      uk: 'Паска',
    },
    category: {
      en: 'Seasonal baking',
      es: 'Repostería de temporada',
      uk: 'Сезонна випічка',
    },
    summary: {
      en: 'Soft Easter bread with raisins and candied fruit.',
      es: 'Pan de Pascua tierno con pasas y fruta confitada.',
      uk: 'М’яка паска з родзинками й цукатами.',
    },
    alt: previewAlt(
      'Tall gluten-free Ukrainian Easter bread with glaze and raisins',
      'Pan ucraniano de Pascua sin gluten con glaseado y pasas',
      'Висока безглютенова паска з глазур’ю та родзинками',
    ),
  },
  'prune-cake': {
    title: {
      en: 'Chocolate prune cake',
      es: 'Tarta de chocolate y ciruelas pasas',
      uk: 'Торт із чорносливом',
    },
    category: {
      en: 'Cakes',
      es: 'Tartas',
      uk: 'Торти',
    },
    summary: {
      en: 'Chocolate layers with prune cream, a mound of tender cake pieces and chocolate glaze.',
      es: 'Capas de chocolate con crema de ciruelas pasas, trozos tiernos de bizcocho y cobertura de chocolate.',
      uk: 'Шоколадні коржі з чорносливовим кремом, гіркою ніжних шматочків і шоколадною поливкою.',
    },
    alt: previewAlt(
      'Chocolate prune cake with a mound of cream-coated cake pieces, glaze and nuts',
      'Tarta de chocolate y ciruelas pasas con trozos de bizcocho en crema, cobertura y frutos secos',
      'Шоколадний торт із гіркою шматочків у кремі, поливкою, чорносливом і горіхами',
    ),
  },
  'fruit-sponge-roll': {
    title: {
      en: 'Fruit roll',
      es: 'Rollo de frutas',
      uk: 'Рулет із фруктами',
    },
    category: {
      en: 'Rolled sponge / dessert',
      es: 'Bizcocho enrollado / postre',
      uk: 'Бісквітний рулет / десерт',
    },
    summary: {
      en: 'A tender sponge with berry jam and cream, finished with cream and optional fresh fruit.',
      es: 'Bizcocho tierno con mermelada de frutos rojos y crema, cubierto de crema y fruta fresca al gusto.',
      uk: 'Ніжний бісквіт із ягідним варенням і кремом; зверху — крем і фрукти за бажанням.',
    },
    alt: previewAlt(
      'Homemade fruit sponge roll with berry jam, mascarpone cream spread on top and fresh berries',
      'Brazo de gitano casero con mermelada, crema de mascarpone extendida por encima y frutos rojos frescos',
      'Домашній бісквітний рулет із ягідним варенням, кремом із маскарпоне зверху та свіжими ягодами',
    ),
  },
  'mascarpone-whipped-cream': {
    title: {
      en: 'Whipped cream with mascarpone',
      es: 'Crema de nata y mascarpone',
      uk: 'Крем із вершків та маскарпоне',
    },
    category: { en: 'Cream', es: 'Crema', uk: 'Крем' },
    summary: {
      en: 'A light, quick cream that spreads easily and holds its shape.',
      es: 'Una crema ligera y rápida que se extiende bien y mantiene la forma.',
      uk: 'Легкий швидкий крем, який легко намазується й добре тримає форму.',
    },
    alt: previewAlt(
      'Smooth whipped mascarpone cream holding firm soft peaks in a ceramic bowl',
      'Crema de mascarpone montada con picos suaves y firmes en un bol de cerámica',
      'Гладкий збитий крем із маскарпоне тримає м’які стійкі піки в керамічній мисці',
    ),
  },
  'vanilla-egg-custard': {
    title: {
      en: 'Vanilla custard with eggs',
      es: 'Crema pastelera de vainilla con huevo',
      uk: 'Ванільний заварний крем з яйцями',
    },
    category: { en: 'Cream', es: 'Crema', uk: 'Крем' },
    summary: {
      en: 'A smooth classic custard that cools into a stable pastry filling.',
      es: 'Una crema pastelera clásica y lisa que al enfriarse queda estable para rellenar.',
      uk: 'Гладкий класичний заварний крем, який після охолодження стає стійкою начинкою.',
    },
    alt: previewAlt(
      'Thick glossy vanilla egg custard falling from a spoon into a ceramic bowl',
      'Crema pastelera de vainilla espesa y brillante cayendo de una cuchara a un bol de cerámica',
      'Густий блискучий ванільний крем з яйцями спадає з ложки в керамічну миску',
    ),
  },
  'eggless-vanilla-custard': {
    title: {
      en: 'Eggless vanilla custard',
      es: 'Crema de vainilla sin huevo',
      uk: 'Ванільний заварний крем без яєць',
    },
    category: { en: 'Cream', es: 'Crema', uk: 'Крем' },
    summary: {
      en: 'A large-batch homemade custard that thickens further as it cools.',
      es: 'Una crema casera abundante que se espesa aún más al enfriarse.',
      uk: 'Домашній крем великого виходу, який додатково густішає під час охолодження.',
    },
    alt: previewAlt(
      'Thick pale eggless vanilla custard with a clear spatula channel in a ceramic bowl',
      'Crema de vainilla sin huevo espesa y pálida con un surco de espátula en un bol de cerámica',
      'Густий світлий ванільний крем без яєць із чітким слідом від лопатки в керамічній мисці',
    ),
  },
  'vanilla-buttercream': {
    title: {
      en: 'Vanilla buttercream',
      es: 'Crema de mantequilla de vainilla',
      uk: 'Ванільний масляний крем',
    },
    category: { en: 'Cream', es: 'Crema', uk: 'Крем' },
    summary: {
      en: 'A rich stable cream for filling and decorating cakes and pastries.',
      es: 'Una crema rica y estable para rellenar y decorar tartas y pasteles.',
      uk: 'Насичений стійкий крем для начинки й оздоблення тортів та тістечок.',
    },
    alt: previewAlt(
      'Stable pale vanilla buttercream holding a firm spatula swoop in a ceramic bowl',
      'Crema de mantequilla de vainilla pálida y estable con un pico firme de espátula en un bol de cerámica',
      'Стійкий світлий ванільний масляний крем тримає виразний пік від лопатки в керамічній мисці',
    ),
  },
  eclairs: {
    title: { en: 'Profiteroles', es: 'Profiteroles', uk: 'Профітролі' },
    category: {
      en: 'Choux pastry / dessert',
      es: 'Pasta choux / postre',
      uk: 'Заварне тісто / десерт',
    },
    summary: {
      en: 'Crisp, hollow choux pastries with a soft cream filling.',
      es: 'Bocaditos de pasta choux huecos y crujientes con un relleno cremoso.',
      uk: 'Порожнисті заварні тістечка з тонкою золотистою оболонкою й ніжною начинкою.',
    },
    alt: previewAlt(
      'Golden gluten-free profiteroles with one cut open to show vanilla cream',
      'Profiteroles sin gluten dorados con uno abierto para mostrar la crema de vainilla',
      'Золотисті безглютенові профітролі, один розрізаний і показує ванільний крем',
    ),
  },
};
