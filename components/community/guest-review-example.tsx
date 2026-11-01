'use client';
import { useState } from 'react';
import type { AppLocale } from '@/lib/i18n/config';
import { GuestReviewForm } from './guest-review-form';
import fields from '@/components/account/account.module.css';
import styles from './guest-review-example.module.css';

export function GuestReviewExample() {
  const [locale, setLocale] = useState<AppLocale>('uk');
  const [scenario, setScenario] = useState('pending');
  const [version, setVersion] = useState(0);
  return (
    <div className={styles.example}>
      <fieldset className={styles.settings}>
        <legend>Перевірка прикладу</legend>
        <label className={fields.field}>
          Мова форми
          <select
            value={locale}
            onChange={(event) => {
              setLocale(event.target.value as AppLocale);
              setVersion((v) => v + 1);
            }}
          >
            <option value="uk">Українська</option>
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </label>
        <label className={fields.field}>
          Відповідь у прикладі
          <select
            value={scenario}
            onChange={(event) => {
              setScenario(event.target.value);
              setVersion((v) => v + 1);
            }}
          >
            <option value="pending">На перевірці</option>
            <option value="published">Опубліковано</option>
            <option value="error">Помилка надсилання</option>
          </select>
        </label>
      </fieldset>
      <GuestReviewForm
        key={`${locale}-${scenario}-${version}`}
        locale={locale}
        recipeId="crepes"
        demo
        submitReview={async () => {
          await new Promise((resolve) => setTimeout(resolve, 600));
          if (scenario === 'error') throw new Error('DESIGN_LAB_SIMULATION');
          return {
            status: scenario === 'published' ? 'published' : 'pending',
            photosAccepted: true,
          };
        }}
      />
    </div>
  );
}
