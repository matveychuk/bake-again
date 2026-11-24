import type { AppLocale } from '@/lib/i18n/config';
import { newsletterSignupConfig } from '@/lib/newsletter/config';
import {
  communityBindings,
  communityConfig,
} from '@/lib/community/server/runtime';
import { getRecipePublicationStatus } from '@/content/recipes/publication';
import { isReusableComponentRecipeId } from '@/content/recipes/recipe-component-records';
import { GuestReviewForm } from './guest-review-form';
import { RecipeReviewsSection } from './recipe-reviews-section';

async function reviewFormConfig(locale: AppLocale) {
  const bindings = await communityBindings();
  const config = communityConfig(bindings);
  if (!config) return null;
  return {
    challengeSiteKey: config.turnstileSiteKey,
    signup: newsletterSignupConfig(bindings, locale) ?? undefined,
  };
}

/** Render only the form after cooking. Local previews can inspect its unavailable state. */
export async function cookCompletionReview(
  recipeId: string,
  locale: AppLocale,
) {
  if (
    getRecipePublicationStatus(recipeId) !== 'published' ||
    isReusableComponentRecipeId(recipeId)
  )
    return null;
  const config = await reviewFormConfig(locale);
  if (!config && process.env.NODE_ENV !== 'development') return null;
  return (
    <GuestReviewForm
      {...config}
      recipeId={recipeId}
      locale={locale}
      layout="cook-completion"
      headingLevel="h2"
    />
  );
}

/** Renders nothing until reviews are configured for this deployment. */
export async function RecipeReviews({
  recipeId,
  locale,
}: {
  recipeId: string;
  locale: AppLocale;
}) {
  const config = await reviewFormConfig(locale);
  if (!config) return null;
  return (
    <RecipeReviewsSection recipeId={recipeId} locale={locale} {...config} />
  );
}
