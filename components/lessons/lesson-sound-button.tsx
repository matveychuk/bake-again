'use client';

import { Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import styles from './lesson.module.css';

export function LessonSoundButton({
  onClick,
  preview = false,
}: {
  onClick?: () => void;
  preview?: boolean;
}) {
  return (
    <Button
      type="button"
      variant="secondary"
      className={styles.soundButton}
      onClick={onClick}
      disabled={preview}
    >
      <Volume2 size={20} aria-hidden="true" />
      Увімкнути звук
    </Button>
  );
}
