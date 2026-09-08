# Recipe content model

This is the working content contract for the first approximately 20 Bake Again recipes. Recipes stay as typed files in the repository; a CMS or database is not needed at this stage.

## Files

```text
content/recipes/
  recipe.types.ts
  crinkle-cookies.recipe.ts
  gluten-free-napoleon.recipe.ts
media/recipes/
  <recipe-id>/original/
  <recipe-id>/selected/
```

Each recipe is one entity with localized `en`, `es`, and `uk` content. Shared facts—quantities, oven settings, yields, times, flour configurations, evidence and provenance—are stored once. Translations contain only reader-facing text.

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
