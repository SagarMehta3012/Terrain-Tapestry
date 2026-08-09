document.querySelectorAll('#year').forEach(el => el.textContent = new Date().getFullYear());

/* ---------- preloader ---------- */
window.addEventListener('load', () => {
  const pre = document.getElementById('preloader');
  if (pre) setTimeout(() => pre.classList.add('done'), 350);
});

/* ---------- mobile nav toggle ---------- */
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('siteNav');
if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));
}

/* ---------- header hide-on-scroll + shadow + progress bar ---------- */
const header = document.getElementById('siteHeader');
const progress = document.getElementById('scrollProgress');
let lastY = window.scrollY;

function onScroll() {
  const y = window.scrollY;
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  if (progress && docH > 0) progress.style.width = `${(y / docH) * 100}%`;

  if (header) {
    header.classList.toggle('scrolled', y > 12);
    if (y > lastY && y > 140) header.classList.add('hide');
    else header.classList.remove('hide');
  }
  lastY = y;

  const toTop = document.getElementById('toTop');
  if (toTop) toTop.classList.toggle('show', y > 600);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const toTopBtn = document.getElementById('toTop');
if (toTopBtn) {
  toTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---------- active nav link on scroll ---------- */
const sections = document.querySelectorAll('main section[id]');
const navLinks = nav ? nav.querySelectorAll('a[href^="#"]') : [];
if (sections.length && navLinks.length) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const link = [...navLinks].find(a => a.getAttribute('href') === `#${entry.target.id}`);
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  sections.forEach(s => navObserver.observe(s));
}

/* ---------- reveal on scroll ---------- */
const revealTargets = document.querySelectorAll('.reveal, .index-grid, .posts');
if (revealTargets.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealTargets.forEach(el => revealObserver.observe(el));
}

/* ---------- animated stat counters ---------- */
const statEls = document.querySelectorAll('.stat .num');
if (statEls.length) {
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10) || 0;
      const span = el.querySelector('span');
      const duration = 1200;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        span.textContent = Math.round(eased * target);
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      statObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  statEls.forEach(el => statObserver.observe(el));
}

/* ---------- magnetic tilt on plates ---------- */
function applyTilt(el, strength = 8) {
  el.addEventListener('mousemove', (e) => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `translateY(-6px) rotateX(${(-y * strength).toFixed(2)}deg) rotateY(${(x * strength).toFixed(2)}deg)`;
  });
  el.addEventListener('mouseleave', () => { el.style.transform = ''; });
}
document.querySelectorAll('.plate').forEach(el => {
  el.style.transformStyle = 'preserve-3d';
  applyTilt(el, 6);
});

/* ---------- contact form -> backend API ---------- */
const form = document.getElementById('contactForm');
if (form) {
  const status = document.getElementById('formStatus');
  const btn = document.getElementById('submitBtn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    btn.disabled = true;
    status.textContent = 'Sending…';
    status.className = 'form-status';

    const payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim(),
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        status.textContent = 'Message sent — thank you. I\'ll reply soon.';
        status.className = 'form-status ok';
        form.reset();
      } else {
        status.textContent = data.error || 'Something went wrong. Please try again.';
        status.className = 'form-status err';
      }
    } catch (err) {
      status.textContent = 'Network error — please try again shortly.';
      status.className = 'form-status err';
    } finally {
      btn.disabled = false;
    }
  });
}
