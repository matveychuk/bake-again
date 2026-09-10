import { ArrowRight } from 'lucide-react';
import type { AppLocale } from '@/lib/i18n/config';
import { getUiMessages } from '@/lib/i18n/messages';

export function HomeDiscovery({ locale }: { locale: AppLocale }) {
  const messages = getUiMessages(locale).home;
  return (
    <section className="discovery" aria-labelledby="discovery-title">
      <div className="section-kicker">
        <span>01</span>
        <p id="discovery-title">{messages.discoveryTitle}</p>
      </div>
      <div className="discovery-links">
        {messages.discoveryLinks.map((link) => (
          <a key={link} href="#recipes">{link}<ArrowRight aria-hidden="true" size={17} /></a>
        ))}
      </div>
    </section>
  );
}
