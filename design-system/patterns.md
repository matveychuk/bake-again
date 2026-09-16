# Product patterns

## Home discovery

Order: promise and search, food image, practical entry points, three starting recipes,
short Tested explanation. Practical links help decision-making and are not permanent
taxonomy.

## Recipe planning

Show outcome, time, yield, form or preparation geometry, exact flour mix and evidence
before ingredients. Keep the verified base recipe selected by default. Display independent
constraints such as baking size first. Below them, let the user choose one quantity method:
direct batch scaling or scaling from an available anchor ingredient. Size and quantity may
be combined; the two quantity methods may not.

## Cook Mode

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
note per recipe version. A running timer continues across step navigation and reloads.
Offer a 44px `Keep screen awake` control where the browser supports Screen Wake Lock.

Consecutive canonical steps may share a documented Cook composition group. The crepes
flow presents `add-milk` and `rest` as one two-action screen, so five canonical recipe
steps become four Cook screens without changing recipe provenance. A short action does
not need a decorative image: use quantities, a timer or a checkpoint only when they help
the cook decide what to do next.

## Adaptation

Present the base configuration, proposed change, evidence status and consequences before
application. Never alter a Tested base recipe silently.

## Personal state

`Save` initially means Want to bake. `Baked` is separate and may carry a private local
note. Shopping-list items retain their recipe source and persist until explicit removal.
Recipe ingredients are read-only; the drawer is the only selection surface and the
shopping-list checkbox means bought.

## Responsive composition

Responsive does not mean shrinking desktop. Preserve the information order, move secondary
actions below the primary task and keep touch targets at least 44px. At 390px, recipe cards
use one column and long translated strings wrap naturally.
