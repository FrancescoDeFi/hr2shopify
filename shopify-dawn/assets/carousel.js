/**
 * Carousel Component
 * Handles product image carousel with auto-advance and touch support
 */

(function() {
  'use strict';

  /**
   * Initialize PDP hero carousel
   */
  function initPDPCarousel() {
    var carousel = document.querySelector('.pdp-hero-carousel');
    if (!carousel) return;

    var slides = Array.from(carousel.querySelectorAll('.pdp-hero-carousel-slide'));
    var dots = Array.from(carousel.querySelectorAll('.pdp-carousel-dot'));
    var currentIndex = 0;
    var autoAdvanceInterval = null;
    var autoAdvanceDelay = 4000;
    var isPaused = false;

    function goToSlide(index) {
      currentIndex = index;
      slides.forEach(function(slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function(dot, i) {
        dot.classList.toggle('active', i === index);
        dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
      });
    }

    function nextSlide() {
      goToSlide((currentIndex + 1) % slides.length);
    }

    function prevSlide() {
      goToSlide((currentIndex - 1 + slides.length) % slides.length);
    }

    function startAutoAdvance() {
      if (autoAdvanceInterval) clearInterval(autoAdvanceInterval);
      autoAdvanceInterval = setInterval(function() {
        if (!isPaused) nextSlide();
      }, autoAdvanceDelay);
    }

    function stopAutoAdvance() {
      if (autoAdvanceInterval) {
        clearInterval(autoAdvanceInterval);
        autoAdvanceInterval = null;
      }
    }

    // Dot navigation
    dots.forEach(function(dot) {
      dot.addEventListener('click', function() {
        var index = parseInt(dot.dataset.index, 10);
        goToSlide(index);
        startAutoAdvance(); // Reset timer on manual navigation
      });
    });

    // Pause on hover
    carousel.addEventListener('mouseenter', function() {
      isPaused = true;
    });

    carousel.addEventListener('mouseleave', function() {
      isPaused = false;
    });

    // Touch/swipe support
    var touchStartX = 0;
    var touchEndX = 0;
    var minSwipeDistance = 50;

    carousel.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      var swipeDistance = touchEndX - touchStartX;
      if (Math.abs(swipeDistance) > minSwipeDistance) {
        if (swipeDistance > 0) {
          prevSlide();
        } else {
          nextSlide();
        }
        startAutoAdvance(); // Reset timer after swipe
      }
    }

    // Keyboard navigation
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
        startAutoAdvance();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextSlide();
        startAutoAdvance();
      }
    });

    // Start auto-advance
    startAutoAdvance();

    // Pause when page is not visible
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) {
        stopAutoAdvance();
      } else {
        startAutoAdvance();
      }
    });

    return {
      goTo: goToSlide,
      next: nextSlide,
      prev: prevSlide,
      stop: stopAutoAdvance,
      start: startAutoAdvance
    };
  }

  /**
   * Generic carousel initializer
   * @param {string} containerSelector - Carousel container selector
   * @param {string} slideSelector - Slide selector
   * @param {string} dotSelector - Navigation dot selector
   * @param {object} options - Configuration options
   */
  function initGenericCarousel(containerSelector, slideSelector, dotSelector, options) {
    var defaults = {
      autoAdvance: true,
      autoAdvanceDelay: 4000,
      pauseOnHover: true,
      enableTouch: true,
      enableKeyboard: true
    };

    var config = Object.assign({}, defaults, options || {});
    var carousel = document.querySelector(containerSelector);
    if (!carousel) return null;

    var slides = Array.from(carousel.querySelectorAll(slideSelector));
    var dots = dotSelector ? Array.from(carousel.querySelectorAll(dotSelector)) : [];
    var currentIndex = 0;
    var autoAdvanceInterval = null;
    var isPaused = false;

    function goToSlide(index) {
      currentIndex = index;
      slides.forEach(function(slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function(dot, i) {
        dot.classList.toggle('active', i === index);
      });
    }

    function nextSlide() {
      goToSlide((currentIndex + 1) % slides.length);
    }

    function prevSlide() {
      goToSlide((currentIndex - 1 + slides.length) % slides.length);
    }

    if (config.autoAdvance) {
      autoAdvanceInterval = setInterval(function() {
        if (!isPaused) nextSlide();
      }, config.autoAdvanceDelay);
    }

    if (config.pauseOnHover) {
      carousel.addEventListener('mouseenter', function() { isPaused = true; });
      carousel.addEventListener('mouseleave', function() { isPaused = false; });
    }

    dots.forEach(function(dot, i) {
      dot.addEventListener('click', function() { goToSlide(i); });
    });

    if (config.enableTouch) {
      var touchStartX = 0;
      carousel.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      carousel.addEventListener('touchend', function(e) {
        var diff = e.changedTouches[0].screenX - touchStartX;
        if (Math.abs(diff) > 50) {
          diff > 0 ? prevSlide() : nextSlide();
        }
      }, { passive: true });
    }

    if (config.enableKeyboard) {
      carousel.setAttribute('tabindex', '0');
      carousel.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') { e.preventDefault(); prevSlide(); }
        if (e.key === 'ArrowRight') { e.preventDefault(); nextSlide(); }
      });
    }

    return { goTo: goToSlide, next: nextSlide, prev: prevSlide };
  }

  // Initialize when DOM is ready
  function init() {
    initPDPCarousel();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for external use
  window.Hr2Carousel = {
    initPDP: initPDPCarousel,
    initGeneric: initGenericCarousel
  };
})();
