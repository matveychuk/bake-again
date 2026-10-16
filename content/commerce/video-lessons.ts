import type { AppLocale } from '../../lib/i18n/config.ts';

type LessonIdentity = {
  id: string;
  recipeId: string;
  recipeVersionId: string;
  language: AppLocale;
};
export type VideoLesson = LessonIdentity &
  (
    | { status: 'planned' | 'withdrawn' }
    | {
        status: 'available';
        payhipUrl: string;
        priceMinor: number;
        currency: 'EUR' | 'USD' | 'GBP' | 'UAH';
      }
  );

/** No real product is on sale yet. Activate only after the delivery review in README.md. */
export const videoLessons: readonly VideoLesson[] = [
  {
    id: 'napoleon-video',
    recipeId: 'gluten-free-napoleon',
    recipeVersionId: 'gluten-free-napoleon-v4',
    language: 'uk',
    status: 'planned',
  },
];

/** Exact hosted product links only; the two existing free delivery trials are never a paid CTA. */
export function isPayhipLessonUrl(value: string): boolean {
  return (
    /^https:\/\/payhip\.com\/b\/[A-Za-z0-9]+$/.test(value) &&
    !['https://payhip.com/b/vAZlB', 'https://payhip.com/b/upKrI'].includes(
      value,
    )
  );
}

export function canBuyVideoLesson(
  lesson: VideoLesson,
): lesson is Extract<VideoLesson, { status: 'available' }> {
  return (
    lesson.status === 'available' &&
    isPayhipLessonUrl(lesson.payhipUrl) &&
    Number.isSafeInteger(lesson.priceMinor) &&
    lesson.priceMinor > 0 &&
    ['EUR', 'USD', 'GBP', 'UAH'].includes(lesson.currency)
  );
}

export function getRecipeVideoLesson(
  recipeId: string,
  recipeVersionId: string,
  catalog: readonly VideoLesson[] = videoLessons,
): VideoLesson | null {
  const lesson = catalog.find(
    (item) =>
      item.recipeId === recipeId && item.recipeVersionId === recipeVersionId,
  );
  if (!lesson || lesson.status === 'withdrawn') return null;
  // Invalid publication data fails closed: neither an offer nor a misleading "coming soon" claim.
  if (lesson.status === 'available' && !canBuyVideoLesson(lesson)) return null;
  return lesson;
}
