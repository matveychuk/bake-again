import type { RecipeSourceDraft } from './source-recipe.types.ts';

export const bananaBreadRecipe = {
  id: 'banana-bread',
  publicationStatus: 'draft',
  source: {
    file: 'docs/reference/recipe-inventory.xlsx',
    locator: 'Recipe Archive · Банановий хліб',
  },
  completeness: 'incompleteSource',
  ingredientSections: [
    {
      id: 'loaf',
      title: 'Banana bread',
      ingredients: [
        {
          id: 'bananas',
          name: 'Very ripe bananas',
          quantity: {
            base: { kind: 'exact', value: 3, unit: 'piece' },
            shopping: { mode: 'base', increment: 1, rounding: 'up' },
          },
        },
        {
          id: 'butter',
          name: 'Butter, room temperature',
          quantity: {
            base: { kind: 'exact', value: 113, unit: 'g' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'sugar',
          name: 'Sugar',
          quantity: {
            base: { kind: 'exact', value: 150, unit: 'g' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'eggs',
          name: 'Large eggs',
          quantity: {
            base: { kind: 'exact', value: 2, unit: 'piece' },
            shopping: { mode: 'base', increment: 1, rounding: 'up' },
          },
        },
        {
          id: 'flour',
          name: 'Schär Mix B Bread flour',
          quantity: {
            base: { kind: 'exact', value: 180, unit: 'g' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'baking-powder',
          name: 'Baking powder',
          quantity: {
            base: { kind: 'exact', value: 1, unit: 'tsp' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'salt',
          name: 'Salt',
          quantity: {
            base: { kind: 'exact', value: 0.5, unit: 'tsp' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'vanilla',
          name: 'Vanilla',
          quantity: {
            base: { kind: 'exact', value: 0.5, unit: 'tsp' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'walnuts',
          name: 'Walnuts',
          quantity: {
            base: { kind: 'exact', value: 100, unit: 'g' },
            shopping: { mode: 'base' },
          },
        },
        {
          id: 'raisins',
          name: 'Raisins',
          quantity: {
            base: { kind: 'exact', value: 150, unit: 'g' },
            shopping: { mode: 'base' },
          },
        },
      ],
    },
  ],
  steps: [
    {
      id: 'proposed-prepare',
      title: 'Draft: prepare the loaf tin',
      body: 'Grease or line a loaf tin and preheat the oven. This setup is an editorial placeholder, not preserved in the author source.',
    },
    {
      id: 'proposed-mix',
      title: 'Draft: mix the batter',
      body: 'Mash the bananas, then mix in butter, sugar, eggs and vanilla. Fold in the dry ingredients, walnuts and raisins just until combined.',
    },
    {
      id: 'proposed-bake',
      title: 'Draft: bake and check',
      body: 'Bake until a skewer from the centre comes out without wet batter. Confirm the temperature, timing and tin size in the next author bake.',
    },
  ],
  gapNote:
    'The author confirmed the Schär Mix B version bakes successfully at 200°C. Gram weights, loaf-tin dimensions, baking time and reviewed translations still need to be recorded.',
  translations: {
    uk: {
      completeness: 'incompleteSource',
      evidence: {
        status: 'tested',
        explanation:
          'Цю точну версію з борошняною сумішшю Schär Mix B Bread успішно випікали за 200°C.',
      },
      ingredientSections: [
        {
          id: 'loaf',
          title: 'Банановий хліб',
          ingredients: [
            {
              id: 'bananas',
              name: 'Дуже стиглі банани',
              quantity: {
                base: { kind: 'exact', value: 3, unit: 'piece' },
                shopping: { mode: 'base', increment: 1, rounding: 'up' },
              },
            },
            {
              id: 'butter',
              name: 'Вершкове масло кімнатної температури',
              quantity: {
                base: { kind: 'exact', value: 113, unit: 'g' },
                shopping: { mode: 'base' },
              },
            },
            {
              id: 'sugar',
              name: 'Цукор',
              quantity: {
                base: { kind: 'exact', value: 150, unit: 'g' },
                shopping: { mode: 'base' },
              },
            },
            {
              id: 'eggs',
              name: 'Великі яйця',
              quantity: {
                base: { kind: 'exact', value: 2, unit: 'piece' },
                shopping: { mode: 'base', increment: 1, rounding: 'up' },
              },
            },
            {
              id: 'flour',
              name: 'Борошняна суміш Schär Mix B Bread',
              quantity: {
                base: { kind: 'exact', value: 180, unit: 'g' },
                shopping: { mode: 'base' },
              },
            },
            {
              id: 'baking-powder',
              name: 'Розпушувач',
              quantity: {
                base: { kind: 'exact', value: 1, unit: 'tsp' },
                shopping: { mode: 'base' },
              },
            },
            {
              id: 'salt',
              name: 'Сіль',
              quantity: {
                base: { kind: 'exact', value: 0.5, unit: 'tsp' },
                shopping: { mode: 'base' },
              },
            },
            {
              id: 'vanilla',
              name: 'Ваніль',
              quantity: {
                base: { kind: 'exact', value: 0.5, unit: 'tsp' },
                shopping: { mode: 'base' },
              },
            },
            {
              id: 'walnuts',
              name: 'Волоські горіхи',
              quantity: {
                base: { kind: 'exact', value: 100, unit: 'g' },
                shopping: { mode: 'base' },
              },
            },
            {
              id: 'raisins',
              name: 'Родзинки',
              quantity: {
                base: { kind: 'exact', value: 150, unit: 'g' },
                shopping: { mode: 'base' },
              },
            },
          ],
        },
      ],
      steps: [
        {
          id: 'prepare-tin',
          title: 'Підготувати форму й духовку',
          body: 'Розігріти духовку до 200°C. Форму для кексу змастити вершковим маслом або застелити пергаментом.',
          meta: '200°C',
          checkpoint:
            'Форма підготовлена, а духовка повністю прогріта перед тим, як тісто потрапить усередину.',
          media: [
            {
              id: 'ingredients-and-tin',
              src: '/media/recipes/banana-bread/selected/step-01-ingredients-and-tin-v1.png',
              alt: 'Дуже стиглі банани, горіхи, родзинки, масло, яйця, борошняна суміш і підготовлена форма для кексу',
              title: 'Інгредієнти та форма',
              caption: 'Форма вже вистелена пергаментом і готова до тіста.',
            },
          ],
        },
        {
          id: 'cream-butter-and-sugar',
          title: 'Збити масло з цукром',
          body: 'Збити м’яке вершкове масло з цукром до світлої, пишної маси.',
          checkpoint:
            'Маса світліша за початкове масло й виглядає повітряною, без великих шматочків масла.',
          media: [
            {
              id: 'butter-and-sugar',
              src: '/media/recipes/banana-bread/selected/step-02-butter-sugar-v1.png',
              alt: 'Світла пишна маса з вершкового масла й цукру в керамічній мисці',
              title: 'Світла пишна маса',
              caption: 'Збивайте, доки масло стане світлішим і повітряним.',
            },
          ],
        },
        {
          id: 'add-bananas-and-eggs',
          title: 'Додати банани та яйця',
          body: 'Розім’яти банани виделкою до густого пюре з невеликими шматочками. Додати їх разом із яйцями та перемішати до однорідності.',
          checkpoint:
            'Тісто однорідне, густе й без окремих смуг яйця чи масла.',
          media: [
            {
              id: 'mashed-bananas',
              src: '/media/recipes/banana-bread/selected/step-03-mashed-bananas-v1.png',
              alt: 'Розім’яті виделкою стиглі банани з невеликими м’якими шматочками',
              title: 'Текстура бананів',
              caption: 'Пюре може залишатися неідеально гладким.',
            },
          ],
        },
        {
          id: 'combine-dry-ingredients',
          title: 'Вмішати сухі інгредієнти',
          body: 'Окремо змішати борошняну суміш Schär Mix B Bread, розпушувач і сіль. Додати до бананової маси та перемішати лопаткою, щойно зникнуть сухі ділянки.',
          checkpoint:
            'У тісті не залишилося сухого борошна, але його не вимішували довго.',
          media: [
            {
              id: 'dry-mix',
              src: '/media/recipes/banana-bread/selected/step-04-dry-mix-v1.png',
              alt: 'Борошняна суміш, розпушувач і сіль, перемішані вінчиком у керамічній мисці',
              title: 'Суха суміш',
              caption:
                'Перед додаванням до тіста сухі інгредієнти мають бути рівномірно змішані.',
            },
          ],
        },
        {
          id: 'add-flavourings-and-fill-tin',
          title: 'Додати ваніль, горіхи й родзинки',
          body: 'Вмішати ваніль, волоські горіхи та родзинки. Перекласти тісто у форму й розрівняти верх.',
          tip: 'За бажанням підсушіть горіхи на сухій пательні, остудіть і лише тоді додавайте: так їхній аромат буде виразнішим.',
          checkpoint:
            'Форма заповнена приблизно на дві третини або три чверті, щоб хліб мав місце піднятися.',
          media: [
            {
              id: 'toasted-walnuts',
              src: '/media/recipes/banana-bread/selected/step-05-toasted-walnuts-v1.png',
              alt: 'Волоські горіхи, що підсушуються на сухій пательні, поруч із мискою остиглих порубаних горіхів',
              title: 'Горіхи за бажанням',
              caption:
                'Після підсушування дайте горіхам охолонути перед додаванням.',
            },
            {
              id: 'batter-in-tin',
              src: '/media/recipes/banana-bread/selected/step-05-batter-in-tin-v1.png',
              alt: 'Бананове тісто з горіхами й родзинками у прямокутній формі, вистеленій пергаментом',
              title: 'Тісто у формі',
              caption: 'Заповніть форму не більш ніж на три чверті.',
            },
          ],
        },
        {
          id: 'bake-loaf',
          title: 'Спекти до готовності',
          body: 'Пекти за 200°C, доки верхівка не стане рум’яною, а шпажка з центру не вийде без сирого тіста.',
          meta: '200°C',
          checkpoint:
            'Кілька вологих крихт на шпажці — нормально; рідкого тіста бути не повинно.',
          media: [
            {
              id: 'doneness-skewer',
              src: '/media/recipes/banana-bread/selected/step-06-doneness-skewer-v1.png',
              alt: 'Рум’яний банановий хліб у формі зі шпажкою в центрі',
              title: 'Перевірка готовності',
              caption: 'На шпажці допустимі вологі крихти, але не сире тісто.',
            },
          ],
        },
        {
          id: 'cool-loaf',
          title: 'Дати хлібу охолонути',
          body: 'Залишити хліб у формі на 10 хвилин, потім обережно вийняти й повністю остудити на решітці.',
          checkpoint:
            'Нарізати лише після охолодження: так м’якуш не зминатиметься.',
          media: [
            {
              id: 'cooled-sliced-loaf',
              src: '/media/recipes/banana-bread/selected/step-07-cooled-sliced-loaf-v1.png',
              alt: 'Остиглий банановий хліб із відрізаною скибкою, у м’якуші видно родзинки та волоські горіхи',
              title: 'Остиглий зріз',
              caption:
                'Повністю остиглий хліб легше нарізати рівними скибками.',
            },
          ],
        },
      ],
      gapNote:
        'Ця версія з борошняною сумішшю Schär Mix B Bread успішно випікалася за 200°C. Ще потрібно записати грамовки, розмір форми та час випікання.',
    },
  },
} satisfies RecipeSourceDraft;
