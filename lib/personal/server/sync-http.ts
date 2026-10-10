import { createSupabasePersonalBackend } from './supabase.ts';
import { supabasePersonalConfig } from './supabase-config.ts';
import { PersonalError } from './errors.ts';
import {
  isPersonalKey,
  isPersonalKind,
  parsePersonalData,
  personalRecordKey,
} from '../validation.ts';
import type { SyncAction } from '../sync-contracts.ts';
import { personalRecordFromRow, type PersonalRecordRow } from './record-row.ts';
const uuid = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
const actions = new Set([
  'provision',
  'snapshot',
  'mutate',
  'import',
  'export',
  'erase',
]);
const object = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);

export function parseMutation(value: unknown) {
  if (
    !object(value) ||
    value.schemaVersion !== 1 ||
    typeof value.operationId !== 'string' ||
    !uuid.test(value.operationId) ||
    !Number.isSafeInteger(value.expectedRevision) ||
    Number(value.expectedRevision) < 0 ||
    Number(value.expectedRevision) >= Number.MAX_SAFE_INTEGER
  )
    return null;
  const base = {
    schemaVersion: 1,
    operationId: value.operationId,
    expectedRevision: value.expectedRevision,
  };
  if (value.action === 'put') {
    if (
      Object.keys(value).some(
        (k) =>
          ![
            'schemaVersion',
            'operationId',
            'expectedRevision',
            'action',
            'kind',
            'payload',
          ].includes(k),
      )
    )
      return null;
    const data = parsePersonalData(value.kind, value.payload);
    return data
      ? { ...base, action: 'put', ...data, key: personalRecordKey(data) }
      : null;
  }
  if (
    value.action === 'delete' &&
    isPersonalKind(value.kind) &&
    isPersonalKey(value.key) &&
    Object.keys(value).every((k) =>
      [
        'schemaVersion',
        'operationId',
        'expectedRevision',
        'action',
        'kind',
        'key',
      ].includes(k),
    )
  )
    return { ...base, action: 'delete', kind: value.kind, key: value.key };
  return null;
}
export function createPersonalSyncHandler(
  bindings: () => Promise<Record<string, unknown>>,
  fetcher?: typeof fetch,
) {
  return async (request: Request) => {
    const headers = {
      'cache-control': 'private, no-store',
      vary: 'Authorization, Origin',
      'content-type': 'application/json',
      'x-content-type-options': 'nosniff',
    };
    const requestId = crypto.randomUUID();
    const respond = (body: unknown, status = 200) =>
      Response.json(
        { schemaVersion: 1, requestId, ...(body as object) },
        { status, headers },
      );
    try {
      if (request.method !== 'POST')
        return new Response(null, {
          status: 405,
          headers: { ...headers, allow: 'POST' },
        });
      if (
        request.headers.get('origin') !== new URL(request.url).origin ||
        request.headers.get('sec-fetch-site') === 'cross-site'
      )
        throw new PersonalError('INVALID_REQUEST', 403);
      const configBindings = await bindings();
      if (configBindings.PERSONAL_SYNC_ENABLED !== 'true')
        throw new PersonalError('PERSONAL_FEATURES_DISABLED', 503);
      const config = supabasePersonalConfig(configBindings);
      if (!config) throw new PersonalError('PERSONAL_FEATURES_DISABLED', 503);
      if (
        !request.headers
          .get('content-type')
          ?.toLowerCase()
          .startsWith('application/json')
      )
        throw new PersonalError('INVALID_REQUEST', 400);
      const backend = createSupabasePersonalBackend(config, fetcher);
      if (!(await backend.auth.authenticate(request)))
        throw new PersonalError('AUTH_REQUIRED', 401);
      // Read a bounded stream; Content-Length can be missing or dishonest.
      const reader = request.body?.getReader();
      if (!reader) throw new PersonalError('INVALID_REQUEST', 400);
      const chunks: Uint8Array[] = [];
      let size = 0;
      for (;;) {
        const part = await reader.read();
        if (part.done) break;
        size += part.value.byteLength;
        if (size > 1048576) {
          await reader.cancel();
          throw new PersonalError('PAYLOAD_TOO_LARGE', 413);
        }
        chunks.push(part.value);
      }
      const buffer = new Uint8Array(size);
      let offset = 0;
      for (const chunk of chunks) {
        buffer.set(chunk, offset);
        offset += chunk.length;
      }
      let body: unknown;
      try {
        body = JSON.parse(new TextDecoder().decode(buffer));
      } catch {
        throw new PersonalError('INVALID_REQUEST', 400);
      }
      if (
        !object(body) ||
        typeof body.action !== 'string' ||
        !actions.has(body.action) ||
        Object.keys(body).some((k) => !['action', 'input'].includes(k)) ||
        !object(body.input)
      )
        throw new PersonalError('INVALID_REQUEST', 400);
      const action = body.action as SyncAction;
      let input: Record<string, unknown> = body.input;
      if (action === 'mutate' || action === 'import') {
        if (
          Object.keys(input).some((k) => k !== 'mutations') ||
          !Array.isArray(input.mutations) ||
          input.mutations.length < (action === 'import' ? 0 : 1) ||
          input.mutations.length > 200
        )
          throw new PersonalError('INVALID_REQUEST', 400);
        const mutations = input.mutations.map(parseMutation);
        if (mutations.some((m) => !m))
          throw new PersonalError('INVALID_REQUEST', 400);
        input = { mutations };
      } else if (action === 'erase') {
        if (
          Object.keys(input).length !== 1 ||
          input.confirm !== 'DELETE_PERSONAL_DATA'
        )
          throw new PersonalError('INVALID_REQUEST', 400);
      } else if (Object.keys(input).length)
        throw new PersonalError('INVALID_REQUEST', 400);
      const result = await backend.sync(action, input);
      if (['snapshot', 'provision', 'export'].includes(action)) {
        if (
          !object(result) ||
          typeof result.accountId !== 'string' ||
          !uuid.test(result.accountId) ||
          !Array.isArray(result.records) ||
          result.records.length > 1000 ||
          typeof result.imported !== 'boolean'
        )
          throw new PersonalError('SERVICE_UNAVAILABLE', 503);
        const records = result.records.map((row) => {
          if (
            !object(row) ||
            !isPersonalKind(row.kind) ||
            !isPersonalKey(row.record_key)
          )
            throw new PersonalError('SERVICE_UNAVAILABLE', 503);
          return personalRecordFromRow(
            row as unknown as PersonalRecordRow,
            row.kind,
            row.record_key,
          );
        });
        return respond({
          ok: true,
          data: {
            accountId: result.accountId,
            records,
            imported: result.imported,
          },
        });
      }
      return respond({ ok: true, data: result });
    } catch (error) {
      const known =
        error instanceof PersonalError
          ? error
          : new PersonalError('SERVICE_UNAVAILABLE', 503);
      return respond(
        {
          ok: false,
          error: {
            code: known.code,
            retryable: ['SERVICE_UNAVAILABLE', 'RATE_LIMITED'].includes(
              known.code,
            ),
          },
        },
        known.status,
      );
    }
  };
}
