import {
  PhotoAdmissionError,
  validPhotoId,
  validPhotoMime,
  validPhotoSecret,
  COMMUNITY_PHOTO_MAX_BYTES,
  COMMUNITY_PHOTO_BUCKET,
  type PhotoAdmissionRepository,
  type PhotoAdmissionReceipt,
  type ClaimedPhotoAdmission,
} from './photo-admission.ts';
import type { PrivatePhotoWriter } from './photo-upload.ts';

/** Runtime-only service adapter. Never use this in personal backend/browser code.
 * It issues NO Storage upload/download signatures. The bucket must already exist
 * and be private; the adapter refuses to create or make any bucket public.
 */
export function createSupabasePhotoBackend(
  config: { url: string; serviceKey: string },
  fetcher: typeof fetch = fetch,
): {
  repository: PhotoAdmissionRepository;
  writer: PrivatePhotoWriter;
} {
  if (
    !/^https:\/\/[a-z0-9]{20}\.supabase\.co$/.test(config.url) ||
    !/^(?:sb_secret_[A-Za-z0-9_-]{20,200}|[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)$/.test(
      config.serviceKey,
    )
  )
    throw new PhotoAdmissionError('UPLOAD_UNAVAILABLE', 503);
  const credentials = {
    apikey: config.serviceKey,
    Authorization: `Bearer ${config.serviceKey}`,
  };
  const rpc = async (
    action: string,
    input: unknown,
  ): Promise<Record<string, unknown>> => {
    const response = await fetcher(
      `${config.url}/rest/v1/rpc/community_photo_admission`,
      {
        method: 'POST',
        headers: { ...credentials, 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, input }),
        signal: AbortSignal.timeout(8000),
        cache: 'no-store',
      },
    );
    const result: unknown = await response.json();
    if (!response.ok) {
      const code =
        result && typeof result === 'object'
          ? (result as Record<string, unknown>).message
          : null;
      const codes: Record<string, number> = {
        INVALID_REQUEST: 400,
        UPLOAD_FORBIDDEN: 403,
        UPLOAD_EXPIRED: 410,
        UPLOAD_USED: 409,
        OPERATION_REUSED: 409,
        PHOTO_LIMIT: 429,
        RATE_LIMITED: 429,
      };
      if (typeof code === 'string' && codes[code])
        throw new PhotoAdmissionError(code, codes[code]);
      throw new PhotoAdmissionError('UPLOAD_UNAVAILABLE', 503);
    }
    if (!result || typeof result !== 'object' || Array.isArray(result))
      throw new PhotoAdmissionError('UPLOAD_UNAVAILABLE', 503);
    return result as Record<string, unknown>;
  };
  const receipt = (value: Record<string, unknown>): PhotoAdmissionReceipt => {
    if (
      !validPhotoId(value.id) ||
      ![
        'issued',
        'receiving',
        'stored',
        'failed',
        'revoked',
        'expired',
      ].includes(String(value.state)) ||
      !Number.isSafeInteger(value.expiresAt) ||
      Number(value.expiresAt) < 1
    )
      throw new PhotoAdmissionError('UPLOAD_UNAVAILABLE', 503);
    return {
      id: value.id,
      state: value.state as PhotoAdmissionReceipt['state'],
      expiresAt: Number(value.expiresAt),
    };
  };
  return {
    repository: {
      async issue(command) {
        return receipt(await rpc('issue', command));
      },
      async claim(id, admissionHash) {
        const value = await rpc('claim', { id, admission_hash: admissionHash });
        if (
          value.id !== id ||
          !validPhotoId(value.contributionId) ||
          !validPhotoMime(value.mime) ||
          !validPhotoSecret(value.sha256) ||
          !Number.isSafeInteger(value.expectedBytes) ||
          Number(value.expectedBytes) < 1 ||
          Number(value.expectedBytes) > COMMUNITY_PHOTO_MAX_BYTES ||
          value.objectBase !== `${value.contributionId}/${id}` ||
          !Number.isSafeInteger(value.expiresAt) ||
          Number(value.expiresAt) < 1
        )
          throw new PhotoAdmissionError('UPLOAD_UNAVAILABLE', 503);
        return value as unknown as ClaimedPhotoAdmission;
      },
      async complete(id, admissionHash) {
        const result = receipt(
          await rpc('complete', { id, admission_hash: admissionHash }),
        );
        if (result.id !== id || result.state !== 'stored')
          throw new PhotoAdmissionError('UPLOAD_UNAVAILABLE', 503);
      },
      async fail(id, admissionHash) {
        await rpc('fail', { id, admission_hash: admissionHash });
      },
    },
    writer: {
      async put(admission, bytes, signal) {
        if (
          !validPhotoId(admission.contributionId) ||
          !validPhotoId(admission.id) ||
          admission.objectBase !== `${admission.contributionId}/${admission.id}`
        )
          throw new PhotoAdmissionError('UPLOAD_UNAVAILABLE', 503);
        signal.throwIfAborted();
        const requestSignal = AbortSignal.any([
          signal,
          AbortSignal.timeout(15000),
        ]);
        const bucket = await fetcher(
          `${config.url}/storage/v1/bucket/${COMMUNITY_PHOTO_BUCKET}`,
          {
            headers: credentials,
            signal: requestSignal,
            cache: 'no-store',
          },
        );
        const info: unknown = await bucket.json();
        if (
          !bucket.ok ||
          !info ||
          typeof info !== 'object' ||
          (info as Record<string, unknown>).public !== false
        )
          throw new PhotoAdmissionError('UPLOAD_UNAVAILABLE', 503);
        signal.throwIfAborted();
        const response = await fetcher(
          `${config.url}/storage/v1/object/${COMMUNITY_PHOTO_BUCKET}/${admission.objectBase}/original`,
          {
            method: 'POST',
            headers: {
              ...credentials,
              'Content-Type': admission.mime,
              'x-upsert': 'false',
            },
            body: Uint8Array.from(bytes),
            signal: requestSignal,
            cache: 'no-store',
          },
        );
        if (!response.ok)
          throw new PhotoAdmissionError('UPLOAD_UNAVAILABLE', 503);
      },
    },
  };
}
