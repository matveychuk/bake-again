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

const previewAlt = (en: string, es: string, uk: string): LocalizedText => ({ en, es, uk });

/**
 * Recipe-page titles state the gluten-free adaptation explicitly. Catalogue cards keep
 * their shorter discovery titles so the grid remains easy to scan.
 */
export const recipeDetailTitles: Record<string, LocalizedText> = {
  'banana-bread': { en: 'Gluten-free banana bread', es: 'Pan de plátano sin gluten', uk: 'Безглютеновий банановий хліб' },
  'lazy-dumplings': { en: 'Gluten-free lazy cottage-cheese dumplings', es: 'Ñoquis perezosos de requesón sin gluten', uk: 'Безглютенові ліниві вареники' },
  'apple-charlotte': { en: 'Gluten-free apple charlotte', es: 'Carlota de manzana sin gluten', uk: 'Безглютенова яблучна шарлотка' },
  'cottage-cheese-waffles': { en: 'Gluten-free cottage-cheese waffles', es: 'Gofres de requesón sin gluten', uk: 'Безглютенові творожні вафлі' },
  'carrot-cake': { en: 'Gluten-free carrot cake', es: 'Bizcocho de zanahoria sin gluten', uk: 'Безглютеновий морквяний кекс' },
  'sponge-cake': { en: 'Gluten-free sponge cake', es: 'Bizcocho sin gluten', uk: 'Безглютеновий бісквіт' },
  crepes: { en: 'Gluten-free crepes', es: 'Crepes sin gluten', uk: 'Безглютенові млинці' },
  'gluten-free-napoleon': { en: 'Gluten-Free Napoleon Cake', es: 'Tarta Napoleón sin gluten', uk: 'Безглютеновий Наполеон' },
  'cinnamon-rolls': { en: 'Gluten-free cinnamon rolls', es: 'Rollos de canela sin gluten', uk: 'Безглютенові булочки з корицею' },
  'crinkle-cookies': { en: 'Gluten-free marbled crinkle cookies', es: 'Galletas marmoladas craqueladas sin gluten', uk: 'Безглютенове мармурове печиво «Тріщинки»' },
  'apple-fritters': { en: 'Gluten-free apple fritters', es: 'Tortitas de manzana sin gluten', uk: 'Безглютенові яблучні оладки' },
  'banana-fritters': { en: 'Gluten-free banana fritters', es: 'Tortitas de plátano sin gluten', uk: 'Безглютенові бананові оладки' },
  'apple-banana-fritters': { en: 'Gluten-free apple-banana fritters', es: 'Tortitas de manzana y plátano sin gluten', uk: 'Безглютенові яблучно-бананові оладки' },
  'easter-bread': { en: 'Gluten-free Ukrainian Easter bread', es: 'Pan ucraniano de Pascua sin gluten', uk: 'Безглютенова паска' },
  'prune-cake': { en: 'Gluten-free chocolate prune cake', es: 'Tarta de chocolate y ciruelas pasas sin gluten', uk: 'Безглютеновий торт із чорносливом' },
  'fruit-sponge-roll': { en: 'Gluten-free fruit sponge roll', es: 'Brazo de gitano de frutas sin gluten', uk: 'Безглютеновий бісквітний рулет із фруктами' },
  eclairs: { en: 'Gluten-free eclairs', es: 'Éclairs sin gluten', uk: 'Безглютенові еклери' },
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
  'banana-bread': { title: { en: 'Banana bread', es: 'Pan de plátano', uk: 'Банановий хліб' }, category: { en: 'Everyday cake', es: 'Bizcocho cotidiano', uk: 'Кекс на щодень' }, summary: { en: 'A familiar banana loaf with walnuts and raisins, preserved from the working recipe.', es: 'Un pan de plátano con nueces y pasas, conservado de la receta de trabajo.', uk: 'Знайомий банановий кекс із горіхами й родзинками, збережений у робочому рецепті.' }, alt: previewAlt('Gluten-free banana bread with walnuts and raisins, sliced on a warm neutral surface', 'Pan de plátano sin gluten con nueces y pasas, cortado sobre una superficie neutra cálida', 'Безглютеновий банановий хліб із горіхами та родзинками, нарізаний на теплому нейтральному тлі') },
  'lazy-dumplings': { title: { en: 'Lazy cottage-cheese dumplings', es: 'Ñoquis perezosos de requesón', uk: 'Ліниві вареники' }, category: { en: 'Breakfast / everyday', es: 'Desayuno / diario', uk: 'Сніданок / на щодень' }, summary: { en: 'Soft cottage-cheese dumplings with several recorded proportions.', es: 'Ñoquis suaves de requesón con varias proporciones anotadas.', uk: 'Ніжні ліниві вареники з кількома записаними пропорціями.' }, alt: previewAlt('Ukrainian lazy cottage-cheese dumplings with sour cream and butter', 'Ñoquis perezosos ucranianos de requesón con nata agria y mantequilla', 'Українські ліниві вареники з кисломолочним сиром, сметаною та маслом') },
  'apple-charlotte': { title: { en: 'Apple charlotte', es: 'Carlota de manzana', uk: 'Яблучна шарлотка' }, category: { en: 'Cake / everyday', es: 'Pastel / diario', uk: 'Торт / на щодень' }, summary: { en: 'A large-tray apple sponge with a light crumb and cinnamon.', es: 'Un bizcocho de manzana para bandeja grande, de miga ligera y canela.', uk: 'Яблучний бісквіт для великого дека з легкою текстурою й корицею.' }, alt: previewAlt('Gluten-free apple charlotte sheet cake with a cut square', 'Bizcocho de manzana sin gluten en bandeja con un cuadrado cortado', 'Безглютенова яблучна шарлотка на деку з відрізаним шматком') },
  'cottage-cheese-waffles': { title: { en: 'Cottage-cheese waffles', es: 'Gofres de requesón', uk: 'Творожні вафлі' }, category: { en: 'Breakfast / snack', es: 'Desayuno / tentempié', uk: 'Сніданок / перекус' }, summary: { en: 'Tender breakfast waffles made with cottage cheese and natural yogurt.', es: 'Gofres tiernos para el desayuno, hechos con requesón y yogur natural.', uk: 'Ніжні сніданкові вафлі з кисломолочного сиру та натурального йогурту.' }, alt: previewAlt('Golden gluten-free cottage-cheese waffles with natural yogurt', 'Gofres dorados sin gluten de requesón con yogur natural', 'Золотисті безглютенові творожні вафлі з натуральним йогуртом') },
  'carrot-cake': { title: { en: 'Carrot cake', es: 'Bizcocho de zanahoria', uk: 'Морквяний кекс' }, category: { en: 'Cake', es: 'Bizcocho', uk: 'Кекс' }, summary: { en: 'A generous carrot cake with walnuts and raisins.', es: 'Un bizcocho de zanahoria generoso con nueces y pasas.', uk: 'Щедрий морквяний кекс із горіхами та родзинками.' }, alt: previewAlt('Gluten-free carrot loaf cake with walnuts and raisins', 'Bizcocho sin gluten de zanahoria con nueces y pasas', 'Безглютеновий морквяний кекс із горіхами та родзинками') },
  'sponge-cake': { title: { en: 'Sponge cake', es: 'Bizcocho', uk: 'Бісквіт' }, category: { en: 'Cake base', es: 'Base de bizcocho', uk: 'Основа для торта' }, summary: { en: 'A tall, airy sponge base made with separated eggs and a starch blend.', es: 'Una base de bizcocho alta y aireada con huevos separados y mezcla de almidones.', uk: 'Високий, легкий бісквіт на розділених яйцях і суміші крохмалів.' }, alt: previewAlt('Tall plain gluten-free sponge cake with one wedge cut', 'Bizcocho sin gluten alto y sencillo con una porción cortada', 'Високий простий безглютеновий бісквіт із відрізаним шматком') },
  crepes: { title: { en: 'Thin breakfast crepes', es: 'Crepes finos para el desayuno', uk: 'Млинці' }, category: { en: 'Breakfast', es: 'Desayuno', uk: 'Сніданок' }, summary: { en: 'Thin gluten-free crepes for a three-person breakfast.', es: 'Crepes finos sin gluten para el desayuno de tres personas.', uk: 'Тонкі безглютенові млинці для сніданку на трьох.' }, alt: previewAlt('Thin gluten-free crepes folded on a plate', 'Crepes finos sin gluten doblados en un plato', 'Тонкі безглютенові млинці, складені на тарілці'), publicationNote: { en: 'Record the difficulty and full cooking time; review the generated step photos and approve or replace the preview photo.', es: 'Anota la dificultad y el tiempo total de cocción; revisa las fotos generadas de los pasos y aprueba o sustituye la imagen de portada.', uk: 'Запишіть складність і повний час приготування; перевірте згенеровані фото кроків та схваліть або замініть обкладинку.' } },
  'gluten-free-napoleon': { title: { en: 'Gluten-Free Napoleon Cake', es: 'Tarta Napoleón sin gluten', uk: 'Безглютеновий Наполеон' }, category: { en: 'Celebration cake', es: 'Tarta de celebración', uk: 'Святковий торт' }, summary: { en: 'Two cakes with six thin 28 cm layers each, warm custard and nuts.', es: 'Dos tartas con seis capas finas de 28 cm, crema pastelera templada y frutos secos.', uk: 'Два торти по шість тонких коржів 28 см із теплим заварним кремом і горіхами.' }, alt: previewAlt('Gluten-free Napoleon cake with thin golden layers and a cut slice', 'Tarta Napoleón sin gluten con capas finas doradas y una porción cortada', 'Безглютеновий Наполеон із тонкими золотистими коржами та відрізаним шматком') },
  'cinnamon-rolls': { title: { en: 'Cinnamon rolls', es: 'Rollos de canela', uk: 'Булочки з корицею' }, category: { en: 'Sweet baking', es: 'Dulces al horno', uk: 'Солодка випічка' }, summary: { en: 'Cinnamon rolls recorded in the working inventory.', es: 'Rollos de canela registrados en el inventario de trabajo.', uk: 'Булочки з корицею, записані в робочому каталозі.' }, alt: previewAlt('Gluten-free cinnamon rolls', 'Rollos de canela sin gluten', 'Безглютенові булочки з корицею') },
  'crinkle-cookies': { title: { en: 'Marbled Crinkle Cookies', es: 'Galletas marmoladas craqueladas', uk: 'Мармурове печиво «Тріщинки»' }, category: { en: 'Cookies', es: 'Galletas', uk: 'Печиво' }, summary: { en: 'Cocoa cookies with orange zest that rise and crack as they bake.', es: 'Galletas de cacao con ralladura de naranja que suben y se craquelan al hornearse.', uk: 'Какао-печиво з апельсиновою цедрою, яке піднімається й тріскається під час випікання.' }, alt: previewAlt('Chocolate crinkle cookies with a cracked surface', 'Galletas de chocolate craqueladas', 'Шоколадне печиво з тріщинками') },
  'apple-fritters': { title: { en: 'Apple fritters', es: 'Tortitas de manzana', uk: 'Яблучні оладки' }, category: { en: 'Breakfast', es: 'Desayuno', uk: 'Сніданок' }, summary: { en: 'Apple fritters from the working recipe.', es: 'Tortitas de manzana de la receta de trabajo.', uk: 'Яблучні оладки з робочого рецепта.' }, alt: previewAlt('Gluten-free apple fritters', 'Tortitas de manzana sin gluten', 'Безглютенові яблучні оладки') },
  'banana-fritters': { title: { en: 'Banana fritters', es: 'Tortitas de plátano', uk: 'Бананові оладки' }, category: { en: 'Breakfast', es: 'Desayuno', uk: 'Сніданок' }, summary: { en: 'Banana fritters from the working recipe.', es: 'Tortitas de plátano de la receta de trabajo.', uk: 'Бананові оладки з робочого рецепта.' }, alt: previewAlt('Gluten-free banana fritters', 'Tortitas de plátano sin gluten', 'Безглютенові бананові оладки') },
  'apple-banana-fritters': { title: { en: 'Apple-banana fritters', es: 'Tortitas de manzana y plátano', uk: 'Яблучно-бананові оладки' }, category: { en: 'Breakfast', es: 'Desayuno', uk: 'Сніданок' }, summary: { en: 'Apple and banana fritters from the working recipe.', es: 'Tortitas de manzana y plátano de la receta de trabajo.', uk: 'Яблучно-бананові оладки з робочого рецепта.' }, alt: previewAlt('Gluten-free apple and banana fritters', 'Tortitas sin gluten de manzana y plátano', 'Безглютенові оладки з яблуком і бананом') },
  'easter-bread': { title: { en: 'Ukrainian Easter bread', es: 'Pan ucraniano de Pascua', uk: 'Безглютенова паска' }, category: { en: 'Seasonal baking', es: 'Repostería de temporada', uk: 'Сезонна випічка' }, summary: { en: 'A seasonal recipe awaiting transfer of its exact method.', es: 'Una receta de temporada que espera la transcripción de su método exacto.', uk: 'Сезонний рецепт, що очікує перенесення точного способу приготування.' }, alt: previewAlt('Tall gluten-free Ukrainian Easter bread with glaze and raisins', 'Pan ucraniano de Pascua sin gluten con glaseado y pasas', 'Висока безглютенова паска з глазур’ю та родзинками') },
  'prune-cake': { title: { en: 'Chocolate prune cake', es: 'Tarta de chocolate y ciruelas pasas', uk: 'Торт із чорносливом' }, category: { en: 'Celebration cake', es: 'Tarta de celebración', uk: 'Святковий торт' }, summary: { en: 'A chocolate celebration cake with a cream filling and prunes.', es: 'Una tarta de celebración de chocolate con crema y ciruelas pasas.', uk: 'Шоколадний святковий торт із кремом і чорносливом.' }, alt: previewAlt('Chocolate layer cake with cream and prune pieces', 'Tarta de chocolate en capas con crema y trozos de ciruela pasa', 'Шоколадний торт із кремом і шматочками чорносливу') },
  'fruit-sponge-roll': { title: { en: 'Fruit sponge roll', es: 'Brazo de gitano de frutas', uk: 'Бісквітний рулет із фруктами' }, category: { en: 'Rolled sponge / dessert', es: 'Bizcocho enrollado / postre', uk: 'Бісквітний рулет / десерт' }, summary: { en: 'A filled sponge roll with blueberry jam, mascarpone cream, strawberries, mint and almonds.', es: 'Un bizcocho enrollado con mermelada de arándanos, crema de mascarpone, fresas, menta y almendras.', uk: 'Бісквітний рулет із чорничним варенням, кремом із маскарпоне, полуницею, м’ятою та мигдалем.' }, alt: previewAlt('Author photo of a fruit sponge roll with cream, berries, mint and almonds', 'Foto de la autora de un brazo de gitano de frutas con crema, frutos rojos, menta y almendras', 'Фото авторки бісквітного рулету з кремом, ягодами, м’ятою та мигдалем') },
  eclairs: { title: { en: 'Eclairs', es: 'Éclairs', uk: 'Еклери' }, category: { en: 'Choux pastry / dessert', es: 'Pasta choux / postre', uk: 'Заварне тісто / десерт' }, summary: { en: 'The working éclair recipe still needs its complete recipe card.', es: 'La receta de éclairs aún necesita su ficha completa.', uk: 'Робочий рецепт еклерів ще потребує повної картки.' }, alt: previewAlt('Golden gluten-free eclairs with vanilla cream and chocolate glaze', 'Éclairs sin gluten dorados con crema de vainilla y glaseado de chocolate', 'Золотисті безглютенові еклери з ванільним кремом і шоколадною глазур’ю') },
};
