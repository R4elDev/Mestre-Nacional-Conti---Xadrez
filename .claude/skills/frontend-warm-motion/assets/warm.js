(() => {
  const artPanels = document.querySelectorAll('[data-motion-scope] > section > .fw-art');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const scrollMotion = CSS.supports('animation-timeline: view()')
    && CSS.supports('animation-range: entry 0% cover 60%');
  const effects = new Set(['none', 'circle', 'wipe', 'curtain', 'parallax', 'slide-scale', 'marquee', 'morph']);
  const threshold = 0.25;

  const observer = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
      for (const { target, isIntersecting, intersectionRatio } of entries) {
        if (!isIntersecting || intersectionRatio < threshold || reducedMotion.matches) continue;
        const section = target.parentElement;
        section.dataset.playing = section.dataset.active;
        observer.unobserve(target);
      }
    }, { threshold })
    : null;

  function configureMotion() {
    observer?.disconnect();
    observer?.takeRecords();

    for (const art of artPanels) {
      const section = art.parentElement;
      delete section.dataset.playing;
      delete section.dataset.active;

      const override = section.parentElement.dataset.transition;
      const effect = effects.has(override) ? override : section.dataset.transition;
      if (reducedMotion.matches || !effects.has(effect) || effect === 'none') continue;

      if (effect === 'parallax' && scrollMotion) {
        section.dataset.active = effect;
      } else if (observer) {
        section.dataset.active = effect;
        observer.observe(art);
      }
    }
  }

  reducedMotion.addEventListener('change', configureMotion);
  document.addEventListener('fw-motion-change', configureMotion);
  configureMotion();
})();