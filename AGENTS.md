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

- Before any Instagram strategy, account setup, post, Reel, Story or advertising task,
  read [the Instagram working document](docs/strategy/instagram.uk.md), its publication
  register and the relevant linked post records. Use these files across chats.
- Distinguish user-approved decisions, proposals and verified completed actions.
  Do not turn an earlier assistant recommendation into an approved decision.
- After meaningful Instagram work, update the working document's current state,
  next action and dated activity log. Keep the publication register and affected post
  records current; preserve published copy and append later corrections/results.
- Use [the post record template](docs/instagram/post-template.uk.md) for concrete
  content drafts. Record recipe identity/version, copy, media paths, language, CTA,
  actual destination URL and any known previous related posts before creating more.
- A draft is not a publication. Record publication only after a verified platform
  result or the user's confirmation, with its permalink when available. Account
  creation, publishing, scheduling and ad spending require authorization in the
  current task or existing conversation; this documentation is not that authorization.
- Keep passwords, recovery codes, access tokens and private audience data out of
  these documents. Recipe facts and adaptation evidence come from canonical recipe
  files; source media and social exports stay outside `public/`.
