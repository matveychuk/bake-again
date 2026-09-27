import type { AppLocale } from './config.ts';

/** Public URL names only. Recipe IDs, versions and browser-storage identities stay stable. */
export const recipeSlugs: Record<string, Record<AppLocale, string>> = {
  'celebration-sponge-cake': {
    uk: 'bezghliutenovyi-sviatkovyi-tort',
    en: 'gluten-free-celebration-cake',
    es: 'tarta-de-celebracion-sin-gluten',
  },
  'sour-cream': {
    uk: 'smetannyi-krem',
    en: 'sour-cream-filling',
    es: 'crema-de-nata-agria',
  },
  'lemon-cream-cheese': {
    uk: 'lymonnyi-krem-z-maslom-i-vershkovym-syrom',
    en: 'lemon-butter-cream-cheese-frosting',
    es: 'crema-de-mantequilla-y-queso-al-limon',
  },
  'chocolate-glaze': {
    uk: 'shokoladna-hlazur',
    en: 'chocolate-glaze',
    es: 'glaseado-de-chocolate',
  },
  'gluten-free-napoleon': {
    uk: 'bezghliutenovyi-napoleon',
    en: 'gluten-free-napoleon-cake',
    es: 'tarta-napoleon-sin-gluten',
  },
  'crinkle-cookies': {
    uk: 'bezghliutenove-marmurove-pechyvo-trishchynky',
    en: 'gluten-free-marbled-crinkle-cookies',
    es: 'galletas-marmoladas-craqueladas-sin-gluten',
  },
  'apple-charlotte': {
    uk: 'bezghliutenova-yabluchna-sharlotka',
    en: 'gluten-free-apple-charlotte',
    es: 'bizcocho-de-manzana-sin-gluten',
  },
  'plum-cake': {
    uk: 'bezghliutenovyi-slyvovyi-pyrih',
    en: 'gluten-free-plum-cake',
    es: 'bizcocho-de-ciruelas-sin-gluten',
  },
  'cottage-cheese-waffles': {
    uk: 'bezghliutenovi-syrni-vafli',
    en: 'gluten-free-tvorog-waffles',
    es: 'gofres-de-tvorog-sin-gluten',
  },
  'carrot-cake': {
    uk: 'bezghliutenovyi-morkvianyi-keks',
    en: 'gluten-free-carrot-cake',
    es: 'bizcocho-de-zanahoria-sin-gluten',
  },
  'sponge-cake': {
    uk: 'bezghliutenovyi-biskvit-dlia-torta',
    en: 'gluten-free-sponge-cake',
    es: 'bizcocho-para-tartas-sin-gluten',
  },
  crepes: {
    uk: 'bezghliutenovi-mlyntsi',
    en: 'gluten-free-crepes',
    es: 'crepes-sin-gluten',
  },
  'fruit-sponge-roll': {
    uk: 'bezghliutenovyi-biskvitnyi-rulet-z-fruktamy',
    en: 'gluten-free-fruit-sponge-roll',
    es: 'brazo-de-gitano-con-fruta-sin-gluten',
  },
  'banana-bread': {
    uk: 'bezghliutenovyi-bananovyi-khlib',
    en: 'gluten-free-banana-bread',
    es: 'pan-de-platano-sin-gluten',
  },
  'lazy-dumplings': {
    uk: 'bezghliutenovi-linyvi-varenyky',
    en: 'gluten-free-lazy-dumplings',
    es: 'vareniki-perezosos-sin-gluten',
  },
  'prune-cake': {
    uk: 'bezghliutenovyi-tort-z-chornoslyvom',
    en: 'gluten-free-prune-cake',
    es: 'tarta-de-ciruelas-pasas-sin-gluten',
  },
  eclairs: {
    uk: 'bezghliutenovi-profitroli',
    en: 'gluten-free-profiteroles',
    es: 'profiteroles-sin-gluten',
  },
  'apple-fritters': {
    uk: 'bezghliutenovi-yabluchni-oladky',
    en: 'gluten-free-apple-fritters',
    es: 'tortitas-de-manzana-sin-gluten',
  },
  'banana-fritters': {
    uk: 'bezghliutenovi-bananovi-oladky',
    en: 'gluten-free-banana-fritters',
    es: 'tortitas-de-platano-sin-gluten',
  },
  'apple-banana-fritters': {
    uk: 'bezghliutenovi-yabluchno-bananovi-oladky',
    en: 'gluten-free-apple-banana-fritters',
    es: 'tortitas-de-manzana-y-platano-sin-gluten',
  },
  'apple-meringue-pie': {
    uk: 'bezghliutenovyi-yabluchnyi-pyrih-z-beze',
    en: 'gluten-free-apple-meringue-pie',
    es: 'tarta-de-manzana-y-merengue-sin-gluten',
  },
  'cinnamon-rolls': {
    uk: 'bezghliutenovi-bulochky-z-korytseiu',
    en: 'gluten-free-cinnamon-rolls',
    es: 'rollos-de-canela-sin-gluten',
  },
  'easter-bread': {
    uk: 'bezghliutenova-paska',
    en: 'gluten-free-easter-bread',
    es: 'pan-de-pascua-sin-gluten',
  },
  'mascarpone-whipped-cream': {
    uk: 'zbyti-vershky-z-maskarpone',
    en: 'whipped-cream-with-mascarpone',
    es: 'nata-montada-con-mascarpone',
  },
  'vanilla-egg-custard': {
    uk: 'vanilnyi-zavarnyi-krem-z-yaitsiamy',
    en: 'vanilla-custard-with-eggs',
    es: 'crema-pastelera-de-vainilla-con-huevo',
  },
  'eggless-vanilla-custard': {
    uk: 'vanilnyi-zavarnyi-krem-bez-yaiets',
    en: 'eggless-vanilla-custard',
    es: 'crema-pastelera-de-vainilla-sin-huevo',
  },
  'vanilla-buttercream': {
    uk: 'vanilnyi-maslianyi-krem',
    en: 'vanilla-buttercream',
    es: 'crema-de-mantequilla-y-vainilla',
  },
};
