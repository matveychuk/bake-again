import { appleBananaFrittersRecipe } from './apple-banana-fritters.recipe.ts';
import { appleCharlotteRecipe } from './apple-charlotte.recipe.ts';
import { appleFrittersRecipe } from './apple-fritters.recipe.ts';
import { bananaBreadRecipe } from './banana-bread.recipe.ts';
import { bananaFrittersRecipe } from './banana-fritters.recipe.ts';
import { carrotCakeRecipe } from './carrot-cake.recipe.ts';
import { cinnamonRollsRecipe } from './cinnamon-rolls.recipe.ts';
import { cottageCheeseWafflesRecipe } from './cottage-cheese-waffles.recipe.ts';
import { crepesRecipe } from './crepes.recipe.ts';
import { crinkleCookiesRecipe } from './crinkle-cookies.recipe.ts';
import { eclairsRecipe } from './eclairs.recipe.ts';
import { easterBreadRecipe } from './easter-bread.recipe.ts';
import { fruitSpongeRollRecipe } from './fruit-sponge-roll.recipe.ts';
import { glutenFreeNapoleonRecipe } from './gluten-free-napoleon.recipe.ts';
import { recipeInventory } from './inventory.ts';
import { lazyDumplingsRecipe } from './lazy-dumplings.recipe.ts';
import { pruneCakeRecipe } from './prune-cake.recipe.ts';
import type { RecipeDraft } from './recipe.types.ts';
import type { Duration } from './recipe.types.ts';
import type { AppLocale } from '../../lib/i18n/config.ts';
import { getUiMessages } from '../../lib/i18n/messages.ts';
import type {
  RecipeSourceDraft,
  StructuredRecipeContent,
} from './source-recipe.types.ts';
import { spongeCakeRecipe } from './sponge-cake.recipe.ts';

export type RecipeDocument =
  | { kind: 'detailed'; recipe: RecipeDraft }
  | { kind: 'sourceDraft'; recipe: RecipeSourceDraft };

/**
 * The single recipe-content index. Every recipe lives in its own `.recipe.ts`
 * file; this registry is the only place that connects a stable recipe ID to it.
 */
export const recipeDocuments: readonly RecipeDocument[] = [
  { kind: 'detailed', recipe: glutenFreeNapoleonRecipe },
  { kind: 'detailed', recipe: crinkleCookiesRecipe },
  { kind: 'sourceDraft', recipe: appleCharlotteRecipe },
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

function formatDuration(locale: AppLocale, duration: Duration): string {
  const unit =
    duration.unit === 'minute'
      ? 'min'
      : duration.unit === 'hour'
        ? 'hr'
        : 'sec';
  if (duration.kind === 'exact') return `${duration.value} ${unit}`;
  if (duration.kind === 'minimum')
    return locale === 'uk'
      ? `Щонайменше ${duration.min} ${unit}`
      : locale === 'es'
        ? `Como mínimo ${duration.min} ${unit}`
        : `at least ${duration.min} ${unit}`;
  return `${duration.min}–${duration.max} ${unit}`;
}

function detailedRecipeContent(
  recipe: RecipeDraft,
  locale: AppLocale,
): StructuredRecipeContent {
  return {
    completeness: recipe.contentGaps.some((gap) => gap.area === 'method')
      ? 'incompleteSource'
      : 'readyToReview',
    yield:
      recipe.yield.default.amount === null
        ? undefined
        : {
            id: recipe.yield.default.id,
            label: recipe.yield.default.label[locale],
            count: {
              kind: 'exact',
              value: recipe.yield.default.amount,
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
    timing: {
      activeMinutes: recipe.timing.activeMinutes,
      totalElapsedMinutes: recipe.timing.totalElapsedMinutes,
      phases: recipe.timing.phases.map((phase) => ({
        id: phase.id,
        label: phase.label[locale],
        duration: phase.duration,
      })),
    },
    beforeStart: recipe.beforeStart.map((item) => item.text[locale]),
    ingredientSections: recipe.ingredientSections.map((section) => ({
      id: section.id,
      title: section.title[locale],
      ingredients: section.lines.map((line) => ({
        id: line.id,
        name: line.options[0].name[locale],
        quantity: line.quantity,
        optional: line.optional,
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
      id: step.id,
      title: step.instruction[locale],
      body: step.instruction[locale],
      meta:
        [
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
    return {
      ...localized,
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
              phases: localized.timing.phases.map((phase, phaseIndex) => ({
                ...phase,
                duration:
                  document.recipe.timing?.phases[phaseIndex]?.duration ??
                  phase.duration,
                relatedStepId:
                  document.recipe.timing?.phases[phaseIndex]?.relatedStepId ??
                  phase.relatedStepId,
              })),
            }
          : undefined,
      ingredientSections: localized.ingredientSections.map(
        (section, sectionIndex) => ({
          ...section,
          ingredients: section.ingredients.map(
            (ingredient, ingredientIndex) => ({
              ...ingredient,
              quantity:
                document.recipe.ingredientSections[sectionIndex]?.ingredients[
                  ingredientIndex
                ]?.quantity ?? ingredient.quantity,
            }),
          ),
        }),
      ),
    };
  }
  return {
    completeness: 'incompleteSource',
    ingredientSections: [],
    steps: [],
    gapNote: getUiMessages(locale).recipe.translationPending,
  };
}
