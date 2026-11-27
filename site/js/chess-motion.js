(() => {
  const script = document.currentScript;
  if (!script?.src) return;
  const assets = new URL('../assets/pieces/', script.src);
  const valid = /^(rei|rainha|torre|bispo|cavalo|peao)-(clara|escura)$/;
  const defaults = {
    hero: ['rei-clara', 'cavalo-escura'],
    divider: ['rei', 'rainha', 'torre', 'bispo', 'cavalo', 'peao'].flatMap(
      type => [type + '-clara', type + '-escura']
    ),
    cta: ['peao-clara']
  };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const pending = new Map();

  function piece(name) {
    const img = document.createElement('img');
    img.className = 'chess-motion__piece';
    img.alt = '';
    img.width = 100;
    img.height = 100;
    img.decoding = 'async';
    img.draggable = false;
    img.src = new URL(name + '.svg', assets).href;
    return img;
  }

  const observer = 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting || entry.intersectionRatio < .15) continue;
          const host = pending.get(entry.target);
          observer.unobserve(entry.target);
          pending.delete(entry.target);
          host?.removeAttribute('data-chess-pending');
          if (host && !reduced.matches) host.setAttribute('data-chess-played', '');
        }
      }, { threshold: .15 })
    : null;

  function init() {
    for (const host of document.querySelectorAll('[data-chess="hero"], [data-chess="divider"], [data-chess="cta"]')) {
      if (host.hasAttribute('data-chess-ready')) continue;
      const mode = host.dataset.chess;
      const fallback = defaults[mode];
      const names = (host.dataset.chessPieces || '').trim().split(/\s+/);
      const decor = document.createElement('span');
      decor.className = 'chess-motion chess-motion--' + mode;
      decor.setAttribute('aria-hidden', 'true');
      fallback.forEach((name, index) => {
        const override = mode !== 'divider' && valid.test(names[index]);
        const img = piece(override ? names[index] : name);
        if (mode === 'divider') img.style.setProperty('--chess-piece-index', index);
        decor.append(img);
      });
      host.append(decor);
      host.setAttribute('data-chess-ready', '');
      if (mode !== 'cta' && observer && !reduced.matches) {
        host.setAttribute('data-chess-pending', '');
        pending.set(decor, host);
        observer.observe(decor);
      }
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
