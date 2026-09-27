import { calculateRecipeConfiguration } from '../../../content/recipes/calculate-configuration.ts';
import {
  getRecipeDocument,
  type RecipeDocument,
} from '../../../content/recipes/registry.ts';
import {
  isRecipeLocalePublishable,
  isUiLocalePublishable,
} from '../../i18n/publication.ts';
import type { AppLocale } from '../../i18n/config.ts';
import type {
  AssistantBlock,
  AssistantRequestV1,
  AssistantResponseV1,
  EvidenceRef,
} from '../contracts.ts';
import {
  ASSISTANT_CONTEXT_POLICY_VERSION,
  buildAssistantContext,
  type AssistantContextProjection,
} from './context.ts';
import type { AssistantRuntimeConfig } from './env.ts';
import { AssistantServiceError } from './errors.ts';
import {
  AssistantProviderError,
  parseProviderAnswer,
  type AssistantProvider,
  type ProviderAnswer,
} from './openai.ts';
import {
  ASSISTANT_PROMPT_VERSION,
  buildAssistantDeveloperInstructions,
} from './prompt.ts';
import { validateAssistantProse } from './validation.ts';
import { isAssistantResponseV1 } from '../schemas.ts';
import { createActionCatalog, resolveActionReview } from '../actions.ts';
import {
  noOpAssistantTelemetry,
  type AssistantTelemetry,
  type AssistantTokenUsage,
} from './telemetry.ts';

const enabledRecipeIds = new Set(['gluten-free-napoleon']);

const messages = {
  insufficient: {
    en: 'The reviewed recipe does not contain enough information to answer that safely.',
    es: 'La receta revisada no contiene información suficiente para responder con seguridad.',
    uk: 'У перевіреному рецепті недостатньо інформації для надійної відповіді.',
  },
  refused: {
    en: 'I cannot help with that request from this recipe context.',
    es: 'No puedo ayudar con esa solicitud a partir del contexto de esta receta.',
    uk: 'Я не можу допомогти з цим запитом на основі контексту цього рецепта.',
  },
  suggestion: {
    en: 'Suggested change; not bake-tested.',
    es: 'Cambio sugerido; no probado al hornear.',
    uk: 'Запропонована зміна; не випробувана випіканням.',
  },
} as const;

export interface AssistantService {
  respond(
    request: AssistantRequestV1,
    context: {
      requestId: string;
      signal: AbortSignal;
      safetyIdentifier?: string;
    },
  ): Promise<AssistantResponseV1>;
}

interface AssistantServiceDependencies {
  config: AssistantRuntimeConfig;
  provider: AssistantProvider;
  resolveRecipe?: (recipeId: string) => RecipeDocument | null;
  isRecipeEnabled?: (recipeId: string) => boolean;
  isRecipeLocaleAllowed?: (
    recipe: Extract<RecipeDocument, { kind: 'detailed' }>['recipe'],
    locale: AppLocale,
  ) => boolean;
  isUiLocaleAllowed?: (locale: AppLocale) => boolean;
  telemetry?: AssistantTelemetry;
  now?: () => number;
}

function limitationResponse(
  request: AssistantRequestV1,
  requestId: string,
  outcome: 'insufficient-context' | 'out-of-scope' | 'refused',
  text: string,
): AssistantResponseV1 {
  return {
    schemaVersion: 1,
    ok: true,
    requestId,
    recipeId: request.recipeId,
    recipeVersionId: request.recipeVersionId,
    locale: request.locale,
    configuration: request.configuration,
    outcome,
    blocks: [{ kind: 'limitation', text, status: null, references: [] }],
    proposedAction: null,
  };
}

function validateReferences(
  ids: string[],
  projection: AssistantContextProjection,
): EvidenceRef[] {
  const references: EvidenceRef[] = [];
  for (const id of ids) {
    const evidence = projection.evidence.get(id);
    if (!evidence)
      throw new AssistantServiceError('INVALID_UPSTREAM_RESPONSE', 502);
    references.push(evidence.reference);
  }
  return references;
}

function assembleBlocks(
  answer: ProviderAnswer,
  projection: AssistantContextProjection,
  locale: AppLocale,
): AssistantBlock[] {
  const selectedEvidence = new Set(answer.blocks.flatMap(block =>
    block.kind === 'evidence' ? [block.evidenceId] : []));
  const blocks = answer.blocks.filter(block => {
    // A model may select the correct source and then repeat its quantity in prose.
    // Keep the verbatim source block, never display that generated numeric prose.
    // Recover only when all cited facts are already selected and every number
    // exists in those exact facts; unrelated policy failures still reject below.
    if (block.kind !== 'explanation' || answer.actionId !== null ||
        block.evidenceIds.length === 0 ||
        !block.evidenceIds.every(id => selectedEvidence.has(id) && projection.evidence.has(id))) return true;
    const numbers = block.text.match(/\p{N}+(?:[.,]\p{N}+)?/gu) ?? [];
    if (numbers.length === 0 || !validateAssistantProse(block.text.replace(/\p{N}+(?:[.,]\p{N}+)?/gu, ''), locale)) return true;
    const sourceNumbers = new Set(block.evidenceIds.flatMap(id =>
      projection.evidence.get(id)!.text.match(/\p{N}+(?:[.,]\p{N}+)?/gu) ?? []));
    return !numbers.every(number => sourceNumbers.has(number));
  });
  return blocks.map((block): AssistantBlock => {
    if (block.kind === 'evidence') {
      const evidence = projection.evidence.get(block.evidenceId);
      if (!evidence)
        throw new AssistantServiceError('INVALID_UPSTREAM_RESPONSE', 502);
      return {
        kind: 'evidence',
        text: evidence.text,
        status: evidence.status,
        qualification: evidence.qualification,
        references: [evidence.reference],
      };
    }
    if (!validateAssistantProse(block.text, locale)) {
      throw new AssistantServiceError('INVALID_UPSTREAM_RESPONSE', 502);
    }
    const references = validateReferences(block.evidenceIds, projection);
    if (block.kind === 'suggestion') {
      return {
        kind: 'suggestion',
        text: block.text,
        status: 'Suggested',
        qualification: messages.suggestion[locale],
        references,
      };
    }
    return { kind: block.kind, text: block.text, status: null, references };
  });
}

function mapProviderFailure(
  error: AssistantProviderError,
): AssistantServiceError {
  if (error.kind === 'timeout') {
    return new AssistantServiceError('UPSTREAM_TIMEOUT', 504, true, null, {
      cause: error,
    });
  }
  if (error.kind === 'invalid-response') {
    return new AssistantServiceError(
      'INVALID_UPSTREAM_RESPONSE',
      502,
      false,
      null,
      {
        cause: error,
      },
    );
  }
  return new AssistantServiceError(
    'SERVICE_UNAVAILABLE',
    503,
    error.retryable,
    null,
    {
      cause: error,
    },
  );
}

export function createAssistantService({
  config,
  provider,
  resolveRecipe = getRecipeDocument,
  isRecipeEnabled = (recipeId) => enabledRecipeIds.has(recipeId),
  isRecipeLocaleAllowed = isRecipeLocalePublishable,
  isUiLocaleAllowed = isUiLocalePublishable,
  telemetry = noOpAssistantTelemetry,
  now = Date.now,
}: AssistantServiceDependencies): AssistantService {
  return {
    async respond(request, { requestId, signal, safetyIdentifier }) {
      const startedAt = now();
      let providerRequestId: string | null = null;
      let usage: AssistantTokenUsage = {
        inputTokens: null,
        outputTokens: null,
        totalTokens: null,
        cachedInputTokens: null,
      };
      let errorCode: AssistantServiceError['code'] | null = null;
      try {
        if (!config.enabled)
          throw new AssistantServiceError('ASSISTANT_DISABLED', 503);
        const document = resolveRecipe(request.recipeId);
        if (
          !document ||
          document.kind !== 'detailed' ||
          !isRecipeEnabled(request.recipeId)
        ) {
          throw new AssistantServiceError('RECIPE_UNAVAILABLE', 404);
        }
        const recipe = document.recipe;
        if (
          !isUiLocaleAllowed(request.locale) ||
          !isRecipeLocaleAllowed(recipe, request.locale)
        ) {
          throw new AssistantServiceError('LOCALE_UNAVAILABLE', 403);
        }
        if (request.recipeVersionId !== recipe.versionId) {
          throw new AssistantServiceError('RECIPE_VERSION_MISMATCH', 409);
        }
        if (
          request.scope.kind === 'step' &&
          request.scope.stepIds.some(
            (stepId) => !recipe.steps.some(({ id }) => id === stepId),
          )
        ) {
          throw new AssistantServiceError('INVALID_REQUEST', 400);
        }

        let calculated = null;
        if (request.configuration.kind === 'adjusted') {
          try {
            calculated = calculateRecipeConfiguration(
              recipe,
              request.configuration.geometryId,
              request.configuration.quantityAdjustment,
            );
          } catch (error) {
            throw new AssistantServiceError(
              'CONFIGURATION_UNAVAILABLE',
              409,
              false,
              null,
              {
                cause: error,
              },
            );
          }
          if (
            request.surface === 'cook-mode' &&
            !calculated.cookMode.eligible
          ) {
            throw new AssistantServiceError('CONFIGURATION_UNAVAILABLE', 409);
          }
        }

        const projection = buildAssistantContext(
          recipe,
          request,
          calculated,
          buildAssistantDeveloperInstructions(request.locale),
        );
        if (!projection) {
          return limitationResponse(
            request,
            requestId,
            'insufficient-context',
            messages.insufficient[request.locale],
          );
        }

        let answer: ProviderAnswer;
        try {
          const parsed = parseProviderAnswer(
            await provider.answer(request, projection, {
              signal,
              requestId,
              safetyIdentifier: safetyIdentifier ?? 'ba_anonymous_unavailable',
              onTelemetry(value) {
                providerRequestId = value.providerRequestId;
                usage = value.usage;
              },
            }),
          );
          if (!parsed || parsed.locale !== request.locale) {
            throw new AssistantProviderError('invalid-response', false);
          }
          answer = parsed;
        } catch (error) {
          if (error instanceof AssistantServiceError) throw error;
          if (error instanceof AssistantProviderError)
            throw mapProviderFailure(error);
          throw new AssistantServiceError(
            'SERVICE_UNAVAILABLE',
            503,
            false,
            null,
            { cause: error },
          );
        }
        if (answer.outcome === 'refused') {
          return limitationResponse(
            request,
            requestId,
            'refused',
            messages.refused[request.locale],
          );
        }
        const response: AssistantResponseV1 = {
          schemaVersion: 1,
          ok: true,
          requestId,
          recipeId: recipe.id,
          recipeVersionId: recipe.versionId,
          locale: request.locale,
          configuration: request.configuration,
          outcome: answer.outcome,
          blocks: assembleBlocks(answer, projection, request.locale),
          proposedAction:
            answer.actionId === null
              ? null
              : (createActionCatalog(request, requestId).get(answer.actionId) ??
                null),
        };
        if (answer.actionId !== null && !response.proposedAction)
          throw new AssistantServiceError('INVALID_UPSTREAM_RESPONSE', 502);
        if (response.proposedAction)
          resolveActionReview(response.proposedAction);
        if (!isAssistantResponseV1(response)) {
          throw new AssistantServiceError('INVALID_UPSTREAM_RESPONSE', 502);
        }
        return response;
      } catch (error) {
        errorCode =
          error instanceof AssistantServiceError
            ? error.code
            : 'INTERNAL_ERROR';
        throw error;
      } finally {
        try {
          telemetry.record({
            event: 'assistant.request',
            requestId,
            providerRequestId,
            model: config.model,
            latencyMs: Math.max(0, now() - startedAt),
            ...usage,
            recipeId: request.recipeId,
            recipeVersionId: request.recipeVersionId,
            locale: request.locale,
            scope: request.scope.kind,
            status: errorCode === null ? 'ok' : 'error',
            errorCode,
            promptVersion: ASSISTANT_PROMPT_VERSION,
            contextVersion: ASSISTANT_CONTEXT_POLICY_VERSION,
          });
        } catch {
          // Telemetry must never change the user-visible assistant response.
        }
      }
    },
  };
}
