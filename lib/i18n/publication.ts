import type {
  RecipeDraft,
  TranslationState,
} from '../../content/recipes/recipe.types.ts';
import type { AppLocale } from './config.ts';

/** Interface copy reviewed across all three locales, 2026-09-26. */
export const uiTranslationState: Record<AppLocale, TranslationState> = {
  en: 'reviewed',
  es: 'reviewed',
  uk: 'reviewed',
};

export function isUiLocalePublishable(locale: AppLocale): boolean {
  return uiTranslationState[locale] === 'reviewed';
}

export function isRecipeLocalePublishable(
  recipe: {
    publicationStatus: RecipeDraft['publicationStatus'];
    translationState?: RecipeDraft['translationState'];
  },
  locale: AppLocale,
): boolean {
  return (
    recipe.publicationStatus === 'published' &&
    recipe.translationState?.[locale] === 'reviewed'
  );
}

export function getPublishableRecipeLocales(recipe: {
  publicationStatus: RecipeDraft['publicationStatus'];
  translationState?: RecipeDraft['translationState'];
}): AppLocale[] {
  return (Object.keys(recipe.translationState ?? {}) as AppLocale[]).filter(
    (locale) => isRecipeLocalePublishable(recipe, locale),
  );
}

/** Draft routes remain available for editorial preview, but not for indexing. */
export function getPreviewRobots(isPublishable: boolean) {
  return isPublishable ? undefined : { index: false, follow: false };
}
