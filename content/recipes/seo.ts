import type { AppLocale } from '../../lib/i18n/config.ts';

/** Optional editorial overrides; empty fields fall back to visible recipe copy. */
export type RecipeSeoCopy = Partial<
  Record<AppLocale, { title?: string; description?: string }>
>;
export const recipeSeo: Record<string, RecipeSeoCopy> = {
  'celebration-sponge-cake': {
    uk: {
      title: 'Безглютеновий святковий торт',
      description:
        'Безглютеновий святковий торт зі сметанним кремом, шоколадною глазур’ю та фруктами. Покрокове приготування бісквіта й складання торта.',
    },
    en: {
      title: 'Gluten-free celebration cake',
      description:
        'A gluten-free celebration cake with sour cream filling, chocolate glaze and fruit. Follow the steps for the sponge, filling and assembly.',
    },
    es: {
      title: 'Tarta de celebración sin gluten',
      description:
        'Tarta de celebración sin gluten con crema de nata agria, glaseado de chocolate y fruta. Preparación del bizcocho y montaje paso a paso.',
    },
  },
  'sour-cream': {
    uk: {
      title: 'Сметанний крем',
      description:
        'Сметанний крем для двох прошарків торта діаметром 24 см. Інгредієнти, пропорції та кроки приготування домашньої начинки.',
    },
    en: {
      title: 'Sour cream filling',
      description:
        'Sour cream filling for two layers in a 24 cm cake, with ingredient quantities and step-by-step instructions.',
    },
    es: {
      title: 'Crema de nata agria',
      description:
        'Crema de nata agria para dos capas de relleno en una tarta de 24 cm. Ingredientes, cantidades y preparación paso a paso.',
    },
  },
  'lemon-cream-cheese': {
    uk: {
      title: 'Лимонний крем із маслом і вершковим сиром',
      description:
        'Лимонний крем із вершковим сиром для покриття й оздоблення. Порцію перераховано на 200 г масла; цю кількість не перевірено на практиці.',
    },
    en: {
      title: 'Lemon butter and cream cheese frosting',
      description:
        'Lemon cream cheese frosting for coating and piping, calculated for 200 g butter. This adjusted batch has not been tested.',
    },
    es: {
      title: 'Crema de mantequilla y queso al limón',
      description:
        'Crema de queso y mantequilla al limón para cubrir y decorar. Cantidades calculadas para 200 g de mantequilla; esta tanda no se ha probado.',
    },
  },
  'chocolate-glaze': {
    uk: {
      title: 'Шоколадна глазур',
      description:
        'Шоколадна глазур із какао для домашніх тортів. Точні пропорції та покрокове приготування для завершального покриття.',
    },
    en: {
      title: 'Chocolate glaze',
      description:
        'Cocoa chocolate glaze for homemade cakes, with ingredient quantities and step-by-step instructions for the finishing layer.',
    },
    es: {
      title: 'Glaseado de chocolate',
      description:
        'Glaseado de chocolate con cacao para tartas caseras. Cantidades y preparación paso a paso para dar el toque final.',
    },
  },
  'gluten-free-napoleon': {
    uk: {
      title: 'Безглютеновий Наполеон',
      description:
        'Безглютеновий Наполеон із тонких коржів, заварного крему та горіхів. Рецепт на два торти діаметром 24 см, по шість коржів у кожному.',
    },
    en: {
      title: 'Gluten-Free Napoleon Cake',
      description:
        'Gluten-free Napoleon cake with thin pastry layers, custard and nuts. Makes two 24 cm cakes with six layers each; follow the method step by step.',
    },
    es: {
      title: 'Tarta Napoleón sin gluten',
      description:
        'Tarta Napoleón sin gluten con capas finas, crema pastelera y frutos secos. Receta para dos tartas de 24 cm, con seis capas cada una.',
    },
  },
  'crinkle-cookies': {
    uk: {
      title: 'Безглютенове мармурове печиво «Тріщинки»',
      description:
        'Безглютенове шоколадне печиво «Тріщинки» з ніжною серединою та цукровою скоринкою. Інгредієнти й покрокове приготування.',
    },
    en: {
      title: 'Gluten-free marbled crinkle cookies',
      description:
        'Gluten-free chocolate crinkle cookies with tender centres and a cracked sugar coating. Ingredient quantities and step-by-step baking instructions.',
    },
    es: {
      title: 'Galletas marmoladas craqueladas sin gluten',
      description:
        'Galletas de chocolate craqueladas sin gluten, tiernas por dentro y cubiertas de azúcar. Ingredientes y elaboración paso a paso.',
    },
  },
  'plum-cake': {
    uk: {
      title: 'Безглютеновий сливовий пиріг',
      description:
        'Безглютеновий сливовий пиріг із вершковим маслом і соковитими скибочками слив. Пропорції, підготовка тіста та випікання крок за кроком.',
    },
    en: {
      title: 'Gluten-free plum sponge cake',
      description:
        'Gluten-free plum cake with a tender butter sponge and juicy plum wedges. Ingredient quantities, batter preparation and baking instructions.',
    },
    es: {
      title: 'Bizcocho de ciruelas sin gluten',
      description:
        'Bizcocho de ciruelas sin gluten con mantequilla y gajos de fruta jugosos. Cantidades, preparación de la masa y horneado paso a paso.',
    },
  },
  'cottage-cheese-waffles': {
    uk: {
      title: 'Безглютенові сирні вафлі',
      description:
        'Безглютенові сирні вафлі з кисломолочним сиром і натуральним йогуртом. Склад, пропорції та покрокове приготування у вафельниці.',
    },
    en: {
      title: 'Gluten-free curd cheese waffles',
      description:
        'Gluten-free curd cheese waffles made with tvorog and natural yoghurt. Ingredient quantities and step-by-step instructions for the waffle maker.',
    },
    es: {
      title: 'Gofres de tvorog sin gluten',
      description:
        'Gofres sin gluten con tvorog, un queso fresco de leche fermentada, y yogur natural. Ingredientes y preparación en gofrera paso a paso.',
    },
  },
  'carrot-cake': {
    uk: {
      title: 'Безглютеновий морквяний кекс',
      description:
        'Безглютеновий морквяний кекс із родзинками та горіхами. Підготовка добавок, замішування тіста й випікання з покроковими поясненнями.',
    },
    en: {
      title: 'Gluten-free carrot cake',
      description:
        'Gluten-free carrot cake with raisins and nuts. Follow the steps for preparing the fruit and nuts, mixing the batter and baking.',
    },
    es: {
      title: 'Bizcocho de zanahoria sin gluten',
      description:
        'Bizcocho de zanahoria sin gluten con pasas y frutos secos. Preparación de los ingredientes, mezcla de la masa y horneado paso a paso.',
    },
  },
  'sponge-cake': {
    uk: {
      title: 'Безглютеновий бісквіт для торта',
      description:
        'Безглютеновий бісквіт на Schär Mix B Bread для торта на два або три коржі. Покроковий рецепт повітряної основи для крему й начинки.',
    },
    en: {
      title: 'Gluten-free sponge cake for layer cakes',
      description:
        'Gluten-free sponge cake made with Schär Mix B Bread, ready to cut into two or three layers. A step-by-step recipe for a light cake base.',
    },
    es: {
      title: 'Bizcocho sin gluten para tartas',
      description:
        'Bizcocho sin gluten con Schär Mix B Bread para cortar en dos o tres capas. Receta paso a paso de una base esponjosa para tartas.',
    },
  },
  crepes: {
    uk: {
      title: 'Безглютенові млинці',
      description:
        'Тонкі безглютенові млинці на молоці. Пропорції інгредієнтів, приготування тіста та випікання на пательні крок за кроком.',
    },
    en: {
      title: 'Gluten-free crepes',
      description:
        'Thin gluten-free crepes made with milk. Ingredient quantities and step-by-step instructions for mixing the batter and cooking in a frying pan.',
    },
    es: {
      title: 'Crepes sin gluten',
      description:
        'Crepes finos sin gluten con leche. Cantidades de los ingredientes y preparación de la masa y cocción en sartén paso a paso.',
    },
  },
  'fruit-sponge-roll': {
    uk: {
      title: 'Безглютеновий бісквітний рулет із фруктами',
      description:
        'Безглютеновий бісквітний рулет із ягідним варенням і кремом. Як спекти бісквіт, додати начинку та згорнути рулет; фрукти — за бажанням.',
    },
    en: {
      title: 'Gluten-free fruit sponge roll',
      description:
        'Gluten-free sponge roll with berry jam and cream. Bake, fill and roll the sponge step by step, then finish with optional fresh fruit.',
    },
    es: {
      title: 'Brazo de gitano de frutas sin gluten',
      description:
        'Brazo de gitano sin gluten con mermelada de frutos rojos y crema. Cómo hornear, rellenar y enrollar el bizcocho, con fruta fresca al gusto.',
    },
  },
  'banana-bread': {
    uk: {
      title: 'Безглютеновий банановий хліб',
      description:
        'Безглютеновий банановий хліб із волоськими горіхами й родзинками. Інгредієнти, пропорції та покрокове приготування домашньої випічки.',
    },
    en: {
      title: 'Gluten-free banana bread',
      description:
        'Gluten-free banana bread with walnuts and raisins. Ingredient quantities and step-by-step instructions for a homemade banana loaf.',
    },
    es: {
      title: 'Pan de plátano sin gluten',
      description:
        'Pan de plátano sin gluten con nueces y pasas. Ingredientes, cantidades y preparación paso a paso de este bizcocho casero.',
    },
  },
  'lazy-dumplings': {
    uk: {
      title: 'Безглютенові ліниві вареники',
      description:
        'Безглютенові ліниві вареники з кисломолочного сиру. Пропорції інгредієнтів, формування та варіння крок за кроком.',
    },
    en: {
      title: 'Gluten-free lazy curd cheese dumplings',
      description:
        'Gluten-free lazy dumplings made with tvorog curd cheese. Ingredient quantities and step-by-step instructions for shaping and boiling.',
    },
    es: {
      title: 'Váreniki de tvorog sin gluten',
      description:
        'Váreniki sin relleno y sin gluten, hechos con tvorog, un queso fresco de leche fermentada. Cantidades, formado y cocción paso a paso.',
    },
  },
  'prune-cake': {
    uk: {
      title: 'Безглютеновий торт із чорносливом',
      description:
        'Безглютеновий шоколадний торт із чорносливовим кремом і глазур’ю. Покрокове приготування коржів, начинки та складання торта.',
    },
    en: {
      title: 'Gluten-free chocolate prune cake',
      description:
        'Gluten-free chocolate cake with prune cream and chocolate glaze. Follow the steps for baking the layers, making the filling and assembling the cake.',
    },
    es: {
      title: 'Tarta de chocolate y ciruelas pasas sin gluten',
      description:
        'Tarta de chocolate sin gluten con crema de ciruelas pasas y glaseado. Bizcocho, relleno y montaje explicados paso a paso.',
    },
  },
  eclairs: {
    uk: {
      title: 'Безглютенові профітролі',
      description:
        'Безглютенові профітролі із заварного тіста з кремовою начинкою. Підготовка тіста, випікання порожнистих тістечок і наповнення кремом.',
    },
    en: {
      title: 'Gluten-free profiteroles',
      description:
        'Gluten-free profiteroles with a cream filling. Follow the steps for making choux pastry, baking hollow shells and filling them.',
    },
    es: {
      title: 'Profiteroles sin gluten',
      description:
        'Profiteroles sin gluten con relleno cremoso. Cómo preparar la pasta choux, hornear los bocaditos huecos y rellenarlos paso a paso.',
    },
  },
  'apple-fritters': {
    uk: {
      title: 'Безглютенові яблучні оладки',
      description:
        'Безглютенові яблучні оладки на Schär Mix B Bread. Склад, пропорції, приготування тіста та смаження ніжних оладок на пательні.',
    },
    en: {
      title: 'Gluten-free apple fritters',
      description:
        'Gluten-free apple fritters made with Schär Mix B Bread. Ingredient quantities and step-by-step instructions for mixing and pan-frying.',
    },
    es: {
      title: 'Tortitas de manzana sin gluten',
      description:
        'Tortitas de manzana sin gluten con Schär Mix B Bread. Ingredientes, cantidades y preparación de la masa y cocción en sartén.',
    },
  },
  'banana-fritters': {
    uk: {
      title: 'Безглютенові бананові панкейки',
      description:
        'Безглютенові бананові панкейки з грецьким йогуртом і Schär Mix B Bread. Пропорції, тісто та приготування на пательні крок за кроком.',
    },
    en: {
      title: 'Gluten-free banana pancakes',
      description:
        'Gluten-free banana pancakes with Greek yoghurt and Schär Mix B Bread. Ingredient quantities, batter preparation and step-by-step cooking instructions.',
    },
    es: {
      title: 'Tortitas de plátano sin gluten',
      description:
        'Tortitas de plátano sin gluten con yogur griego y Schär Mix B Bread. Cantidades, preparación de la masa y cocción en sartén paso a paso.',
    },
  },
  'mascarpone-whipped-cream': {
    uk: {
      title: 'Крем із вершків та маскарпоне',
      description:
        'Крем зі збитих вершків і маскарпоне для начинки та оздоблення. Пропорції й покрокове приготування легкого крему, який тримає форму.',
    },
    en: {
      title: 'Whipped cream with mascarpone',
      description:
        'Whipped cream with mascarpone for filling and decorating cakes. Ingredient quantities and steps for a light cream that holds its shape.',
    },
    es: {
      title: 'Crema de nata y mascarpone',
      description:
        'Crema de nata montada y mascarpone para rellenar y decorar. Cantidades y pasos para obtener una crema ligera que mantiene la forma.',
    },
  },
  'vanilla-egg-custard': {
    uk: {
      title: 'Ванільний заварний крем з яйцями',
      description:
        'Ванільний заварний крем з яйцями для начинки тортів і тістечок. Інгредієнти, приготування та охолодження гладкого крему.',
    },
    en: {
      title: 'Vanilla custard with eggs',
      description:
        'Vanilla custard with eggs for filling cakes and pastries. Ingredient quantities and instructions for cooking and cooling a smooth custard.',
    },
    es: {
      title: 'Crema pastelera de vainilla con huevo',
      description:
        'Crema pastelera de vainilla con huevo para rellenar tartas y pasteles. Ingredientes, cocción y enfriado explicados paso a paso.',
    },
  },
  'eggless-vanilla-custard': {
    uk: {
      title: 'Ванільний заварний крем без яєць',
      description:
        'Ванільний заварний крем без яєць у великій порції. Пропорції, приготування та охолодження крему, який додатково густішає.',
    },
    en: {
      title: 'Eggless vanilla custard',
      description:
        'A large batch of eggless vanilla custard that thickens further as it cools. Ingredient quantities and step-by-step cooking instructions.',
    },
    es: {
      title: 'Crema de vainilla sin huevo',
      description:
        'Crema de vainilla sin huevo en una tanda abundante. Cantidades, cocción y enfriado de una crema que espesa al reposar.',
    },
  },
  'vanilla-buttercream': {
    uk: {
      title: 'Ванільний масляний крем',
      description:
        'Ванільний масляний крем для начинки й оздоблення тортів та тістечок. Пропорції та кроки приготування стійкого крему.',
    },
    en: {
      title: 'Vanilla buttercream',
      description:
        'Vanilla buttercream for filling and decorating cakes and pastries. Ingredient quantities and step-by-step instructions for a stable cream.',
    },
    es: {
      title: 'Crema de mantequilla de vainilla',
      description:
        'Crema de mantequilla de vainilla para rellenar y decorar tartas y pasteles. Cantidades y preparación paso a paso de una crema estable.',
    },
  },
};
