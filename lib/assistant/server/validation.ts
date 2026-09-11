import type { AppLocale } from '../../i18n/config.ts';

/** Defense in depth, not a natural-language truth or language detector.
 * Numeric facts bypass generated prose entirely and come from the evidence catalog.
 * These bounded checks reject obvious policy violations; the developer policy also
 * governs semantic claims that cannot be proved with a regular expression.
 */
export function validateAssistantProse(
  text: string,
  locale: AppLocale,
): boolean {
  for (const character of text) {
    const code = character.codePointAt(0)!;
    if ((code < 32 && code !== 9 && code !== 10) || code === 127) return false;
  }
  if (
    /\p{N}|[<>]|https?:|www\.|\[[^\]]+\]\([^)]+\)|[\u202a-\u202e\u2066-\u2069]/iu.test(
      text,
    )
  )
    return false;
  if (
    locale === 'uk'
      ? !/\p{Script=Cyrillic}/u.test(text)
      : /\p{Script=Cyrillic}/u.test(text)
  )
    return false;

  // Allow explicit uncertainty without permitting a positive verification claim.
  const claims = text.replace(
    /\bnot (?:bake-)?tested\b|\bno (?:está |se ha )?probad[oa]s?\b|не (?:випробуван|перевірен|тестован)\p{L}*/giu,
    '',
  );
  if (
    /(?<!\p{L})(?:tested|verified|proven|calculated|probad\p{L}*|comprobad\p{L}*|тестован\p{L}*|випробуван\p{L}*|перевірен\p{L}*)(?!\p{L})/iu.test(
      claims,
    )
  )
    return false;
  if (
    /(?<!\p{L})(?:one|two|three|four|five|six|seven|eight|nine|ten|half|double|twice|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|mitad|doble|один|одна|одну|два|дві|три|чотири|п'ять|шість|половин\p{L}*|подво\p{L}*)(?!\p{L})/iu.test(
      text,
    )
  )
    return false;
  if (
    /(?:cures?|treats?|prevents?)\s+(?:disease|diabetes|cancer)|healthier for everyone|safe for (?:everyone|all allergies)|cura\p{L}*\s+(?:enfermedad|diabetes|cáncer)|saludable para todos|seguro para todos|лікує|виліковує|корисн\p{L}* для всіх|безпечн\p{L}* для всіх/iu.test(
      text,
    )
  )
    return false;
  if (
    /\bI (?:have )?(?:baked|tested|changed|updated|saved)\b|\b(?:he horneado|he probado|he cambiado|he guardado)\b|я (?:випікав|випікала|готував|готувала|змінив|змінила|зберіг|зберегла)/iu.test(
      text,
    )
  )
    return false;
  return true;
}
