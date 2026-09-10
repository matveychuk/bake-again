import type { AppLocale } from './config';

type UiMessages = {
  navigation: {
    recipes: string;
    saved: string;
    shoppingList: string;
  };
  language: {
    change: string;
    select: string;
  };
  a11y: {
    wordmarkHome: string;
    primaryNavigation: string;
    recipeStatus: (status: string, detail?: string | null) => string;
    recipeRecordStatus: (status: string, detail?: string | null) => string;
  };
  home: {
    eyebrow: string;
    title: [string, string, string];
    intro: string;
    searchLabel: string;
    searchPlaceholder: string;
    searchAction: string;
    inventoryHint: (count: number) => string;
    featuredKicker: string;
    featuredTitle: string;
    discoveryTitle: string;
    discoveryLinks: string[];
    recipesEyebrow: string;
    recipesTitle: string;
    viewAll: string;
    trustEyebrow: string;
    trustTitle: string;
    trustGuide: string;
    testedExplanation: string;
    trustNote: string;
    howWeTest: string;
  };
  catalog: {
    eyebrow: string;
    title: [string, string];
    intro: string;
    collectionEyebrow: string;
    allRecipes: string;
    detailsToConfirm: string;
    workingRecord: string;
  };
  cook: {
    backToRecipe: string;
    exit: string;
    unavailableKicker: string;
    unavailableTitle: string;
    unavailableLink: string;
    unavailableRecord: string;
    adjustedStatus: string;
    progress: (current: number, total: number) => string;
  };
  recipe: {
    backToRecipes: string;
    inventoryDraft: string;
    workingRecord: string;
    workingRecordExplanation: string;
    difficulty: string;
    activeTime: string;
    totalTime: string;
    flour: string;
    toConfirm: string;
    authorPhotoPending: string;
    generatedPreviewPending: string;
    beforeStart: string;
    planAhead: string;
    keepInMind: string;
    ingredients: string;
    ingredientsIntro: string;
    method: (count: number) => string;
    stepByStep: string;
    openCookMode: string;
    methodPending: string;
    methodPendingDescription: string;
    beforePublishing: string;
    translationPending: string;
  };
  status: {
    tested: { label: string; explanation: string };
    calculated: { label: string; explanation: string };
    suggested: { label: string; explanation: string };
  };
  metadata: {
    home: { title: string; description: string };
    recipes: { title: string; description: string };
    cook: (recipeTitle: string) => { title: string; description: string };
    saved: { title: string; description: string };
    shoppingList: { title: string; description: string };
  };
  personal: {
    save: string;
    removeSaved: string;
    savedTitle: string;
    savedEmpty: string;
    browseRecipes: string;
    shoppingTitle: string;
    shoppingEmpty: string;
    addIngredients: string;
    addAll: string;
    reviewIngredients: string;
    addToList: string;
    addedToList: string;
    openShoppingList: string;
    chooseOptionBeforeAdding: string;
    removeItem: string;
    source: string;
    asNeeded: string;
    chooseOne: string;
    testedBaseOnly: string;
  };
};

export const uiMessages: Record<AppLocale, UiMessages> = {
  en: {
    navigation: {
      recipes: 'Recipes',
      saved: 'Saved',
      shoppingList: 'Shopping list',
    },
    language: {
      change: 'Change language',
      select: 'Select language',
    },
    a11y: { wordmarkHome: 'Bake Again home', primaryNavigation: 'Primary navigation', recipeStatus: (status, detail) => `Testing status: ${status}${detail ? `, ${detail}` : ''}`, recipeRecordStatus: (status, detail) => `Recipe record: ${status}${detail ? `, ${detail}` : ''}` },
    home: {
      eyebrow: 'A small collection of tested gluten-free recipes', title: ['Bake what', 'you love.', 'Know what works.'],
      intro: 'Familiar cakes, cookies and breakfasts — carefully adjusted, baked again, and written so you can get the same result at home.',
      searchLabel: 'Search recipes', searchPlaceholder: 'What would you like to bake?', searchAction: 'Search', inventoryHint: (count) => `Browse all ${count} working recipes in the current inventory.`,
      featuredKicker: 'Start with a classic', featuredTitle: 'Napoleon cake', discoveryTitle: 'Choose by the moment', discoveryLinks: ['For breakfast', 'Something for every day', 'For a celebration', 'Prepare ahead', 'I just want to bake'],
      recipesEyebrow: 'Current inventory', recipesTitle: 'Every recipe so far.', viewAll: 'View all recipes', trustEyebrow: 'Clear recipe status', trustTitle: 'Know what was baked — and what was only worked out.', trustGuide: 'Recipe status guide', testedExplanation: 'Baked as written.', trustNote: 'Every recipe names the flour mix, form and quantity actually used. A tested original may still have a calculated variation.', howWeTest: 'How we test recipes',
    },
    catalog: { eyebrow: 'Working recipe inventory', title: ['Recipes made to be', 'baked again.'], intro: 'All currently known recipes are shown here, including drafts. Missing text, timing and photo approvals remain clearly marked.', collectionEyebrow: 'Current collection', allRecipes: 'All recipes', detailsToConfirm: 'Details to confirm', workingRecord: 'Working record' },
    cook: { backToRecipe: 'Back to recipe', exit: 'Exit Cook Mode', unavailableKicker: 'Cook Mode is not ready yet', unavailableTitle: 'The source does not contain a usable method.', unavailableLink: 'Read the recipe record', unavailableRecord: 'This recipe record is not available.', adjustedStatus: 'Calculated', progress: (current, total) => `Step ${current} of ${total}` },
    recipe: { backToRecipes: 'Recipes', inventoryDraft: 'Inventory draft', workingRecord: 'Working record', workingRecordExplanation: 'This source-backed record is not yet a publishable Tested recipe.', difficulty: 'Difficulty', activeTime: 'Active time', totalTime: 'Total time', flour: 'Flour', toConfirm: 'To confirm', authorPhotoPending: 'Author photo · review pending', generatedPreviewPending: 'Generated preview · approval pending', beforeStart: 'Before you start', planAhead: 'Plan for the rest.', keepInMind: 'Keep this in mind', ingredients: 'Ingredients', ingredientsIntro: 'Conditions and unresolved details stay visible.', method: (count) => `Method · ${count} steps`, stepByStep: 'Make it step by step.', openCookMode: 'Open Cook Mode', methodPending: 'Method pending', methodPendingDescription: 'A usable method is not available in the source yet.', beforePublishing: 'Before publishing', translationPending: 'This source-backed recipe is awaiting editorial translation for this language.' },
    status: {
      tested: { label: 'Tested', explanation: 'This exact version was baked successfully.' },
      calculated: { label: 'Calculated', explanation: 'Quantities scaled. This version has not been bake-tested.' },
      suggested: { label: 'Suggested', explanation: 'An idea to try. This change has not been bake-tested.' },
    },
    metadata: {
      home: {
        title: 'Bake Again — Tested gluten-free baking',
        description: 'A small collection of carefully tested gluten-free recipes.',
      },
      recipes: {
        title: 'Recipes — Bake Again',
        description: 'The complete working Bake Again recipe inventory.',
      },
      cook: (recipeTitle) => ({
        title: `${recipeTitle} — Cook Mode — Bake Again`,
        description: `Step-by-step cooking view for ${recipeTitle}.`,
      }),
      saved: { title: 'Saved recipes — Bake Again', description: 'Recipes you want to bake again.' },
      shoppingList: { title: 'Shopping list — Bake Again', description: 'Ingredients for your saved baking plans.' },
    },
    personal: { save: 'Save recipe', removeSaved: 'Remove from Saved', savedTitle: 'Saved recipes', savedEmpty: 'No recipes saved yet.', browseRecipes: 'Browse recipes', shoppingTitle: 'Shopping list', shoppingEmpty: 'Your shopping list is empty.', addIngredients: 'Add Tested base ingredients', addAll: 'Add all', reviewIngredients: 'Review ingredients', addToList: 'Add to shopping list', addedToList: 'Ingredients added to your shopping list.', openShoppingList: 'Open shopping list', chooseOptionBeforeAdding: 'Choose an option for every “Choose one” ingredient to add the list.', removeItem: 'Remove item', source: 'From', asNeeded: 'As needed', chooseOne: 'Choose one', testedBaseOnly: 'Available for the Tested base only' },
  },
  es: {
    navigation: {
      recipes: 'Recetas',
      saved: 'Guardadas',
      shoppingList: 'Lista de compra',
    },
    language: {
      change: 'Cambiar idioma',
      select: 'Seleccionar idioma',
    },
    a11y: { wordmarkHome: 'Inicio de Bake Again', primaryNavigation: 'Navegación principal', recipeStatus: (status, detail) => `Estado de prueba: ${status}${detail ? `, ${detail}` : ''}`, recipeRecordStatus: (status, detail) => `Ficha de receta: ${status}${detail ? `, ${detail}` : ''}` },
    home: {
      eyebrow: 'Una pequeña colección de recetas sin gluten probadas', title: ['Hornea lo que', 'te gusta.', 'Sabe qué funciona.'],
      intro: 'Pasteles, galletas y desayunos conocidos: ajustados con cuidado, horneados de nuevo y escritos para que puedas obtener el mismo resultado en casa.',
      searchLabel: 'Buscar recetas', searchPlaceholder: '¿Qué te gustaría hornear?', searchAction: 'Buscar', inventoryHint: (count) => `Explora las ${count} recetas de trabajo del inventario actual.`,
      featuredKicker: 'Empieza con un clásico', featuredTitle: 'Tarta Napoleón', discoveryTitle: 'Elige según el momento', discoveryLinks: ['Para desayunar', 'Para cada día', 'Para una celebración', 'Para preparar con antelación', 'Solo quiero hornear'],
      recipesEyebrow: 'Inventario actual', recipesTitle: 'Todas las recetas hasta ahora.', viewAll: 'Ver todas las recetas', trustEyebrow: 'Estado claro de la receta', trustTitle: 'Distingue lo horneado de lo calculado.', trustGuide: 'Guía del estado de la receta', testedExplanation: 'Horneada tal como está escrita.', trustNote: 'Cada receta indica la mezcla de harina, el molde y la cantidad usados. Una receta original probada puede tener una variante calculada.', howWeTest: 'Cómo probamos las recetas',
    },
    catalog: { eyebrow: 'Inventario de recetas de trabajo', title: ['Recetas para', 'volver a hornear.'], intro: 'Aquí se muestran todas las recetas conocidas, incluidos los borradores. El texto, los tiempos y las aprobaciones de fotos pendientes siguen claramente señalados.', collectionEyebrow: 'Colección actual', allRecipes: 'Todas las recetas', detailsToConfirm: 'Detalles por confirmar', workingRecord: 'Ficha de trabajo' },
    cook: { backToRecipe: 'Volver a la receta', exit: 'Salir del modo Cocina', unavailableKicker: 'El modo Cocina todavía no está listo', unavailableTitle: 'La fuente no contiene un método utilizable.', unavailableLink: 'Leer la ficha de la receta', unavailableRecord: 'Esta ficha de receta no está disponible.', adjustedStatus: 'Calculada', progress: (current, total) => `Paso ${current} de ${total}` },
    recipe: { backToRecipes: 'Recetas', inventoryDraft: 'Borrador de inventario', workingRecord: 'Ficha de trabajo', workingRecordExplanation: 'Este registro basado en la fuente todavía no es una receta Probada publicable.', difficulty: 'Dificultad', activeTime: 'Tiempo activo', totalTime: 'Tiempo total', flour: 'Harina', toConfirm: 'Por confirmar', authorPhotoPending: 'Foto de la autora · revisión pendiente', generatedPreviewPending: 'Vista previa generada · aprobación pendiente', beforeStart: 'Antes de empezar', planAhead: 'Planifica con antelación.', keepInMind: 'Tenlo en cuenta', ingredients: 'Ingredientes', ingredientsIntro: 'Las condiciones y los detalles sin resolver permanecen visibles.', method: (count) => `Método · ${count} pasos`, stepByStep: 'Hazlo paso a paso.', openCookMode: 'Abrir modo Cocina', methodPending: 'Método pendiente', methodPendingDescription: 'La fuente todavía no ofrece un método utilizable.', beforePublishing: 'Antes de publicar', translationPending: 'Esta receta basada en la fuente espera revisión editorial de la traducción para este idioma.' },
    status: {
      tested: { label: 'Probada', explanation: 'Esta versión exacta se ha horneado correctamente.' },
      calculated: { label: 'Calculada', explanation: 'Las cantidades se han ajustado. Esta versión no se ha probado horneándola.' },
      suggested: { label: 'Sugerida', explanation: 'Una idea para probar. Este cambio no se ha probado horneándolo.' },
    },
    metadata: {
      home: {
        title: 'Bake Again — Repostería sin gluten probada',
        description: 'Una pequeña colección de recetas sin gluten cuidadosamente probadas.',
      },
      recipes: {
        title: 'Recetas — Bake Again',
        description: 'El inventario de recetas de trabajo de Bake Again.',
      },
      cook: (recipeTitle) => ({
        title: `${recipeTitle} — Modo Cocina — Bake Again`,
        description: `Vista paso a paso para preparar ${recipeTitle}.`,
      }),
      saved: { title: 'Recetas guardadas — Bake Again', description: 'Recetas que quieres volver a preparar.' },
      shoppingList: { title: 'Lista de compra — Bake Again', description: 'Ingredientes para tus próximos horneados.' },
    },
    personal: { save: 'Guardar receta', removeSaved: 'Quitar de Guardadas', savedTitle: 'Recetas guardadas', savedEmpty: 'Todavía no has guardado recetas.', browseRecipes: 'Ver recetas', shoppingTitle: 'Lista de compra', shoppingEmpty: 'Tu lista de compra está vacía.', addIngredients: 'Añadir ingredientes de la base probada', addAll: 'Añadir todo', reviewIngredients: 'Revisar ingredientes', addToList: 'Añadir a la lista', addedToList: 'Los ingredientes se han añadido a tu lista de compra.', openShoppingList: 'Abrir lista de compra', chooseOptionBeforeAdding: 'Elige una opción para cada ingrediente de “Elige una opción” antes de añadir la lista.', removeItem: 'Eliminar artículo', source: 'De', asNeeded: 'Según se necesite', chooseOne: 'Elige una opción', testedBaseOnly: 'Disponible solo para la base probada' },
  },
  uk: {
    navigation: {
      recipes: 'Рецепти',
      saved: 'Збережені',
      shoppingList: 'Список покупок',
    },
    language: {
      change: 'Змінити мову',
      select: 'Вибрати мову',
    },
    a11y: { wordmarkHome: 'Головна Bake Again', primaryNavigation: 'Основна навігація', recipeStatus: (status, detail) => `Статус перевірки: ${status}${detail ? `, ${detail}` : ''}`, recipeRecordStatus: (status, detail) => `Запис рецепта: ${status}${detail ? `, ${detail}` : ''}` },
    home: {
      eyebrow: 'Невелика колекція перевірених безглютенових рецептів', title: ['Випікайте те,', 'що любите.', 'Знайте, що працює.'],
      intro: 'Знайомі торти, печиво й сніданки — ретельно адаптовані, випробувані знову та записані, щоб ви могли повторити результат удома.',
      searchLabel: 'Шукати рецепти', searchPlaceholder: 'Що ви хочете спекти?', searchAction: 'Шукати', inventoryHint: (count) => `Перегляньте всі ${count} робочих рецептів у поточному каталозі.`,
      featuredKicker: 'Почніть із класики', featuredTitle: 'Наполеон', discoveryTitle: 'Оберіть за нагодою', discoveryLinks: ['На сніданок', 'На щодень', 'Для свята', 'Приготуйте заздалегідь', 'Хочу просто пекти'],
      recipesEyebrow: 'Поточний каталог', recipesTitle: 'Усі рецепти на сьогодні.', viewAll: 'Переглянути всі рецепти', trustEyebrow: 'Зрозумілий статус рецепта', trustTitle: 'Знайте, що випікали, а що лише розрахували.', trustGuide: 'Пояснення статусів рецепта', testedExplanation: 'Випечено саме за цим записом.', trustNote: 'У кожному рецепті вказано використані борошняну суміш, форму й кількість. У перевіреного оригіналу може бути розрахований варіант.', howWeTest: 'Як ми перевіряємо рецепти',
    },
    catalog: { eyebrow: 'Робочий каталог рецептів', title: ['Рецепти, які хочеться', 'пекти знову.'], intro: 'Тут показані всі відомі рецепти, зокрема чернетки. Відсутній текст, час і підтвердження фото залишаються чітко позначеними.', collectionEyebrow: 'Поточна колекція', allRecipes: 'Усі рецепти', detailsToConfirm: 'Деталі потребують уточнення', workingRecord: 'Робочий запис' },
    cook: { backToRecipe: 'Повернутися до рецепта', exit: 'Вийти з режиму приготування', unavailableKicker: 'Режим приготування ще не готовий', unavailableTitle: 'Джерело не містить придатного способу приготування.', unavailableLink: 'Переглянути запис рецепта', unavailableRecord: 'Цей запис рецепта недоступний.', adjustedStatus: 'Розраховано', progress: (current, total) => `Крок ${current} з ${total}` },
    recipe: { backToRecipes: 'Рецепти', inventoryDraft: 'Чернетка каталогу', workingRecord: 'Робочий запис', workingRecordExplanation: 'Цей запис на основі джерела ще не є готовим до публікації перевіреним рецептом.', difficulty: 'Складність', activeTime: 'Активний час', totalTime: 'Загальний час', flour: 'Борошно', toConfirm: 'Потребує уточнення', authorPhotoPending: 'Фото авторки · очікує перевірки', generatedPreviewPending: 'Згенерований прев’ю · очікує схвалення', beforeStart: 'Перед початком', planAhead: 'Сплануйте заздалегідь.', keepInMind: 'Зверніть увагу', ingredients: 'Інгредієнти', ingredientsIntro: 'Умови й неуточнені деталі залишаються видимими.', method: (count) => `Спосіб · ${count} кроків`, stepByStep: 'Готуйте крок за кроком.', openCookMode: 'Відкрити режим приготування', methodPending: 'Спосіб ще не додано', methodPendingDescription: 'Джерело ще не містить придатного способу приготування.', beforePublishing: 'Перед публікацією', translationPending: 'Цей рецепт на основі джерела очікує редакторського перекладу для цієї мови.' },
    status: {
      tested: { label: 'Перевірено', explanation: 'Цю точну версію успішно випікали.' },
      calculated: { label: 'Розраховано', explanation: 'Кількості перераховано. Цю версію не перевірено випіканням.' },
      suggested: { label: 'Запропоновано', explanation: 'Ідея для спроби. Цю зміну не перевірено випіканням.' },
    },
    metadata: {
      home: {
        title: 'Bake Again — Перевірена безглютенова випічка',
        description: 'Невелика колекція ретельно перевірених безглютенових рецептів.',
      },
      recipes: {
        title: 'Рецепти — Bake Again',
        description: 'Робочий каталог рецептів Bake Again.',
      },
      cook: (recipeTitle) => ({
        title: `${recipeTitle} — Режим приготування — Bake Again`,
        description: `Покроковий режим приготування рецепта «${recipeTitle}».`,
      }),
      saved: { title: 'Збережені рецепти — Bake Again', description: 'Рецепти, які ви хочете спекти знову.' },
      shoppingList: { title: 'Список покупок — Bake Again', description: 'Інгредієнти для запланованої випічки.' },
    },
    personal: { save: 'Зберегти рецепт', removeSaved: 'Прибрати зі збережених', savedTitle: 'Збережені рецепти', savedEmpty: 'Ще немає збережених рецептів.', browseRecipes: 'Переглянути рецепти', shoppingTitle: 'Список покупок', shoppingEmpty: 'Список покупок порожній.', addIngredients: 'Додати інгредієнти перевіреної бази', addAll: 'Додати все', reviewIngredients: 'Перевірити інгредієнти', addToList: 'Додати до списку', addedToList: 'Інгредієнти додано до списку покупок.', openShoppingList: 'Відкрити список покупок', chooseOptionBeforeAdding: 'Оберіть варіант для кожного інгредієнта «Оберіть один варіант», щоб додати список.', removeItem: 'Видалити позицію', source: 'З рецепта', asNeeded: 'За потреби', chooseOne: 'Оберіть один варіант', testedBaseOnly: 'Доступно лише для перевіреної бази' },
  },
};

export function getUiMessages(locale: AppLocale): UiMessages {
  return uiMessages[locale];
}
