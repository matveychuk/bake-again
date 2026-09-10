import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HomePage } from '@/app/_components/home/home-page';
import { isAppLocale, localeMetadata, supportedLocales } from '@/lib/i18n/config';
import { getUiMessages } from '@/lib/i18n/messages';
import { getPreviewRobots, isUiLocalePublishable } from '@/lib/i18n/publication';
import { localeHomePath } from '@/lib/i18n/routes';

type LocalePageProps = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isAppLocale(localeParam)) return {};

  const messages = getUiMessages(localeParam).metadata.home;
  const isPublishable = isUiLocalePublishable(localeParam);
  return {
    title: messages.title,
    description: messages.description,
    robots: getPreviewRobots(isPublishable),
    ...(isPublishable && {
      alternates: {
        canonical: localeHomePath(localeParam),
        languages: Object.fromEntries(
          supportedLocales
            .filter(isUiLocalePublishable)
            .map((locale) => [localeMetadata[locale].bcp47, localeHomePath(locale)]),
        ),
      },
    }),
  };
}

export default async function LocalizedHomePage({ params }: LocalePageProps) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  return <HomePage locale={locale} />;
}
