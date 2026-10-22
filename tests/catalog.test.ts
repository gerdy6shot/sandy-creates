import test from 'node:test';
import assert from 'node:assert/strict';
import { upgradeCatalog } from '../src/data/catalog-upgrade.ts';
import { initialDemo } from '../src/data/demo.ts';
test('catalog update replaces retired concepts but preserves unrelated studio edits',()=>{
 const saved=structuredClone(initialDemo);delete saved.catalogVersion;saved.content.heroTitle='Custom owner draft';saved.products=[{...saved.products[0],id:'p1',name:'Retired concept'},{...saved.products[0],id:'custom-product',name:'Custom draft'}];
 const updated=upgradeCatalog(saved);assert.deepEqual(updated.products.slice(0,3).map(p=>p.name),['SofriDOBO','Sol Shine','Yardie Glaze']);assert.ok(updated.products.some(p=>p.id==='custom-product'));assert.equal(updated.content.heroTitle,'Custom owner draft');assert.equal(updated.catalogVersion,2);assert.equal(upgradeCatalog(updated),updated);
});
