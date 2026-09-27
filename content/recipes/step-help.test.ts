import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { recipeDocuments, getRecipeContent } from './registry.ts';
import { stepHelpCatalog } from './step-help.catalog.ts';
import { resolveStepHelp } from './step-help.ts';
import { applySourceRecipeConfiguration } from './source-recipe-configuration.ts';
import { createSourceCookSteps } from './cook-mode-adapter.ts';
import { composeRecipeWithCream } from './cream-composition.ts';

const locales = ['uk', 'en', 'es'] as const;
const reviewed = JSON.parse(readFileSync(new URL('./step-help.review.json', import.meta.url), 'utf8')) as Record<string, string>;

void test('every recipe, step and language has an explicit reviewed help decision and valid answer sources', () => {
  assert.deepEqual(Object.keys(stepHelpCatalog).sort(), recipeDocuments.map(d => d.recipe.id).sort());
  const actual: Record<string, string> = {};
  for (const { recipe } of recipeDocuments) {
    for (const locale of locales) {
      const content = getRecipeContent(recipe.id, locale)!;
      assert.deepEqual(Object.keys(stepHelpCatalog[recipe.id]).sort(), content.steps.map(s => s.id).sort());
      for (const step of content.steps) {
        const decision = stepHelpCatalog[recipe.id][step.id];
        const label = `${recipe.id}/${step.id}/${locale}`;
        assert(decision.reason.trim(), label);
        assert(decision.questions.length <= 3, label);
        const answers = resolveStepHelp(step);
        assert.equal(answers.length, decision.questions.length, label);
        assert.equal(new Set(answers.map(a => a.question)).size, answers.length, label);
        for (const [index, answer] of answers.entries()) {
          assert(answer.question.length > 10 && answer.question.endsWith('?'), label);
          assert(answer.answer.length > 10 && answer.answer.length <= 1200, label);
          for (const field of decision.questions[index].evidence) assert(step[field]?.trim(), `${label}/${field}`);
        }
        // Any source/version or editorial answer change requires reviewing the pair again.
        actual[label] = createHash('sha256').update(JSON.stringify({
          version: recipe.versionId ?? `${recipe.id}-source-v1`,
          title: step.title, body: step.body, tip: step.tip, checkpoint: step.checkpoint,
          decision,
        })).digest('hex');
      }
    }
  }
  assert.deepEqual(actual, reviewed, 'Recipe/help changed since editorial audit. Review affected pairs before updating the snapshot.');
});

void test('prepared quantity answers use the displayed configuration in all languages', () => {
  for (const locale of locales) {
    for (const [recipeId, stepId] of [['gluten-free-napoleon', 'heat-milk'], ['plum-cake', 'fold-butter']] as const) {
      const source = getRecipeContent(recipeId, locale)!;
      const original = resolveStepHelp(source.steps.find(s => s.id === stepId)!)[0].answer;
      for (const factor of [0.5, 1.5, 2]) {
        const configured = applySourceRecipeConfiguration(source, { kind: 'adjusted', scaleFactor: factor }, locale);
        const step = configured.steps.find(s => s.id === stepId)!;
        assert.equal(resolveStepHelp(step)[0].answer, step.body);
        assert.notEqual(resolveStepHelp(step)[0].answer, original);
        assert.equal(resolveStepHelp(source.steps.find(s => s.id === stepId)!)[0].answer, original);
      }
    }
  }
});

void test('selected cream and grouped steps retain their own prepared help without inheriting Tested', () => {
  for (const locale of locales) {
    for (const { recipe } of recipeDocuments) {
      const host = getRecipeContent(recipe.id, locale)!;
      for (const creamId of host.creamOptions?.recipeIds ?? []) {
        const cream = getRecipeContent(creamId, locale)!;
        const composed = composeRecipeWithCream(host, cream, creamId, locale);
        const adjusted = applySourceRecipeConfiguration(composed, { kind: 'adjusted', scaleFactor: 2 }, locale);
        assert.equal(adjusted.evidence?.status, 'suggested');
        for (const step of cream.steps) {
          const composedStep = adjusted.steps.find(s => s.id === `cream-${creamId}-${step.id}`)!;
          assert(composedStep);
          assert.deepEqual(resolveStepHelp(composedStep).map(a => a.question), resolveStepHelp(step).map(a => a.question));
        }
        const expected = adjusted.steps.flatMap(resolveStepHelp);
        const grouped = createSourceCookSteps(adjusted, locale).flatMap(s => s.preparedAnswers ?? []);
        assert.deepEqual(grouped, expected);
        assert.equal(new Set(grouped.map(a => a.id)).size, grouped.length);
      }
    }
    const source = getRecipeContent('gluten-free-napoleon', locale)!;
    const pair = source.steps.slice(5, 7).map(s => ({ ...s, cookGroup: 'chill-and-temper' }));
    const grouped = createSourceCookSteps({ ...source, steps: pair }, locale);
    assert.equal(grouped.length, 1);
    assert.deepEqual(grouped[0].preparedAnswers, pair.flatMap(resolveStepHelp));
  }
});
