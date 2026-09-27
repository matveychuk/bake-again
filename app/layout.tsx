import type { Metadata } from 'next';
import { Literata, Manrope, Newsreader } from 'next/font/google';
import { headers } from 'next/headers';
import { SiteAnalytics } from '@/components/site/site-analytics';
import { defaultLocale, isAppLocale, localeMetadata } from '@/lib/i18n/config';
import { siteOrigin } from '@/lib/seo/site';
import './globals.css';

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin', 'cyrillic'],
});

const newsreader = Newsreader({
  variable: '--font-newsreader',
  subsets: ['latin'],
  style: ['normal', 'italic'],
});

const literata = Literata({
  variable: '--font-literata',
  subsets: ['cyrillic', 'latin'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: 'Bake Again — Перевірена безглютенова випічка',
  description:
    'Безглютенові рецепти з точними кількостями, покроковими інструкціями та зрозумілим статусом перевірки.',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml', sizes: 'any' }],
    shortcut: '/favicon.svg',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestHeaders = await headers();
  const requestLocale = requestHeaders.get('x-bake-again-locale');
  const locale = isAppLocale(requestLocale) ? requestLocale : defaultLocale;

  return (
    <html
      lang={localeMetadata[locale].bcp47}
      className={`${manrope.variable} ${newsreader.variable} ${literata.variable}`}
    >
      <body>
        <SiteAnalytics />
        {children}
        {process.env.NODE_ENV === 'development' && (
          <script
            src="https://mcp.figma.com/mcp/html-to-design/capture.js"
            async
          />
        )}
      </body>
    </html>
  );
}
