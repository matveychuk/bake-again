import assert from 'node:assert/strict';
import test from 'node:test';
import { requestFastPath } from './request-fast-path.ts';

const request = (path: string, init?: RequestInit) =>
  new Request(`https://bakeagain.com${path}`, init);

void test('legacy and localized favicons redirect once to the real SVG', async () => {
  for (const path of [
    '/favicon.ico',
    '/uk/favicon.ico',
    '/en/favicon.ico',
    '/es/favicon.svg',
    '/uk/favicon.ico?x=1',
  ]) {
    for (const method of ['GET', 'HEAD']) {
      const response = await requestFastPath(request(path, { method }));
      assert.equal(response?.status, 308, path);
      assert.equal(response.headers.get('location'), '/favicon.svg');
      assert.equal(await response.text(), '');
    }
  }
  const response = await requestFastPath(
    request('/favicon.ico', { method: 'POST' }),
  );
  assert.equal(response?.status, 405);
});

void test('asset misses and document navigations return ASSETS response without HTML rendering', async () => {
  const paths: string[] = [];
  const assets = {
    async fetch(req: Request) {
      paths.push(new URL(req.url).pathname);
      return new Response('asset result', { status: 404 });
    },
  };
  // Avoid literal fake media URLs: media:prepare scans product/test source too.
  for (const path of [
    '/images'.concat('/missing.webp'),
    '/media'.concat('/missing'),
    '/uk/missing.pdf',
    '/uk/missing.ico',
    '/missing.js',
  ]) {
    const response = await requestFastPath(
      request(path, { headers: { 'sec-fetch-mode': 'navigate' } }),
      assets,
    );
    assert.equal(response?.status, 404, path);
    assert.equal(await response.text(), 'asset result');
  }
  assert.equal(paths.length, 5);
  const svg = await requestFastPath(request('/favicon.svg'), {
    async fetch() {
      return new Response('<svg/>', {
        headers: { 'Content-Type': 'image/svg+xml' },
      });
    },
  });
  assert.equal(svg?.headers.get('content-type'), 'image/svg+xml');
  assert.equal(await svg.text(), '<svg/>');
});

void test('file probes stop before assets and React, including encoded paths and HEAD', async () => {
  const assets = {
    async fetch(): Promise<Response> {
      throw new Error('Probe reached assets');
    },
  };
  for (const path of [
    '/wp-login.php',
    '/uk/wp-admin/install.php?step=1',
    '/.env',
    '/.env1',
    '/.gitmodules',
    '/.npmrc',
    '/worker/.env.local',
    '/%2egit/config',
    '/uk/.svn/entries',
    '/backup.sql',
  ]) {
    for (const method of ['GET', 'HEAD', 'POST']) {
      const response = await requestFastPath(request(path, { method }), assets);
      assert.equal(response?.status, 404, path);
      assert.equal(await response.text(), method === 'HEAD' ? '' : 'Not found');
    }
  }
  assert.equal((await requestFastPath(request('/bad%ZZ.png')))?.status, 400);
});

void test('pages, adaptations, APIs, metadata routes and authenticated lessons still reach the app', async () => {
  const paths = [
    '/',
    '/uk',
    '/en',
    '/es',
    '/uk/recipes/bezghliutenovyi-napoleon',
    '/uk/recipes/bezghliutenovyi-napoleon?mode=scale&scale=2',
    '/uk/recipes/bezghliutenovyi-napoleon/cook',
    '/uk/urok/napoleon',
    '/uk/urok/napoleon?login=1',
    '/api/lessons/webhook',
    '/api/personal/v1/record',
    '/api/export.json',
    '/_next/image?url=%2Fimages%2Frecipe.webp',
    '/robots.txt',
    '/sitemap.xml',
    '/share-image.webp',
    '/share-image-v4.webp',
    '/uk/shopping-list',
    '/uk/saved',
  ];
  for (const path of paths) {
    assert.equal(await requestFastPath(request(path)), null, path);
    assert.equal(
      await requestFastPath(
        request(path, {
          headers: {
            cookie: 'session=private',
            authorization: 'Bearer private',
          },
        }),
      ),
      null,
      path,
    );
  }
  assert.equal(
    await requestFastPath(
      request('/uk', { method: 'POST', headers: { 'next-action': 'action' } }),
    ),
    null,
  );
  assert.equal(
    await requestFastPath(request('/uk?_rsc=123', { headers: { rsc: '1' } })),
    null,
  );
});
