/* ==========================================================================
   S. NAVANEETHAN — PORTFOLIO
   Vanilla JavaScript — navigation, smooth scroll, scroll reveal,
   active nav state, mobile menu, contact form.
   ========================================================================== */
(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile navigation ---------- */
  const navToggle = document.getElementById('nav-toggle');
  const siteNav = document.getElementById('site-nav');

  const setMenuOpen = (open) => {
    if (!siteNav || !navToggle) return;
    siteNav.classList.toggle('is-open', open);
    navToggle.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      setMenuOpen(!siteNav.classList.contains('is-open'));
    });
  }

  // Close the mobile menu after clicking a nav link
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  // Close the menu when clicking outside of it
  document.addEventListener('click', (e) => {
    if (!siteNav || !siteNav.classList.contains('is-open')) return;
    if (!siteNav.contains(e.target) && !navToggle.contains(e.target)) {
      setMenuOpen(false);
    }
  });

  // Close the menu when resizing up to desktop width
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024 && siteNav) setMenuOpen(false);
  });

  // Close the menu / release focus on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setMenuOpen(false);
  });

  /* ---------- Header shadow on scroll ---------- */
  const header = document.getElementById('site-header');
  const onScrollHeader = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------- Smooth scrolling (JS-driven, respects CSS scroll-behavior) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      if (prefersReducedMotion) {
        target.scrollIntoView();
      } else {
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - 72,
          behavior: 'smooth',
        });
      }
    });
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback: make everything visible immediately
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Active navigation state ---------- */
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  let activeId = null;

  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeId = entry.target.id;
            navLinks.forEach((link) => {
              link.classList.toggle(
                'is-active',
                link.getAttribute('href') === `#${activeId}`
              );
            });
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach((section) => navObserver.observe(section));
  }

  /* ---------- Contact form validation + mailto ---------- */
  const form = document.getElementById('contact-form');
  const formError = document.getElementById('form-error');

  if (form && formError) {
    const showError = (message) => {
      formError.textContent = message;
      formError.hidden = false;
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.elements.name.value.trim();
      const email = form.elements.email.value.trim();
      const message = form.elements.message.value.trim();

      formError.hidden = true;

      if (!name) {
        showError('Please enter your name.');
        form.elements.name.focus();
        return;
      }

      if (!email) {
        showError('Please enter your email address.');
        form.elements.email.focus();
        return;
      }

      // Basic email pattern
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        showError('Please enter a valid email address.');
        form.elements.email.focus();
        return;
      }

      if (!message) {
        showError('Please enter a short message.');
        form.elements.message.focus();
        return;
      }

      // Compose a mailto link with the message pre-filled
      const subject = encodeURIComponent(`Portfolio message from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
      window.location.href = `mailto:naveenloki20235@gmail.com?subject=${subject}&body=${body}`;

      form.reset();
    });
  }
})();