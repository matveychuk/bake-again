import { AssistantProvider, AssistantTrigger } from '@/components/assistant';
import { stepHelpMessages } from '@/components/assistant/step-help.messages';
import { resolveStepHelp } from '@/content/recipes/step-help';
import {
  baseRecipeConfigurationSearch,
  recipeConfigurationQueryIssue,
} from '@/content/recipes/recipe-configuration-query';
import { RecipeConfigurationUnavailable } from './recipe-configuration-unavailable';
import { recipeStructuredData, serializeJsonLd } from '@/lib/seo/recipes';
/* oxlint-disable next/no-html-link-for-pages -- vinext preview currently fails when next/link is hydrated */
import Image from 'next/image';
import { SectionTitle } from '@/components/foundations/section-title';
import { StepMediaSequence } from '@/components/recipe/step-media-sequence';
import { RecipeOverview } from '@/components/recipe/recipe-overview';
import {
  RecipeCookEntry,
  RecipeSectionNavigation,
} from '@/components/recipe/recipe-reading-actions';
import { RecipeDetailTitle } from '@/components/recipe/recipe-detail-title';
import { RecipeBakeMemory } from '@/components/recipe/recipe-bake-memory';
import { RecipeBackLink } from '@/components/recipe/recipe-back-link';
import { RecipeStepContent } from '@/components/recipe/recipe-step-content';
import { RecipePlanItem } from '@/components/recipe/recipe-plan-item';
import { RecipeRelatedLink } from '@/components/recipe/recipe-related-link';
import { TechniqueHelp } from '@/components/techniques/technique-help';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import type { InventoryRecipe } from '@/content/recipes/inventory';
import type { RecipeDraft } from '@/content/recipes/recipe.types';
import { getRecipeContent, getRecipeDocument } from '@/content/recipes/registry';
import { getCreamOptionCopy } from '@/content/recipes/cream-option-copy';
import {
  composeRecipeWithCream,
  resolveSelectedCreamRecipeId,
} from '@/content/recipes/cream-composition';
import { recipeReaderCopy } from '@/content/recipes/reader-copy';
import {
  catalogLocaleCopy,
  recipeDetailTitles,
} from '@/content/recipes/catalog-locales';
import { getUiMessages } from '@/lib/i18n/messages';
import { defaultLocale, type AppLocale } from '@/lib/i18n/config';
import { getRecipePublicationStatus } from '@/content/recipes/publication';
import {
  sourceAssistantConfiguration,
  applySourceRecipeConfiguration,
  parseSourceRecipeConfiguration,
  sourceRecipeScalingBounds,
} from '@/content/recipes/source-recipe-configuration';
import {
  getLocalizedRecipePath,
  localeDraftsPath,
  localeHomePath,
} from '@/lib/i18n/routes';
import { InventoryRecipeAdjuster } from './inventory-recipe-adjuster';
import { SaveRecipeControl } from './save-recipe-control';
import { RecipeCreamSelector } from './recipe-cream-selector';
import styles from './inventory-recipe-detail.module.css';

export function InventoryRecipeDetail({
  recipe,
  personalRecipe,
  locale = defaultLocale,
  pathname,
  selectedCreamRecipeId: requestedCreamRecipeId,
  isStandaloneComponent = false,
  configurationSearch = '',
}: {
  recipe: InventoryRecipe;
  personalRecipe?: RecipeDraft | null;
  locale?: AppLocale;
  pathname?: string;
  selectedCreamRecipeId?: string | null;
  isStandaloneComponent?: boolean;
  configurationSearch?: string;
}) {
  const isDraft = getRecipePublicationStatus(recipe.id) === 'unpublished';
  const baseStructured = getRecipeContent(recipe.id, locale);
  const selectedCreamRecipeId = resolveSelectedCreamRecipeId(
    baseStructured,
    requestedCreamRecipeId,
  );
  const selectedCream = selectedCreamRecipeId
    ? getRecipeContent(selectedCreamRecipeId, locale)
    : null;
  const structured = baseStructured
    ? composeRecipeWithCream(
        baseStructured,
        selectedCream,
        selectedCreamRecipeId,
        locale,
      )
    : null;
  const queryIssue = recipeConfigurationQueryIssue(
    configurationSearch,
    structured?.geometry?.id,
  );
  if (queryIssue) {
    const cleanSearch = baseRecipeConfigurationSearch(configurationSearch);
    const baseHref = `${pathname ?? `/recipes/${recipe.slug}`}${cleanSearch ? `?${cleanSearch}` : ''}#ingredients`;
    return (
      <main className={styles.page}>
        <SiteHeader locale={locale} pathname={pathname} />
        <RecipeConfigurationUnavailable
          locale={locale}
          variant="detail"
          reason={
            queryIssue === 'geometry'
              ? getUiMessages(locale).scaling.unsupportedGeometry
              : getUiMessages(locale).cook.unsupportedConfiguration
          }
          href={baseHref}
        />
        <SiteFooter locale={locale} />
      </main>
    );
  }
  const configuration = parseSourceRecipeConfiguration(
    configurationSearch,
    structured,
    recipe.scalingAnchorIngredientId,
    sourceRecipeScalingBounds(personalRecipe, recipe.scalingAnchorIngredientId),
  );
  const configuredStructured = structured
    ? applySourceRecipeConfiguration(structured, configuration, locale)
    : null;
  const methodSteps = configuredStructured?.steps ?? [];
  const concise = structured?.presentation === 'concise';
  const techniques = [
    ...new Map(
      (structured?.steps ?? []).flatMap((step) =>
        step.technique
          ? [
              [
                `${step.technique.id}:${step.technique.condition ?? ''}`,
                step.technique,
              ] as const,
            ]
          : [],
      ),
    ).values(),
  ];
  const readerCopy = recipeReaderCopy[locale];
  const showEditorialNotes = isDraft && !concise;
  const messages = getUiMessages(locale).recipe;
  const copy = catalogLocaleCopy[recipe.id];
  const detailTitle =
    recipeDetailTitles[recipe.id]?.[locale] ??
    copy?.title[locale] ??
    recipe.title;
  const recipePath = pathname ?? `/recipes/${recipe.slug}`;
  const cookModeParams = new URLSearchParams(configurationSearch);
  cookModeParams.delete('from');
  if (selectedCreamRecipeId) cookModeParams.set('cream', selectedCreamRecipeId);
  const cookModeSearch = cookModeParams.toString();
  const cookModePath = `${recipePath}/cook${cookModeSearch ? `?${cookModeSearch}` : ''}`;
  const sourceVersionId = `${structured?.versionId ?? `${recipe.id}-source-v1`}${selectedCreamRecipeId ? `-cream-${selectedCreamRecipeId}` : ''}`;
  const backHref = `${isDraft ? localeDraftsPath(locale) : localeHomePath(locale)}#recipes`;
  const backLabel = isDraft
    ? getUiMessages(locale).navigation.drafts
    : messages.backToRecipes;
  const linkedRecipePath = (recipeId: string) => {
    return pathname
      ? (getLocalizedRecipePath(recipeId, locale) ??
          `/${locale}/recipes/${recipeId}`)
      : `/recipes/${recipeId}`;
  };
  const creamOptions = structured?.creamOptions?.recipeIds
    .map((recipeId) => ({
      id: recipeId,
      href: linkedRecipePath(recipeId),
      ...getCreamOptionCopy(recipeId, locale),
    }))
    .sort((left, right) =>
      left.id === structured.creamOptions?.recommendedRecipeId
        ? -1
        : right.id === structured.creamOptions?.recommendedRecipeId
          ? 1
          : 0,
    );

  const structuredData =
    configuredStructured &&
    configuration.kind === 'base' &&
    !selectedCreamRecipeId
      ? recipeStructuredData(recipe.id, locale, configuredStructured)
      : null;
  const document = getRecipeDocument(recipe.id);
  const helpConfiguration = configuredStructured
    ? sourceAssistantConfiguration(recipe.id, configuredStructured, configuration)
    : undefined;
  const helpVersion = document?.kind === 'detailed' ? document.recipe.versionId : sourceVersionId;
  return (
    <AssistantProvider key={`${helpVersion}:${configurationSearch}`} recipeId={recipe.id} recipeVersionId={helpVersion}
      recipeTitle={detailTitle} locale={locale} surface="recipe-detail"
      liveEnabled={recipe.id === 'gluten-free-napoleon' && Boolean(helpConfiguration)}>
    <main className={styles.page}>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
        />
      )}
      <SiteHeader locale={locale} pathname={pathname} />
      <div className={styles.breadcrumb}>
        <RecipeBackLink
          fallbackHref={backHref}
          fallbackLabel={backLabel}
          returnLabel={getUiMessages(locale).cook.returnToRecipe}
        />
        {!concise && <span>{copy?.category[locale] ?? recipe.category}</span>}
      </div>
      <section className={styles.hero} id="recipe-content" tabIndex={-1}>
        <div className={styles.heroImage}>
          <Image
            src={recipe.image}
            alt={copy?.alt[locale] ?? recipe.imageAlt}
            fill
            priority
            sizes="(min-width: 900px) 48vw, 100vw"
          />
        </div>
        <div className={styles.heroCopy}>
          <div className={styles.heroTopline}>
            <p>{copy?.category[locale] ?? recipe.category}</p>
            <div className={styles.heroActions}>
              {!isStandaloneComponent && (
                <SaveRecipeControl
                  locale={locale}
                  recipeId={recipe.id}
                  title={
                    personalRecipe?.title[locale] ??
                    copy?.title[locale] ??
                    recipe.title
                  }
                />
              )}
              {isDraft && <span>{messages.workingRecord}</span>}
            </div>
          </div>
          <RecipeDetailTitle
            locale={locale}
            title={detailTitle}
            plain={isStandaloneComponent}
          />
          <p className={styles.summary}>
            {copy?.summary[locale] ?? recipe.summary}
          </p>
          <RecipeOverview
            content={configuredStructured}
            locale={locale}
            showFlour={!isStandaloneComponent}
            showWorkingRecord={isDraft}
          />
          <RecipeSectionNavigation locale={locale} />
        </div>
      </section>

      <RecipeBakeMemory
        cookModeHref={cookModePath}
        locale={locale}
        recipeId={recipe.id}
      />

      {structured?.creamOptions && creamOptions ? (
        <RecipeCreamSelector
          locale={locale}
          options={creamOptions}
          recommendedRecipeId={structured.creamOptions.recommendedRecipeId}
          selectedRecipeId={selectedCreamRecipeId}
        />
      ) : null}

      {structured?.relatedRecipes?.length ? (
        <nav
          className={styles.sectionNavigation}
          aria-label={readerCopy.recipeParts}
        >
          {structured.relatedRecipes.map((id) => (
            <RecipeRelatedLink key={id} href={linkedRecipePath(id)}>
              {catalogLocaleCopy[id]?.title[locale] ??
                recipeDetailTitles[id]?.[locale] ??
                id}
            </RecipeRelatedLink>
          ))}
        </nav>
      ) : null}

      {structured?.beforeStart?.length || techniques.length > 0 ? (
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
            {(structured?.beforeStart ?? []).map((item) => (
              <RecipePlanItem key={item} label={messages.keepInMind}>
                {item}
              </RecipePlanItem>
            ))}
            {techniques.map((reference) => (
              <RecipePlanItem
                key={`${reference.id}:${reference.condition ?? ''}`}
                label={messages.keepInMind}
              >
                <TechniqueHelp locale={locale} reference={reference} />
              </RecipePlanItem>
            ))}
          </div>
        </section>
      ) : null}

      <section
        className={styles.ingredientsArea}
        id="ingredients"
        tabIndex={-1}
        aria-labelledby="ingredients-title"
      >
        <InventoryRecipeAdjuster
          archiveSections={recipe.archiveSections}
          configuration={configuration}
          key={`${recipe.id}:${selectedCreamRecipeId ?? 'no-cream'}`}
          locale={locale}
          personalRecipe={personalRecipe}
          scalingAnchorIngredientId={recipe.scalingAnchorIngredientId}
          sourceShoppingRecipe={
            structured
              ? {
                  id: recipe.id,
                  versionId: sourceVersionId,
                  title: detailTitle,
                  ingredientSections: structured.ingredientSections,
                }
              : null
          }
          recipe={
            structured
              ? {
                  ...structured,
                  gapNote: showEditorialNotes
                    ? (copy?.publicationNote?.[locale] ?? structured.gapNote)
                    : undefined,
                }
              : undefined
          }
          showWorkingRecord={isDraft}
        />
      </section>

      <section
        className={styles.method}
        id="recipe-method"
        tabIndex={-1}
        aria-labelledby="method-title"
      >
        <div className={styles.methodHeading}>
          <SectionTitle
            eyebrow={
              concise || !structured
                ? undefined
                : messages.method(methodSteps.length)
            }
            eyebrowClassName={styles.eyebrow}
            id="method-title"
          >
            {concise ? readerCopy.method : messages.stepByStep}
          </SectionTitle>
          {recipe.id === 'gluten-free-napoleon' && helpConfiguration && (
            <AssistantTrigger configuration={helpConfiguration} scope={{ kind: 'recipe' }} label={stepHelpMessages[locale].chat} />
          )}
          <RecipeCookEntry
            locale={locale}
            href={
              structured?.creamOptions && !selectedCreamRecipeId
                ? '#cream-options'
                : cookModePath
            }
            needsCream={Boolean(
              structured?.creamOptions && !selectedCreamRecipeId,
            )}
            hasMethod={methodSteps.length > 0}
          />
        </div>
        {methodSteps.length > 0 ? (
          <ol className={styles.steps}>
            {methodSteps.map((step, index) => (
              <li
                className={step.media ? styles.stepWithMedia : undefined}
                key={step.id}
              >
                {step.meta && <p className={styles.stepMeta}>{step.meta}</p>}
                <span className={styles.stepNumber}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <RecipeStepContent
                  action={resolveStepHelp(step).length > 0 ? (
                    <AssistantTrigger configuration={helpConfiguration ?? { kind: 'base' }}
                      scope={{ kind: 'step', stepIds: [step.id] }} stepTitle={step.title}
                      label={stepHelpMessages[locale].trigger} preparedAnswers={resolveStepHelp(step)} />
                  ) : undefined}
                  technique={step.technique}
                  locale={locale}
                  checkpoint={step.checkpoint}
                  checkpointLabel={messages.checkpoint}
                  className={styles.stepContent}
                  headingLevel="h3"
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
            <p>{structured?.gapNote ?? messages.methodPendingDescription}</p>
          </div>
        )}
      </section>
      {showEditorialNotes &&
        !concise &&
        (copy?.publicationNote?.[locale] || structured?.gapNote) && (
          <aside className={styles.publication}>
            <strong>{messages.beforePublishing}</strong>
            <p>{copy?.publicationNote?.[locale] ?? structured?.gapNote}</p>
          </aside>
        )}
      <SiteFooter locale={locale} />
    </main>
    </AssistantProvider>
  );
}
