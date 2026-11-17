import {
  panettoneCampaign,
  panettoneIsActive,
} from '../../content/articles/psyllium.ts';
import { brevoApi } from './brevo-api.ts';
import { deliveryStore, type DeliveryRequest } from './delivery-store.ts';
import { DeliveryError, digest } from './delivery-service.ts';
import { isSuppressed } from './single-opt-in.ts';

export function panettoneListId(bindings: Record<string, unknown>) {
  const id = Number(
    bindings.BREVO_PANETTONE_LIST_ID ?? panettoneCampaign.listId,
  );
  // A campaign must never silently degrade to only the master/language lists.
  return Number.isSafeInteger(id) && id > 0 && ![3, 4, 5, 6].includes(id)
    ? id
    : null;
}

export function panettoneConfigured(bindings: Record<string, unknown>) {
  return (
    bindings.NEWSLETTER_ENABLED === 'true' &&
    typeof bindings.BREVO_API_KEY === 'string' &&
    !!bindings.BREVO_API_KEY &&
    typeof bindings.TURNSTILE_SITE_KEY === 'string' &&
    !!bindings.TURNSTILE_SITE_KEY &&
    panettoneListId(bindings) !== null
  );
}

export function parsePanettoneRequest(body: unknown) {
  if (!body || typeof body !== 'object') throw new DeliveryError(400);
  const input = body as Record<string, unknown>;
  const email =
    typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
  if (
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    typeof input.token !== 'string' ||
    !input.token ||
    input.token.length > 2048 ||
    /\s/.test(input.token) ||
    input.consent !== true ||
    input.website ||
    (input.source !== undefined &&
      (typeof input.source !== 'string' ||
        input.source.length > 200 ||
        Array.from(input.source).some(
          (char) => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127,
        )))
  )
    throw new DeliveryError(400);
  return {
    email,
    token: input.token,
    source: (input.source as string | undefined) || 'direct',
  };
}

export function panettoneSubscription(listId: number, source: string) {
  return {
    listIds: [3, 4, listId],
    attributes: {
      SOURCE: source,
      SIGNUP_PAGE: 'blog-psyllium',
      SIGNUP_POSITION: 'top-panettone',
    },
  };
}

/** Shares the existing atomic quotas and short-lived ledger; no new email sender. */
export function createPanettoneService(
  store: ReturnType<typeof deliveryStore>,
  api: ReturnType<typeof brevoApi>,
  listId: number,
  now = () => new Date(),
) {
  return async (email: string, source: string, networkKey: string) => {
    if (!panettoneIsActive('uk', now())) throw new DeliveryError(410);
    const time = Math.floor(now().getTime() / 1000);
    const row: DeliveryRequest = {
      id: crypto.randomUUID(),
      token_hash: await digest(crypto.randomUUID()),
      dedupe_key: await digest(
        `${email}\npanettone\n${Math.floor(time / 600)}`,
      ),
      email,
      magnet: 'panettone',
      network_key: networkKey,
      created_at: time,
      expires_at: time + 86400,
      status: 'pending',
    };
    const id = await store.insert(row);
    if (!id) {
      // A duplicate or quota refusal must not claim success before provider handoff.
      const contact = await api.contact(email);
      if (
        isSuppressed(contact) ||
        contact?.listUnsubscribed?.includes(listId) ||
        [3, 4, listId].every((list) => contact?.listIds?.includes(list))
      )
        return;
      throw new DeliveryError(429);
    }
    await store.cleanup(time);
    if (!(await store.claim(id, time))) throw new DeliveryError(409);
    try {
      const contact = await api.contact(email);
      if (
        !isSuppressed(contact) &&
        !contact?.listUnsubscribed?.includes(listId)
      )
        await api.subscribe(email, panettoneSubscription(listId, source));
      await store.status(id, 'sent', time);
    } catch {
      await store.status(id, 'failed', time);
      throw new DeliveryError(503);
    }
  };
}
