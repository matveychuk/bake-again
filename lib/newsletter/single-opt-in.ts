import records from './brevo-forms.json' with { type: 'json' };
import {
  productLocale, leadMagnetRegistry,
  leadMagnetPath,
} from '../../content/lead-magnets.ts';
import type { MagnetId } from './magnets.ts';

export type SubscriptionPlacement = 'landing' | 'recipe';
const config = records.providerRecords.singleOptin;
/** Only fixed, reviewed destinations/attributes can reach the provider. */
export function recipeSubscription(
  magnet: MagnetId,
  placement: SubscriptionPlacement = 'landing',
) {
  const bonusListId = (config.bonusListIds as Record<string, number>)[magnet];
  if (!Number.isSafeInteger(bonusListId))
    throw new Error('Bonus list is not configured');
  const locale = productLocale(magnet);
  const product = leadMagnetRegistry[magnet];
  if (placement === 'landing' && !('bot' in product)) throw new Error('No landing page');
  const invitation = 'recipeInvitation' in product ? product.recipeInvitation : undefined;
  if (placement === 'recipe' && !invitation)
    throw new Error('Recipe placement is not configured');
  return {
    listIds: [config.masterListId, config.localeListIds[locale], bonusListId],
    attributes: {
      SOURCE: 'website',
      SIGNUP_PAGE:
        placement === 'recipe' && 'recipePath' in product
          ? product.recipePath
          : leadMagnetPath(magnet),
      SIGNUP_POSITION:
        placement === 'recipe'
          ? `after-${invitation!.afterStepId}`
          : 'lead-magnet-page',
    },
  };
}
export function isSuppressed(
  contact: { emailBlacklisted?: boolean; listUnsubscribed?: number[] } | null,
) {
  return (
    contact?.emailBlacklisted === true ||
    !!contact?.listUnsubscribed?.some((id) =>
      [
        config.masterListId,
        ...Object.values(config.localeListIds),
        ...Object.values(config.bonusListIds),
      ].includes(id),
    )
  );
}
