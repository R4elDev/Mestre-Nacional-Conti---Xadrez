import { useLayoutEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import content from '../content/content.json';

export default function Header() {
  const brand = content.site.brand;
  const nav = useRef(null);
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    if (!window.matchMedia('(width < 43rem)').matches) return;
    const current = nav.current.querySelector('[aria-current="page"]');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    current?.scrollIntoView({
      block: 'nearest',
      inline: 'center',
      behavior: reducedMotion ? 'auto' : 'smooth',
      container: 'nearest',
    });
  }, [pathname]);

  return (
    <header className="site-header">
      <Link className="brand" to={brand.logo_href} aria-label={brand.name}>
        <span aria-hidden="true">{brand.logo_text}</span>
      </Link>
      <nav ref={nav} aria-label="Navegação principal">
        <ul>
          {content.nav.map(item => (
            <li key={item.href}><NavLink to={item.href} end>{item.label}</NavLink></li>
          ))}
        </ul>
      </nav>
    </header>
  );
}