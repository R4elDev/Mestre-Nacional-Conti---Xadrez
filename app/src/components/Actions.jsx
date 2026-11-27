import { Link } from 'react-router-dom';
import { ChessCta } from './chess/index.js';

export default function Actions({ items = [] }) {
  if (!items.length) return null;
  return (
    <div className="actions">
      {items.map(({ url, label, external, target }) => {
        const contents = <>{label}<ChessCta piece="peao-clara" /></>;
        return external ? (
          <a key={url} className="cta" data-chess="cta" href={url} target={target}
            rel={target === '_blank' ? 'noopener noreferrer' : undefined}
            aria-describedby={target === '_blank' ? 'new-tab' : undefined}>
            {contents}
          </a>
        ) : <Link key={url} className="cta" data-chess="cta" to={url}>{contents}</Link>;
      })}
    </div>
  );
}