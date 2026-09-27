import type {
  RecipeSourceDraft,
  RecipeSourceDraftContent,
  StructuredIngredientSection,
  StructuredRecipeStep,
} from './source-recipe.types.ts';
import { quantityFromGrams } from './spoon-weights.ts';

type Locale = 'en' | 'es' | 'uk';

const text = (locale: Locale, en: string, es: string, uk: string) =>
  locale === 'uk' ? uk : locale === 'es' ? es : en;

const quantities = {
  plums: {
    base: { kind: 'exact' as const, value: 400, unit: 'g' as const },
    shopping: { mode: 'base' as const },
  },
  eggs: {
    base: { kind: 'exact' as const, value: 5, unit: 'piece' as const },
    shopping: { mode: 'base' as const, increment: 1, rounding: 'up' as const },
  },
  sugar: quantityFromGrams('granulated-sugar', 100),
  flour: quantityFromGrams('schar-mix-b', 120),
  tapioca: quantityFromGrams('tapioca-starch', 15),
  // Author-weighed spoon for this bake; do not change the shared conversion.
  xanthan: {
    base: { kind: 'exact' as const, value: 5, unit: 'g' as const },
    equivalent: { kind: 'exact' as const, value: 1, unit: 'tsp' as const },
    shopping: { mode: 'base' as const },
  },
  butter: {
    base: { kind: 'exact' as const, value: 50, unit: 'g' as const },
    shopping: { mode: 'base' as const },
  },
  pinch: {
    base: null,
    equivalent: { kind: 'exact' as const, value: 1, unit: 'pinch' as const },
    shopping: { mode: 'nameOnly' as const },
  },
  nameOnly: { base: null, shopping: { mode: 'nameOnly' as const } },
};

function ingredientSections(locale: Locale): StructuredIngredientSection[] {
  return [
    {
      id: 'cake',
      title: text(
        locale,
        'Plum upside-down cake',
        'Bizcocho invertido de ciruelas',
        'Перевернутий сливовий пиріг',
      ),
      ingredients: [
        {
          id: 'plums',
          name: text(
            locale,
            'Ripe but firm plums',
            'Ciruelas maduras pero firmes',
            'Стиглі, але щільні сливи',
          ),
          quantity: quantities.plums,
        },
        {
          id: 'eggs',
          name: text(locale, 'Small eggs', 'Huevos pequeños', 'Невеликі яйця'),
          quantity: quantities.eggs,
        },
        {
          id: 'sugar',
          name: text(locale, 'Sugar', 'Azúcar', 'Цукор'),
          quantity: quantities.sugar,
        },
        {
          id: 'flour',
          name: text(
            locale,
            'Schär Mix B Bread flour',
            'Harina Schär Mix B Bread',
            'Борошно Schär Mix B Bread',
          ),
          quantity: quantities.flour,
        },
        {
          id: 'tapioca',
          name: text(
            locale,
            'Tapioca starch',
            'Almidón de tapioca',
            'Тапіоковий крохмаль',
          ),
          quantity: quantities.tapioca,
        },
        {
          id: 'xanthan',
          name: text(
            locale,
            'Xanthan gum',
            'Goma xantana',
            'Ксантанова камедь',
          ),
          quantity: quantities.xanthan,
          optional: true,
        },
        {
          id: 'butter',
          name: text(
            locale,
            'Unsalted butter',
            'Mantequilla sin sal',
            'Вершкове масло',
          ),
          quantity: quantities.butter,
        },
        {
          id: 'butter-for-pan',
          name: text(
            locale,
            'Butter for greasing the parchment',
            'Mantequilla para engrasar el papel',
            'Масло для змащування пергаменту',
          ),
          quantity: quantities.nameOnly,
          scaling: 'fixed',
        },
        {
          id: 'salt',
          name: text(locale, 'Salt', 'Sal', 'Сіль'),
          quantity: quantities.pinch,
          scaling: 'fixed',
        },
        {
          id: 'vanilla',
          name: text(locale, 'Vanillin', 'Vainillina', 'Ванілін'),
          quantity: quantities.nameOnly,
        },
      ],
    },
  ];
}

function steps(locale: Locale): StructuredRecipeStep[] {
  const media = (id: string, en: string, es: string, uk: string) => [
    {
      id: id.replace(/\.webp$/, ''),
      src: `/media/recipes/plum-cake/selected/${id}`,
      alt: text(locale, en, es, uk),
    },
  ];
  return [
    {
      id: 'prepare-plums',
      title: text(
        locale,
        'Prepare the pan and plums',
        'Prepara el molde y las ciruelas',
        'Підготуйте форму та сливи',
      ),
      body: text(
        locale,
        'Preheat the oven to 200°C. Line the pan with parchment and lightly butter the paper. Stone the plums, cut into wedges and pat away excess juice. Arrange in one layer with a cut surface against the paper.',
        'Precalienta el horno a 200°C. Forra el molde con papel de horno y engrásalo ligeramente con mantequilla. Deshuesa las ciruelas, córtalas en gajos y seca el exceso de jugo. Colócalas en una sola capa, con una cara cortada sobre el papel.',
        'Розігрійте духовку до 200°C. Застеліть форму пергаментом і злегка змастіть папір маслом. Вийміть зі слив кісточки, наріжте м’якоть скибочками та промокніть зайвий сік. Викладіть одним шаром, однією зі зрізаних сторін до пергаменту.',
      ),
      cookIngredients: [
        { ingredientId: 'plums' },
        { ingredientId: 'butter-for-pan' },
      ],
      media: media(
        'plum-wedges-author-v1.webp',
        'Plum wedges on buttered parchment',
        'Gajos de ciruela sobre papel engrasado',
        'Скибочки слив на змащеному пергаменті',
      ),
    },
    {
      id: 'whip-eggs',
      quantityMentions: [{
        text: text(locale, '2 tablespoons', '2 cucharadas', '2 столовими ложками'),
        quantity: { kind: 'exact', value: 2, unit: 'tbsp' },
      }],
      title: text(
        locale,
        'Whip the whites and yolks separately',
        'Bate las claras y las yemas por separado',
        'Окремо збийте білки та жовтки',
      ),
      body: text(
        locale,
        'Separate the eggs. Beat the yolks with 2 tablespoons of the sugar until pale. In a clean, dry bowl, whip the whites, gradually adding the remaining sugar. Gently fold the yolks into the whites.',
        'Separa los huevos. Bate las yemas con 2 cucharadas del azúcar hasta que aclaren. En un bol limpio y seco, monta las claras añadiendo poco a poco el azúcar restante. Incorpora las yemas a las claras con movimientos envolventes.',
        'Відокремте білки від жовтків. Жовтки збийте з 2 столовими ложками цукру до посвітління. У чистій сухій мисці збийте білки, поступово додаючи решту цукру. Обережно вмішайте жовтки у збиті білки.',
      ),
      checkpoint: text(
        locale,
        'The whites hold their shape; the combined mixture remains airy.',
        'Las claras mantienen la forma y la mezcla conserva el aire al unirla.',
        'Білки тримають форму, після з’єднання маса залишається повітряною.',
      ),
      cookIngredients: [{ ingredientId: 'eggs' }, { ingredientId: 'sugar' }],
      media: media(
        'whipped-whites-author-v1.webp',
        'Whipped egg whites',
        'Claras montadas',
        'Збиті білки',
      ),
    },
    {
      id: 'fold-flour',
      title: text(
        locale,
        'Fold in the dry ingredients',
        'Incorpora los ingredientes secos',
        'Вмішайте сухі інгредієнти',
      ),
      body: text(
        locale,
        'Fold the dry mixture into the egg mixture in several additions, lifting the batter from the bottom with a spatula.',
        'Incorpora la mezcla seca a la de huevo en varias tandas con una espátula y movimientos envolventes.',
        'У кілька прийомів додайте суху суміш до яєчної маси, обережно перемішуючи лопаткою знизу вгору.',
      ),
      checkpoint: text(
        locale,
        'No dry pockets remain; the batter is still airy.',
        'No quedan bolsas de harina y la masa conserva el aire.',
        'Сухого борошна не видно, тісто залишається повітряним.',
      ),
      tip: text(
        locale,
        'First, thoroughly mix the flour, tapioca starch, salt and vanillin, adding xanthan gum if using.',
        'Primero mezcla bien la harina, el almidón de tapioca, la sal y la vainillina; añade la goma xantana si la usas.',
        'Спочатку ретельно змішайте борошно, тапіоковий крохмаль, сіль і ванілін; за бажанням додайте ксантанову камедь.',
      ),
      cookIngredients: [
        { ingredientId: 'flour' },
        { ingredientId: 'tapioca' },
        { ingredientId: 'xanthan' },
        { ingredientId: 'salt' },
        { ingredientId: 'vanilla' },
      ],
      media: media(
        'fold-flour-author-v1.webp',
        'Dry ingredients being added to the egg mixture',
        'Ingredientes secos incorporándose a la mezcla de huevo',
        'Додавання сухих інгредієнтів до яєчної маси',
      ),
    },
    {
      id: 'fold-butter',
      quantityMentions: [{
        text: text(locale, '50 g', '50 g', '50 г'),
        quantity: quantities.butter.base,
      }],
      title: text(
        locale,
        'Fold in the butter',
        'Incorpora la mantequilla',
        'Додайте масло',
      ),
      body: text(
        locale,
        'Melt 50 g butter and let it cool until just warm. Mix 3–4 spoonfuls of batter into the butter until smooth. Return this mixture to the main bowl and gently fold together.',
        'Derrite 50 g de mantequilla y deja templar. Mézclala con 3–4 cucharadas de masa hasta que quede homogénea. Devuelve la mezcla al bol principal e incorpora con movimientos envolventes.',
        'Розтопіть 50 г масла й дайте охолонути до ледь теплого. Додайте до масла 3–4 ложки тіста та перемішайте до однорідності. Поверніть суміш у миску з рештою тіста й обережно вмішайте лопаткою.',
      ),
      checkpoint: text(
        locale,
        'The butter is fully incorporated, with no oily streaks.',
        'La mantequilla está integrada, sin vetas de grasa.',
        'Масло повністю з’єдналося з тістом, жирних смуг немає.',
      ),
      tip: text(
        locale,
        'Melt the butter before whipping the eggs so it has time to cool.',
        'Derrite la mantequilla antes de batir los huevos para que tenga tiempo de templarse.',
        'Розтопіть масло ще до збивання яєць — воно встигне охолонути.',
      ),
      cookIngredients: [{ ingredientId: 'butter' }],
      media: media(
        'butter-batter-author-v1.webp',
        'A small portion of batter mixed with melted butter',
        'Una porción de masa con mantequilla derretida',
        'Невелика порція тіста з розтопленим маслом',
      ),
    },
    {
      id: 'fill-pan',
      title: text(
        locale,
        'Cover the plums with batter',
        'Cubre las ciruelas con la masa',
        'Викладіть тісто на сливи',
      ),
      body: text(
        locale,
        'Spoon the batter over the plums in several places, then gently level it without moving the fruit. Put the pan straight into the preheated oven.',
        'Reparte la masa sobre las ciruelas en varios puntos y alisa con cuidado sin desplazar la fruta. Introduce el molde enseguida en el horno precalentado.',
        'Викладіть тісто на сливи в кількох місцях і делікатно розрівняйте, не зсуваючи скибочок. Одразу поставте форму в розігріту духовку.',
      ),
      media: media(
        'filled-pan-author-v1.webp',
        'Batter spread over the plums in the lined pan',
        'Masa extendida sobre las ciruelas en el molde forrado',
        'Тісто рівномірно вкриває сливи у формі',
      ),
    },
    {
      id: 'bake',
      title: text(
        locale,
        'Bake the cake',
        'Hornea el bizcocho',
        'Спечіть пиріг',
      ),
      body: text(
        locale,
        'Bake at 200°C for about 30 minutes. To check, insert a skewer into the sponge, avoiding the fruit.',
        'Hornea a 200°C durante unos 30 minutos. Para comprobarlo, introduce una brocheta en el bizcocho, evitando la fruta.',
        'Випікайте при 200°C приблизно 30 хвилин. Для перевірки готовності вставте шпажку в бісквіт, не потрапляючи у сливи.',
      ),
      meta: text(locale, '200°C · 30 min', '200°C · 30 min', '200°C · 30 хв'),
      checkpoint: text(
        locale,
        'The top is golden, the centre springs back gently and the skewer has no raw batter.',
        'La superficie está dorada, el centro recupera la forma al tocarlo y la brocheta sale sin masa cruda.',
        'Поверхня золотиста, середина пружинить після легкого натискання, на шпажці немає сирого тіста.',
      ),
      tip: text(
        locale,
        'If the top browns before the centre is baked, cover loosely with foil and continue until done.',
        'Si la superficie se dora antes de que el centro esté hecho, cubre sin apretar con aluminio y sigue horneando.',
        'Якщо верх уже підрум’янився, а середина ще сира, нещільно накрийте фольгою та допечіть.',
      ),
      media: media(
        'baked-sponge-author-v1.webp',
        'Golden cake in its pan before inverting',
        'Bizcocho dorado en el molde antes de darle la vuelta',
        'Золотистий пиріг у формі перед перевертанням',
      ),
    },
    {
      id: 'invert',
      title: text(
        locale,
        'Invert and cool',
        'Dale la vuelta y deja enfriar',
        'Переверніть і дайте охолонути',
      ),
      body: text(
        locale,
        'Remove the cake from the oven and loosen the edges. Wearing oven mitts, cover the pan with a larger flat platter and turn both over together. Lift off the pan and carefully peel away the parchment. Let the cake cool before slicing.',
        'Saca el bizcocho del horno y despega los bordes. Con manoplas, cubre el molde con una fuente plana más grande y gira ambos juntos. Retira el molde y despega el papel con cuidado. Deja enfriar antes de cortar.',
        'Дістаньте пиріг із духовки та відділіть краї від форми. Надягніть рукавиці, накрийте форму більшою пласкою таріллю й переверніть їх разом. Зніміть форму та обережно відокремте пергамент. Перед нарізанням дайте пирогу охолонути.',
      ),
      media: media(
        'inverted-cake-author-v1.webp',
        'Finished upside-down plum cake',
        'Bizcocho invertido de ciruelas',
        'Готовий перевернутий сливовий пиріг',
      ),
    },
  ];
}
function contentForLocale(locale: Locale): RecipeSourceDraftContent {
  return {
    completeness: 'readyToReview',
    presentation: 'concise',
    showImageNote: false,
    difficulty: 'medium',
    evidence: {
      status: 'tested',
      explanation: '',
    },
    yield: {
      id: 'one-plum-cake',
      label: text(locale, '1 cake', '1 bizcocho', '1 пиріг'),
      count: { kind: 'exact', value: 1 },
      unit: 'cake',
    },
    timing: {
      activeMinutes: 30,
      totalElapsedMinutes: 60,
      phases: [
        {
          id: 'baking',
          label: text(locale, 'Baking', 'Horneado', 'Випікання'),
          duration: { kind: 'exact', value: 30, unit: 'minute' },
          relatedStepId: 'bake',
        },
      ],
    },
    ingredientSections: ingredientSections(locale),
    steps: steps(locale),
  };
}

export const plumCakeRecipe = {
  id: 'plum-cake',
  publicationStatus: 'published',
  translationState: { uk: 'reviewed', en: 'reviewed', es: 'reviewed' },
  source: {
    file: 'media/recipes/plum-cake/REVISION-2026-09-25.md',
    locator:
      'Author butter-cake revision 2026-09-25; final sugar allocation and editorial revision confirmed 2026-09-26',
  },
  ...contentForLocale('en'),
  translations: { uk: contentForLocale('uk'), es: contentForLocale('es') },
} satisfies RecipeSourceDraft;
