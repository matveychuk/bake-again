import { isIP } from 'node:net';
import { AssistantServiceError } from './errors.ts';
import { createD1AssistantQuotaStore, type QuotaDatabase } from './quotas.ts';

export const TURNSTILE_ACTION = 'bake_assistant';
export const TURNSTILE_HEADER = 'x-assistant-verification';
export const TURNSTILE_SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

function required(bindings: Record<string, unknown>, name: string) {
  const value = bindings[name];
  if (typeof value !== 'string' || !value.trim()) throw new AssistantServiceError('ASSISTANT_DISABLED', 503);
  return value.trim();
}
function budget(bindings: Record<string, unknown>, name: string, fallback: string) {
  const value = bindings[name] || fallback;
  if (typeof value !== 'string' || !/^\d{1,6}(?:\.\d{1,6})?$/.test(value))
    throw new AssistantServiceError('ASSISTANT_DISABLED', 503);
  return Math.round(Number(value) * 1_000_000);
}

export function getAssistantProtection(bindings: Record<string, unknown>) {
  const siteKey = required(bindings, 'TURNSTILE_SITE_KEY');
  const secretKey = required(bindings, 'TURNSTILE_SECRET_KEY');
  const hostname = required(bindings, 'ASSISTANT_ALLOWED_HOSTNAME').toLowerCase();
  if (!/^[a-z0-9.-]+$/.test(hostname) || hostname.includes('..') || hostname.length > 253)
    throw new AssistantServiceError('ASSISTANT_DISABLED', 503);
  // Official dummy keys must never authorize paid calls, even in local development.
  if (/^[123]x0/.test(siteKey) || /^[123]x0/.test(secretKey))
    throw new AssistantServiceError('ASSISTANT_DISABLED', 503);
  const binding = typeof bindings.ASSISTANT_QUOTA_BINDING === 'string' ? bindings.ASSISTANT_QUOTA_BINDING : 'ASSISTANT_QUOTAS';
  const db = bindings[binding] as QuotaDatabase | undefined;
  if (!db || typeof db.prepare !== 'function') throw new AssistantServiceError('ASSISTANT_DISABLED', 503);
  return { siteKey, secretKey, hostname, store: createD1AssistantQuotaStore(db, {
    dailyMicrousd: budget(bindings, 'ASSISTANT_DAILY_BUDGET_USD', '1'),
    monthlyMicrousd: budget(bindings, 'ASSISTANT_MONTHLY_BUDGET_USD', '10'),
  }) };
}

export function trustedIngressAddress(request: Request): string {
  // Only deploy behind Cloudflare's ingress, which sets this header. Do not use X-Forwarded-For.
  const address = request.headers.get('cf-connecting-ip');
  if (!address || !isIP(address)) throw new AssistantServiceError('SERVICE_UNAVAILABLE', 503);
  return address;
}

export async function verifyAssistantChallenge(request: Request,
  config: { secretKey: string; hostname: string }, fetcher: typeof fetch = fetch) {
  const token = request.headers.get(TURNSTILE_HEADER);
  if (!token || token.length > 2048 || /\s/.test(token)) throw new AssistantServiceError('VERIFICATION_REQUIRED', 403);
  if (new URL(request.url).hostname !== config.hostname) throw new AssistantServiceError('VERIFICATION_REQUIRED', 403);
  let result: unknown;
  try {
    const response = await fetcher(TURNSTILE_SITEVERIFY, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ secret: config.secretKey, response: token, remoteip: trustedIngressAddress(request) }),
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(5000)]),
    });
    if (!response.ok) throw new Error('Verification unavailable');
    result = await response.json();
  } catch { throw new AssistantServiceError('SERVICE_UNAVAILABLE', 503); }
  if (!result || typeof result !== 'object' || !('success' in result) || result.success !== true
    || !('hostname' in result) || result.hostname !== config.hostname
    || !('action' in result) || result.action !== TURNSTILE_ACTION)
    throw new AssistantServiceError('VERIFICATION_REQUIRED', 403);
}
