import type { AppLocale } from '../i18n/config.ts';
import { absoluteUrl, siteName, siteOrigin } from './site.ts';

export function websiteStructuredData(locale: AppLocale) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': absoluteUrl('/#website'),
        name: siteName,
        url: absoluteUrl(`/${locale}`),
        inLanguage: locale,
        publisher: { '@id': absoluteUrl('/#organization') },
      },
      {
        '@type': 'Organization',
        '@id': absoluteUrl('/#organization'),
        name: siteName,
        url: siteOrigin,
        logo: {
          '@type': 'ImageObject',
          url: absoluteUrl('/images/brand/bake-again-logo.webp'),
          width: 256,
          height: 256,
        },
        sameAs: [
          'https://www.instagram.com/bakeagain.glutenfree/',
          'https://www.facebook.com/profile.php?id=61595228937672',
        ],
      },
    ],
  };
}
