import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  CONSENT_KEY,
  CONSENT_VERSION,
  readConsent,
  saveConsent,
  metaCookieDeletions,
} from './consent.ts';
import {
  metaConfig,
  metaAllowed,
  isMetaSafeUrl,
  metaContentEvent,
  metaLeadEvent,
  metaBuyEvent,
  hideConsentBanner,
  lessonPrice,
} from './meta-policy.ts';
import {
  videoLessons,
  type VideoLesson,
} from '../../content/commerce/video-lessons.ts';
import { recipeSlugs } from '../i18n/recipe-slugs.ts';
import { cookieCopy } from '../../content/cookies.ts';

const origin = 'https://bakeagain.com';
const id = '477724239421268';
function memory() {
  const data = new Map<string, string>();
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
  };
}
const offer: VideoLesson = {
  id: 'napoleon-video',
  recipeId: 'gluten-free-napoleon',
  recipeVersionId: 'v6',
  language: 'uk',
  status: 'available',
  deliveryUrl: '/uk/urok/napoleon',
  payhipUrl: 'https://payhip.com/b/Real9',
  priceMinor: 1234,
  currency: 'EUR',
};

void test('consent persists both decisions, expires at 12 months, and rejects old versions/corrupt/future data', () => {
  const storage = memory();
  const now = Date.UTC(2026, 10, 6);
  assert.equal(readConsent(storage, now), null);
  for (const ads of ['granted', 'denied'] as const) {
    assert.deepEqual(saveConsent(storage, ads, now), {
      ads,
      v: CONSENT_VERSION,
      ts: now,
    });
    assert.equal(readConsent(storage, now + 1000)?.ads, ads);
    assert.equal(readConsent(storage, Date.UTC(2027, 10, 6)), null);
  }
  for (const value of [
    'nope',
    '{}',
    JSON.stringify({ ads: 'granted', v: 0, ts: now }),
    JSON.stringify({ ads: 'granted', v: 1, ts: now }),
    JSON.stringify({ ads: 'granted', v: CONSENT_VERSION, ts: now + 1 }),
    JSON.stringify({ ads: 'yes', v: CONSENT_VERSION, ts: now }),
  ]) {
    storage.setItem(CONSENT_KEY, value);
    assert.equal(readConsent(storage, now), null);
  }
  const unavailable = {
    getItem() {
      throw Error('blocked');
    },
    setItem() {
      throw Error('quota');
    },
  };
  assert.equal(readConsent(unavailable), null);
  assert.equal(saveConsent(unavailable, 'denied', now).ads, 'denied');
});

void test('Meta is production-only, requires an ID, follows Umami exclusions and DNT', () => {
  for (const hostname of [
    'localhost',
    '127.0.0.1',
    'preview.bakeagain.com',
    'qa.bakeagain.com',
    'bake-again.workers.dev',
  ])
    assert.equal(metaAllowed(id, `https://${hostname}/uk`), false);
  for (const path of [
    '/uk/account?code=private',
    '/design-system',
    '/uk/drafts',
    '/uk/urok/napoleon/kupyty',
  ])
    assert.equal(metaAllowed(id, origin + path), false);
  assert.equal(metaAllowed(id, origin + '/uk', '1'), false);
  assert.equal(metaAllowed('', origin + '/uk'), false);
  assert.equal(metaAllowed(id, origin + '/uk'), true);
  assert.equal(metaConfig({ META_PIXEL_ID: id }).pixelId, id);
  assert.equal(
    metaConfig({ META_DOMAIN_VERIFICATION: '  domain-proof  ' })
      .domainVerification,
    'domain-proof',
  );
  assert.equal(metaConfig({}).domainVerification, '');
  for (const value of ['', '<477724239421268>', 'private@address.test', null])
    assert.equal(metaConfig({ META_PIXEL_ID: value }).pixelId, '');
});

void test('full URL protection: callbacks, checkout, claim, encoded identity, search and sensitive referrers', () => {
  for (const path of [
    '/uk/account?code=secret',
    '/uk/urok/napoleon?code=secret',
    '/uk/urok/napoleon#access_token=secret',
    '/uk/urok/napoleon#lesson_access=secret',
    '/uk/urok/napoleon?token_hash=secret&type=email',
    '/uk/urok/napoleon/kupyty',
    '/uk/urok/napoleon?ba_checkout=secret',
    '/uk/urok/napoleon?claim=secret',
    '/uk?src=person%40example.com',
    '/uk?src=person%2540example.com',
    '/uk?email=person',
    '/uk?q=private-search',
    '/uk?redirect=https%3A%2F%2Fexample.com%3Ftoken%3Dsecret',
  ]) {
    assert.equal(isMetaSafeUrl(origin + path), false, path);
    assert.equal(metaAllowed(id, origin + path), false, path);
  }
  assert.equal(
    metaAllowed(id, origin + '/uk', null, origin + '/uk/account?code=secret'),
    false,
  );
  for (const path of [
    '/uk?src=instagram',
    '/uk?utm_source=facebook&fbclid=public-click_123',
    '/uk/urok/napoleon#s03-short-mix',
    '/uk/urok/napoleon?purchase=opened',
    '/uk/recipes/bezghliutenovyi-napoleon?mode=scale&scale=2',
  ])
    assert.equal(metaAllowed(id, origin + path), true, path);
  assert.equal(isMetaSafeUrl(origin + '/uk?src=%xx'), false);
});

void test('recipe identities and localized slugs are allowlisted; cook pages have no ViewContent', () => {
  for (const [recipeId, slugs] of Object.entries(recipeSlugs))
    for (const [locale, slug] of Object.entries(slugs)) {
      assert.deepEqual(metaContentEvent(`/${locale}/recipes/${slug}`), {
        method: 'track',
        name: 'ViewContent',
        data: {
          content_type: 'recipe',
          content_ids: [recipeId],
          content_name: slug,
          content_category: 'recipe',
        },
      });
      assert.equal(metaContentEvent(`/${locale}/recipes/${slug}/cook`), null);
    }
  assert.equal(metaContentEvent('/uk/recipes/not-a-recipe'), null);
});

void test('lesson price comes from catalog, including Sasha’s approved €9 while planned', () => {
  assert.deepEqual(lessonPrice(), { value: 9, currency: 'EUR' });
  const event = metaContentEvent('/uk/urok/napoleon', 'description', [offer]);
  assert.equal(event?.data?.value, 12.34);
  assert.equal(event?.data?.currency, 'EUR');
  assert.equal(metaContentEvent('/uk/urok/napoleon', 'login', [offer]), null);
  assert.equal(metaContentEvent('/uk/urok/napoleon', 'lesson', [offer]), null);
  assert.equal(metaContentEvent('/uk/urok/napoleon', 'description', []), null);
  assert.equal(metaBuyEvent(videoLessons), null); // Price approval does not activate sales.
  assert.deepEqual(metaBuyEvent([offer]), {
    method: 'trackCustom',
    name: 'LessonBuyClick',
    data: { value: 12.34, currency: 'EUR' },
  });
});

void test('Lead uses only reviewed category, magnet ID or fixed block position', () => {
  assert.deepEqual(metaLeadEvent({ placement: 'landing' }), {
    method: 'track',
    name: 'Lead',
    data: { content_category: 'newsletter', content_name: 'landing' },
  });
  assert.equal(
    metaLeadEvent({ placement: 'landing', scenario: 'lesson' })?.data
      ?.content_category,
    'lesson',
  );
  assert.equal(
    metaLeadEvent({ magnetId: 'shokolad' })?.data?.content_category,
    'bonus',
  );
  assert.equal(
    metaLeadEvent({ magnetId: 'shokolad' })?.data?.content_name,
    'shokolad',
  );
  assert.equal(metaLeadEvent({ placement: 'private@address.test' }), null);
  assert.equal(metaLeadEvent({ magnetId: 'unknown' }), null);
  const form = readFileSync(
    new URL('../../components/site/newsletter-form.tsx', import.meta.url),
    'utf8',
  );
  const accepted = form.indexOf("throw new Error('Signup unavailable')");
  assert(
    accepted > 0 &&
      form.indexOf('trackMetaLead({') > accepted &&
      form.indexOf('trackMetaLead({') < form.indexOf('} catch', accepted),
  );
});

void test('banner exceptions, cookie deletion and approved copy', () => {
  for (const path of [
    '/uk/recipes/crepes/cook',
    '/uk/print',
    '/en/thank-you',
    '/es/gracias',
    '/uk/subscribed',
    '/uk/recept-confirmed',
  ])
    assert.equal(hideConsentBanner(path, ''), true);
  assert.equal(hideConsentBanner('/uk/recipes/crepes', '?print=1'), true);
  assert.equal(hideConsentBanner('/uk/recipes/crepes', '?view=print'), true);
  assert.equal(hideConsentBanner('/uk/urok/napoleon', ''), false);
  const deletions = metaCookieDeletions('bakeagain.com', '/uk/urok/napoleon');
  for (const name of ['_fbp', '_fbc']) {
    assert(
      deletions.includes(`${name}=; Max-Age=0; Path=/; SameSite=Lax; Secure`),
    );
    assert(
      deletions.includes(
        `${name}=; Max-Age=0; Path=/; Domain=.bakeagain.com; SameSite=Lax; Secure`,
      ),
    );
  }
  assert.equal(cookieCopy.uk.accept, 'Прийняти');
  assert.equal(cookieCopy.uk.decline, 'Відхилити');
});

void test('runtime: no SDK before consent; one init and PageView; withdrawal and unsafe navigation stop events', async () => {
  const store = memory();
  const events: unknown[][] = [];
  const scripts: Array<{ id: string; onload: () => void }> = [];
  const browser = new EventTarget() as EventTarget & {
    fbq?: {
      callMethod?: (...args: unknown[]) => void;
      disablePushState: boolean;
    };
    location: URL;
  };
  browser.location = new URL(origin + '/uk');
  let lessonState: string | null = null;
  const cookies: string[] = [];
  const doc = {
    referrer: '',
    get cookie() {
      return '';
    },
    set cookie(value: string) {
      cookies.push(value);
    },
    getElementById: (id: string) => scripts.find((script) => script.id === id),
    createElement: () => ({}),
    head: {
      appendChild: (script: { id: string; onload: () => void }) =>
        scripts.push(script),
    },
    querySelector: (selector: string) =>
      selector === '[data-meta-recipe-id]'
        ? browser.location.pathname.includes(
            '/recipes/bezghliutenovyi-napoleon',
          )
          ? { getAttribute: () => 'gluten-free-napoleon' }
          : null
        : lessonState
          ? { getAttribute: () => lessonState }
          : null,
  };
  const globals = {
    window: browser,
    document: doc,
    localStorage: store,
    location: browser.location,
    navigator: { doNotTrack: null },
    history: {
      pushState(_state: unknown, _unused: string, url: string) {
        browser.location = new URL(url, browser.location);
        Object.defineProperty(globalThis, 'location', {
          configurable: true,
          value: browser.location,
        });
      },
      replaceState(_state: unknown, _unused: string, url: string) {
        this.pushState(_state, _unused, url);
      },
    },
  };
  const previous = new Map(
    Object.keys(globals).map((key) => [
      key,
      Object.getOwnPropertyDescriptor(globalThis, key),
    ]),
  );
  for (const [key, value] of Object.entries(globals))
    Object.defineProperty(globalThis, key, { configurable: true, value });
  try {
    const runtime = await import('./meta.ts');
    browser.addEventListener('ba:route', () => runtime.syncMetaRoute());
    runtime.startMeta(id);
    runtime.syncMetaRoute();
    runtime.trackMetaLead({ placement: 'landing' });
    assert.equal(scripts.length, 0);
    assert.equal(browser.fbq, undefined);
    runtime.setAdsConsent('denied');
    runtime.startMeta(id);
    assert.equal(scripts.length, 0);
    assert.equal(runtime.consentSnapshot()?.ads, 'denied');
    runtime.setAdsConsent('granted');
    runtime.syncMetaRoute();
    assert.equal(scripts.length, 1);
    runtime.trackMetaLead({ placement: 'landing' });
    runtime.setAdsConsent('denied');
    browser.fbq!.callMethod = (...args: unknown[]) => {
      events.push(args);
    };
    scripts[0].onload();
    assert.equal(events.filter((e) => e[0] === 'init').length, 0);
    assert.equal(events.filter((e) => e[1] === 'Lead').length, 0);
    runtime.setAdsConsent('granted');
    runtime.syncMetaRoute();
    runtime.startMeta(id);
    assert.equal(events.filter((e) => e[0] === 'init').length, 1);
    assert.equal(events.filter((e) => e[1] === 'PageView').length, 1);
    assert.equal(browser.fbq!.disablePushState, true);
    assert(
      events.some(
        (e) => e[0] === 'set' && e[1] === 'autoConfig' && e[2] === false,
      ),
    );
    history.pushState(null, '', '/uk/recipes/bezghliutenovyi-napoleon');
    runtime.syncMetaRoute();
    assert.equal(events.filter((e) => e[1] === 'PageView').length, 2);
    assert.equal(events.filter((e) => e[1] === 'ViewContent').length, 1);
    history.replaceState(null, '', '?src=instagram');
    runtime.syncMetaRoute();
    assert.equal(events.filter((e) => e[1] === 'PageView').length, 2);
    runtime.trackMetaLead({ magnetId: 'shokolad' });
    assert.equal(events.filter((e) => e[1] === 'Lead').length, 1);
    runtime.setAdsConsent('denied');
    const count = events.filter(
      (e) => e[0] === 'track' || e[0] === 'trackCustom',
    ).length;
    runtime.trackMetaLead({ placement: 'landing' });
    history.pushState(null, '', '/uk');
    assert.equal(
      events.filter((e) => e[0] === 'track' || e[0] === 'trackCustom').length,
      count,
    );
    assert(
      cookies.some((value) => value.startsWith('_fbp=;')) &&
        cookies.some((value) => value.startsWith('_fbc=;')),
    );
    assert(events.some((e) => e[0] === 'consent' && e[1] === 'revoke'));
    history.pushState(null, '', '/uk/urok/napoleon?code=private');
    runtime.setAdsConsent('granted');
    assert.equal(
      events.filter((e) => e[0] === 'track' || e[0] === 'trackCustom').length,
      count,
    );
    lessonState = 'description';
    history.replaceState(null, '', '/uk/urok/napoleon');
    runtime.syncMetaRoute();
    assert.equal(events.filter((e) => e[1] === 'PageView').length, 3);
    assert.equal(events.at(-1)?.[1], 'ViewContent');
    assert.equal(JSON.stringify(events).includes('private'), false);
    history.pushState(null, '', '/uk/urok/napoleon/kupyty?ba_checkout=secret');
    runtime.trackMetaBuy();
    assert.equal(JSON.stringify(events).includes('secret'), false);
    assert.equal(
      events.some((e) => e[1] === 'Purchase' || e[1] === 'InitiateCheckout'),
      false,
    );
    assert.equal(scripts.length, 1);
    browser.fbq!.callMethod = () => {
      throw new Error('Blocked SDK');
    };
    assert.doesNotThrow(() => runtime.trackMetaLead({ placement: 'landing' }));
  } finally {
    for (const [key, descriptor] of previous) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  }
});
