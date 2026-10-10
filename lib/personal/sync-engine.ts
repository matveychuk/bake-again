import type {
  PersonalDataV1,
  PersonalKind,
  PersonalMutationV1,
  PersonalRecordV1,
} from './contracts.ts';
import type { PersonalSnapshot, SyncAction } from './sync-contracts.ts';
import {
  parsePersonalData,
  personalRecordKey,
  isPersonalKey,
  isPersonalKind,
} from './validation.ts';
export type SyncTransport = (
  action: SyncAction,
  input: Record<string, unknown>,
) => Promise<unknown>;
type Pending = {
  mutation: PersonalMutationV1;
  desired: PersonalDataV1 | null;
  conflict: boolean;
};
const identity = (kind: string, key: string) => JSON.stringify([kind, key]);
function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object')
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, child]) => [key, canonical(child)]),
    );
  return value;
}
const same = (a: unknown, b: unknown) =>
  JSON.stringify(canonical(a)) === JSON.stringify(canonical(b));

export class SyncFailure extends Error {
  code: string;
  retryable: boolean;
  constructor(code: string, retryable = false) {
    super(code);
    this.code = code;
    this.retryable = retryable;
  }
}
/** One tab, one account. Mutation IDs are durable before sending; timestamps never resolve conflicts. */
export class PersonalSyncEngine {
  readonly accountId: string;
  private base = new Map<string, PersonalRecordV1>();
  private editRevisions = new Map<string, number>();
  pin(kind: PersonalKind, key: string) {
    const id = identity(kind, key);
    this.editRevisions.set(id, this.base.get(id)?.revision ?? 0);
  }
  private pending = new Map<string, Pending>();
  private running: Promise<void> | null = null;
  private stopped = false;
  error: string | null = null;
  imported = false;
  private transport: SyncTransport;
  private persist: (value: string) => void;
  private changed: () => void;
  constructor(
    snapshot: PersonalSnapshot,
    transport: SyncTransport,
    persist: (value: string) => void,
    changed: () => void = () => {},
  ) {
    this.transport = transport;
    this.persist = persist;
    this.changed = changed;
    this.accountId = snapshot.accountId;
    this.applySnapshot(snapshot);
  }
  get records(): PersonalDataV1[] {
    const values = new Map<string, PersonalDataV1>();
    for (const [id, r] of this.base)
      if (r.payload)
        values.set(id, { kind: r.kind, payload: r.payload } as PersonalDataV1);
    for (const [id, p] of this.pending) {
      if (p.desired) values.set(id, p.desired);
      else values.delete(id);
    }
    return [...values.values()];
  }
  get pendingCount() {
    return this.pending.size;
  }
  get conflicts() {
    return [...this.pending.entries()]
      .filter(([, p]) => p.conflict)
      .map(([id, p]) => ({
        id,
        local: p.desired,
        cloud: this.base.get(id) ?? null,
      }));
  }
  private save() {
    this.persist(
      JSON.stringify({
        schemaVersion: 1,
        accountId: this.accountId,
        pending: [...this.pending],
      }),
    );
  }
  restore(raw: string | null) {
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (
      saved.schemaVersion !== 1 ||
      saved.accountId !== this.accountId ||
      !Array.isArray(saved.pending) ||
      saved.pending.length > 200 ||
      raw.length > 1048576
    )
      throw new Error('INVALID_CACHE');
    const recovered = new Map<string, Pending>();
    for (const [id, p] of saved.pending) {
      const m = p?.mutation;
      if (
        !m ||
        m.schemaVersion !== 1 ||
        !isPersonalKind(m.kind) ||
        !Number.isSafeInteger(m.expectedRevision) ||
        m.expectedRevision < 0 ||
        typeof m.operationId !== 'string' ||
        !/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(m.operationId)
      )
        throw new Error('INVALID_CACHE');
      const data =
        m.action === 'put' ? parsePersonalData(m.kind, m.payload) : null;
      const key = data ? personalRecordKey(data) : m.key;
      if (
        (m.action !== 'delete' && !data) ||
        !isPersonalKey(key) ||
        id !== identity(m.kind, key)
      )
        throw new Error('INVALID_CACHE');
      const desired =
        p.desired === null
          ? null
          : parsePersonalData(p.desired?.kind, p.desired?.payload);
      if (
        p.desired !== null &&
        (!desired || identity(desired.kind, personalRecordKey(desired)) !== id)
      )
        throw new Error('INVALID_CACHE');
      recovered.set(id, {
        mutation: m,
        desired,
        conflict: p.conflict === true,
      });
    }
    this.pending = recovered;
    this.changed();
  }
  private mutation(
    kind: PersonalKind,
    key: string,
    data: PersonalDataV1 | null,
    revision: number,
  ): PersonalMutationV1 {
    const common = {
      schemaVersion: 1 as const,
      operationId: crypto.randomUUID(),
      expectedRevision: revision,
    };
    return data
      ? { ...common, action: 'put', ...data }
      : { ...common, action: 'delete', kind, key };
  }
  /** Replace only one legacy store's slice; absent records become tombstones. */
  replace(kinds: PersonalKind[], next: PersonalDataV1[]) {
    if (this.stopped) throw new Error('SIGNED_OUT');
    const before = new Map(
      this.records
        .filter((r) => kinds.includes(r.kind))
        .map((r) => [identity(r.kind, personalRecordKey(r)), r]),
    );
    const after = new Map<string, PersonalDataV1>();
    for (const candidate of next) {
      const r = parsePersonalData(candidate.kind, candidate.payload);
      if (!r || !kinds.includes(r.kind)) throw new Error('INVALID_REQUEST');
      after.set(identity(r.kind, personalRecordKey(r)), r);
    }
    const previous = new Map(
      [...this.pending].map(([id, p]) => [id, { ...p }]),
    );
    for (const id of new Set([...before.keys(), ...after.keys()])) {
      const data = after.get(id) ?? null;
      if (same(before.get(id) ?? null, data)) continue;
      const [kind, key] = JSON.parse(id) as [PersonalKind, string];
      const existing = this.pending.get(id);
      this.pending.set(
        id,
        existing
          ? { ...existing, desired: data }
          : {
              mutation: this.mutation(
                kind,
                key,
                data,
                this.editRevisions.get(id) ?? this.base.get(id)?.revision ?? 0,
              ),
              desired: data,
              conflict: false,
            },
      );
    }
    try {
      if (
        this.pending.size > 200 ||
        JSON.stringify([...this.pending]).length > 1048576 ||
        this.records.length > 1000
      )
        throw new Error('PAYLOAD_TOO_LARGE');
      this.save();
    } catch (error) {
      this.pending = previous;
      this.error = 'LOCAL_STORAGE_FAILED';
      this.changed();
      throw error;
    }
    this.changed();
  }
  private applySnapshot(snapshot: PersonalSnapshot) {
    if (snapshot.accountId !== this.accountId)
      throw new Error('ACCOUNT_MISMATCH');
    this.base = new Map(
      snapshot.records.map((r) => [identity(r.kind, r.key), r]),
    );
    this.imported = snapshot.imported;
  }
  async refresh() {
    const s = await this.transport('snapshot', {});
    if (!this.stopped) {
      this.applySnapshot(s as PersonalSnapshot);
      this.changed();
    }
  }
  async flush() {
    if (this.running) return this.running;
    this.running = this.send();
    try {
      await this.running;
    } finally {
      this.running = null;
    }
  }
  private async send() {
    this.error = null;
    for (const [id, p] of this.pending) {
      if (this.stopped) return;
      if (p.conflict) continue;
      const sent = p.mutation;
      try {
        const result = (await this.transport('mutate', {
          mutations: [sent],
        })) as {
          acknowledgements?: { operationId: string; revision: number }[];
        };
        if (this.stopped) return;
        const ack = result.acknowledgements?.[0];
        if (
          ack?.operationId !== sent.operationId ||
          ack.revision !== sent.expectedRevision + 1
        )
          throw new SyncFailure('SERVICE_UNAVAILABLE', true);
        if (this.editRevisions.get(id) === sent.expectedRevision)
          this.editRevisions.set(id, ack.revision);
        const current = this.pending.get(id)!;
        const data =
          sent.action === 'put'
            ? ({ kind: sent.kind, payload: sent.payload } as PersonalDataV1)
            : null;
        const [kind, key] = JSON.parse(id) as [PersonalKind, string];
        this.base.set(id, {
          schemaVersion: 1,
          kind,
          key,
          revision: ack.revision,
          updatedAt: new Date().toISOString(),
          deletedAt: data ? null : new Date().toISOString(),
          payload: data?.payload ?? null,
        } as PersonalRecordV1);
        if (same(current.desired, data)) this.pending.delete(id);
        else
          this.pending.set(id, {
            mutation: this.mutation(kind, key, current.desired, ack.revision),
            desired: current.desired,
            conflict: false,
          });
        this.save();
        this.changed();
      } catch (error) {
        if (this.stopped) return;
        const code =
          error instanceof SyncFailure ? error.code : 'SERVICE_UNAVAILABLE';
        if (code === 'REVISION_CONFLICT') {
          this.pending.set(id, { ...this.pending.get(id)!, conflict: true });
          this.save();
          await this.refresh();
          continue;
        }
        this.error = code;
        this.changed();
        throw error;
      }
    }
    if (!this.stopped) await this.refresh();
  }
  async resolve(id: string, choice: 'cloud' | 'local') {
    await this.refresh();
    const p = this.pending.get(id);
    if (!p) return;
    this.editRevisions.set(id, this.base.get(id)?.revision ?? 0);
    if (choice === 'cloud') this.pending.delete(id);
    else {
      const [kind, key] = JSON.parse(id) as [PersonalKind, string];
      this.pending.set(id, {
        ...p,
        conflict: false,
        mutation: this.mutation(
          kind,
          key,
          p.desired,
          this.base.get(id)?.revision ?? 0,
        ),
      });
    }
    this.save();
    this.changed();
  }
  stop() {
    this.stopped = true;
    this.base.clear();
    this.pending.clear();
    this.error = null;
    this.changed();
  }
}
