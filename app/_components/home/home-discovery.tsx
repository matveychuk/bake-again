import { ArrowRight } from 'lucide-react';
import { isRecipeCollectionId } from '@/content/recipes/collections';
import type { AppLocale } from '@/lib/i18n/config';
import { getUiMessages } from '@/lib/i18n/messages';
import { localeHomePath } from '@/lib/i18n/routes';

export function HomeDiscovery({ locale }: { locale: AppLocale }) {
  const messages = getUiMessages(locale).home;
  const homePath = localeHomePath(locale);
  return (
    <section className="discovery" aria-labelledby="discovery-title">
      <div className="section-kicker">
        <span>01</span>
        <p id="discovery-title">{messages.discoveryTitle}</p>
      </div>
      <div className="discovery-links">
        {messages.discoveryLinks
          .filter((link) => isRecipeCollectionId(link.id))
          .map((link) => (
            <a key={link.id} href={`${homePath}?collection=${link.id}#recipes`}>
              {link.label}<ArrowRight aria-hidden="true" size={17} />
            </a>
          ))}
      </div>
    </section>
  );
}
