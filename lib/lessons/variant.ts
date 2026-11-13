/** Landing order for the lesson description: `krok8` follows the step 8 ad and stories. */
export type LessonVariant = 'krok8' | 'default';
export type LessonBuyPlace = 'hero' | 'end' | 'bottom' | 'sticky';

export const lessonVariantKey = 'lessonVariant';
export const isKrok8Source = (src: string | null | undefined) =>
  typeof src === 'string' && src.includes('krok8');
