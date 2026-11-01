import { getUiMessages } from '../../lib/i18n/messages.ts';
import type { Recipe } from './recipe.types.ts';

/** Runtime composition of canonical records, with the existing namespaced session IDs. */
export function composeRecipe(host: Recipe, cream: Recipe): Recipe {
  if (!host.creamOptions?.recipeIds.includes(cream.id))
    throw new Error('Unsupported cream');
  const prefix = (id: string) => `cream-${cream.id}-${id}`;
  const evidenceStatus = (recipe: Recipe) =>
    ['tested', 'repeatedlyVerified'].includes(recipe.baseProvenance.state)
      ? 'tested'
      : recipe.baseProvenance.state === 'calculated'
        ? 'calculated'
        : 'suggested';
  const explanation = (
    locale: 'en' | 'es' | 'uk',
    opening: string,
    labels: [string, string],
  ) =>
    opening +
    ' ' +
    [host, cream]
      .map(
        (recipe, index) =>
          `${labels[index]}: ${getUiMessages(locale).status[evidenceStatus(recipe)].label}.`,
      )
      .join(' ');
  const dependent = (step: Recipe['steps'][number]) =>
    step.cook?.requiresCream === true || step.id === 'fill';
  return {
    ...host,
    versionId: `${host.versionId}-cream-${cream.id}`,
    baseProvenance: {
      state: 'suggested',
      sourceIds: [
        ...new Set([
          ...host.baseProvenance.sourceIds,
          ...cream.baseProvenance.sourceIds,
        ]),
      ],
    },
    evidenceExplanation: {
      en: explanation(
        'en',
        'A successful bake of this combination has not been confirmed. Original recipes:',
        ['Base', 'Cream'],
      ),
      es: explanation(
        'es',
        'No se ha confirmado la preparación con éxito de esta combinación. Recetas originales:',
        ['Base', 'Crema'],
      ),
      uk: explanation(
        'uk',
        'Успішне приготування цього поєднання з кремом ще не підтверджено. Початкові рецепти:',
        ['Основа', 'Крем'],
      ),
    },
    ingredientSections: [
      ...host.ingredientSections,
      ...cream.ingredientSections.map((section) => ({
        ...section,
        id: prefix(section.id),
        lines: section.lines.map(
          (line): Recipe['ingredientSections'][number]['lines'][number] => ({
            ...line,
            id: prefix(line.id),
            scaling:
              line.scaling ?? cream.configuration.ingredientScaling.default,
            options: [
              {
                ...line.options[0],
                ingredientId: prefix(line.options[0].ingredientId),
              },
              ...line.options.slice(1).map((option) => ({
                ...option,
                ingredientId: prefix(option.ingredientId),
              })),
            ],
          }),
        ),
      })),
    ],
    steps: [
      ...host.steps.filter((step) => !dependent(step)),
      ...cream.steps.map((step) => ({
        ...step,
        id: prefix(step.id),
        helpReference: { recipeId: cream.id, stepId: step.id },
        ingredientLineIds: step.ingredientLineIds.map(prefix),
        ingredientFractions: step.ingredientFractions
          ? Object.fromEntries(
              Object.entries(step.ingredientFractions).map(([id, fraction]) => [
                prefix(id),
                fraction,
              ]),
            )
          : undefined,
        durationPhaseId: step.durationPhaseId
          ? prefix(step.durationPhaseId)
          : undefined,
        temperatureStages: step.temperatureStages?.map((stage) => ({
          ...stage,
          phaseId: prefix(stage.phaseId),
        })),
        mediaIds: step.mediaIds?.map(prefix),
        equipmentIds: step.equipmentIds?.map(prefix),
        cook: step.cook
          ? {
              ...step.cook,
              group: step.cook.group ? prefix(step.cook.group) : undefined,
              ingredients: step.cook.ingredients?.map((item) => ({
                ...item,
                ingredientId: prefix(item.ingredientId),
              })),
            }
          : undefined,
      })),
      ...host.steps.filter(dependent),
    ],
    media: [
      ...host.media,
      ...cream.media.map((item) => ({ ...item, id: prefix(item.id) })),
    ],
    timing: {
      ...host.timing,
      phases: [
        ...host.timing.phases,
        ...cream.timing.phases.map((phase) => ({
          ...phase,
          id: prefix(phase.id),
          relatedStepId: phase.relatedStepId
            ? prefix(phase.relatedStepId)
            : undefined,
        })),
      ],
    },
    beforeStart: [
      ...host.beforeStart,
      ...cream.beforeStart.map((item) => ({
        ...item,
        id: prefix(item.id),
        relatedStepId: item.relatedStepId
          ? prefix(item.relatedStepId)
          : undefined,
      })),
    ],
    equipment: [
      ...host.equipment,
      ...cream.equipment.map((item) => ({ ...item, id: prefix(item.id) })),
    ],
    sources: [
      ...host.sources,
      ...cream.sources.filter(
        (source) => !host.sources.some((item) => item.id === source.id),
      ),
    ],
    contentGaps: [...host.contentGaps, ...cream.contentGaps],
  };
}
