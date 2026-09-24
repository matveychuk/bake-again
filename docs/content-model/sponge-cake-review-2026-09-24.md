# Sponge cake editorial review — 2026-09-24

Author clarification applied in Ukrainian, English and Spanish. The ingredient formula,
temperature and baking range are unchanged. The round tin, crossed foil lining and gradual
oven cooling record the author's method, not a newly calculated adaptation.

- Keep the recipe as a plain sponge base. The detail title now names its layer-cake use;
  the short catalogue title and existing plain-sponge cover remain.
- Step 1 explains whisking equipment and sugar additions. Remove the incorrect greasing
  instruction; place all tin preparation in the baking step.
- Step 2 identifies the yolk sugar explicitly and describes the ribbon texture inline.
- Step 3 mixes the dry ingredients first, then adds them in portions, with optional sifting.
- Step 4 uses a round tin lined inside with two crossed foil sheets and checks the centre
  with a toothpick. Replace the rectangular-tin photograph with the generated v2 asset.
- Step 5 adds 10–15 minutes in the switched-off oven with its door ajar, full cooling and
  slicing into two or three layers. The sour-cream-and-chocolate cake remains an optional
  serving idea: no cream or glaze quantities were supplied.
- Keep three observable checkpoints and one short serving tip. Reuse existing step and
  guidance components; no component, token or Design Lab contract changes are needed.
- Remove the 60-minute total because it excludes full cooling. Preserve 15 minutes of
  active time and 40–50 minutes of baking; add a cooling phase and Cook Mode timer options
  of 10 and 15 minutes. Full cooling duration and tin diameter remain unspecified.

## Verification

- Recipe detail checked at 390, 900 and 1440 px in all three languages: five steps,
  no horizontal page overflow or clipped heading/paragraph text.
- Ukrainian mobile step layout and desktop final step inspected visually. New round-tin
  image renders with localized descriptive alternative text.
- Cook Mode shows five steps and the final 10/15-minute cooling timer. Preview navigation
  did not mark steps complete.
- TypeScript, recipe validation and 120 foundation tests passed. Targeted lint passed.

## Search positioning

Use “Безглютеновий бісквіт для торта” as the Ukrainian detail title. This expresses the
recipe's actual purpose; no comparative keyword-volume claim is made. A separate filled
cake recipe would need the author's cream/glaze quantities and assembly instructions.

Google's recipe guidance says the main image should show the completed dish and represent
the recipe: https://developers.google.com/search/docs/appearance/structured-data/recipe

The local recipe route currently renders `noindex, nofollow`. This existing publication
boundary was observed, not changed. Indexability and public deployment need separate launch
review; copy edits alone do not make the local recipe discoverable in search.
