import type { LocalizedText } from './recipe.types.ts';
import type { RecipeCollectionId } from './collections.ts';

export type InventoryArchiveSection = {
  title: string;
  content: string;
};

export type InventoryRecipe = {
  id: string;
  slug: string;
  title: string;
  sourceTitle: string;
  category: string;
  /** Reader-facing collections; category is search metadata, not a visible card eyebrow. */
  collectionIds: RecipeCollectionId[];
  testingStatus: 'Core verified' | 'Suggested adaptation';
  flour: string;
  difficulty: string | null;
  activeTime: string | null;
  totalTime: string | null;
  localizedFacts?: {
    difficulty: LocalizedText;
    activeTime: LocalizedText;
    totalTime: LocalizedText;
    flour?: LocalizedText;
  };
  scalingAnchorIngredientId?: string;
  launchPriority: string;
  heroCandidate: 'Yes' | 'Possible' | 'No';
  image: string;
  /** Optional image used by RecipeCard; image remains the recipe/home hero. */
  cardImage?: string;
  cardImageAlt?: LocalizedText;
  /** Shift a card crop toward the left edge while keeping the subject near center. */
  cardImagePosition?: 'left-quarter';
  imageKind: 'generated-preview' | 'author-photo' | 'edited-author-photo';
  imageAlt: string;
  summary: string;
  source: string;
  archiveSections: InventoryArchiveSection[];
  needsBeforePublishing: string;
};

import { recipes } from './registry.ts';
import type { Recipe } from './recipe.types.ts';
import { formatElapsedMinutes } from '../../lib/i18n/format.ts';

/** Compatibility view only: all editable recipe facts live in Recipe. */
export function recipeInventoryView(recipe: Recipe): InventoryRecipe {
  const d = recipe.discovery;
  const hero = recipe.media.find((item) => item.id === recipe.heroMediaId)!;
  const card = recipe.media.find((item) => item.id === recipe.cardMediaId);
  const active = recipe.timing.activeMinutes;
  const total = recipe.timing.totalElapsedMinutes;
  return {
    id: recipe.id,
    slug: recipe.routeSlug,
    title: d.cardTitle.en,
    summary: recipe.summary.en,
    category: d.category.en,
    collectionIds: d.collectionIds,
    testingStatus: ['tested', 'repeatedlyVerified'].includes(
      recipe.baseProvenance.state,
    )
      ? 'Core verified'
      : 'Suggested adaptation',
    flour: d.flourSummary?.en ?? '',
    difficulty: recipe.difficulty,
    activeTime: active === null ? null : formatElapsedMinutes('en', active),
    totalTime: total === null ? null : formatElapsedMinutes('en', total),
    scalingAnchorIngredientId:
      recipe.configuration.quantityAdjustment.useWhatIHave?.scalingAnchors[0]
        ?.ingredientLineId,
    image: hero?.path ?? '',
    imageAlt: hero?.alt.en ?? recipe.summary.en,
    imageKind: d.imageKind,
    cardImage: card?.path,
    cardImageAlt: card?.alt,
    cardImagePosition: d.cardImagePosition,
    sourceTitle: d.sourceTitle,
    launchPriority: d.launchPriority,
    heroCandidate: d.heroCandidate,
    source: d.source,
    archiveSections: d.archiveSections,
    needsBeforePublishing: d.needsBeforePublishing,
  };
}

const inventoryOrder = [
  'celebration-sponge-cake',
  'banana-bread',
  'lazy-dumplings',
  'apple-charlotte',
  'apple-meringue-pie',
  'plum-cake',
  'cottage-cheese-waffles',
  'carrot-cake',
  'sponge-cake',
  'crepes',
  'gluten-free-napoleon',
  'cinnamon-rolls',
  'crinkle-cookies',
  'apple-fritters',
  'banana-fritters',
  'apple-banana-fritters',
  'easter-bread',
  'prune-cake',
  'fruit-sponge-roll',
  'eclairs',
];
const inventoryRanks = new Map(inventoryOrder.map((id, index) => [id, index]));
export const recipeInventory: InventoryRecipe[] = recipes
  .filter((recipe) => recipe.discovery.catalogue)
  .map(recipeInventoryView)
  .sort(
    (a, b) =>
      (inventoryRanks.get(a.id) ?? inventoryRanks.size) -
      (inventoryRanks.get(b.id) ?? inventoryRanks.size),
  );
export function getInventoryRecipe(slug: string): InventoryRecipe | undefined {
  return recipeInventory.find((recipe) => recipe.slug === slug);
}
