/* oxlint-disable next/no-html-link-for-pages -- vinext preview currently fails when next/link is hydrated */
import Image from 'next/image';
import { ArrowLeft, Check, Clock3 } from 'lucide-react';
import { SectionTitle } from '@/components/foundations/section-title';
import { RecipeFacts } from '@/components/recipe/recipe-facts';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import type { InventoryRecipe } from '@/content/recipes/inventory';
import { getStructuredInventoryRecipe } from '@/content/recipes/structured-inventory';
import { InventoryRecipeAdjuster } from './inventory-recipe-adjuster';
import { RecipeIngredientChecklist } from './recipe-ingredient-checklist';
import styles from './inventory-recipe-detail.module.css';

export function InventoryRecipeDetail({ recipe }: { recipe: InventoryRecipe }) {
  const structured = getStructuredInventoryRecipe(recipe.id);
  const facts = [
    { label: 'Difficulty', value: recipe.difficulty ?? 'To confirm' },
    { label: 'Active time', value: recipe.activeTime ?? 'To confirm' },
    { label: 'Total time', value: recipe.totalTime ?? 'To confirm' },
    { label: 'Flour', value: recipe.flour },
  ];

  return (
    <main className={styles.page}>
      <SiteHeader homeHref="/" recipesHref="/recipes" />
      <div className={styles.breadcrumb}>
        <a href="/recipes"><ArrowLeft size={15} /> Recipes</a>
        <span>{recipe.category}</span>
      </div>
      <section className={styles.hero}>
        <div className={styles.heroImage}>
          <Image src={recipe.image} alt={recipe.imageAlt} fill priority sizes="(min-width: 900px) 48vw, 100vw" />
          <span className={styles.imageNote}>{recipe.imageKind === 'author-photo' ? 'Author photo · review pending' : 'Generated preview · approval pending'}</span>
        </div>
        <div className={styles.heroCopy}>
          <div className={styles.heroTopline}>
            <p>{recipe.category}</p>
            <span>Inventory draft</span>
          </div>
          <h1>{recipe.title}</h1>
          <p className={styles.sourceTitle}>{recipe.sourceTitle}</p>
          <p className={styles.summary}>{recipe.summary}</p>
          <div className={styles.tested}>
            <span><Check size={15} strokeWidth={2.5} /> {recipe.testingStatus}</span>
            <p>Recorded as a repeatedly made working recipe in the author’s inventory.</p>
          </div>
          <RecipeFacts items={facts} className={styles.facts} />
        </div>
      </section>

      {structured?.beforeStart && (
        <section className={styles.beforeStart} aria-labelledby="before-start-title">
          <SectionTitle eyebrow="Before you start" eyebrowClassName={styles.eyebrow} id="before-start-title">Plan for the rest.</SectionTitle>
          <div className={styles.planGrid}>
            {structured.beforeStart.map((item) => (
              <article key={item}><Clock3 size={19} /><div><strong>Keep this in mind</strong><p>{item}</p></div></article>
            ))}
          </div>
        </section>
      )}

      <InventoryRecipeAdjuster recipe={structured}>
        {({ amountFor }) => (
          <section className={styles.ingredientsArea} aria-labelledby="ingredients-title">
            <SectionTitle eyebrow="Exact tested base" eyebrowClassName={styles.eyebrow} id="ingredients-title">Ingredients</SectionTitle>
            <p className={styles.ingredientsIntro}>Tick items as you prepare them. Conditions and unresolved details stay visible.</p>
            <div className={styles.ingredientContent}>
              {structured ? <RecipeIngredientChecklist sections={structured.ingredientSections} amountFor={amountFor} /> : recipe.archiveSections.length > 0 ? (
                <div className={styles.sections}>{recipe.archiveSections.map((section) => (
                  <section className={styles.section} key={section.title}><h3>{section.title}</h3><pre>{section.content}</pre></section>
                ))}</div>
              ) : (
                <div className={styles.pending}><h3>Recipe details pending</h3><p>This working recipe is verified by the author, but its exact ingredients and method have not yet been transferred into the inventory.</p></div>
              )}
              {structured?.gapNote && <aside className={styles.gapNote}><strong>Source gap</strong><p>{structured.gapNote}</p></aside>}
            </div>
          </section>
        )}
      </InventoryRecipeAdjuster>

      {structured && (
        <section className={styles.method} aria-labelledby="method-title">
          <div className={styles.methodHeading}>
            <SectionTitle eyebrow={`Method · ${structured.steps.length} steps`} eyebrowClassName={styles.eyebrow} id="method-title">Make it step by step.</SectionTitle>
          </div>
          {structured.steps.length > 0 ? (
            <ol className={styles.steps}>
                        {structured.steps.map((step, index) => (
                          <li key={step.id}>
                            <span>{String(index + 1).padStart(2, '0')}</span>
                            <div>
                              {step.meta && <p className={styles.stepMeta}>{step.meta}</p>}
                              <h4>{step.title}</h4>
                              <p>{step.body}</p>
                              {step.checkpoint && <aside className={styles.checkpoint}><strong>Checkpoint</strong>{step.checkpoint}</aside>}
                              {step.tip && <aside className={styles.tip}><strong>Tip</strong>{step.tip}</aside>}
                            </div>
                          </li>
                        ))}
            </ol>
          ) : <div className={styles.pending}><h3>Method pending</h3><p>The source contains ingredients but no preparation method yet.</p></div>}
        </section>
      )}
      <aside className={styles.publication}><strong>Before publishing</strong><p>{recipe.needsBeforePublishing}</p></aside>
      <SiteFooter />
    </main>
  );
}
