'use client';
import type { PublicContribution } from '@/lib/community/contracts';
import { RecipeReviewsSection } from './recipe-reviews-section';

// Fictional readers and texts; photos are the author's existing crepe step images.
const fixtures: PublicContribution[] = [
  {
    id: 'example-1',
    name: 'Олена',
    text: 'Вийшли тонкі й не рвалися. Друга партія — ще краща, коли тісто постояло пів години.',
    rating: 5,
    createdAt: '2026-10-28T09:30:00Z',
    photos: [
      '/media/recipes/crepes/selected/step-05-crepe-golden-side-s2b-v1.webp',
      '/media/recipes/crepes/selected/step-05-crepe-edge-lift-s2b-v1.webp',
    ],
  },
  {
    id: 'example-2',
    name: 'Марія-Антоніна Шевченко-Богданович',
    text: 'Чи можна замінити молоко рослинним? Хочу спробувати з вівсяним.',
    rating: null,
    createdAt: '2026-10-25T17:05:00Z',
    photos: [],
  },
  {
    id: 'example-3',
    name: 'Ірина',
    text: 'Смачно, але перший млинець прилип — сковорода була недостатньо гаряча.',
    rating: 4,
    createdAt: '2026-10-20T12:00:00Z',
    photos: [],
  },
];

export function RecipeReviewsExample() {
  return (
    <RecipeReviewsSection recipeId="crepes" locale="uk" preview={fixtures} />
  );
}
