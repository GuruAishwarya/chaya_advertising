/* ============================================================
   CHAYA GALAXY – MAIN JAVASCRIPT
   Navigation, Animations, Interactions
   ============================================================ */

'use strict';

/* ─── Page Navigation ───────────────────────────────────────── */
function showPage(pageId) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  // Show target page
  const target = document.getElementById('page-' + pageId);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Re-trigger reveal animations for new page
  setTimeout(() => initReveal(), 100);

  // Close mobile menu if open
  closeMobileMenu();
}

function setActive(el) {
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  el.classList.add('active');
}

function scrollToSection(id) {
  setTimeout(() => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 90;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, 200);
}

/* ─── Mobile Menu ───────────────────────────────────────────── */
function toggleMobileMenu() {
  const menu = document.getElementById('navMenu');
  const toggle = document.getElementById('navToggle');
  menu.classList.toggle('open');
  toggle.classList.toggle('open');
}

function closeMobileMenu() {
  const menu = document.getElementById('navMenu');
  const toggle = document.getElementById('navToggle');
  if (menu) menu.classList.remove('open');
  if (toggle) toggle.classList.remove('open');
}

/* Mobile nav-item accordion */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-item').forEach(item => {
    const link = item.querySelector('.nav-link');
    const dropdown = item.querySelector('.dropdown');
    if (dropdown && link) {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          item.classList.toggle('open');
        }
      });
    }
  });
});

/* ─── Navbar Scroll Effect ──────────────────────────────────── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Always scrolled on non-home pages
function updateNavbarState() {
  const homePage = document.getElementById('page-home');
  if (homePage && homePage.classList.contains('active') && window.scrollY < 50) {
    navbar.classList.remove('scrolled');
  } else {
    navbar.classList.add('scrolled');
  }
}

/* Override showPage to handle navbar */
const _origShowPage = showPage;
window.showPage = function(pageId) {
  _origShowPage(pageId);
  setTimeout(updateNavbarState, 10);
};

/* ─── Scroll Reveal Animations ──────────────────────────────── */
function initReveal() {
  const reveals = document.querySelectorAll('.page.active .reveal:not(.visible)');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }
}

/* ─── Counter Animation ─────────────────────────────────────── */
function animateCounters() {
  const counters = document.querySelectorAll('.page.active [data-target]');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const update = () => {
      current += step;
      if (current < target) {
        counter.textContent = Math.floor(current) + '+';
        requestAnimationFrame(update);
      } else {
        counter.textContent = target + '+';
      }
    };
    requestAnimationFrame(update);
  });
}

/* ─── Hero Particles ────────────────────────────────────────── */
function createParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  for (let i = 0; i < 25; i++) {
    const particle = document.createElement('div');
    particle.className = 'hero-particle';
    particle.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation-delay: ${Math.random() * 8}s;
      animation-duration: ${6 + Math.random() * 6}s;
      width: ${2 + Math.random() * 3}px;
      height: ${2 + Math.random() * 3}px;
    `;
    container.appendChild(particle);
  }
}

/* ─── Portfolio Filter ──────────────────────────────────────── */
function filterPortfolio(category, btn) {
  // Update active button
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // Filter items
  const items = document.querySelectorAll('.portfolio-item');
  items.forEach(item => {
    if (category === 'all' || item.getAttribute('data-cat') === category) {
      item.style.display = 'block';
      item.style.animation = 'fadeIn 0.4s ease both';
    } else {
      item.style.display = 'none';
    }
  });
}

/* ─── Contact Form ──────────────────────────────────────────── */
function submitForm() {
  const fname   = document.getElementById('fname');
  const lname   = document.getElementById('lname');
  const email   = document.getElementById('email');
  const service = document.getElementById('service');
  const message = document.getElementById('message');

  // Simple validation
  const required = [fname, lname, email, service, message];
  let valid = true;

  required.forEach(el => {
    if (!el || !el.value.trim()) {
      valid = false;
      if (el) {
        el.style.borderColor = '#e74c3c';
        el.style.boxShadow = '0 0 0 4px rgba(231,76,60,.1)';
        setTimeout(() => {
          el.style.borderColor = '';
          el.style.boxShadow = '';
        }, 3000);
      }
    }
  });

  if (!valid) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email.value)) {
    email.style.borderColor = '#e74c3c';
    showToast('Please enter a valid email address.', 'error');
    return;
  }

  // Show success
  document.getElementById('contactForm').style.display = 'none';
  document.getElementById('formSuccess').style.display = 'block';
}

function resetForm() {
  document.getElementById('contactForm').style.display = 'block';
  document.getElementById('formSuccess').style.display = 'none';

  // Clear fields
  ['fname','lname','email','phone','company','service','message'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

/* ─── Toast Notification ────────────────────────────────────── */
function showToast(msg, type = 'info') {
  const existing = document.getElementById('toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.style.cssText = `
    position: fixed;
    bottom: 32px;
    right: 32px;
    padding: 16px 24px;
    border-radius: 12px;
    font-family: 'Inter', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    color: white;
    background: ${type === 'error' ? '#e74c3c' : '#2ecc71'};
    box-shadow: 0 8px 24px rgba(0,0,0,.2);
    z-index: 99999;
    animation: fadeInUp 0.3s ease;
    max-width: 320px;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ─── Smooth Hover Effects ──────────────────────────────────── */
function addHoverEffects() {
  // Add tilt effect to service cards (subtle)
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-8px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ─── Typing Effect for Hero ────────────────────────────────── */
function typeEffect() {
  const words = ['Results', 'Impact', 'Growth', 'Success'];
  const highlight = document.querySelector('.hero-title .highlight');
  if (!highlight) return;

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const originalText = highlight.textContent;

  function type() {
    const current = words[wordIndex];

    if (!isDeleting) {
      highlight.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        setTimeout(() => { isDeleting = true; type(); }, 2000);
        return;
      }
    } else {
      highlight.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    }

    setTimeout(type, isDeleting ? 60 : 100);
  }

  // Start after initial delay
  setTimeout(type, 3000);
}

/* ─── Active Nav Link on Page Switch ───────────────────────── */
const pageNavMap = {
  'home':      0,
  'agency':    1,
  'clients':   2,
  'portfolio': 3,
  'careers':   4,
  'contact':   5,
};

const _finalShowPage = window.showPage;
window.showPage = function(pageId) {
  _finalShowPage(pageId);
  // Update nav active state
  const navLinks = document.querySelectorAll('#navMenu > .nav-item > .nav-link');
  const index = pageNavMap[pageId];
  navLinks.forEach((l, i) => {
    l.classList.toggle('active', i === index);
  });
};

/* ─── Initialize ────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Initial navbar state
  navbar.classList.remove('scrolled');

  // Start particles
  createParticles();

  // Counter animation (triggered by observer)
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounters();
        statsObserver.disconnect();
      }
    }, { threshold: 0.5 });
    statsObserver.observe(heroStats);
  } else {
    animateCounters();
  }

  // Reveal animations
  initReveal();

  // Hover effects
  addHoverEffects();

  // Typing effect
  typeEffect();

  // Smooth input focus
  document.querySelectorAll('input, textarea, select').forEach(el => {
    el.addEventListener('focus', () => {
      el.style.borderColor = 'var(--gold)';
    });
    el.addEventListener('blur', () => {
      el.style.borderColor = '';
    });
  });

  // Interactive ripple on hero visual click
  const heroVisual = document.getElementById('heroVisualInner');
  if (heroVisual) {
    heroVisual.style.cursor = 'pointer';
    heroVisual.addEventListener('click', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('div');
      ripple.className = 'hero-click-ripple';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      heroVisual.appendChild(ripple);

      setTimeout(() => ripple.remove(), 950);
    });
  }

  // Boot client marquee
  initClientMarquee();
});

/* ═══════════════════════════════════════════════════════════════
   INTERACTIVE CLIENT MARQUEE
   ─ Dual-row infinite scroll (left / right)
   ─ Hover to pause
   ─ Drag to scroll
   ─ Floating tooltip
   ─ Glow + shimmer on each card
═══════════════════════════════════════════════════════════════ */

const CLIENT_DATA = [
  { name: 'Hinduja Group',    initials: 'HG', industry: 'Conglomerate',     color: '#1a3a5c' },
  { name: 'Sun Pharma',       initials: 'SP', industry: 'Pharmaceuticals',  color: '#0d5c3a' },
  { name: 'Mahindra',         initials: 'MH', industry: 'Automotive',       color: '#8b1a1a' },
  { name: 'BSNL',             initials: 'BN', industry: 'Telecom',          color: '#1a4a8b' },
  { name: 'TVS Motors',       initials: 'TV', industry: 'Automotive',       color: '#5c1a7a' },
  { name: 'Piramal Group',    initials: 'PG', industry: 'Healthcare',       color: '#0d4a5c' },
  { name: 'Apollo Hospitals', initials: 'AH', industry: 'Healthcare',       color: '#1a5c3a' },
  { name: 'Tata Projects',    initials: 'TP', industry: 'Infrastructure',   color: '#1a2a6c' },
  { name: 'Reliance Retail',  initials: 'RR', industry: 'Retail',           color: '#5c3a1a' },
  { name: 'Sify Technologies',initials: 'SF', industry: 'Technology',       color: '#1a4c5c' },
  { name: 'IDBI Bank',        initials: 'IB', industry: 'Banking',          color: '#1a1a5c' },
  { name: 'Nandini Foods',    initials: 'NF', industry: 'FMCG',             color: '#4a5c1a' },
  { name: 'Saravana Stores',  initials: 'SK', industry: 'Retail',           color: '#5c1a3a' },
  { name: 'Ceat Tyres',       initials: 'CT', industry: 'Manufacturing',    color: '#3a3a1a' },
  { name: 'VGN Group',        initials: 'VG', industry: 'Real Estate',      color: '#2a1a5c' },
  { name: 'Bajaj Finance',    initials: 'BJ', industry: 'Finance',          color: '#5c4a1a' },
  { name: 'Apollo Tyres',     initials: 'AT', industry: 'Manufacturing',    color: '#1a5c5c' },
  { name: 'Sundaram Finance', initials: 'SD', industry: 'Finance',          color: '#3a1a4c' },
];

function buildMarqueeCard(client) {
  const card = document.createElement('div');
  card.className = 'marquee-logo-card';
  card.setAttribute('data-client', client.name);
  card.setAttribute('data-industry', client.industry);

  card.innerHTML = `
    <div class="mlc-icon" style="background: linear-gradient(135deg, ${client.color}, ${client.color}cc);">
      ${client.initials}
    </div>
    <div class="mlc-name">${client.name}</div>
    <div class="mlc-tag">${client.industry}</div>
  `;
  return card;
}

function populateTrack(trackEl, clients) {
  // Build 2 copies for seamless infinite loop
  [1, 2].forEach(() => {
    clients.forEach(c => {
      trackEl.appendChild(buildMarqueeCard(c));
    });
  });
}

function initClientMarquee() {
  const track1 = document.getElementById('marqueeTrack1');
  const track2 = document.getElementById('marqueeTrack2');
  if (!track1 || !track2) return;

  // Distribute clients across two rows
  const row1Clients = CLIENT_DATA.slice(0, 9);
  const row2Clients = CLIENT_DATA.slice(9).concat(CLIENT_DATA.slice(0, 9));

  populateTrack(track1, row1Clients);
  populateTrack(track2, row2Clients);

  // Tooltip
  const tooltip = document.getElementById('clientTooltip');

  // Attach interactions to every card
  document.querySelectorAll('.marquee-logo-card').forEach(card => {
    const name     = card.getAttribute('data-client');
    const industry = card.getAttribute('data-industry');

    // Tooltip on mousemove
    card.addEventListener('mouseenter', () => {
      if (!tooltip) return;
      tooltip.innerHTML = `<strong>${name}</strong>${industry}`;
      tooltip.classList.add('visible');
    });
    card.addEventListener('mousemove', (e) => {
      if (!tooltip) return;
      tooltip.style.left = (e.clientX + 16) + 'px';
      tooltip.style.top  = (e.clientY - 10) + 'px';
    });
    card.addEventListener('mouseleave', () => {
      if (tooltip) tooltip.classList.remove('visible');
    });

    // Click navigates to clients page
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!card.closest('.marquee-row').classList.contains('is-dragging')) {
        showPage('clients');
        // Highlight the page nav link
        const navLinks = document.querySelectorAll('#navMenu > .nav-item > .nav-link');
        navLinks.forEach((l, i) => l.classList.toggle('active', i === 2));
      }
    });
  });

  // Hover-to-pause on each row
  ['marqueeRow1', 'marqueeRow2'].forEach(rowId => {
    const row = document.getElementById(rowId);
    if (!row) return;
    row.addEventListener('mouseenter', () => row.classList.add('is-paused'));
    row.addEventListener('mouseleave', () => row.classList.remove('is-paused'));
  });

  // Drag-to-scroll for each row
  ['marqueeRow1', 'marqueeRow2'].forEach(rowId => {
    setupDragScroll(rowId);
  });
}

function setupDragScroll(rowId) {
  const row   = document.getElementById(rowId);
  const track = row ? row.querySelector('.marquee-track') : null;
  if (!row || !track) return;

  let isDragging   = false;
  let startX       = 0;
  let dragOffset   = 0;
  let lastX        = 0;
  let velocity     = 0;
  let animFrame    = null;

  // Pause animation while dragging
  function pauseAnim()  { track.style.animationPlayState = 'paused'; }
  function resumeAnim() { track.style.animationPlayState = ''; }

  // Get current translate from animation
  function getCurrentTranslate() {
    const style = window.getComputedStyle(track);
    const matrix = new DOMMatrix(style.transform);
    return matrix.m41; // translateX value
  }

  row.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    isDragging  = true;
    startX      = e.clientX;
    lastX       = e.clientX;
    velocity    = 0;
    dragOffset  = getCurrentTranslate();
    pauseAnim();
    row.classList.add('is-paused', 'is-dragging');
    track.style.transform = `translateX(${dragOffset}px)`;
    cancelAnimationFrame(animFrame);
    e.preventDefault();
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    velocity = e.clientX - lastX;
    lastX    = e.clientX;
    let newX = dragOffset + dx;
    // Clamp within track width
    const halfW = track.scrollWidth / 2;
    newX = ((newX % halfW) + halfW) % halfW - halfW;
    track.style.transform = `translateX(${newX}px)`;
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    row.classList.remove('is-dragging');

    // Momentum glide
    let pos = getCurrentTranslate();
    function glide() {
      velocity *= 0.92;
      pos += velocity;
      const halfW = track.scrollWidth / 2;
      pos = ((pos % halfW) + halfW) % halfW - halfW;
      track.style.transform = `translateX(${pos}px)`;
      if (Math.abs(velocity) > 0.4) {
        animFrame = requestAnimationFrame(glide);
      } else {
        // Hand back to CSS animation
        track.style.transform = '';
        row.classList.remove('is-paused');
        resumeAnim();
      }
    }
    animFrame = requestAnimationFrame(glide);
  });

  // Touch support
  row.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
    lastX  = startX;
    dragOffset = getCurrentTranslate();
    pauseAnim();
    row.classList.add('is-paused', 'is-dragging');
    track.style.transform = `translateX(${dragOffset}px)`;
  }, { passive: true });

  row.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const dx = e.touches[0].clientX - startX;
    velocity = e.touches[0].clientX - lastX;
    lastX = e.touches[0].clientX;
    let newX = dragOffset + dx;
    const halfW = track.scrollWidth / 2;
    newX = ((newX % halfW) + halfW) % halfW - halfW;
    track.style.transform = `translateX(${newX}px)`;
  }, { passive: true });

  row.addEventListener('touchend', () => {
    isDragging = false;
    row.classList.remove('is-dragging');
    let pos = getCurrentTranslate();
    function glide() {
      velocity *= 0.9;
      pos += velocity;
      const halfW = track.scrollWidth / 2;
      pos = ((pos % halfW) + halfW) % halfW - halfW;
      track.style.transform = `translateX(${pos}px)`;
      if (Math.abs(velocity) > 0.5) {
        animFrame = requestAnimationFrame(glide);
      } else {
        track.style.transform = '';
        row.classList.remove('is-paused');
        resumeAnim();
      }
    }
    animFrame = requestAnimationFrame(glide);
  });
}

