import { useRef } from 'react';
import { pieceName, pieceUrl, useChessEntrance } from './chessVisuals.js';

const defaults = ['rei-clara', 'cavalo-escura'];

export function ChessHero({ pieces = defaults, className = '' }) {
  const artRef = useRef(null);
  const entrance = useChessEntrance(artRef);

  return (
    <div className={`hero-pieces ${className}`.trim()} data-chess="hero" aria-hidden="true" {...entrance}>
      <span ref={artRef} className="chess-motion chess-motion--hero">
        {defaults.map((fallback, index) => (
          <img
            key={fallback}
            className="chess-motion__piece"
            src={pieceUrl(pieceName(pieces[index], fallback))}
            width={100}
            height={100}
            alt=""
            draggable={false}
            decoding="async"
          />
        ))}
      </span>
    </div>
  );
}
