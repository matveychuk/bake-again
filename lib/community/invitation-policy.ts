import { newsletterPromptAllowed } from '../newsletter/prompt-policy.ts';
import type { ContributionStatus } from './contracts.ts';

/** Evaluate only an authenticated author response, never an arbitrary public review.
 * The UI must persist the operation as seen and the shared quiet preference BEFORE
 * opening the existing Dialog. Storage failure suppresses automatic invitations.
 */
export function reviewInvitationAllowed(input: {
  status: ContributionStatus;
  replayed: boolean;
  alreadySeen: boolean;
  storageAvailable: boolean;
  otherDialogOpen: boolean;
  newsletterPreference: string | null;
  now: number;
}): boolean {
  return (
    input.status === 'published' &&
    !input.replayed &&
    !input.alreadySeen &&
    input.storageAvailable &&
    !input.otherDialogOpen &&
    newsletterPromptAllowed(input.newsletterPreference, input.now)
  );
}
