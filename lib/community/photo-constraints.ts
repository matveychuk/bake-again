/** Public file-selection limits, shared with the server's admission validator. */
export const COMMUNITY_PHOTO_MAX_BYTES = 2 * 1024 * 1024;
/** Larger phone photos are accepted and re-encoded in the browser before upload. */
export const COMMUNITY_PHOTO_SOURCE_MAX_BYTES = 25 * 1024 * 1024;
export type PhotoMime = 'image/jpeg' | 'image/png' | 'image/webp';
export const validPhotoMime = (value: unknown): value is PhotoMime =>
  value === 'image/jpeg' || value === 'image/png' || value === 'image/webp';
