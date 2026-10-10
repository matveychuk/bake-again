import assert from 'node:assert/strict';
import test from 'node:test';
import { newsletterSignupConfig } from './config.ts';

const configured = {
  NEWSLETTER_ENABLED: 'true',
  NEWSLETTER_PROVIDER_NAME: 'Chosen provider',
  NEWSLETTER_SIGNUP_URL_UK: 'https://forms.example.com/uk',
};
void test('newsletter remains absent until enabled with a reviewed per-language destination', () => {
  assert.equal(newsletterSignupConfig({}, 'uk'), null);
  assert.equal(
    newsletterSignupConfig(
      { ...configured, NEWSLETTER_ENABLED: 'false' },
      'uk',
    ),
    null,
  );
  assert.equal(
    newsletterSignupConfig(
      { ...configured, NEWSLETTER_PROVIDER_NAME: '' },
      'uk',
    ),
    null,
  );
  assert.equal(newsletterSignupConfig(configured, 'en'), null);
  assert.deepEqual(newsletterSignupConfig(configured, 'uk'), {
    provider: 'Chosen provider',
    url: 'https://forms.example.com/uk',
  });
});
void test('invalid, insecure or credential-bearing signup destinations never render', () => {
  for (const address of [
    'not a url',
    '/signup',
    'javascript:alert(1)',
    'http://example.com',
    'https://person:secret@example.com',
    'https://localhost/form',
  ]) {
    assert.equal(
      newsletterSignupConfig(
        { ...configured, NEWSLETTER_SIGNUP_URL_UK: address },
        'uk',
      ),
      null,
    );
  }
});
