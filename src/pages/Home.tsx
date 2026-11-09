import { ArrowRight, Heart, Leaf, Palmtree, Soup } from 'lucide-react';
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
  { label: 'Marinades' },
  { label: 'Herb blends' },
  { label: 'Cooking essentials' },
  { label: 'Gift sets' },
];
const features = [
  { icon: Leaf, title: 'Bold flavor', description: 'Seasonings, sauces and glazes.' },
  { icon: Soup, title: 'Chef-crafted', description: 'From Sandy’s culinary world.' },
  { icon: Palmtree, title: 'Caribbean roots', description: 'Heritage flavors, modern style.' },
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
      <div className="sc-home-hero-visual">
        <span className="sc-home-creates" aria-hidden="true">CREATES</span>
        <img className="sc-home-hero-person" src="/images/editorial/sandy-portrait-green.jpg"
          alt="Original portrait of Sandy wearing a burgundy sweater and holding a green drink" fetchPriority="high"/>
        <img className="sc-home-hero-collection" src="/images/editorial/spicegurl-collection.jpg"
          alt="Original photograph of the Spice Gurl bottled sauces, seasoning jars, and prepared food" fetchPriority="high"/>
        <img className="sc-home-hero-food" src="/images/editorial/sandy-food-wings.jpg"
          alt="Sandy’s glossy glazed chicken wings" loading="lazy"/>
      </div>
      <div className="sc-home-hero-copy">
        <h1>{title.split('\n').map((line, index) => <span key={index}>{line}</span>)}</h1>
        <p>{intro}</p>
        <div className="sc-home-actions">
          <ButtonLink to="/culinary">Explore culinary</ButtonLink>
          <Link className="button secondary" to={collection}>Shop Spice Gurl</Link>
        </div>
      </div>
      <Link className="sc-home-hero-signature" to="/about" aria-label="Meet Sandy">
        <span>Founder <b>/</b> Chef <b>/</b> Creator</span>
        <span className="sc-script">Sandy</span>
      </Link>
    </section>

    <section className="sc-home-shop" id="spice-collection" aria-labelledby="sc-featured">
      <div className="sc-home-collection">
        <Link className="sc-home-spice-logo" to="/spice-gurl" aria-label="Spice Gurl">
          <span className="sc-home-spice-logo-type">SPICE<br/>GURL</span>
        </Link>
        <div className="sc-home-collection-copy">
          <p>The Signature Spice Collection</p>
          <span>Seasonings, sauces, and culinary essentials inspired by Caribbean roots and global flavor.</span>
        </div>
        <ButtonLink to={collection} secondary>Shop all products</ButtonLink>
      </div>
      <nav className="sc-home-tabs" aria-label="Browse Spice Gurl products">
        {productTabs.map(tab => tab.to
          ? <Link key={tab.label} to={tab.to}>{tab.label}</Link>
          : <span key={tab.label} title="No published products in this category">
              {tab.label}<span className="sr-only">, unavailable</span>
            </span>)}
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
              <Link to={detail} aria-label={`Explore ${product.name}`}>
                <ProductArt product={product}/>
              </Link>
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
              <img className="sc-home-product-art sc-home-product-collection-img"
                src="/images/editorial/spicegurl-collection.jpg"
                alt="Original Spice Gurl collection photograph, including the Mo’Betta Mojo bottle" loading="lazy"/>
            </Link>
            <div className="sc-home-product-copy">
              <h3><Link to={collection}>Mo’Betta Mojo</Link></h3>
              <p>Collection spotlight.</p>
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
      <img className="sc-home-culinary-art" src="/images/editorial/sandy-plated-food.jpg"
        alt="Sandy’s original food photograph: rice, seasoned meat, and sautéed peppers on a white plate" loading="lazy"/>
      <div className="sc-home-culinary-copy">
        <p className="eyebrow">Culinary lifestyle</p>
        <h2 id="sc-culinary-heading">Recipes. Culture.<br/>Lifestyle.</h2>
        <p>Culinary ideas and stories that celebrate food, people, and the power of flavor.</p>
        <ButtonLink to="/culinary">Explore the culinary hub</ButtonLink>
      </div>
    </section>

    <section className="sc-home-follow" aria-labelledby="sc-follow-heading">
      <span className="sc-script" aria-hidden="true">San D Creates</span>
      <div><h2 id="sc-follow-heading">Stay in the Kitchen with Me</h2>
        <p>Find new recipes, product updates, and more from Sandy.</p></div>
      <div className="sc-home-follow-actions">
        <span className="sc-home-signup-status">Email signup not yet open</span>
        <a className="button" href="https://www.instagram.com/san.d.creates/" target="_blank" rel="noreferrer">
          Follow on Instagram <ArrowRight size={15} aria-hidden="true"/>
        </a>
      </div>
    </section>

    <SpiceGurlReactions/>
  </div>;
}
