import assert from 'node:assert/strict';
import test from 'node:test';
import {
  formatDuration,
  formatElapsedMinutes,
  formatQuantity,
  formatRecipeCount,
} from './format.ts';

void test('formats decimal quantities and units for every supported locale', () => {
  const quantity = { kind: 'exact', value: 1.5, unit: 'tsp' } as const;
  assert.equal(formatQuantity('en', quantity), '1.5 tsp');
  assert.equal(formatQuantity('es', quantity), '1,5 cdtas.');
  assert.equal(formatQuantity('uk', quantity), '1,5 ч. л.');
});

void test('keeps Ukrainian cup amounts grammatical when a recipe is scaled', () => {
  for (const [value, label] of [
    [1, '1 склянка'],
    [2, '2 склянки'],
    [3, '3 склянки'],
    [4, '4 склянки'],
    [5, '5 склянок'],
    [1.5, '1,5 склянки'],
  ] as const) {
    assert.equal(
      formatQuantity('uk', { kind: 'exact', value, unit: 'cup' }),
      label,
    );
  }
});

void test('formats ranges and minimum durations without English-only grammar', () => {
  assert.equal(
    formatDuration('es', { kind: 'range', min: 8, max: 10, unit: 'minute' }),
    '8–10 min',
  );
  assert.equal(
    formatDuration('uk', { kind: 'minimum', min: 2, unit: 'hour' }),
    'Щонайменше 2 год',
  );
});

void test('formats compound elapsed times in hours and minutes', () => {
  assert.equal(formatElapsedMinutes('uk', 150), '2 год 30 хв');
  assert.equal(formatElapsedMinutes('en', 75), '1 hour 15 min');
  assert.equal(formatElapsedMinutes('es', 45), '45 min');
});

void test('formats recipe counts with locale-specific labels', () => {
  assert.equal(formatRecipeCount('en', 2), '2 recipes');
  assert.equal(formatRecipeCount('es', 1), '1 receta');
  assert.equal(formatRecipeCount('uk', 5), '5 рецептів');
});
