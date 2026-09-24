import type {
  RecipeSourceDraft,
  RecipeSourceDraftContent,
} from './source-recipe.types.ts';
import { quantityFromGrams, quantityFromSpoons } from './spoon-weights.ts';

type CreamLocale = 'en' | 'es' | 'uk';

const testedExplanation: Record<CreamLocale, string> = {
  en: 'This exact cream has been prepared successfully.',
  es: 'Esta versión exacta de la crema se ha preparado con éxito.',
  uk: 'Цей точний варіант крему успішно готували.',
};

const mascarponeQuantity = {
  cream: {
    base: { kind: 'exact', value: 250, unit: 'ml' },
    shopping: { mode: 'base' },
  },
  sugar: quantityFromGrams('granulated-sugar', 80),
  mascarpone: {
    base: { kind: 'exact', value: 250, unit: 'g' },
    shopping: { mode: 'base' },
  },
} as const;

function mascarponeCreamContent(locale: CreamLocale): RecipeSourceDraftContent {
  const copy = {
    en: {
      section: 'Cream',
      cream: 'Whipping cream',
      creamNote: 'Keep refrigerated until whipping.',
      sugar: 'Sugar',
      mascarpone: 'Mascarpone',
      mascarponeNote: 'Keep refrigerated until needed.',
      prepareTitle: 'Chill the ingredients and tools',
      prepareBody:
        'Keep the whipping cream and mascarpone cold. Chill the mixing bowl and whisk if the kitchen is warm.',
      prepareCheckpoint:
        'The cream and mascarpone are cold, and the bowl feels cool to the touch.',
      prepareTip:
        'Cold ingredients whip more predictably and help the finished cream hold its shape.',
      whipTitle: 'Whip the cream with the sugar',
      whipBody:
        'Whip the cold cream with the sugar until it thickens and holds soft peaks.',
      whipCheckpoint:
        'The whisk leaves clear tracks and the peak bends gently without collapsing.',
      whipTip:
        'Stop at soft peaks so the cream is not overwhipped before the mascarpone is added.',
      finishTitle: 'Add the mascarpone',
      finishBody:
        'Add the cold mascarpone and whip briefly, just until the cream is smooth and holds its shape.',
      finishCheckpoint:
        'The cream is smooth, spreadable and holds a firm soft peak on the whisk or spatula.',
      finishTip:
        'Stop mixing as soon as the cream is stable; prolonged whipping can make it grainy.',
    },
    es: {
      section: 'Crema',
      cream: 'Nata para montar',
      creamNote: 'Manténla refrigerada hasta el momento de batir.',
      sugar: 'Azúcar',
      mascarpone: 'Mascarpone',
      mascarponeNote: 'Manténlo refrigerado hasta que lo necesites.',
      prepareTitle: 'Enfría los ingredientes y utensilios',
      prepareBody:
        'Mantén fríos la nata y el mascarpone. Si la cocina está caliente, enfría también el bol y las varillas.',
      prepareCheckpoint:
        'La nata y el mascarpone están fríos y el bol se siente fresco al tacto.',
      prepareTip:
        'Los ingredientes fríos se montan de forma más predecible y ayudan a que la crema conserve la forma.',
      whipTitle: 'Monta la nata con el azúcar',
      whipBody:
        'Bate la nata fría con el azúcar hasta que espese y forme picos suaves.',
      whipCheckpoint:
        'Las varillas dejan marcas claras y el pico se inclina suavemente sin deshacerse.',
      whipTip:
        'Detente en los picos suaves para no batir demasiado la nata antes de añadir el mascarpone.',
      finishTitle: 'Añade el mascarpone',
      finishBody:
        'Añade el mascarpone frío y bate brevemente, solo hasta obtener una crema lisa que mantenga la forma.',
      finishCheckpoint:
        'La crema está lisa, se puede extender y mantiene un pico suave y firme en las varillas o la espátula.',
      finishTip:
        'Deja de batir en cuanto esté estable; batir durante demasiado tiempo puede volverla granulosa.',
    },
    uk: {
      section: 'Крем',
      cream: 'Вершки для збивання',
      creamNote: 'Тримайте в холодильнику до збивання.',
      sugar: 'Цукор',
      mascarpone: 'Маскарпоне',
      mascarponeNote: 'Тримайте в холодильнику до використання.',
      prepareTitle: 'Охолодіть інгредієнти й посуд',
      prepareBody:
        'Тримайте вершки та маскарпоне холодними. Якщо на кухні тепло, охолодіть також миску й вінчики.',
      prepareCheckpoint:
        'Вершки й маскарпоне холодні, а миска прохолодна на дотик.',
      prepareTip:
        'Холодні інгредієнти збиваються передбачуваніше й допомагають готовому крему тримати форму.',
      whipTitle: 'Збийте вершки з цукром',
      whipBody:
        'Збивайте холодні вершки з цукром, доки вони не загуснуть і не утворять м’які піки.',
      whipCheckpoint:
        'Вінчики залишають чіткі сліди, а пік м’яко згинається, але не опадає.',
      whipTip:
        'Зупиніться на м’яких піках, щоб не перебити вершки до додавання маскарпоне.',
      finishTitle: 'Додайте маскарпоне',
      finishBody:
        'Додайте холодний маскарпоне й коротко збийте лише до гладкого крему, який тримає форму.',
      finishCheckpoint:
        'Крем гладкий, легко намазується й тримає м’який стійкий пік на вінчику або лопатці.',
      finishTip:
        'Зупиніть збивання, щойно крем стане стійким: від надмірного збивання він може стати зернистим.',
    },
  }[locale];

  return {
    presentation: 'concise',
    completeness: 'readyToReview',
    difficulty: 'easy',
    evidence: { status: 'tested', explanation: testedExplanation[locale] },
    yield: {
      id: 'about-580-g-cream',
      label: {
        en: 'About 580 g cream',
        es: 'Unos 580 g de crema',
        uk: 'Близько 580 г крему',
      }[locale],
      count: { kind: 'exact', value: 1 },
      unit: 'batch',
    },
    timing: {
      activeMinutes: 10,
      totalElapsedMinutes: 10,
      phases: [],
    },
    ingredientSections: [
      {
        id: 'cream',
        title: copy.section,
        ingredients: [
          {
            id: 'whipping-cream',
            name: copy.cream,
            quantity: mascarponeQuantity.cream,
            note: copy.creamNote,
          },
          {
            id: 'sugar',
            name: copy.sugar,
            quantity: mascarponeQuantity.sugar,
          },
          {
            id: 'mascarpone',
            name: copy.mascarpone,
            quantity: mascarponeQuantity.mascarpone,
            note: copy.mascarponeNote,
          },
        ],
      },
    ],
    steps: [
      {
        id: 'whip-cream',
        title: copy.whipTitle,
        body: copy.whipBody,
        checkpoint: copy.whipCheckpoint,
        cookIngredients: [
          { ingredientId: 'whipping-cream' },
          { ingredientId: 'sugar' },
        ],
      },
      {
        id: 'add-mascarpone',
        title: copy.finishTitle,
        body: copy.finishBody,
        checkpoint: copy.finishCheckpoint,
        tip: copy.finishTip,
        cookIngredients: [{ ingredientId: 'mascarpone' }],
        media: [
          {
            id: 'mascarpone-cream-final-v1',
            src: '/media/recipes/fruit-sponge-roll/selected/mascarpone-cream-v1.png',
            alt: {
              en: 'Whipped mascarpone cream holding a smooth stable peak on a spatula',
              es: 'Crema de mascarpone montada que mantiene un pico liso y estable en una espátula',
              uk: 'Збитий крем із маскарпоне тримає гладкий стійкий пік на лопатці',
            }[locale],
          },
        ],
      },
    ],
  };
}

const eggCustardQuantity = {
  milk: {
    base: { kind: 'exact', value: 570, unit: 'ml' },
    shopping: { mode: 'base' },
  },
  sugar: quantityFromGrams('granulated-sugar', 130),
  cornStarch: quantityFromGrams('corn-starch', 28),
  salt: {
    base: null,
    equivalent: { kind: 'exact', value: 1, unit: 'pinch' },
    shopping: { mode: 'nameOnly' },
  },
  yolks: {
    base: { kind: 'exact', value: 6, unit: 'piece' },
    shopping: { mode: 'base', increment: 1, rounding: 'up' },
  },
  vanilla: {
    base: null,
    equivalent: { kind: 'exact', value: 2, unit: 'tsp' },
    shopping: { mode: 'nameOnly' },
  },
  butter: {
    base: { kind: 'exact', value: 110, unit: 'g' },
    shopping: { mode: 'base' },
  },
} as const;

function eggCustardContent(locale: CreamLocale): RecipeSourceDraftContent {
  const copy = {
    en: {
      section: 'Vanilla custard',
      milk: 'Whole milk',
      sugar: 'Sugar',
      starch: 'Corn starch',
      salt: 'Salt',
      yolks: 'Egg yolks',
      vanilla: 'Vanilla extract',
      butter: 'Unsalted butter',
      butterNote: 'Cold, cut into small cubes.',
      heatTitle: 'Heat the milk',
      heatBody:
        'Heat the milk over medium heat until small bubbles appear around the edge. Do not let it boil vigorously.',
      heatCheckpoint:
        'The milk is steaming and small bubbles are visible around the edge of the saucepan.',
      heatTip: 'Gentle heat reduces evaporation and prevents scorching.',
      mixTitle: 'Mix the yolk base',
      mixBody:
        'Whisk the sugar, corn starch and salt together. Add the egg yolks and whisk until the mixture is smooth and paler.',
      mixCheckpoint:
        'The mixture is smooth, thick and free of dry pockets of starch.',
      mixTip:
        'Mix the sugar and starch before adding the yolks so the starch disperses evenly.',
      temperTitle: 'Temper the yolks',
      temperBody:
        'Whisking constantly, gradually pour about half of the hot milk into the yolk mixture. Return everything to the saucepan.',
      temperCheckpoint:
        'The mixture is fluid and even, with no visible pieces of cooked egg.',
      temperTip:
        'Pour the milk slowly and keep the whisk moving so the yolks warm without scrambling.',
      cookTitle: 'Cook until thick',
      cookBody:
        'Cook over medium heat, whisking constantly. When bubbles begin to break across the centre, continue cooking for 1 minute.',
      cookCheckpoint:
        'The custard is glossy and thick, and broad bubbles break through the centre.',
      cookTip:
        'Whisk into the corners of the saucepan, where the custard thickens first.',
      finishTitle: 'Finish and chill the custard',
      finishBody:
        'Remove from the heat and strain. Stir in the vanilla, then add the cold butter a few pieces at a time. Cover the surface directly and chill completely.',
      finishCheckpoint:
        'The custard is smooth and glossy with no lumps; after chilling it holds its shape on a spoon.',
      finishTip:
        'Press the covering directly onto the surface to prevent a skin from forming.',
    },
    es: {
      section: 'Crema pastelera de vainilla',
      milk: 'Leche entera',
      sugar: 'Azúcar',
      starch: 'Almidón de maíz',
      salt: 'Sal',
      yolks: 'Yemas de huevo',
      vanilla: 'Extracto de vainilla',
      butter: 'Mantequilla sin sal',
      butterNote: 'Fría y cortada en cubos pequeños.',
      heatTitle: 'Calienta la leche',
      heatBody:
        'Calienta la leche a fuego medio hasta que aparezcan pequeñas burbujas en el borde. No dejes que hierva con fuerza.',
      heatCheckpoint:
        'La leche desprende vapor y se ven pequeñas burbujas alrededor del cazo.',
      heatTip:
        'El fuego suave reduce la evaporación y evita que la leche se queme.',
      mixTitle: 'Prepara la base de yemas',
      mixBody:
        'Mezcla el azúcar, el almidón y la sal. Añade las yemas y bate hasta obtener una mezcla lisa y más pálida.',
      mixCheckpoint:
        'La mezcla está lisa, espesa y no quedan zonas secas de almidón.',
      mixTip:
        'Mezcla primero el azúcar y el almidón para que este se distribuya de manera uniforme.',
      temperTitle: 'Templa las yemas',
      temperBody:
        'Sin dejar de batir, vierte poco a poco aproximadamente la mitad de la leche caliente sobre las yemas. Devuelve todo al cazo.',
      temperCheckpoint:
        'La mezcla está fluida y uniforme, sin trozos visibles de huevo cuajado.',
      temperTip:
        'Vierte la leche lentamente y mantén las varillas en movimiento para que las yemas no se cuajen.',
      cookTitle: 'Cuece hasta que espese',
      cookBody:
        'Cuece a fuego medio, batiendo constantemente. Cuando las burbujas aparezcan también en el centro, continúa 1 minuto más.',
      cookCheckpoint:
        'La crema está brillante y espesa, y salen burbujas grandes por el centro.',
      cookTip:
        'Pasa las varillas por las esquinas del cazo, donde la crema espesa primero.',
      finishTitle: 'Termina y enfría la crema',
      finishBody:
        'Retira del fuego y cuela. Incorpora la vainilla y después la mantequilla fría, poco a poco. Cubre la superficie directamente y deja enfriar por completo.',
      finishCheckpoint:
        'La crema está lisa y brillante, sin grumos; una vez fría mantiene la forma en una cuchara.',
      finishTip:
        'Coloca la cobertura en contacto directo con la superficie para evitar que se forme una película.',
    },
    uk: {
      section: 'Ванільний заварний крем',
      milk: 'Незбиране молоко',
      sugar: 'Цукор',
      starch: 'Кукурудзяний крохмаль',
      salt: 'Сіль',
      yolks: 'Яєчні жовтки',
      vanilla: 'Ванільний екстракт',
      butter: 'Несолоне вершкове масло',
      butterNote: 'Холодне, нарізане невеликими кубиками.',
      heatTitle: 'Нагрійте молоко',
      heatBody:
        'Нагрівайте молоко на середньому вогні, доки по краю не з’являться дрібні бульбашки. Не давайте йому бурхливо кипіти.',
      heatCheckpoint:
        'Від молока йде пара, а по краю сотейника видно дрібні бульбашки.',
      heatTip:
        'Помірне нагрівання зменшує випаровування й не дає молоку пригоріти.',
      mixTitle: 'Змішайте жовткову основу',
      mixBody:
        'Перемішайте цукор, кукурудзяний крохмаль і сіль. Додайте жовтки та збийте до гладкої світлішої маси.',
      mixCheckpoint: 'Маса гладка й густа, без сухих грудочок крохмалю.',
      mixTip:
        'Спочатку перемішайте цукор із крохмалем, щоб крохмаль розподілився рівномірно.',
      temperTitle: 'Темперуйте жовтки',
      temperBody:
        'Постійно збиваючи, поступово влийте до жовткової маси приблизно половину гарячого молока. Поверніть усе в сотейник.',
      temperCheckpoint:
        'Суміш рідка й однорідна, без видимих частинок згорнутого яйця.',
      temperTip:
        'Вливайте молоко повільно й безперервно працюйте вінчиком, щоб жовтки не згорнулися.',
      cookTitle: 'Заваріть до загустіння',
      cookBody:
        'Варіть на середньому вогні, постійно збиваючи. Коли бульбашки почнуть виходити й у центрі, готуйте ще 1 хвилину.',
      cookCheckpoint:
        'Крем блискучий і густий, а широкі бульбашки виходять у центрі.',
      cookTip:
        'Проводьте вінчиком по кутах сотейника — там крем густішає найшвидше.',
      finishTitle: 'Завершіть і охолодіть крем',
      finishBody:
        'Зніміть із вогню та процідіть. Вмішайте ваніль, а потім порціями холодне масло. Накрийте поверхню в контакт і повністю охолодіть.',
      finishCheckpoint:
        'Крем гладкий і блискучий, без грудочок; після охолодження тримає форму на ложці.',
      finishTip:
        'Притисніть покриття безпосередньо до поверхні, щоб на кремі не утворилася плівка.',
    },
  }[locale];

  return {
    presentation: 'concise',
    completeness: 'readyToReview',
    difficulty: 'medium',
    evidence: { status: 'tested', explanation: testedExplanation[locale] },
    yield: {
      id: 'about-900-g-custard',
      label: {
        en: 'About 900 g cream',
        es: 'Unos 900 g de crema',
        uk: 'Близько 900 г крему',
      }[locale],
      count: { kind: 'exact', value: 1 },
      unit: 'batch',
    },
    timing: {
      activeMinutes: 25,
      totalElapsedMinutes: 150,
      phases: [
        {
          id: 'chill-custard',
          label: {
            en: 'Chill completely',
            es: 'Enfriar por completo',
            uk: 'Повне охолодження',
          }[locale],
          duration: { kind: 'exact', value: 2, unit: 'hour' },
          relatedStepId: 'finish-and-chill',
        },
      ],
    },
    beforeStart: [
      {
        en: 'Allow about 2 hours for the finished custard to chill completely before filling pastries.',
        es: 'Reserva unas 2 horas para enfriar por completo la crema antes de rellenar los pasteles.',
        uk: 'Закладіть близько 2 годин, щоб готовий крем повністю охолов перед наповненням тістечок.',
      }[locale],
    ],
    ingredientSections: [
      {
        id: 'custard',
        title: copy.section,
        ingredients: [
          { id: 'milk', name: copy.milk, quantity: eggCustardQuantity.milk },
          { id: 'sugar', name: copy.sugar, quantity: eggCustardQuantity.sugar },
          {
            id: 'corn-starch',
            name: copy.starch,
            quantity: eggCustardQuantity.cornStarch,
          },
          { id: 'salt', name: copy.salt, quantity: eggCustardQuantity.salt },
          {
            id: 'egg-yolks',
            name: copy.yolks,
            quantity: eggCustardQuantity.yolks,
          },
          {
            id: 'vanilla',
            name: copy.vanilla,
            quantity: eggCustardQuantity.vanilla,
          },
          {
            id: 'butter',
            name: copy.butter,
            quantity: eggCustardQuantity.butter,
            note: copy.butterNote,
          },
        ],
      },
    ],
    steps: [
      {
        id: 'heat-milk',
        title: copy.heatTitle,
        body: copy.heatBody,
        tip: copy.heatTip,
        cookIngredients: [{ ingredientId: 'milk' }],
      },
      {
        id: 'mix-yolks',
        title: copy.mixTitle,
        body: copy.mixBody,
        cookIngredients: [
          { ingredientId: 'sugar' },
          { ingredientId: 'corn-starch' },
          { ingredientId: 'salt' },
          { ingredientId: 'egg-yolks' },
        ],
      },
      {
        id: 'temper-yolks',
        title: copy.temperTitle,
        body: copy.temperBody,
        tip: copy.temperTip,
      },
      {
        id: 'cook-custard',
        title: copy.cookTitle,
        body: copy.cookBody,
        checkpoint: copy.cookCheckpoint,
        tip: copy.cookTip,
      },
      {
        id: 'finish-and-chill',
        title: copy.finishTitle,
        body: copy.finishBody,
        checkpoint: copy.finishCheckpoint,
        cookIngredients: [
          { ingredientId: 'vanilla' },
          { ingredientId: 'butter' },
        ],
        media: [
          {
            id: 'vanilla-egg-custard-final-v1',
            src: '/media/recipes/vanilla-egg-custard/selected/final-custard-v1.png',
            alt: {
              en: 'Smooth glossy vanilla custard holding its shape on a spoon',
              es: 'Crema pastelera de vainilla lisa y brillante que mantiene la forma en una cuchara',
              uk: 'Гладкий блискучий ванільний крем тримає форму на ложці',
            }[locale],
          },
        ],
      },
    ],
  };
}

const egglessCustardQuantity = {
  milk: {
    base: { kind: 'exact', value: 1500, unit: 'ml' },
    shopping: { mode: 'base' },
  },
  sugar: quantityFromSpoons('granulated-sugar', 6, 'tbsp'),
  flour: {
    base: null,
    equivalent: { kind: 'exact', value: 6, unit: 'tbsp' },
    shopping: { mode: 'nameOnly' },
  },
  butter: {
    base: { kind: 'exact', value: 200, unit: 'g' },
    shopping: { mode: 'base' },
  },
  vanilla: { base: null, shopping: { mode: 'nameOnly' } },
} as const;

function egglessCustardContent(locale: CreamLocale): RecipeSourceDraftContent {
  const copy = {
    en: {
      section: 'Eggless vanilla custard',
      milk: 'Milk',
      sugar: 'Sugar',
      flour: 'Flour',
      flourNote:
        'The recorded recipe uses 6 tablespoons; the flour type and gram weight are not recorded.',
      butter: 'Butter',
      butterNote: 'Softened so it can be worked with a fork or spoon.',
      vanilla: 'Vanilla',
      vanillaNote: 'Add to taste.',
      pasteTitle: 'Make the butter and flour paste',
      pasteBody:
        'Mix the sugar and flour. Add the softened butter and work everything together with a fork or spoon to make an even paste.',
      pasteCheckpoint:
        'The mixture is even and paste-like, with no pockets of dry flour.',
      pasteTip:
        'The butter should be soft but not melted so the flour can be worked into it evenly.',
      firstMilkTitle: 'Add half of the milk',
      firstMilkBody:
        'Gradually stir in about half of the milk. Warm slowly over low heat, stirring continuously until the mixture becomes smooth.',
      firstMilkCheckpoint:
        'The mixture is fluid and uniform, with no visible lumps of butter or flour.',
      firstMilkTip:
        'Add the milk in several additions at first; this makes it easier to smooth out the paste.',
      finishMilkTitle: 'Add the remaining milk and cook',
      finishMilkBody:
        'Pour in the remaining milk and add vanilla to taste. Continue heating and stirring until the first bubbles appear, then remove from the heat.',
      finishMilkCheckpoint:
        'The cream is smooth and lightly thickened, and the first bubbles have just appeared.',
      finishMilkTip:
        'Stir across the bottom and into the corners so the flour does not settle or scorch.',
      coolTitle: 'Cover and cool',
      coolBody:
        'Transfer the cream to a clean container, cover the surface directly and let it cool before filling the pastry.',
      coolCheckpoint:
        'The cooled cream is even and spoonable, without a dry skin on top.',
      coolTip:
        'The cream thickens further as it cools; do not keep boiling it after the first bubbles.',
    },
    es: {
      section: 'Crema de vainilla sin huevo',
      milk: 'Leche',
      sugar: 'Azúcar',
      flour: 'Harina',
      flourNote:
        'La receta registrada usa 6 cucharadas; no se indican el tipo de harina ni su peso en gramos.',
      butter: 'Mantequilla',
      butterNote:
        'Ablandada para poder trabajarla con un tenedor o una cuchara.',
      vanilla: 'Vainilla',
      vanillaNote: 'Añade al gusto.',
      pasteTitle: 'Prepara la pasta de mantequilla y harina',
      pasteBody:
        'Mezcla el azúcar y la harina. Añade la mantequilla blanda y trabaja todo con un tenedor o una cuchara hasta obtener una pasta uniforme.',
      pasteCheckpoint:
        'La mezcla es uniforme y pastosa, sin zonas de harina seca.',
      pasteTip:
        'La mantequilla debe estar blanda pero no derretida para que la harina se incorpore de manera uniforme.',
      firstMilkTitle: 'Añade la mitad de la leche',
      firstMilkBody:
        'Incorpora poco a poco aproximadamente la mitad de la leche. Calienta lentamente a fuego bajo, removiendo sin parar hasta que la mezcla quede lisa.',
      firstMilkCheckpoint:
        'La mezcla está fluida y uniforme, sin grumos visibles de mantequilla o harina.',
      firstMilkTip:
        'Añade la leche en varias veces al principio; así es más fácil deshacer la pasta.',
      finishMilkTitle: 'Añade el resto de la leche y cuece',
      finishMilkBody:
        'Vierte el resto de la leche y añade vainilla al gusto. Continúa calentando y removiendo hasta que aparezcan las primeras burbujas; retira del fuego.',
      finishMilkCheckpoint:
        'La crema está lisa y ligeramente espesa, y acaban de aparecer las primeras burbujas.',
      finishMilkTip:
        'Remueve bien el fondo y las esquinas para que la harina no se deposite ni se queme.',
      coolTitle: 'Cubre y enfría',
      coolBody:
        'Pasa la crema a un recipiente limpio, cubre la superficie directamente y deja enfriar antes de rellenar la masa.',
      coolCheckpoint:
        'La crema fría es uniforme y se puede servir con cuchara, sin una película seca en la superficie.',
      coolTip:
        'La crema espesará más al enfriarse; no la sigas hirviendo después de las primeras burbujas.',
    },
    uk: {
      section: 'Ванільний заварний крем без яєць',
      milk: 'Молоко',
      sugar: 'Цукор',
      flour: 'Борошно',
      flourNote:
        'У записаному рецепті — 6 столових ложок; вид борошна та його вагу в грамах не вказано.',
      butter: 'Вершкове масло',
      butterNote: 'М’яке, щоб його можна було розім’яти виделкою або ложкою.',
      vanilla: 'Ваніль',
      vanillaNote: 'Додайте до смаку.',
      pasteTitle: 'Зробіть пасту з масла та борошна',
      pasteBody:
        'Змішайте цукор із борошном. Додайте м’яке масло й розімніть усе виделкою або ложкою до однорідної пасти.',
      pasteCheckpoint:
        'Маса однорідна й пастоподібна, без сухих ділянок борошна.',
      pasteTip:
        'Масло має бути м’яким, але не розтопленим, щоб борошно рівномірно з ним змішалося.',
      firstMilkTitle: 'Додайте половину молока',
      firstMilkBody:
        'Поступово вмішайте приблизно половину молока. Повільно нагрівайте на слабкому вогні, безперервно помішуючи, доки суміш не стане гладкою.',
      firstMilkCheckpoint:
        'Суміш рідка й однорідна, без видимих грудочок масла або борошна.',
      firstMilkTip:
        'Спочатку додавайте молоко кількома порціями — так легше розвести пасту без грудочок.',
      finishMilkTitle: 'Додайте решту молока й заваріть',
      finishMilkBody:
        'Влийте решту молока й додайте ваніль до смаку. Продовжуйте нагрівати й помішувати до появи перших бульбашок, тоді зніміть із вогню.',
      finishMilkCheckpoint:
        'Крем гладкий і злегка загуслий, а на поверхні щойно з’явилися перші бульбашки.',
      finishMilkTip:
        'Проводьте ложкою або вінчиком по дну та кутах, щоб борошно не осідало й не пригорало.',
      coolTitle: 'Накрийте й охолодіть',
      coolBody:
        'Перекладіть крем у чисту посудину, накрийте поверхню в контакт і дайте охолонути перед наповненням випічки.',
      coolCheckpoint:
        'Охолоджений крем однорідний, набирається ложкою й не має сухої плівки зверху.',
      coolTip:
        'Під час охолодження крем іще загусне, тому не кип’ятіть його після появи перших бульбашок.',
    },
  }[locale];

  return {
    presentation: 'concise',
    completeness: 'readyToReview',
    difficulty: 'medium',
    evidence: { status: 'tested', explanation: testedExplanation[locale] },
    yield: {
      id: 'about-1-8-kg-custard',
      label: {
        en: 'About 1.8 kg cream',
        es: 'Unos 1,8 kg de crema',
        uk: 'Близько 1,8 кг крему',
      }[locale],
      count: { kind: 'exact', value: 1 },
      unit: 'batch',
    },
    timing: {
      activeMinutes: 25,
      totalElapsedMinutes: 150,
      phases: [
        {
          id: 'cool-eggless-custard',
          label: {
            en: 'Cool completely',
            es: 'Enfriar por completo',
            uk: 'Повне охолодження',
          }[locale],
          duration: { kind: 'exact', value: 2, unit: 'hour' },
          relatedStepId: 'cool',
        },
      ],
    },
    beforeStart: [
      {
        en: 'Allow about 2 hours for this large batch to cool completely before filling pastries.',
        es: 'Reserva unas 2 horas para que esta tanda grande se enfríe por completo antes de rellenar los pasteles.',
        uk: 'Закладіть близько 2 годин, щоб така велика порція повністю охолола перед наповненням тістечок.',
      }[locale],
    ],
    ingredientSections: [
      {
        id: 'custard',
        title: copy.section,
        ingredients: [
          {
            id: 'milk',
            name: copy.milk,
            quantity: egglessCustardQuantity.milk,
          },
          {
            id: 'sugar',
            name: copy.sugar,
            quantity: egglessCustardQuantity.sugar,
          },
          {
            id: 'flour',
            name: copy.flour,
            quantity: egglessCustardQuantity.flour,
            note: copy.flourNote,
          },
          {
            id: 'butter',
            name: copy.butter,
            quantity: egglessCustardQuantity.butter,
            note: copy.butterNote,
          },
          {
            id: 'vanilla',
            name: copy.vanilla,
            quantity: egglessCustardQuantity.vanilla,
            note: copy.vanillaNote,
            optional: true,
          },
        ],
      },
    ],
    steps: [
      {
        id: 'make-paste',
        technique: { id: 'soften-butter' },
        title: copy.pasteTitle,
        body: copy.pasteBody,
        tip: copy.pasteTip,
        cookIngredients: [
          { ingredientId: 'sugar' },
          { ingredientId: 'flour' },
          { ingredientId: 'butter' },
        ],
      },
      {
        id: 'add-first-milk',
        title: copy.firstMilkTitle,
        body: copy.firstMilkBody,
        cookIngredients: [{ ingredientId: 'milk' }],
      },
      {
        id: 'finish-cooking',
        title: copy.finishMilkTitle,
        body: copy.finishMilkBody,
        tip: copy.finishMilkTip,
        cookIngredients: [{ ingredientId: 'vanilla' }],
      },
      {
        id: 'cool',
        title: copy.coolTitle,
        body: copy.coolBody,
        checkpoint: copy.coolCheckpoint,
        media: [
          {
            id: 'eggless-vanilla-custard-final-v1',
            src: '/media/recipes/eggless-vanilla-custard/selected/final-custard-v1.png',
            alt: {
              en: 'Thick eggless vanilla custard with a spatula channel that closes slowly',
              es: 'Crema de vainilla sin huevo espesa con un surco de espátula que se cierra lentamente',
              uk: 'Густий ванільний крем без яєць зі слідом від лопатки, що повільно сходиться',
            }[locale],
          },
        ],
      },
    ],
  };
}

const buttercreamQuantity = {
  butter: {
    base: { kind: 'exact', value: 200, unit: 'g' },
    shopping: { mode: 'base' },
  },
  sugar: quantityFromGrams('granulated-sugar', 70),
  eggs: {
    base: { kind: 'exact', value: 2, unit: 'piece' },
    shopping: { mode: 'base', increment: 1, rounding: 'up' },
  },
  vanillaSugar: {
    base: { kind: 'exact', value: 10, unit: 'g' },
    shopping: { mode: 'base' },
  },
  milk: {
    base: { kind: 'exact', value: 100, unit: 'ml' },
    shopping: { mode: 'base' },
  },
} as const;

function buttercreamContent(locale: CreamLocale): RecipeSourceDraftContent {
  const copy = {
    en: {
      section: 'Buttercream',
      butter: 'Butter',
      butterNote: '82% fat or higher; softened but not melted.',
      sugar: 'Sugar',
      eggs: 'Eggs',
      vanillaSugar: 'Vanilla sugar',
      milk: 'Milk',
      softenTitle: 'Soften the butter',
      softenBody:
        'Bring the butter to room temperature. It should be pliable but still hold its shape.',
      softenCheckpoint:
        'A finger leaves a shallow indentation, but the butter is not shiny or melted.',
      softenTip:
        'Do not melt the butter; the cream needs its structure to whip properly.',
      baseTitle: 'Cook the egg and milk base',
      baseBody:
        'Whisk the milk, eggs, sugar and vanilla sugar in a saucepan. Heat while whisking constantly. Once it begins to bubble, reduce the heat and cook until thickened.',
      baseCheckpoint:
        'The base is smooth and thick enough to leave a brief trail behind the whisk.',
      baseTip:
        'Keep the whisk moving over the bottom and into the corners so the eggs do not set in pieces.',
      coolTitle: 'Cool the base',
      coolBody:
        'Transfer the cooked base to a clean bowl, cover the surface directly and cool it completely to room temperature.',
      coolCheckpoint:
        'The base is thick and no warmer than the softened butter.',
      coolTip:
        'The base and butter should be close in temperature before they are combined.',
      whipTitle: 'Whip the butter',
      whipBody:
        'Whip the softened butter until it becomes pale, smooth and noticeably more aerated.',
      whipCheckpoint:
        'The butter is lighter in colour and fluffy, with no dense lumps.',
      whipTip:
        'Scrape down the bowl once or twice so all the butter aerates evenly.',
      combineTitle: 'Add the cooked base gradually',
      combineBody:
        'With the mixer running, add the cooled base to the butter one spoonful at a time. Continue whipping until the cream is thick, smooth and glossy.',
      combineCheckpoint:
        'The cream is uniform and glossy and holds a clear ridge from the whisk.',
      combineTip:
        'For a coffee version, add a little coffee extract or dissolved instant coffee at this step and mix only until even.',
    },
    es: {
      section: 'Crema de mantequilla',
      butter: 'Mantequilla',
      butterNote: 'Con un 82 % de grasa o más; blanda pero no derretida.',
      sugar: 'Azúcar',
      eggs: 'Huevos',
      vanillaSugar: 'Azúcar vainillado',
      milk: 'Leche',
      softenTitle: 'Ablanda la mantequilla',
      softenBody:
        'Deja que la mantequilla alcance la temperatura ambiente. Debe estar flexible pero mantener su forma.',
      softenCheckpoint:
        'El dedo deja una marca poco profunda, pero la mantequilla no está brillante ni derretida.',
      softenTip:
        'No derritas la mantequilla; la crema necesita su estructura para montarse correctamente.',
      baseTitle: 'Cuece la base de huevo y leche',
      baseBody:
        'Bate en un cazo la leche, los huevos, el azúcar y el azúcar vainillado. Calienta sin dejar de batir. Cuando empiece a burbujear, baja el fuego y cuece hasta que espese.',
      baseCheckpoint:
        'La base está lisa y lo bastante espesa para dejar brevemente la marca de las varillas.',
      baseTip:
        'Mueve las varillas por el fondo y las esquinas para que el huevo no se cuaje en trozos.',
      coolTitle: 'Enfría la base',
      coolBody:
        'Pasa la base cocida a un bol limpio, cubre la superficie directamente y deja que se enfríe por completo hasta la temperatura ambiente.',
      coolCheckpoint:
        'La base está espesa y no está más caliente que la mantequilla blanda.',
      coolTip:
        'La base y la mantequilla deben tener temperaturas parecidas antes de mezclarlas.',
      whipTitle: 'Bate la mantequilla',
      whipBody:
        'Bate la mantequilla blanda hasta que esté más pálida, lisa y claramente aireada.',
      whipCheckpoint:
        'La mantequilla está más clara y esponjosa, sin grumos densos.',
      whipTip:
        'Raspa el bol una o dos veces para que toda la mantequilla se airee por igual.',
      combineTitle: 'Añade gradualmente la base cocida',
      combineBody:
        'Con la batidora en marcha, añade la base fría a la mantequilla una cucharada cada vez. Sigue batiendo hasta que la crema esté espesa, lisa y brillante.',
      combineCheckpoint:
        'La crema está uniforme y brillante y conserva un surco claro de las varillas.',
      combineTip:
        'Para una versión de café, añade en este paso un poco de extracto de café o café instantáneo disuelto y mezcla solo hasta integrarlo.',
    },
    uk: {
      section: 'Масляний крем',
      butter: 'Вершкове масло',
      butterNote: 'Жирністю від 82%; м’яке, але не розтоплене.',
      sugar: 'Цукор',
      eggs: 'Яйця',
      vanillaSugar: 'Ванільний цукор',
      milk: 'Молоко',
      softenTitle: 'Розм’якшіть масло',
      softenBody:
        'Доведіть масло до кімнатної температури. Воно має бути пластичним, але тримати форму.',
      softenCheckpoint:
        'Палець залишає неглибоку вм’ятину, але масло не блищить і не розтікається.',
      softenTip:
        'Не розтоплюйте масло: крему потрібна його структура, щоб правильно збитися.',
      baseTitle: 'Заваріть яєчно-молочну основу',
      baseBody:
        'Змішайте в сотейнику молоко, яйця, звичайний і ванільний цукор. Нагрівайте, постійно працюючи вінчиком. Коли маса почне булькати, зменште вогонь і варіть до загустіння.',
      baseCheckpoint:
        'Основа гладка й достатньо густа, щоб слід від вінчика ненадовго залишався видимим.',
      baseTip:
        'Проводьте вінчиком по дну та кутах, щоб яйця не схопилися окремими шматочками.',
      coolTitle: 'Охолодіть основу',
      coolBody:
        'Перекладіть заварену основу в чисту миску, накрийте поверхню в контакт і повністю охолодіть до кімнатної температури.',
      coolCheckpoint: 'Основа густа й не тепліша за розм’якшене масло.',
      coolTip:
        'Перед поєднанням основа й масло мають бути приблизно однакової температури.',
      whipTitle: 'Збийте масло',
      whipBody:
        'Збивайте м’яке масло, доки воно не посвітлішає, не стане гладким і помітно пишнішим.',
      whipCheckpoint: 'Масло світліше й пишне, без щільних грудочок.',
      whipTip:
        'Один-два рази зберіть масло зі стінок миски, щоб воно збивалося рівномірно.',
      combineTitle: 'Поступово додайте заварену основу',
      combineBody:
        'Не припиняючи збивати, додавайте охолоджену основу до масла по одній ложці. Збивайте, доки крем не стане густим, гладким і блискучим.',
      combineCheckpoint:
        'Крем однорідний і блискучий та тримає чіткий слід від вінчика.',
      combineTip:
        'Для кавового варіанта на цьому кроці додайте трохи кавового екстракту або заздалегідь розчиненої розчинної кави й перемішайте лише до однорідності.',
    },
  }[locale];

  return {
    presentation: 'concise',
    completeness: 'readyToReview',
    difficulty: 'medium',
    evidence: { status: 'tested', explanation: testedExplanation[locale] },
    yield: {
      id: 'about-450-g-buttercream',
      label: {
        en: 'About 450 g cream',
        es: 'Unos 450 g de crema',
        uk: 'Близько 450 г крему',
      }[locale],
      count: { kind: 'exact', value: 1 },
      unit: 'batch',
    },
    timing: {
      activeMinutes: 25,
      totalElapsedMinutes: 75,
      phases: [
        {
          id: 'cool-buttercream-base',
          label: {
            en: 'Cool the cooked base',
            es: 'Enfriar la base cocida',
            uk: 'Охолодження завареної основи',
          }[locale],
          duration: { kind: 'exact', value: 45, unit: 'minute' },
          relatedStepId: 'cool-base',
        },
      ],
    },
    beforeStart: [
      {
        en: 'Let the butter soften while the cooked base cools; combine them only when they are at a similar room temperature.',
        es: 'Deja que la mantequilla se ablande mientras se enfría la base; mézclalas solo cuando estén a una temperatura ambiente parecida.',
        uk: 'Розм’якшуйте масло, поки охолоджується заварена основа; поєднуйте їх лише за приблизно однакової кімнатної температури.',
      }[locale],
    ],
    ingredientSections: [
      {
        id: 'buttercream',
        title: copy.section,
        ingredients: [
          {
            id: 'butter',
            name: copy.butter,
            quantity: buttercreamQuantity.butter,
            note: copy.butterNote,
          },
          {
            id: 'sugar',
            name: copy.sugar,
            quantity: buttercreamQuantity.sugar,
          },
          {
            id: 'eggs',
            name: copy.eggs,
            quantity: buttercreamQuantity.eggs,
          },
          {
            id: 'vanilla-sugar',
            name: copy.vanillaSugar,
            quantity: buttercreamQuantity.vanillaSugar,
          },
          {
            id: 'milk',
            name: copy.milk,
            quantity: buttercreamQuantity.milk,
          },
        ],
      },
    ],
    steps: [
      {
        id: 'cook-base',
        title: copy.baseTitle,
        body: copy.baseBody,
        checkpoint: copy.baseCheckpoint,
        tip: copy.baseTip,
        cookIngredients: [
          { ingredientId: 'milk' },
          { ingredientId: 'eggs' },
          { ingredientId: 'sugar' },
          { ingredientId: 'vanilla-sugar' },
        ],
      },
      {
        id: 'cool-base',
        title: copy.coolTitle,
        body: copy.coolBody,
        checkpoint: copy.coolCheckpoint,
      },
      {
        id: 'whip-butter',
        technique: { id: 'soften-butter' },
        title: copy.whipTitle,
        body: copy.whipBody,
        tip: copy.whipTip,
        cookIngredients: [{ ingredientId: 'butter' }],
      },
      {
        id: 'combine',
        title: copy.combineTitle,
        body: copy.combineBody,
        checkpoint: copy.combineCheckpoint,
        media: [
          {
            id: 'vanilla-buttercream-final-v1',
            src: '/media/recipes/vanilla-buttercream/selected/final-buttercream-v1.png',
            alt: {
              en: 'Pale vanilla buttercream holding a firm smooth peak on raised beaters',
              es: 'Crema de mantequilla de vainilla pálida que mantiene un pico firme y liso en las varillas',
              uk: 'Світлий ванільний масляний крем тримає гладкий стійкий пік на вінчиках',
            }[locale],
          },
        ],
      },
    ],
  };
}

export const mascarponeWhippedCreamRecipe = {
  id: 'mascarpone-whipped-cream',
  publicationStatus: 'published',
  source: {
    file: 'docs/reference/recipe-inventory.xlsx',
    locator: 'Recipe Archive · Бісквітний рулет з фруктами · крем',
  },
  ...mascarponeCreamContent('en'),
  translations: {
    es: mascarponeCreamContent('es'),
    uk: mascarponeCreamContent('uk'),
  },
} satisfies RecipeSourceDraft;

export const vanillaEggCustardRecipe = {
  id: 'vanilla-egg-custard',
  publicationStatus: 'published',
  source: {
    file: 'User-confirmed cream set, 2026-09-20',
    locator: 'Vanilla custard with egg yolks',
  },
  ...eggCustardContent('en'),
  translations: {
    es: eggCustardContent('es'),
    uk: eggCustardContent('uk'),
  },
} satisfies RecipeSourceDraft;

export const egglessVanillaCustardRecipe = {
  id: 'eggless-vanilla-custard',
  publicationStatus: 'published',
  source: {
    file: 'User-provided recipe, 2026-09-20',
    locator: '1.5 l milk · 6 tbsp sugar · 6 tbsp flour · 200 g butter',
  },
  ...egglessCustardContent('en'),
  translations: {
    es: egglessCustardContent('es'),
    uk: egglessCustardContent('uk'),
  },
} satisfies RecipeSourceDraft;

export const vanillaButtercreamRecipe = {
  id: 'vanilla-buttercream',
  publicationStatus: 'published',
  source: {
    file: 'User-confirmed cream set, 2026-09-20',
    locator: 'Vanilla buttercream based on the Charlotte method',
  },
  ...buttercreamContent('en'),
  translations: {
    es: buttercreamContent('es'),
    uk: buttercreamContent('uk'),
  },
} satisfies RecipeSourceDraft;

export const reusableCreamRecipes = [
  mascarponeWhippedCreamRecipe,
  vanillaEggCustardRecipe,
  egglessVanillaCustardRecipe,
  vanillaButtercreamRecipe,
] as const;
