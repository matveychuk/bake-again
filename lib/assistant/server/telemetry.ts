import type { AppLocale } from '../../i18n/config.ts';
import type { AssistantErrorCode, AssistantScope } from '../contracts.ts';

export interface AssistantTokenUsage {
  inputTokens: number | null;
  outputTokens: number | null;
  totalTokens: number | null;
  cachedInputTokens: number | null;
}

export interface AssistantTelemetryEvent extends AssistantTokenUsage {
  event: 'assistant.request';
  requestId: string;
  providerRequestId: string | null;
  model: string;
  latencyMs: number;
  recipeId: string;
  recipeVersionId: string;
  locale: AppLocale;
  scope: AssistantScope['kind'];
  status: 'ok' | 'error';
  errorCode: AssistantErrorCode | null;
  promptVersion: string;
  contextVersion: string;
}

export interface AssistantTelemetry {
  record(event: AssistantTelemetryEvent): void;
}

export const noOpAssistantTelemetry: AssistantTelemetry = {
  record() {},
};

/** Emits only the allowlisted event object; request/answer text and secrets are absent by type. */
export const consoleAssistantTelemetry: AssistantTelemetry = {
  record(event) {
    console.info(JSON.stringify(event));
  },
};
