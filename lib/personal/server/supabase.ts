import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { PersonalErrorCode } from '../contracts.ts';
import { PersonalError } from './errors.ts';
import type { PersonalAuthenticator, VerifiedIdentity } from './identity.ts';
import type { PersonalRepository } from './repository.ts';
import { personalRecordFromRow, type PersonalRecordRow } from './record-row.ts';
import type { SupabasePersonalConfig } from './supabase-config.ts';

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const jwt = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;

/** Per-request client. The public key never bypasses RLS; no service_role fallback. */
export function createSupabasePersonalBackend(
  config: SupabasePersonalConfig,
  fetcher: typeof fetch = fetch,
): {
  auth: PersonalAuthenticator;
  repository: () => Promise<PersonalRepository>;
  sync: (action: string, input: Record<string, unknown>) => Promise<unknown>;
} {
  let repository: PersonalRepository | null = null;
  let authenticatedClient: SupabaseClient | null = null;
  return {
    auth: {
      async authenticate(request) {
        repository = null;
        authenticatedClient = null;
        const authorization = request.headers.get('authorization');
        if (!authorization) return null;
        // Reject malformed/combined headers before calling the provider. Cookies and
        // Sites identity headers cannot authenticate this bearer-only foundation.
        if (!authorization.startsWith('Bearer ')) return null;
        const token = authorization.slice(7);
        if (token.length > 8192 || !jwt.test(token)) return null;
        const client = createClient(config.url, config.publishableKey, {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
          },
          global: {
            headers: { Authorization: `Bearer ${token}` },
            fetch: (input, init) =>
              fetcher(input, {
                ...init,
                cache: 'no-store',
                signal: AbortSignal.timeout(8000),
              }),
          },
        });
        // getUser validates with this project's Auth server. Never trust decoded
        // claims, getSession(), caller subjects, or the public key as a user token.
        const { data, error } = await client.auth.getUser(token);
        if (error) {
          if (
            error.status === 401 ||
            error.status === 403 ||
            error.status === 400
          )
            return null;
          throw new PersonalError('SERVICE_UNAVAILABLE', 503);
        }
        const user = data.user;
        if (
          !user ||
          !uuid.test(user.id) ||
          user.is_anonymous ||
          user.aud !== 'authenticated' ||
          user.role !== 'authenticated' ||
          !user.email_confirmed_at
        )
          return null;
        authenticatedClient = client;
        const identity: VerifiedIdentity = {
          issuer: config.issuer,
          subject: user.id,
        };
        let resolvedAccount: string | null = null;
        repository = {
          async resolveAccount(candidate) {
            resolvedAccount = null;
            if (
              candidate.issuer !== identity.issuer ||
              candidate.subject !== identity.subject
            )
              return null;
            // RLS requires this exact verified identity and an active account. Reads
            // never create accounts or link identities based on an email address.
            const result = await client
              .from('personal_identities')
              .select('account_id')
              .eq('issuer', identity.issuer)
              .eq('subject', identity.subject)
              .is('revoked_at', null)
              .retry(false)
              .maybeSingle();
            if (result.error)
              throw new PersonalError('SERVICE_UNAVAILABLE', 503);
            const account = result.data?.account_id;
            if (account === undefined) return null;
            if (typeof account !== 'string' || !uuid.test(account))
              throw new PersonalError('SERVICE_UNAVAILABLE', 503);
            resolvedAccount = account;
            return account;
          },
          async readRecord(accountId, kind, key) {
            if (!resolvedAccount || accountId !== resolvedAccount) return null;
            const result = await client
              .from('personal_records')
              .select(
                'schema_version,revision,payload_json,updated_at,deleted_at',
              )
              .eq('account_id', accountId)
              .eq('kind', kind)
              .eq('record_key', key)
              .retry(false)
              .maybeSingle();
            // RLS rechecks account and identity revocation on this query too.
            if (result.error)
              throw new PersonalError('SERVICE_UNAVAILABLE', 503);
            return result.data
              ? personalRecordFromRow(
                  result.data as PersonalRecordRow,
                  kind,
                  key,
                )
              : null;
          },
        };
        return identity;
      },
    },
    async sync(action, input) {
      if (!authenticatedClient) throw new PersonalError('AUTH_REQUIRED', 401);
      const { data, error } = await authenticatedClient
        .rpc('personal_sync', { action, input })
        .retry(false);
      if (error) {
        const codes: Partial<Record<PersonalErrorCode, number>> = {
          AUTH_REQUIRED: 401,
          PERSONAL_FEATURES_DISABLED: 503,
          ACCOUNT_UNAVAILABLE: 403,
          INVALID_REQUEST: 400,
          REVISION_CONFLICT: 409,
          OPERATION_REUSED: 409,
          PAYLOAD_TOO_LARGE: 413,
          RATE_LIMITED: 429,
        };
        const code = error.message as PersonalErrorCode;
        throw new PersonalError(
          codes[code] ? code : 'SERVICE_UNAVAILABLE',
          codes[code] ?? 503,
        );
      }
      return data;
    },
    async repository() {
      if (!repository) throw new PersonalError('AUTH_REQUIRED', 401);
      return repository;
    },
  };
}
