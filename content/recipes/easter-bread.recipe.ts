import type {
  RecipeSourceDraft,
  RecipeSourceDraftContent,
} from './source-recipe.types.ts';

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

const stepMedia = (
  locale: Locale,
  id: string,
  filename: string,
  en: { alt: string; title: string; caption: string },
  uk: { alt: string; title: string; caption: string },
) => [
  {
    id,
    src: `/media/recipes/easter-bread/selected/${filename}`,
    alt: locale === 'uk' ? uk.alt : en.alt,
    title: locale === 'uk' ? uk.title : en.title,
    caption: locale === 'uk' ? uk.caption : en.caption,
  },
];

function ingredientSections(locale: Locale) {
  return [
    {
      id: 'dry',
      title: text(locale, 'Dry ingredients', 'Сухі інгредієнти'),
      ingredients: [
        {
          id: 'schar-mix-b',
          name: 'Schär Bread Mix',
          quantity: exact(450, 'g'),
        },
        {
          id: 'tapioca-starch',
          name: text(locale, 'Tapioca starch', 'Тапіоковий крохмаль'),
          quantity: exact(50, 'g'),
        },
        {
          id: 'sugar',
          name: text(locale, 'Sugar', 'Цукор'),
          quantity: exact(100, 'g'),
        },
        {
          id: 'salt',
          name: text(locale, 'Salt', 'Сіль'),
          quantity: exact(0.5, 'tsp'),
        },
        {
          id: 'baking-powder',
          name: text(locale, 'Baking powder', 'Розпушувач'),
          quantity: exact(1, 'tsp'),
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
          quantity: exact(1, 'tsp'),
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
  const uk = locale === 'uk';

  return {
    completeness: 'readyToReview',
    evidence: {
      status: 'suggested',
      explanation: text(
        locale,
        'This softer 2.0 adaptation is based on the previous bake and has not yet been bake-tested in this exact form.',
        'Це м’якша адаптація 2.0 на основі попередньої випічки. Саме цю версію ще не перевірено випіканням.',
      ),
    },
    yield: {
      id: 'paska-batch',
      label: text(
        locale,
        '2 small paskas or 1 medium paska',
        '2 невеликі паски або 1 середня',
      ),
      count: { kind: 'range', min: 1, max: 2 },
      unit: 'batch',
    },
    geometry: {
      id: 'paper-paska-moulds',
      label: text(
        locale,
        '2 small or 1 medium paska mould',
        '2 невеликі або 1 середня форма для паски',
      ),
      kind: 'mould',
      application: 'bake-in',
      shape: 'round',
      diameterCm: null,
    },
    timing: {
      activeMinutes: null,
      totalElapsedMinutes: null,
      phases: [
        {
          id: 'soak-fruit',
          label: text(locale, 'Soak fruit', 'Замочування добавок'),
          duration: { kind: 'range', min: 5, max: 10, unit: 'minute' },
          relatedStepId: 'prepare-fruit',
        },
        {
          id: 'activate-yeast',
          label: text(locale, 'Activate yeast', 'Активація дріжджів'),
          duration: { kind: 'range', min: 10, max: 15, unit: 'minute' },
          relatedStepId: 'activate-yeast',
        },
        {
          id: 'mix-dough',
          label: text(locale, 'Mix dough', 'Заміс'),
          duration: { kind: 'exact', value: 5, unit: 'minute' },
          relatedStepId: 'mix-dough',
        },
        {
          id: 'hydrate-binders',
          label: text(locale, 'Hydrate binders', 'Відпочинок тіста'),
          duration: { kind: 'exact', value: 5, unit: 'minute' },
          relatedStepId: 'adjust-consistency',
        },
        {
          id: 'proof',
          label: text(locale, 'Proof', 'Розстойка'),
          duration: { kind: 'range', min: 45, max: 75, unit: 'minute' },
          relatedStepId: 'proof',
        },
        {
          id: 'bake',
          label: text(locale, 'Bake', 'Випікання'),
          duration: { kind: 'range', min: 35, max: 45, unit: 'minute' },
          relatedStepId: 'bake',
        },
        {
          id: 'stabilise',
          label: text(
            locale,
            'Stabilise before slicing',
            'Стабілізація до розрізання',
          ),
          duration: { kind: 'range', min: 90, max: 120, unit: 'minute' },
          relatedStepId: 'cool',
        },
      ],
    },
    beforeStart: uk
      ? [
          'Дістаньте яйця з холодильника, розтопіть масло й дайте йому трохи охолонути.',
          'Підготуйте форми й залиште додаткові 20–30 мл теплого молока для коригування консистенції.',
          'Орієнтуйтеся насамперед на текстуру й підйом тіста, а не лише на час.',
        ]
      : [
          'Bring the eggs toward room temperature, melt the butter and let it cool slightly.',
          'Prepare the moulds and keep an extra 20–30 ml of warm milk for the consistency check.',
          'Use dough texture and rise—not the clock alone—as the deciding cues.',
        ],
    ingredientSections: ingredientSections(locale),
    steps: uk
      ? [
          {
            id: 'prepare-fruit',
            title: 'Підготувати родзинки й цукати',
            body: 'Залити родзинки гарячою водою на 5–10 хвилин, відкинути на сито й дуже ретельно обсушити. М’які цукати дрібно нарізати. Сухуваті можна ненадовго замочити, а потім так само добре обсушити.',
            meta: '5–10 хв',
            tip: 'Після обсушування розкладіть наповнення тонким шаром на рушнику, поки готується тісто.',
            checkpoint:
              'Перед додаванням у тісто родзинки й цукати сухі зовні.',
          },
          {
            id: 'activate-yeast',
            title: 'Активувати дріжджі',
            body: 'Взяти 100 мл із відміряного молока, додати свіжі дріжджі й 1 чайну ложку цукру із загальної кількості. Розмішати й залишити на 10–15 хвилин.',
            meta: '10–15 хв',
            tip: 'Молоко має бути теплим, але не гарячим: гаряче молоко може пошкодити дріжджі.',
            checkpoint:
              'З’явилася помітна пінка. Якщо активності немає ще через 5 хвилин, краще взяти нові дріжджі.',
            media: stepMedia(
              locale,
              'active-yeast',
              'step-02-active-yeast-v1.png',
              {
                alt: 'Fresh yeast activated in warm milk with a creamy cap of small bubbles',
                title: 'Active yeast',
                caption:
                  'A visible foam cap confirms that the fresh yeast is active.',
              },
              {
                alt: 'Свіжі дріжджі, активовані в теплому молоці, з кремовим шаром дрібних бульбашок',
                title: 'Активні дріжджі',
                caption:
                  'Помітна пінна шапочка підтверджує, що свіжі дріжджі активні.',
              },
            ),
          },
          {
            id: 'mix-dry',
            title: 'Змішати сухі інгредієнти',
            body: 'У чаші комбайна вінчиком ретельно змішати Schär Bread Mix, тапіоковий крохмаль, решту цукру, сіль, розпушувач, псиліум і ксантан.',
            tip: 'Розподіліть псиліум і ксантан у борошні до додавання рідини, щоб вони не зібралися грудочками.',
            checkpoint:
              'Суміш повністю однорідна, без видимих грудочок псиліуму чи ксантану.',
          },
          {
            id: 'mix-liquid',
            title: 'Змішати рідкі інгредієнти',
            body: 'Вінчиком змішати решту теплого молока — приблизно 230 мл — із двома яйцями, трьома жовтками, олією, розтопленим охолодженим маслом, ваніллю, коньяком та активованими дріжджами.',
            checkpoint:
              'Суміш ледь тепла й однорідна: масло не застигло пластівцями, а яйця не згорнулися.',
          },
          {
            id: 'mix-dough',
            title: 'Замісити тісто',
            body: 'Влити рідку суміш до сухої. Замішувати гачком 1 хвилину на низькій швидкості, зняти сухі залишки зі стінок, потім місити ще 4 хвилини на низькій або середньо-низькій швидкості.',
            meta: '5 хв',
            tip: 'Це безглютенове здобне тісто, тому класичної гладкої кульки не буде.',
            checkpoint:
              'Тісто дуже м’яке, густе й липке; повільно спадає з лопатки, але не ллється як кексове.',
            media: stepMedia(
              locale,
              'soft-dough',
              'step-05-soft-dough-v1.png',
              {
                alt: 'Very soft sticky pale-golden paska dough lifted from a mixing bowl with a silicone spatula',
                title: 'Soft dough after mixing',
                caption:
                  'The dough stays thick and sticky instead of forming a kneadable ball.',
              },
              {
                alt: 'Дуже м’яке липке світло-золотисте тісто для паски, підняте силіконовою лопаткою над чашею',
                title: 'М’яке тісто після замісу',
                caption:
                  'Тісто залишається густим і липким, а не збирається в кульку.',
              },
            ),
          },
          {
            id: 'adjust-consistency',
            title: 'Дати тісту постояти й перевірити густоту',
            body: 'Залишити тісто на 5 хвилин, щоб псиліум і ксантан набрали воду. Якщо воно все ще щільне, додавати тепле молоко по 1 столовій ложці, щоразу перемішуючи й перевіряючи. Може знадобитися ще 20–30 мл.',
            meta: '5 хв',
            tip: 'Додавайте молоко поступово: пом’якшити щільне тісто легше, ніж повернути структуру надто рідкому.',
            checkpoint:
              'Борозна від лопатки повільно закривається, а тісто спадає широкою важкою стрічкою, не утворюючи калюжі.',
            media: stepMedia(
              locale,
              'ribbon-consistency',
              'step-06-ribbon-consistency-v1.png',
              {
                alt: 'Hydrated paska dough falling from a spatula in a broad heavy ribbon above the bowl',
                title: 'Correct final consistency',
                caption:
                  'The ribbon is broad and slow, while the dough below still holds its structure.',
              },
              {
                alt: 'Тісто для паски після відпочинку спадає з лопатки широкою важкою стрічкою над чашею',
                title: 'Правильна фінальна консистенція',
                caption:
                  'Стрічка широка й повільна, а тісто в чаші все ще тримає структуру.',
              },
            ),
          },
          {
            id: 'add-fruit',
            title: 'Додати родзинки й цукати',
            body: 'Додати сухі родзинки й цукати. Вмішувати лише 20–30 секунд на найнижчій швидкості або обережно скласти тісто лопаткою вручну.',
            meta: '20–30 с',
            tip: 'Якщо комбайн збирає наповнення на дні, завершіть перемішування вручну, піднімаючи тісто знизу догори.',
            checkpoint:
              'Наповнення розподілене рівномірно, а тісто не перемішували довше, ніж потрібно.',
            media: stepMedia(
              locale,
              'fruit-folded',
              'step-07-fruit-folded-v1.png',
              {
                alt: 'Soft paska dough with raisins and small amber candied-fruit pieces evenly folded through it',
                title: 'Fruit distributed through the dough',
                caption:
                  'Raisins and candied fruit are spread evenly without overmixing.',
              },
              {
                alt: 'М’яке тісто для паски з рівномірно вмішаними родзинками й невеликими бурштиновими шматочками цукатів',
                title: 'Добавки розподілені в тісті',
                caption:
                  'Родзинки й цукати розподілені рівномірно без зайвого вимішування.',
              },
            ),
          },
          {
            id: 'fill-moulds',
            title: 'Розкласти тісто у форми',
            body: 'Розділити тісто між двома невеликими формами, заповнюючи їх приблизно на третину або 40% висоти. Розрівняти верх мокрою силіконовою лопаткою.',
            tip: 'Сховайте родзинки, які залишилися на поверхні, під тісто, щоб вони не підгоріли.',
            checkpoint:
              'У формах залишилося достатньо місця для підйому, а верх вирівняний без натискання на тісто.',
          },
          {
            id: 'proof',
            title: 'Дати паскам добре піднятися',
            body: 'Поставити форми в ледь теплу вимкнену духовку за 26–29°C. Для м’якого тепла й вологості можна поставити чашку гарячої води. Орієнтовна розстойка — 45–75 хвилин, але головний орієнтир — саме тісто.',
            meta: '26–29°C · 45–75 хв',
            tip: 'Не чекайте обов’язкового подвоєння: перетримане безглютенове тісто може осісти під час змащування або випікання.',
            checkpoint:
              'Тісто помітно збільшилося, стало пухким і наблизилося до верху форми.',
            media: stepMedia(
              locale,
              'proofed-paskas',
              'step-09-proofed-v1.png',
              {
                alt: 'Two small paper paska moulds with pale airy dough risen close to their rims',
                title: 'End of proofing',
                caption:
                  'The dough looks airy and sits close to the mould tops without overflowing.',
              },
              {
                alt: 'Дві невеликі паперові форми для паски зі світлим пухким тістом, що піднялося майже до країв',
                title: 'Кінець розстойки',
                caption:
                  'Тісто пухке й наблизилося до верху форм, але не переливається через край.',
              },
            ),
          },
          {
            id: 'finish-top',
            title: 'Розігріти духовку й змастити верх',
            body: 'Обережно переставити паски в тепле місце без протягу й розігріти духовку до 175°C. Змішати жовток зі столовою ложкою молока та дуже легко змастити верх.',
            meta: '175°C',
            tip: 'Не натискайте пензликом і не проколюйте поверхню після розстойки.',
            checkpoint:
              'Верх тонко змащений, а підняте тісто не втратило об’єму.',
          },
          {
            id: 'bake',
            title: 'Спекти до готовності',
            body: 'Випікати дві невеликі паски за 175°C приблизно 35–45 хвилин. Через 25 хвилин перевірити колір і нещільно накрити фольгою, якщо верх уже золотистий.',
            meta: '175°C · 35–45 хв',
            tip: 'Не відкривайте духовку перші 25 хвилин. Якщо використовуєте термометр, орієнтир у центрі — близько 94–96°C, не торкаючись форми.',
            checkpoint:
              'Верх рівномірно золотистий, центр не тремтить, а шпажка виходить без сирого тіста.',
            media: stepMedia(
              locale,
              'baked-paskas',
              'step-11-baked-v1.png',
              {
                alt: 'Two small baked paskas with evenly golden domed tops in paper moulds and a clean wooden skewer beside them',
                title: 'Baked through',
                caption:
                  'The domes are evenly golden; the skewer should show no raw batter.',
              },
              {
                alt: 'Дві невеликі спечені паски з рівномірно золотистими верхівками в паперових формах і чистою дерев’яною шпажкою поруч',
                title: 'Паски пропеклися',
                caption:
                  'Верхівки рівномірно золотисті, а на шпажці немає сирого тіста.',
              },
            ),
          },
          {
            id: 'cool',
            title: 'Поступово остудити',
            body: 'Вимкнути духовку, трохи прочинити дверцята й залишити паски всередині на 10–15 хвилин. Потім дістати, потримати у формах ще 10–15 хвилин і повністю остудити. Не різати щонайменше 1½–2 години.',
            meta: 'Щонайменше 1½–2 год до розрізання',
            tip: 'Гарячий безглютеновий м’якуш ще стабілізується, тому може здаватися липким або зім’ятися під ножем.',
            checkpoint:
              'Паски повністю охололи, а м’якуш стабілізувався щонайменше 1½–2 години.',
            media: stepMedia(
              locale,
              'cooled-crumb',
              'step-12-cooled-crumb-v1.png',
              {
                alt: 'Fully cooled paska with one slice showing a soft airy crumb, raisins and restrained candied fruit',
                title: 'Stabilised crumb',
                caption:
                  'After cooling, the crumb is soft and moist but set cleanly enough to slice.',
              },
              {
                alt: 'Повністю остигла паска зі скибкою, на якій видно м’який пухкий м’якуш, родзинки й трохи цукатів',
                title: 'Стабілізований м’якуш',
                caption:
                  'Після охолодження м’якуш м’який і вологий, але вже чисто нарізається.',
              },
            ),
          },
        ]
      : [
          {
            id: 'prepare-fruit',
            title: 'Prepare the raisins and candied fruit',
            meta: '5–10 min',
            body: 'Cover the raisins with hot water for 5–10 minutes, drain and dry them very thoroughly. Finely chop soft candied fruit. If it is dry, soak it briefly, then dry it just as carefully.',
            tip: 'Leave the drained fruit in a thin layer on a towel while you make the dough.',
            checkpoint:
              'The raisins and candied fruit feel dry on the outside before they go into the dough.',
          },
          {
            id: 'activate-yeast',
            title: 'Activate the yeast',
            meta: '10–15 min',
            body: 'Take 100 ml from the measured milk and mix it with the fresh yeast and 1 teaspoon of sugar taken from the measured sugar. Leave for 10–15 minutes.',
            tip: 'The milk should feel warm, not hot; hot milk can damage the yeast.',
            checkpoint:
              'A noticeable layer of foam appears. If nothing happens after another 5 minutes, use fresh yeast.',
            media: stepMedia(
              locale,
              'active-yeast',
              'step-02-active-yeast-v1.png',
              {
                alt: 'Fresh yeast activated in warm milk with a creamy cap of small bubbles',
                title: 'Active yeast',
                caption:
                  'A visible foam cap confirms that the fresh yeast is active.',
              },
              {
                alt: 'Свіжі дріжджі, активовані в теплому молоці, з кремовим шаром дрібних бульбашок',
                title: 'Активні дріжджі',
                caption:
                  'Помітна пінна шапочка підтверджує, що свіжі дріжджі активні.',
              },
            ),
          },
          {
            id: 'mix-dry',
            title: 'Mix the dry ingredients',
            body: 'In the mixer bowl, whisk the Schär Bread Mix, tapioca starch, remaining sugar, salt, baking powder, psyllium and xanthan until completely even.',
            tip: 'Distribute the psyllium and xanthan through the flour before any liquid is added so they do not form lumps.',
            checkpoint: 'No visible clumps of psyllium or xanthan remain.',
          },
          {
            id: 'mix-liquid',
            title: 'Mix the liquid ingredients',
            body: 'Whisk the remaining approximately 230 ml milk with the eggs, three yolks, oil, melted cooled butter, vanilla, cognac and activated yeast until even.',
            checkpoint:
              'The mixture is lukewarm and even; the butter has not set into flakes and the eggs have not curdled.',
          },
          {
            id: 'mix-dough',
            title: 'Mix the dough',
            meta: '5 min',
            body: 'Pour the liquid mixture into the dry ingredients. Mix with the dough hook for 1 minute on low, scrape down the bowl, then mix for 4 minutes on low or medium-low.',
            tip: 'This gluten-free enriched dough will not form a classic smooth ball.',
            checkpoint:
              'The dough is very soft, thick and sticky, and falls slowly from a spatula without pouring like cake batter.',
            media: stepMedia(
              locale,
              'soft-dough',
              'step-05-soft-dough-v1.png',
              {
                alt: 'Very soft sticky pale-golden paska dough lifted from a mixing bowl with a silicone spatula',
                title: 'Soft dough after mixing',
                caption:
                  'The dough stays thick and sticky instead of forming a kneadable ball.',
              },
              {
                alt: 'Дуже м’яке липке світло-золотисте тісто для паски, підняте силіконовою лопаткою над чашею',
                title: 'М’яке тісто після замісу',
                caption:
                  'Тісто залишається густим і липким, а не збирається в кульку.',
              },
            ),
          },
          {
            id: 'adjust-consistency',
            title: 'Rest and check the consistency',
            meta: '5 min',
            body: 'Leave the dough for 5 minutes so the psyllium and xanthan can hydrate. If it is still dense, mix in warm milk 1 tablespoon at a time, checking after each addition. It may need another 20–30 ml.',
            tip: 'Add the extra milk gradually. It is easier to soften a dense dough than to restore structure to an over-thinned one.',
            checkpoint:
              'A groove drawn across the bowl closes slowly, and the dough falls from the spatula in a broad heavy ribbon without forming a puddle.',
            media: stepMedia(
              locale,
              'ribbon-consistency',
              'step-06-ribbon-consistency-v1.png',
              {
                alt: 'Hydrated paska dough falling from a spatula in a broad heavy ribbon above the bowl',
                title: 'Correct final consistency',
                caption:
                  'The ribbon is broad and slow, while the dough below still holds its structure.',
              },
              {
                alt: 'Тісто для паски після відпочинку спадає з лопатки широкою важкою стрічкою над чашею',
                title: 'Правильна фінальна консистенція',
                caption:
                  'Стрічка широка й повільна, а тісто в чаші все ще тримає структуру.',
              },
            ),
          },
          {
            id: 'add-fruit',
            title: 'Fold in the fruit',
            meta: '20–30 sec',
            body: 'Add the dried raisins and candied fruit. Mix for only 20–30 seconds on the lowest speed, or fold them in by hand with a spatula.',
            tip: 'If the mixer gathers the fruit at the bottom, finish by hand, lifting the dough from bottom to top.',
            checkpoint:
              'The fruit is evenly distributed and the dough has not been overmixed.',
            media: stepMedia(
              locale,
              'fruit-folded',
              'step-07-fruit-folded-v1.png',
              {
                alt: 'Soft paska dough with raisins and small amber candied-fruit pieces evenly folded through it',
                title: 'Fruit distributed through the dough',
                caption:
                  'Raisins and candied fruit are spread evenly without overmixing.',
              },
              {
                alt: 'М’яке тісто для паски з рівномірно вмішаними родзинками й невеликими бурштиновими шматочками цукатів',
                title: 'Добавки розподілені в тісті',
                caption:
                  'Родзинки й цукати розподілені рівномірно без зайвого вимішування.',
              },
            ),
          },
          {
            id: 'fill-moulds',
            title: 'Fill the moulds',
            body: 'Divide the dough between two small moulds, filling them to about one-third or 40% of their height. Smooth the tops with a wet silicone spatula.',
            tip: 'Tuck exposed raisins below the surface so they do not burn.',
            checkpoint:
              'The moulds have ample headroom and the tops are gently levelled without compressing the dough.',
          },
          {
            id: 'proof',
            title: 'Proof until visibly airy',
            meta: '26–29°C · 45–75 min',
            body: 'Place the moulds in a barely warm switched-off oven at about 26–29°C. A cup of hot water can provide gentle warmth and humidity. Allow about 45–75 minutes, judging by the dough rather than the clock.',
            tip: 'Do not wait for a mandatory doubling. Over-proofed gluten-free dough can collapse during glazing or baking.',
            checkpoint:
              'The dough has visibly expanded, looks airy and has risen close to the top of the moulds.',
            media: stepMedia(
              locale,
              'proofed-paskas',
              'step-09-proofed-v1.png',
              {
                alt: 'Two small paper paska moulds with pale airy dough risen close to their rims',
                title: 'End of proofing',
                caption:
                  'The dough looks airy and sits close to the mould tops without overflowing.',
              },
              {
                alt: 'Дві невеликі паперові форми для паски зі світлим пухким тістом, що піднялося майже до країв',
                title: 'Кінець розстойки',
                caption:
                  'Тісто пухке й наблизилося до верху форм, але не переливається через край.',
              },
            ),
          },
          {
            id: 'finish-top',
            title: 'Heat the oven and glaze the tops',
            meta: '175°C',
            body: 'Move the risen paskas to a warm draught-free place and heat the oven to 175°C. Mix the yolk with 1 tablespoon milk and brush the tops very gently.',
            tip: 'Do not press with the brush or puncture the surface after proofing.',
            checkpoint:
              'The tops are lightly coated and the risen dough remains inflated.',
          },
          {
            id: 'bake',
            title: 'Bake until set',
            meta: '175°C · 35–45 min',
            body: 'Bake two small paskas at 175°C for about 35–45 minutes. Check the colour after about 25 minutes and loosely cover with foil if the tops are already golden.',
            tip: 'Avoid opening the oven during the first 25 minutes. If using a thermometer, aim for about 94–96°C in the centre without touching the mould.',
            checkpoint:
              'The tops are evenly golden, the centres do not wobble, and a skewer comes out without raw batter.',
            media: stepMedia(
              locale,
              'baked-paskas',
              'step-11-baked-v1.png',
              {
                alt: 'Two small baked paskas with evenly golden domed tops in paper moulds and a clean wooden skewer beside them',
                title: 'Baked through',
                caption:
                  'The domes are evenly golden; the skewer should show no raw batter.',
              },
              {
                alt: 'Дві невеликі спечені паски з рівномірно золотистими верхівками в паперових формах і чистою дерев’яною шпажкою поруч',
                title: 'Паски пропеклися',
                caption:
                  'Верхівки рівномірно золотисті, а на шпажці немає сирого тіста.',
              },
            ),
          },
          {
            id: 'cool',
            title: 'Cool gradually',
            meta: 'At least 1½–2 hr before slicing',
            body: 'Switch off the oven, crack the door and leave the paskas inside for 10–15 minutes. Take them out, keep them in the moulds for another 10–15 minutes, then cool completely. Wait at least 1½–2 hours before slicing.',
            tip: 'The warm gluten-free crumb is still setting and may look gummy or compress under the knife.',
            checkpoint:
              'The paskas are fully cool and the crumb has had at least 1½–2 hours to stabilise.',
            media: stepMedia(
              locale,
              'cooled-crumb',
              'step-12-cooled-crumb-v1.png',
              {
                alt: 'Fully cooled paska with one slice showing a soft airy crumb, raisins and restrained candied fruit',
                title: 'Stabilised crumb',
                caption:
                  'After cooling, the crumb is soft and moist but set cleanly enough to slice.',
              },
              {
                alt: 'Повністю остигла паска зі скибкою, на якій видно м’який пухкий м’якуш, родзинки й трохи цукатів',
                title: 'Стабілізований м’якуш',
                caption:
                  'Після охолодження м’якуш м’який і вологий, але вже чисто нарізається.',
              },
            ),
          },
        ],
    gapNote: text(
      locale,
      'This exact softer 2.0 adaptation is Suggested. Bake-test it before changing its evidence status to Tested; confirm mould dimensions and total elapsed time, and review the generated cover image.',
      'Ця точна м’якша адаптація 2.0 має статус «Запропоновано». Після випікання потрібно підтвердити результат, розміри форм і загальний час; також слід перевірити згенеровану обкладинку.',
    ),
  };
}

const english = recipeContent('en');

export const easterBreadRecipe = {
  id: 'easter-bread',
  publicationStatus: 'draft',
  source: {
    file: 'Author-provided recipe text',
    locator: 'Паска 2.0 — м’якша, вологіша, ближча до panettone',
  },
  ...english,
  translations: { uk: recipeContent('uk') },
} satisfies RecipeSourceDraft;
