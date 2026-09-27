import { quantityFromGrams } from './spoon-weights.ts';
import type { RecipeLocale, Unit } from './recipe.types.ts';
import type {
  RecipeSourceDraft,
  RecipeSourceDraftContent,
} from './source-recipe.types.ts';

export const lemonFrostingScale = 200 / 227;
const copy = {
  uk: {
    title: 'Лимонний крем із маслом і вершковим сиром',
    names: [
      'Вершкове масло',
      'Вершковий сир',
      'Цукрова пудра',
      'Лимонна цедра',
      'Лимонний сік',
      'Ванільний екстракт',
    ],
    evidence:
      'Пропорції Preppy Kitchen перераховано на 200 г масла. Цю перераховану порцію ще не перевіряли на практиці.',
    yield: '1 порція крему',
    before:
      'Виходить понад 1 кг крему. Це повний пропорційний перерахунок; для тонкого покриття й кількох квіточок може знадобитися лише частина.',
    titleStep: 'Збийте лимонний крем',
    body: 'Збийте м’яке масло з вершковим сиром до однорідності. Додайте дрібну лимонну цедру й збивайте приблизно 3 хвилини. Частинами вмішайте пудру, чергуючи її з лимонним соком. Додайте ваніль і коротко збийте до пишності.',
    cue: 'Крем однорідний і тримає рельєф від насадки.',
    notes: [
      'М’яке, кімнатної температури.',
      'Щільний вершковий сир, не рідка намазка.',
      '',
      'Лише жовта частина шкірки.',
      '',
      '',
    ],
  },
  en: {
    title: 'Lemon butter and cream cheese frosting',
    names: [
      'Butter',
      'Cream cheese',
      'Icing sugar',
      'Lemon zest',
      'Lemon juice',
      'Vanilla extract',
    ],
    evidence:
      'Preppy Kitchen proportions calculated for 200 g butter. This calculated batch has not been tested.',
    yield: '1 batch of frosting',
    before:
      'This makes over 1 kg of frosting. It is a proportional calculation; a thin coating and a few piped flowers may use only part of it.',
    titleStep: 'Beat the lemon frosting',
    body: 'Beat soft butter with cream cheese until smooth. Add finely grated lemon zest and beat for about 3 minutes. Mix in icing sugar in portions, alternating with lemon juice. Add vanilla and beat briefly until fluffy.',
    cue: 'The frosting is smooth and holds a piped ridge.',
    notes: [
      'Soft, at room temperature.',
      'Firm cream cheese, not a runny spread.',
      '',
      'Yellow peel only.',
      '',
      '',
    ],
  },
  es: {
    title: 'Crema de mantequilla y queso al limón',
    names: [
      'Mantequilla',
      'Queso crema',
      'Azúcar glas',
      'Ralladura de limón',
      'Zumo de limón',
      'Extracto de vainilla',
    ],
    evidence:
      'Proporciones de Preppy Kitchen calculadas para 200 g de mantequilla. Esta cantidad recalculada aún no se ha probado.',
    yield: '1 tanda de crema',
    before:
      'Sale más de 1 kg de crema. Es un cálculo proporcional; para una capa fina y unas flores puede bastar una parte.',
    titleStep: 'Bate la crema de limón',
    body: 'Bate la mantequilla blanda con el queso crema hasta alisar. Añade la ralladura fina y bate unos 3 minutos. Incorpora el azúcar glas por tandas, alternando con el zumo. Añade la vainilla y bate brevemente hasta que quede esponjosa.',
    cue: 'La crema está lisa y conserva el relieve de la boquilla.',
    notes: [
      'Blanda, a temperatura ambiente.',
      'Queso crema firme, no una crema líquida para untar.',
      '',
      'Solo la parte amarilla de la piel.',
      '',
      '',
    ],
  },
} as const;

export function lemonCreamCheeseContent(
  locale: RecipeLocale,
): RecipeSourceDraftContent {
  const t = copy[locale];
  const quantities: Array<[string, number, Unit]> = [
    ['butter', 200, 'g'],
    ['cream-cheese', Math.round(226 * lemonFrostingScale), 'g'],
    ['powdered-sugar', Math.round(840 * lemonFrostingScale), 'g'],
    ['lemon-zest', 2.5, 'tsp'],
    ['lemon-juice', Math.round(30 * lemonFrostingScale), 'ml'],
    ['vanilla', 0.5, 'tsp'],
  ];
  return {
    presentation: 'concise',
    completeness: 'readyToReview',
    difficulty: 'easy',
    evidence: { status: 'calculated', explanation: t.evidence },
    beforeStart: [t.before],
    yield: {
      id: 'one-frosting-batch',
      label: t.yield,
      count: { kind: 'exact', value: 1 },
      unit: 'batch',
    },
    ingredientSections: [
      {
        id: 'lemon-frosting',
        title: t.title,
        ingredients: quantities.map(([id, value, unit], i) => ({
          id,
          name: t.names[i],
          quantity:
            id === 'powdered-sugar'
              ? quantityFromGrams('powdered-sugar', value)
              : {
                  base: { kind: 'exact' as const, value, unit },
                  shopping: { mode: 'base' as const },
                },
          note: t.notes[i] || undefined,
        })),
      },
    ],
    steps: [
      {
        id: 'beat-frosting',
        technique: { id: 'soften-butter' },
        title: t.titleStep,
        body: t.body,
        checkpoint: t.cue,
        cookIngredients: quantities.map(([ingredientId]) => ({ ingredientId })),
      },
    ],
  };
}

export const lemonCreamCheeseRecipe = {
  id: 'lemon-cream-cheese',
  publicationStatus: 'published',
  translationState: { uk: 'reviewed', en: 'reviewed', es: 'reviewed' },
  source: {
    file: 'https://preppykitchen.com/lemon-cake/',
    locator:
      'Lemon cream cheese frosting; factor 200/227, author screenshot matched to method image 5',
  },
  ...lemonCreamCheeseContent('en'),
  translations: {
    uk: lemonCreamCheeseContent('uk'),
    es: lemonCreamCheeseContent('es'),
  },
} satisfies RecipeSourceDraft;
