import assert from 'node:assert/strict';
import test from 'node:test';
import { recipeDocuments, getRecipeContent } from '../../../content/recipes/registry.ts';
import { getAssistantRecipeDocument } from './source-recipe.ts';
import { createAssistantService } from './service.ts';
import { buildAssistantContext } from './context.ts';
import type { AssistantRequestV1 } from '../contracts.ts';
import { buildAssistantDeveloperInstructions } from './prompt.ts';

const config = { enabled: true, apiKey: 'test', sessionSecret: 's'.repeat(32), model: 'gpt-5.4-mini', maxOutputTokens: 2000 };
function requestFor(id: string, locale: 'en' | 'es' | 'uk' = 'uk'): AssistantRequestV1 {
  const document = getAssistantRecipeDocument(id)!;
  assert.equal(document.kind, 'detailed');
  return { schemaVersion: 1, recipeId: id, recipeVersionId: document.recipe.versionId!, locale, surface: 'recipe-detail', scope: { kind: 'recipe' }, configuration: { kind: 'base' }, question: 'Поясніть рецепт.', history: [] };
}

void test('every published recipe reaches the provider with its own recorded context in all locales', async () => {
  let calls = 0;
  for (const document of recipeDocuments.filter(document => document.recipe.publicationStatus === 'published')) {
    for (const locale of ['en', 'es', 'uk'] as const) {
      const request = requestFor(document.recipe.id, locale);
      const previousCalls = calls;
      const service = createAssistantService({ config, provider: { async answer(_request, projection) {
        calls++;
        assert.equal(projection.context.recipeId, request.recipeId);
        assert.equal(projection.context.locale, locale);
        assert.deepEqual(projection.context.steps.map(step => step.id), getRecipeContent(request.recipeId, locale)!.steps.map(step => step.id));
        return { locale, actionId: null, outcome: 'insufficient-context', blocks: [{ kind: 'limitation', text: { uk: 'Потрібно більше відомостей.', en: 'More detail is needed.', es: 'Faltan detalles.' }[locale], evidenceIds: [] }] };
      } } });
      const response = await service.respond(request, { requestId: 'test', signal: new AbortController().signal });
      assert.ok(response.ok, `${request.recipeId}/${locale}`);
      assert.equal(calls, previousCalls + 1, `${request.recipeId}/${locale} should reach the provider`);
    }
  }
  assert.equal(calls, recipeDocuments.filter(document => document.recipe.publicationStatus === 'published').length * 3);
});

void test('crepes step questions preserve prepared help, calculated quantities and fixed salt', () => {
  const document = getAssistantRecipeDocument('crepes')!;
  assert.equal(document.kind, 'detailed');
  if (document.kind !== 'detailed') throw new Error('Expected projection');
  const request = { ...requestFor('crepes'), surface: 'cook-mode' as const, scope: { kind: 'step' as const, stepIds: ['start-batter'] as [string] }, configuration: { kind: 'adjusted' as const, geometryId: 'round-pan-28-cm', quantityAdjustment: { mode: 'batchScale' as const, factor: 2 as const } } };
  const projection = buildAssistantContext(document.recipe, request, null, buildAssistantDeveloperInstructions('uk'))!;
  assert.ok(projection);
  assert.equal(projection.context.ingredients.find(line => line.id === 'flour')?.amount.value?.kind, 'exact');
  assert.deepEqual(projection.context.ingredients.find(line => line.id === 'flour')?.amount.value, { kind: 'exact', value: 280, unit: 'g' });
  assert.equal(projection.context.ingredients.find(line => line.id === 'salt')?.amount.value, null);
  assert.deepEqual(document.recipe.ingredientSections.flatMap(section => section.lines).find(line => line.id === 'salt')?.quantity.equivalent, { kind: 'exact', value: 1, unit: 'pinch' });
  assert.equal(projection.context.configuration.status, 'Calculated');
  assert.ok(projection.context.steps[0].guidance.some(item => item.value.text.includes('грудочки')));
  assert.ok(projection.context.steps.every(step => step.instruction.evidence.status !== 'Tested'));
});

void test('a selected cream is validated, namespaced and retains Suggested composition evidence', () => {
  const id = 'eclairs';
  const base = getAssistantRecipeDocument(id)!;
  const creamId = getRecipeContent(id)!.creamOptions!.recipeIds[0];
  const document = getAssistantRecipeDocument(id, `${base.recipe.versionId}-cream-${creamId}`)!;
  assert.equal(document.kind, 'detailed');
  if (document.kind !== 'detailed') throw new Error('Expected projection');
  assert.ok(document.recipe.steps.some(step => step.id.startsWith(`cream-${creamId}-`)));
  assert.equal(document.recipe.baseProvenance.state, 'suggested');
  const request = { ...requestFor(id), recipeVersionId: document.recipe.versionId, scope: { kind: 'step' as const, stepIds: [document.recipe.steps.find(step => step.id.startsWith(`cream-${creamId}-`))!.id] as [string] } };
  const projection = buildAssistantContext(document.recipe, request, null, buildAssistantDeveloperInstructions('uk'))!;
  assert.ok(projection && projection.context.recipe.evidence.status === 'Suggested');
  assert.equal(getAssistantRecipeDocument(id, `${base.recipe.versionId}-cream-forged`)?.recipe.versionId, base.recipe.versionId);
});

void test('unpublished recipes and stale versions are rejected before a provider request', async () => {
  let calls = 0;
  const service = createAssistantService({ config, provider: { async answer() { calls++; throw new Error('Unexpected provider call'); } } });
  await assert.rejects(service.respond(requestFor('apple-charlotte'), { requestId: 'test', signal: new AbortController().signal }), { code: 'LOCALE_UNAVAILABLE' });
  await assert.rejects(service.respond({ ...requestFor('crepes'), recipeVersionId: 'crepes-stale' }, { requestId: 'test', signal: new AbortController().signal }), { code: 'RECIPE_VERSION_MISMATCH' });
  assert.equal(calls, 0);
});
