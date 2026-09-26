import type { RecipeLocale, IngredientQuantity } from './recipe.types.ts';
import type {
  RecipeSourceDraft,
  RecipeSourceDraftContent,
} from './source-recipe.types.ts';
import { spongeCakeContent } from './sponge-cake.recipe.ts';
import { sourCreamContent } from './sour-cream.recipe.ts';
import { chocolateGlazeContent } from './chocolate-glaze.recipe.ts';
import { quantityFromGrams, quantityFromSpoons } from './spoon-weights.ts';
import { recipePart } from './recipe-part.ts';

const copy = {
  uk: {
    yield: '1 високий торт · 24 см',
    sponge: 'Бісквіт',
    creams: 'Креми',
    assembly: 'Збирання й оздоблення',
    evidence: 'Цю версію успішно випікали у формі 24 см.',
    plan: 'Перед збиранням дайте бісквіту повністю охолонути.',
    bakeMeta: '60–70 хв · 200°C',
    eggs: 'Яйця',
    salt: 'Сіль',
    vanilla: 'Ваніль',
    taste: 'За смаком; авторка не зазначила точної кількості.',
    buttercream: 'Масляний крем',
    buttercreamNames: [
      'Вершкове масло',
      'Цукрова пудра',
      'Вершковий сир',
      'Лимонний сік',
      'Харчовий барвник',
    ],
    buttercreamNotes: [
      'М’яке, кімнатної температури.',
      '',
      'За бажанням, для легшої консистенції.',
      '',
      'За бажанням, буквально 1 крапля.',
    ],
    buttercreamTitle:
      'Приготуйте масляний крем для боків торта та, за бажанням, квіточок зверху',
    buttercreamBody:
      'Збийте м’яке масло до світлої пишної маси. Частинами додайте цукрову пудру, потім поступово вмішайте лимонний сік. За бажанням додайте вершковий сир для легшої консистенції та 1 краплю харчового барвника.',
    buttercreamCue:
      'Крем гладкий, пишний і тримає рельєф від насадки.',
    fruit: 'Фрукти або ягоди',
    soak: 'Яблучний сік або солодкий чай',
    decor: 'Оздоблення',
    fruitNote: 'Для верху та, за бажанням, обох прошарків.',
    soakNote:
      'Рекомендовано для просочення коржів, особливо по краях.',
    vanillaStep: 'Додайте ваніль до жовтків, а сіль — до сухої суміші.',
    bake: 'Вистеліть дно й бортики круглої форми діаметром 24 см двома листами фольги навхрест. Перекладіть тісто та розрівняйте. Випікайте при 200°C загалом 60–70 хвилин. Через 30 хвилин вільно покладіть зверху шматок фольги, щоб верх не пересмажився, поки середина допікається. Наприкінці перевірте середину зубочисткою.',
    cool: 'Коли зубочистка із середини виходить сухою, вимкніть духовку, трохи прочиніть дверцята й залиште бісквіт на 10–15 хвилин. Дістаньте й повністю охолодіть. Зніміть форму та фольгу, а тоді розріжте горизонтально на три коржі.',
    fillTitle: 'Просочіть і перемастіть три коржі',
    fill: 'За потреби злегка просочіть коржі яблучним соком або солодким чаєм, особливо по краях, щоб високий торт не був сухим. Покладіть нижній корж на тарілку й щедро розподіліть на ньому половину сметанного крему. Накрийте другим коржем, додайте решту крему й покладіть третій. Сметанного крему має бути багато. За бажанням додайте в кожен прошарок помиті, добре обсушені та нарізані невеликими шматочками фрукти чи ягоди.',
    fillCue:
      'Коржі лежать рівно, краї просочені, а крем щедро розподілений між двома прошарками.',
    coatTitle: 'Покрийте боки кремом',
    coat: 'За бажанням відкладіть частину масляного крему в кондитерський мішок для квіточок. Рештою тонко покрийте боки торта. Поставте торт у холодильник, щоб покриття стало стійкішим перед глазуруванням.',
    glazeTitle: 'Полийте торт глазур’ю',
    glaze:
      'Дайте глазурі охолонути до ледь теплої: вона має ще текти, але не розтоплювати крем. Спершу зробіть пробний потік на охолодженому боці, потім полийте верх і обережно підведіть глазур до країв, щоб утворилися потьоки.',
    decorateTitle: 'Прикрасьте фруктами й квіточками',
    decorate:
      'Коли глазур уже не тепла, за бажанням відсадіть квіточки з масляного крему й викладіть зверху добре обсушені фрукти або ягоди. Тримайте готовий торт у холодильнику до подачі.',
    cooling: 'Охолодження у вимкненій духовці',
    foil: 'Накрити верх фольгою',
    cutAlt:
      'Приклад розрізу: три бісквітні коржі, два сметанні прошарки й шоколадна глазур',
    authorAlt:
      'Авторський торт із шоколадною глазур’ю, полуницею, лохиною, виноградом і кремовими квіточками',
  },
  en: {
    yield: '1 tall cake · 24 cm',
    sponge: 'Sponge',
    creams: 'Creams',
    assembly: 'Assembly and decoration',
    evidence: 'This version has been baked successfully in a 24 cm tin.',
    plan: 'Let the sponge cool completely before assembling the cake.',
    bakeMeta: '60–70 min · 200°C',
    eggs: 'Eggs',
    salt: 'Salt',
    vanilla: 'Vanilla',
    taste: 'To taste; the author did not specify an amount.',
    buttercream: 'Buttercream',
    buttercreamNames: [
      'Butter',
      'Powdered sugar',
      'Cream cheese',
      'Lemon juice',
      'Food colouring',
    ],
    buttercreamNotes: [
      'Soft, at room temperature.',
      '',
      'Optional, for a lighter consistency.',
      '',
      'Optional, just 1 drop.',
    ],
    buttercreamTitle:
      'Make the buttercream for the sides and, optionally, flowers on top',
    buttercreamBody:
      'Beat the soft butter until pale and fluffy. Add the powdered sugar in batches, then gradually beat in the lemon juice. Optionally add cream cheese for a lighter consistency and 1 drop of food colouring.',
    buttercreamCue: 'The buttercream is smooth, fluffy and holds a piped ridge.',
    fruit: 'Fruit or berries',
    soak: 'Apple juice or sweet tea',
    decor: 'Decoration',
    fruitNote: 'For the top and, optionally, both filling layers.',
    soakNote: 'Recommended for soaking the layers, especially around the edges.',
    vanillaStep: 'Add vanilla to the yolks and salt to the dry mixture.',
    bake: 'Line the base and sides of a 24 cm round tin with two crossed sheets of foil. Add and level the batter. Bake at 200°C for 60–70 minutes in total. After 30 minutes, loosely lay a piece of foil over the top so it does not overbrown while the middle finishes baking. Check the centre with a toothpick towards the end.',
    cool: 'Once a toothpick from the centre comes out dry, turn off the oven, leave the door slightly open and keep the sponge inside for 10–15 minutes. Remove and cool completely. Remove the tin and foil, then slice horizontally into three layers.',
    fillTitle: 'Soak and fill the three sponge layers',
    fill: 'If needed, lightly soak the sponge layers with apple juice or sweet tea, especially around the edges, so the tall cake is not dry. Place the bottom layer on a plate and generously spread over half the sour cream filling. Add the middle layer and the remaining filling, then the top layer. Use plenty of sour cream filling. Optionally add washed, well-dried fruit or berries, cut into small pieces, to each filling layer.',
    fillCue:
      'The layers sit level, the edges are moistened and the filling is generous in both gaps.',
    coatTitle: 'Coat the sides',
    coat: 'Optionally reserve some buttercream in a piping bag for flowers. Use the rest to coat the sides thinly. Refrigerate until the coating is firmer before glazing.',
    glazeTitle: 'Glaze the cake',
    glaze:
      'Let the glaze cool until barely warm: it should still flow without melting the cream. Try one drip on the chilled side first. Pour over the top and gently guide it towards the edges to create drips.',
    decorateTitle: 'Decorate with fruit and flowers',
    decorate:
      'Once the glaze is no longer warm, optionally pipe buttercream flowers and arrange well-dried fruit or berries on top. Refrigerate the finished cake until serving.',
    cooling: 'Cooling in the switched-off oven',
    foil: 'Cover the top with foil',
    cutAlt:
      'Illustrative cut cake with three sponge layers, two sour cream fillings and chocolate glaze',
    authorAlt:
      'The author’s cake with chocolate glaze, strawberries, blueberries, grapes and piped flowers',
  },
  es: {
    yield: '1 tarta alta · 24 cm',
    sponge: 'Bizcocho',
    creams: 'Cremas',
    assembly: 'Montaje y decoración',
    evidence: 'Esta versión se ha horneado con éxito en un molde de 24 cm.',
    plan: 'Deja enfriar por completo el bizcocho antes de montar la tarta.',
    bakeMeta: '60–70 min · 200°C',
    eggs: 'Huevos',
    salt: 'Sal',
    vanilla: 'Vainilla',
    taste: 'Al gusto; la autora no indicó una cantidad.',
    buttercream: 'Crema de mantequilla',
    buttercreamNames: [
      'Mantequilla',
      'Azúcar glas',
      'Queso crema',
      'Zumo de limón',
      'Colorante alimentario',
    ],
    buttercreamNotes: [
      'Blanda, a temperatura ambiente.',
      '',
      'Opcional, para una consistencia más ligera.',
      '',
      'Opcional, solo 1 gota.',
    ],
    buttercreamTitle:
      'Prepara la crema de mantequilla para los laterales y, si quieres, las flores',
    buttercreamBody:
      'Bate la mantequilla blanda hasta que esté clara y esponjosa. Añade el azúcar glas por tandas y después incorpora poco a poco el zumo de limón. Si quieres, añade queso crema para una consistencia más ligera y 1 gota de colorante alimentario.',
    buttercreamCue:
      'La crema está lisa y esponjosa y conserva el relieve de la boquilla.',
    fruit: 'Fruta o frutos rojos',
    soak: 'Zumo de manzana o té dulce',
    decor: 'Decoración',
    fruitNote: 'Para la superficie y, si quieres, ambas capas de relleno.',
    soakNote:
      'Recomendado para humedecer las capas, sobre todo en los bordes.',
    vanillaStep: 'Añade vainilla a las yemas y sal a la mezcla seca.',
    bake: 'Forra el fondo y los lados de un molde redondo de 24 cm con dos hojas de aluminio cruzadas. Vierte y nivela la masa. Hornea a 200°C durante 60–70 minutos en total. Tras 30 minutos, coloca una hoja de aluminio suelta encima para que no se dore demasiado mientras se cuece el centro. Al final, comprueba el centro con un palillo.',
    cool: 'Cuando el palillo del centro salga seco, apaga el horno, entreabre la puerta y deja el bizcocho dentro 10–15 minutos. Sácalo y deja enfriar por completo. Retira el molde y el aluminio y corta horizontalmente en tres capas.',
    fillTitle: 'Humedece y rellena las tres capas',
    fill: 'Si hace falta, humedece ligeramente las capas con zumo de manzana o té dulce, sobre todo en los bordes, para que la tarta alta no quede seca. Pon la capa inferior en un plato y extiende generosamente la mitad de la crema de nata agria. Añade la segunda capa, el resto de la crema y la tercera capa. Debe haber abundante crema. Si quieres, añade a cada relleno fruta lavada, bien seca y cortada en trocitos.',
    fillCue:
      'Las capas están niveladas, los bordes húmedos y los dos rellenos son abundantes.',
    coatTitle: 'Cubre los lados con crema',
    coat: 'Si quieres, reserva crema de mantequilla en una manga para las flores. Usa el resto para cubrir los lados con una capa fina. Refrigera hasta que la cobertura esté más firme antes de glasear.',
    glazeTitle: 'Añade el glaseado',
    glaze:
      'Deja enfriar el glaseado hasta que esté apenas templado: debe fluir sin derretir la crema. Prueba primero una gota en el lateral frío. Viértelo sobre la superficie y guíalo hacia los bordes para que caigan algunos chorritos.',
    decorateTitle: 'Decora con fruta y flores',
    decorate:
      'Cuando el glaseado ya no esté templado, forma flores de crema de mantequilla si quieres y coloca fruta bien seca encima. Guarda la tarta en la nevera hasta servir.',
    cooling: 'Enfriado en el horno apagado',
    foil: 'Cubrir con aluminio',
    cutAlt:
      'Ejemplo de corte con tres capas de bizcocho, dos rellenos de nata agria y glaseado de chocolate',
    authorAlt:
      'Tarta de la autora con chocolate, fresas, arándanos, uvas y flores de crema',
  },
} as const;

export function celebrationSpongeCakeContent(
  locale: RecipeLocale,
): RecipeSourceDraftContent {
  const t = copy[locale];
  const base = spongeCakeContent(locale);
  const amounts: Record<string, IngredientQuantity> = {
    eggs: {
      base: { kind: 'exact', value: 8, unit: 'piece' },
      shopping: { mode: 'base', increment: 1, rounding: 'up' },
    },
    'sugar-whites': quantityFromSpoons('granulated-sugar', 7, 'tbsp'),
    'sugar-yolks': quantityFromSpoons('granulated-sugar', 3, 'tbsp'),
    flour: quantityFromSpoons('schar-mix-b', 12, 'tbsp'),
    'corn-starch': quantityFromSpoons('corn-starch', 3, 'tbsp'),
    tapioca: quantityFromSpoons('tapioca-starch', 1, 'tbsp'),
  };
  const quantity = (id: string): IngredientQuantity => {
    return amounts[id]!;
  };
  const sponge = recipePart(
    {
      ...base,
      ingredientSections: base.ingredientSections.map((section) => ({
        ...section,
        ingredients: [
          ...section.ingredients.map((ingredient) => ({
            ...ingredient,
            name: ingredient.id === 'eggs' ? t.eggs : ingredient.name,
            note: undefined,
            quantity: quantity(ingredient.id),
          })),
          ...[
            ['salt', t.salt],
            ['vanilla', t.vanilla],
          ].map(([id, name]) => ({
            id,
            name,
            quantity: { base: null, shopping: { mode: 'nameOnly' as const } },
            note: t.taste,
          })),
        ],
      })),
      steps: base.steps.map((step, i) => ({
        ...step,
        meta: i === 3 ? t.bakeMeta : t.sponge,
        tip: undefined,
        // This taller author's recipe does not inherit the base sponge's oven setting or bake timer.
        body:
          i === 0
            ? step.body.substring(step.body.indexOf('. ') + 2)
            : i === 1
              ? `${step.body} ${t.vanillaStep}`
              : i === 3
                ? t.bake
                : i === 4
                  ? t.cool
                  : step.body,
        cookIngredients:
          i === 1
            ? [...(step.cookIngredients ?? []), { ingredientId: 'vanilla' }]
            : i === 2
              ? [...(step.cookIngredients ?? []), { ingredientId: 'salt' }]
              : step.cookIngredients,
      })),
    },
    'sponge',
  );
  const filling = recipePart(sourCreamContent(locale), 'filling');
  const glaze = recipePart(chocolateGlazeContent(locale), 'glaze');
  const buttercream = recipePart(
    {
      completeness: 'readyToReview',
      ingredientSections: [
        {
          id: 'buttercream',
          title: t.buttercream,
          ingredients: [
            {
              id: 'butter',
              name: t.buttercreamNames[0],
              quantity: {
                base: { kind: 'exact', value: 200, unit: 'g' },
                shopping: { mode: 'base' },
              },
              note: t.buttercreamNotes[0],
            },
            {
              id: 'powdered-sugar',
              name: t.buttercreamNames[1],
              quantity: quantityFromGrams('powdered-sugar', 100),
            },
            {
              id: 'cream-cheese',
              name: t.buttercreamNames[2],
              quantity: {
                base: { kind: 'exact', value: 2, unit: 'tbsp' },
                shopping: { mode: 'base' },
              },
              optional: true,
              note: t.buttercreamNotes[2],
            },
            {
              id: 'lemon-juice',
              name: t.buttercreamNames[3],
              quantity: {
                base: { kind: 'exact', value: 2, unit: 'tbsp' },
                shopping: { mode: 'base' },
              },
            },
            {
              id: 'food-colouring',
              name: t.buttercreamNames[4],
              quantity: {
                base: null,
                shopping: { mode: 'nameOnly' },
              },
              optional: true,
              note: t.buttercreamNotes[4],
            },
          ],
        },
      ],
      steps: [
        {
          id: 'beat-buttercream',
          technique: {
            id: 'soften-butter',
            condition: 'room-temperature-butter',
          },
          title: t.buttercreamTitle,
          body: t.buttercreamBody,
          checkpoint: t.buttercreamCue,
          cookIngredients: [
            { ingredientId: 'butter' },
            { ingredientId: 'powdered-sugar' },
            { ingredientId: 'cream-cheese' },
            { ingredientId: 'lemon-juice' },
            { ingredientId: 'food-colouring' },
          ],
        },
      ],
    },
    'buttercream',
  );
  const path = '/media/recipes/celebration-sponge-cake/selected/';
  return {
    presentation: 'concise',
    showImageNote: false,
    completeness: 'readyToReview',
    difficulty: 'medium',
    evidence: { status: 'tested', explanation: t.evidence },
    relatedRecipes: ['sponge-cake', 'sour-cream', 'chocolate-glaze'],
    yield: {
      id: 'one-tall-cake',
      label: t.yield,
      count: { kind: 'exact', value: 1 },
      unit: 'cake',
    },
    geometry: {
      id: 'round-24',
      label: locale === 'uk' ? '24 см' : '24 cm',
      kind: 'bakingPan',
      application: 'bake-in',
      shape: 'round',
      diameterCm: 24,
    },
    timing: {
      activeMinutes: 90,
      totalElapsedMinutes: null,
      planningNote: { text: t.plan },
      phases: [
        {
          id: 'baking',
          label:
            locale === 'uk'
              ? 'Випікання'
              : locale === 'es'
                ? 'Horneado'
                : 'Baking',
          duration: { kind: 'range', min: 60, max: 70, unit: 'minute' },
          relatedStepId: 'sponge-bake',
        },
        {
          id: 'foil-reminder',
          label: t.foil,
          duration: { kind: 'exact', value: 30, unit: 'minute' },
          relatedStepId: 'sponge-bake',
        },
        {
          id: 'oven-cooling',
          label: t.cooling,
          duration: { kind: 'range', min: 10, max: 15, unit: 'minute' },
          relatedStepId: 'sponge-cool-and-slice',
        },
      ],
    },
    ingredientSections: [
      ...sponge.ingredientSections,
      ...filling.ingredientSections,
      ...buttercream.ingredientSections,
      ...glaze.ingredientSections,
      {
        id: 'decoration',
        title: t.decor,
        ingredients: [
          {
            id: 'soak',
            name: t.soak,
            quantity: { base: null, shopping: { mode: 'nameOnly' } },
            optional: true,
            note: t.soakNote,
          },
          {
            id: 'fruit',
            name: t.fruit,
            quantity: { base: null, shopping: { mode: 'nameOnly' } },
            optional: true,
            note: t.fruitNote,
          },
        ],
      },
    ],
    steps: [
      ...sponge.steps,
      ...filling.steps.map((step) => ({ ...step, meta: t.creams })),
      ...buttercream.steps.map((step) => ({ ...step, meta: t.creams })),
      {
        id: 'fill',
        meta: t.assembly,
        title: t.fillTitle,
        body: t.fill,
        checkpoint: t.fillCue,
        cookIngredients: [
          { ingredientId: 'soak' },
          { ingredientId: 'fruit' },
        ],
        media: [
          {
            id: 'three-layer-example',
            src: `${path}three-layer-cutaway-v1.webp`,
            alt: t.cutAlt,
          },
        ],
      },
      { id: 'coat', meta: t.assembly, title: t.coatTitle, body: t.coat },
      ...glaze.steps.map((step) => ({
        ...step,
        meta: t.assembly,
        tip: undefined,
      })),
      { id: 'glaze', meta: t.assembly, title: t.glazeTitle, body: t.glaze },
      {
        id: 'decorate',
        meta: t.assembly,
        title: t.decorateTitle,
        body: t.decorate,
        media: [
          {
            id: 'author-overhead',
            src: `${path}author-cake-overhead-v1.webp`,
            alt: t.authorAlt,
          },
        ],
      },
    ],
  };
}

export const celebrationSpongeCakeRecipe = {
  id: 'celebration-sponge-cake',
  publicationStatus: 'published',
  source: {
    file: 'docs/content-model/celebration-cake-author-notes.md',
    locator:
      'Author-confirmed eight-egg formula, 24 cm pan, 200°C for 60–70 min, foil after 30 min, 500 g sour cream for two fillings and revised buttercream',
  },
  ...celebrationSpongeCakeContent('en'),
  translations: {
    uk: celebrationSpongeCakeContent('uk'),
    es: celebrationSpongeCakeContent('es'),
  },
} satisfies RecipeSourceDraft;
