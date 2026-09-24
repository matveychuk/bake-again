import type { AppLocale } from '@/lib/i18n/config';
import {
  softenButter,
  softenButterSource,
} from '@/content/techniques/soften-butter';
import { EvidenceBadge } from '@/components/recipe/evidence-badge';
import { RecipeStepGuidance } from '@/components/recipe/recipe-step-guidance';
import styles from './technique.module.css';

/** The page and contextual drawer share the same method and readiness cue. */
export function TechniqueGuide({
  locale,
  compact = false,
}: {
  locale: AppLocale;
  compact?: boolean;
}) {
  const t = softenButter[locale];
  return (
    <div className={styles.guide}>
      <p>{t.equipment}</p>
      <h2>{t.method}</h2>
      <ol className={styles.steps}>
        {t.steps.map(([title, body]) => (
          <li key={title}>
            <h3>{title}</h3>
            <p>{body}</p>
          </li>
        ))}
      </ol>
      <RecipeStepGuidance kind="checkpoint" label={t.readyTitle}>
        {t.ready}
      </RecipeStepGuidance>
      {!compact && (
        <section>
          <h2>{t.alternativeTitle}</h2>
          <p>{t.alternative}</p>
        </section>
      )}
      <section>
        <h2>{t.mistakeTitle}</h2>
        <p>{t.mistake}</p>
      </section>
      <div className={styles.provenance}>
        <EvidenceBadge status="suggested" locale={locale} />
        <p>{t.provenance}</p>
        <a href={softenButterSource}>{t.source}</a>
      </div>
    </div>
  );
}
