const baseUrl = new URL(process.env.PRODUCTION_URL ?? '');
const accessMode = process.env.SITE_ACCESS_MODE;

if (baseUrl.protocol !== 'https:' || baseUrl.username || baseUrl.password) {
  throw new Error('PRODUCTION_URL must be an HTTPS URL without credentials.');
}
if (accessMode !== 'owner-private' && accessMode !== 'public') {
  throw new Error('SITE_ACCESS_MODE must be owner-private or public.');
}

const request = (path, init = {}) =>
  fetch(new URL(path, baseUrl), {
    ...init,
    cache: 'no-store',
    redirect: accessMode === 'owner-private' ? 'manual' : 'follow',
    signal: AbortSignal.timeout(15_000),
    headers: { accept: 'application/json, text/html;q=0.9', ...init.headers },
  });

const root = await request('/');
if (accessMode === 'owner-private') {
  if (root.status !== 401) {
    throw new Error(
      `Expected the owner-private Site boundary to return 401; received ${root.status}.`,
    );
  }
  const api = await request('/api/assistant', { method: 'GET' });
  if (api.status !== 401) {
    throw new Error(
      `Expected the owner-private API boundary to return 401; received ${api.status}.`,
    );
  }
  console.log(
    `Smoke passed for ${baseUrl.hostname}: Site and API remain owner-private (401).`,
  );
} else {
  if (!root.ok) {
    throw new Error(
      `Expected the public Site to return 2xx; received ${root.status}.`,
    );
  }
  const api = await request('/api/assistant', { method: 'GET' });
  if (api.status !== 405) {
    throw new Error(
      `Expected the assistant method guard to return 405; received ${api.status}.`,
    );
  }
  const body = await api.json();
  if (body?.ok !== false || body?.error?.code !== 'METHOD_NOT_ALLOWED') {
    throw new Error(
      'The assistant API did not return its stable METHOD_NOT_ALLOWED error.',
    );
  }
  console.log(
    `Smoke passed for ${baseUrl.hostname}: public page is healthy and the assistant API guard is stable.`,
  );
}
