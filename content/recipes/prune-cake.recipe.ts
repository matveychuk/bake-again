import type {
  RecipeSourceDraft,
  RecipeSourceDraftContent,
  StructuredIngredientSection,
  StructuredRecipeStep,
} from './source-recipe.types.ts';
import { chocolateGlazeContent } from './chocolate-glaze.recipe.ts';
import { quantityFromGrams } from './spoon-weights.ts';

type Locale = 'en' | 'es' | 'uk';
const text = (locale: Locale, en: string, es: string, uk: string) =>
  ({ en, es, uk })[locale];
const exact = (value: number, unit: 'g' | 'piece' | 'tbsp') => ({
  base: { kind: 'exact' as const, value, unit },
  shopping: { mode: 'base' as const },
});
// These spoon equivalents belong only to the author's 2026-09-26 bake.
// They must not change shared conversion factors or the separate glaze recipe.
const weighedSpoons = (grams: number, spoons: number) => ({
  ...exact(grams, 'g'),
  equivalent: { kind: 'exact' as const, value: spoons, unit: 'tbsp' as const },
});

function ingredientSections(locale: Locale): StructuredIngredientSection[] {
  return [
    {
      id: 'cake',
      title: text(locale, 'Cake', 'Bizcocho', 'Корж'),
      ingredients: [
        {
          id: 'eggs',
          name: text(locale, 'Eggs', 'Huevos', 'Яйця'),
          quantity: {
            ...exact(4, 'piece'),
            shopping: { mode: 'base', increment: 1, rounding: 'up' },
          },
        },
        {
          id: 'greek-yogurt',
          name: text(
            locale,
            'Thick Greek yoghurt',
            'Yogur griego espeso',
            'Густий грецький йогурт',
          ),
          quantity: weighedSpoons(200, 5),
        },
        {
          id: 'sugar',
          name: text(locale, 'Sugar', 'Azúcar', 'Цукор'),
          quantity: quantityFromGrams('granulated-sugar', 150),
        },
        {
          id: 'sunflower-oil',
          name: text(
            locale,
            'Sunflower oil',
            'Aceite de girasol',
            'Соняшникова олія',
          ),
          quantity: exact(2, 'tbsp'),
        },
        {
          id: 'sweetened-condensed-milk',
          name: text(
            locale,
            'Sweetened condensed milk',
            'Leche condensada azucarada',
            'Згущене молоко з цукром',
          ),
          quantity: weighedSpoons(70, 5),
        },
        {
          id: 'flour',
          name: text(
            locale,
            'Schär Mix B Bread flour',
            'Harina Schär Mix B Bread',
            'Борошно Schär Mix B Bread',
          ),
          quantity: quantityFromGrams('schar-mix-b', 160),
        },
        {
          id: 'cocoa',
          name: text(
            locale,
            'Unsweetened cocoa powder',
            'Cacao puro sin azúcar',
            'Какао без цукру',
          ),
          quantity: weighedSpoons(65, 5),
        },
        {
          id: 'leavener',
          name: text(locale, 'Baking powder', 'Levadura química', 'Розпушувач'),
          quantity: quantityFromGrams('baking-powder', 8, 'tsp'),
        },
      ],
    },
    {
      id: 'cream',
      title: text(
        locale,
        'Cream and decoration',
        'Crema y decoración',
        'Крем і декор',
      ),
      ingredients: [
        {
          id: 'cream-base',
          name: text(
            locale,
            'Sour cream and Greek yoghurt',
            'Nata agria y yogur griego',
            'Сметана та грецький йогурт',
          ),
          quantity: exact(700, 'g'),
          note: text(
            locale,
            'Combined weight of both ingredients.',
            'Peso total de los dos ingredientes.',
            'Загальна маса обох інгредієнтів.',
          ),
        },
        {
          id: 'cream-sugar',
          name: text(locale, 'Sugar', 'Azúcar', 'Цукор'),
          quantity: quantityFromGrams('granulated-sugar', 70),
        },
        {
          id: 'cream-lemon-juice',
          name: text(locale, 'Lemon juice', 'Zumo de limón', 'Лимонний сік'),
          quantity: exact(1, 'tbsp'),
        },
        {
          id: 'prunes',
          name: text(
            locale,
            'Pitted prunes',
            'Ciruelas pasas sin hueso',
            'Чорнослив без кісточок',
          ),
          quantity: exact(150, 'g'),
        },
        {
          id: 'nuts',
          name: text(
            locale,
            'Walnuts or pecans',
            'Nueces o pacanas',
            'Волоські горіхи або пекан',
          ),
          quantity: exact(30, 'g'),
        },
      ],
    },
    chocolateGlazeContent(locale).ingredientSections[0],
  ];
}

function steps(locale: Locale): StructuredRecipeStep[] {
  const t = (en: string, es: string, uk: string) => text(locale, en, es, uk);
  const photos = {
    'whipped-eggs':
      '/media/recipes/prune-cake/selected/whipped-eggs-author-v1.webp',
    'chocolate-batter':
      '/media/recipes/prune-cake/selected/chocolate-batter-author-v1.webp',
    'trimmed-edge':
      '/media/recipes/prune-cake/selected/trimmed-edge-author-v1.webp',
    'cake-trimmings':
      '/media/recipes/prune-cake/selected/cake-trimmings-author-v1.webp',
    'sliced-crumb':
      '/media/recipes/prune-cake/selected/sliced-crumb-author-v1.webp',
    'chopped-prunes':
      '/media/recipes/prune-cake/selected/chopped-prunes-author-v1.webp',
    'cream-coated-pieces':
      '/media/recipes/prune-cake/selected/cream-coated-pieces-author-v1.webp',
    'assembled-cake':
      '/media/recipes/prune-cake/selected/assembled-cake-author-v1.webp',
  } as const;
  const media = (
    name: keyof typeof photos,
    en: string,
    es: string,
    uk: string,
  ) => [
    {
      id: `prune-cake-${name}-author-v1`,
      src: photos[name],
      alt: t(en, es, uk),
    },
  ];
  const glazeInstructions = chocolateGlazeContent(locale)
    .steps.map((step) => step.body)
    .join(' ');
  return [
    {
      id: 'prepare-pan',
      title: t(
        'Prepare the oven and tin',
        'Prepara el horno y el molde',
        'Підготуйте духовку й форму',
      ),
      body: t(
        'Preheat the oven to 200°C. Line the base of the 24 cm round tin with parchment. Have a sheet of foil ready to cover the tin loosely.',
        'Precalienta el horno a 200°C. Forra la base del molde redondo de 24 cm con papel de horno. Prepara una hoja de aluminio para cubrir el molde sin ajustarla.',
        'Розігрійте духовку до 200°C. Дно круглої форми 24 см застеліть пергаментом. Підготуйте лист фольги, щоб вільно накрити форму зверху.',
      ),
    },
    {
      id: 'whip-eggs',
      title: t(
        'Whip the eggs and sugar',
        'Bate los huevos con el azúcar',
        'Збийте яйця з цукром',
      ),
      body: t(
        'Beat the whole eggs with the sugar until pale, thick and increased in volume.',
        'Bate los huevos enteros con el azúcar hasta obtener una mezcla clara, espesa y con más volumen.',
        'Збийте цілі яйця з цукром до світлої густої маси, що помітно збільшилася в об’ємі.',
      ),
      checkpoint: t(
        'The mixture falls from the whisk in a ribbon that remains on the surface for a few seconds.',
        'La mezcla cae de las varillas formando una cinta que queda visible unos segundos.',
        'Маса стікає з вінчика стрічкою, слід від якої видно на поверхні кілька секунд.',
      ),
      cookIngredients: [{ ingredientId: 'eggs' }, { ingredientId: 'sugar' }],
      media: media(
        'whipped-eggs',
        'Pale whipped eggs falling from the whisk in a ribbon',
        'Huevos batidos claros que caen de las varillas formando una cinta',
        'Світла збита яєчна маса стікає з вінчика стрічкою',
      ),
    },
    {
      id: 'add-wet',
      title: t(
        'Fold in the wet ingredients',
        'Incorpora los ingredientes húmedos',
        'Додайте йогурт, олію та згущене молоко',
      ),
      body: t(
        'Mix the yoghurt, oil and condensed milk separately. Stir a little egg mixture into them, then gently fold this back into the remaining eggs with a spatula.',
        'Mezcla aparte el yogur, el aceite y la leche condensada. Añade un poco de huevo batido y después incorpora todo al resto del huevo con una espátula y movimientos envolventes.',
        'Окремо змішайте йогурт, олію та згущене молоко. Вмішайте трохи яєчної маси, потім обережно з’єднайте з рештою збитих яєць лопаткою.',
      ),
      cookIngredients: [
        'greek-yogurt',
        'sunflower-oil',
        'sweetened-condensed-milk',
      ].map((ingredientId) => ({ ingredientId })),
    },
    {
      id: 'finish-batter',
      title: t(
        'Fold in the dry ingredients',
        'Incorpora los ingredientes secos',
        'Вмішайте сухі інгредієнти',
      ),
      body: t(
        'Mix the flour, cocoa and baking powder. Sift into the wet mixture in several additions and fold with a spatula, lifting from the bottom, just until evenly combined.',
        'Mezcla la harina, el cacao y la levadura química. Tamiza sobre la mezcla húmeda en varias tandas e incorpora con una espátula desde el fondo hasta que quede uniforme.',
        'Змішайте борошно, какао й розпушувач. Просійте в рідку суміш у кілька прийомів і вмішайте лопаткою знизу вгору до однорідності.',
      ),
      checkpoint: t(
        'No dry flour or cocoa pockets remain, including at the bottom of the bowl.',
        'No quedan bolsas de harina ni cacao seco, tampoco en el fondo del bol.',
        'У тісті немає сухих грудочок борошна чи какао, зокрема на дні миски.',
      ),
      cookIngredients: ['flour', 'cocoa', 'leavener'].map((ingredientId) => ({
        ingredientId,
      })),
      media: media(
        'chocolate-batter',
        'Chocolate batter on a spatula in a metal bowl',
        'Masa de chocolate sobre una espátula en un bol metálico',
        'Шоколадне тісто на лопатці в металевій мисці',
      ),
    },
    {
      id: 'bake-covered',
      meta: t('200°C · 30 min', '200°C · 30 min', '200°C · 30 хв'),
      title: t(
        'Bake loosely covered with foil',
        'Hornea con aluminio por encima',
        'Випікайте під фольгою',
      ),
      body: t(
        'Transfer the batter to the prepared tin and level it. Lay the foil loosely over the top without sealing the edges or pressing it onto the batter. Put the tin straight into the preheated oven and bake for 30 minutes.',
        'Pasa la masa al molde y alisa la superficie. Coloca el aluminio por encima sin sellar los bordes ni apoyarlo sobre la masa. Introduce enseguida en el horno caliente y hornea 30 minutos.',
        'Перекладіть тісто у форму й розрівняйте. Легенько накрийте фольгою, не притискаючи її до тіста й не загортаючи краї щільно. Одразу поставте в розігріту духовку та випікайте 30 хвилин.',
      ),
    },
    {
      id: 'bake-uncovered',
      meta: t('200°C · 20 min', '200°C · 20 min', '200°C · 20 хв'),
      title: t(
        'Remove the foil and finish baking',
        'Retira el aluminio y termina de hornear',
        'Зніміть фольгу й допечіть',
      ),
      body: t(
        'Carefully remove the foil and bake for another 20 minutes at the same temperature. Check the centre; if the skewer has wet batter on it, bake a little longer and check again.',
        'Retira el aluminio con cuidado y hornea otros 20 minutos a la misma temperatura. Comprueba el centro; si el palillo sale con masa cruda, hornea un poco más y vuelve a comprobar.',
        'Обережно зніміть фольгу й випікайте ще 20 хвилин за тієї самої температури. Перевірте середину: якщо на шпажці є сире тісто, допечіть і перевірте ще раз.',
      ),
      checkpoint: t(
        'The centre springs back gently and a skewer comes out without wet batter.',
        'El centro recupera la forma al tocarlo suavemente y el palillo sale sin masa cruda.',
        'Середина злегка пружинить, шпажка виходить без сирого тіста.',
      ),
    },
    {
      id: 'cool-and-slice',
      title: t(
        'Cool completely and slice',
        'Deja enfriar y corta las capas',
        'Остудіть і розріжте корж',
      ),
      body: t(
        'Let the cake cool until it can be removed from the tin, then finish cooling on a rack. Once completely cold, slice horizontally into two layers. Trim a strip about 1 cm wide from the edge all the way around both layers. Cut the trimmings into small pieces and set aside in a bowl for the topping.',
        'Deja que el bizcocho se temple antes de desmoldarlo y termina de enfriarlo sobre una rejilla. Cuando esté completamente frío, córtalo en dos capas horizontales. Recorta una tira de aproximadamente 1 cm de ancho alrededor de ambas capas. Corta los recortes en trozos pequeños y resérvalos en un bol para la cobertura.',
        'Дайте коржу трохи охолонути у формі, потім вийміть і повністю остудіть на решітці. Розріжте горизонтально на два коржі. Обріжте приблизно по 1 см від краю кожного коржа по всьому колу. Обрізки наріжте невеликими шматочками та відкладіть у миску для верхньої гірки.',
      ),
      tip: t(
        'Only spread cream on completely cold cake.',
        'Añade la crema solo cuando el bizcocho esté completamente frío.',
        'Наносьте крем лише на повністю холодні коржі.',
      ),
      media: [
        ...media(
          'sliced-crumb',
          'Cut chocolate cake layer',
          'Capa de bizcocho de chocolate cortada',
          'Шоколадний корж у розрізі',
        ),
        ...media(
          'trimmed-edge',
          'Knife cutting a narrow strip around the cake edge',
          'Cuchillo recortando una tira del borde del bizcocho',
          'Ніж обрізає вузьку смужку по краю коржа',
        ),
        ...media(
          'cake-trimmings',
          'Cake edge trimmings in a white bowl',
          'Recortes de bizcocho en un bol blanco',
          'Бокові обрізки коржа в білій мисці',
        ),
      ],
    },
    {
      id: 'make-cream',
      title: t(
        'Make the cream and chop the prunes',
        'Prepara la crema y las ciruelas pasas',
        'Приготуйте крем і чорнослив',
      ),
      body: t(
        'Mix the sour cream and Greek yoghurt with the sugar and lemon juice until smooth and the sugar has dissolved. Chop the prunes, reserve a little for decoration and fold the rest into the cream. Keep chilled until assembly.',
        'Mezcla la nata agria y el yogur griego con el azúcar y el zumo de limón hasta que quede homogéneo y se disuelva el azúcar. Pica las ciruelas pasas, reserva unas pocas para decorar e incorpora el resto a la crema. Guarda en la nevera hasta montar.',
        'Змішайте сметану та грецький йогурт із цукром і лимонним соком до однорідності й розчинення цукру. Наріжте чорнослив, трохи відкладіть для декору, решту вмішайте в крем. До складання тримайте в холодильнику.',
      ),
      tip: t(
        'Make the cream while the cake cools. Chop the nuts for the topping too.',
        'Prepara la crema mientras se enfría el bizcocho. Pica también los frutos secos para decorar.',
        'Крем можна приготувати, поки корж остигає. Тоді ж подрібніть горіхи для декору.',
      ),
      cookIngredients: [
        'cream-base',
        'cream-sugar',
        'cream-lemon-juice',
        'prunes',
        'nuts',
      ].map((ingredientId) => ({ ingredientId })),
      media: media(
        'chopped-prunes',
        'Chopped prunes in a glass bowl',
        'Ciruelas pasas picadas en un bol de cristal',
        'Нарізаний чорнослив у скляній мисці',
      ),
    },
    {
      id: 'stack-layers',
      title: t(
        'Layer the cake with prune cream',
        'Monta las capas con crema de ciruelas pasas',
        'Перемастіть коржі кремом із чорносливом',
      ),
      body: t(
        'Place one cake layer on a serving plate and spread with sour cream and prune filling. Place the second layer on top and cover it with filling too. Reserve the remaining cream to mix with the cake trimmings.',
        'Coloca una capa en un plato y úntala con crema de nata agria y ciruelas pasas. Pon la segunda encima y cúbrela también con crema. Reserva la crema restante para mezclarla con los recortes.',
        'Покладіть один корж на тарілку й змастіть сметанним кремом із чорносливом. Покладіть зверху другий корж і теж змастіть кремом із чорносливом. Решту крему залиште для обрізків.',
      ),
    },
    {
      id: 'assemble-mound',
      title: t(
        'Add the cream-coated cake pieces',
        'Añade los trozos de bizcocho con crema',
        'Викладіть шматочки коржа з кремом',
      ),
      body: t(
        'Gently mix the reserved cake trimmings with the remaining cream. Pile them onto the top cake layer without pressing down.',
        'Mezcla con cuidado los recortes reservados con la crema restante. Colócalos formando un montículo sobre la capa superior, sin aplastarlos.',
        'Обережно перемішайте відкладені шматочки бокових обрізків із рештою крему. Викладіть гіркою на верхній корж, не утрамбовуючи.',
      ),
      checkpoint: t(
        'Each piece is coated in cream and the mound holds together.',
        'Cada trozo queda cubierto de crema y el conjunto mantiene la forma.',
        'Кожен шматочок укритий кремом, верхівка тримається разом.',
      ),
      media: [
        ...media(
          'cream-coated-pieces',
          'Chocolate cake pieces coated in cream in a white bowl',
          'Trozos de bizcocho de chocolate recubiertos de crema en un bol blanco',
          'Шматочки шоколадного коржа в кремі у білій мисці',
        ),
        ...media(
          'assembled-cake',
          'Assembled cake with cream-coated pieces before glazing',
          'Tarta montada con trozos de bizcocho y crema antes del glaseado',
          'Зібраний торт зі шматочками коржа в кремі перед глазуруванням',
        ),
      ],
    },
    {
      id: 'glaze-and-decorate',
      title: t(
        'Glaze, decorate and chill',
        'Glasea, decora y enfría',
        'Полийте глазур’ю та прикрасьте',
      ),
      body: `${glazeInstructions} ${t(
        'Let the glaze cool until warm but still pourable, then pour over the cake. Scatter over the reserved prunes and chopped nuts. Refrigerate the cake to let the layers absorb the cream and the glaze set; keep chilled until serving.',
        'Deja que el glaseado se temple sin perder fluidez y viértelo sobre la tarta. Añade las ciruelas reservadas y los frutos secos picados. Guarda la tarta en la nevera para que las capas absorban la crema y el glaseado se asiente; mantenla refrigerada hasta servir.',
        'Дайте глазурі охолонути до теплої, поки вона ще ллється, і полийте торт. Прикрасьте відкладеним чорносливом та подрібненими горіхами. Поставте в холодильник, щоб коржі просочилися, а глазур схопилася. До подачі зберігайте охолодженим.',
      )}`,
      cookIngredients: [
        'glaze-sour-cream',
        'glaze-sugar',
        'glaze-cocoa',
        'butter',
      ].map((ingredientId) => ({ ingredientId })),
      media: [
        {
          id: 'prune-cake-finished-author-v2',
          src: '/images/recipes/prune-cake-tea-editorial-v3.webp',
          alt: t(
            'Chocolate prune cake with cream, chocolate glaze and chopped nuts',
            'Tarta de chocolate y ciruelas pasas con crema, glaseado y frutos secos picados',
            'Торт із чорносливом, кремом, шоколадною глазур’ю та подрібненими горіхами',
          ),
        },
      ],
    },
  ];
}

function recipeContent(locale: Locale): RecipeSourceDraftContent {
  return {
    versionId: 'prune-cake-24cm-v2',
    presentation: 'concise',
    showImageNote: false,
    completeness: 'readyToReview',
    evidence: {
      status: 'tested',
      explanation: text(
        locale,
        'Schär Mix B · 24 cm tin.',
        'Schär Mix B · molde de 24 cm.',
        'Schär Mix B · форма 24 см.',
      ),
    },
    yield: {
      id: 'one-cake',
      label: text(locale, '1 cake', '1 tarta', '1 торт'),
      count: { kind: 'exact', value: 1 },
      unit: 'cake',
    },
    geometry: {
      id: 'round-24cm',
      label: text(
        locale,
        '24 cm round tin',
        'Molde redondo de 24 cm',
        'Кругла форма 24 см',
      ),
      kind: 'bakingPan',
      application: 'bake-in',
      shape: 'round',
      diameterCm: 24,
    },
    beforeStart: [
      text(
        locale,
        'Use thick yoghurt and sour cream without separated whey.',
        'Usa yogur y nata agria espesos, sin suero separado.',
        'Йогурт і сметану беріть густі, без відділеної сироватки.',
      ),
      text(
        locale,
        'Use the listed cream-base weight for sour cream and Greek yoghurt combined, not that weight of each.',
        'El peso indicado para la base de crema es el de la nata agria y el yogur juntos, no el de cada uno.',
        'Зазначена маса основи крему — це сметана та йогурт разом, а не така маса кожного продукту.',
      ),
    ],
    timing: {
      activeMinutes: 60,
      totalElapsedMinutes: null,
      planningNote: {
        text: text(
          locale,
          'Baking: 50 minutes. Allow extra time for cooling and chilling.',
          'Horneado: 50 minutos. Añade tiempo para enfriar y refrigerar.',
          'Випікання — 50 хвилин. Додатково потрібен час на охолодження й просочення.',
        ),
      },
      phases: [
        {
          id: 'bake-covered',
          label: text(
            locale,
            'Bake covered',
            'Horneado con aluminio',
            'Випікання під фольгою',
          ),
          duration: { kind: 'exact', value: 30, unit: 'minute' },
          relatedStepId: 'bake-covered',
        },
        {
          id: 'bake-uncovered',
          label: text(
            locale,
            'Bake uncovered',
            'Horneado sin aluminio',
            'Випікання без фольги',
          ),
          duration: { kind: 'exact', value: 20, unit: 'minute' },
          relatedStepId: 'bake-uncovered',
        },
      ],
    },
    relatedRecipes: ['chocolate-glaze'],
    ingredientSections: ingredientSections(locale),
    steps: steps(locale),
  };
}

export const pruneCakeRecipe = {
  id: 'prune-cake',
  publicationStatus: 'published',
  translationState: { uk: 'reviewed', en: 'reviewed', es: 'reviewed' },
  source: {
    file: 'docs/content-model/prune-cake-author-notes.md',
    locator:
      'Author bake, weighed spoon equivalents, original photographs and oven clarification · 2026-09-26',
  },
  ...recipeContent('en'),
  translations: { uk: recipeContent('uk'), es: recipeContent('es') },
} satisfies RecipeSourceDraft;
