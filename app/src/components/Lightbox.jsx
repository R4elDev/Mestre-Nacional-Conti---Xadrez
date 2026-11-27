import { useLayoutEffect, useRef } from 'react';
import { imageBase, imageFile, webpFile } from './Picture.jsx';

export default function Lightbox({ image, opener, onClose }) {
  const dialog = useRef(null);
  const close = useRef(null);

  useLayoutEffect(() => {
    const element = dialog.current;
    element.showModal();
    close.current.focus();
    return () => {
      if (element.open) element.close();
      if (opener.isConnected) opener.focus();
    };
  }, [opener]);

  function dismissBackdrop(event) {
    if (event.target !== event.currentTarget) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right ||
      event.clientY < rect.top || event.clientY > rect.bottom) event.currentTarget.close();
  }

  return (
    <dialog ref={dialog} className="lightbox" aria-labelledby="lightbox-caption" onClose={onClose}
      onClick={dismissBackdrop} onKeyDown={event => {
        if (event.key !== 'Escape') return;
        event.preventDefault();
        event.currentTarget.close();
      }}>
      <div className="lightbox-content">
        <button ref={close} className="lightbox-close" type="button" aria-label="Fechar imagem ampliada"
          onClick={() => dialog.current.close()}>×</button>
        <figure>
          <picture>
            <source srcSet={imageBase + webpFile(image.src)} type="image/webp" />
            <img className="lightbox-image" src={imageBase + imageFile(image.src)} alt={image.alt} />
          </picture>
          <figcaption id="lightbox-caption">{image.caption}</figcaption>
        </figure>
      </div>
    </dialog>
  );
}