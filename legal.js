(() => {
  const progress = document.querySelector('.legal-progress');
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = Array.from(document.querySelectorAll('.legal-reveal'));
  let raf = null;

  const revealVisible = () => {
    const limit = window.innerHeight * .96;
    reveals.forEach(el => {
      if (el.classList.contains('is-visible')) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < limit && rect.bottom > 0) el.classList.add('is-visible');
    });
  };

  const updateProgress = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const ratio = Math.max(0, Math.min(1, window.scrollY / max));
    if (progress) progress.style.transform = `scaleX(${ratio})`;
    revealVisible();
    raf = null;
  };
  const onScroll = () => {
    if (!raf) raf = requestAnimationFrame(updateProgress);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  updateProgress();

  if (reduced || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -7% 0px' });
    reveals.forEach(el => revealObserver.observe(el));
  }
  revealVisible();
  window.setTimeout(() => reveals.forEach(el => el.classList.add('is-visible')), 2200);

  const tocLinks = Array.from(document.querySelectorAll('.legal-toc a[href^="#"]'));
  const sections = tocLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        tocLinks.forEach(link => link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { threshold: 0.05, rootMargin: '-24% 0px -62% 0px' });
    sections.forEach(section => sectionObserver.observe(section));
  }
})();
