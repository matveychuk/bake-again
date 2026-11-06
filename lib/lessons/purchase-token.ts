import { constantEqual } from './payhip.ts';
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
async function signature(value: string, secret: string) {
  if (secret.length < 32) throw new Error('Missing lesson signing secret');
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  return Array.from(
    new Uint8Array(
      await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value)),
    ),
    (b) => b.toString(16).padStart(2, '0'),
  ).join('');
}
export async function purchaseToken(
  id: string,
  secret: string,
  now = Date.now(),
) {
  if (!uuid.test(id)) throw new Error('Invalid entitlement');
  const body = `purchase.${id}.${Math.floor(now / 1000) + 90 * 86400}`;
  return `${body}.${await signature(body, secret)}`;
}
export async function readPurchaseToken(
  token: string,
  secret: string,
  now = Date.now(),
) {
  const parts = token.split('.');
  if (
    parts.length !== 4 ||
    parts[0] !== 'purchase' ||
    !uuid.test(parts[1]) ||
    !/^\d{10}$/.test(parts[2]) ||
    !/^[a-f0-9]{64}$/.test(parts[3])
  )
    return null;
  if (Number(parts[2]) <= now / 1000) return null;
  return constantEqual(
    parts[3],
    await signature(parts.slice(0, 3).join('.'), secret),
  )
    ? parts[1]
    : null;
}
