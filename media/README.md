# Bake Again media

Recipe originals and working assets live under `media/recipes/<id>/`; social
packages live under `media/instagram/IG-XXX/` and are linked from post records.
Recipe PDF working masters belong to the recipe, with optimized delivery copies
in `output/pdf/`. See [the storage map](../docs/media-storage.uk.md) for current
locations, the crepes v5 index and cleanup rules.

## Website media

Keep only website source assets under `media/web-source/`, mirroring their public
paths. Reference the generated `.webp` URL from product code. For example:

```text
media/web-source/images/recipes/banana-bread-card-v1.png
  -> /images/recipes/banana-bread-card-v1.webp
```

`npm run media:prepare` generates referenced assets in `public/`, caps raster width
at 1800 px, removes metadata from generated images, uses WebP quality 82 and enforces
a 64 MiB publish budget. It runs before development and production builds.
Source-quality files remain in Git; generated delivery files do not.

Camera originals, alternate edits, social exports and working files belong in local
ignored directories or a separate private archive. Do not commit or deploy them.
Removing metadata from generated WebP files does not clean metadata from the source
assets; review source files separately before making the repository public.

## Audit and retired website sources

`npm run media:audit` is read-only and lists source size, referenced count and unused
website sources. Check recipe masters, scripts, publication packages and histories
before archiving: no product reference does not mean no editing dependency.

On 2026-10-16, 14 unreferenced sources (33,801,629 bytes) were moved unchanged to
`media/archive/web-source-2026-10-16/` (ignored by Git). The tracked
[retirement manifest](web-source/retired-assets.json) records original paths,
archive paths, SHA-256 and the previous Git commit for recovery. Fifteen other
inactive sources remain because reference/editing dependencies exist. Camera originals,
current masters, social versions and publication history were preserved.

This reduces current source contents after commit/push; old Git commits still contain
previous versions. GitHub does not back up ignored local originals or this archive.
