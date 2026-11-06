import assert from 'node:assert/strict';
import test from 'node:test';
import { cardTime, getRecipeCatalog } from './catalog.ts';
import {
  getRecipeDetailTitleParts,
  recipeDetailTitles,
} from './catalog-locales.ts';
import { recipeInventory } from './inventory.ts';
import { getRecipeContent } from './registry.ts';
import { recipeCollectionIds } from './collections.ts';

void test('renders catalogue discovery copy in the selected locale for every recipe', () => {
  for (const locale of ['en', 'es', 'uk'] as const) {
    const catalogue = getRecipeCatalog(locale, 'all');
    assert.equal(catalogue.length, recipeInventory.length);
    assert(catalogue.every((recipe) => recipe.title.length > 0));
    assert(catalogue.every((recipe) => recipe.category.length > 0));
    assert(catalogue.every((recipe) => recipe.alt.length > 0));
  }
});

void test('uses localized recipe titles and preserves the stable recipe identity', () => {
  const ukrainianNapoleon = getRecipeCatalog('uk', 'all').find(
    (recipe) => recipe.id === 'gluten-free-napoleon',
  );
  const spanishNapoleon = getRecipeCatalog('es', 'all').find(
    (recipe) => recipe.id === 'gluten-free-napoleon',
  );

  assert.equal(ukrainianNapoleon?.title, 'Наполеон');
  assert.equal(spanishNapoleon?.title, 'Tarta Napoleón');
  assert.equal(ukrainianNapoleon?.id, spanishNapoleon?.id);
});

void test('keeps Napoleon listing photography separate from its hero', () => {
  const napoleon = getRecipeCatalog('uk').find(
    (recipe) => recipe.id === 'gluten-free-napoleon',
  );
  assert(napoleon);
  assert(napoleon.image.includes('hero-img-2359-crop-v1.webp'));
  assert(napoleon.cardImage?.includes('card-img-2341-linen-v5.webp'));
  assert.equal(napoleon.cardImagePosition, 'left-quarter');
  assert(napoleon.cardAlt?.includes('Цілий Наполеон'));
});

void test('uses the author food photos on linen in crepe and dumpling cards', () => {
  const catalog = getRecipeCatalog('uk');
  const crepes = catalog.find((recipe) => recipe.id === 'crepes');
  const dumplings = catalog.find((recipe) => recipe.id === 'lazy-dumplings');
  assert(crepes);
  assert(dumplings);
  assert(crepes.cardImage?.includes('crepes-stack-lace-linen-v1.webp'));
  assert(crepes.image.includes('crepes-stack-2026-10-20-v1.webp'));
  assert(
    dumplings.cardImage?.includes('lazy-dumplings-real-plate-linen-v1.webp'),
  );
  assert(dumplings.image.includes('lazy-dumplings-card-v1.webp'));
});

void test('assigns every recipe to a localized reader-facing collection', () => {
  for (const locale of ['en', 'es', 'uk'] as const) {
    const catalogue = getRecipeCatalog(locale, 'all');
    assert(catalogue.every((recipe) => recipe.collections.length > 0));
    assert(
      catalogue.every((recipe) =>
        recipe.collections.every((collection) =>
          recipeCollectionIds.includes(collection.id),
        ),
      ),
    );
    assert(
      catalogue.every((recipe) =>
        recipe.collections.every((collection) => collection.label.length > 0),
      ),
    );
  }
});

void test('keeps the reviewed cottage-cheese and batter-on-hand collections precise', () => {
  const ukrainianCatalogue = getRecipeCatalog('uk', 'all');
  const recipeIdsFor = (collectionId: string) =>
    ukrainianCatalogue
      .filter((recipe) =>
        recipe.collections.some((collection) => collection.id === collectionId),
      )
      .map((recipe) => recipe.id);

  assert.deepEqual(recipeIdsFor('cottage-cheese'), [
    'lazy-dumplings',
    'cottage-cheese-waffles',
    'apple-cottage-cheese-cookies',
  ]);
  assert.deepEqual(recipeIdsFor('batter-on-hand'), [
    'cottage-cheese-waffles',
    'carrot-cake',
    'crinkle-cookies',
  ]);
});

void test('uses the edited real waffle photo across catalogue locales', () => {
  for (const locale of ['en', 'es', 'uk'] as const) {
    const waffles = getRecipeCatalog(locale, 'all').find(
      (recipe) => recipe.id === 'cottage-cheese-waffles',
    );

    assert.equal(waffles?.imageKind, 'edited-author-photo');
    assert.equal(
      waffles?.image,
      '/images/recipes/cottage-cheese-waffles-linen-ivory-plate-v3.webp',
    );
    assert.match(waffles?.alt ?? '', /berries|frutos rojos|ягодами/);
  }
});

void test('shows the recorded crepe duration in every catalogue locale', () => {
  const crepes = getRecipeContent('crepes', 'uk');

  assert.equal(crepes?.overview.difficulty, 'medium');
  assert.equal(crepes?.overview.timing.activeMinutes, 40);
  assert.equal(
    getRecipeCatalog('en', 'all').find((recipe) => recipe.id === 'crepes')
      ?.detail,
    'Total time: 1 hour',
  );
  assert.equal(
    getRecipeCatalog('es', 'all').find((recipe) => recipe.id === 'crepes')
      ?.detail,
    'Tiempo total: 1 h',
  );
  assert.equal(
    getRecipeCatalog('uk', 'all').find((recipe) => recipe.id === 'crepes')
      ?.detail,
    'Загальний час: 1 год',
  );
});

void test('publishes the reviewed fruit sponge roll with its final hero and practical facts', () => {
  const roll = getRecipeCatalog('uk').find(
    (recipe) => recipe.id === 'fruit-sponge-roll',
  );

  assert.equal(roll?.detail, 'Активний час: 30 хв');
  assert.equal(roll?.difficulty, 'Складність: Легка');
  assert.equal(roll?.image, '/images/recipes/fruit-sponge-roll-card-v3.webp');
  assert.equal(roll?.imageKind, 'generated-preview');
});

void test('keeps apple charlotte in drafts while publishing the reviewed plum cake', () => {
  const apple = getRecipeCatalog('uk', 'unpublished').find(
    (recipe) => recipe.id === 'apple-charlotte',
  );
  const plum = getRecipeCatalog('uk').find(
    (recipe) => recipe.id === 'plum-cake',
  );

  assert.equal(apple?.detail, 'Загальний час: 50 хв');
  assert.equal(apple?.difficulty, 'Складність: Легка');
  assert.equal(apple?.image, '/images/recipes/apple-charlotte-card-v2.webp');
  assert(
    !getRecipeCatalog('uk').some((recipe) => recipe.id === 'apple-charlotte'),
  );
  assert.equal(plum?.detail, 'Загальний час: 1 год');
  assert.equal(plum?.difficulty, 'Складність: Середня');
  assert.equal(plum?.image, '/images/recipes/plum-cake-author-hero-v1.webp');
});

void test('keeps catalogue names concise and makes gluten-free explicit on recipe pages', () => {
  assert.equal(
    getRecipeCatalog('uk', 'all').find((recipe) => recipe.id === 'crepes')
      ?.title,
    'Млинці',
  );
  assert.equal(recipeDetailTitles.crepes.uk, 'Безглютенові млинці');
  assert.equal(
    recipeDetailTitles['lazy-dumplings'].uk,
    'Безглютенові ліниві вареники',
  );

  for (const recipe of recipeInventory) {
    const detailTitle = recipeDetailTitles[recipe.id];
    assert(detailTitle, `${recipe.id}: missing localized detail title`);
    if (recipe.id === 'apple-cottage-cheese-cookies') {
      assert.equal(detailTitle.uk, 'Яблучно-творожне печиво');
      assert.doesNotMatch(detailTitle.uk, /безглютен/i);
      continue;
    }
    assert.match(detailTitle.en, /gluten-free/i);
    assert.match(detailTitle.es, /sin gluten/i);
    assert.match(detailTitle.uk, /безглютен/i);
  }
});

void test('splits localized detail titles into a gluten-free label and dish name', () => {
  assert.deepEqual(
    getRecipeDetailTitleParts(recipeDetailTitles.crepes.uk, 'uk'),
    {
      glutenFreeLabel: 'Безглютенові',
      recipeName: 'млинці',
    },
  );
  assert.deepEqual(
    getRecipeDetailTitleParts(recipeDetailTitles.crepes.en, 'en'),
    {
      glutenFreeLabel: 'Gluten-free',
      recipeName: 'crepes',
    },
  );
  assert.deepEqual(
    getRecipeDetailTitleParts(recipeDetailTitles.crepes.es, 'es'),
    {
      glutenFreeLabel: 'Sin gluten',
      recipeName: 'Crepes',
    },
  );
});

void test('card timing identifies active time and never invents unknown time', () => {
  assert.equal(
    cardTime('uk', {
      totalElapsedMinutes: null,
      activeMinutes: 20,
      planningNote: null,
    }),
    'Активний час: 20 хв',
  );
  assert.equal(
    cardTime('en', {
      totalElapsedMinutes: null,
      activeMinutes: null,
      planningNote: null,
    }),
    null,
  );
  const pruneCake = getRecipeCatalog('uk').find(
    (recipe) => recipe.id === 'prune-cake',
  )!;
  assert.equal(pruneCake.detail, 'Активний час: 1 год');
  assert.equal(pruneCake.difficulty, 'Складність: Середня');
});
