import { recipeDocuments } from '../../content/recipes/registry.ts';
import { supportedLocales } from '../i18n/config.ts';
import {
  isUiLocalePublishable,
  isRecipeLocalePublishable,
} from '../i18n/publication.ts';
import { getLocalizedRecipePath } from '../i18n/routes.ts';
import { absoluteUrl } from './site.ts';

const xmlEscape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
export function sitemapEntries() {
  const staticPages = ['', '/about', '/privacy', '/techniques/soften-butter'];
  const locales = supportedLocales.filter(isUiLocalePublishable);
  return [
    ...staticPages.flatMap((path) => {
      const alternatives = locales.map((locale) => ({
        locale,
        url: absoluteUrl(`/${locale}${path}`),
      }));
      return alternatives.map(({ url }) => ({ url, alternatives }));
    }),
    ...recipeDocuments.flatMap(({ recipe }) => {
      const alternatives = locales
        .filter((locale) => isRecipeLocalePublishable(recipe, locale))
        .map((locale) => ({
          locale,
          url: absoluteUrl(getLocalizedRecipePath(recipe.id, locale)!),
        }));
      return alternatives.map(({ url }) => ({ url, alternatives }));
    }),
  ];
}
export function sitemapXml() {
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
    sitemapEntries()
      .map(
        (entry) =>
          `<url><loc>${xmlEscape(entry.url)}</loc>${entry.alternatives
            .map(
              (alt) =>
                `<xhtml:link rel="alternate" hreflang="${alt.locale}" href="${xmlEscape(alt.url)}" />`,
            )
            .join('')}</url>`,
      )
      .join('\n') +
    '\n</urlset>'
  );
}
