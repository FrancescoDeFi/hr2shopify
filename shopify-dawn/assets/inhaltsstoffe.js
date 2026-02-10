(() => {
  const INGREDIENTS = [
    {
      id: "anagain",
      name: "Anagain",
      subtitle: "Erbsensprossen\u2011Extrakt",
      category: "Naturstoffe",
      amount: "100 mg",
      nrv: null,
      benefit: "Haarwurzel-Aktivierung",
      description: "Ein pflanzlicher Erbsensprossen\u2011Extrakt, der die Haarwurzel in ihrer Aktivit\u00e4t unterst\u00fctzt. Gerade bei diffusem Ausfall wird er h\u00e4ufig eingesetzt, um den Haarzyklus zu begleiten und die Basis f\u00fcr kr\u00e4ftigeres Wachstum zu unterst\u00fctzen."
    },
    {
      id: "sawpalmetto",
      name: "S\u00e4gepalmenextrakt",
      subtitle: "Serenoa repens",
      category: "Naturstoffe",
      amount: "50 mg",
      nrv: null,
      benefit: "Unterst\u00fctzt Haarf\u00fclle",
      contains: [{ name: "Fetts\u00e4uren", amount: "12,5 mg", nrv: null }],
      description: "S\u00e4gepalmenextrakt wird traditionell im Kontext von vollerem Haar eingesetzt. Er kann Prozesse unterst\u00fctzen, die mit der Erhaltung von Haarf\u00fclle in Verbindung stehen, und erg\u00e4nzt so eine ganzheitliche Routine f\u00fcr Kopfhaut und Haarwurzel."
    },
    {
      id: "pomegranate",
      name: "Granatapfelextrakt",
      subtitle: "Punica granatum",
      category: "Naturstoffe",
      amount: "10 mg",
      nrv: null,
      benefit: "Antioxidativer Schutz",
      contains: [{ name: "Ellags\u00e4ure", amount: "4 mg", nrv: null }],
      description: "Granatapfel ist reich an Polyphenolen. Antioxidative Pflanzenstoffe unterst\u00fctzen den Schutz der Zellen vor oxidativem Stress \u2013 ein Faktor, der auch f\u00fcr Kopfhaut und Haarwurzel relevant sein kann."
    },
    {
      id: "ashwagandha_extract",
      name: "Ashwagandhaextrakt",
      subtitle: "KSM-66\u00ae",
      category: "Sonstige Stoffe",
      amount: "300 mg",
      nrv: null,
      benefit: "Stressbalance",
      contains: [{ name: "Withanolide", amount: "15 mg", nrv: null }],
      description: "Ashwagandha gilt als Adaptogen und wird h\u00e4ufig genutzt, um Stressbalance zu unterst\u00fctzen. Da Stress den Haarzyklus beeinflussen kann, kann eine bessere Stressregulation indirekt zu stabileren Haarzyklen beitragen."
    },
    {
      id: "vitamin_c",
      name: "Vitamin C",
      subtitle: null,
      category: "Vitamine",
      amount: "40 mg",
      nrv: "50 %",
      benefit: "Kollagenbildung",
      description: "Vitamin C tr\u00e4gt zu einer normalen Kollagenbildung f\u00fcr eine normale Funktion der Haut bei und sch\u00fctzt Zellen vor oxidativem Stress. Beides ist wichtig, um die Kopfhaut als Umfeld f\u00fcr gesundes Haar zu unterst\u00fctzen."
    },
    {
      id: "vitamin_e",
      name: "Vitamin E (nat\u00fcrlich)",
      subtitle: null,
      category: "Vitamine",
      amount: "18 mg",
      nrv: "150 %",
      benefit: "Zellschutz",
      description: "Vitamin E tr\u00e4gt dazu bei, die Zellen vor oxidativem Stress zu sch\u00fctzen. Das kann helfen, Kopfhaut und Haarwurzel vor belastenden Umwelteinfl\u00fcssen zu unterst\u00fctzen."
    },
    {
      id: "riboflavin",
      name: "Riboflavin",
      subtitle: "Vitamin B2",
      category: "Vitamine",
      amount: "1,4 mg",
      nrv: "100 %",
      benefit: "Gesunde Kopfhaut",
      description: "Riboflavin (Vitamin B2) tr\u00e4gt zur Erhaltung normaler Haut und zum Schutz der Zellen vor oxidativem Stress bei. Eine gesunde Kopfhaut ist die Grundlage f\u00fcr kr\u00e4ftiges Haar."
    },
    {
      id: "niacin",
      name: "Niacin",
      subtitle: "Vitamin B3",
      category: "Vitamine",
      amount: "20 mg",
      nrv: "125 %",
      benefit: "Hautbarriere",
      description: "Niacin (Vitamin B3) tr\u00e4gt zur Erhaltung normaler Haut bei. Da Haare aus der Kopfhaut heraus wachsen, kann eine gut versorgte Hautbarriere das Haarumfeld unterst\u00fctzen."
    },
    {
      id: "pantothenic_acid",
      name: "Pantothens\u00e4ure",
      subtitle: "Vitamin B5",
      category: "Vitamine",
      amount: "18 mg",
      nrv: "300 %",
      benefit: "Energiestoffwechsel",
      description: "Pantothens\u00e4ure (Vitamin B5) tr\u00e4gt zu einem normalen Energiestoffwechsel bei. Energie- und N\u00e4hrstoffprozesse sind grundlegend, damit der K\u00f6rper auch \u201enicht lebensnotwendige\u201c Strukturen wie Haare zuverl\u00e4ssig versorgen kann."
    },
    {
      id: "vitamin_b6",
      name: "Vitamin B6",
      subtitle: null,
      category: "Vitamine",
      amount: "7 mg",
      nrv: "500 %",
      benefit: "Protein-Stoffwechsel",
      description: "Vitamin B6 tr\u00e4gt zu einem normalen Eiwei\u00df- und Energiestoffwechsel bei. Da Haare haupts\u00e4chlich aus Protein (Keratin) bestehen, ist ein funktionierender Protein-Stoffwechsel ein wichtiger Baustein f\u00fcr Haarstruktur und Wachstum."
    },
    {
      id: "folic_acid",
      name: "Fols\u00e4ure",
      subtitle: null,
      category: "Vitamine",
      amount: "200 \u00b5g",
      nrv: "100 %",
      benefit: "Zellteilung",
      description: "Fols\u00e4ure tr\u00e4gt zu einer normalen Zellteilung bei. Schnell teilende Zellen spielen auch im Haarfollikel eine Rolle \u2013 eine gute Folatversorgung unterst\u00fctzt daher die physiologischen Wachstumsprozesse."
    },
    {
      id: "vitamin_a",
      name: "Vitamin A",
      subtitle: null,
      category: "Vitamine",
      amount: "800 \u00b5g",
      nrv: "100 %",
      benefit: "Normale Haut",
      description: "Vitamin A tr\u00e4gt zur Erhaltung normaler Haut bei. Eine gesunde Kopfhaut unterst\u00fctzt das Umfeld, in dem Haare wachsen."
    },
    {
      id: "beta_carotene",
      name: "Beta Carotin",
      subtitle: null,
      category: "Vitamine",
      amount: "0,8 mg",
      nrv: null,
      benefit: "Vitamin-A-Vorstufe",
      description: "Beta-Carotin ist eine Vorstufe von Vitamin A. Es erg\u00e4nzt die Versorgung mit Vitamin-A-relevanten Bausteinen, die f\u00fcr Hautgesundheit (und damit auch f\u00fcr die Kopfhaut) wichtig ist."
    },
    {
      id: "vitamin_d",
      name: "Vitamin D",
      subtitle: null,
      category: "Vitamine",
      amount: "10 \u00b5g",
      nrv: "200 %",
      benefit: "Immunsystem",
      description: "Vitamin D tr\u00e4gt zu einer normalen Funktion des Immunsystems und zu einer normalen Zellteilung bei. Beides kann f\u00fcr ein ausgeglichenes Kopfhautmilieu relevant sein, das gesundes Haar unterst\u00fctzt."
    },
    {
      id: "lcysteine",
      name: "L\u2011Cysteine",
      subtitle: "Aminos\u00e4ure",
      category: "Aminos\u00e4uren",
      amount: "50 mg",
      nrv: null,
      benefit: "Keratin-Baustein",
      description: "L\u2011Cystein ist ein wichtiger Baustein von Keratin, dem Strukturprotein der Haare. Eine ausreichende Versorgung kann die nat\u00fcrliche Haarstruktur unterst\u00fctzen \u2013 besonders bei br\u00fcchigem oder strapaziertem Haar."
    },
    {
      id: "llysine_hcl",
      name: "L\u2011Lysin HCL",
      subtitle: null,
      category: "Sonstige Stoffe",
      amount: "100 mg",
      nrv: null,
      benefit: "Strukturprotein",
      contains: [{ name: "L Lysin", amount: "79 mg", nrv: null }],
      description: "L\u2011Lysin ist eine essentielle Aminos\u00e4ure und beteiligt am Aufbau von Strukturproteinen. In der Haarroutine wird es h\u00e4ufig genutzt, um die Versorgung mit Proteinbausteinen zu erg\u00e4nzen, die f\u00fcr Haarstruktur wichtig sind."
    },
    {
      id: "zinc",
      name: "Zink",
      subtitle: "Mineralstoff",
      category: "Mineralstoffe",
      amount: "10 mg",
      nrv: "100 %",
      benefit: "Erhaltung normaler Haare",
      description: "Zink tr\u00e4gt zur Erhaltung normaler Haare und Haut bei. Es unterst\u00fctzt zudem den Schutz der Zellen vor oxidativem Stress \u2013 beides wichtige Faktoren f\u00fcr Haarwurzel und Kopfhaut."
    },
    {
      id: "boron",
      name: "Bor",
      subtitle: null,
      category: "Mineralstoffe",
      amount: "1 mg",
      nrv: null,
      benefit: "Mineralstoffhaushalt",
      description: "Bor wird oft als erg\u00e4nzender Spurenn\u00e4hrstoff in Formulierungen eingesetzt. Es kann helfen, den Mineralstoffhaushalt ganzheitlich abzurunden \u2013 indirekt relevant, weil Haare stark von einer insgesamt guten N\u00e4hrstoffversorgung profitieren."
    },
    {
      id: "manganese",
      name: "Mangan",
      subtitle: null,
      category: "Mineralstoffe",
      amount: "1 mg",
      nrv: "50 %",
      benefit: "Bindegewebsbildung",
      description: "Mangan tr\u00e4gt zum Schutz der Zellen vor oxidativem Stress und zu einer normalen Bindegewebsbildung bei. Das kann die Haut-/Kopfhautstruktur unterst\u00fctzen, die f\u00fcr gesunde Haarbedingungen wichtig ist."
    },
    {
      id: "copper",
      name: "Kupfer",
      subtitle: null,
      category: "Mineralstoffe",
      amount: "1 mg",
      nrv: "100 %",
      benefit: "Haarpigmentierung",
      description: "Kupfer tr\u00e4gt zu einer normalen Haarpigmentierung bei und unterst\u00fctzt den Schutz der Zellen vor oxidativem Stress. Damit kann es sowohl optische Aspekte (Farbe) als auch die allgemeine Haarumgebung unterst\u00fctzen."
    },
    {
      id: "iodine",
      name: "Jod",
      subtitle: null,
      category: "Mineralstoffe",
      amount: "225 \u00b5g",
      nrv: "150 %",
      benefit: "Schilddr\u00fcsenfunktion",
      description: "Jod tr\u00e4gt zu einer normalen Schilddr\u00fcsenfunktion und Hormonproduktion bei. Da Hormone den Haarzyklus beeinflussen k\u00f6nnen, kann eine gute Jodversorgung indirekt zu stabileren Haarbedingungen beitragen."
    },
    {
      id: "selenium",
      name: "Selen",
      subtitle: null,
      category: "Mineralstoffe",
      amount: "44 \u00b5g",
      nrv: "80 %",
      benefit: "Erhaltung normaler Haare",
      description: "Selen tr\u00e4gt zur Erhaltung normaler Haare bei und unterst\u00fctzt den Schutz der Zellen vor oxidativem Stress. Das macht es zu einem zentralen Spurenelement f\u00fcr Haar- und Kopfhautgesundheit."
    },
    {
      id: "biotin",
      name: "Biotin",
      subtitle: "Vitamin B7",
      category: "Vitamine",
      amount: "150 \u00b5g",
      nrv: "300 %",
      benefit: "Erhaltung normaler Haare",
      description: "Biotin tr\u00e4gt zur Erhaltung normaler Haare und Haut bei. Es wird h\u00e4ufig als Basis-N\u00e4hrstoff eingesetzt, wenn es um Haarqualit\u00e4t, Widerstandskraft und die Unterst\u00fctzung des Wachstumsumfelds geht."
    },
    {
      id: "sprouted_pea_seed",
      name: "gekeimtes Erbsensamenextrakt Pulver",
      subtitle: "AnaGain\u2122 Nu",
      category: "Sonstige Stoffe",
      amount: "100 mg",
      nrv: null,
      benefit: "Unterst\u00fctzt Haarzyklus",
      description: "Gekeimtes Erbsensamenextrakt ist eine pflanzliche Quelle funktioneller Inhaltsstoffe, die in der Haarroutine h\u00e4ufig zur Unterst\u00fctzung der Haarwurzel eingesetzt wird. Er erg\u00e4nzt die Formel mit pflanzlichen Bausteinen, die den Haarzyklus begleiten k\u00f6nnen."
    }
  ];

  /* ─── Gallery rendering ─── */
  var gallery = document.getElementById("inh-gallery");
  var backdrop = document.getElementById("ingredient-backdrop");
  var drawer = document.getElementById("ingredient-drawer");
  var closeBtn = document.getElementById("ingredient-drawer-close");
  var titleEl = document.getElementById("ingredient-drawer-title");
  var subtitleEl = document.getElementById("ingredient-drawer-subtitle");
  var descriptionEl = document.getElementById("ingredient-drawer-description");
  var factsEl = document.getElementById("ingredient-drawer-facts");
  var containsEl = document.getElementById("ingredient-drawer-contains");
  var kickerEl = document.getElementById("ingredient-drawer-kicker");

  if (!gallery) return;

  var hasDrawer = backdrop && drawer && closeBtn && titleEl && subtitleEl && descriptionEl && factsEl && containsEl && kickerEl;
  var activeFilter = "all";

  /* Capsule image URL — grab from existing img in drawer or fallback */
  var capsuleUrl = "capsule.svg";
  var existingCapsule = document.querySelector(".ingredient-drawer-media-icon");
  if (existingCapsule && existingCapsule.src) capsuleUrl = existingCapsule.src;

  function metaLine(item) {
    var parts = [];
    if (item.amount) parts.push(item.amount);
    if (item.nrv) parts.push("NRV " + item.nrv);
    return parts.join(" \u00b7 ");
  }

  function openDrawer(item) {
    if (!hasDrawer) return;
    titleEl.textContent = item.name;
    var subParts = [];
    if (item.subtitle) subParts.push(item.subtitle);
    var meta = metaLine(item);
    if (meta) subParts.push(meta);
    subtitleEl.textContent = subParts.join(" \u00b7 ");

    if (item.amount || item.nrv) {
      factsEl.hidden = false;
      factsEl.innerHTML =
        '<div class="ingredient-fact-row"><div class="ingredient-fact-label">2 Kapseln</div><div class="ingredient-fact-value">' + (item.amount || "\u2013") + '</div></div>' +
        '<div class="ingredient-fact-row"><div class="ingredient-fact-label">NRV (%)</div><div class="ingredient-fact-value">' + (item.nrv || "\u2013") + '</div></div>';
    } else {
      factsEl.hidden = true;
      factsEl.innerHTML = "";
    }

    if (item.description) {
      descriptionEl.hidden = false;
      descriptionEl.textContent = item.description;
    } else {
      descriptionEl.hidden = true;
      descriptionEl.textContent = "";
    }

    if (Array.isArray(item.contains) && item.contains.length) {
      containsEl.hidden = false;
      containsEl.innerHTML = item.contains.map(function(c) {
        var cMeta = [c.amount, c.nrv ? "NRV " + c.nrv : null].filter(Boolean).join(" \u00b7 ");
        return '<li><span class="ingredient-contains-name">' + c.name + '</span><span class="ingredient-contains-meta">' + (cMeta || "\u2013") + '</span></li>';
      }).join("");
    } else {
      containsEl.hidden = true;
      containsEl.innerHTML = "";
    }
    kickerEl.textContent = (item.category || "NATURSTOFFE").toUpperCase();

    backdrop.hidden = false;
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("drawer-open");
    closeBtn.focus();
  }

  function closeDrawerFn() {
    if (!hasDrawer) return;
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("drawer-open");
    backdrop.hidden = true;
  }

  function renderGallery() {
    gallery.innerHTML = "";
    INGREDIENTS.forEach(function(item) {
      var card = document.createElement("button");
      card.type = "button";
      card.className = "inh-card";
      card.setAttribute("aria-label", item.name + " anzeigen");
      card.dataset.category = item.category;

      if (activeFilter !== "all" && item.category !== activeFilter) {
        card.hidden = true;
      }

      var metaStr = metaLine(item);

      card.innerHTML =
        '<div class="inh-pill-ring">' +
          '<span class="inh-pill-benefit">' + (item.benefit || '') + '</span>' +
          '<img class="inh-pill-capsule" src="' + capsuleUrl + '" alt="" loading="lazy" decoding="async">' +
        '</div>' +
        '<div class="inh-card-name">' + item.name + '</div>' +
        (metaStr ? '<div class="inh-card-meta">' + metaStr + '</div>' : '') +
        '<div class="inh-card-category">' + item.category + '</div>';

      card.addEventListener("click", function() { openDrawer(item); });
      gallery.appendChild(card);
    });
  }

  /* ─── Filters ─── */
  var filterBtns = document.querySelectorAll(".inh-filter-btn");
  filterBtns.forEach(function(btn) {
    btn.addEventListener("click", function() {
      filterBtns.forEach(function(b) { b.classList.remove("active"); });
      btn.classList.add("active");
      activeFilter = btn.dataset.filter;

      var cards = gallery.querySelectorAll(".inh-card");
      cards.forEach(function(card) {
        if (activeFilter === "all" || card.dataset.category === activeFilter) {
          card.hidden = false;
        } else {
          card.hidden = true;
        }
      });
    });
  });

  /* ─── Drawer events ─── */
  if (hasDrawer) {
    backdrop.addEventListener("click", closeDrawerFn);
    closeBtn.addEventListener("click", closeDrawerFn);
    window.addEventListener("keydown", function(e) {
      if (e.key === "Escape" && drawer.classList.contains("open")) closeDrawerFn();
    });
  }

  renderGallery();

  /* ─── Nutrition toggle ─── */
  var root = document.getElementById("nutrition-collapsible");
  if (root) {
    var btn = root.querySelector(".nutrition-toggle");
    var tableWrap = root.querySelector(".nutrition-table-wrap");
    if (btn && tableWrap) {
      function setExpanded(expanded) {
        root.classList.toggle("is-expanded", expanded);
        btn.setAttribute("aria-expanded", expanded ? "true" : "false");
        btn.innerHTML = expanded ? 'Weniger anzeigen <span aria-hidden="true">\u25b4</span>' : 'Mehr anzeigen <span aria-hidden="true">\u25be</span>';
      }
      btn.addEventListener("click", function() {
        var expanded = btn.getAttribute("aria-expanded") === "true";
        setExpanded(!expanded);
      });
      setExpanded(false);
    }
  }
})();
