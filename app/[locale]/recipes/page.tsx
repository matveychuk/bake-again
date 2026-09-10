/* oxlint-disable next/no-html-link-for-pages -- vinext preview currently fails when next/link is hydrated */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Eyebrow } from '@/components/foundations/eyebrow';
import { RecipeCard } from '@/components/recipe/recipe-card';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { getRecipeCatalog } from '@/content/recipes/catalog';
import { isAppLocale, localeMetadata, supportedLocales } from '@/lib/i18n/config';
import { getUiMessages } from '@/lib/i18n/messages';
import { formatRecipeCount } from '@/lib/i18n/format';
import { getPreviewRobots, isUiLocalePublishable } from '@/lib/i18n/publication';
import { getLocalizedRecipePath, localeRecipesPath } from '@/lib/i18n/routes';
import styles from '@/app/recipes/recipes.module.css';

type LocalizedRecipesPageProps = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocalizedRecipesPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isAppLocale(localeParam)) return {};

  const messages = getUiMessages(localeParam).metadata.recipes;
  const isPublishable = isUiLocalePublishable(localeParam);
  return {
    title: messages.title,
    description: messages.description,
    robots: getPreviewRobots(isPublishable),
    ...(isPublishable && {
      alternates: {
        canonical: localeRecipesPath(localeParam),
        languages: Object.fromEntries(
          supportedLocales
            .filter(isUiLocalePublishable)
            .map((locale) => [localeMetadata[locale].bcp47, localeRecipesPath(locale)]),
        ),
      },
    }),
  };
}

export default async function LocalizedRecipesPage({ params }: LocalizedRecipesPageProps) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();

  const recipesPath = localeRecipesPath(locale);
  const messages = getUiMessages(locale).catalog;
  const recipeCatalog = getRecipeCatalog(locale);
  return (
    <main className={styles.page}>
      <SiteHeader locale={locale} pathname={recipesPath} />
      <section className={styles.intro} aria-labelledby="recipes-page-title">
        <Eyebrow>{messages.eyebrow}</Eyebrow>
        <h1 id="recipes-page-title">{messages.title[0]}<br /><em>{messages.title[1]}</em></h1>
        <p className={styles.introText}>{messages.intro}</p>
      </section>
      <section className={styles.catalog} aria-labelledby="catalog-title">
        <div className={styles.catalogHeader}>
          <div><Eyebrow>{messages.collectionEyebrow}</Eyebrow><h2 id="catalog-title">{messages.allRecipes}</h2></div>
          <span>{formatRecipeCount(locale, recipeCatalog.length)}</span>
        </div>
        <div className={styles.grid}>
          {recipeCatalog.map((recipe) => (
            <RecipeCard
              recipe={{
                ...recipe,
                locale,
                href: getLocalizedRecipePath(recipe.id, locale) ?? `${recipesPath}/${recipe.href.split('/').at(-1)}`,
              }}
              key={recipe.id}
            />
          ))}
        </div>
      </section>
      <SiteFooter locale={locale} />
    </main>
  );
}
