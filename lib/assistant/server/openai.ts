import OpenAI, {
  APIConnectionTimeoutError,
  APIError,
  AuthenticationError,
  PermissionDeniedError,
  RateLimitError,
} from 'openai';
import type { Response as OpenAIResponse } from 'openai/resources/responses/responses';
import type { AssistantRequestV1 } from '../contracts.ts';
import { isAppLocale, type AppLocale } from '../../i18n/config.ts';
import type { AssistantContextProjection } from './context.ts';
import {
  ASSISTANT_MAX_RETRIES,
  ASSISTANT_TIMEOUT_MS,
  type AssistantRuntimeConfig,
} from './env.ts';
import {
  buildAssistantDeveloperInstructions,
  serializeAssistantInput,
} from './prompt.ts';
import type { AssistantTokenUsage } from './telemetry.ts';

export type ProviderOutcome =
  | 'answered'
  | 'insufficient-context'
  | 'out-of-scope'
  | 'refused';

export type ProviderBlock =
  | { kind: 'evidence'; evidenceId: string }
  | {
      kind: 'explanation' | 'suggestion' | 'limitation';
      text: string;
      evidenceIds: string[];
    };

export interface ProviderAnswer {
  actionId: 'a1' | 'a2' | null;
  locale: AppLocale;
  outcome: ProviderOutcome;
  blocks: ProviderBlock[];
}

export interface AssistantProvider {
  answer(
    request: AssistantRequestV1,
    projection: AssistantContextProjection,
    context: {
      signal: AbortSignal;
      requestId: string;
      safetyIdentifier: string;
      onTelemetry(telemetry: {
        providerRequestId: string | null;
        usage: AssistantTokenUsage;
      }): void;
    },
  ): Promise<ProviderAnswer>;
}

export class AssistantProviderError extends Error {
  readonly kind: 'timeout' | 'unavailable' | 'invalid-response';
  readonly retryable: boolean;

  constructor(
    kind: 'timeout' | 'unavailable' | 'invalid-response',
    retryable: boolean,
    options?: ErrorOptions,
  ) {
    super(kind, options);
    this.name = 'AssistantProviderError';
    this.kind = kind;
    this.retryable = retryable;
  }
}

export const assistantProviderJsonSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['locale', 'outcome', 'blocks', 'actionId'],
  properties: {
    actionId: { type: ['string', 'null'], enum: [null, 'a1', 'a2'] },
    locale: { type: 'string', enum: ['en', 'es', 'uk'] },
    outcome: {
      type: 'string',
      enum: ['answered', 'insufficient-context', 'out-of-scope', 'refused'],
    },
    blocks: {
      type: 'array',
      minItems: 1,
      maxItems: 6,
      items: {
        anyOf: [
          {
            type: 'object',
            additionalProperties: false,
            required: ['kind', 'evidenceId'],
            properties: {
              kind: { type: 'string', enum: ['evidence'] },
              evidenceId: { type: 'string', pattern: '^e[1-9][0-9]{0,8}$' },
            },
          },
          {
            type: 'object',
            additionalProperties: false,
            required: ['kind', 'text', 'evidenceIds'],
            properties: {
              kind: {
                type: 'string',
                enum: ['explanation', 'suggestion', 'limitation'],
              },
              text: { type: 'string', minLength: 1, maxLength: 800 },
              evidenceIds: {
                type: 'array',
                maxItems: 4,
                items: { type: 'string', pattern: '^e[1-9][0-9]{0,8}$' },
              },
            },
          },
        ],
      },
    },
  },
} as const;

export interface ResponsesClient {
  responses: {
    create(
      body: Parameters<OpenAI['responses']['create']>[0],
      options?: Parameters<OpenAI['responses']['create']>[1],
    ): Promise<OpenAIResponse>;
  };
}

export function createServerOpenAIClient(
  config: AssistantRuntimeConfig,
  construct: (
    options: ConstructorParameters<typeof OpenAI>[0],
  ) => ResponsesClient = (options) => new OpenAI(options),
) {
  return construct({
    apiKey: config.apiKey,
    timeout: ASSISTANT_TIMEOUT_MS,
    maxRetries: ASSISTANT_MAX_RETRIES,
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function exactKeys(
  value: Record<string, unknown>,
  expected: readonly string[],
) {
  const keys = Object.keys(value).sort();
  const sortedExpected = [...expected].sort();
  return (
    keys.length === sortedExpected.length &&
    keys.every((key, index) => key === sortedExpected[index])
  );
}

export function parseProviderAnswer(value: unknown): ProviderAnswer | null {
  if (
    !isRecord(value) ||
    !exactKeys(value, ['locale', 'outcome', 'blocks', 'actionId']) ||
    (value.actionId !== null &&
      value.actionId !== 'a1' &&
      value.actionId !== 'a2') ||
    (value.actionId !== null && value.outcome !== 'answered') ||
    typeof value.locale !== 'string' ||
    !isAppLocale(value.locale) ||
    typeof value.outcome !== 'string' ||
    !['answered', 'insufficient-context', 'out-of-scope', 'refused'].includes(
      value.outcome,
    ) ||
    !Array.isArray(value.blocks) ||
    value.blocks.length < 1 ||
    value.blocks.length > 6
  ) {
    return null;
  }
  const blocks: ProviderBlock[] = [];
  for (const item of value.blocks) {
    if (!isRecord(item) || typeof item.kind !== 'string') return null;
    if (
      item.kind === 'evidence' &&
      exactKeys(item, ['kind', 'evidenceId']) &&
      typeof item.evidenceId === 'string' &&
      /^e[1-9][0-9]{0,8}$/.test(item.evidenceId)
    ) {
      blocks.push({ kind: 'evidence', evidenceId: item.evidenceId });
      continue;
    }
    if (
      (item.kind === 'explanation' ||
        item.kind === 'suggestion' ||
        item.kind === 'limitation') &&
      exactKeys(item, ['kind', 'text', 'evidenceIds']) &&
      typeof item.text === 'string' &&
      item.text.trim().length >= 1 &&
      item.text.length <= 800 &&
      Array.isArray(item.evidenceIds) &&
      item.evidenceIds.length <= 4 &&
      item.evidenceIds.every(
        (id): id is string =>
          typeof id === 'string' && /^e[1-9][0-9]{0,8}$/.test(id),
      ) &&
      new Set(item.evidenceIds).size === item.evidenceIds.length
    ) {
      blocks.push({
        kind: item.kind,
        text: item.text.trim(),
        evidenceIds: item.evidenceIds,
      });
      continue;
    }
    return null;
  }
  if (
    value.outcome !== 'answered' &&
    blocks.some((block) => block.kind !== 'limitation')
  )
    return null;
  if (
    blocks.some(
      (block) => block.kind === 'explanation' && block.evidenceIds.length === 0,
    )
  )
    return null;
  return {
    locale: value.locale,
    actionId: value.actionId,
    outcome: value.outcome as ProviderOutcome,
    blocks,
  };
}

function hasRefusal(response: OpenAIResponse) {
  return response.output.some(
    (item) =>
      item?.type === 'message' &&
      Array.isArray(item.content) &&
      item.content.some((content) => content?.type === 'refusal'),
  );
}

function mapProviderError(error: unknown): AssistantProviderError {
  if (
    error instanceof APIConnectionTimeoutError ||
    (error instanceof Error &&
      (error.name === 'AbortError' || error.name === 'TimeoutError'))
  ) {
    return new AssistantProviderError('timeout', true, { cause: error });
  }
  if (
    error instanceof AuthenticationError ||
    error instanceof PermissionDeniedError
  ) {
    return new AssistantProviderError('unavailable', false, { cause: error });
  }
  if (
    error instanceof RateLimitError ||
    (error instanceof APIError && error.status >= 500)
  ) {
    return new AssistantProviderError('unavailable', true, { cause: error });
  }
  return new AssistantProviderError('unavailable', false, { cause: error });
}

export function createOpenAIAssistantProvider(
  config: AssistantRuntimeConfig,
  client: ResponsesClient = createServerOpenAIClient(config),
): AssistantProvider {
  return {
    async answer(request, projection, context) {
      let response: OpenAIResponse;
      try {
        response = await client.responses.create(
          {
            model: config.model,
            service_tier: 'default',
            reasoning: { effort: 'low' },
            instructions: buildAssistantDeveloperInstructions(request.locale),
            input: serializeAssistantInput(request, projection),
            text: {
              format: {
                type: 'json_schema',
                name: 'bake_again_assistant_v3',
                strict: true,
                schema: {
                  ...assistantProviderJsonSchema,
                  properties: {
                    ...assistantProviderJsonSchema.properties,
                    locale: { type: 'string', enum: [request.locale] },
                  },
                },
              },
            },
            tools: [],
            tool_choice: 'none',
            store: false,
            safety_identifier: context.safetyIdentifier,
            max_output_tokens: config.maxOutputTokens,
          },
          {
            signal: context.signal,
            headers: { 'X-Client-Request-Id': context.requestId },
          },
        );
      } catch (error) {
        throw mapProviderError(error);
      }

      const usage = response.usage;
      context.onTelemetry({
        providerRequestId:
          (response as OpenAIResponse & { _request_id?: string })._request_id ??
          null,
        usage: {
          inputTokens: usage?.input_tokens ?? null,
          outputTokens: usage?.output_tokens ?? null,
          totalTokens: usage?.total_tokens ?? null,
          cachedInputTokens: usage?.input_tokens_details?.cached_tokens ?? null,
        },
      });

      if (
        response.status !== 'completed' ||
        response.error ||
        !Array.isArray(response.output)
      ) {
        throw new AssistantProviderError('invalid-response', false);
      }
      if (hasRefusal(response)) {
        return {
          locale: request.locale,
          actionId: null,
          outcome: 'refused',
          blocks: [
            {
              kind: 'limitation',
              text: 'The request could not be answered.',
              evidenceIds: [],
            },
          ],
        };
      }
      if (
        typeof response.output_text !== 'string' ||
        !response.output_text.trim() ||
        response.output_text.length > 16_384
      ) {
        throw new AssistantProviderError('invalid-response', false);
      }
      let decoded: unknown;
      try {
        decoded = JSON.parse(response.output_text);
      } catch (error) {
        throw new AssistantProviderError('invalid-response', false, {
          cause: error,
        });
      }
      const answer = parseProviderAnswer(decoded);
      if (!answer || answer.locale !== request.locale)
        throw new AssistantProviderError('invalid-response', false);
      return answer;
    },
  };
}
