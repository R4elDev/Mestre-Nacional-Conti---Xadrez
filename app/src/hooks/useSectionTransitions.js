import { useEffect } from 'react';

const effects = new Set(['none', 'circle', 'wipe', 'curtain', 'parallax', 'slide-scale', 'marquee', 'morph']);
const threshold = 0.25;

export default function useSectionTransitions(scopeRef, route) {
  useEffect(() => {
    const scope = scopeRef.current;
    const panels = [...scope.querySelectorAll(':scope > section > .fw-art')];
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const scrollMotion = CSS.supports('animation-timeline: view()')
      && CSS.supports('animation-range: entry 0% cover 60%');
    const observer = 'IntersectionObserver' in window
      ? new IntersectionObserver(entries => {
        for (const { target, isIntersecting, intersectionRatio } of entries) {
          const section = target.parentElement;
          if (!isIntersecting || intersectionRatio < threshold || preference.matches || !section.dataset.active) continue;
          section.dataset.playing = section.dataset.active;
          observer.unobserve(target);
        }
      }, { threshold })
      : null;

    function clear() {
      observer?.disconnect();
      observer?.takeRecords();
      for (const panel of panels) {
        delete panel.parentElement.dataset.active;
        delete panel.parentElement.dataset.playing;
      }
    }

    function configure() {
      clear();
      if (preference.matches) return;
      const override = scope.dataset.transition;
      for (const panel of panels) {
        const section = panel.parentElement;
        const effect = effects.has(override) ? override : section.dataset.transition;
        if (!effects.has(effect) || effect === 'none') continue;
        if (effect === 'parallax' && scrollMotion) {
          section.dataset.active = effect;
        } else if (observer) {
          section.dataset.active = effect;
          observer.observe(panel);
        }
      }
    }

    const configChanges = new MutationObserver(configure);
    configChanges.observe(scope, { attributes: true, subtree: true, attributeFilter: ['data-transition'] });
    preference.addEventListener('change', configure);
    configure();
    return () => {
      configChanges.disconnect();
      preference.removeEventListener('change', configure);
      clear();
    };
  }, [scopeRef, route]);
}