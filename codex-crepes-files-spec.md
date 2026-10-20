# Млинці — постійні PDF і сторінка видачі

Дата: 2026-10-19. Файли підтверджені Сашею: рецепт v6 і картка юного кухаря.

## Постійні адреси

- Сторінка: `https://bakeagain.com/uk/mlyntsi-recept`.
- Рецепт: `https://bakeagain.com/downloads/Bake-Again-Bezghliutenovi-mlyntsi.pdf`.
- Картка: `https://bakeagain.com/downloads/Bake-Again-Mlyntsi-kartka-yunoho-kukharia.pdf`.

Нову переглянуту доставку слід записувати під тією самою публічною назвою;
майстри й попередню історію зберігати окремо біля рецепта. Сторінка має `noindex`. PDF видаються з типом application/pdf і повторною
перевіркою кешу. URL не містять версії. У `_headers` також задекларовані
attachment і noindex для PDF, але Sites не застосовує ці два заголовки до
production-статики; завантаження запускається атрибутом download у кнопках.
На production підтверджено `public, max-age=0, must-revalidate` та ETag.
Ці відкриті посилання не є контролем доступу чи доказом підписки.

## Файли

- Рецепт: `media/recipes/crepes/working/pdf-v6/Bake-Again-Bezghliutenovi-mlyntsi-v6.pdf`;
  720 315 байтів, 6 сторінок 390 × 720 pt. JPEG уже зменшені до максимум 1026 px.
- Картка: `media/recipes/crepes/working/reel-sam-na-kukhni/card/Bake-Again-Mlyntsi-kartka-yunoho-kukharia.pdf`;
  253 284 байти, 1 сторінка A4; фото 459 × 312 px.
- До `public/downloads/` потрапляють лише окремі компактні копії цих PDF.
  Зміст і байти збережені; повторне стискання не потрібне. Оригінали не змінені.
- Усі 6 сторінок рецепта й картка візуально переглянуті; текст, фото та посилання збережені.

## Сторінка й аналітика

Дві кнопки завантаження з форматом/обсягом, фото їжі й блок «Що далі» з
переходом до рецепта. `noindex, follow`, без включення в sitemap й без вигаданих
мовних версій. Не додавати Disallow: пошуковик має прочитати noindex.
Design Lab: `/design-system#recipe-downloads`.

Umami: `recipe_pdf_download`, дані лише `recipe_id=crepes`, `locale=uk`,
`file=recipe|junior-card`. Це кліки, а не завершені збереження PDF.
Email, query, hash, DOI-токени та адреси файлів не передаються.
Localhost, preview й Do Not Track виключені.

## Приватність і підтвердження email

`https://bakeagain.com/uk/privacy` існує: 19.10.2026 перевірено HTTP 200,
наявні розділи про Brevo, email, підтвердження та відписку. Посилання є у footer
сторінки видачі. Перевірено наявність сторінки; це не юридичний висновок про GDPR.
Форми й текст згоди цим завданням не змінюються.

Адреса для переходу після підтвердження email — `/uk/mlyntsi-recept`.
Зміна налаштування redirect у провайдері та повний DOI-сценарій у цій роботі
не підтверджені. Не змінювати загальну форму інших lead magnet без окремого звірення.

## Перевірки

- TypeScript, тести аналітики та SEO: пройдено.
- Production build: пройдено; media:prepare — 189 файлів, 35.07 MiB, 15 джерел виключені.
- Chrome: 390/900/1440 px, видимий фокус і skip-link, 200% текст без overflow; інші locale — 404. Обидві кнопки зберегли валідні PDF.
- Локальна production HTTP-перевірка: noindex, sitemap, privacy, content-type/disposition, cache-control, розміри й SHA-256 обох PDF — пройдено.
- Початкова публікація Sites v64, source `efa2a92903d83b4a63457dde77e78a1d971c789f`, runtime revision 6.
- Додаткові 78 rendered regression checks UK/EN/ES: пройдено.
- Браузер зі stub Umami: два кліки дали два роздільні public file ID, без email/токена та без надсилання production-аналітики.
- Живий bakeagain.com: сторінка HTTP 200 з noindex, без sitemap; privacy HTTP 200; обидва PDF HTTP 200, application/pdf, очікувані розмір і SHA-256, max-age=0/must-revalidate — PASS.
- HTTP отримання тіл файлів у цій перевірці: рецепт 467 мс, картка 54 мс. Це не час відкриття/збереження на телефоні.
- Відкриття та збереження на фізичному iPhone через фактичну кнопку: ще не підтверджено.
  HTTP-перевірка й десктопне завантаження не замінюють телефонного тесту.

SHA-256 доставки:

- Рецепт: `29e86f463ecc5df58faea015d8a3fa1b4e92420c22829b26d44333b5ab924df1`.
- Картка: `c588c97e97813a30bfe7322069f8abf7b068a17b79aa3100c67d7d366b9264e6`.

Повторна перевірка після заміни: `DOWNLOAD_CHECK_URL=https://bakeagain.com node scripts/check-crepes-downloads.mjs`.
