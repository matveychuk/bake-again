import type { RecipeLocale } from './recipe.types.ts';
import type {
  RecipeSourceDraft,
  RecipeSourceDraftContent,
  StructuredRecipeStep,
} from './source-recipe.types.ts';
import { quantityFromGrams } from './spoon-weights.ts';

const copy = {
  uk: {
    evidence: 'Цю версію успішно готували.',
    yield: '100 лінивих вареників',
    section: 'Ліниві вареники',
    ingredients: [
      'Творог',
      'Яйця',
      'Цукор',
      'Борошно Schär Mix B Bread',
      'Тапіоковий крохмаль',
    ],
    flourNote: 'Плюс трохи для формування.',
    dusting: 'Для присипання.',
    rest: 'Відпочинок тіста',
    boil: 'Варіння після спливання',
    planning: 'Додатково {duration} на відпочинок тіста.',
    titles: [
      'Змішайте основу',
      'Додайте борошно й крохмаль',
      'Дайте тісту відпочити',
      'Сформуйте ковбаску',
      'Скачайте вареники',
      'Зваріть вареники',
    ],
    instructions: [
      'Перемішайте творог, яйця й цукор виделкою або в комбайні насадкою-тістомісом.',
      'З’єднайте борошно з тапіоковим крохмалем і вмішайте в основу. Тісто має залишитися липким — не ущільнюйте його додатковим борошном.',
      'Нещільно накрийте миску й залиште на 15–30 хвилин.',
      'Присипте поверхню й тісто борошном. Обережно розкачайте в ковбаску, не вмішуючи борошно всередину.',
      'Наріжте тісто на невеликі шматочки. Обваляйте зрізи в борошні й легко скачайте кожен шматочок між долонями в кульку.',
    ],
    cooking: [
      'Опускайте вареники в киплячу воду невеликими порціями. Обережно проведіть шумівкою по дну, щоб вони не прилипли.',
      'Коли вода знову закипить і вареники спливуть, зменште нагрів. Варіть при слабкому кипінні ще 1–2 хвилини й дістаньте шумівкою.',
    ],
    freezing: 'Для заморожування розкладіть сирі вареники в один шар на таці.',
    alts: [
      'Творог, яйця й цукор у мисці комбайна',
      'Борошно й тапіоковий крохмаль у липкому тісті',
      'Руки формують ковбаску з тіста на присипаній борошном поверхні',
      'Кульки вареників і нарізане тісто на присипаній борошном поверхні',
      'Вареники сплили у воді, один вареник на шумівці',
    ],
  },
  en: {
    evidence: 'This exact version has been cooked successfully.',
    yield: '100 lazy dumplings',
    section: 'Dumplings',
    ingredients: [
      'Cottage cheese',
      'Eggs',
      'Sugar',
      'Schär Mix B Bread flour',
      'Tapioca starch',
    ],
    flourNote: 'Plus a little for shaping.',
    dusting: 'For dusting.',
    rest: 'Dough rest',
    boil: 'Cooking after floating',
    planning: 'Allow an additional {duration} for the dough to rest.',
    titles: [
      'Mix the base',
      'Add the flour and starch',
      'Rest the dough',
      'Shape a log',
      'Roll the dumplings',
      'Boil the dumplings',
    ],
    instructions: [
      'Mix the cottage cheese, eggs and sugar with a fork or in a food processor fitted with a dough hook.',
      'Combine the flour and tapioca starch and mix into the base. The dough should stay sticky — do not add extra flour to firm it up.',
      'Cover the bowl loosely and leave for 15–30 minutes.',
      'Dust the surface and dough with flour. Gently roll into a log without kneading the dusting flour into the dough.',
      'Cut into small pieces. Coat the cut sides in flour and gently roll each piece between your palms into a ball.',
    ],
    cooking: [
      'Add the dumplings to boiling water in small batches. Gently run a skimmer over the bottom so they do not stick.',
      'When the water returns to a boil and the dumplings float, reduce the heat. Cook at a gentle boil for another 1–2 minutes, then lift out with a skimmer.',
    ],
    freezing:
      'To freeze, arrange the uncooked dumplings in a single layer on a tray.',
    alts: [
      'Cottage cheese, eggs and sugar in a food processor bowl',
      'Flour and tapioca starch in sticky cottage-cheese dough',
      'Hands shaping a dough log on a floured surface',
      'Round dumplings and cut dough on a floured surface',
      'Dumplings floating in water with one on a skimmer',
    ],
  },
  es: {
    evidence: 'Esta versión se ha preparado con éxito.',
    yield: '100 ñoquis de requesón',
    section: 'Ñoquis de requesón',
    ingredients: [
      'Requesón',
      'Huevos',
      'Azúcar',
      'Harina Schär Mix B Bread',
      'Almidón de tapioca',
    ],
    flourNote: 'Y un poco más para dar forma.',
    dusting: 'Para espolvorear.',
    rest: 'Reposo de la masa',
    boil: 'Cocción después de que suban',
    planning: 'Añade {duration} de reposo de la masa.',
    titles: [
      'Mezcla la base',
      'Añade la harina y el almidón',
      'Deja reposar la masa',
      'Forma un cilindro',
      'Forma las bolitas',
      'Cuece los ñoquis',
    ],
    instructions: [
      'Mezcla el requesón, los huevos y el azúcar con un tenedor o en un robot de cocina con gancho de amasar.',
      'Combina la harina con el almidón de tapioca e incorpóralos a la base. La masa debe quedar pegajosa; no añadas más harina para endurecerla.',
      'Cubre el bol sin apretar y deja reposar durante 15–30 minutos.',
      'Enharina la superficie y la masa. Forma un cilindro con cuidado, sin amasar la harina de espolvorear dentro de la masa.',
      'Corta en trozos pequeños. Cubre los cortes con harina y haz rodar suavemente cada trozo entre las palmas para formar una bolita.',
    ],
    cooking: [
      'Añade los ñoquis al agua hirviendo en tandas pequeñas. Pasa suavemente una espumadera por el fondo para que no se peguen.',
      'Cuando el agua vuelva a hervir y los ñoquis suban, baja el fuego. Cuécelos a hervor suave durante 1–2 minutos más y retíralos con una espumadera.',
    ],
    freezing:
      'Para congelarlos, coloca los ñoquis crudos en una sola capa sobre una bandeja.',
    alts: [
      'Requesón, huevos y azúcar en el bol de un robot de cocina',
      'Harina y almidón de tapioca en una masa pegajosa de requesón',
      'Manos formando un cilindro de masa sobre una superficie enharinada',
      'Bolitas y masa cortada sobre una superficie enharinada',
      'Ñoquis flotando en agua, con uno sobre una espumadera',
    ],
  },
} as const;

function contentForLocale(locale: RecipeLocale): RecipeSourceDraftContent {
  const text = copy[locale];
  const media = (id: string, file: string, alt: string) => [
    {
      id,
      src: `/media/recipes/lazy-dumplings/selected/${file}`,
      alt,
    },
  ];
  const steps: StructuredRecipeStep[] = [
    {
      id: 'mix-wet',
      title: text.titles[0],
      body: text.instructions[0],
      cookIngredients: [
        { ingredientId: 'cottage-cheese' },
        { ingredientId: 'eggs' },
        { ingredientId: 'sugar' },
      ],
      media: media(
        'mix-cottage-cheese',
        'step-01-mix-cottage-cheese-v1.png',
        text.alts[0],
      ),
    },
    {
      id: 'add-dry',
      title: text.titles[1],
      body: text.instructions[1],
      cookIngredients: [{ ingredientId: 'flour' }, { ingredientId: 'tapioca' }],
      media: media(
        'add-flour-tapioca',
        'step-02-add-flour-tapioca-v1.png',
        text.alts[1],
      ),
    },
    { id: 'rest', title: text.titles[2], body: text.instructions[2] },
    {
      id: 'shape-log',
      title: text.titles[3],
      body: text.instructions[3],
      cookIngredients: [
        { ingredientId: 'flour', quantity: 'omit', note: text.dusting },
      ],
      media: media('shape-dough-log', 'step-04-shape-log-v1.png', text.alts[2]),
    },
    {
      id: 'shape-dumplings',
      title: text.titles[4],
      body: text.instructions[4],
      tip: text.freezing,
      cookIngredients: [
        { ingredientId: 'flour', quantity: 'omit', note: text.dusting },
      ],
      media: media(
        'shape-round-dumplings',
        'step-05-shape-dumplings-v1.png',
        text.alts[3],
      ),
    },
    {
      id: 'cook-dumplings',
      title: text.titles[5],
      body: text.cooking.join(' '),
      cookInstructions: [...text.cooking],
      media: media(
        'boil-round-dumplings',
        'step-06-boil-dumplings-v1.png',
        text.alts[4],
      ),
    },
  ];
  return {
    completeness: 'readyToReview',
    presentation: 'concise',
    evidence: { status: 'tested', explanation: text.evidence },
    yield: {
      id: 'hundred-dumplings',
      label: text.yield,
      count: { kind: 'exact', value: 100 },
      unit: 'dumpling',
    },
    timing: {
      activeMinutes: 45,
      totalElapsedMinutes: null,
      planningNote: { text: text.planning, phaseId: 'dough-rest' },
      phases: [
        {
          id: 'dough-rest',
          label: text.rest,
          duration: { kind: 'range', min: 15, max: 30, unit: 'minute' },
          relatedStepId: 'rest',
        },
        {
          id: 'gentle-boil',
          label: text.boil,
          duration: { kind: 'range', min: 1, max: 2, unit: 'minute' },
          relatedStepId: 'cook-dumplings',
        },
      ],
    },
    ingredientSections: [
      {
        id: 'dumplings',
        title: text.section,
        ingredients: [
          {
            id: 'cottage-cheese',
            name: text.ingredients[0],
            quantity: {
              base: { kind: 'exact', value: 450, unit: 'g' },
              shopping: { mode: 'base' },
            },
          },
          {
            id: 'eggs',
            name: text.ingredients[1],
            quantity: {
              base: { kind: 'exact', value: 2, unit: 'piece' },
              shopping: { mode: 'base', increment: 1, rounding: 'up' },
            },
          },
          {
            id: 'sugar',
            name: text.ingredients[2],
            quantity: quantityFromGrams('granulated-sugar', 60),
          },
          {
            id: 'flour',
            name: text.ingredients[3],
            quantity: quantityFromGrams('schar-mix-b', 100),
            note: text.flourNote,
          },
          // Author's explicit recipe-specific measure; the shared tapioca table remains unchanged.
          {
            id: 'tapioca',
            name: text.ingredients[4],
            quantity: {
              base: { kind: 'exact', value: 7, unit: 'g' },
              equivalent: { kind: 'exact', value: 1, unit: 'tbsp' },
              shopping: { mode: 'base' },
            },
          },
        ],
      },
    ],
    steps,
  };
}

export const lazyDumplingsRecipe = {
  id: 'lazy-dumplings',
  publicationStatus: 'published',
  source: {
    file: 'docs/reference/recipe-inventory.xlsx',
    locator:
      'Recipe Archive · Ліниві вареники; author-reviewed quantities and method',
  },
  ...contentForLocale('en'),
  translations: { uk: contentForLocale('uk'), es: contentForLocale('es') },
} satisfies RecipeSourceDraft;
