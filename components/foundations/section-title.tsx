import type { ReactNode } from 'react';
import { Eyebrow } from './eyebrow';

type SectionTitleProps = {
  eyebrow: ReactNode;
  children: ReactNode;
  id?: string;
  className?: string;
  eyebrowClassName?: string;
  level?: 1 | 2 | 3;
};

export function SectionTitle({
  eyebrow,
  children,
  id,
  className,
  eyebrowClassName,
  level = 2,
}: SectionTitleProps) {
  const Heading = `h${level}` as const;
  return (
    <div className={className}>
      <Eyebrow className={eyebrowClassName}>{eyebrow}</Eyebrow>
      <Heading id={id}>{children}</Heading>
    </div>
  );
}
