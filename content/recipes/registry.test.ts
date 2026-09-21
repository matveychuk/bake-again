import assert from 'node:assert/strict';
import { easterBreadRecipe } from './easter-bread.recipe.ts';
import test from 'node:test';
import { recipeInventory } from './inventory.ts';
import { getRecipeContent } from './registry.ts';

void test('reviewed banana bread retains its formula and five concise steps in every locale', () => {
  for (const locale of ['uk', 'en', 'es'] as const) {
    const recipe = getRecipeContent('banana-bread', locale)!;
    assert.equal(recipe.presentation, 'concise');
    assert.equal(recipe.completeness, 'readyToReview');
    assert.equal(recipe.evidence?.status, 'tested');
    assert.equal(recipe.overview.timing.activeMinutes, 30);
    assert.equal(recipe.overview.timing.totalElapsedMinutes, 90);
    assert.equal(recipe.geometry?.shape, 'rectangular');
    assert.equal(recipe.geometry?.widthCm, null);
    assert.equal(recipe.geometry?.lengthCm, null);
    assert.equal(recipe.yield?.count.kind, 'exact');
    assert.equal(recipe.steps.length, 5);
    assert(!recipe.steps.some((step) => step.id === 'prepare-tin'));
    assert(recipe.steps.every((step) => !step.checkpoint && !step.meta));
    assert(
      recipe.steps
        .flatMap((step) => step.media ?? [])
        .every((item) => !item.caption && !item.title),
    );
    assert.equal(recipe.gapNote, undefined);
    assert.equal(recipe.beforeStart, undefined);
    const ingredients = recipe.ingredientSections[0].ingredients;
    for (const [id, value] of [
      ['bananas', 3],
      ['butter', 113],
      ['sugar', 150],
      ['eggs', 2],
      ['flour', 180],
      ['baking-powder', 5],
      ['salt', 3],
      ['vanilla', 0.5],
      ['walnuts', 100],
      ['raisins', 150],
    ] as const) {
      const amount = ingredients.find((item) => item.id === id)?.quantity.base;
      assert(amount?.kind === 'exact');
      assert.equal(amount.value, value);
    }
  }
});

void test('normalizes every recipe into the shared overview model', () => {
  for (const locale of ['en', 'es', 'uk'] as const) {
    for (const inventoryRecipe of recipeInventory) {
      const recipe = getRecipeContent(inventoryRecipe.id, locale);
      assert(recipe, `${inventoryRecipe.id}: missing ${locale} recipe content`);
      assert.equal(typeof recipe.overview.flour, 'string');
      assert(recipe.overview.flour.length > 0);
      assert(
        recipe.overview.difficulty === null ||
          ['easy', 'medium', 'advanced'].includes(recipe.overview.difficulty),
      );
      assert.equal(recipe.overview.yieldLabel, recipe.yield?.label ?? null);
      assert.equal(
        recipe.overview.timing.activeMinutes,
        recipe.timing?.activeMinutes ?? null,
      );
      assert.equal(
        recipe.overview.timing.totalElapsedMinutes,
        recipe.timing?.totalElapsedMinutes ?? null,
      );
      assert(!recipe.overview.timing.planningNote?.includes('{duration}'));
    }
  }
});

void test('shows localized planning guidance without inventing a total time', () => {
  for (const locale of ['en', 'es', 'uk'] as const) {
    const cookies = getRecipeContent('crinkle-cookies', locale);
    assert.match(cookies?.overview.timing.planningNote ?? '', /3–4/);
    assert.equal(cookies?.overview.timing.totalElapsedMinutes, null);
    assert.match(
      getRecipeContent('crepes', locale)?.overview.timing.planningNote ?? '',
      /15–20/,
    );
  }
  assert.match(
    getRecipeContent('crinkle-cookies', 'uk')?.overview.timing.planningNote ??
      '',
    /на кожне деко/,
  );
  assert.equal(
    getRecipeContent('gluten-free-napoleon', 'uk')?.overview.yieldLabel,
    '2 торти',
  );
  for (const locale of ['en', 'es', 'uk'] as const) {
    assert.equal(
      getRecipeContent('gluten-free-napoleon', locale)?.overview.timing
        .totalElapsedMinutes,
      null,
    );
  }
  assert.equal(
    getRecipeContent('gluten-free-napoleon', 'uk')?.evidence?.explanation,
    'Готували багато разів.',
  );
});

void test('selects the requested locale for a detailed recipe', () => {
  const recipe = getRecipeContent('gluten-free-napoleon', 'uk');
  const ingredients = recipe?.ingredientSections.flatMap(
    (section) => section.ingredients,
  );
  const amount = (id: string) =>
    ingredients?.find((ingredient) => ingredient.id === id)?.quantity.base;

  assert.equal(recipe?.ingredientSections[0]?.title, 'Коржі');
  assert.match(recipe?.beforeStart?.[0] ?? '', /[А-Яа-яІіЇїЄє]/);
  assert.equal(recipe?.beforeStart?.length, 2);
  assert.match(recipe?.beforeStart?.[0] ?? '', /пергаменту.*12 коржів/i);
  assert.equal(recipe?.evidence?.status, 'tested');
  assert.equal(recipe?.steps.length, 19);
  assert.equal(recipe?.steps[0]?.title, 'Змішайте сухі інгредієнти');
  assert.equal(recipe?.steps[0]?.meta, '5–10 с');
  assert.equal(recipe?.steps.at(-1)?.title, 'Охолодіть до наступного дня');
  assert.deepEqual(amount('schar-mix-b'), {
    kind: 'exact',
    value: 450,
    unit: 'g',
  });
  assert.deepEqual(amount('eggs-custard'), {
    kind: 'exact',
    value: 4,
    unit: 'piece',
  });
  assert.equal(amount('egg-whites-custard'), undefined);
  assert.deepEqual(amount('sugar-custard'), {
    kind: 'exact',
    value: 400,
    unit: 'g',
  });
  assert.deepEqual(amount('corn-starch-custard'), {
    kind: 'exact',
    value: 170,
    unit: 'g',
  });
  const custardCornStarch = ingredients?.find(
    (ingredient) => ingredient.id === 'corn-starch-custard',
  );
  const cornStarchEquivalent = custardCornStarch?.quantity.equivalent;
  assert.equal(cornStarchEquivalent?.kind, 'exact');
  assert.equal(cornStarchEquivalent?.unit, 'tbsp');
  assert(cornStarchEquivalent?.kind === 'exact');
  assert.equal(Math.round(cornStarchEquivalent.value * 10) / 10, 24.3);
  assert.deepEqual(amount('butter-custard'), {
    kind: 'exact',
    value: 100,
    unit: 'g',
  });
  assert.deepEqual(amount('vanilla-sugar-custard'), {
    kind: 'exact',
    value: 24,
    unit: 'g',
  });
  assert.deepEqual(amount('walnuts'), {
    kind: 'exact',
    value: 150,
    unit: 'g',
  });
  assert.deepEqual(amount('flaked-almonds'), {
    kind: 'exact',
    value: 50,
    unit: 'g',
  });
  assert.equal(recipe?.gapNote, undefined);
  assert.deepEqual(
    recipe?.steps
      .find((step) => step.id === 'cut-in-butter')
      ?.media?.map((item) => item.id),
    [
      'napoleon-butter-ready-v1',
      'napoleon-butter-early-pulse-v1',
      'napoleon-butter-crumb-v1',
    ],
  );
  assert.equal(
    recipe?.steps.find((step) => step.id === 'assemble-cake')?.media?.[0]?.id,
    'napoleon-round-six-layer-assembly-v3',
  );
  assert(
    recipe?.steps
      .flatMap((step) => step.media ?? [])
      .every((item) => !item.title && !item.caption),
  );
});

void test('keeps the reviewed fruit sponge roll concise in every locale', () => {
  for (const locale of ['uk', 'en', 'es'] as const) {
    const recipe = getRecipeContent('fruit-sponge-roll', locale)!;
    const ingredientIds = recipe.ingredientSections.flatMap((section) =>
      section.ingredients.map((ingredient) => ingredient.id),
    );

    assert.equal(recipe.presentation, 'concise');
    assert.equal(recipe.evidence?.status, 'tested');
    assert.equal(recipe.overview.difficulty, 'easy');
    assert.equal(recipe.overview.timing.activeMinutes, 30);
    assert.equal(recipe.overview.timing.totalElapsedMinutes, null);
    assert.deepEqual(recipe.yield?.count, { kind: 'exact', value: 1 });
    assert.equal(recipe.steps.length, 4);
    assert.deepEqual(recipe.creamOptions, {
      recipeIds: ['mascarpone-whipped-cream', 'vanilla-buttercream'],
      recommendedRecipeId: 'mascarpone-whipped-cream',
    });
    assert.equal(recipe.steps[0]?.media?.[0]?.id, 'fruit-roll-egg-foam-v1');
    assert.equal(recipe.steps[2]?.media?.length, 2);
    assert(recipe.steps.every((step) => !step.tip));
    assert(
      recipe.steps
        .flatMap((step) => step.media ?? [])
        .every((item) => !item.title && !item.caption),
    );
    assert.equal(recipe.gapNote, undefined);
    assert.equal(new Set(ingredientIds).size, ingredientIds.length);
  }
});

void test('keeps the sponge cake quantities and four concise Ukrainian steps together', () => {
  const recipe = getRecipeContent('sponge-cake', 'uk');
  const ingredients = recipe?.ingredientSections[0]?.ingredients ?? [];
  const whitesSugar = ingredients.find(
    (ingredient) => ingredient.id === 'sugar-whites',
  );
  const yolksSugar = ingredients.find(
    (ingredient) => ingredient.id === 'sugar-yolks',
  );

  assert.equal(recipe?.evidence?.status, 'tested');
  assert.equal(recipe?.steps.length, 4);
  assert.deepEqual(whitesSugar?.quantity.base, {
    kind: 'exact',
    value: 120,
    unit: 'g',
  });
  assert.deepEqual(yolksSugar?.quantity.base, {
    kind: 'exact',
    value: 40,
    unit: 'g',
  });
  assert.deepEqual(yolksSugar?.quantity.equivalent, {
    kind: 'exact',
    value: 2,
    unit: 'tbsp',
  });
  assert.match(recipe?.steps[0]?.body ?? '', /густої білої піни/i);
  assert.match(recipe?.steps[0]?.body ?? '', /лише дно/);
  assert.match(recipe?.steps[1]?.body ?? '', /світлої густої маси/i);
  assert.equal(recipe?.steps[0]?.media?.[0]?.id, 'sponge-whipped-whites-v1');
  assert.equal(recipe?.steps[1]?.media?.[0]?.id, 'sponge-whipped-yolks-v1');
  assert.equal(recipe?.steps[2]?.media?.[0]?.id, 'sponge-fold-yolks-v1');
  assert.equal(recipe?.steps[2]?.media?.[1]?.id, 'sponge-fold-dry-v1');
  assert.equal(recipe?.steps[3]?.media?.[0]?.id, 'sponge-batter-form-v1');
  for (const locale of ['uk', 'en', 'es'] as const) {
    const localized = getRecipeContent('sponge-cake', locale)!;
    assert.equal(localized.presentation, 'concise');
    assert.equal(localized.overview.timing.activeMinutes, 15);
    assert.equal(localized.overview.timing.totalElapsedMinutes, 60);
    assert.equal(localized.overview.difficulty, 'easy');
    assert.deepEqual(localized.yield?.count, { kind: 'exact', value: 1 });
    assert.equal(localized.beforeStart, undefined);
    assert.equal(localized.gapNote, undefined);
    assert(
      localized.steps.every(
        (step) => !step.meta && !step.tip && !step.checkpoint,
      ),
    );
    assert(
      localized.steps
        .flatMap((step) => step.media ?? [])
        .every((item) => !item.caption && !item.title),
    );
  }
});

void test('keeps the tested Mix B banana-pancake adaptation and step photos together', () => {
  const recipe = getRecipeContent('banana-fritters', 'uk');
  const ingredients = recipe?.ingredientSections[0]?.ingredients ?? [];
  const flour = ingredients.find((ingredient) => ingredient.id === 'flour');

  assert.equal(recipe?.evidence?.status, 'tested');
  assert.equal(recipe?.yield?.label, '12 панкейків');
  assert.equal(recipe?.timing?.totalElapsedMinutes, 30);
  assert.equal(recipe?.steps.length, 6);
  assert.equal(flour?.quantity.base, null);
  assert.deepEqual(flour?.quantity.equivalent, {
    kind: 'exact',
    value: 1.5,
    unit: 'cup',
  });
  assert.match(recipe?.steps[3]?.checkpoint ?? '', /густе й неоднорідне/i);
  assert.match(recipe?.steps[5]?.checkpoint ?? '', /великі бульбашки/i);
  assert.deepEqual(
    recipe?.steps.flatMap((step) => step.media?.map((item) => item.id) ?? []),
    [
      'banana-pancakes-dry-mix-v1',
      'banana-pancakes-mashed-bananas-v1',
      'banana-pancakes-wet-mixture-v1',
      'banana-pancakes-lumpy-batter-v1',
      'banana-pancakes-flip-cue-v1',
    ],
  );
});

void test('keeps the tested apple-fritter quantities and Ukrainian cooking cues together', () => {
  const recipe = getRecipeContent('apple-fritters', 'uk');
  const ingredients = recipe?.ingredientSections[0]?.ingredients ?? [];
  const flour = ingredients.find((ingredient) => ingredient.id === 'flour');
  const batter = recipe?.steps.find((step) => step.id === 'finish-batter');
  const frying = recipe?.steps.find((step) => step.id === 'fry');

  assert.equal(recipe?.evidence?.status, 'tested');
  assert.equal(recipe?.completeness, 'readyToReview');
  assert.equal(recipe?.steps.length, 7);
  assert.deepEqual(flour?.quantity.base, {
    kind: 'exact',
    value: 140,
    unit: 'g',
  });
  assert.match(batter?.checkpoint ?? '', /повільно сповзає/i);
  assert.match(frying?.checkpoint ?? '', /золотистий/i);
  assert.match(frying?.tip ?? '', /зменште вогонь/i);
  assert.equal(
    frying?.meta,
    'По 2–3 хв з кожного боку · середній вогонь · під кришкою',
  );
});

void test('keeps the apple-banana substitution separate and explicitly suggested', () => {
  const recipe = getRecipeContent('apple-banana-fritters', 'uk');
  const ingredients = recipe?.ingredientSections[0]?.ingredients ?? [];
  const banana = ingredients.find((ingredient) => ingredient.id === 'banana');
  const sweetener = ingredients.find(
    (ingredient) => ingredient.id === 'sweetener',
  );
  const batter = recipe?.steps.find((step) => step.id === 'finish-batter');

  assert.equal(recipe?.evidence?.status, 'suggested');
  assert.match(recipe?.evidence?.explanation ?? '', /ще не перевіряли/i);
  assert.equal(recipe?.steps.length, 7);
  assert.deepEqual(banana?.quantity.base, {
    kind: 'exact',
    value: 1,
    unit: 'piece',
  });
  assert.equal(sweetener, undefined);
  assert.match(batter?.tip ?? '', /вологість банана/i);
  assert.match(recipe?.gapNote ?? '', /перевірте заміну цукру бананом/i);
});

void test('keeps the tested profiterole quantities, yield and Ukrainian guidance together', () => {
  const recipe = getRecipeContent('eclairs', 'uk');
  const ingredients =
    recipe?.ingredientSections.flatMap((section) => section.ingredients) ?? [];
  const flour = ingredients.find((ingredient) => ingredient.id === 'flour');
  const eggs = ingredients.find((ingredient) => ingredient.id === 'eggs');

  assert.equal(recipe?.evidence?.status, 'tested');
  assert.match(recipe?.evidence?.explanation ?? '', /20 профітролів/i);
  assert.equal(
    recipe?.yield?.label,
    'Близько 20 профітролів розміром із волоський горіх',
  );
  assert.equal(recipe?.overview.timing.totalElapsedMinutes, null);
  assert.equal(recipe?.overview.difficulty, 'medium');
  assert.equal(recipe?.presentation, 'concise');
  assert.deepEqual(flour?.quantity.base, {
    kind: 'exact',
    value: 110,
    unit: 'g',
  });
  assert.match(flour?.name ?? '', /Schär Mix B Bread/);
  assert.deepEqual(eggs?.quantity.base, {
    kind: 'exact',
    value: 4,
    unit: 'piece',
  });
  assert.equal(recipe?.steps.length, 8);
  assert.match(recipe?.steps[3]?.checkpoint ?? '', /важкою стрічкою/i);
  assert.equal(recipe?.steps[2]?.media?.[0]?.id, 'eclairs-cooked-panade-v1');
  assert.equal(recipe?.steps[3]?.media?.[0]?.id, 'eclairs-heavy-ribbon-v2');
  assert.equal(
    recipe?.steps[4]?.media?.[0]?.id,
    'eclairs-piped-profiteroles-v2',
  );
  assert.equal(
    recipe?.steps[6]?.media?.[0]?.id,
    'eclairs-dry-hollow-shells-v2',
  );
  assert.equal(recipe?.steps[5]?.meta, '200°C · 10 хв, потім 180°C · 15 хв');
  assert.equal(recipe?.gapNote, undefined);
});

void test('stores four tested reusable creams with ingredients and practical guidance', () => {
  const expected = {
    'mascarpone-whipped-cream': {
      ingredientCount: 3,
      stepCount: 2,
      activeMinutes: 10,
      totalMinutes: 10,
      difficulty: 'easy',
      yieldPattern: /580 г/,
    },
    'vanilla-egg-custard': {
      ingredientCount: 7,
      stepCount: 5,
      activeMinutes: 25,
      totalMinutes: 150,
      difficulty: 'medium',
      yieldPattern: /900 г/,
    },
    'eggless-vanilla-custard': {
      ingredientCount: 5,
      stepCount: 4,
      activeMinutes: 25,
      totalMinutes: 150,
      difficulty: 'medium',
      yieldPattern: /1,8 кг/,
    },
    'vanilla-buttercream': {
      ingredientCount: 5,
      stepCount: 4,
      activeMinutes: 25,
      totalMinutes: 75,
      difficulty: 'medium',
      yieldPattern: /450 г/,
    },
  } as const;

  for (const [id, counts] of Object.entries(expected)) {
    const recipe = getRecipeContent(id, 'uk');
    const ingredients =
      recipe?.ingredientSections.flatMap((section) => section.ingredients) ??
      [];

    assert(recipe, `${id}: missing reusable cream`);
    assert.equal(recipe.evidence?.status, 'tested');
    assert.equal(ingredients.length, counts.ingredientCount);
    assert.equal(recipe.steps.length, counts.stepCount);
    assert.equal(recipe.presentation, 'concise');
    assert.equal(recipe.overview.timing.activeMinutes, counts.activeMinutes);
    assert.equal(
      recipe.overview.timing.totalElapsedMinutes,
      counts.totalMinutes,
    );
    assert.equal(recipe.overview.difficulty, counts.difficulty);
    assert.match(recipe.overview.yieldLabel ?? '', counts.yieldPattern);
  }

  const mascarpone = getRecipeContent('mascarpone-whipped-cream', 'uk')!;
  assert.deepEqual(
    mascarpone.ingredientSections[0].ingredients.find(
      (ingredient) => ingredient.id === 'mascarpone',
    )?.quantity.base,
    { kind: 'exact', value: 250, unit: 'g' },
  );

  const eggless = getRecipeContent('eggless-vanilla-custard', 'uk')!;
  assert.deepEqual(
    eggless.ingredientSections[0].ingredients.find(
      (ingredient) => ingredient.id === 'milk',
    )?.quantity.base,
    { kind: 'exact', value: 1500, unit: 'ml' },
  );
  assert.deepEqual(
    eggless.ingredientSections[0].ingredients.find(
      (ingredient) => ingredient.id === 'flour',
    )?.quantity.equivalent,
    { kind: 'exact', value: 6, unit: 'tbsp' },
  );

  const buttercream = getRecipeContent('vanilla-buttercream', 'uk')!;
  assert.equal(buttercream.steps[0]?.id, 'cook-base');
  assert.match(
    buttercream.beforeStart?.[0] ?? '',
    /однакової кімнатної температури/i,
  );

  assert.equal(
    mascarpone.steps.at(-1)?.media?.[0]?.id,
    'mascarpone-cream-final-v1',
  );
  assert.equal(
    getRecipeContent('vanilla-egg-custard', 'uk')?.steps.at(-1)?.media?.[0]?.id,
    'vanilla-egg-custard-final-v1',
  );
  assert.equal(
    eggless.steps.at(-1)?.media?.[0]?.id,
    'eggless-vanilla-custard-final-v1',
  );
  assert.equal(
    buttercream.steps.at(-1)?.media?.[0]?.id,
    'vanilla-buttercream-final-v1',
  );
});

void test('keeps cream compatibility and recommendation on the host recipe', () => {
  const expectedCreamIds = [
    'mascarpone-whipped-cream',
    'vanilla-egg-custard',
    'eggless-vanilla-custard',
    'vanilla-buttercream',
  ];

  for (const locale of ['en', 'es', 'uk'] as const) {
    const eclairs = getRecipeContent('eclairs', locale);
    assert.deepEqual(eclairs?.creamOptions?.recipeIds, expectedCreamIds);
    assert.equal(
      eclairs?.creamOptions?.recommendedRecipeId,
      'vanilla-egg-custard',
    );
  }

  for (const creamId of expectedCreamIds) {
    assert.equal(getRecipeContent(creamId, 'uk')?.creamOptions, undefined);
  }
});

void test('keeps the source-backed cinnamon rolls cookable in Ukrainian', () => {
  const recipe = getRecipeContent('cinnamon-rolls', 'uk');
  const ingredients =
    recipe?.ingredientSections.flatMap((section) => section.ingredients) ?? [];
  const xanthan = ingredients.find((ingredient) => ingredient.id === 'xanthan');

  assert.equal(recipe?.completeness, 'readyToReview');
  assert.equal(recipe?.evidence?.status, 'tested');
  assert.equal(recipe?.steps.length, 9);
  assert.deepEqual(xanthan?.quantity.base, {
    kind: 'exact',
    value: 12,
    unit: 'g',
  });
  assert.equal(recipe?.steps[0]?.title, 'Активуйте дріжджі');
  assert.match(recipe?.steps[0]?.checkpoint ?? '', /бульбашки|піна/i);
  assert.equal(recipe?.steps[6]?.meta, '40–60 хв · 180°C');
  assert.match(recipe?.steps[7]?.tip ?? '', /перепечені/i);
  assert.equal(recipe?.steps[8]?.title, 'Додайте обраний фініш');
  assert.deepEqual(
    recipe?.steps.flatMap((step) => step.media?.map((item) => item.id) ?? []),
    [
      'cinnamon-rolls-activated-yeast-v1',
      'cinnamon-rolls-mixed-dough-v1',
      'cinnamon-rolls-first-proof-v1',
      'cinnamon-rolls-rolled-rectangle-v1',
      'cinnamon-rolls-cinnamon-filling-v1',
      'cinnamon-rolls-cut-rolls-v1',
      'cinnamon-rolls-second-proof-v1',
      'cinnamon-rolls-lightly-golden-v1',
      'cinnamon-rolls-cream-cheese-glaze-v1',
    ],
  );
  assert.match(recipe?.gapNote ?? '', /начинку й фініш/i);
});

void test('keeps the published prune cake structured', () => {
  const recipe = getRecipeContent('prune-cake', 'uk');
  const ingredients = recipe?.ingredientSections.flatMap(
    (section) => section.ingredients,
  );
  const amount = (id: string) =>
    ingredients?.find((ingredient) => ingredient.id === id)?.quantity.base;

  assert.equal(recipe?.completeness, 'readyToReview');
  assert.equal(recipe?.presentation, 'concise');
  assert.equal(recipe?.ingredientSections.length, 3);
  assert.equal(recipe?.steps.length, 10);
  assert.equal(recipe?.steps[0]?.title, 'Збийте яйця з цукром');
  assert.equal(
    recipe?.steps.find((step) => step.id === 'make-cream')?.media?.[0]?.id,
    'prune-cake-prune-cream-v2',
  );
  assert.equal(
    recipe?.steps.find((step) => step.id === 'glaze-and-decorate')?.media?.[0]
      ?.id,
    'prune-cake-finished-v2',
  );
  assert.equal(
    recipe?.steps.find((step) => step.id === 'bake-covered')?.meta,
    '200°C · 30 хв',
  );
  assert.equal(
    recipe?.steps.find((step) => step.id === 'bake-uncovered')?.meta,
    '200°C · 30 хв',
  );
  assert.match(
    recipe?.steps.find((step) => step.id === 'glaze-and-decorate')?.body ?? '',
    /не доводячи до кипіння.*Гарячою поливкою/i,
  );
  assert.deepEqual(amount('greek-yogurt'), {
    kind: 'exact',
    value: 250,
    unit: 'g',
  });
  assert.deepEqual(amount('sugar'), { kind: 'exact', value: 200, unit: 'g' });
  assert.deepEqual(amount('cocoa'), { kind: 'exact', value: 25, unit: 'g' });
  assert.deepEqual(amount('flour'), { kind: 'exact', value: 100, unit: 'g' });
  assert.deepEqual(amount('cream-base'), {
    kind: 'exact',
    value: 400,
    unit: 'g',
  });
  assert.deepEqual(amount('prunes'), {
    kind: 'exact',
    value: 150,
    unit: 'g',
  });
  assert.deepEqual(amount('butter'), { kind: 'exact', value: 50, unit: 'g' });
  assert.equal(amount('cream-sugar'), null);
  assert.equal(recipe?.overview.timing.activeMinutes, 60);
  assert.equal(recipe?.overview.timing.totalElapsedMinutes, null);
  assert.equal(recipe?.overview.difficulty, 'medium');
  assert.equal(recipe?.overview.yieldLabel, '1 торт');
  assert.equal(recipe?.geometry?.diameterCm, 26);
  assert.equal(recipe?.beforeStart, undefined);
  assert.equal(recipe?.gapNote, undefined);
  assert.match(
    recipe?.steps.find((step) => step.id === 'bake-covered')?.meta ?? '',
    /200°C.*30 хв/,
  );
  assert.match(
    recipe?.steps.find((step) => step.id === 'bake-uncovered')?.meta ?? '',
    /200°C.*30 хв/,
  );
  assert.equal(recipe?.evidence, undefined);
  assert(
    !recipe?.steps.some((step) => /Confirm|Mix sour cream/.test(step.body)),
  );
});

void test('keeps crinkle-cookie quantities, guidance and step media together', () => {
  const recipe = getRecipeContent('crinkle-cookies', 'uk');
  const ingredients = recipe?.ingredientSections[0]?.ingredients ?? [];
  const powderedSugar = ingredients.find(
    (ingredient) => ingredient.id === 'powdered-sugar',
  );
  const shaping = recipe?.steps.find((step) => step.id === 'shape-and-coat');
  const baking = recipe?.steps.find((step) => step.id === 'bake-cookies');

  assert.deepEqual(powderedSugar?.quantity.base, {
    kind: 'exact',
    value: 100,
    unit: 'g',
  });
  assert.equal(shaping?.title, 'Сформуйте й обкачайте кульки');
  assert.match(shaping?.body ?? '', /набирайте холодне тісто ложкою/i);
  assert.match(shaping?.tip ?? '', /не катайте його довго/i);
  assert.equal(shaping?.media?.length, 2);
  assert.match(baking?.body ?? '', /вологими/i);
  assert.equal(baking?.media?.[0]?.id, 'crinkle-moist-cracks-v1');
  assert.equal(recipe?.presentation, 'concise');
  assert.equal(recipe?.evidence?.status, 'tested');
  assert.equal(recipe?.overview.timing.activeMinutes, 30);
  assert.equal(recipe?.steps.length, 7);
  assert.equal(recipe?.beforeStart, undefined);
  assert(recipe?.steps.every((step) => !step.checkpoint && !step.meta));
  assert(
    recipe?.steps
      .flatMap((step) => step.media ?? [])
      .every((item) => !item.title && !item.caption),
  );
  for (const locale of ['uk', 'en', 'es'] as const) {
    const localized = getRecipeContent('crinkle-cookies', locale)!;
    assert.doesNotMatch(
      JSON.stringify(localized),
      /цедр|апельсин|orange|zest|ralladura|naranja/i,
    );
    assert.equal(localized.ingredientSections[0].ingredients.length, 7);
  }
});

void test('uses reviewed source-draft translations without leaking English instructions', () => {
  const sourceDraft = getRecipeContent('apple-charlotte', 'es');
  assert.equal(sourceDraft?.ingredientSections[0]?.title, 'Carlota de manzana');
  assert.equal(
    sourceDraft?.steps[0]?.title,
    'Prepara la mantequilla y las manzanas',
  );
  assert(!sourceDraft?.steps.some((step) => step.body.includes('Finely chop')));
});

void test('keeps the apple and plum sponge adaptations distinct and honest', () => {
  const apple = getRecipeContent('apple-charlotte', 'uk');
  const plum = getRecipeContent('plum-cake', 'uk');
  const appleIngredients = apple?.ingredientSections[0]?.ingredients ?? [];
  const plumIngredients = plum?.ingredientSections[0]?.ingredients ?? [];

  assert.equal(apple?.evidence?.status, 'tested');
  assert.equal(apple?.presentation, 'concise');
  assert.equal(apple?.overview.timing.activeMinutes, 20);
  assert.equal(apple?.overview.timing.totalElapsedMinutes, 50);
  assert.equal(apple?.overview.difficulty, 'easy');
  assert.deepEqual(
    appleIngredients.find((ingredient) => ingredient.id === 'butter')?.quantity
      .base,
    { kind: 'exact', value: 50, unit: 'g' },
  );
  assert.deepEqual(
    appleIngredients.find((ingredient) => ingredient.id === 'eggs')?.quantity
      .base,
    { kind: 'exact', value: 5, unit: 'piece' },
  );
  assert.match(
    apple?.steps.find((step) => step.id === 'fold-batter')?.body ?? '',
    /вмішайте яблука/i,
  );
  assert.equal(
    apple?.steps.find((step) => step.id === 'fold-batter')?.media?.[0]?.id,
    'folded-apple-batter-v1',
  );

  assert.equal(plum?.evidence?.status, 'tested');
  assert.equal(plum?.presentation, 'concise');
  assert.equal(plum?.overview.timing.activeMinutes, 20);
  assert.equal(plum?.overview.timing.totalElapsedMinutes, 50);
  assert.equal(plum?.overview.difficulty, 'medium');
  assert(!plumIngredients.some((ingredient) => ingredient.id === 'butter'));
  assert.deepEqual(
    plumIngredients.find((ingredient) => ingredient.id === 'eggs')?.quantity
      .base,
    { kind: 'exact', value: 5, unit: 'piece' },
  );
  assert.match(plum?.steps[0]?.body ?? '', /зрізом донизу/i);
  assert.match(plum?.steps.at(-1)?.body ?? '', /переверніть/i);
  assert.equal(plum?.steps[0]?.media?.[0]?.id, 'plums-cut-side-down-v1');
});

void test('keeps localized crepe step media and practical guidance together', () => {
  const recipe = getRecipeContent('crepes', 'uk');
  const firstStep = recipe?.steps[0];
  const restStep = recipe?.steps.find((step) => step.id === 'add-milk');
  const cookStep = recipe?.steps.find((step) => step.id === 'cook');

  assert.equal(firstStep?.title, 'Збийте густу основу');
  assert.equal(recipe?.evidence?.status, 'tested');
  assert.match(firstStep?.tip ?? '', /легше розбити грудочки/i);
  assert.equal(firstStep?.media?.length, 1);
  assert.equal(firstStep?.media?.[0].id, 'batter-smooth-base');
  assert.match(restStep?.body ?? '', /15–20 хвилин/);
  assert.equal(cookStep?.media?.length, 3);
  assert.equal(cookStep?.media?.[0].title, 'Перед перевертанням');
  assert.equal(cookStep?.media?.[1].title, 'Відділення краю');
  assert.equal(cookStep?.media?.[2].title, 'Після перевертання');
  assert.deepEqual(
    recipe?.steps.map((step) => step.id),
    ['start-batter', 'add-milk', 'finish-batter', 'cook'],
  );
  const oil = recipe?.ingredientSections[0]?.ingredients.find(
    (item) => item.id === 'oil',
  );
  assert.deepEqual(oil?.quantity.base, {
    kind: 'exact',
    value: 25,
    unit: 'g',
  });
  assert.equal(oil?.quantity.equivalent, undefined);
  assert.equal(recipe?.yield?.label, '10 млинців');
  assert.equal(recipe?.geometry?.label, 'Кругла пательня, 28 см');
  assert.equal(recipe?.timing?.activeMinutes, 40);
  assert.equal(recipe?.timing?.totalElapsedMinutes, 60);
  assert.equal(recipe?.beforeStart, undefined);
  assert.match(recipe?.overview.timing.planningNote ?? '', /15–20/);
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
    value: 450,
    unit: 'g',
  });
  assert.equal(cottageCheese?.name, 'Творог');
  assert.equal(cottageCheese?.quantity.equivalent, undefined);
  assert.equal(cottageCheese?.note, undefined);
  assert.deepEqual(sugar?.quantity.base, {
    kind: 'exact',
    value: 60,
    unit: 'g',
  });
  assert.deepEqual(sugar?.quantity.equivalent, {
    kind: 'exact',
    value: 3,
    unit: 'tbsp',
  });
  assert.deepEqual(tapioca?.quantity.base, {
    kind: 'exact',
    value: 7,
    unit: 'g',
  });
  assert.deepEqual(tapioca?.quantity.equivalent, {
    kind: 'exact',
    value: 1,
    unit: 'tbsp',
  });
  assert.match(shaping?.tip ?? '', /в один шар/);
  assert(!ingredients.some((ingredient) => ingredient.id === 'water'));
  assert.equal(recipe?.presentation, 'concise');
  assert.equal(recipe?.evidence?.status, 'tested');
  assert.equal(recipe?.overview.difficulty, 'medium');
  assert.equal(recipe?.overview.timing.activeMinutes, 45);
  assert.equal(recipe?.overview.timing.totalElapsedMinutes, null);
  assert.equal(recipe?.overview.yieldLabel, '100 лінивих вареників');
  assert.match(recipe?.overview.timing.planningNote ?? '', /15–30/);
  assert(
    recipe?.steps.every(
      (step) =>
        !step.checkpoint &&
        step.media?.every((image) => !image.title && !image.caption) !== false,
    ),
  );
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
  assert.equal(cooking?.cookInstructions?.length, 2);
  assert.equal(cooking?.cookIngredients, undefined);
  assert.equal(inventory?.scalingAnchorIngredientId, 'cottage-cheese');
});

void test('keeps the tested one-cake carrot recipe concise without losing practical cues', () => {
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
  assert.match(whippedEggs?.body ?? '', /три-чотири рази/);
  assert.match(baking?.body ?? '', /зубочисткою/);
  assert.match(addIns?.tip ?? '', /трьох днів/);
  assert.equal(recipe?.evidence?.status, 'tested');
  assert.equal(recipe?.presentation, 'concise');
  assert.equal(recipe?.overview.timing.activeMinutes, 30);
  assert.equal(recipe?.overview.difficulty, 'medium');
  assert.equal(recipe?.overview.yieldLabel, '1 кекс');
  assert.equal(recipe?.beforeStart, undefined);
  assert.equal(
    recipe?.overview.timing.planningNote,
    'Заздалегідь замочіть родзинки.',
  );
  assert.equal(recipe?.steps[0].id, 'prepare-pan');
  assert.match(recipe?.steps[0].body ?? '', /200°C/);
  assert.equal(
    recipe?.steps.find((step) => step.id === 'mix-batter')?.tip,
    undefined,
  );
  assert(recipe?.steps.every((step) => !step.checkpoint && !step.meta));
  assert(
    recipe?.steps
      .flatMap((step) => step.media ?? [])
      .every((image) => !image.caption),
  );
});
void test('reviewed paska is concise, timed and yields three medium paskas', () => {
  for (const locale of ['en', 'uk'] as const) {
    const recipe = getRecipeContent('easter-bread', locale)!;
    assert.equal(recipe.evidence?.status, 'tested');
    assert.equal(recipe.presentation, 'concise');
    assert.equal(recipe.timing?.activeMinutes, 30);
    assert.equal(recipe.timing?.totalElapsedMinutes, 290);
    assert.deepEqual(recipe.yield?.count, { kind: 'exact', value: 3 });
    assert.equal(recipe.steps.length, 9);
    assert.equal(recipe.gapNote, undefined);
    assert.equal(recipe.beforeStart, undefined);
    assert(recipe.steps.every((step) => !step.meta && !step.tip));
    assert(
      recipe.steps
        .flatMap((step) => step.media ?? [])
        .every((media) => !media.title && !media.caption && media.alt),
    );
    for (const phase of recipe.timing?.phases ?? []) {
      assert(recipe.steps.some((step) => step.id === phase.relatedStepId));
    }
    const flour = recipe.ingredientSections
      .flatMap((section) => section.ingredients)
      .find((ingredient) => ingredient.id === 'schar-mix-b');
    assert.deepEqual(flour?.quantity.base, {
      kind: 'exact',
      value: 450,
      unit: 'g',
    });
  }
  assert.equal(easterBreadRecipe.publicationStatus, 'published');
});

void test('keeps the apple-meringue pie honest about source gaps', () => {
  const recipe = getRecipeContent('apple-meringue-pie', 'uk');
  assert(recipe);
  assert.equal(recipe.completeness, 'incompleteSource');
  assert.equal(recipe.evidence?.status, 'suggested');
  assert.equal(recipe.steps.length, 7);
  assert.deepEqual(
    recipe.timing?.phases.find((phase) => phase.id === 'bake')?.duration,
    { kind: 'exact', value: 40, unit: 'minute' },
  );
  assert.equal(recipe.overview.timing.totalElapsedMinutes, null);

  const ingredients = recipe.ingredientSections.flatMap(
    (section) => section.ingredients,
  );
  assert.equal(
    ingredients.find((ingredient) => ingredient.id === 'apples')?.quantity
      .base,
    null,
  );
  assert.equal(
    ingredients.find((ingredient) => ingredient.id === 'baking-powder')
      ?.quantity.base,
    null,
  );
  assert.match(recipe.gapNote ?? '', /кількість і сорт яблук/);
  assert(recipe.steps.every((step) => step.checkpoint));
});
