import { Clock3, Pause, Play, RotateCcw } from 'lucide-react';
import styles from './cook-mode.module.css';

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const rest = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${rest}`;
}

type CookTimerProps = {
  remaining: number;
  running: boolean;
  onToggle: () => void;
  onReset: () => void;
};

export function CookTimer({ remaining, running, onToggle, onReset }: CookTimerProps) {
  return (
    <section className={styles.timer} aria-label="Step timer">
      <div><Clock3 size={20} /><span><small>Optional timer</small><strong>{formatTime(remaining)}</strong></span></div>
      <div>
        <button type="button" onClick={onToggle}>{running ? <Pause size={16} /> : <Play size={16} fill="currentColor" />}{running ? 'Pause' : 'Start'}</button>
        <button type="button" aria-label="Reset timer" onClick={onReset}><RotateCcw size={16} /></button>
      </div>
    </section>
  );
}
