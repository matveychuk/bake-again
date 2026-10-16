# Optional video lessons

`video-lessons.ts` is the single catalogue. The initial Napoleon lesson is a **planned**
product, proposed as the first recipe integration; it has no video, price or checkout
link. All three recipe translations show a quiet preparation notice after the method.
No other recipe, Cook Mode or print view receives the offer. This is a new commerce
state, never a Tested/Calculated/Suggested badge.

- `planned`: preparation copy, disabled action, no checkout URL or analytics click.
- `available`: exact version match, valid paid price and HTTPS Payhip product URL.
- `withdrawn`: no visible block. A missing/version-mismatched/invalid record is hidden.

The catalogue pins a `recipeVersionId`; changing a recipe requires checking the lesson
again. Recipe scaling and cream/substitution changes never alter the lesson or extend
its evidence. The available block states the video language and base-recipe scope.

`RecipeVideoLesson` composes the shared `EditorialInvitation`, `SectionTitle` and
`Button`. Newsletter uses the same editorial strip. Native navigation works without
JavaScript; no widget, video player, checkout SDK or new database is needed. Purchase,
receipt and lesson access happen on Payhip. A return URL or click is not proof of
purchase; this implementation grants no local entitlement and sends no account data.
The `video_lesson_open` event records recipe/product IDs and UI locale only, never
checkout URLs, email, payment results or query strings. Local QA is excluded.

## Activate when the real lesson is ready

1. Confirm the first recipe and exact filmed version; retain the source-quality video
   in that recipe's `original/` or `working/` location. Create a separate optimized
   delivery copy, captions and accurate product description (language, duration,
   content, access terms and price). Do not reuse the two existing free trial products.
2. Create the final Payhip product/course using the already connected payment setup.
   Review delivery and language behaviour on phone through the actual customer flow.
   A successful paid order/refund and receipt/access check require a separately
   authorized transaction. Stripe connection alone is not a completed payment test.
3. Set `status: 'available'`, the canonical `https://payhip.com/b/<id>` product URL,
   `priceMinor` (integer minor units), `currency` and actual video `language`.
   Price is editorial, not synchronized automatically: update it whenever Payhip changes.
   Payhip's displayed checkout total and taxes remain authoritative.
4. Update the initial-catalogue test, run `test:commerce`, analytics tests, typecheck,
   lint, build and rendered/browser checks at 390/900/1440 in UK/ES/EN. Confirm ordinary,
   keyboard and middle-click navigation using the real approved destination.
5. Release the catalogue change. To stop offering the lesson, set `withdrawn`; manage
   existing buyers' access separately in Payhip. Never turn refunds into local access
   decisions without a verified server integration.

Design Lab `/design-system#video-lessons` uses an explicitly labelled fictional €12
example with a disabled button and no checkout link. It does not set a real price.

Provider references reviewed for the plan (2026-10-16):
[website links/widgets](https://help.payhip.com/article/68-add-payhip-to-your-website),
[hosted video](https://help.payhip.com/article/336-video-subscription),
[store language/currency](https://help.payhip.com/article/234-store-language-and-currency).
