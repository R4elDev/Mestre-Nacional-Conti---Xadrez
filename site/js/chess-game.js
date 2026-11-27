(() => {
  // Índices de a8 até h1, com as brancas na parte inferior.
  const files = 'abcdefgh';
  const kinds = { K: 'rei', Q: 'rainha', R: 'torre', B: 'bispo', N: 'cavalo', P: 'peao' };
  const line = [
    'e2e4', 'e7e5', 'g1f3', 'd7d6', 'd2d4', 'c8g4', 'd4e5', 'g4f3',
    'd1f3', 'd6e5', 'f1c4', 'g8f6', 'f3b3', 'd8e7', 'b1c3', 'c7c6',
    'c1g5', 'b7b5', 'c3b5', 'c6b5', 'c4b5', 'b8d7', 'e1c1', 'a8d8',
    'd1d7', 'd8d7', 'h1d1', 'e7e6', 'b5d7', 'f6d7', 'b3b8', 'd7b8', 'd1d8'
  ];
  const index = square => files.indexOf(square[0]) + (8 - Number(square[1])) * 8;
  const file = square => square % 8;
  const rank = square => Math.floor(square / 8);
  const other = side => side === 'w' ? 'b' : 'w';

  function initialPosition() {
    const layout = 'rnbqkbnrpppppppp' + '.'.repeat(32) + 'PPPPPPPPRNBQKBNR';
    return {
      board: Array.from(layout, (symbol, id) => symbol === '.' ? null : {
        id,
        side: symbol === symbol.toUpperCase() ? 'w' : 'b',
        kind: symbol.toUpperCase()
      }),
      turn: 'w',
      rights: 'KQkq'
    };
  }

  function clearPath(board, from, to, x, y) {
    const step = Math.sign(x) + Math.sign(y) * 8;
    for (let square = from + step; square !== to; square += step) {
      if (board[square]) return false;
    }
    return true;
  }

  function reaches(board, from, to, attackOnly = false) {
    if (from === to) return false;
    const piece = board[from];
    const x = file(to) - file(from);
    const y = rank(to) - rank(from);
    const dx = Math.abs(x);
    const dy = Math.abs(y);
    switch (piece.kind) {
      case 'P': {
        const forward = piece.side === 'w' ? -1 : 1;
        if (attackOnly || board[to]) return dx === 1 && y === forward;
        if (dx) return false;
        if (y === forward) return true;
        return rank(from) === (piece.side === 'w' ? 6 : 1)
          && y === 2 * forward && !board[from + forward * 8];
      }
      case 'N': return dx * dy === 2;
      case 'K': return Math.max(dx, dy) === 1;
      case 'B': return dx === dy && clearPath(board, from, to, x, y);
      case 'R': return (!dx || !dy) && clearPath(board, from, to, x, y);
      case 'Q': return (!dx || !dy || dx === dy) && clearPath(board, from, to, x, y);
      default: return false;
    }
  }

  function inCheck(board, side) {
    const king = board.findIndex(piece => piece?.kind === 'K' && piece.side === side);
    return board.some((piece, square) => piece?.side === other(side) && reaches(board, square, king, true));
  }

  function castle(position, from, to, mover) {
    const { board, rights } = position;
    const home = mover.side === 'w' ? 56 : 0;
    const direction = Math.sign(to - from);
    if (from !== home + 4 || to !== from + direction * 2) return null;
    const flag = direction === 1 ? 'K' : 'Q';
    if (!rights.includes(mover.side === 'w' ? flag : flag.toLowerCase())) return null;
    const rookFrom = home + (direction === 1 ? 7 : 0);
    const transit = from + direction;
    const rook = board[rookFrom];
    if (rook?.kind !== 'R' || rook.side !== mover.side ||
        !clearPath(board, from, rookFrom, direction, 0) || inCheck(board, mover.side)) return null;
    const intermediate = board.slice();
    intermediate[from] = null;
    intermediate[transit] = mover;
    if (inCheck(intermediate, mover.side)) return null;
    return [rookFrom, transit];
  }

  function advance(position, from, to) {
    if (![from, to].every(square => Number.isInteger(square) && square >= 0 && square < 64)) return null;
    const { board, turn } = position;
    const mover = board[from];
    const target = board[to];
    if (mover?.side !== turn || target?.side === turn || target?.kind === 'K') return null;
    const castling = mover.kind === 'K' && Math.abs(file(to) - file(from)) === 2;
    const rookMove = castling ? castle(position, from, to, mover) : null;
    if (castling ? !rookMove : !reaches(board, from, to)) return null;
    const next = board.slice();
    next[from] = null;
    next[to] = mover.kind === 'P' && (rank(to) === 0 || rank(to) === 7)
      ? { ...mover, kind: 'Q' }
      : mover;
    if (rookMove) {
      const [start, end] = rookMove;
      next[end] = next[start];
      next[start] = null;
    }
    if (inCheck(next, turn)) return null;

    let { rights } = position;
    if (mover.kind === 'K') rights = rights.replace(turn === 'w' ? /[KQ]/g : /[kq]/g, '');
    for (const [square, flag] of [[0, 'q'], [7, 'k'], [56, 'Q'], [63, 'K']]) {
      if ((mover.kind === 'R' && from === square) || (target?.kind === 'R' && to === square)) {
        rights = rights.replace(flag, '');
      }
    }
    return { board: next, turn: other(turn), rights };
  }

  function isMate(position) {
    if (!inCheck(position.board, position.turn)) return false;
    return !position.board.some((piece, from) => piece?.side === position.turn &&
      position.board.some((_, to) => advance(position, from, to)));
  }

  function replay() {
    const positions = [initialPosition()];
    for (const move of line) {
      const next = advance(positions.at(-1), index(move.slice(0, 2)), index(move.slice(2)));
      if (!next) throw new Error('Lance ilegal na Partida da Ópera: ' + move);
      positions.push(next);
    }
    return positions;
  }

  if (typeof module === 'object' && module.exports) {
    module.exports = { line, index, advance, initialPosition, inCheck, isMate, replay };
    return;
  }

  const script = document.currentScript;
  if (!script?.src) return;
  const assets = new URL('../assets/pieces/', script.src);
  const pauseGlyph = '<path d="M9 5v14m6-14v14"/>';
  const playGlyph = '<path d="m9 5 11 7-11 7z"/>';
  const stepGlyph = '<path d="m6 6 8 6-8 6zM18 6v12"/>';

  function translation(square) {
    return 'translate(' + file(square) * 100 + '%, ' + rank(square) * 100 + '%)';
  }

  function mount(host, positions, observer, visibilityCallbacks) {
    const frame = document.createElement('div');
    frame.className = 'chess-game-frame';
    host.before(frame);
    frame.append(host);
    const surface = document.createElement('div');
    surface.className = 'chess-game__surface';
    surface.setAttribute('aria-hidden', 'true');
    host.append(surface);

    const control = document.createElement('button');
    control.type = 'button';
    control.className = 'chess-game__control';
    frame.append(control);

    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const pieces = new Map();
    const active = new Set();
    const retiring = new Set();
    const last = positions.length - 1;
    let cursor = motion.matches ? last : 0;
    let visible = !observer;
    let paused = false;
    let timer = null;
    let pendingDelay = cursor === last ? 2100 : 900;
    let deadline = 0;

    function render(animate) {
      const board = positions[cursor].board;
      const remaining = new Set(board.filter(Boolean).map(piece => piece.id));
      for (const img of retiring) img.remove();
      retiring.clear();
      const captured = new Map();
      for (const [id, item] of pieces) {
        if (remaining.has(id)) continue;
        if (animate) {
          captured.set(item.square, item.img);
          retiring.add(item.img);
        } else {
          item.img.remove();
        }
        pieces.delete(id);
      }
      board.forEach((piece, square) => {
        if (!piece) return;
        let item = pieces.get(piece.id);
        if (!item) {
          const img = document.createElement('img');
          img.className = 'chess-game__piece';
          img.alt = '';
          img.dataset.side = piece.side;
          img.draggable = false;
          img.src = new URL(kinds[piece.kind] + (piece.side === 'w' ? '-clara.svg' : '-escura.svg'), assets).href;
          item = { img, square };
          pieces.set(piece.id, item);
          surface.append(img);
        }
        const { img } = item;
        const destination = translation(square);
        img.style.transform = destination;
        if (animate && item.square !== square && img.animate) {
          const route = [{ transform: translation(item.square) }];
          if (piece.kind === 'N') {
            const across = Math.abs(file(square) - file(item.square)) === 2;
            const corner = across ? rank(item.square) * 8 + file(square) : rank(square) * 8 + file(item.square);
            route.push({ transform: translation(corner), offset: .64 });
          }
          route.push({ transform: destination });
          const animation = img.animate(route, { duration: 360, easing: 'ease-in-out' });
          active.add(animation);
          const victim = captured.get(square);
          captured.delete(square);
          const finish = () => {
            active.delete(animation);
            if (victim && retiring.delete(victim)) victim.remove();
          };
          animation.finished.then(finish, finish);
        }
        item.square = square;
      });
      for (const img of captured.values()) {
        retiring.delete(img);
        img.remove();
      }
    }

    function updateControl() {
      const label = motion.matches
        ? 'Avançar um lance na Partida da Ópera'
        : paused ? 'Retomar reprodução da Partida da Ópera' : 'Pausar reprodução da Partida da Ópera';
      const glyph = motion.matches ? stepGlyph : paused ? playGlyph : pauseGlyph;
      control.setAttribute('aria-label', label);
      control.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + glyph + '</svg>';
    }

    function playable() {
      return !motion.matches && !paused && visible && !document.hidden;
    }

    function stopTimer() {
      if (timer === null) return;
      clearTimeout(timer);
      timer = null;
      pendingDelay = Math.max(0, deadline - performance.now());
    }

    function sync() {
      if (!playable()) {
        stopTimer();
        for (const animation of active) animation.pause();
        return;
      }
      for (const animation of active) {
        if (animation.playState === 'paused') animation.play();
      }
      if (timer !== null) return;
      deadline = performance.now() + pendingDelay;
      timer = setTimeout(() => {
        timer = null;
        if (!playable()) return;
        cursor = (cursor + 1) % positions.length;
        render(cursor !== 0);
        pendingDelay = cursor === last ? 2100 : 900;
        sync();
      }, pendingDelay);
    }

    control.addEventListener('click', () => {
      if (motion.matches) {
        cursor = (cursor + 1) % positions.length;
        render(false);
        return;
      }
      paused = !paused;
      updateControl();
      sync();
    });

    motion.addEventListener('change', () => {
      stopTimer();
      for (const animation of active) animation.cancel();
      active.clear();
      if (motion.matches) cursor = last;
      pendingDelay = cursor === last ? 2100 : 900;
      render(false);
      updateControl();
      sync();
    });

    visibilityCallbacks.set(host, inView => {
      if (typeof inView === 'boolean') visible = inView;
      sync();
    });
    host.setAttribute('data-chess-game-ready', '');
    render(false);
    updateControl();
    if (observer) observer.observe(host);
    sync();
  }

  function init() {
    const hosts = document.querySelectorAll('[data-chess="game"]:not([data-chess-game-ready])');
    if (!hosts.length) return;
    const positions = replay();
    const visibilityCallbacks = new Map();
    const observer = 'IntersectionObserver' in window
      ? new IntersectionObserver(entries => {
          for (const entry of entries) visibilityCallbacks.get(entry.target)?.(entry.isIntersecting);
        })
      : null;
    document.addEventListener('visibilitychange', () => {
      for (const update of visibilityCallbacks.values()) update();
    });
    for (const host of hosts) mount(host, positions, observer, visibilityCallbacks);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
