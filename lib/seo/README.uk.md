# Технічне SEO Bake Again

Рецепти: `content/recipes/search-metadata.ts` містить спільні для мов дати,
окремий підтверджений час готування, локалізовану кухню та ключові слова.
`totalTime` і `prepTime` беруться з канонічних `timing.totalElapsedMinutes`
і `timing.activeMinutes`; null не виводиться. Активний час відображено в
`prepTime` за прямим дорученням авторки; не віднімати з нього час готування.
Окремий `cookTime` не обчислюється з різниці total/active, часу одного коржа,
вафлі чи дека або середини діапазону. Відомі послідовні етапи еклерів і
торта з чорносливом складаються: 10+15=25 та 30+20=50 хв відповідно.

Дати першої вебпублікації невідомі: усі `datePublished` лишені null.
Дату випікання/фото, Instagram-публікації або створення Git-файлу не вважати
датою першої вебпублікації. `dateModified` зафіксовано з перевірених ревізій
контенту, див. `content-date-evidence.json`; збірка ці значення не змінює.
Для лінивих вареників `source-v3` має дату 2026-10-18: узгодження релізу
з наявними авторськими виправленнями перед їх публікацією. Історична дата
2026-10-12 для `source-v2` не успадковується новою версією.

Ключові слова взяті з наявних локалізованих заголовків; Наполеон також
використовує формулювання із завдання. Кухня заповнена лише для п'яти
прямо зазначених авторкою рецептів. Для інших null — свідоме пропущення.
Не додавати оцінки, відгуки, харчову цінність або SearchAction без даних.

`content/page-metadata.ts` і `content/techniques/registry.ts` — явний перелік
публічних сторінок та їхніх дат. Нову опубліковану техніку додавати до реєстру.
Sitemap містить 78 URL: 66 перекладів 22 рецептів і 12 інших сторінок.
Приватні маршрути, API, Cook Mode та чернетки до нього не потрапляють.
`x-default` завжди вказує на англійську канонічну версію.
У `next.config.ts` вимкнено streaming metadata (`htmlLimitedBots: /.*/`):
SEO-теги мають бути в початковому head навіть без виконання JavaScript.

## Зображення

`search-images.json` задає джерела й розміри обрізок 4:3 (1200×900) та
16:9 (1200×675) для кожного опублікованого рецепта. `media:prepare` створює
їх зі схваленого головного фото: центрована обрізка, WebP 82, без метаданих
і збільшення. Після заміни фото оновити і manifest; нові джерела залишати
в `media/web-source/` за відповідним базовим публічним шляхом.
Наявні джерела мають висоту 1024 або 1086 px: квадрат 1200×1200 без
збільшення неможливий. Коли з'явиться джерело з обома сторонами ≥1200,
додати третій формат у manifest та візуально перевірити його.
Квадратний логотип 256×256 — растеризований наявний `public/favicon.svg`,
джерело: `media/web-source/images/brand/bake-again-logo.png`.
Усі нові зображення входять у спільний ліміт 64 MiB.

## Google Search Console

Необов'язкова серверна змінна `GOOGLE_SITE_VERIFICATION` містить лише
значення `content` verification-тега. Порожня або відсутня змінна не
додає тег. Після встановлення перевірити HTML головної, рецепта та account.
Секретів чи verification-значень у Git немає; `.env.example` лишається порожнім.

## DNS і www

Жива перевірка 2026-10-18 (Europe/Madrid): NS — `launch1.spaceship.net`
та `launch2.spaceship.net`; `www` не має запису. Це авторитетний DNS
Spaceship; Cloudflare у HTTP-відповіді сам по собі не означає, що DNS-зона
делегована Cloudflare. Без доступу до панелі DNS не змінювався.

Для прямо запитаного proxied-запису:

1. Cloudflare → Add a domain → `bakeagain.com`. Імпортувати й звірити всі
   поточні DNS-записи, включно з поштою: MX, SPF/DKIM/DMARC та verification.
   Зберегти чинну ціль apex-домену та лишити його DNS only, якщо хостинг окремо не налаштував proxy; не замінювати його випадковою IP-адресою.
2. Cloudflare → DNS → Records → Add record: **A**, Name **www**, IPv4
   **192.0.2.1**, Proxy status **Proxied**, TTL **Auto**. Це службова ціль
   redirect-only hostname з документації Cloudflare, не адреса сайту.
3. Cloudflare → Rules → Redirect Rules → Single Redirect → Create rule.
   Custom filter: `(http.host eq "www.bakeagain.com")`.
   Dynamic URL expression: `concat("https://bakeagain.com", http.request.uri.path)`.
   Status **301**; **Preserve query string: On**. Розмістити до загальніших
   редиректів. Правило охоплює HTTP/HTTPS і всі шляхи, включно з медіа/API.
4. Cloudflare покаже два призначені саме цьому домену nameserver.
   Spaceship → Advanced DNS → вибрати bakeagain.com → Nameservers →
   Change → Custom nameservers: вказати саме ці два імені, потім
   Save nameserver settings.
   Якщо DNSSEC увімкнено, спершу прибрати старий DS у реєстратора, після
   активації Cloudflare увімкнути DNSSEC з його новим DS. Дочекатися Active.
5. Перевірити Cloudflare SSL/TLS → Edge Certificates → Universal SSL для
   `www` (сертифікат Active), перш ніж перевіряти HTTPS-редирект.

Зміна DNS-записів лише у неактивній Cloudflare-зоні не запрацює.
Якщо залишати NS Spaceship, proxy Cloudflare у цій панелі недоступний:
потрібні DNS-запис `www` і сервіс, що прийме hostname та HTTPS і виконає 301.
Не покладатися на один CNAME як на HTTP-редирект. Додатковий захист у
`proxy.ts` робить 301 для UI-запитів, якщо www потрапить до цього Worker;
він не замінює DNS, TLS та правило для всіх шляхів.

Офіційні інструкції:
- https://developers.cloudflare.com/fundamentals/manage-domains/redirect-domain/
- https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/
- https://www.spaceship.com/en-GB/knowledgebase/connect-domain-custom-nameservers/

## Перевірка

`npm run test:seo`, `npm run test:foundation`, `npm run typecheck`,
`npm run media:prepare`, `npm run build`.
Для запущеної production-збірки: `SEO_CHECK_URL=http://localhost:3011 npm run test:seo-render`.
Цей тест перевіряє поточну версію вареників і всі 78 сторінок/URL.
Для перевірки присутнього verification-тега запустити локально з
`GOOGLE_SITE_VERIFICATION=local-seo-check` і той самий тест із
`SEO_EXPECT_VERIFICATION=local-seo-check`. У production це тестове значення не задавати.

Після деплою окремо відкрити https://search.google.com/test/rich-results
і https://validator.schema.org/ для трьох URL:

- https://bakeagain.com/uk/recipes/bezghliutenovyi-napoleon
- https://bakeagain.com/en/recipes/gluten-free-napoleon-cake
- https://bakeagain.com/es/recipes/tarta-napoleon-sin-gluten

Rich Results Test → URL → Test URL → Recipes → переглянути помилки й
попередження. Schema validator → Fetch URL → Run Test → Recipe.
Автотести HTML не є результатом цих зовнішніх валідаторів.
До заповнення невідомих дат і часу попередження щодо них можливі:
не вигадувати значення заради усунення попереджень. Google рекомендує
`totalTime` або пару `prepTime` + `cookTime`:
https://developers.google.com/search/docs/appearance/structured-data/recipe

Після DNS-змін перевірити `https://www.bakeagain.com/en/recipes/gluten-free-napoleon-cake?from=seo`:
один 301 на той самий шлях і query без www, потім 200.
`curl -sSI https://bakeagain.com/` без cookies/Accept-Language має показати
307, Location /en, Vary із Accept-Language і Cache-Control private/no-store.
З явним Accept-Language uk/es мають відкриватися відповідні мовні версії.
Збережений мовний cookie має пріоритет у повторного відвідувача.
