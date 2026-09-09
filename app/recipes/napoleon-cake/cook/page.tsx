import { CookModePage } from '@/components/cook-mode/cook-mode-page';
import { getCookModeDefinition } from '@/content/recipes/cook-mode-registry';

export default function NapoleonCookModePage() {
  return <CookModePage definition={getCookModeDefinition('napoleon-cake')!} />;
}
