import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createSourceCookSteps,
  isSourceCookModeAvailable,
} from './cook-mode-adapter.ts';
import { getRecipeContent } from './registry.ts';

void test('crepes Cook Mode preserves Ukrainian step copy and media from the recipe source', () => {
  const content = getRecipeContent('crepes', 'uk');
  assert.ok(content);

  const steps = createSourceCookSteps(content, 'uk');
  assert.equal(steps.length, 4);
  assert.equal(steps[0].title, 'Збийте густу основу');
  assert.equal(steps[0].media?.length, 3);
  assert.equal(steps[0].media?.[2].title, 'Перевірте, чи немає грудочок');
  assert.deepEqual(steps[1].stepIds, ['add-milk', 'rest']);
  assert.equal(steps[1].instructions.length, 2);
  assert.deepEqual(steps[1].timerOptionsSeconds, [900, 1200]);
  assert.equal(steps[3].media?.length, 3);
  assert.equal(
    steps[3].media?.[0].title,
    'Дочекайтеся, поки поверхня схопиться',
  );
});

void test('crepes Cook Mode resolves Spanish content through the same adapter', () => {
  const content = getRecipeContent('crepes', 'es');
  assert.ok(content);

  const steps = createSourceCookSteps(content, 'es');
  assert.equal(steps[0].title, 'Bate una base espesa');
  assert.equal(steps[0].media?.[0].title, 'Añade los ingredientes secos');
  assert.equal(
    steps[3].media?.[2].title,
    'Dale la vuelta y termina la cocción',
  );
});

void test('lazy dumplings Cook Mode uses one cooking step and step ingredients', () => {
  const content = getRecipeContent('lazy-dumplings', 'uk');
  assert.ok(content);

  const steps = createSourceCookSteps(content, 'uk');
  assert.equal(steps.length, 6);
  assert.deepEqual(
    steps[0].ingredients.map((ingredient) => ingredient.id),
    ['cottage-cheese', 'eggs', 'sugar'],
  );
  assert.deepEqual(
    steps[1].ingredients.map((ingredient) => ingredient.id),
    ['flour', 'tapioca'],
  );
  assert.equal(steps[5].title, 'Зваріть вареники');
  assert.deepEqual(steps[5].stepIds, ['cook-dumplings']);
  assert.deepEqual(
    steps[5].ingredients.map((ingredient) => ingredient.id),
    ['water'],
  );
  assert.deepEqual(steps[5].timerOptionsSeconds, [60, 120]);
});

void test('cottage-cheese waffles groups the dry work and shows only its step ingredients', () => {
  const content = getRecipeContent('cottage-cheese-waffles', 'uk');
  assert.ok(content);

  const steps = createSourceCookSteps(content, 'uk');
  assert.equal(steps.length, 5);
  assert.equal(steps[0].title, 'Збийте основу блендером');
  assert.deepEqual(
    steps[0].ingredients.map((ingredient) => ingredient.id),
    ['cottage-cheese', 'eggs', 'yogurt'],
  );
  assert.deepEqual(
    steps[1].ingredients.map((ingredient) => ingredient.id),
    ['oil', 'sugar', 'salt', 'vanilla'],
  );
  assert.deepEqual(steps[2].stepIds, ['mix-dry', 'mix-batter']);
  assert.deepEqual(
    steps[2].ingredients.map((ingredient) => ingredient.id),
    ['flour', 'corn-starch', 'baking-powder'],
  );
  assert.equal(steps[2].media?.length, 2);
  assert.deepEqual(steps[3].timerOptionsSeconds, [420, 600]);
  assert.deepEqual(steps[4].timerOptionsSeconds, [300, 420]);
});

void test('fruit sponge roll Cook Mode keeps Ukrainian guidance and step ingredients', () => {
  const content = getRecipeContent('fruit-sponge-roll', 'uk');
  assert.ok(content);

  const steps = createSourceCookSteps(content, 'uk');
  assert.equal(steps.length, 6);
  assert.deepEqual(
    steps[0].ingredients.map((ingredient) => ingredient.id),
    ['eggs', 'sugar-sponge', 'salt'],
  );
  assert.match(steps[0].checkpoint ?? '', /густою світлою піною/i);
  assert.deepEqual(
    steps[4].ingredients.map((ingredient) => ingredient.id),
    ['whipping-cream', 'sugar-cream', 'mascarpone'],
  );
  assert.match(steps[3].tip ?? '', /охолонути/i);
  assert.equal(steps[0].media?.[0]?.id, 'fruit-roll-egg-foam-v1');
  assert.equal(steps[3].media?.length, 2);
});

void test('sponge cake Cook Mode separates sugar for whites and yolks', () => {
  const content = getRecipeContent('sponge-cake', 'uk');
  assert.ok(content);

  const steps = createSourceCookSteps(content, 'uk');
  assert.equal(steps.length, 6);
  assert.deepEqual(
    steps[1].ingredients.map((ingredient) => ingredient.id),
    ['sugar-whites'],
  );
  assert.deepEqual(
    steps[2].ingredients.map((ingredient) => ingredient.id),
    ['sugar-yolks'],
  );
  assert.deepEqual(
    steps[4].ingredients.map((ingredient) => ingredient.id),
    ['corn-starch', 'tapioca', 'flour'],
  );
  assert.equal(steps[1].media?.[0]?.id, 'sponge-whipped-whites-v1');
  assert.equal(steps[5].media?.[0]?.id, 'sponge-batter-form-v1');
});

void test('banana pancakes Cook Mode keeps Mix B ingredients, cues and photography', () => {
  const content = getRecipeContent('banana-fritters', 'uk');
  assert.ok(content);

  const steps = createSourceCookSteps(content, 'uk');
  assert.equal(steps.length, 6);
  assert.deepEqual(
    steps[0].ingredients.map((ingredient) => ingredient.id),
    ['flour', 'sugar', 'baking-soda', 'salt'],
  );
  assert.equal(steps[0].media?.[0]?.id, 'banana-pancakes-dry-mix-v1');
  assert.equal(steps[3].media?.[0]?.id, 'banana-pancakes-lumpy-batter-v1');
  assert.equal(steps[5].media?.[0]?.id, 'banana-pancakes-flip-cue-v1');
  assert.match(steps[5].checkpoint ?? '', /бульбашки/i);
  assert.equal(steps[5].timerOptionsSeconds, undefined);
});

void test('apple-banana Cook Mode uses banana instead of added sweetener', () => {
  const content = getRecipeContent('apple-banana-fritters', 'uk');
  assert.ok(content);

  const steps = createSourceCookSteps(content, 'uk');
  assert.equal(steps.length, 7);
  assert.deepEqual(
    steps[0].ingredients.map((ingredient) => ingredient.id),
    ['apples', 'banana'],
  );
  assert.deepEqual(
    steps[1].ingredients.map((ingredient) => ingredient.id),
    ['egg', 'kefir-or-yogurt', 'banana'],
  );
  assert(
    !steps.some((step) =>
      step.ingredients.some((item) => item.id === 'sweetener'),
    ),
  );
  assert.match(steps[6].tip ?? '', /банан швидко підрум’янюється/i);
});

void test('eclairs Cook Mode keeps the four Ukrainian checkpoint photos', () => {
  const content = getRecipeContent('eclairs', 'uk');
  assert.ok(content);

  const steps = createSourceCookSteps(content, 'uk');
  assert.equal(steps.length, 8);
  assert.equal(steps[2].media?.[0]?.id, 'eclairs-cooked-panade-v1');
  assert.equal(steps[3].media?.[0]?.id, 'eclairs-heavy-ribbon-v2');
  assert.equal(steps[4].media?.[0]?.id, 'eclairs-piped-profiteroles-v2');
  assert.equal(steps[6].media?.[0]?.id, 'eclairs-dry-hollow-shells-v2');
});

void test('cinnamon-roll Cook Mode keeps baking and finishing as separate steps', () => {
  const content = getRecipeContent('cinnamon-rolls', 'uk');
  assert.ok(content);

  const steps = createSourceCookSteps(content, 'uk');
  assert.equal(steps.length, 9);
  assert.match(steps[0].checkpoint ?? '', /бульбашки|піна/i);
  assert.equal(steps[0].media?.[0]?.id, 'cinnamon-rolls-activated-yeast-v1');
  assert.deepEqual(steps[6].timerOptionsSeconds, [2400, 3600]);
  assert.equal(steps[6].media?.[0]?.id, 'cinnamon-rolls-second-proof-v1');
  assert.match(steps[7].instructions[0] ?? '', /Випікайте при 180°C/i);
  assert.equal(steps[7].timerSeconds, 1200);
  assert.equal(steps[7].media?.[0]?.id, 'cinnamon-rolls-lightly-golden-v1');
  assert.equal(steps[8].title, 'Додайте обраний фініш');
  assert.equal(steps[8].media?.[0]?.id, 'cinnamon-rolls-cream-cheese-glaze-v1');
  assert.deepEqual(
    steps[8].ingredients.map((ingredient) => ingredient.id),
    ['cream-cheese', 'icing-sugar', 'glaze-water'],
  );
});

void test('does not present an incomplete prune-cake record as cookable', () => {
  const content = getRecipeContent('prune-cake', 'uk');
  assert.ok(content);
  assert.equal(isSourceCookModeAvailable(content), false);
  assert.match(content.gapNote ?? '', /Не готуйте за цією чернеткою/i);
});
