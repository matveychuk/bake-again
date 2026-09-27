# AI assistant protection — 2026-09-27

Implemented and locally verified. This audit describes the pre-activation state; the
subsequent publication setup is recorded below.
Prepared recipe answers remain local, unlimited and available when custom AI is disabled.

## Enforced limits

| Scope | Limit |
| --- | --- |
| Signed browser identity | 5 model requests in a rolling 2 hours; 10 in a rolling 24 hours |
| Network address (keyed hash) | 20 model requests/minute; 40/rolling 24 hours |
| Entire site | 100 model requests/rolling 24 hours |
| Concurrent reservations | 1 per browser identity; 3 for the entire site |
| Reserved spend | $1/rolling 24 hours; $10/UTC calendar month by default |
| Turnstile verification attempts | 20/network/minute; 300/site/minute |

The two-hour window is server-owned and is not reset by reopening the drawer, refreshing,
or selecting another recipe. This is a browser allowance, not proof of a unique person.
Deleting cookies can create another identity. Network limits and the shared site budget
still apply; distributed bots cannot bypass the global spend reservation through new
identities. Turnstile reduces automation but does not guarantee every visitor is human.
IP limits can affect several people behind one network.

## Request path and failure behavior

1. Existing same-origin, JSON, 16 KiB body, schema and process-local burst checks.
2. Signed, HttpOnly, SameSite=Strict browser cookie with a server-verified 48-hour expiry.
3. Shared verification-attempt limit, then server-side Turnstile Siteverify. Validate
   success, exact hostname and `bake_assistant` action. Tokens are single-use and expire
   after five minutes under Cloudflare's rules. Reject official dummy keys in all runtimes.
4. Canonical recipe/configuration/publication validation and bounded context construction.
5. A single D1 `INSERT … SELECT … RETURNING` atomically checks every quota and reserves
   maximum estimated spend before the provider call. No read-then-increment race and no
   in-memory fallback. A duplicate internal request ID cannot authorize a second call.
6. Provider call: fixed `gpt-5.4-mini`, default service tier, no tools, no automatic retries,
   15-second deadline and 2,000 output tokens by default (maximum 4,000).
7. Release concurrency only. Retain request count and full spend reservation on success,
   error, malformed response, cancellation and timeout. Crashed leases expire after 60s.

Missing configuration, database failures or verification outages close the paid path.
The public settings route exposes only the Turnstile site key and uses `no-store`.
The challenge loads only after focus/input in the custom-question field; prepared answers
never load the challenge or call either assistant endpoint. Each submit needs a fresh token.

## Cost reservation

The existing 8,000-token context estimate uses bytes/2 and is not a hard tokenizer bound.
The protected path additionally checks the actual serialized instructions, input and output
schema against 28,000 UTF-8 bytes. It reserves 32,000 input tokens (including 4,000 tokens
of protocol allowance), plus the full configured output ceiling. Standard prices reviewed
on 2026-09-27: $0.75/M input and $4.50/M output. Cached discounts are not assumed.
Default reservation is **$0.033/request**; at 4,000 output tokens it is $0.042.
Thus the $1 budget currently permits at most 30 default-size reservations in a rolling day,
even though the separate site count ceiling is 100. Actual provider charges may be lower.
These are conservative application reservations, not the provider invoice or a guarantee
against future pricing changes. Review rates whenever model/pricing changes; keep this API
key dedicated to this application. Other applications using the key are outside this ledger.
Infrastructure charges (Cloudflare/database) are not included in the AI budget.

## Activation runbook

Initial production inspection on 2026-09-27 found no D1 binding or AI credentials.
For the user-authorized public release, the existing local OpenAI key and signing secret
have now been copied to protected Sites runtime secrets, with the $1/$10 budget and
`bakeagain.com` hostname. `ASSISTANT_ENABLED` remains false pending real Turnstile keys.

1. `.openai/hosting.json` now declares `d1: ASSISTANT_QUOTAS`. Sites provisions this
   logical binding during publication; do not create a separate Worker/account deployment.
2. `db/schema.ts` owns the schema. `npm run db:generate` generates Drizzle migrations.
   The Sites plugin includes `drizzle/` in the build, and Sites applies these migrations
   before uploading the Worker. The initial schema is `drizzle/0000_assistant_quotas.sql`.
   Keep published migrations immutable. The earlier standalone SQL was replaced before
   any production application, so there is only one migration source of truth.
3. Create a real Turnstile widget restricted to the intended hostname. Store
   `TURNSTILE_SITE_KEY`, secret `TURNSTILE_SECRET_KEY`, and `ASSISTANT_ALLOWED_HOSTNAME`
   in runtime settings. The hostname must exactly match the request URL and token result.
4. Set server-only `OPENAI_API_KEY`, random `ASSISTANT_SESSION_SECRET` (at least 32
   characters), `OPENAI_MODEL=gpt-5.4-mini`, output cap and desired daily/monthly budgets.
   Missing budget values default to $1/$10; explicit `0` stops paid requests. Never put
   credentials in client-prefixed environment variables or source control.
5. Deploy behind Cloudflare ingress, which owns `cf-connecting-ip`; do not expose the
   Worker through a proxy that accepts caller-supplied values for that header. Recipe
   and language publication gates still apply independently of these security controls.
6. Verify the deployed binding and migration, real challenge/hostname and rejection of
   missing/reused tokens before setting `ASSISTANT_ENABLED=true` for public use. Use a
   small controlled live request only when paid verification is authorized. Local tests
   below mock the provider and do not prove external account/credential readiness.

Changing budgets does not erase existing reservations. Keep the same database across
releases and Worker instances. Rotating the signing secret resets browser/network hashes
but preserves the global count and spend limits. Restore/reset of the ledger can reopen
budgets, so do not clear it as an ordinary retry action.

## Data and retention

No questions, answers, raw IP addresses or emails are stored in the quota database.
Session/network hashes are keyed with the signing secret. Verification attempts are pruned
after one minute. Reservation identities are cleared after 48 hours and spend rows after
35 days, lazily on later requests; an idle database retains records until the next cleanup.
Cloudflare receives the IP for verification; OpenAI receives a pseudonymous safety ID.
Privacy copy is updated in Ukrainian, English and Spanish.

## Verification

- Automated SQL tests use real SQLite, the checked-in migration and the actual atomic query.
  They cover independent store instances, simultaneous requests, cookie/network rotation,
  all rolling limits, both budgets, zero budgets, duplicate IDs, retention and store outage.
- Local Cloudflare Miniflare D1: migration and 30 competing reservations across two store
  instances passed; one reservation was admitted against a budget allowing only one.
- Provider/service tests verify that quota failure prevents any provider call and provider
  failure retains the reserved spend while releasing concurrency.
- Verification tests cover missing/oversized tokens, wrong hostname/action, replay/expiry
  rejection, malformed responses and outages. No paid AI calls are used.
- Browser results are recorded in `assistant-protection-audit/browser-results.json`.

## Official references

- [Cloudflare D1 statements and transactions](https://developers.cloudflare.com/d1/worker-api/d1-database/)
- [Turnstile server validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
- [Turnstile explicit rendering](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/)
- [Turnstile testing keys](https://developers.cloudflare.com/turnstile/troubleshooting/testing/)
- [GPT-5.4 mini standard pricing](https://developers.openai.com/api/docs/models/gpt-5.4-mini)
