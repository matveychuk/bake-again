const {fs,save,out}=require('./browser-common.cjs');
const assert=require('node:assert/strict');
const read=n=>JSON.parse(fs.readFileSync(`${out}/${n}.json`));
const summary={};
const quantities=read('quantities');assert.equal(quantities.length,54);
for(const r of quantities){assert(!r.error);assert(Object.values(r.checks).every(Boolean));assert.equal(r.errors.length,0);
 if(r.id==='gluten-free-napoleon'){
 const phrase={uk:`яйця для крему — ${4*r.scale} шт.`,en:`custard eggs — ${4*r.scale} pcs`,es:`huevos para la crema: ${4*r.scale} uds.`}[r.locale];
 assert(r.method.includes(phrase));assert(r.cook.some(s=>s.includes(phrase)));assert(!/two cakes|два торти|dos tartas/i.test(r.method));
 }}summary.quantities={scenarios:54,cookScreens:quantities.reduce((n,r)=>n+r.cook.length,0)};
const nav=read('navigation');assert.equal(nav.length,54);for(const r of nav){assert(r.navigated);assert.equal(r.errors.length,0);assert.equal(new URL(r.url).search,new URL(r.href,'http://localhost').search)}summary.navigation=54;
const configs=read('configurations');for(const r of configs){assert(!r.error);let previous=r.sessionsBefore;for(const c of r.cases){const amount=new URLSearchParams(c.query).get('amount');const valid=['225','450','900'].includes(amount)&&!c.query.includes('ingredient=eggs')&&!c.query.includes('unit=kg');
for(const v of [c.initial,c.after]){assert(v.overflow.scroll<=v.overflow.client);if(valid){assert.deepEqual(v.status.map(s=>s.status),[amount==='450'?'tested':'calculated'])}else{assert.equal(v.status.length,0);assert(!v.text.includes('450 '));}}
if(!valid)assert.deepEqual(c.sessions,previous);previous=c.sessions;}
assert.equal(r.geometryJsonLd,0);assert.equal(r.geometryDetail.status.length,0);assert.equal(new URL(r.returnedUrl).searchParams.get('amount'),'200');
for(const restored of r.restored){assert(restored.text.includes({225:'3 з 17',450:'2 з 17',900:'4 з 17'}[restored.amount])||restored.text.includes({225:'3 / 17',450:'2 / 17',900:'4 / 17'}[restored.amount])||restored.text.includes({225:'3 of 17',450:'2 of 17',900:'4 of 17'}[restored.amount])||restored.text.includes({225:'3 de 17',450:'2 de 17',900:'4 de 17'}[restored.amount]));}}
summary.configurations={profiles:configs.length,cases:configs.reduce((n,r)=>n+r.cases.length,0),renderStates:configs.reduce((n,r)=>n+r.cases.length*2,0)};
const notes=read('notes-compositions');assert.equal(notes.length,72);for(const r of notes){assert(!r.error);assert(!r.overflow);if(r.id==='apple-fritters'){const item=JSON.parse(r.storage['bake-again:shopping:v2']).items.find(i=>i.ingredientId==='sweetener');assert.deepEqual(item.quantity,{kind:'exact',value:r.scale,unit:'tbsp'});const qty=new Intl.NumberFormat(r.locale).format(r.scale)+' '+{uk:'ст. л.',en:'tbsp',es:r.scale===1?'cda.':'cdas.'}[r.locale];for(const s of [r.review,r.shopping,r.reloaded])assert(s.includes(qty));}if(r.cream){assert(r.status.every(s=>s==='suggested'));assert.equal(r.jsonLd,0)}}summary.notesCompositions={scenarios:notes.length,cookScreens:notes.reduce((n,r)=>n+(r.cook?.length??0),0)};
const recovered=read('recovery-shopping');assert.equal(recovered.length,9);assert(recovered.every(r=>r.pass));summary.recoveryShopping=9;
const broad=read('broad-actions');assert.equal(broad.length,66);for(const r of broad){assert(!r.error);assert.equal(r.jsonLd,0);assert(!r.status.includes('tested'));}summary.broadActions=66;
const http=read('http-seo');for(const r of http.migration){if(r.pub==='unpublished')assert.equal(r.status,404);else if(r.from===r.to)assert.equal(r.status,200);else {assert.equal(r.status,308);assert.equal(r.location,r.to)}}summary.migration=http.migration.length;
save('verified-results.json',summary);console.log(summary);
