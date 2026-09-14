# Base components

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

- Primary: terracotta fill, warm-white text. One primary action per local task area.
- Secondary: transparent or warm-white surface, chocolate border and text.
- Text link: chocolate text with a restrained underline or arrow.
- Minimum touch target: 44×44px.
- Required states: default, hover, focus-visible, disabled and busy when applicable.

## Search field

- Warm-white surface, subtle chocolate border and search icon.
- Placeholder uses secondary text colour and must remain readable.
- Submit action uses the primary button treatment.
- On narrow screens the action may move below the input.

## Recipe card

- Food image first.
- Situation/category eyebrow.
- Recipe title in Newsreader.
- One or two practical facts only.
- One concise Tested statement.
- The image and complete lower content area open the recipe; the save control remains a
  separate secondary action and must stop event propagation.
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

## Personal state

- Save is a 44px circular secondary control with a bookmark icon and an explicit
  programmatic pressed state. Its accessible name changes between Save and Remove.
- Shopping rows use a labelled checkbox, quantity, recipe source and a separately
  labelled remove control. The remove action has a 44px hit area, but is shown as a
  standalone terracotta trash icon without a filled or white circular surface. Leave a
  clear gap after the quantity. A checked item remains readable; colour is not its only
  cue.
- Use `BakeCheckbox` for every product and Design Lab checkbox. Its checked state is a
  warm-brown fill with a warm-white checkmark.
- Ingredient-list checkboxes mean prepared; they never add shopping data. Keep them
  separate from the explicit `Add ingredients to shopping list` action in the Ingredients
  heading.
- The shopping action opens a review dialog with every not-yet-added ingredient selected.
  Let people uncheck what they already have, resolve ingredient alternatives, and confirm
  with a button that includes the selected count. Only confirmation writes to Shopping.
- After a successful write, replace the primary action with a persistent `In shopping
  list · n` link and show an announced confirmation with a direct link to Shopping. If
  some recipe lines remain, keep the add action available beside that status.
- Verify the write before announcing success. A storage failure stays in the review and
  presents a localized error rather than implying the ingredients were saved.
- Recipe detail variants share the same Ingredients heading and prep-checkbox primitives;
  recipe maturity may change the status copy or disable shopping, but not the layout.
- Source-backed translations may show the ingredient checklist without English-only
  adjustment controls. Keep ingredient names, quantities, notes and checkbox labels in
  the active locale.
- Store ingredient quantities in `quantity.base`, with an optional explicit
  `quantity.equivalent`. Only `base` is used for shopping and aggregation; the
  equivalent is a scaled cooking aid and never enters the shopping list. Use
  `shopping.mode: "nameOnly"` where buying a numeric amount is not meaningful.
  secondary equivalent beneath it in quieter text rather than joining both values with
  parentheses. When quantities are scaled, scale both values from the same factor.
- Ingredient choice is an explicit radio group in a review step. Never silently choose
  among alternatives offered by a recipe.
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

- The recipe page includes an explicit `Open Cook Mode` action before the ingredient list
  and beside the method when a method exists.
- A recipe with source-supported steps opens the shared step-by-step Cook Mode.
- When the source has no usable method, the action still opens a labelled unavailable
  state. It explains the missing source data and links back to the recipe record; it must
  not simulate cooking instructions or imply that the recipe can be cooked from the data.

## Step media sequence

- Keep the step number on the same baseline as the step title. Optional timing or other
  compact metadata sits in its own row above both; explanatory copy and callouts remain
  below the title.
- Use one ordered sequence when several images explain distinct states within a single
  recipe step. Keep each image, title, caption and descriptive alternative text together.
- Show three images in a row on wide screens. From 561–900px, use a compact horizontal
  sequence with each frame near half the available width, so almost two states remain
  visible together. At 560px and below, enlarge each frame to roughly four-fifths of the
  viewport and leave part of the next frame visible as a scrolling cue.
- Localize captions, alternative text and the sequence label; image files remain shared
  across locales.
- The matching responsive reference is `/design-system/napoleon-five-steps`; it shares the
  live `StepMediaSequence` component and its production styles.

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
- When enlarged text leaves less than 24em of drawer width, use the compact header
  without its decorative mark and scroll the complete drawer. Keep the composer,
  answers and Close reachable at 200% text size.

## Navigation

The Recipes navigation item returns to the home recipe collection, using the same URL as
the Bake Again wordmark. Saved and Shopping list remain separate primary destinations,
followed by a clear language switcher. About and Privacy remain in the footer.

### Language switcher

- Use the native language names: English, Español and Українська; do not use flags.
- The trigger shows the active locale as text. The menu uses a visible selected indicator
  in addition to colour.
- It must be a labelled keyboard-operable menu with 44px minimum targets and visible
  focus.
- Changing language navigates to the equivalent locale-specific URL; it does not replace
  page content in place.
