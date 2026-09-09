'use client';

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react';
import {
  calculateNapoleonConfiguration,
  encodeNapoleonConfiguration,
  napoleonBaseSelection,
  NAPOLEON_BASE_GEOMETRY_ID,
  NAPOLEON_PREVIEW_GEOMETRY_ID,
  type NapoleonConfigurationSelection,
} from '@/content/recipes/napoleon-configuration';
import type { BatchScaleFactor } from '@/content/recipes/recipe.types';

export type QuantityMode = 'scale' | 'ingredient';
export type FormSize = '28' | '24';

type RecipeConfigurationContextValue = {
  form: FormSize;
  setForm: (form: FormSize) => void;
  quantityMode: QuantityMode;
  setQuantityMode: (mode: QuantityMode) => void;
  scale: BatchScaleFactor;
  setScale: (scale: BatchScaleFactor) => void;
  available: number;
  setAvailable: (amount: number) => void;
  selection: NapoleonConfigurationSelection;
  result: ReturnType<typeof calculateNapoleonConfiguration>;
  isExactBase: boolean;
  cookModeHref: string | null;
  reset: () => void;
};

const RecipeConfigurationContext = createContext<RecipeConfigurationContextValue | null>(null);

export function RecipeConfigurationProvider({ children }: { children: ReactNode }) {
  const [form, setForm] = useState<FormSize>('28');
  const [quantityMode, setQuantityMode] = useState<QuantityMode>('scale');
  const [scale, setScale] = useState<BatchScaleFactor>(1);
  const [available, setAvailable] = useState(200);

  const selection = useMemo<NapoleonConfigurationSelection>(() => ({
    geometryId: form === '24' ? NAPOLEON_PREVIEW_GEOMETRY_ID : NAPOLEON_BASE_GEOMETRY_ID,
    quantityAdjustment: quantityMode === 'scale'
      ? { mode: 'batchScale', factor: scale }
      : {
          mode: 'useWhatIHave',
          anchorIngredientLineId: 'schar-mix-b',
          availableAmount: { value: Math.max(100, available || 100), unit: 'g' },
        },
  }), [available, form, quantityMode, scale]);

  const result = useMemo(() => calculateNapoleonConfiguration(selection), [selection]);
  const isExactBase = selection.geometryId === napoleonBaseSelection.geometryId
    && selection.quantityAdjustment.mode === 'batchScale'
    && selection.quantityAdjustment.factor === 1;
  const cookModeHref = result.cookMode.eligible
    ? isExactBase
      ? '/recipes/napoleon-cake/cook'
      : `/recipes/napoleon-cake/cook?${encodeNapoleonConfiguration(selection)}`
    : null;

  const reset = () => {
    setForm('28');
    setQuantityMode('scale');
    setScale(1);
    setAvailable(200);
  };

  return (
    <RecipeConfigurationContext.Provider value={{
      form,
      setForm,
      quantityMode,
      setQuantityMode,
      scale,
      setScale,
      available,
      setAvailable,
      selection,
      result,
      isExactBase,
      cookModeHref,
      reset,
    }}>
      {children}
    </RecipeConfigurationContext.Provider>
  );
}

export function useRecipeConfiguration() {
  const value = useContext(RecipeConfigurationContext);
  if (!value) throw new Error('useRecipeConfiguration must be used inside RecipeConfigurationProvider');
  return value;
}

type CookModeLinkProps = {
  className?: string;
  children: ReactNode;
};

export function CookModeLink({ className, children }: CookModeLinkProps) {
  const { cookModeHref } = useRecipeConfiguration();
  const handleBlocked = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!cookModeHref) {
      event.preventDefault();
      document.getElementById('adjust-recipe')?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <a
      className={className}
      href={cookModeHref ?? '#adjust-recipe'}
      aria-disabled={!cookModeHref || undefined}
      title={cookModeHref ? undefined : 'Resolve the calculated configuration before Cook Mode'}
      onClick={handleBlocked}
    >
      {children}
    </a>
  );
}
