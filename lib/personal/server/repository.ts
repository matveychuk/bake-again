import type { PersonalKind, PersonalRecordV1 } from '../contracts.ts';
import type { VerifiedIdentity } from './identity.ts';

/** No hosting types cross this port. PostgreSQL/HTTP adapters can replace D1. */
export interface PersonalRepository {
  resolveAccount(identity: VerifiedIdentity): Promise<string | null>;
  readRecord(
    accountId: string,
    kind: PersonalKind,
    key: string,
  ): Promise<PersonalRecordV1 | null>;
}
