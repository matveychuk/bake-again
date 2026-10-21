import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { brevoApi, isConfirmedSubscriber, type BrevoContact } from './brevo-api.ts';
import { deliveryStore, type DeliveryDatabase } from './delivery-store.ts';
import { createDeliveryService, parseRecipeRequest } from './delivery-service.ts';
import { recipeEmail } from './magnet-email.ts';
import { deliveryConfigured, readRecipeBody, requireRecipeOrigin, verifyRecipeChallenge } from './delivery-runtime.ts';

function fixture() {
  const db=new DatabaseSync(':memory:');
  db.exec(readFileSync(new URL('../../drizzle/0002_lead_magnet_delivery.sql',import.meta.url),'utf8'));
  const adapter:DeliveryDatabase={prepare(sql){let args:(string|number|null)[]=[];return {
    bind(...values){args=values;return this;},
    async first<T>(){return (db.prepare(sql).get(Object.fromEntries(args.map((v,i)=>[`?${i+1}`,v])))??null) as T|null;},
    async run(){return db.prepare(sql).run(Object.fromEntries(args.map((v,i)=>[`?${i+1}`,v])));},
  };}};
  let time=1_800_000_000;
  let contact:BrevoContact|null=null;
  const confirmations:{email:string;redirect:string}[]=[];
  const sends:{email:string;magnet:string;id:string}[]=[];
  let failSend=false;
  const service=createDeliveryService(deliveryStore(adapter),{
    async contact(){return contact;},
    async confirm(email,redirect){confirmations.push({email,redirect});},
    async deliver(email,magnet,id){sends.push({email,magnet,id});if(failSend)throw new Error('Uncertain response');},
  },()=>time);
  return {db,service,confirmations,sends,setContact:(v:BrevoContact|null)=>{contact=v;},advance:(v:number)=>{time+=v;},failSend:(v:boolean)=>{failSend=v;}};
}
const confirmed={listIds:[3,4],emailBlacklisted:false};
const email='reader@example.com';
const returnToken=(redirect:string)=>new URLSearchParams(new URL(redirect).hash.slice(1)).get('token')!;

test('new subscriber gets DOI only, then exactly one recipe email after native confirmation',async()=>{
  const f=fixture();await f.service.request(email,'mlyntsi','network');
  assert.equal(f.sends.length,0);assert.equal(f.confirmations.length,1);
  const token=returnToken(f.confirmations[0].redirect);
  await assert.rejects(f.service.confirm(token));assert.equal(f.sends.length,0);
  f.setContact(confirmed);
  assert.equal(await f.service.confirm(token),'mlyntsi');
  await f.service.confirm(token);await f.service.request(email,'mlyntsi','network');
  assert.equal(f.sends.length,1);assert.equal(f.confirmations.length,1);
  assert.equal(f.sends[0].magnet,'mlyntsi');
  const row=f.db.prepare('SELECT token_hash FROM lead_magnet_requests').get()!;
  assert.notEqual(row.token_hash,token);
});
test('confirmed subscriber gets either requested recipe immediately with no DOI',async()=>{
  const f=fixture();f.setContact(confirmed);
  await f.service.request(email,'shokolad','network');await f.service.request(email,'mlyntsi','network');
  assert.deepEqual(f.sends.map(s=>s.magnet),['shokolad','mlyntsi']);assert.equal(f.confirmations.length,0);
});
test('two pending magnets retain independent identities instead of overwriting the recipe',async()=>{
  const f=fixture();await f.service.request(email,'shokolad','network');await f.service.request(email,'mlyntsi','network');
  f.setContact(confirmed);
  await f.service.confirm(returnToken(f.confirmations[1].redirect));
  await f.service.confirm(returnToken(f.confirmations[0].redirect));
  assert.deepEqual(f.sends.map(s=>s.magnet),['mlyntsi','shokolad']);
});
test('blocked/unsubscribed contacts are not silently reactivated or sent transactional recipes',async()=>{
  for(const contact of [{listIds:[4],emailBlacklisted:true},{listIds:[4],emailBlacklisted:false,listUnsubscribed:[4]}]){
    const f=fixture();f.setContact(contact);await f.service.request(email,'mlyntsi','network');
    assert.equal(f.confirmations.length,0);assert.equal(f.sends.length,0);
  }
  assert.equal(isConfirmedSubscriber({listIds:[3],emailBlacklisted:false}),false);
  assert.equal(isConfirmedSubscriber({listIds:[4]}),false);
});
test('expired and forged return tokens cannot send a recipe',async()=>{
  const f=fixture();await f.service.request(email,'shokolad','network');f.setContact(confirmed);f.advance(86401);
  await assert.rejects(f.service.confirm(returnToken(f.confirmations[0].redirect)));
  await assert.rejects(f.service.confirm('0'.repeat(64)));assert.equal(f.sends.length,0);
});
test('parallel confirmations send once and fail-safe retry retains the provider idempotency key',async()=>{
  const f=fixture();await f.service.request(email,'mlyntsi','network');f.setContact(confirmed);
  const token=returnToken(f.confirmations[0].redirect);
  await Promise.allSettled([f.service.confirm(token),f.service.confirm(token)]);assert.equal(f.sends.length,1);
  const g=fixture();g.setContact(confirmed);g.failSend(true);
  await assert.rejects(g.service.request(email,'shokolad','network'));g.failSend(false);
  await g.service.request(email,'shokolad','network');
  assert.equal(g.sends.length,2);assert.equal(g.sends[0].id,g.sends[1].id);
});
test('D1 admission caps per-address, network and repeated-click requests',async()=>{
  const f=fixture();f.setContact(confirmed);
  for(let i=0;i<15;i++)await f.service.request(`reader${i}@example.com`,'mlyntsi','same-network');
  assert.equal(f.sends.length,10);
});
test('an uncertain send is never retried after the provider idempotency window',async()=>{
  const f=fixture();await f.service.request(email,'mlyntsi','network');f.setContact(confirmed);f.failSend(true);
  const token=returnToken(f.confirmations[0].redirect);
  await assert.rejects(f.service.confirm(token));f.advance(901);f.failSend(false);
  await assert.rejects(f.service.confirm(token));assert.equal(f.sends.length,1);
});
test('mlyntsi email contains both fixed PDF buttons, chocolate email only its own',()=>{
  const pancakes=recipeEmail('mlyntsi'),cake=recipeEmail('shokolad');
  assert.ok(pancakes.htmlContent.includes('Bake-Again-Bezghliutenovi-mlyntsi.pdf'));
  assert.ok(pancakes.htmlContent.includes('Bake-Again-Mlyntsi-kartka-yunoho-kukharia.pdf'));
  assert.ok(!pancakes.htmlContent.includes('shokoladnyi'));
  assert.ok(cake.htmlContent.includes('shokoladnyi'));assert.ok(!cake.htmlContent.includes('kartka'));
  assert.ok(!pancakes.htmlContent.includes('[['));
});
test('native DOI API includes suppression before list entry and opaque fragment redirect',async()=>{
  const calls:{url:string;body:Record<string,unknown>}[]=[];
  const api=brevoApi('test-secret',23,async(url,init)=>{
    calls.push({url:String(url),body:JSON.parse(String(init?.body))});return Response.json({messageId:'test'});
  });
  await api.confirm(email,'https://bakeagain.com/uk/recept-confirmed#token=opaque');
  assert.deepEqual(calls[0].body.attributes,{BA_LEAD_SIGNUP:true});assert.deepEqual(calls[0].body.includeListIds,[3,4]);
  await api.deliver(email,'mlyntsi','request-id');
  assert.deepEqual(calls[1].body.headers,{IdempotencyKey:'recipe-request-id'});
});
test('request validation, origin, bounded bodies and Turnstile fail closed',async()=>{
  assert.deepEqual(parseRecipeRequest({email:' Reader@Example.com ',magnet:'mlyntsi',token:'token',consent:true}),{email,magnet:'mlyntsi',token:'token'});
  for(const body of [{email,magnet:'other',token:'x',consent:true},{email,magnet:'mlyntsi',token:'x',consent:false},{email,magnet:'mlyntsi',token:'x',consent:true,website:'bot'}])assert.throws(()=>parseRecipeRequest(body));
  assert.throws(()=>requireRecipeOrigin(new Request('https://bakeagain.com/api/newsletter/recipe',{method:'POST',headers:{origin:'https://evil.example','content-type':'application/json'}})));
  await assert.rejects(readRecipeBody(new Request('https://bakeagain.com',{method:'POST',body:'x'.repeat(8193)})));
  assert.equal(deliveryConfigured({}),false);
  const req=new Request('https://bakeagain.com',{headers:{'cf-connecting-ip':'192.0.2.1'}});
  const bindings={TURNSTILE_SECRET_KEY:'secret',ASSISTANT_SESSION_SECRET:'private'};
  await assert.rejects(verifyRecipeChallenge(req,'token',bindings,async()=>Response.json({success:true,hostname:'bakeagain.com',action:'bake_assistant'})));
  const network=await verifyRecipeChallenge(req,'token',bindings,async()=>Response.json({success:true,hostname:'bakeagain.com',action:'recipe_request'}));
  assert.equal(network.length,64);assert.ok(!network.includes('192.0.2.1'));
});
