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
  "uk": {
    "metadata": {
      "title": "Про Bake Again та перевірку рецептів — Bake Again",
      "description": "Сімейна колекція безглютенової випічки: як перевіряють рецепти й що означають статуси Перевірено, Розраховано та Запропоновано."
    },
    "eyebrow": "Про Bake Again",
    "title": "Рецепти, до яких хочеться повертатися.",
    "standfirst": "Bake Again — колекція безглютенових рецептів, що виросла із сімейної кухні та пошуку знайомого смаку.",
    "storyTitle": "Як усе почалося",
    "story": [
      "У 2015–2016 роках потреба в безглютеновому харчуванні змінила звичну сімейну випічку. Почався пошук борошна, пропорцій і способів приготування, з якими улюблені страви знову вдавалися.",
      "Знайомі рецепти поступово адаптували: пробували різні суміші, уточнювали пропорції й поверталися до невдалих спроб. За роки зібралася колекція, яку тепер можна знайти в Bake Again — із практичними деталями для повторення результату."
    ],
    "pullQuote": "Знайома випічка може знову стати улюбленою їжею.",
    "testingEyebrow": "Перевірка на практиці",
    "testingTitle": "Що означає перевірений рецепт",
    "testingIntro": [
      "Позначка «Перевірено» означає, що саме цю версію рецепта успішно приготували.",
      "Борошняна суміш, кількості та форма — частина перевіреної версії. Ці умови вказані в рецепті. Багаторазове приготування зазначається лише тоді, коли його підтверджено."
    ],
    "exactVersionTitle": "Кожна зміна має власний статус",
    "exactVersionBody": "Успішне приготування оригіналу не підтверджує всі можливі зміни. Перерахована кількість або запропонована заміна не успадковує статус перевіреної версії.",
    "statusGuideLabel": "Що означають статуси рецептів",
    "statusDescriptions": {
      "tested": "Цю версію успішно приготували за вказаних умов.",
      "calculated": "Кількості перераховано математично. Цю змінену версію ще не перевіряли на практиці.",
      "suggested": "Це запропонована зміна, наприклад заміна інгредієнта. Її ще не перевіряли на практиці."
    },
    "closing": [
      "Для першої спроби орієнтуйтеся на інгредієнти й форму, зазначені в перевіреній версії. Якщо змінюєте рецепт, зверніть увагу на статус адаптації.",
      "Практичні підказки, покроковий режим і список покупок допомагають спланувати приготування та повернутися до улюблених рецептів."
    ],
    "recipesLink": "Переглянути рецепти"
  },
  "en": {
    "metadata": {
      "title": "About Bake Again and recipe testing — Bake Again",
      "description": "A family collection of gluten-free recipes, with a clear explanation of Tested, Calculated and Suggested versions."
    },
    "eyebrow": "About Bake Again",
    "title": "Recipes worth coming back to.",
    "standfirst": "Bake Again is a collection of gluten-free recipes that grew from a family kitchen and a search for familiar flavours.",
    "storyTitle": "How it began",
    "story": [
      "In 2015–2016, a need to eat gluten-free changed everyday baking in one family kitchen. Finding the right flours, proportions and methods became a way to enjoy familiar dishes again.",
      "Favourite recipes were gradually adapted, different flour blends tried and quantities refined. Over the years, those recipes became the Bake Again collection, with practical details to help recreate the results."
    ],
    "pullQuote": "Familiar bakes can become favourite food again.",
    "testingEyebrow": "Tested in the kitchen",
    "testingTitle": "What a tested recipe means",
    "testingIntro": [
      "The Tested label means that this exact version has been made successfully.",
      "The flour blend, quantities and tin are part of that version. Those details are recorded in the recipe. Repeated success is mentioned only where it is documented."
    ],
    "exactVersionTitle": "Every change has its own status",
    "exactVersionBody": "A successful original does not mean every possible variation has been tried. Recalculated quantities and suggested substitutions do not inherit its Tested status.",
    "statusGuideLabel": "Recipe status guide",
    "statusDescriptions": {
      "tested": "This exact version has been made successfully under the conditions given.",
      "calculated": "The quantities have been adjusted mathematically. This changed version has not been tested.",
      "suggested": "A proposed change, such as an ingredient substitution, that has not been tested."
    },
    "closing": [
      "For a first attempt, follow the ingredients and tin size given in the tested version. If you make a change, check the status of that adaptation.",
      "Practical tips, step-by-step cooking and a shopping list help you plan a bake and return to favourite recipes."
    ],
    "recipesLink": "Explore the recipes"
  },
  "es": {
    "metadata": {
      "title": "Sobre Bake Again y las pruebas de recetas — Bake Again",
      "description": "Una colección familiar de recetas sin gluten y una explicación de las versiones Probada, Calculada y Sugerida."
    },
    "eyebrow": "Sobre Bake Again",
    "title": "Recetas que apetece repetir.",
    "standfirst": "Bake Again es una colección de recetas sin gluten nacida en una cocina familiar, con la idea de recuperar sabores conocidos.",
    "storyTitle": "Cómo empezó",
    "story": [
      "En 2015–2016, la necesidad de comer sin gluten cambió la repostería cotidiana de una familia. Comenzó entonces la búsqueda de harinas, proporciones y técnicas con las que volver a disfrutar de los platos de siempre.",
      "Poco a poco se adaptaron las recetas, se probaron distintas mezclas de harina y se ajustaron cantidades. Con los años se formó la colección de Bake Again, con detalles prácticos que ayudan a repetir el resultado."
    ],
    "pullQuote": "La repostería de siempre puede volver a ser la favorita.",
    "testingEyebrow": "Pruebas en la cocina",
    "testingTitle": "Qué significa una receta probada",
    "testingIntro": [
      "La etiqueta «Probada» indica que esa versión concreta se ha preparado con éxito.",
      "La mezcla de harina, las cantidades y el molde forman parte de esa versión y se indican en la receta. Solo se menciona que se ha preparado muchas veces cuando está documentado."
    ],
    "exactVersionTitle": "Cada cambio tiene su propio estado",
    "exactVersionBody": "Que la receta original haya salido bien no significa que se hayan probado todas sus variantes. Las cantidades recalculadas y las sustituciones sugeridas no heredan el estado de la versión probada.",
    "statusGuideLabel": "Guía de estados de las recetas",
    "statusDescriptions": {
      "tested": "Esta versión concreta se ha preparado con éxito en las condiciones indicadas.",
      "calculated": "Las cantidades se han ajustado mediante un cálculo. Esta versión modificada aún no se ha probado.",
      "suggested": "Un cambio propuesto, como sustituir un ingrediente, que aún no se ha probado."
    },
    "closing": [
      "La primera vez, sigue los ingredientes y el tamaño de molde de la versión probada. Si introduces cambios, consulta el estado de la adaptación.",
      "Los consejos prácticos, el modo paso a paso y la lista de la compra ayudan a organizar la preparación y repetir tus recetas favoritas."
    ],
    "recipesLink": "Ver las recetas"
  }
};
