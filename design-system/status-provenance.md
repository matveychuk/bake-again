# Status and provenance

Status describes the evidence for one exact recipe configuration or adaptation. It is not
a general quality score for the recipe family.

## Tested

- Meaning: this exact version was baked successfully.
- Icon: check.
- Label colour: `#853C29`.
- Background: `#F4E6DF`.
- Supporting evidence may name the flour mix, form or repetition count.
- Examples: `Tested · Schär Mix B`, `Tested · Made many times`.

## Calculated

- Meaning: quantities were scaled mathematically.
- Icon: calculator.
- Label colour: `#52616B`.
- Background: `#EDF0F2`.
- Required explanation: `Quantities scaled. This version has not been bake-tested.`

A tested original recipe may have a Calculated variation. The original keeps its Tested
record; the new configuration does not inherit it.

## Suggested

- Meaning: an untested proposed change, commonly a substitution or technique variation.
- Icon: lightbulb.
- Label colour: `#805C26`.
- Background: `#F6EEDD`.
- Required explanation: `An idea to try. This change has not been bake-tested.`

## Usage rules

- Always show icon and written label together.
- Keep explanatory text dark chocolate for readability.
- Do not use `Made many times` as a standalone status.
- Published recipe cards omit the repeated Tested statement; exact evidence remains
  on recipe detail and adaptation controls. Local draft cards use a separate Working
  recipe label, never an evidence badge.
- Recipe setup and adaptation controls show the full scope and explanation.
- Never describe AI-generated guidance as Tested.
- Assistant explanation and limitation blocks are unbadged. Only server-owned evidence may
  carry Tested or Calculated; model-proposed changes always carry Suggested with the
  localized not-bake-tested qualification.
