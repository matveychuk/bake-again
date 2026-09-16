import {
  readStorageValue,
  writeStorageValue,
  type StorageLike,
} from './storage.ts';

export type CookTimerState = {
  stepId: string;
  durationSeconds: number;
  remainingSeconds: number;
  endAt: string | null;
};

export type CookModeSessionV1 = {
  schemaVersion: 1;
  recipeId: string;
  recipeVersionId: string;
  updatedAt: string;
  currentStepId: string;
  completedStepIds: string[];
  timer: CookTimerState | null;
  completedAt: string | null;
  note: string;
};

export function cookModeStorageKey(recipeId: string, recipeVersionId: string) {
  return `bake-again:cook-mode:v1:${recipeId}:${recipeVersionId}`;
}

function isIsoDate(value: unknown): value is string {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
}

function parseTimer(value: unknown): CookTimerState | null {
  if (value === null) return null;
  if (!value || typeof value !== 'object') return null;
  const timer = value as Record<string, unknown>;
  if (
    typeof timer.stepId !== 'string' ||
    typeof timer.durationSeconds !== 'number' ||
    typeof timer.remainingSeconds !== 'number' ||
    timer.durationSeconds <= 0 ||
    timer.remainingSeconds < 0 ||
    (timer.endAt !== null && !isIsoDate(timer.endAt))
  ) {
    return null;
  }
  return {
    stepId: timer.stepId,
    durationSeconds: timer.durationSeconds,
    remainingSeconds: timer.remainingSeconds,
    endAt: timer.endAt as string | null,
  };
}

export function parseCookModeSession(rawValue: string | null) {
  if (!rawValue) return null;
  try {
    const value: unknown = JSON.parse(rawValue);
    if (!value || typeof value !== 'object') return null;
    const session = value as Record<string, unknown>;
    if (
      session.schemaVersion !== 1 ||
      typeof session.recipeId !== 'string' ||
      typeof session.recipeVersionId !== 'string' ||
      !isIsoDate(session.updatedAt) ||
      typeof session.currentStepId !== 'string' ||
      !Array.isArray(session.completedStepIds) ||
      !session.completedStepIds.every((id) => typeof id === 'string') ||
      (session.completedAt !== null && !isIsoDate(session.completedAt)) ||
      typeof session.note !== 'string'
    ) {
      return null;
    }
    return {
      schemaVersion: 1,
      recipeId: session.recipeId,
      recipeVersionId: session.recipeVersionId,
      updatedAt: session.updatedAt,
      currentStepId: session.currentStepId,
      completedStepIds: [...new Set(session.completedStepIds)].slice(0, 100),
      timer: parseTimer(session.timer),
      completedAt: session.completedAt as string | null,
      note: session.note.slice(0, 2000),
    } satisfies CookModeSessionV1;
  } catch {
    return null;
  }
}

export function readCookModeSession(
  recipeId: string,
  recipeVersionId: string,
  storage?: StorageLike | null,
) {
  const session = parseCookModeSession(
    readStorageValue(cookModeStorageKey(recipeId, recipeVersionId), storage),
  );
  return session?.recipeId === recipeId &&
    session.recipeVersionId === recipeVersionId
    ? session
    : null;
}

export function persistCookModeSession(
  session: CookModeSessionV1,
  storage?: StorageLike | null,
) {
  writeStorageValue(
    cookModeStorageKey(session.recipeId, session.recipeVersionId),
    JSON.stringify(session),
    storage,
  );
}
