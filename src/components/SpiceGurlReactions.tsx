import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Volume2, VolumeX } from 'lucide-react';
import './SpiceGurlReactions.css';

const clips = [
  { src: '/videos/spicegurl-reactions/reaction-01.mp4', poster: '/videos/spicegurl-reactions/reaction-01.jpg', label: 'Reaction / 01', alt: 'People reacting to food from Spice Gurl' },
  { src: '/videos/spicegurl-reactions/reaction-02.mp4', poster: '/videos/spicegurl-reactions/reaction-02.jpg', label: 'Reaction / 02', alt: 'An on-camera Spice Gurl food reaction' },
  { src: '/videos/spicegurl-reactions/reaction-03.mp4', poster: '/videos/spicegurl-reactions/reaction-03.jpg', label: 'Reaction / 03', alt: 'A person responding to Spice Gurl food' },
  { src: '/videos/spicegurl-reactions/sandy-cooking.mp4', poster: '/videos/spicegurl-reactions/sandy-cooking.jpg', label: "From Sandy's kitchen", alt: 'Close-up footage of food preparation' },
] as const;

export default function SpiceGurlReactions() {
  const rail = useRef<HTMLDivElement>(null);
  const players = useRef<(HTMLVideoElement | null)[]>([]);
  const [ready, setReady] = useState<number[]>([]);
  const [soundIndex, setSoundIndex] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const video = entry.target as HTMLVideoElement;
        if (entry.intersectionRatio >= 0.45 && !document.hidden) {
          void video.play().catch(() => { /* Browser policies may block autoplay. */ });
        } else video.pause();
      }
    }, { threshold: [0, 0.45] });
    const onVisibility = () => {
      if (document.hidden) players.current.forEach(video => video?.pause());
      else players.current.forEach(video => {
        if (!video) return;
        const bounds = video.getBoundingClientRect();
        if (bounds.bottom > 0 && bounds.top < window.innerHeight) {
          void video.play().catch(() => {});
        }
      });
    };
    players.current.forEach(video => { if (video) observer.observe(video); });
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      players.current.forEach(video => video?.pause());
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

  return <section className={`sc-reactions ${ready.length ? 'sc-reactions--ready' : ''}`} id="reactions" aria-labelledby="sc-reactions-heading">
    <div className="sc-reactions__head">
      <div>
        <p className="eyebrow">THE FIRST BITE / REAL PEOPLE</p>
        <h2 id="sc-reactions-heading">People Are <em>LOVING</em> SPICE GURL</h2>
        <p>Real moments, real food, and the reactions that say it all.</p>
      </div>
      <div className="sc-reactions__arrows" aria-label="Browse reactions">
        <button type="button" onClick={() => move(-1)} aria-label="Previous reaction"><ArrowLeft size={20}/></button>
        <button type="button" onClick={() => move(1)} aria-label="Next reaction"><ArrowRight size={20}/></button>
      </div>
    </div>
    <div className="sc-reactions__rail" ref={rail} role="region" tabIndex={0} aria-label="Customer reactions and cooking videos">
      {clips.map((clip, index) => <article className={`sc-reactions__item ${ready.includes(index) ? 'is-ready' : ''}`} key={clip.src}>
        <div className="sc-reactions__media">
          <video ref={el => { players.current[index] = el; }} src={clip.src} poster={clip.poster} autoPlay muted loop playsInline preload="metadata"
            aria-label={clip.alt} onLoadedMetadata={() => setReady(items => items.includes(index) ? items : [...items, index])}
            onError={() => setReady(items => items.filter(i => i !== index))} />
          <button type="button" className="sc-reactions__sound" aria-label={soundIndex === index ? `Mute ${clip.label}` : `Enable sound for ${clip.label}`}
            aria-pressed={soundIndex === index} onClick={() => toggleSound(index)}>{soundIndex === index ? <Volume2 size={18}/> : <VolumeX size={18}/>}</button>
        </div>
        <p className="sc-reactions__label">{clip.label}</p>
      </article>)}
    </div>
  </section>;
}
