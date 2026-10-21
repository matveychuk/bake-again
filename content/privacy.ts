import type { AppLocale } from '@/lib/i18n/config';

export const privacyContent: Record<
  AppLocale,
  { title: string; intro: string; sections: { title: string; body: string }[] }
> = {
  uk: {
    title: 'Приватність і ваші збереження',
    intro: 'Як Bake Again зберігає ваші рецепти, покупки та нотатки.',
    sections: [
      {
        title: 'Ваш акаунт і пристрій',
        body: 'Збережені рецепти, покупки, приватні нотатки, записи випікання та колекції доступні після входу й зберігаються в Supabase. Гостьові персональні збереження та перенесення з браузера не використовуються. Під час входу браузер зберігає сесію й тимчасовий кеш акаунта для надійного надсилання змін. Чернетка нотатки без входу залишається лише у відкритій сторінці. Прогрес приготування та таймери не синхронізуються. Вибір мови зберігається на пристрої. Нотатка не публікується як відгук і не змінює статус рецепта.',
      },
      {
        title: 'Керуйте збереженнями',
        body: 'Закладка прибирає рецепт зі збережених. У списку покупок можна видалити окремий продукт або очистити весь список. Нотатку можна змінити після приготування. Очищення даних сайту в браузері видаляє локальні збереження, але не хмарні. Перед виходом сайт намагається зберегти зміни; якщо це не вдалося, вихід зупиняється. Після виходу кеш акаунта очищається.',
      },
      {
        title: 'Нещодавно переглянуті рецепти',
        body: 'У цьому браузері зберігаються ідентифікатори останніх 12 переглянутих опублікованих рецептів. На головній і на сторінках рецептів показуються до трьох із них. Кнопка «Очистити історію» видаляє лише історію переглядів: збережені рецепти, список покупок і приватні нотатки залишаються. Ця історія не надсилається на сервер.',
      },
      {
        title: 'Якщо підписуєтеся на листи',
        body: 'Форма підписки доступна на сайті або на сторінці Brevo. Ви вказуєте email-адресу й натискаєте «Підписатися на листи», погоджуючись отримувати розсилку Bake Again про нові рецепти та матеріали для випічки. Мова розсилки відповідає мові форми; окремо вибирати її не потрібно. Brevo обробляє email-адресу, мовний список і відомості про підтвердження підписки. Нова підписка активується після підтвердження в листі. Відписатися можна через посилання в кожному листі; це не видаляє акаунт або збережені рецепти. Покупка чи створення акаунта не підписує вас на розсилку. Для запиту PDF сайт перевіряє чинну підписку через Brevo: активним підписникам надсилає запитаний матеріал одразу, новим — після підтвердження email. У Cloudflare тимчасово зберігаються email, назва матеріалу, час і стан видачі, хеш одноразового токена та захищений мережевий ідентифікатор для обмеження повторних запитів. Записи старші за сім днів прибираються під час наступних запитів. Під час перевірки Turnstile Cloudflare отримує IP-адресу. Email і токени не передаються в аналітику. Щоб не повторювати пропозицію підписки, браузер локально запам’ятовує паузу на 30 днів після показу чи закриття та на 180 днів після переходу до форми. Ця позначка не є підтвердженням підписки й не синхронізується з акаунтом.',
      },
      {
        title: 'Базова статистика',
        body: 'Bake Again використовує Umami, щоб рахувати перегляди сторінок і використання основних функцій: пошуку, збереження рецептів, списку покупок та режиму приготування. Аналітика працює без cookies. Тексти пошуку, приватних нотаток і запитань до помічника не надсилаються до Umami. Параметри адрес сторінок вилучаються; для джерела переходу передається лише домен. Якщо у браузері увімкнено Do Not Track, статистика не збирається.',
      },
      {
        title: 'Якщо користуєтеся помічником',
        body: 'Готові відповіді до кроків відкриваються без OpenAI. Коли ви надсилаєте власне запитання, сервер передає OpenAI запитання, коротку історію розмови та контекст рецепта. Для захисту від зловживань використовується підписана cookie на 48 годин. Перевірка Cloudflare Turnstile завантажується після переходу до поля власного запитання; під час перевірки Cloudflare отримує IP-адресу. У базі лімітів зберігаються лише захищені ідентифікатори, час і резерв витрат — без текстів запитань та відповідей. Під час наступних запитів ідентифікатори старші за 48 годин прибираються, а записи витрат старші за 35 днів видаляються. Приватні нотатки до помічника не передаються.',
      },
    ],
  },
  en: {
    title: 'Privacy and your saved items',
    intro: 'How Bake Again stores your recipes, shopping and notes.',
    sections: [
      {
        title: 'Your account and device',
        body: 'Saved recipes, shopping, private notes, bake records and collections require sign-in and are stored in Supabase. Guest personal storage and browser imports are not used. The browser stores the sign-in session and a temporary account cache for reliable delivery of changes. A note drafted before signing in stays only on the open page. Cooking progress and timers do not sync. Language preferences stay on your device. Your note is not published as a review and does not change the recipe’s testing status.',
      },
      {
        title: 'Manage your saved items',
        body: 'Use the bookmark to remove a saved recipe. You can remove individual products or clear your shopping list. Edit a private note after cooking. Clearing site data in your browser removes local items, but not cloud records. Before signing out, the site attempts to save pending changes; sign-out stops if saving fails. The account cache is cleared after sign-out.',
      },
      {
        title: 'Recently viewed recipes',
        body: 'This browser stores the IDs of your last 12 viewed published recipes. Up to three appear on the home and recipe pages. Clear history removes only viewing history: saved recipes, shopping lists and private notes remain. This history is not sent to the server.',
      },
      {
        title: 'If you subscribe to emails',
        body: 'Signup forms are available on the site or on a Brevo page. You enter your email address and click “Subscribe to emails” to agree to receive Bake Again emails about new recipes and baking resources. The email language matches the form language; no separate selection is needed. Brevo processes your email address, language-specific list and subscription confirmation records. A new subscription activates after email confirmation. You can unsubscribe through the link in every email; this does not delete your account or saved recipes. Buying something or creating an account does not subscribe you to the newsletter. For PDF requests, the site checks the existing Brevo subscription and sends the requested material immediately to active subscribers, or after email confirmation to new subscribers. Cloudflare temporarily stores the email address, requested material, delivery timestamps and status, a one-time token hash, and a protected network identifier for request limits. Records older than seven days are removed during subsequent requests. Cloudflare receives the IP address during Turnstile verification. Email addresses and tokens are not sent to analytics. To avoid repeating the invitation, the browser locally remembers a 30-day pause after showing or dismissing it, or 180 days after opening the signup form. This preference is not proof of subscription and does not sync with your account.',
      },
      {
        title: 'Basic analytics',
        body: 'Bake Again uses Umami to count page views and use of key features: search, saved recipes, shopping lists and Cook Mode. Analytics uses no cookies. Search text, private notes and assistant questions are not sent to Umami. Page URL parameters are removed; only the referring origin is sent. Analytics is disabled when your browser enables Do Not Track.',
      },
      {
        title: 'If you use the assistant',
        body: 'Prepared step answers open without OpenAI. When you send your own question, the server sends OpenAI the question, a short conversation history and recipe context. Abuse protection uses a signed cookie lasting 48 hours. Cloudflare Turnstile loads when you enter the custom-question field; Cloudflare receives your IP address during verification. The quota database stores only protected identifiers, timestamps and reserved spend, without question or answer text. Subsequent requests remove identifiers older than 48 hours and spend records older than 35 days. Private cooking notes are not sent to the assistant.',
      },
    ],
  },
  es: {
    title: 'Privacidad y tus datos guardados',
    intro: 'Cómo guarda Bake Again tus recetas, compras y notas.',
    sections: [
      {
        title: 'Tu cuenta y dispositivo',
        body: 'Las recetas guardadas, compras, notas privadas, registros de horneado y colecciones requieren iniciar sesión y se guardan en Supabase. No se usan guardados personales de invitado ni importaciones del navegador. El navegador conserva la sesión y una caché temporal de la cuenta para enviar los cambios de forma fiable. Una nota redactada sin iniciar sesión permanece solo en la página abierta. El progreso y los temporizadores no se sincronizan. El idioma se recuerda en el dispositivo. Tu nota no se publica como reseña ni cambia el estado de prueba de la receta.',
      },
      {
        title: 'Gestiona tus datos guardados',
        body: 'Usa el marcador para quitar una receta guardada. Puedes eliminar productos individuales o vaciar la lista de la compra. Puedes editar una nota al terminar de cocinar. Borrar los datos del sitio en el navegador elimina los datos locales, pero no los registros de la nube. Antes de salir, el sitio intenta guardar los cambios pendientes; si falla, se detiene la salida. Al salir se borra la caché de la cuenta.',
      },
      {
        title: 'Recetas vistas recientemente',
        body: 'Este navegador guarda los identificadores de las últimas 12 recetas publicadas que has visitado. Se muestran hasta tres en el inicio y en las páginas de recetas. Borrar historial elimina solo el historial de visitas: conserva tus recetas guardadas, la lista de la compra y las notas privadas. Este historial no se envía al servidor.',
      },
      {
        title: 'Si te suscribes a los correos',
        body: 'Los formularios de suscripción están disponibles en el sitio o en una página de Brevo. Introduces tu dirección de correo y pulsas «Suscribirme por correo» para aceptar recibir mensajes de Bake Again sobre nuevas recetas y recursos de repostería. El idioma de los correos corresponde al del formulario; no hace falta seleccionarlo aparte. Brevo trata tu dirección de correo, la lista por idioma y los registros de confirmación de la suscripción. Una nueva suscripción se activa tras confirmarla por correo. Puedes darte de baja mediante el enlace de cada mensaje; esto no elimina tu cuenta ni tus recetas guardadas. Comprar o crear una cuenta no te suscribe a la newsletter. Para solicitar un PDF, el sitio comprueba la suscripción en Brevo y envía el material solicitado directamente a suscriptores activos, o tras confirmar el correo a nuevos suscriptores. Cloudflare guarda temporalmente el correo, el material solicitado, las fechas y el estado del envío, el hash de un token de un solo uso y un identificador de red protegido para limitar solicitudes. Los registros de más de siete días se eliminan durante solicitudes posteriores. Cloudflare recibe la dirección IP durante la comprobación de Turnstile. El correo y los tokens no se envían a la analítica. Para no repetir la invitación, el navegador recuerda localmente una pausa de 30 días tras mostrarla o cerrarla, o de 180 días tras abrir el formulario. Esta preferencia no confirma una suscripción ni se sincroniza con tu cuenta.',
      },
      {
        title: 'Estadísticas básicas',
        body: 'Bake Again utiliza Umami para contar las visitas a las páginas y el uso de las funciones principales: búsqueda, recetas guardadas, lista de la compra y modo de preparación. La analítica no utiliza cookies. Los textos de búsqueda, las notas privadas y las preguntas al asistente no se envían a Umami. Se eliminan los parámetros de las direcciones; del origen de la visita solo se envía el dominio. Si activas Do Not Track en tu navegador, no se recopilan estadísticas.',
      },
      {
        title: 'Si utilizas el asistente',
        body: 'Las respuestas preparadas de los pasos se abren sin OpenAI. Al enviar tu propia pregunta, el servidor envía a OpenAI la pregunta, un historial breve de la conversación y el contexto de la receta. La protección contra abusos utiliza una cookie firmada de 48 horas. Cloudflare Turnstile se carga al entrar en el campo de preguntas propias; Cloudflare recibe tu dirección IP durante la verificación. La base de límites guarda solo identificadores protegidos, horas y gasto reservado, sin textos de preguntas ni respuestas. Las solicitudes posteriores eliminan los identificadores de más de 48 horas y los registros de gasto de más de 35 días. Las notas privadas no se envían al asistente.',
      },
    ],
  },
};
