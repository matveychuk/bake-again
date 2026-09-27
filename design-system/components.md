# Base components

## Browser icon

- `public/favicon.svg` is the compact `B.` mark derived from the Bake Again wordmark.
  Its surface, letter and period use the existing `background.surface`, `text.primary`
  and `action.primary` colours. Keep the letter and period legible at 16 × 16 px.
- The root layout explicitly links this SVG as the browser icon. The Design Lab
  principles section shows the production asset at 32 × 32 px.

## Contextual technique guide

- `RecipeStepContent` accepts a canonical `technique` reference and locale. The existing
  tip treatment shows the help before the action; recipe planning surfaces each reference
  once through `RecipePlanItem`. Plan-ahead technique help uses the same clock and written
  `Keep in mind` label as ordinary planning notes, without a nested tip background; the
  guide link remains inline in the explanation. Conditional butter alternatives keep
  their written qualification.
- `TechniqueHelp` uses the shared Drawer, with the Cook tools' right-side treatment,
  a fixed title/Close header and a scrolling body. At 900px and below it fills the viewport.
- The trigger is a real link: ordinary click/Enter opens the drawer, modified clicks and
  JavaScript-free navigation reach the standalone localized page. Closing returns focus
  to the exact link. No recipe configuration, timer or cooking progress is changed.
- `TechniqueGuide` shares the process and readiness cue between page and drawer.
  Practical technique guidance is unbadged and makes no Tested, Calculated or Suggested
  claim; recipe and adaptation evidence remains separate.
- `/design-system#technique-help` demonstrates Ukrainian, English and Spanish copy.
  Use existing semantic tokens; no new palette or typography is introduced.

## Assistant action review

- A proposed action opens a review dialog, never executes from the AI answer itself.
- Reuse the installed `Dialog` and `EvidenceBadge` through `AssistantActionReview`.
- The action is Suggested; per-line evidence describes the quantity, not the action.
- Show app-calculated quantities, pending evidence, ingredient choices and eligibility
  before confirmation. Do not preselect ambiguous ingredient alternatives.
- Keep Cancel available during validation. Disable Confirm until review/choices are
  complete and while confirming; Escape/close cancels outstanding work.
- Closing review returns focus to the parent assistant's Close control because the
  consumed proposal button is disabled. Escape dismisses only the innermost dialog.
- `open-scaling` only opens existing controls; it never applies a scale.
- Use semantic tokens and wrap long translations. Let the dialog scroll vertically
  on narrow screens; keep controls at least 44px high and keyboard focus visible.
- The matching interactive example is `/design-system#assistant-actions`, with en/es/uk
  copy and no persistence effects.

## Button

- Use `components/ui/button.tsx` for standard action buttons and button-shaped links.
  Its CSS module owns geometry, type, colours and states; local CSS adds layout only.
  Pass `href` for a native link; omit it for a native button. Navigation must retain
  link semantics, modified clicks and operation without JavaScript.
- Default: terracotta fill and warm-white text for all primary actions, including
  search, shopping, confirmations and Cook entry/next/finish/restart. Use the same
  colour regardless of button width; chocolate is reserved for editorial surfaces
  and text, rather than a separate primary-button category.
- Outline: warm-white surface, subtle border and chocolate text for secondary actions.
  Ghost and link variants serve quieter controls; a section jump remains a text link.
- All variants share a 4px `radius-control`, 14px body type, 700 weight, 8px icon gap,
  8px/16px padding and a minimum 44×44px target. Height grows with translated text;
  never force nowrap. The large Cook navigation variant uses 48px minimum height.
- Preserve visible focus, hover and disabled states. Use the same shape for icon-only
  actions; Save remains its documented round toggle, not a standard action button.
- Search, shopping entry/confirmation, Cook entry/navigation/timer/restart, cream change,
  bake-memory repeat, empty-collection actions and assistant action review use the shared component. Specialized
  quantity controls keep their pressed states and use the same radius token.
- The dark homepage Napoleon feature is an editorial recipe link card: retain its
  display title, emphasis colour tokens and square surface. It is not a standard
  action button. Large recipe panels, photography and drawers also remain square.
- The Design Lab Actions and recipe-reading examples render these production controls.

## Search field

- Use 16px input text and a minimum 44px input and submit target. The containing form has a visible focus-within ring; preserve keyboard focus rather than removing it without replacement.
- Filtered results repeat the same search component close to the result heading so the query can be refined in context.

- Warm-white surface, subtle chocolate border and search icon.
- Placeholder uses secondary text colour and must remain readable.
- Submit action uses the primary button treatment.
- On narrow screens the action may move below the input.

## Recipe card

- Catalogue layout uses equal cards: one column on mobile, two on tablet and three on desktop. A featured span is reserved for explicitly curated placement.
- Full cards share five content tracks within each catalogue row: photo, title/Save,
  planning facts, flour, and footer. Use CSS subgrid at tablet/desktop widths so actual
  text sets the track heights. Never truncate titles or reserve a fixed two-line height.
  Single-column cards size naturally to their own content.
- Saved uses `RecipeCard` with `variant="compact"`: horizontal image, title, known facts and the same independent Save control. Omit flour/collection rows for this task. Design Lab includes uk/en/es examples.

- Food image first.
- Keep the image, recipe facts and collection links inside one square surface with a
  subtle semantic border and compact internal padding. The boundary must make the final
  collection links visibly belong to the recipe above without competing with the food.
- The whole card opens the recipe, including image, title and planning copy. Save and
  collection links stay distinct controls above the card link, so their actions never
  trigger recipe navigation.
- No category/situation eyebrow above the title.
- Recipe title in Newsreader.
- Use concise dish names on cards: Наполеон, Паска, Рулет із фруктами and
  Мармурове печиво. Keep full adaptation names on recipe pages and in search metadata.
- Vertically centre full-card titles beside the 44px Save control. Keep facts 8px
  below the complete header, including the control; never overlap its touch target.
- Under the title, show known time and written difficulty, then the flour mix. Time
  explicitly says total or active; unknown facts are omitted on cards.
- Keep fact labels secondary; emphasize values in primary text at body size and
  semibold weight. Use small terracotta clock and chef-hat icons alongside the written
  facts. Flour stays body-small, with a primary-colour value and secondary label.
- Full-card time and difficulty use two stable columns with the label above the value.
  Keep total versus active time explicit; long labels and values wrap within each column.
- Collection links sit last and open the matching catalogue filter. Keep them separate
  from recipe links and the save control, with 44px touch targets.
- Collection links use the subtle sand panel surface, primary text and a 4px radius.
  Show every collection as a compact chip, in catalogue order. Keep 14px text,
  4px internal padding and 4px horizontal gaps; the visible sand chip sits inside a
  44px-high link target. Leave 12px above the group. Never hide links behind a count
  or truncate labels. Wrap onto another line only when the actual content needs it.
  Hover adds
  a terracotta border and underlined text; keyboard focus keeps its visible outline.
  Evidence status colours remain reserved for evidence, not collection categories.
- Published cards do not repeat Tested. Unpublished cards show a document icon and
  localized Working recipe label; publication is separate from adaptation evidence.
- Save remains a separate secondary action.
- The Design Lab renders this same component in Ukrainian, English and Spanish, with
  published, unpublished and missing-fact examples.
- Do not show a flour matrix or multiple adaptation badges on the card.

## Recipe detail title

- Catalogue cards use short recipe names for scanning. On the recipe page, make the
  gluten-free adaptation explicit in the main heading in the active locale.
- Use the shared two-line title treatment from the Napoleon layout: the localized
  gluten-free descriptor is the dark first line, and the dish name is the terracotta
  italic second line. The words remain explicit, so colour is never the only signal.
- Keep the complete natural-language title as the accessible name and metadata title;
  visual word order may prioritize the gluten-free message consistently across locales.
- Do not repeat an alternate or source-language version of the same recipe name beneath
  the heading. Move useful provenance into the dedicated evidence treatment instead.

## Recipe overview

- Every recipe uses the same decision order: evidence, time, yield, difficulty and flour.
- `RecipeOverview` composes the existing `EvidenceBadge` and `RecipeFacts` for both
  product pages and the Design Lab. A soft background contains only the evidence icon
  and label. Adjacent scope copy uses the same body-small size and line height; keep
  the row separate from the summary. Repeatedly verified bases may say “Made many times”.
- The primary row is Active time, Yield, Difficulty: one label and one value per fact.
  Use horizontal rules without vertical dividers. Keep total elapsed time and an optional
  planning note in a secondary full-width row. Omit this row when both are unknown;
  never substitute baking or resting time for total time.
- Planning notes describe consequential waiting or when to serve, not generic equipment.
  They come from recipe timing data and can reference a canonical phase for its duration.
- Yield describes the finished result in the recipe's natural unit, such as cookies,
  crepes, cakes or servings. Recipe-specific structure such as layer count belongs as
  supporting yield detail, not as a new universal field.
- Difficulty uses the written levels Easy, Medium or Advanced in the active locale.
  Decorative stars are not used because they can be mistaken for ratings.
- Flour uses one full-width row with normal-weight body-small text so long names wrap.
- Preparations where flour is not relevant, such as standalone creams, use the same
  overview without the flour row; do not replace it with a “not applicable” value.
- Linked standalone creams use the complete shared `InventoryRecipeDetail` composition:
  hero, Tested evidence, recipe-specific scaling, ingredients, Cook Mode and illustrated
  method. They remain outside the discovery catalogue and omit only catalogue Save and
  the irrelevant flour fact; do not introduce a second cream-only page component.
- Equipment and geometry do not appear in the overview. Keep consequential dimensions
  with recipe setup and adjustment controls, and ordinary tools in the method.
- Unknown values remain explicit. At 390px, stack the three comparable facts; at 900px
  and 1440px, keep them in one row.

## Cream choice cards

- Describe compatible creams without claiming the exact host + cream combination has
  been tested. Show the composition evidence in the overview, not on every choice card.
- Place a compact chocolate Recommended label across the preferred card's top border.
  Keep it out of normal flow so other cards do not reserve an empty label row. The label
  is written as well as coloured, and is included in the preferred option's accessible
  description.
- Keep each radio at the top right while titles, descriptions and recipe links share one
  left edge. Titles and descriptions must start on the same line across a card row.
- Keep the recipe links aligned at the card bottoms on wide screens. Let each card size to
  its content in the single-column mobile layout without clipping long translations.
- The shared multilingual Design Lab example uses the production selector in Ukrainian.

## Personal state

- Save is a non-shrinking 44px circular secondary control with a bookmark icon and an
  explicit programmatic pressed state. Its accessible name changes between Save and
  Remove. The saved state fills the same bookmark silhouette; it does not swap to a
  different icon shape.
- Completing the final Cook Mode step records a private `Baked` memory independently of
  `Save` / Want to bake. Store the date, exact recipe version, exact base or adjusted
  configuration and one note locally; never present this personal state as Tested.
- The completion note is optional and saves automatically as it changes. Show an explicit
  saving, saved or failed message before the Return to recipe and Cook again actions.
- Recipe detail shows the latest Baked date and note. Starting again clears the new note
  field but shows the previous note before the first step, so advice remains useful while
  cooking. Long notes wrap without clipping.
- Shopping rows use a labelled checkbox, quantity, recipe source and a separately
  labelled remove control. The remove action has a 44px hit area, but is shown as a
  standalone terracotta trash icon without a filled or white circular surface. Leave a
  clear gap after the quantity. A checked item remains readable; colour is not its only
  cue.
- Use `BakeCheckbox` for shopping selection, bought state and Design Lab checkbox examples. Its checked state is a
  warm-brown fill with a warm-white checkmark.
- Recipe ingredient lists are read-only. They contain no checkboxes; selection happens
  only after the explicit `To shopping list…` action in the Ingredients heading.
- When an unquantified ingredient already has a specific note such as “to taste”, show
  that note without adding the generic “as needed” amount beside it.
- The shopping action opens the shared modal drawer on the right at desktop widths and
  full-screen at 900px and below. Every not-yet-added ingredient starts selected except
  an explicitly configured household staple such as water. Let people select all, clear
  the selection, resolve ingredient alternatives and confirm with a button that includes
  the selected count. Closing writes nothing and preserves the unfinished draft.
- After a successful write, replace the primary action with a persistent `In shopping
list · n` link and show an announced confirmation with View list and Undo. If some
  recipe lines remain, keep the add action available beside that status. If all lines are
  present, offer the explicit `Add another batch…` action; never double quantities silently.
- Verify the write before announcing success. A storage failure stays in the review and
  presents a localized error rather than implying the ingredients were saved.
- Recipe detail variants share the same Ingredients heading and read-only row primitives;
  recipe maturity may change the status copy or disable shopping, but not the layout.
- Source-backed recipe pages show the shared adjustment controls in English, Spanish and
  Ukrainian. Keep control labels, ingredient names, quantities, notes and shopping labels
  in the active locale. The supported numeric anchor is recipe-specific; recipes without
  one show the localized locked state instead of hiding the control.
- Store ingredient quantities in `quantity.base`, with an optional explicit
  `quantity.equivalent`. Only `base` is used for shopping and aggregation; the
  equivalent is a scaled cooking aid and never enters the shopping list. Use
  `shopping.mode: "nameOnly"` where buying a numeric amount is not meaningful.
  For dry ingredients covered by the shared spoon-weight table, `base` is always grams
  and the spoon equivalent is generated from that table. Show the secondary equivalent
  beneath it in quieter text rather than joining both values with parentheses. When
  quantities are scaled, scale both values from the same factor.
  An explicit author-confirmed recipe-specific measure may override the shared spoon
  equivalent in that recipe only; document the exception without changing other recipes.
- Ingredient choice is an explicit radio group in a review step. Never silently choose
  among alternatives offered by a recipe.
- Shopping persists in browser storage until an explicit removal. Checking means bought
  and does not reorder the row. Keep `Remove bought (n)` visible, keep `Clear all`
  secondary and confirm it, and provide Undo after removing one row.
- Preserve conditions and recipe provenance in shopping. Use a localized `For {recipe}`
  link, or `For n recipes` with source details after compatible quantities merge.
- Empty Saved and Shopping states explain the next practical action without decorative
  illustrations.

## Evidence badge

The badge contains an icon and explicit label. Supporting evidence or explanation sits next
to it in primary or secondary text. Approved states are defined in
`status-provenance.md`.

The label and explanation come from the active locale dictionary. The canonical evidence
state remains `tested`, `calculated` or `suggested`; a translated label must never become
the data value or strengthen the underlying evidence claim.

## Provenance note

Use close to recipe setup or an adaptation control. State what was actually baked and what
changed. Provenance must be visible before a user applies a calculated or suggested
variation.

## Cook Mode entry

- `RecipeRelatedLink` keeps related-recipe and reusable-component URLs canonical while
  recording a short-lived, same-tab return marker. `RecipeBackLink` consumes that marker,
  or a same-site recipe referrer, and then uses native history to return to the exact
  recipe. It otherwise remains an ordinary localized catalogue link, including without
  JavaScript. Never encode a parent recipe in the shareable URL.
- The recipe hero uses `RecipeSectionNavigation`: left-aligned native links labelled
  “Jump to ingredients” and “Jump to steps”, with decorative down arrows. These scroll
  to sections on the same page; do not style them as tabs or hide either section.
  Keep 44px targets, visible focus, wrapping translations and focusable destinations.
- `RecipeCookEntry` places one primary “Cook step by step” action beside the written
  method, with a short explanation of the separate, one-step-at-a-time view. On narrow
  screens it stacks below the method heading. Do not repeat the launch in the hero.
- Preserve the exact configuration and selected cream in the Cook URL. When cream
  selection is required, keep the existing “Choose cream first” entry instead.
- `/design-system#recipe-reading-actions` demonstrates the production back control,
  section navigation and cooking entry in Ukrainian, English and Spanish.
- A recipe with source-supported steps opens the shared step-by-step Cook Mode.
- The shared Cook Mode adapter preserves the active locale, ordered step media and
  localized image descriptions from the canonical recipe source. Route components must
  not rebuild or truncate that recipe data.
- When the source has no usable method, the action still opens a labelled unavailable
  state. It explains the missing source data and links back to the recipe record; it must
  not simulate cooking instructions or imply that the recipe can be cooked from the data.

## Step media sequence

- Image titles and captions are optional. Render a caption only when it adds information
  beyond the step instruction; preserve descriptive alternative text in every case.
  The caption-free example is `/design-system#concise-recipe`.

- Keep the step number on the same baseline as the step title. Optional timing or other
  compact metadata sits in its own row above both; explanatory copy and callouts remain
  below the title.
- Use one ordered sequence when several images explain distinct states within a single
  recipe step. Keep each image, title, caption and descriptive alternative text together.
- Show three images in a row on wide screens. From 561–900px, use a compact horizontal
  sequence with each frame near half the available width, so almost two states remain
  visible together. At 560px and below, enlarge each frame to roughly four-fifths of the
  viewport and leave part of the next frame visible as a scrolling cue.
- A single photo uses the same frame width and 4:3 aspect ratio as a photo in a sequence
  at every breakpoint; never expand it to fill the whole step. This applies to both
  recipe detail and Cook Mode.
- Multiple photos carry simple ordinal labels (`1`, `2`, `3`) rather than repeated
  fractions (`1 / 3`). A single photo has no number. On small screens the next-photo peek
  and horizontal scrolling communicate additional photos; the accessible region label
  retains the total count. See `/design-system#step-photography` for single and multiple
  photos in both variants.
- Localize captions, alternative text and the sequence label; image files remain shared
  across locales.
- Recipe detail and Cook Mode consume the same canonical step-media array, so an image
  approved for a recipe step appears on both surfaces in the same order.
- The matching responsive reference is `/design-system/napoleon-five-steps`; the legacy
  URL now renders the complete Ukrainian Napoleon through the shared recipe-detail
  composition and production styles.
- `components/recipe/step-media-sequence.tsx` is the only product renderer for ordered
  step photography. Recipe detail uses the `recipe` variant and Cook Mode uses the `cook`
  variant; route-specific copies are not allowed. Multi-image sequences expose a labelled,
  keyboard-focusable scroll region.

## Recipe ingredient rows

- `RecipeIngredientList` owns the read-only name, amount, equivalent and note layout used
  by recipe detail, per-step Cook quantities and the Cook ingredients drawer.
- Use `full` for recipe/drawer lists and `compact` inside a Cook step. Interactive shopping
  selection remains in the shared drawer and composes its own controls around canonical
  ingredient data.
- Dividers separate rows only. Never draw a line below the last row, including a
  single-item list; the surrounding Cook panel already provides its own bottom border.
  The Design Lab Cook tools example includes the production compact panel and full drawer.
- Route-specific ingredient needs use the shared item props: `notes` for multiple source
  qualifications and `after` for a related control such as the flour assistant. Do not
  recreate the amount/name grid around those differences.

## Recipe step guidance

- A checkpoint is optional: use it only for an additional observable decision cue.
  Short cues can live in the instruction itself. Never repeat the instruction as a
  checkpoint or image caption just to fill the component.

## Concise recipe reading

- Source and detailed recipes may opt into `presentation: 'concise'` after editorial review.
  This affects presentation only; publication and exact-version evidence stay separate.
- An author-confirmed Tested recipe in this layout omits working-record labels and
  editorial publication notes. Keep its written evidence badge. A tested base may use
  an empty evidence explanation for a badge-only overview; calculated/suggested
  configurations retain their scope explanation. The plum example in the Design Lab
  demonstrates this compact treatment and optional ingredients in parentheses.
  Hero image-origin overlays are omitted throughout the public product; image-origin
  metadata and the media record remain intact.
- A published recipe without recorded bake-test evidence does not inherit Tested and
  does not retain the contradictory “not ready to publish” working-record message.
- Published detailed recipes also omit draft-only editorial notes; their visible Tested,
  Calculated or Suggested evidence remains tied to the exact recipe configuration.
- A concise working recipe shows its editorial publication note once beside the
  ingredients and does not repeat the same note at the end of the page.
- Use one category, Ingredients heading and Method heading. Hide a single redundant
  ingredient-section title; keep titles when multiple groups need differentiation.
- Adjustment controls show the anchor's canonical base amount and yield, with recorded
  geometry next to the base summary when present (for example a 28 cm crepe pan).
  At 1×, retain base evidence; show Calculated with its icon and untested qualification when changed.
  Show fractional-egg guidance only for an actual fractional quantity. Ingredients with
  explicit `scaling: 'fixed'` retain their amount (for example one pinch of salt).
- Shared section headings support omitting eyebrows without leaving an empty label.
- Detailed recipes preserve canonical per-step ingredients and timer phase links.
  Concise mode omits repeated duration/temperature metadata and automatic image titles;
  concise step metadata may carry one useful time-and-temperature label when the body
  does not repeat it. Explicit instructions, timers, image descriptions and useful
  captions remain available.
- The multilingual interactive reference is `/design-system#concise-recipe`.

- `RecipeStepContent` owns the shared reading order on recipe detail and in Cook Mode:
  heading and contextual assistant action, optional tip, instruction, then optional
  checkpoint. A tip always appears before the instruction.
- Keep `Ask about this step` in the heading row on wide screens. Let it wrap below the
  heading on narrow screens and preserve a 44px target.
- `RecipeStepGuidance` renders both `checkpoint` and `tip` semantics inside that structure.
  Preserve the icon and written label; colour only reinforces the meaning.
- Use the compact `inline` tip variant for practical advice. Its warm background,
  terracotta rule, icon and written label separate advice from the recipe instruction.
  Use the default checkpoint treatment for the observable completion cue: its icon, label
  and message share one vertically aligned row, with long messages allowed to wrap. Reserve
  `prominent` for critical guidance before an action.

## Contextual assistant drawer

- Recipe Assistant and Cook Assistant use the shared `components/assistant` drawer; do
  not create route-specific drawer implementations.
- The trigger passes the canonical recipe/version, active locale, exact displayed
  configuration and canonical step IDs. Displayed step numbers or translated titles are
  never used as API identities.
- Required states are idle, loading, success, empty, error with retry when allowed, and
  disabled. Loading disables all submit paths and closing aborts the current request.
- Suggested-question buttons and the typed composer use the same submit path. Conversation
  context is limited to four messages of 1,500 characters, questions are limited to
  2,000 characters, and history is not persisted after the drawer closes.
- Missing or invalid server runtime configuration returns the localized disabled state;
  composer and submit actions remain disabled while the recipe stays usable.
- Structured answer blocks keep generated explanation separate from server-owned evidence.
  Tested, Calculated and Suggested always use their written localized label and icon.
- The modal drawer traps focus, closes with Escape, returns focus to its trigger and
  announces each new answer through a polite live region.
- Initial focus and focus during loading stay on Close, which remains available.
  Loading is announced politely; errors use one alert and localized fallback copy,
  including when the browser is offline.
- Use the compact drawer-title token for the localized Recipe and Cook Assistant title;
  it is a contextual tool heading, not a page or recipe title.
- When enlarged text leaves less than 24em of drawer width, use the compact header
  without its decorative mark and scroll the complete drawer. Keep the composer,
  answers and Close reachable at 200% text size.

## Navigation

The Recipes navigation item returns to the home recipe collection, using the same URL as
the Bake Again wordmark. Saved and Shopping list remain separate primary destinations;
About comes last so the practical destinations stay together. Without the local Drafts
destination, all four links remain on one row at 390px in every supported language. A
clear language switcher stays separate. Drafts appears only in a development build on
localhost, 127.0.0.1 or ::1. Its route and unpublished recipe/Cook Mode URLs are
unavailable outside that local environment, including production on localhost. Privacy
remains in the footer.

### Language switcher

- Use the native language names: English, Español and Українська; do not use flags.
- The trigger shows the active locale as text. The menu uses a visible selected indicator
  in addition to colour.
- It must be a labelled keyboard-operable menu with 44px minimum targets and visible
  focus.
- Changing language navigates to the equivalent locale-specific URL; it does not replace
  page content in place.

### Search behaviour

- `RecipeSearchForm` is shared by the homepage and Design Lab; submit with Enter or
  the button using a GET URL (`q`, optional `collection`, and `#recipes`). Retain the
  query in the input. Collection navigation keeps the query; View all clears both.
- Match localized recipe titles, dish categories, canonical ingredient names and
  collection titles across English, Spanish and Ukrainian. Every meaningful query
  word must match. Exact titles rank first, followed by title words/curated aliases,
  ingredients and collections/categories. Ignore case, accents and punctuation.
- `content/recipes/search.ts` owns curated alternative dish names and word forms.
  Млинки/млинчики/налисники find млинці; оладки find the fritter recipes. These dish
  families remain distinct. Allow word prefixes of at least three letters and one
  small typo in words of at least five letters, at a lower rank.
- Show the query, result count and any active collection above the existing cards.
  Empty results explain how to retry and keep View all available. Long queries wrap.
- This is catalogue discovery, not an allergy/exclusion filter or a recipe advisor.
  Search metadata never changes ingredients, recipe evidence or publication status.

## Cook tools and persistent timer

- Ingredients and all-steps panels use the existing Drawer with a rightward dismiss direction, the assistant drawer width token, full viewport height and full width on mobile.
- A fixed header contains a 24px display title and a labelled 48px Close button; the body scrolls independently. Escape, focus containment and focus return come from the shared primitive.
- An active timer on another step is shown as a compact button with remaining time and step title. Pressing it returns to that step. Do not announce every tick to screen readers.
- The Design Lab Cook tools example uses the production drawer classes and ingredient-list component.

## Shared evidence badge

- `EvidenceBadge` owns its default inline-flex layout, icon spacing and semantic status colours. Callers may extend layout, but cannot be required to provide styles for the icon and text to align.
- Preserve icon plus written status in every context, including a calculated quantity result.

## Reusable recipe components and author video

- Fixed components (filling, frosting, glaze) retain separate source recipes, but their
  ingredients and steps are composed inline in the host recipe. Optional component
  links use the existing section-navigation pattern; cooking never requires opening
  another page. Stage names use existing step metadata.
- Standalone glazes use the same detail composition as creams. Keep flour and catalogue
  Save hidden for linked-only components. Calculated components never inherit Tested.
- `StepMediaSequence` accepts optional `type: 'video'`. Use native controls, playsInline,
  muted initial playback, metadata preload, no autoplay and contain fitting in the same
  4:3 frame. Include a descriptive accessible label and a concise descriptive caption when useful.
  `/design-system#step-photography` demonstrates the production video variant.
- Public recipe images use descriptive alt text without image-origin overlays or
  author/AI captions (editorial decision, 2026-09-26). Preserve internal media provenance;
  removing a label must never reclassify an image or upgrade recipe evidence.

## Analytics behavior

Shared controls emit the events defined in `lib/analytics/umami.ts` after their relevant
action, without changing focus, labels or visual states. Search records submission
without its text; persistence actions record confirmed changes. Existing Design Lab
examples retain these handlers, but analytics never loads on the Design Lab route.

## Release states (2026-09-27)

- Optional host + cream compositions use Suggested unless that exact version has a
  separate successful-bake record. The overview names the base and cream evidence
  separately; mathematical scaling does not promote Suggested to Calculated or Tested.
- The cream selector describes the choice without claiming all combinations are tested.
  Adaptation query states do not emit the base Recipe JSON-LD identity.
- Cook Mode uses the same localized evidence badge and canonical localized method as
  recipe detail. Explicit ingredient amounts in prose follow scaling; time and
  temperature remain source values. Existing canonical step groups preserve sessions.
- Mobile Cook navigation uses wrapping flex buttons so Spanish “Anterior” stays intact.
  Enlarged text moves actions onto separate rows. ResizeObserver measures the navigation
  height so the method keeps enough bottom space above the fixed actions, plus semantic
  spacing. Header tools wrap and evidence never shrinks into letter columns.
- `NotFoundContent` reuses the personal-page spacing and shared Button. The localized
  404 keeps a focusable heading, recovery link, header skip link, and HTTP 404 status.
- `/design-system#release-states` demonstrates compositions and missing pages in all
  three languages. The existing Cook tools/reading examples use canonical recipe URLs.


## Scaling consistency (2026-09-27 re-audit follow-up)

- The recipe method renders the configured steps, as Cook Mode does. Keep the unscaled
  source for the quantity controls so the selected factor is applied exactly once.
- Preparation notes refer to the displayed ingredient amounts. A substitution can state
  its ratio (one banana per tablespoon of sugar), not a fixed batch amount that becomes
  wrong when the recipe is scaled. This wording also works in saved shopping entries.
- An unresolved Napoleon configuration cannot start Cook Mode. Show the localized reason
  and a link back to the same query; never replace it with a Tested base or restore/write
  a base session. Supported configurations preserve existing session identities.
- The initial server-rendered Cook screen uses the requested configuration too; hydration
  must not introduce a transient base version or a different status.
- `/design-system#scaling-consistency` demonstrates the 2× method, preparation note and
  blocked Cook explanation in UK/EN/ES with existing components and semantic tokens.

## Pre-publication configuration recovery

- `RecipeConfigurationUnavailable` reuses Cook Mode's unavailable styling. Its `detail`
  variant displays a localized heading, reason and explicit base-recipe link. Unsupported
  geometry or scale must not render base quantities, a Tested badge or Recipe JSON-LD.
- Recovery and Cook navigation use native anchors, preserving query parameters and
  working with or without JavaScript. A base reset removes configuration parameters
  only after the reader chooses it.
- Napoleon custard egg mentions use structured quantities; assembly specifies six layers
  per cake, while the configured yield states the cake count. Time and temperature stay fixed.
- Apple-fritter sugar has a shopping base in tablespoons. Known older unquantified saved
  entries recover that amount from their exact version and configuration, preserving
  sources, additional batches and checked state. Unknown sources remain intact.
- `/design-system#scaling-consistency` includes these quantities and the detail recovery
  variant in UK/EN/ES at 2×.

## Prepared step questions (2026-09-27)

- Extend the existing assistant drawer and shared link Button; do not create a separate
  FAQ or chat shell. Recipe Detail and Cook Mode show `Step questions` only for steps
  with an explicit editorial help decision. Basic steps have no local help trigger.
- Prepared questions open recipe-backed answers locally without loading, API requests,
  actions or evidence badges. A book icon and written `Answers from the recipe` label
  distinguish these from generated replies. Selecting an answer moves keyboard focus
  to the answer and announces its availability; Escape returns to the exact trigger.
- Keep selected questions visible for switching answers. Source quantities are resolved
  after scaling; composed creams retain their own questions. Grouped steps combine only
  their own prepared answers. Do not add universal mixing/texture prompts.
- The separately labelled typed-question composer is shown only where live assistance
  is supported. Its next request includes the selected prepared question and answer.
  A general typed-question entry remains available on simple steps in supported Cook Mode.
- `/design-system#step-questions` demonstrates the production drawer in UK/EN/ES without
  any live API dependency. All text wraps at 390/900/1440px and 200% text enlargement.

### Custom assistant verification and limits

The existing assistant drawer includes a localized browser allowance note: 5 custom
questions per rolling two hours and 10 per day. Prepared answers are unlimited.
The existing composer defers verification until field focus/input; submit waits for a
fresh token. A localized status and retry control keep verification outages recoverable.
Prepared questions remain usable through every verification or AI failure. The widget
uses Cloudflare's flexible size; text uses semantic tokens. The contextual assistant
example in the Design Lab demonstrates the composer and offline-verification state.
