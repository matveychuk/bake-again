import type { RecipeDraft, TranslationState } from '../../content/recipes/recipe.types.ts';
import type { AppLocale } from './config.ts';

/**
 * UI copy is released independently from recipe content. English remains the
 * current public UI while Spanish and Ukrainian interface copy is reviewed.
 */
export const uiTranslationState: Record<AppLocale, TranslationState> = {
  en: 'reviewed',
  es: 'draftTranslation',
  uk: 'draftTranslation',
};

export function isUiLocalePublishable(locale: AppLocale): boolean {
  return uiTranslationState[locale] === 'reviewed';
}

export function isRecipeLocalePublishable(
  recipe: Pick<RecipeDraft, 'publicationStatus' | 'translationState'>,
  locale: AppLocale,
): boolean {
  return recipe.publicationStatus === 'ready'
    && recipe.translationState[locale] === 'reviewed';
}

export function getPublishableRecipeLocales(
  recipe: Pick<RecipeDraft, 'publicationStatus' | 'translationState'>,
): AppLocale[] {
  return (Object.keys(recipe.translationState) as AppLocale[])
    .filter((locale) => isRecipeLocalePublishable(recipe, locale));
}

/** Draft routes remain available for editorial preview, but not for indexing. */
export function getPreviewRobots(isPublishable: boolean) {
  return isPublishable ? undefined : { index: false, follow: false };
}
