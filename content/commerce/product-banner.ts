import type { AppLocale } from '../../lib/i18n/config.ts';

type HookCopy = {
  title: string;
  /** Italic punchline after the title, kept on one line like recipe titles. */
  titleAccent?: string;
  description: string;
};

type BannerCopy = HookCopy & {
  eyebrow: string;
  action: string;
  videoLabel: string;
  dialog: { title: string; description: string; note: string };
  close: string;
  later: string;
};

/** The resolved banner for one page: copy in the page locale plus media. */
export type ProductBanner = Omit<BannerCopy, 'videoLabel'> & {
  id: string;
  locale: AppLocale;
  video: { mp4: string; poster: string; label: string };
};

const media = '/media/recipes/gluten-free-napoleon/lesson-banner-2026-10-31';

/**
 * The single current product promoted at the top of recipe pages.
 * Changing the promoted product means editing this record only.
 */
export const productBanner = {
  id: 'napoleon-lesson',
  active: true,
  /** Last day the banner is shown, inclusive, in Europe/Kyiv time. */
  showUntil: '2026-12-31',
  video: {
    mp4: `${media}/napoleon-banner-loop-crop-360x450.mp4`,
    poster: `${media}/napoleon-banner-poster-crop-360x450.webp`,
  },
  copy: {
    uk: {
      eyebrow: 'Відеоурок · грудень',
      title: 'Новорічний стіл без Наполеона?',
      titleAccent: 'Не цього року.',
      description:
        'Покажу все у відеоуроці «Наполеон без глютену» — встигнеш до Нового року. Залиш email — і раніше за всіх отримаєш лист про запуск.',
      action: 'Хочу урок',
      videoLabel:
        'Виделка відламує шматочок безглютенового Наполеона, видно шари',
      dialog: {
        title: 'Наполеон без глютену',
        description:
          'Залиш email — і раніше за всіх отримаєш лист про запуск уроку. А поки надсилатиму один перевірений рецепт без глютену раз на 1–2 тижні.',
        note: 'Це підписка на розсилку Bake Again. Відписатися можна будь-коли одним кліком у листі.',
      },
      close: 'Закрити',
      later: 'Не зараз',
    },
    en: {
      eyebrow: 'Video lesson · December',
      title: 'New Year’s without a Napoleon cake?',
      titleAccent: 'Not this year.',
      description:
        'I’ll show you everything in my video lesson “Gluten-Free Napoleon Cake” — in time for New Year’s. Leave your email and be the first to hear when it launches.',
      action: 'I want the lesson',
      videoLabel:
        'A fork breaks off a piece of gluten-free Napoleon cake, showing the layers',
      dialog: {
        title: 'Gluten-Free Napoleon Cake',
        description:
          'Leave your email and be the first to hear when the lesson launches. Until then, I’ll send you one tested gluten-free recipe every 1–2 weeks.',
        note: 'This is a subscription to the Bake Again newsletter. You can unsubscribe at any time with one click in any email.',
      },
      close: 'Close',
      later: 'Not now',
    },
    es: {
      eyebrow: 'Videoclase · diciembre',
      title: '¿Nochevieja sin tarta milhojas?',
      titleAccent: 'Este año no.',
      description:
        'Te lo enseño todo en mi videoclase «Tarta milhojas sin gluten», a tiempo para Nochevieja. Deja tu correo y serás de los primeros en saber cuándo sale.',
      action: 'Quiero la clase',
      videoLabel:
        'Un tenedor corta un trozo de tarta milhojas sin gluten y se ven las capas',
      dialog: {
        title: 'Tarta milhojas sin gluten',
        description:
          'Deja tu correo y serás de los primeros en saber cuándo sale la clase. Mientras tanto, te enviaré una receta sin gluten probada cada 1–2 semanas.',
        note: 'Es una suscripción al boletín de Bake Again. Puedes darte de baja cuando quieras con un clic en cualquier correo.',
      },
      close: 'Cerrar',
      later: 'Ahora no',
    },
  } satisfies Record<AppLocale, BannerCopy>,
  /**
   * Recipe-specific hooks; the recipe the lesson teaches gets its own.
   * ES calls the cake «tarta milhojas» here; the recipe page keeps its own name
   * until the author renames it there.
   */
  overrides: {
    'gluten-free-napoleon': {
      uk: {
        title:
          'Рецепт — нижче. А у відеоуроці я покажу те, що не передаси словами',
        description:
          'Яким тісто має бути на дотик і як розкачати корж, щоб він не зламався. Залиш email — і раніше за всіх отримаєш лист про запуск.',
      },
      en: {
        title:
          'The recipe is below. In the video lesson I’ll show you what words can’t',
        description:
          'How the dough should feel and how to roll out each layer without it breaking. Leave your email and be the first to hear when it launches.',
      },
      es: {
        title:
          'La receta está abajo. En la videoclase te enseño lo que no se explica con palabras',
        description:
          'Qué textura debe tener la masa y cómo estirar cada capa sin que se rompa. Deja tu correo y serás de los primeros en saber cuándo sale.',
      },
    },
  } satisfies Record<string, Record<AppLocale, HookCopy>>,
};

/** Copy for one recipe page, without the date check (Design Lab uses this). */
export function resolveProductBanner(
  recipeId: string,
  locale: AppLocale,
): ProductBanner {
  const { videoLabel, ...copy } = productBanner.copy[locale];
  const override: HookCopy | undefined =
    productBanner.overrides[recipeId as keyof typeof productBanner.overrides]?.[
      locale
    ];
  return {
    ...copy,
    ...(override && { titleAccent: undefined, ...override }),
    id: productBanner.id,
    locale,
    video: { ...productBanner.video, label: videoLabel },
  };
}

export function activeProductBanner(
  recipeId: string,
  locale: AppLocale,
  now = new Date(),
) {
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Kyiv',
  }).format(now);
  if (!productBanner.active || today > productBanner.showUntil) return null;
  return resolveProductBanner(recipeId, locale);
}
