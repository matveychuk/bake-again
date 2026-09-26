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
    evidence: 'Цей універсальний рецепт глазурі успішно перевірено.',
    yield: '120 г глазурі',
    combineStep: 'З’єднайте інгредієнти в каструльці',
    combineBody:
      'У невеликій каструльці з’єднайте сметану або вершки, цукор, какао й масло.',
    combineAlt: 'Сметана, цукор, какао й шматочки масла в невеликій каструльці',
    warmStep: 'Прогрійте глазур',
    warmBody:
      'Прогрівайте на маленькому вогні, постійно помішуючи, до повної однорідності. Не доводьте до кипіння й не допускайте, щоб масло розшарувалося.',
    warmAlt:
      'Гладку шоколадну глазур помішують у каструльці на маленькому вогні',
    cue: 'Глазур гладка, без грудочок какао й нерозтопленого масла.',
  },
  en: {
    title: 'Chocolate glaze',
    names: ['Sour cream or cream', 'Sugar', 'Cocoa', 'Butter'],
    evidence: 'This versatile glaze recipe has been tested successfully.',
    yield: '120 g glaze',
    combineStep: 'Combine the ingredients in a saucepan',
    combineBody:
      'Combine the sour cream or cream, sugar, cocoa and butter in a small saucepan.',
    combineAlt:
      'Sour cream, sugar, cocoa and pieces of butter in a small saucepan',
    warmStep: 'Warm the glaze',
    warmBody:
      'Warm over low heat, stirring constantly, until completely smooth. Do not let it boil or allow the butter to separate.',
    warmAlt: 'Smooth chocolate glaze being stirred in a saucepan over low heat',
    cue: 'The glaze is smooth, without cocoa lumps or unmelted butter.',
  },
  es: {
    title: 'Glaseado de chocolate',
    names: ['Nata agria o nata', 'Azúcar', 'Cacao', 'Mantequilla'],
    evidence: 'Esta receta versátil de glaseado se ha probado con éxito.',
    yield: '120 g de glaseado',
    combineStep: 'Pon los ingredientes en un cazo',
    combineBody:
      'Pon la nata agria o nata, el azúcar, el cacao y la mantequilla en un cazo pequeño.',
    combineAlt:
      'Nata agria, azúcar, cacao y trozos de mantequilla en un cazo pequeño',
    warmStep: 'Calienta el glaseado',
    warmBody:
      'Calienta a fuego bajo, removiendo constantemente, hasta que quede completamente homogéneo. No dejes que hierva ni que la mantequilla se separe.',
    warmAlt: 'Glaseado de chocolate liso removido en un cazo a fuego bajo',
    cue: 'El glaseado está liso, sin grumos de cacao ni mantequilla sin fundir.',
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
    timing: {
      activeMinutes: 10,
      totalElapsedMinutes: null,
      phases: [],
    },
    yield: {
      id: '120g-glaze',
      label: t.yield,
      count: { kind: 'exact', value: 120 },
      unit: 'g',
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
        id: 'combine-ingredients',
        title: t.combineStep,
        body: t.combineBody,
        cookIngredients: ids.map((ingredientId) => ({ ingredientId })),
        media: [
          {
            id: 'chocolate-glaze-ingredients-v1',
            src: '/media/recipes/chocolate-glaze/selected/step-01-ingredients-v1.webp',
            alt: t.combineAlt,
          },
        ],
      },
      {
        id: 'warm-until-smooth',
        title: t.warmStep,
        body: t.warmBody,
        checkpoint: t.cue,
        media: [
          {
            id: 'chocolate-glaze-warm-until-smooth-v1',
            src: '/media/recipes/chocolate-glaze/selected/step-02-warm-until-smooth-v1.webp',
            alt: t.warmAlt,
          },
        ],
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
