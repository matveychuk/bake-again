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
import type { RecipeDraft } from '../content/recipes/recipe.types.ts';
import { recipeDocuments } from '../content/recipes/registry.ts';

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
      line?.quantity.base?.kind,
      'exact',
      `${recipe.id}: anchor must be exact`,
    );
    assert.equal(
      line?.quantity.base?.unit,
      anchor.allowedUnit,
      `${recipe.id}: anchor unit`,
    );
  }
}

validateRecipe(glutenFreeNapoleonRecipe);
validateRecipe(crinkleCookiesRecipe);

let validatedRecipeCount = 0;
const registeredRecipeIds = new Set(
  recipeDocuments.map((document) => document.recipe.id),
);
for (const document of recipeDocuments) {
  const creamOptions = document.recipe.creamOptions;
  if (creamOptions) {
    assert.equal(
      new Set(creamOptions.recipeIds).size,
      creamOptions.recipeIds.length,
      `${document.recipe.id}: duplicate cream option`,
    );
    assert(
      creamOptions.recipeIds.includes(creamOptions.recommendedRecipeId),
      `${document.recipe.id}: recommended cream must be one of its options`,
    );
    for (const creamRecipeId of creamOptions.recipeIds) {
      assert(
        registeredRecipeIds.has(creamRecipeId),
        `${document.recipe.id}: unknown cream recipe ${creamRecipeId}`,
      );
    }
  }
  const sections =
    document.kind === 'detailed'
      ? document.recipe.ingredientSections.map((section) => ({
          id: section.id,
          lines: section.lines.map((line) => ({
            id: line.id,
            quantity: line.quantity,
          })),
        }))
      : document.recipe.ingredientSections.map((section) => ({
          id: section.id,
          lines: section.ingredients.map((line) => ({
            id: line.id,
            quantity: line.quantity,
          })),
        }));
  for (const section of sections)
    for (const line of section.lines) {
      assert(
        line.quantity,
        `${document.recipe.id}/${section.id}/${line.id}: missing canonical quantity`,
      );
      assert(
        ['base', 'nameOnly'].includes(line.quantity.shopping.mode),
        `${document.recipe.id}/${line.id}: invalid shopping mode`,
      );
      assert(
        line.quantity.shopping.mode === 'nameOnly' ||
          line.quantity.base !== null,
        `${document.recipe.id}/${line.id}: base shopping requires a base quantity`,
      );
      assert(
        !(
          line.quantity.shopping.mode === 'nameOnly' &&
          line.quantity.base !== null
        ),
        `${document.recipe.id}/${line.id}: name-only quantity must not carry a base`,
      );
    }
  validatedRecipeCount += 1;
}

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
