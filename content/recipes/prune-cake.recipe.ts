import type { RecipeSourceDraft } from './source-recipe.types.ts';

export const pruneCakeRecipe = {
  id: 'prune-cake',
  publicationStatus: 'draft',
  source: {
    file: 'docs/reference/recipe-inventory.xlsx',
    locator: 'Recipe Archive · Торт з чорносливом',
  },
  completeness: 'incompleteSource',
  beforeStart: [
    'Do not bake from this working record yet: several cake ingredients and the main method are unreadable.',
  ],
  ingredientSections: [
    {
      id: 'cake',
      title: 'Cake · partial transcription',
      ingredients: [
        {
          id: 'eggs',
          name: 'Eggs',
          quantity: {
            base: { kind: 'exact', value: 4, unit: 'piece' },
            shopping: { mode: 'base', increment: 1, rounding: 'up' },
          },
        },
        {
          id: 'unknown-jars',
          name: 'Unclear ingredient',
          quantity: { base: null, shopping: { mode: 'nameOnly' } },
          note: 'The source records 2 jars, but the ingredient name is unreadable.',
        },
        {
          id: 'sugar',
          name: 'Sugar',
          quantity: { base: null, shopping: { mode: 'nameOnly' } },
          note: 'The source records one incomplete glass; convert only after confirming the original measure.',
        },
        {
          id: 'unknown-spoons-one',
          name: 'Unclear ingredient',
          quantity: {
            base: { kind: 'exact', value: 2, unit: 'tbsp' },
            shopping: { mode: 'base' },
          },
          note: 'Unreadable in the source.',
        },
        {
          id: 'unknown-spoons-two',
          name: 'Unclear ingredient',
          quantity: {
            base: { kind: 'range', min: 5, max: 6, unit: 'tbsp' },
            shopping: { mode: 'base' },
          },
          note: 'Unreadable in the source.',
        },
        {
          id: 'leavener',
          name: 'Baking powder or lemon-quenched baking soda',
          quantity: {
            base: { kind: 'exact', value: 2, unit: 'tsp' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'cocoa',
          name: 'Cocoa',
          quantity: {
            base: { kind: 'exact', value: 5, unit: 'tbsp' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'flour',
          name: 'Schär Mix B Bread flour',
          quantity: {
            base: { kind: 'exact', value: 5, unit: 'tbsp' },
            shopping: { mode: 'base' },
          },
        },
      ],
    },
    {
      id: 'cream',
      title: 'Cream · partial transcription',
      ingredients: [
        {
          id: 'cream-base',
          name: 'Sour cream or cream',
          quantity: { base: null, shopping: { mode: 'nameOnly' } },
        },
        {
          id: 'powdered-sugar',
          name: 'Powdered sugar',
          quantity: { base: null, shopping: { mode: 'nameOnly' } },
          note: 'To taste, according to the source.',
        },
        {
          id: 'prunes',
          name: 'Prunes',
          quantity: { base: null, shopping: { mode: 'nameOnly' } },
          note: 'The quantity and preparation are not legible in the surviving note.',
        },
      ],
    },
    {
      id: 'glaze',
      title: 'Chocolate glaze · incomplete formula',
      ingredients: [
        {
          id: 'glaze-sour-cream',
          name: 'Sour cream',
          quantity: {
            base: { kind: 'exact', value: 2, unit: 'tbsp' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'glaze-unknown',
          name: 'Unclear glaze ingredient',
          quantity: { base: null, shopping: { mode: 'nameOnly' } },
          note: 'Part of the formula is unreadable.',
        },
        {
          id: 'butter',
          name: 'Butter',
          quantity: { base: null, shopping: { mode: 'nameOnly' } },
          note: 'The amount is unreadable.',
        },
      ],
    },
  ],
  steps: [
    {
      id: 'cream',
      title: 'Mix the recorded cream',
      body: 'Mix sour cream or cream with powdered sugar to taste. The source does not preserve the amount or the later assembly method.',
      cookIngredients: [
        { ingredientId: 'cream-base' },
        { ingredientId: 'powdered-sugar' },
      ],
      media: [
        {
          id: 'prune-cake-cream-v1',
          src: '/media/recipes/prune-cake/selected/cream-consistency-v1.png',
          alt: 'Smooth pale cream falling in a thick ribbon from a whisk',
          title: 'Recorded cream step',
          caption:
            'A visual consistency reference only; the source allows sour cream or cream and gives no exact amount.',
        },
      ],
    },
    {
      id: 'glaze',
      title: 'Review the glaze record',
      body: 'The source records 2 tablespoons sour cream, butter and an unreadable part of the formula. Confirm the complete formula before preparing it.',
      cookIngredients: [
        { ingredientId: 'glaze-sour-cream' },
        { ingredientId: 'glaze-unknown' },
        { ingredientId: 'butter' },
      ],
      media: [
        {
          id: 'prune-cake-glaze-v1',
          src: '/media/recipes/prune-cake/selected/chocolate-glaze-v1.png',
          alt: 'Glossy chocolate glaze falling from a spatula into a small saucepan',
          title: 'Glaze consistency reference',
          caption:
            'This image illustrates texture only; it does not supply the missing formula.',
        },
      ],
    },
  ],
  gapNote:
    'Several cake ingredients, the complete cake method, prune preparation, assembly, glaze formula, temperatures and timings are unreadable. Do not bake from this draft until the handwritten source is confirmed.',
  translations: {
    uk: {
      completeness: 'incompleteSource',
      beforeStart: [
        'Поки що не готуйте за цим робочим записом: кілька інгредієнтів коржів і основний спосіб приготування нерозбірливі.',
      ],
      ingredientSections: [
        {
          id: 'cake',
          title: 'Коржі · часткова розшифровка',
          ingredients: [
            {
              id: 'eggs',
              name: 'Яйця',
              quantity: {
                base: { kind: 'exact', value: 4, unit: 'piece' },
                shopping: { mode: 'base', increment: 1, rounding: 'up' },
              },
            },
            {
              id: 'unknown-jars',
              name: 'Нерозбірливий інгредієнт',
              quantity: { base: null, shopping: { mode: 'nameOnly' } },
              note: 'У джерелі записано 2 баночки, але назву інгредієнта не вдається прочитати.',
            },
            {
              id: 'sugar',
              name: 'Цукор',
              quantity: { base: null, shopping: { mode: 'nameOnly' } },
              note: 'У джерелі записано одну неповну склянку; переводити в грами можна лише після уточнення початкової міри.',
            },
            {
              id: 'unknown-spoons-one',
              name: 'Нерозбірливий інгредієнт',
              quantity: {
                base: { kind: 'exact', value: 2, unit: 'tbsp' },
                shopping: { mode: 'base' },
              },
              note: 'Назва нерозбірлива у джерелі.',
            },
            {
              id: 'unknown-spoons-two',
              name: 'Нерозбірливий інгредієнт',
              quantity: {
                base: { kind: 'range', min: 5, max: 6, unit: 'tbsp' },
                shopping: { mode: 'base' },
              },
              note: 'Назва нерозбірлива у джерелі.',
            },
            {
              id: 'leavener',
              name: 'Розпушувач або сода, погашена лимонним соком',
              quantity: {
                base: { kind: 'exact', value: 2, unit: 'tsp' },
                shopping: { mode: 'base' },
              },
            },
            {
              id: 'cocoa',
              name: 'Какао',
              quantity: {
                base: { kind: 'exact', value: 5, unit: 'tbsp' },
                shopping: { mode: 'base' },
              },
            },
            {
              id: 'flour',
              name: 'Борошно Schär Mix B Bread',
              quantity: {
                base: { kind: 'exact', value: 5, unit: 'tbsp' },
                shopping: { mode: 'base' },
              },
            },
          ],
        },
        {
          id: 'cream',
          title: 'Крем · часткова розшифровка',
          ingredients: [
            {
              id: 'cream-base',
              name: 'Сметана або вершки',
              quantity: { base: null, shopping: { mode: 'nameOnly' } },
            },
            {
              id: 'powdered-sugar',
              name: 'Цукрова пудра',
              quantity: { base: null, shopping: { mode: 'nameOnly' } },
              note: 'До смаку, за записом у джерелі.',
            },
            {
              id: 'prunes',
              name: 'Чорнослив',
              quantity: { base: null, shopping: { mode: 'nameOnly' } },
              note: 'Кількість і спосіб підготовки не читаються у збереженому записі.',
            },
          ],
        },
        {
          id: 'glaze',
          title: 'Шоколадна поливка · неповна формула',
          ingredients: [
            {
              id: 'glaze-sour-cream',
              name: 'Сметана',
              quantity: {
                base: { kind: 'exact', value: 2, unit: 'tbsp' },
                shopping: { mode: 'base' },
              },
            },
            {
              id: 'glaze-unknown',
              name: 'Нерозбірливий інгредієнт поливки',
              quantity: { base: null, shopping: { mode: 'nameOnly' } },
              note: 'Частина формули нерозбірлива.',
            },
            {
              id: 'butter',
              name: 'Вершкове масло',
              quantity: { base: null, shopping: { mode: 'nameOnly' } },
              note: 'Кількість нерозбірлива.',
            },
          ],
        },
      ],
      steps: [
        {
          id: 'cream',
          title: 'Змішайте записаний крем',
          body: 'Змішайте сметану або вершки з цукровою пудрою до смаку. Кількість і подальший спосіб складання торта у джерелі не збереглися.',
          cookIngredients: [
            { ingredientId: 'cream-base' },
            { ingredientId: 'powdered-sugar' },
          ],
          media: [
            {
              id: 'prune-cake-cream-v1',
              src: '/media/recipes/prune-cake/selected/cream-consistency-v1.png',
              alt: 'Гладкий світлий крем стікає густою стрічкою з вінчика',
              title: 'Записаний крок із кремом',
              caption:
                'Це лише орієнтир консистенції: джерело допускає сметану або вершки й не містить точної кількості.',
            },
          ],
        },
        {
          id: 'glaze',
          title: 'Перевірте запис поливки',
          body: 'У джерелі записано 2 столові ложки сметани, вершкове масло й нерозбірливу частину формули. Перед приготуванням потрібно уточнити весь склад.',
          cookIngredients: [
            { ingredientId: 'glaze-sour-cream' },
            { ingredientId: 'glaze-unknown' },
            { ingredientId: 'butter' },
          ],
          media: [
            {
              id: 'prune-cake-glaze-v1',
              src: '/media/recipes/prune-cake/selected/chocolate-glaze-v1.png',
              alt: 'Блискуча шоколадна поливка стікає з лопатки в невелику каструлю',
              title: 'Орієнтир консистенції поливки',
              caption:
                'Фото показує лише текстуру й не заповнює пропущену формулу.',
            },
          ],
        },
      ],
      gapNote:
        'Кілька інгредієнтів коржів, повний спосіб їх приготування, підготовка чорносливу, складання, формула поливки, температури й час нерозбірливі. Не готуйте за цією чернеткою, доки рукописне джерело не буде уточнено.',
    },
  },
} satisfies RecipeSourceDraft;
