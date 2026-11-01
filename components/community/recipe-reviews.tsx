import type { AppLocale } from '@/lib/i18n/config';
import { newsletterSignupConfig } from '@/lib/newsletter/config';
import {
  communityBindings,
  communityConfig,
} from '@/lib/community/server/runtime';
import { RecipeReviewsSection } from './recipe-reviews-section';

/** Renders nothing until reviews are configured for this deployment. */
export async function RecipeReviews({
  recipeId,
  locale,
}: {
  recipeId: string;
  locale: AppLocale;
}) {
  const bindings = await communityBindings();
  const config = communityConfig(bindings);
  if (!config) return null;
  return (
    <RecipeReviewsSection
      recipeId={recipeId}
      locale={locale}
      challengeSiteKey={config.turnstileSiteKey}
      signup={newsletterSignupConfig(bindings, locale) ?? undefined}
    />
  );
}
