# Prepared step help — implementation and verification

Date: 2026-09-27. Scope: all 27 canonical recipe documents, including linked creams,
glaze, and unpublished recipes. This is an editorial source review, not new bake testing.

## Content

The complete [decision register and multilingual answers](questions-and-answers.md)
contains all 165 steps: 120 with help, 45 deliberately without, 128 question/answer
pairs (384 localized pairs). Questions are individually authored against a recipe/step,
not generated from keywords at runtime. No three-question quota is imposed.

`content/recipes/step-help.catalog.ts` records explicit decisions, reasons, localized
questions, and answer evidence. Answers either use the exact reviewed step field or
an authored short explanation supported by that field. No unsupported rescue methods,
ingredient replacements, new temperatures, or baking durations were introduced.
The apple-meringue pie's unknown meringue sugar and unverified baking time stay explicit.

Definitions attach to canonical steps in `getRecipeContent`. Composition carries them
with the selected cream; fixed components are separately checked in their host context.
`resolveStepHelp` reads the displayed step AFTER scaling, including milk reserved for
Napoleon custard and butter in plum cake. It does not calculate or scale times.
`step-help.review.json` locks all reviewed source text, versions, decisions and localized
answers. A changed source fails the audit test and requires re-review of affected pairs.

## Interaction

The existing assistant drawer displays prepared answers with no network or model call,
no evidence badge and no proposed action. All 27 recipes use the same UI in Recipe Detail
and available Cook Mode. Steps without questions have no local trigger. Recipe publication
and Cook Mode eligibility are preserved.

Typed chat retains the existing Napoleon-only rollout; no unsupported source recipe is
sent to the live context builder. A separately labelled entry allows typed questions
on simple Napoleon Cook steps. Prepared exchanges enter the bounded conversation history
for a subsequent typed question. Switching steps/opening a new session clears history;
configuration changes remount the drawer. Live AI failure does not remove prepared help.
Generic recipe/flour/step prompt buttons that sent an immediate model request were removed.

## Verification

- Source coverage, languages and change detection for every canonical step.
- Configured answers at 0.5×, 1.5× and 2× in all three languages.
- Every supported host/cream combination, namespaced step identity and grouped steps.
- No network access for prepared exchanges; unbadged answers and follow-up history.
- Foundation, assistant and deterministic eval suites; typecheck, lint, recipe validation
  and production build. Browser evidence is recorded separately after the UI checks.

No live model quality evaluation or deployment is part of this change.

Completed results: [verification](verification.md), including 341 passing suite tests,
all nine language/width combinations, typed-follow-up payload interception, and zero
live model calls. Prepared answer screenshots and browser results accompany the report.
