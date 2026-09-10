import assert from 'node:assert/strict';
import test from 'node:test';
import { getRecipeContent } from './registry.ts';

void test('selects the requested locale for a detailed recipe', () => {
  const recipe = getRecipeContent('gluten-free-napoleon', 'uk');
  assert.equal(recipe?.ingredientSections[0]?.title, 'Коржі');
  assert.match(recipe?.beforeStart?.[0] ?? '', /[А-Яа-яІіЇїЄє]/);
});

void test('uses reviewed source-draft translations without leaking English instructions', () => {
  const sourceDraft = getRecipeContent('apple-charlotte', 'es');
  assert.equal(sourceDraft?.ingredientSections[0]?.title, 'Carlota de manzana');
  assert.equal(sourceDraft?.steps[0]?.title, 'Prepara las manzanas');
  assert(!sourceDraft?.steps.some((step) => step.body.includes('Finely chop')));
});
