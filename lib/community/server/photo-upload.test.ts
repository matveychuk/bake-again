import test from 'node:test';
import assert from 'node:assert/strict';
import { createPhotoUploadHandler } from './photo-upload.ts';
import {
  preparePhotoAdmission,
  photoSha256,
  type PhotoAdmissionRepository,
} from './photo-admission.ts';
import { photoDatabase, photoAuthor, photoId } from './photo-test-fixture.ts';
const origin = 'https://bakeagain.com';
const token = 'b'.repeat(64);
const bytes = new Uint8Array([255, 216, 255, 1, 2, 3]);
const request = (
  body: BodyInit = bytes,
  headers: Record<string, string> = {},
) =>
  new Request(`${origin}/api/community/v1/photos/${photoId(1)}`, {
    method: 'POST',
    headers: {
      origin,
      authorization: `Bearer ${token}`,
      'content-type': 'image/jpeg',
      ...headers,
    },
    body,
    duplex: 'half',
  } as RequestInit);

void test('actual SQL admission gates proxy upload; wrong token/origin never reads a body or writes; retries cannot overwrite', async (t) => {
  const f = await photoDatabase();
  t.after(() => f.db.close());
  const command = await preparePhotoAdmission(
    {
      id: photoId(1),
      uploadToken: token,
      mime: 'image/jpeg',
      bytes: bytes.length,
      sha256: await photoSha256(bytes),
    },
    photoAuthor,
  );
  await f.repository.issue(command);
  let writes = 0;
  const handler = createPhotoUploadHandler({
    repository: f.repository,
    allowedOrigin: origin,
    inspect: () => {},
    writer: {
      async put(admission, actual) {
        writes++;
        assert.equal(admission.contributionId, photoAuthor.contributionId);
        assert.deepEqual(actual, bytes);
      },
    },
  });
  assert.equal(
    (
      await handler(
        request(bytes, { origin: 'https://other.example' }),
        command.id,
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await handler(
        request(bytes, { authorization: `Bearer ${'d'.repeat(64)}` }),
        command.id,
      )
    ).status,
    403,
  );
  assert.equal((await handler(request(), photoId(99))).status, 403);
  const accepted = await handler(request(), command.id);
  assert.equal(accepted.status, 201);
  assert.deepEqual(await accepted.json(), {
    id: command.id,
    status: 'pending',
  });
  assert.equal(accepted.headers.get('cache-control'), 'no-store');
  assert.equal((await handler(request(), command.id)).status, 409);
  assert.equal(writes, 1);
});
void test('expiry before upload and expiry during streaming or decode prevent all storage writes', async (t) => {
  const f = await photoDatabase();
  t.after(() => f.db.close());
  let clock = Date.now();
  let writes = 0;
  const issue = async (n: number) => {
    const c = await preparePhotoAdmission(
      {
        id: photoId(n),
        uploadToken: token,
        mime: 'image/jpeg',
        bytes: bytes.length,
        sha256: await photoSha256(bytes),
      },
      photoAuthor,
    );
    return f.repository.issue(c);
  };
  const first = await issue(1);
  await f.expire(first.id);
  const handler = createPhotoUploadHandler({
    repository: f.repository,
    allowedOrigin: origin,
    now: () => clock,
    inspect: () => {},
    writer: {
      async put() {
        writes++;
      },
    },
  });
  assert.equal((await handler(request(), first.id)).status, 410);
  const streaming = await issue(2);
  const body = new ReadableStream(
    {
      pull(controller) {
        controller.enqueue(bytes);
        clock = streaming.expiresAt;
        controller.close();
      },
    },
    { highWaterMark: 0 },
  );
  assert.equal((await handler(request(body), streaming.id)).status, 410);
  clock = Date.now();
  const decoding = await issue(3);
  const slow = createPhotoUploadHandler({
    repository: f.repository,
    allowedOrigin: origin,
    now: () => clock,
    inspect: () => {
      clock = decoding.expiresAt;
    },
    writer: {
      async put() {
        writes++;
      },
    },
  });
  assert.equal((await slow(request(), decoding.id)).status, 410);
  assert.equal(writes, 0);
});
void test('size/hash/decoder mismatch burns the permit; writer failure never reports success or permits replay', async (t) => {
  const f = await photoDatabase();
  t.after(() => f.db.close());
  let writes = 0;
  for (const [n, mode] of [
    [1, 'size'],
    [2, 'hash'],
    [3, 'decode'],
    [4, 'writer'],
  ] as const) {
    const command = await preparePhotoAdmission(
      {
        id: photoId(n),
        uploadToken: token,
        mime: 'image/jpeg',
        bytes: bytes.length,
        sha256: await photoSha256(bytes),
      },
      photoAuthor,
    );
    await f.repository.issue(command);
    const handler = createPhotoUploadHandler({
      repository: f.repository,
      allowedOrigin: origin,
      inspect: () => {
        if (mode === 'decode') throw new Error('private decoder error');
      },
      writer: {
        async put() {
          writes++;
          throw new Error('private storage credential');
        },
      },
    });
    const response = await handler(
      request(
        mode === 'size'
          ? new Uint8Array(20)
          : mode === 'hash'
            ? new Uint8Array(bytes.length)
            : bytes,
      ),
      command.id,
    );
    assert.equal(
      response.status,
      mode === 'size' ? 413 : mode === 'writer' ? 503 : 422,
    );
    assert.ok(!(await response.text()).includes('private'));
    assert.equal((await handler(request(), command.id)).status, 409);
  }
  assert.equal(writes, 1);
});
void test('a body that never finishes is cancelled at the admission deadline', async () => {
  let cancelled = false;
  let writes = 0;
  const repository = {
    async claim() {
      return {
        id: photoId(1),
        contributionId: photoAuthor.contributionId,
        mime: 'image/jpeg',
        expectedBytes: 1,
        sha256: 'a'.repeat(64),
        objectBase: `${photoAuthor.contributionId}/${photoId(1)}`,
        expiresAt: Date.now() + 30,
      };
    },
    async complete() {
      throw new Error('must not complete');
    },
    async fail() {},
  } as unknown as PhotoAdmissionRepository;
  const handler = createPhotoUploadHandler({
    repository,
    allowedOrigin: origin,
    inspect: () => {},
    writer: {
      async put() {
        writes++;
      },
    },
  });
  const body = new ReadableStream({
    cancel() {
      cancelled = true;
    },
  });
  assert.equal((await handler(request(body), photoId(1))).status, 410);
  assert.equal(cancelled, true);
  assert.equal(writes, 0);
});
