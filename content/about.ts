import type { AppLocale } from '@/lib/i18n/config';

export type AboutPageContent = {
  metadata: { title: string; description: string };
  eyebrow: string;
  title: string;
  standfirst: string;
  storyTitle: string;
  story: string[];
  pullQuote: string;
  testingEyebrow: string;
  testingTitle: string;
  testingIntro: string[];
  exactVersionTitle: string;
  exactVersionBody: string;
  statusGuideLabel: string;
  statusDescriptions: Record<'tested' | 'calculated' | 'suggested', string>;
  closing: string[];
  recipesLink: string;
};

export const aboutPageContent: Record<AppLocale, AboutPageContent> = {
  uk: {
    metadata: {
      title: 'Наша історія та перевірка рецептів — Bake Again',
      description:
        'Як сімейні безглютенові рецепти стали Bake Again і що означають статуси Перевірено, Розраховано та Запропоновано.',
    },
    eyebrow: 'Про Bake Again',
    title: 'Рецепти, до яких ми повертаємося.',
    standfirst:
      'Bake Again виріс із нашої сімейної кухні — з бажання знову готувати знайому випічку після того, як безглютенове харчування стало для нас необхідністю.',
    storyTitle: 'Як усе почалося',
    story: [
      'Приблизно у 2015–2016 роках нашому маленькому синові стало потрібно харчуватися без глютену. Разом із цим з’явилося багато побутових запитань. Як тепер готувати звичну випічку? Яке борошно використовувати? Що змінити в улюбленому рецепті, щоб він знову вдався?',
      'Перші спроби часто розчаровували. Смак і текстура безглютенової випічки відрізнялися від того, до чого ми звикли. Хотілося знайти рецепти, які подобалися б усій сім’ї і які було б приємно готувати знову.',
      'Ми почали поступово переробляти знайомі рецепти: пробували різні борошняні суміші, змінювали пропорції, іноді коригували буквально кілька грамів. Вдалі варіанти залишали. До решти поверталися й пробували ще раз.',
      'За майже десять років так зібралася невелика колекція рецептів, які прижилися на нашій кухні. Ми готуємо їх, бо нам смачно. Тепер ділимося ними в Bake Again — разом із деталями, які допомагають повторити результат.',
    ],
    pullQuote: 'Знайома випічка може знову стати просто улюбленою їжею — без відчуття, що це лише заміна.',
    testingEyebrow: 'Від нашої кухні до вашої',
    testingTitle: 'Як ми перевіряємо рецепти',
    testingIntro: [
      'За позначкою «Перевірено» стоїть конкретний досвід: ми приготували саме цю версію рецепта й отримали вдалий результат.',
      'Тут важливе слово «саме». Борошняна суміш, кількість інгредієнтів і форма — частина перевіреної версії. Тому в рецепті ми вказуємо, що використовували. Якщо готували його багато разів, зазначаємо й це.',
    ],
    exactVersionTitle: 'Кожна зміна має власний статус',
    exactVersionBody:
      'Навіть багато вдалих приготувань оригіналу не означають, що ми випробували всі можливі зміни. Перерахована кількість або запропонована заміна не успадковує статус перевіреного рецепта.',
    statusGuideLabel: 'Що означають статуси рецептів',
    statusDescriptions: {
      tested: 'Цю конкретну версію ми успішно приготували. У рецепті вказані використані суміш, форма й кількість.',
      calculated: 'Кількості перераховано математично, наприклад для більшої порції. Цю змінену версію ще не перевіряли випіканням.',
      suggested: 'Це ідея для зміни, наприклад заміни інгредієнта, яку ми ще не випробували на практиці.',
    },
    closing: [
      'Для першої спроби найближчий орієнтир — версія з тими інгредієнтами та формою, які зазначені в перевіреному рецепті. А коли захочеться щось змінити, статус допоможе зрозуміти, чи ми вже робили таку зміну.',
      'Ми пам’ятаємо, скільки запитань було на початку нашого шляху. Тому в Bake Again ділимося і самими рецептами, і корисними подробицями з нашої кухні. Сподіваємося, серед них знайдеться випічка, яку й у вашій сім’ї попросять приготувати ще раз.',
    ],
    recipesLink: 'Переглянути рецепти',
  },
  en: {
    metadata: {
      title: 'Our story and how we test recipes — Bake Again',
      description:
        'How family gluten-free recipes became Bake Again, and what Tested, Calculated and Suggested mean.',
    },
    eyebrow: 'About Bake Again',
    title: 'Recipes we come back to.',
    standfirst:
      'Bake Again grew out of our family kitchen and a wish to make familiar baking again after eating gluten-free became necessary for us.',
    storyTitle: 'How it began',
    story: [
      'Around 2015–2016, our young son needed to move to a gluten-free diet. That brought many everyday questions. How could we make the baking we knew? Which flour should we use? What needed to change for a favourite recipe to work again?',
      'The first attempts were often disappointing. The taste and texture felt different from what we knew. We wanted recipes the whole family would enjoy and would ask us to make again.',
      'We gradually adapted familiar recipes: trying different flour mixes, changing proportions and sometimes adjusting only a few grams. The versions that worked stayed. We returned to the others and tried again.',
      'Over almost ten years, this became a small collection of recipes at home. We make them because we enjoy them. Now we share them through Bake Again, along with the practical details that help you repeat the result.',
    ],
    pullQuote: 'Familiar baking can become favourite food again, without feeling like a substitute.',
    testingEyebrow: 'From our kitchen to yours',
    testingTitle: 'How we test recipes',
    testingIntro: [
      'The Tested label records a specific experience: we made this exact version of the recipe and it worked.',
      '“Exact” matters. The flour mix, ingredient quantities and pan are part of the tested version, so we name what we used. When we have made it many times, we say that too.',
    ],
    exactVersionTitle: 'Every change has its own status',
    exactVersionBody:
      'Making the original successfully many times does not mean we have tested every possible change. A scaled quantity or proposed substitution does not inherit the status of the tested recipe.',
    statusGuideLabel: 'What the recipe statuses mean',
    statusDescriptions: {
      tested: 'We made this exact version successfully. The recipe names the flour mix, pan and quantity used.',
      calculated: 'The quantities were adjusted mathematically, for example for a larger yield. This changed version has not been bake-tested.',
      suggested: 'This is an idea for a change, such as an ingredient substitution, that we have not tried in practice.',
    },
    closing: [
      'For a first bake, the closest reference is the version using the ingredients and pan named in the tested recipe. If you decide to change something, the status tells you whether we have already tried that change.',
      'We remember how many questions we had at the beginning. Bake Again shares both the recipes and the practical details we have learned in our kitchen. We hope you find something your family asks you to bake again too.',
    ],
    recipesLink: 'Browse recipes',
  },
  es: {
    metadata: {
      title: 'Nuestra historia y cómo probamos las recetas — Bake Again',
      description:
        'Cómo unas recetas familiares sin gluten se convirtieron en Bake Again y qué significan Probada, Calculada y Sugerida.',
    },
    eyebrow: 'Sobre Bake Again',
    title: 'Recetas a las que volvemos.',
    standfirst:
      'Bake Again nació en nuestra cocina familiar, del deseo de volver a preparar nuestros dulces de siempre cuando comer sin gluten pasó a ser una necesidad para nosotros.',
    storyTitle: 'Cómo empezó todo',
    story: [
      'Hacia 2015–2016, nuestro hijo pequeño tuvo que empezar a comer sin gluten. Con ello llegaron muchas preguntas cotidianas. ¿Cómo preparar ahora los dulces de siempre? ¿Qué harina utilizar? ¿Qué había que cambiar para que una receta favorita volviera a salir bien?',
      'Los primeros intentos solían decepcionar. El sabor y la textura eran distintos de lo que conocíamos. Queríamos recetas que gustaran a toda la familia y que apeteciera preparar de nuevo.',
      'Poco a poco adaptamos recetas conocidas: probamos distintas mezclas de harina, cambiamos proporciones y, a veces, ajustamos solo unos gramos. Conservamos las versiones que funcionaban. A las demás volvimos para probar otra vez.',
      'En casi diez años, así se formó una pequeña colección de recetas que hacemos en casa porque nos gustan. Ahora las compartimos en Bake Again, junto con los detalles prácticos que ayudan a repetir el resultado.',
    ],
    pullQuote: 'La repostería de siempre puede volver a ser simplemente una de tus comidas favoritas, sin sentirse como un sustituto.',
    testingEyebrow: 'De nuestra cocina a la tuya',
    testingTitle: 'Cómo probamos las recetas',
    testingIntro: [
      'La etiqueta «Probada» refleja una experiencia concreta: preparamos exactamente esta versión de la receta y el resultado fue bueno.',
      '«Exactamente» es la palabra clave. La mezcla de harina, las cantidades y el molde forman parte de la versión probada; por eso indicamos lo que utilizamos. Si la hemos preparado muchas veces, también lo señalamos.',
    ],
    exactVersionTitle: 'Cada cambio tiene su propio estado',
    exactVersionBody:
      'Haber preparado muchas veces la receta original no significa que hayamos probado todos los cambios posibles. Una cantidad recalculada o una sustitución propuesta no hereda el estado de la receta probada.',
    statusGuideLabel: 'Qué significan los estados de las recetas',
    statusDescriptions: {
      tested: 'Preparamos esta versión exacta con buen resultado. La receta indica la mezcla de harina, el molde y la cantidad utilizados.',
      calculated: 'Las cantidades se ajustaron matemáticamente, por ejemplo para obtener más porciones. Esta versión modificada aún no se ha probado en el horno.',
      suggested: 'Es una idea para cambiar algo, como sustituir un ingrediente, que todavía no hemos probado en la práctica.',
    },
    closing: [
      'Para el primer intento, la referencia más cercana es la versión con los ingredientes y el molde indicados en la receta probada. Si quieres cambiar algo, el estado te dirá si ya hemos probado ese cambio.',
      'Recordamos cuántas preguntas tuvimos al principio. Por eso Bake Again comparte tanto las recetas como los detalles prácticos aprendidos en nuestra cocina. Ojalá encuentres algo que también en tu familia pidan volver a preparar.',
    ],
    recipesLink: 'Ver las recetas',
  },
};
