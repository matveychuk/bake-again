import {
  resolveActionReview,
  shoppingInputsFromReview,
  ActionValidationError,
} from './actions.ts';
import {
  isRecord,
  exactKeys,
  type ActionChoices,
  type ActionContext,
  type ActionProposal,
  type ActionReview,
} from './action-contract.ts';
import {
  addShoppingIngredients,
  readShopping,
} from '../persistence/shopping.ts';
import {
  readStorageValue,
  writeStorageValue,
  type StorageLike,
} from '../persistence/storage.ts';

const ledgerKey = 'bake-again:assistant-actions:v1';
const same = (left: unknown, right: unknown) =>
  JSON.stringify(left) === JSON.stringify(right);
type Phase =
  | 'proposed'
  | 'reviewing'
  | 'ready'
  | 'confirming'
  | 'done'
  | 'cancelled'
  | 'error';
export type ActionDependencies = {
  currentContext(): ActionContext;
  revalidate(
    proposal: ActionProposal,
    choices: ActionChoices,
    phase: 'review' | 'confirm',
    signal: AbortSignal,
  ): Promise<unknown>;
  storage: StorageLike | null;
  withLock<T>(work: () => Promise<T>): Promise<T>;
  openScaling(): void;
};

/** No effects on construction or on receiving a model answer. Only an explicit
 * review followed by confirm can reach the existing persistence API/callback.
 */
export function createActionController(
  value: ActionProposal,
  dependencies: ActionDependencies,
) {
  const proposal = structuredClone(value);
  let phase: Phase = 'proposed';
  let baseline: ActionReview | null = null;
  let pending = new AbortController();
  function markError() {
    if (phase !== 'cancelled' && phase !== 'done') phase = 'error';
  }
  function assertCurrent() {
    if (!same(proposal.context, dependencies.currentContext()))
      throw new ActionValidationError('STALE_REVIEW');
  }
  function assertActive(expected: Phase) {
    if (pending.signal.aborted || phase !== expected)
      throw new Error('ACTION_CANCELLED');
  }
  async function checkedReview(
    choices: ActionChoices,
    operation: 'review' | 'confirm',
  ) {
    assertCurrent();
    const local = resolveActionReview(
      proposal,
      choices,
      operation === 'confirm',
    );
    const response = await dependencies.revalidate(
      proposal,
      choices,
      operation,
      pending.signal,
    );
    if (
      !isRecord(response) ||
      !exactKeys(response, ['ok', 'review']) ||
      response.ok !== true ||
      !same(response.review, local)
    )
      throw new ActionValidationError('STALE_REVIEW');
    assertCurrent();
    // A deployment/content change during the request also invalidates the result.
    if (
      !same(
        resolveActionReview(proposal, choices, operation === 'confirm'),
        local,
      )
    )
      throw new ActionValidationError('STALE_REVIEW');
    return local;
  }
  return {
    get phase() {
      return phase;
    },
    cancel() {
      pending.abort();
      if (phase !== 'done') phase = 'cancelled';
    },
    async review() {
      if (phase !== 'proposed') throw new Error('ACTION_NOT_PROPOSED');
      pending = new AbortController();
      phase = 'reviewing';
      try {
        const review = await checkedReview({}, 'review');
        assertActive('reviewing');
        baseline = review;
        phase = 'ready';
        return review;
      } catch (error) {
        markError();
        throw error;
      }
    },
    async confirm(rawChoices: ActionChoices) {
      if (phase !== 'ready' || !baseline)
        throw new Error('ACTION_NOT_REVIEWED');
      const choices = structuredClone(rawChoices);
      phase = 'confirming';
      try {
        return await dependencies.withLock(async () => {
          assertActive('confirming');
          if (!same(resolveActionReview(proposal), baseline))
            throw new ActionValidationError('STALE_REVIEW');
          const review = await checkedReview(choices, 'confirm');
          assertActive('confirming');
          const storage = dependencies.storage;
          if (!storage) throw new Error('STORAGE_UNAVAILABLE');
          const raw = readStorageValue(ledgerKey, storage);
          const ledger: unknown = raw === null ? [] : JSON.parse(raw);
          if (
            !Array.isArray(ledger) ||
            !ledger.every((id) => typeof id === 'string')
          )
            throw new Error('STORAGE_UNAVAILABLE');
          if (ledger.includes(proposal.id)) {
            phase = 'done';
            return 'duplicate' as const;
          }
          if (ledger.length >= 1000) throw new Error('ACTION_LIMIT_REACHED');
          if (proposal.kind === 'add-shopping-items') {
            const inputs = shoppingInputsFromReview(review, choices);
            const current = readShopping(storage);
            // Preserve an already-added source, even if an alternative ingredient
            // was selected later. Never silently replace or rescale existing items.
            const remaining = inputs.filter(
              (input) =>
                !current.items.some((item) =>
                  item.sources.some(
                    (source) =>
                      source.recipeId === input.source.recipeId &&
                      source.recipeVersionId === input.source.recipeVersionId &&
                      source.ingredientLineId === input.source.ingredientLineId,
                  ),
                ),
            );
            if (remaining.length) {
              const written = addShoppingIngredients(
                remaining,
                new Date(),
                storage,
              );
              if (!same(readShopping(storage), written))
                throw new Error('STORAGE_UNAVAILABLE');
            }
          }
          if (
            !writeStorageValue(
              ledgerKey,
              JSON.stringify([...ledger, proposal.id]),
              storage,
            )
          )
            throw new Error('STORAGE_UNAVAILABLE');
          phase = 'done';
          if (proposal.kind === 'open-scaling') dependencies.openScaling();
          return 'done' as const;
        });
      } catch (error) {
        markError();
        throw error;
      }
    },
  };
}

export async function revalidateAction(
  proposal: ActionProposal,
  choices: ActionChoices,
  phase: 'review' | 'confirm',
  signal: AbortSignal,
): Promise<unknown> {
  const response = await fetch('/api/assistant/actions/review', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ proposal, choices, phase }),
    signal,
  });
  const body: unknown = await response.json();
  if (!response.ok)
    throw new ActionValidationError(
      isRecord(body) && body.code === 'STALE_RECIPE'
        ? 'STALE_RECIPE'
        : 'INVALID_ACTION',
    );
  return body;
}

/** A cross-tab lock prevents simultaneous assistant writes. Fail closed when the
 * browser cannot provide it instead of promising cross-tab exactly-once behavior.
 */
export async function withAssistantActionLock<T>(
  work: () => Promise<T>,
): Promise<T> {
  if (typeof navigator === 'undefined' || !navigator.locks)
    return Promise.reject(new Error('ACTION_LOCK_UNAVAILABLE'));
  return await navigator.locks.request('bake-again:assistant-shopping', work);
}
