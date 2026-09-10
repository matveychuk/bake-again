import assert from 'node:assert/strict';
import test from 'node:test';
import { crinkleCookiesRecipe } from '../../content/recipes/crinkle-cookies.recipe.ts';
import type { RecipeDraft } from '../../content/recipes/recipe.types.ts';
import {
  getPreviewRobots,
  getPublishableRecipeLocales,
  isRecipeLocalePublishable,
  isUiLocalePublishable,
} from './publication.ts';

void test('only reviewed UI locales are publishable', () => {
  assert.equal(isUiLocalePublishable('en'), true);
  assert.equal(isUiLocalePublishable('es'), false);
  assert.equal(isUiLocalePublishable('uk'), false);
});

void test('a draft recipe translation is not a public language equivalent', () => {
  assert.equal(isRecipeLocalePublishable(crinkleCookiesRecipe, 'en'), false);
  assert.deepEqual(getPublishableRecipeLocales(crinkleCookiesRecipe), []);
  assert.deepEqual(getPreviewRobots(false), { index: false, follow: false });
});

void test('a ready recipe requires a reviewed locale before publication', () => {
  const readyRecipe: Pick<RecipeDraft, 'publicationStatus' | 'translationState'> = {
    publicationStatus: 'ready',
    translationState: { en: 'reviewed', es: 'draftTranslation', uk: 'reviewed' },
  };

  assert.equal(isRecipeLocalePublishable(readyRecipe, 'en'), true);
  assert.deepEqual(getPublishableRecipeLocales(readyRecipe), ['en', 'uk']);
  assert.equal(getPreviewRobots(true), undefined);
});
