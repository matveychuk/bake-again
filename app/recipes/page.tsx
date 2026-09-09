/* oxlint-disable next/no-html-link-for-pages -- vinext preview currently fails when next/link is hydrated */
import type { Metadata } from 'next';
import { Eyebrow } from '@/components/foundations/eyebrow';
import { RecipeCard } from '@/components/recipe/recipe-card';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { recipeCatalog } from '@/content/recipes/catalog';
import styles from './recipes.module.css';

export const metadata: Metadata = {
  title: 'Recipes — Bake Again',
  description: 'The complete working Bake Again recipe inventory.',
};

export default function RecipesPage() {
  return (
    <main className={styles.page}>
      <SiteHeader homeHref="/" recipesHref="/recipes" />
      <section className={styles.intro} aria-labelledby="recipes-page-title">
        <Eyebrow>Working recipe inventory</Eyebrow>
        <h1 id="recipes-page-title">Recipes made to be<br /><em>baked again.</em></h1>
        <p className={styles.introText}>All currently known recipes are shown here, including drafts. Missing text, timing and photo approvals remain clearly marked.</p>
      </section>
      <section className={styles.catalog} aria-labelledby="catalog-title">
        <div className={styles.catalogHeader}>
          <div><Eyebrow>Current collection</Eyebrow><h2 id="catalog-title">All recipes</h2></div>
          <span>{recipeCatalog.length} recipes</span>
        </div>
        <div className={styles.grid}>
          {recipeCatalog.map((recipe) => <RecipeCard recipe={recipe} key={recipe.id} />)}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
