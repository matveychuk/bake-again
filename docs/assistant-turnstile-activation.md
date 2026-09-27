# Turnstile activation — 2026-09-27

The owner signed in to Cloudflare. Created the **Bake Again AI assistant** widget
for `bakeagain.com`, Managed mode, with pre-clearance disabled. Saved the site key
and server-only secret in Sites runtime settings, then enabled `ASSISTANT_ENABLED`.
No key is stored in source or this report. The temporary private transfer file was
removed immediately after the runtime update.

Version 35 was redeployed with runtime revision 3. The real browser challenge completed
successfully, and the protected route reserved budget and reached `gpt-5.4-mini`.
The first test question asked how much milk to keep cold. The model selected the
correct recipe evidence but redundantly repeated `600–650 ml` in generated prose;
our numeric-prose guard rejected the answer. One bounded diagnostic call reproduced
that exact behavior. The recipe evidence itself was correct.

The follow-up fix discards a redundant numeric explanation only when:

- It cites existing evidence blocks already selected in the same answer.
- Every numeric token appears in those exact source facts.
- Removing the numeric tokens leaves prose that passes all other existing checks.
- It is an explanation, not a suggestion, and there is no proposed action.

Only the canonical evidence text is then returned. Unmatched numbers, unknown or
unselected references, status claims and numeric suggestions still fail closed.
Eight regression cases cover recovery in UK/EN/ES and those rejection paths. The
assistant suite (167 tests), critical evals (47), typecheck and lint pass locally.
The shared quotas, Turnstile validation, price reservations and timeouts are unchanged.
