import type { AppLocale } from './config';

function methodStepCount(locale: AppLocale, count: number): string {
  const form = new Intl.PluralRules(locale).select(count);
  if (locale === 'uk') {
    return `${count} ${form === 'one' ? 'крок' : form === 'few' ? 'кроки' : 'кроків'}`;
  }
  if (locale === 'es') return `${count} ${form === 'one' ? 'paso' : 'pasos'}`;
  return `${count} ${form === 'one' ? 'step' : 'steps'}`;
}

type UiMessages = {
  navigation: {
    menu: string;
    recipes: string;
    about: string;
    drafts: string;
    saved: string;
    shoppingList: string;
  };
  language: {
    change: string;
    select: string;
  };
  a11y: {
    skipNavigation: string;
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
    searchResultsTitle: (query: string) => string;
    searchEmpty: string;
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
    draftsIntro: string;
    draftsEmpty: string;
    publishedEmpty: string;
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
    fractionalIngredients: string;
    unsupportedConfiguration: string;
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
    screenAwakeError: string;
    stepChanged: (current: number, total: number, title: string) => string;
    completedSteps: (completed: number, total: number) => string;
    cookingComplete: string;
    completeTitle: string;
    privateNote: string;
    privateNoteDescription: string;
    privateNotePlaceholder: string;
    noteSaving: string;
    noteSaved: string;
    noteSaveFailed: string;
    completionNextSteps: string;
    previousNote: string;
    previousNoteDescription: string;
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
    beforeStart: string;
    planAhead: string;
    keepInMind: string;
    ingredients: string;
    ingredientsIntro: string;
    creamOptionsEyebrow: string;
    creamOptionsTitle: string;
    creamOptionsIntro: () => string;
    creamRecommended: string;
    creamSelectedEyebrow: string;
    creamRecipeEyebrow: string;
    changeCream: string;
    viewCreamRecipe: string;
    chooseCreamBeforeCooking: string;
    chooseCream: (name: string) => string;
    optional: string;
    markIngredientPrepared: (name: string) => string;
    method: (count: number) => string;
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
    positiveAmount: string;
    supportedAmount: string;
    unsupportedTitle: string;
    unsupportedGeometry: string;
    openBaseRecipe: string;
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
    savedEyebrow: string;
    savedHint: string;
    savedTitle: string;
    savedEmpty: string;
    browseRecipes: string;
    bakedEyebrow: string;
    bakedTitle: string;
    bakedOn: (date: string) => string;
    bakedAdjusted: string;
    bakedStoredInBrowser: string;
    privateNote: string;
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
      menu: 'Menu',
      recipes: 'Recipes',
      about: 'About',
      drafts: 'Drafts',
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
      skipNavigation: 'Skip to content',
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
      searchPlaceholder: 'Name or ingredient',
      searchAction: 'Search',
      searchResultsTitle: (query) => `Results for “${query}”`,
      searchEmpty:
        'No recipes found. Try another name or ingredient, or view all recipes.',
      inventoryHint: (count) =>
        `Browse all ${count} working recipes in the current inventory.`,
      featuredKicker: 'Start with a classic',
      featuredTitle: 'Napoleon cake',
      discoveryTitle: 'Choose a collection',
      discoveryLinks: [
        { id: 'breakfast', label: 'For breakfast' },
        { id: 'everyday', label: 'For every day' },
        { id: 'celebration', label: 'For a celebration' },
        { id: 'cottage-cheese', label: 'With curd cheese' },
        { id: 'batter-on-hand', label: 'Batter on hand' },
      ],
      recipesEyebrow: 'Find your next bake',
      recipesTitle: 'Recipes to make again.',
      collectionCount: (count) => `${count} recipes`,
      viewAll: 'View all recipes',
      trustEyebrow: 'Clear recipe status',
      trustTitle: 'Know what was baked — and what was only worked out.',
      trustGuide: 'Recipe status guide',
      testedExplanation: 'Baked as written.',
      trustNote:
        'Every recipe names the flour mix, form and quantity actually used. A tested original may still have a calculated variation.',
      howWeTest: 'How recipes are tested',
    },
    catalog: {
      draftsIntro: 'Recipes in progress, before publication.',
      draftsEmpty: 'No draft recipes.',
      publishedEmpty: 'The first recipes are being prepared for publication.',
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
      unavailableTitle: 'Cooking cannot start yet.',
      unavailableLink: 'Read the recipe record',
      unavailableRecord: 'This recipe record is not available.',
      fractionalIngredients:
        'This amount gives fractional eggs or other whole ingredients that need manual adjustment. Return to the recipe and choose a different amount before starting Cook Mode.',
      unsupportedConfiguration:
        'This configuration needs manual adjustment. Return to the recipe and choose a supported configuration before starting Cook Mode.',
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
      screenAwakeError:
        'Could not keep the screen awake. Check your browser or battery settings.',
      stepChanged: (current, total, title) =>
        `Step ${current} of ${total}: ${title}`,
      completedSteps: (completed, total) =>
        `${completed} of ${total} steps completed`,
      cookingComplete: 'Cooking complete',
      completeTitle: 'Cooking complete.',
      privateNote: 'Private note',
      privateNoteDescription:
        'Optional. Only you can see this note. Saving requires an account.',
      privateNotePlaceholder: 'What would you remember or change next time?',
      noteSaving: 'Saving…',
      noteSaved: 'Saved to your account.',
      noteSaveFailed:
        'Could not save this note. Check your connection.',
      completionNextSteps:
        'You can return to the recipe or start another bake.',
      previousNote: 'From your last bake',
      previousNoteDescription: 'Keep this in mind as you cook.',
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
      beforeStart: 'Before you start',
      planAhead: 'Plan for the rest.',
      keepInMind: 'Keep this in mind',
      ingredients: 'Ingredients',
      ingredientsIntro: 'Conditions and unresolved details stay visible.',
      creamOptionsEyebrow: 'Filling',
      creamOptionsTitle: 'Choose a cream.',
      creamOptionsIntro: () =>
        'Choose a filling. Your choice changes the ingredients and preparation steps.',
      creamRecommended: 'Recommended',
      creamSelectedEyebrow: 'Selected cream',
      creamRecipeEyebrow: 'Cream recipe',
      changeCream: 'Change cream',
      viewCreamRecipe: 'View cream recipe',
      chooseCreamBeforeCooking: 'Choose a cream first',
      chooseCream: (name) => `Choose ${name}`,
      optional: 'optional',
      markIngredientPrepared: (name) => `Mark ${name} as prepared`,
      method: (count) => methodStepCount('en', count),
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
      positiveAmount: 'Enter an amount greater than 0.',
      unsupportedTitle: 'This recipe configuration is not supported.',
      unsupportedGeometry:
        'This pan size has not been resolved for this recipe. Open the base recipe to choose supported quantities.',
      openBaseRecipe: 'Open the base recipe',
      supportedAmount: 'Enter an amount supported by this recipe.',
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
      savedEyebrow: 'Want to bake',
      savedHint: 'Use the bookmark on a recipe to keep it here for later.',
      savedEmpty: 'No recipes saved yet.',
      browseRecipes: 'Browse recipes',
      bakedEyebrow: 'Your recipe note',
      bakedTitle: 'You made this recipe',
      bakedOn: (date) => `Last made ${date}`,
      bakedAdjusted: 'Made with an adjusted, untested configuration.',
      bakedStoredInBrowser: 'Private note in your account.',
      privateNote: 'Your private note',
      shoppingTitle: 'Shopping list',
      shoppingEyebrow: 'Your baking plan',
      shoppingEmpty: 'Your shopping list is empty.',
      shoppingEmptyBody:
        'Add products from a recipe when you are ready to plan a bake.',
      storedInBrowser:
        'Your shopping list is saved to your account.',
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
        'Could not save the shopping list. Check your connection.',
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
      menu: 'Menú',
      recipes: 'Recetas',
      about: 'Nosotros',
      drafts: 'Borradores',
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
      skipNavigation: 'Saltar al contenido',
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
      searchPlaceholder: 'Nombre o ingrediente',
      searchAction: 'Buscar',
      searchResultsTitle: (query) => `Resultados para «${query}»`,
      searchEmpty:
        'No encontramos recetas. Prueba otro nombre o ingrediente, o consulta todas las recetas.',
      inventoryHint: (count) =>
        `Explora las ${count} recetas disponibles ahora.`,
      featuredKicker: 'Empieza con un clásico',
      featuredTitle: 'Tarta Napoleón',
      discoveryTitle: 'Elige una colección',
      discoveryLinks: [
        { id: 'breakfast', label: 'Para desayunar' },
        { id: 'everyday', label: 'Para cada día' },
        { id: 'celebration', label: 'Para una celebración' },
        { id: 'cottage-cheese', label: 'Con tvorog' },
        { id: 'batter-on-hand', label: 'Masa lista' },
      ],
      recipesEyebrow: 'Tu próxima receta',
      recipesTitle: 'Recetas para repetir.',
      collectionCount: (count) => `${count} recetas`,
      viewAll: 'Ver todas las recetas',
      trustEyebrow: 'Estado claro de la receta',
      trustTitle: 'Distingue lo horneado de lo calculado.',
      trustGuide: 'Guía del estado de la receta',
      testedExplanation: 'Horneada tal como está escrita.',
      trustNote:
        'Cada receta indica la mezcla de harina, el molde y la cantidad usados. Una receta original probada puede tener una variante calculada.',
      howWeTest: 'Cómo se prueban las recetas',
    },
    catalog: {
      draftsIntro: 'Recetas en preparación, antes de publicarlas.',
      draftsEmpty: 'No hay borradores.',
      publishedEmpty: 'Estamos preparando las primeras recetas para publicar.',
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
      unavailableTitle: 'Aún no se puede empezar a cocinar.',
      unavailableLink: 'Leer la ficha de la receta',
      unavailableRecord: 'Esta ficha de receta no está disponible.',
      fractionalIngredients:
        'Esta cantidad da fracciones de huevos u otros ingredientes enteros que requieren un ajuste manual. Vuelve a la receta y elige otra cantidad antes de iniciar el modo Cocina.',
      unsupportedConfiguration:
        'Esta configuración requiere un ajuste manual. Vuelve a la receta y elige una configuración compatible antes de iniciar el modo Cocina.',
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
      screenAwakeError:
        'No se pudo mantener la pantalla activa. Revisa el navegador o la batería.',
      stepChanged: (current, total, title) =>
        `Paso ${current} de ${total}: ${title}`,
      completedSteps: (completed, total) =>
        `${completed} de ${total} pasos completados`,
      cookingComplete: 'Preparación terminada',
      completeTitle: 'La receta está lista.',
      privateNote: 'Nota privada',
      privateNoteDescription:
        'Opcional. Solo tú puedes ver esta nota. Para guardarla necesitas una cuenta.',
      privateNotePlaceholder: '¿Qué quieres recordar o cambiar la próxima vez?',
      noteSaving: 'Guardando…',
      noteSaved: 'Guardada en tu cuenta.',
      noteSaveFailed:
        'No se pudo guardar la nota. Revisa la conexión.',
      completionNextSteps:
        'Puedes volver a la receta o empezar de nuevo.',
      previousNote: 'De la última vez',
      previousNoteDescription: 'Tenlo en cuenta mientras preparas la receta.',
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
      beforeStart: 'Antes de empezar',
      planAhead: 'Planifica con antelación.',
      keepInMind: 'Tenlo en cuenta',
      ingredients: 'Ingredientes',
      ingredientsIntro:
        'Las condiciones y los detalles sin resolver permanecen visibles.',
      creamOptionsEyebrow: 'Relleno',
      creamOptionsTitle: 'Elige una crema.',
      creamOptionsIntro: () =>
        'Elige el relleno. Tu elección cambia los ingredientes y los pasos de preparación.',
      creamRecommended: 'Recomendada',
      creamSelectedEyebrow: 'Crema elegida',
      creamRecipeEyebrow: 'Receta de crema',
      changeCream: 'Cambiar crema',
      viewCreamRecipe: 'Ver receta de la crema',
      chooseCreamBeforeCooking: 'Elige primero una crema',
      chooseCream: (name) => `Elegir ${name}`,
      optional: 'opcional',
      markIngredientPrepared: (name) => `Marcar ${name} como preparado`,
      method: (count) => methodStepCount('es', count),
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
      positiveAmount: 'Introduce una cantidad mayor que 0.',
      unsupportedTitle: 'Esta configuración de la receta no está disponible.',
      unsupportedGeometry:
        'Este tamaño de molde no está resuelto para esta receta. Abre la receta base para elegir cantidades admitidas.',
      openBaseRecipe: 'Abrir la receta base',
      supportedAmount: 'Introduce una cantidad compatible con esta receta.',
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
      savedEyebrow: 'Quiero preparar',
      savedHint:
        'Pulsa el marcador de una receta para guardarla aquí y volver a ella.',
      savedEmpty: 'Todavía no has guardado recetas.',
      browseRecipes: 'Ver recetas',
      bakedEyebrow: 'Tu nota sobre la receta',
      bakedTitle: 'Ya preparaste esta receta',
      bakedOn: (date) => `Última preparación: ${date}`,
      bakedAdjusted: 'Preparada con una configuración ajustada sin probar.',
      bakedStoredInBrowser: 'Nota privada en tu cuenta.',
      privateNote: 'Tu nota privada',
      shoppingTitle: 'Lista de compra',
      shoppingEyebrow: 'Tu plan de repostería',
      shoppingEmpty: 'Tu lista de compra está vacía.',
      shoppingEmptyBody:
        'Añade productos desde una receta cuando quieras planificar lo que vas a hornear.',
      storedInBrowser:
        'La lista de compra se guarda en tu cuenta.',
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
        'No se pudo guardar la lista de compra. Revisa la conexión.',
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
      menu: 'Меню',
      recipes: 'Рецепти',
      about: 'Про нас',
      drafts: 'Чернетки',
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
      skipNavigation: 'Перейти до вмісту',
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
      searchPlaceholder: 'Назва або інгредієнт',
      searchAction: 'Шукати',
      searchResultsTitle: (query) => `Результати для «${query}»`,
      searchEmpty:
        'Рецептів не знайдено. Спробуйте іншу назву чи інгредієнт або перегляньте всі рецепти.',
      inventoryHint: (count) =>
        `Перегляньте всі ${count} рецептів, доступних зараз.`,
      featuredKicker: 'Почніть із класики',
      featuredTitle: 'Наполеон',
      discoveryTitle: 'Оберіть добірку',
      discoveryLinks: [
        { id: 'breakfast', label: 'На сніданок' },
        { id: 'everyday', label: 'На щодень' },
        { id: 'celebration', label: 'Для свята' },
        { id: 'cottage-cheese', label: 'Із сиром' },
        { id: 'batter-on-hand', label: 'Тісто про запас' },
      ],
      recipesEyebrow: 'Що приготуємо?',
      recipesTitle: 'Рецепти, до яких повертаються.',
      collectionCount: (count) => {
        const lastTwoDigits = count % 100;
        const lastDigit = count % 10;
        const label =
          lastTwoDigits >= 11 && lastTwoDigits <= 14
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
      howWeTest: 'Як перевіряють рецепти',
    },
    catalog: {
      draftsIntro: 'Рецепти в роботі, які ще не опубліковані.',
      draftsEmpty: 'Чернеток поки немає.',
      publishedEmpty: 'Готуємо перші рецепти до публікації.',
      eyebrow: 'Робочий каталог рецептів',
      title: ['Рецепти, які хочеться', 'пекти знову.'],
      intro:
        'Тут показані всі відомі рецепти, зокрема чернетки. Відсутній текст, час і підтвердження фото залишаються чітко позначеними.',
      collectionEyebrow: 'Поточна колекція',
      allRecipes: 'Усі рецепти',
      detailsToConfirm: 'Деталі потребують уточнення',
      workingRecord: 'Робочий рецепт',
      collectionsLabel: 'Добірки',
    },
    cook: {
      backToRecipe: 'Повернутися до рецепта',
      exit: 'Вийти з режиму приготування',
      unavailableKicker: 'Режим приготування ще не готовий',
      unavailableTitle: 'Поки що неможливо почати приготування.',
      unavailableLink: 'Переглянути запис рецепта',
      unavailableRecord: 'Цей запис рецепта недоступний.',
      fractionalIngredients:
        'Ця кількість дає дробові яйця або інші цілі інгредієнти, які потребують ручного коригування. Поверніться до рецепта й оберіть іншу кількість перед початком покрокового приготування.',
      unsupportedConfiguration:
        'Ця конфігурація потребує ручного коригування. Поверніться до рецепта й оберіть підтримувану конфігурацію перед початком покрокового приготування.',
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
      screenAwakeError:
        'Не вдалося втримати екран активним. Перевірте браузер або режим економії заряду.',
      stepChanged: (current, total, title) =>
        `Крок ${current} з ${total}: ${title}`,
      completedSteps: (completed, total) =>
        `Виконано ${completed} з ${total} кроків`,
      cookingComplete: 'Приготування завершено',
      completeTitle: 'Приготування завершено.',
      privateNote: 'Приватна нотатка',
      privateNoteDescription:
        'Необов’язково. Цю нотатку бачите лише ви. Для збереження потрібен акаунт.',
      privateNotePlaceholder: 'Що запам’ятати або змінити наступного разу?',
      noteSaving: 'Зберігаємо…',
      noteSaved: 'Збережено в акаунті.',
      noteSaveFailed:
        'Не вдалося зберегти нотатку. Перевірте з’єднання.',
      completionNextSteps:
        'Можна повернутися до рецепта або почати знову.',
      previousNote: 'З минулого приготування',
      previousNoteDescription: 'Зверніть на це увагу під час приготування.',
      returnToRecipe: 'Повернутися до рецепта',
      cookAgain: 'Приготувати ще раз',
    },
    recipe: {
      backToRecipes: 'Рецепти',
      inventoryDraft: 'Чернетка каталогу',
      workingRecord: 'Робочий рецепт',
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
      beforeStart: 'Перед початком',
      planAhead: 'Сплануйте заздалегідь.',
      keepInMind: 'Зверніть увагу',
      ingredients: 'Інгредієнти',
      ingredientsIntro: 'Умови й неуточнені деталі залишаються видимими.',
      creamOptionsEyebrow: 'Начинка',
      creamOptionsTitle: 'Оберіть крем.',
      creamOptionsIntro: () =>
        'Оберіть начинку. Від вибору залежать інгредієнти та кроки приготування.',
      creamRecommended: 'Рекомендовано',
      creamSelectedEyebrow: 'Вибраний крем',
      creamRecipeEyebrow: 'Рецепт крему',
      changeCream: 'Змінити крем',
      viewCreamRecipe: 'Переглянути рецепт крему',
      chooseCreamBeforeCooking: 'Спочатку оберіть крем',
      chooseCream: (name) => `Обрати «${name}»`,
      optional: 'необов’язково',
      markIngredientPrepared: (name) =>
        `Позначити «${name}» як підготовлений інгредієнт`,
      method: (count) => methodStepCount('uk', count),
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
      positiveAmount: 'Введіть кількість більшу за 0.',
      unsupportedTitle: 'Ця конфігурація рецепта не підтримується.',
      unsupportedGeometry:
        'Цей розмір форми ще не узгоджено для рецепта. Відкрийте базовий рецепт, щоб обрати підтримувані кількості.',
      openBaseRecipe: 'Відкрити базовий рецепт',
      supportedAmount: 'Введіть кількість, яку підтримує цей рецепт.',
      quantitiesMissing: 'Бракує кількостей',
      quantitiesMissingDescription:
        'У цьому рецепті ще немає підтримуваного базового інгредієнта з числовою кількістю. Додайте кількості з джерела, щоб увімкнути «Змінити кількість» і «Використати наявне».',
      sourceGap: 'Прогалина у джерелі',
    },
    status: {
      tested: {
        label: 'Перевірено',
        explanation: 'Цю версію успішно приготували.',
        repeatedExplanation: 'Готували багато разів.',
      },
      calculated: {
        label: 'Розраховано',
        explanation:
          'Кількості перераховано. Цю версію ще не перевіряли на практиці.',
      },
      suggested: {
        label: 'Запропоновано',
        explanation: 'Ідея для спроби. Цю зміну ще не перевіряли на практиці.',
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
      savedEyebrow: 'Хочу приготувати',
      savedHint:
        'Натисніть закладку на рецепті, щоб зберегти його тут і повернутися пізніше.',
      savedEmpty: 'Ще немає збережених рецептів.',
      browseRecipes: 'Переглянути рецепти',
      bakedEyebrow: 'Ваша нотатка про рецепт',
      bakedTitle: 'Ви вже готували цей рецепт',
      bakedOn: (date) => `Востаннє готували ${date}`,
      bakedAdjusted: 'Готували зі зміненою неперевіреною конфігурацією.',
      bakedStoredInBrowser: 'Приватна нотатка у вашому акаунті.',
      privateNote: 'Ваша приватна нотатка',
      shoppingTitle: 'Список покупок',
      shoppingEyebrow: 'Ваш план випічки',
      shoppingEmpty: 'Ваш список порожній.',
      shoppingEmptyBody:
        'Додайте продукти з рецепта, коли будете планувати випічку.',
      storedInBrowser:
        'Список покупок зберігається у вашому акаунті.',
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
        'Не вдалося зберегти список покупок. Перевірте з’єднання.',
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
