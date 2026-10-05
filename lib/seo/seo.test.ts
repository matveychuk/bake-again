import assert from 'node:assert/strict';
import test from 'node:test';
import {
  recipeDocuments,
  getRecipeContent,
} from '../../content/recipes/registry.ts';
import { recipeSeo } from '../../content/recipes/seo.ts';
import { supportedLocales } from '../i18n/config.ts';
import {
  recipeIdForSlug,
  recipePresentation,
  recipeStructuredData,
  serializeJsonLd,
} from './recipes.ts';
import { pageMetadata, recipeMetadata } from './metadata.ts';
import { sitemapEntries, sitemapXml } from './sitemap.ts';

void test('published translations have unique canonical URLs, reciprocal alternatives and complete SEO copy', () => {
  const urls = new Set<string>();
  for (const { recipe } of recipeDocuments)
    for (const locale of supportedLocales) {
      const page = recipePresentation(recipe.id, locale);
      assert.ok(page, `${recipe.id}/${locale}`);
      assert.equal(
        recipeIdForSlug(locale, page.path.split('/').pop()!),
        recipe.id,
      );
      const metadata = recipeMetadata(recipe.id, locale);
      assert.equal(
        (metadata.robots as { index: boolean }).index,
        recipe.publicationStatus === 'published',
      );
      if (recipe.publicationStatus !== 'published') continue;
      assert.ok(recipeSeo[recipe.id]?.[locale]?.description);
      const canonical = metadata.alternates?.canonical;
      assert.equal(typeof canonical, 'string');
      if (typeof canonical !== 'string')
        throw new Error('Expected canonical URL');
      assert.ok(canonical.startsWith('https://bakeagain.com/'));
      assert.ok(!urls.has(canonical));
      urls.add(canonical);
      assert.equal(Object.keys(metadata.alternates!.languages!).length, 3);
    }
  assert.equal(urls.size, 66);
});

void test('localized public pages expose a sharing image while recipes keep their own photo', () => {
  for (const locale of supportedLocales) {
    const metadata = pageMetadata({
      title: 'Bake Again',
      description: 'Baking recipes',
      path: `/${locale}`,
      locale,
    });
    const images = metadata.openGraph?.images;
    assert.ok(Array.isArray(images));
    const image = images[0];
    assert.equal(typeof image, 'object');
    if (typeof image === 'string' || image instanceof URL)
      throw new Error('Expected image metadata');
    assert.equal(image.url, 'https://bakeagain.com/share-image-v4.webp');
    assert.equal(image.width, 1200);
    assert.equal(image.height, 630);
    assert.equal((metadata.twitter as { card?: string })?.card, 'summary_large_image');
  }

  const recipe = recipeMetadata('gluten-free-napoleon', 'uk');
  const recipeImages = recipe.openGraph?.images;
  assert.ok(Array.isArray(recipeImages));
  const recipeImage = recipeImages[0];
  assert.equal(typeof recipeImage, 'object');
  if (typeof recipeImage === 'string' || recipeImage instanceof URL)
    throw new Error('Expected recipe image metadata');
  assert.notEqual(recipeImage.url, 'https://bakeagain.com/share-image-v4.webp');
});

void test('sitemap contains only published canonical pages and reciprocal language links', () => {
  const entries = sitemapEntries();
  assert.equal(entries.length, 78);
  assert.equal(new Set(entries.map((entry) => entry.url)).size, entries.length);
  for (const entry of entries) {
    assert.ok(!/\/cook|\/saved|\/drafts|shopping-list|[?]/.test(entry.url));
    assert.ok(entry.alternatives.some((alt) => alt.url === entry.url));
    assert.equal(entry.alternatives.length, 3);
  }
  for (const { recipe } of recipeDocuments.filter(
    (d) => d.recipe.publicationStatus !== 'published',
  )) {
    assert.ok(
      !entries.some(
        (entry) =>
          entry.url ===
          'https://bakeagain.com' + recipePresentation(recipe.id, 'uk')!.path,
      ),
    );
  }
  assert.ok(sitemapXml().includes('xmlns:xhtml='));
});

void test('Recipe data follows visible quantities and instructions without invented ratings or author', () => {
  for (const { recipe } of recipeDocuments)
    for (const locale of supportedLocales) {
      const content = getRecipeContent(recipe.id, locale)!;
      const data = recipeStructuredData(recipe.id, locale, content);
      if (recipe.publicationStatus !== 'published') {
        assert.equal(data, null);
        continue;
      }
      assert.ok(data, `${recipe.id}/${locale}`);
      assert.equal(data.recipeInstructions.length, content.steps.length);
      assert.equal(
        data.recipeIngredient.length,
        content.ingredientSections.flatMap((s) => s.ingredients).length,
      );
      assert.equal(data.inLanguage, locale);
      assert.ok(!('author' in data));
      assert.ok(!('aggregateRating' in data));
      assert.ok(!('nutrition' in data));
      assert.ok(data.image[0].endsWith('.webp'));
      if (content.timing?.totalElapsedMinutes == null)
        assert.ok(!('totalTime' in data));
    }
});

void test('JSON-LD serialization escapes executable HTML but preserves parsed text', () => {
  const value = { text: '</script><script>alert(1)</script>\u2028\u2029' };
  const serialized = serializeJsonLd(value);
  assert.ok(!serialized.includes('<'));
  assert.deepEqual(JSON.parse(serialized), value);
});
