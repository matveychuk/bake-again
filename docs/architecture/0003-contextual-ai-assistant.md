# ADR 0003: Contextual AI assistant

**Status:** Implemented behind the `ASSISTANT_ENABLED` release gate
**Date:** 2026-09-10
**Owners:** Bake Again product and engineering
**Scope:** Read-only Recipe Detail and Cook Mode assistant

## Context

Bake Again's recipe collection is the source of truth. The assistant helps readers
understand that collection within Recipe Detail and Cook Mode. It is not a separate
navigation destination. The product brief's broader search and shopping workflows
remain a later phase; this ADR selects a read-only first slice.

The inspected application uses Vinext, React and a Cloudflare Worker build configured
through `vite.config.ts`, with OpenAI Sites metadata in `.openai/hosting.json`. There
is no OpenAI dependency or assistant API route yet. D1 and R2 bindings are currently
null. The existing recipe and cooking assistants are visual prototypes with inactive
forms and English copy; their presence does not establish backend capabilities.

`content/recipes/registry.ts` indexes both `RecipeDraft` and `RecipeSourceDraft`.
Only Napoleon and Crinkle Cookies currently have the detailed multilingual model.
`getRecipeContent()` is a presentation projection that loses granular provenance;
the assistant must use `getRecipeDocument()` and the detailed document instead.

Napoleon currently has `publicationStatus: "draft"`, no reviewed recipe locale, and
publication-blocking content gaps. Its canonical base describes **two cakes with six
28 cm layers each**, using a `roundTemplate` with `application: "roll-and-trim"`.
Older brief examples and prototype copy are not authoritative replacements for those
facts. In particular, a template must not become a bake-in pan in an AI answer.

## Decision

### Server boundary and request lifecycle

Use the official OpenAI TypeScript SDK with the Responses API exclusively on the
server. Introduce `POST /api/assistant` as a same-origin JSON endpoint. Keep `/api/`
outside the locale redirect proxy; locale is an explicit validated request field.

The sequence is:

1. Validate method, content type, origin, body size and request schema.
2. Enforce the server feature flag, recipe/locale/preview eligibility and shared quotas.
3. Resolve the canonical recipe/version, step IDs and selected configuration.
4. Build a bounded trusted context and reserve the maximum possible request cost.
5. Call `client.responses.create()` with developer instructions, structured context,
   the question, bounded history, `store: false`, and strict Structured Outputs.
6. Validate completion state, refusal, schema, reference membership and policy rules.
7. Assemble evidence blocks from server-owned values; return one JSON response.
8. Reconcile cost accounting and record content-free operational metrics.

No OpenAI credentials, SDK client or server module may enter a browser import graph.
The runtime adapter must obtain bindings at request time; do not assume that a
Node-style `process.env` in development proves production Worker binding behavior.
Verify route handling, SDK compatibility and runtime secret access in the actual
Vinext build during implementation. Do not switch hosting platforms for this slice.

Use non-streaming JSON initially so invalid or partial answers never acquire evidence
badges before validation. Browser cancellation propagates to the server/provider when
possible; cancellation does not guarantee that upstream usage is unbilled.

### Request contract

These are planned TypeScript contracts, not an implementation. Reuse the existing
`AppLocale` and `QuantityAdjustmentSelection` types. Runtime schemas must reject
unknown properties and validate values as well as TypeScript shapes.

```ts
import type { AppLocale } from '@/lib/i18n/config';
import type { QuantityAdjustmentSelection } from '@/content/recipes/recipe.types';

type AssistantScope =
  | { kind: 'recipe' }
  | { kind: 'flour' }
  | { kind: 'step'; stepIds: [string, ...string[]] };

type AssistantConfiguration =
  | { kind: 'base' }
  | {
      kind: 'adjusted';
      geometryId: string;
      quantityAdjustment: QuantityAdjustmentSelection;
    };

type AssistantRequestV1 = {
  schemaVersion: 1;
  recipeId: string;
  recipeVersionId: string;
  locale: AppLocale;
  surface: 'recipe-detail' | 'cook-mode';
  scope: AssistantScope;
  configuration: AssistantConfiguration;
  question: string;
  history: Array<{ role: 'user' | 'assistant'; text: string }>;
};
```

Require stable recipe/version IDs, not slugs or translated titles. Reject a stale
version with `409`; do not answer against a silently changed recipe. Validate all
step IDs against the selected recipe. Allow at most two canonical steps per request
because Cook Mode currently groups nuts and maturation steps. A future shared,
content-only mapping must expose these canonical IDs to the existing UI; never infer
a step from its displayed number or title. Step mappings currently live under a route
and must not be imported by the server content layer.

Require the actual displayed configuration even for a recipe-wide question. The
server recomputes adjusted quantities through existing calculation functions; it
never trusts client-supplied amounts, statuses, warnings or eligibility. Reject
non-finite amounts, unsupported units/options and invalid geometry selections before
calculation. Do not reuse the forgiving URL parser to silently normalize API errors.
For Cook Mode, reject configurations with `cookMode.eligible === false`; Recipe
Detail may explain such a preview while preserving all blocking warnings.

Initial bounds: 16 KiB UTF-8 body, 1–2,000 characters after trimming the question,
at most four history messages of 1,500 characters each, and ID strings of at most
128 characters. Enforce the body limit while reading, not only via Content-Length.
The server owns model, effort, system instructions, budget and tool policy. There
are no request fields for API keys, developer messages, arbitrary URLs, complete
recipes, tools, private notes or shopping contents.

### Response contract and evidence boundary

Separate model-authored explanations from server-authored evidence. The model may
select an evidence ID, but it cannot supply a public status or rewrite a badged fact.
This keeps an AI paraphrase from being presented as a bake-tested statement.

```ts
type PublicEvidenceStatus = 'Tested' | 'Calculated' | 'Suggested';

type EvidenceRef = {
  id: string;                    // Server-issued ID in this request's context
  recipeId: string;
  recipeVersionId: string;
  field: string;                 // Canonical field/step/ingredient identity
};

type AssistantBlock =
  | {
      kind: 'evidence';
      text: string;              // Server-rendered canonical fact/calculation
      status: PublicEvidenceStatus | null;
      qualification: string | null;
      references: EvidenceRef[];
    }
  | {
      kind: 'explanation';
      text: string;              // Model-authored; no evidence-status badge
      status: null;
      references: EvidenceRef[];
    }
  | {
      kind: 'suggestion';
      text: string;
      status: 'Suggested';
      qualification: string;     // Localized "not bake-tested" explanation
      references: EvidenceRef[]; // May be empty; not evidence of successful testing
    }
  | {
      kind: 'limitation';
      text: string;
      status: null;
      references: EvidenceRef[];
    };

type AssistantErrorCode =
  | 'INVALID_REQUEST' | 'PAYLOAD_TOO_LARGE' | 'UNSUPPORTED_MEDIA_TYPE'
  | 'METHOD_NOT_ALLOWED' | 'ORIGIN_NOT_ALLOWED' | 'RECIPE_UNAVAILABLE'
  | 'LOCALE_UNAVAILABLE' | 'RECIPE_VERSION_MISMATCH'
  | 'CONFIGURATION_UNAVAILABLE' | 'ASSISTANT_DISABLED' | 'RATE_LIMITED'
  | 'BUDGET_EXHAUSTED' | 'SERVICE_UNAVAILABLE' | 'UPSTREAM_TIMEOUT'
  | 'INVALID_UPSTREAM_RESPONSE' | 'INTERNAL_ERROR';

type AssistantResponseV1 =
  | {
      schemaVersion: 1;
      ok: true;
      requestId: string;
      recipeId: string;
      recipeVersionId: string;
      locale: AppLocale;
      configuration: AssistantConfiguration;
      outcome: 'answered' | 'insufficient-context' | 'out-of-scope' | 'refused';
      blocks: AssistantBlock[];
      proposedAction: null;      // No executable action payload in MVP
    }
  | {
      schemaVersion: 1;
      ok: false;
      requestId: string;
      error: {
        code: AssistantErrorCode;
        message: string;         // Safe localized dictionary text
        retryable: boolean;
        retryAfterSeconds: number | null;
      };
    };
```

The provider schema is narrower: an outcome and an ordered list of either an
`evidenceId` selection or `{ kind, text, evidenceIds }` for explanation, suggestion
and limitation. It contains no status, action, source path, URL or executable HTML.
Resolve IDs only within this request's evidence map and reject unknown references.
Server code creates all envelope metadata, reference objects, badges and qualifications.
Enforce 1–6 blocks, at most 800 characters per prose block, at most four references
per block and an approximate 180-word answer target across languages.

Strict JSON validates structure, not factual truth. Evaluate generated prose for
unsupported claims, implied test history and invented numbers; use deterministic
checks for references and numerical values where possible. Do not claim that reference
membership alone proves entailment. On a detected violation return a safe limitation
or controlled error, without a second model "repair" call. AI-authored explanation
retains its AI label even when its citations are valid.

### Trusted context builder

Build context from `getRecipeDocument(recipeId)` only when `kind === 'detailed'` and
the rollout gate permits the recipe. Keep `RecipeSourceDraft`, inventory/card copy,
prototype steps, external reference pages and arbitrary filesystem reads out of the
context. Do not scrape source URLs or add web search, embeddings or a vector store.

The builder projects typed values rather than serializing the entire document:

- Stable recipe/version identity, active locale, publication mode and exact geometry,
  yield and configuration scope.
- Relevant ingredient lines, their option relationships and structured quantities;
  preserve `choose: 1`, optionality, conditions and unresolved choices.
- Flour configuration, documented alternatives, availability and provenance.
- Relevant timing phases, explicit unknown elapsed time and make-ahead/storage gaps.
- Current step(s), referenced ingredient lines, equipment and checkpoint/practical
  guidance. Recipe scope may include a compact method outline; step scope emphasizes
  the selected steps without losing related restrictions.
- Relevant variation/geometry constraints and immutable calculator results when the
  user is already viewing an adjusted configuration.
- A server-built evidence map and sanitized limitations derived from `contentGaps`.

Always include applicable uncertainty, availability restrictions and narrower evidence
overrides even when pruning context. `SourceRef.file`, archive paths and editorial
notes stay server-side; expose only safe recipe/field identities and reader-facing
qualifications. Resolve source IDs internally, not as fetch instructions. Missing
values remain unknown; `null` must not be formatted as "as needed" unless that meaning
is explicitly recorded for the ingredient.

Use a versioned, pure field resolver for each allowed projection. Ingredient evidence
comes from the line, then its section, then base provenance only for unchanged base
facts. Specific provisional provenance or an applicable gap always prevents a Tested
badge. Geometry, yield, flour alternatives and variations use their own provenance;
they never inherit an unrelated base status. Step guidance uses its own provenance
when present; recipe facts in the unchanged base may use base provenance, but a step
that depends on unresolved ingredient data carries that limitation. Ambiguous evidence
is unbadged, not optimistically upgraded.

Limit combined instructions, context and history to an initial 8,000 input-token
budget using a compatible tokenizer or conservative UTF-8 upper-bound estimator.
Drop oldest history and optional context before essential evidence. If required
context still exceeds the bound, return a controlled limitation without a model call.
Cache only this non-personal projection, keyed by recipe/version, content digest,
locale, scope, configuration and context-policy version. Invalidate on content changes
even if a draft's versionId was not incremented. Do not cache conversations or answers
shared across visitors.

### Provenance rules

| Canonical evidence | Assistant treatment |
| --- | --- |
| `repeatedlyVerified`, `tested` | Server-rendered fact may show **Tested** with check icon, only within its exact supported scope. "Made many times" is supporting text. |
| `calculated` or server calculator result | **Calculated** with calculator icon; quantities adjusted mathematically and this version not bake-tested. Provisional source inputs remain explicitly provisional. |
| `suggested` or model-proposed change | **Suggested** with lightbulb icon and explicit not-bake-tested qualification. |
| `authorGuidance` | Unbadged source fact or limitation with "Author guidance; not tested in this exact version" qualification. Do not silently relabel it Tested or erase its author origin. |
| `missing`, `draft`, `needsRetest` | Unavailable/limitation text; never asserted as a usable tested adaptation. |

There is no fourth public status called `Unknown`, `Verified` or `Author guidance`.
The contract uses `status: null` for explanations and limitations. Written labels and
icons are both required; colour is supplementary. Generated prose never receives a
Tested badge, including when explaining a tested source. No response can modify the
public provenance or canonical recipe document.

Specific regression examples: another Schär mix is not tested because Mix B was
tested; provisional custard quantities stay provisional; 24 cm geometry does not imply
known timing; a generated texture interpretation is not an author's checkpoint.

### Deterministic calculations and actions

`calculateRecipeConfiguration()` and the existing recipe configuration adapters own
all arithmetic, rounding, allowed anchors, warnings and Cook Mode eligibility.
The assistant may explain a configuration already selected in product controls by
having the server recalculate it. It must not parse free-text quantities into a newly
applied configuration, invent an egg-rounding rule, predict baking-time scaling or
infer missing total duration. For a new scale request, direct the reader in prose to
the existing adjustment controls.

The current calculator returns `CalculatedRecipeConfiguration` even for a 1× base
input. For an explicit `kind: 'base'` request, use canonical base facts and their
granular provenance. For `kind: 'adjusted'`, preserve Calculated results and warnings;
do not change a changed geometry back to Tested merely because its total factor is 1.
Neither path writes calculated amounts into `RecipeDraft`.

MVP has no tool calling, shopping writes, saved-state writes, recipe edits, navigation
commands or photo uploads. `proposedAction` is always null. A later ADR may introduce
typed, validated action proposals with explicit user confirmation and existing
persistence functions. ADR 0002 currently allows only Tested base ingredients in the
shopping slice; supporting adjusted shopping items requires a separate schema and
provenance decision first. Do not promise to have added items in a text-only answer.

### Multilingual behavior and stateless conversation

Reuse `AppLocale` (`en`, `es`, `uk`); Ukrainian is `uk`, not `ua`. The route locale
sent by the UI determines the answer language, error dictionary, evidence wording and
`Intl` formatting. Ingredient identities, quantities, units, recipe/version IDs and
provenance remain shared. A differently written user question does not silently change
the application locale. Never generate replacement canonical recipe translations.

Public access requires both `isRecipeLocalePublishable(recipe, locale)` and
`isUiLocalePublishable(locale)`, plus reviewed assistant dictionary copy. Missing
localization returns `LOCALE_UNAVAILABLE`; do not silently mix in another language.
Draft-localized context is permitted only in local development or an independently
access-controlled editorial preview. A browser-provided preview flag or `noindex`
is not access control.

Each request supplies a complete current context and developer instructions. Set
`store: false` on every OpenAI call; do not use `previous_response_id`, Conversations,
Assistants, background mode or a provider-hosted conversation store. Bounded browser
history is untrusted continuity data, never evidence. Serialize history as a low-trust
data field rather than accepting privileged role messages from the client.

Keep history only in component memory, clear it when the drawer closes, and reset it
when recipe, version, locale, step scope or displayed configuration changes. Ignore
late responses after those changes. Do not add chat history to localStorage, cookies
or the personal-state slices. Stateless here means no persisted conversation; shared
quota counters and anonymous operational metrics are still necessary.

### Prompt policy and output safety

Developer instructions require concise, practical answers grounded in supplied facts.
Recipe text, user questions and history are data, never higher-priority instructions.
General explanations must distinguish inference from source facts. Unsupported
substitution proposals may be Suggested, with uncertainty; do not invent ratios,
success guarantees or a complete replacement recipe. Unknown questions may receive a
limitation instead. Reject off-topic workflows and requests to change provenance.

Do not diagnose, make medical or universal gluten-free health claims, guarantee allergy
safety, or impersonate the author. The first slice cannot see a reader's dough; texture
questions must ask for a text description or explain recorded checkpoints without
claiming visual inspection. Future UI work must remove prototype prompts that promise
unimplemented actions or image analysis.

Render returned prose as text. No raw HTML, model-supplied links or executable Markdown.
References are server-resolved records; a future UI can create localized internal
links only through approved route helpers. Neither valid JSON nor a stronger model
replaces provenance tests and answer evaluation.

### Errors, abuse limits and availability

All responses use `Cache-Control: no-store` and a server-generated request ID. Successful
insufficient-context, off-topic or provider-refusal outcomes use `200` with a localized
limitation. An upstream refusal is handled before schema parsing, not treated as
arbitrary JSON or repeatedly retried.

| HTTP | Codes / meaning |
| --- | --- |
| 400 / 413 / 415 / 405 | Invalid fields, oversized body, wrong content type, unsupported method. No OpenAI call. |
| 403 | Origin rejected or locale unavailable. |
| 404 | Recipe unknown or not eligible, including drafts on the public endpoint. |
| 409 | Stale recipe version or configuration unavailable for this surface. |
| 429 | Application rate limit; include `Retry-After` and retry seconds. |
| 503 | Disabled assistant, budget exhausted, configuration/limiter unavailable, or transient provider unavailability. |
| 504 | Upstream deadline exceeded. |
| 502 | Invalid, empty, incomplete or policy-invalid upstream response. |
| 500 | Unexpected internal failure with a generic message. |

Map provider errors to these stable codes. Never forward keys, prompts, raw provider
exceptions or stack traces. Missing/invalid credentials disable the assistant and
raise an operational event; ordinary recipe pages keep working. Do not mark permanent
quota exhaustion or credential errors as immediately retryable.
Before a valid locale can be parsed (for example, for malformed JSON), use the existing
`defaultLocale` dictionary for the error; never reflect arbitrary request text.

Start with a 15-second total deadline and zero automatic SDK retries. A transient
failure offers a user-controlled retry, which consumes a new quota reservation.
Do not regenerate a failed schema automatically. Prevent concurrent sends per drawer;
the server must also enforce concurrency and quotas independently of the UI.

Proposed initial limits: 5 requests/minute and 30/day per server-issued anonymous
session, a secondary 20/minute network bucket, and a global concurrency/cost ceiling.
Use a short-lived random, signed, HttpOnly, SameSite cookie (Secure in production),
not a client-provided account ID. A rotating keyed hash of the trusted ingress network
address can support the secondary bucket; never trust arbitrary forwarded headers.
Cookies/IP buckets are abuse heuristics, not proof of identity. Same-origin checks and
CORS are defense in depth, not sufficient protection against direct API callers.

Production requires shared atomic quota and budget accounting across Worker instances.
Implement behind `AssistantQuotaStore`, using a Sites-supported shared primitive
(D1 is the first candidate) with bounded expiry and conditional atomic reservations.
The binding and transactional behavior must be proven before enabling public access;
process-local maps or eventually consistent counters are insufficient for a global
spend ceiling. If the shared store fails, fail closed for AI only. This operational
store contains counters/reservations, not conversations or recipe content.

### Privacy, logging and cost controls

Only the submitted question, bounded history and relevant recipe projection go to
OpenAI. Do not automatically read or transmit private notes, shopping contents or
other personal-state slices. A concise localized disclosure in the eventual assistant
explains that questions are sent to OpenAI and that AI can make mistakes.

`store: false` disables normal Responses application-state storage; it does **not**
mean zero provider retention. OpenAI's default abuse-monitoring retention can still
apply. Do not claim Zero Data Retention unless separately configured and verified.
See [OpenAI data controls](https://developers.openai.com/api/docs/guides/your-data).

Allowlisted logs: request ID, provider request ID, recipe/version, locale, scope,
model/prompt/context versions, status/error code, latency, token usage, cache usage
and estimated cost. Never log raw prompts, answers, body dumps, secrets, cookies,
raw network addresses or provider reasoning. Configure SDK, proxy and error-reporting
hooks consistently. Retain request metadata for an initial seven days; keep aggregate
daily cost totals for 90 days. Expire session/network quota keys within 48 hours.
Use keyed pseudonymous identifiers for abuse controls; do not call them anonymous
personal identities. If sent, `safety_identifier` is derived from the random session,
not an email or IP address.

Use one server-allowlisted, cost-conscious model; the initial evaluation candidate is
`gpt-5.4-mini` with `reasoning.effort: 'low'`. Pin an available snapshot after evaluating
it with the user's API project. Availability and pricing are release checks, not
assumptions about this account. No automatic escalation, agents or paid built-in tools.
The model supports Structured Outputs and configurable reasoning according to its
[official model page](https://developers.openai.com/api/docs/models/gpt-5.4-mini).

Start with `max_output_tokens: 2000`, which includes reasoning and visible output,
while enforcing the shorter answer target separately. Tune this cap from measured
completion rates; a 700-token hard cap may truncate reasoning plus structured JSON.
Reserve the worst-case uncached input plus maximum output cost before each call using
a versioned price table. Reconcile observed usage afterward. For an unknown timeout
or cancellation bill, keep the conservative reservation until reconciliation rather
than refunding it immediately. Bound concurrent in-flight calls atomically.

Require configured daily/monthly USD ceilings before production enablement; no implicit
unlimited default. Stop new calls when spent plus reserved cost reaches either ceiling.
Use 80% alerts and a server kill switch. Provider dashboard alerts supplement this
application guardrail; do not assume they are a hard spending stop. Budget accounting
covers this assistant's traffic, so a dedicated project/key is preferable when the
owner also uses OpenAI elsewhere. Unit tests and PR CI use mocks; paid evals are an
explicit, capped workflow outside ordinary CI.

### Local environment and production runtime secrets

Use the owner's OpenAI key. Locally store it in ignored `.env.local`, with placeholders
only in a future `.env.example`. `.gitignore` already excludes `.env*` except that
example. The runtime adapter must prove local loading in Vinext/Worker development;
never fix missing bindings by exposing variables through Vite `define` or client code.
If tooling needs another local secret file, add and verify its ignore rule first.

Planned server configuration:

```dotenv
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.4-mini
ASSISTANT_ENABLED=false
ASSISTANT_MAX_OUTPUT_TOKENS=2000
ASSISTANT_DAILY_BUDGET_USD=
ASSISTANT_MONTHLY_BUDGET_USD=
ASSISTANT_SESSION_SECRET=
```

The key and session signing secret are secrets; model, feature flag, token cap and
budgets are validated runtime configuration. No `NEXT_PUBLIC_` or `VITE_` secret
variables. No values in the hosting manifest, Git, source maps, artifacts, Docker/build
arguments or browser props. Credentials are loaded on the server as required by
[OpenAI authentication guidance](https://developers.openai.com/api/reference/overview).

For deployment, store credentials in a protected GitHub `production` Environment when
GitHub Actions is used. A GitHub Secret is available to that job, not automatically to
the running application: provisioning must place it in the **Sites runtime secret
store** before enablement. Build and untrusted PR jobs must work without the key.
Only the protected provisioning/deploy step receives it. Disable command tracing and
do not rely solely on log masking.

The current repository does not establish a GitHub-to-Sites secret provisioning
workflow. Implementation must verify a supported path. If unavailable, configure the
same owner-provided key directly as a Site runtime secret through the supported
interface; GitHub may retain the protected deployment source, but must not inject the
value into a bundle. Do not invent a Sites API or replace the hosting provider.
Separate preview and production credentials where practical, and rotate any exposed
key. A secret-presence smoke check returns availability only, never the value.

## Planned module boundaries

The context/provenance slice is documented in [Trusted assistant context](../assistant-context.md).
Its pure builder exposes publication metadata; the future service still owns access,
Napoleon-only rollout and complete prompt-budget enforcement.

```text
app/api/assistant/route.ts          HTTP adapter and response mapping
lib/assistant/contracts.ts         Shared wire types; no SDK or secrets
lib/assistant/server/service.ts    Orchestration, policy and response assembly
lib/assistant/server/context.ts    Canonical context/evidence projection
lib/assistant/server/provenance.ts Granular evidence resolution
lib/assistant/server/openai.ts     Responses SDK adapter and provider schema
lib/assistant/server/prompt.ts     Versioned developer instructions
lib/assistant/server/env.ts        Validated Worker/local runtime bindings
lib/assistant/server/quotas.ts     Shared reservation/limit interface
lib/assistant/server/telemetry.ts  Allowlisted content-free events
components/recipe/...              Existing assistants, later consolidated for reuse
lib/i18n/messages.ts               Later assistant dictionary entries
```

Routes compose server services. Server services read content and pure calculators;
canonical recipe files never import assistant, React, persistence or route code.
Shared UI imports only wire types and existing primitives. When UI is implemented,
move or extend the existing assistants in the shared recipe layer so shared components
no longer import route-owned assistant implementations. Reuse semantic tokens and
the approved Warm Precision / Review applied baseline. Update the component source,
Design Lab example, documentation and design-system changelog together at that time.

## Rollout and implementation gates

1. Implement server contracts, context/provenance projection and mocked provider tests.
   Default the global feature flag to off and allowlist only `gluten-free-napoleon`.
2. Exercise a local or access-controlled editorial preview with the current draft.
   Preserve provisional fields and draft translations; preview access is checked on
   the server independently of the request body.
3. Wire existing Recipe Detail and Cook Mode assistants to stable canonical step IDs,
   actual configuration and localized copy. Map grouped steps explicitly; do not use
   prototype numbering as recipe evidence.
4. Run capped live evaluations, verify Worker runtime secrets, shared atomic limits,
   budget cutoff and output validation. No public enablement without these checks.
5. Enable Napoleon publicly only after author-owned content/translation publication
   gates and assistant dictionary review pass for each enabled locale. Current draft
   state means this gate is **not satisfied**, even for English.
6. Monitor error/invalid-output rates, latency, tokens and cost. Roll back immediately
   through `ASSISTANT_ENABLED=false`; static recipes remain available. Extend to
   Crinkle Cookies or other recipes only after their independent gates and evals pass.

## Verification required during implementation

- Contract tests for unknown fields/IDs, forged statuses, stale versions, large bodies,
  invalid locales, grouped steps and malformed/non-finite configuration values.
- Context tests proving no sourceDraft, prototype, arbitrary file/URL, source path or
  private-state ingestion; missing and provisional data survive projection/pruning.
- Provenance tests for exact base, changed geometry, flour substitution, custard
  `authorGuidance`, missing storage, calculated previews and all internal evidence states.
- Deterministic tests preserving warnings, fractional-ingredient behavior and Cook
  Mode eligibility; no writes to content or shopping state.
- Provider tests for refusal, timeout, incomplete JSON, unknown references, unapproved
  numbers, misleading test claims and no automatic paid retry.
- Quota tests across concurrent instances, depleted daily/monthly budgets, unknown
  timeout usage and unavailable quota store; public mode fails closed for AI.
- Three-language eval fixtures for recipe facts, step simplification, unknown
  substitutions, prompt injection, off-topic/medical requests and honest uncertainty.
  Require all critical provenance/privacy cases to pass in the release corpus; this
  is a test result, not a guarantee of universal model correctness.
- Secret scan of client output/artifacts and credential-free PR build. Runtime smoke
  checks must use the deployed binding, not a build-time substitute.
- When UI changes: keyboard focus/return/Escape, labelled controls, live announcements,
  AA contrast and long EN/ES/UK copy at 390, 900 and 1440 px. The recipe remains dominant
  and usable through every AI failure state.

## Compatibility review for this ADR

| Source of truth | Resolution |
| --- | --- |
| `AGENTS.md`, status/provenance design rules | Exactly three public status words/icons. Generated prose is not Tested. No UI or design-system changes in this ADR. |
| `recipe.types.ts` schema v2 | Reuse `geometry`, quantities, canonical IDs, evidence states and configuration unions; no new recipe schema or mutation. |
| `gluten-free-napoleon.recipe.ts` | Two six-layer cakes and roll-and-trim geometry supersede older illustrative wording; unresolved custard/timing remain explicit. |
| `calculate-configuration.ts` | Server recomputation owns arithmetic. Its always-Calculated return type does not override canonical base evidence. |
| ADR 0001 and publication helpers | Shared locale identity and existing recipe/UI review gates are retained; previews cannot bypass public API access control. |
| ADR 0002 | Browser-local shopping/recipe memory is neither transmitted nor mutated; adjusted shopping remains deferred. |
| Frontend architecture | Shared components do not import routes; canonical content does not import presentation or assistant services. |
| UX specification and product brief | Contextual, practical, recipe-first assistant; broad discovery/actions deferred deliberately; explicit cost controls retained. |

Unknown evidence uses an unbadged limitation, and only server-owned facts can receive
Tested. The output cap includes reasoning as well as visible text. No content
publication status, schema or product behavior is changed by this document. Full
application typecheck/build and live API tests belong to the implementation phase;
this documentation change requires contract-type, content, link and diff review.

## Consequences and alternatives

This design adds an operational quota store but no recipe database or conversation
store. It limits what the model can certify, keeps evidence reviewable, and permits
read-only explanations of existing calculations. It does not eliminate semantic
hallucination, so evaluation and clear separation of AI prose remain necessary.

Direct browser-to-OpenAI calls would expose credentials. A full recipe-database prompt
would increase cost and muddy evidence boundaries. Vector search, provider conversation
storage, streaming, model escalation and autonomous actions add no essential capability
to the Napoleon first slice and are deferred. The unresolved hosting quota/provisioning
integration and current editorial draft are release gates, not reasons to publish
incomplete content or bypass runtime secrets.

## References

- [Frontend architecture](../frontend-architecture.md)
- [Multilingual foundation](0001-multilingual-foundation.md)
- [Anonymous personal state](0002-anonymous-personal-state.md)
- [Recipe content model](../content-model/README.md)
- [UX and IA specification](../reference/UX-IA-Specification-v1.md), product principles,
  contextual assistant and adaptations/provenance sections
- [Product and Engineering Brief](<../reference/Gluten-Free Baking — Product & Engineering Brief v1.md>), sections 17–19 and AI MVP
- [Status and provenance](../../design-system/status-provenance.md)
- [OpenAI Responses reference](https://developers.openai.com/api/reference/cli/resources/responses/methods/create)
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

Repository observations and official API guidance reviewed on 2026-09-10. Runtime
access, SDK compatibility, supported shared storage and account-specific model access
must be verified when implemented.
