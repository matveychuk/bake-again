import assert from 'node:assert/strict';
import test from 'node:test';
import type {
  EvidenceState,
  Provenance,
} from '../../../content/recipes/recipe.types.ts';
import { resolveContextEvidence, type ContextEvidence } from './provenance.ts';

const sourceIds = new Set(['author']);
const provenance = (state: EvidenceState): Provenance => ({
  state,
  sourceIds: ['author'],
});
const states: Record<EvidenceState, ContextEvidence['status']> = {
  repeatedlyVerified: 'Tested',
  tested: 'Tested',
  calculated: 'Calculated',
  suggested: 'Suggested',
  authorGuidance: null,
  missing: null,
  draft: null,
  needsRetest: null,
};

for (const [state, status] of Object.entries(states) as Array<
  [EvidenceState, ContextEvidence['status']]
>) {
  void test(`${state}: maps public status and overrides a Tested base`, () => {
    const result = resolveContextEvidence({
      provenance: provenance(state),
      fallback: provenance('repeatedlyVerified'),
      sourceIds,
    });
    assert.equal(result.state, state);
    assert.equal(result.sourceState, state);
    assert.equal(result.status, status);
  });
  void test(`${state}: deterministic calculation never inherits source Tested status`, () => {
    const result = resolveContextEvidence({
      provenance: provenance(state),
      calculated: true,
      sourceIds,
    });
    assert.equal(result.state, 'calculated');
    assert.equal(result.status, 'Calculated');
    assert.equal(result.sourceState, state);
    if (state !== 'tested' && state !== 'repeatedlyVerified')
      assert.ok(result.limitations.includes(state));
  });
  void test(`${state}: dependency restrictions survive a narrower Tested fact`, () => {
    const result = resolveContextEvidence({
      provenance: provenance('tested'),
      constraints: [provenance(state)],
      sourceIds,
    });
    assert.equal(
      result.status,
      state === 'tested' || state === 'repeatedlyVerified' ? 'Tested' : null,
    );
  });
}

void test('only explicit base fallback inherits Tested; unsupported substitutions do not', () => {
  assert.equal(
    resolveContextEvidence({ fallback: provenance('tested'), sourceIds })
      .status,
    'Tested',
  );
  const unknownSubstitution = resolveContextEvidence({ sourceIds });
  assert.equal(unknownSubstitution.state, 'missing');
  assert.equal(unknownSubstitution.status, null);
  assert.equal(
    resolveContextEvidence({ provenance: provenance('suggested'), sourceIds })
      .status,
    'Suggested',
  );
});

void test('missing or forged source references cannot certify a fact', () => {
  for (const refs of [[], ['unknown'], ['author', 'unknown']]) {
    const result = resolveContextEvidence({
      provenance: { state: 'tested', sourceIds: refs },
      sourceIds,
    });
    assert.equal(result.sourceState, 'missing');
    assert.equal(result.status, null);
  }
});

void test('gaps and unknown quantities remove Tested without erasing source history', () => {
  const gap = resolveContextEvidence({
    provenance: provenance('tested'),
    sourceIds,
    gapIds: ['milk', 'milk'],
  });
  assert.equal(gap.status, null);
  assert.equal(gap.sourceState, 'tested');
  assert.deepEqual(gap.gapIds, ['milk']);
  assert.deepEqual(gap.limitations, ['missing']);
  const unknown = resolveContextEvidence({
    provenance: provenance('tested'),
    sourceIds,
    missing: true,
    calculated: true,
  });
  assert.equal(unknown.state, 'missing');
  assert.equal(unknown.status, null);
});

void test('hidden or preview-only adaptations cannot inherit a Tested badge', () => {
  for (const availability of ['hiddenUntilConfirmed', 'previewOnly'] as const) {
    assert.equal(
      resolveContextEvidence({
        provenance: provenance('tested'),
        sourceIds,
        availability,
      }).status,
      null,
    );
  }
  assert.equal(
    resolveContextEvidence({
      provenance: provenance('calculated'),
      sourceIds,
      availability: 'previewOnly',
    }).status,
    'Calculated',
  );
});
