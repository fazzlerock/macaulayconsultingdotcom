/* Macaulay Consulting — main.js */

/* ---- NAV: sticky shadow ---- */
const navEl = document.querySelector('.site-nav');
if (navEl) {
  window.addEventListener('scroll', () => {
    navEl.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* ---- NAV: mobile hamburger ---- */
const hamburger = document.querySelector('.nav-hamburger');
const mobileNav = document.querySelector('.nav-mobile');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    hamburger.setAttribute('aria-expanded', open);
  });

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.focus();
    }
  });
}

/* ---- TESTIMONIAL CAROUSEL ---- */
(function () {
  const carousel = document.querySelector('.t-carousel');
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll('.t-slide'));
  const dots   = Array.from(carousel.querySelectorAll('.t-dot'));
  if (!slides.length) return;

  let current = 0;
  let timer;

  function goTo(n) {
    slides[current].classList.remove('active');
    dots[current] && dots[current].classList.remove('active');
    current = ((n % slides.length) + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current] && dots[current].classList.add('active');
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 6500);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); startTimer(); });
  });

  goTo(0);
  startTimer();

  /* Pause on hover / focus */
  carousel.addEventListener('mouseenter', () => clearInterval(timer));
  carousel.addEventListener('mouseleave', startTimer);
  carousel.addEventListener('focusin',  () => clearInterval(timer));
  carousel.addEventListener('focusout', startTimer);
})();

/* ---- CLIENTS ---- */
(async function renderClients() {
  const grid = document.getElementById('clients-grid');
  if (!grid) return;

  try {
    const res     = await fetch('/clients.json');
    const clients = await res.json();

    grid.innerHTML = clients.map(client => {
      if (client.confirmed && client.logo) {
        return `<div class="client-item">
          <img src="/assets/clients/${client.logo}" alt="${client.name}" loading="lazy">
        </div>`;
      }
      return `<div class="client-item client-item--placeholder">
        <span>${client.name}</span>
      </div>`;
    }).join('');
  } catch (_) {
    /* Hide the whole section gracefully if fetch fails */
    const section = document.querySelector('.clients-section');
    if (section) section.hidden = true;
  }
})();

/* ---- SCROLL REVEAL ---- */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

  els.forEach(el => observer.observe(el));
})();
