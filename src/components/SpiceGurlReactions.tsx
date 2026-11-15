import { useEffect, useRef, useState } from 'react';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import './SpiceGurlReactions.css';

const FILM = '/videos/spicegurl-reactions/spicegurl-cinematic-single-screen.mp4';
const POSTER = '/videos/spicegurl-reactions/spicegurl-cinematic-poster.jpg';

/** One original-footage film, not four separate cards or a carousel. */
export default function SpiceGurlReactions() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const [manuallyStarted, setManuallyStarted] = useState(false);
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReducedMotion(preference.matches);
    preference.addEventListener('change', onChange);
    return () => preference.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (failed) return;
    const video = videoRef.current;
    if (!video) return;

    function syncPlayback() {
      if (!video) return;
      const bounds = video.getBoundingClientRect();
      const visible = bounds.bottom > window.innerHeight * 0.25 &&
        bounds.top < window.innerHeight * 0.75;
      const mayPlay = visible && !document.hidden && !manuallyPaused &&
        (!reducedMotion || manuallyStarted);
      if (mayPlay) void video.play().catch(() => {
        // Native autoplay restrictions may require the visitor to click Play.
      });
      else video.pause();
    }

    const observer = new IntersectionObserver(syncPlayback, { threshold: [0, 0.35, 0.7] });
    observer.observe(video);
    document.addEventListener('visibilitychange', syncPlayback);
    window.addEventListener('resize', syncPlayback);
    syncPlayback();
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', syncPlayback);
      window.removeEventListener('resize', syncPlayback);
      video.pause();
    };
  }, [failed, reducedMotion, manuallyPaused, manuallyStarted]);

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      setManuallyPaused(true);
      video.pause();
    } else {
      setManuallyStarted(true);
      setManuallyPaused(false);
      void video.play().catch(() => {});
    }
  }

  return <section className="sc-reactions" id="reactions" aria-labelledby="sc-reactions-heading">
    <div className="sc-reactions__head">
      <p className="eyebrow">THE FIRST BITE / SPICE GURL</p>
      <h2 id="sc-reactions-heading">People Are <em>LOVING</em> SPICE GURL</h2>
    </div>
    <div className="sc-reactions__screen">
      {failed
        ? <img className="sc-reactions__poster" src={POSTER} alt="Spice Gurl food and original tasting reactions" />
        : <>
          <video
            ref={videoRef}
            src={FILM}
            poster={POSTER}
            muted={muted}
            loop
            playsInline
            preload={reducedMotion ? 'none' : 'metadata'}
            aria-label="Edited original Spice Gurl tasting reactions and food footage"
            aria-describedby="sc-reactions-description"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onError={() => setFailed(true)}
          />
          <div className="sc-reactions__controls" aria-label="Film controls">
            <button type="button" onClick={togglePlayback}
              aria-label={playing ? 'Pause Spice Gurl film' : 'Play Spice Gurl film'}>
              {playing ? <Pause aria-hidden="true" size={19}/> : <Play aria-hidden="true" size={19}/>}
            </button>
            <button type="button" onClick={() => setMuted(value => !value)}
              aria-label={muted ? 'Turn film sound on' : 'Mute film'}>
              {muted ? <VolumeX aria-hidden="true" size={19}/> : <Volume2 aria-hidden="true" size={19}/>}
            </button>
          </div>
        </>}
      <p id="sc-reactions-description" className="sr-only">
        A continuous 16:9 film edited from original Spice Gurl footage: a dish from Sandy’s kitchen, two guests tasting food outdoors, a visitor at an indoor event and a guest tasting outdoors.
      </p>
    </div>
  </section>;
}
