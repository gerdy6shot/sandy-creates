import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Check, LockKeyhole, Minus, Plus, ShoppingBag } from 'lucide-react';
import type { Product } from '../lib/models';
import { money } from '../lib/cart';
import { ProductArt } from './Shared';
import { preorderCatalog } from '../data/preorders';
import './PreorderStorefront.css';

export default function PreorderStorefront({ products }: { products: Product[] }) {
  const [category, setCategory] = useState('All');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [reviewing, setReviewing] = useState(false);
  const collection = products.filter(p => preorderCatalog[p.slug]);
  const selected = collection.filter(p => quantities[p.id] > 0);
  const count = selected.reduce((sum, p) => sum + quantities[p.id], 0);
  const subtotal = selected.reduce((sum, p) => sum + preorderCatalog[p.slug].price * quantities[p.id], 0);
  const visible = collection.filter(p => category === 'All' || p.category === category);
  function update(id: string, quantity: number) {
    setQuantities(current => ({ ...current, [id]: Math.max(0, Math.min(99, quantity)) }));
    setReviewing(false);
  }
  return (
    <section className="section shop-section preorder-storefront" id="preorder-storefront" aria-labelledby="preorder-title">
      <div className="section-heading">
        <div><p className="eyebrow">THE SPICE GURL COLLECTION</p><h2 id="preorder-title">Your next<br /><i>flavor obsession.</i></h2></div>
        <p className="preorder-intro">Three ways to bring a little more flavor to the table. Explore the collection and choose your favorites.</p>
      </div>
      <div className="preorder-note"><span className="eyebrow">PREORDER PREVIEW</span><p>Explore the products at their published prices. Paid preorders will open once sizes, fulfillment dates and checkout are confirmed. No payment or stock reservation is made in this preview.</p></div>
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
                  <div className="preorder-product-meta"><span className="eyebrow">{product.category}</span><span>{quantity ? <><Check size={12} aria-hidden="true" /> Selected</> : 'Preorder preview'}</span></div>
                  <Link to={`/spice-gurl/products/${product.slug}`} className="product-title"><h3>{product.name}</h3><ArrowUpRight size={18} aria-hidden="true" /></Link>
                  <p>{product.short}</p><p className="preorder-price"><strong>{money(offer.price)}</strong> <span>USD · {offer.size ?? 'size to be confirmed'}</span></p>
                  {quantity ? <div className="preorder-quantity"><button aria-label={`Decrease ${product.name} quantity`} onClick={() => update(product.id, quantity - 1)}><Minus size={15} aria-hidden="true" /></button><output aria-label={`${product.name} quantity`}>{quantity}</output><button aria-label={`Increase ${product.name} quantity`} disabled={quantity >= 99} onClick={() => update(product.id, quantity + 1)}><Plus size={15} aria-hidden="true" /></button><button className="preorder-remove" onClick={() => update(product.id, 0)}>Remove</button></div> : <button className="button preorder-add" onClick={() => update(product.id, 1)}>Add to preorder <Plus size={16} aria-hidden="true" /></button>}
                </div>
              </article>;
            })}
          </div>
          {!visible.length && <p>No products are currently shown in this category.</p>}
          <p className="caption preorder-photo-note">Original photographs supplied for Sandy Creates. Prices from <a href="https://www.spicegurl.store/" target="_blank" rel="noopener noreferrer">Spice Gurl’s product listing</a>. Final preorder details are pending.</p>
        </div>
        <aside className={`preorder-summary ${reviewing ? 'is-reviewing' : ''}`} aria-labelledby="preorder-summary-title">
          <ShoppingBag size={22} strokeWidth={1.4} aria-hidden="true" /><p className="eyebrow">A LITTLE COLLECTION OF FLAVOR</p><h3 id="preorder-summary-title">Your<br /><i>preorder.</i></h3>
          <p className="preorder-selection-count" role="status">{count ? `${count} ${count === 1 ? 'item' : 'items'} selected` : 'Choose your favorites to get started.'}</p>
          {selected.length > 0 && <ul className="preorder-lines">{selected.map(p => <li key={p.id}><span>{p.name} × {quantities[p.id]}</span><span>{money(preorderCatalog[p.slug].price * quantities[p.id])}</span></li>)}</ul>}
          <div className="preorder-total"><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
          <p className="small-copy">USD. Taxes and fulfillment costs are not yet configured. This is not a final order total.</p>
          <button className="button" disabled={!count} onClick={() => setReviewing(true)}>Review preorder <ArrowUpRight size={16} aria-hidden="true" /></button>
          {reviewing && count > 0 && <div className="preorder-review">
            <h4>Before you pay</h4>
            <dl className="preorder-checkout-details"><div><dt>Product sizes</dt><dd>Awaiting confirmation</dd></div><div><dt>Pickup or shipping</dt><dd>Awaiting confirmation</dd></div><div><dt>Expected fulfillment</dt><dd>Date to be confirmed</dd></div></dl>
            <p className="small-copy">Payment is not available in this preview. Checkout will open after these details and the payment provider are configured.</p>
            <button className="button" disabled><LockKeyhole size={15} aria-hidden="true" />Payment setup pending</button>
          </div>}
          <p className="caption">No payment has been taken. Your selections are saved only for this visit and are separate from the demo bag.</p>
        </aside>
      </div>
      <div className="preorder-steps"><div><span className="eyebrow">01 / CHOOSE</span><h3>Find your flavor.</h3><p>Pick your products and quantities.</p></div><div><span className="eyebrow">02 / REVIEW</span><h3>Make it your own.</h3><p>Review your selection and published prices.</p></div><div><span className="eyebrow">03 / PAYMENT</span><h3>Good things ahead.</h3><p>Paid checkout opens once the final preorder and fulfillment details are ready.</p></div></div>
    </section>
  );
}
