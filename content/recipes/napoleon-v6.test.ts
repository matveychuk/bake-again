import { buildShoppingRecipe } from './shopping-projection.ts';
import assert from 'node:assert/strict';
import test from 'node:test';
import { glutenFreeNapoleonRecipe as recipe } from './gluten-free-napoleon.recipe.ts';
import { getRecipeContent } from './registry.ts';
import { applyRecipeContentConfiguration } from './recipe-content-configuration.ts';
import { recipeStructuredData } from '../../lib/seo/recipes.ts';
import { recipeLessonLink } from '../commerce/recipe-lesson-links.ts';
import { getFreeLessonPreview } from '../commerce/free-lesson-preview.ts';
import {
  napoleonLesson,
  napoleonLessonSteps,
} from '../commerce/lessons/napoleon.ts';
import { videoLessons, type VideoLesson } from '../commerce/video-lessons.ts';
const available: VideoLesson = {
  ...videoLessons[0],
  deliveryUrl: '/uk/urok/napoleon',
  status: 'available',
  payhipUrl: 'https://payhip.com/b/lesson123',
  priceMinor: 1900,
  currency: 'EUR',
};
for (const locale of ['uk', 'en', 'es'] as const) {
  void test(`v6 quantities, method, schema and lesson gates (${locale})`, () => {
    const content = getRecipeContent(recipe.id, locale)!;
    const prose = JSON.stringify({
      summary: recipe.summary[locale],
      before: content.beforeStart,
      steps: content.steps,
      timing: content.timing,
      seo: recipeStructuredData(recipe.id, locale, content),
    });
    assert.doesNotMatch(
      prose,
      /\b14\b|seven|siete|(?<![а-яіїє])сім корж|7 корж|конвекц|\bfan\b|ventilador|12–24/,
    );
    const lines = content.ingredientSections.flatMap((s) => s.ingredients);
    assert.equal(lines.find((l) => l.id === 'butter-custard')?.optional, true);
    assert.equal(lines.find((l) => l.id === 'walnuts')?.optional, true);
    assert.deepEqual(
      recipe.steps.find((s) => s.id === 'mix-wet-dough')!.ingredientLineIds,
      ['cultured-dairy-dough', 'eggs-dough'],
    );
    assert.deepEqual(
      recipe.steps.find((s) => s.id === 'combine-dough')!.ingredientLineIds,
      ['salt-dough'],
    );
    assert.equal(
      content.steps.filter((s) =>
        recipeLessonLink(recipe.id, recipe.versionId, locale, s),
      ).length,
      0,
    );
    const links = content.steps.flatMap((s) => {
      const l = recipeLessonLink(recipe.id, recipe.versionId, locale, s, [
        available,
      ]);
      return l ? [l] : [];
    });
    assert.equal(links.length, locale === 'uk' ? 5 : 0);
    for (const link of links)
      assert.equal(link.href, `/uk/urok/napoleon#${link.lessonStepId}`);
    assert.equal(getFreeLessonPreview(recipe.id, locale), null);
    assert.equal(
      'video' in recipeStructuredData(recipe.id, locale, content)!,
      false,
    );
    for (const factor of [0.5, 1, 1.5, 2]) {
      const adjusted = applyRecipeContentConfiguration(
        content,
        factor === 1
          ? { kind: 'base', mode: 'scale', scaleFactor: 1 }
          : { kind: 'adjusted', scaleFactor: factor },
        locale,
      );
      const body = adjusted.steps.find(
        (s) => s.id === 'divide-and-chill',
      )!.body;
      assert(body.includes(String(16 * factor)), body);
      assert(body.includes(String(8 * factor)), body);
      assert(body.includes('24'), body);
      const ingredients = adjusted.ingredientSections.flatMap(
        (s) => s.ingredients,
      );
      const vanilla = ingredients.find((l) => l.id === 'vanilla-sugar-custard')!
        .quantity.base;
      assert(vanilla?.kind === 'exact');
      assert.equal(vanilla.value, 16 * factor);
      assert(
        ingredients
          .find((l) => l.id === 'vanilla-sugar-custard')!
          .note?.includes(String(2 * factor)),
      );
      const shopping = buildShoppingRecipe(
        {
          id: recipe.id,
          versionId: recipe.versionId,
          title: recipe.title[locale],
          ingredientSections: adjusted.ingredientSections,
        },
        1,
        'base',
        locale,
      );
      assert.deepEqual(
        shopping.ingredientSections
          .find((s) => s.id === 'optional')
          ?.lines.map((l) => l.id),
        ['butter-custard', 'walnuts'],
      );
      assert(
        shopping.ingredientSections
          .find((s) => s.id === 'optional')
          ?.lines.every((l) => l.quantity.shopping.defaultSelected === false),
      );
      assert.equal(
        adjusted.evidence?.status,
        factor === 1 ? 'tested' : 'calculated',
      );
    }
  });
}
void test('lesson manifest keeps thirteen stable steps and exactly one free step', () => {
  assert.equal(napoleonLessonSteps.length, 13);
  assert.equal(new Set(napoleonLessonSteps.map((s) => s.stepId)).size, 13);
  assert.deepEqual(
    napoleonLessonSteps
      .filter((s) => 'free' in s && s.free)
      .map((s) => s.stepId),
    ['s08-baked-layers'],
  );
  assert.equal(napoleonLesson.freePreview.enabled, false);
});
