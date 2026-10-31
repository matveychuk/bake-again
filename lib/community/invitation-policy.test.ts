import test from 'node:test';
import assert from 'node:assert/strict';
import { reviewInvitationAllowed } from './invitation-policy.ts';
const event = {
  status: 'published' as const,
  replayed: false,
  alreadySeen: false,
  storageAvailable: true,
  otherDialogOpen: false,
  newsletterPreference: null,
  now: 1000,
};
void test('invite only after a confirmed new publication, respecting quiet periods and other dialogs', () => {
  assert.equal(reviewInvitationAllowed(event), true);
  for (const status of ['pending', 'hidden', 'rejected', 'deleted'] as const)
    assert.equal(reviewInvitationAllowed({ ...event, status }), false);
  for (const patch of [
    { replayed: true },
    { alreadySeen: true },
    { storageAvailable: false },
    { otherDialogOpen: true },
    { newsletterPreference: '2000' },
    { newsletterPreference: 'invalid' },
  ])
    assert.equal(reviewInvitationAllowed({ ...event, ...patch }), false);
});
