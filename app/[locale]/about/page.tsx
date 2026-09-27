import { pageMetadata } from '@/lib/seo/metadata';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AboutPage } from '@/app/_components/about/about-page';
import { aboutPageContent } from '@/content/about';
import { isAppLocale, supportedLocales } from '@/lib/i18n/config';
import { localeAboutPath } from '@/lib/i18n/routes';

type AboutRouteProps = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: AboutRouteProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isAppLocale(locale)) return {};
  return pageMetadata({
    ...aboutPageContent[locale].metadata,
    locale: locale,
    path: localeAboutPath(locale),
  });
}

export default async function AboutRoute({ params }: AboutRouteProps) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  return <AboutPage locale={locale} />;
}
