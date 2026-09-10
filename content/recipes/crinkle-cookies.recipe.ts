import type { RecipeDraft } from "./recipe.types.ts";

export const crinkleCookiesRecipe = {
  schemaVersion: 2,
  id: "crinkle-cookies",
  versionId: "crinkle-cookies-v1-draft",
  publicationStatus: "draft",
  translationState: {
    uk: "sourceDraft",
    en: "draftTranslation",
    es: "draftTranslation",
  },
  slug: {
    uk: "marmurove-pechyvo-trishchynky",
    en: "marbled-crinkle-cookies",
    es: "galletas-marmoladas-craqueladas",
  },
  title: {
    uk: "Мармурове печиво «Тріщинки»",
    en: "Marbled Crinkle Cookies",
    es: "Galletas marmoladas craqueladas",
  },
  summary: {
    uk: "Какао-печиво з апельсиновою цедрою, яке піднімається й тріскається під час випікання.",
    en: "Cocoa cookies with orange zest that rise and crack as they bake.",
    es: "Galletas de cacao con ralladura de naranja que suben y se craquelan al hornearse.",
  },
  categoryIds: ["cookies", "sweet-baking"],
  situationIds: ["everyday", "prepare-ahead"],
  difficulty: "easy",
  baseProvenance: {
    state: "repeatedlyVerified",
    sourceIds: ["inventory-row", "archive-recipe", "author-update"],
    note: "The author confirms the base recipe has been made many times with repeatable results.",
  },
  timing: {
    activeMinutes: 40,
    totalElapsedMinutes: null,
    phases: [
      {
        id: "chill",
        label: { uk: "Охолодження", en: "Chilling", es: "Refrigeración" },
        duration: { kind: "range", min: 3, max: 4, unit: "hour" },
      },
      {
        id: "maximum-hold",
        label: {
          uk: "Максимальний час у холодильнику",
          en: "Maximum refrigerated hold",
          es: "Tiempo máximo en refrigeración",
        },
        duration: { kind: "exact", value: 24, unit: "hour" },
      },
      {
        id: "bake",
        label: { uk: "Випікання", en: "Baking", es: "Horneado" },
        duration: { kind: "range", min: 8, max: 10, unit: "minute" },
      },
    ],
  },
  yield: {
    default: {
      id: "default-batch",
      label: {
        uk: "20 печив",
        en: "20 cookies",
        es: "20 galletas",
      },
      amount: 20,
      unit: "cookie",
      provenance: {
        state: "repeatedlyVerified",
        sourceIds: ["author-update"],
      },
      availability: "default",
    },
    alternatives: [],
  },
  geometry: {
    default: {
      id: "parchment-lined-baking-sheet",
      label: {
        uk: "Деко, застелене пергаментом",
        en: "Parchment-lined baking sheet",
        es: "Bandeja de horno forrada con papel",
      },
      kind: "tray",
      application: "portion-on",
      shape: "rectangular",
      diameterCm: null,
      layerCount: null,
      material: null,
      provenance: {
        state: "repeatedlyVerified",
        sourceIds: ["archive-recipe"],
      },
      availability: "default",
    },
    alternatives: [],
  },
  configuration: {
    base: {
      status: "Tested",
      geometryId: "parchment-lined-baking-sheet",
      yieldId: "default-batch",
      batchScale: 1,
    },
    geometryAdjustment: null,
    quantityAdjustment: {
      batchScale: { allowed: [0.5, 1, 1.5, 2] },
      useWhatIHave: null,
    },
    ingredientScaling: {
      default: { kind: "linear", precision: 0.1, rounding: "nearest" },
    },
  },
  equipment: [
    {
      id: "baking-sheet",
      name: { uk: "деко", en: "baking sheet", es: "bandeja de horno" },
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
      id: "electric-mixer",
      name: { uk: "міксер", en: "electric mixer", es: "batidora eléctrica" },
    },
  ],
  flourConfiguration: {
    commercialMixLineId: "flour",
    additionalStarchLineIds: [],
    provenance: {
      state: "repeatedlyVerified",
      sourceIds: ["inventory-row", "archive-note"],
      note: "The inventory specifies Schär Mix B Bread as the flour used by the author.",
    },
    testedAlternativeMixes: [],
    knownUnsupportedMixes: [],
  },
  beforeStart: [
    {
      id: "plan-chill",
      relatedStepId: "chill-dough",
      text: {
        uk: "Тісто потрібно охолоджувати 3–4 години; його можна залишити в холодильнику до 24 годин.",
        en: "Chill the dough for 3–4 hours; it may remain refrigerated for up to 24 hours.",
        es: "Refrigera la masa durante 3–4 horas; puede permanecer en la nevera hasta 24 horas.",
      },
    },
  ],
  ingredientSections: [
    {
      id: "cookies",
      title: { uk: "Печиво", en: "Cookies", es: "Galletas" },
      lines: [
        {
          id: "butter",
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
          amount: { kind: "exact", value: 60, unit: "g" },
        },
        {
          id: "eggs",
          options: [
            {
              ingredientId: "whole-egg",
              name: { uk: "яйця", en: "eggs", es: "huevos" },
            },
          ],
          amount: { kind: "exact", value: 2, unit: "piece" },
          scaling: { kind: "discrete", increment: 1, rounding: "manual" },
        },
        {
          id: "sugar",
          options: [
            {
              ingredientId: "granulated-sugar",
              name: { uk: "цукор", en: "sugar", es: "azúcar" },
            },
          ],
          amount: { kind: "exact", value: 200, unit: "g" },
        },
        {
          id: "cocoa",
          options: [
            {
              ingredientId: "cocoa-powder",
              name: { uk: "какао", en: "cocoa powder", es: "cacao en polvo" },
            },
          ],
          amount: { kind: "exact", value: 60, unit: "g" },
        },
        {
          id: "flour",
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
          amount: { kind: "exact", value: 120, unit: "g" },
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
          amount: { kind: "exact", value: 1, unit: "tsp" },
        },
        {
          id: "orange-zest",
          options: [
            {
              ingredientId: "orange",
              name: { uk: "апельсин", en: "orange", es: "naranja" },
            },
          ],
          amount: { kind: "exact", value: 1, unit: "piece" },
          scaling: { kind: "discrete", increment: 1, rounding: "manual" },
          preparation: {
            uk: "використати цедру",
            en: "zest only",
            es: "usar solo la ralladura",
          },
        },
        {
          id: "powdered-sugar",
          options: [
            {
              ingredientId: "powdered-sugar",
              name: {
                uk: "цукрова пудра",
                en: "powdered sugar",
                es: "azúcar glas",
              },
            },
          ],
          amount: null,
          scaling: {
            kind: "manual",
            reason: {
              uk: "Кількість для обкачування залежить від покриття.",
              en: "The coating amount depends on coverage.",
              es: "La cantidad para rebozar depende de la cobertura.",
            },
          },
          qualifier: {
            uk: "для обкачування",
            en: "for coating",
            es: "para rebozar",
          },
        },
      ],
    },
  ],
  steps: [
    {
      id: "beat-wet",
      instruction: {
        uk: "Збити яйця з цукром та вершковим маслом до побіління.",
        en: "Beat the eggs, sugar and butter until pale.",
        es: "Bate los huevos, el azúcar y la mantequilla hasta que la mezcla aclare.",
      },
      ingredientLineIds: ["eggs", "sugar", "butter"],
      equipmentIds: ["electric-mixer"],
    },
    {
      id: "mix-dry",
      instruction: {
        uk: "Окремо змішати какао, борошно та розпушувач.",
        en: "In a separate bowl, mix the cocoa, flour and baking powder.",
        es: "En otro bol, mezcla el cacao, la harina y la levadura química.",
      },
      ingredientLineIds: ["cocoa", "flour", "baking-powder"],
    },
    {
      id: "combine-dough",
      instruction: {
        uk: "Додати сухі інгредієнти до вологих і збити до повного поєднання. Наприкінці додати апельсинову цедру.",
        en: "Add the dry ingredients to the wet mixture and beat until fully combined. Add the orange zest at the end.",
        es: "Añade los ingredientes secos a la mezcla húmeda y bate hasta integrarlos por completo. Añade la ralladura de naranja al final.",
      },
      ingredientLineIds: [
        "cocoa",
        "flour",
        "baking-powder",
        "orange-zest",
      ],
      equipmentIds: ["electric-mixer"],
    },
    {
      id: "chill-dough",
      instruction: {
        uk: "Накрити тісто харчовою плівкою й поставити в холодильник на 3–4 години; можна залишити до 24 годин.",
        en: "Cover the dough and refrigerate for 3–4 hours; it may be left for up to 24 hours.",
        es: "Cubre la masa y refrigérala durante 3–4 horas; puede dejarse hasta 24 horas.",
      },
      ingredientLineIds: [],
      duration: { kind: "range", min: 3, max: 4, unit: "hour" },
    },
    {
      id: "preheat-oven",
      instruction: {
        uk: "Розігріти духовку до 180°C.",
        en: "Preheat the oven to 180°C.",
        es: "Precalienta el horno a 180°C.",
      },
      ingredientLineIds: [],
      temperature: { value: 180, unit: "C", ovenMode: "conventional" },
    },
    {
      id: "shape-and-coat",
      instruction: {
        uk: "З охолодженого тіста скатати кульки розміром з волоський горіх, ретельно обкачати в цукровій пудрі й викласти на застелене пергаментом деко на великій відстані одна від одної.",
        en: "Roll the chilled dough into walnut-sized balls, coat them thoroughly in powdered sugar and place them well apart on a parchment-lined baking sheet.",
        es: "Forma bolas del tamaño de una nuez con la masa fría, rebózalas bien en azúcar glas y colócalas bastante separadas en una bandeja forrada con papel de horno.",
      },
      ingredientLineIds: ["powdered-sugar"],
      equipmentIds: ["baking-sheet", "parchment"],
    },
    {
      id: "bake-cookies",
      instruction: {
        uk: "Пекти 8–10 хвилин.",
        en: "Bake for 8–10 minutes.",
        es: "Hornea durante 8–10 minutos.",
      },
      ingredientLineIds: [],
      duration: { kind: "range", min: 8, max: 10, unit: "minute" },
      temperature: { value: 180, unit: "C", ovenMode: "conventional" },
      equipmentIds: ["baking-sheet"],
      guidance: [
        {
          id: "moist-cracks",
          kind: "checkpoint",
          text: {
            uk: "Печиво має піднятися й потріскатися, а тріщинки повинні здаватися вологими.",
            en: "The cookies should rise and crack, and the cracks should still look moist.",
            es: "Las galletas deben subir y craquelarse; las grietas aún deben parecer húmedas.",
          },
        },
      ],
    },
    {
      id: "cool-cookies",
      instruction: {
        uk: "Залишити до повного вистигання.",
        en: "Leave to cool completely.",
        es: "Deja que se enfríen por completo.",
      },
      ingredientLineIds: [],
    },
  ],
  storage: {
    uk: "Зберігати в герметичній ємності.",
    en: "Store in an airtight container.",
    es: "Guardar en un recipiente hermético.",
  },
  makeAhead: {
    uk: "Тісто можна тримати в холодильнику до 24 годин перед випіканням.",
    en: "The dough may be refrigerated for up to 24 hours before baking.",
    es: "La masa puede conservarse en la nevera hasta 24 horas antes de hornear.",
  },
  variations: [
    {
      id: "walnut-centre",
      dimension: "filling",
      label: {
        uk: "Волоський горіх або пекан всередині",
        en: "Walnut or pecan centre",
        es: "Centro de nuez o nuez pecana",
      },
      description: {
        uk: "У сформовану кульку тіста вставити волоський горіх або горіх пекан.",
        en: "Insert a walnut or pecan into the shaped dough ball.",
        es: "Introduce una nuez o una nuez pecana en la bola de masa formada.",
      },
      provenance: {
        state: "tested",
        sourceIds: ["archive-recipe", "inventory-row", "author-update"],
        note: "The author confirmed that the walnut-or-pecan centre has been baked successfully.",
      },
      availability: "selectable",
      ingredientChanges: [
        {
          action: "add",
          lineId: "nut-centre",
          line: {
            id: "nut-centre",
            options: [
              {
                ingredientId: "walnut",
                name: { uk: "волоський горіх", en: "walnut", es: "nuez" },
              },
              {
                ingredientId: "pecan",
                name: { uk: "горіх пекан", en: "pecan", es: "nuez pecana" },
              },
            ],
            choose: 1,
            amount: { kind: "exact", value: 20, unit: "piece" },
            qualifier: {
              uk: "по одному шматочку в кожну з 20 кульок",
              en: "one piece in each of the 20 dough balls",
              es: "una pieza en cada una de las 20 bolas de masa",
            },
            provenance: {
              state: "calculated",
              sourceIds: ["author-update"],
              note: "Calculated as one nut piece for each of the confirmed 20 cookies.",
            },
          },
        },
      ],
      stepChanges: [
        {
          stepId: "shape-and-coat",
          instruction: {
            uk: "Під час формування вставити в кожну кульку волоський горіх або горіх пекан, потім обкачати в цукровій пудрі.",
            en: "While shaping, insert a walnut or pecan into each dough ball, then coat it in powdered sugar.",
            es: "Al formar las bolas, introduce una nuez o una nuez pecana en cada una y rebózala después en azúcar glas.",
          },
        },
      ],
    },
  ],
  heroMediaId: "crinkle-generated-card-v1",
  media: [
    {
      id: "crinkle-generated-card-v1",
      type: "image",
      path: "/images/recipes/chocolate-crinkle-cookies-card-v1.png",
      usage: ["hero", "gallery"],
      alt: {
        uk: "Шоколадне печиво тріщинки в цукровій пудрі на керамічній тарілці",
        en: "Chocolate crinkle cookies dusted with powdered sugar on a ceramic plate",
        es: "Galletas craqueladas de chocolate con azúcar glas sobre un plato de cerámica",
      },
    },
  ],
  relatedRecipeIds: [],
  sources: [
    {
      id: "inventory-row",
      file: "docs/reference/recipe-inventory.xlsx",
      locator: "Recipe Inventory!A14:R14",
    },
    {
      id: "archive-recipe",
      file: "docs/reference/recipe-inventory.xlsx",
      locator: "Recipe Archive!A91:B94",
    },
    {
      id: "author-update",
      file: "Current ChatGPT conversation",
      locator: "Author confirmation on 2026-09-07",
    },
    {
      id: "archive-note",
      file: "docs/reference/recipe-inventory.xlsx",
      locator: "Recipe Archive!A95:B95",
    },
  ],
  contentGaps: [
    {
      id: "reconcile-total-time",
      area: "timing",
      field: "timing.totalElapsedMinutes",
      question: "The author reported 40 minutes active and 3.5 hours total, while the recorded minimum phases are 3 hours chilling plus 8 minutes baking. Confirm whether 3.5 hours is an approximate display value and whether cooling is included.",
      publicationBlocking: true,
      sourceIds: ["archive-recipe", "author-update"],
    },
    {
      id: "confirm-powdered-sugar-amount",
      area: "ingredient",
      field: "ingredientSections.cookies.powdered-sugar.amount",
      question: "Confirm a quantity for the powdered-sugar coating, or explicitly approve it as an amount used as needed.",
      publicationBlocking: true,
      sourceIds: ["archive-recipe"],
    },
    {
      id: "add-hero-image",
      area: "image",
      field: "media.crinkle-generated-card-v1",
      question: "Approve or replace the generated preview image before final publication.",
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
      id: "record-storage-duration",
      area: "storage",
      field: "storage",
      question: "If known, record how long the cookies remain suitable in an airtight container.",
      publicationBlocking: false,
      sourceIds: ["archive-recipe"],
    },
  ],
} satisfies RecipeDraft;
