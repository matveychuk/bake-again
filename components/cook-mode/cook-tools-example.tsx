'use client';

import { Button } from '@/components/ui/button';

import { X } from 'lucide-react';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from '@/components/ui/drawer';
import { RecipeIngredientList } from '@/components/recipe/recipe-ingredient-list';
import styles from '@/app/recipes/napoleon-cake/cook/cook-mode.module.css';

const exampleIngredients = [
  { id: 'eggs', name: 'Eggs', primary: '10' },
  {
    id: 'flour',
    name: 'Schär Mix B Bread flour',
    primary: '280 g',
    secondary: '12 tbsp',
  },
];

/** Uses the production drawer treatment for responsive and keyboard review. */
export function CookToolsExample({ className }: { className?: string }) {
  return (
    <>
      <Drawer swipeDirection="right">
        <DrawerTrigger
          render={<Button variant="outline" />}
          className={className}
        >
          Open ingredients
        </DrawerTrigger>
        <DrawerContent className={styles.ingredientsDrawer}>
          <DrawerHeader className={styles.drawerHeader}>
            <DrawerTitle>Ingredients · 2×</DrawerTitle>
            <DrawerClose className={styles.drawerClose} aria-label="Close">
              <X aria-hidden="true" size={20} />
            </DrawerClose>
          </DrawerHeader>
          <div className={styles.ingredientsDrawerBody}>
            <RecipeIngredientList items={exampleIngredients} />
          </div>
        </DrawerContent>
      </Drawer>
      <section
        className={styles.ingredientStrip}
        aria-label="Ingredients for this step"
      >
        <p>For this step</p>
        <RecipeIngredientList items={exampleIngredients} variant="compact" />
      </section>
    </>
  );
}
