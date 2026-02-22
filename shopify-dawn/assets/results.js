(function () {
  "use strict";

  var LANG = window.__RESULTS_LANG || "en";
  var DE = LANG === "de";
  var DOC = window.__RESULTS_DOC_NAME || "Dr. Patrick";

  /* ── Screens ── */
  var codeEntry = document.getElementById("codeEntry");
  var loadingScreen = document.getElementById("loadingScreen");
  var dashboard = document.getElementById("resultsDashboard");
  var codeInput = document.getElementById("accessCodeInput");
  var codeError = document.getElementById("codeError");
  var submitBtn = document.getElementById("codeSubmitBtn");
  var stickyBar = document.getElementById("resultsStickyBar");

  function showScreen(el) {
    [codeEntry, loadingScreen, dashboard].forEach(function (s) {
      s.classList.remove("active");
    });
    el.classList.add("active");
  }

  /* ── Code Entry ── */
  submitBtn.addEventListener("click", function () {
    var code = codeInput.value.trim().toUpperCase();
    if (!code) {
      showError(DE ? "Bitte gib Deinen Code ein." : "Please enter your code.");
      return;
    }
    codeError.style.display = "none";
    codeInput.classList.remove("error");
    showScreen(loadingScreen);
    fetchResults(code);
  });

  codeInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") submitBtn.click();
  });

  function showError(msg) {
    codeError.textContent = msg;
    codeError.style.display = "block";
    codeInput.classList.add("error");
  }

  /* ── Auto-fill from URL param ── */
  var urlCode = new URLSearchParams(window.location.search).get("code");
  if (urlCode) {
    codeInput.value = urlCode;
    submitBtn.click();
  }

  /* ── Fetch ── */
  function fetchResults(code) {
    window.supabase
      .select("questionnaire_submissions", { access_code: code })
      .then(function (rows) {
        if (!rows || rows.length === 0) {
          showScreen(codeEntry);
          showError(
            DE
              ? "Ungültiger Code. Bitte überprüfe Deinen Code."
              : "Invalid code. Please check and try again."
          );
          return;
        }
        renderDashboard(rows[0]);
      })
      .catch(function (err) {
        console.error("Fetch error:", err);
        showScreen(codeEntry);
        showError(
          DE
            ? "Verbindungsfehler. Bitte versuche es später erneut."
            : "Connection error. Please try again later."
        );
      });
  }

  /* ════════════════════════════════════════
     RENDER DASHBOARD
     ════════════════════════════════════════ */
  function renderDashboard(d) {
    renderSummary(d);
    renderNutrients(d);
    renderInsights(d);
    renderHormonal(d);
    renderRoutine(d);
    renderProduct(d);
    showScreen(dashboard);

    // Show sticky bar
    if (stickyBar) {
      stickyBar.style.display = "block";
    }
  }

  /* ── Helpers ── */
  function t(en, de) {
    return DE ? de : en;
  }

  function sym(val) {
    return val === "yes";
  }

  function safeArr(v) {
    if (Array.isArray(v)) return v;
    if (typeof v === "string") {
      try { return JSON.parse(v); } catch (e) { return [v]; }
    }
    return [];
  }

  function safeObj(v) {
    if (v && typeof v === "object" && !Array.isArray(v)) return v;
    if (typeof v === "string") {
      try { return JSON.parse(v); } catch (e) { return {}; }
    }
    return {};
  }

  /* ────────────────────────────────────────
     A. SUMMARY
     ──────────────────────────────────────── */
  function renderSummary(d) {
    var reason = d.reason || "";
    var pattern = d.pattern || "";
    var onset = d.onset_type || "";
    var onsetTime = d.onset_time || "";

    var typeLabel, desc;

    if (reason === "no-loss") {
      typeLabel = t("Hair Optimization & Prevention", "Haar-Optimierung & Prävention");
      desc = t(
        "No significant hair loss detected. This report focuses on optimizing your hair health and preventing future issues.",
        "Kein signifikanter Haarausfall erkannt. Dieser Bericht konzentriert sich auf Optimierung und Prävention."
      );
    } else if (pattern === "widening" || pattern === "receding") {
      typeLabel = t("Androgenetic Alopecia", "Androgenetische Alopezie");
      desc = t(
        "Your pattern suggests androgenetic alopecia — the most common form, driven by genetic DHT sensitivity. Early treatment yields the best results.",
        "Dein Muster deutet auf androgenetische Alopezie hin — die häufigste Form, verursacht durch genetische DHT-Empfindlichkeit. Frühe Behandlung bringt die besten Ergebnisse."
      );
    } else if (onset === "sudden" && (onsetTime === "<3mo" || onsetTime === "3-6mo")) {
      typeLabel = t("Acute Telogen Effluvium", "Akutes Telogen-Effluvium");
      desc = t(
        "Sudden, diffuse shedding typically triggered by a stressor 2–4 months prior — such as diet changes, stress, illness, or hormonal shifts.",
        "Plötzlicher, diffuser Haarausfall, typischerweise ausgelöst durch einen Stressor 2–4 Monate zuvor — wie Ernährungsänderungen, Stress oder hormonelle Veränderungen."
      );
    } else if (pattern === "patchy") {
      typeLabel = t("Patchy Hair Loss", "Fleckiger Haarausfall");
      desc = t(
        "May indicate alopecia areata (autoimmune). We recommend a dermatologist evaluation alongside nutritional support.",
        "Kann auf Alopecia areata hinweisen (Autoimmun). Wir empfehlen eine dermatologische Untersuchung neben der Nährstoffunterstützung."
      );
    } else {
      typeLabel = t("Chronic Diffuse Shedding", "Chronisch diffuser Haarausfall");
      desc = t(
        "Ongoing diffuse shedding, often caused by overlapping factors: nutrient deficiencies, hormonal changes, and lifestyle stressors.",
        "Anhaltender diffuser Haarausfall, oft verursacht durch überlappende Faktoren: Nährstoffmängel, hormonelle Veränderungen und Lebensstilfaktoren."
      );
    }

    var onsetLabel = "";
    if (reason !== "no-loss") {
      var onsetMap = {
        "<3mo": t("< 3 months", "< 3 Monate"),
        "3-6mo": t("3–6 months", "3–6 Monate"),
        "6-12mo": t("6–12 months", "6–12 Monate"),
        ">12mo": t("> 12 months", "> 12 Monate")
      };
      onsetLabel = onsetMap[onsetTime] || "";
    }

    var html = '<span class="summary-type">' + typeLabel + "</span>";
    if (onsetLabel) {
      html += '<p class="summary-onset">' + t("Duration: ", "Dauer: ") + onsetLabel + "</p>";
    }
    html += '<p class="summary-factors">' + desc + "</p>";

    document.getElementById("summaryContent").innerHTML = html;
  }

  /* ────────────────────────────────────────
     B. MICRONUTRIENT ANALYSIS
     ──────────────────────────────────────── */
  function scoreIron(d) {
    var s = 0;
    var iron = safeObj(d.iron_symptoms);
    if (sym(iron.fatigue)) s += 2;
    if (sym(iron.breath)) s += 2;
    if (sym(iron.cravings)) s += 2;
    if (sym(iron.nails)) s += 1.5;
    if (sym(iron.dizziness)) s += 1;
    if (d.sex === "female") s += 1;
    if (d.bleeding === "heavy" || d.bleeding === "very-heavy") s += 1.5;
    if (d.diet === "vegan" || d.diet === "vegetarian") s += 1;
    if (d.dieted === "yes") s += 0.5;
    return s;
  }

  function scoreVitD(d) {
    var s = 0;
    var vd = safeObj(d.vitd_symptoms);
    if (sym(vd.low_sun)) s += 2;
    if (sym(vd.bone_aches)) s += 2;
    if (sym(vd.infections)) s += 1.5;
    if (sym(vd.winter_mood)) s += 1.5;
    if (d.sun === "rarely") s += 2;
    else if (d.sun === "1-3-week") s += 1;
    var excl = safeArr(d.exclusions);
    if (excl.indexOf("dairy-free") > -1) s += 0.5;
    if (d.diet === "vegan") s += 0.5;
    return s;
  }

  function scoreB12(d) {
    var s = 0;
    var b = safeObj(d.b12_symptoms);
    if (sym(b.tongue)) s += 2;
    if (sym(b.memory)) s += 1.5;
    if (sym(b.wound)) s += 1.5;
    if (sym(b.cold_intolerance)) s += 2;
    if (d.diet === "vegan") s += 2;
    else if (d.diet === "vegetarian") s += 1;
    return s;
  }

  function riskLevel(score) {
    if (score >= 5) return "elevated";
    if (score >= 2.5) return "moderate";
    return "low";
  }

  function riskLabel(level) {
    var labels = {
      low: t("Low", "Niedrig"),
      moderate: t("Moderate", "Moderat"),
      elevated: t("Elevated", "Erhöht")
    };
    return labels[level];
  }

  function renderNutrients(d) {
    var nutrients = [
      {
        name: t("Iron (Ferritin)", "Eisen (Ferritin)"),
        score: scoreIron(d),
        test: t("Test: Serum Ferritin", "Test: Serum-Ferritin"),
        lowText: t("Low risk. Maintain adequate iron intake through diet.", "Niedriges Risiko. Halte eine ausreichende Eisenzufuhr über die Ernährung aufrecht."),
        modText: t("Possible iron depletion. Low ferritin causes diffuse shedding even with normal hemoglobin. A blood test can confirm.", "Mögliche Eisenverarmung. Niedriges Ferritin verursacht diffusen Haarausfall selbst bei normalem Hb. Ein Bluttest kann Klarheit geben."),
        highText: t("Significant iron deficiency risk — a leading reversible cause of hair loss. Check ferritin levels (optimal > 70 ng/mL).", "Erhebliches Eisenmangel-Risiko — eine der häufigsten reversiblen Ursachen. Ferritin prüfen (optimal > 70 ng/mL).")
      },
      {
        name: t("Vitamin D", "Vitamin D"),
        score: scoreVitD(d),
        test: t("Test: 25-OH Vitamin D", "Test: 25-OH Vitamin D"),
        lowText: t("Low risk based on sun exposure and symptoms.", "Niedriges Risiko basierend auf Sonnenexposition und Symptomen."),
        modText: t("Moderate risk. Vitamin D receptors in follicles are linked to telogen effluvium and alopecia areata.", "Moderates Risiko. Vitamin-D-Rezeptoren in Follikeln sind mit Telogen-Effluvium und Alopecia areata verbunden."),
        highText: t("High risk for deficiency. Low vitamin D is strongly linked to hair loss and poor cycling. Testing recommended.", "Hohes Risiko. Niedrige Vitamin-D-Werte sind stark mit Haarausfall verbunden. Test empfohlen.")
      },
      {
        name: t("B12 & Thyroid", "B12 & Schilddrüse"),
        score: scoreB12(d),
        test: t("Tests: B12, TSH, Free T4", "Tests: B12, TSH, freies T4"),
        lowText: t("Low risk. Still worth checking in routine blood work.", "Niedriges Risiko. Dennoch eine Kontrolle im Routinelabor wert."),
        modText: t("Possible B12 deficiency or thyroid involvement. Cold intolerance and memory issues may indicate thyroid dysfunction.", "Möglicher B12-Mangel oder Schilddrüsenbeteiligung. Kälteempfindlichkeit und Gedächtnisprobleme können auf Schilddrüsenprobleme hinweisen."),
        highText: t("Concerning for B12 deficiency or thyroid issues. Both are easily treatable once identified. Blood work recommended.", "B12-Mangel oder Schilddrüsenprobleme wahrscheinlich. Beide sind leicht behandelbar. Blutbild empfohlen.")
      }
    ];

    var html = "";
    nutrients.forEach(function (n) {
      var level = riskLevel(n.score);
      var text = level === "elevated" ? n.highText : level === "moderate" ? n.modText : n.lowText;
      html +=
        '<div class="nutrient-item">' +
        '<div class="nutrient-label">' +
        '<span class="nutrient-name">' + n.name + "</span>" +
        '<span class="nutrient-risk risk-' + level + '">' + riskLabel(level) + "</span>" +
        "</div>" +
        '<div class="nutrient-bar-bg"><div class="nutrient-bar-fill fill-' + level + '"></div></div>' +
        '<p class="nutrient-text">' + text + "</p>" +
        (level !== "low" ? '<p class="nutrient-test">' + n.test + "</p>" : "") +
        "</div>";
    });

    document.getElementById("nutrientBars").innerHTML = html;
  }

  /* ────────────────────────────────────────
     C. KEY INSIGHTS (Diet + Scalp combined)
     ──────────────────────────────────────── */
  function renderInsights(d) {
    var items = [];
    var diet = d.diet || "";
    var excl = safeArr(d.exclusions);
    var symptoms = safeArr(d.scalp_symptoms);
    var breakage = d.breakage_vs_shedding || "";

    // Diet
    if (diet === "vegan") {
      items.push({
        title: t("Vegan Diet", "Vegane Ernährung"),
        text: t("A vegan diet increases the risk for low iron, zinc, B12, and protein — all essential for healthy hair. Targeted supplementation and careful meal planning are recommended.", "Eine vegane Ernährung erhöht das Risiko für niedrige Eisen-, Zink-, B12- und Proteinwerte — alle essentiell für gesundes Haar. Gezielte Supplementierung und sorgfältige Mahlzeitenplanung werden empfohlen."),
        type: "warn"
      });
    } else if (diet === "vegetarian") {
      items.push({
        title: t("Vegetarian Diet", "Vegetarische Ernährung"),
        text: t("Vegetarian diets can be lower in heme iron and zinc. Combining iron-rich plant foods with vitamin C significantly improves absorption.", "Vegetarische Ernährung kann arm an Häm-Eisen und Zink sein. Die Kombination von eisenreichen Lebensmitteln mit Vitamin C verbessert die Aufnahme deutlich."),
        type: "warn"
      });
    }

    if (d.dieted === "yes") {
      items.push({
        title: t("Calorie Restriction", "Kalorienrestriktion"),
        text: t("Recent dieting is one of the most common triggers for telogen effluvium. Hair shedding often begins 2–4 months after calorie restriction. Adequate protein intake (≥ 1.2 g/kg body weight) is essential for recovery.", "Kürzliche Diäten gehören zu den häufigsten Auslösern für Telogen-Effluvium. Haarausfall beginnt oft 2–4 Monate nach Kalorienrestriktion. Ausreichend Protein (≥ 1,2 g/kg Körpergewicht) ist für die Erholung essentiell."),
        type: "warn"
      });
    }

    if (d.sun === "rarely") {
      items.push({
        title: t("Low Sun Exposure", "Geringe Sonnenexposition"),
        text: t("Limited sun exposure increases the risk of vitamin D deficiency. Vitamin D receptors are present in hair follicles, and low levels are associated with disrupted follicle cycling.", "Geringe Sonnenexposition erhöht das Risiko für Vitamin-D-Mangel. Vitamin-D-Rezeptoren befinden sich in den Haarfollikeln, niedrige Werte werden mit gestörtem Follikelzyklus in Verbindung gebracht."),
        type: "warn"
      });
    }

    // Scalp
    if (symptoms.indexOf("itch") > -1 || symptoms.indexOf("dandruff") > -1) {
      items.push({
        title: t("Scalp: Itching & Dandruff", "Kopfhaut: Juckreiz & Schuppen"),
        text: t("These symptoms may indicate seborrheic dermatitis or a disrupted scalp microbiome. A gentle anti-dandruff shampoo with zinc pyrithione, used 2–3 times per week, can help.", "Diese Symptome können auf seborrhoische Dermatitis oder ein gestörtes Kopfhaut-Mikrobiom hinweisen. Ein sanftes Anti-Schuppen-Shampoo mit Zinkpyrithion, 2–3x pro Woche, kann helfen."),
        type: "warn"
      });
    }
    if (symptoms.indexOf("burning") > -1 || symptoms.indexOf("pain") > -1) {
      items.push({
        title: t("Scalp Sensitivity", "Kopfhaut-Empfindlichkeit"),
        text: t("Burning or pain in the scalp (trichodynia) is often associated with active hair shedding and scalp inflammation. This typically improves as the underlying cause is addressed.", "Brennen oder Schmerzen in der Kopfhaut (Trichondynie) sind oft mit aktivem Haarausfall und Kopfhautentzündung verbunden. Dies bessert sich typischerweise, wenn die Ursache behandelt wird."),
        type: "warn"
      });
    }

    if (breakage === "breakage" || breakage === "both") {
      items.push({
        title: t("Hair Breakage", "Haarbruch"),
        text: t("Breakage indicates damage to the hair shaft, often from heat styling, chemical treatments, or insufficient protein. Reducing heat use and increasing protein intake can help.", "Haarbruch deutet auf eine Schädigung des Haarschafts hin, oft durch Hitzestyling, chemische Behandlungen oder Proteinmangel. Weniger Hitze und mehr Protein können helfen."),
        type: "info"
      });
    } else if (breakage === "shedding") {
      items.push({
        title: t("Root Shedding", "Haarausfall an der Wurzel"),
        text: t("Hair loss from the root points to a follicle-level issue rather than shaft damage. This is typically nutritional, hormonal, or stress-related.", "Haarausfall von der Wurzel deutet auf ein Problem auf Follikel-Ebene hin. Dies ist meist ernährungs-, hormon- oder stressbedingt."),
        type: "info"
      });
    }

    if (items.length === 0) {
      items.push({
        title: t("Healthy Baseline", "Gesunde Ausgangslage"),
        text: t("Your diet and scalp health appear favorable for hair growth. Continue maintaining a balanced diet rich in protein, iron, and vitamins.", "Deine Ernährung und Kopfhautgesundheit erscheinen günstig für das Haarwachstum. Halte eine ausgewogene Ernährung mit Protein, Eisen und Vitaminen aufrecht."),
        type: "ok"
      });
    }

    document.getElementById("insightsContent").innerHTML = renderInsightCards(items);
  }

  function renderInsightCards(items) {
    var html = "";
    items.forEach(function (item) {
      html +=
        '<div class="results-card results-insight-card results-insight--' + item.type + '">' +
        '<h2>' + item.title + '</h2>' +
        '<p class="insight-card-text">' + item.text + '</p>' +
        '</div>';
    });
    return html;
  }

  function renderInsightList(items) {
    var html = '<ul class="insight-list">';
    items.forEach(function (item) {
      var svgIcon;
      if (item.icon === "warn") {
        svgIcon = '<svg class="insight-icon warn" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
      } else if (item.icon === "ok") {
        svgIcon = '<svg class="insight-icon ok" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
      } else {
        svgIcon = '<svg class="insight-icon info" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
      }
      html += '<li class="insight-item">' + svgIcon + "<span>" + item.text + "</span></li>";
    });
    html += "</ul>";
    return html;
  }

  /* ────────────────────────────────────────
     D. HORMONAL FACTORS
     ──────────────────────────────────────── */
  function renderHormonal(d) {
    if (d.sex !== "female") return;

    var items = [];

    if (d.postpartum === "yes") {
      items.push({ icon: "info", text: t("Postpartum hair loss is common — full recovery usually within 6–12 months. Nutritional support helps.", "Postpartaler Haarausfall ist häufig — Erholung in 6–12 Monaten. Nährstoffunterstützung hilft.") });
    }
    if (d.pregnant === "yes") {
      items.push({ icon: "info", text: t("Pregnancy increases iron and folate demands. Prenatal supplements are important.", "Schwangerschaft erhöht Eisen- und Folatbedarf. Pränatale Supplemente sind wichtig.") });
    }
    if (d.cycles === "irregular") {
      items.push({ icon: "warn", text: t("Irregular cycles may indicate hormonal imbalances (e.g., PCOS or thyroid) contributing to hair loss.", "Unregelmäßige Zyklen können auf hormonelle Imbalancen hinweisen, die Haarausfall begünstigen.") });
    }
    if (d.bleeding === "heavy" || d.bleeding === "very-heavy") {
      items.push({ icon: "warn", text: t("Heavy periods increase iron loss significantly. Monitor ferritin levels closely.", "Starke Perioden erhöhen den Eisenverlust erheblich. Ferritin genau überwachen.") });
    }

    if (items.length > 0) {
      document.getElementById("hormonalCard").style.display = "block";
      document.getElementById("hormonalContent").innerHTML = renderInsightList(items);
    }
  }

  /* ────────────────────────────────────────
     E. PERSONALIZED ROUTINE
     ──────────────────────────────────────── */
  function renderRoutine(d) {
    var steps = [];
    var ironRisk = riskLevel(scoreIron(d));
    var symptoms = safeArr(d.scalp_symptoms);
    var breakage = d.breakage_vs_shedding || "";

    steps.push({
      title: t("Take Hr² daily", "Nimm Hr² täglich"),
      desc: t("Consistent supplementation for 8–12 weeks for initial results.", "Konsistente Einnahme für 8–12 Wochen für erste Ergebnisse.")
    });

    steps.push({
      title: t("Scalp massage (3–5 min/day)", "Kopfhautmassage (3–5 Min/Tag)"),
      desc: t("Circular fingertip motions increase blood flow to follicles.", "Kreisende Fingerspitzenbewegungen fördern die Durchblutung.")
    });

    if (ironRisk !== "low") {
      steps.push({
        title: t("Iron-rich foods daily", "Täglich eisenreiche Lebensmittel"),
        desc: t("Pair with vitamin C to boost absorption up to 300%.", "Mit Vitamin C kombinieren für bis zu 300% mehr Absorption.")
      });
    }

    if (symptoms.indexOf("dandruff") > -1 || symptoms.indexOf("itch") > -1) {
      steps.push({
        title: t("Anti-dandruff shampoo 2–3x/week", "Anti-Schuppen-Shampoo 2–3x/Woche"),
        desc: t("Zinc pyrithione or ketoconazole.", "Zinkpyrithion oder Ketoconazol.")
      });
    }

    if (breakage === "breakage" || breakage === "both") {
      steps.push({
        title: t("Minimize heat styling", "Hitzestyling minimieren"),
        desc: t("Use heat protectant, air-dry when possible.", "Hitzeschutz verwenden, lufttrocknen wenn möglich.")
      });
    }

    steps.push({
      title: t("Track progress", "Fortschritt verfolgen"),
      desc: t("Photo your hair parting every 4 weeks under same lighting.", "Alle 4 Wochen Foto des Scheitels bei gleicher Beleuchtung.")
    });

    var html = '<ol class="routine-list">';
    steps.forEach(function (step, i) {
      html +=
        '<li class="routine-step">' +
        '<div class="routine-step-header">' +
        '<span class="routine-num">' + (i + 1) + '</span>' +
        '<span class="routine-step-title">' + step.title + '</span>' +
        '</div>' +
        '<p class="routine-step-desc">' + step.desc + '</p>' +
        '</li>';
    });
    html += '</ol>';

    document.getElementById("routineContent").innerHTML = html;
  }

  /* ────────────────────────────────────────
     F. PRODUCT RECOMMENDATION
     ──────────────────────────────────────── */
  function renderProduct(d) {
    var ironRisk = riskLevel(scoreIron(d));
    var pattern = d.pattern || "";
    var breakage = d.breakage_vs_shedding || "";
    var reason = d.reason || "";

    // Build a specific, personalized reason paragraph
    var reasonParts = [];

    if (pattern === "widening" || pattern === "receding") {
      reasonParts.push(t(
        "Your hair loss pattern indicates androgenetic sensitivity. Hr² contains Saw Palmetto, a natural DHT blocker that helps protect your follicles from further miniaturization.",
        "Dein Haarausfallmuster deutet auf androgenetische Empfindlichkeit hin. Hr² enthält Sägepalmenextrakt, einen natürlichen DHT-Blocker, der Deine Follikel vor weiterer Miniaturisierung schützt."
      ));
    }

    if (ironRisk !== "low") {
      reasonParts.push(t(
        "Your profile suggests possible iron depletion — one of the most common reversible causes of hair loss. Hr² includes L-Lysine which enhances iron absorption by up to 300%.",
        "Dein Profil deutet auf mögliche Eisenverarmung hin — eine der häufigsten reversiblen Ursachen für Haarausfall. Hr² enthält L-Lysin, das die Eisenabsorption um bis zu 300% steigert."
      ));
    }

    if (d.dieted === "yes") {
      reasonParts.push(t(
        "After calorie restriction, your body needs targeted nutrients to restart normal hair cycling. Ashwagandha and biotin in Hr² support stress recovery and keratin production.",
        "Nach Kalorienrestriktion braucht Dein Körper gezielte Nährstoffe, um den normalen Haarzyklus wieder anzukurbeln. Ashwagandha und Biotin in Hr² unterstützen die Stresserholung und Keratinproduktion."
      ));
    }

    if (breakage === "breakage" || breakage === "both") {
      reasonParts.push(t(
        "Hair breakage points to weakened keratin structure. L-Cysteine in Hr² is a direct building block for hair keratin and strengthens the hair shaft from within.",
        "Haarbruch deutet auf eine geschwächte Keratinstruktur hin. L-Cystein in Hr² ist ein direkter Baustein für Haar-Keratin und stärkt den Haarschaft von innen."
      ));
    }

    if (reasonParts.length === 0) {
      reasonParts.push(t(
        "Based on your profile, Hr² provides comprehensive follicle support with 24 targeted ingredients — including AnaGain™ for growth signaling, biotin for keratin production, and a full vitamin complex for healthy hair cycling.",
        "Basierend auf Deinem Profil bietet Hr² umfassende Follikelunterstützung mit 24 gezielten Inhaltsstoffen — darunter AnaGain™ für Wachstumssignale, Biotin für Keratinproduktion und einen vollständigen Vitaminkomplex für gesunden Haarzyklus."
      ));
    }

    document.getElementById("productReason").innerHTML = reasonParts.join(" ");

    var ingredients = [
      { name: "AnaGain™", desc: t("hair growth signaling", "Haarwachstums-Signalwege"), highlight: true },
      { name: "Biotin", desc: t("keratin production", "Keratinproduktion"), highlight: true },
      { name: "Saw Palmetto", desc: t("natural DHT inhibitor", "natürlicher DHT-Hemmer"), highlight: pattern === "widening" || pattern === "receding" },
      { name: "Ashwagandha", desc: t("stress adaptogen", "Stress-Adaptogen"), highlight: d.dieted === "yes" || reason === "losing" },
      { name: "L-Cysteine", desc: t("hair keratin builder", "Haar-Keratin-Baustein"), highlight: breakage === "breakage" || breakage === "both" },
      { name: "L-Lysine", desc: t("iron & zinc absorption", "Eisen- & Zinkabsorption"), highlight: ironRisk !== "low" },
      { name: t("Zinc & Selenium", "Zink & Selen"), desc: t("trace minerals", "Spurenelemente"), highlight: d.diet === "vegan" || d.diet === "vegetarian" },
      { name: t("D3, B12, Folate", "D3, B12, Folat"), desc: t("hair cycling support", "Haarzyklus-Unterstützung"), highlight: riskLevel(scoreVitD(d)) !== "low" || riskLevel(scoreB12(d)) !== "low" }
    ];

    var html = "";
    ingredients.forEach(function (ing) {
      html +=
        '<li class="' + (ing.highlight ? "highlighted" : "") + '">' +
        ing.name + " — " + ing.desc +
        "</li>";
    });

    document.getElementById("productIngredients").innerHTML = html;
  }
})();
