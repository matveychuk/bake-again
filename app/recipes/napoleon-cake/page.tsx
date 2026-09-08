/* oxlint-disable next/no-html-link-for-pages -- vinext preview currently fails when next/link is hydrated */
import Image from 'next/image';
import {
  ArrowLeft,
  Bookmark,
  Check,
  ChevronDown,
  Clock3,
  Play,
  ShoppingBag,
} from 'lucide-react';
import styles from './recipe.module.css';
import { StepMediaSequence, type StepMediaItem } from './step-media-sequence';
import { AssistantTrigger, RecipeAssistantProvider } from './recipe-assistant';
import { RecipeAdjuster } from './recipe-adjuster';
import { StepTip } from './step-tip';

const prototypeMedia: StepMediaItem[] = [
  { id: 'butter-ready', src: '/media/recipes/gluten-free-napoleon/selected/cold-butter-ready-example-v1.png', alt: 'Cold butter cubes beside the dry flour mixture in a food processor', title: 'Start cold', caption: 'Cube the butter and chill it for 10–15 minutes.' },
  { id: 'butter-early-pulse', src: '/media/recipes/gluten-free-napoleon/selected/cold-butter-early-pulse-example-v1.png', alt: 'Large pieces of butter partly coated in gluten-free flour after a few pulses', title: 'Pulse briefly', caption: 'Stop before every piece of butter disappears into the flour.' },
  { id: 'butter-final-crumb', src: '/media/recipes/gluten-free-napoleon/selected/cold-butter-crumb-example-v1.png', alt: 'Gluten-free flour mixture with a sandy crumb and visible pea-sized pieces of cold butter', title: 'Look for this texture', caption: 'Some should look sandy while pea-sized pieces remain visible.' },
  { id: 'wet-mixture-smooth', src: '/media/recipes/gluten-free-napoleon/selected/wet-mixture-smooth-example-v1.png', alt: 'Eggs, cultured dairy, sunflower oil and lemon juice mixed until smooth', title: 'Mix only until smooth', caption: 'The wet ingredients should be even, without prolonged whisking.' },
  { id: 'pour-wet-mixture', src: '/media/recipes/gluten-free-napoleon/selected/pour-wet-into-crumb-example-v1.png', alt: 'Smooth wet mixture being poured into the flour and butter crumb', title: 'Add the wet mixture', caption: 'Pour it over the crumb before using short pulses.' },
  { id: 'dough-clumps', src: '/media/recipes/gluten-free-napoleon/selected/pliable-dough-clumps-example-v1.png', alt: 'Pliable Napoleon dough gathered into irregular clumps in a food processor', title: 'Stop at pliable clumps', caption: 'The dough should hold together without becoming a sticky paste.' },
];

type PrototypeStep = {
  number: string;
  title: string;
  body: string;
  meta: string;
  guidance?: string;
  tips?: string[];
  mediaIds?: string[];
};

const firstSteps: PrototypeStep[] = [
  {
    number: '01',
    title: 'Mix the dry ingredients',
    body: 'In a food processor, mix the Schär Mix B, both starches, xanthan, baking powder, salt and sugar for 5–10 seconds.',
    meta: '5–10 sec · food processor',
  },
  {
    number: '02',
    title: 'Cut in the cold butter',
    body: 'Cube the cold butter, freeze it for 10–15 minutes, add it to the dry mixture and pulse about ten times.',
    meta: '10–15 min · food processor',
    guidance: 'Look for an uneven crumb: some sandy, with some pea-sized pieces of butter.',
    mediaIds: ['butter-ready', 'butter-early-pulse', 'butter-final-crumb'],
  },
  {
    number: '03',
    title: 'Add the wet ingredients',
    body: 'Mix the eggs, chosen cultured dairy, sunflower oil and lemon juice only until smooth.',
    meta: 'Wet mixture',
    mediaIds: ['wet-mixture-smooth'],
  },
  {
    number: '04',
    title: 'Combine the dough',
    body: 'Pour the liquid into the dry mixture and combine with short pulses. Add cold water only as needed.',
    meta: 'Food processor · short pulses',
    guidance: 'The dough should gather into pliable clumps, not become a sticky paste.',
    mediaIds: ['pour-wet-mixture', 'dough-clumps'],
  },
  {
    number: '05',
    title: 'Roll directly on parchment',
    body: 'Place each chilled disc on its own sheet of parchment and roll it into an even 28 cm circle. Bake it on the same sheet—do not transfer the rolled dough.',
    meta: 'One sheet per layer',
    tips: ['Use the base of a 28 cm cake tin as a guide, leaving a small margin for trimming.'],
    guidance: 'The layer should be evenly thin, with no thicker centre or dry, cracked edges.',
  },
];

export default function NapoleonRecipePage() {
  return (
    <RecipeAssistantProvider>
    <main className={styles.page}>
      <header className="site-header">
        <a className="wordmark" href="/" aria-label="Bake Again home">
          Bake Again<span aria-hidden="true">.</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="/#recipes">Recipes</a>
          <a href="#saved">Saved</a>
          <a className="nav-bag" href="#shopping-list">
            <ShoppingBag aria-hidden="true" size={17} strokeWidth={1.7} />
            Shopping list
          </a>
        </nav>
        <button className="language-button" type="button" aria-label="Change language">
          EN <ChevronDown aria-hidden="true" size={15} />
        </button>
      </header>

      <div className={styles.breadcrumb}>
        <a href="/"><ArrowLeft size={15} /> Recipes</a>
        <span>Celebration</span>
      </div>

      <section className={styles.hero}>
        <div className={styles.heroImage}>
          <Image
            src="/images/napoleon.png"
            alt="Gluten-free Napoleon cake with many thin layers and a cut slice"
            fill
            priority
            sizes="(min-width: 900px) 48vw, 100vw"
          />
        </div>

        <div className={styles.heroCopy}>
          <div className={styles.heroTopline}>
            <p>Celebration · prepare ahead</p>
            <button type="button" aria-label="Save Napoleon cake"><Bookmark size={20} /></button>
          </div>
          <h1>Gluten-Free<br /><em>Napoleon Cake</em></h1>
          <p className={styles.summary}>Two cakes with six thin 28 cm layers each, warm custard and nuts.</p>

          <div className={styles.tested}>
            <span><Check size={15} strokeWidth={2.5} /> Repeatedly verified</span>
            <p>This exact base has been baked successfully many times.</p>
          </div>

          <dl className={styles.facts}>
            <div><dt>Active time</dt><dd>1 hour</dd></div>
            <div><dt>Yield</dt><dd>2 cakes · 6 layers each</dd></div>
            <div><dt>Form</dt><dd>28 cm round</dd></div>
            <div><dt>Flour</dt><dd>Schär Mix B <AssistantTrigger scope="flour" label="Another mix?" compact /></dd></div>
          </dl>

          <div className={styles.actions}>
            <a className={styles.primaryAction} href="/recipes/napoleon-cake/cook"><Play size={17} fill="currentColor" /> Start Cook Mode</a>
            <button type="button"><ShoppingBag size={17} /> Add ingredients</button>
            <AssistantTrigger scope="recipe" label="Ask about this recipe" />
          </div>
        </div>
      </section>

      <section className={styles.beforeStart} aria-labelledby="before-start-title">
        <div>
          <p className={styles.eyebrow}>Before you start</p>
          <h2 id="before-start-title">Plan for the rest.</h2>
        </div>
        <div className={styles.planGrid}>
          <article><Clock3 size={19} /><strong>Chill the dough</strong><p>At least 2 hours, or leave the twelve wrapped discs overnight.</p></article>
          <article><span className={styles.planNumber}>12</span><strong>Prepare the parchment</strong><p>Have at least twelve sheets ready—one for rolling and baking each layer.</p></article>
          <article><span className={styles.planNumber}>24h</span><strong>Best the next day</strong><p>Rest 1 hour at room temperature, then refrigerate for 12–24 hours.</p></article>
        </div>
      </section>

      <RecipeAdjuster />

      <section className={styles.method} id="method" aria-labelledby="method-title">
        <div className={styles.methodHeading}>
          <div><p className={styles.eyebrow}>Method · 17 steps</p><h2 id="method-title">Begin with the dough.</h2></div>
          <a className={styles.primaryAction} href="/recipes/napoleon-cake/cook"><Play size={17} fill="currentColor" /> Open Cook Mode</a>
        </div>
        <div className={styles.steps}>
          {firstSteps.map((step) => (
            <article className={step.mediaIds ? styles.stepWithMedia : undefined} id={`step-${Number(step.number)}`} key={step.number}>
              <span>{step.number}</span>
              {step.tips ? <StepTip meta={step.meta} title={step.title} body={step.body} tips={step.tips} guidance={step.guidance} /> : <div><p className={styles.stepMeta}>{step.meta}</p><h3>{step.title}</h3><p>{step.body}</p>
                {step.guidance && <aside className={`${styles.stepCallout} ${styles.stepCheckpoint}`}><Check size={15} /><p><strong>Checkpoint</strong>{step.guidance}</p></aside>}
                <AssistantTrigger scope="step" stepTitle={step.title} label="Ask about this step" compact />
              </div>}
              {step.mediaIds && <StepMediaSequence items={prototypeMedia.filter((item) => step.mediaIds?.includes(item.id))} />}
            </article>
          ))}
        </div>
      </section>
    </main>
    </RecipeAssistantProvider>
  );
}
