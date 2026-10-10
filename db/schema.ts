import { sql } from 'drizzle-orm';
import { check, index, integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Operational quota data only. Never store prompts, answers or raw IP addresses.
export const assistantQuotaReservations = sqliteTable('assistant_quota_reservations', {
  id: text('id').primaryKey(),
  sessionKey: text('session_key'),
  networkKey: text('network_key'),
  createdAt: integer('created_at').notNull(),
  leaseUntil: integer('lease_until').notNull(),
  reservedMicrousd: integer('reserved_microusd').notNull(),
}, table => [
  check('assistant_reserved_nonnegative', sql`${table.reservedMicrousd} >= 0`),
  index('assistant_quota_created').on(table.createdAt),
  index('assistant_quota_session').on(table.sessionKey, table.createdAt),
  index('assistant_quota_network').on(table.networkKey, table.createdAt),
]);

export const assistantVerificationAttempts = sqliteTable('assistant_verification_attempts', {
  id: text('id').primaryKey(),
  networkKey: text('network_key').notNull(),
  createdAt: integer('created_at').notNull(),
}, table => [
  index('assistant_verification_network').on(table.networkKey, table.createdAt),
  index('assistant_verification_created').on(table.createdAt),
]);

// Personal data is a separate domain. Never use an AI session, email address or
// a provider's subject as the primary key of a Bake Again account.
export const personalAccounts = sqliteTable('personal_accounts', {
  id: text('id').primaryKey(),
  createdAt: integer('created_at').notNull(), // UTC Unix milliseconds; AI tables remain seconds.
  disabledAt: integer('disabled_at'),
}, table => [
  check('personal_account_id_length', sql`length(${table.id}) = 36`),
  check('personal_account_time', sql`${table.createdAt} >= 0 AND (${table.disabledAt} IS NULL OR ${table.disabledAt} >= 0)`),
]);

// issuer includes the provider tenant/project/Site namespace. Account linking
// requires proof of both identities; matching email is never sufficient.
export const personalIdentities = sqliteTable('personal_identities', {
  issuer: text('issuer').notNull(),
  subject: text('subject').notNull(),
  accountId: text('account_id').notNull().references(() => personalAccounts.id, { onDelete: 'cascade' }),
  createdAt: integer('created_at').notNull(),
  revokedAt: integer('revoked_at'),
}, table => [
  primaryKey({ columns: [table.issuer, table.subject] }),
  index('personal_identity_account').on(table.accountId),
  check('personal_identity_bounds', sql`length(${table.issuer}) BETWEEN 1 AND 256 AND length(${table.subject}) BETWEEN 1 AND 1024`),
  check('personal_identity_time', sql`${table.createdAt} >= 0 AND (${table.revokedAt} IS NULL OR ${table.revokedAt} >= 0)`),
]);

// Schema-versioned, bounded payloads are validated by lib/personal/validation.ts.
// Phase A exposes reads only. Phase C must add atomic CAS + replay receipts
// before enabling writes; retain tombstones until its device/retention policy exists.
export const personalRecords = sqliteTable('personal_records', {
  accountId: text('account_id').notNull().references(() => personalAccounts.id, { onDelete: 'cascade' }),
  kind: text('kind', { enum: ['saved-recipe', 'shopping-item', 'recipe-note', 'bake-record', 'collection'] }).notNull(),
  recordKey: text('record_key').notNull(),
  schemaVersion: integer('schema_version').notNull().default(1),
  revision: integer('revision').notNull(),
  payloadJson: text('payload_json'),
  updatedAt: integer('updated_at').notNull(),
  deletedAt: integer('deleted_at'),
}, table => [
  primaryKey({ columns: [table.accountId, table.kind, table.recordKey] }),
  check('personal_record_kind', sql`${table.kind} IN ('saved-recipe','shopping-item','recipe-note','bake-record','collection')`),
  check('personal_record_key_bounds', sql`length(${table.recordKey}) BETWEEN 1 AND 1024`),
  check('personal_record_version', sql`${table.schemaVersion} = 1 AND ${table.revision} BETWEEN 1 AND 9007199254740991`),
  check('personal_record_time', sql`${table.updatedAt} >= 0 AND (${table.deletedAt} IS NULL OR ${table.deletedAt} = ${table.updatedAt})`),
  check('personal_record_payload', sql`(${table.deletedAt} IS NOT NULL AND ${table.payloadJson} IS NULL) OR (${table.deletedAt} IS NULL AND ${table.payloadJson} IS NOT NULL AND json_valid(${table.payloadJson}) AND length(CAST(${table.payloadJson} AS BLOB)) <= 32768)`),
]);
