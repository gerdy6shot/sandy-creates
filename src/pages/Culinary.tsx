import { useParams, Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { culinary } from '../data/demo';
import { pieAccomplishment as pie } from '../data/accomplishments';
import { useStore } from '../lib/store';
import { Breadcrumb, ButtonLink, Empty, Notice, Photo, TextLink } from '../components/Shared';
import './Culinary.css';

const foodAlt: Record<string, string> = {
  'the-gathering-platter': 'Close-up of glazed chicken wings from Sandy’s kitchen.',
  'small-bites': 'Spice Gurl seasonings, sauces and prepared bites arranged together.',
  'something-seasonal': 'Rice, seasoned meat and colorful peppers plated by Sandy.',
};

export function Culinary() {
  const { data } = useStore();

  return <div className="sc-culinary-page">
    <section className="sc-culinary-hero" aria-labelledby="sc-culinary-title">
      <div className="sc-culinary-hero__copy">
        <p className="eyebrow">FROM SANDY’S KITCHEN</p>
        <h1 id="sc-culinary-title">Made for<br/><i>the gathering.</i></h1>
        <p className="sc-culinary-hero__lead">Savory plates, something sweet, and a table with room for good company.</p>
        <nav className="sc-culinary-hero__links" aria-label="Explore Sandy's culinary work">
          <a href="#culinary-food">Explore the food <ArrowUpRight size={17} aria-hidden="true"/></a>
          <a href="#pie-ribbon">Discover the dessert <ArrowUpRight size={17} aria-hidden="true"/></a>
        </nav>
      </div>
      <div className="sc-culinary-hero__visual" aria-label="Sandy's savory dishes and desserts">
        <figure className="sc-culinary-hero__savory">
          <img src="/images/editorial/sandy-plated-food.jpg"
            alt="Sandy's plate of rice, seasoned meat and sautéed peppers."
            width="1200" height="900" fetchPriority="high"/>
          <figcaption>SAVORY</figcaption>
        </figure>
        <figure className="sc-culinary-hero__sweet">
          <img src={pie.gallery[0].src} alt={pie.gallery[0].alt}
            width="1200" height="900" fetchPriority="high"/>
          <figcaption>SWEET</figcaption>
        </figure>
      </div>
    </section>

    <section className="sc-culinary-food" id="culinary-food" aria-labelledby="sc-culinary-food-heading">
      <div className="sc-culinary-section-head">
        <div>
          <p className="eyebrow">01 / THE SAVORY SIDE</p>
          <h2 id="sc-culinary-food-heading">Food worth <i>sharing.</i></h2>
        </div>
        <p>From generous platters to everyday favorites, explore the ideas coming out of Sandy’s kitchen.</p>
      </div>
      <div className="sc-culinary-food__grid">
        {culinary.map((item, index) => <article className="sc-culinary-food__item" key={item.slug}>
          <Link to={`/culinary/${item.slug}`} className="sc-culinary-food__photo" aria-label={`Explore ${item.name}`}>
            <img src={item.image} alt={foodAlt[item.slug] ?? item.name}
              width="1200" height="900" loading="lazy"/>
          </Link>
          <div className="sc-culinary-food__body">
            <p className="eyebrow">{String(index + 1).padStart(2, '0')} / {item.category}</p>
            <h3><Link to={`/culinary/${item.slug}`}>{item.name}</Link></h3>
            <p>{item.description}</p>
            <TextLink to={`/culinary/${item.slug}`}>Explore the idea</TextLink>
          </div>
        </article>)}
      </div>
      <p className="sc-culinary-food__availability">{data.settings.availabilityMessage} The dishes shown here are concepts, not an open menu.</p>
    </section>

    <section className="sc-culinary-sweet" id="pie-ribbon" aria-labelledby="sc-culinary-sweet-heading">
      <div className="sc-culinary-section-head sc-culinary-section-head--sweet">
        <div>
          <p className="eyebrow">02 / THE SWEET SIDE</p>
          <h2 id="sc-culinary-sweet-heading">And something <i>sweet.</i></h2>
        </div>
        <p>A pie from Sandy’s kitchen, and a ribbon worth remembering.</p>
      </div>

      <div className="sc-culinary-award">
        <figure className="sc-culinary-award__portrait">
          <img src={pie.portrait.src} alt={pie.portrait.alt} width="1206" height="2072" loading="lazy"/>
        </figure>
        <div className="sc-culinary-award__story">
          <p className="eyebrow">{pie.eyebrow}</p>
          <h3>{pie.title.split('\n').map((line, i) =>
            <span className={i ? 'sc-culinary-award__italic' : ''} key={line}>{line}</span>)}</h3>
          <p className="sc-culinary-award__recognition">{pie.recognition}</p>
          <p>{pie.description}</p>
          <p>{pie.story}</p>
          <p className="sc-culinary-award__source">Shared by Sandy on {pie.source.account}.</p>
        </div>
      </div>

      <div className="sc-culinary-desserts" aria-label="Photographs of Sandy's ribbon-winning pie">
        {pie.gallery.map(photo => <figure key={photo.src}>
          <img src={photo.src} alt={photo.alt} width="1206" height="1222" loading="lazy"/>
          <figcaption>{photo.caption}</figcaption>
        </figure>)}
      </div>
      <p className="sc-culinary-sweet__note">This pie is part of Sandy’s culinary story and is not currently offered for ordering.</p>
    </section>

    <section className="sc-culinary-inquiry" aria-labelledby="sc-culinary-inquiry-heading">
      <div>
        <p className="eyebrow">LET’S TALK ABOUT YOUR TABLE</p>
        <h2 id="sc-culinary-inquiry-heading">Something <i>more personal?</i></h2>
      </div>
      <div>
        <p>Have a gathering in mind? Share the idea with Sandy. Special orders and final details are confirmed directly, not through checkout.</p>
        <ButtonLink to="/contact?category=culinary">Explore a special order</ButtonLink>
      </div>
    </section>
  </div>;
}

export function CulinaryDetail() {
  const { slug } = useParams();
  const item = culinary.find(c => c.slug === slug);
  const { data } = useStore();
  if (!item) return <Empty title="This idea is still in the kitchen." to="/culinary" label="Explore culinary">We couldn’t find that offering.</Empty>;
  return <section className="section">
    <Breadcrumb items={[{ label: 'Culinary', to: '/culinary' }, { label: item.name }]}/>
    <div className="detail-grid">
      <Photo src={item.image} alt={foodAlt[item.slug] ?? `Original Sandy Creates culinary photograph for ${item.category.toLowerCase()}`} caption={false}/>
      <div className="product-info">
        <p className="eyebrow">SAMPLE MENU CONCEPT / {item.category}</p>
        <h1>{item.name}</h1><p>{item.description}</p>
        <Notice>{data.settings.availabilityMessage}</Notice>
        <dl className="detail-list">
          <div><dt>Menu &amp; price</dt><dd>To be confirmed</dd></div>
          <div><dt>Serving size</dt><dd>{item.servings}</dd></div>
          <div><dt>Pickup &amp; lead time</dt><dd>Operating rules awaiting approval</dd></div>
          <div><dt>Dietary information</dt><dd>{item.allergens}</dd></div>
        </dl>
        <p>No pickup windows or capacity are open for purchase. Delivery and shipping are not offered in this preview.</p>
        <ButtonLink to="/contact?category=culinary">Discuss your gathering</ButtonLink>
      </div>
    </div>
  </section>;
}
