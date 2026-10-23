import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
import { DatabaseSync } from 'node:sqlite';
import { leadMagnetRegistry } from '../../content/lead-magnets.ts';
import { validateLeadMagnetRegistry } from '../../content/lead-magnets.validation.ts';

void test('registry migration preserves pending/sent identities, timestamps, uniqueness and indexes', () => {
  const db = new DatabaseSync(':memory:');
  db.exec(readFileSync(new URL('../../drizzle/0002_lead_magnet_delivery.sql', import.meta.url), 'utf8'));
  const insert = db.prepare('INSERT INTO lead_magnet_requests VALUES (?,?,?,?,?,?,?,?,?,?,?,?)');
  for (const [i, status] of ['pending','awaiting_confirmation','delivering','sent','failed'].entries()) {
    insert.run(`id${i}`, `hash${i}`, `dedupe${i}`, 'reader@example.com', i % 2 ? 'shokolad' : 'mlyntsi', 'network', 100, 200, status, i ? 110 : null, i ? 120 : null, status === 'sent' ? 130 : null);
  }
  const before = db.prepare('SELECT * FROM lead_magnet_requests ORDER BY id').all();
  db.exec('BEGIN');
  db.exec(readFileSync(new URL('../../drizzle/0003_lead_magnet_registry.sql', import.meta.url), 'utf8'));
  db.exec('COMMIT');
  assert.deepEqual(db.prepare('SELECT * FROM lead_magnet_requests ORDER BY id').all(), before);
  assert.equal(db.prepare("SELECT count(*) AS n FROM sqlite_master WHERE type='index' AND name IN ('lead_magnet_network_created','lead_magnet_email_created')").get()!.n, 2);
  const after = db.prepare('INSERT INTO lead_magnet_requests VALUES (?,?,?,?,?,?,?,?,?,?,?,?)');
  after.run('future', 'future-hash', 'future-key', 'reader@example.com', 'new-product', 'network', 100, 200, 'pending', null, null, null);
  assert.throws(() => after.run('duplicate', 'future-hash', 'another-key', 'reader@example.com', 'new-product', 'network', 100, 200, 'pending', null, null, null));
  assert.throws(() => after.run('bad', 'bad-hash', 'bad-key', 'reader@example.com', '../private', 'network', 100, 200, 'pending', null, null, null));
  assert.throws(() => after.run('bad-status', 'status-hash', 'status-key', 'reader@example.com', 'new-product', 'network', 100, 200, 'unknown', null, null, null));
  db.close();
});

void test('registry rejects unsafe destinations, missing outcome copy and duplicate keywords', () => {
  for (const mutate of [
    (p: typeof leadMagnetRegistry) => { p.shokolad.email.links[0].href = 'https://outside.example/file.pdf'; },
    (p: typeof leadMagnetRegistry) => { p.shokolad.email.links[0].href = '/downloads/../private'; },
    (p: typeof leadMagnetRegistry) => { p.shokolad.email.delivered = ''; },
    (p: typeof leadMagnetRegistry) => { p.mlyntsi.bot.keyword = p.shokolad.bot.keyword.toUpperCase(); },
  ]) {
    const registry = structuredClone(leadMagnetRegistry);
    mutate(registry);
    assert.throws(() => validateLeadMagnetRegistry(registry));
  }
});

void test('one additional JSON record reaches page, API validation, email, confirmation copy, bot links and analytics', async () => {
  // Run real consumers in an isolated module graph. No test product touches the
  // deployed registry, no mocks of derived ID lists, no provider requests.
  const root = await mkdtemp(join(tmpdir(), 'bake-again-registry-'));
  try {
    for (const dir of ['content', 'lib/newsletter', 'lib/analytics']) await mkdir(join(root, dir), { recursive: true });
    const files = [
      'content/lead-magnets.ts', 'content/lead-magnets.validation.ts',
      ...['magnets.ts','magnet-email.ts','magnet-email.generated.ts','delivery-service.ts','delivery-store.ts','brevo-api.ts'].map(name => `lib/newsletter/${name}`),
      'lib/analytics/umami.ts',
    ];
    for (const file of files) await cp(new URL(`../../${file}`, import.meta.url), join(root, file));
    const source = JSON.parse(await readFile(new URL('../../content/lead-magnets.json', import.meta.url), 'utf8'));
    source['registry-probe'] = structuredClone(source.shokolad);
    source['registry-probe'].bot.keyword = 'перевірка';
    source['registry-probe'].email.subject = 'Isolated new product';
    source['registry-probe'].email.delivered = 'New product delivered';
    source['registry-probe'].email.links = [{ title: 'New material', href: '/downloads/probe.pdf' }];
    await writeFile(join(root, 'content/lead-magnets.json'), JSON.stringify(source));
    await writeFile(join(root, 'package.json'), '{"type":"module"}');
    const base = pathToFileURL(`${root}/`).href;
    execFileSync(process.execPath, ['--experimental-strip-types', '--input-type=module', '-e', `
      import assert from 'node:assert/strict';
      const content = await import(${JSON.stringify(`${base}content/lead-magnets.ts`)});
      const {magnetDelivery} = await import(${JSON.stringify(`${base}lib/newsletter/magnets.ts`)});
      const {recipeEmail} = await import(${JSON.stringify(`${base}lib/newsletter/magnet-email.ts`)});
      const {parseRecipeRequest} = await import(${JSON.stringify(`${base}lib/newsletter/delivery-service.ts`)});
      const {sanitizeAnalyticsPayload} = await import(${JSON.stringify(`${base}lib/analytics/umami.ts`)});
      assert.equal(content.getLeadMagnet('uk','registry-probe').magnetId,'registry-probe');
      assert.equal(content.getLeadMagnet('en','registry-probe'), undefined);
      assert.equal(parseRecipeRequest({email:'reader@example.com',magnet:'registry-probe',token:'x',consent:true}).magnet,'registry-probe');
      assert.equal(recipeEmail('registry-probe').subject,'Isolated new product');
      assert.ok(recipeEmail('registry-probe').htmlContent.includes('/downloads/probe.pdf'));
      assert.equal(magnetDelivery['registry-probe'].delivered,'New product delivered');
      assert.equal(content.getLeadMagnetBot('registry-probe','ig').url,'https://bakeagain.com/uk/recept/registry-probe?src=ig-bot');
      const data = sanitizeAnalyticsPayload('event',{name:'lead_magnet_submit',url:'/uk/recept/registry-probe?email=private#token',data:{magnet:'registry-probe',email:'private'}});
      assert.deepEqual(data.data,{magnet:'registry-probe'});
      assert.equal(data.url,'/uk/recept/registry-probe');
      assert.equal(sanitizeAnalyticsPayload('event',{name:'lead_magnet_submit',url:'/uk/recept/unknown',data:{magnet:'unknown'}}),false);
    `], { stdio: 'pipe' });
  } finally { await rm(root, { recursive: true, force: true }); }
});
