import type { AssistantConfiguration } from '../assistant/contracts.ts';
import type { BakeRecordV1 } from '../persistence/bake-memory.ts';
import type { ShoppingItemV1 } from '../persistence/shopping.ts';

/** Transport contracts, independent of hosting, auth, SQL dialect and UI locale. */
export const personalKinds = [
  'saved-recipe',
  'shopping-item',
  'recipe-note',
  'bake-record',
  'collection',
] as const;
export type PersonalKind = (typeof personalKinds)[number];
export const PERSONAL_MAX_PAYLOAD_BYTES = 32768;
export const PERSONAL_MAX_KEY_LENGTH = 1024;

export interface RecipeReferenceV1 {
  recipeId: string;
  recipeVersionId: string;
  configuration: AssistantConfiguration;
}

export interface PersonalPayloadsV1 {
  'saved-recipe': { recipeId: string };
  'shopping-item': ShoppingItemV1;
  'recipe-note': RecipeReferenceV1 & { text: string };
  'bake-record': BakeRecordV1;
  collection: { id: string; name: string; recipeIds: string[] };
}

export type PersonalDataV1 = {
  [K in PersonalKind]: { kind: K; payload: PersonalPayloadsV1[K] };
}[PersonalKind];

export type PersonalRecordV1 = {
  schemaVersion: 1;
  key: string;
  /** Per-record server revision; never a client timestamp or an account-wide cursor. */
  revision: number;
  updatedAt: string;
} & (
  | (PersonalDataV1 & { deletedAt: null })
  | { kind: PersonalKind; payload: null; deletedAt: string }
);

/** Phase C write contract only: no mutation endpoint is enabled in phase A. */
export type PersonalMutationV1 = {
  schemaVersion: 1;
  operationId: string; // UUID, scoped to the authenticated account; persist across retries.
  expectedRevision: number; // 0 = create only; otherwise compare-and-swap, including tombstones.
} & (
  | (PersonalDataV1 & { action: 'put' })
  | { action: 'delete'; kind: PersonalKind; key: string }
);

export type PersonalErrorCode =
  | 'PERSONAL_FEATURES_DISABLED'
  | 'AUTH_REQUIRED'
  | 'ACCOUNT_UNAVAILABLE'
  | 'INVALID_REQUEST'
  | 'NOT_FOUND'
  | 'METHOD_NOT_ALLOWED'
  | 'SERVICE_UNAVAILABLE'
  // Reserved for C; writing remains unavailable until these guarantees are implemented.
  | 'REVISION_CONFLICT'
  | 'OPERATION_REUSED'
  | 'PAYLOAD_TOO_LARGE'
  | 'RATE_LIMITED';

export type PersonalResponseV1 = {
  schemaVersion: 1;
  requestId: string;
} & (
  | { ok: true; record: PersonalRecordV1 }
  | {
      ok: false;
      error: { code: PersonalErrorCode; retryable: boolean };
    }
);
