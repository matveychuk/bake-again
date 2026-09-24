import {
  createCookSteps,
  TOTAL_RECIPE_STEPS,
} from '@/app/recipes/napoleon-cake/cook/cook-mode.data';
import {
  calculateNapoleonConfiguration,
  napoleonBaseSelection,
  parseNapoleonConfiguration,
} from './napoleon-configuration';
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

const napoleonCookMode: CookModeDefinition = {
  recipeId: glutenFreeNapoleonRecipe.id,
  recipeVersionId: glutenFreeNapoleonRecipe.versionId,
  recipeTitle: 'Napoleon cake',
  detailHref: '/recipes/napoleon-cake',
  totalSteps: TOTAL_RECIPE_STEPS,
  assistant: {
    recipeId: glutenFreeNapoleonRecipe.id,
    recipeVersionId: glutenFreeNapoleonRecipe.versionId,
  },
  getState: (locationSearch) => {
    const requested = parseNapoleonConfiguration(
      new URLSearchParams(locationSearch),
    );
    const requestedResult = calculateNapoleonConfiguration(requested);
    const selection = requestedResult.cookMode.eligible
      ? requested
      : napoleonBaseSelection;
    const configuration = calculateNapoleonConfiguration(selection);
    const isAdjusted =
      selection.geometryId !== napoleonBaseSelection.geometryId ||
      selection.quantityAdjustment.mode !== 'batchScale' ||
      selection.quantityAdjustment.factor !== 1;
    const steps = createCookSteps(configuration);
    return {
      isAdjusted,
      steps,
      allIngredients: [
        ...new Map(
          steps
            .flatMap((step) => step.ingredients)
            .map((ingredient) => [ingredient.id, ingredient]),
        ).values(),
      ],
      assistantConfiguration: isAdjusted
        ? {
            kind: 'adjusted',
            geometryId: selection.geometryId,
            quantityAdjustment: selection.quantityAdjustment,
          }
        : { kind: 'base' },
    };
  },
};

function createInventoryCookMode(
  recipe: InventoryRecipe,
  locale: AppLocale,
): CookModeDefinition {
  const structured = getRecipeContent(recipe.id, locale);
  const document = getRecipeDocument(recipe.id);
  const baseVersionId =
    document?.kind === 'detailed'
      ? document.recipe.versionId
      : `${recipe.id}-source-v1`;
  const baseForCookMode = structured
    ? composeRecipeWithCream(structured, null, null)
    : null;

  return {
    recipeId: recipe.id,
    recipeVersionId: baseVersionId,
    recipeTitle: recipeDetailTitles[recipe.id]?.[locale] ?? recipe.title,
    detailHref: `/recipes/${recipe.slug}`,
    totalSteps:
      baseForCookMode && isSourceCookModeAvailable(baseForCookMode)
        ? createSourceCookSteps(baseForCookMode, locale).length
        : 0,
    getState: (locationSearch) => {
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
                'The source preserves ingredients but not the preparation method.')
              : !configured
                ? 'The source currently preserves only the recipe name. Add the original ingredients and method before cooking.'
                : undefined;

      return {
        recipeVersionId: `${baseVersionId}${selectedCreamRecipeId ? `-cream-${selectedCreamRecipeId}` : ''}`,
        isAdjusted: configuration.kind === 'adjusted',
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

export function getCookModeDefinition(slug: string, locale: AppLocale = 'en') {
  if (slug === 'napoleon-cake') {
    return {
      ...napoleonCookMode,
      recipeTitle:
        recipeDetailTitles[glutenFreeNapoleonRecipe.id]?.[locale] ??
        napoleonCookMode.recipeTitle,
      getState: (locationSearch: string) => {
        const params = new URLSearchParams(locationSearch);
        const availableAmount = params.get('amount');
        if (
          params.get('mode') === 'ingredient' &&
          (!availableAmount ||
            !Number.isFinite(Number(availableAmount)) ||
            Number(availableAmount) < 100)
        ) {
          return {
            isAdjusted: false,
            steps: [],
            allIngredients: [],
            unavailableReason:
              Number(availableAmount) > 0
                ? getUiMessages(locale).scaling.supportedAmount
                : getUiMessages(locale).scaling.positiveAmount,
          };
        }
        return napoleonCookMode.getState(locationSearch);
      },
    };
  }

  const recipe =
    recipeInventory.find((candidate) => candidate.slug === slug) ??
    getComponentPageRecipe(slug);
  return recipe ? createInventoryCookMode(recipe, locale) : undefined;
}
