/* oxlint-disable next/no-html-link-for-pages -- vinext preview currently fails when next/link is hydrated */
import Image from 'next/image';
import {
  ArrowLeft,
  Bookmark,
  Calculator,
  Check,
  ChevronDown,
  Clock3,
  Info,
  Play,
  Plus,
  ShoppingBag,
} from 'lucide-react';
import styles from './recipe.module.css';

const layerIngredients = [
  ['450 g', 'Schär Mix B Bread flour mix'],
  ['80 g', 'Tapioca starch'],
  ['40 g', 'Corn starch'],
  ['3 g', 'Xanthan gum', 'Only if the flour mix does not contain it'],
  ['8 g', 'Baking powder'],
  ['¼ tsp', 'Salt'],
  ['1 tbsp', 'Sugar'],
  ['120 g', 'Butter', 'Cold, cut into cubes'],
  ['50 g', 'Sunflower oil'],
  ['250 g', 'Sour cream or thick natural yogurt', 'Choose one · final default pending'],
  ['2', 'Eggs'],
  ['1 tbsp', 'Lemon juice'],
  ['30–70 ml', 'Cold water', 'As needed'],
];

const firstSteps = [
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
  },
  {
    number: '03',
    title: 'Add the wet ingredients',
    body: 'Mix the eggs, chosen cultured dairy, sunflower oil and lemon juice only until smooth, then combine with short pulses.',
    meta: 'Add cold water only as needed',
    guidance: 'The dough should gather into pliable clumps, not become a sticky paste.',
  },
];

export default function NapoleonRecipePage() {
  return (
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
            <div><dt>Flour</dt><dd>Schär Mix B</dd></div>
          </dl>

          <div className={styles.actions}>
            <a className={styles.primaryAction} href="#method"><Play size={17} fill="currentColor" /> Start Cook Mode</a>
            <button type="button"><ShoppingBag size={17} /> Add ingredients</button>
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
          <article><span className={styles.planNumber}>12</span><strong>Roll on parchment</strong><p>Roll each thin layer on the sheet you will bake it on.</p></article>
          <article><span className={styles.planNumber}>24h</span><strong>Best the next day</strong><p>Rest 1 hour at room temperature, then refrigerate for 12–24 hours.</p></article>
        </div>
      </section>

      <section className={styles.planning}>
        <aside className={styles.controls} aria-label="Recipe configuration">
          <p className={styles.eyebrow}>Your bake</p>
          <h2>Choose the form</h2>
          <label className={styles.choice} aria-label="Use the repeatedly verified 28 centimetre form">
            <input type="radio" name="form" defaultChecked />
            <span><strong>28 cm · 2 cakes</strong><small><Check size={13} /> Repeatedly verified</small></span>
          </label>
          <label className={`${styles.choice} ${styles.choiceCalculated}`} aria-label="Preview the calculated 24 centimetre form">
            <input type="radio" name="form" />
            <span><strong>24 cm · preview</strong><small><Calculator size={13} /> Calculated</small></span>
          </label>
          <div className={styles.calculatedNote}>
            <Info size={16} />
            <p>Quantities can be previewed, but this version is not bake-tested and cannot open in Cook Mode yet.</p>
          </div>
          <button className={styles.addBatch} type="button"><Plus size={16} /> Add another batch</button>
        </aside>

        <section className={styles.ingredients} aria-labelledby="ingredients-title">
          <div className={styles.sectionTitle}>
            <div><p className={styles.eyebrow}>Exact tested base</p><h2 id="ingredients-title">Ingredients</h2></div>
            <button type="button"><ShoppingBag size={16} /> Add all</button>
          </div>
          <div className={styles.ingredientGroup}>
            <h3>Layers</h3>
            {layerIngredients.map(([amount, ingredient, note]) => (
              <label className={styles.ingredient} key={ingredient}>
                <input type="checkbox" />
                <span className={styles.amount}>{amount}</span>
                <span>{ingredient}{note && <small>{note}</small>}</span>
              </label>
            ))}
          </div>
          <div className={styles.provisional}>
            <Info size={17} />
            <p><strong>One choice still needs confirmation.</strong> The source allows sour cream or thick natural yogurt, but does not yet identify the default or test scope of each.</p>
          </div>
          <div className={styles.collapsedGroups}>
            <button type="button"><span><small>9 ingredients</small>Custard</span><ChevronDown size={18} /></button>
            <button type="button"><span><small>2 ingredients</small>Nuts &amp; finish</span><ChevronDown size={18} /></button>
          </div>
        </section>
      </section>

      <section className={styles.method} id="method" aria-labelledby="method-title">
        <div className={styles.methodHeading}>
          <div><p className={styles.eyebrow}>Method · 17 steps</p><h2 id="method-title">Begin with the dough.</h2></div>
          <a className={styles.primaryAction} href="#step-1"><Play size={17} fill="currentColor" /> Open Cook Mode</a>
        </div>
        <div className={styles.steps}>
          {firstSteps.map((step) => (
            <article id={step.number === '01' ? 'step-1' : undefined} key={step.number}>
              <span>{step.number}</span>
              <div><p className={styles.stepMeta}>{step.meta}</p><h3>{step.title}</h3><p>{step.body}</p>
                {step.guidance && <aside><Check size={15} /><p><strong>Checkpoint</strong>{step.guidance}</p></aside>}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
