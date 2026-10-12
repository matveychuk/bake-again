import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Session } from '@supabase/supabase-js';
import { readAuthLink, verifyAuthLink, recoveryMatches } from './auth-link.ts';
const session = { user: { id: 'verified-user', email: 'verified@example.com' } } as Session;
const good = async () => ({ data: { session }, error: null });
const forbidden = async () => { throw new Error('Unexpected credential operation'); };

test('recovery works across browsers using only the verified email credential', async () => {
  const link = readAuthLink(new URL('https://bakeagain.com/uk/account?recovery=1&email=untrusted@example.com#token_hash=one-use-token&type=recovery'));
  const result = await verifyAuthLink({ verifyOtp: async (input) => {
    assert.deepEqual(input, { token_hash: 'one-use-token', type: 'recovery' });
    return good();
  }, exchangeCodeForSession: forbidden }, link);
  assert.equal(result?.session.user.email, 'verified@example.com');
  assert.equal(result?.recovery, true);
});

test('confirmation produces a session without enabling password recovery', async () => {
  const link = readAuthLink(new URL('https://bakeagain.com/es/account#token_hash=signup-token&type=email'));
  assert.equal((await verifyAuthLink({ verifyOtp: good, exchangeCodeForSession: forbidden }, link))?.recovery, false);
});

test('legacy PKCE recovery is still exchanged in the original browser', async () => {
  const link = readAuthLink(new URL('https://bakeagain.com/en/account?recovery=1&code=old-code'));
  const result = await verifyAuthLink({ verifyOtp: forbidden, exchangeCodeForSession: async (code) => {
    assert.equal(code, 'old-code'); return good();
  } }, link);
  assert.equal(result?.recovery, true);
});

test('invalid, consumed, and cross-browser legacy links never fall back to another account session', async () => {
  for (const url of [
    '/uk/account?recovery=1',
    '/uk/account#token_hash=x&type=invite',
    '/uk/account?error=access_denied#token_hash=x&type=recovery',
    '/uk/account#error=access_denied&error_code=otp_expired',
  ]) {
    await assert.rejects(verifyAuthLink({ verifyOtp: forbidden, exchangeCodeForSession: forbidden }, readAuthLink(new URL(url, 'https://bakeagain.com'))), /INVALID_AUTH_LINK/);
  }
  await assert.rejects(verifyAuthLink({ verifyOtp: async () => ({ data: { session }, error: new Error('expired') }), exchangeCodeForSession: forbidden }, { kind: 'token', tokenHash: 'used', type: 'recovery' }), /INVALID_AUTH_LINK/);
  await assert.rejects(verifyAuthLink({ verifyOtp: forbidden, exchangeCodeForSession: async () => ({ data: { session: null }, error: new Error('no verifier') }) }, { kind: 'code', code: 'old', recovery: true }), /INVALID_AUTH_LINK/);
});

test('callback routes and recovery state stay scoped to the verified account and time window', () => {
  assert.deepEqual(readAuthLink(new URL('https://bakeagain.com/uk/recipes/test#token_hash=x&type=recovery')), { kind: 'none' });
  assert.deepEqual(readAuthLink(new URL('https://bakeagain.com/uk/account')), { kind: 'none' });
  const marker = JSON.stringify({ identity: 'verified-user', expiresAt: 100 });
  assert.equal(recoveryMatches(marker, 'verified-user', 99), true);
  assert.equal(recoveryMatches(marker, 'other-user', 99), false);
  assert.equal(recoveryMatches(marker, 'verified-user', 100), false);
  assert.equal(recoveryMatches('broken', 'verified-user', 1), false);
  assert.equal(recoveryMatches(null, 'verified-user', 1), false);
});
