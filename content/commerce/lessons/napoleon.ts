import media from './napoleon.media.json' with { type: 'json' };
import type { AppLocale } from '../../../lib/i18n/config.ts';

export const napoleonLessonSteps = [
  {
    stepId: 's01-sour-cream-base',
    n: 1,
    title: {
      uk: 'Сметанна основа',
      en: 'Sour cream base',
      es: 'Base de crema agria',
    },
  },
  {
    stepId: 's02-butter-crumb',
    n: 2,
    title: {
      uk: 'Масляна крихта',
      en: 'Butter crumb',
      es: 'Migas de mantequilla',
    },
  },
  {
    stepId: 's03-short-mix',
    n: 3,
    title: { uk: 'Короткий заміс', en: 'Short mix', es: 'Amasado corto' },
  },
  {
    stepId: 's04-divide',
    n: 4,
    title: { uk: 'Поділ тіста', en: 'Divide the dough', es: 'Divide la masa' },
  },
  {
    stepId: 's05-rolling',
    n: 5,
    title: { uk: 'Розкачування', en: 'Rolling out', es: 'Estirar la masa' },
  },
  {
    stepId: 's06-shape',
    n: 6,
    title: { uk: 'Форма коржа', en: 'Shape the layer', es: 'Forma la lámina' },
  },
  {
    stepId: 's07-baking',
    n: 7,
    title: { uk: 'Випікання', en: 'Baking', es: 'Hornear' },
  },
  {
    stepId: 's08-baked-layers',
    n: 8,
    title: {
      uk: 'Готові коржі',
      en: 'The baked layers',
      es: 'Las láminas listas',
    },
    free: true,
  },
  {
    stepId: 's09-custard',
    n: 9,
    title: { uk: 'Заварний крем', en: 'Custard', es: 'Crema pastelera' },
  },
  {
    stepId: 's10-nuts-crumb',
    n: 10,
    title: {
      uk: 'Горіхи й крихта',
      en: 'Nuts and crumb',
      es: 'Nueces y migas',
    },
  },
  {
    stepId: 's11-layering',
    n: 11,
    title: { uk: 'Перемащування', en: 'Layering', es: 'Montaje' },
  },
  {
    stepId: 's12-decorating',
    n: 12,
    title: { uk: 'Оздоблення', en: 'Decorating', es: 'Decorar' },
  },
  {
    stepId: 's13-finished-cake',
    n: 13,
    title: {
      uk: 'Готовий торт',
      en: 'The finished cake',
      es: 'La tarta lista',
    },
  },
] as const;

export type FreeLessonMedia = {
  public: true;
  wide: string;
  vertical: string;
  poster: string;
  captionsVtt?: string;
  uploadDate: string;
};

/** Populate only with reviewed public URLs. No invented media or Stream identifiers. */
export type LessonVideo = {
  provider: 'cloudflare-stream';
  uid: string;
  durationSec: number;
  posterPath?: string;
};
export type LessonStep = {
  stepId: string;
  n: number;
  title: Record<'uk', string> & Partial<Record<'en' | 'es', string>>;
  free?: boolean;
  videos: Partial<
    Record<
      AppLocale,
      { wide: LessonVideo; vertical: LessonVideo; captionsVtt?: string }
    >
  >;
  status: 'draft' | 'final';
};
export type LessonMedia = Record<
  string,
  { uk: NonNullable<LessonStep['videos']['uk']>; status?: 'draft' | 'final' }
>;
const assets = media as LessonMedia;
const durations = [28, 40, 47, 41, 26, 17, 29, 24, 54, 46, 38, 35, 39];
export const napoleonLesson = {
  deliveryUrl: '/uk/urok/napoleon',
  payhipProductIds: [] as string[],
  pdf: null as null | { storageKey: string; title: Record<'uk', string> },
  lessonId: 'napoleon-video',
  recipeId: 'gluten-free-napoleon',
  steps: napoleonLessonSteps.map(
    (s, i): LessonStep => ({
      ...s,
      status: assets[s.stepId]?.status ?? 'draft',
      videos: {
        uk: assets[s.stepId]?.uk ?? {
          wide: {
            provider: 'cloudflare-stream',
            uid: '',
            durationSec: durations[i],
          },
          vertical: {
            provider: 'cloudflare-stream',
            uid: '',
            durationSec: durations[i],
          },
        },
      },
    }),
  ),
  freePreview: {
    enabled: false as boolean,
    stepId: 's08-baked-layers',
    durationSec: 24,
    videos: {} as Partial<Record<AppLocale, FreeLessonMedia>>,
  },
};

export const validStreamUid = (uid: string) => /^[a-f0-9]{32}$/.test(uid);

const duration = Math.round(
  napoleonLesson.steps.reduce((total, step) => total + step.videos.uk!.wide.durationSec, 0),
);
export const napoleonLessonDuration = `${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, '0')}`;

/** Public projection deliberately excludes every private video identifier. */
export function lessonStepSummaries() {
  return napoleonLesson.steps.map((s) => ({
    stepId: s.stepId,
    n: s.n,
    title: s.title.uk,
    durationSec: s.videos.uk!.wide.durationSec,
    free: !!s.free,
    status: s.status,
  }));
}
