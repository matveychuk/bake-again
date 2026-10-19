import assert from 'node:assert/strict';
import { test } from 'node:test';
import { brevoAccepted, brevoSignupEndpoint } from './inline-signup.ts';
import { getLeadMagnet } from '../../content/lead-magnets.ts';

void test('inline signup uses only the approved Brevo form origin and strips caller query and fragment', () => {
  assert.equal(
    brevoSignupEndpoint(
      'https://67fba9aa.sibforms.com/serve/UK_form==?email=private#token',
    ),
    'https://67fba9aa.sibforms.com/serve/UK_form==?isAjax=1',
  );
  for (const url of [
    'http://67fba9aa.sibforms.com/serve/abc',
    'https://other.example/serve/abc',
    'https://67fba9aa.sibforms.com/unsubscribe/abc',
  ])
    assert.equal(brevoSignupEndpoint(url), null);
});

void test('only explicit provider success can count as a conversion', () => {
  assert.equal(brevoAccepted({ success: true }), true);
  for (const response of [
    null,
    {},
    { success: false },
    { success: 'true' },
    { message: 'success' },
    { status: 200 },
  ])
    assert.equal(brevoAccepted(response), false);
});

void test('lead magnets are UK-only and unknown identifiers have no content', () => {
  assert.equal(getLeadMagnet('uk', 'shokolad')?.magnetId, 'shokolad');
  for (const locale of ['en', 'es', 'xx'])
    assert.equal(getLeadMagnet(locale, 'shokolad'), undefined);
  for (const id of ['unknown', '__proto__', 'constructor'])
    assert.equal(getLeadMagnet('uk', id), undefined);
});
