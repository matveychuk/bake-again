/** Community state never changes recipe evidence (Tested/Calculated/Suggested). */
export type ContributionStatus =
  | 'pending'
  | 'published'
  | 'hidden'
  | 'rejected'
  | 'deleted';
export interface RecipeReviewScope {
  recipeId: string;
  version: string;
  configuration: string;
  /** Resolved from the canonical recipe on the server, never from request claims. */
  isBase: boolean;
}
export interface GuestContribution {
  operationId: string;
  /** Random 256-bit capability, generated before submitting; keep out of telemetry. */
  authorToken: string;
  recipeId: string;
  name: string;
  email: string;
  text: string;
  kind: 'question' | 'result';
  experience: 'as-written' | 'changed';
  cooked: boolean;
  rating: number | null;
}
export interface PublicContribution {
  id: string;
  recipeId: string;
  version: string;
  configuration: string;
  name: string;
  text: string;
  kind: 'question' | 'result';
  experience: 'as-written' | 'changed';
  rating: number | null;
  createdAt: string;
}

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const fields = new Set([
  'operationId',
  'authorToken',
  'recipeId',
  'name',
  'email',
  'text',
  'kind',
  'experience',
  'cooked',
  'rating',
]);
export class CommunityInputError extends Error {
  readonly field: string;
  constructor(field: string) {
    super('INVALID_CONTRIBUTION');
    this.field = field;
  }
}
function bounded(
  value: unknown,
  field: string,
  min: number,
  max: number,
): string {
  if (typeof value !== 'string') throw new CommunityInputError(field);
  const result = value.trim();
  const characters = Array.from(result);
  const hasControl = characters.some((char) => {
    const code = char.codePointAt(0)!;
    return (
      (code < 32 && code !== 9 && code !== 10 && code !== 13) || code === 127
    );
  });
  if (characters.length < min || characters.length > max || hasControl)
    throw new CommunityInputError(field);
  return result;
}
/** Parse an already size-bounded JSON body. Email format is not ownership proof. */
export function parseGuestContribution(value: unknown): GuestContribution {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new CommunityInputError('form');
  const input = value as Record<string, unknown>;
  if (Object.keys(input).some((key) => !fields.has(key)))
    throw new CommunityInputError('form');
  const operationId = bounded(
    input.operationId,
    'operationId',
    36,
    36,
  ).toLowerCase();
  const authorToken = bounded(input.authorToken, 'authorToken', 64, 64);
  const recipeId = bounded(input.recipeId, 'recipeId', 1, 100);
  if (!uuid.test(operationId)) throw new CommunityInputError('operationId');
  if (!/^[a-f0-9]{64}$/.test(authorToken))
    throw new CommunityInputError('authorToken');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(recipeId))
    throw new CommunityInputError('recipeId');
  const name = bounded(input.name, 'name', 2, 60);
  const email = bounded(input.email, 'email', 3, 254);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email))
    throw new CommunityInputError('email');
  const text = bounded(input.text, 'text', 1, 2000);
  const { kind, experience, cooked, rating } = input;
  if (kind !== 'question' && kind !== 'result')
    throw new CommunityInputError('kind');
  if (experience !== 'as-written' && experience !== 'changed')
    throw new CommunityInputError('experience');
  if (typeof cooked !== 'boolean') throw new CommunityInputError('cooked');
  if (
    rating !== null &&
    (!Number.isInteger(rating) ||
      typeof rating !== 'number' ||
      rating < 1 ||
      rating > 5)
  )
    throw new CommunityInputError('rating');
  if (
    rating !== null &&
    (kind !== 'result' || !cooked || experience !== 'as-written')
  )
    throw new CommunityInputError('rating');
  return {
    operationId,
    authorToken,
    recipeId,
    name,
    email,
    text,
    kind,
    experience,
    cooked,
    rating,
  };
}
