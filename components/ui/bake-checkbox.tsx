'use client';

import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';
import { Checkbox } from './checkbox';
import styles from './bake-checkbox.module.css';

/** Shared checked-state treatment for ingredient preparation and shopping rows. */
export function BakeCheckbox({ className, ...props }: ComponentProps<typeof Checkbox>) {
  return <Checkbox className={cn(styles.checkbox, className)} {...props} />;
}
