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
const artwork = '/images/editorial/home-design-reference.png';
const productArtwork: Record<string, string> = {
  sofridobo: '236 695 191 207',
  'yardie-glaze': '444 693 190 209',
  'sol-shine': '653 693 190 209',
};

function Artwork({ className, crop, label, mask }: {
  className?: string;
  crop: string;
  label: string;
  mask?: 'hero' | 'culinary';
}) {
  return <svg className={className} viewBox={crop} preserveAspectRatio="xMidYMid slice" role="img" aria-label={label}>
    {mask && <defs>
      <filter id={`sc-${mask}-feather`} x="-10%" y="-20%" width="120%" height="140%">
        <feGaussianBlur stdDeviation={mask === 'hero' ? 3 : 6}/>
      </filter>
      <mask id={`sc-${mask}-art-mask`} maskUnits="userSpaceOnUse" x="0" y="0" width="1086" height="1448">
        <rect width="1086" height="1448" fill="white"/>
        <g fill="black" filter={`url(#sc-${mask}-feather)`}>
          {mask === 'hero' ? <>
            <path d="M0 0h1086v63H648V31H464v32H0z"/>
            <rect x="47" y="269" width="305" height="173" rx="5"/>
            <rect x="833" y="286" width="200" height="84" rx="5"/>
          </> : <rect x="65" y="1101" width="310" height="217" rx="12"/>}
        </g>
      </mask>
    </defs>}
    <image href={artwork} width="1086" height="1448" mask={mask && `url(#sc-${mask}-art-mask)`}/>
  </svg>;
}
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
      <Artwork className="sc-home-hero-art" crop="0 35 1086 529" mask="hero"
        label="CREATES lettering behind Sandy in her chef’s jacket, with a plated dish and Spice Gurl products"/>
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
          <Artwork crop="56 574 159 62" label="Spice Gurl"/>
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
                {productArtwork[product.slug] && product.image === `/images/products/${product.slug}.jpg`
                  ? <Artwork className="sc-home-product-art" crop={productArtwork[product.slug]} label={product.name}/>
                  : <ProductArt product={product}/>}
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
              <Artwork className="sc-home-product-art" crop="860 693 190 209"
                label="Mo’Betta Mojo bottle shown in the Spice Gurl collection artwork"/>
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
      <Artwork className="sc-home-culinary-art" crop="0 1087 1086 250" mask="culinary"
        label="Grilled shrimp on a dark plate with herbs and charred citrus"/>
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
