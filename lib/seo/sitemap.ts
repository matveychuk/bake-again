import { recipeLastModified } from '../../content/recipes/search-metadata.ts';
import { recipeDocuments } from '../../content/recipes/registry.ts';
import { publicPageMetadata } from '../../content/page-metadata.ts';
import { publishedTechniques } from '../../content/techniques/registry.ts';
import { supportedLocales } from '../i18n/config.ts';
import {
  isUiLocalePublishable,
  isRecipeLocalePublishable,
} from '../i18n/publication.ts';
import { getLocalizedRecipePath } from '../i18n/routes.ts';
import { absoluteUrl } from './site.ts';

const xmlEscape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

function withDefaultLanguage(alternatives: { locale: string; url: string }[]) {
  const english = alternatives.find(
    (alternative) => alternative.locale === 'en',
  );
  return english
    ? [...alternatives, { locale: 'x-default', url: english.url }]
    : alternatives;
}

export function sitemapEntries() {
  const locales = supportedLocales.filter(isUiLocalePublishable);
  return [
    ...[...publicPageMetadata, ...publishedTechniques].flatMap(
      ({ path, dateModified }) => {
        const alternatives = locales.map((locale) => ({
          locale,
          url: absoluteUrl(`/${locale}${path}`),
        }));
        return alternatives.map(({ url }) => ({
          url,
          lastmod: dateModified as string | null,
          alternatives: withDefaultLanguage(alternatives),
        }));
      },
    ),
    ...recipeDocuments.flatMap(({ recipe }) => {
      const alternatives = locales
        .filter((locale) => isRecipeLocalePublishable(recipe, locale))
        .map((locale) => ({
          locale,
          url: absoluteUrl(getLocalizedRecipePath(recipe.id, locale)!),
        }));
      return alternatives.map(({ url }) => ({
        url,
        lastmod: recipeLastModified(recipe),
        alternatives: withDefaultLanguage(alternatives),
      }));
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
          `<url><loc>${xmlEscape(entry.url)}</loc>${entry.lastmod ? `<lastmod>${xmlEscape(entry.lastmod)}</lastmod>` : ''}${entry.alternatives
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
