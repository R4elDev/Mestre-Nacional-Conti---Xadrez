import Actions from './Actions.jsx';
import Benefits from './Benefits.jsx';
import { Heading, Paragraphs } from './Editorial.jsx';
import { Art } from './Section.jsx';
import { ChessGame } from './chess/index.js';

export default function Pricing({ item, individual }) {
  const { texts, price } = item;
  const heading = <Heading heading={item.heading} id={item.id + '-titulo'} />;
  return (
    <>
      <div className="section-copy offer">
        {individual ? <Paragraphs items={texts.slice(0, 1)} /> : heading}
        <p className="price"><strong>{price.display}</strong>{' '}<span>{price.period_display}</span></p>
        {individual && heading}
        <Paragraphs items={individual ? texts.slice(1, 2) : texts} />
        <Benefits items={item.bullets} />
        <Actions items={item.ctas} />
        {individual && <Paragraphs items={texts.slice(2)} />}
      </div>
      {individual ? <ChessGame /> : <Art />}
    </>
  );
}