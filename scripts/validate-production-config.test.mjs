import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const baseEnv = {
  OPENAI_MODEL: 'gpt-5.4-mini',
  ASSISTANT_ENABLED: 'false',
  ASSISTANT_MAX_OUTPUT_TOKENS: '2000',
  PRODUCTION_URL: 'https://bake-again-warm-precision.matveychuk-a.chatgpt.site',
  OPENAI_API_KEY_CONFIGURED: 'false',
  ASSISTANT_SESSION_SECRET_CONFIGURED: 'false',
};
const validate = (overrides = {}) => spawnSync(process.execPath, ['scripts/validate-production-config.mjs'], {
  env: { ...baseEnv, ...overrides }, encoding: 'utf8',
});

void test('disabled assistant releases need no OpenAI credentials', () => {
  assert.equal(validate().status, 0);
});
void test('enabled assistant releases require both protected secrets', () => {
  assert.notEqual(validate({ ASSISTANT_ENABLED: 'true' }).status, 0);
  assert.notEqual(validate({ ASSISTANT_ENABLED: 'true', OPENAI_API_KEY_CONFIGURED: 'true' }).status, 0);
  assert.notEqual(validate({ ASSISTANT_ENABLED: 'true', ASSISTANT_SESSION_SECRET_CONFIGURED: 'true' }).status, 0);
  assert.equal(validate({ ASSISTANT_ENABLED: 'true', OPENAI_API_KEY_CONFIGURED: 'true', ASSISTANT_SESSION_SECRET_CONFIGURED: 'true' }).status, 0);
});
void test('disabled assistant still requires valid release configuration', () => {
  for (const overrides of [{ ASSISTANT_ENABLED: '' }, { OPENAI_MODEL: 'other' }, { ASSISTANT_MAX_OUTPUT_TOKENS: '0' }, { PRODUCTION_URL: 'http://example.com' }]) {
    assert.notEqual(validate(overrides).status, 0);
  }
});
