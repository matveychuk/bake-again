import assert from 'node:assert/strict';
import {
  napoleon28cmHalfBatch,
  napoleon24cmFrom200gFlour,
} from '../content/recipes/configuration.examples.ts';
import { crinkleCookiesRecipe } from '../content/recipes/crinkle-cookies.recipe.ts';
import { glutenFreeNapoleonRecipe } from '../content/recipes/gluten-free-napoleon.recipe.ts';
import {
  calculateNapoleonConfiguration,
  encodeNapoleonConfiguration,
  napoleonBaseSelection,
  parseNapoleonConfiguration,
} from '../content/recipes/napoleon-configuration.ts';
import { recipeDocuments } from '../content/recipes/registry.ts';

import { validateRecipe } from '../content/recipes/validate.ts';
const registeredRecipeIds = new Set(
  recipeDocuments.map((document) => document.recipe.id),
);
for (const { recipe } of recipeDocuments)
  validateRecipe(recipe, registeredRecipeIds);
const validatedRecipeCount = recipeDocuments.length;

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

assert.equal(napoleon28cmHalfBatch.status, 'Calculated');
assert.equal(napoleon28cmHalfBatch.provenance, 'Calculated');
assert(
  Math.abs(napoleon28cmHalfBatch.totalScaleFactor - (28 / 24) ** 2 * 0.5) <
    1e-12,
);
assert.equal(napoleon28cmHalfBatch.cookMode.eligible, false);

assert.equal(napoleon24cmFrom200gFlour.status, 'Calculated');
assert.equal(napoleon24cmFrom200gFlour.provenance, 'Calculated');
assert.equal(napoleon24cmFrom200gFlour.totalScaleFactor, 200 / 500);
const flourAmount = napoleon24cmFrom200gFlour.ingredientAmounts.find(
  ({ ingredientLineId }) => ingredientLineId === 'schar-mix-b',
)?.amount;
assert.equal(flourAmount?.kind === 'exact' && flourAmount.value, 200);
assert.equal(napoleon24cmFrom200gFlour.cookMode.eligible, false);

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

console.log(
  `Validated ${validatedRecipeCount} canonical recipes and 2 calculated configuration fixtures.`,
);
console.log({
  napoleon28cmHalfBatch: {
    totalScaleFactor: napoleon28cmHalfBatch.totalScaleFactor,
    cookMode: napoleon28cmHalfBatch.cookMode,
    warningCodes: [
      ...new Set(napoleon28cmHalfBatch.warnings.map(({ code }) => code)),
    ],
  },
  napoleon24cmFrom200gFlour: {
    totalScaleFactor: napoleon24cmFrom200gFlour.totalScaleFactor,
    flourAmount,
    cookMode: napoleon24cmFrom200gFlour.cookMode,
    warningCodes: [
      ...new Set(napoleon24cmFrom200gFlour.warnings.map(({ code }) => code)),
    ],
  },
});
