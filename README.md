# Bake Again

Bake Again is a multilingual gluten-free baking product built around a small collection
of repeatedly tested home recipes.

The product promise is **Bake what you love. Know what works.** Its operating principle
is **Fewer recipes. More confidence.** Recipe completeness and honest adaptation-specific
provenance take priority over catalogue size.

`Bake Again` remains the working product name. The stable recipe IDs and content
architecture do not depend on the final naming decision.

## Current product status

The product foundation is implemented and locally healthy:

- Warm Precision / Review applied is the approved visual baseline.
- The repository, design system, multilingual architecture and recipe schema are in place.
- Home, recipe catalogue, Recipe Detail, basic Cook Mode, Save, local shopping list and
  supported deterministic scaling are implemented.
- The catalogue contains 17 stable recipe records.
- Crinkle Cookies and Gluten-Free Napoleon use the full multilingual `RecipeDraft` model.
- Six additional recipes preserve usable source transcriptions and are ready to migrate
  into the complete model; the remaining nine have incomplete source material.
- Missing facts remain explicit and cannot inherit Tested status.
- The contextual assistant and controlled actions are implemented behind a release flag.
- CI, production authorization and post-deploy smoke workflows are configured for
  OpenAI Sites.

No recipe is currently publication-ready. All recipe routes remain editorial previews,
and Spanish and Ukrainian UI copy remain under review. The assistant must remain disabled
until its separate release gates pass.

## Launch milestone

The next milestone is an owner-reviewed public MVP with:

- three complete launch recipes representing a simple recipe, a complex recipe and an
  everyday repeat-use recipe;
- an explicitly chosen language-release policy;
- Search and practical catalogue filters;
- the complete Save → Shopping list → Cook Mode → Baked → Private note journey;
- production-ready photography, structured SEO, privacy pages and basic analytics;
- the contextual assistant kept disabled unless its independent release track is complete.

Crinkle Cookies, Gluten-Free Napoleon and Crepes are the recommended first launch slice.
The exact set remains an owner decision and must not be published until every selected
recipe passes the publication readiness gate.

## Remaining work

### 1. Close launch decisions

- Confirm the first public recipe set and publication sequence.
- Decide whether English launches first or EN, ES and UK launch together.
- Confirm the product name, domain and wordmark before public release.
- Approve the photography system and the minimum original-media standard for launch.

### 2. Make the launch recipes publication-ready

For every selected recipe:

- complete quantities, flour details, yield, form, active time and elapsed time;
- finish the ordered method, checkpoints, practical guidance, storage and make-ahead copy;
- confirm the provenance of every public variation;
- select a finished-food image, verify media rights and complete descriptive alt text;
- review the Ukrainian source and the English and Spanish translations;
- resolve or explicitly approve every `contentGaps` entry;
- change `publicationStatus` and locale translation states only after owner review.

Known blockers for Crinkle Cookies are total elapsed time, powdered-sugar quantity,
storage, final media and translation review. Known blockers for Napoleon are total time,
the provisional milk quantity, the cultured-dairy choice, the 24 cm adaptation, storage,
final media and translation review.

### 3. Complete the core MVP journeys

- Add simple localized search and a small set of practical filters.
- Connect Home discovery entries to real filtered results.
- Add Mark as Baked, Recently viewed and one local private note per baked recipe.
- Persist the active Cook Mode step and supported recipe configuration.
- Add Cook Mode completion and screen wake lock where supported.
- Make the ingredient and shopping-list flow available in every launch locale.
- Add print and share support.
- Add localized About and Privacy pages and replace the Design System footer link on
  public product pages.

### 4. Finish SEO, measurement and acquisition

- Add Recipe structured data and a production sitemap/robots policy.
- Verify localized canonical URLs, hreflang, metadata and OpenGraph assets after the
  publication gates open.
- Add privacy-conscious analytics for recipe visits, successful search, saves, shopping
  use, Cook Mode completion and return visits.
- Prepare the initial Instagram recipe assets and direct every post to its canonical
  localized recipe page.

### 5. Verify product quality and release

- Test the complete product at 390 px, 900 px and 1440 px in every launch locale.
- Verify long Ukrainian, Spanish and English copy, 200% text zoom, keyboard navigation,
  screen-reader output, focus order and AA contrast.
- Add end-to-end coverage for Search → Recipe → Save → Shopping → Cook → Baked → Note.
- Verify print output, image delivery, performance and Core Web Vitals.
- Run the protected release workflow, deploy the exact authorized commit through Sites
  and complete the post-deploy smoke test before changing the audience.

### 6. Complete the assistant release track separately

The assistant is not a blocker for the recipe MVP. Keep `ASSISTANT_ENABLED=false` until:

- Sites runtime secrets are configured;
- shared atomic quota and budget enforcement is implemented;
- capped live multilingual and adversarial evaluations pass;
- the intermittent Wrangler chunked-request restart is resolved or independently cleared;
- actual screen-reader speech is verified;
- the deployed candidate passes its post-deploy smoke question.

See [the current assistant release audit](docs/assistant-release-audit.md) for evidence and
the exact remaining gates.

## Deliberately deferred

Do not add these before launch evidence justifies them:

- accounts, authentication and cloud synchronization;
- custom collections and household sharing;
- ratings, comments or community recipes;
- universal form conversion or arbitrary substitution;
- newsletter, affiliate, subscription or premium systems;
- native applications, voice interaction or nutrition/wellness positioning.

## Repository structure

Owner reference: [Довідник сервісів і доступів — домен, хостинг, аналітика та продовження](docs/services-register.uk.md).

```text
content/recipes/       Structured multilingual recipe content
design-system/         Approved tokens, components, patterns and change history
docs/content-model/    Recipe schema decisions and authoring workflow
docs/reference/        Historical briefs, research and recipe inventory
media/web-source/      Source-quality media retained in GitHub; build input only
media/recipes/         Camera originals and working recipe media; never deployed
public/                Generated WebP/video delivery assets plus static files
```

The initial collection remains repository-authored; no CMS or database is required.
Production is hosted through OpenAI Sites. Read [the deployment runbook](docs/deployment.md)
before changing runtime configuration or preparing a release.

## Validation

Run the same core checks used by CI:

```sh
npm run typecheck
npm run lint
npm run test:foundation
npm run test:assistant
npm run eval:assistant
npm run validate:recipes
npm run build
```

Reference strategy and specifications:

- [Future newsletter, recipe-digest and baking-techniques strategy (Ukrainian)](docs/strategy/newsletter-after-backend.uk.md)

- [Brand strategy v2](docs/reference/Gluten-Free_Baking_Brand_Strategy_v2.docx)
- [Product and Engineering Brief v1](<docs/reference/Gluten-Free Baking — Product & Engineering Brief v1.md>)
- [UX and Information Architecture Specification v1](docs/reference/UX-IA-Specification-v1.md)
- [Recipe content model](docs/content-model/README.md)

## Basic analytics

Umami Cloud tracks production pageviews and key recipe actions. See
[the analytics event reference](docs/analytics.md) for coverage, privacy and verification.
Run `npm run test:analytics` to check the payload boundary.
