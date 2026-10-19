import assert from 'node:assert/strict';
import { test } from 'node:test';
import { analyticsAllowed, getRecipeDownloadData, sanitizeAnalyticsPayload } from './umami.ts';
import { crepesDownloads, crepesDownloadPath } from '../../content/crepes-downloads.ts';

void test('PDF clicks are limited to both reviewed files on the Ukrainian delivery page', () => {
  for (const file of crepesDownloads) {
    assert.deepEqual(getRecipeDownloadData(file.id, crepesDownloadPath, file.href), {
      recipe_id: 'crepes', file: file.id, locale: 'uk',
    });
    assert.equal(getRecipeDownloadData(file.id, '/uk', file.href), null);
    assert.equal(getRecipeDownloadData(file.id, crepesDownloadPath, '/private.pdf'), null);
  }
  assert.equal(getRecipeDownloadData('unknown', crepesDownloadPath, crepesDownloads[0].href), null);
  assert.equal(analyticsAllowed('bakeagain.com', crepesDownloadPath), true);
  assert.equal(analyticsAllowed('bakeagain.com', crepesDownloadPath, '1'), false);
  assert.equal(analyticsAllowed('localhost', crepesDownloadPath), false);
  assert.equal(analyticsAllowed('preview.example.com', crepesDownloadPath), false);
});

void test('PDF event strips email, confirmation token and every unapproved field', () => {
  for (const file of crepesDownloads) {
    const result = sanitizeAnalyticsPayload('event', {
      url: `${crepesDownloadPath}?email=private&token=private#private`,
      title: 'private', name: 'recipe_pdf_download',
      data: { file: file.id, email: 'private', token: 'private', href: 'private', factor: 2 },
    });
    assert.ok(result);
    assert.equal(result.url, crepesDownloadPath);
    assert.deepEqual(result.data, { recipe_id: 'crepes', file: file.id, locale: 'uk' });
    assert.equal(JSON.stringify(result).includes('private'), false);
  }
  for (const [url, file] of [['/uk', 'recipe'], ['/en/mlyntsi-recept', 'recipe'], [crepesDownloadPath, 'unknown'], [crepesDownloadPath, undefined]]) {
    assert.equal(sanitizeAnalyticsPayload('event', { url, name: 'recipe_pdf_download', data: { file } }), false);
  }
});
