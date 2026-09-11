import assert from 'node:assert/strict';
import test from 'node:test';
import { glutenFreeNapoleonRecipe as recipe } from '../../content/recipes/gluten-free-napoleon.recipe.ts';
import type { AssistantRequestV1 } from './contracts.ts';
import {
  createActionController,
  type ActionDependencies,
} from './action-controller.ts';
import { createActionProposal, resolveActionReview } from './actions.ts';
import {
  readShopping,
  removeShoppingItem,
  shoppingStorageKey,
} from '../persistence/shopping.ts';

const request: AssistantRequestV1 = {
  schemaVersion: 1,
  recipeId: recipe.id,
  recipeVersionId: recipe.versionId,
  locale: 'en',
  surface: 'recipe-detail',
  scope: { kind: 'flour' },
  configuration: { kind: 'base' },
  question: 'Add',
  history: [],
};
function setup(
  kind: 'open-scaling' | 'add-shopping-items' = 'add-shopping-items',
  overrides: Partial<ActionDependencies> = {},
) {
  const proposal = createActionProposal(request, kind, 'action-one');
  const data = new Map<string, string>();
  const storage = {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
  };
  let opens = 0;
  let checks = 0;
  const dependencies: ActionDependencies = {
    storage,
    currentContext: () => proposal.context,
    revalidate: async (value, choices, phase) => {
      checks++;
      return {
        ok: true,
        review: resolveActionReview(value, choices, phase === 'confirm'),
      };
    },
    withLock: async (work) => work(),
    openScaling: () => {
      opens++;
    },
    ...overrides,
  };
  return {
    proposal,
    dependencies,
    controller: createActionController(proposal, dependencies),
    data,
    storage,
    opens: () => opens,
    checks: () => checks,
  };
}

void test('construction and review are read-only; confirm is mandatory and uses current persistence', async () => {
  const run = setup();
  assert.equal(run.data.size, 0);
  await assert.rejects(run.controller.confirm({}), /ACTION_NOT_REVIEWED/);
  await run.controller.review();
  assert.equal(run.data.size, 0);
  assert.equal(run.checks(), 1);
  assert.equal(await run.controller.confirm({}), 'done');
  assert.equal(run.checks(), 2);
  assert.ok(readShopping(run.storage).items.length > 0);
  assert.equal(run.opens(), 0);
});

void test('open-scaling runs the host callback only after review and confirmation', async () => {
  const run = setup('open-scaling');
  await run.controller.review();
  assert.equal(run.opens(), 0);
  await run.controller.confirm({});
  assert.equal(run.opens(), 1);
  assert.equal(run.data.has(shoppingStorageKey), false);
  await assert.rejects(run.controller.confirm({}));
  assert.equal(run.opens(), 1);
});

void test('cancel after review performs no write or navigation', async () => {
  for (const kind of ['open-scaling', 'add-shopping-items'] as const) {
    const run = setup(kind);
    await run.controller.review();
    run.controller.cancel();
    await assert.rejects(run.controller.confirm({}));
    assert.equal(run.data.size, 0);
    assert.equal(run.opens(), 0);
  }
});

void test('cancel while review or confirmation is in flight ignores a late successful server response', async () => {
  for (const operation of ['review', 'confirm'] as const) {
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    const run = setup('add-shopping-items', {
      revalidate: async (proposal, choices, phase) => {
        if (phase === operation) await gate;
        return {
          ok: true,
          review: resolveActionReview(proposal, choices, phase === 'confirm'),
        };
      },
    });
    if (operation === 'confirm') await run.controller.review();
    const pending =
      operation === 'review'
        ? run.controller.review()
        : run.controller.confirm({});
    run.controller.cancel();
    release();
    await assert.rejects(pending);
    assert.equal(run.controller.phase, 'cancelled');
    assert.equal(run.data.size, 0);
  }
});

void test('double click and persistent replay cannot execute an action twice, even after removing its items', async () => {
  const run = setup();
  await run.controller.review();
  const first = run.controller.confirm({});
  await assert.rejects(run.controller.confirm({}));
  await first;
  for (const item of readShopping(run.storage).items)
    removeShoppingItem(item.id, new Date(), run.storage);
  const replay = createActionController(run.proposal, run.dependencies);
  await replay.review();
  assert.equal(await replay.confirm({}), 'duplicate');
  assert.equal(readShopping(run.storage).items.length, 0);
});

void test('different proposal IDs keep source lines idempotent without silently rescaling them', async () => {
  const run = setup();
  await run.controller.review();
  await run.controller.confirm({});
  const before = JSON.stringify(readShopping(run.storage).items);
  const another = createActionController(
    { ...run.proposal, id: 'another-id' },
    run.dependencies,
  );
  await another.review();
  await another.confirm({});
  assert.equal(JSON.stringify(readShopping(run.storage).items), before);
});

void test('stale page context or server version change blocks confirmation', async () => {
  const run = setup();
  await run.controller.review();
  run.proposal.context.recipeVersionId = 'stale-version';
  await assert.rejects(run.controller.confirm({}), { code: 'STALE_REVIEW' });
  assert.equal(run.data.size, 0);
  const remote = setup('add-shopping-items', {
    revalidate: async (proposal, choices, phase) => {
      if (phase === 'confirm') return { ok: false, code: 'STALE_RECIPE' };
      return { ok: true, review: resolveActionReview(proposal, choices) };
    },
  });
  await remote.controller.review();
  await assert.rejects(remote.controller.confirm({}));
  assert.equal(remote.data.size, 0);
});

void test('forged server review quantities or statuses never reach persistence', async () => {
  for (const mutation of ['quantity', 'status']) {
    const run = setup('add-shopping-items', {
      revalidate: async (proposal, choices) => {
        const review = resolveActionReview(proposal, choices);
        if (mutation === 'quantity')
          review.lines[0].quantity = { kind: 'exact', value: 999, unit: 'g' };
        else review.proposal.status = 'Tested' as never;
        return { ok: true, review };
      },
    });
    await assert.rejects(run.controller.review());
    assert.equal(run.data.size, 0);
  }
});

void test('a denied cross-tab lock or failed storage write fails closed', async () => {
  const locked = setup('add-shopping-items', {
    withLock: async () => {
      throw new Error('LOCK_UNAVAILABLE');
    },
  });
  await locked.controller.review();
  await assert.rejects(locked.controller.confirm({}));
  assert.equal(locked.data.size, 0);
  const unavailable = setup('add-shopping-items', {
    storage: {
      getItem: () => null,
      setItem: () => {
        throw new Error('denied');
      },
    },
  });
  await unavailable.controller.review();
  await assert.rejects(
    unavailable.controller.confirm({}),
    /STORAGE_UNAVAILABLE/,
  );
});

void test('two controllers serialized by a cross-tab-style lock execute the same proposal once', async () => {
  let tail = Promise.resolve();
  const run = setup('open-scaling', {
    withLock: async (work) => {
      const previous = tail;
      let release!: () => void;
      tail = new Promise<void>((resolve) => {
        release = resolve;
      });
      await previous;
      try {
        return await work();
      } finally {
        release();
      }
    },
  });
  const second = createActionController(run.proposal, run.dependencies);
  await Promise.all([run.controller.review(), second.review()]);
  const results = await Promise.all([
    run.controller.confirm({}),
    second.confirm({}),
  ]);
  assert.deepEqual(results, ['done', 'duplicate']);
  assert.equal(run.opens(), 1);
});
