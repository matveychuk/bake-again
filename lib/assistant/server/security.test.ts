import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ASSISTANT_SESSION_COOKIE,
  resolveAnonymousAssistantIdentity,
} from './security.ts';

const secret = 'server-only-session-secret-value-123456789';
const sessionId = 'anonymoussession0000000000000001';

void test('creates a signed HttpOnly anonymous session and a non-identifying safety identifier', async () => {
  const identity = await resolveAnonymousAssistantIdentity(
    new Request('https://bakeagain.example/api/assistant', {
      headers: { 'cf-connecting-ip': '203.0.113.8' },
    }),
    secret,
    () => sessionId,
  );

  assert.match(
    identity.setCookie ?? '',
    new RegExp(`^${ASSISTANT_SESSION_COOKIE}=v1\\.`),
  );
  assert.match(identity.setCookie ?? '', /HttpOnly; SameSite=Strict; Secure/u);
  assert.match(identity.safetyIdentifier, /^ba_[A-Za-z0-9_-]{40}$/u);
  assert.match(identity.networkIdentifier ?? '', /^net_[A-Za-z0-9_-]{40}$/u);
  assert.ok(identity.safetyIdentifier.length <= 64);
  assert.doesNotMatch(
    `${identity.safetyIdentifier}:${identity.networkIdentifier}`,
    /203\.0\.113\.8|anonymoussession0000000000000001/u,
  );
});

void test('reuses a valid signed cookie and replaces a tampered cookie', async () => {
  const first = await resolveAnonymousAssistantIdentity(
    new Request('https://bakeagain.example/api/assistant'),
    secret,
    () => sessionId,
  );
  const cookie = first.setCookie!.split(';', 1)[0]!;
  const second = await resolveAnonymousAssistantIdentity(
    new Request('https://bakeagain.example/api/assistant', {
      headers: { cookie },
    }),
    secret,
    () => 'mustnotbeused000000000000000001',
  );
  assert.equal(second.safetyIdentifier, first.safetyIdentifier);
  assert.equal(second.setCookie, null);

  const tampered = await resolveAnonymousAssistantIdentity(
    new Request('https://bakeagain.example/api/assistant', {
      headers: { cookie: `${cookie.slice(0, -1)}x` },
    }),
    secret,
    () => 'replacementsession00000000000001',
  );
  assert.notEqual(tampered.safetyIdentifier, first.safetyIdentifier);
  assert.ok(tampered.setCookie);
});
