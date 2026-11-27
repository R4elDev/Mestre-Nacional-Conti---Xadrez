import { ChessHero } from './chess/index.js';
import Picture from './Picture.jsx';

export default function Section({ item, transition, children }) {
  return (
    <section className={'panel panel--' + item.type} id={item.id} data-transition={transition}
      aria-labelledby={item.heading ? item.id + '-titulo' : undefined} tabIndex={-1}>
      {children}
    </section>
  );
}

const shapes = ['board', 'circle', 'half', 'arc', 'diamond', 'curtain', 'curtain', 'marquee'];

export function Art({ pieces, photo, priority = false }) {
  const className = 'fw-art ' + (pieces ? 'hero-art' : 'section-art') + (photo ? ' hero-art--photo' : '');
  return (
    <div className={className} aria-hidden={photo ? undefined : 'true'}>
      {shapes.map((shape, index) => <div key={index} className={'fw-' + shape} aria-hidden="true" />)}
      {photo && <Picture image={photo} className="hero-photo" priority={priority} clientAddition />}
      {pieces && <ChessHero pieces={pieces} />}
    </div>
  );
}