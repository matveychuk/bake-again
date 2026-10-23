import { leadMagnetIds, leadMagnetPath, leadMagnetRegistry, isLeadMagnetId, type LeadMagnetId } from '../../content/lead-magnets.ts';
export const magnetIds = leadMagnetIds;
export type MagnetId = LeadMagnetId;
export const isMagnetId = isLeadMagnetId;

/** Public copy and fixed delivery destinations, never supplied by a visitor. */
export const magnetDelivery = Object.fromEntries(magnetIds.map(id => [id, {
  ...leadMagnetRegistry[id].email,
  page: leadMagnetPath(id),
}])) as { [Id in MagnetId]: (typeof leadMagnetRegistry)[Id]['email'] & { page: string } };
