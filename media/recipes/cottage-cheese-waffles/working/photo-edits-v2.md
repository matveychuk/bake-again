# Cottage-cheese waffle photo edits, v2

Mode: built-in imagegen, `precise-object-edit`. The v1 JPEGs are the edit targets;
`media/style-references/warm-precision-kitchen-v1/kitchen-prep-closeup-4x3.png`
is a supporting material and colour reference. The seven v2 PNGs under
`media/web-source/` are the source-quality website assets. Product code refers to
their generated WebP versions.

## Hero

Input: `media/web-source/images/recipes/cottage-cheese-waffles-author-v1.jpeg`
Output: `media/web-source/images/recipes/cottage-cheese-waffles-linen-v2.png`

> Use case: precise-object-edit. Asset type: Bake Again recipe hero and catalogue photograph, landscape 3:2. Image 1 is the edit target: a real overhead photograph of four uneven golden berry cottage-cheese waffles on a pale green plate. Image 2 is only a reference for the established Warm Precision kitchen palette and materiality. Replace only the wooden table surrounding the plate with natural warm ivory linen covering the surface, with subtle believable folds and a quiet pale warm kitchen background at the far edge if visible. Keep the exact waffles, berry marks, golden grid shape, stacking, plate shape and pale green color, framing and overhead perspective recognizable from Image 1. Preserve candid real-food texture; use soft directional daylight, natural color and gentle shadows. Food remains dominant. No added fruit, toppings, props, text, branding or watermark. Do not turn this into an illustration or polished synthetic food photo.

## Process

For each frame, Image 1 was the v1 photograph with the same stem and `-author-v1.jpeg`
suffix; Image 2 was the supporting kitchen reference above. Each v2 file is in
`media/web-source/media/recipes/cottage-cheese-waffles/selected/`.

Shared prompt:

> Use case: precise-object-edit. Asset type: Bake Again recipe process photograph, landscape 3:2. Image 1 is the edit target: [subject]. Image 2 is a supporting reference of Bake Again's agreed Warm Precision kitchen. [background instruction] Keep the actual food, bowl/waffle maker, utensils, hand if present, arrangement, camera angle, crop and texture from Image 1. Soft directional daylight, natural color, believable shadows and candid real kitchen photography. Food and process remain visually dominant. No added ingredients, no invented step, no props, no text, no watermark.

| Output | Subject | Background instruction |
|---|---|---|
| `step-01-ingredients-before-blending-kitchen-v2.png` | White bowl holding the real cottage cheese, raw eggs and yogurt; preserve exact food arrangement. | Change only the dark grey worktop and peripheral background into the warm pale cream lightly speckled stone countertop of Image 2. |
| `step-01-blended-base-kitchen-v2.png` | White bowl holding the real smooth blended base with immersion blender; preserve its position and the visible liquid consistency. | Same as above. |
| `step-03-add-dry-kitchen-v2.png` | White bowl containing the real pale wet base topped with the exact mound of dry flour and the blender; preserve all visible process details. | Same as above. |
| `step-03-mixed-batter-kitchen-v2.png` | Real thick pale batter lifted on a spoon from a white bowl, with the real hand holding the spoon. | Same as above. |
| `step-05-fill-waffle-maker-kitchen-v2.png` | Real berry-speckled batter being spooned from a white bowl into the same black waffle maker, with the real hand. | Change only the grey and white worktop/background around the waffle maker into the warm pale cream lightly speckled stone countertop of Image 2. Preserve the waffle maker and cord. |
| `step-05-baked-waffles-kitchen-v2.png` | Two real golden berry cottage-cheese waffles in the same open black waffle maker. | Same as above. |

The first three process frames used the same wording with this ending:

> Keep the actual bowl, food, utensils, hands if any, arrangement, camera angle, crop and texture from Image 1. Make a candid real kitchen photograph, with believable shadow/contact and natural color. Keep food visually dominant. No added ingredients, no invented step, no props, no text, no watermark.
