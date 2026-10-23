import source from './lead-magnets.json' with { type: 'json' };
import { validateLeadMagnetRegistry } from './lead-magnets.validation.ts';

validateLeadMagnetRegistry(source);
export const leadMagnetRegistry = source;
export type LeadMagnetId = keyof typeof source;
export const leadMagnetIds = Object.keys(source) as LeadMagnetId[];
export const leadMagnetPath = (id: LeadMagnetId) => `/uk/recept/${id}`;
export const isLeadMagnetId = (value: unknown): value is LeadMagnetId =>
  typeof value === 'string' && Object.hasOwn(leadMagnetRegistry, value);
export const leadMagnets = leadMagnetIds.map((magnetId) => ({
  magnetId,
  ...leadMagnetRegistry[magnetId].page,
}));

export function getLeadMagnet(locale: string, id: string) {
  return locale === 'uk'
    ? leadMagnets.find((magnet) => magnet.magnetId === id)
    : undefined;
}

export function getLeadMagnetBot(id: LeadMagnetId, channel: 'ig' | 'fb') {
  return {
    ...leadMagnetRegistry[id].bot,
    url: `https://bakeagain.com${leadMagnetPath(id)}?src=${channel}-bot`,
  };
}
