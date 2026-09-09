# Accessibility and localisation

## Accessibility baseline

- Target WCAG 2.2 AA for product interfaces.
- Normal text requires at least 4.5:1 contrast; large text at least 3:1.
- Status, errors and selection cannot rely on colour alone.
- Use semantic landmarks, ordered headings and labelled controls.
- Provide visible keyboard focus and preserve logical tab order.
- Images need useful alternative text when they communicate recipe content.
- Support 200% text enlargement without hiding content or actions.
- Respect `prefers-reduced-motion`.

Approved status label/background contrast:

- Tested: 6.44:1.
- Calculated: 5.59:1.
- Suggested: 5.23:1.

## Localisation

- Initial languages: English, Spanish and Ukrainian.
- Use one stable recipe identity across languages.
- Persist an explicit language choice.
- Components must accommodate longer translations without truncating essential text.
- Avoid text baked into images.
- Keep unit, decimal and plural formatting locale-aware.
- Status meaning must remain equivalent across translations; do not translate it into a
  stronger claim.

