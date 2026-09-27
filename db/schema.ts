import { sql } from 'drizzle-orm';
import { check, index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

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
