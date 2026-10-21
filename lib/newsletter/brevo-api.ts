import { recipeEmail } from './magnet-email.ts';
import type { MagnetId } from './magnets.ts';
export type BrevoContact = { listIds?: number[]; listUnsubscribed?: number[]; emailBlacklisted?: boolean };
export function isConfirmedSubscriber(contact: BrevoContact | null): boolean {
  return !!contact && contact.emailBlacklisted === false && [4,5,6].some(id => contact.listIds?.includes(id) && !contact.listUnsubscribed?.includes(id));
}
export class BrevoApiError extends Error {
  status: number;
  constructor(status: number) { super('Email service unavailable'); this.status=status; }
}
export function brevoApi(apiKey: string, doiTemplate: number, fetcher: typeof fetch = fetch) {
  async function request(path: string, method = 'GET', body?: unknown) {
    const response = await fetcher(`https://api.brevo.com/v3${path}`, {
      method, headers: { 'api-key': apiKey, accept: 'application/json', 'content-type': 'application/json' },
      ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(15_000),
    });
    if (response.status === 404 && method === 'GET') return null;
    if (!response.ok) {
      const detail=await response.json().catch(()=>({})) as {code?:unknown;message?:unknown};
      const code=typeof detail.code==='string' && /^[a-z_]{1,48}$/.test(detail.code) ? detail.code : 'unknown';
      // Only fixed diagnostic labels; never record provider prose or contact data.
      const message=typeof detail.message==='string'?detail.message.toLowerCase():'';
      const fields=['template','redirection','doubleoptin','doiurl','attribute','list','email','url','sender'].filter(field=>message.includes(field));
      console.warn('recipe_email_provider_error',{operation:method==='GET'?'contact':path==='/smtp/email'?'deliver':'confirm',status:response.status,code,fields});
      throw new BrevoApiError(response.status);
    }
    return response.status === 204 ? {} : response.json();
  }
  return {
    async contact(email: string): Promise<BrevoContact | null> { return await request(`/contacts/${encodeURIComponent(email)}`) as BrevoContact | null; },
    async confirm(email: string, redirect: string) {
      await request('/contacts/doubleOptinConfirmation','POST',{
        email, includeListIds:[3,4], templateId:doiTemplate, redirectionUrl:redirect,
        // Excluded by the general welcome workflow BEFORE its send step.
        // Each request's identity is retained separately in D1, never overwritten here.
        attributes:{ BA_LEAD_SIGNUP:true },
      });
    },
    async deliver(email: string, magnet: MagnetId, id: string) {
      await request('/smtp/email','POST',{
        sender:{name:'Bake Again',email:'hello@bakeagain.com'}, replyTo:{name:'Bake Again',email:'hello@bakeagain.com'},
        to:[{email}], ...recipeEmail(magnet), tags:[`recipe-${magnet}`],
        headers:{IdempotencyKey:`recipe-${id}`},
      });
    },
  };
}
