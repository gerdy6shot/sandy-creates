import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Volume2, VolumeX } from 'lucide-react';
import './SpiceGurlReactions.css';

type ReactionCard = {
  photo: string;
  alt: string;
  label: string;
  video?: { src: string; label: string };
};

const cards: ReactionCard[] = [
  { photo: '/videos/spicegurl-reactions/reaction-01.jpg', alt: 'Two people holding bites of food outdoors', label: 'The first bite / 01' },
  { photo: '/videos/spicegurl-reactions/reaction-02.jpg', alt: 'A person in a gray Syracuse sweatshirt at an indoor event', label: 'The first bite / 02' },
  { photo: '/videos/spicegurl-reactions/reaction-03.jpg', alt: 'A person holding a bite of food and making an OK gesture', label: 'The first bite / 03' },
  { photo: '/videos/spicegurl-reactions/sandy-cooking.jpg', alt: 'A glazed fruit-topped dessert on a plate', label: 'From Sandy’s kitchen' },
];

export default function SpiceGurlReactions() {
  const rail = useRef<HTMLDivElement>(null);
  const players = useRef<(HTMLVideoElement | null)[]>([]);
  const [failedVideos, setFailedVideos] = useState<string[]>([]);
  const [soundIndex, setSoundIndex] = useState<number | null>(null);

  useEffect(() => {
    const videos = players.current.filter(video => video !== null);
    if (videos.length === 0) return;

    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const video = entry.target as HTMLVideoElement;
        if (entry.intersectionRatio >= 0.45 && !document.hidden) {
          void video.play().catch(() => { /* Browser policies may block autoplay. */ });
        } else video.pause();
      }
    }, { threshold: [0, 0.45] });
    const onVisibility = () => {
      if (document.hidden) videos.forEach(video => video.pause());
      else videos.forEach(video => {
        const bounds = video.getBoundingClientRect();
        if (bounds.bottom > 0 && bounds.top < window.innerHeight) {
          void video.play().catch(() => {});
        }
      });
    };
    videos.forEach(video => observer.observe(video));
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      videos.forEach(video => video.pause());
    };
  }, []);

  function toggleSound(index: number) {
    const next = soundIndex === index ? null : index;
    players.current.forEach((video, i) => {
      if (video) video.muted = i !== next;
    });
    setSoundIndex(next);
    if (next !== null) void players.current[next]?.play().catch(() => {});
  }

  function move(direction: -1 | 1) {
    rail.current?.scrollBy({left: direction * (rail.current.clientWidth * .82), behavior: 'smooth'});
  }

  return <section className="sc-reactions" id="reactions" aria-labelledby="sc-reactions-heading">
    <div className="sc-reactions__head">
      <div>
        <p className="eyebrow">THE FIRST BITE / SPICE GURL</p>
        <h2 id="sc-reactions-heading">People Are <em>LOVING</em> SPICE GURL</h2>
        <p>A photo gallery from Spice Gurl and Sandy’s kitchen.</p>
      </div>
      <div className="sc-reactions__arrows" aria-label="Browse the gallery">
        <button type="button" onClick={() => move(-1)} aria-label="Previous card"><ArrowLeft size={20}/></button>
        <button type="button" onClick={() => move(1)} aria-label="Next card"><ArrowRight size={20}/></button>
      </div>
    </div>
    <div className="sc-reactions__rail" ref={rail} role="region" tabIndex={0} aria-label="Spice Gurl gallery">
      {cards.map((card, index) => {
        const video = card.video;
        return <article className="sc-reactions__item" key={card.photo}>
          <div className="sc-reactions__media">
            {video && !failedVideos.includes(video.src) ? <>
              <video ref={el => { players.current[index] = el; }} src={video.src} poster={card.photo} autoPlay muted loop playsInline preload="metadata"
                aria-label={video.label} onError={() => setFailedVideos(items => [...items, video.src])}/>
              <button type="button" className="sc-reactions__sound" aria-label={soundIndex === index ? `Mute ${video.label}` : `Enable sound for ${video.label}`}
                aria-pressed={soundIndex === index} onClick={() => toggleSound(index)}>{soundIndex === index ? <Volume2 size={18}/> : <VolumeX size={18}/>}</button>
            </> : <img src={card.photo} alt={card.alt} loading="lazy"/>}
          </div>
          <p className="sc-reactions__label">{card.label}</p>
        </article>;
      })}
    </div>
  </section>;
}
