/** Stable public delivery paths. Replace the delivery copies, never version these URLs. */
export const crepesDownloadPath = '/uk/mlyntsi-recept';
export const crepesDownloads = [
  {
    id: 'recipe',
    href: '/downloads/Bake-Again-Bezghliutenovi-mlyntsi.pdf',
    title: 'Завантажити рецепт млинців',
    description: 'PDF · 6 сторінок · 703 КіБ. Інгредієнти, кроки й підказки, якщо млинці рвуться.',
  },
  {
    id: 'junior-card',
    href: '/downloads/Bake-Again-Mlyntsi-kartka-yunoho-kukharia.pdf',
    title: 'Завантажити картку юного кухаря',
    description: 'PDF · 1 сторінка A4 · 247 КіБ. Короткі кроки з фото — зручно роздрукувати.',
  },
] as const;
