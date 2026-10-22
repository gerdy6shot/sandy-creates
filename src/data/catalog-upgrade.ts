import type { DemoState } from '../lib/models.ts';
import { demoProducts } from './demo.ts';
/** Replace the retired starter catalog while preserving unrelated local studio edits. */
export function upgradeCatalog(saved:DemoState):DemoState {
 if(saved.catalogVersion===2)return saved;
 const replacedIds=new Set(['p1','p2','p3','p4',...demoProducts.map(p=>p.id)]);
 return {...saved,catalogVersion:2,products:[...structuredClone(demoProducts),...saved.products.filter(p=>!replacedIds.has(p.id))]};
}
