'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { ProductBanner } from '@/content/commerce/product-banner';
import { Button } from '@/components/ui/button';
import { trackEvent } from '@/lib/analytics/umami';
import { EditorialInvitation } from './editorial-invitation';

/** Plays the short food loop only when visible and motion is welcome. */
function BannerLoop({ video }: { video: ProductBanner['video'] }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return element.pause();
      setLoad(true);
      void element.play().catch(() => undefined);
    });
    observer.observe(element);
    const stop = () => {
      if (motion.matches) element.pause();
    };
    motion.addEventListener('change', stop);
    return () => {
      observer.disconnect();
      motion.removeEventListener('change', stop);
    };
  }, []);

  return (
    <video
      ref={ref}
      poster={video.poster}
      width={360}
      height={450}
      muted
      loop
      playsInline
      preload="none"
      aria-label={video.label}
    >
      {load && <source src={video.mp4} type="video/mp4" />}
    </video>
  );
}

/** Recipe-page banner with direct checkout and two ways to preview the lesson. */
export function ProductBannerInvitation({
  banner,
  recipeId,
  preview = false,
}: {
  banner: ProductBanner;
  recipeId: string;
  preview?: boolean;
}) {
  const titleId = useId();
  const { buy, details, preview: freeStep } = banner.actions;

  return (
    <div data-theme="dark" data-product-banner={banner.id}>
      <EditorialInvitation
        variant="product-banner"
        lang={banner.locale}
        titleId={titleId}
        eyebrow={banner.eyebrow}
        title={banner.title}
        description={banner.description}
        note={banner.facts}
        image={<BannerLoop video={banner.video} />}
        action={
          <>
            {preview ? (
              <Button disabled>{buy.label}</Button>
            ) : (
              <Button
                href={buy.href}
                rel="noreferrer"
                onClick={() =>
                  trackEvent('product_banner_click', {
                    recipe_id: recipeId,
                    locale: banner.locale,
                  })
                }
              >
                {buy.label}
              </Button>
            )}
            <Button href={details.href} variant="outline">
              {details.label}
            </Button>
            <Button href={freeStep.href} variant="outline">
              {freeStep.label}
            </Button>
          </>
        }
      />
    </div>
  );
}
