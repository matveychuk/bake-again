'use client';

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
import { getRecipeContent, personalStateRecipes } from '@/content/recipes/registry';
import { type RecipeCatalogEntry } from '@/content/recipes/catalog';
import type { AppLocale } from '@/lib/i18n/config';
import { getUiMessages } from '@/lib/i18n/messages';
import { formatQuantity as formatLocalizedQuantity } from '@/lib/i18n/format';
import { getLocalizedRecipePath, localeHomePath } from '@/lib/i18n/routes';
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

function ingredientName(item: ShoppingItemV1, locale: AppLocale) {
  for (const recipe of personalStateRecipes) for (const section of recipe.ingredientSections) for (const line of section.lines) for (const option of line.options) if (option.ingredientId === item.ingredientId) return option.name[locale];
  for (const source of item.sources) {
    const content = getRecipeContent(source.recipeId, locale);
    const ingredient = content?.ingredientSections.flatMap((section) => section.ingredients).find((candidate) => candidate.id === item.ingredientId);
    if (ingredient) return ingredient.name;
  }
  return item.ingredientId;
}

function sourceRecipes(item: ShoppingItemV1, locale: AppLocale, catalog: RecipeCatalogEntry[]) {
  return [...new Set(item.sources.map((source) => source.recipeId))].map((recipeId) => ({
    id: recipeId,
    title: personalStateRecipes.find((recipe) => recipe.id === recipeId)?.title[locale] ?? catalog.find((recipe) => recipe.id === recipeId)?.title ?? recipeId,
    href: getLocalizedRecipePath(recipeId, locale),
  }));
}

function itemNotes(item: ShoppingItemV1, locale: AppLocale) {
  const notes = item.sources.flatMap((source) => {
    const recipe = personalStateRecipes.find((candidate) => candidate.id === source.recipeId);
    const line = recipe?.ingredientSections.flatMap((section) => section.lines).find((candidate) => candidate.id === source.ingredientLineId);
    if (line) return [line.condition?.[locale], line.qualifier?.[locale]].filter((note): note is string => Boolean(note));
    const ingredient = getRecipeContent(source.recipeId, locale)?.ingredientSections.flatMap((section) => section.ingredients).find((candidate) => candidate.id === source.ingredientLineId);
    return ingredient?.note ? [ingredient.note] : [];
  });
  return [...new Set(notes)];
}

export function ShoppingListPage({ locale, catalog }: { locale: AppLocale; catalog: RecipeCatalogEntry[] }) {
  const [items, setItems] = useState<ShoppingItemV1[]>([]);
  const [removed, setRemoved] = useState<ShoppingItemV1 | null>(null);
  const [clearOpen, setClearOpen] = useState(false);
  const messages = getUiMessages(locale).personal;
  const checkedCount = useMemo(() => items.filter((item) => item.checked).length, [items]);
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

  return (
    <section className={styles.page} aria-labelledby="shopping-title">
      <div className={styles.heading}>
        <p>{messages.shoppingEyebrow}</p>
        <h1 id="shopping-title" tabIndex={-1}>{messages.shoppingTitle}</h1>
        <span>{messages.storedInBrowser}</span>
      </div>

      {items.length === 0 ? (
        <div className={styles.empty}>
          <h2>{messages.shoppingEmpty}</h2>
          <p>{messages.shoppingEmptyBody}</p>
          <a href={localeHomePath(locale)}>{messages.browseRecipes}</a>
        </div>
      ) : (
        <div className={styles.shoppingContent}>
          <div className={styles.listActions}>
            <button disabled={checkedCount === 0} onClick={() => setItems(removeCheckedShoppingItems().items)} type="button">{messages.removeChecked(checkedCount)}</button>
            <AlertDialog open={clearOpen} onOpenChange={setClearOpen}>
              <AlertDialogTrigger className={styles.clearAll}>{messages.clearAll}</AlertDialogTrigger>
              <AlertDialogContent className={styles.clearDialog}>
                <AlertDialogHeader>
                  <AlertDialogTitle>{messages.clearAllTitle}</AlertDialogTitle>
                  <AlertDialogDescription>{messages.clearAllDescription}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className={styles.clearDialogFooter}>
                  <AlertDialogCancel className={styles.dialogCancel}>{messages.cancel}</AlertDialogCancel>
                  <AlertDialogAction className={styles.dialogConfirm} onClick={() => { setItems(clearShopping().items); setRemoved(null); setClearOpen(false); }}>{messages.confirmClearAll}</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {allBought ? <output className={styles.allBought}><strong>{messages.allBought}</strong><button onClick={() => setItems(removeCheckedShoppingItems().items)} type="button">{messages.removeChecked(checkedCount)}</button></output> : null}

          <ul className={styles.list}>
            {items.map((item) => {
              const name = ingredientName(item, locale);
              const recipes = sourceRecipes(item, locale, catalog);
              const notes = itemNotes(item, locale);
              return (
                <li className={styles.item} data-checked={item.checked} key={item.id}>
                  <BakeCheckbox aria-label={item.checked ? messages.markNeeded(name) : messages.markBought(name)} checked={item.checked} onCheckedChange={(checked) => setItems(setShoppingItemChecked(item.id, checked === true).items)} />
                  <div className={styles.itemMain}>
                    <strong>{name}</strong>
                    {notes.map((note) => <small key={note}>{note}</small>)}
                    {recipes.length === 1 ? (
                      recipes[0].href ? <a className={styles.source} href={recipes[0].href}>{messages.sourceRecipe(recipes[0].title)}</a> : <span className={styles.source}>{messages.sourceRecipe(recipes[0].title)}</span>
                    ) : (
                      <details className={styles.sources}>
                        <summary>{messages.sourceRecipes(recipes.length)}</summary>
                        <ul>{recipes.map((recipe) => <li key={recipe.id}>{recipe.href ? <a href={recipe.href}>{recipe.title}</a> : recipe.title}</li>)}</ul>
                      </details>
                    )}
                  </div>
                  <span className={styles.amount}>{formatLocalizedQuantity(locale, item.quantity)}</span>
                  <button aria-label={`${messages.removeItem}: ${name}`} className={styles.remove} onClick={() => removeOne(item)} type="button"><Trash2 aria-hidden="true" size={18} /></button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {removed ? <output className={styles.undoNotice}><span>{messages.removedItem(ingredientName(removed, locale))}</span><button onClick={undoRemove} type="button">{messages.undo}</button></output> : null}
    </section>
  );
}
