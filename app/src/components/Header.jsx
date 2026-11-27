import { Link, NavLink } from 'react-router-dom';
import content from '../content/content.json';

export default function Header() {
  const brand = content.site.brand;
  return (
    <header className="site-header">
      <Link className="brand" to={brand.logo_href} aria-label={brand.name}>
        <span aria-hidden="true">{brand.logo_text}</span>
      </Link>
      <nav aria-label="Navegação principal">
        <ul>
          {content.nav.map(item => (
            <li key={item.href}><NavLink to={item.href} end>{item.label}</NavLink></li>
          ))}
        </ul>
      </nav>
    </header>
  );
}