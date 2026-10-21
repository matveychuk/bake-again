import type { MagnetId } from './magnets.ts';

export interface DeliveryStatement {
  bind(...values: (string | number | null)[]): DeliveryStatement;
  first<T>(): Promise<T | null>;
  run(): Promise<unknown>;
}
export interface DeliveryDatabase { prepare(sql: string): DeliveryStatement }
export type DeliveryRequest = {
  id: string; token_hash: string; dedupe_key: string; email: string; magnet: MagnetId;
  network_key: string; created_at: number; expires_at: number;
  status: 'pending' | 'awaiting_confirmation' | 'delivering' | 'sent' | 'failed';
};

export function deliveryStore(db: DeliveryDatabase) {
  return {
    async insert(row: DeliveryRequest): Promise<string | null> {
      // One atomic admission at D1, shared by all Workers. Duplicate clicks and
      // different addresses on the same network cannot race past these limits.
      const result = await db.prepare(`INSERT INTO lead_magnet_requests
        (id,token_hash,dedupe_key,email,magnet,network_key,created_at,expires_at,status)
        SELECT ?1,?2,?3,?4,?5,?6,?7,?8,'pending'
        WHERE (SELECT count(*) FROM lead_magnet_requests WHERE network_key=?6 AND created_at>?7-3600)<10
          AND (SELECT count(*) FROM lead_magnet_requests WHERE email=?4 AND created_at>?7-86400)<8
          AND (SELECT count(*) FROM lead_magnet_requests WHERE created_at>?7-86400)<200
        ON CONFLICT(dedupe_key) DO UPDATE SET token_hash=excluded.token_hash,
          status='pending', created_at=excluded.created_at, expires_at=excluded.expires_at
          WHERE lead_magnet_requests.status='failed'
        RETURNING id`).bind(row.id,row.token_hash,row.dedupe_key,row.email,row.magnet,row.network_key,row.created_at,row.expires_at).first<{id:string}>();
      return result?.id ?? null;
    },
    find(tokenHash: string) {
      return db.prepare('SELECT * FROM lead_magnet_requests WHERE token_hash=?1').bind(tokenHash).first<DeliveryRequest>();
    },
    async claim(id: string, now: number) {
      return !!(await db.prepare(`UPDATE lead_magnet_requests SET status='delivering', sending_at=COALESCE(sending_at,?2), attempted_at=?2
        WHERE id=?1 AND expires_at>?2 AND (sending_at IS NULL OR sending_at>?2-840)
          AND (status IN ('pending','awaiting_confirmation','failed')
          OR (status='delivering' AND attempted_at<?2-60)) RETURNING id`).bind(id,now).first());
    },
    async status(id: string, status: DeliveryRequest['status'], now: number) {
      await db.prepare(`UPDATE lead_magnet_requests SET status=?2, sent_at=CASE WHEN ?2='sent' THEN ?3 ELSE sent_at END WHERE id=?1 AND (?2!='awaiting_confirmation' OR status='pending')`)
        .bind(id,status,now).run();
    },
    async cleanup(now: number) {
      // Retain only seven days of operational records, no long-term audience copy.
      await db.prepare('DELETE FROM lead_magnet_requests WHERE created_at<?1-604800').bind(now).run();
    },
  };
}
