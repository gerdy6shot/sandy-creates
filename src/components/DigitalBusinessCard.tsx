import { ArrowUpRight, Globe, Instagram, Mail, MapPin, Music2, Phone } from 'lucide-react';
import { sandyBusinessCard as card } from '../data/business-card';
import './DigitalBusinessCard.css';

const icons = { phone: Phone, email: Mail, website: Globe, instagram: Instagram, tiktok: Music2 };

export default function DigitalBusinessCard() {
  return (
    <section id="sandy-business-card" className="section about-business-card" aria-labelledby="business-card-title">
      <div className="about-business-card-heading">
        <div>
          <p className="eyebrow">KEEP IN GOOD COMPANY</p>
          <h2 id="business-card-title">Let’s stay<br /><i>connected.</i></h2>
        </div>
        <div className="about-business-card-intro">
          <p>Connect with {card.name}, the creator behind Sandy Creates and its featured product brand, {card.brand}.</p>
          <p className="about-business-card-specialties">{card.brand} · {card.specialties}</p>
          <p className="about-business-card-location"><MapPin size={14} aria-hidden="true" />{card.location}</p>
        </div>
      </div>
      <ul className="about-business-card-links">
        {card.links.map(link => {
          const Icon = icons[link.kind];
          const external = link.href.startsWith('https:');
          return (
            <li key={link.kind}>
              <a href={link.href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>
                <Icon size={18} aria-hidden="true" />
                <span><span className="eyebrow">{link.label}</span><span>{link.text}</span></span>
                {external && <ArrowUpRight size={15} aria-hidden="true" />}
              </a>
            </li>
          );
        })}
      </ul>
      <a className="text-link" href={card.sourceUrl} target="_blank" rel="noopener noreferrer">View Sandy’s digital business card <ArrowUpRight size={15} aria-hidden="true" /></a>
    </section>
  );
}
