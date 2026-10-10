'use client';
import { useState } from 'react';
import {
  AccountHeading,
  AccountFields,
  AccountIdentity,
  AccountDestinations,
  AccountSettings,
  CollectionEditor,
} from './account-page';
import { accountCopy } from './copy';
import type { AppLocale } from '@/lib/i18n/config';
import styles from './account.module.css';
export function AccountExample({ locale }: { locale: AppLocale }) {
  const [collection, setCollection] = useState({
    id: 'weekend',
    name:
      locale === 'uk'
        ? 'Випічка на вихідні для всієї родини'
        : locale === 'es'
          ? 'Recetas para hornear en familia el fin de semana'
          : 'Weekend baking for the whole family',
    recipeIds: ['napoleon'],
  });
  const c = accountCopy[locale];
  return (
    <div className={styles.page} lang={locale} data-account-example={locale}>
      <AccountHeading locale={locale} headingLevel={2} onSignOut={() => {}} />
      <AccountIdentity
        locale={locale}
        email="baker.with.a.long.email.address@example.com"
      />
      <AccountDestinations locale={locale} />
      <AccountSettings
        locale={locale}
        onPassword={(event) => event.preventDefault()}
      />
      <div className={styles.section}>
        <AccountFields
          locale={locale}
          onSubmit={(event) => event.preventDefault()}
        />
      </div>
      <p className={styles.notice}>{c.rateLimited}</p>
      <h2>{c.collections}</h2>
      <CollectionEditor
        locale={locale}
        value={collection}
        recipes={[
          {
            id: 'napoleon',
            title:
              locale === 'uk'
                ? 'Безглютеновий Наполеон із заварним кремом'
                : locale === 'es'
                  ? 'Napoleón sin gluten con crema pastelera'
                  : 'Gluten-free Napoleon with custard',
          },
          {
            id: 'banana-bread',
            title:
              locale === 'uk'
                ? 'Банановий хліб'
                : locale === 'es'
                  ? 'Pan de plátano'
                  : 'Banana bread',
          },
        ]}
        onChange={setCollection}
        onRemove={() =>
          setCollection({ ...collection, name: c.noCollections, recipeIds: [] })
        }
      />
      <p className={styles.notice}>{c.gateBody}</p>
    </div>
  );
}
