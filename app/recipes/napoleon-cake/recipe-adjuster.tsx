'use client';

import { useMemo } from 'react';
import { Calculator, Check, ChevronDown, Info, RotateCcw } from 'lucide-react';
import { NapoleonIngredientsControl } from '@/components/recipe/add-recipe-ingredients-control';
import { RecipeIngredientHeading } from '@/components/recipe/recipe-ingredient-heading';
import { RecipeIngredientList } from '@/components/recipe/recipe-ingredient-list';
import { glutenFreeNapoleonRecipe } from '@/content/recipes/gluten-free-napoleon.recipe';
import { formatQuantity } from '@/content/recipes/napoleon-configuration';
import type { BatchScaleFactor, IngredientSection, RecipeDraft } from '@/content/recipes/recipe.types';
import type { AppLocale } from '@/lib/i18n/config';
import { AssistantTrigger } from './recipe-assistant';
import { useRecipeConfiguration } from './recipe-configuration';
import styles from './recipe.module.css';

const recipe: RecipeDraft = glutenFreeNapoleonRecipe;

function getLayersSection(): IngredientSection {
  const section = recipe.ingredientSections.find((item) => item.id === 'layers');
  if (!section) throw new Error('Napoleon layers ingredient section is missing');
  return section;
}

const layers = getLayersSection();

function pretty(value: number) {
  return Number.isInteger(value)
    ? String(value)
    : value.toFixed(value < 2 ? 2 : 1).replace(/0+$/, '').replace(/\.$/, '');
}

function sentenceCase(value: string) {
  return value ? value[0].toUpperCase() + value.slice(1) : value;
}

export function RecipeAdjuster({ locale }: { locale: AppLocale }) {
  const {
    quantityMode,
    setQuantityMode,
    scale,
    setScale,
    available,
    setAvailable,
    form,
    setForm,
    result,
    isExactBase,
    reset,
  } = useRecipeConfiguration();

  const amounts = useMemo(
    () => new Map(result.ingredientAmounts.map((item) => [item.ingredientLineId, item])),
    [result],
  );
  const status = useMemo(() => {
    if (isExactBase) return 'Exact tested base';
    const size = form === '24' ? '24 cm' : '28 cm';
    if (quantityMode === 'ingredient') {
      return `Calculated · ${size} · from ${available || 0} g flour mix`;
    }
    return `Calculated · ${size} · ${pretty(scale)}× batch`;
  }, [available, form, isExactBase, quantityMode, scale]);

  return (
    <section className={styles.planning} id="adjust-recipe">
      <aside className={styles.controls} aria-label="Recipe adjustment">
        <div className={styles.adjustHeading}>
          <div><p className={styles.eyebrow}>Your bake</p><h2>Adjust recipe</h2></div>
          {!isExactBase && <button type="button" aria-label="Reset to tested original" onClick={reset}><RotateCcw size={14} /><span>Reset</span></button>}
        </div>

        <fieldset className={styles.adjustSection}>
          <legend className={styles.controlLabel}>Layer size</legend>
          <label className={styles.choice} aria-label="Use the repeatedly verified 28 centimetre layer size">
            <input type="radio" name="form" checked={form === '28'} onChange={() => setForm('28')} />
            <span><strong>28 cm layers</strong><small><Check size={13} /> Tested base</small></span>
          </label>
          <label className={`${styles.choice} ${styles.choiceCalculated}`} aria-label="Calculate quantities for 24 centimetre layers">
            <input type="radio" name="form" checked={form === '24'} onChange={() => setForm('24')} />
            <span><strong>24 cm layers</strong><small><Calculator size={13} /> Calculated</small></span>
          </label>
        </fieldset>

        <div className={styles.quantityHeading}>
          <p className={styles.controlLabel}>Adjust amount</p>
          <span>Choose one</span>
        </div>

        <div className={styles.adjustTabs} aria-label="Amount adjustment method">
          <button type="button" aria-pressed={quantityMode === 'scale'} onClick={() => setQuantityMode('scale')}>Scale</button>
          <button type="button" aria-pressed={quantityMode === 'ingredient'} onClick={() => setQuantityMode('ingredient')}>Use what I have</button>
        </div>

        {quantityMode === 'scale' && (
          <div className={styles.adjustPanel}>
            <p className={styles.controlLabel}>Batch size</p>
            <div className={styles.scaleOptions}>
              {([0.5, 1, 1.5, 2] satisfies BatchScaleFactor[]).map((value) => (
                <button type="button" key={value} aria-pressed={scale === value} onClick={() => setScale(value)}>{pretty(value)}×</button>
              ))}
            </div>
            <p className={styles.adjustResult}>{scale === 0.5 ? '1 cake' : `${pretty(scale * 2)} cakes`} · 6 layers each · {form} cm</p>
          </div>
        )}

        {quantityMode === 'ingredient' && (
          <div className={styles.adjustPanel}>
            <label className={styles.controlLabel} htmlFor="anchor-ingredient">Base the recipe on</label>
            <select id="anchor-ingredient" className={styles.anchorSelect} defaultValue="flour"><option value="flour">Schär Mix B flour mix</option></select>
            <label className={styles.controlLabel} htmlFor="available-amount">Amount available</label>
            <div className={styles.amountInput}><input id="available-amount" type="number" min="100" max="900" step="10" value={available} onChange={(event) => setAvailable(Number(event.target.value))} /><span>g</span></div>
            <p className={styles.adjustResult}>This makes {Math.round(result.batchScaleFactor * 100)}% of the {form} cm batch.</p>
          </div>
        )}

        <div className={`${styles.calculatedNote} ${isExactBase ? styles.testedNote : ''}`}>
          {isExactBase ? <Check size={16} /> : <Calculator size={16} />}
          <p><strong>{isExactBase ? 'Baked as written.' : 'Original recipe tested.'}</strong>{isExactBase ? ' These are the repeatedly verified quantities.' : ' Quantities are calculated; this adjusted version has not been bake-tested.'}</p>
        </div>
        {!isExactBase && (
          <p className={styles.cookModeNote} aria-live="polite">
            {result.cookMode.eligible
              ? 'Cook Mode will use these adjusted amounts and keep the Calculated status visible.'
              : 'Cook Mode is unavailable until the calculated quantities and timing are resolved.'}
          </p>
        )}
      </aside>

      <section className={styles.ingredients} aria-labelledby="ingredients-title">
        <RecipeIngredientHeading
          action={<NapoleonIngredientsControl locale={locale} recipe={recipe} />}
          eyebrow={status}
          title="Ingredients"
        />
        <div className={styles.ingredientGroup}>
          <h3>{layers.title.en}</h3>
          <RecipeIngredientList
            items={layers.lines.map((line) => {
              const calculated = amounts.get(line.id);
              return {
                id: line.id,
                name: sentenceCase(
                  line.options.map((option) => option.name.en).join(' or '),
                ),
                primary: formatQuantity(
                  calculated?.amount ?? line.quantity.base,
                ),
                notes: [
                  calculated?.requiresResolution
                    ? 'Resolve this quantity before Cook Mode'
                    : null,
                  line.choose ? 'Choose one · final default pending' : null,
                  line.condition?.en,
                  line.preparation?.en,
                  line.qualifier?.en,
                ]
                  .filter((note): note is string => Boolean(note))
                  .map(sentenceCase),
                after:
                  line.id === 'schar-mix-b' ? (
                    <AssistantTrigger scope="flour" locale={locale} compact />
                  ) : undefined,
              };
            })}
          />
        </div>
        <div className={styles.provisional}>
          <Info size={17} />
          <p><strong>One choice still needs confirmation.</strong> The source allows sour cream or thick natural yogurt, but does not yet identify the default or test scope of each.</p>
        </div>
        <div className={styles.collapsedGroups}>
          {recipe.ingredientSections.filter((section) => section.id !== 'layers').map((section) => (
            <button type="button" key={section.id}><span><small>{section.lines.length} ingredients</small>{section.id === 'assembly' ? 'Nuts & finish' : 'Custard'}</span><ChevronDown size={18} /></button>
          ))}
        </div>
      </section>
    </section>
  );
}
