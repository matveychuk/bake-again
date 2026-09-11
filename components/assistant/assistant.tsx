'use client';

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
}: {
  children: ReactNode;
  recipeId: string;
  recipeVersionId: string;
  recipeTitle: string;
  locale: AppLocale;
  surface: AssistantSurface;
}) {
  const [active, setActive] = useState<ActiveAssistant | null>(null);
  const [phase, setPhase] = useState<RequestPhase>('idle');
  const [question, setQuestion] = useState('');
  const [lastQuestion, setLastQuestion] = useState('');
  const [blocks, setBlocks] = useState<AssistantBlock[]>([]);
  const [proposedAction, setProposedAction] = useState<ActionProposal | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [canRetry, setCanRetry] = useState(false);
  const [history, setHistory] = useState<AssistantRequestV1['history']>([]);
  const [announcement, setAnnouncement] = useState('');
  const requestRef = useRef<AbortController | null>(null);
  const submittingRef = useRef(false);
  const inputId = useId();
  const messages = assistantMessages[locale];

  const closeAssistant = useCallback(() => {
    requestRef.current?.abort();
    requestRef.current = null;
    submittingRef.current = false;
    const trigger = active?.trigger;
    setActive(null);
    window.setTimeout(() => trigger?.focus(), 0);
  }, [active]);

  const openAssistant = useCallback((options: OpenAssistantOptions, trigger: HTMLElement | null) => {
    requestRef.current?.abort();
    requestRef.current = null;
    submittingRef.current = false;
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
  }, []);

  const submitQuestion = useCallback(async (rawQuestion: string) => {
    const nextQuestion = rawQuestion.trim();
    if (!active || !nextQuestion || submittingRef.current || phase === 'disabled') return;

    submittingRef.current = true;
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setPhase('loading');
    setProposedAction(null);
    setLastQuestion(nextQuestion);
    setErrorMessage('');
    setCanRetry(false);
    setAnnouncement('');

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
        headers: { 'content-type': 'application/json' },
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
        setPhase(data.error.code === 'ASSISTANT_DISABLED' ? 'disabled' : 'error');
        setAnnouncement(data.error.message);
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
      setErrorMessage(error instanceof Error ? error.message : messages.genericError);
      setCanRetry(true);
      setPhase('error');
      setAnnouncement(messages.genericError);
    } finally {
      if (requestRef.current === controller) { requestRef.current = null; submittingRef.current = false; }
    }
  }, [active, history, locale, messages.answerReady, messages.emptyTitle, messages.genericError, phase, recipeId, recipeVersionId, surface]);

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submitQuestion(question);
  };

  const scopeKind = active?.scope.kind ?? 'recipe';
  const prompts = messages.prompts[surface][scopeKind];
  const isBusy = phase === 'loading';
  const isDisabled = phase === 'disabled';

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
          <DrawerContent className={styles.drawer} aria-describedby={`${inputId}-description`}>
            <header className={styles.header}>
              <div className={styles.mark}><Sparkles size={18} aria-hidden="true" /></div>
              <div className={styles.heading}>
                <p className={styles.kicker}>
                  {scopeKind === 'recipe' ? recipeTitle : messages.kicker[scopeKind]}
                  {active.stepTitle ? ` · ${active.stepTitle}` : ''}
                </p>
                <DrawerTitle className={styles.title}>{messages.title[surface][scopeKind]}</DrawerTitle>
              </div>
              <DrawerClose className={styles.close} aria-label={messages.close}>
                <X size={20} aria-hidden="true" />
              </DrawerClose>
            </header>

            <DrawerDescription id={`${inputId}-description`} className="sr-only">
              {messages.contextBody[surface]}
            </DrawerDescription>
            <p className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</p>

            <div className={styles.body}>
              <div className={styles.context}>
                <Bot size={18} aria-hidden="true" />
                <p><strong>{messages.contextTitle}</strong>{messages.contextBody[surface]}</p>
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
                <AssistantBlocks blocks={blocks} locale={locale} />
              )}

              {phase === 'success' && proposedAction && (
                <AssistantActionReview
                  key={proposedAction.id}
                  proposal={proposedAction}
                  context={{ schemaVersion: 1, recipeId, recipeVersionId, locale, surface, scope: active.scope, configuration: active.configuration }}
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
                      <button className={styles.retry} type="button" onClick={() => void submitQuestion(lastQuestion)}>
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

              {(phase === 'idle' || phase === 'success' || phase === 'empty' || phase === 'error') && (
                <>
                  <p className={styles.promptLabel}>{messages.suggestedQuestions}</p>
                  <div className={styles.prompts}>
                    {prompts.map((prompt) => (
                      <button
                        className={styles.prompt}
                        type="button"
                        key={prompt}
                        disabled={isBusy}
                        onClick={() => void submitQuestion(prompt)}
                      >
                        {prompt}<ArrowRight size={16} aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <form className={styles.composer} onSubmit={handleSubmit}>
              <label className="sr-only" htmlFor={inputId}>{messages.questionLabel}</label>
              <input
                id={inputId}
                value={question}
                maxLength={ASSISTANT_MAX_QUESTION_CHARACTERS}
                disabled={isBusy || isDisabled}
                placeholder={messages.placeholder}
                onChange={(event) => setQuestion(event.target.value)}
              />
              <button
                className={styles.send}
                type="submit"
                aria-label={messages.send}
                disabled={!question.trim() || isBusy || isDisabled}
              >
                <Send size={18} aria-hidden="true" />
              </button>
            </form>
            <footer className={styles.footer}>{messages.disclaimer}</footer>
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
}: {
  scope: AssistantScope;
  configuration: AssistantConfiguration;
  label: string;
  stepTitle?: string;
  className?: string;
  compact?: boolean;
}) {
  const context = useContext(AssistantContext);
  if (!context) return null;
  return (
    <button
      className={className}
      type="button"
      onClick={(event) => context.openAssistant({ scope, configuration, stepTitle }, event.currentTarget)}
    >
      <MessageCircleQuestion size={compact ? 14 : 17} aria-hidden="true" />
      {label}
    </button>
  );
}
