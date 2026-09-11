import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ASSISTANT_DEFAULT_MAX_OUTPUT_TOKENS,
  ASSISTANT_DEFAULT_MODEL,
  AssistantEnvironmentError,
  parseAssistantRuntimeEnv,
} from './env.ts';

void test('defaults the feature off without requiring a credential', () => {
  assert.deepEqual(parseAssistantRuntimeEnv({}), {
    enabled: false,
    apiKey: null,
    sessionSecret: null,
    model: ASSISTANT_DEFAULT_MODEL,
    maxOutputTokens: ASSISTANT_DEFAULT_MAX_OUTPUT_TOKENS,
  });
});

void test('requires server-only API and session secrets when enabled', () => {
  const sessionSecret = 's'.repeat(32);
  assert.equal(
    parseAssistantRuntimeEnv({
      ASSISTANT_ENABLED: 'true',
      OPENAI_API_KEY: 'server-key',
      ASSISTANT_SESSION_SECRET: sessionSecret,
    }).apiKey,
    'server-key',
  );
  assert.throws(
    () =>
      parseAssistantRuntimeEnv({
        ASSISTANT_ENABLED: 'true',
        NEXT_PUBLIC_OPENAI_API_KEY: 'public-key',
        ASSISTANT_SESSION_SECRET: sessionSecret,
      }),
    AssistantEnvironmentError,
  );
  assert.throws(
    () =>
      parseAssistantRuntimeEnv({
        ASSISTANT_ENABLED: 'true',
        VITE_OPENAI_API_KEY: 'public-key',
        ASSISTANT_SESSION_SECRET: sessionSecret,
      }),
    AssistantEnvironmentError,
  );
  assert.throws(
    () =>
      parseAssistantRuntimeEnv({
        ASSISTANT_ENABLED: 'true',
        OPENAI_API_KEY: 'server-key',
        ASSISTANT_SESSION_SECRET: 'too-short',
      }),
    AssistantEnvironmentError,
  );
});

void test('validates the flag, model and output token cap', () => {
  for (const bindings of [
    { ASSISTANT_ENABLED: 'yes' },
    { OPENAI_MODEL: '../model' },
    { OPENAI_MODEL: 'gpt-5.4' },
    { ASSISTANT_MAX_OUTPUT_TOKENS: '255' },
    { ASSISTANT_MAX_OUTPUT_TOKENS: '4001' },
    { ASSISTANT_MAX_OUTPUT_TOKENS: '2.5' },
  ]) {
    assert.throws(
      () => parseAssistantRuntimeEnv(bindings),
      AssistantEnvironmentError,
    );
  }
});
