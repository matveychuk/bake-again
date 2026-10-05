import type { Metadata } from 'next';
import type { AppLocale } from '../i18n/config.ts';
import { supportedLocales } from '../i18n/config.ts';
import { isUiLocalePublishable } from '../i18n/publication.ts';
import { getLocalizedRecipePath } from '../i18n/routes.ts';
import { recipePresentation } from './recipes.ts';
import { absoluteUrl, siteName } from './site.ts';

export function pageMetadata({
  title,
  description,
  path,
  locale,
  locales = supportedLocales,
  indexable = true,
  image,
  imageAlt,
}: {
  title: string;
  description: string;
  path: string;
  locale: AppLocale;
  locales?: readonly AppLocale[];
  indexable?: boolean;
  image?: string;
  imageAlt?: string;
}): Metadata {
  const defaultShareImage = '/share-image-v4.webp';
  const defaultShareImageAlt: Record<AppLocale, string> = {
    uk: 'Наполеон із чашкою та чайником поруч із назвою Bake Again',
    en: 'Napoleon cake with a teacup and teapot beside the Bake Again name',
    es: 'Tarta Napoleón con taza y tetera junto al nombre Bake Again',
  };
  const ready = indexable && isUiLocalePublishable(locale);
  const languages = Object.fromEntries(
    locales
      .filter(isUiLocalePublishable)
      .map((language) => [
        language,
        absoluteUrl(path.replace(/^\/(uk|en|es)(?=\/|$)/, `/${language}`)),
      ]),
  );
  const shareImage = image ?? defaultShareImage;
  const images = [{
    url: absoluteUrl(shareImage),
    alt: imageAlt ?? (image ? title : defaultShareImageAlt[locale]),
    ...(!image && { width: 1200, height: 630, type: 'image/webp' }),
  }];
  return {
    title,
    description,
    robots: ready
      ? { index: true, follow: true }
      : { index: false, follow: false },
    ...(ready && { alternates: { canonical: absoluteUrl(path), languages } }),
    openGraph: {
      type: 'website',
      title,
      description,
      siteName,
      locale: { uk: 'uk_UA', en: 'en_GB', es: 'es_ES' }[locale],
      url: absoluteUrl(path),
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absoluteUrl(shareImage)],
    },
  };
}

export function recipeMetadata(id: string, locale: AppLocale): Metadata {
  const page = recipePresentation(id, locale);
  if (!page) return { robots: { index: false, follow: false } };
  const metadata = pageMetadata({
    title: `${page.seoTitle} — ${siteName}`,
    description: page.seoDescription,
    path: page.path,
    locale,
    locales: page.locales,
    indexable: page.indexable,
    image: page.image,
    imageAlt: page.alt,
  });
  if (page.indexable && isUiLocalePublishable(locale))
    metadata.alternates = {
      canonical: absoluteUrl(page.path),
      languages: Object.fromEntries(
        page.locales
          .filter(isUiLocalePublishable)
          .map((language) => [
            language,
            absoluteUrl(getLocalizedRecipePath(id, language)!),
          ]),
      ),
    };
  return metadata;
}
