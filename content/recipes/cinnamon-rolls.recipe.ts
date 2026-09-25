import type {
  RecipeSourceDraft,
  RecipeSourceDraftContent,
} from './source-recipe.types.ts';
import { quantityFromGrams, quantityFromSpoons } from './spoon-weights.ts';

type Locale = 'en' | 'es' | 'uk';
type Copy = Record<Locale, string>;

const tr = (locale: Locale, copy: Copy) => copy[locale];
const exact = (value: number, unit: 'g' | 'ml' | 'piece' | 'tsp' | 'tbsp') => ({
  base: { kind: 'exact' as const, value, unit },
  shopping: { mode: 'base' as const },
});
const nameOnly = () => ({
  base: null,
  shopping: { mode: 'nameOnly' as const },
});

const stepMedia = (
  locale: Locale,
  id: string,
  filename: string,
  alt: Copy,
  title: Copy,
  caption: Copy,
) => [
  {
    id,
    src: `/media/recipes/cinnamon-rolls/selected/${filename}`,
    alt: tr(locale, alt),
    title: tr(locale, title),
    caption: tr(locale, caption),
  },
];

function ingredientSections(locale: Locale) {
  return [
    {
      id: 'dough',
      title: tr(locale, { en: 'Dough', es: 'Masa', uk: 'Тісто' }),
      ingredients: [
        {
          id: 'eggs',
          name: tr(locale, {
            en: 'Large eggs',
            es: 'Huevos L',
            uk: 'Великі яйця',
          }),
          quantity: exact(4, 'piece'),
        },
        {
          id: 'dry-yeast',
          name: tr(locale, {
            en: "Dry baker's yeast",
            es: 'Levadura seca de panadería',
            uk: 'Сухі хлібопекарські дріжджі',
          }),
          quantity: exact(15, 'g'),
        },
        {
          id: 'honey-or-agave',
          name: tr(locale, {
            en: 'Honey or agave syrup',
            es: 'Miel o sirope de agave',
            uk: 'Мед або сироп агави',
          }),
          quantity: exact(120, 'g'),
          note: tr(locale, {
            en: 'Reserve 1 tbsp to activate the yeast',
            es: 'Reserva 1 cucharada para activar la levadura',
            uk: '1 ст. л. залишити для активації дріжджів',
          }),
        },
        {
          id: 'vanilla',
          name: tr(locale, {
            en: 'Vanilla paste or extract',
            es: 'Pasta o extracto de vainilla',
            uk: 'Ванільна паста або екстракт',
          }),
          quantity: exact(1, 'tbsp'),
        },
        {
          id: 'butter',
          name: tr(locale, {
            en: 'Butter',
            es: 'Mantequilla',
            uk: 'Вершкове масло',
          }),
          quantity: exact(160, 'g'),
          note: tr(locale, {
            en: 'Softened',
            es: 'En pomada',
            uk: 'М’яке',
          }),
        },
        {
          id: 'water-or-milk',
          name: tr(locale, {
            en: 'Water or milk',
            es: 'Agua o leche',
            uk: 'Вода або молоко',
          }),
          quantity: exact(120, 'g'),
          note: tr(locale, {
            en: 'The source uses lukewarm almond milk',
            es: 'La fuente usa leche de almendra templada',
            uk: 'У джерелі використане тепле мигдальне молоко',
          }),
        },
        {
          id: 'corn-starch',
          name: tr(locale, {
            en: 'Corn starch',
            es: 'Almidón de maíz',
            uk: 'Кукурудзяний крохмаль',
          }),
          quantity: quantityFromGrams('corn-starch', 240),
        },
        {
          id: 'tapioca-starch',
          name: tr(locale, {
            en: 'Tapioca starch',
            es: 'Almidón de tapioca',
            uk: 'Тапіоковий крохмаль',
          }),
          quantity: quantityFromGrams('tapioca-starch', 120),
        },
        {
          id: 'rice-flour',
          name: tr(locale, {
            en: 'Rice flour',
            es: 'Harina de arroz',
            uk: 'Рисове борошно',
          }),
          quantity: exact(140, 'g'),
        },
        {
          id: 'baking-powder',
          name: tr(locale, {
            en: 'Baking powder',
            es: 'Levadura química',
            uk: 'Розпушувач',
          }),
          quantity: quantityFromGrams('baking-powder', 15),
        },
        {
          id: 'xanthan',
          name: tr(locale, {
            en: 'Xanthan gum',
            es: 'Goma xantana',
            uk: 'Ксантанова камедь',
          }),
          quantity: quantityFromGrams('xanthan-gum', 12),
        },
        {
          id: 'salt',
          name: tr(locale, { en: 'Salt', es: 'Sal', uk: 'Сіль' }),
          quantity: quantityFromSpoons('fine-salt', 1, 'tsp'),
        },
      ],
    },
    {
      id: 'cinnamon-filling',
      title: tr(locale, {
        en: 'Filling option 1 · cinnamon',
        es: 'Relleno opción 1 · canela',
        uk: 'Начинка 1 · кориця',
      }),
      ingredients: [
        {
          id: 'filling-sugar',
          name: tr(locale, {
            en: 'Coconut, panela or brown sugar',
            es: 'Azúcar de coco, panela o azúcar moreno',
            uk: 'Кокосовий, тростинний або коричневий цукор',
          }),
          quantity: exact(4, 'tbsp'),
          optional: true,
        },
        {
          id: 'cinnamon',
          name: tr(locale, {
            en: 'Ground cinnamon',
            es: 'Canela molida',
            uk: 'Мелена кориця',
          }),
          quantity: exact(2, 'tsp'),
          optional: true,
        },
        {
          id: 'filling-butter',
          name: tr(locale, {
            en: 'Butter',
            es: 'Mantequilla',
            uk: 'Вершкове масло',
          }),
          quantity: exact(50, 'g'),
          note: tr(locale, {
            en: 'Softened; enough for a generous coating',
            es: 'En pomada; suficiente para una capa generosa',
            uk: 'М’яке; достатньо для щедрого шару',
          }),
          optional: true,
        },
      ],
    },
    {
      id: 'cocoa-filling',
      title: tr(locale, {
        en: 'Filling option 2 · cocoa and peanut',
        es: 'Relleno opción 2 · cacao y cacahuete',
        uk: 'Начинка 2 · какао й арахіс',
      }),
      ingredients: [
        {
          id: 'cocoa-peanut-spread',
          name: tr(locale, {
            en: 'Cocoa-peanut spread',
            es: 'Crema de cacao y cacahuete',
            uk: 'Какао-арахісова паста',
          }),
          quantity: nameOnly(),
          optional: true,
        },
        {
          id: 'dark-chocolate-chips',
          name: tr(locale, {
            en: '80% dark chocolate chips',
            es: 'Pepitas de chocolate negro al 80%',
            uk: 'Краплі з чорного шоколаду 80%',
          }),
          quantity: nameOnly(),
          optional: true,
        },
      ],
    },
    {
      id: 'cream-cheese-glaze',
      title: tr(locale, {
        en: 'Optional cream-cheese glaze',
        es: 'Glaseado opcional de queso crema',
        uk: 'Необов’язкова глазур із крем-сиру',
      }),
      ingredients: [
        {
          id: 'cream-cheese',
          name: tr(locale, {
            en: 'Cream cheese',
            es: 'Queso crema',
            uk: 'Крем-сир',
          }),
          quantity: exact(100, 'g'),
          optional: true,
        },
        {
          id: 'icing-sugar',
          name: tr(locale, {
            en: 'Icing sugar',
            es: 'Azúcar glas',
            uk: 'Цукрова пудра',
          }),
          quantity: quantityFromGrams('powdered-sugar', 100),
          optional: true,
        },
        {
          id: 'glaze-water',
          name: tr(locale, {
            en: 'Hot water',
            es: 'Agua caliente',
            uk: 'Гаряча вода',
          }),
          quantity: exact(30, 'ml'),
          optional: true,
        },
      ],
    },
  ];
}

function recipeContent(locale: Locale): RecipeSourceDraftContent {
  return {
    completeness: 'readyToReview',
    evidence: {
      status: 'tested',
      explanation: tr(locale, {
        en: 'The author confirms using this source recipe. The exact filling and finish used still need to be recorded.',
        es: 'La autora confirma que utilizó esta receta fuente. Aún falta registrar el relleno y el acabado exactos que usó.',
        uk: 'Авторка підтвердила, що готувала за цим рецептом-джерелом. Ще потрібно записати, яку саме начинку та фініш вона використала.',
      }),
    },
    geometry: {
      id: 'round-baking-dish',
      label: tr(locale, {
        en: 'Round baking dish · size to confirm',
        es: 'Fuente redonda · tamaño por confirmar',
        uk: 'Кругла форма · розмір потрібно уточнити',
      }),
      kind: 'bakingPan',
      application: 'bake-in',
      shape: 'round',
      diameterCm: null,
    },
    timing: {
      activeMinutes: null,
      totalElapsedMinutes: null,
      phases: [
        {
          id: 'activate-yeast',
          label: tr(locale, {
            en: 'Activate yeast',
            es: 'Activar la levadura',
            uk: 'Активація дріжджів',
          }),
          duration: { kind: 'exact', value: 10, unit: 'minute' },
          relatedStepId: 'activate-yeast',
        },
        {
          id: 'mix-dough',
          label: tr(locale, {
            en: 'Mix dough',
            es: 'Amasar la masa',
            uk: 'Замішування тіста',
          }),
          duration: { kind: 'exact', value: 5, unit: 'minute' },
          relatedStepId: 'mix-dough',
        },
        {
          id: 'first-proof',
          label: tr(locale, {
            en: 'First proof',
            es: 'Primer levado',
            uk: 'Перший підйом',
          }),
          duration: { kind: 'exact', value: 1, unit: 'hour' },
          relatedStepId: 'first-proof',
        },
        {
          id: 'second-proof',
          label: tr(locale, {
            en: 'Second proof',
            es: 'Segundo levado',
            uk: 'Другий підйом',
          }),
          duration: { kind: 'range', min: 40, max: 60, unit: 'minute' },
          relatedStepId: 'second-proof',
        },
        {
          id: 'bake',
          label: tr(locale, {
            en: 'Bake',
            es: 'Hornear',
            uk: 'Випікання',
          }),
          duration: { kind: 'exact', value: 20, unit: 'minute' },
          relatedStepId: 'bake',
        },
      ],
    },
    beforeStart: [
      tr(locale, {
        en: 'Soften the butter until spreadable. Use the source ratio of 120 g water, milk or lukewarm almond milk.',
        es: 'Ablanda la mantequilla hasta que se pueda untar. Usa los 120 g de agua, leche o leche de almendra templada indicados por la fuente.',
        uk: 'Розм’якшіть масло до консистенції, зручної для намазування. Візьміть 120 г води, молока або теплого мигдального молока, як у джерелі.',
      }),
      tr(locale, {
        en: 'Choose one filling before starting. The source does not give quantities for the cocoa-peanut option.',
        es: 'Elige un relleno antes de empezar. La fuente no indica cantidades para la opción de cacao y cacahuete.',
        uk: 'До початку оберіть одну начинку. У джерелі не вказані кількості для какао-арахісового варіанта.',
      }),
    ],
    ingredientSections: ingredientSections(locale),
    steps: [
      {
        id: 'activate-yeast',
        title: tr(locale, {
          en: 'Activate the yeast',
          es: 'Activa la levadura',
          uk: 'Активуйте дріжджі',
        }),
        body: tr(locale, {
          en: 'Stir the dry yeast and 1 tablespoon of the honey or agave into the lukewarm liquid. Leave for about 10 minutes.',
          es: 'Mezcla la levadura seca y 1 cucharada de miel o agave con el líquido templado. Deja reposar unos 10 minutos.',
          uk: 'Розмішайте сухі дріжджі та 1 столову ложку меду або агави в теплій рідині. Залиште приблизно на 10 хвилин.',
        }),
        meta: tr(locale, { en: '10 min', es: '10 min', uk: '10 хв' }),
        checkpoint: tr(locale, {
          en: 'The surface has started to bubble or foam.',
          es: 'La superficie ha empezado a formar burbujas o espuma.',
          uk: 'На поверхні з’явилися бульбашки або піна.',
        }),
        tip: tr(locale, {
          en: 'The liquid should feel warm, not hot; excessive heat can damage the yeast.',
          es: 'El líquido debe estar templado, no caliente; demasiado calor puede dañar la levadura.',
          uk: 'Рідина має бути теплою, не гарячою: надмірне тепло може пошкодити дріжджі.',
        }),
        media: stepMedia(
          locale,
          'cinnamon-rolls-activated-yeast-v1',
          'step-01-activated-yeast-v1.webp',
          {
            en: 'Foamy activated yeast in lukewarm almond milk in a cream bowl',
            es: 'Levadura activada y espumosa en leche de almendra templada dentro de un bol crema',
            uk: 'Спінені активовані дріжджі в теплому мигдальному молоці у кремовій мисці',
          },
          {
            en: 'Look for active bubbles',
            es: 'Busca burbujas activas',
            uk: 'Перевірте активні бульбашки',
          },
          {
            en: 'After about 10 minutes, the surface should be foamy and visibly active.',
            es: 'Después de unos 10 minutos, la superficie debe estar espumosa y activa.',
            uk: 'Приблизно через 10 хвилин поверхня має спінитися й помітно пузиритися.',
          },
        ),
        cookIngredients: [
          { ingredientId: 'dry-yeast' },
          {
            ingredientId: 'honey-or-agave',
            note: tr(locale, {
              en: 'Use 1 tbsp now; add the rest with the dough',
              es: 'Usa ahora 1 cucharada; añade el resto a la masa',
              uk: 'Зараз використайте 1 ст. л.; решту додайте в тісто',
            }),
          },
          { ingredientId: 'water-or-milk' },
        ],
      },
      {
        id: 'mix-dough',
        title: tr(locale, {
          en: 'Mix the dough',
          es: 'Mezcla la masa',
          uk: 'Замісіть тісто',
        }),
        body: tr(locale, {
          en: 'Put the remaining dough ingredients in a mixer bowl, add the activated yeast mixture and mix with the dough hook for about 5 minutes. You can also work by hand or with a sturdy silicone spatula.',
          es: 'Pon el resto de los ingredientes de la masa en el bol, añade la levadura activada y amasa con el gancho unos 5 minutos. También puedes hacerlo a mano o con una espátula firme.',
          uk: 'Покладіть решту інгредієнтів для тіста в чашу, додайте активовані дріжджі й замішуйте гаком приблизно 5 хвилин. Також можна вимішати руками або міцною лопаткою.',
        }),
        meta: tr(locale, { en: '5 min', es: '5 min', uk: '5 хв' }),
        checkpoint: tr(locale, {
          en: 'The starches have absorbed the liquid and the xanthan has brought the dough into one cohesive mass.',
          es: 'Los almidones han absorbido el líquido y la goma xantana ha unido la masa.',
          uk: 'Крохмалі увібрали рідину, а ксантан зібрав тісто в однорідну масу.',
        }),
        tip: tr(locale, {
          en: 'Stop when evenly combined; this gluten-free dough does not need long gluten development.',
          es: 'Para cuando la masa esté homogénea; esta masa sin gluten no necesita un amasado largo.',
          uk: 'Зупиніться, коли тісто стане однорідним: воно не потребує тривалого розвитку клейковини.',
        }),
        media: stepMedia(
          locale,
          'cinnamon-rolls-mixed-dough-v1',
          'step-02-mixed-dough-v1.webp',
          {
            en: 'Soft cohesive gluten-free cinnamon-roll dough in a cream mixing bowl',
            es: 'Masa blanda y cohesionada de rollos de canela sin gluten en un bol crema',
            uk: 'М’яке однорідне тісто для безглютенових булочок у кремовій мисці',
          },
          {
            en: 'Check the mixed dough',
            es: 'Comprueba la masa mezclada',
            uk: 'Перевірте замішане тісто',
          },
          {
            en: 'The dough is soft and tacky, but the starches and xanthan hold it together.',
            es: 'La masa está blanda y pegajosa, pero los almidones y la xantana la mantienen unida.',
            uk: 'Тісто м’яке й липкувате, але крохмалі та ксантан уже тримають його разом.',
          },
        ),
        cookIngredients: [
          { ingredientId: 'eggs' },
          { ingredientId: 'vanilla' },
          { ingredientId: 'butter' },
          { ingredientId: 'corn-starch' },
          { ingredientId: 'tapioca-starch' },
          { ingredientId: 'rice-flour' },
          { ingredientId: 'baking-powder' },
          { ingredientId: 'xanthan' },
          { ingredientId: 'salt' },
        ],
      },
      {
        id: 'first-proof',
        title: tr(locale, {
          en: 'Let the dough rise',
          es: 'Deja levar la masa',
          uk: 'Дайте тісту піднятися',
        }),
        body: tr(locale, {
          en: 'Shape the dough into a ball, place it in a bowl, cover and leave for the first proof for about 1 hour.',
          es: 'Forma una bola, ponla en un bol, cubre y deja hacer el primer levado durante aproximadamente 1 hora.',
          uk: 'Сформуйте з тіста кулю, покладіть у миску, накрийте й залиште для першого підйому приблизно на 1 годину.',
        }),
        meta: tr(locale, {
          en: 'About 1 hr',
          es: 'Aprox. 1 h',
          uk: 'Приблизно 1 год',
        }),
        checkpoint: tr(locale, {
          en: 'The dough looks visibly fuller and aerated.',
          es: 'La masa se ve claramente más voluminosa y aireada.',
          uk: 'Тісто помітно збільшилося й стало повітрянішим.',
        }),
        tip: tr(locale, {
          en: 'Use the change in volume as the main cue; room temperature can make the proof faster or slower.',
          es: 'Guíate por el volumen; la temperatura ambiente puede acelerar o retrasar el levado.',
          uk: 'Орієнтуйтеся на збільшення об’єму: температура в кімнаті може змінити тривалість підйому.',
        }),
        media: stepMedia(
          locale,
          'cinnamon-rolls-first-proof-v1',
          'step-03-first-proof-v1.webp',
          {
            en: 'Risen gluten-free dough with a softly domed aerated surface',
            es: 'Masa sin gluten levada con una superficie aireada y suavemente abombada',
            uk: 'Підняте безглютенове тісто з м’яко округленою повітряною поверхнею',
          },
          {
            en: 'Check the first proof',
            es: 'Comprueba el primer levado',
            uk: 'Перевірте перший підйом',
          },
          {
            en: 'The dough should look fuller and aerated after the first proof.',
            es: 'La masa debe verse más voluminosa y aireada después del primer levado.',
            uk: 'Після першого підйому тісто має стати об’ємнішим і повітрянішим.',
          },
        ),
      },
      {
        id: 'roll-dough',
        title: tr(locale, {
          en: 'Roll into a rectangle',
          es: 'Estira un rectángulo',
          uk: 'Розкачайте прямокутник',
        }),
        body: tr(locale, {
          en: 'Dust the work surface lightly with extra corn starch. Work the risen dough briefly, then roll it into an even rectangle.',
          es: 'Espolvorea la mesa con un poco de almidón de maíz. Trabaja brevemente la masa levada y estírala en un rectángulo uniforme.',
          uk: 'Злегка припиліть поверхню кукурудзяним крохмалем. Коротко обімніть тісто й розкачайте його в рівний прямокутник.',
        }),
        checkpoint: tr(locale, {
          en: 'The sheet is even, without thick ridges or very thin patches.',
          es: 'La lámina queda uniforme, sin bordes gruesos ni zonas demasiado finas.',
          uk: 'Пласт рівний, без товстих валиків і надто тонких ділянок.',
        }),
        tip: tr(locale, {
          en: 'Use only enough corn starch to prevent sticking; too much can dry the surface.',
          es: 'Usa solo el almidón necesario; demasiado puede secar la superficie.',
          uk: 'Додавайте лише стільки крохмалю, щоб тісто не липло: надлишок підсушує поверхню.',
        }),
        media: stepMedia(
          locale,
          'cinnamon-rolls-rolled-rectangle-v1',
          'step-04-rolled-rectangle-v1.webp',
          {
            en: 'Even rectangle of pale gluten-free dough beside a wooden rolling pin',
            es: 'Rectángulo uniforme de masa sin gluten clara junto a un rodillo de madera',
            uk: 'Рівний прямокутник світлого безглютенового тіста поруч із дерев’яною качалкою',
          },
          {
            en: 'Roll to an even thickness',
            es: 'Estira con un grosor uniforme',
            uk: 'Розкачайте до рівної товщини',
          },
          {
            en: 'Keep the rectangle even, without thick ridges or very thin patches.',
            es: 'Mantén el rectángulo uniforme, sin bordes gruesos ni zonas demasiado finas.',
            uk: 'Прямокутник має бути рівним, без товстих валиків і надто тонких ділянок.',
          },
        ),
      },
      {
        id: 'add-filling',
        technique: { id: 'soften-butter', condition: 'cinnamon-filling' },
        title: tr(locale, {
          en: 'Add one filling',
          es: 'Añade un relleno',
          uk: 'Додайте одну начинку',
        }),
        body: tr(locale, {
          en: 'For the cinnamon version, brush generously with softened butter and cover with the mixed sugar and cinnamon. Alternatively, spread with cocoa-peanut cream and scatter over dark chocolate chips.',
          es: 'Para la versión de canela, pincela con mantequilla y reparte el azúcar con canela. Como alternativa, unta crema de cacao y cacahuete y añade chocolate negro.',
          uk: 'Для варіанта з корицею щедро змастіть тісто м’яким маслом і розподіліть цукор із корицею. Або намастіть какао-арахісовою пастою та посипте чорним шоколадом.',
        }),
        checkpoint: tr(locale, {
          en: 'The filling forms an even layer across the dough.',
          es: 'El relleno forma una capa uniforme sobre la masa.',
          uk: 'Начинка лежить рівним шаром по всій поверхні тіста.',
        }),
        tip: tr(locale, {
          en: 'Leave a narrow bare edge at the final seam so the roll closes cleanly.',
          es: 'Deja un borde estrecho sin relleno para cerrar bien el rollo.',
          uk: 'Залиште вузьку смугу без начинки вздовж фінального краю, щоб рулет добре закрився.',
        }),
        media: stepMedia(
          locale,
          'cinnamon-rolls-cinnamon-filling-v1',
          'step-05-cinnamon-filling-v1.webp',
          {
            en: 'Rolled dough rectangle evenly covered with brown sugar and cinnamon filling',
            es: 'Rectángulo de masa cubierto uniformemente con azúcar moreno y canela',
            uk: 'Прямокутник тіста, рівномірно вкритий начинкою з коричневого цукру й кориці',
          },
          {
            en: 'Spread the filling evenly',
            es: 'Reparte el relleno uniformemente',
            uk: 'Рівномірно розподіліть начинку',
          },
          {
            en: 'Cover the dough evenly and leave a narrow clean edge for sealing.',
            es: 'Cubre la masa de forma uniforme y deja un borde limpio para cerrar.',
            uk: 'Покрийте тісто рівним шаром і залиште вузький чистий край для закривання.',
          },
        ),
        cookIngredients: [
          { ingredientId: 'filling-sugar' },
          { ingredientId: 'cinnamon' },
          { ingredientId: 'filling-butter' },
          { ingredientId: 'cocoa-peanut-spread' },
          { ingredientId: 'dark-chocolate-chips' },
        ],
      },
      {
        id: 'shape-rolls',
        title: tr(locale, {
          en: 'Roll and cut',
          es: 'Enrolla y corta',
          uk: 'Згорніть і наріжте',
        }),
        body: tr(locale, {
          en: 'Roll into a log and cut pieces about 2 cm thick. Set them cut-side up in the baking dish.',
          es: 'Enrolla formando un cilindro y corta porciones de unos 2 cm. Colócalas con el corte hacia arriba en la fuente.',
          uk: 'Згорніть тісто в рулет і наріжте шматочками завтовшки близько 2 см. Викладіть зрізом догори у форму.',
        }),
        meta: tr(locale, {
          en: '2 cm pieces',
          es: 'Porciones de 2 cm',
          uk: 'Шматочки по 2 см',
        }),
        checkpoint: tr(locale, {
          en: 'The spirals hold their shape and have a little room to expand.',
          es: 'Las espirales mantienen la forma y tienen espacio para crecer.',
          uk: 'Спіралі тримають форму, а між ними є трохи місця для підйому.',
        }),
        tip: tr(locale, {
          en: 'Use a gentle sawing motion so you do not flatten the roll.',
          es: 'Corta con un movimiento suave de sierra para no aplastar el rollo.',
          uk: 'Ріжте легкими рухами ножа вперед-назад, щоб не сплющити рулет.',
        }),
        media: stepMedia(
          locale,
          'cinnamon-rolls-cut-rolls-v1',
          'step-06-cut-rolls-v1.webp',
          {
            en: 'Cinnamon-filled dough log with evenly cut spiral portions beside a serrated knife',
            es: 'Cilindro de masa con canela y porciones en espiral cortadas junto a un cuchillo de sierra',
            uk: 'Рулет із коричною начинкою та рівно нарізані спіралі поруч із зубчастим ножем',
          },
          {
            en: 'Cut even spirals',
            es: 'Corta espirales uniformes',
            uk: 'Наріжте рівні спіралі',
          },
          {
            en: 'The 2 cm portions should hold a clear spiral without being flattened.',
            es: 'Las porciones de 2 cm deben conservar una espiral clara sin aplastarse.',
            uk: 'Шматочки завтовшки 2 см мають зберігати чітку спіраль і не сплющуватися.',
          },
        ),
      },
      {
        id: 'second-proof',
        title: tr(locale, {
          en: 'Proof the shaped rolls',
          es: 'Deja levar los rollos',
          uk: 'Дайте сформованим булочкам піднятися',
        }),
        body: tr(locale, {
          en: 'Cover with film and leave for 40–60 minutes. Near the end, preheat the oven to 180°C.',
          es: 'Cubre con film y deja reposar entre 40 y 60 minutos. Hacia el final, precalienta el horno a 180°C.',
          uk: 'Накрийте плівкою й залиште на 40–60 хвилин. Ближче до завершення розігрійте духовку до 180°C.',
        }),
        meta: tr(locale, {
          en: '40–60 min · 180°C',
          es: '40–60 min · 180°C',
          uk: '40–60 хв · 180°C',
        }),
        checkpoint: tr(locale, {
          en: 'The rolls look slightly puffed and the gaps between them have narrowed.',
          es: 'Los rollos se ven algo hinchados y los espacios se han reducido.',
          uk: 'Булочки трохи надулися, а проміжки між ними зменшилися.',
        }),
        tip: tr(locale, {
          en: 'Do not wait for a dramatic doubling; the source describes only a modest rise.',
          es: 'No esperes que dupliquen claramente; la fuente describe un levado moderado.',
          uk: 'Не чекайте виразного подвоєння: у джерелі описаний помірний підйом.',
        }),
        media: stepMedia(
          locale,
          'cinnamon-rolls-second-proof-v1',
          'step-07-second-proof-v1.webp',
          {
            en: 'Pale unbaked cinnamon rolls modestly puffed in a cream ceramic baking dish',
            es: 'Rollos de canela pálidos y sin hornear, ligeramente levados en una fuente de cerámica crema',
            uk: 'Світлі невипечені булочки з корицею, що трохи піднялися у кремовій керамічній формі',
          },
          {
            en: 'Check the second proof',
            es: 'Comprueba el segundo levado',
            uk: 'Перевірте другий підйом',
          },
          {
            en: 'The rolls are slightly puffed and the gaps between them have narrowed.',
            es: 'Los rollos están algo hinchados y los espacios entre ellos se han reducido.',
            uk: 'Булочки трохи надулися, а проміжки між ними зменшилися.',
          },
        ),
      },
      {
        id: 'bake',
        title: tr(locale, {
          en: 'Bake until lightly golden',
          es: 'Hornea hasta que estén ligeramente dorados',
          uk: 'Випікайте до легкого золотистого кольору',
        }),
        body: tr(locale, {
          en: 'Bake at 180°C for about 20 minutes. Cool slightly before adding your chosen finish.',
          es: 'Hornea a 180°C durante unos 20 minutos. Deja templar antes de añadir el acabado elegido.',
          uk: 'Випікайте при 180°C приблизно 20 хвилин. Трохи остудіть перед нанесенням обраного фінішу.',
        }),
        meta: tr(locale, {
          en: '180°C · about 20 min',
          es: '180°C · unos 20 min',
          uk: '180°C · приблизно 20 хв',
        }),
        checkpoint: tr(locale, {
          en: 'The tops are only lightly golden and the centre rolls look set rather than wet.',
          es: 'La superficie está ligeramente dorada y los rollos centrales se ven cocidos, no húmedos.',
          uk: 'Верх лише злегка золотистий, а центральні булочки вже схопилися й не виглядають сирими.',
        }),
        tip: tr(locale, {
          en: 'Do not bake to a deep brown: overbaking makes gluten-free rolls dry.',
          es: 'No los hornees hasta un dorado oscuro: el exceso de horno reseca los rollos sin gluten.',
          uk: 'Не запікайте до темної скоринки: перепечені безглютенові булочки стають сухими.',
        }),
        media: stepMedia(
          locale,
          'cinnamon-rolls-lightly-golden-v1',
          'step-08-lightly-golden-v1.webp',
          {
            en: 'Lightly golden baked cinnamon rolls without glaze in a cream ceramic dish',
            es: 'Rollos de canela horneados y ligeramente dorados, sin glaseado, en una fuente crema',
            uk: 'Злегка золотисті випечені булочки без глазурі у кремовій керамічній формі',
          },
          {
            en: 'Stop at light gold',
            es: 'Detente con un dorado ligero',
            uk: 'Зупиніться на легкому золотистому кольорі',
          },
          {
            en: 'The tops are lightly golden and the centre rolls are set, not wet.',
            es: 'La superficie está ligeramente dorada y los rollos centrales están cocidos, no húmedos.',
            uk: 'Верх злегка золотистий, а центральні булочки вже схопилися й не виглядають сирими.',
          },
        ),
      },
      {
        id: 'finish',
        title: tr(locale, {
          en: 'Add the chosen finish',
          es: 'Añade el acabado elegido',
          uk: 'Додайте обраний фініш',
        }),
        body: tr(locale, {
          en: 'For the classic glaze, mix the cream cheese, icing sugar and hot water until smooth and spoon over the warm rolls. Alternatively, finish with a little cocoa-peanut spread.',
          es: 'Para el glaseado clásico, mezcla el queso crema, el azúcar glas y el agua caliente hasta obtener una crema lisa y repártela sobre los rollos templados. Como alternativa, termina con crema de cacao y cacahuete.',
          uk: 'Для класичної глазурі змішайте крем-сир, цукрову пудру й гарячу воду до гладкості та полийте теплі булочки. Або додайте зверху трохи какао-арахісової пасти.',
        }),
        checkpoint: tr(locale, {
          en: 'The rolls are warm rather than piping hot, so the finish stays on top.',
          es: 'Los rollos están templados, no muy calientes, para que el acabado se quede encima.',
          uk: 'Булочки теплі, а не гарячі, тому покриття тримається зверху.',
        }),
        tip: tr(locale, {
          en: 'Add the hot water gradually if you prefer a thicker glaze.',
          es: 'Añade el agua caliente poco a poco si prefieres un glaseado más espeso.',
          uk: 'Якщо хочете густішу глазур, додавайте гарячу воду поступово.',
        }),
        media: stepMedia(
          locale,
          'cinnamon-rolls-cream-cheese-glaze-v1',
          'step-09-cream-cheese-glaze-v1.webp',
          {
            en: 'Warm cinnamon rolls with restrained cream-cheese glaze in a cream ceramic dish',
            es: 'Rollos de canela templados con un glaseado moderado de queso crema en una fuente crema',
            uk: 'Теплі булочки з помірним шаром глазурі з крем-сиру у кремовій керамічній формі',
          },
          {
            en: 'Finish while warm',
            es: 'Termina mientras estén templados',
            uk: 'Завершіть, поки булочки теплі',
          },
          {
            en: 'The glaze should stay on top with a few natural drips rather than flooding the dish.',
            es: 'El glaseado debe quedarse encima con algunas gotas naturales, sin inundar la fuente.',
            uk: 'Глазур має триматися зверху й лише трохи стікати, а не заливати всю форму.',
          },
        ),
        cookIngredients: [
          { ingredientId: 'cream-cheese' },
          { ingredientId: 'icing-sugar' },
          { ingredientId: 'glaze-water' },
        ],
      },
    ],
    gapNote: tr(locale, {
      en: 'Before publication, record the filling and finish used, the yield, baking-dish dimensions, difficulty and full active and elapsed time.',
      es: 'Antes de publicar, registra el relleno y acabado usados, el rendimiento, las medidas de la fuente, la dificultad y los tiempos completos.',
      uk: 'Перед публікацією запишіть використані начинку й фініш, кількість булочок, розмір форми, складність, активний і загальний час.',
    }),
  };
}

export const cinnamonRollsRecipe = {
  id: 'cinnamon-rolls',
  publicationStatus: 'unpublished',
  source: {
    file: 'https://www.megasilvita.com/blog/cinnamon-rolls-sin-gluten-la-receta-perfecta/',
    locator:
      'Ingredients, filling options and preparation under “Cinnamon Rolls Sin Gluten” · author confirmed using this recipe',
  },
  ...recipeContent('en'),
  translations: {
    es: recipeContent('es'),
    uk: recipeContent('uk'),
  },
} satisfies RecipeSourceDraft;
