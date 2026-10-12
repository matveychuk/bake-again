import type { Session } from '@supabase/supabase-js';

export type AuthLink =
  | { kind: 'none' }
  | { kind: 'invalid' }
  | { kind: 'code'; code: string; recovery: boolean }
  | { kind: 'token'; tokenHash: string; type: 'email' | 'recovery' };

// Only the account callback may consume an email credential. Never trust an
// email/identity supplied in the URL; the verified session supplies both.
export function readAuthLink(url: URL): AuthLink {
  if (!/^\/(uk|es|en)\/account$/.test(url.pathname)) return { kind: 'none' };
  const hash = new URLSearchParams(url.hash.slice(1));
  if (url.searchParams.has('error') || hash.has('error'))
    return { kind: 'invalid' };
  const tokenHash =
    hash.get('token_hash') ?? url.searchParams.get('token_hash');
  const type = hash.get('type') ?? url.searchParams.get('type');
  if (tokenHash !== null) {
    return tokenHash && (type === 'email' || type === 'recovery')
      ? { kind: 'token', tokenHash, type }
      : { kind: 'invalid' };
  }
  const code = url.searchParams.get('code');
  if (code)
    return {
      kind: 'code',
      code,
      recovery: url.searchParams.get('recovery') === '1',
    };
  if (url.searchParams.has('recovery') || hash.has('access_token'))
    return { kind: 'invalid' };
  return { kind: 'none' };
}

type Result = { data: { session: Session | null }; error: unknown };
type LinkAuth = {
  verifyOtp: (input: {
    token_hash: string;
    type: 'email' | 'recovery';
  }) => Promise<Result>;
  exchangeCodeForSession: (code: string) => Promise<Result>;
};
export async function verifyAuthLink(auth: LinkAuth, link: AuthLink) {
  if (link.kind === 'none') return null;
  if (link.kind === 'invalid') throw new Error('INVALID_AUTH_LINK');
  const result =
    link.kind === 'token'
      ? await auth.verifyOtp({ token_hash: link.tokenHash, type: link.type })
      : await auth.exchangeCodeForSession(link.code);
  if (result.error || !result.data.session)
    throw new Error('INVALID_AUTH_LINK');
  return {
    session: result.data.session,
    recovery: link.kind === 'token' ? link.type === 'recovery' : link.recovery,
  };
}

export function recoveryMatches(
  value: string | null,
  identity: string | undefined,
  now = Date.now(),
) {
  if (!value || !identity) return false;
  try {
    const marker = JSON.parse(value);
    return (
      marker.identity === identity &&
      Number.isFinite(marker.expiresAt) &&
      marker.expiresAt > now
    );
  } catch {
    return false;
  }
}
