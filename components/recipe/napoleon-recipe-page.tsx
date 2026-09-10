/* oxlint-disable next/no-html-link-for-pages -- vinext preview currently fails when next/link is hydrated */
import Image from 'next/image';
import {
  ArrowLeft,
  Check,
  Clock3,
  Play,
} from 'lucide-react';
import { SectionTitle } from '@/components/foundations/section-title';
import { RecipeFacts } from '@/components/recipe/recipe-facts';
import { SiteHeader } from '@/components/site/site-header';
import { NAPOLEON_METHOD_STEP_COUNT, napoleonPrototypeMedia, napoleonPrototypeSteps } from '@/content/recipes/napoleon.prototype';
import type { RecipeDraft } from '@/content/recipes/recipe.types';
import { defaultLocale, type AppLocale } from '@/lib/i18n/config';
import { getLocalizedRecipePath, localeRecipesPath } from '@/lib/i18n/routes';
import styles from '@/app/recipes/napoleon-cake/recipe.module.css';
import { StepMediaSequence } from '@/app/recipes/napoleon-cake/step-media-sequence';
import { AssistantTrigger, RecipeAssistantProvider } from '@/app/recipes/napoleon-cake/recipe-assistant';
import { RecipeAdjuster } from '@/app/recipes/napoleon-cake/recipe-adjuster';
import { StepTip } from '@/app/recipes/napoleon-cake/step-tip';
import { CookModeLink, RecipeConfigurationProvider } from '@/app/recipes/napoleon-cake/recipe-configuration';
import { SaveRecipeControl } from './save-recipe-control';

export function NapoleonRecipePage({
  recipe,
  locale = defaultLocale,
  methodStepLimit,
  pathname,
}: {
  recipe: RecipeDraft;
  locale?: AppLocale;
  /** Limits the visible method for a focused visual review route. */
  methodStepLimit?: number;
  pathname?: string;
}) {
  const emphasizedTitle = locale === 'uk' ? 'Наполеон' : locale === 'es' ? 'Napoleón' : 'Napoleon Cake';
  const localizedTitle = recipe.title[locale];
  const titlePrefix = localizedTitle.endsWith(emphasizedTitle)
    ? localizedTitle.slice(0, -emphasizedTitle.length).trim()
    : '';
  const flourLine = recipe.ingredientSections
    .flatMap((section) => section.lines)
    .find((line) => line.id === recipe.flourConfiguration.commercialMixLineId);
  const flourName = flourLine?.options[0].name[locale] ?? 'Schär Mix B';
  const heroMedia = recipe.media.find((item) => item.id === recipe.heroMediaId);
  const cookPath = getLocalizedRecipePath(recipe.id, locale, '/cook') ?? localeRecipesPath(locale);
  const visibleSteps = methodStepLimit
    ? napoleonPrototypeSteps.slice(0, methodStepLimit)
    : napoleonPrototypeSteps;

  return (
    <RecipeAssistantProvider>
    <RecipeConfigurationProvider cookPath={cookPath}>
    <main className={styles.page}>
      <SiteHeader locale={locale} pathname={pathname} />

      <div className={styles.breadcrumb}>
        <a href={localeRecipesPath(locale)}><ArrowLeft size={15} /> Recipes</a>
        <span>Celebration</span>
      </div>

      <section className={styles.hero}>
        <div className={styles.heroImage}>
          <Image src={heroMedia?.path ?? '/images/recipes/gluten-free-napoleon-card-v1.png'} alt={heroMedia?.alt[locale] ?? 'Gluten-free Napoleon cake with many thin layers and a cut slice'} fill priority sizes="(min-width: 900px) 48vw, 100vw" />
        </div>
        <div className={styles.heroCopy}>
          <div className={styles.heroTopline}><p>Celebration · prepare ahead</p><SaveRecipeControl locale={locale} recipeId={recipe.id} title={recipe.title[locale]} /></div>
          <h1>{titlePrefix && <>{titlePrefix}<br /></>}<em>{emphasizedTitle}</em></h1>
          <p className={styles.summary}>{recipe.summary[locale]}</p>
          <div className={styles.tested}><span><Check size={15} strokeWidth={2.5} /> Repeatedly verified</span><p>This exact base has been baked successfully many times.</p></div>
          <RecipeFacts className={styles.facts} items={[
            { label: 'Active time', value: recipe.timing.activeMinutes === 60 ? '1 hour' : `${recipe.timing.activeMinutes} min` },
            { label: 'Yield', value: recipe.yield.default.label.en.replace(' with ', ' · ') },
            { label: 'Form', value: `${recipe.geometry.default.diameterCm} cm round` },
            { label: 'Flour', value: <>{flourName.replace(' Bread flour mix', '')} <AssistantTrigger scope="flour" label="Another mix?" compact /></> },
          ]} />
          <div className={styles.actions}>
            <CookModeLink className={styles.primaryAction}><Play size={17} fill="currentColor" /> Start Cook Mode</CookModeLink>
            <AssistantTrigger scope="recipe" label="Ask about this recipe" />
          </div>
        </div>
      </section>

      <section className={styles.beforeStart} aria-labelledby="before-start-title">
        <div><SectionTitle eyebrow="Before you start" eyebrowClassName={styles.eyebrow} id="before-start-title">Plan for the rest.</SectionTitle></div>
        <div className={styles.planGrid}>
          <article><Clock3 size={19} /><strong>Chill the dough</strong><p>At least 2 hours, or leave the twelve wrapped discs overnight.</p></article>
          <article><span className={styles.planNumber}>12</span><strong>Prepare the parchment</strong><p>Have at least twelve sheets ready—one for rolling and baking each layer.</p></article>
          <article><span className={styles.planNumber}>24h</span><strong>Best the next day</strong><p>Rest 1 hour at room temperature, then refrigerate for 12–24 hours.</p></article>
        </div>
      </section>
      <RecipeAdjuster locale={locale} />
      <section className={styles.method} id="method" aria-labelledby="method-title">
        <div className={styles.methodHeading}><SectionTitle eyebrow={`Method · ${methodStepLimit ?? NAPOLEON_METHOD_STEP_COUNT} steps`} eyebrowClassName={styles.eyebrow} id="method-title">Begin with the dough.</SectionTitle><CookModeLink className={styles.primaryAction}><Play size={17} fill="currentColor" /> Open Cook Mode</CookModeLink></div>
        <div className={styles.steps}>
          {visibleSteps.map((step) => (
            <article className={step.mediaIds ? styles.stepWithMedia : undefined} id={`step-${Number(step.number)}`} key={step.number}>
              <span>{step.number}</span>
              {step.tips ? <StepTip meta={step.meta} title={step.recipeTitle ?? step.title} body={step.recipeBody} tips={step.tips} guidance={step.recipeGuidance ?? step.guidance} /> : <div><p className={styles.stepMeta}>{step.meta}</p><h3>{step.recipeTitle ?? step.title}</h3><p>{step.recipeBody}</p>{(step.recipeGuidance ?? step.guidance) && <aside className={`${styles.stepCallout} ${styles.stepCheckpoint}`}><Check size={15} /><p><strong>Checkpoint</strong>{step.recipeGuidance ?? step.guidance}</p></aside>}<AssistantTrigger scope="step" stepTitle={step.recipeTitle ?? step.title} label="Ask about this step" compact /></div>}
              {step.mediaIds && <StepMediaSequence items={napoleonPrototypeMedia.filter((item) => step.mediaIds?.includes(item.id))} />}
            </article>
          ))}
        </div>
      </section>
    </main>
    </RecipeConfigurationProvider>
    </RecipeAssistantProvider>
  );
}
