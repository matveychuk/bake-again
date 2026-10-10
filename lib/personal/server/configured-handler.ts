import { createPersonalRecordHandler } from './http.ts';
import { disabledPersonalAuthenticator } from './identity.ts';
import { createSupabasePersonalBackend } from './supabase.ts';
import { supabasePersonalConfig } from './supabase-config.ts';
import { PersonalError } from './errors.ts';

/** Construct all identity state within a request; never share clients across users. */
export function createConfiguredPersonalRecordHandler(
  bindings: () => Promise<Record<string, unknown>>,
  fetcher?: typeof fetch,
) {
  return async (request: Request): Promise<Response> => {
    let backend: ReturnType<typeof createSupabasePersonalBackend> | null = null;
    return createPersonalRecordHandler({
      auth: {
        async authenticate(input) {
          const config = supabasePersonalConfig(await bindings());
          if (!config) return disabledPersonalAuthenticator.authenticate(input);
          backend = createSupabasePersonalBackend(config, fetcher);
          return backend.auth.authenticate(input);
        },
      },
      async repository() {
        if (!backend) throw new PersonalError('AUTH_REQUIRED', 401);
        return backend.repository();
      },
    })(request);
  };
}
