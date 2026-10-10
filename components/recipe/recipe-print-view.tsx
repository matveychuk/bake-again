import type { StructuredRecipeContent } from '@/content/recipes/source-recipe.types';
import { recipeUtilityCopy } from '@/content/recipes/utility-copy';
import { recipeReaderCopy } from '@/content/recipes/reader-copy';
import type { AppLocale } from '@/lib/i18n/config';
import { formatNumber } from '@/lib/i18n/format';
import { getUiMessages } from '@/lib/i18n/messages';
import { Button } from '@/components/ui/button';
import { RecipeOverview } from './recipe-overview';
import { RecipeIngredientChecklist } from './recipe-ingredient-checklist';
import { RecipeStepContent } from './recipe-step-content';
import { RecipePrintButton } from './recipe-utility-actions';
import {
  softenButter,
  softenButterPath,
} from '@/content/techniques/soften-butter';
import styles from './recipe-print-view.module.css';

/** Receives the same resolved/scaled content as recipe detail, with no personal state. */
export function RecipePrintView({
  content,
  locale,
  title,
  href,
  url,
  version,
  factor,
  creamTitle,
  needsCream,
}: {
  content: StructuredRecipeContent;
  locale: AppLocale;
  title: string;
  href: string;
  url: string;
  version: string;
  factor: number;
  creamTitle?: string;
  needsCream: boolean;
}) {
  const copy = recipeUtilityCopy[locale];
  const messages = getUiMessages(locale).recipe;
  const techniqueCopy = softenButter[locale];
  const fractionalEggs = content.ingredientSections.some((section) =>
    section.ingredients.some((ingredient) => {
      const quantity = ingredient.quantity.base;
      return (
        (ingredient.id === 'eggs' || ingredient.id.endsWith('-eggs')) &&
        quantity?.kind === 'exact' &&
        Math.abs(quantity.value - Math.round(quantity.value)) > 0.000001
      );
    }),
  );
  return (
    <main className={styles.page} lang={locale} data-recipe-print>
      <div className={styles.toolbar}>
        <Button variant="outline" href={href}>
          {copy.back}
        </Button>
        <RecipePrintButton locale={locale} />
        <p>{copy.printHint}</p>
      </div>
      <article className={styles.recipe}>
        <header>
          <p className={styles.brand}>Bake Again</p>
          <h1>{title}</h1>
          <p>
            {copy.batch}: ×{formatNumber(locale, factor)}
          </p>
          {content.geometry && <p>{content.geometry.label}</p>}
          {creamTitle && (
            <p>
              {copy.cream}: {creamTitle}
            </p>
          )}
          {needsCream && <p className={styles.notice}>{copy.needsCream}</p>}
          <RecipeOverview
            content={content}
            locale={locale}
            showWorkingRecord={false}
            expandEvidence
          />
        </header>
        {content.beforeStart?.length ? (
          <section>
            <h2>{messages.beforeStart}</h2>
            <ul>
              {content.beforeStart.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ) : null}
        <section>
          <h2>{messages.ingredients}</h2>
          <RecipeIngredientChecklist
            sections={content.ingredientSections}
            locale={locale}
          />
          {fractionalEggs && <p>{recipeReaderCopy[locale].fractionalEggs}</p>}
        </section>
        <section>
          <h2>{recipeReaderCopy[locale].method}</h2>
          <ol className={styles.steps}>
            {content.steps.map((step, index) => (
              <li key={step.id}>
                <RecipeStepContent
                  title={step.title}
                  stepNumber={String(index + 1)}
                  meta={step.meta}
                  tip={step.tip}
                  tipLabel={messages.tip}
                  checkpoint={step.checkpoint}
                  checkpointLabel={messages.checkpoint}
                >
                  <p>{step.body}</p>
                  {step.technique && (
                    <p>
                      {step.technique.condition &&
                        techniqueCopy.conditions[step.technique.condition]}
                      {techniqueCopy.prompt} {techniqueCopy.link}:
                      https://bakeagain.com{softenButterPath(locale)}
                    </p>
                  )}
                </RecipeStepContent>
              </li>
            ))}
          </ol>
        </section>
        <footer className={styles.source}>
          <p>
            {copy.version}: {version}
          </p>
          <p>{url}</p>
        </footer>
      </article>
    </main>
  );
}
