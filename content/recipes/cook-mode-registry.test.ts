import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createSourceCookSteps,
  isSourceCookModeAvailable,
} from './cook-mode-adapter.ts';
import { getRecipeContent } from './registry.ts';

void test('banana bread is cookable with five steps and the confirmed baking timer', () => {
  for (const locale of ['uk', 'en', 'es'] as const) {
    const content = getRecipeContent('banana-bread', locale)!;
    assert.equal(isSourceCookModeAvailable(content), true);
    const steps = createSourceCookSteps(content, locale);
    assert.equal(steps.length, 5);
    assert.deepEqual(
      steps[0].ingredients.map((item) => item.id),
      ['butter', 'sugar'],
    );
    assert.deepEqual(
      steps[2].ingredients.map((item) => item.id),
      ['flour', 'baking-powder', 'salt', 'walnuts', 'raisins'],
    );
    assert.deepEqual(steps[3].timerOptionsSeconds, [2400]);
    assert.deepEqual(steps[4].timerOptionsSeconds, [600]);
  }
});

void test('concise detailed cookies preserve chilling/baking timers and omit removed ingredients', () => {
  for (const locale of ['uk', 'en', 'es'] as const) {
    const content = getRecipeContent('crinkle-cookies', locale)!;
    const steps = createSourceCookSteps(content, locale);
    assert.equal(steps.length, 7);
    assert.deepEqual(
      steps[0].ingredients.map((item) => item.id),
      ['eggs', 'sugar', 'butter'],
    );
    assert.deepEqual(
      steps[1].ingredients.map((item) => item.id),
      ['cocoa', 'flour', 'baking-powder'],
    );
    assert.deepEqual(steps[2].timerOptionsSeconds, [10800, 14400]);
    assert.deepEqual(steps[5].timerOptionsSeconds, [480, 600]);
    assert(
      steps
        .flatMap((step) => step.ingredients)
        .every((item) => item.id !== 'orange-zest'),
    );
  }
});

void test('reviewed carrot cake keeps seven concise steps, ingredients and the baking timer', () => {
  for (const locale of ['uk', 'en', 'es'] as const) {
    const content = getRecipeContent('carrot-cake', locale)!;
    const steps = createSourceCookSteps(content, locale);
    assert.equal(content.evidence?.status, 'tested');
    assert.equal(steps.length, 7);
    assert.deepEqual(steps[0].stepIds, ['prepare-pan']);
    assert.deepEqual(
      steps[2].ingredients.map((ingredient) => ingredient.id),
      ['carrots', 'oil'],
    );
    assert.deepEqual(
      steps[3].ingredients.map((ingredient) => ingredient.id),
      ['eggs', 'sugar'],
    );
    assert.deepEqual(steps[6].timerOptionsSeconds, [2100, 2400]);
    assert.equal(steps[6].media?.length, 2);
    assert(steps.every((step) => !step.checkpoint));
  }
});

void test('crepes Cook Mode preserves Ukrainian step copy and media from the recipe source', () => {
  const content = getRecipeContent('crepes', 'uk');
  assert.ok(content);

  const steps = createSourceCookSteps(content, 'uk');
  assert.equal(steps.length, 4);
  assert.equal(steps[0].title, 'Збийте густу основу');
  assert.equal(content.evidence?.status, 'tested');
  assert.equal(steps[0].media?.length, 1);
  assert.equal(steps[0].media?.[0].id, 'batter-smooth-base');
  assert.deepEqual(steps[1].stepIds, ['add-milk']);
  assert.match(steps[1].instructions[0], /15–20/);
  assert.deepEqual(steps[1].timerOptionsSeconds, [900, 1200]);
  assert.equal(steps[3].media?.length, 3);
  assert.equal(steps[3].media?.[0].title, 'Перед перевертанням');
});

void test('crepes Cook Mode resolves Spanish content through the same adapter', () => {
  const content = getRecipeContent('crepes', 'es');
  assert.ok(content);

  const steps = createSourceCookSteps(content, 'es');
  assert.equal(steps[0].title, 'Bate una base espesa');
  assert.equal(steps[0].media?.[0].id, 'batter-smooth-base');
  assert.equal(steps[3].media?.[2].title, 'Después de darle la vuelta');
});

void test('lazy dumplings Cook Mode uses one cooking step and step ingredients', () => {
  const content = getRecipeContent('lazy-dumplings', 'uk');
  assert.ok(content);

  const steps = createSourceCookSteps(content, 'uk');
  assert.equal(steps.length, 6);
  assert.equal(content.evidence?.status, 'tested');
  assert.deepEqual(steps[2].timerOptionsSeconds, [900, 1800]);
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
    [],
  );
  assert.deepEqual(steps[5].timerOptionsSeconds, [60, 120]);
});

void test('tested cottage-cheese waffles keep five concise steps, ingredients and timers', () => {
  const content = getRecipeContent('cottage-cheese-waffles', 'uk');
  assert.ok(content);

  const steps = createSourceCookSteps(content, 'uk');
  assert.equal(steps.length, 5);
  assert.equal(content.evidence?.status, 'tested');
  assert.equal(steps[0].title, 'Збийте основу');
  assert.deepEqual(
    steps[0].ingredients.map((ingredient) => ingredient.id),
    ['cottage-cheese', 'eggs', 'yogurt'],
  );
  assert.deepEqual(
    steps[1].ingredients.map((ingredient) => ingredient.id),
    ['oil', 'sugar', 'salt', 'vanilla'],
  );
  assert.deepEqual(steps[2].stepIds, ['mix-dry']);
  assert.deepEqual(
    steps[2].ingredients.map((ingredient) => ingredient.id),
    ['flour', 'corn-starch', 'baking-powder'],
  );
  assert.equal(steps[0].media?.length, 2);
  assert.equal(steps[2].media?.length, 2);
  assert.equal(steps[4].media?.length, 3);
  assert.deepEqual(
    steps.flatMap((step) => step.media?.map((item) => item.id) ?? []),
    [
      'ingredients-before-blending',
      'blended-base',
      'add-dry-ingredients',
      'mixed-batter',
      'fill-waffle-maker',
      'baked-waffles',
      'served-waffles',
    ],
  );
  assert(
    steps
      .flatMap((step) => step.media ?? [])
      .every((item) => !item.src.endsWith('.png')),
  );
  assert(steps.every((step) => !step.checkpoint));
  assert.deepEqual(steps[3].timerOptionsSeconds, [420, 600]);
  assert.deepEqual(steps[4].timerOptionsSeconds, [300, 420]);
});

void test('fruit sponge roll Cook Mode keeps Ukrainian guidance and step ingredients', () => {
  const content = getRecipeContent('fruit-sponge-roll', 'uk');
  assert.ok(content);

  const steps = createSourceCookSteps(content, 'uk');
  assert.equal(steps.length, 4);
  assert.deepEqual(
    steps[0].ingredients.map((ingredient) => ingredient.id),
    ['eggs', 'sugar-sponge', 'salt'],
  );
  assert.match(steps[0].checkpoint ?? '', /широкою стрічкою/i);
  assert.deepEqual(
    steps[1].ingredients.map((ingredient) => ingredient.id),
    ['oil', 'water', 'flour'],
  );
  assert.deepEqual(
    steps[3].ingredients.map((ingredient) => ingredient.id),
    ['jam', 'fresh-fruit', 'nuts'],
  );
  assert.deepEqual(steps[2].timerOptionsSeconds, [900, 1200]);
  assert.equal(steps[0].media?.[0]?.id, 'fruit-roll-egg-foam-v1');
  assert.equal(steps[2].media?.length, 2);
});

void test('sponge cake Cook Mode separates sugar for whites and yolks', () => {
  const content = getRecipeContent('sponge-cake', 'uk');
  assert.ok(content);

  const steps = createSourceCookSteps(content, 'uk');
  assert.equal(steps.length, 4);
  assert.deepEqual(
    steps[0].ingredients.map((ingredient) => ingredient.id),
    ['eggs', 'sugar-whites'],
  );
  assert.deepEqual(
    steps[1].ingredients.map((ingredient) => ingredient.id),
    ['sugar-yolks'],
  );
  assert.deepEqual(
    steps[2].ingredients.map((ingredient) => ingredient.id),
    ['corn-starch', 'tapioca', 'flour'],
  );
  assert.equal(steps[0].media?.[0]?.id, 'sponge-whipped-whites-v1');
  assert.equal(steps[3].media?.[0]?.id, 'sponge-batter-form-v1');
  assert.deepEqual(steps[3].timerOptionsSeconds, [2400, 3000]);
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

void test('presents the clarified prune-cake record with both baking timers', () => {
  const content = getRecipeContent('prune-cake', 'uk');
  assert.ok(content);
  assert.equal(isSourceCookModeAvailable(content), true);
  const steps = createSourceCookSteps(content, 'uk');
  assert.equal(steps.length, 10);
  assert.deepEqual(
    steps.find((step) => step.stepIds.includes('bake-covered'))
      ?.timerOptionsSeconds,
    [1800],
  );
  assert.deepEqual(
    steps.find((step) => step.stepIds.includes('bake-uncovered'))
      ?.timerOptionsSeconds,
    [1800],
  );
});
