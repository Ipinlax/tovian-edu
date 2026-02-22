// ── NAVBAR SCROLL ──
const navbar = document.getElementById('navbar');
const floatingWa = document.getElementById('floatingWa');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  floatingWa.classList.toggle('visible', window.scrollY > 400);
});

// ── MOBILE NAV ──
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Close nav when clicking outside
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    navLinks.classList.remove('open');
  }
});

// ── SCROLL REVEAL ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── TESTIMONIAL SLIDER ──
const track = document.getElementById('testiTrack');
const dotsContainer = document.getElementById('testiDots');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const cards = Array.from(track.querySelectorAll('.testi-card'));

let currentIndex = 0;
let visibleCount = getVisibleCount();

function getVisibleCount() {
  if (window.innerWidth <= 768) return 1;
  if (window.innerWidth <= 960) return 2;
  return 3;
}

function buildDots() {
  dotsContainer.innerHTML = '';
  const total = Math.ceil(cards.length / visibleCount);
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === currentIndex ? ' active' : '');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  }
}

function updateDots() {
  dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentIndex);
  });
}

function goTo(index) {
  const maxIndex = Math.ceil(cards.length / visibleCount) - 1;
  currentIndex = Math.max(0, Math.min(index, maxIndex));
  const cardWidth = cards[0].offsetWidth + 24;
  track.style.transform = `translateX(-${currentIndex * visibleCount * cardWidth}px)`;
  updateDots();
}

prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
nextBtn.addEventListener('click', () => {
  const maxIndex = Math.ceil(cards.length / visibleCount) - 1;
  goTo(currentIndex >= maxIndex ? 0 : currentIndex + 1);
});

// Auto-play
let autoplay = setInterval(() => {
  const maxIndex = Math.ceil(cards.length / visibleCount) - 1;
  goTo(currentIndex >= maxIndex ? 0 : currentIndex + 1);
}, 5500);

[track, prevBtn, nextBtn].forEach(el => {
  el.addEventListener('mouseenter', () => clearInterval(autoplay));
  el.addEventListener('mouseleave', () => {
    autoplay = setInterval(() => {
      const maxIndex = Math.ceil(cards.length / visibleCount) - 1;
      goTo(currentIndex >= maxIndex ? 0 : currentIndex + 1);
    }, 5500);
  });
});

window.addEventListener('resize', () => {
  visibleCount = getVisibleCount();
  currentIndex = 0;
  buildDots();
  goTo(0);
});

buildDots();

// ── BOOKING FORM ──
const form = document.getElementById('bookingForm');
const formSuccess = document.getElementById('formSuccess');

// Set minimum date
const dateInput = document.getElementById('date');
if (dateInput) {
  dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
}

form.addEventListener('submit', async (e) => {
  // If Formspree ID is not yet set up, handle locally
  if (form.action.includes('YOUR_FORM_ID')) {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    setTimeout(() => {
      form.style.display = 'none';
      formSuccess.classList.add('show');
    }, 1400);
    return;
  }
  // Otherwise let Formspree handle the submission naturally
  // (don't preventDefault so the form posts to Formspree)
  const btn = form.querySelector('[type="submit"]');
  btn.textContent = 'Sending...';
  btn.disabled = true;
});

// ── SMOOTH ACTIVE NAV ──
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        const isActive = a.getAttribute('href') === `#${id}`;
        if (!a.classList.contains('nav-cta')) {
          a.style.color = isActive ? 'var(--green)' : '';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ── COUNTER ANIMATION ──
function animateCounter(el, target, suffix = '') {
  const duration = 2000;
  const start = performance.now();
  const isPlus = suffix === '+';

  function update(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = current + (isPlus ? '+' : suffix);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statEls = entry.target.querySelectorAll('.stat span');
      statEls.forEach(span => {
        const text = span.textContent;
        if (text.includes('50+')) animateCounter(span, 50, '+');
        else if (text.includes('96%')) animateCounter(span, 96, '%');
        else if (text.includes('5+')) animateCounter(span, 5, '+');
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);
