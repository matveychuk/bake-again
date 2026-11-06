# Канонічний Recipe

Локальна реалізація 31.10–01.11.2026. Усі 28 записів використовують `Recipe`
зі `schemaVersion: 3` у `recipe.types.ts`. Рецепт, чернетка, крем і глазур мають
однаковий контракт. Формат даних не є версією випікання. `routeSlug` зберігає нейтральний
legacy route (наприклад napoleon-cake), незалежно від локалізованих slug.

Редагуйте відповідний `.recipe.ts` (чотири креми поки згруповані у
`cream-recipes.ts`). `registry.ts` експортує `recipes`, `getRecipe(id)` та чисту
`projectRecipeContent(recipe, locale)`. `getRecipeDocument` — лише оболонка
`{ recipe }` для чинних споживачів, без discriminator або другого формату.
`localized-recipe.types.ts` описує результати проєкцій, а не авторські записи.

- Числа, Quantity/IngredientQuantity, фази, ingredient/step/media IDs записані один
  раз; локалізовані рядки UK/EN/ES містяться біля відповідного стабільного ID.
- `yield.default.count` має exact/range/unknown; unknown не має вигаданого числа
  або одиниці. `geometry.state` розрізняє known/unknown/notApplicable;
  `geometry.default` може бути null. `flourConfiguration` може бути null;
  customBlend не називає рисове борошно комерційною сумішшю.
- `baseProvenance` визначає докази саме `versionId`; `evidenceExplanation` містить
  локалізований опис. У `configuration.base` немає окремого статусу.
- `publicationStatus`, `translationState`, `contentGaps` незалежні. Заповнення
  перекладів не публікує мовний маршрут. `translationReview` фіксує перевірку
  виконавцем, а не окреме погодження авторкою.
- `RecipeStep.cook` описує короткі дії, групування, кількості та залежність від
  крему. `mediaIds` посилаються на спільні assets у потрібному порядку.
  `displayMeta` зберігає наявні підписи, навіть коли додано структуровані числа.
- `durationPhaseId` посилається на єдину тривалість у `timing.phases`;
  `temperatureStages` пов'язує різні температури з фазами. Невідомий ovenMode
  лишається null. Таймери не стартують автоматично.
- `discovery` містить явні ролі cardTitle/category/flourSummary, collections,
  crop та архівний контекст. Коротка назва картки може відрізнятися від title.
  `inventory.ts`, `catalog-locales.ts`, component records, SEO/date indexes —
  похідні сумісні представлення, не додаткові місця редагування фактів.

## Розрахунок і споживачі

`composeRecipe(host, cream)` перевіряє дозволену сумісність, зберігає namespaced
IDs і чинний складений versionId та повертає похідний Recipe зі Suggested.
Далі `projectRecipeContent` локалізує той самий запис. `composeRecipeWithCream`
є сумісною точкою виклику цього канонічного шляху, а не іншою реалізацією рецепта.

`calculate-configuration.ts` і `projected-quantity.ts` використовують спільну
арифметику fixed/discrete/manual/range. `recipe-content-configuration.ts`
обробляє URL-вибір, кількості, вихід і позначені quantity mentions у прозі.
Невирішені кількості блокують Cook і додавання до покупок. Suggested не
підвищується до Calculated або Tested через множення.

Detail, print, Cook, shopping, SEO та assistant читають ці дані. Серверна
`lib/assistant/server/recipe-resolution.ts` обирає канонічний запис/крем;
вона більше не створює «повного» рецепта з іншої моделі. Публічні проєкції не
отримують приватних нотаток, покупок або маркетингових налаштувань.

## Наступний рецепт

1. Створіть один typed literal `satisfies Recipe`; внесіть усі відомі факти,
   джерела та UK/EN/ES рядки. Позначте реальні unknown/gaps, не копіюйте факти
   з іншого рецепта. Оберіть publication/evidence/translation state незалежно.
2. Додайте його до `recipes` у `registry.ts`. Для картки вкажіть
   `discovery.catalogue: true`; inventoryOrder визначає лише порядок, а не включення; curated order,
   search synonyms та URL aliases залишаються окремими конфігами за recipeId.
3. Використайте існуючі media assets або штатний `media/web-source` pipeline.
   Для чернетки без власних фото лишіть `heroMediaId: null` та `media: []`;
   картка й detail не підставляють чуже фото. Нові українські чернетки можуть
   тимчасово зберігати український оригінал в EN/ES полях зі станом
   `sourceDraft`, доки переклад не замовлено.
4. Запустіть `validate:recipes`, профільні тести, typecheck/build та перевірте
   локальний detail/Cook/print у трьох мовах і на 390/900/1440 px.

Не перейменовуйте effective versionId через зміну схеми. Не міняйте IDs чинних
кроків, інгредієнтів і медіа лише заради стилю. Збережені Cook/timer/shopping
ключі та особисті дані не мігрували й не очищалися.

## Докази перенесення

`docs/strategy/recipe-model-baseline-2026-10-31/catalog.json` — незалежний snapshot
актуальної робочої версії перед змінами. Його компактна копія для CI збережена
у tracked `__fixtures__/pre-unification-2026-10-31.json`; тести не залежать
від приватної ignored папки docs. `canonical-migration.test.ts` порівнює
з ним усі 27 записів × 3 мови, перевіряє вихід, кількості, тексти, примітки,
медіа, порядок та IDs; окремо перевіряє конфігурації й композиції. Оригінальні
мовні інструкції не скорочені. Додані структуровані фази беруться виключно з
їхніх уже записаних дій/порад; загальний час не виводиться сумуванням фаз.

Чотири креми з підписаною приблизною масою використовують цю саму записану
масу в numeric yield (g або kg) та `approximate: true`. Старий count=1 batch
не використовується для заміни числа в підписі маси при масштабуванні.
