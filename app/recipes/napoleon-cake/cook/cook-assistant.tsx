import { ArrowRight, Sparkles, X } from 'lucide-react';
import styles from './cook-mode.module.css';

type CookAssistantProps = {
  stepTitle: string;
  onClose: () => void;
};

export function CookAssistant({ stepTitle, onClose }: CookAssistantProps) {
  return (
    <div className={styles.assistantLayer} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <dialog className={styles.assistant} open aria-modal="true" aria-labelledby="cook-assistant-title">
        <header><Sparkles size={19} /><div><p>Current step · {stepTitle}</p><h2 id="cook-assistant-title">Ask while you cook</h2></div><button type="button" onClick={onClose} aria-label="Close assistant"><X /></button></header>
        <div className={styles.assistantBody}>
          <p className={styles.context}><strong>Using this recipe’s trusted context</strong>I can use this step’s ingredients, checkpoint and media. Untested suggestions will be labelled clearly.</p>
          <h3>What do you need help with?</h3>
          <button type="button">Does my texture look right?<ArrowRight size={15} /></button>
          <button type="button">Explain this step more simply<ArrowRight size={15} /></button>
          <button type="button">What should I do if it looks too dry?<ArrowRight size={15} /></button>
        </div>
        <form onSubmit={(event) => event.preventDefault()}><input aria-label="Ask a cooking question" placeholder="Ask in your own words…" /><button type="submit" aria-label="Send question"><ArrowRight /></button></form>
        <footer>AI can make mistakes. Recipe status comes from the verified collection.</footer>
      </dialog>
    </div>
  );
}
