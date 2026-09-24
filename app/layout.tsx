import type { Metadata } from 'next';
import { Literata, Manrope, Newsreader } from 'next/font/google';
import { headers } from 'next/headers';
import { SiteAnalytics } from '@/components/site/site-analytics';
import { defaultLocale, isAppLocale, localeMetadata } from '@/lib/i18n/config';
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
  title: 'Bake Again — Tested gluten-free baking',
  description:
    'An exploratory homepage for a small collection of carefully tested gluten-free recipes.',
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
