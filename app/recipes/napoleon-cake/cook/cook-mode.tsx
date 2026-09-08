'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Lightbulb,
  MessageCircleQuestion,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  X,
} from 'lucide-react';
import styles from './cook-mode.module.css';

type MediaItem = { src: string; alt: string; title: string; caption: string };
type CookStep = {
  number: string;
  meta: string;
  title: string;
  body: string;
  ingredients: string[];
  checkpoint?: string;
  tip?: string;
  timerSeconds?: number;
  media?: MediaItem[];
};

const steps: CookStep[] = [
  {
    number: '01',
    meta: '5–10 sec · food processor',
    title: 'Mix the dry ingredients',
    body: 'Add the flour mix, both starches, xanthan, baking powder, salt and sugar. Mix briefly so everything is evenly distributed.',
    ingredients: ['450 g Schär Mix B', '80 g tapioca starch', '40 g corn starch', '3 g xanthan gum', '8 g baking powder', '¼ tsp salt', '1 tbsp sugar'],
  },
  {
    number: '02',
    meta: '10–15 min · food processor',
    title: 'Cut in the cold butter',
    body: 'Cube the butter and chill it well. Add it to the dry mixture and pulse about ten times—do not process it into a uniform paste.',
    ingredients: ['120 g cold butter'],
    checkpoint: 'Look for an uneven crumb: some sandy, with some pea-sized pieces of butter still visible.',
    timerSeconds: 600,
    media: [
      { src: '/media/recipes/gluten-free-napoleon/selected/cold-butter-ready-example-v1.png', alt: 'Cold butter cubes beside the dry flour mixture', title: 'Start cold', caption: 'The butter should be firm before it goes into the processor.' },
      { src: '/media/recipes/gluten-free-napoleon/selected/cold-butter-early-pulse-example-v1.png', alt: 'Butter partly coated in gluten-free flour', title: 'Pulse briefly', caption: 'Stop before every piece disappears into the flour.' },
      { src: '/media/recipes/gluten-free-napoleon/selected/cold-butter-crumb-example-v1.png', alt: 'Sandy crumb with pea-sized pieces of butter', title: 'Ready texture', caption: 'A mix of sandy crumb and visible butter pieces is correct.' },
    ],
  },
  {
    number: '03',
    meta: 'Wet mixture',
    title: 'Mix the wet ingredients',
    body: 'Stir the eggs, cultured dairy, sunflower oil and lemon juice only until smooth. There is no need to add air.',
    ingredients: ['2 eggs', '250 g sour cream or thick yogurt', '50 g sunflower oil', '1 tbsp lemon juice'],
    media: [
      { src: '/media/recipes/gluten-free-napoleon/selected/wet-mixture-smooth-example-v1.png', alt: 'Wet ingredients mixed until smooth', title: 'Mix only until smooth', caption: 'The mixture should be even, without prolonged whisking.' },
    ],
  },
  {
    number: '04',
    meta: 'Food processor · short pulses',
    title: 'Combine the dough',
    body: 'Pour the wet mixture over the crumb and combine with short pulses. Add cold water only if the dough still will not gather.',
    ingredients: ['Wet mixture', '30–70 ml cold water, as needed'],
    checkpoint: 'Stop when the dough gathers into pliable clumps. It should not become a sticky paste.',
    media: [
      { src: '/media/recipes/gluten-free-napoleon/selected/pour-wet-into-crumb-example-v1.png', alt: 'Wet mixture being poured into the flour crumb', title: 'Add the wet mixture', caption: 'Pour it evenly over the crumb before pulsing.' },
      { src: '/media/recipes/gluten-free-napoleon/selected/pliable-dough-clumps-example-v1.png', alt: 'Pliable dough gathered into clumps', title: 'Stop at pliable clumps', caption: 'The dough should hold together without becoming sticky.' },
    ],
  },
  {
    number: '05',
    meta: 'One sheet per layer',
    title: 'Roll directly on parchment',
    body: 'Place each chilled disc on its own sheet and roll it into an even 28 cm circle. Bake on the same sheet—do not transfer the rolled dough.',
    ingredients: ['1 chilled dough disc', '1 sheet of baking parchment'],
    tip: 'Use the base of a 28 cm cake tin as a guide, leaving a small margin for trimming.',
    checkpoint: 'The layer should be evenly thin, with no thicker centre or dry, cracked edges.',
  },
];

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const rest = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${rest}`;
}

export function CookMode() {
  const [stepIndex, setStepIndex] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [remaining, setRemaining] = useState(steps[0].timerSeconds ?? 0);
  const step = steps[stepIndex];
  const progress = Math.round(((stepIndex + 1) / 17) * 100);
  const isComplete = completed.includes(stepIndex);

  useEffect(() => {
    if (!timerRunning || remaining <= 0) return;
    const interval = window.setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(interval);
  }, [timerRunning, remaining]);

  const ingredientLabel = useMemo(() => step.ingredients.join(', '), [step]);

  function goToStep(next: number) {
    const bounded = Math.max(0, Math.min(steps.length - 1, next));
    setStepIndex(bounded);
    setRemaining(steps[bounded].timerSeconds ?? 0);
    setTimerRunning(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function toggleComplete() {
    setCompleted((items) => isComplete ? items.filter((item) => item !== stepIndex) : [...items, stepIndex]);
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/recipes/napoleon-cake" className={styles.exit}><ArrowLeft size={17} /> Exit Cook Mode</Link>
        <Link href="/" className={styles.wordmark}>Bake Again<span>.</span></Link>
        <p>Napoleon cake</p>
      </header>

      <div className={styles.progressTrack} aria-label={`Step ${stepIndex + 1} of 17`}>
        <span style={{ width: `${progress}%` }} />
      </div>

      <div className={styles.shell}>
        <aside className={styles.rail} aria-label="Cook Mode progress">
          <p>Method</p>
          <strong>{stepIndex + 1} <span>/ 17</span></strong>
          <ol>
            {steps.map((item, index) => (
              <li key={item.number}>
                <button
                  className={`${index === stepIndex ? styles.activeStep : ''} ${completed.includes(index) && index !== stepIndex ? styles.completedStep : ''}`}
                  type="button"
                  onClick={() => goToStep(index)}
                  aria-current={index === stepIndex ? 'step' : undefined}
                >
                  <span>{completed.includes(index) && index !== stepIndex ? <Check size={13} /> : item.number}</span>{item.title}
                </button>
              </li>
            ))}
          </ol>
          <p className={styles.prototypeNote}>Previewing the first 5 of 17 steps</p>
        </aside>

        <article className={styles.step} aria-live="polite">
          <div className={styles.mobileProgress}><span>Step {stepIndex + 1} of 17</span><span>{progress}%</span></div>
          <p className={styles.meta}>{step.meta}</p>
          <h1>{step.title}</h1>

          {step.tip && (
            <aside className={styles.leadTip}>
              <Lightbulb size={19} />
              <strong>Tip</strong>
              <span>{step.tip}</span>
            </aside>
          )}

          <p className={styles.instruction}>{step.body}</p>

          <section className={styles.ingredientStrip} aria-label="Ingredients used in this step">
            <p>For this step</p>
            <strong>{ingredientLabel}</strong>
          </section>

          {step.checkpoint && (
            <aside className={styles.checkpoint}>
              <CheckCircle2 size={19} />
              <p><strong>Checkpoint</strong>{step.checkpoint}</p>
            </aside>
          )}

          {step.timerSeconds && (
            <section className={styles.timer} aria-label="Step timer">
              <div><Clock3 size={20} /><span><small>Optional timer</small><strong>{formatTime(remaining)}</strong></span></div>
              <div>
                <button type="button" onClick={() => setTimerRunning((value) => !value)}>{timerRunning ? <Pause size={16} /> : <Play size={16} fill="currentColor" />}{timerRunning ? 'Pause' : 'Start'}</button>
                <button type="button" aria-label="Reset timer" onClick={() => { setRemaining(step.timerSeconds ?? 0); setTimerRunning(false); }}><RotateCcw size={16} /></button>
              </div>
            </section>
          )}

          {step.media && (
            <div className={styles.mediaSequence} aria-label="Step visual sequence">
              {step.media.map((item, index) => (
                <figure key={item.src}>
                  <div><Image src={item.src} alt={item.alt} fill sizes="(min-width: 1000px) 28vw, 82vw" /><span>{String(index + 1).padStart(2, '0')}</span></div>
                  <figcaption><strong>{item.title}</strong>{item.caption}</figcaption>
                </figure>
              ))}
            </div>
          )}

          <button className={styles.ask} type="button" onClick={() => setAssistantOpen(true)}><MessageCircleQuestion size={17} /> Ask about this step</button>

          <div className={styles.stepActions}>
            <button type="button" onClick={() => goToStep(stepIndex - 1)} disabled={stepIndex === 0}><ChevronLeft size={18} /> Previous</button>
            <button className={isComplete ? styles.completed : undefined} type="button" onClick={toggleComplete}><Check size={18} />{isComplete ? 'Completed' : 'Mark step complete'}</button>
            <button type="button" onClick={() => goToStep(stepIndex + 1)} disabled={stepIndex === steps.length - 1}>Next <ChevronRight size={18} /></button>
          </div>
        </article>
      </div>

      <nav className={styles.mobileBar} aria-label="Step navigation">
        <button type="button" onClick={() => goToStep(stepIndex - 1)} disabled={stepIndex === 0} aria-label="Previous step"><ChevronLeft /></button>
        <button type="button" onClick={toggleComplete}><Check size={18} />{isComplete ? 'Completed' : 'Complete step'}</button>
        <button type="button" onClick={() => goToStep(stepIndex + 1)} disabled={stepIndex === steps.length - 1} aria-label="Next step"><ChevronRight /></button>
      </nav>

      {assistantOpen && (
        <div className={styles.assistantLayer} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setAssistantOpen(false)}>
          <dialog className={styles.assistant} open aria-modal="true" aria-labelledby="cook-assistant-title">
            <header><Sparkles size={19} /><div><p>Current step · {step.title}</p><h2 id="cook-assistant-title">Ask while you cook</h2></div><button type="button" onClick={() => setAssistantOpen(false)} aria-label="Close assistant"><X /></button></header>
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
      )}

    </main>
  );
}
