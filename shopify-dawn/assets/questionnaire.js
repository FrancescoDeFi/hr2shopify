(function () {
  "use strict";

  /* ── State ── */
  var answers = {};
  var history = [];

  /* ── Screen order (full flow) ── */
  var fullFlow = [
    "intro","q1","q2","q3","q4","q5","q6","q7","q8","q9","q10","q11","q12","q13","q14","upload","email","review"
  ];

  /* If user picks "no-loss" on Q1 → skip triage (Q2-Q6) and jump to Q7 */
  var skipTriageFlow = [
    "intro","q1","q7","q8","q9","q10","q11","q12","q13","q14","upload","email","review"
  ];

  function getFlow() {
    return answers.reason === "no-loss" ? skipTriageFlow : fullFlow;
  }

  /* ── DOM helpers ── */
  var wrapper = document.getElementById("quizWrapper");
  var progressBar = document.getElementById("quizProgress");
  var backBtn = document.getElementById("quizBack");

  function allScreens() {
    return wrapper.querySelectorAll(".quiz-screen");
  }

  function currentScreen() {
    return wrapper.querySelector(".quiz-screen.active");
  }

  function screenByName(name) {
    return wrapper.querySelector('[data-screen="' + name + '"]');
  }

  /* ── Hide site header/footer ── */
  document.body.classList.add("quiz-active");

  /* ── Progress ── */
  function updateProgress() {
    var flow = getFlow();
    var cur = currentScreen();
    var name = cur ? cur.getAttribute("data-screen") : "intro";
    var idx = flow.indexOf(name);
    if (idx < 0) idx = 0;
    var pct = Math.round((idx / (flow.length - 1)) * 100);
    progressBar.style.width = pct + "%";
  }

  /* ── Navigate ── */
  function goTo(screenName) {
    var cur = currentScreen();
    if (cur) {
      var curName = cur.getAttribute("data-screen");
      if (curName !== screenName) history.push(curName);
      cur.classList.remove("active");
    }
    var next = screenByName(screenName);
    if (next) {
      next.classList.remove("active");
      // Force reflow for animation
      void next.offsetWidth;
      next.classList.add("active");
    }
    backBtn.classList.toggle("visible", history.length > 0 && screenName !== "review");
    updateProgress();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goNext() {
    var flow = getFlow();
    var cur = currentScreen();
    var name = cur ? cur.getAttribute("data-screen") : "intro";
    var idx = flow.indexOf(name);
    if (idx >= 0 && idx < flow.length - 1) {
      goTo(flow[idx + 1]);
    }
  }

  function goBack() {
    if (history.length === 0) return;
    var prev = history.pop();
    var cur = currentScreen();
    if (cur) cur.classList.remove("active");
    var prevScreen = screenByName(prev);
    if (prevScreen) {
      prevScreen.classList.remove("active");
      void prevScreen.offsetWidth;
      prevScreen.classList.add("active");
    }
    backBtn.classList.toggle("visible", history.length > 0);
    updateProgress();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ── Start button ── */
  document.getElementById("quizStart").addEventListener("click", function () {
    goNext();
  });

  /* ── Back button ── */
  backBtn.addEventListener("click", goBack);

  /* ── Single-choice options: auto-advance ── */
  wrapper.addEventListener("click", function (e) {
    var option = e.target.closest(".quiz-option");
    if (!option) return;

    var container = option.closest(".quiz-options");
    if (!container) return;

    var type = container.getAttribute("data-type");
    var key = container.getAttribute("data-key");

    if (type === "single") {
      container.querySelectorAll(".quiz-option").forEach(function (o) {
        o.classList.remove("selected");
      });
      option.classList.add("selected");
      answers[key] = option.getAttribute("data-value");

      /* Show/hide conditional female questions */
      if (key === "sex") {
        var femBlock = document.getElementById("femaleQuestions");
        if (femBlock) {
          femBlock.classList.toggle("visible", option.getAttribute("data-value") === "female");
        }
        return; /* Don't auto-advance from sex selection inside Q7 */
      }

      /* Don't auto-advance if inside the personal info screen (nested options) */
      var screen = option.closest(".quiz-screen");
      if (screen && screen.getAttribute("data-screen") === "q7") return;

      /* Auto-advance after short delay for single-choice top-level questions */
      setTimeout(goNext, 350);

    } else if (type === "multi") {
      var isExclusive = option.getAttribute("data-exclusive") === "true";
      if (isExclusive) {
        /* "None" deselects everything else */
        container.querySelectorAll(".quiz-option").forEach(function (o) {
          o.classList.remove("selected");
        });
        option.classList.add("selected");
      } else {
        /* Deselect "None" if selecting something else */
        var noneOpt = container.querySelector('[data-exclusive="true"]');
        if (noneOpt) noneOpt.classList.remove("selected");
        option.classList.toggle("selected");
      }
      /* Collect values */
      var vals = [];
      container.querySelectorAll(".quiz-option.selected").forEach(function (o) {
        vals.push(o.getAttribute("data-value"));
      });
      answers[key] = vals;
    }
  });

  /* ── Grid radios (yes/no/not-sure) ── */
  wrapper.addEventListener("click", function (e) {
    var radio = e.target.closest(".grid-radio");
    if (!radio) return;

    var row = radio.closest(".quiz-grid-row");
    var grid = radio.closest(".quiz-grid");
    if (!row || !grid) return;

    var key = grid.getAttribute("data-key");
    var item = row.getAttribute("data-item");
    var val = radio.getAttribute("data-val");

    /* Deselect siblings */
    row.querySelectorAll(".grid-radio").forEach(function (r) {
      r.classList.remove("selected");
    });
    radio.classList.add("selected");

    if (!answers[key]) answers[key] = {};
    answers[key][item] = val;
  });

  /* ── Validation helpers ── */
  function validateScreen(screen) {
    if (!screen) return false;
    var name = screen.getAttribute("data-screen");

    /* Multi-choice screens (Q5, Q11): at least one option selected */
    var multiContainer = screen.querySelector('.quiz-options[data-type="multi"]');
    if (multiContainer) {
      return multiContainer.querySelectorAll(".quiz-option.selected").length > 0;
    }

    /* Grid screens (Q12, Q13, Q14): every row must have a selection */
    var grid = screen.querySelector(".quiz-grid");
    if (grid) {
      var rows = grid.querySelectorAll(".quiz-grid-row");
      var answered = grid.querySelectorAll(".quiz-grid-row:has(.grid-radio.selected)");
      return rows.length > 0 && rows.length === answered.length;
    }

    /* Q7: require sex selection */
    if (name === "q7") {
      return !!answers.sex;
    }

    return true;
  }

  function updateNextButton(screen) {
    if (!screen) return;
    var btn = screen.querySelector("[data-next]");
    if (!btn) return;
    btn.disabled = !validateScreen(screen);
  }

  /* ── Initialize all data-next buttons as disabled ── */
  wrapper.querySelectorAll("[data-next]").forEach(function (btn) {
    btn.disabled = true;
    btn.addEventListener("click", goNext);
  });

  /* Re-validate after option clicks (multi-choice) */
  wrapper.addEventListener("click", function (e) {
    var option = e.target.closest(".quiz-option");
    if (option) {
      var screen = option.closest(".quiz-screen");
      if (screen) setTimeout(function () { updateNextButton(screen); }, 0);
    }
  });

  /* Re-validate after grid radio clicks */
  wrapper.addEventListener("click", function (e) {
    var radio = e.target.closest(".grid-radio");
    if (radio) {
      var screen = radio.closest(".quiz-screen");
      if (screen) setTimeout(function () { updateNextButton(screen); }, 0);
    }
  });

  /* ── Q7 Continue (validate age + sex) ── */
  var q7Next = document.getElementById("q7Next");
  if (q7Next) {
    q7Next.disabled = true;
    q7Next.addEventListener("click", function (e) {
      var ageInput = document.getElementById("qAge");
      var age = ageInput ? ageInput.value.trim() : "";
      if (age) answers.age = age;
      if (!answers.sex) {
        e.stopImmediatePropagation();
        return;
      }
    });
  }

  /* Re-validate Q7 when sex is selected (listen for answer changes) */
  var q7Screen = screenByName("q7");
  if (q7Screen) {
    q7Screen.addEventListener("click", function (e) {
      if (e.target.closest(".quiz-option")) {
        setTimeout(function () { updateNextButton(q7Screen); }, 0);
      }
    });
  }

  /* ── Photo upload ── */
  var uploadArea = document.getElementById("uploadArea");
  var hairPhotoInput = document.getElementById("hairPhotoInput");
  var uploadPreview = document.getElementById("uploadPreview");
  var uploadPlaceholder = document.getElementById("uploadPlaceholder");
  var uploadRemove = document.getElementById("uploadRemove");
  var uploadNextBtn = document.getElementById("uploadNext");
  var uploadSkipBtn = document.getElementById("uploadSkip");

  uploadArea.addEventListener("click", function (e) {
    if (e.target.closest("#uploadRemove")) return;
    hairPhotoInput.click();
  });

  hairPhotoInput.addEventListener("change", function () {
    var file = hairPhotoInput.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (e) {
      answers.hair_photo = e.target.result;
      uploadPreview.src = e.target.result;
      uploadPreview.style.display = "block";
      uploadPlaceholder.style.display = "none";
      uploadRemove.style.display = "flex";
    };
    reader.readAsDataURL(file);
  });

  uploadRemove.addEventListener("click", function (e) {
    e.stopPropagation();
    answers.hair_photo = null;
    hairPhotoInput.value = "";
    uploadPreview.style.display = "none";
    uploadPreview.src = "";
    uploadPlaceholder.style.display = "flex";
    uploadRemove.style.display = "none";
  });

  uploadNextBtn.addEventListener("click", function () { goNext(); });
  uploadSkipBtn.addEventListener("click", function () { goNext(); });

  /* ── Email submit ── */
  document.getElementById("quizSubmitEmail").addEventListener("click", function () {
    var emailInput = document.getElementById("qEmail");
    var emailError = document.getElementById("emailError");
    var email = emailInput.value.trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      emailInput.classList.add("error");
      emailError.style.display = "block";
      return;
    }

    emailInput.classList.remove("error");
    emailError.style.display = "none";
    answers.email = email;

    /* Send data to Shopify (create customer or use contact form endpoint) */
    submitQuizData(answers);

    goTo("review");
    backBtn.classList.remove("visible");
  });

  /* ── Submit to backend ── */
  function submitQuizData(data) {
    /* 1) Send to Supabase */
    if (window.supabase) {
      var payload = {
        email: data.email,
        reason: data.reason,
        onset_time: data.onset_time,
        onset_type: data.onset_type,
        pattern: data.pattern,
        scalp_symptoms: data.scalp_symptoms,
        breakage_vs_shedding: data.breakage_vs_shedding,
        age: data.age ? parseInt(data.age) : null,
        sex: data.sex,
        pregnant: data.pregnant,
        postpartum: data.postpartum,
        cycles: data.cycles,
        bleeding: data.bleeding,
        diet: data.diet,
        dieted: data.dieted,
        sun: data.sun,
        exclusions: data.exclusions,
        iron_symptoms: data.iron_symptoms,
        vitd_symptoms: data.vitd_symptoms,
        b12_symptoms: data.b12_symptoms,
        hair_photo: data.hair_photo || null,
        full_data: data
      };

      window.supabase.insert("questionnaire_submissions", payload)
        .then(function (result) {
          console.log("Questionnaire submitted to Supabase:", result);
        })
        .catch(function (error) {
          console.error("Error submitting to Supabase:", error);
          /* Fallback: store locally if Supabase fails */
          try {
            var stored = JSON.parse(localStorage.getItem("quiz_submissions") || "[]");
            stored.push({ timestamp: new Date().toISOString(), data: data });
            localStorage.setItem("quiz_submissions", JSON.stringify(stored));
          } catch (e) { /* silent */ }
        });
    }

    /* 2) Klaviyo if available */
    if (window._learnq) {
      window._learnq.push(["identify", {
        "$email": data.email,
        "Quiz Reason": data.reason || "",
        "Quiz Data": JSON.stringify(data)
      }]);
      window._learnq.push(["track", "Hair Quiz Completed", data]);
    }
  }

  /* ── Initial state ── */
  updateProgress();
})();
