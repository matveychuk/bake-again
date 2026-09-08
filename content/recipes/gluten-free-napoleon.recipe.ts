import type { RecipeDraft } from "./recipe.types";

export const glutenFreeNapoleonRecipe = {
  schemaVersion: 1,
  id: "gluten-free-napoleon",
  versionId: "gluten-free-napoleon-v1-draft",
  publicationStatus: "draft",
  translationState: {
    uk: "sourceDraft",
    en: "draftTranslation",
    es: "draftTranslation",
  },
  slug: {
    uk: "bezghliutenovyi-napoleon",
    en: "gluten-free-napoleon-cake",
    es: "tarta-napoleon-sin-gluten",
  },
  title: {
    uk: "Безглютеновий Наполеон",
    en: "Gluten-Free Napoleon Cake",
    es: "Tarta Napoleón sin gluten",
  },
  summary: {
    uk: "Два торти по 6 тонких коржів діаметром 28 см із теплим заварним кремом і горіхами.",
    en: "Two cakes with six thin 28 cm layers each, warm custard and nuts.",
    es: "Dos tartas con seis capas finas de 28 cm cada una, crema pastelera templada y frutos secos.",
  },
  categoryIds: ["celebration", "layer-cake"],
  situationIds: ["celebration", "prepare-ahead"],
  difficulty: "advanced",
  baseProvenance: {
    state: "repeatedlyVerified",
    sourceIds: [
      "inventory-row",
      "archive-recipe",
      "archive-status-note",
      "author-update",
    ],
    note: "The author's current update supersedes the historical four-star first-success label; the current base has been made many times.",
  },
  timing: {
    activeMinutes: 60,
    totalElapsedMinutes: null,
    phases: [
      {
        id: "freeze-butter",
        label: {
          uk: "Охолодження нарізаного масла",
          en: "Freezing the cubed butter",
          es: "Enfriado de la mantequilla en dados",
        },
        duration: { kind: "range", min: 10, max: 15, unit: "minute" },
      },
      {
        id: "chill-dough",
        label: {
          uk: "Охолодження тіста",
          en: "Dough chilling",
          es: "Refrigeración de la masa",
        },
        duration: { kind: "minimum", min: 2, unit: "hour" },
      },
      {
        id: "bake-one-layer",
        label: {
          uk: "Випікання одного коржа",
          en: "Baking one layer",
          es: "Horneado de una capa",
        },
        duration: { kind: "range", min: 7, max: 10, unit: "minute" },
      },
      {
        id: "toast-walnuts",
        label: {
          uk: "Підсушування волоських горіхів",
          en: "Toasting walnuts",
          es: "Tostado de las nueces",
        },
        duration: { kind: "range", min: 8, max: 10, unit: "minute" },
      },
      {
        id: "toast-almonds",
        label: {
          uk: "Підсушування мигдальних пластівців",
          en: "Toasting flaked almonds",
          es: "Tostado de las almendras laminadas",
        },
        duration: { kind: "range", min: 4, max: 5, unit: "minute" },
      },
      {
        id: "room-temperature-rest",
        label: {
          uk: "Витримка після складання",
          en: "Rest after assembly",
          es: "Reposo después del montaje",
        },
        duration: { kind: "exact", value: 1, unit: "hour" },
      },
      {
        id: "refrigerated-maturation",
        label: {
          uk: "Дозрівання в холодильнику",
          en: "Refrigerated maturation",
          es: "Reposo en la nevera",
        },
        duration: { kind: "range", min: 12, max: 24, unit: "hour" },
      },
    ],
  },
  yield: {
    default: {
      id: "two-six-layer-cakes",
      label: {
        uk: "2 торти по 6 коржів",
        en: "2 cakes with 6 layers each",
        es: "2 tartas de 6 capas cada una",
      },
      amount: 2,
      unit: "cake",
      details: {
        uk: "Усього 12 коржів; кожен торт має 6 коржів діаметром 28 см",
        en: "12 layers in total; each cake has six 28 cm layers",
        es: "12 capas en total; cada tarta tiene seis capas de 28 cm",
      },
      provenance: {
        state: "repeatedlyVerified",
        sourceIds: ["archive-recipe", "author-update"],
      },
      availability: "default",
    },
    alternatives: [],
  },
  forms: {
    default: {
      id: "round-28cm-6-layers-each",
      label: {
        uk: "Для кожного торта 6 круглих коржів діаметром 28 см",
        en: "Six 28 cm round layers for each cake",
        es: "Seis capas redondas de 28 cm para cada tarta",
      },
      shape: "round",
      diameterCm: 28,
      layerCount: 6,
      material: null,
      provenance: {
        state: "repeatedlyVerified",
        sourceIds: ["archive-recipe", "author-update"],
      },
      availability: "default",
    },
    alternatives: [
      {
        id: "round-24cm-preview",
        label: {
          uk: "Кругла форма 24 см — лише розрахунковий перегляд",
          en: "24 cm round form — calculation preview only",
          es: "Formato redondo de 24 cm — solo vista previa calculada",
        },
        shape: "round",
        diameterCm: 24,
        layerCount: null,
        material: null,
        provenance: {
          state: "calculated",
          sourceIds: ["ux-form-example"],
          note: "The UX baseline permits an area-based preview but explicitly blocks Cook Mode until eggs, layer count, cream volume and the result are resolved and tested.",
        },
        availability: "previewOnly",
        blockingGapIds: ["validate-24cm-form"],
      },
    ],
  },
  equipment: [
    {
      id: "food-processor",
      name: {
        uk: "кухонний комбайн",
        en: "food processor",
        es: "robot de cocina",
      },
    },
    {
      id: "parchment",
      name: {
        uk: "пергамент",
        en: "baking parchment",
        es: "papel de horno",
      },
    },
    {
      id: "fork",
      name: { uk: "виделка", en: "fork", es: "tenedor" },
    },
    {
      id: "large-saucepan",
      name: {
        uk: "велика каструля",
        en: "large saucepan",
        es: "cacerola grande",
      },
    },
    {
      id: "whisk",
      name: { uk: "вінчик", en: "whisk", es: "varillas" },
    },
    {
      id: "28cm-template",
      name: {
        uk: "круглий шаблон 28 см",
        en: "28 cm round template",
        es: "plantilla redonda de 28 cm",
      },
    },
  ],
  flourConfiguration: {
    commercialMixLineId: "schar-mix-b",
    additionalStarchLineIds: ["tapioca-dough", "corn-starch-dough"],
    xanthanLineId: "xanthan",
    provenance: {
      state: "repeatedlyVerified",
      sourceIds: ["inventory-row", "archive-recipe", "archive-status-note"],
    },
    testedAlternativeMixes: [],
    knownUnsupportedMixes: [],
  },
  beforeStart: [
    {
      id: "plan-dough-chill",
      relatedStepId: "divide-and-chill",
      text: {
        uk: "Охолоджуйте 12 загорнутих дисків тіста щонайменше 2 години; можна залишити на ніч.",
        en: "Chill the twelve wrapped dough discs for at least 2 hours; they may be left overnight.",
        es: "Refrigera los doce discos de masa envueltos durante al menos 2 horas; pueden dejarse toda la noche.",
      },
    },
    {
      id: "plan-roll-on-parchment",
      relatedStepId: "roll-layer",
      text: {
        uk: "Розкачуйте кожен корж між листами пергаменту, на якому його випікатимете.",
        en: "Roll each layer between the sheets of parchment used for baking it.",
        es: "Estira cada capa entre las hojas de papel sobre las que se horneará.",
      },
    },
    {
      id: "plan-maturation",
      relatedStepId: "refrigerate-cake",
      text: {
        uk: "Після складання торт потребує приблизно 1 години при кімнатній температурі та 12–24 годин у холодильнику.",
        en: "After assembly, the cake needs about 1 hour at room temperature and 12–24 hours in the refrigerator.",
        es: "Después del montaje, la tarta necesita aproximadamente 1 hora a temperatura ambiente y 12–24 horas en la nevera.",
      },
    },
  ],
  ingredientSections: [
    {
      id: "layers",
      title: { uk: "Коржі", en: "Layers", es: "Capas" },
      lines: [
        {
          id: "schar-mix-b",
          options: [
            {
              ingredientId: "schar-mix-b-bread",
              name: {
                uk: "борошняна суміш Schär Mix B Bread",
                en: "Schär Mix B Bread flour mix",
                es: "mezcla de harina Schär Mix B Bread",
              },
            },
          ],
          amount: { kind: "exact", value: 450, unit: "g" },
        },
        {
          id: "tapioca-dough",
          options: [
            {
              ingredientId: "tapioca-starch",
              name: {
                uk: "тапіоковий крохмаль",
                en: "tapioca starch",
                es: "almidón de tapioca",
              },
            },
          ],
          amount: { kind: "exact", value: 80, unit: "g" },
        },
        {
          id: "corn-starch-dough",
          options: [
            {
              ingredientId: "corn-starch",
              name: {
                uk: "кукурудзяний крохмаль",
                en: "corn starch",
                es: "almidón de maíz",
              },
            },
          ],
          amount: { kind: "exact", value: 40, unit: "g" },
        },
        {
          id: "xanthan",
          options: [
            {
              ingredientId: "xanthan-gum",
              name: {
                uk: "ксантанова камедь",
                en: "xanthan gum",
                es: "goma xantana",
              },
            },
          ],
          amount: { kind: "exact", value: 3, unit: "g" },
          condition: {
            uk: "лише якщо її немає у складі суміші",
            en: "only if the flour mix does not contain it",
            es: "solo si la mezcla de harina no la contiene",
          },
        },
        {
          id: "baking-powder",
          options: [
            {
              ingredientId: "baking-powder",
              name: {
                uk: "розпушувач",
                en: "baking powder",
                es: "levadura química",
              },
            },
          ],
          amount: { kind: "exact", value: 8, unit: "g" },
        },
        {
          id: "salt-dough",
          options: [
            {
              ingredientId: "salt",
              name: { uk: "сіль", en: "salt", es: "sal" },
            },
          ],
          amount: { kind: "exact", value: 0.25, unit: "tsp" },
        },
        {
          id: "sugar-dough",
          options: [
            {
              ingredientId: "granulated-sugar",
              name: { uk: "цукор", en: "sugar", es: "azúcar" },
            },
          ],
          amount: { kind: "exact", value: 1, unit: "tbsp" },
        },
        {
          id: "butter-dough",
          options: [
            {
              ingredientId: "butter",
              name: {
                uk: "вершкове масло",
                en: "butter",
                es: "mantequilla",
              },
            },
          ],
          amount: { kind: "exact", value: 120, unit: "g" },
          preparation: {
            uk: "холодне, нарізати кубиками",
            en: "cold, cut into cubes",
            es: "fría, cortada en dados",
          },
        },
        {
          id: "oil-dough",
          options: [
            {
              ingredientId: "sunflower-oil",
              name: {
                uk: "соняшникова олія",
                en: "sunflower oil",
                es: "aceite de girasol",
              },
            },
          ],
          amount: { kind: "exact", value: 50, unit: "g" },
          provenance: {
            state: "repeatedlyVerified",
            sourceIds: ["author-update"],
            note: "The author confirmed sunflower oil as the current oil.",
          },
        },
        {
          id: "cultured-dairy-dough",
          options: [
            {
              ingredientId: "sour-cream",
              name: {
                uk: "сметана",
                en: "sour cream",
                es: "crema agria",
              },
            },
            {
              ingredientId: "thick-natural-yogurt",
              name: {
                uk: "густий натуральний йогурт",
                en: "thick natural yogurt",
                es: "yogur natural espeso",
              },
            },
          ],
          choose: 1,
          amount: { kind: "exact", value: 250, unit: "g" },
          provenance: {
            state: "authorGuidance",
            sourceIds: ["archive-recipe"],
            note: "The source offers either option but does not identify a default or the test scope of each option.",
          },
        },
        {
          id: "eggs-dough",
          options: [
            {
              ingredientId: "whole-egg",
              name: { uk: "яйця", en: "eggs", es: "huevos" },
            },
          ],
          amount: { kind: "exact", value: 2, unit: "piece" },
        },
        {
          id: "lemon-juice",
          options: [
            {
              ingredientId: "lemon-juice",
              name: {
                uk: "лимонний сік",
                en: "lemon juice",
                es: "zumo de limón",
              },
            },
          ],
          amount: { kind: "exact", value: 1, unit: "tbsp" },
        },
        {
          id: "cold-water",
          options: [
            {
              ingredientId: "water",
              name: { uk: "холодна вода", en: "cold water", es: "agua fría" },
            },
          ],
          amount: { kind: "range", min: 30, max: 70, unit: "ml" },
          qualifier: {
            uk: "за потреби",
            en: "as needed",
            es: "según sea necesario",
          },
        },
      ],
    },
    {
      id: "custard",
      title: {
        uk: "Заварний крем — поточне робоче значення 2,5 л молока",
        en: "Custard — current working amount is 2.5 l milk",
        es: "Crema — la cantidad de trabajo actual es 2,5 l de leche",
      },
      provenance: {
        state: "authorGuidance",
        sourceIds: ["archive-recipe", "inventory-row", "author-update"],
        note: "The archived formula uses 2.5 l milk. The author retained 2.5 l as the current working value but plans to confirm it later.",
      },
      lines: [
        {
          id: "milk-custard",
          options: [
            {
              ingredientId: "milk",
              name: { uk: "молоко", en: "milk", es: "leche" },
            },
          ],
          amount: { kind: "exact", value: 2500, unit: "ml" },
        },
        {
          id: "eggs-custard",
          options: [
            {
              ingredientId: "whole-egg",
              name: { uk: "яйця", en: "eggs", es: "huevos" },
            },
          ],
          amount: { kind: "exact", value: 2, unit: "piece" },
        },
        {
          id: "egg-whites-custard",
          options: [
            {
              ingredientId: "egg-white",
              name: {
                uk: "яєчні білки",
                en: "egg whites",
                es: "claras de huevo",
              },
            },
          ],
          amount: { kind: "exact", value: 3, unit: "piece" },
        },
        {
          id: "sugar-custard",
          options: [
            {
              ingredientId: "granulated-sugar",
              name: { uk: "цукор", en: "sugar", es: "azúcar" },
            },
          ],
          amount: { kind: "exact", value: 410, unit: "g" },
        },
        {
          id: "corn-starch-custard",
          options: [
            {
              ingredientId: "corn-starch",
              name: {
                uk: "кукурудзяний крохмаль",
                en: "corn starch",
                es: "almidón de maíz",
              },
            },
          ],
          amount: { kind: "exact", value: 170, unit: "g" },
        },
        {
          id: "tapioca-custard",
          options: [
            {
              ingredientId: "tapioca-starch",
              name: {
                uk: "тапіоковий крохмаль",
                en: "tapioca starch",
                es: "almidón de tapioca",
              },
            },
          ],
          amount: { kind: "exact", value: 20, unit: "g" },
        },
        {
          id: "butter-custard",
          options: [
            {
              ingredientId: "butter",
              name: {
                uk: "вершкове масло",
                en: "butter",
                es: "mantequilla",
              },
            },
          ],
          amount: { kind: "range", min: 90, max: 100, unit: "g" },
        },
        {
          id: "vanilla-sugar-custard",
          options: [
            {
              ingredientId: "vanilla-sugar",
              name: {
                uk: "ванільний цукор",
                en: "vanilla sugar",
                es: "azúcar vainillado",
              },
            },
          ],
          amount: { kind: "range", min: 16, max: 24, unit: "g" },
          qualifier: {
            uk: "2–3 пакетики по 8 г",
            en: "2–3 packets of 8 g",
            es: "2–3 sobres de 8 g",
          },
          provenance: {
            state: "calculated",
            sourceIds: ["archive-recipe", "author-update"],
            note: "Calculated from the archived 2–3 packet range and the author-confirmed 8 g packet size.",
          },
        },
        {
          id: "salt-custard",
          options: [
            {
              ingredientId: "salt",
              name: { uk: "сіль", en: "salt", es: "sal" },
            },
          ],
          amount: { kind: "exact", value: 1, unit: "pinch" },
        },
      ],
    },
    {
      id: "assembly",
      title: { uk: "Горіхи та оздоблення", en: "Nuts and finish", es: "Frutos secos y acabado" },
      lines: [
        {
          id: "walnuts",
          options: [
            {
              ingredientId: "walnut",
              name: {
                uk: "волоські горіхи",
                en: "walnuts",
                es: "nueces",
              },
            },
          ],
          amount: { kind: "range", min: 120, max: 150, unit: "g" },
        },
        {
          id: "flaked-almonds",
          options: [
            {
              ingredientId: "flaked-almond",
              name: {
                uk: "мигдальні пластівці",
                en: "flaked almonds",
                es: "almendras laminadas",
              },
            },
          ],
          amount: { kind: "range", min: 30, max: 50, unit: "g" },
        },
      ],
    },
  ],
  steps: [
    {
      id: "mix-dry-dough",
      instruction: {
        uk: "У чаші комбайна змішати Schär Mix B, обидва крохмалі, ксантан, розпушувач, сіль і цукор 5–10 секунд.",
        en: "In a food processor, mix the Schär Mix B, both starches, xanthan, baking powder, salt and sugar for 5–10 seconds.",
        es: "En el robot de cocina, mezcla Schär Mix B, los dos almidones, la goma xantana, la levadura química, la sal y el azúcar durante 5–10 segundos.",
      },
      ingredientLineIds: [
        "schar-mix-b",
        "tapioca-dough",
        "corn-starch-dough",
        "xanthan",
        "baking-powder",
        "salt-dough",
        "sugar-dough",
      ],
      duration: { kind: "range", min: 5, max: 10, unit: "second" },
      equipmentIds: ["food-processor"],
    },
    {
      id: "cut-in-butter",
      instruction: {
        uk: "Нарізати холодне масло кубиками, покласти на 10–15 хвилин у морозилку, додати до сухої суміші й зробити приблизно 10 коротких імпульсів.",
        en: "Cube the cold butter, freeze it for 10–15 minutes, add it to the dry mixture and pulse about ten times.",
        es: "Corta la mantequilla fría en dados, déjala 10–15 minutos en el congelador, añádela a la mezcla seca y da unos diez impulsos cortos.",
      },
      ingredientLineIds: ["butter-dough"],
      duration: { kind: "range", min: 10, max: 15, unit: "minute" },
      equipmentIds: ["food-processor"],
      guidance: [
        {
          id: "uneven-crumb",
          kind: "checkpoint",
          text: {
            uk: "Потрібна неоднорідна крихта: частина як пісок, частина — шматочки масла розміром з горошину.",
            en: "The crumb should be uneven: some sandy, with some pea-sized pieces of butter.",
            es: "La miga debe quedar irregular: una parte arenosa y otra con trozos de mantequilla del tamaño de un guisante.",
          },
        },
      ],
    },
    {
      id: "mix-wet-dough",
      instruction: {
        uk: "Змішати яйця, обраний кисломолочний продукт, соняшникову олію та лимонний сік лише до однорідності.",
        en: "Mix the eggs, chosen cultured dairy, sunflower oil and lemon juice only until smooth.",
        es: "Mezcla los huevos, el lácteo fermentado elegido, el aceite de girasol y el zumo de limón solo hasta obtener una mezcla homogénea.",
      },
      ingredientLineIds: [
        "eggs-dough",
        "cultured-dairy-dough",
        "oil-dough",
        "lemon-juice",
      ],
    },
    {
      id: "combine-dough",
      instruction: {
        uk: "Влити рідину в суху суміш і змішати короткими імпульсами. За потреби додати холодну воду.",
        en: "Pour the liquid into the dry mixture and combine with short pulses. Add cold water as needed.",
        es: "Vierte la mezcla líquida sobre la seca y mezcla con impulsos cortos. Añade agua fría según sea necesario.",
      },
      ingredientLineIds: ["cold-water"],
      equipmentIds: ["food-processor"],
      guidance: [
        {
          id: "dough-consistency",
          kind: "checkpoint",
          text: {
            uk: "Тісто має збиратися грудками, бути пластичним і не бути липкою кашею.",
            en: "The dough should gather into clumps, feel pliable and not become a sticky paste.",
            es: "La masa debe agruparse en grumos, ser maleable y no convertirse en una pasta pegajosa.",
          },
        },
      ],
    },
    {
      id: "fold-dough",
      instruction: {
        uk: "Швидко зібрати тісто руками, скласти 2–3 рази й сформувати диск. Не вимішувати довго.",
        en: "Quickly bring the dough together by hand, fold it 2–3 times and shape it into a disc. Do not knead for long.",
        es: "Junta rápidamente la masa con las manos, pliégala 2–3 veces y forma un disco. No la amases mucho tiempo.",
      },
      ingredientLineIds: [],
    },
    {
      id: "divide-and-chill",
      instruction: {
        uk: "Розділити тісто на 12 дисків, кожен загорнути й охолоджувати щонайменше 2 години; можна залишити на ніч.",
        en: "Divide the dough into twelve discs, wrap each one and chill for at least 2 hours; they may be left overnight.",
        es: "Divide la masa en doce discos, envuelve cada uno y refrigera durante al menos 2 horas; pueden dejarse toda la noche.",
      },
      ingredientLineIds: [],
      duration: { kind: "minimum", min: 2, unit: "hour" },
    },
    {
      id: "temper-disc",
      instruction: {
        uk: "Діставати по одному диску. Якщо він дуже твердий, залишити на столі на 5–10 хвилин.",
        en: "Take out one disc at a time. If it is very firm, leave it on the counter for 5–10 minutes.",
        es: "Saca un disco cada vez. Si está muy duro, déjalo sobre la encimera durante 5–10 minutos.",
      },
      ingredientLineIds: [],
      duration: { kind: "range", min: 5, max: 10, unit: "minute" },
    },
    {
      id: "roll-layer",
      instruction: {
        uk: "Розкачати диск між двома листами пергаменту до товщини приблизно 1,5 мм. Вирізати круг діаметром 28 см, залишити обрізки поруч і проколоти виделкою.",
        en: "Roll the disc between two sheets of parchment to about 1.5 mm thick. Cut a 28 cm circle, leave the scraps beside it and prick with a fork.",
        es: "Estira el disco entre dos hojas de papel de horno hasta unos 1,5 mm. Corta un círculo de 28 cm, deja los recortes al lado y pínchalo con un tenedor.",
      },
      ingredientLineIds: [],
      equipmentIds: ["parchment", "fork", "28cm-template"],
      guidance: [
        {
          id: "roll-on-baking-parchment",
          kind: "practicalTip",
          text: {
            uk: "Розкачуйте корж на пергаменті, на якому він випікатиметься, щоб не переносити тонке тісто.",
            en: "Roll the layer on the parchment used for baking so the thin dough does not need to be transferred.",
            es: "Estira la capa sobre el papel en el que se horneará para no tener que trasladar la masa fina.",
          },
        },
      ],
    },
    {
      id: "bake-layer",
      instruction: {
        uk: "Випікати корж разом з обрізками при 190°C приблизно 7–10 хвилин.",
        en: "Bake the layer with its scraps at 190°C for about 7–10 minutes.",
        es: "Hornea la capa con sus recortes a 190°C durante unos 7–10 minutos.",
      },
      ingredientLineIds: [],
      duration: { kind: "range", min: 7, max: 10, unit: "minute" },
      temperature: { value: 190, unit: "C", ovenMode: "conventional" },
      equipmentIds: ["parchment"],
      guidance: [
        {
          id: "light-golden-layer",
          kind: "checkpoint",
          text: {
            uk: "Корж має стати світло-золотистим.",
            en: "The layer should be light golden.",
            es: "La capa debe quedar ligeramente dorada.",
          },
        },
      ],
    },
    {
      id: "heat-milk",
      instruction: {
        uk: "Відлити 600–650 мл холодного молока. Решту молока нагріти майже до кипіння.",
        en: "Set aside 600–650 ml of cold milk. Heat the remaining milk until almost boiling.",
        es: "Reserva 600–650 ml de leche fría. Calienta el resto de la leche hasta casi hervir.",
      },
      ingredientLineIds: ["milk-custard"],
      equipmentIds: ["large-saucepan"],
    },
    {
      id: "mix-custard-base",
      instruction: {
        uk: "У великій мисці змішати цукор, обидва крохмалі, ванільний цукор і сіль. Додати відлите холодне молоко й розмішати до гладкості, потім додати 2 яйця і 3 білки.",
        en: "In a large bowl, combine the sugar, both starches, vanilla sugar and salt. Add the reserved cold milk and stir until smooth, then add the two eggs and three egg whites.",
        es: "En un bol grande, mezcla el azúcar, los dos almidones, el azúcar vainillado y la sal. Añade la leche fría reservada y remueve hasta que quede liso; incorpora después los dos huevos y las tres claras.",
      },
      ingredientLineIds: [
        "sugar-custard",
        "corn-starch-custard",
        "tapioca-custard",
        "vanilla-sugar-custard",
        "salt-custard",
        "milk-custard",
        "eggs-custard",
        "egg-whites-custard",
      ],
      equipmentIds: ["whisk"],
    },
    {
      id: "temper-custard",
      instruction: {
        uk: "Влити 2–3 ополоники гарячого молока в яєчно-крохмальну суміш, перемішати й повернути все в каструлю.",
        en: "Whisk 2–3 ladlefuls of hot milk into the egg and starch mixture, then return everything to the saucepan.",
        es: "Incorpora 2–3 cucharones de leche caliente a la mezcla de huevos y almidón, remueve y devuelve todo a la cacerola.",
      },
      ingredientLineIds: ["milk-custard"],
      equipmentIds: ["large-saucepan", "whisk"],
    },
    {
      id: "cook-custard",
      instruction: {
        uk: "Варити на середньому вогні, постійно працюючи вінчиком. Після перших бульбашок варити ще 30–60 секунд.",
        en: "Cook over medium heat, whisking constantly. After the first bubbles appear, cook for another 30–60 seconds.",
        es: "Cocina a fuego medio, batiendo constantemente. Cuando aparezcan las primeras burbujas, cocina 30–60 segundos más.",
      },
      ingredientLineIds: [],
      duration: { kind: "range", min: 30, max: 60, unit: "second" },
      equipmentIds: ["large-saucepan", "whisk"],
      guidance: [
        {
          id: "first-bubbles",
          kind: "checkpoint",
          text: {
            uk: "Відраховуйте фінальні 30–60 секунд після появи перших бульбашок.",
            en: "Start the final 30–60 seconds when the first bubbles appear.",
            es: "Empieza a contar los últimos 30–60 segundos cuando aparezcan las primeras burbujas.",
          },
        },
      ],
    },
    {
      id: "finish-custard",
      instruction: {
        uk: "Зняти крем з вогню, додати масло й розмішати до однорідності.",
        en: "Remove the custard from the heat, add the butter and stir until smooth.",
        es: "Retira la crema del fuego, añade la mantequilla y remueve hasta que quede homogénea.",
      },
      ingredientLineIds: ["butter-custard"],
      equipmentIds: ["whisk"],
    },
    {
      id: "toast-walnuts",
      instruction: {
        uk: "Підсушити волоські горіхи при 160°C 8–10 хвилин.",
        en: "Toast the walnuts at 160°C for 8–10 minutes.",
        es: "Tuesta las nueces a 160°C durante 8–10 minutos.",
      },
      ingredientLineIds: ["walnuts"],
      duration: { kind: "range", min: 8, max: 10, unit: "minute" },
      temperature: { value: 160, unit: "C", ovenMode: "conventional" },
    },
    {
      id: "toast-almonds",
      instruction: {
        uk: "Підсушити мигдальні пластівці при 160°C 4–5 хвилин.",
        en: "Toast the flaked almonds at 160°C for 4–5 minutes.",
        es: "Tuesta las almendras laminadas a 160°C durante 4–5 minutos.",
      },
      ingredientLineIds: ["flaked-almonds"],
      duration: { kind: "range", min: 4, max: 5, unit: "minute" },
      temperature: { value: 160, unit: "C", ovenMode: "conventional" },
    },
    {
      id: "assemble-cake",
      instruction: {
        uk: "Скласти два торти по 6 коржів. Використовувати крем теплим. Нанести крем на кожен корж, додаючи волоські горіхи через один шар. Зверху посипати крихтою від коржів і мигдальними пластівцями.",
        en: "Assemble two cakes with six layers each. Use the custard while warm. Spread it on every layer, adding walnuts to every other layer. Finish with layer crumbs and flaked almonds.",
        es: "Monta dos tartas de seis capas cada una. Usa la crema templada. Extiéndela sobre cada capa y añade nueces en capas alternas. Termina con migas de los recortes y almendras laminadas.",
      },
      ingredientLineIds: ["walnuts", "flaked-almonds"],
    },
    {
      id: "rest-assembled-cake",
      instruction: {
        uk: "Після складання залишити торт приблизно на 1 годину при кімнатній температурі.",
        en: "After assembly, leave the cake at room temperature for about 1 hour.",
        es: "Después del montaje, deja la tarta aproximadamente 1 hora a temperatura ambiente.",
      },
      ingredientLineIds: [],
      duration: { kind: "exact", value: 1, unit: "hour" },
    },
    {
      id: "refrigerate-cake",
      instruction: {
        uk: "Поставити торт у холодильник на 12–24 години. Найкращий смак — наступного дня.",
        en: "Refrigerate the cake for 12–24 hours. It tastes best the next day.",
        es: "Refrigera la tarta durante 12–24 horas. Está mejor al día siguiente.",
      },
      ingredientLineIds: [],
      duration: { kind: "range", min: 12, max: 24, unit: "hour" },
    },
  ],
  storage: null,
  makeAhead: {
    uk: "Тісто можна охолоджувати на ніч. Після складання торт дозріває в холодильнику 12–24 години; найкращий смак — наступного дня.",
    en: "The dough may be chilled overnight. After assembly, refrigerate the cake for 12–24 hours; it tastes best the next day.",
    es: "La masa puede refrigerarse toda la noche. Después del montaje, deja la tarta 12–24 horas en la nevera; está mejor al día siguiente.",
  },
  variations: [
    {
      id: "less-rich-base",
      dimension: "fat",
      label: {
        uk: "Менш жирна базова версія",
        en: "Less-rich base version",
        es: "Versión base menos grasa",
      },
      description: {
        uk: "Поточна базова версія використовує 120 г вершкового масла та 50 г олії.",
        en: "The current base uses 120 g butter and 50 g oil.",
        es: "La versión base actual usa 120 g de mantequilla y 50 g de aceite.",
      },
      provenance: {
        state: "repeatedlyVerified",
        sourceIds: ["inventory-row", "archive-status-note"],
      },
      availability: "default",
    },
    {
      id: "more-custard",
      dimension: "method",
      label: {
        uk: "2,8–3 л молока для соковитішого торта",
        en: "2.8–3 l milk for a moister cake",
        es: "2,8–3 l de leche para una tarta más jugosa",
      },
      description: {
        uk: "Історична нотатка пропонує перевірити більший обсяг крему; пропорції інших інгредієнтів не вказані.",
        en: "A historical note proposes testing more custard; adjusted quantities for the other ingredients are not recorded.",
        es: "Una nota histórica propone probar más crema; no se registran las cantidades ajustadas de los demás ingredientes.",
      },
      provenance: {
        state: "suggested",
        sourceIds: ["archive-refinement-note"],
      },
      availability: "hiddenUntilConfirmed",
      blockingGapIds: ["confirm-cream-volume"],
    },
    {
      id: "citrus-zest",
      dimension: "flavour",
      label: {
        uk: "Цитрусова цедра",
        en: "Citrus zest",
        es: "Ralladura de cítricos",
      },
      description: {
        uk: "Історична нотатка пропонує спробувати лимонну цедру; кількість і спосіб додавання не вказані.",
        en: "A historical note suggests trying lemon zest; no amount or method is recorded.",
        es: "Una nota histórica sugiere probar ralladura de limón; no se indican cantidad ni método.",
      },
      provenance: { state: "suggested", sourceIds: ["archive-refinement-note"] },
      availability: "hiddenUntilConfirmed",
    },
    {
      id: "vanilla-seeds",
      dimension: "flavour",
      label: {
        uk: "Насіння ванілі",
        en: "Vanilla seeds",
        es: "Semillas de vainilla",
      },
      description: {
        uk: "Історична нотатка пропонує спробувати насіння ванілі; кількість не вказана.",
        en: "A historical note suggests trying vanilla seeds; no amount is recorded.",
        es: "Una nota histórica sugiere probar semillas de vainilla; no se indica la cantidad.",
      },
      provenance: { state: "suggested", sourceIds: ["archive-refinement-note"] },
      availability: "hiddenUntilConfirmed",
    },
    {
      id: "thinner-layers-1-2mm",
      dimension: "method",
      label: {
        uk: "Коржі товщиною приблизно 1,2 мм",
        en: "Layers about 1.2 mm thick",
        es: "Capas de unos 1,2 mm de grosor",
      },
      description: {
        uk: "Історична нотатка пропонує перевірити тонше розкачування замість базових приблизно 1,5 мм.",
        en: "A historical note proposes testing thinner rolling instead of the base thickness of about 1.5 mm.",
        es: "Una nota histórica propone probar un estirado más fino en lugar del grosor base de unos 1,5 mm.",
      },
      provenance: { state: "suggested", sourceIds: ["archive-refinement-note"] },
      availability: "hiddenUntilConfirmed",
    },
  ],
  heroMediaId: null,
  media: [],
  relatedRecipeIds: [],
  sources: [
    {
      id: "inventory-row",
      file: "docs/reference/recipe-inventory.xlsx",
      locator: "Recipe Inventory!A12:R12",
    },
    {
      id: "archive-recipe",
      file: "docs/reference/recipe-inventory.xlsx",
      locator: "Recipe Archive!A74:B82",
    },
    {
      id: "archive-refinement-note",
      file: "docs/reference/recipe-inventory.xlsx",
      locator: "Recipe Archive!A83:B83",
    },
    {
      id: "archive-status-note",
      file: "docs/reference/recipe-inventory.xlsx",
      locator: "Recipe Archive!A84:B84",
    },
    {
      id: "author-update",
      file: "Current ChatGPT conversation",
      locator: "Author confirmation on 2026-09-07",
    },
    {
      id: "ux-form-example",
      file: "docs/reference/UX-IA-Specification-v1.md",
      locator: "Napoleon form example",
    },
  ],
  contentGaps: [
    {
      id: "reconcile-total-time",
      area: "timing",
      field: "timing.totalElapsedMinutes",
      question: "The author reported 1 hour active and 4 hours total, but the recorded method still includes at least 2 hours chilling plus 12–24 hours refrigerated maturation. Confirm whether 4 hours ends at assembly or whether the maturation instruction has changed.",
      publicationBlocking: true,
      sourceIds: ["archive-recipe", "author-update"],
    },
    {
      id: "confirm-cream-volume",
      area: "ingredient",
      field: "ingredientSections.custard",
      question: "Confirm that 2.5 l milk and all accompanying custard quantities are the final current formula. The author retained 2.5 l provisionally and plans to check it later.",
      publicationBlocking: true,
      sourceIds: [
        "inventory-row",
        "archive-recipe",
        "archive-refinement-note",
        "author-update",
      ],
    },
    {
      id: "confirm-dairy-choice",
      area: "ingredient",
      field: "ingredientSections.layers.cultured-dairy-dough",
      question: "Which cultured dairy is the default, and have both sour cream and thick natural yogurt been tested?",
      publicationBlocking: true,
      sourceIds: ["archive-recipe"],
    },
    {
      id: "validate-24cm-form",
      area: "form",
      field: "forms.alternatives.round-24cm-preview",
      question: "Resolve eggs, layer count, cream volume and timing, then test the 24 cm configuration before enabling Cook Mode.",
      publicationBlocking: false,
      sourceIds: ["ux-form-example"],
    },
    {
      id: "add-hero-image",
      area: "image",
      field: "heroMediaId",
      question: "Make and select the final publication photos.",
      publicationBlocking: true,
      sourceIds: ["inventory-row"],
    },
    {
      id: "review-translations",
      area: "translation",
      field: "translationState.en/es",
      question: "Human-review the EN and ES recipe wording and SEO slugs.",
      publicationBlocking: true,
      sourceIds: ["archive-recipe"],
    },
    {
      id: "record-storage",
      area: "storage",
      field: "storage",
      question: "Record storage instructions beyond the 12–24 hour maturation period.",
      publicationBlocking: false,
      sourceIds: ["archive-recipe"],
    },
  ],
} satisfies RecipeDraft;
