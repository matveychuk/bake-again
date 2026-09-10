# ADR 0002: Anonymous personal state

**Status:** Proposed — awaiting architecture sign-off
**Date:** 2026-09-09
**Owners:** Bake Again product and engineering

## Context

Saved recipes and a shopping list must work before accounts exist. ADR 0001 reserves
the storage keys and requires a typed, SSR-safe browser storage boundary, but deliberately
does not define the user-data contract.

## Decision

Use two independently versioned browser-local slices:

```text
bake-again:recipe-memory:v1
bake-again:shopping:v1
```

Recipe memory stores an ordered set of stable canonical `recipeId` values. Shopping
items store canonical `ingredientId`, a structured `Quantity | null`, checked state,
timestamps, and recipe/version/ingredient-line source references. Localized ingredient
names, unit labels and recipe names are derived at render time from canonical recipe data.

Any recipe with a stable `recipeInventory.id` may be saved. Shopping remains restricted
to recipes with canonical localized `RecipeDraft` ingredient data: in the first slice,
Gluten-Free Napoleon and Crinkle Cookies. This prevents the shopping schema from
persisting localized display strings while still letting a reader save any known recipe.

Compatible duplicate items merge by canonical ingredient ID and unit. Their quantities
are summed, sources are retained, and a newly merged item becomes unchecked. Different
units and unspecified quantities stay separate. A source line may be added only once.

All parsing validates schema version, IDs, ISO dates, units, finite positive quantities,
range ordering and bounded collections. Malformed storage falls back safely to an empty
snapshot. Future schema versions read and transform a valid previous slice before writing
their new key. Neither slice is mirrored into cookies.

The first slice imports only the recipe's Tested base ingredients. Calculated and Suggested
configurations remain out of scope so their provenance cannot be mistaken for Tested.

## Consequences

Personal state remains private to one browser and synchronizes only between tabs through
the browser storage event. It does not provide accounts, device sync, sharing, notes,
inventory, Baked history, or a general shopping-item editor.

This ADR complements ADR 0001 and does not change its locale or cookie decisions.
