import type { ReactNode } from 'react';
import { RecipeIngredientChecklist } from '@/components/recipe/recipe-ingredient-checklist';
import { RecipeSectionNavigation } from '@/components/recipe/recipe-reading-actions';
import { Button } from '@/components/ui/button';
import {
  napoleonLesson,
  napoleonLessonMinutes,
} from '@/content/commerce/lessons/napoleon';
import type { Recipe } from '@/content/recipes/recipe.types';
import { projectRecipeContent } from '@/content/recipes/registry';
import { LessonHighlights } from './lesson-highlights';
import styles from './lesson.module.css';

const ingredientsId = 'lesson-ingredients';

export function LessonAuthor() {
  const portrait = napoleonLesson.steps.find((step) => step.free)?.videos.uk
    ?.vertical.posterPath;
  return (
    <div className={styles.author}>
      {portrait && (
        <span className={styles.authorPortrait}>
          {/* oxlint-disable-next-line next/no-img-element -- Prepared WebP framed on the author. */}
          <img
            src={portrait}
            alt="Саша, авторка Bake Again"
            width={720}
            height={1280}
            loading="lazy"
          />
        </span>
      )}
      <p>Я Саша, 10 років печу без глютену для сина й для себе.</p>
    </div>
  );
}

export function LessonPreviewDetails({ author = true }: { author?: boolean }) {
  const stepCount = napoleonLesson.steps.length;
  return (
    <div>
      {author && <LessonAuthor />}
      <p className={styles.lead}>
        {stepCount} коротких кроків — від тіста до першого шматка. Покажу, що
        впливає на результат і чого не передасть текст рецепта.
      </p>
      <LessonHighlights />
      <ul className={styles.facts}>
        <li>
          Українською · {stepCount} кроків · {napoleonLessonMinutes} хв
        </li>
        <li>Телефон, планшет, ноутбук</li>
        <li>Рецепт на Schär Mix B</li>
        <li>Доступ без обмеження в часі</li>
      </ul>
    </div>
  );
}

export function LessonIngredientsNavigation() {
  return (
    <RecipeSectionNavigation
      locale="uk"
      ingredientsHref={`#${ingredientsId}`}
      methodHref={null}
    />
  );
}

export function LessonPurchase({ action }: { action: ReactNode }) {
  return (
    <section className={styles.purchase} aria-labelledby="lesson-buy-title">
      <div className={styles.actionHeading}>
        <h2 id="lesson-buy-title">Від тіста до першого шматка</h2>
        {action ?? <Button disabled>Урок у підготовці</Button>}
      </div>
      <p>
        {action
          ? 'Після оплати урок відкриється тут. Посилання на урок прийде на email, який вкажеш під час оплати.'
          : 'Ціну й купівлю відкрию після перевірки уроку.'}
      </p>
    </section>
  );
}

export function LessonSignIn({
  children,
  preview = false,
}: {
  children?: ReactNode;
  preview?: boolean;
}) {
  if (!children) {
    return (
      <p className={styles.signInLink}>
        Уже маєш покупку?{' '}
        {preview ? (
          <Button variant="link" disabled>
            Увійти за email покупки
          </Button>
        ) : (
          <Button href="?login=1#lesson-login" variant="link">
            Увійти за email покупки
          </Button>
        )}
      </p>
    );
  }
  return (
    <section
      className={styles.login}
      id="lesson-login"
      aria-labelledby="lesson-login-title"
    >
      <h2 id="lesson-login-title">Уже маєш покупку?</h2>
      <p className={styles.loginHint}>
        Надішлю посилання для входу на email покупки.
      </p>
      {children}
    </section>
  );
}

export function LessonIngredients({ recipe }: { recipe: Recipe }) {
  const { ingredientSections, overview } = projectRecipeContent(recipe, 'uk');
  return (
    <section className={styles.ingredients} aria-labelledby={ingredientsId}>
      <h2 id={ingredientsId} tabIndex={-1}>
        Інгредієнти
      </h2>
      {overview.yieldLabel && (
        <p className={styles.meta}>Вихід: {overview.yieldLabel}</p>
      )}
      <RecipeIngredientChecklist
        className={styles.ingredientGroups}
        sections={ingredientSections}
        locale="uk"
      />
    </section>
  );
}
