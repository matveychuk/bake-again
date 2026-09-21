import { ArrowRight, Calculator, Check, Lightbulb } from 'lucide-react';
import { Eyebrow } from '@/components/foundations/eyebrow';
import type { AppLocale } from '@/lib/i18n/config';
import { getUiMessages } from '@/lib/i18n/messages';
import { localeAboutPath } from '@/lib/i18n/routes';

export function HomeTrust({ locale }: { locale: AppLocale }) {
  const messages = getUiMessages(locale);
  const home = messages.home;
  return (
    <section className="trust-section" aria-labelledby="trust-title">
      <div className="trust-intro">
        <div className="trust-mark" aria-hidden="true"><Check size={22} strokeWidth={2} /></div>
        <div className="trust-copy">
          <Eyebrow>{home.trustEyebrow}</Eyebrow>
          <h2 id="trust-title">{home.trustTitle}</h2>
        </div>
      </div>

      <div className="trust-statuses" aria-label={home.trustGuide}>
        <div className="trust-status-row trust-status-row--tested">
          <span className="trust-status-badge"><Check aria-hidden="true" size={14} strokeWidth={2.3} /><strong>{messages.status.tested.label}</strong></span>
          <small>{home.testedExplanation}</small>
        </div>
        <div className="trust-status-row trust-status-row--calculated">
          <span className="trust-status-badge"><Calculator aria-hidden="true" size={14} strokeWidth={1.9} /><strong>{messages.status.calculated.label}</strong></span>
          <small>{messages.status.calculated.explanation}</small>
        </div>
        <div className="trust-status-row trust-status-row--suggested">
          <span className="trust-status-badge"><Lightbulb aria-hidden="true" size={14} strokeWidth={1.9} /><strong>{messages.status.suggested.label}</strong></span>
          <small>{messages.status.suggested.explanation}</small>
        </div>
      </div>

      <div className="trust-note">
        <p>{home.trustNote}</p>
        <a href={`${localeAboutPath(locale)}#how-we-test`}>{home.howWeTest} <ArrowRight aria-hidden="true" size={18} /></a>
      </div>
    </section>
  );
}
