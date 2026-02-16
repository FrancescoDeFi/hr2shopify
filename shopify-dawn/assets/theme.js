/**
 * Hr2 Theme JavaScript
 * Core theme functionality including selling plans, mobile nav, and utilities
 */

(function() {
  'use strict';

  /**
   * Selling Plan Handler
   * Manages subscription plan selection on product pages
   */
  function updateSellingPlan(wrapper, target) {
    if (!wrapper || !target) return;
    var options = wrapper.querySelectorAll('[data-selling-option]');
    options.forEach(function(option) {
      option.classList.toggle('is-selected', option.contains(target));
    });
    var hidden = wrapper.querySelector('input[name="selling_plan"]');
    if (hidden) {
      var closest = target.closest('[data-selling-option]');
      var plan = closest ? closest.getAttribute('data-selling-plan') : '';
      hidden.value = plan || '';
    }
  }

  document.addEventListener('change', function(event) {
    var target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (!target.matches('input[data-selling-input]')) return;
    var wrapper = target.closest('[data-selling-options]');
    updateSellingPlan(wrapper, target);
  });

  /**
   * Offer Plan Selector
   * Handles the offer/pricing section plan selection
   */
  function initOfferPlanSelector() {
    var plans = Array.from(document.querySelectorAll('.offer-plan'));
    if (!plans.length) return;

    plans.forEach(function(plan) {
      plan.addEventListener('click', function() {
        plans.forEach(function(p) { p.classList.remove('is-selected'); });
        plan.classList.add('is-selected');
        var radio = plan.querySelector('.offer-plan-radio');
        if (radio) radio.checked = true;
      });
    });
  }

  /**
   * PDP Hero Option Selector
   * Handles product page subscription option selection
   */
  function initPDPHeroOptions() {
    var options = Array.from(document.querySelectorAll('.pdp-hero-option'));
    var radios = Array.from(document.querySelectorAll('.pdp-hero-radio'));

    if (!options.length) return;

    function sync() {
      options.forEach(function(opt) {
        var r = opt.querySelector('.pdp-hero-radio');
        opt.classList.toggle('is-selected', !!r && r.checked);
      });
    }

    radios.forEach(function(r) {
      r.addEventListener('change', sync);
    });

    options.forEach(function(opt) {
      opt.addEventListener('click', function() {
        var r = opt.querySelector('.pdp-hero-radio');
        if (r) {
          r.checked = true;
          sync();
        }
      });
    });

    sync();
  }

  /**
   * Mobile Navigation Toggle
   * Handles hamburger menu for mobile devices
   */
  function initMobileNav() {
    var toggle = document.querySelector('[data-mobile-nav-toggle]');
    var nav = document.querySelector('[data-mobile-nav]');
    var overlay = document.querySelector('[data-mobile-nav-overlay]');
    var body = document.body;

    if (!toggle || !nav) return;

    function openNav() {
      nav.classList.add('is-open');
      toggle.classList.add('is-active');
      toggle.setAttribute('aria-expanded', 'true');
      body.classList.add('mobile-nav-open');
      if (overlay) overlay.classList.add('is-visible');
    }

    function closeNav() {
      nav.classList.remove('is-open');
      toggle.classList.remove('is-active');
      toggle.setAttribute('aria-expanded', 'false');
      body.classList.remove('mobile-nav-open');
      if (overlay) overlay.classList.remove('is-visible');
    }

    function toggleNav() {
      if (nav.classList.contains('is-open')) {
        closeNav();
      } else {
        openNav();
      }
    }

    toggle.addEventListener('click', toggleNav);

    if (overlay) {
      overlay.addEventListener('click', closeNav);
    }

    // Close on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        closeNav();
        toggle.focus();
      }
    });

    // Close when clicking nav links
    var navLinks = nav.querySelectorAll('a');
    navLinks.forEach(function(link) {
      link.addEventListener('click', closeNav);
    });
  }

  /**
   * Sticky Navbar
   * Adds scrolled class to navbar on scroll
   */
  function initStickyNavbar() {
    var navbar = document.querySelector('.navbar');
    if (!navbar) return;

    var scrollThreshold = 50;
    var ticking = false;

    function updateNavbar() {
      if (window.scrollY > scrollThreshold) {
        navbar.classList.add('is-scrolled');
      } else {
        navbar.classList.remove('is-scrolled');
      }
      ticking = false;
    }

    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    }, { passive: true });

    // Initial check
    updateNavbar();
  }

  /**
   * Quality Cards Cleanup
   * Removes empty quality cards to prevent layout issues
   */
  function cleanupQualityCards() {
    var cards = Array.from(document.querySelectorAll('.quality-cards .quality-card'));
    cards.forEach(function(card) {
      var hasChildren = card.children && card.children.length > 0;
      var hasText = (card.textContent || '').trim().length > 0;
      if (!hasChildren && !hasText) card.remove();
    });
  }

  /**
   * Smooth Scroll to Anchors
   * Enables smooth scrolling for anchor links
   */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        var href = this.getAttribute('href');
        if (href === '#' || href === '#0') return;

        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          var navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
          var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Update URL without jumping
          history.pushState(null, null, href);
        }
      });
    });
  }

  /**
   * Lazy Load Images
   * Fallback for browsers without native lazy loading
   */
  function initLazyLoad() {
    if ('loading' in HTMLImageElement.prototype) {
      // Native lazy loading supported
      return;
    }

    // Fallback using Intersection Observer
    if ('IntersectionObserver' in window) {
      var lazyImages = document.querySelectorAll('img[loading="lazy"]');
      var imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
            }
            imageObserver.unobserve(img);
          }
        });
      });

      lazyImages.forEach(function(img) {
        imageObserver.observe(img);
      });
    }
  }

  /**
   * Language Switcher
   * Handles locale switching via form submission
   */
  function initLanguageSwitcher() {
    var langLinks = document.querySelectorAll('.nav-lang-link[data-locale]');
    langLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        var locale = this.getAttribute('data-locale');
        if (!locale) return;

        // Create and submit a form to switch locales
        var form = document.createElement('form');
        form.method = 'POST';
        form.action = window.location.pathname;

        var localeInput = document.createElement('input');
        localeInput.type = 'hidden';
        localeInput.name = 'locale_code';
        localeInput.value = locale;

        var returnInput = document.createElement('input');
        returnInput.type = 'hidden';
        returnInput.name = 'return_to';
        returnInput.value = window.location.pathname + window.location.search;

        form.appendChild(localeInput);
        form.appendChild(returnInput);
        document.body.appendChild(form);
        form.submit();
      });
    });
  }

  /**
   * Initialize all theme functionality
   */
  function init() {
    // Initialize selling plan selection on page load
    var wrappers = document.querySelectorAll('[data-selling-options]');
    wrappers.forEach(function(wrapper) {
      var checked = wrapper.querySelector('input[data-selling-input]:checked');
      if (checked) {
        updateSellingPlan(wrapper, checked);
      }
    });

    // Initialize all components
    initOfferPlanSelector();
    initPDPHeroOptions();
    initMobileNav();
    initStickyNavbar();
    cleanupQualityCards();
    initSmoothScroll();
    initLazyLoad();
    initLanguageSwitcher();
  }

  // Run init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose utilities for external use
  window.Hr2Theme = {
    updateSellingPlan: updateSellingPlan,
    initMobileNav: initMobileNav,
    initStickyNavbar: initStickyNavbar
  };
})();
