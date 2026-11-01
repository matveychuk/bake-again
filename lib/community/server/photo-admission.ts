/** Server-side upload admission. Never return Storage URLs or service credentials. */
export const PHOTO_ADMISSION_TTL_SECONDS = 120;
import {
  COMMUNITY_PHOTO_MAX_BYTES,
  validPhotoMime,
  type PhotoMime,
} from '../photo-constraints.ts';
export {
  COMMUNITY_PHOTO_MAX_BYTES,
  validPhotoMime,
  type PhotoMime,
} from '../photo-constraints.ts';
export const COMMUNITY_PHOTO_BUCKET = 'community-photo-probe';
const photoUuid =
  /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
const photoHex = /^[a-f0-9]{64}$/;
export const validPhotoId = (value: unknown): value is string =>
  typeof value === 'string' && photoUuid.test(value);
export const validPhotoSecret = (value: unknown): value is string =>
  typeof value === 'string' && photoHex.test(value);
export class PhotoAdmissionError extends Error {
  readonly status: number;
  constructor(code: string, status: number) {
    super(code);
    this.status = status;
  }
}
export async function photoSha256(bytes: Uint8Array): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', Uint8Array.from(bytes));
  return Array.from(new Uint8Array(digest), (n) =>
    n.toString(16).padStart(2, '0'),
  ).join('');
}
export const photoAdmissionHash = (id: string, token: string) =>
  photoSha256(
    new TextEncoder().encode(`community-photo-admission-v1\0${id}\0${token}`),
  );
export interface PhotoAdmissionCommand {
  id: string;
  contribution_id: string;
  owner_hash: string;
  admission_hash: string;
  request_hash: string;
  mime: PhotoMime;
  expected_bytes: number;
  sha256: string;
}
export interface PhotoAdmissionReceipt {
  id: string;
  state: 'issued' | 'receiving' | 'stored' | 'failed' | 'revoked' | 'expired';
  expiresAt: number;
}
export interface ClaimedPhotoAdmission {
  id: string;
  contributionId: string;
  mime: PhotoMime;
  expectedBytes: number;
  sha256: string;
  objectBase: string;
  expiresAt: number;
}
export interface PhotoAdmissionRepository {
  issue(command: PhotoAdmissionCommand): Promise<PhotoAdmissionReceipt>;
  claim(id: string, admissionHash: string): Promise<ClaimedPhotoAdmission>;
  complete(id: string, admissionHash: string): Promise<void>;
  fail(id: string, admissionHash: string): Promise<void>;
}
/** Only a trusted issuer may supply authorContext, AFTER owner proof,
 * same-origin/anti-spam checks and network/browser quotas. No public
 * issuer endpoint is mounted yet. Email cannot supply these author privileges.
 * The client generates and retains uploadToken before the request, so retry of
 * issuance never requires storing a raw token or silently extending the expiry.
 */
export async function preparePhotoAdmission(
  raw: unknown,
  authorContext: {
    contributionId: string;
    ownerHash: string;
    checksPassed: true;
  },
): Promise<PhotoAdmissionCommand> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw))
    throw new PhotoAdmissionError('INVALID_REQUEST', 400);
  const input = raw as Record<string, unknown>;
  const keys = ['id', 'uploadToken', 'mime', 'bytes', 'sha256'];
  if (
    Object.keys(input).length !== keys.length ||
    Object.keys(input).some((key) => !keys.includes(key)) ||
    !validPhotoId(input.id) ||
    !validPhotoSecret(input.uploadToken) ||
    !validPhotoMime(input.mime) ||
    typeof input.bytes !== 'number' ||
    !Number.isInteger(input.bytes) ||
    input.bytes < 1 ||
    input.bytes > COMMUNITY_PHOTO_MAX_BYTES ||
    !validPhotoSecret(input.sha256)
  )
    throw new PhotoAdmissionError('INVALID_REQUEST', 400);
  if (
    !validPhotoId(authorContext.contributionId) ||
    !validPhotoSecret(authorContext.ownerHash) ||
    authorContext.checksPassed !== true
  )
    throw new PhotoAdmissionError('FORBIDDEN', 403);
  const fingerprint = JSON.stringify([
    input.id,
    authorContext.contributionId,
    input.mime,
    input.bytes,
    input.sha256,
  ]);
  return {
    id: input.id,
    contribution_id: authorContext.contributionId,
    owner_hash: authorContext.ownerHash,
    admission_hash: await photoAdmissionHash(input.id, input.uploadToken),
    request_hash: await photoSha256(new TextEncoder().encode(fingerprint)),
    mime: input.mime,
    expected_bytes: input.bytes,
    sha256: input.sha256,
  };
}
