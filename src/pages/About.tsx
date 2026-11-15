import DigitalBusinessCard from '../components/DigitalBusinessCard';
import SandyPortrait from '../components/SandyPortrait';
import { sandyProfile } from '../data/profile';
import Accomplishment from '../components/Accomplishment';
import { PageIntro, Photo, TextLink } from '../components/Shared';
import { useStore } from '../lib/store';

export default function About(){
 const {data}=useStore();
 const events=data.events.filter(event=>event.published);
 const upcoming=events.filter(event=>event.status==='upcoming');
 const past=events.filter(event=>event.status==='past');
 return <>
  <PageIntro eyebrow="THE PERSON BEHIND THE POSSIBILITIES" title={<>Hello,<br/><i>I’m Sandy.</i></>}>
   <p>A creator, entrepreneur and culinary artist. Making room for food, culture, and whatever creativity brings next.</p>
  </PageIntro>
  <section className="section about-grid">
   <SandyPortrait/>
   <div className="body-copy">
    <p className="eyebrow">THE WORLD I’M BUILDING</p>
    <h2>More than<br/><i>one thing.</i></h2>
    <p>{data.content.story}</p>
    <p>{sandyProfile.aboutEducation}</p>
    <p>This space brings those interests together without limiting what comes next. Spice Gurl has its own place here, alongside culinary ideas and opportunities to gather.</p>
    <p className="signature">Sandy</p>
   </div>
  </section>
  <DigitalBusinessCard/>
  <Accomplishment compact/>
  <section className="section story-section">
   <p className="eyebrow">FOOD / CULTURE / CRAFT</p>
   <h2>A thoughtful approach.<br/><i>An open invitation.</i></h2>
   <div className="story-columns">
    <p>{data.content.philosophy}</p>
    <p>From a seasoning concept to a table full of possibilities, SAN D CREATES is a home for exploration. Her creativity, cultural perspective and culinary foundation come together here, with room for the next chapter of Spice Gurl and SAN D CREATES.</p>
   </div>
  </section>
  <section className="section about-grid">
   <Photo src="/images/craft.jpg" alt="Spices arranged in wooden spoons — stock process inspiration"/>
   <div className="body-copy">
    <p className="eyebrow">A FEATURED CHAPTER</p>
    <h2>Meet<br/><i>Spice Gurl.</i></h2>
    <p>A product brand within SAN D CREATES. A place for spice blends, sauces, condiments and collections, with its own mint-and-black identity.</p>
    <TextLink to="/spice-gurl">Explore Spice Gurl</TextLink>
   </div>
  </section>
  <section className="section story-section" id="gatherings" aria-labelledby="gatherings-title">
   <p className="eyebrow">GATHERINGS / COLLABORATIONS</p>
   <h2 id="gatherings-title">Good things happen<br/><i>together.</i></h2>
   <div className="story-columns">
    <p>Pop-ups, shared tables, and creative collaborations are part of Sandy’s world. This is where announced gatherings and their stories will live.</p>
    <div><p>Interested in creating something together?</p><TextLink to="/contact?category=event">Start a conversation</TextLink></div>
   </div>
   {upcoming.length>0&&<div style={{marginTop:36}}>
    <p className="eyebrow">UPCOMING GATHERINGS</p>
    {upcoming.map(event=><article className="event-row" id={`gathering-${event.slug}`} key={event.id}>
     <div><h3>{event.title}</h3><p>{event.description}</p>
      {event.start&&<p><strong>When:</strong> {new Date(event.start).toLocaleString('en-US',{timeZone:event.timezone})}</p>}
     </div><TextLink to="/contact?category=event">Ask about this gathering</TextLink>
    </article>)}
   </div>}
   {past.length>0&&<div style={{marginTop:36}}>
    <p className="eyebrow">GATHERINGS TO REMEMBER</p>
    {past.map(event=><article className="event-row" id={`gathering-${event.slug}`} key={event.id}>
     <div><h3>{event.title}</h3><p>{event.description}</p>
      {event.start&&<p><strong>When:</strong> {new Date(event.start).toLocaleString('en-US',{timeZone:event.timezone})}</p>}
     </div>
     <TextLink to="/contact?category=event">Ask about future gatherings</TextLink>
    </article>)}
   </div>}
   {events.length===0&&<p className="wide-copy">No gatherings have been announced yet. New events and collaborations will appear here when Sandy is ready to share them.</p>}
  </section>
  <section className="philosophy section">
   <p className="eyebrow">ALWAYS BECOMING</p>
   <h2>Room to create.<br/><i>Room to grow.</i></h2>
   <p>New projects will be introduced when Sandy chooses. Until then, there’s plenty to explore—and always a reason to stay connected.</p>
   <TextLink to="/contact">Start a conversation</TextLink>
  </section>
 </>;
}
