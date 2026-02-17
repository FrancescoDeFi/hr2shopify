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
              ? "Ungültiger Code. Bitte überprüfe Deinen Code und versuche es erneut."
              : "Invalid code. Please check your code and try again."
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
    renderDiet(d);
    renderHormonal(d);
    renderScalp(d);
    renderRoutine(d);
    renderProduct(d);
    renderNextSteps(d);
    showScreen(dashboard);
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

    var type, typeLabel, desc;

    if (reason === "no-loss") {
      type = "prevention";
      typeLabel = t("Hair Optimization & Prevention", "Haar-Optimierung & Prävention");
      desc = t(
        "Your answers indicate you are currently not experiencing significant hair loss. This report focuses on optimizing your hair health and preventing future issues.",
        "Deine Antworten zeigen, dass Du derzeit keinen signifikanten Haarausfall erlebst. Dieser Bericht konzentriert sich auf die Optimierung Deiner Haargesundheit und Prävention."
      );
    } else if (pattern === "widening" || pattern === "receding") {
      type = "aga";
      typeLabel = t("Androgenetic Alopecia (Pattern Hair Loss)", "Androgenetische Alopezie (erblicher Haarausfall)");
      desc = t(
        "Your pattern suggests androgenetic alopecia, the most common form of hair loss. It is driven by genetic sensitivity to DHT, a hormone that miniaturizes hair follicles over time.",
        "Dein Muster deutet auf androgenetische Alopezie hin, die häufigste Form von Haarausfall. Sie wird durch genetische Empfindlichkeit gegenüber DHT verursacht, einem Hormon, das Haarfollikel mit der Zeit verkleinert."
      );
    } else if (onset === "sudden" && (onsetTime === "<3mo" || onsetTime === "3-6mo")) {
      type = "te-acute";
      typeLabel = t("Acute Telogen Effluvium", "Akutes Telogen-Effluvium");
      desc = t(
        "Your answers suggest acute telogen effluvium — a sudden, diffuse shedding typically triggered by a stressor 2-4 months prior. Common triggers include dietary changes, stress, illness, or hormonal shifts.",
        "Deine Antworten deuten auf ein akutes Telogen-Effluvium hin — ein plötzlicher, diffuser Haarausfall, der typischerweise durch einen Stressor 2-4 Monate zuvor ausgelöst wird."
      );
    } else if (pattern === "patchy") {
      type = "patchy";
      typeLabel = t("Patchy Hair Loss", "Fleckiger Haarausfall");
      desc = t(
        "Patchy hair loss may indicate alopecia areata, an autoimmune condition. We recommend seeing a dermatologist for a clinical evaluation alongside the nutritional support in this report.",
        "Fleckiger Haarausfall kann auf Alopecia areata hinweisen, eine Autoimmunerkrankung. Wir empfehlen eine dermatologische Untersuchung neben der Nährstoffunterstützung in diesem Bericht."
      );
    } else {
      type = "te-chronic";
      typeLabel = t("Chronic Diffuse Shedding", "Chronisch diffuser Haarausfall");
      desc = t(
        "Your answers indicate ongoing diffuse shedding. This can result from multiple overlapping factors including nutrient deficiencies, hormonal changes, and lifestyle stressors.",
        "Deine Antworten deuten auf anhaltenden diffusen Haarausfall hin. Dies kann durch mehrere überlappende Faktoren verursacht werden, darunter Nährstoffmängel, hormonelle Veränderungen und Lebensstilfaktoren."
      );
    }

    var onsetLabel = "";
    if (reason !== "no-loss") {
      var onsetMap = {
        "<3mo": t("Less than 3 months", "Weniger als 3 Monate"),
        "3-6mo": t("3–6 months", "3–6 Monate"),
        "6-12mo": t("6–12 months", "6–12 Monate"),
        ">12mo": t("Over 12 months", "Über 12 Monate")
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
        test: t("Recommended test: Serum Ferritin", "Empfohlener Test: Serum-Ferritin"),
        lowText: t(
          "Your symptom profile shows low risk for iron deficiency. Maintaining adequate iron intake through diet supports healthy hair growth.",
          "Dein Symptomprofil zeigt ein niedriges Risiko für Eisenmangel. Eine ausreichende Eisenzufuhr über die Ernährung unterstützt gesundes Haarwachstum."
        ),
        modText: t(
          "Several indicators suggest possible iron depletion. Low ferritin is one of the most common causes of diffuse hair shedding, even when hemoglobin is normal. A blood test can confirm your levels.",
          "Mehrere Indikatoren deuten auf eine mögliche Eisenverarmung hin. Niedriges Ferritin ist eine der häufigsten Ursachen für diffusen Haarausfall, selbst wenn der Hämoglobinwert normal ist."
        ),
        highText: t(
          "Multiple symptoms point to significant iron deficiency risk. This is a leading reversible cause of hair loss. We strongly recommend checking your ferritin levels — optimal for hair growth is above 70 ng/mL.",
          "Mehrere Symptome deuten auf ein erhebliches Eisenmangel-Risiko hin. Dies ist eine der häufigsten reversiblen Ursachen für Haarausfall. Wir empfehlen dringend, Deine Ferritinwerte zu überprüfen — optimal für Haarwachstum ist über 70 ng/mL."
        )
      },
      {
        name: t("Vitamin D", "Vitamin D"),
        score: scoreVitD(d),
        test: t("Recommended test: 25-OH Vitamin D", "Empfohlener Test: 25-OH Vitamin D"),
        lowText: t(
          "Your vitamin D risk appears low based on sun exposure and symptoms. Continue maintaining adequate levels through sunlight and diet.",
          "Dein Vitamin-D-Risiko erscheint niedrig basierend auf Sonnenexposition und Symptomen. Halte Deine Werte durch Sonnenlicht und Ernährung aufrecht."
        ),
        modText: t(
          "Moderate risk indicators for vitamin D insufficiency. Vitamin D receptors are present in hair follicles and deficiency has been linked to telogen effluvium and alopecia areata.",
          "Moderate Risikoindikatoren für Vitamin-D-Insuffizienz. Vitamin-D-Rezeptoren befinden sich in den Haarfollikeln, und ein Mangel wurde mit Telogen-Effluvium und Alopecia areata in Verbindung gebracht."
        ),
        highText: t(
          "High risk for vitamin D deficiency based on your profile. Low vitamin D levels are strongly associated with hair loss and poor hair cycling. Testing is highly recommended.",
          "Hohes Risiko für Vitamin-D-Mangel basierend auf Deinem Profil. Niedrige Vitamin-D-Werte sind stark mit Haarausfall und gestörtem Haarzyklus verbunden. Ein Test wird dringend empfohlen."
        )
      },
      {
        name: t("B12 & Thyroid Markers", "B12 & Schilddrüsen-Marker"),
        score: scoreB12(d),
        test: t("Recommended tests: Vitamin B12, TSH, Free T4", "Empfohlene Tests: Vitamin B12, TSH, freies T4"),
        lowText: t(
          "Low risk for B12 or thyroid-related deficiency based on your symptoms. These are still worth checking in a routine blood panel.",
          "Niedriges Risiko für B12- oder schilddrüsenbedingte Mängel basierend auf Deinen Symptomen. Diese sollten dennoch in einer Routineblutuntersuchung überprüft werden."
        ),
        modText: t(
          "Some symptoms suggest possible B12 deficiency or thyroid involvement. Cold intolerance and memory issues can indicate thyroid dysfunction, which is a common cause of hair loss.",
          "Einige Symptome deuten auf möglichen B12-Mangel oder Schilddrüsenbeteiligung hin. Kälteempfindlichkeit und Gedächtnisprobleme können auf eine Schilddrüsenfunktionsstörung hinweisen."
        ),
        highText: t(
          "Several symptoms raise concern for B12 deficiency or thyroid issues. Both conditions can directly cause hair loss and are easily treatable once identified. We recommend blood work promptly.",
          "Mehrere Symptome deuten auf B12-Mangel oder Schilddrüsenprobleme hin. Beide Zustände können direkt Haarausfall verursachen und sind leicht behandelbar, sobald sie identifiziert sind."
        )
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
     C. DIET & LIFESTYLE
     ──────────────────────────────────────── */
  function renderDiet(d) {
    var items = [];
    var diet = d.diet || "";
    var excl = safeArr(d.exclusions);

    if (diet === "vegan") {
      items.push({
        icon: "warn",
        text: t(
          "A vegan diet can make it harder to get sufficient iron, zinc, B12, and complete proteins — all critical for hair. Supplementation and careful meal planning are important.",
          "Eine vegane Ernährung kann es schwieriger machen, ausreichend Eisen, Zink, B12 und vollständige Proteine zu bekommen — alle entscheidend für das Haar. Supplementierung und sorgfältige Mahlzeitenplanung sind wichtig."
        )
      });
    } else if (diet === "vegetarian") {
      items.push({
        icon: "warn",
        text: t(
          "Vegetarian diets may be lower in heme iron and zinc. Combining iron-rich plant foods with vitamin C improves absorption significantly.",
          "Vegetarische Ernährung kann arm an Häm-Eisen und Zink sein. Die Kombination von eisenreichen pflanzlichen Lebensmitteln mit Vitamin C verbessert die Absorption erheblich."
        )
      });
    } else if (diet === "pescatarian") {
      items.push({
        icon: "ok",
        text: t(
          "Your pescatarian diet provides omega-3 fatty acids from fish, which support scalp health and hair shine. Ensure adequate iron intake from leafy greens and legumes.",
          "Deine pescatarische Ernährung liefert Omega-3-Fettsäuren aus Fisch, die die Kopfhautgesundheit und den Haarglanz unterstützen. Achte auf ausreichende Eisenzufuhr aus Blattgemüse und Hülsenfrüchten."
        )
      });
    }

    if (d.dieted === "yes") {
      items.push({
        icon: "warn",
        text: t(
          "Recent calorie restriction is one of the most common triggers for telogen effluvium. Crash diets can shift up to 30% of hair into the shedding phase within 2-4 months. Adequate protein (at least 1.2g/kg body weight) is essential for recovery.",
          "Kürzliche Kalorienrestriktion ist einer der häufigsten Auslöser für Telogen-Effluvium. Crash-Diäten können innerhalb von 2-4 Monaten bis zu 30% der Haare in die Ausfallphase verschieben. Ausreichend Protein (mindestens 1,2g/kg Körpergewicht) ist für die Erholung essentiell."
        )
      });
    }

    if (d.sun === "rarely") {
      items.push({
        icon: "warn",
        text: t(
          "Limited sun exposure increases risk of vitamin D deficiency, which is linked to poor hair follicle cycling. Consider vitamin D supplementation, especially during winter months.",
          "Begrenzte Sonnenexposition erhöht das Risiko eines Vitamin-D-Mangels, der mit einem gestörten Haarfollikelzyklus verbunden ist. Erwäge eine Vitamin-D-Supplementierung, besonders in den Wintermonaten."
        )
      });
    } else if (d.sun === "most-days") {
      items.push({
        icon: "ok",
        text: t(
          "Regular sun exposure helps maintain healthy vitamin D levels, supporting hair follicle function.",
          "Regelmäßige Sonnenexposition hilft, gesunde Vitamin-D-Spiegel aufrechtzuerhalten und die Haarfollikelfunktion zu unterstützen."
        )
      });
    }

    if (excl.indexOf("gluten-free") > -1) {
      items.push({
        icon: "info",
        text: t(
          "A gluten-free diet may reduce intake of fortified grains that provide iron and B vitamins. Ensure you get these nutrients from other sources.",
          "Eine glutenfreie Ernährung kann die Aufnahme von angereicherten Getreideprodukten reduzieren, die Eisen und B-Vitamine liefern. Stelle sicher, dass Du diese Nährstoffe aus anderen Quellen bekommst."
        )
      });
    }
    if (excl.indexOf("dairy-free") > -1) {
      items.push({
        icon: "info",
        text: t(
          "Avoiding dairy removes a key source of calcium and vitamin D. Consider fortified alternatives and supplementation.",
          "Der Verzicht auf Milchprodukte entfernt eine wichtige Quelle für Kalzium und Vitamin D. Erwäge angereicherte Alternativen und Supplementierung."
        )
      });
    }
    if (excl.indexOf("low-fat") > -1) {
      items.push({
        icon: "info",
        text: t(
          "Very low-fat diets can impair absorption of fat-soluble vitamins (A, D, E, K) essential for hair health. Including healthy fats like avocado, nuts, and olive oil is important.",
          "Sehr fettarme Diäten können die Aufnahme fettlöslicher Vitamine (A, D, E, K) beeinträchtigen, die für die Haargesundheit essentiell sind. Gesunde Fette wie Avocado, Nüsse und Olivenöl sind wichtig."
        )
      });
    }

    if (items.length === 0) {
      items.push({
        icon: "ok",
        text: t(
          "Your diet and lifestyle factors appear favorable for hair health. Continue maintaining a balanced diet rich in protein, iron, and vitamins.",
          "Deine Ernährungs- und Lebensstilfaktoren erscheinen günstig für die Haargesundheit. Halte eine ausgewogene Ernährung mit viel Protein, Eisen und Vitaminen aufrecht."
        )
      });
    }

    document.getElementById("dietContent").innerHTML = renderInsightList(items);
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
      items.push({
        icon: "info",
        text: t(
          "Postpartum hair loss is very common and occurs due to the rapid drop in estrogen after delivery. Most women see full recovery within 6-12 months. Nutritional support can help speed this process.",
          "Postpartaler Haarausfall ist sehr häufig und tritt aufgrund des schnellen Östrogenabfalls nach der Entbindung auf. Die meisten Frauen sehen eine vollständige Erholung innerhalb von 6-12 Monaten. Nährstoffunterstützung kann diesen Prozess beschleunigen."
        )
      });
    }

    if (d.pregnant === "yes") {
      items.push({
        icon: "info",
        text: t(
          "During pregnancy, increased nutrient demands — especially iron and folate — can affect hair. Prenatal supplements and iron-rich foods are particularly important.",
          "Während der Schwangerschaft kann der erhöhte Nährstoffbedarf — besonders Eisen und Folsäure — das Haar beeinflussen. Pränatale Nahrungsergänzungsmittel und eisenreiche Lebensmittel sind besonders wichtig."
        )
      });
    }

    if (d.cycles === "irregular") {
      items.push({
        icon: "warn",
        text: t(
          "Irregular menstrual cycles may indicate hormonal imbalances (e.g., PCOS or thyroid issues) that can contribute to hair loss. Consider discussing with your healthcare provider.",
          "Unregelmäßige Menstruationszyklen können auf hormonelle Ungleichgewichte (z.B. PCOS oder Schilddrüsenprobleme) hinweisen, die zu Haarausfall beitragen können. Besprich dies mit Deinem Arzt."
        )
      });
    }

    if (d.bleeding === "heavy" || d.bleeding === "very-heavy") {
      items.push({
        icon: "warn",
        text: t(
          "Heavy menstrual bleeding significantly increases iron loss. Women with heavy periods should monitor ferritin levels closely and may benefit from iron supplementation.",
          "Starke Menstruationsblutung erhöht den Eisenverlust erheblich. Frauen mit starken Perioden sollten ihre Ferritinwerte genau überwachen und können von einer Eisensupplementierung profitieren."
        )
      });
    }

    if (items.length > 0) {
      document.getElementById("hormonalCard").style.display = "block";
      document.getElementById("hormonalContent").innerHTML = renderInsightList(items);
    }
  }

  /* ────────────────────────────────────────
     E. SCALP HEALTH
     ──────────────────────────────────────── */
  function renderScalp(d) {
    var items = [];
    var symptoms = safeArr(d.scalp_symptoms);
    var breakage = d.breakage_vs_shedding || "";

    if (symptoms.indexOf("none") > -1 || symptoms.length === 0) {
      items.push({
        icon: "ok",
        text: t(
          "No significant scalp symptoms reported. A healthy scalp is a good foundation for hair regrowth.",
          "Keine signifikanten Kopfhautsymptome gemeldet. Eine gesunde Kopfhaut ist eine gute Grundlage für das Nachwachsen der Haare."
        )
      });
    } else {
      if (symptoms.indexOf("itch") > -1 || symptoms.indexOf("dandruff") > -1) {
        items.push({
          icon: "warn",
          text: t(
            "Itching and dandruff may indicate seborrheic dermatitis or a disrupted scalp microbiome. Consider a gentle anti-dandruff shampoo with zinc pyrithione or ketoconazole, used 2-3 times per week.",
            "Juckreiz und Schuppen können auf seborrhoische Dermatitis oder ein gestörtes Kopfhaut-Mikrobiom hinweisen. Erwäge ein sanftes Anti-Schuppen-Shampoo mit Zinkpyrithion oder Ketoconazol, 2-3 mal pro Woche."
          )
        });
      }
      if (symptoms.indexOf("burning") > -1 || symptoms.indexOf("pain") > -1) {
        items.push({
          icon: "warn",
          text: t(
            "Burning or pain in the scalp (trichodynia) is often associated with active hair shedding and scalp inflammation. This typically improves as the underlying cause is addressed.",
            "Brennen oder Schmerzen in der Kopfhaut (Trichondynie) sind oft mit aktivem Haarausfall und Kopfhautentzündung verbunden. Dies verbessert sich typischerweise, wenn die zugrunde liegende Ursache behandelt wird."
          )
        });
      }
      if (symptoms.indexOf("redness") > -1 || symptoms.indexOf("pimples") > -1) {
        items.push({
          icon: "warn",
          text: t(
            "Redness or pimples on the scalp may indicate folliculitis or inflammation. Keep the scalp clean and avoid harsh products. If persistent, a dermatologist evaluation is recommended.",
            "Rötungen oder Pickel auf der Kopfhaut können auf Follikulitis oder Entzündung hinweisen. Halte die Kopfhaut sauber und vermeide aggressive Produkte. Bei Fortbestehen wird eine dermatologische Untersuchung empfohlen."
          )
        });
      }
    }

    if (breakage === "breakage" || breakage === "both") {
      items.push({
        icon: "info",
        text: t(
          "Hair breakage indicates damage to the hair shaft, often from heat styling, chemical treatments, or protein deficiency. Reducing heat use and ensuring adequate protein intake can help.",
          "Haarbruch deutet auf eine Schädigung des Haarschafts hin, oft durch Hitzestyling, chemische Behandlungen oder Proteinmangel. Reduziere Hitze und stelle ausreichende Proteinzufuhr sicher."
        )
      });
    }
    if (breakage === "shedding") {
      items.push({
        icon: "info",
        text: t(
          "You're experiencing shedding from the root, which points to a follicle-level issue rather than shaft damage. This is typically nutritional, hormonal, or stress-related.",
          "Du erlebst Haarausfall von der Wurzel, was auf ein Problem auf Follikel-Ebene hinweist, nicht auf Haarschaftschäden. Dies ist typischerweise ernährungs-, hormon- oder stressbedingt."
        )
      });
    }

    document.getElementById("scalpContent").innerHTML = renderInsightList(items);
  }

  /* ────────────────────────────────────────
     F. PERSONALIZED ROUTINE
     ──────────────────────────────────────── */
  function renderRoutine(d) {
    var steps = [];
    var ironRisk = riskLevel(scoreIron(d));
    var pattern = d.pattern || "";
    var breakage = d.breakage_vs_shedding || "";
    var symptoms = safeArr(d.scalp_symptoms);

    // Core steps
    steps.push(t(
      "<strong>Take your Hr² capsule daily</strong> — with a meal for best absorption. Consistency is key; most users see initial results within 8-12 weeks.",
      "<strong>Nimm täglich Deine Hr² Kapsel</strong> — zu einer Mahlzeit für beste Absorption. Konsistenz ist der Schlüssel; die meisten Nutzer sehen erste Ergebnisse innerhalb von 8-12 Wochen."
    ));

    steps.push(t(
      "<strong>Daily scalp massage (3-5 minutes)</strong> — use fingertips in circular motions. This increases blood flow to follicles and has been shown to increase hair thickness over time.",
      "<strong>Tägliche Kopfhautmassage (3-5 Minuten)</strong> — benutze die Fingerspitzen in kreisenden Bewegungen. Dies erhöht die Durchblutung der Follikel und kann die Haardicke über die Zeit erhöhen."
    ));

    steps.push(t(
      "<strong>Wash with lukewarm water</strong> — hot water strips natural oils and can increase shedding. Use a gentle, sulfate-free shampoo.",
      "<strong>Wasche mit lauwarmem Wasser</strong> — heißes Wasser entfernt natürliche Öle und kann den Haarausfall verstärken. Verwende ein sanftes, sulfatfreies Shampoo."
    ));

    // Conditional steps
    if (ironRisk !== "low") {
      steps.push(t(
        "<strong>Include iron-rich foods daily</strong> — red meat, spinach, lentils, or fortified cereals. Pair with vitamin C (citrus, bell pepper) to boost absorption by up to 300%.",
        "<strong>Iss täglich eisenreiche Lebensmittel</strong> — rotes Fleisch, Spinat, Linsen oder angereicherte Cerealien. Kombiniere mit Vitamin C (Zitrusfrüchte, Paprika) um die Absorption um bis zu 300% zu steigern."
      ));
    }

    if (symptoms.indexOf("dandruff") > -1 || symptoms.indexOf("itch") > -1) {
      steps.push(t(
        "<strong>Use an anti-dandruff shampoo 2-3x/week</strong> — look for zinc pyrithione or ketoconazole. Alternate with your regular gentle shampoo on other days.",
        "<strong>Verwende 2-3x/Woche ein Anti-Schuppen-Shampoo</strong> — achte auf Zinkpyrithion oder Ketoconazol. Wechsle an anderen Tagen mit Deinem normalen sanften Shampoo."
      ));
    }

    if (breakage === "breakage" || breakage === "both") {
      steps.push(t(
        "<strong>Minimize heat styling</strong> — if you must, always use a heat protectant. Air-dry when possible and avoid tight hairstyles that pull on the roots.",
        "<strong>Minimiere Hitzestyling</strong> — wenn nötig, verwende immer einen Hitzeschutz. Lufttrockne wenn möglich und vermeide enge Frisuren, die an den Wurzeln ziehen."
      ));
    }

    if (d.sun === "rarely") {
      steps.push(t(
        "<strong>Get 10-15 minutes of daily sun exposure</strong> — or supplement with vitamin D3. This supports follicle cycling and immune function.",
        "<strong>Bekomme 10-15 Minuten tägliche Sonnenexposition</strong> — oder supplementiere mit Vitamin D3. Dies unterstützt den Follikelzyklus und die Immunfunktion."
      ));
    }

    if (d.dieted === "yes") {
      steps.push(t(
        "<strong>Prioritize protein intake</strong> — aim for at least 1.2g per kg body weight daily. Hair is made of keratin (a protein), and inadequate intake directly impairs growth.",
        "<strong>Priorisiere Proteinzufuhr</strong> — ziele auf mindestens 1,2g pro kg Körpergewicht täglich. Haar besteht aus Keratin (einem Protein), und unzureichende Zufuhr beeinträchtigt das Wachstum direkt."
      ));
    }

    steps.push(t(
      "<strong>Track your progress</strong> — take a photo of your hair parting every 4 weeks under the same lighting. Small improvements are often hard to notice day-to-day.",
      "<strong>Verfolge Deinen Fortschritt</strong> — mache alle 4 Wochen ein Foto Deines Haarscheitels bei gleicher Beleuchtung. Kleine Verbesserungen sind im Alltag oft schwer zu erkennen."
    ));

    var html = '<ol class="routine-list">';
    steps.forEach(function (text, i) {
      html +=
        '<li class="routine-step">' +
        '<span class="routine-num">' + (i + 1) + "</span>" +
        "<span>" + text + "</span>" +
        "</li>";
    });
    html += "</ol>";

    document.getElementById("routineContent").innerHTML = html;
  }

  /* ────────────────────────────────────────
     G. PRODUCT RECOMMENDATION
     ──────────────────────────────────────── */
  function renderProduct(d) {
    var ironRisk = riskLevel(scoreIron(d));
    var pattern = d.pattern || "";
    var breakage = d.breakage_vs_shedding || "";
    var reason = d.reason || "";

    // Build reason text
    var reasons = [];
    if (pattern === "widening" || pattern === "receding") {
      reasons.push(t("DHT-blocking support for pattern hair loss", "DHT-blockierende Unterstützung bei erblichem Haarausfall"));
    }
    if (d.dieted === "yes") {
      reasons.push(t("stress and nutrient recovery after dieting", "Stress- und Nährstofferholung nach Diät"));
    }
    if (ironRisk !== "low") {
      reasons.push(t("enhanced iron absorption", "verbesserte Eisenabsorption"));
    }
    if (breakage === "breakage" || breakage === "both") {
      reasons.push(t("keratin strengthening for breakage", "Keratinstärkung bei Haarbruch"));
    }
    if (reasons.length === 0) {
      reasons.push(t("comprehensive hair follicle support", "umfassende Haarfollikelunterstützung"));
    }

    var reasonText = t(
      "Based on your profile, Hr² targets: " + reasons.join(", ") + ".",
      "Basierend auf Deinem Profil zielt Hr² auf: " + reasons.join(", ") + "."
    );

    document.getElementById("productReason").textContent = reasonText;

    // Ingredients with highlighting logic
    var ingredients = [
      {
        name: "AnaGain™",
        desc: t("stimulates hair growth signaling pathways", "stimuliert Haarwachstums-Signalwege"),
        highlight: true
      },
      {
        name: "Biotin",
        desc: t("supports keratin production", "unterstützt Keratinproduktion"),
        highlight: true
      },
      {
        name: "Saw Palmetto",
        desc: t("natural DHT inhibitor", "natürlicher DHT-Hemmer"),
        highlight: pattern === "widening" || pattern === "receding"
      },
      {
        name: "Ashwagandha",
        desc: t("adaptogen for stress-related shedding", "Adaptogen bei stressbedingtem Haarausfall"),
        highlight: d.dieted === "yes" || reason === "losing"
      },
      {
        name: "L-Cysteine",
        desc: t("building block for hair keratin", "Baustein für Haar-Keratin"),
        highlight: breakage === "breakage" || breakage === "both"
      },
      {
        name: "L-Lysine",
        desc: t("enhances iron & zinc absorption", "verbessert Eisen- & Zinkabsorption"),
        highlight: ironRisk !== "low"
      },
      {
        name: t("Zinc & Selenium", "Zink & Selen"),
        desc: t("essential trace minerals for follicle health", "essentielle Spurenelemente für Follikelgesundheit"),
        highlight: d.diet === "vegan" || d.diet === "vegetarian"
      },
      {
        name: t("Vitamin Complex (D3, B12, Folate)", "Vitaminkomplex (D3, B12, Folat)"),
        desc: t("supports hair cycling and cell division", "unterstützt Haarzyklus und Zellteilung"),
        highlight: riskLevel(scoreVitD(d)) !== "low" || riskLevel(scoreB12(d)) !== "low"
      }
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

  /* ────────────────────────────────────────
     H. NEXT STEPS
     ──────────────────────────────────────── */
  function renderNextSteps(d) {
    var items = [];
    var ironRisk = riskLevel(scoreIron(d));
    var vitdRisk = riskLevel(scoreVitD(d));
    var b12Risk = riskLevel(scoreB12(d));

    // Blood tests
    var tests = [];
    if (ironRisk !== "low") tests.push(t("Serum Ferritin", "Serum-Ferritin"));
    if (vitdRisk !== "low") tests.push(t("25-OH Vitamin D", "25-OH Vitamin D"));
    if (b12Risk !== "low") tests.push(t("Vitamin B12, TSH, Free T4", "Vitamin B12, TSH, freies T4"));

    if (tests.length > 0) {
      items.push({
        icon: "info",
        text: t(
          "Schedule a blood test for: " + tests.join(", ") + ". Share the results with your healthcare provider.",
          "Plane einen Bluttest für: " + tests.join(", ") + ". Teile die Ergebnisse mit Deinem Arzt."
        )
      });
    }

    if (d.pattern === "patchy") {
      items.push({
        icon: "warn",
        text: t(
          "Book an appointment with a dermatologist for clinical evaluation of patchy hair loss.",
          "Vereinbare einen Termin bei einem Dermatologen zur klinischen Untersuchung des fleckigen Haarausfalls."
        )
      });
    }

    items.push({
      icon: "info",
      text: t(
        "Start your Hr² routine today and stay consistent for at least 12 weeks. Hair growth cycles take time, so patience is key.",
        "Starte Deine Hr² Routine heute und bleibe mindestens 12 Wochen konsistent. Haarwachstumszyklen brauchen Zeit, also sei geduldig."
      )
    });

    items.push({
      icon: "ok",
      text: t(
        "Take a baseline photo of your hair today, then repeat every 4 weeks to track your progress objectively.",
        "Mache heute ein Baseline-Foto Deiner Haare, dann wiederhole alle 4 Wochen, um Deinen Fortschritt objektiv zu verfolgen."
      )
    });

    if (d.sex === "female" && (d.cycles === "irregular" || d.postpartum === "yes")) {
      items.push({
        icon: "info",
        text: t(
          "Discuss your hormonal health with your provider — hormonal factors may be contributing to your hair loss and can be addressed alongside nutritional support.",
          "Besprich Deine hormonelle Gesundheit mit Deinem Arzt — hormonelle Faktoren könnten zu Deinem Haarausfall beitragen und können neben der Nährstoffunterstützung behandelt werden."
        )
      });
    }

    document.getElementById("nextStepsContent").innerHTML = renderInsightList(items);
  }
})();
