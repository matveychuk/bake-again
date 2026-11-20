export const blogPath = '/uk/blog';

export function panettoneSignupPage(path: unknown) {
  if (path === '/uk/blog/psyllium') return 'blog-psyllium';
  if (path === '/uk/blog/xanthan-gum') return 'blog-xanthan-gum';
  return null;
}

/** Temporary campaign. Replace this config for the next offer after launch. */
export const panettoneCampaign = {
  id: 'panettone',
  showUntil: '2026-12-10',
  timeZone: 'Europe/Kyiv',
  // Verified in Brevo on 2026-11-17: «Панетоне — рецепт 10.12» (#13).
  listId: 13,
  image: '/images/articles/psyllium/panettone-crumb-v1.webp',
  imageAlt: "Шматок безглютенового панеттоне з цукатами — пористий м'якуш",
  eyebrow: 'Панеттоне без глютену · серія експериментів',
  title: 'Панеттоне без глютену — рецепт безкоштовно',
  subtitle: 'Надішлю на пошту 10 грудня',
  description: 'Залиш email — надішлю фінальну версію рецепта.',
  email: 'Твій email',
  submit: 'Хочу рецепт',
  consent:
    'Це підписка на розсилку Bake Again: рецепт панеттоне й інші рецепти. Відписатися можна будь-коли',
  thanks:
    'Дякую за підписку! 10 грудня рецепт прийде на цю адресу. Якщо не побачиш листа — зазирни в «Промоакції» або «Спам»',
} as const;

export function panettoneIsActive(locale: string, now = new Date()) {
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: panettoneCampaign.timeZone,
  }).format(now);
  return locale === 'uk' && today <= panettoneCampaign.showUntil;
}

export const psylliumArticle = {
  path: '/uk/blog/psyllium',
  title: 'Навіщо тісту псиліум',
  introduction:
    'Баночка меленого псиліуму є в нас удома, мабуть, уже років десять. А от думка додати його в тісто прийшла до мене значно пізніше.',
  description:
    'Як я вперше спекла безглютенову здобу на власній борошняній суміші з псиліумом і чому її м’якуш мене здивував. Як розрізнити ціле лушпиння й порошок.',
  blendImage: '/images/articles/psyllium/flour-blend-jars-v1.webp',
  blendAlt: 'Банки з тапіоковим крохмалем, рисовим і гречаним борошном та менша баночка меленого псиліуму біля миски',
  invitation: {
    title: 'Хочеш більше дізнатися про домашні безглютенові суміші?',
    description: 'Залиш свою електронну адресу. Я надсилатиму тобі рецепти й статті про безглютенову випічку.',
    action: 'Підписатися',
  },
  cover: '/images/articles/psyllium/whole-vs-powder-v1.webp',
  coverAlt: 'Світлі пластівці псиліуму ліворуч і дрібний порошок праворуч',
  cardImage: '/images/articles/psyllium/yeast-bun-crumb-v1.webp',
  cardAlt:
    'Дві половинки здобної булочки розтягують, відкриваючи пористу м’якушку',
  gel: '/images/articles/psyllium/husks-and-gel-v1.webp',
  gelAlt:
    'Сухе лушпиння псиліуму в керамічній мисці та гель із нього у скляній',
  forms: [
    {
      title: 'Ціле лушпиння',
      label: 'Whole Psyllium Husks',
      spanish: 'Cáscaras de psyllium enteras',
      iherb:
        'https://es.iherb.com/pr/now-foods-certified-organic-whole-psyllium-husks-12-oz-340-g/21117',
    },
    {
      title: 'Мелений псиліум',
      label: 'Psyllium Husk Powder',
      spanish: 'Cáscara de psyllium en polvo',
      iherb:
        'https://es.iherb.com/pr/now-foods-psyllium-husk-powder-12-oz-340-g/8934',
    },
  ],
} as const;
