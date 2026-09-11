# ADR 0004: Controlled assistant action proposals

**Status:** Implemented behind existing assistant/publication gates; public rollout remains gated.
**Date:** 2026-09-10
**Extends:** [ADR 0003](0003-contextual-ai-assistant.md), specifically its read-only action restriction.

## Decision

The model remains unable to execute tools or writes. Its internal v3 Structured Output
adds only `actionId: null | "a1" | "a2"`. A request-local server catalog maps those IDs
to available actions. Missing/forged IDs and unavailable actions fail closed. No model
field can supply a recipe ID, ingredient choice, quantity, status, URL, source file or
persistence payload for an action. Non-answered outcomes cannot propose an action.

The public v1 envelope retains `proposedAction`, now either null or a typed
`ActionProposal`. The server supplies its ID, recipe/version, locale, surface, scope,
configuration, ingredient-line IDs, Suggested proposal status, configuration evidence
status and Cook Mode eligibility. The proposal carries no quantities or executable code.

| Action               | Review                                                                                               | After explicit confirmation                                                                                            |
| -------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `open-scaling`       | Explains that this only opens existing recipe controls                                               | Focuses the existing adjustment section, or navigates from Cook Mode to the canonical localized recipe URL and section |
| `add-shopping-items` | Shows current deterministic quantities, per-line evidence/gaps and explicit ingredient-choice radios | Calls the existing `addShoppingIngredients` persistence API with newly reconstructed inputs                            |

This is not an apply-scale action. The model cannot choose a new scale, swap a flour,
or apply an undocumented substitution. To request another quantity configuration, it
offers the existing scaling controls. Shopping uses the request's selected configuration
and scoped canonical ingredient lines. Existing shopping entries are not silently
replaced or rescaled.

## Two-sided validation and confirmation

`lib/assistant/actions.ts` is a pure shared policy, with canonical registry resolution
and the existing `calculateRecipeConfiguration`. It is independently invoked on the
server and in the browser. Both validate exact payload keys, Napoleon's detailed recipe
ID and current version, supported locale, canonical step/ingredient IDs and options,
configuration shape, finite amounts, allowed recipe-specific scale factors/anchors,
geometry availability, Cook Mode eligibility and provenance. No forgiving URL parser
is used to normalize a forged value. Even base quantities pass through the calculator.

`POST /api/assistant/actions/review` validates method/origin/content type, reads a bounded
16 KiB body, recomputes the review and applies the existing runtime flag and reviewed
recipe/UI-locale gates. The same endpoint is called again with `phase: "confirm"`,
requiring explicit choices for every ambiguous ingredient line. It has no OpenAI call,
shopping mutation or filesystem write. Repeated review calls are safe.

The client first resolves locally, requests server review, and requires exact agreement
with that local result. A modal shows the review. No persistence or navigation occurs
on receiving an AI answer, opening review, selecting a radio, or cancelling. Confirm
rechecks the current page context, canonical data and displayed snapshot, obtains a
fresh server review, verifies agreement again, and only then constructs persistence
inputs from canonical code. Stale versions or mismatched quantities/evidence are errors,
not silent refreshes of a review the user already approved.

Shopping actions reject configurations that are not Cook Mode eligible, including
unresolved fractional/manual quantities and unverified geometry timing. Opening scaling
controls can help resolve an ineligible configuration; it never enters Cook Mode or
applies a configuration and therefore does not bypass Cook Mode restrictions.

## Provenance

The proposal itself is always Suggested. Deterministic adjusted quantities retain
Calculated even at 1×. Base facts may retain Tested only when canonical provenance
explicitly supports them; narrower line/section provenance and gaps remain visible.
An ambiguous ingredient choice does not inherit Tested from the base. Unknown source
details remain unbadged; no fourth Unknown badge is introduced.

The pure provenance resolver is shared at `lib/assistant/provenance.ts`; the original
server path re-exports it for existing context code/tests. OpenAI, runtime secrets and
developer instructions remain server-only. No code in this slice writes canonical
recipe files or modifies provenance records.

## Cancellation and duplicate handling

The client controller requires `proposed → reviewing → ready → confirming → done`.
Cancel/unmount aborts outstanding validation and invalidates late successful responses.
A second Confirm cannot enter the persistence branch while the first is pending or
after completion. Queued operations check cancellation before continuing.

Browser Web Locks serialize assistant commits across tabs. If the lock or storage is
unavailable, execution fails closed. Completed IDs are stored through the existing
storage helper under `bake-again:assistant-actions:v1`, separate from shopping data,
with a 1000-ID bound that fails closed rather than evicting replay protection. Duplicate
IDs are no-ops, including after shopping entries have subsequently been removed.
The existing source-line identity is also checked across all shopping items, so a
different proposal ID cannot duplicate the source by choosing a different alternative.

This is device-local idempotency, not distributed exactly-once execution: the existing
anonymous persistence model remains unchanged. Clearing local storage clears receipts.
Shopping and receipt storage are not transactional; a receipt-write failure may follow
a successful shopping write. Source-line idempotency prevents retry duplication while
those entries remain present. No server confirmation token is treated as authorization
to mutate local state: the endpoint only validates, and execution still requires UI
confirmation. A future account-backed persistence design needs server-side atomic
idempotency keys and authorization, not reuse of this local receipt as a credential.

## UI, verification and rollout

Reuse the installed Dialog and EvidenceBadge, semantic Bake Again tokens, localized
copy, labelled radio controls and visible keyboard focus. The shared review body is
demonstrated in `/design-system#assistant-actions`; that example explicitly performs
no API call, publication override or persistence write.

Unit tests cover forged payloads/IDs/statuses/quantities, invalid scales, unavailable
Cook Mode configurations, mandatory choices, stale versions/reviews, cancellation
during network work, duplicate clicks/replays, lock serialization and storage failure.
Existing read-only golden cases continue with `actionId: null`.

Design Lab was checked at 390 px (uk), 900 px (es), and 1440 px (en): no horizontal
dialog overflow; confirmation disabled until a choice; choice/confirm/cancel/Escape
and visible keyboard focus verified. These are UI-fixture checks, not live OpenAI evals.

No feature flag, recipe publication state, secret, hosting binding or deployment is
changed. Napoleon remains the only rollout candidate. ADR 0003's shared rate/budget,
privacy and live-evaluation gates still apply before public activation.
