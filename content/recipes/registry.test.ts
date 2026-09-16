import assert from 'node:assert/strict';
import test from 'node:test';
import { recipeInventory } from './inventory.ts';
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
  const restStep = recipe?.steps.find((step) => step.id === 'rest');
  const cookStep = recipe?.steps.find((step) => step.id === 'cook');

  assert.equal(firstStep?.title, 'Збийте густу основу');
  assert.match(firstStep?.tip ?? '', /не додавайте все молоко/i);
  assert.equal(firstStep?.media?.length, 3);
  assert.equal(firstStep?.media?.[2].title, 'Перевірте, чи немає грудочок');
  assert.equal(restStep?.meta, '15–20 хв');
  assert.equal(restStep?.body, 'Залиште тісто на 15–20 хвилин.');
  assert.equal(cookStep?.media?.length, 3);
  assert.equal(
    cookStep?.media?.[0].title,
    'Дочекайтеся, поки поверхня схопиться',
  );
  assert.equal(cookStep?.media?.[1].title, 'Піддіть краї');
  assert.equal(cookStep?.media?.[2].title, 'Переверніть і досмажте');
  assert.deepEqual(
    recipe?.steps.map((step) => step.id),
    ['start-batter', 'add-milk', 'rest', 'finish-batter', 'cook'],
  );
  const oil = recipe?.ingredientSections[0]?.ingredients.find(
    (item) => item.id === 'oil',
  );
  assert.deepEqual(oil?.quantity.base, {
    kind: 'exact',
    value: 5,
    unit: 'tbsp',
  });
  assert.deepEqual(oil?.quantity.equivalent, {
    kind: 'exact',
    value: 25,
    unit: 'g',
  });
  assert.equal(recipe?.yield?.label, '10 млинців');
  assert.equal(recipe?.geometry?.label, 'Кругла пательня, 28 см');
  assert.equal(recipe?.timing?.activeMinutes, 40);
  assert.equal(recipe?.timing?.totalElapsedMinutes, 60);
  assert.match(recipe?.beforeStart?.[0] ?? '', /15–20/);
});

void test('keeps the lazy-dumpling base, equivalents and author guidance together', () => {
  const recipe = getRecipeContent('lazy-dumplings', 'uk');
  const ingredients = recipe?.ingredientSections[0]?.ingredients ?? [];
  const cottageCheese = ingredients.find(
    (ingredient) => ingredient.id === 'cottage-cheese',
  );
  const sugar = ingredients.find((ingredient) => ingredient.id === 'sugar');
  const tapioca = ingredients.find((ingredient) => ingredient.id === 'tapioca');
  const shaping = recipe?.steps.find((step) => step.id === 'shape-dumplings');
  const cooking = recipe?.steps.find((step) => step.id === 'cook-dumplings');
  const inventory = recipeInventory.find(
    (item) => item.id === 'lazy-dumplings',
  );

  assert.deepEqual(cottageCheese?.quantity.base, {
    kind: 'exact',
    value: 460,
    unit: 'g',
  });
  assert.deepEqual(cottageCheese?.quantity.equivalent, {
    kind: 'exact',
    value: 2,
    unit: 'packet',
  });
  assert.deepEqual(sugar?.quantity.base, {
    kind: 'exact',
    value: 67,
    unit: 'g',
  });
  assert.deepEqual(sugar?.quantity.equivalent, {
    kind: 'exact',
    value: 3.33,
    unit: 'tbsp',
  });
  assert.deepEqual(tapioca?.quantity.base, {
    kind: 'exact',
    value: 8,
    unit: 'g',
  });
  assert.match(shaping?.tip ?? '', /1,5 кг сиру/);
  assert.deepEqual(
    recipe?.steps.map((step) => step.id),
    [
      'mix-wet',
      'add-dry',
      'rest',
      'shape-log',
      'shape-dumplings',
      'cook-dumplings',
    ],
  );
  assert.equal(cooking?.title, 'Зваріть вареники');
  assert.equal(cooking?.cookInstructions?.length, 3);
  assert.deepEqual(cooking?.cookIngredients, [
    { ingredientId: 'water', quantity: 'omit' },
  ]);
  assert.equal(inventory?.scalingAnchorIngredientId, 'cottage-cheese');
});

void test('keeps the rounded one-cake carrot recipe and checkpoints together', () => {
  const recipe = getRecipeContent('carrot-cake', 'uk');
  const ingredients = recipe?.ingredientSections[0]?.ingredients ?? [];
  const amount = (id: string) =>
    ingredients.find((ingredient) => ingredient.id === id)?.quantity.base;
  const whippedEggs = recipe?.steps.find((step) => step.id === 'whip-eggs');
  const baking = recipe?.steps.find((step) => step.id === 'bake');
  const addIns = recipe?.steps.find((step) => step.id === 'fold-add-ins');

  assert.deepEqual(amount('carrots'), {
    kind: 'exact',
    value: 200,
    unit: 'g',
  });
  assert.deepEqual(amount('eggs'), {
    kind: 'exact',
    value: 3,
    unit: 'piece',
  });
  assert.deepEqual(amount('flour'), {
    kind: 'exact',
    value: 170,
    unit: 'g',
  });
  assert.deepEqual(amount('raisins'), {
    kind: 'exact',
    value: 80,
    unit: 'g',
  });
  assert.match(whippedEggs?.checkpoint ?? '', /три-чотири рази/);
  assert.match(baking?.body ?? '', /зубочисткою/);
  assert.match(addIns?.tip ?? '', /трьох днів/);
});
