import type { AppLocale } from '@/lib/i18n/config';

export type AboutPageContent = {
  metadata: { title: string; description: string };
  eyebrow: string;
  title: string;
  standfirst: string;
  photosLabel: string;
  photosIntro: string;
  photoThenCaption: string;
  photoNowCaption: string;
  photoThenAlt: string;
  photoNowAlt: string;
  collectionTitle: string;
  collectionBody: string;
  foodAlt: string;
  foodCaption: string;
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

// Family facts and photographs: IG-002; website adaptation requested 2026-10-04.
export const aboutPageContent: Record<AppLocale, AboutPageContent> = {
  "uk": {
    "metadata": {
      "title": "Про Bake Again та перевірку рецептів — Bake Again",
      "description": "Саша та її сім’я: десять років безглютенової випічки, фотографії Івана у 4 і 14 років та рецепти, які тепер готують для всіх."
    },
    "eyebrow": "Про Bake Again",
    "title": "Спочатку для сина. Тепер для всієї сім’ї.",
    "standfirst": "Привіт, я Саша. Bake Again — це рецепти безглютенової випічки з нашої сімейної кухні. За кожним із них — спроби, зміни й те, що нам справді смакує.",
    "storyTitle": "Два тіста, дві миски. А потім — одна випічка на всіх.",
    "story": [
      "Спочатку ми готували без глютену тільки для сина. Приблизно два роки пекли окремо для нього й окремо для нас: два варіанти млинців, два варіанти випічки на день народження.",
      "З часом безглютенова випічка стала виходити такою, що різниці у смаку ми вже не відчували. А дещо нам навіть більше подобалося без глютену. Поступово звичайне борошно з нашого дому зникло.",
      "Тепер усю випічку робимо без глютену. Не треба готувати окремо: всі їдять те саме, і всім смачно."
    ],
    "pullQuote": "Одні млинці на всіх. І один торт на свято.",
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
    "recipesLink": "Переглянути рецепти",
    "photosLabel": "Наша сім’я: два фото, десять років між ними",
    "photosIntro": "На цих фото Івану 4 і 14 років. Між ними — десять років нашої безглютенової випічки.",
    "photoThenCaption": "Івану 4 роки",
    "photoNowCaption": "Івану 14 років",
    "photoThenAlt": "Наша сім’я з маленьким Іваном на сходах біля дерев’яного будинку.",
    "photoNowAlt": "Наша сім’я з Іваном-підлітком обіймається за столом у саду.",
    "collectionTitle": "З нашої кухні — у вашу",
    "collectionBody": "За ці роки назбиралося багато рецептів: від млинців на сніданок до святкових тортів. Я зібрала їх у Bake Again із пропорціями, назвами сумішей і підказками, які допомагають у приготуванні. Сподіваюся, тут ви теж знайдете те, що захочеться спекти ще раз.",
    "foodAlt": "Сливовий пиріг із золотистою скоринкою та скибочками слив.",
    "foodCaption": "Сливовий пиріг із нашої колекції"
  },
  "en": {
    "metadata": {
      "title": "About Bake Again and recipe testing — Bake Again",
      "description": "Meet Sasha and her family: ten years of gluten-free baking, Ivan at ages 4 and 14, and recipes they now make for everyone."
    },
    "eyebrow": "About Bake Again",
    "title": "First for our son. Now for the whole family.",
    "standfirst": "Hi, I’m Sasha. Bake Again brings together gluten-free baking recipes from our family kitchen. Behind each one are attempts, adjustments and the food we love.",
    "storyTitle": "Two batters, two bowls. Then one bake for everyone.",
    "story": [
      "At first, we baked gluten-free only for our son. For about two years we made separate versions for him and for us: two batches of pancakes, two kinds of birthday baking.",
      "Over time, our gluten-free baking got to the point where we could no longer taste the difference. We even preferred some of the gluten-free versions. Gradually, regular flour disappeared from our home.",
      "Now all our baking is gluten-free. We no longer need to bake separately: everyone eats the same thing, and we all enjoy it."
    ],
    "pullQuote": "One batch of pancakes for everyone. One cake to celebrate.",
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
    "recipesLink": "Explore the recipes",
    "photosLabel": "Our family: two photographs, ten years apart",
    "photosIntro": "Ivan is 4 in one photo and 14 in the other. Between them are ten years of gluten-free baking in our family.",
    "photoThenCaption": "Ivan, age 4",
    "photoNowCaption": "Ivan, age 14",
    "photoThenAlt": "Our family with young Ivan on the steps of a wooden house.",
    "photoNowAlt": "Our family with teenage Ivan embracing at a garden table.",
    "collectionTitle": "From our kitchen to yours",
    "collectionBody": "Over the years, we’ve collected plenty of recipes, from breakfast pancakes to celebration cakes. I brought them together in Bake Again with quantities, the flour blends I use and practical tips. I hope you find something here you’ll want to bake again.",
    "foodAlt": "Golden plum cake topped with plum slices.",
    "foodCaption": "Plum cake from our collection"
  },
  "es": {
    "metadata": {
      "title": "Sobre Bake Again y las pruebas de recetas — Bake Again",
      "description": "Conoce a Sasha y a su familia: diez años de repostería sin gluten, Iván a los 4 y 14 años y recetas que ahora disfrutan todos."
    },
    "eyebrow": "Sobre Bake Again",
    "title": "Primero para nuestro hijo. Ahora para toda la familia.",
    "standfirst": "Hola, soy Sasha. Bake Again reúne las recetas de repostería sin gluten de nuestra cocina familiar. Detrás de cada una hay pruebas, ajustes y sabores que nos encantan.",
    "storyTitle": "Dos masas, dos boles. Después, una misma receta para todos.",
    "story": [
      "Al principio preparábamos repostería sin gluten solo para nuestro hijo. Durante unos dos años hacíamos una versión para él y otra para nosotros: dos masas de crepes, dos opciones para los cumpleaños.",
      "Con el tiempo, la repostería sin gluten nos salía tan bien que ya no notábamos diferencia de sabor. Algunas recetas incluso nos gustaban más sin gluten. Poco a poco, la harina convencional desapareció de casa.",
      "Ahora toda nuestra repostería es sin gluten. Ya no hace falta preparar dos versiones: todos comemos lo mismo y todos lo disfrutamos."
    ],
    "pullQuote": "Los mismos crepes para todos. Una sola tarta para celebrar.",
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
    "recipesLink": "Ver las recetas",
    "photosLabel": "Nuestra familia: dos fotos, diez años entre ellas",
    "photosIntro": "En estas fotos Iván tiene 4 y 14 años. Entre ellas hay diez años de repostería sin gluten en nuestra familia.",
    "photoThenCaption": "Iván, 4 años",
    "photoNowCaption": "Iván, 14 años",
    "photoThenAlt": "Nuestra familia con Iván de pequeño en los escalones de una casa de madera.",
    "photoNowAlt": "Nuestra familia con Iván adolescente, abrazados junto a una mesa en el jardín.",
    "collectionTitle": "De nuestra cocina a la tuya",
    "collectionBody": "Con los años hemos reunido muchas recetas, desde crepes para desayunar hasta tartas para celebrar. Las he recogido en Bake Again con cantidades, las mezclas de harina que uso y consejos prácticos. Espero que encuentres algo que te apetezca volver a preparar.",
    "foodAlt": "Pastel de ciruelas dorado con rodajas de ciruela en la superficie.",
    "foodCaption": "Pastel de ciruelas de nuestra colección"
  }
};
