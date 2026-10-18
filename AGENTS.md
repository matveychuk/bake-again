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

## Media publishing

- Follow [the media storage map](docs/media-storage.uk.md): recipe sources and PDF
  masters belong to the recipe; Reel/carousel packages belong to their IG post.
  Check live dependencies before removing obsolete versions and preserve camera
  originals, current masters and publication history.

- Keep the source-quality version of every website image under `media/web-source/`,
  mirroring its intended public path. Do not put source PNG/JPEG files in `public/`.
- Product code must reference the generated `.webp` URL. Use concise descriptive alt
  text and keep food visually dominant.
- Run `npm run media:prepare` after adding or renaming media. It generates only files
  referenced by product code, caps images at 1800 px wide, strips metadata, uses WebP
  quality 82 and enforces a 64 MiB media budget. It runs automatically before `dev`
  and `build`.
- Preserve camera originals and working files under `media/recipes/*/original/` or
  `working/`; they are not publishable assets. Promote a reviewed copy to
  `media/web-source/` when it is ready for the site.
- Never bypass the media preparation step or copy an entire source/original directory
  into a deployment bundle.

## Downloadable files

- Before creating or editing any recipe PDF, read
  [the reusable PDF recipe rules](design-system/pdf-recipes.uk.md) and
  [the recipe PDF package](templates/recipe-pdf/README.uk.md). Use its data structure,
  prepared fonts and generator where they fit the recipe; extend a documented variant
  when needed. Keep the 390 × 720 mobile format, website ingredient/guidance patterns,
  visible cooking tools and clean consumer copy. Quantities, units, timings, yield,
  flour identity and evidence must come from that recipe and explicit author corrections,
  never from the crepe example.

- Optimize every file intended for customer download (PDF, image, video or archive)
  for its delivery channel before uploading or linking it on the website, in a bot
  or in messages. Use the smallest practical size that preserves readability and
  useful visual quality; an upload size limit is not a target size.
- Keep source-quality originals and create a separate optimized delivery copy.
  For PDFs, compress and resize embedded images while preserving sharp text,
  recipe content, layout and working links.
- Record the final file size, inspect the optimized output and test opening it on
  a phone through the actual delivery link or button. Distinguish HTTP download
  timings from phone opening and saving; record only confirmed results.

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

## Instagram continuity

- For every new Instagram/Facebook caption, follow the approved trilingual rule in
  `docs/instagram/templates.uk.md`: language navigator, primary language first,
  then concise summaries in the other two languages (UA/ES/EN). Video, cover and
  CTA use one primary language. Preserve published copy and version caption updates.

- For new Reels and Stories, apply the approved food-first defaults in
  [Instagram templates](docs/instagram/templates.uk.md) and reuse
  [the Reel package](templates/instagram-reels/README.uk.md): compact header,
  soft feathered header-to-image transition on every shot, large fixed badge,
  horizontal opening stamp, and a separate full-screen Story export.

- Prepare a separate static Reel cover following
  [the cover and profile-grid rules](docs/instagram/templates.uk.md#окрема-обкладинка-reel-і-сітка).
  Check the full 9:16 image, cropped 3:4 and 4:5 previews, a small three-column grid,
  and the actual platform crop before publishing. Keep the title, gluten-free badge
  and food visible; preserve the previous cover. A cover does not require changing
  the approved video composition.

- Before any Instagram strategy, account setup, post, Reel, Story or advertising task,
  read [the Instagram working document](docs/strategy/instagram.uk.md), its publication
  register and the relevant linked post records. Use these files across chats.
- Keep the append-only [publication history](media/instagram/publication-history.uk.md)
  current, including deleted posts and repeat publications. New post packages live in
  `media/instagram/IG-XXX/for-phone/`; local review files are not Instagram drafts.
- Give every Instagram package a searchable human name as well as its ID:
  `Reels — Topic — IG-XXX`, `Карусель — Topic — IG-XXX`,
  `Сторіс — Topic — IG-XXX` or `Допис — Topic — IG-XXX`.
  Maintain a named folder link in `media/instagram/` to its existing `IG-XXX/`
  source and record it in `media/instagram/publication-names.uk.json`. Do not
  duplicate media or break existing paths. New Photos albums and iCloud Notes use
  `Format — Topic — IG-XXX — vN`; record the actual names of older handoffs.
- Distinguish user-approved decisions, proposals and verified completed actions.
  Do not turn an earlier assistant recommendation into an approved decision.
- After meaningful Instagram work, update the working document's current state,
  next action and dated activity log. Keep the publication register and affected post
  records current; preserve published copy and append later corrections/results.
- Use [the post record template](docs/instagram/post-template.uk.md) for concrete
  content drafts. Record recipe identity/version, copy, media paths, language, CTA,
  actual destination URL and any known previous related posts before creating more.
- Deliver finished publication materials through iCloud by default, following
  [the publication handoff rules](docs/instagram/templates.uk.md#передача-готових-матеріалів-через-icloud).
  Sasha confirmed the matching Apple Account and working sync on 2026-10-11.
  Import optimized final slides, video and cover into a regular Mac Photos album
  named `Format — Title — IG-XXX — vN`; put the caption, numbered alt descriptions and
  posting instructions in an identically named iCloud Note. Keep the local
  `for-phone/` package and originals. Record Mac import and phone availability
  separately; use AirDrop/ZIP only as a fallback. Handoff does not publish or schedule.
- A draft is not a publication. Record publication only after a verified platform
  result or the user's confirmation, with its permalink when available. Account
  creation, publishing, scheduling and ad spending require authorization in the
  current task or existing conversation; this documentation is not that authorization.
- Keep passwords, recovery codes, access tokens and private audience data out of
  these documents. Recipe facts and adaptation evidence come from canonical recipe
  files; source media and social exports stay outside `public/`.
