export type LeadMagnetDefinition = {
  page: { title: string; subtitle: string; features: string[]; image: string; imageAlt: string; note: string };
  email: { subject: string; title: string; intro: string; links: { title: string; href: string }[]; confirmation: string; delivered: string };
  bot: { keyword: string; message: string; button: string };
};

/** Fixed public configuration only. A visitor can never supply delivery URLs. */
export function validateLeadMagnetRegistry(input: unknown): asserts input is Record<string, LeadMagnetDefinition> {
  const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
  const text = (v: unknown): v is string => typeof v === 'string' && !!v.trim() && Array.from(v).every(char => char.charCodeAt(0) >= 32);
  const fail = (id: string, field: string): never => { throw new Error(`Invalid lead magnet ${id}: ${field}`); };
  if (!object(input) || !Object.keys(input).length) fail('registry', 'empty');
  const keywords = new Set<string>();
  for (const [id, value] of Object.entries(input as Record<string, unknown>)) {
    if (!/^[a-z][a-z0-9-]{0,63}$/.test(id) || ['constructor', 'prototype'].includes(id)) fail(id, 'id');
    if (!object(value)) fail(id, 'definition');
    const { page, email, bot } = value as Record<string, unknown>;
    if (!object(page) || !object(email) || !object(bot)) fail(id, 'sections');
    const p = page as Record<string, unknown>, e = email as Record<string, unknown>, b = bot as Record<string, unknown>;
    for (const field of ['title', 'subtitle', 'image', 'imageAlt', 'note']) if (!text(p[field])) fail(id, `page.${field}`);
    if (!Array.isArray(p.features) || !p.features.length || !p.features.every(text)) fail(id, 'features');
    if (!/^\/(?:images|media)\/[a-zA-Z0-9/_-]+\.webp$/.test(String(p.image))) fail(id, 'image');
    for (const field of ['subject', 'title', 'intro', 'confirmation', 'delivered']) if (!text(e[field])) fail(id, `email.${field}`);
    if (!Array.isArray(e.links) || !e.links.length) fail(id, 'links');
    for (const link of e.links as unknown[]) {
      if (!object(link) || !text(link.title) || !/^\/downloads\/[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(String(link.href))) fail(id, 'link');
    }
    for (const field of ['keyword', 'message', 'button']) if (!text(b[field])) fail(id, `bot.${field}`);
    const keyword = String(b.keyword).trim().toLocaleLowerCase('uk');
    if (keywords.has(keyword)) fail(id, 'duplicate keyword');
    keywords.add(keyword);
  }
}
