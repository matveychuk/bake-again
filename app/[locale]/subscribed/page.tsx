/* oxlint-disable next/no-html-link-for-pages -- vinext preview currently fails when next/link is hydrated */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowRight, CircleCheck } from 'lucide-react';
import { RecipeCard } from '@/components/recipe/recipe-card';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { newsletterConfirmedContent } from '@/content/newsletter-confirmed';
import { searchRecipes } from '@/content/recipes/search';
import { isAppLocale } from '@/lib/i18n/config';
import { getLocalizedRecipePath, localeHomePath } from '@/lib/i18n/routes';
import styles from './subscribed.module.css';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isAppLocale(locale)) return {};
  return {
    title: newsletterConfirmedContent[locale].metaTitle,
    robots: { index: false, follow: true },
    alternates: null,
  };
}

/** Brevo redirects here after the double opt-in link. Service page: not in sitemap. */
export default async function NewsletterConfirmedPage({ params }: Props) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  const copy = newsletterConfirmedContent[locale];
  const recipes = searchRecipes(locale, '', null, 'published').slice(0, 6);
  return (
    <>
      <main lang={locale}>
        <SiteHeader locale={locale} pathname={`/${locale}/subscribed`} />
        <section className={styles.hero} aria-labelledby="subscribed-title">
          <CircleCheck size={32} aria-hidden="true" className={styles.icon} />
          <div>
            <h1 id="subscribed-title" tabIndex={-1}>
              {copy.title}
            </h1>
            <p>{copy.body}</p>
            {copy.gift && <p>{copy.gift}</p>}
          </div>
        </section>
        <section
          className="recipes-section"
          id="recipes"
          aria-labelledby="subscribed-recipes-title"
        >
          <div className="section-heading">
            <h2 id="subscribed-recipes-title">{copy.recipesTitle}</h2>
            <a href={`${localeHomePath(locale)}#recipes`}>
              {copy.allRecipes} <ArrowRight aria-hidden="true" size={18} />
            </a>
          </div>
          <div className="recipe-grid recipe-grid--catalog-preview">
            {recipes.map((recipe) => (
              <RecipeCard
                recipe={{
                  ...recipe,
                  locale,
                  href: getLocalizedRecipePath(recipe.id, locale) ?? recipe.href,
                }}
                key={recipe.id}
              />
            ))}
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
