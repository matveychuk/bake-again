'use client';

import { useId } from 'react';
import { formatDuration, formatElapsedMinutes } from '@/lib/i18n/format';
import { Button } from '@/components/ui/button';
import { Clock3, Pause, Play, RotateCcw } from 'lucide-react';
import type { AppLocale } from '@/lib/i18n/config';
import { getUiMessages } from '@/lib/i18n/messages';
import styles from './cook-mode.module.css';

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const rest = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${rest}`;
}

type CookTimerProps = {
  remaining: number;
  running: boolean;
  options: number[];
  selectedSeconds: number;
  optionLabels?: Record<number, string>;
  onSelectDuration: (seconds: number) => void;
  onToggle: () => void;
  onReset: () => void;
  locale: AppLocale;
};

export function CookTimer({
  remaining,
  running,
  options,
  selectedSeconds,
  optionLabels,
  onSelectDuration,
  onToggle,
  onReset,
  locale,
}: CookTimerProps) {
  const messages = getUiMessages(locale).cook;
  const phaseGroupName = useId();

  return (
    <section
      className={styles.timer}
      data-phased={optionLabels ? true : undefined}
      aria-label={messages.timerLabel}
    >
      <div>
        <Clock3 size={20} />
        <span>
          <small>{messages.optionalTimer}</small>
          <strong>{formatTime(remaining)}</strong>
        </span>
      </div>
      <div className={styles.timerActions}>
        {options.length > 1 && !optionLabels && (
          <label>
            <span className="sr-only">{messages.timerDuration}</span>
            <select
              aria-label={messages.timerDuration}
              disabled={running}
              value={selectedSeconds}
              onChange={(event) => onSelectDuration(Number(event.target.value))}
            >
              {options.map((seconds) => (
                <option key={seconds} value={seconds}>
                  {Math.round(seconds / 60)} {messages.minutesShort}
                </option>
              ))}
            </select>
          </label>
        )}
        <Button type="button" onClick={onToggle}>
          {running ? (
            <Pause size={16} />
          ) : (
            <Play size={16} fill="currentColor" />
          )}
          {running ? messages.pause : messages.start}
        </Button>
        <Button
          variant="outline"
          size="icon"
          type="button"
          aria-label={messages.resetTimer}
          onClick={onReset}
        >
          <RotateCcw size={16} />
        </Button>
      </div>
      {optionLabels && (
        <fieldset className={styles.timerPhases} disabled={running}>
          <legend>{messages.timerDuration}</legend>
          {options.map((seconds) => (
            <label key={seconds}>
              <input
                type="radio"
                name={phaseGroupName}
                value={seconds}
                checked={selectedSeconds === seconds}
                onChange={() => onSelectDuration(seconds)}
              />
              <span>
                {optionLabels[seconds]} ·{' '}
                {seconds < 60
                  ? formatDuration(locale, {
                      kind: 'exact',
                      value: seconds,
                      unit: 'second',
                    })
                  : formatElapsedMinutes(locale, seconds / 60)}
              </span>
            </label>
          ))}
        </fieldset>
      )}
    </section>
  );
}
