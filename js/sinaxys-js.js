/* =========================================================
   SINAXYS DESIGN SYSTEM — Script base
   Estrutura modular para header, tabs, reveal e analytics
   ========================================================= */

/* ===== Helper functions ===== */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
const setExp = (el, v) => el && el.setAttribute('aria-expanded', v ? 'true' : 'false');

/* ===== HEADER E MENU MOBILE ===== */
(function() {
  const header = $('.header-sx');
  const hamb = $('#header-sx-hamb');
  const mnav = $('#header-sx-mnav');
  const backdrop = $('#header-sx-backdrop');

  function updateHeader() {
    if (!header) return;
    const h = header.offsetHeight || 64;
    document.documentElement.style.setProperty('--hx-h', h + 'px');
    header.classList.toggle('scrolled', window.scrollY > 6);
  }

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
  window.addEventListener('resize', updateHeader);

  // Dropdowns de desktop
  $$('.header-sx__dropdown').forEach(dd => {
    const btn = $('button', dd);
    const panel = $('.header-sx__drop-panel', dd);
    if (!btn || !panel) return;
    let t;
    const open = () => { dd.classList.add('open'); setExp(btn, true); };
    const close = () => { dd.classList.remove('open'); setExp(btn, false); };
    dd.addEventListener('mouseenter', () => { clearTimeout(t); open(); });
    dd.addEventListener('mouseleave', () => { t = setTimeout(close, 120); });
    btn.addEventListener('click', e => {
      e.stopPropagation();
      dd.classList.toggle('open');
      setExp(btn, dd.classList.contains('open'));
    });
    document.addEventListener('click', e => {
      if (!dd.contains(e.target)) close();
    });
  });

  // Menu mobile
  if (hamb && mnav && backdrop) {
    const lock = on => document.documentElement.style.overflow = on ? 'hidden' : '';
    const open = () => {
      mnav.classList.add('open');
      setExp(hamb, true);
      backdrop.classList.add('show');
      backdrop.hidden = false;
      lock(true);
    };
    const close = () => {
      mnav.classList.remove('open');
      setExp(hamb, false);
      backdrop.classList.remove('show');
      setTimeout(() => backdrop.hidden = true, 200);
      lock(false);
    };

    hamb.addEventListener('click', () => mnav.classList.contains('open') ? close() : open());
    backdrop.addEventListener('click', close);
    window.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

    $$('.header-sx__mnav-btn').forEach(btn => {
      const box = $('#header-sx-mdd-' + btn.dataset.mdd);
      if (!box) return;
      btn.addEventListener('click', () => {
        const show = box.hasAttribute('hidden');
        box.toggleAttribute('hidden', !show);
        setExp(btn, show);
      });
    });
  }
})();

/* ===== TABS (Gestor / Profissional) ===== */
(function() {
  const tabs = $$('.sxv-tab');
  const panes = $$('.sxv-pane');
  if (!tabs.length) return;

  document.documentElement.setAttribute('data-mode', 'prof');

  function activate(btn) {
    tabs.forEach(x => {
      x.classList.remove('is-active');
      x.setAttribute('aria-selected', 'false');
    });
    panes.forEach(p => { p.hidden = true; });

    btn.classList.add('is-active');
    btn.setAttribute('aria-selected', 'true');
    const pane = $('#' + btn.getAttribute('aria-controls'));
    if (pane) pane.hidden = false;

    document.documentElement.setAttribute('data-mode', btn.id === 'tab-gestor' ? 'gestor' : 'prof');
  }

  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activate(t));
    t.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const dir = e.key === 'ArrowRight' ? 1 : -1;
        const next = (i + dir + tabs.length) % tabs.length;
        tabs[next].focus();
        activate(tabs[next]);
      }
    });
  });
})();

/* ===== ANIMAÇÕES DE REVEAL ===== */
(function() {
  const elements = $$('.reveal, .sxv-metric, .sxv-card');

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.18 });

    elements.forEach(el => io.observe(el));
  } else {
    elements.forEach(el => el.classList.add('in'));
  }
})();

/* ===== ANALYTICS (GA4 / DataLayer) ===== */
(function() {
  $$('.sx-btn, .case-link-gest, .case-link-prof').forEach(el => {
    el.addEventListener('click', () => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'sx_click',
        label: el.textContent.trim(),
        href: el.getAttribute('href') || ''
      });
    }, { passive: true });
  });
})();