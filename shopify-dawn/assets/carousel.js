/**
 * Carousel Component
 * Handles generic carousel interfaces
 */

(function() {
  'use strict';

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

  // Expose for external use
  window.Hr2Carousel = {
    initGeneric: initGenericCarousel
  };
})();
