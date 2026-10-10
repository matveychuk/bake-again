import type { PersonalRepository } from './repository.ts';
import { personalRecordFromRow, type PersonalRecordRow } from './record-row.ts';

export interface PersonalStatement {
  bind(...values: (string | number | null)[]): PersonalStatement;
  first<T>(): Promise<T | null>;
}
export interface PersonalDatabase {
  prepare(sql: string): PersonalStatement;
}

export function createD1PersonalRepository(
  db: PersonalDatabase,
): PersonalRepository {
  return {
    async resolveAccount(identity) {
      const row = await db
        .prepare(`SELECT a.id FROM personal_accounts a
        JOIN personal_identities i ON i.account_id = a.id
        WHERE i.issuer = ? AND i.subject = ? AND i.revoked_at IS NULL AND a.disabled_at IS NULL`)
        .bind(identity.issuer, identity.subject)
        .first<{ id: string }>();
      return row?.id ?? null;
    },
    async readRecord(accountId, kind, key) {
      // Every read is owner-scoped, including reads of tombstones. An active-account
      // join also closes the resolveAccount -> disabled-account race.
      const row = await db
        .prepare(`SELECT r.schema_version, r.revision, r.payload_json, r.updated_at, r.deleted_at
        FROM personal_records r JOIN personal_accounts a ON a.id = r.account_id
        WHERE r.account_id = ? AND r.kind = ? AND r.record_key = ? AND a.disabled_at IS NULL`)
        .bind(accountId, kind, key)
        .first<PersonalRecordRow>();
      if (!row) return null;
      return personalRecordFromRow(row, kind, key);
    },
  };
}
