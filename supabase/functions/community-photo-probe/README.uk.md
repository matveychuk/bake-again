# Приватна серверна проба фото

Ізольована admin-only Edge Function у чинному Supabase Bake Again. Не маршрут
гостьового upload і не публічна видача фото. Успішний реальний запуск 31.10.2026:
[протокол](../../../docs/architecture/community-photo-probe-2026-10-31.uk.md).

`index.mjs` використовує Deno і зафіксований `npm:@imagemagick/magick-wasm@0.0.45`.
Процесор спільний із Node-тестами: `scripts/community/wasm-photo.mjs`.
`npm run test:community` перевіряє той самий код; `npm run test:community:edge`
перевіряє відмову стороннім credentials у Deno (потрібен встановлений Deno).

Для однофайлового Dashboard editor:

```sh
node scripts/community/build-photo-probe.mjs
```

Результат — `tmp/community-edge-probe/index.mjs`, без секретів; його вміст
передається до `index.ts` у Dashboard. Не редагувати згенеровану копію замість
джерел. Не імпортувати ці модулі або WASM у продуктовий Cloudflare Worker.

Саша прямо погодила 31.10 переведення **лише цієї функції** з legacy JWT на
внутрішній secret key і запуск через тестер Supabase. Конфігурація цієї проби:
`verify_jwt = false`; доступ перевіряє handler до будь-яких операцій зі сховищем.
Він приймає лише наявний default secret key на `apikey` або наявний service-role
credential на Authorization. Публічний ключ і звичайний JWT користувача не дають
доступу. Це не дозвіл змінювати auth інших функцій чи personal backend.

Наявні ключі читає тільки сервер із керованого Supabase environment. Не копіювати
їх із панелі в локальні env, код, журнали чи документацію. Для тесту Dashboard
сам додає secret header; після запуску цей рядок прибрано з тестера.

Команди: `{"action":"run"}` для першої image/storage-проби,
`{"action":"admission"}` для короткого durable upload і
`{"action":"admission-expiry","id":"..."}` для його перевірки після deadline.
Усі команди лишаються admin-only; тіло до 1024 B. Другий сценарій використовує
`lib/community/server/photo-*.ts`, які builder транспілює без зміни логіки.
[Протокол короткого дозволу](../../../docs/architecture/community-photo-admission-2026-10-31.uk.md).

Перед другим сценарієм застосовані `20261031210000` і `20261031223000` в одній
транзакції. Для повторної інсталяції з чистого стану існує
`scripts/community/photo-admission-migration.mjs`; це генератор точного SQL із
history, не автоматичне розгортання і не скрипт для повтору на чинній базі.
Перша проба навмисно досліджує двогодинний signed upload, друга його не створює.
Другий сценарій створює лише синтетичний pending-внесок `community-probe` і
приватний raw-файл; результати й token у public API не з’являються.

Джерело фото
жорстко визначене: опублікований WebP бананових оладок Bake Again. Функція не
приймає довільні URL, шляхи чи bucket від виклику. Працює лише з окремим
`community-photo-probe` й відмовляється використовувати його, якщо він публічний.
Кожна проба створює окрему UUID-папку; upsert вимкнений. Читацьких даних немає.

Поточні обмеження: 2 MiB / 4 млн пікселів; один кадр JPEG/PNG/WebP. Спочатку
signature/MIME і ping розмірів/кількості кадрів, далі decode, autoOrient, strip та
WebP 82 до 1600px і WebP 78 до 480px. WASM memory cache 96 MiB, disk cache 0.
Це обмежена проба, а не підтверджена підтримка 10 MiB/24 MP чи HEIC.

Автоматичне завершення приймання admin-команд:
**2026-11-01 00:00 UTC / 01:00 Europe/Madrid**. Після цього handler відповідає
авторизованому виклику `410 PROBE_EXPIRED` до звернення до Storage. Приватні
результати зберігаються; функція не видаляє файли чи інші дані.
