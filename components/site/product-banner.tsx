import { activeProductBanner } from '@/content/commerce/product-banner';
import type { AppLocale } from '@/lib/i18n/config';
import { ProductBannerInvitation } from './product-banner-invitation';

/** The current product, in the page locale, at the top of a recipe page. */
export function ProductBanner({
  recipeId,
  locale,
}: {
  recipeId: string;
  locale: AppLocale;
}) {
  const banner = activeProductBanner(recipeId, locale);
  return banner ? (
    <ProductBannerInvitation banner={banner} recipeId={recipeId} />
  ) : null;
}
