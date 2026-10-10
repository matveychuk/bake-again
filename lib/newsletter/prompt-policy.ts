/** Browser-only invitation preference; never a subscription or consent record. */
export const NEWSLETTER_PROMPT_KEY = 'bake-again:newsletter:prompt:v1';
export const NEWSLETTER_DELAY_MS = 45_000;
const DAY = 86_400_000;
export const newsletterQuietUntil = (now: number, handoff = false) =>
  now + (handoff ? 180 : 30) * DAY;

export function newsletterPromptAllowed(
  value: string | null,
  now: number,
): boolean {
  if (value === null) return true;
  const until = Number(value);
  // Invalid preferences fail closed instead of repeatedly interrupting readers.
  return Number.isFinite(until) && until > 0 && until <= now;
}
