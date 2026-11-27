import { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header.jsx';
import useSectionTransitions from '../hooks/useSectionTransitions.js';

export default function Layout({ page, children, transition, focusOnEntry }) {
  const main = useRef(null);
  const { pathname, hash } = useLocation();
  useSectionTransitions(main, pathname);

  useLayoutEffect(() => {
    document.title = page.title;
    document.documentElement.lang = 'pt-BR';

    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target && main.current.contains(target)) {
        target.focus({ preventScroll: true });
        target.scrollIntoView();
      }
    } else {
      window.scrollTo(0, 0);
      const firstHeading = main.current.querySelector('h1');
      if (focusOnEntry) (firstHeading ?? main.current).focus({ preventScroll: true });
    }
  }, [page.title, pathname, hash, focusOnEntry]);

  return (
    <>
      <a className="skip-link" href="#conteudo">Ir para o conteúdo</a>
      <Header />
      <main ref={main} id="conteudo" className={'page-' + page.id} tabIndex={-1}
        data-motion-scope data-transition={transition}>
        {children}
      </main>
      <span id="new-tab" hidden>Abre em nova aba.</span>
    </>
  );
}