# Trusted assistant context

## Product integration

Recipe Detail and Cook Mode render the same client component from
`components/assistant`. Both typed questions and suggested prompts post the validated
`AssistantRequestV1` payload to `/api/assistant`. The client sends the active locale,
canonical recipe/version IDs, the exact displayed base or adjusted configuration, and
canonical step IDs for step-scoped questions.

The drawer keeps at most four whitespace-normalized history messages, disables every
submit path while a request is active, and aborts that request when the drawer closes.
It handles idle, loading, structured success, defensive empty, retryable error and
feature-disabled states. Closing clears the session and returns focus to the trigger.

The context slice of [ADR 0003](architecture/0003-contextual-ai-assistant.md) is
implemented in `lib/assistant/server/context.ts`. It has no OpenAI dependency, network
calls, environment access, embeddings, persistence or UI. All recipe facts originate
from the canonical registry's `getRecipeDocument()` detailed record.

```ts
import { buildTrustedRecipeContext } from '@/lib/assistant/server/context';

const result = buildTrustedRecipeContext({
  recipeId: 'gluten-free-napoleon',
  locale: 'uk',
  scope: 'step',
  stepId: 'mix-wet-dough',
});

if (!result.available) {
  // Stable machine code and safe localized message; no partial context.
  console.info(result.code);
} else {
  // Use only from a server service after its access/publication checks.
  const context = result.context;
}
```

## Selection contract

`scope` is `recipe`, `flour` or `step`. Step scope requires a canonical `stepId`,
or `stepIds` with one or two unique IDs for grouped Cook Mode steps. They are mutually
exclusive. Other scopes reject step selectors. Slugs, translated titles and displayed
step numbers are not aliases for canonical IDs.

The `/api/assistant` HTTP adapter translates ADR scope objects into these selectors; it
does not forward a complete HTTP request body to this function. Unknown fields are rejected,
including caller-provided recipes, provenance, status and preview flags. The function
validates `unknown` at runtime as well as exporting typed input and result contracts.
Each call returns a fresh projection without mutable references into the registry.

Only detailed records are supported. Every `sourceDraft`, including a complete source
transcription, returns `SOURCE_DRAFT_UNAVAILABLE`. Invalid identifiers/locales/scopes,
missing steps, unsupported configurations and archived recipes return explicit
unavailable results. Invalid locales use English error text without accepting an
English recipe fallback.

This pure builder is **not** a publication or authorization boundary. It can project
both current detailed recipes for tests and editorial previews. Its `publication`
metadata explicitly reports draft/review state and the existing recipe/UI publication
helpers. The server service enforces the Napoleon-only rollout, feature flag and public
recipe/UI locale gates before this projection can reach OpenAI. A browser flag cannot
authorize preview access. Neither current detailed recipe becomes publicly available
through this implementation.

## Context by scope

| Scope | Projection |
| --- | --- |
| Recipe | All canonical ingredient lines, flour system, base timing phases, yield/geometry options, variation descriptions and their own provenance, before-start guidance, storage/make-ahead facts and relevant gaps. No copied full method. |
| Flour | Commercial mix, additional starch and xanthan lines, documented mix alternatives/unsupported mixes, base yield and geometry. No custard, method, storage or unrelated gaps. |
| Step | Requested canonical instruction(s), ingredients, equipment, duration, temperature and all checkpoint/practical-tip records. Related before-start items and dependency gaps survive. The flour system is included only when the step references one of its lines. |

Every projection contains stable recipe/version identity, localized title/summary and
an explicit configuration. Title/summary, flour evidence, timing and yield describe
the **canonical base**, not a promise about an adjusted version. Ingredient choices,
optional flags, ranges and explicit null values are preserved.

`ContextFact.field` is the evidence reference key within a recipe/version. The future
response service can index the projected facts by this field; it must use their
server-rendered values rather than badging a model paraphrase. No source file paths,
source IDs, archive locators, private editorial notes or raw gap questions are exposed.
Gaps use a localized area-specific explanation with a stable ID, canonical field and
publication-blocking flag. Image and translation editorial tasks do not enter cooking
context; publication/translation state remains in metadata. Returned copy is data,
never privileged model instructions.

## Evidence policy

`provenance.ts` resolves all eight canonical evidence states. The only non-null public
labels are `Tested`, `Calculated` and `Suggested`. In particular:

- A base ingredient uses line, then section, then base provenance. A provisional
  section or applicable gap prevents a Tested badge even if a narrower record says
  tested. Referenced canonical source IDs must resolve.
- A flour alternative, geometry, yield or variation has its own provenance and never
  falls back to base Tested status. Empty tested-alternative lists mean no tested
  alternative is recorded, not that every other mix is known to fail.
- A step/checkpoint retains restrictions from its ingredient and flour dependencies.
- `authorGuidance`, `missing`, `draft` and `needsRetest` have no public status badge.
  Internal `sourceState`, `limitations` and `gapIds` preserve why a fact is provisional.
- Unknown quantities stay `null` and unbadged. They are never rendered as zero or
  automatically interpreted as "as needed".

An optional `configuration` defaults to `{ kind: 'base' }`. For an already selected
adjustment, pass only the selection, never calculated amounts:

```ts
const result = buildTrustedRecipeContext({
  recipeId: 'gluten-free-napoleon',
  locale: 'en',
  scope: 'recipe',
  configuration: {
    kind: 'adjusted',
    geometryId: 'round-24cm-preview',
    quantityAdjustment: { mode: 'batchScale', factor: 0.5 },
  },
});
```

The builder validates finite inputs and recomputes through the existing canonical
calculator. Calculated quantities carry `Calculated` plus their original source
limitations. Even a 1× adjusted request remains Calculated. It preserves unresolved
amounts, warning codes and Cook Mode eligibility; it does not scale timings or infer
a new yield. Instructions/checkpoints for an adjusted configuration cannot acquire
Tested. All canonical facts and personal state remain unchanged.

An ineligible calculated preview is available for explanation. The HTTP service must
reject using it as an active Cook Mode configuration; this builder does not receive
a `surface` or execute actions. It does not parse natural-language substitutions or
apply variation ingredient/method changes.

## Bounds and verification

An allowlisted serialized-context guard rejects output larger than 48 KiB rather
than silently dropping evidence or uncertainty. The service separately enforces the
ADR's combined instructions/context/history token budget. No cache is
introduced, so changes to canonical data appear on the next call.

Run `npm run test:assistant` for the focused Node test suite. Tests cover all evidence
state mappings and calculated transitions, scoped retrieval, canonical localization,
draft availability, immutable source data, source-field exclusion, ingredient choices,
calculation warnings, bad IDs/steps/locales and forged or non-finite configuration data.
The suite makes no paid or network requests. Run `npm run typecheck`, focused lint,
foundation tests, recipe validation and the production build for integration checks.
