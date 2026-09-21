# Recipe content model

This is the working content contract for the first approximately 20 Bake Again recipes. Recipes stay as typed files in the repository; a CMS or database is not needed at this stage.

For the end-to-end authoring workflow, including source transcription, quantity
equivalents, scaling anchors, canonical steps, `cookIngredients`, `cookInstructions`,
`cookGroup`, translations and acceptance checks, use the Ukrainian
[recipe adaptation guide](./recipe-adaptation-guide.uk.md).

## Files

```text
content/recipes/
  recipe.types.ts
  source-recipe.types.ts
  registry.ts
  crinkle-cookies.recipe.ts
  gluten-free-napoleon.recipe.ts
  apple-charlotte.recipe.ts
  cottage-cheese-waffles.recipe.ts
  carrot-cake.recipe.ts
  sponge-cake.recipe.ts
  crepes.recipe.ts
  fruit-sponge-roll.recipe.ts
  <other-recipe>.recipe.ts
media/recipes/
  <recipe-id>/original/
  <recipe-id>/selected/
```

Each recipe is one entity with localized `en`, `es`, and `uk` content. Shared facts—quantities, oven settings, yields, times, flour configurations, evidence and provenance—are stored once. Translations contain only reader-facing text.

## Catalogue localisation

Every recipe in the inventory has its own source file. While a source-backed draft is
being migrated to `RecipeDraft`, `catalog-locales.ts` supplies discovery copy (title,
category, concise summary and image alternative text) for EN, ES and UK. It must not
supply ingredient quantities, timing, method or provenance that the source has not
confirmed. Full recipe pages become locale-publishable only after their own `RecipeDraft`
translation state is reviewed.

## Source-recipe migration

Every recipe in the current inventory now has its own `*.recipe.ts` file. Recipes with
complete workbook transcriptions preserve the ingredient list and method. Recipes whose
original text is missing carry only a clearly labelled `draft` placeholder or an external
reference; those details must never be presented as the author's tested recipe.

`registry.ts` is the one content entry point for recipe pages and Cook Mode. It imports
every individual recipe file and provides a common reader-facing shape while recipes
are progressively migrated from `RecipeSourceDraft` to the complete multilingual
`RecipeDraft` model. There is no parallel structured-inventory file or fallback copy
of recipe steps and ingredients.

Source-backed pages may also provide structured `yield`, `geometry` and `timing` facts in
`RecipeSourceDraftContent`. These facts carry canonical quantities and durations in the
source record, while each reviewed locale supplies reader-facing labels. The registry
merges localized labels with canonical numeric values before rendering; `beforeStart` is
reserved for practical planning guidance such as allowing time for a batter to rest.
Crepes currently use a 28 cm round pan, yield 10 crepes, take 40 minutes of active time
and 60 minutes elapsed, with a 15–20 minute batter-rest phase linked to the `rest` step.

## Publication gate

Every canonical recipe source has an explicit `publicationStatus`: `published` or
`unpublished`. The public catalogue, search, featured links and recipe routes use
`published` records. Existing records were migrated to `unpublished`; publishing is
an explicit owner decision after recipe review, independent of bake-test evidence.

The Drafts navigation and catalogue are available only when both the runtime is
in development mode and the request host is localhost, 127.0.0.1 or ::1. Unpublished
recipe and Cook Mode routes return 404 elsewhere, including production on localhost.
Drafts remain noindex. Change the field in the recipe's `.recipe.ts` source to publish.

Translation review remains a separate indexing and assistant-release gate through
`lib/i18n/publication.ts`: only a published detailed recipe with a reviewed locale emits
canonical and language-alternate metadata. Reviewed translations alone never publish
an unpublished recipe. Publication never upgrades adaptation evidence to Tested.

## Base and calculated configurations

The checked-in recipe is the immutable source of truth. `configuration.base` only points to its tested default geometry and yield; it never copies ingredient amounts. The exact base has status `Tested`. Any change to geometry or quantity has status and provenance `Calculated`, lives in `CalculatedRecipeConfiguration`, and references both `recipeId` and `recipeVersionId`. Calculated amounts must never be written back into `RecipeDraft`.

Configuration has two independent axes:

- geometry selects a baking pan, tray, mould, round template, or another recipe-appropriate format;
- quantity selects exactly one discriminated-union mode: `batchScale` or `useWhatIHave`.

Geometry may be combined with either quantity mode. With direct batch scaling, the area ratio and batch factor are multiplied. With `useWhatIHave`, the anchor amount fixes the final total factor; the geometry ratio is used to derive the effective batch factor, so the requested available amount remains exact.

Recipe-level capabilities are explicit. `geometryAdjustment: null` means the recipe only supports its base geometry. `useWhatIHave: null` means it has no safe anchor workflow. Crinkle Cookies is the deliberately simple example: it supports batch scaling but neither geometry adjustment nor `Use what I have`.

Schema version 2 uses `geometry` as the single canonical field; there is no parallel `forms` schema. Napoleon uses a `roundTemplate` with `application: "roll-and-trim"`: its 28 cm layers are rolled on parchment and trimmed against a lid or template, not baked in a pan.

## Ingredient scaling

### Gram-first spoon conversions

`content/recipes/spoon-weights.ts` is the only conversion table for the recurring dry
ingredients measured by spoon. A managed ingredient always stores grams in
`quantity.base`; `quantity.equivalent` is the teaspoon or tablespoon cooking aid and is
excluded from shopping and aggregation. Use `quantityFromSpoons` when the source was
written in spoons and `quantityFromGrams` when the source was written in grams. Both
factories produce the same gram-first model.

Author measurements supersede generic density references for this recipe collection.
The current author-measured entries are Schär Mix B Bread at 20 g/tbsp, tapioca starch
at 15 g/tbsp, baking powder at 5 g/tsp and granulated sugar at 20 g/tbsp. Reference
entries remain explicitly labelled in the table until they are measured by the author.
Do not convert unresolved alternatives such as “sugar or honey” or “baking powder or
baking soda”: their densities differ. Keep the source spoon amount as an equivalent,
leave `base` null and use `shopping.mode: "nameOnly"` until the ingredient is resolved.

Cup measures are not inferred from the tablespoon measurements. In particular, the
unconfirmed 1.5-cup Schär Mix B amount in the banana-fritter source remains a secondary
source measure with no canonical gram amount.

`configuration.ingredientScaling.default` supplies the recipe default, while `IngredientLine.scaling` handles exceptions:

- `linear`: multiply and optionally round to a precision increment;
- `discrete`: enforce units such as whole eggs or 8 g packets; `rounding: "manual"` creates a blocking warning when the result is fractional;
- `range`: scale both bounds, preserving an as-needed range such as water;
- `fixed`: retain an amount such as a pinch of salt;
- `manual`: do not invent a scaled amount, for example decoration adjusted after assembly.

`scalingAnchors` belongs to the recipe and references ingredient-line IDs. It means “safe to derive the recipe scale from this measured amount”, not “most important ingredient”. Napoleon currently permits only `schar-mix-b` in grams.

The calculator emits structured warnings for fractional discrete ingredients, manual adjustments and unverified geometry timing. Any blocking warning makes `cookMode.eligible` false. This prevents a calculated preview from inheriting the tested status or silently entering Cook Mode.

### Runtime examples

`configuration.examples.ts` contains executable fixtures:

```ts
calculateRecipeConfiguration(recipe, 'round-24cm-preview', {
  mode: 'batchScale',
  factor: 0.5,
});

calculateRecipeConfiguration(recipe, 'round-28cm-6-layers-each', {
  mode: 'useWhatIHave',
  anchorIngredientLineId: 'schar-mix-b',
  availableAmount: { value: 200, unit: 'g' },
});
```

The first combines the 24/28 area ratio with 0.5×. The second derives a total factor of 200/450 while preserving exactly 200 g of the anchor flour mix. Both are `Calculated`; both currently remain outside Cook Mode because they create fractional egg units and manual decoration work, and the 24 cm geometry also has unverified timing.

## Evidence states

- `repeatedlyVerified`: repeatedly tested by the author and treated as the trusted recipe baseline.
- `tested`: tried successfully, but not yet part of the repeatedly verified baseline.
- `calculated`: derived arithmetically from source-supported values.
- `authorGuidance`: supplied by the author but still provisional or awaiting final confirmation.
- `suggested`: an editorial or AI suggestion; it must never be presented as tested.
- `missing`: required information is not yet available.

Every important claim can carry its own evidence state and provenance. Missing values remain `null` and are also listed in `contentGaps`; they must not be guessed.

## Recipe overview projection

Every recipe returned by `registry.ts` includes the same reader-facing `overview` shape:
difficulty, active and total time, optional planning note, yield label and flour summary. Detailed recipes derive
it from their canonical recipe fields. Source-backed recipes combine their structured
timing and yield with the inventory's recorded difficulty and localized flour summary.
Unknown values remain `null` and render as an explicit value to confirm.

This projection is the only input for overview UI and catalogue timing. Geometry and
equipment remain available to setup, scaling and method surfaces but are deliberately
excluded from the overview.

Both recipe models accept an optional `timing.planningNote` with `text` and an optional
`phaseId`. Detailed recipes store text in all three locales; source drafts keep it with
their translated timing copy. A `{duration}` placeholder is resolved from the canonical
phase by ID, so a chilling-time correction reaches every language without a second
numeric field. Notes without a duration can express serving guidance such as “Best the
next day”. Missing notes normalize to `null`; no waiting time or total is inferred.
The hero prioritizes active work and shows total time plus planning guidance below it.

## Reusable cream choices

Creams are canonical recipe records with their own ingredients, method and evidence.
Whether a cream is suitable for an éclair, cake or another finished dish is a property of
that host recipe, not of the cream. A host may define `creamOptions.recipeIds` and exactly
one `creamOptions.recommendedRecipeId`; the recommended ID must also appear in the option
list. Cream records do not repeat backlinks or acquire a second compatibility status.

The registry preserves these stable IDs across locales. Validation rejects duplicate or
unknown cream IDs and a recommendation outside the host recipe's compatible list. The UI
may therefore render one recommendation alongside the other confirmed choices without
changing the cream's own Tested status.

## Media attached to steps

Photos and videos are defined once in the recipe-level `media` collection. A preparation step references one or more items using `mediaIds`. This allows the same asset to be reused without duplicating URLs or captions and keeps localized alternative text with the media record.

Detailed recipe steps may also provide a short localized `title` separately from the full `instruction`. Recipe Detail and Cook Mode use the concise title as the heading and retain the complete instruction as the action copy. When `title` is omitted, the instruction remains the fallback heading for older records.

Example:

```ts
media: [
  {
    id: "crinkle-shape-center",
    type: "image",
    path: "/media/recipes/crinkle-cookies/selected/shape-center.webp",
    usage: ["step"],
    alt: {
      en: "A nut pressed into the center of a shaped cookie",
      es: "Una nuez presionada en el centro de una galleta formada",
      uk: "Горіх, втиснутий у центр сформованого печива",
    },
  },
],
steps: [{ id: "shape", mediaIds: ["crinkle-shape-center"] }],
```

Video-specific details such as poster image, duration and transcript can be added only when real video assets exist. They are intentionally not mandatory fields now.

## Current author updates captured

### Crinkle Cookies

- Yield: 20 cookies.
- Active time: 40 minutes.
- Oven: conventional top-and-bottom heat at 180 °C.
- Orange zest is added at the end of mixing.
- Butter is softened before mixing.
- The powdered-sugar coating uses 100 g.
- Chilled dough remains very sticky: scoop it with a spoon, shape it with minimal hand contact and coat it immediately so the butter does not warm and melt.
- Walnut or pecan pressed into the shaped ball is a tested optional variation.
- The cookies may cool on the baking sheet or be transferred immediately; either method works.
- Reported total time is 3.5 hours, but remains unresolved because it conflicts with the currently recorded chilling, active and baking times.

### Gluten-Free Napoleon

- Yield: two cakes, six layers per cake.
- Active time: 60 minutes.
- Reported total time: 4 hours; it remains unresolved because the source also specifies longer maturation.
- Oven mode: conventional top-and-bottom heat.
- Oil: sunflower oil.
- Vanilla sugar sachet: 8 g; 2–3 sachets calculate to 16–24 g.
- Milk is temporarily recorded as 2.5 L with `authorGuidance` status and must be confirmed.
- The exact cultured dairy ingredient remains unresolved because the source allows sour cream or thick natural yogurt.

## Missing-content checklist

Before either recipe is publishable:

- Resolve every `contentGaps` entry or explicitly approve it as optional.
- Confirm the cookie total-time calculation.
- Confirm the final Napoleon milk quantity and total time.
- Choose the canonical Napoleon cultured dairy ingredient, or model the alternative as a tested option if both have been tested.
- Review all English and Spanish wording against the Ukrainian source meaning.
- Add final photos, step media and accessibility text only after the assets are selected.
- Record a source ID and evidence state for every later factual change.

## Authoring workflow

1. Edit the Ukrainian source wording and shared factual fields first.
2. Mark every new or changed fact with its evidence state and source ID.
3. Keep unknown data as `null`; add a clear `contentGaps` item.
4. Update English and Spanish translations without duplicating shared measurements.
5. Run TypeScript validation plus the recipe validation checks.
6. Review the rendered recipe page on phone and desktop.
7. Change publication status only after the author confirms the recipe-specific checklist.

## Validation recommendations

Keep validation lightweight and repository-based:

- TypeScript for field shape and allowed values.
- A small validation script for unique IDs, complete locales, valid media references, valid provenance references, non-negative quantities and required publication fields.
- Automated checks in GitHub Actions on every proposed change.
- A pull-request checklist for author confirmation, translation review, allergen review, media rights and final visual review.

The initial model deliberately avoids separate tables for ingredients, units, appliances, evidence records or translations. Those abstractions would add maintenance work without helping a collection of roughly 20 recipes. Introduce them later only when repeated real content shows a clear need.

## Reader-facing collections

`content/recipes/collections.ts` defines stable, localized collection IDs. The inventory
stores `collectionIds` for every recipe, while `category` continues to describe the dish
type. A recipe may belong to several collections. Collections are navigation aids and do
not express recipe evidence, testing status or an adaptation claim.

Run `npm run typecheck` and `npm run validate:recipes`. The latter checks recipe references, anchor line IDs and units, optional capabilities, Napoleon geometry semantics, and the two calculated fixtures.
