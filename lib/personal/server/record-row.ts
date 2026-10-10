import type { PersonalKind, PersonalRecordV1 } from '../contracts.ts';
import { parsePersonalData, personalRecordKey } from '../validation.ts';
import { PersonalError } from './errors.ts';

export interface PersonalRecordRow {
  schema_version: number;
  revision: number;
  payload_json: string | null;
  updated_at: number;
  deleted_at: number | null;
}

function timestamp(value: number): string {
  if (!Number.isSafeInteger(value) || value < 0 || value > 8640000000000000)
    throw new PersonalError('SERVICE_UNAVAILABLE', 503);
  return new Date(value).toISOString();
}

/** Revalidate persisted data at every storage boundary, regardless of SQL dialect. */
export function personalRecordFromRow(
  row: PersonalRecordRow,
  kind: PersonalKind,
  key: string,
): PersonalRecordV1 {
  if (
    row.schema_version !== 1 ||
    !Number.isSafeInteger(row.revision) ||
    row.revision < 1
  )
    throw new PersonalError('SERVICE_UNAVAILABLE', 503);
  const base = {
    schemaVersion: 1 as const,
    key,
    revision: row.revision,
    updatedAt: timestamp(row.updated_at),
  };
  if (row.deleted_at !== null) {
    if (row.payload_json !== null || row.deleted_at !== row.updated_at)
      throw new PersonalError('SERVICE_UNAVAILABLE', 503);
    return {
      ...base,
      kind,
      payload: null,
      deletedAt: timestamp(row.deleted_at),
    };
  }
  let payload: unknown;
  try {
    payload = row.payload_json === null ? null : JSON.parse(row.payload_json);
  } catch {
    throw new PersonalError('SERVICE_UNAVAILABLE', 503);
  }
  const data = parsePersonalData(kind, payload);
  if (!data || personalRecordKey(data) !== key)
    throw new PersonalError('SERVICE_UNAVAILABLE', 503);
  return { ...base, ...data, deletedAt: null } as PersonalRecordV1;
}
