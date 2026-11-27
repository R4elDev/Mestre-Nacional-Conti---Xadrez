const board = document.querySelector('#board');
const { place } = createChessBoard(board);
const status = document.querySelector('#status');
const controls = document.querySelector('#controls');
const gallery = document.querySelector('#gallery');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const names = { rei: 'Rei', rainha: 'Rainha', torre: 'Torre', bispo: 'Bispo', cavalo: 'Cavalo', peao: 'Peão' };

function image(piece, variant, decorative = false) {
  const img = document.createElement('img');
  img.src = `pieces/${piece}-${variant}.svg`;
  img.alt = decorative ? '' : `${names[piece]}, lado ${variant === 'clara' ? 'claro' : 'escuro'}`;
  return img;
}

for (const variant of ['clara', 'escura']) {
  for (const [piece, name] of Object.entries(names)) {
    const figure = document.createElement('figure');
    const caption = document.createElement('figcaption');
    figure.dataset.variant = variant;
    caption.textContent = `${name} · ${variant === 'clara' ? 'lado claro' : 'lado escuro'}`;
    figure.append(image(piece, variant, true), caption);
    gallery.append(figure);
  }
}

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('enter');
      observer.unobserve(entry.target);
    }
  }, { threshold: .2 });
  for (const figure of gallery.children) observer.observe(figure);
}

document.querySelector('#transition').addEventListener('click', () => {
  gallery.classList.remove('reveal');
  void gallery.offsetWidth;
  gallery.classList.add('reveal');
});

function token(piece, variant, file, rank) {
  const wrapper = document.createElement('div');
  wrapper.append(image(piece, variant));
  place(wrapper, file, rank);
  return wrapper;
}

let pieces;
function reset() {
  board.querySelectorAll('.chess-token').forEach(piece => piece.remove());
  pieces = {
    cavalo: token('cavalo', 'clara', 1, 7),
    alvo: token('torre', 'escura', 4, 3),
    peao: token('peao', 'clara', 0, 1),
    rei: token('rei', 'escura', 4, 0)
  };
}

async function animate(element, frames, duration = 420) {
  if (reduced.matches || !element.animate) return;
  const animation = element.animate(frames, { duration, easing: 'ease-in-out' });
  const cancel = event => { if (event.matches) animation.cancel(); };
  reduced.addEventListener('change', cancel);
  try {
    await animation.finished;
  } catch (error) {
    if (error.name !== 'AbortError') throw error;
  } finally {
    reduced.removeEventListener('change', cancel);
  }
}

function transform(file, rank) {
  return `translate(${file * 100}%, ${rank * 100}%)`;
}

async function move(piece, ...route) {
  const start = [Number(piece.style.getPropertyValue('--file')), Number(piece.style.getPropertyValue('--rank'))];
  await animate(piece, [start, ...route].map(([file, rank]) => ({ transform: transform(file, rank) })));
  place(piece, ...route.at(-1));
}

const actions = {
  async cavalo() {
    await move(pieces.cavalo, [1, 5], [2, 5]);
    return 'Cavalo de b1 para c3.';
  },
  async captura() {
    place(pieces.cavalo, 3, 5);
    await move(pieces.cavalo, [3, 3], [4, 3]);
    await animate(pieces.alvo, [{ opacity: 1, transform: transform(4, 3) }, { opacity: 0, transform: transform(4, 3) + ' scale(.55)' }], 220);
    pieces.alvo.remove();
    return 'Cavalo de d3 captura a torre em e5.';
  },
  async promocao() {
    await move(pieces.peao, [0, 0]);
    pieces.peao.replaceChildren(image('rainha', 'clara'));
    await animate(pieces.peao.firstChild, [{ opacity: .3, transform: 'scale(.7)' }, { opacity: 1, transform: 'scale(1)' }]);
    return 'Peão de a7 promovido a rainha em a8.';
  },
  async rei() {
    await animate(pieces.rei.firstChild, [-8, 8, -5, 5, 0].map(angle => ({ transform: `rotate(${angle}deg)` })), 300);
    return 'Rei escuro em xeque.';
  },
  reset() { return 'Posição inicial restaurada.'; }
};

controls.addEventListener('click', async event => {
  const button = event.target.closest('button[data-action]');
  if (!button || controls.dataset.busy === 'true') return;
  controls.dataset.busy = 'true';
  controls.setAttribute('aria-busy', 'true');
  try {
    reset();
    status.textContent = await actions[button.dataset.action]();
  } finally {
    controls.dataset.busy = 'false';
    controls.removeAttribute('aria-busy');
  }
});
reset();
