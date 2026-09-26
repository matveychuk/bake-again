import { cn } from '@/lib/utils';
import type { AppLocale } from '@/lib/i18n/config';
import { getUiMessages } from '@/lib/i18n/messages';
import styles from './recipe-ingredient-list.module.css';

export type RecipeIngredientListItem = {
  id: string;
  name: string;
  primary?: string;
  secondary?: string;
  note?: string;
  notes?: string[];
  optional?: boolean;
  after?: React.ReactNode;
};

export function RecipeIngredientList({
  items,
  className,
  locale = 'en',
  variant = 'full',
}: {
  items: RecipeIngredientListItem[];
  className?: string;
  locale?: AppLocale;
  variant?: 'full' | 'compact';
}) {
  const optionalLabel = getUiMessages(locale).recipe.optional;

  return (
    <ul
      className={cn(
        styles.list,
        variant === 'compact' && styles.compact,
        className,
      )}
    >
      {items.map((item) => {
        const notes = [
          ...new Set(
            [item.note, ...(item.notes ?? [])].filter((note): note is string =>
              Boolean(note),
            ),
          ),
        ];
        const primary =
          notes.length > 0 &&
          item.primary === getUiMessages(locale).personal.asNeeded
            ? undefined
            : item.primary;
        return (
          <li key={item.id}>
            <div className={styles.copy}>
              <span>
                {item.name}
                {item.optional ? ` (${optionalLabel})` : ''}
              </span>
              {notes.map((note) => (
                <small key={note}>{note}</small>
              ))}
              {item.after && <div className={styles.after}>{item.after}</div>}
            </div>
            {(primary || item.secondary) && (
              <div className={styles.amounts}>
                {primary && <strong>{primary}</strong>}
                {item.secondary && <span>{item.secondary}</span>}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
