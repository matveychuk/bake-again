import { recipeInventory } from './inventory';

export type RecipeCatalogEntry = {
  id: string;
  title: string;
  eyebrow: string;
  detail: string;
  status: string;
  statusDetail: string;
  image: string;
  alt: string;
  href: string;
  publicationStatus: 'draft';
  imageKind: 'generated-preview' | 'author-photo';
};

export const recipeCatalog: RecipeCatalogEntry[] = recipeInventory.map((recipe) => ({
  id: recipe.id,
  title: recipe.title,
  eyebrow: recipe.category,
  detail: recipe.totalTime ?? recipe.activeTime ?? 'Details to confirm',
  status: recipe.testingStatus,
  statusDetail: recipe.flour.replace(' Bread', ''),
  image: recipe.image,
  imageKind: recipe.imageKind,
  alt: recipe.imageAlt,
  href: `/recipes/${recipe.slug}`,
  publicationStatus: 'draft',
}));
