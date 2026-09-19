import type { ReactNode } from 'react';

export type RecipeFact = {
  label: string;
  value: ReactNode;
  detail?: ReactNode;
};

export function RecipeFacts({ items, className }: { items: RecipeFact[]; className?: string }) {
  return (
    <dl className={className}>
      {items.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}{item.detail ? <small>{item.detail}</small> : null}</dd>
        </div>
      ))}
    </dl>
  );
}
