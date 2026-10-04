'use client';

import { useEffect, useState } from 'react';
import { CookTimer } from '@/app/recipes/napoleon-cake/cook/cook-timer';
import type { AppLocale } from '@/lib/i18n/config';
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
import { CookProgress } from '@/app/recipes/napoleon-cake/cook/cook-progress';
import { CookWakeLock } from '@/app/recipes/napoleon-cake/cook/cook-wake-lock';
import type { CookStep } from './cook-mode.types';
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

const exampleSteps: CookStep[] = [
  {
    stepIds: ['mix-dry-dough'],
    number: '01',
    meta: '',
    title: 'Mix the dry ingredients',
    instructions: [],
    ingredients: [],
  },
  {
    stepIds: ['cut-in-butter'],
    number: '02',
    meta: '',
    title: 'Cut in the cold butter',
    instructions: [],
    ingredients: [],
  },
  {
    stepIds: ['mix-wet-dough'],
    number: '03',
    meta: '',
    title: 'Mix the wet ingredients',
    instructions: [],
    ingredients: [],
  },
];

/** Uses the production drawer treatment for responsive and keyboard review. */
export function CookToolsExample({ className }: { className?: string }) {
  const [activeIndex, setActiveIndex] = useState(0);

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
            <RecipeIngredientList
              items={exampleIngredients}
              sections={[
                { id: 'batter', title: 'Batter', items: exampleIngredients },
                {
                  id: 'finish',
                  title: 'For the pan',
                  items: [{ id: 'oil', name: 'Oil', note: 'For greasing.' }],
                },
              ]}
            />
          </div>
        </DrawerContent>
      </Drawer>
      <Drawer swipeDirection="right">
        <DrawerTrigger
          render={<Button variant="outline" />}
          className={className}
        >
          Open all steps
        </DrawerTrigger>
        <DrawerContent className={styles.stepsDrawer}>
          <DrawerHeader className={styles.drawerHeader}>
            <DrawerTitle>All steps</DrawerTitle>
            <DrawerClose className={styles.drawerClose} aria-label="Close">
              <X aria-hidden="true" size={20} />
            </DrawerClose>
          </DrawerHeader>
          <CookProgress
            activeIndex={activeIndex}
            completed={[]}
            locale="en"
            onSelect={setActiveIndex}
            steps={exampleSteps}
            totalSteps={exampleSteps.length}
            variant="drawer"
          />
        </DrawerContent>
      </Drawer>
      <section
        className={styles.ingredientStrip}
        aria-label="Ingredients for this step"
      >
        <p>For this step</p>
        <RecipeIngredientList items={exampleIngredients} variant="compact" />
      </section>
      <CookWakeLock locale="en" />
    </>
  );
}

/** Real timer control, with isolated example state and no saved cooking progress. */
export function CookTimerExample({
  locale,
  step,
}: {
  locale: AppLocale;
  step: CookStep;
}) {
  const [selected, setSelected] = useState(step.timerSeconds ?? 0);
  const [remaining, setRemaining] = useState(selected);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const interval = window.setInterval(
      () => setRemaining((value) => Math.max(0, value - 1)),
      1000,
    );
    return () => window.clearInterval(interval);
  }, [running]);
  return (
    <CookTimer
      locale={locale}
      remaining={remaining}
      running={running && remaining > 0}
      options={step.timerOptionsSeconds ?? []}
      optionLabels={step.timerOptionLabels}
      selectedSeconds={selected}
      onSelectDuration={(seconds) => {
        setSelected(seconds);
        setRemaining(seconds);
        setRunning(false);
      }}
      onToggle={() => {
        if (!remaining) setRemaining(selected);
        setRunning((value) => !value);
      }}
      onReset={() => {
        setRemaining(selected);
        setRunning(false);
      }}
    />
  );
}
