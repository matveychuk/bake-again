import assert from 'node:assert/strict';
import test from 'node:test';
import { createSourceCookSteps } from './cook-mode-adapter.ts';
import { getRecipeContent } from './registry.ts';

void test('crepes Cook Mode preserves Ukrainian step copy and media from the recipe source', () => {
  const content = getRecipeContent('crepes', 'uk');
  assert.ok(content);

  const steps = createSourceCookSteps(content, 'uk');
  assert.equal(steps.length, 4);
  assert.equal(steps[0].title, 'Збийте густу основу');
  assert.equal(steps[0].media?.length, 3);
  assert.equal(steps[0].media?.[2].title, 'Перевірте, чи немає грудочок');
  assert.deepEqual(steps[1].stepIds, ['add-milk', 'rest']);
  assert.equal(steps[1].instructions.length, 2);
  assert.deepEqual(steps[1].timerOptionsSeconds, [900, 1200]);
  assert.equal(steps[3].media?.length, 3);
  assert.equal(
    steps[3].media?.[0].title,
    'Дочекайтеся, поки поверхня схопиться',
  );
});

void test('crepes Cook Mode resolves Spanish content through the same adapter', () => {
  const content = getRecipeContent('crepes', 'es');
  assert.ok(content);

  const steps = createSourceCookSteps(content, 'es');
  assert.equal(steps[0].title, 'Bate una base espesa');
  assert.equal(steps[0].media?.[0].title, 'Añade los ingredientes secos');
  assert.equal(
    steps[3].media?.[2].title,
    'Dale la vuelta y termina la cocción',
  );
});

void test('lazy dumplings Cook Mode uses one cooking step and step ingredients', () => {
  const content = getRecipeContent('lazy-dumplings', 'uk');
  assert.ok(content);

  const steps = createSourceCookSteps(content, 'uk');
  assert.equal(steps.length, 6);
  assert.deepEqual(
    steps[0].ingredients.map((ingredient) => ingredient.id),
    ['cottage-cheese', 'eggs', 'sugar'],
  );
  assert.deepEqual(
    steps[1].ingredients.map((ingredient) => ingredient.id),
    ['flour', 'tapioca'],
  );
  assert.equal(steps[5].title, 'Зваріть вареники');
  assert.deepEqual(steps[5].stepIds, ['cook-dumplings']);
  assert.deepEqual(
    steps[5].ingredients.map((ingredient) => ingredient.id),
    ['water'],
  );
  assert.deepEqual(steps[5].timerOptionsSeconds, [60, 120]);
});
