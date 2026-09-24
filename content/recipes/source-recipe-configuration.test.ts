import assert from 'node:assert/strict';
import test from 'node:test';
import { getRecipeContent } from './registry.ts';
import {
  applySourceRecipeConfiguration,
  parseSourceRecipeConfiguration,
  sourceAssistantConfiguration,
  updateSourceRecipeConfigurationParams,
} from './source-recipe-configuration.ts';

void test('round-trips a scale while preserving unrelated configuration', () => {
  const params = updateSourceRecipeConfigurationParams(
    'cream=vanilla-egg-custard',
    { mode: 'scale', scaleFactor: 2 },
  );
  assert.equal(params.get('cream'), 'vanilla-egg-custard');
  assert.equal(params.get('mode'), 'scale');
  assert.equal(params.get('scale'), '2');
  const content = getRecipeContent('crepes', 'en')!;
  assert.deepEqual(parseSourceRecipeConfiguration(params, content, 'flour'), {
    kind: 'adjusted',
    mode: 'scale',
    scaleFactor: 2,
  });
});

void test('treats 1x as the tested base and removes scaling parameters', () => {
  const params = updateSourceRecipeConfigurationParams(
    'cream=vanilla-egg-custard&mode=scale&scale=2',
    { mode: 'scale', scaleFactor: 1 },
  );
  assert.equal(params.toString(), 'cream=vanilla-egg-custard');
  assert.equal(
    parseSourceRecipeConfiguration(
      params,
      getRecipeContent('eclairs', 'en'),
      'eggs',
    ).kind,
    'base',
  );
});

void test('an available amount equal to the recorded anchor remains the tested base', () => {
  const content = getRecipeContent('crepes', 'en')!;
  assert.deepEqual(
    parseSourceRecipeConfiguration(
      'mode=ingredient&ingredient=eggs&amount=5&unit=piece',
      content,
      'eggs',
    ),
    {
      kind: 'base',
      mode: 'ingredient',
      scaleFactor: 1,
      ingredientId: 'eggs',
      availableAmount: 5,
      unit: 'piece',
    },
  );
});

void test('scales crepe ingredients and yield, while retaining fixed salt', () => {
  const base = getRecipeContent('crepes', 'en')!;
  const configuration = parseSourceRecipeConfiguration(
    'mode=scale&scale=2',
    base,
    'flour',
  );
  const configured = applySourceRecipeConfiguration(base, configuration, 'en');
  const ingredients = configured.ingredientSections.flatMap(
    (section) => section.ingredients,
  );
  assert.deepEqual(ingredients.find(({ id }) => id === 'eggs')?.quantity.base, {
    kind: 'exact',
    value: 10,
    unit: 'piece',
  });
  assert.deepEqual(
    ingredients.find(({ id }) => id === 'flour')?.quantity.base,
    {
      kind: 'exact',
      value: 280,
      unit: 'g',
    },
  );
  assert.deepEqual(
    ingredients.find(({ id }) => id === 'salt')?.quantity.equivalent,
    {
      kind: 'exact',
      value: 1,
      unit: 'pinch',
    },
  );
  assert.equal(configured.overview.yieldLabel, '20 crepes');
  assert.equal(configured.evidence?.status, 'calculated');
  assert.equal(configured.overview.timing.activeMinutes, 40);
  assert.deepEqual(
    sourceAssistantConfiguration('crepes', configured, configuration),
    {
      kind: 'adjusted',
      geometryId: 'round-pan-28-cm',
      quantityAdjustment: { mode: 'batchScale', factor: 2 },
    },
  );
});

void test('keeps zero and negative available amounts invalid instead of falling back', () => {
  const content = getRecipeContent('crepes', 'uk')!;
  for (const amount of ['0', '-2', '']) {
    assert.equal(
      parseSourceRecipeConfiguration(
        `mode=ingredient&ingredient=flour&amount=${amount}&unit=g`,
        content,
        'flour',
      ).kind,
      'invalid',
    );
  }
});

void test('keeps a positive amount outside a recipe constraint invalid', () => {
  const content = getRecipeContent('gluten-free-napoleon', 'en')!;
  const configuration = parseSourceRecipeConfiguration(
    'mode=ingredient&ingredient=schar-mix-b&amount=50&unit=g',
    content,
    'schar-mix-b',
    { minimum: 100 },
  );
  assert.equal(configuration.kind, 'invalid');
  assert.equal(
    configuration.kind === 'invalid' ? configuration.reason : null,
    'unsupported',
  );
});
