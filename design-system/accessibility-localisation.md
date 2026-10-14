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
- The shared `/recipes/crepes` entry uses the saved language first, then browser
  language, then Ukrainian. Explicit localized links retain their language and
  the existing switcher keeps the visitor on the same recipe. This entry is a
  temporary, non-cacheable redirect; it adds no language-selection screen.
- The main `/` entry and `/recipes` catalogue alias use the same automatic
  language preference; explicit `/uk`, `/es` and `/en` links retain priority.
- Components must accommodate longer translations without truncating essential text.
- Use the locale-aware display token for headings. Ukrainian must use Literata rather than
  relying on a browser fallback for Newsreader's unavailable Cyrillic glyphs.
- Avoid text baked into images.
- Keep unit, decimal and plural formatting locale-aware.
- Status meaning must remain equivalent across translations; do not translate it into a
  stronger claim.
- Assistant titles, prompts, composer labels, lifecycle states, retry text and disclaimers
  are available in English, Spanish and Ukrainian. Long questions and answers wrap rather
  than truncate at 390px, 900px and 1440px.
- A newly completed assistant response is announced with `aria-live="polite"`. The drawer
  uses modal focus containment, Escape dismissal and focus return to the exact trigger.
- Catalogue and card images require locale-specific alternative text. Draft recipe copy
  may be translated for discovery, but incomplete source material remains visibly draft
  and is not released as a publishable recipe translation.

## Review verification

- Verify 390, 900 and 1440px widths in Ukrainian, English and Spanish. Include long recipe names, quantity errors, shopping review and Cook drawers.
- At 200% root text, headings and actions wrap; prevent horizontal scrolling without clipping text.
- Every standard page starts with a keyboard-visible skip link to its own main heading or recipe content target. The recipe navigation item remains active on recipe pages.
- Native language labels remain explicit (`Укр`, `English`, `Español`); changing language must not reset the selected recipe configuration.
