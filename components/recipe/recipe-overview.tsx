import type { StructuredRecipeContent } from '@/content/recipes/source-recipe.types';
import type { AppLocale } from '@/lib/i18n/config';
import { formatElapsedMinutes } from '@/lib/i18n/format';
import { getUiMessages } from '@/lib/i18n/messages';
import { EvidenceBadge } from './evidence-badge';
import { RecipeFacts } from './recipe-facts';
import styles from './recipe-overview.module.css';

function minutesLabel(locale: AppLocale, minutes: number | null | undefined) {
  if (minutes == null) return null;
  return formatElapsedMinutes(locale, minutes);
}

/** Shared recipe-detail composition, also demonstrated by the Design Lab. */
export function RecipeOverview({
  content,
  locale,
  showFlour = true,
  showWorkingRecord = true,
  expandEvidence = false,
}: {
  content: Pick<StructuredRecipeContent, 'overview' | 'evidence'> | null;
  locale: AppLocale;
  showFlour?: boolean;
  showWorkingRecord?: boolean;
  expandEvidence?: boolean;
}) {
  const messages = getUiMessages(locale).recipe;
  const overview = content?.overview;
  const totalTime = minutesLabel(locale, overview?.timing.totalElapsedMinutes);
  const note = overview?.timing.planningNote;
  const difficulty = overview?.difficulty;
  const longTestedExplanation =
    content?.evidence?.status === 'tested' &&
    content.evidence.explanation.length > 100;

  return (
    <div className={styles.overview}>
      {content?.evidence || showWorkingRecord ? (
        <div className={styles.evidence}>
          {content?.evidence ? (
            <>
              <EvidenceBadge
                className={styles.badge}
                locale={locale}
                status={content.evidence.status}
              />
              {content.evidence.explanation &&
                (longTestedExplanation && !expandEvidence ? (
                  <details className={styles.evidenceDetails}>
                    <summary>
                      {getUiMessages(locale).status.tested.explanation}
                    </summary>
                    <p>{content.evidence.explanation}</p>
                  </details>
                ) : (
                  <p>{content.evidence.explanation}</p>
                ))}
            </>
          ) : (
            <>
              <strong className={styles.draft}>{messages.workingRecord}</strong>
              <p>{messages.workingRecordExplanation}</p>
            </>
          )}
        </div>
      ) : null}
      <RecipeFacts
        className={styles.facts}
        items={[
          {
            label: messages.activeTime,
            value:
              minutesLabel(locale, overview?.timing.activeMinutes) ??
              messages.toConfirm,
          },
          {
            label: messages.yield,
            value: overview?.yieldLabel ?? messages.toConfirm,
          },
          {
            label: messages.difficulty,
            value:
              difficulty === 'easy'
                ? messages.difficultyEasy
                : difficulty === 'medium'
                  ? messages.difficultyMedium
                  : difficulty === 'advanced'
                    ? messages.difficultyAdvanced
                    : messages.toConfirm,
          },
        ]}
      />
      {totalTime || note ? (
        <div className={styles.planning}>
          {totalTime ? (
            <p>
              <span>{messages.totalTime}:</span> <strong>{totalTime}</strong>
            </p>
          ) : null}
          {note ? <p>{note}</p> : null}
        </div>
      ) : null}
      {showFlour ? (
        <dl className={styles.flour}>
          <div>
            <dt>{messages.flour}</dt>
            <dd>{overview?.flour || messages.toConfirm}</dd>
          </div>
        </dl>
      ) : null}
    </div>
  );
}
