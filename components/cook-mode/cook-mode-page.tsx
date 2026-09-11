'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { ArrowLeft, CircleAlert } from 'lucide-react';
import { AssistantProvider } from '@/components/assistant';
import { CookNavigation } from '@/app/recipes/napoleon-cake/cook/cook-navigation';
import { CookProgress } from '@/app/recipes/napoleon-cake/cook/cook-progress';
import { CookStep } from '@/app/recipes/napoleon-cake/cook/cook-step';
import styles from '@/app/recipes/napoleon-cake/cook/cook-mode.module.css';
import { getCookModeDefinition } from '@/content/recipes/cook-mode-registry';
import type { AppLocale } from '@/lib/i18n/config';
import { getUiMessages } from '@/lib/i18n/messages';

const subscribeToLocation = () => () => undefined;
const getLocationSearch = () => window.location.search;
const getServerLocationSearch = () => '';

/** Shared interactive Cook Mode; recipe data and configuration rules arrive via its definition. */
export function CookModePage({
  recipeSlug,
  homeHref = '/',
  detailHref,
  locale = 'en',
}: {
  recipeSlug: string;
  homeHref?: string;
  detailHref?: string;
  locale?: AppLocale;
}) {
  const messages = getUiMessages(locale).cook;
  const definition = getCookModeDefinition(recipeSlug);
  const resolvedDetailHref = detailHref ?? definition?.detailHref ?? '/recipes';
  const locationSearch = useSyncExternalStore(subscribeToLocation, getLocationSearch, getServerLocationSearch);
  const state = useMemo(() => definition?.getState(locationSearch) ?? ({
    isAdjusted: false,
    steps: [],
    unavailableReason: messages.unavailableRecord,
  }), [definition, locationSearch, messages.unavailableRecord]);
  const cookSteps = state.steps;
  const [stepIndex, setStepIndex] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const [timerRunning, setTimerRunning] = useState(false);
  const [remaining, setRemaining] = useState(cookSteps[0]?.timerSeconds ?? 0);
  const step = cookSteps[stepIndex];
  const progress = cookSteps.length > 0 && definition ? Math.round(((stepIndex + 1) / definition.totalSteps) * 100) : 0;
  const isComplete = completed.includes(stepIndex);

  useEffect(() => {
    if (!timerRunning || remaining <= 0) return;
    const interval = window.setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(interval);
  }, [timerRunning, remaining]);

  if (state.unavailableReason) {
    return (
      <main className={styles.page}>
        <header className={styles.header}>
          <Link href={resolvedDetailHref} className={styles.exit}><ArrowLeft size={17} /> {messages.backToRecipe}</Link>
          <Link href={homeHref} className={styles.wordmark}>Bake Again<span>.</span></Link>
          <p>{definition.recipeTitle}</p>
        </header>
        <section className={styles.unavailable} aria-labelledby="cook-mode-unavailable-title">
          <CircleAlert size={24} aria-hidden="true" />
          <p>{messages.unavailableKicker}</p>
          <h1 id="cook-mode-unavailable-title">{messages.unavailableTitle}</h1>
          <p>{state.unavailableReason}</p>
          <Link href={resolvedDetailHref}>{messages.unavailableLink}</Link>
        </section>
      </main>
    );
  }

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

  const page = (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href={resolvedDetailHref} className={styles.exit}><ArrowLeft size={17} /> {messages.exit}</Link>
        <Link href={homeHref} className={styles.wordmark}>Bake Again<span>.</span></Link>
        <p>{definition.recipeTitle}{state.isAdjusted ? ` · ${messages.adjustedStatus}` : ''}</p>
      </header>
      <div className={styles.progressTrack} aria-label={messages.progress(stepIndex + 1, definition.totalSteps)}><span style={{ width: `${progress}%` }} /></div>
      <div className={styles.shell}>
        <CookProgress steps={cookSteps} activeIndex={stepIndex} completed={completed} totalSteps={definition.totalSteps} onSelect={goToStep} />
        <CookStep step={step} stepIndex={stepIndex} totalSteps={definition.totalSteps} progress={progress} remaining={remaining} timerRunning={timerRunning} onToggleTimer={() => setTimerRunning((value) => !value)} onResetTimer={() => { setRemaining(step.timerSeconds ?? 0); setTimerRunning(false); }} assistant={definition.assistant && state.assistantConfiguration ? { configuration: state.assistantConfiguration, locale } : undefined} />
      </div>
      <CookNavigation isFirst={stepIndex === 0} isLast={stepIndex === cookSteps.length - 1} isComplete={isComplete} onPrevious={() => goToStep(stepIndex - 1)} onNext={() => goToStep(stepIndex + 1)} onToggleComplete={toggleComplete} />
    </main>
  );

  return definition.assistant ? (
    <AssistantProvider
      recipeId={definition.assistant.recipeId}
      recipeVersionId={definition.assistant.recipeVersionId}
      recipeTitle={definition.recipeTitle}
      locale={locale}
      surface="cook-mode"
    >
      {page}
    </AssistantProvider>
  ) : page;
}
