const assert = require('node:assert/strict');
const { test } = require('node:test');
const { line, index, advance, initialPosition, inCheck, isMate, replay } = require('../js/chess-game.js');

test('os 33 lances da Partida da Ópera são legais e terminam em mate em d8', () => {
  assert.equal(line.length, 33);
  const positions = replay();
  assert.equal(positions.length, 34);
  assert.equal(positions[22].board[index('e1')].kind, 'K');
  assert.equal(positions[23].board[index('e1')], null);
  assert.equal(positions[23].board[index('a1')], null);
  assert.equal(positions[23].board[index('c1')].kind, 'K');
  assert.equal(positions[23].board[index('d1')].kind, 'R');
  assert.equal(positions[7].board[index('e5')].side, 'w');
  assert.equal(positions[7].board.filter(Boolean).length, 31);
  const beforeMate = positions.at(-2);
  assert.equal(inCheck(beforeMate.board, 'b'), false);
  const mate = positions.at(-1);
  assert.equal(mate.turn, 'b');
  assert.equal(mate.rights, 'k');
  assert.equal(mate.board[index('d8')].kind, 'R');
  assert.equal(mate.board[index('d8')].side, 'w');
  assert.equal(isMate(mate), true);
  const ranks = Array.from({ length: 8 }, (_, rank) => mate.board.slice(rank * 8, rank * 8 + 8)
    .map(piece => !piece ? '.' : piece.side === 'w' ? piece.kind : piece.kind.toLowerCase()).join(''));
  assert.deepEqual(ranks, ['.n.Rkb.r', 'p....ppp', '....q...', '....p.B.', '....P...', '........', 'PPP..PPP', '..K.....']);
});

test('a validação rejeita lances ilegais e roque através de xeque', () => {
  const initial = initialPosition();
  assert.equal(advance(initial, index('a7'), index('a5')), null);
  assert.equal(advance(initial, index('a1'), index('a4')), null);
  assert.equal(advance(initial, index('b1'), index('b3')), null);
  assert.equal(advance(initial, index('e2'), index('e5')), null);
  assert.equal(advance(initial, index('e1'), index('c1')), null);
  const preCastle = replay()[22];
  const attackedTransit = { ...preCastle, board: preCastle.board.slice() };
  attackedTransit.board[index('d2')] = { id: 64, side: 'b', kind: 'R' };
  assert.equal(advance(attackedTransit, index('e1'), index('c1')), null);
});
