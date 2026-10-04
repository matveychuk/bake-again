import type { AppLocale } from '../../lib/i18n/config.ts';

export type HelpField = 'body' | 'tip' | 'checkpoint';
export type HelpQuestion = {
  question: Record<AppLocale, string>;
  /** Read the configured step at display time, never a stale base quantity. */
  answer: HelpField | Record<AppLocale, string>;
  evidence: HelpField[];
};
export type StepHelpDecision = { reason: string; questions: HelpQuestion[] };
const q = (
  answer: HelpField,
  uk: string,
  en: string,
  es: string,
): HelpQuestion => ({
  question: { uk, en, es },
  answer,
  evidence: [answer],
});
const text = (
  source: HelpField,
  uk: string,
  en: string,
  es: string,
  aUk: string,
  aEn: string,
  aEs: string,
): HelpQuestion => ({
  question: { uk, en, es },
  answer: { uk: aUk, en: aEn, es: aEs },
  evidence: [source],
});
const help = (...questions: HelpQuestion[]): StepHelpDecision => ({
  reason: 'Є рішення щодо техніки, консистенції, готовності або послідовності.',
  questions,
});
const skip = (reason: string): StepHelpDecision => ({ reason, questions: [] });

/** Explicit editorial decisions, not keyword-generated prompts. Every canonical step is audited. */
export const stepHelpCatalog: Record<
  string,
  Record<string, StepHelpDecision>
> = {
  'sour-cream': {
    mix: help(
      q(
        'checkpoint',
        'Коли сметанний крем уже достатньо перемішаний?',
        'When is the sour cream filling mixed enough?',
        '¿Cuándo está suficientemente mezclada la crema de nata agria?',
      ),
      text(
        'body',
        'Чи обов’язково збивати сметанний крем міксером?',
        'Do I need a mixer for the sour cream filling?',
        '¿Necesito una batidora para la crema de nata agria?',
        'Ні. Можна перемішати сметану з цукром ложкою до однорідності. Збивання потрібне лише для більш повітряної консистенції.',
        'No. Stir the sour cream and sugar with a spoon until smooth. Whipping is optional for a lighter texture.',
        'No. Remueve la nata agria con el azúcar con una cuchara hasta homogeneizar. Batir es opcional para una textura más aireada.',
      ),
    ),
  },
  'lemon-cream-cheese': {
    'beat-frosting': help(
      q(
        'checkpoint',
        'Як зрозуміти, що лимонний крем готовий для оздоблення?',
        'How do I know the lemon frosting is ready for decorating?',
        '¿Cómo sé si la crema de limón está lista para decorar?',
      ),
    ),
  },
  'chocolate-glaze': {
    'combine-ingredients': skip(
      'Просте з’єднання перелічених інгредієнтів без оцінювання результату.',
    ),
    'warm-until-smooth': help(
      text(
        'body',
        'Чи потрібно доводити шоколадну глазур до кипіння?',
        'Should the chocolate glaze come to a boil?',
        '¿Debe hervir el glaseado de chocolate?',
        'Ні. Прогрівайте на маленькому вогні й постійно помішуйте до однорідності. Не допускайте кипіння або розшарування масла.',
        'No. Warm over low heat, stirring constantly until smooth. Do not let it boil or let the butter separate.',
        'No. Calienta a fuego bajo, removiendo constantemente hasta homogeneizar. No dejes que hierva ni que la mantequilla se separe.',
      ),
    ),
  },
  'gluten-free-napoleon': {
    'cut-in-butter': help(
      q(
        'checkpoint',
        'Наскільки дрібно подрібнювати масло для коржів?',
        'How finely should I cut the butter into the layer dough?',
        '¿Hasta qué punto debo picar la mantequilla para las capas?',
      ),
    ),
    'mix-wet-dough': help(
      q(
        'checkpoint',
        'Коли додавати борошно до сметанної суміші?',
        'When should I add flour to the sour cream mixture?',
        '¿Cuándo añado la harina a la mezcla de crema agria?',
      ),
    ),
    'combine-dough': help(
      q(
        'checkpoint',
        'Коли припинити замішувати тісто?',
        'When should I stop mixing the dough?',
        '¿Cuándo debo dejar de mezclar la masa?',
      ),
    ),
    'divide-and-chill': help(
      q(
        'tip',
        'Що робити, якщо охолоджене тісто надто тверде?',
        'What if the chilled dough is too firm?',
        '¿Qué hago si la masa fría está demasiado dura?',
      ),
    ),
    'roll-layer': help(
      q(
        'tip',
        'Коли потрібен другий лист пергаменту?',
        'When do I need a second sheet of parchment?',
        '¿Cuándo necesito una segunda hoja de papel de horno?',
      ),
    ),
    'trim-layer': help(
      q(
        'body',
        'Що робити з обрізками коржів?',
        'What should I do with the pastry trimmings?',
        '¿Qué hago con los recortes de masa?',
      ),
    ),
    'bake-layer': help(
      q(
        'checkpoint',
        'До якого кольору випікати коржі «Наполеона»?',
        'What colour should the Napoleon layers reach?',
        '¿Qué color deben tener las capas de la tarta Napoleón?',
      ),
    ),
    'heat-milk': help(
      q(
        'body',
        'Яку частину молока залишити холодною для крему?',
        'How much milk should I reserve cold for the custard?',
        '¿Qué cantidad de leche debo reservar fría para la crema?',
      ),
    ),
    'mix-custard-base': skip(
      'Порядок змішування і кількість яєць уже однозначно вказані.',
    ),
    'temper-custard': help(
      q(
        'body',
        'Як поєднати гаряче молоко з яєчно-крохмальною сумішшю?',
        'How do I combine hot milk with the egg and starch mixture?',
        '¿Cómo incorporo la leche caliente a la mezcla de huevo y almidón?',
      ),
    ),
    'cook-custard': help(
      q(
        'checkpoint',
        'Від якого моменту відраховувати останні секунди варіння крему?',
        'When do I start counting the final seconds of cooking the custard?',
        '¿Desde qué momento cuento los últimos segundos de cocción de la crema?',
      ),
    ),
    'finish-custard': skip(
      'Додавання масла після зняття з вогню вже прямо описане.',
    ),
    'toast-walnuts': skip(
      'Температура і тривалість підсушування вказані; додаткових підтверджених ознак немає.',
    ),
    'toast-almonds': skip(
      'Температура і тривалість підсушування вказані; додаткових підтверджених ознак немає.',
    ),
    'assemble-cake': help(
      text(
        'body',
        'Теплим чи холодним кремом перемазувати коржі?',
        'Should I spread warm or cold custard between the layers?',
        '¿Debo rellenar las capas con la crema templada o fría?',
        'Для складання «Наполеона» використовуйте теплий крем. Наносьте його на кожен корж; волоські горіхи додавайте через один шар.',
        'Use warm custard to assemble the Napoleon. Spread it on every layer, adding walnuts to alternate layers.',
        'Monta la tarta Napoleón con la crema templada. Extiéndela en cada capa y añade nueces en capas alternas.',
      ),
    ),
    'rest-assembled-cake': skip('Тривалість і місце витримки вже зазначені.'),
    'refrigerate-cake': help(
      q(
        'body',
        'Коли краще подавати «Наполеон» після складання?',
        'When is the best time to serve the assembled Napoleon?',
        '¿Cuándo conviene servir la tarta Napoleón después de montarla?',
      ),
    ),
  },
  'crinkle-cookies': {
    'beat-wet': help(
      q(
        'body',
        'До якого стану збивати масляно-яєчну основу печива?',
        'How far should I beat the butter and egg base for the cookies?',
        '¿Hasta qué punto bato la base de mantequilla y huevo de las galletas?',
      ),
    ),
    'combine-dough': help(
      q(
        'body',
        'Чи нормально, що шоколадне тісто дуже липке?',
        'Is it normal for the chocolate dough to be very sticky?',
        '¿Es normal que la masa de chocolate esté muy pegajosa?',
      ),
    ),
    'chill-dough': help(
      q(
        'body',
        'Чи можна залишити тісто для печива в холодильнику до завтра?',
        'Can I refrigerate the cookie dough until tomorrow?',
        '¿Puedo dejar la masa de galletas en la nevera hasta mañana?',
      ),
    ),
    'preheat-oven': skip('Підготовка духовки й дека описана повністю.'),
    'shape-and-coat': help(
      q(
        'tip',
        'Чому кульки печива треба формувати швидко?',
        'Why should I shape the cookie balls quickly?',
        '¿Por qué debo formar las bolitas de galleta rápidamente?',
      ),
    ),
    'bake-cookies': help(
      q(
        'body',
        'Чи повинні тріщинки печива висохнути в духовці?',
        'Should the cookie cracks dry out in the oven?',
        '¿Deben secarse las grietas de las galletas en el horno?',
      ),
    ),
    'cool-cookies': skip('Охолодження і спосіб зберігання вже описані.'),
  },
  'apple-charlotte': {
    'prepare-apples': skip(
      'Розмір яблук та охолодження масла прямо зазначені.',
    ),
    'whip-eggs': help(
      q(
        'checkpoint',
        'Як виглядає «стрічка» збитих яєць для шарлотки?',
        'What does the whipped-egg ribbon for charlotte look like?',
        '¿Cómo es el punto de cinta de los huevos para la tarta de manzana?',
      ),
    ),
    'fold-batter': help(
      q(
        'body',
        'Як ввести масло в яєчну піну для шарлотки?',
        'How do I fold butter into the egg foam for charlotte?',
        '¿Cómo incorporo la mantequilla a la espuma de huevo de la tarta de manzana?',
      ),
    ),
    bake: help(
      q(
        'checkpoint',
        'Як перевірити готовність шарлотки без точного часу випікання?',
        'How do I check charlotte without an exact baking time?',
        '¿Cómo compruebo la tarta de manzana sin un tiempo exacto de horneado?',
      ),
    ),
  },
  'plum-cake': {
    'prepare-plums': skip(
      'Напрямок зрізу, один шар і промокання соку вже описані.',
    ),
    'whip-eggs': help(
      q(
        'checkpoint',
        'Якими мають бути білки перед з’єднанням із жовтками?',
        'How firm should the whites be before folding in the yolks?',
        '¿Cómo deben estar las claras antes de incorporar las yemas?',
      ),
    ),
    'fold-flour': help(
      q(
        'checkpoint',
        'Коли припинити вмішувати борошно у сливовий пиріг?',
        'When should I stop folding flour into the plum cake batter?',
        '¿Cuándo dejo de incorporar la harina al bizcocho de ciruelas?',
      ),
    ),
    'fold-butter': help(
      q(
        'body',
        'Як додати розтоплене масло до повітряного тіста?',
        'How do I incorporate melted butter into the airy batter?',
        '¿Cómo incorporo la mantequilla fundida a la masa aireada?',
      ),
    ),
    'fill-pan': skip('Розкладання тіста і негайне випікання вже описані.'),
    bake: help(
      q(
        'checkpoint',
        'За якими ознаками сливовий пиріг готовий?',
        'What tells me the plum cake is baked?',
        '¿Qué señales indican que el bizcocho de ciruelas está hecho?',
      ),
      q(
        'tip',
        'Що робити, якщо верх сливового пирога вже рум’яний, а середина сира?',
        'What if the plum cake top is brown but the middle is still raw?',
        '¿Qué hago si el bizcocho de ciruelas está dorado por arriba pero crudo por dentro?',
      ),
    ),
    invert: help(
      q(
        'body',
        'Як перевернути сливовий пиріг із форми?',
        'How do I turn the plum cake out of its tin?',
        '¿Cómo doy la vuelta al bizcocho de ciruelas para desmoldarlo?',
      ),
    ),
  },
  'cottage-cheese-waffles': {
    'blend-base': help(
      q(
        'body',
        'Чи мають залишатися грудочки сиру у вафельній основі?',
        'Should curd lumps remain in the waffle base?',
        '¿Deben quedar grumos de queso fresco en la base de los gofres?',
      ),
    ),
    'add-wet': skip('Просте додавання інгредієнтів.'),
    'mix-dry': skip(
      'Перемішування до зникнення сухого борошна однозначне; необов’язкова неперевірена фруктова зміна не потребує окремого FAQ.',
    ),
    rest: skip('Чітко зазначений короткий відпочинок без додаткової дії.'),
    bake: help(
      q(
        'body',
        'Як визначити, що сирна вафля вже готова?',
        'How do I know the cottage cheese waffle is ready?',
        '¿Cómo sé si el gofre de queso fresco está listo?',
      ),
    ),
  },
  'carrot-cake': {
    'prepare-add-ins': skip('Замочування і нарізання вже описані.'),
    'blend-carrots': help(
      q(
        'checkpoint',
        'Наскільки дрібно подрібнювати моркву з олією?',
        'How smooth should the carrot and oil mixture be?',
        '¿Cómo de fina debe quedar la mezcla de zanahoria y aceite?',
      ),
    ),
    'whip-eggs': help(
      q(
        'checkpoint',
        'Як зрозуміти, що яйця для морквяного кексу достатньо збиті?',
        'How do I know the eggs for carrot cake are whipped enough?',
        '¿Cómo sé si los huevos del bizcocho de zanahoria están suficientemente batidos?',
      ),
    ),
    'mix-batter': help(
      q(
        'tip',
        'Коли припинити перемішувати морквяне тісто?',
        'When should I stop mixing the carrot cake batter?',
        '¿Cuándo dejo de mezclar la masa de zanahoria?',
      ),
    ),
    'fold-add-ins': skip(
      'Додавання горіхів і родзинок зрозуміле; зберігання сирого тіста не підсилюємо новою рекомендацією.',
    ),
    bake: help(
      q(
        'checkpoint',
        'Як перевірити середину морквяного кексу?',
        'How do I check the centre of the carrot cake?',
        '¿Cómo compruebo el centro del bizcocho de zanahoria?',
      ),
    ),
  },
  'sponge-cake': {
    'whip-whites': help(
      q(
        'checkpoint',
        'Якої стійкості мають бути білки для бісквіта?',
        'How firm should the sponge cake egg whites be?',
        '¿Qué firmeza deben tener las claras para el bizcocho?',
      ),
    ),
    'whip-yolks': help(
      q(
        'body',
        'До якого стану збивати жовтки для бісквіта?',
        'How far should I whip the yolks for the sponge?',
        '¿Hasta qué punto bato las yemas para el bizcocho?',
      ),
    ),
    'fold-dry': help(
      q(
        'checkpoint',
        'Коли припинити вмішувати суху суміш у бісквіт?',
        'When should I stop folding the dry mix into the sponge?',
        '¿Cuándo dejo de incorporar la mezcla seca al bizcocho?',
      ),
    ),
    bake: help(
      q(
        'checkpoint',
        'Що має бути на зубочистці після перевірки бісквіта?',
        'What should the toothpick look like after checking the sponge?',
        '¿Cómo debe salir el palillo al comprobar el bizcocho?',
      ),
    ),
    'cool-and-slice': help(
      q(
        'body',
        'Коли діставати й розрізати бісквіт після випікання?',
        'When should I remove and slice the baked sponge?',
        '¿Cuándo saco y corto el bizcocho después de hornearlo?',
      ),
    ),
  },
  crepes: {
    'start-batter': help(
      q(
        'tip',
        'Чому не вливати все молоко в млинцеве тісто одразу?',
        'Why not add all the milk to the crepe batter at once?',
        '¿Por qué no añadir toda la leche a la masa de crepes de una vez?',
      ),
    ),
    'add-milk': skip(
      'Поступове додавання молока й тривалість відпочинку вказані.',
    ),
    'finish-batter': help(
      q(
        'body',
        'Якою має бути текучість готового млинцевого тіста?',
        'How fluid should the finished crepe batter be?',
        '¿Qué fluidez debe tener la masa de crepes terminada?',
      ),
    ),
    cook: help(
      text(
        'body',
        'Коли млинець можна перевертати?',
        'When is the crepe ready to flip?',
        '¿Cuándo puedo dar la vuelta al crepe?',
        'Поверхня має стати матовою з дрібними отворами, а краї — легко відділятися від пательні. Тоді піддіть краї лопаткою й переверніть.',
        'Wait until the surface turns matte with small holes and the edges lift easily from the pan. Loosen the edges with a spatula, then flip.',
        'Espera a que la superficie esté mate, con pequeños agujeros, y los bordes se despeguen fácilmente. Levanta los bordes con una espátula y dale la vuelta.',
      ),
    ),
  },
  'fruit-sponge-roll': {
    'whip-eggs': help(
      q(
        'checkpoint',
        'Як перевірити яєчну піну для рулету?',
        'How do I check the egg foam for the sponge roll?',
        '¿Cómo compruebo la espuma de huevo para el brazo de gitano?',
      ),
    ),
    'fold-batter': skip(
      'Послідовність і момент зупинки вказані в короткій інструкції.',
    ),
    'bake-roll': help(
      q(
        'checkpoint',
        'Як зрозуміти, що бісквіт для рулету вже готовий?',
        'How do I know the roll sponge is baked?',
        '¿Cómo sé si la plancha de bizcocho está hecha?',
      ),
    ),
    'roll-and-cool': help(
      q(
        'body',
        'Чи знімати пергамент перед першим згортанням рулету?',
        'Should I remove the parchment before the first roll?',
        '¿Retiro el papel antes de enrollar el bizcocho por primera vez?',
      ),
    ),
    'spread-jam': help(
      q(
        'tip',
        'Чи потрібно повністю розпрямляти охолоджений бісквіт?',
        'Should I flatten the cooled sponge completely?',
        '¿Debo aplanar por completo el bizcocho frío?',
      ),
    ),
    'spread-cream': help(
      q(
        'tip',
        'Навіщо залишати край рулету без крему?',
        'Why leave one edge of the roll without cream?',
        '¿Por qué dejo un borde del bizcocho sin crema?',
      ),
    ),
    fill: help(
      q(
        'tip',
        'Чи можна подавати рулет одразу після наповнення?',
        'Can I serve the roll immediately after filling it?',
        '¿Puedo servir el brazo de gitano justo después de rellenarlo?',
      ),
    ),
  },
  'banana-bread': {
    'cream-butter-and-sugar': help(
      text(
        'body',
        'Як має виглядати збите масло з цукром для бананового хліба?',
        'What should creamed butter and sugar for banana bread look like?',
        '¿Cómo debe quedar la mantequilla batida con azúcar para el pan de plátano?',
        'Маса має стати світлою та пишною. Для цього кроку використовуйте м’яке масло.',
        'It should be pale and fluffy. Use softened butter for this step.',
        'Debe quedar una mezcla clara y esponjosa. Utiliza mantequilla blanda para este paso.',
      ),
    ),
    'add-bananas-and-eggs': skip(
      'Невеликі шматочки банана прямо дозволені в інструкції.',
    ),
    'combine-dry-ingredients': help(
      text(
        'body',
        'Наскільки наповнювати форму банановим тістом?',
        'How full should the banana bread tin be?',
        '¿Hasta dónde lleno el molde con la masa de plátano?',
        'Заповнюйте форму не більш ніж на три чверті та розрівняйте поверхню.',
        'Fill the tin no more than three-quarters full and level the top.',
        'Llena el molde como máximo hasta tres cuartas partes y alisa la superficie.',
      ),
    ),
    'bake-loaf': help(
      q(
        'body',
        'Чи допустимі вологі крихти на шпажці в банановому хлібі?',
        'Are moist crumbs on the banana bread skewer acceptable?',
        '¿Son aceptables las migas húmedas en el palillo del pan de plátano?',
      ),
    ),
    'cool-loaf': help(
      q(
        'body',
        'Чому банановий хліб потрібно охолодити перед нарізанням?',
        'Why should banana bread cool before slicing?',
        '¿Por qué debe enfriarse el pan de plátano antes de cortarlo?',
      ),
    ),
  },
  'lazy-dumplings': {
    'mix-wet': skip('Просте змішування доступним інструментом.'),
    'add-dry': help(
      q(
        'body',
        'Чи додавати ще борошно, якщо тісто для вареників липке?',
        'Should I add more flour if the dumpling dough is sticky?',
        '¿Añado más harina si la masa de los ñoquis de requesón está pegajosa?',
      ),
    ),
    rest: skip('Час і спосіб відпочинку зазначені.'),
    'shape-log': help(
      q(
        'body',
        'Як використовувати борошно під час формування вареників?',
        'How should I use flour when shaping the dumplings?',
        '¿Cómo uso la harina al formar los ñoquis de requesón?',
      ),
    ),
    'shape-dumplings': skip(
      'Нарізання й обкачування прямо описані; заморожування поза головною дією.',
    ),
    'cook-dumplings': help(
      q(
        'body',
        'Коли починати відлік останніх хвилин варіння вареників?',
        'When do I start counting the final minutes for the dumplings?',
        '¿Cuándo cuento los últimos minutos de cocción de los ñoquis de requesón?',
      ),
    ),
  },
  'prune-cake': {
    'prepare-pan': skip('Підготовка форми і духовки однозначна.'),
    'whip-eggs': help(
      q(
        'checkpoint',
        'Як виглядають достатньо збиті яйця для торта з чорносливом?',
        'What do sufficiently whipped eggs for the prune cake look like?',
        '¿Cómo quedan los huevos bien batidos para la tarta de ciruelas pasas?',
      ),
    ),
    'add-wet': help(
      q(
        'body',
        'Як з’єднати йогуртову суміш зі збитими яйцями?',
        'How do I combine the yogurt mixture with the whipped eggs?',
        '¿Cómo incorporo la mezcla de yogur a los huevos batidos?',
      ),
    ),
    'finish-batter': help(
      q(
        'checkpoint',
        'Що перевірити після вмішування какао й борошна?',
        'What should I check after folding in cocoa and flour?',
        '¿Qué compruebo después de incorporar el cacao y la harina?',
      ),
    ),
    'bake-covered': help(
      q(
        'body',
        'Як накрити тісто фольгою перед випіканням?',
        'How should I cover the batter with foil before baking?',
        '¿Cómo cubro la masa con papel de aluminio antes de hornear?',
      ),
    ),
    'bake-uncovered': help(
      q(
        'checkpoint',
        'Як перевірити готовність коржа після зняття фольги?',
        'How do I check the cake after removing the foil?',
        '¿Cómo compruebo el bizcocho después de retirar el aluminio?',
      ),
    ),
    'cool-and-slice': help(
      q(
        'tip',
        'Чи можна наносити крем на ще теплі коржі?',
        'Can I spread the cream on layers that are still warm?',
        '¿Puedo poner la crema sobre las capas todavía templadas?',
      ),
    ),
    'make-cream': skip(
      'Змішування, чорнослив і зберігання до складання описані.',
    ),
    'stack-layers': skip('Проста послідовність двох коржів і крему.'),
    'assemble-mound': help(
      q(
        'checkpoint',
        'Як має триматися верхівка з обрізків коржа?',
        'How should the mound of cake trimmings hold together?',
        '¿Cómo debe quedar el montículo de recortes de bizcocho?',
      ),
    ),
    'glaze-and-decorate': help(
      text(
        'body',
        'Якою глазур’ю поливати торт із чорносливом?',
        'How warm should the glaze be for the prune cake?',
        '¿A qué temperatura aplico el glaseado a la tarta de ciruelas pasas?',
        'Після прогрівання до однорідності дайте глазурі охолонути до теплої, поки вона ще ллється. Не доводьте глазур до кипіння.',
        'After warming until smooth, let the glaze cool until warm but still pourable. Do not bring it to a boil.',
        'Tras calentar hasta homogeneizar, deja que el glaseado se temple sin perder fluidez. No lo lleves a ebullición.',
      ),
    ),
  },
  'cinnamon-rolls': {
    'activate-yeast': help(
      q(
        'checkpoint',
        'Як побачити, що дріжджі для булочок активувалися?',
        'How can I tell the yeast for the rolls has activated?',
        '¿Cómo sé si se ha activado la levadura para los rollos?',
      ),
    ),
    'mix-dough': help(
      q(
        'tip',
        'Чи потрібно довго вимішувати безглютенове тісто для булочок?',
        'Does the gluten-free roll dough need long kneading?',
        '¿La masa sin gluten de los rollos necesita un amasado largo?',
      ),
    ),
    'first-proof': help(
      q(
        'checkpoint',
        'Як оцінити завершення першого підйому тіста?',
        'How do I judge when the first rise is complete?',
        '¿Cómo sé si ha terminado el primer levado?',
      ),
    ),
    'roll-dough': help(
      q(
        'tip',
        'Скільки крохмалю використовувати для розкачування булочок?',
        'How much starch should I use when rolling out the dough?',
        '¿Cuánto almidón uso para estirar la masa de los rollos?',
      ),
    ),
    'add-filling': help(
      q(
        'tip',
        'Як залишити край, щоб рулет із начинкою закрився?',
        'How should I leave the edge so the filled roll seals?',
        '¿Cómo dejo el borde para que cierre el rollo relleno?',
      ),
    ),
    'shape-rolls': help(
      q(
        'tip',
        'Як нарізати рулет, не сплющивши спіралі?',
        'How do I cut the log without flattening the spirals?',
        '¿Cómo corto el rollo sin aplastar las espirales?',
      ),
    ),
    'second-proof': help(
      q(
        'tip',
        'Чи мають булочки подвоїтися під час другого підйому?',
        'Should the rolls double during the second rise?',
        '¿Deben duplicar su tamaño los rollos durante el segundo levado?',
      ),
      q(
        'checkpoint',
        'Які ознаки достатнього другого підйому булочок?',
        'What shows that the rolls have risen enough the second time?',
        '¿Qué indica que los rollos han levado lo suficiente por segunda vez?',
      ),
    ),
    bake: help(
      q(
        'checkpoint',
        'Наскільки рум’яними мають бути готові булочки?',
        'How brown should the baked rolls be?',
        '¿Cómo de dorados deben quedar los rollos?',
      ),
    ),
    finish: help(
      q(
        'checkpoint',
        'Наносити покриття на гарячі чи теплі булочки?',
        'Should the rolls be hot or warm when I add the topping?',
        '¿Aplico la cobertura a los rollos calientes o templados?',
      ),
    ),
  },
  eclairs: {
    'mix-dry': skip('Просте просіювання перелічених інгредієнтів.'),
    'heat-liquid': help(
      q(
        'tip',
        'Чому масло у воді спочатку нагрівають повільно?',
        'Why heat the butter and water gently at first?',
        '¿Por qué caliento la mantequilla con el agua suavemente al principio?',
      ),
    ),
    'cook-panade': help(
      q(
        'tip',
        'Чи можна додавати яйця в гарячу заварену основу?',
        'Can I add eggs to the hot cooked choux base?',
        '¿Puedo añadir los huevos a la masa escaldada caliente?',
      ),
    ),
    'add-eggs': help(
      q(
        'checkpoint',
        'Як зрозуміти, що заварному тісту вже достатньо яйця?',
        'How do I know the choux dough has enough egg?',
        '¿Cómo sé si la masa choux ya tiene suficiente huevo?',
      ),
    ),
    pipe: help(
      q(
        'checkpoint',
        'Як мають тримати форму відсаджені профітролі?',
        'How should the piped profiteroles hold their shape?',
        '¿Cómo deben mantener la forma los profiteroles escudillados?',
      ),
    ),
    bake: help(
      q(
        'checkpoint',
        'Як відрізнити готові оболонки від ще недопечених?',
        'How do I distinguish baked shells from underbaked ones?',
        '¿Cómo distingo las piezas hechas de las que aún están poco horneadas?',
      ),
    ),
    'dry-shells': help(
      q(
        'checkpoint',
        'Якими мають бути оболонки після досушування й охолодження?',
        'What should the shells be like after drying and cooling?',
        '¿Cómo deben quedar las piezas después de secarlas y enfriarlas?',
      ),
    ),
    fill: skip('Наповнення саме повністю холодних оболонок прямо описане.'),
  },
  'easter-bread': {
    'prepare-fruit': skip(
      'Замочування й обов’язкове обсушування прямо описані.',
    ),
    'activate-yeast': help(
      q(
        'checkpoint',
        'Що робити, якщо дріжджі для паски не піняться?',
        'What if the yeast for the Easter bread does not foam?',
        '¿Qué hago si la levadura del pan de Pascua no forma espuma?',
      ),
    ),
    'mix-dough': skip(
      'Послідовність, швидкість і тривалість замісу вже докладні; консистенція перевіряється на наступному кроці.',
    ),
    'adjust-consistency': help(
      q(
        'checkpoint',
        'Чи має тісто для паски збиратися в гладку кульку?',
        'Should the Easter bread dough form a smooth ball?',
        '¿Debe formar una bola lisa la masa del pan de Pascua?',
      ),
      q(
        'body',
        'Коли додавати залишене молоко в тісто для паски?',
        'When should I add the reserved milk to the Easter bread dough?',
        '¿Cuándo añado la leche reservada a la masa del pan de Pascua?',
      ),
    ),
    'add-fruit': skip('Коротке вмішування обсушених добавок.'),
    'fill-moulds': help(
      text(
        'body',
        'До якої висоти наповнювати форми для паски?',
        'How high should I fill the Easter bread moulds?',
        '¿Hasta qué altura lleno los moldes del pan de Pascua?',
        'Наповнюйте форми на третину — до 40% висоти. Розрівняйте мокрою лопаткою, а родзинки на поверхні сховайте під тісто.',
        'Fill the moulds one-third to 40% of their height. Level with a wet spatula and tuck exposed raisins under the dough.',
        'Llena los moldes entre un tercio y el 40% de su altura. Alisa con una espátula mojada y esconde las pasas de la superficie bajo la masa.',
      ),
    ),
    proof: help(
      q(
        'checkpoint',
        'Коли завершувати вистоювання паски?',
        'When should I end the Easter bread proof?',
        '¿Cuándo termino el levado del pan de Pascua?',
      ),
    ),
    bake: help(
      q(
        'checkpoint',
        'Як перевірити готовність паски всередині?',
        'How do I check whether the Easter bread is baked inside?',
        '¿Cómo compruebo si el pan de Pascua está hecho por dentro?',
      ),
    ),
    cool: help(
      q(
        'body',
        'Коли можна нарізати паску, щоб не зім’яти м’якуш?',
        'When can I slice the Easter bread without crushing the crumb?',
        '¿Cuándo puedo cortar el pan de Pascua sin aplastar la miga?',
      ),
    ),
  },
  'apple-fritters': {
    'prepare-apples': help(
      text(
        'body',
        'Чому яблука для цих оладок натирають крупно?',
        'Why coarsely grate the apples for these fritters?',
        '¿Por qué rallo gruesas las manzanas para estas tortitas?',
        'Дрібно натерті яблука пустять забагато соку. Для цього рецепта потрібна велика стружка.',
        'Finely grated apples release too much juice. This recipe calls for coarse shreds.',
        'Las manzanas ralladas finas sueltan demasiado jugo. Esta receta necesita un rallado grueso.',
      ),
    ),
    'mix-batter': skip(
      'Послідовність змішування вказана; вибір підсолоджувача належить до інгредієнтів.',
    ),
    fry: help(
      q(
        'checkpoint',
        'Коли перевертати яблучні оладки?',
        'When should I flip the apple fritters?',
        '¿Cuándo doy la vuelta a las tortitas de manzana?',
      ),
      q(
        'tip',
        'Що робити, якщо яблучні оладки темнішають надто швидко?',
        'What if the apple fritters brown too quickly?',
        '¿Qué hago si las tortitas de manzana se doran demasiado rápido?',
      ),
    ),
  },
  'banana-fritters': {
    'mix-wet': skip(
      'Розминання з невеликими шматочками та змішування прямо описані.',
    ),
    'mix-batter': help(
      q(
        'checkpoint',
        'Чи потрібно розмішувати всі грудочки в банановому тісті?',
        'Should I mix out every lump in the banana pancake batter?',
        '¿Debo eliminar todos los grumos de la masa de tortitas de plátano?',
      ),
    ),
    portion: skip('Розмір порції й нагрів зазначені.'),
    cook: help(
      text(
        'body',
        'Коли перевертати бананові панкейки?',
        'When should I flip the banana pancakes?',
        '¿Cuándo doy la vuelta a las tortitas de plátano?',
        'Перевертайте, коли краї стали матовими, а бульбашки на поверхні почали лопатися. Другий бік готуйте до золотистої скоринки.',
        'Flip when the edges turn matte and bubbles on the surface start to burst. Cook the second side until golden.',
        'Dales la vuelta cuando los bordes estén mates y empiecen a reventar las burbujas de la superficie. Cocina el otro lado hasta que esté dorado.',
      ),
      q(
        'tip',
        'Що робити, якщо бананові панкейки рум’яняться до появи бульбашок?',
        'What if the banana pancakes brown before bubbles burst?',
        '¿Qué hago si las tortitas de plátano se doran antes de que revienten las burbujas?',
      ),
    ),
  },
  'apple-banana-fritters': {
    'prepare-fruit': skip('Тертка і консистенція банана явно описані.'),
    'mix-wet': skip('Просте рівномірне змішування рідкої основи.'),
    'add-apples': skip('Просте вмішування яблук.'),
    'finish-batter': help(
      q(
        'checkpoint',
        'Наскільки густим має бути яблучно-бананове тісто?',
        'How thick should the apple and banana batter be?',
        '¿Qué espesor debe tener la masa de manzana y plátano?',
      ),
    ),
    'heat-pan': skip('Середній нагрів і тонкий шар олії прямо вказані.'),
    portion: help(
      q(
        'tip',
        'Чому яблучно-бананові оладки краще робити невеликими?',
        'Why keep the apple and banana fritters small?',
        '¿Por qué conviene hacer pequeñas las tortitas de manzana y plátano?',
      ),
    ),
    fry: help(
      q(
        'checkpoint',
        'Коли перевертати оладки з яблуком і бананом?',
        'When should I flip the apple and banana fritters?',
        '¿Cuándo doy la vuelta a las tortitas de manzana y plátano?',
      ),
      q(
        'tip',
        'Що робити, якщо скоринка оладок з бананом швидко темнішає?',
        'What if the banana fritter crust darkens too quickly?',
        '¿Qué hago si la corteza de las tortitas con plátano se oscurece enseguida?',
      ),
    ),
  },
  'apple-meringue-pie': {
    'rub-base': help(
      q(
        'tip',
        'Чому масло для основи пирога потрібно розтирати швидко?',
        'Why should I rub the pie base butter in quickly?',
        '¿Por qué debo trabajar rápidamente la mantequilla de la base?',
      ),
    ),
    'mix-dough': help(
      q(
        'checkpoint',
        'Яким має бути тісто для основи яблучного пирога?',
        'What should the apple pie base dough feel like?',
        '¿Cómo debe quedar la masa de la base de la tarta de manzana?',
      ),
    ),
    'chill-dough': help(
      q(
        'checkpoint',
        'Як перевірити тісто після охолодження?',
        'How do I check the pie dough after chilling?',
        '¿Cómo compruebo la masa de la tarta después de enfriarla?',
      ),
    ),
    'prepare-apples': skip(
      'Просте очищення й натирання; вид тертки джерело не уточнює.',
    ),
    'line-pan': help(
      q(
        'checkpoint',
        'Що перевірити у викладеній у форму основі?',
        'What should I check in the lined pie base?',
        '¿Qué compruebo en la base de masa extendida en el molde?',
      ),
    ),
    assemble: help(
      text(
        'tip',
        'Скільки цукру додавати в меренгу цього пирога?',
        'How much sugar goes into this pie’s meringue?',
        '¿Cuánto azúcar lleva el merengue de esta tarta?',
        'У рецепті не уточнено, чи додають цукор у меренгу та в якій кількості. Підтвердженої кількості для цього кроку немає.',
        'The recipe does not specify whether sugar is added to the meringue or how much. There is no confirmed quantity for this step.',
        'La receta no especifica si se añade azúcar al merengue ni en qué cantidad. No hay una cantidad confirmada para este paso.',
      ),
    ),
    bake: help(
      text(
        'tip',
        'Чи гарантовано вистачить зазначених 40 хвилин для цього пирога?',
        'Are the stated 40 minutes guaranteed to be enough for this pie?',
        '¿Están garantizados los 40 minutos indicados para esta tarta?',
        'Ні. Це час із джерела; точна форма й поведінка духовки ще потребують перевірки. Підтверджених додаткових ознак готовності в рецепті немає.',
        'No. This is the source time; the exact tin and oven behaviour still need verification. The recipe has no confirmed additional doneness cues.',
        'No. Es el tiempo de la fuente; todavía hay que verificar el molde concreto y el comportamiento del horno. La receta no tiene otras señales de cocción confirmadas.',
      ),
    ),
  },
  'mascarpone-whipped-cream': {
    'whip-cream': help(
      q(
        'checkpoint',
        'Як виглядають м’які піки вершків перед маскарпоне?',
        'What do soft cream peaks look like before adding mascarpone?',
        '¿Cómo son los picos suaves de la nata antes de añadir mascarpone?',
      ),
    ),
    'add-mascarpone': help(
      q(
        'tip',
        'Коли припинити збивати вершки з маскарпоне?',
        'When should I stop whipping the cream with mascarpone?',
        '¿Cuándo dejo de batir la nata con el mascarpone?',
      ),
    ),
  },
  'vanilla-egg-custard': {
    'heat-milk': help(
      q(
        'body',
        'Чи має молоко для ванільного крему бурхливо кипіти?',
        'Should the milk for vanilla custard boil vigorously?',
        '¿Debe hervir fuerte la leche de la crema de vainilla?',
      ),
    ),
    'mix-yolks': skip(
      'Порядок змішування і гладка консистенція прямо зазначені.',
    ),
    'temper-yolks': help(
      q(
        'tip',
        'Як влити гаряче молоко, щоб жовтки не згорнулися?',
        'How do I add hot milk without curdling the yolks?',
        '¿Cómo añado la leche caliente sin cuajar las yemas?',
      ),
    ),
    'cook-custard': help(
      q(
        'body',
        'Коли починати відлік останньої хвилини заварювання крему?',
        'When do I start the final minute of cooking the custard?',
        '¿Cuándo empiezo a contar el último minuto de cocción de la crema?',
      ),
    ),
    'finish-and-chill': help(
      q(
        'checkpoint',
        'Якою має бути консистенція охолодженого ванільного крему?',
        'What should the cooled vanilla custard consistency be?',
        '¿Qué consistencia debe tener la crema de vainilla fría?',
      ),
    ),
  },
  'eggless-vanilla-custard': {
    'make-paste': help(
      q(
        'tip',
        'Яким має бути масло для пасти з борошном?',
        'How soft should the butter for the flour paste be?',
        '¿Cómo debe estar la mantequilla para la pasta de harina?',
      ),
    ),
    'add-first-milk': skip(
      'Поступове додавання і повільне нагрівання докладно описані.',
    ),
    'finish-cooking': help(
      q(
        'body',
        'Коли знімати безяєчний заварний крем із вогню?',
        'When should I take the eggless custard off the heat?',
        '¿Cuándo retiro del fuego la crema sin huevo?',
      ),
    ),
    cool: help(
      q(
        'checkpoint',
        'Яким має бути безяєчний крем після охолодження?',
        'What should the eggless custard be like after cooling?',
        '¿Cómo debe quedar la crema sin huevo después de enfriarse?',
      ),
    ),
  },
  'vanilla-buttercream': {
    'cook-base': help(
      q(
        'checkpoint',
        'Наскільки має загуснути основа масляного крему?',
        'How thick should the cooked buttercream base become?',
        '¿Cuánto debe espesar la base cocida de la crema de mantequilla?',
      ),
    ),
    'cool-base': help(
      q(
        'checkpoint',
        'До якого стану охолодити основу перед додаванням до масла?',
        'How cool should the base be before adding it to the butter?',
        '¿Cuánto enfrío la base antes de añadirla a la mantequilla?',
      ),
    ),
    'whip-butter': help(
      q(
        'body',
        'Як зрозуміти, що масло для крему достатньо збите?',
        'How do I know the butter for the cream is whipped enough?',
        '¿Cómo sé si la mantequilla para la crema está suficientemente batida?',
      ),
    ),
    combine: help(
      q(
        'checkpoint',
        'Як має виглядати готовий заварний масляний крем?',
        'What should the finished custard buttercream look like?',
        '¿Cómo debe quedar la crema de mantequilla con base cocida?',
      ),
    ),
  },
};

// Fixed components are reviewed in their host context as well as standalone.
stepHelpCatalog['celebration-sponge-cake'] = {
  'sponge-whip-whites': stepHelpCatalog['sponge-cake']['whip-whites'],
  'sponge-whip-yolks': stepHelpCatalog['sponge-cake']['whip-yolks'],
  'sponge-fold-dry': stepHelpCatalog['sponge-cake']['fold-dry'],
  'sponge-bake': stepHelpCatalog['sponge-cake'].bake,
  'sponge-cool-and-slice': stepHelpCatalog['sponge-cake']['cool-and-slice'],
  'filling-mix': stepHelpCatalog['sour-cream'].mix,
  'buttercream-beat-buttercream': help(
    q(
      'checkpoint',
      'Як перевірити масляний крем для боків і квіточок?',
      'How do I check the buttercream for the sides and piped flowers?',
      '¿Cómo compruebo la crema de mantequilla para los laterales y las flores?',
    ),
  ),
  fill: help(
    text(
      'body',
      'Як просочити високий бісквітний торт перед кремом?',
      'How should I moisten the tall sponge layers before filling?',
      '¿Cómo humedezco las capas del bizcocho alto antes de rellenarlo?',
      'За потреби злегка просочіть коржі яблучним соком або солодким чаєм, особливо по краях. Крем щедро розподіліть між коржами.',
      'If needed, lightly moisten the layers with apple juice or sweet tea, especially around the edges. Spread the filling generously between the layers.',
      'Si hace falta, humedece ligeramente las capas con zumo de manzana o té azucarado, sobre todo los bordes. Reparte generosamente la crema entre las capas.',
    ),
  ),
  coat: skip('Охолодження покриття перед глазур’ю вже прямо описане.'),
  'glaze-combine-ingredients':
    stepHelpCatalog['chocolate-glaze']['combine-ingredients'],
  'glaze-warm-until-smooth':
    stepHelpCatalog['chocolate-glaze']['warm-until-smooth'],
  glaze: help(
    q(
      'body',
      'Як перевірити глазур перед створенням потьоків на торті?',
      'How do I check the glaze before making drips on the cake?',
      '¿Cómo compruebo el glaseado antes de hacer los chorretones en la tarta?',
    ),
  ),
  decorate: skip('Оздоблення після охолодження глазурі й зберігання описані.'),
};
