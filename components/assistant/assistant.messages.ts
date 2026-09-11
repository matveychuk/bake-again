import type { AppLocale } from '@/lib/i18n/config';

export type AssistantSurface = 'recipe-detail' | 'cook-mode';
export type AssistantScopeKind = 'recipe' | 'flour' | 'step';

type AssistantMessages = {
  trigger: Record<AssistantScopeKind, string>;
  title: Record<AssistantSurface, Record<AssistantScopeKind, string>>;
  kicker: Record<AssistantScopeKind, string>;
  contextTitle: string;
  contextBody: Record<AssistantSurface, string>;
  suggestedQuestions: string;
  prompts: Record<AssistantSurface, Record<AssistantScopeKind, string[]>>;
  questionLabel: string;
  placeholder: string;
  send: string;
  close: string;
  loading: string;
  answerReady: string;
  emptyTitle: string;
  emptyBody: string;
  errorTitle: string;
  retry: string;
  disabledTitle: string;
  disabledBody: string;
  disclaimer: string;
  yourQuestion: string;
  genericError: string;
};

export const assistantMessages: Record<AppLocale, AssistantMessages> = {
  en: {
    trigger: {
      recipe: 'Ask about this recipe',
      flour: 'Can I use another mix?',
      step: 'Ask about this step',
    },
    title: {
      'recipe-detail': {
        recipe: 'Ask about this recipe',
        flour: 'Can I use another flour mix?',
        step: 'Ask about this step',
      },
      'cook-mode': {
        recipe: 'Ask while you cook',
        flour: 'Ask about the flour mix',
        step: 'Ask while you cook',
      },
    },
    kicker: {
      recipe: 'Recipe assistant',
      flour: 'Flour configuration',
      step: 'Current method step',
    },
    contextTitle: 'Using this recipe’s trusted context',
    contextBody: {
      'recipe-detail': 'Recipe facts and untested suggestions remain clearly separated.',
      'cook-mode': 'This step’s ingredients and checkpoints are included. Untested suggestions are labelled.',
    },
    suggestedQuestions: 'Suggested questions',
    prompts: {
      'recipe-detail': {
        recipe: ['Explain the timing', 'What can I prepare tonight?', 'What should I check before starting?'],
        flour: ['I have Schär Mix C', 'Why does the exact mix matter?', 'Which flour mix was used?'],
        step: ['Is my texture right?', 'Explain this more simply', 'When should I stop mixing?'],
      },
      'cook-mode': {
        recipe: ['What should I prepare next?', 'Explain the timing', 'What should I watch for?'],
        flour: ['Which flour mix was used?', 'Why does the exact mix matter?', 'Is another mix recorded?'],
        step: ['Does my texture sound right?', 'Explain this step more simply', 'What should I do if it looks too dry?'],
      },
    },
    questionLabel: 'Ask a question',
    placeholder: 'Ask in your own words…',
    send: 'Send question',
    close: 'Close assistant',
    loading: 'Checking the recipe context…',
    answerReady: 'A new assistant answer is ready.',
    emptyTitle: 'No answer was returned',
    emptyBody: 'Try asking in a shorter or more specific way.',
    errorTitle: 'The assistant could not answer',
    retry: 'Try again',
    disabledTitle: 'Assistant unavailable',
    disabledBody: 'You can still use the recipe and Cook Mode without the assistant.',
    disclaimer: 'AI can make mistakes. Recipe status always comes from the reviewed collection.',
    yourQuestion: 'Your question',
    genericError: 'Something went wrong. Please try again.',
  },
  es: {
    trigger: {
      recipe: 'Preguntar sobre esta receta',
      flour: '¿Puedo usar otra mezcla?',
      step: 'Preguntar sobre este paso',
    },
    title: {
      'recipe-detail': {
        recipe: 'Pregunta sobre esta receta',
        flour: '¿Puedo usar otra mezcla de harina?',
        step: 'Pregunta sobre este paso',
      },
      'cook-mode': {
        recipe: 'Pregunta mientras cocinas',
        flour: 'Pregunta sobre la mezcla de harina',
        step: 'Pregunta mientras cocinas',
      },
    },
    kicker: {
      recipe: 'Asistente de receta',
      flour: 'Configuración de harina',
      step: 'Paso actual del método',
    },
    contextTitle: 'Usando el contexto fiable de esta receta',
    contextBody: {
      'recipe-detail': 'Los datos de la receta y las sugerencias no probadas permanecen claramente separados.',
      'cook-mode': 'Se incluyen los ingredientes y puntos de control de este paso. Las sugerencias no probadas llevan una etiqueta.',
    },
    suggestedQuestions: 'Preguntas sugeridas',
    prompts: {
      'recipe-detail': {
        recipe: ['Explícame los tiempos', '¿Qué puedo preparar esta noche?', '¿Qué debo comprobar antes de empezar?'],
        flour: ['Tengo Schär Mix C', '¿Por qué importa la mezcla exacta?', '¿Qué mezcla de harina se utilizó?'],
        step: ['¿La textura es correcta?', 'Explica este paso de forma más sencilla', '¿Cuándo debo dejar de mezclar?'],
      },
      'cook-mode': {
        recipe: ['¿Qué debo preparar después?', 'Explícame los tiempos', '¿En qué debo fijarme?'],
        flour: ['¿Qué mezcla de harina se utilizó?', '¿Por qué importa la mezcla exacta?', '¿Hay otra mezcla registrada?'],
        step: ['¿La textura que describo es correcta?', 'Explica este paso de forma más sencilla', '¿Qué hago si parece demasiado seco?'],
      },
    },
    questionLabel: 'Haz una pregunta',
    placeholder: 'Pregunta con tus propias palabras…',
    send: 'Enviar pregunta',
    close: 'Cerrar asistente',
    loading: 'Consultando el contexto de la receta…',
    answerReady: 'Hay una nueva respuesta del asistente.',
    emptyTitle: 'No se ha recibido una respuesta',
    emptyBody: 'Prueba con una pregunta más breve o específica.',
    errorTitle: 'El asistente no pudo responder',
    retry: 'Intentar de nuevo',
    disabledTitle: 'Asistente no disponible',
    disabledBody: 'Puedes seguir usando la receta y el modo Cocina sin el asistente.',
    disclaimer: 'La IA puede equivocarse. El estado de la receta siempre procede de la colección revisada.',
    yourQuestion: 'Tu pregunta',
    genericError: 'Algo ha salido mal. Inténtalo de nuevo.',
  },
  uk: {
    trigger: {
      recipe: 'Запитати про цей рецепт',
      flour: 'Чи можна взяти іншу суміш?',
      step: 'Запитати про цей крок',
    },
    title: {
      'recipe-detail': {
        recipe: 'Запитайте про цей рецепт',
        flour: 'Чи можна взяти іншу борошняну суміш?',
        step: 'Запитайте про цей крок',
      },
      'cook-mode': {
        recipe: 'Запитайте під час приготування',
        flour: 'Запитайте про борошняну суміш',
        step: 'Запитайте під час приготування',
      },
    },
    kicker: {
      recipe: 'Помічник рецепта',
      flour: 'Налаштування борошна',
      step: 'Поточний крок способу',
    },
    contextTitle: 'Використовуємо надійний контекст цього рецепта',
    contextBody: {
      'recipe-detail': 'Факти з рецепта та неперевірені пропозиції залишаються чітко розділеними.',
      'cook-mode': 'Враховано інгредієнти й контрольні ознаки цього кроку. Неперевірені пропозиції мають позначку.',
    },
    suggestedQuestions: 'Запропоновані запитання',
    prompts: {
      'recipe-detail': {
        recipe: ['Поясніть тривалість етапів', 'Що можна підготувати сьогодні ввечері?', 'Що перевірити перед початком?'],
        flour: ['У мене є Schär Mix C', 'Чому важлива точна суміш?', 'Яку борошняну суміш використовували?'],
        step: ['Чи правильна в мене текстура?', 'Поясніть цей крок простіше', 'Коли потрібно припинити змішування?'],
      },
      'cook-mode': {
        recipe: ['Що підготувати далі?', 'Поясніть тривалість етапів', 'На що звернути увагу?'],
        flour: ['Яку борошняну суміш використовували?', 'Чому важлива точна суміш?', 'Чи записано іншу суміш?'],
        step: ['Чи схожа описана мною текстура на правильну?', 'Поясніть цей крок простіше', 'Що робити, якщо суміш здається надто сухою?'],
      },
    },
    questionLabel: 'Поставте запитання',
    placeholder: 'Запитайте своїми словами…',
    send: 'Надіслати запитання',
    close: 'Закрити помічника',
    loading: 'Перевіряємо контекст рецепта…',
    answerReady: 'Нова відповідь помічника готова.',
    emptyTitle: 'Відповідь не надійшла',
    emptyBody: 'Спробуйте сформулювати запитання коротше або точніше.',
    errorTitle: 'Помічник не зміг відповісти',
    retry: 'Спробувати ще раз',
    disabledTitle: 'Помічник недоступний',
    disabledBody: 'Рецептом і режимом приготування можна користуватися без помічника.',
    disclaimer: 'ШІ може помилятися. Статус рецепта завжди походить із перевіреної колекції.',
    yourQuestion: 'Ваше запитання',
    genericError: 'Щось пішло не так. Спробуйте ще раз.',
  },
};
