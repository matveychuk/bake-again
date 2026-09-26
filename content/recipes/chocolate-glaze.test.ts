import assert from 'node:assert/strict';
import test from 'node:test';
import { getRecipeContent } from './registry.ts';

void test('chocolate glaze is a universal 120 g recipe with two photographed steps', () => {
  const expectedYield = {
    uk: '120 г глазурі',
    en: '120 g glaze',
    es: '120 g de glaseado',
  } as const;

  for (const locale of ['uk', 'en', 'es'] as const) {
    const glaze = getRecipeContent('chocolate-glaze', locale)!;

    assert.equal(glaze.timing?.activeMinutes, 10);
    assert.equal(glaze.yield?.label, expectedYield[locale]);
    assert.deepEqual(glaze.yield?.count, { kind: 'exact', value: 120 });
    assert.equal(glaze.yield?.unit, 'g');
    assert.equal(glaze.steps.length, 2);
    assert(glaze.steps.every((step) => step.tip === undefined));
    assert(
      glaze.steps.every(
        (step) =>
          step.media?.length === 1 && step.media[0]?.src.endsWith('.webp'),
      ),
    );
    assert.equal(glaze.steps[0]?.cookIngredients?.length, 4);
    assert.equal(glaze.steps[1]?.cookIngredients, undefined);
    assert(
      !glaze.evidence?.explanation.toLocaleLowerCase().includes('prune') &&
        !glaze.evidence?.explanation.toLocaleLowerCase().includes('чорнослив'),
    );
  }
});
