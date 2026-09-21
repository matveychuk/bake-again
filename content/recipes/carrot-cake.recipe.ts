import type { IngredientQuantity, RecipeLocale } from './recipe.types.ts';
import type {
  RecipeSourceDraft,
  RecipeSourceDraftContent,
  StructuredRecipeStep,
} from './source-recipe.types.ts';
import { quantityFromGrams } from './spoon-weights.ts';

const copy = {
  uk: {
    evidence: 'Цю версію успішно випікали.',
    yield: '1 кекс',
    section: 'Морквяний кекс',
    ingredients: [
      'Морква',
      'Олія без запаху',
      'Яйця',
      'Цукор',
      'Борошно Schär Mix B Bread',
      'Розпушувач',
      'Сіль',
      'Волоські горіхи або пекан',
      'Родзинки',
      'Вершкове масло для форми',
      'Кориця для форми',
    ],
    planning: 'Заздалегідь замочіть родзинки.',
    baking: 'Випікання',
    titles: [
      'Підготуйте духовку й форму',
      'Підготуйте родзинки й горіхи',
      'Перебийте моркву з олією',
      'Збийте яйця з цукром',
      'Змішайте тісто',
      'Вмішайте родзинки й горіхи',
      'Спечіть кекс',
    ],
    instructions: [
      'Розігрійте духовку до 200°C, верхній і нижній нагрів. Дно високої форми застеліть пергаментом, боки змастіть маслом і присипте корицею.',
      'Злийте воду із замочених родзинок, але не просушуйте їх. Подрібніть горіхи, залишаючи невеликі шматочки.',
      'Натріть моркву й перебийте блендером з олією до гладкої маси без помітних волокон.',
      'Збийте до густої світлої піни, що збільшилася в об’ємі у три-чотири рази.',
      'Вмішайте борошно, розпушувач і сіль у морквяну масу. Додайте третину яєчної піни й перемішайте. Решту введіть лопаткою у два прийоми, рухами знизу догори, лише до зникнення світлих смуг.',
      'Обережно розподіліть родзинки й горіхи в тісті.',
      'Викладіть тісто у форму. Випікайте при 200°C, верхній і нижній нагрів, 35–40 хвилин. Перевірте центр зубочисткою — вона має вийти сухою.',
    ],
    storage: 'Тісто можна зберігати в холодильнику до трьох днів.',
    alts: [
      'Висока форма з пергаментом на дні й боками, змащеними маслом та присипаними корицею',
      'Гладка помаранчева маса з моркви й олії біля занурювального блендера',
      'Густа світла піна з яєць і цукру стікає стрічкою з вінчика',
      'Морквяне тісто з родзинками й подрібненими горіхами',
      'Сире морквяне тісто у високій формі для кексу',
      'Спечений морквяний кекс і суха зубочистка, вийнята з центру',
    ],
    bakingImages: ['Перед випіканням', 'Готовий кекс'],
  },
  en: {
    evidence: 'This exact version has been baked successfully.',
    yield: '1 cake',
    section: 'Carrot cake',
    ingredients: [
      'Carrots',
      'Neutral oil',
      'Eggs',
      'Sugar',
      'Schär Mix B Bread flour',
      'Baking powder',
      'Salt',
      'Walnuts or pecans',
      'Raisins',
      'Butter for the pan',
      'Cinnamon for the pan',
    ],
    planning: 'Soak the raisins in advance.',
    baking: 'Baking',
    titles: [
      'Prepare the oven and pan',
      'Prepare the raisins and nuts',
      'Blend the carrots with oil',
      'Whip the eggs and sugar',
      'Mix the batter',
      'Fold in the raisins and nuts',
      'Bake the cake',
    ],
    instructions: [
      'Preheat the oven to 200°C with top-and-bottom heat. Line the bottom of a tall pan with parchment, butter the sides and dust them with cinnamon.',
      'Drain the soaked raisins without drying them. Chop the nuts, leaving small pieces.',
      'Grate the carrots, then blend with the oil until smooth, with no visible carrot strands.',
      'Beat to a thick, pale foam, three to four times its original volume.',
      'Mix the flour, baking powder and salt into the carrot mixture. Stir in one third of the egg foam. Fold in the rest in two additions with a spatula, stopping as soon as no pale streaks remain.',
      'Gently distribute the raisins and nuts through the batter.',
      'Transfer the batter to the pan. Bake at 200°C with top-and-bottom heat for 35–40 minutes. A toothpick inserted into the centre should come out dry.',
    ],
    storage: 'The batter can be refrigerated for up to three days.',
    alts: [
      'Tall pan with parchment on the bottom and buttered, cinnamon-dusted sides',
      'Smooth orange carrot and oil puree beside an immersion blender',
      'Thick pale egg and sugar foam falling in a ribbon from a whisk',
      'Carrot batter with raisins and chopped nuts',
      'Raw carrot batter in a tall loaf pan',
      'Baked carrot cake and a dry toothpick lifted from the centre',
    ],
    bakingImages: ['Before baking', 'Baked cake'],
  },
  es: {
    evidence: 'Esta versión se ha horneado con éxito.',
    yield: '1 bizcocho',
    section: 'Bizcocho de zanahoria',
    ingredients: [
      'Zanahorias',
      'Aceite neutro',
      'Huevos',
      'Azúcar',
      'Harina Schär Mix B Bread',
      'Levadura química',
      'Sal',
      'Nueces o pacanas',
      'Pasas',
      'Mantequilla para el molde',
      'Canela para el molde',
    ],
    planning: 'Remoja las pasas con antelación.',
    baking: 'Horneado',
    titles: [
      'Prepara el horno y el molde',
      'Prepara las pasas y las nueces',
      'Tritura las zanahorias con aceite',
      'Bate los huevos con el azúcar',
      'Mezcla la masa',
      'Incorpora las pasas y las nueces',
      'Hornea el bizcocho',
    ],
    instructions: [
      'Precalienta el horno a 200 °C con calor arriba y abajo. Forra el fondo de un molde alto con papel de horno, unta los lados con mantequilla y espolvoréalos con canela.',
      'Escurre las pasas remojadas sin secarlas. Pica las nueces dejando trozos pequeños.',
      'Ralla las zanahorias y tritúralas con el aceite hasta obtener una mezcla lisa, sin hebras visibles.',
      'Bate hasta obtener una espuma espesa y clara, entre tres y cuatro veces su volumen inicial.',
      'Mezcla la harina, la levadura química y la sal con la zanahoria. Incorpora un tercio de la espuma de huevo. Añade el resto en dos tandas con una espátula y movimientos envolventes, solo hasta que desaparezcan las vetas claras.',
      'Reparte suavemente las pasas y las nueces por la masa.',
      'Pasa la masa al molde. Hornea a 200 °C con calor arriba y abajo durante 35–40 minutos. Un palillo insertado en el centro debe salir seco.',
    ],
    storage: 'Puedes guardar la masa en el frigorífico hasta tres días.',
    alts: [
      'Molde alto con papel en el fondo y lados untados con mantequilla y espolvoreados con canela',
      'Puré liso de zanahoria y aceite junto a una batidora de mano',
      'Espuma espesa y clara de huevo y azúcar cayendo en forma de cinta de unas varillas',
      'Masa de zanahoria con pasas y nueces picadas',
      'Masa cruda de zanahoria en un molde alto',
      'Bizcocho de zanahoria horneado y un palillo seco retirado del centro',
    ],
    bakingImages: ['Antes de hornear', 'Bizcocho horneado'],
  },
} as const;

const exact = (value: number, unit: 'g' | 'ml'): IngredientQuantity => ({
  base: { kind: 'exact', value, unit },
  shopping: { mode: 'base' },
});
const ingredientData: Array<{ id: string; quantity: IngredientQuantity }> = [
  { id: 'carrots', quantity: exact(200, 'g') },
  { id: 'oil', quantity: exact(100, 'ml') },
  {
    id: 'eggs',
    quantity: {
      base: { kind: 'exact', value: 3, unit: 'piece' },
      shopping: { mode: 'base', increment: 1, rounding: 'up' },
    },
  },
  { id: 'sugar', quantity: quantityFromGrams('granulated-sugar', 100) },
  { id: 'flour', quantity: quantityFromGrams('schar-mix-b', 170) },
  { id: 'baking-powder', quantity: quantityFromGrams('baking-powder', 5) },
  { id: 'salt', quantity: quantityFromGrams('fine-salt', 1.5) },
  { id: 'nuts', quantity: exact(100, 'g') },
  { id: 'raisins', quantity: exact(80, 'g') },
  {
    id: 'pan-butter',
    quantity: { base: null, shopping: { mode: 'nameOnly' } },
  },
  {
    id: 'pan-cinnamon',
    quantity: { base: null, shopping: { mode: 'nameOnly' } },
  },
];

function contentForLocale(locale: RecipeLocale): RecipeSourceDraftContent {
  const text = copy[locale];
  const media = (id: string, file: string, alt: string, title?: string) => ({
    id,
    src: `/media/recipes/carrot-cake/selected/${file}`,
    alt,
    ...(title ? { title } : {}),
  });
  const usages = (...ids: string[]) =>
    ids.map((ingredientId) => ({ ingredientId }));
  const steps: StructuredRecipeStep[] = [
    {
      id: 'prepare-pan',
      title: text.titles[0],
      body: text.instructions[0],
      cookIngredients: usages('pan-butter', 'pan-cinnamon'),
      media: [
        media('prepared-pan', 'step-02-prepared-pan-v1.png', text.alts[0]),
      ],
    },
    {
      id: 'prepare-add-ins',
      title: text.titles[1],
      body: text.instructions[1],
      cookIngredients: usages('raisins', 'nuts'),
    },
    {
      id: 'blend-carrots',
      title: text.titles[2],
      body: text.instructions[2],
      cookIngredients: usages('carrots', 'oil'),
      media: [
        media(
          'carrot-oil-smooth',
          'step-03-carrot-oil-smooth-v1.png',
          text.alts[1],
        ),
      ],
    },
    {
      id: 'whip-eggs',
      title: text.titles[3],
      body: text.instructions[3],
      cookIngredients: usages('eggs', 'sugar'),
      media: [
        media(
          'eggs-sugar-foam',
          'step-04-eggs-sugar-foam-v1.png',
          text.alts[2],
        ),
      ],
    },
    {
      id: 'mix-batter',
      title: text.titles[4],
      body: text.instructions[4],
      cookIngredients: usages('flour', 'baking-powder', 'salt'),
    },
    {
      id: 'fold-add-ins',
      title: text.titles[5],
      body: text.instructions[5],
      tip: text.storage,
      cookIngredients: usages('raisins', 'nuts'),
      media: [
        media('batter-add-ins', 'step-06-batter-add-ins-v1.png', text.alts[3]),
      ],
    },
    {
      id: 'bake',
      title: text.titles[6],
      body: text.instructions[6],
      media: [
        media(
          'batter-in-pan',
          'step-07-batter-in-pan-v1.png',
          text.alts[4],
          text.bakingImages[0],
        ),
        media(
          'dry-toothpick',
          'step-07-dry-toothpick-v1.png',
          text.alts[5],
          text.bakingImages[1],
        ),
      ],
    },
  ];
  return {
    completeness: 'readyToReview',
    presentation: 'concise',
    evidence: { status: 'tested', explanation: text.evidence },
    yield: {
      id: 'one-cake',
      label: text.yield,
      count: { kind: 'exact', value: 1 },
      unit: 'cake',
    },
    timing: {
      activeMinutes: 30,
      totalElapsedMinutes: null,
      planningNote: { text: text.planning },
      phases: [
        {
          id: 'baking',
          label: text.baking,
          duration: { kind: 'range', min: 35, max: 40, unit: 'minute' },
          relatedStepId: 'bake',
        },
      ],
    },
    ingredientSections: [
      {
        id: 'cake',
        title: text.section,
        ingredients: ingredientData.map((ingredient, index) => ({
          ...ingredient,
          name: text.ingredients[index],
        })),
      },
    ],
    steps,
  };
}

export const carrotCakeRecipe = {
  id: 'carrot-cake',
  publicationStatus: 'published',
  source: {
    file: 'docs/reference/recipe-inventory.xlsx',
    locator:
      'Recipe Archive · Морквяний кекс; author-reviewed one-cake quantities and method',
  },
  ...contentForLocale('en'),
  translations: { uk: contentForLocale('uk'), es: contentForLocale('es') },
} satisfies RecipeSourceDraft;
