import type { HTMLAttributes, ReactNode } from 'react';

type EyebrowProps = {
  as?: 'p' | 'span' | 'div';
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, 'children'>;

export function Eyebrow({
  as,
  children,
  className = 'eyebrow',
  ...props
}: EyebrowProps) {
  const Component = as ?? 'p';
  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  );
}
