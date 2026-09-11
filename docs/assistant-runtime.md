# Assistant runtime policy and structured output

The controlled action extension is documented in [ADR 0004](architecture/0004-controlled-assistant-actions.md).
The runtime is now `assistant-v3`: the model may select a server catalog `actionId`
but still has no tools or execution authority. Review and explicit user confirmation
are required before the client can call existing persistence or navigation controls.

This implements the prompt/output slice of [ADR 0003](architecture/0003-contextual-ai-assistant.md).
It does not enable the assistant, publish recipes, modify canonical recipe data,
configure secrets, or complete the shared quota/budget release gates.

## Runtime contract

`lib/assistant/server/prompt.ts` owns versioned developer policy (`assistant-v3`).
The server appends the validated locale instruction. User questions and history
remain JSON data in the input message, never developer instructions. The canonical
recipe context and evidence catalog are also data, not executable instructions.
History is not evidence and cannot certify a substitution.

The Responses request uses `gpt-5.4-mini`, `reasoning: { effort: 'low' }`,
`store: false`, no tools, no tool choice, no conversation/previous-response ID,
and strict `text.format` JSON Schema. The model is fixed for this release; an
alternative `OPENAI_MODEL` value fails environment validation.
`ASSISTANT_MAX_OUTPUT_TOKENS` controls the output cap (default 2000, range 256–4000).
Timeout remains 15 seconds and automatic retries remain disabled.

The provider schema in `server/openai.ts` requires:

- `locale`: exactly the requested en, es or uk (runtime checked too).
- `outcome`: answered, insufficient-context, out-of-scope or refused.
- `actionId`: null or an available server catalog ID; no model-authored action payload.
- `blocks`: one to six evidence selections or prose blocks.
- Evidence: only `kind` and a catalog `evidenceId`.
- Prose: only `kind`, `text` (up to 800 characters), and up to four unique evidence IDs.

Unknown keys, model-provided badges/qualifications/sources/action payloads, empty text,
uncited explanations and non-limitation blocks in non-answered outcomes are rejected.
The public response contract stays at v1 with a nullable typed action proposal;
the internal provider format is v3.

## Evidence and validation

The serialized input includes the actual evidence catalog, not only the underlying
context. Its size is included in the existing conservative input-size estimate.
Evidence IDs are request-local and resolved against that exact catalog. The server
copies fact text, provenance qualification and reference into the public response.
The model never authors a badged fact. Calculated quantities still come from the
canonical application calculator, including a 1× adjusted selection.

Generated explanations are unbadged. Generated substitutions are always Suggested
with a localized server-owned untested qualification. Missing information is an
unbadged limitation, not a fourth Unknown status. Tested remains adaptation-specific
and only originates in explicit verified canonical evidence.

Validation happens before any client response: completion/error/refusal checks,
bounded JSON parsing, strict provider shape, locale equality, reference membership,
prose guards and deep public-envelope validation. The service revalidates even an
injected provider implementation. Invalid output becomes HTTP 502 with localized
`INVALID_UPSTREAM_RESPONSE`, no raw provider text, and no retry/repair call.
Provider refusals use a fixed localized limitation without returning raw refusal text.

The prompt prohibits invented facts, arithmetic, sources, author experience, medical
or universal health claims, and recipe writes. Numeric facts must be evidence blocks;
generated prose cannot reuse a number merely because it occurs elsewhere in the recipe.
The prose guard rejects Unicode numbers, common numerical words, markup/links,
control characters, obvious positive verification claims, selected health/action/
author impersonation patterns, and obvious Cyrillic-script locale mismatches.

These text checks are deliberately conservative, not a complete semantic verifier
or language detector: they can reject benign prose and cannot prove that every
paraphrase is grounded, distinguish every English/Spanish sentence, or defeat all
prompt injections. The stronger guarantees are structural: the model cannot assign
badges, alter canonical evidence, resolve unknown references or execute tools/writes.
Live multilingual quality and adversarial evaluations remain a release gate.

## Secrets and privacy

Keep `OPENAI_API_KEY` in an ignored local env file and in production server runtime
secrets. A GitHub Secret must be explicitly delivered by CI to that runtime; it is
not a public build variable. Never use `NEXT_PUBLIC_` or `VITE_` for the key.
`.env.example` contains names and non-secret defaults only.

This slice does not log prompts, responses, questions, history or credentials.
`store: false` disables response storage, not every possible provider retention
mechanism. Follow the ADR privacy disclosure and provider data-policy review before
release. Shared rate limits and cost reservations are still required before enabling
public traffic; per-request caps are not an account-wide budget implementation.

## Tests

Run `npm run test:assistant`. `server/runtime.golden.test.ts` exercises a mocked SDK
through the real provider, service and HTTP error mapping for en/es/uk: canonical
Tested facts, unbadged explanations, Suggested substitutions, unknown limitations,
Calculated facts, refusals, invalid JSON, truncation, forged evidence, false badges,
wrong locale, injection-shaped requests and unsafe prose. It also checks that
canonical recipe data remains unchanged. No API key or paid API call is needed.
Publication checks are explicitly bypassed only in test dependencies; canonical
Napoleon content is not silently made publishable.

Implementation was checked against official OpenAI documentation:
[GPT-5.4 mini](https://developers.openai.com/api/docs/models/gpt-5.4-mini) and
[Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs).
