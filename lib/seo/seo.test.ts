import assert from 'node:assert/strict';
import test from 'node:test';
import {
  recipeDocuments,
  getRecipeContent,
} from '../../content/recipes/registry.ts';
import { recipeSeo } from '../../content/recipes/seo.ts';
import {
  recipeSearchMetadata,
  recipeLastModified,
} from '../../content/recipes/search-metadata.ts';
import { publishedTechniques } from '../../content/techniques/registry.ts';
import { websiteStructuredData } from './website.ts';
import { supportedLocales } from '../i18n/config.ts';
import {
  recipeIdForSlug,
  recipePresentation,
  recipeStructuredData,
  serializeJsonLd,
  structuredIngredient,
  isoMinutes,
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
      assert.equal(Object.keys(metadata.alternates!.languages!).length, 4);
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
    assert.equal(
      (metadata.twitter as { card?: string })?.card,
      'summary_large_image',
    );
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
    assert.equal(entry.alternatives.length, 4);
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

void test('Recipe data follows visible quantities and instructions without invented ratings or nutrition', () => {
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
      assert.equal(data.author.name, locale === 'uk' ? 'Саша' : 'Sasha');
      assert.equal(data.author.url, `https://bakeagain.com/${locale}/about`);
      assert.equal(
        data.description,
        recipeMetadata(recipe.id, locale).description,
      );
      assert.deepEqual(data.publisher, {
        '@id': 'https://bakeagain.com/#organization',
      });
      assert.equal(data.suitableForDiet, 'https://schema.org/GlutenFreeDiet');
      assert.ok(!('review' in data));
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

void test('x-default always targets the canonical English translation, including translated recipe slugs', () => {
  for (const { recipe } of recipeDocuments.filter(
    (d) => d.recipe.publicationStatus === 'published',
  )) {
    const english = recipeMetadata(recipe.id, 'en').alternates!.canonical;
    for (const locale of supportedLocales) {
      const metadata = recipeMetadata(recipe.id, locale);
      assert.equal(metadata.alternates!.languages!['x-default'], english);
      assert.equal((metadata.openGraph as { type: string }).type, 'article');
    }
  }
  for (const path of [
    '',
    '/about',
    '/privacy',
    ...publishedTechniques.map((t) => t.path),
  ]) {
    for (const locale of supportedLocales) {
      const metadata = pageMetadata({
        title: 'Page',
        description: 'Page',
        path: `/${locale}${path}`,
        locale,
      });
      assert.equal(
        metadata.alternates!.languages!['x-default'],
        `https://bakeagain.com/en${path}`,
      );
    }
  }
  for (const entry of sitemapEntries()) {
    const english = entry.alternatives.find((alt) => alt.locale === 'en');
    assert.equal(
      entry.alternatives.find((alt) => alt.locale === 'x-default')?.url,
      english?.url,
    );
    assert.equal(
      entry.lastmod === null || /^\d{4}-\d{2}-\d{2}$/.test(entry.lastmod),
      true,
    );
    assert.ok(
      !/\/(saved|shopping-list|account|api|drafts|cook)(\/|$)/.test(
        new URL(entry.url).pathname,
      ),
    );
  }
  for (const technique of publishedTechniques) {
    for (const locale of supportedLocales)
      assert.ok(
        sitemapEntries().some(
          (e) => new URL(e.url).pathname === `/${locale}${technique.path}`,
        ),
      );
  }
});

void test('dates, durations, cuisine and keywords are conditional source facts shared across languages', () => {
  const cuisineIds = [
    'gluten-free-napoleon',
    'crepes',
    'lazy-dumplings',
    'cottage-cheese-waffles',
    'prune-cake',
  ];
  for (const { recipe } of recipeDocuments.filter(
    (d) => d.recipe.publicationStatus === 'published',
  )) {
    assert.equal(recipe.searchMetadata, recipeSearchMetadata[recipe.id]);
    for (const locale of supportedLocales) {
      const content = getRecipeContent(recipe.id, locale)!;
      const data = recipeStructuredData(recipe.id, locale, content)!;
      const facts = recipeSearchMetadata[recipe.id];
      assert.equal(data.datePublished, facts.datePublished ?? undefined);
      assert.equal(data.dateModified, recipeLastModified(recipe) ?? undefined);
      assert.equal(
        data.prepTime,
        content.timing?.activeMinutes == null
          ? undefined
          : isoMinutes(content.timing.activeMinutes),
      );
      assert.equal(
        data.cookTime,
        facts.cookTimeMinutes == null
          ? undefined
          : isoMinutes(facts.cookTimeMinutes),
      );
      assert.equal(
        data.totalTime,
        content.timing?.totalElapsedMinutes == null
          ? undefined
          : isoMinutes(content.timing.totalElapsedMinutes),
      );
      assert.equal(
        data.recipeCuisine,
        cuisineIds.includes(recipe.id)
          ? { uk: 'Українська кухня', en: 'Ukrainian', es: 'Ucraniana' }[locale]
          : undefined,
      );
      assert.equal(data.keywords, facts.keywords[locale].join(', '));
    }
  }
  const facts = recipeSearchMetadata['gluten-free-napoleon'];
  const previous = { ...facts };
  try {
    facts.datePublished = '2026-10-04';
    facts.dateModified = '2026-10-05';
    for (const locale of supportedLocales) {
      const data = recipeStructuredData(
        'gluten-free-napoleon',
        locale,
        getRecipeContent('gluten-free-napoleon', locale)!,
      )!;
      assert.equal(data.datePublished, '2026-10-04');
      assert.equal(data.dateModified, '2026-10-05');
    }
    facts.keywords = { uk: [], en: [], es: [] };
    facts.recipeCuisine = { uk: null, en: null, es: null };
    const data = recipeStructuredData(
      'gluten-free-napoleon',
      'en',
      getRecipeContent('gluten-free-napoleon', 'en')!,
    )!;
    assert.ok(!('keywords' in data));
    assert.ok(!('recipeCuisine' in data));
  } finally {
    Object.assign(facts, previous);
  }
  assert.equal(
    recipeLastModified({
      versionId: 'v2',
      searchMetadata: { ...facts, dateModifiedVersionId: 'v1' },
    }),
    null,
  );
});

void test('unmeasured ingredient notes appear once and meaningful notes are retained across all recipes', () => {
  const expected = {
    uk: 'борошно для підпилу — за потреби',
    en: 'flour for dusting, as needed',
    es: 'harina para espolvorear, al gusto',
  };
  for (const locale of supportedLocales) {
    const content = getRecipeContent('gluten-free-napoleon', locale)!;
    const data = recipeStructuredData('gluten-free-napoleon', locale, content)!;
    assert.ok(
      data.recipeIngredient.includes(expected[locale]),
      JSON.stringify(data.recipeIngredient),
    );
  }
  for (const { recipe } of recipeDocuments) {
    for (const locale of supportedLocales) {
      for (const ingredient of getRecipeContent(
        recipe.id,
        locale,
      )!.ingredientSections.flatMap((s) => s.ingredients)) {
        const line = structuredIngredient(locale, ingredient);
        assert.ok(
          !/(as needed.*as needed|за потреби.*за потреби|al gusto.*al gusto)/i.test(
            line,
          ),
          line,
        );
        assert.ok(line.includes(ingredient.name));
        if (ingredient.note && ingredient.quantity.base)
          assert.ok(line.includes(ingredient.note));
      }
    }
  }
});

void test('home graph identifies the website and publisher without SearchAction', () => {
  for (const locale of supportedLocales) {
    const graph = websiteStructuredData(locale)['@graph'];
    assert.equal(graph.length, 2);
    const website = graph.find((n) => n['@type'] === 'WebSite')!;
    const organization = graph.find((n) => n['@type'] === 'Organization')!;
    assert.equal(website.url, `https://bakeagain.com/${locale}`);
    assert.equal(website.inLanguage, locale);
    assert.equal(organization['@id'], 'https://bakeagain.com/#organization');
    assert.deepEqual(organization.sameAs, [
      'https://www.instagram.com/bakeagain.glutenfree/',
      'https://www.facebook.com/profile.php?id=61595228937672',
    ]);
    assert.equal(organization.logo?.width, 256);
    assert.equal(organization.logo?.height, 256);
    assert.ok(!JSON.stringify(graph).includes('SearchAction'));
  }
});
