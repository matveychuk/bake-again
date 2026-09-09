'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { ArrowLeft } from 'lucide-react';
import { CookAssistant } from '@/app/recipes/napoleon-cake/cook/cook-assistant';
import { CookNavigation } from '@/app/recipes/napoleon-cake/cook/cook-navigation';
import { CookProgress } from '@/app/recipes/napoleon-cake/cook/cook-progress';
import { CookStep } from '@/app/recipes/napoleon-cake/cook/cook-step';
import styles from '@/app/recipes/napoleon-cake/cook/cook-mode.module.css';
import type { CookModeDefinition } from './cook-mode.types';

const subscribeToLocation = () => () => undefined;
const getLocationSearch = () => window.location.search;
const getServerLocationSearch = () => '';

/** Shared interactive Cook Mode; recipe data and configuration rules arrive via its definition. */
export function CookModePage({ definition }: { definition: CookModeDefinition }) {
  const locationSearch = useSyncExternalStore(subscribeToLocation, getLocationSearch, getServerLocationSearch);
  const state = useMemo(() => definition.getState(locationSearch), [definition, locationSearch]);
  const cookSteps = state.steps;
  const [stepIndex, setStepIndex] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [remaining, setRemaining] = useState(cookSteps[0]?.timerSeconds ?? 0);
  const step = cookSteps[stepIndex];
  const progress = Math.round(((stepIndex + 1) / definition.totalSteps) * 100);
  const isComplete = completed.includes(stepIndex);

  useEffect(() => {
    if (!timerRunning || remaining <= 0) return;
    const interval = window.setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(interval);
  }, [timerRunning, remaining]);

  if (!step) return null;

  function goToStep(next: number) {
    const bounded = Math.max(0, Math.min(cookSteps.length - 1, next));
    setStepIndex(bounded);
    setRemaining(cookSteps[bounded].timerSeconds ?? 0);
    setTimerRunning(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function toggleComplete() {
    setCompleted((items) => isComplete ? items.filter((item) => item !== stepIndex) : [...items, stepIndex]);
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href={definition.detailHref} className={styles.exit}><ArrowLeft size={17} /> Exit Cook Mode</Link>
        <Link href="/" className={styles.wordmark}>Bake Again<span>.</span></Link>
        <p>{definition.recipeTitle}{state.isAdjusted ? ' · Calculated' : ''}</p>
      </header>
      <div className={styles.progressTrack} aria-label={`Step ${stepIndex + 1} of ${definition.totalSteps}`}><span style={{ width: `${progress}%` }} /></div>
      <div className={styles.shell}>
        <CookProgress steps={cookSteps} activeIndex={stepIndex} completed={completed} totalSteps={definition.totalSteps} onSelect={goToStep} />
        <CookStep step={step} stepIndex={stepIndex} totalSteps={definition.totalSteps} progress={progress} remaining={remaining} timerRunning={timerRunning} onToggleTimer={() => setTimerRunning((value) => !value)} onResetTimer={() => { setRemaining(step.timerSeconds ?? 0); setTimerRunning(false); }} onAsk={() => setAssistantOpen(true)} />
      </div>
      <CookNavigation isFirst={stepIndex === 0} isLast={stepIndex === cookSteps.length - 1} isComplete={isComplete} onPrevious={() => goToStep(stepIndex - 1)} onNext={() => goToStep(stepIndex + 1)} onToggleComplete={toggleComplete} />
      {assistantOpen && <CookAssistant stepTitle={step.title} onClose={() => setAssistantOpen(false)} />}
    </main>
  );
}
