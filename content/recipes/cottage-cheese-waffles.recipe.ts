import type { RecipeSourceDraft } from './source-recipe.types.ts';

const translatedQuantity = {
  base: null,
  shopping: { mode: 'nameOnly' as const },
};

const cottageCheeseWafflesStepMedia = {
  'ingredients-before-blending': {
    id: 'ingredients-before-blending',
    src: '/media/recipes/cottage-cheese-waffles/selected/step-01-ingredients-before-blending-author-v1.jpeg',
  },
  'blend-base': {
    id: 'blended-base',
    src: '/media/recipes/cottage-cheese-waffles/selected/step-01-blended-base-v1.png',
  },
  'add-wet': {
    id: 'add-wet-ingredients',
    src: '/media/recipes/cottage-cheese-waffles/selected/step-02-add-wet-ingredients-v1.png',
  },
  'mix-dry': {
    id: 'dry-mix',
    src: '/media/recipes/cottage-cheese-waffles/selected/step-03-dry-mix-v1.png',
  },
  'mix-batter': {
    id: 'mixed-batter',
    src: '/media/recipes/cottage-cheese-waffles/selected/step-04-mixed-batter-v1.png',
  },
  rest: {
    id: 'rested-batter',
    src: '/media/recipes/cottage-cheese-waffles/selected/step-05-rested-batter-v1.png',
  },
  bake: {
    id: 'baked-waffle',
    src: '/media/recipes/cottage-cheese-waffles/selected/step-06-baked-waffle-v1.png',
  },
} as const;

function stepMedia(
  stepId: keyof typeof cottageCheeseWafflesStepMedia,
  alt: string,
  title: string,
  caption: string,
) {
  return [{ ...cottageCheeseWafflesStepMedia[stepId], alt, title, caption }];
}

function blendBaseMedia(
  ingredients: { alt: string; title: string; caption: string },
  blended: { alt: string; title: string; caption: string },
) {
  return [
    {
      ...cottageCheeseWafflesStepMedia['ingredients-before-blending'],
      ...ingredients,
    },
    { ...cottageCheeseWafflesStepMedia['blend-base'], ...blended },
  ];
}

export const cottageCheeseWafflesRecipe = {
  id: 'cottage-cheese-waffles',
  source: {
    file: 'docs/reference/recipe-inventory.xlsx',
    locator: 'Recipe Archive · Творожні вафлі',
  },
  completeness: 'readyToReview',
  timing: {
    activeMinutes: null,
    totalElapsedMinutes: null,
    phases: [
      {
        id: 'batter-rest',
        label: 'Batter rest',
        duration: { kind: 'range', min: 7, max: 10, unit: 'minute' },
        relatedStepId: 'rest',
      },
      {
        id: 'waffle-baking',
        label: 'Bake each waffle',
        duration: { kind: 'range', min: 5, max: 7, unit: 'minute' },
        relatedStepId: 'bake',
      },
    ],
  },
  ingredientSections: [
    {
      id: 'waffles',
      title: 'Waffles',
      ingredients: [
        {
          id: 'cottage-cheese',
          name: 'Cottage cheese',
          quantity: {
            base: { kind: 'exact', value: 500, unit: 'g' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'eggs',
          name: 'Eggs',
          quantity: {
            base: { kind: 'exact', value: 4, unit: 'piece' },
            shopping: { mode: 'base', increment: 1, rounding: 'up' },
          },
        },
        {
          id: 'yogurt',
          name: 'Natural yogurt',
          quantity: {
            base: { kind: 'exact', value: 200, unit: 'ml' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'oil',
          name: 'Sunflower oil',
          quantity: {
            base: { kind: 'range', min: 60, max: 80, unit: 'ml' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'flour',
          name: 'Schär Mix B Bread flour',
          quantity: {
            base: { kind: 'exact', value: 250, unit: 'g' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'corn-starch',
          name: 'Corn starch',
          quantity: {
            base: { kind: 'exact', value: 1, unit: 'tbsp' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'baking-powder',
          name: 'Baking powder',
          quantity: {
            base: { kind: 'exact', value: 2, unit: 'tsp' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'sugar',
          name: 'Sugar',
          quantity: {
            base: { kind: 'exact', value: 1, unit: 'tbsp' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'salt',
          name: 'Salt',
          quantity: {
            base: null,
            equivalent: { kind: 'exact', value: 1, unit: 'pinch' },
            shopping: { mode: 'nameOnly' },
          },
        },
        {
          id: 'vanilla',
          name: 'Vanilla',
          quantity: { base: null, shopping: { mode: 'nameOnly' } },
        },
      ],
    },
  ],
  steps: [
    {
      id: 'blend-base',
      title: 'Blend the cottage-cheese base',
      body: 'Blend the cottage cheese, eggs and yogurt until smooth.',
      checkpoint:
        'The base is even, with no noticeable pieces of cottage cheese.',
      cookIngredients: [
        { ingredientId: 'cottage-cheese' },
        { ingredientId: 'eggs' },
        { ingredientId: 'yogurt' },
      ],
      media: blendBaseMedia(
        {
          alt: 'Cottage cheese, four cracked eggs and natural yogurt together in a white bowl before blending',
          title: 'Before blending',
          caption:
            'Put the cottage cheese, eggs and yogurt in the bowl together.',
        },
        {
          alt: 'Smooth pale cottage-cheese, egg and yogurt base in a ceramic bowl beside an immersion blender',
          title: 'Blend to an even base',
          caption:
            'Blend the cottage cheese, eggs and yogurt before adding the other ingredients.',
        },
      ),
    },
    {
      id: 'add-wet',
      title: 'Add the oil and flavourings',
      body: 'Add the sunflower oil, sugar, salt and vanilla. Mix well.',
      checkpoint: 'The oil and flavourings are fully mixed through the base.',
      cookIngredients: [
        { ingredientId: 'oil' },
        { ingredientId: 'sugar' },
        { ingredientId: 'salt' },
        { ingredientId: 'vanilla' },
      ],
      media: stepMedia(
        'add-wet',
        'Sunflower oil being poured into a smooth cottage-cheese base with sugar, salt and vanilla nearby',
        'Add the flavourings',
        'Mix the oil, sugar, salt and vanilla into the smooth base.',
      ),
    },
    {
      id: 'mix-dry',
      title: 'Mix the dry ingredients',
      body: 'In a separate bowl, combine the flour, corn starch and baking powder.',
      cookGroup: 'dry-and-combine',
      cookTitle: 'Mix and add the dry ingredients',
      cookInstructions: [
        'In a separate bowl, combine the flour, corn starch and baking powder.',
        'Add the dry mixture to the wet base and mix into a dough.',
      ],
      checkpoint:
        'The dry mixture looks even before it goes into the wet base.',
      cookIngredients: [
        { ingredientId: 'flour' },
        { ingredientId: 'corn-starch' },
        { ingredientId: 'baking-powder' },
      ],
      media: stepMedia(
        'mix-dry',
        'Gluten-free flour, corn starch and baking powder mixed in a ceramic bowl with a whisk',
        'Mix the dry ingredients',
        'Whisk the flour, corn starch and baking powder together first.',
      ),
    },
    {
      id: 'mix-batter',
      title: 'Mix in the dry ingredients',
      body: 'Add the dry mixture to the wet base and mix into a dough.',
      cookGroup: 'dry-and-combine',
      checkpoint: 'There are no dry patches of flour left in the dough.',
      media: stepMedia(
        'mix-batter',
        'Thick pale cottage-cheese waffle batter being lifted from a ceramic bowl with a silicone spatula',
        'An even dough',
        'Stop once the dry mixture is fully incorporated.',
      ),
    },
    {
      id: 'rest',
      title: 'Rest the dough',
      body: 'Leave the dough to rest for 7–10 minutes.',
      meta: '7–10 min',
      checkpoint: 'The dough has rested for at least 7 minutes.',
      media: stepMedia(
        'rest',
        'A bowl of cottage-cheese waffle dough resting loosely covered with a plate',
        'Let the dough rest',
        'Leave the mixed dough for 7–10 minutes.',
      ),
    },
    {
      id: 'bake',
      title: 'Bake the waffles',
      body: 'Heat the waffle maker well. Bake each waffle for 5–7 minutes.',
      meta: '5–7 min per waffle',
      checkpoint: 'The waffle is golden.',
      media: stepMedia(
        'bake',
        'Golden cottage-cheese waffle in an open black waffle maker with a light wisp of steam',
        'Bake until golden',
        'A well-heated waffle maker bakes each waffle in 5–7 minutes.',
      ),
    },
  ],
  translations: {
    uk: {
      completeness: 'readyToReview',
      timing: {
        activeMinutes: null,
        totalElapsedMinutes: null,
        phases: [
          {
            id: 'batter-rest',
            label: 'Відпочинок тіста',
            duration: { kind: 'range', min: 7, max: 10, unit: 'minute' },
          },
          {
            id: 'waffle-baking',
            label: 'Випікання однієї вафлі',
            duration: { kind: 'range', min: 5, max: 7, unit: 'minute' },
          },
        ],
      },
      ingredientSections: [
        {
          id: 'waffles',
          title: 'Вафлі',
          ingredients: [
            {
              id: 'cottage-cheese',
              name: 'Творог',
              quantity: translatedQuantity,
            },
            { id: 'eggs', name: 'Яйця', quantity: translatedQuantity },
            {
              id: 'yogurt',
              name: 'Натуральний йогурт',
              quantity: translatedQuantity,
            },
            {
              id: 'oil',
              name: 'Соняшникова олія',
              quantity: translatedQuantity,
            },
            {
              id: 'flour',
              name: 'Борошняна суміш Schär Mix B Bread',
              quantity: translatedQuantity,
            },
            {
              id: 'corn-starch',
              name: 'Кукурудзяний крохмаль',
              quantity: translatedQuantity,
            },
            {
              id: 'baking-powder',
              name: 'Розпушувач',
              quantity: translatedQuantity,
            },
            { id: 'sugar', name: 'Цукор', quantity: translatedQuantity },
            { id: 'salt', name: 'Дрібка солі', quantity: translatedQuantity },
            { id: 'vanilla', name: 'Ваніль', quantity: translatedQuantity },
          ],
        },
      ],
      steps: [
        {
          id: 'blend-base',
          title: 'Збийте основу блендером',
          body: 'Проблендеріть творог, яйця та йогурт до однорідної маси.',
          checkpoint: 'Основа однорідна, без помітних грудочок творогу.',
          cookIngredients: [
            { ingredientId: 'cottage-cheese' },
            { ingredientId: 'eggs' },
            { ingredientId: 'yogurt' },
          ],
          media: blendBaseMedia(
            {
              alt: 'Творог, чотири розбиті яйця та натуральний йогурт у білій мисці перед збиванням',
              title: 'Перед збиванням',
              caption: 'Складіть творог, яйця та йогурт разом у миску.',
            },
            {
              alt: 'Однорідна світла основа з творогу, яєць і йогурту в керамічній мисці поруч із занурювальним блендером',
              title: 'Збийте до однорідності',
              caption:
                'Проблендеріть творог, яйця та йогурт перед додаванням інших інгредієнтів.',
            },
          ),
        },
        {
          id: 'add-wet',
          title: 'Додайте олію та смакові добавки',
          body: 'Додайте соняшникову олію, цукор, сіль і ваніль. Добре перемішайте.',
          checkpoint: 'Олія та смакові добавки повністю вмішані в основу.',
          cookIngredients: [
            { ingredientId: 'oil' },
            { ingredientId: 'sugar' },
            { ingredientId: 'salt' },
            { ingredientId: 'vanilla' },
          ],
          media: stepMedia(
            'add-wet',
            'Соняшникова олія наливається в однорідну творожну основу; поруч цукор, сіль і ваніль',
            'Додайте смакові добавки',
            'Вмішайте олію, цукор, сіль і ваніль в однорідну основу.',
          ),
        },
        {
          id: 'mix-dry',
          title: 'Змішайте сухі інгредієнти',
          body: 'В окремій мисці змішайте борошно, кукурудзяний крохмаль і розпушувач.',
          cookGroup: 'dry-and-combine',
          cookTitle: 'Змішайте та введіть сухі інгредієнти',
          cookInstructions: [
            'В окремій мисці змішайте борошно, кукурудзяний крохмаль і розпушувач.',
            'Всипте суху суміш до вологої основи та замісіть тісто.',
          ],
          checkpoint:
            'Суха суміш має однорідний вигляд перед додаванням до вологої основи.',
          cookIngredients: [
            { ingredientId: 'flour' },
            { ingredientId: 'corn-starch' },
            { ingredientId: 'baking-powder' },
          ],
          media: stepMedia(
            'mix-dry',
            'Борошняна суміш без глютену, кукурудзяний крохмаль і розпушувач змішані вінчиком у керамічній мисці',
            'Змішайте сухі інгредієнти',
            'Спочатку рівномірно змішайте борошно, крохмаль і розпушувач.',
          ),
        },
        {
          id: 'mix-batter',
          title: 'Вмішайте сухі інгредієнти',
          body: 'Всипте суху суміш до вологої основи та замісіть тісто.',
          cookGroup: 'dry-and-combine',
          checkpoint: 'У тісті не залишилося сухих ділянок борошна.',
          media: stepMedia(
            'mix-batter',
            'Густе світле тісто для творожних вафель підняте силіконовою лопаткою з керамічної миски',
            'Однорідне тісто',
            'Зупиніться, щойно суха суміш повністю вмішається.',
          ),
        },
        {
          id: 'rest',
          title: 'Дайте тісту відпочити',
          body: 'Залиште тісто на 7–10 хвилин.',
          meta: '7–10 хв',
          checkpoint: 'Тісто відпочило щонайменше 7 хвилин.',
          media: stepMedia(
            'rest',
            'Миска з тістом для творожних вафель, нещільно накрита тарілкою',
            'Дайте тісту відпочити',
            'Залиште замішане тісто на 7–10 хвилин.',
          ),
        },
        {
          id: 'bake',
          title: 'Спечіть вафлі',
          body: 'Добре розігрійте вафельницю. Випікайте кожну вафлю 5–7 хвилин.',
          meta: '5–7 хв на вафлю',
          checkpoint: 'Вафля золотиста.',
          media: stepMedia(
            'bake',
            'Золотиста творожна вафля у відкритій чорній вафельниці з легкою парою',
            'Випікайте до золотистого кольору',
            'Добре розігріта вафельниця випікає кожну вафлю за 5–7 хвилин.',
          ),
        },
      ],
    },
    es: {
      completeness: 'readyToReview',
      timing: {
        activeMinutes: null,
        totalElapsedMinutes: null,
        phases: [
          {
            id: 'batter-rest',
            label: 'Reposo de la masa',
            duration: { kind: 'range', min: 7, max: 10, unit: 'minute' },
          },
          {
            id: 'waffle-baking',
            label: 'Hornear cada gofre',
            duration: { kind: 'range', min: 5, max: 7, unit: 'minute' },
          },
        ],
      },
      ingredientSections: [
        {
          id: 'waffles',
          title: 'Gofres',
          ingredients: [
            {
              id: 'cottage-cheese',
              name: 'Requesón',
              quantity: translatedQuantity,
            },
            { id: 'eggs', name: 'Huevos', quantity: translatedQuantity },
            {
              id: 'yogurt',
              name: 'Yogur natural',
              quantity: translatedQuantity,
            },
            {
              id: 'oil',
              name: 'Aceite de girasol',
              quantity: translatedQuantity,
            },
            {
              id: 'flour',
              name: 'Mezcla de harina Schär Mix B Bread',
              quantity: translatedQuantity,
            },
            {
              id: 'corn-starch',
              name: 'Almidón de maíz',
              quantity: translatedQuantity,
            },
            {
              id: 'baking-powder',
              name: 'Levadura química',
              quantity: translatedQuantity,
            },
            { id: 'sugar', name: 'Azúcar', quantity: translatedQuantity },
            {
              id: 'salt',
              name: 'Una pizca de sal',
              quantity: translatedQuantity,
            },
            { id: 'vanilla', name: 'Vainilla', quantity: translatedQuantity },
          ],
        },
      ],
      steps: [
        {
          id: 'blend-base',
          title: 'Tritura la base de requesón',
          body: 'Tritura el requesón, los huevos y el yogur hasta obtener una mezcla homogénea.',
          checkpoint:
            'La base está uniforme, sin trozos perceptibles de requesón.',
          cookIngredients: [
            { ingredientId: 'cottage-cheese' },
            { ingredientId: 'eggs' },
            { ingredientId: 'yogurt' },
          ],
          media: blendBaseMedia(
            {
              alt: 'Requesón, cuatro huevos cascados y yogur natural juntos en un bol blanco antes de triturarlos',
              title: 'Antes de triturar',
              caption:
                'Pon juntos el requesón, los huevos y el yogur en el bol.',
            },
            {
              alt: 'Base clara y homogénea de requesón, huevos y yogur en un bol de cerámica junto a una batidora de mano',
              title: 'Tritura hasta homogeneizar',
              caption:
                'Tritura el requesón, los huevos y el yogur antes de añadir los demás ingredientes.',
            },
          ),
        },
        {
          id: 'add-wet',
          title: 'Añade el aceite y los aromatizantes',
          body: 'Añade el aceite de girasol, el azúcar, la sal y la vainilla. Mezcla bien.',
          checkpoint:
            'El aceite y los aromatizantes están totalmente integrados en la base.',
          cookIngredients: [
            { ingredientId: 'oil' },
            { ingredientId: 'sugar' },
            { ingredientId: 'salt' },
            { ingredientId: 'vanilla' },
          ],
          media: stepMedia(
            'add-wet',
            'Aceite de girasol vertiéndose sobre una base homogénea de requesón, con azúcar, sal y vainilla cerca',
            'Añade los aromatizantes',
            'Mezcla el aceite, el azúcar, la sal y la vainilla con la base homogénea.',
          ),
        },
        {
          id: 'mix-dry',
          title: 'Mezcla los ingredientes secos',
          body: 'En otro bol, mezcla la harina, el almidón de maíz y la levadura química.',
          cookGroup: 'dry-and-combine',
          cookTitle: 'Mezcla e incorpora los ingredientes secos',
          cookInstructions: [
            'En otro bol, mezcla la harina, el almidón de maíz y la levadura química.',
            'Añade la mezcla seca a la base húmeda y mezcla hasta formar una masa.',
          ],
          checkpoint:
            'La mezcla seca se ve uniforme antes de incorporarla a la base húmeda.',
          cookIngredients: [
            { ingredientId: 'flour' },
            { ingredientId: 'corn-starch' },
            { ingredientId: 'baking-powder' },
          ],
          media: stepMedia(
            'mix-dry',
            'Harina sin gluten, almidón de maíz y levadura química mezclados con varillas en un bol de cerámica',
            'Mezcla los ingredientes secos',
            'Mezcla primero la harina, el almidón de maíz y la levadura química.',
          ),
        },
        {
          id: 'mix-batter',
          title: 'Incorpora los ingredientes secos',
          body: 'Añade la mezcla seca a la base húmeda y mezcla hasta formar una masa.',
          cookGroup: 'dry-and-combine',
          checkpoint: 'No quedan zonas de harina seca en la masa.',
          media: stepMedia(
            'mix-batter',
            'Masa espesa y clara para gofres de requesón levantada con una espátula de silicona desde un bol de cerámica',
            'Una masa uniforme',
            'Detente en cuanto la mezcla seca esté totalmente incorporada.',
          ),
        },
        {
          id: 'rest',
          title: 'Deja reposar la masa',
          body: 'Deja reposar la masa durante 7–10 minutos.',
          meta: '7–10 min',
          checkpoint: 'La masa ha reposado al menos 7 minutos.',
          media: stepMedia(
            'rest',
            'Un bol de masa para gofres de requesón cubierto sin apretar con un plato',
            'Deja reposar la masa',
            'Deja reposar la masa mezclada durante 7–10 minutos.',
          ),
        },
        {
          id: 'bake',
          title: 'Hornea los gofres',
          body: 'Calienta bien la gofrera. Hornea cada gofre durante 5–7 minutos.',
          meta: '5–7 min por gofre',
          checkpoint: 'El gofre está dorado.',
          media: stepMedia(
            'bake',
            'Gofre dorado de requesón en una gofrera negra abierta con un ligero vapor',
            'Hornea hasta dorar',
            'Una gofrera bien caliente hornea cada gofre en 5–7 minutos.',
          ),
        },
      ],
    },
  },
} satisfies RecipeSourceDraft;
