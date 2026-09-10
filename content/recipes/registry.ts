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
import type { Duration, Quantity } from './recipe.types.ts';
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
  .filter((document): document is Extract<RecipeDocument, { kind: 'detailed' }> => document.kind === 'detailed')
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
  return recipeDocuments.find((document) => document.recipe.id === recipeId) ?? null;
}

function formatQuantity(locale: AppLocale, quantity: Quantity | null): string {
  if (!quantity) return getUiMessages(locale).personal.asNeeded;
  if (quantity.kind === 'exact') return `${quantity.value} ${quantity.unit}`;
  return `${quantity.min}–${quantity.max} ${quantity.unit}`;
}

function formatDuration(locale: AppLocale, duration: Duration): string {
  const unit = duration.unit === 'minute' ? 'min' : duration.unit === 'hour' ? 'hr' : 'sec';
  if (duration.kind === 'exact') return `${duration.value} ${unit}`;
  if (duration.kind === 'minimum') return locale === 'uk' ? `Щонайменше ${duration.min} ${unit}` : locale === 'es' ? `Como mínimo ${duration.min} ${unit}` : `at least ${duration.min} ${unit}`;
  return `${duration.min}–${duration.max} ${unit}`;
}

function detailedRecipeContent(recipe: RecipeDraft, locale: AppLocale): StructuredRecipeContent {
  return {
    completeness: recipe.contentGaps.some((gap) => gap.area === 'method')
      ? 'incompleteSource'
      : 'readyToReview',
    beforeStart: recipe.beforeStart.map((item) => item.text[locale]),
    ingredientSections: recipe.ingredientSections.map((section) => ({
      id: section.id,
      title: section.title[locale],
      ingredients: section.lines.map((line) => ({
        id: line.id,
        name: line.options[0].name[locale],
        amount: formatQuantity(locale, line.amount),
        optional: line.optional,
        note: [line.preparation?.[locale], line.qualifier?.[locale], line.condition?.[locale]]
          .filter(Boolean)
          .join(' · ') || undefined,
      })),
    })),
    steps: recipe.steps.map((step) => ({
      id: step.id,
      title: step.instruction[locale],
      body: step.instruction[locale],
      meta: [step.duration && formatDuration(locale, step.duration), step.temperature && `${step.temperature.value}°${step.temperature.unit}`]
        .filter(Boolean)
        .join(' · ') || undefined,
      checkpoint: step.guidance?.find((guidance) => guidance.kind === 'checkpoint')?.text[locale],
      tip: step.guidance?.find((guidance) => guidance.kind === 'practicalTip')?.text[locale],
    })),
    gapNote: recipe.contentGaps
      .filter((gap) => gap.publicationBlocking)
      .map((gap) => gap.question)
      .join(' ') || undefined,
  };
}

/** Content for recipe pages and Cook Mode, regardless of recipe-file maturity. */
export function getRecipeContent(recipeId: string, locale: AppLocale = 'en'): StructuredRecipeContent | null {
  const document = getRecipeDocument(recipeId);
  if (!document) return null;
  if (document.kind === 'detailed') return detailedRecipeContent(document.recipe, locale);
  if (locale === 'en') return document.recipe;
  const translation = document.recipe.translations?.[locale];
  if (translation) return translation;
  return {
    completeness: 'incompleteSource',
    ingredientSections: [],
    steps: [],
    gapNote: getUiMessages(locale).recipe.translationPending,
  };
}
