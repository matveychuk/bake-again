import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArticleHeader, ArticlePanettoneInvitation } from '@/app/_components/articles/articles';
import styles from '@/app/_components/articles/articles.module.css';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { psylliumArticle } from '@/content/articles/psyllium';
import { xanthanArticle as article } from '@/content/articles/xanthan-gum';
import { getLocalizedRecipePath } from '@/lib/i18n/routes';
import { pageMetadata } from '@/lib/seo/metadata';

type ArticleProps = { params: Promise<{ locale: string }> };

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: ArticleProps): Promise<Metadata> {
  if ((await params).locale !== 'uk') return {};
  const metadata = pageMetadata({
    locale: 'uk',
    locales: ['uk'],
    path: article.path,
    title: `${article.title} — Bake Again`,
    description: article.description,
    image: article.cover,
    imageAlt: article.coverAlt,
  });
  return { ...metadata, openGraph: { ...metadata.openGraph, type: 'article' } };
}

export default async function XanthanRoute({ params }: ArticleProps) {
  if ((await params).locale !== 'uk') notFound();
  return (
    <main>
      <SiteHeader locale="uk" pathname={article.path} />
      <div className={styles.article}>
        <ArticlePanettoneInvitation />
        <article className={styles.story}>
          <ArticleHeader title={article.title} introduction={article.introduction} />
          <figure className={styles.figure}>
            <Image
              src="/images/articles/xanthan-gum/powder-and-water-v1.webp"
              alt="Ліворуч у мисочці дрібний кремовий порошок. Праворуч із ложки повільно стікає прозора в’язка суміш."
              width={1536}
              height={1024}
              sizes="(max-width: 760px) 92vw, 720px"
            />
            <figcaption className={styles.caption}>
              <span className={styles.comparisonLabels}>
                <strong>Сухий ксантан</strong>
                <strong>Ксантан у воді</strong>
              </span>
              Згенерована ілюстрація.
            </figcaption>
          </figure>
          <section>
            <h2>Що в тому пакетику?</h2>
            <p>
              Ксантанова камедь, або просто ксантан, — це дрібний світлий порошок,
              який отримують ферментацією цукрів. Ледь намокне, як рідина довкола
              нього густішає. Навіть коли самого порошку в мисці зовсім трохи.
            </p>
            <p>
              У безглютеновому кексі це помітно двічі. Під час замішування тісто
              стає більш в’язким. А коли кекс охолоне й ви візьметеся за ніж,
              м’якуш краще триматиметься купи. Кілька крихт усе одно залишаться.
              Їх можна з чистою совістю з’їсти біля дошки.
            </p>
          </section>
          <section>
            <h2>А раптом він уже в борошні?</h2>
            <p>
              Переверніть пачку безглютенової суміші. «Ксантанова камедь»,
              <span lang="en"> xanthan gum</span>, <span lang="es">goma xantana</span> і E415 —
              назви того самого інгредієнта. Якщо знайшли одну з них у складі,
              виробник уже додав ксантан.
            </p>
            <figure className={styles.figure}>
              <div className={styles.xanthanLabel}>
                <Image
                  src="/images/articles/xanthan-gum/measure-for-measure-label-v1.webp"
                  alt="Фрагмент складу King Arthur Measure for Measure. У передостанньому рядку обведено слова XANTHAN GUM."
                  width={1379}
                  height={616}
                  sizes="(max-width: 760px) 92vw, 720px"
                />
              </div>
              <figcaption className={styles.caption}>
                Знайдіть жирне <span lang="en">INGREDIENTS</span> («склад») і ведіть
                пальцем донизу. У цій суміші ксантан ховається аж у передостанньому
                рядку — <strong lang="en">XANTHAN GUM</strong>.{' '}
                <a href="https://shop.kingarthurbaking.com/content/packaging/200725_4.pdf#page=2">
                  Етикетка King Arthur Measure for Measure (PDF)
                </a>
              </figcaption>
            </figure>
            <p>
              Тепер звірте пачку з рецептом. Якщо автор використовує саме вашу
              суміш і вказує ще трохи камеді окремо, таку добавку вже враховано.
              Якщо ж рецепт написано для борошна без ксантану, а у вашій суміші він є,
              шукайте вказівку для такої заміни. Сам перелік складників не підкаже,
              скільки камеді вже потрапило в миску.
            </p>
          </section>
          <section>
            <h2>Як розмішати його без грудочок?</h2>
            <p>
              Відміряйте ксантан за рецептом і спершу перемішайте з борошном
              вінчиком. Так дрібка порошку розподілиться по всій мисці. Якщо
              висипати її купкою просто в рідину, зовні вона швидко намокне,
              а всередині грудочки може залишитися сухий порошок.
            </p>
            <p>
              У сливовому пирозі Bake Again камедь додають за бажанням. Якщо
              берете її, змішайте з борошном і тапіоковим крохмалем. Далі
              лопаткою у кілька прийомів вмішайте суху суміш у збиті яйця.
              Сухих смужок борошна вже не видно, а маса ще повітряна? Час
              відкласти лопатку.
            </p>
            <figure className={styles.figure}>
              <Image src={article.cover} alt={article.coverAlt} width={1536} height={1024}
                sizes="(max-width: 760px) 92vw, 720px" />
              <figcaption className={styles.caption}>
                Сливовий пиріг Bake Again. Усі кроки — у{' '}
                <a href={getLocalizedRecipePath('plum-cake', 'uk')!}>рецепті перевернутого пирога зі сливами</a>.
              </figcaption>
            </figure>
          </section>
          <section>
            <h2>Ложечку з гіркою?</h2>
            <p>
              Якщо рецепт просить чверть чайної ложки, візьміть відповідну мірну
              ложечку й зніміть гірку рівним краєм ножа. У такій маленькій порції
              навіть скромна гірка — вже щедра добавка. Від надлишку ксантану
              м’якуш може стати липким і трохи гумовим.
            </p>
            <figure className={styles.figure}>
              <Image
                src="/images/articles/xanthan-gum/level-and-heaped-v1.webp"
                alt="Дві однакові мірні ложки. Ліву наповнено врівень із краєм, над правою височіє гірка порошку."
                width={1536}
                height={1024}
                sizes="(max-width: 760px) 92vw, 720px"
              />
              <figcaption className={styles.caption}>
                Ліворуч — як у рецепті. Праворуч — як рука зачерпнула. Згенерована ілюстрація.
              </figcaption>
            </figure>
            <p>
              Кількість залежить і від того, що ви печете. Від мафіна хочеться,
              щоб він легко розламувався пальцями. Від тонко розкачаного тіста
              для пирога — щоб його можна було підняти й перенести у форму цілим.
              Тому ложечку з одного рецепта краще лишити в тому ж рецепті.
            </p>
          </section>
          <section>
            <h2>А якщо в шафі є псиліум?</h2>
            <p>
              Псиліум теж зв’язує воду. Його лушпиння набухає й утворює гель,
              завдяки якому м’яке хлібне тісто легше зібрати та сформувати.
              Ксантан зручний там, де потрібен ніжний м’якуш, наприклад у кексі.
              У здобному тісті іноді зустрічаються обидва.
            </p>
            <p>
              Якщо в рецепті ксантан, а під рукою лише псиліум, заміна ложка на
              ложку змінить і густину тіста, і текстуру випічки. Виберіть рецепт,
              у якому вже враховано ваше лушпиння. А поки духовка гріється, ось
              історія про те, <a href={psylliumArticle.path}>навіщо тісту псиліум</a>.
            </p>
          </section>
          <details className={styles.sources}>
            <summary>Джерела для допитливих</summary>
            <ul>
              <li><a href="https://theloopywhisk.com/2021/10/08/xanthan-gum-101/">Ксантан у кексах, печиві й тісті для пирогів · The Loopy Whisk</a></li>
              <li><a href="https://www.kingarthurbaking.com/blog/2015/08/05/xanthan-gum">Як борошняна суміш і кількість ксантану впливають на випічку · King Arthur Baking</a></li>
            </ul>
          </details>
        </article>
      </div>
      <SiteFooter locale="uk" />
    </main>
  );
}
