import type { AppLocale } from '../../lib/i18n/config.ts';

export const softenButterPath = (locale: AppLocale) =>
  `/${locale}/techniques/soften-butter`;

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
      'room-temperature-butter':
        'Заздалегідь дістаньте масло з холодильника, щоб воно стало м’яким і кімнатної температури. ',
    },
    link: 'Як розм’якшити масло',
    equipment:
      'Потрібні: масло, ніж, тарілка, жаростійка скляна або керамічна миска, гаряча вода та прихватки.',
    method: 'Спосіб із теплою мискою',
    steps: [
      [
        'Підготуйте масло',
        'Наріжте масло невеликими кубиками й розкладіть на тарілці в один шар. Нарізане масло розм’якне швидше, ніж цілий шматок.',
      ],
      [
        'Зігрійте миску',
        'Наповніть жаростійку скляну або керамічну миску гарячою водою й залиште приблизно на хвилину. Обережно вилийте воду, тримаючи миску прихватками та відвернувшись від пари.',
      ],
      [
        'Накрийте масло',
        'Накрийте кубики порожньою теплою мискою. Масло не має торкатися гарячих стінок.',
      ],
      [
        'Перевірте стан',
        'Через кілька хвилин зніміть миску й натисніть на кубик. Перевіряйте часто: час залежить від розміру кубиків і початкової температури масла.',
      ],
    ],
    readyTitle: 'М’яке — не розтоплене',
    ready:
      'Палець залишає вм’ятину з легким опором. Масло тримає форму, без рідких країв і маслянистої калюжки.',
    alternativeTitle: 'Без теплої миски',
    alternative:
      'Залиште нарізане кубиками масло на тарілці в один шар. За кімнатної температури перевірте через 15–20 хвилин; невеликі кубики розм’якнуть швидше, ніж цілий шматок, а в прохолодній кухні знадобиться довше.',
    mistakeTitle: 'Якщо масло почало танути',
    mistake:
      'Зніміть теплу миску й охолодіть масло до пластичного стану. Не додавайте рідке масло в крок, де його потрібно збивати м’яким.',
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
      'room-temperature-butter':
        'Take the butter out of the fridge ahead of time so it is soft and at room temperature. ',
    },
    link: 'How to soften butter',
    equipment:
      'You need: butter, a knife, a plate, a heatproof glass or ceramic bowl, hot water and oven mitts.',
    method: 'The warm bowl method',
    steps: [
      [
        'Prepare the butter',
        'Cut the butter into small cubes and spread them in one layer on a plate. Cut butter softens faster than a whole piece.',
      ],
      [
        'Warm the bowl',
        'Fill a heatproof glass or ceramic bowl with hot water for about a minute. Carefully empty it, using oven mitts and keeping your face away from the steam.',
      ],
      [
        'Cover the butter',
        'Cover the cubes with the empty warm bowl. Keep the butter clear of the hot sides.',
      ],
      [
        'Check the texture',
        'After a few minutes, lift the bowl and press a cube. Check often: timing depends on the size of the cubes and the butter’s starting temperature.',
      ],
    ],
    readyTitle: 'Soft, not melted',
    ready:
      'A finger leaves an indentation with slight resistance. The butter holds its shape, without liquid edges or a greasy puddle.',
    alternativeTitle: 'Without a warm bowl',
    alternative:
      'Leave the cubed butter in one layer on the plate. Check after 15–20 minutes at room temperature; small cubes soften faster than a whole piece, while a cool kitchen takes longer.',
    mistakeTitle: 'If the butter starts melting',
    mistake:
      'Remove the warm bowl and chill the butter until pliable. Do not add liquid butter to a step that calls for creaming softened butter.',
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
      'room-temperature-butter':
        'Saca la mantequilla de la nevera con antelación para que esté blanda y a temperatura ambiente. ',
    },
    link: 'Cómo ablandar la mantequilla',
    equipment:
      'Necesitas: mantequilla, un cuchillo, un plato, un bol de vidrio o cerámica resistente al calor, agua caliente y manoplas.',
    method: 'El método del bol caliente',
    steps: [
      [
        'Prepara la mantequilla',
        'Corta la mantequilla en dados pequeños y colócalos en una sola capa sobre un plato. La mantequilla cortada se ablanda más rápido que una pieza entera.',
      ],
      [
        'Calienta el bol',
        'Llena un bol de vidrio o cerámica resistente al calor con agua caliente durante aproximadamente un minuto. Vacíalo con cuidado, usando manoplas y alejando la cara del vapor.',
      ],
      [
        'Cubre la mantequilla',
        'Cubre los dados con el bol caliente vacío. Evita que la mantequilla toque las paredes calientes.',
      ],
      [
        'Comprueba la textura',
        'Al cabo de unos minutos, levanta el bol y presiona un dado. Comprueba a menudo: el tiempo depende del tamaño de los dados y de la temperatura inicial de la mantequilla.',
      ],
    ],
    readyTitle: 'Blanda, sin derretir',
    ready:
      'El dedo deja una marca con una ligera resistencia. La mantequilla mantiene su forma, sin bordes líquidos ni un charco de grasa.',
    alternativeTitle: 'Sin bol caliente',
    alternative:
      'Deja la mantequilla cortada en dados sobre el plato, en una sola capa. Comprueba a los 15–20 minutos a temperatura ambiente; los dados pequeños se ablandan antes que una pieza entera y en una cocina fría tardarán más.',
    mistakeTitle: 'Si empieza a derretirse',
    mistake:
      'Retira el bol y enfría la mantequilla hasta que esté flexible. No añadas mantequilla líquida cuando el paso requiere batirla blanda.',
    fullPage: 'Abrir la guía completa',
    close: 'Cerrar la ayuda',
    back: 'Volver a las recetas',
    related: 'Recetas que usan mantequilla blanda',
  },
} satisfies Record<AppLocale, unknown>;
