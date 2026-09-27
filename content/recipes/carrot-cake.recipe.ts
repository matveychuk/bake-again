import { localizeRecipeContent } from "./localize-content.ts";
import { carrotCakeText } from "./translations/carrot-cake.ts";
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
    planning:
      'Перед початком розігрійте духовку до 200°C у режимі верхнього й нижнього нагріву.',
    baking: 'Випікання',
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
  if (locale !== 'uk') return localizeRecipeContent(contentForLocale('uk'), carrotCakeText[locale]);
  const text = copy.uk;
  const media = (id: string, file: string, alt: string, title?: string) => ({
    id,
    src: `/media/recipes/carrot-cake/selected/${file}`,
    alt,
    ...(title ? { title } : {}),
  });
  const usages = (...ids: string[]) =>
    ids.map((ingredientId) => ({ ingredientId }));
  const stepsForLocale = (): StructuredRecipeStep[] => {
      return [
        {
          id: 'prepare-add-ins',
          title: 'Підготуйте родзинки й горіхи',
          tip: 'Увімкніть духовку на 200°C, верхній і нижній нагрів, щоб вона встигла розігрітися.',
          body: 'Залийте родзинки водою й залиште на 5 хвилин. Тим часом наріжте горіхи невеликими шматочками й переходьте до моркви.',
          cookIngredients: usages('raisins', 'nuts'),
        },
        {
          id: 'blend-carrots',
          title: 'Подрібніть моркву з олією',
          body: 'Натріть моркву, додайте олію й подрібніть усе блендером.',
          checkpoint: 'Маса гладка й однорідна, без помітних волокон моркви.',
          cookIngredients: usages('carrots', 'oil'),
          media: [
            media(
              'carrot-oil-smooth',
              'step-03-carrot-oil-smooth-v1.webp',
              text.alts[1],
            ),
          ],
        },
        {
          id: 'whip-eggs',
          title: 'Збийте яйця з цукром',
          body: 'З’єднайте яйця з цукром і збийте міксером.',
          checkpoint:
            'Маса світла й пишна, збільшилася в об’ємі у три-чотири рази. З вінчика стікає густою стрічкою.',
          cookIngredients: usages('eggs', 'sugar'),
          media: [
            media(
              'eggs-sugar-foam',
              'step-04-eggs-sugar-foam-v1.webp',
              text.alts[2],
            ),
          ],
        },
        {
          id: 'mix-batter',
          title: 'Замісіть тісто',
          body: 'Додайте до морквяної маси борошно, розпушувач і сіль. Перемішайте. Вмішайте третину збитих яєць, потім додайте решту у два прийоми. Перемішуйте лопаткою знизу догори, доки не зникнуть світлі смуги.',
          tip: 'Щоб зберегти пишність тіста, не перемішуйте його довше, ніж потрібно для однорідності.',
          cookIngredients: usages('flour', 'baking-powder', 'salt'),
        },
        {
          id: 'fold-add-ins',
          title: 'Додайте родзинки й горіхи',
          body: 'Злийте воду з родзинок, але не обсушуйте їх. Додайте родзинки й горіхи до тіста. Обережно перемішайте лопаткою, щоб рівномірно розподілити їх.',
          tip: 'Якщо готуєте заздалегідь, тісто можна зберігати в холодильнику до трьох днів.',
          cookIngredients: usages('raisins', 'nuts'),
          media: [
            media(
              'batter-add-ins',
              'step-06-batter-add-ins-v1.webp',
              text.alts[3],
            ),
          ],
        },
        {
          id: 'bake',
          title: 'Спечіть кекс',
          body: 'Дно високої форми застеліть пергаментом, боки змастіть маслом і присипте корицею. Викладіть тісто у форму. Поставте в розігріту до 200°C духовку, верхній і нижній нагрів. Випікайте 35–40 хвилин.',
          checkpoint:
            'Встроміть зубочистку в центр кексу: якщо вона виходить повністю сухою, кекс готовий. Дістаньте його з духовки й вийміть із форми.',
          cookIngredients: usages('pan-butter', 'pan-cinnamon'),
          media: [
            media(
              'batter-in-pan',
              'step-07-batter-in-pan-v1.webp',
              text.alts[4],
              text.bakingImages[0],
            ),
            media(
              'dry-toothpick',
              'step-07-dry-toothpick-v1.webp',
              text.alts[5],
              text.bakingImages[1],
            ),
          ],
        },
      ];

  };
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
    steps: stepsForLocale(),
  };
}

export const carrotCakeRecipe = {
  id: 'carrot-cake',
  publicationStatus: 'published',
  translationState: { uk: 'reviewed', en: 'reviewed', es: 'reviewed' },
  source: {
    file: 'docs/reference/recipe-inventory.xlsx',
    locator:
      'Recipe Archive · Морквяний кекс; author-reviewed one-cake quantities and method',
  },
  ...contentForLocale('en'),
  translations: { uk: contentForLocale('uk'), es: contentForLocale('es') },
} satisfies RecipeSourceDraft;
