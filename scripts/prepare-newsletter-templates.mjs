import { readFile, mkdir, writeFile } from 'node:fs/promises';

// Preparation only: no provider credentials, network calls or email sends.
const source = JSON.parse(await readFile(new URL('../lib/newsletter/brevo-forms.json', import.meta.url), 'utf8'));
const css = await readFile(new URL('../design-system/tokens.css', import.meta.url), 'utf8');
function token(name) {
  const value = css.match(new RegExp(`--${name}:\\s*([^;]+);`))?.[1];
  if (!value) throw new Error(`Missing design token: ${name}`);
  return value;
}
function pixels(name) { return `${Number.parseFloat(token(name)) * 16}px`; }
function emailFont(name) { return token(name).replace(/var\([^)]*\),\s*/g, ''); }
const escape = (text) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const output = new URL('../lib/newsletter/templates/', import.meta.url);
await mkdir(output, { recursive: true });
for (const [locale, copy] of Object.entries(source.locales)) {
  const html = `<!doctype html>
<html lang="${locale}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(copy.confirmation.subject)}</title></head>
<body style="margin:0;background:${token('color-background-page')};color:${token('color-text-primary')};font-family:${emailFont('font-family-body')};font-size:${pixels('font-size-body')};line-height:${token('line-height-body')};">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td style="padding:${pixels('space-6')};">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:${pixels('layout-assistant-drawer')};margin:auto;background:${token('color-background-surface')};"><tr><td style="padding:${pixels('space-6')};">
<p style="margin:0 0 ${pixels('space-6')};font-weight:bold;">Bake Again</p>
<h1 style="margin:0 0 ${pixels('space-4')};font-family:${emailFont('font-family-display')};font-size:${pixels('font-size-drawer-title')};">${escape(copy.confirmation.title)}</h1>
<p>${escape(copy.confirmation.body)}</p>
<p>${escape(copy.confirmation.consent ?? copy.signup.consent)}</p>
<p><a href="${copy.privacyUrl}" style="color:${token('color-action-primary-strong')};">${escape(copy.signup.privacyLabel)}</a></p>
<p style="margin:${pixels('space-6')} 0;"><a href="{{ doubleoptin }}" style="display:inline-block;padding:${pixels('space-3')} ${pixels('space-4')};background:${token('color-action-primary')};color:${token('color-text-on-accent')};font-weight:bold;text-decoration:none;border-radius:${pixels('radius-control')};">${escape(copy.confirmation.action)}</a></p>
</td></tr></table>
</td></tr></table>
</body></html>
`;
  await writeFile(new URL(`${locale}-double-opt-in.html`, output), html);
}
// Campaign variant of the existing table-based email composition. Tokens are
// resolved into inline values because email clients do not share the site's CSS.
const newsletterCopy = JSON.parse(await readFile(new URL('../lib/newsletter/newsletter-template-copy.json', import.meta.url), 'utf8'));
const welcomeCopy = JSON.parse(await readFile(new URL('../lib/newsletter/welcome-template-copy.json', import.meta.url), 'utf8'));
const previewLinks = [];
const authCopy = JSON.parse(await readFile(new URL('../lib/personal/auth-email-copy.json', import.meta.url), 'utf8'));
const authOutput = new URL('../lib/personal/email-templates/', import.meta.url);
await mkdir(authOutput, { recursive: true });
const recoveryCopy = JSON.parse(await readFile(new URL('../lib/personal/recovery-email-copy.json', import.meta.url), 'utf8'));
const authTemplates = { confirmation: {}, recovery: {} };
// Auth is a variant of the same email composition, without marketing consent or unsubscribe.
for (const [locale, copy, authKind, isWelcome] of [
  ...Object.entries(newsletterCopy).map(([locale, copy]) => [locale, copy, null]),
  ...Object.entries(welcomeCopy).map(([locale, copy]) => [locale, { ...newsletterCopy[locale], ...copy }, null, true]),
  ...Object.entries(authCopy).map(([locale, copy]) => [locale, copy, 'confirmation']),
  ...Object.entries(recoveryCopy).map(([locale, copy]) => [locale, copy, 'recovery']),
]) {
  const isAuth = Boolean(authKind);
  // Fragment keeps the one-use token out of HTTP logs/referrers. The account
  // client consumes it with verifyOtp; no originating browser verifier is needed.
  const authLink = `{{ .RedirectTo }}#token_hash={{ .TokenHash }}&amp;type=${authKind === 'recovery' ? 'recovery' : 'email'}`;
  const displayFont = emailFont(locale === 'uk' ? 'font-family-display-cyrillic' : 'font-family-display');
  const home = `https://bakeagain.com/${locale}`;
  const bodyText = `margin:0 0 ${pixels('space-6')};font-family:${emailFont('font-family-body')};font-size:${pixels('font-size-body')};line-height:${token('line-height-body')};color:${token('color-text-primary')};`;
  const html = `<!doctype html>
<html lang="${locale}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(copy.subject)}</title>
<style>a:focus-visible{outline:2px solid ${token('color-action-primary-strong')};outline-offset:${pixels('space-1')};}@media(max-width:480px){.email-outer{padding:${pixels('space-4')} !important;}.email-inner{padding:${pixels('space-6')} !important;}}</style></head>
<body style="margin:0;padding:0;background-color:${token('color-background-page')};color:${token('color-text-primary')};font-family:${emailFont('font-family-body')};">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${escape(copy.preheader)}</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="${token('color-background-page')}" style="background-color:${token('color-background-page')};"><tr><td class="email-outer" align="center" style="padding:${pixels('space-8')} ${pixels('space-4')};">
<!--[if mso]><table role="presentation" width="480" align="center"><tr><td><![endif]-->
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="${token('color-background-surface')}" style="width:100%;max-width:${pixels('layout-assistant-drawer')};background-color:${token('color-background-surface')};">
<tr><td class="email-inner" style="padding:${pixels('space-8')};border-top:${pixels('space-1')} solid ${token('color-action-primary')};">
<p style="margin:0 0 ${pixels('space-8')};font-family:${displayFont};font-size:${pixels('font-size-section-title-mobile')};line-height:${token('line-height-tight')};font-weight:bold;color:${token('color-text-primary')};">Bake Again<span style="color:${token('color-action-primary')};">.</span></p>
<p style="margin:0 0 ${pixels('space-3')};font-family:${emailFont('font-family-body')};font-size:${pixels('font-size-body-small')};line-height:${token('line-height-body')};color:${token('color-text-secondary')};">${escape(copy.eyebrow)}</p>
<h1 style="margin:0 0 ${pixels('space-6')};font-family:${displayFont};font-size:${pixels('font-size-section-title-mobile')};line-height:${token('line-height-body')};font-weight:normal;color:${token('color-text-primary')};">${escape(copy.title)}</h1>
<p style="${bodyText}">${escape(copy.greeting)}</p>
<p style="${bodyText}">${escape(copy.body)}</p>
<p style="${bodyText}">${escape(copy.note)}</p>
<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 ${pixels('space-8')};"><tr><td bgcolor="${token('color-action-primary')}" style="background-color:${token('color-action-primary')};border-radius:${pixels('radius-control')};"><a href="${isAuth ? authLink : `${home}#recipes`}" style="display:inline-block;padding:${pixels('space-3')} ${pixels('space-6')};border:1px solid ${token('color-action-primary')};border-radius:${pixels('radius-control')};font-family:${emailFont('font-family-body')};font-size:${pixels('font-size-body')};line-height:${token('line-height-body')};font-weight:bold;text-decoration:none;color:${token('color-text-on-accent')};">${escape(copy.action)}</a></td></tr></table>
<p style="margin:0;font-family:${emailFont('font-family-body')};font-size:${pixels('font-size-body')};line-height:${token('line-height-body')};color:${token('color-text-secondary')};">${escape(copy.signature)}<br><strong style="color:${token('color-text-primary')};">Bake Again</strong></p>
</td></tr>
<tr><td class="email-inner" bgcolor="${token('color-background-panel-subtle')}" style="padding:${pixels('space-6')} ${pixels('space-8')};background-color:${token('color-background-panel-subtle')};font-family:${emailFont('font-family-body')};font-size:${pixels('font-size-body-small')};line-height:${token('line-height-body')};color:${token('color-text-secondary')};">
<p style="margin:0 0 ${pixels('space-4')};">${escape(copy.subscriptionNote)}</p>
<p style="margin:0;"><a href="${home}/privacy" style="color:${token('color-action-primary-strong')};text-decoration:underline;">${escape(copy.privacy)}</a>${isAuth ? '' : `<br><a href="{{ unsubscribe }}" style="color:${token('color-action-primary-strong')};text-decoration:underline;">${escape(copy.unsubscribe)}</a>`}</p>
</td></tr></table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr></table>
</body></html>
`;
  if (isAuth) {
    authTemplates[authKind][locale] = html;
    await writeFile(new URL(`${locale}-${authKind}-preview.html`, authOutput), html.replace(authLink, '#email-preview'));
    continue;
  }
  const variant = isWelcome ? 'welcome' : 'newsletter';
  await writeFile(new URL(`${locale}-${variant}.html`, output), html);
  previewLinks.push(`<li><a href="${locale}-${variant}.html">${locale.toUpperCase()} — ${variant}</a>${isWelcome ? '' : ` · <a href="${locale}-double-opt-in.html">DOI</a>`}</li>`);
}
await writeFile(new URL('index.html', output), `<!doctype html><html lang="uk"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Bake Again — Email Design Lab</title><body style="margin:${pixels('space-8')};background:${token('color-background-page')};color:${token('color-text-primary')};font-family:${emailFont('font-family-body')};line-height:${token('line-height-body')};"><h1 style="font-family:${emailFont('font-family-display-cyrillic')};">Bake Again — Email Design Lab</h1><p>Локальні приклади. Нічого не надсилають. Посилання відписки в прев’ю не активне.</p><ul>${previewLinks.join('')}</ul></body></html>\n`);
console.log('Prepared 3 DOI, 3 newsletter and 3 welcome templates plus the local Email Design Lab; nothing sent.');

// Metadata selects only fixed, escaped copy. It is never an authorization claim.
function localized(values) {
  return `{{ if eq .Data.locale "es" }}${values.es}{{ else if eq .Data.locale "en" }}${values.en}{{ else }}${values.uk}{{ end }}`;
}
await writeFile(new URL('confirm-signup.html', authOutput), localized(authTemplates.confirmation));
await writeFile(new URL('confirm-signup-subject.txt', authOutput), localized(Object.fromEntries(Object.entries(authCopy).map(([locale, copy]) => [locale, copy.subject]))));
await writeFile(new URL('reset-password.html', authOutput), localized(authTemplates.recovery));
await writeFile(new URL('reset-password-subject.txt', authOutput), localized(Object.fromEntries(Object.entries(recoveryCopy).map(([locale, copy]) => [locale, copy.subject]))));
await writeFile(new URL('index.html', authOutput), `<!doctype html><html lang="uk"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bake Again — Auth Email Design Lab</title><body><h1>Службові листи акаунта</h1><p>Локальні приклади. Кнопка не підтверджує акаунт і не надсилає листів.</p><ul>${['uk','es','en'].map(locale => `<li><a href="${locale}-confirmation-preview.html">${locale.toUpperCase()} — підтвердження</a> · <a href="${locale}-recovery-preview.html">відновлення пароля</a></li>`).join('')}</ul></body></html>`);
console.log('Prepared localized Supabase confirmation/recovery and 6 inert auth previews; nothing sent.');
