import { PersonalError } from './errors.ts';

/** Supplied ONLY by a server adapter that has verified the provider's session.
 * issuer must include the provider's project/tenant/Site namespace. No email linkage.
 */
export interface VerifiedIdentity {
  issuer: string;
  subject: string;
}
export interface PersonalAuthenticator {
  authenticate(request: Request): Promise<VerifiedIdentity | null>;
}

/** Default when no verified provider adapter is configured. A configured provider
 * must validate the user's token; Sites dev headers are a simulation, not proof.
 */
export const disabledPersonalAuthenticator: PersonalAuthenticator = {
  async authenticate() {
    throw new PersonalError('PERSONAL_FEATURES_DISABLED', 503);
  },
};

export function isVerifiedIdentityShape(v: unknown): v is VerifiedIdentity {
  if (!v || typeof v !== 'object') return false;
  const i = v as Record<string, unknown>;
  return (
    typeof i.issuer === 'string' &&
    i.issuer.length > 0 &&
    i.issuer.length <= 256 &&
    typeof i.subject === 'string' &&
    i.subject.length > 0 &&
    i.subject.length <= 1024 &&
    Array.from(i.issuer + i.subject).every(
      (character) => character.charCodeAt(0) >= 32,
    )
  );
}
