/* oxlint-disable next/no-html-link-for-pages -- vinext preview currently fails when next/link is hydrated */
import Image from 'next/image';
import { ArrowLeft, Clock3, Play } from 'lucide-react';
import { SectionTitle } from '@/components/foundations/section-title';
import { RecipeFacts } from '@/components/recipe/recipe-facts';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import type { InventoryRecipe } from '@/content/recipes/inventory';
import type { RecipeDraft } from '@/content/recipes/recipe.types';
import { getRecipeContent } from '@/content/recipes/registry';
import { catalogLocaleCopy } from '@/content/recipes/catalog-locales';
import { getUiMessages } from '@/lib/i18n/messages';
import { defaultLocale, type AppLocale } from '@/lib/i18n/config';
import { localeRecipesPath } from '@/lib/i18n/routes';
import { InventoryRecipeAdjuster } from './inventory-recipe-adjuster';
import { SaveRecipeControl } from './save-recipe-control';
import styles from './inventory-recipe-detail.module.css';

export function InventoryRecipeDetail({
  recipe,
  personalRecipe,
  locale = defaultLocale,
  pathname,
}: {
  recipe: InventoryRecipe;
  personalRecipe?: RecipeDraft | null;
  locale?: AppLocale;
  pathname?: string;
}) {
  const structured = getRecipeContent(recipe.id, locale);
  const messages = getUiMessages(locale).recipe;
  const copy = catalogLocaleCopy[recipe.id];
  const facts = [
    { label: messages.difficulty, value: recipe.difficulty ?? messages.toConfirm },
    { label: messages.activeTime, value: locale === 'en' ? recipe.activeTime ?? messages.toConfirm : messages.toConfirm },
    { label: messages.totalTime, value: locale === 'en' ? recipe.totalTime ?? messages.toConfirm : messages.toConfirm },
    { label: messages.flour, value: recipe.flour },
  ];
  const cookModePath = `${pathname ?? `/recipes/${recipe.slug}`}/cook`;

  return (
    <main className={styles.page}>
      <SiteHeader locale={locale} pathname={pathname} />
      <div className={styles.breadcrumb}>
        <a href={localeRecipesPath(locale)}><ArrowLeft size={15} /> {messages.backToRecipes}</a>
        <span>{copy?.category[locale] ?? recipe.category}</span>
      </div>
      <section className={styles.hero}>
        <div className={styles.heroImage}>
          <Image src={recipe.image} alt={copy?.alt[locale] ?? recipe.imageAlt} fill priority sizes="(min-width: 900px) 48vw, 100vw" />
          <span className={styles.imageNote}>{recipe.imageKind === 'author-photo' ? messages.authorPhotoPending : messages.generatedPreviewPending}</span>
        </div>
        <div className={styles.heroCopy}>
          <div className={styles.heroTopline}>
            <p>{copy?.category[locale] ?? recipe.category}</p>
            <div className={styles.heroActions}>
              <SaveRecipeControl locale={locale} recipeId={recipe.id} title={personalRecipe?.title[locale] ?? copy?.title[locale] ?? recipe.title} />
              <span>{messages.inventoryDraft}</span>
            </div>
          </div>
          <h1>{copy?.title[locale] ?? recipe.title}</h1>
          <p className={styles.sourceTitle}>{recipe.sourceTitle}</p>
          <p className={styles.summary}>{copy?.summary[locale] ?? recipe.summary}</p>
          <div className={styles.tested}>
            <span>{messages.workingRecord}</span>
            <p>{messages.workingRecordExplanation}</p>
          </div>
          <RecipeFacts items={facts} className={styles.facts} />
          <a href={cookModePath} className={styles.cookModeLink}><Play size={16} fill="currentColor" /> {messages.openCookMode}</a>
        </div>
      </section>

      {structured?.beforeStart && (
        <section className={styles.beforeStart} aria-labelledby="before-start-title">
          <SectionTitle eyebrow={messages.beforeStart} eyebrowClassName={styles.eyebrow} id="before-start-title">{messages.planAhead}</SectionTitle>
          <div className={styles.planGrid}>
            {structured.beforeStart.map((item) => (
              <article key={item}><Clock3 size={19} /><div><strong>{messages.keepInMind}</strong><p>{item}</p></div></article>
            ))}
          </div>
        </section>
      )}

      <section className={styles.ingredientsArea} aria-labelledby="ingredients-title">
        {locale === 'en' && <InventoryRecipeAdjuster recipe={structured ?? undefined} archiveSections={recipe.archiveSections} locale={locale} personalRecipe={personalRecipe} />}
      </section>

      {structured && (
        <section className={styles.method} aria-labelledby="method-title">
          <div className={styles.methodHeading}>
            <SectionTitle eyebrow={messages.method(structured.steps.length)} eyebrowClassName={styles.eyebrow} id="method-title">{messages.stepByStep}</SectionTitle>
            <a href={cookModePath} className={styles.cookModeLink}><Play size={16} fill="currentColor" /> {messages.openCookMode}</a>
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
          ) : <div className={styles.pending}><h3>{messages.methodPending}</h3><p>{structured.gapNote ?? messages.methodPendingDescription}</p></div>}
        </section>
      )}
      <aside className={styles.publication}><strong>{messages.beforePublishing}</strong><p>{locale === 'en' ? recipe.needsBeforePublishing : messages.translationPending}</p></aside>
      <SiteFooter locale={locale} />
    </main>
  );
}
