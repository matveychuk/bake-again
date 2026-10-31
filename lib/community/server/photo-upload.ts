import {
  PhotoAdmissionError,
  photoAdmissionHash,
  photoSha256,
  validPhotoId,
  validPhotoSecret,
  validPhotoMime,
  COMMUNITY_PHOTO_MAX_BYTES,
  type PhotoAdmissionRepository,
  type ClaimedPhotoAdmission,
  type PhotoMime,
} from './photo-admission.ts';

export interface PrivatePhotoWriter {
  /** Must write only under admission.objectBase, with no overwrite, private.
   * Check signal before every write. Do not expose unverified media or URLs.
   */
  put(
    admission: ClaimedPhotoAdmission,
    bytes: Uint8Array,
    signal: AbortSignal,
  ): Promise<void>;
}
const uploadJson = (body: unknown, status: number) =>
  Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer',
    },
  });

async function readPhotoStream(
  request: Request,
  max: number,
  signal: AbortSignal,
): Promise<Uint8Array> {
  if (!request.body) throw new PhotoAdmissionError('PHOTO_SIZE', 422);
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  let onAbort: () => void = () => {};
  const abort = new Promise<never>((_resolve, reject) => {
    onAbort = () => reject(new PhotoAdmissionError('UPLOAD_EXPIRED', 410));
    signal.addEventListener('abort', onAbort, { once: true });
    if (signal.aborted) onAbort();
  });
  try {
    for (;;) {
      const part = await Promise.race([reader.read(), abort]);
      if (part.done) break;
      length += part.value.length;
      if (length > max) throw new PhotoAdmissionError('PHOTO_SIZE', 413);
      chunks.push(part.value);
    }
  } finally {
    signal.removeEventListener('abort', onAbort);
    void reader.cancel().catch(() => {});
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  return bytes;
}

/** Internal handler factory: no production guest route/issuer is mounted yet.
 * A real distributed repository must atomically consume the permit BEFORE reads.
 * The bearer token is a capability for exactly this id/file, never an account.
 */
export function createPhotoUploadHandler(deps: {
  repository: PhotoAdmissionRepository;
  writer: PrivatePhotoWriter;
  inspect: (bytes: Uint8Array, mime: PhotoMime) => void | Promise<void>;
  allowedOrigin: string;
  now?: () => number;
}) {
  const now = deps.now ?? Date.now;
  return async (request: Request, id: string): Promise<Response> => {
    if (request.method !== 'POST')
      return uploadJson({ error: 'METHOD_NOT_ALLOWED' }, 405);
    if (
      new URL(request.url).origin !== deps.allowedOrigin ||
      request.headers.get('origin') !== deps.allowedOrigin ||
      request.headers.get('sec-fetch-site') === 'cross-site'
    )
      return uploadJson({ error: 'FORBIDDEN' }, 403);
    const bearer = request.headers.get('authorization');
    const token = bearer?.startsWith('Bearer ') ? bearer.slice(7) : null;
    if (!validPhotoId(id) || !validPhotoSecret(token))
      return uploadJson({ error: 'UPLOAD_FORBIDDEN' }, 403);
    const mime = request.headers.get('content-type');
    if (!validPhotoMime(mime))
      return uploadJson({ error: 'PHOTO_FORMAT' }, 415);
    const length = request.headers.get('content-length');
    if (
      length !== null &&
      (!/^\d+$/.test(length) || Number(length) > COMMUNITY_PHOTO_MAX_BYTES)
    )
      return uploadJson({ error: 'PHOTO_SIZE' }, 413);
    const admissionHash = await photoAdmissionHash(id, token);
    let claimed = false;
    let deadline: ReturnType<typeof setTimeout> | undefined;
    try {
      const admission = await deps.repository.claim(id, admissionHash);
      claimed = true;
      const checkDeadline = () => {
        if (request.signal.aborted || now() >= admission.expiresAt)
          throw new PhotoAdmissionError('UPLOAD_EXPIRED', 410);
      };
      checkDeadline();
      if (
        admission.id !== id ||
        admission.mime !== mime ||
        (length !== null && Number(length) !== admission.expectedBytes)
      )
        throw new PhotoAdmissionError('PHOTO_MISMATCH', 422);
      const controller = new AbortController();
      deadline = setTimeout(
        () => controller.abort(),
        admission.expiresAt - now(),
      );
      const signal = AbortSignal.any([request.signal, controller.signal]);
      const bytes = await readPhotoStream(
        request,
        admission.expectedBytes,
        signal,
      );
      checkDeadline();
      if (
        bytes.length !== admission.expectedBytes ||
        (await photoSha256(bytes)) !== admission.sha256
      )
        throw new PhotoAdmissionError('PHOTO_MISMATCH', 422);
      try {
        await deps.inspect(bytes, mime);
      } catch {
        throw new PhotoAdmissionError('PHOTO_INVALID', 422);
      }
      checkDeadline();
      await deps.writer.put(admission, bytes, signal);
      checkDeadline();
      // SQL rechecks the database clock and parent state, even after a slow write.
      await deps.repository.complete(id, admissionHash);
      return uploadJson({ id, status: 'pending' }, 201);
    } catch (error) {
      if (claimed) {
        try {
          await deps.repository.fail(id, admissionHash);
        } catch {
          /* No reuse, even if failure recording is unavailable. */
        }
      }
      return error instanceof PhotoAdmissionError
        ? uploadJson({ error: error.message }, error.status)
        : uploadJson({ error: 'UPLOAD_UNAVAILABLE' }, 503);
    } finally {
      if (deadline !== undefined) clearTimeout(deadline);
    }
  };
}
