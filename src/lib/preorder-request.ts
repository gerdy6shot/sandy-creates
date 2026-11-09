import { preorderCatalog } from '../data/preorders.ts';

const names: Record<string, string> = { sofridobo: 'SofriDOBO', 'sol-shine': 'Sol Shine', 'yardie-glaze': 'Yardie Glaze' };
const usd = (cents: number) => `$${(cents / 100).toFixed(2)}`;

export function createPreorderDraft(selection: { slug: string; quantity: number }[]) {
  if (!selection.length || selection.length > 3) throw new Error('Choose one to three products');
  const seen = new Set<string>();
  let subtotal = 0;
  const lines = selection.map(({ slug, quantity }) => {
    if (!Object.hasOwn(preorderCatalog, slug) || seen.has(slug) || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) throw new Error('Invalid selection');
    seen.add(slug);
    const amount = preorderCatalog[slug].price * quantity;
    subtotal += amount;
    return `${names[slug]} × ${quantity} — ${usd(amount)} (${usd(preorderCatalog[slug].price)} each)`;
  });
  const subject = 'Spice Gurl preorder request';
  const body = ['Hello Sandy,', '', 'I’d like to preorder:', ...lines, '', `Estimated product subtotal: ${usd(subtotal)} USD.`, 'Based on the published product prices; taxes and fulfillment costs are not included.', '', 'Please confirm the product sizes, final price, availability, expected fulfillment date, and pickup or shipping options.', '', 'I understand this email is a preorder request, not a confirmed order or stock reservation. No payment has been made.', '', 'My name:', 'Pickup/shipping preference or other notes:'].join('\n');
  return { subject, body, subtotal };
}


/** Produce an email-only request from prices loaded from the real catalog. */
export function createLivePreorderDraft(selection: {name:string;price:number;quantity:number}[]) {
 if (!selection.length || selection.length>20) throw new Error('Choose one to twenty products');
 let subtotal=0;
 const lines=selection.map(item=>{
  if(!item.name.trim()||!Number.isSafeInteger(item.price)||item.price<=0||!Number.isInteger(item.quantity)||item.quantity<1||item.quantity>99)throw new Error('Invalid product selection');
  const amount=item.price*item.quantity;subtotal+=amount;
  return `${item.name} × ${item.quantity} — ${usd(amount)} (${usd(item.price)} each)`;
 });
 return {
  subject:'Spice Gurl preorder request',
  body:['Hello Sandy,','','I’d like to preorder:',...lines,'',`Estimated product subtotal: ${usd(subtotal)} USD.`,'Based on the current published product prices; taxes and fulfillment costs are not included.','','Please confirm product sizes, final prices, availability, and fulfillment details.','','This is an email inquiry, not a confirmed order or stock reservation. No payment has been made.','','My name:','Other notes:'].join('\\n'),
  subtotal,
 };
}
