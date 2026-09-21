import type { InventoryRecipe } from './inventory.ts';

/**
 * Standalone cream pages use the shared recipe-detail composition without becoming
 * discovery cards in the main recipe catalogue.
 */
export const creamPageRecipes: readonly InventoryRecipe[] = [
  {
    id: 'mascarpone-whipped-cream',
    slug: 'mascarpone-whipped-cream',
    title: 'Whipped cream with mascarpone',
    sourceTitle: 'Крем із вершків та маскарпоне',
    category: 'Cream',
    collectionIds: [],
    testingStatus: 'Core verified',
    flour: '',
    difficulty: 'Easy',
    activeTime: '10 min',
    totalTime: '10 min',
    localizedFacts: {
      difficulty: { en: 'Easy', es: 'Fácil', uk: 'Легка' },
      activeTime: { en: '10 min', es: '10 min', uk: '10 хв' },
      totalTime: { en: '10 min', es: '10 min', uk: '10 хв' },
    },
    scalingAnchorIngredientId: 'whipping-cream',
    launchPriority: 'Linked recipe',
    heroCandidate: 'Yes',
    image: '/images/recipes/mascarpone-whipped-cream-card-v1.png',
    imageKind: 'generated-preview',
    imageAlt:
      'Smooth whipped mascarpone cream holding firm soft peaks in a ceramic bowl',
    summary: 'A light, quick cream that spreads easily and holds its shape.',
    source: 'Recipe Archive · Бісквітний рулет з фруктами · крем',
    archiveSections: [],
    needsBeforePublishing: '',
  },
  {
    id: 'vanilla-egg-custard',
    slug: 'vanilla-egg-custard',
    title: 'Vanilla custard with eggs',
    sourceTitle: 'Ванільний заварний крем з яйцями',
    category: 'Cream',
    collectionIds: [],
    testingStatus: 'Core verified',
    flour: '',
    difficulty: 'Medium',
    activeTime: '25 min',
    totalTime: '2 h 30 min',
    localizedFacts: {
      difficulty: { en: 'Medium', es: 'Media', uk: 'Середня' },
      activeTime: { en: '25 min', es: '25 min', uk: '25 хв' },
      totalTime: {
        en: '2 h 30 min',
        es: '2 h 30 min',
        uk: '2 год 30 хв',
      },
    },
    scalingAnchorIngredientId: 'milk',
    launchPriority: 'Linked recipe',
    heroCandidate: 'Yes',
    image: '/images/recipes/vanilla-egg-custard-card-v1.png',
    imageKind: 'generated-preview',
    imageAlt:
      'Thick glossy vanilla egg custard falling from a spoon into a ceramic bowl',
    summary:
      'A smooth classic custard that cools into a stable pastry filling.',
    source: 'User-provided reference · pastry cream with eggs',
    archiveSections: [],
    needsBeforePublishing: '',
  },
  {
    id: 'eggless-vanilla-custard',
    slug: 'eggless-vanilla-custard',
    title: 'Eggless vanilla custard',
    sourceTitle: 'Ванільний заварний крем без яєць',
    category: 'Cream',
    collectionIds: [],
    testingStatus: 'Core verified',
    flour: '',
    difficulty: 'Medium',
    activeTime: '25 min',
    totalTime: '2 h 30 min',
    localizedFacts: {
      difficulty: { en: 'Medium', es: 'Media', uk: 'Середня' },
      activeTime: { en: '25 min', es: '25 min', uk: '25 хв' },
      totalTime: {
        en: '2 h 30 min',
        es: '2 h 30 min',
        uk: '2 год 30 хв',
      },
    },
    scalingAnchorIngredientId: 'milk',
    launchPriority: 'Linked recipe',
    heroCandidate: 'Yes',
    image: '/images/recipes/eggless-vanilla-custard-card-v1.png',
    imageKind: 'generated-preview',
    imageAlt:
      'Thick pale eggless vanilla custard with a clear spatula channel in a ceramic bowl',
    summary:
      'A large-batch homemade custard that thickens further as it cools.',
    source: 'User-provided reference · eggless pastry cream',
    archiveSections: [],
    needsBeforePublishing: '',
  },
  {
    id: 'vanilla-buttercream',
    slug: 'vanilla-buttercream',
    title: 'Vanilla buttercream',
    sourceTitle: 'Ванільний масляний крем',
    category: 'Cream',
    collectionIds: [],
    testingStatus: 'Core verified',
    flour: '',
    difficulty: 'Medium',
    activeTime: '25 min',
    totalTime: '1 h 15 min',
    localizedFacts: {
      difficulty: { en: 'Medium', es: 'Media', uk: 'Середня' },
      activeTime: { en: '25 min', es: '25 min', uk: '25 хв' },
      totalTime: {
        en: '1 h 15 min',
        es: '1 h 15 min',
        uk: '1 год 15 хв',
      },
    },
    scalingAnchorIngredientId: 'butter',
    launchPriority: 'Linked recipe',
    heroCandidate: 'Yes',
    image: '/images/recipes/vanilla-buttercream-card-v1.png',
    imageKind: 'generated-preview',
    imageAlt:
      'Stable pale vanilla buttercream holding a firm spatula swoop in a ceramic bowl',
    summary:
      'A rich stable cream for filling and decorating cakes and pastries.',
    source: 'User-provided reference · cooked-base buttercream',
    archiveSections: [],
    needsBeforePublishing: '',
  },
];

export function getCreamPageRecipe(slug: string): InventoryRecipe | null {
  return creamPageRecipes.find((recipe) => recipe.slug === slug) ?? null;
}
