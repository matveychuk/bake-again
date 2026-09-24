import type { RecipeLocale } from './recipe.types.ts';
import type {
  RecipeSourceDraft,
  RecipeSourceDraftContent,
} from './source-recipe.types.ts';
import { quantityFromSpoons } from './spoon-weights.ts';

const copy = {
  uk: {
    title: 'Шоколадна глазур',
    names: ['Сметана або вершки', 'Цукор', 'Какао', 'Вершкове масло'],
    evidence: 'Авторська поливка з рецепта торта з чорносливом.',
    yield: '1 порція глазурі',
    step: 'Приготуйте шоколадну глазур',
    body: 'З’єднайте в невеликій каструльці сметану або вершки, цукор, какао й масло. Прогрівайте, помішуючи, до однорідності, не доводячи до кипіння.',
    cue: 'Глазур гладка, без грудочок какао й нерозтопленого масла.',
    note: 'Температуру нанесення й потрібну кількість визначає рецепт торта: гарячу поливку не наносять безпосередньо на ніжний крем.',
  },
  en: {
    title: 'Chocolate glaze',
    names: ['Sour cream or cream', 'Sugar', 'Cocoa', 'Butter'],
    evidence: 'The author’s glaze from the prune cake recipe.',
    yield: '1 batch of glaze',
    step: 'Make the chocolate glaze',
    body: 'Combine the sour cream or cream, sugar, cocoa and butter in a small saucepan. Warm gently, stirring until smooth. Do not bring to the boil.',
    cue: 'The glaze is smooth, without cocoa lumps or unmelted butter.',
    note: 'Follow the cake recipe for the amount and application temperature: do not pour hot glaze directly onto a delicate cream filling.',
  },
  es: {
    title: 'Glaseado de chocolate',
    names: ['Nata agria o nata', 'Azúcar', 'Cacao', 'Mantequilla'],
    evidence: 'El glaseado de la autora de su tarta de ciruelas pasas.',
    yield: '1 porción de glaseado',
    step: 'Prepara el glaseado de chocolate',
    body: 'Pon la nata agria o nata, el azúcar, el cacao y la mantequilla en un cazo. Calienta suavemente, removiendo hasta que quede homogéneo. No dejes que hierva.',
    cue: 'El glaseado está liso, sin grumos de cacao ni mantequilla sin fundir.',
    note: 'La receta de la tarta indica la cantidad y la temperatura de aplicación: no viertas el glaseado caliente directamente sobre una crema delicada.',
  },
} as const;

export function chocolateGlazeContent(
  locale: RecipeLocale,
): RecipeSourceDraftContent {
  const t = copy[locale];
  const ids = ['glaze-sour-cream', 'glaze-sugar', 'glaze-cocoa', 'butter'];
  return {
    presentation: 'concise',
    completeness: 'readyToReview',
    difficulty: 'easy',
    evidence: { status: 'tested', explanation: t.evidence },
    yield: {
      id: 'one-glaze-batch',
      label: t.yield,
      count: { kind: 'exact', value: 1 },
      unit: 'batch',
    },
    ingredientSections: [
      {
        id: 'glaze',
        title: t.title,
        ingredients: [
          {
            id: ids[0],
            name: t.names[0],
            quantity: {
              base: { kind: 'exact', value: 2, unit: 'tbsp' },
              shopping: { mode: 'base' },
            },
          },
          {
            id: ids[1],
            name: t.names[1],
            quantity: quantityFromSpoons('granulated-sugar', 2, 'tbsp'),
          },
          {
            id: ids[2],
            name: t.names[2],
            quantity: quantityFromSpoons('cocoa-powder', 2, 'tbsp'),
          },
          {
            id: ids[3],
            name: t.names[3],
            quantity: {
              base: { kind: 'exact', value: 50, unit: 'g' },
              shopping: { mode: 'base' },
            },
          },
        ],
      },
    ],
    steps: [
      {
        id: 'make-glaze',
        title: t.step,
        body: t.body,
        checkpoint: t.cue,
        tip: t.note,
        cookIngredients: ids.map((ingredientId) => ({ ingredientId })),
      },
    ],
  };
}

export const chocolateGlazeRecipe = {
  id: 'chocolate-glaze',
  publicationStatus: 'published',
  source: {
    file: 'content/recipes/prune-cake.recipe.ts',
    locator:
      'Author-confirmed chocolate glaze, extracted without changing quantities',
  },
  ...chocolateGlazeContent('en'),
  translations: {
    uk: chocolateGlazeContent('uk'),
    es: chocolateGlazeContent('es'),
  },
} satisfies RecipeSourceDraft;
