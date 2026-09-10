# Design system changelog

## Unreleased

- Localised the evidence badge contract: icon, written status and explanation are now
  locale-aware while the evidence-state semantics remain unchanged.
- Clarified that ingredient prep checkboxes are distinct from the `Add all` shopping
  action, which belongs in the Ingredients heading.
- Unified the Ingredients heading and preparation-checkbox primitives across detailed
  recipes and source-backed working records.
- Standardised product and Design Lab checkbox states on `BakeCheckbox`.

## 1.0.4 — 2026-09-09

- Added documented anonymous personal-state patterns for Save, Shopping rows,
  ingredient-choice review and practical empty states.

## 1.0.3 — 2026-09-09

- Documented the Cook Mode entry and unavailable-source state. Recipe pages now use the
  same explicit action whether the archived source supports step-by-step cooking or only
  preserves an incomplete record.

## 1.0.2 — 2026-09-09

- Added the documented language-switcher pattern: native language names, explicit
  selection state, keyboard menu behaviour and locale-specific navigation.

## 1.0.1 — 2026-09-08

- Recipe adjustment now treats baking size as an independent constraint and combines it
  with either batch scaling or scaling from an available ingredient.
- Compacted the adjustment title and reset action so they fit on one line.

## 1.0.0 — 2026-09-07

- Approved Warm Precision / Review applied as the visual foundation.
- Established cream, warm-white, linen, chocolate, cocoa and terracotta semantic roles.
- Defined Newsreader and Manrope typography roles.
- Established Tested, Calculated and Suggested evidence states.
- Added baseline layout, spacing, photography, accessibility and localisation rules.
- Added an explicit, opt-in dark semantic mode for future product validation.
- Tightened the 390px homepage hero so food and search enter the first viewport.
