import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import type { AppLocale } from '@/lib/i18n/config';
import type { RecipeCollectionId } from '@/content/recipes/collections';
import { localeHomePath } from '@/lib/i18n/routes';
import { HomeDiscovery } from './home-discovery';
import { HomeHero } from './home-hero';
import { HomeRecipes } from './home-recipes';
import { HomeTrust } from './home-trust';

export function HomePage({
  locale,
  selectedCollectionId,
  query = '',
}: {
  locale: AppLocale;
  query?: string;
  selectedCollectionId?: RecipeCollectionId | null;
}) {
  const homePath = localeHomePath(locale);

  return (
    <main>
      <SiteHeader locale={locale} pathname={homePath} />
      <HomeHero locale={locale} query={query} selectedCollectionId={selectedCollectionId} />
      <HomeDiscovery locale={locale} query={query} />
      <HomeRecipes locale={locale} selectedCollectionId={selectedCollectionId} query={query} />
      <HomeTrust locale={locale} />
      <SiteFooter locale={locale} />
    </main>
  );
}
