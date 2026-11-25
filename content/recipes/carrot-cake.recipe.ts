import type {
  IngredientLine,
  IngredientQuantity,
  LocalizedText,
  Recipe,
  RecipeMedia,
} from './recipe.types.ts';
import { quantityFromGrams } from './spoon-weights.ts';

const localized = (uk: string, en: string, es: string): LocalizedText => ({
  uk,
  en,
  es,
});
const source = {
  id: 'carrot-cake-author-2026-11-25',
  file: 'Bake Again Media/carrot-cake/originals',
  locator:
    'Рецепт і результат випікання від Саші 25.11.2026. Авторські фото IMG_2810–IMG_2839.',
};
const tested = { state: 'tested' as const, sourceIds: [source.id] };

function ingredient(
  id: string,
  name: LocalizedText,
  quantity: IngredientQuantity,
): IngredientLine {
  return { id, options: [{ ingredientId: id, name }], quantity };
}
const grams = (value: number): IngredientQuantity => ({
  base: { kind: 'exact', value, unit: 'g' },
  shopping: { mode: 'base' },
});

function photo(
  id: string,
  filename: string,
  alt: LocalizedText,
  label?: LocalizedText,
): RecipeMedia {
  return {
    id,
    type: 'image',
    usage: ['step'],
    fit: 'cover',
    path: `/media/recipes/carrot-cake/selected/${filename}`,
    alt,
    ...(label && { title: label }),
  };
}

export const carrotCakeRecipe: Recipe = {
  schemaVersion: 3,
  id: 'carrot-cake',
  publicationStatus: 'published',
  slug: {
    en: 'carrot-cake',
    es: 'carrot-cake',
    uk: 'carrot-cake',
  },
  categoryIds: [],
  situationIds: [],
  difficulty: 'medium',
  routeSlug: 'carrot-cake',
  versionId: 'carrot-cake-v2',
  title: localized(
    'Безглютеновий морквяний кекс',
    'Gluten-free carrot loaf cake',
    'Bizcocho de zanahoria sin gluten',
  ),
  summary: localized(
    'Цей ніжний морквяний кекс із волоськими горіхами й родзинками добре ріжеться на скибочки. У тісті є дріжджі, тому перед випіканням дай йому піднятися просто у формі.',
    'This tender carrot loaf is studded with walnuts and raisins and slices neatly once cool. The batter contains yeast, so give it time to rise in the tin before baking.',
    'Este bizcocho de zanahoria con nueces y pasas queda tierno y se corta bien en rebanadas una vez frío. La masa lleva levadura de panadería, así que déjala subir en el molde antes de hornear.',
  ),
  translationState: { uk: 'reviewed', en: 'reviewed', es: 'reviewed' },
  translationReview: {
    date: '2026-11-25',
    reviewer: 'implementation',
    scope:
      'Мовна редактура української версії та звірка EN/ES з авторськими кроками, пропорціями й фото від 25.11.2026.',
  },
  sources: [source],
  baseProvenance: tested,
  yield: {
    default: {
      id: 'one-cake',
      label: {
        en: '1 cake',
        es: '1 bizcocho',
        uk: '1 кекс',
      },
      count: {
        kind: 'exact',
        value: 1,
      },
      unit: 'cake',
      provenance: tested,
      availability: 'default',
    },
    alternatives: [],
  },
  geometry: {
    state: 'known',
    default: {
      id: 'carrot-cake-base',
      shape: 'other',
      kind: 'bakingPan',
      application: 'bake-in',
      diameterCm: null,
      layerCount: null,
      material: null,
      availability: 'default',
      label: localized(
        'Прямокутна форма для кексу',
        'Loaf tin',
        'Molde rectangular para bizcocho',
      ),
      provenance: tested,
    },
    alternatives: [],
  },
  configuration: {
    base: {
      geometryId: 'carrot-cake-base',
      yieldId: 'one-cake',
      batchScale: 1,
    },
    geometryAdjustment: null,
    quantityAdjustment: {
      batchScale: {
        allowed: [0.5, 1, 1.5, 2],
      },
      useWhatIHave: {
        scalingAnchors: [
          {
            ingredientLineId: 'carrots',
            allowedUnit: 'g',
          },
        ],
      },
    },
    ingredientScaling: {
      default: {
        kind: 'linear',
      },
    },
  },
  beforeStart: [],
  flourConfiguration: {
    basis: 'commercialMix',
    commercialMixLineId: 'flour',
    testedAlternativeMixes: [],
    knownUnsupportedMixes: [],
    additionalStarchLineIds: ['tapioca-starch'],
    provenance: tested,
  },
  timing: {
    activeMinutes: 30,
    totalElapsedMinutes: 120,
    planningNote: {
      text: localized(
        '(з урахуванням вистоювання і випікання)',
        '(including rising and baking)',
        '(incluye el levado y el horneado)',
      ),
    },
    phases: [
      {
        id: 'soak-raisins',
        relatedStepId: 'prepare-add-ins',
        label: localized(
          'Замочування родзинок',
          'Soaking the raisins',
          'Remojo de las pasas',
        ),
        duration: { kind: 'exact', value: 5, unit: 'minute' },
      },
      {
        id: 'proof',
        relatedStepId: 'proof-in-tin',
        label: localized('Вистоювання', 'Rising', 'Levado'),
        duration: { kind: 'exact', value: 1, unit: 'hour' },
      },
      {
        id: 'baking',
        relatedStepId: 'bake',
        label: localized('Випікання', 'Baking', 'Horneado'),
        duration: { kind: 'range', min: 30, max: 40, unit: 'minute' },
      },
    ],
  },
  equipment: [
    {
      id: 'parchment',
      name: localized('пергамент', 'baking parchment', 'papel de horno'),
    },
    { id: 'grater', name: localized('тертка', 'grater', 'rallador') },
    {
      id: 'blender',
      name: localized('блендер', 'hand blender', 'batidora de mano'),
    },
    { id: 'whisk', name: localized('вінчик', 'whisk', 'varillas') },
    { id: 'spoon', name: localized('ложка', 'spoon', 'cuchara') },
    {
      id: 'skewer',
      name: localized(
        'дерев’яна шпажка',
        'wooden skewer',
        'brocheta de madera',
      ),
    },
  ],
  ingredientSections: [
    {
      id: 'cake',
      title: localized(
        'Морквяний кекс',
        'Carrot loaf cake',
        'Bizcocho de zanahoria',
      ),
      lines: [
        ingredient(
          'carrots',
          localized(
            'Очищена сира морква',
            'Raw carrots, peeled',
            'Zanahoria cruda pelada',
          ),
          grams(200),
        ),
        ingredient(
          'oil',
          localized('Олія без запаху', 'Neutral oil', 'Aceite de sabor suave'),
          {
            ...grams(55),
            equivalent: { kind: 'exact', value: 60, unit: 'ml' },
          },
        ),
        ingredient(
          'butter',
          localized('Вершкове масло', 'Butter', 'Mantequilla'),
          grams(45),
        ),
        ingredient('eggs', localized('Яйця', 'Eggs', 'Huevos'), {
          base: { kind: 'exact', value: 3, unit: 'piece' },
          shopping: { mode: 'base', increment: 1, rounding: 'up' },
        }),
        ingredient(
          'sugar',
          localized('Цукор', 'Sugar', 'Azúcar'),
          quantityFromGrams('granulated-sugar', 100),
        ),
        ingredient(
          'flour',
          localized(
            'Безглютенова суміш Schär Mix B',
            'Schär Mix B gluten-free bread mix',
            'Preparado panificable sin gluten Schär Mix B',
          ),
          quantityFromGrams('schar-mix-b', 180),
        ),
        ingredient(
          'tapioca-starch',
          localized(
            'Тапіоковий крохмаль',
            'Tapioca starch',
            'Almidón de tapioca',
          ),
          quantityFromGrams('tapioca-starch', 20),
        ),
        ingredient(
          'yeast',
          localized(
            'Сухі швидкодійні дріжджі',
            'Instant yeast',
            'Levadura seca instantánea de panadería',
          ),
          grams(5),
        ),
        ingredient(
          'baking-powder',
          localized(
            'Безглютеновий розпушувач',
            'Gluten-free baking powder',
            'Impulsor químico sin gluten',
          ),
          quantityFromGrams('baking-powder', 4),
        ),
        ingredient(
          'salt',
          localized('Сіль', 'Salt', 'Sal'),
          quantityFromGrams('fine-salt', 1.5),
        ),
        ingredient(
          'nuts',
          localized('Волоські горіхи', 'Walnuts', 'Nueces'),
          grams(100),
        ),
        ingredient(
          'raisins',
          localized('Родзинки', 'Raisins', 'Pasas'),
          grams(80),
        ),
      ],
    },
  ],
  steps: [
    {
      id: 'prepare-add-ins',
      title: localized(
        'Підготуй форму, горіхи й родзинки',
        'Line the tin and prepare the walnuts and raisins',
        'Forra el molde y prepara las nueces y las pasas',
      ),
      instruction: localized(
        'Дно й боки форми застели пергаментом. Замочи родзинки у воді на 5 хвилин, потім відціди й обсуши. Порубай волоські горіхи невеликими шматочками.',
        'Line the base and sides of the loaf tin with baking parchment. Soak the raisins in water for 5 minutes, then drain and pat dry. Roughly chop the walnuts.',
        'Forra la base y las paredes del molde con papel de horno. Deja las pasas en remojo en agua durante 5 minutos, escúrrelas y sécalas. Trocea las nueces.',
      ),
      ingredientLineIds: ['raisins', 'nuts'],
      equipmentIds: ['parchment'],
      durationPhaseId: 'soak-raisins',
      mediaIds: ['lined-tin', 'add-ins'],
    },
    {
      id: 'carrot-base',
      title: localized(
        'Приготуй морквяну основу',
        'Make the carrot purée',
        'Prepara el puré de zanahoria',
      ),
      instruction: localized(
        'Розтопи вершкове масло. Натри моркву, додай олію та розтоплене масло. Подрібни блендером до однорідного пюре. Додай яйця й цукор і перемішай вінчиком.',
        'Melt the butter. Grate the carrots, add the oil and melted butter, then blend to a smooth purée. Add the eggs and sugar to the purée and whisk to combine.',
        'Derrite la mantequilla. Ralla la zanahoria, añade el aceite y la mantequilla derretida y tritura con la batidora hasta obtener un puré homogéneo. Incorpora los huevos y el azúcar al puré y mezcla con unas varillas.',
      ),
      ingredientLineIds: ['butter', 'carrots', 'oil', 'eggs', 'sugar'],
      equipmentIds: ['grater', 'blender', 'whisk'],
      mediaIds: ['grated-carrots', 'blend-carrots', 'carrot-base'],
    },
    {
      id: 'mix-dry',
      title: localized(
        'Змішай сухі інгредієнти',
        'Mix the dry ingredients',
        'Mezcla los ingredientes secos',
      ),
      instruction: localized(
        'В окремій мисці змішай Schär Mix B, тапіоковий крохмаль, дріжджі, розпушувач і сіль.',
        'In a separate bowl, mix the Schär Mix B, tapioca starch, instant yeast, baking powder and salt.',
        'En otro bol, mezcla el preparado Schär Mix B, el almidón de tapioca, la levadura de panadería, el impulsor químico y la sal.',
      ),
      ingredientLineIds: [
        'flour',
        'tapioca-starch',
        'yeast',
        'baking-powder',
        'salt',
      ],
    },
    {
      id: 'mix-and-fill',
      title: localized(
        'Замішай тісто й виклади у форму',
        'Mix the batter and fill the tin',
        'Mezcla la masa y pásala al molde',
      ),
      instruction: localized(
        'Додай сухі інгредієнти до морквяної основи й перемішай до однорідності. Ложкою вмішай горіхи та родзинки. Переклади тісто у форму й розрівняй поверхню.',
        'Stir the dry ingredients into the carrot mixture until smooth. Fold in the walnuts and raisins with a spoon. Transfer the batter to the lined tin and level the top.',
        'Añade los ingredientes secos a la mezcla de zanahoria y remueve hasta que no queden grumos. Incorpora las nueces y las pasas con una cuchara. Pasa la masa al molde y alisa la superficie.',
      ),
      ingredientLineIds: ['nuts', 'raisins'],
      equipmentIds: ['spoon'],
      mediaIds: ['dry-into-carrot-base', 'fold-add-ins', 'filled-tin'],
    },
    {
      id: 'proof-in-tin',
      title: localized(
        'Дай тісту піднятися у формі',
        'Let the batter rise in the tin',
        'Deja que la masa suba en el molde',
      ),
      instruction: localized(
        'Постав форму у вимкнену духовку разом із мискою гарячої води. Можна також увімкнути духовку на 30–40 °C, щоб тісто піднялося швидше. Воно готове до випікання, коли збільшиться вдвічі.',
        'Place the tin in the switched-off oven with a bowl of hot water beside it. Alternatively, set the oven to 30–40 °C for a quicker rise. The batter is ready to bake when it has doubled in volume.',
        'Mete el molde en el horno apagado con un cuenco de agua caliente al lado. También puedes poner el horno a 30–40 °C para que la masa suba más deprisa. Estará lista para hornear cuando haya doblado su volumen.',
      ),
      ingredientLineIds: [],
      durationPhaseId: 'proof',
      displayMeta: localized('Близько 1 год', 'About 1 hr', 'Aprox. 1 h'),
      timeBesideNumber: true,
      mediaIds: ['before-proof', 'after-proof'],
    },
    {
      id: 'bake',
      title: localized(
        'Випечи кекс і дай йому охолонути',
        'Bake the loaf and let it cool',
        'Hornea el bizcocho y deja que se enfríe',
      ),
      instruction: localized(
        'Залиш форму в духовці. Щойно виставиш 175 °C, починай відлік 30–40 хвилин.',
        'Leave the tin in the oven. Set the temperature to 175 °C and start timing the 30–40 minutes straight away.',
        'Deja el molde dentro del horno. Ponlo a 175 °C y empieza a contar los 30–40 minutos desde ese momento.',
      ),
      guidance: [
        {
          id: 'bake-checkpoint',
          kind: 'checkpoint',
          text: localized(
            'Встроми дерев’яну шпажку в середину кексу. Вона має вийти без слідів сирого тіста. Дай кексу повністю охолонути, а тоді нарізай.',
            'Insert a wooden skewer into the centre of the loaf. It should come out free of wet batter. Let the loaf cool completely before slicing.',
            'Pincha el centro del bizcocho con una brocheta de madera. Debe salir sin restos de masa cruda. Deja que el bizcocho se enfríe del todo antes de cortarlo.',
          ),
        },
      ],
      equipmentIds: ['skewer'],
      ingredientLineIds: [],
      durationPhaseId: 'baking',
      displayMeta: localized('30–40 хв', '30–40 min', '30–40 min'),
      timeBesideNumber: true,
      temperature: { value: 175, unit: 'C', ovenMode: null },
    },
  ],
  makeAhead: null,
  storage: null,
  variations: [],
  relatedRecipeIds: [],
  contentGaps: [],
  presentation: 'concise',
  evidenceExplanation: {
    en: 'This exact version has been baked successfully.',
    es: 'Esta versión se ha horneado con éxito.',
    uk: 'Цю версію успішно випікали.',
  },
  heroMediaId: 'sliced-loaf',
  cardMediaId: 'sliced-loaf',
  media: [
    {
      id: 'sliced-loaf',
      type: 'image',
      path: '/images/recipes/carrot-cake-slice-soft-close-v3.webp',
      usage: ['hero', 'card'],
      fit: 'contain',
      alt: localized(
        'Морквяний кекс на дерев’яній дощечці, на зрізі видно горіхи й родзинки',
        'Sliced carrot loaf on a wooden board, with walnuts and raisins visible in the crumb',
        'Bizcocho de zanahoria en una tabla de madera, con nueces y pasas visibles en el corte',
      ),
    },
    photo(
      'lined-tin',
      'lined-tin-v1.webp',
      localized(
        'Прямокутна форма, вистелена пергаментом',
        'Loaf tin lined with baking parchment',
        'Molde rectangular forrado con papel de horno',
      ),
    ),
    photo(
      'add-ins',
      'walnuts-raisins-v4.webp',
      localized(
        'Порубані волоські горіхи та родзинки на тарілці',
        'Chopped walnuts and raisins on a plate',
        'Nueces troceadas y pasas en un plato',
      ),
    ),
    photo(
      'grated-carrots',
      'grated-carrots-v1.webp',
      localized(
        'Натерта морква, поруч олія та розтоплене масло',
        'Grated carrots beside bowls of oil and melted butter',
        'Zanahoria rallada junto al aceite y la mantequilla derretida',
      ),
    ),
    photo(
      'blend-carrots',
      'blend-carrots-v2.webp',
      localized(
        'Занурювальний блендер у мисці з тертою морквою',
        'Hand blender in a bowl of grated carrots',
        'Batidora de mano en un bol con zanahoria rallada',
      ),
    ),
    photo(
      'carrot-base',
      'carrot-base-v2.webp',
      localized(
        'Вінчики в однорідній морквяній суміші',
        'Mixer beaters in the smooth carrot mixture',
        'Varillas en la mezcla homogénea de zanahoria',
      ),
    ),
    photo(
      'dry-into-carrot-base',
      'dry-into-carrot-base-v1.webp',
      localized(
        'Суха суміш по краях миски з морквяною основою',
        'Dry flour mix around the edge of the carrot mixture',
        'Mezcla de harina aún visible en los bordes del bol con la zanahoria',
      ),
    ),
    photo(
      'fold-add-ins',
      'fold-in-nuts-v2.webp',
      localized(
        'Горіхи та родзинки на поверхні морквяного тіста',
        'Walnuts and raisins on top of the carrot batter',
        'Nueces y pasas sobre la masa de zanahoria',
      ),
    ),
    photo(
      'filled-tin',
      'filled-tin-v2.webp',
      localized(
        'Тісто з розрівняною поверхнею у формі',
        'Carrot batter spread evenly in the lined tin',
        'Masa de zanahoria con la superficie alisada en el molde',
      ),
    ),
    photo(
      'before-proof',
      'before-proof-v2.webp',
      localized(
        'Форма з тістом на решітці духовки, поруч миска з водою',
        'Tin of batter on the oven rack beside a bowl of water',
        'Molde con la masa sobre la rejilla del horno junto a un cuenco con agua',
      ),
      localized('На початку вистоювання', 'Before rising', 'Antes del levado'),
    ),
    photo(
      'after-proof',
      'after-proof-v2.webp',
      localized(
        'Тісто піднялося майже до країв форми',
        'Risen batter reaching almost to the rim of the tin',
        'Masa levada que llega casi al borde del molde',
      ),
      localized('Після вистоювання', 'After rising', 'Después del levado'),
    ),
  ],
  discovery: {
    cardTitle: {
      en: 'Carrot cake',
      es: 'Bizcocho de zanahoria',
      uk: 'Морквяний кекс',
    },
    category: {
      en: 'Cake',
      es: 'Bizcocho',
      uk: 'Кекс',
    },
    catalogue: true,
    sourceTitle: 'Морквяний кекс',
    launchPriority: 'Medium',
    heroCandidate: 'No',
    archiveSections: [
      {
        title: 'Ingredients · original notes',
        content:
          'Морква — 500–600 г\nОлія — 300 мл\nЯйця — 8 шт.\nЦукор — 300 г\nБорошно — 500 г\nРозпушувач — 16 г\nСіль — 4 г\nГрецькі горіхи — 300 г (2 пачки)\nРодзинки — 250 г (1 пачка)',
      },
      {
        title: 'Method · original notes',
        content:
          '1. Натерти моркву і збити її блендером з олією.\n2. Яйця з цукром збити до густої піни.\n3. Змішати борошно, розпушувач і сіль; додати до рідких інгредієнтів.\n4. Додати замочені родзинки та горіхи.\n5. Змастити форму маслом і вилити тісто. Запис: «Тут на 3 кекси».\n6. Випікати при 200°C 35–40 хв.',
      },
    ],
    imageKind: 'edited-author-photo',
    collectionIds: ['everyday'],
    flourSummary: localized('Schär Mix B', 'Schär Mix B', 'Schär Mix B'),
    source: source.locator,
    needsBeforePublishing: 'Точні розміри форми не зазначено.',
  },
  searchMetadata: {
    datePublished: null,
    dateModified: '2026-11-25',
    dateModifiedVersionId: 'carrot-cake-v2',
    cookTimeMinutes: 40,
    recipeCuisine: { uk: null, en: null, es: null },
    keywords: {
      uk: ['волоські горіхи', 'родзинки', 'Schär Mix B', 'тапіоковий крохмаль'],
      en: ['walnuts', 'raisins', 'Schär Mix B', 'tapioca starch'],
      es: ['nueces', 'pasas', 'Schär Mix B', 'almidón de tapioca'],
    },
  },
  seo: {
    uk: {
      title: 'Безглютеновий морквяний кекс із горіхами й родзинками',
      description:
        'Морквяний кекс без глютену з волоськими горіхами й родзинками. Рецепт на суміші Schär Mix B з покроковими фото тіста до й після вистоювання.',
    },
    en: {
      title: 'Gluten-free carrot loaf cake with walnuts and raisins',
      description:
        'Bake a tender gluten-free carrot loaf with Schär Mix B, walnuts and raisins. Step-by-step photos show how far the batter should rise in the tin before baking.',
    },
    es: {
      title: 'Bizcocho de zanahoria sin gluten con nueces y pasas',
      description:
        'Prepara un bizcocho de zanahoria sin gluten con Schär Mix B, nueces y pasas. Las fotos paso a paso muestran cuánto debe subir la masa antes de hornearla.',
    },
  },
};
