import assert from 'node:assert/strict';
import test from 'node:test';
import { getCreamPageRecipe } from './cream-page-records.ts';

void test('standalone cream pages provide shared-detail metadata and scaling anchors', () => {
  const expectations = {
    'mascarpone-whipped-cream': 'whipping-cream',
    'vanilla-egg-custard': 'milk',
    'eggless-vanilla-custard': 'milk',
    'vanilla-buttercream': 'butter',
  } as const;

  for (const [id, scalingAnchor] of Object.entries(expectations)) {
    const recipe = getCreamPageRecipe(id);
    assert.ok(recipe, `${id}: missing standalone page record`);
    assert.equal(recipe.scalingAnchorIngredientId, scalingAnchor);
    assert.match(
      recipe.image,
      new RegExp(`/images/recipes/${id}-card-v1\\.webp$`),
    );
    assert.equal(recipe.needsBeforePublishing, '');
  }
});
