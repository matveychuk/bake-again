# API й повторне використання — перевірка 22.10.2026

## Уточнення браузером 23.10.2026

В акаунті **Plan Gratis**, на наявному Facebook flow `шоколад`, перевірено меню
огляду та dropdown біля Guardar у редакторі. У меню огляду немає Copy flow.
Dropdown показує **Guarda y envíalo a ti mismo**, **Guardar y salir**,
**Compartir este flujo**. **Save as a new flow** і **Save template** у цьому
контексті відсутні. Share не тестувався як обхід Copy: це окрема дія.

Відкрита бібліотека Plantillas. Картки `Lead magnet para suscripción` і
`Inscribirse en un webinar` не відкрили preview, зокрема після reload; пізніше
пряме відкриття редактора показало `Error loading page. Please reload.`.
Тому роботу Save as a new flow / Save template у бібліотечному редакторі
практично НЕ підтверджено. Відсутність у звичайному редакторі не доводить
відсутності в усіх інших контекстах. Нових flow/шаблонів, відправлень,
платного тарифу чи trial не створено; чинний граф не зберігався й не змінювався.

Наступний контроль, коли бібліотека працюватиме: відкрити безплатний шаблон,
оглянути dropdown саме в його редакторі; якщо є Save as a new flow — перевірити
на окремій незапущеній тестовій копії без прив'язки коментарного тригера.
Save template за описом довідки оновлює шаблон бібліотеки, а не автоматично
перетворює довільний чинний flow на власний шаблон. Не обіцяти безплатний обхід.

Схема нашої спільної видачі й пропозиції спрощення:
`docs/architecture/lead-magnet-flow-shokolad.uk.md`.

Перевірено публічні офіційні джерела та поточний локальний Brevo-клієнт.
Це документовані можливості; успішне створення через API в акаунтах не тестувалось.
Ключі не створювались, інтеграції не підключались, живі flow не змінювались.

## Brevo

Для нашої видачі браузер не потрібен при кожному новому продукті. Поточний
`lib/newsletter/brevo-api.ts` уже використовує:

| Дія | Метод |
| --- | --- |
| Перевірити контакт/списки/блокування | `GET /v3/contacts/{identifier}` |
| Надіслати native DOI | `POST /v3/contacts/doubleOptinConfirmation` |
| Надіслати продуктовий HTML-лист | `POST /v3/smtp/email` |

Окремо API підтримує `POST /v3/smtp/templates` та
`PUT /v3/smtp/templates/{templateId}` для створення/оновлення email-шаблонів.
Для звичайного нового магніту цього не потрібно: продуктовий HTML генерується
нашим кодом, спільний DOI #20 використовується повторно. Не плутай API email-
шаблону зі створенням графа Brevo Automation: останнє цією перевіркою не доведено
і для поточної архітектури не потрібне.

Офіційні джерела:
- [Контакт](https://developers.brevo.com/reference/get-contact-info)
- [DOI](https://developers.brevo.com/reference/create-doi-contact)
- [Відправлення листа](https://developers.brevo.com/reference/send-transac-email)
- [Створення шаблону](https://developers.brevo.com/reference/create-smtp-template)
- [Оновлення шаблону](https://developers.brevo.com/reference/update-smtp-template)

## SendPulse API / MCP

Прочитано офіційні OpenAPI JSON для Instagram і Facebook Messenger. В обох:

| Метод | Що робить |
| --- | --- |
| `GET /flows` | Перелік уже створених flow |
| `POST /flows/run` | Запуск готового flow для контакту |
| `POST /flows/runByTrigger` | Запуск за ключовими словами тригера |
| `GET /triggers` | Перелік тригерів |

У цих схемах немає документованих методів створення/зміни/копіювання графа flow
або створення коментарного тригера. Це висновок про опублікований API, а не доказ
відсутності будь-яких внутрішніх чи майбутніх можливостей. Не використовуй приватні
запити редактора як підтримуваний API і не подавай Run flow як Create flow.

Facebook `POST /templates` створює message template категорії UTILITY та подає
його на погодження. Це не flow-шаблон і не спосіб копіювати нашу коментарну гілку.
Офіційний MCP перелічує `chatbots_flows_list` і `chatbots_flows_run`, але не
створення/редагування/копіювання flow. Підключати MCP лише заради створення flow
за наявною документацією немає підстав.

Джерела:
- [Instagram OpenAPI](https://sendpulse.com/swagger/instagram/?lang=en)
- [Facebook OpenAPI](https://sendpulse.com/swagger/messenger/?lang=en)
- [Команди MCP](https://sendpulse.com/knowledge-base/account-settings/mcp-tools)

## Копіювання й бібліотека шаблонів — різні функції

- **Власний готовий flow → Copy flow:** офіційна стаття позначає платний план,
  включно з копією в тому самому боті. Шлях: flow → три крапки → Copy flow.
  Копія між каналами може вимагати виправлення непідтримуваних елементів.
- **Готовий шаблон бібліотеки → Copy flow:** Free включає premade templates;
  шаблони з платними елементами вимагають upgrade. Це не доводить, що власну
  довільну гілку можна безкоштовно перетворити на повторно копійований шаблон.
- Стаття про бібліотеку також описує **Save as a new flow** та **Save template**.
  Вона не уточнює всі тарифні обмеження цих дій. Не вважай їх підтвердженим
  обходом платного Copy flow; перевір доступність конкретно у поточному акаунті.
- Чинний UI акаунта показав **Plan Gratis**. Повний успішний цикл створення копії
  навмисно не виконувався. Наявність Duplicate блока не доводить доступність копії графа.

Джерела:
- [Копіювання власного flow](https://sendpulse.com/knowledge-base/chatbot/copy-chatbot-flow)
- [Flow з шаблону та варіанти збереження](https://sendpulse.com/knowledge-base/chatbot/create-flow-using-templates)
- [Плани Chatbots](https://sendpulse.com/pricing/messengers)

Практичний шлях на Free: повторно використати код видачі й готові тексти; у
SendPulse додавати лише коментарний тригер, повідомлення та URL-кнопку. На платному
плані — Copy flow та зміна продуктового тексту/URL, потім окреме налаштування
тригера. Рішення купувати тариф не погоджене. Обхід SendPulse через власну Meta-
інтеграцію — окремий проєкт з дозволами/вебхуками/підтримкою, не швидка заміна.
