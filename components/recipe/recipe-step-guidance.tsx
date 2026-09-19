import { CheckCircle2, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import styles from './recipe-step-guidance.module.css';

export function RecipeStepGuidance({
  kind,
  label,
  children,
  className,
  variant = 'block',
}: {
  kind: 'checkpoint' | 'tip';
  label: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'block' | 'inline' | 'prominent';
}) {
  const Icon = kind === 'checkpoint' ? CheckCircle2 : Lightbulb;
  return (
    <aside
      className={cn(
        styles.guidance,
        kind === 'tip' ? styles.tip : styles.checkpoint,
        variant === 'inline' && styles.inline,
        variant === 'prominent' && styles.prominent,
        className,
      )}
    >
      <Icon aria-hidden="true" size={19} />
      <p>
        <strong>{label}</strong>
        <span>{children}</span>
      </p>
    </aside>
  );
}
