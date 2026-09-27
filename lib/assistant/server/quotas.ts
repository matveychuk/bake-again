import { AssistantServiceError } from './errors.ts';
import { assistantProviderJsonSchema, type AssistantProvider } from './openai.ts';
import { buildAssistantDeveloperInstructions, serializeAssistantInput } from './prompt.ts';

/** Shared database interface; no process-local production fallback. */
export interface QuotaStatement {
  bind(...values: (string | number | null)[]): QuotaStatement;
  first<T>(): Promise<T | null>;
  run(): Promise<unknown>;
}
export interface QuotaDatabase { prepare(sql: string): QuotaStatement }
export interface QuotaLimits { dailyMicrousd: number; monthlyMicrousd: number }
export interface QuotaActor { sessionKey: string; networkKey: string }
export interface AssistantQuotaStore {
  allowVerification(networkKey: string, requestId: string): Promise<void>;
  reserve(actor: QuotaActor, requestId: string, costMicrousd: number): Promise<{ release(): Promise<void> }>;
}

// 2026-09-27 standard gpt-5.4-mini pricing, no tools/automatic retries/cached discount.
// Reserve the full input/output ceilings; never refund an uncertain or timed-out call.
export function maximumRequestCostMicrousd(maxOutputTokens: number) {
  if (!Number.isInteger(maxOutputTokens) || maxOutputTokens < 256 || maxOutputTokens > 4000)
    throw new AssistantServiceError('ASSISTANT_DISABLED', 503);
  return Math.ceil(32000 * 0.75 + maxOutputTokens * 4.5);
}

// INSERT ... SELECT is ONE atomic statement at the D1 primary. There is no
// read-then-increment race, even across Workers, sessions and network addresses.
export const RESERVE_QUOTA_SQL = `
WITH clock AS (SELECT unixepoch('now') AS now),
counts AS (
 SELECT
  COUNT(*) FILTER (WHERE session_key = ?1 AND created_at > now - 7200) AS session_total,
  COUNT(*) FILTER (WHERE session_key = ?1 AND created_at > now - 86400) AS session_day,
  COUNT(*) FILTER (WHERE network_key = ?2 AND created_at > now - 60) AS network_minute,
  COUNT(*) FILTER (WHERE network_key = ?2 AND created_at > now - 86400) AS network_day,
  COUNT(*) FILTER (WHERE created_at > now - 86400) AS site_day,
  COUNT(*) FILTER (WHERE session_key = ?1 AND lease_until > now) AS session_active,
  COUNT(*) FILTER (WHERE lease_until > now) AS site_active,
  COALESCE(SUM(reserved_microusd) FILTER (WHERE created_at > now - 86400), 0) AS day_cost,
  COALESCE(SUM(reserved_microusd) FILTER (WHERE created_at >= unixepoch('now','start of month')), 0) AS month_cost
 FROM assistant_quota_reservations, clock
 WHERE created_at > now - 3024000
)
INSERT INTO assistant_quota_reservations
 (id, session_key, network_key, created_at, lease_until, reserved_microusd)
SELECT ?3, ?1, ?2, now, now + 60, ?4 FROM counts, clock
WHERE session_total < 5 AND session_day < 10 AND network_minute < 20
 AND network_day < 40 AND site_day < 100 AND session_active = 0 AND site_active < 3
 AND day_cost + ?4 <= ?5 AND month_cost + ?4 <= ?6
ON CONFLICT(id) DO NOTHING
RETURNING id`;

export function createD1AssistantQuotaStore(db: QuotaDatabase, limits: QuotaLimits): AssistantQuotaStore {
  if (![limits.dailyMicrousd, limits.monthlyMicrousd].every(n => Number.isSafeInteger(n) && n >= 0))
    throw new AssistantServiceError('ASSISTANT_DISABLED', 503);
  return {
    async allowVerification(networkKey, requestId) {
      try {
        await db.prepare(`DELETE FROM assistant_verification_attempts WHERE created_at <= unixepoch('now') - 60`).run();
        const admitted = await db.prepare(`
          INSERT INTO assistant_verification_attempts (id, network_key, created_at)
          SELECT ?1, ?2, unixepoch('now')
          WHERE (SELECT COUNT(*) FROM assistant_verification_attempts WHERE network_key = ?2 AND created_at > unixepoch('now') - 60) < 20
          AND (SELECT COUNT(*) FROM assistant_verification_attempts WHERE created_at > unixepoch('now') - 60) < 300
          ON CONFLICT(id) DO NOTHING RETURNING id`).bind(requestId, networkKey).first<{ id: string }>();
        if (!admitted) throw new AssistantServiceError('RATE_LIMITED', 429, true, 60);
      } catch (error) {
        if (error instanceof AssistantServiceError) throw error;
        throw new AssistantServiceError('SERVICE_UNAVAILABLE', 503);
      }
    },
    async reserve(actor, requestId, costMicrousd) {
      if (!actor.sessionKey || !actor.networkKey || !Number.isSafeInteger(costMicrousd) || costMicrousd <= 0)
        throw new AssistantServiceError('SERVICE_UNAVAILABLE', 503);
      try {
        // Bounded retention. Old pseudonymous identities are removed independently of spend.
        await db.prepare(`DELETE FROM assistant_quota_reservations WHERE created_at <= unixepoch('now') - 3024000`).run();
        await db.prepare(`UPDATE assistant_quota_reservations SET session_key = NULL, network_key = NULL WHERE created_at <= unixepoch('now') - 172800 AND session_key IS NOT NULL`).run();
        const row = await db.prepare(RESERVE_QUOTA_SQL).bind(actor.sessionKey, actor.networkKey,
          requestId, costMicrousd, limits.dailyMicrousd, limits.monthlyMicrousd).first<{ id: string }>();
        if (!row) {
          // Read only to explain rejection; this read never authorizes a provider call.
          const totals = await db.prepare(`SELECT
            COALESCE(SUM(reserved_microusd) FILTER (WHERE created_at > unixepoch('now') - 86400),0) AS day,
            COALESCE(SUM(reserved_microusd) FILTER (WHERE created_at >= unixepoch('now','start of month')),0) AS month
            FROM assistant_quota_reservations`).first<{ day: number; month: number }>();
          if (!totals) throw new AssistantServiceError('SERVICE_UNAVAILABLE', 503);
          if (totals.day + costMicrousd > limits.dailyMicrousd || totals.month + costMicrousd > limits.monthlyMicrousd)
            throw new AssistantServiceError('BUDGET_EXHAUSTED', 503);
          throw new AssistantServiceError('RATE_LIMITED', 429, true, 60);
        }
        return { async release() {
          // Clear concurrency only. The charged reservation and request counts remain.
          try { await db.prepare('UPDATE assistant_quota_reservations SET lease_until = 0 WHERE id = ?1').bind(requestId).run(); }
          catch { /* Failure retains the lease until expiry and all reserved cost. */ }
        } };
      } catch (error) {
        if (error instanceof AssistantServiceError) throw error;
        throw new AssistantServiceError('SERVICE_UNAVAILABLE', 503);
      }
    },
  };
}

export function protectAssistantProvider(provider: AssistantProvider, store: AssistantQuotaStore,
  actor: QuotaActor, maxOutputTokens: number): AssistantProvider {
  return { async answer(request, projection, context) {
    if (context.signal.aborted) throw new AssistantServiceError('UPSTREAM_TIMEOUT', 504);
    // Byte ceiling is conservative even for adversarial Unicode; the existing
    // bytes/2 projection estimate is not a hard token cap. Include schema and
    // instructions, with 4,000 additional tokens reserved for protocol overhead.
    const inputBytes = new TextEncoder().encode(buildAssistantDeveloperInstructions(request.locale)
      + serializeAssistantInput(request, projection) + JSON.stringify(assistantProviderJsonSchema)).length;
    if (inputBytes > 28000) throw new AssistantServiceError('PAYLOAD_TOO_LARGE', 413);
    const reservation = await store.reserve(actor, context.requestId, maximumRequestCostMicrousd(maxOutputTokens));
    try {
      if (context.signal.aborted) throw new AssistantServiceError('UPSTREAM_TIMEOUT', 504);
      return await provider.answer(request, projection, context);
    } finally { await reservation.release(); }
  } };
}
