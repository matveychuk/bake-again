import type { RecipeLocale, IngredientQuantity } from './recipe.types.ts';
import type {
  RecipeSourceDraft,
  RecipeSourceDraftContent,
} from './source-recipe.types.ts';
import { spongeCakeContent } from './sponge-cake.recipe.ts';
import { sourCreamContent } from './sour-cream.recipe.ts';
import { lemonCreamCheeseContent } from './lemon-cream-cheese.recipe.ts';
import { chocolateGlazeContent } from './chocolate-glaze.recipe.ts';
import {
  quantityFromGrams,
  type SpoonWeightIngredient,
} from './spoon-weights.ts';
import { recipePart } from './recipe-part.ts';

const copy = {
  uk: {
    yield: '1 високий торт · 24 см · 3 коржі',
    sponge: 'Бісквіт',
    creams: 'Креми',
    assembly: 'Збирання й оздоблення',
    evidence:
      'Авторка випікала торт на 8 яйцях у формі 24 см. Порцію лимонного крему на 200 г масла перераховано; точну кількість пудри ще уточнюємо.',
    pending:
      'Перед приготуванням потрібно уточнити температуру й загальний час випікання високого бісквіта.',
    plan: 'Спочатку спечіть і повністю охолодіть бісквіт. Поки він холоне, приготуйте креми. Потім зберіть торт, охолодіть покриття, додайте глазур і прикраси.',
    frostingNote:
      'Лимонний крем наведено повною перерахованою порцією — понад 1 кг. Для тонкого покриття боків і квіточок використайте потрібну частину.',
    salt: 'Сіль',
    vanilla: 'Ваніль',
    taste: 'За смаком; авторка не зазначила точної кількості.',
    fruit: 'Фрукти або ягоди',
    decor: 'Оздоблення',
    fruitNote: 'Для верху та, за бажанням, обох прошарків.',
    vanillaStep: 'Додайте ваніль до жовтків, а сіль — до сухої суміші.',
    bake: 'Вистеліть дно й бортики круглої форми діаметром 24 см двома листами фольги навхрест. Перекладіть тісто та розрівняйте. Через 30 хвилин випікання вільно покладіть зверху шматок фольги, щоб верх не пересмажився, поки середина допікається. Продовжуйте до сухої зубочистки. Температуру й загальну тривалість ще уточнюємо.',
    cool: 'Коли зубочистка із середини виходить сухою, вимкніть духовку, трохи прочиніть дверцята й залиште бісквіт на 10–15 хвилин. Дістаньте й повністю охолодіть. Зніміть форму та фольгу, а тоді розріжте горизонтально на три коржі.',
    fillTitle: 'Перемастіть три коржі',
    fill: 'Покладіть нижній корж на тарілку й розподіліть на ньому половину сметанного крему. Накрийте другим коржем, додайте решту крему й покладіть третій. За бажанням додайте в кожен прошарок фрукти чи ягоди — помиті, добре обсушені та нарізані невеликими шматочками.',
    fillCue: 'Коржі лежать рівно, крем розподілений між двома прошарками.',
    coatTitle: 'Покрийте боки кремом',
    coat: 'Відкладіть частину лимонного крему в кондитерський мішок для квіточок. Рештою за потреби тонко покрийте боки торта. Поставте торт у холодильник, щоб покриття стало стійкішим перед глазуруванням.',
    glazeTitle: 'Полийте торт глазур’ю',
    glaze:
      'Дайте глазурі охолонути до ледь теплої: вона має ще текти, але не розтоплювати крем. Спершу зробіть пробний потік на охолодженому боці, потім полийте верх і обережно підведіть глазур до країв, щоб утворилися потьоки.',
    decorateTitle: 'Прикрасьте фруктами й квіточками',
    decorate:
      'Коли глазур уже не тепла, відсадіть квіточки з лимонного крему й викладіть зверху добре обсушені фрукти або ягоди. Тримайте готовий торт у холодильнику до подачі.',
    cooling: 'Охолодження у вимкненій духовці',
    foil: 'Накрити верх фольгою',
    cutAlt:
      'Приклад розрізу: три бісквітні коржі, два сметанні прошарки й шоколадна глазур',
    generated:
      'Згенерований приклад збирання; не фото розрізу авторського торта.',
    authorAlt:
      'Авторський торт із шоколадною глазур’ю, полуницею, лохиною, виноградом і кремовими квіточками',
    edited: 'Фото авторки; фон і тарілку змінено за допомогою ШІ.',
    video: 'Авторське відео готового торта',
    videoNote: 'Короткий огляд торта до зміни фону на фотографіях.',
  },
  en: {
    yield: '1 tall cake · 24 cm · 3 sponge layers',
    sponge: 'Sponge',
    creams: 'Creams',
    assembly: 'Assembly and decoration',
    evidence:
      'The author baked this 8-egg cake in a 24 cm tin. The lemon frosting batch with 200 g butter is calculated; the exact sugar amount is still being confirmed.',
    pending:
      'Confirm the oven temperature and total baking time for this tall sponge before cooking.',
    plan: 'Bake and fully cool the sponge first. Make the creams while it cools. Assemble, chill the coating, then add glaze and decorations.',
    frostingNote:
      'The lemon frosting is a full calculated batch of over 1 kg. Use as much as needed for a thin side coating and piped flowers.',
    salt: 'Salt',
    vanilla: 'Vanilla',
    taste: 'To taste; the author did not specify an amount.',
    fruit: 'Fruit or berries',
    decor: 'Decoration',
    fruitNote: 'For the top and, optionally, both filling layers.',
    vanillaStep: 'Add vanilla to the yolks and salt to the dry mixture.',
    bake: 'Line the base and sides of a 24 cm round tin with two crossed sheets of foil. Add and level the batter. After 30 minutes of baking, loosely lay a piece of foil over the top so it does not overbrown while the middle finishes baking. Continue until a toothpick comes out dry. Oven temperature and total baking time are still being confirmed.',
    cool: 'Once a toothpick from the centre comes out dry, turn off the oven, leave the door slightly open and keep the sponge inside for 10–15 minutes. Remove and cool completely. Remove the tin and foil, then slice horizontally into three layers.',
    fillTitle: 'Fill the three sponge layers',
    fill: 'Place the bottom layer on a plate and spread half the sour cream filling over it. Add the middle layer and remaining filling, then the top layer. Optionally add washed, well-dried fruit or berries, cut into small pieces, to each filling layer.',
    fillCue:
      'The layers sit level, with the filling shared between the two gaps.',
    coatTitle: 'Coat the sides',
    coat: 'Reserve some lemon frosting in a piping bag for flowers. Use as much of the remaining frosting as needed to coat the sides thinly. Refrigerate until the coating is firmer before glazing.',
    glazeTitle: 'Glaze the cake',
    glaze:
      'Let the glaze cool until barely warm: it should still flow without melting the cream. Try one drip on the chilled side first. Pour over the top and gently guide it towards the edges to create drips.',
    decorateTitle: 'Decorate with fruit and flowers',
    decorate:
      'Once the glaze is no longer warm, pipe lemon frosting flowers and arrange well-dried fruit or berries on top. Refrigerate the finished cake until serving.',
    cooling: 'Cooling in the switched-off oven',
    foil: 'Cover the top with foil',
    cutAlt:
      'Illustrative cut cake with three sponge layers, two sour cream fillings and chocolate glaze',
    generated:
      'Generated assembly example, not a photograph of the author’s cake cut open.',
    authorAlt:
      'The author’s cake with chocolate glaze, strawberries, blueberries, grapes and piped flowers',
    edited: 'Author photo; background and plate edited with AI.',
    video: 'Author video of the finished cake',
    videoNote:
      'A short view of the original cake before the photo background edits.',
  },
  es: {
    yield: '1 tarta alta · 24 cm · 3 capas de bizcocho',
    sponge: 'Bizcocho',
    creams: 'Cremas',
    assembly: 'Montaje y decoración',
    evidence:
      'La autora horneó esta tarta de 8 huevos en un molde de 24 cm. La crema de limón con 200 g de mantequilla es un cálculo; falta confirmar el azúcar exacto.',
    pending:
      'Antes de preparar la tarta, falta confirmar la temperatura y el tiempo total de horneado del bizcocho alto.',
    plan: 'Hornea y enfría por completo el bizcocho. Prepara las cremas mientras se enfría. Monta la tarta, enfría la cobertura y añade el glaseado y los adornos.',
    frostingNote:
      'La crema de limón es una tanda proporcional de más de 1 kg. Usa lo necesario para cubrir los lados con una capa fina y hacer flores.',
    salt: 'Sal',
    vanilla: 'Vainilla',
    taste: 'Al gusto; la autora no indicó una cantidad.',
    fruit: 'Fruta o frutos rojos',
    decor: 'Decoración',
    fruitNote: 'Para la superficie y, si quieres, ambas capas de relleno.',
    vanillaStep: 'Añade vainilla a las yemas y sal a la mezcla seca.',
    bake: 'Forra el fondo y los lados de un molde redondo de 24 cm con dos hojas de aluminio cruzadas. Vierte y nivela la masa. Tras 30 minutos de horneado, coloca una hoja de aluminio suelta encima para que no se dore demasiado mientras se cuece el centro. Sigue hasta que un palillo salga seco. Falta confirmar la temperatura y el tiempo total.',
    cool: 'Cuando el palillo del centro salga seco, apaga el horno, entreabre la puerta y deja el bizcocho dentro 10–15 minutos. Sácalo y deja enfriar por completo. Retira el molde y el aluminio y corta horizontalmente en tres capas.',
    fillTitle: 'Rellena las tres capas',
    fill: 'Pon la capa inferior en un plato y extiende la mitad de la crema de nata agria. Añade la segunda capa, el resto de la crema y la tercera capa. Si quieres, añade a cada relleno fruta lavada, bien seca y cortada en trocitos.',
    fillCue:
      'Las capas están niveladas y la crema repartida entre los dos rellenos.',
    coatTitle: 'Cubre los lados con crema',
    coat: 'Reserva crema de limón en una manga para las flores. Usa la cantidad necesaria del resto para cubrir los lados con una capa fina. Refrigera hasta que la cobertura esté más firme antes de glasear.',
    glazeTitle: 'Añade el glaseado',
    glaze:
      'Deja enfriar el glaseado hasta que esté apenas templado: debe fluir sin derretir la crema. Prueba primero una gota en el lateral frío. Viértelo sobre la superficie y guíalo hacia los bordes para que caigan algunos chorritos.',
    decorateTitle: 'Decora con fruta y flores',
    decorate:
      'Cuando el glaseado ya no esté templado, forma flores con la crema de limón y coloca fruta bien seca encima. Guarda la tarta en la nevera hasta servir.',
    cooling: 'Enfriado en el horno apagado',
    foil: 'Cubrir con aluminio',
    cutAlt:
      'Ejemplo de corte con tres capas de bizcocho, dos rellenos de nata agria y glaseado de chocolate',
    generated:
      'Ejemplo de montaje generado; no es una foto del corte de la tarta de la autora.',
    authorAlt:
      'Tarta de la autora con chocolate, fresas, arándanos, uvas y flores de crema',
    edited: 'Foto de la autora; fondo y plato editados con IA.',
    video: 'Vídeo de la autora de la tarta terminada',
    videoNote:
      'Vista breve de la tarta original antes de editar el fondo de las fotos.',
  },
} as const;

export function celebrationSpongeCakeContent(
  locale: RecipeLocale,
): RecipeSourceDraftContent {
  const t = copy[locale];
  const base = spongeCakeContent(locale);
  const amounts: Record<string, IngredientQuantity['base']> = {
    eggs: { kind: 'exact', value: 8, unit: 'piece' },
    'sugar-whites': { kind: 'exact', value: 150, unit: 'g' },
    'sugar-yolks': { kind: 'exact', value: 75, unit: 'g' },
    flour: { kind: 'exact', value: 225, unit: 'g' },
    'corn-starch': { kind: 'range', min: 24, max: 25, unit: 'g' },
    tapioca: { kind: 'range', min: 10, max: 12, unit: 'g' },
  };
  const weights: Record<string, SpoonWeightIngredient> = {
    'sugar-whites': 'granulated-sugar',
    'sugar-yolks': 'granulated-sugar',
    flour: 'schar-mix-b',
    'corn-starch': 'corn-starch',
    tapioca: 'tapioca-starch',
  };
  const quantity = (id: string): IngredientQuantity => {
    const amount = amounts[id]!;
    if (!weights[id])
      return {
        base: amount,
        shopping: { mode: 'base', increment: 1, rounding: 'up' },
      };
    if (amount.kind === 'exact')
      return quantityFromGrams(weights[id], amount.value);
    const low = quantityFromGrams(weights[id], amount.min).equivalent!;
    const high = quantityFromGrams(weights[id], amount.max).equivalent!;
    return {
      base: amount,
      equivalent: {
        kind: 'range',
        min: low.kind === 'exact' ? low.value : 0,
        max: high.kind === 'exact' ? high.value : 0,
        unit: low.unit,
      },
      shopping: { mode: 'base' },
    };
  };
  const sponge = recipePart(
    {
      ...base,
      ingredientSections: base.ingredientSections.map((section) => ({
        ...section,
        ingredients: [
          ...section.ingredients.map((ingredient) => ({
            ...ingredient,
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
        meta: t.sponge,
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
  const frosting = recipePart(lemonCreamCheeseContent(locale), 'frosting');
  const glaze = recipePart(chocolateGlazeContent(locale), 'glaze');
  const path = '/media/recipes/celebration-sponge-cake/selected/';
  return {
    presentation: 'concise',
    completeness: 'incompleteSource',
    difficulty: 'medium',
    evidence: { status: 'calculated', explanation: t.evidence },
    gapNote: t.pending,
    beforeStart: [t.pending, t.frostingNote],
    relatedRecipes: [
      'sponge-cake',
      'sour-cream',
      'lemon-cream-cheese',
      'chocolate-glaze',
    ],
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
      activeMinutes: null,
      totalElapsedMinutes: null,
      planningNote: { text: t.plan },
      phases: [
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
      ...frosting.ingredientSections,
      ...glaze.ingredientSections,
      {
        id: 'decoration',
        title: t.decor,
        ingredients: [
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
      ...frosting.steps.map((step) => ({ ...step, meta: t.creams })),
      {
        id: 'fill',
        meta: t.assembly,
        title: t.fillTitle,
        body: t.fill,
        checkpoint: t.fillCue,
        cookIngredients: [{ ingredientId: 'fruit' }],
        media: [
          {
            id: 'three-layer-example',
            src: `${path}three-layer-cutaway-v1.png`,
            alt: t.cutAlt,
            caption: t.generated,
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
            src: `${path}author-cake-overhead-v1.png`,
            alt: t.authorAlt,
            caption: t.edited,
          },
          {
            id: 'author-video',
            type: 'video',
            src: `${path}author-cake-overview-v1.mp4`,
            alt: t.video,
            title: t.video,
            caption: t.videoNote,
          },
        ],
      },
    ],
  };
}

export const celebrationSpongeCakeRecipe = {
  id: 'celebration-sponge-cake',
  publicationStatus: 'unpublished',
  source: {
    file: 'docs/content-model/celebration-cake-author-notes.md',
    locator:
      'Author-confirmed eight-egg formula, 24 cm pan, foil after 30 min, 500 g sour cream for two fillings; baking temperature pending',
  },
  ...celebrationSpongeCakeContent('en'),
  translations: {
    uk: celebrationSpongeCakeContent('uk'),
    es: celebrationSpongeCakeContent('es'),
  },
} satisfies RecipeSourceDraft;
