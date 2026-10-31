// Isolated admin-only live probe, never a guest upload or public media endpoint.
import * as magick from 'npm:@imagemagick/magick-wasm@0.0.45';
import {
  EDGE_PHOTO_MAX_BYTES,
  processEdgePhoto,
} from '../../../scripts/community/wasm-photo.mjs';

import { runAdmissionProbe, checkAdmissionExpiry } from './admission-probe.mjs';

const BUCKET = 'community-photo-probe';
const SOURCE =
  'https://bakeagain.com/media/recipes/banana-fritters/selected/finished-pan-author-v1.webp';
const EXPIRES_AT = Date.parse('2026-11-01T00:00:00Z');
let ready;
let busy = false;
const json = (body, status = 200) =>
  Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
const check = (condition, step) => {
  if (!condition) throw new Error(step);
};

async function boundedBytes(response, limit) {
  check(response.ok && response.body, 'SOURCE_UNAVAILABLE');
  const reader = response.body.getReader();
  const chunks = [];
  let length = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.length;
      check(length <= limit, 'PHOTO_SIZE');
      chunks.push(value);
    }
  } finally {
    await reader.cancel();
  }
  const result = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}

async function runProbe(base, admin, anon) {
  const started = performance.now();
  const headers = { apikey: admin, Authorization: `Bearer ${admin}` };
  const api = async (path, init = {}) =>
    fetch(`${base}/storage/v1${path}`, {
      ...init,
      headers: { ...headers, ...init.headers },
      signal: AbortSignal.timeout(15000),
    });
  let bucket = await api(`/bucket/${BUCKET}`);
  if (bucket.status === 404 || bucket.status === 400) {
    const created = await api('/bucket', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: BUCKET,
        name: BUCKET,
        public: false,
        file_size_limit: EDGE_PHOTO_MAX_BYTES,
        allowed_mime_types: [
          'image/jpeg',
          'image/png',
          'image/webp',
          'application/json',
        ],
      }),
    });
    check(created.ok, 'BUCKET_CREATE_FAILED');
    bucket = await api(`/bucket/${BUCKET}`);
  }
  check(bucket.ok, 'BUCKET_CHECK_FAILED');
  const bucketInfo = await bucket.json();
  check(bucketInfo.public === false, 'BUCKET_NOT_PRIVATE');
  const source = await fetch(SOURCE, {
    redirect: 'error',
    signal: AbortSignal.timeout(15000),
  });
  const sourceMime = source.headers.get('content-type')?.split(';')[0];
  const input = await boundedBytes(source, EDGE_PHOTO_MAX_BYTES);
  const runId = crypto.randomUUID();
  const originalPath = `${runId}/original.webp`;
  const fullPath = (path) => `${BUCKET}/${path}`;
  const sign = await api(`/object/upload/sign/${fullPath(originalPath)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
  });
  check(sign.ok, 'SIGN_UPLOAD_FAILED');
  const signed = await sign.json();
  const uploadUrl = new URL(`${base}/storage/v1${signed.url}`);
  check(uploadUrl.origin === base, 'UPLOAD_ORIGIN');
  const token = uploadUrl.searchParams.get('token');
  check(token, 'UPLOAD_TOKEN_MISSING');
  // Keep token only in memory. Never return or log it, URLs, or admin headers.
  const claims = JSON.parse(
    atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')),
  );
  const upload = () =>
    fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': sourceMime, 'x-upsert': 'false' },
      body: input,
      signal: AbortSignal.timeout(15000),
    });
  check((await upload()).ok, 'SIGNED_UPLOAD_FAILED');
  const repeat = await upload();
  check(!repeat.ok, 'UPLOAD_OVERWRITE_ALLOWED');
  const otherUrl = new URL(uploadUrl);
  otherUrl.pathname = otherUrl.pathname.replace('original.webp', 'other.webp');
  const other = await fetch(otherUrl, {
    method: 'PUT',
    headers: { 'Content-Type': sourceMime },
    body: input,
    signal: AbortSignal.timeout(15000),
  });
  check(!other.ok, 'UPLOAD_WRONG_PATH_ALLOWED');
  const downloaded = await api(
    `/object/authenticated/${fullPath(originalPath)}`,
  );
  const stored = await boundedBytes(downloaded, EDGE_PHOTO_MAX_BYTES);
  check(stored.length === input.length, 'ORIGINAL_SIZE_CHANGED');
  ready ??= (async () => {
    const wasm = await Deno.readFile(
      new URL(
        import.meta.resolve('npm:@imagemagick/magick-wasm@0.0.45/magick.wasm'),
      ),
    );
    await magick.initializeImageMagick(wasm);
  })();
  try {
    await ready;
  } catch {
    throw new Error('WASM_INIT_FAILED');
  }
  magick.ResourceLimits.memory = 96n * 1024n * 1024n;
  magick.ResourceLimits.disk = 0n;
  magick.ResourceLimits.width = 12000n;
  magick.ResourceLimits.height = 12000n;
  magick.ResourceLimits.listLength = 2n;
  const processingStarted = performance.now();
  const output = processEdgePhoto(stored, sourceMime, magick);
  const processingMs = Math.round(performance.now() - processingStarted);
  const outputs = {};
  for (const name of ['web', 'thumbnail']) {
    const part = output[name];
    const path = `${runId}/${name}.webp`;
    const saved = await api(`/object/${fullPath(path)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'image/webp', 'x-upsert': 'false' },
      body: part.data,
    });
    check(saved.ok, 'DERIVATIVE_SAVE_FAILED');
    const readback = await api(`/object/authenticated/${fullPath(path)}`);
    const bytes = await boundedBytes(readback, EDGE_PHOTO_MAX_BYTES);
    check(bytes.length === part.data.length, 'DERIVATIVE_SIZE_CHANGED');
    magick.ImageMagick.read(bytes, (image) => {
      check(
        image.format === magick.MagickFormat.WebP &&
          image.width === part.width &&
          image.height === part.height,
        'DERIVATIVE_DECODE_FAILED',
      );
      check(
        !image.profileNames.includes('exif') &&
          !image.profileNames.includes('xmp'),
        'METADATA_NOT_REMOVED',
      );
    });
    const publicRead = await fetch(
      `${base}/storage/v1/object/public/${fullPath(path)}`,
      { signal: AbortSignal.timeout(15000) },
    );
    check(!publicRead.ok, 'PUBLIC_READ_ALLOWED');
    const anonRead = await fetch(
      `${base}/storage/v1/object/authenticated/${fullPath(path)}`,
      {
        headers: { apikey: anon, Authorization: `Bearer ${anon}` },
        signal: AbortSignal.timeout(15000),
      },
    );
    check(!anonRead.ok, 'ANON_READ_ALLOWED');
    outputs[name] = {
      bytes: bytes.length,
      width: part.width,
      height: part.height,
      publicReadStatus: publicRead.status,
      anonReadStatus: anonRead.status,
    };
  }
  // An intentionally short download grant: test actual expiry, not a tampered JWT.
  const downloadSign = await api(`/object/sign/${fullPath(originalPath)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ expiresIn: 2 }),
  });
  check(downloadSign.ok, 'SIGN_DOWNLOAD_FAILED');
  const download = await downloadSign.json();
  const downloadUrl = `${base}/storage/v1${download.signedURL}`;
  const signedBefore = await fetch(downloadUrl, {
    signal: AbortSignal.timeout(15000),
  });
  check(signedBefore.ok, 'SIGNED_DOWNLOAD_FAILED');
  await signedBefore.arrayBuffer();
  await new Promise((resolve) => setTimeout(resolve, 3500));
  const signedAfter = await fetch(downloadUrl, {
    headers: { 'Cache-Control': 'no-cache' },
    signal: AbortSignal.timeout(15000),
  });
  check(!signedAfter.ok, 'SIGNED_DOWNLOAD_EXPIRY_FAILED');
  const result = {
    runId,
    runtime: 'supabase-edge-deno-wasm',
    bucket: BUCKET,
    private: true,
    sourceBytes: input.length,
    original: output.original,
    outputs,
    processingMs,
    signedUpload: {
      firstSucceeded: true,
      replayStatus: repeat.status,
      wrongPathStatus: other.status,
      lifetimeSeconds:
        claims.exp - (claims.iat ?? Math.floor(Date.now() / 1000)),
    },
    signedDownload: {
      beforeExpiryStatus: signedBefore.status,
      afterExpiryStatus: signedAfter.status,
      expiresInSeconds: 2,
    },
    photoState: 'pending',
    publicServingEnabled: false,
    durationMs: Math.round(performance.now() - started),
  };
  const manifest = await api(`/object/${BUCKET}/${runId}/result.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-upsert': 'false' },
    body: JSON.stringify(result),
  });
  check(manifest.ok, 'MANIFEST_SAVE_FAILED');
  return result;
}

export async function handler(request) {
  let defaultKey;
  try {
    defaultKey = JSON.parse(
      Deno.env.get('SUPABASE_SECRET_KEYS') ?? '{}',
    ).default;
  } catch {
    return json({ error: 'NOT_CONFIGURED' }, 503);
  }
  const admin = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || defaultKey;
  const base = Deno.env.get('SUPABASE_URL');
  const anon = Deno.env.get('SUPABASE_ANON_KEY');
  // Only existing internal credentials may authorize this isolated probe.
  // Match the default secret in memory; never expose or copy project keys.
  const secretAuthorized =
    typeof defaultKey === 'string' &&
    defaultKey.startsWith('sb_secret_') &&
    request.headers.get('apikey') === defaultKey;
  const legacyAuthorized =
    !!admin && request.headers.get('authorization') === `Bearer ${admin}`;
  if (!secretAuthorized && !legacyAuthorized)
    return json({ error: 'FORBIDDEN' }, 403);
  if (request.method !== 'POST')
    return json({ error: 'METHOD_NOT_ALLOWED' }, 405);
  if (Date.now() >= EXPIRES_AT) return json({ error: 'PROBE_EXPIRED' }, 410);
  if (!base || !anon || !/^https:\/\/[a-z0-9]{20}\.supabase\.co$/.test(base))
    return json({ error: 'NOT_CONFIGURED' }, 503);
  if (Number(request.headers.get('content-length')) > 1024)
    return json({ error: 'BODY_TOO_LARGE' }, 413);
  let body;
  try {
    body = JSON.parse(
      new TextDecoder().decode(
        await boundedBytes(new Response(request.body), 1024),
      ),
    );
  } catch {
    return json({ error: 'INVALID_REQUEST' }, 400);
  }
  if (
    !body ||
    typeof body !== 'object' ||
    Array.isArray(body) ||
    !['run', 'admission', 'admission-expiry'].includes(body.action) ||
    (body.action === 'admission-expiry'
      ? Object.keys(body).length !== 2 || !/^[a-f0-9-]{36}$/.test(body.id)
      : Object.keys(body).length !== 1)
  )
    return json({ error: 'INVALID_REQUEST' }, 400);
  if (busy) return json({ error: 'PROBE_BUSY' }, 429);
  busy = true;
  try {
    if (body.action === 'admission-expiry')
      return json(await checkAdmissionExpiry(base, admin, body.id));
    if (body.action === 'admission') {
      const source = await fetch(SOURCE, {
        redirect: 'error',
        signal: AbortSignal.timeout(15000),
      });
      const mime = source.headers.get('content-type')?.split(';')[0];
      const bytes = await boundedBytes(source, EDGE_PHOTO_MAX_BYTES);
      ready ??= (async () => {
        const wasm = await Deno.readFile(
          new URL(
            import.meta
              .resolve('npm:@imagemagick/magick-wasm@0.0.45/magick.wasm'),
          ),
        );
        await magick.initializeImageMagick(wasm);
      })();
      await ready;
      magick.ResourceLimits.memory = 96n * 1024n * 1024n;
      magick.ResourceLimits.disk = 0n;
      magick.ResourceLimits.listLength = 2n;
      return json(
        await runAdmissionProbe(base, admin, bytes, mime, (input, type) => {
          processEdgePhoto(input, type, magick);
        }),
      );
    }
    return json(await runProbe(base, admin, anon));
  } catch (error) {
    const safe = /^[A-Z_]+$/.test(error?.message ?? '')
      ? error.message
      : 'PROCESSING_FAILED';
    return json({ error: safe }, 500);
  } finally {
    busy = false;
  }
}
const probe = { fetch: handler };
export default probe;
