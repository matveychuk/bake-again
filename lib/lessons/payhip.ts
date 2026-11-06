export class LessonError extends Error {
  status: number;
  constructor(status: number) {
    super('Lesson unavailable');
    this.status = status;
  }
}
export const normalizeEmail = (email: string) => email.trim().toLowerCase();
export async function sha256(value: string) {
  return Array.from(
    new Uint8Array(
      await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)),
    ),
    (b) => b.toString(16).padStart(2, '0'),
  ).join('');
}
export function constantEqual(a: string, b: string) {
  let difference = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++)
    difference |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return difference === 0;
}
export type PayhipEvent = {
  checkoutId?: string;
  transactionId: string;
  email: string;
  productId: string;
  type: 'paid' | 'refunded';
  price: number;
  refunded: number;
  eventKey: string;
  refundedAt: string | null;
};
/** Signature authenticates a static secret, not the payload; require the secret URL too. */
export async function parsePayhip(
  body: unknown,
  apiKey: string,
  products: string[],
): Promise<PayhipEvent | null> {
  if (!body || typeof body !== 'object') throw new LessonError(400);
  const b = body as Record<string, unknown>;
  if (
    typeof b.signature !== 'string' ||
    !constantEqual(b.signature, await sha256(apiKey))
  )
    throw new LessonError(401);
  if (b.type !== 'paid' && b.type !== 'refunded') return null;
  if (!Array.isArray(b.items)) throw new LessonError(400);
  const item = b.items.find(
    (i) =>
      i &&
      typeof i === 'object' &&
      [i.product_id, i.product_key].some(
        (id) => typeof id === 'string' && products.includes(id),
      ),
  );
  if (!item) return null;
  if (
    typeof b.id !== 'string' ||
    !/^[A-Za-z0-9_-]{1,128}$/.test(b.id) ||
    typeof b.email !== 'string' ||
    b.email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(b.email)) ||
    !Number.isSafeInteger(b.price) ||
    (b.price as number) < 0
  )
    throw new LessonError(400);
  const refunded = b.type === 'refunded' ? b.amount_refunded : 0;
  if (!Number.isSafeInteger(refunded) || (refunded as number) < 0)
    throw new LessonError(400);
  if (
    b.type === 'refunded' &&
    (typeof b.date_refunded !== 'number' ||
      !Number.isSafeInteger(b.date_refunded) ||
      b.date_refunded < 0 ||
      b.date_refunded > 8640000000000)
  )
    throw new LessonError(400);
  return {
    checkoutId:
      typeof b.metadata === 'object' &&
      b.metadata !== null &&
      typeof (b.metadata as Record<string, unknown>).ba_checkout === 'string' &&
      /^[0-9a-f-]{36}$/.test((b.metadata as Record<string, string>).ba_checkout)
        ? (b.metadata as Record<string, string>).ba_checkout
        : undefined,
    transactionId: b.id,
    email: normalizeEmail(b.email),
    productId: String(item.product_id ?? item.product_key),
    type: b.type,
    price: b.price as number,
    refunded: refunded as number,
    eventKey: `${b.id}:${b.type}:${String(refunded)}`,
    refundedAt:
      b.type === 'refunded'
        ? new Date((b.date_refunded as number) * 1000).toISOString()
        : null,
  };
}
