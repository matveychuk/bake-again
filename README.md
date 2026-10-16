# Bake Again

[Bake Again](https://bakeagain.com) is a gluten-free recipe website in Ukrainian,
English and Spanish. It includes recipe search, ingredient scaling, a shopping
list, saved recipes and step-by-step Cook Mode with timers. The account
implementation requires an account for personal saves; reading, scaling and
Cook Mode remain available without signing in. Guest drafts are temporary.

Recipe provenance is specific to each version: **Tested**, **Calculated** and
**Suggested** are distinct states. Prepared step questions return reviewed recipe
content without calling AI. Custom questions use a server-side assistant, guarded
by Turnstile, signed sessions, shared request quotas and spending limits.

## Run locally

Use Node.js 22.13.0 or newer.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

The assistant is disabled by default. Recipes, prepared answers and local personal
features work without paid API credentials. Never commit `.env.local` or real keys.

## Source layout

| Path                             | Purpose                                                                                |
| -------------------------------- | -------------------------------------------------------------------------------------- |
| `app/`                           | Localized pages, API routes and the internal Design Lab                                |
| `components/`                    | Components used by the website and Design Lab                                          |
| `content/`                       | Recipe content, translations, step help and provenance                                 |
| `lib/`                           | Recipe behavior, local persistence, analytics, SEO and server-side AI                  |
| `design-system/`                 | Approved semantic tokens and component rules                                           |
| `media/web-source/`              | Source-quality assets needed to build the website                                      |
| `public/`                        | Static favicon and generated delivery media                                            |
| `db/`, `drizzle/`                | Shared assistant quota schema and database migrations                                  |
| `lib/personal/`                  | Personal-data contracts, Supabase Auth, owner-scoped sync, D1 adapter and access tests |
| `scripts/`, `evals/`, `.github/` | Build preparation, checks and release workflows                                        |

Keep tests and their fixtures with the source. `step-help.review.json` is the
reviewed-content snapshot used by the step-help tests. The Design Lab at
`/design-system` demonstrates the production components.

Private service records, historical briefs, audit reports and creative working files
are kept outside Git. Recipe source references retain the original document labels
for provenance; these labels are not runtime file dependencies or public links.

## Media

Read [the media workflow](media/README.md) before adding images. Keep source-quality
assets in `media/web-source/` and reference their generated `.webp` URLs in code.
`npm run media:prepare` runs automatically before `dev` and `build`, generates only
referenced assets and enforces the 64 MiB delivery budget. Never copy source or camera
original directories into a deployment bundle.

## Checks

```sh
npm run typecheck
npm run lint
npm run test:foundation
npm run test:personal
npm run test:personal:d1
npm run test:analytics
npm run test:commerce
npm run test:newsletter
npm run test:seo
npm run test:assistant
npm run eval:assistant
node --test scripts/validate-production-config.test.mjs
npm run validate:recipes
npm run build
```

After starting the production build on port 3011, run `npm run test:release-render`.
CI performs this check automatically. Tests and assistant evals do not call the live
AI API. Check responsive behavior at 390, 900 and 1440 px after interface changes.

## Hosting and runtime configuration

### Shared multilingual links

Use `https://bakeagain.com/recipes/crepes` for the multilingual Instagram bio.
Use `https://bakeagain.com` for the full recipe catalogue; its `/recipes` alias
uses the same language negotiation.
This neutral entry (and its `/cook` variant) redirects to the same recipe in
the visitor's saved `ba_locale` language, otherwise the first supported browser
language by `Accept-Language` preference, otherwise Ukrainian. It uses a temporary
307 redirect with `Cache-Control: private, no-store` and `Vary: Cookie, Accept-Language`.
Explicit `/uk/`, `/es/` and `/en/` home and recipe URLs retain their requested language.
Query parameters are preserved. Browser language is only an initial preference;
the existing language switcher remains available and saves an explicit choice.
Other neutral entry points keep their existing behavior.

Run `node scripts/check-crepes-language-link.mjs` against a local production
server on port 3011, or set `LANGUAGE_CHECK_URL=https://bakeagain.com` for live
verification. The check reads pages only and does not call paid APIs or submit forms.

Social profile links appear only on Ukrainian pages. The existing Umami installation
records `social_profile_open` with `platform` (`instagram` or `facebook`), `placement`
(`header`, `follow` or `footer`) and `locale` (`uk`). The recorded page path identifies
Home, About or a recipe; query strings, hashes and destination URLs are not collected.
This measures profile-opening clicks, not confirmed follows. Left/keyboard and middle
clicks retain native navigation. Localhost, preview, internal routes and Do Not Track
remain excluded. Use the event breakdown by placement and platform to compare entry
points once the change is deployed; local QA must not populate production analytics.

Production uses OpenAI Sites, identified by `.openai/hosting.json`. The build emits
a Worker-compatible bundle; do not deploy it to a separate Cloudflare Worker.
Sites provisions the `ASSISTANT_QUOTAS` D1 binding and applies the committed migrations.

Round 2 foundation keeps the additive D1 personal migration and the AI quota tables
unchanged. The owner selected Supabase Free for new reader accounts and personal
data; its separate PostgreSQL migration is under `supabase/migrations/` and must
never be applied to Sites D1. `GET /api/personal/v1/record` is a server-only read
foundation: disabled without runtime configuration, or backed by Supabase when
`PERSONAL_BACKEND=supabase`, `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` are set.
The official SDK verifies the reader's bearer token with Auth; database RLS also
restricts reads to that owner. A publishable key is not a reader credential.
Reader sign-in, owner-scoped cloud writes and password recovery were enabled in
production on 2026-10-12. The dated handoff records SMTP delivery, two-account
isolation, two-browser sync and an actual backup/restore check. The UI has no guest
import or manual sync controls. Passwords require 8 characters without composition
rules. Account-data erasure does not delete Supabase Auth or newsletter records.
See [personal contracts and runtime](lib/personal/README.md) and the local operational
handoff at `docs/architecture/round-2-accounts.uk.md` (intentionally outside Git).

Configure server-only secrets in the Sites runtime:

- `OPENAI_API_KEY`
- `TURNSTILE_SECRET_KEY`
- `ASSISTANT_SESSION_SECRET` — at least 32 random characters

The non-secret settings and their defaults are listed in `.env.example`.
`TURNSTILE_SITE_KEY` is the browser-visible widget key; `ASSISTANT_ALLOWED_HOSTNAME`
must match the site's hostname. Enable AI only after real Turnstile credentials,
shared quotas and budget limits are configured. Builds do not need runtime secrets.

The manual `production-release.yml` workflow validates an exact `main` commit before
an owner-operated Sites deployment. Its GitHub `production` environment settings
are separate from the Sites runtime. GitHub Secrets do not automatically configure
the deployed website; the release workflow checks presence booleans only when its
assistant flag is enabled. Keep `PRODUCTION_URL` set to `https://bakeagain.com`.
After deploying, run `post-deploy-smoke.yml` with the actual audience (`public` for
the live site). The workflows do not publish automatically or change site access.

Repository cleanup does not remove files or author metadata from old Git commits.
Review and sanitize history separately before changing repository visibility.

## Optional recipe video lessons

[The commerce catalogue](content/commerce/README.md) connects an exact recipe version
to a Payhip product. The initial Napoleon lesson is `planned`, with no checkout URL
or price. `/design-system#video-lessons` shows inert UK/ES/EN planned/available examples.

Run `npm run test:commerce` for publication and checkout-link gates, and
`npm run media:audit` for a read-only website-source inventory. Unreferenced images
can still be editing dependencies; audit output never deletes them automatically.
