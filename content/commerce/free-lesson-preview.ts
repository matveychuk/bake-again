import type { AppLocale } from '../../lib/i18n/config.ts';
import { napoleonLesson } from './lessons/napoleon.ts';
export const freeLessonCopy = {
  uk: {
    title: 'Якими мають вийти коржі',
    caption: 'Безкоштовний крок відеоуроку «Наполеон без глютену» · 0:24',
    link: 'Увесь урок — 13 кроків від тіста до розрізу →',
    pending: 'Очікуємо відео кроку «Готові коржі». Блок вимкнено на сайті.',
  },
  en: {
    title: 'How the layers should turn out',
    caption: 'Free step from the “Gluten-free Napoleon” video lesson · 0:24',
    link: 'The whole lesson — 13 steps from dough to the first slice →',
    pending:
      'Awaiting the baked layers video. This block is disabled on the site.',
  },
  es: {
    title: 'Cómo deben quedar las láminas',
    caption: 'Paso gratuito de la videoclase «Napoleón sin gluten» · 0:24',
    link: 'La videoclase completa: 13 pasos, de la masa al primer corte →',
    pending:
      'Pendiente del vídeo de las láminas listas. Este bloque está desactivado en la web.',
  },
};
export function getFreeLessonPreview(
  recipeId: string,
  locale: AppLocale,
  preview = false,
  manifest = napoleonLesson,
) {
  if (
    recipeId !== manifest.recipeId ||
    (!manifest.freePreview.enabled && !preview)
  )
    return null;
  const media = manifest.freePreview.videos[locale];
  if (
    !media?.public ||
    !media.wide ||
    !media.vertical ||
    !media.poster ||
    !media.uploadDate
  )
    return null;
  return {
    ...media,
    stepId: manifest.freePreview.stepId,
    durationSec: manifest.freePreview.durationSec,
  };
}
