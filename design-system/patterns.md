# Product patterns

## Home discovery

Order: promise and search, food image, practical entry points, three starting recipes,
short Tested explanation. Collection links filter the catalogue by stable reader-facing
collection IDs; a recipe may appear in more than one collection. These links help
decision-making and are not permanent taxonomy.

The Tested explanation links directly to the testing section of the localized About page.

## Editorial story page

The About page keeps the family story concise and follows it with the practical testing
method. Use one editorial headline, a short standfirst and a restrained pull quote; do not
turn the page into a personal-feed or lifestyle-blog layout. The testing section reuses the
canonical status icons, labels and semantic colours. It must state that calculated and
suggested changes do not inherit the Tested status of the original recipe.

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

When a recipe needs advance planning, each pre-start note uses one aligned heading row:
clock icon and written “Keep in mind” label together, with the explanation indented below
the label. Preserve that relationship when the copy wraps on narrow screens.

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
Offer a 44px `Keep screen awake` control where the browser supports Screen Wake Lock.

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
- Jump links near the hero take readers directly to ingredients and method. On small screens, favour concise controls, short cream cards and natural title wrapping over decorative whitespace.
- The main Cook action uses the primary treatment. Its repeat beside the method is secondary.
- Language changes preserve query/filter, cream and recipe configuration, plus the existing section anchor.
