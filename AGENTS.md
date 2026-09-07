# Bake Again implementation rules

Before changing product UI, read `design-system/README.md` and the relevant file in
`design-system/`. The approved visual baseline is **Warm Precision / Review applied**.

## Required

- Use semantic tokens from `design-system/tokens.css`. Do not introduce raw UI colours,
  arbitrary spacing, or new typefaces inside product components.
- Reuse an existing Bake Again component or extend it with a documented variant before
  creating a parallel component.
- Keep recipes and food visually dominant. Interfaces should feel quiet, editorial and
  practical rather than rustic, wellness-led, or SaaS-like.
- Keep recipe content concise and surface practical facts before story content.
- Treat provenance as adaptation-specific. Never let a calculated or suggested change
  inherit the Tested status of its original recipe.
- Preserve the status words and icons. Colour may reinforce status but cannot be its only
  signal.
- Test layouts at 390px, 900px and 1440px. Allow long Ukrainian, Spanish and English copy
  to wrap without clipping.
- Use visible keyboard focus, semantic HTML, labelled controls, descriptive image text and
  AA contrast for normal text.
- Do not make medical or universal health claims about gluten-free eating.

## Status language

- **Tested**: this exact version was baked successfully. Check icon.
- **Calculated**: quantities were adjusted mathematically; this version was not
  bake-tested. Calculator icon.
- **Suggested**: an untested proposed change such as a substitution. Lightbulb icon.

`Made many times`, the flour mix and the pan size are supporting evidence under Tested;
they are not separate statuses.

## Change workflow

1. Update the machine-readable token or component source.
2. Update the matching Design Lab example and documentation.
3. Verify responsive behaviour and accessibility.
4. Record meaningful system changes in `design-system/CHANGELOG.md`.

