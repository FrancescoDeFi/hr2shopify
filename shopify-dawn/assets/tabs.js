/**
 * Tabs Component
 * Handles ingredients explorer and other tabbed interfaces
 */

(function() {
  'use strict';

  /**
   * Ingredient descriptions for the ingredients explorer
   */
  var ingredientCopy = {
    anagain: 'Ein pflanzlicher Erbsensprossen-Extrakt, der die Haarwurzel in ihrer Aktivität unterstützt und so gesundes Haarwachstum begleitet.<sup>4</sup>',
    sawpalmetto: 'Ein Pflanzenextrakt, der Faktoren unterstützt, die mit der Erhaltung voller Haare in Verbindung stehen.<sup>4</sup>',
    pomegranate: 'Ein polyphenolreicher Extrakt mit antioxidativen Eigenschaften – unterstützt den Schutz vor oxidativem Stress.<sup>4</sup>',
    ashwagandha: 'Ein Adaptogen, das die Stressbalance unterstützt – ein wichtiger Faktor für gesunde Haarzyklen.<sup>4</sup>',
    lcysteine: 'Eine Aminosäure, die als Baustein von Keratin dient – unterstützt die natürliche Haarstruktur.<sup>4</sup>',
    llysine: 'Eine essentielle Aminosäure, die am Aufbau von Strukturproteinen beteiligt ist.<sup>4</sup>',
    zinc: 'Zink trägt zur Erhaltung normaler Haare und Nägel bei.<sup>4</sup>',
    biotin: 'Biotin trägt zur Erhaltung normaler Haare und Haut bei.<sup>4</sup>'
  };

  /**
   * Initialize ingredients explorer tabs
   */
  function initIngredientsExplorer() {
    var section = document.querySelector('.ingredients-explorer');
    if (!section) return;

    var description = section.querySelector('#ingredient-description');
    var chips = Array.from(section.querySelectorAll('.ingredient-chip'));

    // Try to get copy from data attributes or use defaults
    function getCopy(key) {
      var chip = chips.find(function(c) { return c.dataset.ingredient === key; });
      if (chip && chip.dataset.description) {
        return chip.dataset.description;
      }
      return ingredientCopy[key] || '';
    }

    function setActive(key) {
      chips.forEach(function(btn) {
        var active = btn.dataset.ingredient === key;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      if (description) {
        var copy = getCopy(key);
        if (copy) description.innerHTML = copy;
      }
    }

    chips.forEach(function(btn) {
      btn.addEventListener('click', function() {
        setActive(btn.dataset.ingredient);
      });
    });

    // Keyboard navigation for accessibility
    chips.forEach(function(btn, index) {
      btn.addEventListener('keydown', function(e) {
        var newIndex = index;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          newIndex = (index + 1) % chips.length;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          newIndex = (index - 1 + chips.length) % chips.length;
        } else if (e.key === 'Home') {
          e.preventDefault();
          newIndex = 0;
        } else if (e.key === 'End') {
          e.preventDefault();
          newIndex = chips.length - 1;
        }
        if (newIndex !== index) {
          chips[newIndex].focus();
          setActive(chips[newIndex].dataset.ingredient);
        }
      });
    });

    // Set initial active state
    var initialChip = chips.find(function(c) { return c.classList.contains('active'); }) || chips[0];
    if (initialChip) setActive(initialChip.dataset.ingredient);
  }

  /**
   * Generic tab initializer
   * @param {string} containerSelector - Container selector
   * @param {string} tabSelector - Tab button selector
   * @param {string} panelSelector - Panel selector
   */
  function initGenericTabs(containerSelector, tabSelector, panelSelector) {
    var container = document.querySelector(containerSelector);
    if (!container) return;

    var tabs = Array.from(container.querySelectorAll(tabSelector));
    var panels = Array.from(container.querySelectorAll(panelSelector));

    function activateTab(tab) {
      var targetId = tab.getAttribute('aria-controls') || tab.dataset.target;

      tabs.forEach(function(t) {
        var isActive = t === tab;
        t.classList.toggle('active', isActive);
        t.setAttribute('aria-selected', isActive ? 'true' : 'false');
        t.setAttribute('tabindex', isActive ? '0' : '-1');
      });

      panels.forEach(function(panel) {
        var isActive = panel.id === targetId || panel.dataset.tab === tab.dataset.tab;
        panel.classList.toggle('active', isActive);
        panel.hidden = !isActive;
      });
    }

    tabs.forEach(function(tab, index) {
      tab.addEventListener('click', function() {
        activateTab(tab);
      });

      tab.addEventListener('keydown', function(e) {
        var newIndex = index;
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          newIndex = (index + 1) % tabs.length;
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          newIndex = (index - 1 + tabs.length) % tabs.length;
        }
        if (newIndex !== index) {
          tabs[newIndex].focus();
          activateTab(tabs[newIndex]);
        }
      });
    });

    // Activate first tab by default
    var initialTab = tabs.find(function(t) { return t.classList.contains('active'); }) || tabs[0];
    if (initialTab) activateTab(initialTab);
  }

  // Initialize when DOM is ready
  function init() {
    initIngredientsExplorer();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for external use
  window.Hr2Tabs = {
    initIngredients: initIngredientsExplorer,
    initGeneric: initGenericTabs,
    ingredientCopy: ingredientCopy
  };
})();
