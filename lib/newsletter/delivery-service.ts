import { brevoApi, isConfirmedSubscriber, type BrevoContact } from './brevo-api.ts';
import { deliveryStore, type DeliveryRequest } from './delivery-store.ts';
import { isMagnetId, type MagnetId } from './magnets.ts';

export class DeliveryError extends Error {
  status: number;
  constructor(status: number) { super('Recipe request unavailable'); this.status=status; }
}
export const digest = async (value: string) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value))), b=>b.toString(16).padStart(2,'0')).join('');
const tokenValue = () => Array.from(crypto.getRandomValues(new Uint8Array(32)),b=>b.toString(16).padStart(2,'0')).join('');
type Store = ReturnType<typeof deliveryStore>;
type Api = ReturnType<typeof brevoApi>;
const blocked = (contact: BrevoContact | null) => contact?.emailBlacklisted === true || !!contact?.listUnsubscribed?.some(id=>[4,5,6].includes(id));

export function createDeliveryService(store: Store, api: Api, now = () => Math.floor(Date.now()/1000)) {
  async function deliver(row: DeliveryRequest) {
    if (row.status === 'sent') return;
    if (!await store.claim(row.id,now())) throw new DeliveryError(409);
    try {
      await api.deliver(row.email,row.magnet,row.id);
      await store.status(row.id,'sent',now());
    } catch {
      // Preserve the idempotency key. An uncertain upstream response must never
      // create a fresh delivery identity or silently report a successful send.
      await store.status(row.id,'failed',now());
      throw new DeliveryError(503);
    }
  }
  return {
    async request(email: string, magnet: MagnetId, networkKey: string) {
      const time = now();
      const contact = await api.contact(email);
      // Do not automatically reverse an unsubscribe/block, including via SMTP.
      if (blocked(contact)) return;
      const token = tokenValue();
      const row: DeliveryRequest = {
        id:crypto.randomUUID(), token_hash:await digest(token),
        dedupe_key:await digest(`${email}\n${magnet}\n${Math.floor(time/600)}`),
        email,magnet,network_key:networkKey,created_at:time,expires_at:time+86400,status:'pending',
      };
      const admitted = await store.insert(row);
      if (!admitted) return;
      row.id=admitted;
      await store.cleanup(time);
      if (isConfirmedSubscriber(contact)) return deliver(row);
      try {
        await api.confirm(email,`https://bakeagain.com/uk/recept-confirmed#token=${token}`);
        await store.status(row.id,'awaiting_confirmation',now());
      } catch {
        await store.status(row.id,'failed',now());
        throw new DeliveryError(503);
      }
    },
    async confirm(token: string): Promise<MagnetId> {
      if (!/^[a-f0-9]{64}$/.test(token)) throw new DeliveryError(400);
      const row = await store.find(await digest(token));
      if (!row || row.expires_at<=now()) throw new DeliveryError(410);
      if (row.status==='sent') return row.magnet;
      // A redirect, a token, an existing contact, and a button click are not
      // subscription evidence. Brevo must have completed native DOI first.
      const contact = await api.contact(row.email);
      if (blocked(contact) || !isConfirmedSubscriber(contact)) throw new DeliveryError(409);
      await deliver(row);
      return row.magnet;
    },
  };
}

export function parseRecipeRequest(body: unknown): { email: string; magnet: MagnetId; token: string } {
  if (!body || typeof body!=='object') throw new DeliveryError(400);
  const input = body as Record<string,unknown>;
  const email = typeof input.email==='string' ? input.email.trim().toLowerCase() : '';
  if (email.length>254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !isMagnetId(input.magnet)
    || typeof input.token!=='string' || !input.token || input.token.length>2048 || /\s/.test(input.token)
    || input.consent!==true || input.website) throw new DeliveryError(400);
  return {email,magnet:input.magnet,token:input.token};
}
