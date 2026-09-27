# Website media

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
