'use client';
import { useEffect, useRef, useState } from 'react';
import { CircleCheck, MailCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isMagnetId, magnetDelivery, type MagnetId } from '@/lib/newsletter/magnets';
import styles from '@/app/[locale]/subscribed/subscribed.module.css';

export function RecipeConfirmation() {
  const token = useRef<string | null>(null);
  const started = useRef(false);
  const [magnet,setMagnet]=useState<MagnetId | null>(null);
  const [state,setState]=useState<'loading'|'done'|'error'|'expired'>('loading');
  async function confirm() {
    if(!token.current) {setState('expired');return;}
    setState('loading');
    try {
      const response=await fetch('/api/newsletter/confirm',{
        method:'POST',headers:{'content-type':'application/json'},credentials:'omit',referrerPolicy:'no-referrer',
        body:JSON.stringify({token:token.current}),signal:AbortSignal.timeout(25_000),
      });
      const body=await response.json();
      if(response.status===410 || response.status===400) {setState('expired');return;}
      if(!response.ok || !body || typeof body!=='object' || !('ok' in body) || body.ok!==true || !('magnet' in body) || !isMagnetId(body.magnet)) throw new Error('Unavailable');
      setMagnet(body.magnet);setState('done');
    } catch {setState('error');}
  }
  useEffect(()=>{
    if(started.current) return;
    started.current=true;
    token.current=new URLSearchParams(window.location.hash.slice(1)).get('token');
    // Native Brevo DOI has finished. Remove its opaque return token before
    // rendering links; it never enters query strings, analytics or referrers.
    window.history.replaceState(window.history.state,'',window.location.pathname);
    void confirm();
  },[]);
  return <section className={styles.hero} aria-labelledby="recipe-confirmed-title" aria-live="polite" aria-busy={state==='loading'}>
    {state==='done' ? <CircleCheck size={32} aria-hidden="true" className={styles.icon}/> : <MailCheck size={32} aria-hidden="true" className={styles.icon}/>}
    <div>
      <h1 id="recipe-confirmed-title">{state==='done'?'Підписку підтверджено':state==='loading'?'Готуємо твій лист':state==='expired'?'Посилання вже не діє':'Не вдалося завершити видачу'}</h1>
      {state==='done' && <><p>{magnet==='mlyntsi'?'Рецепт млинців і картку юного кухаря надіслано одним листом.':'Лист із PDF-рецептом шоколадного торта надіслано.'}</p><p>Якщо листа немає, перевір «Промоакції» або «Спам».</p></>}
      {state==='loading' && <p>Перевіряємо підтвердження email і надсилаємо запитані матеріали.</p>}
      {state==='expired' && <p>Повернися до сторінки рецепта й залиш email ще раз.</p>}
      {state==='error' && <><p>Підтвердження могло вже зберегтися. Повтори перевірку — другого листа після успішної видачі не буде.</p><Button type="button" onClick={()=>void confirm()}>Повторити перевірку</Button></>}
      <p><a href={magnet ? magnetDelivery[magnet].page : '/uk'}>{magnet?'До сторінки рецепта':'До рецептів Bake Again'}</a></p>
    </div>
  </section>;
}
