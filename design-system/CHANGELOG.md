# Design system changelog

## 2026-09-25 · Butter-softening guide

- Added localized technique pages and contextual help using the existing tip and Drawer
  primitives; native links retain standalone navigation and keyboard focus return.
- Added explicit technique references to the relevant steps of seven recipes, including
  conditional butter choices. References survive cream composition and Cook Mode.
- Added a multilingual Design Lab example and shared Suggested provenance for the
  externally sourced technique; recipe evidence remains adaptation-specific.
- Verified page/drawer layout in uk/en/es at 390/900/1440px, keyboard containment and
  focus return, Cook Mode, JavaScript-free link navigation and 200% mobile text.

## 2026-09-25 · Complete method before cream selection

- Keep all host-recipe assembly steps and photos visible before a cream is selected.
  Selection adds cream preparation and ingredients without revealing previously hidden steps.
- Added the author's two-hour refrigerator tip to the final sponge-roll step and
  updated the Design Lab example to exercise unselected cream composition.

## 2026-09-25 · Concise card headings

- Shortened the Napoleon, Easter bread, fruit roll and marbled-cookie catalogue names;
  recipe-page headings retain their explicit gluten-free adaptation names.
- Centre titles beside Save and place facts 8px below the complete header, avoiding
  excess title spacing while retaining the bookmark's independent 44px target.
- Added the shortened headings to the shared Design Lab card examples.

## 2026-09-25 · Sponge-roll assembly guidance

- Split cooling, jam, cream and final decoration into focused recipe actions with
  matching photos. Reused existing tip and single-photo components; no new tokens.
- Added a multilingual Design Lab assembly example: essential action stays in the
  body while the tip explains the curved sponge and cream-free closing edge.
- Recipe overview now includes baking and cooling in its planning note; cream
  composition keeps all dependent assembly steps after preparation of the chosen cream.

## 2026-09-25 · Aligned catalogue cards

- Share photo, title, facts, flour and footer tracks within each tablet/desktop row;
  mobile cards retain natural height, and translated titles remain fully visible.
- Place time and difficulty in stable label/value columns for easier comparison.
- Keep every collection visible as a compact sand chip with 4px padding and gaps,
  preserving 14px text and independent 44px-high touch targets.
- Extend Design Lab with the reported Ukrainian card rows and multilingual/draft cases.

## 2026-09-24 · Consistent step photography

- Removed the full-width single-photo treatment: one photo now matches an individual
  sequence frame on desktop, tablet and mobile in recipe detail and Cook Mode.
- Restored simple ordinal photo labels (`1`, `2`, `3`), without numbering single photos.
  Mobile retains the next-photo peek and keyboard-scrollable sequence; accessible labels
  keep the total count.
- Added single/two-photo comparisons in both variants to Design Lab.

## 2026-09-23 · Responsive UX review applied

- Unified selected quantities across recipe overview, ingredients, shopping and Cook Mode; preserve configuration and cream when switching language. Adapted quantities use Calculated, while an unchanged base retains its own evidence. Invalid amounts require correction.
- Tightened mobile recipe heroes, cream choices and quantity controls; added ingredient/method jump links and a quieter secondary Cook link. Catalogue cards use equal 3/2/1-column desktop/tablet/mobile grids.
- Standardized Saved on the compact RecipeCard variant and gave EvidenceBadge a shared default visual treatment. Removed duplicated ingredient dividers and expanded single step photographs.
- Added visible search focus, 44px controls, skip navigation, wrapping at 200% text and localized Saved copy.
- Cook tools now use a bounded side panel with a visible Close action. An active timer remains reachable from other steps.
- Added compact cards and a working Cook drawer to Design Lab; added localized information about browser storage and assistant context.

## 2026-09-22 · Published banana pancakes

- Published the Tested banana-pancake recipe with a concise hero: the summary now
  describes texture and key ingredients without repeating the title or Tested status.
- Replaced the generated final-step cue with two horizontal crops of the author's real
  cooking photographs and retained the previous hero alongside a more accurate v3.

## 2026-09-21 · Shared cream pages and published profiteroles

- Moved all four reusable cream routes onto the same `InventoryRecipeDetail` composition
  as the main recipes, including hero photography, Tested status, quantity adjustment,
  ingredients, Cook Mode and step photography. Removed the redundant cream-only page.
- Kept creams as linked supporting recipes rather than discovery cards; they omit only
  the irrelevant flour row and catalogue Save control.
- Published the reviewed profiterole record to Recipes and kept éclair spellings as
  search aliases. Updated the fruit-roll hero and method so a quarter of the selected
  cream is reserved for the top, followed by fruit, berries or chopped nuts.

## 2026-09-21 · Reviewed apple charlotte and plum upside-down cake

- Published both author-confirmed recipes as Tested with a five-egg base batch, 20 minutes
  of active work, 50 minutes total time and an explicit double-batch note for a full oven
  tray. Eggs are the scaling anchor in both recipes.
- Kept the apple charlotte butter-enriched and folded the floured apple pieces through the
  batter. Kept the plum sponge butter-free, placed the plums cut side down and added the
  immediate hot inversion that reveals the fruit layer on top.
- Replaced both working covers with recipe-accurate natural-home heroes and added only the
  decision-useful ribbon-stage, apple-distribution and plum-arrangement process images.

## 2026-09-21 · Reviewed fruit sponge roll

- Published the Tested fruit sponge roll with 30 minutes of active work, a yield of one
  roll and easy difficulty. Total elapsed time remains open because cooling varies; the
  dependency is stated once in planning instead of being invented.
- Reduced the host recipe to four practical steps, preserved the ribbon-stage, doneness
  and warm-rolling cues, and removed repeated photo captions and the duplicated cream
  formula.
- Linked whipped mascarpone cream as the recommended filling and vanilla buttercream as
  the alternative. Thick blueberry or raspberry jam remains flexible, with optional fresh
  fruit in the filling and on top.
- Replaced the unreviewed author cover with a generated natural-home hero checked against
  the actual baked roll and real examples; retained only three decision-useful process
  images in the published flow.

## 2026-09-21 · Profiteroles and reusable creams editorial pass

- Renamed the working choux recipe to Profiteroles across reader-facing titles and
  metadata while retaining éclair spellings as curated search aliases and the stable
  internal recipe identity.
- Added a visible Working recipe label to unpublished recipe heroes while keeping the
  exact baked profiterole base separately marked Tested.
- Replaced the mismatched éclair cover with a generated natural-home photograph of
  round filled profiteroles and retained four step images only for useful dough states.
- Added active and elapsed times, yield and difficulty to all four Tested cream recipes;
  cooling is counted in elapsed time, not active work.
- Added the flour-free Recipe overview variant for standalone creams and removed
  preparation-only steps such as chilling an empty bowl or separately softening butter.

## 2026-09-20 · Reusable cream recipe model

- Added four Tested cream records with localized ingredients, steps, checkpoints and
  practical tips: mascarpone whipped cream, vanilla egg custard, eggless vanilla custard
  and vanilla buttercream.
- Added host-owned cream options so a finished recipe lists compatible cream recipe IDs
  and exactly one recommended cream without duplicating compatibility state on the cream.
- Set vanilla egg custard as the recommended cream for éclairs and retained the other
  three creams as confirmed alternatives.

## 2026-09-20 · Reviewed gluten-free Napoleon

- Published the repeatedly baked Napoleon recipe with Schär Mix B as the quantity-adjustment
  anchor and removed draft-only publication notes from its detailed recipe layout.
- Confirmed the custard formula at four whole eggs, 400 g sugar, 170 g corn starch,
  100 g butter and 24 g vanilla sugar; fixed the nut finish at 150 g walnuts and 50 g
  flaked almonds.
- Consolidated planning into two practical notes: enough parchment for 12 layers and the
  full chill/rest schedule. Total elapsed time stays intentionally open because the cake
  matures for 12–24 hours and is best served the next day.
- Restored six existing process photographs to the canonical recipe and added generated
  images for the divided dough, rolled and baked layers, finished custard, assembly and
  accurate six-layer hero.
- Reworked the generated Napoleon set after reviewing real homemade examples: pastry and
  crumbs are less uniform, the cream layers are thinner, the kitchen light is natural and
  the assembly image now uses only round 28 cm layers.

## 2026-09-20 · Personal bake memory

- Separated personal `Baked` memory from Save / Want to bake. Completing Cook Mode now
  records the date, exact recipe version and base or adjusted configuration locally.
- Made the private completion note explicitly auto-saving with saving, saved and failure
  states. Return to recipe and Cook again no longer imply that the note may be discarded.
- Added the latest bake and note to recipe detail and surfaced the previous note before
  step one of a repeat cook. Added the matching Personal state example to Design Lab.

## 2026-09-20 · Author waffle photography

- Replaced the cottage-cheese waffle generated hero and process imagery with seven
  selected author photographs shared by recipe detail and Cook Mode.
- Grouped the photos into three concise before/after sequences: blending the base,
  mixing the batter and filling/baking/serving the waffles. Near-duplicate frames were
  intentionally omitted.
- Updated localized image descriptions to identify the visible berry variation without
  changing the Tested base recipe or inventing an unrecorded berry quantity.

## 2026-09-20 · Prune-cake editorial pass and step imagery

- Published the completed prune-cake record in Recipes and removed its remaining
  pre-publication note; bake-test evidence remains a separate status.
- Published recipes without recorded bake-test evidence now omit the draft-only
  working-record explanation instead of implying that they are still unpublished.
- Simplified the prune-cake hero, ingredient notes and ten-step method, moving the two
  bake durations into concise step metadata and recording the confirmed hot-glaze method.
- Replaced generic cream and glaze images with a coherent five-image generated series:
  sliced layers, prune cream, coated cake cubes, mound assembly and the finished cake.
- Kept concise working-recipe publication guidance once beside ingredients instead of
  repeating the same editorial note again at the end of the page.
- Suppressed the generic “as needed” quantity when an unquantified ingredient already
  provides a more specific note such as “to taste”.

## 2026-09-20 · Prune-cake method clarified

- Completed the working prune-cake method in the existing concise recipe layout:
  60 active minutes, one 26 cm cake and medium difficulty.
- Recorded the two-stage 200°C bake, three-layer assembly, 150 g prunes, sugar-based
  cream and walnut-or-pecan finish. Total elapsed time remains open until the cooling
  duration is confirmed; publication and evidence status remain unchanged.

## 2026-09-20 · Cocoa spoon conversion

- Added the shared unsweetened-cocoa reference of 5 g per tablespoon, rounded for
  practical use from the cited 42 g per half cup reference. The new prune-cake
  transcription therefore keeps 5 tbsp cocoa as a 25 g canonical quantity.

## 2026-09-20 · Reviewed paska

- Published the author-confirmed Tested paska in the existing concise layout with
  30 active minutes and a yield of three medium paskas. Quantities are unchanged.
- Set a conservative, explicitly approximate total of 290 minutes, including
  proofing, baking and cooling. Overlapping fruit soaking and active mixing are not
  added twice; mould dimensions remain unspecified.
- Reduced twelve steps to nine, removed editorial notes and repeated photo captions,
  and retained useful yeast, dough, proofing and doneness cues and linked timers.

## 2026-09-20 · Reviewed sponge cake

- Published the Tested sponge cake in the existing concise layout: 15 active minutes,
  60 total minutes, one sponge cake and easy difficulty.
- Replaced the planning banner with preparation in the first step; preserved greasing
  only the tin bottom, gradual sugar addition and gentle folding in four concise steps.
- Removed source-measure commentary and repeated captions/checkpoints. Kept separate
  sugar quantities for whites/yolks and labelled the small-egg equivalent.
- Added all three language versions and the existing 40–50 minute baking timer.

## 2026-09-20 · Reviewed banana bread

- Published banana bread using the existing concise layout and recorded Tested evidence.
  Set 30 active minutes and 90 total minutes; the author confirmed 40 minutes at 200°C
  in a rectangular tin. Dimensions remain unspecified rather than invented.
- Reduced the method to five steps. Oven/tin preparation starts the first step;
  dry ingredients, add-ins and filling share one step. Removed repeated checkpoints,
  image captions and editorial gaps while preserving fill level and skewer cues.
- Localized the complete method in all three languages and retained canonical quantities,
  per-step ingredients and separate baking/in-tin cooling timers.

## 2026-09-20 · Whole-card recipe navigation

- Made every non-control area of a recipe card open the recipe. Save and collection
  controls remain separate, keyboard-reachable targets above the card link.

## 2026-09-20 · Reviewed crinkle cookies

- Published the author-confirmed Tested version with 30 minutes of active work and no
  citrus ingredient. Preserved the 3–4 hour chill and 8–10 minute per-tray baking range;
  full elapsed time remains unknown because cooling and tray count are not recorded.
- Reduced the method to seven concise steps without repeated checkpoints or photo
  captions. Preserved fast shaping, full sugar coating and moist-crack doneness cues.
- Extended the existing concise layout to detailed recipes. Their adapter now preserves
  per-step ingredients and explicit phase-to-step timer links; Design Lab includes the
  edited cookies alongside waffles and crepes.

## 2026-09-20 · Recipe card visual hierarchy

- Emphasized time and difficulty values, retaining localized labels and adding
  terracotta clock/chef-hat icons. Increased flour-value contrast without adding weight.
- Gave collection links subtle sand surfaces, more separation, and underlined
  terracotta hover treatment; retained 44px targets and visible keyboard focus.
- Updated the shared multilingual Design Lab example and card language attributes.
  All colours, spacing and metadata sizes use existing semantic tokens.

## 2026-09-20 · Reviewed carrot cake

- Reused concise recipe reading for the author-confirmed Tested carrot cake and
  published it in Recipes. Recorded 30 active minutes, one cake and medium difficulty.
- Set carrots (200 g) as the quantity anchor without changing the ingredient formula.
- Kept advance raisin soaking as one planning note; moved oven/pan preparation to the
  first step. Removed editorial suggestions and duplicate cues/captions, preserving
  seven canonical steps, per-step quantities and the 35–40 minute baking timer.

## 2026-09-20 · Reviewed dumplings and recipe publication

- Applied the existing concise layout to Tested lazy dumplings: six short steps,
  caption-free photos and preserved rest/boiling timers. Recorded 45 active minutes,
  100 dumplings and medium difficulty, with 450 g cottage cheese as the scaling anchor.
- Removed packet counts and cooking water from the ingredient list. Recorded the
  author's recipe-specific tapioca measure (7 g = 1 tbsp); the global table is unchanged.
- Explicitly published waffles, crepes and lazy dumplings into Recipes, removing them
  from local Drafts while keeping publication separate from adaptation evidence.

## 2026-09-20 · Reviewed crepe copy

- Applied the concise recipe layout to author-confirmed Tested crepes in all three
  languages. Four canonical steps now match Cook Mode; the rest timer stays attached
  to the combined milk-and-rest step.
- Replaced the planning banner with a phase-linked note under total time and displayed
  the recorded 28 cm pan beside the base quantity. Removed editorial notes and repeated
  photo captions; retained the thick-base technique and visible flipping cues.
- Removed the contradictory oil spoon equivalent; canonical oil remains 25 g.

## 2026-09-20 · Concise waffle recipe

- Recorded the author's confirmation of the exact waffle base as Tested, independently
  of publication. Added an opt-in concise reading layout without editorial draft notes.
- Combined the dry-mixing steps, removed repeated checkpoints and made image captions
  optional while retaining descriptive alt text in recipe detail and Cook Mode.
- Reduced quantity-control copy, added the canonical Calculated badge only for changed
  quantities, and kept explicitly fixed pinch measures unchanged. Added multilingual
  production-component examples to the Design Lab.
- Added Ukrainian discovery aliases including «гофре» without duplicating the dish title.

## 2026-09-20 · Gram-first spoon conversions

- Added one gram-first spoon-weight table for recurring dry ingredients. Author-measured
  Schär Mix B Bread, tapioca starch, baking powder and granulated sugar values now drive
  recipe equivalents; referenced values remain labelled separately.
- Migrated managed recipe quantities so grams are canonical and teaspoons or tablespoons
  are secondary cooking aids. Ambiguous ingredient alternatives and unconfirmed cup
  measures remain explicitly unresolved instead of receiving a false gram value.

## 2026-09-20 · About and recipe testing

- Added a localized editorial About page for the Bake Again family story and testing
  method, with canonical Tested, Calculated and Suggested status treatments.
- Linked the homepage trust card directly to the testing section and documented the
  editorial story-page pattern.
- Added the localized About destination to the primary site navigation.

## 2026-09-20 · Publication and local drafts

- Split public published recipes from local-only unpublished working records.
- Guard draft, recipe and Cook Mode routes with development plus loopback-host checks.
- Cards now show title, explicit time basis, difficulty, flour and collection links.
- Remove duplicate category eyebrows and repeated Tested labels from public cards.
- Reuse the production card for multilingual Design Lab examples.

## Unreleased

- Simplified reusable-cream choice cards: Tested is now stated once in the introduction,
  a chocolate Recommended label crosses the preferred card's top edge without reserving
  an empty row on its peers, radios sit at the top right, and left-aligned recipe links
  align across the card row. Added the production selector to Design Lab.
- Reduced the shared Recipe and Cook Assistant drawer title to the dedicated 24px
  contextual-title token, keeping long localized headings subordinate to recipe content.
- Moved About to the end of primary navigation and kept the four public destinations on
  one mobile row at 390px in English, Spanish and Ukrainian when local Drafts is absent.
- Added a subtle semantic boundary to recipe cards so collection links remain visibly
  attached to the recipe above in one-column catalogues.
- Aligned each pre-start clock with its “Keep in mind” heading and indented the supporting
  copy consistently across responsive layouts.

- Kept the shared Save control circular beside long recipe titles by preventing flex
  shrink, and aligned its saved state with the Design Lab's filled bookmark silhouette.

- Added localized recipe collections to the inventory and homepage: Breakfast, Every day,
  Celebration, With cottage cheese and Batter on hand. Collection links now filter the
  catalogue and every recipe card names its applicable collections.

- Refined the shared recipe overview: active time first, total time and optional planning
  guidance below, a compact status badge with aligned evidence text, and horizontal
  rules only. Product and Design Lab now render the same component in three languages.
- Added phase-linked planning notes to the recipe timing model and shortened Napoleon's
  yield to two cakes; layer counts remain in its description and yield details.

- Added one normalized recipe-overview model for all 17 recipes: time, yield, difficulty
  and flour, with explicit nulls for unknown facts.
- Replaced the large evidence panel with a compact evidence row and removed equipment and
  geometry from the recipe hero overview.
- Grouped total and active time into one fact, kept flour in a full-width row and added
  the responsive Recipe overview reference to the Design Lab.

- Replaced the Easter-bread placeholder with the complete Paska 2.0 working recipe:
  four ingredient groups, twelve Ukrainian and English method steps, practical tips and
  observable checkpoints. Marked the exact softer adaptation as Suggested until it is
  bake-tested, preserving adaptation-specific provenance.
- Added seven localized Paska 2.0 process photographs to recipe detail and Cook Mode,
  covering the decision-critical yeast, dough, proofing, baking and cooled-crumb states.

- Replaced the banana-fritter placeholder with a tested banana-pancake adaptation using
  Schär Mix B Bread. Added six concise Ukrainian steps, practical tips, observable
  checkpoints, localized facts, a new cover and five step photographs while retaining
  explicit publication gaps for the flour weight and any liquid adjustment.
- Added five localized process photographs to the sponge-cake recipe and Cook Mode,
  covering the two whipped mixtures, both folding stages and transfer to the long form.

- Prepared the sponge cake for the shared Ukrainian recipe flow with all six original
  steps, separate sugar quantities for whites and yolks, source-backed tips and
  checkpoints, localized practical facts and photo-verified corrected quantities. Kept
  explicit gaps for the long form dimensions, doneness cue and total timing.

- Added localized step photography to the fruit sponge roll and the incomplete prune-cake
  working record. The prune recipe now uses the shared Ukrainian recipe composition,
  separates the partially transcribed cake, cream and glaze ingredients, and keeps Cook
  Mode unavailable until the unreadable core method is confirmed.

- Prepared the fruit sponge roll for the shared Ukrainian recipe flow with six
  source-backed steps, localized ingredients, one observable checkpoint, three practical
  tips and explicit gaps for the oven temperature, rolling method, fruit quantities and
  total time.

- Moved the Napoleon product route onto the shared recipe-detail composition. Detailed
  recipes now carry their Tested evidence into that shared surface, while the canonical
  source retains all 19 Ukrainian method steps. Added concise Ukrainian action titles,
  locale-aware duration labels and localized review notes to the shared presentation.
  Removed the former Napoleon-only recipe renderer, adjustment/assistant wrappers and
  styles; the Design Lab reference now exercises the shared recipe page as well.

- Reworked the Crinkle Cookies method into concise titled actions with quantities,
  practical tips and observable checkpoints. Added six localized instructional photos,
  exposed detailed-recipe `mediaIds` through the shared Recipe Detail and Cook Mode
  adapter, and resolved the powdered-sugar quantity as 100 g.

- Added the shared `RecipeStepContent` structure for recipe detail and Cook Mode: the
  contextual assistant action now sits with the heading, practical tips always precede
  instructions, and checkpoints remain after the action they verify. Added the compact
  warm-background tip treatment, aligned checkpoint labels and messages in one row and
  updated the Design Lab example.

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

## 2026-09-20 — Working catalogue search

- Connected GET search queries to ranked catalogue results, combining collection filters.
- Added canonical ingredient, multilingual title/category/collection matching, curated
  dish aliases and word forms, prefix matching and limited typo tolerance.
- Reused the shared search form in the homepage and Design Lab, with retained input,
  result counts, empty-result guidance and wrapping for long search headings.

### 2026-09-25 — Recipe components and author cake media

- Added fixed recipe-part composition and linked standalone glaze/cream pages using
  the shared recipe detail; full method remains inline in the host cake.
- Extended the existing step media sequence with optional author video (native
  controls, muted initially, inline, no autoplay), documented in Design Lab.
- Added a distinct label for author photographs with AI-edited backgrounds/plates.

## 2026-09-25 — Basic analytics

- Shared recipe, search, language, shopping, Cook Mode and assistant controls now emit
  named Umami events. Visual treatment, keyboard behavior and provenance are unchanged.
- Existing Design Lab examples exercise the same controls; Design Lab and local visits
  are excluded from collection. No new tokens or visual variants.
- Privacy content explains basic analytics in Ukrainian, English and Spanish.
- Event semantics and the data allowlist are documented in `docs/analytics.md`.

## 2026-09-25 — Production media pipeline

- Source-quality recipe imagery now lives outside `public` and remains versioned in
  GitHub. Production builds generate referenced WebP delivery assets automatically.
- The generated set caps width at 1800 px, removes metadata, omits unused source files
  and enforces a 64 MiB media budget. Image content, crop and alt text are unchanged.
