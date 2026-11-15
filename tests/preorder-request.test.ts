import test from 'node:test';
import assert from 'node:assert/strict';
import { createPreorderDraft, createLivePreorderDraft } from '../src/lib/preorder-request.ts';

test('preorder email uses published prices, quantities and an explicitly estimated subtotal', () => {
 const draft=createPreorderDraft([{slug:'sofridobo',quantity:2},{slug:'sol-shine',quantity:1}]);
 assert.equal(draft.subtotal,3400);assert.match(draft.body,/SofriDOBO × 2 — \$24.00/);assert.match(draft.body,/Sol Shine × 1 — \$10.00/);assert.match(draft.body,/Estimated product subtotal: \$34.00 USD/);assert.match(draft.body,/not a confirmed order/);assert.match(draft.body,/No payment has been made/);
 const params=new URLSearchParams({subject:draft.subject,body:draft.body});assert.equal(new URLSearchParams(params.toString()).get('body'),draft.body);
});
test('email draft rejects empty, unknown, duplicate and invalid quantities', () => {
 for(const lines of [[],[{slug:'unknown',quantity:1}],[{slug:'constructor',quantity:1}],[{slug:'sol-shine',quantity:1},{slug:'sol-shine',quantity:1}],...[0,-1,1.2,100,NaN].map(quantity=>[{slug:'yardie-glaze',quantity}])])assert.throws(()=>createPreorderDraft(lines));
});

test('email preorder drafts use current owner-managed product prices and never imply checkout', () => {
 const request = createLivePreorderDraft([
  { name:'SofriDOBO', price:1200, quantity:2 },
  { name:'Sol Shine', price:1000, quantity:1 },
 ]);
 assert.equal(request.subtotal,3400);
 assert.match(request.body,/SofriDOBO × 2 — \$24\.00/);
 assert.match(request.body,/Estimated product subtotal: \$34\.00 USD/);
 assert.match(request.body,/not a confirmed order or stock reservation/);
 assert.match(request.body,/No payment has been made/);
 const composed = `mailto:info@spicegurl.store?subject=${encodeURIComponent(request.subject)}&body=${encodeURIComponent(request.body)}`;
 assert.equal(new URL(composed).protocol,'mailto:');
 assert.equal(new URL(composed).searchParams.get('body'),request.body);
});

test('live email preorder rejects invalid product prices and quantities', () => {
 for(const request of [
  [],
  [{name:'',price:1200,quantity:1}],
  [{name:'SofriDOBO',price:0,quantity:1}],
  [{name:'SofriDOBO',price:1200.5,quantity:1}],
  [{name:'SofriDOBO',price:1200,quantity:0}],
  [{name:'SofriDOBO',price:1200,quantity:100}],
 ]) assert.throws(()=>createLivePreorderDraft(request));
});
