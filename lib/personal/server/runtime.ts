import { createD1PersonalRepository, type PersonalDatabase } from './d1.ts';
import { PersonalError } from './errors.ts';

/** Existing binding name is intentional; tables and access policies are separate.
 * No Node/process/in-memory database fallback in an application request.
 */
export async function getPersonalRepository() {
  const { env } = await import('cloudflare:workers');
  const db = (env as Record<string, unknown>).ASSISTANT_QUOTAS as
    | PersonalDatabase
    | undefined;
  if (!db || typeof db.prepare !== 'function')
    throw new PersonalError('SERVICE_UNAVAILABLE', 503);
  return createD1PersonalRepository(db);
}

export async function getPersonalBindings(): Promise<Record<string, unknown>> {
  try {
    const { env } = await import('cloudflare:workers');
    return env as Record<string, unknown>;
  } catch {
    // Plain Node tests have no Worker bindings. Do not substitute process.env or
    // credentials from disk; the configured handler stays disabled.
    return {};
  }
}
