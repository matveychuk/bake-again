import type { RecipeSourceDraft } from './source-recipe.types.ts';

export const crepesRecipe = {
  id: 'crepes',
  source: { file: 'docs/reference/recipe-inventory.xlsx', locator: 'Recipe Archive · Млинці' },
  completeness: 'readyToReview',
  beforeStart: [
    'Makes 15–17 crepes in a 24 cm pan.',
    'A good breakfast quantity for 3 people.',
  ],
  ingredientSections: [{
    id: 'batter', title: 'Crepe batter', ingredients: [
      { id: 'eggs', name: 'Eggs', quantity: { base: { kind: 'exact', value: 5, unit: 'piece' }, equivalent: { kind: 'exact', value: 280, unit: 'g' }, shopping: { mode: 'base', increment: 1, rounding: 'up' } } },
      { id: 'flour', name: 'Schär Mix B Bread flour', quantity: { base: { kind: 'exact', value: 140, unit: 'g' }, equivalent: { kind: 'exact', value: 6, unit: 'tbsp' }, shopping: { mode: 'base' } } },
      { id: 'milk', name: 'Milk', quantity: { base: { kind: 'exact', value: 500, unit: 'ml' }, shopping: { mode: 'base' } } },
      { id: 'sugar', name: 'Sugar', quantity: { base: { kind: 'exact', value: 20, unit: 'g' }, equivalent: { kind: 'exact', value: 1, unit: 'tbsp' }, shopping: { mode: 'base' } } },
      { id: 'salt', name: 'Salt', quantity: { base: null, equivalent: { kind: 'exact', value: 1, unit: 'pinch' }, shopping: { mode: 'nameOnly' } } },
      { id: 'water', name: 'Hot water', quantity: { base: { kind: 'exact', value: 50, unit: 'ml' }, shopping: { mode: 'base' } } },
      { id: 'oil', name: 'Neutral oil', quantity: { base: { kind: 'exact', value: 5, unit: 'tbsp' }, equivalent: { kind: 'exact', value: 25, unit: 'g' }, shopping: { mode: 'base' } }, note: 'The source records both 5 tbsp and 25 g; this inconsistent-looking pair is retained without conversion. Sunflower oil works well.' },
      { id: 'pan-oil', name: 'Oil for the pan', quantity: { base: null, shopping: { mode: 'nameOnly' } }, note: 'For a very thin coating before the first crepe only.' },
    ],
  }],
  steps: [
    {
      id: 'start-batter',
      title: 'Blend a thick base',
      body: 'Crack the eggs into a bowl. Add the flour, sugar and salt. Pour in a little milk—only enough for the blender or mixer to work—and blend to a smooth, thick base with no lumps.',
      tip: 'Do not add all the milk at once. Lumps of gluten-free flour break up more easily while the base is still thick.',
      media: [
        {
          id: 'ingredients-before-blending',
          src: '/media/recipes/crepes/selected/step-01-ingredients-before-blending-c2-v1.png',
          alt: 'Eggs, gluten-free flour, sugar and salt in a white bowl with an immersion blender',
          title: 'Add the dry ingredients',
          caption: 'Combine the eggs with the flour, sugar and salt.',
        },
        {
          id: 'batter-partly-blended',
          src: '/media/recipes/crepes/selected/step-01-batter-partly-blended-c2-v1.png',
          alt: 'A thick, partly blended crepe base with a small pocket of dry flour',
          title: 'Blend the thick base',
          caption: 'Add only a little milk so the mixture stays thick.',
        },
        {
          id: 'batter-smooth-base',
          src: '/media/recipes/crepes/selected/step-01-batter-smooth-base-c2-v1.png',
          alt: 'Smooth thick yellow crepe base coating a metal spoon',
          title: 'Check for lumps',
          caption: 'The base should be smooth before you add the remaining milk.',
        },
      ],
    },
    { id: 'add-milk', title: 'Add the milk', body: 'Gradually add the remaining milk while mixing.' },
    { id: 'rest', title: 'Rest the batter', body: 'Let the batter rest for at least 15 minutes; 30 minutes is better.', meta: 'At least 15 min · preferably 30 min' },
    { id: 'finish-batter', title: 'Finish the batter', body: 'Pour in 50 ml of hot water and mix well. Add the neutral oil and mix again.', tip: 'The finished batter should spread easily across the pan.' },
    {
      id: 'cook',
      title: 'Cook the crepes',
      body: 'Before the first crepe, coat the pan with a very thin layer of oil. Pour in the batter and tilt the pan so it spreads easily. To turn, first loosen the edges, then flip the crepe with a spatula.',
      media: [
        {
          id: 'crepe-batter-setting',
          src: '/media/recipes/crepes/selected/step-05-crepe-batter-setting-s2b-v1.png',
          alt: 'Pale crepe batter setting in a black pan on a black induction hob, with tiny bubbles across the surface',
          title: 'Wait for the surface to set',
          caption: 'The surface turns matte and develops small holes as the crepe sets.',
        },
        {
          id: 'crepe-edge-lift',
          src: '/media/recipes/crepes/selected/step-05-crepe-edge-lift-s2b-v1.png',
          alt: 'A hand using a black-and-red spatula to lift the edge of a crepe in a black pan',
          title: 'Loosen the edges',
          caption: 'Free the edge first, then slide the spatula farther under the crepe.',
        },
        {
          id: 'crepe-golden-side',
          src: '/media/recipes/crepes/selected/step-05-crepe-golden-side-s2b-v1.png',
          alt: 'An evenly golden crepe cooking in a black pan on a black induction hob',
          title: 'Flip and finish cooking',
          caption: 'The cooked side should be evenly golden.',
        },
      ],
    },
  ],
  translations: {
    uk: {
      completeness: 'readyToReview',
      beforeStart: [
        'Вихід — 15–17 млинців на пательні діаметром 24 см.',
        'Цієї кількості достатньо для сніданку на 3 особи.',
      ],
      ingredientSections: [{
        id: 'batter', title: 'Тісто для млинців', ingredients: [
          { id: 'eggs', name: 'Яйця', quantity: { base: { kind: 'exact', value: 5, unit: 'piece' }, equivalent: null, shopping: { mode: 'base', increment: 1, rounding: 'up' } } },
          { id: 'flour', name: 'Борошно Schär Mix B Bread', quantity: { base: null, equivalent: null, shopping: { mode: 'nameOnly' } } },
          { id: 'milk', name: 'Молоко', quantity: { base: null, shopping: { mode: 'nameOnly' } } },
          { id: 'sugar', name: 'Цукор', quantity: { base: null, equivalent: null, shopping: { mode: 'nameOnly' } } },
          { id: 'salt', name: 'Сіль', quantity: { base: null, equivalent: { kind: 'exact', value: 1, unit: 'pinch' }, shopping: { mode: 'nameOnly' } } },
          { id: 'water', name: 'Гаряча вода', quantity: { base: null, shopping: { mode: 'nameOnly' } } },
          { id: 'oil', name: 'Олія без запаху', quantity: { base: null, equivalent: null, shopping: { mode: 'nameOnly' } }, note: 'Підійде соняшникова.' },
          { id: 'pan-oil', name: 'Олія для пательні', quantity: { base: null, shopping: { mode: 'nameOnly' } }, note: 'Лише дуже тонкий шар перед першим млинцем.' },
        ],
      }],
      steps: [
        {
          id: 'start-batter',
          title: 'Збийте густу основу',
          body: 'Розбийте яйця в миску. Додайте борошно, цукор і сіль. Влийте трохи молока — лише стільки, щоб блендер або міксер міг працювати. Збийте до гладкої густої основи без грудочок.',
          tip: 'Не додавайте все молоко одразу. У густій основі грудочки безглютенового борошна розбиваються легше.',
          media: [
            {
              id: 'ingredients-before-blending',
              src: '/media/recipes/crepes/selected/step-01-ingredients-before-blending-c2-v1.png',
              alt: 'Яйця, безглютенове борошно, цукор і сіль у білій мисці з занурювальним блендером',
              title: 'Додайте сухі інгредієнти',
              caption: 'З’єднайте яйця з борошном, цукром і сіллю.',
            },
            {
              id: 'batter-partly-blended',
              src: '/media/recipes/crepes/selected/step-01-batter-partly-blended-c2-v1.png',
              alt: 'Густа частково збита основа для млинців із невеликою ділянкою сухого борошна',
              title: 'Збийте густу основу',
              caption: 'Додайте лише трохи молока, щоб суміш залишалася густою.',
            },
            {
              id: 'batter-smooth-base',
              src: '/media/recipes/crepes/selected/step-01-batter-smooth-base-c2-v1.png',
              alt: 'Гладка густа жовта основа для млинців на металевій ложці',
              title: 'Перевірте, чи немає грудочок',
              caption: 'Основа має бути гладкою до додавання решти молока.',
            },
          ],
        },
        { id: 'add-milk', title: 'Додайте молоко', body: 'Поступово влийте решту молока, продовжуючи перемішувати.' },
        { id: 'rest', title: 'Дайте тісту відпочити', body: 'Залиште тісто щонайменше на 15 хвилин, а краще — на 30.', meta: 'Щонайменше 15 хв · краще 30 хв' },
        { id: 'finish-batter', title: 'Завершіть тісто', body: 'Влийте 50 мл гарячої води й добре перемішайте. Додайте олію без запаху та перемішайте ще раз.', tip: 'Готове тісто має легко розтікатися по пательні.' },
        {
          id: 'cook',
          title: 'Посмажте млинці',
          body: 'Перед першим млинцем змастіть пательню дуже тонким шаром олії. Налийте тісто й нахиляйте пательню, щоб воно легко розтеклося. Щоб перевернути млинець, спочатку піддіть його краї, а потім переверніть лопаткою.',
          media: [
            {
              id: 'crepe-batter-setting',
              src: '/media/recipes/crepes/selected/step-05-crepe-batter-setting-s2b-v1.png',
              alt: 'Світле тісто для млинця схоплюється на чорній пательні на чорній індукційній плиті, по поверхні з’являються дрібні бульбашки',
              title: 'Дочекайтеся, поки поверхня схопиться',
              caption: 'Поверхня стане матовішою, а на ній з’являться дрібні отвори.',
            },
            {
              id: 'crepe-edge-lift',
              src: '/media/recipes/crepes/selected/step-05-crepe-edge-lift-s2b-v1.png',
              alt: 'Рука піддіває край млинця чорно-червоною лопаткою на чорній пательні',
              title: 'Піддіть краї',
              caption: 'Спочатку відокремте край, потім підведіть лопатку далі під млинець.',
            },
            {
              id: 'crepe-golden-side',
              src: '/media/recipes/crepes/selected/step-05-crepe-golden-side-s2b-v1.png',
              alt: 'Рівномірно золотистий млинець смажиться на чорній пательні на чорній індукційній плиті',
              title: 'Переверніть і досмажте',
              caption: 'Готова сторона має бути рівномірно золотистою.',
            },
          ],
        },
      ],
    },
    es: {
      completeness: 'readyToReview',
      beforeStart: [
        'Salen 15–17 crepes en una sartén de 24 cm.',
        'Es una cantidad ideal para el desayuno de 3 personas.',
      ],
      ingredientSections: [{
        id: 'batter', title: 'Masa para crepes', ingredients: [
          { id: 'eggs', name: 'Huevos', quantity: { base: { kind: 'exact', value: 5, unit: 'piece' }, equivalent: { kind: 'exact', value: 280, unit: 'g' }, shopping: { mode: 'base', increment: 1, rounding: 'up' } } },
          { id: 'flour', name: 'Harina Schär Mix B Bread', quantity: { base: null, equivalent: { kind: 'exact', value: 140, unit: 'g' }, shopping: { mode: 'nameOnly' } } },
          { id: 'milk', name: 'Leche', quantity: { base: { kind: 'exact', value: 500, unit: 'ml' }, shopping: { mode: 'base' } } },
          { id: 'sugar', name: 'Azúcar', quantity: { base: null, equivalent: { kind: 'exact', value: 20, unit: 'g' }, shopping: { mode: 'nameOnly' } } },
          { id: 'salt', name: 'Sal', quantity: { base: null, equivalent: { kind: 'exact', value: 1, unit: 'pinch' }, shopping: { mode: 'nameOnly' } } },
          { id: 'water', name: 'Agua caliente', quantity: { base: { kind: 'exact', value: 50, unit: 'ml' }, shopping: { mode: 'base' } } },
          { id: 'oil', name: 'Aceite de sabor neutro', quantity: { base: null, equivalent: { kind: 'exact', value: 25, unit: 'g' }, shopping: { mode: 'nameOnly' } }, note: 'El aceite de girasol va bien.' },
          { id: 'pan-oil', name: 'Aceite para la sartén', quantity: { base: null, shopping: { mode: 'nameOnly' } }, note: 'Solo una capa muy fina antes del primer crepe.' },
        ],
      }],
      steps: [
        {
          id: 'start-batter',
          title: 'Bate una base espesa',
          body: 'Casca los huevos en un bol. Añade la harina, el azúcar y la sal. Vierte un poco de leche, solo la necesaria para que funcione la batidora, y bate hasta obtener una base espesa, lisa y sin grumos.',
          tip: 'No añadas toda la leche de una vez. Los grumos de harina sin gluten se deshacen mejor mientras la base todavía está espesa.',
          media: [
            {
              id: 'ingredients-before-blending',
              src: '/media/recipes/crepes/selected/step-01-ingredients-before-blending-c2-v1.png',
              alt: 'Huevos, harina sin gluten, azúcar y sal en un bol blanco con una batidora de mano',
              title: 'Añade los ingredientes secos',
              caption: 'Combina los huevos con la harina, el azúcar y la sal.',
            },
            {
              id: 'batter-partly-blended',
              src: '/media/recipes/crepes/selected/step-01-batter-partly-blended-c2-v1.png',
              alt: 'Base espesa para crepes parcialmente batida con una pequeña zona de harina seca',
              title: 'Bate la base espesa',
              caption: 'Añade solo un poco de leche para mantener la mezcla espesa.',
            },
            {
              id: 'batter-smooth-base',
              src: '/media/recipes/crepes/selected/step-01-batter-smooth-base-c2-v1.png',
              alt: 'Base amarilla, espesa y lisa para crepes cubriendo una cuchara metálica',
              title: 'Comprueba que no haya grumos',
              caption: 'La base debe estar lisa antes de añadir el resto de la leche.',
            },
          ],
        },
        { id: 'add-milk', title: 'Añade la leche', body: 'Incorpora poco a poco el resto de la leche mientras sigues mezclando.' },
        { id: 'rest', title: 'Deja reposar la masa', body: 'Deja reposar la masa durante al menos 15 minutos; es mejor dejarla 30.', meta: 'Mínimo 15 min · mejor 30 min' },
        { id: 'finish-batter', title: 'Termina la masa', body: 'Vierte 50 ml de agua caliente y mezcla bien. Añade el aceite de sabor neutro y vuelve a mezclar.', tip: 'La masa terminada debe extenderse fácilmente por la sartén.' },
        {
          id: 'cook',
          title: 'Cocina los crepes',
          body: 'Antes del primer crepe, unta la sartén con una capa muy fina de aceite. Vierte la masa e inclina la sartén para que se extienda con facilidad. Para darle la vuelta, despega primero los bordes y después gíralo con una espátula.',
          media: [
            {
              id: 'crepe-batter-setting',
              src: '/media/recipes/crepes/selected/step-05-crepe-batter-setting-s2b-v1.png',
              alt: 'Masa clara de crepe cuajando en una sartén negra sobre una placa de inducción negra, con pequeñas burbujas por la superficie',
              title: 'Espera a que cuaje la superficie',
              caption: 'La superficie se vuelve mate y aparecen pequeños agujeros al cuajarse.',
            },
            {
              id: 'crepe-edge-lift',
              src: '/media/recipes/crepes/selected/step-05-crepe-edge-lift-s2b-v1.png',
              alt: 'Una mano levanta el borde de un crepe con una espátula negra y roja en una sartén negra',
              title: 'Despega los bordes',
              caption: 'Suelta primero el borde y después desliza la espátula más adentro.',
            },
            {
              id: 'crepe-golden-side',
              src: '/media/recipes/crepes/selected/step-05-crepe-golden-side-s2b-v1.png',
              alt: 'Un crepe uniformemente dorado cocinándose en una sartén negra sobre una placa de inducción negra',
              title: 'Dale la vuelta y termina la cocción',
              caption: 'El lado cocinado debe quedar dorado de manera uniforme.',
            },
          ],
        },
      ],
    },
  },
} satisfies RecipeSourceDraft;
