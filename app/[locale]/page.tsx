import { pageMetadata } from '@/lib/seo/metadata';
import { websiteStructuredData } from '@/lib/seo/website';
import { serializeJsonLd } from '@/lib/seo/recipes';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HomePage } from '@/app/_components/home/home-page';
import { isAppLocale, supportedLocales } from '@/lib/i18n/config';
import { getUiMessages } from '@/lib/i18n/messages';
import { localeHomePath } from '@/lib/i18n/routes';
import { cleanRecipeQuery } from '@/content/recipes/search';
import { isRecipeCollectionId } from '@/content/recipes/collections';

type LocalePageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    collection?: string | string[];
    q?: string | string[];
  }>;
};

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LocalePageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isAppLocale(localeParam)) return {};

  return pageMetadata({
    ...getUiMessages(localeParam).metadata.home,
    locale: localeParam,
    path: localeHomePath(localeParam),
  });
}

export default async function LocalizedHomePage({
  params,
  searchParams,
}: LocalePageProps) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  const { collection, q } = await searchParams;
  const collectionId =
    typeof collection === 'string' && isRecipeCollectionId(collection)
      ? collection
      : null;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(websiteStructuredData(locale)),
        }}
      />
      <HomePage
        locale={locale}
        selectedCollectionId={collectionId}
        query={cleanRecipeQuery(q)}
      />
    </>
  );
}
