'use client';

/* oxlint-disable react-compiler/react-compiler -- Restore the versioned browser session once after hydration. */

import Link from 'next/link';
import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { ArrowLeft, CircleAlert } from 'lucide-react';
import { AssistantProvider } from '@/components/assistant';
import { RecipeIngredientList } from '@/components/recipe/recipe-ingredient-list';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { CookCompletion } from '@/app/recipes/napoleon-cake/cook/cook-completion';
import { CookNavigation } from '@/app/recipes/napoleon-cake/cook/cook-navigation';
import { CookProgress } from '@/app/recipes/napoleon-cake/cook/cook-progress';
import { CookStep } from '@/app/recipes/napoleon-cake/cook/cook-step';
import { CookWakeLock } from '@/app/recipes/napoleon-cake/cook/cook-wake-lock';
import styles from '@/app/recipes/napoleon-cake/cook/cook-mode.module.css';
import { getCookModeDefinition } from '@/content/recipes/cook-mode-registry';
import type { AppLocale } from '@/lib/i18n/config';
import { getUiMessages } from '@/lib/i18n/messages';
import {
  persistCookModeSession,
  readCookModeSession,
  type CookTimerState,
} from '@/lib/persistence/cook-mode';

const subscribeToLocation = () => () => undefined;
const getLocationSearch = () => window.location.search;
const getServerLocationSearch = () => '';

function timerRemaining(timer: CookTimerState | null) {
  if (!timer) return 0;
  if (!timer.endAt) return timer.remainingSeconds;
  return Math.max(
    0,
    Math.ceil((Date.parse(timer.endAt) - Date.now()) / 1000),
  );
}

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
  const definition = useMemo(
    () => getCookModeDefinition(recipeSlug, locale),
    [locale, recipeSlug],
  );
  const resolvedDetailHref = detailHref ?? definition?.detailHref ?? '/recipes';
  const locationSearch = useSyncExternalStore(
    subscribeToLocation,
    getLocationSearch,
    getServerLocationSearch,
  );
  const state = useMemo(
    () =>
      definition?.getState(locationSearch) ?? {
        isAdjusted: false,
        steps: [],
        allIngredients: [],
        unavailableReason: messages.unavailableRecord,
      },
    [definition, locationSearch, messages.unavailableRecord],
  );
  const cookSteps = state.steps;
  const allStepIds = useMemo(
    () => cookSteps.flatMap((cookStep) => cookStep.stepIds),
    [cookSteps],
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [completedStepIds, setCompletedStepIds] = useState<string[]>([]);
  const [timer, setTimer] = useState<CookTimerState | null>(null);
  const [completedAt, setCompletedAt] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [sessionReady, setSessionReady] = useState(false);
  const [stepsOpen, setStepsOpen] = useState(false);
  const [ingredientsOpen, setIngredientsOpen] = useState(false);
  const [, setClockTick] = useState(0);
  const step = cookSteps[stepIndex];
  const isComplete = Boolean(
    step?.stepIds.every((stepId) => completedStepIds.includes(stepId)),
  );
  const completedScreenCount = cookSteps.filter((candidate) =>
    candidate.stepIds.every((stepId) => completedStepIds.includes(stepId)),
  ).length;
  const completionProgress =
    cookSteps.length > 0
      ? Math.round((completedScreenCount / cookSteps.length) * 100)
      : 0;
  const timerStepId = step?.stepIds.at(-1) ?? '';
  const currentTimer = timer?.stepId === timerStepId ? timer : null;
  const selectedTimerSeconds =
    currentTimer?.durationSeconds ?? step?.timerSeconds ?? 0;
  const remaining = currentTimer
    ? timerRemaining(currentTimer)
    : selectedTimerSeconds;
  const timerRunning = Boolean(currentTimer?.endAt && remaining > 0);

  useEffect(() => {
    if (!definition || cookSteps.length === 0) return;
    const saved = readCookModeSession(
      definition.recipeId,
      definition.recipeVersionId,
    );
    if (saved) {
      const savedIndex = cookSteps.findIndex((candidate) =>
        candidate.stepIds.includes(saved.currentStepId),
      );
      if (savedIndex >= 0) setStepIndex(savedIndex);
      setCompletedStepIds(
        saved.completedStepIds.filter((stepId) => allStepIds.includes(stepId)),
      );
      if (saved.timer && allStepIds.includes(saved.timer.stepId)) {
        const restoredRemaining = timerRemaining(saved.timer);
        setTimer({
          ...saved.timer,
          remainingSeconds: restoredRemaining,
          endAt: restoredRemaining > 0 ? saved.timer.endAt : null,
        });
      }
      setCompletedAt(saved.completedAt);
      setNote(saved.note);
    }
    setSessionReady(true);
  }, [allStepIds, cookSteps, definition]);

  useEffect(() => {
    if (!timer?.endAt) return;
    const interval = window.setInterval(() => {
      const nextRemaining = timerRemaining(timer);
      setClockTick((value) => value + 1);
      if (nextRemaining <= 0) {
        setTimer((current) =>
          current?.stepId === timer.stepId
            ? { ...current, remainingSeconds: 0, endAt: null }
            : current,
        );
      }
    }, 1000);
    return () => window.clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (!definition || !sessionReady || !step) return;
    persistCookModeSession({
      schemaVersion: 1,
      recipeId: definition.recipeId,
      recipeVersionId: definition.recipeVersionId,
      updatedAt: new Date().toISOString(),
      currentStepId: step.stepIds[0],
      completedStepIds,
      timer,
      completedAt,
      note,
    });
  }, [completedAt, completedStepIds, definition, note, sessionReady, step, timer]);

  if (!definition) return null;

  if (state.unavailableReason) {
    return (
      <main className={styles.page}>
        <header className={styles.header}>
          <Link href={resolvedDetailHref} className={styles.exit}>
            <ArrowLeft size={17} /> {messages.backToRecipe}
          </Link>
          <Link href={homeHref} className={styles.wordmark}>
            Bake Again<span>.</span>
          </Link>
          <p>{definition.recipeTitle}</p>
        </header>
        <section
          className={styles.unavailable}
          aria-labelledby="cook-mode-unavailable-title"
        >
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
    setStepsOpen(false);
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    window.requestAnimationFrame(() => {
      document.querySelector<HTMLElement>(`#cook-step-title`)?.focus();
    });
  }

  function completeAndNext() {
    setCompletedStepIds((items) => [
      ...new Set([...items, ...step.stepIds]),
    ]);
    if (stepIndex === cookSteps.length - 1) {
      setCompletedAt(new Date().toISOString());
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    goToStep(stepIndex + 1);
  }

  function selectTimerDuration(seconds: number) {
    setTimer({
      stepId: timerStepId,
      durationSeconds: seconds,
      remainingSeconds: seconds,
      endAt: null,
    });
  }

  function toggleTimer() {
    if (currentTimer?.endAt) {
      setTimer({
        ...currentTimer,
        remainingSeconds: timerRemaining(currentTimer),
        endAt: null,
      });
      return;
    }
    const duration = currentTimer?.durationSeconds ?? step.timerSeconds ?? 0;
    const seconds = currentTimer?.remainingSeconds || duration;
    setTimer({
      stepId: timerStepId,
      durationSeconds: duration,
      remainingSeconds: seconds,
      endAt: new Date(Date.now() + seconds * 1000).toISOString(),
    });
  }

  function resetTimer() {
    setTimer({
      stepId: timerStepId,
      durationSeconds: selectedTimerSeconds,
      remainingSeconds: selectedTimerSeconds,
      endAt: null,
    });
  }

  function restart() {
    setStepIndex(0);
    setCompletedStepIds([]);
    setTimer(null);
    setCompletedAt(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const completedIndexes = cookSteps.flatMap((candidate, index) =>
    candidate.stepIds.every((stepId) => completedStepIds.includes(stepId))
      ? [index]
      : [],
  );

  const page = (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href={resolvedDetailHref} className={styles.exit}>
          <ArrowLeft size={17} /> {messages.exit}
        </Link>
        <Link href={homeHref} className={styles.wordmark}>
          Bake Again<span>.</span>
        </Link>
        <div className={styles.headerTools}>
          <CookWakeLock locale={locale} />
          <p>
            {definition.recipeTitle}
            {state.isAdjusted ? ` · ${messages.adjustedStatus}` : ''}
          </p>
        </div>
      </header>
      <div
        className={styles.progressTrack}
        aria-label={messages.completedSteps(
          completedScreenCount,
          cookSteps.length,
        )}
      >
        <span style={{ width: `${completionProgress}%` }} />
      </div>
      <div className={styles.shell}>
        <CookProgress
          steps={cookSteps}
          activeIndex={stepIndex}
          completed={completedIndexes}
          totalSteps={cookSteps.length}
          onSelect={goToStep}
          onShowIngredients={() => setIngredientsOpen(true)}
          locale={locale}
        />
        <div className={styles.workColumn}>
          {completedAt ? (
            <CookCompletion
              completedCount={completedScreenCount}
              totalSteps={cookSteps.length}
              detailHref={resolvedDetailHref}
              note={note}
              onNoteChange={setNote}
              onRestart={restart}
              locale={locale}
            />
          ) : (
            <>
              <p className="sr-only" aria-live="polite">
                {messages.stepChanged(stepIndex + 1, cookSteps.length, step.title)}
              </p>
              <CookStep
                step={step}
                stepIndex={stepIndex}
                totalSteps={cookSteps.length}
                remaining={remaining}
                timerRunning={timerRunning}
                selectedTimerSeconds={selectedTimerSeconds}
                onSelectTimerDuration={selectTimerDuration}
                onToggleTimer={toggleTimer}
                onResetTimer={resetTimer}
                onShowAllSteps={() => setStepsOpen(true)}
                onShowIngredients={() => setIngredientsOpen(true)}
                assistant={
                  definition.assistant && state.assistantConfiguration
                    ? { configuration: state.assistantConfiguration, locale }
                    : undefined
                }
                locale={locale}
              />
              <CookNavigation
                isFirst={stepIndex === 0}
                isLast={stepIndex === cookSteps.length - 1}
                isComplete={isComplete}
                onPrevious={() => goToStep(stepIndex - 1)}
                onCompleteAndNext={completeAndNext}
                locale={locale}
              />
            </>
          )}
        </div>
      </div>

      <Drawer open={stepsOpen} onOpenChange={setStepsOpen} showSwipeHandle>
        <DrawerContent className={styles.stepsDrawer}>
          <DrawerHeader>
            <DrawerTitle>{messages.allSteps}</DrawerTitle>
          </DrawerHeader>
          <CookProgress
            steps={cookSteps}
            activeIndex={stepIndex}
            completed={completedIndexes}
            totalSteps={cookSteps.length}
            onSelect={goToStep}
            locale={locale}
            variant="drawer"
          />
        </DrawerContent>
      </Drawer>

      <Drawer
        open={ingredientsOpen}
        onOpenChange={setIngredientsOpen}
        showSwipeHandle
      >
        <DrawerContent className={styles.ingredientsDrawer}>
          <DrawerHeader>
            <DrawerTitle>{messages.ingredients}</DrawerTitle>
          </DrawerHeader>
          <div className={styles.ingredientsDrawerBody}>
            <RecipeIngredientList items={state.allIngredients ?? []} />
          </div>
        </DrawerContent>
      </Drawer>
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
  ) : (
    page
  );
}
