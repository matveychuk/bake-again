import { napoleonLesson, napoleonLessonDuration } from './lessons/napoleon.ts';
import {
  videoLessons,
  canBuyVideoLesson,
  formatVideoLessonPrice,
  napoleonCheckoutPath,
} from './video-lessons.ts';
import type { AppLocale } from '../../lib/i18n/config.ts';

type BannerCopy = {
  eyebrow: string;
  title: string;
  description: string;
  recipeDescription: string;
  stepsLabel: string;
  vatLabel: string;
  buy: string;
  details: string;
  preview: string;
  videoLabel: string;
};

export type ProductBanner = Pick<
  BannerCopy,
  'eyebrow' | 'title' | 'description'
> & {
  id: string;
  locale: AppLocale;
  facts: string;
  actions: {
    buy: { label: string; href: string };
    details: { label: string; href: string };
    preview: { label: string; href: string };
  };
  video: { mp4: string; poster: string; label: string };
};

const media = '/media/recipes/gluten-free-napoleon/lesson-banner-2026-10-31';

/** The single current product promoted at the top of recipe pages. */
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
      eyebrow: 'Відеоурок українською',
      title: 'Наполеон без глютену',
      description:
        'Від тіста до першого шматка. Покажу, як розкачати тонкі коржі й зварити заварний крем.',
      recipeDescription:
        'Покажу, яким має бути тісто на дотик і як розкачати тонкий корж, щоб він не порвався.',
      stepsLabel: 'кроків',
      vatLabel: 'з ПДВ',
      buy: 'Купити урок',
      details: 'Детальніше',
      preview: 'Безплатний фрагмент',
      videoLabel:
        'Виделка відламує шматочок безглютенового Наполеона, видно шари',
    },
    en: {
      eyebrow: 'Video lesson in Ukrainian',
      title: 'Gluten-free Napoleon cake',
      description:
        'From dough to the first slice. See how to roll thin layers and make the custard.',
      recipeDescription:
        'See how the dough should feel and how to roll each thin layer without tearing it.',
      stepsLabel: 'steps',
      vatLabel: 'incl. VAT',
      buy: 'Buy the lesson',
      details: 'Lesson details',
      preview: 'Watch a free step',
      videoLabel:
        'A fork breaks off a piece of gluten-free Napoleon cake, showing the layers',
    },
    es: {
      eyebrow: 'Videoclase en ucraniano',
      title: 'Tarta milhojas sin gluten',
      description:
        'De la masa al primer bocado. Aprende a estirar las capas finas y a preparar la crema pastelera.',
      recipeDescription:
        'Mira qué textura debe tener la masa y cómo estirar cada capa fina sin que se rompa.',
      stepsLabel: 'pasos',
      vatLabel: 'IVA incluido',
      buy: 'Comprar la clase',
      details: 'Más detalles',
      preview: 'Ver un paso gratis',
      videoLabel:
        'Un tenedor corta un trozo de tarta milhojas sin gluten y se ven las capas',
    },
  } satisfies Record<AppLocale, BannerCopy>,
};

/** Resolve the available offer without the date check for Design Lab. */
export function resolveProductBanner(
  recipeId: string,
  locale: AppLocale,
): ProductBanner | null {
  const offer = videoLessons.find(
    (lesson) => lesson.id === napoleonLesson.lessonId,
  );
  if (!offer || !canBuyVideoLesson(offer)) return null;

  const copy = productBanner.copy[locale];
  const price = formatVideoLessonPrice(offer, locale);
  return {
    id: productBanner.id,
    locale,
    eyebrow: copy.eyebrow,
    title: copy.title,
    description:
      recipeId === offer.recipeId ? copy.recipeDescription : copy.description,
    facts: `${napoleonLesson.steps.length} ${copy.stepsLabel} · ${napoleonLessonDuration} · ${price} ${copy.vatLabel}`,
    actions: {
      buy: { label: copy.buy, href: napoleonCheckoutPath },
      details: { label: copy.details, href: offer.deliveryUrl },
      preview: {
        label: copy.preview,
        href: `${offer.deliveryUrl}#${napoleonLesson.freePreview.stepId}`,
      },
    },
    video: { ...productBanner.video, label: copy.videoLabel },
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
