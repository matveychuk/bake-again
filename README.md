# Bake Again

[Bake Again](https://bakeagain.com) is a gluten-free recipe website in Ukrainian,
English and Spanish. It includes recipe search, ingredient scaling, a shopping
list, saved recipes and step-by-step Cook Mode with timers. Personal cooking state
is stored locally in the browser.

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

| Path | Purpose |
| --- | --- |
| `app/` | Localized pages, API routes and the internal Design Lab |
| `components/` | Components used by the website and Design Lab |
| `content/` | Recipe content, translations, step help and provenance |
| `lib/` | Recipe behavior, local persistence, analytics, SEO and server-side AI |
| `design-system/` | Approved semantic tokens and component rules |
| `media/web-source/` | Source-quality assets needed to build the website |
| `public/` | Static favicon and generated delivery media |
| `db/`, `drizzle/` | Shared assistant quota schema and database migrations |
| `scripts/`, `evals/`, `.github/` | Build preparation, checks and release workflows |

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
npm run test:analytics
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

Production uses OpenAI Sites, identified by `.openai/hosting.json`. The build emits
a Worker-compatible bundle; do not deploy it to a separate Cloudflare Worker.
Sites provisions the `ASSISTANT_QUOTAS` D1 binding and applies the committed migrations.

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
