import type { AppLocale } from '../../lib/i18n/config.ts';
import { getUiMessages } from '../../lib/i18n/messages.ts';
import type {
  StructuredRecipeContent,
  StructuredRecipeStep,
} from './source-recipe.types.ts';

export function resolveSelectedCreamRecipeId(
  content: Pick<StructuredRecipeContent, 'creamOptions'> | null | undefined,
  requestedRecipeId: string | null | undefined,
): string | null {
  if (!requestedRecipeId || !content?.creamOptions) return null;
  return content.creamOptions.recipeIds.includes(requestedRecipeId)
    ? requestedRecipeId
    : null;
}

function namespacedId(creamRecipeId: string, id: string) {
  return `cream-${creamRecipeId}-${id}`;
}

const needsCream = (step: StructuredRecipeStep) =>
  step.requiresCream === true || step.id === 'fill';

/**
 * Adds one explicitly selected reusable cream before the host's assembly steps.
 * Without a selection, preserve the complete host method for reading, without
 * adding a cream's ingredients or preparation on the reader's behalf.
 */
export function composeRecipeWithCream(
  host: StructuredRecipeContent,
  cream: StructuredRecipeContent | null,
  creamRecipeId: string | null,
  locale: AppLocale = 'en',
): StructuredRecipeContent {
  if (!host.creamOptions) return host;

  if (!cream || !creamRecipeId) {
    return host;
  }
  const hostStepsWithoutFill = host.steps.filter((step) => !needsCream(step));

  const creamSections = cream.ingredientSections.map((section) => ({
    ...section,
    id: namespacedId(creamRecipeId, section.id),
    ingredients: section.ingredients.map((ingredient) => ({
      ...ingredient,
      id: namespacedId(creamRecipeId, ingredient.id),
    })),
  }));
  const creamSteps = cream.steps.map((step) => ({
    ...step,
    id: namespacedId(creamRecipeId, step.id),
    cookIngredients: step.cookIngredients?.map((ingredient) => ({
      ...ingredient,
      ingredientId: namespacedId(creamRecipeId, ingredient.ingredientId),
    })),
  }));
  const assemblySteps = host.steps.filter(needsCream);

  return {
    ...host,
    // Compatibility/recommendation is not evidence of a bake of this exact pair.
    evidence: {
      status: 'suggested',
      explanation:
        {
          uk: 'Успішне приготування цього поєднання з кремом ще не підтверджено. Початкові рецепти:',
          en: 'A successful bake of this combination has not been confirmed. Original recipes:',
          es: 'No se ha confirmado la preparación con éxito de esta combinación. Recetas originales:',
        }[locale] +
        ' ' +
        [host.evidence, cream.evidence]
          .map(
            (evidence, index) =>
              `${{ uk: ['Основа', 'Крем'], en: ['Base', 'Cream'], es: ['Base', 'Crema'] }[locale][index]}: ${evidence ? getUiMessages(locale).status[evidence.status].label : '—'}.`,
          )
          .join(' '),
    },
    ingredientSections: [...host.ingredientSections, ...creamSections],
    steps: [...hostStepsWithoutFill, ...creamSteps, ...assemblySteps],
  };
}
