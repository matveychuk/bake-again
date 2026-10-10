'use client';
import { useAccount } from '@/components/account/account-provider';
import { requestPersonalAction } from '@/lib/personal/action-gate';
import { accountCopy } from '@/components/account/copy';

import { Button } from '@/components/ui/button';

import { Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { BakeCheckbox } from '@/components/ui/bake-checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  ingredientName,
  itemNotes,
  sourceRecipes,
} from '@/content/recipes/shopping-copy';
import { type RecipeCatalogEntry } from '@/content/recipes/catalog';
import type { AppLocale } from '@/lib/i18n/config';
import { getUiMessages } from '@/lib/i18n/messages';
import { formatQuantity as formatLocalizedQuantity } from '@/lib/i18n/format';
import { localeHomePath } from '@/lib/i18n/routes';
import {
  clearShopping,
  readShopping,
  removeCheckedShoppingItems,
  removeShoppingItem,
  restoreShoppingItem,
  setShoppingItemChecked,
  subscribeToShopping,
  type ShoppingItemV1,
} from '@/lib/persistence/shopping';
import styles from './personal-state.module.css';

export function ShoppingListPage({
  locale,
  catalog,
}: {
  locale: AppLocale;
  catalog: RecipeCatalogEntry[];
}) {
  const [items, setItems] = useState<ShoppingItemV1[]>([]);
  const [removed, setRemoved] = useState<ShoppingItemV1 | null>(null);
  const [clearOpen, setClearOpen] = useState(false);
  const messages = getUiMessages(locale).personal;
  const account = useAccount();
  const ac = accountCopy[locale];
  const checkedCount = useMemo(
    () => items.filter((item) => item.checked).length,
    [items],
  );
  const allBought = items.length > 0 && checkedCount === items.length;

  useEffect(() => {
    const update = () => setItems(readShopping().items);
    update();
    return subscribeToShopping(update);
  }, []);

  function removeOne(item: ShoppingItemV1) {
    setRemoved(item);
    setItems(removeShoppingItem(item.id).items);
  }

  function undoRemove() {
    if (!removed) return;
    setItems(restoreShoppingItem(removed).items);
    setRemoved(null);
  }

  if (!account.engine)
    return (
      <section className={styles.page} aria-labelledby="shopping-title">
        <div className={styles.heading}>
          <p>{messages.shoppingEyebrow}</p>
          <h1 id="shopping-title" tabIndex={-1}>
            {messages.shoppingTitle}
          </h1>
        </div>
        <div className={styles.guest}>
          <output aria-live="polite">
            {!account.ready
              ? ac.loading
              : account.identity
                ? ac.error
                : ac.guest}
          </output>
          {account.ready &&
            (account.identity ? (
              <Button href={`/${locale}/account`}>{ac.settings}</Button>
            ) : (
              <Button onClick={() => requestPersonalAction(locale, () => {})}>
                {ac.login}
              </Button>
            ))}
        </div>
      </section>
    );
  return (
    <section className={styles.page} aria-labelledby="shopping-title">
      <div className={styles.heading}>
        <p>{messages.shoppingEyebrow}</p>
        <h1 id="shopping-title" tabIndex={-1}>
          {messages.shoppingTitle}
        </h1>
        <span>{messages.storedInBrowser}</span>
      </div>

      {(account.error || account.engine.error) && (
        <p role="alert">{ac.saveError}</p>
      )}
      {items.length === 0 ? (
        <div className={styles.empty}>
          <h2>{messages.shoppingEmpty}</h2>
          <p>{messages.shoppingEmptyBody}</p>
          <Button href={localeHomePath(locale)}>
            {messages.browseRecipes}
          </Button>
        </div>
      ) : (
        <div className={styles.shoppingContent}>
          <div className={styles.listActions}>
            <button
              disabled={checkedCount === 0}
              onClick={() => setItems(removeCheckedShoppingItems().items)}
              type="button"
            >
              {messages.removeChecked(checkedCount)}
            </button>
            <AlertDialog open={clearOpen} onOpenChange={setClearOpen}>
              <AlertDialogTrigger className={styles.clearAll}>
                {messages.clearAll}
              </AlertDialogTrigger>
              <AlertDialogContent className={styles.clearDialog}>
                <AlertDialogHeader>
                  <AlertDialogTitle>{messages.clearAllTitle}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {messages.clearAllDescription}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className={styles.clearDialogFooter}>
                  <AlertDialogCancel className={styles.dialogCancel}>
                    {messages.cancel}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className={styles.dialogConfirm}
                    onClick={() => {
                      setItems(clearShopping().items);
                      setRemoved(null);
                      setClearOpen(false);
                    }}
                  >
                    {messages.confirmClearAll}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {allBought ? (
            <output className={styles.allBought}>
              <strong>{messages.allBought}</strong>
              <button
                onClick={() => setItems(removeCheckedShoppingItems().items)}
                type="button"
              >
                {messages.removeChecked(checkedCount)}
              </button>
            </output>
          ) : null}

          <ul className={styles.list}>
            {items.map((item) => {
              const name = ingredientName(item, locale);
              const recipes = sourceRecipes(item, locale, catalog);
              const notes = itemNotes(item, locale);
              return (
                <li
                  className={styles.item}
                  data-checked={item.checked}
                  key={item.id}
                >
                  <BakeCheckbox
                    aria-label={
                      item.checked
                        ? messages.markNeeded(name)
                        : messages.markBought(name)
                    }
                    checked={item.checked}
                    onCheckedChange={(checked) =>
                      setItems(
                        setShoppingItemChecked(item.id, checked === true).items,
                      )
                    }
                  />
                  <div className={styles.itemMain}>
                    <strong>{name}</strong>
                    {notes.map((note) => (
                      <small key={note}>{note}</small>
                    ))}
                    {recipes.length === 1 ? (
                      recipes[0].href ? (
                        <a className={styles.source} href={recipes[0].href}>
                          {messages.sourceRecipe(recipes[0].title)}
                        </a>
                      ) : (
                        <span className={styles.source}>
                          {messages.sourceRecipe(recipes[0].title)}
                        </span>
                      )
                    ) : (
                      <details className={styles.sources}>
                        <summary>
                          {messages.sourceRecipes(recipes.length)}
                        </summary>
                        <ul>
                          {recipes.map((recipe) => (
                            <li key={recipe.id}>
                              {recipe.href ? (
                                <a href={recipe.href}>{recipe.title}</a>
                              ) : (
                                recipe.title
                              )}
                            </li>
                          ))}
                        </ul>
                      </details>
                    )}
                  </div>
                  <span className={styles.amount}>
                    {formatLocalizedQuantity(locale, item.quantity)}
                  </span>
                  <button
                    aria-label={`${messages.removeItem}: ${name}`}
                    className={styles.remove}
                    onClick={() => removeOne(item)}
                    type="button"
                  >
                    <Trash2 aria-hidden="true" size={18} />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {removed ? (
        <output className={styles.undoNotice}>
          <span>{messages.removedItem(ingredientName(removed, locale))}</span>
          <button onClick={undoRemove} type="button">
            {messages.undo}
          </button>
        </output>
      ) : null}
    </section>
  );
}
