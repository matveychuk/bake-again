import type { AppLocale } from '../../lib/i18n/config.ts';
import type { InventoryRecipe } from './inventory.ts';
import { creamPageRecipes } from './cream-page-records.ts';
import {
  getCreamOptionCopy,
  reusableCreamRecipeIds,
} from './cream-option-copy.ts';

export const additionalComponentCopy = {
  'sour-cream': {
    en: {
      title: 'Sour cream filling',
      description: 'A simple filling for two layers in a 24 cm cake.',
    },
    es: {
      title: 'Crema de nata agria',
      description:
        'Una crema sencilla para dos capas de relleno en una tarta de 24 cm.',
    },
    uk: {
      title: 'Сметанний крем',
      description: 'Простий крем для двох прошарків торта діаметром 24 см.',
    },
  },
  'lemon-cream-cheese': {
    en: {
      title: 'Lemon butter and cream cheese frosting',
      description:
        'A calculated batch for coating and piping, with 200 g butter.',
    },
    es: {
      title: 'Crema de mantequilla y queso al limón',
      description:
        'Una tanda calculada para cubrir y decorar, con 200 g de mantequilla.',
    },
    uk: {
      title: 'Лимонний крем із маслом і вершковим сиром',
      description:
        'Перерахована порція на 200 г масла для покриття й оздоблення.',
    },
  },
  'chocolate-glaze': {
    en: {
      title: 'Chocolate glaze',
      description: 'A shared cocoa glaze for homemade cakes.',
    },
    es: {
      title: 'Glaseado de chocolate',
      description: 'Un glaseado de cacao para tartas caseras.',
    },
    uk: {
      title: 'Шоколадна глазур',
      description: 'Спільний рецепт поливки з какао для домашніх тортів.',
    },
  },
} as const;
export const reusableComponentRecipeIds = [
  ...reusableCreamRecipeIds,
  'chocolate-glaze',
] as const;
export function isReusableComponentRecipeId(id: string) {
  return reusableComponentRecipeIds.some((candidate) => candidate === id);
}
export function getComponentCopy(id: string, locale: AppLocale) {
  return (
    additionalComponentCopy[id as keyof typeof additionalComponentCopy]?.[
      locale
    ] ?? getCreamOptionCopy(id, locale)
  );
}
const componentPages: InventoryRecipe[] = [
  {
    id: 'sour-cream',
    slug: 'sour-cream',
    title: 'Sour cream filling',
    sourceTitle: 'Сметанний крем',
    category: 'Cream',
    collectionIds: [],
    testingStatus: 'Core verified',
    flour: '',
    difficulty: 'Easy',
    activeTime: null,
    totalTime: null,
    scalingAnchorIngredientId: 'sour-cream',
    launchPriority: 'Linked recipe',
    heroCandidate: 'Yes',
    image: '/media/recipes/recipe-components/sour-cream-v1.webp',
    imageKind: 'generated-preview',
    imageAlt: 'Sour cream filling in a bowl',
    summary: 'A simple filling for two layers in a 24 cm cake.',
    source: 'Author recipe notes · 2026-09-25',
    archiveSections: [],
    needsBeforePublishing: '',
  },
  {
    id: 'lemon-cream-cheese',
    slug: 'lemon-cream-cheese',
    title: 'Lemon butter and cream cheese frosting',
    sourceTitle: 'Лимонний крем із маслом і вершковим сиром',
    category: 'Cream',
    collectionIds: [],
    testingStatus: 'Suggested adaptation',
    flour: '',
    difficulty: 'Easy',
    activeTime: null,
    totalTime: null,
    scalingAnchorIngredientId: 'butter',
    launchPriority: 'Linked recipe',
    heroCandidate: 'Yes',
    image: '/media/recipes/recipe-components/lemon-cream-cheese-v1.webp',
    imageKind: 'generated-preview',
    imageAlt: 'Lemon butter and cream cheese frosting in a bowl',
    summary: 'A calculated batch for coating and piping, with 200 g butter.',
    source: 'Author recipe notes · 2026-09-25',
    archiveSections: [],
    needsBeforePublishing: '',
  },
  {
    id: 'chocolate-glaze',
    slug: 'chocolate-glaze',
    title: 'Chocolate glaze',
    sourceTitle: 'Шоколадна глазур',
    category: 'Glaze',
    collectionIds: [],
    testingStatus: 'Core verified',
    flour: '',
    difficulty: 'Easy',
    activeTime: null,
    totalTime: null,
    scalingAnchorIngredientId: 'butter',
    launchPriority: 'Linked recipe',
    heroCandidate: 'Yes',
    image: '/media/recipes/recipe-components/chocolate-glaze-v1.webp',
    imageKind: 'generated-preview',
    imageAlt: 'Chocolate glaze in a bowl',
    summary: 'A shared cocoa glaze for homemade cakes.',
    source: 'Author recipe notes · 2026-09-25',
    archiveSections: [],
    needsBeforePublishing: '',
  },
];
export function getComponentPageRecipe(slug: string): InventoryRecipe | null {
  return (
    componentPages.find((recipe) => recipe.slug === slug) ??
    creamPageRecipes.find((recipe) => recipe.slug === slug) ??
    null
  );
}
