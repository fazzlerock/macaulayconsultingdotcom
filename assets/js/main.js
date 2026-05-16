/* Macaulay Consulting — main.js */

/* ---- NAV: sticky border on scroll ---- */
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
  const display = document.getElementById('clients-display');
  if (!display) return;

  try {
    const res  = await fetch('clients.json');
    const data = await res.json();

    let html = '';

    /* Queensland Government block */
    const qg = data.queensland_government;
    if (qg && qg.departments && qg.departments.length) {
      const deptList = qg.departments.map(d =>
        `<li style="color:${d.color}">${d.name}</li>`
      ).join('');
      html += `<div class="qg-block">
        <div class="qg-crest">
          <img src="assets/clients/${qg.crest}" alt="${qg.label}">
        </div>
        <div class="qg-departments">
          <ul class="qg-dept-list">${deptList}</ul>
        </div>
      </div>`;
    }

    /* Independent organisations grid */
    const orgs = data.organisations || [];
    if (orgs.length) {
      const tiles = orgs.map(o => {
        if (o.confirmed && o.logo) {
          return `<div class="client-item">
            <img src="assets/clients/${o.logo}" alt="${o.name}" loading="lazy">
          </div>`;
        }
        return `<div class="client-item client-item--placeholder">
          <span>${o.name}</span>
        </div>`;
      }).join('');
      html += `<div id="clients-grid">${tiles}</div>`;
    }

    display.innerHTML = html;

    /* Scroll-based colour reveal — touch devices only (desktop uses :hover) */
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const margin = '-' + Math.round(window.innerHeight * 0.5) + 'px';
      const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) entry.target.classList.add('in-view');
        });
      }, { rootMargin: '0px 0px ' + margin + ' 0px', threshold: 0 });
      display.querySelectorAll('.client-item').forEach(function(el) {
        observer.observe(el);
      });
    }

  } catch (_) {
    const section = document.querySelector('.clients-section');
    if (section) section.hidden = true;
  }
})();

/* ---- FOOTER LAST-UPDATED ---- */
(function () {
  var meta   = document.querySelector('meta[name="last-updated"]');
  var footer = document.querySelector('.footer-bar');
  if (!meta || !footer) return;

  var raw   = meta.getAttribute('content');
  var parts = raw.split('-');
  if (parts.length !== 3) return;

  var months    = ['January','February','March','April','May','June',
                   'July','August','September','October','November','December'];
  var formatted = parseInt(parts[2], 10) + ' ' + months[parseInt(parts[1], 10) - 1] + ' ' + parts[0];

  var span = document.createElement('span');
  span.className   = 'footer-updated';
  span.textContent = 'Updated ' + formatted;
  footer.appendChild(span);
})();

/* ---- FAQ ACCORDION ---- */
(function () {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const btn = item.querySelector('.faq-question');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
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
