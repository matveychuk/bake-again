import assert from 'node:assert/strict';
import {
  napoleon24cmHalfBatch,
  napoleon28cmFrom200gFlour,
} from '../content/recipes/configuration.examples.ts';
import { crinkleCookiesRecipe } from '../content/recipes/crinkle-cookies.recipe.ts';
import { glutenFreeNapoleonRecipe } from '../content/recipes/gluten-free-napoleon.recipe.ts';
import {
  calculateNapoleonConfiguration,
  encodeNapoleonConfiguration,
  napoleonBaseSelection,
  parseNapoleonConfiguration,
} from '../content/recipes/napoleon-configuration.ts';
import type { RecipeDraft } from '../content/recipes/recipe.types.ts';

function validateRecipe(recipe: RecipeDraft) {
  assert.equal(recipe.schemaVersion, 2);
  const lines = recipe.ingredientSections.flatMap(({ lines }) => lines);
  const lineIds = new Set(lines.map(({ id }) => id));
  assert.equal(
    lineIds.size,
    lines.length,
    `${recipe.id}: duplicate ingredient line ID`,
  );

  const geometryIds = new Set([
    recipe.geometry.default.id,
    ...recipe.geometry.alternatives.map(({ id }) => id),
  ]);
  assert(geometryIds.has(recipe.configuration.base.geometryId));
  assert.equal(recipe.configuration.base.status, 'Tested');
  assert.equal(recipe.configuration.base.batchScale, 1);

  for (const geometryId of recipe.configuration.geometryAdjustment?.optionIds ??
    []) {
    assert(
      geometryIds.has(geometryId),
      `${recipe.id}: unknown adjustable geometry`,
    );
  }
  for (const anchor of recipe.configuration.quantityAdjustment.useWhatIHave
    ?.scalingAnchors ?? []) {
    assert(
      lineIds.has(anchor.ingredientLineId),
      `${recipe.id}: unknown anchor line`,
    );
    const line = lines.find(({ id }) => id === anchor.ingredientLineId);
    assert.equal(
      line?.amount?.kind,
      'exact',
      `${recipe.id}: anchor must be exact`,
    );
    assert.equal(
      line?.amount?.unit,
      anchor.allowedUnit,
      `${recipe.id}: anchor unit`,
    );
  }
}

validateRecipe(glutenFreeNapoleonRecipe);
validateRecipe(crinkleCookiesRecipe);

assert.equal(glutenFreeNapoleonRecipe.geometry.default.kind, 'roundTemplate');
assert.equal(
  glutenFreeNapoleonRecipe.geometry.default.application,
  'roll-and-trim',
);
assert.equal(crinkleCookiesRecipe.configuration.geometryAdjustment, null);
assert.equal(
  crinkleCookiesRecipe.configuration.quantityAdjustment.useWhatIHave,
  null,
);

assert.equal(napoleon24cmHalfBatch.status, 'Calculated');
assert.equal(napoleon24cmHalfBatch.provenance, 'Calculated');
assert(
  Math.abs(napoleon24cmHalfBatch.totalScaleFactor - (24 / 28) ** 2 * 0.5) <
    1e-12,
);
assert.equal(napoleon24cmHalfBatch.cookMode.eligible, false);

assert.equal(napoleon28cmFrom200gFlour.status, 'Calculated');
assert.equal(napoleon28cmFrom200gFlour.provenance, 'Calculated');
assert.equal(napoleon28cmFrom200gFlour.totalScaleFactor, 200 / 450);
const flourAmount = napoleon28cmFrom200gFlour.ingredientAmounts.find(
  ({ ingredientLineId }) => ingredientLineId === 'schar-mix-b',
)?.amount;
assert.equal(flourAmount?.kind === 'exact' && flourAmount.value, 200);
assert.equal(napoleon28cmFrom200gFlour.cookMode.eligible, false);

const napoleonBaseConfiguration = calculateNapoleonConfiguration(
  napoleonBaseSelection,
);
assert.equal(napoleonBaseConfiguration.cookMode.eligible, true);
assert.deepEqual(
  parseNapoleonConfiguration(
    new URLSearchParams(encodeNapoleonConfiguration(napoleonBaseSelection)),
  ),
  napoleonBaseSelection,
);

console.log('Validated 2 recipes and 2 calculated configuration fixtures.');
console.log({
  napoleon24cmHalfBatch: {
    totalScaleFactor: napoleon24cmHalfBatch.totalScaleFactor,
    cookMode: napoleon24cmHalfBatch.cookMode,
    warningCodes: [
      ...new Set(napoleon24cmHalfBatch.warnings.map(({ code }) => code)),
    ],
  },
  napoleon28cmFrom200gFlour: {
    totalScaleFactor: napoleon28cmFrom200gFlour.totalScaleFactor,
    flourAmount,
    cookMode: napoleon28cmFrom200gFlour.cookMode,
    warningCodes: [
      ...new Set(napoleon28cmFrom200gFlour.warnings.map(({ code }) => code)),
    ],
  },
});
