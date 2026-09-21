import type {
  RecipeSourceDraft,
  RecipeSourceDraftContent,
} from './source-recipe.types.ts';
import { quantityFromGrams, quantityFromSpoons } from './spoon-weights.ts';

type Locale = 'en' | 'uk';

const exact = (value: number, unit: 'g' | 'ml' | 'piece' | 'tsp' | 'tbsp') => ({
  base: { kind: 'exact' as const, value, unit },
  shopping: { mode: 'base' as const },
});

const range = (
  min: number,
  max: number,
  unit: 'g' | 'ml' | 'piece' | 'tsp' | 'tbsp',
) => ({
  base: { kind: 'range' as const, min, max, unit },
  shopping: { mode: 'base' as const },
});

const text = (locale: Locale, en: string, uk: string) =>
  locale === 'uk' ? uk : en;

function ingredientSections(locale: Locale) {
  return [
    {
      id: 'dry',
      title: text(locale, 'Dry ingredients', 'Сухі інгредієнти'),
      ingredients: [
        {
          id: 'schar-mix-b',
          name: 'Schär Bread Mix',
          quantity: quantityFromGrams('schar-mix-b', 450),
        },
        {
          id: 'tapioca-starch',
          name: text(locale, 'Tapioca starch', 'Тапіоковий крохмаль'),
          quantity: quantityFromGrams('tapioca-starch', 50),
        },
        {
          id: 'sugar',
          name: text(locale, 'Sugar', 'Цукор'),
          quantity: quantityFromGrams('granulated-sugar', 100),
        },
        {
          id: 'salt',
          name: text(locale, 'Salt', 'Сіль'),
          quantity: quantityFromSpoons('fine-salt', 0.5, 'tsp'),
        },
        {
          id: 'baking-powder',
          name: text(locale, 'Baking powder', 'Розпушувач'),
          quantity: quantityFromSpoons('baking-powder', 1, 'tsp'),
        },
        {
          id: 'psyllium',
          name: text(locale, 'Psyllium powder', 'Псиліум-порошок'),
          quantity: exact(1, 'tsp'),
          note: text(locale, 'Level spoonful', 'Без гірки'),
        },
        {
          id: 'xanthan',
          name: text(locale, 'Xanthan gum', 'Ксантан'),
          quantity: quantityFromSpoons('xanthan-gum', 1, 'tsp'),
          note: text(locale, 'Level spoonful', 'Без гірки'),
        },
      ],
    },
    {
      id: 'liquid',
      title: text(locale, 'Liquid ingredients', 'Рідкі інгредієнти'),
      ingredients: [
        {
          id: 'milk',
          name: text(locale, 'Milk', 'Молоко'),
          quantity: range(330, 360, 'ml'),
          note: text(
            locale,
            'Start with 330 ml; keep 20–30 ml warm for adjustment',
            'Почати з 330 мл; 20–30 мл залишити теплими для коригування',
          ),
        },
        {
          id: 'fresh-yeast',
          name: text(locale, 'Fresh yeast', 'Свіжі дріжджі'),
          quantity: range(24, 25, 'g'),
        },
        {
          id: 'eggs',
          name: text(locale, 'Eggs', 'Яйця'),
          quantity: exact(2, 'piece'),
        },
        {
          id: 'yolks',
          name: text(locale, 'Egg yolks', 'Жовтки'),
          quantity: exact(3, 'piece'),
        },
        {
          id: 'neutral-oil',
          name: text(locale, 'Neutral-flavoured oil', 'Олія без запаху'),
          quantity: exact(50, 'g'),
        },
        {
          id: 'butter',
          name: text(locale, 'Butter', 'Вершкове масло'),
          quantity: exact(40, 'g'),
          note: text(
            locale,
            'Melted and slightly cooled',
            'Розтопити й трохи охолодити',
          ),
        },
        {
          id: 'vanilla',
          name: text(locale, 'Vanilla extract', 'Ванільний екстракт'),
          quantity: exact(1, 'tsp'),
        },
        {
          id: 'cognac',
          name: text(locale, 'Cognac', 'Коньяк'),
          quantity: exact(1, 'tsp'),
        },
      ],
    },
    {
      id: 'additions',
      title: text(locale, 'Additions', 'Добавки'),
      ingredients: [
        {
          id: 'raisins',
          name: text(locale, 'Raisins', 'Родзинки'),
          quantity: range(220, 250, 'g'),
        },
        {
          id: 'candied-fruit',
          name: text(locale, 'Candied fruit', 'Цукати'),
          quantity: range(60, 80, 'g'),
          note: text(locale, 'Finely chopped', 'Дрібно нарізати'),
        },
      ],
    },
    {
      id: 'topping',
      title: text(locale, 'For the top', 'Для верху'),
      ingredients: [
        {
          id: 'topping-yolk',
          name: text(locale, 'Egg yolk', 'Жовток'),
          quantity: exact(1, 'piece'),
        },
        {
          id: 'topping-milk',
          name: text(locale, 'Milk', 'Молоко'),
          quantity: exact(1, 'tbsp'),
        },
      ],
    },
  ];
}

function recipeContent(locale: Locale): RecipeSourceDraftContent {
  return {
    presentation: 'concise',
    completeness: 'readyToReview',
    evidence: {
      status: 'tested',
      explanation: text(
        locale,
        'This exact version was baked successfully.',
        'Цю версію успішно випікали.',
      ),
    },
    yield: {
      id: 'paska-batch',
      label: text(locale, '3 medium paskas', '3 середні паски'),
      count: { kind: 'exact', value: 3 },
      unit: 'cake',
    },
    geometry: {
      id: 'paper-paska-moulds',
      label: text(locale, '3 medium paska moulds', '3 середні форми для паски'),
      kind: 'mould',
      application: 'bake-in',
      shape: 'round',
      diameterCm: null,
    },
    timing: {
      activeMinutes: 30,
      // Conservative planning estimate: 30 + 15 + 5 + 75 + 45 + 120.
      // Fruit soaking overlaps preparation; mixing is already active time.
      totalElapsedMinutes: 290,
      planningNote: {
        text: text(
          locale,
          'Allow about 4 h 50 min, including 1½–2 h cooling before slicing. Proofing and baking times vary.',
          'Закладіть близько 4 год 50 хв, зокрема 1½–2 год на охолодження перед нарізанням. Час вистоювання й випікання може змінюватися.',
        ),
      },
      phases: [
        {
          id: 'soak-fruit',
          label: text(locale, 'Soak fruit', 'Замочування добавок'),
          duration: {
            kind: 'range',
            min: 5,
            max: 10,
            unit: 'minute',
          },
          relatedStepId: 'prepare-fruit',
        },
        {
          id: 'activate-yeast',
          label: text(locale, 'Activate yeast', 'Активація дріжджів'),
          duration: {
            kind: 'range',
            min: 10,
            max: 15,
            unit: 'minute',
          },
          relatedStepId: 'activate-yeast',
        },
        {
          id: 'mix-dough',
          label: text(locale, 'Mix dough', 'Заміс'),
          duration: {
            kind: 'exact',
            value: 5,
            unit: 'minute',
          },
          relatedStepId: 'mix-dough',
        },
        {
          id: 'hydrate-binders',
          label: text(locale, 'Hydrate binders', 'Відпочинок тіста'),
          duration: {
            kind: 'exact',
            value: 5,
            unit: 'minute',
          },
          relatedStepId: 'adjust-consistency',
        },
        {
          id: 'proof',
          label: text(locale, 'Proof', 'Вистоювання'),
          duration: {
            kind: 'range',
            min: 45,
            max: 75,
            unit: 'minute',
          },
          relatedStepId: 'proof',
        },
        {
          id: 'bake',
          label: text(locale, 'Bake', 'Випікання'),
          duration: {
            kind: 'range',
            min: 35,
            max: 45,
            unit: 'minute',
          },
          relatedStepId: 'bake',
        },
        {
          id: 'stabilise',
          label: text(
            locale,
            'Stabilise before slicing',
            'Стабілізація до розрізання',
          ),
          duration: {
            kind: 'range',
            min: 90,
            max: 120,
            unit: 'minute',
          },
          relatedStepId: 'cool',
        },
      ],
    },
    ingredientSections: ingredientSections(locale),
    steps:
      locale === 'uk'
        ? [
            {
              id: 'prepare-fruit',
              title: 'Підготуйте родзинки й цукати',
              body: 'Залийте родзинки гарячою водою на 5–10 хвилин, злийте воду й ретельно обсушіть. Цукати дрібно наріжте; якщо вони сухі, також ненадовго замочіть і обсушіть.',
            },
            {
              id: 'activate-yeast',
              title: 'Активуйте дріжджі',
              body: 'Змішайте 100 мл теплого, не гарячого молока з дріжджами й чайною ложкою цукру із загальної кількості. Залиште на 10–15 хвилин. Тим часом підготуйте суміші для тіста.',
              checkpoint:
                'Має з’явитися пінка. Якщо її немає ще через 5 хвилин, замініть дріжджі.',
              media: [
                {
                  id: 'active-yeast',
                  src: '/media/recipes/easter-bread/selected/step-02-active-yeast-v1.png',
                  alt: 'Свіжі дріжджі, активовані в теплому молоці, з кремовим шаром дрібних бульбашок',
                },
              ],
            },
            {
              id: 'mix-dough',
              title: 'Замісіть тісто',
              body: 'У чаші змішайте всі сухі інгредієнти та решту цукру. Окремо з’єднайте решту початкових 330 мл молока, яйця кімнатної температури, жовтки, олію, розтоплене й охолоджене масло, ваніль, коньяк і активовані дріжджі. Влийте до сухої суміші. Місіть гачком 1 хвилину на низькій швидкості, зніміть залишки зі стінок і місіть ще 4 хвилини на низькій або середньо-низькій.',
              media: [
                {
                  id: 'soft-dough',
                  src: '/media/recipes/easter-bread/selected/step-05-soft-dough-v1.png',
                  alt: 'Дуже м’яке липке світло-золотисте тісто для паски, підняте силіконовою лопаткою над чашею',
                },
              ],
            },
            {
              id: 'adjust-consistency',
              title: 'Перевірте густоту',
              body: 'Залиште тісто на 5 хвилин. Якщо воно щільне, поступово вмішуйте залишене тепле молоко, перевіряючи густоту після кожного додавання.',
              checkpoint:
                'Тісто липке й спадає з лопатки широкою важкою стрічкою. Борозна повільно закривається; гладкої кульки не буде.',
              media: [
                {
                  id: 'ribbon-consistency',
                  src: '/media/recipes/easter-bread/selected/step-06-ribbon-consistency-v1.png',
                  alt: 'Тісто для паски після відпочинку спадає з лопатки широкою важкою стрічкою над чашею',
                },
              ],
            },
            {
              id: 'add-fruit',
              title: 'Вмішайте добавки',
              body: 'Додайте обсушені родзинки й цукати. Вмішуйте лопаткою або 20–30 секунд на найнижчій швидкості.',
              media: [
                {
                  id: 'fruit-folded',
                  src: '/media/recipes/easter-bread/selected/step-07-fruit-folded-v1.png',
                  alt: 'М’яке тісто для паски з рівномірно вмішаними родзинками й невеликими бурштиновими шматочками цукатів',
                },
              ],
            },
            {
              id: 'fill-moulds',
              title: 'Наповніть форми',
              body: 'Розділіть тісто між трьома середніми формами, заповнюючи їх на третину — до 40% висоти. Розрівняйте мокрою лопаткою, а родзинки на поверхні сховайте під тісто, щоб не підгоріли.',
            },
            {
              id: 'proof',
              title: 'Дайте тісту піднятися',
              body: 'Залиште форми на 45–75 хвилин у ледь теплій вимкненій духовці за 26–29°C. Для вологості можна поставити поруч чашку гарячої води.',
              checkpoint:
                'Тісто має стати пухким і наблизитися до верху форми. Не перетримуйте: надмірно вистояне тісто може осісти.',
              media: [
                {
                  id: 'proofed-paskas',
                  src: '/media/recipes/easter-bread/selected/step-09-proofed-v1.png',
                  alt: 'Дві невеликі паперові форми для паски зі світлим пухким тістом, що піднялося майже до країв',
                },
              ],
            },
            {
              id: 'bake',
              title: 'Випечіть паски',
              body: 'Переставте форми в тепле місце без протягу й розігрійте духовку до 175°C. Змішайте жовток і молоко для верху, легко змастіть паски, не натискаючи пензликом. Випікайте приблизно 35–45 хвилин. Перші 25 хвилин духовку не відкривайте; потім, якщо верх уже золотистий, нещільно накрийте фольгою.',
              checkpoint:
                'Шпажка виходить без сирого тіста, центр не тремтить. За наявності термометра — 94–96°C у центрі. Час залежить від розміру форми.',
              media: [
                {
                  id: 'baked-paskas',
                  src: '/media/recipes/easter-bread/selected/step-11-baked-v1.png',
                  alt: 'Дві невеликі спечені паски з рівномірно золотистими верхівками в паперових формах і чистою дерев’яною шпажкою поруч',
                },
              ],
            },
            {
              id: 'cool',
              title: 'Остудіть перед нарізанням',
              body: 'Залиште паски у вимкненій духовці з прочиненими дверцятами на 10–15 хвилин. Дістаньте, потримайте у формах ще 10–15 хвилин і дайте повністю охолонути. Загалом до нарізання зачекайте 1½–2 години після випікання: теплий м’якуш легко зминається.',
              media: [
                {
                  id: 'cooled-crumb',
                  src: '/media/recipes/easter-bread/selected/step-12-cooled-crumb-v1.png',
                  alt: 'Повністю остигла паска зі скибкою, на якій видно м’який пухкий м’якуш, родзинки й трохи цукатів',
                },
              ],
            },
          ]
        : [
            {
              id: 'prepare-fruit',
              title: 'Prepare the fruit',
              body: 'Soak the raisins in hot water for 5–10 minutes, drain and dry thoroughly. Finely chop the candied fruit; briefly soak and dry it too if needed.',
            },
            {
              id: 'activate-yeast',
              title: 'Activate the yeast',
              body: 'Mix 100 ml of warm, not hot, milk with the yeast and a teaspoon of the measured sugar. Leave for 10–15 minutes while preparing the dough mixtures.',
              checkpoint:
                'Look for a foam cap. If none appears after another 5 minutes, replace the yeast.',
              media: [
                {
                  id: 'active-yeast',
                  src: '/media/recipes/easter-bread/selected/step-02-active-yeast-v1.png',
                  alt: 'Fresh yeast activated in warm milk with a creamy cap of small bubbles',
                },
              ],
            },
            {
              id: 'mix-dough',
              title: 'Mix the dough',
              body: 'Combine all dry ingredients and the remaining sugar in the mixer bowl. Separately combine the rest of the initial 330 ml milk, room-temperature eggs, yolks, oil, melted and cooled butter, vanilla, cognac and activated yeast. Pour into the dry mixture. Mix with a dough hook for 1 minute on low, scrape down the bowl, then mix for 4 minutes on low or medium-low.',
              media: [
                {
                  id: 'soft-dough',
                  src: '/media/recipes/easter-bread/selected/step-05-soft-dough-v1.png',
                  alt: 'Very soft sticky pale-golden paska dough lifted from a mixing bowl with a silicone spatula',
                },
              ],
            },
            {
              id: 'adjust-consistency',
              title: 'Check the consistency',
              body: 'Rest the dough for 5 minutes. If dense, gradually mix in the reserved warm milk, checking the consistency after each addition.',
              checkpoint:
                'The dough is sticky and falls in a broad, heavy ribbon. A groove closes slowly; it will not form a smooth ball.',
              media: [
                {
                  id: 'ribbon-consistency',
                  src: '/media/recipes/easter-bread/selected/step-06-ribbon-consistency-v1.png',
                  alt: 'Hydrated paska dough falling from a spatula in a broad heavy ribbon above the bowl',
                },
              ],
            },
            {
              id: 'add-fruit',
              title: 'Fold in the fruit',
              body: 'Fold in the dried raisins and candied fruit with a spatula, or mix for 20–30 seconds on the lowest speed.',
              media: [
                {
                  id: 'fruit-folded',
                  src: '/media/recipes/easter-bread/selected/step-07-fruit-folded-v1.png',
                  alt: 'Soft paska dough with raisins and small amber candied-fruit pieces evenly folded through it',
                },
              ],
            },
            {
              id: 'fill-moulds',
              title: 'Fill the moulds',
              body: 'Divide the dough between three medium moulds, filling each one-third to 40% full. Level with a wet spatula and tuck exposed raisins under the dough to prevent burning.',
            },
            {
              id: 'proof',
              title: 'Let the dough rise',
              body: 'Leave the moulds for 45–75 minutes in a switched-off oven at 26–29°C. A cup of hot water alongside can provide humidity.',
              checkpoint:
                'The dough should look airy and rise close to the rim. Do not overproof: it may collapse.',
              media: [
                {
                  id: 'proofed-paskas',
                  src: '/media/recipes/easter-bread/selected/step-09-proofed-v1.png',
                  alt: 'Two small paper paska moulds with pale airy dough risen close to their rims',
                },
              ],
            },
            {
              id: 'bake',
              title: 'Bake the paskas',
              body: 'Move the moulds to a warm, draught-free spot and heat the oven to 175°C. Mix the topping yolk and milk, then brush gently without pressing. Bake for approximately 35–45 minutes. Keep the oven closed for the first 25 minutes; after that, loosely cover with foil if the tops are already golden.',
              checkpoint:
                'A skewer should show no raw dough and the centre should not wobble. If using a thermometer, aim for 94–96°C in the centre. Timing depends on mould size.',
              media: [
                {
                  id: 'baked-paskas',
                  src: '/media/recipes/easter-bread/selected/step-11-baked-v1.png',
                  alt: 'Two small baked paskas with evenly golden domed tops in paper moulds and a clean wooden skewer beside them',
                },
              ],
            },
            {
              id: 'cool',
              title: 'Cool before slicing',
              body: 'Leave in the switched-off oven with the door ajar for 10–15 minutes. Remove, keep in the moulds for another 10–15 minutes, then let cool completely. Allow 1½–2 hours in total after baking before slicing: warm crumb compresses easily.',
              media: [
                {
                  id: 'cooled-crumb',
                  src: '/media/recipes/easter-bread/selected/step-12-cooled-crumb-v1.png',
                  alt: 'Fully cooled paska with one slice showing a soft airy crumb, raisins and restrained candied fruit',
                },
              ],
            },
          ],
  };
}

export const easterBreadRecipe = {
  id: 'easter-bread',
  publicationStatus: 'published',
  source: {
    file: 'Author-provided recipe text',
    locator: 'Паска 2.0 — авторська перевірена версія',
  },
  ...recipeContent('en'),
  translations: { uk: recipeContent('uk') },
} satisfies RecipeSourceDraft;
