const C = {
  page: '#FAF6EF', surface: '#FFFDF9', panel: '#EEE7DD', subtle: '#F3EDE5',
  text: '#392721', secondary: '#735D54', border: '#D8C9BC',
  terracotta: '#A64F36', terracottaStrong: '#853C29', white: '#FFFFFF',
  testedBg: '#F4E6DF', tested: '#853C29',
  calculatedBg: '#EDF0F2', calculated: '#52616B',
  suggestedBg: '#F6EEDD', suggested: '#805C26'
};

function rgb(hex) {
  const value = hex.replace('#', '');
  return { r: parseInt(value.slice(0, 2), 16) / 255, g: parseInt(value.slice(2, 4), 16) / 255, b: parseInt(value.slice(4, 6), 16) / 255 };
}

function paint(hex) { return [{ type: 'SOLID', color: rgb(hex) }]; }

function frame(name, width, height, fill) {
  const node = figma.createFrame();
  node.name = name;
  node.resize(width, height);
  node.fills = paint(fill);
  node.clipsContent = false;
  return node;
}

function autoFrame(name, direction, gap, padding, fill) {
  const node = figma.createFrame();
  node.name = name;
  node.layoutMode = direction;
  node.primaryAxisSizingMode = 'AUTO';
  node.counterAxisSizingMode = 'AUTO';
  node.itemSpacing = gap;
  node.paddingTop = node.paddingBottom = node.paddingLeft = node.paddingRight = padding;
  node.fills = fill ? paint(fill) : [];
  return node;
}

async function text(value, size, color, font, style) {
  const node = figma.createText();
  const family = font || 'Manrope';
  const fontStyle = style || 'Regular';
  await figma.loadFontAsync({ family, style: fontStyle });
  node.fontName = { family, style: fontStyle };
  node.characters = value;
  node.fontSize = size;
  node.fills = paint(color || C.text);
  node.lineHeight = { unit: 'PERCENT', value: family === 'Newsreader' ? 104 : 145 };
  return node;
}

async function label(value, color) {
  const node = await text(value.toUpperCase(), 11, color || C.secondary, 'Manrope', 'SemiBold');
  node.letterSpacing = { unit: 'PERCENT', value: 10 };
  return node;
}

function setPos(node, x, y) { node.x = x; node.y = y; return node; }

async function sectionTitle(index, eyebrow, titleValue, description) {
  const group = autoFrame(index + ' ' + titleValue, 'VERTICAL', 14, 0, null);
  const meta = autoFrame('Section meta', 'HORIZONTAL', 10, 0, null);
  meta.appendChild(await label(index, C.terracottaStrong));
  meta.appendChild(await label(eyebrow));
  group.appendChild(meta);
  group.appendChild(await text(titleValue, 42, C.text, 'Newsreader', 'Regular'));
  if (description) {
    const body = await text(description, 15, C.secondary, 'Manrope', 'Regular');
    body.resize(720, body.height);
    body.textAutoResize = 'HEIGHT';
    group.appendChild(body);
  }
  return group;
}

async function makeButton(name, labelText, kind, state) {
  const component = figma.createComponent();
  component.name = `Button/${name}/${state}`;
  component.layoutMode = 'HORIZONTAL';
  component.primaryAxisSizingMode = 'AUTO';
  component.counterAxisSizingMode = 'AUTO';
  component.primaryAxisAlignItems = 'CENTER';
  component.counterAxisAlignItems = 'CENTER';
  component.paddingLeft = component.paddingRight = 22;
  component.paddingTop = component.paddingBottom = 14;
  component.itemSpacing = 10;
  component.cornerRadius = 2;
  const disabled = state === 'Disabled';
  if (kind === 'Primary') {
    component.fills = paint(disabled ? '#CDB8AE' : (state === 'Hover' ? C.terracottaStrong : C.terracotta));
    component.strokes = [];
  } else {
    component.fills = paint(C.surface);
    component.strokes = paint(disabled ? '#E3D9D1' : C.border);
    component.strokeWeight = 1;
  }
  component.opacity = disabled ? 0.72 : 1;
  const t = await text(labelText, 14, kind === 'Primary' ? C.white : C.text, 'Manrope', 'SemiBold');
  component.appendChild(t);
  return component;
}

async function makeStatus(name, icon, bg, fg) {
  const component = figma.createComponent();
  component.name = `Status/${name}`;
  component.layoutMode = 'HORIZONTAL';
  component.primaryAxisSizingMode = 'AUTO';
  component.counterAxisSizingMode = 'AUTO';
  component.counterAxisAlignItems = 'CENTER';
  component.itemSpacing = 8;
  component.paddingLeft = component.paddingRight = 12;
  component.paddingTop = component.paddingBottom = 8;
  component.cornerRadius = 8;
  component.fills = paint(bg);
  component.appendChild(await text(icon, 16, fg, 'Manrope', 'SemiBold'));
  component.appendChild(await text(name, 13, fg, 'Manrope', 'SemiBold'));
  return component;
}

async function makeStatusExample(name, icon, bg, fg) {
  const example = autoFrame(`Status/${name} example`, 'HORIZONTAL', 8, 0, bg);
  example.counterAxisAlignItems = 'CENTER';
  example.paddingLeft = example.paddingRight = 12;
  example.paddingTop = example.paddingBottom = 8;
  example.cornerRadius = 8;
  example.appendChild(await text(icon, 16, fg, 'Manrope', 'SemiBold'));
  example.appendChild(await text(name, 13, fg, 'Manrope', 'SemiBold'));
  return example;
}

async function makeSearch() {
  const component = figma.createComponent();
  component.name = 'Search/Default';
  component.resize(720, 64);
  component.layoutMode = 'HORIZONTAL';
  component.primaryAxisSizingMode = 'FIXED';
  component.counterAxisSizingMode = 'FIXED';
  component.counterAxisAlignItems = 'CENTER';
  component.paddingLeft = 20;
  component.itemSpacing = 12;
  component.fills = paint(C.surface);
  component.strokes = paint(C.border);
  component.strokeWeight = 1;
  const icon = await text('⌕', 22, C.secondary, 'Manrope', 'Regular');
  const placeholder = await text('Search recipes', 15, C.secondary, 'Manrope', 'Regular');
  placeholder.layoutGrow = 1;
  const button = autoFrame('Search action', 'HORIZONTAL', 0, 0, C.terracotta);
  button.resize(112, 62);
  button.primaryAxisSizingMode = 'FIXED';
  button.counterAxisSizingMode = 'FIXED';
  button.primaryAxisAlignItems = 'CENTER';
  button.counterAxisAlignItems = 'CENTER';
  button.appendChild(await text('Search', 14, C.white, 'Manrope', 'SemiBold'));
  component.appendChild(icon);
  component.appendChild(placeholder);
  component.appendChild(button);
  return component;
}

async function makeRecipeCard() {
  const component = figma.createComponent();
  component.name = 'Recipe card/Default';
  component.resize(420, 560);
  component.layoutMode = 'VERTICAL';
  component.primaryAxisSizingMode = 'FIXED';
  component.counterAxisSizingMode = 'FIXED';
  component.fills = paint(C.surface);
  component.strokes = paint(C.border);
  component.strokeWeight = 1;
  const image = frame('Food image', 418, 310, '#CDB8A5');
  const imageLabel = await label('Food-first photography', C.text);
  imageLabel.x = 24; imageLabel.y = 268;
  image.appendChild(imageLabel);
  component.appendChild(image);
  const content = autoFrame('Content', 'VERTICAL', 10, 24, null);
  content.layoutAlign = 'STRETCH';
  content.appendChild(await label('Celebration · prepare ahead'));
  content.appendChild(await text('Napoleon cake', 30, C.text, 'Newsreader', 'Regular'));
  content.appendChild(await text('12 layers · 28 cm', 13, C.secondary, 'Manrope', 'Regular'));
  const proof = autoFrame('Proof', 'HORIZONTAL', 8, 0, null);
  proof.appendChild(await text('✓', 14, C.terracottaStrong, 'Manrope', 'SemiBold'));
  proof.appendChild(await text('Tested · Schär Mix B', 13, C.text, 'Manrope', 'SemiBold'));
  content.appendChild(proof);
  component.appendChild(content);
  return component;
}

async function makeProvenance() {
  const component = figma.createComponent();
  component.name = 'Provenance/Tested configuration';
  component.resize(520, 142);
  component.layoutMode = 'VERTICAL';
  component.primaryAxisSizingMode = 'FIXED';
  component.counterAxisSizingMode = 'FIXED';
  component.itemSpacing = 10;
  component.paddingLeft = component.paddingRight = 22;
  component.paddingTop = component.paddingBottom = 20;
  component.fills = paint(C.panel);
  component.appendChild(await label('Tested configuration', C.terracottaStrong));
  component.appendChild(await text('Schär Mix B · 28 cm round form · 12 layers', 16, C.text, 'Manrope', 'SemiBold'));
  component.appendChild(await text('Evidence belongs to this exact recipe version.', 13, C.secondary, 'Manrope', 'Regular'));
  return component;
}

async function createVariables() {
  const collection = figma.variables.createVariableCollection('Bake Again — Semantic');
  const mode = collection.modes[0].modeId;
  collection.renameMode(mode, 'Review applied');
  const colors = {
    'Background/Page': C.page, 'Background/Surface': C.surface, 'Background/Panel': C.panel,
    'Background/Subtle': C.subtle, 'Text/Primary': C.text, 'Text/Secondary': C.secondary,
    'Border/Default': C.border, 'Action/Primary': C.terracotta, 'Action/Primary strong': C.terracottaStrong,
    'Status/Tested background': C.testedBg, 'Status/Tested label': C.tested,
    'Status/Calculated background': C.calculatedBg, 'Status/Calculated label': C.calculated,
    'Status/Suggested background': C.suggestedBg, 'Status/Suggested label': C.suggested
  };
  for (const [name, value] of Object.entries(colors)) {
    const variable = figma.variables.createVariable(name, collection, 'COLOR');
    variable.setValueForMode(mode, rgb(value));
  }
  for (const value of [4, 8, 12, 16, 24, 32, 48, 64, 96]) {
    const variable = figma.variables.createVariable(`Space/${value}`, collection, 'FLOAT');
    variable.setValueForMode(mode, value);
  }
  for (const [name, value] of Object.entries({ 'Radius/Small': 2, 'Radius/Medium': 8, 'Radius/Round': 999 })) {
    const variable = figma.variables.createVariable(name, collection, 'FLOAT');
    variable.setValueForMode(mode, value);
  }
}

async function createTextStyles() {
  const styles = [
    ['Display/Hero', 'Newsreader', 'Regular', 64, 66],
    ['Heading/H1', 'Newsreader', 'Regular', 48, 52],
    ['Heading/H2', 'Newsreader', 'Regular', 36, 40],
    ['Heading/H3', 'Newsreader', 'Regular', 28, 34],
    ['Body/Large', 'Manrope', 'Regular', 18, 29],
    ['Body/Default', 'Manrope', 'Regular', 16, 24],
    ['Body/Small', 'Manrope', 'Regular', 14, 21],
    ['Label/Default', 'Manrope', 'SemiBold', 13, 18],
    ['Label/Eyebrow', 'Manrope', 'SemiBold', 11, 16]
  ];
  for (const [name, family, style, size, line] of styles) {
    await figma.loadFontAsync({ family, style });
    const textStyle = figma.createTextStyle();
    textStyle.name = name;
    textStyle.fontName = { family, style };
    textStyle.fontSize = size;
    textStyle.lineHeight = { unit: 'PIXELS', value: line };
    if (name === 'Label/Eyebrow') textStyle.letterSpacing = { unit: 'PERCENT', value: 10 };
  }
}

async function buildCover(page) {
  const board = frame('Cover · Design System v1', 1440, 900, C.page);
  page.appendChild(board);
  board.appendChild(setPos(await label('Bake Again · Product Design'), 96, 88));
  const title = await text('Warm enough to invite.\nPrecise enough to trust.', 70, C.text, 'Newsreader', 'Regular');
  title.resize(900, 180); title.textAutoResize = 'HEIGHT';
  board.appendChild(setPos(title, 96, 230));
  const intro = await text('Design System v1 · Review applied\nFoundations, components and evidence language for web and mobile.', 18, C.secondary, 'Manrope', 'Regular');
  intro.resize(680, 80); intro.textAutoResize = 'HEIGHT';
  board.appendChild(setPos(intro, 100, 470));
  const accent = frame('Terracotta proof mark', 220, 220, C.terracotta);
  accent.cornerRadius = 110; accent.x = 1110; accent.y = 110;
  board.appendChild(accent);
  const line = figma.createRectangle(); line.name = 'Precision line'; line.resize(1120, 2); line.fills = paint(C.terracotta); line.x = 100; line.y = 720;
  board.appendChild(line);
  board.appendChild(setPos(await label('Practical before editorial  ·  Quality before quantity  ·  Clear uncertainty', C.text), 100, 760));
}

async function buildFoundations(page) {
  const board = frame('Foundations · Review applied', 1440, 2160, C.page);
  page.appendChild(board);
  board.appendChild(setPos(await sectionTitle('01', 'Foundation', 'Colour with quiet confidence.', 'Cream carries the page; linen separates practical areas; terracotta marks action and proof. Large saturated surfaces are exceptional.'), 80, 72));
  const swatches = [
    ['Page', 'Background/Page', C.page], ['Surface', 'Background/Surface', C.surface], ['Panel', 'Background/Panel', C.panel],
    ['Primary text', 'Text/Primary', C.text], ['Secondary text', 'Text/Secondary', C.secondary], ['Primary action', 'Action/Primary', C.terracotta]
  ];
  for (let i = 0; i < swatches.length; i++) {
    const [name, token, value] = swatches[i];
    const card = frame(`${name} · ${token}`, 190, 240, C.surface);
    card.x = 80 + i * 210; card.y = 300;
    const chip = frame('Colour', 190, 142, value); card.appendChild(chip);
    card.appendChild(setPos(await text(name, 14, C.text, 'Manrope', 'SemiBold'), 14, 160));
    card.appendChild(setPos(await text(token, 11, C.secondary, 'Manrope', 'Regular'), 14, 188));
    card.appendChild(setPos(await text(value, 11, C.secondary, 'Manrope', 'Regular'), 14, 210));
    board.appendChild(card);
  }
  board.appendChild(setPos(await sectionTitle('02', 'Foundation', 'Editorial voice, practical reading.', 'Newsreader creates quiet editorial character. Manrope keeps controls, instructions and recipe metadata immediately readable.'), 80, 670));
  const display = await text('Bake what you love.\nKnow what works.', 54, C.text, 'Newsreader', 'Regular');
  display.resize(620, 140); display.textAutoResize = 'HEIGHT'; board.appendChild(setPos(display, 80, 875));
  const body = await text('Clear instructions for real home baking. Exact ingredients, observable checkpoints and useful context come before background story.', 18, C.text, 'Manrope', 'Regular');
  body.resize(560, 120); body.textAutoResize = 'HEIGHT'; board.appendChild(setPos(body, 760, 890));
  board.appendChild(setPos(await sectionTitle('03', 'Foundation', 'Whitespace does the organising.', 'A compact 4-point scale supports both dense recipe controls and calm editorial layouts.'), 80, 1140));
  const spaces = [4, 8, 12, 16, 24, 32, 48, 64, 96];
  let x = 80;
  for (const s of spaces) {
    const bar = frame(`Space/${s}`, Math.max(s, 22), s, C.terracotta); bar.x = x; bar.y = 1370 + (96 - s);
    board.appendChild(bar); board.appendChild(setPos(await text(String(s), 11, C.secondary, 'Manrope', 'Regular'), x, 1488)); x += Math.max(s, 22) + 42;
  }
  board.appendChild(setPos(await sectionTitle('04', 'Evidence', 'Three states, three meanings.', 'Colour supplements the words; it never carries meaning alone.'), 80, 1650));
  const statuses = [
    ['Tested', '✓', C.testedBg, C.tested, 'Baked as written.'],
    ['Calculated', '▦', C.calculatedBg, C.calculated, 'Quantities scaled; not bake-tested.'],
    ['Suggested', '✦', C.suggestedBg, C.suggested, 'An idea to try; not bake-tested.']
  ];
  for (let i = 0; i < statuses.length; i++) {
    const [name, icon, bg, fg, desc] = statuses[i];
    const box = frame(`Status foundation/${name}`, 390, 170, C.surface); box.x = 80 + i * 420; box.y = 1880;
    const badge = await makeStatusExample(name, icon, bg, fg); badge.x = 20; badge.y = 22; box.appendChild(badge);
    box.appendChild(setPos(await text(desc, 14, C.text, 'Manrope', 'Regular'), 20, 96));
    board.appendChild(box);
  }
}

async function buildComponents(page) {
  const board = frame('Base components · Review applied', 1440, 2100, C.page); page.appendChild(board);
  board.appendChild(setPos(await sectionTitle('01', 'Base components', 'Useful controls, with little chrome.', 'Components are deliberately restrained so photography, decisions and evidence remain primary.'), 80, 72));
  board.appendChild(setPos(await label('Actions'), 80, 300));
  const buttons = [
    ['Primary', 'View recipe', 'Primary', 'Default'], ['Primary', 'View recipe', 'Primary', 'Hover'],
    ['Secondary', 'Save for later', 'Secondary', 'Default'], ['Secondary', 'Unavailable', 'Secondary', 'Disabled']
  ];
  let bx = 80;
  for (const spec of buttons) { const b = await makeButton(...spec); b.x = bx; b.y = 350; board.appendChild(b); bx += b.width + 28; }
  board.appendChild(setPos(await label('Search'), 80, 520));
  const search = await makeSearch(); search.x = 80; search.y = 570; board.appendChild(search);
  board.appendChild(setPos(await label('Recipe card'), 80, 740));
  const card = await makeRecipeCard(); card.x = 80; card.y = 790; board.appendChild(card);
  const notes = autoFrame('Recipe card anatomy', 'VERTICAL', 14, 28, C.panel); notes.resize(610, 310); notes.primaryAxisSizingMode = 'FIXED'; notes.counterAxisSizingMode = 'FIXED'; notes.x = 560; notes.y = 790;
  notes.appendChild(await text('Recipe card anatomy', 28, C.text, 'Newsreader', 'Regular'));
  notes.appendChild(await text('01  Food-first image\n02  Practical category and timing\n03  Familiar recipe name\n04  Decision facts\n05  Concise, version-specific evidence', 15, C.text, 'Manrope', 'Regular'));
  board.appendChild(notes);
  board.appendChild(setPos(await label('Evidence badges'), 80, 1450));
  const badgeData = [['Tested','✓',C.testedBg,C.tested],['Calculated','▦',C.calculatedBg,C.calculated],['Suggested','✦',C.suggestedBg,C.suggested]];
  bx = 80;
  for (const spec of badgeData) { const badge = await makeStatus(...spec); badge.x = bx; badge.y = 1500; board.appendChild(badge); bx += badge.width + 24; }
  const provenance = await makeProvenance(); provenance.x = 80; provenance.y = 1660; board.appendChild(provenance);
  const rule = await text('Tested describes a baked result.\nCalculated describes mathematically adjusted quantities.\nSuggested describes an untested proposed change.', 16, C.text, 'Manrope', 'Regular');
  rule.resize(560, 130); rule.textAutoResize = 'HEIGHT'; board.appendChild(setPos(rule, 680, 1665));
}

async function main() {
  const existingCollections = await figma.variables.getLocalVariableCollectionsAsync();
  for (const collection of existingCollections) {
    if (collection.name === 'Bake Again — Semantic') collection.remove();
  }
  const existingStyles = await figma.getLocalTextStylesAsync();
  for (const style of existingStyles) {
    if (style.name.startsWith('Bake Again/')) style.remove();
  }
  await createVariables();
  await createTextStyles();
  const current = figma.currentPage;
  current.name = '00 Cover';
  for (const child of current.children) child.remove();
  await buildCover(current);
  let foundations = figma.root.children.find(page => page.name === '01 Foundations');
  if (!foundations) foundations = figma.createPage();
  foundations.name = '01 Foundations';
  for (const child of foundations.children) child.remove();
  await buildFoundations(foundations);
  let components = figma.root.children.find(page => page.name === '02 Components');
  if (!components) components = figma.createPage();
  components.name = '02 Components';
  for (const child of components.children) child.remove();
  await buildComponents(components);
  await figma.setCurrentPageAsync(current);
  figma.viewport.scrollAndZoomIntoView(current.children);
  return { pages: figma.root.children.map(page => page.name), status: 'Bake Again Design System v1 created' };
}

main()
  .then(() => figma.closePlugin())
  .catch(error => {
    console.error(error);
    figma.notify(`Could not build design system: ${error.message}`, { error: true });
    figma.closePlugin();
  });
