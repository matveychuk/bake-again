import test from 'node:test';
import assert from 'node:assert/strict';
import { createSupabasePhotoBackend } from './photo-storage.ts';
import { photoId, photoAuthor } from './photo-test-fixture.ts';
const config = {
  url: 'https://abcdefghijklmnopqrst.supabase.co',
  serviceKey: `sb_secret_${'s'.repeat(40)}`,
};
const row = {
  id: photoId(1),
  contributionId: photoAuthor.contributionId,
  mime: 'image/jpeg' as const,
  expectedBytes: 3,
  sha256: 'a'.repeat(64),
  objectBase: `${photoAuthor.contributionId}/${photoId(1)}`,
  expiresAt: Date.now() + 120000,
};
void test('Supabase proxy uses only server credentials, exact immutable private object key and no signatures', async () => {
  const calls: { url: string; init: RequestInit | undefined }[] = [];
  const fetcher: typeof fetch = async (url, init) => {
    const target =
      typeof url === 'string' ? url : url instanceof URL ? url.href : url.url;
    calls.push({ url: target, init });
    return Response.json(
      target.endsWith('/bucket/community-photo-probe') ? { public: false } : {},
    );
  };
  const backend = createSupabasePhotoBackend(config, fetcher);
  await backend.writer.put(
    row,
    new Uint8Array([1, 2, 3]),
    new AbortController().signal,
  );
  assert.equal(calls.length, 2);
  assert.equal(
    calls[1].url,
    `${config.url}/storage/v1/object/community-photo-probe/${row.objectBase}/original`,
  );
  assert.equal(calls[1].init?.method, 'POST');
  assert.equal(new Headers(calls[1].init?.headers).get('x-upsert'), 'false');
  assert.equal(
    new Headers(calls[1].init?.headers).get('apikey'),
    config.serviceKey,
  );
  assert.ok(
    !calls.some(({ url }) => url.includes('/sign/') || url.includes('?')),
  );
  await assert.rejects(
    backend.writer.put(
      { ...row, objectBase: '../somebody-else' },
      new Uint8Array([1]),
      new AbortController().signal,
    ),
  );
  assert.equal(calls.length, 2);
});
void test('public bucket, aborted upload and malformed claimed paths fail before any write', async () => {
  let calls = 0;
  const publicBackend = createSupabasePhotoBackend(config, async () => {
    calls++;
    return Response.json({ public: true });
  });
  await assert.rejects(
    publicBackend.writer.put(
      row,
      new Uint8Array([1]),
      new AbortController().signal,
    ),
    /UPLOAD_UNAVAILABLE/,
  );
  assert.equal(calls, 1);
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(
    publicBackend.writer.put(row, new Uint8Array([1]), controller.signal),
  );
  assert.equal(calls, 1);
  for (const patch of [
    { objectBase: 'another/file' },
    { expectedBytes: 2097153 },
    { mime: 'image/svg+xml' },
    { expiresAt: 'later' },
  ]) {
    const backend = createSupabasePhotoBackend(config, async () =>
      Response.json({ ...row, ...patch }),
    );
    await assert.rejects(
      backend.repository.claim(row.id, 'b'.repeat(64)),
      /UPLOAD_UNAVAILABLE/,
    );
  }
});
void test('RPC failures retain safe expiry/conflict codes and suppress provider details and raw credentials', async () => {
  for (const [message, status] of [
    ['UPLOAD_EXPIRED', 410],
    ['UPLOAD_USED', 409],
    ['private provider failure with credentials', 503],
  ] as const) {
    const backend = createSupabasePhotoBackend(config, async () =>
      Response.json({ message }, { status: 400 }),
    );
    await assert.rejects(
      backend.repository.claim(row.id, 'b'.repeat(64)),
      (error: unknown) => {
        assert.equal((error as { status: number }).status, status);
        assert.ok(!(error as Error).message.includes('private'));
        return true;
      },
    );
  }
  assert.throws(() =>
    createSupabasePhotoBackend({
      ...config,
      serviceKey: 'sb_publishable_public',
    }),
  );
});
