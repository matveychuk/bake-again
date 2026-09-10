import { Calculator, Check, Lightbulb } from 'lucide-react';
import type { AppLocale } from '@/lib/i18n/config';
import { getUiMessages } from '@/lib/i18n/messages';

export type EvidenceStatus = 'tested' | 'calculated' | 'suggested';

const evidence = {
  tested: Check,
  calculated: Calculator,
  suggested: Lightbulb,
} satisfies Record<EvidenceStatus, typeof Check>;

type EvidenceBadgeProps = {
  status: EvidenceStatus;
  className?: string;
  locale?: AppLocale;
};

export function EvidenceBadge({ status, className, locale = 'en' }: EvidenceBadgeProps) {
  const Icon = evidence[status];
  const label = getUiMessages(locale).status[status].label;
  return (
    <span className={className} data-status={status}>
      <Icon aria-hidden="true" size={16} strokeWidth={2} />
      <strong>{label}</strong>
    </span>
  );
}
