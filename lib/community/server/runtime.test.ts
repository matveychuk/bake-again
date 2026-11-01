import test from 'node:test';
import assert from 'node:assert/strict';
import {
  communityConfig,
  createCommunityHandlers,
  inspectPhoto,
} from './runtime.ts';

const bindings = {
  COMMUNITY_ENABLED: 'true',
  SUPABASE_URL: 'https://abcdefghijabcdefghij.supabase.co',
  COMMUNITY_SUPABASE_SECRET_KEY: 'sb_secret_' + 'x'.repeat(30),
  COMMUNITY_FINGERPRINT_SECRET: 'synthetic-fingerprint-secret-'.repeat(2),
  TURNSTILE_SECRET_KEY: 'turnstile-secret',
  TURNSTILE_SITE_KEY: 'site-key',
};
const config = communityConfig(bindings)!;
const contributionId = '44444444-4444-4444-8444-444444444444';
const photoId = '55555555-5555-4555-8555-555555555555';
const review = {
  operationId: '11111111-1111-4111-8111-111111111111',
  authorToken: 'a'.repeat(64),
  recipeId: 'crepes',
  name: 'Олена',
  email: 'olena@example.com',
  text: 'Вдалися!',
  rating: 5,
};
const scope = (id: string) =>
  id === 'crepes'
    ? { recipeId: id, version: 'test-v1', configuration: 'base' }
    : null;

function fakeSupabase(overrides: Record<string, unknown> = {}) {
  const calls: { url: string; body: unknown }[] = [];
  const fetcher = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = input instanceof Request ? input.url : input.toString();
    const body = typeof init?.body === 'string' ? JSON.parse(init.body) : null;
    calls.push({ url, body });
    const reply = (value: unknown, status = 200) =>
      Response.json(value, { status });
    if (url.includes('turnstile'))
      return reply(
        overrides.turnstile ?? {
          success: true,
          hostname: 'bakeagain.com',
          action: 'community_review',
        },
      );
    if (url.endsWith('/community_submit_probe'))
      return reply(
        overrides.submit ?? {
          id: contributionId,
          status: 'published',
          replayed: false,
        },
        overrides.submitStatus as number | undefined,
      );
    if (url.endsWith('/community_photo_admission'))
      return reply({ id: body.input.id, state: 'issued', expiresAt: 1 });
    if (url.endsWith('/community_recipe_reviews'))
      return reply(overrides.list ?? []);
    if (url.endsWith('/community_public_photo'))
      return reply(overrides.photo ?? null);
    if (url.includes('/storage/v1/object/'))
      return new Response(new Uint8Array([0xff, 0xd8, 0xff]));
    return reply({}, 404);
  }) as typeof fetch;
  return { calls, fetcher };
}
const post = (body: unknown, origin = 'https://bakeagain.com') =>
  new Request('https://bakeagain.com/api/community/reviews', {
    method: 'POST',
    headers: {
      origin,
      'content-type': 'application/json',
      'cf-connecting-ip': '203.0.113.7',
    },
    body: JSON.stringify(body),
  });

void test('reviews stay disabled until every secret is configured', () => {
  assert.ok(config);
  assert.equal(communityConfig({ ...bindings, COMMUNITY_ENABLED: '' }), null);
  assert.equal(
    communityConfig({ ...bindings, COMMUNITY_FINGERPRINT_SECRET: 'short' }),
    null,
  );
});

void test('submit verifies origin and challenge, publishes and admits photos', async () => {
  const { calls, fetcher } = fakeSupabase();
  const handlers = createCommunityHandlers({
    config,
    resolveScope: scope,
    fetcher,
  });
  const photo = {
    id: photoId,
    uploadToken: 'b'.repeat(64),
    mime: 'image/webp',
    bytes: 1000,
    sha256: 'c'.repeat(64),
  };
  const response = await handlers.submit(
    post({ review, photos: [photo], token: 'turnstile-token' }),
  );
  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), {
    ok: true,
    id: contributionId,
    status: 'published',
    photos: [photoId],
  });
  const command = calls.find((call) =>
    call.url.endsWith('/community_submit_probe'),
  )!.body as { command: Record<string, unknown> };
  assert.equal(command.command.state, 'published');
  assert.equal(command.command.recipe_version, 'test-v1');
  const stored = JSON.stringify(
    calls.filter((call) => call.url.includes('/rpc/')),
  );
  assert.ok(!stored.includes(review.authorToken));
  assert.ok(!stored.includes('203.0.113.7'));

  const crossSite = await handlers.submit(
    post({ review, token: 't' }, 'https://evil.example'),
  );
  assert.equal(crossSite.status, 403);
  const unknownRecipe = await handlers.submit(
    post({ review: { ...review, recipeId: 'cake' }, token: 't' }),
  );
  assert.equal(unknownRecipe.status, 400);
  const invalid = await handlers.submit(
    post({ review: { ...review, email: 'nope' }, token: 't' }),
  );
  assert.equal(invalid.status, 400);
});

void test('a failed challenge or quota never stores the review', async () => {
  const failed = fakeSupabase({
    turnstile: { success: true, hostname: 'bakeagain.com', action: 'other' },
  });
  const response = await createCommunityHandlers({
    config,
    resolveScope: scope,
    fetcher: failed.fetcher,
  }).submit(post({ review, token: 't' }));
  assert.equal(response.status, 403);
  assert.ok(!failed.calls.some((call) => call.url.includes('/rpc/')));
  const limited = fakeSupabase({
    submit: { message: 'RATE_LIMITED' },
    submitStatus: 400,
  });
  const quota = await createCommunityHandlers({
    config,
    resolveScope: scope,
    fetcher: limited.fetcher,
  }).submit(post({ review, token: 't' }));
  assert.equal(quota.status, 429);
});

void test('list returns only public fields and photo serving checks publication', async () => {
  const { fetcher } = fakeSupabase({
    list: [
      {
        id: contributionId,
        name: 'Олена',
        text: 'Смачно',
        rating: 4,
        createdAt: '2026-11-01T10:00:00Z',
        photos: [photoId, '../secret'],
        email: 'leak@example.com',
      },
    ],
    photo: {
      id: photoId,
      mime: 'image/jpeg',
      objectBase: `${contributionId}/${photoId}`,
    },
  });
  const handlers = createCommunityHandlers({
    config,
    resolveScope: scope,
    fetcher,
  });
  const list = await handlers.list(
    new Request('https://bakeagain.com/api/community/reviews?recipe=crepes'),
  );
  const body = (await list.json()) as { reviews: { photos: string[] }[] };
  assert.deepEqual(body.reviews[0].photos, [photoId]);
  assert.ok(!JSON.stringify(body).includes('leak@example.com'));
  assert.equal(
    (
      await handlers.list(
        new Request('https://bakeagain.com/api/community/reviews?recipe=x'),
      )
    ).status,
    404,
  );
  const served = await handlers.photo(
    new Request(`https://bakeagain.com/api/community/photos?id=${photoId}`),
  );
  assert.equal(served.status, 200);
  assert.equal(served.headers.get('content-type'), 'image/jpeg');
  const missing = await createCommunityHandlers({
    config,
    resolveScope: scope,
    fetcher: fakeSupabase().fetcher,
  }).photo(
    new Request(`https://bakeagain.com/api/community/photos?id=${photoId}`),
  );
  assert.equal(missing.status, 404);
});

void test('photo signature must match the declared type', () => {
  inspectPhoto(new Uint8Array([0xff, 0xd8, 0xff, 0]), 'image/jpeg');
  inspectPhoto(new TextEncoder().encode('RIFF0000WEBPVP8 '), 'image/webp');
  assert.throws(() =>
    inspectPhoto(new TextEncoder().encode('<svg></svg>'), 'image/png'),
  );
  assert.throws(() =>
    inspectPhoto(new Uint8Array([0xff, 0xd8, 0xff]), 'image/webp'),
  );
});
