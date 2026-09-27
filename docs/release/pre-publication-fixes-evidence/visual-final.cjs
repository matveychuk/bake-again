const {chromium,go,route,save,out}=require('./browser-common.cjs');
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true}),rows=[];
for(const locale of ['uk','en','es'])for(const width of [390,900,1440]){const c=await b.newContext({viewport:{width,height:900}}),p=await c.newPage(),r={locale,width};
const responses=[];p.on('response',res=>{if(res.status()>=400)responses.push({url:res.url(),status:res.status()})});
await go(p,route('gluten-free-napoleon',locale)+'/cook?mode=scale&scale=2');
for(let i=0;i<10;i++)await p.getByRole('button',{name:/^(Done, next|Готово, далі|Listo, siguiente)$/}).click();await p.waitForTimeout(300);
r.custard=await p.locator('body').innerText();r.custardOverflow=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
await p.screenshot({path:`${out}/custard-final-${locale}-${width}.png`});
await go(p,route('gluten-free-napoleon',locale)+'/cook?mode=ingredient&ingredient=schar-mix-b&amount=200&unit=g');
await p.locator('main a').last().focus();await p.screenshot({path:`${out}/blocked-final-${locale}-${width}.png`});r.blockedOverflow=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
r.responses=responses;rows.push(r);await c.close();}
save('visual-final.json',rows);const c=await b.newContext(),p=await c.newPage();const labStatus=await go(p,'/design-system#scaling-consistency');if(labStatus===404){rows.push({designLab:true,status:labStatus,expected:true});save('visual-final.json',rows);await b.close();console.log({count:rows.length,overflow:rows.filter(r=>r.overflow||r.custardOverflow||r.blockedOverflow),labStatus});return;}for(const width of [390,900,1440]){await p.setViewportSize({width,height:900});await p.locator('#scaling-consistency').scrollIntoViewIfNeeded();await p.screenshot({path:`${out}/design-lab-final-${width}.png`});rows.push({designLab:true,width,overflow:await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),headings:await p.locator('#scaling-consistency h1').allTextContents()})}
save('visual-final.json',rows);await b.close();console.log({count:rows.length,overflow:rows.filter(r=>r.overflow||r.custardOverflow||r.blockedOverflow)});
})().catch(e=>{console.error(e);process.exit(1)});
