import type { AppLocale } from '../../lib/i18n/config.ts';

export const softenButterPath = (locale: AppLocale) =>
  `/${locale}/techniques/soften-butter`;
export const softenButterSource =
  'https://preppykitchen.com/how-to-soften-butter/';

export const softenButter = {
  uk: {
    title: 'Як швидко розм’якшити масло',
    category: 'Основи випікання',
    intro:
      'Забули дістати масло заздалегідь? Тепла миска допоможе підготувати його до змішування.',
    prompt:
      'Якщо ви забули дістати масло заздалегідь, скористайтеся швидким способом розм’якшення.',
    conditions: {
      'butter-option': 'Якщо використовуєте масло замість олії. ',
      'cinnamon-filling': 'Для начинки з корицею та маслом. ',
    },
    link: 'Як розм’якшити масло',
    equipment:
      'Потрібні: масло, тарілка, жаростійка миска, гаряча вода та прихватки.',
    method: 'Спосіб із теплою мискою',
    steps: [
      [
        'Зігрійте миску',
        'Налийте гарячу воду в жаростійку миску й залиште приблизно на хвилину. Обережно вилийте воду, тримаючи миску прихватками та відвернувшись від пари.',
      ],
      [
        'Накрийте масло',
        'Покладіть масло на тарілку й накрийте порожньою теплою мискою. Масло не має торкатися гарячих стінок.',
      ],
      [
        'Перевірте стан',
        'Приблизно через 10 хвилин зніміть миску й натисніть на масло. Час залежить від розміру шматка та його початкової температури.',
      ],
    ],
    readyTitle: 'М’яке — не розтоплене',
    ready:
      'Палець залишає вм’ятину з легким опором. Масло тримає форму, без рідких країв і маслянистої калюжки.',
    alternativeTitle: 'Без теплої миски',
    alternative:
      'Наріжте масло маленькими кубиками й розкладіть одним шаром. За кімнатної температури перевірте через 15–20 хвилин; у прохолодній кухні знадобиться довше.',
    mistakeTitle: 'Якщо масло почало танути',
    mistake:
      'Зніміть теплу миску й охолодіть масло до пластичного стану. Не додавайте рідке масло в крок, де його потрібно збивати м’яким.',
    provenance:
      'Спосіб за матеріалом Preppy Kitchen. У Bake Again його ще не перевіряли у випічці.',
    source: 'Джерело: Preppy Kitchen',
    fullPage: 'Відкрити повну сторінку',
    close: 'Закрити підказку',
    back: 'До рецептів',
    related: 'Де потрібне м’яке масло',
  },
  en: {
    title: 'How to soften butter quickly',
    category: 'Baking basics',
    intro:
      'Forgot to take the butter out? A warm bowl can help get it ready for mixing.',
    prompt:
      'If you forgot to take the butter out ahead of time, try this quick softening method.',
    conditions: {
      'butter-option': 'If using butter instead of oil. ',
      'cinnamon-filling': 'For the cinnamon and butter filling. ',
    },
    link: 'How to soften butter',
    equipment:
      'You need: butter, a plate, a heatproof bowl, hot water and oven mitts.',
    method: 'The warm bowl method',
    steps: [
      [
        'Warm the bowl',
        'Fill a heatproof bowl with hot water for about a minute. Carefully empty it, using oven mitts and keeping your face away from the steam.',
      ],
      [
        'Cover the butter',
        'Place the butter on a plate and cover with the empty warm bowl. Keep the butter clear of the hot sides.',
      ],
      [
        'Check the texture',
        'After about 10 minutes, lift the bowl and press the butter. Timing depends on the size of the piece and its starting temperature.',
      ],
    ],
    readyTitle: 'Soft, not melted',
    ready:
      'A finger leaves an indentation with slight resistance. The butter holds its shape, without liquid edges or a greasy puddle.',
    alternativeTitle: 'Without a warm bowl',
    alternative:
      'Cut the butter into small cubes and spread in one layer. Check after 15–20 minutes at room temperature; a cool kitchen takes longer.',
    mistakeTitle: 'If the butter starts melting',
    mistake:
      'Remove the warm bowl and chill the butter until pliable. Do not add liquid butter to a step that calls for creaming softened butter.',
    provenance:
      'Method adapted from Preppy Kitchen. Bake Again has not yet bake-tested this method.',
    source: 'Source: Preppy Kitchen',
    fullPage: 'Open the full guide',
    close: 'Close the guide',
    back: 'Back to recipes',
    related: 'Recipes that use softened butter',
  },
  es: {
    title: 'Cómo ablandar la mantequilla rápidamente',
    category: 'Bases de repostería',
    intro:
      '¿Olvidaste sacar la mantequilla? Un bol caliente puede ayudarte a prepararla para mezclar.',
    prompt:
      'Si olvidaste sacar la mantequilla con antelación, prueba este método rápido para ablandarla.',
    conditions: {
      'butter-option': 'Si usas mantequilla en lugar de aceite. ',
      'cinnamon-filling': 'Para el relleno de canela y mantequilla. ',
    },
    link: 'Cómo ablandar la mantequilla',
    equipment:
      'Necesitas: mantequilla, un plato, un bol resistente al calor, agua caliente y manoplas.',
    method: 'El método del bol caliente',
    steps: [
      [
        'Calienta el bol',
        'Llena un bol resistente al calor con agua caliente durante aproximadamente un minuto. Vacíalo con cuidado, usando manoplas y alejando la cara del vapor.',
      ],
      [
        'Cubre la mantequilla',
        'Pon la mantequilla en un plato y cúbrela con el bol caliente vacío. Evita que toque las paredes calientes.',
      ],
      [
        'Comprueba la textura',
        'Al cabo de unos 10 minutos, levanta el bol y presiona la mantequilla. El tiempo depende del tamaño y de la temperatura inicial.',
      ],
    ],
    readyTitle: 'Blanda, sin derretir',
    ready:
      'El dedo deja una marca con una ligera resistencia. La mantequilla mantiene su forma, sin bordes líquidos ni un charco de grasa.',
    alternativeTitle: 'Sin bol caliente',
    alternative:
      'Corta la mantequilla en dados pequeños y colócalos en una sola capa. Comprueba a los 15–20 minutos a temperatura ambiente; en una cocina fría tardará más.',
    mistakeTitle: 'Si empieza a derretirse',
    mistake:
      'Retira el bol y enfría la mantequilla hasta que esté flexible. No añadas mantequilla líquida cuando el paso requiere batirla blanda.',
    provenance:
      'Método adaptado de Preppy Kitchen. Bake Again aún no lo ha probado en repostería.',
    source: 'Fuente: Preppy Kitchen',
    fullPage: 'Abrir la guía completa',
    close: 'Cerrar la ayuda',
    back: 'Volver a las recetas',
    related: 'Recetas que usan mantequilla blanda',
  },
} satisfies Record<AppLocale, unknown>;
