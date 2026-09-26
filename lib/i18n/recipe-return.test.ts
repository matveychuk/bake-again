import assert from 'node:assert/strict';
import test from 'node:test';
import {
  canReturnFromMarker,
  canReturnToPreviousRecipe,
  createRecipeReturnMarker,
} from './recipe-return.ts';

const currentHref = 'https://bakeagain.example/uk/recipes/sour-cream';

void test('returns through history when another same-site recipe opened the page', () => {
  assert.equal(
    canReturnToPreviousRecipe({
      currentHref,
      referrer:
        'https://bakeagain.example/uk/recipes/celebration-sponge-cake',
    }),
    true,
  );
  assert.equal(
    canReturnToPreviousRecipe({
      currentHref,
      referrer: 'https://bakeagain.example/recipes/fruit-sponge-roll',
    }),
    true,
  );
});

void test('falls back for direct, external, catalogue and same-page visits', () => {
  for (const referrer of [
    '',
    'https://messages.example/shared-link',
    'https://bakeagain.example/uk#recipes',
    currentHref,
    'not a URL',
  ]) {
    assert.equal(
      canReturnToPreviousRecipe({ currentHref, referrer }),
      false,
      referrer,
    );
  }
});

void test('does not treat Cook Mode as a parent recipe page', () => {
  assert.equal(
    canReturnToPreviousRecipe({
      currentHref,
      referrer:
        'https://bakeagain.example/uk/recipes/celebration-sponge-cake/cook',
    }),
    false,
  );
});

void test('uses a short-lived session marker without changing the target URL', () => {
  const sourceHref =
    'https://bakeagain.example/uk/recipes/celebration-sponge-cake';
  const marker = createRecipeReturnMarker({
    sourceHref,
    targetHref: currentHref,
    createdAt: 1_000,
  });

  assert.deepEqual(marker, {
    sourceHref,
    targetHref: currentHref,
    createdAt: 1_000,
  });
  assert.equal(
    canReturnFromMarker({ currentHref, marker: marker!, now: 2_000 }),
    true,
  );
  assert.equal(
    canReturnFromMarker({
      currentHref: 'https://bakeagain.example/uk/recipes/buttercream',
      marker: marker!,
      now: 2_000,
    }),
    false,
  );
  assert.equal(
    canReturnFromMarker({ currentHref, marker: marker!, now: 122_001 }),
    false,
  );
});
