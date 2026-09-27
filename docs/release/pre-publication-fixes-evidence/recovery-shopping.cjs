const {chromium,go,route,save,out}=require('./browser-common.cjs');
const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true}),rows=[];
for(const locale of ['uk','en','es'])for(const width of [390,900,1440]){
 const c=await b.newContext({viewport:{width,height:900}}),p=await c.newPage(),r={locale,width};
 try {
 const path=route('gluten-free-napoleon',locale);
 await go(p,path+'?geometry=round-24cm-preview&mode=scale&scale=2');
 assert.equal(await p.locator('[data-status]').count(),0);
 assert.equal(await p.locator('script[type="application/ld+json"]').count(),0);
 r.blockedDetail=await p.locator('main').innerText();
 const recovery=p.locator('section[aria-labelledby="recipe-content"] a');
 await recovery.focus();r.focus=await recovery.evaluate(e=>({outline:getComputedStyle(e).outline,boxShadow:getComputedStyle(e).boxShadow}));
 await p.screenshot({path:`${out}/recovery-${locale}-${width}.png`});
 await p.keyboard.press('Enter');await p.waitForTimeout(500);
 assert.equal(new URL(p.url()).search,'');assert((await p.locator('[data-status]').first().getAttribute('data-status'))==='tested');
 r.recoveryUrl=p.url();
 const source=(configurationKey,batchId)=>({recipeId:'apple-fritters',recipeVersionId:'apple-fritters-source-v1',ingredientLineId:'sweetener',sectionId:'batter',selectedIngredientId:'sweetener',configurationKey,batchId});
 const old={schemaVersion:2,updatedAt:'2026-09-20T00:00:00.000Z',items:[{id:'sweetener:as-needed',ingredientId:'sweetener',quantity:null,checked:true,createdAt:'2026-09-20T00:00:00.000Z',updatedAt:'2026-09-20T00:00:00.000Z',sources:[source('scale:0.5'),source('scale:1.5'),source('scale:2','additional')]}]};
 await p.evaluate(data=>localStorage.setItem('bake-again:shopping:v2',JSON.stringify(data)),old);
 await go(p,`/${locale}/shopping-list`);r.migrated=await p.locator('body').innerText();
 const unit={uk:'ст. л.',en:'tbsp',es:'cdas.'}[locale];assert(r.migrated.includes(`4 ${unit}`));
 assert.equal(await p.getByRole('checkbox').first().isChecked(),true);
 await p.screenshot({path:`${out}/migrated-shopping-${locale}-${width}.png`});
 await p.getByRole('checkbox').first().uncheck();await p.waitForTimeout(250);await p.reload();await p.waitForTimeout(500);
 r.persisted=JSON.parse(await p.evaluate(()=>localStorage.getItem('bake-again:shopping:v2')));
 assert.deepEqual(r.persisted.items[0].quantity,{kind:'exact',value:4,unit:'tbsp'});assert.equal(r.persisted.items[0].checked,false);
 // Adding an already saved configuration must not double-count the restored source.
 await go(p,route('apple-fritters',locale)+'?mode=scale&scale=0.5');
 await p.getByRole('button',{name:/^(To shopping list…|До списку покупок…|A la lista de compra…)$/}).click();
 await p.getByRole('button',{name:/^(Add to list|Додати до списку|Añadir a la lista) \(/}).click();await p.waitForTimeout(300);
 const stored=JSON.parse(await p.evaluate(()=>localStorage.getItem('bake-again:shopping:v2')));
 assert.equal(stored.items.find(i=>i.ingredientId==='sweetener').quantity.value,4);
 r.dedup=stored.items.find(i=>i.ingredientId==='sweetener');
 await go(p,route('apple-fritters',locale)+'/cook?mode=scale&scale=2');
 for(let i=0;i<25;i++){const next=p.getByRole('button',{name:/^(Done, next|Готово, далі|Listo, siguiente)$/});if(!await next.count())break;await next.click()}
 await p.getByRole('button',{name:/^(Finish cooking|Завершити приготування|Terminar la preparación)$/}).click();await p.waitForTimeout(300);
 r.completion=await p.locator('body').innerText();
 const returnLink=p.locator('a').filter({hasText:/рецепт|recipe|receta/i}).last();r.completionHref=await returnLink.getAttribute('href');await returnLink.focus();await p.keyboard.press('Enter');await p.waitForTimeout(500);
 assert.equal(new URL(p.url()).pathname,route('apple-fritters',locale));assert.equal(new URL(p.url()).searchParams.get('scale'),'2');r.completionReturn=p.url();
 r.overflow=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert.equal(r.overflow,false);r.pass=true;
 }catch(e){r.error=String(e)} rows.push(r);save('recovery-shopping.json',rows);await c.close();
}await b.close();console.log({count:rows.length,failed:rows.filter(r=>!r.pass)});if(rows.some(r=>!r.pass))process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
