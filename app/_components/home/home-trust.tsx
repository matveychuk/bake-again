import { ArrowRight, Calculator, Check, Lightbulb } from 'lucide-react';
import { Eyebrow } from '@/components/foundations/eyebrow';

export function HomeTrust() {
  return (
    <section className="trust-section" aria-labelledby="trust-title">
      <div className="trust-intro">
        <div className="trust-mark" aria-hidden="true"><Check size={22} strokeWidth={2} /></div>
        <div className="trust-copy">
          <Eyebrow>Clear recipe status</Eyebrow>
          <h2 id="trust-title">Know what was baked — and what was only worked out.</h2>
        </div>
      </div>

      <div className="trust-statuses" aria-label="Recipe status guide">
        <div className="trust-status-row trust-status-row--tested">
          <span className="trust-status-badge"><Check aria-hidden="true" size={14} strokeWidth={2.3} /><strong>Tested</strong></span>
          <small>Baked as written.</small>
        </div>
        <div className="trust-status-row trust-status-row--calculated">
          <span className="trust-status-badge"><Calculator aria-hidden="true" size={14} strokeWidth={1.9} /><strong>Calculated</strong></span>
          <small>Quantities scaled. This version has not been bake-tested.</small>
        </div>
        <div className="trust-status-row trust-status-row--suggested">
          <span className="trust-status-badge"><Lightbulb aria-hidden="true" size={14} strokeWidth={1.9} /><strong>Suggested</strong></span>
          <small>An idea to try. This change has not been bake-tested.</small>
        </div>
      </div>

      <div className="trust-note">
        <p>Every recipe names the flour mix, form and quantity actually used. A tested original may still have a calculated variation.</p>
        <a href="#how-we-test">How we test recipes <ArrowRight aria-hidden="true" size={18} /></a>
      </div>
    </section>
  );
}
