'use client';

import {
  COMMUNITY_PHOTO_MAX_BYTES,
  COMMUNITY_PHOTO_SOURCE_MAX_BYTES,
  type PhotoMime,
} from './photo-constraints';

const MAX_EDGE = 1600;
const hex = (bytes: ArrayBuffer | Uint8Array) =>
  Array.from(new Uint8Array(bytes), (n) =>
    n.toString(16).padStart(2, '0'),
  ).join('');
export const randomSecret = () =>
  hex(crypto.getRandomValues(new Uint8Array(32)));

export interface PreparedPhoto {
  blob: Blob;
  mime: PhotoMime;
}
function encode(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, type, quality),
  );
}
/** Re-encodes in the browser: applies orientation, removes camera metadata
 * (location included) and fits the server's 2 MiB limit.
 */
export async function preparePhoto(file: File): Promise<PreparedPhoto> {
  if (!file.size || file.size > COMMUNITY_PHOTO_SOURCE_MAX_BYTES)
    throw new Error('PHOTO_SIZE');
  const bitmap = await createImageBitmap(file, {
    imageOrientation: 'from-image',
  });
  try {
    for (const edge of [MAX_EDGE, 1200, 900]) {
      const scale = Math.min(1, edge / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const context = canvas.getContext('2d');
      if (!context) throw new Error('PHOTO_DECODE');
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      // Safari may not encode WebP; JPEG is the universal fallback.
      let blob = await encode(canvas, 'image/webp', 0.82);
      if (blob?.type !== 'image/webp')
        blob = await encode(canvas, 'image/jpeg', 0.85);
      if (
        blob &&
        (blob.type === 'image/webp' || blob.type === 'image/jpeg') &&
        blob.size <= COMMUNITY_PHOTO_MAX_BYTES
      )
        return { blob, mime: blob.type };
    }
    throw new Error('PHOTO_SIZE');
  } finally {
    bitmap.close();
  }
}

export interface ReviewSubmission {
  review: {
    operationId: string;
    authorToken: string;
    recipeId: string;
    name: string;
    email: string;
    text: string;
    rating: number | null;
  };
  /** Stable ids/tokens per photo, so a retry reuses the same permits. */
  photos: { id: string; uploadToken: string; photo: PreparedPhoto }[];
  token: string;
}
export class ReviewRequestError extends Error {
  readonly status: number;
  constructor(code: string, status: number) {
    super(code);
    this.status = status;
  }
}
export async function sendGuestReview(submission: ReviewSubmission) {
  const photos = await Promise.all(
    submission.photos.map(async ({ id, uploadToken, photo }) => {
      const bytes = await photo.blob.arrayBuffer();
      return {
        id,
        uploadToken,
        mime: photo.mime,
        bytes: bytes.byteLength,
        sha256: hex(await crypto.subtle.digest('SHA-256', bytes)),
      };
    }),
  );
  const response = await fetch('/api/community/reviews', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      review: submission.review,
      photos,
      token: submission.token,
    }),
    credentials: 'omit',
    referrerPolicy: 'no-referrer',
    signal: AbortSignal.timeout(30_000),
  });
  const result = (await response.json().catch(() => null)) as {
    ok?: boolean;
    status?: 'published' | 'pending';
    photos?: string[];
    error?: string;
  } | null;
  if (!response.ok || !result?.ok || !result.status)
    throw new ReviewRequestError(
      result?.error ?? 'UNAVAILABLE',
      response.status,
    );
  const admitted = new Set(result.photos ?? []);
  // Permits expire after 120 seconds, so upload them in parallel.
  const uploads = await Promise.all(
    submission.photos.map(async ({ id, uploadToken, photo }) => {
      if (!admitted.has(id)) return false;
      try {
        const upload = await fetch(
          `/api/community/photos?id=${encodeURIComponent(id)}`,
          {
            method: 'POST',
            headers: {
              authorization: `Bearer ${uploadToken}`,
              'content-type': photo.mime,
            },
            body: photo.blob,
            credentials: 'omit',
            referrerPolicy: 'no-referrer',
            signal: AbortSignal.timeout(110_000),
          },
        );
        return upload.ok;
      } catch {
        return false;
      }
    }),
  );
  return {
    status: result.status,
    photosAccepted: uploads.every(Boolean),
  };
}
