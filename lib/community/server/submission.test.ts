import test from 'node:test';
import assert from 'node:assert/strict';
import { parseGuestContribution } from '../contracts.ts';
import { prepareGuestSubmission } from './submission.ts';

export const guest = {
  operationId: '11111111-1111-4111-8111-111111111111',
  authorToken: 'a'.repeat(64),
  recipeId: 'crepes',
  name: 'Олена',
  email: 'Olena+home@example.com',
  text: 'Млинці вдалися, дякую!',
  kind: 'result',
  experience: 'as-written',
  cooked: true,
  rating: 4,
};
export const scope = {
  recipeId: 'crepes',
  version: 'test-v1',
  configuration: 'base',
  isBase: true,
};
export const context = {
  fingerprintSecret: 'synthetic-test-key-'.repeat(3),
  browserId: 'b'.repeat(64),
  moderation: 'published' as const,
};

void test('guest validation requires private email and rejects browser authority claims', () => {
  assert.equal(parseGuestContribution(guest).email, guest.email);
  for (const patch of [
    { email: '' },
    { email: 'x@y' },
    { rating: 0 },
    { rating: 5.5 },
    { rating: '5' },
    { cooked: false },
    { experience: 'changed' },
    { kind: 'question' },
    { name: 'я' },
    { text: 'я'.repeat(2001) },
    { state: 'published' },
    { accountId: 'someone' },
    { version: 'forged' },
    { text: '\0' },
  ])
    assert.throws(
      () => parseGuestContribution({ ...guest, ...patch }),
      /INVALID_CONTRIBUTION/,
    );
  assert.equal(
    parseGuestContribution({
      ...guest,
      kind: 'question',
      cooked: false,
      rating: null,
    }).rating,
    null,
  );
  assert.equal(
    parseGuestContribution({ ...guest, experience: 'changed', rating: null })
      .rating,
    null,
  );
});
void test('server binds exact scope, hashes capabilities, preserves +suffix and does not create identity', async () => {
  const command = await prepareGuestSubmission(guest, scope, context);
  assert.equal(command.email, guest.email);
  assert.equal(command.recipe_version, scope.version);
  assert.match(command.owner_hash, /^[a-f0-9]{64}$/);
  assert.ok(!JSON.stringify(command).includes(guest.authorToken));
  assert.ok(!('account_id' in command));
  const second = await prepareGuestSubmission(
    { ...guest, email: guest.email.toLowerCase() },
    scope,
    context,
  );
  assert.equal(second.email_key, command.email_key);
  assert.notEqual(
    (
      await prepareGuestSubmission(
        { ...guest, email: 'Olena@example.com' },
        scope,
        context,
      )
    ).email_key,
    command.email_key,
  );
  assert.notEqual(
    (
      await prepareGuestSubmission(
        { ...guest, text: 'Інший текст' },
        scope,
        context,
      )
    ).fingerprint,
    command.fingerprint,
  );
  assert.notEqual(
    (
      await prepareGuestSubmission(
        { ...guest, authorToken: 'c'.repeat(64) },
        scope,
        context,
      )
    ).owner_hash,
    command.owner_hash,
  );
  await assert.rejects(
    prepareGuestSubmission(guest, { ...scope, isBase: false }, context),
  );
  await assert.rejects(
    prepareGuestSubmission(guest, { ...scope, recipeId: 'cake' }, context),
  );
  await assert.rejects(
    prepareGuestSubmission(guest, scope, { ...context, fingerprintSecret: '' }),
  );
});
