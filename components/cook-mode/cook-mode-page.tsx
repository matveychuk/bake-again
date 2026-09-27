'use client';

import { EvidenceBadge } from '@/components/recipe/evidence-badge';

/* oxlint-disable react-compiler/react-compiler -- Restore the versioned browser session once after hydration. */

import { trackEvent } from '@/lib/analytics/umami';
/* oxlint-disable next/no-html-link-for-pages -- Match native recipe navigation; hydrated next/link fails in the production runtime. */
import { RecipeConfigurationUnavailable } from '@/components/recipe/recipe-configuration-unavailable';
import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { ArrowLeft, Clock3, NotebookPen, X } from 'lucide-react';
import { AssistantProvider } from '@/components/assistant';
import { RecipeIngredientList } from '@/components/recipe/recipe-ingredient-list';
import {
  Drawer,
  DrawerContent,
  DrawerClose,
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
  bakeConfigurationKey,
  persistBakeRecord,
  readBakeRecord,
  type BakeRecordV1,
} from '@/lib/persistence/bake-memory';
import {
  persistCookModeSession,
  readCookModeSession,
  type CookTimerState,
} from '@/lib/persistence/cook-mode';

const subscribeToLocation = () => () => undefined;
const getLocationSearch = () => window.location.search;

function timerRemaining(timer: CookTimerState | null) {
  if (!timer) return 0;
  if (!timer.endAt) return timer.remainingSeconds;
  return Math.max(0, Math.ceil((Date.parse(timer.endAt) - Date.now()) / 1000));
}

/** Shared interactive Cook Mode; recipe data and configuration rules arrive via its definition. */
export function CookModePage({
  recipeSlug,
  homeHref = '/',
  detailHref,
  locale = 'en',
  configurationSearch = '',
}: {
  recipeSlug: string;
  homeHref?: string;
  detailHref?: string;
  locale?: AppLocale;
  configurationSearch?: string;
}) {
  const messages = getUiMessages(locale).cook;
  const definition = useMemo(
    () => getCookModeDefinition(recipeSlug, locale),
    [locale, recipeSlug],
  );
  const baseDetailHref = detailHref ?? definition?.detailHref ?? '/recipes';
  const locationSearch = useSyncExternalStore(
    subscribeToLocation,
    getLocationSearch,
    () => (configurationSearch ? `?${configurationSearch}` : ''),
  );
  const resolvedDetailHref = `${baseDetailHref}${locationSearch}`;
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
  const configuration = useMemo(
    () => state.assistantConfiguration ?? { kind: 'base' as const },
    [state.assistantConfiguration],
  );
  const recipeVersionId =
    state.recipeVersionId ?? definition?.recipeVersionId ?? '';
  const configurationKey = bakeConfigurationKey(configuration);
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
  const [noteSaveStatus, setNoteSaveStatus] = useState<
    'saving' | 'saved' | 'error'
  >('saved');
  const [previousBake, setPreviousBake] = useState<BakeRecordV1 | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [restoredConfigurationKey, setRestoredConfigurationKey] = useState<
    string | null
  >(null);
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
    setRestoredConfigurationKey(null);
    setStepIndex(0);
    setCompletedStepIds([]);
    setTimer(null);
    setCompletedAt(null);
    setNote('');
    setNoteSaveStatus('saved');
    const saved = readCookModeSession(
      definition.recipeId,
      recipeVersionId,
      undefined,
      configurationKey,
    );
    const baked = readBakeRecord(
      definition.recipeId,
      recipeVersionId,
      configuration,
    );
    setPreviousBake(baked);
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
    setRestoredConfigurationKey(configurationKey);
    setSessionReady(true);
  }, [
    allStepIds,
    configuration,
    configurationKey,
    cookSteps,
    definition,
    recipeVersionId,
  ]);

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
    if (
      !definition ||
      !sessionReady ||
      restoredConfigurationKey !== configurationKey ||
      !step
    ) {
      return;
    }
    const sessionSaved = persistCookModeSession(
      {
        schemaVersion: 1,
        recipeId: definition.recipeId,
        recipeVersionId: recipeVersionId,
        updatedAt: new Date().toISOString(),
        currentStepId: step.stepIds[0],
        completedStepIds,
        timer,
        completedAt,
        note,
      },
      undefined,
      configurationKey,
    );
    if (!completedAt) return;

    const now = new Date().toISOString();
    const record: BakeRecordV1 = {
      recipeId: definition.recipeId,
      recipeVersionId,
      configuration,
      completedAt,
      note,
      noteUpdatedAt: now,
    };
    const memorySaved = persistBakeRecord(record);
    setPreviousBake(record);
    setNoteSaveStatus(sessionSaved && memorySaved ? 'saved' : 'error');
  }, [
    completedAt,
    completedStepIds,
    configuration,
    configurationKey,
    definition,
    note,
    restoredConfigurationKey,
    recipeVersionId,
    sessionReady,
    step,
    timer,
  ]);

  if (!definition) return null;

  if (state.unavailableReason) {
    return (
      <main className={styles.page}>
        <header className={styles.header}>
          <a href={resolvedDetailHref} className={styles.exit}>
            <ArrowLeft size={17} /> {messages.backToRecipe}
          </a>
          <a href={homeHref} className={styles.wordmark}>
            Bake Again<span>.</span>
          </a>
          <p>{definition.recipeTitle}</p>
        </header>
        <RecipeConfigurationUnavailable
          locale={locale}
          reason={state.unavailableReason}
          href={resolvedDetailHref}
        />
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
    if (!isComplete)
      trackEvent('cook_step_complete', {
        recipe_id: definition?.recipeId,
        locale,
        count: stepIndex + 1,
      });
    setCompletedStepIds((items) => [...new Set([...items, ...step.stepIds])]);
    if (stepIndex === cookSteps.length - 1) {
      if (!completedAt)
        trackEvent('cook_complete', {
          recipe_id: definition?.recipeId,
          locale,
        });
      setNoteSaveStatus('saving');
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
    if (seconds > 0)
      trackEvent('timer_start', { recipe_id: definition?.recipeId, locale });
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
    if (!definition) return;
    trackEvent('cook_restart', { recipe_id: definition.recipeId, locale });
    setPreviousBake(
      readBakeRecord(definition.recipeId, recipeVersionId, configuration),
    );
    setStepIndex(0);
    setCompletedStepIds([]);
    setTimer(null);
    setCompletedAt(null);
    setNote('');
    setNoteSaveStatus('saved');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function changeNote(nextNote: string) {
    setNoteSaveStatus('saving');
    setNote(nextNote);
  }

  const completedIndexes = cookSteps.flatMap((candidate, index) =>
    candidate.stepIds.every((stepId) => completedStepIds.includes(stepId))
      ? [index]
      : [],
  );

  const page = (
    <main className={styles.page}>
      <header className={styles.header}>
        <a href={resolvedDetailHref} className={styles.exit}>
          <ArrowLeft size={17} /> {messages.exit}
        </a>
        <a href={homeHref} className={styles.wordmark}>
          Bake Again<span>.</span>
        </a>
        <div className={styles.headerTools}>
          <CookWakeLock locale={locale} />
          <p>
            {definition.recipeTitle}
            {state.isAdjusted && !state.evidence
              ? ` · ${messages.adjustedStatus}`
              : ''}
          </p>
          {state.evidence && (
            <EvidenceBadge locale={locale} status={state.evidence.status} />
          )}
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
              noteSaveStatus={noteSaveStatus}
              onNoteChange={changeNote}
              onRestart={restart}
              locale={locale}
            />
          ) : (
            <>
              {stepIndex === 0 && previousBake?.note && (
                <aside className={styles.previousBakeNote}>
                  <NotebookPen aria-hidden="true" size={19} />
                  <div>
                    <strong>{messages.previousNote}</strong>
                    <p>{previousBake.note}</p>
                    <small>{messages.previousNoteDescription}</small>
                  </div>
                </aside>
              )}
              <p className="sr-only" aria-live="polite">
                {messages.stepChanged(
                  stepIndex + 1,
                  cookSteps.length,
                  step.title,
                )}
              </p>
              {timer && !currentTimer && (
                <button
                  className={styles.activeTimer}
                  type="button"
                  onClick={() => {
                    const timerIndex = cookSteps.findIndex((candidate) =>
                      candidate.stepIds.includes(timer.stepId),
                    );
                    if (timerIndex >= 0) goToStep(timerIndex);
                  }}
                >
                  <Clock3 aria-hidden="true" size={20} />
                  <span>
                    {messages.timerLabel} ·{' '}
                    <strong>
                      {Math.floor(timerRemaining(timer) / 60)}:
                      {String(timerRemaining(timer) % 60).padStart(2, '0')}
                    </strong>
                    <small>
                      {
                        cookSteps.find((candidate) =>
                          candidate.stepIds.includes(timer.stepId),
                        )?.title
                      }
                    </small>
                  </span>
                </button>
              )}
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

      <Drawer
        open={stepsOpen}
        onOpenChange={setStepsOpen}
        swipeDirection="right"
      >
        <DrawerContent className={styles.stepsDrawer}>
          <DrawerHeader className={styles.drawerHeader}>
            <DrawerTitle>{messages.allSteps}</DrawerTitle>
            <DrawerClose
              className={styles.drawerClose}
              aria-label={getUiMessages(locale).personal.close}
            >
              <X aria-hidden="true" size={20} />
            </DrawerClose>
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
        swipeDirection="right"
      >
        <DrawerContent className={styles.ingredientsDrawer}>
          <DrawerHeader className={styles.drawerHeader}>
            <DrawerTitle>{messages.ingredients}</DrawerTitle>
            <DrawerClose
              className={styles.drawerClose}
              aria-label={getUiMessages(locale).personal.close}
            >
              <X aria-hidden="true" size={20} />
            </DrawerClose>
          </DrawerHeader>
          <div className={styles.ingredientsDrawerBody}>
            <RecipeIngredientList
              items={state.allIngredients ?? []}
              locale={locale}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </main>
  );

  return definition.assistant ? (
    <AssistantProvider
      recipeId={definition.assistant.recipeId}
      recipeVersionId={recipeVersionId}
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
