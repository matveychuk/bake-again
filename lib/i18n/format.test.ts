import assert from 'node:assert/strict';
import test from 'node:test';
import { formatDuration, formatQuantity, formatRecipeCount } from './format.ts';

void test('formats decimal quantities and units for every supported locale', () => {
  const quantity = { kind: 'exact', value: 1.5, unit: 'tsp' } as const;
  assert.equal(formatQuantity('en', quantity), '1.5 tsp');
  assert.equal(formatQuantity('es', quantity), '1,5 cdtas.');
  assert.equal(formatQuantity('uk', quantity), '1,5 ч. л.');
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

void test('formats recipe counts with locale-specific labels', () => {
  assert.equal(formatRecipeCount('en', 2), '2 recipes');
  assert.equal(formatRecipeCount('es', 1), '1 receta');
  assert.equal(formatRecipeCount('uk', 5), '5 рецептів');
});
