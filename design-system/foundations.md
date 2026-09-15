# Foundations

## Colour

The core palette is light and restrained. Terracotta is an accent, not a page-sized fill.

| Semantic role | Value | Use |
|---|---:|---|
| Background / page | `#FAF6EF` | Main page canvas |
| Background / surface | `#FFFDF9` | Fields, cards and elevated light sections |
| Background / panel | `#EEE7DD` | Full-width discovery and secondary panels |
| Background / subtle | `#F3EDE5` | Image fallback and quiet separation |
| Text / primary | `#392721` | Headings, body text and strong controls |
| Text / secondary | `#735D54` | Supporting copy and metadata |
| Action / primary | `#A64F36` | Main CTA, brand punctuation and selected emphasis |
| Action / strong | `#853C29` | Hover, focus and Tested status text |

Avoid adding green to signal gluten-free. Gluten-free is communicated through words and
recipe evidence, not wellness colour conventions.

### Dark mode foundation

Dark mode is defined from v1 as an explicit semantic mode, but it is not enabled by
`prefers-color-scheme` yet. Product controls should activate it with
`data-theme="dark"` only after the complete recipe-reading and cook-mode flows have been
tested in both themes.

| Semantic role | Dark value |
|---|---:|
| Background / page | `#211A17` |
| Background / surface | `#2B211D` |
| Background / panel | `#342822` |
| Text / primary | `#F7EFE6` |
| Text / secondary | `#C8B7AC` |
| Action / primary | `#B85C3F` |
| Action / strong | `#CF7355` |

Dark mode should feel like espresso, toasted crust and warm evening light, not black UI.
Keep food photography natural; do not darken images or add a brown overlay globally.

## Typography

- **Display:** Newsreader. Use for English and Spanish page titles, section titles and
  recipe titles. Ukrainian uses Literata through the `displayCyrillic` semantic token:
  it has Ukrainian glyph coverage and retains the editorial character of the display role.
- **Body:** Manrope. Use for navigation, controls, ingredients, instructions and metadata.
- Display text may use italic Newsreader or Literata, according to locale, for a single
  phrase of editorial emphasis.
- Body copy starts at 16px. Regularly used controls and labels should be at least 14px;
  12px is reserved for compact supporting metadata.
- Use sentence case. Uppercase is limited to short eyebrows and evidence labels.

## Space

Base unit: 4px. Approved scale: `4, 8, 12, 16, 24, 32, 48, 64, 96`.

Prefer whitespace over decorative dividers. Use 24–32px between related blocks and
64–96px between major desktop sections.

## Shape

- Product surfaces are mostly square.
- Small functional labels use a 4px radius.
- Save controls and proof marks may be circular.
- Avoid stacks of rounded cards and large pill-shaped controls.

## Layout

- Page maximum: 1440px.
- Content maximum: 1360px.
- Shopping work-column maximum: 928px.
- Contextual drawer width: 480px on desktop; full viewport width at 900px and below.
- Desktop gutter: 40px.
- Mobile gutter: 20px.
- Reference widths: 390px mobile, 900px tablet and 1440px desktop.
- At 390px, the first viewport should reveal the start of the food image. The hero title
  must not consume the entire screen; target `52–56px` with a compact `0.93` line height.

## Photography

- Food is the subject; UI remains secondary.
- Use natural, directional light and real food texture.
- Surfaces may feel warm and tactile, but avoid rustic props, wellness clichés and heavy
  sepia grading.
- Crop closely enough to show structure: layers, crumb, edges and texture.
- Do not place essential interface text inside photography.

## Motion

Use motion only to clarify hover, focus or a state change. Standard transitions are
180–240ms. Respect reduced-motion preferences.
