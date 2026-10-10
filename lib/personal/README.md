# Personal foundation — phase A

Status: Supabase Auth/read adapter implemented locally; PostgreSQL migration applied
to the owner's Supabase project on 2026-10-09 with explicit approval. Hosted schema,
RLS/grants/history and anonymous Data API denial verified; no site deployment.
On 2026-10-09 the owner selected Supabase Free for reader
accounts (Auth) and personal data (Postgres). The application stays disabled without
explicit runtime configuration. Real reader signup/login/logout, account
provisioning, browser sessions and cloud writes are not implemented. Google/email
method configuration and Brevo SMTP remain separate integration work. See the local
architecture handoff for the exact hosted migration and verification status.

## Boundaries

- `contracts.ts` and `validation.ts`: version 1 payloads and deterministic record keys.
- `server/identity.ts`: verified identity port; no browser OAuth/session flow.
- `server/supabase.ts`: official SDK `getUser(token)` plus a per-request repository
  using the same user token. No admin key, cookie fallback or email-based linking.
- `server/supabase-config.ts`: explicit provider switch, hosted project URL and
  publishable key validation; rejects secret/service-role keys and arbitrary URLs.
- `server/repository.ts`: hosting-independent reads; D1 and Supabase adapters share
  `record-row.ts` for strict persisted payload validation.
- `server/runtime.ts`: the only personal-domain dependency on Cloudflare bindings.
- `server/http.ts`: account resolution, strict query validation, generic errors and
  `Cache-Control: private, no-store` on every response. No CORS permission.
- `app/api/personal/v1/record/route.ts`: force-dynamic GET; disabled unless the
  provider is configured. Mutation methods return 405. No automatic provisioning.

Internal account IDs are application-generated UUIDs. A verified `(issuer, subject)`
maps to an account; issuer includes the provider project/tenant/Site namespace.
An email match cannot establish ownership or link accounts. AI session IDs and
marketing/purchase identities are separate. D1 has no row-level security: all reads
must use the account-scoped repository after authentication. Do not expose raw SQL.

## Data and API v1

`GET /api/personal/v1/record?kind=<kind>&key=<URL-encoded key>` reads one owned
record. It accepts only `kind` and `key`, once each; no caller-supplied account ID.
Missing and foreign records both return 404. Responses contain `schemaVersion`,
`requestId`, `ok` and either `record` or `{error:{code,retryable}}`.

| Kind            | Payload                                                                      | Stable key                                    |
| --------------- | ---------------------------------------------------------------------------- | --------------------------------------------- |
| `saved-recipe`  | Stable recipe ID                                                             | Recipe ID                                     |
| `shopping-item` | Existing base shopping quantities and sources, including configuration/batch | Existing item ID                              |
| `recipe-note`   | Recipe ID, version, configuration, text (2,000 chars)                        | Canonical JSON tuple from `personalRecordKey` |
| `bake-record`   | Existing `BakeRecordV1` for that exact version/configuration                 | Same tuple; kind distinguishes note from bake |
| `collection`    | ID, name (120 chars), up to 200 distinct recipe IDs                          | Collection ID                                 |

Each live payload is at most 32 KiB UTF-8; keys at most 1,024 characters. Shopping
sources are bounded to 100 per item. Exceeding limits must be reported during C's
import, never silently truncated. Unknown fields are rejected. User-entered free
text is private plain text, never HTML. Existing browser parsers/keys stay unchanged.
Stored historic versions are readable; C must check allowed recipe/configuration
references before new writes without relabelling old versions.

`schemaVersion` versions the payload/API, while `revision` is a monotonically
increasing **per-record** server integer. API timestamps are UTC ISO strings; new
SQL tables use Unix milliseconds. Existing AI tables still use seconds.
Tombstones retain kind/key/revision/time and have `payload=null`; no previous private
text survives in the tombstone. There is no automatic tombstone collection in A.
Recipe provenance is never a personal payload field. Finishing a bake does not
change the published recipe's Tested/Calculated/Suggested state.

Errors: 400 `INVALID_REQUEST`; 401 `AUTH_REQUIRED`; 403 `ACCOUNT_UNAVAILABLE`;
404 `NOT_FOUND`; 405 `METHOD_NOT_ALLOWED`; 503 `PERSONAL_FEATURES_DISABLED` or
`SERVICE_UNAVAILABLE`. Only the latter is marked retryable in the read foundation.
Raw SQL/provider messages, email, identity and note text must never enter logs or
analytics. With no provider configuration the route returns 503 even with supplied
auth headers. When configured, missing, malformed or rejected bearer tokens return
401; a verified user without an active linked application account receives 403.
Auth verification requires a confirmed email and rejects anonymous Auth users.

## Local Supabase configuration

Store only these runtime bindings in ignored `.env.local`:

```dotenv
PERSONAL_BACKEND=supabase
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_<public-key>
```

No `NEXT_PUBLIC_*` configuration or reader client is added in this foundation.
Builds do not embed the project key. To test the built local Worker explicitly:

```sh
npm run build
npm run start -- --local --port 3018 --env-file "$PWD/.env.local"
```

The same runtime values must be configured separately on any future host. Do not
enable production account flows before phase C's verification. A forged JWT test
against real Auth proves rejection/connectivity, not successful login or delivery.

## Phase C contract, not implemented behavior

`PersonalMutationV1` reserves `operationId`, `expectedRevision`, and put/delete data.
It is a type contract, not an enabled write API. Before writes, implement and test:

1. A selected authenticator with real two-account login/logout, session validation,
   namespace, token/cookie behavior, and cross-origin/CSRF checks for mutations.
2. Account provisioning, verified identity linking, recovery, deletion/revocation.
3. Atomic expected-revision comparison plus account-scoped replay receipts in one
   transaction; expectedRevision=0 only creates absent records, not tombstones.
   A repeated operation with identical content returns the prior result; a reused
   operation ID with different content returns `OPERATION_REUSED`. No blind upsert.
4. `REVISION_CONFLICT` handling without overwriting notes or adding shopping totals
   twice; no client timestamp wins. Deletion must not be undone by stale offline work.
5. Bounded account storage, rate limits, lists/change enumeration, revision cursor
   policy and replay/tombstone retention. A record revision is not a sync cursor.
6. Voluntary browser import with a persisted receipt, source-account isolation and
   logout cache clearing; export/deletion flows and recovery tests.

No marketing consent, payment, household, invitation or newsletter tables are
created. Those domains need their own authorization and lifecycle; a purchase or
account registration is not consent. UI synchronization, collections screens,
two-browser convergence and household access belong to C/D, not this foundation.

## Migrations and portability

`0000_assistant_quotas` is unchanged. `0001_personal_foundation` adds three tables,
foreign keys/cascades and constraints. Both use the existing `ASSISTANT_QUOTAS`
binding because it is the verified Sites binding. Account deletion never touches
the two assistant tables. A code rollback leaves added tables/data in place;
never down-migrate by dropping them. Applied migration history is immutable.

`supabase/migrations/20261009183000_personal_foundation.sql` creates the same three
personal tables in Postgres with native UUIDs, RLS and SELECT-only reader grants.
The private `SECURITY DEFINER` helper has an empty search path, no arguments and
no dynamic SQL. It resolves only verified gateway `auth.uid()` / issuer claims
against active mappings/accounts; it is not a public Data API RPC. All anonymous
access and authenticated writes are revoked. No signup trigger creates accounts.

Use the Supabase migration CLI when credentials are available. For an empty project
configured through SQL Editor, `node scripts/personal-supabase-migration.mjs`
generates `outputs/personal/supabase-apply.sql`: the exact migration plus its version
in `supabase_migrations.schema_migrations`, within the same transaction. Review the
target and existing tables first; run once. A duplicate application fails rather
than silently adopting unknown objects. The generated file's hash identifies the
source SQL; do not edit an applied migration. Schema history is not exposed to
reader roles. No SQL export of actual reader data is included here.

`npm run test:personal` exercises SQLite access/upgrade and actual PostgreSQL
policies/grants/constraints in PGlite, including a physical local database restore.
JWT gateway claims and Supabase HTTP responses in those tests are synthetic;
they do not substitute for real two-account Auth tests or a hosted backup.
`npm run test:personal:d1` applies both
fresh and upgrade paths through real local Wrangler/D1 in disposable directories,
checks migration replay, and verifies quota rows/indexes survive. It never uses
`--remote` or the production Sites database. For an existing preview, back up first,
inspect applied state and apply only pending SQL as prescribed by Sites; do not
blindly rerun CREATE TABLE statements.

Keeping `bakeagain.com` and these IDs/contracts allows the runtime and identity
adapters to change independently. A hosting move can retain the same Supabase
project, so reader data need not move. D1 SQL can move to an owner-controlled D1;
the separate PostgreSQL adapter/migration now implements the same read contract.
Export _access_ to the
managed Sites D1, real backups and restore rights remain externally unverified.
The in-memory fixture restore test is not a production backup or a working admin
export endpoint. Do not collect live personal data until an operational backup /
export and verified auth path are available.

## Phase C implementation (2026-10-10; local testing activated)

The earlier sections describe the deployed A foundation. Phase C now adds a separate
`20261009220000_personal_sync.sql`, strict owner-scoped transactional RPC, runtime config
and POST sync routes, a PKCE client, account storage bridge, durable per-tab retry queue,
explicit conflicts, collections, export and scoped erasure. The original import RPC
remains for compatibility, but guest persistence/import is no longer exposed by UI.
The A payload/mutation contracts and applied A SQL remain unchanged.

The C migration and private PostgreSQL gate were applied with owner authorization.
Local `PERSONAL_SYNC_ENABLED` and `PERSONAL_AUTH_READY` are on; custom Brevo SMTP
delivery is verified. A real signed-in bookmark was read in a second tab. Guest
bookmark/shopping/note actions open an in-place sign-in gate and retain the current
selection/draft. Old guest records are neither read nor imported. Full pending-action
login and two-user acceptance remain distinct outstanding checks. Production Sites
has not been updated. Password minimum is 8 in both UI and Supabase, without
composition requirements. Do not confuse unit tests with live integration evidence.

Read `docs/architecture/round-2-accounts.uk.md` for exact limits, session-storage scope,
conflict and retention rules, erasure exclusions (Auth user and newsletter remain),
rollout/rollback steps and evidence. Cook steps/timers stay device-local; account cache
clear on sign-out only after pending writes are flushed; failure stops sign-out.
Existing AI quota tables and rules are unchanged.
