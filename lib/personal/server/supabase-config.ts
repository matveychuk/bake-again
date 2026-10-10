import { PersonalError } from './errors.ts';

export interface SupabasePersonalConfig {
  url: string;
  publishableKey: string;
  issuer: string;
}

/** Runtime-only configuration. No secrets, build-time values or request-derived URLs. */
export function supabasePersonalConfig(
  bindings: Record<string, unknown>,
): SupabasePersonalConfig | null {
  if (
    bindings.PERSONAL_BACKEND === undefined ||
    bindings.PERSONAL_BACKEND === '' ||
    bindings.PERSONAL_BACKEND === 'disabled'
  )
    return null;
  if (bindings.PERSONAL_BACKEND !== 'supabase')
    throw new PersonalError('SERVICE_UNAVAILABLE', 503);
  const url = bindings.SUPABASE_URL,
    key = bindings.SUPABASE_PUBLISHABLE_KEY;
  // Only the selected hosted Supabase shape is supported. Custom domains/local Auth
  // require a separately reviewed configuration path; never accept an arbitrary URL.
  if (
    typeof url !== 'string' ||
    !/^https:\/\/[a-z0-9]{20}\.supabase\.co\/?$/.test(url) ||
    typeof key !== 'string' ||
    !/^sb_publishable_[A-Za-z0-9_-]{20,200}$/.test(key)
  ) {
    throw new PersonalError('SERVICE_UNAVAILABLE', 503);
  }
  const normalized = url.replace(/\/$/, '');
  return {
    url: normalized,
    publishableKey: key,
    issuer: `${normalized}/auth/v1`,
  };
}
