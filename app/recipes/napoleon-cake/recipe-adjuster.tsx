'use client';

import { useMemo, useState } from 'react';
import { Calculator, Check, ChevronDown, Info, RotateCcw, ShoppingBag } from 'lucide-react';
import { AssistantTrigger } from './recipe-assistant';
import styles from './recipe.module.css';

type Mode = 'original' | 'scale' | 'ingredient';
type Ingredient = {
  name: string;
  value?: number;
  range?: [number, number];
  unit: string;
  note?: string;
  egg?: boolean;
};

const ingredients: Ingredient[] = [
  { value: 450, unit: 'g', name: 'Schär Mix B Bread flour mix' },
  { value: 80, unit: 'g', name: 'Tapioca starch' },
  { value: 40, unit: 'g', name: 'Corn starch' },
  { value: 3, unit: 'g', name: 'Xanthan gum', note: 'Only if the flour mix does not contain it' },
  { value: 8, unit: 'g', name: 'Baking powder' },
  { value: 0.25, unit: 'tsp', name: 'Salt' },
  { value: 1, unit: 'tbsp', name: 'Sugar' },
  { value: 120, unit: 'g', name: 'Butter', note: 'Cold, cut into cubes' },
  { value: 50, unit: 'g', name: 'Sunflower oil' },
  { value: 250, unit: 'g', name: 'Sour cream or thick natural yogurt', note: 'Choose one · final default pending' },
  { value: 2, unit: '', name: 'Eggs', egg: true },
  { value: 1, unit: 'tbsp', name: 'Lemon juice' },
  { range: [30, 70], unit: 'ml', name: 'Cold water', note: 'As needed' },
];

function pretty(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(value < 2 ? 2 : 1).replace(/0+$/, '').replace(/\.$/, '');
}

function amountFor(item: Ingredient, factor: number) {
  if (item.egg && item.value) {
    const count = item.value * factor;
    if (Math.abs(count - Math.round(count)) < 0.04) return String(Math.round(count));
    return `${Math.round(100 * factor)} g`;
  }
  if (item.range) return `${Math.round(item.range[0] * factor)}–${Math.round(item.range[1] * factor)} ${item.unit}`;
  return `${pretty((item.value ?? 0) * factor)} ${item.unit}`.trim();
}

export function RecipeAdjuster() {
  const [mode, setMode] = useState<Mode>('original');
  const [scale, setScale] = useState(0.5);
  const [available, setAvailable] = useState(200);
  const [form, setForm] = useState<'28' | '24'>('28');

  const factor = mode === 'scale' ? scale : mode === 'ingredient' ? Math.max(1, available) / 450 : form === '24' ? (24 / 28) ** 2 : 1;
  const isExactBase = mode === 'original' && form === '28';
  const status = useMemo(() => {
    if (isExactBase) return 'Exact tested base';
    if (mode === 'ingredient') return `Calculated from ${available || 0} g flour mix`;
    if (mode === 'scale') return `Calculated · ${pretty(scale)}× batch`;
    return 'Calculated for a 24 cm form';
  }, [available, isExactBase, mode, scale]);

  return (
    <section className={styles.planning}>
      <aside className={styles.controls} aria-label="Recipe adjustment">
        <div className={styles.adjustHeading}>
          <div><p className={styles.eyebrow}>Your bake</p><h2>Adjust the recipe</h2></div>
          {!isExactBase && <button type="button" aria-label="Reset to tested original" onClick={() => { setMode('original'); setForm('28'); }}><RotateCcw size={15} /></button>}
        </div>

        <div className={styles.adjustTabs} aria-label="Adjustment method">
          <button type="button" aria-pressed={mode === 'original'} onClick={() => setMode('original')}>Original</button>
          <button type="button" aria-pressed={mode === 'scale'} onClick={() => setMode('scale')}>Scale</button>
          <button type="button" aria-pressed={mode === 'ingredient'} onClick={() => setMode('ingredient')}>Use what I have</button>
        </div>

        {mode === 'original' && (
          <div className={styles.adjustPanel}>
            <p className={styles.controlLabel}>Baking form</p>
            <label className={styles.choice} aria-label="Use the repeatedly verified 28 centimetre form">
              <input type="radio" name="form" checked={form === '28'} onChange={() => setForm('28')} />
              <span><strong>28 cm · 2 cakes</strong><small><Check size={13} /> Repeatedly verified</small></span>
            </label>
            <label className={`${styles.choice} ${styles.choiceCalculated}`} aria-label="Calculate quantities for a 24 centimetre form">
              <input type="radio" name="form" checked={form === '24'} onChange={() => setForm('24')} />
              <span><strong>24 cm · 2 cakes</strong><small><Calculator size={13} /> Calculated</small></span>
            </label>
          </div>
        )}

        {mode === 'scale' && (
          <div className={styles.adjustPanel}>
            <p className={styles.controlLabel}>Batch size</p>
            <div className={styles.scaleOptions}>
              {[0.5, 1, 1.5, 2].map((value) => <button type="button" key={value} aria-pressed={scale === value} onClick={() => setScale(value)}>{pretty(value)}×</button>)}
            </div>
            <p className={styles.adjustResult}>{scale === 0.5 ? '1 cake · 6 layers' : `${pretty(scale * 2)} cakes · 6 layers each`}</p>
          </div>
        )}

        {mode === 'ingredient' && (
          <div className={styles.adjustPanel}>
            <label className={styles.controlLabel} htmlFor="anchor-ingredient">Base the recipe on</label>
            <select id="anchor-ingredient" className={styles.anchorSelect} defaultValue="flour"><option value="flour">Schär Mix B flour mix</option></select>
            <label className={styles.controlLabel} htmlFor="available-amount">Amount available</label>
            <div className={styles.amountInput}><input id="available-amount" type="number" min="50" max="900" step="10" value={available} onChange={(event) => setAvailable(Number(event.target.value))} /><span>g</span></div>
            <p className={styles.adjustResult}>This makes {Math.round(factor * 100)}% of the tested base.</p>
          </div>
        )}

        <div className={`${styles.calculatedNote} ${isExactBase ? styles.testedNote : ''}`}>
          {isExactBase ? <Check size={16} /> : <Calculator size={16} />}
          <p><strong>{isExactBase ? 'Baked as written.' : 'Original recipe tested.'}</strong>{isExactBase ? ' These are the repeatedly verified quantities.' : ' Quantities are calculated; this adjusted version has not been bake-tested.'}</p>
        </div>
        {!isExactBase && <p className={styles.cookModeNote}>Cook Mode will use these adjusted amounts and keep the Calculated status visible.</p>}
      </aside>

      <section className={styles.ingredients} aria-labelledby="ingredients-title">
        <div className={styles.sectionTitle}>
          <div><p className={styles.eyebrow}>{status}</p><h2 id="ingredients-title">Ingredients</h2></div>
          <button type="button"><ShoppingBag size={16} /> Add all</button>
        </div>
        <div className={styles.ingredientGroup}>
          <h3>Layers</h3>
          {ingredients.map((item, index) => (
            <div className={styles.ingredient} key={item.name}>
              <input id={`ingredient-${index}`} type="checkbox" />
              <span className={styles.amount}>{amountFor(item, factor)}</span>
              <span><label htmlFor={`ingredient-${index}`}>{item.name}</label>{item.egg && !Number.isInteger(item.value! * factor) && <small>Use weighed beaten egg for accuracy</small>}{item.name === 'Schär Mix B Bread flour mix' && <AssistantTrigger scope="flour" label="Can I use another mix?" compact />}{item.note && <small>{item.note}</small>}</span>
            </div>
          ))}
        </div>
        <div className={styles.provisional}>
          <Info size={17} />
          <p><strong>One choice still needs confirmation.</strong> The source allows sour cream or thick natural yogurt, but does not yet identify the default or test scope of each.</p>
        </div>
        <div className={styles.collapsedGroups}>
          <button type="button"><span><small>9 ingredients</small>Custard</span><ChevronDown size={18} /></button>
          <button type="button"><span><small>2 ingredients</small>Nuts &amp; finish</span><ChevronDown size={18} /></button>
        </div>
      </section>
    </section>
  );
}
