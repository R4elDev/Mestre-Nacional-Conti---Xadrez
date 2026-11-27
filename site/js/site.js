(() => {
  const dialog = document.querySelector('.lightbox');
  if (!dialog?.showModal) return;

  const image = dialog.querySelector('.lightbox-image');
  const caption = dialog.querySelector('#lightbox-caption');
  let opener;

  for (const link of document.querySelectorAll('a[data-zoom]')) {
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
      const thumbnail = link.querySelector('img');
      const figure = link.closest('figure');
      image.src = link.dataset.zoomSrc || link.href;
      image.alt = thumbnail.alt;
      caption.textContent = figure.querySelector('figcaption').textContent;
      dialog.showModal();
      opener = link;
      event.preventDefault();
    });
  }

  dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    dialog.close();
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const {left, right, top, bottom} = dialog.getBoundingClientRect();
    if (event.clientX < left || event.clientX > right || event.clientY < top || event.clientY > bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    image.removeAttribute('src');
    image.alt = '';
    caption.textContent = '';
    opener?.focus();
    opener = undefined;
  });
})();