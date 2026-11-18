import type { LocalizedText } from './recipe.types';

export interface RecipeStoryVideo {
  src: string;
  poster: string;
  language: 'uk' | 'en' | 'es';
  durationSeconds: number;
  languageLabels?: Partial<LocalizedText>;
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
        languageLabel?: string;
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
    languageLabels: { en: 'Ukrainian audio and on-screen text' },
    instagramUrl: 'https://www.instagram.com/reel/De7U95vI0Ky/',
    localizedMedia: {
      en: {
        src: '/media/recipes/crepes/crepes-family-en-lite-v1.mp4',
        poster: '/media/recipes/crepes/crepes-family-en-lite-poster-v1.webp',
        language: 'en',
        durationSeconds: 33,
        languageLabel: 'On-screen text and song in English',
      },
      es: {
        src: '/media/recipes/crepes/crepes-family-es-lite-v1.mp4',
        poster: '/media/recipes/crepes/crepes-family-es-lite-poster-v1.webp',
        language: 'es',
        durationSeconds: 33,
        languageLabel: 'Texto en español · Canción en inglés',
      },
    },
    title: {
      uk: 'Млинці без маминих підказок',
      en: 'My son makes crepes on his own',
      es: 'Mi hijo prepara los crepes él solo',
    },
    description: {
      uk: 'Коротка історія з нашої кухні: син змішує тісто, смажить млинці й куштує результат. А кіт чекає поруч.',
      en: 'My son follows the recipe on his tablet, from mixing the batter to flipping the crepes. I’m behind the camera, and the cat is waiting for a taste.',
      es: 'Con la receta abierta en la tablet, mi hijo prepara la masa, calienta la sartén y se hace los crepes. Mientras tanto, el gato va a buscar su ración.',
    },
  },
};
