import { recipeConfigurationQueryIssue } from './recipe-configuration-query';
import type { IngredientLine } from './recipe.types';
import {
  createCookSteps,
  TOTAL_RECIPE_STEPS,
} from '@/app/recipes/napoleon-cake/cook/cook-mode.data';
import { resolveNapoleonCookConfiguration } from './napoleon-configuration';
import type { CookModeDefinition } from '@/components/cook-mode/cook-mode.types';
import type { AppLocale } from '@/lib/i18n/config';
import { recipeDetailTitles } from './catalog-locales';
import {
  createSourceCookIngredients,
  createSourceCookSteps,
  isSourceCookModeAvailable,
} from './cook-mode-adapter';
import { glutenFreeNapoleonRecipe } from './gluten-free-napoleon.recipe';
import { recipeInventory } from './inventory';
import type { InventoryRecipe } from './inventory';
import { getComponentPageRecipe } from './recipe-component-records';
import { getRecipeContent, getRecipeDocument } from './registry';
import {
  composeRecipeWithCream,
  resolveSelectedCreamRecipeId,
} from './cream-composition';
import { getUiMessages } from '../../lib/i18n/messages';
import {
  applySourceRecipeConfiguration,
  parseSourceRecipeConfiguration,
  sourceAssistantConfiguration,
  sourceRecipeScalingBounds,
} from './source-recipe-configuration';

const napoleonCookMode: Omit<CookModeDefinition, 'getState'> = {
  recipeId: glutenFreeNapoleonRecipe.id,
  recipeVersionId: glutenFreeNapoleonRecipe.versionId,
  recipeTitle: 'Napoleon cake',
  detailHref: '/recipes/napoleon-cake',
  totalSteps: TOTAL_RECIPE_STEPS,
  assistant: {
    recipeId: glutenFreeNapoleonRecipe.id,
    recipeVersionId: glutenFreeNapoleonRecipe.versionId,
  },
};

function createInventoryCookMode(
  recipe: InventoryRecipe,
  locale: AppLocale,
): CookModeDefinition {
  const structured = getRecipeContent(recipe.id, locale);
  const document = getRecipeDocument(recipe.id);
  const baseVersionId = document?.recipe.versionId ?? `${recipe.id}-source-v1`;
  const baseForCookMode = structured
    ? composeRecipeWithCream(structured, null, null)
    : null;

  return {
    recipeId: recipe.id,
    recipeVersionId: baseVersionId,
    recipeTitle: recipeDetailTitles[recipe.id]?.[locale] ?? recipe.title,
    assistant: { recipeId: recipe.id, recipeVersionId: baseVersionId },
    detailHref: `/recipes/${recipe.slug}`,
    totalSteps:
      baseForCookMode && isSourceCookModeAvailable(baseForCookMode)
        ? createSourceCookSteps(baseForCookMode, locale).length
        : 0,
    getState: (locationSearch) => {
      const queryIssue = recipeConfigurationQueryIssue(
        locationSearch,
        structured?.geometry?.id,
      );
      if (queryIssue)
        return {
          isAdjusted: false,
          steps: [],
          allIngredients: [],
          unavailableReason:
            queryIssue === 'geometry'
              ? getUiMessages(locale).scaling.unsupportedGeometry
              : getUiMessages(locale).cook.unsupportedConfiguration,
        };
      const requestedCreamRecipeId = new URLSearchParams(locationSearch).get(
        'cream',
      );
      const selectedCreamRecipeId = resolveSelectedCreamRecipeId(
        structured,
        requestedCreamRecipeId,
      );
      const selectedCream = selectedCreamRecipeId
        ? getRecipeContent(selectedCreamRecipeId, locale)
        : null;
      const composed = structured
        ? composeRecipeWithCream(
            structured,
            selectedCream,
            selectedCreamRecipeId,
            locale,
          )
        : null;
      const configuration = parseSourceRecipeConfiguration(
        locationSearch,
        composed,
        recipe.scalingAnchorIngredientId,
        sourceRecipeScalingBounds(
          document?.kind === 'detailed' ? document.recipe : null,
          recipe.scalingAnchorIngredientId,
        ),
      );
      const configured = composed
        ? applySourceRecipeConfiguration(composed, configuration, locale)
        : null;
      const needsCreamSelection = Boolean(
        structured?.creamOptions && !selectedCreamRecipeId,
      );
      const isAvailable =
        configuration.kind !== 'invalid' &&
        !needsCreamSelection &&
        isSourceCookModeAvailable(configured);
      const unavailableReason =
        configuration.kind === 'invalid'
          ? configuration.reason === 'unsupported'
            ? getUiMessages(locale).scaling.supportedAmount
            : getUiMessages(locale).scaling.positiveAmount
          : needsCreamSelection
            ? getUiMessages(locale).recipe.chooseCreamBeforeCooking
            : !isAvailable && configured
              ? (configured.gapNote ??
                getUiMessages(locale).recipe.methodPendingDescription)
              : !configured
                ? getUiMessages(locale).recipe.methodPendingDescription
                : undefined;

      return {
        recipeVersionId: `${baseVersionId}${selectedCreamRecipeId ? `-cream-${selectedCreamRecipeId}` : ''}`,
        isAdjusted: configuration.kind === 'adjusted',
        evidence: configured?.evidence,
        unavailableReason,
        steps:
          configured && isAvailable
            ? createSourceCookSteps(configured, locale)
            : [],
        allIngredients:
          configured && configuration.kind !== 'invalid'
            ? createSourceCookIngredients(configured, locale)
            : [],
        assistantConfiguration: configured
          ? sourceAssistantConfiguration(recipe.id, configured, configuration)
          : undefined,
      };
    },
  };
}

export function getCookModeDefinition(
  slug: string,
  locale: AppLocale = 'en',
): CookModeDefinition | undefined {
  if (slug === 'napoleon-cake') {
    return {
      ...napoleonCookMode,
      recipeTitle:
        recipeDetailTitles[glutenFreeNapoleonRecipe.id]?.[locale] ??
        napoleonCookMode.recipeTitle,
      getState: (locationSearch: string) => {
        const resolved = resolveNapoleonCookConfiguration(
          locationSearch,
          locale,
        );
        if (resolved.kind === 'blocked') {
          return {
            isAdjusted: false,
            steps: [],
            allIngredients: [],
            unavailableReason: resolved.reason,
          };
        }
        const { selection, configuration: calculation, isAdjusted } = resolved;
        const state = {
          isAdjusted,
          steps: createCookSteps(calculation),
          assistantConfiguration: isAdjusted
            ? {
                kind: 'adjusted' as const,
                geometryId: selection.geometryId,
                quantityAdjustment: selection.quantityAdjustment,
              }
            : { kind: 'base' as const },
        };
        const canonicalSource = getRecipeContent(
          glutenFreeNapoleonRecipe.id,
          locale,
        )!;
        const lines =
          glutenFreeNapoleonRecipe.ingredientSections.flatMap<IngredientLine>(
            (section) => section.lines,
          );
        const source = {
          ...canonicalSource,
          ingredientSections: canonicalSource.ingredientSections.map(
            (section) => ({
              ...section,
              ingredients: section.ingredients.map((ingredient) => ({
                ...ingredient,
                // Keep the source's alternatives visible in both Cook ingredient views.
                name:
                  lines
                    .find((line) => line.id === ingredient.id)
                    ?.options.map((option) => option.name[locale])
                    .join({ uk: ' або ', en: ' or ', es: ' o ' }[locale]) ??
                  ingredient.name,
              })),
            }),
          ),
        };
        const configured = applySourceRecipeConfiguration(
          source,
          state.isAdjusted
            ? {
                kind: 'adjusted',
                scaleFactor: calculation.totalScaleFactor,
              }
            : { kind: 'base', mode: 'scale', scaleFactor: 1 },
          locale,
        );
        // Preserve the existing 17 groups and canonical IDs used by stored sessions.
        const grouped = {
          ...configured,
          steps: configured.steps.map((step) => ({
            ...step,
            cookGroup: String(
              state.steps.findIndex((group) => group.stepIds.includes(step.id)),
            ),
          })),
        };
        return {
          ...state,
          evidence: configured.evidence,
          steps: createSourceCookSteps(grouped, locale),
          allIngredients: createSourceCookIngredients(configured, locale),
        };
      },
    };
  }

  const recipe =
    recipeInventory.find((candidate) => candidate.slug === slug) ??
    getComponentPageRecipe(slug);
  return recipe ? createInventoryCookMode(recipe, locale) : undefined;
}
