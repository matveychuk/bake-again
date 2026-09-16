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

A locale-specific recipe route is public only when both `publicationStatus` is
`ready` and `translationState[locale]` is `reviewed`. A draft route can remain
available for editorial preview, but it must be `noindex` and must not emit a
canonical URL or an `hreflang` alternate. A reviewed translation is not enough
to publish a recipe whose facts, provenance, or media approval remain draft.

The interface uses the same principle through `lib/i18n/publication.ts`.
Currently English is the reviewed UI locale; Spanish and Ukrainian UI routes are
preview-only until their complete dictionaries are reviewed. Changing either
gate is an editorial release decision, not a routing shortcut.

## Base and calculated configurations

The checked-in recipe is the immutable source of truth. `configuration.base` only points to its tested default geometry and yield; it never copies ingredient amounts. The exact base has status `Tested`. Any change to geometry or quantity has status and provenance `Calculated`, lives in `CalculatedRecipeConfiguration`, and references both `recipeId` and `recipeVersionId`. Calculated amounts must never be written back into `RecipeDraft`.

Configuration has two independent axes:

- geometry selects a baking pan, tray, mould, round template, or another recipe-appropriate format;
- quantity selects exactly one discriminated-union mode: `batchScale` or `useWhatIHave`.

Geometry may be combined with either quantity mode. With direct batch scaling, the area ratio and batch factor are multiplied. With `useWhatIHave`, the anchor amount fixes the final total factor; the geometry ratio is used to derive the effective batch factor, so the requested available amount remains exact.

Recipe-level capabilities are explicit. `geometryAdjustment: null` means the recipe only supports its base geometry. `useWhatIHave: null` means it has no safe anchor workflow. Crinkle Cookies is the deliberately simple example: it supports batch scaling but neither geometry adjustment nor `Use what I have`.

Schema version 2 uses `geometry` as the single canonical field; there is no parallel `forms` schema. Napoleon uses a `roundTemplate` with `application: "roll-and-trim"`: its 28 cm layers are rolled on parchment and trimmed against a lid or template, not baked in a pan.

## Ingredient scaling

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

## Media attached to steps

Photos and videos are defined once in the recipe-level `media` collection. A preparation step references one or more items using `mediaIds`. This allows the same asset to be reused without duplicating URLs or captions and keeps localized alternative text with the media record.

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
- Walnut or pecan pressed into the shaped ball is a tested optional variation.
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

Run `npm run typecheck` and `npm run validate:recipes`. The latter checks recipe references, anchor line IDs and units, optional capabilities, Napoleon geometry semantics, and the two calculated fixtures.
