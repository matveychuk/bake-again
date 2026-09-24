# OpenAI Sites CI/CD

## Production path

Bake Again is an existing **OpenAI Site**, identified by the committed
`.openai/hosting.json` project ID. Vinext emits a Cloudflare Worker-compatible build,
but Cloudflare is the Sites runtime substrate, not a separately managed production
hosting account. Do not run `wrangler deploy` or create a direct Cloudflare Worker for
this repository unless a future decision explicitly changes the hosting provider.

Every OpenAI Sites deployment URL is production. This setup therefore separates an
untrusted PR build, a protected release authorization, the owner-operated Sites
deployment and a post-deploy smoke test. No workflow in this repository publishes the
Site automatically.

## Workflows

`pull-request.yml` runs on PRs targeting `main`, with read-only repository permission
and no OpenAI secret context. In order it runs locked installation, typecheck, lint,
foundation tests, no-live-API assistant tests, the critical eval gate, recipe
validation and the production build. The workflow uploads no artifacts and configures
no cache.

`production-release.yml` is manual. It rebuilds and revalidates the selected `main`
commit without runtime secrets. Only after that job succeeds does the
`authorize-sites-deploy` job enter the protected `production` environment. It checks
allowlisted variable values and secret **presence booleans**; secret values are never
passed to the runner. Secret presence is required only when `ASSISTANT_ENABLED=true`,
matching the runtime contract; a disabled-assistant release still validates the flag,
model, token limit and production URL. Approval authorizes only that exact commit for an owner-operated
Sites deployment.

`post-deploy-smoke.yml` is manually run after Sites reports that deployment complete.
For the current owner-private audience it verifies that both the Site and API remain
protected with HTTP 401. If the owner later separately authorizes public access, its
public mode verifies a healthy page plus the assistant API's stable 405 guard. Both
production workflows share the `openai-sites-production` concurrency group and never
cancel an in-progress production operation.

## GitHub production environment

The repository has an environment named `production` with a selected-branch policy
that permits only `main`. The current private-repository billing plan rejected GitHub's
required-reviewer and wait-timer rules, so `workflow_dispatch`, the `main` restriction
and the shared concurrency group are the enforceable protections today. If the plan is
upgraded, add a required reviewer and prevent self-review when another maintainer is
available. The environment contains these non-secret variables:

- `OPENAI_MODEL=gpt-5.4-mini`
- `ASSISTANT_ENABLED=false` until every assistant release gate is complete
- `ASSISTANT_MAX_OUTPUT_TOKENS=2000`
- `PRODUCTION_URL=https://bake-again-warm-precision.matveychuk-a.chatgpt.site`

Set `OPENAI_API_KEY` and `ASSISTANT_SESSION_SECRET` as environment **secrets**, never
as variables. The signing secret must contain at least 32 random characters. The
GitHub values are not exposed to PR jobs, build jobs, artifacts, caches or logs.

## One-time Sites runtime configuration

GitHub Actions does not currently have a documented OpenAI Sites CLI/API that can
provision runtime secrets or save/deploy a Site version. A GitHub Secret is available
to a protected runner only; it does not automatically become a Sites runtime binding.
Do not pass it through Vite, `wrangler`, a generated env file, an artifact, a cache,
workflow output or a shell command as a workaround.

Before the first assistant-capable deployment, the Site owner must use the supported
OpenAI Sites environment-variable control in ChatGPT/Codex or Site settings and enter:

- `OPENAI_API_KEY` as a secret;
- `ASSISTANT_SESSION_SECRET` as a secret;
- the same model, feature flag and token-limit values as the GitHub environment.

This is a one-time runtime-secret step, repeated only for rotation. Verify names and
redacted secret presence in Sites; never copy returned values into logs or source.
Keep `ASSISTANT_ENABLED=false` until the shared atomic quota/budget gate documented in
the assistant ADR is implemented. A later supported Sites GitHub integration may
replace this manual step, but must provision the runtime store directly before the
deployment and must never expose the key to the build.

## Release procedure

1. Merge only after the PR workflow succeeds.
2. Run `OpenAI Sites release gate` for the intended `main` commit.
3. Confirm that the `main`-only production environment job authorizes that commit. If
   reviewer protection becomes available, approve the waiting job.
4. With separate explicit publication permission, save and deploy that exact commit
   through OpenAI Sites. Do not change the Site audience as part of deployment.
5. After Sites reports success, run `OpenAI Sites post-deploy smoke` with the actual
   audience (`owner-private` today).

If any build, protection, runtime-variable, Sites deployment or smoke check fails,
stop the release. Do not fall back to direct Cloudflare deployment.

References: [OpenAI Sites lifecycle and production URLs](https://help.openai.com/en/articles/20001339),
[GitHub deployment environments](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments),
and [GitHub Actions secret isolation](https://docs.github.com/en/code-security/reference/secret-security/secret-types).
