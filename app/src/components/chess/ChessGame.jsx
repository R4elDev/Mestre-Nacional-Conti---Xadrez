import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import { file, kinds, rank, replay } from '../../lib/chessGame.js';
import { pieceUrl, useReducedMotion } from './chessVisuals.js';

const positions = replay();
const last = positions.length - 1;
const label = 'Tabuleiro da Partida da Ópera, vencida por Paul Morphy com mate de torre em d8';

function observeTab(notify) {
  document.addEventListener('visibilitychange', notify);
  return () => document.removeEventListener('visibilitychange', notify);
}

function useBoardVisibility(boardRef) {
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === 'undefined');
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined' || !boardRef.current) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(Boolean(entry?.isIntersecting)));
    observer.observe(boardRef.current);
    return () => observer.disconnect();
  }, [boardRef]);
  return visible;
}

function translation(square) {
  return `translate(${file(square) * 100}%, ${rank(square) * 100}%)`;
}

function GamePiece({ piece, square, from, running, onArrival }) {
  const pieceRef = useRef(null);
  const animationRef = useRef(null);
  const arrivalRef = useRef(onArrival);

  useLayoutEffect(() => {
    arrivalRef.current = onArrival;
  }, [onArrival]);

  useLayoutEffect(() => {
    if (from === undefined || square === from) return;
    const image = pieceRef.current;
    if (!image.animate) {
      arrivalRef.current?.();
      return;
    }

    const frames = [{ transform: translation(from) }];
    if (piece.kind === 'N') {
      const across = Math.abs(file(square) - file(from)) === 2;
      const corner = across ? rank(from) * 8 + file(square) : rank(square) * 8 + file(from);
      frames.push({ transform: translation(corner), offset: .64 });
    }
    frames.push({ transform: translation(square) });
    const animation = image.animate(frames, { duration: 360, easing: 'ease-in-out' });
    animationRef.current = animation;
    animation.finished.then(() => arrivalRef.current?.(), () => {});
    return () => {
      animationRef.current = null;
      animation.cancel();
    };
  }, [from, piece.kind, square]);

  useLayoutEffect(() => {
    const animation = animationRef.current;
    if (!animation || animation.playState === 'finished') return;
    if (running) animation.play();
    else animation.pause();
  }, [from, running, square]);

  return (
    <img
      ref={pieceRef}
      className="chess-game__piece"
      data-side={piece.side}
      src={pieceUrl(kinds[piece.kind] + (piece.side === 'w' ? '-clara' : '-escura'))}
      alt=""
      draggable={false}
      style={{ transform: translation(square), zIndex: from !== undefined && square !== from ? 1 : undefined }}
    />
  );
}

export function ChessGame({ className = '' }) {
  const boardRef = useRef(null);
  const reduced = useReducedMotion();
  const visible = useBoardVisibility(boardRef);
  const tabVisible = useSyncExternalStore(observeTab, () => !document.hidden, () => false);
  const [paused, setPaused] = useState(false);
  const [autoplay, setAutoplay] = useState({ cursor: 0 });
  const [manualCursor, setManualCursor] = useState(last);
  const [arrived, setArrived] = useState(null);
  const clock = useRef(null);
  const running = !reduced && !paused && visible && tabVisible;
  const cursor = reduced ? manualCursor : autoplay.cursor;

  useEffect(() => {
    if (!reduced) return;
    setManualCursor(last);
    setAutoplay({ cursor: last });
  }, [reduced]);

  useEffect(() => {
    if (!running) return;
    if (clock.current?.move !== autoplay) {
      clock.current = { move: autoplay, remaining: autoplay.cursor === last ? 2100 : 900 };
    }
    const tick = clock.current;
    const started = performance.now();
    const timer = setTimeout(() => {
      setAutoplay(current => ({
        cursor: (current.cursor + 1) % positions.length,
        previous: current.cursor
      }));
    }, tick.remaining);
    return () => {
      clearTimeout(timer);
      tick.remaining = Math.max(0, tick.remaining - (performance.now() - started));
    };
  }, [autoplay, running]);

  const board = positions[cursor].board;
  const previous = !reduced && cursor !== 0 && autoplay.previous !== undefined
    ? positions[autoplay.previous].board
    : null;
  const previousSquares = new Map();
  if (previous) {
    previous.forEach((piece, square) => {
      if (piece) previousSquares.set(piece.id, square);
    });
  }
  const pieces = board.flatMap((piece, square) => piece ? [{ piece, square }] : []);
  const occupiedIds = new Set(pieces.map(({ piece }) => piece.id));
  const victim = previous && arrived !== autoplay
    ? previous.find(piece => piece && !occupiedIds.has(piece.id))
    : null;

  const controlLabel = reduced ? 'Avançar um lance na Partida da Ópera'
    : paused ? 'Retomar reprodução da Partida da Ópera'
    : 'Pausar reprodução da Partida da Ópera';
  const icon = reduced ? 'm6 6 8 6-8 6zM18 6v12' : paused ? 'm9 5 11 7-11 7z' : 'M9 5v14m6-14v14';

  function control() {
    if (reduced) setManualCursor(current => (current + 1) % positions.length);
    else setPaused(current => !current);
  }

  return (
    <div className={`chess-game-frame ${className}`.trim()}>
      <div ref={boardRef} className="chess-game" data-chess="game" role="img" aria-label={label}>
        <div className="chess-game__surface" aria-hidden="true">
          {pieces.map(({ piece, square }) => (
            <GamePiece
              key={piece.id}
              piece={piece}
              square={square}
              from={previousSquares.get(piece.id)}
              running={running}
              onArrival={victim && square === previousSquares.get(victim.id) ? () => setArrived(autoplay) : null}
            />
          ))}
          {victim && <GamePiece key={victim.id} piece={victim} square={previousSquares.get(victim.id)} running={false} />}
        </div>
      </div>
      <button type="button" className="chess-game__control" aria-label={controlLabel} onClick={control}>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d={icon} />
        </svg>
      </button>
    </div>
  );
}
