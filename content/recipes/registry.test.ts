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

void test('keeps localized crepe step media and practical guidance together', () => {
  const recipe = getRecipeContent('crepes', 'uk');
  const firstStep = recipe?.steps[0];
  const cookStep = recipe?.steps.find((step) => step.id === 'cook');

  assert.equal(firstStep?.title, 'Збийте густу основу');
  assert.match(firstStep?.tip ?? '', /не додавайте все молоко/i);
  assert.equal(firstStep?.media?.length, 3);
  assert.equal(firstStep?.media?.[2].title, 'Перевірте, чи немає грудочок');
  assert.equal(cookStep?.media?.length, 3);
  assert.equal(cookStep?.media?.[0].title, 'Дочекайтеся, поки поверхня схопиться');
  assert.equal(cookStep?.media?.[1].title, 'Піддіть краї');
  assert.equal(cookStep?.media?.[2].title, 'Переверніть і досмажте');
  assert.deepEqual(recipe?.steps.map((step) => step.id), [
    'start-batter',
    'add-milk',
    'rest',
    'finish-batter',
    'cook',
  ]);
  const oil = recipe?.ingredientSections[0]?.ingredients.find((item) => item.id === 'oil');
  assert.deepEqual(oil?.quantity.base, { kind: 'exact', value: 5, unit: 'tbsp' });
  assert.deepEqual(oil?.quantity.equivalent, { kind: 'exact', value: 25, unit: 'g' });
  assert.match(recipe?.beforeStart?.[0] ?? '', /15–17.*24 см/);
});
