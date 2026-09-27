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
        title: 'У цьому браузері',
        body: 'Збережені рецепти, список покупок, прогрес приготування, таймери, приватні нотатки та вибір мови зберігаються локально в браузері. Ці дані не синхронізуються з іншими пристроями. Ваша нотатка не публікується як відгук і не змінює статус рецепта.',
      },
      {
        title: 'Керуйте збереженнями',
        body: 'Закладка прибирає рецепт зі збережених. У списку покупок можна видалити окремий продукт або очистити весь список. Нотатку можна змінити після приготування. Очищення даних цього сайту в налаштуваннях браузера видаляє всі ці локальні збереження.',
      },
      {
        title: 'Базова статистика',
        body: 'Bake Again використовує Umami, щоб рахувати перегляди сторінок і використання основних функцій: пошуку, збереження рецептів, списку покупок та режиму приготування. Аналітика працює без cookies. Тексти пошуку, приватних нотаток і запитань до помічника не надсилаються до Umami. Параметри адрес сторінок вилучаються; для джерела переходу передається лише домен. Якщо у браузері увімкнено Do Not Track, статистика не збирається.',
      },
      {
        title: 'Якщо користуєтеся помічником',
        body: 'Коли помічник доступний, ваше запитання й контекст рецепта надсилаються на сервер для формування відповіді за допомогою OpenAI. Це окрема дія від збереження приватної нотатки.',
      },
    ],
  },
  en: {
    title: 'Privacy and your saved items',
    intro: 'How Bake Again stores your recipes, shopping and notes.',
    sections: [
      {
        title: 'In this browser',
        body: 'Saved recipes, shopping lists, cooking progress, timers, private notes and your language preference are stored locally in your browser. They do not sync to other devices. Your private note is not published as a review and does not change the recipe’s testing status.',
      },
      {
        title: 'Manage your saved items',
        body: 'Use the bookmark to remove a saved recipe. You can remove individual products or clear your shopping list. Edit a private note after cooking. Clearing this site’s data in your browser settings removes all of these local saved items.',
      },
      {
        title: 'Basic analytics',
        body: 'Bake Again uses Umami to count page views and use of key features: search, saved recipes, shopping lists and Cook Mode. Analytics uses no cookies. Search text, private notes and assistant questions are not sent to Umami. Page URL parameters are removed; only the referring origin is sent. Analytics is disabled when your browser enables Do Not Track.',
      },
      {
        title: 'If you use the assistant',
        body: 'When the assistant is available, your question and recipe context are sent to the server to produce a response using OpenAI. This is separate from saving a private cooking note.',
      },
    ],
  },
  es: {
    title: 'Privacidad y tus datos guardados',
    intro: 'Cómo guarda Bake Again tus recetas, compras y notas.',
    sections: [
      {
        title: 'En este navegador',
        body: 'Las recetas guardadas, la lista de la compra, el progreso de preparación, los temporizadores, las notas privadas y el idioma se guardan localmente en tu navegador. No se sincronizan con otros dispositivos. Tu nota privada no se publica como reseña ni cambia el estado de prueba de la receta.',
      },
      {
        title: 'Gestiona tus datos guardados',
        body: 'Usa el marcador para quitar una receta guardada. Puedes eliminar productos individuales o vaciar la lista de la compra. Puedes editar una nota al terminar de cocinar. Borrar los datos de este sitio en los ajustes del navegador elimina todos estos datos locales.',
      },
      {
        title: 'Estadísticas básicas',
        body: 'Bake Again utiliza Umami para contar las visitas a las páginas y el uso de las funciones principales: búsqueda, recetas guardadas, lista de la compra y modo de preparación. La analítica no utiliza cookies. Los textos de búsqueda, las notas privadas y las preguntas al asistente no se envían a Umami. Se eliminan los parámetros de las direcciones; del origen de la visita solo se envía el dominio. Si activas Do Not Track en tu navegador, no se recopilan estadísticas.',
      },
      {
        title: 'Si utilizas el asistente',
        body: 'Cuando el asistente está disponible, tu pregunta y el contexto de la receta se envían al servidor para generar una respuesta mediante OpenAI. Esta acción es independiente de guardar una nota privada.',
      },
    ],
  },
};
