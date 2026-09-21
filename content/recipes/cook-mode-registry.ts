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
import { getCreamPageRecipe } from './cream-page-records';
import { getRecipeContent, getRecipeDocument } from './registry';
import {
  composeRecipeWithCream,
  resolveSelectedCreamRecipeId,
} from './cream-composition';
import { getUiMessages } from '../../lib/i18n/messages';

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
  const baseForCookMode = structured
    ? composeRecipeWithCream(structured, null, null)
    : null;

  return {
    recipeId: recipe.id,
    recipeVersionId:
      document?.kind === 'detailed'
        ? document.recipe.versionId
        : `${recipe.id}-source-v1`,
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
      const needsCreamSelection = Boolean(
        structured?.creamOptions && !selectedCreamRecipeId,
      );
      const isAvailable =
        !needsCreamSelection && isSourceCookModeAvailable(composed);
      const unavailableReason = needsCreamSelection
        ? getUiMessages(locale).recipe.chooseCreamBeforeCooking
        : !isAvailable && composed
          ? (composed.gapNote ??
            'The source preserves ingredients but not the preparation method.')
          : !composed
            ? 'The source currently preserves only the recipe name. Add the original ingredients and method before cooking.'
            : undefined;

      return {
        isAdjusted: false,
        unavailableReason,
        steps:
          composed && isAvailable
            ? createSourceCookSteps(composed, locale)
            : [],
        allIngredients: composed
          ? createSourceCookIngredients(composed, locale)
          : [],
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
    };
  }

  const recipe =
    recipeInventory.find((candidate) => candidate.slug === slug) ??
    getCreamPageRecipe(slug);
  return recipe ? createInventoryCookMode(recipe, locale) : undefined;
}
