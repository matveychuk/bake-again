import source from './lead-magnets.json' with { type: 'json' };
import { validateLeadMagnetRegistry } from './lead-magnets.validation.ts';

validateLeadMagnetRegistry(source);
export const leadMagnetRegistry = source;
export type LeadMagnetId = keyof typeof source;
export const leadMagnetIds = Object.keys(source) as LeadMagnetId[];
export const productLocale = (id: LeadMagnetId): 'uk' | 'es' | 'en' => {
  const product = source[id];
  if ('locale' in product && (product.locale === 'es' || product.locale === 'en')) return product.locale;
  return 'uk';
};
export const landingMagnetIds = leadMagnetIds.filter((id) => 'bot' in source[id]);
/** Label above each localized free PDF invitation. */
export const pdfInvitationEyebrow = {
  uk: 'Безкоштовно · PDF',
  es: 'Gratis · PDF',
  en: 'Free · PDF',
} as const;
export const leadMagnetPath = (id: LeadMagnetId) => {
  const product = source[id];
  return 'bot' in product ? `/uk/recept/${id}` : product.recipePath;
};
export const isLeadMagnetId = (value: unknown): value is LeadMagnetId =>
  typeof value === 'string' && Object.hasOwn(leadMagnetRegistry, value);
export const leadMagnets = landingMagnetIds.map((magnetId) => ({
  magnetId,
  ...leadMagnetRegistry[magnetId].page,
}));

export function getLeadMagnet(locale: string, id: string) {
  return locale === 'uk'
    ? leadMagnets.find((magnet) => magnet.magnetId === id)
    : undefined;
}

export function getLeadMagnetBot(id: LeadMagnetId, channel: 'ig' | 'fb') {
  const product = source[id];
  if (!('bot' in product)) throw new Error('No bot landing page for this edition');
  return {
    ...product.bot,
    url: `https://bakeagain.com${leadMagnetPath(id)}?src=${channel}-bot`,
  };
}

export function getRecipeInvitation(recipeId: string, locale: string) {
  for (const magnetId of leadMagnetIds) {
    const product: import('./lead-magnets.validation.ts').LeadMagnetDefinition =
      leadMagnetRegistry[magnetId];
    if (productLocale(magnetId) === locale && product.recipeInvitation?.recipeId === recipeId)
      return { magnetId, locale: productLocale(magnetId), ...product.recipeInvitation };
  }
  return null;
}
