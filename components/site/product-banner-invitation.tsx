'use client';

import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { X } from 'lucide-react';
import type { NewsletterSignup } from '@/lib/newsletter/config';
import type { ProductBanner } from '@/content/commerce/product-banner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { trackEvent } from '@/lib/analytics/umami';
import { EditorialInvitation } from './editorial-invitation';
import { NewsletterForm } from './newsletter-form';
import styles from './newsletter-invitation.module.css';

const SUBSCRIBED_KEY = 'ba_subscribed';

function readSubscribed() {
  try {
    return window.localStorage.getItem(SUBSCRIBED_KEY) === '1';
  } catch {
    /* Without storage the banner simply stays visible. */
    return false;
  }
}
const subscribe = (change: () => void) => {
  window.addEventListener('storage', change);
  return () => window.removeEventListener('storage', change);
};

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

/** Recipe-page banner for the current product; signup opens only on click. */
export function ProductBannerInvitation({
  banner,
  recipeId,
  signup,
}: {
  banner: ProductBanner;
  recipeId: string;
  signup: NewsletterSignup | null;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const actionRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [closedAfterSignup, setClosedAfterSignup] = useState(false);
  const subscribed = useSyncExternalStore(
    subscribe,
    readSubscribed,
    () => false,
  );

  if ((subscribed && !open) || closedAfterSignup) return null;

  return (
    <div data-theme="dark" data-product-banner={banner.id}>
      <EditorialInvitation
        variant="product-banner"
        lang={banner.locale}
        titleId={titleId}
        eyebrow={banner.eyebrow}
        title={
          banner.titleAccent ? (
            <>
              {banner.title} <em>{banner.titleAccent}</em>
            </>
          ) : (
            banner.title
          )
        }
        description={banner.description}
        image={<BannerLoop video={banner.video} />}
        action={
          <Button
            ref={actionRef}
            onClick={() => {
              trackEvent('product_banner_click', {
                recipe_id: recipeId,
                locale: banner.locale,
              });
              setOpen(true);
            }}
          >
            {banner.action}
          </Button>
        }
      />
      <Dialog
        open={open}
        onOpenChange={(value) => {
          setOpen(value);
          if (!value && sent) setClosedAfterSignup(true);
        }}
      >
        <DialogContent
          className={styles.dialog}
          showCloseButton={false}
          initialFocus={closeRef}
          finalFocus={actionRef}
          lang={banner.locale}
        >
          <div className={styles.dialogHeader}>
            <span className={styles.signature}>
              Bake Again<span>.</span>
            </span>
            <DialogClose
              render={
                <Button
                  ref={closeRef}
                  variant="ghost"
                  size="icon"
                  aria-label={banner.close}
                />
              }
            >
              <X size={20} aria-hidden="true" />
            </DialogClose>
          </div>
          <div className={styles.dialogBody}>
            <p className={styles.note}>{banner.eyebrow}</p>
            <DialogTitle className={styles.title}>
              {banner.dialog.title}
            </DialogTitle>
            <DialogDescription className={styles.description}>
              {banner.dialog.description}
            </DialogDescription>
            <div className={styles.dialogForm}>
              {signup ? (
                <NewsletterForm
                  signup={signup}
                  locale={banner.locale}
                  note={banner.dialog.note}
                  onSent={() => {
                    setSent(true);
                    try {
                      window.localStorage.setItem(SUBSCRIBED_KEY, '1');
                    } catch {
                      /* The banner returns on the next visit; signup still succeeded. */
                    }
                  }}
                />
              ) : (
                <NewsletterForm
                  preview
                  locale={banner.locale}
                  note={banner.dialog.note}
                />
              )}
            </div>
            <div className={styles.dialogActions}>
              <DialogClose render={<Button variant="ghost" />}>
                {sent ? banner.close : banner.later}
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
