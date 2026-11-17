'use client';

import Image from 'next/image';
import { useEffect, useId, useRef, useState } from 'react';
import type { ProductBanner } from '@/content/commerce/product-banner';
import { Button } from '@/components/ui/button';
import { trackEvent } from '@/lib/analytics/umami';
import { EditorialInvitation } from './editorial-invitation';

/** Plays the short food loop only when visible and motion is welcome. */
function BannerLoop({ video }: { video: ProductBanner['video'] }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(false);
  const visible = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const observer = new IntersectionObserver(([entry]) => {
      visible.current = !!entry?.isIntersecting;
      if (!visible.current) return element.pause();
      setLoad(true);
      if (!motion.matches) void element.play().catch(() => undefined);
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
      controls
      onCanPlay={() => {
        if (
          visible.current &&
          !window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ) {
          void ref.current?.play().catch(() => undefined);
        }
      }}
      loop
      playsInline
      preload="none"
      aria-label={video.label}
    >
      {load && <source src={video.mp4} type="video/mp4" />}
    </video>
  );
}

/** Product banner with one purchase action and a free-preview link. */
export function ProductBannerInvitation({
  banner,
  recipeId,
  preview = false,
  compact = false,
  className,
  titleId: providedTitleId,
}: {
  banner: ProductBanner;
  recipeId: string;
  preview?: boolean;
  compact?: boolean;
  className?: string;
  titleId?: string;
}) {
  const generatedTitleId = useId();
  const titleId = providedTitleId ?? generatedTitleId;
  const { buy, preview: freeStep } = banner.actions;

  return (
    <div className={className} data-product-banner={banner.id}>
      <EditorialInvitation
        variant={compact ? 'product-banner-compact' : 'product-banner'}
        data-preview={preview || undefined}
        lang={banner.locale}
        titleId={titleId}
        eyebrow={banner.eyebrow}
        title={banner.title}
        description={banner.description}
        note={banner.facts}
        image={
          compact ? (
            <Image src={banner.video.poster} alt="" width={360} height={450} sizes="96px" />
          ) : (
            <BannerLoop video={banner.video} />
          )
        }
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
            <Button href={freeStep.href} variant="link">
              {freeStep.label}
            </Button>
          </>
        }
      />
    </div>
  );
}
