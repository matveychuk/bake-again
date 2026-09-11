import type {
  Availability,
  EvidenceState,
  Provenance,
} from '../../content/recipes/recipe.types.ts';

export type ContextEvidence = {
  state: EvidenceState;
  status: 'Tested' | 'Calculated' | 'Suggested' | null;
  sourceState: EvidenceState;
  limitations: EvidenceState[];
  gapIds: string[];
};

const statusByState: Record<EvidenceState, ContextEvidence['status']> = {
  repeatedlyVerified: 'Tested',
  tested: 'Tested',
  calculated: 'Calculated',
  suggested: 'Suggested',
  authorGuidance: null,
  missing: null,
  draft: null,
  needsRetest: null,
};

const isTested = (state: EvidenceState) =>
  state === 'tested' || state === 'repeatedlyVerified';

/** Pure server policy. Callers supply canonical provenance, never request-body evidence. */
export function resolveContextEvidence({
  provenance,
  fallback,
  constraints = [],
  sourceIds,
  gapIds = [],
  calculated = false,
  missing = false,
  availability,
}: {
  provenance?: Provenance;
  /** Only unchanged base facts may supply this. Adaptations must omit it. */
  fallback?: Provenance;
  constraints?: Provenance[];
  sourceIds: ReadonlySet<string>;
  gapIds?: string[];
  calculated?: boolean;
  missing?: boolean;
  availability?: Availability;
}): ContextEvidence {
  const selected = provenance ?? fallback;
  const validSources = (value: Provenance) =>
    value.sourceIds.length > 0 &&
    value.sourceIds.every((id) => sourceIds.has(id));
  const sourceState =
    selected && validSources(selected) ? selected.state : 'missing';
  const limitations = new Set<EvidenceState>();
  if (!isTested(sourceState)) limitations.add(sourceState);
  for (const constraint of constraints) {
    const state = validSources(constraint) ? constraint.state : 'missing';
    if (!isTested(state)) limitations.add(state);
  }
  if (missing || gapIds.length > 0) limitations.add('missing');
  const state = missing ? 'missing' : calculated ? 'calculated' : sourceState;
  let status = statusByState[state];
  // A calculation is still arithmetic when source inputs are provisional. Preserve
  // those limitations; never imply that the calculated version was bake-tested.
  if (
    status === 'Tested' &&
    (limitations.size > 0 || availability === 'previewOnly')
  )
    status = null;
  if (availability === 'hiddenUntilConfirmed') status = null;
  return {
    state,
    status,
    sourceState,
    limitations: [...limitations],
    gapIds: [...new Set(gapIds)],
  };
}
