import { readFile, writeFile } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const css = await readFile(new URL('design-system/tokens.css', root), 'utf8');
const forms = JSON.parse(await readFile(new URL('lib/newsletter/brevo-forms.json', root), 'utf8'));
const token = (name) => {
  const value = css.match(new RegExp(`--${name}:\\s*([^;]+);`))?.[1];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
};
const px = (name) => `${Number.parseFloat(token(name)) * 16}px`;
const font = (name) => token(name).replace(/var\([^)]*\),\s*/g, '');
const buttonStyle = `display:inline-block;padding:${px('space-3')} ${px('space-4')};background:${token('color-action-primary')};color:${token('color-text-on-accent')};font-weight:bold;text-decoration:none;border-radius:${px('radius-control')};max-width:100%;box-sizing:border-box;`;
const shell = `<!doctype html><html lang="uk"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>[[title]]</title></head><body style="margin:0;background:${token('color-background-page')};color:${token('color-text-primary')};font-family:${font('font-family-body')};font-size:${px('font-size-body')};line-height:${token('line-height-body')};overflow-wrap:anywhere;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td style="padding:${px('space-4')};"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:${px('layout-assistant-drawer')};margin:auto;background:${token('color-background-surface')};"><tr><td style="padding:${px('space-6')};"><p style="margin:0 0 ${px('space-6')};font-weight:bold;">Bake Again</p><h1 style="font-family:${font('font-family-display-cyrillic')};font-size:${px('font-size-drawer-title')};line-height:${token('line-height-body')};">[[title]]</h1><p>[[intro]]</p>[[buttons]]<p>До зустрічі на кухні,<br>Саша · Bake Again</p><p style="font-size:${px('font-size-body-small')};color:${token('color-text-secondary')};">[[footer]]</p><p style="font-size:${px('font-size-body-small')};"><a href="https://bakeagain.com/uk/privacy" style="color:${token('color-action-primary-strong')};">Приватність</a>[[unsubscribe]]</p></td></tr></table></td></tr></table></body></html>`;
await writeFile(new URL('lib/newsletter/magnet-email.generated.ts', root), `// Generated from design-system/tokens.css. Run npm run newsletter:prepare.\nexport const magnetEmailShell = ${JSON.stringify(shell)};\nexport const magnetButtonStyle = ${JSON.stringify(buttonStyle)};\nexport const magnetUnsubscribeUrl = ${JSON.stringify(forms.settings.unsubscribeUrls.uk)};\n`);
const doi = shell.replaceAll('[[title]]','Підтвердь підписку').replace('[[intro]]','Один крок — і надішлемо запитаний рецепт на цю пошту.').replace('[[buttons]]',`<p><a href="{{ params.DOIurl }}" style="${buttonStyle}">Підтвердити й отримати рецепт</a></p>`).replace('[[footer]]','Натискаючи кнопку, ти погоджуєшся отримувати рецепти й матеріали Bake Again українською. Відписатися можна будь-коли. Якщо ти не залишала чи не залишав запит, просто не підтверджуй його.').replace('[[unsubscribe]]','');
await writeFile(new URL('lib/newsletter/templates/uk-magnet-double-opt-in.html',root),doi);
const copies = JSON.parse(await readFile(new URL('lib/newsletter/magnet-copy.json',root),'utf8'));
for (const [id, copy] of Object.entries(copies)) {
  const buttons=copy.links.map(link=>`<p><a href="https://bakeagain.com${link.href}" style="${buttonStyle}">${link.title}</a></p>`).join('');
  const html=shell.replaceAll('[[title]]',copy.title).replace('[[intro]]',copy.intro).replace('[[buttons]]',buttons)
    .replace('[[footer]]','Ти отримуєш цей лист, бо попросила чи попросив цей матеріал на сайті Bake Again. Нові рецепти надсилатимемо в межах твоєї підтвердженої підписки.')
    .replace('[[unsubscribe]]',` · <a href="${forms.settings.unsubscribeUrls.uk}" style="color:inherit;">Відписатися</a>`);
  await writeFile(new URL(`lib/newsletter/templates/uk-magnet-${id}.html`,root),html);
}
const indexPath=new URL('lib/newsletter/templates/index.html',root);
let index=await readFile(indexPath,'utf8');
index=index.replace(/<section id="magnet-emails">[\s\S]*?<\/section>/,'');
index=index.replace('</body>',`<section id="magnet-emails"><h2>Окрема видача рецептів</h2><ul><li><a href="uk-magnet-shokolad.html">Шоколадний торт</a></li><li><a href="uk-magnet-mlyntsi.html">Млинці й картка юного кухаря</a></li><li><a href="uk-magnet-double-opt-in.html">Підтвердження для API Brevo</a></li></ul></section></body>`);
await writeFile(indexPath,index);
console.log('Prepared recipe-delivery email shell and API DOI template. Nothing sent.');
