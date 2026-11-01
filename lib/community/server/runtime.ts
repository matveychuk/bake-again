import {
  CommunityInputError,
  type PublicContribution,
  type RecipeReviewScope,
} from '../contracts.ts';
import { prepareGuestSubmission } from './submission.ts';
import {
  COMMUNITY_PHOTO_BUCKET,
  PhotoAdmissionError,
  photoSha256,
  preparePhotoAdmission,
  validPhotoId,
  type PhotoMime,
} from './photo-admission.ts';
import { createSupabasePhotoBackend } from './photo-storage.ts';
import { createPhotoUploadHandler } from './photo-upload.ts';

/** Reviews publish immediately (Sasha, 2026-11-01); the owner deletes rows later.
 * Missing configuration keeps the whole recipe section hidden.
 */
export interface CommunityConfig {
  url: string;
  serviceKey: string;
  fingerprintSecret: string;
  turnstileSecret: string;
  turnstileSiteKey: string;
  localTest: boolean;
}
const PRODUCTION_HOST = 'bakeagain.com';
const LOCAL_HOSTS = ['localhost', '127.0.0.1', '[::1]'];
const TEST_SITE_KEY = '1x00000000000000000000AA';
const MAX_BODY = 16 * 1024;
export const REVIEW_CHALLENGE_ACTION = 'community_review';

export async function communityBindings(): Promise<Record<string, unknown>> {
  try {
    const { env } = await import('cloudflare:workers');
    return env as Record<string, unknown>;
  } catch {
    return typeof process !== 'undefined' ? process.env : {};
  }
}
// Dashboard-pasted secrets often carry a trailing newline or space.
const text = (value: unknown) =>
  typeof value === 'string' ? value.trim() : '';
/** Names the malformed setting without revealing its value. */
export function communityConfigProblem(config: CommunityConfig) {
  if (!/^https:\/\/[a-z0-9]{20}\.supabase\.co$/.test(config.url))
    return 'SUPABASE_URL';
  if (
    !/^(?:sb_secret_[A-Za-z0-9_-]{20,200}|[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)$/.test(
      config.serviceKey,
    )
  )
    return config.serviceKey.startsWith('sb_publishable_')
      ? 'COMMUNITY_SUPABASE_SECRET_KEY_IS_PUBLISHABLE'
      : 'COMMUNITY_SUPABASE_SECRET_KEY_FORMAT';
  return null;
}
export function communityConfig(
  bindings: Record<string, unknown>,
): CommunityConfig | null {
  const config = {
    url: text(bindings.SUPABASE_URL),
    serviceKey: text(bindings.COMMUNITY_SUPABASE_SECRET_KEY),
    fingerprintSecret: text(bindings.COMMUNITY_FINGERPRINT_SECRET),
    turnstileSecret: text(bindings.TURNSTILE_SECRET_KEY),
    turnstileSiteKey: text(bindings.TURNSTILE_SITE_KEY),
    localTest: bindings.COMMUNITY_LOCAL_TEST === 'true',
  };
  if (
    bindings.COMMUNITY_ENABLED !== 'true' ||
    !config.url ||
    !config.serviceKey ||
    config.fingerprintSecret.length < 32 ||
    !config.turnstileSecret ||
    !config.turnstileSiteKey
  )
    return null;
  return config;
}

export class CommunityHttpError extends Error {
  readonly status: number;
  constructor(code: string, status: number) {
    super(code);
    this.status = status;
  }
}
export const communityJson = (
  body: unknown,
  status = 200,
  cache = 'no-store',
) =>
  Response.json(body, {
    status,
    headers: {
      'cache-control': cache,
      'referrer-policy': 'no-referrer',
      'x-content-type-options': 'nosniff',
      'x-robots-tag': 'noindex',
    },
  });

function allowedHost(request: Request, config: CommunityConfig) {
  const host = new URL(request.url).hostname;
  return (
    host === PRODUCTION_HOST ||
    (config.localTest &&
      LOCAL_HOSTS.includes(host) &&
      config.turnstileSiteKey === TEST_SITE_KEY)
  );
}
function requireSameOrigin(request: Request, config: CommunityConfig) {
  if (
    !allowedHost(request, config) ||
    request.headers.get('origin') !== new URL(request.url).origin ||
    request.headers.get('sec-fetch-site') === 'cross-site'
  )
    throw new CommunityHttpError('FORBIDDEN', 403);
}

async function readJson(request: Request): Promise<unknown> {
  if (
    !request.headers.get('content-type')?.startsWith('application/json') ||
    Number(request.headers.get('content-length') ?? '0') > MAX_BODY
  )
    throw new CommunityHttpError('INVALID_REQUEST', 400);
  const reader = request.body?.getReader();
  if (!reader) throw new CommunityHttpError('INVALID_REQUEST', 400);
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const chunk = await reader.read();
    if (chunk.done) break;
    size += chunk.value.byteLength;
    if (size > MAX_BODY) {
      await reader.cancel();
      throw new CommunityHttpError('INVALID_REQUEST', 413);
    }
    chunks.push(chunk.value);
  }
  const data = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    data.set(chunk, offset);
    offset += chunk.length;
  }
  try {
    return JSON.parse(new TextDecoder().decode(data));
  } catch {
    throw new CommunityHttpError('INVALID_REQUEST', 400);
  }
}

/** Matches the declared type to the file signature; the browser re-encodes
 * photos before upload, so camera metadata is already removed.
 */
export function inspectPhoto(bytes: Uint8Array, mime: PhotoMime) {
  const ascii = (start: number, end: number) =>
    String.fromCharCode(...bytes.subarray(start, end));
  const valid =
    mime === 'image/jpeg'
      ? bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
      : mime === 'image/png'
        ? ascii(1, 4) === 'PNG' && bytes[0] === 0x89
        : ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP';
  if (!valid) throw new Error('PHOTO_SIGNATURE');
}

export function createCommunityHandlers(deps: {
  config: CommunityConfig;
  resolveScope: (recipeId: string) => RecipeReviewScope | null;
  fetcher?: typeof fetch;
}) {
  const { config, resolveScope } = deps;
  const fetcher = deps.fetcher ?? fetch;
  const credentials = {
    apikey: config.serviceKey,
    Authorization: `Bearer ${config.serviceKey}`,
  };
  const rpc = async (name: string, args: unknown): Promise<unknown> => {
    const response = await fetcher(`${config.url}/rest/v1/rpc/${name}`, {
      method: 'POST',
      headers: { ...credentials, 'Content-Type': 'application/json' },
      body: JSON.stringify(args),
      signal: AbortSignal.timeout(8000),
      cache: 'no-store',
    });
    const result: unknown = await response.json().catch(() => null);
    if (!response.ok) {
      const code =
        result && typeof result === 'object'
          ? (result as Record<string, unknown>).message
          : null;
      if (code === 'RATE_LIMITED')
        throw new CommunityHttpError('RATE_LIMITED', 429);
      if (code === 'OPERATION_REUSED')
        throw new CommunityHttpError('OPERATION_REUSED', 409);
      throw new CommunityHttpError('UNAVAILABLE', 503);
    }
    return result;
  };
  const photos = createSupabasePhotoBackend(
    { url: config.url, serviceKey: config.serviceKey },
    fetcher,
  );

  async function verifyChallenge(request: Request, token: unknown) {
    const ip =
      request.headers.get('cf-connecting-ip') ??
      (config.localTest ? '127.0.0.1' : null);
    if (typeof token !== 'string' || !token || token.length > 2048 || !ip)
      throw new CommunityHttpError('CHALLENGE_FAILED', 403);
    const response = await fetcher(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        signal: AbortSignal.timeout(5000),
        body: JSON.stringify({
          secret: config.turnstileSecret,
          response: token,
          remoteip: ip,
        }),
      },
    );
    if (!response.ok) throw new CommunityHttpError('UNAVAILABLE', 503);
    const result = (await response.json()) as {
      success?: boolean;
      hostname?: string;
      action?: string;
      metadata?: { result_with_testing_key?: boolean };
    };
    // Cloudflare's dummy keys answer with example.com and no action.
    const validContext = config.localTest
      ? result.metadata?.result_with_testing_key === true
      : result.hostname === new URL(request.url).hostname &&
        result.action === REVIEW_CHALLENGE_ACTION;
    if (result.success !== true || !validContext)
      throw new CommunityHttpError('CHALLENGE_FAILED', 403);
    // Network quota key; the raw address is never stored.
    return photoSha256(
      new TextEncoder().encode(
        `community-network-v1\0${config.fingerprintSecret}\0${ip}`,
      ),
    );
  }

  async function submit(request: Request): Promise<Response> {
    try {
      requireSameOrigin(request, config);
      const body = await readJson(request);
      if (!body || typeof body !== 'object' || Array.isArray(body))
        throw new CommunityHttpError('INVALID_REQUEST', 400);
      const {
        review,
        photos: requested = [],
        token,
      } = body as Record<string, unknown>;
      if (!Array.isArray(requested) || requested.length > 3)
        throw new CommunityHttpError('INVALID_REQUEST', 400);
      const recipeId =
        review && typeof review === 'object'
          ? (review as Record<string, unknown>).recipeId
          : null;
      const scope =
        typeof recipeId === 'string' ? resolveScope(recipeId) : null;
      if (!scope) throw new CommunityHttpError('INVALID_REQUEST', 400);
      const browserId = await verifyChallenge(request, token);
      const command = await prepareGuestSubmission(review, scope, {
        fingerprintSecret: config.fingerprintSecret,
        browserId,
        moderation: 'published',
      });
      const saved = (await rpc('community_submit_probe', { command })) as {
        id?: unknown;
        status?: unknown;
      } | null;
      if (
        !saved ||
        !validPhotoId(saved.id) ||
        (saved.status !== 'published' && saved.status !== 'pending')
      )
        throw new CommunityHttpError('UNAVAILABLE', 503);
      // Each permit is independent: a refused photo never loses the review.
      const accepted: string[] = [];
      for (const photo of requested) {
        try {
          const admission = await preparePhotoAdmission(photo, {
            contributionId: saved.id,
            ownerHash: command.owner_hash,
            checksPassed: true,
          });
          const receipt = await photos.repository.issue(admission);
          if (receipt.state === 'issued') accepted.push(receipt.id);
        } catch {
          /* The client reports the photo as not uploaded. */
        }
      }
      return communityJson(
        { ok: true, id: saved.id, status: saved.status, photos: accepted },
        201,
      );
    } catch (error) {
      if (error instanceof CommunityInputError)
        return communityJson({ ok: false, error: 'INVALID_REQUEST' }, 400);
      const status = error instanceof CommunityHttpError ? error.status : 503;
      const code =
        error instanceof CommunityHttpError ? error.message : 'UNAVAILABLE';
      if (status >= 500) console.warn('community_submit_failed', { status });
      return communityJson({ ok: false, error: code }, status);
    }
  }

  async function list(request: Request): Promise<Response> {
    const recipeId = new URL(request.url).searchParams.get('recipe') ?? '';
    if (!resolveScope(recipeId))
      return communityJson({ ok: false, error: 'NOT_FOUND' }, 404);
    try {
      const rows = await rpc('community_recipe_reviews', { recipe: recipeId });
      if (!Array.isArray(rows))
        throw new CommunityHttpError('UNAVAILABLE', 503);
      const reviews: PublicContribution[] = rows.map((row) => ({
        id: String(row.id),
        name: String(row.name),
        text: String(row.text),
        rating:
          Number.isInteger(row.rating) && row.rating >= 1 && row.rating <= 5
            ? row.rating
            : null,
        createdAt: String(row.createdAt),
        photos: Array.isArray(row.photos)
          ? row.photos.filter(validPhotoId)
          : [],
      }));
      return communityJson({ ok: true, reviews }, 200, 'public, max-age=30');
    } catch {
      console.warn('community_list_failed');
      return communityJson({ ok: false, error: 'UNAVAILABLE' }, 503);
    }
  }

  const uploadHandler = (origin: string) =>
    createPhotoUploadHandler({
      repository: photos.repository,
      writer: photos.writer,
      inspect: inspectPhoto,
      allowedOrigin: origin,
    });
  async function upload(request: Request): Promise<Response> {
    if (!allowedHost(request, config))
      return communityJson({ error: 'FORBIDDEN' }, 403);
    const url = new URL(request.url);
    return uploadHandler(url.origin)(request, url.searchParams.get('id') ?? '');
  }

  async function photo(request: Request): Promise<Response> {
    const id = new URL(request.url).searchParams.get('id');
    if (!validPhotoId(id)) return new Response(null, { status: 404 });
    try {
      const found = (await rpc('community_public_photo', { photo: id })) as {
        mime?: unknown;
        objectBase?: unknown;
      } | null;
      if (
        !found ||
        typeof found.mime !== 'string' ||
        typeof found.objectBase !== 'string' ||
        !/^[a-f0-9-]{36}\/[a-f0-9-]{36}$/.test(found.objectBase)
      )
        return new Response(null, {
          status: 404,
          headers: { 'cache-control': 'no-store' },
        });
      const object = await fetcher(
        `${config.url}/storage/v1/object/${COMMUNITY_PHOTO_BUCKET}/${found.objectBase}/original`,
        {
          headers: credentials,
          signal: AbortSignal.timeout(10000),
          cache: 'no-store',
        },
      );
      if (!object.ok || !object.body)
        throw new PhotoAdmissionError('UNAVAILABLE', 503);
      return new Response(object.body, {
        headers: {
          'content-type': found.mime,
          'cache-control': 'public, max-age=3600',
          'content-security-policy': "default-src 'none'; sandbox",
          'x-content-type-options': 'nosniff',
          'cross-origin-resource-policy': 'same-origin',
        },
      });
    } catch {
      console.warn('community_photo_failed');
      return new Response(null, {
        status: 503,
        headers: { 'cache-control': 'no-store' },
      });
    }
  }

  return { submit, list, upload, photo };
}
