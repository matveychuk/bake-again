# Design system changelog

## Unreleased

- Rebuilt Cook Mode as a four-screen working flow for crepes while preserving all five
  canonical recipe steps. Added one-action `Done, next` navigation, completion and private
  notes, versioned session restoration, 15/20-minute timers that survive navigation, an
  all-steps drawer, an ingredients drawer and an optional Screen Wake Lock control.
- Consolidated recipe and Cook rendering on shared `StepMediaSequence`,
  `RecipeIngredientList` and `RecipeStepGuidance` components with documented variants.
  Removed route-specific photo renderers, made multi-image rails keyboard-focusable and
  retained the approved 3-up / 52% tablet / 82% mobile responsive sequence.
- Reduced Cook step headings and tightened its work-column rhythm at laptop and mobile
  widths. Crepes now expose concise localized action lists, step-specific ingredients and
  observable checkpoints without adding decorative photos to simple actions.
- Added semantic Cook title and content-width tokens plus the shared keyboard focus-ring
  colour to the machine-readable and CSS token sources.

- Fixed the shared Cook Mode adapter so source-backed recipes retain localized step copy
  and ordered step photography. Also localized the shared Cook Mode navigation, progress,
  callout, timer and media accessibility labels in English, Spanish and Ukrainian.

- Made the source-backed `Use what I have` anchor recipe-specific; crepes now calculate
  from the available egg count rather than flour, with a localized whole-item unit.

- Added shared structured recipe facts for source-backed yield, geometry and timing, and
  aligned the pre-start guidance row so its clock and label sit together across locales.

- Localized the source-backed recipe scaling control in English, Spanish and Ukrainian,
  made it available on every inventory recipe page and formatted scale factors for the
  active locale. Recipes without a supported numeric anchor retain an explicit localized
  locked state.

- Reworked shopping into one unambiguous path: read-only recipe ingredients open a shared
  modal drawer for selection, with compact headings, select/clear actions, explicit
  alternative choices, water deselected by default and a sticky counted confirmation.
  Added explicit duplicate-batch handling, View list/Undo confirmation, persistent browser
  guidance, localized recipe links and conditions, bought-item cleanup, single-item Undo,
  confirmed Clear all and a denser responsive shopping page.
  Added the `layout.shoppingContent` token for the focused shopping work column.

- Consolidated recipe discovery into the home page: the Recipes navigation item now
  matches the Bake Again wordmark destination, and former catalogue URLs redirect home.

- Simplified Shopping-row removal to a standalone terracotta trash icon with a 44px
  accessible hit area, no white circular surface and clearer separation from quantity.

- Replaced the ambiguous ingredient amount pair with canonical `base` and optional
  `equivalent` quantities. Shopping uses only `base`; name-only items remain explicit.

- Reduced step-photo cards at tablet widths to a compact, nearly two-up horizontal
  sequence, while preserving the three-up desktop grid and the larger mobile scroll card.
- Replaced the ambiguous ingredient `Add all` interaction with an explicit, two-step
  shopping-list review. This earlier dialog treatment was superseded by the shared drawer
  and read-only ingredient-list pattern above.
- Standardized recipe-detail headings on the Napoleon two-line treatment: a dark,
  explicit gluten-free descriptor followed by the terracotta italic dish name in all
  three locales. Added the shared heading to the Design Lab.
- Made the gluten-free adaptation explicit in every localized recipe-detail heading while
  keeping catalogue-card titles concise, and removed the duplicate source title beneath
  working-record headings.
- Aligned recipe step numbers with their titles while keeping optional timing metadata
  in a separate row above the heading across source-backed and detailed recipe layouts.
- Split ingredient quantity display into a required primary measure and an optional,
  visually quieter secondary equivalent. Migrated source-backed recipes and added the
  paired-measure state to the Design Lab.
- Added a localized ingredients-only variant for translated source-backed recipes, so
  reviewed quantities remain visible without exposing untranslated adjustment controls.
- Extended the step media sequence to source-backed recipe pages with localized labels,
  alternative text and captions. Verified the three-image layout at 390/900/1440px.
- Assistant release audit: preserve Close focus on open, during loading and after
  nested action review; announce loading once; localize offline/network/JSON errors
  and avoid duplicate error announcements. Updated the shared Design Lab example and
  component contract.
- Prevent the assistant header from clipping the composer at 200% text size: use a
  compact header and complete-drawer scrolling when text-relative width is limited.

- Hardened the contextual assistant with shared question/history limits, a localized
  missing-runtime disabled state, signed anonymous safety sessions, server throttling,
  total deadlines, stable error mapping and content-free operational telemetry. Added
  a 45-case en/es/uk offline eval gate with 100% required critical-safety pass rate.

- Added the `displayCyrillic` typography token and locale-aware Literata display font for
  Ukrainian, avoiding browser fallback in headings. Updated the home promise, supporting
  copy and search text in Spanish and Ukrainian; added Spanish headline spacing for the
  italic accent line. Checked the responsive hero copy at 390px, 900px and 1440px.

- Added controlled assistant action review for `open-scaling` and `add-shopping-items`,
  with explicit confirmation, canonical quantities/evidence, ingredient-choice radios,
  cancellation and a no-write multilingual Design Lab example. Checked at 390/900/1440px.

- Added the shared contextual assistant drawer for Recipe Detail and Cook Mode, including
  real API submission, bounded history, request cancellation, localized lifecycle states,
  structured evidence rendering and modal keyboard behavior.
- Added the `layout.assistantDrawer` token and a live Design Lab assistant example.
- Localised the evidence badge contract: icon, written status and explanation are now
  locale-aware while the evidence-state semantics remain unchanged.
- Clarified the earlier distinction between preparation and shopping selection. The
  preparation-checkbox pattern was later removed from recipe pages in favour of one
  shopping-selection surface.
- Unified the Ingredients heading and ingredient-row primitives across detailed recipes
  and source-backed working records.
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
