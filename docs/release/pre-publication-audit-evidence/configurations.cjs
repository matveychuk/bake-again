const {chromium,go,route,save,snapshot,out,base}=require('./browser-common.cjs');
const query=n=>`?mode=ingredient&ingredient=schar-mix-b&amount=${n}&unit=g`;
const next=/^(Done, next|Готово, далі|Listo, siguiente)$/;
const sessions=p=>p.evaluate(()=>Object.fromEntries(Object.entries(localStorage).filter(([k])=>k.includes(':cook-mode:'))));
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true});const results=[];
await Promise.all([390,900,1440].map(async width=>{for(const locale of ['uk','en','es']){
const c=await b.newContext({viewport:{width,height:900}}),p=await c.newPage();const nojs=await b.newContext({viewport:{width,height:900},javaScriptEnabled:false}),ssr=await nojs.newPage();let item={locale,width,cases:[],restored:[]};
try{const path=route('gluten-free-napoleon',locale);for(const [amount,steps] of [[450,1],[225,2],[900,3]]){await go(p,path+'/cook'+query(amount));for(let i=0;i<steps;i++)await p.getByRole('button',{name:next}).click();await p.waitForTimeout(100)}item.sessionsBefore=await sessions(p);
for(const q of [query(200),query(0),query(99),query('NaN'),query(-2),query('Infinity'),query(''),query(225),query(450),query(900),'?geometry=round-24cm-preview','?geometry=bogus','?mode=scale&scale=0','?mode=scale&scale=3','?mode=scale&scale=NaN','?mode=ingredient&ingredient=eggs&amount=450&unit=g','?mode=ingredient&ingredient=schar-mix-b&amount=450&unit=kg']){
await go(ssr,path+'/cook'+q);const initial=await snapshot(ssr);await go(p,path+'/cook'+q);const after=await snapshot(p);item.cases.push({query:q,initial,after,sessions:await sessions(p)});
if(q===query(200)){await p.screenshot({path:`${out}/blocked-${locale}-${width}.png`});const back=p.locator('main a').last();item.backHref=await back.getAttribute('href');await back.focus();item.backFocus=await back.evaluate(e=>({outline:getComputedStyle(e).outline,boxShadow:getComputedStyle(e).boxShadow}));await p.keyboard.press('Enter');await p.waitForTimeout(150);item.returnedUrl=p.url();item.returnedDetail=await p.locator('body').innerText()}
if(q==='?geometry=bogus'||q==='?mode=scale&scale=0')await p.screenshot({path:`${out}/invalid-${q.includes('geometry')?'geometry':'scale'}-${locale}-${width}.png`});
}
for(const amount of [225,900,450]){await go(p,path+'/cook'+query(amount));item.restored.push({amount,text:await p.locator('body').innerText()})}
await go(p,path+'?geometry=round-24cm-preview');item.geometryDetail=await snapshot(p);await p.screenshot({path:`${out}/geometry-detail-${locale}-${width}.png`});item.geometryJsonLd=await p.locator('script[type="application/ld+json"]').count();
}catch(e){item.error=String(e)}results.push(item);save('configurations.json',results);await c.close();await nojs.close();
}}));save('configurations.json',results);console.log({count:results.length,errors:results.filter(x=>x.error)});await b.close()})().catch(e=>{console.error(e);process.exit(1)});
