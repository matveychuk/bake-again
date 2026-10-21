import copy from './magnet-copy.json' with { type: 'json' };
export const magnetIds = ['shokolad', 'mlyntsi'] as const;
export type MagnetId = (typeof magnetIds)[number];
export const isMagnetId = (value: unknown): value is MagnetId =>
  typeof value === 'string' && magnetIds.includes(value as MagnetId);

/** Public copy and fixed delivery destinations, never supplied by a visitor. */
export const magnetDelivery = copy;
