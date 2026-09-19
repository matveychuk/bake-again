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
    discoveryLinks: Array<{ id: string; label: string }>;
    recipesEyebrow: string;
    recipesTitle: string;
    collectionCount: (count: number) => string;
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
    collectionsLabel: string;
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
    progressLabel: string;
    method: string;
    stepsShown: (visible: number, total: number) => string;
    navigationLabel: string;
    previous: string;
    previousStep: string;
    next: string;
    nextStep: string;
    completed: string;
    markStepComplete: string;
    completeStep: string;
    completeAndNext: string;
    finishCooking: string;
    allSteps: string;
    ingredients: string;
    ingredientsUsed: string;
    forThisStep: string;
    timerLabel: string;
    optionalTimer: string;
    timerDuration: string;
    minutesShort: string;
    pause: string;
    start: string;
    resetTimer: string;
    keepScreenAwake: string;
    screenAwake: string;
    stepChanged: (current: number, total: number, title: string) => string;
    completedSteps: (completed: number, total: number) => string;
    cookingComplete: string;
    completeTitle: string;
    privateNote: string;
    privateNoteDescription: string;
    privateNotePlaceholder: string;
    returnToRecipe: string;
    cookAgain: string;
  };
  recipe: {
    backToRecipes: string;
    inventoryDraft: string;
    workingRecord: string;
    workingRecordExplanation: string;
    time: string;
    difficulty: string;
    difficultyEasy: string;
    difficultyMedium: string;
    difficultyAdvanced: string;
    activeTime: string;
    totalTime: string;
    yield: string;
    geometry: string;
    flour: string;
    toConfirm: string;
    authorPhotoPending: string;
    generatedPreviewPending: string;
    beforeStart: string;
    planAhead: string;
    keepInMind: string;
    ingredients: string;
    ingredientsIntro: string;
    optional: string;
    markIngredientPrepared: (name: string) => string;
    method: (count: number) => string;
    stepByStep: string;
    openCookMode: string;
    methodPending: string;
    methodPendingDescription: string;
    checkpoint: string;
    tip: string;
    stepVisualSequence: string;
    beforePublishing: string;
    translationPending: string;
  };
  scaling: {
    eyebrow: string;
    title: string;
    intro: string;
    scaleRecipe: string;
    useWhatIHave: string;
    batchScale: string;
    availableIngredient: (name: string) => string;
    calculated: string;
    calculatedResult: (factor: string) => string;
    quantitiesMissing: string;
    quantitiesMissingDescription: string;
    sourceGap: string;
  };
  status: {
    tested: { label: string; explanation: string; repeatedExplanation: string };
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
    shoppingEyebrow: string;
    shoppingEmpty: string;
    shoppingEmptyBody: string;
    storedInBrowser: string;
    addIngredients: string;
    addAll: string;
    reviewIngredients: string;
    reviewIngredientsDescription: string;
    selectAll: string;
    clearSelection: string;
    close: string;
    addToList: string;
    addSelected: (count: number) => string;
    addedToList: string;
    addedCount: (count: number) => string;
    inShoppingList: (count: number) => string;
    openShoppingList: string;
    undo: string;
    selectedIngredients: (count: number) => string;
    selectIngredient: (name: string) => string;
    alreadyInShoppingList: string;
    selectAtLeastOne: string;
    shoppingSaveFailed: string;
    chooseOptionBeforeAdding: string;
    removeItem: string;
    markBought: (name: string) => string;
    markNeeded: (name: string) => string;
    removeChecked: (count: number) => string;
    clearAll: string;
    clearAllTitle: string;
    clearAllDescription: string;
    confirmClearAll: string;
    cancel: string;
    allBought: string;
    removedItem: (name: string) => string;
    sourceRecipe: (title: string) => string;
    sourceRecipes: (count: number) => string;
    addAnotherBatch: string;
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
    a11y: {
      wordmarkHome: 'Bake Again home',
      primaryNavigation: 'Primary navigation',
      recipeStatus: (status, detail) =>
        `Testing status: ${status}${detail ? `, ${detail}` : ''}`,
      recipeRecordStatus: (status, detail) =>
        `Recipe record: ${status}${detail ? `, ${detail}` : ''}`,
    },
    home: {
      eyebrow: 'A small collection of tested gluten-free recipes',
      title: ['Bake what', 'you love.', 'Know what works.'],
      intro:
        'Familiar cakes, cookies and breakfasts — carefully adjusted, baked again, and written so you can get the same result at home.',
      searchLabel: 'Search recipes',
      searchPlaceholder: 'What would you like to bake?',
      searchAction: 'Search',
      inventoryHint: (count) =>
        `Browse all ${count} working recipes in the current inventory.`,
      featuredKicker: 'Start with a classic',
      featuredTitle: 'Napoleon cake',
      discoveryTitle: 'Choose a collection',
      discoveryLinks: [
        { id: 'breakfast', label: 'For breakfast' },
        { id: 'everyday', label: 'For every day' },
        { id: 'celebration', label: 'For a celebration' },
        { id: 'cottage-cheese', label: 'With cottage cheese' },
        { id: 'batter-on-hand', label: 'Batter on hand' },
      ],
      recipesEyebrow: 'Current inventory',
      recipesTitle: 'Every recipe so far.',
      collectionCount: (count) => `${count} recipes`,
      viewAll: 'View all recipes',
      trustEyebrow: 'Clear recipe status',
      trustTitle: 'Know what was baked — and what was only worked out.',
      trustGuide: 'Recipe status guide',
      testedExplanation: 'Baked as written.',
      trustNote:
        'Every recipe names the flour mix, form and quantity actually used. A tested original may still have a calculated variation.',
      howWeTest: 'How we test recipes',
    },
    catalog: {
      eyebrow: 'Working recipe inventory',
      title: ['Recipes made to be', 'baked again.'],
      intro:
        'All currently known recipes are shown here, including drafts. Missing text, timing and photo approvals remain clearly marked.',
      collectionEyebrow: 'Current collection',
      allRecipes: 'All recipes',
      detailsToConfirm: 'Details to confirm',
      workingRecord: 'Working record',
      collectionsLabel: 'Collections',
    },
    cook: {
      backToRecipe: 'Back to recipe',
      exit: 'Exit Cook Mode',
      unavailableKicker: 'Cook Mode is not ready yet',
      unavailableTitle: 'The source does not contain a usable method.',
      unavailableLink: 'Read the recipe record',
      unavailableRecord: 'This recipe record is not available.',
      adjustedStatus: 'Calculated',
      progress: (current, total) => `Step ${current} of ${total}`,
      progressLabel: 'Cook Mode progress',
      method: 'Method',
      stepsShown: (visible, total) => `Showing ${visible} of ${total} steps`,
      navigationLabel: 'Step navigation',
      previous: 'Previous',
      previousStep: 'Previous step',
      next: 'Next',
      nextStep: 'Next step',
      completed: 'Completed',
      markStepComplete: 'Mark step complete',
      completeStep: 'Complete step',
      completeAndNext: 'Done, next',
      finishCooking: 'Finish cooking',
      allSteps: 'All steps',
      ingredients: 'Ingredients',
      ingredientsUsed: 'Ingredients used in this step',
      forThisStep: 'For this step',
      timerLabel: 'Step timer',
      optionalTimer: 'Optional timer',
      timerDuration: 'Timer duration',
      minutesShort: 'min',
      pause: 'Pause',
      start: 'Start',
      resetTimer: 'Reset timer',
      keepScreenAwake: 'Keep screen awake',
      screenAwake: 'Screen stays awake',
      stepChanged: (current, total, title) =>
        `Step ${current} of ${total}: ${title}`,
      completedSteps: (completed, total) =>
        `${completed} of ${total} steps completed`,
      cookingComplete: 'Cooking complete',
      completeTitle: 'The recipe is finished.',
      privateNote: 'Private note',
      privateNoteDescription:
        'Saved only in this browser for the next time you make this recipe.',
      privateNotePlaceholder: 'What would you remember or change next time?',
      returnToRecipe: 'Return to recipe',
      cookAgain: 'Cook again',
    },
    recipe: {
      backToRecipes: 'Recipes',
      inventoryDraft: 'Inventory draft',
      workingRecord: 'Working record',
      workingRecordExplanation:
        'This source-backed record is not yet a publishable Tested recipe.',
      time: 'Time',
      difficulty: 'Difficulty',
      difficultyEasy: 'Easy',
      difficultyMedium: 'Medium',
      difficultyAdvanced: 'Advanced',
      activeTime: 'Active time',
      totalTime: 'Total time',
      yield: 'Yield',
      geometry: 'Form / pan',
      flour: 'Flour',
      toConfirm: 'To confirm',
      authorPhotoPending: 'Author photo · review pending',
      generatedPreviewPending: 'Generated preview · approval pending',
      beforeStart: 'Before you start',
      planAhead: 'Plan for the rest.',
      keepInMind: 'Keep this in mind',
      ingredients: 'Ingredients',
      ingredientsIntro: 'Conditions and unresolved details stay visible.',
      optional: 'optional',
      markIngredientPrepared: (name) => `Mark ${name} as prepared`,
      method: (count) => `Method · ${count} steps`,
      stepByStep: 'Make it step by step.',
      openCookMode: 'Open Cook Mode',
      methodPending: 'Method pending',
      methodPendingDescription:
        'A usable method is not available in the source yet.',
      checkpoint: 'Checkpoint',
      tip: 'Tip',
      stepVisualSequence: 'Step visual sequence',
      beforePublishing: 'Before publishing',
      translationPending:
        'This source-backed recipe is awaiting editorial translation for this language.',
    },
    scaling: {
      eyebrow: 'Calculated configuration',
      title: 'Adjust recipe',
      intro:
        'Scale the recorded base or calculate quantities from a supported ingredient you have. A form or pan size appears only when the source defines it.',
      scaleRecipe: 'Scale recipe',
      useWhatIHave: 'Use what I have',
      batchScale: 'Batch scale',
      availableIngredient: (name) => `Available ${name}`,
      calculated: 'Calculated:',
      calculatedResult: (factor) =>
        `${factor}× the recorded base. Check eggs and other whole items manually when the result is fractional.`,
      quantitiesMissing: 'Quantities still needed',
      quantitiesMissingDescription:
        'This recipe does not yet have a supported numeric anchor ingredient. Add the source quantities to unlock Scale recipe and Use what I have.',
      sourceGap: 'Source gap',
    },
    status: {
      tested: {
        label: 'Tested',
        explanation: 'This exact version was baked successfully.',
        repeatedExplanation: 'Made many times.',
      },
      calculated: {
        label: 'Calculated',
        explanation:
          'Quantities scaled. This version has not been bake-tested.',
      },
      suggested: {
        label: 'Suggested',
        explanation: 'An idea to try. This change has not been bake-tested.',
      },
    },
    metadata: {
      home: {
        title: 'Bake Again — Tested gluten-free baking',
        description:
          'A small collection of carefully tested gluten-free recipes.',
      },
      recipes: {
        title: 'Recipes — Bake Again',
        description: 'The complete working Bake Again recipe inventory.',
      },
      cook: (recipeTitle) => ({
        title: `${recipeTitle} — Cook Mode — Bake Again`,
        description: `Step-by-step cooking view for ${recipeTitle}.`,
      }),
      saved: {
        title: 'Saved recipes — Bake Again',
        description: 'Recipes you want to bake again.',
      },
      shoppingList: {
        title: 'Shopping list — Bake Again',
        description: 'Ingredients for your saved baking plans.',
      },
    },
    personal: {
      save: 'Save recipe',
      removeSaved: 'Remove from Saved',
      savedTitle: 'Saved recipes',
      savedEmpty: 'No recipes saved yet.',
      browseRecipes: 'Browse recipes',
      shoppingTitle: 'Shopping list',
      shoppingEyebrow: 'Your baking plan',
      shoppingEmpty: 'Your shopping list is empty.',
      shoppingEmptyBody:
        'Add products from a recipe when you are ready to plan a bake.',
      storedInBrowser:
        'Saved in this browser. The list stays here until you clear it.',
      addIngredients: 'To shopping list…',
      addAll: 'To shopping list…',
      reviewIngredients: 'What do you need to buy?',
      reviewIngredientsDescription:
        'Leave selected the products you need to buy.',
      selectAll: 'Select all',
      clearSelection: 'Clear all selections',
      close: 'Close',
      addToList: 'Add to shopping list',
      addSelected: (count) => `Add to list (${count})`,
      addedToList: 'Ingredients added to your shopping list.',
      addedCount: (count) =>
        `Added ${count} ${count === 1 ? 'product' : 'products'}.`,
      inShoppingList: (count) => `In shopping list · ${count}`,
      openShoppingList: 'View list',
      undo: 'Undo',
      selectedIngredients: (count) => `Selected to add: ${count}`,
      selectIngredient: (name) => `Add ${name} to the shopping list`,
      alreadyInShoppingList: 'Already in the shopping list',
      selectAtLeastOne: 'Select at least one ingredient.',
      shoppingSaveFailed:
        'The shopping list could not be saved in this browser. Please try again.',
      chooseOptionBeforeAdding:
        'Choose an option for every selected “Choose one” ingredient.',
      removeItem: 'Remove item',
      markBought: (name) => `Mark ${name} as bought`,
      markNeeded: (name) => `Mark ${name} as still needed`,
      removeChecked: (count) => `Remove bought (${count})`,
      clearAll: 'Clear all',
      clearAllTitle: 'Clear the shopping list?',
      clearAllDescription:
        'Every product will be removed. This cannot be undone.',
      confirmClearAll: 'Clear list',
      cancel: 'Cancel',
      allBought: 'Everything is bought.',
      removedItem: (name) => `${name} removed.`,
      sourceRecipe: (title) => `For ${title}`,
      sourceRecipes: (count) => `For ${count} recipes`,
      addAnotherBatch: 'Add another batch…',
      source: 'From',
      asNeeded: 'As needed',
      chooseOne: 'Choose one',
      testedBaseOnly: 'Available for the Tested base only',
    },
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
    a11y: {
      wordmarkHome: 'Inicio de Bake Again',
      primaryNavigation: 'Navegación principal',
      recipeStatus: (status, detail) =>
        `Estado de prueba: ${status}${detail ? `, ${detail}` : ''}`,
      recipeRecordStatus: (status, detail) =>
        `Ficha de receta: ${status}${detail ? `, ${detail}` : ''}`,
    },
    home: {
      eyebrow: 'Una pequeña colección de recetas sin gluten probadas',
      title: ['Hornea lo que', 'te gusta.', 'Te saldrá bien.'],
      intro:
        'Pasteles, galletas y desayunos de siempre, adaptados con cuidado y probados una y otra vez para que te salgan igual de bien en casa.',
      searchLabel: 'Buscar recetas',
      searchPlaceholder: '¿Qué te apetece hornear?',
      searchAction: 'Buscar',
      inventoryHint: (count) =>
        `Explora las ${count} recetas disponibles ahora.`,
      featuredKicker: 'Empieza con un clásico',
      featuredTitle: 'Tarta Napoleón',
      discoveryTitle: 'Elige una colección',
      discoveryLinks: [
        { id: 'breakfast', label: 'Para desayunar' },
        { id: 'everyday', label: 'Para cada día' },
        { id: 'celebration', label: 'Para una celebración' },
        { id: 'cottage-cheese', label: 'Con requesón' },
        { id: 'batter-on-hand', label: 'Masa lista' },
      ],
      recipesEyebrow: 'Inventario actual',
      recipesTitle: 'Todas las recetas hasta ahora.',
      collectionCount: (count) => `${count} recetas`,
      viewAll: 'Ver todas las recetas',
      trustEyebrow: 'Estado claro de la receta',
      trustTitle: 'Distingue lo horneado de lo calculado.',
      trustGuide: 'Guía del estado de la receta',
      testedExplanation: 'Horneada tal como está escrita.',
      trustNote:
        'Cada receta indica la mezcla de harina, el molde y la cantidad usados. Una receta original probada puede tener una variante calculada.',
      howWeTest: 'Cómo probamos las recetas',
    },
    catalog: {
      eyebrow: 'Inventario de recetas de trabajo',
      title: ['Recetas para', 'volver a hornear.'],
      intro:
        'Aquí se muestran todas las recetas conocidas, incluidos los borradores. El texto, los tiempos y las aprobaciones de fotos pendientes siguen claramente señalados.',
      collectionEyebrow: 'Colección actual',
      allRecipes: 'Todas las recetas',
      detailsToConfirm: 'Detalles por confirmar',
      workingRecord: 'Ficha de trabajo',
      collectionsLabel: 'Colecciones',
    },
    cook: {
      backToRecipe: 'Volver a la receta',
      exit: 'Salir del modo Cocina',
      unavailableKicker: 'El modo Cocina todavía no está listo',
      unavailableTitle: 'La fuente no contiene un método utilizable.',
      unavailableLink: 'Leer la ficha de la receta',
      unavailableRecord: 'Esta ficha de receta no está disponible.',
      adjustedStatus: 'Calculada',
      progress: (current, total) => `Paso ${current} de ${total}`,
      progressLabel: 'Progreso del modo Cocina',
      method: 'Preparación',
      stepsShown: (visible, total) => `Mostrando ${visible} de ${total} pasos`,
      navigationLabel: 'Navegación entre pasos',
      previous: 'Anterior',
      previousStep: 'Paso anterior',
      next: 'Siguiente',
      nextStep: 'Paso siguiente',
      completed: 'Completado',
      markStepComplete: 'Marcar paso como completado',
      completeStep: 'Completar paso',
      completeAndNext: 'Listo, siguiente',
      finishCooking: 'Terminar la preparación',
      allSteps: 'Todos los pasos',
      ingredients: 'Ingredientes',
      ingredientsUsed: 'Ingredientes usados en este paso',
      forThisStep: 'Para este paso',
      timerLabel: 'Temporizador del paso',
      optionalTimer: 'Temporizador opcional',
      timerDuration: 'Duración del temporizador',
      minutesShort: 'min',
      pause: 'Pausar',
      start: 'Iniciar',
      resetTimer: 'Reiniciar temporizador',
      keepScreenAwake: 'Mantener pantalla activa',
      screenAwake: 'Pantalla activa',
      stepChanged: (current, total, title) =>
        `Paso ${current} de ${total}: ${title}`,
      completedSteps: (completed, total) =>
        `${completed} de ${total} pasos completados`,
      cookingComplete: 'Preparación terminada',
      completeTitle: 'La receta está lista.',
      privateNote: 'Nota privada',
      privateNoteDescription:
        'Se guarda solo en este navegador para la próxima vez que prepares esta receta.',
      privateNotePlaceholder: '¿Qué quieres recordar o cambiar la próxima vez?',
      returnToRecipe: 'Volver a la receta',
      cookAgain: 'Preparar de nuevo',
    },
    recipe: {
      backToRecipes: 'Recetas',
      inventoryDraft: 'Borrador de inventario',
      workingRecord: 'Ficha de trabajo',
      workingRecordExplanation:
        'Este registro basado en la fuente todavía no es una receta Probada publicable.',
      time: 'Tiempo',
      difficulty: 'Dificultad',
      difficultyEasy: 'Fácil',
      difficultyMedium: 'Media',
      difficultyAdvanced: 'Avanzada',
      activeTime: 'Tiempo activo',
      totalTime: 'Tiempo total',
      yield: 'Rendimiento',
      geometry: 'Molde / sartén',
      flour: 'Harina',
      toConfirm: 'Por confirmar',
      authorPhotoPending: 'Foto de la autora · revisión pendiente',
      generatedPreviewPending: 'Vista previa generada · aprobación pendiente',
      beforeStart: 'Antes de empezar',
      planAhead: 'Planifica con antelación.',
      keepInMind: 'Tenlo en cuenta',
      ingredients: 'Ingredientes',
      ingredientsIntro:
        'Las condiciones y los detalles sin resolver permanecen visibles.',
      optional: 'opcional',
      markIngredientPrepared: (name) => `Marcar ${name} como preparado`,
      method: (count) => `Método · ${count} pasos`,
      stepByStep: 'Hazlo paso a paso.',
      openCookMode: 'Abrir modo Cocina',
      methodPending: 'Método pendiente',
      methodPendingDescription:
        'La fuente todavía no ofrece un método utilizable.',
      checkpoint: 'Punto de control',
      tip: 'Consejo',
      stepVisualSequence: 'Secuencia visual del paso',
      beforePublishing: 'Antes de publicar',
      translationPending:
        'Esta receta basada en la fuente espera revisión editorial de la traducción para este idioma.',
    },
    scaling: {
      eyebrow: 'Configuración calculada',
      title: 'Ajustar receta',
      intro:
        'Ajusta la cantidad de la receta base registrada o calcula las cantidades a partir de un ingrediente compatible que tengas. El tamaño del molde o de la sartén solo aparece cuando está definido en la fuente.',
      scaleRecipe: 'Cambiar cantidad',
      useWhatIHave: 'Usar lo que tengo',
      batchScale: 'Tamaño de la tanda',
      availableIngredient: (name) => `Cantidad disponible de ${name}`,
      calculated: 'Calculado:',
      calculatedResult: (factor) =>
        `${factor}× de la receta base registrada. Revisa manualmente los huevos y otras unidades enteras si el resultado contiene fracciones.`,
      quantitiesMissing: 'Faltan cantidades',
      quantitiesMissingDescription:
        'Esta receta todavía no tiene un ingrediente base compatible con una cantidad numérica. Añade las cantidades de la fuente para activar Cambiar cantidad y Usar lo que tengo.',
      sourceGap: 'Dato pendiente de la fuente',
    },
    status: {
      tested: {
        label: 'Probada',
        explanation: 'Esta versión exacta se ha horneado correctamente.',
        repeatedExplanation: 'Preparada muchas veces.',
      },
      calculated: {
        label: 'Calculada',
        explanation:
          'Las cantidades se han ajustado. Esta versión no se ha probado horneándola.',
      },
      suggested: {
        label: 'Sugerida',
        explanation:
          'Una idea para probar. Este cambio no se ha probado horneándolo.',
      },
    },
    metadata: {
      home: {
        title: 'Bake Again — Repostería sin gluten probada',
        description:
          'Una pequeña colección de recetas sin gluten cuidadosamente probadas.',
      },
      recipes: {
        title: 'Recetas — Bake Again',
        description: 'El inventario de recetas de trabajo de Bake Again.',
      },
      cook: (recipeTitle) => ({
        title: `${recipeTitle} — Modo Cocina — Bake Again`,
        description: `Vista paso a paso para preparar ${recipeTitle}.`,
      }),
      saved: {
        title: 'Recetas guardadas — Bake Again',
        description: 'Recetas que quieres volver a preparar.',
      },
      shoppingList: {
        title: 'Lista de compra — Bake Again',
        description: 'Ingredientes para tus próximos horneados.',
      },
    },
    personal: {
      save: 'Guardar receta',
      removeSaved: 'Quitar de Guardadas',
      savedTitle: 'Recetas guardadas',
      savedEmpty: 'Todavía no has guardado recetas.',
      browseRecipes: 'Ver recetas',
      shoppingTitle: 'Lista de compra',
      shoppingEyebrow: 'Tu plan de repostería',
      shoppingEmpty: 'Tu lista de compra está vacía.',
      shoppingEmptyBody:
        'Añade productos desde una receta cuando quieras planificar lo que vas a hornear.',
      storedInBrowser:
        'Guardada en este navegador. La lista permanece hasta que la vacíes.',
      addIngredients: 'A la lista de compra…',
      addAll: 'A la lista de compra…',
      reviewIngredients: '¿Qué necesitas comprar?',
      reviewIngredientsDescription:
        'Deja marcados los productos que necesitas comprar.',
      selectAll: 'Seleccionar todo',
      clearSelection: 'Quitar todas las marcas',
      close: 'Cerrar',
      addToList: 'Añadir a la lista',
      addSelected: (count) => `Añadir a la lista (${count})`,
      addedToList: 'Los ingredientes se han añadido a tu lista de compra.',
      addedCount: (count) =>
        `Se ${count === 1 ? 'ha añadido' : 'han añadido'} ${count} ${count === 1 ? 'producto' : 'productos'}.`,
      inShoppingList: (count) => `En la lista de compra · ${count}`,
      openShoppingList: 'Ver la lista',
      undo: 'Deshacer',
      selectedIngredients: (count) => `Seleccionados para añadir: ${count}`,
      selectIngredient: (name) => `Añadir ${name} a la lista de compra`,
      alreadyInShoppingList: 'Ya está en la lista de compra',
      selectAtLeastOne: 'Selecciona al menos un ingrediente.',
      shoppingSaveFailed:
        'No se ha podido guardar la lista de compra en este navegador. Inténtalo de nuevo.',
      chooseOptionBeforeAdding:
        'Elige una opción para cada ingrediente seleccionado de “Elige una opción”.',
      removeItem: 'Eliminar artículo',
      markBought: (name) => `Marcar ${name} como comprado`,
      markNeeded: (name) => `Marcar ${name} como pendiente`,
      removeChecked: (count) => `Quitar comprados (${count})`,
      clearAll: 'Vaciar todo',
      clearAllTitle: '¿Vaciar la lista de compra?',
      clearAllDescription:
        'Se eliminarán todos los productos. Esta acción no se puede deshacer.',
      confirmClearAll: 'Vaciar la lista',
      cancel: 'Cancelar',
      allBought: 'Ya está todo comprado.',
      removedItem: (name) => `${name} eliminado.`,
      sourceRecipe: (title) => `Para ${title}`,
      sourceRecipes: (count) => `Para ${count} recetas`,
      addAnotherBatch: 'Añadir otra tanda…',
      source: 'De',
      asNeeded: 'Según se necesite',
      chooseOne: 'Elige una opción',
      testedBaseOnly: 'Disponible solo para la base probada',
    },
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
    a11y: {
      wordmarkHome: 'Головна Bake Again',
      primaryNavigation: 'Основна навігація',
      recipeStatus: (status, detail) =>
        `Статус перевірки: ${status}${detail ? `, ${detail}` : ''}`,
      recipeRecordStatus: (status, detail) =>
        `Запис рецепта: ${status}${detail ? `, ${detail}` : ''}`,
    },
    home: {
      eyebrow: 'Невелика колекція перевірених безглютенових рецептів',
      title: ['Печіть те,', 'що любите.', 'І все вийде.'],
      intro:
        'Улюблені торти, печиво й сніданки — ретельно адаптовані, не раз випробувані й докладно описані, щоб удома все вдалося.',
      searchLabel: 'Шукати рецепти',
      searchPlaceholder: 'Що хочете спекти?',
      searchAction: 'Шукати',
      inventoryHint: (count) =>
        `Перегляньте всі ${count} рецептів, доступних зараз.`,
      featuredKicker: 'Почніть із класики',
      featuredTitle: 'Наполеон',
      discoveryTitle: 'Оберіть добірку',
      discoveryLinks: [
        { id: 'breakfast', label: 'На сніданок' },
        { id: 'everyday', label: 'На щодень' },
        { id: 'celebration', label: 'Для свята' },
        { id: 'cottage-cheese', label: 'З творогом' },
        { id: 'batter-on-hand', label: 'Тісто про запас' },
      ],
      recipesEyebrow: 'Поточний каталог',
      recipesTitle: 'Усі рецепти на сьогодні.',
      collectionCount: (count) => {
        const lastTwoDigits = count % 100;
        const lastDigit = count % 10;
        const label = lastTwoDigits >= 11 && lastTwoDigits <= 14
          ? 'рецептів'
          : lastDigit === 1
            ? 'рецепт'
            : lastDigit >= 2 && lastDigit <= 4
              ? 'рецепти'
              : 'рецептів';
        return `${count} ${label}`;
      },
      viewAll: 'Переглянути всі рецепти',
      trustEyebrow: 'Зрозумілий статус рецепта',
      trustTitle: 'Знайте, що випікали, а що лише розрахували.',
      trustGuide: 'Пояснення статусів рецепта',
      testedExplanation: 'Випечено саме за цим записом.',
      trustNote:
        'У кожному рецепті вказано використані борошняну суміш, форму й кількість. У перевіреного оригіналу може бути розрахований варіант.',
      howWeTest: 'Як ми перевіряємо рецепти',
    },
    catalog: {
      eyebrow: 'Робочий каталог рецептів',
      title: ['Рецепти, які хочеться', 'пекти знову.'],
      intro:
        'Тут показані всі відомі рецепти, зокрема чернетки. Відсутній текст, час і підтвердження фото залишаються чітко позначеними.',
      collectionEyebrow: 'Поточна колекція',
      allRecipes: 'Усі рецепти',
      detailsToConfirm: 'Деталі потребують уточнення',
      workingRecord: 'Робочий запис',
      collectionsLabel: 'Добірки',
    },
    cook: {
      backToRecipe: 'Повернутися до рецепта',
      exit: 'Вийти з режиму приготування',
      unavailableKicker: 'Режим приготування ще не готовий',
      unavailableTitle: 'Джерело не містить придатного способу приготування.',
      unavailableLink: 'Переглянути запис рецепта',
      unavailableRecord: 'Цей запис рецепта недоступний.',
      adjustedStatus: 'Розраховано',
      progress: (current, total) => `Крок ${current} з ${total}`,
      progressLabel: 'Перебіг режиму приготування',
      method: 'Спосіб приготування',
      stepsShown: (visible, total) => `Показано ${visible} із ${total} кроків`,
      navigationLabel: 'Навігація між кроками',
      previous: 'Назад',
      previousStep: 'Попередній крок',
      next: 'Далі',
      nextStep: 'Наступний крок',
      completed: 'Готово',
      markStepComplete: 'Позначити крок виконаним',
      completeStep: 'Завершити крок',
      completeAndNext: 'Готово, далі',
      finishCooking: 'Завершити приготування',
      allSteps: 'Усі кроки',
      ingredients: 'Інгредієнти',
      ingredientsUsed: 'Інгредієнти для цього кроку',
      forThisStep: 'Для цього кроку',
      timerLabel: 'Таймер кроку',
      optionalTimer: 'Необов’язковий таймер',
      timerDuration: 'Тривалість таймера',
      minutesShort: 'хв',
      pause: 'Пауза',
      start: 'Почати',
      resetTimer: 'Скинути таймер',
      keepScreenAwake: 'Не вимикати екран',
      screenAwake: 'Екран не вимикається',
      stepChanged: (current, total, title) =>
        `Крок ${current} з ${total}: ${title}`,
      completedSteps: (completed, total) =>
        `Виконано ${completed} з ${total} кроків`,
      cookingComplete: 'Приготування завершено',
      completeTitle: 'Рецепт готовий.',
      privateNote: 'Приватна нотатка',
      privateNoteDescription:
        'Зберігається лише в цьому браузері для наступного приготування.',
      privateNotePlaceholder: 'Що запам’ятати або змінити наступного разу?',
      returnToRecipe: 'Повернутися до рецепта',
      cookAgain: 'Приготувати ще раз',
    },
    recipe: {
      backToRecipes: 'Рецепти',
      inventoryDraft: 'Чернетка каталогу',
      workingRecord: 'Робочий запис',
      workingRecordExplanation:
        'Цей запис на основі джерела ще не є готовим до публікації перевіреним рецептом.',
      time: 'Час',
      difficulty: 'Складність',
      difficultyEasy: 'Легка',
      difficultyMedium: 'Середня',
      difficultyAdvanced: 'Складна',
      activeTime: 'Активний час',
      totalTime: 'Загальний час',
      yield: 'Вихід',
      geometry: 'Форма / пательня',
      flour: 'Борошно',
      toConfirm: 'Потребує уточнення',
      authorPhotoPending: 'Фото авторки · очікує перевірки',
      generatedPreviewPending: 'Згенерований прев’ю · очікує схвалення',
      beforeStart: 'Перед початком',
      planAhead: 'Сплануйте заздалегідь.',
      keepInMind: 'Зверніть увагу',
      ingredients: 'Інгредієнти',
      ingredientsIntro: 'Умови й неуточнені деталі залишаються видимими.',
      optional: 'необов’язково',
      markIngredientPrepared: (name) =>
        `Позначити «${name}» як підготовлений інгредієнт`,
      method: (count) => `Спосіб · ${count} кроків`,
      stepByStep: 'Готуйте крок за кроком.',
      openCookMode: 'Відкрити режим приготування',
      methodPending: 'Спосіб ще не додано',
      methodPendingDescription:
        'Джерело ще не містить придатного способу приготування.',
      checkpoint: 'Орієнтир',
      tip: 'Порада',
      stepVisualSequence: 'Послідовність фото кроку',
      beforePublishing: 'Перед публікацією',
      translationPending:
        'Цей рецепт на основі джерела очікує редакторського перекладу для цієї мови.',
    },
    scaling: {
      eyebrow: 'Розрахована конфігурація',
      title: 'Змінити кількість',
      intro:
        'Змініть кількість відносно записаної бази або розрахуйте її за підтримуваним інгредієнтом, який маєте в наявності. Розмір форми чи пательні з’являється лише тоді, коли його вказано в джерелі.',
      scaleRecipe: 'Змінити кількість',
      useWhatIHave: 'Використати наявне',
      batchScale: 'Масштаб рецепта',
      availableIngredient: (name) => `Є в наявності: ${name}`,
      calculated: 'Розраховано:',
      calculatedResult: (factor) =>
        `${factor}× від записаної бази. Якщо виходить дробова кількість яєць або інших цілих одиниць, перевірте її вручну.`,
      quantitiesMissing: 'Бракує кількостей',
      quantitiesMissingDescription:
        'У цьому рецепті ще немає підтримуваного базового інгредієнта з числовою кількістю. Додайте кількості з джерела, щоб увімкнути «Змінити кількість» і «Використати наявне».',
      sourceGap: 'Прогалина у джерелі',
    },
    status: {
      tested: {
        label: 'Перевірено',
        explanation: 'Цю точну версію успішно випікали.',
        repeatedExplanation: 'Готували багато разів.',
      },
      calculated: {
        label: 'Розраховано',
        explanation:
          'Кількості перераховано. Цю версію не перевірено випіканням.',
      },
      suggested: {
        label: 'Запропоновано',
        explanation: 'Ідея для спроби. Цю зміну не перевірено випіканням.',
      },
    },
    metadata: {
      home: {
        title: 'Bake Again — Перевірена безглютенова випічка',
        description:
          'Невелика колекція ретельно перевірених безглютенових рецептів.',
      },
      recipes: {
        title: 'Рецепти — Bake Again',
        description: 'Робочий каталог рецептів Bake Again.',
      },
      cook: (recipeTitle) => ({
        title: `${recipeTitle} — Режим приготування — Bake Again`,
        description: `Покроковий режим приготування рецепта «${recipeTitle}».`,
      }),
      saved: {
        title: 'Збережені рецепти — Bake Again',
        description: 'Рецепти, які ви хочете спекти знову.',
      },
      shoppingList: {
        title: 'Список покупок — Bake Again',
        description: 'Інгредієнти для запланованої випічки.',
      },
    },
    personal: {
      save: 'Зберегти рецепт',
      removeSaved: 'Прибрати зі збережених',
      savedTitle: 'Збережені рецепти',
      savedEmpty: 'Ще немає збережених рецептів.',
      browseRecipes: 'Переглянути рецепти',
      shoppingTitle: 'Список покупок',
      shoppingEyebrow: 'Ваш план випічки',
      shoppingEmpty: 'Ваш список порожній.',
      shoppingEmptyBody:
        'Додайте продукти з рецепта, коли будете планувати випічку.',
      storedInBrowser:
        'Збережено в цьому браузері. Список залишається, доки ви його не очистите.',
      addIngredients: 'До списку покупок…',
      addAll: 'До списку покупок…',
      reviewIngredients: 'Що потрібно купити?',
      reviewIngredientsDescription:
        'Залиште позначеними продукти, які потрібно купити.',
      selectAll: 'Обрати всі',
      clearSelection: 'Зняти всі позначки',
      close: 'Закрити',
      addToList: 'Додати до списку',
      addSelected: (count) => `Додати до списку (${count})`,
      addedToList: 'Інгредієнти додано до списку покупок.',
      addedCount: (count) => {
        const mod10 = count % 10;
        const mod100 = count % 100;
        const noun =
          mod10 === 1 && mod100 !== 11
            ? 'продукт'
            : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)
              ? 'продукти'
              : 'продуктів';
        return `Додано ${count} ${noun}.`;
      },
      inShoppingList: (count) => `У списку покупок · ${count}`,
      openShoppingList: 'Переглянути список',
      undo: 'Скасувати',
      selectedIngredients: (count) => `Обрано для додавання: ${count}`,
      selectIngredient: (name) => `Додати «${name}» до списку покупок`,
      alreadyInShoppingList: 'Уже є у списку покупок',
      selectAtLeastOne: 'Оберіть хоча б один інгредієнт.',
      shoppingSaveFailed:
        'Не вдалося зберегти список покупок у цьому браузері. Спробуйте ще раз.',
      chooseOptionBeforeAdding:
        'Оберіть варіант для кожного обраного інгредієнта «Оберіть один варіант».',
      removeItem: 'Видалити позицію',
      markBought: (name) => `Позначити «${name}» як куплений продукт`,
      markNeeded: (name) =>
        `Позначити «${name}» як продукт, який ще потрібно купити`,
      removeChecked: (count) => `Прибрати куплене (${count})`,
      clearAll: 'Очистити все',
      clearAllTitle: 'Очистити список покупок?',
      clearAllDescription:
        'Усі продукти буде видалено. Цю дію не можна скасувати.',
      confirmClearAll: 'Очистити список',
      cancel: 'Скасувати',
      allBought: 'Усе куплено.',
      removedItem: (name) => `«${name}» видалено.`,
      sourceRecipe: (title) => `З рецепта «${title}»`,
      sourceRecipes: (count) => `Для ${count} рецептів`,
      addAnotherBatch: 'Додати ще одну порцію…',
      source: 'З рецепта',
      asNeeded: 'За потреби',
      chooseOne: 'Оберіть один варіант',
      testedBaseOnly: 'Доступно лише для перевіреної бази',
    },
  },
};

export function getUiMessages(locale: AppLocale): UiMessages {
  return uiMessages[locale];
}
