import { useState } from 'react';
import { Heading, Paragraphs } from './Editorial.jsx';
import Lightbox from './Lightbox.jsx';
import Picture, { imageBase, imageFile, webpFile } from './Picture.jsx';
import { Art } from './Section.jsx';

export default function Gallery({ item }) {
  const [preview, setPreview] = useState(null);

  function show(event, image) {
    if (!window.HTMLDialogElement?.prototype.showModal || event.button !== 0 ||
      event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
    event.preventDefault();
    setPreview({ image, opener: event.currentTarget });
  }

  return (
    <>
      <div className="section-copy">
        <Heading heading={item.heading} id={item.id + '-titulo'} />
        <Paragraphs items={item.texts} />
      </div>
      <div className="gallery-grid">
        {item.images.map(image => {
          const name = imageFile(image.src);
          const fallback = name === 'cronograma.png' ? 'cronograma.svg' : name;
          return (
            <figure key={image.src}>
              <a className="zoom" data-zoom href={imageBase + fallback} data-zoom-src={imageBase + webpFile(name)}
                aria-label={'Ampliar: ' + image.alt} onClick={event => show(event, image)}>
                <Picture image={image} />
              </a>
              <figcaption>{image.caption}</figcaption>
            </figure>
          );
        })}
      </div>
      <Art />
      {preview && <Lightbox {...preview} onClose={() => setPreview(null)} />}
    </>
  );
}