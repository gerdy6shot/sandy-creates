import test from 'node:test';
import assert from 'node:assert/strict';
import { createPreorderDraft } from '../src/lib/preorder-request.ts';

test('preorder email uses published prices, quantities and an explicitly estimated subtotal', () => {
 const draft=createPreorderDraft([{slug:'sofridobo',quantity:2},{slug:'sol-shine',quantity:1}]);
 assert.equal(draft.subtotal,3400);assert.match(draft.body,/SofriDOBO × 2 — \$24.00/);assert.match(draft.body,/Sol Shine × 1 — \$10.00/);assert.match(draft.body,/Estimated product subtotal: \$34.00 USD/);assert.match(draft.body,/not a confirmed order/);assert.match(draft.body,/No payment has been made/);
 const params=new URLSearchParams({subject:draft.subject,body:draft.body});assert.equal(new URLSearchParams(params.toString()).get('body'),draft.body);
});
test('email draft rejects empty, unknown, duplicate and invalid quantities', () => {
 for(const lines of [[],[{slug:'unknown',quantity:1}],[{slug:'constructor',quantity:1}],[{slug:'sol-shine',quantity:1},{slug:'sol-shine',quantity:1}],...[0,-1,1.2,100,NaN].map(quantity=>[{slug:'yardie-glaze',quantity}])])assert.throws(()=>createPreorderDraft(lines));
});
