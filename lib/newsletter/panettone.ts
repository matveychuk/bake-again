import {
  panettoneCampaign,
  panettoneIsActive,
  panettoneSignupPage,
} from '../../content/articles/psyllium.ts';
import { pancakeCampaign } from '../../content/articles/pancake-invitation.ts';
import records from './brevo-forms.json' with { type: 'json' };
import { brevoApi } from './brevo-api.ts';
import { deliveryStore, type DeliveryRequest } from './delivery-store.ts';
import { DeliveryError, digest } from './delivery-service.ts';
import { isSuppressed } from './single-opt-in.ts';

type SignupPage = NonNullable<ReturnType<typeof panettoneSignupPage>>;
type Waitlist = 'panettone' | 'pancakes';

export function panettoneListId(bindings: Record<string, unknown>) {
  const id = Number(
    bindings.BREVO_PANETTONE_LIST_ID ?? panettoneCampaign.listId,
  );
  // A campaign must never silently degrade to only the master/language lists.
  return Number.isSafeInteger(id) && id > 0 && ![3, 4, 5, 6].includes(id)
    ? id
    : null;
}

export function pancakesListId(bindings: Record<string, unknown>) {
  const id = Number(bindings.BREVO_PANCAKES_LIST_ID);
  const knownLists = records.providerRecords.singleOptin;
  const occupied = [
    knownLists.masterListId,
    ...Object.values(knownLists.localeListIds),
    ...Object.values(knownLists.bonusListIds),
    panettoneCampaign.listId,
    panettoneListId(bindings),
  ];
  return Number.isSafeInteger(id) && id > 0 && !occupied.includes(id)
    ? id
    : null;
}

function waitlistConfigured(
  bindings: Record<string, unknown>,
  listId: number | null,
) {
  return (
    bindings.NEWSLETTER_ENABLED === 'true' &&
    typeof bindings.BREVO_API_KEY === 'string' &&
    !!bindings.BREVO_API_KEY &&
    typeof bindings.TURNSTILE_SITE_KEY === 'string' &&
    !!bindings.TURNSTILE_SITE_KEY &&
    listId !== null
  );
}

export function panettoneConfigured(bindings: Record<string, unknown>) {
  return waitlistConfigured(bindings, panettoneListId(bindings));
}

export function pancakesConfigured(bindings: Record<string, unknown>) {
  return waitlistConfigured(bindings, pancakesListId(bindings));
}

function parseWaitlistRequest(body: unknown, campaign: Waitlist) {
  if (!body || typeof body !== 'object') throw new DeliveryError(400);
  const input = body as Record<string, unknown>;
  // Before the second placement, only the psyllium form called this endpoint.
  const signupPage =
    campaign === 'panettone'
      ? panettoneSignupPage(
          input.articlePath === undefined
            ? '/uk/blog/psyllium'
            : input.articlePath,
        )
      : input.articlePath === pancakeCampaign.articlePath
        ? 'blog-xanthan-gum'
        : null;
  if (!signupPage) throw new DeliveryError(400);
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
  const source = typeof input.source === 'string' ? input.source : '';
  return {
    email,
    token: input.token,
    source:
      campaign === 'panettone' ||
      ['ig-profile-pancakes', 'ig-story-pancakes'].includes(source)
        ? source || 'direct'
        : 'direct',
    signupPage,
  } as const;
}

export const parsePanettoneRequest = (body: unknown) =>
  parseWaitlistRequest(body, 'panettone');
export const parsePancakesRequest = (body: unknown) =>
  parseWaitlistRequest(body, 'pancakes');

function waitlistSubscription(
  listId: number,
  source: string,
  signupPage: SignupPage,
  campaign: Waitlist,
) {
  return {
    listIds: [3, 4, listId],
    attributes: {
      SOURCE: source,
      SIGNUP_PAGE: signupPage,
      SIGNUP_POSITION: `top-${campaign}`,
    },
  };
}

export const panettoneSubscription = (
  listId: number,
  source: string,
  signupPage: SignupPage,
) => waitlistSubscription(listId, source, signupPage, 'panettone');

/** Waitlists share the existing atomic quotas and short-lived ledger. */
function createWaitlistService(
  store: ReturnType<typeof deliveryStore>,
  api: ReturnType<typeof brevoApi>,
  listId: number,
  campaign: Waitlist,
  now = () => new Date(),
) {
  return async (
    email: string,
    source: string,
    networkKey: string,
    signupPage: SignupPage,
  ) => {
    if (campaign === 'panettone' && !panettoneIsActive('uk', now()))
      throw new DeliveryError(410);
    const time = Math.floor(now().getTime() / 1000);
    const row: DeliveryRequest = {
      id: crypto.randomUUID(),
      token_hash: await digest(crypto.randomUUID()),
      dedupe_key: await digest(
        `${email}\n${campaign}\n${Math.floor(time / 600)}`,
      ),
      email,
      magnet: campaign,
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
        await api.subscribe(
          email,
          waitlistSubscription(listId, source, signupPage, campaign),
        );
      await store.status(id, 'sent', time);
    } catch {
      await store.status(id, 'failed', time);
      throw new DeliveryError(503);
    }
  };
}

export function createPanettoneService(
  store: ReturnType<typeof deliveryStore>,
  api: ReturnType<typeof brevoApi>,
  listId: number,
  now = () => new Date(),
) {
  const subscribe = createWaitlistService(store, api, listId, 'panettone', now);
  return (
    email: string,
    source: string,
    networkKey: string,
    signupPage: SignupPage = 'blog-psyllium',
  ) => subscribe(email, source, networkKey, signupPage);
}

export function createPancakesService(
  store: ReturnType<typeof deliveryStore>,
  api: ReturnType<typeof brevoApi>,
  listId: number,
) {
  const subscribe = createWaitlistService(store, api, listId, 'pancakes');
  return (email: string, source: string, networkKey: string) =>
    subscribe(email, source, networkKey, 'blog-xanthan-gum');
}
