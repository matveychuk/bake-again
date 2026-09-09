import type { ReactNode } from 'react';

type NumberedSectionTitleProps = {
  number: string;
  eyebrow: ReactNode;
  children: ReactNode;
  className?: string;
  id?: string;
};

export function NumberedSectionTitle({
  number,
  eyebrow,
  children,
  className,
  id,
}: NumberedSectionTitleProps) {
  return (
    <div className={className}>
      <span>{number}</span>
      <div>
        <p>{eyebrow}</p>
        <h2 id={id}>{children}</h2>
      </div>
    </div>
  );
}
