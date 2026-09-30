function openCertModal(url) {
  document.getElementById('cert-modal-iframe').src = url;
  document.getElementById('cert-modal').classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent scrolling in background
}

function closeCertModal() {
  document.getElementById('cert-modal').classList.remove('active');
  document.getElementById('cert-modal-iframe').src = '';
  document.body.style.overflow = '';
}

// Close modal when clicking outside the iframe
document.getElementById('cert-modal').addEventListener('click', function(e) {
  if (e.target === this) {
    closeCertModal();
  }
});

// Close modal on Escape key press
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && document.getElementById('cert-modal').classList.contains('active')) {
    closeCertModal();
  }
});

function toggleMobileMenu() {
  var menu = document.getElementById('mobile-menu');
  if (menu.classList.contains('active')) {
    menu.classList.remove('active');
  } else {
    menu.classList.add('active');
  }
}

(function () {
  'use strict';

  /* ──────────────────────────────────────────────
     THEME SYSTEM
  ────────────────────────────────────────────── */
  var html = document.documentElement;
  var toggleBtns = document.querySelectorAll('.theme-toggle');

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    var iconHtml = theme === 'dark' 
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>' 
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
    toggleBtns.forEach(function(btn) { btn.innerHTML = iconHtml; });

    localStorage.setItem('jp-theme', theme);
    var navLogo = document.getElementById('nav-logo-img');
    if (navLogo) navLogo.src = theme === 'dark' ? 'public/logo/jp-white.webp' : 'public/logo/jp.webp';

    var anthropicCell = document.getElementById('cell-1');
    if (anthropicCell) {
      var anthropicLogoSrc = theme === 'dark' ? 'public/logo/anthropic-white.webp' : 'public/logo/anthropic.webp';
      anthropicCell.dataset.logo = anthropicLogoSrc;
      var anthropicImg = anthropicCell.querySelector('.logo-img');
      if (anthropicImg) anthropicImg.src = anthropicLogoSrc;
    }
  }

  var saved = localStorage.getItem('jp-theme');
  var preferred = saved ? saved : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(preferred);

  toggleBtns.forEach(function(btn) {
    btn.addEventListener('click', function () {
      applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  });

  /* ──────────────────────────────────────────────
     NAVBAR SCROLL SHRINK
  ────────────────────────────────────────────── */
  var navbar = document.getElementById('navbar');
  var navContainer = document.getElementById('nav-container');
  var navUtilsDesktop = document.getElementById('nav-utils-desktop');
  window.addEventListener('scroll', function () {
    var scrolled = window.scrollY > 50;
    navbar.classList.toggle('scrolled', scrolled);
    if (navContainer) navContainer.classList.toggle('scrolled', scrolled);
    if (navUtilsDesktop) navUtilsDesktop.classList.toggle('scrolled', scrolled);
  }, { passive: true });

  /* ──────────────────────────────────────────────
     NAVBAR — active link via IntersectionObserver
  ────────────────────────────────────────────── */
  var navLinks = Array.from(document.querySelectorAll('.nav-link[data-section]'));
  var sections = Array.from(document.querySelectorAll('section[id]'));

  if ('IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          navLinks.forEach(function (link) {
            link.classList.toggle('active', link.dataset.section === id);
          });
        }
      });
    }, { threshold: 0.35, rootMargin: '-84px 0px 0px 0px' });

    sections.forEach(function (s) { sectionObserver.observe(s); });
  }

  /* Smooth scroll for all internal links */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ──────────────────────────────────────────────
     HERO — build cells
  ────────────────────────────────────────────── */
  var cells = Array.from(document.querySelectorAll('.cell:not(.space-cell)'));

  cells.forEach(function (cell) {
    var img = document.createElement('img');
    img.className = 'logo-img';
    img.src = cell.dataset.logo;
    img.alt = cell.dataset.letter;

    var lEl = document.createElement('span');
    lEl.className = 'letter';
    lEl.textContent = cell.dataset.letter;

    var ripple = document.createElement('div');
    ripple.className = 'ripple';

    cell.appendChild(img);
    cell.appendChild(lEl);
    cell.appendChild(ripple);
  });

  /* ──────────────────────────────────────────────
     HERO ANIMATION TIMING
  ────────────────────────────────────────────── */
  var INTRO_DELAY = 400;
  var LOGO_STAGGER = 170;
  var HOLD_LOGOS = 1100;
  var MORPH_STAGGER = 130;
  var MORPH_LIMBO = 280;
  var AFTER_NAME = 650;

  setTimeout(function () {
    document.getElementById('greeting').classList.add('visible');
  }, 180);

  cells.forEach(function (cell, i) {
    setTimeout(function () { cell.classList.add('show-logo'); },
      INTRO_DELAY + i * LOGO_STAGGER);
  });

  var morphStart = INTRO_DELAY + (cells.length - 1) * LOGO_STAGGER + 400 + HOLD_LOGOS;

  cells.forEach(function (cell, i) {
    var t = morphStart + i * MORPH_STAGGER;
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
    }, t);
  });

  var lastMorphEnd = morphStart + (cells.length - 1) * MORPH_STAGGER + MORPH_LIMBO + 400;

  setTimeout(function () {
    document.getElementById('subtitle').classList.add('visible');
    setTimeout(function () {
      document.getElementById('tags').classList.add('visible');
    }, 380);
  }, lastMorphEnd + AFTER_NAME);

  var SHIFT_DELAY = lastMorphEnd + AFTER_NAME + 880;

  setTimeout(function () {
    var heroRight = document.getElementById('hero-right');
    heroRight.setAttribute('aria-hidden', 'false');
    heroRight.classList.add('visible');
    setTimeout(function () {
      document.getElementById('scroll-hint').classList.add('visible');
    }, 800);
  }, SHIFT_DELAY);

  setTimeout(function () {
    cells.forEach(function (cell) {
      cell.addEventListener('mouseenter', function () {
        if (cell.classList.contains('show-letter')) cell.classList.add('hovered');
      });
      cell.addEventListener('mouseleave', function () {
        cell.classList.remove('hovered');
      });
    });
  }, SHIFT_DELAY + 500);

  var LOOP_START = SHIFT_DELAY + 2200;
  var L_MORPH_OUT = 600;
  var L_LIMBO = 200;
  var L_LOGO_IN = 700;
  var L_LOGO_HOLD = 1800;
  var L_LOGO_OUT = 600;
  var L_LIMBO2 = 200;
  var L_LETTER_IN = 700;
  var L_MIN_PAUSE = 2500;
  var L_MAX_PAUSE = 4500;
  var lastLoopIdx = -1;

  function runLoop() {
    var idx;
    do { idx = Math.floor(Math.random() * cells.length); }
    while (idx === lastLoopIdx);
    lastLoopIdx = idx;

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
          }, L_LETTER_IN + 100);

        }, L_LIMBO2 + L_LOGO_OUT);

      }, L_LOGO_HOLD + L_LOGO_IN);

    }, L_MORPH_OUT + L_LIMBO);
  }

  function scheduleLoop() {
    var pause = L_MIN_PAUSE + Math.random() * (L_MAX_PAUSE - L_MIN_PAUSE);
    setTimeout(runLoop, pause);
  }

  setTimeout(scheduleLoop, LOOP_START);

})();
