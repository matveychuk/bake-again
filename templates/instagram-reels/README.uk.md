# Bake Again — шаблон Reel і сторіс

Погоджено Сашею 2026-10-12. За замовчуванням використовувати для майбутніх відео.
Правила: [композиція, розмитий край і сторіс](../../docs/instagram/templates.uk.md#reel-і-сторіс-погоджений-стандарт-від-2026-10-12).
Медіа Design Lab: [приклад](../../media/instagram/templates/reels-food-first-v1/review.html).

## Джерела

- `layout-defaults.json` — композиція, зона їжі, типографіка, м’який перехід верхнього фону.
- `badge-horizontal-v1.json` — погоджені координати, масштаб і час руху.
- `GlutenFreeBadge.swift` — повторно використовуваний компонент CoreGraphics/CoreText.
- `export-overlay.swift` — генератор прозорих кадрів накладки; фото не входить в анімацію.
- [Прозора PNG-послідовність](../../media/instagram/templates/reels-food-first-v1/gluten-free-horizontal-overlay-v1.zip):
  60 кадрів, 1080 × 1920, 30 fps, 2 секунди. Кадр 45 і далі — фіксована плашка.
  У редакторі імпортувати як image sequence, поверх відео; продовжити останній кадр
  до кінця ролика. Не ставити чорний фон і не конвертувати накладку в H.264 без alpha.

## У новому рендері

Компілювати компонент разом із файлом `main.swift`. Створити `GlutenFreeBadge(configuration:)`
з JSON і викликати `draw` поверх готового кадру, передаючи час від початку першої сцени,
`animated: true` лише для першої сцени; для наступних — `false`.
Шрифт Manrope-Semibold з `templates/recipe-pdf/fonts`, 44 px. Колір плашки —
Warm Precision Action/strong #853C29, напис — Background/page #FAF6EF.
Компонент очікує полотно 1080 × 1920; для іншого розміру пропорційно масштабувати весь контекст.
Обкладинка береться на 1,5 с, коли штамп уже на місці.

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
