import type { AppLocale } from '@/lib/i18n/config';
import { Button } from '@/components/ui/button';
import styles from './social-links.module.css';

function Instagram() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Facebook() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M14 22v-9h3l.5-4H14V7c0-1.2.4-2 2-2h2V1.4A24 24 0 0 0 15 1c-3 0-5 1.8-5 5v3H7v4h3v9z" />
    </svg>
  );
}

const profiles = [
  {
    platform: 'instagram',
    name: 'Instagram',
    followLabel: 'Підписатися в Instagram',
    href: 'https://www.instagram.com/bakeagain.glutenfree/',
    Icon: Instagram,
  },
  {
    platform: 'facebook',
    name: 'Facebook',
    followLabel: 'Підписатися у Facebook',
    href: 'https://www.facebook.com/profile.php?id=61595228937672',
    Icon: Facebook,
  },
];

export function SocialLinks({
  locale,
  variant = 'footer',
  id = 'social-follow',
}: {
  locale: AppLocale;
  variant?: 'header' | 'footer' | 'follow';
  id?: string;
}) {
  // The current social content is Ukrainian. Do not invite other locales to follow.
  if (locale !== 'uk') return null;

  const links = (
    <ul className={styles.links} aria-label="Bake Again у соціальних мережах">
      {profiles.map(({ platform, name, followLabel, href, Icon }) => (
        <li key={name}>
          <Button
            href={href}
            variant={
              variant === 'follow'
                ? 'default'
                : variant === 'header'
                  ? 'outline'
                  : 'link'
            }
            size="sm"
            className={styles.link}
            aria-label={
              variant === 'follow' ? followLabel : `Bake Again · ${name}`
            }
            title={`Bake Again · ${name}`}
            data-social-platform={platform}
            data-social-placement={variant}
          >
            <Icon aria-hidden="true" />
            <span>{variant === 'follow' ? followLabel : name}</span>
          </Button>
        </li>
      ))}
    </ul>
  );

  if (variant === 'follow') {
    return (
      <section
        className={styles.follow}
        aria-labelledby={`${id}-title`}
        data-social-links
        data-social-follow
      >
        <div className={styles.copy}>
          <h2 id={`${id}-title`}>Печімо разом</h2>
          <p>
            Нові рецепти без глютену, короткі відео й практичні підказки.
            Підписуйтеся там, де вам зручно.
          </p>
        </div>
        {links}
      </section>
    );
  }

  return (
    <div className={`${styles.social} ${variant === 'footer' ? styles.footer : ''}`} data-social-links>
      {links}
    </div>
  );
}
