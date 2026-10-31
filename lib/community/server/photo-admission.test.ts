import test from 'node:test';
import assert from 'node:assert/strict';
import { photoDatabase, photoAuthor, photoId } from './photo-test-fixture.ts';
import {
  preparePhotoAdmission,
  photoAdmissionHash,
} from './photo-admission.ts';
const raw = (n: number) => ({
  id: photoId(n),
  uploadToken: 'b'.repeat(64),
  mime: 'image/jpeg',
  bytes: 100,
  sha256: 'c'.repeat(64),
});

void test('photo admission rejects caller authority, invalid metadata and unverified issuance context', async () => {
  for (const patch of [
    { bucket: 'public' },
    { contributionId: photoId(99) },
    { expiresAt: Date.now() + 9999999 },
    { bytes: 2097153 },
    { bytes: 0 },
    { bytes: 1.5 },
    { mime: 'image/svg+xml' },
    { uploadToken: '' },
    { sha256: 'invalid' },
  ])
    await assert.rejects(
      preparePhotoAdmission({ ...raw(1), ...patch }, photoAuthor),
    );
  await assert.rejects(
    preparePhotoAdmission(raw(1), {
      ...photoAuthor,
      checksPassed: false as never,
    }),
  );
  const command = await preparePhotoAdmission(raw(1), photoAuthor);
  assert.ok(!JSON.stringify(command).includes(raw(1).uploadToken));
  assert.notEqual(
    command.admission_hash,
    await photoAdmissionHash(photoId(2), raw(1).uploadToken),
  );
});
void test('Postgres durable two-minute permit: owner proof, idempotency, expiry, consume, revocation and RLS', async (t) => {
  const f = await photoDatabase();
  t.after(() => f.db.close());
  const command = await preparePhotoAdmission(raw(1), photoAuthor);
  await assert.rejects(
    f.repository.issue({ ...command, owner_hash: 'd'.repeat(64) }),
    /UPLOAD_FORBIDDEN/,
  );
  const first = await f.repository.issue(command);
  assert.equal(first.state, 'issued');
  assert.deepEqual(Object.keys(first).sort(), ['expiresAt', 'id', 'state']);
  const ttl = (
    await f.db.query<{ seconds: number }>(
      'SELECT extract(epoch from expires_at-issued_at)::int AS seconds FROM bake_again_community.photo_upload_admissions',
    )
  ).rows[0].seconds;
  assert.equal(ttl, 120);
  assert.deepEqual(await f.repository.issue(command), first);
  await assert.rejects(
    f.repository.issue({ ...command, request_hash: 'd'.repeat(64) }),
    /OPERATION_REUSED/,
  );
  await assert.rejects(
    f.repository.claim(command.id, 'd'.repeat(64)),
    /UPLOAD_FORBIDDEN/,
  );
  const claim = await f.repository.claim(command.id, command.admission_hash);
  assert.equal(claim.objectBase, `${photoAuthor.contributionId}/${command.id}`);
  await assert.rejects(
    f.repository.claim(command.id, command.admission_hash),
    /UPLOAD_USED/,
  );
  await f.repository.complete(command.id, command.admission_hash);
  await f.repository.fail(command.id, command.admission_hash);
  assert.equal((await f.repository.issue(command)).state, 'stored');

  const expiring = await preparePhotoAdmission(raw(2), photoAuthor);
  await f.repository.issue(expiring);
  await f.expire(expiring.id);
  const expired = await f.repository.issue(expiring);
  assert.equal(expired.state, 'expired');
  assert.ok(expired.expiresAt < Date.now());
  await assert.rejects(
    f.repository.claim(expiring.id, expiring.admission_hash),
    /UPLOAD_EXPIRED/,
  );
  const revoked = await preparePhotoAdmission(raw(3), photoAuthor);
  await f.repository.issue(revoked);
  await f.rpc('revoke', {
    id: revoked.id,
    admission_hash: revoked.admission_hash,
  });
  await assert.rejects(
    f.repository.claim(revoked.id, revoked.admission_hash),
    /UPLOAD_USED/,
  );
  const hidden = await preparePhotoAdmission(raw(4), photoAuthor);
  await f.repository.issue(hidden);
  await f.repository.claim(hidden.id, hidden.admission_hash);
  await f.db.query(
    "UPDATE bake_again_community.contributions SET state='hidden' WHERE id=$1",
    [photoAuthor.contributionId],
  );
  await assert.rejects(
    f.repository.complete(hidden.id, hidden.admission_hash),
    /UPLOAD_FORBIDDEN/,
  );
  await f.repository.fail(hidden.id, hidden.admission_hash);
  for (const role of ['anon', 'authenticated', 'service_role']) {
    await f.db.exec(`SET ROLE ${role}`);
    await assert.rejects(
      f.db.query('SELECT * FROM bake_again_community.photo_upload_admissions'),
      /permission denied/,
    );
    if (role !== 'service_role')
      await assert.rejects(
        f.db.query(
          "SELECT public.community_photo_admission('claim',$1::jsonb)",
          [
            JSON.stringify({
              id: command.id,
              admission_hash: command.admission_hash,
            }),
          ],
        ),
        /permission denied/,
      );
    await f.db.exec('RESET ROLE');
  }
});
void test('Postgres caps active photo slots and issuance attempts without reserving expired failures forever', async (t) => {
  const f = await photoDatabase();
  t.after(() => f.db.close());
  for (let n = 1; n <= 3; n++)
    await f.repository.issue(await preparePhotoAdmission(raw(n), photoAuthor));
  await assert.rejects(
    f.repository.issue(await preparePhotoAdmission(raw(4), photoAuthor)),
    /PHOTO_LIMIT/,
  );
  await f.expire(photoId(1));
  await f.repository.issue(await preparePhotoAdmission(raw(4), photoAuthor));
  for (let n = 2; n <= 4; n++) await f.expire(photoId(n));
  for (let n = 5; n <= 10; n++) {
    const command = await preparePhotoAdmission(raw(n), photoAuthor);
    await f.repository.issue(command);
    await f.repository.claim(command.id, command.admission_hash);
    await f.repository.fail(command.id, command.admission_hash);
  }
  await assert.rejects(
    f.repository.issue(await preparePhotoAdmission(raw(11), photoAuthor)),
    /RATE_LIMITED/,
  );
});
