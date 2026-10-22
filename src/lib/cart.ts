import type { CartLine, Product } from './models.ts';
export function money(minor:number,currency='USD') { return new Intl.NumberFormat('en-US',{style:'currency',currency}).format(minor/100); }
export function findVariant(products:Product[],id:string) { for(const product of products){const variant=product.variants.find(v=>v.id===id);if(variant)return {product,variant};} }
export function normalizeCart(raw:unknown,products:Product[]):CartLine[] {
 if(!Array.isArray(raw)) return [];
 const totals=new Map<string,number>();
 for(const item of raw){if(!item||typeof item.variantId!=='string'||!Number.isSafeInteger(item.quantity)||item.quantity<1)continue;const found=findVariant(products,item.variantId);if(!found||!found.product.published||found.product.pricePending||found.variant.price<=0||found.variant.inventory<1)continue;totals.set(item.variantId,Math.min(99,found.variant.inventory,(totals.get(item.variantId)??0)+item.quantity));}
 return [...totals].map(([variantId,quantity])=>({variantId,quantity}));
}
export function cartTotal(cart:CartLine[],products:Product[]) {return normalizeCart(cart,products).reduce((sum,line)=>sum+(findVariant(products,line.variantId)?.variant.price??0)*line.quantity,0);}
export function changeQuantity(cart:CartLine[],id:string,quantity:number,products:Product[]) {return normalizeCart([...cart.filter(l=>l.variantId!==id),{variantId:id,quantity}],products);}
