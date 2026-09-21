/* oxlint-disable next/no-html-link-for-pages -- vinext preview currently fails when next/link is hydrated */
import type { Metadata } from 'next';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  MessageCircleQuestion,
  NotebookPen,
  ShoppingBag,
  Trash2,
} from 'lucide-react';
import { NumberedSectionTitle } from '@/components/foundations/numbered-section-title';
import {
  AssistantBlocks,
  AssistantProvider,
  AssistantTrigger,
} from '@/components/assistant';
import type { AssistantBlock } from '@/lib/assistant/contracts';
import {
  EvidenceBadge,
  type EvidenceStatus,
} from '@/components/recipe/evidence-badge';
import { RecipeIngredientChecklist } from '@/components/recipe/recipe-ingredient-checklist';
import { RecipeStepContent } from '@/components/recipe/recipe-step-content';
import { RecipeDetailTitle } from '@/components/recipe/recipe-detail-title';
import { RecipeSearchForm } from '@/components/recipe/recipe-search-form';
import { RecipeCard } from '@/components/recipe/recipe-card';
import { getRecipeCatalog } from '@/content/recipes/catalog';
import { getLocalizedRecipePath } from '@/lib/i18n/routes';
import { RecipeOverview } from '@/components/recipe/recipe-overview';
import { InventoryRecipeAdjuster } from '@/components/recipe/inventory-recipe-adjuster';
import { StepMediaSequence } from '@/components/recipe/step-media-sequence';
import { getRecipeContent } from '@/content/recipes/registry';
import { LanguageSwitcher } from '@/components/site/language-switcher';
import { BakeCheckbox } from '@/components/ui/bake-checkbox';
import { ActionReviewExample } from '@/components/assistant/action-review-example';
import { Wordmark } from '@/components/site/wordmark';
import { glutenFreeNapoleonRecipe } from '@/content/recipes/gluten-free-napoleon.recipe';
import { recipeDetailTitles } from '@/content/recipes/catalog-locales';
import styles from './design-system.module.css';

export const metadata: Metadata = {
  title: 'Design System v1 — Bake Again',
  description:
    'Approved Warm Precision foundations, components and product rules.',
};

const colours = [
  {
    name: 'Page',
    token: 'background.page',
    value: '#FAF6EF',
    className: styles.cream,
  },
  {
    name: 'Surface',
    token: 'background.surface',
    value: '#FFFDF9',
    className: styles.white,
  },
  {
    name: 'Panel',
    token: 'background.panel',
    value: '#EEE7DD',
    className: styles.linen,
  },
  {
    name: 'Primary text',
    token: 'text.primary',
    value: '#392721',
    className: styles.chocolate,
  },
  {
    name: 'Secondary text',
    token: 'text.secondary',
    value: '#735D54',
    className: styles.cocoa,
  },
  {
    name: 'Primary action',
    token: 'action.primary',
    value: '#A64F36',
    className: styles.terracotta,
  },
];

const space = [4, 8, 12, 16, 24, 32, 48, 64, 96];

const assistantBlocks: AssistantBlock[] = [
  {
    kind: 'evidence',
    text: 'The recorded base uses Schär Mix B for the layer dough.',
    status: 'Tested',
    qualification: 'This exact base has been baked successfully.',
    references: [
      {
        id: 'e1',
        recipeId: 'gluten-free-napoleon',
        recipeVersionId: 'gluten-free-napoleon-v2',
        field: 'ingredients.schar-mix-b',
      },
    ],
  },
  {
    kind: 'explanation',
    text: 'Different flour blends can absorb liquid and hold fat differently, so the same quantities may not produce the recorded dough texture.',
    status: null,
    references: [
      {
        id: 'e1',
        recipeId: 'gluten-free-napoleon',
        recipeVersionId: 'gluten-free-napoleon-v2',
        field: 'ingredients.schar-mix-b',
      },
    ],
  },
  {
    kind: 'suggestion',
    text: 'If you try another blend, begin with a small batch and judge it by the documented pliable-clump checkpoint.',
    status: 'Suggested',
    qualification: 'An idea to try. This change has not been bake-tested.',
    references: [],
  },
];

function StatusBadge({ status }: { status: EvidenceStatus }) {
  return (
    <EvidenceBadge
      status={status}
      className={`${styles.statusBadge} ${styles[status]}`}
    />
  );
}

export default function DesignSystemPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Wordmark className={styles.wordmark} />
        <span className={styles.version}>Design System · v1.0</span>
        <a className={styles.backLink} href="/">
          <ArrowLeft aria-hidden="true" size={17} /> Homepage
        </a>
      </header>

      <div className={styles.shell}>
        <aside className={styles.sidebar} aria-label="Design system sections">
          <p>Approved foundation</p>
          <nav>
            <a href="#principles">01 · Principles</a>
            <a href="#colour">02 · Colour</a>
            <a href="#type">03 · Typography</a>
            <a href="#space">04 · Space & shape</a>
            <a href="#components">05 · Components</a>
            <a href="#evidence">06 · Evidence</a>
            <a href="#dark-mode">07 · Dark mode</a>
          </nav>
          <div className={styles.sidebarNote}>
            <span>Direction</span>
            <strong>Warm Precision</strong>
            <small>Review applied</small>
          </div>
        </aside>

        <div className={styles.content}>
          <section className={styles.intro} id="principles">
            <p className={styles.eyebrow}>
              Bake Again · product design language
            </p>
            <h1>
              Warm enough to invite.
              <br />
              <em>Precise enough to trust.</em>
            </h1>
            <p className={styles.lead}>
              Food leads. Structure clarifies. Every claim about a recipe is
              tied to the exact version that was baked.
            </p>
            <div className={styles.principles}>
              <span>Practical before editorial</span>
              <span>Quality before quantity</span>
              <span>Clear uncertainty</span>
            </div>
          </section>

          <section className={styles.section} id="colour">
            <NumberedSectionTitle
              number="02"
              eyebrow="Foundation"
              className={styles.sectionHeading}
            >
              Colour with quiet confidence.
            </NumberedSectionTitle>
            <div className={styles.colourGrid}>
              {colours.map((colour) => (
                <article className={styles.colourCard} key={colour.token}>
                  <div className={`${styles.swatch} ${colour.className}`} />
                  <strong>{colour.name}</strong>
                  <code>{colour.token}</code>
                  <small>{colour.value}</small>
                </article>
              ))}
            </div>
            <p className={styles.guidance}>
              Cream carries the page; linen separates practical areas;
              terracotta marks action and proof. Large areas of saturated colour
              are exceptional.
            </p>
          </section>

          <section className={styles.section} id="type">
            <NumberedSectionTitle
              number="03"
              eyebrow="Foundation"
              className={styles.sectionHeading}
            >
              Editorial voice, practical reading.
            </NumberedSectionTitle>
            <div className={styles.typeGrid}>
              <article className={styles.typeDisplay}>
                <p>Display · Newsreader / Literata for Ukrainian</p>
                <strong>
                  Bake what you love.
                  <br />
                  <em>Know what works.</em>
                </strong>
                <small>
                  Newsreader for Latin scripts; Literata for Ukrainian headings
                  and editorial emphasis
                </small>
              </article>
              <article className={styles.typeBody}>
                <p>Body · Manrope</p>
                <strong>Clear instructions for real home baking.</strong>
                <span>
                  Exact ingredients, observable checkpoints and useful context
                  come before background story.
                </span>
                <small>
                  Navigation, controls, ingredients, method and metadata
                </small>
              </article>
            </div>
          </section>

          <section className={styles.section} id="space">
            <NumberedSectionTitle
              number="04"
              eyebrow="Foundation"
              className={styles.sectionHeading}
            >
              Whitespace does the organising.
            </NumberedSectionTitle>
            <div className={styles.spaceScale}>
              {space.map((value) => (
                <div key={value}>
                  <span
                    style={{
                      width: `${Math.max(value, 8)}px`,
                      height: `${Math.max(value, 8)}px`,
                    }}
                  />
                  <small>{value}</small>
                </div>
              ))}
            </div>
            <div className={styles.shapeNotes}>
              <p>
                <strong>4px</strong> for compact functional labels.
              </p>
              <p>
                <strong>Square surfaces</strong> for content and controls.
              </p>
              <p>
                <strong>Circles</strong> only for save actions and proof marks.
              </p>
            </div>
          </section>

          <section className={styles.section} id="components">
            <NumberedSectionTitle
              number="05"
              eyebrow="Base components"
              className={styles.sectionHeading}
            >
              Useful controls, with little chrome.
            </NumberedSectionTitle>

            <div className={styles.componentBlock}>
              <div className={styles.componentLabel}>
                <strong>Actions</strong>
                <span>Default · hover · focus · disabled</span>
              </div>
              <div className={styles.actionRow}>
                <button className={styles.primaryButton} type="button">
                  View recipe
                </button>
                <button className={styles.secondaryButton} type="button">
                  Save for later
                </button>
                <button className={styles.textButton} type="button">
                  See all recipes <ArrowRight size={17} />
                </button>
                <button className={styles.primaryButton} type="button" disabled>
                  Unavailable
                </button>
              </div>
            </div>

            <div className={styles.componentBlock}>
              <div className={styles.componentLabel}>
                <strong>Search</strong>
                <span>One clear task and one primary action</span>
              </div>
              <RecipeSearchForm locale="en" id="ds-search" />
              <p>
                Search names, ingredients and collections. Try “млинки”,
                “оладки” or “breakfast”. Exact titles rank first; aliases and
                small typos are supported.
              </p>
              <a href="/uk?q=млинки#recipes">Alias results</a>
              {' · '}
              <a href="/es?q=receta-inexistente#recipes">Empty results</a>
            </div>

            <div className={styles.componentBlock}>
              <div className={styles.componentLabel}>
                <strong>Recipe card</strong>
                <span>
                  Whole-card recipe link, planning facts, flour and collection
                  navigation
                </span>
              </div>
              <p>
                Published preview and local working records. Publication changes
                visibility, never evidence. Unknown card facts are omitted.
                Every non-control area opens the recipe. Planning values use
                stronger type and terracotta icons; flour stays quiet, and
                collection links use a soft sand surface. Check wrapping and
                keyboard focus at 390, 900 and 1440px.
              </p>
              <div className="recipe-grid recipe-grid--catalog-preview">
                {(
                  [
                    { locale: 'uk', id: 'lazy-dumplings' },
                    { locale: 'en', id: 'cottage-cheese-waffles' },
                    { locale: 'es', id: 'cottage-cheese-waffles' },
                    { locale: 'es', id: 'banana-bread' },
                  ] as const
                ).map(({ locale, id }) => {
                  const recipe = getRecipeCatalog(locale, 'all').find(
                    (entry) => entry.id === id,
                  )!;
                  return (
                    <RecipeCard
                      key={`${locale}-${id}`}
                      recipe={{
                        ...recipe,
                        locale,
                        publicationStatus:
                          locale === 'uk' ? 'published' : 'unpublished',
                        href: getLocalizedRecipePath(recipe.id, locale)!,
                      }}
                    />
                  );
                })}
              </div>
            </div>

            <div className={styles.componentBlock}>
              <div className={styles.componentLabel}>
                <strong>Recipe detail title</strong>
                <span>
                  Explicit gluten-free message with editorial dish-name emphasis
                </span>
              </div>
              <RecipeDetailTitle
                className={styles.recipeDetailTitleExample}
                locale="uk"
                title={recipeDetailTitles.crepes.uk}
              />
            </div>

            <div className={styles.componentBlock}>
              <div className={styles.componentLabel}>
                <strong>Recipe overview</strong>
                <span>
                  One comparable scheme for every recipe; equipment stays in
                  setup and method
                </span>
              </div>
              <div className={styles.recipeOverviewExample}>
                <RecipeOverview
                  content={getRecipeContent('gluten-free-napoleon', 'uk')}
                  locale="uk"
                />
                <RecipeOverview
                  content={getRecipeContent('crinkle-cookies', 'en')}
                  locale="en"
                />
                <RecipeOverview
                  content={getRecipeContent('apple-charlotte', 'es')}
                  locale="es"
                />
              </div>
            </div>

            <div className={styles.componentBlock} id="concise-recipe">
              <div className={styles.componentLabel}>
                <strong>Concise recipe</strong>
                <span>
                  Edited copy · optional captions · single working note
                </span>
              </div>
              {(['uk', 'en', 'es'] as const).map((locale) => {
                const recipe = getRecipeContent(
                  locale === 'es'
                    ? 'crepes'
                    : locale === 'en'
                      ? 'crinkle-cookies'
                      : 'prune-cake',
                  locale,
                )!;
                const step = recipe.steps[locale === 'uk' ? 3 : 2];
                return (
                  <div key={locale} lang={locale}>
                    <RecipeOverview
                      content={recipe}
                      locale={locale}
                      showWorkingRecord={recipe.evidence != null}
                    />
                    <InventoryRecipeAdjuster
                      recipe={recipe}
                      archiveSections={[]}
                      locale={locale}
                      scalingAnchorIngredientId={
                        locale === 'es' ? 'eggs' : 'flour'
                      }
                    />
                    <RecipeStepContent
                      title={step.title}
                      tipLabel=""
                      checkpointLabel=""
                    >
                      <p>{step.body}</p>
                    </RecipeStepContent>
                    {step.media && (
                      <StepMediaSequence
                        items={step.media}
                        ariaLabel={step.title}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div className={styles.componentBlock} id="assistant-actions">
              <div className={styles.componentLabel}>
                <strong>Assistant action review</strong>
                <span>
                  Suggested action · deterministic quantities · explicit
                  confirmation
                </span>
              </div>
              <ActionReviewExample />
            </div>

            <div className={styles.componentBlock}>
              <div className={styles.componentLabel}>
                <strong>Personal state</strong>
                <span>
                  One shopping entry point, drawer review and compact persistent
                  list
                </span>
              </div>
              <div className={styles.personalExample}>
                <button
                  className={styles.savedControl}
                  type="button"
                  aria-pressed="true"
                  aria-label="Remove Napoleon cake from Saved"
                >
                  <Bookmark size={19} fill="currentColor" />
                </button>
                <aside className={styles.bakeMemoryExample}>
                  <NotebookPen aria-hidden="true" size={20} />
                  <div>
                    <small>Your recipe memory</small>
                    <strong>You made this recipe</strong>
                    <span>Last made 20 Sep 2026 · Private to this browser</span>
                    <p>
                      Use a little less milk next time and keep the pan slightly
                      hotter.
                    </p>
                  </div>
                  <button className={styles.secondaryButton} type="button">
                    Cook again
                  </button>
                </aside>
                <div className={styles.shoppingExample}>
                  <BakeCheckbox
                    aria-label="Mark butter as bought"
                    defaultChecked
                  />
                  <strong>Butter</strong>
                  <span>180 g</span>
                  <small>For 2 recipes</small>
                  <button aria-label="Remove butter">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className={styles.shoppingFlowExample}>
                  <button className={styles.primaryButton} type="button">
                    <ShoppingBag size={16} /> To shopping list…
                  </button>
                  <div className={styles.shoppingReviewExample}>
                    <strong>What do you need to buy?</strong>
                    <small>Napoleon cake · 28 cm · 1×</small>
                    <p>Leave selected the products you need to buy.</p>
                    <nav aria-label="Shopping selection">
                      <button type="button">Select all</button>
                      <button type="button">Clear all selections</button>
                    </nav>
                    <div className={styles.shoppingReviewLine}>
                      <BakeCheckbox
                        aria-label="Add Schär Mix B Bread flour mix to the shopping list"
                        defaultChecked
                      />{' '}
                      <span>450 g · Schär Mix B Bread flour mix</span>
                    </div>
                    <div className={styles.shoppingReviewLine}>
                      <BakeCheckbox
                        aria-label="Add tapioca starch to the shopping list"
                        defaultChecked
                      />{' '}
                      <span>80 g · Tapioca starch</span>
                    </div>
                    <footer>
                      <button className={styles.primaryButton} type="button">
                        Add to list (2)
                      </button>
                    </footer>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.componentBlock}>
              <div className={styles.componentLabel}>
                <strong>Ingredient amounts</strong>
                <span>
                  Primary kitchen measure with an optional secondary equivalent
                </span>
              </div>
              <div className={styles.ingredientExample}>
                <RecipeIngredientChecklist
                  sections={[
                    {
                      id: 'dual-measure-example',
                      title: 'Crepe batter',
                      ingredients: [
                        {
                          id: 'flour-example',
                          name: 'Schär Mix B Bread flour',
                          quantity: {
                            base: { kind: 'exact', value: 140, unit: 'g' },
                            equivalent: {
                              kind: 'exact',
                              value: 6,
                              unit: 'tbsp',
                            },
                            shopping: { mode: 'base' },
                          },
                        },
                      ],
                    },
                  ]}
                />
              </div>
            </div>

            <div className={styles.componentBlock}>
              <div className={styles.componentLabel}>
                <strong>Step guidance</strong>
                <span>
                  Shared recipe and Cook variants with written semantics
                </span>
              </div>
              <div className={styles.stepGuidanceExample}>
                <RecipeStepContent
                  action={
                    <a
                      className={styles.stepAskExample}
                      href="#assistant-actions"
                    >
                      <MessageCircleQuestion aria-hidden="true" size={14} />
                      Ask about this step
                    </a>
                  }
                  checkpoint="The batter is smooth and spreads easily across the pan."
                  checkpointLabel="Checkpoint"
                  tip="Add only a little milk while the base is still thick."
                  tipLabel="Tip"
                  title="Blend the batter"
                >
                  <p>
                    Add the remaining milk gradually and blend only until
                    smooth.
                  </p>
                </RecipeStepContent>
              </div>
            </div>

            <div className={styles.componentBlock}>
              <div className={styles.componentLabel}>
                <strong>Language menu</strong>
                <span>
                  Native language names, explicit selection, keyboard menu
                </span>
              </div>
              <div className={styles.actionRow}>
                <LanguageSwitcher locale="en" pathname="/en" />
              </div>
            </div>

            <div className={styles.componentBlock}>
              <div className={styles.componentLabel}>
                <strong>Contextual assistant</strong>
                <span>
                  Shared Recipe and Cook drawer · loading announcement · Close
                  focus after submit/review · localized offline retry ·
                  scrollable at 200% text
                </span>
              </div>
              <div className={styles.assistantExample}>
                <AssistantProvider
                  recipeId={glutenFreeNapoleonRecipe.id}
                  recipeVersionId={glutenFreeNapoleonRecipe.versionId}
                  recipeTitle={glutenFreeNapoleonRecipe.title.en}
                  locale="en"
                  surface="recipe-detail"
                >
                  <div className={styles.actionRow}>
                    <AssistantTrigger
                      className={styles.assistantExampleTrigger}
                      configuration={{ kind: 'base' }}
                      label="Ask about this recipe"
                      scope={{ kind: 'recipe' }}
                    />
                  </div>
                </AssistantProvider>
                <AssistantBlocks blocks={assistantBlocks} locale="en" />
              </div>
            </div>
          </section>

          <section
            className={`${styles.section} ${styles.evidenceSection}`}
            id="evidence"
          >
            <NumberedSectionTitle
              number="06"
              eyebrow="Trust language"
              className={styles.sectionHeading}
            >
              Show exactly what the evidence supports.
            </NumberedSectionTitle>
            <div className={styles.evidenceGrid}>
              <article>
                <StatusBadge status="tested" />
                <p>Baked as written.</p>
                <small>Example: Tested · Schär Mix B</small>
              </article>
              <article>
                <StatusBadge status="calculated" />
                <p>Quantities scaled. This version has not been bake-tested.</p>
                <small>
                  A tested original can have a calculated variation.
                </small>
              </article>
              <article>
                <StatusBadge status="suggested" />
                <p>An idea to try. This change has not been bake-tested.</p>
                <small>Use for substitutions and other proposed changes.</small>
              </article>
            </div>
            <div className={styles.provenanceNote}>
              <Check aria-hidden="true" size={20} />
              <div>
                <strong>Tested configuration</strong>
                <p>Schär Mix B · 28 cm round form · 12 layers</p>
              </div>
            </div>
          </section>

          <section className={styles.section} id="dark-mode">
            <NumberedSectionTitle
              number="07"
              eyebrow="Theme foundation"
              className={styles.sectionHeading}
            >
              Dark, without losing the appetite.
            </NumberedSectionTitle>
            <div className={styles.darkPreview} data-theme="dark">
              <div className={styles.darkPreviewCopy}>
                <p className={styles.eyebrow}>Evening baking · optional mode</p>
                <h3>
                  Bake what you love.
                  <br />
                  <em>Know what works.</em>
                </h3>
                <p>
                  Espresso surfaces, warm light text and a brighter terracotta
                  accent. Recipe photography keeps its natural colour.
                </p>
                <button type="button">View recipe</button>
              </div>
              <div className={styles.darkPreviewEvidence}>
                <StatusBadge status="tested" />
                <StatusBadge status="calculated" />
                <StatusBadge status="suggested" />
              </div>
            </div>
            <p className={styles.guidance}>
              Light remains the default. Dark mode is opt-in and will be exposed
              only after its controls, photography and complete recipe flow are
              validated.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
