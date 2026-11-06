import type { AppLocale } from '../../lib/i18n/config.ts';
import type { StructuredRecipeStep } from '../recipes/localized-recipe.types.ts';
import { napoleonLessonSteps } from './lessons/napoleon.ts';
import { getRecipeVideoLesson, type VideoLesson } from './video-lessons.ts';

export type RecipeLessonLink = {
  href: string;
  text: string;
  recipeId: string;
  lessonStepId: string;
  thumbnail?: string;
};

export function recipeLessonLink(
  recipeId: string,
  versionId: string,
  locale: AppLocale,
  step: Pick<StructuredRecipeStep, 'lessonLink' | 'lessonLinkText' | 'media'>,
  catalog?: readonly VideoLesson[],
): RecipeLessonLink | null {
  const lesson = getRecipeVideoLesson(recipeId, versionId, catalog);
  if (
    !step.lessonLink ||
    !step.lessonLinkText ||
    lesson?.status !== 'available' ||
    lesson.language !== locale ||
    lesson.id !== step.lessonLink.lessonId ||
    lesson.id !== 'napoleon-video' ||
    !napoleonLessonSteps.some((s) => s.stepId === step.lessonLink!.lessonStepId)
  )
    return null;
  return {
    href: `/${locale}/urok/napoleon#${step.lessonLink.lessonStepId}`,
    text: step.lessonLinkText,
    recipeId,
    lessonStepId: step.lessonLink.lessonStepId,
    thumbnail: step.media?.find((m) => m.type !== 'video')?.src,
  };
}
