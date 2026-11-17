import { activeProductBanner } from '@/content/commerce/product-banner';
import type { AppLocale } from '@/lib/i18n/config';
import { ProductBannerInvitation } from './product-banner-invitation';

/** The current product in the recipe page's locale. */
export function ProductBanner({
  recipeId,
  locale,
  className,
}: {
  recipeId: string;
  locale: AppLocale;
  className?: string;
}) {
  const banner = activeProductBanner(recipeId, locale);
  return banner ? (
    <ProductBannerInvitation
      banner={banner}
      recipeId={recipeId}
      compact
      className={className}
    />
  ) : null;
}
