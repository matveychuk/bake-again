import { getStepHelpDefinitions } from './step-help.ts';
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
import { lazyDumplingsRecipe } from './lazy-dumplings.recipe.ts';
import { plumCakeRecipe } from './plum-cake.recipe.ts';
import { pruneCakeRecipe } from './prune-cake.recipe.ts';
import type { Recipe } from './recipe.types.ts';
import type { AppLocale } from '../../lib/i18n/config.ts';
import { formatDuration } from '../../lib/i18n/format.ts';
import type {
  StructuredRecipeContent,
  StructuredRecipeTiming,
} from './localized-recipe.types.ts';
import { celebrationSpongeCakeRecipe } from './celebration-sponge-cake.recipe.ts';
import { sourCreamRecipe } from './sour-cream.recipe.ts';
import { lemonCreamCheeseRecipe } from './lemon-cream-cheese.recipe.ts';
import { chocolateGlazeRecipe } from './chocolate-glaze.recipe.ts';
import { spongeCakeRecipe } from './sponge-cake.recipe.ts';

/** One canonical contract for every publication and editorial stage. */
export const recipes: readonly Recipe[] = [
  celebrationSpongeCakeRecipe,
  sourCreamRecipe,
  lemonCreamCheeseRecipe,
  chocolateGlazeRecipe,
  glutenFreeNapoleonRecipe,
  crinkleCookiesRecipe,
  appleCharlotteRecipe,
  plumCakeRecipe,
  cottageCheeseWafflesRecipe,
  carrotCakeRecipe,
  spongeCakeRecipe,
  crepesRecipe,
  fruitSpongeRollRecipe,
  bananaBreadRecipe,
  lazyDumplingsRecipe,
  pruneCakeRecipe,
  cinnamonRollsRecipe,
  eclairsRecipe,
  easterBreadRecipe,
  appleFrittersRecipe,
  bananaFrittersRecipe,
  appleBananaFrittersRecipe,
  appleMeringuePieRecipe,
  mascarponeWhippedCreamRecipe,
  vanillaEggCustardRecipe,
  egglessVanillaCustardRecipe,
  vanillaButtercreamRecipe,
];

export function getRecipe(recipeId: string): Recipe | null {
  return recipes.find((recipe) => recipe.id === recipeId) ?? null;
}

/** Lightweight compatibility envelope for callers that attach document context. */
export type RecipeDocument = { recipe: Recipe };
export const recipeDocuments: readonly RecipeDocument[] = recipes.map(
  (recipe) => ({ recipe }),
);
export const personalStateRecipes = recipes;
export const getPersonalStateRecipe = getRecipe;
export const isPersonalStateRecipeId = (id: string) => getRecipe(id) !== null;
export const isSaveableRecipeId = isPersonalStateRecipeId;
export function getRecipeDocument(id: string): RecipeDocument | null {
  const recipe = getRecipe(id);
  return recipe ? { recipe } : null;
}

function planningNote(
  timing: StructuredRecipeTiming,
  locale: AppLocale,
): string | null {
  const note = timing.planningNote;
  if (!note) return null;
  if (!note.phaseId) return note.text;
  const phase = timing.phases.find((item) => item.id === note.phaseId);
  return phase
    ? note.text.replaceAll('{duration}', formatDuration(locale, phase.duration))
    : null;
}

/** Pure localized projection. IDs, amounts, phases and media are read from Recipe once. */
export function projectRecipeContent(
  recipe: Recipe,
  locale: AppLocale,
): StructuredRecipeContent {
  const y = recipe.yield.default;
  const geometry = recipe.geometry.default;
  const timing: StructuredRecipeTiming = {
    ...recipe.timing,
    planningNote: recipe.timing.planningNote
      ? {
          ...recipe.timing.planningNote,
          text: recipe.timing.planningNote.text[locale],
        }
      : null,
    phases: recipe.timing.phases.map((phase) => ({
      ...phase,
      label: phase.label[locale],
    })),
  };
  const state = recipe.baseProvenance.state;
  const status =
    state === 'repeatedlyVerified' || state === 'tested'
      ? 'tested'
      : state === 'calculated'
        ? 'calculated'
        : state === 'suggested'
          ? 'suggested'
          : undefined;
  return {
    recipeId: recipe.id,
    locale,
    versionId: recipe.versionId,
    presentation: recipe.presentation,
    showImageNote: recipe.showImageNote,
    completeness: recipe.contentGaps.some(
      (gap) => gap.publicationBlocking && gap.area === 'method',
    )
      ? 'incompleteSource'
      : 'readyToReview',
    evidence: status
      ? { status, explanation: recipe.evidenceExplanation[locale] }
      : undefined,
    difficulty: recipe.difficulty ?? undefined,
    overview: {
      difficulty: recipe.difficulty,
      timing: {
        activeMinutes: timing.activeMinutes,
        totalElapsedMinutes: timing.totalElapsedMinutes,
        planningNote: planningNote(timing, locale),
      },
      yieldLabel: y.count.kind === 'unknown' ? null : y.label[locale],
      flour: recipe.discovery.flourSummary?.[locale] ?? '',
    },
    yield:
      y.count.kind !== 'unknown' && y.unit
        ? {
            id: y.id,
            label: y.label[locale],
            count: y.count,
            unit: y.unit,
            ...(y.approximate ? { approximate: true } : {}),
          }
        : undefined,
    geometry: geometry
      ? { ...geometry, label: geometry.label[locale] }
      : undefined,
    timing,
    beforeStart: recipe.beforeStart.length
      ? recipe.beforeStart.map((item) => item.text[locale])
      : undefined,
    relatedRecipes: recipe.relatedRecipeIds.length
      ? recipe.relatedRecipeIds
      : undefined,
    creamOptions: recipe.creamOptions,
    ingredientSections: recipe.ingredientSections.map((section) => ({
      id: section.id,
      title: section.title[locale],
      ingredients: section.lines.map((line) => ({
        id: line.id,
        name: line.options[0].name[locale],
        options: line.options.map((option) => ({
          ingredientId: option.ingredientId,
          name: option.name[locale],
        })),
        choose: line.choose,
        quantity: line.quantity,
        optional: line.optional,
        scaling: line.scaling?.kind === 'fixed' ? 'fixed' : undefined,
        scalingRule:
          line.scaling ?? recipe.configuration.ingredientScaling.default,
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
      quantityMentions: step.quantityMentions?.map((mention) => ({
        ...mention,
        text: mention.text[locale],
      })),
      meta: step.displayMeta?.[locale],
      checkpoint: step.guidance?.find((g) => g.kind === 'checkpoint')?.text[
        locale
      ],
      tip: step.guidance?.find((g) => g.kind === 'practicalTip')?.text[locale],
      cookGroup: step.cook?.group,
      requiresCream: step.cook?.requiresCream,
      cookTitle: step.cook?.title?.[locale],
      cookInstructions: step.cook?.instructions?.map(
        (item) => item.text[locale],
      ),
      cookIngredients:
        step.cook?.ingredients?.map((item) => ({
          ...item,
          fraction: step.ingredientFractions?.[item.ingredientId],
          note: item.note?.[locale],
        })) ??
        (step.ingredientLineIds.length
          ? step.ingredientLineIds.map((ingredientId) => ({
              ingredientId,
              fraction: step.ingredientFractions?.[ingredientId],
            }))
          : undefined),
      media: step.mediaIds?.flatMap((mediaId) => {
        const item = recipe.media.find((candidate) => candidate.id === mediaId);
        return item
          ? [
              {
                id: item.id,
                type: item.type,
                src: item.path,
                fit: item.fit,
                poster: item.posterPath,
                alt: item.alt[locale],
                title: item.title?.[locale],
                caption: item.caption?.[locale],
                transcript: item.transcript?.[locale],
              },
            ]
          : [];
      }),
      help: getStepHelpDefinitions(
        step.helpReference?.recipeId ?? recipe.id,
        step.helpReference?.stepId ?? step.id,
        locale,
      ),
    })),
    gapNote:
      recipe.contentGaps
        .filter((gap) => gap.publicationBlocking || gap.readerVisible)
        .map((gap) => gap.text?.[locale] ?? gap.question)
        .join(' ') || undefined,
  };
}

export function getRecipeContent(
  id: string,
  locale: AppLocale = 'en',
): StructuredRecipeContent | null {
  const recipe = getRecipe(id);
  return recipe ? projectRecipeContent(recipe, locale) : null;
}
