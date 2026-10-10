'use client';

import { useId, useRef, useState } from 'react';
import { Copy, Printer, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AppLocale } from '@/lib/i18n/config';
import { recipeUtilityCopy } from '@/content/recipes/utility-copy';
import styles from './recipe-utility-actions.module.css';

export function RecipeUtilityActions({
  locale,
  title,
  url,
  printHref,
}: {
  locale: AppLocale;
  title: string;
  url: string;
  printHref: string;
}) {
  const copy = recipeUtilityCopy[locale];
  const id = useId();
  const [showLink, setShowLink] = useState(false);
  const [status, setStatus] = useState('');
  const [sharing, setSharing] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  async function share() {
    if (sharing) return;
    setStatus('');
    if (typeof navigator.share === 'function') {
      setSharing(true);
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        // A user cancelling the native sheet needs no error or extra popup.
        if (error instanceof Error && error.name === 'AbortError') return;
      } finally {
        setSharing(false);
      }
    }
    input.current?.focus();
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setStatus(copy.copied);
    } catch {
      input.current?.focus();
      input.current?.select();
      setStatus(copy.manual);
    }
  }

  return (
    <div className={styles.root}>
      <div className={styles.actions}>
        <Button
          ref={trigger}
          variant="ghost"
          onClick={() => {
            setCanShare(typeof navigator.share === 'function');
            setShowLink(!showLink);
            setStatus('');
          }}
          aria-expanded={showLink}
          aria-controls={showLink ? id : undefined}
        >
          <Share2 size={16} aria-hidden="true" />
          {copy.share}
        </Button>
        <Button variant="ghost" href={printHref}>
          <Printer size={16} aria-hidden="true" />
          {copy.print}
        </Button>
      </div>
      {showLink && (
        <div className={styles.linkPanel} id={id}>
          <label htmlFor={`${id}-url`}>{copy.link}</label>
          <input
            id={`${id}-url`}
            ref={input}
            type="url"
            readOnly
            value={url}
            onFocus={(event) => event.currentTarget.select()}
          />
          <div className={styles.actions}>
            <Button variant="outline" onClick={copyLink}>
              <Copy size={16} aria-hidden="true" />
              {copy.copy}
            </Button>
            {canShare && (
              <Button variant="outline" onClick={share} disabled={sharing}>
                <Share2 size={16} aria-hidden="true" />
                {copy.shareDevice}
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={() => {
                setShowLink(false);
                setStatus('');
                trigger.current?.focus();
              }}
            >
              {copy.close}
            </Button>
          </div>
          <output>{status}</output>
        </div>
      )}
    </div>
  );
}

export function RecipePrintButton({ locale }: { locale: AppLocale }) {
  return (
    <Button onClick={() => window.print()}>
      <Printer size={16} aria-hidden="true" />
      {recipeUtilityCopy[locale].printNow}
    </Button>
  );
}
