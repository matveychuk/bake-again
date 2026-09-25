import type { RecipeLocale } from './recipe.types.ts';
import type {
  RecipeSourceDraft,
  RecipeSourceDraftContent,
  StructuredIngredientSection,
} from './source-recipe.types.ts';
import { quantityFromGrams, quantityFromSpoons } from './spoon-weights.ts';

const ingredientSections: StructuredIngredientSection[] = [
  {
    id: 'sponge',
    title: 'Sponge',
    ingredients: [
      {
        id: 'eggs',
        name: 'Large eggs',
        quantity: {
          base: { kind: 'exact', value: 5, unit: 'piece' },
          equivalent: { kind: 'exact', value: 6, unit: 'piece' },
          shopping: { mode: 'base', increment: 1, rounding: 'up' },
        },
      },
      {
        id: 'sugar-whites',
        name: 'Sugar for the whites',
        quantity: quantityFromGrams('granulated-sugar', 120),
      },
      {
        id: 'sugar-yolks',
        name: 'Sugar for the yolks',
        quantity: quantityFromSpoons('granulated-sugar', 2, 'tbsp'),
      },
      {
        id: 'corn-starch',
        name: 'Corn starch',
        quantity: quantityFromGrams('corn-starch', 15),
      },
      {
        id: 'tapioca',
        name: 'Tapioca starch',
        quantity: quantityFromGrams('tapioca-starch', 70),
      },
      {
        id: 'flour',
        name: 'Schär Mix B Bread flour',
        quantity: quantityFromGrams('schar-mix-b', 140),
      },
    ],
  },
];

const copy = {
  uk: {
    title: 'Бісквіт',
    yield: '1 бісквіт',
    evidence: 'Цю версію успішно випікали.',
    ingredients: [
      'Великі яйця',
      'Цукор для білків',
      'Цукор для жовтків',
      'Кукурудзяний крохмаль',
      'Тапіоковий крохмаль',
      'Борошно Schär Mix B Bread',
    ],
    eggsNote: 'Еквівалент указано для маленьких яєць.',
    titles: [
      'Збийте білки',
      'Збийте жовтки',
      'Приготуйте тісто',
      'Спечіть бісквіт',
      'Охолодіть і розріжте на коржі',
    ],
    bodies: [
      'Увімкніть духовку на 200°C. Відокремте білки від жовтків. У чистій сухій мисці збийте білки до густої білої піни — у комбайні з насадкою-вінчиком, міксером або ручним вінчиком. Продовжуючи збивати, за 3–4 рази додайте цукор для білків.',
      'В окремій мисці збийте жовтки з цукром для жовтків до світлої густої маси. Вона має стікати з вінчика широкою стрічкою.',
      'Ложкою або лопаткою обережно вмішайте жовтки у збиті білки рухами знизу вгору. Окремо змішайте борошно й обидва крохмалі. Додайте суху суміш у тісто за 2–3 рази: можна просіювати її над мискою або просто підсипати невеликими порціями. Щоразу обережно перемішуйте, лише доки зникне сухе борошно.',
      'Вистеліть дно й бортики круглої форми для торта двома листами фольги, поклавши їх навхрест і притиснувши до форми. Перекладіть тісто, злегка розрівняйте верх і випікайте при 200°C приблизно 40–50 хвилин. Наприкінці перевірте середину бісквіта зубочисткою.',
      'Коли зубочистка виходить сухою, вимкніть духовку, трохи прочиніть дверцята й залиште бісквіт усередині на 10–15 хвилин. Так він охолоне поступово — це допоможе зменшити ризик осідання. Потім дістаньте його з духовки й дайте повністю охолонути. Зніміть форму та фольгу й розріжте бісквіт горизонтально на два або три коржі.',
    ],
    whitesCheckpoint:
      'Піна густа й блискуча, тримає форму та не стікає з піднятого вінчика.',
    batterCheckpoint:
      'Тісто залишається повітряним, без сухих грудочок і смуг борошна.',
    bakeCheckpoint:
      'Зубочистка із середини бісквіта виходить сухою, без слідів сирого тіста. Якщо на ній є тісто, продовжте випікання й перевірте ще раз.',
    servingTip:
      'Для простого домашнього торта перемастіть коржі сметаною з цукром і полийте зверху шоколадною глазур’ю. Крем і глазур приготуйте окремо.',
    planningNote:
      'Після 40–50 хв випікання залиште бісквіт на 10–15 хв у вимкненій духовці. Перед розрізанням дайте йому повністю охолонути — закладіть на це додатковий час.',
    cooling: 'Поступове охолодження в духовці',
    alts: [
      'Густа біла яєчна піна на піднятому вінчику',
      'Світла густа жовткова маса стікає з вінчика стрічкою',
      'Жовткову масу обережно вмішують у збиті білки',
      'Сухі інгредієнти додають до повітряного бісквітного тіста',
      'Бісквітне тісто переливають у круглу форму, вистелену двома листами фольги навхрест',
    ],
    baking: 'Випікання',
  },
  en: {
    title: 'Sponge cake',
    yield: '1 sponge cake',
    evidence: 'This version has been baked successfully.',
    ingredients: [
      'Large eggs',
      'Sugar for the whites',
      'Sugar for the yolks',
      'Corn starch',
      'Tapioca starch',
      'Schär Mix B Bread flour',
    ],
    eggsNote: 'The equivalent quantity is for small eggs.',
    titles: [
      'Whip the whites',
      'Whip the yolks',
      'Combine the batter',
      'Bake the sponge',
      'Cool and slice into layers',
    ],
    bodies: [
      'Preheat the oven to 200°C. Separate the eggs. In a clean, dry bowl, whip the whites to a thick white foam using a stand mixer with a whisk attachment, a hand mixer or a balloon whisk. Keep whisking as you add the sugar for the whites in 3–4 batches.',
      'In a separate bowl, beat the yolks with the sugar for the yolks until pale and thick. The mixture should fall from the whisk in a broad ribbon.',
      'Gently fold the yolks into the whipped whites with a spoon or spatula, lifting the mixture from the bottom. Mix the flour and both starches in a separate bowl. Add the dry mixture to the batter in 2–3 batches, either sifting it over the bowl or sprinkling it in a little at a time. Fold gently after each addition, just until no dry flour remains.',
      'Line the base and sides of a round cake tin with two sheets of aluminium foil laid across each other at right angles, pressing them against the tin. Spoon in the batter, gently level the top and bake at 200°C for about 40–50 minutes. Towards the end, check the centre with a toothpick.',
      'Once the toothpick comes out dry, switch off the oven, leave the door slightly ajar and let the sponge sit inside for 10–15 minutes. Cooling gradually helps reduce the risk of sinking. Take it out of the oven and let it cool completely. Remove the tin and foil, then slice the sponge horizontally into two or three layers.',
    ],
    whitesCheckpoint:
      'The foam is thick and glossy, holds its shape and stays on the lifted whisk.',
    batterCheckpoint:
      'The batter is still airy, with no dry lumps or streaks of flour.',
    bakeCheckpoint:
      'A toothpick inserted into the centre comes out dry, with no raw batter. If batter clings to it, keep baking and check again.',
    servingTip:
      'For a simple homemade cake, spread sour cream mixed with sugar between the layers and pour chocolate glaze over the top. Prepare the cream and glaze separately.',
    planningNote:
      'After baking for 40–50 min, leave the sponge in the switched-off oven for 10–15 min. Allow extra time for it to cool completely before slicing.',
    cooling: 'Gradual cooling in the oven',
    alts: [
      'Thick white egg foam on a lifted whisk',
      'Pale thick yolk mixture falling from a whisk in a ribbon',
      'Yolk mixture being gently folded into whipped whites',
      'Dry ingredients being added to airy sponge batter',
      'Sponge batter being poured into a round tin lined with two crossed sheets of aluminium foil',
    ],
    baking: 'Baking',
  },
  es: {
    title: 'Bizcocho',
    yield: '1 bizcocho',
    evidence: 'Esta versión se ha horneado con éxito.',
    ingredients: [
      'Huevos grandes',
      'Azúcar para las claras',
      'Azúcar para las yemas',
      'Almidón de maíz',
      'Almidón de tapioca',
      'Harina Schär Mix B Bread',
    ],
    eggsNote: 'La cantidad equivalente corresponde a huevos pequeños.',
    titles: [
      'Monta las claras',
      'Bate las yemas',
      'Prepara la masa',
      'Hornea el bizcocho',
      'Deja enfriar y corta en capas',
    ],
    bodies: [
      'Precalienta el horno a 200°C. Separa las claras de las yemas. En un bol limpio y seco, monta las claras hasta obtener una espuma blanca y espesa con un robot de cocina con varillas, una batidora de varillas o unas varillas manuales. Añade el azúcar para las claras en 3–4 tandas sin dejar de batir.',
      'En otro bol, bate las yemas con el azúcar para las yemas hasta obtener una mezcla clara y espesa. Debe caer de las varillas formando una cinta ancha.',
      'Incorpora las yemas a las claras con una cuchara o espátula, con movimientos envolventes de abajo hacia arriba. Mezcla aparte la harina y los dos almidones. Añade esta mezcla a la masa en 2–3 tandas: puedes tamizarla sobre el bol o añadirla poco a poco sin tamizar. Mezcla con suavidad después de cada tanda, solo hasta que no quede harina seca.',
      'Forra el fondo y las paredes de un molde redondo para tartas con dos hojas de papel de aluminio colocadas en cruz, ajustándolas al molde. Vierte la masa, alisa suavemente la superficie y hornea a 200°C durante unos 40–50 minutos. Al final, comprueba el centro con un palillo.',
      'Cuando el palillo salga seco, apaga el horno, entreabre la puerta y deja el bizcocho dentro durante 10–15 minutos. Así se enfriará poco a poco y será menos probable que se hunda. Sácalo del horno y deja que se enfríe por completo. Retira el molde y el aluminio y corta el bizcocho horizontalmente en dos o tres capas.',
    ],
    whitesCheckpoint:
      'La espuma está espesa y brillante, mantiene su forma y no gotea al levantar las varillas.',
    batterCheckpoint:
      'La masa sigue aireada, sin grumos secos ni restos de harina.',
    bakeCheckpoint:
      'El palillo sale seco del centro, sin restos de masa cruda. Si tiene masa adherida, sigue horneando y vuelve a comprobar.',
    servingTip:
      'Para una tarta casera sencilla, rellena las capas con nata agria mezclada con azúcar y cubre con un glaseado de chocolate. Prepara la crema y el glaseado aparte.',
    planningNote:
      'Después de 40–50 min de horneado, deja el bizcocho 10–15 min en el horno apagado. Reserva tiempo adicional para que se enfríe por completo antes de cortarlo.',
    cooling: 'Enfriado gradual en el horno',
    alts: [
      'Espuma blanca y espesa de claras sobre unas varillas levantadas',
      'Mezcla clara y espesa de yemas cayendo en forma de cinta',
      'Yemas incorporándose suavemente a las claras montadas',
      'Ingredientes secos añadiéndose a una masa aireada',
      'Masa de bizcocho vertiéndose en un molde redondo forrado con dos hojas de aluminio en cruz',
    ],
    baking: 'Horneado',
  },
} as const;

export function spongeCakeContent(locale: RecipeLocale): RecipeSourceDraftContent {
  const text = copy[locale];
  const media = (id: string, file: string, index: number) => ({
    id,
    src: `/media/recipes/sponge-cake/selected/${file}`,
    alt: text.alts[index],
  });
  return {
    completeness: 'readyToReview',
    presentation: 'concise',
    evidence: { status: 'tested', explanation: text.evidence },
    yield: {
      id: 'one-sponge',
      label: text.yield,
      count: { kind: 'exact', value: 1 },
      unit: 'cake',
    },
    timing: {
      activeMinutes: 15,
      totalElapsedMinutes: null,
      planningNote: { text: text.planningNote },
      phases: [
        {
          id: 'baking',
          label: text.baking,
          duration: { kind: 'range', min: 40, max: 50, unit: 'minute' },
          relatedStepId: 'bake',
        },
        {
          id: 'oven-cooling',
          label: text.cooling,
          duration: { kind: 'range', min: 10, max: 15, unit: 'minute' },
          relatedStepId: 'cool-and-slice',
        },
      ],
    },
    ingredientSections: ingredientSections.map((section) => ({
      ...section,
      title: text.title,
      ingredients: section.ingredients.map((ingredient, index) => ({
        ...ingredient,
        name: text.ingredients[index],
        ...(ingredient.id === 'eggs' ? { note: text.eggsNote } : {}),
      })),
    })),
    steps: [
      {
        id: 'whip-whites',
        title: text.titles[0],
        body: text.bodies[0],
        checkpoint: text.whitesCheckpoint,
        cookIngredients: [
          { ingredientId: 'eggs' },
          { ingredientId: 'sugar-whites' },
        ],
        media: [media('sponge-whipped-whites-v1', 'whipped-whites-v1.webp', 0)],
      },
      {
        id: 'whip-yolks',
        title: text.titles[1],
        body: text.bodies[1],
        cookIngredients: [{ ingredientId: 'sugar-yolks' }],
        media: [media('sponge-whipped-yolks-v1', 'whipped-yolks-v1.webp', 1)],
      },
      {
        id: 'fold-dry',
        title: text.titles[2],
        body: text.bodies[2],
        checkpoint: text.batterCheckpoint,
        cookIngredients: [
          { ingredientId: 'corn-starch' },
          { ingredientId: 'tapioca' },
          { ingredientId: 'flour' },
        ],
        media: [
          media('sponge-fold-yolks-v1', 'fold-yolks-v1.webp', 2),
          media('sponge-fold-dry-v1', 'fold-dry-v1.webp', 3),
        ],
      },
      {
        id: 'bake',
        title: text.titles[3],
        body: text.bodies[3],
        checkpoint: text.bakeCheckpoint,
        media: [
          media(
            'sponge-batter-round-foil-v2',
            'batter-in-round-foil-v2.webp',
            4,
          ),
        ],
      },
      {
        id: 'cool-and-slice',
        title: text.titles[4],
        body: text.bodies[4],
        tip: text.servingTip,
      },
    ],
  };
}
export const spongeCakeRecipe = {
  id: 'sponge-cake',
  publicationStatus: 'published',
  source: {
    file: 'docs/reference/recipe-inventory.xlsx',
    locator:
      'Recipe Archive · Бісквіт; author-reviewed timing and yield; author clarification 2026-09-24: round tin lined with crossed foil sheets, gradual oven cooling and layer-cake serving',
  },
  ...spongeCakeContent('en'),
  translations: { uk: spongeCakeContent('uk'), es: spongeCakeContent('es') },
} satisfies RecipeSourceDraft;
