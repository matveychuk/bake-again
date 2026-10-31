import {
  parseGuestContribution,
  CommunityInputError,
  type RecipeReviewScope,
} from '../contracts.ts';

const encoder = new TextEncoder();
const hex = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer), (n) =>
    n.toString(16).padStart(2, '0'),
  ).join('');
async function sha(value: string) {
  return hex(await crypto.subtle.digest('SHA-256', encoder.encode(value)));
}
/** Stage-0 command builder, deliberately not mounted as a public endpoint.
 * Caller must enforce same origin, bounded body, Turnstile and server rate limits.
 * moderation comes from an independent server check, never the browser payload.
 */
export async function prepareGuestSubmission(
  raw: unknown,
  scope: RecipeReviewScope,
  context: {
    fingerprintSecret: string;
    browserId: string;
    moderation: 'published' | 'pending';
  },
) {
  const input = parseGuestContribution(raw);
  if (
    input.recipeId !== scope.recipeId ||
    !scope.version ||
    !scope.configuration
  )
    throw new CommunityInputError('recipeId');
  if (input.rating !== null && !scope.isBase)
    throw new CommunityInputError('rating');
  if (
    context.fingerprintSecret.length < 32 ||
    !/^[a-f0-9]{64}$/.test(context.browserId)
  )
    throw new Error('COMMUNITY_NOT_CONFIGURED');
  if (context.moderation !== 'published' && context.moderation !== 'pending')
    throw new Error('MODERATION_REQUIRED');
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(context.fingerprintSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const hmac = async (domain: string, value: string) =>
    hex(
      await crypto.subtle.sign(
        'HMAC',
        key,
        encoder.encode(`${domain}\0${value}`),
      ),
    );
  // Normalize case for repeat detection only; never remove +suffix or dots, link
  // accounts, verify an address or authorize editing using this private key.
  const emailKey = await hmac('community-email-v1', input.email.toLowerCase());
  const browserKey = await hmac('community-browser-v1', context.browserId);
  const ownerHash = await sha(
    `community-owner-v1\0${input.operationId}\0${input.authorToken}`,
  );
  const { authorToken: _token, ...payload } = input;
  const fingerprint = await hmac(
    'community-operation-v1',
    JSON.stringify({ ...payload, scope }),
  );
  return {
    operation_id: input.operationId,
    owner_hash: ownerHash,
    fingerprint,
    email: input.email,
    email_key: emailKey,
    browser_key: browserKey,
    recipe_id: scope.recipeId,
    recipe_version: scope.version,
    configuration: scope.configuration,
    display_name: input.name,
    body: input.text,
    kind: input.kind,
    experience: input.experience,
    rating: input.rating,
    state: context.moderation,
  };
}
