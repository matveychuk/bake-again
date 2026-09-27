import assert from 'node:assert/strict';
import test from 'node:test';
import { getRecipeContent } from './registry.ts';
import {
  applySourceRecipeConfiguration,
  parseSourceRecipeConfiguration,
} from './source-recipe-configuration.ts';
import { createSourceCookSteps } from './cook-mode-adapter.ts';
import { composeRecipeWithCream } from './cream-composition.ts';
import {
  findShoppingIngredient,
  ingredientName,
  itemNotes,
  sourceRecipes,
} from './shopping-copy.ts';
import { formatQuantity } from '../../lib/i18n/format.ts';
import type { ShoppingItemV1 } from '../../lib/persistence/shopping.ts';
import { resolveNapoleonCookConfiguration } from './napoleon-configuration.ts';
import { getUiMessages } from '../../lib/i18n/messages.ts';

for (const locale of ['uk', 'en', 'es'] as const) {
  void test(`R01: Cook Mode blocks unresolved quantities instead of choosing the base (${locale})`, () => {
    const blocked = resolveNapoleonCookConfiguration(
      'mode=ingredient&ingredient=schar-mix-b&amount=200&unit=g', locale,
    );
    assert.deepEqual(blocked, {
      kind: 'blocked', reason: getUiMessages(locale).cook.fractionalIngredients,
    });
    for (const amount of ['0', '-1', 'NaN', 'Infinity', '99']) {
      assert.equal(resolveNapoleonCookConfiguration(
        `mode=ingredient&ingredient=schar-mix-b&amount=${amount}&unit=g`, locale,
      ).kind, 'blocked');
    }
    for (const query of [
      'mode=ingredient&ingredient=eggs&amount=450&unit=g',
      'mode=ingredient&ingredient=schar-mix-b&amount=450&unit=ml',
      'mode=ingredient&ingredient=schar-mix-b&amount=450&unit=invalid',
      'geometry=round-24cm-preview&mode=scale&scale=1',
    ]) assert.equal(resolveNapoleonCookConfiguration(query, locale).kind, 'blocked');
    for (const [amount, factor] of [[225, 0.5], [450, 1], [900, 2]]) {
      const state = resolveNapoleonCookConfiguration(
        `mode=ingredient&ingredient=schar-mix-b&amount=${amount}&unit=g`, locale,
      );
      assert.equal(state.kind, 'ready');
      if (state.kind !== 'ready') throw new Error('Expected a cookable configuration');
      assert.equal(state.isAdjusted, factor !== 1);
      assert.equal(state.configuration.totalScaleFactor, factor);
      assert.deepEqual(state.configuration.ingredientAmounts.find(
        (item) => item.ingredientLineId === 'schar-mix-b',
      )?.amount, { kind: 'exact', value: amount, unit: 'g' });
    }
  });
  void test(`R02: preparation notes stay valid across scales and shopping (${locale})`, () => {
    const cake = getRecipeContent('prune-cake', locale)!;
    assert(!cake.beforeStart?.join(' ').includes('700'));
    const fritters = getRecipeContent('apple-fritters', locale)!;
    const note = fritters.ingredientSections.flatMap((s) => s.ingredients)
      .find((i) => i.id === 'sweetener')!.note!;
    assert.match(note, {
      uk: /на кожну столову ложку/, en: /per tablespoon/, es: /por cada cucharada/,
    }[locale]);
    for (const factor of [0.5, 1.5, 2]) {
      const adjusted = applySourceRecipeConfiguration(
        fritters, { kind: 'adjusted', scaleFactor: factor }, locale,
      );
      const sugar = adjusted.ingredientSections.flatMap((s) => s.ingredients)
        .find((i) => i.id === 'sweetener')!;
      assert.deepEqual(sugar.quantity.equivalent, { kind: 'exact', value: factor, unit: 'tbsp' });
      assert.equal(sugar.note, note);
      assert.equal(findShoppingIngredient('apple-fritters', 'sweetener', locale)?.note, note);
    }
  });
  void test(`D01: prose and Cook Mode match scaled butter and allocated sugar (${locale})`, () => {
    const base = getRecipeContent('plum-cake', locale)!;
    for (const factor of [0.5, 1.5, 2]) {
      const configured = applySourceRecipeConfiguration(
        base,
        parseSourceRecipeConfiguration(`mode=scale&scale=${factor}`, base),
        locale,
      );
      const butter = configured.ingredientSections[0].ingredients.find(
        (i) => i.id === 'butter',
      )!;
      const quantity = formatQuantity(locale, butter.quantity.base);
      const body = configured.steps.find((s) => s.id === 'fold-butter')!.body;
      assert(body.includes(quantity), body);
      const sugar = formatQuantity(locale, {
        kind: 'exact',
        value: 2 * factor,
        unit: 'tbsp',
      });
      assert(
        configured.steps
          .find((s) => s.id === 'whip-eggs')!
          .body.includes(sugar),
      );
      assert(
        JSON.stringify(createSourceCookSteps(configured, locale)).includes(
          body,
        ),
      );
      assert.equal(
        configured.steps.find((s) => s.id === 'bake')!.body,
        base.steps.find((s) => s.id === 'bake')!.body,
      );
      assert.deepEqual(configured.timing, base.timing);
    }
    assert.strictEqual(
      applySourceRecipeConfiguration(
        base,
        { kind: 'base', mode: 'scale', scaleFactor: 1 },
        locale,
      ),
      base,
    );
  });
  void test(`D02/D04: every allowed cream keeps localized shopping copy and honest evidence (${locale})`, () => {
    for (const hostId of ['eclairs', 'fruit-sponge-roll']) {
      const host = getRecipeContent(hostId, locale)!;
      for (const creamId of host.creamOptions!.recipeIds) {
        const cream = getRecipeContent(creamId, locale)!;
        const composed = composeRecipeWithCream(host, cream, creamId, locale);
        assert.equal(composed.evidence?.status, 'suggested');
        assert.equal(host.evidence?.status, 'tested');
        assert.equal(
          applySourceRecipeConfiguration(
            composed,
            { kind: 'adjusted', mode: 'scale', scaleFactor: 2 },
            locale,
          ).evidence?.status,
          'suggested',
        );
        for (const section of cream.ingredientSections)
          for (const ingredient of section.ingredients) {
            const id = `cream-${creamId}-${ingredient.id}`;
            const item: ShoppingItemV1 = {
              id,
              ingredientId: id,
              quantity: ingredient.quantity.base,
              checked: false,
              createdAt: new Date(0).toISOString(),
              updatedAt: new Date(0).toISOString(),
              sources: [
                {
                  recipeId: hostId,
                  recipeVersionId: `${hostId}-source-v1-cream-${creamId}`,
                  ingredientLineId: id,
                  selectedIngredientId: id,
                  sectionId: `cream-${creamId}-${section.id}`,
                },
              ],
            };
            assert.equal(
              findShoppingIngredient(hostId, id, locale)?.name,
              ingredient.name,
            );
            assert.equal(ingredientName(item, locale), ingredient.name);
            assert.deepEqual(
              itemNotes(item, locale),
              ingredient.note ? [ingredient.note] : [],
            );
          }
      }
    }
    const item = { sources: [{ recipeId: 'sour-cream' }] } as ShoppingItemV1;
    assert.notEqual(sourceRecipes(item, locale, [])[0].title, 'sour-cream');
  });
}

void test('Napoleon milk allocation and disc count scale, while base facts stay intact', () => {
  for (const locale of ['uk', 'en', 'es'] as const) {
    const base = getRecipeContent('gluten-free-napoleon', locale)!;
    const doubled = applySourceRecipeConfiguration(
      base,
      { kind: 'adjusted', mode: 'scale', scaleFactor: 2 },
      locale,
    );
    assert(
      doubled.steps
        .find((s) => s.id === 'heat-milk')!
        .body.includes(
          formatQuantity(locale, {
            kind: 'range',
            min: 1200,
            max: 1300,
            unit: 'ml',
          }),
        ),
    );
    assert(
      doubled.steps
        .find((s) => s.id === 'divide-and-chill')!
        .body.includes('24'),
    );
    assert.equal(
      doubled.steps.find((s) => s.id === 'bake-layer')!.body,
      base.steps.find((s) => s.id === 'bake-layer')!.body,
    );
  }
});
