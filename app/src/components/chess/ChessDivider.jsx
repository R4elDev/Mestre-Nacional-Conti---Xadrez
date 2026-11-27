import { useRef } from 'react';
import { pieceUrl, useChessEntrance } from './chessVisuals.js';

const lineup = ['rei', 'rainha', 'torre', 'bispo', 'cavalo', 'peao'].flatMap(
  piece => [piece + '-clara', piece + '-escura']
);

export function ChessDivider({ className = '' }) {
  const rowRef = useRef(null);
  const entrance = useChessEntrance(rowRef);

  return (
    <div className={`chess-divider ${className}`.trim()} data-chess="divider" aria-hidden="true" {...entrance}>
      <span ref={rowRef} className="chess-motion chess-motion--divider">
        {lineup.map((piece, index) => (
          <img
            key={piece}
            className="chess-motion__piece"
            src={pieceUrl(piece)}
            width={100}
            height={100}
            alt=""
            draggable={false}
            decoding="async"
            style={{ '--chess-piece-index': index }}
          />
        ))}
      </span>
    </div>
  );
}
