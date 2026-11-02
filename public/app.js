(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector('.theme-toggle');
  const menuButton = document.querySelector('.mobile-menu');
  const nav = document.querySelector('.primary-nav');

  themeButton?.addEventListener('click', () => {
    const light = root.dataset.theme !== 'light';
    root.dataset.theme = light ? 'light' : 'dark';
    try { localStorage.setItem('theme', light ? 'light' : 'dark'); } catch (error) { /* storage may be unavailable */ }
    themeButton.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
  });

  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    nav?.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuButton?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }));

  const filterButtons = document.querySelectorAll('.filter-button');
  const projectCards = document.querySelectorAll('.project-list-card');
  const emptyState = document.querySelector('.empty-state');
  filterButtons.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    let visible = 0;
    projectCards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.hidden = !show;
      if (show) visible += 1;
    });
    if (emptyState) emptyState.hidden = visible !== 0;
  }));

  const slides = [...document.querySelectorAll('.slide')];
  if (!slides.length) return;
  let current = 0;
  const count = document.querySelector('#slide-count');
  const dots = document.querySelector('#slide-dots');
  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'slide-dot';
    dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
    dot.addEventListener('click', () => showSlide(index));
    dots?.append(dot);
  });
  const showSlide = index => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === current));
    dots?.querySelectorAll('button').forEach((dot, i) => dot.classList.toggle('active', i === current));
    if (count) count.textContent = `${String(current + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  };
  document.querySelector('#previous-slide')?.addEventListener('click', () => showSlide(current - 1));
  document.querySelector('#next-slide')?.addEventListener('click', () => showSlide(current + 1));
  document.querySelector('#fullscreen')?.addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.querySelector('#presentation').requestFullscreen();
    } catch (error) { /* fullscreen may be blocked by browser policy */ }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === ' ') showSlide(current + 1);
    if (event.key === 'ArrowLeft') showSlide(current - 1);
    if (event.key === 'Escape' && document.fullscreenElement) document.exitFullscreen();
  });
  showSlide(0);
})();
