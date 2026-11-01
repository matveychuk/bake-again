import type { recipeSubscription } from './single-opt-in.ts';
export type BrevoContact = {
  listIds?: number[];
  listUnsubscribed?: number[];
  emailBlacklisted?: boolean;
};
export class BrevoApiError extends Error {
  status: number;
  constructor(status: number) {
    super('Email service unavailable');
    this.status = status;
  }
}
export function brevoApi(apiKey: string, fetcher: typeof fetch = fetch) {
  async function request(path: string, method = 'GET', body?: unknown) {
    const response = await fetcher(`https://api.brevo.com/v3${path}`, {
      method,
      headers: {
        'api-key': apiKey,
        accept: 'application/json',
        'content-type': 'application/json',
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal: AbortSignal.timeout(15_000),
    });
    if (response.status === 404 && method === 'GET') return null;
    if (!response.ok) throw new BrevoApiError(response.status);
    return response.status === 204 ? {} : response.json();
  }
  return {
    async contact(email: string): Promise<BrevoContact | null> {
      return (await request(
        `/contacts/${encodeURIComponent(email)}`,
      )) as BrevoContact | null;
    },
    async subscribe(
      email: string,
      subscription: ReturnType<typeof recipeSubscription>,
    ) {
      // Omit blacklist/unsubscribe fields and EMAIL attributes. Never reset suppression,
      // remove/re-add membership, force-merge, send SMTP, or start a DOI flow.
      await request('/contacts', 'POST', {
        email,
        ...subscription,
        updateEnabled: true,
      });
    },
  };
}
