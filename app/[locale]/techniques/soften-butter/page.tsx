import { pageMetadata } from '@/lib/seo/metadata';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';
import { Eyebrow } from '@/components/foundations/eyebrow';
import { TechniqueGuide } from '@/components/techniques/technique-guide';
import {
  softenButter,
  softenButterPath,
} from '@/content/techniques/soften-butter';
import { getRecipeCatalog } from '@/content/recipes/catalog';
import { getRecipeContent } from '@/content/recipes/registry';
import { isAppLocale } from '@/lib/i18n/config';
import { getLocalizedRecipePath, localeHomePath } from '@/lib/i18n/routes';
import styles from '@/components/techniques/technique.module.css';

type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isAppLocale(locale)) return {};
  return pageMetadata({
    title: `${softenButter[locale].title} — Bake Again`,
    description: softenButter[locale].intro,
    locale,
    path: softenButterPath(locale),
  });
}

export default async function SoftenButterPage({ params }: Props) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  const t = softenButter[locale];
  const related = getRecipeCatalog(locale).filter((recipe) =>
    getRecipeContent(recipe.id, locale)?.steps.some(
      (step) => step.technique?.id === 'soften-butter',
    ),
  );
  return (
    <main>
      <SiteHeader locale={locale} pathname={softenButterPath(locale)} />
      <article className={styles.page}>
        <a href={localeHomePath(locale)}>{t.back}</a>
        <Eyebrow>{t.category}</Eyebrow>
        <h1 id="technique-title" tabIndex={-1}>
          {t.title}
        </h1>
        <p className={styles.intro}>{t.intro}</p>
        <TechniqueGuide locale={locale} />
        {related.length > 0 && (
          <section>
            <h2>{t.related}</h2>
            <ul>
              {related.map((recipe) => (
                <li key={recipe.id}>
                  <a href={getLocalizedRecipePath(recipe.id, locale)!}>
                    {recipe.title}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
      <SiteFooter locale={locale} />
    </main>
  );
}
