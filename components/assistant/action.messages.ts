export const actionMessages = {
  en: {
    review: 'Review proposed action',
    title: 'Review before continuing',
    cancel: 'Cancel',
    confirm: 'Confirm and continue',
    open: 'Open scaling controls',
    shopping: 'Add these ingredients',
    loading: 'Checking the current recipe…',
    done: 'Action completed.',
    cancelled: 'Action cancelled. Nothing was changed.',
    error:
      'This action could not be completed. Review the current recipe and ask again.',
    stale:
      'The recipe or configuration changed. Ask again using the current version.',
    suggestion: 'This is a proposed action. Nothing happens until you confirm.',
    scaling:
      'Open the existing recipe controls. No scale or recipe change will be applied.',
    calculated:
      'Quantities calculated by the app. This configuration has not been bake-tested.',
    unknown: 'Not confirmed in the recipe',
    gaps: 'Source details need confirmation.',
    choose: 'Choose an ingredient',
    duplicate:
      'Already-added recipe lines are kept, not duplicated or rescaled.',
    blocked:
      'This configuration is not eligible for Cook Mode. Opening the controls does not bypass that restriction.',
  },
  es: {
    review: 'Revisar acción propuesta',
    title: 'Revisa antes de continuar',
    cancel: 'Cancelar',
    confirm: 'Confirmar y continuar',
    open: 'Abrir ajustes de cantidades',
    shopping: 'Añadir estos ingredientes',
    loading: 'Comprobando la receta actual…',
    done: 'Acción completada.',
    cancelled: 'Acción cancelada. No se ha cambiado nada.',
    error:
      'No se pudo completar la acción. Revisa la receta actual y vuelve a preguntar.',
    stale:
      'La receta o la configuración ha cambiado. Vuelve a preguntar con la versión actual.',
    suggestion: 'Es una acción propuesta. No se hará nada hasta que confirmes.',
    scaling:
      'Abre los controles de la receta. No se aplicará ninguna escala ni cambio a la receta.',
    calculated:
      'Cantidades calculadas por la aplicación. Esta configuración no se ha probado al hornear.',
    unknown: 'Sin confirmar en la receta',
    gaps: 'Hay detalles de la fuente pendientes de confirmación.',
    choose: 'Elige un ingrediente',
    duplicate:
      'Las líneas de receta ya añadidas se conservan, sin duplicarlas ni recalcularlas.',
    blocked:
      'Esta configuración no permite usar el modo de cocina. Abrir los controles no elimina esa restricción.',
  },
  uk: {
    review: 'Переглянути запропоновану дію',
    title: 'Перевір перед продовженням',
    cancel: 'Скасувати',
    confirm: 'Підтвердити й продовжити',
    open: 'Відкрити налаштування кількості',
    shopping: 'Додати ці інгредієнти',
    loading: 'Перевіряю поточний рецепт…',
    done: 'Дію виконано.',
    cancelled: 'Дію скасовано. Нічого не змінено.',
    error: 'Не вдалося виконати дію. Перевір поточний рецепт і запитай ще раз.',
    stale:
      'Рецепт або конфігурація змінилися. Запитай ще раз із поточною версією.',
    suggestion:
      'Це пропозиція дії. Без твого підтвердження нічого не відбудеться.',
    scaling:
      'Відкриються наявні налаштування рецепта. Масштаб і рецепт не зміняться.',
    calculated:
      'Кількості розраховані застосунком. Цю конфігурацію не випробувано випіканням.',
    unknown: 'Не підтверджено в рецепті',
    gaps: 'Деталі джерела потребують підтвердження.',
    choose: 'Обери інгредієнт',
    duplicate:
      'Уже додані рядки рецепта залишаться без дублювання чи перерахунку.',
    blocked:
      'Ця конфігурація недоступна в режимі приготування. Відкриття налаштувань не обходить це обмеження.',
  },
} as const;
