/* oxlint-disable next/no-html-link-for-pages -- vinext preview currently fails when next/link is hydrated */
import Image from 'next/image';
import { ArrowLeft, Clock3, Play } from 'lucide-react';
import { SectionTitle } from '@/components/foundations/section-title';
import { StepMediaSequence } from '@/components/recipe/step-media-sequence';
import { RecipeOverview } from '@/components/recipe/recipe-overview';
import { RecipeDetailTitle } from '@/components/recipe/recipe-detail-title';
import { RecipeStepContent } from '@/components/recipe/recipe-step-content';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import type { InventoryRecipe } from '@/content/recipes/inventory';
import type { RecipeDraft } from '@/content/recipes/recipe.types';
import { getRecipeContent } from '@/content/recipes/registry';
import {
  catalogLocaleCopy,
  recipeDetailTitles,
} from '@/content/recipes/catalog-locales';
import { getUiMessages } from '@/lib/i18n/messages';
import { defaultLocale, type AppLocale } from '@/lib/i18n/config';
import { localeHomePath } from '@/lib/i18n/routes';
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
  const detailTitle =
    recipeDetailTitles[recipe.id]?.[locale] ??
    copy?.title[locale] ??
    recipe.title;
  const cookModePath = `${pathname ?? `/recipes/${recipe.slug}`}/cook`;

  return (
    <main className={styles.page}>
      <SiteHeader locale={locale} pathname={pathname} />
      <div className={styles.breadcrumb}>
        <a href={`${localeHomePath(locale)}#recipes`}>
          <ArrowLeft size={15} /> {messages.backToRecipes}
        </a>
        <span>{copy?.category[locale] ?? recipe.category}</span>
      </div>
      <section className={styles.hero}>
        <div className={styles.heroImage}>
          <Image
            src={recipe.image}
            alt={copy?.alt[locale] ?? recipe.imageAlt}
            fill
            priority
            sizes="(min-width: 900px) 48vw, 100vw"
          />
          <span className={styles.imageNote}>
            {recipe.imageKind === 'author-photo'
              ? messages.authorPhotoPending
              : messages.generatedPreviewPending}
          </span>
        </div>
        <div className={styles.heroCopy}>
          <div className={styles.heroTopline}>
            <p>{copy?.category[locale] ?? recipe.category}</p>
            <div className={styles.heroActions}>
              <SaveRecipeControl
                locale={locale}
                recipeId={recipe.id}
                title={
                  personalRecipe?.title[locale] ??
                  copy?.title[locale] ??
                  recipe.title
                }
              />
              <span>{messages.inventoryDraft}</span>
            </div>
          </div>
          <RecipeDetailTitle locale={locale} title={detailTitle} />
          <p className={styles.summary}>
            {copy?.summary[locale] ?? recipe.summary}
          </p>
          <RecipeOverview content={structured} locale={locale} />
          <a href={cookModePath} className={styles.cookModeLink}>
            <Play size={16} fill="currentColor" /> {messages.openCookMode}
          </a>
        </div>
      </section>

      {structured?.beforeStart && (
        <section
          className={styles.beforeStart}
          aria-labelledby="before-start-title"
        >
          <SectionTitle
            eyebrow={messages.beforeStart}
            eyebrowClassName={styles.eyebrow}
            id="before-start-title"
          >
            {messages.planAhead}
          </SectionTitle>
          <div className={styles.planGrid}>
            {structured.beforeStart.map((item) => (
              <article key={item}>
                <Clock3 size={19} />
                <div>
                  <strong>{messages.keepInMind}</strong>
                  <p>{item}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section
        className={styles.ingredientsArea}
        aria-labelledby="ingredients-title"
      >
        <InventoryRecipeAdjuster
          archiveSections={recipe.archiveSections}
          locale={locale}
          personalRecipe={personalRecipe}
          scalingAnchorIngredientId={recipe.scalingAnchorIngredientId}
          sourceShoppingRecipe={
            structured
              ? {
                  id: recipe.id,
                  versionId: `${recipe.id}-source-v1`,
                  title: detailTitle,
                  ingredientSections: structured.ingredientSections,
                }
              : null
          }
          recipe={
            structured
              ? {
                  ...structured,
                  gapNote:
                    copy?.publicationNote?.[locale] ?? structured.gapNote,
                }
              : undefined
          }
        />
      </section>

      {structured && (
        <section className={styles.method} aria-labelledby="method-title">
          <div className={styles.methodHeading}>
            <SectionTitle
              eyebrow={messages.method(structured.steps.length)}
              eyebrowClassName={styles.eyebrow}
              id="method-title"
            >
              {messages.stepByStep}
            </SectionTitle>
            <a href={cookModePath} className={styles.cookModeLink}>
              <Play size={16} fill="currentColor" /> {messages.openCookMode}
            </a>
          </div>
          {structured.steps.length > 0 ? (
            <ol className={styles.steps}>
              {structured.steps.map((step, index) => (
                <li
                  className={step.media ? styles.stepWithMedia : undefined}
                  key={step.id}
                >
                  {step.meta && <p className={styles.stepMeta}>{step.meta}</p>}
                  <span className={styles.stepNumber}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <RecipeStepContent
                    checkpoint={step.checkpoint}
                    checkpointLabel={messages.checkpoint}
                    className={styles.stepContent}
                    headingLevel="h4"
                    tip={step.tip}
                    tipLabel={messages.tip}
                    title={step.title}
                  >
                    <p>{step.body}</p>
                  </RecipeStepContent>
                  {step.media && (
                    <StepMediaSequence
                      items={step.media}
                      ariaLabel={messages.stepVisualSequence}
                      className={styles.stepMedia}
                    />
                  )}
                </li>
              ))}
            </ol>
          ) : (
            <div className={styles.pending}>
              <h3>{messages.methodPending}</h3>
              <p>{structured.gapNote ?? messages.methodPendingDescription}</p>
            </div>
          )}
        </section>
      )}
      <aside className={styles.publication}>
        <strong>{messages.beforePublishing}</strong>
        <p>
          {copy?.publicationNote?.[locale] ??
            (locale === 'en'
              ? recipe.needsBeforePublishing
              : messages.translationPending)}
        </p>
      </aside>
      <SiteFooter locale={locale} />
    </main>
  );
}
