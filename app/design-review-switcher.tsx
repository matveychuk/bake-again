'use client';

import { useEffect, useState } from 'react';
import { Palette } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const options = [
  { value: 'original', label: 'Original', swatches: ['#FAF6EF', '#E9D9BD', '#2B1D18'] },
  { value: 'soft-balance', label: 'Soft balance', swatches: ['#F3ECE3', '#F8F3EC', '#5A4137'] },
  { value: 'terracotta-led', label: 'Terracotta', swatches: ['#F6EFE6', '#E8D7C2', '#9A4B34'] },
] as const;

type PaletteValue = (typeof options)[number]['value'];

export function DesignReviewSwitcher() {
  const [value, setValue] = useState<PaletteValue>('original');

  useEffect(() => {
    document.documentElement.dataset.palette = value;
  }, [value]);

  return (
    <aside className="design-review" aria-label="Compare visual directions">
      <div className="design-review__heading">
        <Palette aria-hidden="true" size={16} strokeWidth={1.7} />
        <div>
          <strong>Design review</strong>
          <span>Compare colour balance</span>
        </div>
      </div>

      <Tabs
        value={value}
        onValueChange={(nextValue) => setValue(nextValue as PaletteValue)}
      >
        <TabsList aria-label="Colour direction" className="design-review__tabs">
          {options.map((option) => (
            <TabsTrigger key={option.value} value={option.value}>
              <span className="palette-swatches" aria-hidden="true">
                {option.swatches.map((colour) => (
                  <i key={colour} style={{ background: colour }} />
                ))}
              </span>
              {option.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </aside>
  );
}
