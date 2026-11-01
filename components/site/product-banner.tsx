import { activeProductBanner } from '@/content/commerce/product-banner';
import type { AppLocale } from '@/lib/i18n/config';
import { newsletterSignupConfig } from '@/lib/newsletter/config';
import { ProductBannerInvitation } from './product-banner-invitation';

/** The current product, in the page locale, at the top of a recipe page. */
export async function ProductBanner({
  recipeId,
  locale,
}: {
  recipeId: string;
  locale: AppLocale;
}) {
  const banner = activeProductBanner(recipeId, locale);
  if (!banner) return null;
  let bindings: Record<string, unknown>;
  try {
    const workers = await import('cloudflare:workers');
    bindings = workers.env as Record<string, unknown>;
  } catch {
    bindings = typeof process !== 'undefined' ? process.env : {};
  }
  return (
    <ProductBannerInvitation
      banner={banner}
      recipeId={recipeId}
      signup={newsletterSignupConfig(bindings, locale)}
    />
  );
}
