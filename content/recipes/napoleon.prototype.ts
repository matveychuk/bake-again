export type PrototypeMediaItem = {
  id: string;
  src: string;
  alt: string;
  cookAlt?: string;
  title: string;
  caption: string;
  cookCaption?: string;
};

export type PrototypeStep = {
  canonicalStepIds: [string, ...string[]];
  number: string;
  title: string;
  recipeTitle?: string;
  recipeBody: string;
  cookBody: string;
  meta: string;
  ingredients: string[];
  ingredientLineIds?: string[];
  guidance?: string;
  recipeGuidance?: string;
  tips?: string[];
  mediaIds?: string[];
  timerSeconds?: number;
};

export const NAPOLEON_METHOD_STEP_COUNT = 17;

export const napoleonPrototypeMedia: PrototypeMediaItem[] = [
  { id: 'butter-ready', src: '/media/recipes/gluten-free-napoleon/selected/cold-butter-ready-example-v1.png', alt: 'Cold butter cubes beside the dry flour mixture in a food processor', cookAlt: 'Cold butter cubes beside the dry flour mixture', title: 'Start cold', caption: 'Cube the butter and chill it for 10–15 minutes.', cookCaption: 'The butter should be firm before it goes into the processor.' },
  { id: 'butter-early-pulse', src: '/media/recipes/gluten-free-napoleon/selected/cold-butter-early-pulse-example-v1.png', alt: 'Large pieces of butter partly coated in gluten-free flour after a few pulses', cookAlt: 'Butter partly coated in gluten-free flour', title: 'Pulse briefly', caption: 'Stop before every piece of butter disappears into the flour.' },
  { id: 'butter-final-crumb', src: '/media/recipes/gluten-free-napoleon/selected/cold-butter-crumb-example-v1.png', alt: 'Gluten-free flour mixture with a sandy crumb and visible pea-sized pieces of cold butter', cookAlt: 'Sandy crumb with pea-sized pieces of butter', title: 'Look for this texture', caption: 'Some should look sandy while pea-sized pieces remain visible.', cookCaption: 'A mix of sandy crumb and visible butter pieces is correct.' },
  { id: 'wet-mixture-smooth', src: '/media/recipes/gluten-free-napoleon/selected/wet-mixture-smooth-example-v1.png', alt: 'Eggs, cultured dairy, sunflower oil and lemon juice mixed until smooth', cookAlt: 'Wet ingredients mixed until smooth', title: 'Mix only until smooth', caption: 'The wet ingredients should be even, without prolonged whisking.', cookCaption: 'The mixture should be even, without prolonged whisking.' },
  { id: 'pour-wet-mixture', src: '/media/recipes/gluten-free-napoleon/selected/pour-wet-into-crumb-example-v1.png', alt: 'Smooth wet mixture being poured into the flour and butter crumb', cookAlt: 'Wet mixture being poured into the flour crumb', title: 'Add the wet mixture', caption: 'Pour it over the crumb before using short pulses.', cookCaption: 'Pour it evenly over the crumb before pulsing.' },
  { id: 'dough-clumps', src: '/media/recipes/gluten-free-napoleon/selected/pliable-dough-clumps-example-v1.png', alt: 'Pliable Napoleon dough gathered into irregular clumps in a food processor', cookAlt: 'Pliable dough gathered into clumps', title: 'Stop at pliable clumps', caption: 'The dough should hold together without becoming a sticky paste.', cookCaption: 'The dough should hold together without becoming sticky.' },
];

export const napoleonPrototypeSteps: PrototypeStep[] = [
  {
    canonicalStepIds: ['mix-dry-dough'],
    number: '01',
    title: 'Mix the dry ingredients',
    recipeBody: 'In a food processor, mix the Schär Mix B, both starches, xanthan, baking powder, salt and sugar for 5–10 seconds.',
    cookBody: 'Add the flour mix, both starches, xanthan, baking powder, salt and sugar. Mix briefly so everything is evenly distributed.',
    meta: '5–10 sec · food processor',
    ingredients: ['450 g Schär Mix B', '80 g tapioca starch', '40 g corn starch', '3 g xanthan gum', '8 g baking powder', '¼ tsp salt', '1 tbsp sugar'],
    ingredientLineIds: ['schar-mix-b', 'tapioca-dough', 'corn-starch-dough', 'xanthan', 'baking-powder', 'salt-dough', 'sugar-dough'],
  },
  {
    canonicalStepIds: ['cut-in-butter'],
    number: '02',
    title: 'Cut in the cold butter',
    recipeBody: 'Cube the cold butter, freeze it for 10–15 minutes, add it to the dry mixture and pulse about ten times.',
    cookBody: 'Cube the butter and chill it well. Add it to the dry mixture and pulse about ten times—do not process it into a uniform paste.',
    meta: '10–15 min · food processor',
    ingredients: ['120 g cold butter'],
    ingredientLineIds: ['butter-dough'],
    guidance: 'Look for an uneven crumb: some sandy, with some pea-sized pieces of butter still visible.',
    recipeGuidance: 'Look for an uneven crumb: some sandy, with some pea-sized pieces of butter.',
    mediaIds: ['butter-ready', 'butter-early-pulse', 'butter-final-crumb'],
    timerSeconds: 600,
  },
  {
    canonicalStepIds: ['mix-wet-dough'],
    number: '03',
    title: 'Mix the wet ingredients',
    recipeTitle: 'Add the wet ingredients',
    recipeBody: 'Mix the eggs, chosen cultured dairy, sunflower oil and lemon juice only until smooth.',
    cookBody: 'Stir the eggs, cultured dairy, sunflower oil and lemon juice only until smooth. There is no need to add air.',
    meta: 'Wet mixture',
    ingredients: ['2 eggs', '250 g sour cream or thick yogurt', '50 g sunflower oil', '1 tbsp lemon juice'],
    ingredientLineIds: ['eggs-dough', 'cultured-dairy-dough', 'oil-dough', 'lemon-juice'],
    mediaIds: ['wet-mixture-smooth'],
  },
  {
    canonicalStepIds: ['combine-dough'],
    number: '04',
    title: 'Combine the dough',
    recipeBody: 'Pour the liquid into the dry mixture and combine with short pulses. Add cold water only as needed.',
    cookBody: 'Pour the wet mixture over the crumb and combine with short pulses. Add cold water only if the dough still will not gather.',
    meta: 'Food processor · short pulses',
    ingredients: ['Wet mixture', '30–70 ml cold water, as needed'],
    ingredientLineIds: ['cold-water'],
    guidance: 'Stop when the dough gathers into pliable clumps. It should not become a sticky paste.',
    recipeGuidance: 'The dough should gather into pliable clumps, not become a sticky paste.',
    mediaIds: ['pour-wet-mixture', 'dough-clumps'],
  },
  {
    canonicalStepIds: ['roll-layer'],
    number: '05',
    title: 'Roll directly on parchment',
    recipeBody: 'Place each chilled disc on its own sheet of parchment and roll it into an even 28 cm circle. Bake it on the same sheet—do not transfer the rolled dough.',
    cookBody: 'Place each chilled disc on its own sheet and roll it into an even 28 cm circle. Bake on the same sheet—do not transfer the rolled dough.',
    meta: 'One sheet per layer',
    ingredients: ['1 chilled dough disc', '1 sheet of baking parchment'],
    tips: ['Use the base of a 28 cm cake tin as a guide, leaving a small margin for trimming.'],
    guidance: 'The layer should be evenly thin, with no thicker centre or dry, cracked edges.',
  },
];
