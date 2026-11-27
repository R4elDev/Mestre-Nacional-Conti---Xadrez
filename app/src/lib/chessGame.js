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

export { advance, file, index, initialPosition, inCheck, isMate, kinds, line, rank, replay };
