# Product patterns

## Shared link preview

- The homepage and other non-recipe public pages share the 1200 × 630 image at
  `media/web-source/social/bake-again-share-v4.png`, published as the generated
  `/social/bake-again-share-v4.webp`. The card uses the approved surface, text and
  terracotta colours with the author’s Napoleon photograph with tea and ivory linen; food remains dominant.
- Open Graph and Twitter metadata include an absolute image URL, dimensions and
  descriptive alt text. Titles and descriptions remain localized in HTML metadata.
  Recipe pages continue to use their own recipe photographs.
- `/share-image-v4.webp` (and the retained `/share-image.webp` alias) serves the prepared WebP from the generated
  `/social/bake-again-share-v4.webp` asset through a Worker route. This adds the
  `image/webp` response type required by link-preview crawlers on Sites.
- The Design Lab colour section displays the production sharing image.

## Home discovery

Order: promise and search, food image, practical entry points, three starting recipes,
short Tested explanation. Collection links filter the catalogue by stable reader-facing
collection IDs; a recipe may appear in more than one collection. These links help
decision-making and are not permanent taxonomy.

On mobile, the first-screen search is a single row with an icon submit action so the
food image enters view sooner. The same GET search and collection behaviour applies.

At phone widths, the catalogue starts 32px after the discovery panel, with 24px
between its heading and cards. Keep 48px after the catalogue instead of desktop-scale
trailing whitespace. The editorial hero remains larger than the catalogue heading.

The Tested explanation links directly to the testing section of the localized About page.

Published catalogue order is curated per language in `content/recipes/catalog-order.ts`.
Mix breakfast, everyday baking and celebration recipes among the first six cards.
This is editorial placement, not a popularity claim. Keep the same DOM/keyboard order
at every viewport width; do not group or reorder cards with CSS to force desktop rows.
Collection filters preserve the locale's relative order. Search relevance takes
precedence, with editorial order breaking ties. Draft/all editorial inventories retain
source order. Newly published recipes without a curated position appear at the end
in source order; ordering never publishes a draft. Seasonal changes are explicit edits
to the same lists. Design Lab shows the first six published cards in uk/es/en.

## Editorial story page

The About page opens with a personal introduction and a pair of original family
photographs. Preserve their full proportions, put ages in semantic captions rather
than in the image, and stack the photographs below 620px. Age labels are supplied
by the family, never inferred from EXIF. Follow the story with an existing food
photograph and a direct recipe/catalogue link. The story-title token scales from
40 to 64px and supports Ukrainian, Spanish and English.

The About page keeps the family story concise and follows it with the practical testing
method. Use one editorial headline, a short standfirst and a restrained pull quote; do not
turn the page into a personal-feed or lifestyle-blog layout. The testing section reuses the
canonical status icons, labels and semantic colours. It must state that calculated and
suggested changes do not inherit the Tested status of the original recipe.

The About status section has one heading, a short version-scope introduction,
the three status definitions, then the adaptation note. Omit the redundant eyebrow
and the link to the immediately following section. Preserve the `how-we-test` anchor
for incoming links. A subtle 1px divider separates it from the story: 32px on each
side at compact widths, 48px on desktop. Do not stack extra trailing padding inside
the closing copy. Design Lab uses the production `AboutRecipeStatuses` component.

## Publication and local drafts

- Each recipe source owns `publicationStatus`: `published` or `unpublished` (`archived`
  remains a non-visible lifecycle state for detailed records).
- The public catalogue, search and featured link show published records only.
- Unpublished records appear in the local Drafts catalogue and remain accessible by
  recipe and Cook Mode links only in development on loopback hosts.
- Publication is an explicit editorial decision. Tested evidence does not automatically
  publish a record, and publication never changes evidence or translation review.
- Moving an existing recipe to `published` is done in its `.recipe.ts` source after review.
  All existing draft records were migrated to `unpublished` without being promoted.

## Recipe planning

Active time counts hands-on work, not unattended baking, chilling or cooling. Total
elapsed time runs until the recipe is ready, accounting for overlapping work and any
sequential trays. When cooling or tray count is unknown, do not invent an exact total:
show active time and the known waiting/baking phases in the planning note.

Show evidence, time, yield, difficulty and the exact flour mix before ingredients. Keep
equipment and geometry out of the overview; show consequential size constraints in recipe
setup and adjustment controls. Keep the verified base recipe selected by default. Display
independent constraints such as baking size first. Below them, let the user choose one quantity method:
direct batch scaling or scaling from an available anchor ingredient. Size and quantity may
be combined; the two quantity methods may not.

On a phone, place the recipe return link and Save control in one compact row inside
the hero, directly above the title. Omit the category label there; it should not
delay the recipe name and practical facts. Keep the category visible in the wider
hero layout and preserve native return-link behaviour.

The written method has a short section name and a step count. Keep the separate
guided Cook Mode action explicit; its label should describe starting that mode rather
than repeat the section heading.

On phones, each written step begins with a compact row containing its number, optional
time/temperature and optional Questions action. Place the title on its own full-width
line below, followed by practical guidance, the instruction, checkpoint and photos.
Do not reserve an empty time or question row for steps without those elements.

On mobile recipe detail, lead with the Ingredients heading and shopping action. Put a
collapsed quantity adjustment directly above the ingredient rows, so readers can see
the recipe before opening its controls. Keep a changed scale and its status visible in
the closed control; open invalid configurations to expose the error.

The mobile Ingredients heading owns a full-width row. Shopping actions wrap below it,
including the existing-list and additional-batch state; never squeeze the heading
between controls. Preserve 44px or larger targets.

Long Tested explanations may use a native disclosure with the exact-version Tested
summary. Keep the complete source explanation accessible. Calculated and Suggested
scope stays visible. Keep concise yield in the overview and size guidance in setup
and the method. Mobile cream choices initially show complete names and the written
recommendation; Compare creams reveals descriptions and recipe links without selecting
a cream or changing evidence.

When a concise yield already includes the exact geometry label (for example, a 24 cm cake),
do not repeat that same label on a second line in the quantity controls.

Links between recipes stay canonical and do not encode a parent recipe. A short-lived,
same-tab marker records an ordinary transition between recipes without changing the URL;
a same-site recipe referrer provides a secondary signal. The visible back link then uses
native browser history to return to that exact recipe. Direct visits, shared links and
external referrers fall back to the localized catalogue. Keep ordinary links so the
browser's own Back action retains the same history naturally.

When a recipe needs advance planning, each pre-start note uses one aligned heading row:
clock icon and written “Keep in mind” label together, with the explanation indented below
the label. Preserve that relationship when the copy wraps on narrow screens. Technique
help needed before starting follows this same treatment, without a nested tip card or
lightbulb; keep its guide link inline in the explanatory sentence.

## Cook Mode

For staged assembly, give each distinct action its own step and matching photo.
Keep required actions (such as leaving a 2 cm cream-free edge) in the body; use the
existing tip treatment to explain why. The sponge-roll example in Design Lab shows
this in Ukrainian, English and Spanish. Cream-dependent assembly steps follow the
selected cream's preparation together, in order, in both recipe detail and Cook Mode.
Before a cream is selected, recipe detail still shows the entire host method, including
filling and decoration. Selection adds the chosen cream's preparation and quantities;
it never gates reading the host's assembly instructions.

Show one focused step, the quantities used at that moment and an observable completion
cue. Keep the work column stable and left-aligned; use a 36–40px desktop step heading and
a 28–32px mobile heading rather than display-page scale. Critical guidance appears before
cooking and again at the relevant step.

Cook Mode puts the action and readable 16px timing metadata before contextual tools.
Questions and the labelled wake-lock control follow the instruction, quantities and
checkpoint in a wrapping tools row. Keep the compact navigation row above the title.
The full ingredients drawer retains canonical section headings and configured amounts.
Where several timing phases belong to a step, offer every canonical duration with its
localized phase label. The cook selects and starts each phase explicitly; never change
oven temperature or advance stages automatically. Running timers lock duration choice;
pause/reset, persistence and step IDs retain their existing behavior.

The primary action is `Done, next`: it completes the current canonical step IDs and moves
forward in one action. `Previous` is secondary. Previewing through `All steps` never marks
a step complete, and finishing the last step opens a completion state with a private local
note. On mobile the two actions stay in a safe-area-aware bottom bar; on larger screens
they remain inside the work column, 32px after the content.

Cook Mode progress represents completed screens, not the current position. Persist the
current canonical step ID, completed canonical IDs, a timer end time and the completion
note per recipe version and exact configuration. Note changes save automatically with a
visible saved or failed state. `Return to recipe` and `Cook again` never discard a saved
note. Starting again opens a clean session and surfaces the previous note before step one.
A running timer continues across step navigation and reloads.
Offer a 44px, visibly labelled `Keep screen awake` control near the current step where
the browser supports Screen Wake Lock. Show when it is active or when the request
fails; release it on exit and re-request it after the tab becomes visible if the
reader still wants it. Keep the Cook Mode header to navigation, recipe identity and
evidence. Put AI questions beside their current step instead of in the header.

Consecutive canonical steps may share a documented Cook composition group. The edited
crepes recipe now combines adding milk and resting in the canonical `add-milk` step,
so both recipe detail and Cook Mode show four steps with the rest timer preserved. A short action does
not need a decorative image: use quantities, a timer or a checkpoint only when they help
the cook decide what to do next.

## Adaptation

Present the base configuration, proposed change, evidence status and consequences before
application. Never alter a Tested base recipe silently.

## Personal state

`Save` initially means Want to bake. `Baked` is separate and may carry a private local
note. Completing Cook Mode records Baked without silently adding the recipe to Want to
bake. Recipe detail shows the latest date and note while the exact version/configuration
remain attached to the local record. Shopping-list items retain their recipe source and persist until explicit removal.
Recipe ingredients are read-only; the drawer is the only selection surface and the
shopping-list checkbox means bought.

## Responsive composition

Responsive does not mean shrinking desktop. Preserve the information order, move secondary
actions below the primary task and keep touch targets at least 44px. At 390px, recipe cards
use one column and long translated strings wrap naturally.

## Recipe configuration across screens

- Selected batch/available ingredient and selected cream travel in the URL and survive reload, language switches and entry to Cook Mode. Shopping and Cook read the same deterministic configuration as the visible ingredient list.
- Keep base evidence distinct from an adjusted configuration; changed quantities and yield are Calculated. Do not automatically multiply known preparation or resting times. Fixed ingredient quantities remain fixed.
- Invalid non-positive input shows a local error and disables quantity-dependent purchasing rather than silently presenting base quantities as a valid adjustment.
- Quiet, left-aligned links in the hero explicitly say “Jump to ingredients” and “Jump
  to steps”, with down arrows. They navigate within the page, never switch tab panels.
  Keep the reading order: overview, consequential preparation, quantity/ingredients,
  then method. On small screens, favour concise controls and natural wrapping.
- The primary “Cook step by step” action appears beside the method, with one sentence
  explaining the focused cooking view. A secondary “Ask about this recipe” action
  explicitly opens the recipe-wide assistant; step questions sit beside their title
  on wider screens and beside number/time on phones. Omit the Cook action's former hero duplicate. The hero's
  “Jump to steps” link gives returning readers a direct route to it.
- Use the shared Button's default terracotta variant for Cook entry, next/finish
  and restart actions, consistent with primary actions elsewhere in the product.
  The method section starts with 48px desktop / 32px compact-screen padding, followed
  by 32px from the heading/action group to the first rule and 16px before the first
  step content. Use spacing tokens, not accumulated one-off gaps.
- Language changes preserve query/filter, cream and recipe configuration, plus the existing section anchor.
