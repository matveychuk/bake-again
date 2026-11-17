import type { LocalizedText } from './recipe.types';

export interface RecipeStoryVideo {
  src: string;
  poster: string;
  language: 'uk' | 'en' | 'es';
  durationSeconds: number;
  instagramUrl: string;
  title: LocalizedText;
  description: LocalizedText;
  captions?: { src: string; language: 'uk' | 'en' | 'es'; label: string };
  localizedMedia?: Partial<
    Record<
      'uk' | 'en' | 'es',
      {
        src: string;
        poster: string;
        language: 'uk' | 'en' | 'es';
        durationSeconds: number;
      }
    >
  >;
}

/** Optional editorial story, separate from the canonical cooking instructions. */
export const recipeStoryVideos: Record<string, RecipeStoryVideo> = {
  crepes: {
    src: '/media/recipes/crepes/crepes-family-web-v1.mp4',
    poster: '/media/recipes/crepes/crepes-family-poster-v1.webp',
    language: 'uk',
    durationSeconds: 35,
    instagramUrl: 'https://www.instagram.com/reel/De7U95vI0Ky/',
    localizedMedia: {
      es: {
        src: '/media/recipes/crepes/crepes-family-es-web-v2.mp4',
        poster: '/media/recipes/crepes/crepes-family-es-poster-v1.webp',
        language: 'es',
        durationSeconds: 33,
      },
    },
    title: {
      uk: 'Млинці без маминих підказок',
      en: 'Crepes without Mum’s help',
      es: 'Crepes sin las indicaciones de mamá',
    },
    description: {
      uk: 'Коротка історія з нашої кухні: син змішує тісто, смажить млинці й куштує результат. А кіт чекає поруч.',
      en: 'A short story from our kitchen: my son mixes the batter, cooks the crepes and tastes the result. The cat waits nearby.',
      es: 'Una pequeña historia de nuestra cocina: mi hijo mezcla la masa, cocina los crepes y prueba el resultado. El gato espera cerca.',
    },
  },
};
