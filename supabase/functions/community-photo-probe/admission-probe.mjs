// Admin-only probe runner. All upload capabilities remain inside this runtime.
import {
  preparePhotoAdmission,
  photoAdmissionHash,
  photoSha256,
} from '../../../lib/community/server/photo-admission.ts';
import { createPhotoUploadHandler } from '../../../lib/community/server/photo-upload.ts';
import { createSupabasePhotoBackend } from '../../../lib/community/server/photo-storage.ts';
const admissionProbeOrigin = 'https://bakeagain.com';
const admissionProbeAssert = (condition, code) => {
  if (!condition) throw new Error(code);
};
const admissionProbeRandom = () =>
  Array.from(crypto.getRandomValues(new Uint8Array(32)), (n) =>
    n.toString(16).padStart(2, '0'),
  ).join('');
async function admissionProbeExpiryToken(admin, id) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(admin),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(`community-admission-expiry-probe-v1\0${id}`),
  );
  return Array.from(new Uint8Array(signature), (n) =>
    n.toString(16).padStart(2, '0'),
  ).join('');
}
export async function runAdmissionProbe(base, admin, input, mime, inspect) {
  const backend = createSupabasePhotoBackend({ url: base, serviceKey: admin });
  const hash = await photoSha256(input);
  const ownerHash = admissionProbeRandom();
  const sample = await fetch(`${base}/rest/v1/rpc/community_submit_probe`, {
    method: 'POST',
    headers: {
      apikey: admin,
      Authorization: `Bearer ${admin}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      command: {
        operation_id: crypto.randomUUID(),
        owner_hash: ownerHash,
        fingerprint: admissionProbeRandom(),
        email: 'photo-probe@example.invalid',
        email_key: admissionProbeRandom(),
        browser_key: admissionProbeRandom(),
        recipe_id: 'community-probe',
        recipe_version: 'admission-test-v1',
        configuration: 'base',
        display_name: 'Технічна проба',
        body: 'Перевірка короткого дозволу на фото. Не публікувати.',
        kind: 'result',
        experience: 'as-written',
        rating: null,
        state: 'pending',
      },
    }),
    signal: AbortSignal.timeout(8000),
  });
  admissionProbeAssert(sample.ok, 'ADMISSION_FIXTURE_FAILED');
  const contribution = await sample.json();
  const context = {
    contributionId: contribution.id,
    ownerHash,
    checksPassed: true,
  };
  const issue = async (token = admissionProbeRandom()) => {
    const id = crypto.randomUUID();
    const command = await preparePhotoAdmission(
      { id, uploadToken: token, mime, bytes: input.length, sha256: hash },
      context,
    );
    const receipt = await backend.repository.issue(command);
    return { command, receipt, token };
  };
  const upload = createPhotoUploadHandler({
    repository: backend.repository,
    writer: backend.writer,
    allowedOrigin: admissionProbeOrigin,
    inspect,
  });
  const request = (token, bytes = input) =>
    new Request(`${admissionProbeOrigin}/api/community/v1/photo-upload`, {
      method: 'POST',
      headers: {
        origin: admissionProbeOrigin,
        authorization: `Bearer ${token}`,
        'content-type': mime,
      },
      body: bytes,
    });
  const normal = await issue();
  const retry = await backend.repository.issue(normal.command);
  admissionProbeAssert(
    retry.expiresAt === normal.receipt.expiresAt,
    'ADMISSION_EXTENDED',
  );
  const wrongToken = await upload(
    request(admissionProbeRandom()),
    normal.receipt.id,
  );
  admissionProbeAssert(
    wrongToken.status === 403,
    'ADMISSION_WRONG_TOKEN_ALLOWED',
  );
  const race = await Promise.all([
    upload(request(normal.token), normal.receipt.id),
    upload(request(normal.token), normal.receipt.id),
  ]);
  const raceStatuses = race
    .map((response) => response.status)
    .sort((a, b) => a - b);
  admissionProbeAssert(
    raceStatuses[0] === 201 && raceStatuses[1] === 409,
    'ADMISSION_RACE_FAILED',
  );
  const replay = await upload(request(normal.token), normal.receipt.id);
  admissionProbeAssert(replay.status === 409, 'ADMISSION_REPLAY_ALLOWED');
  const body = await race.find((response) => response.status === 201).json();
  admissionProbeAssert(
    Object.keys(body).sort().join(',') === 'id,status' &&
      body.status === 'pending',
    'ADMISSION_RESPONSE_LEAK',
  );
  const mismatched = await issue();
  const other = Uint8Array.from(input);
  other[other.length - 1] ^= 1;
  const mismatch = await upload(
    request(mismatched.token, other),
    mismatched.receipt.id,
  );
  admissionProbeAssert(
    mismatch.status === 422,
    'ADMISSION_HASH_MISMATCH_ALLOWED',
  );
  const mismatchReplay = await upload(
    request(mismatched.token),
    mismatched.receipt.id,
  );
  admissionProbeAssert(
    mismatchReplay.status === 409,
    'ADMISSION_FAILED_REUSED',
  );
  const expiryId = crypto.randomUUID();
  const expiryToken = await admissionProbeExpiryToken(admin, expiryId);
  const expiryCommand = await preparePhotoAdmission(
    {
      id: expiryId,
      uploadToken: expiryToken,
      mime,
      bytes: input.length,
      sha256: hash,
    },
    context,
  );
  const expiry = await backend.repository.issue(expiryCommand);
  const objectPath = `community-photo-probe/${contribution.id}/${normal.receipt.id}/original`;
  const original = await fetch(
    `${base}/storage/v1/object/authenticated/${objectPath}`,
    {
      headers: { apikey: admin, Authorization: `Bearer ${admin}` },
      signal: AbortSignal.timeout(8000),
    },
  );
  admissionProbeAssert(
    original.ok &&
      (await photoSha256(new Uint8Array(await original.arrayBuffer()))) ===
        hash,
    'ADMISSION_STORED_HASH_MISMATCH',
  );
  const publicRead = await fetch(
    `${base}/storage/v1/object/public/${objectPath}`,
    { signal: AbortSignal.timeout(8000) },
  );
  admissionProbeAssert(!publicRead.ok, 'ADMISSION_PUBLIC_READ_ALLOWED');
  return {
    runtime: 'supabase-edge-durable-photo-admission',
    contributionId: contribution.id,
    uploadId: normal.receipt.id,
    ttlSeconds: 120,
    issueRetryExtended: false,
    wrongTokenStatus: wrongToken.status,
    parallelStatuses: raceStatuses,
    replayStatus: replay.status,
    hashMismatchStatus: mismatch.status,
    failedReplayStatus: mismatchReplay.status,
    private: true,
    publicReadStatus: publicRead.status,
    storedBytes: input.length,
    storedSha256Matches: true,
    noStorageUploadSignature: true,
    photoStatus: 'pending',
    expiryProbe: { id: expiry.id, expiresAt: expiry.expiresAt },
  };
}
export async function checkAdmissionExpiry(base, admin, id) {
  const backend = createSupabasePhotoBackend({ url: base, serviceKey: admin });
  const token = await admissionProbeExpiryToken(admin, id);
  try {
    await backend.repository.claim(id, await photoAdmissionHash(id, token));
    throw new Error('ADMISSION_NOT_EXPIRED');
  } catch (error) {
    if (error.message !== 'UPLOAD_EXPIRED') throw error;
    return {
      runtime: 'supabase-edge-durable-photo-admission',
      id,
      expiredDenied: true,
      responseStatus: error.status,
      checkedAt: Date.now(),
    };
  }
}
