'use client';

/* oxlint-disable next/no-html-link-for-pages -- shared native links retain navigation semantics */
import type { ComponentPropsWithRef, ReactElement } from 'react';
import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import styles from './button.module.css';

const buttonVariants = cva(['group/button', styles.button], {
  variants: {
    variant: {
      default: styles.primary,
      outline: styles.outline,
      secondary: styles.secondary,
      ghost: styles.ghost,
      destructive: styles.destructive,
      link: styles.link,
    },
    size: {
      default: '',
      xs: styles.extraSmall,
      sm: styles.small,
      lg: styles.large,
      icon: styles.icon,
      'icon-xs': styles.icon,
      'icon-sm': styles.icon,
      'icon-lg': `${styles.icon} ${styles.iconLarge}`,
    },
  },
  defaultVariants: { variant: 'default', size: 'default' },
});

type ButtonStyleProps = VariantProps<typeof buttonVariants>;
type NativeButtonProps = ButtonPrimitive.Props &
  ButtonStyleProps & { href?: never };
type AnchorButtonProps = ComponentPropsWithRef<'a'> &
  ButtonStyleProps & { href: string };

function Button(props: AnchorButtonProps): ReactElement;
function Button(props: NativeButtonProps): ReactElement;
function Button(props: NativeButtonProps | AnchorButtonProps) {
  if (props.href !== undefined) {
    const {
      className,
      variant = 'default',
      size = 'default',
      children,
      ...anchorProps
    } = props;
    return (
      <a
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        {...anchorProps}
      >
        {children}
      </a>
    );
  }
  const {
    className,
    variant = 'default',
    size = 'default',
    ...buttonProps
  } = props;
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...buttonProps}
    />
  );
}

export { Button, buttonVariants };
