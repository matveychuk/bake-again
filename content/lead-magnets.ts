export const leadMagnets = [
  {
    magnetId: 'shokolad',
    title: 'Шоколадний торт без глютену з вишнями й бананом',
    subtitle: 'Покроковий PDF-рецепт із грамами — на твою пошту',
    features: [
      'Корж на Schär Mix B, крем і глазур — точні грами',
      '11 кроків із фото: від тіста до гірки зі шматочків',
      'План на два дні: як спекти торт до свята без поспіху',
    ],
    image: '/images/lead-magnets/shokolad.webp',
    imageAlt: 'Шматок шоколадного торта з вишнями, бананом і кремом на тарілці',
    note: 'Ми надішлемо лист для підтвердження. Після нього за хвилину прийде рецепт. Якщо листа немає — зазирни в «Промоакції» або «Спам».',
  },
] as const;

export function getLeadMagnet(locale: string, id: string) {
  return locale === 'uk'
    ? leadMagnets.find((magnet) => magnet.magnetId === id)
    : undefined;
}
