import { pieceName, pieceUrl } from './chessVisuals.js';

export function ChessCta({ piece = 'peao-clara' }) {
  return (
    <span className="chess-motion chess-motion--cta" aria-hidden="true">
      <img
        className="chess-motion__piece"
        src={pieceUrl(pieceName(piece, 'peao-clara'))}
        width={100}
        height={100}
        alt=""
        draggable={false}
        decoding="async"
      />
    </span>
  );
}
