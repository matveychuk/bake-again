import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import type { AppLocale } from '@/lib/i18n/config';
import type { RecipeCollectionId } from '@/content/recipes/collections';
import { localeHomePath } from '@/lib/i18n/routes';
import { HomeDiscovery } from './home-discovery';
import { HomeHero } from './home-hero';
import { HomeRecipes } from './home-recipes';
import { HomeTrust } from './home-trust';
import { RecentRecipes } from '@/components/personal-state/recent-recipes';
import { getRecipeCatalog } from '@/content/recipes/catalog';
import { NewsletterSignup } from '@/components/site/newsletter-signup';

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
      <HomeHero
        locale={locale}
        query={query}
        selectedCollectionId={selectedCollectionId}
      />
      <HomeDiscovery locale={locale} query={query} />
      <HomeRecipes
        locale={locale}
        selectedCollectionId={selectedCollectionId}
        query={query}
      />
      {!query && !selectedCollectionId && (
        <RecentRecipes locale={locale} recipes={getRecipeCatalog(locale)} />
      )}
      <HomeTrust locale={locale} />
      <NewsletterSignup
        locale={locale}
        autoPrompt={!query && !selectedCollectionId}
      />
      <SiteFooter locale={locale} />
    </main>
  );
}
