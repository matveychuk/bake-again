'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { SectionTitle } from '@/components/foundations/section-title';
import { findScalingAnchor, scaleInventoryAmount } from '@/content/recipes/inventory-calculation';
import type { StructuredIngredient, StructuredRecipeContent } from '@/content/recipes/structured-inventory';
import styles from './inventory-recipe-adjuster.module.css';

type AdjusterRenderProps = {
  amountFor: (ingredient: StructuredIngredient) => string;
  scaleFactor: number;
};

export function InventoryRecipeAdjuster({
  recipe,
  children,
}: {
  recipe: StructuredRecipeContent | undefined;
  children: (props: AdjusterRenderProps) => ReactNode;
}) {
  const [mode, setMode] = useState<'scale' | 'ingredient'>('scale');
  const [scale, setScale] = useState(1);
  const ingredients = useMemo(() => recipe?.ingredientSections.flatMap((section) => section.ingredients) ?? [], [recipe]);
  const anchor = useMemo(() => findScalingAnchor(ingredients), [ingredients]);
  const [available, setAvailable] = useState(() => anchor?.amount.minimum ?? 0);
  const scaleFactor = mode === 'ingredient' && anchor && available > 0
    ? available / anchor.amount.minimum
    : scale;
  const isAdjustable = Boolean(recipe && anchor);

  return (
    <section className={styles.planning} id="adjust-recipe">
      <aside className={styles.controls}>
        <SectionTitle eyebrow="Calculated configuration" eyebrowClassName={styles.eyebrow}>Adjust recipe</SectionTitle>
        <p className={styles.intro}>Scale the verified base or calculate quantities from the flour you have. Form size appears only when the source defines it.</p>
        {isAdjustable && anchor ? (
          <>
            <div className={styles.modeTabs}>
              <button type="button" aria-pressed={mode === 'scale'} onClick={() => setMode('scale')}>Scale recipe</button>
              <button type="button" aria-pressed={mode === 'ingredient'} onClick={() => setMode('ingredient')}>Use what I have</button>
            </div>
            {mode === 'scale' ? (
              <div>
                <span className={styles.label}>Batch scale</span>
                <div className={styles.scales}>
                  {[0.5, 1, 1.5, 2].map((factor) => <button type="button" aria-pressed={scale === factor} key={factor} onClick={() => setScale(factor)}>{factor}×</button>)}
                </div>
              </div>
            ) : (
              <div>
                <label className={styles.label} htmlFor="available-flour">Available {anchor.ingredient.name}</label>
                <div className={styles.amountInput}>
                  <input id="available-flour" min="1" type="number" value={available || ''} onChange={(event) => setAvailable(Number(event.target.value))} />
                  <span>{anchor.amount.unit}</span>
                </div>
              </div>
            )}
            <p className={styles.result}><strong>Calculated:</strong> {Math.round(scaleFactor * 100) / 100}× the recorded base. Check eggs and other whole items manually when the result is fractional.</p>
          </>
        ) : (
          <div className={styles.locked}><strong>Quantities still needed</strong>This recipe does not yet have a numeric flour amount. Add the source quantities to unlock Scale and Use what I have.</div>
        )}
      </aside>
      <div className={styles.content}>
        {children({ amountFor: (ingredient) => scaleInventoryAmount(ingredient.amount, scaleFactor), scaleFactor })}
      </div>
    </section>
  );
}
