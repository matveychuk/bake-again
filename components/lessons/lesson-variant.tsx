'use client';
import { createContext, useContext } from 'react';
import type { LessonVariant } from '@/lib/lessons/variant';

export type { LessonBuyPlace, LessonVariant } from '@/lib/lessons/variant';

const LessonVariantContext = createContext<LessonVariant>('default');
export const LessonVariantProvider = LessonVariantContext.Provider;
export const useLessonVariant = () => useContext(LessonVariantContext);
