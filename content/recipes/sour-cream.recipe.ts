import type { RecipeLocale } from './recipe.types.ts';
import type {
  RecipeSourceDraft,
  RecipeSourceDraftContent,
} from './source-recipe.types.ts';
import { quantityFromSpoons } from './spoon-weights.ts';

const copy = {
  uk: {
    title: 'Сметанний крем',
    names: ['Сметана', 'Цукор', 'Лимонний сік'],
    evidence:
      'Цей крем готували для двох прошарків торта діаметром 24 см.',
    yield: '1 порція крему',
    step: 'Приготуйте сметанний крем',
    body: 'Перемішайте сметану з цукром ложкою до однорідності. Якщо хочете більш повітряний крем, збийте його міксером або в комбайні з насадкою-вінчиком. За бажанням додайте лимонний сік: він дасть легкий аромат і підкреслить кислинку.',
    cue: 'Крем однорідний, без відчутних крупинок цукру.',
    note: 'За бажанням, для аромату й легкої кислинки.',
  },
  en: {
    title: 'Sour cream filling',
    names: ['Sour cream', 'Sugar', 'Lemon juice'],
    evidence: 'This filling has been used for two layers in a 24 cm cake.',
    yield: '1 batch of filling',
    step: 'Make the sour cream filling',
    body: 'Stir the sour cream and sugar with a spoon until smooth. For a lighter filling, beat with a hand mixer or a stand mixer fitted with a whisk. Add the optional lemon juice for a gentle citrus aroma and a little extra tang.',
    cue: 'The filling is smooth, without noticeable grains of sugar.',
    note: 'Optional, for a citrus aroma and extra tang.',
  },
  es: {
    title: 'Crema de nata agria',
    names: ['Nata agria', 'Azúcar', 'Zumo de limón'],
    evidence:
      'Esta crema se ha preparado para dos capas de relleno en una tarta de 24 cm.',
    yield: '1 tanda de crema',
    step: 'Prepara la crema de nata agria',
    body: 'Mezcla la nata agria con el azúcar con una cuchara hasta que quede homogénea. Para una crema más aireada, bate con una batidora de varillas o un robot con varillas. Si quieres, añade el zumo de limón para darle aroma y un toque más ácido.',
    cue: 'La crema está homogénea, sin granos de azúcar perceptibles.',
    note: 'Opcional, para dar aroma y un toque ácido.',
  },
} as const;

export function sourCreamContent(
  locale: RecipeLocale,
): RecipeSourceDraftContent {
  const t = copy[locale];
  return {
    presentation: 'concise',
    completeness: 'readyToReview',
    difficulty: 'easy',
    evidence: { status: 'tested', explanation: t.evidence },
    yield: {
      id: 'two-filling-layers',
      label: t.yield,
      count: { kind: 'exact', value: 1 },
      unit: 'batch',
    },
    ingredientSections: [
      {
        id: 'sour-cream',
        title: t.title,
        ingredients: [
          {
            id: 'sour-cream',
            name: t.names[0],
            quantity: {
              base: { kind: 'exact', value: 500, unit: 'g' },
              shopping: { mode: 'base' },
            },
          },
          {
            id: 'sugar',
            name: t.names[1],
            quantity: quantityFromSpoons('granulated-sugar', 3, 'tbsp'),
          },
          {
            id: 'lemon-juice',
            name: t.names[2],
            quantity: {
              base: { kind: 'exact', value: 1, unit: 'tbsp' },
              shopping: { mode: 'base' },
            },
            optional: true,
            note: t.note,
          },
        ],
      },
    ],
    steps: [
      {
        id: 'mix',
        title: t.step,
        body: t.body,
        checkpoint: t.cue,
        cookIngredients: [
          { ingredientId: 'sour-cream' },
          { ingredientId: 'sugar' },
          { ingredientId: 'lemon-juice' },
        ],
      },
    ],
  };
}

export const sourCreamRecipe = {
  id: 'sour-cream',
  publicationStatus: 'published',
  translationState: { uk: 'reviewed', en: 'reviewed', es: 'reviewed' },
  source: {
    file: 'docs/content-model/celebration-cake-author-notes.md',
    locator:
      'Author instructions, 2026-09-25: 500 g sour cream, 3 tbsp sugar, optional spoon of lemon juice',
  },
  ...sourCreamContent('en'),
  translations: { uk: sourCreamContent('uk'), es: sourCreamContent('es') },
} satisfies RecipeSourceDraft;
