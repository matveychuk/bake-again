import type { RecipeLocale } from './recipe.types.ts';
import type {
  RecipeSourceDraft,
  RecipeSourceDraftContent,
  StructuredIngredientSection,
  StructuredRecipeStep,
} from './source-recipe.types.ts';
import { quantityFromGrams, quantityFromSpoons } from './spoon-weights.ts';

const ingredientSections: StructuredIngredientSection[] = [
  {
    id: 'loaf',
    title: 'Banana bread',
    ingredients: [
      {
        id: 'bananas',
        name: 'Very ripe bananas',
        quantity: {
          base: { kind: 'exact', value: 3, unit: 'piece' },
          shopping: { mode: 'base', increment: 1, rounding: 'up' },
        },
      },
      {
        id: 'butter',
        name: 'Butter, room temperature',
        quantity: {
          base: { kind: 'exact', value: 113, unit: 'g' },
          shopping: { mode: 'base' },
        },
      },
      {
        id: 'sugar',
        name: 'Sugar',
        quantity: quantityFromGrams('granulated-sugar', 150),
      },
      {
        id: 'eggs',
        name: 'Large eggs',
        quantity: {
          base: { kind: 'exact', value: 2, unit: 'piece' },
          shopping: { mode: 'base', increment: 1, rounding: 'up' },
        },
      },
      {
        id: 'flour',
        name: 'Schär Mix B Bread flour',
        quantity: quantityFromGrams('schar-mix-b', 180),
      },
      {
        id: 'baking-powder',
        name: 'Baking powder',
        quantity: quantityFromSpoons('baking-powder', 1, 'tsp'),
      },
      {
        id: 'salt',
        name: 'Salt',
        quantity: quantityFromSpoons('fine-salt', 0.5, 'tsp'),
      },
      {
        id: 'vanilla',
        name: 'Vanilla',
        quantity: {
          base: { kind: 'exact', value: 0.5, unit: 'tsp' },
          shopping: { mode: 'base' },
        },
      },
      {
        id: 'walnuts',
        name: 'Walnuts',
        quantity: {
          base: { kind: 'exact', value: 100, unit: 'g' },
          shopping: { mode: 'base' },
        },
      },
      {
        id: 'raisins',
        name: 'Raisins',
        quantity: {
          base: { kind: 'exact', value: 150, unit: 'g' },
          shopping: { mode: 'base' },
        },
      },
    ],
  },
];

const copy = {
  uk: {
    section: 'Банановий хліб',
    yield: '1 хлібина',
    evidence: 'Цю версію успішно випікали.',
    ingredients: [
      'Дуже стиглі банани',
      'М’яке вершкове масло',
      'Цукор',
      'Великі яйця',
      'Борошно Schär Mix B Bread',
      'Розпушувач',
      'Сіль',
      'Ваніль',
      'Волоські горіхи',
      'Родзинки',
    ],
    titles: [
      'Збийте масло з цукром',
      'Додайте банани й яйця',
      'Замісіть тісто',
      'Спечіть хліб',
      'Остудіть перед нарізанням',
    ],
    instructions: [
      'Увімкніть духовку на 200°C. Форму для кексу змастіть маслом або застеліть пергаментом. Збийте м’яке масло з цукром до світлої пишної маси.',
      'Розімніть банани виделкою, залишаючи невеликі шматочки. Додайте до масляної основи разом із яйцями та ваніллю й перемішайте.',
      'Окремо змішайте борошно, розпушувач і сіль. Вмішайте лопаткою в бананову масу лише до зникнення сухих ділянок. Додайте горіхи й родзинки. Перекладіть у форму, заповнивши її не більш ніж на три чверті, та розрівняйте.',
      'Випікайте при 200°C протягом 40 хвилин. Перевірте центр шпажкою: вологі крихти допустимі, сирого тіста бути не повинно.',
      'Залиште у формі на 10 хвилин, потім вийміть і повністю остудіть на решітці. Так хліб не зминатиметься під час нарізання.',
    ],
    tip: 'Для виразнішого аромату горіхи можна підсушити на сухій пательні й остудити перед додаванням.',
    cooling: 'Охолодження у формі',
    alts: [
      'Світла пишна маса з масла й цукру в мисці',
      'Розім’яті банани з невеликими м’якими шматочками',
      'Бананове тісто з горіхами й родзинками у формі, вистеленій пергаментом',
      'Рум’яний банановий хліб зі шпажкою в центрі',
      'Остиглий банановий хліб із відрізаною скибкою, горіхами й родзинками у м’якуші',
    ],
  },
  en: {
    section: 'Banana bread',
    yield: '1 loaf',
    evidence: 'This version has been baked successfully.',
    ingredients: [
      'Very ripe bananas',
      'Softened butter',
      'Sugar',
      'Large eggs',
      'Schär Mix B Bread flour',
      'Baking powder',
      'Salt',
      'Vanilla',
      'Walnuts',
      'Raisins',
    ],
    titles: [
      'Cream the butter and sugar',
      'Add the bananas and eggs',
      'Mix the batter',
      'Bake the loaf',
      'Cool before slicing',
    ],
    instructions: [
      'Preheat the oven to 200°C. Grease a loaf tin or line it with parchment. Beat the softened butter and sugar until pale and fluffy.',
      'Mash the bananas with a fork, leaving small pieces. Add to the butter mixture with the eggs and vanilla and mix.',
      'Mix the flour, baking powder and salt separately. Fold into the banana mixture just until no dry patches remain. Add the walnuts and raisins. Transfer to the tin, filling it no more than three quarters full, and level the top.',
      'Bake at 200°C for 40 minutes. Test the centre with a skewer: moist crumbs are fine, but there should be no wet batter.',
      'Leave in the tin for 10 minutes, then remove and cool completely on a rack so the crumb does not compress when sliced.',
    ],
    tip: 'For more flavour, toast the walnuts in a dry pan and let them cool before adding.',
    cooling: 'Cooling in the tin',
    alts: [
      'Pale fluffy butter and sugar mixture in a bowl',
      'Mashed bananas with small soft pieces',
      'Banana batter with walnuts and raisins in a parchment-lined tin',
      'Golden banana loaf with a skewer in the centre',
      'Cooled banana bread with a cut slice showing walnuts and raisins',
    ],
  },
  es: {
    section: 'Pan de plátano',
    yield: '1 pan',
    evidence: 'Esta versión se ha horneado con éxito.',
    ingredients: [
      'Plátanos muy maduros',
      'Mantequilla blanda',
      'Azúcar',
      'Huevos grandes',
      'Harina Schär Mix B Bread',
      'Levadura química',
      'Sal',
      'Vainilla',
      'Nueces',
      'Pasas',
    ],
    titles: [
      'Bate la mantequilla con el azúcar',
      'Añade los plátanos y los huevos',
      'Mezcla la masa',
      'Hornea el pan',
      'Deja enfriar antes de cortar',
    ],
    instructions: [
      'Precalienta el horno a 200°C. Engrasa un molde alargado o fórralo con papel de horno. Bate la mantequilla blanda con el azúcar hasta obtener una mezcla clara y esponjosa.',
      'Machaca los plátanos con un tenedor, dejando trozos pequeños. Añádelos a la mezcla de mantequilla con los huevos y la vainilla y mezcla.',
      'Mezcla aparte la harina, la levadura química y la sal. Incorpóralas con una espátula a la mezcla de plátano solo hasta que no queden zonas secas. Añade las nueces y las pasas. Llena el molde como máximo hasta tres cuartos de su capacidad y alisa la superficie.',
      'Hornea a 200°C durante 40 minutos. Comprueba el centro con una brocheta: puede salir con migas húmedas, pero no con masa cruda.',
      'Deja reposar en el molde durante 10 minutos, desmolda y enfría por completo sobre una rejilla para que la miga no se aplaste al cortar.',
    ],
    tip: 'Para dar más aroma, tuesta las nueces en una sartén seca y deja que se enfríen antes de añadirlas.',
    cooling: 'Enfriado en el molde',
    alts: [
      'Mezcla clara y esponjosa de mantequilla y azúcar en un bol',
      'Plátanos machacados con pequeños trozos blandos',
      'Masa de plátano con nueces y pasas en un molde forrado con papel',
      'Pan de plátano dorado con una brocheta en el centro',
      'Pan de plátano frío con una rebanada que muestra nueces y pasas',
    ],
  },
} as const;

function contentForLocale(locale: RecipeLocale): RecipeSourceDraftContent {
  const text = copy[locale];
  const ids = [
    'cream-butter-and-sugar',
    'add-bananas-and-eggs',
    'combine-dry-ingredients',
    'bake-loaf',
    'cool-loaf',
  ];
  const media = [
    ['butter-and-sugar', 'step-02-butter-sugar-v1.png'],
    ['mashed-bananas', 'step-03-mashed-bananas-v1.png'],
    ['batter-in-tin', 'step-05-batter-in-tin-v1.png'],
    ['doneness-skewer', 'step-06-doneness-skewer-v1.png'],
    ['cooled-sliced-loaf', 'step-07-cooled-sliced-loaf-v1.png'],
  ];
  const ingredients = [
    ['butter', 'sugar'],
    ['bananas', 'eggs', 'vanilla'],
    ['flour', 'baking-powder', 'salt', 'walnuts', 'raisins'],
    [],
    [],
  ];
  const steps: StructuredRecipeStep[] = ids.map((id, index) => ({
    id,
    title: text.titles[index],
    body: text.instructions[index],
    ...(index === 2 ? { tip: text.tip } : {}),
    cookIngredients: ingredients[index].map((ingredientId) => ({
      ingredientId,
    })),
    media: [
      {
        id: media[index][0],
        src: `/media/recipes/banana-bread/selected/${media[index][1]}`,
        alt: text.alts[index],
      },
    ],
  }));
  return {
    completeness: 'readyToReview',
    presentation: 'concise',
    evidence: { status: 'tested', explanation: text.evidence },
    yield: {
      id: 'one-loaf',
      label: text.yield,
      count: { kind: 'exact', value: 1 },
      unit: 'cake',
    },
    geometry: {
      id: 'rectangular-loaf-tin',
      label: {
        uk: 'Прямокутна форма для кексу',
        en: 'Rectangular loaf tin',
        es: 'Molde rectangular alargado',
      }[locale],
      kind: 'bakingPan',
      application: 'bake-in',
      shape: 'rectangular',
      diameterCm: null,
      widthCm: null,
      lengthCm: null,
    },
    timing: {
      activeMinutes: 30,
      totalElapsedMinutes: 90,
      phases: [
        {
          id: 'baking',
          label: { uk: 'Випікання', en: 'Baking', es: 'Horneado' }[locale],
          duration: { kind: 'exact', value: 40, unit: 'minute' },
          relatedStepId: 'bake-loaf',
        },
        {
          id: 'cool-in-tin',
          label: text.cooling,
          duration: { kind: 'exact', value: 10, unit: 'minute' },
          relatedStepId: 'cool-loaf',
        },
      ],
    },
    ingredientSections: ingredientSections.map((section) => ({
      ...section,
      title: text.section,
      ingredients: section.ingredients.map((ingredient, index) => ({
        ...ingredient,
        name: text.ingredients[index],
      })),
    })),
    steps,
  };
}

export const bananaBreadRecipe = {
  id: 'banana-bread',
  publicationStatus: 'published',
  source: {
    file: 'docs/reference/recipe-inventory.xlsx',
    locator:
      'Recipe Archive · Банановий хліб; author-reviewed timing and method',
  },
  ...contentForLocale('en'),
  translations: { uk: contentForLocale('uk'), es: contentForLocale('es') },
} satisfies RecipeSourceDraft;
