import type { RecipeSourceDraft } from './source-recipe.types.ts';

const translatedQuantity = {
  base: null,
  shopping: { mode: 'nameOnly' as const },
};

export const lazyDumplingsRecipe = {
  id: 'lazy-dumplings',
  publicationStatus: 'draft',
  source: {
    file: 'docs/reference/recipe-inventory.xlsx',
    locator:
      'Recipe Archive · Ліниві вареники; author-confirmed working method',
  },
  completeness: 'readyToReview',
  timing: {
    activeMinutes: null,
    totalElapsedMinutes: null,
    phases: [
      {
        id: 'dough-rest',
        label: 'Dough rest',
        duration: { kind: 'range', min: 15, max: 30, unit: 'minute' },
        relatedStepId: 'rest',
      },
      {
        id: 'gentle-boil',
        label: 'Gentle boil after floating',
        duration: { kind: 'range', min: 1, max: 2, unit: 'minute' },
        relatedStepId: 'cook-dumplings',
      },
    ],
  },
  ingredientSections: [
    {
      id: 'dumplings',
      title: 'Dumplings',
      ingredients: [
        {
          id: 'cottage-cheese',
          name: 'Cottage cheese',
          quantity: {
            base: { kind: 'exact', value: 460, unit: 'g' },
            equivalent: { kind: 'exact', value: 2, unit: 'packet' },
            shopping: { mode: 'base' },
          },
          note: 'Two 230 g packets.',
        },
        {
          id: 'eggs',
          name: 'Eggs',
          quantity: {
            base: { kind: 'exact', value: 2, unit: 'piece' },
            shopping: { mode: 'base', increment: 1, rounding: 'up' },
          },
        },
        {
          id: 'sugar',
          name: 'Sugar',
          quantity: {
            base: { kind: 'exact', value: 67, unit: 'g' },
            equivalent: { kind: 'exact', value: 3.33, unit: 'tbsp' },
            shopping: { mode: 'base' },
          },
          note: 'The spoon equivalent uses the author’s measured 20 g per tablespoon.',
        },
        {
          id: 'flour',
          name: 'Schär Mix B Bread flour',
          quantity: {
            base: { kind: 'exact', value: 100, unit: 'g' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'tapioca',
          name: 'Tapioca starch',
          quantity: {
            base: { kind: 'exact', value: 8, unit: 'g' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'water',
          name: 'Water for cooking',
          quantity: {
            base: null,
            shopping: { mode: 'nameOnly', defaultSelected: false },
          },
          note: 'Enough to cook the dumplings in small batches.',
        },
      ],
    },
  ],
  steps: [
    {
      id: 'mix-wet',
      title: 'Mix the cottage cheese, eggs and sugar',
      body: 'Mix in a food processor with the dough hook until even. You can also mix thoroughly by hand with a fork.',
      cookIngredients: [
        { ingredientId: 'cottage-cheese' },
        { ingredientId: 'eggs' },
        { ingredientId: 'sugar' },
      ],
    },
    {
      id: 'add-dry',
      title: 'Add the flour and tapioca',
      body: 'Mix the flour with the tapioca starch, add them to the cottage-cheese mixture and mix until evenly combined.',
      checkpoint:
        'The dough should remain very sticky. Do not add extra flour to firm it up.',
      cookIngredients: [{ ingredientId: 'flour' }, { ingredientId: 'tapioca' }],
    },
    {
      id: 'rest',
      title: 'Rest the dough',
      body: 'Leave the dough to rest for 15–30 minutes.',
      meta: '15–30 min',
    },
    {
      id: 'shape-log',
      title: 'Shape the dough into a log',
      body: 'Dust the work surface generously with flour. Place the dough on it, dust the top with flour and gently roll it into a log.',
      tip: 'Use the flour only to handle and shape the sticky dough. Do not knead it into the dough.',
      cookIngredients: [
        {
          ingredientId: 'flour',
          quantity: 'omit',
          note: 'Use extra flour only for dusting the surface and dough.',
        },
      ],
    },
    {
      id: 'shape-dumplings',
      title: 'Cut and shape the dumplings',
      body: 'Cut the log into small pieces. Coat each piece in flour, covering the cut sides, then roll it gently between your palms to make a ball.',
      checkpoint: 'The cut sides should be completely coated with flour.',
      tip: 'The shaped uncooked dumplings freeze very well. For a large batch—the author usually starts with about 1.5 kg of cottage cheese—arrange them in a single layer on plastic trays and freeze.',
      cookIngredients: [
        {
          ingredientId: 'flour',
          quantity: 'omit',
          note: 'Use extra flour to coat the cut sides.',
        },
      ],
    },
    {
      id: 'cook-dumplings',
      title: 'Boil the dumplings',
      body: 'Bring water to a boil and add the dumplings in small batches. Gently run a spoon or skimmer over the bottom so they do not stick. When the water returns to a boil and the dumplings float, reduce the heat. Cook at a gentle boil for another 1–2 minutes, then lift them out carefully with a skimmer.',
      cookInstructions: [
        'Bring water to a boil and add the dumplings in small batches.',
        'Gently run a spoon or skimmer over the bottom so they do not stick.',
        'When the water returns to a boil and the dumplings float, reduce the heat. Cook at a gentle boil for another 1–2 minutes, then lift them out carefully with a skimmer.',
      ],
      cookIngredients: [{ ingredientId: 'water', quantity: 'omit' }],
      meta: '1–2 min after floating',
      checkpoint:
        'Keep the water at a calm boil so the dumplings do not become damaged or fall apart.',
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
            id: 'dough-rest',
            label: 'Відпочинок тіста',
            duration: { kind: 'range', min: 15, max: 30, unit: 'minute' },
            relatedStepId: 'rest',
          },
          {
            id: 'gentle-boil',
            label: 'Спокійне кипіння після спливання',
            duration: { kind: 'range', min: 1, max: 2, unit: 'minute' },
            relatedStepId: 'cook-dumplings',
          },
        ],
      },
      ingredientSections: [
        {
          id: 'dumplings',
          title: 'Ліниві вареники',
          ingredients: [
            {
              id: 'cottage-cheese',
              name: 'Кисломолочний сир',
              quantity: translatedQuantity,
              note: '2 пачки по 230 г.',
            },
            {
              id: 'eggs',
              name: 'Яйця',
              quantity: translatedQuantity,
            },
            {
              id: 'sugar',
              name: 'Цукор',
              quantity: translatedQuantity,
              note: 'Еквівалент у ложках розрахований за зваженою авторкою мірою: 20 г у столовій ложці.',
            },
            {
              id: 'flour',
              name: 'Борошно Schär Mix B Bread',
              quantity: translatedQuantity,
            },
            {
              id: 'tapioca',
              name: 'Тапіоковий крохмаль',
              quantity: translatedQuantity,
            },
            {
              id: 'water',
              name: 'Вода для варіння',
              quantity: translatedQuantity,
              note: 'Стільки, щоб варити вареники невеликими порціями.',
            },
          ],
        },
      ],
      steps: [
        {
          id: 'mix-wet',
          title: 'Змішайте сир, яйця та цукор',
          body: 'Перемішайте в комбайні насадкою-тістомісом до однорідності. Також можна ретельно перемішати все вручну виделкою.',
          cookIngredients: [
            { ingredientId: 'cottage-cheese' },
            { ingredientId: 'eggs' },
            { ingredientId: 'sugar' },
          ],
        },
        {
          id: 'add-dry',
          title: 'Додайте борошно й тапіоку',
          body: 'Змішайте борошно з тапіокою, додайте до сирної маси та вимішайте до рівномірного тіста.',
          checkpoint:
            'Тісто має залишитися зовсім липким. Не додавайте більше борошна, щоб зробити його щільнішим.',
          cookIngredients: [
            { ingredientId: 'flour' },
            { ingredientId: 'tapioca' },
          ],
        },
        {
          id: 'rest',
          title: 'Залиште тісто відпочити',
          body: 'Залиште тісто відпочити на 15–30 хвилин.',
          meta: '15–30 хв',
        },
        {
          id: 'shape-log',
          title: 'Сформуйте ковбаску',
          body: 'Добре присипте робочу поверхню борошном. Викладіть тісто, присипте його борошном зверху й обережно розкачайте в ковбаску.',
          tip: 'Борошно потрібне лише для роботи з липким тістом і формування. Не вмішуйте його додатково в тісто.',
          cookIngredients: [
            {
              ingredientId: 'flour',
              quantity: 'omit',
              note: 'Додаткове борошно лише для присипання поверхні й тіста.',
            },
          ],
        },
        {
          id: 'shape-dumplings',
          title: 'Наріжте та сформуйте вареники',
          body: 'Наріжте ковбаску на невеликі шматочки. Кожен шматочок обваляйте в борошні, добре покривши зрізи, а потім сформуйте кульку, легко прокочуючи її між долонями.',
          checkpoint: 'Зрізи мають бути повністю вкриті борошном.',
          tip: 'Сформовані сирі вареники чудово заморожуються. Для великої порції авторка зазвичай бере близько 1,5 кг сиру, розкладає вареники в один шар на пластикових формах і заморожує.',
          cookIngredients: [
            {
              ingredientId: 'flour',
              quantity: 'omit',
              note: 'Додаткове борошно для покриття зрізів.',
            },
          ],
        },
        {
          id: 'cook-dumplings',
          title: 'Зваріть вареники',
          body: 'Закип’ятіть воду й опустіть вареники в киплячу воду невеликими порціями. Обережно проведіть ложкою або шумівкою по дну, щоб вони не прилипли. Коли вода знову закипить і вареники спливуть, зменште нагрів. Варіть при спокійному кипінні ще 1–2 хвилини, потім обережно дістаньте шумівкою.',
          cookInstructions: [
            'Закип’ятіть воду й опустіть вареники в киплячу воду невеликими порціями.',
            'Обережно проведіть ложкою або шумівкою по дну, щоб вони не прилипли.',
            'Коли вода знову закипить і вареники спливуть, зменште нагрів. Варіть при спокійному кипінні ще 1–2 хвилини, потім обережно дістаньте шумівкою.',
          ],
          cookIngredients: [{ ingredientId: 'water', quantity: 'omit' }],
          meta: '1–2 хв після спливання',
          checkpoint:
            'Вода має кипіти спокійно, щоб вареники не пошкодилися й не розвалилися.',
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
            id: 'dough-rest',
            label: 'Reposo de la masa',
            duration: { kind: 'range', min: 15, max: 30, unit: 'minute' },
            relatedStepId: 'rest',
          },
          {
            id: 'gentle-boil',
            label: 'Cocción suave después de que suban',
            duration: { kind: 'range', min: 1, max: 2, unit: 'minute' },
            relatedStepId: 'cook-dumplings',
          },
        ],
      },
      ingredientSections: [
        {
          id: 'dumplings',
          title: 'Ñoquis perezosos de requesón',
          ingredients: [
            {
              id: 'cottage-cheese',
              name: 'Requesón',
              quantity: translatedQuantity,
              note: '2 paquetes de 230 g.',
            },
            {
              id: 'eggs',
              name: 'Huevos',
              quantity: translatedQuantity,
            },
            {
              id: 'sugar',
              name: 'Azúcar',
              quantity: translatedQuantity,
              note: 'La equivalencia en cucharadas usa la medida pesada por la autora: 20 g por cucharada.',
            },
            {
              id: 'flour',
              name: 'Harina Schär Mix B Bread',
              quantity: translatedQuantity,
            },
            {
              id: 'tapioca',
              name: 'Almidón de tapioca',
              quantity: translatedQuantity,
            },
            {
              id: 'water',
              name: 'Agua para la cocción',
              quantity: translatedQuantity,
              note: 'La necesaria para cocer las piezas en tandas pequeñas.',
            },
          ],
        },
      ],
      steps: [
        {
          id: 'mix-wet',
          title: 'Mezcla el requesón, los huevos y el azúcar',
          body: 'Mézclalos en un robot de cocina con el gancho de amasar hasta obtener una mezcla uniforme. También puedes mezclarlos bien a mano con un tenedor.',
          cookIngredients: [
            { ingredientId: 'cottage-cheese' },
            { ingredientId: 'eggs' },
            { ingredientId: 'sugar' },
          ],
        },
        {
          id: 'add-dry',
          title: 'Añade la harina y la tapioca',
          body: 'Mezcla la harina con el almidón de tapioca, añádelos al requesón y mezcla hasta que la masa quede uniforme.',
          checkpoint:
            'La masa debe quedar muy pegajosa. No añadas más harina para endurecerla.',
          cookIngredients: [
            { ingredientId: 'flour' },
            { ingredientId: 'tapioca' },
          ],
        },
        {
          id: 'rest',
          title: 'Deja reposar la masa',
          body: 'Deja reposar la masa durante 15–30 minutos.',
          meta: '15–30 min',
        },
        {
          id: 'shape-log',
          title: 'Forma un cilindro',
          body: 'Enharina generosamente la superficie de trabajo. Coloca encima la masa, espolvorea harina por arriba y forma con cuidado un cilindro.',
          tip: 'Usa la harina solo para manipular y formar la masa pegajosa. No la amases dentro de la masa.',
          cookIngredients: [
            {
              ingredientId: 'flour',
              quantity: 'omit',
              note: 'Usa harina adicional solo para espolvorear la superficie y la masa.',
            },
          ],
        },
        {
          id: 'shape-dumplings',
          title: 'Corta y forma las piezas',
          body: 'Corta el cilindro en trozos pequeños. Pasa cada trozo por harina, cubriendo bien los cortes, y forma una bola haciéndolo rodar suavemente entre las palmas.',
          checkpoint:
            'Los cortes deben quedar completamente cubiertos de harina.',
          tip: 'Las piezas crudas ya formadas se congelan muy bien. Para una tanda grande, la autora suele partir de unos 1,5 kg de requesón, colocar las piezas en una sola capa sobre bandejas de plástico y congelarlas.',
          cookIngredients: [
            {
              ingredientId: 'flour',
              quantity: 'omit',
              note: 'Usa harina adicional para cubrir los cortes.',
            },
          ],
        },
        {
          id: 'cook-dumplings',
          title: 'Cuece las piezas',
          body: 'Lleva el agua a ebullición y añade las piezas en tandas pequeñas. Pasa con cuidado una cuchara o espumadera por el fondo para que no se peguen. Cuando el agua vuelva a hervir y las piezas suban a la superficie, baja el fuego. Cuécelas con un hervor suave durante 1–2 minutos más y retíralas con cuidado con una espumadera.',
          cookInstructions: [
            'Lleva el agua a ebullición y añade las piezas en tandas pequeñas.',
            'Pasa con cuidado una cuchara o espumadera por el fondo para que no se peguen.',
            'Cuando el agua vuelva a hervir y las piezas suban a la superficie, baja el fuego. Cuécelas con un hervor suave durante 1–2 minutos más y retíralas con cuidado con una espumadera.',
          ],
          cookIngredients: [{ ingredientId: 'water', quantity: 'omit' }],
          meta: '1–2 min después de que suban',
          checkpoint:
            'Mantén un hervor tranquilo para que las piezas no se dañen ni se deshagan.',
        },
      ],
    },
  },
} satisfies RecipeSourceDraft;
