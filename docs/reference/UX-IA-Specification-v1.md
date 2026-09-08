# Gluten Free Baking UX and Information Architecture Specification v1

## Purpose

This document records the agreed product behaviour and information architecture before visual identity work or implementation begins.

The product should help an ordinary home cook answer three questions quickly:

1. Is this recipe relevant to what I want to bake?
2. Can I trust this exact version with my flour, form and quantity?
3. What do I need to do next to get the intended result?

The launch product is a small trusted gluten-free baking collection. It should not imitate a large recipe database, traditional food blog or general AI cooking assistant.

## Decision status

Agreed:

- Recipe-first structure.
- EN, ES and UK as three localized versions of the same recipe entities.
- Practical situations as the main Home discovery model.
- One Recipes surface with simple search and a small number of filters.
- Recipe Detail has Planning view and Cook Mode.
- Provenance is attached to each adaptation, not only to the recipe as a whole.
- The verified base recipe remains the default.
- Form changes and serving or batch changes are separate controls.
- Save means Want to bake in the initial product.
- Baked is a separate state.
- Private notes are local and associated with a baked recipe.
- Shopping-list items retain their recipe sources.
- Critical guidance appears before cooking and again at the relevant step.
- First low-fidelity recipe cases: Crinkle Cookies as the simple recipe and Napoleon as the complex recipe.
- Crepes are the third utility test case.

Not decided in this workstream:

- Product name.
- Visual identity, colours and typography.
- Final photography system.
- Exact public launch recipe set.
- Exact implementation framework details beyond the existing engineering direction.

## Product principles

### Trust before volume

Do not publish an incomplete recipe to make the catalogue appear larger. A smaller set of complete recipes is a better MVP than all 17 verified recipes with missing timings, methods, forms or photographs.

### Practical before editorial

Title, outcome, time, yield, form, flour, ingredients and method come before background story. Editorial context remains below the working recipe.

### Specificity builds confidence

Use exact commercial flour mixes, weights, additional starches, form dimensions and observable checkpoints wherever the author can verify them.

### Honest uncertainty

Calculated, author-guided and suggested adaptations must not inherit the status of the verified base recipe.

### One recipe across languages

Language versions share a stable recipe identity, provenance, saved state, current Cook Mode step and shopping context.

### Deterministic utility first

Known arithmetic and state changes should use normal application logic. AI may explain or navigate trusted information but should not perform basic calculations or silently rewrite recipe data.

## Primary Jobs to be Done

### Find a familiar recipe that works gluten-free

When I want pancakes, cookies, cinnamon rolls or a familiar cake, help me reach one credible recipe without comparing a large number of uncertain options.

### Check whether the recipe fits what I have

When I have a specific flour mix, form and amount of time, show me whether this exact recipe was tested in that context before I commit.

### Choose for an occasion and available effort

When I need an everyday breakfast or a celebration cake, help me distinguish a quick active process from a long multi-stage recipe.

### Adapt quantity safely

When I need another batch size, yield or form, change only what the product can calculate responsibly and explain what has not been tested.

### Use a known variation

When I want less fat, less sugar, another flour, another filling or another form, distinguish a tested variation from guidance or an idea.

### Cook without rereading the entire page

When my hands are busy, show one large step, the quantities used now and the sign that tells me the step is complete.

### Build a personal trusted repertoire

When a recipe works for me, let me record that I baked it and preserve a private note so I can repeat it confidently.

## Information architecture

### MVP

```text
/{locale}
  Home

/{locale}/recipes
  Search
  Practical filters
  Saved view

/{locale}/recipes/{localizedSlug}
  Recipe Detail Planning view
  Cook Mode as a state of the same recipe

/{locale}/shopping-list
  Local shopping list

/{locale}/about
  Short project and family story

/{locale}/privacy
  Privacy and local-storage explanation
```

Recommended global navigation:

- Recipes.
- Saved.
- Shopping list.
- Language switcher.

About and Privacy belong in the footer.

Use a stable `/recipes/` route segment in each locale and a localized recipe slug. Saved state and links must use the stable recipe ID rather than the slug.

### Shortly after MVP

```text
/{locale}/my-recipes
  Want to bake
  Baked
  Recently viewed
  Private notes

Within Recipe Detail
  Validated additional forms
  Ingredient-based matching
  More flour compatibility evidence
  Contextual recipe assistant
```

The assistant remains inside recipe and search contexts. It is not a top-level navigation destination.

### Later

```text
/{locale}/account
/{locale}/collections
/{locale}/household
```

Only add these destinations when cross-device sync, custom collections or household sharing create a demonstrated reason for an account.

## Core journeys

### Search to successful bake

Search result → localized Recipe Detail → concise outcome → exact test scope → ingredients → Cook Mode → Baked → private note → return visit.

Recipe Detail must work as a complete landing page without relying on prior homepage context.

### Instagram to recipe

Food post or reel → exact localized recipe or variation → same visible food context → recipe setup → save or cook.

Do not send social traffic to a generic homepage when a canonical recipe exists.

### Home or catalogue to recipe

Practical situation or search → small relevant result set → recipe card → Recipe Detail.

Discovery should reduce uncertainty rather than maximize browsing time.

### Recipe to tested variation

Base recipe → review variation and its status → explicitly apply it → ingredients and affected instructions update.

Never modify the verified base silently.

### Recipe to form or quantity change

Recipe setup → select form, yield or batch → review status and consequences → apply only if supported.

Form, yield and batch must not be represented by one generic control.

### Recipe to shopping list

Active recipe configuration → add missing ingredients → confirm items → combine compatible quantities → retain recipe sources → check off purchases.

### Returning user

Saved or Baked → last used recipe configuration → private note → repeat Cook Mode.

## Home

Recommended order:

1. Product promise and search.
2. Strong food image.
3. Practical entry points.
4. Three starting recipes.
5. Short explanation of what Tested means.
6. Relevant seasonal content.
7. Short About teaser and Instagram connection.

Default practical entries:

- For breakfast.
- Something for every day.
- For a celebration.
- Can be prepared ahead.
- I just want to bake something.

These are navigation aids, not permanent taxonomy commitments.

## Recipe catalogue

The catalogue contains all public recipes, simple search and at most a few filters that reliably return useful results.

Recommended initial filters:

- Everyday.
- Breakfast.
- Celebration.
- Prepare ahead.
- Saved.

Search should match localized recipe titles, important ingredients and documented flour mixes. Filter combinations should not create indexable URLs.

Recipe cards show:

- Food image.
- Localized title.
- Recipe type or situation.
- One or two useful facts.
- A concise test statement.
- Open recipe.
- Save.

Do not show detailed provenance, multiple variation badges or a flour compatibility matrix on a card.

## Recipe Detail Planning view

### Search and sharing layer

- Localized URL, metadata and social preview.
- Recipe structured data.
- Self-canonical and hreflang alternates.
- Breadcrumbs.

### Identity and promise

1. Hero image.
2. Localized title.
3. One-sentence result description.
4. Active time, total elapsed time, difficulty and yield.
5. Form or required equipment.
6. Concise test summary.

Example test summary:

```text
Made many times
Tested with Schär Mix B
12 layers in a 28 cm format
```

### Primary actions

Recommended priority:

1. Start cooking.
2. Save.
3. Add ingredients to shopping list.
4. Print and share as secondary actions.

Do not expose Save, Favourite and Want to bake as three separate concepts in the MVP.

### Before you start

Show only information that materially affects planning or success:

- Chilling, proofing, cooling or maturation time.
- Form or equipment that must be prepared.
- A critical technique that prevents a likely failure.

Examples:

- Napoleon needs dough chilling and 12–24 hours of maturation after assembly.
- Roll Napoleon layers directly on the parchment used for baking.
- Crinkle-cookie dough needs 3–4 hours of chilling and may be held for up to 24 hours.

### Recipe setup

- Verified base version.
- Active yield or batch.
- Active form.
- Exact flour mix and additional starches.
- Tested variations.
- Status of every change.

### Ingredients

- Metric weights where appropriate.
- Logical ingredient groups.
- Ingredient checkboxes.
- Exact commercial flour mix.
- Conditional xanthan or starch guidance.
- Quantities derived from the active supported configuration.
- Add missing ingredients action.

### Instructions

Each step may contain:

- Instruction.
- Ingredients and quantities used now.
- Authored duration.
- Equipment or temperature.
- Checkpoint.
- Practical tip.
- Process image where it prevents misunderstanding.

### After the method

1. Cooling, storage and make-ahead information.
2. Additional tested variations.
3. Baked state and private note.
4. Short practical background.
5. A small number of related recipes.

## Cook Mode

Cook Mode inherits the active verified or supported recipe configuration.

It provides:

- Pre-cook summary of flour, form, temperature and advance preparation.
- One prominent step at a time.
- Large readable text.
- Progress.
- Ingredients and quantities used in the current step.
- Checkpoints and practical tips attached to the relevant step.
- Previous and Next controls.
- Authored timers only where an explicit timing exists.
- Screen wake lock where supported.
- Return to full recipe without losing position.
- Completion action to mark the recipe Baked.

Do not overlay a persistent chat window. A later Ask about this step action may open contextual help.

## Guidance model

Do not store all practical information in one generic Tips field.

### Instruction

An action required by the verified method.

Example: let crepe batter rest for 15–30 minutes.

### Checkpoint

An observable sign that tells the cook whether the result is correct.

Example: crinkle-cookie cracks should still look moist when the cookies leave the oven.

### Practical tip

A technique that makes a step easier or less fragile without changing the recipe identity.

Example: roll a Napoleon layer on the parchment used for baking so the thin layer does not need to be transferred.

### Placement rules

- Critical advance information appears in Before you start.
- Every checkpoint or tip also appears beside its relevant step.
- Cook Mode reads the same structured guidance object rather than duplicated text.
- Guidance can have its own tested or author-guidance status if required.

## Adaptations and provenance

Track status separately for:

- Base recipe.
- Flour mix.
- Yield or batch.
- Form.
- Sweetness or fat change.
- Dietary variation.
- Filling or flavour.
- Method change.
- AI suggestion.

Internal states and recommended public language:

| Internal state | Public language |
| --- | --- |
| repeatedlyVerified | Made many times |
| tested | Tested |
| calculated | Calculated for this quantity or form |
| authorGuidance | Author guidance, not tested in this exact version |
| suggested | Suggested, not tested |
| needsRetest | Not available until retested |
| draft | Not public |

Rules:

- Public status describes what was tested, not a confidence percentage.
- A tested flour does not imply that another flour is tested.
- A calculated form does not imply that layer count, cream volume or baking time is known.
- A user note cannot change public provenance.
- An AI answer cannot change recipe data or public provenance.
- Historical test states remain internal when a newer author-approved state supersedes them.

### Napoleon form example

The verified public option is 12 layers at 28 cm.

A 24 cm preview may show a mathematical area conversion, but it must remain unavailable to Cook Mode until the author decides how to handle fractional eggs, layer count and cream volume and then tests the result.

Do not show a custom form field until the product can produce a useful and honest result.

## Personal recipe memory

### MVP states

```text
Want to bake
Baked
Recently viewed
```

Save places a recipe in Want to bake. Completing Cook Mode offers Mark as Baked.

After marking Baked:

- Store the date locally.
- Store the recipe version and configuration used.
- Offer one private note.
- Explain that the note exists only on this device.

Recommended default: offer the note immediately after cooking, when details are fresh. The note may also be edited later in My Recipes.

Do not add a separate Favourite state until user behaviour demonstrates a meaning different from Want to bake.

## Shopping list

Each shopping-list entry retains:

- Canonical ingredient ID.
- Localized display name.
- Amount and unit.
- Source recipe.
- Ingredient section.
- Active variation.
- Active supported scale or form.
- Purchased state.

### Combination rules

Combine only when ingredient identity and units are compatible.

Examples:

- Schär Mix B from Crinkle Cookies and Napoleon can be totalled while retaining both source lines.
- Whole eggs and egg whites must remain distinct quantities.
- Granulated sugar and powdered sugar must remain distinct.
- Ranges such as 90–100 g butter must remain visible rather than being converted to a false exact total.

Default view groups by ingredient. A secondary view groups by recipe when the cook wants to verify that every recipe is represented.

### MVP shopping scope

- Add ingredients from a recipe.
- Retain recipe source.
- Combine clearly compatible quantities.
- Check off purchased items.
- Remove an item.

Defer aisle prediction, retailer integrations, household sharing and cloud synchronization.

## Conceptual recipe data model

This is a product model, not a final TypeScript schema.

```text
Recipe
  id
  status
  defaultVersionId
  localizations
    locale
    slug
    title
    promise
    ingredientNames
    instructionText
    metadata
  images
  categories
  situations
  versions
  relatedRecipeIds

RecipeVersion
  id
  label
  provenance
  flourConfiguration
  defaultYield
  supportedYields
  supportedForms
  ingredientSections
  steps
  storage
  makeAhead
  variations

Provenance
  state
  testedScope
  testedDate optional
  authorNote optional
  sourceVersion

FlourConfiguration
  commercialMix
  exactAmount
  additionalStarches
  xanthanRule
  testedAlternatives
  knownUnsupportedAlternatives

YieldOption
  id
  label
  amount
  unit
  provenance

FormOption
  id
  shape
  dimensions
  material optional
  layerCount optional
  provenance
  timingEffect optional

IngredientSection
  id
  localizedTitle
  ingredients

IngredientLine
  ingredientId
  amount
  unit
  preparation
  optional
  scalingRule

Step
  id
  order
  localizedInstruction
  ingredientReferences
  duration optional
  temperature optional
  equipment optional
  guidance
  image optional

Guidance
  id
  type: instruction | checkpoint | practicalTip
  localizedText
  placement: beforeStart | inline | both
  provenance optional

Variation
  id
  dimension
  localizedLabel
  localizedReason
  provenance
  ingredientChanges
  stepChanges
  constraints

PersonalRecipeState
  recipeId
  state: wantToBake | baked
  lastViewedAt
  bakedAt optional
  recipeVersionId optional
  selectedFormId optional
  selectedYieldId optional
  privateNote optional

ShoppingItem
  ingredientId
  localizedName
  sourceLines
  combinedAmount optional
  purchased
```

## MVP scope

### Include

- Responsive multilingual website.
- Home.
- Recipe catalogue and simple search.
- Complete Recipe Detail pages.
- Basic Cook Mode.
- Exact flour, form and test scope.
- Save or Want to bake.
- Mark Baked.
- Recently viewed.
- One local private note per recipe.
- Minimal local shopping list.
- Tested yield or batch presets where available.
- Print stylesheet.
- Recipe structured data, hreflang and localized metadata.
- Privacy-conscious analytics.

### Narrow

- Search remains simple and structured.
- Categories remain a few practical discovery entries.
- Scaling appears only where rules are supported.
- Flour compatibility begins as recipe-specific evidence.
- Shopping combines only clearly compatible ingredient quantities.

### Defer

- Full AI assistant.
- Arbitrary substitutions.
- Universal form calculator.
- Deep ingredient or pantry discovery.
- Accounts and cloud synchronization.
- Custom collections.
- Household sharing.
- Ratings, comments and community recipes.
- Nutrition scoring or wellness positioning.
- Recipe import.
- Native application and voice interaction.
- Subscription or premium gates.

## Publication readiness gate

A recipe is ready for public release only when it has:

- Complete ingredient quantities.
- Exact flour and additional starch or xanthan details.
- Default yield.
- Form or equipment dimensions where relevant.
- Active and total elapsed time.
- Complete ordered method.
- Critical checkpoints and practical guidance.
- Confirmed status for every public variation.
- Finished-food image suitable for publication.
- Reviewed EN, ES and UK content tied to the same recipe identity.

## Prototype recipes

### Crinkle Cookies

Purpose:

- Validate the simple Recipe Detail hierarchy.
- Validate long waiting time versus short active work.
- Validate one strong doneness checkpoint.
- Validate an optional variation whose status still needs confirmation.
- Validate completion, Baked and private-note flows.

### Napoleon

Purpose:

- Validate grouped ingredients and multi-stage steps.
- Validate exact flour composition.
- Validate advance planning.
- Validate inline technique guidance.
- Validate a verified less-rich base.
- Validate form conversion boundaries and provenance.
- Validate a large shopping list.

### Crepes

Purpose:

- Validate an everyday repeat-use recipe.
- Validate batter resting and consistency adjustment.
- Validate safe yield scaling after the default yield is captured.
- Validate returning-user notes such as pan heat or added liquid.

## Next work

Before visual identity exploration, create structured draft recipe objects for Crinkle Cookies and Napoleon using this model. That exercise should reveal missing fields, unclear provenance and any schema that is more complex than the real content requires.

After the two recipe objects are reviewed:

1. Simplify the model where possible.
2. Confirm the first public recipe set.
3. Define the recipe authoring and translation workflow.
4. Begin visual direction exploration using the approved wireframes.

## Source basis

- `sources/Gluten-Free_Baking_Brand_Strategy_v2.docx`
- `sources/Gluten-Free Baking — Product & Engineering Brief v1.md`
- `sources/recipe-products-deep-research-2026-uk.docx`
- `sources/recipe-inventory.xlsx`

Files under `sources/` remain read-only reference material.
