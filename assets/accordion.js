/**
 * Accordion Component
 * Handles causes accordion, FAQ accordion, and PDP FAQ accordion
 */

(function() {
  'use strict';

  /**
   * Initialize causes accordion (single-open pattern)
   */
  function initCausesAccordion() {
    var root = document.querySelector('.causes');
    if (!root) return;

    var buttons = Array.from(root.querySelectorAll('.cause-btn'));
    var bodies = Array.from(root.querySelectorAll('.cause-body'));

    function open(btn) {
      buttons.forEach(function(b) {
        var active = b === btn;
        b.classList.toggle('active', active);
        b.setAttribute('aria-selected', active ? 'true' : 'false');
        b.setAttribute('aria-expanded', active ? 'true' : 'false');
        var icon = b.querySelector('.cause-icon');
        if (icon) icon.textContent = active ? '−' : '+';
      });
      bodies.forEach(function(body) {
        var isForBtn = body.previousElementSibling === btn;
        body.classList.toggle('open', isForBtn);
      });
    }

    buttons.forEach(function(btn) {
      btn.addEventListener('click', function() { open(btn); });
    });

    // Set initial state (first active or first button)
    var initial = buttons.find(function(b) { return b.classList.contains('active'); }) || buttons[0];
    if (initial) open(initial);
  }

  /**
   * Initialize FAQ accordion (single-open pattern)
   */
  function initFAQAccordion() {
    var root = document.querySelector('.faq');
    if (!root) return;

    var items = Array.from(root.querySelectorAll('.faq-item'));
    var buttons = Array.from(root.querySelectorAll('.faq-question'));

    function openItem(item) {
      items.forEach(function(it) {
        var active = it === item;
        it.classList.toggle('open', active);
        var btn = it.querySelector('.faq-question');
        var answer = it.querySelector('.faq-answer');
        var toggle = it.querySelector('.faq-toggle');

        if (btn) btn.setAttribute('aria-expanded', active ? 'true' : 'false');
        if (answer) answer.hidden = !active;
        if (toggle) toggle.textContent = active ? '−' : '+';
      });
    }

    buttons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var item = btn.closest('.faq-item');
        if (item) openItem(item);
      });
    });

    var initial = items.find(function(it) { return it.classList.contains('open'); }) || items[0];
    if (initial) openItem(initial);
  }

  /**
   * Initialize PDP FAQ accordion (single-open pattern)
   */
  function initPDPFAQAccordion() {
    var root = document.querySelector('.pdp-faq');
    if (!root) return;

    var items = Array.from(root.querySelectorAll('.pdp-faq-item'));
    var buttons = Array.from(root.querySelectorAll('.pdp-faq-question'));

    function openItem(item) {
      items.forEach(function(it) {
        var active = it === item;
        it.classList.toggle('open', active);
        var btn = it.querySelector('.pdp-faq-question');
        var answer = it.querySelector('.pdp-faq-answer');
        var toggle = it.querySelector('.pdp-faq-toggle');
        if (btn) btn.setAttribute('aria-expanded', active ? 'true' : 'false');
        if (answer) answer.hidden = !active;
        if (toggle) toggle.textContent = active ? '−' : '+';
      });
    }

    buttons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var item = btn.closest('.pdp-faq-item');
        if (item) openItem(item);
      });
    });

    var initial = items.find(function(it) { return it.classList.contains('open'); }) || items[0];
    if (initial) openItem(initial);
  }

  /**
   * Generic accordion initializer for custom sections
   * @param {string} rootSelector - Container selector
   * @param {string} itemSelector - Item selector
   * @param {string} buttonSelector - Button selector
   * @param {string} answerSelector - Answer selector
   * @param {string} toggleSelector - Toggle icon selector
   */
  function initGenericAccordion(rootSelector, itemSelector, buttonSelector, answerSelector, toggleSelector) {
    var root = document.querySelector(rootSelector);
    if (!root) return;

    var items = Array.from(root.querySelectorAll(itemSelector));
    var buttons = Array.from(root.querySelectorAll(buttonSelector));

    function openItem(item) {
      items.forEach(function(it) {
        var active = it === item;
        it.classList.toggle('open', active);
        var btn = it.querySelector(buttonSelector);
        var answer = it.querySelector(answerSelector);
        var toggle = it.querySelector(toggleSelector);
        if (btn) btn.setAttribute('aria-expanded', active ? 'true' : 'false');
        if (answer) answer.hidden = !active;
        if (toggle) toggle.textContent = active ? '−' : '+';
      });
    }

    buttons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var item = btn.closest(itemSelector);
        if (item) openItem(item);
      });
    });

    var initial = items.find(function(it) { return it.classList.contains('open'); }) || items[0];
    if (initial) openItem(initial);
  }

  // Initialize all accordions when DOM is ready
  function init() {
    initCausesAccordion();
    initFAQAccordion();
    initPDPFAQAccordion();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for external use
  window.Hr2Accordion = {
    initCauses: initCausesAccordion,
    initFAQ: initFAQAccordion,
    initPDPFAQ: initPDPFAQAccordion,
    initGeneric: initGenericAccordion
  };
})();
