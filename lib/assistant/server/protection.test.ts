import assert from 'node:assert/strict';
import test from 'node:test';
import { getAssistantProtection, trustedIngressAddress, verifyAssistantChallenge } from './protection.ts';
import { AssistantServiceError } from './errors.ts';
const bindings = { TURNSTILE_SITE_KEY: 'real-site-key', TURNSTILE_SECRET_KEY: 'secret-key', ASSISTANT_ALLOWED_HOSTNAME: 'bakeagain.example', ASSISTANT_QUOTAS: { prepare() { throw new Error('Unused'); } } };
const isError = (code: string) => (error: unknown) => error instanceof AssistantServiceError && error.code === code;
const config = { secretKey: 'secret-key', hostname: 'bakeagain.example' };
function request(token = 'single-use-token', hostname = config.hostname, ip = '203.0.113.1') {
  return new Request(`https://${hostname}/api/assistant`, { headers: { 'x-assistant-verification': token, 'cf-connecting-ip': ip } });
}
function fetchResult(result: unknown, status = 200): typeof fetch { return async () => new Response(JSON.stringify(result), { status }); }
void test('protection requires real keys, hostname, database and valid caps', () => {
  assert.ok(getAssistantProtection(bindings).store);
  for (const key of Object.keys(bindings)) {
    const incomplete: Record<string, unknown> = { ...bindings }; delete incomplete[key];
    assert.throws(() => getAssistantProtection(incomplete), isError('ASSISTANT_DISABLED'));
  }
  for (const key of ['TURNSTILE_SITE_KEY', 'TURNSTILE_SECRET_KEY']) {
    assert.throws(() => getAssistantProtection({ ...bindings, [key]: '1x0000000000000000000000000000000AA' }), isError('ASSISTANT_DISABLED'));
  }
  for (const value of ['-1', 'NaN', 'Infinity', '1e5', '1.1234567']) {
    assert.throws(() => getAssistantProtection({ ...bindings, ASSISTANT_DAILY_BUDGET_USD: value }), isError('ASSISTANT_DISABLED'));
  }
  assert.ok(getAssistantProtection({ ...bindings, ASSISTANT_DAILY_BUDGET_USD: '0' }));
});
void test('only the trusted ingress IP is accepted; forwarded addresses cannot replace it', () => {
  assert.equal(trustedIngressAddress(request()), '203.0.113.1');
  assert.throws(() => trustedIngressAddress(new Request('https://bakeagain.example', { headers: { 'x-forwarded-for': '203.0.113.1' } })), isError('SERVICE_UNAVAILABLE'));
  assert.throws(() => trustedIngressAddress(request('token', config.hostname, 'not-an-ip')), isError('SERVICE_UNAVAILABLE'));
});
void test('rejects missing or oversized tokens and wrong request hostname before verification I/O', async () => {
  const forbidden: typeof fetch = async () => { assert.fail('No external request expected'); };
  for (const req of [request(''), request('a'.repeat(2049)), request('a b'), request('token', 'attacker.example')]) {
    await assert.rejects(verifyAssistantChallenge(req, config, forbidden), isError('VERIFICATION_REQUIRED'));
  }
});
void test('checks success, hostname and action; expired or reused tokens are rejected', async () => {
  for (const result of [null, { success: false, 'error-codes': ['timeout-or-duplicate'] }, { success: true }, { success: true, hostname: 'attacker.example', action: 'bake_assistant' }, { success: true, hostname: config.hostname, action: 'other' }]) {
    await assert.rejects(verifyAssistantChallenge(request(), config, fetchResult(result)), isError('VERIFICATION_REQUIRED'));
  }
  await verifyAssistantChallenge(request(), config, async (url, options) => {
    assert.equal(url, 'https://challenges.cloudflare.com/turnstile/v0/siteverify');
    assert.deepEqual(JSON.parse(options!.body as string), { secret: config.secretKey, response: 'single-use-token', remoteip: '203.0.113.1' });
    return new Response(JSON.stringify({ success: true, hostname: config.hostname, action: 'bake_assistant' }));
  });
});
void test('verification outage or malformed response never authorizes a model request', async () => {
  await assert.rejects(verifyAssistantChallenge(request(), config, fetchResult({}, 503)), isError('SERVICE_UNAVAILABLE'));
  await assert.rejects(verifyAssistantChallenge(request(), config, async () => { throw new Error('offline'); }), isError('SERVICE_UNAVAILABLE'));
  await assert.rejects(verifyAssistantChallenge(request(), config, async () => new Response('not-json')), isError('SERVICE_UNAVAILABLE'));
});
