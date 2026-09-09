export type StructuredIngredient = {
  id: string;
  name: string;
  amount: string;
  note?: string;
  optional?: boolean;
};

export type StructuredIngredientSection = {
  id: string;
  title: string;
  ingredients: StructuredIngredient[];
};

export type StructuredRecipeStep = {
  id: string;
  title: string;
  body: string;
  meta?: string;
  checkpoint?: string;
  tip?: string;
};

export type StructuredRecipeContent = {
  completeness: 'readyToReview' | 'incompleteSource';
  beforeStart?: string[];
  ingredientSections: StructuredIngredientSection[];
  steps: StructuredRecipeStep[];
  gapNote?: string;
};

export const structuredInventoryByRecipeId: Record<string, StructuredRecipeContent> = {
  'banana-bread': {
    completeness: 'incompleteSource',
    ingredientSections: [{
      id: 'loaf', title: 'Banana bread', ingredients: [
        { id: 'bananas', name: 'Very ripe bananas', amount: '3' },
        { id: 'butter', name: 'Butter, room temperature', amount: '½ cup' },
        { id: 'sugar', name: 'Sugar', amount: '¾ cup' },
        { id: 'eggs', name: 'Large eggs', amount: '2' },
        { id: 'flour', name: 'Schär Mix B Bread flour', amount: '1½ cups' },
        { id: 'baking-powder', name: 'Baking powder', amount: '1 tsp' },
        { id: 'salt', name: 'Salt', amount: '½ tsp' },
        { id: 'vanilla', name: 'Vanilla', amount: '½ tsp' },
        { id: 'walnuts', name: 'Walnuts', amount: '1 cup' },
        { id: 'raisins', name: 'Raisins', amount: '1 cup' },
      ],
    }],
    steps: [],
    gapNote: 'The handwritten source preserves ingredients only. Add the author’s preparation method, form and baking time before this can become a cookable recipe.',
  },
  'lazy-dumplings': {
    completeness: 'incompleteSource',
    beforeStart: ['Let the mixed dough rest for 15–30 minutes.'],
    ingredientSections: [{
      id: 'dumplings', title: 'Dumplings', ingredients: [
        { id: 'cottage-cheese', name: 'Cottage cheese', amount: '2 packs' },
        { id: 'eggs', name: 'Eggs', amount: '2' },
        { id: 'sugar', name: 'Sugar', amount: '3 tbsp' },
        { id: 'flour', name: 'Schär Mix B Bread flour', amount: '90 g' },
        { id: 'starch', name: 'Tapioca or corn starch', amount: '7 g', note: 'Choose one.' },
      ],
    }],
    steps: [
      { id: 'mix-wet', title: 'Mix cottage cheese, eggs and sugar', body: 'Combine until the mixture is even.' },
      { id: 'add-dry', title: 'Add flour and starch', body: 'Mix the flour and chosen starch first, then work them into the cottage-cheese mixture.' },
      { id: 'rest', title: 'Rest the dough', body: 'Leave the dough to stand for 15–30 minutes.', meta: '15–30 min' },
    ],
    gapNote: 'The source does not preserve shaping or cooking instructions. Add those author steps before publication.',
  },
  'apple-charlotte': {
    completeness: 'readyToReview',
    beforeStart: ['This source quantity is for one full large baking tray.', 'Put the tray into a preheated oven.'],
    ingredientSections: [{
      id: 'cake', title: 'Apple charlotte', ingredients: [
        { id: 'apples', name: 'Apples', amount: '5–6' },
        { id: 'eggs', name: 'Small eggs', amount: '10' },
        { id: 'sugar', name: 'Sugar', amount: '200 g' },
        { id: 'flour', name: 'Schär Mix B Bread flour', amount: '240 g' },
        { id: 'tapioca', name: 'Tapioca starch', amount: '30 g' },
        { id: 'xanthan', name: 'Xanthan gum', amount: '1 tsp' },
        { id: 'salt', name: 'Salt', amount: 'A pinch' },
        { id: 'vanilla', name: 'Vanillin', amount: 'To taste' },
        { id: 'cinnamon', name: 'Cinnamon', amount: 'To taste' },
      ],
    }],
    steps: [
      { id: 'prepare-apples', title: 'Prepare the apples', body: 'Finely chop the apples in a food processor. Line a baking tray with parchment and spread the apples over it.' },
      { id: 'whip-eggs', title: 'Whip the eggs and sugar', body: 'Beat the eggs and sugar until very light and voluminous.' },
      { id: 'mix-dry', title: 'Mix the dry ingredients', body: 'Combine the flour, tapioca starch, xanthan gum, salt, vanilla and cinnamon.' },
      { id: 'fold-batter', title: 'Finish the batter', body: 'Slowly add the dry mixture to the whipped eggs, then pour the batter over the apples.' },
      { id: 'bake', title: 'Bake', body: 'Bake in a hot oven until set and golden.', meta: '25–30 min', checkpoint: 'The source does not record the oven temperature; confirm it during the next bake.' },
    ],
  },
  'cottage-cheese-waffles': {
    completeness: 'readyToReview',
    beforeStart: ['Preheat the waffle maker thoroughly before the batter is ready.'],
    ingredientSections: [{
      id: 'waffles', title: 'Waffles', ingredients: [
        { id: 'cottage-cheese', name: 'Cottage cheese', amount: '500 g' },
        { id: 'eggs', name: 'Eggs', amount: '4' },
        { id: 'yogurt', name: 'Natural yogurt', amount: '200 ml' },
        { id: 'oil', name: 'Sunflower oil', amount: '60–80 ml' },
        { id: 'flour', name: 'Schär Mix B Bread flour', amount: '250 g' },
        { id: 'corn-starch', name: 'Corn starch', amount: '1 tbsp' },
        { id: 'baking-powder', name: 'Baking powder', amount: '2 tsp' },
        { id: 'sugar', name: 'Sugar', amount: '1 tbsp' },
        { id: 'salt', name: 'Salt', amount: 'A pinch' },
        { id: 'vanilla', name: 'Vanilla', amount: 'To taste' },
      ],
    }],
    steps: [
      { id: 'blend-base', title: 'Blend the cottage-cheese base', body: 'Blend the cottage cheese, eggs and yogurt until smooth.' },
      { id: 'season', title: 'Add the wet ingredients', body: 'Stir in the oil, sugar, salt and vanilla.' },
      { id: 'mix-dry', title: 'Mix the dry ingredients', body: 'Combine the flour, corn starch and baking powder.' },
      { id: 'make-batter', title: 'Make the batter', body: 'Add the dry mixture to the wet base and mix into a dough. Rest it briefly.', meta: '7–10 min' },
      { id: 'cook', title: 'Cook the waffles', body: 'Bake in a well-heated waffle maker until golden.', meta: '5–7 min per waffle' },
    ],
  },
  'carrot-cake': {
    completeness: 'readyToReview',
    beforeStart: ['This handwritten batch is noted as enough for three cakes.', 'Preheat the oven to 200°C.'],
    ingredientSections: [{
      id: 'cake', title: 'Carrot cake', ingredients: [
        { id: 'carrots', name: 'Carrots', amount: '500–600 g' },
        { id: 'oil', name: 'Oil', amount: '300 ml' },
        { id: 'eggs', name: 'Eggs', amount: '8' },
        { id: 'sugar', name: 'Sugar', amount: '300 g' },
        { id: 'flour', name: 'Schär Mix B Bread flour', amount: '500 g' },
        { id: 'baking-powder', name: 'Baking powder', amount: '16 g' },
        { id: 'salt', name: 'Salt', amount: '4 g' },
        { id: 'walnuts', name: 'Walnuts', amount: '300 g' },
        { id: 'raisins', name: 'Raisins', amount: '250 g', note: 'Soak before using.' },
      ],
    }],
    steps: [
      { id: 'blend-carrots', title: 'Blend the carrots', body: 'Grate the carrots, then blend them with oil until smooth.' },
      { id: 'whip-eggs', title: 'Whip the eggs and sugar', body: 'Beat until thick and foamy.' },
      { id: 'mix-dry', title: 'Mix the dry ingredients', body: 'Combine the flour, baking powder and salt, then mix into the wet ingredients.' },
      { id: 'fold-add-ins', title: 'Fold in raisins and walnuts', body: 'Soak the raisins first. Fold both add-ins into the finished batter.' },
      { id: 'bake', title: 'Bake', body: 'Butter the forms, divide in the batter and bake until set.', meta: '200°C · 35–40 min' },
    ],
  },
  'sponge-cake': {
    completeness: 'readyToReview',
    beforeStart: ['Preheat the oven. Grease only the bottom of the form.'],
    ingredientSections: [{
      id: 'sponge', title: 'Sponge', ingredients: [
        { id: 'eggs', name: 'Large eggs', amount: '5', note: 'Or 6 small eggs.' },
        { id: 'sugar', name: 'Sugar', amount: '120 g + 2 tbsp', note: 'The 2 tbsp are for the yolks.' },
        { id: 'corn-starch', name: 'Corn starch', amount: '15 g' },
        { id: 'tapioca', name: 'Tapioca starch', amount: '70 g' },
        { id: 'flour', name: 'Schär Mix B Bread flour', amount: '140 g' },
      ],
    }],
    steps: [
      { id: 'separate', title: 'Separate the eggs', body: 'Put whites and yolks into separate bowls.' },
      { id: 'whip-whites', title: 'Whip the whites', body: 'Beat the whites to a thick white foam. Add the main sugar gradually in 3–4 additions.' },
      { id: 'whip-yolks', title: 'Whip the yolks', body: 'Beat the yolks with 2 tbsp sugar until pale and thick.' },
      { id: 'fold-yolks', title: 'Fold yolks into whites', body: 'Gently fold the yolks into the whites with a spoon.' },
      { id: 'fold-dry', title: 'Fold in the dry ingredients', body: 'Add the flour and starches in 2–3 additions, folding gently.' },
      { id: 'bake', title: 'Bake', body: 'Transfer to the form and bake until set.', meta: '200°C · 40–50 min' },
    ],
  },
  crepes: {
    completeness: 'readyToReview',
    beforeStart: ['Rest the batter for 15–30 minutes before cooking.'],
    ingredientSections: [{
      id: 'batter', title: 'Crepe batter', ingredients: [
        { id: 'eggs', name: 'Eggs', amount: '5' },
        { id: 'flour', name: 'Schär Mix B Bread flour', amount: '5 tbsp' },
        { id: 'milk', name: 'Milk', amount: '500 ml' },
        { id: 'sugar', name: 'Sugar', amount: '1 tbsp' },
        { id: 'salt', name: 'Salt', amount: 'A pinch' },
        { id: 'oil', name: 'Oil', amount: '5 tbsp' },
        { id: 'water', name: 'Water', amount: '½ cup', note: 'Preferably hot.' },
      ],
    }],
    steps: [
      { id: 'start-batter', title: 'Start the batter', body: 'Whisk or blend eggs, flour, sugar, salt and a little milk until smooth and lump-free.' },
      { id: 'add-milk', title: 'Add the milk', body: 'Gradually add the remaining milk while mixing.' },
      { id: 'finish-batter', title: 'Finish the batter', body: 'Stir in the hot water and oil.' },
      { id: 'rest', title: 'Rest and adjust', body: 'Let the batter stand. Add extra milk or water if needed for a pourable consistency.', meta: '15–30 min', tip: 'The source deliberately leaves final consistency adjustable.' },
    ],
  },
  'crinkle-cookies': {
    completeness: 'readyToReview',
    beforeStart: ['Refrigerate the dough for 3–4 hours; it can stay chilled for up to 24 hours.', 'Preheat the oven to 180°C.'],
    ingredientSections: [{
      id: 'cookies', title: 'Cookies', ingredients: [
        { id: 'butter', name: 'Butter', amount: '60 g' },
        { id: 'eggs', name: 'Eggs', amount: '2' },
        { id: 'sugar', name: 'Sugar', amount: '200 g' },
        { id: 'cocoa', name: 'Cocoa powder', amount: '60 g' },
        { id: 'flour', name: 'Schär Mix B Bread flour', amount: '120 g' },
        { id: 'baking-powder', name: 'Baking powder', amount: '1 tsp' },
        { id: 'orange-zest', name: 'Orange zest', amount: '1 orange' },
        { id: 'powdered-sugar', name: 'Powdered sugar', amount: 'As needed', note: 'For coating.' },
      ],
    }],
    steps: [
      { id: 'beat-wet', title: 'Beat eggs, sugar and butter', body: 'Beat until pale.' },
      { id: 'mix-dry', title: 'Mix the dry ingredients', body: 'Combine cocoa, flour and baking powder.' },
      { id: 'make-dough', title: 'Make the dough', body: 'Beat the dry ingredients into the wet mixture until combined. Add the orange zest at the end.' },
      { id: 'chill', title: 'Chill', body: 'Cover the dough and refrigerate.', meta: '3–4 h · up to 24 h' },
      { id: 'shape', title: 'Shape and coat', body: 'Roll chilled dough into walnut-sized balls, coat generously in powdered sugar and space them well apart on a parchment-lined tray.' },
      { id: 'bake', title: 'Bake', body: 'Bake until risen and cracked.', meta: '180°C · 8–10 min', checkpoint: 'The cracks should still look moist.' },
    ],
  },
  'prune-cake': {
    completeness: 'incompleteSource',
    ingredientSections: [{
      id: 'cake', title: 'Cake · partial transcription', ingredients: [
        { id: 'eggs', name: 'Eggs', amount: '4' },
        { id: 'unknown-jars', name: 'Unclear ingredient', amount: '2 jars', note: 'Unreadable in the source.' },
        { id: 'sugar', name: 'Sugar', amount: '1 scant cup' },
        { id: 'unknown-spoons-one', name: 'Unclear ingredient', amount: '2 tbsp', note: 'Unreadable in the source.' },
        { id: 'unknown-spoons-two', name: 'Unclear ingredient', amount: '5–6 tbsp', note: 'Unreadable in the source.' },
        { id: 'leavener', name: 'Baking powder or lemon-quenched baking soda', amount: '2 tsp' },
        { id: 'cocoa', name: 'Cocoa', amount: '5 tbsp' },
        { id: 'flour', name: 'Schär Mix B Bread flour', amount: '5 tbsp' },
      ],
    }],
    steps: [
      { id: 'cream', title: 'Make the cream', body: 'Mix sour cream or cream with powdered sugar to taste.' },
      { id: 'glaze', title: 'Make the chocolate glaze', body: 'The source lists sour cream, butter and an unreadable quantity; confirm the full formula before baking.' },
    ],
    gapNote: 'The old note contains several unreadable ingredients and does not preserve the cake method. Keep this as a structured research draft until the original is confirmed.',
  },
  'fruit-sponge-roll': {
    completeness: 'readyToReview',
    beforeStart: ['Line a baking tray with parchment.', 'Roll the sponge while warm, then cool before filling.'],
    ingredientSections: [
      { id: 'sponge', title: 'Sponge', ingredients: [
        { id: 'eggs', name: 'Eggs', amount: '5' }, { id: 'sugar', name: 'Sugar', amount: '100 g' }, { id: 'salt', name: 'Salt', amount: 'A little' }, { id: 'oil', name: 'Oil', amount: '35 ml' }, { id: 'water', name: 'Water', amount: '35 ml' }, { id: 'flour', name: 'Schär Mix B Bread flour', amount: '120 g' },
      ] },
      { id: 'cream', title: 'Cream', ingredients: [
        { id: 'cream', name: 'Whipping cream', amount: '250 ml' }, { id: 'sugar', name: 'Sugar', amount: '80 g' }, { id: 'mascarpone', name: 'Mascarpone', amount: '250 g' },
      ] },
      { id: 'filling', title: 'Filling and decoration', ingredients: [
        { id: 'jam', name: 'Blueberry jam', amount: 'To spread' }, { id: 'strawberries', name: 'Strawberries', amount: 'To decorate' }, { id: 'mint', name: 'Mint', amount: 'To decorate', optional: true }, { id: 'almonds', name: 'Almonds', amount: 'To decorate', optional: true },
      ] },
    ],
    steps: [
      { id: 'whip-eggs', title: 'Whip eggs, sugar and salt', body: 'Whip to a full bowl of thick, pale foam.', meta: 'About 10 min' },
      { id: 'fold-liquids', title: 'Fold in oil and water', body: 'Gently fold in the oil, then the water.' },
      { id: 'fold-flour', title: 'Fold in flour', body: 'Gradually add the flour and fold carefully.' },
      { id: 'bake-roll', title: 'Bake and roll', body: 'Spread on parchment-lined tray, bake, then roll and cool.', meta: '180–200°C · 15–20 min', checkpoint: 'Confirm the exact oven temperature and rolling method on the next bake.' },
      { id: 'make-cream', title: 'Make the mascarpone cream', body: 'Whip cream with sugar, then fold in mascarpone.' },
      { id: 'fill', title: 'Fill and decorate', body: 'Spread blueberry jam, add the cream, then finish with strawberries, mint and almonds.' },
    ],
  },
};

export function getStructuredInventoryRecipe(recipeId: string) {
  return structuredInventoryByRecipeId[recipeId];
}
