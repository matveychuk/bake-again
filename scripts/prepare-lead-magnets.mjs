import { stat, mkdir, writeFile } from 'node:fs/promises';
import { leadMagnetIds, leadMagnetRegistry, leadMagnetPath, getLeadMagnetBot } from '../content/lead-magnets.ts';

const root = new URL('../', import.meta.url);
// Check every asset before writing a handoff. Never send or call provider APIs.
for (const id of leadMagnetIds) {
  const product = leadMagnetRegistry[id];
  for (const href of [product.page.image, ...product.email.links.map(link => link.href)]) {
    const file = await stat(new URL(`public${href}`, root));
    if (!file.isFile() || !file.size) throw new Error(`Missing delivery asset for ${id}: ${href}`);
  }
}
const output = new URL('outputs/lead-magnets/', root);
await mkdir(output, { recursive: true });
for (const id of leadMagnetIds) {
  const product = leadMagnetRegistry[id];
  const handoff = {
    id,
    title: product.page.title,
    page: `https://bakeagain.com${leadMagnetPath(id)}`,
    channels: { instagram: getLeadMagnetBot(id, 'ig'), facebook: getLeadMagnetBot(id, 'fb') },
    files: await Promise.all(product.email.links.map(async link => ({
      ...link, url: `https://bakeagain.com${link.href}`,
      bytes: (await stat(new URL(`public${link.href}`, root))).size,
    }))),
    state: 'prepared-only',
  };
  await writeFile(new URL(`${id}.json`, output), `${JSON.stringify(handoff, null, 2)}\n`);
}
console.log(`Validated ${leadMagnetIds.length} lead magnets and prepared bot copy in outputs/lead-magnets/. Nothing sent or activated.`);
