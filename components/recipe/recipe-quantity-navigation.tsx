'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { cookLaunchFragment } from '@/lib/persistence/cook-mode';
import { Button } from '@/components/ui/button';
import {
  updateRecipeContentConfigurationParams,
  type RecipeQuantitySelection,
} from '@/content/recipes/recipe-content-configuration';

const QuantityNavigation = createContext<{
  selection: RecipeQuantitySelection | null;
  select: (selection: RecipeQuantitySelection) => void;
} | null>(null);

/** Keeps Cook links in step with the ingredient panel while the route is updating. */
export function RecipeQuantityNavigation({
  children,
}: {
  children: ReactNode;
}) {
  const [selection, select] = useState<RecipeQuantitySelection | null>(null);
  return (
    <QuantityNavigation.Provider value={{ selection, select }}>
      {children}
    </QuantityNavigation.Provider>
  );
}

export function useSelectRecipeQuantity() {
  return useContext(QuantityNavigation)?.select;
}

export function RecipeCookLink({
  href,
  variant,
  label,
  launch = false,
  children,
}: {
  href: string;
  variant: 'link' | 'default';
  label?: string;
  launch?: boolean;
  children: ReactNode;
}) {
  const selection = useContext(QuantityNavigation)?.selection;
  let destination = href;
  if (selection && !href.startsWith('#')) {
    const [path, search = ''] = href.split('?');
    const params = updateRecipeContentConfigurationParams(
      search,
      selection,
    ).toString();
    destination = params ? path + '?' + params : path;
  }
  return (
    <Button
      variant={variant}
      href={launch ? destination + cookLaunchFragment : destination}
      aria-label={label}
    >
      {children}
    </Button>
  );
}
