export const ASSISTANT_SESSION_COOKIE = 'ba_assistant_session';
export const ASSISTANT_SESSION_MAX_AGE_SECONDS = 48 * 60 * 60;

export interface AssistantAnonymousIdentity {
  safetyIdentifier: string;
  networkIdentifier: string | null;
  setCookie: string | null;
}

function encodeBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/u, '');
}

async function keyedDigest(secret: string, value: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const digest = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(value),
  );
  return encodeBase64Url(new Uint8Array(digest));
}

function cookieValue(request: Request): string | null {
  const header = request.headers.get('cookie');
  if (!header) return null;
  for (const item of header.split(';')) {
    const separator = item.indexOf('=');
    if (separator < 0) continue;
    if (item.slice(0, separator).trim() !== ASSISTANT_SESSION_COOKIE) continue;
    return item.slice(separator + 1).trim();
  }
  return null;
}

function constantTimeEqual(left: string, right: string): boolean {
  let difference = left.length ^ right.length;
  const length = Math.max(left.length, right.length);
  for (let index = 0; index < length; index++) {
    difference |=
      (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  }
  return difference === 0;
}

async function readSessionId(
  request: Request,
  secret: string,
): Promise<string | null> {
  const value = cookieValue(request);
  if (!value) return null;
  const match = /^v1\.([A-Za-z0-9_-]{16,64})\.([A-Za-z0-9_-]{40,64})$/u.exec(
    value,
  );
  if (!match) return null;
  const expected = await keyedDigest(secret, `cookie:v1:${match[1]}`);
  return constantTimeEqual(match[2]!, expected) ? match[1]! : null;
}

function sessionCookie(request: Request, value: string): string {
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return `${ASSISTANT_SESSION_COOKIE}=${value}; Path=/; Max-Age=${ASSISTANT_SESSION_MAX_AGE_SECONDS}; HttpOnly; SameSite=Strict${secure}`;
}

/**
 * Creates or verifies a short-lived signed pseudonymous session. No address, account
 * identifier, question, or recipe text is included in the OpenAI safety identifier.
 */
export async function resolveAnonymousAssistantIdentity(
  request: Request,
  secret: string,
  createSessionId: () => string = () => crypto.randomUUID().replaceAll('-', ''),
): Promise<AssistantAnonymousIdentity> {
  let sessionId = await readSessionId(request, secret);
  let setCookie: string | null = null;
  if (!sessionId) {
    sessionId = createSessionId();
    if (!/^[A-Za-z0-9_-]{16,64}$/u.test(sessionId)) {
      throw new Error('Invalid generated assistant session ID.');
    }
    const signature = await keyedDigest(secret, `cookie:v1:${sessionId}`);
    setCookie = sessionCookie(request, `v1.${sessionId}.${signature}`);
  }

  const safetyDigest = await keyedDigest(secret, `safety:v1:${sessionId}`);
  const ingressAddress = request.headers.get('cf-connecting-ip');
  const networkIdentifier = ingressAddress
    ? `net_${(await keyedDigest(secret, `network:v1:${ingressAddress}`)).slice(0, 40)}`
    : null;
  return {
    safetyIdentifier: `ba_${safetyDigest.slice(0, 40)}`,
    networkIdentifier,
    setCookie,
  };
}
