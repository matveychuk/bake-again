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
    model: ASSISTANT_DEFAULT_MODEL,
    maxOutputTokens: ASSISTANT_DEFAULT_MAX_OUTPUT_TOKENS,
  });
});

void test('reads only OPENAI_API_KEY when enabled', () => {
  assert.equal(
    parseAssistantRuntimeEnv({
      ASSISTANT_ENABLED: 'true',
      OPENAI_API_KEY: 'server-key',
    }).apiKey,
    'server-key',
  );
  assert.throws(
    () =>
      parseAssistantRuntimeEnv({
        ASSISTANT_ENABLED: 'true',
        NEXT_PUBLIC_OPENAI_API_KEY: 'public-key',
      }),
    AssistantEnvironmentError,
  );
  assert.throws(
    () =>
      parseAssistantRuntimeEnv({
        ASSISTANT_ENABLED: 'true',
        VITE_OPENAI_API_KEY: 'public-key',
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
