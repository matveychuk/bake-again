'use client';

import { createContext, useContext, useState } from 'react';
import { ArrowRight, Bot, MessageCircleQuestion, Send, Sparkles, X } from 'lucide-react';
import styles from './recipe.module.css';

type Scope = 'recipe' | 'flour' | 'step';
type AssistantState = { scope: Scope; stepTitle?: string } | null;

const AssistantContext = createContext<{ open: (state: NonNullable<AssistantState>) => void }>({ open: () => undefined });

const scopeContent = {
  recipe: {
    kicker: 'Napoleon cake',
    title: 'Ask about this recipe',
    lead: null,
    prompts: ['Explain the timing', 'What can I prepare tonight?', 'Add missing ingredients'],
  },
  flour: {
    kicker: 'Flour configuration',
    title: 'Can I use another flour mix?',
    lead: 'This recipe was repeatedly verified with Schär Mix B.',
    prompts: ['I have Schär Mix C', 'Why does the exact mix matter?', 'Show recipes for my flour'],
  },
  step: {
    kicker: 'Current method step',
    title: 'Ask about this step',
    lead: null,
    prompts: ['Is my texture right?', 'Explain this more simply', 'When should I stop mixing?'],
  },
};

export function RecipeAssistantProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AssistantState>(null);
  const content = state ? scopeContent[state.scope] : null;

  return (
    <AssistantContext.Provider value={{ open: setState }}>
      {children}
      {state && content && (
        <div className={styles.assistantLayer} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setState(null)}>
          <dialog className={styles.assistantDrawer} open aria-modal="true" aria-labelledby="assistant-title">
            <header>
              <div className={styles.assistantMark}><Sparkles size={17} /></div>
              <div><p>{content.kicker}{state.stepTitle ? ` · ${state.stepTitle}` : ''}</p><h2 id="assistant-title">{content.title}</h2></div>
              <button type="button" aria-label="Close assistant" onClick={() => setState(null)}><X size={19} /></button>
            </header>
            <div className={styles.assistantBody}>
              <div className={styles.assistantContext}><Bot size={16} /><p><strong>Using this recipe’s trusted context</strong>Verified recipe facts and untested suggestions stay clearly separated.</p></div>
              {content.lead && <p className={styles.assistantLead}>{content.lead}</p>}
              {state.scope === 'flour' && (
                <div className={styles.assistantAnswer}>
                  <span>From recipe data</span>
                  <p>No tested alternative mix is recorded for this Napoleon yet. I can explain the risk or help you find a recipe tested with the flour you have, but I won’t present a substitution as verified.</p>
                </div>
              )}
              <p className={styles.assistantPromptLabel}>Suggested questions</p>
              <div className={styles.assistantPrompts}>
                {content.prompts.map((prompt) => <button type="button" key={prompt}>{prompt}<ArrowRight size={14} /></button>)}
              </div>
            </div>
            <form className={styles.assistantComposer} onSubmit={(event) => event.preventDefault()}>
              <label className="sr-only" htmlFor="assistant-question">Ask a question</label>
              <input id="assistant-question" placeholder="Ask in your own words…" />
              <button type="submit" aria-label="Send question"><Send size={16} /></button>
            </form>
            <footer>AI can make mistakes. Recipe status always comes from the verified collection.</footer>
          </dialog>
        </div>
      )}
    </AssistantContext.Provider>
  );
}

export function AssistantTrigger({ scope, label, stepTitle, compact = false }: { scope: Scope; label: string; stepTitle?: string; compact?: boolean }) {
  const { open } = useContext(AssistantContext);
  return <button className={compact ? styles.assistantTriggerCompact : styles.assistantTrigger} type="button" onClick={() => open({ scope, stepTitle })}><MessageCircleQuestion size={compact ? 14 : 16} />{label}</button>;
}
