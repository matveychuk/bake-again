import { brevoApi } from './brevo-api.ts';
import { deliveryStore, type DeliveryRequest } from './delivery-store.ts';
import { isMagnetId, type MagnetId } from './magnets.ts';
import {
  isSuppressed,
  recipeSubscription,
  type SubscriptionPlacement,
} from './single-opt-in.ts';
export class DeliveryError extends Error {
  status: number;
  constructor(status: number) {
    super('Recipe request unavailable');
    this.status = status;
  }
}
export const digest = async (value: string) =>
  Array.from(
    new Uint8Array(
      await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)),
    ),
    (b) => b.toString(16).padStart(2, '0'),
  ).join('');
const tokenValue = () =>
  Array.from(crypto.getRandomValues(new Uint8Array(32)), (b) =>
    b.toString(16).padStart(2, '0'),
  ).join('');
type Store = ReturnType<typeof deliveryStore>;
type Api = ReturnType<typeof brevoApi>;
export function createDeliveryService(
  store: Store,
  api: Api,
  now = () => Math.floor(Date.now() / 1000),
) {
  async function register(
    row: DeliveryRequest,
    placement: SubscriptionPlacement,
  ) {
    if (row.status === 'sent') return;
    if (!(await store.claim(row.id, now()))) throw new DeliveryError(409);
    try {
      const contact = await api.contact(row.email);
      if (isSuppressed(contact)) {
        await store.status(row.id, 'sent', now());
        return;
      }
      await api.subscribe(row.email, recipeSubscription(row.magnet, placement));
      // Historical D1 'sent' means the request was handed to the provider.
      // It is never evidence that an automation ran or an inbox received a PDF.
      await store.status(row.id, 'sent', now());
    } catch {
      await store.status(row.id, 'failed', now());
      throw new DeliveryError(503);
    }
  }
  return {
    async request(
      email: string,
      magnet: MagnetId,
      networkKey: string,
      placement: SubscriptionPlacement = 'landing',
    ) {
      const time = now();
      const row: DeliveryRequest = {
        id: crypto.randomUUID(),
        token_hash: await digest(tokenValue()),
        dedupe_key: await digest(
          `${email}\n${magnet}\n${Math.floor(time / 600)}`,
        ),
        email,
        magnet,
        network_key: networkKey,
        created_at: time,
        expires_at: time + 86400,
        status: 'pending',
      };
      const admitted = await store.insert(row);
      if (!admitted) return;
      row.id = admitted;
      await store.cleanup(time);
      await register(row, placement);
    },
    async confirm(token: string): Promise<MagnetId> {
      if (!/^[a-f0-9]{64}$/.test(token)) throw new DeliveryError(400);
      const row = await store.find(await digest(token));
      if (!row || row.expires_at <= now()) throw new DeliveryError(410);
      // Old return links remain recoverable, but no second SMTP sender is revived.
      await register(row, 'landing');
      return row.magnet;
    },
  };
}
export function parseRecipeRequest(body: unknown): {
  email: string;
  magnet: MagnetId;
  token: string;
  placement: SubscriptionPlacement;
} {
  if (!body || typeof body !== 'object') throw new DeliveryError(400);
  const input = body as Record<string, unknown>;
  const email =
    typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
  if (
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !isMagnetId(input.magnet) ||
    typeof input.token !== 'string' ||
    !input.token ||
    input.token.length > 2048 ||
    /\s/.test(input.token) ||
    input.consent !== true ||
    input.website ||
    (input.placement !== undefined &&
      input.placement !== 'landing' &&
      input.placement !== 'recipe')
  )
    throw new DeliveryError(400);
  const placement = input.placement === 'recipe' ? 'recipe' : 'landing';
  try {
    recipeSubscription(input.magnet, placement);
  } catch {
    throw new DeliveryError(400);
  }
  return { email, magnet: input.magnet, token: input.token, placement };
}
