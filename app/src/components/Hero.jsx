import additions from '../content/additions.json';
import Actions from './Actions.jsx';
import Benefits from './Benefits.jsx';
import { Heading, Paragraphs } from './Editorial.jsx';
import Picture from './Picture.jsx';
import { Art } from './Section.jsx';

const pieces = {
  home: ['rei-clara', 'cavalo-escura'],
  mentoria: ['torre-clara', 'bispo-escura'],
  'aula-individual': ['cavalo-clara', 'peao-escura'],
  'cursos-gravados': ['rainha-clara', 'torre-escura'],
  about: ['bispo-clara', 'rainha-escura'],
};

export default function Hero({ pageId, item }) {
  const photo = additions.heroPhoto.pages.includes(pageId) ? additions.heroPhoto : undefined;
  return (
    <>
      <div className="hero-copy">
        <Heading heading={item.heading} id={item.id + '-titulo'} />
        <Paragraphs items={item.texts} />
        <Benefits items={item.bullets} />
        <Actions items={item.ctas} />
      </div>
      {item.type === 'about' && <div className="portrait"><Picture image={item.images[0]} /></div>}
      <Art pieces={pieces[pageId]} photo={photo} priority={pageId === 'home'} />
    </>
  );
}