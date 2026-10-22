import { sandyProfile } from '../data/profile';
export default function SandyPortrait(){const portrait=sandyProfile.portrait;return <figure className="sandy-portrait"><img src={portrait.src} alt={portrait.alt} width={portrait.width} height={portrait.height} loading="lazy"/><figcaption>Sandy · the creator behind Sandy Creates</figcaption></figure>;}
