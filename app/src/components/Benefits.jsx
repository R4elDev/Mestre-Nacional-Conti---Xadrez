export default function Benefits({ items = [] }) {
  if (!items.length) return null;
  return (
    <ul className="benefits">
      {items.map(text => <li key={text}><span aria-hidden="true">✓</span>{' '}{text}</li>)}
    </ul>
  );
}