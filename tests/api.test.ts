import test from 'node:test';
import assert from 'node:assert/strict';
import { handleApi } from '../server/api.ts';
const origin='https://sandycreates.example';
test('unconfigured inquiry endpoint never claims a save',async()=>{const r=await handleApi(new Request(origin+'/api/inquiries',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:'{}'}),{APP_ORIGIN:origin});assert.equal(r.status,503);assert.equal((await r.json()).saved,false);});
test('cross-origin submission is rejected before processing',async()=>{const r=await handleApi(new Request(origin+'/api/inquiries',{method:'POST',headers:{Origin:'https://other.example'}}),{APP_ORIGIN:origin,LIVE_INQUIRIES:'true'});assert.equal(r.status,403);});
test('checkout cannot open simply by setting a browser or server flag',async()=>{const r=await handleApi(new Request(origin+'/api/checkout',{method:'POST',headers:{Origin:origin}}),{APP_ORIGIN:origin,LIVE_CHECKOUT:'true',RETAIL_OPERATIONS_APPROVED:'true'});assert.equal(r.status,503);});
test('unconfigured webhook is unavailable rather than acknowledged as paid',async()=>{const r=await handleApi(new Request(origin+'/api/stripe/webhook',{method:'POST',body:'{}'}),{});assert.equal(r.status,503);});
