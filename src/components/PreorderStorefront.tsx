import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Check, Mail, Minus, Plus, ShoppingBag } from 'lucide-react';
import type { Product } from '../lib/models';
import { money } from '../lib/cart';
import { ProductArt } from './Shared';
import { preorderCatalog } from '../data/preorders';
import { createPreorderDraft } from '../lib/preorder-request';
import { sandyBusinessCard } from '../data/business-card';
import './PreorderStorefront.css';

export default function PreorderStorefront({ products }: { products: Product[] }) {
  const [category, setCategory] = useState('All');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [reviewing, setReviewing] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');
  const collection = products.filter(p => preorderCatalog[p.slug]);
  const selected = collection.filter(p => quantities[p.id] > 0);
  const count = selected.reduce((sum, p) => sum + quantities[p.id], 0);
  const subtotal = selected.reduce((sum, p) => sum + preorderCatalog[p.slug].price * quantities[p.id], 0);
  const draft = selected.length ? createPreorderDraft(selected.map(p => ({ slug: p.slug, quantity: quantities[p.id] }))) : null;
  const email = sandyBusinessCard.links.find(link => link.kind === 'email')!.href;
  const mailto = draft ? `${email}?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}` : email;
  async function copyRequest() {
    if (!draft) return;
    try { await navigator.clipboard.writeText(draft.body); setCopyStatus('Request copied.'); }
    catch { setCopyStatus('Could not copy automatically. Select the draft text and copy it.'); }
  }
  const visible = collection.filter(p => category === 'All' || p.category === category);
  function update(id: string, quantity: number) {
    setQuantities(current => ({ ...current, [id]: Math.max(0, Math.min(99, quantity)) }));
    setReviewing(false);
    setCopyStatus('');
  }
  return (
    <section className="section shop-section preorder-storefront" id="preorder-storefront" aria-labelledby="preorder-title">
      <div className="section-heading">
        <div><p className="eyebrow">THE SPICE GURL COLLECTION</p><h2 id="preorder-title">Your next<br /><i>flavor obsession.</i></h2></div>
        <p className="preorder-intro">Three ways to bring a little more flavor to the table. Explore the collection and choose your favorites.</p>
      </div>
      <div className="preorder-note"><span className="eyebrow">PREORDER BY EMAIL</span><p>Choose your favorites and email your preorder request to Sandy. She’ll confirm sizes, availability, the final price and fulfillment details. No payment or stock reservation is made on this website.</p></div>
      {count > 0 && <a className="preorder-mobile-summary" href="#preorder-summary-title"><ShoppingBag size={16} aria-hidden="true" />{count} {count === 1 ? 'item' : 'items'} · {money(subtotal)} <span>View preorder ↓</span></a>}
      <div className="preorder-layout">
        <div>
          <div className="filter-bar" aria-label="Filter products">{['All', 'Blends', 'Sauces'].map(value => <button key={value} aria-pressed={category === value} className={category === value ? 'selected' : ''} onClick={() => setCategory(value)}>{value}</button>)}</div>
          <div className="preorder-products">
            {visible.map(product => {
              const quantity = quantities[product.id] ?? 0;
              const offer = preorderCatalog[product.slug];
              return <article className={`preorder-product ${quantity ? 'is-selected' : ''}`} key={product.id}>
                <Link to={`/spice-gurl/products/${product.slug}`} aria-label={`View ${product.name}`}><ProductArt product={product} /></Link>
                <div className="preorder-product-copy">
                  <div className="preorder-product-meta"><span className="eyebrow">{product.category}</span><span>{quantity ? <><Check size={12} aria-hidden="true" /> Selected</> : 'Email preorder'}</span></div>
                  <Link to={`/spice-gurl/products/${product.slug}`} className="product-title"><h3>{product.name}</h3><ArrowUpRight size={18} aria-hidden="true" /></Link>
                  <p>{product.short}</p><p className="preorder-price"><strong>{money(offer.price)}</strong> <span>USD · {offer.size ?? 'size to be confirmed'}</span></p>
                  {quantity ? <div className="preorder-quantity"><button aria-label={`Decrease ${product.name} quantity`} onClick={() => update(product.id, quantity - 1)}><Minus size={15} aria-hidden="true" /></button><output aria-label={`${product.name} quantity`}>{quantity}</output><button aria-label={`Increase ${product.name} quantity`} disabled={quantity >= 99} onClick={() => update(product.id, quantity + 1)}><Plus size={15} aria-hidden="true" /></button><button className="preorder-remove" onClick={() => update(product.id, 0)}>Remove</button></div> : <button className="button preorder-add" onClick={() => update(product.id, 1)}>Add to preorder <Plus size={16} aria-hidden="true" /></button>}
                </div>
              </article>;
            })}
          </div>
          {!visible.length && <p>No products are currently shown in this category.</p>}
          <p className="caption preorder-photo-note">Original photographs supplied for Sandy Creates. Prices from <a href="https://www.spicegurl.store/" target="_blank" rel="noopener noreferrer">Spice Gurl’s product listing</a>. Final preorder details are confirmed by Sandy.</p>
        </div>
        <aside className={`preorder-summary ${reviewing ? 'is-reviewing' : ''}`} aria-labelledby="preorder-summary-title">
          <ShoppingBag size={22} strokeWidth={1.4} aria-hidden="true" /><p className="eyebrow">A LITTLE COLLECTION OF FLAVOR</p><h3 id="preorder-summary-title">Your<br /><i>preorder.</i></h3>
          <p className="preorder-selection-count" role="status">{count ? `${count} ${count === 1 ? 'item' : 'items'} selected` : 'Choose your favorites to get started.'}</p>
          {selected.length > 0 && <ul className="preorder-lines">{selected.map(p => <li key={p.id}><span>{p.name} × {quantities[p.id]}</span><span>{money(preorderCatalog[p.slug].price * quantities[p.id])}</span></li>)}</ul>}
          <div className="preorder-total"><span>Estimated subtotal</span><strong>{money(subtotal)}</strong></div>
          <p className="small-copy">USD. Taxes and fulfillment costs are not included. Sandy will confirm your final total.</p>
          <button className="button" disabled={!count} onClick={() => setReviewing(true)}>Review email request <ArrowUpRight size={16} aria-hidden="true" /></button>
          {reviewing && draft && <div className="preorder-review">
            <h4>Your email draft</h4>
            <p className="small-copy">Review your request below, then open your email app to add your name and send it. Nothing has been sent by this website.</p>
            <textarea aria-label="Preorder email draft" readOnly value={draft.body} rows={12} />
            <a className="button" href={mailto}>Open email draft <Mail size={16} aria-hidden="true" /></a>
            <button className="preorder-copy" onClick={copyRequest}>Copy request</button><p role="status" className="small-copy">{copyStatus}</p>
            <p className="small-copy">No email app? Copy the request and send it to <a href={email}>info@spicegurl.store</a>.</p>
          </div>}
          <p className="caption">Emailing a request does not confirm an order. No payment is collected here. Your selections last for this visit only and are separate from the demo bag.</p>
        </aside>
      </div>
      <div className="preorder-steps"><div><span className="eyebrow">01 / CHOOSE</span><h3>Find your flavor.</h3><p>Pick your products and quantities.</p></div><div><span className="eyebrow">02 / REVIEW</span><h3>Make it your own.</h3><p>Review your selection and estimated product subtotal.</p></div><div><span className="eyebrow">03 / CONNECT</span><h3>Send it to Sandy.</h3><p>Send your email request. Sandy confirms the details with you before accepting an order.</p></div></div>
    </section>
  );
}
