# Recipe media

Store camera originals and videos under `media/recipes/<recipe-id>/original/`.

Keep working files under `media/recipes/<recipe-id>/working/`. Both locations are kept
out of the deployment bundle, and camera originals remain ignored by Git until a
separate backup workflow is approved.

When an image is ready for the website, place its source-quality PNG or JPEG under
`media/web-source/`, mirroring the desired public path. For example:

```text
media/web-source/images/recipes/banana-bread-card-v1.png
  -> /images/recipes/banana-bread-card-v1.webp
```

Reference the `.webp` URL from product code, then run `npm run media:prepare`. The
script creates only referenced delivery assets in `public/`, resizes images wider than
1800 px, removes metadata, uses WebP quality 82 and enforces a 64 MiB publish budget.
It runs automatically before local development and production builds. Source-quality
files remain in GitHub; generated delivery files do not.
