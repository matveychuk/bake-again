import Image from 'next/image';
import { xanthanArticle } from '@/content/articles/xanthan-gum';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import {
  blogPath,
  psylliumArticle,
  panettoneIsActive,
} from '@/content/articles/psyllium';
import { PanettoneInvitation, RecipeWaitlistInvitation } from '@/components/site/panettone-invitation';
import { NewsletterInvitation } from '@/components/site/newsletter-invitation';
import { NewsletterSignup } from '@/components/site/newsletter-signup';
import { ProductBannerInvitation } from '@/components/site/product-banner-invitation';
import { activeProductBanner } from '@/content/commerce/product-banner';
import { deliveryBindings } from '@/lib/newsletter/delivery-runtime';
import { pancakesConfigured, panettoneConfigured } from '@/lib/newsletter/panettone';
import styles from './articles.module.css';

export function ArticleHeader({
  title,
  id = 'article-title',
  introduction,
  introId,
}: {
  title: string;
  id?: string;
  introduction?: string;
  introId?: string;
}) {
  return (
    <header className={styles.header}>
      <div className={styles.headerMeta}>
        <a className={styles.back} href={blogPath} aria-label="До блогу">
          <ArrowLeft aria-hidden="true" size={18} /> Блог
        </a>
        <span>Про інгредієнти</span>
      </div>
      <h1 id={id} tabIndex={-1}>
        {title}
      </h1>
      {introduction && (
        <p
          className={styles.introduction}
          id={introId}
          tabIndex={introId ? -1 : undefined}
        >
          {introduction}
        </p>
      )}
    </header>
  );
}

export function PsylliumComparison({
  priority = false,
}: {
  priority?: boolean;
}) {
  return (
    <div>
      <figure className={styles.figure}>
        <Image
          src={psylliumArticle.cover}
          alt={psylliumArticle.coverAlt}
          width={1536}
          height={1024}
          priority={priority}
          sizes="(max-width: 760px) 92vw, 720px"
        />
        <div className={styles.comparisonLabels} aria-hidden="true">
          <strong>Ціле лушпиння</strong>
          <strong>Мелене лушпиння</strong>
        </div>
        <figcaption className={styles.caption}>
          Дві форми одного інгредієнта.
        </figcaption>
      </figure>
      <details className={styles.packaging}>
        <summary>Як упізнати на упаковці</summary>
        <ul className={styles.forms}>
          {psylliumArticle.forms.map((form) => (
            <li key={form.label} className={styles.form}>
              <strong>{form.title}</strong>
              <span lang="en">{form.label}</span>
              <span lang="es">{form.spanish}</span>
              <a href={form.iherb} aria-label={`${form.title} на iHerb`}>
                На iHerb <ArrowUpRight aria-hidden="true" size={15} />
              </a>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}

export function PsylliumStory({ preview = false }: { preview?: boolean }) {
  const Invitation = preview ? NewsletterInvitation : NewsletterSignup;
  return (
    <article className={styles.story}>
      <ArticleHeader
        title={psylliumArticle.title}
        introduction={psylliumArticle.introduction}
        id={preview ? 'psyllium-story-example' : 'article-title'}
        introId={preview ? undefined : 'psyllium-content'}
      />
      <section>
        <h2>Як псиліум потрапив у мою здобу</h2>
        <p>
          Ми з чоловіком час від часу приймаємо псиліум як джерело клітковини.
          Так я його й знала багато років. Його вживають, зокрема, при закрепах,
          а також для зниження рівня холестерину.
        </p>
        <p>
          Я бачила псиліум у складі деяких готових безглютенових сумішей.
          Готова суміш часто універсальна, а мені хотілося підібрати пропорції
          саме для здоби. Тож я сама змішала кілька видів безглютенового
          борошна й додала порошок із тієї самої баночки.
        </p>
        <figure className={styles.figure}>
          <Image
            src={psylliumArticle.blendImage}
            alt={psylliumArticle.blendAlt}
            width={1536}
            height={1024}
            sizes="(max-width: 760px) 92vw, 720px"
          />
        </figure>
        <p>
          До того моя безглютенова здоба здебільшого виходила щільною й трохи
          крихкою, наче з пісочного тіста. А тут із першої ж спроби м’якуш
          вийшов м’який, пружний, пористий — такий, як у звичайної пшеничної
          здоби. Оце й було моїм відкриттям.
        </p>
      </section>
      <section>
        <h2>Непоказний, доки сухий</h2>
        <p>
          Псиліум — це лушпиння насіння подорожника овального. Легкі бежеві
          пластівці, схожі на дрібні висівки. На вигляд — нічого такого, заради
          чого хочеться терміново вмикати духовку.
        </p>
        <p>
          Але додайте води. Лушпиння вбирає її, суміш густішає й стає схожою на
          м’яке желе. Щойно були пластівці у воді — а тепер за ложкою тягнеться
          гель. Саме заради цього перетворення псиліум і потрапляє в миску з
          тістом.
        </p>
        <figure className={styles.figure}>
          <Image
            src={psylliumArticle.gel}
            alt={psylliumArticle.gelAlt}
            width={1536}
            height={1024}
            loading="lazy"
            sizes="(max-width: 760px) 92vw, 720px"
          />
          <figcaption className={styles.caption}>
            Ліворуч — сухе лушпиння. Праворуч — гель після додавання води.
          </figcaption>
        </figure>
      </section>

      <section>
        <h2>Булочці є за що триматися</h2>
        <p>
          У пшеничному тісті клейковина утворює еластичну сітку. Вона допомагає
          йому розтягуватися й утримувати газ, який виробляють дріжджі. У
          безглютеновому тісті такої сітки немає — структуру доводиться будувати
          інакше.
        </p>
        <p>
          Тут і стає в пригоді гель псиліуму. Він зв’язує воду, допомагає масі
          триматися купи й утримувати бульбашки під час підйому. З таким тістом
          легше працювати: зібрати його, перенести, надати форму. Уже більше
          схоже на майбутню булочку.
        </p>
        <p className={styles.takeaway}>
          <strong>
            Дріжджі створюють газ. Псиліум допомагає тісту його втримати.
          </strong>{' '}
          У кожного своя робота — пакетик дріжджів поки не відпускаємо.
        </p>
      </section>

      <Invitation locale="uk" invitationCopy={psylliumArticle.invitation} />

      <section>
        <h2>Дві пачки, одна назва</h2>
        <p>
          У магазині псиліум може виглядати по-різному. В одній пачці —
          пластівці лушпиння. В іншій — дрібний порошок із того самого лушпиння.
          Це як кава в зернах і мелена: походження те саме, але вигляд і
          поведінка вже різні.
        </p>
        <PsylliumComparison />
        <p>
          Помел впливає на те, як суміш густішає. Тому напис «псиліум» ще не
          означає, що будь-яка пачка підійде в тій самій кількості. Якщо рецепт
          просить ціле лушпиння, а у вас порошок, пошукайте в автора вказівку
          для заміни. Міняти навмання — це вже новий експеримент.
        </p>
      </section>

      <section>
        <h2>Спочатку желе чи одразу в борошно?</h2>
        <p>
          Обидва способи зустрічаються в рецептах. В одному лушпиння спочатку
          змішують із частиною води й додають готовий гель. В іншому псиліум
          потрапляє до сухих інгредієнтів і набухає вже під час замішування та
          відпочинку тіста.
        </p>
        <p>
          Тож пауза в рецепті — не просто час помити миску. Консистенція ще може
          змінюватися. Дайте тісту зазначений час і лише тоді порівнюйте його з
          описом автора. А воду для окремого гелю беріть із відміряної за
          рецептом кількості, не додавайте ще одну порцію «зверху».
        </p>
      </section>

      <section>
        <h2>Ще ложечку для надійності?</h2>
        <p>
          З псиліумом щедрість краще притримати. Додаткова ложка змінює
          співвідношення лушпиння й води, а разом із ним — консистенцію тіста.
          «Більше» тут не означає «пухкіше».
        </p>
        <p>
          Для першої спроби візьміть ту форму й ту вагу псиліуму, які вказані в
          рецепті. Універсальної ложки на будь-яку миску немає: мають значення
          борошняна суміш, вода й сама випічка. Пропорції для хліба не варто
          автоматично переносити в здобне тісто.
        </p>
        <p>
          От і весь секрет непоказних пластівців: з водою вони стають гелем, а в
          добре підібраному рецепті допомагають тісту зібратися докупи. До
          булочки ще треба дійти — але тепер зрозуміло, хто за що відповідає.
        </p>
        <p>
          А що допомагає скибці кексу дістатися до тарілки цілою?
          Про це — у статті <a href={xanthanArticle.path}>«{xanthanArticle.title}»</a>.
        </p>
      </section>
    </article>
  );
}

export async function ArticlePanettoneInvitation() {
  if (!panettoneIsActive('uk')) return null;
  const bindings = await deliveryBindings();
  return (
    <PanettoneInvitation
      preview={process.env.NODE_ENV === 'development' && !panettoneConfigured(bindings)}
      siteKey={bindings.TURNSTILE_SITE_KEY as string | undefined}
    />
  );
}

export async function ArticlePancakesInvitation() {
  const bindings = await deliveryBindings();
  const configured = pancakesConfigured(bindings);
  const preview = process.env.NODE_ENV === 'development' && !configured;
  if (!configured && !preview) return null;
  return (
    <RecipeWaitlistInvitation
      campaign="pancakes"
      preview={preview}
      siteKey={bindings.TURNSTILE_SITE_KEY as string | undefined}
    />
  );
}

export function PsylliumArticle() {
  const banner = activeProductBanner('blog-psyllium', 'uk');
  return (
    <div className={styles.article}>
      <ArticlePanettoneInvitation />
      <PsylliumStory />
      {banner && (
        <ProductBannerInvitation
          banner={banner}
          recipeId="blog-psyllium"
          titleId="psyllium-lesson-title"
        />
      )}
    </div>
  );
}
