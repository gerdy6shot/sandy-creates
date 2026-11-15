import PreorderStorefront from '../components/PreorderStorefront';
import { Link, useParams } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useStore } from '../lib/store';
import { money } from '../lib/cart';
import { Breadcrumb, Notice, ProductArt, ProductCard, TextLink, Empty } from '../components/Shared';

export function Shop() {
 const { data } = useStore();
 return <>
  <section className="shop-hero">
   <img className="sc-shop-stilllife" src="/images/editorial/spicegurl-collection.jpg" alt="Spice Gurl sauces, seasonings and prepared food" loading="eager" onError={e => {e.currentTarget.onerror = null; e.currentTarget.src = '/images/products/sofridobo.jpg';}}/>
   <p className="eyebrow">A FLAVORFUL CHAPTER OF SAN D CREATES</p>
   <div className="shop-hero-row">
    <h1>SPICE<br/><i>GURL.</i></h1>
    <div><p>For everyday cooking.<br/>For a little experimentation.<br/><i>For the love of flavor.</i></p>
    <a className="text-link" href="#preorder-storefront">Preorder by email <ArrowUpRight size={16}/></a></div>
   </div>
  </section>
  <PreorderStorefront products={data.products.filter(product => product.published)}/>
  <section className="section"><div className="wholesale-callout">
   <div><p className="eyebrow">LET’S GROW SOMETHING GOOD</p><h3>Interested in stocking Spice Gurl?</h3></div>
   <TextLink to="/contact?category=wholesale">Start a partnership conversation</TextLink>
  </div></section>
 </>;
}

export function ProductDetail() {
 const { slug } = useParams();
 const { data } = useStore();
 const product = data.products.find(p => p.slug === slug && p.published);
 if (!product) return <Empty title="This flavor isn’t here." to="/spice-gurl" label="Explore the collection">This product may have moved or isn’t published yet.</Empty>;
 const variant = product.variants[0];
 const hasPrice = !product.pricePending && variant?.price > 0;
 const preorderLink = `/spice-gurl?product=${encodeURIComponent(product.slug)}#preorder-storefront`;
 return <section className="section product-detail">
  <Breadcrumb items={[{label:'Home',to:'/'},{label:'Spice Gurl',to:'/spice-gurl'},{label:product.name}]}/>
  <div className="detail-grid">
   <div>
    <ProductArt product={product} large/>
    <p className="caption">{product.imageTreatment === 'supplied-product' ? 'Original Spice Gurl product photograph. Packaging shown as provided.' : 'Illustrative concept study · not official packaging.'}</p>
   </div>
   <div className="product-info">
    <p className="eyebrow">SPICE GURL / {product.category}</p>
    <h1>{product.name}</h1><p className="product-short">{product.short}</p>
    <p className="detail-price">{hasPrice ? <>{money(variant.price)} <span>USD · estimated product price</span></> : <>Price to be confirmed</>}</p>
    <Notice>Preorder by email. Sandy personally confirms availability, product sizes, fulfillment options and the final price. No online payment or inventory reservation.</Notice>
    {hasPrice
      ? <Link className="button" to={preorderLink}>Add to email preorder <ArrowUpRight size={16}/></Link>
      : <a className="button" href={`mailto:info@spicegurl.store?subject=${encodeURIComponent('Spice Gurl product inquiry: '+product.name)}`}>Ask Sandy about this product <ArrowUpRight size={16}/></a>
    }
    <p>{product.description}</p>
    {([['Ingredients',product.ingredients],['Allergen information',product.allergens],['Storage & care',product.storage],['Pickup & shipping','Pickup and shipping arrangements are confirmed directly by Sandy before an order is accepted.']] as const).map(([title,text])=><details key={title}><summary>{title}</summary><p>{text}</p></details>)}
   </div>
  </div>
  <div className="related-section">
   <p className="eyebrow">KEEP EXPLORING</p>
   <h2>A little more <i>inspiration.</i></h2>
   <div className="product-grid">{data.products.filter(p=>p.published && p.id!==product.id).slice(0,3).map(p=><ProductCard product={p} key={p.id}/>)}</div>
  </div>
 </section>;
}
