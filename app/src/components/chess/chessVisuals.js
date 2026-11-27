import { useEffect, useState, useSyncExternalStore } from 'react';

const motionQuery = '(prefers-reduced-motion: reduce)';
const validPiece = /^(rei|rainha|torre|bispo|cavalo|peao)-(clara|escura)$/;

function subscribeMotion(notify) {
  const query = window.matchMedia(motionQuery);
  query.addEventListener('change', notify);
  return () => query.removeEventListener('change', notify);
}

export function useReducedMotion() {
  return useSyncExternalStore(subscribeMotion, () => window.matchMedia(motionQuery).matches, () => true);
}

export function useChessEntrance(ref) {
  const reduced = useReducedMotion();
  const [played, setPlayed] = useState(false);
  const pending = !played && !reduced && typeof IntersectionObserver !== 'undefined';

  useEffect(() => {
    if (!pending || !ref.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting || entry.intersectionRatio < .15) return;
      setPlayed(true);
      observer.disconnect();
    }, { threshold: .15 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [pending, ref]);

  return {
    'data-chess-ready': '',
    'data-chess-pending': pending ? '' : undefined,
    'data-chess-played': played && !reduced ? '' : undefined
  };
}

export function pieceName(name, fallback) {
  return validPiece.test(name) ? name : fallback;
}

export function pieceUrl(name) {
  return import.meta.env.BASE_URL + 'assets/pieces/' + name + '.svg';
}
