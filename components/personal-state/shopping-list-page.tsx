'use client';

import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BakeCheckbox } from '@/components/ui/bake-checkbox';
import { getRecipeContent, personalStateRecipes } from '@/content/recipes/registry';
import type { AppLocale } from '@/lib/i18n/config';
import { getUiMessages } from '@/lib/i18n/messages';
import { formatQuantity as formatLocalizedQuantity } from '@/lib/i18n/format';
import { readShopping, removeShoppingItem, setShoppingItemChecked, subscribeToShopping, type ShoppingItemV1 } from '@/lib/persistence/shopping';
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

export function ShoppingListPage({ locale }: { locale: AppLocale }) {
  const [items, setItems] = useState<ShoppingItemV1[]>([]);
  const messages = getUiMessages(locale).personal;
  useEffect(() => { const update = () => setItems(readShopping().items); update(); return subscribeToShopping(update); }, []);
  return <section className={styles.page} aria-labelledby="shopping-title">
    <div className={styles.heading}><p>Practical list</p><h1 id="shopping-title">{messages.shoppingTitle}</h1></div>
    {items.length === 0 ? <div className={styles.empty}><p>{messages.shoppingEmpty}</p></div> : <ul className={styles.list}>
      {items.map((item) => <li className={styles.item} data-checked={item.checked} key={item.id}>
        <BakeCheckbox aria-label={`${item.checked ? 'Unmark' : 'Mark'} ${ingredientName(item, locale)}`} checked={item.checked} onCheckedChange={(checked) => setItems(setShoppingItemChecked(item.id, checked === true).items)} />
        <div className={styles.itemMain}><strong>{ingredientName(item, locale)}</strong><p>{messages.source} {item.sources.map((source) => personalStateRecipes.find((recipe) => recipe.id === source.recipeId)?.title[locale] ?? source.recipeId).filter((value, index, values) => values.indexOf(value) === index).join(', ')}</p></div>
        <span className={styles.amount}>{formatLocalizedQuantity(locale, item.quantity)}</span>
        <button aria-label={`${messages.removeItem}: ${ingredientName(item, locale)}`} className={styles.remove} onClick={() => setItems(removeShoppingItem(item.id).items)} type="button"><Trash2 aria-hidden="true" size={17} /></button>
      </li>)}
    </ul>}
  </section>;
}
