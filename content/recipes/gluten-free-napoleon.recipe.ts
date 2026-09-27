import type { RecipeDraft } from './recipe.types.ts';
import { quantityFromGrams, quantityFromSpoons } from './spoon-weights.ts';

export const glutenFreeNapoleonRecipe = {
  schemaVersion: 2,
  id: 'gluten-free-napoleon',
  versionId: 'gluten-free-napoleon-v2',
  publicationStatus: 'published',
  translationState: {
    uk: 'reviewed',
    en: 'reviewed',
    es: 'reviewed',
  },
  slug: {
    uk: 'bezghliutenovyi-napoleon',
    en: 'gluten-free-napoleon-cake',
    es: 'tarta-napoleon-sin-gluten',
  },
  title: {
    uk: 'Безглютеновий Наполеон',
    en: 'Gluten-Free Napoleon Cake',
    es: 'Tarta Napoleón sin gluten',
  },
  summary: {
    uk: 'Два торти по 6 тонких коржів діаметром 28 см із теплим заварним кремом і горіхами.',
    en: 'Two cakes with six thin 28 cm layers each, warm custard and nuts.',
    es: 'Dos tartas con seis capas finas de 28 cm cada una, crema pastelera templada y frutos secos.',
  },
  categoryIds: ['celebration', 'layer-cake'],
  situationIds: ['celebration'],
  difficulty: 'advanced',
  baseProvenance: {
    state: 'repeatedlyVerified',
    sourceIds: [
      'inventory-row',
      'archive-recipe',
      'archive-status-note',
      'author-update',
    ],
    note: "The author's current update supersedes the historical four-star first-success label; the current base has been made many times.",
  },
  timing: {
    activeMinutes: 60,
    totalElapsedMinutes: null,
    planningNote: {
      text: {
        uk: 'Найкраще подавати наступного дня.',
        en: 'Best served the next day.',
        es: 'Mejor servir al día siguiente.',
      },
    },
    phases: [
      {
        id: 'freeze-butter',
        label: {
          uk: 'Охолодження нарізаного масла',
          en: 'Freezing the cubed butter',
          es: 'Enfriado de la mantequilla en dados',
        },
        duration: { kind: 'range', min: 10, max: 15, unit: 'minute' },
      },
      {
        id: 'chill-dough',
        label: {
          uk: 'Охолодження тіста',
          en: 'Dough chilling',
          es: 'Refrigeración de la masa',
        },
        duration: { kind: 'minimum', min: 2, unit: 'hour' },
      },
      {
        id: 'bake-one-layer',
        label: {
          uk: 'Випікання одного коржа',
          en: 'Baking one layer',
          es: 'Horneado de una capa',
        },
        duration: { kind: 'range', min: 7, max: 10, unit: 'minute' },
      },
      {
        id: 'toast-walnuts',
        label: {
          uk: 'Підсушування волоських горіхів',
          en: 'Toasting walnuts',
          es: 'Tostado de las nueces',
        },
        duration: { kind: 'range', min: 8, max: 10, unit: 'minute' },
      },
      {
        id: 'toast-almonds',
        label: {
          uk: 'Підсушування мигдальних пластівців',
          en: 'Toasting flaked almonds',
          es: 'Tostado de las almendras laminadas',
        },
        duration: { kind: 'range', min: 4, max: 5, unit: 'minute' },
      },
      {
        id: 'room-temperature-rest',
        label: {
          uk: 'Витримка після складання',
          en: 'Rest after assembly',
          es: 'Reposo después del montaje',
        },
        duration: { kind: 'exact', value: 1, unit: 'hour' },
      },
      {
        id: 'refrigerated-maturation',
        label: {
          uk: 'Дозрівання в холодильнику',
          en: 'Refrigerated maturation',
          es: 'Reposo en la nevera',
        },
        duration: { kind: 'range', min: 12, max: 24, unit: 'hour' },
      },
    ],
  },
  yield: {
    default: {
      id: 'two-six-layer-cakes',
      label: {
        uk: '2 торти',
        en: '2 cakes',
        es: '2 tartas',
      },
      amount: 2,
      unit: 'cake',
      details: {
        uk: 'Усього 12 коржів; кожен торт має 6 коржів діаметром 28 см',
        en: '12 layers in total; each cake has six 28 cm layers',
        es: '12 capas en total; cada tarta tiene seis capas de 28 cm',
      },
      provenance: {
        state: 'repeatedlyVerified',
        sourceIds: ['archive-recipe', 'author-update'],
      },
      availability: 'default',
    },
    alternatives: [],
  },
  geometry: {
    default: {
      id: 'round-28cm-6-layers-each',
      label: {
        uk: 'Для кожного торта 6 круглих коржів діаметром 28 см',
        en: 'Six 28 cm round layers for each cake',
        es: 'Seis capas redondas de 28 cm para cada tarta',
      },
      kind: 'roundTemplate',
      application: 'roll-and-trim',
      shape: 'round',
      diameterCm: 28,
      layerCount: 6,
      material: null,
      provenance: {
        state: 'repeatedlyVerified',
        sourceIds: ['archive-recipe', 'author-update'],
      },
      availability: 'default',
    },
    alternatives: [
      {
        id: 'round-24cm-preview',
        label: {
          uk: 'Круглий шаблон 24 см — лише розрахунковий перегляд',
          en: '24 cm round template — calculation preview only',
          es: 'Formato redondo de 24 cm — solo vista previa calculada',
        },
        kind: 'roundTemplate',
        application: 'roll-and-trim',
        shape: 'round',
        diameterCm: 24,
        layerCount: null,
        material: null,
        provenance: {
          state: 'calculated',
          sourceIds: ['ux-form-example'],
          note: 'The UX baseline permits an area-based preview but explicitly blocks Cook Mode until eggs, layer count, cream volume and the result are resolved and tested.',
        },
        availability: 'previewOnly',
        blockingGapIds: ['validate-24cm-form'],
      },
    ],
  },
  configuration: {
    base: {
      status: 'Tested',
      geometryId: 'round-28cm-6-layers-each',
      yieldId: 'two-six-layer-cakes',
      batchScale: 1,
    },
    geometryAdjustment: {
      optionIds: ['round-24cm-preview'],
      quantityBasis: 'area',
      timingPolicy: 'unverifiedWhenChanged',
    },
    quantityAdjustment: {
      batchScale: { allowed: [0.5, 1, 1.5, 2] },
      useWhatIHave: {
        scalingAnchors: [
          {
            ingredientLineId: 'schar-mix-b',
            allowedUnit: 'g',
            minimum: 100,
          },
        ],
      },
    },
    ingredientScaling: {
      default: { kind: 'linear', precision: 0.1, rounding: 'nearest' },
    },
  },
  equipment: [
    {
      id: 'food-processor',
      name: {
        uk: 'кухонний комбайн',
        en: 'food processor',
        es: 'robot de cocina',
      },
    },
    {
      id: 'parchment',
      name: {
        uk: 'пергамент',
        en: 'baking parchment',
        es: 'papel de horno',
      },
    },
    {
      id: 'fork',
      name: { uk: 'виделка', en: 'fork', es: 'tenedor' },
    },
    {
      id: 'large-saucepan',
      name: {
        uk: 'велика каструля',
        en: 'large saucepan',
        es: 'cacerola grande',
      },
    },
    {
      id: 'whisk',
      name: { uk: 'вінчик', en: 'whisk', es: 'varillas' },
    },
    {
      id: '28cm-template',
      name: {
        uk: 'круглий шаблон 28 см',
        en: '28 cm round template',
        es: 'plantilla redonda de 28 cm',
      },
    },
  ],
  flourConfiguration: {
    commercialMixLineId: 'schar-mix-b',
    additionalStarchLineIds: ['tapioca-dough', 'corn-starch-dough'],
    xanthanLineId: 'xanthan',
    provenance: {
      state: 'repeatedlyVerified',
      sourceIds: ['inventory-row', 'archive-recipe', 'archive-status-note'],
    },
    testedAlternativeMixes: [],
    knownUnsupportedMixes: [],
  },
  beforeStart: [
    {
      id: 'plan-parchment',
      relatedStepId: 'roll-layer',
      text: {
        uk: 'Підготуйте достатньо листів пергаменту для 12 коржів: кожен розкачується між двома листами й випікається на нижньому.',
        en: 'Have enough sheets of baking parchment for 12 layers: each is rolled between two sheets and baked on the lower one.',
        es: 'Prepara suficientes hojas de papel de horno para 12 capas: cada una se estira entre dos hojas y se hornea sobre la inferior.',
      },
    },
    {
      id: 'plan-chilling-and-maturation',
      relatedStepId: 'refrigerate-cake',
      text: {
        uk: 'Сплануйте приготування за день: диски тіста охолоджуються щонайменше 2 години, а готовий торт — 1 годину при кімнатній температурі та 12–24 години в холодильнику.',
        en: 'Plan a day ahead: the dough discs chill for at least 2 hours, and the assembled cake rests for 1 hour at room temperature and 12–24 hours in the refrigerator.',
        es: 'Planifica con un día de antelación: los discos de masa se enfrían al menos 2 horas y la tarta montada reposa 1 hora a temperatura ambiente y 12–24 horas en la nevera.',
      },
    },
  ],
  ingredientSections: [
    {
      id: 'layers',
      title: { uk: 'Коржі', en: 'Layers', es: 'Capas' },
      lines: [
        {
          id: 'schar-mix-b',
          options: [
            {
              ingredientId: 'schar-mix-b-bread',
              name: {
                uk: 'борошняна суміш Schär Mix B Bread',
                en: 'Schär Mix B Bread flour mix',
                es: 'mezcla de harina Schär Mix B Bread',
              },
            },
          ],
          quantity: quantityFromGrams('schar-mix-b', 450),
        },
        {
          id: 'tapioca-dough',
          options: [
            {
              ingredientId: 'tapioca-starch',
              name: {
                uk: 'тапіоковий крохмаль',
                en: 'tapioca starch',
                es: 'almidón de tapioca',
              },
            },
          ],
          quantity: quantityFromGrams('tapioca-starch', 80),
        },
        {
          id: 'corn-starch-dough',
          options: [
            {
              ingredientId: 'corn-starch',
              name: {
                uk: 'кукурудзяний крохмаль',
                en: 'corn starch',
                es: 'almidón de maíz',
              },
            },
          ],
          quantity: quantityFromGrams('corn-starch', 40),
        },
        {
          id: 'xanthan',
          options: [
            {
              ingredientId: 'xanthan-gum',
              name: {
                uk: 'ксантанова камедь',
                en: 'xanthan gum',
                es: 'goma xantana',
              },
            },
          ],
          quantity: quantityFromGrams('xanthan-gum', 3),
          scaling: { kind: 'linear', precision: 0.1, rounding: 'nearest' },
          condition: {
            uk: 'лише якщо її немає у складі суміші',
            en: 'only if the flour mix does not contain it',
            es: 'solo si la mezcla de harina no la contiene',
          },
        },
        {
          id: 'baking-powder',
          options: [
            {
              ingredientId: 'baking-powder',
              name: {
                uk: 'розпушувач',
                en: 'baking powder',
                es: 'levadura química',
              },
            },
          ],
          quantity: quantityFromGrams('baking-powder', 8),
        },
        {
          id: 'salt-dough',
          options: [
            {
              ingredientId: 'salt',
              name: { uk: 'сіль', en: 'salt', es: 'sal' },
            },
          ],
          quantity: quantityFromSpoons('fine-salt', 0.25, 'tsp'),
          scaling: { kind: 'fixed' },
        },
        {
          id: 'sugar-dough',
          options: [
            {
              ingredientId: 'granulated-sugar',
              name: { uk: 'цукор', en: 'sugar', es: 'azúcar' },
            },
          ],
          quantity: quantityFromSpoons('granulated-sugar', 1, 'tbsp'),
        },
        {
          id: 'butter-dough',
          options: [
            {
              ingredientId: 'butter',
              name: {
                uk: 'вершкове масло',
                en: 'butter',
                es: 'mantequilla',
              },
            },
          ],
          quantity: {
            base: { kind: 'exact', value: 120, unit: 'g' },
            shopping: { mode: 'base' },
          },
          preparation: {
            uk: 'холодне, нарізати кубиками',
            en: 'cold, cut into cubes',
            es: 'fría, cortada en dados',
          },
        },
        {
          id: 'oil-dough',
          options: [
            {
              ingredientId: 'sunflower-oil',
              name: {
                uk: 'соняшникова олія',
                en: 'sunflower oil',
                es: 'aceite de girasol',
              },
            },
          ],
          quantity: {
            base: { kind: 'exact', value: 50, unit: 'g' },
            shopping: { mode: 'base' },
          },
          provenance: {
            state: 'repeatedlyVerified',
            sourceIds: ['author-update'],
            note: 'The author confirmed sunflower oil as the current oil.',
          },
        },
        {
          id: 'cultured-dairy-dough',
          options: [
            {
              ingredientId: 'sour-cream',
              name: {
                uk: 'сметана',
                en: 'sour cream',
                es: 'crema agria',
              },
            },
            {
              ingredientId: 'thick-natural-yogurt',
              name: {
                uk: 'густий натуральний йогурт',
                en: 'thick natural yoghurt',
                es: 'yogur natural espeso',
              },
            },
          ],
          choose: 1,
          quantity: {
            base: { kind: 'exact', value: 250, unit: 'g' },
            shopping: { mode: 'base' },
          },
          provenance: {
            state: 'authorGuidance',
            sourceIds: ['archive-recipe'],
            note: 'The source offers either option but does not identify a default or the test scope of each option.',
          },
        },
        {
          id: 'eggs-dough',
          options: [
            {
              ingredientId: 'whole-egg',
              name: { uk: 'яйця', en: 'eggs', es: 'huevos' },
            },
          ],
          quantity: {
            base: { kind: 'exact', value: 2, unit: 'piece' },
            shopping: { mode: 'base' },
          },
          scaling: { kind: 'discrete', increment: 1, rounding: 'manual' },
        },
        {
          id: 'lemon-juice',
          options: [
            {
              ingredientId: 'lemon-juice',
              name: {
                uk: 'лимонний сік',
                en: 'lemon juice',
                es: 'zumo de limón',
              },
            },
          ],
          quantity: {
            base: { kind: 'exact', value: 1, unit: 'tbsp' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'cold-water',
          options: [
            {
              ingredientId: 'water',
              name: { uk: 'холодна вода', en: 'cold water', es: 'agua fría' },
            },
          ],
          quantity: {
            base: { kind: 'range', min: 30, max: 70, unit: 'ml' },
            shopping: { mode: 'base', defaultSelected: false },
          },
          scaling: { kind: 'range', precision: 5, rounding: 'nearest' },
          qualifier: {
            uk: 'за потреби',
            en: 'as needed',
            es: 'según sea necesario',
          },
        },
      ],
    },
    {
      id: 'custard',
      title: {
        uk: 'Заварний крем',
        en: 'Custard',
        es: 'Crema pastelera',
      },
      provenance: {
        state: 'repeatedlyVerified',
        sourceIds: ['archive-recipe', 'inventory-row', 'author-update'],
        note: 'The current custard formula was confirmed by the author for the repeatedly baked base recipe.',
      },
      lines: [
        {
          id: 'milk-custard',
          options: [
            {
              ingredientId: 'milk',
              name: { uk: 'молоко', en: 'milk', es: 'leche' },
            },
          ],
          quantity: {
            base: { kind: 'exact', value: 2500, unit: 'ml' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'eggs-custard',
          options: [
            {
              ingredientId: 'whole-egg',
              name: { uk: 'яйця', en: 'eggs', es: 'huevos' },
            },
          ],
          quantity: {
            base: { kind: 'exact', value: 4, unit: 'piece' },
            shopping: { mode: 'base' },
          },
          scaling: { kind: 'discrete', increment: 1, rounding: 'manual' },
        },
        {
          id: 'sugar-custard',
          options: [
            {
              ingredientId: 'granulated-sugar',
              name: { uk: 'цукор', en: 'sugar', es: 'azúcar' },
            },
          ],
          quantity: quantityFromGrams('granulated-sugar', 400),
        },
        {
          id: 'corn-starch-custard',
          options: [
            {
              ingredientId: 'corn-starch',
              name: {
                uk: 'кукурудзяний крохмаль',
                en: 'corn starch',
                es: 'almidón de maíz',
              },
            },
          ],
          quantity: quantityFromGrams('corn-starch', 170),
        },
        {
          id: 'tapioca-custard',
          options: [
            {
              ingredientId: 'tapioca-starch',
              name: {
                uk: 'тапіоковий крохмаль',
                en: 'tapioca starch',
                es: 'almidón de tapioca',
              },
            },
          ],
          quantity: quantityFromGrams('tapioca-starch', 20),
        },
        {
          id: 'butter-custard',
          options: [
            {
              ingredientId: 'butter',
              name: {
                uk: 'вершкове масло',
                en: 'butter',
                es: 'mantequilla',
              },
            },
          ],
          quantity: {
            base: { kind: 'exact', value: 100, unit: 'g' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'vanilla-sugar-custard',
          options: [
            {
              ingredientId: 'vanilla-sugar',
              name: {
                uk: 'ванільний цукор',
                en: 'vanilla sugar',
                es: 'azúcar vainillado',
              },
            },
          ],
          quantity: {
            base: { kind: 'exact', value: 24, unit: 'g' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'salt-custard',
          options: [
            {
              ingredientId: 'salt',
              name: { uk: 'сіль', en: 'salt', es: 'sal' },
            },
          ],
          quantity: {
            base: null,
            equivalent: { kind: 'exact', value: 1, unit: 'pinch' },
            shopping: { mode: 'nameOnly' },
          },
          scaling: { kind: 'fixed' },
        },
      ],
    },
    {
      id: 'assembly',
      title: {
        uk: 'Горіхи та оздоблення',
        en: 'Nuts and finish',
        es: 'Frutos secos y acabado',
      },
      lines: [
        {
          id: 'walnuts',
          options: [
            {
              ingredientId: 'walnut',
              name: {
                uk: 'волоські горіхи',
                en: 'walnuts',
                es: 'nueces',
              },
            },
          ],
          quantity: {
            base: { kind: 'exact', value: 150, unit: 'g' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'flaked-almonds',
          options: [
            {
              ingredientId: 'flaked-almond',
              name: {
                uk: 'мигдальні пластівці',
                en: 'flaked almonds',
                es: 'almendras laminadas',
              },
            },
          ],
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
      id: 'mix-dry-dough',
      title: {
        uk: 'Змішайте сухі інгредієнти',
        en: 'Mix the dry ingredients',
        es: 'Mezcla los ingredientes secos',
      },
      instruction: {
        uk: 'У чаші комбайна змішайте Schär Mix B, обидва крохмалі, ксантан, розпушувач, сіль і цукор 5–10 секунд.',
        en: 'In a food processor, mix the Schär Mix B, both starches, xanthan, baking powder, salt and sugar for 5–10 seconds.',
        es: 'En el robot de cocina, mezcla Schär Mix B, los dos almidones, la goma xantana, la levadura química, la sal y el azúcar durante 5–10 segundos.',
      },
      ingredientLineIds: [
        'schar-mix-b',
        'tapioca-dough',
        'corn-starch-dough',
        'xanthan',
        'baking-powder',
        'salt-dough',
        'sugar-dough',
      ],
      duration: { kind: 'range', min: 5, max: 10, unit: 'second' },
      equipmentIds: ['food-processor'],
    },
    {
      id: 'cut-in-butter',
      title: {
        uk: 'Порубайте холодне масло',
        en: 'Cut in the cold butter',
        es: 'Incorpora la mantequilla fría',
      },
      instruction: {
        uk: 'Наріжте холодне масло кубиками, покладіть на 10–15 хвилин у морозилку, додайте до сухої суміші й зробіть приблизно 10 коротких імпульсів.',
        en: 'Cube the cold butter, freeze it for 10–15 minutes, add it to the dry mixture and pulse about ten times.',
        es: 'Corta la mantequilla fría en dados, déjala 10–15 minutos en el congelador, añádela a la mezcla seca y da unos diez impulsos cortos.',
      },
      ingredientLineIds: ['butter-dough'],
      duration: { kind: 'range', min: 10, max: 15, unit: 'minute' },
      equipmentIds: ['food-processor'],
      mediaIds: [
        'napoleon-butter-ready-v1',
        'napoleon-butter-early-pulse-v1',
        'napoleon-butter-crumb-v1',
      ],
      guidance: [
        {
          id: 'uneven-crumb',
          kind: 'checkpoint',
          text: {
            uk: 'Потрібна неоднорідна крихта: частина як пісок, частина — шматочки масла розміром з горошину.',
            en: 'The crumb should be uneven: some sandy, with some pea-sized pieces of butter.',
            es: 'La miga debe quedar irregular: una parte arenosa y otra con trozos de mantequilla del tamaño de un guisante.',
          },
        },
      ],
    },
    {
      id: 'mix-wet-dough',
      title: {
        uk: 'Змішайте рідкі інгредієнти',
        en: 'Mix the wet ingredients',
        es: 'Mezcla los ingredientes líquidos',
      },
      instruction: {
        uk: 'Змішайте яйця, обраний кисломолочний продукт, соняшникову олію та лимонний сік лише до однорідності.',
        en: 'Mix the eggs, chosen cultured dairy, sunflower oil and lemon juice only until smooth.',
        es: 'Mezcla los huevos, el lácteo fermentado elegido, el aceite de girasol y el zumo de limón solo hasta obtener una mezcla homogénea.',
      },
      ingredientLineIds: [
        'eggs-dough',
        'cultured-dairy-dough',
        'oil-dough',
        'lemon-juice',
      ],
      mediaIds: ['napoleon-wet-mixture-v1'],
    },
    {
      id: 'combine-dough',
      title: {
        uk: 'З’єднайте тісто',
        en: 'Bring the dough together',
        es: 'Une la masa',
      },
      instruction: {
        uk: 'Влийте рідину в суху суміш і змішайте короткими імпульсами. За потреби додайте холодну воду.',
        en: 'Pour the liquid into the dry mixture and combine with short pulses. Add cold water as needed.',
        es: 'Vierte la mezcla líquida sobre la seca y mezcla con impulsos cortos. Añade agua fría según sea necesario.',
      },
      ingredientLineIds: ['cold-water'],
      equipmentIds: ['food-processor'],
      mediaIds: ['napoleon-pour-wet-v1', 'napoleon-dough-clumps-v1'],
      guidance: [
        {
          id: 'dough-consistency',
          kind: 'checkpoint',
          text: {
            uk: 'Тісто має збиратися грудками, бути пластичним і не бути липкою кашею.',
            en: 'The dough should gather into clumps, feel pliable and not become a sticky paste.',
            es: 'La masa debe agruparse en grumos, ser maleable y no convertirse en una pasta pegajosa.',
          },
        },
      ],
    },
    {
      id: 'fold-dough',
      title: {
        uk: 'Складіть тісто',
        en: 'Fold the dough',
        es: 'Pliega la masa',
      },
      instruction: {
        uk: 'Швидко зберіть тісто руками, складіть 2–3 рази й сформуйте диск. Не вимішуйте довго.',
        en: 'Quickly bring the dough together by hand, fold it 2–3 times and shape it into a disc. Do not knead for long.',
        es: 'Junta rápidamente la masa con las manos, pliégala 2–3 veces y forma un disco. No la amases mucho tiempo.',
      },
      ingredientLineIds: [],
    },
    {
      id: 'divide-and-chill',
      quantityMentions: [{
        text: { uk: '12', en: 'twelve', es: 'doce' },
        quantity: { kind: 'exact', value: 12, unit: 'piece' },
        numberOnly: true,
      }],
      title: {
        uk: 'Розділіть і охолодіть',
        en: 'Divide and chill',
        es: 'Divide y enfría',
      },
      instruction: {
        uk: 'Розділіть тісто на 12 дисків, кожен загорніть і охолоджуйте щонайменше 2 години. Можна залишити на ніч.',
        en: 'Divide the dough into twelve discs, wrap each one and chill for at least 2 hours; they may be left overnight.',
        es: 'Divide la masa en doce discos, envuelve cada uno y refrigera durante al menos 2 horas; pueden dejarse toda la noche.',
      },
      ingredientLineIds: [],
      duration: { kind: 'minimum', min: 2, unit: 'hour' },
      mediaIds: ['napoleon-dough-discs-v3'],
    },
    {
      id: 'temper-disc',
      title: {
        uk: 'Підготуйте один диск',
        en: 'Soften one disc',
        es: 'Deja templar un disco',
      },
      instruction: {
        uk: 'Діставайте по одному диску. Якщо він дуже твердий, залиште на столі на 5–10 хвилин.',
        en: 'Take out one disc at a time. If it is very firm, leave it on the counter for 5–10 minutes.',
        es: 'Saca un disco cada vez. Si está muy duro, déjalo sobre la encimera durante 5–10 minutos.',
      },
      ingredientLineIds: [],
      duration: { kind: 'range', min: 5, max: 10, unit: 'minute' },
    },
    {
      id: 'roll-layer',
      title: {
        uk: 'Розкачайте й обріжте корж',
        en: 'Roll and trim a layer',
        es: 'Estira y recorta una capa',
      },
      instruction: {
        uk: 'Розкачайте диск між двома листами пергаменту до товщини приблизно 1,5 мм. Виріжте круг діаметром 28 см, залиште обрізки поруч і проколіть виделкою.',
        en: 'Roll the disc between two sheets of parchment to about 1.5 mm thick. Cut a 28 cm circle, leave the scraps beside it and prick with a fork.',
        es: 'Estira el disco entre dos hojas de papel de horno hasta unos 1,5 mm. Corta un círculo de 28 cm, deja los recortes al lado y pínchalo con un tenedor.',
      },
      ingredientLineIds: [],
      equipmentIds: ['parchment', 'fork', '28cm-template'],
      mediaIds: ['napoleon-rolled-layer-v3'],
      guidance: [
        {
          id: 'roll-on-baking-parchment',
          kind: 'practicalTip',
          text: {
            uk: 'Розкачуйте корж на пергаменті, на якому він випікатиметься, щоб не переносити тонке тісто.',
            en: 'Roll the layer on the parchment used for baking so the thin dough does not need to be transferred.',
            es: 'Estira la capa sobre el papel en el que se horneará para no tener que trasladar la masa fina.',
          },
        },
      ],
    },
    {
      id: 'bake-layer',
      title: { uk: 'Спечіть корж', en: 'Bake the layer', es: 'Hornea la capa' },
      instruction: {
        uk: 'Випікайте корж разом з обрізками при 190°C приблизно 7–10 хвилин.',
        en: 'Bake the layer with its scraps at 190°C for about 7–10 minutes.',
        es: 'Hornea la capa con sus recortes a 190°C durante unos 7–10 minutos.',
      },
      ingredientLineIds: [],
      duration: { kind: 'range', min: 7, max: 10, unit: 'minute' },
      temperature: { value: 190, unit: 'C', ovenMode: 'conventional' },
      equipmentIds: ['parchment'],
      mediaIds: ['napoleon-baked-layer-v3'],
      guidance: [
        {
          id: 'light-golden-layer',
          kind: 'checkpoint',
          text: {
            uk: 'Корж має стати світло-золотистим.',
            en: 'The layer should be light golden.',
            es: 'La capa debe quedar ligeramente dorada.',
          },
        },
      ],
    },
    {
      id: 'heat-milk',
      quantityMentions: [{
        text: { uk: '600–650 мл', en: '600–650 ml', es: '600–650 ml' },
        quantity: { kind: 'range', min: 600, max: 650, unit: 'ml' },
      }],
      title: {
        uk: 'Нагрійте молоко',
        en: 'Heat the milk',
        es: 'Calienta la leche',
      },
      instruction: {
        uk: 'Відлийте 600–650 мл холодного молока. Решту молока нагрійте майже до кипіння.',
        en: 'Set aside 600–650 ml of cold milk. Heat the remaining milk until almost boiling.',
        es: 'Reserva 600–650 ml de leche fría. Calienta el resto de la leche hasta casi hervir.',
      },
      ingredientLineIds: ['milk-custard'],
      equipmentIds: ['large-saucepan'],
    },
    {
      id: 'mix-custard-base',
      title: {
        uk: 'Змішайте основу крему',
        en: 'Mix the custard base',
        es: 'Prepara la base de la crema',
      },
      instruction: {
        uk: 'У великій мисці змішайте цукор, обидва крохмалі, ванільний цукор і сіль. Додайте відлите холодне молоко й розмішайте до гладкості, потім додайте 4 яйця.',
        en: 'In a large bowl, combine the sugar, both starches, vanilla sugar and salt. Add the reserved cold milk and stir until smooth, then add the four eggs.',
        es: 'En un bol grande, mezcla el azúcar, los dos almidones, el azúcar vainillado y la sal. Añade la leche fría reservada y remueve hasta que quede liso; incorpora después los cuatro huevos.',
      },
      ingredientLineIds: [
        'sugar-custard',
        'corn-starch-custard',
        'tapioca-custard',
        'vanilla-sugar-custard',
        'salt-custard',
        'milk-custard',
        'eggs-custard',
      ],
      equipmentIds: ['whisk'],
    },
    {
      id: 'temper-custard',
      title: {
        uk: 'Темперуйте яєчну суміш',
        en: 'Temper the egg mixture',
        es: 'Templa la mezcla de huevo',
      },
      instruction: {
        uk: 'Влийте 2–3 ополоники гарячого молока в яєчно-крохмальну суміш, перемішайте й поверніть все в каструлю.',
        en: 'Whisk 2–3 ladlefuls of hot milk into the egg and starch mixture, then return everything to the saucepan.',
        es: 'Incorpora 2–3 cucharones de leche caliente a la mezcla de huevos y almidón, remueve y devuelve todo a la cacerola.',
      },
      ingredientLineIds: ['milk-custard'],
      equipmentIds: ['large-saucepan', 'whisk'],
    },
    {
      id: 'cook-custard',
      title: {
        uk: 'Зваріть крем',
        en: 'Cook the custard',
        es: 'Cuece la crema',
      },
      instruction: {
        uk: 'Варіть на середньому вогні, постійно працюючи вінчиком. Після перших бульбашок варіть ще 30–60 секунд.',
        en: 'Cook over medium heat, whisking constantly. After the first bubbles appear, cook for another 30–60 seconds.',
        es: 'Cocina a fuego medio, batiendo constantemente. Cuando aparezcan las primeras burbujas, cocina 30–60 segundos más.',
      },
      ingredientLineIds: [],
      duration: { kind: 'range', min: 30, max: 60, unit: 'second' },
      equipmentIds: ['large-saucepan', 'whisk'],
      guidance: [
        {
          id: 'first-bubbles',
          kind: 'checkpoint',
          text: {
            uk: 'Відраховуйте фінальні 30–60 секунд після появи перших бульбашок.',
            en: 'Start the final 30–60 seconds when the first bubbles appear.',
            es: 'Empieza a contar los últimos 30–60 segundos cuando aparezcan las primeras burbujas.',
          },
        },
      ],
    },
    {
      id: 'finish-custard',
      title: {
        uk: 'Додайте масло',
        en: 'Add the butter',
        es: 'Añade la mantequilla',
      },
      instruction: {
        uk: 'Зніміть крем з вогню, додайте масло й розмішайте до однорідності.',
        en: 'Remove the custard from the heat, add the butter and stir until smooth.',
        es: 'Retira la crema del fuego, añade la mantequilla y remueve hasta que quede homogénea.',
      },
      ingredientLineIds: ['butter-custard'],
      equipmentIds: ['whisk'],
      mediaIds: ['napoleon-finished-custard-v3'],
    },
    {
      id: 'toast-walnuts',
      title: {
        uk: 'Підсушіть волоські горіхи',
        en: 'Toast the walnuts',
        es: 'Tuesta las nueces',
      },
      instruction: {
        uk: 'Підсушіть волоські горіхи при 160°C 8–10 хвилин.',
        en: 'Toast the walnuts at 160°C for 8–10 minutes.',
        es: 'Tuesta las nueces a 160°C durante 8–10 minutos.',
      },
      ingredientLineIds: ['walnuts'],
      duration: { kind: 'range', min: 8, max: 10, unit: 'minute' },
      temperature: { value: 160, unit: 'C', ovenMode: 'conventional' },
    },
    {
      id: 'toast-almonds',
      title: {
        uk: 'Підсушіть мигдальні пластівці',
        en: 'Toast the almonds',
        es: 'Tuesta las almendras',
      },
      instruction: {
        uk: 'Підсушіть мигдальні пластівці при 160°C 4–5 хвилин.',
        en: 'Toast the flaked almonds at 160°C for 4–5 minutes.',
        es: 'Tuesta las almendras laminadas a 160°C durante 4–5 minutos.',
      },
      ingredientLineIds: ['flaked-almonds'],
      duration: { kind: 'range', min: 4, max: 5, unit: 'minute' },
      temperature: { value: 160, unit: 'C', ovenMode: 'conventional' },
    },
    {
      id: 'assemble-cake',
      title: {
        uk: 'Складіть два торти',
        en: 'Assemble the cakes',
        es: 'Monta las tartas',
      },
      instruction: {
        uk: 'Складіть два торти по 6 коржів. Використовуйте крем теплим. Нанесіть крем на кожен корж, додаючи волоські горіхи через один шар. Зверху посипте крихтою від коржів і мигдальними пластівцями.',
        en: 'Assemble two cakes with six layers each. Use the custard while warm. Spread it on every layer, adding walnuts to every other layer. Finish with layer crumbs and flaked almonds.',
        es: 'Monta dos tartas de seis capas cada una. Usa la crema templada. Extiéndela sobre cada capa y añade nueces en capas alternas. Termina con migas de los recortes y almendras laminadas.',
      },
      ingredientLineIds: ['walnuts', 'flaked-almonds'],
      mediaIds: ['napoleon-round-six-layer-assembly-v3'],
    },
    {
      id: 'rest-assembled-cake',
      title: {
        uk: 'Залиште при кімнатній температурі',
        en: 'Rest at room temperature',
        es: 'Deja reposar a temperatura ambiente',
      },
      instruction: {
        uk: 'Після складання залиште торт приблизно на 1 годину при кімнатній температурі.',
        en: 'After assembly, leave the cake at room temperature for about 1 hour.',
        es: 'Después del montaje, deja la tarta aproximadamente 1 hora a temperatura ambiente.',
      },
      ingredientLineIds: [],
      duration: { kind: 'exact', value: 1, unit: 'hour' },
    },
    {
      id: 'refrigerate-cake',
      title: {
        uk: 'Охолодіть до наступного дня',
        en: 'Chill overnight',
        es: 'Refrigera hasta el día siguiente',
      },
      instruction: {
        uk: 'Поставте торт у холодильник на 12–24 години. Найкращий смак — наступного дня.',
        en: 'Refrigerate the cake for 12–24 hours. It tastes best the next day.',
        es: 'Refrigera la tarta durante 12–24 horas. Está mejor al día siguiente.',
      },
      ingredientLineIds: [],
      duration: { kind: 'range', min: 12, max: 24, unit: 'hour' },
    },
  ],
  storage: null,
  makeAhead: {
    uk: 'Тісто можна охолоджуйте на ніч. Після складання торт дозріває в холодильнику 12–24 години; найкращий смак — наступного дня.',
    en: 'The dough may be chilled overnight. After assembly, refrigerate the cake for 12–24 hours; it tastes best the next day.',
    es: 'La masa puede refrigerarse toda la noche. Después del montaje, deja la tarta 12–24 horas en la nevera; está mejor al día siguiente.',
  },
  variations: [
    {
      id: 'less-rich-base',
      dimension: 'fat',
      label: {
        uk: 'Менш жирна базова версія',
        en: 'Less-rich base version',
        es: 'Versión base menos grasa',
      },
      description: {
        uk: 'Поточна базова версія використовує 120 г вершкового масла та 50 г олії.',
        en: 'The current base uses 120 g butter and 50 g oil.',
        es: 'La versión base actual usa 120 g de mantequilla y 50 g de aceite.',
      },
      provenance: {
        state: 'repeatedlyVerified',
        sourceIds: ['inventory-row', 'archive-status-note'],
      },
      availability: 'default',
    },
    {
      id: 'more-custard',
      dimension: 'method',
      label: {
        uk: '2,8–3 л молока для соковитішого торта',
        en: '2.8–3 l milk for a moister cake',
        es: '2,8–3 l de leche para una tarta más jugosa',
      },
      description: {
        uk: 'Історична нотатка пропонує перевірити більший обсяг крему; пропорції інших інгредієнтів не вказані.',
        en: 'A historical note proposes testing more custard; adjusted quantities for the other ingredients are not recorded.',
        es: 'Una nota histórica propone probar más crema; no se registran las cantidades ajustadas de los demás ingredientes.',
      },
      provenance: {
        state: 'suggested',
        sourceIds: ['archive-refinement-note'],
      },
      availability: 'hiddenUntilConfirmed',
      blockingGapIds: ['confirm-cream-volume'],
    },
    {
      id: 'citrus-zest',
      dimension: 'flavour',
      label: {
        uk: 'Цитрусова цедра',
        en: 'Citrus zest',
        es: 'Ralladura de cítricos',
      },
      description: {
        uk: 'Історична нотатка пропонує спробувати лимонну цедру; кількість і спосіб додавання не вказані.',
        en: 'A historical note suggests trying lemon zest; no amount or method is recorded.',
        es: 'Una nota histórica sugiere probar ralladura de limón; no se indican cantidad ni método.',
      },
      provenance: {
        state: 'suggested',
        sourceIds: ['archive-refinement-note'],
      },
      availability: 'hiddenUntilConfirmed',
    },
    {
      id: 'vanilla-seeds',
      dimension: 'flavour',
      label: {
        uk: 'Насіння ванілі',
        en: 'Vanilla seeds',
        es: 'Semillas de vainilla',
      },
      description: {
        uk: 'Історична нотатка пропонує спробувати насіння ванілі; кількість не вказана.',
        en: 'A historical note suggests trying vanilla seeds; no amount is recorded.',
        es: 'Una nota histórica sugiere probar semillas de vainilla; no se indica la cantidad.',
      },
      provenance: {
        state: 'suggested',
        sourceIds: ['archive-refinement-note'],
      },
      availability: 'hiddenUntilConfirmed',
    },
    {
      id: 'thinner-layers-1-2mm',
      dimension: 'method',
      label: {
        uk: 'Коржі товщиною приблизно 1,2 мм',
        en: 'Layers about 1.2 mm thick',
        es: 'Capas de unos 1,2 mm de grosor',
      },
      description: {
        uk: 'Історична нотатка пропонує перевірити тонше розкачування замість базових приблизно 1,5 мм.',
        en: 'A historical note proposes testing thinner rolling instead of the base thickness of about 1.5 mm.',
        es: 'Una nota histórica propone probar un estirado más fino en lugar del grosor base de unos 1,5 mm.',
      },
      provenance: {
        state: 'suggested',
        sourceIds: ['archive-refinement-note'],
      },
      availability: 'hiddenUntilConfirmed',
    },
  ],
  heroMediaId: 'napoleon-generated-card-v3',
  media: [
    {
      id: 'napoleon-generated-card-v3',
      type: 'image',
      path: '/images/recipes/gluten-free-napoleon-card-v3.webp',
      usage: ['hero', 'gallery'],
      alt: {
        uk: 'Безглютеновий торт Наполеон із шістьма тонкими коржами, заварним кремом і горіхами',
        en: 'Gluten-free Napoleon cake with six thin layers, custard and nuts',
        es: 'Tarta Napoleón sin gluten con seis capas finas, crema pastelera y frutos secos',
      },
    },
    {
      id: 'napoleon-butter-ready-v1',
      type: 'image',
      path: '/media/recipes/gluten-free-napoleon/selected/cold-butter-ready-example-v1.webp',
      usage: ['step'],
      alt: {
        uk: 'Холодні кубики масла поруч із сухою сумішшю в чаші комбайна',
        en: 'Cold butter cubes beside the dry mixture in a food processor',
        es: 'Dados de mantequilla fría junto a la mezcla seca en el robot de cocina',
      },
    },
    {
      id: 'napoleon-butter-early-pulse-v1',
      type: 'image',
      path: '/media/recipes/gluten-free-napoleon/selected/cold-butter-early-pulse-example-v1.webp',
      usage: ['step'],
      alt: {
        uk: 'Шматочки масла, частково вкриті борошном після кількох імпульсів',
        en: 'Butter pieces partly coated in flour after a few pulses',
        es: 'Trozos de mantequilla parcialmente cubiertos de harina tras varios impulsos',
      },
    },
    {
      id: 'napoleon-butter-crumb-v1',
      type: 'image',
      path: '/media/recipes/gluten-free-napoleon/selected/cold-butter-crumb-example-v1.webp',
      usage: ['step'],
      alt: {
        uk: 'Неоднорідна борошняна крихта з піщаними частинками й шматочками масла',
        en: 'Uneven flour crumb with sandy particles and visible pieces of butter',
        es: 'Miga de harina irregular con partículas arenosas y trozos visibles de mantequilla',
      },
    },
    {
      id: 'napoleon-wet-mixture-v1',
      type: 'image',
      path: '/media/recipes/gluten-free-napoleon/selected/wet-mixture-smooth-example-v1.webp',
      usage: ['step'],
      alt: {
        uk: 'Однорідна суміш яєць, кисломолочного продукту, олії та лимонного соку',
        en: 'Smooth mixture of eggs, cultured dairy, oil and lemon juice',
        es: 'Mezcla homogénea de huevos, lácteo fermentado, aceite y zumo de limón',
      },
    },
    {
      id: 'napoleon-pour-wet-v1',
      type: 'image',
      path: '/media/recipes/gluten-free-napoleon/selected/pour-wet-into-crumb-example-v1.webp',
      usage: ['step'],
      alt: {
        uk: 'Рідку суміш вливають у борошняно-масляну крихту',
        en: 'Wet mixture being poured into the flour and butter crumb',
        es: 'La mezcla líquida se vierte sobre la miga de harina y mantequilla',
      },
    },
    {
      id: 'napoleon-dough-clumps-v1',
      type: 'image',
      path: '/media/recipes/gluten-free-napoleon/selected/pliable-dough-clumps-example-v1.webp',
      usage: ['step'],
      alt: {
        uk: 'Пластичне тісто зібралося м’якими грудками в чаші комбайна',
        en: 'Pliable dough gathered into soft clumps in the food processor',
        es: 'Masa maleable reunida en grumos suaves en el robot de cocina',
      },
    },
    {
      id: 'napoleon-dough-discs-v3',
      type: 'image',
      path: '/media/recipes/gluten-free-napoleon/selected/dough-discs-v3.webp',
      usage: ['step'],
      alt: {
        uk: 'Дванадцять однакових дисків тіста, окремо загорнутих для охолодження',
        en: 'Twelve even dough discs individually wrapped for chilling',
        es: 'Doce discos de masa iguales envueltos individualmente para refrigerarlos',
      },
    },
    {
      id: 'napoleon-rolled-layer-v3',
      type: 'image',
      path: '/media/recipes/gluten-free-napoleon/selected/rolled-layer-parchment-v3.webp',
      usage: ['step'],
      alt: {
        uk: 'Тонкий круглий корж діаметром 28 см, проколотий виделкою на пергаменті, поруч обрізки',
        en: 'A thin 28 cm round layer pricked with a fork on parchment with scraps beside it',
        es: 'Una capa redonda fina de 28 cm pinchada con tenedor sobre papel de horno, con recortes al lado',
      },
    },
    {
      id: 'napoleon-baked-layer-v3',
      type: 'image',
      path: '/media/recipes/gluten-free-napoleon/selected/baked-layer-light-golden-v3.webp',
      usage: ['step'],
      alt: {
        uk: 'Світло-золотистий спечений корж Наполеона з обрізками на пергаменті',
        en: 'Light-golden baked Napoleon layer with scraps on parchment',
        es: 'Capa horneada de Napoleón ligeramente dorada con recortes sobre papel de horno',
      },
    },
    {
      id: 'napoleon-finished-custard-v3',
      type: 'image',
      path: '/media/recipes/gluten-free-napoleon/selected/finished-custard-v3.webp',
      usage: ['step'],
      alt: {
        uk: 'Густий гладкий ванільний заварний крем після додавання масла',
        en: 'Thick smooth vanilla custard after the butter has been added',
        es: 'Crema pastelera de vainilla espesa y lisa después de añadir la mantequilla',
      },
    },
    {
      id: 'napoleon-round-six-layer-assembly-v3',
      type: 'image',
      path: '/media/recipes/gluten-free-napoleon/selected/round-six-layer-assembly-v3.webp',
      usage: ['step'],
      alt: {
        uk: 'Теплий крем розподіляють по круглому коржу під час складання шестишарового Наполеона',
        en: 'Warm custard being spread over a round layer while assembling a six-layer Napoleon cake',
        es: 'Crema templada extendida sobre una capa redonda durante el montaje de una tarta Napoleón de seis capas',
      },
    },
  ],
  relatedRecipeIds: [],
  sources: [
    {
      id: 'inventory-row',
      file: 'docs/reference/recipe-inventory.xlsx',
      locator: 'Recipe Inventory!A12:R12',
    },
    {
      id: 'archive-recipe',
      file: 'docs/reference/recipe-inventory.xlsx',
      locator: 'Recipe Archive!A74:B82',
    },
    {
      id: 'archive-refinement-note',
      file: 'docs/reference/recipe-inventory.xlsx',
      locator: 'Recipe Archive!A83:B83',
    },
    {
      id: 'archive-status-note',
      file: 'docs/reference/recipe-inventory.xlsx',
      locator: 'Recipe Archive!A84:B84',
    },
    {
      id: 'author-update',
      file: 'Current ChatGPT conversation',
      locator: 'Author confirmations through 2026-09-20',
    },
    {
      id: 'ux-form-example',
      file: 'docs/reference/UX-IA-Specification-v1.md',
      locator: 'Napoleon form example',
    },
  ],
  contentGaps: [
    {
      id: 'confirm-dairy-choice',
      area: 'ingredient',
      field: 'ingredientSections.layers.cultured-dairy-dough',
      question:
        'Which cultured dairy is the default, and have both sour cream and thick natural yoghurt been tested?',
      publicationBlocking: false,
      sourceIds: ['archive-recipe'],
    },
    {
      id: 'validate-24cm-form',
      area: 'form',
      field: 'geometry.alternatives.round-24cm-preview',
      question:
        'Bake-test the calculated 24 cm configuration before enabling Cook Mode for that adaptation.',
      publicationBlocking: false,
      sourceIds: ['ux-form-example'],
    },
    {
      id: 'review-translations',
      area: 'translation',
      field: 'translationState.en/es',
      question: 'Human-review the EN and ES recipe wording and SEO slugs.',
      publicationBlocking: false,
      sourceIds: ['archive-recipe'],
    },
    {
      id: 'record-storage',
      area: 'storage',
      field: 'storage',
      question:
        'Record storage instructions beyond the 12–24 hour maturation period.',
      publicationBlocking: false,
      sourceIds: ['archive-recipe'],
    },
  ],
} satisfies RecipeDraft;
