const C = {
  page: '#FAF6EF', surface: '#FFFDF9', linen: '#EEE7DD', text: '#392721',
  secondary: '#735D54', tertiary: '#826B60', border: '#D9CEC6',
  accent: '#A64F36', tested: '#853C29', testedBg: '#F4E6DF',
  calculated: '#52616B', calculatedBg: '#EDF0F2', suggested: '#805C26', suggestedBg: '#F6EEDD',
  white: '#FFFFFF'
};

const rgb = hex => {
  const h = hex.replace('#', '');
  return { r: parseInt(h.slice(0, 2), 16) / 255, g: parseInt(h.slice(2, 4), 16) / 255, b: parseInt(h.slice(4, 6), 16) / 255 };
};
const paints = hex => [{ type: 'SOLID', color: rgb(hex) }];

function makeFrame(name, w, h, fill = null) {
  const n = figma.createFrame(); n.name = name; n.resize(w, h); n.fills = fill ? paints(fill) : []; n.clipsContent = true; return n;
}
function add(parent, child, x, y) { parent.appendChild(child); child.x = x; child.y = y; return child; }
function setImage(node, imageHash) { node.fills = [{ type: 'IMAGE', imageHash, scaleMode: 'FILL' }]; }

function txt(value, size, color = C.text, family = 'Manrope', style = 'Regular', line = null) {
  const n = figma.createText(); n.fontName = { family, style }; n.characters = value; n.fontSize = size;
  n.fills = paints(color); n.lineHeight = { unit: 'PIXELS', value: line || Math.round(size * (family === 'Newsreader' ? 1.04 : 1.5)) };
  return n;
}
function paragraph(value, w, size = 14, color = C.secondary, family = 'Manrope', style = 'Regular', line = null) {
  const n = txt(value, size, color, family, style, line); n.textAutoResize = 'HEIGHT'; n.resize(w, 20); return n;
}
function eyebrow(value) {
  const n = txt(value.toUpperCase(), 10, C.tested, 'Manrope', 'Bold', 14); n.letterSpacing = { unit: 'PIXELS', value: 1.25 }; return n;
}
function line(parent, x, y, w, color = C.border) {
  const n = figma.createRectangle(); n.name = 'Divider'; n.resize(w, 1); n.fills = paints(color); add(parent, n, x, y); return n;
}

async function createFoundations() {
  const old = (await figma.variables.getLocalVariableCollectionsAsync()).find(c => c.name === 'Bake Again / Semantic');
  if (old) old.remove();
  const col = figma.variables.createVariableCollection('Bake Again / Semantic');
  const mode = col.modes[0].modeId; col.renameMode(mode, 'Review applied');
  const defs = {
    'color/bg/page': C.page, 'color/bg/surface': C.surface, 'color/bg/linen': C.linen,
    'color/text/primary': C.text, 'color/text/secondary': C.secondary, 'color/text/tertiary': C.tertiary,
    'color/accent/primary': C.accent, 'color/status/tested': C.tested, 'color/status/tested-bg': C.testedBg,
    'color/status/calculated': C.calculated, 'color/status/calculated-bg': C.calculatedBg,
    'color/status/suggested': C.suggested, 'color/status/suggested-bg': C.suggestedBg,
    'color/border/subtle': C.border
  };
  for (const [name, value] of Object.entries(defs)) {
    const v = figma.variables.createVariable(name, col, 'COLOR'); v.setValueForMode(mode, { ...rgb(value), a: 1 });
    v.scopes = name.includes('/text/') || name.endsWith('/tested') || name.endsWith('/calculated') || name.endsWith('/suggested') ? ['TEXT_FILL'] : ['FRAME_FILL', 'SHAPE_FILL'];
    v.setVariableCodeSyntax('WEB', `var(--${name.replaceAll('/', '-')})`);
  }
  for (const value of [4, 8, 12, 16, 24, 32, 48, 64]) {
    const v = figma.variables.createVariable(`space/${value}`, col, 'FLOAT'); v.setValueForMode(mode, value); v.scopes = ['GAP'];
  }
  for (const [name, value] of [['radius/4', 4], ['radius/999', 999]]) {
    const v = figma.variables.createVariable(name, col, 'FLOAT'); v.setValueForMode(mode, value); v.scopes = ['CORNER_RADIUS'];
  }
}

function makeStatus(name, icon, fg, bg) {
  const c = figma.createComponent(); c.name = `Status badge / ${name}`; c.description = `${name}: evidence state; label is always required.`;
  c.layoutMode = 'HORIZONTAL'; c.primaryAxisSizingMode = 'AUTO'; c.counterAxisSizingMode = 'AUTO'; c.counterAxisAlignItems = 'CENTER';
  c.itemSpacing = 7; c.paddingLeft = c.paddingRight = 9; c.paddingTop = c.paddingBottom = 6; c.cornerRadius = 4; c.fills = paints(bg);
  c.appendChild(txt(icon, 12, fg, 'Manrope', 'Bold', 14)); c.appendChild(txt(name, 11, fg, 'Manrope', 'Bold', 16)); return c;
}

function makeRecipeCard() {
  const c = figma.createComponent(); c.name = 'Recipe card / Mobile'; c.description = 'Food-first compact recipe card with version-specific evidence.';
  c.resize(342, 128); c.fills = []; c.clipsContent = true;
  const image = makeFrame('Recipe image', 124, 124, C.linen); add(c, image, 0, 0);
  add(c, eyebrow('CATEGORY'), 140, 2).name = 'Category';
  const title = paragraph('Recipe title', 196, 22, C.text, 'Newsreader', 'Regular', 24); title.name = 'Title'; add(c, title, 140, 22);
  const meta = paragraph('Practical detail', 196, 11, C.secondary, 'Manrope', 'Regular', 16); meta.name = 'Meta'; add(c, meta, 140, 78);
  const proof = paragraph('✓  Tested', 196, 11, C.tested, 'Manrope', 'Bold', 16); proof.name = 'Evidence'; add(c, proof, 140, 99);
  return c;
}

function makeButton() {
  const c = figma.createComponent(); c.name = 'Button / Primary'; c.description = 'Primary terracotta action; use sparingly.';
  c.resize(92, 48); c.fills = paints(C.accent); add(c, txt('Search', 13, C.white, 'Manrope', 'Bold', 18), 22, 15); return c;
}

function buildComponentsPage() {
  let page = figma.root.children.find(p => p.name === '02 Local Components');
  if (!page) page = figma.createPage();
  page.name = '02 Local Components'; for (const child of page.children) child.remove();
  const board = makeFrame('Local mirrors · Design System v1', 720, 920, C.page); page.appendChild(board);
  add(board, eyebrow('Screen-local building blocks'), 48, 48);
  add(board, paragraph('Reusable pieces for the first responsive homepage pair.', 620, 34, C.text, 'Newsreader', 'Regular', 38), 48, 82);
  const tested = makeStatus('Tested', '✓', C.tested, C.testedBg); add(board, tested, 48, 180);
  const calculated = makeStatus('Calculated', '▦', C.calculated, C.calculatedBg); add(board, calculated, 180, 180);
  const suggested = makeStatus('Suggested', '○', C.suggested, C.suggestedBg); add(board, suggested, 338, 180);
  const button = makeButton(); add(board, button, 48, 270);
  const card = makeRecipeCard(); add(board, card, 48, 380);
  add(board, paragraph('Status colour supplements meaning. “Made many times” and flour mix names are supporting evidence under Tested, not separate statuses.', 580, 14, C.secondary, 'Manrope', 'Regular', 22), 48, 570);
  return { page, tested, calculated, suggested, button, card };
}

function setCard(instance, data) {
  instance.name = `Recipe card / ${data.title}`;
  const image = instance.findOne(n => n.name === 'Recipe image'); setImage(image, data.imageHash);
  const cat = instance.findOne(n => n.name === 'Category'); cat.characters = data.category.toUpperCase();
  const title = instance.findOne(n => n.name === 'Title'); title.characters = data.title;
  const meta = instance.findOne(n => n.name === 'Meta'); meta.characters = data.meta;
  const evidence = instance.findOne(n => n.name === 'Evidence'); evidence.characters = `✓  Tested${data.evidence ? ' · ' + data.evidence : ''}`;
}

function buildMobile(homePage, components, images) {
  const old = homePage.findOne(n => n.name === 'Homepage / Mobile / Review applied'); if (old) old.remove();
  const m = makeFrame('Homepage / Mobile / Review applied', 390, 2590, C.page); homePage.appendChild(m); m.x = 1800; m.y = 0;
  add(m, txt('Bake Again', 22, C.text, 'Newsreader', 'SemiBold', 32), 24, 20);
  add(m, txt('.', 22, C.accent, 'Newsreader', 'SemiBold', 32), 128, 20);
  add(m, txt('MENU', 10, C.text, 'Manrope', 'Bold', 14), 322, 29); line(m, 24, 67, 342);

  add(m, eyebrow('A small collection of tested gluten-free recipes'), 24, 105);
  const h1 = paragraph('Bake what you love.\nKnow what works.', 342, 53, C.text, 'Newsreader', 'Regular', 49); add(m, h1, 24, 136);
  const italic = h1; italic.name = 'Hero title';
  add(m, paragraph('Familiar cakes, cookies and breakfasts — carefully adjusted, baked again, and written so you can get the same result at home.', 342, 14, C.secondary, 'Manrope', 'Regular', 22), 24, 257);
  const search = makeFrame('Search', 342, 56, C.surface); search.strokes = paints(C.border); search.strokeWeight = 1; add(m, search, 24, 354);
  add(search, txt('⌕', 20, C.secondary, 'Manrope', 'Regular', 24), 15, 16); add(search, txt('What would you like to bake?', 12, C.secondary, 'Manrope', 'Regular', 18), 43, 18);
  const bi = components.button.createInstance(); bi.resize(86, 48); add(search, bi, 255, 4);
  const heroImage = makeFrame('Hero · Napoleon cake', 342, 280, C.linen); setImage(heroImage, images.napoleon); add(m, heroImage, 24, 442);
  const heroLabel = makeFrame('Start with a classic', 232, 68, C.text); add(m, heroLabel, 134, 675);
  add(heroLabel, eyebrow('Start with a classic'), 16, 12).fills = paints('#D6C6BC'); add(heroLabel, txt('Napoleon cake  →', 18, C.white, 'Newsreader', 'Regular', 24), 16, 32);

  const moment = makeFrame('Choose by the moment', 390, 210, C.linen); add(m, moment, 0, 783);
  add(moment, eyebrow('01   Choose by the moment'), 24, 28);
  const chips = ['For breakfast', 'Every day', 'Celebration', 'Prepare ahead', 'I just want to bake'];
  let cx = 24, cy = 70; for (const value of chips) { const w = Math.min(160, 28 + value.length * 7); if (cx + w > 366) { cx = 24; cy += 48; }
    const chip = makeFrame(value, w, 38, C.surface); chip.strokes = paints(C.border); chip.strokeWeight = 1; add(moment, chip, cx, cy); add(chip, txt(value + '  →', 11, C.text, 'Manrope', 'SemiBold', 16), 12, 11); cx += w + 8; }

  add(m, eyebrow('A good place to begin'), 24, 1047);
  add(m, paragraph('Three recipes we know well.', 342, 38, C.text, 'Newsreader', 'Regular', 41), 24, 1077);
  const recipes = [
    { title:'Napoleon cake', category:'Celebration · prepare ahead', meta:'12 layers · 28 cm', evidence:'Schär Mix B', imageHash:images.napoleon },
    { title:'Chocolate crinkle cookies', category:'Everyday baking', meta:'Chill for 3–4 hours', evidence:'Made many times', imageHash:images.cookies },
    { title:'Thin breakfast crepes', category:'Breakfast · everyday', meta:'Rest batter 15–30 min', evidence:'', imageHash:images.crepes }
  ];
  let ry = 1158; for (const recipe of recipes) { const inst = components.card.createInstance(); setCard(inst, recipe); add(m, inst, 24, ry); ry += 158; }
  add(m, txt('View all recipes  →', 12, C.text, 'Manrope', 'Bold', 18), 24, 1638); line(m, 24, 1686, 342, C.accent);

  const trust = makeFrame('Trust and provenance', 342, 610, C.surface); add(m, trust, 24, 1718);
  const proofCircle = figma.createEllipse(); proofCircle.resize(48,48); proofCircle.fills = paints(C.accent); add(trust, proofCircle, 0, 20);
  add(trust, txt('✓', 20, C.white, 'Manrope', 'Bold', 24), 14, 31);
  add(trust, eyebrow('Clear recipe status'), 64, 24);
  add(trust, paragraph('Know what was baked — and what was only worked out.', 270, 30, C.text, 'Newsreader', 'Regular', 32), 64, 50);
  let sy = 165;
  const rows = [
    [components.tested, 'Baked as written.'],
    [components.calculated, 'Quantities scaled. This version has not been bake-tested.'],
    [components.suggested, 'An idea to try. This change has not been bake-tested.']
  ];
  for (const [master, copy] of rows) { const badge = master.createInstance(); add(trust, badge, 0, sy); add(trust, paragraph(copy, 210, 11, C.text, 'Manrope', 'Regular', 16), 124, sy + 4); sy += 72; }
  add(trust, paragraph('Every recipe names the flour mix, form and quantity actually used. A tested original may still have a calculated variation.', 310, 13, C.secondary, 'Manrope', 'Regular', 21), 0, 400);
  add(trust, txt('How we test recipes  →', 12, C.text, 'Manrope', 'Bold', 18), 0, 520);

  line(m, 24, 2400, 342); add(m, txt('Bake Again', 21, C.text, 'Newsreader', 'SemiBold', 30), 24, 2432); add(m, txt('.', 21, C.accent, 'Newsreader', 'SemiBold', 30), 123, 2432);
  add(m, paragraph('Design System v1 · Warm Precision', 180, 10, C.secondary, 'Manrope', 'Regular', 14), 186, 2440);
  return m;
}

async function main() {
  await Promise.all([
    ['Manrope','Regular'],['Manrope','SemiBold'],['Manrope','Bold'],
    ['Newsreader','Regular'],['Newsreader','Medium'],['Newsreader','SemiBold']
  ].map(([family, style]) => figma.loadFontAsync({ family, style })));
  const homePage = figma.currentPage; homePage.name = '01 Homepage';
  const desktop = homePage.findOne(n => n.type === 'FRAME' && n.name.includes('Bake Again — Tested gluten-free baking'));
  if (!desktop) throw new Error('Imported desktop homepage was not found.');
  desktop.name = 'Homepage / Desktop / Review applied · 1651';
  const switcher = desktop.findOne(n => n.name === 'DesignReviewSwitcher'); if (switcher) switcher.remove();
  const imageNodes = desktop.findAll(n => n.type === 'FRAME' && n.fills !== figma.mixed && n.fills.some(p => p.type === 'IMAGE'));
  const byName = name => imageNodes.find(n => n.name.includes(name)).fills.find(p => p.type === 'IMAGE').imageHash;
  const images = { napoleon: byName('Napoleon'), cookies: byName('Chocolate crinkle'), crepes: byName('stack of thin golden') };
  await createFoundations();
  const components = buildComponentsPage();
  await figma.setCurrentPageAsync(homePage);
  const mobile = buildMobile(homePage, components, images);
  figma.viewport.scrollAndZoomIntoView([desktop, mobile]);
  return { desktop: desktop.id, mobile: mobile.id, componentsPage: components.page.id };
}

main().then(result => figma.closePlugin(`Bake Again product screens ready: ${result.mobile}`)).catch(error => { console.error(error); figma.closePlugin(`Could not build product screens: ${error.message}`); });
