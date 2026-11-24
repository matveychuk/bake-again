import type { RecipeCatalogEntry } from './catalog.ts';
import { isReusableComponentRecipeId } from './recipe-component-records.ts';
import { getRecipe } from './registry.ts';

export function getRecipeRecommendations(
  id: string,
  catalog: RecipeCatalogEntry[],
) {
  const source = getRecipe(id);
  const published = catalog.filter(
    (entry) => entry.publicationStatus === 'published',
  );
  // Start after this recipe in the localized editorial order so each page has
  // stable links and later entries in the catalogue also receive referrals.
  const start = published.findIndex((entry) => entry.id === id) + 1;
  const candidates = [
    ...published.slice(start),
    ...published.slice(0, start),
  ].filter((entry) => entry.id !== id);
  const isComponent = isReusableComponentRecipeId(id);
  const ranked = candidates.map((entry) => {
    const candidate = getRecipe(entry.id)!;
    const directlyRelated =
      source?.relatedRecipeIds.includes(entry.id) ||
      candidate.relatedRecipeIds.includes(id) ||
      candidate.creamOptions?.recipeIds.includes(id);
    const sameCategory =
      source?.discovery.category.en === candidate.discovery.category.en ||
      source?.categoryIds.some((category) =>
        candidate.categoryIds.includes(category),
      );
    const sharedCollections = entry.collections.filter(({ id: collection }) =>
      source?.discovery.collectionIds.includes(collection),
    );
    const primaryCollection = source?.discovery.collectionIds[0];
    const sharesPrimary = sharedCollections.some(
      ({ id }) => id === primaryCollection,
    );
    return {
      entry,
      directlyRelated,
      sameCategory,
      sharesPrimary,
      overlap: sharedCollections.length,
    };
  });
  const related = ranked
    .filter(
      (item) =>
        item.directlyRelated ||
        (!isComponent && (item.sameCategory || item.overlap)),
    )
    .sort(
      (a, b) =>
        Number(Boolean(b.directlyRelated)) -
          Number(Boolean(a.directlyRelated)) ||
        Number(Boolean(b.sameCategory)) - Number(Boolean(a.sameCategory)) ||
        b.overlap - a.overlap ||
        Number(b.sharesPrimary) - Number(a.sharesPrimary),
    )
    .slice(0, 4)
    .map((item) => item.entry);
  const commonCollection = source?.discovery.collectionIds.find(
    (collection) =>
      related.length > 0 &&
      related.every((entry) =>
        entry.collections.some(({ id }) => id === collection),
      ),
  );
  const remaining = candidates.filter((entry) => !related.includes(entry));
  const seenCollections = new Set<string | undefined>();
  const varied = remaining.filter((entry) => {
    const collection = entry.collections[0]?.id;
    if (seenCollections.has(collection)) return false;
    seenCollections.add(collection);
    return true;
  });
  const more = [
    ...varied,
    ...remaining.filter((entry) => !varied.includes(entry)),
  ].slice(0, 4);
  return { related, commonCollection, more };
}
