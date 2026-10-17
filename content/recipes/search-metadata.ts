import type { RecipeSearchMetadata } from './recipe.types.ts';

/** Shared across translations. Unknown dates stay null; never use the build date.
 * dateModified records the checked content revision; evidence is in lib/seo/content-date-evidence.json.
 * Keywords reuse existing localized recipe titles; Napoleon also uses the supplied brief.
 */
export const recipeSearchMetadata: Record<string, RecipeSearchMetadata> = {
  'celebration-sponge-cake': {
    datePublished: null,
    dateModified: '2026-09-27',
    cookTimeMinutes: null,
    recipeCuisine: {
      uk: null,
      en: null,
      es: null,
    },
    keywords: {
      uk: ['Безглютеновий святковий торт'],
      en: ['Gluten-free celebration cake'],
      es: ['Tarta de celebración sin gluten'],
    },
  },
  'sour-cream': {
    datePublished: null,
    dateModified: '2026-09-27',
    cookTimeMinutes: null,
    recipeCuisine: {
      uk: null,
      en: null,
      es: null,
    },
    keywords: {
      uk: ['Сметанний крем'],
      en: ['Sour cream filling'],
      es: ['Crema de nata agria'],
    },
  },
  'lemon-cream-cheese': {
    datePublished: null,
    dateModified: '2026-09-27',
    cookTimeMinutes: null,
    recipeCuisine: {
      uk: null,
      en: null,
      es: null,
    },
    keywords: {
      uk: ['Лимонний крем із маслом і вершковим сиром'],
      en: ['Lemon butter and cream cheese frosting'],
      es: ['Crema de mantequilla y queso al limón'],
    },
  },
  'chocolate-glaze': {
    datePublished: null,
    dateModified: '2026-09-27',
    cookTimeMinutes: null,
    recipeCuisine: {
      uk: null,
      en: null,
      es: null,
    },
    keywords: {
      uk: ['Шоколадна глазур'],
      en: ['Chocolate glaze'],
      es: ['Glaseado de chocolate'],
    },
  },
  'gluten-free-napoleon': {
    datePublished: null,
    dateModified: '2026-10-05',
    cookTimeMinutes: null,
    recipeCuisine: {
      uk: 'Українська кухня',
      en: 'Ukrainian',
      es: 'Ucraniana',
    },
    keywords: {
      uk: [
        'наполеон без глютену',
        'безглютеновий торт наполеон',
        'Schär Mix B',
        'торт без глютену',
      ],
      en: [
        'gluten-free Napoleon cake',
        'Schär Mix B',
        'gluten-free layer cake',
      ],
      es: ['tarta Napoleón sin gluten', 'Schär Mix B', 'tarta sin gluten'],
    },
  },
  'crinkle-cookies': {
    datePublished: null,
    dateModified: '2026-09-27',
    cookTimeMinutes: null,
    recipeCuisine: {
      uk: null,
      en: null,
      es: null,
    },
    keywords: {
      uk: ['Безглютенове мармурове печиво «Тріщинки»'],
      en: ['Gluten-free marbled crinkle cookies'],
      es: ['Galletas marmoladas craqueladas sin gluten'],
    },
  },
  'apple-charlotte': {
    datePublished: null,
    dateModified: '2026-09-27',
    cookTimeMinutes: null,
    recipeCuisine: {
      uk: null,
      en: null,
      es: null,
    },
    keywords: {
      uk: ['Безглютенова яблучна шарлотка'],
      en: ['Gluten-free apple charlotte'],
      es: ['Carlota de manzana sin gluten'],
    },
  },
  'plum-cake': {
    datePublished: null,
    dateModified: '2026-09-27',
    cookTimeMinutes: 30,
    recipeCuisine: {
      uk: null,
      en: null,
      es: null,
    },
    keywords: {
      uk: ['Безглютеновий сливовий пиріг'],
      en: ['Gluten-free plum sponge cake'],
      es: ['Bizcocho de ciruelas sin gluten'],
    },
  },
  'cottage-cheese-waffles': {
    datePublished: null,
    dateModified: '2026-09-27',
    cookTimeMinutes: null,
    recipeCuisine: {
      uk: 'Українська кухня',
      en: 'Ukrainian',
      es: 'Ucraniana',
    },
    keywords: {
      uk: ['Безглютенові сирні вафлі'],
      en: ['Gluten-free curd cheese waffles'],
      es: ['Gofres de tvorog sin gluten'],
    },
  },
  'carrot-cake': {
    datePublished: null,
    dateModified: '2026-09-27',
    cookTimeMinutes: null,
    recipeCuisine: {
      uk: null,
      en: null,
      es: null,
    },
    keywords: {
      uk: ['Безглютеновий морквяний кекс'],
      en: ['Gluten-free carrot cake'],
      es: ['Bizcocho de zanahoria sin gluten'],
    },
  },
  'sponge-cake': {
    datePublished: null,
    dateModified: '2026-09-27',
    cookTimeMinutes: null,
    recipeCuisine: {
      uk: null,
      en: null,
      es: null,
    },
    keywords: {
      uk: ['Безглютеновий бісквіт для торта'],
      en: ['Gluten-free sponge cake for layer cakes'],
      es: ['Bizcocho sin gluten para tartas'],
    },
  },
  crepes: {
    datePublished: null,
    dateModified: '2026-09-27',
    cookTimeMinutes: null,
    recipeCuisine: {
      uk: 'Українська кухня',
      en: 'Ukrainian',
      es: 'Ucraniana',
    },
    keywords: {
      uk: ['Безглютенові млинці'],
      en: ['Gluten-free crepes'],
      es: ['Crepes sin gluten'],
    },
  },
  'fruit-sponge-roll': {
    datePublished: null,
    dateModified: '2026-09-27',
    cookTimeMinutes: null,
    recipeCuisine: {
      uk: null,
      en: null,
      es: null,
    },
    keywords: {
      uk: ['Безглютеновий бісквітний рулет із фруктами'],
      en: ['Gluten-free fruit sponge roll'],
      es: ['Brazo de gitano de frutas sin gluten'],
    },
  },
  'banana-bread': {
    datePublished: null,
    dateModified: '2026-09-27',
    cookTimeMinutes: 40,
    recipeCuisine: {
      uk: null,
      en: null,
      es: null,
    },
    keywords: {
      uk: ['Безглютеновий банановий хліб'],
      en: ['Gluten-free banana bread'],
      es: ['Pan de plátano sin gluten'],
    },
  },
  'lazy-dumplings': {
    datePublished: null,
    dateModified: '2026-10-12',
    dateModifiedVersionId: 'lazy-dumplings-source-v2',
    cookTimeMinutes: null,
    recipeCuisine: {
      uk: 'Українська кухня',
      en: 'Ukrainian',
      es: 'Ucraniana',
    },
    keywords: {
      uk: ['Безглютенові ліниві вареники'],
      en: ['Gluten-free lazy curd cheese dumplings'],
      es: ['Váreniki de tvorog sin gluten'],
    },
  },
  'prune-cake': {
    datePublished: null,
    dateModified: '2026-10-05',
    cookTimeMinutes: 50,
    recipeCuisine: {
      uk: 'Українська кухня',
      en: 'Ukrainian',
      es: 'Ucraniana',
    },
    keywords: {
      uk: ['Безглютеновий торт із чорносливом'],
      en: ['Gluten-free chocolate prune cake'],
      es: ['Tarta de chocolate y ciruelas pasas sin gluten'],
    },
  },
  'cinnamon-rolls': {
    datePublished: null,
    dateModified: '2026-09-27',
    cookTimeMinutes: 20,
    recipeCuisine: {
      uk: null,
      en: null,
      es: null,
    },
    keywords: {
      uk: ['Безглютенові булочки з корицею'],
      en: ['Gluten-free cinnamon rolls'],
      es: ['Rollos de canela sin gluten'],
    },
  },
  eclairs: {
    datePublished: null,
    dateModified: '2026-10-04',
    cookTimeMinutes: 25,
    recipeCuisine: {
      uk: null,
      en: null,
      es: null,
    },
    keywords: {
      uk: ['Безглютенові профітролі'],
      en: ['Gluten-free profiteroles'],
      es: ['Profiteroles sin gluten'],
    },
  },
  'easter-bread': {
    datePublished: null,
    dateModified: '2026-09-27',
    cookTimeMinutes: null,
    recipeCuisine: {
      uk: null,
      en: null,
      es: null,
    },
    keywords: {
      uk: ['Безглютенова паска'],
      en: ['Gluten-free Ukrainian Easter bread'],
      es: ['Pan ucraniano de Pascua sin gluten'],
    },
  },
  'apple-fritters': {
    datePublished: null,
    dateModified: '2026-09-27',
    cookTimeMinutes: null,
    recipeCuisine: {
      uk: null,
      en: null,
      es: null,
    },
    keywords: {
      uk: ['Безглютенові яблучні оладки'],
      en: ['Gluten-free apple fritters'],
      es: ['Tortitas de manzana sin gluten'],
    },
  },
  'banana-fritters': {
    datePublished: null,
    dateModified: '2026-09-27',
    cookTimeMinutes: 12,
    recipeCuisine: {
      uk: null,
      en: null,
      es: null,
    },
    keywords: {
      uk: ['Безглютенові бананові панкейки'],
      en: ['Gluten-free banana pancakes'],
      es: ['Tortitas de plátano sin gluten'],
    },
  },
  'apple-banana-fritters': {
    datePublished: null,
    dateModified: '2026-09-27',
    cookTimeMinutes: null,
    recipeCuisine: {
      uk: null,
      en: null,
      es: null,
    },
    keywords: {
      uk: ['Безглютенові яблучно-бананові оладки'],
      en: ['Gluten-free apple-banana fritters'],
      es: ['Tortitas de manzana y plátano sin gluten'],
    },
  },
  'apple-meringue-pie': {
    datePublished: null,
    dateModified: '2026-09-27',
    cookTimeMinutes: 40,
    recipeCuisine: {
      uk: null,
      en: null,
      es: null,
    },
    keywords: {
      uk: ['Безглютеновий яблучний пиріг із меренгою'],
      en: ['Gluten-free apple meringue pie'],
      es: ['Tarta de manzana y merengue sin gluten'],
    },
  },
  'mascarpone-whipped-cream': {
    datePublished: null,
    dateModified: '2026-09-27',
    cookTimeMinutes: null,
    recipeCuisine: {
      uk: null,
      en: null,
      es: null,
    },
    keywords: {
      uk: ['Крем із вершків та маскарпоне'],
      en: ['Whipped cream with mascarpone'],
      es: ['Crema de nata y mascarpone'],
    },
  },
  'vanilla-egg-custard': {
    datePublished: null,
    dateModified: '2026-09-27',
    cookTimeMinutes: null,
    recipeCuisine: {
      uk: null,
      en: null,
      es: null,
    },
    keywords: {
      uk: ['Ванільний заварний крем з яйцями'],
      en: ['Vanilla custard with eggs'],
      es: ['Crema pastelera de vainilla con huevo'],
    },
  },
  'eggless-vanilla-custard': {
    datePublished: null,
    dateModified: '2026-09-27',
    cookTimeMinutes: null,
    recipeCuisine: {
      uk: null,
      en: null,
      es: null,
    },
    keywords: {
      uk: ['Ванільний заварний крем без яєць'],
      en: ['Eggless vanilla custard'],
      es: ['Crema de vainilla sin huevo'],
    },
  },
  'vanilla-buttercream': {
    datePublished: null,
    dateModified: '2026-09-27',
    cookTimeMinutes: null,
    recipeCuisine: {
      uk: null,
      en: null,
      es: null,
    },
    keywords: {
      uk: ['Ванільний масляний крем'],
      en: ['Vanilla buttercream'],
      es: ['Crema de mantequilla de vainilla'],
    },
  },
};

/** Pending undated edits must not inherit a previous revision's modification date. */
export function recipeLastModified(recipe: {
  versionId?: string;
  searchMetadata?: RecipeSearchMetadata;
}): string | null {
  const facts = recipe.searchMetadata;
  if (
    facts?.dateModifiedVersionId &&
    facts.dateModifiedVersionId !== recipe.versionId
  )
    return null;
  return facts?.dateModified ?? null;
}
