import { Calculator, Check, Lightbulb } from 'lucide-react';

export type EvidenceStatus = 'tested' | 'calculated' | 'suggested';

const evidence = {
  tested: { label: 'Tested', Icon: Check },
  calculated: { label: 'Calculated', Icon: Calculator },
  suggested: { label: 'Suggested', Icon: Lightbulb },
} satisfies Record<EvidenceStatus, { label: string; Icon: typeof Check }>;

type EvidenceBadgeProps = {
  status: EvidenceStatus;
  className?: string;
};

export function EvidenceBadge({ status, className }: EvidenceBadgeProps) {
  const { label, Icon } = evidence[status];
  return (
    <span className={className} data-status={status}>
      <Icon aria-hidden="true" size={16} strokeWidth={2} />
      <strong>{label}</strong>
    </span>
  );
}
