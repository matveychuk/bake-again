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
      'З’єднайте тісто',
      'Спечіть бісквіт',
    ],
    bodies: [
      'Увімкніть духовку на 200°C і змастіть лише дно форми. Розділіть яйця. Збийте білки до густої білої піни, потім за 3–4 рази додайте цукор для білків, продовжуючи збивати.',
      'Додайте цукор для жовтків і збийте до світлої густої маси.',
      'Обережно вмішайте жовтки в білки ложкою, зберігаючи об’єм піни. Потім за 2–3 рази додайте борошно й обидва крохмалі, щоразу обережно перемішуючи.',
      'Перекладіть тісто у підготовлену форму й випікайте при 200°C приблизно 40–50 хвилин.',
    ],
    alts: [
      'Густа біла яєчна піна на піднятому вінчику',
      'Світла густа жовткова маса стікає з вінчика стрічкою',
      'Жовткову масу обережно вмішують у збиті білки',
      'Сухі інгредієнти додають до повітряного бісквітного тіста',
      'Бісквітне тісто переливають у довгу металеву форму',
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
    ],
    bodies: [
      'Preheat the oven to 200°C and grease only the bottom of the tin. Separate the eggs. Whip the whites to a thick white foam, then add their sugar in 3–4 additions while continuing to whip.',
      'Add the sugar for the yolks and beat until pale and thick.',
      'Gently fold the yolks into the whites with a spoon, preserving the foam’s volume. Add the flour and both starches in 2–3 additions, folding gently each time.',
      'Transfer the batter to the prepared tin and bake at 200°C for approximately 40–50 minutes.',
    ],
    alts: [
      'Thick white egg foam on a lifted whisk',
      'Pale thick yolk mixture falling from a whisk in a ribbon',
      'Yolk mixture being gently folded into whipped whites',
      'Dry ingredients being added to airy sponge batter',
      'Sponge batter being poured into a long metal tin',
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
      'Une la masa',
      'Hornea el bizcocho',
    ],
    bodies: [
      'Precalienta el horno a 200°C y engrasa solo el fondo del molde. Separa los huevos. Monta las claras hasta obtener una espuma blanca y espesa; añade su azúcar en 3–4 tandas sin dejar de batir.',
      'Añade el azúcar para las yemas y bate hasta obtener una mezcla clara y espesa.',
      'Incorpora las yemas a las claras suavemente con una cuchara, conservando el volumen. Añade la harina y los dos almidones en 2–3 tandas, mezclando con cuidado cada vez.',
      'Vierte la masa en el molde preparado y hornea a 200°C durante unos 40–50 minutos.',
    ],
    alts: [
      'Espuma blanca y espesa de claras sobre unas varillas levantadas',
      'Mezcla clara y espesa de yemas cayendo en forma de cinta',
      'Yemas incorporándose suavemente a las claras montadas',
      'Ingredientes secos añadiéndose a una masa aireada',
      'Masa de bizcocho vertiéndose en un molde metálico alargado',
    ],
    baking: 'Horneado',
  },
} as const;

function contentForLocale(locale: RecipeLocale): RecipeSourceDraftContent {
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
      totalElapsedMinutes: 60,
      phases: [
        {
          id: 'baking',
          label: text.baking,
          duration: { kind: 'range', min: 40, max: 50, unit: 'minute' },
          relatedStepId: 'bake',
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
        cookIngredients: [
          { ingredientId: 'eggs' },
          { ingredientId: 'sugar-whites' },
        ],
        media: [media('sponge-whipped-whites-v1', 'whipped-whites-v1.png', 0)],
      },
      {
        id: 'whip-yolks',
        title: text.titles[1],
        body: text.bodies[1],
        cookIngredients: [{ ingredientId: 'sugar-yolks' }],
        media: [media('sponge-whipped-yolks-v1', 'whipped-yolks-v1.png', 1)],
      },
      {
        id: 'fold-dry',
        title: text.titles[2],
        body: text.bodies[2],
        cookIngredients: [
          { ingredientId: 'corn-starch' },
          { ingredientId: 'tapioca' },
          { ingredientId: 'flour' },
        ],
        media: [
          media('sponge-fold-yolks-v1', 'fold-yolks-v1.png', 2),
          media('sponge-fold-dry-v1', 'fold-dry-v1.png', 3),
        ],
      },
      {
        id: 'bake',
        title: text.titles[3],
        body: text.bodies[3],
        media: [
          media('sponge-batter-form-v1', 'batter-in-long-form-v1.png', 4),
        ],
      },
    ],
  };
}
export const spongeCakeRecipe = {
  id: 'sponge-cake',
  publicationStatus: 'published',
  source: {
    file: 'docs/reference/recipe-inventory.xlsx',
    locator: 'Recipe Archive · Бісквіт; author-reviewed timing and yield',
  },
  ...contentForLocale('en'),
  translations: { uk: contentForLocale('uk'), es: contentForLocale('es') },
} satisfies RecipeSourceDraft;
