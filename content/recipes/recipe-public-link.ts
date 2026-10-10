import type { AppLocale } from '../../lib/i18n/config.ts';
import { getLocalizedRecipePath } from '../../lib/i18n/routes.ts';
import { siteOrigin } from '../../lib/seo/site.ts';
import type { SourceRecipeConfiguration } from './source-recipe-configuration.ts';

/** Accept resolved recipe state, never the browser's arbitrary query or fragment. */
export function recipePublicLink(
  recipeId: string,
  locale: AppLocale,
  configuration: SourceRecipeConfiguration,
  selectedCreamId?: string | null,
) {
  const path = getLocalizedRecipePath(recipeId, locale);
  if (!path || configuration.kind === 'invalid') return null;
  const params = new URLSearchParams();
  if (selectedCreamId) params.set('cream', selectedCreamId);
  if (configuration.mode === 'ingredient') {
    params.set('mode', 'ingredient');
    params.set('ingredient', configuration.ingredientId);
    params.set('amount', String(configuration.availableAmount));
    params.set('unit', configuration.unit);
  } else if (configuration.kind === 'adjusted') {
    params.set('mode', 'scale');
    params.set('scale', String(configuration.scaleFactor));
  }
  const search = params.toString();
  const href = `${path}${search ? `?${search}` : ''}`;
  params.set('view', 'print');
  return { href, url: `${siteOrigin}${href}`, printHref: `${path}?${params}` };
}
