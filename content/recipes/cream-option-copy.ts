import type { AppLocale } from '@/lib/i18n/config';

export type CreamOptionCopy = {
  title: string;
  description: string;
};

export const reusableCreamRecipeIds = [
  'mascarpone-whipped-cream',
  'vanilla-egg-custard',
  'eggless-vanilla-custard',
  'vanilla-buttercream',
] as const;

export function isReusableCreamRecipeId(
  recipeId: string,
): recipeId is (typeof reusableCreamRecipeIds)[number] {
  return reusableCreamRecipeIds.some((candidate) => candidate === recipeId);
}

const creamOptionCopy: Record<string, Record<AppLocale, CreamOptionCopy>> = {
  'mascarpone-whipped-cream': {
    en: {
      title: 'Whipped cream with mascarpone',
      description:
        'A light, quick cream for filling pastries or layering sponge cakes that holds its shape well.',
    },
    es: {
      title: 'Nata montada con mascarpone',
      description:
        'Una crema ligera y rápida para rellenar pasteles o montar bizcochos que mantiene bien la forma.',
    },
    uk: {
      title: 'Збиті вершки з маскарпоне',
      description:
        'Легкий швидкий крем для наповнення тістечок і прошарування бісквітів, який добре тримає форму.',
    },
  },
  'vanilla-egg-custard': {
    en: {
      title: 'Vanilla custard with eggs',
      description:
        'A smooth classic cream for filling pastries and layering desserts.',
    },
    es: {
      title: 'Crema pastelera de vainilla con huevo',
      description:
        'Una crema clásica y lisa para rellenar pasteles y montar postres.',
    },
    uk: {
      title: 'Ванільний заварний крем з яйцями',
      description:
        'Гладкий класичний крем для наповнення тістечок і прошарування десертів.',
    },
  },
  'eggless-vanilla-custard': {
    en: {
      title: 'Eggless vanilla custard',
      description:
        'A soft homemade cream for filling a large batch of pastries; it thickens as it cools.',
    },
    es: {
      title: 'Crema de vainilla sin huevo',
      description:
        'Una crema casera suave para rellenar una tanda grande de pasteles; espesa al enfriarse.',
    },
    uk: {
      title: 'Ванільний заварний крем без яєць',
      description:
        'М’який домашній крем для великої партії тістечок; під час охолодження він стає густішим.',
    },
  },
  'vanilla-buttercream': {
    en: {
      title: 'Vanilla buttercream',
      description:
        'A rich, stable cream for filling and decorating cakes and pastries.',
    },
    es: {
      title: 'Crema de mantequilla y vainilla',
      description:
        'Una crema rica y estable para rellenar y decorar tartas y pasteles.',
    },
    uk: {
      title: 'Ванільний масляний крем',
      description:
        'Насичений стійкий крем для наповнення й оздоблення тортів та тістечок.',
    },
  },
};

export function getCreamOptionCopy(
  recipeId: string,
  locale: AppLocale,
): CreamOptionCopy {
  return (
    creamOptionCopy[recipeId]?.[locale] ?? {
      title: recipeId,
      description: '',
    }
  );
}
