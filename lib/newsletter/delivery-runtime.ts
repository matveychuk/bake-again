import { brevoApi } from './brevo-api.ts';
import { deliveryStore, type DeliveryDatabase } from './delivery-store.ts';
import {
  createDeliveryService,
  DeliveryError,
  digest,
} from './delivery-service.ts';
export async function deliveryBindings(): Promise<Record<string, unknown>> {
  try {
    const { env } = await import('cloudflare:workers');
    return env as Record<string, unknown>;
  } catch {
    return {};
  }
}
export function deliveryConfigured(bindings: Record<string, unknown>): boolean {
  return (
    bindings.LEAD_MAGNET_ENABLED === 'true' &&
    typeof bindings.BREVO_API_KEY === 'string' &&
    !!bindings.BREVO_API_KEY &&
    typeof bindings.TURNSTILE_SITE_KEY === 'string'
  );
}
export function runtimeDelivery(bindings: Record<string, unknown>) {
  if (!deliveryConfigured(bindings) || !bindings.ASSISTANT_QUOTAS)
    throw new DeliveryError(503);
  return createDeliveryService(
    deliveryStore(bindings.ASSISTANT_QUOTAS as DeliveryDatabase),
    brevoApi(bindings.BREVO_API_KEY as string),
  );
}
const localHosts = ['localhost', '127.0.0.1', '[::1]'];
/** Explicit local-only testing with Cloudflare's documented dummy keys. Never on a public host. */
export function isLocalRecipeTest(
  request: Request,
  bindings: Record<string, unknown>,
) {
  return (
    bindings.NEWSLETTER_LOCAL_TEST === 'true' &&
    localHosts.includes(new URL(request.url).hostname) &&
    bindings.TURNSTILE_SITE_KEY === '1x00000000000000000000AA' &&
    bindings.TURNSTILE_SECRET_KEY === '1x0000000000000000000000000000000AA'
  );
}
export function requireRecipeOrigin(
  request: Request,
  bindings: Record<string, unknown> = {},
) {
  const url = new URL(request.url);
  if (
    (url.hostname !== 'bakeagain.com' &&
      !isLocalRecipeTest(request, bindings)) ||
    request.headers.get('origin') !== url.origin ||
    !request.headers.get('content-type')?.startsWith('application/json') ||
    Number(request.headers.get('content-length') ?? '0') > 8192
  )
    throw new DeliveryError(403);
}
export async function readRecipeBody(request: Request): Promise<unknown> {
  const reader = request.body?.getReader();
  if (!reader) throw new DeliveryError(400);
  let size = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const chunk = await reader.read();
    if (chunk.done) break;
    size += chunk.value.byteLength;
    if (size > 8192) {
      await reader.cancel();
      throw new DeliveryError(413);
    }
    chunks.push(chunk.value);
  }
  const data = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    data.set(chunk, offset);
    offset += chunk.length;
  }
  try {
    return JSON.parse(new TextDecoder().decode(data));
  } catch {
    throw new DeliveryError(400);
  }
}
export async function verifyRecipeChallenge(
  request: Request,
  token: string,
  bindings: Record<string, unknown>,
  fetcher: typeof fetch = fetch,
) {
  if (
    typeof bindings.TURNSTILE_SECRET_KEY !== 'string' ||
    typeof bindings.ASSISTANT_SESSION_SECRET !== 'string'
  )
    throw new DeliveryError(503);
  const localTest = isLocalRecipeTest(request, bindings);
  const ip =
    request.headers.get('cf-connecting-ip') ?? (localTest ? '127.0.0.1' : null);
  if (!ip) throw new DeliveryError(503);
  const response = await fetcher(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      signal: AbortSignal.timeout(5000),
      body: JSON.stringify({
        secret: bindings.TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: ip,
      }),
    },
  );
  if (!response.ok) throw new DeliveryError(503);
  const result = (await response.json()) as {
    success?: boolean;
    hostname?: string;
    action?: string;
  };
  const validContext = localTest
    ? localHosts.includes(result.hostname ?? '') &&
      ['test', 'recipe_request'].includes(result.action ?? '')
    : result.hostname === 'bakeagain.com' && result.action === 'recipe_request';
  if (result.success !== true || !validContext) throw new DeliveryError(403);
  // Purpose-separated network identifier, never persist the raw ingress address.
  return digest(
    `recipe-request\n${bindings.ASSISTANT_SESSION_SECRET}\n${new Date().toISOString().slice(0, 10)}\n${ip}`,
  );
}
export function recipeResponse(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      'cache-control': 'no-store',
      'referrer-policy': 'no-referrer',
      'x-robots-tag': 'noindex',
    },
  });
}
