/* ═══════════════════════════════════════════════════
   Jatin Pal — portfolio scripts
═══════════════════════════════════════════════════ */

/* Mobile menu */
function toggleMobileMenu(force) {
  var menu = document.getElementById('mobile-menu');
  var btn = document.getElementById('hamburger-btn');
  var open = typeof force === 'boolean' ? force : !menu.classList.contains('active');
  menu.classList.toggle('active', open);
  if (btn) {
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
}

(function () {
  'use strict';

  var html = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (e) { return null; }
  }

  /* ──────────────────────────────────────────────
     THEME
  ────────────────────────────────────────────── */
  var toggleBtns = document.querySelectorAll('.theme-toggle');
  var SUN = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
  var MOON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';

  function applyTheme(theme, persist) {
    html.setAttribute('data-theme', theme);
    toggleBtns.forEach(function (btn) {
      btn.innerHTML = theme === 'dark' ? SUN : MOON;
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    });
    if (persist) store('jp-theme', theme);

    var navLogo = document.getElementById('nav-logo-img');
    if (navLogo) navLogo.src = theme === 'dark' ? 'assets/logo/jp-white.webp' : 'assets/logo/jp.webp';

    var anthropicCell = document.getElementById('cell-anthropic');
    if (anthropicCell) {
      var src = theme === 'dark' ? 'assets/logo/anthropic-white.webp' : 'assets/logo/anthropic.webp';
      anthropicCell.dataset.logo = src;
      var img = anthropicCell.querySelector('.logo-img');
      if (img) img.src = src;
    }
  }

  // The inline script in <head> already set data-theme before paint; sync icons/logos.
  applyTheme(html.getAttribute('data-theme') || 'light', false);

  toggleBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
    });
  });

  /* ──────────────────────────────────────────────
     NAVBAR — shrink on scroll + active link
  ────────────────────────────────────────────── */
  var navbar = document.getElementById('navbar');
  var navContainer = document.getElementById('nav-container');
  var navUtilsDesktop = document.getElementById('nav-utils-desktop');
  function onScroll() {
    var scrolled = window.scrollY > 50;
    navbar.classList.toggle('scrolled', scrolled);
    if (navContainer) navContainer.classList.toggle('scrolled', scrolled);
    if (navUtilsDesktop) navUtilsDesktop.classList.toggle('scrolled', scrolled);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var navLinks = Array.from(document.querySelectorAll('.nav-link[data-section]'));
  if ('IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        navLinks.forEach(function (link) {
          var on = link.dataset.section === id;
          link.classList.toggle('active', on);
          if (on) link.setAttribute('aria-current', 'true'); else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('section[id]').forEach(function (s) { sectionObserver.observe(s); });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      var target = id.length > 1 && document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        history.replaceState(null, '', id);
      }
    });
  });

  var hamburger = document.getElementById('hamburger-btn');
  if (hamburger) hamburger.addEventListener('click', function () { toggleMobileMenu(); });
  document.querySelectorAll('#mobile-menu .mobile-link').forEach(function (link) {
    link.addEventListener('click', function () { toggleMobileMenu(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') toggleMobileMenu(false);
  });

  /* ──────────────────────────────────────────────
     DOCUMENT VIEWER (certificates + resume)
  ────────────────────────────────────────────── */
  var modal = document.getElementById('cert-modal');
  var modalImg = document.getElementById('cert-modal-img');
  var modalClose = modal.querySelector('.modal-close-btn');
  var lastFocus = null;

  function openViewer(src, alt) {
    lastFocus = document.activeElement;
    modalImg.src = src;
    modalImg.alt = alt || '';
    modal.hidden = false;
    // next frame so the CSS transition runs
    requestAnimationFrame(function () { modal.classList.add('active'); });
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }

  function closeViewer() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(function () {
      modal.hidden = true;
      modalImg.removeAttribute('src');
    }, reduceMotion ? 0 : 300);
    if (lastFocus) lastFocus.focus();
  }

  document.querySelectorAll('[data-cert]').forEach(function (el) {
    if (el.tagName !== 'BUTTON') {
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      el.setAttribute('aria-label', 'View ' + (el.dataset.certAlt || 'certificate'));
    }
    el.addEventListener('click', function () { openViewer(el.dataset.cert, el.dataset.certAlt); });
    el.addEventListener('keydown', function (e) {
      if (el.tagName !== 'BUTTON' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        openViewer(el.dataset.cert, el.dataset.certAlt);
      }
    });
  });

  modalClose.addEventListener('click', closeViewer);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeViewer(); });
  document.addEventListener('keydown', function (e) {
    if (modal.hidden) return;
    if (e.key === 'Escape') closeViewer();
    if (e.key === 'Tab') { e.preventDefault(); modalClose.focus(); } // single focusable element
  });

  /* ──────────────────────────────────────────────
     COPY EMAIL
  ────────────────────────────────────────────── */
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.dataset.copy;
      var done = function () {
        btn.textContent = 'Copied';
        btn.classList.add('copied');
        setTimeout(function () { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 1600);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () {});
      else {
        var ta = document.createElement('textarea');
        ta.value = text; document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); done(); } catch (e) {}
        ta.remove();
      }
    });
  });

  /* ──────────────────────────────────────────────
     HERO — build name cells (logo → letter morph)
  ────────────────────────────────────────────── */
  var cells = Array.from(document.querySelectorAll('.cell:not(.space-cell)'));
  cells.forEach(function (cell) {
    var img = document.createElement('img');
    img.className = 'logo-img';
    img.src = cell.dataset.logo;
    img.alt = '';
    var letter = document.createElement('span');
    letter.className = 'letter';
    letter.textContent = cell.dataset.letter;
    var ripple = document.createElement('div');
    ripple.className = 'ripple';
    cell.appendChild(img);
    cell.appendChild(letter);
    cell.appendChild(ripple);
  });

  function reveal(id) {
    var el = document.getElementById(id);
    if (el) el.classList.add('visible');
  }

  function enableHover() {
    cells.forEach(function (cell) {
      cell.addEventListener('mouseenter', function () {
        if (cell.classList.contains('show-letter')) cell.classList.add('hovered');
      });
      cell.addEventListener('mouseleave', function () { cell.classList.remove('hovered'); });
    });
  }

  // Reduced motion: show the finished state immediately, no looping.
  if (reduceMotion) {
    cells.forEach(function (c) { c.classList.add('show-letter'); });
    ['greeting', 'subtitle', 'tags', 'cta-row', 'hero-right', 'scroll-hint'].forEach(reveal);
    enableHover();
    return;
  }

  /* Everything except the name is on screen within ~0.8s.
     The name plays its logo → letter morph alongside, not before. */
  setTimeout(function () { reveal('greeting'); }, 100);
  setTimeout(function () { reveal('subtitle'); }, 350);
  setTimeout(function () { reveal('tags'); }, 500);
  setTimeout(function () { reveal('cta-row'); }, 650);
  setTimeout(function () { reveal('hero-right'); }, 450);
  setTimeout(function () { reveal('scroll-hint'); }, 1600);

  var INTRO_DELAY = 250;
  var LOGO_STAGGER = 110;
  var HOLD_LOGOS = 650;
  var MORPH_STAGGER = 90;
  var MORPH_LIMBO = 240;

  cells.forEach(function (cell, i) {
    setTimeout(function () { cell.classList.add('show-logo'); }, INTRO_DELAY + i * LOGO_STAGGER);
  });

  var morphStart = INTRO_DELAY + (cells.length - 1) * LOGO_STAGGER + 350 + HOLD_LOGOS;

  cells.forEach(function (cell, i) {
    setTimeout(function () {
      var ripple = cell.querySelector('.ripple');
      ripple.classList.remove('go');
      void ripple.offsetWidth;
      ripple.classList.add('go');
      cell.classList.remove('show-logo');
      cell.classList.add('morphing');
      setTimeout(function () {
        cell.classList.remove('morphing');
        cell.classList.add('show-letter');
      }, MORPH_LIMBO);
    }, morphStart + i * MORPH_STAGGER);
  });

  var nameDone = morphStart + (cells.length - 1) * MORPH_STAGGER + MORPH_LIMBO + 400;
  setTimeout(enableHover, nameDone);

  /* Idle loop: occasionally flip one letter back to its logo */
  var L_OUT = 800, L_HOLD = 2500, L_MIN_PAUSE = 3000, L_MAX_PAUSE = 5500;
  var lastIdx = -1;

  function runLoop() {
    if (document.hidden) { scheduleLoop(); return; }
    var idx;
    do { idx = Math.floor(Math.random() * cells.length); } while (idx === lastIdx);
    lastIdx = idx;
    var cell = cells[idx];
    if (cell.classList.contains('hovered')) { scheduleLoop(); return; }

    cell.classList.add('loop-speed');
    cell.classList.remove('show-letter');
    cell.classList.add('morphing');
    setTimeout(function () {
      cell.classList.remove('morphing');
      cell.classList.add('show-logo');
      setTimeout(function () {
        cell.classList.remove('show-logo');
        cell.classList.add('morphing');
        setTimeout(function () {
          cell.classList.remove('morphing');
          cell.classList.add('show-letter');
          setTimeout(function () {
            cell.classList.remove('loop-speed');
            scheduleLoop();
          }, L_OUT);
        }, L_OUT);
      }, L_HOLD);
    }, L_OUT);
  }

  function scheduleLoop() {
    setTimeout(runLoop, L_MIN_PAUSE + Math.random() * (L_MAX_PAUSE - L_MIN_PAUSE));
  }

  setTimeout(scheduleLoop, nameDone + 2500);
})();
