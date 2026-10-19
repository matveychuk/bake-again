import type { ReactNode } from 'react';
import { Eyebrow } from './eyebrow';

type SectionTitleProps = {
  eyebrow?: ReactNode;
  children: ReactNode;
  id?: string;
  className?: string;
  eyebrowClassName?: string;
  level?: 1 | 2 | 3;
  tabIndex?: number;
};

export function SectionTitle({
  eyebrow,
  children,
  id,
  className,
  eyebrowClassName,
  level = 2,
  tabIndex,
}: SectionTitleProps) {
  const Heading = `h${level}` as const;
  return (
    <div className={className}>
      {eyebrow && <Eyebrow className={eyebrowClassName}>{eyebrow}</Eyebrow>}
      <Heading id={id} tabIndex={tabIndex}>
        {children}
      </Heading>
    </div>
  );
}
