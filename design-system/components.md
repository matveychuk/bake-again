# Base components

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
- Save control remains secondary to opening the recipe.
- Do not show a flour matrix or multiple adaptation badges on the card.

## Personal state

- Save is a 44px circular secondary control with a bookmark icon and an explicit
  programmatic pressed state. Its accessible name changes between Save and Remove.
- Shopping rows use a labelled checkbox, quantity, recipe source and a separately
  labelled remove control. A checked item remains readable; colour is not its only cue.
- Use `BakeCheckbox` for every product and Design Lab checkbox. Its checked state is a
  warm-brown fill with a warm-white checkmark.
- An ingredient list keeps prep checkboxes separate from its `Add all` shopping action.
  Place that action with a shopping-bag icon in the Ingredients heading.
- Recipe detail variants share the same Ingredients heading and prep-checkbox primitives;
  recipe maturity may change the status copy or disable shopping, but not the layout.
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

## Navigation

Primary destinations: Recipes, Saved and Shopping list, followed by a clear language
switcher. About and Privacy remain in the footer.

### Language switcher

- Use the native language names: English, Español and Українська; do not use flags.
- The trigger shows the active locale as text. The menu uses a visible selected indicator
  in addition to colour.
- It must be a labelled keyboard-operable menu with 44px minimum targets and visible
  focus.
- Changing language navigates to the equivalent locale-specific URL; it does not replace
  page content in place.
