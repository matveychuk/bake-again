import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AboutPage } from '@/app/_components/about/about-page';
import { aboutPageContent } from '@/content/about';
import { isAppLocale, localeMetadata, supportedLocales } from '@/lib/i18n/config';
import { getPreviewRobots, isUiLocalePublishable } from '@/lib/i18n/publication';
import { localeAboutPath } from '@/lib/i18n/routes';

type AboutRouteProps = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: AboutRouteProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isAppLocale(locale)) return {};
  const isPublishable = isUiLocalePublishable(locale);
  return {
    ...aboutPageContent[locale].metadata,
    robots: getPreviewRobots(isPublishable),
    ...(isPublishable && {
      alternates: {
        canonical: localeAboutPath(locale),
        languages: Object.fromEntries(
          supportedLocales
            .filter(isUiLocalePublishable)
            .map((candidate) => [localeMetadata[candidate].bcp47, localeAboutPath(candidate)]),
        ),
      },
    }),
  };
}

export default async function AboutRoute({ params }: AboutRouteProps) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  return <AboutPage locale={locale} />;
}
