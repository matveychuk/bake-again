import type { PersonalMutationV1, PersonalRecordV1 } from './contracts.ts';
export type SyncAction =
  | 'provision'
  | 'snapshot'
  | 'mutate'
  | 'import'
  | 'export'
  | 'erase';
export interface PersonalSnapshot {
  accountId: string;
  records: PersonalRecordV1[];
  imported: boolean;
}
export interface MutationAcknowledgement {
  operationId: string;
  kind: string;
  key: string;
  revision: number;
}
export type SyncInput =
  | { mutations: PersonalMutationV1[] }
  | { confirm: 'DELETE_PERSONAL_DATA' }
  | Record<string, never>;
export const PERSONAL_MAX_RECORDS = 1000;
export const PERSONAL_MAX_ACCOUNT_BYTES = 2097152;
