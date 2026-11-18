export type LeadMagnetDefinition = {
  locale?: string;
  recipePath?: string;
  recipeInvitation?: {
    recipeId: string;
    afterStepId: string;
    title: string;
    description: string;
    submit: string;
    note?: string;
    previews?: {
      src: string;
      alt: string;
      title: string;
      description: string;
      href: string;
      linkLabel: string;
    }[];
  };
  page: {
    title: string;
    subtitle: string;
    features: string[];
    image: string;
    imageAlt: string;
    note: string;
  };
  email: {
    subject: string;
    title: string;
    intro: string;
    links: { title: string; href: string }[];
    confirmation: string;
    delivered: string;
  };
  bot?: { keyword: string; message: string; button: string };
};

/** Fixed public configuration only. A visitor can never supply delivery URLs. */
export function validateLeadMagnetRegistry(
  input: unknown,
): asserts input is Record<string, LeadMagnetDefinition> {
  const object = (v: unknown): v is Record<string, unknown> =>
    !!v && typeof v === 'object' && !Array.isArray(v);
  const text = (v: unknown): v is string =>
    typeof v === 'string' &&
    !!v.trim() &&
    Array.from(v).every((char) => char.charCodeAt(0) >= 32);
  const fail = (id: string, field: string): never => {
    throw new Error(`Invalid lead magnet ${id}: ${field}`);
  };
  if (!object(input) || !Object.keys(input).length) fail('registry', 'empty');
  const keywords = new Set<string>();
  for (const [id, value] of Object.entries(input as Record<string, unknown>)) {
    if (
      !/^[a-z][a-z0-9-]{0,63}$/.test(id) ||
      ['constructor', 'prototype'].includes(id)
    )
      fail(id, 'id');
    if (!object(value)) fail(id, 'definition');
    const { page, email, bot, recipeInvitation } = value as Record<
      string,
      unknown
    >;
    if (recipeInvitation !== undefined) {
      if (!object(recipeInvitation)) fail(id, 'recipeInvitation');
      for (const field of [
        'recipeId',
        'afterStepId',
        'title',
        'description',
        'submit',
      ])
        if (!text((recipeInvitation as Record<string, unknown>)[field]))
          fail(id, `recipeInvitation.${field}`);
      const invitation = recipeInvitation as Record<string, unknown>;
      if (invitation.note !== undefined && !text(invitation.note))
        fail(id, 'recipeInvitation.note');
      if (invitation.previews !== undefined) {
        if (!Array.isArray(invitation.previews) || !invitation.previews.length)
          fail(id, 'recipeInvitation.previews');
        for (const preview of invitation.previews as Record<
          string,
          unknown
        >[]) {
          if (
            !object(preview) ||
            !['src', 'alt', 'title', 'description', 'href', 'linkLabel'].every(
              (field) => text(preview[field]),
            )
          )
            fail(id, 'recipeInvitation.preview');
          if (!/^\/images\/[a-zA-Z0-9/_-]+\.webp$/.test(String(preview.src)))
            fail(id, 'recipeInvitation.preview.src');
          if (
            !/^\/(?:images\/[a-zA-Z0-9/_-]+\.webp|downloads\/[a-zA-Z0-9_-]+\.pdf)$/.test(
              String(preview.href),
            )
          )
            fail(id, 'recipeInvitation.preview.href');
        }
      }
    }
    if (!object(page) || !object(email) || (!object(bot) && !recipeInvitation)) fail(id, 'sections');
    const p = page as Record<string, unknown>,
      e = email as Record<string, unknown>,
      b = bot as Record<string, unknown>;
    for (const field of ['title', 'subtitle', 'image', 'imageAlt', 'note'])
      if (!text(p[field])) fail(id, `page.${field}`);
    if (
      !Array.isArray(p.features) ||
      !p.features.length ||
      !p.features.every(text)
    )
      fail(id, 'features');
    if (!/^\/(?:images|media)\/[a-zA-Z0-9/_-]+\.webp$/.test(String(p.image)))
      fail(id, 'image');
    for (const field of [
      'subject',
      'title',
      'intro',
      'confirmation',
      'delivered',
    ])
      if (!text(e[field])) fail(id, `email.${field}`);
    if (!Array.isArray(e.links) || !e.links.length) fail(id, 'links');
    for (const link of e.links as unknown[]) {
      if (
        !object(link) ||
        !text(link.title) ||
        !/^\/downloads\/[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(String(link.href))
      )
        fail(id, 'link');
    }
    const { locale = 'uk', recipePath } = value as LeadMagnetDefinition;
    if (!['uk', 'es', 'en'].includes(locale)) fail(id, 'locale');
    if (recipeInvitation && (typeof recipePath !== 'string' || !new RegExp('^/' + locale + '/recipes/[a-z0-9-]+$').test(recipePath))) fail(id, 'recipePath');
    if (bot === undefined) continue;
    if (!object(bot)) fail(id, 'bot');
    for (const field of ['keyword', 'message', 'button'])
      if (!text(b[field])) fail(id, `bot.${field}`);
    const keyword = String(b.keyword).trim().toLocaleLowerCase('uk');
    if (keywords.has(keyword)) fail(id, 'duplicate keyword');
    keywords.add(keyword);
  }
}
