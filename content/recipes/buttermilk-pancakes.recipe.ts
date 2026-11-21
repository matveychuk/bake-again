import type {
  IngredientQuantity,
  LocalizedText,
  Provenance,
  Recipe,
  Unit,
} from './recipe.types.ts';
import {
  pancakeCampaign,
  pancakeHeroMediaId,
} from '../articles/pancake-invitation.ts';
import { quantityFromGrams, quantityFromSpoons } from './spoon-weights.ts';

const sourceId = 'the-loopy-whisk-buttermilk-pancakes';
const sourceUrl =
  'https://theloopywhisk.com/2022/08/26/gluten-free-buttermilk-pancakes/';
const testSourceId = 'milk-pancakes-bake-again-test';
const tested: Provenance = {
  state: 'tested',
  sourceIds: [testSourceId],
};

// The draft keeps Ukrainian copy in every locale until translations are requested.
function uk(text: string): LocalizedText {
  return { uk: text, en: text, es: text };
}

function measured(value: number, unit: Unit): IngredientQuantity {
  return { base: { kind: 'exact', value, unit }, shopping: { mode: 'base' } };
}

const title = uk('Безглютенові панкейки на молоці');
const flourName = uk('Schär Mix B Bread');

export const buttermilkPancakesRecipe = {
  schemaVersion: 3,
  id: 'buttermilk-pancakes',
  versionId: 'milk-pancakes-tested-v1',
  routeSlug: 'buttermilk-pancakes',
  publicationStatus: 'unpublished',
  translationState: { uk: 'sourceDraft', en: 'sourceDraft', es: 'sourceDraft' },
  // Keep the first draft's URL as an alias for the updated recipe.
  slug: {
    ...uk('buttermilk-pancakes'),
    uk: 'bezghliutenovi-pankeiky-na-masliantsi',
  },
  title,
  summary: uk('Пухкі панкейки з рум’яною скоринкою.'),
  categoryIds: [],
  situationIds: [],
  difficulty: 'easy',
  baseProvenance: tested,
  evidenceExplanation: uk(
    'Перевірено в Bake Again на молоці та суміші Schär Mix B Bread, на сковороді 28 см.',
  ),
  translationReview: {
    date: '2026-11-21',
    reviewer: 'implementation',
    scope:
      'Український текст оновлено за результатами приготування Bake Again від 21.11.2026.',
  },
  discovery: {
    cardTitle: uk('Панкейки на молоці'),
    category: uk('Панкейки'),
    flourSummary: flourName,
    collectionIds: ['breakfast', 'everyday'],
    catalogue: true,
    imageKind: 'edited-author-photo',
    sourceTitle:
      'The Fluffiest Gluten Free Buttermilk Pancakes · The Loopy Whisk',
    launchPriority: 'Чернетка',
    heroCandidate: 'No',
    source:
      'Приготування Bake Again від 21.11.2026 за мотивами рецепта The Loopy Whisk.',
    archiveSections: [],
    needsBeforePublishing: '',
  },
  timing: {
    provenance: tested,
    activeMinutes: 40,
    totalElapsedMinutes: 50,
    planningNote: {
      text: uk('З них {duration} — на відпочинок тіста.'),
      phaseId: 'batter-rest',
    },
    phases: [
      {
        id: 'batter-rest',
        label: uk('Відпочинок тіста'),
        duration: { kind: 'range', min: 10, max: 15, unit: 'minute' },
        relatedStepId: 'rest-batter',
      },
      {
        id: 'first-side',
        label: uk('Перший бік'),
        duration: { kind: 'range', min: 2.5, max: 3, unit: 'minute' },
        relatedStepId: 'cook-first-side',
      },
      {
        id: 'second-side',
        label: uk('Другий бік'),
        duration: { kind: 'range', min: 2.5, max: 3, unit: 'minute' },
        relatedStepId: 'cook-second-side',
      },
    ],
  },
  yield: {
    default: {
      id: 'pancakes-yield',
      label: uk('15 панкейків'),
      count: { kind: 'exact', value: 15 },
      unit: 'serving',
      details: uk('На сковороді діаметром 28 см поміщаються чотири панкейки.'),
      provenance: tested,
      availability: 'default',
    },
    alternatives: [],
  },
  geometry: {
    state: 'known',
    default: {
      id: 'round-pan-28-cm',
      label: uk('Сковорода, 28 см'),
      kind: 'other',
      application: 'other',
      shape: 'round',
      diameterCm: 28,
      layerCount: null,
      material: null,
      provenance: tested,
      availability: 'default',
    },
    alternatives: [],
  },
  configuration: {
    base: {
      geometryId: 'round-pan-28-cm',
      yieldId: 'pancakes-yield',
      batchScale: 1,
    },
    geometryAdjustment: null,
    quantityAdjustment: { batchScale: null, useWhatIHave: null },
    ingredientScaling: { default: { kind: 'fixed' } },
  },
  equipment: [
    { id: 'bowls', name: uk('Дві миски') },
    { id: 'whisk', name: uk('Вінчик') },
    { id: 'scale', name: uk('Кухонні ваги') },
    {
      id: 'pan',
      name: uk('Сковорода, 28 см'),
    },
    { id: 'spatula', name: uk('Лопатка') },
    { id: 'scoop', name: uk('Невеликий ополоник') },
  ],
  flourConfiguration: {
    basis: 'commercialMix',
    commercialMixLineId: 'flour',
    additionalStarchLineIds: [],
    xanthanLineId: 'xanthan',
    provenance: tested,
    testedAlternativeMixes: [],
    knownUnsupportedMixes: [],
  },
  beforeStart: [
    {
      id: 'room-temperature',
      text: uk(
        'За можливості заздалегідь дістаньте вершкове масло та яйця з холодильника.',
      ),
      relatedStepId: 'mix-wet',
    },
  ],
  ingredientSections: [
    {
      id: 'dry',
      title: uk('Сухі інгредієнти'),
      lines: [
        {
          id: 'flour',
          options: [
            {
              ingredientId: 'schar-mix-b',
              name: flourName,
            },
          ],
          quantity: quantityFromGrams('schar-mix-b', 240),
        },
        {
          id: 'sugar',
          options: [{ ingredientId: 'granulated-sugar', name: uk('Цукор') }],
          quantity: measured(50, 'g'),
        },
        {
          id: 'baking-powder',
          options: [{ ingredientId: 'baking-powder', name: uk('Розпушувач') }],
          quantity: quantityFromSpoons('baking-powder', 1, 'tsp'),
        },
        {
          id: 'baking-soda',
          options: [{ ingredientId: 'baking-soda', name: uk('Харчова сода') }],
          quantity: quantityFromSpoons('baking-soda', 1, 'tsp'),
        },
        {
          id: 'xanthan',
          options: [
            { ingredientId: 'xanthan-gum', name: uk('Ксантанова камедь') },
          ],
          quantity: quantityFromSpoons('xanthan-gum', 0.5, 'tsp'),
        },
      ],
    },
    {
      id: 'wet',
      title: uk('Рідкі інгредієнти'),
      lines: [
        {
          id: 'milk',
          options: [{ ingredientId: 'milk', name: uk('Молоко') }],
          quantity: measured(400, 'g'),
          preparation: uk('Кімнатної температури.'),
        },
        {
          id: 'eggs',
          options: [{ ingredientId: 'eggs', name: uk('Яйця') }],
          quantity: measured(3, 'piece'),
        },
        {
          id: 'butter',
          options: [{ ingredientId: 'butter', name: uk('Вершкове масло') }],
          quantity: measured(3, 'tbsp'),
          preparation: uk('Розтопіть для тіста.'),
          qualifier: uk('Знадобиться ще трохи масла для сковороди.'),
        },
        {
          id: 'vanilla',
          options: [
            { ingredientId: 'vanilla-bean-paste', name: uk('Ванільна паста') },
          ],
          quantity: measured(0.5, 'tsp'),
          qualifier: uk('Можна замінити на 1 ч. л. ванільного екстракту.'),
        },
      ],
    },
  ],
  steps: [
    {
      id: 'mix-dry',
      title: uk('Змішайте сухі інгредієнти'),
      instruction: uk(
        'Перемішайте вінчиком борошно Schär Mix B, цукор, розпушувач, соду й ксантанову камедь.',
      ),
      ingredientLineIds: [
        'flour',
        'sugar',
        'baking-powder',
        'baking-soda',
        'xanthan',
      ],
      equipmentIds: ['bowls', 'whisk', 'scale'],
    },
    {
      id: 'mix-wet',
      title: uk('З’єднайте рідкі інгредієнти'),
      instruction: uk(
        'В іншій мисці розмішайте молоко, яйця, розтоплене вершкове масло та ваніль до однорідності.',
      ),
      ingredientLineIds: ['milk', 'eggs', 'butter', 'vanilla'],
      equipmentIds: ['bowls', 'whisk'],
    },
    {
      id: 'mix-batter',
      title: uk('Замісіть тісто'),
      instruction: uk(
        'Влийте рідку суміш до сухої й розмішайте вінчиком, доки зникнуть грудочки борошна.',
      ),
      ingredientLineIds: [],
      equipmentIds: ['whisk'],
      guidance: [
        {
          id: 'batter-consistency',
          kind: 'checkpoint',
          text: uk(
            'Тісто повільно стікає з ложки й лягає м’яким горбочком, який лише трохи розпливається.',
          ),
        },
      ],
    },
    {
      id: 'rest-batter',
      title: uk('Дайте тісту відпочити'),
      instruction: uk('Залиште тісто в мисці на 10–15 хвилин.'),
      ingredientLineIds: [],
      durationPhaseId: 'batter-rest',
      equipmentIds: ['bowls'],
    },
    {
      id: 'cook-first-side',
      title: uk('Розігрійте сковороду й підсмажте перший бік'),
      instruction: uk(
        'Розігрійте сковороду на середньому вогні, зменште нагрів до помірно слабкого й тонко змастіть поверхню маслом. Невеликим ополоником налийте тісто окремими порціями на гарячу сковороду. На сковороді 28 см поміщаються чотири панкейки. Залиште між ними трохи місця. Смажте 2½–3 хвилини.',
      ),
      ingredientLineIds: ['butter'],
      cook: {
        ingredients: [
          {
            ingredientId: 'butter',
            quantity: 'omit',
            note: uk('Трохи для змащування сковороди.'),
          },
        ],
      },
      durationPhaseId: 'first-side',
      equipmentIds: ['pan', 'scoop'],
      guidance: [
        {
          id: 'ready-to-flip',
          kind: 'checkpoint',
          text: uk(
            'Перевертайте, коли бульбашки видно й у центрі, краї вже матові, а низ золотистий.',
          ),
        },
      ],
    },
    {
      id: 'cook-second-side',
      title: uk('Переверніть і досмажте'),
      instruction: uk(
        'Переверніть лопаткою і смажте ще 2½–3 хвилини, до золотистого кольору. Перекладіть на тарілку або решітку. Перед наступною партією знову змастіть сковороду.',
      ),
      ingredientLineIds: [],
      durationPhaseId: 'second-side',
      equipmentIds: ['pan', 'spatula'],
      guidance: [
        {
          id: 'adjust-pan-heat',
          kind: 'practicalTip',
          text: uk(
            'Якщо панкейки темніють раніше, ніж схоплюються краї, зменште нагрів. На слабшому вогні орієнтуйтеся на колір і бульбашки.',
          ),
        },
      ],
    },
    {
      id: 'serve',
      title: uk('Подавайте теплими'),
      instruction: uk(
        'За бажанням присипте цукровою пудрою або подайте зі свіжими ягодами, фруктами чи кленовим сиропом.',
      ),
      ingredientLineIds: [],
    },
  ],
  storage: uk(
    'До наступного дня тримайте готові панкейки в закритому контейнері. Перед подачею їх можна прогріти кілька секунд у мікрохвильовці.',
  ),
  makeAhead: null,
  heroMediaId: pancakeHeroMediaId,
  media: [
    {
      id: pancakeHeroMediaId,
      type: 'image',
      path: pancakeCampaign.image,
      usage: ['hero', 'card'],
      fit: 'contain',
      alt: uk(pancakeCampaign.imageAlt),
    },
  ],
  variations: [],
  relatedRecipeIds: ['crepes', 'apple-fritters'],
  sources: [
    {
      id: testSourceId,
      file: 'content/recipes/buttermilk-pancakes.recipe.ts',
      locator: 'Уточнення Саші після приготування 21.11.2026.',
      note: 'Підтверджено молоко кімнатної температури, три яйця, Schär Mix B, 40 хв активного і 50 хв загального часу, відпочинок тіста 10–15 хв, вихід 15 панкейків і чотири панкейки одночасно на сковороді 28 см. Для кількостей без окремих правок і часу смаження взято основу з першої чернетки за The Loopy Whisk.',
    },
    {
      id: sourceId,
      file: sourceUrl,
      locator:
        'Катаріна Чермель · The Loopy Whisk · 26.08.2022 · картка рецепта й пояснення до тіста та смаження',
    },
  ],
  contentGaps: [],
} satisfies Recipe;
