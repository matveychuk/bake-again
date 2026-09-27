'use client';

import type { PreparedStepAnswer } from '@/content/recipes/step-help';
import { Button } from '@/components/ui/button';
import { preparedAnswerExchange } from './prepared-answer';
import { AssistantVerification, verificationMessages } from './verification';
import { stepHelpMessages } from './step-help.messages';
import { trackEvent } from '@/lib/analytics/umami';
import {
  createContext,
  useCallback,
  useContext,
  useId,
  useRef,
  useState,
  type ReactNode,
  type SyntheticEvent,
} from 'react';
import {
  ArrowRight,
  Bot,
  BookOpen,
  CircleAlert,
  LoaderCircle,
  MessageCircleQuestion,
  Send,
  Sparkles,
  X,
} from 'lucide-react';
import { EvidenceBadge, type EvidenceStatus } from '@/components/recipe/evidence-badge';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from '@/components/ui/drawer';
import type {
  AssistantBlock,
  AssistantConfiguration,
  AssistantRequestV1,
  AssistantResponseV1,
  AssistantScope,
  PublicEvidenceStatus,
} from '@/lib/assistant/contracts';
import { isAssistantResponseV1 } from '@/lib/assistant/schemas';
import { ASSISTANT_MAX_QUESTION_CHARACTERS } from '@/lib/assistant/limits';
import type { AppLocale } from '@/lib/i18n/config';
import { getLocalizedRecipePath } from '@/lib/i18n/routes';
import type { ActionProposal } from '@/lib/assistant/action-contract';
import { AssistantActionReview } from './action-review';
import { appendAssistantExchange } from './assistant-history';
import { assistantMessages, type AssistantSurface } from './assistant.messages';
import styles from './assistant.module.css';

type OpenAssistantOptions = {
  scope: AssistantScope;
  configuration: AssistantConfiguration;
  stepTitle?: string;
  preparedAnswers?: PreparedStepAnswer[];
};

type ActiveAssistant = OpenAssistantOptions & { trigger: HTMLElement | null };
type RequestPhase = 'idle' | 'loading' | 'success' | 'empty' | 'error' | 'disabled';

type AssistantContextValue = {
  openAssistant: (options: OpenAssistantOptions, trigger: HTMLElement | null) => void;
};

const AssistantContext = createContext<AssistantContextValue | null>(null);

function statusKey(status: PublicEvidenceStatus): EvidenceStatus {
  return status.toLowerCase() as EvidenceStatus;
}

function responseText(blocks: AssistantBlock[]) {
  return blocks.map(({ text }) => text).join(' ');
}

function isEmptyAssistantResponse(value: unknown): value is Extract<AssistantResponseV1, { ok: true }> {
  return typeof value === 'object' && value !== null && 'ok' in value && value.ok === true
    && 'blocks' in value && Array.isArray(value.blocks) && value.blocks.length === 0;
}

export function AssistantBlocks({ blocks, locale }: { blocks: AssistantBlock[]; locale: AppLocale }) {
  return (
    <div className={styles.blocks}>
      {blocks.map((block, index) => {
        const status = block.status ? statusKey(block.status) : undefined;
        return (
          <article className={styles.block} data-status={status} key={`${block.kind}-${block.references[0]?.id ?? index}`}>
            {status && <EvidenceBadge className={styles.badge} status={status} locale={locale} />}
            <p>{block.text}</p>
            {'qualification' in block && block.qualification && (
              <p className={styles.qualification}>{block.qualification}</p>
            )}
          </article>
        );
      })}
    </div>
  );
}

export function AssistantProvider({
  children,
  recipeId,
  recipeVersionId,
  recipeTitle,
  locale,
  surface,
  liveEnabled = true,
}: {
  children: ReactNode;
  recipeId: string;
  recipeVersionId: string;
  recipeTitle: string;
  locale: AppLocale;
  surface: AssistantSurface;
  liveEnabled?: boolean;
}) {
  const [active, setActive] = useState<ActiveAssistant | null>(null);
  const [phase, setPhase] = useState<RequestPhase>('idle');
  const [question, setQuestion] = useState('');
  const [answerSource, setAnswerSource] = useState<'recipe' | 'ai'>('ai');
  const [liveUnavailable, setLiveUnavailable] = useState(false);
  const [verificationNeeded, setVerificationNeeded] = useState(false);
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [verificationAttempt, setVerificationAttempt] = useState(0);
  const answerRef = useRef<HTMLDivElement | null>(null);
  const [lastQuestion, setLastQuestion] = useState('');
  const [blocks, setBlocks] = useState<AssistantBlock[]>([]);
  const [proposedAction, setProposedAction] = useState<ActionProposal | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [canRetry, setCanRetry] = useState(false);
  const [history, setHistory] = useState<AssistantRequestV1['history']>([]);
  const [announcement, setAnnouncement] = useState('');
  const requestRef = useRef<AbortController | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const submittingRef = useRef(false);
  const inputId = useId();
  const messages = assistantMessages[locale];
  const helpMessages = stepHelpMessages[locale];

  const closeAssistant = useCallback(() => {
    requestRef.current?.abort();
    requestRef.current = null;
    submittingRef.current = false;
    const trigger = active?.trigger;
    setVerificationToken(null);
    setVerificationNeeded(false);
    setActive(null);
    window.setTimeout(() => trigger?.focus(), 0);
  }, [active]);

  const openAssistant = useCallback((options: OpenAssistantOptions, trigger: HTMLElement | null) => {
    requestRef.current?.abort();
    requestRef.current = null;
    submittingRef.current = false;
    setVerificationNeeded(false);
    setVerificationToken(null);
    setAnswerSource('ai');
    setLiveUnavailable(false);
    setPhase('idle');
    setQuestion('');
    setLastQuestion('');
    setBlocks([]);
    setProposedAction(null);
    setErrorMessage('');
    setCanRetry(false);
    setHistory([]);
    setAnnouncement('');
    setActive({ ...options, trigger });
    trackEvent('assistant_open', { recipe_id: recipeId, locale });
  }, [recipeId, locale]);

  const submitQuestion = useCallback(async (rawQuestion: string) => {
    const nextQuestion = rawQuestion.trim();
    if (!verificationToken || !liveEnabled || liveUnavailable || !active || !nextQuestion || submittingRef.current) return;

    const token = verificationToken;
    setVerificationToken(null);
    setAnswerSource('ai');
    trackEvent('assistant_submit', { recipe_id: recipeId, locale });
    submittingRef.current = true;
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    // Submit controls are disabled or removed during loading. Keep focus on a
    // persistent, visible control instead of letting it fall back to the page.
    closeRef.current?.focus({ preventScroll: true });
    setPhase('loading');
    setProposedAction(null);
    setLastQuestion(nextQuestion);
    setErrorMessage('');
    setCanRetry(false);
    setAnnouncement(messages.loading);

    const payload: AssistantRequestV1 = {
      schemaVersion: 1,
      recipeId,
      recipeVersionId,
      locale,
      surface,
      scope: active.scope,
      configuration: active.configuration,
      question: nextQuestion,
      history,
    };

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-assistant-verification': token },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      const data: unknown = await response.json();
      if (controller.signal.aborted || requestRef.current !== controller) return;
      if (isEmptyAssistantResponse(data)) {
        setBlocks([]);
        setPhase('empty');
        setAnnouncement(messages.emptyTitle);
        return;
      }
      if (!isAssistantResponseV1(data)) throw new Error(messages.genericError);
      if (!data.ok) {
        setErrorMessage(data.error.message);
        setCanRetry(data.error.retryable);
        setLiveUnavailable(data.error.code === 'ASSISTANT_DISABLED');
        setPhase(data.error.code === 'ASSISTANT_DISABLED' ? 'disabled' : 'error');
        setAnnouncement(data.error.code === 'ASSISTANT_DISABLED' ? data.error.message : '');
        return;
      }
      if (!response.ok || data.recipeId !== recipeId || data.recipeVersionId !== recipeVersionId || data.locale !== locale || JSON.stringify(data.configuration) !== JSON.stringify(active.configuration)) throw new Error(messages.genericError);
      setBlocks(data.blocks);
      setProposedAction(data.proposedAction);
      setHistory((current) => appendAssistantExchange(current, nextQuestion, responseText(data.blocks)));
      setQuestion('');
      setPhase(data.blocks.length > 0 ? 'success' : 'empty');
      setAnnouncement(messages.answerReady);
    } catch (error) {
      if (controller.signal.aborted || requestRef.current !== controller || (error instanceof DOMException && error.name === 'AbortError')) return;
      setErrorMessage(messages.genericError);
      setCanRetry(true);
      setPhase('error');
      setAnnouncement('');
    } finally {
      if (requestRef.current === controller) { requestRef.current = null; submittingRef.current = false; setVerificationAttempt(value => value + 1); }
    }
  }, [verificationToken, liveEnabled, liveUnavailable, active, history, locale, messages.answerReady, messages.emptyTitle, messages.genericError, messages.loading, recipeId, recipeVersionId, surface]);

  const showPreparedAnswer = (answer: PreparedStepAnswer) => {
    if (submittingRef.current) return;
    const exchange = preparedAnswerExchange(answer, history);
    setAnswerSource('recipe');
    setLastQuestion(answer.question);
    setBlocks(exchange.blocks);
    setHistory(exchange.history);
    setProposedAction(null);
    setErrorMessage('');
    setCanRetry(false);
    setPhase('success');
    setAnnouncement(`${helpMessages.source}. ${messages.answerReady}`);
    window.requestAnimationFrame(() => answerRef.current?.focus());
  };

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submitQuestion(question);
  };

  const scopeKind = active?.scope.kind ?? 'recipe';
  const preparedAnswers = active?.preparedAnswers ?? [];
  const hasPreparedAnswers = preparedAnswers.length > 0;
  const isBusy = phase === 'loading';
  const isDisabled = liveUnavailable;

  return (
    <AssistantContext.Provider value={{ openAssistant }}>
      {children}
      <Drawer
        open={active !== null}
        onOpenChange={(open) => {
          if (!open) closeAssistant();
        }}
        swipeDirection="right"
      >
        {active && (
          <DrawerContent className={styles.drawer} initialFocus={closeRef} aria-describedby={`${inputId}-description`}>
            <header className={styles.header}>
              <div className={styles.mark}>{hasPreparedAnswers ? <BookOpen size={18} aria-hidden="true" /> : <Sparkles size={18} aria-hidden="true" />}</div>
              <div className={styles.heading}>
                <p className={styles.kicker}>
                  {scopeKind === 'recipe' ? recipeTitle : messages.kicker[scopeKind]}
                  {active.stepTitle ? ` · ${active.stepTitle}` : ''}
                </p>
                <DrawerTitle className={styles.title}>{hasPreparedAnswers ? helpMessages.title : messages.title[surface][scopeKind]}</DrawerTitle>
              </div>
              <DrawerClose ref={closeRef} className={styles.close} aria-label={messages.close}>
                <X size={20} aria-hidden="true" />
              </DrawerClose>
            </header>

            <DrawerDescription id={`${inputId}-description`} className="sr-only">
              {hasPreparedAnswers ? helpMessages.description : messages.contextBody[surface]}
            </DrawerDescription>
            <p className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</p>

            <div className={styles.body}>
              <div className={styles.context}>
                {hasPreparedAnswers ? <BookOpen size={18} aria-hidden="true" /> : <Bot size={18} aria-hidden="true" />}
                <p><strong>{hasPreparedAnswers ? helpMessages.source : messages.contextTitle}</strong>{hasPreparedAnswers ? helpMessages.description : messages.contextBody[surface]}</p>
              </div>

              {lastQuestion && phase !== 'idle' && (
                <div className={styles.question}>
                  <p className={styles.questionLabel}>{messages.yourQuestion}</p>
                  <p>{lastQuestion}</p>
                </div>
              )}

              {phase === 'loading' && (
                <div className={styles.state}>
                  <LoaderCircle size={20} aria-hidden="true" />
                  <p>{messages.loading}</p>
                </div>
              )}

              {phase === 'success' && (
                <div ref={answerRef} tabIndex={-1} className={styles.answerResult}>
                  {answerSource === 'recipe' && <p className={styles.promptLabel}>{helpMessages.source}</p>}
                  <AssistantBlocks blocks={blocks} locale={locale} />
                </div>
              )}

              {phase === 'success' && proposedAction && (
                <AssistantActionReview
                  key={proposedAction.id}
                  proposal={proposedAction}
                  context={{ schemaVersion: 1, recipeId, recipeVersionId, locale, surface, scope: active.scope, configuration: active.configuration }}
                  returnFocus={() => closeRef.current}
                  onOpenScaling={() => {
                    const target = document.getElementById('adjust-recipe');
                    const path = getLocalizedRecipePath(recipeId, locale);
                    closeAssistant();
                    if (target) window.requestAnimationFrame(() => { target.scrollIntoView(); target.querySelector<HTMLElement>('button, input, select')?.focus(); });
                    else if (path) window.location.assign(`${path}#adjust-recipe`);
                  }}
                />
              )}

              {phase === 'empty' && (
                <div className={styles.state}>
                  <CircleAlert size={20} aria-hidden="true" />
                  <p><strong>{messages.emptyTitle}</strong>{messages.emptyBody}</p>
                </div>
              )}

              {phase === 'error' && (
                <div className={styles.state} role="alert">
                  <CircleAlert size={20} aria-hidden="true" />
                  <div>
                    <p><strong>{messages.errorTitle}</strong>{errorMessage}</p>
                    {canRetry && (
                      <button className={styles.retry} type="button" disabled={!verificationToken} onClick={() => void submitQuestion(lastQuestion)}>
                        {messages.retry}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {phase === 'disabled' && (
                <div className={styles.state}>
                  <CircleAlert size={20} aria-hidden="true" />
                  <p><strong>{messages.disabledTitle}</strong>{errorMessage ? `${errorMessage} ${messages.disabledBody}` : messages.disabledBody}</p>
                </div>
              )}

              {hasPreparedAnswers && (
                <>
                  <p className={styles.promptLabel}>{helpMessages.questions}</p>
                  <div className={styles.prompts}>
                    {preparedAnswers.map((answer) => (
                      <button
                        className={styles.prompt}
                        type="button"
                        key={answer.id}
                        disabled={isBusy}
                        aria-pressed={answerSource === 'recipe' && lastQuestion === answer.question}
                        onClick={() => showPreparedAnswer(answer)}
                      >
                        {answer.question}<ArrowRight size={16} aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                </>
              )}
              {liveEnabled && <p className={styles.quotaNote}>{verificationMessages[locale].limits}</p>}
              {liveEnabled && verificationNeeded && !isBusy && <AssistantVerification key={verificationAttempt} locale={locale} onToken={setVerificationToken} />}
            </div>

            {liveEnabled && <form className={styles.composer} onSubmit={handleSubmit}>
              <label className={styles.composerLabel} htmlFor={inputId}>{helpMessages.chat}</label>
              <input
                id={inputId}
                value={question}
                maxLength={ASSISTANT_MAX_QUESTION_CHARACTERS}
                disabled={isBusy || isDisabled}
                placeholder={helpMessages.placeholder}
                onFocus={() => setVerificationNeeded(true)}
                onChange={(event) => { setQuestion(event.target.value); setVerificationNeeded(true); }}
              />
              <button
                className={styles.send}
                type="submit"
                aria-label={messages.send}
                disabled={!verificationToken || !question.trim() || isBusy || isDisabled}
              >
                <Send size={18} aria-hidden="true" />
              </button>
            </form>}
            <footer className={styles.footer}>{liveEnabled ? messages.disclaimer : helpMessages.description}</footer>
          </DrawerContent>
        )}
      </Drawer>
    </AssistantContext.Provider>
  );
}

export function AssistantTrigger({
  scope,
  configuration,
  label,
  stepTitle,
  className,
  compact = false,
  preparedAnswers,
}: {
  scope: AssistantScope;
  configuration: AssistantConfiguration;
  label: string;
  stepTitle?: string;
  className?: string;
  compact?: boolean;
  preparedAnswers?: PreparedStepAnswer[];
}) {
  const context = useContext(AssistantContext);
  if (!context) return null;
  return (
    <Button
      variant="link"
      className={className}
      type="button"
      onClick={(event) => context.openAssistant({ scope, configuration, stepTitle, preparedAnswers }, event.currentTarget)}
    >
      <MessageCircleQuestion size={compact ? 14 : 17} aria-hidden="true" />
      {label}
    </Button>
  );
}
