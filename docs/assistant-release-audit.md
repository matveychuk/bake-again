# AI assistant — release audit, 2026-09-11

**Verdict: FAIL / NO-GO for an enabled assistant release.** Audit only; no deployment,
runtime configuration, publication status or audience changes were made.
Candidate: local changes on `f1a6d77e34cb8ae8dc8d0a1b6196520f95f9e23e`.

| Check | Result | Evidence / boundary |
| --- | --- | --- |
| 390 / 900 / 1440px | PASS | All three locales; Recipe and Cook Assistant. Long mixed-script and unbroken answer fixtures wrap. At 200% text, controls remain reachable by scrolling and keyboard. |
| Keyboard, focus, Escape | PASS | Tab / Shift+Tab containment, visible focus, submission, abort, exact trigger return; nested review closes first and returns focus inside the drawer. |
| Screen-reader announcements | PASS, structural | DOM/AX: labelled dialog/input, polite loading/answer/disabled announcements, one error alert. Actual VoiceOver/NVDA speech was not tested. |
| en / es / uk | PASS, assistant UI | Localized controls, prompts, lifecycle and fallback errors. Mocked responses and offline evals validate the locale contract; live model quality remains unverified. |
| Tested / Calculated / Suggested | PASS | Localized text plus check / calculator / lightbulb. Provenance tests prohibit inheritance of Tested by calculated or suggested changes. |
| Loading / error / retry / offline / disabled | PASS | Browser fixtures cover lifecycle, malformed responses, retry and cancellation. Real local API returns localized `503 ASSISTANT_DISABLED` with missing bindings. |
| Secrets | PASS, local candidate | Two non-secret build canaries; 123 client output files, HTML and HTTP response scan (261 checks); no credential matches or browser secret-binding references. Zero emitted source maps; guessed map/server/env URLs return 404. Production candidate has not been deployed. |
| Rate limit | PASS locally; FAIL public gate | Session concurrency, 5/minute and 30/day bounds pass; network bucket blocks the 21st request and recovers after its minute window. Combined-window Retry-After corrected. Shared atomic quota/cost accounting is absent. |
| Oversized input | FAIL stability gate | 2,001 characters → 400; 17,000-byte body → 413. Standalone chunked probes return 413, but the complete HTTP audit repeatedly gets Wrangler's plain-text `503 Your worker restarted mid-request` on a chunked request. No evidence supports calling this stable in production. |
| Production build | PASS | `npm run build`, typecheck, lint, foundation tests 26/26 and recipe validation pass. |
| Assistant tests / evals | PASS offline; live gate open | Assistant tests 135/135; eval suite 47 assertions, 45/45 cases, 36/36 critical safety cases. No live provider calls. |
| Post-deploy smoke question | FAIL | Current production is version 32, deployed 2026-09-08, before this assistant implementation. “Which flour mix was used in this exact recipe?” produced no answer. Existing owner-private boundary smoke passes: page/API return 401 without authentication. |

## Defects fixed

- Preserve visible Close focus on opening and while submit controls disappear/disable.
- Announce loading; avoid duplicate error announcements; localize browser/network/JSON errors.
- Restore focus inside the assistant after closing a consumed action's review dialog.
- Keep the composer reachable with 200% text using the existing drawer's compact layout.
- Return Retry-After for the longest exhausted session window, with a regression test.

The shared component source, Design Lab example, contract and design-system changelog
were updated. No features or dependencies were added.

## Remaining release gates

Runtime entries in Sites are empty. Keep the assistant disabled until runtime secrets,
shared atomic quota/budget enforcement, capped live multilingual/adversarial evals and
successful smoke of the actual deployed candidate are verified. Napoleon remains a
draft; Spanish/Ukrainian UI translations are also marked draft, so publication guards
must remain in force. The intermittent Wrangler 503 and actual screen-reader speech
need independent verification before release approval.

## Rollback

No rollback is needed now: production was unchanged. If a later candidate fails smoke:

1. Set `ASSISTANT_ENABLED=false` in Sites runtime configuration; apply it through the
   supported Sites deployment flow and verify the resulting API state.
2. Redeploy saved **version 32**, source
   `7dbb2bb5a2782f4bae36a081f615c155df75b548`, preserving the current owner-private
   audience. This restores the previous site prototype, not a working AI assistant.
   Saved version ID: `appgprj_6a9d9cca69608191a812b4e85b99f91e~appgver_f5d1180b77848191b5c14199bb108e3e`.
3. Wait for Sites deployment success, then run `npm run smoke:site` with the production
   URL and `SITE_ACCESS_MODE=owner-private`; verify page/API 401 and authenticated
   recipe/Cook Mode navigation. Do not use `wrangler deploy`.

Follow [the deployment runbook](deployment.md) for release authorization. Local audit
scripts and screenshots are in `/tmp/bake-release-audit` and `/tmp/bake-audit-*.mjs`.
