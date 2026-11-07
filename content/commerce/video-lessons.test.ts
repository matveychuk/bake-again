import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getRecipeDocument } from '../recipes/registry.ts';
import {
  videoLessons,
  canBuyVideoLesson,
  getRecipeVideoLesson,
  isPayhipLessonUrl,
  type VideoLesson,
} from './video-lessons.ts';
const available: VideoLesson = {
  ...videoLessons[0],
  status: 'available',
  payhipUrl: 'https://payhip.com/b/lesson123',
  deliveryUrl: '/uk/urok/napoleon',
  priceMinor: 1200,
  currency: 'EUR',
};

void test('catalogue pins a real recipe version and offers Napoleon at the launch price', () => {
  assert.equal(
    new Set(videoLessons.map((lesson) => lesson.recipeId)).size,
    videoLessons.length,
  );
  for (const lesson of videoLessons) {
    assert.equal(
      getRecipeDocument(lesson.recipeId)?.recipe.versionId,
      lesson.recipeVersionId,
    );
    assert.equal(
      getRecipeVideoLesson(lesson.recipeId, lesson.recipeVersionId),
      lesson,
    );
  }
  const napoleon = videoLessons.find(
    (lesson) => lesson.id === 'napoleon-video',
  );
  assert.ok(napoleon && canBuyVideoLesson(napoleon));
  assert.equal(napoleon.payhipUrl, 'https://payhip.com/b/VhLl8');
  assert.equal(napoleon.priceMinor, 900);
  assert.equal(napoleon.currency, 'EUR');
  assert.equal(napoleon.language, 'uk');
});
void test('withdrawn, missing and mismatched recipe versions cannot offer a lesson', () => {
  assert.equal(
    getRecipeVideoLesson('unknown', available.recipeVersionId),
    null,
  );
  assert.equal(
    getRecipeVideoLesson(available.recipeId, 'new-version', [available]),
    null,
  );
  assert.equal(
    getRecipeVideoLesson(available.recipeId, available.recipeVersionId, [
      { ...available, status: 'withdrawn' },
    ]),
    null,
  );
});
void test('purchase gate rejects trial products, arbitrary origins, redirects and invalid prices', () => {
  for (const url of [
    'https://payhip.com/b/vAZlB',
    'https://payhip.com/b/upKrI',
    'http://payhip.com/b/test',
    'https://payhip.com.evil.test/b/test',
    'https://payhip.com@evil.test/b/test',
    'https://payhip.com/b/test?email=private',
    'https://payhip.com/b/test#buy',
    'javascript:alert(1)',
    'https://payhip.com/BakeAgain',
    'https://payhip.com:443/b/test',
  ]) {
    assert.equal(isPayhipLessonUrl(url), false, url);
    assert.equal(
      getRecipeVideoLesson(available.recipeId, available.recipeVersionId, [
        { ...available, payhipUrl: url },
      ]),
      null,
    );
  }
  for (const priceMinor of [0, -1, 0.5, NaN, Infinity])
    assert.equal(canBuyVideoLesson({ ...available, priceMinor }), false);
  assert.equal(canBuyVideoLesson(available), true);
  assert.equal(
    getRecipeVideoLesson(available.recipeId, available.recipeVersionId, [
      available,
    ]),
    available,
  );
});
