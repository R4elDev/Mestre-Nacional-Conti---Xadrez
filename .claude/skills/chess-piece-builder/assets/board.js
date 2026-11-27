window.createChessBoard = function createChessBoard(board) {
  const cells = Array.from({ length: 64 }, (_, index) => {
    const cell = document.createElement('div');
    cell.className = 'chess-square';
    cell.dataset.tone = (Math.floor(index / 8) + index % 8) % 2 ? 'dark' : 'light';
    cell.setAttribute('aria-hidden', 'true');
    return cell;
  });
  board.classList.add('chess-board');
  board.replaceChildren(...cells);
  function place(token, file, rank) {
    if (![file, rank].every(value => Number.isInteger(value) && value >= 0 && value < 8)) {
      throw new RangeError('Use índices de 0 a 7 para coluna e linha.');
    }
    token.classList.add('chess-token');
    token.style.setProperty('--file', file);
    token.style.setProperty('--rank', rank);
    if (token.parentNode !== board) board.append(token);
  }
  return { place };
};
