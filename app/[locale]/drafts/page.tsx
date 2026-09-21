import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';
import { RecipeSearchForm } from '@/components/recipe/recipe-search-form';
import { HomeRecipes } from '@/app/_components/home/home-recipes';
import { canViewDrafts } from '@/lib/runtime/local-development.server';
import { isAppLocale } from '@/lib/i18n/config';
import { getUiMessages } from '@/lib/i18n/messages';
import { localeDraftsPath } from '@/lib/i18n/routes';
import { cleanRecipeQuery } from '@/content/recipes/search';
import { isRecipeCollectionId } from '@/content/recipes/collections';

export const metadata = { robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function DraftsPage({ params, searchParams }: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string | string[]; collection?: string | string[] }>;
}) {
  const { locale } = await params;
  if (!isAppLocale(locale) || !await canViewDrafts()) notFound();
  const { q, collection } = await searchParams;
  const query = cleanRecipeQuery(q);
  const collectionId = typeof collection === 'string' && isRecipeCollectionId(collection) ? collection : null;
  const pathname = localeDraftsPath(locale);
  const messages = getUiMessages(locale);
  return <main>
    <SiteHeader locale={locale} pathname={pathname} />
    <section className="drafts-intro" aria-labelledby="drafts-title">
      <h1 id="drafts-title">{messages.navigation.drafts}</h1>
      <p>{messages.catalog.draftsIntro}</p>
      <RecipeSearchForm locale={locale} query={query} collectionId={collectionId} action={`${pathname}#recipes`} />
    </section>
    <HomeRecipes locale={locale} query={query} selectedCollectionId={collectionId} drafts />
    <SiteFooter locale={locale} />
  </main>;
}
