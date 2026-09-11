export const ASSISTANT_DEFAULT_MODEL = 'gpt-5.4-mini';
export const ASSISTANT_DEFAULT_MAX_OUTPUT_TOKENS = 2000;
export const ASSISTANT_TIMEOUT_MS = 15_000;
export const ASSISTANT_MAX_RETRIES = 0;

export interface AssistantRuntimeConfig {
  enabled: boolean;
  apiKey: string | null;
  sessionSecret: string | null;
  model: string;
  maxOutputTokens: number;
}

export class AssistantEnvironmentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AssistantEnvironmentError';
  }
}

type RuntimeBindings = Record<string, unknown>;

function optionalString(bindings: RuntimeBindings, key: string): string | null {
  const value = bindings[key];
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string')
    throw new AssistantEnvironmentError(`${key} must be a string.`);
  return value;
}

export function parseAssistantRuntimeEnv(
  bindings: RuntimeBindings,
): AssistantRuntimeConfig {
  if (
    'NEXT_PUBLIC_OPENAI_API_KEY' in bindings ||
    'VITE_OPENAI_API_KEY' in bindings
  ) {
    throw new AssistantEnvironmentError(
      'Publicly prefixed OpenAI credentials are forbidden.',
    );
  }

  const enabledValue = optionalString(bindings, 'ASSISTANT_ENABLED') ?? 'false';
  if (enabledValue !== 'true' && enabledValue !== 'false') {
    throw new AssistantEnvironmentError(
      'ASSISTANT_ENABLED must be true or false.',
    );
  }
  const enabled = enabledValue === 'true';
  const apiKey = optionalString(bindings, 'OPENAI_API_KEY');
  const sessionSecret = optionalString(bindings, 'ASSISTANT_SESSION_SECRET');
  const model =
    optionalString(bindings, 'OPENAI_MODEL') ?? ASSISTANT_DEFAULT_MODEL;
  const maxOutputTokensValue =
    optionalString(bindings, 'ASSISTANT_MAX_OUTPUT_TOKENS') ??
    String(ASSISTANT_DEFAULT_MAX_OUTPUT_TOKENS);
  const maxOutputTokens = Number(maxOutputTokensValue);

  if (model !== ASSISTANT_DEFAULT_MODEL) {
    throw new AssistantEnvironmentError(
      'OPENAI_MODEL must be gpt-5.4-mini for this assistant release.',
    );
  }
  if (
    !Number.isInteger(maxOutputTokens) ||
    maxOutputTokens < 256 ||
    maxOutputTokens > 4000
  ) {
    throw new AssistantEnvironmentError(
      'ASSISTANT_MAX_OUTPUT_TOKENS must be an integer from 256 to 4000.',
    );
  }
  if (enabled && (!apiKey || apiKey.trim().length < 1)) {
    throw new AssistantEnvironmentError(
      'OPENAI_API_KEY is required when the assistant is enabled.',
    );
  }
  if (enabled && (!sessionSecret || sessionSecret.length < 32)) {
    throw new AssistantEnvironmentError(
      'ASSISTANT_SESSION_SECRET must contain at least 32 characters when the assistant is enabled.',
    );
  }

  return { enabled, apiKey, sessionSecret, model, maxOutputTokens };
}

/** Reads Cloudflare bindings at request time; Node env is only the local/test fallback. */
export async function getAssistantRuntimeBindings(): Promise<RuntimeBindings> {
  try {
    const workers = await import('cloudflare:workers');
    return workers.env as RuntimeBindings;
  } catch (error) {
    if (typeof process !== 'undefined' && process.env) return process.env;
    throw error;
  }
}
