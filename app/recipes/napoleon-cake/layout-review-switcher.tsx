'use client';

import { useEffect, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';

const options = [
  { value: 'original', label: 'Original', hint: 'Current scale' },
  { value: 'balanced', label: 'Balanced', hint: 'Softer reduction' },
  { value: 'compact', label: 'Compact', hint: 'Editorial density' },
  { value: 'practical', label: 'Practical', hint: 'Recommended' },
] as const;

type LayoutValue = (typeof options)[number]['value'];

export function LayoutReviewSwitcher() {
  const [value, setValue] = useState<LayoutValue>('practical');

  useEffect(() => {
    document.documentElement.dataset.recipeLayout = value;
    return () => {
      delete document.documentElement.dataset.recipeLayout;
    };
  }, [value]);

  return (
    <aside className="layout-review" aria-label="Compare recipe page density">
      <div className="layout-review__heading">
        <SlidersHorizontal aria-hidden="true" size={16} strokeWidth={1.7} />
        <div>
          <strong>Layout review</strong>
          <span>Compare first-screen density</span>
        </div>
      </div>
      <fieldset className="layout-review__tabs">
        <legend className="sr-only">Recipe page density</legend>
        {options.map((option) => (
          <button
            className="layout-review__option"
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            onClick={() => setValue(option.value)}
          >
            <strong>{option.label}</strong>
            <span>{option.hint}</span>
          </button>
        ))}
      </fieldset>
    </aside>
  );
}
