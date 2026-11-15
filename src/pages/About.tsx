import { Link } from 'react-router-dom';
import SandyPortrait from '../components/SandyPortrait';
import { useStore } from '../lib/store';

export default function About() {
  const { data } = useStore();
  const gatherings = data.events.filter(event => event.published);

  return <div className="sc-about-page">
    <section className="sc-about-intro" aria-labelledby="sc-about-title">
      <div className="sc-about-photo"><SandyPortrait/></div>
      <div className="sc-about-content">
        <p className="eyebrow">ABOUT SANDY</p>
        <h1 id="sc-about-title">Hello,<br/><i>I’m Sandy.</i></h1>
        <p>Sandy is a creator, entrepreneur and culinary artist behind SAN D CREATES and Spice Gurl. Her work brings food, culture and creativity together.</p>
        <p>She holds a bachelor’s degree in Culinary Arts from Johnson &amp; Wales University, bringing that foundation to her work in the kitchen and beyond.</p>
        <div className="sc-about-links">
          <Link to="/spice-gurl">Explore Spice Gurl <span aria-hidden="true">↗</span></Link>
          <Link to="/culinary">Culinary work <span aria-hidden="true">↗</span></Link>
        </div>
        <p className="sc-about-recognition">Second place in her first Blue Ribbon Contest. <Link to="/culinary#pie-ribbon">See the story</Link></p>
      </div>
    </section>

    {gatherings.length > 0 && <section id="gatherings" className="sc-about-gatherings" aria-labelledby="sc-about-gatherings-heading">
      <p className="eyebrow">GATHERINGS / COLLABORATIONS</p>
      <h2 id="sc-about-gatherings-heading">Around the table.</h2>
      <div className="sc-about-event-grid">
        {gatherings.map(event => <article key={event.id} id={`gathering-${event.slug}`} className="sc-about-event">
          <p className="eyebrow">{event.status === 'past' ? 'PAST GATHERING' : 'UPCOMING'}</p>
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          {event.start && <p>{new Date(event.start).toLocaleDateString('en-US', {timeZone:event.timezone,year:'numeric',month:'long',day:'numeric'})}</p>}
        </article>)}
      </div>
    </section>}
  </div>;
}
