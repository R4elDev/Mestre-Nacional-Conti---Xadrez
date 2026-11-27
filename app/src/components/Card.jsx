import Actions from './Actions.jsx';
import { Heading, Paragraphs } from './Editorial.jsx';

export default function Card({ item }) {
  return (
    <article className="card">
      {item.tag && <p className="tag">{item.tag}</p>}
      <Heading heading={{ level: item.title_level, text: item.title }} />
      <Paragraphs items={[item.text, item.for_you]} />
      <Actions items={[item.cta]} />
    </article>
  );
}