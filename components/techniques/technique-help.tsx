'use client';

import { useId, useRef, useState } from 'react';
import { X } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerDescription,
} from '@/components/ui/drawer';
import {
  softenButter,
  softenButterPath,
} from '@/content/techniques/soften-butter';
import type { TechniqueReference } from '@/content/techniques/types';
import type { AppLocale } from '@/lib/i18n/config';
import { TechniqueGuide } from './technique-guide';
import styles from './technique.module.css';

export function TechniqueHelp({
  locale,
  reference,
}: {
  locale: AppLocale;
  reference: TechniqueReference;
}) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLAnchorElement>(null);
  const id = useId();
  const t = softenButter[locale];
  return (
    <>
      {reference.condition && t.conditions[reference.condition]}
      {t.prompt}{' '}
      <a
        ref={trigger}
        className={styles.helpLink}
        href={softenButterPath(locale)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={(event) => {
          if (
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
          )
            return;
          event.preventDefault();
          setOpen(true);
        }}
      >
        {t.link}
      </a>
      <Drawer open={open} onOpenChange={setOpen} swipeDirection="right">
        <DrawerContent id={id} className={styles.drawer} finalFocus={trigger}>
          <DrawerHeader className={styles.drawerHeader}>
            <DrawerTitle>{t.title}</DrawerTitle>
            <DrawerClose className={styles.close} aria-label={t.close}>
              <X size={20} aria-hidden="true" />
            </DrawerClose>
          </DrawerHeader>
          <div className={styles.drawerBody}>
            <DrawerDescription className={styles.intro}>
              {t.intro}
            </DrawerDescription>
            <TechniqueGuide locale={locale} compact />
            <a className={styles.pageLink} href={softenButterPath(locale)}>
              {t.fullPage}
            </a>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
