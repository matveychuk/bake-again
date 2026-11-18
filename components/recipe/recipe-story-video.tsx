import type { AppLocale } from '@/lib/i18n/config';
import type { RecipeStoryVideo as Story } from '@/content/recipes/story-videos';
import { EditorialInvitation } from '@/components/site/editorial-invitation';
import { Button } from '@/components/ui/button';

const copy = {
  uk: {
    watch: 'Цей ролик в Instagram',
    languages: {
      uk: 'Відео українською',
      en: 'Відео англійською',
      es: 'Відео іспанською',
    },
    seconds: 'с',
    fallback: 'Відкрити відео',
  },
  en: {
    watch: 'Watch on Instagram (in Ukrainian)',
    languages: {
      uk: 'Video in Ukrainian',
      en: 'Video in English',
      es: 'Video in Spanish',
    },
    seconds: 'sec',
    fallback: 'Open video',
  },
  es: {
    watch: 'Ver la versión en ucraniano en Instagram',
    languages: {
      uk: 'Vídeo en ucraniano',
      en: 'Vídeo en inglés',
      es: 'Vídeo en español',
    },
    seconds: 's',
    fallback: 'Abrir vídeo',
  },
};

export function RecipeStoryVideo({
  story,
  locale,
  id = 'recipe-story-video',
}: {
  story: Story;
  locale: AppLocale;
  id?: string;
}) {
  const text = copy[locale];
  const localized = story.localizedMedia?.[locale];
  const media = localized ?? story;
  const languageLabel = localized
    ? localized.languageLabel ?? text.languages[localized.language]
    : story.languageLabels?.[locale] ?? text.languages[story.language];
  return (
    <EditorialInvitation
      id={id}
      titleId={`${id}-title`}
      title={story.title[locale]}
      description={story.description[locale]}
      variant="recipe-video"
      eyebrow={`${languageLabel} · ${media.durationSeconds} ${text.seconds}`}
      image={
        // oxlint-disable-next-line jsx-a11y/media-has-caption -- Author narration transcript is pending; do not fabricate captions. Render a verified track when supplied. The adjacent story summary is available as text.
        <video
          controls
          playsInline
          preload="none"
          poster={media.poster}
          width={540}
          height={960}
          aria-label={story.title[locale]}
        >
          <source src={media.src} type="video/mp4" />
          {story.captions && story.captions.language === media.language && (
            <track
              kind="captions"
              src={story.captions.src}
              srcLang={story.captions.language}
              label={story.captions.label}
            />
          )}
          <a href={media.src}>{text.fallback}</a>
        </video>
      }
      action={
        <Button
          variant="ghost"
          href={story.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {text.watch}
        </Button>
      }
    />
  );
}
