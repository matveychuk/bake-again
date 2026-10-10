// Test support only. Synthetic data, in-memory SQLite, no network or credentials.
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import {
  createD1PersonalRepository,
  type PersonalDatabase,
  type PersonalStatement,
} from './d1.ts';
import type { PersonalDataV1 } from '../contracts.ts';
import { personalRecordKey } from '../validation.ts';

export const accountA = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
export const accountB = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
export const now = Date.UTC(2026, 9, 9, 12);
export const identityA = {
  issuer: 'urn:test:provider:project-one',
  subject: 'reader-a',
};
export const identityB = {
  issuer: 'urn:test:provider:project-one',
  subject: 'reader-b',
};
export const oldMigration = readFileSync(
  new URL('../../../drizzle/0000_assistant_quotas.sql', import.meta.url),
  'utf8',
);
export const newMigration = readFileSync(
  new URL('../../../drizzle/0001_personal_foundation.sql', import.meta.url),
  'utf8',
);

export function fixture() {
  const sql = new DatabaseSync(':memory:');
  sql.exec('PRAGMA foreign_keys=ON');
  sql.exec(oldMigration);
  sql.exec(newMigration);
  const database: PersonalDatabase = {
    prepare(query) {
      const statement = sql.prepare(query);
      let args: (string | number | null)[] = [];
      const wrapped: PersonalStatement = {
        bind(...values) {
          args = values;
          return wrapped;
        },
        async first<T>() {
          return (statement.get(...args) as T | undefined) ?? null;
        },
      };
      return wrapped;
    },
  };
  for (const [account, identity] of [
    [accountA, identityA],
    [accountB, identityB],
  ] as const) {
    sql
      .prepare('INSERT INTO personal_accounts(id, created_at) VALUES (?, ?)')
      .run(account, now);
    sql
      .prepare(
        'INSERT INTO personal_identities(issuer, subject, account_id, created_at) VALUES (?, ?, ?, ?)',
      )
      .run(identity.issuer, identity.subject, account, now);
  }
  function seed(account: string, data: PersonalDataV1) {
    const key = personalRecordKey(data);
    sql
      .prepare(
        'INSERT INTO personal_records(account_id, kind, record_key, revision, payload_json, updated_at) VALUES (?, ?, ?, 1, ?, ?)',
      )
      .run(account, data.kind, key, JSON.stringify(data.payload), now);
    return key;
  }
  return {
    sql,
    database,
    repository: createD1PersonalRepository(database),
    seed,
  };
}
