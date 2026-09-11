import { getRecipeDocument } from '../../content/recipes/registry.ts';
import { calculateRecipeConfiguration } from '../../content/recipes/calculate-configuration.ts';
import type { RecipeDraft } from '../../content/recipes/recipe.types.ts';
import { parseAssistantRequest } from './schemas.ts';
import type { AssistantRequestV1 } from './contracts.ts';
import { resolveContextEvidence } from './provenance.ts';
import {
  isActionProposalShape,
  isRecord,
  type ActionContext,
  type ActionChoices,
  type ActionKind,
  type ActionProposal,
  type ActionReview,
} from './action-contract.ts';

export class ActionValidationError extends Error {
  readonly code:
    | 'INVALID_ACTION'
    | 'STALE_RECIPE'
    | 'UNAVAILABLE_CONFIGURATION'
    | 'CHOICE_REQUIRED'
    | 'STALE_REVIEW';
  constructor(code: ActionValidationError['code']) {
    super(code);
    this.name = 'ActionValidationError';
    this.code = code;
  }
}
const invalid = (): never => {
  throw new ActionValidationError('INVALID_ACTION');
};

function resolveContext(value: unknown) {
  if (!isRecord(value)) return invalid();
  const parsed = parseAssistantRequest({
    ...value,
    question: 'Action review',
    history: [],
  });
  if (
    Object.hasOwn(value, 'question') ||
    Object.hasOwn(value, 'history') ||
    !parsed.success
  )
    return invalid();
  const request = parsed.data;
  const document = getRecipeDocument(request.recipeId);
  if (
    !document ||
    document.kind !== 'detailed' ||
    request.recipeId !== 'gluten-free-napoleon' ||
    document.recipe.publicationStatus === 'archived'
  )
    return invalid();
  const recipe = document.recipe;
  if (request.recipeVersionId !== recipe.versionId)
    throw new ActionValidationError('STALE_RECIPE');
  if (
    request.scope.kind === 'step' &&
    request.scope.stepIds.some(
      (id) => !recipe.steps.some((step) => step.id === id),
    )
  )
    return invalid();
  const configuration = request.configuration;
  let calculated;
  try {
    calculated = calculateRecipeConfiguration(
      recipe,
      configuration.kind === 'base'
        ? recipe.geometry.default.id
        : configuration.geometryId,
      configuration.kind === 'base'
        ? { mode: 'batchScale', factor: 1 }
        : configuration.quantityAdjustment,
    );
  } catch {
    throw new ActionValidationError('UNAVAILABLE_CONFIGURATION');
  }
  if (
    !Number.isFinite(calculated.totalScaleFactor) ||
    calculated.ingredientAmounts.some(
      ({ amount }) =>
        amount &&
        (amount.kind === 'exact'
          ? !Number.isFinite(amount.value)
          : !Number.isFinite(amount.min) || !Number.isFinite(amount.max)),
    )
  )
    return invalid();
  const geometry = [
    recipe.geometry.default,
    ...recipe.geometry.alternatives,
  ].find(({ id }) => id === calculated.geometryId)!;
  if (geometry.availability === 'hiddenUntilConfirmed')
    throw new ActionValidationError('UNAVAILABLE_CONFIGURATION');
  const sourceIds = new Set(recipe.sources.map(({ id }) => id));
  const configurationStatus =
    configuration.kind === 'adjusted'
      ? ('Calculated' as const)
      : resolveContextEvidence({ provenance: recipe.baseProvenance, sourceIds })
          .status;
  return {
    request,
    recipe,
    calculated,
    geometry,
    sourceIds,
    configurationStatus,
  };
}

function scopedIds(recipe: RecipeDraft, context: ActionContext) {
  if (context.scope.kind === 'flour')
    return [
      recipe.flourConfiguration.commercialMixLineId,
      ...recipe.flourConfiguration.additionalStarchLineIds,
      ...(recipe.flourConfiguration.xanthanLineId
        ? [recipe.flourConfiguration.xanthanLineId]
        : []),
    ];
  if (context.scope.kind === 'step') {
    const ids = context.scope.stepIds;
    return [
      ...new Set(
        recipe.steps
          .filter(({ id }) => ids.includes(id))
          .flatMap((step) => step.ingredientLineIds),
      ),
    ];
  }
  return recipe.ingredientSections.flatMap(({ lines }) =>
    lines.map(({ id }) => id),
  );
}

/** Pure canonical resolution, run independently on the server and the client.
 * Payloads have no quantities, URLs, persistence inputs or executable callbacks.
 */
export function resolveActionReview(
  value: unknown,
  choices: unknown = {},
  requireChoices = false,
): ActionReview {
  if (!isActionProposalShape(value) || !isRecord(choices)) return invalid();
  const {
    request,
    recipe,
    calculated,
    geometry,
    sourceIds,
    configurationStatus,
  } = resolveContext(value.context);
  if (
    value.configurationStatus !== configurationStatus ||
    value.cookModeEligible !== calculated.cookMode.eligible
  )
    throw new ActionValidationError('STALE_REVIEW');
  if (
    value.kind === 'open-scaling' &&
    (value.ingredientLineIds.length || Object.keys(choices).length)
  )
    return invalid();
  if (
    value.kind === 'add-shopping-items' &&
    (!value.ingredientLineIds.length || !calculated.cookMode.eligible)
  )
    throw new ActionValidationError('UNAVAILABLE_CONFIGURATION');
  // Opening the controls may resolve an ineligible configuration, but never
  // enters Cook Mode or applies a configuration.
  const allowed = new Set(scopedIds(recipe, request));
  if (
    value.ingredientLineIds.some((id) => !allowed.has(id)) ||
    Object.keys(choices).some((id) => !value.ingredientLineIds.includes(id))
  )
    return invalid();
  const lines = value.ingredientLineIds.map((id) => {
    const section = recipe.ingredientSections.find((item) =>
      item.lines.some((line) => line.id === id),
    );
    const line = section?.lines.find((item) => item.id === id);
    const amount = calculated.ingredientAmounts.find(
      (item) => item.ingredientLineId === id,
    );
    if (!section || !line || !amount || amount.requiresResolution)
      return invalid();
    const selected = Object.hasOwn(choices, id)
      ? choices[id]
      : line.options.length === 1
        ? line.options[0].ingredientId
        : null;
    if (
      selected !== null &&
      (typeof selected !== 'string' ||
        !line.options.some((option) => option.ingredientId === selected))
    )
      return invalid();
    if (requireChoices && selected === null)
      throw new ActionValidationError('CHOICE_REQUIRED');
    const gapIds = recipe.contentGaps
      .filter(
        ({ field }) =>
          field === `ingredientSections.${section.id}` ||
          field.startsWith(`ingredientSections.${section.id}.${line.id}`),
      )
      .map(({ id: gapId }) => gapId);
    const evidence = resolveContextEvidence({
      provenance: line.provenance ?? section.provenance,
      fallback: recipe.baseProvenance,
      sourceIds,
      gapIds,
      calculated: request.configuration.kind === 'adjusted',
      missing: amount.amount === null,
    });
    const status =
      line.options.length > 1 && evidence.status === 'Tested'
        ? null
        : evidence.status;
    return {
      ingredientLineId: id,
      sectionId: section.id,
      options: line.options.map((option) => ({
        ingredientId: option.ingredientId,
        name: option.name[request.locale],
      })),
      quantity: amount.amount,
      status,
      sourceState: evidence.sourceState,
      hasGaps: gapIds.length > 0 || evidence.limitations.length > 0,
      qualifier:
        [line.qualifier?.[request.locale], line.condition?.[request.locale]]
          .filter(Boolean)
          .join(' · ') || null,
      selectedIngredientId: selected as string | null,
    };
  });
  return structuredClone({
    proposal: value,
    recipeTitle: recipe.title[request.locale],
    geometryLabel: geometry.label[request.locale],
    lines,
  });
}

export function createActionProposal(
  request: AssistantRequestV1,
  kind: ActionKind,
  id: string,
): ActionProposal {
  const { question: _question, history: _history, ...context } = request;
  const resolved = resolveContext(context);
  const proposal: ActionProposal = {
    schemaVersion: 1,
    id,
    kind,
    context,
    ingredientLineIds:
      kind === 'open-scaling' ? [] : scopedIds(resolved.recipe, context),
    status: 'Suggested',
    configurationStatus: resolved.configurationStatus,
    cookModeEligible: resolved.calculated.cookMode.eligible,
  };
  return resolveActionReview(proposal).proposal;
}

export function createActionCatalog(
  request: AssistantRequestV1,
  requestId: string,
) {
  const catalog = new Map<string, ActionProposal>();
  for (const [id, kind] of [
    ['a1', 'open-scaling'],
    ['a2', 'add-shopping-items'],
  ] as const) {
    try {
      catalog.set(
        id,
        createActionProposal(request, kind, `${requestId}:${id}`),
      );
    } catch (error) {
      if (!(error instanceof ActionValidationError)) throw error;
    }
  }
  return catalog;
}

export function shoppingInputsFromReview(
  review: ActionReview,
  choices: ActionChoices,
) {
  const current = resolveActionReview(review.proposal, choices, true);
  if (current.proposal.kind !== 'add-shopping-items') return invalid();
  return current.lines.map((line) => ({
    ingredientId: line.selectedIngredientId!,
    quantity: line.quantity,
    source: {
      recipeId: current.proposal.context.recipeId,
      recipeVersionId: current.proposal.context.recipeVersionId,
      ingredientLineId: line.ingredientLineId,
      sectionId: line.sectionId,
      selectedIngredientId: line.selectedIngredientId!,
    },
  }));
}
