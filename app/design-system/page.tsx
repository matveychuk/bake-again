import { AccountExample } from '@/components/account/account-example';
import {
  AboutFamilyPhotos,
  AboutRecipeStatuses,
} from '@/app/_components/about/about-page';
import aboutStyles from '@/app/_components/about/about-page.module.css';
import { aboutPageContent } from '@/content/about';
import { resolveStepHelp } from '@/content/recipes/step-help';
import { stepHelpMessages } from '@/components/assistant/step-help.messages';
import { assistantMessages } from '@/components/assistant/assistant.messages';
import { RecipeConfigurationUnavailable } from '@/components/recipe/recipe-configuration-unavailable';
import { formatQuantity } from '@/lib/i18n/format';
import { NotFoundContent } from '@/components/site/not-found-content';
import { Button } from '@/components/ui/button';
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
import { RecipePlanItem } from '@/components/recipe/recipe-plan-item';
import { RecipeDetailTitle } from '@/components/recipe/recipe-detail-title';
import { RecipeSearchForm } from '@/components/recipe/recipe-search-form';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';
import { RecipeCard } from '@/components/recipe/recipe-card';
import {
  CookToolsExample,
  CookTimerExample,
} from '@/components/cook-mode/cook-tools-example';
import { createSourceCookSteps } from '@/content/recipes/cook-mode-adapter';
import { RecipeIngredientHeading } from '@/components/recipe/recipe-ingredient-heading';
import shoppingControlStyles from '@/components/recipe/add-recipe-ingredients-control.module.css';
import { TechniqueHelp } from '@/components/techniques/technique-help';
import { getRecipeCatalog } from '@/content/recipes/catalog';
import { getLocalizedRecipePath } from '@/lib/i18n/routes';
import { RecipeOverview } from '@/components/recipe/recipe-overview';
import { RecipeBackLink } from '@/components/recipe/recipe-back-link';
import { SaveRecipeControl } from '@/components/recipe/save-recipe-control';
import {
  RecipeCookEntry,
  RecipeSectionNavigation,
} from '@/components/recipe/recipe-reading-actions';
import { recipeReaderCopy } from '@/content/recipes/reader-copy';
import { getUiMessages } from '@/lib/i18n/messages';
import { localeMetadata } from '@/lib/i18n/config';
import { RecipeCreamSelector } from '@/components/recipe/recipe-cream-selector';
import { InventoryRecipeAdjuster } from '@/components/recipe/inventory-recipe-adjuster';
import { StepMediaSequence } from '@/components/recipe/step-media-sequence';
import {
  getRecipeContent,
  getRecipeDocument,
} from '@/content/recipes/registry';
import { applySourceRecipeConfiguration } from '@/content/recipes/source-recipe-configuration';
import { resolveNapoleonCookConfiguration } from '@/content/recipes/napoleon-configuration';
import { composeRecipeWithCream } from '@/content/recipes/cream-composition';
import { LanguageSwitcher } from '@/components/site/language-switcher';
import { BakeCheckbox } from '@/components/ui/bake-checkbox';
import { ActionReviewExample } from '@/components/assistant/action-review-example';
import { Wordmark } from '@/components/site/wordmark';
import { glutenFreeNapoleonRecipe } from '@/content/recipes/gluten-free-napoleon.recipe';
import { recipeDetailTitles } from '@/content/recipes/catalog-locales';
import { getCreamOptionCopy } from '@/content/recipes/cream-option-copy';
import styles from './design-system.module.css';
import { RecipeUtilityActions } from '@/components/recipe/recipe-utility-actions';
import { recipePublicLink } from '@/content/recipes/recipe-public-link';
import { RecentRecipes } from '@/components/personal-state/recent-recipes';
import { NewsletterInvitation } from '@/components/site/newsletter-invitation';

export const metadata: Metadata = {
  title: 'Design System v1 — Bake Again',
  robots: { index: false, follow: false },
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

const creamSelectorOptions = (
  ['mascarpone-whipped-cream', 'vanilla-buttercream'] as const
).map((id) => ({
  id,
  ...getCreamOptionCopy(id, 'uk'),
  href: getLocalizedRecipePath(id, 'uk')!,
}));

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
            <h1 id="hero-title">
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
            <div className={styles.faviconExample}>
              {/* oxlint-disable-next-line next/no-img-element -- Display the exact small SVG favicon without image optimization. */}
              <img
                src="/favicon.svg"
                width="32"
                height="32"
                alt="Bake Again browser icon: dark B with a terracotta period"
              />
              <span>Browser icon · B. from the Bake Again wordmark</span>
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
            <figure className={styles.sharingPreview}>
              {/* oxlint-disable-next-line next/no-img-element -- Display the exact generated sharing asset. */}
              <img
                src="/social/bake-again-share-v4.webp"
                width="600"
                height="315"
                alt="Bake Again link preview with Napoleon cake, a teacup and teapot"
              />
              <figcaption>
                Homepage link preview · food leads, brand stays quiet.
              </figcaption>
            </figure>
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
                <strong>4px</strong> for buttons, fields and compact labels.
              </p>
              <p>
                <strong>Square surfaces</strong> for content and photography.
              </p>
              <p>
                <strong>Circles</strong> only for save actions and proof marks.
              </p>
            </div>
          </section>

          <section className={styles.section} id="family-story">
            <h2>Family story · About page</h2>
            <p>
              Original family photographs, uncropped, with readable captions.
              The shared title scales from 40 to 64px.
            </p>
            <div className={aboutStyles.hero} lang="uk">
              <div className={aboutStyles.heroCopy}>
                <h2
                  style={{ fontFamily: 'var(--font-family-display-cyrillic)' }}
                >
                  {aboutPageContent.uk.title}
                </h2>
              </div>
              <p className={aboutStyles.standfirst}>
                {aboutPageContent.uk.standfirst}
              </p>
            </div>
            <AboutFamilyPhotos locale="uk" />
            <AboutRecipeStatuses locale="uk" id="about-statuses-example" />
            <p>
              <a href="/uk/about">Українська</a> ·{' '}
              <a href="/es/about">Español</a> · <a href="/en/about">English</a>
            </p>
          </section>

          <section
            className={styles.section}
            id="personal-account"
            aria-label="Personal accounts — identity, settings and sign-in"
          >
            <p>
              Local component examples with fictional identity data. Settings actions
              are inert; forms do not create accounts or send emails.
            </p>
            {(['uk', 'es', 'en'] as const).map((locale) => (
              <AccountExample key={locale} locale={locale} />
            ))}
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
                <strong>Shared Button</strong>
                <span>
                  4px radius · 44px minimum · terracotta / outline / text
                </span>
              </div>
              <div className={styles.actionRow}>
                <Button variant="default" type="button">
                  Search
                </Button>
                <Button variant="default" type="button">
                  Cook step by step
                </Button>
                <Button variant="default" size="lg" type="button">
                  Done, next
                </Button>
                <Button variant="outline" type="button">
                  Save for later
                </Button>
                <Button variant="link" type="button">
                  See all recipes <ArrowRight size={17} />
                </Button>
                <Button variant="default" type="button" disabled>
                  Unavailable
                </Button>
              </div>
            </div>

            <div className={styles.componentBlock}>
              <div className={styles.componentLabel}>
                <strong>Search</strong>
                <span>Shared search, with a compact mobile hero variant</span>
              </div>
              <RecipeSearchForm locale="en" id="ds-search" />
              <RecipeSearchForm locale="en" id="ds-search-hero" compactMobile />
              <p>
                Search names, ingredients and collections. Try “млинки”,
                “оладки” or “breakfast”. Exact titles rank first; aliases and
                small typos are supported.
              </p>
              <a href="/uk?q=млинки#recipes">Alias results</a>
              {' · '}
              <a href="/es?q=receta-inexistente#recipes">Empty results</a>
            </div>

            <div
              className={`${styles.componentBlock} ${styles.navigationBlock}`}
            >
              <div className={styles.componentLabel}>
                <strong>Site navigation</strong>
                <span>
                  Ukrainian-only social profiles: outline header links and quiet
                  footer links. Home and recipe endings share an email-only
                  invitation followed by the footer, without adjacent social
                  links. On mobile,
                  the social row scrolls away while navigation stays sticky.
                  The opaque page-colour header band and its lower divider span
                  the screen, including over lighter recipe sections.
                  English and Spanish omit social links; the email invitation
                  is localized.
                  Shopping list keeps an accessible icon on desktop and its full
                  name in the mobile menu. The short-page preview keeps its
                  footer at the bottom of the page without overlaying content.
                </span>
              </div>
              {(['uk', 'es', 'en'] as const).map((locale) => (
                <div
                  key={locale}
                  className={styles.siteHeaderExample}
                  lang={locale}
                >
                  <h3>
                    {
                      {
                        uk: 'Українська · соціальні посилання',
                        es: 'Español · sin enlaces sociales',
                        en: 'English · no social links',
                      }[locale]
                    }
                  </h3>
                  <SiteHeader locale={locale} pathname={`/${locale}`} />
                  <div className={styles.siteHeaderContrast}>
                    Lighter recipe surface below the continuous header band.
                  </div>
                  <NewsletterInvitation locale={locale} />
                  <SiteFooter locale={locale} />
                </div>
              ))}
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
                stronger type and terracotta icons in two label/value columns.
                Short catalogue names keep headings compact, centred beside
                Save; facts follow 8px below the complete title/control row.
                Photos, titles, facts, flour and footers align within each grid
                row without truncating names. All collection links stay visible
                as compact sand chips with full-height touch targets; long
                labels wrap naturally. A subtle card border keeps those final
                links visibly attached to their recipe. Check wrapping and
                keyboard focus at 390, 900 and 1440px.
              </p>
              <div className="recipe-grid recipe-grid--catalog-preview">
                {(
                  [
                    { locale: 'uk', id: 'gluten-free-napoleon' },
                    { locale: 'uk', id: 'fruit-sponge-roll' },
                    { locale: 'uk', id: 'crinkle-cookies' },
                    { locale: 'uk', id: 'banana-fritters' },
                    { locale: 'uk', id: 'easter-bread' },
                    { locale: 'uk', id: 'plum-cake' },
                    { locale: 'uk', id: 'cottage-cheese-waffles' },
                    { locale: 'uk', id: 'carrot-cake' },
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
                <strong>Localized catalogue order</strong>
                <span>
                  First six published recipes · approved editorial selection
                </span>
              </div>
              <p>
                Each language has its own discovery order. Collections keep that
                order; search ranks relevance first. The same DOM order flows
                through one, two and three columns without CSS reordering.
              </p>
              {(['uk', 'es', 'en'] as const).map((locale) => (
                <div key={locale} lang={locale}>
                  <h3>{localeMetadata[locale].label}</h3>
                  <div className="recipe-grid recipe-grid--catalog-preview">
                    {getRecipeCatalog(locale)
                      .slice(0, 6)
                      .map((recipe) => (
                        <RecipeCard
                          key={recipe.id}
                          recipe={{
                            ...recipe,
                            locale,
                            href: getLocalizedRecipePath(recipe.id, locale)!,
                          }}
                        />
                      ))}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.componentBlock}>
              <div className={styles.componentLabel}>
                <strong>Saved recipe · compact card</strong>
                <span>
                  Shared catalogue component · smaller image · localized title
                  and facts · independent Save control
                </span>
              </div>
              {(['uk', 'en', 'es'] as const).map((locale) => {
                const recipe = getRecipeCatalog(locale, 'all').find(
                  (entry) => entry.id === 'crepes',
                )!;
                return (
                  <RecipeCard
                    key={locale}
                    variant="compact"
                    recipe={{
                      ...recipe,
                      locale,
                      href: getLocalizedRecipePath(recipe.id, locale)!,
                    }}
                  />
                );
              })}
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
                  content={getRecipeContent('eclairs', 'uk')}
                  locale="uk"
                />
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

            <div className={styles.componentBlock} id="scaling-consistency">
              <div className={styles.componentLabel}>
                <strong>Calculated method and preparation notes</strong>
                <span>
                  2× quantities · proportional alternatives · blocked unresolved
                  Cook version
                </span>
              </div>
              <div className={styles.recipeOverviewExample}>
                {(['uk', 'en', 'es'] as const).map((locale) => {
                  const plum = applySourceRecipeConfiguration(
                    getRecipeContent('plum-cake', locale)!,
                    { kind: 'adjusted', scaleFactor: 2 },
                    locale,
                  );
                  const napoleon = applySourceRecipeConfiguration(
                    getRecipeContent('gluten-free-napoleon', locale)!,
                    { kind: 'adjusted', scaleFactor: 2 },
                    locale,
                  );
                  const fritters = applySourceRecipeConfiguration(
                    getRecipeContent('apple-fritters', locale)!,
                    { kind: 'adjusted', scaleFactor: 2 },
                    locale,
                  );
                  const sweetener = fritters.ingredientSections
                    .flatMap((section) => section.ingredients)
                    .find((line) => line.id === 'sweetener')!;
                  const step = plum.steps.find(
                    (item) => item.id === 'fold-butter',
                  )!;
                  const blocked = resolveNapoleonCookConfiguration(
                    'mode=ingredient&ingredient=schar-mix-b&amount=200&unit=g',
                    locale,
                  );
                  return (
                    <div key={locale} lang={locale}>
                      <EvidenceBadge locale={locale} status="calculated" />
                      <RecipeStepContent
                        title={step.title}
                        headingLevel="h3"
                        locale={locale}
                        tipLabel={getUiMessages(locale).recipe.tip}
                        checkpointLabel={
                          getUiMessages(locale).recipe.checkpoint
                        }
                      >
                        <p>{step.body}</p>
                      </RecipeStepContent>
                      <RecipePlanItem
                        label={getUiMessages(locale).recipe.keepInMind}
                      >
                        {
                          getRecipeContent('prune-cake', locale)
                            ?.beforeStart?.[1]
                        }
                      </RecipePlanItem>
                      <p>
                        {
                          napoleon.steps.find(
                            (item) => item.id === 'mix-custard-base',
                          )?.body
                        }
                      </p>
                      <p>
                        {
                          napoleon.steps.find(
                            (item) => item.id === 'assemble-cake',
                          )?.body
                        }
                      </p>
                      <p>
                        {sweetener.name}:{' '}
                        {formatQuantity(locale, sweetener.quantity.base)}.{' '}
                        {sweetener.note}
                      </p>
                      {blocked.kind === 'blocked' && <p>{blocked.reason}</p>}
                      <RecipeConfigurationUnavailable
                        locale={locale}
                        variant="detail"
                        titleId={`unsupported-${locale}`}
                        reason={
                          getUiMessages(locale).scaling.unsupportedGeometry
                        }
                        href={getLocalizedRecipePath(
                          'gluten-free-napoleon',
                          locale,
                        )!}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.componentBlock} id="release-states">
              <div className={styles.componentLabel}>
                <strong>Composed recipe evidence and missing pages</strong>
                <span>
                  Suggested pair · independent component evidence · localized
                  recovery
                </span>
              </div>
              {(['uk', 'en', 'es'] as const).map((locale) => (
                <div key={locale} lang={locale}>
                  <RecipeOverview
                    locale={locale}
                    showWorkingRecord={false}
                    content={composeRecipeWithCream(
                      getRecipeContent('eclairs', locale)!,
                      getRecipeContent('vanilla-egg-custard', locale),
                      'vanilla-egg-custard',
                      locale,
                    )}
                  />
                  <NotFoundContent
                    locale={locale}
                    headingId={`missing-example-${locale}`}
                  />
                </div>
              ))}
            </div>

            <div className={styles.componentBlock}>
              <div className={styles.componentLabel}>
                <strong>Cream choice cards</strong>
                <span>
                  Chocolate recommendation label on the card edge · aligned
                  titles, descriptions and recipe links · neutral selection
                  guidance
                </span>
              </div>
              <RecipeCreamSelector
                locale="uk"
                options={creamSelectorOptions}
                recommendedRecipeId="mascarpone-whipped-cream"
                selectedRecipeId={null}
              />
            </div>

            <div className={styles.componentBlock} id="recipe-reading-actions">
              <div className={styles.componentLabel}>
                <strong>Recipe hero navigation and cooking entry</strong>
                <span>
                  Back and Save share the mobile hero row · native section links
                  · Cook first, recipe-wide question second
                </span>
              </div>
              <div className={styles.recipeOverviewExample}>
                {(['uk', 'en', 'es'] as const).map((locale) => (
                  <AssistantProvider
                    key={locale}
                    recipeId="plum-cake"
                    recipeVersionId={
                      getRecipeDocument('plum-cake')?.recipe.versionId ??
                      'plum-cake-source-v1'
                    }
                    recipeTitle={recipeDetailTitles['plum-cake'][locale]}
                    locale={locale}
                    surface="recipe-detail"
                  >
                    <div lang={locale}>
                      <div className={styles.recipeHeroActionsExample}>
                        <RecipeBackLink
                          fallbackHref={`/${locale}#recipes`}
                          fallbackLabel={
                            getUiMessages(locale).recipe.backToRecipes
                          }
                          returnLabel={
                            getUiMessages(locale).cook.returnToRecipe
                          }
                        />
                        <SaveRecipeControl
                          locale={locale}
                          recipeId="plum-cake"
                          title={recipeDetailTitles['plum-cake'][locale]}
                        />
                      </div>
                      <RecipeSectionNavigation
                        locale={locale}
                        ingredientsHref={`#reading-ingredients-${locale}`}
                        methodHref={`#reading-method-${locale}`}
                      />
                      <h3 id={`reading-ingredients-${locale}`} tabIndex={-1}>
                        {getUiMessages(locale).recipe.ingredients}
                      </h3>
                      <p className={styles.eyebrow}>
                        {getUiMessages(locale).recipe.method(19)}
                      </p>
                      <h3 id={`reading-method-${locale}`} tabIndex={-1}>
                        {recipeReaderCopy[locale].method}
                      </h3>
                      <RecipeCookEntry
                        locale={locale}
                        href={getLocalizedRecipePath(
                          'plum-cake',
                          locale,
                          '/cook',
                        )!}
                        secondaryAction={
                          <AssistantTrigger
                            configuration={{ kind: 'base' }}
                            label={assistantMessages[locale].trigger.recipe}
                            scope={{ kind: 'recipe' }}
                          />
                        }
                      />
                    </div>
                  </AssistantProvider>
                ))}
              </div>
            </div>

            <div className={styles.componentBlock} id="recipe-utilities">
              <div className={styles.componentLabel}>
                <strong>Share, print and return to a recipe</strong>
                <span>
                  Resolved configuration links · full-width browser-local history ·
                  provider-hosted email signup
                </span>
              </div>
              <div className={styles.recipeOverviewExample}>
                {(['uk', 'en', 'es'] as const).map((locale) => {
                  const links = recipePublicLink('plum-cake', locale, {
                    kind: 'adjusted',
                    mode: 'scale',
                    scaleFactor: 2,
                  })!;
                  return (
                    <div
                      key={locale}
                      lang={locale}
                      id={`recipe-utilities-${locale}`}
                    >
                      <RecipeUtilityActions
                        locale={locale}
                        title={recipeDetailTitles['plum-cake'][locale]}
                        url={links.url}
                        printHref={links.printHref}
                      />
                      <RecentRecipes
                        locale={locale}
                        recipes={getRecipeCatalog(locale)}
                        preview
                      />
                      <NewsletterInvitation locale={locale} />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.componentBlock} id="concise-recipe">
              <div className={styles.componentLabel}>
                <strong>Concise recipe</strong>
                <span>
                  Edited copy · mobile ingredients-first adjustment · badge-only
                  evidence
                </span>
              </div>
              {(['uk', 'en', 'es'] as const).map((locale) => {
                const recipe = getRecipeContent(
                  locale === 'es'
                    ? 'crepes'
                    : locale === 'en'
                      ? 'crinkle-cookies'
                      : 'plum-cake',
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
                      syncConfigurationToUrl={false}
                      recipe={recipe}
                      archiveSections={[]}
                      locale={locale}
                      scalingAnchorIngredientId={
                        locale === 'en' ? 'flour' : 'eggs'
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

            <div className={styles.componentBlock} id="roll-assembly">
              <div className={styles.componentLabel}>
                <strong>Recipe assembly guidance</strong>
                <span>
                  Complete method before cream selection · final serving tip
                </span>
              </div>
              {(['uk', 'en', 'es'] as const).map((locale) => {
                const recipe = composeRecipeWithCream(
                  getRecipeContent('fruit-sponge-roll', locale)!,
                  null,
                  null,
                );
                const step = recipe.steps.find((item) => item.id === 'fill')!;
                return (
                  <div key={locale} lang={locale}>
                    <RecipeStepContent
                      title={step.title}
                      tip={step.tip}
                      tipLabel={
                        locale === 'uk'
                          ? 'Порада'
                          : locale === 'es'
                            ? 'Consejo'
                            : 'Tip'
                      }
                      checkpointLabel=""
                    >
                      <p>{step.body}</p>
                    </RecipeStepContent>
                    <StepMediaSequence
                      items={step.media!}
                      ariaLabel={step.title}
                    />
                  </div>
                );
              })}
            </div>

            <div className={styles.componentBlock} id="step-photography">
              <div className={styles.componentLabel}>
                <strong>Step photography</strong>
                <span>
                  Equal frame sizes · simple photo numbers · next-photo peek on
                  mobile
                </span>
              </div>
              <div className={styles.stepPhotographyExamples}>
                {(['recipe', 'cook'] as const).map((variant) => (
                  <div key={variant}>
                    <h3>
                      {variant === 'recipe' ? 'Recipe detail' : 'Cook Mode'}
                    </h3>
                    <p>
                      One photo keeps the same size as each photo in a sequence.
                    </p>
                    <p>
                      Landscape process photos fill the 4:3 frame while keeping
                      the food and preparation details visible.
                    </p>
                    <p>
                      In numbered recipe steps, photos align with the
                      instruction text at desktop, tablet and mobile widths. See
                      the live Napoleon recipe reference below.
                    </p>
                    <StepMediaSequence
                      items={
                        getRecipeContent('gluten-free-napoleon', 'en')!.steps[0]
                          .media!
                      }
                      ariaLabel={`${variant}: complete process photo`}
                      variant={variant}
                    />
                    <StepMediaSequence
                      items={
                        getRecipeContent('sponge-cake', 'en')!.steps[0].media!
                      }
                      ariaLabel={`${variant}: single photo`}
                      variant={variant}
                    />
                    <StepMediaSequence
                      items={
                        getRecipeContent('sponge-cake', 'en')!.steps[2].media!
                      }
                      ariaLabel={`${variant}: ordered photos`}
                      variant={variant}
                    />
                    <StepMediaSequence
                      items={[
                        {
                          id: 'author-video-example',
                          type: 'video',
                          src: '/media/recipes/celebration-sponge-cake/selected/author-cake-overview-v1.mp4',
                          alt: 'Fruit cake with chocolate glaze',
                          caption: 'Fruit cake · play on demand',
                        },
                      ]}
                      ariaLabel={`${variant}: fruit cake video`}
                      variant={variant}
                    />
                  </div>
                ))}
              </div>
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
                    <small>Your recipe note</small>
                    <strong>You made this recipe</strong>
                    <span>Last made 20 Sep 2026 · Private to this browser</span>
                    <p>
                      Use a little less milk next time and keep the pan slightly
                      hotter.
                    </p>
                  </div>
                  <Button variant="outline" type="button">
                    Cook again
                  </Button>
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
                  <Button variant="default" type="button">
                    <ShoppingBag size={16} /> To shopping list…
                  </Button>
                  <div className={styles.shoppingReviewExample}>
                    <strong>What do you need to buy?</strong>
                    <small>Napoleon cake · 24 cm · 1×</small>
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
                      <Button variant="default" type="button">
                        Add to list (2)
                      </Button>
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
                <RecipeIngredientHeading
                  title="Інгредієнти"
                  id="mobile-ingredients-example"
                  action={
                    <div className={shoppingControlStyles.control}>
                      <div className={shoppingControlStyles.actions}>
                        <Button variant="outline">
                          <Check aria-hidden="true" size={16} />У списку покупок
                          · 8
                        </Button>
                        <Button>
                          <ShoppingBag aria-hidden="true" size={16} />
                          Додати ще одну порцію…
                        </Button>
                      </div>
                    </div>
                  }
                />
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
                <strong>Cook tools and drawers</strong>
                <span>
                  Shared number circles and row dividers · full width on mobile
                  · visible Close · Escape and focus return · labelled screen
                  wake control with active and error states
                </span>
              </div>
              <CookToolsExample />
              {(['uk', 'en', 'es'] as const).map((locale) => (
                <div key={locale} lang={locale}>
                  <CookTimerExample
                    locale={locale}
                    step={createSourceCookSteps(
                      getRecipeContent('eclairs', locale)!,
                      locale,
                    ).find((step) => step.stepIds.includes('bake'))!}
                  />
                </div>
              ))}
            </div>

            <div className={styles.componentBlock} id="technique-help">
              <div className={styles.componentLabel}>
                <strong>Plan-ahead technique guide</strong>
                <span>
                  Clock and written label · inline link · no nested card ·
                  shared drawer and standalone guide
                </span>
              </div>
              {(['uk', 'en', 'es'] as const).map((locale) => (
                <div key={locale} lang={locale}>
                  <RecipePlanItem
                    label={getUiMessages(locale).recipe.keepInMind}
                  >
                    <TechniqueHelp
                      locale={locale}
                      reference={{
                        id: 'soften-butter',
                        condition: 'room-temperature-butter',
                      }}
                    />
                  </RecipePlanItem>
                </div>
              ))}
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

            <div className={styles.componentBlock} id="step-questions">
              <div className={styles.componentLabel}>
                <strong>Compact method steps · UK / EN / ES</strong>
                <span>
                  Desktop: terracotta time above the title, Questions beside it
                  · Mobile: number, secondary time and Questions in one row ·
                  examples with both, either or neither optional control
                </span>
              </div>
              {(['uk', 'en', 'es'] as const).map((locale) => {
                const steps = getRecipeContent(
                  'gluten-free-napoleon',
                  locale,
                )!.steps;
                return (
                  <AssistantProvider
                    key={locale}
                    recipeId="gluten-free-napoleon"
                    recipeVersionId={
                      getRecipeDocument('gluten-free-napoleon')!.recipe
                        .versionId ?? 'gluten-free-napoleon-source-v1'
                    }
                    recipeTitle={
                      recipeDetailTitles['gluten-free-napoleon'][locale]
                    }
                    locale={locale}
                    surface="recipe-detail"
                  >
                    <div lang={locale} className={styles.methodStepExamples}>
                      {[0, 1, 2, 4].map((index) => {
                        const step = steps[index];
                        const answers = resolveStepHelp(step);
                        return (
                          <RecipeStepContent
                            key={step.id}
                            stepNumber={String(index + 1).padStart(2, '0')}
                            meta={step.meta}
                            title={step.title}
                            locale={locale}
                            actionPlacement="metadata"
                            checkpoint={step.checkpoint}
                            checkpointLabel={
                              getUiMessages(locale).recipe.checkpoint
                            }
                            tipLabel={getUiMessages(locale).recipe.tip}
                            action={
                              answers.length ? (
                                <AssistantTrigger
                                  configuration={{ kind: 'base' }}
                                  scope={{ kind: 'step', stepIds: [step.id] }}
                                  stepTitle={step.title}
                                  compact
                                  label={
                                    stepHelpMessages[locale].compactTrigger
                                  }
                                  ariaLabel={`${stepHelpMessages[locale].trigger}: ${step.title}`}
                                  preparedAnswers={answers}
                                />
                              ) : undefined
                            }
                          >
                            <p>{step.body}</p>
                          </RecipeStepContent>
                        );
                      })}
                    </div>
                  </AssistantProvider>
                );
              })}
            </div>

            <div className={styles.componentBlock}>
              <div className={styles.componentLabel}>
                <strong>Contextual assistant</strong>
                <span>
                  Shared Recipe and Cook drawer · compact contextual title ·
                  loading announcement · Close focus after submit/review ·
                  localized offline retry · scrollable at 200% text ·
                  custom-question limits · verification after input focus
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
                <p>Schär Mix B · 24 cm round form · 12 layers</p>
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
