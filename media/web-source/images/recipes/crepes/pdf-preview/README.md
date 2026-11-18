# Recipe invitation previews — 2026-11-18

These are faithful page renders, not generated illustrations or edited PDFs.

- `junior-card-a4.png`: page 1 of the existing public junior-cook card (A4),
  rendered at 900 × 1273. Delivery PDF: 253,284 bytes.
- `recipe-steps.png`: page 4 of the final recipe PDF v6 (390 × 720 page),
  rendered at 780 × 1440. Delivery PDF: 720,315 bytes.

Both public delivery PDFs match the author-supplied files in
`/Users/sasha/Bake Again Media/pdf/` by SHA-256. Masters are unchanged.
Website previews use generated WebP files from `media:prepare`. The card preview
opens as an image. After the owner's subsequent choice on 2026-11-18, both
thumbnail links enlarge images and the email promises both PDFs together.

Verification: the recipe invitation was inspected at 390, 900 and 1440 CSS px;
both previews loaded, with no horizontal overflow. Page images use `contain`
to preserve the complete PDF page. The local recipe PDF URL returned HTTP 200,
720,315 bytes, and the same SHA-256 as the existing delivery file. Opening or
saving on a physical phone and email delivery were not retested in this UI change.
