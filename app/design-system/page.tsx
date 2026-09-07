import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Calculator,
  Check,
  Clock3,
  Lightbulb,
  Search,
} from 'lucide-react';
import styles from './design-system.module.css';

export const metadata: Metadata = {
  title: 'Design System v1 — Bake Again',
  description: 'Approved Warm Precision foundations, components and product rules.',
};

const colours = [
  { name: 'Page', token: 'background.page', value: '#FAF6EF', className: styles.cream },
  { name: 'Surface', token: 'background.surface', value: '#FFFDF9', className: styles.white },
  { name: 'Panel', token: 'background.panel', value: '#EEE7DD', className: styles.linen },
  { name: 'Primary text', token: 'text.primary', value: '#392721', className: styles.chocolate },
  { name: 'Secondary text', token: 'text.secondary', value: '#735D54', className: styles.cocoa },
  { name: 'Primary action', token: 'action.primary', value: '#A64F36', className: styles.terracotta },
];

const space = [4, 8, 12, 16, 24, 32, 48, 64, 96];

function StatusBadge({ status }: { status: 'tested' | 'calculated' | 'suggested' }) {
  const content = {
    tested: { label: 'Tested', Icon: Check },
    calculated: { label: 'Calculated', Icon: Calculator },
    suggested: { label: 'Suggested', Icon: Lightbulb },
  }[status];

  return (
    <span className={`${styles.statusBadge} ${styles[status]}`}>
      <content.Icon aria-hidden="true" size={16} strokeWidth={2} />
      <strong>{content.label}</strong>
    </span>
  );
}

export default function DesignSystemPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.wordmark} href="/">
          Bake Again<span>.</span>
        </Link>
        <span className={styles.version}>Design System · v1.0</span>
        <Link className={styles.backLink} href="/">
          <ArrowLeft aria-hidden="true" size={17} /> Homepage
        </Link>
      </header>

      <div className={styles.shell}>
        <aside className={styles.sidebar} aria-label="Design system sections">
          <p>Approved foundation</p>
          <nav>
            <a href="#principles">01 · Principles</a>
            <a href="#colour">02 · Colour</a>
            <a href="#type">03 · Typography</a>
            <a href="#space">04 · Space & shape</a>
            <a href="#components">05 · Components</a>
            <a href="#evidence">06 · Evidence</a>
          </nav>
          <div className={styles.sidebarNote}>
            <span>Direction</span>
            <strong>Warm Precision</strong>
            <small>Review applied</small>
          </div>
        </aside>

        <div className={styles.content}>
          <section className={styles.intro} id="principles">
            <p className={styles.eyebrow}>Bake Again · product design language</p>
            <h1>Warm enough to invite.<br /><em>Precise enough to trust.</em></h1>
            <p className={styles.lead}>
              Food leads. Structure clarifies. Every claim about a recipe is tied to the
              exact version that was baked.
            </p>
            <div className={styles.principles}>
              <span>Practical before editorial</span>
              <span>Quality before quantity</span>
              <span>Clear uncertainty</span>
            </div>
          </section>

          <section className={styles.section} id="colour">
            <div className={styles.sectionHeading}>
              <span>02</span>
              <div><p>Foundation</p><h2>Colour with quiet confidence.</h2></div>
            </div>
            <div className={styles.colourGrid}>
              {colours.map((colour) => (
                <article className={styles.colourCard} key={colour.token}>
                  <div className={`${styles.swatch} ${colour.className}`} />
                  <strong>{colour.name}</strong>
                  <code>{colour.token}</code>
                  <small>{colour.value}</small>
                </article>
              ))}
            </div>
            <p className={styles.guidance}>
              Cream carries the page; linen separates practical areas; terracotta marks
              action and proof. Large areas of saturated colour are exceptional.
            </p>
          </section>

          <section className={styles.section} id="type">
            <div className={styles.sectionHeading}>
              <span>03</span>
              <div><p>Foundation</p><h2>Editorial voice, practical reading.</h2></div>
            </div>
            <div className={styles.typeGrid}>
              <article className={styles.typeDisplay}>
                <p>Display · Newsreader</p>
                <strong>Bake what you love.<br /><em>Know what works.</em></strong>
                <small>Page titles, recipe names and editorial emphasis</small>
              </article>
              <article className={styles.typeBody}>
                <p>Body · Manrope</p>
                <strong>Clear instructions for real home baking.</strong>
                <span>
                  Exact ingredients, observable checkpoints and useful context come before
                  background story.
                </span>
                <small>Navigation, controls, ingredients, method and metadata</small>
              </article>
            </div>
          </section>

          <section className={styles.section} id="space">
            <div className={styles.sectionHeading}>
              <span>04</span>
              <div><p>Foundation</p><h2>Whitespace does the organising.</h2></div>
            </div>
            <div className={styles.spaceScale}>
              {space.map((value) => (
                <div key={value}>
                  <span style={{ width: `${Math.max(value, 8)}px`, height: `${Math.max(value, 8)}px` }} />
                  <small>{value}</small>
                </div>
              ))}
            </div>
            <div className={styles.shapeNotes}>
              <p><strong>4px</strong> for compact functional labels.</p>
              <p><strong>Square surfaces</strong> for content and controls.</p>
              <p><strong>Circles</strong> only for save actions and proof marks.</p>
            </div>
          </section>

          <section className={styles.section} id="components">
            <div className={styles.sectionHeading}>
              <span>05</span>
              <div><p>Base components</p><h2>Useful controls, with little chrome.</h2></div>
            </div>

            <div className={styles.componentBlock}>
              <div className={styles.componentLabel}><strong>Actions</strong><span>Default · hover · focus · disabled</span></div>
              <div className={styles.actionRow}>
                <button className={styles.primaryButton} type="button">View recipe</button>
                <button className={styles.secondaryButton} type="button">Save for later</button>
                <button className={styles.textButton} type="button">See all recipes <ArrowRight size={17} /></button>
                <button className={styles.primaryButton} type="button" disabled>Unavailable</button>
              </div>
            </div>

            <div className={styles.componentBlock}>
              <div className={styles.componentLabel}><strong>Search</strong><span>One clear task and one primary action</span></div>
              <form className={styles.searchExample} action="#components">
                <Search aria-hidden="true" size={20} strokeWidth={1.8} />
                <label className="sr-only" htmlFor="ds-search">Search recipes</label>
                <input id="ds-search" placeholder="What would you like to bake?" />
                <button type="submit">Search</button>
              </form>
            </div>

            <div className={styles.componentBlock}>
              <div className={styles.componentLabel}><strong>Recipe card</strong><span>Food, decision facts, concise evidence</span></div>
              <article className={styles.recipeExample}>
                <div className={styles.recipeImage}>
                  <Image src="/images/napoleon.png" alt="Napoleon cake with many thin layers" fill sizes="420px" />
                </div>
                <div className={styles.recipeCopy}>
                  <div><p>Celebration · prepare ahead</p><h3>Napoleon cake</h3></div>
                  <button type="button" aria-label="Save Napoleon cake"><Bookmark size={19} /></button>
                </div>
                <div className={styles.recipeFacts}>
                  <span><Clock3 size={15} />12 layers · 28 cm</span>
                  <span><StatusBadge status="tested" /> · Schär Mix B</span>
                </div>
              </article>
            </div>
          </section>

          <section className={`${styles.section} ${styles.evidenceSection}`} id="evidence">
            <div className={styles.sectionHeading}>
              <span>06</span>
              <div><p>Trust language</p><h2>Show exactly what the evidence supports.</h2></div>
            </div>
            <div className={styles.evidenceGrid}>
              <article>
                <StatusBadge status="tested" />
                <p>Baked as written.</p>
                <small>Example: Tested · Schär Mix B</small>
              </article>
              <article>
                <StatusBadge status="calculated" />
                <p>Quantities scaled. This version has not been bake-tested.</p>
                <small>A tested original can have a calculated variation.</small>
              </article>
              <article>
                <StatusBadge status="suggested" />
                <p>An idea to try. This change has not been bake-tested.</p>
                <small>Use for substitutions and other proposed changes.</small>
              </article>
            </div>
            <div className={styles.provenanceNote}>
              <Check aria-hidden="true" size={20} />
              <div><strong>Tested configuration</strong><p>Schär Mix B · 28 cm round form · 12 layers</p></div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
