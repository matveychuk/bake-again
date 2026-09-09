import { notFound } from 'next/navigation';
import { CookModePage } from '@/components/cook-mode/cook-mode-page';
import { getCookModeDefinition } from '@/content/recipes/cook-mode-registry';

type CookRouteProps = { params: Promise<{ slug: string }> };

export default async function RecipeCookModeRoute({ params }: CookRouteProps) {
  const { slug } = await params;
  const definition = getCookModeDefinition(slug);
  if (!definition) notFound();
  return <CookModePage definition={definition} />;
}
