'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import Image from 'next/image';
import type { AppLocale } from '@/lib/i18n/config';
import type { NewsletterSignup } from '@/lib/newsletter/config';
import { Button } from '@/components/ui/button';
import { EditorialInvitation } from './editorial-invitation';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  NEWSLETTER_DELAY_MS,
  NEWSLETTER_PROMPT_KEY,
  newsletterPromptAllowed,
  newsletterQuietUntil,
} from '@/lib/newsletter/prompt-policy';
import styles from './newsletter-invitation.module.css';

const messages = {
  uk: {
    title: 'Наступний рецепт — вам на пошту',
    body: 'Нові рецепти без глютену й практичні підказки для домашньої випічки від Bake Again.',
    action: 'Отримувати рецепти',
    preview: 'Приклад дизайну. Підписка тут недоступна.',
    previewAction: 'Переглянути модалку',
    later: 'Не зараз',
    close: 'Закрити пропозицію підписки',
    image: 'Наполеон із золотистою крихтою поруч із чашкою чаю',
  },
  en: {
    title: 'Your next recipe, by email',
    body: 'New gluten-free recipes and practical tips for baking at home, from Bake Again.',
    action: 'Get new recipes',
    preview: 'Design preview. Signup is unavailable here.',
    previewAction: 'Preview invitation dialog',
    later: 'Not now',
    close: 'Close signup invitation',
    image: 'Napoleon cake with golden crumbs beside a cup of tea',
  },
  es: {
    title: 'Tu próxima receta, por correo',
    body: 'Nuevas recetas sin gluten y consejos prácticos para hornear en casa, de Bake Again.',
    action: 'Recibir recetas',
    preview: 'Vista previa del diseño. Aquí no puedes suscribirte.',
    previewAction: 'Ver ventana de suscripción',
    later: 'Ahora no',
    close: 'Cerrar invitación a suscribirme',
    image: 'Tarta Napoleón con migas doradas junto a una taza de té',
  },
};

function rememberInvitation(handoff = false) {
  try {
    const previous = Number(window.localStorage.getItem(NEWSLETTER_PROMPT_KEY));
    const until = newsletterQuietUntil(Date.now(), handoff);
    window.localStorage.setItem(
      NEWSLETTER_PROMPT_KEY,
      String(Math.max(Number.isFinite(previous) ? previous : 0, until)),
    );
    return true;
  } catch {
    /* Manual links keep working when browser storage is unavailable. */
    return false;
  }
}

/** No signup destination means an inert, manually opened Design Lab preview. */
export function NewsletterInvitation({
  locale,
  signup,
  autoPrompt = false,
}: {
  locale: AppLocale;
  signup?: NewsletterSignup;
  autoPrompt?: boolean;
}) {
  const copy = messages[locale];
  const titleId = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previewRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const consumed = useRef(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!autoPrompt || !signup) return;
    try {
      if (
        !newsletterPromptAllowed(
          window.localStorage.getItem(NEWSLETTER_PROMPT_KEY),
          Date.now(),
        )
      )
        return;
    } catch {
      return;
    }

    let activeMs = 0;
    let lastTick = performance.now();
    let lastInteraction = performance.now();
    let reachedRecipes = false;
    const recipes = document.getElementById('recipes');
    const section = sectionRef.current;
    if (!recipes || !section) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        if (entry.target === recipes) reachedRecipes = true;
        // A reader who has already seen the inline invitation needs no interruption.
        if (entry.target === section) consumed.current = true;
      }
    });
    observer.observe(recipes);
    observer.observe(section);
    const interact = () => {
      lastInteraction = performance.now();
    };
    const visibility = () => {
      lastTick = performance.now();
    };
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('scroll', interact, { passive: true });
    window.addEventListener('pointerdown', interact);
    window.addEventListener('keydown', interact);
    const timer = window.setInterval(() => {
      const now = performance.now();
      const delta = now - lastTick;
      lastTick = now;
      if (document.visibilityState !== 'visible' || !document.hasFocus())
        return;
      activeMs += Math.min(delta, 1000);
      if (
        consumed.current ||
        activeMs < NEWSLETTER_DELAY_MS ||
        !reachedRecipes ||
        now - lastInteraction < 3000
      )
        return;
      if (
        document.querySelector(
          '[role="dialog"], [role="alertdialog"], [role="menu"], [role="listbox"]',
        )
      )
        return;
      if (
        document.activeElement?.closest(
          'input, textarea, select, button, a, [contenteditable="true"]',
        )
      )
        return;
      try {
        if (
          !newsletterPromptAllowed(
            window.localStorage.getItem(NEWSLETTER_PROMPT_KEY),
            Date.now(),
          )
        )
          return;
      } catch {
        return;
      }
      returnFocusRef.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      consumed.current = true;
      if (!rememberInvitation()) return;
      setOpen(true);
    }, 1000);
    return () => {
      observer.disconnect();
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('scroll', interact);
      window.removeEventListener('pointerdown', interact);
      window.removeEventListener('keydown', interact);
    };
  }, [autoPrompt, signup]);

  const handoff = () => {
    consumed.current = true;
    rememberInvitation(true);
  };

  return (
    <>
      <EditorialInvitation
        ref={sectionRef}
        lang={locale}
        titleId={titleId}
        title={copy.title}
        description={copy.body}
        note={!signup ? copy.preview : undefined}
        data-newsletter-invitation
        action={
          <>
            {' '}
            {signup ? (
              <Button href={signup.url} rel="noreferrer" onClick={handoff}>
                {copy.action}
                <ArrowRight size={16} aria-hidden="true" />
              </Button>
            ) : (
              <>
                <Button disabled>
                  {copy.action}
                  <ArrowRight size={16} aria-hidden="true" />
                </Button>
                <Button
                  ref={previewRef}
                  variant="link"
                  onClick={() => setOpen(true)}
                >
                  {copy.previewAction}
                </Button>
              </>
            )}
          </>
        }
      />
      <Dialog
        open={open}
        onOpenChange={(value) => {
          if (!value && signup) rememberInvitation();
          setOpen(value);
        }}
      >
        <DialogContent
          className={styles.dialog}
          showCloseButton={false}
          initialFocus={closeRef}
          finalFocus={signup ? returnFocusRef : previewRef}
          lang={locale}
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
                  aria-label={copy.close}
                />
              }
            >
              <X size={20} aria-hidden="true" />
            </DialogClose>
          </div>
          <Image
            className={styles.photo}
            src="/media/recipes/gluten-free-napoleon/author-custard-2026-10-04/hero-tea-editorial-v2.webp"
            width={720}
            height={400}
            sizes="(max-width: 620px) 90vw, 480px"
            alt={copy.image}
          />
          <div className={styles.dialogBody}>
            <DialogTitle className={styles.title}>{copy.title}</DialogTitle>
            <DialogDescription className={styles.description}>
              {copy.body}
            </DialogDescription>
            {!signup && <p className={styles.note}>{copy.preview}</p>}
            <div className={styles.dialogActions}>
              {signup ? (
                <Button href={signup.url} rel="noreferrer" onClick={handoff}>
                  {copy.action}
                  <ArrowRight size={16} aria-hidden="true" />
                </Button>
              ) : (
                <Button disabled>{copy.action}</Button>
              )}
              <DialogClose render={<Button variant="ghost" />}>
                {copy.later}
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
