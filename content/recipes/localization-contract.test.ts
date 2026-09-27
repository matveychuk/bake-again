import assert from 'node:assert/strict';
import test from 'node:test';
import { recipeDocuments, getRecipeContent } from './registry.ts';
import { localizeRecipeContent } from './localize-content.ts';
import { bananaFrittersRecipe } from './banana-fritters.recipe.ts';
import { banana_frittersEs } from './translations/banana-fritters.es.ts';

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

void test('new untranslated reader fields fail loudly instead of leaking Ukrainian into Spanish', () => {
  const source = bananaFrittersRecipe.translations.uk;
  assert.throws(
    () =>
      localizeRecipeContent(
        { ...source, gapNote: 'A newly added note' },
        banana_frittersEs,
      ),
    /gapNote/,
  );
});
