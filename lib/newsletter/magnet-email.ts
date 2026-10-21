import { magnetButtonStyle, magnetEmailShell, magnetUnsubscribeUrl } from './magnet-email.generated.ts';
import { magnetDelivery, type MagnetId } from './magnets.ts';
const escape = (text: string) => text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function recipeEmail(magnet: MagnetId) {
  const copy = magnetDelivery[magnet];
  const buttons = copy.links.map(link => `<p><a href="https://bakeagain.com${link.href}" style="${magnetButtonStyle}">${escape(link.title)}</a></p>`).join('');
  return {
    subject: copy.subject,
    htmlContent: magnetEmailShell.replaceAll('[[title]]',escape(copy.title)).replace('[[intro]]',escape(copy.intro)).replace('[[buttons]]',buttons)
      .replace('[[footer]]','Ти отримуєш цей лист, бо попросила чи попросив цей матеріал на сайті Bake Again. Нові рецепти надсилатимемо в межах твоєї підтвердженої підписки.')
      .replace('[[unsubscribe]]',` · <a href="${escape(magnetUnsubscribeUrl)}" style="color:inherit;">Відписатися</a>`),
    textContent: `${copy.title}\n\n${copy.intro}\n\n${copy.links.map(l=>`${l.title}: https://bakeagain.com${l.href}`).join('\n\n')}\n\nСаша · Bake Again\nПриватність: https://bakeagain.com/uk/privacy\nВідписатися: ${magnetUnsubscribeUrl}`,
  };
}
