import { appleBananaFrittersRecipe } from './apple-banana-fritters.recipe.ts';
import { appleCharlotteRecipe } from './apple-charlotte.recipe.ts';
import { appleFrittersRecipe } from './apple-fritters.recipe.ts';
import { appleMeringuePieRecipe } from './apple-meringue-pie.recipe.ts';
import { bananaBreadRecipe } from './banana-bread.recipe.ts';
import { bananaFrittersRecipe } from './banana-fritters.recipe.ts';
import { carrotCakeRecipe } from './carrot-cake.recipe.ts';
import { cinnamonRollsRecipe } from './cinnamon-rolls.recipe.ts';
import { cottageCheeseWafflesRecipe } from './cottage-cheese-waffles.recipe.ts';
import { crepesRecipe } from './crepes.recipe.ts';
import { crinkleCookiesRecipe } from './crinkle-cookies.recipe.ts';
import {
  egglessVanillaCustardRecipe,
  mascarponeWhippedCreamRecipe,
  vanillaButtercreamRecipe,
  vanillaEggCustardRecipe,
} from './cream-recipes.ts';
import { eclairsRecipe } from './eclairs.recipe.ts';
import { easterBreadRecipe } from './easter-bread.recipe.ts';
import { fruitSpongeRollRecipe } from './fruit-sponge-roll.recipe.ts';
import { glutenFreeNapoleonRecipe } from './gluten-free-napoleon.recipe.ts';
import { recipeInventory } from './inventory.ts';
import { lazyDumplingsRecipe } from './lazy-dumplings.recipe.ts';
import { plumCakeRecipe } from './plum-cake.recipe.ts';
import { pruneCakeRecipe } from './prune-cake.recipe.ts';
import type { RecipeDifficulty, RecipeDraft } from './recipe.types.ts';
import type { AppLocale } from '../../lib/i18n/config.ts';
import { formatDuration } from '../../lib/i18n/format.ts';
import { getUiMessages } from '../../lib/i18n/messages.ts';
import type {
  RecipeSourceDraft,
  StructuredRecipeContent,
  StructuredRecipeTiming,
} from './source-recipe.types.ts';
import { celebrationSpongeCakeRecipe } from './celebration-sponge-cake.recipe.ts';
import { sourCreamRecipe } from './sour-cream.recipe.ts';
import { lemonCreamCheeseRecipe } from './lemon-cream-cheese.recipe.ts';
import { chocolateGlazeRecipe } from './chocolate-glaze.recipe.ts';
import { spongeCakeRecipe } from './sponge-cake.recipe.ts';

function inventoryDifficulty(value: string | null): RecipeDifficulty | null {
  switch (value?.toLowerCase()) {
    case 'easy':
      return 'easy';
    case 'medium':
    case 'intermediate':
      return 'medium';
    case 'advanced':
      return 'advanced';
    default:
      return null;
  }
}

function localizedFlourSummary(recipeId: string, locale: AppLocale): string {
  const inventory = recipeInventory.find((recipe) => recipe.id === recipeId);
  const localized = inventory?.localizedFacts?.flour?.[locale];
  if (localized) return localized;

  const flour = inventory?.flour ?? '';
  const translations: Record<string, Record<AppLocale, string>> = {
    'Schär Mix B Bread': {
      en: 'Schär Mix B Bread',
      es: 'Schär Mix B Bread',
      uk: 'Schär Mix B Bread',
    },
    'Schär Mix B Bread + tapioca starch': {
      en: 'Schär Mix B Bread + tapioca starch',
      es: 'Schär Mix B Bread + almidón de tapioca',
      uk: 'Schär Mix B Bread + тапіоковий крохмаль',
    },
    'Schär Mix B Bread + corn starch': {
      en: 'Schär Mix B Bread + corn starch',
      es: 'Schär Mix B Bread + almidón de maíz',
      uk: 'Schär Mix B Bread + кукурудзяний крохмаль',
    },
    'Schär Mix B Bread + tapioca and corn starch': {
      en: 'Schär Mix B Bread + tapioca and corn starch',
      es: 'Schär Mix B Bread + almidones de tapioca y maíz',
      uk: 'Schär Mix B Bread + тапіоковий і кукурудзяний крохмалі',
    },
    'Rice flour + corn and tapioca starch': {
      en: 'Rice flour + corn and tapioca starch',
      es: 'Harina de arroz + almidones de maíz y tapioca',
      uk: 'Рисове борошно + кукурудзяний і тапіоковий крохмалі',
    },
  };

  return translations[flour]?.[locale] ?? flour;
}

function planningNote(
  timing: StructuredRecipeTiming | undefined,
  locale: AppLocale,
): string | null {
  const note = timing?.planningNote;
  if (!note) return null;
  if (!note.phaseId) return note.text;
  const phase = timing.phases.find((item) => item.id === note.phaseId);
  return phase
    ? note.text.replaceAll('{duration}', formatDuration(locale, phase.duration))
    : null;
}

function sourceRecipeOverview(
  recipeId: string,
  locale: AppLocale,
  content: Partial<
    Pick<StructuredRecipeContent, 'difficulty' | 'timing' | 'yield'>
  >,
) {
  const inventory = recipeInventory.find((recipe) => recipe.id === recipeId);

  return {
    difficulty:
      content.difficulty ?? inventoryDifficulty(inventory?.difficulty ?? null),
    timing: {
      activeMinutes: content.timing?.activeMinutes ?? null,
      totalElapsedMinutes: content.timing?.totalElapsedMinutes ?? null,
      planningNote: planningNote(content.timing, locale),
    },
    yieldLabel: content.yield?.label ?? null,
    flour: localizedFlourSummary(recipeId, locale),
  };
}

export type RecipeDocument =
  | { kind: 'detailed'; recipe: RecipeDraft }
  | { kind: 'sourceDraft'; recipe: RecipeSourceDraft };

/**
 * The single recipe-content index. Every recipe lives in its own `.recipe.ts`
 * file; this registry is the only place that connects a stable recipe ID to it.
 */
export const recipeDocuments: readonly RecipeDocument[] = [
  ...[
    celebrationSpongeCakeRecipe,
    sourCreamRecipe,
    lemonCreamCheeseRecipe,
    chocolateGlazeRecipe,
  ].map((recipe) => ({ kind: 'sourceDraft' as const, recipe })),
  { kind: 'detailed', recipe: glutenFreeNapoleonRecipe },
  { kind: 'detailed', recipe: crinkleCookiesRecipe },
  { kind: 'sourceDraft', recipe: appleCharlotteRecipe },
  { kind: 'sourceDraft', recipe: plumCakeRecipe },
  { kind: 'sourceDraft', recipe: cottageCheeseWafflesRecipe },
  { kind: 'sourceDraft', recipe: carrotCakeRecipe },
  { kind: 'sourceDraft', recipe: spongeCakeRecipe },
  { kind: 'sourceDraft', recipe: crepesRecipe },
  { kind: 'sourceDraft', recipe: fruitSpongeRollRecipe },
  { kind: 'sourceDraft', recipe: bananaBreadRecipe },
  { kind: 'sourceDraft', recipe: lazyDumplingsRecipe },
  { kind: 'sourceDraft', recipe: pruneCakeRecipe },
  { kind: 'sourceDraft', recipe: cinnamonRollsRecipe },
  { kind: 'sourceDraft', recipe: eclairsRecipe },
  { kind: 'sourceDraft', recipe: easterBreadRecipe },
  { kind: 'sourceDraft', recipe: appleFrittersRecipe },
  { kind: 'sourceDraft', recipe: bananaFrittersRecipe },
  { kind: 'sourceDraft', recipe: appleBananaFrittersRecipe },
  { kind: 'sourceDraft', recipe: appleMeringuePieRecipe },
  { kind: 'sourceDraft', recipe: mascarponeWhippedCreamRecipe },
  { kind: 'sourceDraft', recipe: vanillaEggCustardRecipe },
  { kind: 'sourceDraft', recipe: egglessVanillaCustardRecipe },
  { kind: 'sourceDraft', recipe: vanillaButtercreamRecipe },
] satisfies readonly RecipeDocument[];

/** Recipes whose stable IDs and localized ingredient data support personal state. */
export const personalStateRecipes: readonly RecipeDraft[] = recipeDocuments
  .filter(
    (document): document is Extract<RecipeDocument, { kind: 'detailed' }> =>
      document.kind === 'detailed',
  )
  .map((document) => document.recipe);

export function getPersonalStateRecipe(recipeId: string): RecipeDraft | null {
  return personalStateRecipes.find((recipe) => recipe.id === recipeId) ?? null;
}

export function isPersonalStateRecipeId(recipeId: string): boolean {
  return getPersonalStateRecipe(recipeId) !== null;
}

/** Every inventory recipe has a stable identity and may be saved for later. */
export function isSaveableRecipeId(recipeId: string): boolean {
  return recipeInventory.some((recipe) => recipe.id === recipeId);
}

export function getRecipeDocument(recipeId: string): RecipeDocument | null {
  return (
    recipeDocuments.find((document) => document.recipe.id === recipeId) ?? null
  );
}

function detailedRecipeContent(
  recipe: RecipeDraft,
  locale: AppLocale,
): StructuredRecipeContent {
  const messages = getUiMessages(locale);
  const yieldAmount = recipe.yield.default.amount;
  const yieldLabel =
    yieldAmount === null ? null : recipe.yield.default.label[locale];
  const timing: StructuredRecipeTiming = {
    activeMinutes: recipe.timing.activeMinutes,
    totalElapsedMinutes: recipe.timing.totalElapsedMinutes,
    planningNote: recipe.timing.planningNote
      ? {
          ...recipe.timing.planningNote,
          text: recipe.timing.planningNote.text[locale],
        }
      : null,
    phases: recipe.timing.phases.map((phase) => ({
      id: phase.id,
      label: phase.label[locale],
      duration: phase.duration,
      relatedStepId: phase.relatedStepId,
    })),
  };

  return {
    presentation: recipe.presentation,
    overview: {
      difficulty: recipe.difficulty,
      timing: {
        activeMinutes: recipe.timing.activeMinutes,
        totalElapsedMinutes: recipe.timing.totalElapsedMinutes,
        planningNote: planningNote(timing, locale),
      },
      yieldLabel,
      flour: localizedFlourSummary(recipe.id, locale),
    },
    completeness: recipe.contentGaps.some((gap) => gap.area === 'method')
      ? 'incompleteSource'
      : 'readyToReview',
    evidence: {
      status: 'tested',
      explanation:
        recipe.baseProvenance.state === 'repeatedlyVerified'
          ? messages.status.tested.repeatedExplanation
          : messages.status.tested.explanation,
    },
    yield:
      yieldAmount === null
        ? undefined
        : {
            id: recipe.yield.default.id,
            label: recipe.yield.default.label[locale],
            count: {
              kind: 'exact',
              value: yieldAmount,
            },
            unit: recipe.yield.default.unit,
          },
    geometry: {
      id: recipe.geometry.default.id,
      label: recipe.geometry.default.label[locale],
      kind: recipe.geometry.default.kind,
      application: recipe.geometry.default.application,
      shape: recipe.geometry.default.shape,
      diameterCm: recipe.geometry.default.diameterCm,
      widthCm: recipe.geometry.default.widthCm,
      lengthCm: recipe.geometry.default.lengthCm,
    },
    timing,
    beforeStart: recipe.beforeStart.length
      ? recipe.beforeStart.map((item) => item.text[locale])
      : undefined,
    creamOptions: recipe.creamOptions,
    ingredientSections: recipe.ingredientSections.map((section) => ({
      id: section.id,
      title: section.title[locale],
      ingredients: section.lines.map((line) => ({
        id: line.id,
        name: line.options[0].name[locale],
        quantity: line.quantity,
        optional: line.optional,
        scaling: line.scaling?.kind === 'fixed' ? 'fixed' : undefined,
        note:
          [
            line.preparation?.[locale],
            line.qualifier?.[locale],
            line.condition?.[locale],
          ]
            .filter(Boolean)
            .join(' · ') || undefined,
      })),
    })),
    steps: recipe.steps.map((step) => ({
      technique: step.technique,
      id: step.id,
      title: step.title?.[locale] ?? step.instruction[locale],
      body: step.instruction[locale],
      cookIngredients: step.ingredientLineIds.map((ingredientId) => ({
        ingredientId,
      })),
      meta:
        recipe.presentation === 'concise'
          ? undefined
          : [
              step.duration && formatDuration(locale, step.duration),
              step.temperature &&
                `${step.temperature.value}°${step.temperature.unit}`,
            ]
              .filter(Boolean)
              .join(' · ') || undefined,
      checkpoint: step.guidance?.find(
        (guidance) => guidance.kind === 'checkpoint',
      )?.text[locale],
      tip: step.guidance?.find((guidance) => guidance.kind === 'practicalTip')
        ?.text[locale],
      media: step.mediaIds?.flatMap((mediaId) => {
        const item = recipe.media.find((candidate) => candidate.id === mediaId);
        if (!item || item.type !== 'image') return [];
        return [
          {
            id: item.id,
            src: item.path,
            alt: item.alt[locale],
            caption: item.caption?.[locale],
          },
        ];
      }),
    })),
    gapNote:
      recipe.contentGaps
        .filter((gap) => gap.publicationBlocking)
        .map((gap) => gap.question)
        .join(' ') || undefined,
  };
}

/** Content for recipe pages and Cook Mode, regardless of recipe-file maturity. */
export function getRecipeContent(
  recipeId: string,
  locale: AppLocale = 'en',
): StructuredRecipeContent | null {
  const document = getRecipeDocument(recipeId);
  if (!document) return null;
  if (document.kind === 'detailed')
    return detailedRecipeContent(document.recipe, locale);
  const localized =
    locale === 'en' ? document.recipe : document.recipe.translations?.[locale];
  if (localized) {
    // Text is localized, but quantities remain the one source-of-truth record.
    // This prevents a translated display string from becoming a second numeric model.
    const content = {
      ...localized,
      creamOptions: document.recipe.creamOptions,
      yield:
        localized.yield && document.recipe.yield
          ? {
              ...localized.yield,
              count: document.recipe.yield.count,
              unit: document.recipe.yield.unit,
            }
          : undefined,
      geometry:
        localized.geometry && document.recipe.geometry
          ? {
              ...localized.geometry,
              kind: document.recipe.geometry.kind,
              application: document.recipe.geometry.application,
              shape: document.recipe.geometry.shape,
              diameterCm: document.recipe.geometry.diameterCm,
              widthCm: document.recipe.geometry.widthCm,
              lengthCm: document.recipe.geometry.lengthCm,
            }
          : undefined,
      timing:
        localized.timing && document.recipe.timing
          ? {
              activeMinutes: document.recipe.timing.activeMinutes,
              totalElapsedMinutes: document.recipe.timing.totalElapsedMinutes,
              planningNote: localized.timing.planningNote
                ? {
                    ...localized.timing.planningNote,
                    phaseId: document.recipe.timing.planningNote?.phaseId,
                  }
                : null,
              phases: localized.timing.phases.map((phase) => ({
                ...phase,
                duration:
                  document.recipe.timing?.phases.find(
                    (item) => item.id === phase.id,
                  )?.duration ?? phase.duration,
                relatedStepId:
                  document.recipe.timing?.phases.find(
                    (item) => item.id === phase.id,
                  )?.relatedStepId ?? phase.relatedStepId,
              })),
            }
          : undefined,
      ingredientSections: localized.ingredientSections.map(
        (section, sectionIndex) => ({
          ...section,
          ingredients: section.ingredients.map(
            (ingredient, ingredientIndex) => ({
              ...ingredient,
              scaling:
                document.recipe.ingredientSections[sectionIndex]?.ingredients[
                  ingredientIndex
                ]?.scaling,
              quantity:
                document.recipe.ingredientSections[sectionIndex]?.ingredients[
                  ingredientIndex
                ]?.quantity ?? ingredient.quantity,
            }),
          ),
        }),
      ),
    };
    return {
      ...content,
      overview: sourceRecipeOverview(recipeId, locale, content),
    };
  }
  return {
    overview: sourceRecipeOverview(recipeId, locale, {}),
    completeness: 'incompleteSource',
    ingredientSections: [],
    steps: [],
    gapNote: getUiMessages(locale).recipe.translationPending,
  };
}
