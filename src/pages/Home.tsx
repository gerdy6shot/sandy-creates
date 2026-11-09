import { ArrowRight, BookOpen, Flame, Heart, Leaf, Soup } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ButtonLink, ProductArt } from '../components/Shared';
import SpiceGurlReactions from '../components/SpiceGurlReactions';
import { initialDemo } from '../data/demo';
import { preorderCatalog } from '../data/preorders';
import { money } from '../lib/cart';
import { useStore } from '../lib/store';

const collection = '/spice-gurl#preorder-storefront';
const featuredOrder = ['sofridobo', 'yardie-glaze', 'sol-shine'];
const productTabs = [
  { label: 'All products', to: collection },
  { label: 'Seasonings', to: '/spice-gurl?category=Blends#preorder-storefront' },
  { label: 'Sauces & glazes', to: '/spice-gurl?category=Sauces#preorder-storefront' },
];
const features = [
  { icon: Leaf, title: 'Bold flavor', description: 'Seasonings, sauces and glazes.' },
  { icon: Soup, title: 'Chef-crafted', description: 'From Sandy’s culinary world.' },
  { icon: Flame, title: 'Caribbean roots', description: 'Heritage flavors, modern style.' },
  { icon: Heart, title: 'Everyday versatility', description: 'From weeknight meals to gatherings.' },
];

export default function Home() {
  const { data } = useStore();
  const title = data.content.heroTitle === 'Made with intention.\nShared with love.'
    ? initialDemo.content.heroTitle
    : data.content.heroTitle;
  const intro = data.content.heroIntro === 'Welcome to Sandy Creates—a home for Spice Gurl, culinary experiences, and everything I’m building next.'
    ? initialDemo.content.heroIntro
    : data.content.heroIntro;
  const featured = data.products.filter(product => product.published && product.featured)
    .slice(0, 3)
    .sort((a, b) => featuredOrder.indexOf(a.slug) - featuredOrder.indexOf(b.slug));

  return <div className="sc-home">
    <section className="sc-home-hero" id="welcome">
      <svg className="sc-home-creates" viewBox="0 0 1060 220" aria-hidden="true">
        <text x="0" y="208" textLength="1060" lengthAdjust="spacingAndGlyphs">CREATES</text>
      </svg>
      <img className="sc-home-portrait" src="/images/editorial/sandy-portrait-green.jpg"
        alt="Sandy, the creator behind Sandy Creates" width="1206" height="1605" fetchPriority="high"/>
      <img className="sc-home-hero-collection" src="/images/editorial/spicegurl-collection.jpg"
        alt="Spice Gurl seasonings and sauces alongside a platter of small bites" width="1206" height="1051"/>
      <img className="sc-home-hero-dish" src="/images/editorial/sandy-food-wings.jpg"
        alt="Glazed chicken wings from Sandy’s kitchen" width="768" height="1024"/>
      <div className="sc-home-hero-copy">
        <h1>{title.split('\n').map((line, index) => <span key={index}>{line}</span>)}</h1>
        <p>{intro}</p>
        <div className="sc-home-actions">
          <ButtonLink to="/culinary">Explore culinary</ButtonLink>
          <ButtonLink to={collection} secondary>Shop Spice Gurl</ButtonLink>
        </div>
      </div>
      <Link className="sc-home-hero-signature" to="/about" aria-label="Meet Sandy">
        <span>Founder <b>/</b> Chef <b>/</b> Creator</span>
        <span className="sc-script">Sandy</span>
      </Link>
    </section>

    <section className="sc-home-shop" id="spice-collection" aria-labelledby="sc-featured">
      <div className="sc-home-collection">
        <Link className="sc-home-spice-logo" to="/spice-gurl"><Soup aria-hidden="true"/><span>Spice<br/>Gurl</span></Link>
        <div className="sc-home-collection-copy">
          <p>The Signature Spice Collection</p>
          <span>Seasonings, sauces, and culinary essentials inspired by Caribbean roots and global flavor.</span>
        </div>
        <ButtonLink to={collection} secondary>Shop all products</ButtonLink>
      </div>
      <nav className="sc-home-tabs" aria-label="Browse Spice Gurl products">
        {productTabs.map(tab => <Link key={tab.label} to={tab.to}>{tab.label}</Link>)}
      </nav>
      <div className="sc-home-featured">
        <div className="sc-home-featured-intro">
          <h2 id="sc-featured">Featured <br/>Products</h2>
          <p>Discover Spice Gurl favorites for bold, everyday flavor.</p>
        </div>
        <div className="sc-home-products">
          {featured.map(product => {
            const preorder = preorderCatalog[product.slug];
            const detail = `/spice-gurl/products/${product.slug}`;
            return <article className="sc-home-product" key={product.id}>
              <Link to={detail} aria-label={`Explore ${product.name}`}><ProductArt product={product}/></Link>
              <div className="sc-home-product-copy">
                <h3><Link to={detail}>{product.name}</Link></h3>
                <p>{product.short}</p>
                {preorder && <strong>{money(preorder.price)}</strong>}
                <Link className="button" to={preorder ? collection : detail}>
                  {preorder ? 'Preorder' : 'View product'}
                  <span className="sr-only"> {product.name}</span>
                </Link>
              </div>
            </article>;
          })}
          <article className="sc-home-product sc-home-product--collection">
            <Link to={collection} aria-label="Explore the full Spice Gurl collection">
              <img src="/images/editorial/spicegurl-collection.jpg" alt="Spice Gurl products with a platter of small bites"
                width="1206" height="1051" loading="lazy"/>
            </Link>
            <div className="sc-home-product-copy">
              <h3><Link to={collection}>Spice Gurl Collection</Link></h3>
              <p>Explore the full preorder menu.</p>
              <Link className="button" to={collection}>Shop collection</Link>
            </div>
          </article>
        </div>
      </div>
    </section>

    <ul className="sc-home-features" aria-label="The Spice Gurl approach">
      {features.map(({ icon: Icon, title, description }) => <li key={title}>
        <Icon aria-hidden="true"/><div><strong>{title}</strong><p>{description}</p></div>
      </li>)}
    </ul>

    <section className="sc-home-culinary" aria-labelledby="sc-culinary-heading">
      <img className="sc-home-culinary-image" src="/images/editorial/sandy-plated-food.jpg"
        alt="Sandy’s plated dish with rice, beef and peppers" width="768" height="1024" loading="lazy"/>
      <div className="sc-home-culinary-copy">
        <p className="eyebrow">Culinary lifestyle</p>
        <h2 id="sc-culinary-heading">Recipes. Culture.<br/>Lifestyle.</h2>
        <p>Culinary ideas and stories that celebrate food, people, and the power of flavor.</p>
        <ButtonLink to="/culinary"><BookOpen size={14} aria-hidden="true"/>Explore the culinary hub</ButtonLink>
      </div>
    </section>

    <SpiceGurlReactions/>

    <section className="sc-home-follow" aria-labelledby="sc-follow-heading">
      <span className="sc-script" aria-hidden="true">Sandy Creates</span>
      <div><h2 id="sc-follow-heading">Stay in the Kitchen with Me</h2>
        <p>Find new recipes, product updates, and more from Sandy.</p></div>
      <a className="button" href="https://www.instagram.com/san.d.creates/" target="_blank" rel="noreferrer">
        Follow on Instagram <ArrowRight size={15} aria-hidden="true"/>
      </a>
    </section>
  </div>;
}
