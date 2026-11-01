import assert from 'node:assert/strict';
import test from 'node:test';
import { recipeDocuments, getRecipeContent } from './registry.ts';
import { validateRecipe } from './validate.ts';
import { bananaFrittersRecipe } from './banana-fritters.recipe.ts';

void test('all recipe locales preserve canonical quantities, provenance and step identities', () => {
  for (const { recipe } of recipeDocuments) {
    const uk = getRecipeContent(recipe.id, 'uk')!;
    for (const locale of ['en', 'es'] as const) {
      const content = getRecipeContent(recipe.id, locale)!;
      const facts = (value: typeof content) => ({
        status: value.evidence?.status,
        ingredients: value.ingredientSections.flatMap((section) =>
          section.ingredients.map((ingredient) => ({
            id: ingredient.id,
            quantity: ingredient.quantity,
            optional: ingredient.optional,
            scaling: ingredient.scaling,
          })),
        ),
        steps: value.steps.map((step) => step.id),
        yield: value.yield?.count,
        active: value.timing?.activeMinutes,
        total: value.timing?.totalElapsedMinutes,
        phases: value.timing?.phases.map((phase) => ({
          id: phase.id,
          duration: phase.duration,
          step: phase.relatedStepId,
        })),
      });
      assert.deepEqual(facts(content), facts(uk), `${recipe.id}/${locale}`);
    }
  }
});

void test('new untranslated reader fields fail validation instead of leaking another language', () => {
  const recipe = structuredClone(bananaFrittersRecipe);
  recipe.steps[0].instruction.es = '';
  assert.throws(
    () => validateRecipe(recipe),
    /missing es text at steps.0.instruction/,
  );
});
