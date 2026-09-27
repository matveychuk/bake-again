const {chromium,save}=require('./browser-common.cjs');
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true}),p=await b.newPage();const r=await p.goto('http://localhost:3000/design-system');save('lab-inspect.json',{status:r.status(),url:p.url(),text:await p.locator('body').innerText()});await b.close()})();
