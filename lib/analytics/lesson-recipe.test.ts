import assert from 'node:assert/strict';
import test from 'node:test';
import { sanitizeAnalyticsPayload } from './umami.ts';
const url =
  'https://bakeagain.com/uk/recipes/bezghliutenovyi-napoleon?email=private#s03-short-mix';
void test('recipe lesson analytics retain only reviewed identifiers and no URL queries or identity', () => {
  for (const name of [
    'lesson_step_link_click',
    'lesson_free_step_play',
    'lesson_free_step_complete',
    'lesson_open_from_free_step',
  ]) {
    const p = sanitizeAnalyticsPayload('event', {
      url,
      name,
      data: {
        recipeId: 'gluten-free-napoleon',
        lessonStepId: 's03-short-mix',
        locale: 'uk',
        orientation: 'vertical',
        email: 'private',
        href: 'https://evil.test',
      },
    });
    assert(p);
    assert.equal(p.url, '/uk/recipes/bezghliutenovyi-napoleon');
    assert.deepEqual(
      p.data,
      name === 'lesson_step_link_click' || name === 'lesson_open_from_free_step'
        ? {
            recipeId: 'gluten-free-napoleon',
            lessonStepId: 's03-short-mix',
            locale: 'uk',
          }
        : {
            recipeId: 'gluten-free-napoleon',
            lessonStepId: 's03-short-mix',
            orientation: 'vertical',
          },
    );
  }
  for (const data of [
    { recipeId: 'unknown', lessonStepId: 's03-short-mix', locale: 'uk' },
    {
      recipeId: 'gluten-free-napoleon',
      lessonStepId: 'private@email.test',
      locale: 'uk',
    },
    {
      recipeId: 'gluten-free-napoleon',
      lessonStepId: 's03-short-mix',
      locale: 'en',
    },
  ])
    assert.equal(
      sanitizeAnalyticsPayload('event', {
        url,
        name: 'lesson_step_link_click',
        data,
      }),
      false,
    );
});
