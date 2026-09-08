# Gluten-Free Baking
## Product & Engineering Brief — v1

### 1. Project definition

Gluten-Free Baking is a modern multilingual recipe product built around a deliberately small collection of reliable gluten-free baking recipes.

It is not intended to become a huge generic recipe database.

Its value is based on three things:

**Taste. Simplicity. Trust.**

The collection originates from roughly a decade of real family cooking and repeated adaptation of familiar recipes after gluten-free eating became necessary within the author's family.

The product should remove the feeling that gluten-free baking is a poor substitute for “normal” baking.

---

# 2. Product promise

The fundamental promise is:

**You can still bake food you genuinely love after going gluten-free.**

Supporting ideas:

- gluten-free baking can taste normal;
- it does not have to be complicated;
- reliable recipes are more useful than endless choice;
- familiar food matters;
- people should be able to reproduce the result at home without specialist baking knowledge.

Possible future brand territories:

**Gluten-free without compromise**

**The recipes that actually work**

**Your favourite baking, without gluten**

These are positioning explorations, not final brand slogans.

---

# 3. Origin story

Around 2015–2016, the author's young son transitioned to a gluten-free diet.

The initial experience was one of frustration and restriction: many gluten-free baked foods seemed noticeably inferior in texture and taste.

Over the following years, familiar family recipes were adapted repeatedly.

Ingredient amounts changed.

Flour mixes changed.

Individual grams changed.

Recipes that worked stayed.

Recipes that did not were changed again.

Approximately ten years later, this produced a compact personal collection of recipes that the family cooks because they enjoy them — not merely because they happen to be gluten-free.

The product exists to share that collection.

This story should establish authenticity but should not dominate the product.

---

# 4. Brand model

The project is a standalone brand.

It is **not** “Oleksandra's baking blog”.

The author's identity is supporting context rather than the product itself.

Recommended structure:

**Brand → recipes → food → utility → author story**

rather than:

**Author → lifestyle → personal content → recipes**

An About page can include:
- one author portrait;
- a concise family story;
- why the collection exists;
- approximately ten years of practical recipe refinement.

Avoid building parasocial/personal-influencer mechanics into the product.

---

# 5. Audience

### Core audience

Adults with limited or moderate baking experience who need or choose to eat gluten-free.

### Important audience scenarios

#### Parent
“My child can no longer eat gluten. I want to make familiar food that the rest of the family will enjoy too.”

#### Newly gluten-free adult
“I don't want every cake, pancake or biscuit to feel like a replacement product.”

#### Everyday home cook
“I want a recipe that works. I don't want a lecture about flour chemistry.”

### Not the primary audience

Professional bakers.

Food scientists.

Highly technical experimental bakers.

People primarily looking for nutritional or medical information.

---

# 6. Content philosophy

A recipe website should help someone cook.

It should not optimise for the amount of article text surrounding a recipe.

### Recipe pages should prioritise

1. strong image;
2. concise description;
3. time / difficulty / portions;
4. ingredients;
5. instructions;
6. useful practical notes;
7. substitutions if known;
8. scaling and shopping utilities.

Long SEO filler content should be avoided.

Search discoverability should come from technically strong SEO, structured content and genuinely useful information rather than artificial article length.

---

# 7. Recipe authority

Recipes can be classified internally by trust level.

Example:

### Verified
Made repeatedly by the author/family.

### Tested variation
A known variation that has been made successfully.

### Suggested variation
Potential AI/user adaptation that has not been personally tested.

The UI does not necessarily need these exact labels, but the underlying distinction is important.

An AI-generated suggestion must never silently become equivalent to a ten-year-tested recipe.

---

# 8. Initial content

Expected initial library: approximately 15–20 recipes.

Possible categories:

### Everyday
- pancakes;
- crepes;
- lazy vareniki;
- simple muffins.

### Cakes
- sponge cake;
- Napoleon;
- other family cakes.

### Sweet baking
- cinnamon rolls;
- chocolate crinkle cookies;
- biscuits;
- muffins.

Categories should emerge from actual recipes rather than creating empty taxonomy in advance.

---

# 9. Photography

Original photography should become an important part of the visual identity.

The author's husband has a good camera and photographs can be created gradually while recipes are added.

Photography guidelines should eventually standardise:
- light;
- background;
- framing;
- serving style;
- image ratios;
- hero image;
- process photos where useful.

Do not delay MVP until every recipe has professional photography.

A smaller first collection with strong photography is preferable to launching a large visually inconsistent collection.

---

# 10. Multilingual architecture

Internationalisation must be a first-class requirement.

Likely initial languages:

- English;
- Spanish;
- Ukrainian.

Architecture should allow more languages later.

### Behaviour

On first visit:
1. detect browser language;
2. select the closest supported language;
3. allow immediate manual override;
4. remember the user's choice.

Never make language selection impossible to override.

### SEO requirements

Use language-specific URLs.

Example:

/en/recipes/...
/es/recetas/...
/uk/recipes/...

Use:
- hreflang;
- canonical URLs;
- localized metadata;
- localized structured data where appropriate;
- localized OpenGraph information.

Do not dynamically replace language content at the same URL.

---

# 11. MVP

The MVP should prove that people want the recipes.

### MVP should include

- responsive website;
- Home;
- recipe listing;
- recipe detail pages;
- categories;
- multilingual support;
- language switcher;
- recipe search;
- favourites;
- shopping list;
- ingredient scaling;
- Recipe structured data;
- sitemap;
- strong metadata;
- original photography for key recipes;
- About;
- basic analytics;
- Instagram account.

### AI MVP

Add a small contextual assistant once the underlying recipe data model is stable.

Useful initial actions:

- “Can I substitute this?”
- “Scale this recipe to 8 servings.”
- “Which recipes can I make with what I have?”
- “Add missing ingredients to my shopping list.”
- “Find me something quick.”
- “Can I use another Schär flour mix?”

---

# 12. Explicit MVP non-goals

Do not initially build:

- complex accounts;
- social networking;
- comments;
- ratings;
- community recipes;
- user-generated public recipes;
- native mobile app;
- large CMS;
- expensive search infrastructure;
- elaborate recommendation ML;
- paid subscription system;
- advanced troubleshooting encyclopedia;
- nutrition/medical advice platform;
- hundreds of recipes.

These can only be reconsidered when user behaviour demonstrates a reason.

---

# 13. Personalisation

### Phase 1: local

Store locally where appropriate:

- selected language;
- favourites;
- recent recipes;
- shopping list;
- basic preferences.

Advantages:
- no account friction;
- little infrastructure;
- little cost;
- less personal data.

### Phase 2: cloud sync

Only introduce accounts if users need:

- favourites across devices;
- saved recipe collections;
- persistent shopping lists;
- household sharing;
- personalised AI context.

---

# 14. Collections

A future signed-in user may create collections such as:

“Weekend”

“Ivan likes”

“Christmas”

“Quick breakfast”

“Birthday cakes”

“Things to try”

This is a more useful reason for accounts than requiring registration merely to access recipes.

---

# 15. Shopping system

Shopping lists should be treated as structured data rather than plain text.

Potential capabilities:

- add ingredients from one recipe;
- combine multiple recipes;
- combine duplicate ingredients;
- scale amounts;
- mark purchased items;
- remove pantry staples;
- optionally group by shop section.

Do not overbuild this during MVP.

---

# 16. Recipe scaling

Scaling can become one of the site's signature utilities.

Examples:

6 → 10 pancakes

18 cm → 24 cm cake

8 → 12 portions

1 → 2 batches

Scaling should primarily be deterministic code rather than AI.

AI should explain or help interpret results, not be used for arithmetic that normal application logic can perform reliably.

---

# 17. AI assistant vision

The AI assistant is **not the chef**.

The recipe collection is the source of truth.

The AI assistant is the interface between the user and that knowledge.

Architecture concept:

Verified recipe data  
↓  
retrieval/context  
↓  
AI assistant  
↓  
natural-language interaction

### AI can

- search semantically;
- explain steps in simpler language;
- scale recipes;
- compare recipes;
- locate ingredient alternatives;
- answer contextual questions;
- create a shopping list;
- recommend among existing recipes;
- use explicitly documented substitution rules;
- translate recipe-related interaction.

### AI should not

- invent an untested recipe and label it verified;
- pretend an unknown substitution will definitely work;
- provide medical diagnoses;
- represent the author as an expert in food chemistry;
- produce unnecessary long-form answers where a simple answer is sufficient.

---

# 18. Agentic product possibilities

Agentic behaviour should solve real workflows.

Example:

User:
“I want Napoleon for Sunday, 10 people.”

Agent can:
1. locate the verified Napoleon recipe;
2. understand default servings;
3. calculate the required multiplier;
4. generate adjusted quantities;
5. create shopping list;
6. identify what the user already marked as available;
7. show remaining ingredients.

Potential later flow:

“I have eggs, butter and Schär Mix C. What can I make in under one hour?”

Agent:
1. searches recipe dataset;
2. evaluates ingredients;
3. filters by cooking time;
4. lists suitable verified recipes;
5. identifies missing ingredients;
6. offers to add them to shopping list.

That is preferred over a generic chatbot window.

---

# 19. AI economics

AI must operate under explicit cost constraints.

Engineering requirements:

- cheap default model;
- escalation only when justified;
- minimal context;
- retrieval instead of sending the entire recipe database;
- caching;
- server-side rate limits;
- per-user/session limits where appropriate;
- maximum output lengths;
- monthly spend guardrail;
- observability of token usage.

Never expose unrestricted API usage directly from the browser.

---

# 20. Technical direction

Initial preference:

### Application
Next.js

### Language
TypeScript

### UI
React

### Styling
Decision later after visual exploration.

Potential options:
- CSS Modules;
- Tailwind;
- another lightweight design-system approach.

Choice should optimise maintainability rather than trend-following.

### Recipes
Initially stored in repository as structured content.

Possible representation:

- MDX + typed frontmatter;
- JSON;
- YAML;
- TypeScript content objects.

Schema should be validated.

Example conceptual model:

Recipe
- id
- slug
- locale
- title
- description
- servings
- prepTime
- cookingTime
- ingredients[]
- steps[]
- substitutions[]
- categories[]
- images[]
- verifiedDate
- sourceVersion

The exact schema should be designed before implementation.

---

# 21. Why no CMS initially

With approximately 20 author-managed recipes, introducing a CMS is likely unnecessary infrastructure.

Repository-based content provides:
- version control;
- review history;
- easy AI/Codex access;
- no SaaS dependency;
- no recurring cost;
- static generation;
- strong type safety.

Reconsider a CMS if non-technical editors eventually need to publish recipes regularly.

---

# 22. Database strategy

Do not add a database merely because modern web applications normally have one.

### No DB required initially for

- recipes;
- categories;
- translations;
- basic favourites;
- shopping lists;
- language preferences.

### DB becomes justified for

- accounts;
- cross-device sync;
- personal collections;
- shared household lists;
- user preferences;
- subscription state.

---

# 23. SEO

SEO should be engineered rather than purchased.

Initial requirements:

- semantic HTML;
- server-rendered/static content;
- Recipe JSON-LD;
- breadcrumbs;
- sitemap;
- robots.txt;
- canonical URLs;
- hreflang;
- good titles and descriptions;
- image optimisation;
- descriptive image alt text;
- internal linking;
- fast page load;
- excellent Core Web Vitals.

Avoid writing huge low-value articles solely to chase search traffic.

---

# 24. Accessibility

Accessibility should be part of implementation rather than a final audit.

Target:
- semantic structure;
- full keyboard support;
- visible focus states;
- sufficient contrast;
- accessible forms;
- accessible menus;
- screen-reader-friendly recipe structure;
- reduced-motion respect;
- appropriate alt text.

The project should be portfolio-quality here.

---

# 25. Quality engineering

The repository should demonstrate professional engineering standards.

Include where appropriate:

- strict TypeScript;
- linting;
- formatting;
- automated tests;
- component tests;
- end-to-end tests for critical journeys;
- accessibility checks;
- CI;
- automated deployment;
- dependency update strategy;
- error monitoring;
- performance monitoring.

Do not chase 100% test coverage.

Test important behaviour.

---

# 26. Performance

Recipe content is highly suitable for static/server rendering.

Aim for:
- minimal client JavaScript;
- optimised image delivery;
- responsive images;
- font optimisation;
- fast initial load;
- progressively enhanced interactive features.

Do not turn static recipe pages into unnecessary client-side applications.

---

# 27. Privacy

Collect as little personal information as possible.

Initially:
- no mandatory account;
- minimal cookies;
- privacy-conscious analytics;
- language/favourite preferences locally where possible.

When cloud accounts or email lists are introduced, revisit GDPR requirements explicitly.

---

# 28. Cost architecture

Cost control is a product requirement.

### Early-stage target

Infrastructure cost should be close to zero beyond:
- domain;
- small AI API usage;
- any optional design/analytics service explicitly chosen.

Prefer generous free tiers where terms permit the project's current use.

### Introduce paid infrastructure when

- usage requires it;
- commercial activity requires a plan change;
- operational reliability justifies it;
- revenue reasonably offsets recurring cost.

Each recurring dependency should answer:

**What user value are we buying with this monthly cost?**

If the answer is unclear, do not introduce it.

---

# 29. Instagram strategy

Instagram is the discovery/content layer.

The website is the durable product/content layer.

Content can include:

### Reels
- hands preparing the recipe;
- mixing/baking process;
- slicing the finished result;
- texture reveal;
- short recipe steps.

### Photos
- finished food;
- detail shots;
- ingredients/process where visually interesting.

### Carousels
- “5 gluten-free recipes I cook constantly”;
- “What I make when we want something sweet in 30 minutes”;
- useful substitution notes derived from verified experience;
- comparisons of recipe variations.

No requirement for talking-head content.

No requirement for the author to become a public personality.

---

# 30. Content workflow

One recipe should ideally create several assets.

Example:

**Napoleon**

→ website recipe  
→ hero photograph  
→ 2–4 process photographs  
→ vertical reel  
→ Instagram photo  
→ carousel  
→ Pinterest-compatible image if later useful  
→ localized versions

The goal is not to produce independent content for every channel.

Build a reusable content pipeline.

---

# 31. Portfolio value

This project can demonstrate the author's ability to build modern AI-native products.

Potential portfolio story:

“Designed and developed a multilingual consumer recipe platform with structured content, international SEO, accessible UI, deterministic recipe utilities and an AI assistant grounded in verified domain content.”

Strong engineering topics worth demonstrating:

- TypeScript domain modelling;
- internationalisation;
- SSR/SSG;
- structured data;
- performance;
- accessibility;
- AI integration;
- retrieval;
- prompt/tool architecture;
- testing;
- CI/CD;
- observability;
- product analytics;
- cost-aware architecture.

Do not expose technical complexity to users unless it improves UX.

---

# 32. Monetisation hypothesis

No monetisation model needs to be chosen before launch.

Potential paths:

### Digital content
- ebook;
- curated collections;
- holiday baking packs;
- beginner gluten-free baking pack.

### Premium product functionality
- advanced collections;
- meal/baking planning;
- synced household shopping;
- premium assistant.

### Affiliate
Products genuinely used in recipes:
- flour mixes;
- equipment;
- baking forms;
- ingredients.

### Sponsorship
Only if aligned with brand trust.

### Advertising
Possible later, but avoid destroying recipe UX with excessive ads.

Physical baking/delivery is not the primary business hypothesis.

Digital content and software-like functionality provide better scalability and fit the author's background.

---

# 33. Roadmap

## Phase 0 — Discovery

- brand exploration;
- name;
- visual directions;
- competitor review;
- recipe inventory;
- initial content model;
- photography experiment.

## Phase 1 — Product foundation

- repo;
- architecture;
- design system;
- i18n architecture;
- recipe schema;
- 3–5 recipes;
- Home;
- recipe detail;
- recipe listing.

Deploy early.

## Phase 2 — MVP

- approximately 10–20 recipes;
- search/filtering;
- favourites;
- shopping list;
- scaling;
- full multilingual UX;
- structured SEO;
- photography;
- analytics;
- Instagram launch.

## Phase 3 — AI

- recipe-aware assistant;
- ingredient questions;
- substitution assistance;
- natural-language recipe discovery;
- shopping-list actions;
- AI cost controls.

## Phase 4 — Personalisation

Only if justified:
- authentication;
- cloud favourites;
- personal collections;
- synced lists.

## Phase 5 — Business experiments

Test:
- audience growth;
- newsletter;
- digital products;
- affiliate;
- premium functionality.

Let usage decide what becomes the business.

---

# 34. Success metrics

Do not initially judge success primarily by revenue.

Early useful indicators:

### Product
- users reach recipe pages;
- repeat visitors;
- recipes saved;
- shopping-list usage;
- AI utility usage;
- successful search rate.

### Content
- organic search impressions;
- Instagram saves;
- shares;
- click-through to recipes;
- recipes users revisit.

### Quality
- low error rate;
- strong Core Web Vitals;
- accessibility;
- low infrastructure cost.

Later:
- newsletter sign-ups;
- conversion to paid products;
- affiliate revenue;
- recurring users.

---

# 35. Decision framework

When considering a feature, ask:

1. Does it help someone successfully bake something?
2. Is there evidence users need it?
3. Can a simpler implementation deliver most of the value?
4. Does it increase recurring cost?
5. Does AI genuinely improve this task?
6. Is deterministic application logic more reliable?
7. Does this belong in MVP?
8. Are we building it for users or because it looks impressive technically?

---

# 36. Open questions

Still to decide:

### Brand
- product name;
- domain;
- logo;
- final visual direction;
- tone of voice.

### Languages
- which language launches first;
- whether all three languages launch simultaneously;
- translation workflow;
- whether translations are AI-first + human review.

### Recipes
- exact initial 10–20;
- categories;
- recipe data model;
- how substitutions are represented;
- how strongly flour brands are tied to individual recipes.

### UX
- Home page structure;
- recipe card design;
- navigation;
- AI assistant UI;
- favourite/list behaviour.

### Engineering
- exact styling approach;
- content format;
- hosting provider;
- analytics;
- eventual auth/database provider;
- AI model/provider architecture.

### Business
- final brand-market positioning;
- newsletter;
- first potential monetisation experiment.

These questions should be resolved progressively rather than blocking the initial prototype.