import { cn } from '@/lib/utils';
import { Loader2Icon } from 'lucide-react';

function Spinner({ className, ...props }: React.ComponentProps<'output'>) {
  return (
    <output aria-label="Loading" data-slot="spinner" {...props}>
      <Loader2Icon aria-hidden="true" className={cn('size-4 animate-spin', className)} />
    </output>
  );
}

export { Spinner };
