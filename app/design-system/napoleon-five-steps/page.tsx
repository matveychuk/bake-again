import type { Metadata } from 'next';
import { RecipePage } from '@/components/recipe/recipe-page';

export const metadata: Metadata = {
  title: 'Napoleon — shared recipe review — Bake Again',
  description: 'The shared recipe-detail composition rendered with the complete Ukrainian Napoleon recipe.',
  robots: { index: false },
};

/** A stable review route for the live shared recipe-detail composition. */
export default function NapoleonFiveStepsReviewPage() {
  return <RecipePage locale="uk" slug="napoleon-cake" />;
}
