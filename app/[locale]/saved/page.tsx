import { canViewDrafts } from '@/lib/runtime/local-development.server';
import { getRecipeCatalog } from '@/content/recipes/catalog';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SavedRecipesPage } from '@/components/personal-state/saved-recipes-page';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { getUiMessages } from '@/lib/i18n/messages';
import { isAppLocale } from '@/lib/i18n/config';
import { localeSavedPath } from '@/lib/i18n/routes';

export default async function SavedRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  const pathname = localeSavedPath(locale);
  return (
    <main>
      <SiteHeader locale={locale} pathname={pathname} />
      <SavedRecipesPage
        locale={locale}
        recipeCatalog={getRecipeCatalog(
          locale,
          (await canViewDrafts()) ? 'all' : 'published',
        )}
      />
      <SiteFooter locale={locale} />
    </main>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isAppLocale(locale)) return {};
  return {
    ...getUiMessages(locale).metadata.saved,
    robots: { index: false, follow: true },
  };
}
