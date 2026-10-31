/** Shared by the deployed Deno probe and local tests. No native Node modules. */
export const EDGE_PHOTO_MAX_BYTES = 2 * 1024 * 1024;
export const EDGE_PHOTO_MAX_PIXELS = 4_000_000;

export function photoFormat(bytes, mime, MagickFormat) {
  if (
    !(bytes instanceof Uint8Array) ||
    !bytes.length ||
    bytes.length > EDGE_PHOTO_MAX_BYTES
  )
    throw new Error('PHOTO_SIZE');
  const ascii = (start, end) =>
    String.fromCharCode(...bytes.subarray(start, end));
  const formats = {
    'image/jpeg': [
      bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255,
      MagickFormat.Jpeg,
    ],
    'image/png': [
      bytes[0] === 137 && ascii(1, 8) === 'PNG\r\n\x1a\n',
      MagickFormat.Png,
    ],
    'image/webp': [
      ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP',
      MagickFormat.WebP,
    ],
  };
  if (!formats[mime]?.[0]) throw new Error('PHOTO_FORMAT');
  return formats[mime][1];
}

/** Small-image trial limits reflect the hosted 256 MB / 2 CPU-second runtime.
 * 10 MiB/24 MP from the local sharp trial are NOT promised by this implementation.
 */
export function processEdgePhoto(bytes, mime, magick) {
  const {
    ImageMagick,
    MagickImageCollection,
    MagickReadSettings,
    MagickFormat,
  } = magick;
  const format = photoFormat(bytes, mime, MagickFormat);
  const settings = new MagickReadSettings();
  settings.format = format; // Force a safe raster decoder; never auto-detect SVG etc.
  const images = MagickImageCollection.create();
  try {
    images.ping(bytes, settings);
    if (images.length !== 1) throw new Error('PHOTO_ANIMATION');
    const image = images[0];
    if (
      !image.width ||
      !image.height ||
      image.width * image.height > EDGE_PHOTO_MAX_PIXELS
    )
      throw new Error('PHOTO_PIXELS');
  } finally {
    images.dispose();
  }
  return ImageMagick.read(bytes, settings, (image) => {
    if (image.format !== format) throw new Error('PHOTO_FORMAT');
    image.autoOrient();
    image.strip();
    const original = { width: image.width, height: image.height };
    const encode = (max, quality) => {
      const scale = Math.min(1, max / image.width, max / image.height);
      image.resize(
        Math.max(1, Math.round(image.width * scale)),
        Math.max(1, Math.round(image.height * scale)),
      );
      image.quality = quality;
      const data = image.write(MagickFormat.WebP, (data) =>
        Uint8Array.from(data),
      );
      return { data, width: image.width, height: image.height };
    };
    const web = encode(1600, 82);
    const thumbnail = encode(480, 78);
    return { original, web, thumbnail };
  });
}
