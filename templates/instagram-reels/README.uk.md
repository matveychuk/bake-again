# Bake Again — шаблон Reel і сторіс

Погоджено Сашею 2026-10-12. За замовчуванням використовувати для майбутніх відео.
Правила: [композиція, розмитий край і сторіс](../../docs/instagram/templates.uk.md#reel-і-сторіс-погоджений-стандарт-від-2026-10-12).
Медіа Design Lab: [приклад](../../media/instagram/templates/reels-food-first-v1/review.html).

## Джерела

- `layout-defaults.json` — композиція, зона їжі, типографіка, м’який перехід верхнього фону.
- `badge-horizontal-v2-cream.json` / `badge-horizontal-v2-terracotta.json` — погоджені палітри v2, Bold/розрядка й спільний рух; `badge-horizontal-v1.json` — попередній Semibold, збережений.
- `GlutenFreeBadge.swift` — повторно використовуваний компонент CoreGraphics/CoreText.
- `export-overlay.swift` — генератор прозорих кадрів накладки; фото не входить в анімацію.
- [Прозора PNG-послідовність](../../media/instagram/templates/reels-food-first-v1/gluten-free-horizontal-overlay-v1.zip):
  60 кадрів, 1080 × 1920, 30 fps, 2 секунди. Кадр 45 і далі — фіксована плашка.
  У редакторі імпортувати як image sequence, поверх відео; продовжити останній кадр
  до кінця ролика. Не ставити чорний фон і не конвертувати накладку в H.264 без alpha.

## У новому рендері

### Мовні варіанти UA / ES / EN, 15.10.2026

`GlutenFreeBadge` підтримує необов’язковий рядок `text` у JSON. Якщо поле відсутнє,
залишається `БЕЗ ГЛЮТЕНУ`; ES — `SIN GLUTEN`, EN — `GLUTEN-FREE`.
Розміри, шрифт, розрядка, палітра й рух не змінюються. Спільна перевірка меж
застосовується також до перекладу. Cover-генератор приймає необов’язковий
`badgeConfiguration` у даних допису поверх layout default. Рендерер серії тортів
читає таке саме поле з post JSON; без нього використовує чинний український стандарт.

[Media Design Lab: IG-016 ES/EN](../../media/instagram/IG-016/language-pilots-v1/review.html)
показує два повні відео, локалізовані обкладинки, 3:4/4:5 та сітку трьох мов.
Постові конфігурації — `IG-016/pilot-{es,en}-v1/working/`, джерела камери й таймінги
українського v1 збережено. Мовні версії не створюють нових доказів рецептури.

Компілювати компонент разом із файлом `main.swift`. Створити `GlutenFreeBadge(configuration:)`
з JSON і викликати `draw` поверх готового кадру, передаючи час від початку першої сцени,
`animated: true` лише для першої сцени; для наступних — `false`.
Шрифт Manrope-LabelBold (700) з `templates/recipe-pdf/fonts`, 44 px, розрядка 1,2 px. Для v2 викликати `drawThemed`; він використовує палітру конфігурації. На кремовому фоні колір плашки —
Warm Precision Action/strong #853C29, напис — Background/page #FAF6EF.
Компонент очікує полотно 1080 × 1920; для іншого розміру пропорційно масштабувати весь контекст.
Кадр на 1,5 с, коли штамп уже на місці, можна зберегти для порівняння. Для нового Reel готувати окрему статичну обкладинку й перевіряти сітку за правилами нижче.

Збірка прикладу:
```sh
swiftc -module-cache-path /private/tmp/bakeagain-swift-cache templates/instagram-reels/GlutenFreeBadge.swift media/instagram/IG-009/reel-v8/working/main.swift -o /private/tmp/bakeagain-render
/private/tmp/bakeagain-render media/instagram/IG-009/reel-v8/working /private/tmp/new-reel-master.mp4
```

Генерація накладки:
```sh
swiftc -module-cache-path /private/tmp/bakeagain-swift-cache templates/instagram-reels/GlutenFreeBadge.swift templates/instagram-reels/export-overlay.swift -o /private/tmp/bakeagain-overlay
/private/tmp/bakeagain-overlay templates/instagram-reels media/instagram/templates/reels-food-first-v1/overlay-frames
```

Фото, CTA, рецепт, довжина та музика залежать від конкретної публікації.
Горизонтальний штамп не замінює змістовний хук і не гарантує приріст підписок.

## Опційна розрядка плашки — проба IG-011, 2026-10-12

`GlutenFreeBadge` читає необов’язковий `letterSpacing` із конфігурації (px на полотні 1080 × 1920). Якщо поле відсутнє, погоджена типографіка незмінна. Шрифт передає виклик: у [пробі IG-011 v3](../../media/instagram/IG-011/header-probe-v3/review.html) — наявний Manrope-LabelBold.ttf (700), 44 px і `letterSpacing: 1.2`. Геометрія/таймінги/центрування за реальними межами літер та перевірка переповнення спільні. Пост-конфігурація — `media/instagram/IG-011/header-probe-v3/working/badge-variant.json`. Це опційний варіант для перегляду, не нова глобальна норма: `badge-horizontal-v1.json` та прозора PNG-послідовність незмінні.

## Погоджено v2 — два фони, 2026-10-12

Саша: «Да, так краще, збережи оновлену версію». Зафіксовано вигляд IG-011 header-probe-v3, без додаткового збільшення: Bold 700 / 44 px / 1,2 px; плашка 456 × 104, початковий масштаб 2,3, рух 0,65 + 0,85 с. Для білого/кремового поля — v2-cream (темна плашка), для теракотової смуги 256 px — v2-terracotta (темний штамп → світла плашка при вході в смугу). `drawThemed` повторно використовує `draw` з обрізанням за межею кольорового поля; відсутність headerBackground залишає попередній вигляд. Семантичні кольори з tokens.css, без фото/фону у прозорих PNG.

[Демонстрація двох варіантів](../../media/instagram/templates/gluten-free-badge-v2/review.html). [Кремовий ZIP](../../media/instagram/templates/gluten-free-badge-v2/gluten-free-badge-v2-cream.zip) — 666 123 байти; [теракотовий ZIP](../../media/instagram/templates/gluten-free-badge-v2/gluten-free-badge-v2-terracotta.zip) — 666 235. По 60 кадрів, 1080 × 1920, 30 fps / 2 с; кадр 45 і далі нерухомий. Перевірені прозорість, геометрія, ZIP і анімовані кнопки; 390/900/1440 px. Попередня v1 збережена.

Експорт: додати третій аргумент `badge-horizontal-v2-cream.json` або `badge-horizontal-v2-terracotta.json` до виклику export-overlay; без нього v2-cream. Для відтворення історичного Semibold явно передати `badge-horizontal-v1.json`.

Шапка серії вареника — окрема погоджена пост-композиція `media/instagram/templates/lazy-dumplings-series-v1/layout-terracotta-v1.json`: смуга 256, заголовки на кремовому полі, додатковий відступ 24, відео top=412/h=1508. Не переносити дворядковий заголовок вареника автоматично на інші рецепти. Повні [Reel v7 / Story v2](../../media/instagram/IG-011/kitchen-court-v7/review.html) ще на повторному перегляді; погоджено оформлення, не публікацію.

## Статична обкладинка cover-v1

2026-10-12: Саша доручила підготувати обкладинки й закріпити правила. Це окрема композиція для профілю; поточні IG-011/IG-013 v1 для перегляду. Відео, Story й анімаційні координати не змінені.

- `cover-layout-v1.json` — єдине джерело розмірів, зон тексту/їжі, обрізань 3:4/4:5, шрифтів і якості JPEG.
- `badge-static-cover-v1.json` — статичний варіант спільного `GlutenFreeBadge`: 520 × 112, Manrope Bold 700 / 52 px / розрядка 1,2; cream-on-terracotta. Більший розмір тільки для обкладинки, стандарт відео 44 px не змінений.
- `cover/main.swift` — CoreGraphics/CoreText, наявні шрифти PDF і семантичні кольори `design-system/tokens.css`; повторно використовує `drawThemed(animated: false)`.
- Дані допису: `IG-XXX/cover-vN/working/cover.uk.json`. Змінювати title, eyebrow, imagePath, crop/rotation і provenance конкретного фото. Джерела камери не перезаписувати. Для довшого тексту змінити заголовок або документувати варіант, не обходити перевірку меж.
- Генератор створює майстер PNG, оптимізований JPEG, обрізані QA-прев’ю й geometry-verification.json; перевіряє межі заголовків та плашки. PNG — майстер, тільки JPEG — доставка. QA-прев’ю не є окремими публікаціями.

```sh
swiftc -module-cache-path /private/tmp/bake-again-swift-cache templates/instagram-reels/GlutenFreeBadge.swift templates/instagram-reels/cover/main.swift -o /private/tmp/bake-again-cover-render
/private/tmp/bake-again-cover-render '/Users/sasha/Bake Again' media/instagram/IG-011/cover-v1/working/cover.uk.json media/instagram/IG-011/cover-v1
```

Після рендера копіювати доставочний JPEG у `for-phone/cover-vN/`, звірити байти/хеш, скласти caption/alt/README й нотатку iCloud. Перевірити [правила сітки](../../docs/instagram/templates.uk.md#окрема-обкладинка-reel-і-сітка) і [Design Lab обкладинок](../../media/instagram/templates/reel-covers-v1/review.html) на 390/900/1440 px. Симуляції центрального обрізання не замінюють фактичного прев’ю платформи.


## 2026-10-14 · Серія вареників: короткий фінал і обкладинка без героя

`cover/main.swift` підтримує `showMascot` (типово true) і `version` (типово v1). Значення false прибирає персонажа лише з практичних обкладинок; старі конфігурації зберігають вигляд. Версія визначає ім’я експорту. Штамп і геометрія залишаються спільними. Фінальний CTA — один короткий рядок поверх 2–2,5 секунд рухомої їжі. Самостійні Story мають свій монтаж і не замінюють анонси. Нові сюжети й звук ще на авторському перегляді. [Media Design Lab серії](../../media/instagram/templates/lazy-dumplings-refresh-2026-10-14/review.html#covers).


## 2026-10-14 · Серія шоколадних тортів

Варіант cover-v1 підтримує відсутність `mascot`: якщо шлях не задано, персонаж не малюється. Це узгоджується з `showMascot: false` у практичних обкладинках; конфігурації з персонажем збережені. Приклади IG-014–016 використовують тільки авторську їжу й наявні зони заголовка/плашки. [Media Design Lab: обкладинки, обрізання та сітка](../../media/instagram/chocolate-cake-series-v1/review.html#grid).

Саша підтвердила стартовий горизонтальний штамп → шапка та CTA на рухомій їжі. Машинне правило `cta` записано в `layout-defaults.json`; конкретна тривалість залежить від тексту. У цій серії фінальний кадр триває 5 с. Це не змінює короткі CTA інших серій.
