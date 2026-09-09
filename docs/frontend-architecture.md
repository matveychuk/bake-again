# Frontend architecture

Bake Again uses a layered component structure. The approved product design is preserved through shared tokens and stable presentation components; routes compose those pieces and own only page-level concerns.

## Layers

```text
app/
  _components/            Route-family sections used to compose a screen
  design-system/          Design-system documentation route
  recipes/                Product routes and route-specific interactive features
components/
  foundations/            Typography and section-title primitives
  recipe/                 Reusable recipe-domain presentation
  site/                   Shared site chrome
  ui/                     Installed low-level UI primitives
content/recipes/          Canonical recipe data, calculation logic, and typed view data
design-system/            Tokens, component rules, and design documentation
```

## Dependency direction

Routes may import from every layer. Route-family components may import shared components and content. Shared components must not import a route. Canonical recipe files must not import React or presentation code.

## Sources of truth

- `design-system/tokens.css` is the runtime source for visual tokens.
- `design-system/tokens.json` is the portable source for design-tool synchronisation.
- `content/recipes/*.recipe.ts` contains canonical recipe facts and provenance.
- `content/recipes/*.prototype.ts` contains temporary presentation states that are not yet represented by the canonical model.
- Route files compose screens; they should not duplicate reusable markup or recipe facts.

## Component placement

- Put a component in `components/ui` only when it is a product-agnostic interaction primitive.
- Put a component in `components/foundations`, `components/site`, or `components/recipe` when two or more routes can reuse it.
- Keep a feature beside its route when it owns route-specific state, such as the Cook Mode timer or progress rail.
- Extract repeated headings and status language instead of copying their markup.
- Prefer typed props and semantic variants over boolean styling flags or page-specific forks.

## Change policy

Refactors must preserve the approved layout, copy, tokens, responsive behaviour, and interaction states unless a design change is explicitly approved. Each product slice should pass typecheck, focused lint, recipe validation when data is involved, and the production build.
