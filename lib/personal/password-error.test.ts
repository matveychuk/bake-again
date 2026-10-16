import { test } from 'node:test';
import assert from 'node:assert/strict';
import { passwordErrorKey } from './password-error.ts';

void test('password validation distinguishes unchanged and weak passwords from unrelated 422 errors', () => {
  assert.equal(
    passwordErrorKey({ code: 'same_password', status: 422 }),
    'passwordUnchanged',
  );
  assert.equal(
    passwordErrorKey({ code: 'weak_password', status: 422 }),
    'passwordWeak',
  );
  assert.equal(
    passwordErrorKey({ code: 'unexpected_failure', status: 422 }),
    'error',
  );
});

void test('password feedback separates retryable failures and sessions requiring a new link', () => {
  assert.equal(passwordErrorKey({ status: 429 }), 'rateLimited');
  assert.equal(
    passwordErrorKey({ name: 'AuthRetryableFetchError' }),
    'passwordConnectionError',
  );
  for (const code of [
    'session_not_found',
    'session_expired',
    'refresh_token_not_found',
    'refresh_token_already_used',
    'reauthentication_needed',
  ]) {
    assert.equal(passwordErrorKey({ code }), 'passwordSessionExpired');
  }
  assert.equal(
    passwordErrorKey({ name: 'AuthSessionMissingError' }),
    'passwordSessionExpired',
  );
});

void test('unknown failures never return raw messages, passwords, email addresses or URLs', () => {
  for (const error of [
    null,
    undefined,
    'same_password',
    new Error('same_password'),
    {
      message:
        'same_password private@example.com secret https://example.com/#token=private',
    },
  ]) {
    assert.equal(passwordErrorKey(error), 'error');
  }
});
